import { ItemOre } from "@/app/interfaces/item_types";
import { TranslationMapEntry } from "./TranslationMapInterface";

export const OreTranslationMap: Record<string, TranslationMapEntry> = {
  "Collect501": { name: ItemOre.SCARLETTHORN },
  "Collect502": { name: ItemOre.LAMPYLUMEN },
  "Collect503": { name: ItemOre.INDIGOITE },
  "Collect504": { name: ItemOre.FLORAMBER },
  "Collect505": { name: ItemOre.FLUORITE },

  "branch2.0_Collect506": { name: ItemOre.FOOLS_GOLD },
  "branch2.0_Collect507": { name: ItemOre.RESONANT_CALCITE },

  "branch3.0_693_Collect_3_2": { name: ItemOre.LUXITE },
  "branch3.1_693_Collect_3_6": { name: ItemOre.METEORIC_IRON },
};
export const OreDisplayOrder = Object.values(ItemOre);