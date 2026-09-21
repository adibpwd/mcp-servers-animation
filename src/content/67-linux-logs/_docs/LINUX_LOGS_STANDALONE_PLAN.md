# Plan — Content 67 (linux-logs), standalone

Status: **OVERRIDE keputusan merge** di `LINUX_LOGS_MERGE_PLAN.md` (2026-09-2x),
atas instruksi eksplisit Rudy. Topic ini dibuat berdiri sendiri, terpisah dari
Act 5-6 Topic 65 (systemd) yang sudah lebih dulu memuat materi journal secara
kontekstual (di dalam cerita systemd). Topic 67 ini adalah materi log secara umum
(bukan spesifik systemd), 6 Act penuh, mencakup semua 8 trigger point yang ada
di plan merge lama.

## Identity Series
- Kategori: `Linux Fundamentals` (sama seperti Topic 65)
- Warna utama: `#2DD4BF` (teal, dipakai untuk journald sebagai hub, beda dari
  systemd yang biru `#38BDF8` supaya beda identitas visual)
- Header: `LINUX FUNDAMENTALS · ADIB-DEV.COM` / **LOG SYSTEM** / "Jejak yang tercatat, kalau tahu cara bacanya"

## Scene Shell
- Scene shell: `scene-ui V1`
- Layout preset: `DEFAULT_LAYOUT_V1`
- Intro component: `IntroHeaderMorphV1`
- Act navigator: `ActBadgeNavigatorV1`
- Content origin: `ContentBodyV1`
- Alasan opt-out: — (pakai V1 penuh, tidak custom)

## Struktur 6 Act (mencakup 8 trigger point plan lama)

| Act | Judul | Trigger point tercakup |
|---|---|---|
| 1 | Dari Event ke Dua Jalur | journald vs syslog (perkenalan) |
| 2 | journald: Terstruktur & Bisa Difilter | journald, structured fields |
| 3 | Log Files: Teks di /var/log | log files |
| 4 | Rotasi & Retensi: Log Tidak Abadi | rotation/retention |
| 5 | Terpusat & Audit Trail | centralized logging, audit logs |
| 6 | Rekonstruksi: Ikuti Jejak Waktu (payoff) | incident timeline, privacy (closing stamp) |

## Peta Stasiun (7, reuse koordinat Topic 65 yang sudah tervalidasi no-overlap)
- `rawEvent` (145,135) — app/process menulis event, sebelum masuk log manapun
- `logFiles` (587,135) — /var/log/syslog, teks polos
- `journald` (366,330, hub) — struktur, fields PRIORITY/_PID/_SYSTEMD_UNIT/MESSAGE
- `remoteAudit` (624,420) — forward ke server pusat, jadi audit trail
- `rotation` (165,590) — SystemMaxUse (journald) & logrotate (file teks)
- `timeline` (540,600, persist) — tabel 7 entri rekonstruksi insiden
- `diagnosis` (366,780, payoff) — 3 langkah: Timestamp → Source → Konteks

## State Contract (ringkas)
- `journaldFieldsShown`: bool — field terstruktur journald muncul di Act 2
- `logFilePreviewShown`: bool — preview baris teks muncul di Act 3
- `rotationApplied`: bool → retensi diterapkan (Act 4)
- `auditForwarded`: bool → forward ke server pusat (Act 5)
- `timelineCount`: 0..7 — jumlah entri timeline yang sudah muncul
- `diagnosisStep`: -1..2 — langkah rekonstruksi aktif (Act 6)

## Validation Gate
- [x] Compile check (`npx esbuild --bundle --loader:.jsx=jsx --jsx=automatic`) — 0 error
- [x] Preview manual `/preview/linux-logs` — 200 OK (belum direview visual langsung oleh Rudy di browser)
- [x] Export test MP4 (2026-09-22) — 1689/1689 frame tertangkap tanpa gap, durasi
      56.30s penuh (match), 1.13 MB. Visual QA spot-check 7 titik (semua 6 Act +
      closing) via ffmpeg frame extraction: semua sesuai storyboard —
      journald fields (Act 2), log files preview + GREP-ABLE (Act 3),
      dua badge rotasi bertahap (Act 4), audit forward + 7 entri timeline
      (Act 5), 3-langkah rekonstruksi + closing stamp privasi & waktu (Act 6).
- [x] `metadata.json` disinkronkan dengan `manifest.js`/`data.js` (title, subtitle,
      color, tags) — resolver hanya baca `metadata.json` (registry.js &
      content-db.json sudah dihapus dari project, lihat catatan arsitektur di
      bawah)
- [ ] Review konten oleh Rudy (state contract, warna, durasi per-Act, akurasi
      teknis istilah journald/syslog) — masih pending

## Catatan Arsitektur (penting untuk sesi berikutnya)
- `registry.js` dan `content-db.json` yang disebut di dokumen standar
  (`02-topic-contract-scene-shell.md`) dan di memori project **sudah tidak ada**
  di project ini. Sistem sekarang pakai `src/content/resolveTopic.js` yang
  scan `metadata.json` tiap folder topic langsung (`import.meta.glob`) —
  **bukan** `manifest.js`. `manifest.js` yang dibuat di sini tetap mengikuti
  kontrak standar (untuk konsistensi & kalau suatu saat dipakai lagi), tapi
  yang benar-benar dibaca sistem saat ini adalah `metadata.json`.
- Dokumen standar juga sudah direstrukturisasi: nama file berubah dari yang
  tercatat di memori lama (`03-tutorial-buat-topic-baru.md` dll) menjadi
  `01-architecture-runtime.md`, `02-topic-contract-scene-shell.md`,
  `03-planning-storytelling-quality-gate.md`, `04-motion-gsap-reference.md`,
  `05-svg-layout-asset-pipeline.md`, `06-audio-sfx.md`, `07-act-scene-pattern.md`.
