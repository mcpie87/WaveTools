import { InventoryDBSchema } from "@/types/inventoryTypes";
import { ResonatorDBSchema } from "@/types/resonatorTypes";
import { UnionLevelPageData } from "@/types/unionLevelDataTypes";
import { WeaponDBSchema } from "@/types/weaponTypes";

// const VERSION_KEY = "2025-03-06T03:36";
export const STORAGE_KEY = "wave_tools";

type LocalStorageData = string
  | ResonatorDBSchema
  | WeaponDBSchema
  | InventoryDBSchema
  | UnionLevelPageData;

// Usage:
// const storageService = new LocalStorageService("resonators");
// const resonators = storageService.load();
// resonators["name"] = { ... };
// storageService.save(resonators);
class LocalStorageService {
  private key: string;

  constructor(key: string, prefix: string = STORAGE_KEY) {
    this.key = `${prefix}_${key}`;
  }

  private isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
  }

  private loadRaw(): LocalStorageData | null {
    if (!this.isBrowser()) {
      return null;
    }
    const rawData = localStorage.getItem(this.key);
    if (!rawData) {
      return null;
    }

    try {
      return JSON.parse(rawData);
    } catch {
      return rawData;
    }
  }

  load(): LocalStorageData | null {
    return this.loadRaw();
  }

  save(data: LocalStorageData) {
    if (!this.isBrowser()) {
      return;
    }
    localStorage.setItem(this.key, JSON.stringify(data));
  }

  clear() {
    if (!this.isBrowser()) {
      return;
    }
    localStorage.removeItem(this.key);
  }
}

export default LocalStorageService