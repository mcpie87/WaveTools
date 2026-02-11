'use client';

import 'leaflet/dist/leaflet.css';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MapContainer, Marker, useMap, useMapEvent } from 'react-leaflet';
import L from 'leaflet';
import './fixLeafletIcon';

import { UnionTranslationMap } from './TranslationMaps/translationMap';
import LocalStorageService from '@/services/LocalStorageService';
import { APIMarker, IMarker } from './types';
import { DbMapData } from '@/types/mapTypes';
import { loadBlueprintTranslations } from './BlueprintTranslationService';
import { convertMarkerToCoord, mapUrl, scaleFactor } from './mapUtils';
import { CustomPopup } from './Components/CustomPopup';
import { getWorldmapIcon } from './TranslationMaps/worldmapIconMap';
import { ASSET_URL } from '@/constants/constants';
import { MapSettingsComponent } from './Components/MapSettingsComponent';
import { isDevelopment } from '@/utils/utils';

const simpleCRS = L.CRS.Simple;


const storageService = new LocalStorageService("map");

/* --------------------------- Components -------------------------- */
function CustomTileLayer({ mapId, shouldDim }: { mapId: number; shouldDim: boolean }) {
  const map = useMap();
  const layerRef = useRef<L.TileLayer | null>(null);

  useEffect(() => {
    const tileLayer = L.tileLayer('', {
      tileSize: 256,
      noWrap: true,
      minZoom: -10,
      maxZoom: 10,
      minNativeZoom: 0,
      maxNativeZoom: 0,
      opacity: 1,
    });

    tileLayer.getTileUrl = ({ x, y }) =>
      mapUrl[mapId].replace('{x}', `${x}`).replace('{y}', `${-y}`);

    tileLayer.addTo(map);
    layerRef.current = tileLayer;

    return () => {
      map.removeLayer(tileLayer);
    };
  }, [map, mapId]);

  useEffect(() => {
    if (layerRef.current) {
      layerRef.current.setOpacity(shouldDim ? 0.5 : 1);
    }
  }, [shouldDim]);

  return null;
}


function AreaTileLayer({ areaId, areaLayers }: { areaId: number, areaLayers: Map<number, APIAreaLayer> }) {
  const map = useMap();

  useEffect(() => {
    const area = areaLayers.get(areaId);
    if (!area) return;

    const tileLayer = L.tileLayer('', {
      tileSize: 256,
      noWrap: true,
      minZoom: -10,
      maxZoom: 10,
      minNativeZoom: 0,
      maxNativeZoom: 0,
      zIndex: 500,
      opacity: 0.85,
    });

    tileLayer.getTileUrl = ({ x, y }) => {
      const tileX = x;
      const tileY = -y;

      const entry = Object.entries(area.mapTiles).find(([key]) =>
        key.includes(`_${tileX}_${tileY}_`)
      );

      if (!entry) return '';

      return ASSET_URL + entry[1].replace(/^\/Game\/Aki\/UI\//, '');
    };

    tileLayer.addTo(map);

    return () => {
      map.removeLayer(tileLayer);
    };
  }, [map, areaId, areaLayers]);

  return null;
}


function ClickHandler({ enabled, onClick }: { enabled: boolean; onClick: (p: L.LatLng) => void }) {
  useMapEvent('click', e => {
    if (enabled) onClick(e.latlng);
  });
  return null;
}

/* ----------------------------- Main ------------------------------ */

interface APIAreaLayer {
  mapId: number;
  areaId: number;
  mapTiles: Record<string, string>;
}

export default function XYZMap() {
  const [data, setData] = useState<APIMarker[]>([]);
  const [layersData, setLayersData] = useState<APIAreaLayer[]>([]);

  const [activeAreaId, setActiveAreaId] = useState<number | null>(null);
  const [selectedMap, setSelectedMap] = useState(8);

  const [enableClick, setEnableClick] = useState(false);
  const [coords, setCoords] = useState({ x: 0, y: 0, z: 0 });
  const [radius, setRadius] = useState(50);

  const [showDescriptions, setShowDescriptions] = useState(false);
  const [hideVisited, setHideVisited] = useState(false);

  const [dbMapData, setDbMapData] = useState<DbMapData>(() => {
    const loaded = storageService.load() as Partial<DbMapData> | null;

    return {
      visibleCategories: loaded?.visibleCategories ?? {},
      visitedMarkers: loaded?.visitedMarkers ?? {},
      displayedCategoryGroups: loaded?.displayedCategoryGroups ?? {},
    };
  });
  const [translationsReady, setTranslationsReady] = useState(false);

  useEffect(() => {
    loadBlueprintTranslations().then(() => setTranslationsReady(true));
  }, []);


  useEffect(() => {
    storageService.save(dbMapData);
  }, [dbMapData]);

  /* ----------------------------- Data ----------------------------- */
  useEffect(() => {
    // Tile caching
    if ('serviceWorker' in navigator) {
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
      const swUrl = `${basePath}/sw.js`;
      navigator.serviceWorker.register(swUrl);
    }
  }, []);


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
    (async () => {
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
      const URL = `${basePath}/data/map_tiles.json`;

      const cache = await caches.open('area-layers-cache');
      const cached = await cache.match(URL);

      if (cached) {
        setLayersData(await cached.json());
        return;
      }

      const res = await fetch(URL);
      if (res.ok) {
        await cache.put(URL, res.clone());
        setLayersData(await res.json());
      }
    })();
  }, []);

  const areaLayers: Map<number, APIAreaLayer> = new Map();
  layersData.forEach(l => {
    areaLayers.set(l.areaId, l);
  });

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
      : markers.filter(m => dbMapData.visibleCategories[m.BlueprintType]);
    return [
      ...(enableClick ? [convertMarkerToCoord(selectedPoint, dbMapData.visitedMarkers)] : []),
      ...base.map((m) => convertMarkerToCoord(m, dbMapData.visitedMarkers))
        .filter(m => !hideVisited || !dbMapData.visitedMarkers[m.id as number]),
    ]
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

    if (!isDevelopment() && iconCache.current.has(key)) {
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
  const markerComponents = useMemo(() => {
    return displayedMarkers.map((m) => (
      <Marker
        key={`${m.id}:${dbMapData.visitedMarkers[m.id as number]}:${hideVisited}`}
        position={[m.y, m.x]}
        icon={getIcon(m.category, !!dbMapData.visitedMarkers[m.id as number])}
        eventHandlers={{
          click: () => {
            if (m.areaId !== activeAreaId) {
              setActiveAreaId(m.areaId);
            }
          }
        }}
      >
        <CustomPopup
          marker={m}
          toggleVisited={() => toggleMarkerVisited(m)}
          visited={!!dbMapData.visitedMarkers[m.id as number]}
          showDescription={showDescriptions}
        />
      </Marker>
    ));
  }, [displayedMarkers, dbMapData.visitedMarkers, hideVisited, showDescriptions, getIcon, activeAreaId]);

  if (!data.length) return <div className="p-4">Loading data…</div>;

  if (!translationsReady) return <div>Loading translations…</div>;
  return (
    <div className="h-screen w-screen flex relative">
      {/* Left controls */}
      <MapSettingsComponent
        selectedMap={selectedMap}
        setSelectedMap={setSelectedMap}
        coords={coords}
        setCoords={setCoords}
        radius={radius}
        setRadius={setRadius}
        enableClick={enableClick}
        setEnableClick={setEnableClick}
        hideVisited={hideVisited}
        setHideVisited={setHideVisited}
        showDescriptions={showDescriptions}
        setShowDescriptions={setShowDescriptions}
        clearCategories={clearCategories}
        dbMapData={dbMapData}
        toggleCategory={toggleCategory}
        toggleCategories={toggleCategories}
        toggleDisplayedCategoryGroup={toggleDisplayedCategoryGroup}
        categories={categories}
      />

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
          zoomControl={false}
          className={enableClick ? 'cursor-crosshair' : 'cursor-grab'}
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: '#111',
          }}
          attributionControl={false}
        >
          <CustomTileLayer mapId={selectedMap} shouldDim={activeAreaId !== null && areaLayers.has(activeAreaId)} />
          {activeAreaId !== null && (
            <AreaTileLayer areaId={activeAreaId} areaLayers={areaLayers} />
          )}
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
