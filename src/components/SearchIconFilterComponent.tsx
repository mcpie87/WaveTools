import { ResonatorElement } from "@/constants/elements";
import { ResonatorWeaponType } from "@/constants/weapon_types";
import { convertToUrl } from "@/utils/utils"
import Image from "next/image"

interface SearchIconFilterComponentProps {
  item: ResonatorElement | ResonatorWeaponType;
  highlight: boolean;
}
export const SearchIconFilterComponent = ({ item, highlight }: SearchIconFilterComponentProps) => {
  return (
    <div className={`border ${highlight ? "bg-black" : "bg-gray-400"}`}>
      <Image
        src={convertToUrl(item.icon)}
        alt={`${item.name} icon`}
        width={64}
        height={64}
      />
    </div>
  )
}