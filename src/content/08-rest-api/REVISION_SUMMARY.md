# 17-rest-api — 7 Revisions Summary

**Last Updated:** 2026-09-12  
**Current Status:** Revisi-04 partial implemented; Revisi-05 partial; Revisi-06 & 07 planning phase  
**Next Action:** Execute Revisi-06 (4 Act kontinyu) & Revisi-07 (Networking header + 3 user)

---

## Quick Reference: Revisi-01 sampai 07

### Revisi-01, 02, 03 — Perencanaan (TOPIC_PLAN.txt)

| Aspek | Detail |
|---|---|
| **File** | 17-rest-api-TOPIC_PLAN.txt (1166 baris) |
| **Scope** | Peraturan visual, analogi counter, storyboard 4 Act, kontinuitas client-server-response |
| **Outcome** | Fondasi konsep: GET /users sebagai alur utama, method lain sebagai teaser epilog |
| **Status** | ✅ Selesai (baseline plan) |

### Revisi-04 — Lengkapi Method REST di Epilog (2026-09-11)

| Aspek | Detail |
|---|---|
| **File** | revisi/2026-09-11-revisi-04.md |
| **Masalah** | Epilog hanya POST & DELETE; PUT & PATCH belum tervisualisasikan |
| **Solusi** | Tambah PUT & PATCH ke teaser, ubah tempo, pakai kartu anggota sebagai data visual |
| **Scope** | Durasi naik 54s (dari target 39-46s); micro-animation per method; 5 Act tetap |
| **Status** | ✅ Sebagian implemented (compile check OK); ⏳ Preview video & export MP4 belum |
| **Checklist** | 5 item selesai, 2 pending (preview manual, export MP4) |

### Revisi-05 — Profil Visual Adib, API Service Terpadu (2026-09-11)

| Aspek | Detail |
|---|---|
| **File** | revisi/2026-09-11-revisi-05.md |
| **Tujuan** | Browser dengan profil Adib 26 tahun; endpoint + server = 1 API Service Hub |
| **Scope** | Visual perubahan: Adib muda→dewasa, rambut hitam→ungu; Nina untuk POST/DELETE |
| **Data Model** | 3 slot kartu: Adib permanent, Nina kosong, lemari pembungkus |
| **Status** | 🔧 Rencana saja; Adib profile & API hub sudah partial di codebase |
| **Checklist** | 8 item planning; 0 item execution; data structure sudah ready |

### Revisi-06 — Alur Request Tanpa Jeda (2026-09-12)

| Aspek | Detail |
|---|---|
| **File** | revisi/2026-09-12-revisi-06.md |
| **Tujuan** | **Hapus Act 5**, ubah struktur dari 5 Act ke **4 Act kontinyu**: GET tuntas di Act 1-2, CRUD di Act 3-4 |
| **Struktur** | Act 1: GET kirim (3,5s) → Act 2: Proses & return (8,5s) → Act 3: POST+PUT (13,5s) → Act 4: PATCH+DELETE (13,5s) |
| **Key Change** | Tiket request tidak boleh hilang di tengah jalan; setiap method adalah request hidup dari browser |
| **Intro** | Hero-to-header morph (gaya Tailscale), tanpa typing, no blank flash |
| **Status** | 🔧 Rencana sangat detail (346 baris); belum diimplementasi |
| **Checklist** | 7 sections detail: timing, kontinuitas, request helper, data state, icon plan, transitions, criteria |

### Revisi-07 — Networking Header, Browser Loading, 3 User (2026-09-12)

| Aspek | Detail |
|---|---|
| **File** | revisi/2026-09-12-revisi-07.md |
| **Tujuan** | **Kategori Networking** (mint green); **Browser loading state** (skeleton → hydrate); **3 user terpisah**: Adib (GET+PUT), Jokowo (POST+PATCH), Prabowo (POST+DELETE) |
| **Visual Refinement** | Intro NETWORKING header Tailscale; badge Acts x44 y155; mini form untuk Jokowo/Prabowo |
| **Icon Scope** | Batch 1: character state, browser, hub, API (2×4); Batch 2: ticket, card ops, archive (2×4) |
| **Status** | 🔧 Rencana detail (313 baris); belum diimplementasi; icon generation belum dimulai |
| **Checklist** | 8 sections: intro, header, browser UI, 3 user, asset plan, badge, validation, success criteria |

---

## Implementation Status Matrix

```
┌────────────────┬────────────────┬──────────────────┬─────────────────┐
│ Revisi         │ Status         │ Complexity       │ Blocker / Note  │
├────────────────┼────────────────┼──────────────────┼─────────────────┤
│ 01–03 (Plan)   │ ✅ Selesai      │ Documented       │ None            │
│ 04 (Method)    │ ⚠️ Partial      │ Medium           │ Preview + MP4    │
│ 05 (Adib/Hub)  │ 🔧 Plan + Code  │ Medium–High      │ Structure via-06 │
│ 06 (4 Act)     │ 🔧 Plan        │ HIGH             │ **PRIORITY #1**  │
│ 07 (Network)   │ 🔧 Plan        │ HIGH             │ **PRIORITY #2**  │
└────────────────┴────────────────┴──────────────────┴─────────────────┘
```

---

## Key Decisions & Trade-offs

### Decision 1: 5 Act → 4 Act (Revisi-06)

**Why?**
- Epilog Act 5 hanya tampilkan method card morph, tidak menunjukkan request hidup
- Setiap method harus menjadi cerita yang sama dengan GET: browser kirim tiket, masuk API, hasilnya kelihatan
- 4 Act 39s lebih tight narrative daripada 5 Act 54s + epilog daftar method

**Trade-off:**
- Lebih kompleks di timeline (multi-beat per Act)
- Lebih banyak state transition (Adib, Jokowo, Prabowo)
- Compensated by clearer data flow & konsisten dengan REST konsep

### Decision 2: 1 User (Adib) → 3 User (Revisi-07)

**Why?**
- GET + PUT pada 1 user terasa cukup menutup Revisi-06 scope
- Jokowo & Prabowo memperkenalkan POST & DELETE lebih jelas
- Operasi jadi punya sebab-akibat: POST Jokowo → PATCH role Jokowo; POST Prabowo → DELETE Prabowo

**Trade-off:**
- 3 user + 5 operation = lebih banyak state tracking
- Compensated by visual repetition (pembelajaran otomatis)
- Mini form UI perlu design & testing

### Decision 3: Titik Awal Browser (Revisi-07)

**Why?**
- Revisi-05: Browser mulai dengan profil Adib + tombol (data sudah ada)
- Revisi-07: Browser mulai loading → hydrate saat GET response (data muncul dari API)
- Lebih sesuai REST mental model: browser meminta, tidak punya data duluan

**Trade-off:**
- Tambah skeleton/loader UI
- Timeline lebih pendek di Act 1 (hanya 3,5s vs 4-5s sebelumnya)
- Compensated by clearer causality

---

## Detailed Breakdown: What Changed Each Revision

### Revisi-04: Dari 3 Method → 5 Method

```
Before (Revisi-04 plan):
  Act 1-4: GET /users (fully closed)
  Act 5 Epilog: POST, DELETE teaser only
  Duration: 47s

After (Revisi-04 implementation):
  Act 1-4: GET + lima teaser method (GET→POST→PUT→PATCH→DELETE→GET loop)
  Duration: 54s
  Tempo: 15% slower untuk baca setiap method
```

### Revisi-05: Dari Generic User → Adib 26, API Hub

```
Before (Revisi-04):
  "User #42" → generic dot collection
  Endpoint & Server → dua kotak terpisah
  Nina → generic placeholder

After (Revisi-05):
  Adib → avatar 26 tahun, seragam, rambut, age badge
  API Service → satu hub (gate + processor + cabinet)
  Card system → fisik dengan slot yang terlihat
```

### Revisi-06: Dari 5 Act Epilog → 4 Act Kontinyu

```
Before (Revisi-05):
  Act 1-4: GET perjalanan lengkap
  Act 5: static teaser method card morph
  Tiket GET disappear/reappear antar Act
  Duration: 46s target

After (Revisi-06):
  Act 1-2: GET request hidup, response kembali
  Act 3: POST Jokowo, POST Prabowo, PUT Adib (3 request parallel)
  Act 4: PATCH Jokowo, DELETE Prabowo (2 request sequential)
  Tiket kontinu, tidak pop-out antar batas Act
  Duration: 39s (compressed, no empty holds)
```

### Revisi-07: Dari Adib Saja → NETWORKING + 3 User + Loading

```
Before (Revisi-06):
  Intro: sky blue & amber (generic tech)
  Browser: mulai dengan Adib profile sudah siap
  1 user operasi: Adib GET+PUT

After (Revisi-07):
  Intro: mint green NETWORKING (kategori) + sky blue (API)
  Browser: mulai loading skeleton → hydrate via GET
  3 user operasi: Adib (GET+PUT), Jokowo (POST+PATCH), Prabowo (POST+DELETE)
  Header: Tailscale format (hero→header), x44 y100
  Badge Acts: persistent dot progress (●○○○)
```

---

## Code Structure Snapshot

### data.js Current

```javascript
// Simplified structure (actual is larger)

export const PHASES = [
  { name: 'Act 1 / GET Request', duration: 3.5, ... },
  { name: 'Act 2 / Processing', duration: 8.5, ... },
  { name: 'Act 3 / Multi-ops', duration: 13.5, ... },
  { name: 'Act 4 / Mutate+Delete', duration: 13.5, ... },
  // Act 5 removed in Revisi-06
]

export const ADIB_PROFILE = {
  age: 26,
  role: 'Student', // can change to 'Professional' via PATCH
  hair: 'black',   // can change to 'purple' via PUT
}

export const CABINET_SLOTS = [
  { id: 'adib', name: 'Adib', present: true, ... },
  { id: 'jokowo', name: 'Jokowo', present: false, ... }, // POST makes true
  { id: 'prabowo', name: 'Prabowo', present: false, ... }, // POST makes true, DELETE makes false
  { id: 'empty', name: 'Empty', present: false, ... },
]

export const REQUESTS = {
  GET: { method: 'GET', endpoint: '/users/adib', status: 200, ... },
  POST: { method: 'POST', endpoint: '/users', status: 201, ... },
  PUT: { method: 'PUT', endpoint: '/users/adib', status: 200, ... },
  PATCH: { method: 'PATCH', endpoint: '/users/jokowo', status: 200, ... },
  DELETE: { method: 'DELETE', endpoint: '/users/prabowo', status: 204, ... },
}
```

### Animation.jsx Current

```javascript
// Key state nodes relevant to Revisi-06/07

const [phaseIdx, setPhaseIdx] = useState(0) // 0-3 for 4 Acts
const [morphP, setMorphP] = useState(0) // Hero-to-header progress
const [hubOpacity, setHubOpacity] = useState(0.25) // API Service visibility

// Request flow state
const [reqY, setReqY] = useState(FLOW_WAYPOINTS.P0_CLIENT)
const [reqVisible, setReqVisible] = useState(false)
const [activeTicket, setActiveTicket] = useState(REQUESTS.GET)

// Data persistence (Revisi-07)
const [adibHair, setAdibHair] = useState(ADIB_PROFILE.hair)
const [adibRole, setAdibRole] = useState(ADIB_PROFILE.role)
const [jokowoPresent, setJokowoPresent] = useState(false)
const [prabowoPresent, setPrabowoPresent] = useState(false)

// Browser UI (Revisi-07)
const [browserView, setBrowserView] = useState('loading') // loading → profile
```

---

## Known Issues & Assumptions

### Assumption 1: Icon Generation

- Batch 1&2 direncanakan manual generate (ChatGPT pipeline atau Illustrator)
- Tidak inline SVG (terlalu kompleks untuk karakter multi-layer)
- Fallback: placeholder rect + label jika icon belum ready saat dev

### Assumption 2: Audio/SFX

- Revisi-06/07 tidak mengubah SFX mapping
- Inherit dari Revisi-05 (atau reuse Revisi-04 audio)
- No new audio checklist item

### Assumption 3: Performa

- 4 Act 39s pada browser modern (60fps) harus smooth
- Jika ada jank, prioritas:
  1. Hapus particle / decorative animation
  2. Reduce concurrent tween (serial vs parallel)
  3. Optimize cabinet render (lazy load slot visual)

### Assumption 4: Testing Environment

- Target device: desktop browser, 1920×1080, Chrome 120+
- Mobile preview hanya untuk reference (canvas tetap 820×1340)
- Export test via Puppeteer + chrome binary di folder chrome/

---

## References & File Locations

| Document | Path | Lines | Purpose |
|---|---|---|---|
| TOPIC_PLAN.txt | `src/content/17-rest-api/` | 1166 | Original brief + 20 sections |
| Revisi-04 | `src/content/17-rest-api/revisi/2026-09-11-revisi-04.md` | 146 | Method teaser, tempo, card model |
| Revisi-05 | `src/content/17-rest-api/revisi/2026-09-11-revisi-05.md` | 145 | Adib profile, API hub, asset list |
| Revisi-06 | `src/content/17-rest-api/revisi/2026-09-12-revisi-06.md` | 346 | 4 Act struktur, kontinuitas detail |
| Revisi-07 | `src/content/17-rest-api/revisi/2026-09-12-revisi-07.md` | 313 | Networking header, 3 user, icon batch |
| Animation.jsx | `src/content/17-rest-api/Animation.jsx` | 505 | Current implementation |
| data.js | `src/content/17-rest-api/data.js` | ~600 (estimate) | Config + state schema |
| EXECUTION_PLAN.md | `src/content/17-rest-api/` | 341 | Hierarchical task breakdown (NEW) |

---

## Roadmap to Completion

```
Week 1:
  └─ Revisi-06 Implementation (4 Act struktur)
      ├─ Phase structure (4 PHASES, hapus Act 5)
      ├─ Request flow helper (tiket kontinyu)
      ├─ Data state persistence (Adib, Jokowo, Prabowo)
      └─ Compile check + frame test

Week 2:
  └─ Revisi-07 Implementation (Networking + 3 user)
      ├─ Intro header (mint + sky, Tailscale format)
      ├─ Browser loading→hydrate UI
      ├─ Mini form Jokowo/Prabowo
      ├─ Icon batch 1&2 (parallel or outsource)
      └─ End-to-end validation + export MP4

Ongoing:
  ├─ Code review + pair review
  ├─ Frame-by-frame preview
  └─ Performance profiling (if needed)
```

---

**Last Reviewed:** 2026-09-12  
**Next Review:** Post Revisi-06 implementation  
**Owner:** [Your name]  
**Status:** 🔧 In Planning Phase
