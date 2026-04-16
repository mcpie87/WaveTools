import { create } from "zustand";
import { DbMapData, SelectedMap } from "@/types/mapTypes";
import { MapName, getMarkerRealId } from "../mapUtils";
import { mapStorageService } from "../services/mapStorageService";
import { IMarker } from "../types";
import { getMatchedTrackableCategories } from "../TranslationMaps/translationMap";
import { registerStore } from "./storeRegistry";
export const defaultMapState: DbMapData = {
  visibleCategories: {},
  visitedMarkers: {},
  displayedCategoryGroups: {},
  visitedEntities: {},
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
    visitedEntities: {
      ...defaultMapState.visitedEntities,
      ...loaded.visitedEntities
    },
    displayedCategoryGroups: {
      ...defaultMapState.displayedCategoryGroups,
      ...loaded.displayedCategoryGroups
    },
  };
}

interface MapState {
  // DB Map Data
  dbMapData: DbMapData;
  hydrate: () => void;
  toggleEntityCategoryVisited: (marker: IMarker, categoryKey: string) => void;
  setCategoryVisibility: (category: string, value: boolean) => void;
  toggleCategoryVisibility: (category: string) => void;
  bulkSetCategoryVisibility: (categories: string[], value: boolean) => void;
  clearCategoriesVisibility: () => void;
  setCategoryGroupVisibility: (categoryGroup: string, value: boolean) => void;
  toggleCategoryGroupVisibility: (categoryGroup: string) => void;
  bulkSetMarkersVisited: (markers: IMarker[], value: boolean) => void;

  // UI State
  selectedMap: SelectedMap;
  setSelectedMap: (map: SelectedMap) => void;
  activeAreaId: number | null;
  setActiveAreaId: (id: number | null) => void;
  selectedMapId: number | null;
  setSelectedMapId: (id: number | null) => void;
  enableClick: boolean;
  setEnableClick: (enabled: boolean) => void;
  coords: { x: number; y: number; z: number };
  setCoords: (coords: { x: number; y: number; z: number }) => void;
  radius: number;
  setRadius: (radius: number) => void;
  showDescriptions: boolean;
  setShowDescriptions: (show: boolean) => void;
  hideVisited: boolean;
  setHideVisited: (hide: boolean) => void;

  // Multi-select state
  multiSelectMode: boolean;
  setMultiSelectMode: (enabled: boolean) => void;
  selectedMarkerIds: Set<number>;
  toggleMarkerSelected: (markerId: number) => void;
  clearSelectedMarkers: () => void;
  selectAllVisibleMarkers: (markerIds: number[]) => void;

  // Map Movement
  flyToCoord: { lat: number; lng: number } | null;
  setFlyToCoord: (coord: { lat: number; lng: number } | null) => void;
}

export const useMapStore = create<MapState>((set) => ({
  dbMapData: defaultMapState,

  hydrate: () => set({ dbMapData: initMapState() }),

  toggleEntityCategoryVisited: (marker, categoryKey) => {
    set((state) => {
      const entityKey = getMarkerRealId(marker);
      const newVisitedParts = new Set(state.dbMapData.visitedEntities[entityKey] || []);

      if (newVisitedParts.has(categoryKey)) {
        newVisitedParts.delete(categoryKey);
      } else {
        newVisitedParts.add(categoryKey);
      }

      const newData = {
        ...state.dbMapData,
        visitedEntities: {
          ...state.dbMapData.visitedEntities,
          [entityKey]: newVisitedParts,
        },
      };
      mapStorageService.save(newData);
      return { dbMapData: newData };
    });
  },

  setCategoryVisibility: (category, value) => {
    set((state) => {
      const newData = {
        ...state.dbMapData,
        visibleCategories: {
          ...state.dbMapData.visibleCategories,
          [category]: value,
        },
      };
      mapStorageService.save(newData);
      return { dbMapData: newData };
    });
  },

  toggleCategoryVisibility: (category) => {
    set((state) => {
      const newData = {
        ...state.dbMapData,
        visibleCategories: {
          ...state.dbMapData.visibleCategories,
          [category]: !state.dbMapData.visibleCategories[category],
        },
      };
      mapStorageService.save(newData);
      return { dbMapData: newData };
    });
  },

  bulkSetCategoryVisibility: (categories, value) => {
    set((state) => {
      const newData = {
        ...state.dbMapData,
        visibleCategories: {
          ...state.dbMapData.visibleCategories,
          ...categories.reduce((acc, category) => ({
            ...acc,
            [category]: value,
          }), {}),
        },
      };
      mapStorageService.save(newData);
      return { dbMapData: newData };
    });
  },

  clearCategoriesVisibility: () => {
    set((state) => {
      const newData = {
        ...state.dbMapData,
        visibleCategories: {},
      };
      mapStorageService.save(newData);
      return { dbMapData: newData };
    });
  },

  setCategoryGroupVisibility: (categoryGroup, value) => {
    set((state) => {
      const newData = {
        ...state.dbMapData,
        displayedCategoryGroups: {
          ...state.dbMapData.displayedCategoryGroups,
          [categoryGroup]: value,
        },
      };
      mapStorageService.save(newData);
      return { dbMapData: newData };
    });
  },

  toggleCategoryGroupVisibility: (categoryGroup) => {
    set((state) => {
      const newData = {
        ...state.dbMapData,
        displayedCategoryGroups: {
          ...state.dbMapData.displayedCategoryGroups,
          [categoryGroup]: !state.dbMapData.displayedCategoryGroups[categoryGroup],
        },
      };
      mapStorageService.save(newData);
      return { dbMapData: newData };
    });
  },

  bulkSetMarkersVisited: (markers, value) => {
    set((state) => {
      const updatedVisited = { ...state.dbMapData.visitedEntities };
      for (const m of markers) {
        const entityKey = getMarkerRealId(m);
        const matched = getMatchedTrackableCategories(m);
        const visitedSet = new Set(updatedVisited[entityKey] || []);

        for (const cat of matched) {
          if (value) {
            visitedSet.add(cat.key);
          } else {
            visitedSet.delete(cat.key);
          }
        }

        if (visitedSet.size === 0) {
          delete updatedVisited[entityKey];
        } else {
          updatedVisited[entityKey] = visitedSet;
        }
      }
      const newData = {
        ...state.dbMapData,
        visitedEntities: updatedVisited,
      };
      mapStorageService.save(newData);
      return { dbMapData: newData };
    });
  },

  // UI State
  selectedMap: MapName.SOLARIS_3,
  setSelectedMap: (selectedMap) => set({ selectedMap }),
  activeAreaId: null,
  setActiveAreaId: (activeAreaId) => set({ activeAreaId }),
  selectedMapId: null,
  setSelectedMapId: (selectedMapId) => set({ selectedMapId }),
  enableClick: false,
  setEnableClick: (enableClick) => set({ enableClick }),
  coords: { x: 0, y: 0, z: 0 },
  setCoords: (coords) => set({ coords }),
  radius: 50,
  setRadius: (radius) => set({ radius }),
  showDescriptions: false,
  setShowDescriptions: (showDescriptions) => set({ showDescriptions }),
  hideVisited: false,
  setHideVisited: (hideVisited) => set({ hideVisited }),

  // Multi-select state
  multiSelectMode: false,
  setMultiSelectMode: (enabled) => set({ multiSelectMode: enabled }),
  selectedMarkerIds: new Set<number>(),
  toggleMarkerSelected: (markerId) => {
    set((state) => {
      const newSet = new Set(state.selectedMarkerIds);
      if (newSet.has(markerId)) {
        newSet.delete(markerId);
      } else {
        newSet.add(markerId);
      }
      return { selectedMarkerIds: newSet };
    });
  },
  clearSelectedMarkers: () => set({ selectedMarkerIds: new Set() }),
  selectAllVisibleMarkers: (markerIds) => set({ selectedMarkerIds: new Set(markerIds) }),

  // Map Movement
  flyToCoord: null,
  setFlyToCoord: (flyToCoord) => set({ flyToCoord }),
}));

registerStore(() => useMapStore.getState().hydrate());