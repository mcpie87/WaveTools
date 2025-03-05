import { z } from "zod";
import { levelSchema } from "./resonatorSchema";

export const weaponSchema = z.object({
  id: z.number(),
  name: z.string().default(""),
  priority: z.number(),
  rarity: z.number(),
  level: levelSchema,
})

export type weaponSchemaField = keyof typeof weaponSchema.shape;
export type weaponSchemaForForm = Exclude<keyof typeof weaponSchema.shape, "name" | "priority" | "rarity" | "id">;