import { z } from "zod";

export const itemSchema = z.object({
  name: z.string(),
  owned: z.number().min(0),
});
export type itemSchemaField = keyof typeof itemSchema.shape;