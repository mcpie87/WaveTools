import { IAPIItem, IAPIResonator } from "@/app/interfaces/api_interfaces";
import { getAscensions, InputEntry, ResonatorStateDBEntry } from "@/types/resonatorTypes";
import { getKeyFromEnumValue } from "@/utils/utils";
import { ASCENSION_MATERIALS, TALENT_INHERENT_MATERIALS, TALENT_MATERIALS, TALENT_SIDE_MATERIALS, TalentMaterialDataInterfaceEntry, TOTAL_LEVEL_EXPERIENCE } from "@/constants/character_ascension";
import { parseResonatorToPlanner } from "@/utils/api_parser";
import { ItemCommon, ItemResonatorEXP, ItemWeapon, ItemWeaponEXP, SHELL_CREDIT_ID } from "@/app/interfaces/item_types";
import { IResonatorPlanner } from "@/app/interfaces/resonator";
import { ActiveSkillNames, PassiveSkillNames, resonatorSchemaForForm } from "@/schemas/resonatorSchema";
import { findItemByName } from "./items_utils";

export const getMaterials = (
  resonatorEntry: ResonatorStateDBEntry,
  apiItems: IAPIItem[],
  apIAPIResonator: IAPIResonator
) => {
  const parsedResonator: IResonatorPlanner = parseResonatorToPlanner(apIAPIResonator);

  const requiredAscensions = getAscensions(resonatorEntry.level.current, resonatorEntry.level.desired);
  // item id -> amount of items needed
  const requiredMaterials: { [key: string]: number } = {};

  // Add all of the required ascension materials
  addAscensionMaterials(
    requiredMaterials,
    apiItems,
    requiredAscensions,
    parsedResonator
  );
  addResonatorEXP(requiredMaterials, apiItems, resonatorEntry);

  // Active talent materials
  for (const skill of Object.keys(ActiveSkillNames)) {
    const { current, desired } = resonatorEntry[skill as resonatorSchemaForForm] as InputEntry<number>;
    addTalentMaterials(requiredMaterials, apiItems, current, desired, parsedResonator, TALENT_MATERIALS);
  }

  // Passive skills
  for (const skill of Object.keys(PassiveSkillNames)) {
    const { current, desired } = resonatorEntry[skill as resonatorSchemaForForm] as InputEntry<number>;
    addTalentMaterials(
      requiredMaterials,
      apiItems,
      current,
      desired,
      parsedResonator,
      skill === getKeyFromEnumValue(PassiveSkillNames, PassiveSkillNames.inherent)
        ? TALENT_INHERENT_MATERIALS
        : TALENT_SIDE_MATERIALS
    );
  }
  return requiredMaterials;
}

const addResonatorEXP = (
  requiredMaterials: { [key: string]: number },
  items: IAPIItem[],
  resonatorEntry: ResonatorStateDBEntry
): void => {
  const { current, desired } = resonatorEntry.level;
  const parsedCurrent = parseInt(current as string);
  const parsedDesired = parseInt(desired as string);
  const expLeft = TOTAL_LEVEL_EXPERIENCE[parsedDesired] - TOTAL_LEVEL_EXPERIENCE[parsedCurrent];
  addEXP(requiredMaterials, items, expLeft, ItemResonatorEXP);
}

const addEXP = (
  requiredMaterials: { [key: string]: number },
  items: IAPIItem[],
  expLeft: number,
  expType: typeof ItemResonatorEXP | typeof ItemWeaponEXP
): void => {
  const potionValues = [20000, 8000, 3000, 1000];
  potionValues.forEach((value, idx) => {
    const count = idx === potionValues.length - 1
      ? Math.ceil(expLeft / value)
      : Math.floor(expLeft / value);
    expLeft -= count * value;
    const key = `RARITY_${5 - idx}` as keyof typeof expType;
    const itemId = findItemByName(expType[key], items)
    if (!itemId) {
      console.error(`addEXP ItemId not found for ${expType[key]}`);
      return;
    }
    requiredMaterials[itemId?.id] = count;
  });
  if (expLeft > 0) {
    throw new Error("Exp is higher than 0");
  }
}

const addAscensionMaterials = (
  requiredMaterials: { [key: string]: number },
  apiItems: IAPIItem[],
  requiredAscensions: number[],
  parsedResonator: IResonatorPlanner
): void => {
  for (const ascensionKey of requiredAscensions) {
    const {
      SHELL,
      ELITE_MATERIAL,
      SPECIALTY_MATERIAL,
      COMMON,
      COMMON_RARITY,
    } = ASCENSION_MATERIALS[ascensionKey];
    requiredMaterials[SHELL_CREDIT_ID] = (requiredMaterials[SHELL_CREDIT_ID] ?? 0) + SHELL;
    if (ELITE_MATERIAL) {
      const eliteMats = (parsedResonator.name.includes("Rover")) ? 1 : ELITE_MATERIAL;
      requiredMaterials[parsedResonator.eliteMaterial.id] = (requiredMaterials[parsedResonator.eliteMaterial.id] ?? 0) + eliteMats;
    }
    const commonMaterial = getCommonMaterial(parsedResonator.commonMaterial.name, COMMON_RARITY);
    const commonMaterialEntry = findItemByName(commonMaterial, apiItems);
    if (commonMaterialEntry) {
      requiredMaterials[commonMaterialEntry.id] = (requiredMaterials[commonMaterialEntry.id] ?? 0) + COMMON;
    }
    if (SPECIALTY_MATERIAL) {
      requiredMaterials[parsedResonator.specialtyMaterial.id] = (requiredMaterials[parsedResonator.specialtyMaterial.id] ?? 0) + SPECIALTY_MATERIAL;
    }
  }
}

const addTalentMaterials = (
  requiredMaterials: { [key: string]: number },
  apiItems: IAPIItem[],
  from: number,
  to: number,
  parsedResonator: IResonatorPlanner,
  talentMap: { [key: number]: TalentMaterialDataInterfaceEntry }
): void => {
  for (let i = from + 1; i <= to; ++i) {
    const {
      SHELL,
      WEEKLY_MATERIAL,
      WEAPON_MATERIAL,
      WEAPON_RARITY,
      COMMON_MATERIAL,
      COMMON_RARITY,
    } = talentMap[i];
    requiredMaterials[SHELL_CREDIT_ID] = (requiredMaterials[SHELL_CREDIT_ID] ?? 0) + SHELL;
    if (WEEKLY_MATERIAL) {
      requiredMaterials[parsedResonator.weeklyMaterial.id] = (requiredMaterials[parsedResonator.weeklyMaterial.id] ?? 0) + WEEKLY_MATERIAL;
    }
    const weaponMaterial = getWeaponMaterial(parsedResonator.weaponMaterial.name, WEAPON_RARITY);
    const weaponMaterialEntry = findItemByName(weaponMaterial, apiItems);
    if (weaponMaterialEntry) {
      requiredMaterials[weaponMaterialEntry.id] = (requiredMaterials[weaponMaterialEntry.id] ?? 0) + WEAPON_MATERIAL;
    }
    const commonMaterial = getCommonMaterial(parsedResonator.commonMaterial.name, COMMON_RARITY);
    const commonMaterialEntry = findItemByName(commonMaterial, apiItems);
    if (commonMaterialEntry) {
      requiredMaterials[commonMaterialEntry.id] = (requiredMaterials[commonMaterialEntry.id] ?? 0) + COMMON_MATERIAL;
    }
  }
}

const getWeaponMaterial = (type: ItemWeapon, rarity: number): ItemWeapon => {
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
  const key = `${retType}_RARITY_${rarity}` as keyof typeof ItemWeapon;
  return ItemWeapon[key];
}

const getCommonMaterial = (type: ItemCommon, rarity: number): ItemCommon => {
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
  const key = `${retType}_RARITY_${rarity}` as keyof typeof ItemCommon;
  return ItemCommon[key];
}