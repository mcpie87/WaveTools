import { useData } from "@/context/DataContext";
import { convertToUrl, getRarityClass } from "@/utils/utils";
import Image from "next/image";
import { ModalComponent } from "./ModalComponent";
import { useState } from "react";
import { IAPIWeapon } from "@/app/interfaces/api_interfaces";
import { WeaponComponent } from "../WeaponIconComponent";
import { WEAPON_TYPES } from "@/constants/weapon_types";
import { Button } from "../ui/button";
import { Input } from "../ui/input";

const defaultFilter: { [key: string]: boolean } = {
  Rarity5: false,
  Rarity4: false,
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
interface AddWeaponFormProps {
  onAddWeapon: (name: string) => void;
  onClose: () => void;
}
export const AddWeaponForm = ({ onAddWeapon, onClose }: AddWeaponFormProps) => {
  const [searchText, setSearchText] = useState("");
  const [searchFilter, setSearchFilter] = useState(defaultFilter);
  const [sortBy, setSortBy] = useState(SORT_BY.RELEASE_DATE);
  const { data, error, loading } = useData();

  if (loading) return (<div>Loading...</div>);
  if (!data) return (<div>Data is not present</div>);
  if (error) return (<div>Error present: {error.message}</div>);

  const toggleFilter = (key: string) => {
    setSearchFilter({
      ...searchFilter,
      [key]: !searchFilter[key]
    })
  }
  const sortWeapons = (weapons: IAPIWeapon[]): IAPIWeapon[] => {
    return [...weapons].sort((a, b) => {
      switch (sortBy) {
        case SORT_BY.RELEASE_DATE: return 0; // we get them sorted this way
        case SORT_BY.ALPHABETICAL: return a.name < b.name ? 0 : 1;
        case SORT_BY.RARITY: return b.rarity - a.rarity;
      }
    });
  }
  const filterSearchWeapons = (weapons: IAPIWeapon[]): IAPIWeapon[] => {
    if (!Object.values(searchFilter).some(Boolean)) {
      // no filters present
      return weapons;
    }

    return weapons.filter(resonator => (
      searchFilter[resonator.weaponType.name] ||
      searchFilter[`Rarity${resonator.rarity}`]
    ));
  }

  const { weapons } = data;

  const displayedWeapons = sortWeapons(
    weapons.filter(weapon => weapon.name.toLowerCase().includes(searchText.toLowerCase()))
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
          {Object.values(WEAPON_TYPES).map((weaponType, idx: number) => (
            <div key={idx} onClick={() => toggleFilter(weaponType.name)}>
              <WeaponComponent weaponType={weaponType} highlight={searchFilter[weaponType.name]} />
            </div>
          ))}
        </div>
        <div className="flex flex-row flex-wrap">
          {filterSearchWeapons(displayedWeapons).map((weapon, idx) => (
            <div
              key={idx}
              className={`${getRarityClass(weapon.rarity)} border p-2 w-[100px]`}
              onClick={() => onAddWeapon(weapon.name)}
            >
              <Image
                src={`${convertToUrl(weapon.icon.small)}`}
                alt={`${weapon.name} icon`}
                width={256}
                height={256}
              />
              <div className="text-center">
                {weapon.name}
              </div>
            </div>
          ))}
        </div>
      </div>
    </ModalComponent>
  )
}
