import { APIMarker, IMarker } from "./types";

export const scaleFactor = 0.30118;
export const TILE_SIZE = 256;

const translateGameToMapX = (x: number) => TILE_SIZE + scaleFactor * (x / 10000);
const translateGameToMapY = (y: number) => -scaleFactor * (y / 10000);
const translateGameToMap = ({ x, y, z }: { x: number; y: number; z: number }) => ({
  x: translateGameToMapX(x),
  y: translateGameToMapY(y),
  z: z / 10000,
});
const translateMapToGameX = (x: number) => (x - TILE_SIZE) * 10000 / scaleFactor;
const translateMapToGameY = (y: number) => -y * 10000 / scaleFactor;
// const translateMapToGame = ({ x, y, z }: { x: number; y: number; z: number }) => ({
//   x: translateMapToGameX(x),
//   y: translateMapToGameY(y),
//   z: z * 10000,
// });
export const getGameBounds = (mapName: MapName) => {
  const { bounds } = mapConfigs[mapName];
  return [
    [translateMapToGameY(bounds[0][0] * TILE_SIZE), translateMapToGameY(bounds[0][1] * TILE_SIZE)],
    [translateMapToGameX(bounds[1][0] * TILE_SIZE), translateMapToGameX(bounds[1][1] * TILE_SIZE)],
  ]
}
export const isGameCoordInGameBounds = (mapName: MapName, x: number, y: number) => {
  const bounds = getGameBounds(mapName);
  // y is REVERSED due to map translation
  return bounds[0][1] <= y && y <= bounds[0][0] && bounds[1][0] <= x && x <= bounds[1][1];
}
export const getMapCenter = (mapName: MapName): L.LatLngExpression => {
  const bounds = mapConfigs[mapName].bounds;
  return [
    (bounds[0][0] + bounds[0][1]) * (TILE_SIZE) / 2,
    (bounds[1][0] + bounds[1][1]) * (TILE_SIZE) / 2
  ]
}

export const convertMarkerToCoord = (marker: APIMarker, visitedMap: Record<number, boolean>): IMarker => ({
  ...translateGameToMap({
    x: marker.Transform[0].X,
    y: marker.Transform[0].Y,
    z: marker.Transform[0].Z,
  }),
  id: marker.Id,
  areaId: marker.AreaId!,
  name: marker.BlueprintType,
  description: JSON.stringify(marker, null, 2),
  displayedX: marker.Transform[0].X / 10000,
  displayedY: marker.Transform[0].Y / 10000,
  displayedZ: marker.Transform[0].Z / 10000,
  category: marker.BlueprintType,
  visited: visitedMap[marker.MapId] || false,
});


export const MAP_TILES_URL = "https://raw.githubusercontent.com/mcpie87/wuwa-map-tiles/refs/heads/master";
const prefix = MAP_TILES_URL;
// ? `${MAP_TILES_URL}` //'/map_tiles/'
// : `${ASSET_URL}UIResources/UiWorldMap/Image`;

const format = 'webp';


export enum MapName {
  SOLARIS_3 = "Solaris-3",
  RINASCITA = "Rinascita",
  SEPTIMONT = "Septimont",
  TETHYS_DEEP = "Tethys Deep",
  VAULT_UNDERGROUNDS = "Vault Undergrounds",
  AVINOLEUM = "Avinoleum",
  FABRICATORIUM = "Fabricatorium of the Deep",
  // HONAMI_CITY_WAR = "Honami City - war area",
  HONAMI_CITY = "Honami City",
  LAHAI_ROI = "Lahai Roi",
  ROYA_FROSTLANDS = "Roya Frostlands",
}

export interface MapConfig {
  mapId: number;
  bounds: number[][];
  url: string;
}
// bounds is [minY, maxY], [minX, maxX]
// keep in mind, game inverts Y
export const mapConfigs: Record<string, MapConfig> = {
  [MapName.SOLARIS_3]: {
    mapId: 8,
    bounds: [[-5, 2], [-2, 6]],
    url: `${prefix}/MapTiles/T_MapTiles_{x}_{y}_UI.${format}`
  },
  [MapName.RINASCITA]: {
    mapId: 8,
    bounds: [[-12, -2], [8, 15]],
    url: `${prefix}/MapTiles/T_MapTiles_{x}_{y}_UI.${format}`
  },
  [MapName.SEPTIMONT]: {
    mapId: 8,
    bounds: [[-18, -11], [13, 18]],
    url: `${prefix}/MapTiles/T_MapTiles_{x}_{y}_UI.${format}`
  },
  [MapName.TETHYS_DEEP]: {
    mapId: 900,
    bounds: [[-2, 1], [0, 2]],
    url: `${prefix}/HHATiles/T_HHATiles_{x}_{y}_UI.${format}`
  },
  [MapName.VAULT_UNDERGROUNDS]: {
    mapId: 902,
    bounds: [[-2, 1], [2, 6]],
    url: `${prefix}/JKTiles/T_JKTiles_{x}_{y}_UI.${format}`
  },
  [MapName.AVINOLEUM]: {
    mapId: 903,
    bounds: [[-2, 2], [-1, 3]],
    url: `${prefix}/DDTTiles/T_DDTTiles_{x}_{y}_UI.${format}`
  },
  [MapName.FABRICATORIUM]: {
    mapId: 905,
    bounds: [[-6, 4], [-6, 7]],
    url: `${prefix}/YHSYCTiles/T_YHSYCTiles_{x}_{y}_UI.${format}`
  },
  [MapName.LAHAI_ROI]: {
    mapId: 906,
    bounds: [[3, 13], [-6, 5]],
    url: `${prefix}/LHLTiles/T_LHLTiles_{x}_{y}_UI.${format}`
  },
  // [MapName.HONAMI_CITY_WAR]: {
  //   mapId: 907,
  //   bounds: [[-4, 2], [-1, 2]],
  //   url: `${prefix}/SUIBOTiles/T_SUIBOTiles_{x}_{y}_UI.${format}`
  // },
  [MapName.HONAMI_CITY]: {
    mapId: 910,
    bounds: [[-1, 1], [0, 2]],
    url: `${prefix}/CAFETiles/T_CAFETiles_{x}_{y}_UI.${format}`
  },
  [MapName.ROYA_FROSTLANDS]: {
    mapId: 8,
    bounds: [[4, 14], [-5, 3]],
    url: `${prefix}/MapTiles/T_MapTiles_{x}_{y}_UI.${format}`
  },
} as const;
