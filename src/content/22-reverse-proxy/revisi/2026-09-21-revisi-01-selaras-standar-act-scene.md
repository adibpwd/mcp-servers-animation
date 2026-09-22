# Revisi 01 — Selaras Standar Act-Scene (1 Act = 1 File) + UPDATE 5/6 IntroHeaderMorphV1

| Item | Nilai |
|---|---|
| Content | 93 — Reverse Proxy |
| Diminta oleh | Adib, 2026-09-21 |
| Status | ✅ IMPLEMENTED — kode dieksekusi setelah revisi 02; verifikasi manual pemilik belum |
| Terakhir diupdate | 2026-09-21 |
| Referensi | `docs/standardizations/07-act-scene-pattern.md`, `src/shared/scene-ui/v1/IntroHeaderMorphV1.jsx` UPDATE 5/6, `_docs/REVERSE_PROXY_PLAN.md` (status "✅ DONE"), `revisi/README.md` (baru) |

## Ringkasan Permintaan

Menyelaraskan content 93 dengan standar baru yang sudah tuntas di 44-ssh:
(a) pola **"1 act = 1 file"** (`acts/`), (b) intro **`bg`/`bgScenes`**
(UPDATE 6), (c) **cek UPDATE 5** (glow + domain otomatis). Kode TIDAK diubah
— ini plan.

## 1. Audit Status Saat Ini

| Aspek | Fakta |
|---|---|
| Struktur render | **Inline SVG** di `Animation.jsx` (540 baris, 4 Act: Satu Pintu Publik → Proxy Memilih Tujuan → Request Diteruskan → Response Kembali) — belum ada `acts/`. Header tanpa banner EKSEKUSI (cukup ringkas) |
| Call-site intro | `categorySegments=[{ label: INTRO_CATEGORY, color: COLORS.MUTED }]`, `titleSegments`, `subtitle` — **TANPA** `titleFilter`/`titleGlow`/`domain` → **mengandalkan default UPDATE 5 penuh** (auto glow + auto ` · ADIB-DEV.COM` cyan setelah "LINUX FUNDAMENTALS") |
| Prop `bg`/`bgScenes` | Belum ada |
| SFX_MAP | Ada (data.js:62) — build aman |
| Status | `draft`, `pinned`, priority 93 — **plan doc sudah "✅ DONE" tapi metadata masih draft** (belum preview/export validasi) |

## 2. Rencana Perubahan

### 2.1 Migrasi ke `acts/` (pola 07-act-scene-pattern)

- Buat `src/content/93-reverse-proxy/acts/`:
  - `common.jsx` — helper bersama (`withOrigin`, konstanta layout body-local
    inline).
  - `Act1SatuPintuPublik.jsx` … `Act4ResponseKembali.jsx` (4 act).
  - `index.js` — `export const ACT_SCENES = [Act1…Act4]`.
- Ganti blok inline render dengan `<Act state={{...}} />` untuk
  `ACT_SCENES[phaseIdx]`.

### 2.2 Intro UPDATE 5 & 6

- UPDATE 5: call-site sudah memakai default komponen (auto glow + auto domain).
  Tidak ada yang wajib diubah; jika ingin warna domain konsisten seri, ikuti
  Opsi A (categorySegments + INTRO_DOMAIN) di plan 81.
- UPDATE 6: tambahkan `bg={1}` + `bgScenes={ACT_SCENES}` + mode summary di tiap
  Act.

### 2.3 Status plan/metadata

- Plan doc sudah DONE — progress validation gate (preview manual + export MP4)
  belum: setelah validasi, status metadata bisa naik draft → (jalankan sesuai
  proses yang berlaku). Documentasikan di revisi ini sebagai catatan.

## 3. Kontrak yang Tidak Berubah

- Canvas/body V1, body 732×965, `BODY_CX=366` — koordinat dipindah apa adanya.
- 4 Act sama; timeline + reset loop, SFX tidak berubah.

## 4. Checklist Implementasi & Validasi

- [x] `acts/` dibuat + `ACT_SCENES` length == 4 (4 == `PHASES.length`).
- [x] esbuild `Animation.jsx` 93 tetap bundle.
- [x] SSR test baseline vs `bg` (21 pemeriksaan lulus, lihat §6).
- [x] Preview frame sebelum/sesudah → identik (11 frame konten identik pixel-per-pixel; 2 frame intro berbeda sesuai desain karena bg).
- [x] `npm run build` tidak menambah error baru (exit 0, tanpa pesan untuk 93).
- [x] Tidak ada `A(/T(/O(` inline tersisa di `Animation.jsx`.
- [ ] Preview manual dan export MP4 oleh pemilik project.

## 5. Status Tes

| Pemeriksaan | Status |
|---|---|
| Compile (esbuild) | Lulus |
| `npm run build` | Lulus (exit 0) |
| SSR (intro tanpa/dengan `bg`, `bg` di luar rentang 0/9/-1/1.5, `bg` tanpa `bgScenes`, `progress=1`, tiap Act tanpa props, `origin`) | 21/21 lulus |
| Frame capture headless sebelum vs sesudah migrasi (13 waktu) | 11 identik; t=0,2 dan intro loop ke-2 berbeda karena bg |
| Preview manual | Belum |
| Export MP4 | Belum |

## 6. Hasil Eksekusi

- `acts/common.jsx` (komponen presentational hasil ekstraksi programatik dari `Animation.jsx`, `ActFrame` dengan slot `under`/`over`/`top` agar urutan layer tetap, `withOrigin`, `resolveState`), `Act1SatuPintuPublik` … `Act4ResponseKembali`, dan `index.js` (`ACT_SCENES`).
- Tiap Act punya `SUMMARY_STATE` (momen akhir act). `INITIAL_VIS/ACTORS/TXT` dan `INTRO_BG_ACT` dipindah ke `data.js`; koordinat body-local tidak berubah.
- `Animation.jsx`: 432 → 267 baris, memakai `ACT_SCENES[phaseIdx]` dan `bg={INTRO_BG_ACT}` (= 1, sesuai rencana) + `bgScenes={ACT_SCENES}`.
- UPDATE 5 (glow + domain otomatis): dipakai apa adanya lewat default komponen; tidak ada perubahan.
- Catatan visual: summary Act 1 menaruh titik scan kuning di dekat tagline. Alternatif tanpa ubah kode lain: `INTRO_BG_ACT = 2` (Act 2 memuat chip rule dan cabang menyala, lebih mewakili isi).
