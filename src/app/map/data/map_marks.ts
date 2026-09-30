import {
  APIBlueprintReward,
  APILevelPlayData,
  APIMapMark,
  APIQuestData,
  BlueprintType,
} from "@/types/mapTypes";
import { MapCatalog } from "./MapCatalog";

let catalog: MapCatalog | null = null;

export const mapMarksData: APIMapMark[] = [];
export const questData: APIQuestData[] = [];
export const questByEntityId = new Map<string, APIQuestData[]>();

export function installMapCatalog(nextCatalog: MapCatalog): void {
  catalog = nextCatalog;
  mapMarksData.length = 0;
  questData.length = 0;
  for (const mark of nextCatalog.mapMarks) mapMarksData.push(mark);
  for (const quest of nextCatalog.questTypes) questData.push(quest);
  questByEntityId.clear();
  for (const [key, quests] of nextCatalog.questByEntityId)
    questByEntityId.set(key, quests);
}

export const getMapMark = (
  mapId: number,
  entityConfigId: number | undefined,
): APIMapMark | undefined => {
  if (entityConfigId === undefined) return undefined;
  return catalog?.lookupMap.get(mapId)?.get(entityConfigId);
};

export const getQuestInfo = (id: number): APIQuestData | undefined =>
  catalog?.questDataByQuestId.get(id);

export const getQuestData = (key: string): APIQuestData[] | undefined =>
  catalog?.questByEntityId.get(key);

export const getLevelPlayData = (key: string): APILevelPlayData | undefined =>
  catalog?.leveldataByEntityId.get(key);

export const getQuestChildren = (key: string): APIQuestData[] | undefined =>
  catalog?.questsByChildren.get(key);

export const getQuestReferences = (key: string): APIQuestData[] | undefined =>
  catalog?.questsByReference.get(key);

export const getLevelPlayChildren = (
  key: string,
): APILevelPlayData[] | undefined => catalog?.leveldataByChildren.get(key);

export const getLevelPlayReferences = (
  key: string,
): APILevelPlayData[] | undefined => catalog?.leveldataByReference.get(key);

export const getBlueprintRewards = (
  key: BlueprintType,
): APIBlueprintReward | undefined => catalog?.blueprintRewards[key];
