# Revisi-04 — 27 File Operations: Grid Dinamis + Preview Modal

| Item | Nilai |
|---|---|
| Content | 27 — File Operations |
| Status | ✅ Animation.jsx sudah ditulis ulang & lolos syntax check (esbuild). Belum diverifikasi visual di browser — lihat catatan "Verifikasi lanjutan" di bawah. |
| Pemicu | Revisi-03 masih menampilkan `src/`, `assets/`, `README.md` sebagai slot "pending" bergaris putus-putus sejak awal — padahal seharusnya item itu belum ada sama sekali sampai command-nya di-apply ke GUI. Grid juga tidak reflow saat item bertambah/hilang. `cat` cuma fokus ring ke tile, tidak menampilkan isi file. |
| Tujuan | Grid file manager berperilaku senyata mungkin: item tidak ada → command apply → item muncul di posisi barunya → item lain geser (reflow). Item dihapus → shrink → item lain reflow menutup celah. Command baca (`cat`/`less`/`head`/`tail -f`) membuka panel preview isi file, bukan sekadar highlight. `find` memindai tile satu per satu; `locate` lompat instan (indeks).

## Checklist implementasi

### ✅ Sudah (di `data.js`)

- [x] `FILE_CATALOG` — katalog semua kemungkinan item (yang sudah ada + yang akan dibuat), item hanya dirender kalau id-nya ada di `activeIds` runtime.
- [x] `INITIAL_IDS = ['changelog', 'config', 'applog', 'old-draft']` — **`src`, `assets`, `readme` sengaja tidak masuk sini**, baru ditambahkan ke state saat `mkdir`/`mv` di-apply.
- [x] `orderIds()` — folder ditaruh duluan, stabil sesuai urutan dibuat.
- [x] `GRID` + `computeGridLayout(orderedIds)` — layout dinamis (kolom 2–4 menyesuaikan jumlah item, maksimal 2 baris), menggantikan `colCenters`/`rowCenters` statis lama.
- [x] `PREVIEW_CONTENT` — konten dummy untuk `README.md`, `CHANGELOG.md`, `config.ini`, `app.log`, dipakai panel preview.
- [x] `TERMINAL_STEPS` — tiap step baca (`cat`/`less`/`head`/`tailf`) sekarang punya `previewId` yang merujuk ke `PREVIEW_CONTENT`; durasi `holdExtra` disesuaikan supaya panel sempat kebaca (cat 0.7s, less 1.6s, head 0.7s, tailf 1.7s); durasi Act 3 (`PHASES`) dinaikkan ke 11.5s karena ada panel baru.
- [x] `CHANGE_BADGE` — entry `cat`/`less`/`head`/`tailf` dihapus (badge digantikan panel preview, bukan badge singkat).
- [x] Dihapus dari data: `TILE`, `RISK_TILE`, `GRID_GEOMETRY` (colCenters/rowCenters/riskCenter/riskW/riskH) — semua digantikan sistem `FILE_CATALOG` + `computeGridLayout`.

### ✅ Sudah (di `Animation.jsx` — ditulis ulang total)

`Animation.jsx` sudah tidak meng-import `TILE`/`RISK_TILE`/`GRID_GEOMETRY` lagi (sudah diverifikasi `grep` bersih). File lolos bundling syntax-check via `npx esbuild` (0 error).

- [x] State baru: `activeIds`, `positions` (id → {x,y} animasi), `popScale` (id → 0..1 untuk pop-in/shrink-out), `preview` (state panel).
- [x] Hapus state lama yang sudah tidak relevan: `tileState`/`riskState` (diganti `activeIds`+`popScale`+`warnId`).
- [x] `scheduleAddIds(newRawIds, applyAt, sound)` — item baru pop-in langsung di posisi target barunya, item lama yang posisinya berubah di-tween slide (reflow). Dipakai untuk `mkdir` (→ `src`,`assets`) dan `mv` (→ `readme`).
- [x] `scheduleRemoveId(id, shrinkAt, sound)` — tile shrink ~0.3s, baru dihapus dari array + reflow sisanya. Dipakai untuk `rm-confirm` (→ `old-draft`).
- [x] `schedulePreview(step, applyAt)` — modal isi file: `cat` semua baris sekaligus; `less` window baris scroll bertahap dgn indikator `···`; `head` baris awal + indikator bawah, tanpa scroll; `tail -f` baris baru menyusul satu-satu + dot live berkedip.
- [x] `find` → scan: focusTarget berpindah cepat lewat semua id aktif (snapshot build-time) sebelum berhenti di target; progress bar tetap dipakai.
- [x] `locate` → instan: pakai jalur travel default (tanpa langkah scan tambahan).
- [x] Render ulang grid: `activeIds.map(...)`, posisi dari `positions[id]`, skala dari `popScale[id] ?? 1`.
- [x] Tile disederhanakan jadi satu komponen `GridTile` (folder & file), hapus konsep `pending` (dashed ghost), tambah `scale` prop.
- [x] `NestedBadge` ambil `parentX/parentY` dari `positions.src`/`positions.assets` (dinamis) — logic hidden→creating→ready dipertahankan.
- [x] Komponen baru `FilePreviewPanel` — modal overlay di zona grid (92–468), header title-bar + nama file + mode, baris monospace, indikator `···`/live dot.
- [x] `GridToolbar` count = `activeIds.length`.
- [x] Reset loop (`t=0`) diperbarui: `activeIds = orderIds(INITIAL_IDS)`, `positions = computeGridLayout(...)`, `popScale={}`, `preview` default off, `warnId=null`, dst.
- [x] `tileCenterFor()` lama dihapus — badge sekarang pakai `badgePositionFor(id, layoutSnapshot)` dari snapshot layout build-time (`liveLayout`/`nextLayout` hasil `scheduleAddIds`/`scheduleRemoveId`).

### ⚠️ Verifikasi lanjutan (belum bisa dicek dari sini)

Saya (Claude) tidak punya akses browser/GUI ke dev server kamu, jadi bagian ini masih perlu kamu cek manual dengan `npm run dev` lalu buka preview animasi:

- [ ] Cek visual reflow beneran mulus (bukan cuma logic-nya benar di kode) — timing pop-in `back.out(1.6)` dan shrink `power1.in` mungkin perlu di-tune rasanya.
- [ ] Panel `FilePreviewPanel` — cek posisi/ukuran tidak nabrak toolbar grid (`GridToolbar` ada di y≈118, panel mulai di `ZONE.GRID.yStart + 6`), dan teks tidak overflow lebar 652px untuk baris yang panjang.
- [ ] Efek scan `find` — rasain apakah kecepatan lompat antar tile (TRAVEL_DUR / jumlah tile) sudah pas atau kekencengan/kelambatan.
- [ ] Suara (`play(SFX_MAP...)`) — pastikan tidak ada yang dobel/hilang dibanding revisi-03 (terutama `mkdir`/`mv`/`rm-confirm` yang sekarang dipanggil dari dalam `scheduleAddIds`/`scheduleRemoveId`, bukan dari `applyGui`).
- [ ] Loop kedua (repeat) — pastikan reset benar-benar bersih, tidak ada tile "nyangkut" dari loop sebelumnya.

## Kontrak posisi badge (`ChangeBadge`)

Supaya badge selalu nempel ke posisi tile yang **benar setelah reflow**, `ChangeBadge` state diubah dari `{tileId, ...}` (lookup posisi saat render) menjadi `{x, y, label, color, visible}` (posisi final di-hitung sekali di build-time, langsung dari `layoutSoFar` setelah `scheduleAddIds`/`scheduleRemoveId` dipanggil). Ini menghindari badge nyasar ke posisi lama saat tile sudah pindah.

## File yang terlibat

| File | Status |
|---|---|
| `data.js` | ✅ direvisi (entry aktif) |
| `Animation.jsx` | ✅ ditulis ulang (entry aktif), lolos syntax check esbuild — **belum diverifikasi visual di browser**, lihat "Verifikasi lanjutan" |
| `Animation.revisi-02-backup-20260916.jsx`, `data.revisi-02-backup-20260916.js` | Backup sebelum revisi-03, tidak disentuh |
| `Animation.revisi-03.jsx`, `data.revisi-03.js` | Snapshot revisi-03 lama, tidak disentuh — bukan sumber aktif |

## Checklist penerimaan (belum bisa dicek sampai Animation.jsx selesai)

- [ ] Saat animasi mulai, hanya `CHANGELOG.md`, `config.ini`, `app.log`, `old-draft.txt` yang terlihat — tidak ada slot kosong/putus-putus untuk `src`, `assets`, `README.md`.
- [ ] `mkdir -p src assets`: kedua folder baru muncul persis saat command apply, item lain di grid geser mulus ke posisi baru.
- [ ] `mv ... README.md`: `README.md` muncul baru, grid reflow lagi.
- [ ] `rm -i old-draft.txt` + `y`: tile shrink lalu hilang, grid reflow menutup celah.
- [ ] `cat README.md` membuka panel berisi isi README lengkap.
- [ ] `less CHANGELOG.md` menampilkan panel yang scroll bertahap.
- [ ] `head config.ini` menampilkan beberapa baris awal + indikator masih ada lanjutan.
- [ ] `tail -f app.log` menampilkan baris baru menyusul seperti live log.
- [ ] `find` terlihat memindai tile-tile di grid sebelum berhenti di `assets`.
- [ ] `locate` terasa instan dibanding `find`.
- [ ] Loop kedua reset total: grid kembali ke 4 item awal, tidak ada sisa state dari loop sebelumnya.
