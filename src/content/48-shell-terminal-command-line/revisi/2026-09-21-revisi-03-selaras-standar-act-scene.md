# Revisi 03 — Selaras Standar Act-Scene (1 Act = 1 File) + UPDATE 5/6 IntroHeaderMorphV1

| Item | Nilai |
|---|---|
| Content | 48 — Shell, Terminal, dan Command Line |
| Diminta oleh | Adib, 2026-09-21 |
| Status | 📝 PLAN ONLY — analisis & rencana, kode belum diubah |
| Terakhir diupdate | 2026-09-21 |
| Referensi | `docs/standardizations/07-act-scene-pattern.md` (baru), `src/shared/scene-ui/v1/IntroHeaderMorphV1.jsx` UPDATE 5/6, `_docs/SHELL_TERMINAL_COMMAND_LINE_PLAN.md`, `revisi/README.md` |

## Ringkasan Permintaan

Menyelaraskan content 48 dengan perubahan standar yang sudah tuntas di
44-ssh: (a) pola **"1 act = 1 file"** (`acts/ActN.jsx` pure presentational +
mode summary untuk thumbnail), (b) intro memakai **`bg`/`bgScenes`** (UPDATE 6)
supaya thumbnail menampilkan scene act, dan (c) **cek keselarasan UPDATE 5**
(glow + domain otomatis) pada call-site intro. Kode TIDAK diubah di dokumen
ini — ini plan; eksekusi terpisah.

## 1. Audit Status Saat Ini

| Aspek | Fakta |
|---|---|
| Struktur render | **Inline SVG raksasa** di `Animation.jsx` (942 baris, 6 Act) — belum ada `acts/` |
| Call-site intro | Sudah `categorySegments` + `INTRO_DOMAIN` + `titleFilter="url(#shell-glow)"` → **sudah selaras UPDATE 5** (glow eksplisit, domain eksplisit) |
| Prop `bg`/`bgScenes` | Belum ada → thumbnail intro belum menampilkan scene |
| SFX_MAP | Ada (data.js:160) — build aman |
| Status | `draft`, `pinned`, priority 48 |
| **Drift dokumen** | revisi-02 md & plan doc menulis "PLAN ONLY/EKSEKUSI-02 (622 baris)", tapi kode aktual 942 baris + `ACT3_CASE..ACT6_CASE` → **EKSEKUSI-03 sebenarnya sudah dieksekusi di kode**. Bagian icon (Bash logo via icons.json) revisi-02 **tidak** dieksekusi (tidak ada folder `icons/`). |

## 2. Rencana Perubahan

### 2.1 Migrasi ke `acts/` (pola 07-act-scene-pattern)

- Buat `src/content/48-shell-terminal-command-line/acts/`:
  - `common.jsx` — helper bersama (`getChannelStyle` analog, `ActChrome`-analog,
    `withOrigin`, konstanta layout body-local yang saat ini inline di Animation.jsx,
    mis. `TERMINAL_TOP`, `PTY_Y`, `SHELL_HUB_Y`, `FORK_Y`, `SYSTEM_Y`, `STAGE_TOP`).
  - `Act1EchoHome.jsx` … `Act6QuoteShield.jsx` (6 act dari EKSEKUSI-03) — pindahkan
    SVG per act **tanpa mengubah koordinat** (body-local tetap, origin dipakai via
    `withOrigin`).
  - `index.js` — `export const ACT_SCENES = [Act1…Act6]` (urutan = phaseIdx timeline).
- Ganti blok inline di render block Animation.jsx dengan
  `<Act state={{...}} />` untuk `ACT_SCENES[phaseIdx]`.
- Timeline GSAP, state machine, SFX **tetap di Animation.jsx** (tidak dipindah).

### 2.2 Intro `bg`/`bgScenes` (UPDATE 6)

- Tambahkan `bg={1}` (Act 1 `pwd` journey atau act yang paling representatif)
  + `bgScenes={ACT_SCENES}` di call-site `<IntroHeaderMorphV1>`.
- Pastikan tiap `ActN` punya mode summary (`SUMMARY_STAGE` + posisi akhir) agar
  scene ter-render benar sebagai background thumbnail.
- Koordinat default `bgOrigin` = `layout.body` — scene body-local tetap masuk
  canvas penuh.

### 2.3 UPDATE 5 — tidak perlu perubahan call-site

Call-site sudah eksplisit (glow + domain via `categorySegments`). Tidak ada
`domain="ADIB-DEV.COM"` otomatis ganda karena `INTRO_DOMAIN` sudah di
`categorySegments`. Cukup dipertahankan.

### 2.4 Sync dokumen (opsional tapi disarankan)

- Update `revisi/README.md` status revisi-02 (bukan "PLAN ONLY" lagi untuk
  bagian EKSEKUSI-03 yang sudah di kode).
- Update `_docs/SHELL_TERMINAL_COMMAND_LINE_PLAN.md` log EKSEKUSI-03.
- Keputusan icon revisi-02: tetap belum dieksekusi; tidak menghalangi revisi
  03 ini (migrasi act-scene murni struktural, bukan perubahan asset).

## 3. Kontrak yang Tidak Berubah

- **Canvas/body**: layout V1, body 732×965, `BODY_CX=366` — koordinat dipindah
  apa adanya, zero visual diff.
- **Act & storytelling**: 6 act EKSEKUSI-03 tetap sama; migrasi murni
  reorganisasi kode.
- **Timeline & loop reset**: tidak disentuh — garda `tl.add(() => {...}, t)`
  reset state tetap di Animation.jsx.
- **SFX**: call `sfxLoader.transition` tidak berubah.

## 4. Checklist Implementasi & Validasi

- [ ] `acts/` dibuat + `ACT_SCENES` length == 6 (phase count).
- [ ] esbuild `src/content/48-shell-terminal-command-line/Animation.jsx` tetap bundle.
- [ ] SSR/static render test baseline vs `bg` (vignette muncul, fade-out saat morph).
- [ ] Preview frame vs sebelum migrasi → struktur live identik.
- [ ] `npm run build` tidak menambah error baru.
- [ ] README revisi di-update.

## 5. Status Tes

| Pemeriksaan | Status |
|---|---|
| Compile | Belum dijalankan — PLAN ONLY (belum ada perubahan kode) |
| Static audit | Selesai untuk plan ini |
| Preview manual | Belum dijalankan |
| Export | Belum dijalankan |