# WaveTools

A companion site for Wuthering Waves: an interactive world map for tracking
collectibles and a resource planner. This glossary covers the map.

## Game data

**Entity**:
One row of the game's level entity config: a thing placed in the world, identified by its map and entity id.
_Avoid_: object, row, spawn

**BlueprintType**:
The game's internal type string of an entity (e.g. `Treasure001`), many of which can share one category.
_Avoid_: blueprint key, entity type, dictKey

**Quest**:
A game quest attached to an entity, including its parent and child quests and unlock conditions.

**LevelPlay**:
A game-side activity (puzzle, challenge, exploration step) attached to an entity, separate from quests.
_Avoid_: level play data, LP

**Map mark**:
A marker the game itself places on its in-game map for an entity.

**Game version**:
The patch the site's data comes from (e.g. `3.7`); bumping it invalidates cached data.
_Avoid_: patch number, data version

## Map

**Marker**:
An entity as shown on the site's map, with its categories, quests and levelplays resolved.
_Avoid_: pin, point, mark

**Region**:
A selectable area with its own tiles or its own map id: a world region, or a story, sonoro or test dungeon.
_Avoid_: map (when a region is meant), zone

**Map scope**:
The selected region, or a predefined group of regions such as "all world maps" or "dungeons only".
_Avoid_: selected map, custom map

**Area layer**:
A sub-area overlay whose tiles replace the base tiles of a region.

## Categories and progress

**Category**:
A player-facing kind of marker (e.g. "Basic Supply Chest") that groups one or more BlueprintTypes, or is defined by a query over markers.
_Avoid_: translation, translation map entry

**Category group**:
A top-level heading of categories in the settings pane (e.g. Chests, Puzzles, Quests).
_Avoid_: section, displayed category

**Query category**:
A category whose membership is decided by a predicate over the marker (e.g. "has a main quest") rather than by BlueprintType.
_Avoid_: virtual category, computed category

**Tracking key**:
The stable identifier of a category under which a player's progress is saved; it never changes once released.
_Avoid_: category key, id

**Visited**:
A player's mark that they have collected or done a marker for one specific category; one marker can be visited for some categories and not others.
_Avoid_: checked, done, completed

**Visibility**:
Which categories the player has chosen to show on the map.
_Avoid_: filter (reserved for map scope and quest filter)

**Preset**:
A named, saved visibility configuration the player can load.
_Avoid_: profile, saved filter

**Quest filter**:
The player's choice of whether markers tied to quests and levelplays are shown, hidden, or shown exclusively.
