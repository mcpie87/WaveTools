import type { Config } from "tailwindcss";

const config: Config = {
	darkMode: ['class', 'class'],
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
				'text-primary': 'rgb(var(--text-primary) / <alpha-value>)',
				'text-secondary': 'rgb(var(--text-secondary) / <alpha-value>)',
				'base-100': 'rgb(var(--base-100) / <alpha-value>)',
				'base-200': 'rgb(var(--base-200) / <alpha-value>)',
				'base-300': 'rgb(var(--base-300) / <alpha-value>)',
				'static-base-light-100': '#dddddd',
				'static-base-dark-100': '#333333',
				'static-text-primary': '#000000',
				rarity5: '#e1d170',
				rarity4: '#cab2e3',
				rarity3: '#5c9bcc',
				rarity2: '#55ffcc',
				rarity1: '#ffffff',
				background: 'hsl(var(--background))',
				foreground: 'hsl(var(--foreground))',
				card: {
					DEFAULT: 'hsl(var(--card))',
					foreground: 'hsl(var(--card-foreground))'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover))',
					foreground: 'hsl(var(--popover-foreground))'
				},
				primary: {
					DEFAULT: 'hsl(var(--primary))',
					foreground: 'hsl(var(--primary-foreground))'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary))',
					foreground: 'hsl(var(--secondary-foreground))'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted))',
					foreground: 'hsl(var(--muted-foreground))'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent))',
					foreground: 'hsl(var(--accent-foreground))'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive))',
					foreground: 'hsl(var(--destructive-foreground))'
				},
				border: 'hsl(var(--border))',
				input: 'hsl(var(--input))',
				ring: 'hsl(var(--ring))',
				chart: {
					'1': 'hsl(var(--chart-1))',
					'2': 'hsl(var(--chart-2))',
					'3': 'hsl(var(--chart-3))',
					'4': 'hsl(var(--chart-4))',
					'5': 'hsl(var(--chart-5))'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			}
		}
	},
	plugins: [require("tailwindcss-animate")],
}
export default config;
