# Analisa & Plan: Update Dokumentasi Standar dari Pelajaran Revisi 01 & 02 (container-docker)

**Status: ANALISA + PLAN SAJA, BELUM DIEKSEKUSI.** Scope: baca ulang
`src/content/container-docker/revisi/2026-09-07-0802-revisi-01.md`
(icon) dan `.../2026-09-07-0909-revisi-02.md` (SFX), tarik semua
pelajaran yang sifatnya **generik/reusable** (bukan spesifik ke topic
container-docker), lalu petakan ke file `docs/standardizations/*` mana
yang perlu section baru supaya topic BERIKUTNYA tidak mengulangi bug/
gap yang sama. File ini cuma daftar "apa yang perlu diupdate di mana",
BUKAN isi lengkap update-nya — itu task eksekusi terpisah nanti.

---

## 0. Ringkasan Eksekutif

Dari 2 file revisi ditemukan **10 temuan** (4 dari revisi-01, 6 dari
revisi-02) yang semuanya punya sifat "bisa terulang di topic manapun",
bukan cuma masalah sekali-pakai di container-docker. Tidak satupun dari
10 temuan ini sudah terdokumentasi di `docs/standardizations/` saat ini
— sudah dicek via grep, nihil hasil untuk kata kunci terkait (badge
overlap formula, popIn sfxCategory, AI-icon vs real-logo decision,
folder `revisi/`).

Rekomendasi utama: **update 4 file existing** (06, 05, 04, 03) +
**pertimbangkan 1 file baru** (SFX/audio generation guide, mirror dari
`06-icon-generation.md`) + **1 keputusan kecil** soal folder `revisi/`
di `02-standar-konten.md`.

---

## 1. Ringkasan Temuan per Revisi

### 1.1 Dari Revisi 01 (Icon)

| # | Temuan | Kenapa berbahaya kalau tidak didokumentasikan |
|---|---|---|
| **A** | Icon brand terkenal (Node, Python, Redis, Docker whale) di-generate AI sengaja generik untuk hindari trademark — hasilnya kurang dikenali audiens. Solusi: download logo asli dari Devicon (full-color, MIT) / Simple Icons (monokrom, CC0). | Tidak ada kriteria kapan pakai AI-generate vs kapan download logo asli di `06-icon-generation.md` — topic berikutnya bisa mengulang generate AI utk logo terkenal padahal seharusnya download asli, atau sebaliknya kena masalah trademark karena asal pakai logo resmi tanpa cek lisensi. |
| **B** | 13 momen teks (Badge/TextCard) di 5 Act tidak punya icon pendamping sama sekali, padahal ini momen penting (insight, trade-off, payoff). Ternyata `Badge`/`TextCard` dari awal TIDAK punya prop `icon` opsional — beda dari `DiagramBox` yang sudah punya dari awal. | Kalau prop `icon` tidak jadi standar wajib di SEMUA komponen text-container sejak awal (bukan cuma `DiagramBox`), topic baru akan mengulang retrofit yang sama: audit manual di akhir, lalu tambal beramai-ramai. |
| **C** | Bug layout: 2 Badge bertetangga (`namespaceLabel` & `cgroupLabel`) numpuk karena jarak antar-anchor (220px) lebih kecil dari total setengah-lebar keduanya (150+150=300px). Formula: Badge di-render dari x=0..w lalu di-translate `x=-w/2` di call site → efektif center di anchor dengan radius `w/2`. | Tidak ada formula "cek overlap antar-elemen horizontal" di `05-svg-text-guide.md`. Bug serupa nyaris pasti terulang tiap kali ada ≥2 elemen fixed-width sejajar — baru ketahuan lewat eyeball di preview atau (seperti kasus ini) baru disadari saat audit manual jauh setelah commit. |
| **D** | *(Operasional)* Sandbox `bash_tool` Claude tidak bisa akses `cdn.jsdelivr.net` / `commons.wikimedia.org` — download logo/asset eksternal WAJIB lewat `Desktop Commander:start_process` (terminal asli), bukan sandbox. | Sudah disebut sekilas di revisi-01 §3, tapi belum masuk dokumentasi resmi manapun. Kalau Claude lain/next-session coba curl dari sandbox, akan gagal tanpa tahu kenapa & solusinya. |

### 1.2 Dari Revisi 02 (SFX)

| # | Temuan | Kenapa berbahaya kalau tidak didokumentasikan |
|---|---|---|
| **E** | 9 dari 28 entry `SFX_MAP` di `data.js` didefinisikan tapi **tidak pernah dipanggil** di `Animation.jsx` — dead config yang baru ketahuan lewat audit manual silang. | Tidak ada checklist "cross-check SFX_MAP vs pemanggilan aktual" di manapun — `data.js` dan `Animation.jsx` bisa terus divergen diam-diam di topic mana pun. |
| **F** | Pola `sfx: false` dipakai berulang di banyak `popIn()` TANPA `sfxOn()` pengganti di dekatnya — hasilnya banyak motion (termasuk yang paling dramatis: meter RAM naik 2.6 detik) **total silent** tanpa disengaja. | Tidak ada *policy* eksplisit kapan boleh silent vs wajib ada SFX. Keputusan `sfx:false` selama ini ad-hoc per-baris kode, gampang lupa ditinjau ulang. |
| **G** | **Bug nyata** di helper `popIn()`: hardcode manggil `sfxLoader.ui(...)` (kategori `'ui'` SAJA) untuk semua `sfxName`, padahal SFX kategori lain (`impacts/`, `transitions/`, dst) butuh kategori berbeda. Akibat: 2 SFX baru (`CONNECTOR_SNAP`, `LIGHT_SWOOSH`) gagal main **secara silent** (di-catch tanpa error) — sudah diperbaiki dgn menambah param `sfxCategory` eksplisit. | Ini bug paling berbahaya dari semua temuan — silent failure (tidak ada console error) di helper yang dipakai berkali-kali di seluruh timeline. Kalau pola `popIn()` di-copy ke topic baru dengan bug yang sama, tiap SFX non-'ui' berisiko gagal tanpa ketahuan sampai preview manual yang teliti. |
| **H** | 13 file audio SUDAH ADA di `public/audio/*/` (kepakai topic lain / sisa batch awal) tapi tidak diketahui/dipakai container-docker sampai diaudit manual. | Tidak ada langkah wajib "scan `public/audio/*/` untuk asset yang sudah ada" sebelum download/generate SFX baru — boros waktu & storage kalau tiap topic baru selalu mulai dari nol. |
| **I** | *(Operasional)* Sama seperti temuan D — download SFX dari situs eksternal (kenney.nl, mixkit.co, freesound.org) juga WAJIB lewat `Desktop Commander:start_process`, bukan sandbox. | Sama seperti D, pola berulang yang belum resmi didokumentasikan sebagai aturan umum "semua eksternal asset download" (bukan cuma icon). |
| **J** | *(Proses BAIK, bukan bug)* Metodologi revisi-02: baca ulang FULL timeline `useEffect` MASTER TIMELINE baris per baris, list semua `popIn`/`tl.to`/`sfxOn`, cross-check mana yang benar-benar tanpa suara — terbukti efektif menemukan gap yang tidak kelihatan cuma dari nonton preview sekali. | Bukan risiko, tapi *worth distandarkan* sebagai metodologi resmi "SFX Coverage Audit" supaya topic lain juga melakukan audit sistematis ini sebelum menganggap Act "selesai", bukan cuma modal insting/preview sekilas. |

---

## 2. Do's and Don'ts (Diringkas dari Semua Temuan)

### ✅ DO

1. **Sebelum generate icon brand baru**, cek dulu: apakah brand ini cukup
   dikenal audiens sehingga akurasi visual penting (→ download logo asli
   dari Devicon/Simple Icons), atau cukup generik/ilustratif (→ tetap AI
   generate via `vm-icon-generator`)? (dari A)
2. **Semua komponen text-container generik** (`Badge`, `TextCard`, dan
   sejenisnya di topic baru) **wajib punya prop `icon` opsional sejak
   awal dibuat**, konsisten dengan `DiagramBox` — jangan tunggu audit
   akhir baru retrofit. (dari B)
3. **Sebelum commit Act dengan ≥2 elemen fixed-width sejajar** (Badge,
   Box, dsb), hitung dulu overlap pakai formula center-anchor (lihat
   temuan C) — jangan cuma andalkan eyeball di preview. (dari C)
4. **Semua download asset eksternal** (icon logo, SFX audio, apapun dari
   internet) WAJIB lewat `Desktop Commander:start_process` (terminal
   asli), karena sandbox `bash_tool` Claude cuma boleh akses domain
   terbatas (npm/pypi/github/dst). (dari D, I)
5. **Sebelum menambah SFX baru ke topic manapun**, scan dulu
   `public/audio/*/` untuk asset yang sudah ada tapi belum kepakai —
   baru pertimbangkan download/generate baru kalau memang tidak ada yang
   cocok. (dari H)
6. **Helper generik yang menerima parameter kategori/tipe** (seperti
   `popIn(..., sfxName)` yang manggil `sfxLoader.<category>(...)`) WAJIB
   terima parameter kategori eksplisit dengan default yang jelas
   didokumentasikan — jangan hardcode 1 kategori dan asumsikan semua
   pemanggil akan selalu pakai kategori yang sama. (dari G)
7. **Lakukan audit sistematis "SFX Coverage"** sebelum menganggap sebuah
   topic selesai: baca ulang seluruh timeline baris-per-baris, list
   semua `popIn`/`tl.to`/`sfxOn`, tandai motion signifikan yang benar-
   benar tanpa suara. (dari J, jadikan metodologi resmi)
8. **Kalau sengaja bikin sebuah momen silent** (`sfx: false` tanpa
   pengganti), dokumentasikan alasannya (misal: elemen dekoratif kecil,
   supaya tidak berisik) — jangan biarkan ambigu antara "sengaja silent"
   vs "kelupaan". (dari F)

### ❌ DON'T

1. **Jangan generate ulang logo brand pakai AI** kalau tujuannya
   menggantikan hasil AI-generate yang kurang akurat — itu sumber
   masalahnya sendiri (sesuai catatan revisi-01 §6). Ambil dari sumber
   resmi (Devicon/Simple Icons/Wikimedia) dengan lisensi jelas.
2. **Jangan asumsikan `sandbox bash_tool` Claude bisa akses semua
   domain** — CDN icon/font (`cdn.jsdelivr.net`) dan Wikimedia Commons
   TIDAK termasuk domain yang di-allow.
3. **Jangan biarkan `data.js` (SFX_MAP/config lain) dan `Animation.jsx`
   (pemanggilan aktual) divergen tanpa cross-check** — entry yang
   didefinisikan tapi tidak pernah dipanggil adalah tanda dokumentasi/
   config sudah basi.
4. **Jangan bikin helper reusable yang hardcode 1 opsi/kategori** kalau
   helper itu dipanggil dengan variasi kategori berbeda-beda — kalau
   perlu default, pastikan ada jalur override eksplisit, dan test dengan
   MINIMAL 1 contoh dari tiap kategori yang mungkin dipakai.
5. **Jangan andalkan "build syntax check lolos" (esbuild) sebagai bukti
   fitur benar-benar jalan** — bug G (silent SFX failure) dan bug C
   (layout overlap) SAMA-SAMA lolos build check tanpa error, tapi
   keduanya nyata-nyata rusak di preview/behavior. Build check cuma
   bukti sintaks valid, bukan bukti behavior benar.
6. **Jangan taruh banyak elemen fixed-width sejajar tanpa hitung jarak
   anchor** — "kelihatan cukup jauh" di angka koordinat tidak selalu
   berarti aman kalau lebar elemen tidak diperhitungkan.

---

## 3. Plan: File yang Perlu Diupdate / Ditambah

### 3.1 `docs/standardizations/06-icon-generation.md` — **UPDATE**

Section baru yang perlu ditambahkan (bukan isi lengkap, cuma outline):

- **"Kapan AI-Generate vs Kapan Download Logo Asli"** — tabel keputusan:
  brand dikenal luas (bahasa/tools populer, distro OS besar) → cek
  Devicon/Simple Icons dulu; konsep abstrak/ilustratif (bukan brand
  mark) → tetap AI-generate via `vm-icon-generator`; brand komersial
  aktif dengan trademark ketat (kasus Tailscale, Docker whale) → perlu
  konfirmasi eksplisit user dulu sebelum pakai logo resmi.
- **"Sumber & Lisensi Logo Asli"** — Devicon (`-original.svg`,
  full-color, MIT) vs Simple Icons (monokrom, CC0) vs Wikimedia Commons
  (fallback kalau tidak ada di 2 sumber di atas, cek lisensi per file).
  Pola penyimpanan: `icons/_originals/<nama>.svg` + `icons/_originals/
  LICENSE-LOGOS.md` (index sumber & lisensi tiap logo) +
  `icons/_originals/backup-ai-generated/` (arsip versi AI-generate lama
  sebelum diganti).
- **Catatan operasional**: sandbox `bash_tool` tidak bisa akses
  `cdn.jsdelivr.net`/`commons.wikimedia.org` — WAJIB pakai
  `Desktop Commander:start_process` untuk curl/wget logo asli. (cross-
  reference dari temuan D)
- **Checklist tambahan**: audit SEMUA momen `Badge`/`TextCard` yang
  text-only untuk peluang tambah icon — jangan cuma cek `DiagramBox`.

### 3.2 `docs/standardizations/05-svg-text-guide.md` — **UPDATE**

Section baru:

- **"Formula Cek Overlap Antar-Elemen Horizontal (Center-Anchor)"** —
  formula umum: elemen dengan anchor `x` dan lebar `w` (di-translate
  `-w/2` dari titik gambar asli) menempati rentang
  `[x - w/2, x + w/2]`. Dua elemen bertetangga aman kalau
  `|x2 - x1| >= (w1/2 + w2/2) + gap_minimal`. Sertakan contoh nyata
  before/after dari bug `namespaceLabel`/`cgroupLabel` (revisi-01, Plan
  Tambahan 2) sebagai worked example.
- Pertimbangkan generalisasi formula yang sama untuk overlap vertikal
  (2 elemen bertumpuk beda `y`, beda `height`).

### 3.3 `docs/standardizations/04-referensi-gsap.md` — **UPDATE**

- Tambah baris baru ke tabel **"Common Pitfalls"**:
  `popIn()`/helper SFX generik yang hardcode 1 kategori (mis. selalu
  `sfxLoader.ui(...)`) → SFX dari kategori lain (`impacts/`,
  `transitions/`, dst) gagal main **secara silent tanpa error** — fix:
  terima parameter `sfxCategory` eksplisit, default boleh `'ui'` tapi
  HARUS bisa di-override.
- Tambah section baru **"Referensi Canonical: `popIn()` dengan
  sfxCategory"** — cantumkan signature yang benar (menerima
  `sfxCategory` opsional) sebagai rujukan tunggal, supaya topic baru
  tidak reinvent helper ini dari nol dengan bug yang sama.
- Tambah section/paragraf **"Policy: `sfx:false` Wajib Ada Alasan"** —
  aturan: kalau sebuah `popIn()` sengaja `sfx:false`, harus ada
  `sfxOn()` pengganti dalam radius waktu berdekatan DI elemen lain yang
  related, ATAU didokumentasikan eksplisit alasan sengaja silent
  (elemen dekoratif kecil, dst).
- Tambah catatan singkat: **audit `SFX_MAP` vs pemanggilan aktual** —
  entry yang didefinisikan tapi tak pernah dipanggil adalah sinyal
  config basi, cek berkala.

### 3.4 `docs/standardizations/03-tutorial-buat-topic-baru.md` — **UPDATE (Checklist)**

Tambahan ke **"Checklist Sebelum Commit"** (bagian Teknis):

- [ ] Semua elemen fixed-width yang sejajar horizontal sudah dicek tidak
      overlap pakai formula di `05-svg-text-guide.md`
- [ ] Audit SFX Coverage sudah dilakukan: tiap motion signifikan (bukan
      dekoratif kecil) punya SFX, atau `sfx:false`-nya didokumentasikan
      sengaja
- [ ] `SFX_MAP` di `data.js` di-cross-check — tidak ada entry yang
      didefinisikan tapi tidak pernah dipanggil di `Animation.jsx`
      (kalau ada, hapus atau memang disiapkan utk dipakai segera)
- [ ] Semua komponen text-container baru (`Badge`/`TextCard`/sejenis)
      support prop `icon` opsional sejak awal dibuat

Tambahan catatan kecil di Langkah 4 (Audio & SFX) atau Langkah 6 (Tips
Teknis): cross-reference ke policy `sfx:false` & bug `popIn()`
sfxCategory dari `04-referensi-gsap.md`.

### 3.5 File BARU (dipertimbangkan) — `docs/standardizations/08-audio-sfx-generation.md`

**Alasan dipertimbangkan**: saat ini `06-icon-generation.md` sudah jadi
dokumen lengkap khusus pipeline ASSET ICON (generate, sourcing, lisensi,
integrasi kode) — tapi TIDAK ADA dokumen setara untuk pipeline ASSET
AUDIO/SFX, padahal dari revisi-02 jelas SFX punya kompleksitas serupa:
sourcing (situs mana + lisensi), kategori folder (`public/audio/<kategori>/`),
konvensi `SFX_MAP`, helper `popIn()`/`sfxLoader` canonical, policy
kapan silent vs wajib ada suara, metodologi audit coverage. Saat ini
info ini tersebar tipis-tipis di `02-standar-konten.md` (larangan
sfx-loader lokal), `03-tutorial` (Langkah 4, singkat), `04-referensi-gsap`
(GainNode/boost, SFX real-world example).

**Opsi A (direkomendasikan)**: buat `08-audio-sfx-generation.md` baru,
mirror struktur `06-icon-generation.md` (prinsip sourcing → skema
config → API/tooling kalau ada → checklist integrasi → pitfalls
spesifik audio). Konsekuensi: perlu update breadcrumb navigasi
("Alur baca lengkap: ...") di SEMUA 7 file `01`-`07` supaya menyertakan
`08`, dan update `PROJECT_STRUCTURE.md` bagian daftar isi `docs/`.

**Opsi B**: jangan bikin file baru, cukup taruh semua temuan SFX (E, F,
G, H, J) sebagai section tambahan di `04-referensi-gsap.md` (karena SFX
memang sudah dibahas sebagian di sana). Lebih murah (tidak perlu update
breadcrumb di banyak file), tapi `04-referensi-gsap.md` jadi makin
panjang & campur aduk antara "referensi GSAP timeline" vs "referensi
SFX/audio" yang sebenarnya topik beda.

→ Rekomendasi tetap **Opsi A** kalau efforts memungkinkan (dokumentasi
lebih rapi jangka panjang), tapi **Opsi B** valid sebagai jalan pintas
kalau prioritasnya "cepat kepasang minimal".

### 3.6 `docs/standardizations/02-standar-konten.md` — **UPDATE (kecil)**

- Tambahkan folder `revisi/` sebagai pola opsional resmi di bagian 3
  (Struktur Folder Wajib), sejajar dengan `_docs/` dan `_drafts/` yang
  sudah ada — container-docker sudah pakai pola ini (`revisi/README.md`
  sebagai index status + file bertanggal `YYYY-MM-DD-HHMM-revisi-NN.md`
  per topik masalah) tapi belum resmi jadi konvensi tertulis. Cukup 1
  paragraf pendek + cross-reference ke `container-docker/revisi/` sbg
  contoh nyata, tidak perlu detail berlebihan (biar tetap fleksibel per
  topic seperti prinsip `_docs/`/`_drafts/`).

### 3.7 `PROJECT_STRUCTURE.md` — **UPDATE (kondisional)**

Hanya perlu disentuh KALAU opsi 3.5-A (file `08-audio-sfx-generation.md`
baru) jadi dipilih — update daftar isi `docs/` di bagian "Folder
Pendukung Lainnya" supaya menyertakan `08-audio-sfx-generation.md`. Kalau
Opsi B dipilih (section tambahan di file existing), `PROJECT_STRUCTURE.md`
tidak perlu diubah sama sekali.

---

## 4. Prioritas Eksekusi (Kalau Plan Ini Disetujui)

| Prioritas | Item | Alasan |
|---|---|---|
| **Tinggi** | 3.3 (bug `popIn()` sfxCategory ke Common Pitfalls) | Risiko silent-failure paling berbahaya — tidak ada error, sudah kejadian nyata 1x |
| **Tinggi** | 3.2 (formula overlap horizontal) | Bug layout mudah terulang tiap ada ≥2 elemen sejajar, formula-nya murah untuk ditulis sekali dipakai selamanya |
| **Sedang** | 3.1 (AI-generate vs logo asli decision + sourcing) | Mencegah pilihan sumber icon yang salah/berisiko trademark, tapi dampaknya tidak se-silent bug teknis |
| **Sedang** | 3.4 (checklist tambahan `03-tutorial`) | Menggabungkan semua rule baru jadi actionable checklist, bergantung 3.1-3.3 selesai dulu isinya |
| **Rendah** | 3.6 (folder `revisi/` di `02-standar-konten`) | Housekeeping dokumentasi, tidak mencegah bug, cuma konsistensi |
| **Rendah** | 3.5 & 3.7 (file baru `08` + update `PROJECT_STRUCTURE.md`) | Keputusan struktural, butuh konfirmasi user dulu (Opsi A vs B) sebelum dieksekusi |

---

## 5. Keputusan (Dikonfirmasi User, 2026-09-07)

1. **File baru `08-audio-sfx-generation.md`** — DIPILIH (Opsi A).
2. **Folder `revisi/`** — distandarkan resmi di `02-standar-konten.md`,
   TAPI dokumen standar tidak boleh menyebut/mengutip file "revisi"
   manapun sebagai sumber — dokumen standar cukup menjelaskan pola
   folder-nya sendiri secara mandiri (gaya penulisan sama seperti
   dokumen 01-07 yang sudah ada).
3. **Eksekusi semua sekaligus** — dengan checklist tracking di file ini.

## 6. Checklist Eksekusi

- [x] Update breadcrumb navigasi "Alur baca lengkap" di 6 file
      (`01`–`06`) supaya menyertakan link ke `08-audio-sfx-generation.md`
- [x] `06-icon-generation.md` — tambah §8 "AI-Generate vs Download Logo
      Asli" (tabel keputusan)
- [x] `06-icon-generation.md` — tambah §9 "Sumber & Lisensi Logo Asli"
      (Devicon/Simple Icons/Wikimedia, pola `_originals/`, catatan
      operasional sandbox)
- [x] `06-icon-generation.md` — tambah §10 checklist audit icon di
      komponen text-container (Badge/TextCard)
- [x] `05-svg-text-guide.md` — tambah section "Formula Cek Overlap
      Antar-Elemen Horizontal (Center-Anchor)" + worked example
- [x] `04-referensi-gsap.md` — tambah section "Referensi: `popIn()`
      dengan `sfxCategory` Eksplisit" (contoh BAD vs GOOD)
- [x] `04-referensi-gsap.md` — tambah section "Policy: `sfx: false`
      Wajib Ada Alasan"
- [x] `04-referensi-gsap.md` — tambah 2 baris baru ke tabel "Common
      Pitfalls" (bug sfxCategory hardcode, overlap fixed-width)
- [x] `03-tutorial-buat-topic-baru.md` — tambah 5 item checklist baru ke
      "Checklist Sebelum Commit" (overlap, SFX coverage, SFX_MAP
      cross-check, sfxCategory eksplisit, icon di text-container)
- [x] `03-tutorial-buat-topic-baru.md` — tambah link `08` ke section
      "Lanjutan"
- [x] `02-standar-konten.md` — resmikan folder `revisi/` di bagian 3
      (struktur folder opsional), tanpa menyebut file sumber manapun
- [x] Buat file baru `docs/standardizations/08-audio-sfx-generation.md`
      lengkap (sourcing, `SFX_MAP` schema, integrasi, metodologi audit
      coverage, checklist)
- [x] `PROJECT_STRUCTURE.md` — tambah `08-audio-sfx-generation.md` ke
      daftar isi folder `docs/`
- [x] Git add + commit semua perubahan dokumentasi (push menunggu konfirmasi user)

**Status: SEMUA update dokumentasi sudah dieksekusi & di-commit (2026-09-07).**
Push masih menunggu konfirmasi user.
