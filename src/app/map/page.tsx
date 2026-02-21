'use client';

import 'leaflet/dist/leaflet.css';

import React, { useCallback, useMemo } from 'react';
import { MapContainer } from 'react-leaflet';
import L from 'leaflet';
import './fixLeafletIcon';

import { APIMarker, IMarker } from './types';
import { getBounds, getMapCenter, isCustomMapSelected, mapConfigs, MapName, scaleFactor, TILE_SIZE, unionMapConfigs, UnionMapName } from './mapUtils';
import { MapSettingsComponent } from './Components/MapSettingsComponent';
import { useFilteredMarkers } from './hooks/useFilteredMarkers';
import { CustomTileLayer } from './MapLayers/CustomTileLayer';
import { AreaTileLayer } from './MapLayers/AreaTileLayer';
import { isMarkerVisited } from './state/map.selectors';
import { bulkSetCategoryVisibleAction, clearCategoriesVisibilityAction, setCategoryGroupVisibleAction, toggleCategoryVisibleAction, toggleMarkerVisitedAction } from './state/map.actions';
import { useMapLogic } from './hooks/useMapLogic';
import { MapClickHandler } from './handlers/MapClickHandler';
import { MarkerLayer } from './MapLayers/MarkerLayer';
import { useMapCategoryStats } from './hooks/useMapCategoryStats';
import { useDisplayedMarkers } from './hooks/useDisplayedMarkers';

const simpleCRS = L.CRS.Simple;

/* --------------------------- Components -------------------------- */


export default function XYZMap() {
  const {
    indexes,
    dbMapData,
    ready,
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

  const markers = useFilteredMarkers(indexes, selectedMap, selectedMapId);
  const categories: Array<[string, number, number]> = useMapCategoryStats(
    markers,
    dbMapData,
    isMarkerVisited
  )

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

  const displayedMarkers = useDisplayedMarkers(
    markers,
    markersWithinRadius,
    dbMapData,
    enableClick,
    selectedPoint,
    hideVisited
  );

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


  if (!ready.entities || !ready.manifest) return <div className="p-4">Loading data…</div>;
  if (!ready.translations) return <div>Loading translations…</div>;

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
          maxBounds={isCustomMapSelected(selectedMap) ? undefined : getBounds(selectedMap as UnionMapName, 5)}
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
            onClick={p =>
              setCoords({
                x: (p.lng - TILE_SIZE) / scaleFactor,
                y: -p.lat / scaleFactor,
                z: 0,
              })
            }
          />
          <MarkerLayer
            markers={displayedMarkers}
            dbMapData={dbMapData}
            hideVisited={hideVisited}
            showDescriptions={showDescriptions}
            activeAreaId={activeAreaId}
            setActiveAreaId={setActiveAreaId}
            toggleMarkerVisited={toggleMarkerVisited}
          />
        </MapContainer>
      </main>
    </div>
  );
}
