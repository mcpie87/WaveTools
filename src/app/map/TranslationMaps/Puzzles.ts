import { IMarker } from "../types";
import { TranslationMapEntry } from "./TranslationMapInterface";

export interface QueryCategory {
  name: string;
  query: (marker: IMarker) => boolean;
}

export const QueryCategories: Record<string, QueryCategory> = {
  "QUERY_BvbEntrance": {
    name: "Peaks of Prestige",
    query: (m) => m.metadata?.InteractComponent?.InteractIcon === "BvbEntrance"
      || (m.metadata?.InteractComponent?.Options?.some(o => o.Icon === "BvbEntrance") ?? false),
  },
  "QUERY_BvbInteract": {
    name: "Peaks of Prestige",
    query: (m) => m.metadata?.InteractComponent?.InteractIcon === "BvbInteract"
      || (m.metadata?.InteractComponent?.Options?.some(o => o.Icon === "BvbInteract") ?? false),
  },
  "QUERY_InteractIcon": {
    name: "Interact Icon",
    query: (m) => m.metadata?.InteractComponent?.InteractIcon !== undefined
      || (m.metadata?.InteractComponent?.Options?.some(o => o.Icon !== undefined) ?? false),
  },
  "QUERY_Scenery": {
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
  "QUERY_Treasure_Spot": {
    name: "Treasure Spot",
    query: (m) => m?.mapMark?.icon.includes("SP_IconMap_Play_15_UI") ?? false,
  },
  "QUERY_Fratelli": {
    name: "Fratelli",
    query: (m) => m?.mapMark?.icon.includes("SP_IconMap_Play_20_UI") ?? false,
  },
  "QUERY_Dream_Patrol": {
    name: "Dream Patrol",
    query: (m) => m?.mapMark?.icon.includes("SP_IconMap_Play_19_UI") ?? false,
  },
  "QUERY_Tactical_Hologram_Vitreum_Dancer": {
    name: "Tactical Hologram: Vitreum Dancer",
    query: (m) => m?.mapMark?.icon.includes("SP_IconMap_Play_17_UI") ?? false,
  },
  "QUERY_Echo_Challenge_Dancer_Hacking": {
    name: "Echo Challenge: Dancer Hacking",
    query: (m) => m?.mapMark?.icon.includes("SP_IconMap_Play_31_UI") ?? false,
  },
  "QUERY_Hot_Spring": {
    name: "Hot Spring",
    query: (m) => m?.mapMark?.icon.includes("SP_IconMap_Play_55_UI") ?? false,
  },
  "QUERY_Void_Storm": {
    name: "Void Storm",
    query: (m) => m?.mapMark?.icon.includes("SP_IconMap_Play_49_UI") ?? false,
  },
  "QUERY_Route_Constructor": {
    name: "Route Constructor",
    query: (m) => m?.mapMark?.icon.includes("SP_IconMap_Activity_Navigation_10_UI") ?? false,
  },
  "QUERY_Route_Network_Blockage": {
    name: "Route Network Blockage",
    query: (m) => m?.mapMark?.icon.includes("SP_IconMap_Play_59_UI") ?? false,
  },
  "QUERY_Bike_Challenge": {
    name: "Bike Challenge",
    query: (m) => m?.mapMark?.icon.includes("SP_IconMap_Play_62_UI") ?? false,
  },
  "QUERY_Bike_Racing": {
    name: "Bike Racing",
    query: (m) => m?.mapMark?.icon.includes("SP_IconMap_Play_61_UI") ?? false,
  },
};

export const PuzzleTranslationMap: Record<string, TranslationMapEntry> = {
  // 1.0
  "Gameplay111": { name: "Mutterfly" },
  "Animal032": { name: "Blobfly" },
  "Gameplay381": { name: "Hovering Magnetite" },
  "Gameplay200": { name: "Simulation Training Device" },
  "Gameplay003": { name: "Fragile Rock" },
  "Gameplay004": { name: "Fissured Ledge" },
  "Gameplay055": { name: "Shooting Challenge" },

  // 1.1
  "Gameplay207": { name: "Tactical Hologram: Ski" },
  "Monster139": { name: "Frostbug" },

  // 2.0
  "Gameplay_LNXT_Flying": { name: "Flying Challenge" },
  "Gameplay_SoundDesign2": { name: "Musicfly" },
  // "branch2.0_Gameplay172": { name: "Fratelli" }, // Removed in favor of query based search
  // "branch2.0_Gameplay_Dungeon3": { name: "Dream Patrol" }, // For some reason counted x2
  "Gameplay8": { name: "Overflowing Palette" },

  // 2.4
  "branch2.4_143_Gameplay_2_4QQ11": { name: "Flying Challenge" },
  "branch2.4_143_Gameplay_2_4QQ4": { name: "Simulation Training Device" },
  // "branch2.4_157_Gameplay_Dungeon1": { name: "Dream Patrol" }, // For some reason counted x2
  "branch2.4_143_Gameplay_2_4QQ14": { name: "Hero's Rend" },

  // 2.5
  "branch2.5_41_Gameplay1": { name: "Orchestration Altar" },
  "branch2.5_Slots": { name: "Triptych Chest" },

  // 2.6
  "branch2.6_35_Gameplay640": { name: "Dreams of Cintercide" },

  // 3.0
  "branch3.0_692_Gameplay_MotorZhongDuan": { name: "Bike Challenge" }, // stationary one
  "branch3.0_135_Gameplay513": { name: "Bike Challenge" },
  "branch2.8_41_Gameplay_3_0/RollBlock5": { name: "Smartprint Cube" },
  // DON'T UNCOMMENT - it's a duplicate in 3.1 and does not overlap with mechascout at all
  // "branch3.1_115_Gameplay513": { name: "Smartprint Cube" },
  "branch3.0_939_NPC420085": { name: "Soliskin" },
  "branch3.0_40_Gameplay_3_0/VisionSummon11": { name: "Geospider Projection" },

  // 3.1
  "branch3.1_115_Gameplay_3_1/SunSpiritPPV": { name: "Soliskin Guide" },

  // Query categories
  "QUERY_BvbEntrance": { name: "Peaks of Prestige" },
  "QUERY_BvbInteract": { name: "Peaks of Prestige" },
  "QUERY_InteractIcon": { name: "Interact Icon" },
  "QUERY_Scenery": { name: "Scenery" },
  "QUERY_Treasure_Spot": { name: "Treasure Spot" },
  "QUERY_Fratelli": { name: "Fratelli" },
  "QUERY_Dream_Patrol": { name: "Dream Patrol" },
  "QUERY_Tactical_Hologram_Vitreum_Dancer": { name: "Tactical Hologram: Vitreum Dancer" },
  "QUERY_Echo_Challenge_Dancer_Hacking": { name: "Echo Challenge: Dancer Hacking" },
  "QUERY_Hot_Spring": { name: "Hot Spring" },
  "QUERY_Void_Storm": { name: "Void Storm" },
  "QUERY_Route_Constructor": { name: "Route Constructor" },
  "QUERY_Route_Network_Blockage": { name: "Route Network Blockage" },
  "QUERY_Bike_Challenge": { name: "Bike Challenge" },
  "QUERY_Bike_Racing": { name: "Bike Racing" },
};
export const PuzzleDisplayOrder = [
  "Mutterfly",
  "Blobfly",
  "Flying Challenge",
  "Orchestration Altar",
  "Triptych Chest",
  "branch2.6_35_Gameplay640",
  "Bike Challenge",
  "Soliskin Chest",
  "Treasure Spot",
];