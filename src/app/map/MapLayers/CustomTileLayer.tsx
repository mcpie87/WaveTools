import { useMap } from "react-leaflet";
import { getBounds, mapConfigs, MapName, TILE_SIZE } from "../mapUtils";
import { useEffect, useRef } from "react";
import { PMTileLayer } from "@/services/tiles";

interface CustomTileLayerProps {
  mapName: MapName;
  shouldDim: boolean;
}
export function CustomTileLayer({ mapName, shouldDim }: CustomTileLayerProps) {
  const map = useMap();
  const layerRef = useRef<PMTileLayer | null>(null);

  useEffect(() => {
    const { url } = mapConfigs[mapName];
    if (!url) return;
    const tileLayer = new PMTileLayer(url, {
      tileSize: TILE_SIZE,
      noWrap: true,
      minZoom: -10,
      maxZoom: 10,
      minNativeZoom: 0,
      maxNativeZoom: 0,
      bounds: getBounds(mapName),
      opacity: 1,
    });
    tileLayer.addTo(map);
    layerRef.current = tileLayer;
    return () => { map.removeLayer(tileLayer); };
  }, [map, mapName]);

  useEffect(() => {
    layerRef.current?.setOpacity(shouldDim ? 0.5 : 1);
  }, [shouldDim]);

  return null;
}