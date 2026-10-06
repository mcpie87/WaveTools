jest.mock("../data/map_marks", () => ({}));

import {
  __ALL_MAPS__,
  __ALL_MAPS_BUT_DEFINED__,
  __ALL_MAPS_BUT_DEFINED_AND_TEST_DUNGEON__,
  __ALL_MAPS_BUT_DUNGEONS_AND_TEST__,
  __ALL_MAPS_BUT_TEST_DUNGEON__,
  __ALL_MAPS_BUT_WORLD_MAP_AND_TEST__,
  __DUNGEONS_ONLY__,
  __WORLD_MAPS__,
  MapName,
} from "../mapUtils";
import { buildMapIdPredicate } from "./useFilteredMarkers";

const unconfiguredMapId = 99999;

describe("buildMapIdPredicate", () => {
  test.each([
    [__ALL_MAPS__, 8, true],
    [__ALL_MAPS__, unconfiguredMapId, true],
    [__ALL_MAPS_BUT_DEFINED__, 8, false],
    [__ALL_MAPS_BUT_DEFINED__, unconfiguredMapId, true],
    [__ALL_MAPS_BUT_DEFINED_AND_TEST_DUNGEON__, 8, false],
    [__ALL_MAPS_BUT_DEFINED_AND_TEST_DUNGEON__, 37, false],
    [__ALL_MAPS_BUT_DEFINED_AND_TEST_DUNGEON__, unconfiguredMapId, true],
    [__ALL_MAPS_BUT_DUNGEONS_AND_TEST__, 49, false],
    [__ALL_MAPS_BUT_DUNGEONS_AND_TEST__, 37, false],
    [__ALL_MAPS_BUT_DUNGEONS_AND_TEST__, unconfiguredMapId, true],
    [__ALL_MAPS_BUT_TEST_DUNGEON__, 37, false],
    [__ALL_MAPS_BUT_TEST_DUNGEON__, unconfiguredMapId, true],
    [__ALL_MAPS_BUT_WORLD_MAP_AND_TEST__, 8, false],
    [__ALL_MAPS_BUT_WORLD_MAP_AND_TEST__, 37, false],
    [__ALL_MAPS_BUT_WORLD_MAP_AND_TEST__, 49, true],
    [__WORLD_MAPS__, 8, true],
    [__WORLD_MAPS__, 900, true],
    [__DUNGEONS_ONLY__, 49, true],
    [__DUNGEONS_ONLY__, 8, false],
    [MapName.TETHYS_DEEP, 900, true],
    [MapName.TETHYS_DEEP, 8, false],
  ])("scope %s includes map ID %i: %s", (selectedMap, mapId, expected) => {
    expect(buildMapIdPredicate(selectedMap, null)(mapId)).toBe(expected);
  });

  test("selected map ID overrides the selected map scope", () => {
    const matchesMapId = buildMapIdPredicate(__WORLD_MAPS__, 900);

    expect(matchesMapId(900)).toBe(true);
    expect(matchesMapId(8)).toBe(false);
  });
});
