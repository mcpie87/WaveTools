import { Migration } from "../migrationTypes";

const migration20250420T1852: Migration = {
  version: "2025-04-20T18-52",
  description: "Rename rover due to 2.2 patch",
  up: async () => {
    const resonators = localStorage.getItem("wave_tools_resonators");
    if (!resonators) {
      return;
    }
    const oldSpectroKey = "Rover-Spectro";
    const newSpectroKey = "Rover: Spectro";
    const oldHavocKey = "Rover-Havoc";
    const newHavocKey = "Rover: Havoc";

    const resonatorsDb = JSON.parse(resonators);
    const oldRoverSpectro = resonatorsDb[oldSpectroKey];
    const newRoverSpectro = resonatorsDb[newSpectroKey];
    const oldRoverHavoc = resonatorsDb[oldHavocKey];
    const newRoverHavoc = resonatorsDb[newHavocKey];
    if (oldRoverSpectro && newRoverSpectro) {
      delete resonatorsDb[oldSpectroKey];
    } else if (oldRoverSpectro) {
      resonatorsDb[newSpectroKey] = oldRoverSpectro;
      resonatorsDb[newSpectroKey].name = newSpectroKey;
      delete resonatorsDb[oldSpectroKey];
    }

    if (oldRoverHavoc && newRoverHavoc) {
      delete resonatorsDb[oldHavocKey];
    } else if (oldRoverHavoc) {
      resonatorsDb[newHavocKey] = oldRoverHavoc;
      resonatorsDb[newHavocKey].name = newHavocKey;
      delete resonatorsDb[oldHavocKey];
    }
    localStorage.setItem("wave_tools_resonators", JSON.stringify(resonatorsDb));
  }
}
export default migration20250420T1852;