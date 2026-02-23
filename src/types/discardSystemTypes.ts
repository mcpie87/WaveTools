import { SONATAS } from "@/constants/sonatas";

export const SONATA_NAMES = Object.keys(SONATAS);
export type SonataKey = keyof typeof SONATAS
export type Sonata = (typeof SONATAS)[SonataKey]

export enum EchoCost {
  COST1 = "cost1",
  COST3 = "cost3",
  COST4 = "cost4",
}

export type DbDiscardSystem = {
  [key in SonataKey]: {
    [EchoCost.COST1]: Set<MainStat1Cost>
    [EchoCost.COST3]: Set<MainStat3Cost>
    [EchoCost.COST4]: Set<MainStat4Cost>
  }
}

export enum MainStat1Cost {
  ATK = "ATK",
  DEF = "DEF",
  HP = "HP",
}
export enum MainStat3Cost {
  ATK = "ATK",
  DEF = "DEF",
  HP = "HP",
  Spectro = "Spectro",
  Havoc = "Havoc",
  Aero = "Aero",
  Fusion = "Fusion",
  Electro = "Electro",
  Glacio = "Glacio",
  ER = "ER",
}
export enum MainStat4Cost {
  ATK = "ATK",
  DEF = "DEF",
  HP = "HP",
  CR = "CR",
  CDmg = "CDmg",
  Heal = "Heal",
}
export type MainStat = MainStat1Cost | MainStat3Cost | MainStat4Cost;