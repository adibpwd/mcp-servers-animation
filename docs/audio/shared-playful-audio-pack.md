# Manifest — Shared Playful Audio Pack

> Dibuat sesuai `docs/plan/PLAN-SHARED-PLAYFUL-AUDIO-PACK.md` §5.6.
> Semua asset bersumber dari Mixkit Free Sound Effects, lisensi Mixkit
> License (https://mixkit.co/license/#sfxFree) — gratis untuk proyek
> komersial/non-komersial, tanpa kewajiban atribusi.
>
> Baseline pembanding loudness (existing, diukur ffmpeg volumedetect):
> ui/pop, ui/tick, success/ding, success/shimmer ≈ **-18.1 dB mean**.
>
> Diproses: trim ke window energi tertinggi → fade in/out 10-20ms →
> convert WAV 44.1kHz/16-bit stereo → gain disesuaikan MIN(target mean,
> batas aman peak ≤ -1.0 dBFS) agar tidak clipping (bukan boost buta ke
> target tanpa syarat, sesuai guardrail §5 plan).

## Tabel Provenance

| File | Folder | Sumber Mixkit (judul, ID) | URL preview | Trim window (source) | Durasi final | Loudness final (mean / max) | Catatan |
|---|---|---|---|---|---|---|---|
| paper-send.wav | transitions | "Papers blowing in the windstorm" (2653) | https://assets.mixkit.co/active_storage/sfx/2653/2653-preview.mp3 | 1.222s–1.672s | 0.45s | -18.0 dB / -6.2 dB | Kandidat awal (Paper slide #1530) dibuang: crest factor terlalu tinggi (~28dB), mean tetap -29dB walau sudah di-gain maksimal aman → melanggar guardrail "jangan boost source yang salah". |
| paper-arrive.wav | ui | "Dry pop up notification alert" (2356) | https://assets.mixkit.co/active_storage/sfx/2356/2356-preview.mp3 | 0.00s–0.30s (nyaris full clip) | 0.30s | -18.1 dB / -1.0 dB | Cocok dengan baseline hampir presisi tanpa trik. |
| paper-open.wav | ui | "Quick paper crumple sound" (2996) | https://assets.mixkit.co/active_storage/sfx/2996/2996-preview.mp3 | 0.253s–0.453s | 0.20s | -20.1 dB / -1.0 dB | Kandidat awal (Paper crinkle #2385) & alternatif lain dibuang karena crest factor tinggi; ini tetap 2dB di bawah baseline tapi sudah maksimal aman tanpa clipping. |
| approval-stamp.wav | success | "Achievement bell" (600) | https://assets.mixkit.co/active_storage/sfx/600/600-preview.mp3 | 0.004s–0.504s | 0.50s | -18.0 dB / -3.5 dB | Tidak ada tag "stamp" gratis di Mixkit; dipilih bell hangat pendek sebagai pengganti terdekat sesuai arah desain §4 (warm). File sebelumnya tidak ada sama sekali di disk. |
| key-turn.wav | impacts | "Door key in door lock" (2842) | https://assets.mixkit.co/active_storage/sfx/2842/2842-preview.mp3 | 0.353s–0.603s | 0.25s | -18.0 dB / -2.5 dB | Match literal dengan konsep "kunci diputar". |
| bubble-pop.wav | ui | "Cartoon bubbles pop" (729) | https://assets.mixkit.co/active_storage/sfx/729/729-preview.mp3 | 0.249s–0.499s | 0.25s | -18.0 dB / -3.7 dB | — |
| soft-deny.wav | warnings | "Sci-Fi reject notification" (896) | https://assets.mixkit.co/active_storage/sfx/896/896-preview.mp3 | 0.006s–0.356s | 0.35s | -20.0 dB / -1.2 dB | Sengaja target -20dB (bukan -18dB) — sesuai arah desain §4 "penolakan lembut, bukan alarm kasar". |
| policy-scan.wav | sfx | "Data scaner" (2847) | https://assets.mixkit.co/active_storage/sfx/2847/2847-preview.mp3 | 0.310s–0.760s | 0.45s | -18.0 dB / -3.8 dB | — |

## Riwayat Koreksi Penting

**2026-09-13** — Saat eksekusi dimulai, ditemukan 7 dari 8 file kandidat
sudah ada secara fisik di `public/audio/` dari sesi sebelumnya, tapi:
- Tidak ada catatan sumber/URL/lisensi sama sekali di manapun (melanggar
  §5 plan yang mewajibkan pencatatan **sebelum** file dipakai).
- 4 dari 7 file (`paper-send`, `paper-arrive`, `paper-open`, `key-turn`)
  loudness-nya di bawah baseline (-21 sampai -29 dB vs -18.1 dB) — belum
  lolos §5 langkah 3-4.
- `approval-stamp.wav` belum ada sama sekali.
- SFX_MAP di topic manapun (termasuk 19-register) **belum benar-benar
  wired** ke kandidat ini — comment lama di `19-register/data.js` masih
  bilang "belum ada file-nya", padahal file sudah ada tapi tidak dipakai.

Keputusan: seluruh 8 file di-download ulang dari awal dari Mixkit dengan
URL & pengukuran dicatat langsung (opsi yang dipilih user), menggantikan
file lama. File lama dibackup di
`_archive/backup-shared-audio-pack-20260913/` (di root project, DI LUAR
`public/` supaya tidak ikut ter-copy ke `dist/` saat build).

## Pemakai

- **19-register** (pilot) — `transitions/paper-send.wav` dipakai pada
  momen amplop verifikasi berangkat ke inbox (Act 4), menggantikan
  `SWOOSH` generik. Lihat `src/content/19-register/revisi/2026-09-13-revisi-02-shared-pack-paper-send.md`.
  Divalidasi: `vite build` exit 0, file ter-copy ke `dist/audio/transitions/paper-send.wav`.
- `paper-arrive`, `paper-open`, `approval-stamp`, `key-turn`, `bubble-pop`,
  `soft-deny`, `policy-scan` — **belum ada pemakai**. Siap dipakai topic
  20/21/22/24 sesuai tabel §2 plan, tapi tetap wajib lewat audit
  SFX coverage + preview manual per-topic sebelum wiring (§6 guardrail:
  "asset baru tidak otomatis dipakai semua topic").
