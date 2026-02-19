import { useMap } from "react-leaflet";
import { useEffect } from "react";
import { APIAreaLayer } from "@/types/mapTypes";
import { PMTileLayer } from "@/services/tiles";

export function AreaTileLayer({ areaId, areaLayers }: { areaId: number, areaLayers: Map<number, APIAreaLayer> }) {
  const map = useMap();

  useEffect(() => {
    const area = areaLayers.get(areaId);
    if (!area) return;
    const { mapTiles } = area;
    let areaLayerURL: string | undefined;
    for (const key in mapTiles) {
      areaLayerURL = mapTiles[key];
      break;
    }
    if (!areaLayerURL) return;

    const tileLayer = new PMTileLayer(areaLayerURL, {
      tileSize: 256,
      noWrap: true,
      minZoom: -10,
      maxZoom: 10,
      minNativeZoom: 0,
      maxNativeZoom: 0,
      zIndex: 500,
      opacity: 0.85,
    });

    tileLayer.addTo(map);

    return () => {
      map.removeLayer(tileLayer);
    };
  }, [map, areaId, areaLayers]);

  return null;
}