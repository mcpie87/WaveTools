import { IAPIItem } from "@/app/interfaces/api_interfaces";
import { IItem } from "@/app/interfaces/item";
import { parseItemToItemCard } from "./api_parser";
import { ItemCommon, ItemEchoEXP, ItemEliteBoss, ItemResonatorEXP, ItemSpecialty, ItemTuner, ItemWeapon, ItemWeaponEXP, ItemWeeklyBoss, SHELL_CREDIT } from "@/app/interfaces/item_types";

export function convertItemMapToItemList(
  items: IAPIItem[],
  mappedItems: { [key: string]: number }
): IItem[] {
  const resultsMap: { [key: string]: IItem } = {};
  for (const [matKey, matValue] of Object.entries(mappedItems)) {
    const apiItem = items.find(item => item.name === matKey);
    if (!apiItem) {
      throw new Error(`apiItem not found ${matKey}`);
    }
    const parsedItem = parseItemToItemCard(apiItem);
    parsedItem.value = matValue;
    resultsMap[matKey] = (parsedItem);
  }

  return sortToItemList(resultsMap);
}

function sortToItemList(items: { [key: string]: IItem }): IItem[] {
  const sortOrder = [
    [SHELL_CREDIT],
    ItemResonatorEXP,
    ItemWeaponEXP,
    ItemTuner,
    ItemEchoEXP,
    ItemEliteBoss,
    ItemWeeklyBoss,
    ItemSpecialty,
    ItemWeapon,
    ItemCommon,
  ];

  return sortOrder.flatMap(order =>
    Object.values(order).map(name => items[name]).filter(Boolean)
  );
}