import { __ALL_MAPS__, __ALL_MAPS_BUT_DEFINED__, __ALL_MAPS_BUT_DEFINED_AND_TEST_DUNGEON__, __ALL_MAPS_BUT_DUNGEONS_AND_TEST__, __ALL_MAPS_BUT_TEST_DUNGEON__, __ALL_MAPS_BUT_WORLD_MAP_AND_TEST__, __DUNGEONS_ONLY__, __WORLD_MAPS__, MainStoryDungeonName, MapName, SonoroDungeonName, StoryDungeonName, TestDungeonName } from "@/app/map/mapUtils";

export interface DbMapData {
  visibleCategories: Record<string, boolean>,
  // DEPRECATED - moved to visitedEntities in 3.2
  // visitedMarkers: Record<number, boolean>,
  // key: e_{mapId}_{entityId}, value: Set of category keys
  visitedEntities: Record<string, Set<string>>,
  displayedCategoryGroups: Record<string, boolean>,
}

export interface APIAreaLayer {
  mapId: number;
  areaId: number;
  mapTiles: Record<string, string>;
}

export interface APIMapMark {
  id: number;
  mapId: number;
  relativeId: number;
  entityConfigId: number;
  icon: string;
  title: string;
}

export interface APIQuestData {
  id: number;
  mapId: number;
  questTypeId: number;
  chapterId: number;
  name: string;
  description: string;
  trackEntityId: number;
  typeName: string;
  chapterName: string;
}

export interface APILevelPlayData {
  LevelPlayId: number;
  Id?: number;
  Key?: string;
  TidName: string;
  LevelPlayEntityId?: number;
  LevelPlayMark?: string;
  Reference: string[];
  Children: string[];
  Type?: string;
}

export interface APIQuestData {
  QuestId: number;
  Id?: number;
  Type: string;
  RegionId: number;
  RoleId: number;
  Key: string;
  TidName: string;
  TidDesc: string;
  RewardId: number;
  ProvideType: string;
  DistributeType: string;
  Reference: string[];
  Children: string[];
  WeakReference: string[];
  ActiveActions: unknown;
  AddInteractOption: unknown;
}

export type SelectedMap = MapName
  | MainStoryDungeonName
  | StoryDungeonName
  | SonoroDungeonName
  | TestDungeonName
  | typeof __ALL_MAPS__
  | typeof __WORLD_MAPS__
  | typeof __DUNGEONS_ONLY__
  | typeof __ALL_MAPS_BUT_DEFINED__
  | typeof __ALL_MAPS_BUT_DEFINED_AND_TEST_DUNGEON__
  | typeof __ALL_MAPS_BUT_DUNGEONS_AND_TEST__
  | typeof __ALL_MAPS_BUT_WORLD_MAP_AND_TEST__
  | typeof __ALL_MAPS_BUT_TEST_DUNGEON__;