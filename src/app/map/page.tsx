'use client';

import 'leaflet/dist/leaflet.css';

import React, { useCallback, useEffect, useMemo, useRef } from 'react';
import { MapContainer, Marker, useMapEvent } from 'react-leaflet';
import L from 'leaflet';
import './fixLeafletIcon';

import { UnionTranslationMap } from './TranslationMaps/translationMap';
import { APIMarker, IMarker } from './types';
import { convertMarkerToCoord, getBounds, getMapCenter, isCustomMapSelected, mapConfigs, MapName, scaleFactor, TILE_SIZE, unionMapConfigs, UnionMapName } from './mapUtils';
import { CustomPopup } from './Components/CustomPopup';
import { getWorldmapIcon } from './TranslationMaps/worldmapIconMap';
import { MapSettingsComponent } from './Components/MapSettingsComponent';
import { isDevelopment } from '@/utils/utils';
import { useFilteredMarkers } from './hooks/useFilteredMarkers';
import { CustomTileLayer } from './MapLayers/CustomTileLayer';
import { AreaTileLayer } from './MapLayers/AreaTileLayer';
import { isMarkerVisited } from './state/map.selectors';
import { bulkSetCategoryVisibleAction, clearCategoriesVisibilityAction, setCategoryGroupVisibleAction, toggleCategoryVisibleAction, toggleMarkerVisitedAction } from './state/map.actions';
import { useMapLogic } from './hooks/useMapLogic';

const simpleCRS = L.CRS.Simple;

/* --------------------------- Components -------------------------- */
function ClickHandler({ enabled, onClick }: { enabled: boolean; onClick: (p: L.LatLng) => void }) {
  useMapEvent('click', e => {
    if (enabled) onClick(e.latlng);
  });
  return null;
}

export default function XYZMap() {
  const {
    data,
    translationsReady,
    dbMapData,
    dispatch,
    areaLayers,
    ui
  } = useMapLogic();
  const {
    activeAreaId,
    setActiveAreaId,
    selectedMap,
    setSelectedMap,
    selectedMapId,
    setSelectedMapId,
    enableClick,
    setEnableClick,
    coords,
    setCoords,
    radius,
    setRadius,
    showDescriptions,
    setShowDescriptions,
    hideVisited,
    setHideVisited
  } = ui;

  const iconCache = useRef(new Map<string, L.DivIcon>());
  useEffect(() => {
    iconCache.current.clear();
  }, [hideVisited]);

  const markers = useFilteredMarkers(data, selectedMap, selectedMapId);

  const categories: Array<[string, number, number]> = useMemo(() => {
    const totals: Record<string, number> = {};
    const visited: Record<string, number> = {};
    for (const m of markers) {
      totals[m.BlueprintType] = (totals[m.BlueprintType] ?? 0) + 1;
      visited[m.BlueprintType] =
        (visited[m.BlueprintType] ?? 0) +
        (isMarkerVisited(dbMapData, m.Id as number) ? 1 : 0);
    }
    const counts: Record<string, [number, number]> = {};
    for (const m of markers) {
      counts[m.BlueprintType] = [totals[m.BlueprintType], visited[m.BlueprintType]];
    }
    return Object.entries(counts).sort((a, b) => a[0].localeCompare(b[0])).map(([k, v]) => [k, v[0], v[1]]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [markers, dbMapData.visitedMarkers]);

  const selectedPoint: APIMarker = useMemo(() => {
    return {
      Transform: [{ X: coords.x * 10000, Y: coords.y * 10000, Z: coords.z * 10000 }],
      BlueprintType: 'Selected Point',
      MapId: mapConfigs[selectedMap]?.mapId ?? -1,
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

  const toggleMarkerVisited = useCallback((marker: IMarker) => {
    dispatch(toggleMarkerVisitedAction(marker.id as number));
  }, [dispatch]);

  const toggleCategory = useCallback((category: string) => {
    dispatch(toggleCategoryVisibleAction(category));
  }, [dispatch]);
  const toggleCategories = useCallback((categories: string[], value: boolean) => {
    dispatch(bulkSetCategoryVisibleAction(categories, value));
  }, [dispatch]);

  const clearCategories = useCallback(() => {
    dispatch(clearCategoriesVisibilityAction());
  }, [dispatch]);

  const toggleDisplayedCategoryGroup = useCallback((categoryGroup: string, value: boolean) => {
    dispatch(setCategoryGroupVisibleAction(categoryGroup, value));
  }, [dispatch]);

  /* --------------------------- Icons ------------------------------ */

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
  }, [
    displayedMarkers,
    dbMapData.visitedMarkers,
    showDescriptions,
    getIcon,
    activeAreaId,
    setActiveAreaId,
    hideVisited,
    toggleMarkerVisited
  ]);

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
        selectedMapId={selectedMapId}
        setSelectedMapId={setSelectedMapId}
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
          center={getMapCenter(selectedMap)}
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
          maxBounds={isCustomMapSelected(selectedMap) ? undefined : getBounds(selectedMap as UnionMapName, 4)}
          attributionControl={false}
        >
          {unionMapConfigs[selectedMap]?.url && selectedMapId === null && (
            <CustomTileLayer
              mapName={selectedMap as MapName}
              url={unionMapConfigs[selectedMap].url}
              shouldDim={activeAreaId !== null && areaLayers.has(activeAreaId)}
            />
          )}
          {activeAreaId !== null && (
            <AreaTileLayer areaId={activeAreaId} areaLayers={areaLayers} />
          )}
          <ClickHandler
            enabled={enableClick}
            onClick={p =>
              setCoords({
                x: (p.lng - TILE_SIZE) / scaleFactor,
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
