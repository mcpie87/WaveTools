import { useEffect } from "react";
import { useMapData } from "./useMapData";
import { useMapStore } from "../state/mapStore";
import { GAME_VERSION } from "@/constants/constants";

export function useMapLogic() {
  const { indexes, layersData, ready, loadingSteps } = useMapData();
  const dbMapData = useMapStore((state) => state.dbMapData);

  useEffect(() => {
    // Icon caching
    if ('serviceWorker' in navigator) {
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
      // sw.js reads ?v= to version its cache
      navigator.serviceWorker.register(`${basePath}/sw.js?v=${GAME_VERSION}`);
    }
  }, []);

  const areaLayers = new Map();
  for (const layer of layersData) {
    for (const areaId of layer.areaIds) {
      areaLayers.set(areaId, layer);
    }
  }

  return {
    indexes,
    ready,
    loadingSteps,
    dbMapData, // For backward compatibility in page.tsx if needed, but should be removed eventually
    areaLayers,
  };
}