import { ItemCommon, ItemEchoEXP, ItemEliteBoss, ItemResonatorEXP, ItemTuner, ItemWeapon, ItemWeaponEXP, ItemWeeklyBoss, SHELL_CREDIT } from "@/app/interfaces/item_types";
import { ModalComponent } from "./ModalComponent"
import { IAPIItem } from "@/app/interfaces/api_interfaces";
import { parseItemToItemCard } from "@/utils/api_parser";
import { sortToItemList } from "@/utils/items_utils";
import { InputInventoryItem } from "../InputInventoryItem";
import { useEffect, useState } from "react";
import { IItem } from "@/app/interfaces/item";
import { InventoryDBSchema } from "@/types/inventoryTypes";
import { Button } from "../ui/button";

interface InventoryFormProps {
  showForm: boolean;
  initialFormData: InventoryDBSchema;
  onClose: () => void;
  onSubmit: (data: InventoryDBSchema) => void;
  apiItems: IAPIItem[];
}
export const InventoryForm = ({
  showForm,
  initialFormData,
  onClose,
  onSubmit,
  apiItems
}: InventoryFormProps) => {
  const [formData, setFormData] = useState<InventoryDBSchema>(initialFormData);
  const [displayedItems, setDisplayedItems] = useState<IItem[]>([]);

  useEffect(() => {
    const displayedItemTypes = [
      { SHELL_CREDIT: SHELL_CREDIT },
      ItemWeeklyBoss,
      ItemEliteBoss,
      ItemEchoEXP,
      ItemTuner,
      ItemResonatorEXP,
      ItemWeapon,
      ItemWeaponEXP,
      ItemCommon,
    ];

    const predicate = (key: string): boolean => {
      return displayedItemTypes.some(itemType => Object.values(itemType).includes(key));
    }
    const convertedItems = sortToItemList(
      displayedItemTypes,
      apiItems,
      apiItems.filter((item) => predicate(item.name))
        .map(item => parseItemToItemCard(item))
    );
    // Need to sort rarity desc, id asc
    setDisplayedItems(
      [...convertedItems]
        .sort((a, b) => a.id - b.id)
        .sort((a, b) => b.rarity - a.rarity)
    );
    setFormData({
      ...Object.fromEntries(
        convertedItems.map(item => [item.name, {
          id: item.id,
          name: item.name,
          rarity: item.rarity,
          owned: 0,
        }])
      ),
      ...initialFormData
    })
  }, [showForm, initialFormData, apiItems])

  const handleSubmit = () => {
    onSubmit(formData);
  }

  return (
    <ModalComponent show={showForm} onClose={onClose}>
      <div className="flex flex-col w-[1000px]">
        <div className="text-center">Inventory</div>
        <div className="grid grid-cols-[repeat(auto-fit,minmax(100px,1fr))] gap-2">
          {displayedItems.map((item, idx) => (
            <InputInventoryItem
              key={idx}
              value={formData[item.name].owned}
              item={item}
              setValue={(value) =>
                setFormData(prev => ({
                  ...prev,
                  [item.name]: { ...prev[item.name], owned: value }
                }))
              }
            />
          ))}
        </div>
        {/* <ItemList data={convertedItems} /> */}
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