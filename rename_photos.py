"""
Utility to rename photos using EXIF DateTimeOriginal metadata.

Renames files to the format:
    YYYYMMDD_HHMMSS_Firstname_Lastname[_N].ext

Where the timestamp comes from the photo's EXIF DateTimeOriginal field.
Duplicate timestamps within the same folder get a _1, _2, etc. suffix.

Usage:
    python rename_photos.py <folder> <firstname> <lastname> [--dry-run]

Examples:
    python rename_photos.py imgs/timestamp_Garrit_Strenge Garrit Strenge
    python rename_photos.py imgs/timestamp_Kyle_Wheeler Kyle Wheeler --dry-run
"""

import argparse
import os
import sys
from datetime import datetime
from pathlib import Path
from PIL import Image
from PIL.ExifTags import TAGS

PHOTO_EXTENSIONS = {".jpg", ".jpeg", ".png", ".tiff", ".heic"}


def parse_args():
    parser = argparse.ArgumentParser(
        description="Rename photos using EXIF DateTimeOriginal metadata."
    )
    parser.add_argument("folder", help="Path to the folder of photos to rename")
    parser.add_argument("firstname", help="Photographer's first name")
    parser.add_argument("lastname", help="Photographer's last name")
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print planned renames without executing them",
    )
    return parser.parse_args()


def get_exif_datetime(filepath):
    try:
        img = Image.open(filepath)
        exif = img._getexif()
        img.close()
        if not exif:
            return None
        for tag_id, value in exif.items():
            tag = TAGS.get(tag_id, tag_id)
            if tag == "DateTimeOriginal":
                return datetime.strptime(value, "%Y:%m:%d %H:%M:%S")
    except Exception:
        return None
    return None


def main():
    args = parse_args()
    folder = Path(args.folder).resolve()

    if not folder.is_dir():
        print(f"Error: {folder} is not a directory")
        sys.exit(1)

    files = sorted(
        f for f in folder.iterdir()
        if f.is_file() and f.suffix.lower() in PHOTO_EXTENSIONS
    )

    if not files:
        print("No photo files found.")
        sys.exit(0)

    print(f"Folder:    {folder}")
    print(f"Author:    {args.firstname} {args.lastname}")
    print(f"Files:     {len(files)}")
    print()

    # Build rename plan
    seen_timestamps = {}
    renames = []
    skipped = []

    for f in files:
        dt = get_exif_datetime(f)
        if not dt:
            skipped.append(f.name)
            continue

        timestamp = dt.strftime("%Y%m%d_%H%M%S")
        base_name = f"{timestamp}_{args.firstname}_{args.lastname}"
        ext = f.suffix

        if base_name in seen_timestamps:
            seen_timestamps[base_name] += 1
            new_name = f"{base_name}_{seen_timestamps[base_name]}{ext}"
        else:
            seen_timestamps[base_name] = 0
            new_name = f"{base_name}{ext}"

        renames.append((f, new_name))

    if skipped:
        print(f"WARNING: {len(skipped)} files have no EXIF DateTimeOriginal:")
        for name in skipped:
            print(f"  {name}")
        print()

    if args.dry_run:
        print("DRY RUN — no files will be renamed:\n")
        for orig, new_name in renames:
            print(f"  {orig.name}  ->  {new_name}")
        print(f"\n{len(renames)} files would be renamed.")
        return

    # Two-phase rename to avoid collisions
    print("Phase 1: Renaming to temporary names...")
    temp_paths = []
    for orig, new_name in renames:
        temp_name = f"~tmp~{new_name}"
        temp_path = orig.parent / temp_name
        orig.rename(temp_path)
        temp_paths.append(temp_path)

    print("Phase 2: Renaming to final names...")
    for temp_path, (_, new_name) in zip(temp_paths, renames):
        final_path = temp_path.parent / new_name
        temp_path.rename(final_path)

    print(f"\nDone! {len(renames)} files renamed.")


if __name__ == "__main__":
    main()
