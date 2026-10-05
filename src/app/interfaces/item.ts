import { IconURL } from "./api_interfaces";

export type TItemMap = Map<string, IItem>;

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
  needed?: number; // always visible
  value?: number; // can be subtracted from inventory
  converted?: number; // 3x LF = 1x MF, so if need 10 MF, have 0 MF and 9 LF -> display 3 MF
  checked?: boolean; // for inventory (need 4 -> have 5 => true)
};