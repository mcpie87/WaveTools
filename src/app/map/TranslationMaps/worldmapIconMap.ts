import { ASSET_URL } from "@/constants/constants";

const WorldmapIconMap: Record<string, string> = {
  "Resonance Nexus": "Atlas/WorldMapIcon/SP_IconMap_CS_01_UI.png",
  "Resonance Beacon": "Atlas/WorldMapIcon/SP_IconMap_CS_02_UI.png",
  "Sonance Casket": "Image/IconMst160/T_IconMst160_006_UI.png",
  "Lahai Tape": "Image/IconTask80/T_IconTask80_Task_181_UI.png",
};

export const getWorldmapIcon = (name: string): string | null => {
  const iconMatch = WorldmapIconMap[name];
  if (!iconMatch) return null;

  return `${ASSET_URL}UIResources/Common/${iconMatch}`;
};
