#!/usr/bin/env python3
import os
import re
import hashlib
import shutil
import json
import subprocess
import sqlite3
from pathlib import Path
from collections import defaultdict
from pprint import pprint

# Configuration
TILES_DIR = Path("map_tiles")
OUTPUT_DIR = Path("pmtiles_output")
TEMP_DIR = Path("temp_tiles")
MANIFEST_FILE = OUTPUT_DIR / "manifest.json"

# Patterns matching your get_all_layers logic
PATTERN_NORMAL = r'T_(.+?)_(-?\d+)_(-?\d+)(?:_(\d+))?_(.+?)\.webp$'
PATTERN_FOG = r'T_FogTiles_(.+?)_(-?\d+)_(-?\d+)(?:_(\d+))?_(.+?)\.webp$'

# ── Hashing ──────────────────────────────────────────────────────────────────

def hash_file(path: Path) -> str:
    h = hashlib.sha256()
    h.update(path.read_bytes())
    return h.hexdigest()[:16]

def hash_layer(tiles_dict: dict) -> str:
    """SHA-256 over the sorted source file contents of a layer."""
    h = hashlib.sha256()
    for path in sorted(info['path'] for info in tiles_dict.values()):
        h.update(path.name.encode())          # include filename for renames
        h.update(path.read_bytes())
    return h.hexdigest()[:16]                 # 16 chars is plenty

def is_valid_pmtiles(path: Path) -> bool:
    """Check PMTiles magic bytes and minimum viable size."""
    try:
        if path.stat().st_size < 127:  # PMTiles header is 127 bytes
            return False
        with open(path, 'rb') as f:
            magic = f.read(7)
        return magic == b'PMTiles'
    except OSError:
        return False

def is_output_intact(name: str, manifest: dict) -> bool:
    path = OUTPUT_DIR / f"{name}.pmtiles"
    if not path.exists():
        return False
    if not is_valid_pmtiles(path):
        return False
    expected = manifest.get("layers", {}).get(name, {}).get("output_hash")
    if not expected:
        return True  # no stored hash yet, trust it for now
    return hash_file(path) == expected

# ── Manifest ─────────────────────────────────────────────────────────────────

def load_manifest() -> dict:
    if MANIFEST_FILE.exists():
        return json.loads(MANIFEST_FILE.read_text())
    return {"layers": {}}


def save_manifest(manifest: dict) -> None:
    MANIFEST_FILE.write_text(json.dumps(manifest, indent=2))

def create_compliant_mbtiles(mbtiles_path, layer_name, tiles_dict, offset_x, offset_y):
    if mbtiles_path.exists(): mbtiles_path.unlink()
    conn = sqlite3.connect(mbtiles_path)
    cur = conn.cursor()

    # Define schema
    cur.execute("CREATE TABLE metadata (name text, value text);")
    cur.execute("CREATE TABLE tiles (zoom_level integer, tile_column integer, tile_row integer, tile_data blob);")
    
    # SAFE_ZOOM 14 allows X/Y coordinates up to 16,384.
    SAFE_ZOOM = 14 
    max_tile = (1 << SAFE_ZOOM)  # 16384


    # Inject metadata so PMTiles CLI doesn't complain about 'format'
    metadata = [
        ("name", layer_name),
        ("format", "webp"),
        ("type", "overlay"),
        ("version", "1"),
        ("json", '{"vector_layers": []}')
    ]
    cur.executemany("INSERT INTO metadata VALUES (?, ?)", metadata)

    for coord, info in tiles_dict.items():
        with open(info['path'], 'rb') as f:
            blob = f.read()
        
        # Ensure coordinates are positive and at a valid zoom depth
        # tx = info['x'] + offset_x
        # ty = info['y'] + offset_y # Make sure your global offset makes this > 0

        ty = max_tile - 1 - (info['y'] + offset_y)  # TMS flip
        tx = info['x'] + offset_x

        cur.execute(
            "INSERT INTO tiles VALUES (?, ?, ?, ?)",
            (SAFE_ZOOM, tx, ty, blob)
        )

    conn.commit()
    conn.close()

def parse_tile_details(file_path):
    """
    Extracts layer name, x, y, and version from a file path.
    Returns: (layer_name, x, y, version) or None
    """
    filename = file_path.name
    is_fog = "T_FogTiles_" in filename
    pattern = PATTERN_FOG if is_fog else PATTERN_NORMAL
    
    match = re.search(pattern, filename)
    if match:
        layer1, x, y, version, layer2 = match.groups()
        
        # Construct the layer name exactly like your get_all_layers function
        layer_name = f"FogTiles_{layer1}_{layer2}" if is_fog else f"{layer1}_{layer2}"
        
        return {
            'layer': layer_name,
            'x': int(x),
            'y': int(y),
            'version': int(version) if version else 0,
            'path': file_path
        }
    return None

def get_latest_tiles_by_layer():
    """
    Scans the directory and groups the latest version of every tile by layer.
    """
    # Structure: layer_name -> (x, y) -> latest_tile_info
    layers_data = defaultdict(lambda: defaultdict(lambda: {'version': -1}))
    
    root = Path(TILES_DIR)
    for file in root.rglob('*.webp'):
        details = parse_tile_details(file)
        if not details:
            continue
            
        layer = details['layer']
        coord = (details['x'], details['y'])
        
        # Keep the highest version
        if details['version'] > layers_data[layer][coord]['version']:
            layers_data[layer][coord] = details
            
    return layers_data

def find_bounds_for_layer(tiles_dict):
    """Find min/max x and y coordinates from a layer's tiles."""
    x_coords = [info['x'] for info in tiles_dict.values()]
    y_coords = [info['y'] for info in tiles_dict.values()]
    
    return {
        'min_x': min(x_coords),
        'max_x': max(x_coords),
        'min_y': min(y_coords),
        'max_y': max(y_coords)
    }

def calculate_global_offset(all_bounds):
    """Calculate a single offset that works for all layers."""
    global_min_x = min(b['min_x'] for b in all_bounds.values())
    global_min_y = min(b['min_y'] for b in all_bounds.values())
    
    # Offset to make all coordinates positive
    offset_x = abs(global_min_x) if global_min_x < 0 else 0
    offset_y = abs(global_min_y) if global_min_y < 0 else 0
    
    return offset_x, offset_y

def create_mbtiles_from_dict(mbtiles_path, layer_name, tiles_dict, offset_x, offset_y):
    """Manually builds a valid MBTiles file that the PMTiles CLI will love."""
    if mbtiles_path.exists():
        mbtiles_path.unlink()

    conn = sqlite3.connect(mbtiles_path)
    cur = conn.cursor()

    # 1. Create standard MBTiles schema
    cur.execute("CREATE TABLE metadata (name text, value text);")
    cur.execute("CREATE TABLE tiles (zoom_level integer, tile_column integer, tile_row integer, tile_data blob);")
    cur.execute("CREATE UNIQUE INDEX tile_index on tiles (zoom_level, tile_column, tile_row);")

    # 2. Required Metadata (Crucial for PMTiles CLI)
    # Note: MBTiles uses TMS (flipped Y), but pmtiles convert handles the flip 
    # if we provide the right metadata.
    metadata = [
        ("name", layer_name),
        ("format", "webp"),
        ("version", "1"),
        ("type", "overlay"),
        ("description", "Wuthering Waves Map Layer"),
        ("json", '{"vector_layers": []}')
    ]
    cur.executemany("INSERT INTO metadata VALUES (?, ?)", metadata)

    # 3. Insert Tiles
    # IMPORTANT: PMTiles convert expects standard XYZ. 
    # If your source is XYZ, we keep it as is.
    for coord, info in tiles_dict.items():
        with open(info['path'], 'rb') as f:
            tile_bytes = f.read()
        
        # We use Z=0 because logic puts everything in /0/x/y
        # shifted_x and shifted_y are your simple CRS coordinates
        cur.execute(
            "INSERT INTO tiles (zoom_level, tile_column, tile_row, tile_data) VALUES (?, ?, ?, ?)",
            (0, info['x'] + offset_x, info['y'] + offset_y, tile_bytes)
        )

    conn.commit()
    conn.close()

def convert_layer_to_pmtiles(layer_name, tiles_dict, offset_x, offset_y):
    """Convert a single layer to PMTiles format."""
    print(f"\nProcessing layer: {layer_name}")
    
    # Create temp directory structure: temp_tiles/<layer>/0/ (Z=0)
    temp_layer_root = TEMP_DIR / layer_name
    temp_z_dir = temp_layer_root / "0"
    
    if temp_layer_root.exists():
        shutil.rmtree(temp_layer_root)
    temp_z_dir.mkdir(parents=True)
    
    for coord, info in tiles_dict.items():
        shifted_x = info['x'] + offset_x
        shifted_y = info['y'] + offset_y
        
        x_dir = temp_z_dir / str(shifted_x)
        x_dir.mkdir(exist_ok=True)
        
        dest = x_dir / f"{shifted_y}.webp"
        shutil.copy2(info['path'], dest)

    output_file = OUTPUT_DIR / f"{layer_name}.pmtiles"
    mbtiles_file = OUTPUT_DIR / f"{layer_name}.mbtiles"
    OUTPUT_DIR.mkdir(exist_ok=True)

    # Folder -> MBTiles
    create_mbtiles_from_dict(mbtiles_file, layer_name, tiles_dict, offset_x, offset_y)
    # MBTiles -> PMTiles
    cmd2 = ["pmtiles", "convert", str(mbtiles_file), str(output_file)]

    # 2. THE CRITICAL STEP: Inject Metadata
    # This prevents "Error: mbtiles is missing zoom_level" or projection errors
    create_compliant_mbtiles(mbtiles_file, layer_name, tiles_dict, offset_x, offset_y)
    
    try:
        subprocess.run(cmd2, check=True, capture_output=True)
        if mbtiles_file.exists():
            os.remove(mbtiles_file) # Cleanup intermediate mbtiles
        print(f"  ✓ Created {output_file.name}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"  ERROR pmtiles processing {layer_name}: {e.stderr.decode()}")
        return False



def main():
    OUTPUT_DIR.mkdir(exist_ok=True)
    
    print("=== Scanning Tiles and Versioning ===")
    all_layers_data = get_latest_tiles_by_layer()
    
    if not all_layers_data:
        print("No valid tiles found!")
        return
    

    all_bounds = {name: find_bounds_for_layer(tiles) for name, tiles in all_layers_data.items()}    
    offset_x, offset_y = calculate_global_offset(all_bounds)
    print(f"Global Offset: X={offset_x}, Y={offset_y}")

    manifest = load_manifest()
    cached_hashes = {name: entry["hash"] for name, entry in manifest.get("layers", {}).items()}

    # Compute hashes for all layers and find what changed
    current_hashes = {name: hash_layer(tiles) for name, tiles in all_layers_data.items()}
    changed = [
        name for name, h in current_hashes.items()
        if cached_hashes.get(name) != h
        or not is_output_intact(name, manifest)
    ]
    unchanged = [name for name in all_layers_data if name not in changed]

    print(f"\n=== {len(changed)} changed, {len(unchanged)} unchanged ===")
    if not changed:
        print("Nothing to do.")
        return

    for name in changed:
        print(f"  ~ {name}  ({cached_hashes.get(name, 'new')[:8]} → {current_hashes[name][:8]})")

    print("\n=== Converting ===")
    success_count = 0
    updated_layers = dict(manifest.get("layers", {}))  # preserve unchanged entries

    for layer_name in changed:
        tiles_dict = all_layers_data[layer_name]
        if convert_layer_to_pmtiles(layer_name, tiles_dict, offset_x, offset_y):
            updated_layers[layer_name] = {
                "hash": current_hashes[layer_name],
                "output_hash": hash_file(OUTPUT_DIR / f"{layer_name}.pmtiles"),
            }
            success_count += 1
        # on failure: leave old manifest entry intact so CDN still serves the last good file

    if TEMP_DIR.exists():
        shutil.rmtree(TEMP_DIR)

    # Write manifest — only if at least one layer succeeded
    if success_count:
        manifest["layers"] = updated_layers
        manifest["offset_x"] = offset_x
        manifest["offset_y"] = offset_y
        save_manifest(manifest)
        print(f"\n✓ manifest.json updated ({success_count}/{len(changed)} layers)")
    else:
        print("\n✗ No layers succeeded, manifest left unchanged.")

    print(f"\n=== Done: {success_count}/{len(changed)} converted ===")

if __name__ == "__main__":
    main()