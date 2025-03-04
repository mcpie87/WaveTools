import { IAPIItem, IAPIResonator } from "@/app/interfaces/api_interfaces";
import { ResonatorStateDBEntry } from "@/types/resonatorTypes";
import { convertToUrl } from "@/utils/utils";
import Image from "next/image";
import { PlannerCardCurrentDesiredComponent } from "./PlannerCardCurrentDesiredComponent";
import { useCharacters } from "@/context/CharacterContext";
import { getMaterials } from "@/utils/planner_utils";
import { calculateWaveplate, convertItemMapToItemList, sortToItemList } from "@/utils/items_utils";
import ItemList from "@/components/items/ItemList";
import { WaveplateComponent } from "@/components/WaveplateComponent";
import { FaEdit, FaRegTrashAlt } from "react-icons/fa";
import { ItemResonatorEXP, ItemWeaponEXP, ItemTuner, ItemEchoEXP, ItemEliteBoss, ItemWeeklyBoss, ItemSpecialty, ItemWeapon, ItemCommon, SHELL_CREDIT } from "@/app/interfaces/item_types";


interface PlannerCardComponentProps {
  resonator: IAPIResonator,
  apiItems: IAPIItem[],
  dbData: ResonatorStateDBEntry,
  onEditResonator: (resonator: ResonatorStateDBEntry) => void;
}
export function PlannerCardComponent({ resonator, apiItems, dbData, onEditResonator }: PlannerCardComponentProps) {
  const resonatorContext = useCharacters();
  if (!resonatorContext) {
    return (<div>Resonator context does not exist</div>);
  }
  const { deleteCharacter } = resonatorContext;

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
  const requiredMaterials = getMaterials(dbData, apiItems, resonator);
  const convertedMaterials = convertItemMapToItemList(apiItems, requiredMaterials, true);
  const displayedMaterials = sortToItemList(sortOrder, apiItems, convertedMaterials)
  const waveplateNeeded = calculateWaveplate(convertedMaterials);
  return (
    <div className="flex flex-col items-center bg-gray-300">
      <div className={`
          ${resonator.rarity === 5 ? "bg-rarity5" : "bg-rarity4"}
          flex items-center justify-between w-full border border-black`}
      >
        <div className="flex space-x-4 h-full items-center m-2">
          <FaEdit
            onClick={() => onEditResonator(dbData)}
            className="
            w-10  h-10 p-2 border border-black rounded-full
            text-white bg-gray-800
            hover:text-black hover:bg-gray-400
            "
          />
        </div>
        <span className="text-2xl w-full text-center">
          {resonator.name}
        </span>
        <div className="flex space-x-4 h-full items-center m-2">
          {/* <FaSearch /> */}
          <FaRegTrashAlt
            onClick={() => confirm("Delete?") ? deleteCharacter(resonator.name) : null}
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
            src={`${convertToUrl(resonator.card)}`}
            alt={`${resonator.name} icon`}
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
      <ItemList data={displayedMaterials} />
    </div >
  )
}

