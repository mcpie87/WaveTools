import { useMemo } from "react";
import { IMarker } from "../types";
import { DbMapData } from "@/types/mapTypes";
import { getMatchedTrackableCategories, QueryCategories } from "../TranslationMaps/translationMap";
import { getMarkerRealId } from "../mapUtils";

export function useMapCategoryStats(
  markers: IMarker[],
  dbMapData: DbMapData,
): Array<[string, number, number]> {
  return useMemo(() => {
    const counts: Record<string, [number, number]> = {};
    for (const m of markers) {
      const matched = getMatchedTrackableCategories(m);
      const entityKey = getMarkerRealId(m);
      const visitedSet = dbMapData.visitedEntities[entityKey];

      for (const cat of matched) {
        const key = cat.dictKey || cat.name;
        if (!counts[key]) {
          counts[key] = [0, 0];
        }

        counts[key][0] += 1;
        if (visitedSet && visitedSet.has(cat.key)) {
          counts[key][1] += 1;
        }
      }
    }

    return Object.entries(counts)
      .sort((a, b) => a[0].localeCompare(b[0]))
      .map(([k, v]) => [k, v[0], v[1]]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers, dbMapData.visitedEntities]);
}