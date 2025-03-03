import { ResonatorWeaponType } from "@/constants/weapon_types";
import { SearchIconFilterComponent } from "./SearchIconFilterComponent";

interface WeaponComponentProps {
  weaponType: ResonatorWeaponType;
  highlight: boolean;
}
export const WeaponComponent = ({ weaponType, highlight }: WeaponComponentProps) => {
  return (
    <SearchIconFilterComponent item={weaponType} highlight={highlight} />
  )
}