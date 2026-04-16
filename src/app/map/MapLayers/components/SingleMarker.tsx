import { Marker } from "react-leaflet";
import { CustomPopup } from "../../Components/CustomPopup";
import { IMarker } from "../../types";
import React, { useMemo } from "react";
import { useMapStore } from "../../state/mapStore";
import { isMarkerFullyVisited } from "../../state/map.selectors";

interface SingleMarkerProps {
  marker: IMarker;
  getIcon: (marker: IMarker, visited: boolean, selected: boolean) => L.DivIcon;
}

export const SingleMarkerComponent = ({
  marker,
  getIcon,
}: SingleMarkerProps) => {
  const showDescriptions = useMapStore((state) => state.showDescriptions);
  const activeAreaId = useMapStore((state) => state.activeAreaId);
  const setActiveAreaId = useMapStore((state) => state.setActiveAreaId);
  const multiSelectMode = useMapStore((state) => state.multiSelectMode);
  const isSelected = useMapStore(
    (state) => state.selectedMarkerIds.has(marker.id as number)
  );
  const toggleMarkerSelected = useMapStore((state) => state.toggleMarkerSelected);

  const isVisited = useMapStore((state) => isMarkerFullyVisited(state.dbMapData, marker));

  const icon = useMemo(
    () => getIcon(marker, isVisited, isSelected),
    [getIcon, marker, isVisited, isSelected]
  );

  const handleMarkerClick = () => {
    if (multiSelectMode) {
      if (marker.id !== undefined) {
        toggleMarkerSelected(marker.id);
      }
    }
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
      {!multiSelectMode && (
        <CustomPopup
          marker={marker}
          showDescription={showDescriptions}
        />
      )}
    </Marker>
  );
};

SingleMarkerComponent.displayName = "SingleMarker";

const areEqual = (prev: SingleMarkerProps, next: SingleMarkerProps) => {
  return prev.marker.id === next.marker.id && prev.getIcon === next.getIcon;
};

export const SingleMarker = React.memo(SingleMarkerComponent, areEqual);
