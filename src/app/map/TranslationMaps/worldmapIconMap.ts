import { ItemOre, ItemPlant, ItemSpecialty } from "@/app/interfaces/item_types";
import { ASSET_URL } from "@/constants/constants";
import { Echo4Cost } from "./Echo4Costs";
import { Echo3Cost } from "./Echo3Costs";
import { Echo1Cost } from "./Echo1Costs";
import { NPCMobs } from "./NPCMobs";

const GameAssetIcons: Record<string, string> = {
  /* Teleporters */
  "Resonance Nexus": "Atlas/WorldMapIcon/SP_IconMap_CS_01_UI.png",
  "Resonance Beacon": "Atlas/WorldMapIcon/SP_IconMap_CS_02_UI.png",
  "Mechascout": "Atlas/WorldMapIcon/SP_IconMap_Play_56_UI.png",

  /* Caskets */
  "Sonance Casket": "Image/IconMst160/T_IconMst160_006_UI.png",
  "Windchimer": "Image/IconMst80/T_IconMst80_007_UI.png",
  "Sonance Casket: Ragunna": "Image/IconMst80/T_IconMst80_008_UI.png",
  "Sonance Casket: Septimont": "Image/IconMst80/T_IconMst80_008_UI.png",
  "Lahai Tape": "Image/IconTask80/T_IconTask80_Task_181_UI.png",

  /* Puzzles */
  // 2.0
  "Treasure Spot": "Atlas/WorldMapIcon/SP_IconMap_Play_15_UI.png",
  "Flying Challenge": "Atlas/WorldMapIcon/SP_IconMap_Play_23_UI.png",
  "Musicfly": "/Atlas/WorldMapIcon/SP_IconMap_Play_22_UI.png",
  "Dream Patrol": "Atlas/WorldMapIcon/SP_IconMap_Play_19_UI.png",
  "Overflowing Palette": "Atlas/WorldMapIcon/SP_IconMap_Play_18_UI.png",
  // 2.4
  "Dreams of Cintercide": "Atlas/WorldMapIcon/SP_IconMap_Play_48_UI.png",
  // 2.5
  "Triptych Chest": "Atlas/WorldMapIcon/SP_IconMap_Play_45_UI.png",
  "Orchestration Altar": "Atlas/WorldMapIcon/SP_IconMap_Play_44_UI.png",
  // 3.0
  "Bike Challenge": "Atlas/WorldMapIcon/SP_IconMap_Play_61_UI.png",
  "Smartprint Cube": "Atlas/WorldMapIcon/SP_IconMap_Play_54_UI.png",
  "Soliskin": "Atlas/WorldMapIcon/SP_IconMap_Play_57_UI.png",
  // 3.1
  "Soliskin Guide": "Atlas/WorldMapIcon/SP_IconMap_Play_66_UI.png",

  /* Specialties */
  // 1.0
  [ItemSpecialty.BELLE_POPPY]: "Image/IconRup80/T_IconRup80_SM_Gat_29A_UI.png",
  [ItemSpecialty.CORIOLUS]: "Image/IconRup80/T_IconRup80_SM_Gat_30A_UI.png",
  [ItemSpecialty.IRIS]: "Image/IconRup80/T_IconRup80_SM_Gat_33A_UI.png",
  [ItemSpecialty.LANTERNBERRY]: "Image/IconC80/T_IconC80_denglongguo_UI.png",
  [ItemSpecialty.PECOK_FLOWER]: "Image/IconRup80/T_IconRup80_SM_Gat_18A_UI.png",
  [ItemSpecialty.TERRASPAWN_FUNGUS]: "Image/IconC80/T_IconC80_HuiYanGu_UI.png",
  [ItemSpecialty.VIOLET_CORAL]: "Image/IconC80/T_IconC80_Sep_061_UI.png",
  [ItemSpecialty.WINTRY_BELL]: "Image/IconRup80/T_IconRup80_SM_Gat_31A_UI.png",
  // 1.1
  [ItemSpecialty.LOONGS_PEARL]: "Image/IconC80/T_IconC80_030_UI.png",
  [ItemSpecialty.PAVO_PLUM]: "Image/IconC80/T_IconC80_029_UI.png",
  // 1.3
  [ItemSpecialty.NOVA]: "Image/IconTask80/T_IconTask80_Task_084_UI.png",
  // 2.0
  [ItemSpecialty.GOLDEN_FLEECE]: "Image/IconC80/T_IconC80_045_UI.png",
  [ItemSpecialty.FIRECRACKER_JEWELWEED]: "Image/IconC80/T_IconC80_043_UI.png",
  [ItemSpecialty.SWORD_ACORUS]: "Image/IconC80/T_IconC80_044_UI.png",
  // 2.2
  [ItemSpecialty.SEASIDE_CENDRELIS]: "Image/IconTask80/T_IconTask80_Task_144_UI.png",
  // 2.4
  [ItemSpecialty.BAMBOO_IRIS]: "Image/IconC80/T_IconC80_bianzhuhua_UI.png",
  [ItemSpecialty.BLOODLEAF_VIBURNUM]: "Image/IconC80/T_IconC80_xueyejiami_UI.png",
  // 2.5
  [ItemSpecialty.AFTERLIFE]: "Image/IconC/T_IconC_054_UI.png",
  // 2.8
  [ItemSpecialty.SUMMER_FLOWER]: "Image/IconC/T_IconC_055_UI.png",
  // 3.0
  [ItemSpecialty.RIMEWISP]: "Image/IconC/T_IconC_067_UI.png",
  [ItemSpecialty.GEMINI_SPORE]: "Image/IconC/T_IconC_066_UI.png",
  [ItemSpecialty.ARITHMETIC_SHELL]: "Image/IconC/T_IconC_063_UI.png",
  // 3.1
  [ItemSpecialty.MOSS_AMBER]: "Image/IconC/T_IconC_072_UI.png",

  /* ======================================================================= */
  /*                            NPC Monsters                                 */
  // 1.0
  "Exile Commoner": "Image/IconMonsterHead/T_IconMonsterHead_977_UI.png",
  "Fractsidus Executioner": "Image/IconMonsterHead/T_IconMonsterHead_975_UI.png",
  "Fractsidus Thruster": "Image/IconMonsterHead/T_IconMonsterHead_972_UI.png",
  "Fractsidus Cannoneer": "Image/IconMonsterHead/T_IconMonsterHead_974_UI.png",
  "Fractsidus Gunmaster": "Image/IconMonsterHead/T_IconMonsterHead_973_UI.png",

  // 2.4
  "Frostcrest Gladiator": "Image/IconMonsterHead/T_IconMonsterHead_32039_UI.png",
  "Flamecrest Gladiator": "Image/IconMonsterHead/T_IconMonsterHead_32036_UI.png",
  "Galecrest Gladiator": "Image/IconMonsterHead/T_IconMonsterHead_32037_UI.png",
  "Lightcrest Gladiator": "Image/IconMonsterHead/T_IconMonsterHead_32038_UI.png",
  "Thundercrest Gladiator": "Image/IconMonsterHead/T_IconMonsterHead_32040_UI.png",
  "Abysscrest Gladiator": "Image/IconMonsterHead/T_IconMonsterHead_32041_UI.png",

  // 2.5 ?
  "Fractsidus Inspector": "Image/IconMonsterHead/T_IconMonsterHead_32042_UI.png",

  // 3.0
  "Royan Man": "Image/IconMonsterHead/T_IconMonsterHead_31080_UI.png",
  "Royan Woman": "Image/IconMonsterHead/T_IconMonsterHead_31081_UI.png",

  /* Echoes */
  "Vanguard Junrock": "Image/IconMonsterHead/T_IconMonsterHead_015_UI.png",
  "Stonewall Bracer": "Image/IconMonsterHead/T_IconMonsterHead_185_UI.png",
  "Tempest Mephis": "Image/IconMonsterHead/T_IconMonsterHead_225_UI.png",
  "Crownless": "Image/IconMonsterHead/T_IconMonsterHead_999_UI.png",
  "Fission Junrock": "Image/IconMonsterHead/T_IconMonsterHead_025_UI.png",
  "Electro Predator": "Image/IconMonsterHead/T_IconMonsterHead_035_UI.png",
  "Glacio Predator": "Image/IconMonsterHead/T_IconMonsterHead_105_UI.png",
  "Aero Predator": "Image/IconMonsterHead/T_IconMonsterHead_235_UI.png",
  "Fusion Warrior": "Image/IconMonsterHead/T_IconMonsterHead_045_UI.png",
  "Havoc Warrior": "Image/IconMonsterHead/T_IconMonsterHead_055_UI.png",
  "Snip Snap": "Image/IconMonsterHead/T_IconMonsterHead_065_UI.png",
  "Zig Zag": "Image/IconMonsterHead/T_IconMonsterHead_075_UI.png",
  "Whiff Whaff": "Image/IconMonsterHead/T_IconMonsterHead_085_UI.png",
  "Tick Tack": "Image/IconMonsterHead/T_IconMonsterHead_095_UI.png",
  "Gulpuff": "Image/IconMonsterHead/T_IconMonsterHead_115_UI.png",
  "Chirpuff": "Image/IconMonsterHead/T_IconMonsterHead_971_UI.png",
  "Glacio Prism": "Image/IconMonsterHead/T_IconMonsterHead_145_UI.png",
  "Fusion Prism": "Image/IconMonsterHead/T_IconMonsterHead_155_UI.png",
  "Spectro Prism": "Image/IconMonsterHead/T_IconMonsterHead_165_UI.png",
  "Havoc Prism": "Image/IconMonsterHead/T_IconMonsterHead_175_UI.png",
  "Cruisewing": "Image/IconMonsterHead/T_IconMonsterHead_255_UI.png",
  "Sabyr Boar": "Image/IconMonsterHead/T_IconMonsterHead_265_UI.png",
  "Excarat": "Image/IconMonsterHead/T_IconMonsterHead_275_UI.png",
  "Baby Viridblaze Saurian": "Image/IconMonsterHead/T_IconMonsterHead_285_UI.png",
  "Baby Roseshroom": "Image/IconMonsterHead/T_IconMonsterHead_305_UI.png",
  "Exile": "Image/IconMonsterHead/T_IconMonsterHead_977_UI.png",
  "Hooscamp Flinger": "Image/IconMonsterHead/T_IconMonsterHead_988_UI.png",
  "Diamondclaw": "Image/IconMonsterHead/T_IconMonsterHead_987_UI.png",
  "Hoartoise": "Image/IconMonsterHead/T_IconMonsterHead_969_UI.png",
  "Fusion Dreadmane": "Image/IconMonsterHead/T_IconMonsterHead_980_UI.png",
  "Violet-Feathered Heron": "Image/IconMonsterHead/T_IconMonsterHead_125_UI.png",
  "Cyan-Feathered Heron": "Image/IconMonsterHead/T_IconMonsterHead_135_UI.png",
  "Flautist": "Image/IconMonsterHead/T_IconMonsterHead_195_UI.png",
  "Tambourinist": "Image/IconMonsterHead/T_IconMonsterHead_205_UI.png",
  "Rocksteady Guardian": "Image/IconMonsterHead/T_IconMonsterHead_245_UI.png",
  "Chasm Guardian": "Image/IconMonsterHead/T_IconMonsterHead_215_UI.png",
  "Viridblaze Saurian": "Image/IconMonsterHead/T_IconMonsterHead_295_UI.png",
  "Roseshroom": "Image/IconMonsterHead/T_IconMonsterHead_315_UI.png",
  "Havoc Dreadmane": "Image/IconMonsterHead/T_IconMonsterHead_984_UI.png",
  "Hoochief Cyclone": "Image/IconMonsterHead/T_IconMonsterHead_989_UI.png",
  "Spearback": "Image/IconMonsterHead/T_IconMonsterHead_986_UI.png",
  "Carapace": "Image/IconMonsterHead/T_IconMonsterHead_970_UI.png",
  "Exile Leader": "Image/IconMonsterHead/T_IconMonsterHead_979_UI.png",
  "Exile Technician": "Image/IconMonsterHead/T_IconMonsterHead_978_UI.png",
  "Inferno Rider": "Image/IconMonsterHead/T_IconMonsterHead_325_UI.png",
  "Impermanence Heron": "Image/IconMonsterHead/T_IconMonsterHead_995_UI.png",
  "Lampylumen Myriad": "Image/IconMonsterHead/T_IconMonsterHead_994_UI.png",
  "Feilian Beringal": "Image/IconMonsterHead/T_IconMonsterHead_996_UI.png",
  "Mourning Aix": "Image/IconMonsterHead/T_IconMonsterHead_997_UI.png",
  "Bell-Borne Geochelone": "Image/IconMonsterHead/T_IconMonsterHead_992_UI.png",
  "Hoochief Menace": "Image/IconMonsterHead/T_IconMonsterHead_1005_UI.png",
  "Hooscamp Clapperclaw": "Image/IconMonsterHead/T_IconMonsterHead_1005_UI.png",
  "Traffic Illuminator": "Image/IconMonsterHead/T_IconMonsterHead_1000_UI.png",
  "Clang Bang": "Image/IconMonsterHead/T_IconMonsterHead_1001_UI.png",
  "Autopuppet Scout": "Image/IconMonsterHead/T_IconMonsterHead_1003_UI.png",
  "Mech Abomination": "Image/IconMonsterHead/T_IconMonsterHead_993_UI.png",
  "Dreamless": "Image/IconMonsterHead/T_IconMonsterHead_998_UI.png",
  "Thundering Mephis": "Image/IconMonsterHead/T_IconMonsterHead_226_UI.png",
  "Phantom: Mourning Aix": "Image/IconMonsterHead/T_IconMonsterHead_1006_UI.png",
  "Phantom: Rocksteady Guardian": "Image/IconMonsterHead/T_IconMonsterHead_1007_UI.png",
  "Phantom: Hoartoise": "Image/IconMonsterHead/T_IconMonsterHead_1010_UI.png",
  "Phantom: Thundering Mephis": "Image/IconMonsterHead/T_IconMonsterHead_1008_UI.png",
  "Phantom: Feilian Beringal": "Image/IconMonsterHead/T_IconMonsterHead_1009_UI.png",
  "Phantom: Impermanence Heron": "Image/IconMonsterHead/T_IconMonsterHead_1014_UI.png",
  "Hooscamp": "Image/IconMonsterHead/T_IconMonsterHead_988_UI.png",
  "Hoochief": "Image/IconMonsterHead/T_IconMonsterHead_989_UI.png",
  "Lava Larva": "Image/IconMonsterHead/T_IconMonsterHead_326_UI.png",
  "Dwarf Cassowary": "Image/IconMonsterHead/T_IconMonsterHead_330_UI.png",
  "Glacio Dreadmane": "Image/IconMonsterHead/T_IconMonsterHead_985_UI.png",
  "Lumiscale Construct": "Image/IconMonsterHead/T_IconMonsterHead_329_UI.png",
  "Lightcrusher": "Image/IconMonsterHead/T_IconMonsterHead_328_UI.png",
  "Jué": "Image/IconMonsterHead/T_IconMonsterHead_327_UI.png",
  "Phantom: Clang Bang": "Image/IconMonsterHead/T_IconMonsterHead_1015_UI.png",
  "Phantom: Lightcrusher": "Image/IconMonsterHead/T_IconMonsterHead_1016_UI.png",
  "Phantom: Dreamless": "Image/IconMonsterHead/T_IconMonsterHead_998_1_UI.png",
  "Phantom: Gulpuff": "Image/IconMonsterHead/T_IconMonsterHead_115_1_UI.png",
  "Phantom: Lumiscale Construct": "Image/IconMonsterHead/T_IconMonsterHead_329_1_UI.png",
  "Fallacy of No Return": "Image/IconMonsterHead/T_IconMonsterHead_350_UI.png",
  "Phantom: Inferno Rider": "Image/IconMonsterHead/T_IconMonsterHead_325_1_UI.png",
  "Scar": "Image/IconMonsterHead/T_IconMonsterHead_1004_UI.png",
  "Galescourge Stalker": "Image/IconMonsterHead/T_IconMonsterHead_31037_UI.png",
  "Voltscourge Stalker": "Image/IconMonsterHead/T_IconMonsterHead_31038_UI.png",
  "Frostscourge Stalker": "Image/IconMonsterHead/T_IconMonsterHead_31039_UI.png",
  "Chop Chop: Headless": "Image/IconMonsterHead/T_IconMonsterHead_31040_UI.png",
  "Chop Chop: Leftless": "Image/IconMonsterHead/T_IconMonsterHead_31041_UI.png",
  "Chop Chop: Rightless": "Image/IconMonsterHead/T_IconMonsterHead_31042_UI.png",
  "Fae Ignis": "Image/IconMonsterHead/T_IconMonsterHead_31043_UI.png",
  "Nimbus Wraith": "Image/IconMonsterHead/T_IconMonsterHead_31044_UI.png",
  "Hocus Pocus": "Image/IconMonsterHead/T_IconMonsterHead_31045_UI.png",
  "Torn Hocus Pocus": "Image/IconMonsterHead/T_IconMonsterHead_31045_UI.png",
  "Lottie Lost": "Image/IconMonsterHead/T_IconMonsterHead_31046_UI.png",
  "Torn Lottie Lost": "Image/IconMonsterHead/T_IconMonsterHead_31046_UI.png",
  "Diggy Duggy": "Image/IconMonsterHead/T_IconMonsterHead_31047_UI.png",
  "Torn Diggy Duggy": "Image/IconMonsterHead/T_IconMonsterHead_31047_UI.png",
  "Chest Mimic": "Image/IconMonsterHead/T_IconMonsterHead_31048_UI.png",
  "Questless Knight": "Image/IconMonsterHead/T_IconMonsterHead_32022_UI.png",
  "Diurnus Knight": "Image/IconMonsterHead/T_IconMonsterHead_32023_UI.png",
  "Nocturnus Knight": "Image/IconMonsterHead/T_IconMonsterHead_32024_UI.png",
  "Abyssal Patricius": "Image/IconMonsterHead/T_IconMonsterHead_32025_UI.png",
  "Abyssal Gladius": "Image/IconMonsterHead/T_IconMonsterHead_32026_UI.png",
  "Abyssal Mercator": "Image/IconMonsterHead/T_IconMonsterHead_32027_UI.png",
  "Chop Chop": "Image/IconMonsterHead/T_IconMonsterHead_32028_UI.png",
  "Vitreum Dancer": "Image/IconMonsterHead/T_IconMonsterHead_32029_UI.png",
  "Cuddle Wuddle": "Image/IconMonsterHead/T_IconMonsterHead_32030_UI.png",
  "Torn Cuddle Wuddle": "Image/IconMonsterHead/T_IconMonsterHead_32030_UI.png",
  "Lorelei": "Image/IconMonsterHead/T_IconMonsterHead_33011_UI.png",
  "Sentry Construct": "Image/IconMonsterHead/T_IconMonsterHead_33012_UI.png",
  "Dragon of Dirge": "Image/IconMonsterHead/T_IconMonsterHead_33013_UI.png",
  "Nightmare: Feilian Beringal": "Image/IconMonsterHead/T_IconMonsterHead_YZ_33014_UI.png",
  "Nightmare: Impermanence Heron": "Image/IconMonsterHead/T_IconMonsterHead_YZ_33015_UI.png",
  "Nightmare: Thundering Mephis": "Image/IconMonsterHead/T_IconMonsterHead_YZ_33016_UI.png",
  "Nightmare: Tempest Mephis": "Image/IconMonsterHead/T_IconMonsterHead_YZ_33017_UI.png",
  "Nightmare: Crownless": "Image/IconMonsterHead/T_IconMonsterHead_YZ_33018_UI.png",
  "Nightmare: Inferno Rider": "Image/IconMonsterHead/T_IconMonsterHead_YZ_33019_UI.png",
  "Nightmare: Mourning Aix": "Image/IconMonsterHead/T_IconMonsterHead_YZ_33020_UI.png",
  "Hecate": "Image/IconMonsterHead/T_IconMonsterHead_34010_1_UI.png",
  "Phantom: Diggy Duggy": "Image/IconMonsterHead/T_IconMonsterHead_SG_31047_UI.png",
  "Phantom: Vitreum Dancer": "Image/IconMonsterHead/T_IconMonsterHead_SG_32029_UI.png",
  "Phantom: Questless Knight": "Image/IconMonsterHead/T_IconMonsterHead_SG_32022_UI.png",
  "Phantom: Sentry Construct": "Image/IconMonsterHead/T_IconMonsterHead_SG_33009_UI.png",

  // 2.1
  [Echo1Cost.GOLDEN_JUNROCK]: "Image/IconMonsterHead/T_IconMonsterHead_31049_UI.png",
  [Echo1Cost.CALCIFIED_JUNROCK]: "Image/IconMonsterHead/T_IconMonsterHead_31050_UI.png",
  [Echo1Cost.AERO_PRISM]: "Image/IconMonsterHead/T_IconMonsterHead_31051_UI.webp",
  [Echo3Cost.HURRICLAW]: "Image/IconMonsterHead/T_IconMonsterHead_32032_UI.png",
  [Echo3Cost.RAGE_AGAINST_THE_STATUE]: "Image/IconMonsterHead/T_IconMonsterHead_32031_UI.png",
  // 2.2
  [Echo3Cost.PHANTOM_CAPITANEUS]: "Image/IconMonsterHead/T_IconMonsterHead_32033_1_UI.png",
  [Echo1Cost.ELECTRO_DRAKE]: "Image/IconMonsterHead/T_IconMonsterHead_31056_UI.png",
  [Echo1Cost.SACERDOS]: "Image/IconMonsterHead/T_IconMonsterHead_31054_UI.png",
  [Echo1Cost.LA_GUARDIA]: "Image/IconMonsterHead/T_IconMonsterHead_31052_UI.png",
  [Echo3Cost.CAPITANEUS]: "Image/IconMonsterHead/T_IconMonsterHead_32033_UI.png",
  [Echo1Cost.SAGITTARIO]: "Image/IconMonsterHead/T_IconMonsterHead_31053_UI.png",
  [Echo1Cost.GLACIO_DRAKE]: "Image/IconMonsterHead/T_IconMonsterHead_31057_UI.png",
  [Echo1Cost.AERO_DRAKE]: "Image/IconMonsterHead/T_IconMonsterHead_31055_UI.png",
  [Echo4Cost.NIGHTMARE_LAMPYLUMEN_MYRIAD]: "Image/IconMonsterHead/T_IconMonsterHead_34013_UI.png",
  // 2.3
  [Echo4Cost.FLEURDELYS]: "Image/IconMonsterHead/T_IconMonsterHead_34012_UI.png",
  // 2.4
  [Echo4Cost.NIGHTMARE_KELPIE]: "Image/IconMonsterHead/T_IconMonsterHead_33021_UI.png",
  [Echo4Cost.LIONESS_OF_GLORY]: "Image/IconMonsterHead/T_IconMonsterHead_33022_UI.png",
  [Echo3Cost.KERASAUR]: "Image/IconMonsterHead/T_IconMonsterHead_31062_UI.png",
  [Echo3Cost.CORROSAURUS]: "Image/IconMonsterHead/T_IconMonsterHead_32044_UI.png",
  [Echo3Cost.PILGRIMS_SHELL]: "Image/IconMonsterHead/T_IconMonsterHead_32034_UI.png",
  [Echo1Cost.FUSION_DRAKE]: "Image/IconMonsterHead/T_IconMonsterHead_31058_UI.png",
  [Echo1Cost.DEVOTEE_FLESH]: "Image/IconMonsterHead/T_IconMonsterHead_31061_UI.png",
  [Echo1Cost.SPECTRO_DRAKE]: "Image/IconMonsterHead/T_IconMonsterHead_31059_UI.png",
  [Echo1Cost.HAVOC_DRAKE]: "Image/IconMonsterHead/T_IconMonsterHead_31060_UI.png",

  // 2.5
  [Echo4Cost.FENRICO]: "Image/IconMonsterHead/T_IconMonsterHead_34015_UI.png",
  [Echo3Cost.NIGHTMARE_TAMBOURINIST]: "Image/IconMonsterHead/T_IconMonsterHead_32043_UI.png",
  [Echo1Cost.NIGHTMARE_GLACIO_PREDATOR]: "Image/IconMonsterHead/T_IconMonsterHead_31064_UI.png",
  [Echo1Cost.NIGHTMARE_HAVOC_WARRIOR]: "Image/IconMonsterHead/T_IconMonsterHead_31063_UI.png",
  [NPCMobs.ABYSSAL_GUNMASTER]: "Image/IconMonsterHead/T_IconMonsterHead_32035_UI.png",

  // 2.6
  [Echo4Cost.LADY_OF_THE_SEA]: "Image/IconMonsterHead/T_IconMonsterHead_34018_UI.png",
  [Echo3Cost.NIGHTMARE_CYAN_FEATHERED_HERON]: "Image/IconMonsterHead/T_IconMonsterHead_32046_UI.png",
  [Echo3Cost.NIGHTMARE_VIOLET_FEATHERED_HERON]: "Image/IconMonsterHead/T_IconMonsterHead_32045_UI.png",
  [Echo1Cost.NIGHTMARE_GULPUFF]: "Image/IconMonsterHead/T_IconMonsterHead_31067_UI.png",
  [Echo1Cost.NIGHTMARE_ELECTRO_PREDATOR]: "Image/IconMonsterHead/T_IconMonsterHead_31065_UI.png",
  [Echo1Cost.NIGHTMARE_AERO_PREDATOR]: "Image/IconMonsterHead/T_IconMonsterHead_31066_UI.png",
  [Echo1Cost.NIGHTMARE_CHIRPUFF]: "Image/IconMonsterHead/T_IconMonsterHead_31068_UI.png",

  // 2.7
  [Echo4Cost.FALSE_SOVEREIGN]: "Image/IconMonsterHead/T_IconMonsterHead_34017_UI.png",
  [Echo4Cost.THRENODIAN_LEVIATHAN]: "Image/IconMonsterHead/T_IconMonsterHead_34020_UI.png",
  [Echo3Cost.NIGHTMARE_VIRIDBLADE_SAURIAN]: "Image/IconMonsterHead/T_IconMonsterHead_32047_UI.png",
  [Echo1Cost.NIGHTMARE_BABY_ROSESHROOM]: "Image/IconMonsterHead/T_IconMonsterHead_31073_UI.png",
  [Echo1Cost.NIGHTMARE_BABY_VIRIDBLAZE_SAURIAN]: "Image/IconMonsterHead/T_IconMonsterHead_31072_UI.png",

  // 2.8
  [Echo3Cost.NIGHTMARE_ROSESHROOM]: "Image/IconMonsterHead/T_IconMonsterHead_32048_UI.png",
  [Echo1Cost.NIGHTMARE_TICK_TACK]: "Image/IconMonsterHead/T_IconMonsterHead_31075_UI.png",
  [Echo1Cost.NIGHTMARE_DWARF_CASSOWARY]: "Image/IconMonsterHead/T_IconMonsterHead_31076_UI.png",

  // 3.0
  [Echo4Cost.REACTOR_HUSK]: "Image/IconMonsterHead/T_IconMonsterHead_34022_UI.png",
  [Echo3Cost.FROSTBITE_COLEOID]: "Image/IconMonsterHead/T_IconMonsterHead_32057_UI.png",
  [Echo3Cost.WINDLASH_COLEOID]: "Image/IconMonsterHead/T_IconMonsterHead_32058_UI.png",
  [Echo3Cost.IRONHOOF]: "Image/IconMonsterHead/T_IconMonsterHead_32053_UI.png",
  [Echo3Cost.SPACETREK_EXPLORER]: "Image/IconMonsterHead/T_IconMonsterHead_32054_UI.png",
  [Echo3Cost.TWIN_NOVA_NEBULOUS_CANNON]: "Image/IconMonsterHead/T_IconMonsterHead_32049_UI.png",
  [Echo3Cost.FLORA_REINDEER]: "Image/IconMonsterHead/T_IconMonsterHead_32051_UI.png",
  [Echo1Cost.TREMOR_WARRIOR]: "Image/IconMonsterHead/T_IconMonsterHead_31074_UI.png",
  [Echo1Cost.GEOSPIDER_S4]: "Image/IconMonsterHead/T_IconMonsterHead_31079_UI.png",
  [Echo1Cost.FLORA_DRONE]: "Image/IconMonsterHead/T_IconMonsterHead_31077_UI.png",
  [Echo1Cost.MINING_DRONE]: "Image/IconMonsterHead/T_IconMonsterHead_31078_UI.png",
  [Echo1Cost.ZIP_ZAP]: "Image/IconMonsterHead/T_IconMonsterHead_31082_UI.png",

  // 3.1
  [Echo4Cost.NAMELESS_EXPLORER]: "Image/IconMonsterHead/T_IconMonsterHead_34026_UI.png",
  [Echo4Cost.SIGILLUM]: "Image/IconMonsterHead/T_IconMonsterHead_34025_0_UI.png",
  [Echo3Cost.SABERCAT_REAVER]: "Image/IconMonsterHead/T_IconMonsterHead_32055_UI.png",
  [Echo3Cost.KRONACLAW]: "Image/IconMonsterHead/T_IconMonsterHead_32060_UI.png",
  [Echo3Cost.KRONABLIGHT]: "Image/IconMonsterHead/T_IconMonsterHead_32059_UI.png",
  [Echo3Cost.SABERCAT_PROWLER]: "Image/IconMonsterHead/T_IconMonsterHead_32056_UI.png",
  [Echo3Cost.GLOMMOTH]: "Image/IconMonsterHead/T_IconMonsterHead_32061_UI.png",
  [Echo1Cost.SHADOW_STEPPER]: "Image/IconMonsterHead/T_IconMonsterHead_31084_UI.png",
  [Echo1Cost.ICEGLINT_DANCER]: "Image/IconMonsterHead/T_IconMonsterHead_31083_UI.png",


  /* Ores */
  // 1.0
  [ItemOre.FLORAMBER]: "Image/IconC80/T_IconC80_SM_Gat_19A_UI.png",
  [ItemOre.SCARLETTHORN]: "Image/IconC80/T_IconC80_SM_Gat_22A_UI.png",
  [ItemOre.LAMPYLUMEN]: "Image/IconC80/T_IconC80_SM_Gat_21A_UI.png",
  [ItemOre.INDIGOITE]: "Image/IconC80/T_IconC80_SM_Gat_20A_UI.png",
  // 1.1
  [ItemOre.FLUORITE]: "Image/IconC80/T_IconC80_032_UI.png",
  // 2.0
  [ItemOre.FOOLS_GOLD]: "Image/IconC80/T_IconC80_047_UI.png",
  [ItemOre.RESONANT_CALCITE]: "Image/IconC80/T_IconC80_046_UI.png",
  // 3.0
  [ItemOre.LUXITE]: "Image/IconC/T_IconC_069_UI.png",
  // 3.1
  [ItemOre.METEORIC_IRON]: "Image/IconC/T_IconC_073_UI.png",


  /* Plants */
  [ItemPlant.CLIMBING_FIG]: "Image/IconRup80/T_IconRup80_SM_Gat_23A_UI.png",
  [ItemPlant.BITTBERRY]: "Image/IconRup80/T_IconRup80_SM_Gat_32A_UI.png",
  [ItemPlant.DEWVETCH]: "Image/IconC80/T_IconC80_SM_Gat_08A_UI.png",
  [ItemPlant.PEARL_LEAF]: "Image/IconC80/T_IconC80_SM_Gat_06A_UI.png",
  [ItemPlant.NOCTEMINT]: "Image/IconC80/T_IconC80_SM_Gat_09A_UI.png",
  [ItemPlant.CALTROP]: "Image/IconC80/T_IconC80_Com_004_1_UI.png",
  [ItemPlant.PERILLA]: "Image/IconC80/T_IconC80_SM_Gat_01B_UI.png",
  [ItemPlant.HONEYSUCKLE]: "Image/IconC80/T_IconC80_SM_Gat_10A_UI.png",
  [ItemPlant.ANGELICA]: "Image/IconC80/T_IconC80_SM_Gat_07A_UI.png",
  [ItemPlant.LEMONGRASS]: "Image/IconC80/T_IconC80_SM_Gat_25A_UI.png",
  [ItemPlant.ERODORCHID]: "Image/IconC80/T_IconC80_fuguyoulan_UI.png",
  [ItemPlant.WATERLAMP]: "Image/IconC80/T_IconC80_SM_Gat_01A_UI.png",
  [ItemPlant.BUNNYWORT]: "Image/IconC80/T_IconC80_yuezao_UI.png",
  [ItemPlant.CHROMESHELL]: "Image/IconC80/T_IconC80_SM_Gat_26A_UI.png", // Verified
  [ItemPlant.DRIPSNAIL]: "Image/IconC80/T_IconC80_SM_Gat_27A_UI.png",
  [ItemPlant.CLIFFRECLUSE]: "Image/IconC80/T_IconC80_SM_Gat_12A_UI.png",
  [ItemPlant.UMBRAGRICUS]: "Image/IconC80/T_IconC80_SM_Gat_13A_UI.png",
  [ItemPlant.GEMBERRY]: "Image/IconC80/T_IconC80_SM_Gat_14A_UI.png",
  [ItemPlant.EDODES]: "Image/IconC80/T_IconC80_SM_Gat_15A_UI.png",
  [ItemPlant.VIOLA]: "Image/IconC80/T_IconC80_SM_Gat_24A_UI.png",
  [ItemPlant.BIRD_EGG]: "Image/IconC80/T_IconC80_niaodan_UI.png",
  [ItemPlant.GLOOM_SLOUGH]: "Image/IconC80/T_IconC80_SM_Gat_28A_UI.png",
  [ItemPlant.SILVER_LOTUS]: "Image/IconC80/T_IconC80_031_UI.png",
  [ItemPlant.MASTIC_NUVOLA]: "Image/IconC80/T_IconC80_037_UI.png",
  [ItemPlant.SEA_FLYTRAP]: "Image/IconTask80/T_IconTask80_Task_085_UI.png",
  [ItemPlant.VISCUM_BERRY]: "Image/IconC80/T_IconC80_038_UI.png",
  [ItemPlant.SUNFLARE_EVERLASTING]: "Image/IconC80/T_IconC80_036_UI.png",
  [ItemPlant.FELICIOUS_OLIVES]: "Image/IconC80/T_IconC80_042_UI.png",
  [ItemPlant.RAW_MEAT]: "Image/IconC80/T_IconC80_Sep_071_UI.png",
  [ItemPlant.HELIOBANE_FUNGIA]: "Image/IconC80/T_IconC80_041_UI.png",
  [ItemPlant.GOLDCREST_SCARAB]: "Image/IconC80/T_IconC80_039_UI.png",
  [ItemPlant.AMBER_HALITE]: "Image/IconC80/T_IconC80_yanhaipo_UI.png",
  [ItemPlant.FOWL_MEAT]: "Image/IconC80/T_IconC80_SM_Gat_29A_UI.png",
  [ItemPlant.OAKNUT]: "Image/IconC80/T_IconC80_limuguo_UI.png",
  [ItemPlant.EDELSCHNEE]: "Image/IconC/T_IconC_074_UI.png",
  [ItemPlant.FROSTWORT]: "Image/IconC/T_IconC_070_UI.png",
  [ItemPlant.STONE_ROSE]: "Image/IconC/T_IconC_056_UI.png",
  [ItemPlant.FOXTAIL_KELP]: "Image/IconC/T_IconC_071_UI.png",
  [ItemPlant.LUMINOUS_CALENDULA]: "Image/IconC/T_IconC_058_UI.png",
  [ItemPlant.LOTUS_SEEDS]: "Image/IconC80/T_IconC80_Sep_021_UI.png", // Verified

  /* Miscellaneous */
  "Weapon": "Image/IconWeapon/T_IconWeapon21020011_UI.png",
};

const CustomIcons: Record<string, string> = {
  "Basic Supply Chest": "Basic_Supply_Chest.webp",
  "Standard Supply Chest": "Standard_Supply_Chest.webp",
  "Advanced Supply Chest": "Advanced_Supply_Chest.webp",
  "Premium Supply Chest": "Premium_Supply_Chest.webp",
  "Tidal Supply Chest": "Premium_Supply_Chest.webp",
  "Tidal Heritage (Blue)": "Tidal_Heritage_Blue.webp",
  "Tidal Heritage (Purple)": "Tidal_Heritage_Purple.webp",
  "Tidal Heritage (Gold)": "Tidal_Heritage_Gold.webp",
  "Mutterfly": "Mutterfly.png",
  "Blobfly": "Blobfly.webp",
  "Frostbug": "Frostbug.webp",
};

export const getWorldmapIcon = (name: string): string | null => {
  const gameAssetIcon = GameAssetIcons[name];
  if (gameAssetIcon) return `${ASSET_URL}UIResources/Common/${gameAssetIcon}`;

  const iconMatch = CustomIcons[name];
  if (!iconMatch) return null;

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return `${basePath}/assets/${iconMatch}`;
};
