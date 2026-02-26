import { Marker } from "react-leaflet";
import { CustomPopup } from "../../Components/CustomPopup";
import { IMarker } from "../../types";
import React from "react";

interface SingleMarkerProps {
  marker: IMarker;
  visited: boolean;
  showDescriptions: boolean;
  icon: L.DivIcon;
  toggleMarkerVisited: (marker: IMarker) => void;
  onMarkerClick: (areaId: number | null) => void;
}
export const SingleMarkerComponent = ({
  marker, visited, showDescriptions, icon, toggleMarkerVisited, onMarkerClick,
}: SingleMarkerProps) => {
  return (
    <Marker
      position={[marker.y, marker.x]}
      icon={icon}
      eventHandlers={{
        click: () => onMarkerClick(marker.areaId)
      }}
    >
      <CustomPopup
        marker={marker}
        toggleVisited={() => toggleMarkerVisited(marker)}
        visited={visited}
        showDescription={showDescriptions}
      />
    </Marker>
  )
};

SingleMarkerComponent.displayName = "SingleMarker";

const areEqual = (prev: SingleMarkerProps, next: SingleMarkerProps) => {
  return prev.marker.id === next.marker.id
    && prev.visited === next.visited
    && prev.showDescriptions === next.showDescriptions;
};

export const SingleMarker = React.memo(SingleMarkerComponent, areEqual);