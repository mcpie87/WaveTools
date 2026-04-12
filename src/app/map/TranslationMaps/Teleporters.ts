import { TranslationMapEntry } from "./TranslationMapInterface";

export enum TeleporterKey {
  RESONANCE_NEXUS = "TELEPORTER_RESONANCE_NEXUS",
  RESONANCE_BEACON = "TELEPORTER_RESONANCE_BEACON",
  GONDOLA_PLATFORM = "TELEPORTER_GONDOLA_PLATFORM",
  MECHASCOUT = "TELEPORTER_MECHASCOUT",
}

export enum TeleporterName {
  RESONANCE_NEXUS = "Resonance Nexus",
  RESONANCE_BEACON = "Resonance Beacon",
  GONDOLA_PLATFORM = "Gondola Platform",
  MECHASCOUT = "Mechascout",
}

const TeleporterTranslationMapGroups: Record<string, { keys: string[]; key: string }> = {
  [TeleporterName.RESONANCE_NEXUS]: {
    key: TeleporterKey.RESONANCE_NEXUS,
    keys: [
      "Teleport003",
      "Teleport008",
      "Teleport3",
      "branch2.4_143_Gameplay_2_4QQ1",
      "branch3.0_693_Gameplay_3_0/Common1"
    ]
  },
  [TeleporterName.RESONANCE_BEACON]: {
    key: TeleporterKey.RESONANCE_BEACON,
    keys: [
      "Teleport001",
      "Teleport2",
      "branch2.4_143_Gameplay_2_4QQ2",
      "branch3.0_693_Gameplay_3_0/Common2",
    ]
  },
  [TeleporterName.GONDOLA_PLATFORM]: {
    key: TeleporterKey.GONDOLA_PLATFORM,
    keys: [
      "branch2.0_Teleport6",
    ]
  },
  // 3.0
  [TeleporterName.MECHASCOUT]: {
    key: TeleporterKey.MECHASCOUT,
    keys: [
      "branch2.8_41_Gameplay_3_0/Common1",
    ]
  },
};

export const TeleporterTranslationMap: Record<string, TranslationMapEntry> =
  (() => {
    const result: Record<string, TranslationMapEntry> = {};

    for (const [name, { key, keys }] of Object.entries(TeleporterTranslationMapGroups)) {
      for (const k of keys) {
        result[k] = { name, key };
      }
    }

    return result;
  })();

export const TeleporterDisplayOrder = [
  "Resonance Nexus",
  "Resonance Beacon",
  "Gondola Platform",
  "Mechascout"
];