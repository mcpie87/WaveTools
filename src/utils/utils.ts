import { ASSET_URL } from "@/constants/constants";

export function convertToUrl(path: string): string {
  return ASSET_URL + path.trim().replace("/Game/Aki/UI/", "");
}

export function getStorageKey(key: string): string {
  return `wuwa_planner/${key}`
}

// returns key value of the selected enum value
// ie. getKeyFromValue(PassiveSkillNames, PassiveSkillNames.inherent) => "inherent"
export const getKeyFromEnumValue = <T extends Record<string, string>>(enumObj: T, value: T[keyof T]) => {
  return Object.keys(enumObj)
    .find((k) => enumObj[k as keyof T] === value) as keyof T | undefined;
}

export const getRarityClass = (rarity: number) => {
  switch (rarity) {
    case 5: return "bg-rarity5";
    case 4: return "bg-rarity4";
    case 3: return "bg-rarity3";
    case 2: return "bg-rarity2";
    case 1: return "bg-rarity1";
    default: return "bg-rarity1";
  }
}

export function formatPercent(num: number, precision: number = 2): string {
  return `${(num * 100).toFixed(precision)}%`;
}

export function formatSubstatValue(num: number): string {
  return num >= 1 ? num.toString() : formatPercent(num, 1);
}

export function formatNumber(num: string | number): string {
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}
