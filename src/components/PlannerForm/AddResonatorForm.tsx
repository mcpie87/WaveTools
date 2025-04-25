import { useCharacters } from "@/context/CharacterContext";
import { useData } from "@/context/DataContext";
import { convertToUrl, getRarityClass } from "@/utils/utils";
import Image from "next/image";
import { ModalComponent } from "./ModalComponent";
import { useState } from "react";
import { IAPIResonator } from "@/app/interfaces/api_interfaces";
import { ElementComponent } from "../ElementIconComponent";
import { ELEMENTS } from "@/constants/elements";
import { WeaponComponent } from "../WeaponIconComponent";
import { WEAPON_TYPES } from "@/constants/weapon_types";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

const defaultFilter: { [key: string]: boolean } = {
  Rarity5: false,
  Rarity4: false,
  Aero: false,
  Electro: false,
  Havoc: false,
  Spectro: false,
  Fusion: false,
  Cryo: false,
  Broadblade: false,
  Sword: false,
  Pistols: false,
  Gauntlets: false,
  Rectifier: false,
};

enum SORT_BY {
  RELEASE_DATE,
  ALPHABETICAL,
  RARITY,
}
interface AddResonatorFormProps {
  onAddResonator: (name: string) => void;
  onClose: () => void;
}
export const AddResonatorForm = ({ onAddResonator, onClose }: AddResonatorFormProps) => {
  const [searchText, setSearchText] = useState("");
  const [searchFilter, setSearchFilter] = useState(defaultFilter);
  const [sortBy, setSortBy] = useState(SORT_BY.RELEASE_DATE);
  const resonatorContext = useCharacters();
  const { data, error, loading } = useData();

  if (loading) return (<div>Loading...</div>);
  if (!data) return (<div>Data is not present</div>);
  if (error) return (<div>Error present: {error.message}</div>);
  if (!resonatorContext) return (<div>Resonator context does not exist</div>)

  const {
    characters,
  } = resonatorContext;

  const toggleFilter = (key: string) => {
    setSearchFilter({
      ...searchFilter,
      [key]: !searchFilter[key]
    })
  }
  const sortResonators = (resonators: IAPIResonator[]): IAPIResonator[] => {
    return [...resonators].sort((a, b) => {
      switch (sortBy) {
        case SORT_BY.RELEASE_DATE: return 0; // we get them sorted this way
        case SORT_BY.ALPHABETICAL: return a.name < b.name ? 0 : 1;
        case SORT_BY.RARITY: return b.rarity - a.rarity;
      }
    });
  }
  const filterSearchResonators = (resonators: IAPIResonator[]): IAPIResonator[] => {
    if (!Object.values(searchFilter).some(Boolean)) {
      // no filters present
      return resonators;
    }

    return resonators.filter(resonator => (
      searchFilter[resonator.element.name] ||
      searchFilter[resonator.weaponType.name] ||
      searchFilter[`Rarity${resonator.rarity}`]
    ));
  }

  const { resonators } = data;
  const ownedResonators = Object.keys(characters);
  const displayedResonators = sortResonators(
    resonators
      .filter(resonator => !ownedResonators.includes(resonator.name))
      .filter(resonator => resonator.name.toLowerCase().includes(searchText.toLowerCase()))
  );

  return (
    <ModalComponent show={true} onClose={onClose}>
      <div className="flex flex-col gap-5 w-[800px]">
        <div className="flex flex-rowjustify-center items-center gap-1">
          Search:
          <Input type="text" onChange={(e) => setSearchText(e.target.value)} />
          <div className="flex flex-row gap-1">
            <Button onClick={() => setSortBy(SORT_BY.RARITY)}>Rarity</Button>
            <Button onClick={() => setSortBy(SORT_BY.ALPHABETICAL)}>Alphabetically</Button>
            <Button onClick={() => setSortBy(SORT_BY.RELEASE_DATE)}>Release</Button>
          </div>
        </div>
        <div className="flex flex-row justify-center items-center gap-1">
          {Object.values(ELEMENTS).map((element, idx: number) => (
            <div key={idx} onClick={() => toggleFilter(element.name)}>
              <ElementComponent element={element} highlight={searchFilter[element.name]} />
            </div>
          ))}
          {Object.values(WEAPON_TYPES).map((weaponType, idx: number) => (
            <div key={idx} onClick={() => toggleFilter(weaponType.name)}>
              <WeaponComponent weaponType={weaponType} highlight={searchFilter[weaponType.name]} />
            </div>
          ))}
        </div>
        <div className="flex flex-row flex-wrap">
          {filterSearchResonators(displayedResonators).map((resonator, idx) => (
            <div
              key={idx}
              className={`${getRarityClass(resonator.rarity)} border p-2 w-[100px]`}
              onClick={() => onAddResonator(resonator.name)}
            >
              <Image
                src={`${convertToUrl(resonator.card)}`}
                alt={`${resonator.name} icon`}
                width={256}
                height={256}
              />
              <div className="text-center">
                {resonator.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModalComponent>
  )
}
