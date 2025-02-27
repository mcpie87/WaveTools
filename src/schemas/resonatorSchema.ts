import { z } from 'zod';

export const ACTIVE_SKILL_NAMES = [
  "Normal Attack",
  "Resonance Skill",
  "Resonance Liberation",
  "Forte",
  "Intro",
] as const;

export const PASSIVE_SKILL_NAMES = [
  "Inherent",
  "Side",
] as const;

// Helper function to create a schema for current/desired values
export const createCurrentDesiredSchema = <T extends z.ZodTypeAny>(schema: T) => {
  return z.object({
    current: schema,
    desired: schema,
  });
};

export const activeSkillSchema = z.number().int().min(1).max(10);
export const passiveSkillSchema = z.number().int().min(0).max(2);
export const levelSchema = z.number().int().min(1).max(90);
export const ascensionSchema = z.number().int().min(1).max(6);

export const resonatorSchema = z.object({
  level: createCurrentDesiredSchema(levelSchema),
  ascension: createCurrentDesiredSchema(ascensionSchema),
  ...Object.fromEntries(
    ACTIVE_SKILL_NAMES.map((skill) => [skill, createCurrentDesiredSchema(activeSkillSchema)])
  ),
  ...Object.fromEntries(
    PASSIVE_SKILL_NAMES.map((skill) => [skill, createCurrentDesiredSchema(passiveSkillSchema)])
  ),
});