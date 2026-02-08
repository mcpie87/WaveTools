import { ASSET_URL } from "@/constants/constants";

const WorldmapIconMap: Record<string, string> = {
  "Resonance Nexus": "SP_IconMap_CS_01_UI.png",
  "Resonance Beacon": "SP_IconMap_CS_02_UI.png",
};

export const getWorldmapIcon = (name: string): string | null => {
  const iconMatch = WorldmapIconMap[name];
  if (!iconMatch) return null;

  return `${ASSET_URL}UIResources/Common/Atlas/WorldMapIcon/${iconMatch}`;
};
