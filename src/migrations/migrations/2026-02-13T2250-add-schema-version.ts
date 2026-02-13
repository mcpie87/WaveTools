import { Migration } from "../migrationTypes";

const migration20260213T2250: Migration = {
  // version 3.0 is when map was introduced
  version: "2026-02-13T22-50",
  description: "Added schema key",
  up: async () => {
    const CURRENT_VERSION = "3.0";
    const schemaVersion = localStorage.getItem("wave_tools_schema_version");
    if (!schemaVersion || schemaVersion < CURRENT_VERSION) {
      localStorage.setItem("wave_tools_schema_version", CURRENT_VERSION);
    }
    const updatedSchemaVersion = localStorage.getItem("wave_tools_schema_version");
    if (updatedSchemaVersion !== CURRENT_VERSION) {
      console.error("Migration failed: contact developer", updatedSchemaVersion);
      throw Error("Migration failed: contact developer");
    }
  }
}
export default migration20260213T2250;
