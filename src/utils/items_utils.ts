import { IAPIItem } from "@/app/interfaces/api_interfaces";
import { IItem } from "@/app/interfaces/item";
import { parseItemToItemCard } from "./api_parser";

export function convertItemMapToItemList(
  items: IAPIItem[],
  mappedItems: { [key: string]: number }
): IItem[] {
  const results = [];
  for (const [matKey, matValue] of Object.entries(mappedItems)) {
    const apiItem = items.find(item => item.name === matKey);
    if (!apiItem) {
      throw new Error(`apiItem not found ${matKey}`);
    }
    const parsedItem = parseItemToItemCard(apiItem);
    parsedItem.value = matValue;
    results.push(parsedItem);
  }
  return results;
}