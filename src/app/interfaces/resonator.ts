import { IconURL } from "./api_interfaces";
import { ItemCommon, ItemEliteBoss, ItemSpecialty, ItemWeapon, ItemWeeklyBoss } from "./item_types";

export interface IResonatorUpgrade {
  name: string;
  rarity: number;
  weeklyMaterial: ItemWeeklyBoss;
  eliteMaterial: ItemEliteBoss;
  specialtyMaterial: ItemSpecialty;
  weaponMaterial: ItemWeapon;
  commonMaterial: ItemCommon;
};

export interface IResonatorPlanner extends IResonatorUpgrade {
  icon: IconURL;
}