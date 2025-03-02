import { z } from 'zod';

// it's lowercase due easier access
export enum ActiveSkillNames {
  normalAttack = "Normal Attack",
  resonanceSkill = "Resonance Skill",
  resonanceLiberation = "Resonance Liberation",
  forte = "Forte",
  intro = "Intro",
}
export enum PassiveSkillNames {
  inherent = "Inherent",
  side1 = "Side1", // far left
  side2 = "Side2", // 2nd left
  side3 = "Side3", // 2nd right
  side4 = "Side4", // far right
}

// weapon uses same values as character
// 0 - 1-20, 1 - 20*-40, 2 - 40*-60, 3 - 60*-70, 4 - 70*-70, 5 - 70*-80, 6 - 80*-90
export const RequiredAscension = {
  active: {
    1: 0,
    2: 2,
    3: 2,
    4: 3,
    5: 0, // requires confirmation
    6: 0, // requires confirmation
    7: 5,
    8: 5, // requires confirmation
    9: 6,
    10: 6,
  },
  inherent: {
    0: 0,
    1: 2,
    2: 4,
  },
  side: {
    0: 0,
    1: 3,
    2: 5,
  }
}

export const createCurrentDesiredSchema = (
  schema: z.ZodNumber | z.ZodUnion<[z.ZodNumber, z.ZodString]>,
  defaultCurrent: number | string,
  defaultDesired: number | string
) => {
  return z
    .object({
      current: schema,
      desired: schema,
    })
    .default({ current: defaultCurrent, desired: defaultDesired })
    .refine(
      (data) => data.current <= data.desired,
      {
        message: "Current value must be less than or equal to desired value",
        path: ["current"]
      }
    );
};

export const resonatorSchemaFieldsMinMaxValues: Record<string, { min: number, max: number }> = {
  level: { min: 1, max: 90 },
  // active
  normalAttack: { min: 1, max: 10 },
  resonanceSkill: { min: 1, max: 10 },
  resonanceLiberation: { min: 1, max: 10 },
  forte: { min: 1, max: 10 },
  intro: { min: 1, max: 10 },
  // passive
  inherent: { min: 0, max: 2 },
  side1: { min: 0, max: 2 },
  side2: { min: 0, max: 2 },
  side3: { min: 0, max: 2 },
  side4: { min: 0, max: 2 },
};

const levelBaseSchema = z.union([z.number().int().min(1).max(90), z.string()]);
const activeSkillBaseSchema = z.number().int().min(1).max(10);
const passiveSkillBaseSchema = z.number().int().min(0).max(2);

export const levelSchema = createCurrentDesiredSchema(levelBaseSchema, 1, 1);
export const activeSkillSchema = createCurrentDesiredSchema(activeSkillBaseSchema, 1, 1);
export const passiveSkillSchema = createCurrentDesiredSchema(passiveSkillBaseSchema, 0, 0);

export const resonatorSchema = z.object({
  name: z.string().default(""),
  level: levelSchema,
  // Dynamically map over ActiveSkillNames and PassiveSkillNames
  ...Object.fromEntries(
    Object.keys(ActiveSkillNames).map((skill) => [skill, activeSkillSchema])
  ) as { [key in keyof typeof ActiveSkillNames]: typeof activeSkillSchema; },
  ...Object.fromEntries(
    Object.keys(PassiveSkillNames).map((skill) => [skill, passiveSkillSchema])
  ) as { [key in keyof typeof PassiveSkillNames]: typeof passiveSkillSchema; },
});
// hack cause i'm a noob, need to remove name from this cause otherwise watch()
// from form will yell at me
export type resonatorSchemaField = keyof typeof resonatorSchema.shape;
export type resonatorSchemaForForm = Exclude<keyof typeof resonatorSchema.shape, "name">;