import { Migration } from "../migrationTypes";
import { LEVEL_ENTITY_CONFIG_URL } from "@/constants/constants";

const migration20260214T0020: Migration = {
  // version 3.1 is when map was introduced
  version: "2026-02-14T00-20",
  description: "Remap visited Ids to visited Entity Ids",
  up: async () => {
    const mapStorageData = localStorage.getItem("wave_tools_map");
    if (!mapStorageData) {
      return;
    }
    const { visitedMarkers } = JSON.parse(mapStorageData);
    if (!visitedMarkers) {
      return;
    }

    const URL = LEVEL_ENTITY_CONFIG_URL["3.1"];
    const cache = await caches.open('levelentityconfig-cache');
    const cached = await cache.match(URL);
    const data = cached
      ? await cached.json()
      : await fetch(URL).then(res => res.json());

    const newVisitedSet = new Set<number>();
    for (const { Id, EntityId } of data) {
      if (visitedMarkers[Id as number]) {
        newVisitedSet.add(EntityId);
      }
    }

    const visitedMarkersSize = Object.entries(visitedMarkers).filter(e => e[1]).length;
    const newVisitedSetSize = newVisitedSet.size;
    if (visitedMarkersSize !== newVisitedSetSize) {
      console.error("Migration failed: contact developer");
      throw Error("Migration failed: contact developer");
    }

    // TODO: migration remove
    console.log("Migration: Backing up visitedMarkers", Object.entries(visitedMarkers).length);
    localStorage.setItem("wave_tools_map_backup_3_1_visitedMarkers", JSON.stringify(visitedMarkers));
    localStorage.setItem("wave_tools_map", JSON.stringify({
      ...JSON.parse(mapStorageData),
      visitedMarkers: [...newVisitedSet],
    }));

    const restoreOldMapStorageData = () => {
      localStorage.setItem("wave_tools_map", mapStorageData);
    }
    // Validation check
    const newMapStorageData = localStorage.getItem("wave_tools_map");
    if (!newMapStorageData) {
      restoreOldMapStorageData();
      console.error("Migration failed: contact developer newMapStorageData is empty");
      throw Error("Migration failed: contact developer");
    }

    const { visitedMarkers: newVisitedMarkersArray } = JSON.parse(newMapStorageData);
    const newVisitedMarkers = new Set(newVisitedMarkersArray);
    if (!newVisitedMarkers) {
      restoreOldMapStorageData();
      console.error("Migration failed: contact developer newVisitedMarkers is empty");
      throw Error("Migration failed: contact developer");
    }

    if (visitedMarkersSize !== newVisitedMarkers.size) {
      restoreOldMapStorageData();
      console.error(visitedMarkersSize, newVisitedMarkers.size);
      console.error("Migration failed: contact developer visitedMarkersSize !== newVisitedMarkers.size");
      throw Error("Migration failed: contact developer");
    }

  }
}
export default migration20260214T0020;