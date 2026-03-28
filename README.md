# Cali's Oscars

Photo gallery site for Cali's annual Oscars party. Built with React + Vite, deployed to GitHub Pages.

---

## Adding a New Year

Follow these steps in order each year to go from raw photos to a published ceremony page.

Each year's data lives in a **year directory** (e.g. `utils/data/2027`):

```
utils/data/YEAR/
├── inputs/
│   ├── imgs/                    ← All renamed photos (flat, from all photographers)
│   ├── labels.json              ← After labeling (Step 6)
│   ├── characters.json          ← After manual creation (Step 7)
│   ├── awards.json              ← After manual creation (Step 9)
│   ├── predictions.csv          ← After manual creation
│   └── predictions.json         ← After running convert script (Step 8)
└── outputs/
    └── ceremony.json            ← Final output (Step 10)
```

### Prerequisites

```bash
pip install pillow pillow-heif flask
npm install   # first time only
```

- **Pillow** — image processing (EXIF reading, resizing, WebP conversion)
- **pillow-heif** — adds HEIC/HEIF support to Pillow (Apple photos)
- **Flask** — serves the labeling web UI

---

### Step 1 — Collect photos from all photographers

Collect each photographer's raw photos into any convenient directory (e.g. a camera SD card, Downloads folder, etc.).

---

### Step 2 — Rename photos by EXIF timestamp

Reads photos from an input directory, renames them to `YYYYMMDD_HHMMSS_Firstname_Lastname[_N].jpg` using the photo's EXIF `DateTimeOriginal`, and copies them into an output directory. Run once per photographer.

```bash
# Preview first (no changes made)
python utils/rename_photos.py /media/camera/DCIM utils/data/2027/inputs/imgs Garrit Strenge --dry-run

# Apply
python utils/rename_photos.py /media/camera/DCIM utils/data/2027/inputs/imgs Garrit Strenge
python utils/rename_photos.py ~/Downloads/photos utils/data/2027/inputs/imgs Kyle Wheeler
```

**Inputs:** input directory (source photos), output directory, first + last name
**Output:** renamed copies written to the output directory

> If a photographer's camera clock was wrong, fix the timestamps after renaming — see Step 3. Otherwise skip to Step 4.

---

### Step 3 — Fix timestamps (if camera clock was off)

If multiple cameras were used, you can use this tool to align timestamps across cameras so that images show up in correct order

Shifts all filenames in a directory by a fixed number of seconds. Use `--dry-run` to verify the offset before applying.

```bash
# Preview
python utils/fix_timestamps.py utils/data/2027/inputs/imgs -1818 --dry-run

# Apply (subtract 30 min 18 sec)
python utils/fix_timestamps.py utils/data/2027/inputs/imgs -1818

# Add time (positive offset)
python utils/fix_timestamps.py utils/data/2027/inputs/imgs 300

# Only fix a specific photographer's photos
python utils/fix_timestamps.py utils/data/2027/inputs/imgs -1818 --filter Kyle_Wheeler
```

**Inputs:** image directory, offset in seconds (negative = subtract)
**Options:** `--filter REGEX` to only affect files whose names match the pattern (e.g. `Kyle_Wheeler`)
**Output:** files renamed in place with corrected timestamps

---

### Step 4 — Convert to WebP

Creates a `.webp` thumbnail copy alongside each `.JPG`. The site displays `.webp` files; `.JPG` originals are kept for full-quality downloads. Skips files that already have an up-to-date `.webp`.

```bash
# Preview
python utils/convert_webp.py utils/data/2027/inputs/imgs --dry-run

# Convert all photos
python utils/convert_webp.py utils/data/2027/inputs/imgs

# Higher quality (default is 80)
python utils/convert_webp.py utils/data/2027/inputs/imgs --quality 90
```

**Inputs:** image directory (searched recursively)
**Output:** `.webp` file created next to each original

---

### Step 5 — Copy WebP files to `public/imgs/`

The site serves images from `public/imgs/` (flat, no subfolders). Copy all `.webp` files there:

```bash
# Windows
copy utils\data\YEAR\inputs\imgs\*.webp public\imgs\

# Mac/Linux
cp utils/data/YEAR/inputs/imgs/*.webp public/imgs/
```

> Only `.webp` files go in `public/imgs/`. The `.JPG` originals stay in `inputs/imgs/`.

---

### Step 6 — Label who is in each photo

Start the labeling tool, which serves a local web UI:

```bash
python utils/label_tool.py utils/data/2027
# Open http://localhost:5050

# Custom port if needed
python utils/label_tool.py utils/data/2027 --port 5050
```

**Inputs:** year directory
**Output:** `inputs/labels.json` updated with person tags per photo

**Keyboard shortcuts in the UI:**

| Key | Action |
|-----|--------|
| `→` / `←` | Next / previous photo |
| `Enter` | Add name / advance to next photo |
| `Tab` | Autocomplete name |
| `Backspace` | Clear all labels on current photo |
| `R` | Rotate photo |
| `Ctrl+S` | Skip (mark as no people) |

> The tool carries forward labels from the previous photo when you advance — useful for burst shots of the same person.

---

### Step 7 — Create the characters file

Create `inputs/characters.json` in the year directory. This maps each attendee to their costume character, movie, and the director of that movie.

```bash
cp utils/data/2026/inputs/characters.json utils/data/2027/inputs/characters.json  # use last year as a template
```

Fill in the new year's data. Each entry in the `characters` array:

```json
{
  "year": 2027,
  "characters": [
    {
      "name": "Garrit Strenge",
      "character": "Character Name",
      "movie": "Movie Title",
      "director": "Director Name"
    }
  ]
}
```

- `name` must match exactly what was used during labeling
- People who attended but weren't in any labeled photo can still be listed here — they'll appear in the attendees list with 0 images
- `director` can be `"TBD"` if unknown

---

### Step 8 — Convert predictions CSV (optional)

If the party had a predictions ballot (e.g. Google Form), export the responses as CSV and convert them to the predictions JSON format.

```bash
python utils/convert_predictions.py utils/data/2027
```

**Inputs:** year directory (reads `inputs/predictions.csv`)

**Output:** `inputs/predictions.json` with categories, correct answers, and scored picks

**CSV format requirements:**

> **Warning:** The CSV parsing is fragile. The expected format is a direct Google Forms export with these columns:
> - `Timestamp`, `Email Address`, `Name` — first three columns (Timestamp and Email are ignored)
> - Remaining columns are prediction categories (e.g. "Best Picture", "Director", etc.)
> - One row **must** have `Name` = `Ground Truth` — this row's picks are the correct answers
> - Ties in the ground truth are pipe-separated: `"Winner A|Winner B"`
> - If category names or the CSV structure changes between years, the script may silently produce wrong results. Always verify the output.

---

### Step 9 — Create awards file (optional)

Create `inputs/awards.json` in the year directory for any ceremony awards (Best Dressed, Best Predictions, etc.):

```json
{
  "awards": [
    { "title": "Best Dressed", "winners": ["Erik Zilber"] },
    { "title": "Best Predictions", "winners": ["Nathan Moelis", "Simon Carapella"] }
  ]
}
```

Multiple winners are supported (e.g. ties). Winner names must match the names used in labeling/characters for the person link to work on the site.

---

### Step 10 — Generate the ceremony JSON

Combines labels, characters, predictions, and awards into the final ceremony JSON.

```bash
python utils/convert_labels_to_ceremony.py utils/data/2027
```

**Inputs:** year directory (reads from `inputs/`):
- `labels.json` (from Step 6)
- `characters.json` (from Step 7)
- `predictions.json` (from Step 8, optional)
- `awards.json` (from Step 9, optional)

**Output:** `outputs/ceremony.json`

The script prints a summary showing image counts and character assignments per person, plus the full movies list. Verify it looks correct before proceeding.

---

### Step 11 — Finalize the ceremony JSON

Open the generated file and manually add the top-level metadata fields:

```json
{
  "year": 2027,
  "ordinal": "3rd",
  "date": "March XX, 2027",
  "bio": "Write a short description of the evening here.",
  "attendees": [ ... ],
  "movies": [ ... ],
  "awards": [ ... ],
  "predictions": { ... }
}
```

The `attendees`, `movies`, `awards`, and `predictions` fields are generated by the script. You only need to add `ordinal`, `date`, and `bio`. Refer to `src/ceremonies/2026.json` as a reference.

---

### Step 12 — Wire it into the app

Open `src/index.jsx` and add the import and entry:

```js
import ceremony2027 from "./ceremonies/2027.json";

const CEREMONY_DATA = {
  2025: ceremony2025,
  2026: ceremony2026,
  2027: ceremony2027,   // ← add this
};
```

---

### Step 13 — Test locally

```bash
npm run dev
# Open http://localhost:5173/oscars/
```

Verify:
- Photos load on the ceremony page
- Filtering by person works
- Lightbox opens and watermarks render
- Downloads work
- Awards section shows winners with character info and person links
- Predictions leaderboard shows scores and expands to show per-category picks

---

### Step 14 — Deploy

```bash
git add .
git commit -m "Add YEAR ceremony"
git push
```

GitHub Actions builds and deploys automatically. Site is live at `https://gstrenge.github.io/oscars/` within a minute or two.

---

## Project Structure

```
oscars/
├── src/
│   ├── index.jsx              # Main SPA (components, routing, data wiring)
│   ├── main.jsx               # React entry point
│   └── ceremonies/
│       ├── 2025.json          # Ceremony data per year
│       └── 2026.json
├── public/
│   ├── imgs/                  # Flat folder of .webp files served by the site
│   └── watermarks/
│       └── tmz.svg            # Watermark assets
├── utils/
│   ├── label_tool.py                # Step 6: Flask web UI for tagging photos
│   ├── convert_labels_to_ceremony.py # Step 10: generate ceremony JSON
│   ├── convert_predictions.py       # Step 8: convert predictions CSV
│   ├── rename_photos.py            # Step 2: rename by EXIF timestamp
│   ├── fix_timestamps.py           # Step 3: correct camera clock drift
│   ├── convert_webp.py             # Step 4: generate .webp thumbnails
│   └── data/
│       └── YEAR/
│           ├── inputs/              # Raw input files per year
│           │   ├── imgs/            # All renamed photos (flat)
│           │   ├── labels.json
│           │   ├── characters.json
│           │   ├── predictions.csv
│           │   ├── predictions.json
│           │   └── awards.json
│           └── outputs/             # Generated output files
│               └── ceremony.json
```
