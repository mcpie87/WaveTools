import { SelectedMap } from "@/types/mapTypes";
import { APIMarker } from "../types";
import { useMemo } from "react";
import { __ALL_MAPS__, __ALL_MAPS_BUT_DEFINED__, __ALL_MAPS_BUT_TEST_DUNGEON__, __ALL_MAPS_BUT_WORLD_MAP_AND_TEST__, __DUNGEONS_ONLY__, __WORLD_MAPS__, isGameCoordInGameBounds, mainStoryDungeonMapConfigs, mapConfigs, sonoroDungeonMapConfigs, storyDungeonMapConfigs, testDungeonMapConfigs, unionMapConfigs } from "../mapUtils";

export function useFilteredMarkers(
  data: APIMarker[],
  selectedMap: SelectedMap,
  selectedMapId: number | null
) {
  return useMemo(() => {
    const definedMapIds = new Set(Object.values(unionMapConfigs).map(c => c.mapId));
    const worldMapIds = new Set(Object.values(mapConfigs).map(c => c.mapId));
    const msqMapIds = new Set(Object.values(mainStoryDungeonMapConfigs).map(c => c.mapId));
    const storyMapIds = new Set(Object.values(storyDungeonMapConfigs).map(c => c.mapId));
    const sonoroMapIds = new Set(Object.values(sonoroDungeonMapConfigs).map(c => c.mapId));
    const testMapIds = new Set(Object.values(testDungeonMapConfigs).map(c => c.mapId));

    const dungeonIds = new Set([...msqMapIds, ...storyMapIds, ...sonoroMapIds]);

    return data.filter(marker => {
      // Step A: Determine if the marker belongs to the selected map scope
      let isMapMatch = false;

      if (selectedMapId !== null) {
        isMapMatch = marker.MapId === selectedMapId;
      } else if (selectedMap === __ALL_MAPS__) {
        isMapMatch = true;
      } else if (selectedMap === __ALL_MAPS_BUT_DEFINED__) {
        isMapMatch = !definedMapIds.has(marker.MapId);
      } else if (selectedMap === __WORLD_MAPS__) {
        isMapMatch = worldMapIds.has(marker.MapId);
      } else if (selectedMap === __DUNGEONS_ONLY__) {
        isMapMatch = dungeonIds.has(marker.MapId);
      } else if (selectedMap === __ALL_MAPS_BUT_WORLD_MAP_AND_TEST__) {
        isMapMatch = !worldMapIds.has(marker.MapId) && !testMapIds.has(marker.MapId);
      } else if (selectedMap === __ALL_MAPS_BUT_TEST_DUNGEON__) {
        isMapMatch = !Object.values(testDungeonMapConfigs).map(c => c.mapId).includes(marker.MapId);
      } else {
        const config = unionMapConfigs[selectedMap];
        isMapMatch = marker.MapId === config?.mapId;
      }

      if (!isMapMatch) return false;

      // Step B: Bounds check (Only if MapMatch is true)
      return isGameCoordInGameBounds(
        selectedMap,
        marker.Transform[0].X,
        marker.Transform[0].Y
      );
    });
  }, [data, selectedMap, selectedMapId]);
}