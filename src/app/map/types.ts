export interface APIMarker {
  Transform: { X: number; Y: number; Z: number }[];
  BlueprintType: string;
  MapId: number;
  Id?: number;
  AreaId?: number;
  EntityId?: number;
  ComponentsData?: {
    RewardComponent?: { RewardId?: number };
  };
  name?: string;
  description?: string;
}

export interface IMarker {
  x: number;
  y: number;
  z: number;
  id?: number;
  entityId?: number;
  areaId: number;
  name: string;
  description: string;
  category: string;
  displayedX: number;
  displayedY: number;
  displayedZ: number;
  visited: boolean;
}