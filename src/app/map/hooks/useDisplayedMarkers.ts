import { useMemo } from "react";
import { IMarker } from "../types";
import { DbMapData } from "@/types/mapTypes";
import { QueryCategories } from "../TranslationMaps/Puzzles";

export function useDisplayedMarkers(
  markers: IMarker[],
  markersWithinRadius: IMarker[],
  dbMapData: DbMapData,
  enableClick: boolean,
  selectedPoint: IMarker,
  hideVisited: boolean,
): IMarker[] {
  return useMemo(() => {
    const isVisible = (m: IMarker): boolean => {
      // if (m.mapMark?.icon) return true;

      // existing BlueprintType-based check
      if (dbMapData.visibleCategories[m.category]) return true;

      // query-based categories
      for (const [key, category] of Object.entries(QueryCategories)) {
        if (dbMapData.visibleCategories[key]) {
          if (category.query(m)) return true;
        }
      }

      return false;
    };

    const base = enableClick
      ? markersWithinRadius
      : markers.filter(isVisible);

    return [
      ...(enableClick ? [selectedPoint] : []),
      ...base.filter(m => !hideVisited || !dbMapData.visitedMarkers[m.id as number]),
    ]
  }, [markers, markersWithinRadius, dbMapData.visibleCategories, hideVisited, enableClick, selectedPoint, dbMapData.visitedMarkers]);
}