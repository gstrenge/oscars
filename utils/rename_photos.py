"""
Utility to rename photos using EXIF DateTimeOriginal metadata.

Reads photos from an input directory and writes renamed copies to an
output directory using the format:
    YYYYMMDD_HHMMSS_Firstname_Lastname[_N].ext

Where the timestamp comes from the photo's EXIF DateTimeOriginal field.
Duplicate timestamps get a _1, _2, etc. suffix.

Usage:
    python utils/rename_photos.py <input_dir> <output_dir> <firstname> <lastname> [--dry-run]

Examples:
    python utils/rename_photos.py /media/camera utils/data/2027/inputs/imgs Garrit Strenge --dry-run
    python utils/rename_photos.py ~/Downloads/photos utils/data/2027/inputs/imgs Kyle Wheeler
"""

import argparse
import os
import shutil
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
    parser.add_argument("input_dir", help="Path to the directory of source photos")
    parser.add_argument("output_dir", help="Path to the directory to write renamed photos")
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
    input_dir = Path(args.input_dir).resolve()
    output_dir = Path(args.output_dir).resolve()

    if not input_dir.is_dir():
        print(f"Error: {input_dir} is not a directory")
        sys.exit(1)

    files = sorted(
        f for f in input_dir.iterdir()
        if f.is_file() and f.suffix.lower() in PHOTO_EXTENSIONS
    )

    if not files:
        print("No photo files found.")
        sys.exit(0)

    print(f"Input:     {input_dir}")
    print(f"Output:    {output_dir}")
    print(f"Author:    {args.firstname} {args.lastname}")
    print(f"Files:     {len(files)}")
    print()

    # Build rename plan
    seen_timestamps = {}
    copies = []
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

        copies.append((f, new_name))

    if skipped:
        print(f"WARNING: {len(skipped)} files have no EXIF DateTimeOriginal:")
        for name in skipped:
            print(f"  {name}")
        print()

    if args.dry_run:
        print("DRY RUN — no files will be copied:\n")
        for orig, new_name in copies:
            print(f"  {orig.name}  ->  {new_name}")
        print(f"\n{len(copies)} files would be copied.")
        return

    os.makedirs(output_dir, exist_ok=True)

    print(f"Copying {len(copies)} files...")
    for orig, new_name in copies:
        dest = output_dir / new_name
        shutil.copy2(orig, dest)

    print(f"\nDone! {len(copies)} files copied to {output_dir}")


if __name__ == "__main__":
    main()
