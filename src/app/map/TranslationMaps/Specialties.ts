import { ItemSpecialty } from "@/app/interfaces/item_types";
import { TranslationMapEntry } from "./TranslationMapInterface";

export const SpecialtyTranslationMap: Record<string, TranslationMapEntry> = {
  // 1.0
  "Collect003": { key: "SPECIALTY_IRIS", name: ItemSpecialty.IRIS },
  "Collect004": { key: "SPECIALTY_TERRASPAWN_FUNGUS", name: ItemSpecialty.TERRASPAWN_FUNGUS },
  "Collect005": { key: "SPECIALTY_LANTERNBERRY", name: ItemSpecialty.LANTERNBERRY },
  "Collect006": { key: "SPECIALTY_PECOK_FLOWER", name: ItemSpecialty.PECOK_FLOWER },
  "Collect007": { key: "SPECIALTY_BELLE_POPPY", name: ItemSpecialty.BELLE_POPPY },
  "Collect008": { key: "SPECIALTY_CORIOLUS", name: ItemSpecialty.CORIOLUS },
  "Collect009": { key: "SPECIALTY_WINTRY_BELL", name: ItemSpecialty.WINTRY_BELL },
  "Collect010": { key: "SPECIALTY_VIOLET_CORAL", name: ItemSpecialty.VIOLET_CORAL },

  // 1.1
  "Collect_CXS08": { key: "SPECIALTY_LOONGS_PEARL", name: ItemSpecialty.LOONGS_PEARL },
  "Collect_CXS09": { key: "SPECIALTY_LOONGS_PEARL", name: ItemSpecialty.LOONGS_PEARL },
  "Collect_CXS03": { key: "SPECIALTY_PAVO_PLUM", name: ItemSpecialty.PAVO_PLUM },
  "Collect_CXS04": { key: "SPECIALTY_PAVO_PLUM", name: ItemSpecialty.PAVO_PLUM },
  "Collect_CXS05": { key: "SPECIALTY_PAVO_PLUM", name: ItemSpecialty.PAVO_PLUM },
  "Collect_CXS06": { key: "SPECIALTY_PAVO_PLUM", name: ItemSpecialty.PAVO_PLUM },

  // 1.3
  "Collect605": { key: "SPECIALTY_NOVA", name: ItemSpecialty.NOVA },

  // 2.0
  "branch2.0_Collect209_1": { key: "SPECIALTY_GOLDEN_FLEECE", name: ItemSpecialty.GOLDEN_FLEECE },
  "branch2.0_Collect207": { key: "SPECIALTY_FIRECRACKER_JEWELWEED", name: ItemSpecialty.FIRECRACKER_JEWELWEED },
  "branch2.0_Collect208": { key: "SPECIALTY_SWORD_ACORUS", name: ItemSpecialty.SWORD_ACORUS },

  // 2.2
  "branch2.2_169_Collect221_1": { key: "SPECIALTY_SEASIDE_CENDRELIS", name: ItemSpecialty.SEASIDE_CENDRELIS },

  // 2.4
  "branch2.4_Collect242": { key: "SPECIALTY_BAMBOO_IRIS", name: ItemSpecialty.BAMBOO_IRIS },
  "branch2.4_Collect243": { key: "SPECIALTY_BLOODLEAF_VIBURNUM", name: ItemSpecialty.BLOODLEAF_VIBURNUM },

  // 2.5
  "branch2.5_150_Collect245": { key: "SPECIALTY_AFTERLIFE", name: ItemSpecialty.AFTERLIFE },
  "branch2.5_938_Collect244": { key: "SPECIALTY_AFTERLIFE", name: ItemSpecialty.AFTERLIFE },

  // 2.8
  "branch2.8_Collect_SBS1": { key: "SPECIALTY_SUMMER_FLOWER", name: ItemSpecialty.SUMMER_FLOWER },

  // 3.0
  "branch3.0_151_Collect_SBS9": { key: "SPECIALTY_GEMINI_SPORE", name: ItemSpecialty.GEMINI_SPORE },
  "branch3.0_151_Collect_SBS10": { key: "SPECIALTY_RIMEWISP", name: ItemSpecialty.RIMEWISP },
  "branch3.0_151_Collect_SBS11": { key: "SPECIALTY_ARITHMETIC_SHELL", name: ItemSpecialty.ARITHMETIC_SHELL },

  // 3.1
  "branch3.1_693_Collect_3_4": { key: "SPECIALTY_MOSS_AMBER", name: ItemSpecialty.MOSS_AMBER },
  "branch3.1_693_Collect_3_9": { key: "SPECIALTY_MOSS_AMBER", name: ItemSpecialty.MOSS_AMBER },
};
export const SpecialtyDisplayOrder = Object.values(ItemSpecialty);