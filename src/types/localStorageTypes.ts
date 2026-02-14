import { InventoryDBSchema } from "./inventoryTypes";
import { DbMapData } from "./mapTypes";
import { ResonatorDBSchema } from "./resonatorTypes";
import { UnionLevelPageData } from "./unionLevelDataTypes";
import { WeaponDBSchema } from "./weaponTypes";

export const LOCAL_STORAGE_SCHEMA_VERSION = "3.0";
export enum LocalStorageKey {
  THEME = "theme",
  SCHEMA_VERSION = "schema_version",
  RESONATORS = "resonators",
  WEAPONS = "weapons",
  INVENTORY = "inventory",
  LEVEL = "level",
  MAP = "map",
}


export type LocalStorageData = string
  | ResonatorDBSchema
  | WeaponDBSchema
  | InventoryDBSchema
  | UnionLevelPageData
  | DbMapData;