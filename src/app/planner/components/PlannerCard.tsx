import { IAPIItem } from "@/app/interfaces/api_interfaces";
import { convertToUrl, getRarityClass } from "@/utils/utils";
import Image from "next/image";
import { PlannerCardCurrentDesiredComponent } from "./PlannerCardCurrentDesiredComponent";
import { calculateWaveplate, convertItemMapToItemList, sortToItemList } from "@/utils/items_utils";
import ItemList from "@/components/items/ItemList";
import { WaveplateComponent } from "@/components/WaveplateComponent";
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";
import { ItemResonatorEXP, ItemWeaponEXP, ItemTuner, ItemEchoEXP, ItemEliteBoss, ItemWeeklyBoss, ItemSpecialty, ItemWeapon, ItemCommon, SHELL_CREDIT } from "@/app/interfaces/item_types";
import { IResonatorPlanner, IWeaponPlanner, PLANNER_TYPE, TItemMap } from "@/app/interfaces/planner_item";
import { ResonatorStateDBEntry } from "@/types/resonatorTypes";

interface PlannerCardComponentProps {
  plannerItem: IResonatorPlanner | IWeaponPlanner;
  apiItems: IAPIItem[];
  onEdit: (item: IResonatorPlanner | IWeaponPlanner, index?: number) => void;
  onDelete: (item: IResonatorPlanner | IWeaponPlanner, index?: number) => void;
}
export function PlannerCardComponent({
  plannerItem,
  apiItems,
  onEdit,
  onDelete,
}: PlannerCardComponentProps) {
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
  const { dbData, requiredMaterials } = plannerItem;

  const itemList = convertItemMapToItemList(apiItems, requiredMaterials as TItemMap, true);
  const displayedMaterials = sortToItemList(sortOrder, apiItems, itemList);
  const waveplateNeeded = calculateWaveplate(itemList);

  return (
    <div className="flex flex-col items-center bg-gray-300 h-full">
      <div className={`
          ${getRarityClass(plannerItem.rarity)}
          flex items-center justify-between w-full border border-black`}
      >
        <div className="flex space-x-4 h-full items-center m-2">
          <FaEdit
            onClick={() => onEdit(plannerItem)}
            className="
            w-10  h-10 p-2 border border-black rounded-full
            text-white bg-gray-800
            hover:text-black hover:bg-gray-400
            "
          />
        </div>
        <span className="text-2xl w-full text-center">
          {plannerItem.name}
        </span>
        <div className="flex space-x-4 h-full items-center m-2">
          {/* <FaSearch /> */}
          <FaRegTrashAlt
            onClick={() => confirm("Delete?") ? onDelete(plannerItem) : null}
            className="
          w-10  h-10 p-2 border border-black rounded-full
          text-white bg-gray-800
          hover:text-black hover:bg-gray-400
          "
          />
        </div>
      </div>
      <div className="flex flex-row">
        <div>
          <Image
            src={`${convertToUrl(plannerItem.icon)}`}
            alt={`${plannerItem.name} icon`}
            width={64}
            height={64}
          />
          <div>
            <WaveplateComponent breakdown={waveplateNeeded} vertical={true} />
          </div>
        </div>
        <div className="border">
          <div className="text-center">
            <div>Levels</div>
            <div>{dbData.level?.current} → {dbData.level?.desired}</div>
          </div>
          {(plannerItem.type === PLANNER_TYPE.RESONATOR) && (
            <div className="flex flex-row">
              <div className="p-2">
                <div>Active Skill</div>
                <div>
                  <PlannerCardCurrentDesiredComponent label="Attack" currentDesired={(dbData as ResonatorStateDBEntry).normalAttack} />
                  <PlannerCardCurrentDesiredComponent label="Skill" currentDesired={(dbData as ResonatorStateDBEntry).resonanceSkill} />
                  <PlannerCardCurrentDesiredComponent label="Liberation" currentDesired={(dbData as ResonatorStateDBEntry).resonanceLiberation} />
                  <PlannerCardCurrentDesiredComponent label="Forte" currentDesired={(dbData as ResonatorStateDBEntry).forte} />
                  <PlannerCardCurrentDesiredComponent label="Intro" currentDesired={(dbData as ResonatorStateDBEntry).intro} />
                </div>
              </div>
              <div className="p-2">
                <div>Passive Skill</div>
                <div>
                  <PlannerCardCurrentDesiredComponent label="Inherent" currentDesired={(dbData as ResonatorStateDBEntry).inherent} />
                  <PlannerCardCurrentDesiredComponent label="Side 1" currentDesired={(dbData as ResonatorStateDBEntry).side1} />
                  <PlannerCardCurrentDesiredComponent label="Side 2" currentDesired={(dbData as ResonatorStateDBEntry).side2} />
                  <PlannerCardCurrentDesiredComponent label="Side 3" currentDesired={(dbData as ResonatorStateDBEntry).side3} />
                  <PlannerCardCurrentDesiredComponent label="Side 4" currentDesired={(dbData as ResonatorStateDBEntry).side4} />
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <ItemList data={displayedMaterials} />
    </div >
  )
}

