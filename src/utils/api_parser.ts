import { IItemEntry, IAPIResonator, IAPIItem, IAPIWeapon, IAPIPlannerElement } from "@/app/interfaces/api_interfaces";
import { IItem } from "@/app/interfaces/item";
import { ItemEliteBoss, ItemWeapon, ItemWeeklyBoss, ItemCommon, ItemSpecialty } from "@/app/interfaces/item_types";
import { IResonatorPlanner, IResonatorUpgradeItem } from "@/app/interfaces/resonator";
import { IWeaponPlanner } from "@/app/interfaces/weapon";
import { ResonatorStateDBEntry } from "@/types/resonatorTypes";
import { WeaponStateDBEntry } from "@/types/weaponTypes";

const enum LOOKUP_TYPE {
  Ascension,
  Talent
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

export function parseResonatorToPlanner(
  data: IAPIResonator,
  dbEntry: ResonatorStateDBEntry
): IResonatorPlanner {
  return {
    name: data.name,
    rarity: data.rarity,
    icon: data.icon.circle,
    priority: dbEntry.priority,
    weeklyMaterial: findMaterial(data, ItemWeeklyBoss, LOOKUP_TYPE.Talent),
    eliteMaterial: findMaterial(data, ItemEliteBoss, LOOKUP_TYPE.Ascension),
    specialtyMaterial: findMaterial(data, ItemSpecialty, LOOKUP_TYPE.Ascension),
    weaponMaterial: findMaterial(data, ItemWeapon, LOOKUP_TYPE.Talent),
    commonMaterial: findMaterial(data, ItemCommon, LOOKUP_TYPE.Talent),
  }
}

export function parseWeaponToPlanner(
  data: IAPIWeapon,
  dbEntry: WeaponStateDBEntry
): IWeaponPlanner {
  return {
    name: data.name,
    rarity: data.rarity,
    icon: data.icon.default,
    weaponMaterial: findMaterial(data, ItemWeapon, LOOKUP_TYPE.Ascension),
    commonMaterial: findMaterial(data, ItemCommon, LOOKUP_TYPE.Ascension),
    priority: dbEntry.priority,
  }
}


function findMaterial<T extends Record<string, string>>(
  data: IAPIResonator | IAPIWeapon,
  materialEnum: T,
  lookup: LOOKUP_TYPE
): IResonatorUpgradeItem<T[keyof T]> {
  const materials = lookup === LOOKUP_TYPE.Ascension
    ? getAscensionMaterials(data)
    : getTalentMaterials(data as IAPIResonator);

  for (const { id, name } of materials) {
    if (Object.values(materialEnum).includes(name as T[keyof T])) {
      return {
        id: id,
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
