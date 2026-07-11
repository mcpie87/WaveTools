'use client';

import { useState } from "react";
import { useMapEvents } from "react-leaflet";
import { mapConfigs, TILE_SIZE, translateMapToGameX, translateMapToGameY } from "../mapUtils";
import { IS_DEV } from "@/config/dev";
import { useMapStore } from "../state/mapStore";

export const CursorCoordinates = () => {
  const [coords, setCoords] = useState<{ x: number; y: number; tileX: number; tileY: number } | null>(null);
  const selectedMap = useMapStore(s => s.selectedMap);

  useMapEvents({
    mousemove: (e) => {
      setCoords({
        x: translateMapToGameX(e.latlng.lng) / 10000,
        y: translateMapToGameY(e.latlng.lat) / 10000,
        tileX: Math.floor(e.latlng.lng / TILE_SIZE),
        tileY: -Math.floor(-e.latlng.lat / TILE_SIZE),
      });
    },
    mouseout: () => {
      setCoords(null);
    }
  });

  if (!coords) return null;

  let tileName = "";
  if (IS_DEV) {
    const mapConfig = mapConfigs[selectedMap];
    if (mapConfig && mapConfig.url) {
      tileName = mapConfig.url
        .split('/')
        .pop()!
        .replace('{x}', coords.tileX.toString())
        .replace('{y}', coords.tileY.toString());
    }
  }

  return (
    <div className="absolute bottom-4 right-4 z-[400] bg-base-100 px-3 py-1.5 rounded-lg border border-white/20 font-mono pointer-events-none flex flex-col gap-1 items-end">
      <div className="flex gap-3">
        <div className="flex gap-1.5">
          <span className="opacity-50">X</span>
          <span>{coords.x.toFixed(0)}</span>
        </div>
        <div className="flex gap-1.5">
          <span className="opacity-50">Y</span>
          <span>{coords.y.toFixed(0)}</span>
        </div>
      </div>
      {IS_DEV && tileName && (
        <div className="text-xs opacity-75 flex flex-col items-end">
          <span>Tile: [{coords.tileX}, {coords.tileY}]</span>
          <span>{tileName}</span>
        </div>
      )}
    </div>
  );
};
