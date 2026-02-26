import { APIMarker } from "../types";
import { TranslationMapEntry } from "./TranslationMapInterface";

export interface QueryCategory {
  name: string;
  query: (marker: APIMarker) => boolean;
}

export const QueryCategories: Record<string, QueryCategory> = {
  "QUERY_BvbEntrance": {
    name: "Peaks of Prestige",
    query: (m) => m.ComponentsData?.InteractComponent?.InteractIcon === "BvbEntrance"
      || (m.ComponentsData?.InteractComponent?.Options?.some(o => o.Icon === "BvbEntrance") ?? false),
  },
  "QUERY_BvbInteract": {
    name: "Peaks of Prestige",
    query: (m) => m.ComponentsData?.InteractComponent?.InteractIcon === "BvbInteract"
      || (m.ComponentsData?.InteractComponent?.Options?.some(o => o.Icon === "BvbInteract") ?? false),
  },
  "QUERY_InteractIcon": {
    name: "Interact Icon",
    query: (m) => m.ComponentsData?.InteractComponent?.InteractIcon !== undefined
      || (m.ComponentsData?.InteractComponent?.Options?.some(o => o.Icon !== undefined) ?? false),
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

  // 2.0
  "Gameplay_LNXT_Flying": { name: "Flying Challenge" },
  "Gameplay_SoundDesign2": { name: "Musicfly" },
  "branch2.0_Gameplay172": { name: "Fratelli" },
  "branch2.0_Gameplay_Dungeon3": { name: "Dream Patrol" }, // For some reason counted x2

  // 2.4
  "branch2.4_143_Gameplay_2_4QQ11": { name: "Flying Challenge" },
  "branch2.4_143_Gameplay_2_4QQ4": { name: "Simulation Training Device" },
  "branch2.4_157_Gameplay_Dungeon1": { name: "Dream Patrol" }, // For some reason counted x2
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
];