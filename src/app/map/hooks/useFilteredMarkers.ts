import { SelectedMap } from "@/types/mapTypes";
import { APIMarker } from "../types";
import { useMemo } from "react";
import { __ALL_MAPS__, __ALL_MAPS_BUT_DEFINED__, __ALL_MAPS_BUT_TEST_DUNGEON__, isGameCoordInGameBounds, testDungeonMapConfigs, unionMapConfigs } from "../mapUtils";

export function useFilteredMarkers(
  data: APIMarker[],
  selectedMap: SelectedMap,
  selectedMapId: number | null
) {
  return useMemo(() => {
    const definedMapIds = Object.values(unionMapConfigs).map(c => c.mapId);

    return data.filter(marker => {
      // Step A: Determine if the marker belongs to the selected map scope
      let isMapMatch = false;

      if (selectedMapId !== null) {
        isMapMatch = marker.MapId === selectedMapId;
      } else if (selectedMap === __ALL_MAPS__) {
        isMapMatch = true;
      } else if (selectedMap === __ALL_MAPS_BUT_DEFINED__) {
        isMapMatch = !definedMapIds.includes(marker.MapId);
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