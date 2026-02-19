import { APIAreaLayer, SelectedMap } from "@/types/mapTypes";
import { APIMarker } from "../types";
import { useEffect, useMemo, useReducer, useState } from "react";
import { MapName } from "../mapUtils";
import { loadBlueprintTranslations } from "../BlueprintTranslationService";
import { mapStorageService } from "../services/mapStorageService";
import { initMapState, mapReducer } from "../state/map.reducer";
import { ensureManifest } from "@/services/tiles/manifest";

export function useMapLogic() {
  const [data, setData] = useState<APIMarker[]>([]);
  const [layersData, setLayersData] = useState<APIAreaLayer[]>([]);
  const [manifestReady, setManifestReady] = useState(false);

  const [translationsReady, setTranslationsReady] = useState(false);
  const [selectedMap, setSelectedMap] = useState<SelectedMap>(MapName.SOLARIS_3);
  const [activeAreaId, setActiveAreaId] = useState<number | null>(null);
  const [selectedMapId, setSelectedMapId] = useState<number | null>(null);

  const [enableClick, setEnableClick] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0, z: 0 });
  const [radius, setRadius] = useState(50);

  const [showDescriptions, setShowDescriptions] = useState(false);
  const [hideVisited, setHideVisited] = useState(false);

  const [dbMapData, dispatch] = useReducer(mapReducer, initMapState());

  useEffect(() => {
    loadBlueprintTranslations().then(() => setTranslationsReady(true));

    // Tile caching
    if ('serviceWorker' in navigator) {
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
      navigator.serviceWorker.register(`${basePath}/sw.js`);
    }
  }, []);

  useEffect(() => {
    mapStorageService.save(dbMapData);
  }, [dbMapData]);

  useEffect(() => {
    ensureManifest().then(() => setManifestReady(true));
  }, []);

  useEffect(() => {
    (async () => {
      const URL =
        'https://wwfmp0c1vm.ufs.sh/f/GKKXYOQgq7aYJjynAOgE0xzLG7NC35IMYJrq9uTnS4KXpDBO';

      const cache = await caches.open('levelentityconfig-cache');
      const cached = await cache.match(URL);

      if (cached) {
        setData(await cached.json());
        return;
      }

      const res = await fetch(URL);
      if (res.ok) {
        await cache.put(URL, res.clone());
        setData(await res.json());
      }
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
      const URL = `${basePath}/data/map_tiles.json`;

      const cache = await caches.open('area-layers-cache');
      const cached = await cache.match(URL);

      if (cached) {
        setLayersData(await cached.json());
        return;
      }

      const res = await fetch(URL);
      if (res.ok) {
        await cache.put(URL, res.clone());
        setLayersData(await res.json());
      }
    })();
  }, []);

  const areaLayers = useMemo(() => {
    const map = new Map<number, APIAreaLayer>();
    layersData.forEach(l => map.set(l.areaId, l));
    return map;
  }, [layersData]);

  const ui = useMemo(() => ({
    activeAreaId,
    setActiveAreaId,
    selectedMap,
    setSelectedMap,
    selectedMapId,
    setSelectedMapId,
    enableClick,
    setEnableClick,
    coords,
    setCoords,
    radius,
    setRadius,
    showDescriptions,
    setShowDescriptions,
    hideVisited,
    setHideVisited
  }), [
    activeAreaId, selectedMap, selectedMapId, enableClick,
    coords, radius, showDescriptions, hideVisited
  ]);

  return {
    data,
    translationsReady,
    dbMapData,
    manifestReady,
    dispatch,
    areaLayers,
    ui
  }
}