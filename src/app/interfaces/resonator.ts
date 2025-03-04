import { IconURL } from "./api_interfaces";
import { ItemCommon, ItemEliteBoss, ItemSpecialty, ItemWeapon, ItemWeeklyBoss } from "./item_types";

export interface IResonatorUpgradeItem<T> {
  id: number;
  name: T
}

export interface IResonatorUpgrade {
  name: string;
  rarity: number;
  weeklyMaterial: IResonatorUpgradeItem<ItemWeeklyBoss>;
  eliteMaterial: IResonatorUpgradeItem<ItemEliteBoss>;
  specialtyMaterial: IResonatorUpgradeItem<ItemSpecialty>;
  weaponMaterial: IResonatorUpgradeItem<ItemWeapon>;
  commonMaterial: IResonatorUpgradeItem<ItemCommon>;
};

export interface IResonatorPlanner extends IResonatorUpgrade {
  priority: number;
  icon: IconURL;
}