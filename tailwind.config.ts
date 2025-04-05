import type { Config } from "tailwindcss";

export default {
  darkMode: 'class',
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: [
    'bg-rarity1',
    'bg-rarity2',
    'bg-rarity3',
    'bg-rarity4',
    'bg-rarity5',
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        rarity5: "#e1d170",
        rarity4: "#cab2e3",
        rarity3: "#5c9bcc",
        rarity2: "#55ffcc",
        rarity1: "#ffffff",
      },
    },
  },
  plugins: [],
} satisfies Config;
