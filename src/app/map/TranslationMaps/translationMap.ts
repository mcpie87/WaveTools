import { TranslationMapEntry } from "./TranslationMapInterface";
import { ChestDisplayOrder, ChestTranslationMap } from "./Chests";
import { PuzzleDisplayOrder, PuzzleQueryCategories, PuzzleTranslationMap } from "./Puzzles";
import { AnimalDisplayOrder, AnimalTranslationMap } from "./Animals";
import { TidalHeritageDisplayOrder, TidalHeritageTranslationMap } from "./TidalHeritages";
import { TeleporterDisplayOrder, TeleporterTranslationMap } from "./Teleporters";
import { CasketDisplayOrder, CasketTranslationMap } from "./Caskets";
import { PlantDisplayOrder, PlantTranslationMap } from "./Plants";
import { SpecialtyDisplayOrder, SpecialtyTranslationMap } from "./Specialties";
import { Echo4CostDisplayOrder, Echo4CostTranslationMap } from "./Echo4Costs";
import { Echo3CostDisplayOrder, Echo3CostTranslationMap } from "./Echo3Costs";
import { Echo1CostDisplayOrder, Echo1CostTranslationMap } from "./Echo1Costs";
import { NPCMobsDisplayOrder, NPCMobsTranslationMap } from "./NPCMobs";
import { OreDisplayOrder, OreTranslationMap } from "./Ores";
import { MiscellaneousDisplayOrder, MiscellaneousTranslationMap } from "./Miscellaneous";
import { IMarker } from "../types";
import { QueryCategory } from "./types";
import { EnemyChallengesDisplayOrder, EnemyChallengesTranslationMap } from "./EnemyChallenges";

const TranslationMapGroups: Record<string, { keys: string[]; key: string }> = {
  "Quest ???": {
    key: "QUEST_UNKNOWN_???",
    keys: [
      "Quest001",
      "Quest002",
      "Quest014",
      "Quest016",
      "Quest018",
      "Quest019",
      "Quest024",
      "Quest026",
      "Quest027",
      "Quest031",
      "Quest032",
      "Quest036",
      "Quest037",
      "Quest039",
      "Quest041",
      "Quest042",
      "Quest043",
      "Quest044",
      "Quest046",
      "Quest048",
      "Quest050",
      "Quest051",
      "Quest052",
      "Quest053",
      "Quest056",
      "Quest057",
      "Quest058",
      "Quest060",
      "Quest061",
      "Quest062",
      "Quest063",
      "Quest064",
      "Quest065",
      "Quest066",
      "Quest067",
      "Quest068",
      "Quest071",
      "Quest072",
      "Quest073",
      "Quest074",
      "Quest075",
      "Quest076",
      "Quest077",
      "Quest078",
      "Quest079",
      "Quest080",
      "Quest081",
      "Quest082",
      "Quest083",
      "Quest084",
      "Quest085",
      "Quest086",
      "Quest087",
      "Quest088",
      "Quest089",
      "Quest091",
      "Quest093",
      "Quest098",
      "Quest099",
      "Quest100",
      "Quest101",
      "Quest102",
      "Quest104",
      "Quest105",
      "Quest108",
      "Quest109",
      "Quest110",
      "Quest111",
      "Quest113",
      "Quest114",
      "Quest116",
      "Quest118",
      "Quest120",
      "Quest124",
      "Quest126",
      "Quest127",
      "Quest128",
      "Quest129",
      "Quest130",
      "Quest131",
      "Quest132",
      "Quest133",
      "Quest136",
      "Quest137",
      "Quest138",
      "Quest139",
      "Quest140",
      "Quest142",
      "Quest143",
      "Quest144",
      "Quest145",
      "Quest146",
      "Quest147",
      "Quest148",
      "Quest149",
      "Quest150",
      "Quest151",
      "Quest070",
      "QuestObj1",
      "QuestObj_Main_LNXT_2_1",
      "QuestObj_Main_LNXT_2_2",
      "Quest017",
      "Quest030",
      "Quest054",
      "Quest094",
      "Quest095",
      "Quest096",
      "Quest097",
      "QuestObj5",
      "branch2.0_Quest094",
      "branch2.0_Quest095",
      "branch1.4_Quest152",
      "branch2.0_NPC_Side_Quest/ffsp1",
      "branch2.0_NPC_Side_Quest/ffsp2",
      "branch2.0_NPC_Side_Quest/ffsp3",
      "branch2.0_NPC_Side_Quest/ffsp4",
      "branch2.0_NPC_Side_Quest/ffsp5",
      "branch2.0_NPC_Side_Quest/ffsp6",
      "branch2.0_NPC_Side_Quest/ffsp7",
      "branch2.0_NPC_Side_Quest/ffsp8",
      "branch2.0_NPC_Side_Quest/ffsp9",
      "branch2.0_NPC_Side_Quest/ffsp10",
      "branch2.0_NPC_Side_Quest/ffsp11",
      "branch2.0_NPC_Side_Quest/ffsp12",
      "branch2.0_NPC_Side_Quest/ffsp13",
      "branch2.0_NPC_Side_Quest/ffsp14",
      "branch2.0_NPC_Side_Quest/ffsp16",
      "branch2.0_NPC_Side_Quest/ffsp17",
      "branch2.6_164_Quest096",
      "branch2.6_164_Quest097",
      "branch2.6_164_Quest098",
      "branch2.6_164_Quest099",
      "branch2.7_158_QuestObj_Main_Linaxita_2_7",
      "branch2.7_168_QuestObj_Main_2_7",
      "branch3.1_115_Monster_006_Quest",
      "branch2.0_QuestObj_Main_LNXT_2_3",
      "branch2.0_QuestObj_SM_Mis2_Box_08AS",
      "branch2.2_168_NPC_Role_Quest/Kanteleila1",
      "branch2.3_158_NPC_Role_Quest/Zanni1",
      "branch2.3_158_NPC_Role_Quest/Zanni2",
      "branch2.3_158_NPC_Role_Quest/Zanni5",
      "branch2.3_158_QuestObj_Role_Quest/Zanni1",
      "branch2.3_158_QuestObj_Role_Quest/Zanni2",
      "branch2.4_109_QuestObj1",
      "branch2.4_121_QuestObj_Main_QQ_2_5",
      "branch2.4_13_Quest071",
    ]
  },
  "Quest ?": {
    key: "QUEST_UNKNOWN_?",
    keys: [
      "Gameplay102",
    ]
  },
  "Glommoth Vision": {
    key: "GLOHOMOTH_VISION",
    keys: ["branch3.1_40_Gameplay_3_1/VisionSummon4"]
  },
  "Interact ???": {
    key: "INTERACT_UNKNOWN",
    keys: ["Treasure034"]
    // "Treasure034": {
    //   name: "Vault Undergrounds Shell Credit",
    //   rewardId: 1321,
    // },
  },
  "Inspect": {
    key: "INSPECT",
    keys: ["Gameplay603"] // lahai roi some quest stuff
  },
};

export const TranslationMap: Record<string, TranslationMapEntry> =
  (() => {
    const result: Record<string, TranslationMapEntry> = {};

    for (const [name, { key, keys }] of Object.entries(TranslationMapGroups)) {
      for (const k of keys) {
        result[k] = { name, key };
      }
    }

    return result;
  })();
export const TranslationDisplayOrder = [
];

export const displayedCategories = [
  ["Teleporter", TeleporterTranslationMap, TeleporterDisplayOrder],
  ["Casket", CasketTranslationMap, CasketDisplayOrder],
  ["Tidal Heritage", TidalHeritageTranslationMap, TidalHeritageDisplayOrder],
  ["Chests", ChestTranslationMap, ChestDisplayOrder],
  ["Puzzles", PuzzleTranslationMap, PuzzleDisplayOrder],
  ["Specialties", SpecialtyTranslationMap, SpecialtyDisplayOrder],
  ["Enemy Challenges", EnemyChallengesTranslationMap, EnemyChallengesDisplayOrder],
  ["Echo (4-Cost)", Echo4CostTranslationMap, Echo4CostDisplayOrder],
  ["Echo (3-Cost)", Echo3CostTranslationMap, Echo3CostDisplayOrder],
  ["Echo (1-Cost)", Echo1CostTranslationMap, Echo1CostDisplayOrder],
  ["NPC Monsters", NPCMobsTranslationMap, NPCMobsDisplayOrder],
  ["Plants", PlantTranslationMap, PlantDisplayOrder],
  ["Ores", OreTranslationMap, OreDisplayOrder],
  ["Animals", AnimalTranslationMap, AnimalDisplayOrder],
  ["Miscellaneous", MiscellaneousTranslationMap, MiscellaneousDisplayOrder],
  ["Unassigned", TranslationMap, TranslationDisplayOrder],
] as const;

export const UnionTranslationMap: Record<string, TranslationMapEntry> =
  displayedCategories
    .map(e => e[1])
    .reduce((acc, map) => ({ ...acc, ...map }), {});

export const QueryCategories: Record<string, QueryCategory> = {
  ...PuzzleQueryCategories,
}

export const getTrackingKey = (category: string): string => {
  const entry = UnionTranslationMap[category];
  if (entry) return entry.key;

  // Query categories are already keys or have a key property
  if (QueryCategories[category]) return QueryCategories[category].key;

  return `__${category}`;
};

export const getTranslationMapName = (marker: IMarker): string => {
  const categoryTranslation = UnionTranslationMap[marker.category]?.name;
  const queryCategoryKey = marker.metadata || marker.mapMark
    ? Object.entries(QueryCategories)
      .find(([, qcat]) => qcat.query(marker))?.[0]
    : undefined;

  const queryTranslation = queryCategoryKey ? QueryCategories[queryCategoryKey]?.name : undefined;
  return queryTranslation ?? categoryTranslation ?? "";
}

const queryCategoryEntries = Object.entries(QueryCategories);

export const getMatchedTrackableCategories = (marker: IMarker): { name: string, key: string, dictKey?: string }[] => {
  if (marker._matchedCategories) return marker._matchedCategories;

  const matched = [];
  const baseEntry = UnionTranslationMap[marker.category];

  if (baseEntry) {
    matched.push({ name: baseEntry.name, key: baseEntry.key, dictKey: marker.category });
  }

  for (let i = 0; i < queryCategoryEntries.length; i++) {
    const [dictKey, qcat] = queryCategoryEntries[i];
    if (qcat.query(marker)) {
      matched.push({ name: qcat.name, key: qcat.key, dictKey });
    }
  }

  if (matched.length === 0) {
    matched.push({ name: marker.category, key: `__${marker.category}`, dictKey: marker.category });
  }

  marker._matchedCategories = matched;
  return matched;
};