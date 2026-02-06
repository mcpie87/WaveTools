'use client';

import 'leaflet/dist/leaflet.css';

import React, { useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, Marker, Popup, useMap, useMapEvent } from 'react-leaflet';
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

import { ASSET_URL } from '@/constants/constants';
import { CasketTranslationMap, CollectTranslationMap, FrostlandsTranslationMap, MonsterTranslationMap, TeleporterTranslationMap, TidalHeritageTranslationMap, TranslationMap } from './TranslationMaps/translationMap';
import { Button } from '@/components/ui/button';
import LocalStorageService from '@/services/LocalStorageService';
import { APIMarker, IMarker } from './types';
import { DbMapData } from '@/types/mapTypes';

const simpleCRS = L.CRS.Simple;
const scaleFactor = 0.3013;

const storageService = new LocalStorageService("map");

/* ----------------------------- Utils ----------------------------- */

const convertMarkerToCoord = (marker: APIMarker, visitedMap: Record<number, boolean>): IMarker => ({
  x: 256 + scaleFactor * (marker.Transform[0].X / 10000),
  y: -scaleFactor * (marker.Transform[0].Y / 10000),
  z: marker.Transform[0].Z / 10000,
  id: marker.Id,
  name: marker.BlueprintType,
  description: JSON.stringify(marker, null, 2),
  displayedX: marker.Transform[0].X / 10000,
  displayedY: marker.Transform[0].Y / 10000,
  displayedZ: marker.Transform[0].Z / 10000,
  category: marker.BlueprintType,
  visited: visitedMap[marker.MapId] || false,
});

const prefix = `${ASSET_URL}UIResources/UiWorldMap/`;

const mapUrl: Record<number, string> = {
  8: `${prefix}/Image/MapTiles/T_MapTiles_{x}_{y}_UI.png`, // Main
  900: `${prefix}/Image/HHATiles/T_HHATiles_{x}_{y}_UI.png`, // Tethys Deep
  902: `${prefix}/Image/JKTiles/T_JKTiles_{x}_{y}_UI.png`, // Vault Undergrounds
  903: `${prefix}/Image/DDTTiles/T_DDTTiles_{x}_{y}_UI.png`, // Avinoleum
  906: `${prefix}/Image/LHLTiles/T_LHLTiles_{x}_{y}_UI.png`, // Lahai Roi
};

const mapIdToName: Record<number, string> = {
  8: 'Main',
  900: 'Tethys Deep',
  902: 'Vault Undergrounds',
  903: 'Avinoleum',
  906: 'Lahai Roi',
};

/* --------------------------- Components -------------------------- */

function CustomPopup({
  marker,
  toggleVisited,
  showDescription,
  visited,
}: {
  marker: IMarker;
  toggleVisited: () => void;
  showDescription: boolean;
  visited: boolean;
}) {

  const title = FrostlandsTranslationMap[marker.category]?.name
    || TranslationMap[marker.category]?.name
    || CasketTranslationMap[marker.category]?.name
    || TidalHeritageTranslationMap[marker.category]?.name
    || MonsterTranslationMap[marker.category]?.name
    || CollectTranslationMap[marker.category]?.name
    || TeleporterTranslationMap[marker.category]?.name
    || "";

  return (
    <Popup>
      <div className="font-bold">{title}{showDescription && ` - ${marker.category}`}</div>
      <div>
        X: {parseFloat(marker.displayedX.toFixed(2))}, Y: {parseFloat(marker.displayedY.toFixed(2))}, Z: {parseFloat(marker.displayedZ.toFixed(2))}
      </div>
      <Button onClick={toggleVisited}>{visited ? "Uncheck" : "Check"}</Button>
      {showDescription && (
        <pre className="text-xs mt-2 max-h-[300px] overflow-auto">{marker.description}</pre>
      )}
    </Popup>
  );
}

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

function ControlCard({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-lg border p-3 space-y-2 bg-white">
      <h3 className="text-sm font-semibold text-gray-700">{title}</h3>
      {children}
    </div>
  );
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
  const [dbMapData, setDbMapData] = useState<DbMapData>(() => {
    return storageService.load() as DbMapData || {
      visibleCategories: {},
      visitedMarkers: {},
    };
  });

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

  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const m of markers) counts[m.BlueprintType] = (counts[m.BlueprintType] ?? 0) + 1;
    return Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0]));
  }, [markers]);

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

  const clearCategories = () => {
    setDbMapData(prev => ({
      ...prev,
      visibleCategories: {},
    }));
  }

  /* --------------------------- Icons ------------------------------ */

  const iconCache = useRef(new Map<string, L.DivIcon>());

  const getIcon = (category: string, visited: boolean) => {
    const key = `${category}:${visited}:${hideVisited}`;

    if (!iconCache.current.has(key)) {
      const hue =
        Math.abs([...category].reduce((a, c) => c.charCodeAt(0) + ((a << 5) - a), 0)) % 360;

      let html = '';

      if (visited) {
        if (hideVisited) {
          html = `<div style="display:none"></div>`;
        } else {
          html = `
        <div class="w-5 h-5 rounded-full border border-white"
             style="background:hsl(${hue},70%,50%); opacity: 30%;"></div>`;
        }
      } else {
        html = `
        <div class="w-5 h-5 rounded-full border border-white"
             style="background:hsl(${hue},70%,50%)"></div>`;
      }

      iconCache.current.set(
        key,
        L.divIcon({
          html,
          className: '',
          iconSize: [20, 20],
          iconAnchor: [10, 10],
        })
      );
    }

    return iconCache.current.get(key)!;
  };

  /* ----------------------------- UI ------------------------------- */

  const frostlandCategories = categories.filter(category => FrostlandsTranslationMap[category[0]]);
  const monsterCategories = categories.filter(category => MonsterTranslationMap[category[0]]);
  const collectCategories = categories.filter(category => CollectTranslationMap[category[0]]);
  const tidalHeritageCategories = categories.filter(category => TidalHeritageTranslationMap[category[0]]);
  const casketCategories = categories.filter(category => CasketTranslationMap[category[0]]);
  const teleporterCategories = categories.filter(category => TeleporterTranslationMap[category[0]]);
  const definedCategories = categories.filter(category => TranslationMap[category[0]]);

  if (!data.length) return <div className="p-4">Loading data…</div>;

  return (
    <div className="h-screen w-screen flex">
      {/* Left controls */}
      <aside className="w-[320px] border-r bg-gray-50 p-3 space-y-3 overflow-auto">
        <ControlCard title="Map">
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
        </ControlCard>

        <ControlCard title="Selection">
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
        </ControlCard>

        {([
          ["Frostland", frostlandCategories, FrostlandsTranslationMap],
          ["Echoes", monsterCategories, MonsterTranslationMap],
          ["Collect", collectCategories, CollectTranslationMap],
          ["Casket", casketCategories, CasketTranslationMap],
          ["Teleporter", teleporterCategories, TeleporterTranslationMap],
          ["Tidal Heritage", tidalHeritageCategories, TidalHeritageTranslationMap],
          ["Defined", definedCategories, TranslationMap],
        ] as const).map(([title, categories, translationMap]) => (
          <>
            {categories.length > 0 && (
              <div key={title as string}>
                <div>{title as string}</div>
                {categories.sort((a, b) => translationMap[a[0]]?.name.localeCompare(translationMap[b[0]]?.name) || 0).map(([category, count]) => (
                  <label key={category} className="flex items-center gap-2 text-sm">
                    <input
                      type="checkbox"
                      checked={!!dbMapData.visibleCategories[category]}
                      onChange={() => toggleCategory(category)}
                    />
                    <h2>{
                      showDescriptions
                        ? ("(" + translationMap[category].name + ") " + category)
                        : translationMap[category].name
                    } ({count})</h2>
                  </label>
                ))}
              </div>
            )
            }
          </>
        ))}

        <Input
          placeholder="Filter categories…"
          value={categoryFilter}
          onChange={e => setCategoryFilter(e.target.value)}
        />

        <h3 className="text-sm font-semibold text-gray-700">Not defined categories</h3>
        {categories
          .filter(([c]) => c.toLowerCase().includes(categoryFilter.toLowerCase()))
          .map(([c, count]) => (
            <label key={c} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={!!dbMapData.visibleCategories[c]}
                onChange={() => toggleCategory(c)}
              />
              {c} ({count})
            </label>
          ))}
      </aside>

      {/* Map */}
      <main className="flex-1 relative">
        {enableClick && (
          <div className="absolute top-2 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-3 py-1 rounded z-[1000]">
            Click map to set center
          </div>
        )}
        <MapContainer
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
          {displayedMarkers.map((m) => (
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
          ))}
        </MapContainer>
      </main>
    </div>
  );
}
