import { useMemo } from "react";
import { APIMarker } from "../types";
import { DbMapData } from "@/types/mapTypes";

export function useMapCategoryStats(
  markers: APIMarker[],
  dbMapData: DbMapData,
  isMarkerVisited: (dbMapData: DbMapData, markerId: number) => boolean,
): Array<[string, number, number]> {
  return useMemo(() => {
    const counts: Record<string, [number, number]> = {};
    for (const m of markers) {
      const key = m.BlueprintType;
      if (!counts[key]) {
        counts[key] = [0, 0];
      }

      counts[key][0] += 1;
      if (isMarkerVisited(dbMapData, m.Id as number)) {
        counts[key][1] += 1;
      }
    }
    return Object.entries(counts)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([k, v]) => [k, v[0], v[1]]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers, dbMapData.visitedMarkers]);
}