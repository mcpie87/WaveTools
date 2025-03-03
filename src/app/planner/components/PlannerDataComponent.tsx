import { PlannerCardComponent } from "./PlannerCard";
import { ResonatorDBSchema, ResonatorStateDBEntry } from "@/types/resonatorTypes";
import { IAPIItem, IAPIResonator } from "@/app/interfaces/api_interfaces";

interface PlannerDataComponentProps {
  characters: ResonatorDBSchema
  resonators: IAPIResonator[],
  items: IAPIItem[],
  onEditResonator: (resonator: ResonatorStateDBEntry) => void;
}
export const PlannerDataComponent = ({
  onEditResonator,
  characters,
  resonators,
  items
}: PlannerDataComponentProps) => {
  return (
    <div className="flex flex-row flex-wrap">
      {
        Object.entries(characters).map(([name, resonator]) => {
          const resonatorAssetData = resonators.find(e => e.name === name);
          if (!resonatorAssetData || !resonator) {
            return <div key={name}>Resonator data not found! {name}</div>
          }
          return (
            <PlannerCardComponent
              key={name}
              resonator={resonatorAssetData}
              items={items}
              dbData={resonator}
              onEditResonator={onEditResonator}
            />
          );
        })
      }
    </div>
  );
}