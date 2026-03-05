'use client';

import { useState } from "react";
import { useMapEvents } from "react-leaflet";
import { translateMapToGameX, translateMapToGameY } from "../mapUtils";

export const CursorCoordinates = () => {
  const [coords, setCoords] = useState<{ x: number; y: number } | null>(null);

  useMapEvents({
    mousemove: (e) => {
      setCoords({
        x: translateMapToGameX(e.latlng.lng) / 10000,
        y: translateMapToGameY(e.latlng.lat) / 10000
      });
    },
    mouseout: () => {
      setCoords(null);
    }
  });

  if (!coords) return null;

  return (
    <div className="absolute bottom-4 right-4 z-[400] bg-base-100 px-3 py-1.5 rounded-lg border border-white/20 font-mono pointer-events-none flex gap-3">
      <div className="flex gap-1.5">
        <span className="opacity-50">X</span>
        <span>{coords.x.toFixed(0)}</span>
      </div>
      <div className="flex gap-1.5">
        <span className="opacity-50">Y</span>
        <span>{coords.y.toFixed(0)}</span>
      </div>
    </div>
  );
};
