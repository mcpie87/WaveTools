import { weaponSchema } from "@/schemas/weaponSchema";
import { z } from "zod";

export type WeaponStateDBEntry = z.infer<typeof weaponSchema>;

export interface WeaponDBSchema {
  [id: string]: WeaponStateDBEntry[];
}