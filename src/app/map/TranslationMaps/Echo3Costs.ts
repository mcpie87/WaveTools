import { TranslationMapEntry } from "./TranslationMapInterface";

export enum Echo3Cost {
  // 1.0
  CYAN_FEATHERED_HERON = "Cyan-Feathered Heron",
  VIOLET_FEATHERED_HERON = "Violet-Feathered Heron",
  VIRIDBLADE_SAURIAN = "Viridblade Saurian",
  SPEARBACK = "Spearback",
  CARAPACE = "Carapace",
  TAMBOURINIST = "Tambourinist",
  FLAUTIST = "Flautist",
  AUTOPUPPET_SCOUT = "Autopuppet Scout",
  ROSESHROOM = "Roseshroom",
  STONEWALL_BRACER = "Stonewall Bracer",
  CHASM_GUARDIAN = "Chasm Guardian",
  ROCKSTEADY_GUARDIAN = "Rocksteady Guardian",
  HAVOC_DREADMANE = "Havoc Dreadmane",
  HOOCHIEF = "Hoochief",
  VIRIDBLAZE_SAURIAN = "Viridblaze Saurian",
  PHANTOM_ROCKSTEADY_GUARDIAN = "Phantom: Rocksteady Guardian",

  // 1.1
  LIGHTCRUSHER = "Lightcrusher",
  GLACIO_DREADMANE = "Glacio Dreadmane",
  LUMISCALE_CONSTRUCT = "Lumiscale Construct",
  PHANTOM_LIGHTCRUSHER = "Phantom: Lightcrusher",

  // 1.3
  PHANTOM_LUMISCALE_CONSTRUCT = "Phantom: Lumiscale Construct",

  // 2.0
  CHOP_CHOP = "Chop Chop",
  CUDDLE_WUDDLE = "Cuddle Wuddle",
  QUESTLESS_KNIGHT = "Questless Knight",
  DIURNUS_KNIGHT = "Diurnus Knight",
  NOCTURNUS_KNIGHT = "Nocturnus Knight",
  ABYSSAL_PATRICIUS = "Abyssal Patricius",
  ABYSSAL_GLADIUS = "Abyssal Gladius",
  ABYSSAL_MERCATOR = "Abyssal Mercator",
  VITREUM_DANCER = "Vitreum Dancer",

  // 2.1
  HURRICLAW = "Hurriclaw",
  RAGE_AGAINST_THE_STATUE = "Rage Against the Statue",

  // 2.2
  CAPITANEUS = "Capitaneus",
  PHANTOM_CAPITANEUS = "Phantom: Capitaneus",

  // 2.4
  KERASAUR = "Kerasaur",
  CORROSAURUS = "Corrosaurus",
  PILGRIMS_SHELL = "Pilgrim's Shell",
  TORN_CUDDLE_WUDDLE = "Torn Cuddle Wuddle",

  // 2.5
  NIGHTMARE_TAMBOURINIST = "Nightmare: Tambourinist",

  // 2.6
  NIGHTMARE_VIOLET_FEATHERED_HERON = "Nightmare: Violet-Feathered Heron",

  // 2.8
  NIGHTMARE_ROSESHROOM = "Nightmare: Roseshroom",

  // 3.0
  SPACETREK_EXPLORER = "Spacetrek Explorer",
  IRONHOOF = "Ironhoof",
  FLORA_REINDEER = "Flora Reindeer",
  MINING_REINDEER = "Mining Reindeer",
  TWIN_NOVA_NEBULOUS_CANNON = "Twin Nova: Nebulous Cannon",
  TWIN_NOVA_COLLAPSAR_BLADE = "Twin Nova: Collapsar Blade",
  SABERCAT_REAVER = "Sabercat Reaver",
  SABERCAT_PROWLER = "Sabercat Prowler",
  TWIN_NOVA_VOID_REVENANT = "Twin Nova: Void Revenant",

  // 3.1
  GLOMMOTH = "Glommoth",
  KRONABLIGHT = "Kronablight",
  KRONACLAW = "Kronaclaw",
  REMINISCENCE_KRONACLAW = "Reminiscence: Kronaclaw",
  FROSTBITE_COLEOID = "Frostbite Coleoid",
  WINDLASH_COLEOID = "Windlash Coleoid",

  NIGHTMARE_CYAN_FEATHERED_HERON = "Nightmare: Cyan-Feathered Heron",
  NIGHTMARE_VIRIDBLADE_SAURIAN = "Nightmare: Viridblade Saurian",
}

const Echo3CostTranslationMapGroups: Record<string, Record<string, string[]>> = {
  // 1.0
  [Echo3Cost.VIOLET_FEATHERED_HERON]: { keys: ["Monster031"] },
  [Echo3Cost.CYAN_FEATHERED_HERON]: { keys: ["Monster032"] },
  [Echo3Cost.ROSESHROOM]: { keys: ["Monster043"] },
  [Echo3Cost.SPEARBACK]: {
    keys: [
      "Monster051",
      "Monster_Branch1.1_006",
    ]
  },
  [Echo3Cost.HOOCHIEF]: {
    keys: [
      "Monster050",
      "Monster128",
      "Monster140",
      "Monster141",
      "Monster_branch1.3_007",
      "Monster_rogue010",
    ]
  },
  [Echo3Cost.CARAPACE]: { keys: ["Monster054"] },
  [Echo3Cost.HAVOC_DREADMANE]: { keys: ["Monster049"] },
  [Echo3Cost.FLAUTIST]: {
    keys: [
      "Monster038",
      "Monster_Branch3.0_066",
      "branch2.6_177_Monster_monster2_6/Kahara18",
      "Monster_rogue011"
    ]
  },
  [Echo3Cost.TAMBOURINIST]: {
    keys: [
      "Monster039",
      "Monster_branch1.3_009", // 1.3, probably lvl 120
      "Monster_Branch3.0_067",
      "branch2.6_177_Monster_monster2_6/Kahara17",
    ]
  },
  [Echo3Cost.STONEWALL_BRACER]: {
    keys: [
      "Monster037",
      "Monster_Branch1.1_005",
      "Monster_rogue007",
    ]
  },
  [Echo3Cost.ROCKSTEADY_GUARDIAN]: {
    keys: [
      "Monster040",
      "Monster_branch1.3_010",
      "Monster_Branch3.0_065",
      "branch2.6_177_Monster_monster2_6/Kahara20",
      "Monster081",
      "Monster_Branch2.8_004",
    ]
  },
  [Echo3Cost.CHASM_GUARDIAN]: {
    keys: [
      "Monster041",
      "Monster130",
      "Monster_rogue009",
      "branch2.6_177_Monster_monster2_6/BetweenTheChaos21",
      "branch2.6_177_Monster_monster2_6/Kahara19",
      "Monster_Branch3.0_064"
    ]
  },
  [Echo3Cost.VIRIDBLAZE_SAURIAN]: { keys: ["Monster042"] },
  [Echo3Cost.AUTOPUPPET_SCOUT]: { keys: ["Monster150"] },
  [Echo3Cost.PHANTOM_ROCKSTEADY_GUARDIAN]: { keys: ["Monster1040"] },
  // 1.1
  [Echo3Cost.LIGHTCRUSHER]: {
    keys: [
      "Monster126",
      "Monster_Branch1.1_011",
      "Monster126_1"
    ]
  },
  [Echo3Cost.GLACIO_DREADMANE]: { keys: ["Monster_branch1.1_001"] },
  [Echo3Cost.LUMISCALE_CONSTRUCT]: {
    keys: [
      "Monster170",
      "Monster171",
      "Monster_Branch2.8_011",
    ]
  },
  [Echo3Cost.PHANTOM_LIGHTCRUSHER]: { keys: ["Monster129"] },
  // 1.3
  [Echo3Cost.PHANTOM_LUMISCALE_CONSTRUCT]: { keys: ["Monster1172"] },
  // 2.0
  [Echo3Cost.CUDDLE_WUDDLE]: {
    keys: [
      "Monster_branch2.0_009",
      "branch2.0_Monster_branch2.0_038",
      "Monster_branch2.0_041",
      "TsEntity_拂风水畔拍照任务_大布偶画匠",
      "branch2.3_165_Monster_branch2.0_010",
    ]
  },
  [Echo3Cost.QUESTLESS_KNIGHT]: {
    keys: [
      "branch2.0_Monster188",
      "Monster173",
      "Monster_branch2.0_035", // lvl 120?
    ]
  },
  [Echo3Cost.DIURNUS_KNIGHT]: {
    keys: [
      "branch2.0_Monster189",
      "Monster184",
      "Monster_Branch2.2_026",
    ]
  },
  [Echo3Cost.NOCTURNUS_KNIGHT]: {
    keys: [
      "branch2.0_Monster190",
      "Monster183",
      "Monster_Branch2.2_027",
      "Monster185",
    ]
  },
  [Echo3Cost.VITREUM_DANCER]: {
    keys: [
      "Monster059",
      "branch2.0_Monster187_shanguang",
      "Monster_branch2.0_037",
      "Monster_branch2.0_045",
    ]
  },
  [Echo3Cost.ABYSSAL_MERCATOR]: {
    keys: [
      "branch2.0_Monster_branch2.0_031",
      "Monster_branch2.0_040",
      "branch2.6_177_Monster_monster2_6/BetweenTheChaos19",
      "branch2.0_Monster_035",
      "branch2.0_Monster_036",
    ]
  },
  [Echo3Cost.ABYSSAL_PATRICIUS]: {
    keys: [
      "branch2.0_Monster_branch2.0_032",
      "Monster_branch2.0_007",
      "branch2.0_Monster_branch2.0_033",
    ]
  },
  [Echo3Cost.ABYSSAL_GLADIUS]: {
    keys: [
      "branch2.0_Monster_branch2.0_034",
      "branch2.6_177_Monster_monster2_6/BetweenTheChaos18",
      "Monster_branch2.0_030",
      "Monster_branch2.0_039",
    ]
  },
  [Echo3Cost.CHOP_CHOP]: {
    keys: [
      "Monster_branch2.0_012",
      "Monster_branch2.0_016",
      "Monster_Branch2.2_025",
    ]
  },

  // 2.1
  [Echo3Cost.HURRICLAW]: { keys: ["Monster_branch2.1_12", "Monster_branch2.1_04"] },
  [Echo3Cost.RAGE_AGAINST_THE_STATUE]: {
    keys: [
      "Monster_branch2.1_03",
      "Monster_branch2.1_11",
    ]
  },
  [Echo3Cost.CAPITANEUS]: {
    keys: [
      "Monster_Branch2.2_006",
      "Monster_Branch2.7_009",
      "Monster_Branch2.2_011",
      "Monster_Branch2.2_013",
      "Monster_Branch2.2_014",
      "Monster_Branch2.2_015",
      "Monster_Branch2.2_016",
      "Monster_Branch2.5_007",
    ]
  },
  [Echo3Cost.PHANTOM_CAPITANEUS]: { keys: ["Monster_Branch2.2_107", "branch2.6_177_Monster_monster2_6/BetweenTheChaos20"] },
  // 2.4
  [Echo3Cost.TORN_CUDDLE_WUDDLE]: { keys: ["branch2.4_Monster_branch2.4_001"] },
  [Echo3Cost.KERASAUR]: {
    keys: [
      "Monster_branch2.4_025",
      "branch2.6_Monster_77069",
      "branch2.4_656_Monster_77078",
      "branch2.4_Monster_77069",
    ]
  },
  [Echo3Cost.PILGRIMS_SHELL]: {
    keys: [
      "Monster_branch2.4_024",
      "branch2.4_Monster_branch2.4_032",
      "branch2.6_177_Monster_monster2_6/BetweenTheChaos7",
      "Monster_Branch2.6_009",
    ],
  },
  // 2.5
  [Echo3Cost.CORROSAURUS]: {
    keys: [
      "Monster_Branch2.6_002",
      "Monster_Branch2.6_016",
      "branch2.6_667_Monster_Branch2.6_003",
    ]
  },
  [Echo3Cost.NIGHTMARE_TAMBOURINIST]: {
    keys: [
      "Monster_Branch2.5_014",
    ]
  },

  // 2.6
  [Echo3Cost.NIGHTMARE_CYAN_FEATHERED_HERON]: { keys: ["Monster_Branch2.6_010"] },
  [Echo3Cost.NIGHTMARE_VIOLET_FEATHERED_HERON]: { keys: ["Monster_Branch2.6_015"] },

  // 2.7
  [Echo3Cost.NIGHTMARE_VIRIDBLADE_SAURIAN]: { keys: ["branch2.7_430_Monster_monster2_10"] },

  // 2.8
  [Echo3Cost.NIGHTMARE_ROSESHROOM]: { keys: ["branch2.8_241_Monster_monster2_11"] },

  // 3.0
  [Echo3Cost.IRONHOOF]: { keys: ["Monster_Branch3.0_014", "Monster_Branch3.0_053"] },
  [Echo3Cost.FLORA_REINDEER]: {
    keys: [
      "Monster_Branch3.0_015",
      "Monster_Branch3.0_054",
      "Monster_Branch3.0_016",
      "Monster_Branch3.0_055",
    ]
  },
  [Echo3Cost.SPACETREK_EXPLORER]: { keys: ["Monster_Branch3.0_048", "branch3.0_678_Monster_monster3_2"] },
  [Echo3Cost.FROSTBITE_COLEOID]: { keys: ["Monster_Branch3.0_004"] },
  [Echo3Cost.WINDLASH_COLEOID]: { keys: ["Monster_Branch3.0_002"] },
  [Echo3Cost.TWIN_NOVA_NEBULOUS_CANNON]: {
    keys: [
      "Monster_Branch3.0_049",
      "branch3.0_3_Monster"
    ]
  },
  [Echo3Cost.TWIN_NOVA_VOID_REVENANT]: {
    keys: [
      "branch3.0_2_Monster",
      "Monster_Branch3.0_050",
      "branch3.0_6_Monster",
      "branch3.0_243_Monster3",
    ]
  },

  // 3.1?
  [Echo3Cost.KRONABLIGHT]: {
    keys: [
      "Monster_branch3.1_015",
      "TsEntity_生态动物_冠顶械隼",
      "branch3.1_658_Monster_monster3_3",
    ]
  },
  [Echo3Cost.KRONACLAW]: { keys: ["branch3.1_658_Monster_monster3_2", "Monster_branch3.1_014"] },
  [Echo3Cost.SABERCAT_PROWLER]: { keys: ["branch3.0_678_Monster_monster3_1"] },
  [Echo3Cost.SABERCAT_REAVER]: { keys: ["branch3.0_678_Monster_monster3_3"] },
  [Echo3Cost.GLOMMOTH]: {
    keys: [
      "branch3.1_115_Monster_006",
      "branch3.1_Monster_005",
    ]
  },
}

export const Echo3CostTranslationMap: Record<string, TranslationMapEntry> =
  (() => {
    const result: Record<string, TranslationMapEntry> = {};

    for (const [name, { keys }] of Object.entries(Echo3CostTranslationMapGroups)) {
      for (const key of keys) {
        result[key] = { name };
      }
    }

    return result;
  })();

export const Echo3CostDisplayOrder = Object.values(Echo3Cost);
