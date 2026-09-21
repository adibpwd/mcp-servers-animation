# Revisi 01 — Status Merge ke Content 65 (systemd) + Standar Act-Scene

| Item | Nilai |
|---|---|
| Content | 67 — Linux Logs |
| Diminta oleh | Adib, 2026-09-21 |
| Status | 📝 PLAN ONLY — tidak ada kode content 67; tetap di-revisi sebagai penanda |
| Terakhir diupdate | 2026-09-21 |
| Referensi | `_docs/LINUX_LOGS_MERGE_PLAN.md`, `docs/standardizations/07-act-scene-pattern.md`, content 65-systemd |

## Ringkasan

Content 67 **tidak memiliki Animation.jsx** — hanya `metadata.json` +
`_docs/LINUX_LOGS_MERGE_PLAN.md`. Sesuai merge plan yang aktif ("PLAN ONLY —
jangan dieksekusi"), materi Linux Logs akan **digabung sebagai Act 5–6 dari
Content 65 (systemd)**:

- **Act 5** — journal sebagai event timeline (journald).
- **Act 6** — service/app log + filter + retention/rotation + observability
  (status/log/health/metrics).

Karena tidak ada kode sendiri, revisi ini hanya **mencatat status** dan
**mengunci aturan standar** yang berlaku SAAT materi ini dieksekusi (baik
sebagai Act 5–6 systemd maupun jika nanti dipisah kembali), supaya tidak ada
drift standar di kemudian hari.

## 1. Aturan yang Dikunci untuk Eksekusi Nanti

| Aturan | Detail |
|---|---|
| Pola act-scene | Wajib `acts/ActN.jsx` + `ACT_SCENES` (1 act = 1 file, mode summary) — `docs/standardizations/07-act-scene-pattern.md` §2/§3 |
| Intro UPDATE 5 | Jika memakai `IntroHeaderMorphV1`: glow default ON, domain auto ` · ADIB-DEV.COM` (default cyan) sekadar jika tidak override — ikuti pola eksplisit 48/60 (`categorySegments`) untuk warna konsisten |
| Intro UPDATE 6 | Aktifkan `bg`/`bgScenes` agar thumbnail menampilkan scene act |
| Trigger pemisahan | Sesuai MAX(1) di merge plan: journald vs syslog, structured fields, centralized logging, audit logs, privacy, incident timeline — bila dipisah, content 67 berdiri sendiri dengan metadata dibuat konsisten (subtitle + tags sekarang kosong) |
| Merge plan | Tetap PLAN ONLY — tidak dieksekusi di dokumen ini |

## 2. Status

| Pemeriksaan | Status |
|---|---|
| Kode | Tidak ada (belum dibuat) |
| Merge plan | PLAN ONLY — aktif |
| Metadata | `draft`, `pinned`, subtitle & tags kosong |
| Preview/Export | Tidak berlaku (belum ada implementasi) |