'use client';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React, { useState } from "react";
import { AnimalDisplayOrder, AnimalTranslationMap, CasketDisplayOrder, CasketTranslationMap, ChestDisplayOrder, ChestTranslationMap, CollectDisplayOrder, CollectTranslationMap, Echo1CostDisplayOrder, Echo1CostTranslationMap, Echo3CostDisplayOrder, Echo3CostTranslationMap, Echo4CostDisplayOrder, Echo4CostTranslationMap, MonsterDisplayOrder, MonsterTranslationMap, NPCMobsDisplayOrder, NPCMobsTranslationMap, PuzzleDisplayOrder, PuzzleTranslationMap, SpecialtyDisplayOrder, SpecialtyTranslationMap, TeleporterDisplayOrder, TeleporterTranslationMap, TidalHeritageDisplayOrder, TidalHeritageTranslationMap, TranslationDisplayOrder, TranslationMap, UnionTranslationMap } from '../TranslationMaps/translationMap';
import { mapIdToName } from "../mapUtils";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { CategoryPaneComponent } from "./CategoryPaneComponent";
import { translateBlueprint } from "../BlueprintTranslationService";
import { DbMapData } from "@/types/mapTypes";

interface MapSettingsComponentProps {
  selectedMap: number;
  setSelectedMap: (id: number) => void;
  coords: { x: number; y: number; z: number };
  setCoords: (coords: React.SetStateAction<{ x: number; y: number; z: number }>) => void;
  radius: number;
  setRadius: (radius: number) => void;
  enableClick: boolean;
  setEnableClick: (v: boolean) => void;
  hideVisited: boolean;
  setHideVisited: (v: boolean) => void;
  showDescriptions: boolean;
  setShowDescriptions: (v: boolean) => void;
  clearCategories: () => void;
  dbMapData: DbMapData;
  toggleCategory: (category: string) => void;
  toggleCategories: (categories: string[], value: boolean) => void;
  toggleDisplayedCategoryGroup: (categoryGroup: string, value: boolean) => void;
  categories: Array<[string, number, number]>;
  categoryFilter: string;
  setCategoryFilter: (filter: string) => void;
}
export const MapSettingsComponent = ({
  selectedMap,
  setSelectedMap,
  coords,
  setCoords,
  radius,
  setRadius,
  enableClick,
  setEnableClick,
  hideVisited,
  setHideVisited,
  showDescriptions,
  setShowDescriptions,
  clearCategories,
  dbMapData,
  toggleCategory,
  toggleCategories,
  toggleDisplayedCategoryGroup,
  categories,
  categoryFilter,
  setCategoryFilter,
}: MapSettingsComponentProps) => {
  const [showSettings, setShowSettings] = useState(true);

  const [categoryFilterDebounced] = useState(categoryFilter);

  const chestCategories = categories.filter(c => ChestTranslationMap[c[0]]);
  const collectCategories = categories.filter(c => CollectTranslationMap[c[0]]);
  const tidalHeritageCategories = categories.filter(c => TidalHeritageTranslationMap[c[0]]);
  const casketCategories = categories.filter(c => CasketTranslationMap[c[0]]);
  const puzzleCategories = categories.filter(c => PuzzleTranslationMap[c[0]]);
  const teleporterCategories = categories.filter(c => TeleporterTranslationMap[c[0]]);
  const monsterCategories = categories.filter(c => MonsterTranslationMap[c[0]]);
  const specialtyCategories = categories.filter(c => SpecialtyTranslationMap[c[0]]);
  const echo4CostCategories = categories.filter(c => Echo4CostTranslationMap[c[0]]);
  const echo3CostCategories = categories.filter(c => Echo3CostTranslationMap[c[0]]);
  const echo1CostCategories = categories.filter(c => Echo1CostTranslationMap[c[0]]);
  const npcMonsterCategories = categories.filter(c => NPCMobsTranslationMap[c[0]]);
  const animalCategories = categories.filter(c => AnimalTranslationMap[c[0]]);
  const definedCategories = categories.filter(c => TranslationMap[c[0]]);

  const undefinedCategories = categories.filter(category =>
    !ChestTranslationMap[category[0]] &&
    !CollectTranslationMap[category[0]] &&
    !TidalHeritageTranslationMap[category[0]] &&
    !CasketTranslationMap[category[0]] &&
    !TeleporterTranslationMap[category[0]] &&
    !MonsterTranslationMap[category[0]] &&
    !TranslationMap[category[0]] &&
    !SpecialtyTranslationMap[category[0]] &&
    !Echo4CostTranslationMap[category[0]] &&
    !Echo3CostTranslationMap[category[0]] &&
    !Echo1CostTranslationMap[category[0]] &&
    !NPCMobsTranslationMap[category[0]] &&
    !AnimalTranslationMap[category[0]] &&
    !PuzzleTranslationMap[category[0]]
  );

  const categoryGroups = [
    ["Teleporter", teleporterCategories, TeleporterTranslationMap, TeleporterDisplayOrder],
    ["Casket", casketCategories, CasketTranslationMap, CasketDisplayOrder],
    ["Tidal Heritage", tidalHeritageCategories, TidalHeritageTranslationMap, TidalHeritageDisplayOrder],
    ["Chests", chestCategories, ChestTranslationMap, ChestDisplayOrder],
    ["Puzzles", puzzleCategories, PuzzleTranslationMap, PuzzleDisplayOrder],
    ["Specialties", specialtyCategories, SpecialtyTranslationMap, SpecialtyDisplayOrder],
    ["Echoes", monsterCategories, MonsterTranslationMap, MonsterDisplayOrder],
    ["Echo (4-Cost)", echo4CostCategories, Echo4CostTranslationMap, Echo4CostDisplayOrder],
    ["Echoes (3-Cost)", echo3CostCategories, Echo3CostTranslationMap, Echo3CostDisplayOrder],
    ["Echoes (1-Cost)", echo1CostCategories, Echo1CostTranslationMap, Echo1CostDisplayOrder],
    ["NPC Monsters", npcMonsterCategories, NPCMobsTranslationMap, NPCMobsDisplayOrder],
    ["Collect", collectCategories, CollectTranslationMap, CollectDisplayOrder],
    ["Animals", animalCategories, AnimalTranslationMap, AnimalDisplayOrder],
    ["Defined", definedCategories, TranslationMap, TranslationDisplayOrder],
  ] as const;

  return (
    <>
      {/* Left controls */}
      {!showSettings && (
        <aside className="absolute top-2 left-2 z-10 border-r">
          <Button variant="outline" className="w-[320px] absolute " onClick={() => setShowSettings(true)}>
            Show Settings
          </Button>
        </aside>
      )}
      {showSettings && (
        <aside className="w-[320px] absolute top-4 left-4 z-10 border-r p-3 space-y-3 max-h-[calc(100vh-2rem)] overflow-scroll bg-base-100">
          <Button variant="outline" className="w-full" onClick={() => setShowSettings(false)}>Hide Settings</Button>

          <div className="rounded-lg border p-3 space-y-2 bg-base-100">
            <h3 className="text-sm font-semibold">Map</h3>
            <Select value={String(selectedMap)} onValueChange={v => setSelectedMap(+v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {Object.entries(mapIdToName).map(([id, name]) => (
                    <SelectItem key={id} value={id}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <div className="rounded-lg border p-3 space-y-2 bg-base-100">
            <h3 className="text-sm font-semibold">Selection</h3>
            <Label>Coords</Label>
            <div className="flex gap-2">
              {(['x', 'y', 'z'] as const).map(k => (
                <Input
                  key={k}
                  type="number"
                  value={coords[k]}
                  onChange={e => setCoords(c => ({ ...c, [k]: +e.target.value }))}
                />
              ))}
            </div>

            <Label>Radius</Label>
            <Input type="number" value={radius} onChange={e => setRadius(+e.target.value)} />

            <Toggle pressed={enableClick} onPressedChange={setEnableClick}>
              Click-to-select
            </Toggle>
            <Toggle pressed={hideVisited} onPressedChange={setHideVisited}>
              Hide visited
            </Toggle>
            <Toggle pressed={showDescriptions} onPressedChange={setShowDescriptions}>
              Show descriptions
            </Toggle>
            <Button onClick={() => clearCategories()}>Clear Categories</Button>
          </div>

          <Input
            placeholder="Filter categories…"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          />

          {(categoryGroups).map(([title, categories, translationMap, displayOrder]) => (
            <>
              {categories.length > 0 && (
                <CategoryPaneComponent
                  key={title}
                  title={title}
                  categories={categories.filter(([c, ,]) =>
                    [
                      c.toLowerCase(),
                      translateBlueprint(c).toLowerCase(),
                      UnionTranslationMap[c]?.name.toLowerCase() ?? '',
                    ].some(s => s.includes(categoryFilterDebounced.toLowerCase()))
                  )}
                  displayOrder={displayOrder}
                  translationMap={translationMap}
                  toggleCategory={toggleCategory}
                  toggleCategories={toggleCategories}
                  toggleDisplayedCategoryGroup={toggleDisplayedCategoryGroup}
                  showDescriptions={showDescriptions}
                  dbMapData={dbMapData}
                  isOpen={dbMapData.displayedCategoryGroups[title]}
                />
              )}
            </>

          ))}

          {showDescriptions && (
            <CategoryPaneComponent
              title="Not defined categories"
              categories={
                undefinedCategories.filter(([c]) =>
                  [
                    c.toLowerCase(),
                    translateBlueprint(c).toLowerCase(),
                  ].some(s => s.includes(categoryFilterDebounced.toLowerCase()))
                )
              }
              toggleCategory={toggleCategory}
              toggleDisplayedCategoryGroup={toggleDisplayedCategoryGroup}
              isOpen={dbMapData.displayedCategoryGroups['Not defined categories']}
              showDescriptions={showDescriptions}
              dbMapData={dbMapData}
            />
          )}
        </aside>
      )}
    </>
  );
};