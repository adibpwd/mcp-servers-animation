# Struktur Project — mcp-servers-animation

Project animasi edukatif (React + GSAP + Vite) untuk menjelaskan konsep-konsep
teknis (Linux vs Unix, virtual memory, MCP servers, dll) secara visual.
Tiap topic adalah animasi mandiri, mudah ditambah tanpa mengubah kode topic lain.

## Garis Besar Folder

```
mcp-servers-animation/
├── src/                  ← Source code utama aplikasi
├── docs/                 ← Dokumentasi & panduan internal
├── scripts/              ← Script Node.js untuk export video/frame
├── public/                ← Asset statis (audio, video) yang di-serve langsung
├── dist/                 ← Hasil build production (auto-generated)
├── export/               ← Output render (video/frame) hasil export
├── frames/                ← Frame-frame gambar hasil capture animasi
├── chrome/                ← Binary Chrome headless untuk Puppeteer
├── node_modules/          ← Dependency npm (auto-generated)
└── file config lain      ← package.json, vite.config.js, Dockerfile, dsb.
```

## Detail: Isi folder `src/`

Ini folder inti tempat semua logic & UI React berada.

```
src/
├── content/                    ← SEMUA TOPIC ANIMASI ADA DI SINI
│   ├── registry.js             ← Daftar/index semua topic (wajib didaftarkan di sini)
│   ├── linux-vs-unix/          ← Contoh topic: perbandingan Linux vs Unix
│   ├── virtual-memory/         ← Contoh topic: penjelasan virtual memory
│   ├── mcp-servers/            ← Contoh topic pertama (referensi pola dasar)
│   └── ...                     ← Topic lain mengikuti pola yang sama
│       (tiap folder topic biasanya isinya Animation.jsx + data.js)
│
├── components/                 ← UI shell/reusable, TIDAK per-topic
│   ├── ContentList.jsx         ← Halaman grid daftar semua topic
│   ├── ContentCard.jsx         ← Kartu tampilan tiap topic
│   ├── PlayerShell.jsx         ← Wrapper saat animasi diputar
│   ├── PlayerPage.jsx          ← Halaman pemutar animasi
│   ├── SettingsModal.jsx       ← Modal pengaturan export/player
│   ├── ExportHistory.jsx       ← Riwayat hasil export
│   ├── TimelineProgressBar.jsx ← Progress bar timeline animasi
│   ├── NetworkDiagram.jsx, NodeGlow.jsx, LineTracer.jsx, MCPAnimation.jsx
│   │                            ← Komponen visual spesifik (diagram network, efek glow, dsb)
│   └── ContentManagement/      ← Komponen untuk kelola/manage konten
│
├── shared/                     ← Helper yang dipakai lintas topic
│   └── audio/                  ← Helper audio bersama
│
├── hooks/                      ← Custom React hooks
│   ├── useTimeline.js          ← Hook GSAP timeline (inti animasi)
│   ├── useExportSettings.js    ← Hook pengaturan export
│   └── useD3ForceSimulation.js ← Hook simulasi force-directed (D3)
│
├── utils/                      ← Fungsi utilitas murni
│   ├── animationConfig.js, colorScheme.js, nodeData.js, frameSequence.js
│
├── extensions/
│   └── vm-icon-generator/      ← Extension/tool generator icon (virtual memory)
│
├── data/
│   └── contentManagement.js    ← Data terkait manajemen konten
│
├── styles/                     ← CSS global & tema
├── App.jsx                     ← Router sederhana (state-based)
└── main.jsx                    ← Entry point React
```

## Folder Pendukung Lainnya

### `docs/` — Dokumentasi & Panduan Internal

Berisi panduan lengkap untuk develop & membuat topic baru:

```
docs/
├── 01-architecture.md           ← Penjelasan arsitektur keseluruhan project
├── 02-standar-konten.md         ← Standar & konvensi pembuatan topic
├── 03-tutorial-buat-topic-baru.md ← Tutorial step-by-step membuat animasi baru
├── 04-referensi-gsap.md         ← Referensi API & contoh GSAP (library animasi)
├── 05-svg-text-guide.md         ← Panduan membuat & styling SVG text
├── 06-icon-generation.md        ← Panduan generate icon otomatis untuk aset
└── 07-plan-single-service.md    ← Template perencanaan topic single-service
```

### Folder Lainnya

| Folder | Kegunaan |
|---|---|
| `scripts/` | Script Node untuk proses export (`export-server.mjs`, `export-parallel.mjs`, `export-video.js`) dan database konten (`content-db.json`) |
| `public/` | Asset statis (audio, video) yang langsung di-serve saat dev/build |
| `dist/` | Hasil build production dari Vite (jangan diedit manual) |
| `export/` & `frames/` | Output hasil render animasi jadi video/frame gambar |
| `chrome/` | Binary Chrome headless, dipakai Puppeteer untuk proses export |

## Cara Kerja Singkat

1. Tiap topic didefinisikan di `src/content/<nama-topic>/` (biasanya `Animation.jsx` + `data.js`), lalu didaftarkan di `src/content/registry.js`.
2. `components/` menyediakan shell UI yang sama untuk semua topic (list, card, player).
3. Saat export, `scripts/` memakai Puppeteer (Chrome di folder `chrome/`) untuk capture animasi jadi frame/video, hasilnya masuk ke `export/` dan `frames/`.


---

## Task Planning Hierarchy — Standar Numbering Unlimited

Untuk tracking progress dan planning task di project ini, gunakan sistem numbering **hierarki unlimited**. 
Format ini memudahkan AI maupun developer untuk memahami struktur task secara cepat tanpa ambiguitas.

### Format Penomoran

Gunakan **dot notation** (titik) untuk setiap level hierarki:

```
LEVEL_1.LEVEL_2.LEVEL_3.LEVEL_4.LEVEL_5 ... (unlimited)
```

Tiap nomor dimulai dari `1` dan increment sesuai urutan task pada level tersebut.

### Contoh Struktur Lengkap (5 Level)

```
1. Phase 1: Foundation & Setup
   1.1. Project Initialization
      1.1.1. Setup React + Vite environment
         1.1.1.1. Install dependencies (React, Vite, GSAP)
            1.1.1.1.1. npm install & verify versions
         1.1.1.2. Configure Vite config file
            1.1.1.2.1. Set alias paths (@/components, @/hooks)
            1.1.1.2.2. Setup CSS preprocessor (Tailwind/SCSS)
      1.1.2. Setup development tools
         1.1.2.1. Configure ESLint & Prettier
            1.1.2.1.1. Create .eslintrc.json config
            1.1.2.1.2. Setup pre-commit hooks
         1.1.2.2. Setup Git repository
            1.1.2.2.1. Create .gitignore with proper entries
            1.1.2.2.2. Initialize repository & first commit
   1.2. Base Architecture Setup
      1.2.1. Create folder structure
         1.2.1.1. Create src/ subdirectories (content, components, hooks, utils)
         1.2.1.2. Create docs/ directory with template files
      1.2.2. Setup core routing system
         1.2.2.1. Create App.jsx with route definition
            1.2.2.1.1. Setup route for topic list page
            1.2.2.1.2. Setup route for animation player page
   1.3. Core Component Scaffolding
      1.3.1. Create UI shell components
         1.3.1.1. Build ContentList.jsx (grid display)
            1.3.1.1.1. Create grid layout structure
            1.3.1.1.2. Add topic filter/search functionality
         1.3.1.2. Build ContentCard.jsx (individual item)
            1.3.1.2.1. Design card visual hierarchy
            1.3.1.2.2. Add click handler to navigate to player

2. Phase 2: Animation System Integration
   2.1. GSAP & Timeline Integration
      2.1.1. Setup GSAP library
         2.1.1.1. Install GSAP & plugins
         2.1.1.2. Create useTimeline.js hook
            2.1.1.2.1. Implement timeline initialization logic
            2.1.1.2.2. Add animation control methods (play, pause, seek)
      2.1.2. Test timeline on dummy animation
         2.1.2.1. Create simple test animation component
         2.1.2.2. Verify animations play smoothly

3. Phase 3: First Animation Topic (MCP Servers)
   3.1. Create Animation Logic
      3.1.1. Setup mcp-servers folder structure
         3.1.1.1. Create mcp-servers/Animation.jsx
         3.1.1.2. Create mcp-servers/data.js
            3.1.1.2.1. Define animation sequence
            3.1.1.2.2. Define node data and positions
      3.1.2. Implement animation timeline
         3.1.2.1. Create node entry animation
         3.1.2.2. Create connection line animation
            3.1.2.2.1. SVG line rendering
            3.1.2.2.2. Animation timing & easing
```

### Panduan Penggunaan

| Level | Nama | Deskripsi | Contoh |
|-------|------|-----------|---------|
| **1** | Phase | Fase besar project (scope bulanan/minggu) | `1 = Phase 1: Foundation` |
| **2** | Section | Bagian utama dari phase (scope: few days) | `1.1 = Project Initialization` |
| **3** | Task | Task spesifik yang deliverable (scope: 1-2 hari) | `1.1.1 = Setup React + Vite` |
| **4** | Subtask | Aktivitas konkret dalam task (scope: hours) | `1.1.1.1 = Install dependencies` |
| **5+** | Detail Steps | Step implementasi detail (scope: minutes) | `1.1.1.1.1 = npm install & verify` |

### Aturan Penomoran

1. **Selalu dimulai dari 1** — jangan dari 0
2. **Increment berurutan** — tidak boleh skip nomor (1, 2, 3... bukan 1, 3, 5)
3. **Unlimited depth** — boleh terus nambah level sesuai kebutuhan detail
4. **Consistent format** — selalu gunakan dot (.) sebagai separator
5. **Deskripsi di belakang nomor** — format: `1.2.3. Deskripsi task di sini`

### Contoh Reference dalam Dokumentasi

Saat menulis docs atau task tracking, reference task dengan nomor lengkapnya:

- ❌ Kurang jelas: "Setup environment dulu"
- ✅ Lebih jelas: "Selesaikan `1.1.1` (Setup React + Vite environment) dulu sebelum `1.1.2`"

- ❌ Ambigu: "Kerjain bagian animation"
- ✅ Tegas: "Kerjain task `3.1.2` (Implement animation timeline) terlebih dahulu"

---
