"""
Converts labels.json face labels into the CEREMONY_DATA attendees format
used by src/index.jsx.

For each person, collects all images they appear in (using .webp filenames,
with the photographer subfolder included in the path).

Also reads characters_<year>.json (if present) to fill in character/movie fields.

Output: ceremony_attendees.json with attendees and movies arrays.
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
        "--labels", default="labels.json",
        help="Path to labels.json (default: labels.json)",
    )
    parser.add_argument(
        "--characters",
        help="Path to characters_YEAR.json (default: auto-detected as characters_<year>.json)",
    )
    parser.add_argument(
        "--output", default="ceremony_attendees.json",
        help="Path to write output JSON (default: ceremony_attendees.json)",
    )
    args = parser.parse_args()

    with open(args.labels, encoding="utf-8") as f:
        data = json.load(f)

    people: list[str] = data["people"]
    labels: dict[str, list[str]] = data["labels"]

    year = infer_year(labels)

    # Load character/movie metadata if available
    chars_file = args.characters or f"characters_{year}.json"
    char_meta: dict[str, dict] = {}  # name -> {character, movie, director}
    movie_directors: dict[str, str] = {}  # movie title -> director
    if os.path.exists(chars_file):
        with open(chars_file, encoding="utf-8") as f:
            chars_data = json.load(f)
        for entry in chars_data["characters"]:
            char_meta[entry["name"]] = {"character": entry["character"], "movie": entry["movie"]}
            movie_directors[entry["movie"]] = entry.get("director", "TBD")
        print(f"Loaded character metadata from {chars_file}")

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

    output = {
        "year": year,
        "attendees": attendees,
        "movies": movies,
    }

    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"Written {args.output}  (year={year}, {len(attendees)} attendees, {len(movies)} movies)")
    for a in attendees:
        char_str = f"as {a['character']}" if a["character"] else "(no character)"
        print(f"  {a['name']:25s}  {len(a['images']):3d} images  {char_str}")
    print()
    for m in movies:
        print(f"  {m['title']:35s}  dir. {m['director']}")

if __name__ == "__main__":
    main()
