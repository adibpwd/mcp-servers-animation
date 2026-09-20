# REVISI 04 — 65 Systemd: Dokumen Eksekusi Revisi-02 + Revisi-03

| Item | Keputusan |
|---|---|
| Content | 65 — Systemd (Services, systemd, dan Linux Logs) |
| Status | ✅ SUDAH DIEKSEKUSI (kode + compile). Preview manual, ukur durasi, dan export MP4 BELUM |
| Tanggal | 2026-09-20 |
| Sumber plan | `2026-09-20-revisi-02-peta-sistem-flowchart-icon-path.md` + `2026-09-20-revisi-03-lengkapi-peta-sistem-icon-path.md` (Bagian 11 = checklist eksekusi) |
| File diubah | `data.js`, `Animation.jsx` (ditulis ulang), `metadata.json` |
| File TIDAK diubah | `manifest.js`, registry, asset, hasil export |

## 1. Status Checklist Revisi-03 §11

| # | Item | Status | Catatan |
|---|---|---|---|
| 11.1 | `data.js`: 7 pasang koordinat stasiun | ✅ | `STATIONS` (menggantikan `AXIS_X` + konstanta Y), termasuk perbaikan posisi Managed Process (§4.2 revisi-03) |
| 11.2 | `data.js`: `PATH_ATLAS` | ✅ | Path Linux nyata per stasiun/Act |
| 11.3 | `DIAGNOSIS_STEPS[].question` → `statement` | ✅ | Teks mengikuti §10.1 revisi-03 |
| 11.4 | Komponen lokal `PathBarV1`, `IconCaption`, `PathLabel`, `FlowLine` | ✅ | Didefinisikan lokal di `Animation.jsx` (belum shared component) |
| 11.5 | Hapus CaptionBar lama, migrasi 20 caption | ✅ | Teks `CAPTIONS` tidak berubah. `say()` sekarang helper lokal yang mengisi state untuk `IconCaption` yang menempel di stasiun, bukan bar tunggal |
| 11.6 | Timeline per Act (garis dulu, objek menyala di ujung) | ✅ | `popOut('depRow')` dihapus; semua stasiun tetap ada, meredup |
| 11.7 | Bug ref SFX (`volumeRef`/`speedRef`) | ✅ | Tidak ada lagi `volume`/`speed` beku di dalam `popIn`/`popOut`/`onStart` |
| 11.8 | Generate 9 icon via `vm-icon-generator` | ⚠️ DEVIASI | Lihat §2 |
| 11.9 | Sinkron `metadata.json` dengan `manifest.js` | ✅ | `subtitle` dan `tags` diisi |
| 11.10 | Cek jarak stasiun #6/#7 di preview 820×1340 | ⏳ MANUAL | Sisa gap teoretis hanya ±10px (§4.1 revisi-03) |
| 11.11 | Ukur ulang durasi tiap Act | ⏳ MANUAL | `PHASES` masih memakai estimasi 12/12/16/12/15/13s (total 80s) |
| 11.12 | Preview manual & export MP4 | ⏳ MANUAL | Belum pernah dilakukan sejak revisi-01 |

## 2. Deviasi: Icon

Generate icon (11.8) membutuhkan Chrome extension `vm-icon-generator` yang
berinteraksi manual dengan chatgpt.com dan server docker lokal, sehingga
tidak bisa dijalankan dari sesi eksekusi ini. Pengganti sementara:
pictogram SVG inline (komponen `Icon` di `Animation.jsx`), dipasang di
posisi yang sama dengan yang direncanakan §9.1 revisi-03.

- Posisi, ukuran, dan timeline TIDAK bergantung pada jenis icon, jadi
  penggantian ke PNG hasil AI-generate nanti tidak menggeser layout.
- Keputusan `systemd-hub` (logo resmi vs generik) belum diambil; cek slug
  `systemd` di Simple Icons/Devicon saat icon PNG dikerjakan.
- Icon PNG belum masuk `icons/`, jadi belum ada `LICENSE-LOGOS.md`.

## 3. Hasil Verifikasi

- `esbuild` compile `Animation.jsx`: lolos, tanpa error.
- Bundle topic 65 (dengan dependency `shared/scene-ui/v1`): lolos; hanya warning `import.meta` yang berasal dari format output uji, bukan dari kode topic.
- 29 nama yang diimpor `Animation.jsx` dari `data.js`: semuanya ada (tidak ada yang hilang).
- Export `data.js` yang tidak lagi dipakai `Animation.jsx`: `TOTAL_DURATION`, `UNIT_LABEL` (aman, tidak menyebabkan error; boleh dibersihkan nanti).

**Temuan di luar scope topic ini:** `npx vite build` penuh gagal di
`src/content/84-network-ports/Animation.jsx` karena `SFX_MAP` tidak
di-export oleh `84-network-ports/data.js`. Bukan bagian revisi ini dan
tidak disentuh; perlu ditangani terpisah supaya build production bisa jalan.

## 4. Yang Perlu Dicek Manual (Preview Browser)

1. Tumpang tindih stasiun Journal/Boot Target dengan Diagnosis (11.10).
2. Durasi nyata tiap Act vs `PHASES[].duration` (11.11); sesuaikan `data.js` bila meleset, target total tetap dalam kisaran yang wajar.
3. Pulsa garis: Act 4 (merah, Managed Process → Manager), Act 5 (dua pulsa pertama ke Journal), Act 6 (garis aktif per step).
4. Path Bar crossfade sesuai Path Atlas tiap Act.
5. SFX baru terdengar: `SLIDE_IN` (Act 1), `LOCK` (Act 3), dan `TELEPORT` di intro.
6. Setelah semua oke: export MP4 (11.12).

## 5. Perbaikan Susulan: Audio Tidak Sinkron

Laporan: SFX terasa tidak sinkron dengan visual. Penyebab dan perbaikan (semua di `Animation.jsx`):

| # | Penyebab | Perbaikan |
|---|---|---|
| 1 | `lightStation` memanggil `sfxOn` (yang memakai `tl.add`) di dalam callback saat timeline sudah berjalan, sehingga SFX `POP` (Unit File, Act 1) dan `CHIME` (Diagnosis, Act 6) telat, hilang, atau menumpuk tiap loop | SFX sekarang dijadwalkan langsung ke timeline saat timeline dibangun |
| 2 | Act 1: garis Process→Unit selesai di t+2.7 tetapi Unit File (dan bunyi `POP`) baru menyala di t+3.2 | Unit File, Path Bar, dan caption `UNIT_DECLARED` dimajukan ke t+2.7 / 2.85 / 2.95 supaya menyala tepat di ujung garis. Durasi Act tidak berubah |
| 3 | Act 5: `TICK` berbunyi saat pulsa berangkat, entri journal baru muncul 0.5s kemudian | `TICK` dipindah ke momen pulsa tiba (a5+0.5) |

Verifikasi: compile lolos. Kesesuaian bunyi dengan visual tetap perlu didengar langsung di preview browser (checklist 11.10–11.12).

## 6. Perbaikan Susulan: Icon yang Belum Ada

Laporan: dua stamp penutup Act 6 tidak punya icon. Audit menemukan elemen lain yang juga polos. Semua memakai pictogram SVG inline (komponen `Icon`), sama seperti deviasi di §2.

| Elemen | Icon baru |
|---|---|
| Stamp `ACTIVE ≠ SEHAT` | `heart` (jantung + garis denyut), badge di tepi atas stamp |
| Stamp `IKUTI BUKTI` | `route` (dua titik + jalur putus-putus) |
| Kartu step diagnosis STATUS / JOURNAL / KONTEKS | `check` / `stack` / `clock` |
| Path Bar (sebelumnya ikon dokumen) | `folder` |
| Badge `ENABLE` / `START` (Boot Target) | `lock` / `play` |
| Baris dependency `Requires` / `After` | `link` |
| State `failed` / `restarting` di Manager | `alert` / `restart` (state lain tetap titik warna) |
| Badge `restart n/3` (sebelumnya `target`) | `restart` |
| Badge `DIKENALI SYSTEMD` (Unit File) | `check` |

Perubahan layout yang menyertai:
- Kartu diagnosis: teks `statement`/`source` sebelumnya meluber keluar kartu (monospace 11px, ±30 karakter di kartu 128px) sehingga saling menimpa antar kartu. Sekarang dibungkus per baris (`wrapText`), kartu diperlebar ke 136×92 dengan jarak 142.
- Icon magnifier sebelumnya menumpuk di pojok kartu pertama; dipindah ke kiri baris kartu.
- `CLOSING_Y` 900 → 912 di `data.js` supaya badge icon di atas stamp tidak menabrak caption Diagnosis.

Belum ada icon: baris entri Journal (hanya tag sumber berwarna) dan field Unit File (`runs`, `restart`); sengaja dibiarkan karena teksnya sudah kecil dan padat.

Verifikasi: compile lolos. Tampilan (terutama kartu diagnosis dan posisi stamp) perlu dicek di preview 820×1340.

### 6.1 Susulan: icon untuk semua state lifecycle

Badge state di Manager sebelumnya hanya `failed`/`restarting` yang ber-icon; `declared`/`starting`/`active` masih titik warna. Sekarang semua state punya icon: `declared` = dokumen, `starting` = play, `active` = centang, `failed` = peringatan, `restarting` = panah restart.
