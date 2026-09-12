# REST API — Konvensi Desain API di Atas HTTP — Topic Plan

## Overview

Topic baru: `rest-api`. Lanjutan langsung dari `http-request-response` (14)
— topic itu nutup dengan tease eksplisit "Surat model lain? Nanti di REST
API dan WebSocket." Topic ini yang menjawab tease itu.

Kalau 14 fokus ke MEKANIKA umum client-server (gimana surat dikirim &
dibalas), topic ini fokus ke KONVENSI/ATURAN desain: kenapa endpoint
dinamai `/users/123` bukan `/getUser?id=123`, kenapa ada 5 method
(GET/POST/PUT/PATCH/DELETE) bukan cuma 1, dan kenapa disebut "REST"
padahal server keliatan sibuk terus (bukan istirahat).

Target audiens: anak IT/junior dev yang sudah paham request/response
dasar (idealnya sudah nonton 14), tapi selama ini cuma hafalan "GET buat
ambil, POST buat kirim" tanpa ngerti KENAPA konvensinya begitu — sering
nulis endpoint verb-based (`/getUser`, `/deleteUser`) karena gak tau ada
standar resource-based. Playful tone, ikuti kontrak
`docs/standardizations/02-standar-konten.md` +
`docs/standardizations/03-tutorial-buat-topic-baru.md`.

**PLAN INI BELUM DIEKSEKUSI** — sesuai permintaan, cuma dokumen
perencanaan, belum ada `Animation.jsx`/`data.js`/`manifest.js` yang
dibuat, belum ada perubahan `registry.js`.

**Topic ID:** `rest-api` (folder fisik: `src/content/17-rest-api/`, sudah
ada sebagai folder kosong — dibuat lebih dulu sebagai placeholder nomor
urut, belum ada isi)
**Canvas:** 820 × 1340 (portrait 9:16, konsisten dengan seri Networking
terbaru — `13-dns-explained`, `14-http-request-response`)
**Kategori:** `Networking` (sejajar 13 & 14 di `registry.js`)
**Difficulty:** ⭐⭐⭐ (medium — bukan soal visual yang rumit, tapi ada
beberapa nuance teknis yang gampang overclaim/salah kalau disederhanakan
tanpa hati-hati — lihat § "Konsep Teknis yang WAJIB Tetap Akurat")
**Estimasi total durasi:** ~44-46 detik (5 Act + intro morph ~1.2s)
**Tier rencana:** lanjutan tier Networking (sejajar 13, 14) di
`registry.js`, status awal `'coming-soon'`

---

## Kontinuitas dengan Topic Sebelumnya (13 & 14)

- Dunia visual (motif surat/amplop, gedung server, petugas, stempel)
  DILANJUTKAN secara naratif dari 14 — tapi asetnya (icon PNG kalau ada)
  dibuat baru khusus topic ini di `src/content/17-rest-api/icons/`, BUKAN
  reuse file dari `14-http-request-response/icons/` (kontrak per-topic,
  lihat `docs/standardizations/06-icon-generation.md` §4 & §7 — icon
  adalah aset lokal per folder topic, walau gaya visualnya sengaja mirip
  supaya penonton merasa ini "dunia yang sama").
- Status code yang sudah dikenalkan di 14 Act 5 (200, 404, 500) di-REUSE
  sebagai reminder singkat, ditambah 1 varian baru: **201 Created**
  (khusus respons sukses untuk `POST`/create resource) — bukan
  re-explain dari nol.
- Opening Act 1 topic ini WAJIB menyambung eksplisit ke tease closing 14
  (contoh kasar: "Lanjutan dari surat kemarin...") supaya penonton yang
  ikut dari 14 merasa continuity-nya jelas, bukan topic baru yang lepas.
- Closing Act 5 topic ini tease topic BERIKUTNYA: **Authentication**
  (folder `src/content/18-auth/` sudah ada sebagai placeholder kosong,
  urutan pas untuk pertanyaan natural "siapa yang boleh buka amplop
  ini?" muncul di akhir topic REST API).

---

## Manifest Draft (`manifest.js`)

```js
export default {
  schemaVersion: 1,
  id: 'rest-api',
  title: 'REST API',
  subtitle: 'Aturan standar di balik "istirahat" yang sibuk',
  category: 'Networking',
  tags: ['REST', 'API', 'CRUD', 'HTTP Methods', 'JSON', 'Statelessness'],
  color: '#A78BFA',
  audioStrategy: 'realtime',
}
```

Warna `#A78BFA` (purple) dipilih karena secara semantik project ini
artinya "Technical term/konsep" (lihat `05-svg-text-guide.md` § Color
Palette Project) — cocok untuk topic yang isinya konvensi/aturan, dan
otomatis beda dari 13 (`#06B6D4` cyan) & 14 (`#38BDF8` blue) di
`ContentCard` grid supaya gampang dibedain sekilas.

---

## Color Palette (reuse penuh, TIDAK ada warna baru)

Semua warna dari palet standar project (`05-svg-text-guide.md`), sama
persis mapping semantiknya dengan 14 supaya kontinuitas visual:

| Elemen | Warna | Alasan (semantik project) |
|---|---|---|
| Client/pengirim | `#38BDF8` (Blue) | Browser, Info |
| Alamat/resource path | `#06B6D4` (Cyan) | Network, System |
| Server/departemen | `#FB923C` (Orange) | Process, Activity |
| Method/istilah teknis (badge GET/POST/dst, key JSON) | `#A78BFA` (Purple) | Technical term |
| Pola benar / sukses | `#34D399` (Green) | Success |
| Pola salah / error | `#F43F5E` (Red) | Alert, Error |
| Highlight "before/chaos" & warning transisi | `#FBBF24` (Yellow) | Warning |

---

## Analogi Utama: Restoran & Cara Memesan yang Konsisten

REST API dianalogikan sebagai **cara standar pelanggan berkomunikasi dengan restoran**.

Tujuan analogi bukan membuat setiap istilah teknis punya padanan 1:1, tetapi membuat penonton memahami satu ide utama:

> **REST adalah seperangkat konvensi untuk membuat komunikasi antara aplikasi dan server konsisten dan mudah diprediksi.**

Aplikasi = pelanggan  
API = pelayan/perantara  
Server = dapur restoran  
Database = penyimpanan data restoran

Analogi restoran dipilih karena lebih dekat dengan pengalaman orang awam dibandingkan memaksa penonton menerjemahkan banyak objek kantor pos seperti amplop, departemen, pintu, stempel, dan petugas.

| Konsep REST | Analogi |
|---|---|
| Resource (`/users/123`, `/orders/9`) | Meja/menu/pesanan tertentu — alamat menunjuk **benda/data yang dituju** |
| HTTP Method | Tindakan pelanggan terhadap resource: lihat, buat, ganti, ubah sebagian, hapus |
| GET | Lihat informasi |
| POST | Buat pesanan/data baru |
| PUT | Ganti keseluruhan data |
| PATCH | Ubah sebagian data |
| DELETE | Hapus data |
| Request body | Isi pesanan/formulir yang dikirim ke restoran |
| JSON | Format formulir terstruktur yang mudah dibaca bersama |
| Statelessness | Setiap permintaan harus membawa informasi yang dibutuhkan; request baru tidak boleh bergantung pada context request sebelumnya |
| Status code | Struk/status hasil dari restoran: berhasil, dibuat, tidak ditemukan, atau gagal |
| Authentication | Pemeriksaan siapa yang boleh mengakses/melakukan sesuatu |
| Konsistensi REST | Semua restoran/departemen mengikuti pola pemesanan yang serupa sehingga pelanggan tidak perlu mempelajari aturan baru setiap kali |

### Prinsip Storytelling

Jangan membuat penonton menghafal:

> "Amplop = request, pintu = endpoint, stempel = method."

Sebaliknya, penonton mengikuti **satu situasi yang familiar**:

> "Saya mau berinteraksi dengan data restoran. Bagaimana cara saya memberi tahu server apa yang saya mau?"

Dari situ konsep teknis muncul satu per satu.

---

## Story Spine (4-Beat per Act)

| Act | Setup | Tegangan/Masalah | Titik Balik | Payoff |
|---|---|---|---|---|
| 1 | Pelanggan masuk ke dunia restoran/API | Setiap restoran punya cara memesan berbeda-beda | Muncul kebutuhan akan cara komunikasi yang konsisten | REST diperkenalkan sebagai konvensi/gaya untuk membuat komunikasi lebih predictable |
| 2 | Pelanggan melihat banyak resource/data | Kalau aksi dimasukkan ke alamat, URL menjadi tidak konsisten (`/getUser`, `/deleteUser`) | Alamat cukup menunjukkan **resource**, misalnya `/users/123` | Aksi dipisahkan dari alamat |
| 3 | Pelanggan punya resource `/orders/9` tetapi ingin melakukan tindakan | "Kalau alamat cuma menunjukkan benda, bagaimana bilang mau ngapain?" | HTTP method muncul sebagai tindakan: GET/POST/PUT/PATCH/DELETE | Alamat + method menjadi pola yang konsisten |
| 4 | Pelanggan mengirim detail pesanan | Data dalam bentuk bebas sulit diproses; request berikutnya juga tidak boleh bergantung pada percakapan sebelumnya | Data dibuat terstruktur (JSON) dan setiap request membawa context yang dibutuhkan | Request lebih predictable; server tetap boleh menyimpan data di database, tetapi tidak bergantung pada session/context request sebelumnya |
| 5 | Semua restoran mengikuti pola yang konsisten | Ada resource yang berisi data sensitif | Muncul kunci/akses pada resource rahasia | REST memberi pola komunikasi; pertanyaan berikutnya: siapa yang boleh mengaksesnya? → Authentication |

---

## Breakdown per-Act

Kalimat di bawah adalah draft storytelling, bukan final wording. Tetap mengikuti standar wording singkat saat implementasi.

### Act 1 — Kenapa Cara Pesannya Beda? (Hook, ≈7s)

**Tujuan:** Membuka masalah nyata sebelum menjelaskan REST.

- **Setup:** Pelanggan datang ke beberapa restoran.
- **Tegangan:** Restoran pertama meminta satu cara pemesanan, restoran kedua cara berbeda, restoran ketiga berbeda lagi. Pelanggan kebingungan.
- **Titik balik:** Semua situasi berhenti. Muncul pertanyaan: "Kenapa gak pakai aturan yang sama?"
- **Payoff:** Card: **"REST: cara komunikasi yang konsisten."**

**Visual:**
- Satu karakter pelanggan menjadi anchor utama.
- Beberapa restoran muncul cepat dengan aturan pemesanan berbeda.
- Contoh endpoint dapat muncul sebagai elemen kecil, tetapi jangan memenuhi layar.
- Hindari terlalu banyak istilah teknis di awal.

**Catatan:** Hook tidak perlu menjelaskan kepanjangan REST. Fokus awal adalah masalah **ketidakkonsistenan**.

---

### Act 2 — Alamat Menunjuk Benda (≈8s)

**Tujuan:** Memperkenalkan resource-oriented URL secara intuitif.

- **Setup:** Pelanggan ingin mengambil data user tertentu.
- **Tegangan:** Muncul beberapa alamat lama:
  - `/getUser`
  - `/removeUserById`
  - `/newCustomer`
- Alamat terlihat seperti instruksi/tindakan sehingga pola sulit ditebak.
- **Titik balik:** Semua berubah menjadi alamat resource:
  - `/users/123`
  - `/orders/9`
  - `/products/7`
- **Payoff:** Caption: **"Alamat menunjukkan apa yang dituju, bukan apa yang dilakukan."**

**Visual:**
- Jangan membuat `/users/123` terasa seperti nama ruangan kantor.
- Lebih baik tampilkan sebagai **alamat tujuan pada layar/menu restoran**.
- Kata benda/resource diberi emphasis; kata kerja pada contoh lama dicoret.
- Satu karakter tetap menjadi anchor agar penonton mengikuti cerita yang sama.

---

### Act 3 — Aksinya Ada di Method (≈10s)

**Tujuan:** Menjawab pertanyaan natural dari Act 2: kalau URL hanya menunjuk resource, bagaimana menentukan tindakan?

- **Setup:** Resource `/orders/9` sudah jelas.
- **Tegangan:** Pelanggan bertanya: **"Terus mau ngapain?"**
- **Titik balik:** Method muncul sebagai kartu tindakan.
- **Payoff:** Semua resource bisa menggunakan pola method yang sama.

Visual method:

| Method | Aksi sederhana |
|---|---|
| GET | Lihat |
| POST | Buat baru |
| PUT | Ganti semua |
| PATCH | Ubah sebagian |
| DELETE | Hapus |

**Momen wajib PUT vs PATCH:**

Pesanan awal:

```text
Nasi Goreng
Telur
Es Teh
```

**PUT → ganti keseluruhan:**

```text
Mie Goreng
Ayam
Jus
```

**PATCH → ubah sebagian:**

```text
Nasi Goreng
Telur
Jus
```

Visual harus membuat perbedaan **"ganti semua" vs "ubah sebagian"** terlihat tanpa perlu membaca penjelasan panjang.

**Catatan akurasi:**
- Mapping method ke CRUD adalah penyederhanaan untuk audiens junior.
- PUT berarti replace penuh dan idempotent.
- PATCH melakukan partial update; idempotency tidak dijamin.
- POST umumnya digunakan untuk create dan tidak idempotent.

---

### Act 4 — Pesanan Harus Jelas & Berdiri Sendiri (≈11s)

**Tujuan:** Menjelaskan JSON dan statelessness tanpa membuat kesan "server pelupa".

#### Beat A — Format Data Terstruktur

- **Setup:** Pelanggan menjelaskan pesanan dengan kalimat bebas yang panjang.
- **Tegangan:** Pelayan kesulitan memastikan mana nama, makanan, dan minuman.
- **Titik balik:** Pesanan berubah menjadi formulir terstruktur:

```text
nama: Adib
makanan: nasi goreng
pedas: true
minuman: es teh
```

- **Payoff:** **"Format terstruktur lebih mudah diproses bersama."**

**Catatan akurasi:** JSON adalah format yang sangat populer untuk API modern, tetapi REST tidak mewajibkan JSON.

#### Beat B — Setiap Request Berdiri Sendiri

Jangan menggunakan karakter "petugas pelupa" sebagai gimmick utama.

- **Setup:** Pelanggan mengirim request pertama.
- **Tegangan:** Request kedua datang sebagai request baru.
- **Titik balik:** Request kedua tetap membawa informasi yang dibutuhkan; tidak cukup hanya berkata **"seperti tadi."**
- **Payoff:** **"Setiap request membawa context yang dibutuhkan."**

Visual:

```text
REQUEST 1
/meja/12
nama: Adib
makanan: nasi goreng

REQUEST 2
/meja/12
nama: Adib
minuman: es teh
```

Lalu caption singkat:

> **"Stateless: request baru tidak bergantung pada context request sebelumnya."**

**PENTING:** Jangan menampilkan database yang ikut menghilang atau seolah-olah server tidak menyimpan data.

Server tetap boleh menyimpan:
- user
- order
- produk
- transaksi
- dan data persisten lainnya

Yang tidak dipertahankan sebagai context percakapan adalah **session/context antar-request**.

---

### Act 5 — Semua Konsisten, Tapi Siapa yang Boleh Masuk? (Payoff + Tease, ≈8s)

**Tujuan:** Merangkum manfaat pola REST lalu membuka Authentication.

- **Setup:** Beberapa resource ditampilkan dengan pola yang sama:
  - `/users/123`
  - `/orders/9`
  - `/products/7`
- Method yang sama bisa digunakan pada resource berbeda.
- **Tegangan:** Muncul resource dengan label **"DATA RAHASIA"**.
- **Titik balik:** Resource mendapat ikon kunci.
- **Payoff:** Caption:
  **"Cara komunikasinya sudah konsisten."**

Lalu:

> **"Tapi siapa yang boleh mengaksesnya?"**

→ tease **Authentication**.

**Status code:**
- 200 = berhasil
- 201 = berhasil membuat resource baru
- 404 = resource tidak ditemukan
- 500 = server error

Status code cukup menjadi reminder visual, tidak perlu menjadi fokus utama Act 5.

---

## Persistent Anchor Objects

Dengan analogi baru, anchor sebaiknya lebih sederhana supaya cerita tidak terasa seperti perpindahan metafora setiap beberapa detik.

### Anchor utama

- **Pelanggan** — karakter utama dari Act 1 sampai Act 5.
- **Restoran/API world** — lingkungan utama.
- **Resource card/list** — objek data yang terus berubah sesuai Act.
- **Request card** — objek yang dapat berubah dari format bebas menjadi terstruktur.
- **Method cards** — muncul mulai Act 3 dan dapat digunakan kembali di Act 5.

### Jangan terlalu banyak anchor

Tidak perlu mempertahankan:
- banyak pintu departemen,
- amplop,
- petugas,
- stempel,
- gedung kantor pos,

karena objek-objek tersebut berasal dari analogi lama dan membuat penonton harus menerjemahkan terlalu banyak simbol.

---

## Visual Vocabulary Baru

| Visual | Makna |
|---|---|
| Pelanggan | Client/app |
| Restoran | API/server environment |
| Meja/menu/resource card | Resource |
| Kartu tindakan | HTTP method |
| Formulir pesanan | Structured request body |
| Struk/status | HTTP status code |
| Kunci | Authentication/access |
| Banyak restoran dengan pola sama | Konsistensi API |

### Prinsip utama

**Satu visual = satu ide.**

Jangan menampilkan:
- URL
- method
- JSON
- status code
- database
- authentication

secara bersamaan hanya karena semuanya "berhubungan dengan REST".

Setiap Act harus membuat satu konsep terasa jelas terlebih dahulu, baru konsep berikutnya masuk.

---

## Konsep Teknis yang WAJIB Tetap Akurat

1. **REST adalah gaya arsitektur (architectural style), bukan protokol HTTP dan bukan standar resmi yang di-enforce.** Berasal dari disertasi Roy Fielding (2000).
2. **Resource-oriented URL** seperti `/users/123` adalah konvensi/best practice desain, bukan aturan HTTP yang dipaksakan.
3. **HTTP method** memiliki semantics masing-masing:
   - GET = retrieve
   - POST = create/process, umumnya tidak idempotent
   - PUT = replace penuh, idempotent
   - PATCH = partial modification, idempotency tidak dijamin
   - DELETE = delete, idempotent
4. **REST tidak mewajibkan JSON.** JSON dipakai karena sangat populer pada API modern.
5. **Statelessness bukan berarti server tidak menyimpan data.** Database tetap menyimpan data persisten. Yang dimaksud adalah setiap request harus membawa informasi yang diperlukan tanpa bergantung pada context/session request sebelumnya.
6. Sebagian besar API yang disebut "REST API" di dunia nyata tidak menerapkan REST secara penuh sesuai definisi Fielding. Topic ini tidak perlu masuk ke HATEOAS karena berada di luar scope audiens junior.
7. **Idempotency** dapat disebut singkat jika masih ada ruang, tetapi jangan sampai mengorbankan pemahaman resource, method, dan statelessness.

---

## Keputusan Storytelling Baru

1. **Analogi utama diganti:** kantor pos → restoran.
2. **Tujuan analogi:** bukan membuat mapping 1:1 setiap istilah, tetapi membuat konsep "komunikasi yang konsisten" mudah dipahami.
3. **REST diperkenalkan sebagai solusi terhadap masalah ketidakkonsistenan**, bukan sebagai kumpulan istilah teknis sejak awal.
4. **Resource URL** diperkenalkan sebagai "alamat benda/data", bukan "nama ruangan".
5. **HTTP method** diperkenalkan sebagai tindakan terhadap resource.
6. **PUT vs PATCH** menggunakan perubahan pesanan sebagai visual utama agar perbedaan "ganti semua" dan "ubah sebagian" terlihat.
7. **JSON** menggunakan formulir pesanan terstruktur.
8. **Statelessness tidak lagi memakai metafora "petugas pelupa"** karena berisiko menimbulkan miskonsepsi bahwa server tidak menyimpan data.
9. **Authentication tease** tetap dipertahankan di Act 5.
10. Jumlah Act tetap **5 Act**, target durasi tetap sekitar **44–46 detik**.
11. Aset visual boleh dibuat ulang sesuai analogi baru; jangan mempertahankan asset kantor pos hanya karena sudah tersedia jika asset tersebut membuat storytelling lebih sulit dipahami.
12. Prioritas revisi adalah **pemahaman penonton**, bukan mempertahankan sebanyak mungkin struktur visual lama.

---

## Checklist Storytelling Revisi

- [ ] Penonton awam dapat memahami masalah Act 1 tanpa mengetahui REST.
- [ ] Analogi restoran terasa natural, bukan sekadar mengganti nama "kantor pos".
- [ ] Resource URL dapat dipahami tanpa istilah endpoint terlebih dahulu.
- [ ] GET/POST/PUT/PATCH/DELETE terlihat sebagai tindakan berbeda.
- [ ] PUT vs PATCH terlihat jelas secara visual.
- [ ] JSON dipahami sebagai format data terstruktur, bukan syarat REST.
- [ ] Statelessness tidak disalahartikan sebagai "server tidak menyimpan data".
- [ ] Status code hanya menjadi supporting visual.
- [ ] Authentication muncul sebagai pertanyaan natural di akhir.
- [ ] Tidak ada Act yang memerlukan penonton menerjemahkan terlalu banyak metafora sekaligus.
- [ ] Setelah selesai menonton, penonton setidaknya bisa menjelaskan:
  **"REST itu tentang membuat cara aplikasi berkomunikasi dengan server menjadi konsisten."**

---

## Catatan Implementasi

Struktur teknis project tidak harus mengikuti struktur analogi lama.

Animation.jsx dapat mempertahankan pola timeline, phase, SFX, dan anchor system yang sudah ada, tetapi komponen visual dapat diganti atau disederhanakan.

Target utama revisi bukan menambah animasi, melainkan **mengurangi cognitive load**.

Jika sebuah visual terlihat keren tetapi membuat penonton harus bertanya:

> "Ini sebenarnya melambangkan apa?"

maka visual tersebut lebih baik disederhanakan.

**Storytelling > jumlah asset > kompleksitas animasi.**
