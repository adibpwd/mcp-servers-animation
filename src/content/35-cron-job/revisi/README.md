# Revisi — 35 Cron Job

Index status ringkas perubahan pasca EKSEKUSI-01. Detail lengkap tiap
eksekusi awal dicatat di `_docs/CRON_JOB_PLAN.md`, bukan di sini — folder
ini dipakai untuk perbaikan/perubahan SETELAH topic dianggap selesai.

| Tanggal | Ringkasan | Status |
|---|---|---|
| 2026-09-23 | EKSEKUSI-01: `Animation.jsx` + `data.js` + `manifest.js` + `acts/Act1..Act4` ditulis mengikuti pola "1 act = 1 file" (docs/standardizations/07-act-scene-pattern.md) dan scene-ui V1 (IntroHeaderMorphV1 + ActBadgeNavigatorV1 + ContentBodyV1). `esbuild` bundle pass, SSR smoke test 4 Act mode summary pass (non-kosong). | 🚧 Selesai first pass |
| 2026-09-23 | `2026-09-23-revisi-01-flowchart-multicase-dynamic-caption.md`: (1) Act 1 jadi flowchart sekuensial Jam ➔ `crond` ➔ 3 Job (FlowLine + `spineProgress`/`branchStep`), (2) Act 2 jadi 3 kasus pola nyata (Daily/Interval/Weekly, `CRON_CASES`) dengan highlight kolom kunci + badge makna, (3) `CaptionBar` statis dihapus total, diganti `NearElementCaption` dekat elemen aktif di semua Act. | ✅ EKSEKUSI-01 selesai — `esbuild` + SSR smoke test pass, preview manual & export MP4 outstanding |
