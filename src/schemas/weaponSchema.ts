import { z } from "zod";
import { levelSchema } from "./resonatorSchema";
import { PLANNER_TYPE } from "@/app/interfaces/planner_item";

export const weaponSchema = z.object({
  id: z.number(),
  orderId: z.number(),
  type: z.string().default(PLANNER_TYPE.WEAPON),
  name: z.string().default(""),
  priority: z.number(),
  rarity: z.number(),
  level: levelSchema,
  isActive: z.boolean().default(true),
})

export type weaponSchemaField = keyof typeof weaponSchema.shape;
export type weaponSchemaForForm = Exclude<
  keyof typeof weaponSchema.shape,
  "name" | "priority" | "rarity" | "id" | "type" | "orderId" | "isActive"
>;