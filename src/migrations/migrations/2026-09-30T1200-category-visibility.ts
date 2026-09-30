import { loadMapData, saveMapData } from "../migration.utils";
import { Migration } from "../migrationTypes";

const migrateVisibility = (
  visibility: Record<string, boolean> = {},
  getTrackingKey: (category: string) => string
) => {
  const migrated: Record<string, boolean> = {};

  for (const [category, isVisible] of Object.entries(visibility)) {
    const categoryKey = getTrackingKey(category);
    migrated[categoryKey] = (migrated[categoryKey] ?? false) || isVisible;
  }

  return migrated;
};

const migration: Migration = {
  version: "2026-09-30T12-00",
  description: "Group map visibility by category",
  up: async () => {
    const data = loadMapData();
    if (data) {
      const { getTrackingKey } = await import("@/app/map/TranslationMaps/translationMap");
      const categoryPresets = (data as typeof data & {
        categoryPresets?: Record<string, Record<string, boolean>>;
      }).categoryPresets;

      const migratedData = {
        ...data,
        visibleCategories: migrateVisibility(data.visibleCategories, getTrackingKey),
        categoryPresets: Object.fromEntries(
          Object.entries(categoryPresets ?? {}).map(([name, preset]) => [
            name,
            migrateVisibility(preset, getTrackingKey),
          ])
        ),
      };
      saveMapData(migratedData);
    }

    const schemaVersion = localStorage.getItem("wave_tools_schema_version");
    if (!schemaVersion || schemaVersion < "3.3") {
      localStorage.setItem("wave_tools_schema_version", "3.3");
    }
  },
};

export default migration;
