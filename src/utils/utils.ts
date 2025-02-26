import { ASSET_URL } from "./constants";

export function convertToUrl(path: string): string {
  return ASSET_URL + path.trim().replace("/Game/Aki/UI/", "");
}