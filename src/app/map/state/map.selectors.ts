import { DbMapData } from "@/types/mapTypes";

export const isMarkerVisited = (
  state: DbMapData,
  id: number
) => !!state.visitedMarkers[id];

export const isCategoryVisible = (
  state: DbMapData,
  category: string
) => !!state.visibleCategories[category];