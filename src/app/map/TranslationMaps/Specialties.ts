import { ItemSpecialty } from "@/app/interfaces/item_types";
import { TranslationMapEntry } from "./TranslationMapInterface";

export const SpecialtyTranslationMap: Record<string, TranslationMapEntry> = {
  // 1.0
  "Collect003": { name: ItemSpecialty.IRIS },
  "Collect004": { name: ItemSpecialty.TERRASPAWN_FUNGUS },
  "Collect005": { name: ItemSpecialty.LANTERNBERRY },
  "Collect006": { name: ItemSpecialty.PECOK_FLOWER },
  "Collect007": { name: ItemSpecialty.BELLE_POPPY },
  "Collect008": { name: ItemSpecialty.CORIOLUS },
  "Collect009": { name: ItemSpecialty.WINTRY_BELL },
  "Collect010": { name: ItemSpecialty.VIOLET_CORAL },

  // 1.1
  "Collect_CXS08": { name: ItemSpecialty.LOONGS_PEARL },
  "Collect_CXS09": { name: ItemSpecialty.LOONGS_PEARL },
  "Collect_CXS03": { name: ItemSpecialty.PAVO_PLUM },
  "Collect_CXS04": { name: ItemSpecialty.PAVO_PLUM },
  "Collect_CXS05": { name: ItemSpecialty.PAVO_PLUM },
  "Collect_CXS06": { name: ItemSpecialty.PAVO_PLUM },

  // 1.3
  "Collect605": { name: ItemSpecialty.NOVA },

  // 2.0
  "branch2.0_Collect209_1": { name: ItemSpecialty.GOLDEN_FLEECE },
  "branch2.0_Collect207": { name: ItemSpecialty.FIRECRACKER_JEWELWEED },
  "branch2.0_Collect208": { name: ItemSpecialty.SWORD_ACORUS },

  // 2.2
  "branch2.2_169_Collect221_1": { name: ItemSpecialty.SEASIDE_CENDRELIS },

  // 2.4
  "branch2.4_Collect242": { name: ItemSpecialty.BAMBOO_IRIS },
  "branch2.4_Collect243": { name: ItemSpecialty.BLOODLEAF_VIBURNUM },

  // 2.5
  "branch2.5_150_Collect245": { name: ItemSpecialty.AFTERLIFE },
  "branch2.5_938_Collect244": { name: ItemSpecialty.AFTERLIFE },

  // 2.8
  "branch2.8_Collect_SBS1": { name: ItemSpecialty.SUMMER_FLOWER },

  // 3.0
  "branch3.0_151_Collect_SBS9": { name: ItemSpecialty.GEMINI_SPORE },
  "branch3.0_151_Collect_SBS10": { name: ItemSpecialty.RIMEWISP },
  "branch3.0_151_Collect_SBS11": { name: ItemSpecialty.ARITHMETIC_SHELL },

  // 3.1
  "branch3.1_693_Collect_3_4": { name: ItemSpecialty.MOSS_AMBER },
  "branch3.1_693_Collect_3_9": { name: ItemSpecialty.MOSS_AMBER },
};
export const SpecialtyDisplayOrder = Object.values(ItemSpecialty);