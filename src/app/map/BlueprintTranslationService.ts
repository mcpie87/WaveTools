let blueprintTranslations: Record<string, string> | null = null;
let loadPromise: Promise<Record<string, string>> | null = null;

export async function loadBlueprintTranslations(): Promise<Record<string, string>> {
  if (blueprintTranslations) return blueprintTranslations;
  if (loadPromise) return loadPromise;

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  loadPromise = fetch(`${basePath}/data/blueprints_minified.json`)
    .then(res => {
      if (!res.ok) throw new Error("Failed to load blueprint translations");
      return res.json();
    })
    .then(data => {
      blueprintTranslations = data;
      return data;
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
