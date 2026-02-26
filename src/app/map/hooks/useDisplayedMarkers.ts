import { useMemo } from "react";
import { convertMarkerToCoord } from "../mapUtils";
import { APIMarker, IMarker } from "../types";
import { DbMapData } from "@/types/mapTypes";
import { QueryCategories } from "../TranslationMaps/Puzzles";

export function useDisplayedMarkers(
  markers: APIMarker[],
  markersWithinRadius: APIMarker[],
  dbMapData: DbMapData,
  enableClick: boolean,
  selectedPoint: APIMarker,
  hideVisited: boolean,
): IMarker[] {
  return useMemo(() => {
    const isVisible = (m: APIMarker): boolean => {
      // existing BlueprintType-based check
      if (dbMapData.visibleCategories[m.BlueprintType]) return true;

      // query-based categories
      for (const [key, category] of Object.entries(QueryCategories)) {
        if (dbMapData.visibleCategories[key] && m.ComponentsData && category.query(m.ComponentsData)) return true;
      }

      return false;
    };

    const base = enableClick
      ? markersWithinRadius
      : markers.filter(isVisible);
    return [
      ...(enableClick ? [convertMarkerToCoord(selectedPoint, dbMapData.visitedMarkers)] : []),
      ...base.map((m) => convertMarkerToCoord(m, dbMapData.visitedMarkers))
        .filter(m => !hideVisited || !dbMapData.visitedMarkers[m.id as number]),
    ]
  }, [markers, markersWithinRadius, dbMapData.visibleCategories, hideVisited, enableClick, selectedPoint, dbMapData.visitedMarkers]);
}