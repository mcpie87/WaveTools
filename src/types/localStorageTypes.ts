import { InventoryDBSchema } from "./inventoryTypes";
import { ResonatorDBSchema } from "./resonatorTypes";
import { UnionLevelPageData } from "./unionLevelDataTypes";
import { WeaponDBSchema } from "./weaponTypes";

export type LocalStorageData = string
  | ResonatorDBSchema
  | WeaponDBSchema
  | InventoryDBSchema
  | UnionLevelPageData;