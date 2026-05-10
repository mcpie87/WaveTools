import { APILevelPlayData, APIMapMark, APIQuestData } from "@/types/mapTypes";
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
const lookupMap = new Map<number, Map<number, APIMapMark>>();
const questByEntityId = new Map<string, APIQuestData>();
const leveldataByEntityId = new Map<string, APILevelPlayData>();
const questsByChildren = new Map<string, APIQuestData[]>();
const questsByReference = new Map<string, APIQuestData[]>();
const leveldataByChildren = new Map<string, APILevelPlayData[]>();
const leveldataByReference = new Map<string, APILevelPlayData[]>();
const [mapMarksData, questData, levelPlayData]: [APIMapMark[], APIQuestData[], APILevelPlayData[]] =
  await Promise.all([
    fetch(`${basePath}/data/map_marks_minified.json`).then((r) => r.json()),
    fetch(`${basePath}/data/quest_types_minified.json`).then((r) => r.json()),
    fetch(`${basePath}/data/levelplaydata_minified.json`).then((r) => r.json()),
  ]);

const questDataByQuestId = new Map<number, APIQuestData>();


for (const mark of mapMarksData) {
  if (mark.entityConfigId === 0) continue;
  if (!lookupMap.has(mark.mapId)) {
    lookupMap.set(mark.mapId, new Map());
  }
  lookupMap.get(mark.mapId)!.set(mark.entityConfigId, mark);
}

for (const quest of questData) {
  const key = `${quest.mapId}-${quest.trackEntityId}`;
  questByEntityId.set(key, quest);
  questDataByQuestId.set(quest.id, quest);

  if (quest.children && quest.children.length > 0) {
    for (const child of quest.children) {
      if (!questsByChildren.has(child)) {
        questsByChildren.set(child, []);
      }
      questsByChildren.get(child)!.push(quest);
    }
  }

  if (quest.references && quest.references.length > 0) {
    for (const reference of quest.references) {
      if (!questsByReference.has(reference)) {
        questsByReference.set(reference, []);
      }
      questsByReference.get(reference)!.push(quest);
    }
  }
}

for (const lp of levelPlayData) {
  const key = `${lp.mapId}-${lp.LevelPlayEntityId}`;
  leveldataByEntityId.set(key, lp);

  if (lp.Children && lp.Children.length > 0) {
    for (const child of lp.Children) {
      if (!leveldataByChildren.has(child)) {
        leveldataByChildren.set(child, []);
      }
      leveldataByChildren.get(child)!.push(lp);
    }
  }

  if (lp.Reference && lp.Reference.length > 0) {
    for (const reference of lp.Reference) {
      if (!leveldataByReference.has(reference)) {
        leveldataByReference.set(reference, []);
      }
      leveldataByReference.get(reference)!.push(lp);
    }
  }
}
export { mapMarksData, questData, questByEntityId };

export const getMapMark = (mapId: number, entityConfigId: number | undefined): APIMapMark | undefined => {
  if (entityConfigId === undefined) return undefined;
  return lookupMap.get(mapId)?.get(entityConfigId);
};

export const getQuestInfo = (id: number): APIQuestData | undefined => {
  return questDataByQuestId.get(id);
}

export const getQuestData = (key: string): APIQuestData | undefined => {
  return questByEntityId.get(key);
};

export const getLevelPlayData = (key: string): APILevelPlayData | undefined => {
  return leveldataByEntityId.get(key);
};


export const getQuestChildren = (key: string): APIQuestData[] | undefined => {
  return questsByChildren.get(key);
};

export const getQuestReferences = (key: string): APIQuestData[] | undefined => {
  return questsByReference.get(key);
};

export const getLevelPlayChildren = (key: string): APILevelPlayData[] | undefined => {
  return leveldataByChildren.get(key);
};

export const getLevelPlayReferences = (key: string): APILevelPlayData[] | undefined => {
  return leveldataByReference.get(key);
};