import { useEffect } from "react";
import { useMapData } from "./useMapData";
import { useMapStore } from "../state/mapStore";

export function useMapLogic() {
  const { indexes, layersData, ready } = useMapData();
  const dbMapData = useMapStore((state) => state.dbMapData);

  useEffect(() => {
    // Tile caching
    if ('serviceWorker' in navigator) {
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
      navigator.serviceWorker.register(`${basePath}/sw.js`);
    }
  }, []);

  const areaLayers = new Map(layersData.map((l) => [l.areaId, l]));

  return {
    indexes,
    ready,
    dbMapData, // For backward compatibility in page.tsx if needed, but should be removed eventually
    areaLayers,
  };
}