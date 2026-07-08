import { translateBlueprint } from "../BlueprintTranslationService";
import { IMarker } from "../types";
import { Button } from "@/components/ui/button";
import { Popup } from "react-leaflet";
import { getTranslationMapName, filterTrackedCategoriesForMarker } from "../TranslationMaps/translationMap";
import { useMapStore } from "../state/mapStore";
import { NO_DATA_STRING } from "@/constants/constants";
import { getQuestInfo } from "../data/map_marks";

interface CustomPopupProps {
  marker: IMarker;
  showDescription: boolean;
}
export function CustomPopup({
  marker,
  showDescription,
}: CustomPopupProps) {
  const translation = translateBlueprint(marker.category); // synchronous

  const title = marker.questData?.name || getTranslationMapName(marker);
  const toggleEntityCategoryVisited = useMapStore(s => s.toggleEntityCategoryVisited);
  const dbMapData = useMapStore(s => s.dbMapData);

  const entityKey = `e_${marker.mapId}_${marker.entityId}`;
  const visitedSet = dbMapData.visitedEntities[entityKey] || new Set();
  const matchedCategories = filterTrackedCategoriesForMarker(marker);

  const isLevelDataRefSameAsChildren = marker.levelPlayReferences
    && marker.levelPlayChildren
    && marker.levelPlayReferences.length === 1
    && marker.levelPlayChildren.length === 1
    && marker.levelPlayChildren[0] === marker.levelPlayReferences[0];

  const isQuestDataRefSameAsChildren = marker.questReferences
    && marker.questChildren
    && marker.questReferences.length === 1
    && marker.questChildren.length === 1
    && marker.questChildren[0] === marker.questReferences[0];

  return (
    <Popup autoPan={false}>
      <div className="flex flex-col gap-1">
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
            {marker.questData.chapterName &&
              marker.questData.chapterName !== NO_DATA_STRING && (
                <div className="font-semibold">
                  Chapter: {marker.questData.chapterName}
                </div>
              )
            }
            <div className="text-secondary">{marker.questData.description}</div>
          </div>
        )}
        {marker.questReferences && ((marker.questData && marker.questReferences.find(e => e.id !== marker.questData!.id)) || !marker.questData) && (
          <div className="text-xs italic mb-2">
            Quest Reference of:
            {marker.questReferences.map(e => (
              <div key={e.name} className="text-blue-400">{e.name}</div>
            ))}
          </div>
        )}
        {marker.questChildren && !isQuestDataRefSameAsChildren && ((marker.questData && marker.questChildren.find(e => e.id !== marker.questData!.id)) || !marker.questData) && (
          <div className="text-xs italic mb-2">
            Quest Child of:
            {marker.questChildren.map(e => (
              <div key={e.name} className="text-blue-400">{e.name}</div>
            ))}
          </div>
        )}
        {marker.levelPlayChildren && !isLevelDataRefSameAsChildren && ((marker.levelPlayData && marker.levelPlayChildren.find(e => e.Id !== marker.levelPlayData!.LevelPlayId)) || !marker.levelPlayData) && (
          <div className="text-xs italic mb-2">
            LP Child of:
            {marker.levelPlayChildren.map(e => (
              <div key={e.Key} className="text-blue-400">{`[${e.Type}][${e.Id}][Key: ${e.Key}]`}</div>
            ))}
          </div>
        )}
        {marker.levelPlayReferences && ((marker.levelPlayData && marker.levelPlayReferences.find(e => e.Id !== marker.levelPlayData!.LevelPlayId)) || !marker.levelPlayData) && (
          <div className="text-xs italic mb-2">
            LP Reference of:
            {marker.levelPlayReferences.map(e => (
              <>
                <div key={e.Key} className="text-blue-400">
                  {`[${e.Type}][${e.Id}][Key: ${e.Key}`}
                </div>
                {e.Translations && e.Translations.length > 0 && (
                  <>
                    <span>Steps:</span>
                    <div>
                      {e.Translations.map(([step, translation]) => (
                        <div key={step} className="text-blue-400">
                          {step}: {translation}
                        </div>
                      ))}
                    </div>
                  </>
                )}
                {e.Condition && e.Condition.length > 0 && (
                  <>
                    <span>Conditions:</span>
                    <div>
                      {e.Condition.map(({ Type, PreLevelPlay, PreQuest, PreChildQuest, Config, ExploreLevel }) => {
                        const questName = PreQuest && getQuestInfo(PreQuest)?.name
                          || PreChildQuest?.QuestId && `${getQuestInfo(PreChildQuest.QuestId)?.name} - ${PreChildQuest.ChildQuestId}`
                          || Type === "SystemState" && Config && `[Type: ${Config.Type}, RoadId: ${Config.RoadId}, IsBuilt: ${Config.IsBuilt}]`
                          || Type === "ExploreLevel" && ExploreLevel
                          || NO_DATA_STRING;
                        return (
                          <div key={Type} className="text-blue-400">
                            {Type}: {PreLevelPlay || questName}
                          </div>
                        );
                      })}
                    </div>
                  </>
                )}
              </>
            ))}
          </div>
        )}
        {marker.mapMark && title !== marker.mapMark.title && (
          <div className="text-xs italic mb-2">
            {marker.mapMark.title}
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

        {matchedCategories.length > 0 && (
          <div className="flex flex-col gap-1 w-full mt-2">
            {matchedCategories.map(cat => {
              const isVisited = visitedSet.has(cat.key);
              return (
                <Button
                  key={cat.key}
                  onClick={() => toggleEntityCategoryVisited(marker, cat.key)}
                >
                  {isVisited ? "Uncheck" : "Check"}{matchedCategories.length === 1 ? "" : " " + cat.name}
                </Button>
              )
            })}
          </div>
        )}
        {showDescription && (
          <div className="max-h-[600px] overflow-scroll">
            {marker.rewards && (
              <div className="text-xs italic mb-2 overflow-scroll max-h-[200px]">
                Rewards:
                <pre>{JSON.stringify(marker.rewards, null, 2)}</pre>
              </div>
            )}
            {marker.mapMark && (
              <div className="text-xs italic mb-2">
                Map Mark: {marker.mapMark && JSON.stringify(marker.mapMark)}
              </div>
            )}
            {marker.questData && (
              <div className="text-xs italic mb-2 overflow-scroll max-h-[200px]">
                Quest:
                <pre>{JSON.stringify(marker.questData, null, 2)}</pre>
              </div>
            )}
            {marker.questChildren && (marker.questData && marker.questChildren.find(e => e.id !== marker.questData!.id)) && (
              <div className="text-xs italic mb-2 overflow-scroll max-h-[200px]">
                Quest Children:
                <pre>{JSON.stringify(marker.questChildren, null, 2)}</pre>
              </div>
            )}
            {marker.questReferences && (marker.questData && marker.questReferences.find(e => e.id !== marker.questData!.id)) && (
              <div className="text-xs italic mb-2 overflow-scroll max-h-[200px]">
                Quest References:
                <pre>{JSON.stringify(marker.questReferences, null, 2)}</pre>
              </div>
            )}
            {marker.levelPlayChildren && (
              <div className="text-xs italic mb-2 overflow-scroll max-h-[200px]">
                LP Children:
                <pre>{JSON.stringify(marker.levelPlayChildren, null, 2)}</pre>
              </div>
            )}
            {marker.levelPlayReferences && (
              <div className="text-xs italic mb-2 overflow-scroll max-h-[200px]">
                LP References:
                <pre>{JSON.stringify(marker.levelPlayReferences, null, 2)}</pre>
              </div>
            )}
            {marker.levelPlayData && (
              <div className="text-xs italic mb-2 overflow-scroll max-h-[200px]">
                LevelPlayData:
                <pre>{JSON.stringify(marker.levelPlayData, null, 2)}</pre>
              </div>
            )}
            {marker.references && (
              <div className="text-xs italic mb-2 overflow-scroll max-h-[200px]">
                References:
                <pre>
                  {JSON.stringify(marker.references, null, 2)}
                </pre>
              </div>
            )}
            <div className="text-xs italic mt-2 overflow-auto max-h-[300px]">
              LevelEntity:
              <pre>{marker.description}</pre>
            </div>
          </div>
        )}
      </div>
    </Popup>
  );
}