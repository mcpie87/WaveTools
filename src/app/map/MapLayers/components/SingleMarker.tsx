import { Marker } from "react-leaflet";
import { CustomPopup } from "../../Components/CustomPopup";
import { IMarker } from "../../types";
import React, { useMemo } from "react";
import { useMapStore } from "../../state/mapStore";

interface SingleMarkerProps {
  marker: IMarker;
  getIcon: (category: string, visited: boolean) => L.DivIcon;
}

export const SingleMarkerComponent = ({
  marker,
  getIcon,
}: SingleMarkerProps) => {
  const visited = useMapStore(
    (state) => !!state.dbMapData.visitedMarkers[marker.id as number]
  );
  const showDescriptions = useMapStore((state) => state.showDescriptions);
  const toggleMarkerVisited = useMapStore((state) => state.toggleMarkerVisited);
  const activeAreaId = useMapStore((state) => state.activeAreaId);
  const setActiveAreaId = useMapStore((state) => state.setActiveAreaId);

  const icon = useMemo(
    () => getIcon(marker.category, visited),
    [getIcon, marker.category, visited]
  );

  const handleMarkerClick = () => {
    if (marker.areaId !== activeAreaId) {
      setActiveAreaId(marker.areaId);
    }
  };

  return (
    <Marker
      position={[marker.y, marker.x]}
      icon={icon}
      eventHandlers={{
        click: handleMarkerClick,
      }}
    >
      <CustomPopup
        marker={marker}
        toggleVisited={() => toggleMarkerVisited(marker.id as number)}
        visited={visited}
        showDescription={showDescriptions}
      />
    </Marker>
  );
};

SingleMarkerComponent.displayName = "SingleMarker";

const areEqual = (prev: SingleMarkerProps, next: SingleMarkerProps) => {
  return prev.marker.id === next.marker.id && prev.getIcon === next.getIcon;
};

export const SingleMarker = React.memo(SingleMarkerComponent, areEqual);
