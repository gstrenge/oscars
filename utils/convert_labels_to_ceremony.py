"""
Converts labels.json face labels into a full ceremony JSON file
used by src/index.jsx.

Combines multiple input sources:
  - inputs/labels.json: face labels from the labeling tool
  - inputs/characters.json: character/movie/director metadata
  - inputs/predictions.json: output from convert_predictions.py (optional)
  - inputs/awards.json: ceremony awards with winners (optional)

Output: outputs/ceremony.json with attendees, movies, predictions, and awards.

Usage:
    python utils/convert_labels_to_ceremony.py utils/data/2026
"""

import argparse
import json
import os
import re
from collections import defaultdict

# Infer year from filename timestamps (e.g. 20260315 -> 2026)
def infer_year(labels: dict) -> int:
    for key in labels:
        base = os.path.splitext(os.path.basename(key))[0]  # e.g. 20260315_181415_Garrit_Strenge
        if len(base) >= 8 and base[:8].isdigit():
            return int(base[:4])
    return 2026

def name_to_slug(name: str) -> str:
    return re.sub(r"[^a-z0-9]+", "-", name.lower()).strip("-")

def label_key_to_webp_path(key: str) -> str:
    """
    'timestamp_Garrit_Strenge/20260315_181415_Garrit_Strenge.JPG'
    -> '20260315_181415_Garrit_Strenge.webp'
    (subfolder stripped — files are flat in public/imgs/)
    """
    base = os.path.splitext(os.path.basename(key))[0]  # strip folder and .JPG
    return f"{base}.webp"

def main():
    parser = argparse.ArgumentParser(description="Convert face labels to ceremony JSON.")
    parser.add_argument(
        "year_dir",
        help="Path to the year directory (e.g. utils/data/2026)",
    )
    args = parser.parse_args()

    year_dir = args.year_dir.rstrip("/\\")
    inputs_dir = os.path.join(year_dir, "inputs")
    outputs_dir = os.path.join(year_dir, "outputs")

    labels_file = os.path.join(inputs_dir, "labels.json")
    characters_file = os.path.join(inputs_dir, "characters.json")
    predictions_file = os.path.join(inputs_dir, "predictions.json")
    awards_file = os.path.join(inputs_dir, "awards.json")
    output_file = os.path.join(outputs_dir, "ceremony.json")

    with open(labels_file, encoding="utf-8") as f:
        data = json.load(f)

    people: list[str] = data["people"]
    labels: dict[str, list[str]] = data["labels"]

    year = infer_year(labels)

    # Load character/movie metadata if available
    char_meta: dict[str, dict] = {}  # name -> {character, movie, director}
    movie_directors: dict[str, str] = {}  # movie title -> director
    if os.path.exists(characters_file):
        with open(characters_file, encoding="utf-8") as f:
            chars_data = json.load(f)
        for entry in chars_data["characters"]:
            char_meta[entry["name"]] = {"character": entry["character"], "movie": entry["movie"]}
            movie_directors[entry["movie"]] = entry.get("director", "TBD")
        print(f"Loaded character metadata from {characters_file}")

    # Merge people lists: labels.json people + anyone only in characters file
    all_people = list(people)
    labeled_set = set(people)
    for entry in char_meta:
        if entry not in labeled_set:
            all_people.append(entry)
            print(f"  + Added {entry!r} from characters file (not in labels.json)")

    # Build person -> [image_path, ...] mapping (preserves label order)
    person_images: dict[str, list[str]] = defaultdict(list)
    for key, names in labels.items():
        webp_path = label_key_to_webp_path(key)
        for name in names:
            person_images[name].append(webp_path)

    attendees = []
    for name in all_people:
        slug = name_to_slug(name)
        images = person_images.get(name, [])
        meta = char_meta.get(name, {})
        attendees.append({
            "name": name,
            "slug": slug,
            "character": meta.get("character", ""),
            "movie": meta.get("movie", ""),
            "images": images,
        })

    # Build unique movies list, preserving first-seen order
    seen_movies: set[str] = set()
    movies = []
    for a in attendees:
        title = a["movie"]
        if title and title not in seen_movies:
            seen_movies.add(title)
            movies.append({
                "title": title,
                "director": movie_directors.get(title, "TBD"),
                "imdb": "#",
            })

    # Load predictions if provided
    predictions = None
    if os.path.exists(predictions_file):
        with open(predictions_file, encoding="utf-8") as f:
            predictions = json.load(f)
        print(f"Loaded predictions from {predictions_file} ({len(predictions['picks'])} participants)")

    # Load awards if provided
    awards = None
    if os.path.exists(awards_file):
        with open(awards_file, encoding="utf-8") as f:
            awards_data = json.load(f)
        awards = awards_data.get("awards", [])
        print(f"Loaded awards from {awards_file} ({len(awards)} awards)")

    output = {
        "year": year,
        "attendees": attendees,
        "movies": movies,
    }
    if awards is not None:
        output["awards"] = awards
    if predictions is not None:
        output["predictions"] = predictions

    os.makedirs(outputs_dir, exist_ok=True)
    with open(output_file, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    parts = [f"{len(attendees)} attendees", f"{len(movies)} movies"]
    if awards is not None:
        parts.append(f"{len(awards)} awards")
    if predictions is not None:
        parts.append(f"{len(predictions['picks'])} predictions")
    print(f"\nWritten {output_file}  (year={year}, {', '.join(parts)})")

    for a in attendees:
        char_str = f"as {a['character']}" if a["character"] else "(no character)"
        print(f"  {a['name']:25s}  {len(a['images']):3d} images  {char_str}")
    print()
    for m in movies:
        print(f"  {m['title']:35s}  dir. {m['director']}")

if __name__ == "__main__":
    main()
