import { APIMapMark, APIQuestData } from "@/types/mapTypes";

const lookupMap = new Map<number, Map<number, APIMapMark>>();
const questByEntityId = new Map<string, APIQuestData>();
const [mapMarksData, questData]: [APIMapMark[], APIQuestData[]] =
  await Promise.all([
    fetch("/data/map_marks_minified.json").then((r) => r.json()),
    fetch("/data/quest_types_minified.json").then((r) => r.json()),
  ]);

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
}

export { mapMarksData, questData, questByEntityId };

export const getMapMark = (mapId: number, entityConfigId: number | undefined): APIMapMark | undefined => {
  if (entityConfigId === undefined) return undefined;
  return lookupMap.get(mapId)?.get(entityConfigId);
};

export const getQuestData = (key: string): APIQuestData | undefined => {
  return questByEntityId.get(key);
};
