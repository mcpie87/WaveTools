#!/usr/bin/env python3
import os
import json
import subprocess
from pathlib import Path
import re
from concurrent.futures import ProcessPoolExecutor, as_completed

# comment for author or anyone working with NAS and WSL
# if working with NAS on WSL, mount it
# sudo mount -t drvfs Z: /mnt/z   

# CONFIG
INPUT_DIR = Path("/mnt/z/projects/WW_Asset/UIResources/UiWorldMap/Image")
OUTPUT_DIR = Path("./map_tiles")
CACHE_FILE = Path("./conversion_cache.json")
PATTERN = r"T_.*_-?[0-9]+_-?[0-9]+_"
QUALITY = 90
MAX_WORKERS = os.cpu_count() or 4  # use all cores

# Load or initialize cache
if CACHE_FILE.exists():
    with CACHE_FILE.open("r") as f:
        try:
            cache = json.load(f)
        except json.JSONDecodeError:
            print("Warning: cache file is corrupted. Starting fresh.")
            cache = {}
else:
    cache = {}

# Find all matching PNGs
png_files = [p for p in INPUT_DIR.rglob("*.png") if re.match(PATTERN, p.name)]
print(f"Number of files matching pattern: {len(png_files)}")

def file_size(path: Path) -> int:
    return path.stat().st_size if path.exists() else 0

def human_readable_size(num_bytes: int) -> str:
    for unit in ["B", "KB", "MB", "GB", "TB"]:
        if num_bytes < 1024:
            return f"{num_bytes:.2f} {unit}"
        num_bytes /= 1024
    return f"{num_bytes:.2f} PB"

def convert_file(file_path_str: str):
    """Convert PNG to WebP and return cache info + stats."""
    file_path = Path(file_path_str)
    relative_path = str(file_path.relative_to(INPUT_DIR))
    output_path = OUTPUT_DIR / file_path.relative_to(INPUT_DIR).parent / (file_path.stem + ".webp")
    output_path.parent.mkdir(parents=True, exist_ok=True)

    mtime = int(file_path.stat().st_mtime)
    cached_entry = cache.get(relative_path, {})
    cached_mtime = cached_entry.get("mtime", 0)
    cached_quality = cached_entry.get("quality", 0)

    if output_path.exists() and mtime == cached_mtime and QUALITY == cached_quality:
        status = "[SKIP]"
    else:
        subprocess.run([
            "cwebp", "-q", str(QUALITY),
            str(file_path), "-o", str(output_path), "-quiet"
        ], check=True)
        status = "[CONV]"

    input_size = file_size(file_path)
    output_size = file_size(output_path)
    percent_saved = int((input_size - output_size) * 100 / input_size) if input_size > 0 else 0

    return relative_path, {"mtime": mtime, "quality": QUALITY}, status, file_path, output_path, percent_saved, input_size, output_size

# Run conversions in parallel
total_percent_saved = 0
converted_count = 0
total_input_size = 0
total_output_size = 0

with ProcessPoolExecutor(max_workers=MAX_WORKERS) as executor:
    futures = [executor.submit(convert_file, str(f)) for f in png_files]
    for future in as_completed(futures):
        rel_path, cache_entry, status, file_path, output_path, percent_saved, input_size, output_size = future.result()
        cache[rel_path] = cache_entry
        total_percent_saved += percent_saved
        total_input_size += input_size
        total_output_size += output_size
        if status == "[CONV]":
            converted_count += 1
        print(f"{status}|[S: {percent_saved}%] {file_path} -> {output_path}")

# Save updated cache safely
CACHE_FILE.write_text(json.dumps(cache, indent=2))

# Summary
print("Conversion complete!")
print(f"Total files converted: {converted_count}")
if png_files:
    avg_percent_saved = total_percent_saved // len(png_files)
    print(f"Average space saved per file (all matching files): {avg_percent_saved}%")
    print(f"Total size before: {human_readable_size(total_input_size)}")
    print(f"Total size after : {human_readable_size(total_output_size)}")
    print(f"Overall saved    : {human_readable_size(total_input_size - total_output_size)}")
else:
    print("No files matched the pattern.")