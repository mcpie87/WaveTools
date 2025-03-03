import { IAPIItem } from "@/app/interfaces/api_interfaces";
import { IItem } from "@/app/interfaces/item";
import { parseItemToItemCard } from "./api_parser";
import { ItemCommon, ItemEchoEXP, ItemEliteBoss, ItemResonatorEXP, ItemSpecialty, ItemTuner, ItemWeapon, ItemWeaponEXP, ItemWeeklyBoss, SHELL_CREDIT } from "@/app/interfaces/item_types";
import { WAVEPLATE_ELITE_BOSS, WAVEPLATE_ELITE_BOSS_COST, WAVEPLATE_FORGERY, WAVEPLATE_FORGERY_COST, WAVEPLATE_SIM_RESONANCE, WAVEPLATE_SIM_RESONANCE_COST, WAVEPLATE_SIM_SHELL, WAVEPLATE_SIM_SHELL_COST, WAVEPLATE_WEEKLY_BOSS, WAVEPLATE_WEEKLY_BOSS_COST } from "@/constants/waveplate_usage";

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

  const sortOrder = [
    { SHELL_CREDIT: SHELL_CREDIT },
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
  return sortToItemList(sortOrder, resultsMap);
}

export function filterType<T extends Record<string, string>>(items: IItem[], filterType: T): IItem[] {
  return items.filter((item) => Object.values(filterType).includes(item.name))
}

export function sortToItemList<T extends Record<string, string>>(
  sortOrder: T[],
  items: IItem[] | { [key: string]: IItem }
): IItem[] {
  const retMap = Array.isArray(items)
    ? Object.fromEntries(Object.values(items).map(item => [item.name, item]))
    : items;

  return sortOrder.flatMap(order =>
    Object.values(order).map(name => retMap[name]).filter(Boolean)
  );
}

export function calculateWaveplate(items: IItem[]): (number | string)[][] {
  const worldLevel = 8;
  const weeklyBossDropRates = WAVEPLATE_WEEKLY_BOSS[worldLevel > 7 ? 7 : worldLevel];
  const eliteBossDropRates = WAVEPLATE_ELITE_BOSS[worldLevel];
  const forgeryDropRates = WAVEPLATE_FORGERY[worldLevel > 7 ? 7 : worldLevel];

  // const tacetFieldsDropRates = WAVEPLATE_TACET_FIELDS[worldLevel];

  const simResonanceDropRates = WAVEPLATE_SIM_RESONANCE[worldLevel > 7 ? 7 : worldLevel];
  // const simEnergyDropRates = WAVEPLATE_SIM_ENERGY[worldLevel > 7 ? 7 : worldLevel];
  const simShellDropRates = WAVEPLATE_SIM_SHELL[worldLevel];

  const weeklyCount = getWeeklyCountFromList(items) / weeklyBossDropRates.WEEKLY;
  const eliteCount = getEliteCountFromList(items) / eliteBossDropRates.ELITE;
  const forgeryCount = getWeapon2CountFromList(items) / forgeryDropRates.WEAPON_2;

  let resonatorExpNeeded = getResonatorExpNeededFromList(items);
  resonatorExpNeeded -= weeklyCount * weeklyBossDropRates.RESONATOR_EXP;
  resonatorExpNeeded -= eliteCount * eliteBossDropRates.RESONATOR_EXP;
  const simResonatorCount = resonatorExpNeeded / simResonanceDropRates.RESONATOR_EXP;

  let shellNeeded = getShellFromItemList(items);
  shellNeeded -= weeklyCount * weeklyBossDropRates.SHELL;
  shellNeeded -= eliteCount * eliteBossDropRates.SHELL;
  shellNeeded -= forgeryCount * forgeryDropRates.SHELL;
  shellNeeded -= simResonatorCount * simResonanceDropRates.SHELL;
  const simShellCount = shellNeeded / simShellDropRates.SHELL

  return [
    ["shell", simShellCount, simShellCount * WAVEPLATE_SIM_SHELL_COST],
    ["weekly", weeklyCount, weeklyCount * WAVEPLATE_WEEKLY_BOSS_COST],
    ["elite", eliteCount, eliteCount * WAVEPLATE_ELITE_BOSS_COST],
    ["forgery", forgeryCount, forgeryCount * WAVEPLATE_FORGERY_COST],
    ["resonator exp", simResonatorCount, simResonatorCount * WAVEPLATE_SIM_RESONANCE_COST]
  ];
}

const getWeeklyCountFromList = (items: IItem[]): number => {
  return items
    .find((item) => Object.values(ItemWeeklyBoss).includes(item.name as ItemWeeklyBoss))
    ?.value ?? 0;
}

const getEliteCountFromList = (items: IItem[]): number => {
  return items
    .find((item) => Object.values(ItemEliteBoss).includes(item.name as ItemEliteBoss))
    ?.value ?? 0;
}

const getWeapon2CountFromList = (items: IItem[]): number => {
  return items
    .filter((item) => Object.values(ItemWeapon).includes(item.name as ItemWeapon))
    .map(item => (item.value ?? 0) * Math.pow(3, item.rarity - 2))
    .reduce((sum, item) => sum + item, 0);
}

const getResonatorExpNeededFromList = (items: IItem[]): number => {
  const vals = [1000, 3000, 8000, 20000];
  return items
    .filter((item) => Object.values(ItemResonatorEXP).includes(item.name as ItemResonatorEXP))
    .map(item => (item.value ?? 0) * vals[item.rarity - 2])
    .reduce((sum, item) => sum + item, 0);
}

const getShellFromItemList = (items: IItem[]): number => {
  return (items.find(item => item.name === SHELL_CREDIT)?.value) ?? 0;
}
