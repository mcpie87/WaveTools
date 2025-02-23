import { Substats } from "../data/enums";
export type SubstatName = keyof typeof substatsDict;
export type SubstatValue = number;
export type SubstatEntry = {
  name: SubstatName;
  value: SubstatValue;
}

export const substatsDisplayOrder: { [key: string]: number } = {
  [Substats.FlatATK]: 1,
  [Substats.FlatHP]: 2,
  [Substats.FlatDEF]: 3,
  [Substats.ATK]: 4,
  [Substats.HP]: 5,
  [Substats.DEF]: 6,
  [Substats.ER]: 7,
  [Substats.CR]: 8,
  [Substats.CDMG]: 9,
  [Substats.Basic_DMG]: 10,
  [Substats.Heavy_DMG]: 11,
  [Substats.Skill_DMG]: 12,
  [Substats.Liberation_DMG]: 13,
}

const substatsDict: { [key: string]: number } = {
  [Substats.FlatATK]: 0.0769230769,
  [Substats.FlatHP]: 0.0769230769,
  [Substats.FlatDEF]: 0.0769230769,
  [Substats.ATK]: 0.0769230769,
  [Substats.HP]: 0.0769230769,
  [Substats.DEF]: 0.0769230769,
  [Substats.ER]: 0.0769230769,
  [Substats.CR]: 0.0769230769,
  [Substats.CDMG]: 0.0769230769,
  [Substats.Basic_DMG]: 0.0769230769,
  [Substats.Heavy_DMG]: 0.0769230769,
  [Substats.Skill_DMG]: 0.0769230769,
  [Substats.Liberation_DMG]: 0.0769230769,
};

export const substatValues: { [key: SubstatName]: SubstatValue[] } = {
  [Substats.FlatDEF]: [40, 50, 60, 70],
  [Substats.FlatATK]: [30, 40, 50, 60],
  [Substats.FlatHP]: [320, 360, 390, 430, 470, 510, 540, 580],
  [Substats.ATK]: [0.064, 0.071, 0.079, 0.086, 0.094, 0.101, 0.109, 0.116],
  [Substats.HP]: [0.064, 0.071, 0.079, 0.086, 0.094, 0.101, 0.109, 0.116],
  [Substats.DEF]: [0.081, 0.09, 0.1, 0.109, 0.118, 0.128, 0.138, 0.147],
  [Substats.ER]: [0.068, 0.076, 0.084, 0.092, 0.1, 0.108, 0.116, 0.124],
  [Substats.CR]: [0.063, 0.069, 0.075, 0.081, 0.087, 0.093, 0.099, 0.105],
  [Substats.CDMG]: [0.126, 0.138, 0.15, 0.162, 0.174, 0.186, 0.198, 0.21],
  [Substats.Basic_DMG]: [0.064, 0.071, 0.079, 0.086, 0.094, 0.101, 0.109, 0.116],
  [Substats.Heavy_DMG]: [0.064, 0.071, 0.079, 0.086, 0.094, 0.101, 0.109, 0.116],
  [Substats.Skill_DMG]: [0.064, 0.071, 0.079, 0.086, 0.094, 0.101, 0.109, 0.116],
  [Substats.Liberation_DMG]: [0.064, 0.071, 0.079, 0.086, 0.094, 0.101, 0.109, 0.116],
};

// taken from wiki page
const substatChances: { [key: number]: SubstatValue[] } = {
  4: [0.1243, 0.4621, 0.3857, 0.0279],
  8: [0.0739, 0.069, 0.2072, 0.2490, 0.1823, 0.1360, 0.0534, 0.0293],
};

function pickSubstat(pickedSubstats: SubstatEntry[]): SubstatEntry {
  let totalChance = 0;
  const available = [];

  const pickedSubstatNames = new Set(pickedSubstats.map(substatEntry => substatEntry.name));
  for (const substat in substatsDict) {
    if (!pickedSubstatNames.has(substat)) {
      available.push(substat);
      totalChance += substatsDict[substat];
    }
  }

  if (available.length === 0) {
    throw new Error("No more subs available");
  }

  const random = Math.random() * totalChance;
  let cumulative = 0;

  for (let i = 0; i < available.length; i++) {
    cumulative += substatsDict[available[i]];
    if (random <= cumulative) {
      const pickedSubstat = available[i];
      const possibleRolls = substatValues[pickedSubstat];
      const possibleChances = substatChances[possibleRolls.length];
      const valueRng = Math.random();
      let valuesCumulative = 0;
      for (let j = 0; j < possibleChances.length; ++j) {
        valuesCumulative += possibleChances[j];
        if (valueRng <= valuesCumulative) {
          return {
            name: pickedSubstat,
            value: possibleRolls[j]
          }
        }
      }
    }
  }

  throw new Error("Unable to pick substat");
}

export const SUBSTATS = Object.keys(substatsDict);

interface UpgradeCost {
  tuners: number;
  exp: number;
}
export const UPGRADE_COST: { [key: string]: UpgradeCost } = {
  "+0": { tuners: 0, exp: 0 },
  "+5": { tuners: 10, exp: 4400 },
  "+10": { tuners: 20, exp: 16500 },
  "+15": { tuners: 30, exp: 39600 },
  "+20": { tuners: 40, exp: 79100 },
  "+25": { tuners: 50, exp: 142600 },
}


// endLevel - 0 means +0, 5 means +25
export function simulate(
  desiredSubstats: SubstatEntry[],
  pickedSubstats: SubstatEntry[],
  endLevel: number
) {
  for (let i = pickedSubstats.length; i < endLevel; ++i) {
    const pickedSubstat: SubstatEntry = pickSubstat(pickedSubstats);
    pickedSubstats.push(pickedSubstat);
  }
  for (const desiredSubstat of desiredSubstats) {
    const pickedSubstat = pickedSubstats.find(substat => substat.name === desiredSubstat.name);

    if (!pickedSubstat) {
      return false;
    }

    if (pickedSubstat.value < desiredSubstat.value) {
      return false;
    }
  }

  return true;
}