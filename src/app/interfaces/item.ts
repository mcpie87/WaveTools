import { IconURL } from "./api_interfaces";

export interface IItem {
  id: number;
  name: string;
  rarity: number;
  icon: IconURL;
  icon_middle: IconURL;
  icon_small: IconURL;
  value?: number;
  attributes_description?: string;
  bg_description?: string;
};