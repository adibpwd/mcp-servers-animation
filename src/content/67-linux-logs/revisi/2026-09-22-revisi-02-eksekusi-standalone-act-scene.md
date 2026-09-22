# Revisi 02 — Eksekusi Standalone + Refactor Act-Scene Pattern

Status: ✅ SUDAH DIEKSEKUSI (2026-09-22) — compile + export lolos, visual QA lolos.

Sumber: instruksi eksplisit Rudy untuk override `_docs/LINUX_LOGS_MERGE_PLAN.md`
(yang tadinya minta konten ini digabung ke Act 5-6 Content 65) DAN mematuhi
kontrak yang dikunci di `2026-09-21-revisi-01-status-merge-65-act-scene.md`
(pola act-scene wajib + `bg`/`bgScenes` UPDATE 6) — lihat juga
`_docs/LINUX_LOGS_STANDALONE_PLAN.md`.

## Yang dikerjakan

### Build awal (siang, sebelum revisi-01 ditemukan)
- [x] `manifest.js`, `data.js`, `Animation.jsx` (versi monolitik, scene inline)
      — 6 Act: Dua Jalur, journald, Log Files, Rotasi & Retensi, Terpusat &
      Audit, Rekonstruksi
- [x] `metadata.json` disinkronkan (title, subtitle, color, tags) —
      resolver baca `metadata.json` langsung (`resolveTopic.js`), bukan
      `manifest.js` (`registry.js`/`content-db.json` sudah tidak ada di
      project ini)
- [x] Compile check + export test MP4 — 1689/1689 frame, 56.30s, visual QA
      7 titik lolos

### Refactor act-scene pattern (setelah revisi-01 ditemukan)
- [x] `acts/common.jsx` — Icon, FlowLine, IconCaption, PathLabel, wrapText,
      Stamp, `SceneChrome` (seluruh render 7 stasiun + 8 garis + closing,
      state-driven, PURE presentational — berbeda dari pola 44-ssh karena
      scene ini peta persisten, bukan konten beda per-Act)
- [x] `acts/Act1DuaJalur.jsx` .. `Act6Rekonstruksi.jsx` — tiap file punya
      `SUMMARY_STAGE` + `SUMMARY_STATE` progresif (Act N mewarisi state
      Act 1..N-1, sesuai bagaimana scene ini berjalan live)
- [x] `acts/index.js` — export `ACT_SCENES`
- [x] `Animation.jsx` ditulis ulang — murni komposisi (GSAP timeline + state
      hooks), render delegasi ke `ACT_SCENES[phaseIdx]`
- [x] `IntroHeaderMorphV1` diberi `bg={6}` + `bgScenes={ACT_SCENES}` (UPDATE
      6) — intro sekarang menampilkan Act 6 (state akhir, paling lengkap)
      sebagai background hero, redup di belakang judul
- [x] Compile check ulang — 0 error
- [x] Export test MP4 ulang — 1689/1689 frame, 56.30s penuh, visual QA
      (intro dengan bg baru, Act 4, Act 6) lolos — hasil identik dengan versi
      monolitik sebelumnya (tidak ada regresi), plus fitur bg baru terkonfirmasi
      jalan

## Belum dikerjakan
- [ ] Preview manual langsung oleh Rudy di browser
- [ ] Review konten (state contract, warna, durasi per-Act, akurasi istilah
      teknis journald/syslog/rsyslog)
