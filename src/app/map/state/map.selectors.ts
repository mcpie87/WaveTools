import { DbMapData } from "@/types/mapTypes";
import { IMarker } from "../types";
import { QueryCategories } from "../TranslationMaps/translationMap";

export const isMarkerVisited = (
  state: DbMapData,
  id: number
) => !!state.visitedMarkers[id];

export const isCategoryVisible = (
  state: DbMapData,
  category: string
) => !!state.visibleCategories[category];

export const isMarkerVisible = (
  state: DbMapData,
  m: IMarker
) => {
  if (state.visibleCategories[m.category]) return true;

  for (const [key, category] of Object.entries(QueryCategories)) {
    if (state.visibleCategories[key]) {
      if (category.query(m)) return true;
    }
  }

  return false;
};