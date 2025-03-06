import { InventoryDBSchema } from "@/types/inventoryTypes";
import { ResonatorDBSchema } from "@/types/resonatorTypes";
import { WeaponDBSchema } from "@/types/weaponTypes";

// const VERSION_KEY = "2025-03-06T03:36";
const STORAGE_KEY = "wuwa_planner";

type LocalStorageData = string | ResonatorDBSchema | WeaponDBSchema | InventoryDBSchema;

class LocalStorageService {
  private key: string;

  constructor(key: string) {
    this.key = `${STORAGE_KEY}_${key}`;
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