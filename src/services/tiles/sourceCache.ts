import { PMTiles } from 'pmtiles';
import { IDBSource } from './IDBSource';

const cache = new Map<string, PMTiles>();

export function getPMTilesInstance(url: string, version: string): PMTiles {
  const key = `${url}@${version}`;
  if (!cache.has(key)) {
    cache.set(key, new PMTiles(new IDBSource(url, version)));
  }
  return cache.get(key)!;
}

export function evictPMTilesInstance(url: string): void {
  cache.delete(url);
}

export function getCacheSize(): number {
  return cache.size;
}