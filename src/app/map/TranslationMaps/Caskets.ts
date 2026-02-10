import { ItemCasket } from "@/app/interfaces/item_types";
import { TranslationMapEntry } from "./TranslationMapInterface";

export const CasketTranslationMap: Record<string, TranslationMapEntry> = {
  "Gameplay021": { name: ItemCasket.SONANCE_CASKET },
  "Gameplay_CXS_4": { name: ItemCasket.WINDCHIMER },
  "Gameplay_CXS_14": { name: ItemCasket.WINDCHIMER },
  "Gameplay7": { name: ItemCasket.SONANCE_RINASCITA },
  "branch2.4_109_Gameplay_2_4QQ1": { name: ItemCasket.SONANCE_SEPTIMONT },
  "branch3.0_41_Gameplay_3_0/Common1": { name: ItemCasket.LAHAI_TAPE },
};
export const CasketDisplayOrder = Object.values(ItemCasket);
