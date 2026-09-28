# AGENTS.md

Notes for coding agents working on WaveTools. `README.md` covers features, the
stack and the directory layout; this file covers what is not obvious from it:
the data pipelines, the per-patch release chores and known pitfalls.

## Commands

- `npx tsc --noEmit -p .`: typecheck (`next lint` does not typecheck).
- `npx next lint`: lint.
- `npx jest --coverage=false`: tests (4 suites; coverage is on by default in
  `jest.config.ts`).
- `pnpm dev`: dev server on :3000. CI (`.github/workflows/nextjs.yml`) uses
  **npm** with `package-lock.json` and deploys a static export to GitHub Pages
  under `/WaveTools` (`next.config.ts`: `output: 'export'` in production).

## Related repositories (siblings of this repo)

| Repo | Role |
| --- | --- |
| `WutheringWaves_Data` (github.com/Arikatsu/WutheringWaves_Data) | Game datamine: `BinData/**.json` configs and `Textmaps/en/multi_text/MultiText.json`. Input for the Ruby extractors. Uses **Git LFS** for large files (e.g. `BinData/level_entity/levelentityconfig.json`, 148 MB). |
| `WW_Asset_Webp` (alt3ri/WW_Asset_Webp) | Game UI assets as webp. Map tiles live in `UIResources/UiWorldMap/Image/<Layer>/`. `ASSET_URL` in `src/constants/constants.ts` points to it on GitHub for icons. |
| `wuwa-map-tiles` (github.com/mcpie87/wuwa-map-tiles) | Deployed tiles: `<Layer>/*.webp` plus `pmtiles/*.pmtiles` and `pmtiles/manifest.json`. The app reads it via raw.githubusercontent (`MAP_TILES_URL` in `src/app/map/mapUtils.ts`). |

Paths are hardcoded for the original author's machines, so override them:
- `DATAMINE_PATH` env var (read in `scripts/datamine_extractor/utils.rb`),
  default `~/projects/wuwa/WutheringWaves_Data`.
- `WW_ASSET_WEBP` env var (read in `scripts/compress_tiles.py`), default
  `/mnt/z/projects/WW_Asset_Webp` (the author's NAS path under WSL).

Tools that may not be installed: `git-lfs`, `cwebp`, `pmtiles`. On NixOS use
`nix shell nixpkgs#git-lfs`, `nixpkgs#libwebp` and `nixpkgs#pmtiles`. Ruby
gems needed: `awesome_print` and `byebug`.

LFS in `WutheringWaves_Data`: if a JSON starts with
`version https://git-lfs.github.com/spec/v1`, it is a pointer, not the real
file. The SSH remote may fail non-interactively (no askpass); the repo is
public, so run `git -c lfs.url=https://github.com/Arikatsu/WutheringWaves_Data.git/info/lfs lfs pull`,
then `git lfs install --local && git lfs checkout`.

## Data pipeline (game data -> `public/data`)

`cd scripts/datamine_extractor && python3 update_jsons.py`

- Runs the Ruby extractors listed in `extractor_files`. Each writes `out/<name>.json`
  through `save_json` in `utils.rb`. Every file listed in `output_files` is then
  minified to `<name>_minified.json`, and both are moved to `public/data/`.
- A failing extractor only prints its stderr; the script still exits 0. Read
  the output.
- Extractors not in the list (`extract_map_types.rb`, `extract_mobs.rb`,
  `extract_drop_packages.rb`, `extract_bp_levels.rb`, ...) are one-off research
  tools. `extract_map_types.rb` lists entity BlueprintTypes with their
  in-game names, which is useful when categorizing new map entities.
- Text lookups use `get_textmap_name`, which returns `"NO CONTENT"` (=
  `NO_DATA_STRING`) for missing translations. Some real item names are
  literally "An error happened. Please contact Customer Service"; that is
  game data, not an error.
- Sanity check after a run: entry counts per file should grow or stay the
  same compared with `git show HEAD:public/data/<file>`.

What the app reads (everything else in `public/data` is unused or stale):

| File | Consumer |
| --- | --- |
| `items_minified.json`, `weapons_minified.json` | `src/providers/DataProvider.tsx`, items page |
| `resonators_minified.json` | `DataProvider.tsx` (see Known issues) |
| `cooking.json`, `cookprocessed.json`, `synthesis.json`, `buyable_items.json` | `src/app/(app)/recipes/page.tsx` |
| `map_marks_minified.json`, `quest_types_minified.json`, `levelplaydata_minified.json`, `blueprint_rewards_minified.json` | `src/app/map/data/map_marks.ts` (top-level await) |
| `blueprints_minified.json` | `src/app/map/BlueprintTranslationService.ts` |
| `map_tiles.json` | `useMapData.ts`: sub-area overlay layers (from `extract_layers.rb`, built on `BinData/map/multimap.json`) |
| `levelentityconfig.json` | `useMapData.ts`, **dev only** (git-ignored, copy it from `WutheringWaves_Data/BinData/level_entity/`) |
| `migration_mapping_3.1.json` | migration `2026-04-16T1538-updated-backed-up-markers` |

## Map entities

- Markers are rows of `levelentityconfig.json` (the game's entity list, about
  215k rows). Production downloads it from UploadThing (`*.ufs.sh`) via
  `LEVEL_ENTITY_CONFIG_URL[GAME_VERSION]` in `src/constants/constants.ts` and
  caches it in the browser (`levelentityconfig-cache`, keyed by URL).
- Categorization: `src/app/map/TranslationMaps/*.ts` map entity
  `BlueprintType` strings (e.g. `"Gameplay021"`, `"branch3.0_41_Gameplay_3_0/Common1"`)
  to categories; aggregated in `translationMap.ts`. Icons are in
  `worldmapIconMap.ts` (paths relative to `ASSET_URL`). Item enums are in
  `src/app/interfaces/item_types.ts`.
- New-patch entity work (see the 3.5 commits, e.g. `abd349d`, `0a29a7d`,
  `d8c9546`) is: add BlueprintTypes to the right TranslationMap, add an icon,
  and add an enum entry if it's a new item. Icon filenames in the game
  sometimes change between patches (`3ef5ae0`, `562fdca`).
- Game coordinates -> map: `translateGameToMapX/Y` in `mapUtils.ts`
  (`scaleFactor = 0.30118`, `TILE_SIZE = 256`). One coordinate space is shared
  by all maps; the `mapId` selects which entities are shown.

## Map regions and tiles

- Regions are configured in `mapUtils.ts`: `MapName` enum plus `mapConfigs`
  (world regions with their own tiles), and `mainStoryDungeonMapConfigs`,
  `storyDungeonMapConfigs`, `sonoroDungeonMapConfigs`, `testDungeonMapConfigs`
  (a `mapId` only). The order of `mapConfigs` keys is the dropdown order.
- Region name: `BinData/map/akimap.json` row with the `MapId` -> `MapName`
  textmap key (e.g. 912 -> `Area_46_Title` -> "Simulacrum Nexus of Mengzhou").
  Sub-areas: `BinData/area/area.json` rows with `MapConfigId`.
- `bounds` is `[[minLat, maxLat], [minLng, maxLng]]` in tile units. Game tile `T_<L>_x_y` covers lat `[y-1, y]` and lng
  `[x, x+1]`, so exact bounds are `[[minY-1, maxY], [minX, maxX+1]]`. Existing
  entries are often hand-padded.
- Tile URL `.../<Dir>/T_<Layer>_{x}_{y}_UI.webp` only names the layer.
  `src/services/tiles/urlUtils.ts` turns it into `pmtiles/<Layer>_UI.pmtiles`,
  so the PMTiles file must exist in `wuwa-map-tiles`.
- In dev, `DEV_CONFIG.map.layer.forceLocalPMTiles` (`src/config/dev.ts`) makes
  `MAP_TILES_URL` point at `public/data`, so the map needs
  `public/data/pmtiles/` (a copy of `wuwa-map-tiles/pmtiles`, `*.pmtiles` is
  git-ignored). Without `manifest.json` there the map fails to load.
- Browser tile caching is keyed by the manifest layer hash
  (`services/tiles/sourceCache.ts`, IndexedDB), so rebuilt layers invalidate
  themselves.
- `public/sw.js` caches `.png`/`.webp` images from GitHub (icons) for 30 days.
  It is registered as `sw.js?v=<GAME_VERSION>` in `useMapLogic.ts`, and
  bumping `GAME_VERSION` drops the old cache. `map_tiles.json` is cached per
  `GAME_VERSION` in `useMapData.ts`.

### Updating tiles for a new patch

Run from `scripts/` (outputs `map_tiles/`, `pmtiles_output/`, `temp_tiles/`
and `conversion_cache.json` are git-ignored):

1. `WW_ASSET_WEBP=... python3 compress_tiles.py`: re-encodes every tile
   (`T_*_x_y_*.webp`) to webp q80 into `scripts/map_tiles/`.
2. Copy into `wuwa-map-tiles` **only the tiles whose source changed**. Find
   them with `git diff --name-status <old> <new> -- UIResources/UiWorldMap/Image`
   in `WW_Asset_Webp`. Re-encoding with a different libwebp gives byte diffs on
   every unchanged tile; the author's commits only touch real changes (3.6:
   182 files).
3. `generate_pmtiles.py` reads `map_tiles/` and writes `pmtiles_output/` from
   the current directory. Run it with `map_tiles` -> the `wuwa-map-tiles`
   checkout and `pmtiles_output` -> `wuwa-map-tiles/pmtiles` (symlinks in a
   scratch dir work). Then the layer hashes match the committed `manifest.json`
   and only changed layers are rebuilt.
4. Check that `offset_x`/`offset_y` in the manifest did not change. The global
   offset comes from the minimum tile coordinates over all layers; if it
   changes, **every** layer must be rebuilt, but the hash cache won't notice.
5. `TILE_VERSION_EXCEPTIONS` in `generate_pmtiles.py` pins older tile
   versions (`T_X_x_y_<version>_...`) where the game shows old tiles until a
   quest is done.
6. Commit to `wuwa-map-tiles` as `update: <version> map tiles`.

## Per-patch release checklist

1. Pull `WutheringWaves_Data` (and its LFS files), run `update_jsons.py`, and
   commit `public/data` as `update: <version> data files update`.
2. Upload the new `levelentityconfig.json` to UploadThing and add
   `LEVEL_ENTITY_CONFIG_URL["<version>"]`. Then bump `GAME_VERSION` (shown in
   the header, stored in backups). `tsc` fails if `GAME_VERSION` has no
   URL entry, which is intended.
3. Update the tiles (above), add new regions/dungeons to `mapUtils.ts`.
4. Add new entity BlueprintTypes and icons to the TranslationMaps.

Commit style: `feat: ...`, `fix: ...`, `update: <version>`, `datamine: ...`.

## Persistence and migrations

- User data lives in Dexie (`src/services/db/AppDatabase.ts`) and localStorage
  (`LocalStorageService`). Map "visited" state is keyed by
  `getMarkerRealId` = `e_<MapId>_<EntityId>`.
- Migrations: add a file `src/migrations/migrations/<YYYY-MM-DDTHHMM>-<slug>.ts`
  and register it in `src/migrations/migrations.ts`. `runMigrations.ts` runs
  every migration newer than the version stored in localStorage `version`.
- If the game renumbers entities, generate a mapping with
  `scripts/generate_migration_mapping.ts` / `compare_level_entity_configs.py`
  (as for 3.1) and add a migration.

## Other scripts

`scripts/extract_map.py` (old tile download and stitch), `kuro-chests.py`
(Kuro API chest data), `cube-derby.ts`, `ev_tuner.ts`, `tuner-sim.js`
(one-off simulations) and `minify_levelentityconfig.py` are not part of any
pipeline.

## Known issues

- `DataProvider.tsx` loads `resonators_minified.json`, last updated in 2.5
  (40 resonators). The extractor writes `resonator_minified.json` (64
  resonators, current). The planner does not see resonators added after 2.5.
  Intentional for now: the planner needs rework for 3.0 data changes before
  it can switch to the new file. Don't just repoint it.
- `public/data/blueprint_minified.json` is an orphan; the app reads
  `blueprints_minified.json`.
- `wuwa-map-tiles/AYMapTiles/` has no source counterpart in `WW_Asset_Webp`.
