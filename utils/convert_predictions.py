"""
Converts a predictions CSV (Google Forms export) into the predictions block
for a ceremony JSON file.

The CSV must contain a row with Name "Ground Truth" whose picks are the
correct answers. Ties are separated with a pipe: "Winner A|Winner B".

Columns "Timestamp" and "Email Address" are ignored automatically.

Usage:
    python utils/convert_predictions.py --csv utils/data/2026/inputs/predictions.csv
    python utils/convert_predictions.py --csv predictions.csv --output predictions.json
"""

import argparse
import csv
import json
import sys

IGNORE_COLUMNS = {"Timestamp", "Email Address", "Name"}


def parse_args():
    parser = argparse.ArgumentParser(
        description="Convert predictions CSV to ceremony JSON predictions block."
    )
    parser.add_argument(
        "--csv", required=True,
        help="Path to predictions CSV file",
    )
    parser.add_argument(
        "--output", default="predictions.json",
        help="Path to write output JSON (default: predictions.json)",
    )
    return parser.parse_args()


def main():
    args = parse_args()

    with open(args.csv, encoding="utf-8") as f:
        reader = csv.DictReader(f)
        headers = reader.fieldnames
        rows = list(reader)

    # Determine scoring categories (everything except ignored columns)
    categories = [h for h in headers if h not in IGNORE_COLUMNS]

    # Find and extract the Ground Truth row
    truth_row = None
    pick_rows = []
    for row in rows:
        if row["Name"].strip() == "Ground Truth":
            truth_row = row
        else:
            pick_rows.append(row)

    if not truth_row:
        print("ERROR: No row with Name 'Ground Truth' found in CSV.")
        sys.exit(1)

    # Parse answers — pipe-separated values become a list of acceptable answers
    answers = {}
    for cat in categories:
        raw = truth_row[cat].strip()
        answers[cat] = [a.strip() for a in raw.split("|")]

    # Score each person
    picks = []
    for row in pick_rows:
        name = row["Name"].strip()
        person_picks = {}
        score = 0
        for cat in categories:
            pick = row[cat].strip()
            person_picks[cat] = pick
            if pick in answers[cat]:
                score += 1
        picks.append({
            "name": name,
            "score": score,
            "picks": person_picks,
        })

    # Sort by score descending, then alphabetically
    picks.sort(key=lambda p: (-p["score"], p["name"]))

    # Build answers output: string for single winner, list for ties
    answers_out = {}
    for cat in categories:
        if len(answers[cat]) == 1:
            answers_out[cat] = answers[cat][0]
        else:
            answers_out[cat] = answers[cat]

    output = {
        "categories": categories,
        "answers": answers_out,
        "picks": picks,
    }

    with open(args.output, "w", encoding="utf-8") as f:
        json.dump(output, f, indent=2, ensure_ascii=False)

    print(f"Written {args.output}")
    print(f"  {len(categories)} categories, {len(picks)} participants\n")
    print(f"  {'Name':25s}  Score  (/{len(categories)})")
    print(f"  {'-' * 25}  {'-' * 5}")
    for p in picks:
        print(f"  {p['name']:25s}  {p['score']:5d}")


if __name__ == "__main__":
    main()
