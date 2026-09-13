# PLAN-11 — Pelajaran REST API 17 untuk Standarisasi Konten

Tanggal: 2026-09-12
Status: PLAN ONLY — belum mengubah file standar maupun kode topic.

## 1. Tujuan

Topic 17 REST API mengalami banyak perbaikan berturut-turut: dari alur GET
sederhana, epilog method, representasi kartu user, pemadatan Act, sampai
kebutuhan loading state, tiga user, safe layout, dan identitas seri Networking.

Tujuan plan ini adalah mengubah pelajaran tersebut menjadi aturan yang dapat
dipakai sebelum topic berikutnya dibuat, sehingga:

- keputusan narasi, visual, state data, asset, dan layout diambil sebelum coding;
- revisi besar yang seharusnya bisa diprediksi tidak berulang;
- proses membuat content lebih cepat karena urutan keputusan sudah jelas;
- hasil pertama lebih dekat dengan kebutuhan visual akhir.

Dokumen ini adalah rencana untuk memperbarui standardisasi. Tidak satu pun
file dalam daftar target diubah pada tahap ini.

## 2. Bukti dan Batas Audit

Jejak dokumen eksplisit yang tersedia untuk REST API adalah Revisi 04 sampai
Revisi 07, ditambah baseline topic dan execution plan. Pelajaran Revisi 01–03
dipahami dari baseline yang menghasilkan alur GET linear/pure SVG dan dari
masalah yang kemudian diperbaiki; detail historis yang tidak tercatat tidak
boleh diarang.

| Tahap | Pelajaran yang terbukti |
|---|---|
| Baseline / Revisi awal | Satu flow GET memang mudah dipahami, tetapi representasi box/text murni tidak cukup untuk menjelaskan data dan method mutasi |
| Revisi 04 | Menambah nama method saja tidak menjelaskan apa yang dibuat, diganti, diubah, atau dihapus |
| Revisi 05 | Data teknis perlu menjadi objek fisik/visual yang dapat dimutasi; endpoint dan server perlu konteks lokasi yang sama |
| Revisi 06 | Timing dan continuity adalah bagian dari materi: ticket yang diam atau hilang membuat audiens bingung; method mutasi harus dikirim dari browser juga |
| Revisi 07 | Identitas seri, loading state, status data sebelum/sesudah response, beberapa user, asset state-pair, dan safe-zone layout harus ditetapkan dari awal |

## 3. Ringkasan Pelajaran yang Menjadi Standar Baru

### 3.1 Mulai dari state penonton, bukan dari label konsep

Untuk content request-response, tentukan dahulu apa yang diketahui client sebelum
request, apa yang belum diketahui, serta apa yang berubah setelah response.

Contoh REST API:

- Sebelum GET: browser hanya loading profile; data Adib belum boleh terlihat.
- Sesudah GET: profile Adib baru muncul karena response 200 telah tiba.
- Sebelum POST: form user baru ada di browser.
- Sesudah POST: user baru masuk ke cabinet dan browser menerima confirmation.
- PUT: satu card penuh berganti.
- PATCH: hanya layer/field tertentu pada card berubah.
- DELETE: card yang sebelumnya dibuat benar-benar keluar ke archive dan slot kembali kosong.

Pelajaran umum: jangan menampilkan hasil sebelum sebab visualnya terjadi.

### 3.2 Setiap method harus memiliki benda, asal, perjalanan, dan akibat

Method HTTP tidak boleh hanya menjadi badge atau string.

Setiap method perlu menjawab empat pertanyaan sebelum implementasi:

| Pertanyaan | Contoh REST API |
|---|---|
| Benda apa yang dibawa? | mini profile card, full profile card, atau role badge |
| Dari mana ia berangkat? | tombol atau form di browser |
| Ke mana ia pergi? | Gate lalu Processor di API Service |
| Apa akibat fisiknya? | card dibuat, full card diganti, badge diubah, atau card diarsipkan |

Jika salah satu jawaban belum ada, method belum siap dianimasikan.

### 3.3 Continuity adalah kontrak, bukan polish akhir

Objek request harus terlihat terus sebagai rantai sebab-akibat:

Browser UI → ticket lahir → ticket bergerak → gate → processor → mutasi →
response → browser berubah.

Ticket tidak boleh di-pop-out di gate lalu processor muncul setelah jeda.
Jika objek perlu berubah bentuk, frame transisi harus menunjukkan transformasi
atau handoff yang eksplisit.

### 3.4 Layout perlu zona yang direncanakan, bukan offset spontan

Header, badge, browser, transit, dan service mempunyai kebutuhan ruang tetap.
Objek besar yang diletakkan hanya dari feeling rawan menabrak subtitle atau
badge pada frame berbeda.

Setiap topic bertingkat wajib memiliki diagram zona vertikal serta koordinat
bounding box sebelum JSX besar dibuat.

### 3.5 Asset harus direncanakan per state, bukan per noun

Satu avatar tidak cukup jika cerita butuh student menjadi professional atau
rambut hitam menjadi ungu. Asset plan harus mencatat pasangan state yang
framing, pose, dan proporsinya kompatibel untuk transformasi.

Aset gambar dipakai untuk siluet/karakter. Teks data yang berubah, seperti
nama, umur, role, method, dan status, tetap dirender SVG/JSX.

### 3.6 Identitas seri harus dikunci sebelum title/intro dibuat

Kategori, palet, header format, dan referensi series tidak boleh baru berubah
setelah timeline selesai. Jika content adalah bagian dari seri Networking,
maka tagline, metadata, title colors, dan motif visual harus mengikuti seri
itu sejak plan awal.

## 4. File Standardisasi yang Rencananya Diupdate

| Prioritas | File target | Perubahan yang direncanakan | Alasan |
|---:|---|---|---|
| 1 | docs/standardizations/03-planning-storytelling-quality-gate.md | Tambah kontrak pre-planning untuk state data, continuity, safe-zone, identity series, dan visual method | Ini file anti-pattern/pre-planning; paling tepat menjadi sumber aturan pencegahan revisi |
| 2 | docs/standardizations/03-planning-storytelling-quality-gate.md | Ubah urutan kerja menjadi gate wajib sebelum coding dan sebelum asset generation | Tutorial adalah jalur praktis yang dibaca saat membuat topic |
| 3 | docs/standardizations/04-motion-gsap-reference.md | Tambah pola request lifecycle, persistent anchor, handoff transform, dan timing anti-hold | Masalah REST API banyak terjadi pada timeline, bukan syntax GSAP |
| 4 | docs/standardizations/05-svg-layout-asset-pipeline.md | Tambah safe-zone layout, bounding box, header/badge/content separation, dan label yang menempel objek | Collision browser dengan subtitle adalah masalah SVG layout |
| 5 | docs/standardizations/05-svg-layout-asset-pipeline.md | Tambah state-pair asset planning, character consistency, dynamic text rule, dan visual mutation assets | Icon batch perlu mencakup transformasi dari awal |
| 6 | docs/standardizations/02-topic-contract-scene-shell.md | Tambah kontrak minimal untuk plan/revision traceability dan metadata identity consistency | Folder/metadata harus menyimpan sumber kebenaran yang tidak saling bertentangan |
| 7 | docs/standardizations/01-architecture-runtime.md | Tambah ringkasan hubungan timeline state, persistent objects, dan preview gates | Hanya tambahan ringan agar arsitektur menjelaskan mengapa state continuity penting |

File yang tidak perlu diubah oleh plan ini:

- 07-plan-single-service: tidak berkaitan dengan storytelling atau visual.
- 08-audio-sfx-generation: audio tetap mengikuti standar yang sudah ada;
  tidak ada pelajaran REST API yang cukup kuat untuk mengubah pipeline audio.
- README standardizations: hanya diperbarui jika urutan baca atau nama dokumen
  baru berubah setelah perubahan di atas disetujui.

## 5. Rencana Isi untuk 09-standar-pembuatan-konten

File 09 menjadi perubahan paling besar. Rencana menambahkan enam section baru.

### A. Content State Contract, wajib sebelum storyboard

Template wajib untuk topic yang memiliki request, transformasi, atau data:

| State | Yang penonton lihat | Yang belum boleh terlihat | Pemicu perubahan | Hasil |
|---|---|---|---|---|
| Client awal | loading/empty/form | data final | click user | request lahir |
| Request transit | ticket/paket | result/response | ticket masuk gate | processor aktif |
| Service proses | resource/card | browser final | data ditemukan/mutasi | response dibuat |
| Client akhir | response/result | state lama | response tiba | UI berubah |

Aturan: suatu data tidak boleh terlihat pada client sebelum response atau
sebab visual yang logis terjadi.

### B. Method Visualization Contract

Tambahkan checklist wajib untuk masing-masing method:

- resource atau benda yang diproses;
- control UI yang memicu request;
- payload visual;
- target lokasi/service;
- mutasi fisik yang bisa dilihat;
- status response;
- state browser setelah response.

Do: gunakan POST untuk card baru masuk, PUT untuk full card replacement,
PATCH untuk satu layer/field, DELETE untuk card yang sama menuju archive.

Dont: tampilkan method sebagai badge tunggal atau morph text tanpa menyatakan
benda yang berubah.

### C. Continuity and No-Teleport Contract

Tambahkan do/dont yang eksplisit.

Do:

- tampilkan destination node dari awal dalam keadaan redup jika ia akan
  menjadi tujuan request;
- gunakan persistent id/state untuk browser, service hub, dan resource;
- buat request berpindah melalui setiap node;
- gunakan transform/handoff saat object berubah bentuk;
- mulai Act berikutnya pada posisi object saat ini.

Dont:

- popOut request di perantara lalu munculkan processing setelah beberapa detik;
- reset canvas saat transition Act;
- menyembunyikan actor penting sampai ia tiba-tiba diperlukan;
- membiarkan object diam tanpa alasan naratif.

Tambahkan hold budget default:

| Jenis jeda | Batas awal |
|---|---:|
| click ke request berangkat | 0,25 detik |
| gate ke processor | 0,35 detik |
| response tiba ke request berikutnya | 0,40 detik |
| hold membaca perubahan penting | 0,8–1,8 detik |

Batas ini adalah titik audit awal, bukan aturan buta; perubahan kompleks boleh
melewati batas jika alasan keterbacaan ditulis di plan.

### D. Act Design Contract

Tambahkan aturan:

- satu Act harus berakhir ketika unit pemahaman selesai, bukan karena
  diperlukan nomor Act baru;
- jangan membuat epilog khusus yang hanya menampilkan daftar method jika
  tiap method dapat dijadikan action dari client;
- semua Act wajib punya entry state dan exit state;
- tulis object yang tetap hidup saat Act berubah;
- untuk topic pendek, targetkan tiga sampai lima Act; lebih dari itu harus
  punya alasan cerita tertulis.

### E. Series Identity Contract

Tambahkan preflight:

- topic ini bagian dari seri apa;
- kategori intro dan category manifest;
- palette title/header;
- reference topic yang dipakai;
- alasan jika menyimpang dari format seri.

Do: catat referensi yang ditiru secara spesifik, misalnya hero-to-header
lerp Tailscale tanpa typing.

Dont: menyalin effect secara parsial tanpa menyalin struktur layout atau
hierarki yang membuat effect tersebut berhasil.

### F. Safe-Zone Layout Contract

Tambahkan template zona:

| Zona | y start-end | Elemen yang boleh | Elemen yang dilarang |
|---|---|---|---|
| Header | ... | title/subtitle | panel konten |
| Navigation | ... | badge/dot | resource card |
| Content | ... | actor utama | header |
| Transit | ... | moving packet | text panjang |
| Service/result | ... | proses/response | header |

Wajib mencatat bounding box objek terbesar, terutama browser/card/panel,
dan memeriksa collision pada hero, setiap Act, serta closing.

## 6. Rencana Isi untuk 03-tutorial-buat-topic-baru

Tutorial perlu mendapatkan urutan wajib yang lebih operasional. Rencana
menambahkan section sebelum mulai data.js dan Animation.jsx.

### Urutan wajib baru

1. **Identitas topic**
   - tentukan seri, kategori, palette, referensi header, dan metadata.
2. **Audience promise**
   - tulis satu kalimat: setelah menonton, apa yang dapat dipahami audiens.
3. **State/data contract**
   - buat tabel client awal → request → service → response → client akhir.
4. **Storyboard dan act map**
   - untuk setiap Act: tujuan, entry state, motion, exit state, object
     persistent, serta durasi.
5. **Continuity map**
   - gambar jalur semua actor utama lintas Act; tandai handoff/transform.
6. **Visual data model**
   - tetapkan user/card/object nyata dan field visual yang dapat berubah.
7. **Layout map**
   - tetapkan header, badge, content, transit, service, safe gutter.
8. **Asset matrix**
   - tentukan asset normal, state alternate, pair transform, dan dynamic text.
9. **Timeline budget**
   - tulis timing tiap beat; tandai hold yang memang punya alasan.
10. **Review gate sebelum coding**
    - lakukan review dokumen; coding hanya boleh dimulai bila semua bagian
      di atas lengkap.
11. **Implementasi bertahap**
    - header/layout anchor dulu, lalu request flow, lalu mutation, lalu SFX.
12. **Validation gate**
    - compile, static audit, preview manual transitions, export test.
13. **Revision documentation**
    - jika ada feedback, buat revision plan yang menyebut state/timing/object
      terdampak sebelum mengubah kode.

Tambahkan template checklist yang setiap itemnya bisa diberi status Draft,
Approved, Implemented, Verified Manual, atau Blocked.

## 7. Rencana Isi untuk 04-referensi-gsap

Tambahkan pola GSAP yang langsung mencegah masalah REST API.

### A. Persistent anchor helper

Dokumentasikan bahwa actor utama harus memiliki id render yang sama dari
muncul sampai closing. Yang boleh berubah adalah position, opacity,
transform, dan state tampilan; bukan identity object.

### B. Request lifecycle helper

Tambahkan pseudocode/struktur helper dengan tahap:

1. spawn dari UI source;
2. depart;
3. travel ke gate;
4. ingress ke processor;
5. process/mutate;
6. build response;
7. return ke UI;
8. resolve UI state.

Helper harus mengembalikan waktu selesai agar request berikutnya dimulai dari
event sebelumnya, bukan dari PHASE duration yang mungkin masih menyisakan hold.

### C. Handoff transform

Dokumentasikan kondisi saat ticket menjadi resource atau response:

- kedua visual overlap minimal satu frame;
- state target aktif pada saat source mulai keluar;
- tidak boleh ada 0-opacity gap;
- gunakan scale/glow/position short tween, bukan unmount lalu mount jauh.

### D. Timeline audit

Tambahkan audit sebelum preview:

- cari setiap popOut dan pastikan terdapat destination object/transition;
- cari setiap PHASE duration dan bandingkan dengan event terakhir;
- tandai gap lebih dari batas hold;
- cek repeat reset mengembalikan semua state data, bukan hanya phase index.

## 8. Rencana Isi untuk 05-svg-text-guide

Tambahkan section Layout System for Animated SVG.

Isi rencana:

- definisi safe-zone dan coordinate constants;
- aturan bounding box untuk panel/asset yang berubah ukuran;
- header, phase navigation, content, transit, service, dan closing zone;
- formula gap minimum antar zona;
- aturan text menempel pada actor/path;
- checklist anti-collision pada masing-masing phase;
- contoh title hero menjadi compact header tanpa mengganti elemen.

Do:

- gunakan konstanta seperti HEADER_ZONE, BADGE_ZONE, BROWSER_ZONE;
- ukur top/bottom panel berdasarkan center dan height;
- cek pada ukuran canvas export sebenarnya.

Dont:

- letakkan panel besar pada y tetap tanpa memeriksa tinggi panel;
- gunakan nested translate berkali-kali tanpa coordinate reference;
- tempatkan caption global di zona header.

## 9. Rencana Isi untuk 06-icon-generation

Tambahkan section Asset State Matrix.

Template baru:

| Asset identity | State A | State B | Apa yang boleh berubah | Apa yang harus sama |
|---|---|---|---|---|
| Adib | student, rambut hitam | professional, rambut ungu | pakaian, rambut, badge | wajah direction, framing, scale |
| Jokowo | student | professional | outfit/role layer | card position, avatar pose |
| Resource card | filled | archived | content/opacity | slot cabinet location |

Aturan baru:

- asset state yang akan ditransformasi harus direncanakan dalam batch sama
  atau prompt berpasangan;
- tulis pose, framing, proporsi, dan bagian yang satu-satunya boleh berubah;
- nama/umur/status/method yang dinamis tidak dibakar pada asset gambar;
- gunakan 2 × 4 atau batch terpisah untuk menjaga ketajaman;
- asset harus diuji pada ukuran render target sebelum timeline final dibuat;
- karakter memakai desain generik, bukan kemiripan public figure, kecuali
  scope meminta dan mengizinkan secara eksplisit.

## 10. Rencana Isi untuk 02 dan 01

### 02-standar-konten

Tambahkan aturan minimal:

- file plan topic harus menyebut identity series, state contract, asset matrix,
  layout map, dan validation gate untuk topic kompleks;
- revision file harus menyebut perubahan state, layout, asset, timeline, dan
  test status;
- metadata manifest dan metadata pendamping diverifikasi agar kategori/title
  tidak bertentangan.

### 01-architecture

Tambahkan diagram singkat:

UI source → GSAP timeline → React visual state → SVG render → Export frame.

Tekankan: timeline state harus melacak state naratif, bukan hanya opacity;
karena itu state seperti loading, request location, resource mutation, dan
response received harus reset dengan bersih pada loop berikutnya.

## 11. Do dan Dont Ringkas untuk Semua Topic

### DO

- Tentukan apa yang belum diketahui client sebelum request.
- Tampilkan trigger UI sebelum packet/request lahir.
- Rancang tiap method sebagai benda yang bergerak dan berubah.
- Tampilkan service destination dari awal bila ia penting bagi cerita.
- Rancang persistent actor dan exit/entry state per Act.
- Kunci kategori, palette, dan header reference sebelum code.
- Buat layout safe-zone serta bounding box sebelum JSX besar.
- Rencanakan asset normal dan asset state perubahan bersamaan.
- Validasi compile, gap timeline, collision, preview manual, dan export.
- Dokumentasikan feedback sebagai revision plan sebelum melakukan refactor besar.

### DONT

- Jangan tampilkan data hasil sebelum GET response tiba.
- Jangan jadikan POST/PUT/PATCH/DELETE hanya tulisan atau badge.
- Jangan biarkan request menghilang di tengah alur tanpa handoff.
- Jangan menambah Act untuk menyelesaikan masalah yang sebenarnya bisa menjadi
  motion/action dalam Act yang sama.
- Jangan membuat asset baru di tengah implementasi tanpa memperbarui asset matrix.
- Jangan memakai offset layout ad-hoc hingga header dan content bertabrakan.
- Jangan mengubah identitas seri, kategori, atau palette setelah timeline
  hampir selesai tanpa mereview dampaknya.
- Jangan menandai preview/export selesai hanya karena compile berhasil.

## 12. Urutan Eksekusi Saat Plan Ini Disetujui

Tahap ini sengaja belum dilakukan.

1. Review dan setujui PLAN-11 ini.
2. Update 09 terlebih dahulu sebagai sumber aturan anti-pattern.
3. Update 03 agar tutorial baru mengarahkan workflow yang sama.
4. Update 04 dan 05 untuk implementasi timeline/layout.
5. Update 06 untuk asset state matrix.
6. Update 02 dan 01 sebagai kontrak/ringkasan pendukung.
7. Perbarui README standardizations hanya jika urutan baca berubah.
8. Lakukan cross-reference: semua dokumen menyebut istilah yang sama.
9. Gunakan checklist baru pada topic baru berikutnya sebagai pilot.
10. Setelah satu topic pilot selesai, catat apakah aturan mengurangi jumlah revisi sebelum mengubah standar lagi.

## 13. Kriteria Sukses Plan

Plan ini dianggap berhasil setelah implementasi standar nantinya membuat creator
dapat menjawab semua pertanyaan berikut sebelum coding:

- Apa state client sebelum dan sesudah request?
- Objek fisik apa yang mewakili tiap data/method?
- Dari mana request berangkat, melalui node apa, dan bagaimana response kembali?
- Apa yang tetap terlihat lintas Act?
- Bagaimana layout memastikan header, badge, dan content tidak bertabrakan?
- Asset state apa yang dibutuhkan untuk tiap perubahan visual?
- Apa kategori/seri/palette topic dan referensi formatnya?
- Hold mana yang diperlukan untuk pemahaman, dan hold mana yang harus dihapus?
- Tes manual apa yang wajib dilakukan sebelum menyatakan video siap?
