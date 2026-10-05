import { PlannerCardComponent } from "./PlannerCard";
import { ResonatorStateDBEntry } from "@/types/resonatorTypes";
import { IAPIItem } from "@/app/interfaces/api_interfaces";
import { WeaponStateDBEntry } from "@/types/weaponTypes";
import { IResonatorPlanner, IWeaponPlanner, PLANNER_TYPE, IRequiredItemMap } from "@/app/interfaces/planner_item";
import { InventoryDBSchema } from "@/types/inventoryTypes";
import { ItemResonatorEXP, ItemWeaponEXP, ItemTuner, ItemEchoEXP, ItemEliteBoss, ItemWeeklyBoss, ItemSpecialty, ItemWeapon, ItemCommon, SHELL_CREDIT } from "@/app/interfaces/item_types";
import { setItemsBasedOnInventory } from "@/utils/planner_utils";
import { convertItemListToItemMap, convertItemMapToItemList, convertRequiredItemMapToItemList, sortToItemList } from "@/utils/items_utils";


interface PlannerDataComponentProps {
  plannerItems: (IResonatorPlanner | IWeaponPlanner)[];
  apiItems: IAPIItem[],
  inventory: InventoryDBSchema
  onEditResonator: (resonator: ResonatorStateDBEntry) => void;
  onEditWeapon: (weapon: WeaponStateDBEntry) => void;
  onToggleActive: (plannerItem: IResonatorPlanner | IWeaponPlanner) => void;
  onDelete: (plannerItem: IResonatorPlanner | IWeaponPlanner) => void;
}
export const PlannerDataComponent = ({
  plannerItems,
  apiItems,
  inventory,
  onEditResonator,
  onEditWeapon,
  onToggleActive,
  onDelete,
}: PlannerDataComponentProps) => {
  const handleEdit = (item: IResonatorPlanner | IWeaponPlanner) => {
    if (item.type === PLANNER_TYPE.RESONATOR) {
      onEditResonator(item.dbData as ResonatorStateDBEntry);
    } else {
      onEditWeapon(item.dbData as WeaponStateDBEntry);
    }
  }

  // TODO: define orders somewhere and use some kind of enum to identify orders
  const sortOrder = [
    { SHELL_CREDIT: SHELL_CREDIT },
    ItemResonatorEXP,
    ItemWeaponEXP,
    ItemTuner,
    ItemEchoEXP,
    ItemEliteBoss,
    ItemWeeklyBoss,
    ItemSpecialty,
    ItemWeapon,
    ItemCommon,
  ];
  const leftoverInventory = JSON.parse(JSON.stringify(inventory));
  const displayedCards = plannerItems.map(plannerItem => {
    const itemList = convertRequiredItemMapToItemList(apiItems, plannerItem.requiredMaterials as IRequiredItemMap, true);
    let displayedMaterials = sortToItemList(sortOrder, apiItems, itemList);
    let displayedMaterialsMap = convertItemListToItemMap(displayedMaterials);
    displayedMaterialsMap = setItemsBasedOnInventory(displayedMaterialsMap, leftoverInventory);
    displayedMaterials = convertItemMapToItemList(displayedMaterialsMap);

    return {
      plannerItem,
      itemList: displayedMaterials,
    }
  });

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-2">
      {
        displayedCards.map((item, idx) => (
          <div key={idx} className="min-w-[350px]">
            <PlannerCardComponent
              plannerItem={item.plannerItem}
              itemList={item.itemList}
              onEdit={handleEdit}
              onDelete={onDelete}
              onToggleActive={onToggleActive}
            />
          </div>
        ))
      }
    </div>
  );
}