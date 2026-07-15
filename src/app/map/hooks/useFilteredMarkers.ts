import { MarkerIndexes } from "../hooks/useMapData";
import { SelectedMap } from "@/types/mapTypes";
import { APIMarker, IMarker } from "../types";
import { useMemo } from "react";
import { BBox } from "rbush";
import {
  __ALL_MAPS__,
  __ALL_MAPS_BUT_DEFINED__,
  __ALL_MAPS_BUT_TEST_DUNGEON__,
  __ALL_MAPS_BUT_WORLD_MAP_AND_TEST__,
  __DUNGEONS_ONLY__,
  __WORLD_MAPS__,
  convertMarkerToCoord,
  getGameBounds,
  mainStoryDungeonMapConfigs,
  mapConfigs,
  sonoroDungeonMapConfigs,
  storyDungeonMapConfigs,
  testDungeonMapConfigs,
  unionMapConfigs,
  QuestFilter,
  __DISPLAY_ALL__,
  __DISPLAY_LEVELPLAY_ONLY__,
  __DISPLAY_NO_QUEST_NO_LEVELPLAY__,
  __DISPLAY_QUEST_AND_LEVELPLAY_ONLY__,
  __DISPLAY_QUEST_ONLY__,
  __DISPLAY_NO_QUEST__,
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
  questFilter: QuestFilter,
): IMarker[] {
  return useMemo(() => {
    if (!indexes) return [];

    const matchesMapId = buildMapIdPredicate(selectedMap, selectedMapId);
    const results: APIMarker[] = [];

    for (const [mapId, tree] of indexes.spatial) {
      if (!matchesMapId(mapId)) continue;

      if (selectedMap) {
        const gameBounds = getGameBounds(selectedMap);
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

    const parsedMarkers = results.map(m => convertMarkerToCoord(m, {}));
    const isQuestRelated = (m: IMarker) => !!(m.questChildren || m.questReferences);
    const isLevelPlayRelated = (m: IMarker) => !!(m.levelPlayChildren || m.levelPlayReferences);
    return parsedMarkers.filter(m => {
      if (questFilter === __DISPLAY_ALL__) return true;
      if (questFilter === __DISPLAY_QUEST_ONLY__) return isQuestRelated(m);
      if (questFilter === __DISPLAY_LEVELPLAY_ONLY__) return isLevelPlayRelated(m);
      if (questFilter === __DISPLAY_QUEST_AND_LEVELPLAY_ONLY__) return isQuestRelated(m) || isLevelPlayRelated(m);
      if (questFilter === __DISPLAY_NO_QUEST__) return !isQuestRelated(m);
      if (questFilter === __DISPLAY_NO_QUEST_NO_LEVELPLAY__) return !isQuestRelated(m) && !isLevelPlayRelated(m);
      return true;
    });
  }, [indexes, selectedMap, selectedMapId, questFilter]);
}