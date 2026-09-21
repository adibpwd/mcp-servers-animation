# Revisi 01 — Implementasi Awal Content 65 (systemd)

Status: ✅ SUDAH DIEKSEKUSI (2026-09-18) — compile lolos. Export MP4 test sukses
(2026-09-21, retry ke-2, 52.70s utuh + visual QA lolos). Preview manual & review
konten oleh Rudy masih pending.

Sumber: `_docs/SYSTEMD_SERVICES_LOGS_PLAN.md` (gabungan Content 65 systemd + 67 logs,
status awal PLAN ONLY, dieksekusi atas persetujuan eksplisit user).

## Yang dikerjakan

- [x] `data.js` — COLORS, 6 PHASES, UNIT_INFO, LIFECYCLE_META, BOOT_TARGET/DEPENDENCIES,
      JOURNAL_ENTRIES (7 entri), DIAGNOSIS_STEPS, CLOSING_STAMPS, CAPTIONS, SFX_MAP
- [x] `manifest.js` — metadata schema V1
- [x] `Animation.jsx` — scene-ui V1 (IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1),
      pola sama dengan `22-oauth2-delegated-login` & `24-cors`
- [x] `caption.md` — caption sosial gaya narasi (pola sama topic lain)
- [x] Verifikasi compile: `npx esbuild --bundle --loader:.jsx=jsx --jsx=automatic` — lolos, 31.2kb, 0 error

## Struktur cerita (6 Act, ±58s)

1. **Dari Process ke Service** — process mentah → unit definition (deklaratif, field
   deskriptif bukan syntax unit file asli) → dikenali sebagai service.
2. **Manager Menjalankan Lifecycle** — start request → starting → active; PID bisa
   berubah, unit tetap sama.
3. **Boot & Dependency, Enable ≠ Start** — boot target + dependency chain
   (Requires/After); dua badge terpisah ENABLE (ikut boot) vs START (jalan sekarang).
4. **Ketika Process Gagal** — active → failed → restart TERBATAS (1/3, bukan tanpa
   batas) → active lagi, dengan catatan "active ≠ sehat".
5. **Jejak di Journal** — stdout/stderr + event manager masuk journal timeline,
   7 entri muncul progresif.
6. **Diagnosis: Ikuti Bukti** — 3 langkah (status → journal terfilter → konteks
   waktu/boot), 2 entri journal jadi entri failure/restart di-highlight sebagai hasil
   filter; ditutup 2 stamp payoff ("ACTIVE ≠ SEHAT", "IKUTI BUKTI").

## Batas aman (dipatuhi dari plan)

- Tidak ada command runnable ditampilkan (mis. `systemctl start ...`) — semua step
  diagnosis dilabeli deskriptif ("Saring journal per unit & waktu", bukan syntax nyata).
- Field unit direpresentasikan sebagai label deskriptif, bukan isi unit file `.ini` asli.
- Restart ditampilkan eksplisit **terbatas** (1/3), tidak menyarankan restart
  tanpa batas sebagai solusi.

## Update 2026-09-21 — Export MP4 test

- [x] Compile-check ulang: `npx esbuild --bundle --loader:.jsx=jsx --jsx=automatic` — lolos, 0 error.
- [x] Export MP4 percobaan 1: **GAGAL diam-diam** — 2 frame capture gagal di tengah
      (frame 859-860, "Execution context was destroyed" saat reload Puppeteer),
      menyebabkan gap di penomoran `frame_%05d.png`. ffmpeg image2 demuxer berhenti
      baca di gap tsb → video ke-render cuma 28.6s dari 55.85s (exit code 0, tidak
      terdeteksi sebagai error). Akibat: Act 4 (akhir), Act 5 (Journal), Act 6
      (Diagnosis) — termasuk seluruh materi log Content 67 — hilang dari video.
- [x] Export MP4 percobaan 2 (retry): **BERHASIL** — 1581/1581 frame tertangkap
      tanpa gap, video 52.70s (match durasi animasi terdeteksi), 1.21 MB.
- [x] Visual QA spot-check via ffmpeg frame extraction (t=2s, 15s, 25s, 33s, 40s,
      45s, 49s): Act 1 (Process→Service), Act 5 (Jejak di Journal — journal timeline
      7 entri tampil), Act 6 (Diagnosis: Ikuti Bukti — 3 langkah Status/Journal/
      Konteks) semua sesuai storyboard plan.
- [ ] Preview manual langsung oleh Rudy di browser (tempo & keterbacaan) — belum
      dilakukan, di luar kapasitas sesi ini.
- [ ] Review konten oleh Rudy (state contract, warna, durasi per-Act) — masih pending.

**Catatan untuk lain kali**: script `export-video.js`/`export-lib.js` tidak
mendeteksi gap frame sebagai kegagalan (exit code selalu 0 walau video
terpotong). Kalau durasi output jomplang dari durasi animasi terdeteksi,
curigai gap frame capture, bukan cuma percaya exit code.
