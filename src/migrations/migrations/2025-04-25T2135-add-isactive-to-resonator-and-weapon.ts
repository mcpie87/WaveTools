import { ResonatorDBSchema } from "@/types/resonatorTypes";
import { Migration } from "../migrationTypes";
import { WeaponDBSchema } from "@/types/weaponTypes";

const migration20250425T2135: Migration = {
  version: "2025-04-25T21-35",
  description: "Add isActive to resonator and weapon",
  up: async () => {
    const resonators = localStorage.getItem("wave_tools_resonators");
    if (!resonators) {
      return;
    }
    const weapons = localStorage.getItem("wave_tools_weapons");
    if (!weapons) {
      return;
    }

    const resonatorsDb: ResonatorDBSchema = JSON.parse(resonators);
    const weaponsDb: WeaponDBSchema = JSON.parse(weapons);

    for (const resonator of Object.values(resonatorsDb)) {
      resonator.isActive = true;
    }
    for (const weaponName of Object.values(weaponsDb)) {
      for (const weaponItem of weaponName) { // we store it as array of items
        weaponItem.isActive = true;
      }
    }
    localStorage.setItem("wave_tools_resonators", JSON.stringify(resonatorsDb));
    localStorage.setItem("wave_tools_weapons", JSON.stringify(weaponsDb));
  }
}
export default migration20250425T2135;