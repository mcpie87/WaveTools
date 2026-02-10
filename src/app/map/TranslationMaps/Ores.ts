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
};
export const OreDisplayOrder = Object.values(ItemOre);