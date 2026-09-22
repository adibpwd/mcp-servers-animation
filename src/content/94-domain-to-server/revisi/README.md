# Revisi — 94 Domain to Server

| Revisi | Status | Ringkasan |
|---|---|---|
| [04](2026-09-22-revisi-04-sfx-coverage.md) | 🚧 IN PROGRESS | Perbanyak SFX ke 12 titik yang tadinya sepi (muncul/hilang/gerakan) + 5 SFX_MAP key baru + tulis ulang `SFX_SCHEDULES['domain-to-server']` di export-lib.js (basi sejak revisi-03 pangkas morphDur). Kode dieksekusi 2026-09-22, esbuild+node--check lolos; dengar manual belum. |
| [03](2026-09-22-revisi-03-fix-spawn-origin-fast-intro-and-active-navigator-dot.md) | 🚧 IN PROGRESS | Fix posisi awal packet (spawn dari 0,0 — akar masalah lebih dalam: stale closure di GSAP tween, lihat §5 di file), morph intro 1.8s→0.8s, prop `activePhaseIdx`→`activeIndex` di navigator dot. Kode dieksekusi 2026-09-22, esbuild lolos; preview manual belum. |
| [02](2026-09-22-revisi-02-fix-title-header-and-inline-icons.md) | 🚧 IN PROGRESS | Fix intro header yang hilang + title `TO SERVER` terpotong + inline SVG icons per stasiun. |
| [01](2026-09-21-revisi-01-selaras-standar-act-scene.md) | ✅ Dieksekusi | Selaras standar act-scene (1 act = 1 file) + bg/bgScenes intro. |