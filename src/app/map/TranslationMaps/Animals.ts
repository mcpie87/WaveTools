import { TranslationMapEntry } from "./TranslationMapInterface";

export enum Animal {
  GRAY_CRESTED_GULL = "Gray Crested Gull",
  RED_FEATHER_BUTTERFLY = "Red Feather Butterfly",
  BLUE_FEATHER_BUTTERFLY = "Blue Feather Butterfly",
  TETRA = "Tetra",
  GREEN_PIT_LIZARD = "Green Pit Lizard",
  GOLDEN_RINGED_DRAGONFLY = "Golden-ringed Dragonfly",
}
const AnimalTranslationMapGroups: Record<string, { keys: string[]; key: string }> = {
  [Animal.GRAY_CRESTED_GULL]: {
    key: "ANIMAL_GRAY_CRESTED_GULL",
    keys: ["Animal004"]
  },
  [Animal.RED_FEATHER_BUTTERFLY]: {
    key: "ANIMAL_RED_FEATHER_BUTTERFLY",
    keys: ["Animal017"]
  },
  [Animal.BLUE_FEATHER_BUTTERFLY]: {
    key: "ANIMAL_BLUE_FEATHER_BUTTERFLY",
    keys: ["Animal018"]
  },
  [Animal.TETRA]: {
    key: "ANIMAL_TETRA",
    keys: ["Animal024"]
  },
  [Animal.GREEN_PIT_LIZARD]: {
    key: "ANIMAL_GREEN_PIT_LIZARD",
    keys: ["Animal028"]
  },
  [Animal.GOLDEN_RINGED_DRAGONFLY]: {
    key: "ANIMAL_GOLDEN_RINGED_DRAGONFLY",
    keys: ["Animal020"]
  },
};

export const AnimalTranslationMap: Record<string, TranslationMapEntry> =
  (() => {
    const result: Record<string, TranslationMapEntry> = {};

    for (const [name, { key, keys }] of Object.entries(AnimalTranslationMapGroups)) {
      for (const k of keys) {
        result[k] = { name, key };
      }
    }

    return result;
  })();

export const AnimalDisplayOrder = [
];