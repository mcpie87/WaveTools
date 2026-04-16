import { readFileSync } from 'fs';
import path from 'path';

// 1. Mock global fetch before any imports occur
/* eslint-disable */
(globalThis as any).fetch = async (url: string) => {

  const urlString = url.toString();

  // Intercept the relative data paths
  if (urlString.startsWith('/data/')) {
    const filePath = path.resolve('../public', urlString.slice(1));
    try {
      const content = readFileSync(filePath, 'utf8');
      return {
        json: async () => JSON.parse(content),
        ok: true,
        status: 200,
      };
    } catch (err) {
      throw new Error(`Mock fetch failed to read: ${filePath}`);
    }
  }

  // Fallback to real fetch for external URLs (like your WWF API link)
  const { fetch } = await import('node-fetch' as any).catch(() => ({ fetch: globalThis.fetch }));
  return fetch(url);
};
/* eslint-enable */

import fs from 'fs';
import { getMatchedTrackableCategories } from '../src/app/map/TranslationMaps/translationMap';
import { APIMarker } from '../src/app/map/types';

// Genera
async function generate() {
  /* eslint-disable */
  // Need to silence leaflet import
  (global as any).window = {
    addEventListener: () => { },
    removeEventListener: () => { },
    screen: {},

  };
  (global as any).document = {
    documentElement: { style: {} },
    getElementsByTagName: () => [],
    createElement: () => ({ style: {} })
  };
  /* eslint-enable */
  const { convertMarkerToCoord } = await import('../src/app/map/mapUtils');

  console.log("Fetching raw API markers...");
  // 3.1 localentityconfig
  const url = 'https://wwfmp0c1vm.ufs.sh/f/GKKXYOQgq7aYJjynAOgE0xzLG7NC35IMYJrq9uTnS4KXpDBO';
  const res = await fetch(url);
  const markers = await res.json() as APIMarker[];

  console.log(`Processing ${markers.length} markers...`);
  const mapping: Record<number, { entityKey: string, categoryKey: string }> = {};

  let mappedCount = 0;

  const ignoredCategories = new Set([
    "QUEST_UNKNOWN_???",
    "QUEST_UNKNOWN_?",
    "INTERACT_UNKNOWN",
    "INSPECT",
  ])
  for (const marker of markers) {
    let iMarker;
    try {
      iMarker = convertMarkerToCoord(marker, {});
    } catch (e) {
      console.log(e);
      continue;
    }

    const matched = getMatchedTrackableCategories(iMarker);
    const categoryKey = matched.length > 0 ? matched[0].key : undefined;
    const isValidMatch = categoryKey
      && !categoryKey?.match("^(ECHO_|PLANT_|SPECIALTY_|ENEMY_NPC_|ANIMAL_|ORE_|MISC_)")
      && !ignoredCategories.has(categoryKey);

    if (isValidMatch) {
      const entityKey = `e_${marker.MapId}_${marker.EntityId}`;
      mapping[marker.Id] = {
        entityKey,
        categoryKey
      };
      mappedCount++;
    }
  }

  const outputDir = path.resolve('../public/data');
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const outPath = path.join(outputDir, 'migration_mapping_3.1.json');
  fs.writeFileSync(outPath, JSON.stringify(mapping));
  console.log(`Successfully generated mapping for ${mappedCount} valid marker IDs into ${outPath}`);
}

await generate();
