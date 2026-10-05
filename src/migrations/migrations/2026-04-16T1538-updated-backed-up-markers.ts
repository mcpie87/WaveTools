import { loadMapData, MAP_VISITED_MARKERS_BACKUP_KEY, saveMapData } from "../migration.utils";
import { Migration } from "../migrationTypes";

// This URL will host a pre-computed mapping of:
// { [oldId: number]: { entityKey: string, categoryKey: string } }
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const MIGRATION_MAPPING_URL = `${basePath}/data/migration_mapping_3.1.json`;

const migration: Migration = {
  version: "2026-04-16T15-38",
  description: "Update backed up markers after hydration failure",
  up: async () => {
    // This is pretty much copy pasted code from previous migration but it uses the backed up key
    const backupMarkers = JSON.parse(localStorage.getItem(MAP_VISITED_MARKERS_BACKUP_KEY) ?? "{}");
    if (!backupMarkers) return;

    const data = loadMapData();
    // new user so no data
    if (!data) return;

    const oldIds = Object.keys(backupMarkers)
      .map(Number)
      .filter((id) => !isNaN(id) && backupMarkers[id]);
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

    const CURRENT_VERSION = "3.2.1";
    const schemaVersion = localStorage.getItem("wave_tools_schema_version");
    if (!schemaVersion || schemaVersion < CURRENT_VERSION) {
      localStorage.setItem("wave_tools_schema_version", CURRENT_VERSION);
    }

    if (modified) {
      console.info("Migrated", oldIds.length, "markers to " + Object.keys(data.visitedEntities).length);
      saveMapData(data);
    } else {
      console.info("No new markers to migrate");
    }
  }
};

export default migration;
