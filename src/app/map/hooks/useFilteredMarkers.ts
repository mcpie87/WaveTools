import { MarkerIndexes } from "../hooks/useMapData";
import { SelectedMap } from "@/types/mapTypes";
import { APIMarker } from "../types";
import { useMemo } from "react";
import { BBox } from "rbush";
import {
  __ALL_MAPS__,
  __ALL_MAPS_BUT_DEFINED__,
  __ALL_MAPS_BUT_TEST_DUNGEON__,
  __ALL_MAPS_BUT_WORLD_MAP_AND_TEST__,
  __DUNGEONS_ONLY__,
  __WORLD_MAPS__,
  getGameBounds,
  mainStoryDungeonMapConfigs,
  mapConfigs,
  sonoroDungeonMapConfigs,
  storyDungeonMapConfigs,
  testDungeonMapConfigs,
  unionMapConfigs,
  UnionMapName,
} from "../mapUtils";

const definedMapIds = new Set(Object.values(unionMapConfigs).map(c => c.mapId));
const worldMapIds = new Set(Object.values(mapConfigs).map(c => c.mapId));
const msqMapIds = new Set(Object.values(mainStoryDungeonMapConfigs).map(c => c.mapId));
const storyMapIds = new Set(Object.values(storyDungeonMapConfigs).map(c => c.mapId));
const sonoroMapIds = new Set(Object.values(sonoroDungeonMapConfigs).map(c => c.mapId));
const testMapIds = new Set(Object.values(testDungeonMapConfigs).map(c => c.mapId));
const dungeonIds = new Set([...msqMapIds, ...storyMapIds, ...sonoroMapIds]);

function buildMapIdPredicate(
  selectedMap: SelectedMap,
  selectedMapId: number | null
): (mapId: number) => boolean {
  if (selectedMapId !== null) return (id) => id === selectedMapId;
  if (selectedMap === __ALL_MAPS__) return () => true;
  if (selectedMap === __ALL_MAPS_BUT_DEFINED__) return (id) => !definedMapIds.has(id);
  if (selectedMap === __WORLD_MAPS__) return (id) => worldMapIds.has(id);
  if (selectedMap === __DUNGEONS_ONLY__) return (id) => dungeonIds.has(id);
  if (selectedMap === __ALL_MAPS_BUT_WORLD_MAP_AND_TEST__) return (id) => !worldMapIds.has(id) && !testMapIds.has(id);
  if (selectedMap === __ALL_MAPS_BUT_TEST_DUNGEON__) return (id) => !testMapIds.has(id);
  const config = unionMapConfigs[selectedMap];
  if (config?.mapId != null) return (id) => id === config.mapId;
  return () => true;
}

export function useFilteredMarkers(
  indexes: MarkerIndexes | null,
  selectedMap: SelectedMap,
  selectedMapId: number | null,
): APIMarker[] {
  return useMemo(() => {
    if (!indexes) return [];

    const matchesMapId = buildMapIdPredicate(selectedMap, selectedMapId);
    const results: APIMarker[] = [];

    for (const [mapId, tree] of indexes.spatial) {
      if (!matchesMapId(mapId)) continue;

      // resolve the map name for this mapId to get its game bounds
      const mapName = Object.entries(unionMapConfigs).find(
        ([, config]) => config.mapId === mapId
      )?.[0] as UnionMapName | undefined;

      if (mapName) {
        const gameBounds = getGameBounds(mapName);
        if (gameBounds) {
          // y is reversed — bounds[0][1] is min, bounds[0][0] is max
          const bbox: BBox = {
            minX: gameBounds[1][0],
            maxX: gameBounds[1][1],
            minY: gameBounds[0][1],
            maxY: gameBounds[0][0],
          };
          for (const { marker } of tree.search(bbox)) {
            results.push(marker);
          }
          continue;
        }
      }

      // no bounds config (custom map etc.) — return everything in the tree
      for (const { marker } of tree.all()) {
        results.push(marker);
      }
    }

    return results;
  }, [indexes, selectedMap, selectedMapId]);
}