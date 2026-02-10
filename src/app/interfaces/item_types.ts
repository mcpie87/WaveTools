export enum ItemType {
  SHELL_CREDIT = "SHELL_CREDIT",
  COMMON = "COMMON",
  WEAPON = "WEAPON",
  WEEKLY_BOSS = "WEEKLY_BOSS",
  ELITE_BOSS = "ELITE_BOSS",
  SPECIALTY = "SPECIALTY",
  RESONATOR_EXP = "RESONATOR_EXP",
  WEAPON_EXP = "WEAPON_EXP",
  ECHO_EXP = "ECHO_EXP",
}

export type ItemTypeEXP = ItemType.RESONATOR_EXP | ItemType.WEAPON_EXP;

export type SHELL_CREDIT = "Shell Credit";
export const SHELL_CREDIT: SHELL_CREDIT = "Shell Credit";
export const SHELL_CREDIT_ID: number = 2;

export enum ItemEchoEXP {
  RARITY_5 = "Premium Sealed Tube",
  RARITY_4 = "Advanced Sealed Tube",
  RARITY_3 = "Medium Sealed Tube",
  RARITY_2 = "Basic Sealed Tube",
};

export enum ItemTuner {
  RARITY_5 = "Premium Tuner",
  RARITY_4 = "Advanced Tuner",
  RARITY_3 = "Medium Tuner",
};

export enum ItemResonatorEXP {
  RARITY_5 = "Premium Resonance Potion",
  RARITY_4 = "Advanced Resonance Potion",
  RARITY_3 = "Medium Resonance Potion",
  RARITY_2 = "Basic Resonance Potion",
};

export enum ItemWeaponEXP {
  RARITY_5 = "Premium Energy Core",
  RARITY_4 = "Advanced Energy Core",
  RARITY_3 = "Medium Energy Core",
  RARITY_2 = "Basic Energy Core",
};

export enum ItemWeeklyBoss {
  SCAR = "Unending Destruction",
  DREAMLESS = "Dreamless Feather",
  BELL_BORNE = "Monument Bell",
  JUE = "Sentinel's Dagger",
  HECATE = "The Netherworld's Stare",
  FLEURDELYS = "When Irises Bloom",
};
export type WEAPON_MOLD = "Standard Weapon Mold";

export enum ItemEliteBoss {
  MYSTERIOUS_CODE = "Mysterious Code", // Rover material
  TEMPEST_MEPHIS = "Hidden Thunder Tacet Core",
  INFERNO_RIDER = "Rage Tacet Core",
  IMPERMANENCE_HERON = "Gold-Dissolving Feather",
  LAMPYLUMEN_MYRIAD = "Sound-Keeping Tacet Core",
  FEILIAN_BERINGAL = "Roaring Rock Fist",
  MOURNING_AIX = "Elegy Tacet Core",
  CROWNLESS = "Strife Tacet Core",
  MECH_ABOMINATION = "Group Abomination Tacet Core",
  THUNDERING_MEPHIS = "Thundering Tacet Core",
  FALLACY_OF_NO_RETURN = "Topological Confinement",
  LORELEI = "Cleansing Conch",
  SENTRY_CONSTRUCT = "Platinum Core",
  DRAGON_OF_DIRGE = "Blazing Bone",
  UNFADING_GLORY = "Unfading Glory", // 2.4 boss
  TRUTH_IN_LIES = "Truth in Lies", // 2.5 boss
};

export enum ItemSpecialty {
  // 1.0 Huanglong
  IRIS = "Iris",
  TERRASPAWN_FUNGUS = "Terraspawn Fungus",
  LANTERNBERRY = "Lanternberry",
  PECOK_FLOWER = "Pecok Flower",
  BELLE_POPPY = "Belle Poppy",
  CORIOLUS = "Coriolus",
  WINTRY_BELL = "Wintry Bell",
  VIOLET_CORAL = "Violet Coral",
  // 1.1 Mt. Firmament
  LOONGS_PEARL = "Loong's Pearl",
  PAVO_PLUM = "Pavo Plum",
  // 1.3 Black Shores
  NOVA = "Nova",
  // 2.0 Rinascita
  GOLDEN_FLEECE = "Golden Fleece",
  FIRECRACKER_JEWELWEED = "Firecracker Jewelweed",
  SWORD_ACORUS = "Sword Acorus",
  // 2.2 Avinoleum
  SEASIDE_CENDRELIS = "Seaside Cendrelis",
  // 2.4 Septimont
  BAMBOO_IRIS = "Bamboo Iris",
  BLOODLEAF_VIBURNUM = "Bloodleaf Viburnum",
  // 2.5 Fabricatorium
  AFTERLIFE = "\"Afterlife\"",
  // 2.8 Honami
  SUMMER_FLOWER = "Summer Flower",
  // 3.0 Lahai Roi
  RIMEWISP = "Rimewisp",
  GEMINI_SPORE = "Gemini Spore",
  ARITHMETIC_SHELL = "Arithmetic Shell",
  // 3.1 Frostlands
  MOSS_AMBER = "Moss Amber",
}

export enum ItemCasket {
  // 1.0
  SONANCE_CASKET = "Sonance Casket",
  // 1.1
  WINDCHIMER = "Windchimer",
  // 2.0
  SONANCE_RINASCITA = "Sonance Casket: Ragunna",
  // 2.4
  SONANCE_SEPTIMONT = "Sonance Casket: Septimont",
  // 3.0
  LAHAI_TAPE = "Lahai Tape",
}

export enum ItemOre {
  // 1.0
  FLORAMBER = "Floramber",
  SCARLETTHORN = "Scarletthorn",
  LAMPYLUMEN = "Lampylumen",
  INDIGOITE = "Indigoite",
  // 1.1
  FLUORITE = "Fluorite",
  // 2.0
  FOOLS_GOLD = "Fool's Gold",
  RESONANT_CALCITE = "Resonant Calcite",
}

export enum ItemWeapon {
  PISTOL_RARITY_5 = "Flawless Phlogiston",
  PISTOL_RARITY_4 = "Refined Phlogiston",
  PISTOL_RARITY_3 = "Extracted Phlogiston",
  PISTOL_RARITY_2 = "Impure Phlogiston",
  SWORD_RARITY_5 = "Heterized Metallic Drip",
  SWORD_RARITY_4 = "Polarized Metallic Drip",
  SWORD_RARITY_3 = "Reactive Metallic Drip",
  SWORD_RARITY_2 = "Inert Metallic Drip",
  BROADBLADE_RARITY_5 = "Waveworn Residue 239",
  BROADBLADE_RARITY_4 = "Waveworn Residue 235",
  BROADBLADE_RARITY_3 = "Waveworn Residue 226",
  BROADBLADE_RARITY_2 = "Waveworn Residue 210",
  GAUNTLETS_RARITY_5 = "Cadence Blossom",
  GAUNTLETS_RARITY_4 = "Cadence Leaf",
  GAUNTLETS_RARITY_3 = "Cadence Bud",
  GAUNTLETS_RARITY_2 = "Cadence Seed",
  RECTIFIER_RARITY_5 = "Presto Helix",
  RECTIFIER_RARITY_4 = "Andante Helix",
  RECTIFIER_RARITY_3 = "Adagio Helix",
  RECTIFIER_RARITY_2 = "Lento Helix",
};

export enum ItemCommon {
  WHISPERIN_RARITY_5 = "FF Whisperin Core",
  WHISPERIN_RARITY_4 = "HF Whisperin Core",
  WHISPERIN_RARITY_3 = "MF Whisperin Core",
  WHISPERIN_RARITY_2 = "LF Whisperin Core",
  HOWLER_RARITY_5 = "FF Howler Core",
  HOWLER_RARITY_4 = "HF Howler Core",
  HOWLER_RARITY_3 = "MF Howler Core",
  HOWLER_RARITY_2 = "LF Howler Core",
  EXILE_RARITY_5 = "Tailored Ring",
  EXILE_RARITY_4 = "Improved Ring",
  EXILE_RARITY_3 = "Basic Ring",
  EXILE_RARITY_2 = "Crude Ring",
  FRACTSIDUS_RARITY_5 = "Mask of Insanity",
  FRACTSIDUS_RARITY_4 = "Mask of Distortion",
  FRACTSIDUS_RARITY_3 = "Mask of Erosion",
  FRACTSIDUS_RARITY_2 = "Mask of Constraint",
  POLYGON_RARITY_5 = "FF Polygon Core",
  POLYGON_RARITY_4 = "HF Polygon Core",
  POLYGON_RARITY_3 = "MF Polygon Core",
  POLYGON_RARITY_2 = "LF Polygon Core",
  TIDAL_RARITY_5 = "FF Tidal Residuum",
  TIDAL_RARITY_4 = "HF Tidal Residuum",
  TIDAL_RARITY_3 = "MF Tidal Residuum",
  TIDAL_RARITY_2 = "LF Tidal Residuum",
};