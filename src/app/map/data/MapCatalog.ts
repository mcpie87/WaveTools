import {
  APIBlueprintReward,
  APILevelPlayData,
  APIMapMark,
  APIQuestData,
  BlueprintType,
} from "@/types/mapTypes";

export interface MapCatalogSource {
  mapMarks: APIMapMark[];
  questTypes: APIQuestData[];
  levelPlayData: APILevelPlayData[];
  blueprintRewards: Record<BlueprintType, APIBlueprintReward>;
  blueprints: Record<string, string>;
}

export interface MapCatalog extends MapCatalogSource {
  lookupMap: Map<number, Map<number, APIMapMark>>;
  questByEntityId: Map<string, APIQuestData[]>;
  questDataByQuestId: Map<number, APIQuestData>;
  leveldataByEntityId: Map<string, APILevelPlayData>;
  questsByChildren: Map<string, APIQuestData[]>;
  questsByReference: Map<string, APIQuestData[]>;
  leveldataByChildren: Map<string, APILevelPlayData[]>;
  leveldataByReference: Map<string, APILevelPlayData[]>;
}

function appendToIndex<T>(
  index: Map<string, T[]>,
  key: string,
  value: T,
): void {
  const values = index.get(key);
  if (values) values.push(value);
  else index.set(key, [value]);
}

export function buildMapCatalog(source: MapCatalogSource): MapCatalog {
  const lookupMap = new Map<number, Map<number, APIMapMark>>();
  const questByEntityId = new Map<string, APIQuestData[]>();
  const questDataByQuestId = new Map<number, APIQuestData>();
  const leveldataByEntityId = new Map<string, APILevelPlayData>();
  const questsByChildren = new Map<string, APIQuestData[]>();
  const questsByReference = new Map<string, APIQuestData[]>();
  const leveldataByChildren = new Map<string, APILevelPlayData[]>();
  const leveldataByReference = new Map<string, APILevelPlayData[]>();

  for (const mark of source.mapMarks) {
    if (mark.entityConfigId === 0) continue;
    let byEntity = lookupMap.get(mark.mapId);
    if (!byEntity) {
      byEntity = new Map();
      lookupMap.set(mark.mapId, byEntity);
    }
    byEntity.set(mark.entityConfigId, mark);
  }

  for (const quest of source.questTypes) {
    appendToIndex(questByEntityId, `${quest.trackEntityId}`, quest);
    questDataByQuestId.set(quest.id, quest);
    for (const child of quest.children ?? [])
      appendToIndex(questsByChildren, child, quest);
    for (const reference of quest.references ?? [])
      appendToIndex(questsByReference, reference, quest);
  }

  for (const levelPlay of source.levelPlayData) {
    leveldataByEntityId.set(levelPlay.LevelPlayEntityId, levelPlay);
    for (const child of levelPlay.Children ?? [])
      appendToIndex(leveldataByChildren, child, levelPlay);
    for (const reference of levelPlay.Reference ?? [])
      appendToIndex(leveldataByReference, reference, levelPlay);
  }

  return {
    ...source,
    lookupMap,
    questByEntityId,
    questDataByQuestId,
    leveldataByEntityId,
    questsByChildren,
    questsByReference,
    leveldataByChildren,
    leveldataByReference,
  };
}
