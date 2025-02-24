import { Substats } from "@/app/echo-simulation/data/enums";
import {
  substatsDisplayOrder,
  substatsDict,
  substatValues,
  substatChances,
  calculateProbabilityOfDesiredSubstats,
  SubstatEntry
} from "@/app/echo-simulation/services/simulate";

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

describe('add function', () => {
  test('each substat should be present', () => {
    expect(typeof substatsDict).toBe('object');
    for (const substat of SUBSTATS) {
      expect(substatsDisplayOrder[substat]).not.toBeNull();
      expect(substatsDict[substat]).not.toBeNull();
      expect(substatValues[substat]).not.toBeNull();
    }
  });

  test('each substat should have chances', () => {
    for (const substat of SUBSTATS) {
      const rolls = substatValues[substat];
      const chances = substatChances[rolls.length];
      expect(chances).not.toBeNull();
      for (let i = 0; i < chances.length; ++i) {
        expect(chances[i]).toBeGreaterThan(0);
        expect(chances[i]).toBeLessThan(1);
      }
      expect(chances.reduce((acc, e) => acc + e)).toBeCloseTo(1);
    }
  });

  test('each substat roll should be <1 or >=30', () => {
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
});