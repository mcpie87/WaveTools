import { Substats } from "@/app/(app)/echo-simulation/data/enums";
import {
  substatsDisplayOrder,
  substatsDict,
  substatValues,
  calculateProbabilityOfDesiredSubstats,
  SubstatEntry,
  SubstatName,
  getSubstatChances
} from "@/app/(app)/echo-simulation/services/simulate";

const SUBSTATS: Substats[] = [
  Substats.FlatATK,
  Substats.FlatHP,
  Substats.FlatDEF,
  Substats.ATK,
  Substats.HP,
  Substats.DEF,
  Substats.ER,
  Substats.CR,
  Substats.CDMG,
  Substats.Basic_DMG,
  Substats.Heavy_DMG,
  Substats.Skill_DMG,
  Substats.Liberation_DMG,
]

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

describe('simulate function', () => {
  test('each substat should be present', () => {
    expect(typeof substatsDict).toBe('object');
    for (const substat of SUBSTATS) {
      expect(substatsDisplayOrder[substat]).not.toBeNull();
      expect(substatsDict[substat]).not.toBeNull();
      expect(substatValues[substat]).not.toBeNull();
    }
  });

  test('each substat should have chances and sum should be ~1', () => {
    for (const substat of SUBSTATS) {
      const chances = getSubstatChances(substat);
      expect(chances).not.toBeNull();
      for (let i = 0; i < chances.length; ++i) {
        expect(chances[i]).toBeGreaterThan(0);
        expect(chances[i]).toBeLessThan(1);
      }
      expect(chances.reduce((acc, e) => acc + e)).toBeCloseTo(1);
    }
  });

  test('each substat roll should be >0 or <1 or >=30', () => {
    for (const substat of SUBSTATS) {
      const rolls = substatValues[substat];
      for (const roll of rolls) {
        expect((roll > 0 && roll < 1) || roll >= 30).toBe(true);
      }
    }
  });

  test('atk + hp + dmgbonus should have same rolls', () => {
    const subsToCheck = [
      Substats.ATK,
      Substats.HP,
      Substats.Basic_DMG,
      Substats.Heavy_DMG,
      Substats.Skill_DMG,
      Substats.Liberation_DMG,
    ];
    for (const substat of subsToCheck) {
      expect(substatValues[substat]).toEqual([0.064, 0.071, 0.079, 0.086, 0.094, 0.101, 0.109, 0.116]);
    }
  });

  test('rolls of crit dmg should be x2 crit rate', () => {
    for (let i = 0; i < 8; ++i) {
      expect(substatValues[Substats.CDMG][i]).toEqual(2 * substatValues[Substats.CR][i]);
    }
  });

  test('calculateProbabilityOfDesiredSubstats vs empty and empty', () => {
    const startSubstats: SubstatEntry[] = [], desiredSubstats: SubstatEntry[] = [];
    for (let i = 0; i <= 5; ++i) {
      const prob = calculateProbabilityOfDesiredSubstats(
        startSubstats,
        desiredSubstats,
        i,
        false
      );
      expect(prob).toBeGreaterThanOrEqual(0);
      expect(prob).toBeLessThanOrEqual(1 + Number.EPSILON * 100);
    }
  });

  test('order should be flat -> % -> er -> crit -> dmg', () => {
    const order: { [key in SubstatName]: number } = {
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
    for (const key in substatsDisplayOrder) {
      expect(substatsDisplayOrder[key]).toEqual(order[key]);
    }
  });

  /* probability tests */
  test('picking any substat with 4 starting subs should be base chance', () => {
    const startSubstats: SubstatName[] = [
      Substats.ATK,
      Substats.DEF,
      Substats.HP,
      Substats.CR,
    ];
    const desiredSubstatCollection = Object.keys(substatsDict)
      .filter(key => !startSubstats.includes(key));

    // test values: 0 -> 1st -> 2nd -> 3rd -> max
    const idxs = [0, 1, 2, 3, -1];
    for (const substat of desiredSubstatCollection) {
      for (const idx of idxs) {
        const calcProb: number = calculateProbabilityOfDesiredSubstats(
          [{ name: substat, value: substatValues[substat].at(idx) as number }],
          startSubstats.map(e => ({ name: e, value: 0 })),
          5,
          false
        );
        const possibleChances = getSubstatChances(substat);

        const substatChance = calculateSubstatNameChance(new Set(startSubstats), substat);
        const totalRollChance = possibleChances.reduce((acc, e) => acc + e, 0);
        const rollChance = possibleChances.slice(idx).reduce((acc, e) => acc + e, 0) / totalRollChance;

        const realProb: number = substatChance * rollChance;

        expect(calcProb).toBe(realProb);
      }
    }
  });

  test('chance for a single desired substat with after consecutive rolls', () => {
    const desiredSubstat: SubstatName = Substats.CDMG;
    const substatsToPick: SubstatName[] = [
      Substats.ATK,
      Substats.HP,
      Substats.DEF,
      Substats.CR
    ];
    // we start from 1 (+5), end at 5 (+25)
    const pickedSubstats = new Set<SubstatName>();
    const possibleRollChances = getSubstatChances(desiredSubstat);
    for (let i = 1; i <= 5; ++i) {
      for (let j = 0; j < possibleRollChances.length; ++j) {
        const substatChance = calculateSubstatNameChance(pickedSubstats, desiredSubstat);
        const totalRollChance = possibleRollChances.reduce((acc, e) => acc + e, 0);
        const rollChance = possibleRollChances.slice(j).reduce((acc, e) => acc + e, 0) / totalRollChance;

        // chance of rolling desired sub at i lvl
        const substatRollChance = substatChance * rollChance;

        const calcProb: number = calculateProbabilityOfDesiredSubstats(
          [{ name: desiredSubstat, value: substatValues[desiredSubstat][j] }],
          [...pickedSubstats].map(e => ({ name: e, value: 0 })),
          i,
          false
        );
        expect(calcProb).toBe(substatRollChance);
      }
      if (i < 5) {
        // prevent undefined
        pickedSubstats.add(substatsToPick[i - 1]);
      };
    }
  });

  test('chance for checkForAny=true should be a sum at each stage', () => {
    const desiredSubstats: SubstatEntry[] = [
      { name: Substats.CDMG, value: substatValues[Substats.CDMG][7] },
      { name: Substats.CR, value: substatValues[Substats.CR][2] },
    ];
    const substatsToPick: SubstatName[] = [
      Substats.ATK,
      Substats.HP,
      Substats.DEF,
      Substats.FlatHP
    ];
    const pickedSubstats: Set<SubstatName> = new Set<SubstatName>();
    for (let i = 1; i <= 5; ++i) {
      let totalChance = 0;
      for (const desiredSubstat of desiredSubstats) {
        const substatChance = calculateSubstatNameChance(pickedSubstats, desiredSubstat.name);
        const possibleRollChances = getSubstatChances(desiredSubstat.name);
        const totalRollChance = possibleRollChances.reduce((acc, e) => acc + e, 0);
        let cumRollChance = 0;
        for (const [idx, rollValue] of substatValues[desiredSubstat.name].entries()) {
          if (desiredSubstat.value <= rollValue) {
            cumRollChance += possibleRollChances[idx];
          }
        }
        totalChance += substatChance * (cumRollChance / totalRollChance);
      }
      const calcProb: number = calculateProbabilityOfDesiredSubstats(
        desiredSubstats,
        [...pickedSubstats].map(e => ({ name: e, value: 0 })),
        i,
        true
      );
      expect(calcProb).toBe(totalChance);

      if (i < 5) {
        // undefined prevention
        pickedSubstats.add(substatsToPick[i - 1]);
      }
    }
  })
});