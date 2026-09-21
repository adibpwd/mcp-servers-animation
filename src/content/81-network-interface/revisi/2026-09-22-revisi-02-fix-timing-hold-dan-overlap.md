# Revisi 02 — Fix Timing Hold & Overlap (ditemukan lewat preview screenshot nyata)

| Item | Nilai |
|---|---|
| Content | 81 — Network Interface |
| Diminta oleh | Adib, 2026-09-22 (lanjutan sesi "continue" setelah revisi-01) |
| Status | ✅ Diimplementasikan + divalidasi ulang lewat screenshot nyata (bukan cuma SSR markup) |
| Terakhir diupdate | 2026-09-22 |
| Metode temuan | `scripts/preview-frames.mjs` — dev server (`npx vite --port 5199`) + Puppeteer headless (`/usr/bin/google-chrome`), screenshot SVG 820×1340 di berbagai titik waktu timeline nyata. Bukan cuma compile-check — ini render visual sungguhan. |

## 1. Bug yang ditemukan

### Bug A — Diagram hilang sebelum caption penutup selesai dibaca (Act 2, 3, 4, 5)

Tiap Act sebelumnya punya `tl.add(() => setXVisible(false)/setXStep(0), t)`
("cleanup") yang jalan 1.5–3.2 detik **sebelum** Act itu sendiri berakhir.
Akibatnya: caption closing (mis. "MAC dan IP punya peran berbeda.") masih
tampil, tapi diagram yang dibicarakan (layer link/MAC/IP) sudah hilang duluan
— penonton membaca caption sambil menatap layar kosong.

Dikonfirmasi via screenshot pada 4 titik (`a2@7.5`, `a3@7.5`, `a4@7`, `a5@7.5`):
semua menunjukkan caption closing tampil TANPA diagram pendukungnya.

**Fix:** hapus cleanup dini di Act 2 (`setLayerStep(0)`), Act 3
(`setResultsStep(0)`), Act 4 (`setRouteVisible(false)` dst). Diagram
dibiarkan **hold** sampai Act berikutnya mulai — aman karena tiap `ActN.jsx`
(pola 1-act-1-file, revisi-01) hanya membaca field state miliknya sendiri;
state Act sebelumnya yang "menggantung" otomatis tidak dirender begitu
`ACT_SCENES[phaseIdx]` berpindah komponen.

Untuk Act 5 (anchor "eth0" harus tetap hilang sebelum Act 6 — itu transisi
yang disengaja, bukan bug), `chainVisible`/`chainHighlight` TIDAK di-reset
(hold), tapi `anchorVisible`/`anchorGlow` tetap di-reset — hanya waktunya
dipindah dari 2s sebelum Act 5 berakhir → `actStart[5] - 0.1` (nyaris
bersamaan Act 6 mulai), supaya hold maksimal tanpa menghilangkan transisi
yang memang dimaksud.

### Bug B — Teks desc antar-card tumpang tindih (Act 6, saat semua chip aktif)

Di momen penutup Act 6 (`virtualHighlight === null`, semua 5 chip aktif
bersamaan), tiap card (lebar 130px) menampilkan desc-nya sendiri — beberapa
desc (mis. "Menyatukan beberapa interface jadi satu segmen", 47 karakter)
jauh lebih lebar dari card, sehingga teks meluber dan bertabrakan dengan
card tetangga.

Dikonfirmasi via screenshot `a6@7.5` (t=54.1, setelah `virtualHighlight`
di-null-kan): desc "Jalur mesin ke dirinya sendiri" bertumpuk dengan
"Menyatukan..." card sebelahnya.

**Fix:** desc HANYA ditampilkan untuk card yang sedang aktif secara
spesifik (`virtualHighlight === v.id`), bukan untuk state "semua aktif"
(`virtualHighlight === null`). Saat cycling (satu per satu), desc tampil
normal tanpa tabrakan (yang lain dim, tidak render desc). Saat momen
"semua aktif" di akhir, hanya label yang tampil (bersih, tanpa tabrakan) —
efek sampingnya mode summary (`SUMMARY_STATE`, `virtualHighlight: null`)
juga otomatis jadi lebih bersih untuk thumbnail `bg`/`bgScenes`.

## 2. Validasi setelah fix

Re-capture screenshot di titik waktu yang sama persis (`a2@7.5`, `a3@7.5`,
`a4@7`, `a5@7.5`, `a6@7.5`) setelah HMR reload dev server:

| Titik | Sebelum | Sesudah |
|---|---|---|
| `a2@7.5` (t=18.1) | Layer link/MAC/IP hilang, hanya caption+anchor | ✅ Anchor + garis putus-putus + 3 layer (Link/MAC/IP) semua tampil |
| `a3@7.5` (t=27.1) | Address/Gateway/DNS hilang | ✅ Ketiga badge tampil, terhubung ke anchor |
| `a4@7` (t=35.6) | Route target hilang | ✅ "Subnet lokal" (dim) + "Default gateway" (aktif, dot progress di ujung) tampil |
| `a5@7.5` (t=45.1) | Chain hilang (tapi anchor juga sudah hilang duluan) | ✅ Chain Nama→DNS→Route→Interface tampil penuh, hop "Interface" aktif; anchor MASIH tampil (baru hilang di t=46.5, 0.1s sebelum Act 6) |
| `a6@7.5` (t=54.1) | 5 desc card saling tumpang tindih | ✅ 5 label bersih tanpa tabrakan, takeaway bar tampil |

Metode: `node scripts/preview-frames.mjs 81-network-interface <outDir> <times> http://localhost:5199`,
review manual tiap PNG (820×1340) lewat `Desktop Commander:read_file`.

## 3. Yang tidak diubah

- Storyboard, urutan Act, teks caption/copy, warna, SFX — semua sama persis.
- Koordinat layout (posisi card, garis, anchor) — tidak diubah, hanya
  kapan state di-reset/apa yang ditampilkan.
- `data.js` — tidak ada perubahan (desc VIRTUAL_INTERFACES tetap teks aslinya,
  cukup tidak ditampilkan bersamaan; desc CONFIG_RESULTS/ROUTE_TARGETS
  sedikit mepet ke tepi card di beberapa titik tapi tidak collision nyata
  dengan card tetangga — dibiarkan, prioritas rendah).

## 4. Masih outstanding

- Export MP4 penuh (di luar scope sesi ini, butuh `npm run export-video`).
- `npm run build` penuh masih terblokir bug pre-existing tidak terkait
  (`48-shell-terminal-command-line`), sudah dicatat di revisi-01.
