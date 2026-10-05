import { APILevelPlayData, APIQuestData } from "@/types/mapTypes";
import { createFixtureMapCatalogAdapter } from "./mapCatalogAdapters";
import { buildMapCatalog, MapCatalogSource } from "./MapCatalog";
import {
  getBlueprintRewards,
  getLevelPlayChildren,
  getLevelPlayData,
  getLevelPlayReferences,
  getMapMark,
  getQuestChildren,
  getQuestData,
  getQuestInfo,
  getQuestReferences,
  installMapCatalog,
} from "./map_marks";

const source: MapCatalogSource = {
  mapMarks: [
    {
      id: 1,
      mapId: 10,
      relativeId: 0,
      entityConfigId: 0,
      icon: "",
      title: "ignored",
    },
    {
      id: 2,
      mapId: 10,
      relativeId: 1,
      entityConfigId: 20,
      icon: "icon",
      title: "mark",
    },
  ],
  questTypes: [
    {
      id: 3,
      trackEntityId: "e_10_20",
      children: ["child"],
      references: ["reference"],
    } as APIQuestData,
  ],
  levelPlayData: [
    {
      LevelPlayId: 4,
      LevelPlayEntityId: "e_10_20",
      Children: ["lp-child"],
      Reference: ["lp-reference"],
    } as APILevelPlayData,
  ],
  blueprintRewards: {
    TestBlueprint: { title: "reward", rewardId: 5, rewards: [] },
  },
  blueprints: { TestBlueprint: "Test translation" },
};

describe("MapCatalog", () => {
  it("builds the existing map lookups from fixture data", async () => {
    const catalog = await createFixtureMapCatalogAdapter(source).load();
    installMapCatalog(catalog);

    expect(getMapMark(10, 20)).toBe(source.mapMarks[1]);
    expect(getMapMark(10, 0)).toBeUndefined();
    expect(getMapMark(10, undefined)).toBeUndefined();
    expect(getQuestInfo(3)).toBe(source.questTypes[0]);
    expect(getQuestData("e_10_20")).toEqual([source.questTypes[0]]);
    expect(getQuestChildren("child")).toEqual([source.questTypes[0]]);
    expect(getQuestReferences("reference")).toEqual([source.questTypes[0]]);
    expect(getLevelPlayData("e_10_20")).toBe(source.levelPlayData[0]);
    expect(getLevelPlayChildren("lp-child")).toEqual([source.levelPlayData[0]]);
    expect(getLevelPlayReferences("lp-reference")).toEqual([
      source.levelPlayData[0],
    ]);
    expect(getBlueprintRewards("TestBlueprint")).toBe(
      source.blueprintRewards.TestBlueprint,
    );
    expect(buildMapCatalog(source).blueprints).toBe(source.blueprints);
  });
});
