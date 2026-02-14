export interface DbMapData {
  visibleCategories: Record<string, boolean>,
  visitedMarkers: Set<number>, // Record<number, boolean>,
  displayedCategoryGroups: Record<string, boolean>,
}