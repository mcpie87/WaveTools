import { IAPIItem, IItemEntry } from "@/app/interfaces/api_interfaces";
import { IItem, TItemMap } from "@/app/interfaces/item";
import { parseItemToItemCard } from "./api_parser";
import { ItemCommon, ItemEchoEXP, ItemEliteBoss, ItemResonatorEXP, ItemSpecialty, ItemType, ItemWeapon, ItemWeaponEXP, ItemWeeklyBoss, SHELL_CREDIT } from "@/app/interfaces/item_types";
import { WAVEPLATE_ELITE_BOSS, WAVEPLATE_ELITE_BOSS_COST, WAVEPLATE_FORGERY, WAVEPLATE_FORGERY_COST, WAVEPLATE_SIM_ENERGY, WAVEPLATE_SIM_ENERGY_COST, WAVEPLATE_SIM_RESONANCE, WAVEPLATE_SIM_RESONANCE_COST, WAVEPLATE_SIM_SHELL, WAVEPLATE_SIM_SHELL_COST, WAVEPLATE_WEEKLY_BOSS, WAVEPLATE_WEEKLY_BOSS_COST } from "@/constants/waveplate_usage";
import { WaveplateEntry } from "@/components/WaveplateComponent";
import { IRequiredItemMap } from "@/app/interfaces/planner_item";
import { EXP_POTION_VALUES_ASC } from "@/constants/constants";
import { InventoryStateDBEntry } from "@/types/inventoryTypes";

export function findItemByName(name: string, items: IAPIItem[]): IAPIItem | undefined {
  return items.find(item => item.name === name);
}
export function findItemsByNames(names: string[], items: IAPIItem[]): IAPIItem[] {
  return items.filter(item => names.includes(item.name));
}

export const convertInventoryItemsToItemList = (items: InventoryStateDBEntry[], apiItems: IAPIItem[]): IItem[] => {
  const results: IItem[] = [];
  const selectedAPIItems = apiItems.filter(
    item => items.some(dbItem => dbItem.name === item.name)
  );
  for (const item of items) {
    const apiItem = selectedAPIItems.find(apiItem => item.name === apiItem.name);
    if (!apiItem) {
      console.error(`apiItem not found ${item.name}`);
      continue;
    }
    const parsedItem = parseItemToItemCard(apiItem);
    results.push(parsedItem);
  }
  return results;
}

export function convertCostListToItemList(costList: IItemEntry[], apiItems: IAPIItem[]): IItem[] {
  const results: IItem[] = [];
  for (const item of costList) {
    const apiItem = apiItems.find(apiItem => item.id === apiItem.id);
    if (!apiItem) {
      console.error(`apiItem not found ${item.id} ${item.value}`);
      continue;
    }
    const parsedItem = parseItemToItemCard(apiItem);
    parsedItem.value = item.value;
    parsedItem.needed = item.value;
    results.push(parsedItem);
  }
  return results;
}

export function convertRequiredItemMapToItemList(
  apiItems: IAPIItem[],
  mappedItems: IRequiredItemMap,
  removeZeroes: boolean = false
): IItem[] {
  const results: IItem[] = [];
  for (const [matId, matValue] of Object.entries(mappedItems)) {
    const apiItem = apiItems.find(item => item.id.toString() === matId);
    if (!apiItem) {
      console.error(`apiItem not found ${matId} ${matValue}`);
      continue;
    }
    const parsedItem = parseItemToItemCard(apiItem);
    parsedItem.value = matValue;
    parsedItem.needed = matValue;
    results.push(parsedItem);
  }

  return removeZeroes
    ? results.filter(item => (item.value ?? 0) > 0)
    : results;
}

export function convertRequiredItemMapToItemMap(
  apiItems: IAPIItem[],
  requiredMaterials: IRequiredItemMap,
  removeZeroes: boolean = false
): TItemMap {
  const itemList = convertRequiredItemMapToItemList(apiItems, requiredMaterials, removeZeroes);
  return convertItemListToItemMap(itemList);
}

export function convertItemListToItemMap(itemList: IItem[]): TItemMap {
  const map = new Map<string, IItem>();
  for (const item of itemList) {
    map.set(item.name, item);
  }
  return map;
}

// TODO: add order? maybe define static orders somewhere
export function convertItemMapToItemList(itemMap: TItemMap): IItem[] {
  return Array.from(itemMap.values());
}

export function filterType<T extends Record<string, string>>(
  items: IItem[],
  filterType: T
): IItem[] {
  return items.filter((item) => Object.values(filterType).includes(item.name))
}

export function sortToItemList<T extends Record<string, string>>(
  sortOrder: T[],
  apiItems: IAPIItem[],
  items: IItem[] | { [key: string]: IItem },
  byRarity: boolean = true
): IItem[] {
  const retMap = Array.isArray(items)
    ? Object.fromEntries(Object.values(items).map(item => [item.id, item]))
    : items;

  return sortOrder.flatMap(order => {
    const ret = findItemsByNames(Object.values(order), apiItems)
      .map(apiItem => retMap[apiItem.id]).filter(Boolean);
    return byRarity
      ? ret.sort((a, b) => b.rarity - a.rarity)
      : ret;
  });
}

export function calculateWaveplate(items: IItem[]): WaveplateEntry[] {
  const worldLevel = 8;
  const weeklyBossDropRates = WAVEPLATE_WEEKLY_BOSS[worldLevel > 7 ? 7 : worldLevel];
  const eliteBossDropRates = WAVEPLATE_ELITE_BOSS[worldLevel];
  const forgeryDropRates = WAVEPLATE_FORGERY[worldLevel > 7 ? 7 : worldLevel];

  // const tacetFieldsDropRates = WAVEPLATE_TACET_FIELDS[worldLevel];

  const simResonanceDropRates = WAVEPLATE_SIM_RESONANCE[worldLevel > 7 ? 7 : worldLevel];
  const simEnergyDropRates = WAVEPLATE_SIM_ENERGY[worldLevel > 7 ? 7 : worldLevel];
  const simShellDropRates = WAVEPLATE_SIM_SHELL[worldLevel];

  const weeklyCount = getWeeklyCountFromList(items) / weeklyBossDropRates.WEEKLY;
  const forgeryCount = getWeapon2CountFromList(items) / forgeryDropRates.WEAPON_2;
  // If it's resonator, we get items for free
  const eliteCount = items.find(e => e.name === ItemEliteBoss.MYSTERIOUS_CODE)
    ? 0
    : getEliteCountFromList(items) / eliteBossDropRates.ELITE;

  const initialResonatorExpNeeded = getResonatorExpNeededFromList(items);
  let resonatorExpNeeded = initialResonatorExpNeeded;
  resonatorExpNeeded -= weeklyCount * weeklyBossDropRates.RESONATOR_EXP;
  resonatorExpNeeded -= eliteCount * eliteBossDropRates.RESONATOR_EXP;
  const simResonatorCount = resonatorExpNeeded / simResonanceDropRates.RESONATOR_EXP;

  const initialWeaponExpNeeded = getWeaponExpNeededFromList(items);
  let weaponExpNeeded = initialWeaponExpNeeded;
  weaponExpNeeded -= eliteCount * eliteBossDropRates.WEAPON_EXP;
  const simEnergyCount = weaponExpNeeded / simEnergyDropRates.WEAPON_EXP;

  let shellNeeded = getShellFromItemList(items);
  shellNeeded -= weeklyCount * weeklyBossDropRates.SHELL;
  shellNeeded -= eliteCount * eliteBossDropRates.SHELL;
  shellNeeded -= forgeryCount * forgeryDropRates.SHELL;
  shellNeeded -= simResonatorCount * simResonanceDropRates.SHELL;
  const simShellCount = shellNeeded / simShellDropRates.SHELL

  return [
    getWaveplateEntry("shell", simShellCount, WAVEPLATE_SIM_SHELL_COST),
    getWaveplateEntry("weekly", weeklyCount, WAVEPLATE_WEEKLY_BOSS_COST),
    getWaveplateEntry("elite", eliteCount, WAVEPLATE_ELITE_BOSS_COST),
    getWaveplateEntry("forgery", forgeryCount, WAVEPLATE_FORGERY_COST),
    getWaveplateEntry("resonator exp", simResonatorCount, WAVEPLATE_SIM_RESONANCE_COST),
    getWaveplateEntry("weapon exp", simEnergyCount, WAVEPLATE_SIM_ENERGY_COST),
  ];
}

const getWaveplateEntry = (label: string, runCount: number, cost: number): WaveplateEntry => {
  return {
    label,
    runCount: Math.max(0, runCount),
    waveplateCount: Math.max(0, runCount) * cost
  }
}

const getRealItemValue = (item: IItem): number => {
  return (item.value ?? 0) - (item.converted ?? 0);
}

const getWeeklyCountFromList = (items: IItem[]): number => {
  return items
    .filter((item) => Object.values(ItemWeeklyBoss).includes(item.name as ItemWeeklyBoss))
    .reduce((sum, item) => sum + getRealItemValue(item), 0);
}

const getEliteCountFromList = (items: IItem[]): number => {
  return items
    .filter((item) => Object.values(ItemEliteBoss).includes(item.name as ItemEliteBoss))
    .reduce((sum, item) => sum + getRealItemValue(item), 0);
}

const getWeapon2CountFromList = (items: IItem[]): number => {
  return items
    .filter((item) => Object.values(ItemWeapon).includes(item.name as ItemWeapon))
    .map(item => getRealItemValue(item) * Math.pow(3, item.rarity - 2))
    .reduce((sum, item) => sum + item, 0);
}

const getResonatorExpNeededFromList = (items: IItem[]): number => {
  const vals = EXP_POTION_VALUES_ASC;
  return items
    .filter((item) => Object.values(ItemResonatorEXP).includes(item.name as ItemResonatorEXP))
    .map(item => getRealItemValue(item) * vals[item.rarity - 2])
    .reduce((sum, item) => sum + item, 0);
}

const getWeaponExpNeededFromList = (items: IItem[]): number => {
  const vals = EXP_POTION_VALUES_ASC;
  return items
    .filter((item) => Object.values(ItemWeaponEXP).includes(item.name as ItemWeaponEXP))
    .map(item => getRealItemValue(item) * vals[item.rarity - 2])
    .reduce((sum, item) => sum + item, 0);
}

const getShellFromItemList = (items: IItem[]): number => {
  return (items.find(item => item.name === SHELL_CREDIT)?.value) ?? 0;
}

export function getWeaponMaterial(type: ItemWeapon, rarity: number): ItemWeapon;
export function getWeaponMaterial(type: ItemWeapon, rarity: number[]): ItemWeapon[];
export function getWeaponMaterial(type: ItemWeapon, rarity: number | number[]): ItemWeapon | ItemWeapon[] {
  let retType: string;
  switch (type) {
    case ItemWeapon.PISTOL_RARITY_5: retType = "PISTOL"; break;
    case ItemWeapon.PISTOL_RARITY_4: retType = "PISTOL"; break;
    case ItemWeapon.PISTOL_RARITY_3: retType = "PISTOL"; break;
    case ItemWeapon.PISTOL_RARITY_2: retType = "PISTOL"; break;
    case ItemWeapon.SWORD_RARITY_5: retType = "SWORD"; break;
    case ItemWeapon.SWORD_RARITY_4: retType = "SWORD"; break;
    case ItemWeapon.SWORD_RARITY_3: retType = "SWORD"; break;
    case ItemWeapon.SWORD_RARITY_2: retType = "SWORD"; break;
    case ItemWeapon.BROADBLADE_RARITY_5: retType = "BROADBLADE"; break;
    case ItemWeapon.BROADBLADE_RARITY_4: retType = "BROADBLADE"; break;
    case ItemWeapon.BROADBLADE_RARITY_3: retType = "BROADBLADE"; break;
    case ItemWeapon.BROADBLADE_RARITY_2: retType = "BROADBLADE"; break;
    case ItemWeapon.GAUNTLETS_RARITY_5: retType = "GAUNTLETS"; break;
    case ItemWeapon.GAUNTLETS_RARITY_4: retType = "GAUNTLETS"; break;
    case ItemWeapon.GAUNTLETS_RARITY_3: retType = "GAUNTLETS"; break;
    case ItemWeapon.GAUNTLETS_RARITY_2: retType = "GAUNTLETS"; break;
    case ItemWeapon.RECTIFIER_RARITY_5: retType = "RECTIFIER"; break;
    case ItemWeapon.RECTIFIER_RARITY_4: retType = "RECTIFIER"; break;
    case ItemWeapon.RECTIFIER_RARITY_3: retType = "RECTIFIER"; break;
    case ItemWeapon.RECTIFIER_RARITY_2: retType = "RECTIFIER"; break;
    default: throw new Error(`Incorrect getWeaponMaterial call with ${type}`);
  }

  const keyFn = (rarity: number) => `${retType}_RARITY_${rarity}` as keyof typeof ItemWeapon;
  if (typeof rarity === "number") {
    const key = keyFn(rarity);
    return ItemWeapon[key];
  }

  if (Array.isArray(rarity)) {
    return rarity.map(rarity => keyFn(rarity)).map(key => ItemWeapon[key]);
  }
  throw new Error(`Incorrect getWeaponMaterial call with ${type}`);
}

export function getCommonMaterial(type: ItemCommon, rarity: number): ItemCommon;
export function getCommonMaterial(type: ItemCommon, rarity: number[]): ItemCommon[];
export function getCommonMaterial(type: ItemCommon, rarity: number | number[]): ItemCommon | ItemCommon[] {
  let retType: string;
  switch (type) {
    case ItemCommon.WHISPERIN_RARITY_5: retType = "WHISPERIN"; break;
    case ItemCommon.WHISPERIN_RARITY_4: retType = "WHISPERIN"; break;
    case ItemCommon.WHISPERIN_RARITY_3: retType = "WHISPERIN"; break;
    case ItemCommon.WHISPERIN_RARITY_2: retType = "WHISPERIN"; break;
    case ItemCommon.HOWLER_RARITY_5: retType = "HOWLER"; break;
    case ItemCommon.HOWLER_RARITY_4: retType = "HOWLER"; break;
    case ItemCommon.HOWLER_RARITY_3: retType = "HOWLER"; break;
    case ItemCommon.HOWLER_RARITY_2: retType = "HOWLER"; break;
    case ItemCommon.EXILE_RARITY_5: retType = "EXILE"; break;
    case ItemCommon.EXILE_RARITY_4: retType = "EXILE"; break;
    case ItemCommon.EXILE_RARITY_3: retType = "EXILE"; break;
    case ItemCommon.EXILE_RARITY_2: retType = "EXILE"; break;
    case ItemCommon.FRACTSIDUS_RARITY_5: retType = "FRACTSIDUS"; break;
    case ItemCommon.FRACTSIDUS_RARITY_4: retType = "FRACTSIDUS"; break;
    case ItemCommon.FRACTSIDUS_RARITY_3: retType = "FRACTSIDUS"; break;
    case ItemCommon.FRACTSIDUS_RARITY_2: retType = "FRACTSIDUS"; break;
    case ItemCommon.POLYGON_RARITY_5: retType = "POLYGON"; break;
    case ItemCommon.POLYGON_RARITY_4: retType = "POLYGON"; break;
    case ItemCommon.POLYGON_RARITY_3: retType = "POLYGON"; break;
    case ItemCommon.POLYGON_RARITY_2: retType = "POLYGON"; break;
    case ItemCommon.TIDAL_RARITY_5: retType = "TIDAL"; break;
    case ItemCommon.TIDAL_RARITY_4: retType = "TIDAL"; break;
    case ItemCommon.TIDAL_RARITY_3: retType = "TIDAL"; break;
    case ItemCommon.TIDAL_RARITY_2: retType = "TIDAL"; break;
    default: throw new Error(`Incorrect getCommonMaterial call with ${type}`);
  }

  const keyFn = (rarity: number) => `${retType}_RARITY_${rarity}` as keyof typeof ItemCommon;
  if (typeof rarity === "number") {
    const key = keyFn(rarity);
    return ItemCommon[key];
  }

  if (Array.isArray(rarity)) {
    return rarity.map(rarity => keyFn(rarity)).map(key => ItemCommon[key]);
  }
  throw new Error(`Incorrect getCommonMaterial call with ${type}`);
}

// Returns matching 4 item names for synthesis
export const getSynthesisItems = (item: IItem): ItemWeapon[] | ItemCommon[] => {
  const itemType = getItemType(item);

  if (itemType === ItemType.COMMON) {
    return getCommonMaterial(item.name as ItemCommon, [2, 3, 4, 5]);
  }
  if (itemType === ItemType.WEAPON) {
    return getWeaponMaterial(item.name as ItemWeapon, [2, 3, 4, 5]);
  }
  return [];
}

export const getItemType = (item: IItem): ItemType => {
  if (SHELL_CREDIT === item.name) {
    return ItemType.SHELL_CREDIT;
  }
  if (Object.values(ItemCommon).includes(item.name as ItemCommon)) {
    return ItemType.COMMON;
  }
  if (Object.values(ItemWeapon).includes(item.name as ItemWeapon)) {
    return ItemType.WEAPON;
  }
  if (Object.values(ItemWeeklyBoss).includes(item.name as ItemWeeklyBoss)) {
    return ItemType.WEEKLY_BOSS;
  }
  if (Object.values(ItemEliteBoss).includes(item.name as ItemEliteBoss)) {
    return ItemType.ELITE_BOSS;
  }
  if (Object.values(ItemSpecialty).includes(item.name as ItemSpecialty)) {
    return ItemType.SPECIALTY;
  }
  if (Object.values(ItemResonatorEXP).includes(item.name as ItemResonatorEXP)) {
    return ItemType.RESONATOR_EXP;
  }
  if (Object.values(ItemWeaponEXP).includes(item.name as ItemWeaponEXP)) {
    return ItemType.WEAPON_EXP;
  }
  if (Object.values(ItemEchoEXP).includes(item.name as ItemEchoEXP)) {
    return ItemType.ECHO_EXP;
  }
  throw new Error(`Item ${item.name} is not a valid item type`);
}