import { ASSET_URL } from "@/constants/constants";
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

const prefix = `${ASSET_URL}UIResources/UiWorldMap/`;

export const mapUrl: Record<number, string> = {
  8: `${prefix}/Image/MapTiles/T_MapTiles_{x}_{y}_UI.png`, // Main
  900: `${prefix}/Image/HHATiles/T_HHATiles_{x}_{y}_UI.png`, // Tethys Deep
  902: `${prefix}/Image/JKTiles/T_JKTiles_{x}_{y}_UI.png`, // Vault Undergrounds
  903: `${prefix}/Image/DDTTiles/T_DDTTiles_{x}_{y}_UI.png`, // Avinoleum
  905: `${prefix}/Image/YHSYCTiles/T_YHSYCTiles_{x}_{y}_UI.png`, // Fabricatorium of the Deep
  906: `${prefix}/Image/LHLTiles/T_LHLTiles_{x}_{y}_UI.png`, // Lahai Roi
  // 907: `${prefix}/Image/SUIBOTiles/T_SUIBOTiles_{x}_{y}_UI.png`, // Honami City - war area
  910: `${prefix}/Image/CAFETiles/T_CAFETiles_{x}_{y}_UI.png`, // Honami City
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