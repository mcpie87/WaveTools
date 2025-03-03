import { IAPIItem, IAPIResonator } from "@/app/interfaces/api_interfaces";
import { IItem } from "@/app/interfaces/item";
import { ItemCommon, ItemEchoEXP, ItemEliteBoss, ItemResonatorEXP, ItemSpecialty, ItemTuner, ItemWeapon, ItemWeaponEXP, ItemWeeklyBoss, SHELL_CREDIT } from "@/app/interfaces/item_types";
import ItemList from "@/components/items/ItemList";
import { ResonatorDBSchema } from "@/types/resonatorTypes";
import { calculateWaveplate, convertItemMapToItemList, filterType } from "@/utils/items_utils";
import { getMaterials } from "@/utils/planner_utils";

interface PlannerSummaryComponentProps {
  dbResonators: ResonatorDBSchema;
  apiResonators: IAPIResonator[];
  apiItems: IAPIItem[];
}
export const PlannerSummaryComponent = ({
  dbResonators,
  apiResonators,
  apiItems
}: PlannerSummaryComponentProps) => {

  const getCombinedRequiredMaterials = () => {
    const combinedRequiredMaterials: { [key: string]: number } = {};

    for (const dbResonator of Object.values(dbResonators)) {
      const apiResonator = apiResonators.find((e => e.name === dbResonator.name));
      if (!apiResonator) {
        throw new Error(`Resonator not present in API ${dbResonator.name}`);
      }

      const requiredMaterialsForResonator = getMaterials(dbResonator, apiResonator);

      for (const [material, amount] of Object.entries(requiredMaterialsForResonator)) {
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
    ["Resonator EXP", filterType(convertedMaterials, ItemResonatorEXP)],
    ["Weapon EXP", filterType(convertedMaterials, ItemWeaponEXP)],
    ["Tuners", filterType(convertedMaterials, ItemTuner)],
    ["Echo EXP", filterType(convertedMaterials, ItemEchoEXP)],
    ["Elite Boss", filterType(convertedMaterials, ItemEliteBoss)],
    ["Weekly Boss", filterType(convertedMaterials, ItemWeeklyBoss)],
    ["Specialty", filterType(convertedMaterials, ItemSpecialty)],
    ["Forgery", filterType(convertedMaterials, ItemWeapon)],
    ["Common Enemies", filterType(convertedMaterials, ItemCommon)],
  ].filter((elem) => elem[1].length > 0);
  console.log("HEY", displayedMaterials);

  return (
    <div>
      <div>
        <table>
          <thead>
            <tr>
              <th>Type</th>
              <th>Runs</th>
              <th>Waveplate</th>
            </tr>
          </thead>
          <tbody>
            {waveplateNeeded.map(e => (
              <tr key={e[0]}>
                <td>{e[0]}</td>
                <td>{(e[1] as number).toFixed(3)}</td>
                <td>{(e[2] as number).toFixed(3)}</td>
              </tr>
            ))}
            <tr>
              <td>TOTAL</td>
              <td>{waveplateNeeded.map(e => +e[1]).reduce((acc, e) => e + acc).toFixed(2)}</td>
              <td>{waveplateNeeded.map(e => +e[2]).reduce((acc, e) => e + acc).toFixed(2)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      {displayedMaterials.map((materials, idx) => (
        <div key={idx} className="flex flex-col justify-center">
          <div className="text-center">{materials[0] as string}</div>
          <div className="flex flex-wrap justify-center">
            <ItemList data={materials[1] as IItem[]} />
          </div>
        </div>
      ))}
    </div>
  );
}
