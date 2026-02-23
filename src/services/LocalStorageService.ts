import { LocalStorageData } from "@/types/localStorageTypes";

// const VERSION_KEY = "2025-03-06T03:36";
export const STORAGE_KEY = "wave_tools";

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
    if (!this.isBrowser()) return null;
    const rawData = localStorage.getItem(this.key);
    if (!rawData) return null;
    try {
      return JSON.parse(rawData, (_key, value) => {
        if (value?.__type === 'Set') return new Set(value.values);
        if (value?.__type === 'Map') return new Map(value.values);
        return value;
      });
    } catch {
      return null;
    }
  }

  load(): LocalStorageData | null {
    return this.loadRaw();
  }

  save(data: LocalStorageData) {
    if (!this.isBrowser()) return;
    localStorage.setItem(
      this.key,
      JSON.stringify(data, (_key, value) => {
        if (value instanceof Set) return { __type: 'Set', values: [...value] };
        if (value instanceof Map) return { __type: 'Map', values: [...value] };
        return value;
      })
    );
  }

  clear() {
    if (!this.isBrowser()) {
      return;
    }
    localStorage.removeItem(this.key);
  }
}

export default LocalStorageService