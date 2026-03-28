"""
Convert all photos in a year directory's inputs/imgs/ folder to WebP format.

Creates a .webp copy alongside each original, preserving the same filename
and directory structure. Applies EXIF orientation before converting.
Skips files that already have an up-to-date .webp version.

Usage:
    python utils/convert_webp.py <year_dir> [--quality 80] [--dry-run]

Examples:
    python utils/convert_webp.py utils/data/2026 --dry-run
    python utils/convert_webp.py utils/data/2026
    python utils/convert_webp.py utils/data/2026 --quality 90
"""

import argparse
import sys
import time
from pathlib import Path
from PIL import Image, ImageOps

PHOTO_EXTENSIONS = {".jpg", ".jpeg", ".png", ".tiff", ".heic"}


def parse_args():
    parser = argparse.ArgumentParser(
        description="Convert photos to WebP format."
    )
    parser.add_argument("year_dir", help="Path to the year directory (e.g. utils/data/2026)")
    parser.add_argument(
        "--quality",
        type=int,
        default=80,
        help="WebP quality 1-100 (default: 80)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print what would be converted without doing it",
    )
    return parser.parse_args()


def find_photos(folder):
    photos = []
    for f in sorted(folder.rglob("*")):
        if f.is_file() and f.suffix.lower() in PHOTO_EXTENSIONS:
            photos.append(f)
    return photos


def convert_one(src, quality):
    dst = src.with_suffix(".webp")
    img = Image.open(src)
    img = ImageOps.exif_transpose(img)
    img.save(dst, "WEBP", quality=quality)
    img.close()
    return dst


def main():
    args = parse_args()
    folder = Path(args.year_dir) / "inputs" / "imgs"
    folder = folder.resolve()

    if not folder.is_dir():
        print(f"Error: {folder} is not a directory")
        sys.exit(1)

    photos = find_photos(folder)
    if not photos:
        print("No photo files found.")
        sys.exit(0)

    # Filter to only those needing conversion
    to_convert = []
    skipped = 0
    for src in photos:
        dst = src.with_suffix(".webp")
        if dst.exists() and dst.stat().st_mtime >= src.stat().st_mtime:
            skipped += 1
        else:
            to_convert.append(src)

    print(f"Folder:      {folder}")
    print(f"Quality:     {args.quality}")
    print(f"Total:       {len(photos)} photos")
    print(f"To convert:  {len(to_convert)}")
    print(f"Up to date:  {skipped}")
    print()

    if not to_convert:
        print("Everything is already converted.")
        return

    if args.dry_run:
        print("DRY RUN — no files will be created:\n")
        for src in to_convert:
            dst = src.with_suffix(".webp")
            print(f"  {src.name}  ->  {dst.name}")
        print(f"\n{len(to_convert)} files would be converted.")
        return

    start = time.time()
    for i, src in enumerate(to_convert):
        convert_one(src, args.quality)
        if (i + 1) % 10 == 0 or (i + 1) == len(to_convert):
            elapsed = time.time() - start
            rate = (i + 1) / elapsed
            remaining = (len(to_convert) - i - 1) / rate if rate > 0 else 0
            print(f"  [{i+1}/{len(to_convert)}] {src.name}  ({rate:.1f}/s, ~{remaining:.0f}s remaining)")

    elapsed = time.time() - start

    total_src = sum(f.stat().st_size for f in to_convert)
    total_dst = sum(f.with_suffix(".webp").stat().st_size for f in to_convert)
    ratio = (1 - total_dst / total_src) * 100 if total_src > 0 else 0

    print(f"\nDone! {len(to_convert)} files converted in {elapsed:.1f}s")
    print(f"  Original:  {total_src / 1024 / 1024:.1f} MB")
    print(f"  WebP:      {total_dst / 1024 / 1024:.1f} MB")
    print(f"  Saved:     {ratio:.1f}%")


if __name__ == "__main__":
    main()
