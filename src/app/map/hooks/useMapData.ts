import { useEffect, useState, useCallback } from "react";
import { ensureManifest } from "@/services/tiles/manifest";
import { loadBlueprintTranslations } from "../BlueprintTranslationService";
import { APIMarker } from "../types";
import { APIAreaLayer } from "@/types/mapTypes";
import RBush from "rbush";
import { mapMarksData } from "../data/map_marks";
import { GAME_VERSION, LEVEL_ENTITY_CONFIG_URL } from "@/constants/constants";
import { isDevelopment } from "@/utils/utils";

const ENTITIES_URL = LEVEL_ENTITY_CONFIG_URL[GAME_VERSION];

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

export type LoadingStepStatus = 'pending' | 'loading' | 'done' | 'error';

export interface LoadingStep {
  id: string;
  label: string;
  status: LoadingStepStatus;
  startedAt?: number;
  completedAt?: number;
  error?: string;
  /** Download progress 0..1, undefined means indeterminate */
  progress?: number;
  /** Bytes downloaded so far */
  downloadedBytes?: number;
  /** Total bytes to download (from Content-Length) */
  totalBytes?: number;
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

/**
 * Fetch with download progress tracking via ReadableStream.
 * Falls back to regular fetch if streaming is unavailable.
 */
async function fetchWithProgress(
  url: string,
  onProgress: (downloaded: number, total: number | null) => void,
  signal?: AbortSignal,
): Promise<{ data: ArrayBuffer; response: Response }> {
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error(`HTTP ${response.status}: ${response.statusText}`);

  const contentLength = response.headers.get('Content-Length');
  const total = contentLength ? parseInt(contentLength, 10) : null;

  // If no body or no readable stream support, fall back to simple read
  if (!response.body) {
    const data = await response.arrayBuffer();
    onProgress(data.byteLength, data.byteLength);
    return { data, response };
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let received = 0;

  // eslint-disable-next-line no-constant-condition
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    received += value.length;
    onProgress(received, total);
  }

  // Combine chunks into a single ArrayBuffer
  const combined = new Uint8Array(received);
  let offset = 0;
  for (const chunk of chunks) {
    combined.set(chunk, offset);
    offset += chunk.length;
  }

  return { data: combined.buffer, response };
}

const INITIAL_STEPS: LoadingStep[] = [
  { id: 'manifest', label: 'Fetching tile manifest', status: 'pending' },
  { id: 'translations', label: 'Loading translations', status: 'pending' },
  { id: 'entities', label: 'Downloading entity data', status: 'pending' },
  { id: 'indexing', label: 'Building spatial index', status: 'pending' },
  { id: 'layers', label: 'Loading area layers', status: 'pending' },
];

export function useMapData() {
  const [indexes, setIndexes] = useState<MarkerIndexes | null>(null);
  const [layersData, setLayersData] = useState<APIAreaLayer[]>([]);
  const [ready, setReady] = useState({
    manifest: false,
    translations: false,
    entities: false,
  });
  const [loadingSteps, setLoadingSteps] = useState<LoadingStep[]>(INITIAL_STEPS);

  const updateStep = useCallback((id: string, updates: Partial<LoadingStep>) => {
    setLoadingSteps(prev =>
      prev.map(step => step.id === id ? { ...step, ...updates } : step)
    );
  }, []);

  // Manifest + Translations
  useEffect(() => {
    let cancelled = false;

    // Manifest
    updateStep('manifest', { status: 'loading', startedAt: Date.now() });
    ensureManifest()
      .then(async () => {
        await new Promise(r => setTimeout(r, 400));
        if (cancelled) return;
        setReady(r => ({ ...r, manifest: true }));
        updateStep('manifest', { status: 'done', completedAt: Date.now() });
      })
      .catch((err) => {
        if (cancelled) return;
        updateStep('manifest', { status: 'error', error: err.message, completedAt: Date.now() });
      });

    // Translations
    updateStep('translations', { status: 'loading', startedAt: Date.now() });
    loadBlueprintTranslations()
      .then(async () => {
        await new Promise(r => setTimeout(r, 400));
        if (cancelled) return;
        setReady(r => ({ ...r, translations: true }));
        updateStep('translations', { status: 'done', completedAt: Date.now() });
      })
      .catch((err) => {
        if (cancelled) return;
        updateStep('translations', { status: 'error', error: err.message, completedAt: Date.now() });
      });

    return () => { cancelled = true; };
  }, [updateStep]);

  // Entity data (large download with progress tracking)
  useEffect(() => {
    let cancelled = false;
    const controller = new AbortController();

    (async () => {
      updateStep('entities', { status: 'loading', startedAt: Date.now(), progress: undefined });
      let raw: APIMarker[];
      try {
        if (isDevelopment()) {
          // Dev: local file, no progress needed (it's instant from disk)
          const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
          const url = `${basePath}/data/levelentityconfig.json`;
          raw = await (async () => {
            const res = await fetch(url, { signal: controller.signal });
            if (res.ok) return await res.json();
            return res.json();
          })();
        } else {
          // Production: check cache first, then fetch with progress
          const cache = await caches.open('levelentityconfig-cache');
          const cached = await cache.match(ENTITIES_URL);

          if (cached) {
            // From cache — instant, mark as cached
            updateStep('entities', { progress: 1 });
            raw = await cached.json();
          } else {
            // Fresh download with progress
            const { data } = await fetchWithProgress(
              ENTITIES_URL,
              (downloaded, total) => {
                if (cancelled) return;
                updateStep('entities', {
                  progress: total ? downloaded / total : undefined,
                  downloadedBytes: downloaded,
                  totalBytes: total ?? undefined,
                });
              },
              controller.signal,
            );

            // Cache the raw response data before parsing
            const cacheResponse = new Response(data, {
              headers: { 'Content-Type': 'application/json' },
            });
            await cache.put(ENTITIES_URL, cacheResponse);

            // Parse the JSON
            const text = new TextDecoder().decode(data);
            raw = JSON.parse(text);
          }
        }

        if (cancelled) return;
        await new Promise(r => setTimeout(r, 400));
        if (cancelled) return;
        updateStep('entities', { status: 'done', completedAt: Date.now(), progress: 1 });

        // Indexing phase
        updateStep('indexing', { status: 'loading', startedAt: Date.now() });
        const builtIndexes = buildIndexes(raw);
        await new Promise(r => setTimeout(r, 400));
        if (cancelled) return;
        setIndexes(builtIndexes);
        setReady(r => ({ ...r, entities: true }));
        updateStep('indexing', { status: 'done', completedAt: Date.now() });
      } catch (err: any) {
        if (cancelled) return;
        updateStep('entities', { status: 'error', error: err.message, completedAt: Date.now() });
      }
    })();

    return () => {
      cancelled = true;
      controller.abort();
    };
  }, [updateStep]);

  // Area layers
  useEffect(() => {
    let cancelled = false;

    (async () => {
      updateStep('layers', { status: 'loading', startedAt: Date.now() });
      try {
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
        const url = `${basePath}/data/map_tiles.json`;
        const cache = await caches.open('area-layers-cache');
        const cached = await cache.match(url + GAME_VERSION);
        if (cached) {
          if (!cancelled) setLayersData(await cached.json());
        } else {
          const res = await fetch(url);
          if (res.ok) {
            await cache.put(url, res.clone());
            if (!cancelled) setLayersData(await res.json());
          }
        }
        await new Promise(r => setTimeout(r, 400));
        if (!cancelled) updateStep('layers', { status: 'done', completedAt: Date.now() });
      } catch (err: any) {
        if (!cancelled) updateStep('layers', { status: 'error', error: err.message, completedAt: Date.now() });
      }
    })();

    return () => { cancelled = true; };
  }, [updateStep]);

  return { indexes, layersData, mapMarksData, ready, loadingSteps };
}