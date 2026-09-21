# Revisi 02 — Selaras Standar Act-Scene (1 Act = 1 File) + UPDATE 5/6 IntroHeaderMorphV1

| Item | Nilai |
|---|---|
| Content | 92 — Web Server |
| Diminta oleh | Adib, 2026-09-21 |
| Status | ✅ Dieksekusi (EKSEKUSI-03) — `acts/` dibuat, `Animation.jsx` dipangkas jadi murni komposisi, `bg`/`bgScenes` ditambahkan |
| Terakhir diupdate | 2026-09-21 |
| Referensi | `docs/standardizations/07-act-scene-pattern.md`, `src/shared/scene-ui/v1/IntroHeaderMorphV1.jsx` UPDATE 5/6, `revisi/2026-09-18-1213-revisi-01.md`, `revisi/README.md` |

## Ringkasan Permintaan

Menyelaraskan content 92 dengan standar baru yang sudah tuntas di 44-ssh:
(a) pola **"1 act = 1 file"** (`acts/`), (b) intro **`bg`/`bgScenes`**
(UPDATE 6), (c) **cek UPDATE 5** (glow + domain otomatis). Kode TIDAK diubah
— ini plan.

## 1. Audit Status Saat Ini

| Aspek | Fakta |
|---|---|
| Struktur render | **Inline SVG** di `Animation.jsx` (490 baris, 4 Act) — belum ada `acts/`. Kode aktual sudah **EKSEKUSI-02** (listener Nginx/Apache + ring HTTP/HTTPS, static tiles, upstream Node.js JSON) |
| Call-site intro | `category` **string tunggal** `'LINUX FUNDAMENTALS · SERVER & WEB'` + `titleFilter="url(#ws-glow)"` → glow eksplisit (UPDATE 5 ✓); **domain otomatis menempel** "...SERVER & WEB · ADIB-DEV.COM" cyan default |
| Prop `bg`/`bgScenes` | Belum ada |
| SFX_MAP | Ada (data.js:114) — build aman |
| Status | `draft`, `pinned`, priority 92 |
| **Drift dokumen** | revisi-01 file/README bilang "PLAN ONLY / Direncanakan" tapi kode sudah EKSEKUSI-02 → perlu sync |

## 2. Rencana Perubahan

### 2.1 Migrasi ke `acts/` (pola 07-act-scene-pattern)

- Buat `src/content/92-web-server/acts/`:
  - `common.jsx` — helper bersama (`withOrigin`, konstanta layout body-local
    inline, mis. `LISTENER_POS`).
  - `Act1SiapaMenerima.jsx` … `Act4ResponseKembali.jsx` (4 act EKSEKUSI-02).
    Pindahkan SVG per act **tanpa mengubah koordinat**.
  - `index.js` — `export const ACT_SCENES = [Act1…Act4]`.
- Ganti blok inline render dengan `<Act state={{...}} />` untuk
  `ACT_SCENES[phaseIdx]`.

### 2.2 Intro UPDATE 5 (domain) & 6 (bg/bgScenes)

- UPDATE 5: Lihat opsi domain di plan 81 (A: categorySegments konsisten seri
  48/60; B: terima default auto-append).
- UPDATE 6: tambahkan `bg={1}` + `bgScenes={ACT_SCENES}` + pastikan tiap Act
  punya mode summary.

### 2.3 Sync dokumen

- Update revisi-01 & README status → catat EKSEKUSI-02 yang sudah di kode.

## 3. Kontrak yang Tidak Berubah

- Canvas/body V1, body 732×965, `BODY_CX=366` — koordinat dipindah apa adanya.
- 4 Act EKSEKUSI-02 sama; anchor `LISTENER_POS` persisten.
- Timeline + reset loop, SFX tidak berubah.

## 4. Checklist Implementasi & Validasi

- [x] `acts/` dibuat (`common.jsx` + `Act1SiapaMenerima.jsx` … `Act4ResponseKembali.jsx` + `index.js`) + `ACT_SCENES` length == 4.
- [x] `Animation.jsx` dipangkas: seluruh komponen presentational (Chrome, ResponseCapsule, LogLine, TakeawayBar, dst) pindah ke `acts/`, koordinat tidak diubah.
- [x] `bg={4}` + `bgScenes={ACT_SCENES}` ditambahkan ke `IntroHeaderMorphV1` (Act 4 dipilih — paling representatif: browser+listener+kedua resource+log pembanding dua jalur).
- [x] UPDATE 5 (glow eksplisit `titleFilter`, domain otomatis) — tidak ada perubahan diperlukan, sudah sesuai kontrak.
- [ ] esbuild `Animation.jsx` 92 tetap bundle — **belum dijalankan dari sesi ini** (tidak ada akses shell/build tool langsung, hanya file read/write via Desktop Commander).
- [ ] SSR test baseline vs `bg` — belum dijalankan.
- [ ] Preview frame sebelum/sesudah → identik; tagline intro tidak overlap saat domain dobel-segmen — belum dijalankan (perlu browser manual).
- [ ] `npm run build` tidak menambah error baru — belum dijalankan.
- [x] Sync dokumen: revisi-01 & README status diperbarui mencatat EKSEKUSI-02/03.

## 5. Status Tes

| Pemeriksaan | Status |
|---|---|
| Compile | Belum dijalankan — perlu `npm run build` manual (di luar akses tool saat ini) |
| Static audit | Selesai — import/export `data.js` ↔ `acts/*` ↔ `Animation.jsx` diverifikasi cocok |
| Preview manual | Belum dijalankan |
| Export | Belum dijalankan |