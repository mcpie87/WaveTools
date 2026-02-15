import { DbMapData } from "@/types/mapTypes";
import { MapAction } from "./map.actions";
import { mapStorageService } from "../services/mapStorageService";
import { assertUnreachable } from "@/utils/utils";

export const defaultMapState: DbMapData = {
  visibleCategories: {},
  visitedMarkers: {},
  displayedCategoryGroups: {},
};

export function initMapState(): DbMapData {
  const loaded = mapStorageService.load() as Partial<DbMapData> | null;

  if (!loaded) return defaultMapState;

  return {
    visibleCategories: {
      ...defaultMapState.visibleCategories,
      ...loaded.visibleCategories
    },
    visitedMarkers: {
      ...defaultMapState.visitedMarkers,
      ...loaded.visitedMarkers
    },
    displayedCategoryGroups: {
      ...defaultMapState.displayedCategoryGroups,
      ...loaded.displayedCategoryGroups
    },
  };
}

export function mapReducer(state: DbMapData, action: MapAction): DbMapData {
  switch (action.type) {
    case "SET_MARKER_VISITED":
      return {
        ...state,
        visitedMarkers: {
          ...state.visitedMarkers,
          [action.markerId]: action.value,
        },
      };
    case "TOGGLE_MARKER_VISITED":
      return {
        ...state,
        visitedMarkers: {
          ...state.visitedMarkers,
          [action.markerId]: !state.visitedMarkers[action.markerId],
        },
      };
    case "SET_CATEGORY_VISIBILITY":
      return {
        ...state,
        visibleCategories: {
          ...state.visibleCategories,
          [action.category]: action.value,
        },
      };
    case "TOGGLE_CATEGORY_VISIBILITY":
      return {
        ...state,
        visibleCategories: {
          ...state.visibleCategories,
          [action.category]: !state.visibleCategories[action.category],
        },
      };
    case "BULK_SET_CATEGORY_VISIBILITY":
      return {
        ...state,
        visibleCategories: {
          ...state.visibleCategories,
          ...action.categories.reduce((acc, category) => ({
            ...acc,
            [category]: action.value,
          }), {}),
        },
      };
    case "CLEAR_CATEGORIES_VISIBILITY":
      return {
        ...state,
        visibleCategories: {},
      };
    case "SET_CATEGORY_GROUP_VISIBILITY":
      return {
        ...state,
        displayedCategoryGroups: {
          ...state.displayedCategoryGroups,
          [action.categoryGroup]: action.value,
        },
      };
    case "TOGGLE_CATEGORY_GROUP_VISIBILITY":
      return {
        ...state,
        displayedCategoryGroups: {
          ...state.displayedCategoryGroups,
          [action.categoryGroup]: !state.displayedCategoryGroups[action.categoryGroup],
        },
      };
    default:
      return assertUnreachable(action);
  }
}