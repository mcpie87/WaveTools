import { APIAreaLayer } from "@/types/mapTypes";
import { useEffect, useMemo, useReducer } from "react";
import { mapStorageService } from "../services/mapStorageService";
import { initMapState, mapReducer } from "../state/map.reducer";
import { useMapUI } from "./useMapUI";
import { useMapData } from "./useMapData";

export function useMapLogic() {
  const { indexes, layersData, ready } = useMapData();
  const ui = useMapUI();
  const [dbMapData, dispatch] = useReducer(mapReducer, initMapState());

  useEffect(() => {
    // Tile caching
    if ('serviceWorker' in navigator) {
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
      navigator.serviceWorker.register(`${basePath}/sw.js`);
    }
  }, []);

  useEffect(() => {
    mapStorageService.save(dbMapData);
  }, [dbMapData]);

  const areaLayers = useMemo(() => {
    const map = new Map<number, APIAreaLayer>();
    layersData.forEach(l => map.set(l.areaId, l));
    return map;
  }, [layersData]);

  return {
    indexes,
    ready,
    dbMapData,
    dispatch,
    areaLayers,
    ui
  }
}