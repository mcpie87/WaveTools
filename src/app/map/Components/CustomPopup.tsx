import { translateBlueprint } from "../BlueprintTranslationService";
import { IMarker } from "../types";
import { Button } from "@/components/ui/button";
import { Popup } from "react-leaflet";
import { getTranslationMapName } from "../TranslationMaps/translationMap";
// import { getWorldmapIcon } from "../TranslationMaps/worldmapIconMap";
// import Image from "next/image";

interface CustomPopupProps {
  marker: IMarker;
  toggleVisited: () => void;
  showDescription: boolean;
  visited: boolean;
}
export function CustomPopup({
  marker,
  toggleVisited,
  showDescription,
  visited,
}: CustomPopupProps) {
  const translation = translateBlueprint(marker.category); // synchronous

  const title = marker.questData?.name || getTranslationMapName(marker);

  return (
    <Popup autoPan={false}>
      <div className="flex flex-col gap-2">
        <div className="font-bold flex items-center justify-center">
          {title}{showDescription && ` - ${marker.category}`}
        </div>
        {showDescription && (
          <div className="text-xs italic mb-2">
            Translation: {translation}
          </div>
        )}
        {marker.questData && (
          <div className="text-xs italic mb-2">
            {marker.questData.description}
          </div>
        )}
        <div className="bg-base-100 px-3 py-1.5 rounded-lg border border-white/20 font-mono flex gap-3">
          <div className="flex gap-1.5">
            <span className="opacity-50">X</span>
            <span>{marker.displayedX.toFixed(2)}</span>
          </div>
          <div className="flex gap-1.5">
            <span className="opacity-50">Y</span>
            <span>{marker.displayedY.toFixed(2)}</span>
          </div>
          <div className="flex gap-1.5">
            <span className="opacity-50">Z</span>
            <span>{marker.displayedZ.toFixed(2)}</span>
          </div>
        </div>
        <Button onClick={toggleVisited}>{visited ? "Uncheck" : "Check"}</Button>
        {showDescription && marker.mapMark && (
          <div className="text-xs italic mb-2">
            Map Mark: {marker.mapMark && JSON.stringify(marker.mapMark)}
          </div>
        )}
        {showDescription && marker.questData && (
          <div className="text-xs italic mb-2">
            Quest:
            <pre>{JSON.stringify(marker.questData, null, 2)}</pre>
          </div>
        )}
        {showDescription && (
          <div className="text-xs italic mb-2 overflow-scroll max-h-[400px]">
            References:
            <pre>
              {JSON.stringify(marker.references, null, 2)}
            </pre>
          </div>
        )}
        {showDescription && (
          <pre className="text-xs mt-2 max-h-[300px] overflow-auto">{marker.description}</pre>
        )}
      </div>
    </Popup>
  );
}