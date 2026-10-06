import { useEffect } from "react";
import { useMapData } from "./useMapData";
import { GAME_VERSION } from "@/constants/constants";

export function useMapLogic() {
  const { indexes, layersData, ready, loadingSteps } = useMapData();

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
    areaLayers,
  };
}
