import { inventorySchema } from "@/schemas/inventorySchema";
import { z } from "zod";

export type InventoryStateDBEntry = z.infer<typeof inventorySchema>;
export interface InventoryDBSchema {
  [id: string]: InventoryStateDBEntry;
}