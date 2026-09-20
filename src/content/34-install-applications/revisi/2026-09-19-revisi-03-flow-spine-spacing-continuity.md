# Revisi 03 — Flow Spine, Spacing & Continuity: 34 Install Applications

| Item | Keputusan |
|---|---|
| Content | 34 — Install Applications |
| Status | 📝 PLAN ONLY — belum mengubah `data.js`, `Animation.jsx`, atau asset apa pun |
| Predecessor | Melanjutkan revisi 01 (rich install flow, ✅ diimplementasikan) dan revisi 02 (hybrid icon assets — lihat catatan status di §0) |
| Trigger | Feedback langsung: (1) beberapa komponen visual saling tumpuk/overlay, (2) distro carousel Act 1 kurang jelas — kenapa Ubuntu dkk muncul, apa pesannya, (3) belum ada garis flowchart yang menyambungkan Act-Act jadi satu alur, dan diminta lebih menarik, (4) elemen yang masih berhubungan jangan dihilangkan, dilanjutkan saja |
| Cakupan | Act 1 sampai Act 8 penuh — tidak ada Act yang dipotong |

## 0. Catatan housekeeping (bukan blocker, ditemukan saat audit)

`revisi/README.md` menandai revisi 02 sebagai "belum dieksekusi", tapi
`icons/icons.json` dan `Animation.jsx` aktual sudah memakai 6 logo distro asli
(`ubuntu-logo`, `debian-logo`, dst — status tercatat `"DONE (2026-09-19)"` di
JSON-nya) dan 12 icon konsep (`package-box`, `repo-shelf`, dst) sudah di-wire.
Status di README perlu disinkronkan saat revisi ini dieksekusi.

## 1. Diagnosis (dibaca langsung dari `Animation.jsx` & `data.js` aktual)

### 1.1 Bug akar masalah — flag visibility Act tidak pernah direset

Ini penyebab UTAMA "beberapa komponen saling tumpuk". Tiap Act menyalakan
`xVisible`-nya sendiri di blok init, tapi TIDAK ADA Act berikutnya yang
mematikan `xVisible` milik Act sebelumnya. Akibatnya panel lama tetap
ter-render selamanya di belakang panel baru, karena render React murni
kondisional pada state ini (bukan `{phaseIdx === N && ...}` yang otomatis
unmount).

| Flag | Dinyalakan di | Seharusnya dimatikan di | Kenyataan | Efek |
|---|---|---|---|---|
| `managerBadgeVisible` / `managerActiveId` | Act 2 (per-beat) | Act 3 init | Tidak pernah | `ManagerCarousel` + `ManagerBadge` nangkring dari Act 3 sampai Act 8 |
| `networkVisible` | Act 3 init | Act 4 init | Tidak pernah | `NetworkMap` nangkring dari Act 4 sampai Act 8 |
| `sourceVisible` | Act 4 init | Act 5 init | Tidak pernah | `SourceLane` nangkring dari Act 5 sampai Act 8 |
| `planVisible` + `gateState` | Act 5 init | Act 6 init | Tidak pernah (`gateState` cuma direset di loop t=0) | `TransactionTray` + `ApprovalGate` (dalam status "izin diberikan") nangkring dari Act 6 sampai Act 8 |
| `downloadVisible` | Act 6 init | Act 7 init | Tidak pernah | `DownloadConveyor` nangkring dari Act 7 sampai Act 8 |
| `installVisible` | Act 7 init | Act 8 init | Tidak pernah | `InstallConveyor` nangkring di Act 8 |
