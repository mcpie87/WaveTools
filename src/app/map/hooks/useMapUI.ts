import { useState, useMemo } from "react";
import { SelectedMap } from "@/types/mapTypes";
import { MapName } from "../mapUtils";

export function useMapUI() {
  const [selectedMap, setSelectedMap] = useState<SelectedMap>(MapName.SOLARIS_3);
  const [activeAreaId, setActiveAreaId] = useState<number | null>(null);
  const [selectedMapId, setSelectedMapId] = useState<number | null>(null);
  const [enableClick, setEnableClick] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0, z: 0 });
  const [radius, setRadius] = useState(50);
  const [showDescriptions, setShowDescriptions] = useState(false);
  const [hideVisited, setHideVisited] = useState(false);

  return useMemo(() => ({
    activeAreaId, setActiveAreaId,
    selectedMap, setSelectedMap,
    selectedMapId, setSelectedMapId,
    enableClick, setEnableClick,
    coords, setCoords,
    radius, setRadius,
    showDescriptions, setShowDescriptions,
    hideVisited, setHideVisited
  }), [
    activeAreaId, selectedMap, selectedMapId, enableClick,
    coords, radius, showDescriptions, hideVisited
  ]);
}