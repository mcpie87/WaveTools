import { IAPIItem } from "@/app/interfaces/api_interfaces";
import { IItem } from "@/app/interfaces/item";
import { parseItemToItemCard } from "./api_parser";
import { ItemEliteBoss, ItemResonatorEXP, ItemWeapon, ItemWeaponEXP, ItemWeeklyBoss, SHELL_CREDIT } from "@/app/interfaces/item_types";
import { WAVEPLATE_ELITE_BOSS, WAVEPLATE_ELITE_BOSS_COST, WAVEPLATE_FORGERY, WAVEPLATE_FORGERY_COST, WAVEPLATE_SIM_ENERGY, WAVEPLATE_SIM_ENERGY_COST, WAVEPLATE_SIM_RESONANCE, WAVEPLATE_SIM_RESONANCE_COST, WAVEPLATE_SIM_SHELL, WAVEPLATE_SIM_SHELL_COST, WAVEPLATE_WEEKLY_BOSS, WAVEPLATE_WEEKLY_BOSS_COST } from "@/constants/waveplate_usage";
import { WaveplateEntry } from "@/components/WaveplateComponent";

export function findItemByName(name: string, items: IAPIItem[]): IAPIItem | undefined {
  return items.find(item => item.name === name);
}
export function findItemsByNames(names: string[], items: IAPIItem[]): IAPIItem[] {
  return items.filter(item => names.includes(item.name));
}

export function convertItemMapToItemList(
  apiItems: IAPIItem[],
  mappedItems: { [key: string]: number },
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
    results.push(parsedItem);
  }

  return removeZeroes
    ? results.filter(item => (item.value ?? 0) > 0)
    : results;
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

  let resonatorExpNeeded = getResonatorExpNeededFromList(items);
  resonatorExpNeeded -= weeklyCount * weeklyBossDropRates.RESONATOR_EXP;
  resonatorExpNeeded -= eliteCount * eliteBossDropRates.RESONATOR_EXP;
  const simResonatorCount = resonatorExpNeeded / simResonanceDropRates.RESONATOR_EXP;

  let weaponExpNeeded = getWeaponExpNeededFromList(items);
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
    runCount,
    waveplateCount: runCount * cost
  }
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

const getWeaponExpNeededFromList = (items: IItem[]): number => {
  const vals = [1000, 3000, 8000, 20000];
  return items
    .filter((item) => Object.values(ItemWeaponEXP).includes(item.name as ItemWeaponEXP))
    .map(item => (item.value ?? 0) * vals[item.rarity - 2])
    .reduce((sum, item) => sum + item, 0);
}

const getShellFromItemList = (items: IItem[]): number => {
  return (items.find(item => item.name === SHELL_CREDIT)?.value) ?? 0;
}
