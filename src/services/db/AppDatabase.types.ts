export interface TileFile {
  url: string;
  version: string;
  data: ArrayBuffer;
  cachedAt: Date;
  byteLength: number;
}