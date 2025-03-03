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