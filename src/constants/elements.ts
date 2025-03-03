import { IconURL } from "@/app/interfaces/api_interfaces";

export interface ResonatorElement {
  id: number;
  name: string;
  icon: IconURL;
}

export const ELEMENTS: { [key: string]: ResonatorElement } = {
  Glacio: {
    id: 1,
    name: "Glacio",
    icon: "/Game/Aki/UI/UIResources/Common/Image/IconElement128/T_IconElementIce.png"
  },
  Fusion: {
    id: 2,
    name: "Fusion",
    icon: "/Game/Aki/UI/UIResources/Common/Image/IconElement128/T_IconElementFire.png"
  },
  Electro: {
    id: 3,
    name: "Electro",
    icon: "/Game/Aki/UI/UIResources/Common/Image/IconElement128/T_IconElementThunder.png"
  },
  Aero: {
    id: 4,
    name: "Aero",
    icon: "/Game/Aki/UI/UIResources/Common/Image/IconElement128/T_IconElementWind.png"
  },
  Spectro: {
    id: 5,
    name: "Spectro",
    icon: "/Game/Aki/UI/UIResources/Common/Image/IconElement128/T_IconElementLight.png"
  },
  Havoc: {
    id: 6,
    name: "Havoc",
    icon: "/Game/Aki/UI/UIResources/Common/Image/IconElement128/T_IconElementDark.png"
  },
}
