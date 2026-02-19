'use client';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import React, { Fragment, useMemo, useState } from "react";
import { useDebounce } from 'use-debounce';
import {
  displayedCategories,
  UnionTranslationMap
} from '../TranslationMaps/translationMap';

import { __ALL_MAPS__, __ALL_MAPS_BUT_DEFINED__, __ALL_MAPS_BUT_DUNGEONS_AND_TEST__, __ALL_MAPS_BUT_TEST_DUNGEON__, __ALL_MAPS_BUT_WORLD_MAP_AND_TEST__, __DUNGEONS_ONLY__, __WORLD_MAPS__, mainStoryDungeonMapConfigs, mapConfigs, sonoroDungeonMapConfigs, storyDungeonMapConfigs, testDungeonMapConfigs } from "../mapUtils";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { CategoryPaneComponent } from "./CategoryPaneComponent";
import { translateBlueprint } from "../BlueprintTranslationService";
import { DbMapData, SelectedMap } from "@/types/mapTypes";
import { DevModeSettingsComponent } from "./DevModeSettingsComponent";
import { BackupManager } from "@/components/BackupComponent";

interface MapSettingsComponentProps {
  selectedMap: SelectedMap;
  setSelectedMap: (id: SelectedMap) => void;
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
  selectedMapId: number | null;
  setSelectedMapId: (id: number | null) => void;
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
  selectedMapId,
  setSelectedMapId,
}: MapSettingsComponentProps) => {
  const [showSettings, setShowSettings] = useState(true);
  const [showDungeonMaps, setShowDungeonMaps] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');

  const [categoryFilterDebounced] = useDebounce(categoryFilter, 300);

  const undefinedCategories = categories.filter(category =>
    !displayedCategories.every(c => c[1][category[0]])
  )

  const mapOptions = useMemo(() => {
    const options: { value: string; label: string; group: string }[] = [];

    // Admin/Debug Options
    if (showDungeonMaps && showDescriptions) {
      const adminItems = [
        { value: __ALL_MAPS__, label: "EVERYTHING" },
        { value: __WORLD_MAPS__, label: "WORLD MAPS" },
        { value: __DUNGEONS_ONLY__, label: "DUNGEONS ONLY" },
        { value: __ALL_MAPS_BUT_DEFINED__, label: "EVERYTHING BUT DEFINED" },
        { value: __ALL_MAPS_BUT_DUNGEONS_AND_TEST__, label: "EVERYTHING BUT DUNGEONS AND TEST" },
        { value: __ALL_MAPS_BUT_WORLD_MAP_AND_TEST__, label: "EVERYTHING BUT WORLD MAP AND TEST" },
        { value: __ALL_MAPS_BUT_TEST_DUNGEON__, label: "EVERYTHING BUT TEST DUNGEON" },
      ];
      adminItems.forEach(i => options.push({ ...i, group: 'Admin' }));
    }

    // Standard Maps
    Object.keys(mapConfigs).forEach(name =>
      options.push({ value: name, label: name, group: 'Standard' })
    );

    // Dungeon Maps
    if (showDungeonMaps) {
      Object.keys(mainStoryDungeonMapConfigs).forEach(name =>
        options.push({ value: name, label: name, group: 'Main Story Dungeon' })
      );
      Object.keys(storyDungeonMapConfigs).forEach(name =>
        options.push({ value: name, label: name, group: 'Story Dungeon' })
      );
      Object.keys(sonoroDungeonMapConfigs).forEach(name =>
        options.push({ value: name, label: name, group: 'Sonoro Dungeon' })
      );
      Object.keys(testDungeonMapConfigs).forEach(name =>
        options.push({ value: name, label: name, group: 'Test Dungeon' })
      );
    }

    return options;
  }, [showDungeonMaps, showDescriptions]);

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
            <Select value={selectedMap} onValueChange={v => { setSelectedMap(v as SelectedMap); setSelectedMapId(null); }}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {/* Admin Section */}
                {showDungeonMaps && showDescriptions && (
                  <SelectGroup>
                    <SelectLabel className="text-xs opacity-50">Debug</SelectLabel>
                    {mapOptions.filter(o => o.group === 'Admin').map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectGroup>
                )}

                <SelectGroup>
                  <SelectLabel className="text-xs opacity-50">World Maps</SelectLabel>
                  {mapOptions.filter(o => o.group === 'Standard').map(opt => (
                    <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                  ))}
                </SelectGroup>

                {showDungeonMaps && (
                  <SelectGroup>
                    <SelectLabel className="text-xs opacity-50">Main Story</SelectLabel>
                    {mapOptions.filter(o => o.group === 'Main Story Dungeon').map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectGroup>
                )}

                {showDungeonMaps && (
                  <SelectGroup>
                    <SelectLabel className="text-xs opacity-50">Story</SelectLabel>
                    {mapOptions.filter(o => o.group === 'Story Dungeon').map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectGroup>
                )}

                {showDungeonMaps && (
                  <SelectGroup>
                    <SelectLabel className="text-xs opacity-50">Sonoro</SelectLabel>
                    {mapOptions.filter(o => o.group === 'Sonoro Dungeon').map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectGroup>
                )}

                {showDungeonMaps && (
                  <SelectGroup>
                    <SelectLabel className="text-xs opacity-50">Test</SelectLabel>
                    {mapOptions.filter(o => o.group === 'Test Dungeon').map(opt => (
                      <SelectItem key={opt.value} value={opt.value}>{opt.label}</SelectItem>
                    ))}
                  </SelectGroup>
                )}
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
            showDungeonMaps={showDungeonMaps}
            setShowDungeonMaps={setShowDungeonMaps}
            setSelectedMapId={setSelectedMapId}
          />

          <div className="rounded-lg border p-3 space-y-2 bg-base-200">
            <h3 className="text-sm font-semibold">Settings</h3>

            <div className="flex flex-col gap-2">
              <BackupManager />
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
                <Fragment key={title}>
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
                </Fragment>
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
              toggleCategories={(showDescriptions && !mapConfigs[selectedMap]) || selectedMapId !== null ? toggleCategories : undefined}
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