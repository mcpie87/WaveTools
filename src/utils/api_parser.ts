import { IItemEntry, IAPIResonator, IAPIItem, IAPIWeapon, IAPIPlannerElement } from "@/app/interfaces/api_interfaces";
import { IItem } from "@/app/interfaces/item";
import { ItemEliteBoss, ItemWeapon, ItemWeeklyBoss, ItemCommon, ItemSpecialty } from "@/app/interfaces/item_types";
import { IPlannerUpgradeItem, IResonatorPlanner, IWeaponPlanner, PLANNER_TYPE } from "@/app/interfaces/planner_item";
import { ResonatorStateDBEntry } from "@/types/resonatorTypes";
import { WeaponStateDBEntry } from "@/types/weaponTypes";
import { getMaterials } from "./planner_utils";

const enum LOOKUP_TYPE {
  Ascension,
  Talent
}

// Pass only names
export function getAPIItems(items: string[], apiItems: IAPIItem[]): IAPIItem[] {
  const results: IAPIItem[] = [];
  for (const item of items) {
    const apiItem = apiItems.find(apiItem => item === apiItem.name);
    if (!apiItem) {
      console.error(`apiItem not found ${item}`);
      continue;
    }
    results.push(apiItem);
  }
  return results;
}


export function parseItemToItemCard(data: IAPIItem): IItem {
  return {
    id: data.id,
    name: data.name,
    rarity: data.rarity,
    icon: data.icon,
    icon_middle: data.icon_middle,
    icon_small: data.icon_small,
    attributes_description: data.attributes_description,
    bg_description: data.bg_description,
  }
}

export function parseAPIDataToPlanner(
  dbEntry: ResonatorStateDBEntry | WeaponStateDBEntry,
  apiItems: IAPIItem[],
  apiData: IAPIResonator | IAPIWeapon,
): IResonatorPlanner | IWeaponPlanner {
  if (dbEntry.type === PLANNER_TYPE.RESONATOR) {
    return parseResonatorToPlanner(dbEntry as ResonatorStateDBEntry, apiItems, apiData as IAPIResonator);
  }
  return parseWeaponToPlanner(dbEntry as WeaponStateDBEntry, apiItems, apiData as IAPIWeapon);
}

export function parseResonatorToPlanner(
  dbEntry: ResonatorStateDBEntry,
  apiItems: IAPIItem[],
  data: IAPIResonator,
): IResonatorPlanner {
  const resonatorItem: IResonatorPlanner = {
    type: PLANNER_TYPE.RESONATOR,
    name: data.name,
    rarity: data.rarity,
    icon: data.icon.circle,
    priority: dbEntry.priority,
    weeklyMaterial: findMaterial(data, ItemWeeklyBoss, LOOKUP_TYPE.Talent),
    eliteMaterial: findMaterial(data, ItemEliteBoss, LOOKUP_TYPE.Ascension),
    specialtyMaterial: findMaterial(data, ItemSpecialty, LOOKUP_TYPE.Ascension),
    weaponMaterial: findMaterial(data, ItemWeapon, LOOKUP_TYPE.Talent),
    commonMaterial: findMaterial(data, ItemCommon, LOOKUP_TYPE.Talent),
    dbData: dbEntry,
  }
  // for display calculations
  resonatorItem.requiredMaterials = getMaterials(resonatorItem, apiItems);
  return resonatorItem;
}

export function parseWeaponToPlanner(
  dbEntry: WeaponStateDBEntry,
  apiItems: IAPIItem[],
  data: IAPIWeapon,
): IWeaponPlanner {

  const weaponItem: IWeaponPlanner = {
    type: PLANNER_TYPE.WEAPON,
    name: data.name,
    rarity: data.rarity,
    icon: data.icon.default,
    weaponMaterial: findMaterial(data, ItemWeapon, LOOKUP_TYPE.Ascension),
    commonMaterial: findMaterial(data, ItemCommon, LOOKUP_TYPE.Ascension),
    priority: dbEntry.priority,

    // for display calculations
    dbData: dbEntry,
    orderId: dbEntry.orderId,
  }
  weaponItem.requiredMaterials = getMaterials(weaponItem, apiItems);
  return weaponItem;
}


function findMaterial<T extends Record<string, string>>(
  data: IAPIResonator | IAPIWeapon,
  materialEnum: T,
  lookup: LOOKUP_TYPE
): IPlannerUpgradeItem<T[keyof T]> {
  const materials = lookup === LOOKUP_TYPE.Ascension
    ? getAscensionMaterials(data)
    : getTalentMaterials(data as IAPIResonator);
  for (const { id, name } of materials) {
    if (Object.values(materialEnum).includes(name as T[keyof T])) {
      return {
        id,
        name: name as T[keyof T]
      };
    }
  }

  throw new Error(`${materialEnum.name} not found`);
}

function getAscensionMaterials(data: IAPIPlannerElement): IItemEntry[] {
  const materials = data.ascensionMaterials
  if (materials.length != 7) {
    throw new Error("Unrecognized length of ascension material ranks");
  }
  return materials[6].items;
}

function getTalentMaterials(data: IAPIResonator): IItemEntry[] {
  const materials = data.talentMaterials.inherentSecond.levels[1];
  if (!materials) {
    throw new Error("Upgrade materials not found for inherent skill");
  }
  return materials;
}
