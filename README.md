# WaveTools

A collection of offline-first tools for **Wuthering Waves** players, built as a
[Next.js](https://nextjs.org/) (App Router) web application. Plan your character/weapon
progression, browse items and recipes, simulate echo rolls, manage your inventory, and
explore an interactive world map — all from the browser with no account required.

> Shortened link for the Planner: https://waa.ai/WaveToolsPlanner

## Features

### Planner
Add a resonator or weapon, set both the **current** and **desired** level/ascension, and
WaveTools calculates how many Waveplates and materials you still need to reach that goal.
A live summary on the side aggregates totals across every resonator and weapon you track.

- Add / edit / remove resonators and weapons
- Per-item current → desired level & ascension tracking
- Automatic Waveplate and material requirement calculation
- Inventory input so owned materials are deducted from the totals
- Drag-and-drop priority management and the ability to hide inactive items

### Items & Recipes
Browse the game's materials and view crafting recipes, with per-material requirements
(`recipes/` route and `components/items/`).

### Echo Simulation
A combinatorics-based simulator (`echo-simulation/`) that lets you pick desired substats
and estimates outcomes for echo substat rolls. Useful for understanding RNG and
min-maxing echo builds.

### Echo Leveling Strategy
Guidance and tooling for efficient echo leveling (`echo-leveling-strategy/`).

### Discard System
A matrix of every **Sonata** set against its possible main stats (1/3/4-cost echoes).
Mark which main stats you want to keep and which to discard, add per-set comments, and
use the column totals to see how many sets share a given main stat. Persisted locally.

### Union Level
Track Union Level progression data (`union-level/`).

### Interactive World Map
A full-screen, Leaflet + PixiJS map (`map/`) rendered from bundled **PMTiles** served
through IndexedDB. Browse thousands of categorized markers — chests, NPCs, mobs,
ores, plants, animals, puzzles, quests, teleporters, tidal heritages, and echoes by
cost — with:

- Category panes and a multi-select toolbar to filter/hide markers
- Per-category completion statistics
- Custom popups, dev-mode map settings, and cursor coordinate readouts
- User-placed markers stored locally (backed up/restored with the rest of your data)

## Tech Stack

| Area | Choice |
| --- | --- |
| Framework | Next.js 15 (App Router) + React 19, TypeScript |
| Styling | Tailwind CSS 3 + shadcn/ui-style primitives (Radix UI) |
| State | React Context, Zustand (map), XState (forms) |
| Persistence | Dexie (IndexedDB) + localStorage, with versioned migrations |
| Validation | Zod schemas |
| Map | Leaflet, react-leaflet, PixiJS, PMTiles |
| Testing | Jest + ts-jest + jsdom |
| Lint | ESLint 9 (`next lint`) |

## Project Structure

```
src/
  app/                     # Next.js routes (App Router)
    (app)/                 # Main app route group
      planner/             # Progression planner
      items/ recipes/      # Material browser & crafting
      echo-simulation/     # Echo roll simulator
      echo-leveling-strategy/
      discard-system/      # Sonata discard matrix
      union-level/
    map/                   # Interactive world map feature
  components/              # Shared UI + PlannerForm, items, characters
    ui/                    # shadcn/ui-style primitives
  context/ providers/      # State contexts & providers
  services/                # Dexie DB, localStorage, tile/PMTiles layer
  schemas/                 # Zod validation schemas
  constants/               # Game data tables (ascension, elements, sonatas…)
  types/                   # Domain TypeScript types
  utils/                   # Planner math, inventory, API parsing, search
  migrations/              # Versioned data migrations
  hooks/                   # Shared React hooks
  test/                    # Jest tests & mocks
scripts/                   # Dev scripts + prebuilt PMTiles tilesets
```

## Getting Started

### Prerequisites
- Node.js 18+ (or compatible with Next.js 15)
- A package manager — this project uses **pnpm** (npm/yarn also work)

### Install

```bash
pnpm install
# or: npm install / yarn install
```

### Environment

Copy the example env file and fill in values as needed:

```bash
cp .env.local.example .env.local
```

> The app is fully functional offline with local persistence. The auth/DB variables
> in `.env.local.example` are optional scaffolding for a future synced/account-backed
> backend and are not required to run the local tools.

### Run

```bash
pnpm dev        # start dev server (Turbopack) — http://localhost:3000
pnpm build      # production build
pnpm start      # serve the production build
pnpm lint       # run ESLint
pnpm test       # run Jest tests
```

## Data & Privacy

All planner, inventory, map marker, and discard-system data is stored **locally in your
browser** (IndexedDB / localStorage). There is no server-side account or sync by default,
so your data stays on your device. Use the in-app **Backup** component to export and
re-import your data (e.g. when switching browsers or devices). Data migrations run
automatically on load to keep older saves compatible.

## Contributing

1. Install dependencies and create a feature branch.
2. Run `pnpm lint` and `pnpm test` before committing.
3. Keep game-data tables in `src/constants/` and domain types in `src/types/`.

## License

See repository for license details.
