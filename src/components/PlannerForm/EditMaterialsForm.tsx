import { InventoryDBSchema } from "@/types/inventoryTypes";
import { ModalComponent } from "./ModalComponent";
import { IItem } from "@/app/interfaces/item";
import { usePlannerFormContext } from "@/context/PlannerFormContext";
import { getCommonMaterial, getItemType, getWeaponMaterial } from "@/utils/items_utils";
import { ItemCommon, ItemEchoEXP, ItemEliteBoss, ItemResonatorEXP, ItemSpecialty, ItemType, ItemWeapon, ItemWeaponEXP, ItemWeeklyBoss, SHELL_CREDIT } from "@/app/interfaces/item_types";
import { useData } from "@/context/DataContext";
import { useState } from "react";
import { InputInventoryItem } from "../InputInventoryItem";
import { Button } from "../ui/button";
import { getAPIItems, parseItemToItemCard } from "@/utils/api_parser";
import { getInventoryEntry } from "@/utils/inventory_utils";

interface EditSelectedMaterialsFormProps {
  onSubmit: (data: InventoryDBSchema) => void;
  inventory: InventoryDBSchema;
  onClose: () => void;
}
export const EditSelectedMaterialsForm = ({
  onSubmit,
  inventory,
  onClose,
}: EditSelectedMaterialsFormProps) => {
  const [formData, setFormData] = useState<InventoryDBSchema>(inventory);
  const { selectedItem } = usePlannerFormContext();

  const { data, error, loading } = useData();
  if (loading) return (<div>Loading...</div>);
  if (!data) return (<div>Data is not present</div>);
  if (error) return (<div>Error present: {error.message}</div>);
  const { items: apiItems } = data;

  if (!selectedItem) return null;

  const relatedItems = getRelatedItems(selectedItem, 8);
  const displayedItems = getAPIItems(relatedItems, apiItems).map(item => parseItemToItemCard(item));
  const inventoryRowCount = getInventoryRowCount(selectedItem);
  const handleSubmit = () => {
    onSubmit(formData);
  }

  return (
    <ModalComponent show={true} onClose={onClose}>
      <div className="flex flex-col justify-center">
        <div className="text-center">Update selected group</div>
        <div className="flex flex-row">
          {/* <ItemCard item={selectedItem} /> */}
          {displayedItems.map(item => (
            <InputInventoryItem
              key={item.name}
              value={getInventoryEntry(item, formData).owned}
              item={item}
              displayedExtraRows={inventoryRowCount}
              setValue={(value) => {
                setFormData(prev => ({
                  ...prev,
                  [item.name]: {
                    ...getInventoryEntry(item, prev),
                    owned: value
                  }
                }))
              }}
            />
          ))}
        </div>
        <Button
          type="submit"
          onClick={handleSubmit}
        >
          Submit
        </Button>
      </div>
    </ModalComponent>
  )
}

// TODO: return proper type instead of string
const getRelatedItems = (item: IItem, worldLevel: number): string[] => {
  const itemType = getItemType(item);

  switch (itemType) {
    case ItemType.SHELL_CREDIT:
      return [SHELL_CREDIT];
    case ItemType.COMMON:
      return getCommonMaterial(item.name as ItemCommon, [5, 4, 3, 2]);
    case ItemType.WEAPON:
      return getWeaponMaterial(item.name as ItemWeapon, [5, 4, 3, 2]);
    case ItemType.WEEKLY_BOSS:
      return [
        item.name as ItemWeeklyBoss,
        worldLevel > 3 ? ItemEchoEXP.RARITY_4 : ItemEchoEXP.RARITY_3,
        worldLevel > 3 ? ItemWeaponEXP.RARITY_4 : ItemWeaponEXP.RARITY_3,
      ];
    case ItemType.ELITE_BOSS:
      return [
        item.name as ItemEliteBoss,
        worldLevel > 3 ? ItemEchoEXP.RARITY_4 : ItemEchoEXP.RARITY_3,
        worldLevel > 3 ? ItemResonatorEXP.RARITY_4 : ItemResonatorEXP.RARITY_3,
        worldLevel > 3 ? ItemWeaponEXP.RARITY_4 : ItemWeaponEXP.RARITY_3,
      ];
    case ItemType.SPECIALTY:
      return [item.name as ItemSpecialty];
    case ItemType.RESONATOR_EXP:
      return Object.values(ItemResonatorEXP);
    case ItemType.WEAPON_EXP:
      return Object.values(ItemWeaponEXP);
    default:
      throw new Error(`Invalid item type ${itemType}`);
  }
}

const getInventoryRowCount = (item: IItem) => {
  const itemType = getItemType(item);

  switch (itemType) {
    case ItemType.SHELL_CREDIT: return 1;
    case ItemType.COMMON: return 2;
    case ItemType.WEAPON: return 2;
    case ItemType.WEEKLY_BOSS: return 1;
    case ItemType.ELITE_BOSS: return 1;
    case ItemType.SPECIALTY: return 1;
    case ItemType.RESONATOR_EXP: return 2;
    case ItemType.WEAPON_EXP: return 2;
    default:
      throw new Error(`Invalid item type ${itemType}`);
  }
}