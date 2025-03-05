import { ItemCommon, ItemWeapon } from "./item_types";

export interface IWeaponMaterial<T> {
  id: number;
  name: T;
}

export interface IWeaponUpgrade {
  name: string;
  rarity: number;
  weaponMaterial: IWeaponMaterial<ItemWeapon>;
  commonMaterial: IWeaponMaterial<ItemCommon>;
}

export interface IWeaponPlanner extends IWeaponUpgrade {
  priority: number;
  icon: string;
}