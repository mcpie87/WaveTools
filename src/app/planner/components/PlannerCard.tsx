import { IAPIResonator } from "@/app/interfaces/api_interfaces";
import { ResonatorStateDBEntry } from "@/types/resonatorTypes";
import { convertToUrl } from "@/utils/utils";
import Image from "next/image";
import { PlannerCardCurrentDesiredComponent } from "./PlannerCardCurrentDesiredComponent";
import { useCharacters } from "@/context/CharacterContext";
import { getMaterials } from "@/utils/planner_utils";


interface PlannerCardComponentProps {
  resonator: IAPIResonator,
  dbData: ResonatorStateDBEntry,
  onEditResonator: (resonator: ResonatorStateDBEntry) => void;
}
export function PlannerCardComponent({ resonator, dbData, onEditResonator }: PlannerCardComponentProps) {
  const resonatorContext = useCharacters();
  if (!resonatorContext) {
    return (<div>Resonator context does not exist</div>);
  }
  const { deleteCharacter } = resonatorContext;

  const requiredMaterials = getMaterials(dbData, resonator);
  return (
    <div className="flex flex-col items-center border bg-gray-300 w-[200px]">
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
          <div>
            <div>Levels</div>
            <div>{dbData.level?.current} → {dbData.level?.desired}</div>
          </div>
          <div>
            <div>Active Skill</div>
            <div>
              <PlannerCardCurrentDesiredComponent label="Attack" currentDesired={dbData.normalAttack} />
              <PlannerCardCurrentDesiredComponent label="Skill" currentDesired={dbData.resonanceSkill} />
              <PlannerCardCurrentDesiredComponent label="Liberation" currentDesired={dbData.resonanceLiberation} />
              <PlannerCardCurrentDesiredComponent label="Forte" currentDesired={dbData.forte} />
              <PlannerCardCurrentDesiredComponent label="Intro" currentDesired={dbData.intro} />
            </div>
          </div>
          <div>
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
      {/* <ItemList */}
      <div>
        {Object.entries(requiredMaterials).map(([name, value]) => (
          <div key={name}>
            {name} - {value}
          </div>
        ))}
      </div>
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

