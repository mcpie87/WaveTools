import { Migration } from "../migrationTypes";

interface DbMapData {
  visibleCategories: Record<string, boolean>;
  visitedMarkers: Record<number, boolean>;
  visitedEntities: Record<string, Set<string>>;
  displayedCategoryGroups: Record<string, boolean>;
}

const STORAGE_KEY = "wave_tools_map";

function loadMapData(): DbMapData | null {
  if (typeof window === "undefined" || !window.localStorage) return null;
  const rawData = localStorage.getItem(STORAGE_KEY);
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

function saveMapData(data: DbMapData) {
  if (typeof window === "undefined" || !window.localStorage) return;
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(data, (_key, value) => {
      if (value instanceof Set) return { __type: "Set", values: [...value] };
      if (value instanceof Map) return { __type: "Map", values: [...value] };
      return value;
    })
  );
}

// This URL will host a pre-computed mapping of:
// { [oldId: number]: { entityKey: string, categoryKey: string } }
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const MIGRATION_MAPPING_URL = `${basePath}/data/migration_mapping_3.1.json`;

const migration: Migration = {
  version: "2026-04-15T00-16",
  description: "Convert old marker IDs to mapId_entityId format",
  up: async () => {
    if (typeof window === "undefined") return;

    const data = loadMapData();
    // new user so no data
    if (!data || !data.visitedMarkers) return;

    const oldIds = Object.keys(data.visitedMarkers)
      .map(Number)
      .filter((id) => !isNaN(id) && data.visitedMarkers[id]);
    if (oldIds.length === 0) return;

    // Fetch the pre-computed mapping.
    // Bypassing cache as users must download this new dedicated URL.
    let legacyMap: Record<number, { entityKey: string, categoryKey: string }> = {};
    try {
      const res = await fetch(MIGRATION_MAPPING_URL, { cache: "no-store" });
      if (!res.ok) throw new Error("Failed to fetch legacy id mapping");
      legacyMap = await res.json();
    } catch (e) {
      console.error("Failed to fetch marker mapping for migration", e);
      throw e;
    }

    if (!data.visitedEntities) {
      data.visitedEntities = {};
    }

    let modified = false;

    for (const oldId of oldIds) {
      const mapping = legacyMap[oldId];
      if (!mapping) continue;

      const { entityKey, categoryKey } = mapping;

      if (!data.visitedEntities[entityKey]) {
        data.visitedEntities[entityKey] = new Set<string>();
      }

      data.visitedEntities[entityKey].add(categoryKey);

      // We keep old visitedMarkers for safety
      // TODO: DEPRECATED
      modified = true;
    }

    const CURRENT_VERSION = "3.2";
    const schemaVersion = localStorage.getItem("wave_tools_schema_version");
    if (!schemaVersion || schemaVersion < CURRENT_VERSION) {
      localStorage.setItem("wave_tools_schema_version", CURRENT_VERSION);
    }

    if (modified) {
      localStorage.setItem("wave_tools_map_visited_markers_backup", JSON.stringify(data.visitedMarkers));
      console.info("Migrated", oldIds.length, "markers to " + Object.keys(data.visitedEntities).length);
      saveMapData(data);
    } else {
      console.info("No new markers to migrate");
    }
  }
};

export default migration;
