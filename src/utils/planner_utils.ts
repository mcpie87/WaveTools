import { IAPIItem, IAPIResonator, IAPIWeapon } from "@/app/interfaces/api_interfaces";
import { getAscensions, InputEntry, ResonatorDBSchema, ResonatorStateDBEntry } from "@/types/resonatorTypes";
import { getKeyFromEnumValue } from "@/utils/utils";
import { RESONATOR_ASCENSION_MATERIALS, RESONATOR_EXP_TO_SHELL_RATIO, TALENT_INHERENT_MATERIALS, TALENT_MATERIALS, TALENT_SIDE_MATERIALS, TalentMaterialDataInterfaceEntry, TOTAL_LEVEL_EXPERIENCE, TOTAL_WEAPON_EXP, WEAPON_ASCENSION_MATERIALS, WEAPON_EXP_TO_SHELL_RATIO } from "@/constants/character_ascension";
import { ItemCommon, ItemResonatorEXP, ItemWeapon, ItemWeaponEXP, SHELL_CREDIT_ID } from "@/app/interfaces/item_types";
import { ActiveSkillNames, PassiveSkillNames, resonatorSchemaForForm } from "@/schemas/resonatorSchema";
import { findItemByName } from "./items_utils";
import { IResonatorPlanner, IWeaponPlanner, PLANNER_TYPE, TItemMap } from "@/app/interfaces/planner_item";
import { WeaponDBSchema } from "@/types/weaponTypes";
import { parseResonatorToPlanner, parseWeaponToPlanner } from "./api_parser";

export const getPlannerDBSize = (
  dbResonators: ResonatorDBSchema,
  dbWeapons: WeaponDBSchema
) => {
  return Object.keys(dbResonators).length + Object.values(dbWeapons).flat().length;
}

export const getPlannerItems = (
  dbResonators: ResonatorDBSchema,
  apiResonators: IAPIResonator[],
  dbWeapons: WeaponDBSchema,
  apiWeapons: IAPIWeapon[],
  apiItems: IAPIItem[],
): (IResonatorPlanner | IWeaponPlanner)[] => {
  const resonatorItems: IResonatorPlanner[] = Object.keys(dbResonators).map(name => {
    let resonator = apiResonators.find(e => e.name === name);
    if (!resonator) {
      console.log("Resonator not found, searching for rover");
      resonator = apiResonators.find(e => e.name === name.replace("-", ": "));
      if (!resonator) {
        throw new Error(`Resonator not present in API ${name}`);
      }
    }
    return parseResonatorToPlanner(dbResonators[name], apiItems, resonator);
  });

  const weaponItems: IWeaponPlanner[] = Object.values(dbWeapons).flat().map(dbWeapon => {
    const weapon = apiWeapons.find(e => e.name === dbWeapon.name);
    if (!weapon) {
      throw new Error(`Weapon not present in API ${dbWeapon.name}`);
    }
    return parseWeaponToPlanner(dbWeapon, apiItems, weapon);
  });

  return [...resonatorItems, ...weaponItems].sort((a, b) => a.priority - b.priority);
}

export const getMaterials = (
  plannerItem: IResonatorPlanner | IWeaponPlanner,
  apiItems: IAPIItem[],
): TItemMap => {
  const requiredAscensions = getAscensions(plannerItem.dbData.level.current, plannerItem.dbData.level.desired);
  // item id -> amount of items needed
  const reqMats: { [key: string]: number } = {};

  // Add all of the required ascension materials
  addAscensionMaterials(
    reqMats,
    apiItems,
    requiredAscensions,
    plannerItem
  );
  if (plannerItem.type === PLANNER_TYPE.WEAPON) {
    addWeaponEXP(reqMats, apiItems, plannerItem);
    return reqMats;
  }

  const resonatorEntry = plannerItem as IResonatorPlanner; // TODO: handle this typescript hack
  const dbData = resonatorEntry.dbData as ResonatorStateDBEntry;
  addResonatorEXP(reqMats, apiItems, plannerItem);

  // Active talent materials
  for (const skill of Object.keys(ActiveSkillNames)) {
    const { current, desired } = (dbData[skill as resonatorSchemaForForm]) as InputEntry<number>;
    addTalentMaterials(reqMats, apiItems, current, desired, resonatorEntry, TALENT_MATERIALS);
  }

  // Passive skills
  for (const skill of Object.keys(PassiveSkillNames)) {
    const { current, desired } = (dbData[skill as resonatorSchemaForForm]) as InputEntry<number>;
    addTalentMaterials(
      reqMats,
      apiItems,
      current,
      desired,
      resonatorEntry,
      skill === getKeyFromEnumValue(PassiveSkillNames, PassiveSkillNames.inherent)
        ? TALENT_INHERENT_MATERIALS
        : TALENT_SIDE_MATERIALS
    );
  }
  return reqMats;
}

const addResonatorEXP = (
  requiredMaterials: { [key: string]: number },
  items: IAPIItem[],
  resonatorEntry: IResonatorPlanner
): void => {
  const { current, desired } = resonatorEntry.dbData.level;
  const parsedCurrent = parseInt(current as string);
  const parsedDesired = parseInt(desired as string);
  const expLeft = TOTAL_LEVEL_EXPERIENCE[parsedDesired] - TOTAL_LEVEL_EXPERIENCE[parsedCurrent];
  addEXP(requiredMaterials, items, expLeft, ItemResonatorEXP);
}

const addWeaponEXP = (
  requiredMaterials: { [key: string]: number },
  items: IAPIItem[],
  weaponEntry: IWeaponPlanner
): void => {
  const { current, desired } = weaponEntry.dbData.level;
  const parsedCurrent = parseInt(current as string);
  const parsedDesired = parseInt(desired as string);
  const currentExp = TOTAL_WEAPON_EXP[parsedCurrent][weaponEntry.rarity];
  const desiredExp = TOTAL_WEAPON_EXP[parsedDesired][weaponEntry.rarity];
  const expLeft = desiredExp - currentExp;
  addEXP(requiredMaterials, items, expLeft, ItemWeaponEXP);
}

const addEXP = (
  reqMats: { [key: string]: number },
  items: IAPIItem[],
  expLeft: number,
  expType: typeof ItemResonatorEXP | typeof ItemWeaponEXP
): void => {
  const potionValues = [20000, 8000, 3000, 1000];
  potionValues.forEach((value, idx) => {
    const count = idx === potionValues.length - 1
      ? Math.ceil(expLeft / value)
      : Math.floor(expLeft / value);
    const expForThisLevel = count * value;
    expLeft -= expForThisLevel;
    const key = `RARITY_${5 - idx}` as keyof typeof expType;
    const itemId = findItemByName(expType[key], items)
    if (!itemId) {
      console.error(`addEXP ItemId not found for ${expType[key]}`);
      return;
    }
    reqMats[itemId?.id] = count;

    // TODO: requires refinement due to overflows? maybe? 
    const shellRatio = expType === ItemWeaponEXP
      ? WEAPON_EXP_TO_SHELL_RATIO
      : RESONATOR_EXP_TO_SHELL_RATIO;
    reqMats[SHELL_CREDIT_ID] = (reqMats[SHELL_CREDIT_ID] ?? 0) + expForThisLevel * shellRatio;
  });
  if (expLeft > 0) {
    throw new Error("Exp is higher than 0");
  }
}

const addAscensionMaterials = (
  requiredMaterials: { [key: string]: number },
  apiItems: IAPIItem[],
  requiredAscensions: number[],
  plannerItem: IResonatorPlanner | IWeaponPlanner
): void => {
  for (const ascensionKey of requiredAscensions) {
    if (plannerItem.type === PLANNER_TYPE.RESONATOR) {
      addResonatorAscensionMaterials(requiredMaterials, apiItems, ascensionKey, plannerItem);
    } else {
      addWeaponAscensionMaterials(requiredMaterials, apiItems, ascensionKey, plannerItem);
    }
  }
}

const addResonatorAscensionMaterials = (
  reqMats: { [key: string]: number },
  apiItems: IAPIItem[],
  ascensionKey: number,
  resonatorItem: IResonatorPlanner
): void => {
  const {
    SHELL,
    ELITE_MATERIAL,
    SPECIALTY_MATERIAL,
    COMMON,
    COMMON_RARITY,
  } = RESONATOR_ASCENSION_MATERIALS[ascensionKey];

  reqMats[SHELL_CREDIT_ID] = (reqMats[SHELL_CREDIT_ID] ?? 0) + SHELL;
  if (ELITE_MATERIAL) {
    const eliteMats = (resonatorItem.name.includes("Rover")) ? 1 : ELITE_MATERIAL;
    reqMats[resonatorItem.eliteMaterial.id] = (reqMats[resonatorItem.eliteMaterial.id] ?? 0) + eliteMats;
  }
  const commonMaterial = getCommonMaterial(resonatorItem.commonMaterial.name, COMMON_RARITY);
  const commonMaterialEntry = findItemByName(commonMaterial, apiItems);
  if (commonMaterialEntry) {
    reqMats[commonMaterialEntry.id] = (reqMats[commonMaterialEntry.id] ?? 0) + COMMON;
  }
  if (SPECIALTY_MATERIAL) {
    reqMats[resonatorItem.specialtyMaterial.id] = (reqMats[resonatorItem.specialtyMaterial.id] ?? 0) + SPECIALTY_MATERIAL;
  }
}

const addWeaponAscensionMaterials = (
  reqMats: { [key: string]: number },
  apiItems: IAPIItem[],
  ascensionKey: number,
  weaponItem: IWeaponPlanner
): void => {
  const {
    SHELL,
    WEAPON_MATERIAL,
    WEAPON_RARITY,
    COMMON,
    COMMON_RARITY,
  } = WEAPON_ASCENSION_MATERIALS[weaponItem.rarity][ascensionKey];

  reqMats[SHELL_CREDIT_ID] = (reqMats[SHELL_CREDIT_ID] ?? 0) + SHELL;
  const weaponMaterial = getWeaponMaterial(weaponItem.weaponMaterial.name, WEAPON_RARITY);
  const weaponMaterialEntry = findItemByName(weaponMaterial, apiItems);
  if (weaponMaterialEntry) {
    reqMats[weaponMaterialEntry.id] = (reqMats[weaponMaterialEntry.id] ?? 0) + WEAPON_MATERIAL;
  }
  const commonMaterial = getCommonMaterial(weaponItem.commonMaterial.name, COMMON_RARITY);
  const commonMaterialEntry = findItemByName(commonMaterial, apiItems);
  if (commonMaterialEntry) {
    reqMats[commonMaterialEntry.id] = (reqMats[commonMaterialEntry.id] ?? 0) + COMMON;
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