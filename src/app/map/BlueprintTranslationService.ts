import { fetchMapCatalogAdapter } from "./data/mapCatalogAdapters";
import { installMapCatalog } from "./data/map_marks";

let blueprintTranslations: Record<string, string> | null = null;
let loadPromise: Promise<Record<string, string>> | null = null;

export async function loadBlueprintTranslations(): Promise<
  Record<string, string>
> {
  if (blueprintTranslations) return blueprintTranslations;
  if (loadPromise) return loadPromise;

  loadPromise = fetchMapCatalogAdapter.load().then((catalog) => {
    installMapCatalog(catalog);
    blueprintTranslations = catalog.blueprints;
    return blueprintTranslations;
  });

  return loadPromise;
}

export function translateBlueprint(category: string): string {
  if (!blueprintTranslations) {
    console.warn("Blueprint translations not loaded yet");
    return "No translation";
  }
  return blueprintTranslations[category] || "No translation";
}
