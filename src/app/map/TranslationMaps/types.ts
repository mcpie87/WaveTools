import { IMarker } from "../types";

export interface QueryCategory {
  key: string;
  name: string;
  query: (marker: IMarker) => boolean;
}