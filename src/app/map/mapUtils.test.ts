jest.mock("./data/map_marks", () => ({}));

import { translateGameToMap, translateMapToGame } from "./mapUtils";

describe("game and map coordinate translation", () => {
  test.each([
    { x: 0, y: 0, z: 0 },
    { x: 10000, y: -10000, z: 25000 },
    { x: -1234567, y: 987654, z: -3200 },
  ])("round trips game coordinates $x, $y, $z", (gameCoordinates) => {
    const mapCoordinates = translateGameToMap(gameCoordinates);

    expect(translateMapToGame(mapCoordinates).x).toBeCloseTo(gameCoordinates.x);
    expect(translateMapToGame(mapCoordinates).y).toBeCloseTo(gameCoordinates.y);
    expect(translateMapToGame(mapCoordinates).z).toBeCloseTo(gameCoordinates.z);
  });

  test("translates axes and height using the map coordinate convention", () => {
    expect(translateGameToMap({ x: 10000, y: 10000, z: 15000 })).toEqual({
      x: 256 + 0.30118,
      y: -0.30118,
      z: 1.5,
    });
    const gameCoordinates = translateMapToGame({ x: 256.30118, y: -0.30118, z: 1.5 });
    expect(gameCoordinates.x).toBeCloseTo(10000);
    expect(gameCoordinates.y).toBeCloseTo(10000);
    expect(gameCoordinates.z).toBe(15000);
  });
});
