
import { APIMarker, IMarker } from "./types";

export const scaleFactor = 0.30118;

export const convertMarkerToCoord = (marker: APIMarker, visitedMap: Record<number, boolean>): IMarker => ({
  x: 256 + scaleFactor * (marker.Transform[0].X / 10000),
  y: -scaleFactor * (marker.Transform[0].Y / 10000),
  z: marker.Transform[0].Z / 10000,
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


const MAP_TILES_URL = "https://raw.githubusercontent.com/mcpie87/wuwa-map-tiles/refs/heads/master";
const prefix = MAP_TILES_URL;
// ? `${MAP_TILES_URL}` //'/map_tiles/'
// : `${ASSET_URL}UIResources/UiWorldMap/Image`;

const format = 'webp';

export const mapUrl: Record<number, string> = {
  8: `${prefix}/MapTiles/T_MapTiles_{x}_{y}_UI.${format}`, // Main
  900: `${prefix}/HHATiles/T_HHATiles_{x}_{y}_UI.${format}`, // Tethys Deep
  902: `${prefix}/JKTiles/T_JKTiles_{x}_{y}_UI.${format}`, // Vault Undergrounds
  903: `${prefix}/DDTTiles/T_DDTTiles_{x}_{y}_UI.${format}`, // Avinoleum
  905: `${prefix}/YHSYCTiles/T_YHSYCTiles_{x}_{y}_UI.${format}`, // Fabricatorium of the Deep
  906: `${prefix}/LHLTiles/T_LHLTiles_{x}_{y}_UI.${format}`, // Lahai Roi
  // 907: `${prefix}/SUIBOTiles/T_SUIBOTiles_{x}_{y}_UI.${format}`, // Honami City - war area
  910: `${prefix}/CAFETiles/T_CAFETiles_{x}_{y}_UI.${format}`, // Honami City
};

export const mapIdToName: Map<number, string> = new Map([
  [8, 'Solaris-3'],
  [900, 'Tethys Deep'],
  [902, 'Vault Undergrounds'],
  [903, 'Avinoleum'],
  [905, 'Fabricatorium of the Deep'],
  [910, 'Honami City'],
  [906, 'Lahai Roi'],
]);