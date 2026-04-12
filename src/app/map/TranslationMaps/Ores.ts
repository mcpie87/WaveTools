import { ItemOre } from "@/app/interfaces/item_types";
import { TranslationMapEntry } from "./TranslationMapInterface";

export const OreTranslationMap: Record<string, TranslationMapEntry> = {
  "Collect501": { key: "ORE_SCARLETTHORN", name: ItemOre.SCARLETTHORN },
  "Collect502": { key: "ORE_LAMPYLUMEN", name: ItemOre.LAMPYLUMEN },
  "Collect503": { key: "ORE_INDIGOITE", name: ItemOre.INDIGOITE },
  "Collect504": { key: "ORE_FLORAMBER", name: ItemOre.FLORAMBER },
  "Collect505": { key: "ORE_FLUORITE", name: ItemOre.FLUORITE },

  "branch2.0_Collect506": { key: "ORE_FOOLS_GOLD", name: ItemOre.FOOLS_GOLD },
  "branch2.0_Collect507": { key: "ORE_RESONANT_CALCITE", name: ItemOre.RESONANT_CALCITE },

  "branch3.0_693_Collect_3_2": { key: "ORE_LUXITE", name: ItemOre.LUXITE },
  "branch3.1_693_Collect_3_6": { key: "ORE_METEORIC_IRON", name: ItemOre.METEORIC_IRON },
};
export const OreDisplayOrder = Object.values(ItemOre);