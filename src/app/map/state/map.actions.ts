export type MapAction =
  | { type: "SET_MARKER_VISITED"; markerId: number; value: boolean }
  | { type: "TOGGLE_MARKER_VISITED"; markerId: number }
  | { type: "SET_CATEGORY_VISIBILITY"; category: string; value: boolean }
  | { type: "TOGGLE_CATEGORY_VISIBILITY"; category: string }
  | { type: "BULK_SET_CATEGORY_VISIBILITY"; categories: string[]; value: boolean }
  | { type: "CLEAR_CATEGORIES_VISIBILITY" }
  | { type: "SET_CATEGORY_GROUP_VISIBILITY"; categoryGroup: string; value: boolean }
  | { type: "TOGGLE_CATEGORY_GROUP_VISIBILITY"; categoryGroup: string };

export const setMarkerVisitedAction = (
  markerId: number,
  value: boolean,
): MapAction => ({
  type: "SET_MARKER_VISITED",
  markerId,
  value: value,
});

export const toggleMarkerVisitedAction = (
  markerId: number,
): MapAction => ({
  type: "TOGGLE_MARKER_VISITED",
  markerId,
});

export const setCategoryVisibleAction = (
  category: string,
  value: boolean,
): MapAction => ({
  type: "SET_CATEGORY_VISIBILITY",
  category,
  value: value,
});

export const toggleCategoryVisibleAction = (
  category: string,
): MapAction => ({
  type: "TOGGLE_CATEGORY_VISIBILITY",
  category,
});

export const bulkSetCategoryVisibleAction = (
  categories: string[],
  value: boolean,
): MapAction => ({
  type: "BULK_SET_CATEGORY_VISIBILITY",
  categories,
  value: value,
});

export const clearCategoriesVisibilityAction = (): MapAction => ({
  type: "CLEAR_CATEGORIES_VISIBILITY",
});

export const setCategoryGroupVisibleAction = (
  categoryGroup: string,
  value: boolean,
): MapAction => ({
  type: "SET_CATEGORY_GROUP_VISIBILITY",
  categoryGroup,
  value: value,
});