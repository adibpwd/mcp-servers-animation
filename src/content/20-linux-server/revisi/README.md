# Revisi — 91 Linux Server

| File | Tanggal | Ringkasan | Status |
|---|---|---|---|
| `2026-09-19-revisi-01-flow-kausal-icon-chatgpt.md` | 2026-09-19 | Mengganti chip/text box yang muncul tiba-tiba dengan flow kasus yang punya asal-usul jelas, merencanakan `icons/icons.json` (28 icon PNG, 4 batch ChatGPT) supaya visual tidak lagi kotak teks, dan memperinci tiap Act menjadi kasus toko `toko.example` yang tetap teknis (DNS, port, service manager, permission, logs/metrics, rollback, restore test). | 📝 PLAN ONLY — belum dieksekusi. |
| `2026-09-20-revisi-02-header-domain-icon-batch4-breadcrumb.md` | 2026-09-20 | Menambah segmen domain `ADIB-DEV.COM` di header (mengikuti topic 34/60), memperbaiki 7 PNG batch-4 (checkerboard ter-bake, blokir icon Act 5–7) lalu wiring-nya, trim/center semua PNG, mengganti breadcrumb Act 2 (nama, DNS, IP, rute, 443, service) dari chip teks menjadi langkah ber-icon, dan memasang 4 icon yang belum terpakai. | 📝 PLAN ONLY — belum dieksekusi. |
| `2026-09-20-revisi-03-svg-inline-batch4-access-gate.md` | 2026-09-20 | Fallback icon SVG inline untuk 7 icon batch-4 yang PNG-nya masih ditahan (staging, backup, restore, release, runbook, cpu-chip, dashboard) dan gembok berstate untuk `AccessGate` Act 4 (closed/checking/granted/denied). Pengganti sementara; PNG otomatis menggantikan setelah di-wire. | ✅ SUDAH DIEKSEKUSI (compile lolos; preview belum). |

## Aturan folder

- Setiap revisi per-topic berada di folder `revisi/` pada root content.
- Nama file memakai format `YYYY-MM-DD-revisi-NN-deskripsi-singkat.md`.
- `_docs/` digunakan untuk plan utama/topik dan dokumen teknis yang menjadi referensi dasar (`_docs/LINUX_SERVER_PLAN.md`).
- Plan revisi tidak mengubah `Animation.jsx`, `data.js`, asset, manifest, atau hasil export sampai ada persetujuan eksekusi eksplisit.
- Setelah revisi dieksekusi, update kolom Status di tabel ini dan sinkronkan `_docs/LINUX_SERVER_PLAN.md`.
