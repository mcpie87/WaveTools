import { SelectedMap } from "@/types/mapTypes";
import { APIMarker, IMarker } from "./types";
import L from 'leaflet';

export const scaleFactor = 0.30118;
export const TILE_SIZE = 256;

const translateGameToMapX = (x: number) => TILE_SIZE + scaleFactor * (x / 10000);
const translateGameToMapY = (y: number) => -scaleFactor * (y / 10000);
const translateGameToMap = ({ x, y, z }: { x: number; y: number; z: number }) => ({
  x: translateGameToMapX(x),
  y: translateGameToMapY(y),
  z: z / 10000,
});
const translateMapToGameX = (x: number) => (x - TILE_SIZE) * 10000 / scaleFactor;
const translateMapToGameY = (y: number) => -y * 10000 / scaleFactor;
// const translateMapToGame = ({ x, y, z }: { x: number; y: number; z: number }) => ({
//   x: translateMapToGameX(x),
//   y: translateMapToGameY(y),
//   z: z * 10000,
// });
export const getGameBounds = (mapName: UnionMapName) => {
  const { bounds } = unionMapConfigs[mapName];
  if (!bounds) return undefined;
  return [
    [translateMapToGameY(bounds[0][0] * TILE_SIZE), translateMapToGameY(bounds[0][1] * TILE_SIZE)],
    [translateMapToGameX(bounds[1][0] * TILE_SIZE), translateMapToGameX(bounds[1][1] * TILE_SIZE)],
  ]
}
export const __ALL_MAPS__ = "__ALL_MAPS__" as const;
export const __ALL_MAPS_BUT_DEFINED__ = "__ALL_MAPS_BUT_DEFINED__" as const;
export const __ALL_MAPS_BUT_DEFINED_AND_TEST_DUNGEON__ = "__ALL_MAPS_BUT_DEFINED_AND_TEST_DUNGEON__" as const;
export const __ALL_MAPS_BUT_TEST_DUNGEON__ = "__ALL_MAPS_BUT_TEST_DUNGEON__" as const;
export const __ALL_MAPS_BUT_DUNGEONS_AND_TEST__ = "__ALL_MAPS_BUT_DUNGEONS_AND_TEST__" as const;
export const __ALL_MAPS_BUT_WORLD_MAP_AND_TEST__ = "__ALL_MAPS_BUT_WORLD_MAP_AND_TEST__" as const;
export const __WORLD_MAPS__ = "__WORLD_MAPS__" as const;
export const __DUNGEONS_ONLY__ = "__DUNGEONS_ONLY__" as const;

export const isCustomMapSelected = (selectedMap: SelectedMap) => {
  return ([
    __ALL_MAPS__,
    __ALL_MAPS_BUT_DEFINED__,
    __ALL_MAPS_BUT_DEFINED_AND_TEST_DUNGEON__,
    __ALL_MAPS_BUT_TEST_DUNGEON__,
    __ALL_MAPS_BUT_DUNGEONS_AND_TEST__,
    __ALL_MAPS_BUT_WORLD_MAP_AND_TEST__,
    __WORLD_MAPS__,
    __DUNGEONS_ONLY__,
  ] as SelectedMap[]).includes(selectedMap);
}

export const getBounds = (mapName: UnionMapName, padding = 0) => {
  const config = unionMapConfigs[mapName];
  if (!config?.bounds) return undefined;
  const { bounds } = config;
  return L.latLngBounds(
    L.latLng((bounds[0][0] - padding) * TILE_SIZE, (bounds[1][0] - padding) * TILE_SIZE),
    L.latLng((bounds[0][1] + padding) * TILE_SIZE, (bounds[1][1] + padding) * TILE_SIZE)
  );
}

export const isGameCoordInGameBounds = (mapName: SelectedMap, x: number, y: number) => {
  if (isCustomMapSelected(mapName)) return true;

  const bounds = getGameBounds(mapName as UnionMapName);
  if (!bounds) return true;
  // y is REVERSED due to map translation
  return bounds[0][1] <= y && y <= bounds[0][0] && bounds[1][0] <= x && x <= bounds[1][1];
}
export const getMapCenter = (mapName: SelectedMap): L.LatLngExpression => {
  if (isCustomMapSelected(mapName)) return [0, 0];

  const config = mapConfigs[mapName];
  if (!config?.bounds) return [0, 0];

  const { bounds } = config;

  return [
    (bounds[0][0] + bounds[0][1]) * (TILE_SIZE) / 2,
    (bounds[1][0] + bounds[1][1]) * (TILE_SIZE) / 2
  ]
}

export const convertMarkerToCoord = (marker: APIMarker, visitedMap: Record<number, boolean>): IMarker => ({
  ...translateGameToMap({
    x: marker.Transform[0].X,
    y: marker.Transform[0].Y,
    z: marker.Transform[0].Z,
  }),
  id: marker.Id,
  areaId: marker.AreaId!,
  name: marker.BlueprintType,
  description: JSON.stringify(marker, null, 2),
  displayedX: marker.Transform[0].X / 10000,
  displayedY: marker.Transform[0].Y / 10000,
  displayedZ: marker.Transform[0].Z / 10000,
  category: marker.BlueprintType,
  visited: visitedMap[marker.MapId] || false,
});


export const MAP_TILES_URL = "https://raw.githubusercontent.com/mcpie87/wuwa-map-tiles/refs/heads/master";
const prefix = MAP_TILES_URL;
// ? `${MAP_TILES_URL}` //'/map_tiles/'
// : `${ASSET_URL}UIResources/UiWorldMap/Image`;

const format = 'webp';


export enum MapName {
  SOLARIS_3 = "Solaris-3",
  RINASCITA = "Rinascita",
  SEPTIMONT = "Septimont",
  TETHYS_DEEP = "Tethys Deep",
  VAULT_UNDERGROUNDS = "Vault Undergrounds",
  AVINOLEUM = "Avinoleum",
  FABRICATORIUM = "Fabricatorium of the Deep",
  // HONAMI_CITY_WAR = "Honami City - war area",
  HONAMI_CITY = "Honami City",
  LAHAI_ROI = "Lahai Roi",
  ROYA_FROSTLANDS = "Roya Frostlands",
}

// dig in instancedungeon.json for translations
export enum MainStoryDungeonName {
  GRAND_LIBRARY = "(Jinhsi) Grand Library",
  WARBLADE_FROM_ABOVE = "(Dreamless) Warblade From Above",
  BLACK_SHORES_STELLAR_MATRIX = "(Shorekeeper) Black Shores Stellar Matrix",
  RINASCITA_AVERARDO_VAULT = "(Carlotta) Averardo Vault",
  RINASCITA_AVERARDO_UNDERGROUNDS_TOWER = "(Zani+Phoebe) Abandoned Tower",
  // Timestamp for below https://www.youtube.com/watch?v=431EyYmXbtA&t=1381s
  FABRICATORIUM_PHROLOVA = "(Fabricatorium) The Lost Beyond",
  IUNO_CHAOS = "(Iuno) Chaos Dungeon",
  // aka leviathan dungeon during galbrena release
  SEPTIMONT_PLANE_OF_THE_DARK_TIDE = "(Septimont) Plane of the Dark Tide",
}
export enum StoryDungeonName {
  STORY_JIYAN = "Jiyan",
  STORY_YINLIN = "Yinlin",
  STORY_LINGYANG = "Lingyang",
  STORY_ZHEZHI = "Zhezhi",
  STORY_CHANGLI = "Changli",
  STORY_ENCORE_PART_1 = "Encore Part 1",
  STORY_ENCORE_PART_2 = "Encore Part 2",
  STORY_CAMELLYA = "Camellya",
  STORY_CARLOTTA = "Carlotta",
  STORY_ROCCIA = "Roccia",
  STORY_ZANI = "Zani",
  STORY_CANTARELLA = "Cantarella",
}
export enum SonoroDungeonName {
  // 1.0
  WILL_OF_FLAT_HORIZON = "Will of the Flat Horizon",
  CONFIGURATIONAL_TRUTH = "Configurational Truth",
  // 1.1
  OFFERING_SITE = "Offering Site",
  // 2.0
  THE_PRISONED_SONG = "The Prisoned Song",
  COMMAND_RISE = "Command Rise",
  TWILIGHT_RISE = "Twilight Rise",
  RESOUNDING_RISE = "Resounding Rise",
}
export enum TestDungeonName {
  TEST_DUNGEON = "Game Test Dungeon",
  TEST_DUNGEON_2 = "World Test Map",
  TEST_DUNGEON_3 = "Test ??? 1",
  TEST_DUNGEON_4 = "Test ??? 2",
  TEST_DUNGEON_5 = "Test ??? 3",
  TEST_DUNGEON_6 = "Test ??? 4",
  TEST_DUNGEON_7 = "Test ??? 5",
  TEST_DUNGEON_8 = "Test ??? 6",
  TEST_DUNGEON_9 = "Test ??? 7",
  VEHICLE_TEST = "Vehicle Test",
  TD_INTERACTION_TEST = "TD Interaction Test",
  STORY_JIYAN = "Jiyan Test ?",
  AUTOMATION_SAMPLE_TEST = "Automation Sample Test",
  TASK_CONFIGURATION_TEST_MAP = "Task Configuration Test Map",
  YANGYANG_TEST_DUNGEON = "Yangyang Test Dungeon",
}

export type UnionMapName = MapName | StoryDungeonName | SonoroDungeonName | TestDungeonName;

export interface MapConfig {
  mapId: number;
  bounds?: number[][];
  url?: string;
}
// bounds is [minY, maxY], [minX, maxX]
// keep in mind, game inverts Y
export const mapConfigs: Record<string, MapConfig> = {
  [MapName.SOLARIS_3]: {
    mapId: 8,
    bounds: [[-5, 2], [-2, 6]],
    url: `${prefix}/MapTiles/T_MapTiles_{x}_{y}_UI.${format}`
  },
  [MapName.RINASCITA]: {
    mapId: 8,
    bounds: [[-12, -2], [8, 15]],
    url: `${prefix}/MapTiles/T_MapTiles_{x}_{y}_UI.${format}`
  },
  [MapName.SEPTIMONT]: {
    mapId: 8,
    bounds: [[-18, -11], [13, 18]],
    url: `${prefix}/MapTiles/T_MapTiles_{x}_{y}_UI.${format}`
  },
  [MapName.TETHYS_DEEP]: {
    mapId: 900,
    bounds: [[-2, 1], [0, 2]],
    url: `${prefix}/HHATiles/T_HHATiles_{x}_{y}_UI.${format}`
  },
  [MapName.VAULT_UNDERGROUNDS]: {
    mapId: 902,
    bounds: [[-2, 1], [2, 6]],
    url: `${prefix}/JKTiles/T_JKTiles_{x}_{y}_UI.${format}`
  },
  [MapName.AVINOLEUM]: {
    mapId: 903,
    bounds: [[-2, 2], [-1, 3]],
    url: `${prefix}/DDTTiles/T_DDTTiles_{x}_{y}_UI.${format}`
  },
  [MapName.FABRICATORIUM]: {
    mapId: 905,
    bounds: [[-6, 4], [-6, 7]],
    url: `${prefix}/YHSYCTiles/T_YHSYCTiles_{x}_{y}_UI.${format}`
  },
  [MapName.LAHAI_ROI]: {
    mapId: 906,
    bounds: [[3, 13], [-6, 5]],
    url: `${prefix}/LHLTiles/T_LHLTiles_{x}_{y}_UI.${format}`
  },
  // [MapName.HONAMI_CITY_WAR]: {
  //   mapId: 907,
  //   bounds: [[-4, 2], [-1, 2]],
  //   url: `${prefix}/SUIBOTiles/T_SUIBOTiles_{x}_{y}_UI.${format}`
  // },
  [MapName.HONAMI_CITY]: {
    mapId: 910,
    bounds: [[-1, 1], [0, 2]],
    url: `${prefix}/CAFETiles/T_CAFETiles_{x}_{y}_UI.${format}`
  },
  [MapName.ROYA_FROSTLANDS]: {
    mapId: 8,
    bounds: [[4, 14], [-5, 3]],
    url: `${prefix}/MapTiles/T_MapTiles_{x}_{y}_UI.${format}`
  },
} as const;

export const mainStoryDungeonMapConfigs: Record<string, MapConfig> = {
  [MainStoryDungeonName.GRAND_LIBRARY]: {
    // Shows 1/4/0/0 but real value is 1/3/0/0
    mapId: 49,
  },
  [MainStoryDungeonName.WARBLADE_FROM_ABOVE]: {
    mapId: 1504,
  },
  [MainStoryDungeonName.BLACK_SHORES_STELLAR_MATRIX]: {
    mapId: 1510, // 1006 - extremely fake values? yet translation is misleading
  },
  [MainStoryDungeonName.RINASCITA_AVERARDO_VAULT]: {
    mapId: 1511,
  },
  [MainStoryDungeonName.RINASCITA_AVERARDO_UNDERGROUNDS_TOWER]: {
    mapId: 1509,
  },
  [MainStoryDungeonName.SEPTIMONT_PLANE_OF_THE_DARK_TIDE]: {
    mapId: 1518,
  },
  [MainStoryDungeonName.IUNO_CHAOS]: {
    // Quest: Iuno hand holding dungeon
    mapId: 1532,
  },
  [MainStoryDungeonName.FABRICATORIUM_PHROLOVA]: {
    // Quest: ???
    mapId: 2513,
  },
};

export const storyDungeonMapConfigs: Record<string, MapConfig> = {
  [StoryDungeonName.STORY_JIYAN]: {
    mapId: 91,
  },
  [StoryDungeonName.STORY_YINLIN]: {
    // Shows 1/1/1/1
    // but real value is 1/0/0/1
    mapId: 95,
  },
  [StoryDungeonName.STORY_LINGYANG]: {
    mapId: 94,
  },
  [StoryDungeonName.STORY_ZHEZHI]: {
    mapId: 1002,
  },
  [StoryDungeonName.STORY_CHANGLI]: {
    mapId: 1001,
  },
  [StoryDungeonName.STORY_ENCORE_PART_1]: {
    mapId: 1007,
  },
  [StoryDungeonName.STORY_ENCORE_PART_2]: {
    mapId: 1008,
  },
  [StoryDungeonName.STORY_CAMELLYA]: {
    mapId: 1006,
  },
  [StoryDungeonName.STORY_CARLOTTA]: {
    // https://www.youtube.com/watch?v=-y8a32-8k64
    mapId: 1003,
  },
  [StoryDungeonName.STORY_ROCCIA]: {
    mapId: 1004,
  },
  [StoryDungeonName.STORY_ZANI]: {
    mapId: 1013,
  },
  [StoryDungeonName.STORY_CANTARELLA]: {
    mapId: 1010,
  },
};

export const sonoroDungeonMapConfigs: Record<string, MapConfig> = {
  // 1.0
  [SonoroDungeonName.WILL_OF_FLAT_HORIZON]: {
    // Will of the Flat Horizon (no quest)
    // https://www.youtube.com/watch?v=dMwew7Nf9VQ
    mapId: 2002,
  },
  [SonoroDungeonName.CONFIGURATIONAL_TRUTH]: {
    // Sonoro in Huanglong (no quest)
    // https://www.youtube.com/watch?v=w9NM31mgCoA
    mapId: 6001,
  },

  // 1.1
  [SonoroDungeonName.OFFERING_SITE]: {
    mapId: 1508,
  },


  // 2.0
  [SonoroDungeonName.THE_PRISONED_SONG]: {
    // Quests Hymn of the Sea of Clouds
    // https://www.youtube.com/watch?v=UhmwG26LQyk
    mapId: 6003,
  },
  [SonoroDungeonName.COMMAND_RISE]: {
    // Quest: The Command Rise
    // https://www.youtube.com/watch?v=AJPJz4J-HB8
    mapId: 2505,
  },
  [SonoroDungeonName.TWILIGHT_RISE]: {
    // Quest: Twilight Rise
    mapId: 2507,
  },
  [SonoroDungeonName.RESOUNDING_RISE]: {
    // Quest: Resounding Rise
    mapId: 2508,
  },
};

export const testDungeonMapConfigs: Record<string, MapConfig> = {
  [TestDungeonName.TEST_DUNGEON]: {
    mapId: 37,
  },
  [TestDungeonName.TEST_DUNGEON_2]: {
    mapId: 100, // This is pretty much the DEV environment - A LOT of things here
  },
  [TestDungeonName.TEST_DUNGEON_3]: {
    mapId: 77, // "Id": "InstanceDungeon_77_MapName", "Content": "test 副本 Function 展示",
  },
  [TestDungeonName.TEST_DUNGEON_4]: {
    mapId: 32, // "Id": "InstanceDungeon_32_MapName", "Content": "TD - Missions Test",
  },
  [TestDungeonName.TEST_DUNGEON_5]: {
    // "EntranceEntities": [
    //   { "DungeonId": 100, "EntranceEntityId": 610000070 }
    // ],
    mapId: 2501, // "Id": "InstanceDungeon_2501_MapName", "Content": "World Domain Sample",
  },
  [TestDungeonName.TEST_DUNGEON_6]: {
    mapId: 41, // "Id": "InstanceDungeon_41_MapName", "Content": "POS测试副本",
  },
  [TestDungeonName.TEST_DUNGEON_7]: {
    mapId: 8001, // "Id": "InstanceDungeon_8001_MapName", "Content": "rogue-Demo",
  },
  [TestDungeonName.TEST_DUNGEON_8]: {
    mapId: 80, // "Id": "InstanceDungeon_8002_MapName", "Content": "rogue-Demo",
  },
  [TestDungeonName.VEHICLE_TEST]: {
    // No translations at all
    mapId: 104,
  },
  [TestDungeonName.TD_INTERACTION_TEST]: {
    mapId: 31, // "Id": "InstanceDungeon_31_MapName", "Content": "TD - Interaction Test",
  },
  [TestDungeonName.TEST_DUNGEON_9]: {
    mapId: 44, // "Id": "InstanceDungeon_44_MapName", "Content": "TD-组件测试",
  },
  [TestDungeonName.STORY_JIYAN]: {
    mapId: 92,
  },
  [TestDungeonName.AUTOMATION_SAMPLE_TEST]: {
    mapId: 110, // "Id": "InstanceDungeon_110_MapName","Content": "Automation Sample Test Map",
  },
  [TestDungeonName.TASK_CONFIGURATION_TEST_MAP]: {
    mapId: 102, // "Id": "InstanceDungeon_102_MapName", "Content": "Task Configuration Test Map",
  },
  [TestDungeonName.YANGYANG_TEST_DUNGEON]: {
    mapId: 4901, // "Id": "InstanceDungeon_4901_MapName", "Content": "test Yangyang 战斗CE",
  },
};

export const unionMapConfigs: Record<string, MapConfig> = {
  ...mapConfigs,
  ...mainStoryDungeonMapConfigs,
  ...storyDungeonMapConfigs,
  ...sonoroDungeonMapConfigs,
  ...testDungeonMapConfigs,
};