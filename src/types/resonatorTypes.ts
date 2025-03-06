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

// hack cause i'm a noob, need to remove name from this cause otherwise watch()
// from form will yell at me
export type ResonatorStateDBEntry = z.infer<typeof resonatorSchema>;

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
export const getAscensions = (from: number | string, to: number | string): number[] => {
  const res: number[] = [];
  if (from === to) {
    return res;
  }
  const fromInt = parseInt(from as string);
  const toInt = parseInt(to as string);
  let ascensionKey = 0;
  for (const level of levelSelectValues) {
    if (typeof level !== "string") {
      // we only care about string variables
      continue;
    }
    ++ascensionKey;

    const levelInt = parseInt(level);
    if (to === level) {
      res.push(ascensionKey);
    } else if (fromInt < levelInt && levelInt < toInt) {
      res.push(ascensionKey);
    } else if (fromInt === levelInt && levelInt < toInt && typeof from === "number") {
      res.push(ascensionKey);
    }
  }
  return res;
}