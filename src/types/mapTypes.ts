import { __ALL_MAPS__, __ALL_MAPS_BUT_DEFINED__, __ALL_MAPS_BUT_DEFINED_AND_TEST_DUNGEON__, __ALL_MAPS_BUT_TEST_DUNGEON__, DungeonName, MapName } from "@/app/map/mapUtils";

export interface DbMapData {
  visibleCategories: Record<string, boolean>,
  visitedMarkers: Record<number, boolean>,
  displayedCategoryGroups: Record<string, boolean>,
}

export type SelectedMap = MapName
  | DungeonName
  | typeof __ALL_MAPS__
  | typeof __ALL_MAPS_BUT_DEFINED__
  | typeof __ALL_MAPS_BUT_DEFINED_AND_TEST_DUNGEON__
  | typeof __ALL_MAPS_BUT_TEST_DUNGEON__;