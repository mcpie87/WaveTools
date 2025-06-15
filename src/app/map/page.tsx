'use client'; // Mark as a Client Component in Next.js
import 'leaflet/dist/leaflet.css';

import React, { useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, Popup, useMap, useMapEvent } from 'react-leaflet';
import L from 'leaflet';
import './fixLeafletIcon';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ASSET_URL } from '@/constants/constants';
import { TranslationMap } from './translationMap';

const simpleCRS = L.CRS.Simple;

const scaleFactor = 0.3013
const convertMarkerToCoord = (marker: APIMarker): IMarker => {
  return {
    x: 256 + scaleFactor * (marker.Transform[0].X / 10000),
    y: -1 * scaleFactor * (marker.Transform[0].Y / 10000),
    z: marker.Transform[0].Z / 10000,
    name: marker.BlueprintType,
    description: JSON.stringify(marker, null, 2),
    displayedX: marker.Transform[0].X / 10000,
    displayedY: marker.Transform[0].Y / 10000,
    displayedZ: marker.Transform[0].Z / 10000,
    category: marker.BlueprintType,
  }
};
const convertMarkersToCoords = (markers: APIMarker[]): IMarker[] => markers.map(convertMarkerToCoord);


const prefix = `${ASSET_URL}UIResources/UiWorldMap/`;
const mapUrl: Record<string, string> = {
  "8": `${prefix}/Image/MapTiles/T_MapTiles_{x}_{y}_UI.png`, // Main
  "900": `${prefix}/Image/HHATiles/T_HHATiles_{x}_{y}_UI.png`, // Tethys Deep
  "902": `${prefix}/Image/JKTiles/T_JKTiles_{x}_{y}_UI.png`, // Vault Undergrounds
  "903": `${prefix}/Image/DDTTiles/T_DDTTiles_{x}_{y}_UI.png`, // Avinoleum
}

function CustomTileLayer({ mapId, tileSize = 256, mapHeightInTiles = 10 }: { mapId: number, tileSize?: number, mapHeightInTiles?: number }) {
  const map = useMap();

  useEffect(() => {
    const tileLayer = L.tileLayer('', {
      tileSize,
      noWrap: true,
      // MapContainer zooms - allows user interaction outside native zoom
      minZoom: -4,
      maxZoom: 10,

      // IMPORTANT: Tells Leaflet tiles ONLY exist at z=0
      minNativeZoom: 0,
      maxNativeZoom: 0,

      // Other options...
      zoomOffset: 0,
      // center={[0, 0]} // Usually set on MapContainer
      // zoom={-10}      // Usually set on MapContainer
      // minZoom={-10}   // Handled by MapContainer minZoom prop
      // maxZoom={10}    // Handled by MapContainer maxZoom prop
    });

    tileLayer.getTileUrl = function ({ x, y }) {
      const url: string = mapUrl[mapId].replace("{x}", x.toString()).replace("{y}", `${-y}`.toString());
      return url;
    };

    tileLayer.addTo(map);

    return () => {
      map.removeLayer(tileLayer);
    };
  }, [map, mapId, tileSize, mapHeightInTiles]);

  return null;
}


interface APIMarker {
  Transform: {
    X: number;
    Y: number;
    Z: number;
  }[];
  BlueprintType: string;
  MapId: number;
  ComponentsData?: {
    RewardComponent?: {
      RewardId?: number;
    }
  }
  name?: string;
  description?: string;
}

interface IMarker {
  x: number;
  y: number;
  z: number;
  name: string;
  description: string;
  category: string;
  displayedX: number;
  displayedY: number;
  displayedZ: number;
}

// function isInCategory(marker: APIMarker, category: string): boolean {
//   if (!TranslationMap[category]) return false;
//   let isValid = true;
//   const {
//     rewardId
//   } = TranslationMap[category];
//   if (rewardId && rewardId !== marker.ComponentsData?.RewardComponent?.RewardId) isValid = false;
//   return isValid;
// }

export default function XYZMap() {
  const [data, setData] = useState<APIMarker[]>([]);
  const [selectedMap, setSelectedMap] = useState<number>(8);
  const [selectedPoint, setSelectedPoint] = useState<[number, number, number]>([0, 0, 0]);
  const [radius, setRadius] = useState<number>(50); // displayed in game
  const selectedMapRef = useRef<HTMLInputElement>(null);
  const selectedPointXRef = useRef<HTMLInputElement>(null);
  const selectedPointYRef = useRef<HTMLInputElement>(null);
  const selectedPointZRef = useRef<HTMLInputElement>(null);
  const [visibleCategories, setVisibleCategories] = useState<Record<string, boolean>>({});

  // Search filter regex
  // "X":\s*(830).*\n\s*"Y": (690).*,\n\s*"Z": (14).*$
  useEffect(() => {
    async function fetchData() {
      const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
      const URL = "https://raw.githubusercontent.com/Arikatsu/WutheringWaves_Data/refs/heads/2.4/BinData/level_entity/levelentityconfig.json"
      const dataResponse = await fetch(
        process.env.NODE_ENV === "development"
          ? `${basePath}/data/levelentityconfig.json`
          : URL
      );
      const data = await dataResponse.json();
      console.log("Fetched data", data.length);
      setData(data);
    }
    fetchData();
  }, [])

  if (data.length === 0) return (<div>You&apos;re downloading a 90MB file of data... Loading...</div>);
  // const isHidden = (marker: APIMarker) => {
  //   if (Object.keys(marker.ComponentsData).length === 0) return false;
  //   const { NearbyTrackingComponent, InteractComponent } = marker.ComponentsData;
  //   if (InteractComponent?.Options) {
  //     for (const option of InteractComponent.Options) {
  //       const { Type, Condition } = option;
  //       if (Type.Type === "Actions") {
  //         for (const action of Type.Actions) {
  //           if (action.Name === "EnableNearbyTracking") {
  //             return true;
  //           }
  //         }
  //       }
  //     }
  //   }
  //   return false;
  // }

  let markers = data
    .filter(entry => entry.MapId === selectedMap)
  // .filter(entry => entry.BlueprintType === "Gameplay104")
  // .filter(entry => entry.ComponentsData?.TriggerComponent?.Actions?.filter(action => action.Name === "AdjustPlayerCamera")?.length > 0)
  // .filter(entry => entry.ComponentsData?.TriggerComponent?.Actions?.filter(action => action.Name === "AdjustPlayerCamera" && action.Params?.Option?.Type === "关卡.Common.镜头调整")?.length > 0)
  // .filter(entry => entry.IsHidden === true || entry.InSleep === true)
  // .filter(entry => Object.keys(entry.ComponentsData).length > 0)
  // .filter(entry => isHidden(entry) === true)

  const categoriesCounts: Record<string, number> = {};
  for (const marker of markers) {
    categoriesCounts[marker.BlueprintType] = (categoriesCounts[marker.BlueprintType] || 0) + 1;
  }
  const categories = Object.entries(categoriesCounts).sort((a, b) => a[0].localeCompare(b[0]));

  // Need to translate it to ingame value
  const displayedPoint: APIMarker = {
    Transform: [{
      X: (10000 * selectedPoint[0]),
      Y: (10000 * selectedPoint[1]),
      Z: 10000 * selectedPoint[2],
    }],
    name: "Selected point",
    BlueprintType: "Test Marker",
    MapId: selectedMap,
    description: "Selected point",
  };

  const markersWithinRadius = markers.filter(marker => (
    Math.sqrt(
      Math.pow(marker.Transform[0].X - displayedPoint.Transform[0].X, 2) +
      Math.pow(marker.Transform[0].Y - displayedPoint.Transform[0].Y, 2) +
      (
        displayedPoint.Transform[0].Z !== 0
          ? Math.pow(marker.Transform[0].Z - displayedPoint.Transform[0].Z, 2)
          : 0
      )
    ) < radius * 10000
  ));
  console.log("Selected point", selectedPoint);
  console.log("Displayed point", displayedPoint);
  console.log("Markers within radius", markersWithinRadius.length, markersWithinRadius);


  markers = markersWithinRadius.length > 0 && selectedPoint.join("") !== "000"
    ? markersWithinRadius
    : markers.filter(entry => visibleCategories[entry.BlueprintType]);
  const displayedMarkers = [
    ...selectedPoint.join("") === "000" ? [] : [convertMarkerToCoord(displayedPoint)],
    ...convertMarkersToCoords(markers)
  ];

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    console.log("handleCheckboxChange", name, value, event.target.checked);
    setVisibleCategories(prevState => ({
      ...prevState,
      [name]: event.target.checked
    }));
  }


  const handleMapClick = (latlng: L.LatLng) => {
    setSelectedPoint([
      (latlng.lng - 256) / scaleFactor,
      (-latlng.lat) / scaleFactor,
      0
    ])
    console.log("Clicked map coords (Leaflet):", latlng);
  };

  function ClickHandler({ onClick }: { onClick: (latlng: L.LatLng) => void }) {
    useMapEvent('click', (e) => {
      onClick(e.latlng);
    });
    return null;
  }

  const updateSettings = () => {
    setSelectedMap(parseInt(selectedMapRef.current?.value ?? "0"));
    setSelectedPoint([
      parseInt((selectedPointXRef.current?.value ?? 0).toString()),
      parseInt((selectedPointYRef.current?.value ?? 0).toString()),
      parseInt((selectedPointZRef.current?.value ?? 0).toString()),
      // parseInt(selectedPointZRef.current?.value)
    ]);
  }

  const definedCategories = categories.filter(category => TranslationMap[category[0]]);
  const undefinedCategories = categories.filter(category => !TranslationMap[category[0]]);

  const getCategoryColor = (category: string) => {
    // Generate a hash from category string
    let hash = 0;
    for (let i = 0; i < category.length; i++) {
      hash = category.charCodeAt(i) + ((hash << 5) - hash);
    }
    const hue = Math.abs(hash) % 360; // 0-359 hue range
    return `hsl(${hue}, 70%, 50%)`; // Saturation & lightness fixed
  };

  const customDivIcon = (label: string, category: string) => L.divIcon({
    html: `<div class="w-5 h-5 rounded-full text-white text-xs flex items-center justify-center border-2 border-white" style="background-color: ${getCategoryColor(category)}"></div>`,
    className: '',
    iconSize: [20, 20],
    iconAnchor: [10, 10],
  });

  return (
    <div className="flex flex-row">
      <div>
        <div className="flex flex-row gap-2">
          <Input
            id="map-select"
            type="number"
            defaultValue={selectedMap}
            ref={selectedMapRef}
          />
          <Button
            type="submit"
            onClick={() => { updateSettings() }}
          >Change map</Button>
        </div>
        <div className="flex flex-row gap-2">
          <Input
            id="radius-input"
            type="number"
            defaultValue={radius}
            onChange={(e) => { setRadius(parseInt(e.target.value)) }}
          />
          <Button
            type="submit"
            onClick={() => { updateSettings() }}
          >Update</Button>
        </div>
        <div className="flex flex-row gap-2">
          <Input
            id="x-input"
            type="number"
            defaultValue={selectedPoint[0]}
            ref={selectedPointXRef}
          />
          <Input
            id="y-input"
            type="number"
            defaultValue={selectedPoint[1]}
            ref={selectedPointYRef}
          />
          <Input
            id="z-input"
            type="number"
            defaultValue={selectedPoint[2]}
            ref={selectedPointZRef}
          />
          <Button
            type="submit"
            onClick={() => { updateSettings() }}
          >Update</Button>
        </div>
        <div>Defined categories {definedCategories.length}</div>
        {definedCategories.sort((a, b) => TranslationMap[a[0]].name.localeCompare(TranslationMap[b[0]].name)).map(([category, count]) => (
          <div key={category} className="flex flex-row gap-2">
            <input type="checkbox" id={category} name={category} value={category} onChange={handleCheckboxChange} checked={visibleCategories[category]} />
            <h2>{TranslationMap[category]?.name ? ` (${TranslationMap[category].name})` : ""} {category} ({count})</h2>
          </div>
        ))}

        <div>Not defined {undefinedCategories.length}</div>
        {undefinedCategories.map(([category, count]) => (
          <div key={category} className="flex flex-row">
            <input type="checkbox" id={category} name={category} value={category} onChange={handleCheckboxChange} checked={visibleCategories[category]} />
            <h2>{category}{TranslationMap[category]?.name ? ` (${TranslationMap[category].name})` : ""} ({count})</h2>
          </div>
        ))}
      </div>
      <MapContainer
        crs={simpleCRS}
        center={[0, 0]}
        zoom={0}
        minZoom={-10}
        maxZoom={10}
        style={{ height: '1200px', width: '100%' }}
        attributionControl={false}
      >
        <CustomTileLayer
          mapId={selectedMap}
          tileSize={256}
        />
        <ClickHandler onClick={(latlng) => handleMapClick(latlng)} />
        {displayedMarkers.map((coord, index) => (
          <Marker
            key={index}
            position={[coord.y, coord.x]}
            icon={customDivIcon(coord.name, coord.category)}
          >
            <Popup>
              <div>
                <strong>{coord.name}</strong><br />
                <pre>{coord.description}</pre>
                X: {coord.displayedX}<br />
                Y: {coord.displayedY}<br />
                Z: {coord.displayedZ}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div >
  );
};