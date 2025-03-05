export enum BodyType {
  FemaleS = "FemaleS",
  FemaleMS = "FemaleMS",
  FemaleM = "FemaleM",
  FemaleXL = "FemaleXL",
  MaleM = "MaleM",
  MaleS = "MaleS",
  MaleXL = "MaleXL",
}

export type IconURL = string;

export interface IWeaponType {
  id: number;
  name: string;
  icon: string;
}

export interface IElement {
  id: number;
  name: string;
  icon: string;
}

export interface IItemEntry {
  id: number;
  name: string;
  value: number;
}

export interface IAPIItem {
  id: number;
  name: string;
  rarity: number;
  attributes_description: string;
  bg_description: string;
  icon: IconURL;
  icon_middle: IconURL;
  icon_small: IconURL;
}

export interface ITalentCost {
  id: number;
  name: string;
  levels: {
    [key: number]: IItemEntry[];
  };
}

interface IAscension {
  rank: number;
  max: number;
  items: IItemEntry[];
}

export interface IAPIResonator {
  id: number;
  name: string;
  rarity: number;
  weaponType: IWeaponType;
  element: IElement;
  body: BodyType;
  card: IconURL;
  icon: {
    circle: IconURL;
    large: IconURL;
    big: IconURL;
  };
  ascensionMaterials: IAscension[];
  talentMaterials: {
    normalAttack: ITalentCost;
    resonanceSkill: ITalentCost;
    resonanceLiberation: ITalentCost;
    inherentFirst: ITalentCost;
    inherentSecond: ITalentCost;
    intro: ITalentCost;
    forte: ITalentCost;
    outro: ITalentCost;
    cooking: ITalentCost;
  };
}

export interface IAPIWeapon {
  id: number;
  name: string;
  rarity: number;
  weaponType: IWeaponType;
  icon: {
    default: IconURL;
    middle: IconURL;
    small: IconURL;
  };
  ascensionMaterials: IAscension[];
}

export type IAPIPlannerElement = IAPIResonator | IAPIWeapon;