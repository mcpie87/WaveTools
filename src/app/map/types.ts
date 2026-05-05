import { APILevelPlayData, APIMapMark, APIQuestData } from "@/types/mapTypes";

export interface ComponentsData {
  RewardComponent?: { RewardId?: number };
  InteractComponent?: {
    InteractIcon?: string;
    Options?: {
      Icon?: string;
      Type?: {
        Type: string;
        Actions?: {
          Name: string;
          Params?: {
            SystemOption?: {
              Type: string;
              UnlockOption?: {
                Type: string;
                Id: number;
              };
            };
          };
        }[];
      };
    }[];
  };
}
export interface APIMarker {
  Transform: { X: number; Y: number; Z: number }[];
  BlueprintType: string;
  MapId: number;
  Id: number;
  AreaId?: number;
  EntityId: number;
  ComponentsData?: ComponentsData;
  name?: string;
  description?: string;
}

export interface IMarkerReferences {
  levelData?: {
    references?: string[];
    children?: string[];
  };
  questData?: {
    questData?: APIQuestData[];
    references?: number[];
    children?: number[];
    weakReferences?: number[];
  }
}

export interface IMarker {
  x: number;
  y: number;
  z: number;
  id?: number;
  entityId: number;
  mapId: number;
  areaId: number;
  name: string;
  description: string;
  metadata?: ComponentsData;
  mapMark?: APIMapMark;
  category: string;
  displayedX: number;
  displayedY: number;
  displayedZ: number;
  visited?: Set<string>;
  references?: IMarkerReferences;
  questData?: APIQuestData;
  levelPlayData?: APILevelPlayData;
  // for optimization purposes for entity mapping
  _matchedCategories?: { name: string, key: string, dictKey?: string }[];
}