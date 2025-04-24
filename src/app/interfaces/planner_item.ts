import { ResonatorStateDBEntry } from "@/types/resonatorTypes";
import { IconURL } from "./api_interfaces";
import { ItemCommon, ItemEliteBoss, ItemSpecialty, ItemWeapon, ItemWeeklyBoss } from "./item_types";
import { WeaponStateDBEntry } from "@/types/weaponTypes";

export enum PLANNER_TYPE {
  RESONATOR = "resonator",
  WEAPON = "weapon",
}

export interface IPlannerUpgradeItem<T> {
  id: number;
  name: T;
}

export type IRequiredItemMap = { [key: string]: number };

export interface IPlannerItem {
  name: string;
  rarity: number;
  icon: IconURL;
  priority: number;
  weaponMaterial: IPlannerUpgradeItem<ItemWeapon>;
  commonMaterial: IPlannerUpgradeItem<ItemCommon>;
  // Resonator only items
  weeklyMaterial?: IPlannerUpgradeItem<ItemWeeklyBoss>;
  eliteMaterial?: IPlannerUpgradeItem<ItemEliteBoss>;
  specialtyMaterial?: IPlannerUpgradeItem<ItemSpecialty>;

  // for display calculations
  dbData: ResonatorStateDBEntry | WeaponStateDBEntry;
  requiredMaterials?: IRequiredItemMap;
}

export interface IWeaponPlanner extends IPlannerItem {
  type: PLANNER_TYPE.WEAPON;
  orderId: number;
}

export interface IResonatorPlanner extends IPlannerItem {
  type: PLANNER_TYPE.RESONATOR;
  weeklyMaterial: IPlannerUpgradeItem<ItemWeeklyBoss>;
  eliteMaterial: IPlannerUpgradeItem<ItemEliteBoss>;
  specialtyMaterial: IPlannerUpgradeItem<ItemSpecialty>;
}
