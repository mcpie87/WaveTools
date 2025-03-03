import { IAPIItem, IAPIResonator } from "@/app/interfaces/api_interfaces";
import ItemList from "@/components/items/ItemList";
import { ResonatorDBSchema } from "@/types/resonatorTypes";
import { calculateWaveplate, convertItemMapToItemList } from "@/utils/items_utils";
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
  const convertedMaterials = convertItemMapToItemList(apiItems, requiredMaterials);
  const waveplateNeeded = calculateWaveplate(convertedMaterials);

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
      <ItemList data={convertedMaterials} />
    </div>
  )
}
