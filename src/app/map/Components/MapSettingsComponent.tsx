'use client';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import React, { useState } from "react";
import { useDebounce } from 'use-debounce';
import {
  displayedCategories,
  UnionTranslationMap
} from '../TranslationMaps/translationMap';

import { mapIdToName } from "../mapUtils";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { CategoryPaneComponent } from "./CategoryPaneComponent";
import { translateBlueprint } from "../BlueprintTranslationService";
import { DbMapData } from "@/types/mapTypes";
import { DevModeSettingsComponent } from "./DevModeSettingsComponent";

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
}: MapSettingsComponentProps) => {
  const [showSettings, setShowSettings] = useState(true);
  const [categoryFilter, setCategoryFilter] = useState('');

  const [categoryFilterDebounced] = useDebounce(categoryFilter, 300);

  const undefinedCategories = categories.filter(category =>
    !displayedCategories.every(c => c[1][category[0]])
  )

  return (
    <>
      {/* Left controls */}
      {!showSettings && (
        <aside className="absolute top-2 left-2 z-10 border-r">
          <Button className="w-[320px] absolute " onClick={() => setShowSettings(true)}>
            Show Settings
          </Button>
        </aside>
      )}
      {showSettings && (
        <aside className="w-[320px] absolute rounded-xl top-4 left-4 z-10 border-r p-3 space-y-3 max-h-[calc(100vh-2rem)] overflow-auto bg-base-100">
          <Button className="w-full" onClick={() => setShowSettings(false)}>Hide Settings</Button>

          <div className="rounded-lg border p-3 space-y-2 bg-base-200">
            <Select value={String(selectedMap)} onValueChange={v => setSelectedMap(+v)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {[...mapIdToName].map(([id, name]) => (
                    <SelectItem key={id} value={String(id)}>
                      {name}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </div>

          <DevModeSettingsComponent
            coords={coords}
            setCoords={setCoords}
            showDescriptions={showDescriptions}
            setShowDescriptions={setShowDescriptions}
            radius={radius}
            setRadius={setRadius}
            enableClick={enableClick}
            setEnableClick={setEnableClick}
          />

          <div className="rounded-lg border p-3 space-y-2 bg-base-200">
            <h3 className="text-sm font-semibold">Settings</h3>
            <div className="flex flex-col gap-2">
              <Toggle pressed={hideVisited} onPressedChange={setHideVisited}>
                Hide visited
              </Toggle>
              <Button onClick={() => clearCategories()}>Clear Categories</Button>
            </div>
          </div>

          <Input
            placeholder="Filter categories…"
            value={categoryFilter}
            onChange={e => setCategoryFilter(e.target.value)}
          />

          {(displayedCategories).map(([title, translationMap, displayOrder]) => {
            {
              const filteredCategories = categories
                .filter(c => translationMap[c[0]])
                .filter(([c, ,]) =>
                  [
                    c.toLowerCase(),
                    translateBlueprint(c).toLowerCase(),
                    UnionTranslationMap[c]?.name.toLowerCase() ?? '',
                  ].some(s => s.includes(categoryFilterDebounced.toLowerCase()))
                )
              return (
                <>
                  {filteredCategories.length > 0 && (
                    <CategoryPaneComponent
                      key={title}
                      title={title}
                      categories={filteredCategories}
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
              )
            }
          })}

          {showDescriptions && (
            <CategoryPaneComponent
              title="Not defined categories"
              categories={
                undefinedCategories
                  .filter(c => !displayedCategories.some(d => d[1][c[0]]))
                  .filter(([c]) =>
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