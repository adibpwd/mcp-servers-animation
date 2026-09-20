# Revisi 01 — Implementasi Awal Content 65 (systemd)

Status: ✅ SUDAH DIEKSEKUSI (2026-09-18) — compile lolos, preview manual & export MP4 belum dijalankan

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

## Belum dikerjakan (di luar cakupan sesi ini)

- [ ] Preview manual di browser — cek tempo & keterbacaan tiap Act
- [ ] Export MP4 test — verifikasi visual lifecycle + journal + diagnosis di video
- [ ] Review konten oleh user (state contract, warna, durasi per-Act)
