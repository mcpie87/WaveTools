import { useMemo } from "react";
import { APIMarker } from "../types";
import { DbMapData } from "@/types/mapTypes";
import { QueryCategories } from "../TranslationMaps/Puzzles";

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

    // Query-based categories
    for (const [key, qcat] of Object.entries(QueryCategories)) {
      const matching = markers.filter(qcat.query);
      if (matching.length === 0) continue;
      const visited = matching.filter(m => isMarkerVisited(dbMapData, m.Id as number)).length;
      counts[key] = [matching.length, visited];
    }

    return Object.entries(counts)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([k, v]) => [k, v[0], v[1]]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers, dbMapData.visitedMarkers]);
}