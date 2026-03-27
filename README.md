# Cali's Oscars

Photo gallery site for Cali's annual Oscars party. Built with React + Vite, deployed to GitHub Pages.

---

## Adding a New Year

Follow these steps in order each year to go from raw photos to a published ceremony page.

### Prerequisites

```bash
pip install pillow flask
npm install   # first time only
```

---

### Step 1 — Collect photos from all photographers

Each photographer's photos go in their own subfolder under `imgs/`, named `timestamp_Firstname_Lastname`:

```
imgs/
  timestamp_Garrit_Strenge/    ← raw originals go here
  timestamp_Kyle_Wheeler/
```

---

### Step 2 — Rename photos by EXIF timestamp

Renames each file to `YYYYMMDD_HHMMSS_Firstname_Lastname[_N].jpg` using the photo's EXIF `DateTimeOriginal`. Run once per photographer folder.

```bash
# Preview first (no changes made)
python rename_photos.py imgs/timestamp_Garrit_Strenge Garrit Strenge --dry-run

# Apply
python rename_photos.py imgs/timestamp_Garrit_Strenge Garrit Strenge
python rename_photos.py imgs/timestamp_Kyle_Wheeler Kyle Wheeler
```

**Inputs:** folder of raw photos, photographer first + last name
**Output:** files renamed in place

> If a photographer's camera clock was wrong, fix the timestamps after renaming — see Step 3. Otherwise skip to Step 4.

---

### Step 3 — Fix timestamps (if camera clock was off)

Shifts all filenames in a folder by a fixed number of seconds. Use `--dry-run` to verify the offset before applying.

```bash
# Preview
python fix_timestamps.py imgs/timestamp_Kyle_Wheeler -1818 --dry-run

# Apply (subtract 30 min 18 sec)
python fix_timestamps.py imgs/timestamp_Kyle_Wheeler -1818

# Add time (positive offset)
python fix_timestamps.py imgs/timestamp_Kyle_Wheeler 300
```

**Inputs:** folder of renamed photos, offset in seconds (negative = subtract)
**Output:** files renamed in place with corrected timestamps

---

### Step 4 — Convert to WebP

Creates a `.webp` thumbnail copy alongside each `.JPG`. The site displays `.webp` files; `.JPG` originals are kept for full-quality downloads. Skips files that already have an up-to-date `.webp`.

```bash
# Preview
python convert_webp.py imgs --dry-run

# Convert all folders
python convert_webp.py imgs

# Or a single folder
python convert_webp.py imgs/timestamp_Garrit_Strenge

# Higher quality (default is 80)
python convert_webp.py imgs --quality 90
```

**Inputs:** `imgs/` directory (or any subfolder)
**Output:** `.webp` file created next to each original

---

### Step 5 — Copy WebP files to `public/imgs/`

The site serves images from `public/imgs/` (flat, no subfolders). Copy all `.webp` files there:

```bash
# Windows
copy imgs\timestamp_Garrit_Strenge\*.webp public\imgs\
copy imgs\timestamp_Kyle_Wheeler\*.webp public\imgs\

# Mac/Linux
cp imgs/timestamp_Garrit_Strenge/*.webp public/imgs/
cp imgs/timestamp_Kyle_Wheeler/*.webp public/imgs/
```

> Only `.webp` files go in `public/imgs/`. The `.JPG` originals stay in `imgs/` and are served directly from there for downloads (since `imgs/` is also in `public/`... or adjust `getImageUrl` if your structure differs).

---

### Step 6 — Label who is in each photo

Start the labeling tool, which serves a local web UI:

```bash
python utils/label_tool.py
# Open http://localhost:5050

# Custom paths if needed
python utils/label_tool.py --imgs imgs --labels labels.json --port 5050
```

**Inputs:**
- `--imgs` — path to images directory (default: `imgs/`)
- `--labels` — path to labels JSON file (default: `labels.json`)
- `--port` — port to serve on (default: 5050)

**Output:** `labels.json` updated with person tags per photo

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

Create `characters_YEAR.json` at the project root. This maps each attendee to their costume character, movie, and the director of that movie.

```bash
cp characters_2026.json characters_2027.json  # use last year as a template
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

### Step 8 — Generate the ceremony JSON

Reads `labels.json` and `characters_YEAR.json`, produces `ceremony_attendees.json` with the full attendees and movies arrays.

```bash
python convert_labels_to_ceremony.py
```

**Inputs:**
- `labels.json` (from Step 6)
- `characters_YEAR.json` (from Step 7, matched by inferred year from filenames)

**Output:** `ceremony_attendees.json`

The script prints a summary showing image counts and character assignments per person, plus the full movies list. Verify it looks correct before proceeding.

---

### Step 9 — Create the ceremony JSON file

Copy the output to `src/ceremonies/`:

```bash
cp ceremony_attendees.json src/ceremonies/2027.json
```

Then manually fill in the top-level fields that the script doesn't generate — open `src/ceremonies/2027.json` and add:

```json
{
  "year": 2027,
  "ordinal": "3rd",
  "date": "March XX, 2027",
  "bio": "Write a short description of the evening here.",
  "attendees": [ ... ],
  "movies": [ ... ]
}
```

Refer to `src/ceremonies/2026.json` as a reference for structure.

---

### Step 10 — Wire it into the app

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

### Step 11 — Test locally

```bash
npm run dev
# Open http://localhost:5173/oscars/
```

Verify:
- Photos load on the ceremony page
- Filtering by person works
- Lightbox opens and watermarks render
- Downloads work

---

### Step 12 — Deploy

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
├── imgs/                      # Original .JPG files, organized by photographer
│   ├── timestamp_Garrit_Strenge/
│   └── timestamp_Kyle_Wheeler/
├── utils/
│   └── label_tool.py          # Flask web UI for tagging photos
├── rename_photos.py           # Step 2: rename by EXIF timestamp
├── fix_timestamps.py          # Step 3: correct camera clock drift
├── convert_webp.py            # Step 4: generate .webp thumbnails
├── convert_labels_to_ceremony.py  # Step 8: generate ceremony JSON
├── labels.json                # Face labels produced by label_tool.py
└── characters_YEAR.json       # Costume/movie metadata per year
```
