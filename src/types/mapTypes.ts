import { __ALL_MAPS__, DungeonName, MapName } from "@/app/map/mapUtils";

export interface DbMapData {
  visibleCategories: Record<string, boolean>,
  visitedMarkers: Record<number, boolean>,
  displayedCategoryGroups: Record<string, boolean>,
}

export type SelectedMap = MapName | DungeonName | typeof __ALL_MAPS__;