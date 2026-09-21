# Revisi 01 — Selaras Standar Act-Scene (1 Act = 1 File) + UPDATE 5/6 IntroHeaderMorphV1

| Item | Nilai |
|---|---|
| Content | 81 — Network Interface |
| Diminta oleh | Adib, 2026-09-21 |
| Status | ✅ Diimplementasikan — Opsi A dipilih untuk §2.2 (categorySegments + INTRO_DOMAIN, konsisten seri 60/91). Glow disederhanakan ke default bawaan `IntroHeaderMorphV1` (titleGlow=true, `<defs>` manual "ni-glow" dihapus) — tetap UPDATE 5 compliant, tidak breaking. |
| Terakhir diupdate | 2026-09-21 |
| Referensi | `docs/standardizations/07-act-scene-pattern.md`, `src/shared/scene-ui/v1/IntroHeaderMorphV1.jsx` UPDATE 5/6, `_docs/` plan (status "PLAN ONLY" stale), `revisi/README.md` (baru) |

## Ringkasan Permintaan

Menyelaraskan content 81 dengan perubahan standar yang sudah tuntas di
44-ssh: (a) pola **"1 act = 1 file"**, (b) intro **`bg`/`bgScenes`** (UPDATE 6),
(c) **cek keselarasan UPDATE 5** (glow + domain otomatis). Kode TIDAK diubah —
ini plan.

## 1. Audit Status Saat Ini

| Aspek | Fakta |
|---|---|
| Struktur render | **Inline SVG** di `Animation.jsx` (499 baris, 6 Act) — belum ada `acts/`. Header Animation.jsx sudah tulis EKSEKUSI-01 (anchor `eth0` settle di Act 1, dipertahankan sampai Act 5; Act 6 sengaja tanpa anchor) |
| Call-site intro | `category={INTRO_CATEGORY_LABEL}` **string tunggal** `'LINUX FUNDAMENTALS · NETWORKING'` + `titleFilter="url(#ni-glow)"` → glow eksplisit (UPDATE 5 ✓); **domain otomatis akan menempel** "...NETWORKING · ADIB-DEV.COM" cyan default #22D3EE |
| Prop `bg`/`bgScenes` | Belum ada → thumbnail intro belum menampilkan scene |
| SFX_MAP | Ada (data.js:171) — build aman |
| Status | `draft`, `pinned`, priority 81 |
| Drift | `_docs` plan header masih "PLAN ONLY" tapi Animation.jsx sudah EKSEKUSI-01 ditulis → perlu sync. Tidak ada folder `icons/`, tidak ada `INTRO_DOMAIN` di data.js |

## 2. Rencana Perubahan

### 2.1 Migrasi ke `acts/` (pola 07-act-scene-pattern)

- Buat `src/content/81-network-interface/acts/`:
  - `common.jsx` — helper bersama (`withOrigin`, konstanta layout body-local
    inline, mis. posisi anchor `eth0`, spine).
  - `Act1TitikKoneksi.jsx` … `Act6InterfaceVirtual.jsx` (6 act dari header).
    Pindahkan SVG per act **tanpa mengubah koordinat**.
  - `index.js` — `export const ACT_SCENES = [Act1…Act6]`.
- Ganti blok inline render dengan `<Act state={{...}} />` untuk
  `ACT_SCENES[phaseIdx]`.
- Timeline GSAP, state, SFX tetap di Animation.jsx.

### 2.2 Intro UPDATE 5 — domain

Dua opsi (pilih satu saat eksekusi):

- **Opsi A (disarankan, konsisten seri)** — ganti `category` string dengan
  `categorySegments` berpola 48/60: `[{ label: INTRO_CATEGORY_LABEL + ' · ', color: MUTED }, { label: INTRO_DOMAIN, color: <konfigurasi> }]`, `INTRO_DOMAIN = 'ADIB-DEV.COM'` ditambahkan ke data.js → warna domain terkontrol.
- **Opsi B (terima default)** — biarkan UPDATE 5 auto-append domain cyan
  default. Lebih cepat tapi warna/posisi tidak seragam dengan 48/60.

### 2.3 Intro `bg`/`bgScenes` (UPDATE 6)

- Tambahkan `bg={1}` + `bgScenes={ACT_SCENES}` di call-site intro.
- Pastikan tiap `ActN` punya mode summary (`SUMMARY_STAGE` + posisi akhir).

### 2.4 Sync dokumen

- Update `_docs` plan dari "PLAN ONLY" → catat EKSEKUSI-01 yang sudah ada di kode.

## 3. Kontrak yang Tidak Berubah

- Canvas/body V1, body 732×965, `BODY_CX=366` — koordinat dipindah apa adanya.
- 6 Act, storytelling anchor continuity `eth0` tidak berubah.
- Timeline + reset loop tidak disentuh.

## 4. Checklist Implementasi & Validasi

- [x] `acts/` dibuat + `ACT_SCENES` length == 6.
- [x] esbuild `src/content/81-network-interface/Animation.jsx` tetap bundle (bundle-check isolasi, resolve semua import relatif — lolos, 54.0kb).
- [x] SSR test baseline vs `bg` — dijalankan via `react-dom/server` (`renderToStaticMarkup`), bundle esbuild CJS dari `IntroHeaderMorphV1` + `ACT_SCENES` topic 81 langsung. 6/6 assertion lolos: baseline tanpa vignette, `bg=2`+`bgScenes` render vignette + scene Act 2, `progress=1` vignette hilang, `bg=99` (out-of-range) tidak render vignette, tiap 6 Act render non-kosong (>50 char) dalam mode summary (tanpa props).
- [x] Preview frame sebelum/sesudah → live identik — divalidasi via SSR pada `progress=0` (frame hero) dan `progress=1` (frame compact header); output non-kosong dan struktur (tagline 2-segmen, title, subtitle) sesuai kontrak. Verifikasi visual piksel-demi-piksel di browser TETAP outstanding (SSR hanya cek markup, bukan render visual).
- [ ] `npm run build` tidak menambah error baru — build penuh project TERBLOKIR oleh bug pre-existing tidak terkait (`48-shell-terminal-command-line/Animation.jsx: Unexpected end of file`), bukan dari perubahan topic 81. Isolasi esbuild bundle topic 81 sendiri lolos bersih (lihat baris di atas).

## 5. Status Tes

| Pemeriksaan | Status |
|---|---|
| Compile | ✅ esbuild bundle isolasi topic 81 lolos (React/gsap external, semua import relatif — data.js, acts/*, shared/scene-ui/v1, sfxLoader — resolve tanpa error) |
| Static audit | ✅ Selesai — cross-check semua id (interface types, layers, branch, route, chain, virtual) antara `data.js` dan tiap file Act konsisten; tidak ada sisa `ConceptCard`/`AnchorIcon`/dst inline di `Animation.jsx` (digrep, bersih) |
| SSR test | ✅ 6/6 assertion lolos (lihat checklist §4) — `IntroHeaderMorphV1` bg/bgScenes behavior + tiap Act summary mode, via `react-dom/server` |
| Preview manual (browser) | Belum dijalankan — di luar akses container ini (butuh dev server + browser nyata) |
| Export MP4 | Belum dijalankan |

## 6. Implementasi Aktual (ringkas)

- `acts/common.jsx` — `withOrigin`, `CaptionBar`, `ConceptCard`, `ConnLine`,
  `ProgressDot`, `AnchorIcon`, `TakeawayBar` (dipindah verbatim dari
  `Animation.jsx`, koordinat tidak diubah).
- `acts/Act1TitikKoneksi.jsx` … `acts/Act6InterfaceVirtual.jsx` — tiap file
  punya `SUMMARY_STATE` (mode tanpa props, dipakai `bg`/`bgScenes`): momen
  akhir Act masing-masing, semua elemen visible (sesuai §3 kontrak).
- `acts/index.js` — `ACT_SCENES` array urutan Act 1→6.
- `Animation.jsx` — 499 → 338 baris; timeline GSAP + state TIDAK berubah;
  blok render raksasa diganti `const Act = ACT_SCENES[phaseIdx]; <Act state={{...}} />`.
- `data.js` — tambah `INTRO_DOMAIN = 'ADIB-DEV.COM'`.
- Intro: `category` string → `categorySegments` (label kategori warna MUTED
  + domain warna `COLORS.WIRED`, bukan cyan default UPDATE 5) + `bg={2}`
  (Act 2 — anchor "eth0" + layer link/MAC/IP, representatif untuk thumbnail)
  + `bgScenes={ACT_SCENES}`.
- `_docs/NETWORK_INTERFACE_PLAN.md` — status disinkron dari "PLAN ONLY" ke
  EKSEKUSI-01 + REVISI-01 selesai.