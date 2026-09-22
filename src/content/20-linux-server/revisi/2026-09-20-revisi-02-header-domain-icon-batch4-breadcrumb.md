# REVISI PLAN 02 — 91 Linux Server: Header Domain, Icon Batch-4, dan Breadcrumb Act 2

| Item | Keputusan |
|---|---|
| Content | 91 — Linux Server: Sistem yang Menyediakan Layanan |
| Status | DISETUJUI, EKSEKUSI SEBAGIAN (2026-09-20) — menunggu regenerate batch-4 oleh user; lihat §7 |
| Tanggal | 2026-09-20 |
| Dokumen ini | Revisi terpisah; melengkapi `revisi-01` dan `_docs/LINUX_SERVER_PLAN.md`. Tidak mengubah `Animation.jsx`, `data.js`, asset, manifest, registry, atau hasil export |
| Sumber temuan | Pembacaan kode `Animation.jsx` (1376 baris), `data.js`, `icons/loader.js`, `IntroHeaderMorphV1.jsx`, header topic lain, plus audit piksel 28 PNG (skrip Python/PIL, hasil di §2.3). BELUM diverifikasi lewat preview browser |
| Standar acuan | `docs/standardizations/03` §1.Q (Series Identity), `05` Bab A (layout) dan Bab B (icon pipeline), `PROJECT_STRUCTURE.md` (konvensi `revisi/` dan numbering hierarki) |

## 1. Umpan balik yang ditangani

| No | Umpan balik | Ditangani di |
|---|---|---|
| 1 | `adib-dev.com` tidak ada di intro/header seperti topic lain | §2.1, §3.1, §4.1 |
| 2 | Act 6: backup dan objek sejenis belum ada icon | §2.2, §2.3, §3.2, §4.2, §4.5 |
| 3 | Act 2: baris kotak teks (nama, DNS, IP, rute, 443, service) tidak ada icon; apakah memang tidak ada | §2.4, §3.3, §4.3 |

Jawaban singkat untuk ketiganya: (1) terlewat, bukan sengaja; (2) icon batch-4 sengaja ditahan
di `loader.js` karena PNG-nya cacat; (3) memang tidak ada, karena breadcrumb dirender sebagai `Chip`
teks dan revisi-01 tidak menetapkan bentuk visualnya.

## 2. Diagnosis dari kode dan aset aktual

### 2.1 Poin 1 — `adib-dev.com` tidak muncul di header

Header topic 91 memakai `category` polos satu warna. Topic lain di seri yang sama memakai
`categorySegments` dengan segmen domain berwarna.

| Pola header | Topic |
|---|---|
| `categorySegments`: `INTRO_CATEGORY_LABEL + ' · '` (MUTED) + `INTRO_DOMAIN = 'ADIB-DEV.COM'` (warna = Title A) | 17–27, 34, 37, 48, 60 |
| Sama, domain varian demo `WEB-DEMO.SERVICE` | 65 |
| `categorySegments` tanpa segmen domain | 93 |
| `category` polos satu warna, tanpa domain | 44, 81, **91**, 92, 94 |

Bukti di 91: `<IntroHeaderMorphV1 ... category={INTRO_CATEGORY_LABEL} />` di `Animation.jsx`, dan
`data.js` tidak punya `INTRO_DOMAIN`. Referensi format: `34-install-applications` dan
`60-linux-processes` (domain diwarnai sama dengan Title A).

Akar masalah: `03` §1.Q hanya mengunci kategori dan palet title, tidak menyebut segmen domain.
Revisi-01 §4.1 menulis "Series Identity Contract tidak berubah" tanpa memeriksa struktur
`categorySegments` topic acuan, sehingga header lama ikut terbawa.

Catatan konflik aturan: acceptance revisi-01 melarang "domain nyata selain `toko.example`". Aturan itu
untuk isi kasus. `ADIB-DEV.COM` di header adalah identitas seri (branding channel), bukan domain
kasus, jadi dikecualikan (ditulis eksplisit di §6).

### 2.2 Poin 2 — Kenapa icon Act 6 (dan Act 5/7) belum tampil

`icons/loader.js` mengaktifkan 21 icon (batch 1–3). Tujuh icon batch-4 sengaja di-comment karena PNG-nya
bukan transparan sungguhan.

| Pemeriksaan | Batch 1–3 (21 file) | Batch-4 (7 file) |
|---|---|---|
| Mode PNG | RGBA | RGB (tanpa alpha) |
| Piksel opaque | 9–26% | 100% |
| Piksel abu-abu terang opaque | 0% | 74–88% |
| Kesimpulan | Transparan, aman | Pola checkerboard "transparan" dari preview ChatGPT ikut ter-bake sebagai piksel |

Backend crop (`/api/icons/generate` di `scripts/export-server.mjs`, `scripts/api-handlers.mjs`,
`vite-plugin-export.js`) hanya memanggil `sharp.extract` tanpa proses background, jadi cacat berasal
dari gambar mentah ChatGPT, bukan dari crop. Bila di-wire apa adanya, ketujuhnya tampil sebagai kotak
abu-abu di atas background `#070913`.

Dampak per Act (semua saat ini jatuh ke fallback kotak dashed):

| Act | Komponen | Icon | Kondisi sekarang |
|---|---|---|---|
| 5 | `MetricPanel` | `monitor-dashboard` | Fallback dashed berlabel `METRICS` |
| 6 | `StagingPad` | `staging-pad`, `release-package` | Fallback dashed |
| 6 | `ReleaseStack` | (tidak ada icon di kode) | Persegi panjang + teks `v2`/`v1`; tetap polos walau batch-4 sudah di-wire |
| 6 | `BackupVault` | `backup-vault` | Fallback dashed berlabel `BACKUP` |
| 6 | `RestoreArea` | `restore-cycle` | Fallback dashed |
| 6 | `RunbookDoc` | `runbook-doc` | Fallback dashed |
| 7 | `PostureCard` | `cpu-chip`, `monitor-dashboard`, `runbook-doc`, `release-package` | 4 dari 8 slot icon pilar berupa kotak dashed 24×24 tanpa label |

### 2.3 Temuan tambahan aset (berlaku untuk semua batch)

Audit piksel pada 21 PNG RGBA (alpha > 200 dianggap glyph, kanvas 443×443, pusat 221.5):

| Temuan | Data | Dampak |
|---|---|---|
| Glyph tidak berada di tengah kanvas | Offset vertikal sampai +41 px (`user-group`), +36 (`server-rack`, `user-badge`, `data-vault`), −26 (`ssh-key`), −24 (`service-manager`); offset horizontal sampai ±14 (`listening-socket`, `ssh-key`, `log-scroll`) | Komponen `Icon` memusatkan kanvas, bukan glyph, sehingga objek tampil menggeser dari titik station |
| Glyph hanya sebagian kecil kanvas | Contoh lebar×tinggi: `client-phone` 42%×69%, `dependency-chain` 90%×24%, `mini-pc` 76%×45% | Objek tampil lebih kecil dari `w`×`h` yang dirancang; `meet` pada slot lebar (monitor 320×140, firewall 160×80, cloud 150×100) memperkecil lagi |
| Residu tepi crop (piksel alpha > 40 dalam 8 px dari tepi) | `service-account` 579, `user-group` 658, `log-scroll` 403, `alert-bell` 322; lainnya 0 | Garis tipis samar di tepi sel pada background gelap |
| Empat icon belum dipakai di kode | `router-hop`, `dependency-chain`, `ssh-key`, `user-group` | Tempatnya masih SVG polos: dua lingkaran hop Act 2, dua lingkaran+panah di manager Act 3, label pulse `ssh-key` Act 4, `Chip` `group: ops` Act 4 |

### 2.4 Poin 3 — Kenapa breadcrumb Act 2 tidak ber-icon

`BREADCRUMB = ['nama', 'DNS', 'IP', 'rute', '443', 'service']` dirender `Chip` (pil teks, font 11) di
`y=850`, `x = 366 + (i − 2.5) × 112`, dinyalakan berurutan pada 16.4–18.4 lewat `crumbN`. Tidak ada
`Icon` sama sekali, padahal empat dari enam objek aslinya sudah punya PNG di scene:

| Langkah | Objek asli di Act 2 | PNG yang sudah ada |
|---|---|---|
| nama | Address bar di client | (SVG inline, belum ada PNG) |
| DNS | `DnsBook` | `dns-book` |
| IP | Chip IP di bawah client | (SVG inline, belum ada PNG) |
| rute | Cloud + dua hop | `internet-cloud`, `router-hop` |
| 443 | `ListenSocket` | `listening-socket` |
| service | App tile toko-web | `web-app-card` |

Revisi-01 §6.2 hanya menulis "breadcrumb menyala berurutan" tanpa menetapkan bentuk visual, sehingga
komplain revisi-01 poin 2 ("jangan hanya kotak teks") belum menjangkau elemen ini.

### 2.5 Temuan tambahan kode (ikut diperbaiki karena memengaruhi hasil akhir)

| No | Temuan | Bukti | Tindakan |
|---|---|---|---|
| a | `MetricPanel` dipanggil dengan `linesOn={s.metricsOn}` tetapi komponen tidak menerima prop itu | Definisi `({ visible, spike, thresholdCross })` | Garis grafik tampil sejak dashboard muncul, bukan di 4.8 s seperti storyboard revisi-01 §6.5. Diperbaiki saat `MetricPanel` didesain ulang (§4.2) |
| b | Overlay `MetricPanel` berukuran 280 lebar, sedangkan glyph `monitor-dashboard` hasil generate rasio ±1.2:1 | Koordinat `translate(-140 40)` dan `x2="280"` | Layout overlay ditentukan ulang setelah PNG batch-4 final (§4.2) |

## 3. Keputusan yang diusulkan (menunggu persetujuan)

| No | Keputusan | Default | Alternatif |
|---|---|---|---|
| D1 | Icon batch-4: regenerate dengan prompt yang mewajibkan alpha asli, lalu lolos audit gate (§4.2) | Regenerate | Bila ChatGPT tetap membake checkerboard: prompt varian background hitam solid + skrip key (§4.2, jalur B). Chroma-key checkerboard abu-abu tidak disarankan (tepi antialias dan warna slate `#94A3B8` `staging-pad` dekat dengan abu-abu) |
| D2 | Icon langkah `nama` dan `IP` pada breadcrumb | SVG inline (address pill dan plat alamat titik-titik), tanpa generate baru | Generate batch-5 (2 icon PNG) agar gaya seragam dengan icon lain |
| D3 | Trim dan center semua PNG (crop ke glyph, pad persegi, tanpa resample) | Ya, sebelum wiring | Tidak; ukuran tampil tetap ±65–70% dari `w`×`h` dan geser tetap ada |
| D4 | Pasang 4 icon yang belum dipakai (`router-hop`, `dependency-chain`, `ssh-key`, `user-group`) | Ya, sebagai icon pengganti (§4.4) | Tunda; tetap SVG polos |
| D5 | Header `ADIB-DEV.COM` untuk topic seri yang sama (44, 81, 92, 93, 94) | Revisi terpisah, di luar 91 | Ikut dikerjakan sekarang |

Yang tidak berubah: 7 Act, durasi Act (`PHASES` 122 s), storyboard, SFX, `titleSegments`
(`SERVER` `#38BDF8` + ` ROLE` `#34D399`), subtitle, aturan Case Strip, dan koordinat station
(kecuali penyesuaian gap yang ditandai di §4.4 dan §4.5).

### 3.1 Header (poin 1)

`categorySegments` mengikuti `34` dan `60`: segmen 1 `INTRO_CATEGORY_LABEL + ' · '` warna `COLORS.MUTED`,
segmen 2 `INTRO_DOMAIN` warna Title A (`COLORS.CLIENT`, `#38BDF8`). Nilai `INTRO_DOMAIN = 'ADIB-DEV.COM'`
(bukan varian `WEB-DEMO.SERVICE` milik 65, karena 91 tidak punya domain demo sendiri).

### 3.2 Icon Act 5–7 (poin 2)

Batch-4 diganti dengan PNG transparan sungguhan, lalu di-wire. `ReleaseStack` ikut memakai icon
`release-package` (dua salinan: `v2` redup, `v1` aktif), karena saat ini polos walau batch-4 sudah ada.

### 3.3 Breadcrumb Act 2 (poin 3)

`Chip` breadcrumb diganti komponen `RouteChain`: enam langkah ber-icon dengan label di bawah, dihubungkan
panah yang tumbuh. Icon yang sama dengan objek asli di scene dipakai ulang (ringkasan visual, bukan
objek baru).

## 4. Desain detail

### 4.1 Header (poin 1)

| Aspek | Nilai |
|---|---|
| `data.js` | Tambah `export const INTRO_DOMAIN = 'ADIB-DEV.COM'` di samping `INTRO_CATEGORY_LABEL` |
| `Animation.jsx` | Impor `INTRO_DOMAIN`; ganti `category={INTRO_CATEGORY_LABEL}` menjadi `categorySegments={[{ label: INTRO_CATEGORY_LABEL + ' · ', color: COLORS.MUTED }, { label: INTRO_DOMAIN, color: COLORS.CLIENT }]}` |
| Teks tampil | `LINUX FUNDAMENTALS · ADIB-DEV.COM`, sama persis dengan topic 25/26/27/34/37/48/60 |
| Layout | Tagline berada di `header.taglineY = 50` (hero dan compact); tidak ada objek body di zona header |
| Cek | Frame hero (progress 0) dan compact (progress 1): tagline tidak terpotong dan tidak menabrak title |

### 4.2 Batch-4 dan pipeline aset (poin 2)

Urutan wajib: perbaiki aset dulu, baru wiring.

| Langkah | Isi |
|---|---|
| 1 | Perbarui `prompt` batch-4 di `icons/icons.json`: tambah "PNG with a real alpha channel; no checkerboard pattern, no white or gray background". Daftar icon, warna, dan slot kosong tidak berubah |
| 2 | Jalankan `vm-icon-generator` khusus batch-4 (bukan batch 1–3) |
| 3 | Audit gate per file: mode `RGBA`; empat piksel sudut alpha 0; piksel opaque < 40%; piksel abu-abu terang opaque ≈ 0%. Gagal satu file berarti regenerate batch, bukan satu per satu (05 §9.4) |
| 4 (jalur B, bila 2–3 gagal dua kali) | Prompt varian background hitam solid (#000000; aman karena style melarang fill hitam pada icon) lalu skrip one-off mengubah luminans menjadi alpha. Dicatat di plan sebelum dipakai |
| 5 | Backup PNG lama ke `icons/_originals/backup-ai-generated/` sebelum ditimpa (05 §9); nama file tetap sehingga `loader.js` tidak berubah |

Trim dan center (D3), skrip one-off baru `scripts/icon-postprocess.mjs` (mengikuti pola
`scripts/svg-to-png.mjs`; tidak menyentuh tiga salinan handler `/api/icons/generate`):

| Langkah | Isi |
|---|---|
| a | Tolak dan laporkan file yang gagal audit gate (tidak diperbaiki otomatis) |
| b | Nolkan alpha < 24 (menghapus haze dan residu tepi yang tercatat di §2.3) |
| c | Hitung bounding box glyph (alpha > 40), crop, pad ke persegi dengan margin 6%, tanpa resample |
| d | Tulis ulang dengan nama sama; bandingkan dimensi sebelum dan sesudah di log |

Setelah trim, sisi terpanjang glyph mengisi ±89% kanvas (margin 6% tiap sisi) dan glyph berada di tengah;
sekarang sisi terpanjang hanya ±65–90% kanvas dan bergeser. Semua `w`×`h` pada `<Icon>` wajib disetel
ulang dari rasio hasil trim (lihat §4.5); ini bagian dari eksekusi wiring, bukan tebakan sekarang.

Wiring setelah aset lolos:

| Komponen | Perubahan | Catatan |
|---|---|---|
| `loader.js` | Uncomment 7 import dan 7 entri `ICONS` batch-4, hapus catatan "ditahan" | Pola tetap 05 §6.1 |
| `MetricPanel` | Desain ulang: monitor sebagai icon di tengah, garis latency/error/CPU digambar di panel SVG relatif terhadap glyph; terima prop `linesOn`; garis muncul di 4.8 s, bukan sejak dashboard tampil | Layout final ditetapkan setelah PNG final terlihat; bounding box dihitung dari `center ± height/2` (05 Bab A) |
| `ReleaseStack` | Dua `release-package` (v2 redup, v1 aktif) + penunjuk; label versi tetap SVG | Menjadi icon pengganti isi child, timeline tidak berubah |
| `StagingPad`, `BackupVault`, `RestoreArea`, `RunbookDoc`, `PostureCard` | Hanya penyesuaian `w`×`h` dan offset overlay (centang, hitungan `120 = 120`, segel) | Timeline dan SFX tidak berubah (05 §6.4) |

### 4.3 Breadcrumb `RouteChain` (poin 3)

Enam langkah, urutan tetap: nama → DNS → IP → rute → 443 → service. Label teks tetap sama dengan
`BREADCRUMB` sekarang (font 12), ditaruh di bawah icon.

| # | Label | Icon | Jenis | Warna | Objek asal di scene |
|---|---|---|---|---|---|
| 1 | nama | Address pill: pil dengan kursor, tanpa teks | SVG inline (D2) | `#38BDF8` | Address bar di client |
| 2 | DNS | `dns-book` | PNG | `#22D3EE` | `DnsBook` |
| 3 | IP | Plat alamat: plat dengan empat kelompok titik dipisah sekat, tanpa angka | SVG inline (D2) | `#22D3EE` | Chip IP di client |
| 4 | rute | `internet-cloud` | PNG | `#94A3B8` | Cloud jalur jaringan |
| 5 | 443 | `listening-socket` | PNG | `#FBBF24` | `ListenSocket` di anchor |
| 6 | service | `web-app-card` | PNG | `#34D399` | App tile toko-web |

Layout (koordinat lokal `ContentBodyV1`, pusat x=366, dihitung sebelum coding):

| Elemen | Nilai |
|---|---|
| Pusat langkah | `x = 366 + (i − 2.5) × 112` → 86, 198, 310, 422, 534, 646 (sama dengan `Chip` sekarang) |
| Icon | 44×44, pusat `y = 820` (rentang 798–842) |
| Label | Font 12, baseline `y = 856` (bawah ≈ 860) |
| Panah penghubung | `y = 820`, dari `x_i + 28` ke `x_{i+1} − 28` (panjang 56) |
| Bounding box | x 61–671 (label terlebar `service` ≈ 50) dalam 0–732; y 798–862 di dalam closing zone (785–965) |
| Gap | Ke caption `breadcrumb` (baseline 900, atas ≈ 888): 26 ≥ 20. Ke badge anchor (bawah ≈ 715): 83. Antar label horizontal: 62 |

Ukuran 44 mengasumsikan D3 (glyph sudah di-trim). Tanpa D3, naikkan ke 56 agar glyph tampil ±40.

Timeline (Act 2, durasi 24 s tidak berubah; `crumbN` dan waktu nyala tetap):

| Waktu | Kejadian | Asal-usul |
|---|---|---|
| 16.2 | Enam langkah muncul redup (opacity 0.35) beserta panah putus-putus | Sudah ada redup lebih dulu (aturan asal-usul 3, revisi-01 §3.3) |
| 16.4 + i × 0.5 | Langkah i menyala penuh dan panah dari langkah i−1 tumbuh 0.3 s; SFX `TICK` seperti sekarang | Merangkum jalur yang baru dilalui |
| 18.9 – 19.4 | Semua menyala, hold; caption `breadcrumb` dan `cliffhanger` tidak berubah | |
| 22.0 – 23.9 | Fade bersama objek Act 2; reset state di 23.9 seperti sekarang | Seam |

Data: `BREADCRUMB` dipindah dari `Animation.jsx` ke `data.js` sebagai `BREADCRUMB_STEPS`
(`{ id, label, iconId | glyph, color }`), `iconId` disinkronkan dengan `icons/icons.json`. Rendering
langkah PNG memakai komponen `Icon`, sehingga `getIcon(id) === null` tetap jatuh ke fallback dashed
tanpa crash. Ini ringkasan visual, bukan action utama baru, jadi tidak menambah entri Causal Motion
Contract revisi-01 §8.

Frame audit: Act 2 pada 16.3 (skeleton redup), 17.4 (langkah 1–3 menyala, panah 3 tumbuh), 19.0 (semua menyala).

### 4.4 Icon yang belum terpasang (D4, opsional)

Semua berjenis icon pengganti (05 §6.4): timeline, SFX, dan station tidak berubah.

| Icon | Act | Yang diganti | Spesifikasi | Cek yang wajib |
|---|---|---|---|---|
| `router-hop` | 2 | Dua lingkaran hop di (300, 380) dan (366, 420) | Icon ±24–28 px di titik yang sama; menyala `COLORS.CLIENT` saat `hopN > i` | Hop kedua dekat `firewall-wall`; hitung ulang gap ≥ 20, geser hop dan `ROUTE_A`/`SKELETON` bersama bila kurang |
| `dependency-chain` | 3 | Dua lingkaran + panah di bawah `service-manager` | Icon lebar ±72×20 (rasio glyph ±3.8:1) sebagai dasar redup; dua titik status SVG (`dependencyOn`, `appOn`) tetap overlay | Jarak ke panel manager dan ke chip lifecycle |
| `ssh-key` | 4 | Lingkaran pulse `ssh-key` (client ke gate, baris 400) | `Pulse` menerima `iconId` opsional; icon ±26 px menggantikan lingkaran, label teks tetap | Pulse bergerak; tidak ada objek statis baru |
| `user-group` | 4 | Isi `Chip` `group: ops` | Icon ±18 px di kiri teks chip; teks tetap | Gap chip ke kartu `guest` (≥ 20) |

### 4.5 Risiko yang ikut dari D3 (trim dan center)

Setelah trim, glyph mengisi hampir seluruh kotak `w`×`h`, jadi objek tampil lebih besar dari sekarang
dan gap yang sudah tipis menjadi lebih tipis. Contoh hasil hitung dari kode saat ini:

| Pasangan | Sekarang | Setelah trim (perkiraan) | Tindakan saat eksekusi |
|---|---|---|---|
| Chip lifecycle (y 401–423) dan `service-manager` (pusat y=470, `h=90`) | Atas glyph ≈ 433, gap ≈ 10 (sudah < 20) | Atas glyph ≈ 430, gap ≈ 7 | Kecilkan `h` atau geser chip sampai gap ≥ 20 |
| Hop kedua dengan icon `router-hop` 28 px (y 406–434) dan `firewall-wall` (pusat y=470, `h=80`) | Atas glyph ≈ 449, gap ≈ 15 | Atas glyph ≈ 434, gap ≈ 0 | Geser hop dan `ROUTE_A`/`SKELETON` bersama, atau kecilkan icon |

Semua `<Icon>` dihitung ulang dalam satu tabel "ukuran lama → baru" sebelum menyentuh JSX; angka di
atas hanya perkiraan dari pembacaan kode.

## 5. Dampak pada file saat eksekusi disetujui

| File | Rencana, belum dikerjakan |
|---|---|
| `data.js` | Tambah `INTRO_DOMAIN`; tambah `BREADCRUMB_STEPS`; hapus field yang tidak lagi dirender |
| `Animation.jsx` | Header memakai `categorySegments`; tambah `RouteChain` menggantikan `Chip` breadcrumb Act 2; desain ulang `MetricPanel` (+ prop `linesOn`); `ReleaseStack` ber-icon; setel ulang `w`×`h` semua `<Icon>`; (D4) `Pulse` menerima `iconId`, icon pengganti hop/chain/group |
| `icons/icons.json` | Perbarui `prompt` batch-4 (wording alpha asli); (D2 alternatif) tambah batch-5 |
| `icons/*.png` | Batch-4 diganti hasil regenerate; semua PNG di-trim dan center (backup di `icons/_originals/backup-ai-generated/`) |
| `icons/loader.js` | Uncomment 7 import dan 7 entri batch-4 |
| `scripts/icon-postprocess.mjs` | Baru, one-off: audit gate dan trim (tidak mengubah handler `/api/icons/generate`) |
| `manifest.js`, `metadata.json`, registry | Tidak berubah |
| `_docs/LINUX_SERVER_PLAN.md` | Sinkronkan keputusan header, breadcrumb, dan status icon |
| `docs/standardizations/03` §1.Q | (Bila D5 disetujui) tambah satu baris: header seri memakai `categorySegments` dengan segmen domain `ADIB-DEV.COM` |

Dokumen ini hanya plan. Tidak ada file implementasi, aset, atau konfigurasi yang diubah.

## 6. Validation gate dan acceptance criteria

- [ ] Header 91 menampilkan `LINUX FUNDAMENTALS · ADIB-DEV.COM` pada hero dan compact, domain berwarna `#38BDF8`, tanpa teks terpotong atau menabrak title.
- [ ] `ADIB-DEV.COM` dikecualikan dari acceptance "tanpa domain nyata" revisi-01 (identitas seri, bukan domain kasus); kasus tetap hanya `toko.example` dan `203.0.113.10`.
- [ ] Ketujuh PNG batch-4 lolos audit gate (RGBA, sudut alpha 0, opaque < 40%, abu-abu terang opaque ≈ 0%) dan terbaca pada `#070913`.
- [ ] Tidak ada kotak dashed fallback yang tampil di Act 2, 5, 6, dan 7 saat semua PNG hadir; fallback tetap jalan bila satu PNG dihapus.
- [ ] Breadcrumb Act 2 berupa enam langkah ber-icon dengan label 12 px, koordinat sesuai §4.3, gap ke caption ≥ 20, tidak ada elemen terpotong `clip`.
- [ ] Semua pasangan objek yang dihitung di §4.5 punya gap ≥ 20 setelah `w`×`h` disetel ulang.
- [ ] Garis grafik `MetricPanel` muncul di 4.8 s (bukan sejak dashboard tampil).
- [ ] Icon terpasang tidak menambah teks, angka, wajah, atau logo brand di dalam PNG; semua teks dinamis tetap SVG.
- [ ] Durasi Act dan SFX tidak berubah; reset state deterministik tiap loop; tidak ada `?` pada caption, font ≥ 11.
- [ ] Dead field audit `data.js` dan `Animation.jsx` bersih setelah `BREADCRUMB` dipindah.

## 7. Checklist eksekusi (numbering hierarki)

Status per 2026-09-20: `[x]` selesai, `[~]` sebagian (catatan di baris), `[ ]` belum. D1–D5 memakai default §3.

- [ ] 1. Persetujuan
  - [x] 1.1. Review revisi ini dan putuskan D1–D5 — disetujui, default D1–D5
- [ ] 2. Header domain (poin 1)
  - [x] 2.1. Tambah `INTRO_DOMAIN` di `data.js` — selesai
  - [x] 2.2. Ganti `category` menjadi `categorySegments` di `Animation.jsx` — selesai; terverifikasi frame hero (LINUX FUNDAMENTALS · ADIB-DEV.COM)
  - [x] 2.3. Compile check — selesai; dev server + screenshot frame tanpa error
- [ ] 3. Aset icon
  - [x] 3.1. Perbarui prompt batch-4 di `icons/icons.json` — selesai (prompt + daftar inline_svg_only)
  - [ ] 3.2. Regenerate batch-4 lewat `vm-icon-generator`
  - [~] 3.3. Audit gate tiap file; regenerate batch bila ada yang gagal — skrip `scripts/icon-postprocess.mjs` siap; audit batch-4 = 7 FAIL (checkerboard). Catatan: gate opaque<40% memberi false-fail pada PNG yang sudah di-trim (server-rack, vm-partition, web-app-card) — jalankan gate hanya pada PNG mentah
  - [~] 3.4. Backup PNG lama ke `icons/_originals/backup-ai-generated/`, lalu trim dan center semua PNG (D3) — trim batch 1–3 selesai (21 backup ada); batch-4 menunggu regenerate
  - [ ] 3.5. (Kondisional D2) Generate batch-5 untuk `nama` dan `IP`
- [ ] 4. Wiring
  - [ ] 4.1. Uncomment batch-4 di `loader.js`
  - [ ] 4.2. Tabel ukuran lama ke baru semua `<Icon>`, lalu setel ulang `w`×`h` dan hitung gap (§4.5)
  - [~] 4.3. Desain ulang `MetricPanel` dan tambah prop `linesOn` — prop `linesOn` sudah dihormati (garis muncul 4.8 s); desain ulang layout menunggu PNG final
  - [~] 4.4. `ReleaseStack` memakai `release-package` — `ReleaseStack` sudah memakai `release-package` (fallback dashed sampai PNG ada)
  - [x] 4.5. `RouteChain` dan `BREADCRUMB_STEPS` menggantikan `Chip` breadcrumb Act 2 — selesai; `RouteChain` + `BREADCRUMB_STEPS`; terverifikasi frame a2@17.4 dan a2@19.0
  - [ ] 4.6. (D4) Icon pengganti `router-hop`, `dependency-chain`, `ssh-key`, `user-group`
  - [~] 4.7. Compile check tiap komponen yang diubah — compile check via vite dev + screenshot untuk yang sudah diubah
- [ ] 5. Verifikasi
  - [ ] 5.1. Preview manual: header hero dan compact; Act 2 pada 16.3, 17.4, 19.0; Act 5 dashboard; Act 6 pada 9.4, 13.6, 17.0; Act 7 empat pilar
  - [ ] 5.2. Preview dengan satu PNG dihapus untuk memastikan fallback
  - [ ] 5.3. Audit copy, font, dan dead field (sesuai revisi-01 §10.1)
  - [ ] 5.4. Export MP4 test
- [ ] 6. Dokumen
  - [ ] 6.1. Update `revisi/README.md` (status revisi-02; sinkronkan status revisi-01 dengan kondisi kode)
  - [ ] 6.2. Sinkronkan `_docs/LINUX_SERVER_PLAN.md`
  - [ ] 6.3. (D5) Tambah aturan segmen domain di `03` §1.Q dan buat revisi terpisah untuk 44, 81, 92, 93, 94
  - [ ] 6.4. Checklist Sebelum Commit (03) dan checklist kontrak folder (02 §7)

## 8. Status test (kontrak revisi)

| Item | Status |
|---|---|
| Audit piksel 28 PNG (mode, opaque, offset glyph, residu tepi) | Sudah dijalankan; data di §2.2 dan §2.3 |
| Bundle esbuild `Animation.jsx` dengan 21 PNG ter-wire | Lolos; `vite build` penuh gagal karena `84-network-ports` (`SFX_MAP` tidak di-export), bukan dari 91 |
| Perbandingan pola header antar topic | Dari pembacaan kode, bukan preview |
| Angka gap di §4.3 dan §4.5 | Hitungan dari kode dan bounding box glyph; belum diverifikasi preview |
| Preview manual dan export test | Belum (plan only) |
