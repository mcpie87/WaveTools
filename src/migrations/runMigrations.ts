import LocalStorageService from "@/services/LocalStorageService";
import { migrations } from "./migrations";

const localStorageService = new LocalStorageService("version");

export const runMigrations = async (): Promise<boolean> => {
  let currentVersion = localStorageService.load();
  if (!currentVersion) {
    currentVersion = "1970-01-01T00-00";
  }

  try {
    for (const migration of migrations) {
      const { version, description, up } = migration;

      if (version > currentVersion) {
        console.log(`Migrating to version ${version} - ${description}`);
        await up();
        currentVersion = version;
        localStorageService.save(currentVersion);
      }
    }
  } catch (error) {
    console.error("Error migrating:", error);
    return false;
  }
  return true;
}
