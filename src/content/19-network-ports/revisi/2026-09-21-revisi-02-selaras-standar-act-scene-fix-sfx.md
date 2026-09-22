# Revisi 02 — Selaras Standar Act-Scene (1 Act = 1 File) + Fix Build SFX_MAP + UPDATE 5/6

| Item | Nilai |
|---|---|
| Content | 84 — Network Ports |
| Diminta oleh | Adib, 2026-09-21 |
| Status | DIIMPLEMENTASIKAN — `acts/` dibuat, `Animation.jsx` di-rewire ke `ACT_SCENES`, `SFX_MAP` sudah ada (efek samping rewrite revisi-01), `bg`/`bgScenes` ditambahkan. Preview manual & build project penuh belum dijalankan. |
| Terakhir diupdate | 2026-09-22 |
| Referensi | `docs/standardizations/07-act-scene-pattern.md`, `src/shared/scene-ui/v1/IntroHeaderMorphV1.jsx` UPDATE 5/6, `revisi/2026-09-18-1213-revisi-01.md` (port sebagai tujuan koneksi), `revisi/README.md` |

## Ringkasan Permintaan (asli, saat ditulis 2026-09-21)

Dua hal: (a) **menyelaraskan** content 84 dengan standar baru seperti topic
lain (pola act-scene `acts/`, intro `bg`/`bgScenes`, UPDATE 5), dan (b)
**memperbaiki build broken**: `npm run build` gagal karena
`SFX_MAP is not exported by "src/content/84-network-ports/data.js"`.

**Catatan eksekusi (2026-09-22):** antara doc ini ditulis dan dieksekusi,
revisi-01 (packet nyata / Causal Motion Contract) dieksekusi lebih dulu dan
me-rewrite total `data.js` — yang sudah mengekspor `SFX_MAP` dengan benar
sebagai bagian dari rewrite tsb (bukan fix terpisah). Jadi item (b) di doc
ini otomatis selesai duluan; eksekusi rev-02 hanya perlu mengerjakan item (a)
di atas struktur hasil rev-01.


## 1. Audit Status Saat Ini

| Aspek | Fakta |
|---|---|
| Struktur render | **Inline SVG** di `Animation.jsx` (676 baris, 6 Act) — belum ada `acts/`. Kode aktual masih EKSEKUSI-01 plain (revisi-01 "port sebagai tujuan koneksi" Cuma PLAN ONLY, belum dieksekusi) |
| Komposer | Memakai `SceneChromeV1` (bukan primitif langsung) — intro di-sebar ke IntroHeaderMorphV1 lewat `intro={{...}}` |
| Call-site intro | `category={INTRO_CATEGORY_LABEL}` string tunggal + `titleFilter="url(#glow)"` → glow eksplisit (UPDATE 5 ✓); **domain otomatis akan menempel** setelah kategori |
| **Build bug** | `Animation.jsx:33` import `SFX_MAP` tapi `data.js` **tidak export/tidak mendefinisikan SFX_MAP sama sekali** → Vite/Rollup gagal |
| Prop `bg`/`bgScenes` | Belum ada |
| Status | `draft`, `pinned`, priority 84 |

## 2. Rencana Perubahan

### 2.1 [Kritis] Fix build: tambahkan `SFX_MAP` di data.js

`Animation.jsx` memakai `SFX_MAP.POP/TELEPORT/TICK/DING/CHIME/CONFIRM/POP2/
ALERT_PULSE/WHOOSH` dst. (baris 84–247). Karena `data.js` 84 tidak
mengexport `SFX_MAP`, wajib (a) membuat/mendefinisikan `SFX_MAP` yang berisi
entry untuk tiap nama yang dipakai, (b) pastikan tiap asset ada di
`public/audio/` (audit loudness sama seperti dokumen 06-audio-sfx.md), atau
(c) jika SFX memang tidak direncanakan, gunakan map berisi `null`/kosong yang
`sfxLoader` tahan (ikuti pola topic lain seperti 81/92) — keputusan final saat
eksekusi.

Referensi pola: `81-network-interface/data.js:171`, `92-web-server/data.js:114`.

### 2.2 Migrasi ke `acts/` (pola 07-act-scene-pattern)

- Buat `src/content/84-network-ports/acts/`:
  - `common.jsx` — helper bersama (`withOrigin`, konstanta layout body-local
    inline).
  - `Act1HostBukanService.jsx` … `Act6JalurNyata.jsx` (6 act dari header).
    Pindahkan SVG per act **tanpa mengubah koordinat**. Catatan: `SceneChromeV1`
    dipakai sebagai wrapper — migrasi act-scene **tidak menyentuh SceneChromeV1**,
    hanya konten di dalam ContentBodyV1-nya.
  - `index.js` — `export const ACT_SCENES = [Act1…Act6]`.
- Ganti blok inline render dengan `<Act state={{...}} />` untuk
  `ACT_SCENES[phaseIdx]` (di dalam SceneChromeV1 / ContentBodyV1).

### 2.3 Intro UPDATE 5 & 6

- UPDATE 5: ikuti opsi domain di plan 81 (Opsi A categorySegments konsisten
  seri, atau Opsi B terima default auto-append).
- UPDATE 6: tambahkan `bg`/`bgScenes` di `intro={{...}}` `SceneChromeV1`
  (prop diteruskan lewat spread).

### 2.4 Revisi-01 (port sebagai tujuan koneksi) — status

Revisi-01 **sudah dieksekusi** (2026-09-22, sebelum rev-02) — bukan lagi PLAN
ONLY seperti saat doc ini ditulis. Storyboard packet nyata (Causal Motion
Contract) dari rev-01 sudah menjadi isi `data.js`/`Animation.jsx`/`acts/*`
saat ini; rev-02 dieksekusi DI ATAS hasil rev-01 tsb (bukan menggantikannya).

## 3. Kontrak yang Tidak Berubah

- Canvas/body V1 + SceneChromeV1 + ActBadgeNavigatorV1 tetap.
- 6 Act sama; timeline + reset loop tetap di Animation.jsx.
- Koordinat body-local dipindah apa adanya.

## 4. Checklist Implementasi & Validasi

- [x] `SFX_MAP` diexport data.js 84 → sudah ada sejak rewrite revisi-01 (`export const SFX_MAP` di `data.js`).
- [x] `acts/` dibuat + `ACT_SCENES` length == 6 (`Act1HostBukanService` … `Act6RealPath`).
- [x] esbuild `Animation.jsx` 84 tetap bundle — lolos setelah rewire ke `ACT_SCENES`.
- [x] esbuild tiap file `acts/*.jsx` + `acts/index.js` individual — lolos tanpa error.
- [x] `bg`/`bgScenes` ditambahkan di `intro={{...}}` (`bg: 6`, `bgScenes: ACT_SCENES` — thumbnail dari Act 6/jalur nyata).
- [ ] UPDATE 5 (domain auto-append `ADIB-DEV.COM`) — tidak perlu perubahan kode: `category` dikirim sebagai string biasa tanpa `domain={null}`, jadi behavior default UPDATE 5 otomatis aktif. Belum diverifikasi visual lewat preview manual.
- [ ] `npm run build` (build project PENUH, bukan cuma esbuild-check file ini) — belum dijalankan, mungkin masih ada masalah lain di luar 84.
- [ ] Preview frame sebelum/sesudah (live vs sebelum migrasi acts/) → identik — belum dijalankan.
- [x] README revisi di-update (README.md + doc ini).

## 5. Status Tes

| Pemeriksaan | Status |
|---|---|
| Compile (esbuild per-file) | Lolos — `Animation.jsx`, `data.js`, semua `acts/*.jsx`, `acts/index.js` |
| `npm run build` (project penuh) | Belum dijalankan |
| Static audit | Selesai — dead-field audit, kata ganti orang/tanda tanya/emoji bersih |
| Preview manual | Belum dijalankan — perlu `npm run dev` → `/player/network-ports`, cek transisi antar-Act, cek thumbnail `bg` |
| Export | Belum dijalankan |