import { useMemo } from "react";
import { convertMarkerToCoord } from "../mapUtils";
import { APIMarker, IMarker } from "../types";
import { DbMapData } from "@/types/mapTypes";

export function useDisplayedMarkers(
  markers: APIMarker[],
  markersWithinRadius: APIMarker[],
  dbMapData: DbMapData,
  enableClick: boolean,
  selectedPoint: APIMarker,
  hideVisited: boolean,
): IMarker[] {
  return useMemo(() => {
    const base = enableClick
      ? markersWithinRadius
      : markers.filter(m => dbMapData.visibleCategories[m.BlueprintType]);
    return [
      ...(enableClick ? [convertMarkerToCoord(selectedPoint, dbMapData.visitedMarkers)] : []),
      ...base.map((m) => convertMarkerToCoord(m, dbMapData.visitedMarkers))
        .filter(m => !hideVisited || !dbMapData.visitedMarkers[m.id as number]),
    ]
  }, [markers, markersWithinRadius, dbMapData.visibleCategories, hideVisited, enableClick, selectedPoint, dbMapData.visitedMarkers]);
}