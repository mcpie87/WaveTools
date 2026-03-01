import { TranslationMapEntry } from "./TranslationMapInterface";

export enum Echo1Cost {
  // 1.0
  VANGUARD_JUNROCK = "Vanguard Junrock",
  FISSION_JUNROCK = "Fission Junrock",
  ELECTRO_PREDATOR = "Electro Predator",
  FUSION_WARRIOR = "Fusion Warrior",
  GLACIO_PREDATOR = "Glacio Predator",
  AERO_PREDATOR = "Aero Predator",
  CRUISEWING = "Cruisewing",
  SABYR_BOAR = "Sabyr Boar",
  GULPUFF = "Gulpuff",
  EXCARAT = "Excarat",
  BABY_ROSESHROOM = "Baby Roseshroom",
  CHIRPUFF = "Chirpuff",
  GLACIO_PRISM = "Glacio Prism",
  HOARTOISE = "Hoartoise",
  WHIFF_WHAFF = "Whiff Whaff",
  SNIP_SNAP = "Snip Snap",
  ZIG_ZAG = "Zig Zag",
  TICK_TACK = "Tick Tack",
  CLANG_BANG = "Clang Bang",
  DIAMONDCLAW = "Diamondclaw",
  FUSION_PRISM = "Fusion Prism",
  SPECTRO_PRISM = "Spectro Prism",
  HAVOC_PRISM = "Havoc Prism",
  FUSION_DREADMANE = "Fusion Dreadmane",
  HAVOC_WARRIOR = "Havoc Warrior",
  HOOSCAMP_CLAPPERCLAW = "Hooscamp Clapperclaw",
  BABY_VIRIDBLAZE_SAURIAN = "Baby Viridblaze Saurian",
  HOOSCAMP_FLINGER = "Hooscamp Flinger",
  LAVA_LARVA = "Lava Larva",
  PHANTOM_GULPUFF = "Phantom: Gulpuff",
  DWARF_CASSOWARY = "Dwarf Cassowary",
  PHANTOM_HOARTOISE = "Phantom: Hoartoise",
  TRAFFIC_ILLUMINATOR = "Traffic Illuminator",

  // 2.0
  HOCUS_POCUS = "Hocus Pocus",
  DIGGY_DUGGY = "Diggy Duggy",
  LOTTIE_LOST = "Lottie Lost",
  CHOP_CHOP_HEADLESS = "Chop Chop: Headless",
  CHOP_CHOP_LEFTLESS = "Chop Chop: Leftless",
  CHOP_CHOP_RIGHTLESS = "Chop Chop: Rightless",
  NIMBUS_WRAITH = "Nimbus Wraith",
  FAE_IGNIS = "Fae Ignis",
  CHEST_MIMIC = "Chest Mimic",
  FROSTSCOURGE_STALKER = "Frostscourge Stalker",
  GALESCOURGE_STALKER = "Galescourge Stalker",
  VOLTSCOURGE_STALKER = "Voltscourge Stalker",

  // 2.1
  GOLDEN_JUNROCK = "Golden Junrock",
  CALCIFIED_JUNROCK = "Calcified Junrock",
  AERO_PRISM = "Aero Prism",

  // 2.2
  SACERDOS = "Sacerdos",
  GLACIO_DRAKE = "Glacio Drake",
  SAGITTARIO = "Sagittario",
  ELECTRO_DRAKE = "Electro Drake",
  LA_GUARDIA = "La Guardia",

  // 2.3
  FUSION_DRAKE = "Fusion Drake",
  SPECTRO_DRAKE = "Spectro Drake",
  HAVOC_DRAKE = "Havoc Drake",
  AERO_DRAKE = "Aero Drake",

  // 2.4
  TORN_LOTTIE_LOST = "Torn Lottie Lost",
  TORN_HOCUS_POCUS = "Torn Hocus Pocus",
  TORN_DIGGY_DUGGY = "Torn Diggy Duggy",
  DEVOTEE_FLESH = "Devotee's Flesh",

  // 2.5
  NIGHTMARE_GLACIO_PREDATOR = "Nightmare: Glacio Predator",
  NIGHTMARE_HAVOC_WARRIOR = "Nightmare: Havoc Warrior",

  // 2.6
  NIGHTMARE_GULPUFF = "Nightmare: Gulpuff",
  NIGHTMARE_CHIRPUFF = "Nightmare: Chirpuff",
  NIGHTMARE_ELECTRO_PREDATOR = "Nightmare: Electro Predator",
  NIGHTMARE_AERO_PREDATOR = "Nightmare: Aero Predator",

  // 2.7
  NIGHTMARE_BABY_ROSESHROOM = "Nightmare: Baby Roseshroom",
  NIGHTMARE_BABY_VIRIDBLAZE_SAURIAN = "Nightmare: Baby Viridblaze Saurian",

  // 2.8
  NIGHTMARE_TICK_TACK = "Nightmare: Tick Tack",
  NIGHTMARE_DWARF_CASSOWARY = "Nightmare: Dwarf Cassowary",

  // 3.0
  TREMOR_WARRIOR = "Tremor Warrior",
  FROSTBITE_COLEOID = "Frostbite Coleoid",
  WINDLASH_COLEOID = "Windlash Coleoid",
  GEOSPIDER_S4 = "Geospider S4",
  FLORA_DRONE = "Flora Drone",
  ZIP_ZAP = "Zip Zap",
  MINING_DRONE = "Mining Drone",

  // 3.1
  ICEGLINT_DANCER = "Iceglint Dancer",
  SHADOW_STEPPER = "Shadow Stepper",
}

export const Echo1CostTranslationMapGroups: Record<string, Record<string, string[]>> = {
  // 1.0
  [Echo1Cost.VANGUARD_JUNROCK]: { keys: ["Monster001"] },
  [Echo1Cost.FISSION_JUNROCK]: { keys: ["Monster002", "Monster079", "Monster_Branch1.1_003"] },
  [Echo1Cost.ELECTRO_PREDATOR]: {
    keys: [
      "Monster003",
      "Monster_Branch3.0_063",
      "Monster_Branch2.8_003",
    ]
  },
  [Echo1Cost.FUSION_WARRIOR]: {
    keys: [
      "Monster004",
      "branch2.6_177_Monster_monster2_6/Kahara16",
      "Monster_branch1.3_006",
      "Monster_rogue012",
    ]
  },
  [Echo1Cost.GLACIO_PREDATOR]: { keys: ["Monster010", "branch2.6_177_Monster_monster2_6/Kahara14"] },
  [Echo1Cost.AERO_PREDATOR]: {
    keys: [
      "Monster011",
      "Monster_Branch3.0_062",
      "branch2.6_177_Monster_monster2_6/Kahara15",
    ]
  },
  [Echo1Cost.CRUISEWING]: { keys: ["Monster014", "Monster_branch1.3_005"] },
  [Echo1Cost.SABYR_BOAR]: { keys: ["Monster015"] },
  [Echo1Cost.GULPUFF]: { keys: ["Monster016", "Monster149", "branch2.1_Monster001"] },
  [Echo1Cost.EXCARAT]: { keys: ["Monster017"] },
  [Echo1Cost.BABY_ROSESHROOM]: { keys: ["Monster019"] },
  [Echo1Cost.CHIRPUFF]: { keys: ["Monster030"] },
  [Echo1Cost.GLACIO_PRISM]: { keys: ["Monster034", "Monster155"] },
  [Echo1Cost.HOARTOISE]: { keys: ["Monster058"] },
  [Echo1Cost.WHIFF_WHAFF]: { keys: ["Monster008"] },
  [Echo1Cost.SNIP_SNAP]: { keys: ["Monster006"] },
  [Echo1Cost.ZIG_ZAG]: { keys: ["Monster007"] },
  [Echo1Cost.TICK_TACK]: { keys: ["Monster009", "Monster_F"] },
  [Echo1Cost.FUSION_PRISM]: { keys: ["Monster154", "Monster033"] },
  [Echo1Cost.SPECTRO_PRISM]: { keys: ["Monster035"] },
  [Echo1Cost.FUSION_DREADMANE]: { keys: ["Monster053"] },
  [Echo1Cost.HAVOC_WARRIOR]: {
    keys: [
      "Monster005",
      "Monster_Branch3.0_047",
      "branch2.6_177_Monster_monster2_6/BetweenTheChaos17",
      "branch2.6_177_Monster_monster2_6/Kahara13",
      "Monster082",
      "Monster084",
      "Monster_Branch2.8_002",
    ]
  },
  [Echo1Cost.DIAMONDCLAW]: { keys: ["Monster057", "Monster_Branch1.1_002"] },
  [Echo1Cost.HOOSCAMP_CLAPPERCLAW]: { keys: ["Monster146", "Monster147"] },
  [Echo1Cost.HOOSCAMP_FLINGER]: { keys: ["Monster052", "Monster148"] },
  [Echo1Cost.BABY_VIRIDBLAZE_SAURIAN]: { keys: ["Monster018"] },
  [Echo1Cost.HAVOC_PRISM]: { keys: ["Monster036"] },
  [Echo1Cost.PHANTOM_HOARTOISE]: { keys: ["Monster1058"] },
  [Echo1Cost.TRAFFIC_ILLUMINATOR]: { keys: ["Monster151"] },

  // 1.1
  [Echo1Cost.CLANG_BANG]: { keys: ["Monster119", "Monster120"] },
  [Echo1Cost.LAVA_LARVA]: { keys: ["Monster118"] },
  [Echo1Cost.DWARF_CASSOWARY]: { keys: ["Monster127"] },

  // 1.3
  [Echo1Cost.PHANTOM_GULPUFF]: { keys: ["Monster1148"] },

  // 2.0
  [Echo1Cost.DIGGY_DUGGY]: {
    keys: [
      "Monster_branch2.0_011",
      "branch2.3_165_Monster_branch2.0_012",
      "Monster_branch2.0_044",
    ]
  },
  [Echo1Cost.LOTTIE_LOST]: {
    keys: [
      "Monster_branch2.0_023",
      "Monster_branch2.0_043",
      "branch2.3_165_Monster_branch2.0_024",
    ]
  },
  [Echo1Cost.HOCUS_POCUS]: {
    keys: [
      "branch2.0_Monster_branch2.0_035",
      "Monster_branch2.0_022",
      "branch2.3_165_Monster_branch2.0_023",
      "Monster_branch2.0_042",
    ]
  },
  [Echo1Cost.CHEST_MIMIC]: {
    keys: [
      "branch2.0_Monster191",
      "branch2.0_Monster_020",
      "branch2.0_Monster187",
    ]
  },
  [Echo1Cost.NIMBUS_WRAITH]: { keys: ["Monster181", "Monster_branch2.0_036"] },
  [Echo1Cost.FAE_IGNIS]: {
    keys: [
      "Monster186",
      "Monster_branch2.0_031",
    ]
  },
  [Echo1Cost.CHOP_CHOP_HEADLESS]: {
    keys: [
      "Monster_branch2.0_015",
      "Monster_branch2.0_020",
      "branch2.0_Monster_branch2.0_037",
      "Monster_branch2.0_032",
    ]
  },
  [Echo1Cost.CHOP_CHOP_LEFTLESS]: {
    keys: [
      "Monster_branch2.0_014",
      "Monster_branch2.0_019",
      "branch2.0_Monster_branch2.0_036",
      "Monster_branch2.0_033",
    ]
  },
  [Echo1Cost.CHOP_CHOP_RIGHTLESS]: {
    keys: [
      "Monster_branch2.0_013",
      "Monster_branch2.0_018",
      "Monster_branch2.0_034",
    ]
  },
  [Echo1Cost.FROSTSCOURGE_STALKER]: { keys: ["Monster064"] },
  [Echo1Cost.GALESCOURGE_STALKER]: { keys: ["Monster099"] },
  [Echo1Cost.VOLTSCOURGE_STALKER]: { keys: ["Monster1"] },

  // 2.1
  [Echo1Cost.GOLDEN_JUNROCK]: {
    keys: [
      "Monster_branch2.1_05",
      "branch2.6_177_Monster_monster2_6/BetweenTheChaos15",
    ]
  },
  [Echo1Cost.CALCIFIED_JUNROCK]: {
    keys: [
      "Monster_branch2.1_06",
      "branch2.6_177_Monster_monster2_6/BetweenTheChaos16",
    ]
  },
  [Echo1Cost.AERO_PRISM]: { keys: ["Monster_branch2.1_07"] },

  // 2.2
  [Echo1Cost.SACERDOS]: {
    keys: [
      "Monster_Branch2.2_019",
      "Monster_Branch2.2_004",
    ]
  },
  [Echo1Cost.SAGITTARIO]: {
    keys: [
      "Monster_Branch2.2_018",
      "Monster_Branch2.2_001",
      "Monster_Branch2.5_009",
    ]
  },
  [Echo1Cost.LA_GUARDIA]: {
    keys: [
      "Monster_Branch2.2_017",
      "Monster_Branch2.2_002",
      "Monster_Branch2.8_013",
      "Monster_Branch2.7_005",
    ]
  },
  [Echo1Cost.GLACIO_DRAKE]: {
    keys: [
      "Monster_Branch2.2_020",
      "Monster_Branch2.2_024",
      "Monster_Branch2.2_009",
      "Monster_Branch2.4_005",
      "branch2.6_177_Monster_monster2_6/BetweenTheChaos10",
      "branch2.6_177_Monster_monster2_6/Kahara8",
    ]
  },
  [Echo1Cost.ELECTRO_DRAKE]: {
    keys: [
      "Monster_Branch2.2_021",
      "Monster_Branch2.2_007",
      "Monster_Branch2.4_007",
      "branch2.6_177_Monster_monster2_6/Kahara11",
      "branch2.6_177_Monster_monster2_6/BetweenTheChaos13",
    ]
  },
  [Echo1Cost.AERO_DRAKE]: {
    keys: [
      "Monster_Branch2.2_022",
      "Monster_Branch2.2_008",
      "Monster_Branch2.4_006",
      "branch2.6_177_Monster_monster2_6/Kahara12",
    ]
  },

  // 2.3

  // 2.4
  [Echo1Cost.TORN_LOTTIE_LOST]: { keys: ["branch2.4_Monster_branch2.4_002"] },
  [Echo1Cost.TORN_HOCUS_POCUS]: { keys: ["branch2.4_Monster_branch2.4_003"] },
  [Echo1Cost.TORN_DIGGY_DUGGY]: { keys: ["branch2.4_Monster_branch2.4_004"] },
  [Echo1Cost.DEVOTEE_FLESH]: {
    keys: [
      "branch2.4_Monster_branch2.4_005",
      "branch2.6_177_Monster_monster2_6/BetweenTheChaos8",
    ]
  },

  [Echo1Cost.FUSION_DRAKE]: {
    keys: [
      "Monster_Branch2.4_002",
      "Monster_Branch2.4_015",
      "branch2.6_177_Monster_monster2_6/BetweenTheChaos12",
      "branch2.6_177_Monster_monster2_6/Kahara10",
    ]
  },
  [Echo1Cost.SPECTRO_DRAKE]: {
    keys: [
      "Monster_Branch2.4_003",
      "Monster_Branch2.4_016",
      "branch2.6_177_Monster_monster2_6/BetweenTheChaos9",
      "branch2.6_177_Monster_monster2_6/Kahara7",
    ]
  },
  [Echo1Cost.HAVOC_DRAKE]: {
    keys: [
      "Monster_Branch2.4_004",
      "Monster_Branch2.4_017",
      "branch2.6_177_Monster_monster2_6/BetweenTheChaos11",
      "branch2.6_177_Monster_monster2_6/Kahara9",
    ]
  },

  // 2.5
  [Echo1Cost.NIGHTMARE_GLACIO_PREDATOR]: { keys: ["Monster_Branch2.5_016"] },
  [Echo1Cost.NIGHTMARE_HAVOC_WARRIOR]: { keys: ["Monster_Branch2.5_015"] },

  // 2.6
  [Echo1Cost.NIGHTMARE_GULPUFF]: { keys: ["Monster_Branch2.6_013"] },
  [Echo1Cost.NIGHTMARE_ELECTRO_PREDATOR]: { keys: ["Monster_Branch2.6_011"] },
  [Echo1Cost.NIGHTMARE_AERO_PREDATOR]: { keys: ["Monster_Branch2.6_012"] },
  [Echo1Cost.NIGHTMARE_CHIRPUFF]: { keys: ["Monster_Branch2.6_014"] },

  // 2.7
  [Echo1Cost.NIGHTMARE_BABY_ROSESHROOM]: { keys: ["branch2.7_430_Monster_monster2_8"] },
  [Echo1Cost.NIGHTMARE_BABY_VIRIDBLAZE_SAURIAN]: { keys: ["branch2.7_430_Monster_monster2_9"] },

  // 2.8
  [Echo1Cost.NIGHTMARE_TICK_TACK]: { keys: ["branch2.8_241_Monster_monster2_10"] },
  [Echo1Cost.NIGHTMARE_DWARF_CASSOWARY]: { keys: ["branch2.8_241_Monster_monster2_9"] },

  // 3.0
  [Echo1Cost.TREMOR_WARRIOR]: { keys: ["Monster_Branch3.0_007"] },
  [Echo1Cost.FLORA_DRONE]: { keys: ["Monster_Branch3.0_010", "Monster_Branch3.0_058"] },
  [Echo1Cost.ZIP_ZAP]: { keys: ["Monster_Branch3.0_005"] },
  [Echo1Cost.MINING_DRONE]: { keys: ["Monster_Branch3.0_009", "Monster_Branch3.0_057"] },
  [Echo1Cost.GEOSPIDER_S4]: { keys: ["Monster_Branch3.0_008", "Monster_Branch3.0_056"] },

  // 3.1?
  [Echo1Cost.ICEGLINT_DANCER]: { keys: ["branch3.1_243_Monster_Branch3.0_007"] },
  [Echo1Cost.SHADOW_STEPPER]: {
    keys: [
      "branch3.1_243_Monster_Branch3.0_006",
      "branch3.1_243_Monster_Branch3.0_008",
    ]
  },
};

export const Echo1CostTranslationMap: Record<string, TranslationMapEntry> =
  (() => {
    const result: Record<string, TranslationMapEntry> = {};

    for (const [name, { keys }] of Object.entries(Echo1CostTranslationMapGroups)) {
      for (const key of keys) {
        result[key] = { name };
      }
    }

    return result;
  })();

export const Echo1CostDisplayOrder = [
];