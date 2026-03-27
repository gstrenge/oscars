"""
Utility to apply a time offset to photo filenames that follow the format:
    YYYYMMDD_HHMMSS_Firstname_Lastname[_N].ext

Usage:
    python fix_timestamps.py <folder> <offset_seconds> [--dry-run]

Examples:
    # Subtract 30 minutes 18 seconds from all photos in a folder
    python fix_timestamps.py imgs/timestamp_Kyle_Wheeler -1818

    # Add 5 minutes to all photos in a folder
    python fix_timestamps.py imgs/timestamp_Kyle_Wheeler 300

    # Preview changes without renaming
    python fix_timestamps.py imgs/timestamp_Kyle_Wheeler -1818 --dry-run
"""

import argparse
import os
import re
import sys
from datetime import datetime, timedelta
from pathlib import Path

FILENAME_RE = re.compile(
    r"^(\d{8}_\d{6})_(.+?)(?:_(\d+))?\.(jpe?g|png|tiff|heic)$", re.IGNORECASE
)


def parse_args():
    parser = argparse.ArgumentParser(
        description="Apply a time offset to timestamped photo filenames."
    )
    parser.add_argument("folder", help="Path to the folder of photos to rename")
    parser.add_argument(
        "offset_seconds",
        type=int,
        help="Seconds to add to each timestamp (negative to subtract)",
    )
    parser.add_argument(
        "--dry-run",
        action="store_true",
        help="Print planned renames without executing them",
    )
    return parser.parse_args()


def compute_new_name(filename, offset):
    m = FILENAME_RE.match(filename)
    if not m:
        return None

    ts_str, name_part, dup_index, ext = m.groups()
    dt = datetime.strptime(ts_str, "%Y%m%d_%H%M%S")
    dt += timedelta(seconds=offset)
    new_ts = dt.strftime("%Y%m%d_%H%M%S")

    return new_ts, name_part, dup_index, ext


def main():
    args = parse_args()
    folder = Path(args.folder).resolve()

    if not folder.is_dir():
        print(f"Error: {folder} is not a directory")
        sys.exit(1)

    files = sorted(f for f in folder.iterdir() if f.is_file() and FILENAME_RE.match(f.name))
    if not files:
        print("No matching files found.")
        sys.exit(0)

    print(f"Folder:  {folder}")
    print(f"Offset:  {args.offset_seconds:+d} seconds")
    print(f"Files:   {len(files)}")
    print()

    # Phase 1: compute all new names and rename to temporary names (prefix with ~)
    # to avoid any collisions during the rename process
    renames = []
    for f in files:
        result = compute_new_name(f.name, args.offset_seconds)
        if not result:
            continue
        new_ts, name_part, dup_index, ext = result
        suffix = f"_{dup_index}" if dup_index else ""
        final_name = f"{new_ts}_{name_part}{suffix}.{ext}"
        temp_name = f"~tmp~{final_name}"
        renames.append((f, temp_name, final_name))

    # Check for duplicate final names and add disambiguation suffixes
    final_counts = {}
    for _, _, final_name in renames:
        base, ext = os.path.splitext(final_name)
        core = FILENAME_RE.match(final_name)
        ts_name = f"{core.group(1)}_{core.group(2)}" if core else base
        final_counts[ts_name] = final_counts.get(ts_name, 0) + 1

    resolved = []
    seen = {}
    for orig, temp_name, final_name in renames:
        core = FILENAME_RE.match(final_name)
        ts_name = f"{core.group(1)}_{core.group(2)}" if core else final_name
        ext = final_name.rsplit(".", 1)[-1]

        if final_counts[ts_name] > 1:
            count = seen.get(ts_name, 0)
            seen[ts_name] = count + 1
            if count == 0:
                resolved_final = f"{ts_name}.{ext}"
            else:
                resolved_final = f"{ts_name}_{count}.{ext}"
        else:
            resolved_final = final_name

        resolved_temp = f"~tmp~{resolved_final}"
        resolved.append((orig, resolved_temp, resolved_final))

    if args.dry_run:
        print("DRY RUN — no files will be renamed:\n")
        for orig, _, final in resolved:
            if orig.name != final:
                print(f"  {orig.name}  ->  {final}")
            else:
                print(f"  {orig.name}  (unchanged)")
        print(f"\n{len(resolved)} files would be renamed.")
        return

    # Phase 1: rename all to temporary names
    print("Phase 1: Renaming to temporary names...")
    temp_paths = []
    for orig, temp_name, _ in resolved:
        temp_path = orig.parent / temp_name
        orig.rename(temp_path)
        temp_paths.append(temp_path)

    # Phase 2: rename from temporary to final names
    print("Phase 2: Renaming to final names...")
    for temp_path, (_, _, final_name) in zip(temp_paths, resolved):
        final_path = temp_path.parent / final_name
        temp_path.rename(final_path)

    print(f"\nDone! {len(resolved)} files renamed.")


if __name__ == "__main__":
    main()
