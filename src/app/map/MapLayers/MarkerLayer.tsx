import { useCallback, useEffect, useMemo, useRef } from "react";
import { getWorldmapIcon } from "../TranslationMaps/worldmapIconMap";
import { UnionTranslationMap } from "../TranslationMaps/translationMap";
import { IMarker } from "../types";
import L from "leaflet";
import { DbMapData } from "@/types/mapTypes";
import { SingleMarker } from "./components/SingleMarker";
import { useMapViewBounds } from "../hooks/useMapViewBounds";
import RBush from "rbush";

interface MarkerLayerProps {
  markers: IMarker[];
  dbMapData: DbMapData;
  hideVisited: boolean;
  showDescriptions: boolean;
  activeAreaId: number | null;
  setActiveAreaId: (id: number | null) => void;
  toggleMarkerVisited: (marker: IMarker) => void;
}
export const MarkerLayer = ({
  markers, dbMapData, hideVisited, showDescriptions,
  activeAreaId, setActiveAreaId, toggleMarkerVisited,
}: MarkerLayerProps) => {
  const viewBounds = useMapViewBounds();
  const spatialIndex = useMemo(() => {
    const tree = new RBush<{ minX: number; minY: number; maxX: number; maxY: number; marker: IMarker }>();
    tree.load(markers.map(m => ({
      minX: m.x, maxX: m.x,
      minY: m.y, maxY: m.y,
      marker: m,
    })));
    return tree;
  }, [markers]);

  const iconCache = useRef(new Map<string, L.DivIcon>());
  useEffect(() => {
    iconCache.current.clear();
  }, [hideVisited]);

  const visibleMarkers = useMemo(() => {
    const sw = viewBounds.getSouthWest();
    const ne = viewBounds.getNorthEast();
    return spatialIndex.search({
      minX: sw.lng, minY: sw.lat,
      maxX: ne.lng, maxY: ne.lat,
    })
      .map(n => n.marker)
      .filter(m => !(hideVisited && m.visited));
  }, [spatialIndex, viewBounds, hideVisited]);

  const getIcon = useCallback((category: string, visited: boolean) => {
    const key = `${category}:${visited}:${hideVisited}`;

    // if (!isDevelopment() && iconCache.current.has(key)) {
    if (iconCache.current.has(key)) {
      return iconCache.current.get(key)!;
    }

    let html = '';
    let iconSize: L.PointExpression = [20, 20];
    let iconAnchor: L.PointExpression = [10, 10];

    const worldmapIconUrl = getWorldmapIcon(UnionTranslationMap[category]?.name ?? category);

    if (worldmapIconUrl) {
      // worldmap icon exists — style it nicely
      const opacity = visited && !hideVisited ? 0.3 : 1;
      const display = hideVisited && visited ? 'none' : 'inline-block';

      html = `
        <div style="
          display: ${display};
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid #aaa;
          background-color: #333;
          overflow: hidden;
          opacity: ${opacity};
          display: flex;
          align-items: center;
          justify-content: center;
        ">
          <img src="${worldmapIconUrl}" style="width:32px; height:32px; object-fit:contain;" />
        </div>
      `;

      iconSize = [32, 32];
      iconAnchor = [16, 16];
    } else {
      // fallback colored circle
      const hue = Math.abs([...category].reduce((a, c) => c.charCodeAt(0) + ((a << 5) - a), 0)) % 360;
      if (visited) {
        if (hideVisited) {
          html = `<div style="display:none"></div>`;
        } else {
          html = `<div class="w-5 h-5 rounded-full border border-white" style="background:hsl(${hue},70%,50%); opacity:0.3;"></div>`;
        }
      } else {
        html = `<div class="w-5 h-5 rounded-full border border-white" style="background:hsl(${hue},70%,50%)"></div>`;
      }
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

  const handleMarkerClick = useCallback((areaId: number | null) => {
    if (areaId !== activeAreaId) setActiveAreaId(areaId);
  }, [activeAreaId, setActiveAreaId]);

  const handleToggleMarkerVisited = useCallback((marker: IMarker) => {
    toggleMarkerVisited(marker);
  }, [toggleMarkerVisited]);

  return visibleMarkers.map((m) => (
    <SingleMarker
      // key={`${m.id}:${dbMapData.visitedMarkers[m.id as number]}:${hideVisited}`}
      key={`${m.id}`}
      marker={m}
      visited={!!dbMapData.visitedMarkers[m.id as number]}
      showDescriptions={showDescriptions}
      icon={getIcon(m.category, !!dbMapData.visitedMarkers[m.id as number])}
      toggleMarkerVisited={handleToggleMarkerVisited}
      onMarkerClick={handleMarkerClick}
    />
  ));
};