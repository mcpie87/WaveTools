import { TranslationMapEntry } from "./TranslationMapInterface";
import { QueryCategory } from "./types";


export enum Puzzle {
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

  // 3.1
  SOLISKIN_GUIDE = "Soliskin Guide",
  GLOMMOTH_PROJECTION = "Glommoth Projection",

  // 3.3
  VOIDWING_MOTH_PROJECTION = "Voidwing Moth Projection",
  INVESTIGATE_ASTRITES = "Astrites - Investigate",
  MOTORBIKE_STUNT_TRACK = "Motorbike - Stunt Track",
  MOTORBIKE_FLIGHT_TRACK = "Motorbike - Flight Track",
}

export const PuzzleQueryCategories: Record<string, QueryCategory> = {
  "QUERY_BvbEntrance": {
    key: "QUERY_PEAKS_OF_PRESTIGE",
    name: "Peaks of Prestige",
    query: (m) => m.metadata?.InteractComponent?.InteractIcon === "BvbEntrance"
      || (m.metadata?.InteractComponent?.Options?.some(o => o.Icon === "BvbEntrance") ?? false),
  },
  "QUERY_BvbInteract": {
    key: "QUERY_PEAKS_OF_PRESTIGE",
    name: "Peaks of Prestige",
    query: (m) => m.metadata?.InteractComponent?.InteractIcon === "BvbInteract"
      || (m.metadata?.InteractComponent?.Options?.some(o => o.Icon === "BvbInteract") ?? false),
  },
  // "QUERY_InteractIcon": {
  //   name: "Interact Icon",
  //   query: (m) => m.metadata?.InteractComponent?.InteractIcon !== undefined
  //     || (m.metadata?.InteractComponent?.Options?.some(o => o.Icon !== undefined) ?? false),
  // },
  "QUERY_Scenery": {
    key: "QUERY_SCENERY",
    name: "Scenery",
    query: (m) => (
      m.metadata?.InteractComponent?.Options
        ?.some(option => {
          if (option.Type?.Type !== "Actions") return false;
          const action = option.Type?.Actions?.find(a => a.Name === "UnlockSystemItem");
          return action?.Params?.SystemOption?.Type === "AtlasSystem";
        }) ?? false
    ),
  },
  "QUERY_Tactical_Hologram": {
    key: "QUERY_TACTICAL_HOLOGRAM",
    name: "Tactical Hologram",
    query: (m) => m?.mapMark?.icon.includes("SP_IconMap_Play_10_UI") ?? false,
  },
  "QUERY_Treasure_Spot": {
    key: "QUERY_TREASURE_SPOT",
    name: "Treasure Spot",
    query: (m) => m?.mapMark?.icon.includes("SP_IconMap_Play_15_UI") ?? false,
  },
  "QUERY_Fratelli": {
    key: "QUERY_FRATELLI",
    name: "Fratelli",
    query: (m) => m?.mapMark?.icon.includes("SP_IconMap_Play_20_UI") ?? false,
  },
  "QUERY_Dream_Patrol": {
    key: "QUERY_DREAM_PATROL",
    name: "Dream Patrol",
    query: (m) => m?.mapMark?.icon.includes("SP_IconMap_Play_19_UI") ?? false,
  },
  "QUERY_Tactical_Hologram_Vitreum_Dancer": {
    key: "QUERY_TACTICAL_HOLOGRAM_VITREUM_DANCER",
    name: "Tactical Hologram: Vitreum Dancer",
    query: (m) => m?.mapMark?.icon.includes("SP_IconMap_Play_17_UI") ?? false,
  },
  "QUERY_Echo_Challenge_Dancer_Hacking": {
    key: "QUERY_ECHO_CHALLENGE_DANCER_HACKING",
    name: "Echo Challenge: Dancer Hacking",
    query: (m) => m?.mapMark?.icon.includes("SP_IconMap_Play_31_UI") ?? false,
  },
  "QUERY_Pipeline_Maintenance": {
    key: "QUERY_PIPELINE_MAINTENANCE",
    name: "Pipeline Maintenance",
    query: (m) => m?.mapMark?.icon.includes("SP_IconMap_Play_43_UI") ?? false,
  },
  "QUERY_Hot_Spring": {
    key: "QUERY_HOT_SPRING",
    name: "Hot Spring",
    query: (m) => m?.mapMark?.icon.includes("SP_IconMap_Play_55_UI") ?? false,
  },
  "QUERY_Void_Storm": {
    key: "QUERY_VOID_STORM",
    name: "Void Storm",
    query: (m) => m?.mapMark?.icon.includes("SP_IconMap_Play_49_UI") ?? false,
  },
  "QUERY_Route_Constructor": {
    key: "QUERY_ROUTE_CONSTRUCTOR",
    name: "Route Constructor",
    query: (m) => m?.mapMark?.icon.includes("SP_IconMap_Activity_Navigation_10_UI") ?? false,
  },
  "QUERY_Route_Network_Blockage": {
    key: "QUERY_ROUTE_NETWORK_BLOCKAGE",
    name: "Route Network Blockage",
    query: (m) => m?.mapMark?.icon.includes("SP_IconMap_Play_59_UI") ?? false,
  },
  "QUERY_Bike_Challenge": {
    key: "QUERY_BIKE_CHALLENGE",
    name: "Bike Challenge",
    query: (m) => m?.mapMark?.icon.includes("SP_IconMap_Play_62_UI") ?? false,
  },
  "QUERY_Bike_Racing": {
    key: "QUERY_BIKE_RACING",
    name: "Bike Racing",
    query: (m) => m?.mapMark?.icon.includes("SP_IconMap_Play_61_UI") ?? false,
  },
  "QUERY_Side_Quest": {
    key: "QUERY_SIDE_QUEST",
    name: "Side Quest",
    query: (m) => m?.questData?.questTypeId === 2,
  },
  "QUERY_Tutorial_Quest": {
    key: "QUERY_TUTORIAL_QUEST",
    name: "Tutorial Quest",
    query: (m) => m?.questData?.questTypeId === 7,
  },
  // 3.3
  "QUERY_Voidbane_Eldertree": {
    key: "QUERY_VOIDBANE_ELDERTREE",
    name: "Voidbane Eldertree",
    query: (m) => m?.mapMark?.icon.includes("SP_IconMap_Play_70_UI") ?? false,
  },
  "QUERY_Voidmatter_Blocks": {
    key: "QUERY_VOIDMATTER_BLOCKS",
    name: "Voidmatter Blocks",
    query: (m) => [
      "SP_IconMap_Activity_CubeEndless.png",
      "SP_IconMap_Activity_CubeNor"
    ].some(icon => m?.mapMark?.icon.includes(icon)) ?? false,
  },
  "QUERY_DEBUG_1": {
    key: "QUERY_DEBUG_1",
    name: "Debug 1",
    query: (m) => m?.mapMark?.icon.includes("SP_IconMap_Play_67_UI") ?? false,
  },
  "QUERY_MOTORBIKE_FIXED_TRACK": {
    key: "QUERY_DEBUG_2", // MOTORBIKE_FIXED_TRACK TODO - migrate
    name: "Motorbike - Fixed Track",
    query: (m) => m?.mapMark?.icon.includes("SP_IconMap_Play_68_UI") ?? false,
  },
  "QUERY_MOTORBIKE_FLIGHT_TRACK": {
    key: "QUERY_DEBUG_3",
    name: Puzzle.MOTORBIKE_FLIGHT_TRACK,
    query: (m) => m?.mapMark?.icon.includes("SP_IconMap_Play_69_UI") ?? false,
  },
  "QUERY_DEBUG_4": {
    key: "QUERY_DEBUG_4",
    name: "Debug 4",
    query: (m) => m?.mapMark?.icon.includes("SP_IconMap_Play_70_UI") ?? false,
  },
  "QUERY_DEBUG_5": {
    key: "QUERY_DEBUG_5",
    name: "Debug 5",
    query: (m) => m?.mapMark?.icon.includes("SP_IconMap_Play_71_UI") ?? false,
  },
  "QUERY_DEBUG_6": {
    key: "QUERY_DEBUG_6",
    name: "Debug 6",
    query: (m) => m?.mapMark?.icon.includes("SP_IconMap_Play_72_UI") ?? false,
  },
  "QUERY_MOTORBIKE_STUNT_TRACK": {
    key: "QUERY_DEBUG_7", // DO NOT MODIFY # TODO MIGRATE
    name: Puzzle.MOTORBIKE_STUNT_TRACK,
    query: (m) => m?.mapMark?.icon.includes("SP_IconMap_Play_73_UI") ?? false,
  },
  "QUERY_Light_Builder": {
    key: "QUERY_LIGHT_BUILDER",
    name: "Light Builder",
    query: (m) => m?.mapMark?.icon.includes("SP_IconMap_Play_74_UI") ?? false,
  },
  "QUERY_DEBUG_9": {
    key: "QUERY_DEBUG_9",
    name: "Debug 9",
    query: (m) => m?.mapMark?.icon.includes("SP_IconMap_Play_75_UI") ?? false,
  },
  "QUERY_DEBUG_10": {
    key: "QUERY_DEBUG_10",
    name: "Debug 10",
    query: (m) => m?.mapMark?.icon.includes("SP_IconMap_Play_76_UI") ?? false,
  },
  "QUERY_Cave": {
    key: "QUERY_CAVE",
    name: "Cave",
    query: (m) => m?.mapMark?.icon.includes("SP_IconMap_Layer_UI") ?? false,
  },
  "QUERY_QUEST_ACTIVITY": {
    key: "QUERY_QUEST_ACTIVITY",
    name: "Quest Activity",
    query: (m) => m?.mapMark?.icon.includes("SP_IconMap_Activity_05_UI") ?? false,
  }
};

const PuzzleTranslationMapGroups: Record<string, { keys: string[]; key: string }> = {
  // 1.0
  [Puzzle.MUTTERFLY]: {
    key: "PUZZLE_MUTTERFLY",
    keys: ["Gameplay111"]
  },
  [Puzzle.BLOBFLY]: {
    key: "PUZZLE_BLOBFLY",
    keys: ["Animal032"]
  },
  [Puzzle.HOVERING_MAGNETITE]: {
    key: "PUZZLE_HOVERING_MAGNETITE",
    keys: ["Gameplay381"]
  },
  [Puzzle.SIMULATION_TRAINING_DEVICE]: {
    key: "PUZZLE_SIMULATION_TRAINING_DEVICE",
    keys: [
      "Gameplay200",
      "branch2.4_143_Gameplay_2_4QQ4"
    ]
  },
  [Puzzle.FRAGILE_ROCK]: {
    key: "PUZZLE_FRAGILE_ROCK",
    keys: ["Gameplay003"]
  },
  [Puzzle.FISSURED_LEDGE]: {
    key: "PUZZLE_FISSURED_LEDGE",
    keys: ["Gameplay004"]
  },
  [Puzzle.SHOOTING_CHALLENGE]: {
    key: "PUZZLE_SHOOTING_CHALLENGE",
    keys: ["Gameplay055"]
  },

  // 1.1
  [Puzzle.TACTICAL_HOLOGRAM_SKI]: {
    key: "PUZZLE_TACTICAL_HOLOGRAM_SKI",
    keys: ["Gameplay207"]
  },
  [Puzzle.FROSTBUG]: {
    key: "PUZZLE_FROSTBUG",
    keys: ["Monster139"]
  },

  // 2.0
  [Puzzle.FLYING_CHALLENGE]: {
    key: "PUZZLE_FLYING_CHALLENGE",
    keys: [
      "Gameplay_LNXT_Flying",
      "branch2.4_143_Gameplay_2_4QQ11",
    ]
  },
  [Puzzle.MUSICFLY]: {
    key: "PUZZLE_MUSICFLY",
    keys: ["Gameplay_SoundDesign2"]
  },
  [Puzzle.OVERFLOWING_PALETTE]: {
    key: "PUZZLE_OVERFLOWING_PALETTE",
    keys: ["Gameplay8"]
  },

  // 2.4
  [Puzzle.HERO_REND]: {
    key: "PUZZLE_HERO_REND",
    keys: ["branch2.4_143_Gameplay_2_4QQ14"]
  },

  // 2.5
  [Puzzle.ORCHESTRATION_ALTAR]: {
    key: "PUZZLE_ORCHESTRATION_ALTAR",
    keys: ["branch2.5_41_Gameplay1"]
  },
  [Puzzle.TRIPTYCH_CHEST]: {
    key: "PUZZLE_TRIPTYCH_CHEST",
    keys: ["branch2.5_Slots"]
  },

  // 2.6
  [Puzzle.DREAMS_OF_CINTERCIDE]: {
    key: "PUZZLE_DREAMS_OF_CINTERCIDE",
    keys: ["branch2.6_35_Gameplay640"]
  },

  // 3.0
  [Puzzle.BIKE_CHALLENGE]: {
    key: "PUZZLE_BIKE_CHALLENGE",
    keys: [
      "branch3.0_692_Gameplay_MotorZhongDuan",
      // "branch3.0_135_Gameplay513", // DEPRECATED: 3.2 - query covers it
    ]
  },
  [Puzzle.SMARTPRINT_CUBE]: {
    key: "PUZZLE_SMARTPRINT_CUBE",
    keys: ["branch2.8_41_Gameplay_3_0/RollBlock5"]
  },
  [Puzzle.SOLISKIN]: {
    key: "PUZZLE_SOLISKIN",
    keys: ["branch3.0_939_NPC420085"]
  },
  [Puzzle.SOLISKIN_COLLECT]: {
    key: "PUZZLE_SOLISKIN_COLLECT",
    keys: ["branch3.0_939_Collect_SBS14"]
  },
  [Puzzle.SOLISKIN_GUIDE]: {
    key: "PUZZLE_SOLISKIN_GUIDE",
    keys: ["branch3.1_115_Gameplay_3_1/SunSpiritPPV"]
  },
  [Puzzle.GEOSPIDER_PROJECTION]: {
    key: "PUZZLE_GEOSPIDER_PROJECTION",
    keys: ["branch3.0_40_Gameplay_3_0/VisionSummon11"]
  },

  // 3.1
  [Puzzle.GLOMMOTH_PROJECTION]: {
    key: "GLOHOMOTH_VISION", // moved from MISC, DO NOT CHANGE THIS KEY
    keys: ["branch3.1_40_Gameplay_3_1/VisionSummon4"]
  },

  // 3.3
  [Puzzle.VOIDWING_MOTH_PROJECTION]: {
    key: "PUZZLE_VOIDWING_MOTH_PROJECTION",
    keys: ["branch3.3_109_Gameplay_3_9"]
  },

  [Puzzle.INVESTIGATE_ASTRITES]: {
    key: "PUZZLE_INVESTIGATE_ASTRITES",
    keys: ["branch3.3_161_Treasure_2_0_05"]
  },
};

export const PuzzleTranslationMap: Record<string, TranslationMapEntry> =
  (() => {
    const result: Record<string, TranslationMapEntry> = {};

    for (const [name, { key, keys }] of Object.entries(PuzzleTranslationMapGroups)) {
      for (const k of keys) {
        result[k] = { name, key };
      }
    }

    for (const [qkey, { key, name }] of Object.entries(PuzzleQueryCategories)) {
      result[qkey] = { name, key };
    }

    return result;
  })();


export const PuzzleDisplayOrder = [
  "Mutterfly",
  "Blobfly",
  "Flying Challenge",
  "Orchestration Altar",
  "Triptych Chest",
  "Bike Challenge",
  "Soliskin Chest",
  "Treasure Spot",
];