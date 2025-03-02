import { IconURL } from "./api_interfaces";

export interface IItem {
  id: number;
  name: string;
  rarity: number;
  attributes_description: string;
  bg_description: string;
  icon: IconURL;
  icon_middle: IconURL;
  icon_small: IconURL;
};