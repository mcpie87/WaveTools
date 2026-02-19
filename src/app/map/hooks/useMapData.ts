import { useEffect, useState } from "react";
import { ensureManifest } from "@/services/tiles/manifest";
import { loadBlueprintTranslations } from "../BlueprintTranslationService";
import { APIMarker } from "../types";
import { APIAreaLayer } from "@/types/mapTypes";

const ENTITIES_URL = 'https://wwfmp0c1vm.ufs.sh/f/GKKXYOQgq7aYJjynAOgE0xzLG7NC35IMYJrq9uTnS4KXpDBO';

export function useMapData() {
  const [data, setData] = useState<APIMarker[]>([]);
  const [layersData, setLayersData] = useState<APIAreaLayer[]>([]);
  const [ready, setReady] = useState({
    manifest: false,
    translations: false,
    entities: false,
  });

  // manifest + translations in parallel
  useEffect(() => {
    Promise.all([
      ensureManifest().then(() => setReady(r => ({ ...r, manifest: true }))),
      loadBlueprintTranslations().then(() => setReady(r => ({ ...r, translations: true }))),
    ]);
  }, []);

  // entities — migrate from Cache API to IDB
  useEffect(() => {
    (async () => {
      const URL = ENTITIES_URL;

      const cache = await caches.open('levelentityconfig-cache');
      const cached = await cache.match(URL);

      if (cached) {
        setData(await cached.json());
        setReady(r => ({ ...r, entities: true }));
        return;
      }

      const res = await fetch(URL);
      if (res.ok) {
        await cache.put(URL, res.clone());
        setData(await res.json());
      }
      setReady(r => ({ ...r, entities: true }));
    })();
  }, []);

  // area layers — keep as-is, small file
  useEffect(() => {
    (async () => {
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
      const url = `${basePath}/data/map_tiles.json`;
      const cache = await caches.open('area-layers-cache');
      const cached = await cache.match(url);
      if (cached) { setLayersData(await cached.json()); return; }
      const res = await fetch(url);
      if (res.ok) { await cache.put(url, res.clone()); setLayersData(await res.json()); }
    })();
  }, []);

  return { data, layersData, ready };
}