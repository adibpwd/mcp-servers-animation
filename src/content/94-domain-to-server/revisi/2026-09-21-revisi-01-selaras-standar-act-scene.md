# Revisi 01 — Selaras Standar Act-Scene (1 Act = 1 File) + UPDATE 5/6 IntroHeaderMorphV1

| Item | Nilai |
|---|---|
| Content | 94 — Domain to Server |
| Diminta oleh | Adib, 2026-09-21 |
| Status | 🚧 IN PROGRESS — kode sudah dieksekusi (acts/, ACT_SCENES, bg/bgScenes, esbuild lolos); preview manual & export belum diverifikasi |
| Terakhir diupdate | 2026-09-22 |
| Referensi | `docs/standardizations/07-act-scene-pattern.md`, `src/shared/scene-ui/v1/IntroHeaderMorphV1.jsx` UPDATE 5/6, `_docs/DOMAIN_TO_SERVER_PLAN.md` (status "🚧 IN PROGRESS"), `revisi/README.md` (baru) |

## Ringkasan Permintaan

Menyelaraskan content 94 dengan standar baru yang sudah tuntas di 44-ssh:
(a) pola **"1 act = 1 file"** (`acts/`), (b) intro **`bg`/`bgScenes`**
(UPDATE 6), (c) **cek UPDATE 5** (glow + domain otomatis). Kode TIDAK diubah
— ini plan.

## 1. Audit Status Saat Ini

| Aspek | Fakta |
|---|---|
| Struktur render | **Inline SVG** di `Animation.jsx` (836 baris, 4 Act: resolve domain → connect ke edge → proxy ke app → return page, packet continuity). Belum ada `acts/` |
| Call-site intro | `category={INTRO_CATEGORY}` **string tunggal** `'LINUX FUNDAMENTALS · SERVER & WEB'`, `visible`, `progress={morphP}`, `titleSegments`, `subtitle` — **TANPA** `titleFilter`/`titleGlow`/`domain` → **default UPDATE 5 penuh** (auto glow + auto ` · ADIB-DEV.COM` cyan). Call-site sudah di-normalisasi di commit `b89d65a` (hapus `topicColor`/`morphProgress` lama, perbaiki shape `titleSegments` dari `text`→`label`) |
| Prop `bg`/`bgScenes` | Belum ada |
| SFX_MAP | Ada (data.js:112) — build aman |
| Status | `draft`, `pinned`, priority 94 — plan doc 🚧 IN PROGRESS (4 Act dieksekusi, belum lolos validation gate preview/export manual) |

## 2. Rencana Perubahan

### 2.1 Migrasi ke `acts/` (pola 07-act-scene-pattern)

- Buat `src/content/94-domain-to-server/acts/`:
  - `common.jsx` — helper bersama (`withOrigin`, konstanta layout body-local
    inline; continuity packet line).
  - `Act1ResolveDomain.jsx` … `Act4ReturnPage.jsx` (4 act). Pindahkan SVG per
    act **tanpa mengubah koordinat**.
  - `index.js` — `export const ACT_SCENES = [Act1…Act4]`.
- Ganti blok inline render dengan `<Act state={{...}} />` untuk
  `ACT_SCENES[phaseIdx]`.

### 2.2 Intro UPDATE 5 & 6

- UPDATE 5: call-site sudah memakai shape prop yang benar (hasil commit
  `b89d65a`) + default komponen (glow + domain auto). Tidak wajib diubah;
  warna domain konsisten seri → ikuti Opsi A plan 81.
- UPDATE 6: tambahkan `bg={1}` + `bgScenes={ACT_SCENES}` + mode summary tiap
  Act.

### 2.3 Status plan/metadata

- IN PROGRESS — setelah validation gate lolos, catat di revisi ini.

## 3. Kontrak yang Tidak Berubah

- Canvas/body V1, body 732×965, `BODY_CX=366` — koordinat dipindah apa adanya.
- 4 Act + packet continuity tidak berubah; timeline + reset loop, SFX tetap.

## 4. Checklist Implementasi & Validasi

- [x] `acts/` dibuat + `ACT_SCENES` length == 4.
- [x] esbuild `Animation.jsx` 94 tetap bundle — lolos 2026-09-22 (2 kali,
      sebelum dan sesudah swap render ke `ACT_SCENES[phaseIdx]`).
- [ ] SSR test baseline vs `bg` — belum dijalankan, perlu dev server.
- [ ] Preview frame sebelum/sesudah → identik — belum diverifikasi visual,
      hanya diverifikasi lewat kesamaan logika boolean/posisi per state
      (audit statis kode, bukan screenshot).
- [ ] `npm run build` tidak menambah error baru — belum dijalankan build
      penuh (hanya esbuild scoped ke 1 entry file).

## 5. Status Tes

| Pemeriksaan | Status |
|---|---|
| Compile | Lolos (esbuild scoped, 2026-09-22) |
| Static audit | Selesai — 0 sisa referensi ke komponen lama di `Animation.jsx` |
| Preview manual | Belum dicatat — tidak ada akses dev server/browser dari sesi ini |
| Export | Belum dicatat — sama seperti di atas |