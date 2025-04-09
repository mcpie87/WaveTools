import { IconURL } from "./api_interfaces";

export interface IItem {
  id: number;
  name: string;
  rarity: number;
  icon: IconURL;
  icon_middle: IconURL;
  icon_small: IconURL;
  attributes_description: string;
  bg_description?: string;
  // display purposes
  value?: number;
  checked?: boolean; // for inventory (need 4 -> have 5 => true)
};