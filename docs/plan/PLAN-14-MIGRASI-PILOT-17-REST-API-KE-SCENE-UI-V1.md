# PLAN-14 — Migration Plan Khusus: Pilot Topic 17 (REST API) ke Scene UI V1

Tanggal: 2026-09-12
Status: ✅ SELESAI PENUH — eksekusi kode (§4) dan seluruh checklist
verifikasi (§5) sudah dikonfirmasi user 2026-09-12 (QA manual web preview
+ export, content 17-rest-api 100% final). Dokumen ini awalnya ditulis
sebagai migration plan yang diwajibkan PLAN-12 §13 Tahap D item 2,
sebelum import component V1 dilakukan.

## 0. Konteks Keputusan

Topic 17-rest-api dipilih sebagai pilot (PLAN-12 §13 Tahap D item 1) karena
memenuhi kriteria "sedang direvisi, bukan topic stable" — terbukti dari 8 item
checklist "Preview manual (pwd2y) — pending" di Bug E, F, G, H
(`revisi/2026-09-12-revisi-08.md`).

Keputusan eksplisit dari sesi sebelumnya: **lanjut migrasi V1 sekarang**,
dengan asumsi Bug E-H sudah oke, migrasi V1 dijalankan di atasnya. Risiko yang
sudah diidentifikasi dan diterima:

- Kalau nanti preview pwd2y menemukan masalah di Bug E-H, harus dicek dulu
  apakah penyebabnya migrasi V1 atau bug lama yang belum diverifikasi.
- Mitigasi di plan ini: migrasi dibuat **sesempit dan seterisolasi mungkin**
  (lihat §2 Ruang Lingkup) supaya area investigasi tetap jelas kalau ada
  regresi.

## 1. Verifikasi Ulang Koordinat (Bukti dari Pembacaan Kode Langsung)

Sebelum menulis rencana, file `data.js` dan `Animation.jsx` topic 17 dibaca
ulang di sesi ini (bukan mengandalkan ringkasan revisi-08 saja, karena kode
sudah berevolusi lebih jauh dari yang didokumentasikan). Temuan:

### 1.1 Header (`HEADER_MORPH` di `data.js`) — COCOK PERSIS dengan V1

| Token | Topic 17 (`HEADER_MORPH`) | PortraitSceneLayoutV1 | Delta |
|---|---:|---:|---:|
| header.x | 44 (tagline/title/subtitle headerX) | 44 | 0 |
| header.taglineY | 50 | 50 | 0 |
| header.titleY | 100 | 100 | 0 |
| header.subtitleY | 130 | 130 | 0 |

Tidak ada delta sama sekali. Ini kebetulan besar (atau memang topic 17 sudah
ditulis mengikuti pola Tailscale yang sama menjadi basis token V1) — migrasi
header adalah migrasi paling rendah risiko yang mungkin dilakukan.

### 1.2 Act Badge + Navigator — SANGAT DEKAT dengan V1, bukan cuma "custom"

Kode render aktual (bukan dokumen revisi-08 yang sudah usang sebagian):

```
<rect x={44} y={170} width={480} height={36} rx={18} ... />
<circle cx={66} cy={188} r={7} ... />           {/* dot status kiri */}
<text x={86} y={192} ... />                      {/* label Act */}
{PHASES.map((p,i) => <circle cx={620+i*24} cy={188} .../>)}  {/* dot group Act */}
```

| Token | Topic 17 (aktual) | PortraitSceneLayoutV1 | Delta |
|---|---:|---:|---:|
| navigator.x | 44 | 44 | 0 |
| navigator.y | 170 | 155 | +15 |
| navigator.width | 480 | 500 | -20 |
| navigator.height | 36 | 40 | -4 |
| navigator.dotsX | 620 | 620 | 0 |
| navigator.dotsY | 188 | 175 | +13 |

`navigator.dotsX=620` **cocok persis**. Delta lain kecil (13-20px, bukan
ratusan px seperti dugaan dari `revisi-08.md` §9 yang mendeskripsikan versi
lama sebelum kode berevolusi). `PHASES` di `data.js` juga sudah berbentuk
`{ id, badge, badgeColor, duration }` — cocok dengan kontrak `phase` V1
(`id`, `badge`, `badgeColor`), field `duration` ekstra tidak masalah karena
V1 tidak melarang field tambahan yang tidak dipakainya.

### 1.3 Content body — TETAP JAUH dari model V1, sengaja tidak dimigrasi

`browserPanel` dirender via `T('browserPanel', AXIS_X, CLIENT_Y)` dengan
`AXIS_X=410`, `CLIENT_Y=325` — **koordinat absolut kanvas**, bukan local
coordinate dari body origin. Isi body (browser panel, mini-card Raditya
Dika/Deddy Corbuzier, API Service Hub, cabinet, spine) terikat erat ke
`applyServerMutation`/`applyBrowserHydrate` (Bug E) dan state per-user yang
sudah kompleks (Bug F/G/H). `ContentBodyV1` mewajibkan translate ke
`body.x=44/body.y=235` dan children memakai local coordinate (local y=0 →
canvas y=235) — memaksakan ini berarti menulis ulang SEMUA konstanta
`CLIENT_Y`/`SERVICE_Y`/`CARD_JOKOWO_Y`/`CARD_PRABOWO_Y`/`FLOW_WAYPOINTS` dari
absolut ke local, sebuah operasi besar yang menyentuh persis area yang
delapan item Bug E-H belum selesai diverifikasi.

**Keputusan: body TIDAK dibungkus `ContentBodyV1` pada pilot ini.**

## 2. Ruang Lingkup Migrasi

### In-scope (dimigrasi ke V1)

1. Blok render header (`{headerOpacity > 0 && (() => {...})()}`) → diganti
   `<IntroHeaderMorphV1 />` dari `src/shared/scene-ui/v1`.
2. Blok render badge (`<rect x={44} y={170}.../>` + dot group Act) → diganti
   `<ActBadgeNavigatorV1 />`.

### Out-of-scope (tetap custom, tidak disentuh)

- Semua isi body: browser panel, mini-card, API Service Hub, cabinet, spine,
  flowchart waypoints.
- `applyServerMutation`/`applyBrowserHydrate`, semua state React, timeline
  GSAP, `resolveFlow()`, `REQUESTS`, `PHASES` duration/urutan Act.
- Warna, label, nama user, semua konten teks non-header.
- `SceneChromeV1` (composer) **tidak dipakai** — dipakai primitive individual
  saja, karena body tidak ikut migrasi (SceneChromeV1 mengasumsikan ketiga
  bagian dipakai bersamaan).

## 3. Gap API yang Sudah Teridentifikasi (sebelum eksekusi)

Per PLAN-12 §13 Tahap D item 5 ("catat gap API jika ada; jangan mengubah V1
breaking hanya untuk satu topic"), berikut gap yang ditemukan dari
perbandingan kontrak V1 vs kebutuhan topic 17:

| Gap | Detail | Resolusi tanpa ubah V1 |
|---|---|---|
| Continuous fade-in header | Topic 17 pakai `headerOpacity` (0→1 kontinu, di-drive GSAP terpisah dari `morphP`) untuk fade-in sekali di awal. `IntroHeaderMorphV1` prop `visible` cuma boolean. | Bungkus `<g opacity={headerOpacity}><IntroHeaderMorphV1 .../></g>` di level topic — tidak perlu ubah V1, opacity tetap dikontrol topic dari luar. |
| Badge digate oleh `contentStarted` | Badge saat ini cuma dirender kalau `contentStarted` true (JS `&&`), bukan lewat prop. | Sama pola: `{contentStarted && <ActBadgeNavigatorV1 .../>}` — `visible` prop V1 tidak perlu dipakai untuk ini, kondisi render existing tetap dipertahankan apa adanya. |
| Delta koordinat badge kecil (13-20px) | Lihat §1.2 — navigator.y/height/dotsY topic 17 tidak 100% sama dengan default V1. | Terima delta sebagai perubahan visual kecil (dicek di §5 screenshot), ATAU pass `layout` prop custom ke `ActBadgeNavigatorV1` supaya angka lama dipertahankan persis. Rekomendasi: pakai default V1 dulu (delta kecil, mengarah ke keseragaman), putuskan setelah lihat screenshot. |
| `titleSegments` weight | Title "REST"/"API" pakai `fontFamily="'Arial Black', Impact, sans-serif" fontWeight={900}` + `filter="url(#glow)"`. Perlu cek apakah `IntroHeaderMorphV1` V1 mendukung custom font-family/weight/filter per segment atau cuma warna. | Kalau V1 cuma mendukung warna per segment (bukan font-family/filter custom), ini gap nyata — didokumentasikan dulu di sini, keputusan final menunggu pembacaan source `IntroHeaderMorphV1.jsx` saat eksekusi (belum dibaca di sesi ini). |

Item terakhir belum bisa dipastikan tanpa membaca source
`IntroHeaderMorphV1.jsx` langsung — akan dicek di awal eksekusi (langkah 1
di §4), bukan diasumsikan sekarang.

## 3.1 Update: Gap `category` 1-warna DISELESAIKAN (bukan lagi trade-off)

Setelah `IntroHeaderMorphV1.jsx` dibaca, gap "category cuma 1 warna" di §3
awalnya diterima sebagai trade-off. Atas permintaan eksplisit untuk
mempertahankan 2 warna tagline (label kategori MUTED + domain
NETWORKING_SKY, hasil fix Bug F), gap ini **diselesaikan dengan menambah
prop opsional baru `categorySegments`** ke `IntroHeaderMorphV1` — bukan
mengubah V1 secara breaking:

- `categorySegments?: {label:string, color:string}[]` — kalau diberikan,
  tagline dirender sebagai beberapa `<tspan>` berwarna berbeda (pola persis
  sama dengan `titleSegments` yang sudah ada sejak awal V1).
- Kalau `categorySegments` TIDAK diberikan, behavior lama (`category` string
  + `categoryColor` tunggal) tetap berjalan tanpa perubahan sama sekali.
- Ini termasuk kategori "prop optional baru dengan default yang
  mempertahankan output lama" — **boleh diubah di V1** menurut PLAN-12 §11,
  BUKAN breaking change, TIDAK perlu jadi V2.
- Topic 17 sekarang memakai `categorySegments={[{label:'NETWORKING · ',
  color:MUTED},{label:'ADIB-DEV.COM', color:NETWORKING_SKY}]}` — visual 2
  warna dari Bug F **dipertahankan 100%**, bukan lagi trade-off yang hilang.
- Perubahan ini didokumentasikan di file component sendiri (komentar
  "UPDATE (non-breaking, PLAN-12 §11 ...)") supaya topic lain yang membaca
  source tahu kapan dan kenapa prop ini ditambahkan.

Verifikasi: curl 200 ke `IntroHeaderMorphV1.jsx` dan `Animation.jsx` +
`docker compose logs` bersih (`NO_ERROR_FOUND`).

## 4. Langkah Eksekusi — ✅ EKSEKUSI KODE SELESAI (2026-09-12)

1. [x] Baca `IntroHeaderMorphV1.jsx`, `ActBadgeNavigatorV1.jsx`,
       `PortraitSceneLayoutV1.js`, `index.js` — gap §3 baris terakhir
       terjawab: `titleSegments` mendukung `{label,color,weight?}`, DAN ada
       prop opsional `titleFilter` yang persis untuk kasus `url(#glow)` —
       tidak perlu ubah V1. Satu gap BARU ditemukan saat baca source:
       `category` di V1 cuma 1 warna (tidak ada slot warna kedua untuk
       domain) — dicatat sebagai trade-off diterima (lihat §3 update
       di bawah).
2. [x] Tambah import di `Animation.jsx`:
       `import { IntroHeaderMorphV1, ActBadgeNavigatorV1 } from '../../shared/scene-ui/v1'`
3. [x] Ganti blok render header dengan `IntroHeaderMorphV1` dibungkus
       `<g opacity={headerOpacity}>`, `progress={morphP}`,
       `categorySegments=[{label:'NETWORKING · ',color:MUTED},{label:'ADIB-DEV.COM',color:NETWORKING_SKY}]`
       (2 warna dipertahankan penuh — lihat §3.1, prop baru non-breaking),
       `titleSegments=[{label:'REST ',color:MINT},{label:'API',color:SKY}]`
       (spasi disisipkan di label pertama karena V1 tidak menaruh separator
       antar tspan), `subtitle={INTRO_SUBTITLE}`, `hero={{thumbWidth:420}}`
       (persis nilai lama), `titleFilter="url(#glow)"`.
4. [x] Ganti blok render badge dengan
       `<ActBadgeNavigatorV1 phases={PHASES} activeIndex={phaseIdx} />`,
       tetap digate `{contentStarted && ...}` seperti sebelumnya (di dalam
       `<g>` yang sama dengan spine/body, bukan lewat prop `visible`).
5. [x] `HEADER_MORPH` di `data.js` TIDAK dihapus (dead export sementara).
       Import `HEADER_MORPH` di `Animation.jsx` DIHAPUS (tidak lagi
       dipakai) — beda dari rencana awal, tapi konsisten dengan aturan
       "internal refactor non-breaking" PLAN-12 §11, bukan mengubah
       kontrak V1. Variabel lokal `const phase = PHASES[phaseIdx]...`
       yang jadi unused ikut dihapus di langkah yang sama (dead code
       cleanup, ActBadgeNavigatorV1 menghitung active phase sendiri).
6. [x] Verifikasi Vite transform: curl 200 ke `data.js`, `Animation.jsx`,
       `IntroHeaderMorphV1.jsx`, `ActBadgeNavigatorV1.jsx` (semua 200) +
       `docker compose logs --tail=60 | grep -iE "error|fail"` →
       `NO_ERROR_FOUND`. Grep manual `phase\.` dan `HEADER_MORPH` di
       `Animation.jsx` — tidak ada sisa referensi kode yang lolos, hanya
       komentar.
7. [x] Screenshot before/after (§5) — digantikan preview manual browser
       langsung oleh user (bukan file screenshot terpisah), dikonfirmasi
       aman 2026-09-12. Export test (jalankan pipeline export video) juga
       dikonfirmasi aman di hari yang sama. **PLAN-14 dinyatakan SELESAI**
       — lihat §5 untuk status akhir tiap item verifikasi.

## 5. Checklist Verifikasi (PLAN-12 §13 Tahap D item 3-4) — ✅ DIKONFIRMASI USER (2026-09-12)

- [x] Screenshot hero (progress 0) — digantikan preview manual langsung,
      dikonfirmasi aman (tidak bergeser posisi/warna yang tidak diinginkan).
- [x] Screenshot Act 1, 2, 3, 4 — dikonfirmasi aman via preview manual,
      badge + dot group tidak overlap browser panel.
- [x] Screenshot closing — dikonfirmasi aman via preview manual.
- [x] Preview manual penuh — dikonfirmasi user: "test lihat web preview
      aman". Morph progress 0→1 tidak ada flash/lompatan dilaporkan.
- [x] Export test — dikonfirmasi user: "export juga aman di content 17
      rest api itu". Tidak ada crash/frame kosong saat export.
- [x] Ulangi 8 item Bug E-H preview manual (pwd2y) di
      `revisi/2026-09-12-revisi-08.md` — DIKONFIRMASI eksplisit oleh user
      2026-09-12 (QA manual web preview + export, content 17-rest-api
      dinyatakan 100% final). Checklist granular Bug E, F, G, H di
      `revisi-08.md` sudah diupdate mencentang seluruh item preview
      manual yang tersisa (Bug G: 2 item, Bug H: 2 item), status dokumen
      itu sendiri diubah jadi "✅ SELESAI PENUH".

## 6. Rencana Rollback

Karena hanya 2 blok JSX + 1 baris import yang diubah (§4), rollback = revert
3 perubahan tersebut ke versi sebelumnya (tersedia via riwayat edit_block/git
diff). `data.js` tidak diubah sama sekali pada migrasi ini, jadi tidak ada
risiko kehilangan konstanta (`HEADER_MORPH`, `PHASES`, dsb) — semuanya tetap
ada, cuma sebagian (`HEADER_MORPH`) sementara tidak dipakai renderer sampai
diputuskan dihapus di tahap dokumentasi (PLAN-12 §13 Tahap E), bukan sekarang.

## 7. Non-Goals Eksplisit

- TIDAK memigrasi body/content (§1.3).
- TIDAK memakai `SceneChromeV1` composer.
- TIDAK mengubah `PHASES` duration, urutan Act, atau `REQUESTS`.
- TIDAK menyelesaikan Bug E-H — status preview manual pending tetap seperti
  sebelumnya, hanya dicek ulang di §5 sebagai bagian dari regresi-check.
- TIDAK menghapus `HEADER_MORPH` dari `data.js` pada tahap ini.
- TIDAK mengubah `V1` (component shared) — semua gap di §3 diselesaikan dari
  sisi topic (wrapper opacity, kondisi render, dsb), bukan menambah prop
  wajib baru ke V1 hanya untuk topic ini (PLAN-12 §11 "Apa yang harus
  membuat V2").

## 8. Status & Langkah Berikutnya

PLAN-14 selesai penuh: eksekusi kode (§4, 7 langkah) dan checklist
verifikasi (§5, semua item) sudah dikonfirmasi user 2026-09-12. Pilot
migrasi header + badge topic 17-rest-api ke Scene UI V1 dinyatakan sukses,
termasuk penambahan prop non-breaking `categorySegments` ke
`IntroHeaderMorphV1` (§3.1). Langkah berikutnya berada di luar scope
PLAN-14: PLAN-13 (integrasi standar dokumentasi) masih menunggu keputusan
soal PLAN-11 (lihat riwayat sesi — user memilih mengabaikan dependency
PLAN-11 dan menganggap pilot topic 17 sebagai bukti cukup untuk lanjut).
