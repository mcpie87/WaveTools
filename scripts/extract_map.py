import requests
import os
from concurrent.futures import ThreadPoolExecutor
from PIL import Image

link_prefix = "https://raw.githubusercontent.com/alt3ri/WW_Asset/refs/heads/Global/UIResources/UiWorldMap/Image/MapTiles"

output = "maps"
if not os.path.exists(output):
    os.makedirs(output)

tile_range_x = range(-2, 18)  # Left to right
tile_range_y = range(2, -14, -1)  # Bottom to top


def download_tile(i, j):
    basefile = f"tile_{i}_{j}_UI.png"
    url = f"{link_prefix}/T_MapTiles_{i}_{j}_UI.png";

    # print(f"Downloading {url}")
    try:
        r = requests.get(url)
        if r.status_code == 200:
            with open(f"{output}/{basefile}", "wb") as f:
                f.write(r.content)
            # print(f"Wrote {basefile}")
        else:
            print(f"Failed to download {basefile}: {r.status_code}")
    except requests.RequestException as e:
        print(f"Error downloading {basefile}: {e}")

with ThreadPoolExecutor(max_workers=10) as executor:
    futures = [executor.submit(download_tile, i, j) for i in tile_range_x for j in tile_range_y]

for future in futures:
    future.result()

print("Done")

# Map is downloaded, time to stitch it together
# Tile grid size

tile_size = (1024, 1024)  # Assuming each tile is 256x256 pixels
output_dir = "maps"

# Canvas dimensions
canvas_width = len(tile_range_x) * tile_size[0]
canvas_height = len(tile_range_y) * tile_size[1]

# Create a blank transparent canvas
canvas = Image.new("RGBA", (canvas_width, canvas_height), (0, 0, 0, 0))

# Loop through all tile positions
for i, x in enumerate(tile_range_x):  # Left to right
    for j, y in enumerate(tile_range_y):  # Bottom to top
        tile_path = f"{output_dir}/tile_{x}_{y}_UI.png"
        # print(tile_path)
        if os.path.exists(tile_path):
            tile = Image.open(tile_path)
        else:
            tile = Image.new("RGBA", tile_size, (0, 0, 0, 0))  # Transparent tile
        
        # Calculate position on the canvas
        pos_x = i * tile_size[0]
        pos_y = j * tile_size[1]
        # print("Grabbing tile", x, y, pos_x, pos_y)
        canvas.paste(tile, (pos_x, pos_y))

# Save the final stitched image
canvas.save("stitched_map.png")