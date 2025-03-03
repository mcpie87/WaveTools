import { itemSchema } from "@/schemas/itemSchema";
import { z } from "zod";

export type ItemStateDBEntry = z.infer<typeof itemSchema>;
export interface ItemStateDBSchema {
  [id: string]: ItemStateDBEntry;
}