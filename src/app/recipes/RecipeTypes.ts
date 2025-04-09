import { IItemEntry } from "../interfaces/api_interfaces";
import { IItem } from "../interfaces/item";

export const enum ERecipeType {
  synthesis = "synthesis",
  dish = "dish",
  processed = "processed",
}

export interface IRecipeFormulaBase {
  id: number;
  type: ERecipeType;
  resultItem: IItem;
  // materials: (IItem | IItemEntry)[];
  formulaType?: number;
  specialtyItem?: IItem;
  specialtyCook?: {
    id: number;
    name: string;
    icon: string;
    rarity: number;
  };
}

export interface IAPIRecipeFormula extends IRecipeFormulaBase {
  materials: IItemEntry[];
}

export interface IRecipeItem extends IItem {
  price?: number;
  value: number;
}
export interface IRecipeFormula extends IRecipeFormulaBase {
  materials: IRecipeItem[];
}

export interface IShop {
  id: number;
  shopName: string;
  price: string[];
  limit: number;
}
export interface IItemToShops {
  id: number;
  itemName: string;
  shops: IShop[];
}