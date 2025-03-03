import { IconURL } from "@/app/interfaces/api_interfaces";

export interface ResonatorWeaponType {
  id: number;
  name: string;
  icon: IconURL;
}

export const WEAPON_TYPES: { [key: string]: ResonatorWeaponType } = {
  Broadblade: {
    id: 1,
    name: "Broadblade",
    icon: "/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconNor/SP_IconNorSword.png"
  },
  Sword: {
    id: 2,
    name: "Sword",
    icon: "/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconNor/SP_IconNorKnife.png"
  },
  Pistols: {
    id: 3,
    name: "Pistols",
    icon: "/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconNor/SP_IconNorGun.png"
  },
  Gauntlets: {
    id: 4,
    name: "Gauntlets",
    icon: "/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconNor/SP_IconNorFist.png"
  },
  Rectifier: {
    id: 5,
    name: "Rectifier",
    icon: "/Game/Aki/UI/UIResources/Common/Atlas/SkillIcon/SkillIconNor/SP_IconNorMagic.png"
  },
}