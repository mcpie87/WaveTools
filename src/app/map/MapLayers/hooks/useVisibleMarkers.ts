import { useMemo } from "react";
import { useMapViewBounds } from "../../hooks/useMapViewBounds";
import RBush from "rbush";
import { IMarker } from "../../types";

export function useVisibleMarkers(markers: IMarker[]) {
  const viewBounds = useMapViewBounds();
  const spatialIndex = useMemo(() => {
    const tree = new RBush<{ minX: number; minY: number; maxX: number; maxY: number; marker: IMarker }>();
    tree.load(markers.map(m => ({
      minX: m.x, maxX: m.x,
      minY: m.y, maxY: m.y,
      marker: m,
    })));
    return tree;
  }, [markers]);

  return useMemo(() => {
    const sw = viewBounds.getSouthWest();
    const ne = viewBounds.getNorthEast();
    return spatialIndex.search({
      minX: sw.lng, minY: sw.lat,
      maxX: ne.lng, maxY: ne.lat,
    })
      .map(n => n.marker)
  }, [spatialIndex, viewBounds]);
}