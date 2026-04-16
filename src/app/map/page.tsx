'use client';

import 'leaflet/dist/leaflet.css';

import React, { useMemo } from 'react';
import { MapContainer, Circle } from 'react-leaflet';
import L from 'leaflet';
import './fixLeafletIcon';

import { APIMarker, IMarker } from './types';
import {
  convertMarkerToCoord,
  getBounds,
  getMapCenter,
  isCustomMapSelected,
  mapConfigs,
  MapName,
  scaleFactor,
  TILE_SIZE,
  unionMapConfigs,
  UnionMapName,
} from './mapUtils';
import { MapSettingsComponent } from './Components/MapSettingsComponent';
import { useFilteredMarkers } from './hooks/useFilteredMarkers';
import { CustomTileLayer } from './MapLayers/CustomTileLayer';
import { AreaTileLayer } from './MapLayers/AreaTileLayer';
import { useMapLogic } from './hooks/useMapLogic';
import { MapClickHandler } from './handlers/MapClickHandler';
import { MarkerLayer } from './MapLayers/MarkerLayer';
import { useMapCategoryStats } from './hooks/useMapCategoryStats';
import { useDisplayedMarkers } from './hooks/useDisplayedMarkers';
import { useMapStore } from './state/mapStore';
import { MapFlyToHandler } from './handlers/MapFlyToHandler';
import { MultiSelectToolbar } from './Components/MultiSelectToolbar';
import { CursorCoordinates } from './Components/CursorCoordinates';


const simpleCRS = L.CRS.Simple;

export default function XYZMap() {
  const { indexes, ready, areaLayers } = useMapLogic();

  // Use Zustand store for UI state
  const selectedMap = useMapStore((state) => state.selectedMap);
  const setSelectedMap = useMapStore((state) => state.setSelectedMap);
  const activeAreaId = useMapStore((state) => state.activeAreaId);
  const selectedMapId = useMapStore((state) => state.selectedMapId);
  const setSelectedMapId = useMapStore((state) => state.setSelectedMapId);
  const enableClick = useMapStore((state) => state.enableClick);
  const setEnableClick = useMapStore((state) => state.setEnableClick);
  const coords = useMapStore((state) => state.coords);
  const setCoords = useMapStore((state) => state.setCoords);
  const radius = useMapStore((state) => state.radius);
  const setRadius = useMapStore((state) => state.setRadius);
  const showDescriptions = useMapStore((state) => state.showDescriptions);
  const setShowDescriptions = useMapStore((state) => state.setShowDescriptions);
  const hideVisited = useMapStore((state) => state.hideVisited);
  const setHideVisited = useMapStore((state) => state.setHideVisited);

  // DB state and actions
  const dbMapData = useMapStore((state) => state.dbMapData);
  const toggleCategory = useMapStore((state) => state.toggleCategoryVisibility);
  const toggleCategories = useMapStore(
    (state) => state.bulkSetCategoryVisibility
  );
  const clearCategories = useMapStore(
    (state) => state.clearCategoriesVisibility
  );
  const toggleDisplayedCategoryGroup = useMapStore(
    (state) => state.setCategoryGroupVisibility
  );

  const markers = useFilteredMarkers(indexes, selectedMap, selectedMapId);
  const categories: Array<[string, number, number]> = useMapCategoryStats(
    markers,
    dbMapData
  );

  const selectedPoint: IMarker = useMemo(() => {
    const apiMarker: APIMarker = {
      Transform: [
        {
          X: coords.x * 10000,
          Y: coords.y * 10000,
          Z: coords.z * 10000,
        },
      ],
      BlueprintType: 'Selected Point',
      Id: -1,
      EntityId: -1,
      MapId: mapConfigs[selectedMap]?.mapId ?? -1,
    };
    return convertMarkerToCoord(apiMarker, dbMapData.visitedEntities);
  }, [coords, selectedMap, dbMapData.visitedEntities]);

  const markersWithinRadius = useMemo(() => {
    const cx = coords.x * 10000;
    const cy = coords.y * 10000;
    const cz = coords.z * 10000;

    return markers.filter((m) => {
      const dx = (m.displayedX * 10000) - cx;
      const dy = (m.displayedY * 10000) - cy;
      const dz = cz ? (m.displayedZ * 10000) - cz : 0;
      return Math.sqrt(dx * dx + dy * dy + dz * dz) < radius * 10000;
    });
  }, [markers, coords, radius]);

  const displayedMarkers = useDisplayedMarkers(
    markers,
    markersWithinRadius,
    dbMapData,
    enableClick,
    selectedPoint,
    hideVisited,
  );

  if (!ready.entities || !ready.manifest) return <div className="p-4">Loading data…</div>;
  if (!ready.translations) return <div>Loading translations…</div>;

  return (
    <div className="h-screen w-screen flex relative">
      {/* Left controls */}
      <div className="absolute top-4 left-4 z-[20] flex items-start gap-4 pointer-events-none">
        <div className="pointer-events-auto shrink-0 transition-all duration-300">
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
        </div>
        <div className="pointer-events-auto transition-all duration-300">
          <MultiSelectToolbar displayedMarkers={displayedMarkers} />
        </div>
      </div>

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
          minZoom={-3}
          maxZoom={10}
          zoomControl={false}
          className={enableClick ? 'cursor-crosshair' : 'cursor-grab'}
          style={{
            height: '100%',
            width: '100%',
            backgroundColor: '#111',
          }}
          maxBounds={
            isCustomMapSelected(selectedMap)
              ? undefined
              : getBounds(selectedMap as UnionMapName, 5)
          }
          attributionControl={false}
        >
          {unionMapConfigs[selectedMap]?.url && selectedMapId === null && (
            <CustomTileLayer
              mapName={selectedMap as MapName}
              shouldDim={activeAreaId !== null && areaLayers.has(activeAreaId)}
            />
          )}
          {activeAreaId !== null && (
            <AreaTileLayer areaId={activeAreaId} areaLayers={areaLayers} />
          )}
          <MapClickHandler
            enabled={enableClick}
            onClick={(p) =>
              setCoords({
                x: (p.lng - TILE_SIZE) / scaleFactor,
                y: -p.lat / scaleFactor,
                z: 0,
              })
            }
          />
          <MapFlyToHandler />
          <MarkerLayer markers={displayedMarkers} />
          <CursorCoordinates />
          {enableClick && (
            <Circle
              center={[-coords.y * scaleFactor, TILE_SIZE + coords.x * scaleFactor]}
              radius={radius * scaleFactor}
              pathOptions={{
                color: '#eab308',
                fillColor: '#eab308',
                fillOpacity: 0.2,
                weight: 2,
                dashArray: '8, 12',
              }}
            />
          )}
        </MapContainer>
      </main>
    </div>
  );
}
