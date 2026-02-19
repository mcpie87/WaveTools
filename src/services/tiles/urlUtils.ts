import { MAP_TILES_URL } from "@/app/map/mapUtils";

const LAYER_URL_PATTERN = /\/T_([^_]+)_([^_]+)_([^_]+)(_\d+)?(_[^.]+)\.([A-Za-z]+)/;

export function getPMTilesUrl(layerUrl: string): string {
  const match = layerUrl.match(LAYER_URL_PATTERN);
  if (!match) throw new Error(`[PMTiles] Invalid layer URL format: ${layerUrl}`);

  const [, name1, , , , name2] = match;
  return `${MAP_TILES_URL}/pmtiles/${name1}${name2}.pmtiles`;
}

export function getLayerName(layerUrl: string): string {
  const match = layerUrl.match(LAYER_URL_PATTERN);
  if (!match) throw new Error(`[PMTiles] Invalid layer URL format: ${layerUrl}`);

  const [, name1, , , , name2] = match;
  return `${name1}${name2}`;
}