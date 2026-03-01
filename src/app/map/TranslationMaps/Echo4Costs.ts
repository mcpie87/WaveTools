import { TranslationMapEntry } from "./TranslationMapInterface";

export enum Echo4Cost {
  // 1.0
  MECH_ABOMINATION = "Mech Abomination",
  THUNDERING_MEPHIS = "Thundering Mephis",
  FEILIAN_BERINGAL = "Feilian Beringal",
  IMPERMANENCE_HERON = "Impermanence Heron",
  INFERNO_RIDER = "Inferno Rider",
  MOURNING_AIX = "Mourning Aix",
  CROWNLESS = "Crownless",
  LAMPYLUMEN_MYRIAD = "Lampylumen Myriad",
  BELL_BORNE_GEOCHELONE = "Bell-Borne Geochelone",
  TEMPEST_MEPHIS = "Tempest Mephis",
  DREAMLESS = "Dreamless",

  // 1.1
  JUE = "Jué",

  // 1.3
  FALLACY_OF_NO_RETURN = "Fallacy of No Return",

  // 2.0
  NIGHTMARE_FEILIAN_BERINGAL = "Nightmare: Feilian Beringal",
  NIGHTMARE_IMPERMANENCE_HERON = "Nightmare: Impermanence Heron",
  NIGHTMARE_THUNDERING_MEPHIS = "Nightmare: Thundering Mephis",
  NIGHTMARE_TEMPEST_MEPHIS = "Nightmare: Tempest Mephis",
  NIGHTMARE_CROWNLESS = "Nightmare: Crownless",
  NIGHTMARE_INFERNO_RIDER = "Nightmare: Inferno Rider",
  NIGHTMARE_MOURNING_AIX = "Nightmare: Mourning Aix",
  DRAGON_OF_DIRGE = "Dragon of Dirge",
  SENTRY_CONSTRUCT = "Sentry Construct",
  LORELEI = "Lorelei",
  HECATE = "Hecate",

  // 2.2
  NIGHTMARE_LAMPYLUMEN_MYRIAD = "Nightmare: Lampylumen Myriad",

  // 2.3
  FLEURDELYS = "Fleurdelys",

  // 2.4
  LIONESS_OF_GLORY = "Lioness of Glory",
  NIGHTMARE_KELPIE = "Nightmare: Kelpie",

  // 2.5
  FENRICO = "Fenrico",

  // 2.6
  LADY_OF_THE_SEA = "Lady of the Sea",

  // 2.7
  FALSE_SOVEREIGN = "False Sovereign",
  THRENODIAN_LEVIATHAN = "Threnodian: Leviathan",

  // 3.0
  HYVATIA = "Hyvatia",
  REACTOR_HUSK = "Reactor Husk",

  // 3.1
  NAMELESS_EXPLORER = "Nameless Explorer",
  SIGILLUM = "Sigillum",
}

const Echo4CostTranslationMapGroups: Record<string, Record<string, string[]>> = {
  // 1.0
  [Echo4Cost.MECH_ABOMINATION]: {
    keys: [
      "Monster080",
      "Monster_Branch1.1_014",
      "Monster114",
      "Monster098",
    ]
  },
  [Echo4Cost.THUNDERING_MEPHIS]: {
    keys: [
      "Monster066",
      "Monster109",
      "Monster_rogue003",
    ]
  },
  [Echo4Cost.FEILIAN_BERINGAL]: {
    keys: [
      "Monster063",
      "Monster116",
    ]
  },
  [Echo4Cost.IMPERMANENCE_HERON]: {
    keys: [
      "Monster061",
      "Monster096",
      "branch1.4_Monster_001",
      "Monster112",
    ]
  },
  [Echo4Cost.BELL_BORNE_GEOCHELONE]: {
    keys: [
      "Monster047",
      "Monster107",
    ]
  },
  [Echo4Cost.LAMPYLUMEN_MYRIAD]: { keys: ["Monster062", "Monster068"] },
  [Echo4Cost.CROWNLESS]: {
    keys: [
      "Monster071",
      "Monster_Branch1.1_019",
      "Monster161",
      "Monster104",
    ]
  },
  [Echo4Cost.MOURNING_AIX]: {
    keys: [
      "Monster070",
      "Monster094",
      "Monster0137",
      "Monster110",
      "Monster_rogue002",
    ]
  },
  [Echo4Cost.INFERNO_RIDER]: {
    keys: [
      "Monster045",
      "Monster097",
      "Monster1106",
      "Monster_rogue014",
      "Monster_branch1.3_1015",
      "Monster113",
      "Monster_rogue001",
    ]
  },
  [Echo4Cost.TEMPEST_MEPHIS]: {
    keys: [
      "Monster044",
      "Monster108",
    ]
  },
  [Echo4Cost.DREAMLESS]: {
    keys: [
      "branch1.4_Monster_branch1.4_006",
      "Monster191",
      "Monster152",
      "Monster078",
    ]
  },

  // 1.1
  [Echo4Cost.JUE]: {
    keys: [
      "Monster153",
      "Monster123",
    ]
  },


  // 1.3
  [Echo4Cost.FALLACY_OF_NO_RETURN]: {
    keys: [
      "Monster_branch1.3_001",
      "Monster_branch1.3_002",
      "Monster_branch1.3_013",
      "Monster_Link3",
    ]
  },

  // 2.0
  [Echo4Cost.NIGHTMARE_FEILIAN_BERINGAL]: { keys: ["branch2.0_Monster_fushua6"] },
  [Echo4Cost.NIGHTMARE_CROWNLESS]: { keys: ["branch2.0_Monster_fushua4"] },
  [Echo4Cost.NIGHTMARE_INFERNO_RIDER]: { keys: ["branch2.0_Monster_fushua"] },
  [Echo4Cost.NIGHTMARE_IMPERMANENCE_HERON]: { keys: ["branch2.0_Monster_fushua5"] },
  [Echo4Cost.NIGHTMARE_TEMPEST_MEPHIS]: { keys: ["branch2.0_Monster_fushua3"] },
  [Echo4Cost.NIGHTMARE_MOURNING_AIX]: { keys: ["branch2.0_Monster_fushua2"] },
  [Echo4Cost.NIGHTMARE_THUNDERING_MEPHIS]: { keys: ["branch2.0_Monster_fushua1"] },
  [Echo4Cost.DRAGON_OF_DIRGE]: {
    keys: [
      "branch2.0_Monster_Task1",
      "branch2.0_Monster_Task4",
      "branch2.2_671_Monster_Branch2.0_011",
      "Monster_Branch2.0_010",
      "branch2.0_Monster_Tower1",
    ]
  },
  [Echo4Cost.SENTRY_CONSTRUCT]: {
    keys: [
      "Monster_Branch2.0_008",
      "Monster_Branch2.0_027",
      "Monster_Branch2.0_025",
    ]
  },
  [Echo4Cost.LORELEI]: {
    keys: [
      "Monster_Branch2.0_0116",
      "Monster_Branch2.0_1116",
      "Monster_branch2.3_1016",
    ]
  },
  [Echo4Cost.HECATE]: {
    keys: [
      "Monster_branch2.1_08",
      "Monster_Branch2.1_09",
    ]
  },

  // 2.2
  [Echo4Cost.NIGHTMARE_LAMPYLUMEN_MYRIAD]: { keys: ["Monster_Branch2.2_023"] },

  // 2.3
  [Echo4Cost.FLEURDELYS]: { keys: ["Monster_Branch2.3_01"] },

  // 2.4
  [Echo4Cost.LIONESS_OF_GLORY]: {
    keys: [
      "Monster_Branch2.4_012",
      "Monster_Branch2.4_026",
      "Monster_Branch2.4_014",
      "Monster_Branch2.7_011",
    ]
  },
  [Echo4Cost.NIGHTMARE_KELPIE]: { keys: ["Monster_branch2.4_01"] },

  // 2.5
  [Echo4Cost.FENRICO]: {
    keys: [
      "Monster_Branch_2.5_001",
      "Monster_Branch_2.5_002",
      "Monster_Branch_2.7_001",
    ]
  },

  // 2.6
  [Echo4Cost.LADY_OF_THE_SEA]: {
    keys: [
      "branch2.6_2_Monster072",
      "branch2.4_2_Monster072",
    ]
  },

  // 2.7
  [Echo4Cost.FALSE_SOVEREIGN]: {
    keys: [
      "Monster_branch2.7_010",
      "Monster_branch2.8_015",
      "branch2.6_671_Monster_branch2.6_002",
      "Monster_branch2.6_001",
      "Monster_branch2.6_017",
      "Monster_branch2.8_010",
    ]
  },
  [Echo4Cost.THRENODIAN_LEVIATHAN]: {
    keys: [
      "Monster_Branch2.7_004",
      "Monster_Branch2.7_001",
    ]
  },

  // 3.0
  [Echo4Cost.HYVATIA]: {
    keys: [
      "Monster_Branch3.0_043",
      "Monster_Branch3.0_001",
      "Monster_Branch3.0_044",
    ]
  },
  [Echo4Cost.REACTOR_HUSK]: {
    keys: [
      "Monster_Branch3.0_059",
      "Monster_Branch3.0_006",
      "Monster_Branch3.0_061",
      "Monster_Branch3.0_018",
    ]
  },

  // 3.1
  [Echo4Cost.NAMELESS_EXPLORER]: {
    keys: [
      "branch3.1_670_Monster_Branch3.1_004",
      "branch3.1_670_Monster_Branch3.1_003",
    ]
  },
  [Echo4Cost.SIGILLUM]: {
    keys: [
      "Monster_Branch3.1_001",
      "Monster_Branch3.1_002",
      "Monster_Branch3.1_003",
    ]
  }
};

export const Echo4CostTranslationMap: Record<string, TranslationMapEntry> =
  (() => {
    const result: Record<string, TranslationMapEntry> = {};

    for (const [name, { keys }] of Object.entries(Echo4CostTranslationMapGroups)) {
      for (const key of keys) {
        result[key] = { name };
      }
    }

    return result;
  })();

export const Echo4CostDisplayOrder = [
];