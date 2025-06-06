import { Substats } from "../data/enums";
export type SubstatName = keyof typeof substatsDict;
export type SubstatValue = number;
export type SubstatEntry = {
  name: SubstatName;
  value: SubstatValue;
}
export interface UpgradeCost {
  tuners: number;
  exp: number;
}

export const substatsDisplayOrder: Record<SubstatName, number> = {
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

export const substatsDict: Record<string, number> = {
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

export const substatValues: Record<SubstatName, SubstatValue[]> = {
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
export const substatChances: Record<number, SubstatValue[]> = {
  4: [0.1243, 0.4621, 0.3857, 0.0279],
  8: [0.0739, 0.069, 0.2072, 0.2490, 0.1823, 0.1360, 0.0534, 0.0293],
};

export const UPGRADE_COST: Record<string, UpgradeCost> = {
  "+0": { tuners: 0, exp: 0 },
  "+5": { tuners: 10, exp: 4400 },
  "+10": { tuners: 20, exp: 16500 },
  "+15": { tuners: 30, exp: 39600 },
  "+20": { tuners: 40, exp: 79100 },
  "+25": { tuners: 50, exp: 142600 },
}

function generatePermutations<T>(substats: T[], amount: number): T[][] {
  const permutations: T[][] = [];

  function backtrack(path: T[]) {
    if (path.length === amount) {
      permutations.push([...path]);
      return;
    }

    for (let i = 0; i < substats.length; ++i) {
      if (!path.includes(substats[i])) {
        path.push(substats[i]);
        backtrack(path);
        path.pop();
      }
    }
  }

  backtrack([]);
  return permutations;
}

function calculateSubstatNameChance(
  pickedSubstats: Set<SubstatName>,
  desiredSubstat: SubstatName
): number {
  let cumulativeSubstatChance = 0;
  for (const substat in substatsDict) {
    if (!pickedSubstats.has(substat)) {
      cumulativeSubstatChance += substatsDict[substat];
    }
  }
  return substatsDict[desiredSubstat] / cumulativeSubstatChance;
}

function calculateSubstatRollChance(desiredSubstat: SubstatEntry): number {
  const possibleRolls = substatValues[desiredSubstat.name];
  const rollProbabilities = substatChances[possibleRolls.length];
  const totalProbability = rollProbabilities.reduce((sum, prob) => sum + prob, 0);
  const cumulativeProbability = possibleRolls.reduce((sum, value, idx) =>
    value >= desiredSubstat.value ? sum + rollProbabilities[idx] : sum, 0);
  return cumulativeProbability / totalProbability;
}

export function calculateProbabilityOfDesiredSubstats(
  desiredSubstats: SubstatEntry[],
  initialSubstats: SubstatEntry[],
  targetLevel: number,
  checkForAny: boolean
): number {
  const levels = targetLevel - initialSubstats.length;
  if (levels <= 0) {
    return 0;
  }

  const initialSubstatsNames = initialSubstats.map(e => e.name);
  const availableSubstats = Object.keys(substatsDict)
    .filter(substat => !initialSubstatsNames.includes(substat));

  const allLeftCombinations: SubstatName[][] = generatePermutations(availableSubstats, levels);

  let totalChance = 0;
  for (const combination of allLeftCombinations) {
    const currentSubstats = new Set<SubstatName>(initialSubstatsNames);
    let chanceForCombination = 1;
    for (let i = 0; i < levels; ++i) {
      chanceForCombination *= calculateSubstatNameChance(currentSubstats, combination[i]);
      currentSubstats.add(combination[i]);
    }

    // Converting picked substats into only ones from desired + chance for each
    const desiredFromCurrentSubstats = [];
    for (const desiredSubstat of desiredSubstats) {
      if (currentSubstats.has(desiredSubstat.name)) {
        desiredFromCurrentSubstats.push(desiredSubstat);
      }
    }
    const desiredFromCurrentSubstatsRollChances = desiredFromCurrentSubstats
      .map(substat => calculateSubstatRollChance(substat));

    if (checkForAny) {
      chanceForCombination *= Math.max(...desiredFromCurrentSubstatsRollChances, 0);
      totalChance += chanceForCombination;
    } else if (desiredFromCurrentSubstats.length === desiredSubstats.length) {
      for (const desiredSubstat of desiredSubstats) {
        chanceForCombination *= calculateSubstatRollChance(desiredSubstat);
      }
      totalChance += chanceForCombination;
    }
  }
  return totalChance;
}

export const SUBSTATS = Object.keys(substatsDict);
