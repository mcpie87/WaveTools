import json
import ijson

OLD_JSON = "../public/data/3.0.json"
NEW_JSON = "../public/data/3.1.json"

# Load the files
def get_entity_mapping(filepath):
    mapping = {}
    with open(filepath, 'rb') as f: # ijson prefers binary mode
        # 'item' assumes the JSON is a list of objects [{...}, {...}]
        # Change 'item' to 'item.item' if it's a nested list
        parser = ijson.items(f, 'item')
        for obj in parser:
            # Only store the two fields you need
            mapping[obj['Id']] = obj['EntityId']
    return mapping

print("Loading old data...")
old_data = get_entity_mapping(OLD_JSON)

print("Loading new data...")
new_data = get_entity_mapping(NEW_JSON)
# 1. Find Removed IDs
removed = set(old_data.keys()) - set(new_data.keys())

# 2. Find Added IDs
added = set(new_data.keys()) - set(old_data.keys())

# 3. Find Changed entityIds
changed = {
    id: {'old': old_data[id], 'new': new_data[id]}
    for id in old_data.keys() & new_data.keys()
    if old_data[id] != new_data[id]
}

print(f"Removed: {len(removed)} | Added: {len(added)} | Changed: {len(changed)}")

output_file = "diff_report.txt"

with open(output_file, "w") as f:
    f.write(f"--- SUMMARY ---\n")
    f.write(f"Removed: {len(removed)} | Added: {len(added)} | Changed: {len(changed)}\n\n")

    if changed:
        f.write(f"--- DETAILED CHANGES (ID: Old -> New) ---\n")
        # Sorting by ID makes it much easier to navigate in 'less'
        for entity_id in sorted(changed.keys()):
            old_val = changed[entity_id]['old']
            new_val = changed[entity_id]['new']
            f.write(f"ID {entity_id}: {old_val} -> {new_val}\n")

print(f"Report generated: {output_file}")