import { useCallback, useState } from "react";
import { useMap, useMapEvent } from "react-leaflet";
import L from "leaflet";
import { useThrottledCallback } from "use-debounce";

export function useMapViewBounds(paddingPx = 300) {
  const map = useMap();
  const getPaddedBounds = useCallback(() => {
    const bounds = map.getBounds();

    const ne = map.containerPointToLatLng(
      map.latLngToContainerPoint(bounds.getNorthEast()).add([paddingPx, -paddingPx])
    );
    const sw = map.containerPointToLatLng(
      map.latLngToContainerPoint(bounds.getSouthWest()).add([-paddingPx, paddingPx])
    );

    return L.latLngBounds(sw, ne);
  }, [map, paddingPx]);

  const [viewBounds, setViewBounds] = useState(getPaddedBounds);

  const updateBounds = useThrottledCallback(() => {
    setViewBounds(getPaddedBounds())
  }, 200);

  useMapEvent('move', updateBounds);
  useMapEvent('zoomend', updateBounds);

  return viewBounds;
}