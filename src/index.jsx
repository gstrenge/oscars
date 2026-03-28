import { useState, useEffect, useCallback, useRef, useMemo } from "react";
import ceremony2025 from "./ceremonies/2025.json";
import ceremony2026 from "./ceremonies/2026.json";
// ─── DATA LAYER ─────────────────────────────────────────────────────────────
// In production, these would be separate JSON files fetched per-route.
// For the prototype, we inline placeholder data.

const SITE_TITLE = "Cali's Oscars";

const CEREMONY_DATA = { 2025: ceremony2025, 2026: ceremony2026 };

const PEOPLE_INDEX = (() => {
  const people = {};
  Object.values(CEREMONY_DATA).forEach((ceremony) => {
    ceremony.attendees.forEach((a) => {
      if (!people[a.slug]) {
        people[a.slug] = { name: a.name, slug: a.slug, years: {} };
      }
      people[a.slug].years[ceremony.year] = {
        character: a.character,
        movie: a.movie,
        images: a.images,
      };
    });
  });
  return people;
})();

// ─── PLACEHOLDER IMAGE GENERATOR ────────────────────────────────────────────
// Generates colored SVG placeholders based on filename hash
function placeholderImage(filename, size = "thumb") {
  const hash = [...filename].reduce((h, c) => ((h << 5) - h + c.charCodeAt(0)) | 0, 0);
  const hue = Math.abs(hash) % 360;
  const w = size === "full" ? 1200 : 400;
  const h = size === "full" ? 800 : 267;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
    <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" style="stop-color:hsl(${hue},40%,25%)"/>
      <stop offset="100%" style="stop-color:hsl(${(hue + 40) % 360},50%,15%)"/>
    </linearGradient></defs>
    <rect width="100%" height="100%" fill="url(#g)"/>
    <text x="50%" y="45%" text-anchor="middle" fill="rgba(255,255,255,0.15)" font-size="${size === 'full' ? 48 : 18}" font-family="serif">${SITE_TITLE}</text>
    <text x="50%" y="60%" text-anchor="middle" fill="rgba(255,255,255,0.08)" font-size="${size === 'full' ? 20 : 10}" font-family="monospace">${filename}</text>
  </svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

function getImageUrl(filename) {
  if (!filename) return "";
  return `${import.meta.env.BASE_URL}imgs/${filename}`;
}

// ─── ROUTER ─────────────────────────────────────────────────────────────────
function useHashRouter() {
  const [route, setRoute] = useState(window.location.hash || "#/");
  useEffect(() => {
    const handler = () => setRoute(window.location.hash || "#/");
    window.addEventListener("hashchange", handler);
    return () => window.removeEventListener("hashchange", handler);
  }, []);
  return route;
}

function navigate(hash) {
  window.location.hash = hash;
}

function Link({ to, children, className = "", style = {} }) {
  return (
    <a
      href={to}
      className={className}
      style={{ textDecoration: "none", color: "inherit", ...style }}
      onClick={(e) => { e.preventDefault(); navigate(to); window.scrollTo(0, 0); }}
    >
      {children}
    </a>
  );
}

// ─── ICONS (inline SVG) ─────────────────────────────────────────────────────
const Icons = {
  download: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/></svg>
  ),
  x: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
  ),
  chevronLeft: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="15 18 9 12 15 6"/></svg>
  ),
  chevronRight: (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"/></svg>
  ),
  check: (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12"/></svg>
  ),
  film: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="2.18" ry="2.18"/><line x1="7" y1="2" x2="7" y2="22"/><line x1="17" y1="2" x2="17" y2="22"/><line x1="2" y1="12" x2="22" y2="12"/><line x1="2" y1="7" x2="7" y2="7"/><line x1="2" y1="17" x2="7" y2="17"/><line x1="17" y1="17" x2="22" y2="17"/><line x1="17" y1="7" x2="22" y2="7"/></svg>
  ),
  users: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87"/><path d="M16 3.13a4 4 0 010 7.75"/></svg>
  ),
  grid: (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
  ),
};

// ─── STYLES ─────────────────────────────────────────────────────────────────
const GOLD = "#C5A258";
const GOLD_LIGHT = "#D4B96E";
const GOLD_DARK = "#9A7D3A";
const BG_PRIMARY = "#0A0A0A";
const BG_SECONDARY = "#111111";
const BG_CARD = "#1A1A1A";
const TEXT_PRIMARY = "#F5F0E8";
const TEXT_DIM = "#8A8478";
const BORDER = "#2A2520";

// ─── GLOBAL STYLES ──────────────────────────────────────────────────────────
const GlobalStyles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400&family=Outfit:wght@300;400;500;600&display=swap');

    * { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      background: ${BG_PRIMARY};
      color: ${TEXT_PRIMARY};
      font-family: 'Outfit', sans-serif;
      font-weight: 300;
      -webkit-font-smoothing: antialiased;
      overflow-x: hidden;
    }
    ::selection { background: ${GOLD}33; color: ${GOLD_LIGHT}; }
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: ${BG_PRIMARY}; }
    ::-webkit-scrollbar-thumb { background: ${BORDER}; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: ${GOLD_DARK}; }

    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(20px); }
      to { opacity: 1; transform: translateY(0); }
    }
    @keyframes fadeIn {
      from { opacity: 0; }
      to { opacity: 1; }
    }
    @keyframes shimmer {
      0% { background-position: -200% 0; }
      100% { background-position: 200% 0; }
    }
    @keyframes goldPulse {
      0%, 100% { opacity: 0.4; }
      50% { opacity: 0.8; }
    }
    .stagger-1 { animation-delay: 0.05s; }
    .stagger-2 { animation-delay: 0.1s; }
    .stagger-3 { animation-delay: 0.15s; }
    .stagger-4 { animation-delay: 0.2s; }
    .stagger-5 { animation-delay: 0.25s; }
    .stagger-6 { animation-delay: 0.3s; }

    @media (max-width: 480px) {
      .header-site-title { display: none; }
      .header-nav { gap: 20px !important; }
      .header-nav a { letter-spacing: 0.5px !important; }
    }
  `}</style>
);

// ─── HEADER / NAV ───────────────────────────────────────────────────────────
function Header() {
  const route = useHashRouter();
  const isHome = route === "#/" || route === "";
  
  return (
    <header style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: `linear-gradient(180deg, ${BG_PRIMARY} 0%, ${BG_PRIMARY}ee 60%, transparent 100%)`,
      padding: "0 0 20px 0",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "18px 24px 0",
        display: "flex", alignItems: "center", justifyContent: "space-between",
      }}>
        <Link to="#/" style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <div style={{
            width: 38, height: 38, borderRadius: "50%",
            background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontFamily: "'Cormorant Garamond', serif", fontWeight: 700,
            color: BG_PRIMARY, letterSpacing: -1,
          }}>C</div>
          <span className="header-site-title" style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: 22, fontWeight: 600,
            color: GOLD_LIGHT, letterSpacing: 2, textTransform: "uppercase",
          }}>{SITE_TITLE}</span>
        </Link>
        <nav className="header-nav" style={{ display: "flex", gap: 32, alignItems: "center" }}>
          {[
            { label: "Ceremonies", to: "#/ceremonies/2026" },
            { label: "People", to: "#/people" },
            { label: "Movies", to: "#/movies" },
          ].map((item) => {
            const active = route.startsWith(item.to.replace("/2026", ""));
            return (
              <Link key={item.label} to={item.to} style={{
                fontSize: 13, fontWeight: 400, letterSpacing: 1.5,
                textTransform: "uppercase",
                color: active ? GOLD_LIGHT : TEXT_DIM,
                transition: "color 0.2s",
                borderBottom: active ? `1px solid ${GOLD}44` : "1px solid transparent",
                paddingBottom: 2,
              }}>
                {item.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}

// ─── YEAR SELECTOR (Oscars.org style) ───────────────────────────────────────
function YearSelector({ activeYear }) {
  const years = Object.keys(CEREMONY_DATA).map(Number).sort();

  return (
    <div style={{
      borderBottom: `1px solid ${BORDER}`,
      padding: "0 24px",
      background: BG_SECONDARY,
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto",
        display: "flex", alignItems: "stretch", gap: 0,
      }}>
        {years.map((y) => (
          <Link key={y} to={`#/ceremonies/${y}`} style={{
            padding: "16px 32px",
            fontSize: 15, fontWeight: activeYear === y ? 500 : 300,
            letterSpacing: 1,
            color: activeYear === y ? GOLD_LIGHT : TEXT_DIM,
            borderBottom: activeYear === y ? `2px solid ${GOLD}` : "2px solid transparent",
            transition: "all 0.2s",
            fontFamily: "'Cormorant Garamond', serif",
            fontSize: 20,
          }}>
            {y}
          </Link>
        ))}
      </div>
    </div>
  );
}

// ─── GALLERY FILTER BAR ─────────────────────────────────────────────────────
function FilterBar({ filters, activeFilter, onFilter, secondaryFilters, activeSecondary, onSecondary }) {
  return (
    <div style={{ marginBottom: 24 }}>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, marginBottom: secondaryFilters ? 16 : 0 }}>
        {filters.map((f) => (
          <button
            key={f.value}
            onClick={() => onFilter(f.value)}
            style={{
              padding: "8px 18px", borderRadius: 100,
              border: `1px solid ${activeFilter === f.value ? GOLD : BORDER}`,
              background: activeFilter === f.value ? `${GOLD}18` : "transparent",
              color: activeFilter === f.value ? GOLD_LIGHT : TEXT_DIM,
              fontSize: 13, fontWeight: 400, cursor: "pointer",
              fontFamily: "'Outfit', sans-serif",
              letterSpacing: 0.5,
              transition: "all 0.2s",
            }}
          >
            {f.label}
          </button>
        ))}
      </div>
      {secondaryFilters && secondaryFilters.length > 0 && (
        <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
          {secondaryFilters.map((f) => (
            <button
              key={f.value}
              onClick={() => onSecondary(f.value)}
              style={{
                padding: "5px 14px", borderRadius: 100,
                border: `1px solid ${activeSecondary === f.value ? GOLD_DARK : BORDER}`,
                background: activeSecondary === f.value ? `${GOLD_DARK}22` : "transparent",
                color: activeSecondary === f.value ? GOLD_LIGHT : TEXT_DIM,
                fontSize: 11, fontWeight: 300, cursor: "pointer",
                fontFamily: "'Outfit', sans-serif",
                letterSpacing: 0.3,
                transition: "all 0.2s",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── PHOTO GALLERY ──────────────────────────────────────────────────────────
function GalleryImage({ filename, year, attendeeName, character, movie, index, selected, onSelect, onClick, selectMode }) {
  const [loaded, setLoaded] = useState(false);
  const src = getImageUrl(filename, "thumb");

  return (
    <div
      style={{
        position: "relative", borderRadius: 6, overflow: "hidden",
        cursor: "pointer", aspectRatio: "3/2",
        animation: "fadeUp 0.4s ease both",
        animationDelay: `${Math.min(index * 0.03, 0.5)}s`,
      }}
      onClick={() => selectMode ? onSelect(filename) : onClick()}
    >
      {!loaded && (
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(90deg, ${BG_CARD} 25%, #222 50%, ${BG_CARD} 75%)`,
          backgroundSize: "200% 100%",
          animation: "shimmer 1.5s infinite",
        }} />
      )}
      <img
        src={src}
        alt={`${attendeeName} as ${character}`}
        loading="lazy"
        width={400} height={267}
        onLoad={() => setLoaded(true)}
        style={{
          width: "100%", height: "100%", objectFit: "cover",
          opacity: loaded ? 1 : 0, transition: "opacity 0.3s, transform 0.3s",
          display: "block",
        }}
        onMouseOver={(e) => e.currentTarget.style.transform = "scale(1.03)"}
        onMouseOut={(e) => e.currentTarget.style.transform = "scale(1)"}
      />
      {selectMode && (
        <div
          onClick={(e) => { e.stopPropagation(); onSelect(filename); }}
          style={{
            position: "absolute", top: 8, left: 8, width: 24, height: 24,
            borderRadius: 4, border: `2px solid ${selected ? GOLD : "rgba(255,255,255,0.5)"}`,
            background: selected ? GOLD : "rgba(0,0,0,0.4)",
            display: "flex", alignItems: "center", justifyContent: "center",
            transition: "all 0.15s",
          }}
        >
          {selected && Icons.check}
        </div>
      )}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "24px 10px 8px",
        background: "linear-gradient(transparent, rgba(0,0,0,0.7))",
        pointerEvents: "none",
      }}>
        <div style={{ fontSize: 12, fontWeight: 400, color: TEXT_PRIMARY, lineHeight: 1.3 }}>
          {attendeeName}
        </div>
        <div style={{ fontSize: 10, color: TEXT_DIM }}>
          {character} · {movie}
        </div>
      </div>
    </div>
  );
}

function PhotoGallery({ images, year }) {
  const [filter, setFilter] = useState("all");
  const [secondaryFilter, setSecondaryFilter] = useState("all");
  const [selectMode, setSelectMode] = useState(false);
  const [selected, setSelected] = useState(new Set());
  const [lightbox, setLightbox] = useState(null);
  const ceremony = CEREMONY_DATA[year];

  // Build flat image list with metadata
  const allImages = useMemo(() => {
    const list = [];
    ceremony.attendees.forEach((a) => {
      a.images.forEach((img) => {
        list.push({ filename: img, attendeeName: a.name, slug: a.slug, character: a.character, movie: a.movie, year });
      });
    });
    return list;
  }, [year]);

  // Filter options
  const personFilters = [{ value: "all", label: "All" }, ...ceremony.attendees.map((a) => ({ value: a.slug, label: a.name }))];
  const movieFilters = useMemo(() => {
    if (filter === "all") return [];
    const attendee = ceremony.attendees.find((a) => a.slug === filter);
    return attendee ? [] : [];
  }, [filter]);

  const characterFilters = useMemo(() => {
    const chars = [...new Set(ceremony.attendees.map((a) => a.character))];
    return [{ value: "all", label: "All Characters" }, ...chars.map((c) => ({ value: c, label: c }))];
  }, [year]);

  const movieFilterOptions = useMemo(() => {
    const movies = [...new Set(ceremony.attendees.map((a) => a.movie))];
    return [{ value: "all", label: "All Movies" }, ...movies.map((m) => ({ value: m, label: m }))];
  }, [year]);

  // Main filter: person, then secondary: character or movie
  const [filterMode, setFilterMode] = useState("person"); // person | character | movie
  const primaryFilters = filterMode === "person" ? personFilters : filterMode === "character" ? characterFilters : movieFilterOptions;

  const filteredImages = useMemo(() => {
    return allImages.filter((img) => {
      if (filter === "all") return true;
      if (filterMode === "person") return img.slug === filter;
      if (filterMode === "character") return img.character === filter;
      if (filterMode === "movie") return img.movie === filter;
      return true;
    });
  }, [allImages, filter, filterMode]);

  const toggleSelect = (filename) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(filename) ? next.delete(filename) : next.add(filename);
      return next;
    });
  };

  const lightboxImages = filteredImages;
  const lightboxIndex = lightbox !== null ? lightboxImages.findIndex((img) => img.filename === lightbox) : -1;

  return (
    <div>
      {/* Filter mode tabs */}
      <div style={{ display: "flex", gap: 24, marginBottom: 16, alignItems: "center" }}>
        <span style={{ fontSize: 11, color: TEXT_DIM, textTransform: "uppercase", letterSpacing: 1 }}>Filter by:</span>
        {["person", "character", "movie"].map((mode) => (
          <button
            key={mode}
            onClick={() => { setFilterMode(mode); setFilter("all"); }}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: 12, fontWeight: filterMode === mode ? 500 : 300,
              color: filterMode === mode ? GOLD_LIGHT : TEXT_DIM,
              textTransform: "capitalize", fontFamily: "'Outfit', sans-serif",
              borderBottom: filterMode === mode ? `1px solid ${GOLD}` : "none",
              paddingBottom: 2, letterSpacing: 0.5,
            }}
          >
            {mode}
          </button>
        ))}
        <div style={{ flex: 1 }} />
        <button
          onClick={() => { setSelectMode(!selectMode); setSelected(new Set()); }}
          style={{
            background: selectMode ? `${GOLD}22` : "none",
            border: `1px solid ${selectMode ? GOLD : BORDER}`,
            borderRadius: 6, padding: "6px 14px", cursor: "pointer",
            color: selectMode ? GOLD_LIGHT : TEXT_DIM,
            fontSize: 12, fontFamily: "'Outfit', sans-serif",
            display: "flex", alignItems: "center", gap: 6,
          }}
        >
          {Icons.grid} {selectMode ? "Cancel" : "Select"}
        </button>
      </div>

      <FilterBar filters={primaryFilters} activeFilter={filter} onFilter={setFilter} />

      {/* Select actions bar */}
      {selectMode && selected.size > 0 && (
        <div style={{
          display: "flex", gap: 12, marginBottom: 16, padding: "10px 16px",
          background: `${GOLD}11`, border: `1px solid ${GOLD}33`, borderRadius: 8,
          alignItems: "center",
        }}>
          <span style={{ fontSize: 13, color: GOLD_LIGHT }}>{selected.size} selected</span>
          <div style={{ flex: 1 }} />
          <button
            onClick={() => setSelected(new Set(filteredImages.map((i) => i.filename)))}
            style={{
              background: "none", border: `1px solid ${BORDER}`, borderRadius: 6,
              padding: "5px 12px", color: TEXT_DIM, fontSize: 12, cursor: "pointer",
              fontFamily: "'Outfit', sans-serif",
            }}
          >
            Select All
          </button>
          <button
            onClick={() => {
              const files = [...selected];
              files.forEach((filename, i) => {
                setTimeout(() => {
                  const img = new Image();
                  img.crossOrigin = "anonymous";
                  img.onload = () => {
                    const c = document.createElement("canvas");
                    c.width = img.naturalWidth;
                    c.height = img.naturalHeight;
                    c.getContext("2d").drawImage(img, 0, 0);
                    c.toBlob((blob) => {
                      const a = document.createElement("a");
                      a.href = URL.createObjectURL(blob);
                      a.download = filename.replace(/\.webp$/i, ".jpg");
                      a.click();
                      URL.revokeObjectURL(a.href);
                    }, "image/jpeg", 0.92);
                  };
                  img.src = getImageUrl(filename);
                }, i * 200);
              });
            }}
            style={{
              background: `linear-gradient(135deg, ${GOLD_DARK}, ${GOLD})`,
              border: "none", borderRadius: 6, padding: "6px 16px",
              color: BG_PRIMARY, fontSize: 12, fontWeight: 500, cursor: "pointer",
              fontFamily: "'Outfit', sans-serif",
              display: "flex", alignItems: "center", gap: 6,
            }}
          >
            {Icons.download} Download ({selected.size})
          </button>
        </div>
      )}

      {/* Gallery Grid */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
        gap: 12,
      }}>
        {filteredImages.map((img, i) => (
          <GalleryImage
            key={`${img.slug}-${img.filename}`}
            {...img}
            index={i}
            selected={selected.has(img.filename)}
            onSelect={toggleSelect}
            onClick={() => setLightbox(img.filename)}
            selectMode={selectMode}
          />
        ))}
      </div>

      {filteredImages.length === 0 && (
        <div style={{ textAlign: "center", padding: 60, color: TEXT_DIM }}>
          No photos found for this filter.
        </div>
      )}

      {/* Lightbox */}
      {lightbox && lightboxIndex >= 0 && (
        <Lightbox
          images={lightboxImages}
          currentIndex={lightboxIndex}
          onClose={() => setLightbox(null)}
          onNavigate={(idx) => setLightbox(lightboxImages[idx].filename)}
        />
      )}
    </div>
  );
}

// ─── LIGHTBOX WITH WATERMARK ────────────────────────────────────────────────
const WATERMARK_OPTIONS = [
  { id: "calis-oscars", label: "Cali's Oscars" },
  { id: "getty",        label: "Getty Images" },
  { id: "tmz",          label: "TMZ" },
  { id: "none",         label: "No Watermark" },
];

function photographerFromFilename(filename) {
  // "20260315_182256_Garrit_Strenge_1.webp" -> "Garrit Strenge"
  const base = filename.replace(/\.[^.]+$/, "");
  const parts = base.split("_");
  // First two parts are date + time; trailing pure-number parts are duplicates
  const nameParts = parts.slice(2).filter((p, i, arr) =>
    !(i === arr.length - 1 && /^\d+$/.test(p))
  );
  return nameParts.join(" ");
}

async function drawWatermark(ctx, imgEl, type, photographer, year) {
  if (type === "none") return;
  const w = imgEl.width, h = imgEl.height;

  if (type === "calis-oscars") {
    ctx.save();
    ctx.globalAlpha = 0.15;
    ctx.fillStyle = "#ffffff";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.translate(w / 2, h / 2);
    ctx.rotate(-0.3);
    ctx.font = `bold ${Math.max(w / 12, 36)}px serif`;
    ctx.fillText(SITE_TITLE, 0, 0);
    ctx.font = `${Math.max(w / 30, 14)}px sans-serif`;
    ctx.fillText("© " + year, 0, Math.max(w / 12, 36) * 0.9);
    ctx.restore();
  } else if (type === "getty") {
    // Font stack approximating Trade Gothic Bold No.2 / Light
    const TRADE_GOTHIC = `'Trade Gothic', 'Trade Gothic LT Std', 'Franklin Gothic Medium', 'Arial Narrow', sans-serif`;
    const fs = Math.max(w * 0.042, 28);   // "getty images" font size
    const fsCredit = Math.max(w * 0.026, 18); // "Credit:" font size
    const pad = fs * 0.65;

    // Measure both halves of "getty images" to size the rect
    ctx.save();
    ctx.textBaseline = "alphabetic";
    ctx.font = `bold ${fs}px ${TRADE_GOTHIC}`;
    const gettyW = ctx.measureText("getty ").width;
    ctx.font = `300 ${fs}px ${TRADE_GOTHIC}`;
    const imagesW = ctx.measureText("images").width;
    ctx.font = `bold ${fsCredit}px ${TRADE_GOTHIC}`;
    const creditW = ctx.measureText(`Credit: ${photographer}`).width;

    const textW = Math.max(gettyW + imagesW, creditW);
    const rectW = textW + pad * 2;
    const lineGap = fs * 0.90;
    const rectH = pad * 2 + fs + lineGap + fsCredit * 0.3;

    // Rectangle anchored to right edge, vertically centered
    const rectX = w - rectW;
    const rectY = (h - rectH) / 2;

    ctx.globalAlpha = 0.55;
    ctx.fillStyle = "#666666";
    ctx.fillRect(rectX, rectY, rectW, rectH);

    // Text
    ctx.globalAlpha = 1;
    ctx.fillStyle = "#ffffff";
    const textX = rectX + pad;
    const line1Y = rectY + pad + fs;

    // "getty " — bold
    ctx.font = `bold ${fs}px ${TRADE_GOTHIC}`;
    ctx.fillText("getty", textX, line1Y);
    // "images" — light
    ctx.font = `300 ${fs}px ${TRADE_GOTHIC}`;
    ctx.fillText("images", textX + gettyW, line1Y);

    // "Credit: Photographer" — bold, smaller
    ctx.font = `${fsCredit}px ${TRADE_GOTHIC}`;
    ctx.fillText(`Credit: ${photographer}`, textX, line1Y + lineGap);

    ctx.restore();
  } else if (type === "tmz") {
    await new Promise((resolve) => {
      const logo = new Image();
      logo.onload = () => {
        const margin = Math.max(w * 0.025, 12);
        const logoH = h * 0.1;
        const logoW = logo.width * (logoH / logo.height);
        ctx.save();
        ctx.globalAlpha = 0.92;
        ctx.drawImage(logo, margin, h - margin - logoH, logoW, logoH);
        ctx.restore();
        resolve();
      };
      logo.onerror = resolve; // don't block if SVG fails to load
      logo.src = `${import.meta.env.BASE_URL}watermarks/tmz.svg`;
    });
  }
}

function Lightbox({ images, currentIndex, onClose, onNavigate }) {
  const canvasRef = useRef(null);
  const imgRef = useRef(null);
  const current = images[currentIndex];
  const [watermark, setWatermark] = useState("calis-oscars");

  useEffect(() => {
    const handler = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && currentIndex > 0) onNavigate(currentIndex - 1);
      if (e.key === "ArrowRight" && currentIndex < images.length - 1) onNavigate(currentIndex + 1);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [currentIndex, images.length]);

  // Redraw canvas whenever image or watermark changes
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = async () => {
      imgRef.current = img;
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      await drawWatermark(ctx, img, watermark, photographerFromFilename(current.filename), current.year);
    };
    img.src = getImageUrl(current.filename, "full");
  }, [current, watermark]);

  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed", inset: 0, zIndex: 1000,
        background: "rgba(0,0,0,0.92)",
        display: "flex", alignItems: "center", justifyContent: "center",
        animation: "fadeIn 0.2s ease",
        backdropFilter: "blur(10px)",
      }}
    >
      {/* Close button */}
      <button
        onClick={onClose}
        style={{
          position: "absolute", top: 20, right: 20, background: "none",
          border: "none", color: TEXT_PRIMARY, cursor: "pointer", zIndex: 10,
          opacity: 0.7, transition: "opacity 0.2s",
        }}
        onMouseOver={(e) => e.currentTarget.style.opacity = 1}
        onMouseOut={(e) => e.currentTarget.style.opacity = 0.7}
      >
        {Icons.x}
      </button>

      {/* Nav arrows */}
      {currentIndex > 0 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex - 1); }}
          style={{
            position: "absolute", left: 16, top: "50%", transform: "translateY(-50%)",
            background: "rgba(0,0,0,0.4)", border: "none", borderRadius: "50%",
            width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center",
            color: TEXT_PRIMARY, cursor: "pointer", zIndex: 10,
          }}
        >
          {Icons.chevronLeft}
        </button>
      )}
      {currentIndex < images.length - 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); onNavigate(currentIndex + 1); }}
          style={{
            position: "absolute", right: 16, top: "50%", transform: "translateY(-50%)",
            background: "rgba(0,0,0,0.4)", border: "none", borderRadius: "50%",
            width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center",
            color: TEXT_PRIMARY, cursor: "pointer", zIndex: 10,
          }}
        >
          {Icons.chevronRight}
        </button>
      )}

      {/* Canvas + controls */}
      <div onClick={(e) => e.stopPropagation()} style={{ maxWidth: "85vw", maxHeight: "80vh", position: "relative" }}>
        <canvas
          ref={canvasRef}
          style={{ maxWidth: "85vw", maxHeight: "72vh", borderRadius: 4, display: "block" }}
        />

        {/* Watermark selector */}
        <div style={{
          display: "flex", gap: 6, justifyContent: "center",
          padding: "10px 0 4px",
        }}>
          {WATERMARK_OPTIONS.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setWatermark(opt.id)}
              style={{
                padding: "4px 12px", borderRadius: 100, fontSize: 11,
                border: `1px solid ${watermark === opt.id ? GOLD : BORDER}`,
                background: watermark === opt.id ? `${GOLD}22` : "transparent",
                color: watermark === opt.id ? GOLD_LIGHT : TEXT_DIM,
                cursor: "pointer", fontFamily: "'Outfit', sans-serif",
                transition: "all 0.15s", letterSpacing: 0.3,
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>

        {/* Info & download bar */}
        <div style={{
          display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "8px 0", gap: 16,
        }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 400, color: TEXT_PRIMARY }}>
              {current.attendeeName} <span style={{ color: TEXT_DIM }}>as</span> {current.character}
            </div>
            <div style={{ fontSize: 12, color: TEXT_DIM }}>{current.movie} · {current.year}</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            {watermark !== "none" && (
              <button
                onClick={() => {
                  canvasRef.current.toBlob((blob) => {
                    const link = document.createElement("a");
                    link.href = URL.createObjectURL(blob);
                    link.download = current.filename.replace(/\.webp$/i, ".jpg");
                    link.click();
                  }, "image/jpeg", 0.92);
                }}
                style={{
                  background: `linear-gradient(135deg, ${GOLD_DARK}, ${GOLD})`,
                  border: "none", borderRadius: 6, padding: "8px 20px",
                  color: BG_PRIMARY, fontSize: 13, fontWeight: 500, cursor: "pointer",
                  fontFamily: "'Outfit', sans-serif",
                  display: "flex", alignItems: "center", gap: 8,
                  whiteSpace: "nowrap",
                }}
              >
                {Icons.download} With watermark
              </button>
            )}
            <button
              onClick={() => {
                const link = document.createElement("a");
                link.href = getImageUrl(current.filename);
                link.download = current.filename;
                link.click();
              }}
              style={{
                background: "transparent",
                border: `1px solid ${GOLD_DARK}`, borderRadius: 6, padding: "8px 20px",
                color: GOLD, fontSize: 13, fontWeight: 500, cursor: "pointer",
                fontFamily: "'Outfit', sans-serif",
                display: "flex", alignItems: "center", gap: 8,
                whiteSpace: "nowrap",
              }}
            >
              {Icons.download} Original
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE: HOME ─────────────────────────────────────────────────────────────
function HomePage() {
  const years = Object.keys(CEREMONY_DATA).map(Number).sort().reverse();

  return (
    <div style={{ paddingTop: 80 }}>
      {/* Hero */}
      <section style={{
        minHeight: "70vh", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        textAlign: "center", padding: "80px 24px",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", inset: 0,
          background: `radial-gradient(ellipse at 50% 30%, ${GOLD}08 0%, transparent 70%)`,
        }} />
        <div style={{
          width: 80, height: 80, borderRadius: "50%", marginBottom: 32,
          background: `linear-gradient(135deg, ${GOLD}, ${GOLD_DARK})`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 40, fontFamily: "'Cormorant Garamond', serif", fontWeight: 700,
          color: BG_PRIMARY,
          animation: "fadeUp 0.6s ease both",
          boxShadow: `0 0 60px ${GOLD}22`,
        }}>C</div>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(42px, 7vw, 80px)",
          fontWeight: 300, letterSpacing: 6, color: TEXT_PRIMARY,
          animation: "fadeUp 0.6s ease both", animationDelay: "0.1s",
          textTransform: "uppercase", lineHeight: 1.1,
        }}>
          Cali's<br />
          <span style={{ color: GOLD_LIGHT, fontWeight: 600 }}>Oscars</span>
        </h1>
        <p style={{
          marginTop: 20, fontSize: 16, fontWeight: 300, color: TEXT_DIM,
          maxWidth: 480, lineHeight: 1.7, letterSpacing: 0.5,
          animation: "fadeUp 0.6s ease both", animationDelay: "0.2s",
        }}>
          An annual celebration of cinema, costumes, and community.
          Browse photos from every ceremony.
        </p>
        <div style={{
          marginTop: 40, display: "flex", gap: 16,
          animation: "fadeUp 0.6s ease both", animationDelay: "0.3s",
        }}>
          {years.map((y) => (
            <Link key={y} to={`#/ceremonies/${y}`} style={{
              padding: "14px 36px", borderRadius: 4,
              background: y === years[0] ? `linear-gradient(135deg, ${GOLD_DARK}, ${GOLD})` : "transparent",
              border: y === years[0] ? "none" : `1px solid ${BORDER}`,
              color: y === years[0] ? BG_PRIMARY : TEXT_DIM,
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: 20, fontWeight: 500, letterSpacing: 2,
              transition: "all 0.2s",
            }}>
              {y}
            </Link>
          ))}
        </div>
      </section>

      {/* Quick stats */}
      <section style={{
        maxWidth: 1200, margin: "0 auto", padding: "40px 24px 80px",
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
        gap: 24,
      }}>
        {[
          { label: "Ceremonies", value: years.length },
          { label: "Guests", value: Object.keys(PEOPLE_INDEX).length },
          { label: "Photos", value: new Set(Object.values(CEREMONY_DATA).flatMap((c) => c.attendees.flatMap((a) => a.images))).size },
          { label: "Movies Represented", value: Object.values(CEREMONY_DATA).reduce((sum, c) => sum + c.movies.length, 0) },
        ].map((stat, i) => (
          <div key={stat.label} style={{
            textAlign: "center", padding: "28px 16px",
            border: `1px solid ${BORDER}`, borderRadius: 8,
            background: BG_SECONDARY,
            animation: "fadeUp 0.5s ease both",
            animationDelay: `${0.4 + i * 0.08}s`,
          }}>
            <div style={{
              fontFamily: "'Cormorant Garamond', serif", fontSize: 36,
              fontWeight: 600, color: GOLD_LIGHT,
            }}>{stat.value}</div>
            <div style={{ fontSize: 12, color: TEXT_DIM, letterSpacing: 1.5, textTransform: "uppercase", marginTop: 4 }}>
              {stat.label}
            </div>
          </div>
        ))}
      </section>
    </div>
  );
}

// ─── PREDICTIONS SECTION ────────────────────────────────────────────────────
function PredictionsSection({ predictions }) {
  const [expandedPerson, setExpandedPerson] = useState(null);
  const { categories, answers, picks } = predictions;
  const total = categories.length;

  return (
    <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 40px" }}>
      <h2 style={{
        fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 400,
        color: TEXT_PRIMARY, marginBottom: 20, letterSpacing: 1,
        animation: "fadeUp 0.5s ease both", animationDelay: "0.25s",
      }}>
        Predictions
      </h2>
      <div style={{
        borderRadius: 8, overflow: "hidden",
        border: `1px solid ${BORDER}`, background: BG_CARD,
        animation: "fadeUp 0.5s ease both", animationDelay: "0.3s",
      }}>
        {/* Header */}
        <div style={{
          display: "grid", gridTemplateColumns: "1fr auto",
          padding: "14px 20px", borderBottom: `1px solid ${BORDER}`,
          background: BG_SECONDARY,
        }}>
          <div style={{ fontSize: 11, color: TEXT_DIM, letterSpacing: 1.5, textTransform: "uppercase" }}>Name</div>
          <div style={{ fontSize: 11, color: TEXT_DIM, letterSpacing: 1.5, textTransform: "uppercase" }}>Score</div>
        </div>

        {/* Rows */}
        {picks.map((p, i) => {
          const isExpanded = expandedPerson === p.name;
          const isTop = i === 0 || p.score === picks[0].score;
          return (
            <div key={p.name}>
              <div
                onClick={() => setExpandedPerson(isExpanded ? null : p.name)}
                style={{
                  display: "grid", gridTemplateColumns: "1fr auto",
                  padding: "12px 20px",
                  borderBottom: `1px solid ${BORDER}`,
                  cursor: "pointer",
                  transition: "background 0.15s",
                  background: isExpanded ? BG_SECONDARY : "transparent",
                }}
                onMouseEnter={(e) => { if (!isExpanded) e.currentTarget.style.background = BG_SECONDARY; }}
                onMouseLeave={(e) => { if (!isExpanded) e.currentTarget.style.background = "transparent"; }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 15, color: isTop ? GOLD_LIGHT : TEXT_PRIMARY, fontWeight: isTop ? 500 : 400 }}>
                    {p.name}
                  </span>
                  {isTop && <span style={{ fontSize: 11, color: GOLD, fontWeight: 500 }}>&#9733;</span>}
                </div>
                <div style={{
                  fontSize: 15, fontVariantNumeric: "tabular-nums",
                  color: isTop ? GOLD_LIGHT : TEXT_DIM,
                  fontWeight: isTop ? 500 : 400,
                }}>
                  {p.score}/{total}
                </div>
              </div>

              {/* Expanded picks detail */}
              {isExpanded && (
                <div style={{
                  padding: "12px 20px 16px",
                  borderBottom: `1px solid ${BORDER}`,
                  background: BG_SECONDARY,
                }}>
                  <div style={{
                    display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                    gap: "6px 24px", fontSize: 13,
                  }}>
                    {categories.map((cat) => {
                      const pick = p.picks[cat];
                      const answer = answers[cat];
                      const correct = Array.isArray(answer) ? answer.includes(pick) : pick === answer;
                      return (
                        <div key={cat} style={{ display: "flex", gap: 8, alignItems: "baseline", padding: "2px 0" }}>
                          <span style={{ color: correct ? "#4ade80" : "#f87171", flexShrink: 0 }}>
                            {correct ? "\u2713" : "\u2717"}
                          </span>
                          <span style={{ color: TEXT_DIM, flexShrink: 0, minWidth: 0 }}>{cat}:</span>
                          <span style={{ color: correct ? TEXT_PRIMARY : TEXT_DIM, fontWeight: correct ? 400 : 300 }}>
                            {pick}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

// ─── PAGE: CEREMONY ─────────────────────────────────────────────────────────
function CeremonyPage({ year }) {
  const ceremony = CEREMONY_DATA[year];
  if (!ceremony) return <div style={{ padding: "120px 24px", textAlign: "center", color: TEXT_DIM }}>Ceremony not found.</div>;

  return (
    <div style={{ paddingTop: 80 }}>
      <YearSelector activeYear={year} />

      {/* Hero section */}
      <section style={{
        maxWidth: 1200, margin: "0 auto", padding: "60px 24px 40px",
      }}>
        <div style={{ animation: "fadeUp 0.5s ease both" }}>
          <div style={{
            fontSize: 12, color: GOLD, letterSpacing: 3, textTransform: "uppercase",
            marginBottom: 8, fontWeight: 500,
          }}>
            The {ceremony.ordinal} Annual
          </div>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(36px, 5vw, 56px)",
            fontWeight: 300, letterSpacing: 3, lineHeight: 1.1,
          }}>
            <span style={{ color: GOLD_LIGHT, fontWeight: 600 }}>{SITE_TITLE}</span>{" "}
            <span style={{ color: TEXT_PRIMARY }}>{year}</span>
          </h1>
          <div style={{ fontSize: 14, color: TEXT_DIM, marginTop: 8, letterSpacing: 0.5 }}>
            {ceremony.date}
          </div>
        </div>
        <p style={{
          marginTop: 24, fontSize: 16, lineHeight: 1.8, color: TEXT_DIM,
          maxWidth: 720, fontWeight: 300,
          animation: "fadeUp 0.5s ease both", animationDelay: "0.1s",
        }}>
          {ceremony.bio}
        </p>
      </section>

      {/* Attendee cards */}
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 40px" }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 400,
          color: TEXT_PRIMARY, marginBottom: 20, letterSpacing: 1,
          animation: "fadeUp 0.5s ease both", animationDelay: "0.15s",
        }}>
          Guests
        </h2>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
          gap: 12,
        }}>
          {ceremony.attendees.map((a, i) => (
            <Link key={a.slug} to={`#/people/${a.slug}/${year}`} style={{
              padding: "16px 18px", borderRadius: 8,
              background: BG_CARD, border: `1px solid ${BORDER}`,
              transition: "all 0.2s",
              animation: "fadeUp 0.4s ease both",
              animationDelay: `${0.2 + i * 0.04}s`,
            }}>
              <div style={{ fontSize: 15, fontWeight: 400, color: TEXT_PRIMARY }}>{a.name}</div>
              <div style={{ fontSize: 12, color: GOLD, marginTop: 4 }}>{a.character}</div>
              <div style={{ fontSize: 11, color: TEXT_DIM }}>{a.movie} · {a.images.length} photos</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Awards */}
      {ceremony.awards && ceremony.awards.length > 0 && (
        <section style={{ maxWidth: 1200, margin: "0 auto", padding: "0 24px 40px" }}>
          <h2 style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 400,
            color: TEXT_PRIMARY, marginBottom: 20, letterSpacing: 1,
            animation: "fadeUp 0.5s ease both", animationDelay: "0.2s",
          }}>
            Awards
          </h2>
          <div style={{
            display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
            gap: 16,
          }}>
            {ceremony.awards.map((award, i) => (
              <div key={award.title} style={{
                padding: "24px", borderRadius: 8,
                background: BG_CARD, border: `1px solid ${BORDER}`,
                animation: "fadeUp 0.4s ease both",
                animationDelay: `${0.25 + i * 0.06}s`,
              }}>
                <div style={{
                  fontSize: 11, color: GOLD, letterSpacing: 2, textTransform: "uppercase",
                  marginBottom: 10, fontWeight: 500,
                }}>
                  {award.title}
                </div>
                {award.winners.map((w) => {
                  const attendee = ceremony.attendees.find((a) => a.name === w);
                  return (
                    <div key={w} style={{ lineHeight: 1.4 }}>
                      {attendee ? (
                        <Link to={`#/people/${attendee.slug}/${year}`} style={{ fontSize: 18, fontWeight: 400, color: TEXT_PRIMARY }}>
                          {w}
                          {attendee.character && (
                            <span style={{ fontSize: 13, color: TEXT_DIM, fontWeight: 300 }}> as {attendee.character}</span>
                          )}
                        </Link>
                      ) : (
                        <span style={{ fontSize: 18, fontWeight: 400, color: TEXT_PRIMARY }}>{w}</span>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Predictions Leaderboard */}
      {ceremony.predictions && (
        <PredictionsSection predictions={ceremony.predictions} />
      )}

      {/* Photo Gallery */}
      <section style={{
        maxWidth: 1200, margin: "0 auto", padding: "20px 24px 80px",
      }}>
        <h2 style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: 28, fontWeight: 400,
          color: TEXT_PRIMARY, marginBottom: 24, letterSpacing: 1,
        }}>
          Photo Gallery
        </h2>
        <PhotoGallery images={[]} year={year} />
      </section>
    </div>
  );
}

// ─── PAGE: PEOPLE INDEX ─────────────────────────────────────────────────────
function PeoplePage() {
  const people = Object.values(PEOPLE_INDEX).sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div style={{ paddingTop: 80 }}>
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 32, animation: "fadeUp 0.5s ease both" }}>
          <span style={{ color: GOLD }}>{Icons.users}</span>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: 40,
            fontWeight: 400, letterSpacing: 2,
          }}>
            All Guests
          </h1>
        </div>
        <div style={{
          display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
          gap: 16,
        }}>
          {people.map((person, i) => {
            const yearKeys = Object.keys(person.years).sort().reverse();
            return (
              <Link key={person.slug} to={`#/people/${person.slug}`} style={{
                padding: "20px 24px", borderRadius: 8,
                background: BG_CARD, border: `1px solid ${BORDER}`,
                transition: "all 0.25s",
                animation: "fadeUp 0.4s ease both",
                animationDelay: `${i * 0.04}s`,
              }}>
                <div style={{ fontSize: 18, fontWeight: 400, color: TEXT_PRIMARY, marginBottom: 8 }}>
                  {person.name}
                </div>
                {yearKeys.map((yr) => (
                  <div key={yr} style={{ fontSize: 12, color: TEXT_DIM, marginTop: 4 }}>
                    <span style={{ color: GOLD, fontWeight: 500 }}>{yr}</span>{" "}
                    — {person.years[yr].character} ({person.years[yr].movie})
                  </div>
                ))}
                <div style={{ fontSize: 11, color: TEXT_DIM, marginTop: 8 }}>
                  {yearKeys.length} {yearKeys.length === 1 ? "ceremony" : "ceremonies"} ·{" "}
                  {Object.values(person.years).reduce((sum, y) => sum + y.images.length, 0)} photos
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}

// ─── PAGE: PERSON DETAIL ────────────────────────────────────────────────────
function PersonPage({ slug, initialYear }) {
  const person = PEOPLE_INDEX[slug];
  if (!person) return <div style={{ padding: "120px 24px", textAlign: "center", color: TEXT_DIM }}>Person not found.</div>;

  const years = Object.keys(person.years).sort().reverse();
  const defaultYear = initialYear && person.years[initialYear] ? initialYear : years[0];
  const [activeYear, setActiveYear] = useState(defaultYear);

  const changeYear = (yr) => {
    setActiveYear(yr);
    navigate(`#/people/${slug}/${yr}`);
  };
  const yearData = person.years[activeYear];

  // Build images for gallery
  const allImages = yearData.images.map((img) => ({
    filename: img,
    attendeeName: person.name,
    slug: person.slug,
    character: yearData.character,
    movie: yearData.movie,
    year: Number(activeYear),
  }));

  const [lightbox, setLightbox] = useState(null);
  const lightboxIndex = lightbox !== null ? allImages.findIndex((i) => i.filename === lightbox) : -1;

  return (
    <div style={{ paddingTop: 80 }}>
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px 80px" }}>
        <Link to="#/people" style={{ fontSize: 12, color: TEXT_DIM, letterSpacing: 1, display: "inline-block", marginBottom: 24 }}>
          ← All Guests
        </Link>
        <h1 style={{
          fontFamily: "'Cormorant Garamond', serif", fontSize: "clamp(32px, 5vw, 48px)",
          fontWeight: 400, letterSpacing: 2, marginBottom: 8,
          animation: "fadeUp 0.5s ease both",
        }}>
          {person.name}
        </h1>

        {/* Year tabs */}
        <div style={{ display: "flex", gap: 16, marginBottom: 32, marginTop: 16 }}>
          {years.map((yr) => (
            <button
              key={yr}
              onClick={() => changeYear(yr)}
              style={{
                background: "none", border: "none", cursor: "pointer",
                fontFamily: "'Cormorant Garamond', serif", fontSize: 22,
                fontWeight: activeYear === yr ? 600 : 300,
                color: activeYear === yr ? GOLD_LIGHT : TEXT_DIM,
                borderBottom: activeYear === yr ? `2px solid ${GOLD}` : "2px solid transparent",
                padding: "4px 8px", transition: "all 0.2s",
              }}
            >
              {yr}
            </button>
          ))}
        </div>

        <div style={{
          padding: "16px 20px", background: BG_CARD, borderRadius: 8,
          border: `1px solid ${BORDER}`, marginBottom: 32, display: "inline-block",
        }}>
          <div style={{ fontSize: 14, color: TEXT_PRIMARY }}>
            Dressed as <span style={{ color: GOLD_LIGHT, fontWeight: 500 }}>{yearData.character}</span>
          </div>
          <div style={{ fontSize: 12, color: TEXT_DIM, marginTop: 2 }}>from {yearData.movie}</div>
        </div>

        {/* Photo grid */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
          gap: 12,
        }}>
          {allImages.map((img, i) => (
            <GalleryImage
              key={`${img.slug}-${img.filename}`}
              {...img}
              index={i}
              selected={false}
              onSelect={() => {}}
              onClick={() => setLightbox(img.filename)}
              selectMode={false}
            />
          ))}
        </div>

        {lightbox && lightboxIndex >= 0 && (
          <Lightbox
            images={allImages}
            currentIndex={lightboxIndex}
            onClose={() => setLightbox(null)}
            onNavigate={(idx) => setLightbox(allImages[idx].filename)}
          />
        )}
      </section>
    </div>
  );
}

// ─── PAGE: MOVIES ───────────────────────────────────────────────────────────
function MoviesPage() {
  const years = Object.keys(CEREMONY_DATA).map(Number).sort().reverse();

  return (
    <div style={{ paddingTop: 80 }}>
      <section style={{ maxWidth: 1200, margin: "0 auto", padding: "60px 24px 80px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 40, animation: "fadeUp 0.5s ease both" }}>
          <span style={{ color: GOLD }}>{Icons.film}</span>
          <h1 style={{
            fontFamily: "'Cormorant Garamond', serif", fontSize: 40,
            fontWeight: 400, letterSpacing: 2,
          }}>
            Movies
          </h1>
        </div>

        {years.map((yr) => {
          const ceremony = CEREMONY_DATA[yr];
          return (
            <div key={yr} style={{ marginBottom: 48 }}>
              <h2 style={{
                fontFamily: "'Cormorant Garamond', serif", fontSize: 28,
                fontWeight: 600, color: GOLD_LIGHT, letterSpacing: 2, marginBottom: 16,
              }}>
                {yr}
              </h2>
              <div style={{
                display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                gap: 12,
              }}>
                {ceremony.movies.map((movie, i) => {
                  const attendees = ceremony.attendees.filter((a) => a.movie === movie.title);
                  return (
                    <div key={movie.title} style={{
                      padding: "20px 24px", borderRadius: 8,
                      background: BG_CARD, border: `1px solid ${BORDER}`,
                      animation: "fadeUp 0.4s ease both",
                      animationDelay: `${i * 0.05}s`,
                    }}>
                      <div style={{ fontSize: 17, fontWeight: 400, color: TEXT_PRIMARY, marginBottom: 4 }}>
                        {movie.title}
                      </div>
                      <div style={{ fontSize: 12, color: TEXT_DIM, marginBottom: 10 }}>
                        Dir. {movie.director}
                      </div>
                      {attendees.length > 0 && (
                        <div style={{ borderTop: `1px solid ${BORDER}`, paddingTop: 10 }}>
                          {attendees.map((a) => (
                            <Link key={a.slug} to={`#/people/${a.slug}/${yr}`} style={{
                              display: "block", fontSize: 12, color: GOLD,
                              marginTop: 4, transition: "color 0.15s",
                            }}>
                              {a.name} as {a.character}
                            </Link>
                          ))}
                        </div>
                      )}
                      {movie.imdb && movie.imdb !== "#" && (
                        <a href={movie.imdb} target="_blank" rel="noreferrer" style={{
                          display: "inline-block", marginTop: 10, fontSize: 11,
                          color: TEXT_DIM, textDecoration: "underline", textUnderlineOffset: 3,
                        }}>
                          IMDb →
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </section>
    </div>
  );
}

// ─── FOOTER ─────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{
      borderTop: `1px solid ${BORDER}`,
      padding: "40px 24px",
      textAlign: "center",
    }}>
      <div style={{
        fontFamily: "'Cormorant Garamond', serif", fontSize: 16,
        color: GOLD_DARK, letterSpacing: 3, textTransform: "uppercase",
        marginBottom: 8,
      }}>
        {SITE_TITLE}
      </div>
      <div style={{ fontSize: 11, color: TEXT_DIM, letterSpacing: 0.5 }}>
        A celebration of cinema, costumes, and community
      </div>
    </footer>
  );
}

// ─── APP ROUTER ─────────────────────────────────────────────────────────────
export default function App() {
  const route = useHashRouter();

  let page;
  if (route === "#/" || route === "" || route === "#") {
    page = <HomePage />;
  } else if (route.match(/^#\/ceremonies\/(\d{4})$/)) {
    const year = Number(route.match(/^#\/ceremonies\/(\d{4})$/)[1]);
    page = <CeremonyPage year={year} />;
  } else if (route === "#/people") {
    page = <PeoplePage />;
  } else if (route.match(/^#\/people\/([^/]+)\/(\d{4})$/)) {
    const m = route.match(/^#\/people\/([^/]+)\/(\d{4})$/);
    page = <PersonPage slug={m[1]} initialYear={m[2]} />;
  } else if (route.match(/^#\/people\/([^/]+)$/)) {
    const slug = route.match(/^#\/people\/([^/]+)$/)[1];
    page = <PersonPage slug={slug} />;
  } else if (route === "#/movies") {
    page = <MoviesPage />;
  } else {
    page = (
      <div style={{ padding: "120px 24px", textAlign: "center" }}>
        <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 48, fontWeight: 300, color: TEXT_DIM }}>404</h1>
        <p style={{ color: TEXT_DIM, marginTop: 12 }}>Page not found.</p>
        <Link to="#/" style={{ color: GOLD, marginTop: 16, display: "inline-block", fontSize: 14 }}>← Back Home</Link>
      </div>
    );
  }

  return (
    <>
      <GlobalStyles />
      <Header />
      <main style={{ minHeight: "100vh" }}>{page}</main>
      <Footer />
    </>
  );
}
