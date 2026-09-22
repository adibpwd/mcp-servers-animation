# Revisi 02 — Selaras Standar Act-Scene (1 Act = 1 File) + UPDATE 5/6 IntroHeaderMorphV1

| Item | Nilai |
|---|---|
| Content | 60 — Linux Processes |
| Diminta oleh | Adib, 2026-09-21 |
| Status | 🟡 DIEKSEKUSI KE KODE (2026-09-21) — `acts/` dibuat, `Animation.jsx` jadi murni komposisi, `bg=4`/`bgScenes` ditambahkan. BELUM: SSR/preview manual, export MP4. |
| Terakhir diupdate | 2026-09-21 |
| Referensi | `docs/standardizations/07-act-scene-pattern.md` (baru), `src/shared/scene-ui/v1/IntroHeaderMorphV1.jsx` UPDATE 5/6, `_docs/LINUX_PROCESSES_PLAN.md`, `revisi/README.md` |

## Ringkasan Permintaan

Menyelaraskan content 60 dengan perubahan standar yang sudah tuntas di
44-ssh: (a) pola **"1 act = 1 file"** (`acts/ActN.jsx` pure presentational +
mode summary untuk thumbnail), (b) intro memakai **`bg`/`bgScenes`** (UPDATE 6),
dan (c) **cek keselarasan UPDATE 5** (glow + domain otomatis). Kode TIDAK
diubah — ini plan.

## 1. Audit Status Saat Ini

| Aspek | Fakta |
|---|---|
| Struktur render | **Inline SVG** di `Animation.jsx` (465 baris, 4 Act) — belum ada `acts/` |
| Call-site intro | Sudah `categorySegments` (dengan `INTRO_DOMAIN` warna `COLORS.PROGRAM`) + `titleFilter="url(#linux-processes-glow)"` → **sudah selaras UPDATE 5** (glow + domain eksplisit) |
| Prop `bg`/`bgScenes` | Belum ada → thumbnail intro belum menampilkan scene |
| SFX_MAP | Ada (data.js:87) — build aman |
| Status | `draft`, `pinned`, priority 60 |
| Revisi-01 | `2026-09-19-revisi-01-icon-hapus-bubble-perapat-motion.md` — status README: 🟡 **Dieksekusi ke kode**, menunggu generate 5 PNG icon asli, preview manual, export MP4. Folder `icons/` ada (icons.json, loader.js `ICONS = {}` masih kosong). |

## 2. Rencana Perubahan

### 2.1 Migrasi ke `acts/` (pola 07-act-scene-pattern)

- Buat `src/content/60-linux-processes/acts/`:
  - `common.jsx` — helper bersama (`withOrigin`, konstanta layout body-local
    yang saat ini inline).
  - `Act1FileJadiProcess.jsx` … `Act4LihatDariTerminal.jsx` (4 act dari
    header: file jadi process → setiap process punya PID → memakai resource →
    lihat dari terminal `ps`). Pindahkan SVG per act **tanpa mengubah koordinat**.
  - `index.js` — `export const ACT_SCENES = [Act1…Act4]`.
- Ganti blok inline render dengan `<Act state={{...}} />` untuk
  `ACT_SCENES[phaseIdx]`.

### 2.2 Intro `bg`/`bgScenes` (UPDATE 6)

- Tambahkan `bg={1}` + `bgScenes={ACT_SCENES}` di call-site intro.
- Pastikan tiap `ActN` punya mode summary (`SUMMARY_STAGE` + posisi akhir).

### 2.3 UPDATE 5 — tidak perlu perubahan call-site

Glow + domain sudah eksplisit via `categorySegments` + `titleFilter`.

### 2.4 Catatan paralel revisi-01 (icon bubble)

- Revisi-01 terkait asset icon (5 PNG) dan perapatan motion **berjalan
  paralel, tidak bertabrakan** dengan migrasi act-scene (migrasi murni
  struktural). Urutan eksekusi disarankan: selesaikan revisi-01 asset dulu
  (icons.json/loader) ATAU gabung — tidak memengaruhi isi `acts/`.
- Saat migrasi, pastikan 5 icon yang direncanakan (default-icon.png +
  icons lain) tetap direferensikan lewat pemanggilan yang sudah ada.

## 3. Kontrak yang Tidak Berubah

- Canvas/body V1, body 732×965, `BODY_CX=366` — koordinat dipindah apa adanya.
- 4 Act sama; timeline GSAP + reset state tetap di Animation.jsx.
- SFX `sfxLoader.transition` tidak berubah.

## 4. Checklist Implementasi & Validasi

- [x] `acts/` dibuat + `ACT_SCENES` length == 4 (Act1FileJadiProcess,
      Act2SetiapProcessPunyaPid, Act3MemakaiResource, Act4LihatDariTerminal).
- [x] `common.jsx` berisi: layout constants (dipindah dari Animation.jsx),
      helper `pose`/`tos`/`oop`/`withOrigin`, SEMUA komponen presentational
      (LocalCaptionBadge, ProgramFileCard, LaunchCursorIcon, WarningLoadIcon,
      ProcessCard, ResourceMeter, PidChip, TerminalPsPanel), + `SceneChrome`
      (caption + program-file + 3 process card — elemen yang SELALU tampil
      lintas Act, dipanggil dari setiap ActN.jsx, pola serupa `ActChrome`
      44-ssh) dan `ResourceMetersBlock` (dipakai Act3 & Act4).
- [x] `Animation.jsx` diubah jadi murni komposisi: timeline GSAP + state +
      `<Act state={sceneState} />` (`Act = ACT_SCENES[phaseIdx]`) — TIDAK
      ada lagi definisi komponen SVG presentational di file ini.
- [x] `bg={4}` + `bgScenes={ACT_SCENES}` ditambahkan di call-site intro
      (Act 4 dipilih karena paling representasi: tabel `ps` + baris PID 1042
      disorot + seluruh resource meter — "momen akhir" yang paling
      menunjukkan isi konten, sama alasan 44-ssh pilih Act 2).
- [x] esbuild `src/content/60-linux-processes/Animation.jsx` — syntax check
      DAN bundle-resolution check (`--bundle`, resolve semua import termasuk
      `acts/index.js` → 4 ActN.jsx → `common.jsx` → icon PNG) — lolos.
- [x] Tidak ada definisi komponen SVG inline tersisa di `Animation.jsx`
      (diverifikasi manual — file sekarang isinya cuma state+GSAP+render tipis).
- [x] `npm run build` — error yang muncul PRE-EXISTING di topic lain
      (`81-network-interface/Animation.jsx` unexpected-end-of-file,
      sebelumnya juga `65-systemd/Animation.jsx` unclosed JSX), TIDAK
      terkait modul ini. Tidak disentuh (bukan scope task).
- [ ] SSR render test baseline vs `bg=4` (vignette muncul, fade-out saat
      morph) — BELUM bisa dijalankan dari sesi ini (butuh browser/preview).
- [ ] Tiap Act render non-kosong tanpa props (mode summary) — SUMMARY_STATE
      sudah ditulis utuh untuk 4 Act (lihat kode), TAPI belum diverifikasi
      visual bahwa hasil render summary benar-benar tampak "hidup" (bukan
      cuma tidak crash).
- [ ] Preview manual `/player/linux-processes`, export MP4 — belum.

## 5. Status Tes

| Pemeriksaan | Status |
|---|---|
| Compile (esbuild syntax + bundle-resolution) | ✅ Lolos |
| `npm run build` (full project) | ⚠️ Gagal karena topic LAIN yang pre-existing broken (81-network-interface, 65-systemd) — tidak terkait modul ini |
| Static audit (struktur file sesuai kontrak §2) | ✅ Selesai |
| SSR render test (`bg=4` vignette, out-of-range, progress=1) | ❌ Belum dijalankan |
| Preview manual | ❌ Belum dijalankan |
| Export | ❌ Belum dijalankan |

## 6. Catatan Eksekusi (2026-09-21)

- Konten topic ini KUMULATIF (card/PID/resource menumpuk lintas Act, bukan
  4 diagram lepas seperti 44-ssh) — jadi realisasi "1 act = 1 file" di sini
  bukan "tiap Act = scene yang beda total", tapi: elemen yang SELALU ada
  (`SceneChrome`) dipanggil dari SETIAP ActN.jsx, dan elemen yang cuma
  relevan di Act tertentu (launch-cursor Act1, clone/pid-reuse chip Act2,
  resource meter+warning Act3, terminal Act4) ditaruh di file Act-nya
  masing-masing. Ini konsisten dengan pola `ActChrome` 44-ssh (chrome
  client/server/channel juga dipanggil dari kelima Act 44-ssh).
- SUMMARY_STATE tiap Act ditulis manual berdasar nilai akhir timeline yang
  sudah ada di `Animation.jsx` (mis. Act3 summary pakai `BROWSER_SPIKE`
  sebagai resourceVal browser, bukan nilai awal) — BELUM di-cross-check
  terhadap render nyata, jadi ada risiko kecil salah ketik/nilai meleset
  yang cuma kelihatan saat preview visual.
- `ResourceMetersBlock` opacity: sengaja dibedakan live (`s.pop` ada →
  ikuti `oop(pop,'resourcePanels')`, termasuk saat legitimately 0 di awal
  animasi) vs summary (`s.pop` tidak ada → default opacity 1) — pakai
  `s.pop ? oop(...) : 1`, BUKAN `oop(...) || 1` (yang tadinya salah karena
  bisa nge-override opacity 0 yang sah saat popIn baru mulai).
- Tidak ada perubahan pada `data.js`, `SFX_MAP`, `scripts/export-lib.js`,
  atau `icons/*` — revisi ini murni struktural (pemindahan kode), timeline
  dan semua timestamp SFX dari revisi-01 tetap sama persis.

**Status:** 🟡 DIEKSEKUSI KE KODE, 2026-09-21 — menunggu SSR/preview
manual & export MP4 (sama seperti revisi-01) sebelum dianggap selesai.