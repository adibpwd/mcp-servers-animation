# Plan Revisi 03 — Inline SVG Icons for Applications & Intro Title Overflow Fix in Content 60

**Tanggal:** 2026-09-21  
**Target Content:** `60-linux-processes`  
**Status:** 🟡 DIEKSEKUSI KE KODE (2026-09-21) — `npm run build` lolos total; preview manual & export MP4 belum dilakukan.

---

## 1. Latar Belakang & Masalah (Problem Statement)

1. **Permintaan Icon SVG Inline untuk Aplikasi (Act 2 & Act 3):**
   - Di Act 2 & Act 3 terdapat kartu proses aplikasi: `browser`, `editor`, dan `music app`.
   - Kartu-kartu tersebut saat ini membutuhkan **SVG Inline Icons** (vektor bersih) yang lebih visual, jelas, dan menarik daripada sekadar teks kotak netral.
   - Perlu diaudit juga tempat-tempat lain di mana icon tambahan dapat memperkaya aspek visual animasi.

2. **Masalah Text Title Intro Terpotong di Sisi Kanan:**
   - Komponen `IntroHeaderMorphV1` memuat judul `LINUX PROCESSES` (atau kombinasi `INTRO_TITLE_A` dan `INTRO_TITLE_B`).
   - Teks judul di sisi kanan terpotong (*clipped/overflow*) pada viewport canvas standar (width 732px / 820px) akibat ukuran font (`fontSize`) yang terlalu besar atau `padding/margin` bounding box yang kurang pas.

---

## 2. Tujuan Revisi (Objectives)

1. **Membuat & Mengintegrasikan Custom Inline SVG Icons:**
   - Membuat komponen inline SVG helper untuk 3 aplikasi utama:
     - **Browser Icon (`IconBrowser`)**: Icon globe/window tab modern dengan stroke neon.
     - **Editor Icon (`IconCodeEditor`)**: Icon tag `< />` atau file kode.
     - **Music App Icon (`IconMusicApp`)**: Icon notasi musik 🎵 / audio wave.
   - Memeriksa stasiun lain yang membutuhkan icon visual tambahan (misalnya: Icon Disk File, Icon CPU Meter, Icon Terminal Prompt, dan Warning Load Badge).
2. **Perbaikan Text Title Intro Anti-Terpotong (Fix Intro Title Clipping):**
   - Mengatur ulang `fontSize`, `letterSpacing`, serta bounding box `IntroHeaderMorphV1` di `60-linux-processes` agar kata `LINUX PROCESSES` muat penuh secara estetis di dalam canvas 732px tanpa terpotong di margin kanan.

---

## 3. Rencana Perubahan Detail (Detailed Plan)

### A. Penambahan Inline SVG Icons Helper (`src/content/60-linux-processes/acts/common.jsx` / `icons/inlineSvg.jsx`)

1. **Komponen Inline SVG Icons:**
   - `IconBrowser`:
     ```jsx
     export function IconBrowser({ size = 24, color = COLORS.PROGRAM }) {
       return (
         <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
           <rect x="2" y="3" width="20" height="18" rx="4" />
           <line x1="2" y1="8" x2="22" y2="8" />
           <circle cx="5" cy="5.5" r="0.8" fill={color} />
           <circle cx="8" cy="5.5" r="0.8" fill={color} />
         </svg>
       )
     }
     ```
   - `IconEditor`:
     ```jsx
     export function IconEditor({ size = 24, color = COLORS.EDITOR }) {
       return (
         <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
           <polyline points="16 18 22 12 16 6" />
           <polyline points="8 6 2 12 8 18" />
         </svg>
       )
     }
     ```
   - `IconMusic`:
     ```jsx
     export function IconMusic({ size = 24, color = COLORS.MUSIC }) {
       return (
         <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
           <path d="M9 18V5l12-2v13" />
           <circle cx="6" cy="18" r="3" />
           <circle cx="18" cy="16" r="3" />
         </svg>
       )
     }
     ```

2. **Integrasi ke `ProcessCard` & `ResourceMeter` (`common.jsx`):**
   - Memasang icon-icon SVG di atas label nama aplikasi di dalam `ProcessCard` (menggantikan atau mendukung loader PNG).
   - Menambahkan Icon CPU Meter & RAM Stick pada `ResourceMeter` agar tampilan monitoring daya lebih profesional.

---

### B. Perbaikan Title Intro Terpotong (`data.js` & `Animation.jsx`)

1. **Penyesuaian `INTRO_TITLE_A` & `INTRO_TITLE_B` (`data.js`):**
   - Membagi title secara proporsional agar tidak melebar berlebihan di baris tunggal:
     - `INTRO_TITLE_A`: `'LINUX '`
     - `INTRO_TITLE_B`: `'PROCESSES'`
2. **Penyesuaian Props Header Morph (`Animation.jsx`):**
   - Mengatur parameter `fontSize` / scaling pada `IntroHeaderMorphV1` khusus `60-linux-processes` agar judul tidak terpotong di sisi kanan layar.
   - Menambahkan padding aman `calc(100% - 32px)` atau scaling font max ~28px - 32px saat posisi header compact/hero.

---

## 4. Rencana Verifikasi

1. **Syntax Check & Build Test:**
   - Menguji kompilasi JSX menggunakan esbuild untuk memastikan tidak ada tag SVG yang unclosed.
2. **Visual Overflow & Alignment Inspection:**
   - Memastikan judul intro `LINUX PROCESSES` teraba penuh tanpa terpotong di tepi kanan.
   - Memastikan icon SVG inline pada kartu `browser`, `editor`, dan `music` tampil presisi, simetris, dan tajam.

---

## 5. Ringkasan Status

- [x] Menyusun dokumen plan revisi 03.
- [x] Memperbarui indeks revisi `README.md`.
- [x] **Dieksekusi ke kode (2026-09-21).**

## 6. Catatan Eksekusi (2026-09-21)

- **Icon inline SVG** (`icons/inlineSvg.jsx`, baru): `IconBrowser`, `IconEditor`
  (bracket `</>`), `IconMusic`, plus 2 tambahan di luar permintaan awal —
  `IconCursorClick` (launch-cursor) dan `IconGaugeWarning` (warning-load).
  Alasan memperluas ke 5: kedua icon itu SEBELUMNYA cuma placeholder PNG
  generik (getIcon() fallback universal, lihat revisi-01) yang menunggu
  Adib generate lewat ChatGPT — dengan inline SVG, dependency manual itu
  HILANG total, dan warna icon sekarang ikut warna tema (browser/editor/
  music masing-masing, bukan abu-abu generik).
- `acts/common.jsx`: `ProcessCard`, `LaunchCursorIcon`, `WarningLoadIcon`
  diubah dari `<image href={getIcon(...)}>` ke `<Icon size=... color=...>`
  inline. `icons/loader.js` + `icons/icons.json` DITANDAI DEPRECATED (bukan
  dihapus) — sudah tidak dipanggil dari kode manapun di topic ini.
- **Fix title overflow**: root cause dikonfirmasi lewat pembacaan source
  `PortraitSceneLayoutV1.estimateTextWidth` (0.55×fontSize/char, tanpa buffer
  untuk path single-line) vs komentar `IntroHeaderMorphV1` sendiri yang
  menyebut render asli Arial Black bold all-caps ~18% lebih lebar dari
  estimasi itu — math kasar menunjukkan tepi kanan hero title bisa mepet
  (~814px dari 820px canvas) bahkan mendekati/lewat batas di kondisi nyata.
  DIPERBAIKI di level topic (bukan edit shared component, yang butuh V2
  formal per versioning rule file itu): tambah `INTRO_TITLE_LINES` di
  `data.js` + prop `titleLines={INTRO_TITLE_LINES}` di `Animation.jsx` —
  memakai mekanisme resmi yang sudah ada (`IntroHeaderMorphV1` UPDATE 2)
  yang otomatis clamp margin kiri/kanan untuk title hero multi-baris.
  Compact/header TIDAK berubah (tetap 1 baris `titleSegments`, math untuk
  itu sudah aman jauh di bawah batas canvas).
- Tidak ada perubahan pada `SFX_MAP`, `SFX_TIMELINE`/`export-lib.js`, atau
  timing GSAP — revisi ini murni visual (icon + intro title), tidak
  menyentuh timeline.
- Compile check: esbuild syntax + bundle-resolution untuk
  `Animation.jsx`/`data.js`/`acts/*`/`icons/inlineSvg.jsx` — lolos.
  **`npm run build` (full project) sekarang lolos TOTAL tanpa error**
  (sebelumnya terhalang topic lain yang pre-existing broken —
  kemungkinan sudah diperbaiki di sesi lain di luar topic ini).
- Belum diverifikasi: preview manual (apakah hero title benar-benar pas,
  apakah icon inline terlihat proporsional di card 144×104), export MP4.

**Status:** 🟡 DIEKSEKUSI KE KODE, 2026-09-21 — `npm run build` lolos total,
tapi preview manual & export MP4 masih belum dilakukan dari sesi ini.
