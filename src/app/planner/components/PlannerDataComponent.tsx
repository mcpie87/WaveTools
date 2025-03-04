import { PlannerCardComponent } from "./PlannerCard";
import { ResonatorDBSchema, ResonatorStateDBEntry } from "@/types/resonatorTypes";
import { IAPIItem, IAPIResonator } from "@/app/interfaces/api_interfaces";

interface PlannerDataComponentProps {
  characters: ResonatorDBSchema
  resonators: IAPIResonator[],
  apiItems: IAPIItem[],
  onEditResonator: (resonator: ResonatorStateDBEntry) => void;
}
export const PlannerDataComponent = ({
  onEditResonator,
  characters,
  resonators,
  apiItems
}: PlannerDataComponentProps) => {
  // sort resonators by their priority
  const sortedResonators = Object.entries(characters)
    .sort((a, b) => a[1].priority - b[1].priority);

  return (
    <div className="grid grid-cols-4 gap-2">
      {
        sortedResonators.map(([name, resonator]) => {
          const resonatorAssetData = resonators.find(e => e.name === name);
          if (!resonatorAssetData || !resonator) {
            return <div key={name}>Resonator data not found! {name}</div>
          }
          return (
            <PlannerCardComponent
              key={name}
              resonator={resonatorAssetData}
              apiItems={apiItems}
              dbData={resonator}
              onEditResonator={onEditResonator}
            />
          );
        })
      }
    </div>
  );
}