import { useCallback, useEffect, useRef } from "react";
import { getWorldmapIconFromMarker } from "../TranslationMaps/worldmapIconMap";
import { IMarker } from "../types";
import L from "leaflet";
import { SingleMarker } from "./components/SingleMarker";
import { useVisibleMarkers } from "./hooks/useVisibleMarkers";
import { useMapStore } from "../state/mapStore";
import { DEV_CONFIG, IS_DEV } from "@/config/dev";

interface MarkerLayerProps {
  markers: IMarker[];
}
export const MarkerLayer = ({ markers }: MarkerLayerProps) => {
  const visibleMarkers = useVisibleMarkers(markers);
  const hideVisited = useMapStore((state) => state.hideVisited);

  console.log("[MarkerLayer] Markers:", markers.length);
  console.log("[MarkerLayer] Visible markers:", visibleMarkers.length);

  const iconCache = useRef(new Map<string, L.DivIcon>());
  useEffect(() => {
    iconCache.current.clear();
  }, [hideVisited]);

  const getIcon = useCallback((marker: IMarker, visited: boolean, selected: boolean) => {
    const iconData = getWorldmapIconFromMarker(marker);
    const worldmapIconUrl = iconData?.[0];
    const ignoreMarkerBg = iconData?.[1];
    const key = `${marker.category}:${worldmapIconUrl}:${visited}:${selected}:${hideVisited}`;

    const shouldBypassCache = IS_DEV && DEV_CONFIG.map.marker.bypassIconCache;
    if (!shouldBypassCache && iconCache.current.has(key)) {
      return iconCache.current.get(key)!;
    }

    let html = '';
    let iconSize: L.PointExpression = [20, 20];
    let iconAnchor: L.PointExpression = [10, 10];


    const ringColor = selected ? 'yellow' : '#aaa';
    const ringWidth = selected ? '3px' : '2px';

    if (worldmapIconUrl) {
      const mainOpacity = visited && !hideVisited ? 0.3 : 1;
      const display = hideVisited && visited ? 'none' : 'inline-block';

      const markerSize = ignoreMarkerBg ? 40 : 32;
      const markerBody = `
        <img src="${worldmapIconUrl}" style="width:${markerSize}px; height:${markerSize}px; object-fit:contain;" />
      `

      html = ignoreMarkerBg
        ? markerBody
        : `
        <div style="
          display: ${display};
          width: 32px;
          height: 32px;
          position: relative;
          overflow: visible;
        ">
          <!-- Selection Ring (Always 1.0 opacity) -->
          <div style="
            position: absolute;
            inset: 0;
            border-radius: 50%;
            border: ${ringWidth} solid ${ringColor};
            z-index: 2;
            pointer-events: none;
          "></div>
          <!-- Marker Body (Transparent if visited) -->
        <div style="
          position: absolute;
          inset: 0;
          border-radius: 50%;
          background-color: #333;
          opacity: ${mainOpacity};
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1;
          overflow: hidden;
        ">
          ${markerBody}
          </div>
        </div>
      `;

      iconSize = [markerSize, markerSize];
      iconAnchor = [markerSize / 2, markerSize / 2];
    } else {
      // fallback colored circle
      const hue =
        Math.abs(
          [...marker.category].reduce(
            (a, c) => c.charCodeAt(0) + ((a << 5) - a),
            0
          )
        ) % 360;

      const display = hideVisited && visited ? 'none' : 'inline-block';
      const mainOpacity = visited && !hideVisited ? 0.3 : 1;
      const selectionStyles = selected ? `border: 3px solid #eab308; box-shadow: 0 0 10px #eab308;` : `border: 1px solid white;`;

      html = `
        <div style="
          display: ${display};
          width: 20px;
          height: 20px;
          position: relative;
        ">
          <!-- Selection Ring -->
          <div style="
            position: absolute;
            inset: 0;
            border-radius: 50%;
            ${selectionStyles}
            z-index: 2;
          "></div>

          <!-- Marker Body -->
          <div style="
            position: absolute;
            inset: 0;
            border-radius: 50%;
            background: hsl(${hue},70%,50%);
            opacity: ${mainOpacity};
            z-index: 1;
          "></div>
        </div>
      `;
    }

    const icon = L.divIcon({
      html,
      className: '',
      iconSize,
      iconAnchor,
    });

    iconCache.current.set(key, icon);
    return icon;
  }, [hideVisited]);

  return visibleMarkers.map((m) => (
    <SingleMarker key={`${m.id}`} marker={m} getIcon={getIcon} />
  ));
};