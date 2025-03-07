import { PlannerCardComponent } from "./PlannerCard";
import { ResonatorStateDBEntry } from "@/types/resonatorTypes";
import { IAPIItem } from "@/app/interfaces/api_interfaces";
import { WeaponStateDBEntry } from "@/types/weaponTypes";
import { IResonatorPlanner, IWeaponPlanner, PLANNER_TYPE } from "@/app/interfaces/planner_item";

interface PlannerDataComponentProps {
  plannerItems: (IResonatorPlanner | IWeaponPlanner)[];
  apiItems: IAPIItem[],
  onEditResonator: (resonator: ResonatorStateDBEntry) => void;
  onEditWeapon: (weapon: WeaponStateDBEntry) => void;
  onDelete: (plannerItem: IResonatorPlanner | IWeaponPlanner) => void;
}
export const PlannerDataComponent = ({
  plannerItems,
  apiItems,
  onEditResonator,
  onEditWeapon,
  onDelete,
}: PlannerDataComponentProps) => {
  const handleEdit = (item: IResonatorPlanner | IWeaponPlanner) => {
    if (item.type === PLANNER_TYPE.RESONATOR) {
      onEditResonator(item.dbData as ResonatorStateDBEntry);
    } else {
      onEditWeapon(item.dbData as WeaponStateDBEntry);
    }
  }

  return (
    <div className="grid grid-cols-[repeat(auto-fit,minmax(350px,1fr))] gap-2">
      {
        plannerItems.map((item, idx) => (
          <div key={idx} className="min-w-[350px]">
            <PlannerCardComponent
              plannerItem={item}
              apiItems={apiItems}
              onEdit={handleEdit}
              onDelete={onDelete}
            />
          </div>
        ))
      }
    </div>
  );
}