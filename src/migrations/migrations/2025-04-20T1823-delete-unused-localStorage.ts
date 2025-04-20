import { Migration } from "../migrationTypes";

// first migration
const migration20250420T1823: Migration = {
  version: "2025-04-20T18-23",
  description: "Delete unused localStorage keys",
  up: async () => {
    // Delete unused keys
    const keysToDelete = [
      "wave_tools_items",
      "wuwa_planner/characters",
      "wuwa_planner/resonators",
      "wuwa_planner/weapons",
      "wuwa_planner/items",
      "wuwa_planner_resonators",
      "wuwa_planner_weapons",
      "wuwa_planner_items",
    ]

    for (const key of keysToDelete) {
      localStorage.removeItem(key);
    }
  }
}
export default migration20250420T1823;