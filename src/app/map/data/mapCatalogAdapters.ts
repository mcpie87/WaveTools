import {
  APIBlueprintReward,
  APILevelPlayData,
  APIMapMark,
  APIQuestData,
  BlueprintType,
} from "@/types/mapTypes";
import { buildMapCatalog, MapCatalog, MapCatalogSource } from "./MapCatalog";

export interface MapCatalogAdapter {
  load(): Promise<MapCatalog>;
}

type FetchLike = (
  input: RequestInfo | URL,
  init?: RequestInit,
) => Promise<Response>;

export function createFetchMapCatalogAdapter(
  basePath: string,
  fetcher?: FetchLike,
): MapCatalogAdapter {
  let loadPromise: Promise<MapCatalog> | null = null;
  const request = fetcher ?? ((input, init) => fetch(input, init));

  return {
    load() {
      if (!loadPromise) {
        const paths = [
          "map_marks_minified.json",
          "quest_types_minified.json",
          "levelplaydata_minified.json",
          "blueprint_rewards_minified.json",
          "blueprints_minified.json",
        ];
        loadPromise = Promise.all(
          paths.map(async (path) => {
            const response = await request(`${basePath}/data/${path}`);
            if (!response.ok)
              throw new Error(
                `Failed to load ${path}: HTTP ${response.status}`,
              );
            return response.json();
          }),
        ).then(
          ([
            mapMarks,
            questTypes,
            levelPlayData,
            blueprintRewards,
            blueprints,
          ]) =>
            buildMapCatalog({
              mapMarks: mapMarks as APIMapMark[],
              questTypes: questTypes as APIQuestData[],
              levelPlayData: levelPlayData as APILevelPlayData[],
              blueprintRewards: blueprintRewards as Record<
                BlueprintType,
                APIBlueprintReward
              >,
              blueprints: blueprints as Record<string, string>,
            }),
        );
      }
      return loadPromise;
    },
  };
}

export function createFixtureMapCatalogAdapter(
  source: MapCatalogSource,
): MapCatalogAdapter {
  return { load: async () => buildMapCatalog(source) };
}

export const fetchMapCatalogAdapter = createFetchMapCatalogAdapter(
  process.env.NEXT_PUBLIC_BASE_PATH || "",
);
