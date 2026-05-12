import { TranslationMapEntry } from "./TranslationMapInterface";
import { QueryCategory } from "./types";


export enum Quest {
  // 1, // Main
  // 2, // Side Quest
  // 3, // story
  // 4, // daily quest
  // 7, // Tutorial
  // 9, // Exploration
  // 11, // no clue
  // 10, // event
  // 14, // 3.1 festival event zone it seems?
  // 100, // test stuff
  MAIN_QUEST = "Main Quest", // questTypeId === 1
  SIDE_QUEST = "Side Quest", // questTypeId === 2
  TUTORIAL_QUEST = "Tutorial Quest", // questTypeId === 7
  STORY_QUEST = "Story Quest", // questTypeId === 3
  DAILY_QUEST = "Daily Quest", // questTypeId === 4
  EXPLORATION_QUEST = "Exploration Quest", // questTypeId === 9
  EVENT_QUEST = "Event Quest", // questTypeId === 10

  // 1.0
  MUTTERFLY = "Mutterfly",
  BLOBFLY = "Blobfly",
  HOVERING_MAGNETITE = "Hovering Magnetite",
  SIMULATION_TRAINING_DEVICE = "Simulation Training Device",
  FRAGILE_ROCK = "Fragile Rock",
  FISSURED_LEDGE = "Fissured Ledge",
  SHOOTING_CHALLENGE = "Shooting Challenge",

  // 1.1
  TACTICAL_HOLOGRAM_SKI = "Tactical Hologram: Ski",
  FROSTBUG = "Frostbug",

  // 2.0
  FLYING_CHALLENGE = "Flying Challenge",
  MUSICFLY = "Musicfly",
  OVERFLOWING_PALETTE = "Overflowing Palette",

  // 2.4
  HERO_REND = "Hero's Rend",

  // 2.5
  ORCHESTRATION_ALTAR = "Orchestration Altar",
  TRIPTYCH_CHEST = "Triptych Chest",

  // 2.6
  DREAMS_OF_CINTERCIDE = "Dreams of Cintercide",

  // 3.0
  BIKE_CHALLENGE = "Bike Challenge",
  SMARTPRINT_CUBE = "Smartprint Cube",
  SOLISKIN = "Soliskin",
  SOLISKIN_COLLECT = "Soliskin Collect",
  GEOSPIDER_PROJECTION = "Geospider Projection",
  REINDEER_PROJECTION = "Reindeer Projection",

  // 3.1
  SOLISKIN_GUIDE = "Soliskin Guide",
  GLOMMOTH_PROJECTION = "Glommoth Projection",

  // 3.3
  VOIDWING_MOTH_PROJECTION = "Voidwing Moth Projection",
  INVESTIGATE_ASTRITES = "Astrites - Investigate",
  MOTORBIKE_STUNT_TRACK = "Motorbike - Stunt Track",
  MOTORBIKE_FLIGHT_TRACK = "Motorbike - Flight Track",
  INSPECT = "Inspect",
  INVESTIGATE = "Investigate",
}

export const QuestQueryCategories: Record<string, QueryCategory> = {
  "QUERY_Main_Quest": {
    key: "QUERY_MAIN_QUEST",
    name: Quest.MAIN_QUEST,
    query: (m) => m?.questData?.questTypeId === 1,
  },
  "QUERY_Side_Quest": {
    key: "QUERY_SIDE_QUEST",
    name: Quest.SIDE_QUEST,
    query: (m) => m?.questData?.questTypeId === 2,
  },
  "QUERY_Tutorial_Quest": {
    key: "QUERY_TUTORIAL_QUEST",
    name: Quest.TUTORIAL_QUEST,
    query: (m) => m?.questData?.questTypeId === 7,
  },
  "QUERY_Story_Quest": {
    key: "QUERY_STORY_QUEST",
    name: Quest.STORY_QUEST,
    query: (m) => m?.questData?.questTypeId === 3,
  },
  "QUERY_DAILY_Quest": {
    key: "QUERY_DAILY_QUEST",
    name: Quest.DAILY_QUEST,
    query: (m) => m?.questData?.questTypeId === 4,
  },
  "QUERY_EXPLORATION_Quest": {
    key: "QUERY_EXPLORATION_QUEST",
    name: Quest.EXPLORATION_QUEST,
    query: (m) => m?.questData?.questTypeId === 9,
  },
  "QUERY_UNASSIGNED_Quest": {
    key: "QUERY_UNASSIGNED_QUEST",
    name: "UNASSIGNED_QUEST",
    query: (m) => m?.questData?.questTypeId === 11,
  },
  "QUERY_EVENT_Quest": {
    key: "QUERY_EVENT_QUEST",
    name: Quest.EVENT_QUEST,
    query: (m) => m?.questData?.questTypeId === 10,
  },
  "QUERY_LevelPlayData_Quest": {
    key: "QUERY_LEVEL_PLAY_DATA_QUEST",
    name: "Puzzle Quest",
    query: (m) => m?.levelPlayData?.Type === "Quest"
      && m?.levelPlayData.Translations.length > 0,
  },
  "QUERY_LevelPlayData_Riddle": {
    key: "QUERY_LEVEL_PLAY_DATA_RIDDLE",
    name: "Puzzle Riddle",
    query: (m) => m?.levelPlayData?.Type === "Riddle"
      && !m?.mapMark
      && m?.levelPlayData.Translations.length > 0,
  }
};

const QuestTranslationMapGroups: Record<string, { keys: string[]; key: string }> = {
};

export const QuestTranslationMap: Record<string, TranslationMapEntry> =
  (() => {
    const result: Record<string, TranslationMapEntry> = {};

    for (const [name, { key, keys }] of Object.entries(QuestTranslationMapGroups)) {
      for (const k of keys) {
        result[k] = { name, key };
      }
    }

    for (const [qkey, { key, name }] of Object.entries(QuestQueryCategories)) {
      result[qkey] = { name, key };
    }

    return result;
  })();


export const QuestDisplayOrder = [
  Quest.MAIN_QUEST,
  Quest.SIDE_QUEST,
  Quest.EXPLORATION_QUEST,
  Quest.STORY_QUEST,
  Quest.TUTORIAL_QUEST,
  Quest.DAILY_QUEST,
  Quest.EVENT_QUEST,
];