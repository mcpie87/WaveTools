import { DbMapData } from "@/types/mapTypes";
import { IMarker } from "../types";
import { getMatchedTrackableCategories, getTrackingKey } from "../TranslationMaps/translationMap";
import { getMarkerRealId } from "../mapUtils";

export const isCategoryVisible = (
  state: DbMapData,
  category: string
) => !!state.visibleCategories[category];

export const isMarkerVisible = (
  state: DbMapData,
  m: IMarker,
  hideVisited: boolean
) => {
  const entityKey = getMarkerRealId(m);
  const visitedSet = state.visitedEntities[entityKey];

  if (state.visibleCategories[m.category]) {
    const trackingKey = getTrackingKey(m.category);
    const isVisited = (visitedSet !== undefined && visitedSet.has(trackingKey));
    if (!hideVisited || !isVisited) return true;
  }

  const matched = getMatchedTrackableCategories(m);
  for (let i = 0; i < matched.length; i++) {
    const match = matched[i];
    if (match.dictKey && state.visibleCategories[match.dictKey]) {
      const isVisited = (visitedSet !== undefined && visitedSet.has(match.key));
      if (!hideVisited || !isVisited) return true;
    }
  }

  return false;
};

export const isMarkerFullyVisited = (state: DbMapData, m: IMarker) => {
  const entityKey = getMarkerRealId(m);
  const visitedSet = state.visitedEntities[entityKey];
  if (!visitedSet) return false;

  const matched = getMatchedTrackableCategories(m);
  return matched.length > 0 && matched.every(c => visitedSet.has(c.key));
};