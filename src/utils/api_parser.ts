import { IItemEntry, IResonator } from "@/app/interfaces/api_interfaces";
import { ItemEliteBoss, ItemWeapon, ItemWeeklyBoss, ItemCommon, ItemSpecialty } from "@/app/interfaces/item_types";
import { IResonatorPlanner } from "@/app/interfaces/resonator";

const enum LOOKUP_TYPE {
  Ascension,
  Talent
}

export function parseResonatorToPlanner(data: IResonator): IResonatorPlanner {
  return {
    name: data.name,
    rarity: data.rarity,
    icon: data.icon.circle,
    weeklyMaterial: findMaterial(data, ItemWeeklyBoss, LOOKUP_TYPE.Talent),
    eliteMaterial: findMaterial(data, ItemEliteBoss, LOOKUP_TYPE.Ascension),
    specialtyMaterial: findMaterial(data, ItemSpecialty, LOOKUP_TYPE.Ascension),
    weaponMaterial: findMaterial(data, ItemWeapon, LOOKUP_TYPE.Talent),
    commonMaterial: findMaterial(data, ItemCommon, LOOKUP_TYPE.Talent),
  }
}

function findMaterial<T extends Record<string, string>>(
  data: IResonator,
  materialEnum: T,
  lookup: LOOKUP_TYPE
): T[keyof T] {
  const materials = lookup === LOOKUP_TYPE.Ascension
    ? getAscensionMaterials(data)
    : getTalentMaterials(data);

  for (const { name } of materials) {
    if (Object.values(materialEnum).includes(name as T[keyof T])) {
      return name as T[keyof T];
    }
  }

  throw new Error(`${materialEnum.name} not found`);
}

function getAscensionMaterials(data: IResonator): IItemEntry[] {
  const materials = data.materials.ascension;
  if (materials.length != 7) {
    throw new Error("Unrecognized length of ascension material ranks");
  }
  return materials[6].items;
}

function getTalentMaterials(data: IResonator): { name: string }[] {
  const materials = data.materials.talents.inherentSecond.levels[1];
  if (!materials) {
    throw new Error("Upgrade materials not found for inherent skill");
  }
  return materials;
}
