import { TranslationMapEntry } from "./TranslationMapInterface";

enum Echo3Cost {
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

  // 1.1
  LIGHTCRUSHER = "Lightcrusher",
  GLACIO_DREADMANE = "Glacio Dreadmane",
  LUMISCALE_CONSTRUCT = "Lumiscale Construct",

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

  // 3.1
  GLOMMOTH = "Glommoth",
  KRONABLIGHT = "Kronablight",
  REMINISCENCE_KRONACLAW = "Reminiscence: Kronaclaw",
  FROSTBITE_COLEOID = "Frostbite Coleoid",
  WINDLASH_COLEOID = "Windlash Coleoid",

  NIGHTMARE_CYAN_FEATHERED_HERON = "Nightmare: Cyan-Feathered Heron",
  NIGHTMARE_VIRIDBLADE_SAURIAN = "Nightmare: Viridblade Saurian",
}

export const Echo3CostTranslationMap: Record<string, TranslationMapEntry> = {
  "Monster031": { name: Echo3Cost.VIOLET_FEATHERED_HERON },
  "Monster032": { name: Echo3Cost.CYAN_FEATHERED_HERON },
  "Monster043": { name: Echo3Cost.ROSESHROOM },
  "Monster050": { name: Echo3Cost.HOOCHIEF },
  "Monster128": { name: Echo3Cost.HOOCHIEF },
  "Monster140": { name: Echo3Cost.HOOCHIEF },
  "Monster141": { name: Echo3Cost.HOOCHIEF },
  "Monster_branch1.3_007": { name: Echo3Cost.HOOCHIEF },

  // 2.0
  "Monster_branch2.0_009": { name: Echo3Cost.CUDDLE_WUDDLE },
  "branch2.0_Monster_branch2.0_038": { name: Echo3Cost.CUDDLE_WUDDLE },
  "Monster_branch2.0_041": { name: Echo3Cost.CUDDLE_WUDDLE },
  "TsEntity_拂风水畔拍照任务_大布偶画匠": { name: Echo3Cost.CUDDLE_WUDDLE },
  "branch2.3_165_Monster_branch2.0_010": { name: Echo3Cost.CUDDLE_WUDDLE },
  "branch2.0_Monster_branch2.0_031": { name: Echo3Cost.ABYSSAL_MERCATOR },
  "branch2.0_Monster188": { name: Echo3Cost.QUESTLESS_KNIGHT },
  "branch2.0_Monster189": { name: Echo3Cost.DIURNUS_KNIGHT },
  "branch2.0_Monster190": { name: Echo3Cost.NOCTURNUS_KNIGHT },


  // 2.4
  "branch2.4_Monster_branch2.4_001": { name: "Torn Cuddle Wuddle" },
  "Monster_branch2.4_025": { name: Echo3Cost.KERASAUR },
  "branch2.6_Monster_77069": { name: Echo3Cost.KERASAUR },
  "branch2.4_656_Monster_77078": { name: Echo3Cost.KERASAUR },
  "branch2.4_Monster_77069": { name: Echo3Cost.KERASAUR },
  "Monster_branch2.4_024": { name: "Pilgrim's Shell" },
  "branch2.4_Monster_branch2.4_032": { name: "Pilgrim's Shell" },

  // 2.5?
  "Monster_Branch2.6_002": { name: Echo3Cost.CORROSAURUS },
  "Monster_Branch2.6_016": { name: Echo3Cost.CORROSAURUS },
  "branch2.6_667_Monster_Branch2.6_003": { name: Echo3Cost.CORROSAURUS },

  // 3.0 old
  "Monster_Branch3.0_064": { name: "Chasm Guardian" },
  "Monster_Branch3.0_067": { name: "Tambourinist" },
  "Monster_Branch3.0_066": { name: "Flautist" },
  "Monster_Branch3.0_065": { name: "Rocksteady Guardian" },

  // 3.0 new
  "Monster_Branch3.0_014": { name: Echo3Cost.IRONHOOF },
  "Monster_Branch3.0_053": { name: Echo3Cost.IRONHOOF },
  "Monster_Branch3.0_015": { name: Echo3Cost.FLORA_REINDEER },
  "Monster_Branch3.0_054": { name: Echo3Cost.FLORA_REINDEER },
  "Monster_Branch3.0_016": { name: Echo3Cost.FLORA_REINDEER },
  "Monster_Branch3.0_055": { name: Echo3Cost.FLORA_REINDEER },
  "Monster_Branch3.0_048": { name: Echo3Cost.SPACETREK_EXPLORER },
  "Monster_Branch3.0_004": { name: Echo3Cost.FROSTBITE_COLEOID },
  "Monster_Branch3.0_002": { name: Echo3Cost.WINDLASH_COLEOID },
  "Monster_Branch3.0_049": { name: Echo3Cost.TWIN_NOVA_NEBULOUS_CANNON },
  "branch3.0_3_Monster": { name: Echo3Cost.TWIN_NOVA_NEBULOUS_CANNON },
  "branch3.0_678_Monster_monster3_2": { name: Echo3Cost.SPACETREK_EXPLORER },
  "branch3.0_2_Monster": { name: "Twin Nova: Void Revenant" },

  // 3.1?
  "branch3.1_658_Monster_monster3_3": { name: Echo3Cost.KRONABLIGHT },
  "branch3.1_658_Monster_monster3_2": { name: "Kronaclaw" },
  "Monster_branch3.1_014": { name: "Kronaclaw" },
  "Monster_branch3.1_015": { name: "Kronablight" },
  "TsEntity_生态动物_冠顶械隼": { name: "Kronablight" },
  "branch3.0_678_Monster_monster3_1": { name: "Sabercat Prowler" },
  "branch3.0_678_Monster_monster3_3": { name: "Sabercat Reaver" },
  "branch3.1_115_Monster_006": { name: "Glommoth" },
  "branch3.1_Monster_005": { name: "Glommoth" },
};
export const Echo3CostDisplayOrder = Object.values(Echo3Cost);
