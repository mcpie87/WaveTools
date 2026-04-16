// 3.2 migration - any future additions CANNOT modify this code
interface DbMapData {
  visibleCategories: Record<string, boolean>;
  visitedMarkers: Record<number, boolean>;
  visitedEntities: Record<string, Set<string>>;
  displayedCategoryGroups: Record<string, boolean>;
}

const MAP_STORAGE_KEY = "wave_tools_map";
export const MAP_VISITED_MARKERS_BACKUP_KEY = "wave_tools_map_visited_markers_backup";

export function loadMapData(): DbMapData | null {
  if (typeof window === "undefined" || !window.localStorage) return null;
  const rawData = localStorage.getItem(MAP_STORAGE_KEY);
  if (!rawData) return null;
  try {
    return JSON.parse(rawData, (_key, value) => {
      if (value?.__type === "Set") return new Set(value.values);
      if (value?.__type === "Map") return new Map(value.values);
      return value;
    });
  } catch {
    return null;
  }
}

export function saveMapData(data: DbMapData) {
  if (typeof window === "undefined" || !window.localStorage) return;
  localStorage.setItem(
    MAP_STORAGE_KEY,
    JSON.stringify(data, (_key, value) => {
      if (value instanceof Set) return { __type: "Set", values: [...value] };
      if (value instanceof Map) return { __type: "Map", values: [...value] };
      return value;
    })
  );
}