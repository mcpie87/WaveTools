import { z } from "zod";

export const itemSchema = z.object({
  id: z.number(), // needed for inventory sorting
  rarity: z.number(), // needed for inventory sorting
  name: z.string(),
  owned: z.number().min(0),
});
export type itemSchemaField = keyof typeof itemSchema.shape;