import json
import subprocess
import os
import shutil

extractor_files = [
    "extract_recipes.rb",
    
    "extract_items.rb",
    "extract_sonata_sets.rb",
    "extract_resonator.rb",
    "extract_weapons.rb",

    "extract_layers.rb",
    "extract_map_marks.rb",
    "extract_quest_stuff.rb",
]

output_files = [
    "buyable_items.json",
    "cooking.json",
    "cookprocessed.json",
    "items.json",
    "map_marks.json",
    "map_tiles.json",
    "quest_types.json",
    "resonator.json",
    "shops.json",
    "sonatas.json",
    "synthesis.json",
    "weapons.json",
]

for file in extractor_files:
    if os.path.exists(file):
        try:
            print(f"Running {file}")
            result = subprocess.run(["ruby", file], check = True, text=True, capture_output=True)
            print(f"Output for {file}:\n{result.stdout}")
        except subprocess.CalledProcessError as e:
            print(f"Error executing {file}: {e.stderr}")
    else:
        print(f"File {file} not found.")

target_dir = "../../public/data"
for file_name in output_files:
    source_dir = "./out"
    if not os.path.exists(f"{source_dir}/{file_name}"):
        continue

    min_file_name = file_name.replace(".json", "_minified.json")

    # Minify JSON
    with open(f"{source_dir}/{file_name}", 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    with open(f"{source_dir}/{min_file_name}", 'w', encoding='utf-8') as f:
        # separators=(',', ':') removes all whitespace
        json.dump(data, f, separators=(',', ':'))

    # Move both to target
    print(f"Moving {file_name} to {target_dir}")
    shutil.move(f"{source_dir}/{file_name}", os.path.join(target_dir, file_name))
    print(f"Moving {min_file_name} to {target_dir}")
    shutil.move(f"{source_dir}/{min_file_name}", os.path.join(target_dir, min_file_name))