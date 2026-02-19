import type { Source, RangeResponse } from 'pmtiles';
import { db } from '../db/AppDatabase';


export class IDBSource implements Source {
  private readonly url: string;
  private readonly version: string;
  private buffer: ArrayBuffer | null = null;
  private backgroundDownloadStarted = false;
  private readonly cacheReady: Promise<void>;

  constructor(url: string, version: string) {
    this.url = url;
    this.version = version;
    this.cacheReady = this.initFromCache();
  }

  getKey(): string {
    return this.url;
  }

  private async initFromCache(): Promise<void> {
    const cached = await db.tiles.get(this.url);
    if (cached) {
      if (cached.version !== this.version) {
        console.log(`[PMTiles] Stale cache: ${this.url}, re-downloading`);
        this.buffer = cached.data;
        await db.tiles.delete(this.url);
        this.scheduleBackgroundDownload();
      } else {
        console.log(`[PMTiles] Cache hit: ${this.url}`);
        this.buffer = cached.data;
      }
    } else {
      console.log(`[PMTiles] Cache miss: ${this.url}`);
      this.scheduleBackgroundDownload();
    }
  }
  private scheduleBackgroundDownload(): void {
    if (this.backgroundDownloadStarted) return;
    this.backgroundDownloadStarted = true;

    const start = () => this.backgroundDownload().catch((e) => {
      console.warn('[PMTiles] Background download failed:', e);
      this.backgroundDownloadStarted = false;
    });

    // requestIdleCallback = lowest possible priority, falls back to setTimeout
    if ('requestIdleCallback' in window) {
      requestIdleCallback(() => start(), { timeout: 10_000 });
    } else {
      setTimeout(start, 2_000);
    }
  }

  private async backgroundDownload(): Promise<void> {
    console.log(`[PMTiles] Background download started: ${this.url}`);
    const res = await fetch(this.url, { priority: 'low' } as RequestInit);
    if (!res.ok) throw new Error(`[PMTiles] Fetch failed: ${res.status} ${res.statusText}`);
    const data = await res.arrayBuffer();
    await db.tiles.put({
      url: this.url,
      data,
      cachedAt: new Date(),
      byteLength: data.byteLength,
      version: this.version
    });
    this.buffer = data;
    console.log(`[PMTiles] Background download complete: ${this.url} (${data.byteLength} bytes)`);
  }

  async getBytes(offset: number, length: number): Promise<RangeResponse> {
    await this.cacheReady;

    if (this.buffer) {
      const safeLength = Math.min(length, this.buffer.byteLength - offset);
      const dst = new Uint8Array(safeLength);
      dst.set(new Uint8Array(this.buffer, offset, safeLength));
      return { data: dst.buffer };
    }

    const end = offset + length - 1;
    const res = await fetch(this.url, {
      headers: { Range: `bytes=${offset}-${end}` },
    });

    if (!res.ok && res.status !== 206) {
      throw new Error(`[PMTiles] Range request failed: ${res.status}`);
    }

    const data = await res.arrayBuffer();
    return { data };
  }
}