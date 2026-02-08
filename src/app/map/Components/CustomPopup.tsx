import { translateBlueprint } from "../BlueprintTranslationService";
import { IMarker } from "../types";
import { Button } from "@/components/ui/button";
import { Popup } from "react-leaflet";
import { CasketTranslationMap, CollectTranslationMap, FrostlandsTranslationMap, MonsterTranslationMap, ChestTranslationMap, TeleporterTranslationMap, TidalHeritageTranslationMap, TranslationMap, AnimalTranslationMap, PuzzleTranslationMap } from "../TranslationMaps/translationMap";

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

  const title =
    FrostlandsTranslationMap[marker.category]?.name ??
    ChestTranslationMap[marker.category]?.name ??
    TranslationMap[marker.category]?.name ??
    CasketTranslationMap[marker.category]?.name ??
    TidalHeritageTranslationMap[marker.category]?.name ??
    MonsterTranslationMap[marker.category]?.name ??
    CollectTranslationMap[marker.category]?.name ??
    TeleporterTranslationMap[marker.category]?.name ??
    AnimalTranslationMap[marker.category]?.name ??
    PuzzleTranslationMap[marker.category]?.name ??
    "";

  return (
    <Popup>
      <div className="flex flex-col gap-2">
        <div className="font-bold">{title}{showDescription && ` - ${marker.category}`}</div>
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