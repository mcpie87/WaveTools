import { IAPIItem, IAPIResonator, IAPIWeapon } from "@/app/interfaces/api_interfaces";
import { getAscensions, InputEntry, ResonatorDBSchema, ResonatorStateDBEntry } from "@/types/resonatorTypes";
import { getKeyFromEnumValue } from "@/utils/utils";
import { RESONATOR_ASCENSION_MATERIALS, RESONATOR_EXP_TO_SHELL_RATIO, TALENT_INHERENT_MATERIALS, TALENT_MATERIALS, TALENT_SIDE_MATERIALS, TalentMaterialDataInterfaceEntry, TOTAL_LEVEL_EXPERIENCE, TOTAL_WEAPON_EXP, WEAPON_ASCENSION_MATERIALS, WEAPON_EXP_TO_SHELL_RATIO } from "@/constants/character_ascension";
import { ItemResonatorEXP, ItemType, ItemTypeEXP, ItemWeaponEXP, SHELL_CREDIT_ID } from "@/app/interfaces/item_types";
import { ActiveSkillNames, PassiveSkillNames, resonatorSchemaForForm } from "@/schemas/resonatorSchema";
import { findItemByName, getCommonMaterial, getSynthesisItems, getWeaponMaterial } from "./items_utils";
import { IResonatorPlanner, IWeaponPlanner, PLANNER_TYPE, IRequiredItemMap } from "@/app/interfaces/planner_item";
import { WeaponDBSchema } from "@/types/weaponTypes";
import { parseResonatorToPlanner, parseWeaponToPlanner } from "./api_parser";
import { IItem, TItemMap } from "@/app/interfaces/item";
import { InventoryDBSchema, InventoryStateDBEntry } from "@/types/inventoryTypes";
import { EXP_POTION_VALUES_DESC } from "@/constants/constants";

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
    const resonator = apiResonators.find(e => e.name === name);
    if (!resonator) {
      throw new Error(`Resonator not present in API ${name}`);
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

// THIS MUTATES ITEMLIST AND INVENTORY
// it is meant to be mutated
export const setItemsBasedOnInventory = (itemMap: TItemMap, inventory: InventoryDBSchema): TItemMap => {
  for (const [name, item] of itemMap) {
    if (!inventory[name]) {
      continue;
    }

    const inventoryItem = inventory[name];
    if (inventoryItem.owned >= item.value!) {
      inventoryItem.owned -= item.value!;
      item.value = 0;
      item.checked = true;
    } else {
      item.value! -= inventoryItem.owned;
      inventoryItem.owned = 0;
    }
  }

  applyEXPConversion(ItemType.RESONATOR_EXP, itemMap, inventory);
  applyEXPConversion(ItemType.WEAPON_EXP, itemMap, inventory);
  applySynthesizerOnItems(itemMap, inventory);
  return itemMap;
}

const getEXPItems = (type: ItemTypeEXP): string[] => {
  return type === ItemType.RESONATOR_EXP
    ? Object.values(ItemResonatorEXP)
    : Object.values(ItemWeaponEXP);
}

const calculateItemConversions = (
  item: IItem,
  baseValue: number,
  inventoryItems: InventoryStateDBEntry[],
): void => {
  if (!item || item.value === 0) return;

  item.converted = 0;

  EXP_POTION_VALUES_DESC.forEach((value, index) => {
    const inv = inventoryItems[index];
    if (!inv || inv.owned === 0) return;

    const neededPotions = item.value! - (item.converted ?? 0);
    const maxConvertible = Math.floor((inv.owned * value) / baseValue);
    const conversions = Math.min(neededPotions, maxConvertible);

    if (conversions <= 0) return;

    const itemsToConsume = Math.ceil((conversions * baseValue) / value);
    inv.owned -= itemsToConsume;
    item.converted! += conversions;
  });

  if (item.converted === 0) {
    item.converted = undefined;
  }
};

export const applyEXPConversion = (
  type: ItemTypeEXP,
  itemMap: TItemMap,
  inventory: InventoryDBSchema
): TItemMap => {
  if (![ItemType.RESONATOR_EXP, ItemType.WEAPON_EXP].includes(type)) {
    // Function doesn't support non exp values
    return itemMap;
  }

  // Rarities: 5, 4, 3, 2 (descending)
  const expItems = getEXPItems(type);

  const inventoryItems = expItems.map((name) => inventory[name]);
  if (inventoryItems.some(e => !e)) {
    // Inventory does not contain properly defined exp items
    return itemMap;
  }

  const items = expItems.map((name) => itemMap.get(name)).filter(item => item !== undefined);

  items.forEach((item, index) => {
    calculateItemConversions(item, EXP_POTION_VALUES_DESC[index], inventoryItems);
  });

  return itemMap;
}

// This only applies synthesised materials
// Use this function only AFTER you've subtracted all of the owned mats
export const applySynthesizerOnItems = (itemMap: TItemMap, inventory: InventoryDBSchema): TItemMap => {
  const processedItems = new Set<string>();
  for (const [name, item] of itemMap) {
    if (processedItems.has(name)) {
      continue;
    }

    const synthesisItems = getSynthesisItems(item);
    if (synthesisItems.length === 0) {
      processedItems.add(name);
    } else if (synthesisItems.length === 4) {
      // Works only for common / weapon for now
      // Order is [2, 3, 4, 5] based on rarity
      const rarity3: IItem | undefined = itemMap.get(synthesisItems[1]);
      const rarity4: IItem | undefined = itemMap.get(synthesisItems[2]);
      const rarity5: IItem | undefined = itemMap.get(synthesisItems[3]);

      const inventoryRarity2 = inventory[synthesisItems[0]];
      const inventoryRarity3 = inventory[synthesisItems[1]];
      const inventoryRarity4 = inventory[synthesisItems[2]];

      // We assume that item subtraction was already done
      if (rarity3 && rarity3.value! > 0) {
        synthesize(inventoryRarity2, rarity3);
      }
      if (rarity4 && rarity4.value! > 0) {
        synthesize(inventoryRarity3, rarity4);
        synthesize(inventoryRarity2, rarity4);
      }
      if (rarity5 && rarity5.value! > 0) {
        synthesize(inventoryRarity4, rarity5);
        synthesize(inventoryRarity3, rarity5);
        synthesize(inventoryRarity2, rarity5);
      }

      for (const item of synthesisItems) {
        processedItems.add(item);
      }
    }
  }

  return itemMap;
}

const synthesize = (
  sourceItem: InventoryStateDBEntry,
  targetItem: IItem
) => {
  if (!sourceItem) {
    return;
  }
  const multiplier = 3 ** (targetItem.rarity - sourceItem.rarity);
  if (sourceItem.owned < multiplier) {
    // We don't have enough to bother, skip
    return;
  }

  if (targetItem.value! === targetItem.converted) {
    // Item already converted, skip
    return;
  }

  const maxConverted = Math.floor(sourceItem.owned / multiplier);
  targetItem.converted ??= 0;

  if (targetItem.value! - targetItem.converted! >= maxConverted) {
    // We don't have enough
    targetItem.converted += maxConverted;
    sourceItem.owned -= multiplier * maxConverted;
  } else {
    // We have enough, remove .value from inventory
    const converted = targetItem.value! - targetItem.converted!;
    targetItem.converted += converted;
    sourceItem.owned -= converted * multiplier;
  }

  if (targetItem.value! === targetItem.converted!) {
    targetItem.checked = true;
  }
}

export const getMaterials = (
  plannerItem: IResonatorPlanner | IWeaponPlanner,
  apiItems: IAPIItem[],
): IRequiredItemMap => {
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
