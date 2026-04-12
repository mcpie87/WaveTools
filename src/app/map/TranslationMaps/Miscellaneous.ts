import { TranslationMapEntry } from "./TranslationMapInterface"

export const MiscellaneousTranslationMapGroups: Record<string, { keys: string[]; key: string }> = {
  "Weapon": {
    key: "WEAPON",
    keys: [
      "Weapon001", // Sniper Rifle
      "Weapon002", // Crowbar
      "Weapon003", // Flamethrower
      "Weapon004", // Chainsaw
      "Weapon005", // Electric Blade
    ]
  },
  "Cooking": {
    key: "COOKING",
    keys: [
      "SceneObj101",
      "SceneObj100",
    ]
  },
  "Monnaie Box": {
    key: "MONNAIE_BOX",
    keys: [
      "branch2.0_SceneObj3",
      "branch2.0_SceneObj2",
      "SceneObj1",
      "branch2.0_Quest012",
      "Quest010",
      "Quest009",
    ],
  },
  "Purple Rinascita Cloud": {
    key: "PURPLE_RINASCITA_CLOUD",
    keys: ["Gameplay012"]
  },
  "Red Rinascita Cloud": {
    key: "RED_RINASCITA_CLOUD",
    keys: ["branch2.0_JMXJ_StrongPollution"]
  },
  "Scavenger's Backpack": {
    key: "SCAVENGER_BACKPACK",
    keys: ["Treasure031"]
  },
  "Tree Trunk": {
    key: "TREE_TRUNK",
    keys: ["SceneObj005"]
  },
  "Wooden Box": {
    key: "WOODEN_BOX",
    keys: ["SceneObj002"]
  },
  "Gondola": {
    key: "GONDOLA",
    keys: ["Gameplay626"]
  },
  "Floating Container": { // The one found on sea
    key: "FLOATING_CONTAINER",
    keys: ["Quest008"]
  },
};
export const MiscellaneousTranslationMap: Record<string, TranslationMapEntry> =
  (() => {
    const result: Record<string, TranslationMapEntry> = {};

    for (const [name, { key, keys }] of Object.entries(MiscellaneousTranslationMapGroups)) {
      for (const k of keys) {
        result[k] = { name, key };
      }
    }

    return result;
  })();

export const MiscellaneousDisplayOrder = [
  "Weapon",
]