import { useMapEvent } from "react-leaflet";

interface MapClickHandlerProps {
  enabled: boolean;
  onClick: (p: L.LatLng) => void;
}

export function MapClickHandler({ enabled, onClick }: MapClickHandlerProps) {
  useMapEvent('click', e => {
    if (enabled) onClick(e.latlng);
  });
  return null;
}