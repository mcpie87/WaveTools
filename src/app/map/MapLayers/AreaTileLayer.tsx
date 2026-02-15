import { useMap } from "react-leaflet";
import { useEffect } from "react";
import L from 'leaflet';
import { ASSET_URL } from "@/constants/constants";
import { APIAreaLayer } from "@/types/mapTypes";

export function AreaTileLayer({ areaId, areaLayers }: { areaId: number, areaLayers: Map<number, APIAreaLayer> }) {
  const map = useMap();

  useEffect(() => {
    const area = areaLayers.get(areaId);
    if (!area) return;

    const tileLayer = L.tileLayer('', {
      tileSize: 256,
      noWrap: true,
      minZoom: -10,
      maxZoom: 10,
      minNativeZoom: 0,
      maxNativeZoom: 0,
      zIndex: 500,
      opacity: 0.85,
    });

    tileLayer.getTileUrl = ({ x, y }) => {
      const tileX = x;
      const tileY = -y;

      const entry = Object.entries(area.mapTiles).find(([key]) =>
        key.includes(`_${tileX}_${tileY}_`)
      );

      if (!entry) return '';

      return ASSET_URL + entry[1].replace(/^\/Game\/Aki\/UI\//, '');
    };

    tileLayer.addTo(map);

    return () => {
      map.removeLayer(tileLayer);
    };
  }, [map, areaId, areaLayers]);

  return null;
}