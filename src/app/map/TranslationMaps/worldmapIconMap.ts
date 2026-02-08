import { ASSET_URL } from "@/constants/constants";

const GameAssetIcons: Record<string, string> = {
  "Resonance Nexus": "Atlas/WorldMapIcon/SP_IconMap_CS_01_UI.png",
  "Resonance Beacon": "Atlas/WorldMapIcon/SP_IconMap_CS_02_UI.png",

  "Sonance Casket": "Image/IconMst160/T_IconMst160_006_UI.png",
  "Windchimer": "Image/IconMst80/T_IconMst80_007_UI.png",
  "Sonance Casket: Ragunna": "Image/IconMst80/T_IconMst80_008_UI.png",
  "Sonance Casket: Septimont": "Image/IconMst80/T_IconMst80_008_UI.png",
  "Lahai Tape": "Image/IconTask80/T_IconTask80_Task_181_UI.png",

  "Bike Challenge": "Atlas/WorldMapIcon/SP_IconMap_Play_61_UI.png",

  "Bamboo Iris": "Image/IconC80/T_IconC80_bianzhuhua_UI.png",
  "Belle Poppy": "Image/IconRup80/T_IconRup80_SM_Gat_29A_UI.png",
  "Bloodleaf Viburnum": "Image/IconC80/T_IconC80_xueyejiami_UI.png",
  "Coriolus": "Image/IconRup80/T_IconRup80_SM_Gat_30A_UI.png",
  "Iris": "Image/IconRup80/T_IconRup80_SM_Gat_33A_UI.png",
  "Golden Fleece": "Image/IconC80/T_IconC80_045_UI.png",

  // 3.1
  "Moss Amber": "Image/IconC/T_IconC_072_UI.png",
};

const CustomIcons: Record<string, string> = {
  "Basic Supply Chest": "Basic_Supply_Chest.webp",
  "Standard Supply Chest": "Standard_Supply_Chest.webp",
  "Advanced Supply Chest": "Advanced_Supply_Chest.webp",
  "Premium Supply Chest": "Premium_Supply_Chest.webp",
  "Tidal Supply Chest": "Premium_Supply_Chest.webp",
  "Tidal Heritage (Blue)": "Tidal_Heritage_Blue.webp",
  "Tidal Heritage (Purple)": "Tidal_Heritage_Purple.webp",
  "Tidal Heritage (Gold)": "Tidal_Heritage_Gold.webp",
  "Mutterfly": "Mutterfly.png",
  "Blobfly": "Blobfly.webp",
};

export const getWorldmapIcon = (name: string): string | null => {
  const gameAssetIcon = GameAssetIcons[name];
  if (gameAssetIcon) return `${ASSET_URL}UIResources/Common/${gameAssetIcon}`;

  const iconMatch = CustomIcons[name];
  if (!iconMatch) return null;

  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';
  return `${basePath}/assets/${iconMatch}`;
};
