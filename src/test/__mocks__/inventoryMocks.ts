import { ItemResonatorEXP, ItemWeapon } from "@/app/interfaces/item_types";

export const inventoryForSynthesis = {
  [ItemWeapon.SWORD_RARITY_2]: { id: 1, name: ItemWeapon.SWORD_RARITY_2, rarity: 2, owned: 0 },
  [ItemWeapon.SWORD_RARITY_3]: { id: 2, name: ItemWeapon.SWORD_RARITY_3, rarity: 3, owned: 0 },
  [ItemWeapon.SWORD_RARITY_4]: { id: 3, name: ItemWeapon.SWORD_RARITY_4, rarity: 4, owned: 0 },
  [ItemWeapon.SWORD_RARITY_5]: { id: 4, name: ItemWeapon.SWORD_RARITY_5, rarity: 5, owned: 0 },
};

export const inventoryForResonatorExpConversion = {
  [ItemResonatorEXP.RARITY_5]: { id: 1, name: ItemResonatorEXP.RARITY_5, rarity: 5, owned: 0 },
  [ItemResonatorEXP.RARITY_4]: { id: 2, name: ItemResonatorEXP.RARITY_4, rarity: 4, owned: 0 },
  [ItemResonatorEXP.RARITY_3]: { id: 3, name: ItemResonatorEXP.RARITY_3, rarity: 3, owned: 0 },
  [ItemResonatorEXP.RARITY_2]: { id: 4, name: ItemResonatorEXP.RARITY_2, rarity: 2, owned: 0 },
};