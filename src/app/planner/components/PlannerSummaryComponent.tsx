import { IAPIItem } from "@/app/interfaces/api_interfaces";
import { IItem } from "@/app/interfaces/item";
import { ItemCommon, ItemEchoEXP, ItemEliteBoss, ItemResonatorEXP, ItemSpecialty, ItemTuner, ItemWeapon, ItemWeaponEXP, ItemWeeklyBoss, SHELL_CREDIT } from "@/app/interfaces/item_types";
import { IResonatorPlanner, IWeaponPlanner } from "@/app/interfaces/planner_item";
import ItemList from "@/components/items/ItemList";
import { WaveplateComponent } from "@/components/WaveplateComponent";
import { calculateWaveplate, convertItemMapToItemList, filterType } from "@/utils/items_utils";
import { getMaterials } from "@/utils/planner_utils";

interface PlannerSummaryComponentProps {
  plannerItems: (IResonatorPlanner | IWeaponPlanner)[];
  apiItems: IAPIItem[];
}
export const PlannerSummaryComponent = ({
  plannerItems,
  apiItems,
}: PlannerSummaryComponentProps) => {
  const getCombinedRequiredMaterials = () => {
    const combinedRequiredMaterials: { [key: string]: number } = {};

    for (const plannerItem of plannerItems) {
      const requiredMaterials = getMaterials(plannerItem, apiItems);

      for (const [material, amount] of Object.entries(requiredMaterials)) {
        combinedRequiredMaterials[material] = (combinedRequiredMaterials[material] ?? 0) + amount;
      }
    }

    return combinedRequiredMaterials;
  }

  const requiredMaterials = getCombinedRequiredMaterials();
  const convertedMaterials = convertItemMapToItemList(apiItems, requiredMaterials, true);
  const waveplateNeeded = calculateWaveplate(convertedMaterials);

  const displayedMaterials = [
    ["Shell Credit", convertedMaterials.filter((item) => item.name === SHELL_CREDIT)],
    ["Resonator EXP", filterType(convertedMaterials, ItemResonatorEXP).reverse()],
    ["Weapon EXP", filterType(convertedMaterials, ItemWeaponEXP).reverse()],
    ["Tuners", filterType(convertedMaterials, ItemTuner).reverse()],
    ["Echo EXP", filterType(convertedMaterials, ItemEchoEXP).reverse()],
    ["Elite Boss", filterType(convertedMaterials, ItemEliteBoss).reverse()],
    ["Weekly Boss", filterType(convertedMaterials, ItemWeeklyBoss).reverse()],
    ["Specialty", filterType(convertedMaterials, ItemSpecialty).reverse()],
    ["Forgery", filterType(convertedMaterials, ItemWeapon).reverse()],
    ["Common Enemies", filterType(convertedMaterials, ItemCommon).reverse()],
  ].filter((elem) => elem[1].length > 0);

  return (
    <>
      <div className="text-center">Summary</div>
      <div>
        <WaveplateComponent breakdown={waveplateNeeded} />
      </div>
      {displayedMaterials.map((materials, idx) => (
        <div key={idx} className="flex flex-col justify-center">
          <div className="text-center">{materials[0] as string}</div>
          <div className="flex flex-wrap justify-center">
            <ItemList data={materials[1] as IItem[]} />
          </div>
        </div>
      ))}
    </>
  );
}
