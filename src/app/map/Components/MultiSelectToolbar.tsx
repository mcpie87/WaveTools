'use client';

import { useMapStore } from "../state/mapStore";
import { X } from "lucide-react";
import { IMarker } from "../types";
import { useMemo } from "react";
import { getWorldmapIcon } from "../TranslationMaps/worldmapIconMap";
import { UnionTranslationMap } from "../TranslationMaps/translationMap";
import Image from "next/image";
import { Button } from "@/components/ui/button";

interface MultiSelectToolbarProps {
  displayedMarkers: IMarker[];
}

export const MultiSelectToolbar = ({ displayedMarkers }: MultiSelectToolbarProps) => {
  const multiSelectMode = useMapStore((state) => state.multiSelectMode);
  const selectedMarkerIds = useMapStore((state) => state.selectedMarkerIds);
  const setMultiSelectMode = useMapStore((state) => state.setMultiSelectMode);
  const setFlyToCoord = useMapStore((state) => state.setFlyToCoord);
  const clearSelectedMarkers = useMapStore((state) => state.clearSelectedMarkers);
  const bulkSetMarkersVisited = useMapStore((state) => state.bulkSetMarkersVisited);

  const selectedMarkers = useMemo(() => {
    return displayedMarkers.filter(m => selectedMarkerIds.has(m.id as number));
  }, [displayedMarkers, selectedMarkerIds]);

  if (!multiSelectMode) return null;

  const selectedCount = selectedMarkerIds.size;
  const selectedArray = Array.from(selectedMarkerIds);

  const handleMarkVisited = () => {
    if (selectedCount === 0) return;
    bulkSetMarkersVisited(selectedArray, true);
  };

  const handleMarkUnvisited = () => {
    if (selectedCount === 0) return;
    bulkSetMarkersVisited(selectedArray, false);
  };

  const displayedInGrid = selectedMarkers.slice(0, 30);
  const hasMore = selectedMarkers.length > 30;

  return (
    <div className="flex items-center gap-1 bg-base-200 rounded-xl pl-4 pr-2 py-1.5 duration-300 pointer-events-auto">
      {/* Counter */}
      <div className="flex flex-col items-center leading-none border-r border-white/10 pr-4">
        <span className="">{selectedCount}</span>
      </div>

      {/* Icons - grid layout */}
      <div className="grid grid-cols-10 gap-1 w-[316px] min-h-[30px] items-start">
        {displayedInGrid.map((marker, idx) => {
          const isMoreSlot = hasMore && idx === 29;
          const iconUrl = getWorldmapIcon(UnionTranslationMap[marker.category]?.name ?? marker.category);

          if (isMoreSlot) {
            return (
              <div
                key="more-icon"
                className="w-7 h-7 border border-white/10 rounded-full flex items-center justify-center text-[10px] text-white/50 bg-white/5"
              >
                +{selectedMarkers.length - 29}
              </div>
            );
          }

          return (
            <div
              key={marker.id}
              onClick={() => setFlyToCoord({ lat: marker.y, lng: marker.x })}
              className="w-7 h-7 border-2 bg-[#333] border-primary rounded-full flex items-center justify-center flex-shrink-0 cursor-pointer hover:bg-base-400 transition-colors"
            >
              {iconUrl ? (
                <Image src={iconUrl} alt="" className="w-5 h-5 object-contain" width={20} height={20} />
              ) : (
                <div className="w-3 h-3 rounded-full bg-yellow-500/30" />
              )}
            </div>
          );
        })}
      </div>

      <div className="h-6 w-px bg-white/10" />

      {/* Actions */}
      <div className="flex items-center gap-1">
        <Button
          onClick={handleMarkVisited}
          disabled={selectedCount === 0}
          className=""
        >
          Mark
        </Button>
        <Button
          onClick={handleMarkUnvisited}
          disabled={selectedCount === 0}
          className=""
        >
          Unmark
        </Button>
        <Button
          onClick={clearSelectedMarkers}
          disabled={selectedCount === 0}
          className=""
        >
          Clear
        </Button>
      </div>

      <button
        onClick={() => setMultiSelectMode(false)}
        className="ml-1 rounded-full hover:bg-base-400 transition-colors"
      >
        <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
};
