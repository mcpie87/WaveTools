'use client';

import { useMap } from "react-leaflet";
import { useMapStore } from "../state/mapStore";
import { useEffect } from "react";

export const MapFlyToHandler = () => {
  const map = useMap();
  const flyToCoord = useMapStore((state) => state.flyToCoord);
  const setFlyToCoord = useMapStore((state) => state.setFlyToCoord);

  useEffect(() => {
    if (flyToCoord) {
      map.flyTo([flyToCoord.lat, flyToCoord.lng], map.getZoom() < 4 ? 4 : map.getZoom(), {
        duration: 1.5,
      });
      // Clear it so it doesn't trigger again unless changed
      setFlyToCoord(null);
    }
  }, [flyToCoord, map, setFlyToCoord]);

  return null;
};
