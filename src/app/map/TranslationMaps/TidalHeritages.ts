import { TranslationMapEntry } from "./TranslationMapInterface";

export enum TidalHeritage {
  BLUE = "Tidal Heritage (Blue)",
  PURPLE = "Tidal Heritage (Purple)",
  GOLD = "Tidal Heritage (Gold)",
  UNKNOWN = "Tidal Heritage (???)",
}

const TidalHeritageTranslationMapGroups: Record<string, { keys: string[]; key: string }> = {
  [TidalHeritage.BLUE]: {
    key: "TIDAL_HERITAGE_BLUE",
    keys: [
      "Treasure005",
      "branch2.0_Treasure1",
      "branch3.0_938_Treasure2",
    ]
  },
  [TidalHeritage.PURPLE]: {
    key: "TIDAL_HERITAGE_PURPLE",
    keys: [
      "Treasure008",
      "branch2.0_Treasure2",
      "branch3.0_938_Treasure3",
    ]
  },
  [TidalHeritage.GOLD]: {
    key: "TIDAL_HERITAGE_GOLD",
    keys: [
      "Treasure011",
      "branch2.0_Treasure3",
      "branch3.0_938_Treasure4",
    ]
  },
  [TidalHeritage.UNKNOWN]: {
    key: "TIDAL_HERITAGE_UNKNOWN",
    keys: [
      "Treasure_huodong2",
      "Treasure_huodong3",
      "Treasure_huodong4",
      "Treasure_huodong5",
    ]
  },
};

export const TidalHeritageTranslationMap: Record<string, TranslationMapEntry> =
  (() => {
    const result: Record<string, TranslationMapEntry> = {};

    for (const [name, { key, keys }] of Object.entries(TidalHeritageTranslationMapGroups)) {
      for (const k of keys) {
        result[k] = { name, key };
      }
    }

    return result;
  })();

export const TidalHeritageDisplayOrder = [
  TidalHeritage.BLUE,
  TidalHeritage.PURPLE,
  TidalHeritage.GOLD,
];