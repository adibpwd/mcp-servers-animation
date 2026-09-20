# Revisi — 34 Install Applications

| File | Tanggal | Ringkasan | Status |
|---|---|---|---|
| `2026-09-21-revisi-04-clarify-act1-distro-and-flowchart-lines.md` | 2026-09-21 | Memperjelas maksud Act 1 (Distro selector -> Manager & Format pairing) dan menambahkan SVG Flowchart Connector Lines di seluruh Act. | ✅ Diimplementasikan (2026-09-21) — flow spine hub->zona aktif, branch line Act 2, preview badge manager/format per distro beat Act 1. Diverifikasi lewat pembacaan kode + esbuild, belum playback nyata. |
| `2026-09-19-revisi-03-flow-spine-spacing-continuity.md` | 2026-09-19 | Audit diagnosis: bug flag visibility Act tidak pernah direset (komponen numpuk), plus permintaan flowchart line & Act 1 lebih jelas (dokumen ini plan-only, tidak sampai bagian rencana detail). | ✅ Bug fix diimplementasikan (2026-09-21) — semua flag visibility (`managerBadgeVisible`, `networkVisible`, `sourceVisible`, `planVisible`/`gateState`, `downloadVisible`, `installVisible`) sekarang direset di init Act berikutnya. Sisa cakupan (flowchart line, Act 1 clarity) dituntaskan lewat eksekusi revisi 04 di atas. |
| `2026-09-18-revisi-02-hybrid-icon-assets.md` | 2026-09-18 | Merencanakan dua batch icon generik untuk ChatGPT web serta sourcing logo distro dari official/Wikimedia dengan provenance, lisensi, trademark, loader fallback, dan mapping scene. | ✅ Diimplementasikan (2026-09-19) — 12 icon konsep + 6 logo distro (Simple Icons CC0, warna resmi) sudah di-generate, dibersihkan, disource, dan di-wire ke `loader.js`/`Animation.jsx`. Provenance di `icons/_originals/LICENSE-LOGOS.md`. |
| `2026-09-16-revisi-01-rich-install-flow.md` | 2026-09-16 | Analisis dan plan untuk memperkaya penjelasan repository internet, distro/logo, perbandingan package manager, serta lifecycle instalasi yang lebih kausal dan hidup. | ✅ Diimplementasikan (checklist acceptance criteria bagian 10 diupdate 2026-09-17) — belum direview lewat playback nyata. |

## Aturan folder

- Setiap revisi per-topic berada di folder `revisi/` pada root content.
- Nama file memakai format `YYYY-MM-DD-revisi-NN-deskripsi-singkat.md`.
- `_docs/` digunakan untuk plan utama/topik dan dokumen teknis yang menjadi referensi dasar.
- Plan revisi tidak mengubah implementasi sampai ada persetujuan eksekusi eksplisit.
