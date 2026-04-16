import { TranslationMapEntry } from "./TranslationMapInterface";

export enum Chest {
  BASIC_SUPPLY_CHEST = "Basic Supply Chest",
  STANDARD_SUPPLY_CHEST = "Standard Supply Chest",
  ADVANCED_SUPPLY_CHEST = "Advanced Supply Chest",
  PREMIUM_SUPPLY_CHEST = "Premium Supply Chest",
  TIDAL_SUPPLY_CHEST = "Tidal Supply Chest",

  BASIC_TROPHY_CHEST = "Basic Trophy Chest",
  STANDARD_TROPHY_CHEST = "Standard Trophy Chest",
  ADVANCED_TROPHY_CHEST = "Advanced Trophy Chest",
  PREMIUM_TROPHY_CHEST = "Premium Trophy Chest",
  TIDAL_TROPHY_CHEST = "Lustrous Trophy Chest",

  INSPECT = "Inspect",
  INVESTIGATE = "Investigate",
}

const ChestTranslationMapGroups: Record<string, { keys: string[]; key: string }> = {
  [Chest.BASIC_SUPPLY_CHEST]: {
    key: "CHEST_BASIC_SUPPLY_CHEST",
    keys: [
      "Treasure001",
      "Treasure003",
      "Treasure013",
      "Treasure019", // Test only (3 Total, MapId: [37, 100])
      "Treasure022",
      "Treasure026",
      "Treasure_2_0_01",
      "Treasure_LNXT_Lock01",
      "Treasure_LNXT_Update01",
      "branch3.0_693_Treasure_3_1",
      "branch3.0_693_Treasure_3_12",
      "branch3.0_693_Treasure_3_6",
      "Treasure_LNXT_Hide01", // Test only (1 Total, MapId: [100])
      "branch2.4_151_Treasure_LNXT_Hide02", // Test only (1 Total, MapId: [100])
    ]
  },
  [Chest.STANDARD_SUPPLY_CHEST]: {
    key: "CHEST_STANDARD_SUPPLY_CHEST",
    keys: [
      "Treasure004",
      "Treasure006",
      "Treasure014",
      "Treasure_LNXT_Lock02",
      "Treasure_2_0_02",
      "Treasure018",
      "Treasure_LNXT_Update02",
      "branch3.0_693_Treasure_3_11",
      "branch3.0_693_Treasure_3_16",
      "branch3.0_693_Treasure_3_2",
      "branch3.0_693_Treasure_3_7",
      "branch3.0_13_Treasure_2_0_03",
      "Treasure023",
      "Treasure027",
      "branch2.0_Treasure_2_0_08",
      "branch2.3_151_Treasure_LNXT_Lock03", // Test only (1 Total, MapId: [100])
      "Treasure_LNXT_Hide02",  // Test only (1 Total, MapId: [100])
    ]
  },
  [Chest.ADVANCED_SUPPLY_CHEST]: {
    key: "CHEST_ADVANCED_SUPPLY_CHEST",
    keys: [
      "Treasure010",
      "Treasure012",
      "Treasure015",
      "Treasure020",
      "Treasure_LNXT_Lock03",
      "Treasure_2_0_03",
      "Treasure_LNXT_Update03",
      "branch3.0_693_Treasure_3_14",
      "branch3.0_693_Treasure_3_3",
      "branch3.0_693_Treasure_3_8",
      "branch3.0_693_Treasure_3_19",
      "branch2.4_151_Treasure_LNXT_Hide04", // verify
      "branch2.0_Treasure_2_0_06", // verify
      "Treasure024",
      "Treasure028",
      "Treasure_LNXT_Hide03", // verify
    ]
  },
  [Chest.PREMIUM_SUPPLY_CHEST]: {
    key: "CHEST_PREMIUM_SUPPLY_CHEST",
    keys: [
      "Treasure007",
      "Treasure009",
      "Treasure016",
      "Treasure021", // verify
      "Treasure025",
      "Treasure_huodong1",
      "Treasure_2_0_04",
      "Treasure_LNXT_Lock04",
      "Treasure_LNXT_Update04",
      "branch3.0_693_Treasure_3_4",
      "branch3.0_693_Treasure_3_9",
      "branch2.4_151_Treasure_LNXT_Hide05", // verify
      "Treasure_LNXT_Hide04", // verify
    ]
  },
  [Chest.TIDAL_SUPPLY_CHEST]: {
    key: "CHEST_TIDAL_SUPPLY_CHEST",
    keys: [
      "Treasure_2_0_05",
      "Treasure_LNXT_Lock05",
      "Treasure_LNXT_Update05",
      "branch3.0_693_Treasure_3_5",
      "branch3.0_693_Treasure_3_13",
      "branch2.0_Treasure_2_0_07", // verify
      "Treasure_LNXT_Hide05", // verify
    ]
  },
  [Chest.BASIC_TROPHY_CHEST]: {
    key: "CHEST_BASIC_TROPHY_CHEST", // 2.4 event
    keys: [
      "branch2.4_122_Treasure_2_4_01"
    ]
  },
  [Chest.STANDARD_TROPHY_CHEST]: {
    key: "CHEST_STANDARD_TROPHY_CHEST",  // 2.4 event
    keys: [
      "branch2.4_122_Treasure_2_4_02",
      "branch3.2_30_Treasure_3_3", // 3.2 event
    ]
  },
  [Chest.ADVANCED_TROPHY_CHEST]: {
    key: "CHEST_ADVANCED_TROPHY_CHEST",  // 2.4 event
    keys: [
      "branch2.4_122_Treasure_2_4_03"
    ]
  },
  [Chest.PREMIUM_TROPHY_CHEST]: {
    key: "CHEST_PREMIUM_TROPHY_CHEST",  // 2.4 event
    keys: [
      "branch2.4_122_Treasure_2_4_04"
    ]
  },
  [Chest.TIDAL_TROPHY_CHEST]: {
    key: "CHEST_LUSTROUS_TROPHY_CHEST",  // 2.4 event
    keys: [
      "branch2.4_122_Treasure_2_4_05"
    ]
  },
  [Chest.INSPECT]: {
    key: "CHEST_INSPECT",
    keys: [
      "Treasure017"
    ]
  },
  [Chest.INVESTIGATE]: {
    key: "CHEST_INVESTIGATE",
    keys: [
      "Treasure035",
      "Treasure036",
    ]
  },
};

export const ChestTranslationMap: Record<string, TranslationMapEntry> =
  (() => {
    const result: Record<string, TranslationMapEntry> = {};

    for (const [name, { key, keys }] of Object.entries(ChestTranslationMapGroups)) {
      for (const k of keys) {
        result[k] = { name, key };
      }
    }

    return result;
  })();

export const ChestDisplayOrder = [
  "Basic Supply Chest",
  "Standard Supply Chest",
  "Advanced Supply Chest",
  "Premium Supply Chest",
  "Tidal Supply Chest",
];