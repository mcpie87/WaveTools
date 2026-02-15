import { useMap } from "react-leaflet";
import { getBounds, MapName, TILE_SIZE } from "../mapUtils";
import { useEffect, useRef } from "react";
import L from 'leaflet';

export function CustomTileLayer({ mapName, url, shouldDim }: { mapName: MapName; url: string; shouldDim: boolean }) {
  const map = useMap();
  const layerRef = useRef<L.TileLayer | null>(null);

  useEffect(() => {
    const tileLayer = L.tileLayer('', {
      tileSize: TILE_SIZE,
      noWrap: true,
      minZoom: -10,
      bounds: getBounds(mapName),
      maxZoom: 10,
      minNativeZoom: 0,
      maxNativeZoom: 0,
      opacity: 1,
    });


    tileLayer.getTileUrl = ({ x, y }) =>
      url.replace('{x}', `${x}`).replace('{y}', `${-y}`);

    tileLayer.addTo(map);
    layerRef.current = tileLayer;

    return () => {
      map.removeLayer(tileLayer);
    };
  }, [map, mapName, url]);

  useEffect(() => {
    if (layerRef.current) {
      layerRef.current.setOpacity(shouldDim ? 0.5 : 1);
    }
  }, [shouldDim]);

  return null;
}
