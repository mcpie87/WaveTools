import { IItem } from "@/app/interfaces/item";
import { InventoryDBSchema, InventoryStateDBEntry } from "@/types/inventoryTypes";

// Prevention against undefined entries
export const getInventoryEntry = (
  item: IItem,
  formData: InventoryDBSchema
): InventoryStateDBEntry => {
  if (formData[item.name]) return formData[item.name];

  const newEntry: InventoryStateDBEntry = {
    id: item.id,
    name: item.name,
    rarity: item.rarity,
    owned: 0,
  };
  return newEntry;
};