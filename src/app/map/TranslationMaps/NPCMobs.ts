import { TranslationMapEntry } from "./TranslationMapInterface";

export enum NPCMobs {
  // 1.0
  EXILE_COMMONER = "Exile Commoner",
  EXILE_LEADER = "Exile Leader",
  EXILE_TECHNICIAN = "Exile Technician",
  FRACTSIDUS_EXECUTIONER = "Fractsidus Executioner",
  FRACTSIDUS_THRUSTER = "Fractsidus Thruster",
  FRACTSIDUS_CANNONEER = "Fractsidus Cannoneer",
  FRACTSIDUS_GUNMASTER = "Fractsidus Gunmaster",
  SCAR = "Scar",

  // 2.4
  GALECREST_GLADIATOR = "Galecrest Gladiator",
  LIGHTCREST_GLADIATOR = "Lightcrest Gladiator",
  FROSTCREST_GLADIATOR = "Frostcrest Gladiator",
  FLAMECREST_GLADIATOR = "Flamecrest Gladiator",
  THUNDERCREST_GLADIATOR = "Thundercrest Gladiator",
  ABYSSCREST_GLADIATOR = "Abysscrest Gladiator",

  // 2.5
  FRACTSIDUS_INSPECTOR = "Fractsidus Inspector",
  ABYSSAL_GUNMASTER = "Abyssal Gunmaster",

  // 3.0
  ROYAN_MAN = "Royan Man",
  ROYAN_WOMAN = "Royan Woman",

}
export const NPCMobsTranslationMapGroups: Record<string, Record<string, string[]>> = {
  // 1.0
  [NPCMobs.EXILE_COMMONER]: {
    keys: [
      "Monster012",
      "Monster013",
      "Monster023",
      "Monster024",
      "Monster025",
      "Monster028",
      "Monster020",
      "Monster021",
      "Monster022",
      "Monster026",
      "Monster027",
      "Monster029",
      "Monster_Branch1.0_001", // probably quest
      "Monster_Branch1.0_002", // probably quest
      "Monster_Branch1.0_003", // probably quest
    ]
  },
  [NPCMobs.EXILE_LEADER]: { keys: ["Monster055"] },
  [NPCMobs.EXILE_TECHNICIAN]: { keys: ["Monster056"] },
  [NPCMobs.FRACTSIDUS_EXECUTIONER]: {
    keys: [
      "Monster069",
      "Monster_rogue004",
    ]
  },
  [NPCMobs.FRACTSIDUS_THRUSTER]: { keys: ["Monster072"] },
  [NPCMobs.FRACTSIDUS_CANNONEER]: { keys: ["Monster086"] },
  [NPCMobs.FRACTSIDUS_GUNMASTER]: { keys: ["Monster087"] },
  [NPCMobs.SCAR]: {
    keys: [
      "Monster060",
      "Monster065",
      "Monster088",
      "Monster089",
      "Monster102",
      "Monster103",
    ]
  },

  // 2.4
  [NPCMobs.GALECREST_GLADIATOR]: {
    keys: [
      "Monster_branch2.4_009",
      "Monster_branch2.4_023",
      "branch2.6_177_Monster_monster2_6/Kahara6",
    ]
  },
  [NPCMobs.LIGHTCREST_GLADIATOR]: {
    keys: [
      "Monster_branch2.4_010",
      "Monster_branch2.4_018",
      "Monster_Branch2.6_005",
      "branch2.6_177_Monster_monster2_6/Kahara1",
      "Monster_Branch2.6_006",
    ]
  },
  [NPCMobs.FLAMECREST_GLADIATOR]: {
    keys: [
      "Monster_branch2.4_011",
      "Monster_branch2.4_021",
      "Monster_Branch2.6_008",
      "branch2.6_177_Monster_monster2_6/Kahara5",
    ]
  },
  [NPCMobs.FROSTCREST_GLADIATOR]: {
    keys: [
      "Monster_branch2.4_019",
      "branch2.4_Monster_branch2.4_008",
      "branch2.6_177_Monster_monster2_6/Kahara2",
    ]
  },

  // 2.5
  [NPCMobs.FRACTSIDUS_INSPECTOR]: {
    keys: [
      "Monster_Branch2.5_001",
      "Monster_Branch2.7_0002",
    ]
  },
  [NPCMobs.ABYSSAL_GUNMASTER]: {
    keys: [
      "Monster_branch2.5_70160",
    ],
  },

  // 3.0
  [NPCMobs.ROYAN_MAN]: {
    keys: [
      "Monster_Branch3.0_011",
      "branch3.1_115_Monster_Branch3.1_012",
    ]
  },
  [NPCMobs.ROYAN_WOMAN]: {
    keys: [
      "Monster_Branch3.0_012",
      "branch3.1_115_Monster_Branch3.1_013",
    ]
  },

  // 3.1
};

export const NPCMobsTranslationMap: Record<string, TranslationMapEntry> =
  (() => {
    const result: Record<string, TranslationMapEntry> = {};

    for (const [name, { keys }] of Object.entries(NPCMobsTranslationMapGroups)) {
      for (const key of keys) {
        result[key] = { name };
      }
    }

    return result;
  })();

export const NPCMobsDisplayOrder = [
];
