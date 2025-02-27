import { z } from 'zod';
import { resonatorSchema, ACTIVE_SKILL_NAMES, PASSIVE_SKILL_NAMES } from '../schemas/resonatorSchema';

// Type definitions
export type ActiveSkillName = typeof ACTIVE_SKILL_NAMES[number];
export type PassiveSkillName = typeof PASSIVE_SKILL_NAMES[number];

export interface InputEntry {
  current: number;
  desired: number;
}

// Infer the type from the Zod schema
export type ResonatorStateDBEntry = z.infer<typeof resonatorSchema>;

// Type for the characters database
export interface ResonatorDBSchema {
  [id: string]: ResonatorStateDBEntry;
}