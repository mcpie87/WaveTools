import { useMemo } from "react";
import { IMarker } from "../types";
import { DbMapData } from "@/types/mapTypes";

import { isMarkerVisible } from "../state/map.selectors";

export function useDisplayedMarkers(
  markers: IMarker[],
  markersWithinRadius: IMarker[],
  dbMapData: DbMapData,
  enableClick: boolean,
  selectedPoint: IMarker,
  hideVisited: boolean,
): IMarker[] {
  return useMemo(() => {
    const base = enableClick
      ? markersWithinRadius
      : markers.filter((m) => isMarkerVisible(dbMapData, m, hideVisited));

    return [
      ...(enableClick ? [selectedPoint] : []),
      ...base,
    ]
  }, [markers, markersWithinRadius, hideVisited, enableClick, selectedPoint, dbMapData]);
}