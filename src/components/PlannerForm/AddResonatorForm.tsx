import { useCharacters } from "@/context/CharacterContext";
import { useData } from "@/context/DataContext";
import { convertToUrl } from "@/utils/utils";
import Image from "next/image";

interface AddResonatorFormProps {
  onAddResonator: (name: string) => void;
}
export const AddResonatorForm = ({ onAddResonator }: AddResonatorFormProps) => {
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
  const {
    characters,
  } = resonatorContext;

  const { resonators } = data;
  const getNotOwnedResonators = () => {
    const ownedResonators = Object.keys(characters);
    return resonators.filter(resonator => !ownedResonators.includes(resonator.name));
  }
  console.log("addform", characters);
  console.log("addform2", resonators);
  return (
    <div className="flex flex-wrap">
      {getNotOwnedResonators().map((resonator, idx) => (
        <div
          key={idx}
          className="border p-2 w-[100px]"
          onClick={() => onAddResonator(resonator.name)}
        >
          <Image
            src={`${convertToUrl(resonator.card)}`}
            alt={`${resonator.name} icon`}
            width={256}
            height={256}
          />
          {resonator.rarity} - {resonator.name}
        </div>
      ))}
    </div>
  )
}