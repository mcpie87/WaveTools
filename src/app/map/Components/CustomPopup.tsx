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

  const title = getTranslationMapName(marker);
  // const icon = getWorldmapIcon(title);

  return (
    <Popup autoPan={false}>
      <div className="flex flex-col gap-2">
        <div className="font-bold">{title}{showDescription && ` - ${marker.category}`}</div>
        {/* {icon && (
          <div className="border">
            <Image
              src={icon}
              height={64}
              width={64}
              alt={title}
              className="w-16 h-16"
            />
          </div>
        )} */}
        {showDescription && (
          <div className="text-xs italic mb-2">
            Translation: {translation}
          </div>
        )}
        <div>
          X: {parseFloat(marker.displayedX.toFixed(2))}, Y: {parseFloat(marker.displayedY.toFixed(2))}, Z: {parseFloat(marker.displayedZ.toFixed(2))}
        </div>
        <Button onClick={toggleVisited}>{visited ? "Uncheck" : "Check"}</Button>
        {showDescription && (
          <pre className="text-xs mt-2 max-h-[300px] overflow-auto">{marker.description}</pre>
        )}
      </div>
    </Popup>
  );
}