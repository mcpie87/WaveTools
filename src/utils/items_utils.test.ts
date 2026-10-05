import { IItem } from "@/app/interfaces/item";
import { ItemEliteBoss } from "@/app/interfaces/item_types";
import { WAVEPLATE_ELITE_BOSS } from "@/constants/waveplate_usage";
import { calculateWaveplate } from "./items_utils";

const item = (name: string, value: number): IItem => ({
  id: 1,
  name,
  rarity: 4,
  icon: "",
  icon_middle: "",
  icon_small: "",
  attributes_description: "",
  value,
});

describe("calculateWaveplate", () => {
  test("counts elite drops when Rover is also planned", () => {
    const eliteDrops = WAVEPLATE_ELITE_BOSS[8].ELITE;
    const breakdown = calculateWaveplate([
      item(ItemEliteBoss.MYSTERIOUS_CODE, 1),
      item(ItemEliteBoss.TEMPEST_MEPHIS, eliteDrops),
    ]);

    expect(breakdown.find(entry => entry.label === "elite")?.runCount).toBe(1);
  });
});
