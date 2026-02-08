'use client';

import 'leaflet/dist/leaflet.css';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useDebounce } from 'use-debounce';
import { MapContainer, Marker, useMap, useMapEvent } from 'react-leaflet';
import L from 'leaflet';
import './fixLeafletIcon';

import { Input } from '@/components/ui/input';
import { Toggle } from '@/components/ui/toggle';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Label } from '@/components/ui/label';

import { AnimalTranslationMap, CasketTranslationMap, ChestTranslationMap, CollectTranslationMap, FrostlandsTranslationMap, MonsterTranslationMap, NPCMobsTranslationMap, PuzzleTranslationMap, SpecialtyTranslationMap, TeleporterTranslationMap, TidalHeritageTranslationMap, TranslationMap, UnionTranslationMap } from './TranslationMaps/translationMap';
import { Button } from '@/components/ui/button';
import LocalStorageService from '@/services/LocalStorageService';
import { APIMarker, IMarker } from './types';
import { DbMapData } from '@/types/mapTypes';
import { loadBlueprintTranslations, translateBlueprint } from './BlueprintTranslationService';
import { convertMarkerToCoord, mapIdToName, mapUrl, scaleFactor } from './mapUtils';
import { CategoryPaneComponent } from './Components/CategoryPaneComponent';
import { CustomPopup } from './Components/CustomPopup';
import { getWorldmapIcon } from './TranslationMaps/worldmapIconMap';

const simpleCRS = L.CRS.Simple;


const storageService = new LocalStorageService("map");

/* --------------------------- Components -------------------------- */
function CustomTileLayer({ mapId }: { mapId: number, tileSize?: number, mapHeightInTiles?: number }) {
  const map = useMap();

  useEffect(() => {
    const tileLayer = L.tileLayer('', {
      tileSize: 256,
      noWrap: true,
      minZoom: -10,
      maxZoom: 10,
      minNativeZoom: 0,
      maxNativeZoom: 0,
    });

    tileLayer.getTileUrl = ({ x, y }) =>
      mapUrl[mapId].replace('{x}', `${x}`).replace('{y}', `${-y}`);

    tileLayer.addTo(map);

    return () => {
      map.removeLayer(tileLayer);
    };
  }, [map, mapId]);

  return null;
}

function ClickHandler({ enabled, onClick }: { enabled: boolean; onClick: (p: L.LatLng) => void }) {
  useMapEvent('click', e => {
    if (enabled) onClick(e.latlng);
  });
  return null;
}

/* ----------------------------- Main ------------------------------ */

export default function XYZMap() {
  const [data, setData] = useState<APIMarker[]>([]);
  const [selectedMap, setSelectedMap] = useState(8);
  const [coords, setCoords] = useState({ x: 0, y: 0, z: 0 });
  const [radius, setRadius] = useState(50);
  const [showDescriptions, setShowDescriptions] = useState(false);
  const [hideVisited, setHideVisited] = useState(false);
  const [enableClick, setEnableClick] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState('');
  const [showSettings, setShowSettings] = useState(true);
  const [dbMapData, setDbMapData] = useState<DbMapData>(() => {
    const loaded = storageService.load() as Partial<DbMapData> | null;

    return {
      visibleCategories: loaded?.visibleCategories ?? {},
      visitedMarkers: loaded?.visitedMarkers ?? {},
      displayedCategoryGroups: loaded?.displayedCategoryGroups ?? {},
    };
  });
  const [translationsReady, setTranslationsReady] = useState(false);
  const [categoryFilterDebounced] = useDebounce(categoryFilter, 300);

  useEffect(() => {
    loadBlueprintTranslations().then(() => setTranslationsReady(true));
  }, []);


  useEffect(() => {
    storageService.save(dbMapData);
  }, [dbMapData]);

  /* ----------------------------- Data ----------------------------- */

  useEffect(() => {
    (async () => {
      const URL =
        'https://wwfmp0c1vm.ufs.sh/f/GKKXYOQgq7aYJjynAOgE0xzLG7NC35IMYJrq9uTnS4KXpDBO';

      const cache = await caches.open('levelentityconfig-cache');
      const cached = await cache.match(URL);

      if (cached) {
        setData(await cached.json());
        return;
      }

      const res = await fetch(URL);
      if (res.ok) {
        await cache.put(URL, res.clone());
        setData(await res.json());
      }
    })();
  }, []);

  useEffect(() => {
    iconCache.current.clear();
  }, [hideVisited]);

  /* -------------------------- Computed ---------------------------- */

  const markers = useMemo(
    () => data.filter(m => m.MapId === selectedMap),
    [data, selectedMap]
  );

  const categories: Array<[string, number, number]> = useMemo(() => {
    const totals: Record<string, number> = {};
    const visited: Record<string, number> = {};
    for (const m of markers) {
      totals[m.BlueprintType] = (totals[m.BlueprintType] ?? 0) + 1;
      visited[m.BlueprintType] = (visited[m.BlueprintType] ?? 0) + (dbMapData.visitedMarkers[m.Id as number] ? 1 : 0);
    }
    const counts: Record<string, [number, number]> = {};
    for (const m of markers) {
      counts[m.BlueprintType] = [totals[m.BlueprintType], visited[m.BlueprintType]];
    }
    return Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0])).map(([k, v]) => [k, v[0], v[1]]);
  }, [markers, dbMapData.visitedMarkers]);

  const selectedPoint: APIMarker = useMemo(() => {
    return {
      Transform: [{ X: coords.x * 10000, Y: coords.y * 10000, Z: coords.z * 10000 }],
      BlueprintType: 'Selected Point',
      MapId: selectedMap,
    };
  }, [coords, selectedMap]);

  const markersWithinRadius = useMemo(() => {
    const cx = selectedPoint.Transform[0].X;
    const cy = selectedPoint.Transform[0].Y;
    const cz = selectedPoint.Transform[0].Z;

    return markers.filter(m => {
      const dx = m.Transform[0].X - cx;
      const dy = m.Transform[0].Y - cy;
      const dz = cz ? m.Transform[0].Z - cz : 0;
      return Math.sqrt(dx * dx + dy * dy + dz * dz) < radius * 10000;
    });
  }, [markers, selectedPoint, radius]);

  const displayedMarkers = useMemo(() => {
    const base = enableClick
      ? markersWithinRadius
      : markers.filter(m => dbMapData.visibleCategories[m.BlueprintType] && (!hideVisited || !dbMapData.visitedMarkers[m.Id as number]));
    return [
      ...(enableClick ? [convertMarkerToCoord(selectedPoint, dbMapData.visitedMarkers)] : []),
      ...base.map((m) => convertMarkerToCoord(m, dbMapData.visitedMarkers)),
    ];
  }, [markers, markersWithinRadius, dbMapData.visibleCategories, hideVisited, enableClick, selectedPoint, dbMapData.visitedMarkers]);

  const toggleMarkerVisited = (marker: IMarker) => {
    setDbMapData((prev) => ({
      ...prev,
      visitedMarkers: {
        ...prev.visitedMarkers,
        [marker.id as number]: !prev.visitedMarkers[marker.id as number],
      }
    }));
  }

  const toggleCategory = (category: string) => {
    setDbMapData(prev => ({
      ...prev,
      visibleCategories: {
        ...prev.visibleCategories,
        [category]: !prev.visibleCategories[category],
      },
    }));
  };
  const toggleCategories = (categories: string[], value: boolean) => {
    setDbMapData(prev => ({
      ...prev,
      visibleCategories: {
        ...prev.visibleCategories,
        ...categories.reduce((acc, category) => ({
          ...acc,
          [category]: value,
        }), {}),
      },
    }));
  };

  const clearCategories = () => {
    setDbMapData(prev => ({
      ...prev,
      visibleCategories: {},
    }));
  }

  const toggleDisplayedCategoryGroup = (categoryGroup: string, value: boolean) => {
    setDbMapData(prev => ({
      ...prev,
      displayedCategoryGroups: {
        ...prev.displayedCategoryGroups,
        [categoryGroup]: value,
      },
    }));
  }

  /* --------------------------- Icons ------------------------------ */

  const iconCache = useRef(new Map<string, L.DivIcon>());

  const getIcon = useCallback((category: string, visited: boolean) => {
    const key = `${category}:${visited}:${hideVisited}`;

    if (iconCache.current.has(key)) {
      return iconCache.current.get(key)!;
    }

    let html = '';
    let iconSize: L.PointExpression = [20, 20];
    let iconAnchor: L.PointExpression = [10, 10];

    const worldmapIconUrl = getWorldmapIcon(UnionTranslationMap[category]?.name ?? category);

    if (worldmapIconUrl) {
      // worldmap icon exists — style it nicely
      const opacity = visited && !hideVisited ? 0.3 : 1;
      const display = hideVisited && visited ? 'none' : 'inline-block';

      html = `
      <div style="
        display: ${display};
        width: 32px;
        height: 32px;
        border-radius: 50%;
        border: 2px solid #aaa;
        background-color: #333;
        overflow: hidden;
        opacity: ${opacity};
        display: flex;
        align-items: center;
        justify-content: center;
      ">
        <img src="${worldmapIconUrl}" style="width:32px; height:32px; object-fit:contain;" />
      </div>
    `;

      iconSize = [32, 32];
      iconAnchor = [16, 16];
    } else {
      // fallback colored circle
      const hue = Math.abs([...category].reduce((a, c) => c.charCodeAt(0) + ((a << 5) - a), 0)) % 360;
      if (visited) {
        if (hideVisited) {
          html = `<div style="display:none"></div>`;
        } else {
          html = `<div class="w-5 h-5 rounded-full border border-white" style="background:hsl(${hue},70%,50%); opacity:0.3;"></div>`;
        }
      } else {
        html = `<div class="w-5 h-5 rounded-full border border-white" style="background:hsl(${hue},70%,50%)"></div>`;
      }
    }

    const icon = L.divIcon({
      html,
      className: '',
      iconSize,
      iconAnchor,
    });

    iconCache.current.set(key, icon);
    return icon;
  }, [hideVisited]);


  /* ----------------------------- UI ------------------------------- */

  const frostlandCategories = categories.filter(category => FrostlandsTranslationMap[category[0]]);
  const chestCategories = categories.filter(category => ChestTranslationMap[category[0]]);
  const collectCategories = categories.filter(category => CollectTranslationMap[category[0]]);
  const tidalHeritageCategories = categories.filter(category => TidalHeritageTranslationMap[category[0]]);
  const casketCategories = categories.filter(category => CasketTranslationMap[category[0]]);
  const puzzleCategories = categories.filter(category => PuzzleTranslationMap[category[0]]);
  const teleporterCategories = categories.filter(category => TeleporterTranslationMap[category[0]]);
  const monsterCategories = categories.filter(category => MonsterTranslationMap[category[0]]);
  const specialtyCategories = categories.filter(category => SpecialtyTranslationMap[category[0]]);
  const npcMonsterCategories = categories.filter(category => NPCMobsTranslationMap[category[0]]);
  const animalCategories = categories.filter(category => AnimalTranslationMap[category[0]]);
  const definedCategories = categories.filter(category => TranslationMap[category[0]]);

  const undefinedCategories = categories.filter(category =>
    !FrostlandsTranslationMap[category[0]] &&
    !ChestTranslationMap[category[0]] &&
    !CollectTranslationMap[category[0]] &&
    !TidalHeritageTranslationMap[category[0]] &&
    !CasketTranslationMap[category[0]] &&
    !TeleporterTranslationMap[category[0]] &&
    !MonsterTranslationMap[category[0]] &&
    !TranslationMap[category[0]] &&
    !SpecialtyTranslationMap[category[0]] &&
    !NPCMobsTranslationMap[category[0]] &&
    !AnimalTranslationMap[category[0]] &&
    !PuzzleTranslationMap[category[0]]
  );

  const markerComponents = useMemo(() => {
    return displayedMarkers.map((m) => (
      <Marker
        key={`${m.id}:${dbMapData.visitedMarkers[m.id as number]}:${hideVisited}`}
        position={[m.y, m.x]}
        icon={getIcon(m.category, !!dbMapData.visitedMarkers[m.id as number])}
      >
        <CustomPopup
          marker={m}
          toggleVisited={() => toggleMarkerVisited(m)}
          visited={!!dbMapData.visitedMarkers[m.id as number]}
          showDescription={showDescriptions}
        />
      </Marker>
    ));
  }, [displayedMarkers, dbMapData.visitedMarkers, hideVisited, showDescriptions, getIcon]);

  if (!data.length) return <div className="p-4">Loading data…</div>;

  if (!translationsReady) return <div>Loading translations…</div>;
  return (
    <div className="h-screen w-screen flex relative">
      {/* Left controls */}
      {!showSettings && (
        <aside className="absolute top-2 left-2 z-10 border-r">
          <Button variant="outline" className="w-[320px] absolute " onClick={() => setShowSettings(true)}>
            Show Settings
          </Button>
        </aside>
      )}
      {showSettings && (
        <aside className="w-[320px] absolute top-2 left-2 z-10 border-r p-3 space-y-3 overflow-scroll bottom-2 bg-base-100">
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

          {([
            ["Teleporter", teleporterCategories, TeleporterTranslationMap],
            ["Frostland", frostlandCategories, FrostlandsTranslationMap],
            ["Casket", casketCategories, CasketTranslationMap],
            ["Tidal Heritage", tidalHeritageCategories, TidalHeritageTranslationMap],
            ["Chests", chestCategories, ChestTranslationMap],
            ["Puzzles", puzzleCategories, PuzzleTranslationMap],
            ["Specialties", specialtyCategories, SpecialtyTranslationMap],
            ["Echoes", monsterCategories, MonsterTranslationMap],
            ["NPC Monsters", npcMonsterCategories, NPCMobsTranslationMap],
            ["Collect", collectCategories, CollectTranslationMap],
            ["Animals", animalCategories, AnimalTranslationMap],
            ["Defined", definedCategories, TranslationMap],
          ] as const).map(([title, categories, translationMap]) => (
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

      {/* Map */}
      <main className="flex-1 relative z-0">
        {enableClick && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-3 py-1 rounded z-[1000]">
            Click map to set center
          </div>
        )}
        <MapContainer
          key={selectedMap}
          crs={simpleCRS}
          center={[0, 0]}
          zoom={0}
          minZoom={-10}
          maxZoom={10}
          className={enableClick ? 'cursor-crosshair' : 'cursor-grab'}
          style={{ height: '100%', width: '100%' }}
          attributionControl={false}
        >
          <CustomTileLayer mapId={selectedMap} />
          <ClickHandler
            enabled={enableClick}
            onClick={p =>
              setCoords({
                x: (p.lng - 256) / scaleFactor,
                y: -p.lat / scaleFactor,
                z: 0,
              })
            }
          />
          {markerComponents}
        </MapContainer>
      </main>
    </div>
  );
}
