jest.mock("@/app/map/data/map_marks", () => ({}));

import { getLayerName, getPMTilesUrl } from "./urlUtils";
import { MAP_TILES_URL } from "@/app/map/mapUtils";

describe("tile URL parsing", () => {
  test.each([
    ["/MapTiles/T_MapTiles_2_3_UI.webp", "MapTiles_UI"],
    ["/MapTiles/T_MapTiles_-2_-3_UI.webp", "MapTiles_UI"],
    ["/MapTiles/T_MapTiles_-2_3_4_UI.webp", "MapTiles_UI"],
  ])("parses layer name from %s", (url, expectedLayer) => {
    expect(getLayerName(url)).toBe(expectedLayer);
    expect(getPMTilesUrl(url)).toBe(`${MAP_TILES_URL}/pmtiles/${expectedLayer}.pmtiles`);
  });

  test("rejects URLs that do not contain a tile layer filename", () => {
    expect(() => getLayerName("/MapTiles/invalid.webp")).toThrow("Invalid layer URL format");
    expect(() => getPMTilesUrl("/MapTiles/invalid.webp")).toThrow("Invalid layer URL format");
  });
});
