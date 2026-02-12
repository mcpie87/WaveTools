import { TranslationMapEntry } from "./TranslationMapInterface";

export const TeleporterTranslationMap: Record<string, TranslationMapEntry> = {
  "Teleport007": { name: "Teleporter" },

  "Teleport003": { name: "Resonance Nexus" },
  "Teleport008": { name: "Resonance Nexus" },
  "Teleport3": { name: "Resonance Nexus" },
  "branch2.4_143_Gameplay_2_4QQ1": { name: "Resonance Nexus" },
  "branch3.0_693_Gameplay_3_0/Common1": { name: "Resonance Nexus" },

  "Teleport001": { name: "Resonance Beacon" },
  "Teleport2": { name: "Resonance Beacon" },
  "branch2.0_Teleport6": { name: "Resonance Beacon" },
  "branch2.2_14_Teleport4": { name: "Resonance Beacon" }, // TL shows Nexus - it's a Beacon
  "branch2.4_143_Gameplay_2_4QQ2": { name: "Resonance Beacon" },
  "branch3.0_693_Gameplay_3_0/Common2": { name: "Resonance Beacon" },

  "branch2.8_41_Gameplay_3_0/Common1": { name: "Mechascout" },
};
export const TeleporterDisplayOrder = [
  "Resonance Nexus",
  "Resonance Beacon",
  "Mechascout"
];