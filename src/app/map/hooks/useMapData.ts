import { useEffect, useState } from "react";
import { ensureManifest } from "@/services/tiles/manifest";
import { loadBlueprintTranslations } from "../BlueprintTranslationService";
import { APIMarker } from "../types";
import { APIAreaLayer } from "@/types/mapTypes";
import RBush from "rbush";

const ENTITIES_URL = 'https://wwfmp0c1vm.ufs.sh/f/GKKXYOQgq7aYJjynAOgE0xzLG7NC35IMYJrq9uTnS4KXpDBO';

export interface MarkerNode {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
  marker: APIMarker;
}

export interface MarkerIndexes {
  spatial: Map<number, RBush<MarkerNode>>;
  byBlueprint: Map<string, APIMarker[]>;
  byMapId: Map<number, APIMarker[]>;
}

function buildIndexes(raw: APIMarker[]): MarkerIndexes {
  const spatial = new Map<number, RBush<MarkerNode>>();
  const byBlueprint = new Map<string, APIMarker[]>();
  const byMapId = new Map<number, APIMarker[]>();

  const spatialBatch = new Map<number, MarkerNode[]>();

  for (const marker of raw) {
    const x = marker.Transform[0].X;
    const y = marker.Transform[0].Y;
    const { MapId, BlueprintType } = marker;

    // spatial batch
    if (!spatialBatch.has(MapId)) spatialBatch.set(MapId, []);
    spatialBatch.get(MapId)!.push({ minX: x, minY: y, maxX: x, maxY: y, marker });

    // byMapId
    if (!byMapId.has(MapId)) byMapId.set(MapId, []);
    byMapId.get(MapId)!.push(marker);

    // byBlueprint
    if (!byBlueprint.has(BlueprintType)) byBlueprint.set(BlueprintType, []);
    byBlueprint.get(BlueprintType)!.push(marker);
  }

  for (const [mapId, nodes] of spatialBatch) {
    const tree = new RBush<MarkerNode>();
    tree.load(nodes);
    spatial.set(mapId, tree);
  }

  return { spatial, byBlueprint, byMapId };
}

export function useMapData() {
  const [indexes, setIndexes] = useState<MarkerIndexes | null>(null);
  const [layersData, setLayersData] = useState<APIAreaLayer[]>([]);
  const [ready, setReady] = useState({
    manifest: false,
    translations: false,
    entities: false,
  });

  useEffect(() => {
    Promise.all([
      ensureManifest().then(() => setReady(r => ({ ...r, manifest: true }))),
      loadBlueprintTranslations().then(() => setReady(r => ({ ...r, translations: true }))),
    ]);
  }, []);

  useEffect(() => {
    (async () => {
      const cache = await caches.open('levelentityconfig-cache');
      const cached = await cache.match(ENTITIES_URL);

      const raw: APIMarker[] = cached
        ? await cached.json()
        : await (async () => {
          const res = await fetch(ENTITIES_URL);
          if (res.ok) await cache.put(ENTITIES_URL, res.clone());
          return res.json();
        })();

      setIndexes(buildIndexes(raw));
      setReady(r => ({ ...r, entities: true }));
    })();
  }, []);

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

  return { indexes, layersData, ready };
}