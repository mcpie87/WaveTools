import { create } from "zustand";
import { DbMapData, SelectedMap } from "@/types/mapTypes";
import { MapName } from "../mapUtils";
import { mapStorageService } from "../services/mapStorageService";
import { initMapState } from "./map.reducer";

interface MapState {
  // DB Map Data
  dbMapData: DbMapData;
  setMarkerVisited: (markerId: number, value: boolean) => void;
  toggleMarkerVisited: (markerId: number) => void;
  setCategoryVisibility: (category: string, value: boolean) => void;
  toggleCategoryVisibility: (category: string) => void;
  bulkSetCategoryVisibility: (categories: string[], value: boolean) => void;
  clearCategoriesVisibility: () => void;
  setCategoryGroupVisibility: (categoryGroup: string, value: boolean) => void;
  toggleCategoryGroupVisibility: (categoryGroup: string) => void;

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
}

export const useMapStore = create<MapState>((set) => ({
  // DB Map Data
  dbMapData: initMapState(),

  setMarkerVisited: (markerId, value) => {
    set((state) => {
      const newData = {
        ...state.dbMapData,
        visitedMarkers: {
          ...state.dbMapData.visitedMarkers,
          [markerId]: value,
        },
      };
      mapStorageService.save(newData);
      return { dbMapData: newData };
    });
  },

  toggleMarkerVisited: (markerId) => {
    set((state) => {
      const newData = {
        ...state.dbMapData,
        visitedMarkers: {
          ...state.dbMapData.visitedMarkers,
          [markerId]: !state.dbMapData.visitedMarkers[markerId],
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
}));
