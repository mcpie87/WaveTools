import Dexie, { type Table } from 'dexie';
import { TileFile } from './AppDatabase.types';

const DB_NAME = 'wave_tools_db';

class AppDatabase extends Dexie {
  tiles!: Table<TileFile, string>;

  constructor() {
    super(DB_NAME);
    this.version(1).stores({
      tiles: 'url, cachedAt',
    });
  }
}

export const db = new AppDatabase();
export type { TileFile };