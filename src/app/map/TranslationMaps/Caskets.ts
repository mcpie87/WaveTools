import { ItemCasket } from "@/app/interfaces/item_types";
import { TranslationMapEntry } from "./TranslationMapInterface";

const CasketTranslationMapGroups: Record<string, { keys: string[]; key: string }> = {
  [ItemCasket.SONANCE_CASKET]: {
    key: "CASKET_SONANCE_HUANGLONG",
    keys: ["Gameplay021"]
  },
  [ItemCasket.WINDCHIMER]: {
    key: "CASKET_WINDCHIMER",
    keys: [
      "Gameplay_CXS_4",
      "Gameplay_CXS_14",
    ]
  },
  [ItemCasket.SONANCE_RINASCITA]: {
    key: "CASKET_SONANCE_RINASCITA",
    keys: ["Gameplay7"]
  },
  [ItemCasket.SONANCE_SEPTIMONT]: {
    key: "CASKET_SONANCE_SEPTIMONT",
    keys: ["branch2.4_109_Gameplay_2_4QQ1"]
  },
  [ItemCasket.LAHAI_TAPE]: {
    key: "CASKET_LAHAI_TAPE",
    keys: ["branch3.0_41_Gameplay_3_0/Common1"]
  },
};

export const CasketTranslationMap: Record<string, TranslationMapEntry> =
  (() => {
    const result: Record<string, TranslationMapEntry> = {};

    for (const [name, { key, keys }] of Object.entries(CasketTranslationMapGroups)) {
      for (const k of keys) {
        result[k] = { name, key };
      }
    }

    return result;
  })();

export const CasketDisplayOrder = Object.values(ItemCasket);
