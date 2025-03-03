import { IAPIItem, IAPIResonator } from "@/app/interfaces/api_interfaces";
import { ResonatorStateDBEntry } from "@/types/resonatorTypes";
import { convertToUrl } from "@/utils/utils";
import Image from "next/image";
import { PlannerCardCurrentDesiredComponent } from "./PlannerCardCurrentDesiredComponent";
import { useCharacters } from "@/context/CharacterContext";
import { getMaterials } from "@/utils/planner_utils";
import { calculateWaveplate, convertItemMapToItemList } from "@/utils/items_utils";
import ItemList from "@/components/items/ItemList";


interface PlannerCardComponentProps {
  resonator: IAPIResonator,
  items: IAPIItem[],
  dbData: ResonatorStateDBEntry,
  onEditResonator: (resonator: ResonatorStateDBEntry) => void;
}
export function PlannerCardComponent({ resonator, items, dbData, onEditResonator }: PlannerCardComponentProps) {
  const resonatorContext = useCharacters();
  if (!resonatorContext) {
    return (<div>Resonator context does not exist</div>);
  }
  const { deleteCharacter } = resonatorContext;
  const requiredMaterials = getMaterials(dbData, resonator);
  const convertedMaterials = convertItemMapToItemList(items, requiredMaterials, true);
  const waveplateNeeded = calculateWaveplate(convertedMaterials);
  return (
    <div className="flex flex-col items-center border bg-gray-300 w-[400px]">
      <div className={`
        ${resonator.rarity === 5 ? "bg-rarity5" : "bg-rarity4"}
        text-2xl border border-solid border-black w-full text-center`}>
        {resonator.name}
      </div>
      <div className="flex flex-row">
        <div>
          <Image
            src={`${convertToUrl(resonator.card)}`}
            alt={`${resonator.name} icon`}
            width={64}
            height={64}
          />
        </div>
        <div className="border">
          <div className="text-center">
            <div>Levels</div>
            <div>{dbData.level?.current} → {dbData.level?.desired}</div>
          </div>
          <div className="flex flex-row">
            <div className="p-2">
              <div>Active Skill</div>
              <div>
                <PlannerCardCurrentDesiredComponent label="Attack" currentDesired={dbData.normalAttack} />
                <PlannerCardCurrentDesiredComponent label="Skill" currentDesired={dbData.resonanceSkill} />
                <PlannerCardCurrentDesiredComponent label="Liberation" currentDesired={dbData.resonanceLiberation} />
                <PlannerCardCurrentDesiredComponent label="Forte" currentDesired={dbData.forte} />
                <PlannerCardCurrentDesiredComponent label="Intro" currentDesired={dbData.intro} />
              </div>
            </div>
            <div className="p-2">
              <div>Passive Skill</div>
              <div>
                <PlannerCardCurrentDesiredComponent label="Inherent" currentDesired={dbData.inherent} />
                <PlannerCardCurrentDesiredComponent label="Side 1" currentDesired={dbData.side1} />
                <PlannerCardCurrentDesiredComponent label="Side 2" currentDesired={dbData.side2} />
                <PlannerCardCurrentDesiredComponent label="Side 3" currentDesired={dbData.side3} />
                <PlannerCardCurrentDesiredComponent label="Side 4" currentDesired={dbData.side4} />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div>
        Waveplate:
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
      <div className="flex flex-row">
        <button onClick={() => confirm("Edit?") ? onEditResonator(dbData) : null}>
          Edit
        </button>
        <button onClick={() => confirm("Delete?") ? deleteCharacter(resonator.name) : null}>
          Delete
        </button>
      </div>
    </div >
  )
}

