import { APIMapMark } from "@/types/mapTypes";
import mapMarksRaw from "./map_marks.json";

export const mapMarksData: APIMapMark[] = mapMarksRaw as APIMapMark[];

// MapId -> EntityConfigId -> APIMapMark
const lookupMap = new Map<number, Map<number, APIMapMark>>();

for (const mark of mapMarksData) {
  if (mark.entityConfigId === 0) continue;
  if (!lookupMap.has(mark.mapId)) {
    lookupMap.set(mark.mapId, new Map());
  }
  lookupMap.get(mark.mapId)!.set(mark.entityConfigId, mark);
}

export const getMapMark = (mapId: number, entityConfigId: number | undefined): APIMapMark | undefined => {
  if (entityConfigId === undefined) return undefined;
  return lookupMap.get(mapId)?.get(entityConfigId);
};
