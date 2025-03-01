import { z } from 'zod';
import { resonatorSchema } from "@/schemas/resonatorSchema";

export interface InputEntry<T> {
  current: T;
  desired: T;
}

const defaultEntry = <T>(current: T, desired: T) => {
  return {
    current,
    desired
  }
};

export const RESONATOR_STATE_DB_ENTRY_DEFAULT = {
  level: defaultEntry("1", "1"),
  normalAttack: defaultEntry(1, 1),
  resonanceSkill: defaultEntry(1, 1),
  resonanceLiberation: defaultEntry(1, 1),
  forte: defaultEntry(1, 1),
  intro: defaultEntry(1, 1),
  inherent: defaultEntry(0, 0),
  side1: defaultEntry(0, 0),
  side2: defaultEntry(0, 0),
  side3: defaultEntry(0, 0),
  side4: defaultEntry(0, 0),
};

export type ResonatorStateDBEntry = z.infer<typeof resonatorSchema>;
export type ResonatorStateDBEntryField = keyof ResonatorStateDBEntry;

export interface ResonatorDBSchema {
  [id: string]: ResonatorStateDBEntry;
};

// level values to select, Increment/decrement for level including ascension
export const levelSelectValues = [1, 20, "20*", 40, "40*", 50, "50*", 60, "60*", 70, "70*", 80, "80*", 90];
export const nextLevel = (level: number | string) => {
  switch (level) {
    case 20: return "20*";
    case 40: return "40*";
    case 50: return "50*";
    case 60: return "60*";
    case 70: return "70*";
    case 80: return "80*";
    case "20*": return 21;
    case "40*": return 41;
    case "50*": return 51;
    case "60*": return 61;
    case "70*": return 71;
    case "80*": return 81;
    default: return level as number + 1;
  }
};
export const prevLevel = (level: number | string) => {
  switch (level) {
    case 21: return "20*";
    case 41: return "40*";
    case 51: return "50*";
    case 61: return "60*";
    case 71: return "70*";
    case 81: return "80*";
    case "20*": return 20;
    case "40*": return 40;
    case "50*": return 50;
    case "60*": return 60;
    case "70*": return 70;
    case "80*": return 80;
    default: return level as number - 1;
  }
};