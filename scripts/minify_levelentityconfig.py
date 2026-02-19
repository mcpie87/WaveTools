#!/usr/bin/env python3
import json
from pathlib import Path

INPUT = Path("../public/data/levelentityconfig.json")
OUTPUT = Path("out/entities_index.json")

def extract(entity: dict) -> dict:
    transform = entity.get("Transform", [])
    pos = transform[0] if transform else {}

    return {
        "Id": entity["Id"],
        "EntityId": entity["EntityId"],
        "MapId": entity["MapId"],
        "AreaId": entity["AreaId"],
        "BlueprintType": entity["BlueprintType"],
        "X": pos.get("X", 0),
        "Y": pos.get("Y", 0),
        "Z": pos.get("Z", 0),
    }

def main():
    print("Loading...")
    entities = json.loads(INPUT.read_bytes())
    print(f"Loaded {len(entities)} entities")

    index = [extract(e) for e in entities]

    content = json.dumps(index, separators=(',', ':')).encode()
    OUTPUT.write_bytes(content)

    original_size = INPUT.stat().st_size
    new_size = OUTPUT.stat().st_size
    print(f"Done: {original_size / 1_000_000:.1f}MB → {new_size / 1_000_000:.1f}MB ({100 * new_size / original_size:.1f}%)")

if __name__ == "__main__":
    main()