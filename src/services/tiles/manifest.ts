import { MAP_TILES_URL } from "@/app/map/mapUtils";

interface ManifestLayer {
  hash: string;
  output_hash: string;
}

interface Manifest {
  offset_x: number;
  offset_y: number;
  layers: Record<string, ManifestLayer>;
}

let manifest: Manifest | null = null;
let manifestPromise: Promise<Manifest> | null = null;

export async function ensureManifest(): Promise<Manifest> {
  if (!manifestPromise) {
    manifestPromise = fetch(`${MAP_TILES_URL}/pmtiles/manifest.json`)
      .then((res) => {
        if (!res.ok) throw new Error(`[PMTiles] Failed to load manifest: ${res.status}`);
        return res.json() as Promise<Manifest>;
      })
      .then((data) => {
        manifest = data;
        return manifest;
      });
  }
  return manifestPromise;
}

export function getLayerHash(layerName: string): string {
  if (!manifest) throw new Error('[PMTiles] Manifest not loaded yet, call ensureManifest() first');
  return manifest.layers[layerName]?.hash ?? 'unknown';
}

export function getOffset(): { x: number; y: number } {
  if (!manifest) throw new Error('[PMTiles] Manifest not loaded yet, call ensureManifest() first');
  return { x: manifest.offset_x, y: manifest.offset_y };
}