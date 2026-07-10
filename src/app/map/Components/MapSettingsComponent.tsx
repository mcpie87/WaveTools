'use client';
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectTrigger, SelectValue } from "@/components/ui/select";
import React, { Fragment, useMemo, useState } from "react";
import { useDebounce } from 'use-debounce';
import { Trash2 } from "lucide-react";
import {
  displayedCategories,
  UnionTranslationMap
} from '../TranslationMaps/translationMap';

import { __ALL_MAPS__, __ALL_MAPS_BUT_DEFINED__, __ALL_MAPS_BUT_DUNGEONS_AND_TEST__, __ALL_MAPS_BUT_TEST_DUNGEON__, __ALL_MAPS_BUT_WORLD_MAP_AND_TEST__, __DISPLAY_ALL__, __DISPLAY_LEVELPLAY_ONLY__, __DISPLAY_NO_QUEST_NO_LEVELPLAY__, __DISPLAY_QUEST_AND_LEVELPLAY_ONLY__, __DISPLAY_QUEST_ONLY__, __DUNGEONS_ONLY__, __WORLD_MAPS__, mainStoryDungeonMapConfigs, mapConfigs, QuestFilter, sonoroDungeonMapConfigs, storyDungeonMapConfigs, testDungeonMapConfigs } from "../mapUtils";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { Label } from "@/components/ui/label";
import { CategoryPaneComponent } from "./CategoryPaneComponent";
import { translateBlueprint } from "../BlueprintTranslationService";
import { DbMapData, SelectedMap } from "@/types/mapTypes";
import { DevModeSettingsComponent } from "./DevModeSettingsComponent";
import { BackupManager } from "@/components/BackupComponent";
import { useMapStore } from "../state/mapStore";


interface MapSettingsComponentProps {
  selectedMap: SelectedMap;
  setSelectedMap: (id: SelectedMap) => void;
  coords: { x: number; y: number; z: number };
  setCoords: (coords: { x: number; y: number; z: number }) => void;
  radius: number;
  setRadius: (radius: number) => void;
  enableClick: boolean;
  setEnableClick: (v: boolean) => void;
  hideVisited: boolean;
  setHideVisited: (v: boolean) => void;
  showDescriptions: boolean;
  setShowDescriptions: (v: boolean) => void;
  questFilter: QuestFilter;
  setQuestFilter: (v: QuestFilter) => void;
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
  questFilter,
  setQuestFilter,
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
  const [presetName, setPresetName] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<string>('');

  const saveCategoryPreset = useMapStore((state) => state.saveCategoryPreset);
  const loadCategoryPreset = useMapStore((state) => state.loadCategoryPreset);
  const deleteCategoryPreset = useMapStore((state) => state.deleteCategoryPreset);
  const presets = Object.keys(dbMapData.categoryPresets || {});

  const [categoryFilterDebounced] = useDebounce(categoryFilter, 300);

  const handleToggleCategory = (category: string) => {
    setSelectedPreset('');
    toggleCategory(category);
  };

  const handleToggleCategories = (categories: string[], value: boolean) => {
    setSelectedPreset('');
    toggleCategories(categories, value);
  };

  const handleClearCategories = () => {
    setSelectedPreset('');
    clearCategories();
  };

  const undefinedCategories = categories.filter(category =>
    !displayedCategories.some(c => c[1][category[0]])
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

  const multiSelectMode = useMapStore((state) => state.multiSelectMode);
  const setMultiSelectMode = useMapStore((state) => state.setMultiSelectMode);

  return (
    <>
      {/* Left controls */}
      <aside className="w-[320px] rounded-xl border-r p-3 flex flex-col gap-3 max-h-[calc(100vh-2rem)] bg-base-100 overflow-y-auto custom-scrollbar">
        {!showSettings && (
          <Button className="w-full shrink-0" onClick={() => setShowSettings(true)}>
            Show Settings
          </Button>
        )}
        {showSettings && (
          <>
            <div className="flex flex-col gap-3 shrink-0">
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
                  <Toggle
                    pressed={hideVisited}
                    onPressedChange={setHideVisited}
                    className="data-[state=on]:bg-yellow-500/20 data-[state=on]:text-yellow-500 border-yellow-500/50"
                  >
                    Hide visited
                  </Toggle>
                  <Toggle
                    pressed={multiSelectMode}
                    onPressedChange={(v) => setMultiSelectMode(v)}
                    className="data-[state=on]:bg-yellow-500/20 data-[state=on]:text-yellow-500 border-yellow-500/50"
                  >
                    Multi-select markers
                  </Toggle>
                  <div className="flex flex-col gap-1.5">
                    <Label htmlFor="quest-filter" className="text-xs font-semibold text-muted-foreground ml-1">Quest filter</Label>
                    <Select
                      value={questFilter}
                      onValueChange={v => setQuestFilter(v as QuestFilter)}
                    >
                      <SelectTrigger id="quest-filter">
                        <SelectValue placeholder="Quest / LevelPlay Filter" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value={__DISPLAY_ALL__}>Show All</SelectItem>
                        <SelectItem value={__DISPLAY_QUEST_ONLY__}>Quest Only</SelectItem>
                        <SelectItem value={__DISPLAY_LEVELPLAY_ONLY__}>LevelPlay Only</SelectItem>
                        <SelectItem value={__DISPLAY_QUEST_AND_LEVELPLAY_ONLY__}>Quest & LevelPlay</SelectItem>
                        <SelectItem value={__DISPLAY_NO_QUEST_NO_LEVELPLAY__}>No Quest & No LevelPlay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button onClick={handleClearCategories}>Clear Categories</Button>

                  <div className="flex flex-col gap-2 pt-2 border-t mt-2">
                    <div className="flex gap-2">
                      <Input
                        placeholder="Preset name"
                        value={presetName}
                        onChange={e => setPresetName(e.target.value)}
                        className="h-8"
                      />
                      <Button
                        size="sm"
                        disabled={!presetName}
                        onClick={() => {
                          saveCategoryPreset(presetName);
                          setPresetName("");
                        }}
                      >
                        Save
                      </Button>
                    </div>
                    {presets.length > 0 && (
                      <div className="flex gap-2 items-center mt-1">
                        <Select
                          value={selectedPreset}
                          onValueChange={v => {
                            setSelectedPreset(v);
                            setPresetName(v);
                            loadCategoryPreset(v);
                          }}
                        >
                          <SelectTrigger className="flex-1 h-8">
                            <SelectValue placeholder="Load a preset..." />
                          </SelectTrigger>
                          <SelectContent>
                            {presets.map(preset => (
                              <SelectItem key={preset} value={preset}>
                                {preset}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <Button
                          size="icon"
                          variant="ghost"
                          className="h-8 w-8 text-destructive hover:bg-destructive/10 shrink-0"
                          disabled={!selectedPreset || !presets.includes(selectedPreset)}
                          onClick={() => {
                            if (selectedPreset) {
                              deleteCategoryPreset(selectedPreset);
                              setSelectedPreset('');
                            }
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Input
                placeholder="Filter categories…"
                value={categoryFilter}
                onChange={e => setCategoryFilter(e.target.value)}
              />
            </div>

            <div className="space-y-3 pr-1">
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
                          toggleCategory={handleToggleCategory}
                          toggleCategories={handleToggleCategories}
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
                      .filter(([c]) =>
                        [
                          c.toLowerCase(),
                          translateBlueprint(c).toLowerCase(),
                        ].some(s => s.includes(categoryFilterDebounced.toLowerCase()))
                      )
                  }
                  toggleCategory={handleToggleCategory}
                  toggleCategories={(showDescriptions && !mapConfigs[selectedMap]) || selectedMapId !== null ? handleToggleCategories : undefined}
                  toggleDisplayedCategoryGroup={toggleDisplayedCategoryGroup}
                  isOpen={dbMapData.displayedCategoryGroups['Not defined categories']}
                  showDescriptions={showDescriptions}
                  dbMapData={dbMapData}
                />
              )}
            </div>
          </>
        )}
      </aside>
    </>
  );
};