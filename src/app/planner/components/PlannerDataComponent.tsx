import { useCharacters } from "@/context/CharacterContext";
import { useData } from "@/context/DataContext";
import { PlannerCardComponent } from "./PlannerCard";
import { ResonatorStateDBEntry } from "@/types/resonatorTypes";

interface PlannerDataComponentProps {
  onEditResonator: (resonator: ResonatorStateDBEntry) => void;
}
export default function PlannerDataComponent({ onEditResonator }: PlannerDataComponentProps) {
  const resonatorContext = useCharacters();
  const { data, error, loading } = useData();
  if (loading) {
    return (<div>Loading...</div>);
  }
  if (!data) {
    return (<div>Data is not present</div>);
  }
  if (error) {
    return (<div>Error present: {error.message}</div>);
  }
  if (!resonatorContext) {
    return (<div>Resonator context does not exist</div>);
  }
  const { characters } = resonatorContext;
  const { resonators, items } = data;
  return (
    <div className="flex flex-row flex-wrap">
      {
        Object.entries(characters).map(([name, resonator]) => {
          const resonatorAssetData = resonators.find(e => e.name === name);
          if (!resonatorAssetData || !resonator) {
            console.log("Rendering null", name, resonator, characters);
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