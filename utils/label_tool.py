import argparse
import io
import json
import os
from pathlib import Path
from PIL import Image, ImageOps
from flask import Flask, jsonify, request, send_from_directory, send_file

app = Flask(__name__)

parser = argparse.ArgumentParser(description="Photo labeling tool")
parser.add_argument(
    "--imgs", default=None,
    help="Path to images directory (default: ../imgs relative to this script)",
)
parser.add_argument(
    "--labels", default=None,
    help="Path to labels.json file (default: ../labels.json relative to this script)",
)
parser.add_argument(
    "--port", type=int, default=5050,
    help="Port to run the server on (default: 5050)",
)
args, _ = parser.parse_known_args()

BASE_DIR = Path(__file__).parent.parent
IMGS_DIR = Path(args.imgs) if args.imgs else BASE_DIR / "imgs"
THUMBS_DIR = BASE_DIR / ".thumbs"
LABELS_FILE = Path(args.labels) if args.labels else BASE_DIR / "labels.json"


def load_labels():
    if LABELS_FILE.exists():
        with open(LABELS_FILE, "r") as f:
            return json.load(f)
    return {"people": [], "labels": {}}


def save_labels(data):
    with open(LABELS_FILE, "w") as f:
        json.dump(data, f, indent=2)


def get_all_photos():
    photos = []
    for folder in sorted(IMGS_DIR.iterdir()):
        if not folder.is_dir():
            continue
        for img in sorted(folder.iterdir()):
            if img.suffix.lower() in (".jpg", ".jpeg", ".png", ".tiff", ".heic"):
                photos.append(f"{folder.name}/{img.name}")
    return photos


@app.route("/")
def index():
    return FRONTEND_HTML


@app.route("/imgs/<path:filepath>")
def serve_image(filepath):
    return send_from_directory(IMGS_DIR, filepath)


@app.route("/preview/<path:filepath>")
def serve_preview(filepath):
    max_w = request.args.get("w", 1600, type=int)
    src = IMGS_DIR / filepath
    if not src.exists():
        return "Not found", 404

    cache_key = f"{max_w}/{filepath}"
    cached = THUMBS_DIR / cache_key
    if cached.exists() and cached.stat().st_mtime >= src.stat().st_mtime:
        return send_file(cached, mimetype="image/jpeg")

    img = Image.open(src)
    img = ImageOps.exif_transpose(img)
    img.thumbnail((max_w, max_w), Image.LANCZOS)
    cached.parent.mkdir(parents=True, exist_ok=True)
    img.save(cached, "JPEG", quality=80)
    img.close()
    return send_file(cached, mimetype="image/jpeg")


@app.route("/api/photos")
def api_photos():
    return jsonify(get_all_photos())


@app.route("/api/data")
def api_data():
    return jsonify(load_labels())


@app.route("/api/label", methods=["POST"])
def api_add_label():
    body = request.json
    photo = body["photo"]
    person = body["person"].strip()
    if not person:
        return jsonify({"error": "empty name"}), 400

    data = load_labels()
    if person not in data["people"]:
        data["people"].append(person)
        data["people"].sort()
    if photo not in data["labels"]:
        data["labels"][photo] = []
    if person not in data["labels"][photo]:
        data["labels"][photo].append(person)
    save_labels(data)
    return jsonify({"ok": True})


@app.route("/api/label", methods=["DELETE"])
def api_remove_label():
    body = request.json
    photo = body["photo"]
    person = body["person"]

    data = load_labels()
    if photo in data["labels"] and person in data["labels"][photo]:
        data["labels"][photo].remove(person)
        if not data["labels"][photo]:
            del data["labels"][photo]
    save_labels(data)
    return jsonify({"ok": True})


@app.route("/api/rotate", methods=["POST"])
def api_rotate():
    body = request.json
    photo = body["photo"]
    src = IMGS_DIR / photo
    if not src.exists():
        return "Not found", 404

    img = Image.open(src)
    img = ImageOps.exif_transpose(img)
    img = img.rotate(-90, expand=True)
    img.save(src, "JPEG", quality=95)
    img.close()

    # Invalidate cached previews for this photo
    for cached in THUMBS_DIR.rglob(f"*/{photo}"):
        cached.unlink(missing_ok=True)

    return jsonify({"ok": True})


@app.route("/api/labels_bulk", methods=["POST"])
def api_labels_bulk():
    """Set all labels for a photo at once."""
    body = request.json
    photo = body["photo"]
    people_list = body["people"]

    data = load_labels()
    for person in people_list:
        if person not in data["people"]:
            data["people"].append(person)
            data["people"].sort()
    data["labels"][photo] = people_list
    save_labels(data)
    return jsonify({"ok": True})


@app.route("/api/labels_clear", methods=["POST"])
def api_labels_clear():
    """Remove all labels from a photo."""
    body = request.json
    photo = body["photo"]
    data = load_labels()
    if photo in data["labels"]:
        del data["labels"][photo]
    save_labels(data)
    return jsonify({"ok": True})


@app.route("/api/skip", methods=["POST"])
def api_skip():
    """Mark a photo as 'no people' so it counts as labeled."""
    body = request.json
    photo = body["photo"]
    data = load_labels()
    if photo not in data["labels"]:
        data["labels"][photo] = []
    save_labels(data)
    return jsonify({"ok": True})


FRONTEND_HTML = r"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Photo Labeler</title>
<style>
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body { font-family: system-ui, -apple-system, sans-serif; background: #1a1a2e; color: #e0e0e0; height: 100vh; display: flex; flex-direction: column; overflow: hidden; }
  #top-bar { display: flex; align-items: center; gap: 12px; padding: 8px 16px; background: #16213e; border-bottom: 1px solid #0f3460; flex-shrink: 0; }
  #top-bar .progress { font-size: 14px; color: #a0a0b8; }
  #top-bar .filter-btn { padding: 4px 10px; border: 1px solid #0f3460; background: transparent; color: #a0a0b8; border-radius: 4px; cursor: pointer; font-size: 13px; }
  #top-bar .filter-btn.active { background: #0f3460; color: #e94560; }
  #main { display: flex; flex: 1; overflow: hidden; }
  #photo-area { flex: 1; display: flex; align-items: center; justify-content: center; position: relative; background: #0a0a1a; overflow: hidden; }
  #photo-area img { max-width: 100%; max-height: 100%; object-fit: contain; }
  #sidebar { width: 340px; background: #16213e; border-left: 1px solid #0f3460; display: flex; flex-direction: column; flex-shrink: 0; }
  #photo-name { padding: 10px 14px; font-size: 12px; color: #707090; border-bottom: 1px solid #0f3460; word-break: break-all; }
  #labels-area { flex: 1; overflow-y: auto; padding: 14px; }
  #labels-area h3 { font-size: 13px; color: #707090; margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
  .tag { display: inline-flex; align-items: center; gap: 6px; background: #0f3460; color: #e0e0e0; padding: 5px 10px; border-radius: 4px; margin: 0 6px 6px 0; font-size: 14px; }
  .tag .remove { cursor: pointer; color: #e94560; font-weight: bold; font-size: 16px; line-height: 1; }
  .tag .remove:hover { color: #ff6b81; }
  #input-area { padding: 14px; border-top: 1px solid #0f3460; position: relative; }
  #name-input { width: 100%; padding: 8px 10px; background: #0a0a1a; border: 1px solid #0f3460; color: #e0e0e0; border-radius: 4px; font-size: 14px; outline: none; }
  #name-input:focus { border-color: #e94560; }
  #name-input::placeholder { color: #505068; }
  #autocomplete { position: absolute; bottom: 100%; left: 14px; right: 14px; background: #1a1a2e; border: 1px solid #0f3460; border-radius: 4px; max-height: 200px; overflow-y: auto; display: none; }
  #autocomplete .ac-item { padding: 6px 10px; cursor: pointer; font-size: 14px; }
  #autocomplete .ac-item.selected { background: #0f3460; color: #e94560; }
  #autocomplete .ac-item:hover { background: #0f3460; }
  .ghost { color: #505068; pointer-events: none; position: absolute; left: 25px; top: 22px; font-size: 14px; font-family: system-ui, -apple-system, sans-serif; }
  #nav-bar { display: flex; align-items: center; justify-content: center; gap: 10px; padding: 8px; background: #16213e; border-top: 1px solid #0f3460; flex-shrink: 0; }
  #nav-bar button { padding: 5px 14px; background: #0f3460; border: none; color: #e0e0e0; border-radius: 4px; cursor: pointer; font-size: 13px; }
  #nav-bar button:hover { background: #e94560; }
  #nav-bar span { font-size: 13px; color: #a0a0b8; min-width: 80px; text-align: center; }
  .shortcuts { font-size: 11px; color: #505068; padding: 6px 14px; }
  .shortcuts kbd { background: #0a0a1a; padding: 1px 5px; border-radius: 3px; border: 1px solid #0f3460; font-family: monospace; }
  #skip-btn { padding: 5px 14px; background: transparent; border: 1px solid #0f3460; color: #a0a0b8; border-radius: 4px; cursor: pointer; font-size: 13px; }
  #skip-btn:hover { border-color: #e94560; color: #e94560; }
  #thumb-strip { display: flex; overflow-x: auto; background: #0a0a1a; border-top: 1px solid #0f3460; flex-shrink: 0; padding: 4px; gap: 4px; height: 72px; }
  #thumb-strip img { height: 60px; width: 80px; object-fit: cover; cursor: pointer; border: 2px solid transparent; border-radius: 3px; opacity: 0.5; flex-shrink: 0; }
  #thumb-strip img.active { border-color: #e94560; opacity: 1; }
  #thumb-strip img.labeled { opacity: 0.8; border-color: #0f3460; }
</style>
</head>
<body>
<div id="top-bar">
  <strong style="color:#e94560">Photo Labeler</strong>
  <span class="progress" id="progress"></span>
  <div style="flex:1"></div>
  <button class="filter-btn" id="filter-all" onclick="setFilter('all')">All</button>
  <button class="filter-btn" id="filter-unlabeled" onclick="setFilter('unlabeled')">Unlabeled</button>
  <button class="filter-btn" id="filter-folder" onclick="cycleFolder()">Folder: All</button>
</div>
<div id="main">
  <div id="photo-area">
    <img id="photo" src="" alt="Photo">
  </div>
  <div id="sidebar">
    <div id="photo-name"></div>
    <div id="labels-area">
      <h3>People in this photo</h3>
      <div id="tags"></div>
    </div>
    <div class="shortcuts">
      <kbd>Tab</kbd> autocomplete &nbsp; <kbd>Enter</kbd> add/next &nbsp; <kbd>Backspace</kbd> clear all &nbsp; <kbd>←</kbd><kbd>→</kbd> nav &nbsp; <kbd>R</kbd> rotate
    </div>
    <div id="input-area">
      <div id="autocomplete"></div>
      <span class="ghost" id="ghost"></span>
      <input type="text" id="name-input" placeholder="Type a name and press Enter..." autocomplete="off">
    </div>
  </div>
</div>
<div id="thumb-strip"></div>
<div id="nav-bar">
  <button onclick="go(-1)">← Prev</button>
  <span id="counter"></span>
  <button onclick="go(1)">Next →</button>
  <button id="skip-btn" onclick="skipPhoto()">Skip (no people)</button>
</div>

<script>
let photos = [], labels = {}, people = [], filtered = [];
let idx = 0, filter = 'all', folderFilter = null, folders = [];
let acIndex = -1;

async function init() {
  photos = await (await fetch('/api/photos')).json();
  const data = await (await fetch('/api/data')).json();
  labels = data.labels || {};
  people = data.people || [];
  folders = [...new Set(photos.map(p => p.split('/')[0]))];
  applyFilter();
  render();
}

function applyFilter() {
  filtered = photos.filter(p => {
    if (folderFilter && !p.startsWith(folderFilter + '/')) return false;
    if (filter === 'unlabeled' && labels[p] !== undefined) return false;
    return true;
  });
  if (idx >= filtered.length) idx = Math.max(0, filtered.length - 1);
}

function setFilter(f) {
  filter = f;
  document.getElementById('filter-all').classList.toggle('active', f === 'all');
  document.getElementById('filter-unlabeled').classList.toggle('active', f === 'unlabeled');
  applyFilter();
  idx = 0;
  render();
}

function cycleFolder() {
  const options = [null, ...folders];
  const current = options.indexOf(folderFilter);
  folderFilter = options[(current + 1) % options.length];
  document.getElementById('filter-folder').textContent = folderFilter ? 'Folder: ' + folderFilter.split('_').slice(1).join(' ') : 'Folder: All';
  document.getElementById('filter-folder').classList.toggle('active', folderFilter !== null);
  applyFilter();
  idx = 0;
  render();
}

function render() {
  const photo = filtered[idx];
  if (!photo) {
    document.getElementById('photo').src = '';
    document.getElementById('photo-name').textContent = 'No photos match filter';
    document.getElementById('tags').innerHTML = '';
    document.getElementById('counter').textContent = '0 / 0';
    updateProgress();
    return;
  }
  document.getElementById('photo').src = '/preview/' + photo + '?w=1600';
  document.getElementById('photo-name').textContent = photo;
  document.getElementById('counter').textContent = (idx + 1) + ' / ' + filtered.length;

  const currentLabels = labels[photo] || [];
  document.getElementById('tags').innerHTML = currentLabels.map(p =>
    `<span class="tag">${esc(p)}<span class="remove" onclick="removeLabel('${esc(p)}')">&times;</span></span>`
  ).join('') || '<span style="color:#505068;font-size:13px">None yet</span>';

  updateProgress();
  renderThumbs();
  document.getElementById('name-input').focus();
}

function renderThumbs() {
  const strip = document.getElementById('thumb-strip');
  const start = Math.max(0, idx - 10);
  const end = Math.min(filtered.length, idx + 20);
  strip.innerHTML = '';
  for (let i = start; i < end; i++) {
    const img = document.createElement('img');
    img.src = '/preview/' + filtered[i] + '?w=160';
    img.loading = 'lazy';
    if (i === idx) img.classList.add('active');
    if (labels[filtered[i]] !== undefined) img.classList.add('labeled');
    img.onclick = () => { idx = i; render(); };
    strip.appendChild(img);
  }
  const active = strip.querySelector('.active');
  if (active) active.scrollIntoView({ block: 'nearest', inline: 'center' });
}

function updateProgress() {
  const total = photos.length;
  const labeled = Object.keys(labels).length;
  document.getElementById('progress').textContent = labeled + ' / ' + total + ' labeled (' + Math.round(labeled / total * 100) + '%)';
}

function go(dir) {
  const prevPhoto = filtered[idx];
  const prevLabels = (prevPhoto && labels[prevPhoto]) ? [...labels[prevPhoto]] : [];
  const newIdx = Math.max(0, Math.min(filtered.length - 1, idx + dir));
  if (newIdx === idx) return;
  idx = newIdx;
  const newPhoto = filtered[idx];

  if (dir === 1 && prevLabels.length > 0 && labels[newPhoto] === undefined) {
    labels[newPhoto] = [...prevLabels];
    fetch('/api/labels_bulk', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({photo: newPhoto, people: prevLabels}) });
  }

  document.getElementById('name-input').value = '';
  hideAC();
  render();
}

async function clearLabels() {
  const photo = filtered[idx];
  if (!photo || !labels[photo] || labels[photo].length === 0) return;
  delete labels[photo];
  await fetch('/api/labels_clear', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({photo}) });
  render();
}

async function addLabel(person) {
  const photo = filtered[idx];
  if (!photo || !person.trim()) return;
  await fetch('/api/label', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({photo, person: person.trim()}) });
  if (!labels[photo]) labels[photo] = [];
  if (!labels[photo].includes(person.trim())) labels[photo].push(person.trim());
  if (!people.includes(person.trim())) { people.push(person.trim()); people.sort(); }
  document.getElementById('name-input').value = '';
  hideAC();
  render();
}

async function removeLabel(person) {
  const photo = filtered[idx];
  await fetch('/api/label', { method: 'DELETE', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({photo, person}) });
  if (labels[photo]) {
    labels[photo] = labels[photo].filter(p => p !== person);
    if (labels[photo].length === 0) delete labels[photo];
  }
  render();
}

async function skipPhoto() {
  const photo = filtered[idx];
  if (!photo) return;
  await fetch('/api/skip', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({photo}) });
  if (labels[photo] === undefined) labels[photo] = [];
  render();
  go(1);
}

async function rotatePhoto() {
  const photo = filtered[idx];
  if (!photo) return;
  await fetch('/api/rotate', { method: 'POST', headers: {'Content-Type': 'application/json'}, body: JSON.stringify({photo}) });
  document.getElementById('photo').src = '/preview/' + photo + '?w=1600&t=' + Date.now();
}

// Autocomplete
const input = document.getElementById('name-input');
const acBox = document.getElementById('autocomplete');
const ghost = document.getElementById('ghost');

input.addEventListener('input', () => {
  const val = input.value.trim().toLowerCase();
  ghost.textContent = '';
  if (!val) { hideAC(); return; }

  const matches = people.filter(p => p.toLowerCase().includes(val));
  if (matches.length === 0) { hideAC(); return; }

  // Ghost text: show first match that starts with input
  const startMatch = matches.find(p => p.toLowerCase().startsWith(val));
  if (startMatch) {
    ghost.textContent = startMatch;
  }

  acIndex = -1;
  acBox.innerHTML = matches.map((m, i) =>
    `<div class="ac-item" data-name="${esc(m)}" onclick="pickAC('${esc(m)}')">${highlight(m, val)}</div>`
  ).join('');
  acBox.style.display = 'block';
});

function highlight(name, query) {
  const i = name.toLowerCase().indexOf(query);
  return esc(name.slice(0, i)) + '<strong style="color:#e94560">' + esc(name.slice(i, i + query.length)) + '</strong>' + esc(name.slice(i + query.length));
}

function pickAC(name) { input.value = name; hideAC(); addLabel(name); }
function hideAC() { acBox.style.display = 'none'; acIndex = -1; ghost.textContent = ''; }
function esc(s) { return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;'); }

input.addEventListener('keydown', (e) => {
  const items = acBox.querySelectorAll('.ac-item');

  if (e.key === 'Tab') {
    e.preventDefault();
    // Accept ghost text or top autocomplete
    if (ghost.textContent) {
      input.value = ghost.textContent;
      ghost.textContent = '';
    } else if (items.length > 0) {
      const pick = acIndex >= 0 ? items[acIndex].dataset.name : items[0].dataset.name;
      input.value = pick;
      hideAC();
    }
    return;
  }

  if (e.key === 'Enter') {
    e.preventDefault();
    if (input.value.trim() === '' && acIndex < 0) {
      go(1);
    } else if (acIndex >= 0 && items.length > 0) {
      addLabel(items[acIndex].dataset.name);
    } else if (ghost.textContent) {
      addLabel(ghost.textContent);
    } else {
      addLabel(input.value);
    }
    return;
  }

  if (e.key === 'ArrowDown' && acBox.style.display === 'block') {
    e.preventDefault();
    acIndex = Math.min(acIndex + 1, items.length - 1);
    items.forEach((el, i) => el.classList.toggle('selected', i === acIndex));
    return;
  }
  if (e.key === 'ArrowUp' && acBox.style.display === 'block') {
    e.preventDefault();
    acIndex = Math.max(acIndex - 1, 0);
    items.forEach((el, i) => el.classList.toggle('selected', i === acIndex));
    return;
  }
  if (e.key === 'Backspace' && input.value === '') { e.preventDefault(); clearLabels(); return; }
  if (e.key === 'Escape') { hideAC(); input.blur(); }
});

document.addEventListener('keydown', (e) => {
  if (e.target === input) {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      if (input.value === '') {
        e.preventDefault();
        go(e.key === 'ArrowLeft' ? -1 : 1);
      }
    }
    return;
  }
  if (e.key === 'ArrowLeft') go(-1);
  if (e.key === 'ArrowRight') go(1);
  if (e.key === 's' && e.ctrlKey) { e.preventDefault(); skipPhoto(); }
  if (e.key === 'r') { e.preventDefault(); rotatePhoto(); }
  if (e.key === '/' || e.key === 'Enter') { e.preventDefault(); input.focus(); }
});

setFilter('all');
init();
</script>
</body>
</html>
"""

if __name__ == "__main__":
    print(f"\n  Images dir:  {IMGS_DIR}")
    print(f"  Labels file: {LABELS_FILE}")
    print(f"  Open http://localhost:{args.port} in your browser\n")
    app.run(port=args.port, debug=False)
