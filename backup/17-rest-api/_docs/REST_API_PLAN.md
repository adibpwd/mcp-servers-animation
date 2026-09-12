# REST API — Konvensi Desain API di Atas HTTP — Topic Plan

> ⚠️ **SUPERSEDED** oleh analogi restoran — lihat
> `_docs/REST-API-storytelling-revision.md` +
> `revisi/2026-09-11-1241-revisi-02.md`. Dokumen ini (analogi kantor
> pos: amplop, pintu departemen, petugas, stempel) dibiarkan utuh
> sebagai arsip historis "versi 1", bukan rencana aktif lagi.

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

## Analogi Utama: Formulir Standar di Kantor Pos Multi-Departemen

Lanjutan analogi surat dari 14, tapi zoom ke ATURAN pengisian & alamat,
bukan mekanika kirim-terima:

| Konsep REST | Analogi |
|---|---|
| Endpoint / resource path (`/users/123`) | Nomor ruangan/departemen di gedung kantor pos — alamat = BENDA, bukan tindakan |
| HTTP Method (GET/POST/PUT/PATCH/DELETE) | Stempel jenis aksi di amplop: Lihat / Buat Baru / Ganti Total / Ubah Sebagian / Hapus |
| Request body (JSON) | Formulir isian berkolom tetap (key: value), bukan surat cerita bebas |
| Penamaan resource (kata benda, bukan kata kerja) | Nama ruangan = "Ruang Arsip Pelanggan", BUKAN "Ruang Hapus Pelanggan" |
| Statelessness | Petugas baru tiap surat datang — tidak ingat surat sebelumnya, semua info wajib ditulis ulang tiap kirim |
| Status code (reuse 200/404/500 dari 14 + tambahan) | Stempel balasan yang sudah dikenal, + 1 stempel baru: **201** "Diterima, Berkas Baru Dibuat" |
| Konsistensi lintas-departemen | Semua departemen (resource beda-beda) pakai FORMAT SURAT SAMA — makanya integrasi klien jadi predictable, gak perlu hafal gaya tiap departemen |

---

## Story Spine (4-Beat per Act, wajib per docs/03)

| Act | Setup | Tegangan/Masalah | Titik Balik | Payoff |
|---|---|---|---|---|
| 1 | Gedung kantor pos (dari 14) kelihatan ramai, amplop wara-wiri terus | Papan nama besar bertuliskan "REST API" di gerbang — kontras sama suasana di dalam yang SIBUK, bukan istirahat | Karakter bingung: "katanya REST, kok makin sibuk?" | Cliffhanger: bukan soal istirahat, tapi soal ATURAN standar |
| 2 | Flashback: banyak departemen, tiap satu punya gaya endpoint sendiri (`/getUser`, `/removeUserById`, dst) | Klien (app) harus hafal cara berbeda-beda tiap departemen — bingung, error, integrasi ribet | Pertanyaan: gimana caranya semua ngerti "bahasa" yang sama? | Cliffhanger ke aturan #1: nama ruangan, bukan nama aksi |
| 3 | Endpoint verb-based (`/getUser`) dicoret X | Alamat baru: `/users/123` (nomor ruangan/resource) — tapi aksinya ilang, di mana taruhnya? | Reveal: aksi pindah jadi STEMPEL terpisah di amplop (5 method) | Semua departemen sekarang pakai pola alamat+stempel yang sama |
| 4 | Amplop sudah benar alamat & stempel, tapi isinya masih paragraf bebas | Departemen lain kesulitan parse surat gaya bebas — tiap departemen beda cara baca | Ganti ke formulir berkolom (JSON) + reveal: petugas ganti tiap surat, gak ingat riwayat (stateless) | Jawab hook Act 1: bukan servernya istirahat, tapi dia gak "nyimpen ingatan" antar surat |
| 5 | Semua departemen sekarang konsisten: alamat, stempel aksi, formulir, stempel balasan | Satu surat baru — isinya rahasia (data sensitif) | Muncul amplop bersegel-kunci, samar | Payoff penuh + tease: "tapi siapa yang boleh buka amplop ini?" → Authentication |

---

## Breakdown per-Act

Kalimat contoh di bawah draft KASAR, BUKAN final — masih perlu dicek
±7-8 kata, no-pronoun, no-emoji saat eksekusi (per
`03-tutorial-buat-topic-baru.md` § "Wording Ringkas & Tanpa Emoji").

### Act 1 — Nama yang Menjebak? (Hook, ≈7s)

**Tujuan:** Bikin penonton sadar ada kontradiksi di nama "REST" — hook
lewat statement counter-intuitive (03 §3.0), jawaban lengkapnya baru di
Act 4.

- **Setup:** Gedung kantor pos (anchor persisten dari dunia 14) — banyak
  amplop kecil terbang keluar-masuk, animasi ramai (beberapa envelope
  kecil terbang paralel, bukan cuma 1).
- **Tegangan:** Papan nama besar muncul di gerbang gedung: "REST API" —
  di saat bersamaan visual di dalam makin ramai, bukan makin sepi.
- **Titik balik:** Karakter (muka sederhana, 03 §3.6) reaksi bingung,
  speech bubble: "Katanya REST, kok makin sibuk?"
- **Payoff (cliffhanger):** Card muncul: "Bukan soal istirahat. Ini
  aturan standar." Cliffhanger ke Act 2: kenapa butuh aturan?

**Visual:** Speech bubble untuk pertanyaan, papan nama sebagai badge
non-rect (mis. bentuk plang gantung), bukan cuma teks polos.

### Act 2 — Sebelum Ada Aturan: Kacau (≈8s)

**Tujuan:** Tunjukkan MASALAH nyata sebelum konvensi REST ada — bukan
langsung kasih jawaban, biar penonton ngerasa perlunya aturan.

- **Setup:** Beberapa "pintu departemen" muncul berjajar, tiap satu
  punya label endpoint gaya beda: `/getUser`, `/user_remove`,
  `/newCustomer` (verb-based, tidak konsisten).
- **Tegangan:** Amplop dari klien terbang bolak-balik salah pintu / balik
  lagi dengan tanda X — animasi kebingungan, mungkin beberapa amplop
  numpuk di 1 pintu, ada yang nyasar.
- **Titik balik:** Karakter/badge insight: "Tiap departemen, bahasa
  beda." — highlight betapa repotnya klien harus hafal semua gaya itu.
- **Payoff (cliffhanger):** "Butuh aturan yang sama, di semua pintu."
  Cliffhanger ke Act 3: aturan pertama apa?

**Visual:** Row beberapa "pintu" dengan label endpoint gaya lama
dicoret/berantakan, badge insight bentuk starburst (bukan rect polos,
ini "aha moment" awal).

### Act 3 — Ruangan, Bukan Aksi (≈10s)

**Tujuan:** Perkenalkan 2 aturan inti sekaligus: alamat = kata benda
(resource), aksi = stempel method terpisah (5 varian, mapping ke CRUD).

- **Setup:** 1 pintu departemen lama (`/getUser`) di-zoom, label
  endpoint-nya dicoret X.
- **Tegangan:** Label baru muncul: `/users/123` — tapi sekilas
  "aksinya" hilang dari alamat, muncul pertanyaan kecil: "terus,
  aksinya taruh mana?"
- **Titik balik:** Reveal — 5 stempel method muncul satu-satu di
  amplop (row badge, warna `#A78BFA`): **GET** (kaca pembesar, lihat),
  **POST** (plus, buat baru), **PUT** (ikon ganti-total), **PATCH**
  (pensil, ubah sebagian), **DELETE** (tempat sampah, hapus). Beri
  1 momen highlight khusus PUT vs PATCH (paling sering ketuker junior
  dev) — badge kecil "ganti SEMUA" vs "ganti SEBAGIAN" berdampingan.
- **Payoff:** Alamat + stempel sekarang jadi pola tetap, dipakai ulang
  di semua "ruangan" lain (tunjukkan 2-3 pintu lain otomatis ganti pola
  yang sama). Cliffhanger ke Act 4: "Sekarang, isi suratnya gimana?"

**Visual:** 5 badge method sejajar horizontal — WAJIB cek overlap pakai
formula `05-svg-text-guide.md` § "Formula Cek Overlap" sebelum commit
(5 elemen fixed-width berdampingan, rawan overlap kalau lebar/gap gak
dihitung). Icon CRUD tiap badge — kaca pembesar/plus/ganti-total/
pensil/tempat sampah — bisa manual SVG shape, TIDAK wajib AI-generate
(lihat § Icon Needs).

### Act 4 — Formulir Terstruktur & Petugas Pelupa (≈11s)

**Tujuan:** Ini Act paling penting — jawab hook Act 1 secara eksplisit.
2 sub-beat dalam 1 Act (pola sama seperti env-variables Act 2:
hardcode→env var), sesuai 03 §3.4 sequencing.

*Beat A — formulir terstruktur (JSON):*
- Amplop lama isinya paragraf bebas (garis-garis teks tidak beraturan)
  di-zoom, badge "Susah dibaca departemen lain" muncul.
- Berubah (morph, bukan pop-in baru) jadi kolom-kolom rapi: `nama:`,
  `email:` — badge "Sekarang semua bisa baca format sama."

*Beat B — statelessness (jawab hook Act 1):*
- Amplop kedua & ketiga datang dari pengirim yang SAMA, tapi petugas
  yang menerima adalah karakter BARU tiap kali (bukan pop-in ulang
  anchor lama — ini sengaja beda dari pola anchor object biasa, lihat
  § Persistent Anchor Objects untuk alasannya).
- Petugas baru bereaksi "tidak kenal" — sender harus tulis ulang semua
  info (termasuk identitas) tiap surat, tidak bisa cuma bilang
  "seperti kemarin."
- **Payoff (jawab hook eksplisit):** Card besar: "Bukan servernya
  istirahat. Dia cuma gak nyimpen ingatan antar surat." Cliffhanger ke
  Act 5: "Semua sudah konsisten... tapi amannya gimana?"

**Visual:** Formulir berkolom pakai box dengan garis pemisah antar
field (bukan text polos, lihat pola Box di `05-svg-text-guide.md`),
karakter petugas ganti wajah/warna tiap muncul untuk memperkuat kesan
"orang baru" (03 §3.6 reaksi karakter sederhana).

### Act 5 — Konsisten, Tapi Siapa yang Boleh Buka? (Payoff + Tease, ≈8s)

**Tujuan:** Rangkum konsistensi yang sudah dibangun Act 2-4, lalu buka
pertanyaan baru yang jadi jembatan ke topic Authentication.

- **Setup:** Beberapa pintu departemen (dari Act 2, sekarang sudah rapi)
  ditampilkan berjajar — SEMUA pakai pola sama (alamat resource +
  stempel method + formulir JSON). Stempel balasan familiar muncul
  (200, reuse dari 14) + 1 stempel baru: **201** khusus balasan sukses
  untuk POST/create.
- **Tegangan:** 1 amplop baru muncul, label "DATA RAHASIA" — mulai
  terbang ke salah satu pintu departemen.
- **Titik balik:** Amplop itu punya SEGEL/gembok tambahan yang belum
  pernah muncul sebelumnya — beda dari amplop biasa.
- **Payoff (jawab hook total + tease):** Caption: "Aturan sama, surat
  konsisten." Lalu teaser eksplisit: "Tapi... siapa yang boleh buka
  amplop ini?" → nge-tease topic Authentication berikutnya.

**Visual:** Row stempel balasan (200 + 201, reuse pola `Stamp` dari 14
tapi aset baru per-topic), amplop bersegel-gembok sebagai elemen baru
non-rect yang belum pernah dipakai sebelumnya di topic ini (biar
kelihatan beda/menonjol sebagai pembuka topic baru).

---

## Persistent Anchor Objects (03 §3.1 + pengecualian penting)

Objek representasi hal SAMA lintas-Act — render di luar blok conditional
per-Act, jangan pop-in ulang tiap ganti Act:

- **Gedung kantor pos (departemen)** — anchor dari Act 1 sampai Act 5,
  "rumah" tempat semua pintu/departemen berada.
- **Amplop request** — anchor dari Act 2 sampai Act 4 (berubah isi/label
  seiring aturan baru ditambahkan, objek sama, bukan amplop baru tiap
  Act).
- **Row pintu departemen** — anchor dari Act 2 sampai Act 5 (Act 2 label
  berantakan, Act 3-5 label sudah konsisten — morph, bukan re-pop-in).

> **Pengecualian sengaja (kebalikan dari anchor biasa) — karakter
> petugas di Act 4 Beat B.** Berbeda dari `http-request-response` yang
> me-reuse 1 karakter Officer sebagai anchor persisten, topic ini
> SENGAJA me-render petugas sebagai karakter BARU tiap kemunculan di
> Beat statelessness — ini bukan kelalaian, tapi teknik visual buat
> menjelaskan konsepnya sendiri ("petugas gak ingat, jadi kayak orang
> baru terus"). Catat eksplisit di komentar kode saat eksekusi supaya
> reviewer/diri sendiri di masa depan tidak salah kira ini bug anchor
> yang lupa di-reuse.

---

## SFX Sketch (nama sudah dicek match ke asset existing, lihat 08 §2)

Semua nama di bawah SUDAH ADA di `public/audio/{kategori}/*.wav` (dicek
via `Desktop Commander:list_directory` saat plan ini ditulis) — tidak
perlu sourcing SFX baru sama sekali untuk topic ini.

| Momen | Kategori | Nama file existing |
|---|---|---|
| Amplop terbang (tiap perpindahan/pindah pintu) | `transitions` | `whoosh.wav` |
| Klik/pop kemunculan badge kecil | `sfx` / `ui` | `click.wav` / `pop.wav` |
| Amplop salah pintu / gagal (Act 2) | `sfx` / `warnings` | `error.wav` / `alert-pulse.wav` |
| Stempel method muncul (Act 3, 5x badge) | `impacts` | `impact.wav` |
| Formulir berubah jadi terstruktur (Act 4 Beat A) | `sfx` | `materialize.wav` |
| Petugas baru muncul / "tidak kenal" (Act 4 Beat B) | `warnings` | `error-hum.wav` (halus, bukan alert keras) |
| Alamat/resource ketemu pola benar (Act 3 payoff) | `success` | `confirm.wav` |
| Segel/gembok amplop rahasia (Act 5) | `impacts` | `lock.wav` |
| Stempel balasan 200/201 (Act 5) | `success` | `ding.wav` atau `confirm.wav` |

---

## Icon Needs — FINAL: AI-Generate PNG (konsisten dengan 14)

**Keputusan (dikonfirmasi user):** icon di-generate via AI (ChatGPT +
`vm-icon-generator` extension), BUKAN shape manual — supaya visual
topic ini selevel polish dengan `14-http-request-response`. Ikuti
pipeline penuh `docs/standardizations/06-icon-generation.md`.

14 icon, dibagi 2 batch (2×4 = 7 icon + 1 empty per batch, pola persis
contoh di `06-icon-generation.md` §2):

**Batch 1 — Objek Inti (2×4):**
1. `post-building` — gedung kantor pos multi-departemen (anchor utama)
2. `envelope-closed` — amplop request polos
3. `envelope-locked` — amplop bersegel-gembok (Act 5, elemen baru)
4. `structured-form` — formulir berkolom (Act 4 Beat A)
5. `officer-neutral` — petugas varian 1 (Act 4 Beat B)
6. `officer-confused` — petugas varian 2, beda dari #5 (Act 4 Beat B,
   memperkuat kesan "orang baru" tiap kemunculan)
7. `gate-signage` — papan nama gerbang "REST API" (Act 1)

**Batch 2 — Method & Stempel (2×4):**
1. `method-get` — kaca pembesar
2. `method-post` — tanda plus
3. `method-put` — ikon ganti-total (mis. panah lingkar penuh)
4. `method-patch` — pensil (ubah sebagian)
5. `method-delete` — tempat sampah
6. `stamp-200` — stempel checkmark hijau (reminder dari 14, aset baru)
7. `stamp-201` — stempel checkmark+plus atau bintang (varian baru,
   "Diterima, Berkas Baru Dibuat")

Draft `icons.json` (Format A, lihat `06-icon-generation.md` §3) dibuat
saat eksekusi — prompt ChatGPT per batch disusun waktu itu juga
(deskripsi visual di atas cukup jadi acuan awal).

**Catatan biaya:** ini nambah 1 langkah manual (generate via extension,
bukan sesuatu yang bisa dieksekusi otomatis lewat Desktop Commander)
sebelum wiring ke `Animation.jsx` bisa mulai — beda dari opsi manual
SVG yang bisa langsung coding tanpa dependency eksternal. Trade-off ini
sudah disadari & dipilih demi konsistensi visual dengan 14.

---

## Konsep Teknis yang WAJIB Tetap Akurat (jangan disederhanakan sampai salah)

1. **REST adalah gaya arsitektur (set aturan/constraint), BUKAN protokol
   atau standar resmi yang di-enforce.** Berasal dari disertasi Roy
   Fielding (2000). Tidak ada "badan REST" yang menegakkan aturan ini —
   makanya penerapannya bervariasi luas di dunia nyata.
2. **Statelessness artinya server tidak menyimpan CONTEXT/SESSION klien
   antar request** (tiap request harus self-contained, bawa semua info
   yang dibutuhkan) — **BUKAN** berarti server tidak punya state sama
   sekali. Database tetap menyimpan data persisten seperti biasa.
   Animasi Act 4 jangan menyiratkan "server REST gak nyimpen data apa
   pun" — yang tidak disimpan itu konteks PERCAKAPAN antar-request, bukan
   data itu sendiri.
3. **Resource-oriented URL (kata benda, bukan kata kerja) adalah
   KONVENSI/best-practice desain**, bukan aturan HTTP yang dipaksakan
   protokol. Banyak API yang disebut "REST API" di dunia nyata sengaja
   atau tidak sengaja melanggar ini, tetap disebut REST/RESTful secara
   longgar.
4. **Mapping method ke CRUD:** GET (read), POST (create, umumnya TIDAK
   idempotent), PUT (replace/update PENUH resource, idempotent), PATCH
   (update SEBAGIAN, idempotency tidak dijamin), DELETE (hapus,
   idempotent). PUT vs PATCH paling sering ketuker junior dev — Act 3
   WAJIB kasih 1 momen visual eksplisit yang membedakan "ganti semua"
   vs "ganti sebagian", jangan cuma sebut sekilas di badge kecil.
5. **REST tidak mewajibkan format JSON.** Secara historis REST bisa
   pakai XML atau format lain — JSON cuma konvensi de-facto paling
   populer sekarang. Animasi boleh fokus penuh ke JSON (paling relevan
   buat audiens hari ini), tapi caption/closing jangan menyiratkan
   "REST = JSON" secara definitif.
6. **Sebagian besar API yang disebut "REST API" di dunia nyata tidak
   menerapkan REST penuh** sesuai definisi asli Fielding (misal tidak
   ada HATEOAS/navigasi hypermedia — Richardson Maturity Model level 3).
   Istilah "RESTful" sering dipakai lebih longgar dari definisi akademis
   aslinya. Topic ini SENGAJA tidak masuk ke HATEOAS (kompleksitas
   tinggi, di luar scope audiens junior dev) — cukup 1 baris kecil di
   Act 5/caption kalau ada slot durasi, JANGAN dipaksa jadi Act baru
   (pola sama seperti env-variables plan poin 3: sederhanakan tapi
   jangan sampai menyiratkan itu satu-satunya cara).
7. **Idempotency** (GET/PUT/DELETE = hasil akhir sama walau request
   diulang, POST = tidak selalu) adalah nuance BONUS — boleh
   disederhanakan/dilewatkan kalau Act 3 sudah padat durasinya, tapi
   kalau ada slot 1 kalimat pendek, ini nilai tambah berharga buat
   audiens junior dev yang jarang dengar istilah ini dijelasin simpel.

---

## Keputusan User

**Semua keputusan sudah dikonfirmasi (dikunci — semua bagian plan di
atas sudah reflect ini, lihat Overview/Manifest, § Icon Needs, dan
`data.js` skeleton):**

1. **Jumlah Act: 5 Act** (~44-46 detik). Opsi ringkas "gabung Act 1+2
   jadi 4 Act" (mirip pola `env-variables`) DITOLAK — draft detail 5
   Act yang dipakai.
2. **Icon: AI-generate PNG batch** (konsisten visual dengan 14) — bukan
   manual SVG shape. Detail pipeline & daftar 14 icon di § "Icon Needs".
3. **Kategori `registry.js`: `Networking`**, sejajar 13 & 14. Opsi
   cluster baru "API Design" terpisah TIDAK dipakai (belum ada preseden
   kategori itu di project ini).
4. **Nama sub-bagian Act 4: TETAP digabung 1 Act** (2 sub-beat — JSON +
   statelessness, ≈11s, agak padat). Opsi pecah jadi Act 4 & Act 5
   terpisah (total 6 Act, ~50-55s) DITOLAK — total tetap 5 Act
   (~44-46 detik) sesuai draft awal.

---

## data.js Skeleton (rencana, belum final)

```js
export const VW = 820
export const VH = 1340

export const COLORS = { /* lihat § Color Palette di atas — reuse penuh */ }

export const PHASES = [
  { id: 'naming-hook',        badge: 'ACT 1 — REST TAPI KOK SIBUK?',              duration: 7.0 },
  { id: 'before-rest-chaos',  badge: 'ACT 2 — SEBELUM ADA ATURAN',                duration: 8.0 },
  { id: 'resource-and-verb',  badge: 'ACT 3 — RUANGAN, BUKAN AKSI',               duration: 10.0 },
  { id: 'json-and-stateless', badge: 'ACT 4 — FORMULIR & PETUGAS PELUPA',         duration: 11.0 },
  { id: 'payoff-and-tease',   badge: 'ACT 5 — KONSISTEN, TAPI SIAPA YANG BOLEH BUKA?', duration: 8.0 },
]
```

```js
// diisi detail per-Act saat implementasi:
// POST_BUILDING (anchor), REQUEST_ENVELOPE (anchor, Act 2-4),
// DEPARTMENT_DOORS[] (anchor, Act 2-5, label berubah morph),
// METHOD_BADGES[] (5x, Act 3), OFFICER_VARIANTS[] (non-anchor,
// sengaja beda tiap Act 4 Beat B — lihat § Persistent Anchor Objects),
// LOCKED_ENVELOPE (baru, Act 5), STAMP_200/STAMP_201 (Act 5)
export const SFX_MAP = {
  WHOOSH:      { category: 'transitions', name: 'whoosh' },
  CLICK:       { category: 'sfx', name: 'click' },
  POP:         { category: 'ui', name: 'pop' },
  ERROR:       { category: 'sfx', name: 'error' },
  WARNING:     { category: 'warnings', name: 'alert-pulse' },
  ERROR_HUM:   { category: 'warnings', name: 'error-hum' },
  IMPACT:      { category: 'impacts', name: 'impact' },
  MATERIALIZE: { category: 'sfx', name: 'materialize' },
  SUCCESS:     { category: 'success', name: 'confirm' },
  DING:        { category: 'success', name: 'ding' },
  LOCK:        { category: 'impacts', name: 'lock' },
}
```

---

## Checklist Eksekusi (progress tracker)

Dicentang seiring jalan (per `03-tutorial-buat-topic-baru.md` § Langkah
-1), bukan ditulis ulang rapi di akhir. Item konfirmasi keputusan sudah
`[x]` (dokumen plan), sisanya masih `[ ]` — belum ada kode yang
dieksekusi sama sekali.

- [x] Konfirmasi 4 keputusan inti dengan user — jumlah Act (5), icon
      approach (AI-generate PNG), kategori registry (`Networking`), dan
      struktur Act 4 (tetap digabung 1 Act, tidak dipecah). Semua
      dikunci di § "Keputusan User" — tidak ada lagi keputusan terbuka.
- [x] Setup folder `src/content/17-rest-api/` (`Animation.jsx`,
      `data.js`, `manifest.js`) sesuai 02 §3 — 3 file wajib sudah ada.
- [x] `manifest.js` — schemaVersion 1, id/title/subtitle/category/tags/
      color/audioStrategy lengkap.
- [x] `data.js` — VW/VH 820×1340, `COLORS`, 5 `PHASES` + `TOTAL_DURATION`,
      `SFX_MAP` (nama sudah dicek match ke `public/audio/*`).
- [x] Daftarkan ke `src/content/registry.js` (baca manifest.js via
      spread pattern, status `'coming-soon'`).
- [x] Bangun Intro (typing → morph thumbnail→header) — opening line
      referensi eksplisit ke tease closing 14.
- [x] Act 1 — Nama yang Menjebak? (4 beat lengkap).
- [x] Act 2 — Sebelum Ada Aturan: Kacau (4 beat lengkap).
- [x] Act 3 — Ruangan, Bukan Aksi (4 beat lengkap, termasuk momen
      pembeda visual PUT vs PATCH).
- [x] Act 4 — Formulir Terstruktur & Petugas Pelupa (2 sub-beat: JSON,
      statelessness — jawab hook Act 1 secara eksplisit).
- [x] Act 5 — Konsisten, Tapi Siapa yang Boleh Buka? (status code
      reuse 200 + tambahan 201, tease eksplisit ke topic Authentication
      / `18-auth`).
      > Catatan: first pass semua Act di atas pakai SVG shape murni
      > (pola sama seperti `13-dns-explained`), BELUM icon PNG — lihat
      > item icon di bawah. Sudah lolos syntax-check (esbuild transform)
      > dan bundle-check (esbuild bundle, semua import/export resolve)
      > per topic; `registry.js` juga sudah dicek terpisah.
- [x] Tulis `icons/icons.json` (Format A, 2 batch × 2x4, 14 icon) —
      warna tiap icon dicocokkan ke penggunaan aktual di `Animation.jsx`
      per verifikasi kode langsung (bukan asumsi draft awal), sesuai
      06 §7. Valid JSON, tervalidasi via `JSON.parse`.
- [x] Jalankan generate PNG aktual via extension `vm-icon-generator` di
      chatgpt.com (per `icons.json` di atas) — 14 PNG sudah ada di
      `icons/`, dimensi 443×443 RGBA transparan, sudah dicek visual
      (post-building, envelope-locked, officer-neutral/confused,
      method-put/patch) sebelum wiring.
- [x] Buat `icons/loader.js` (14 import + `ICONS` map + `getIcon()`,
      pola persis 06 §6.1) dan wire `<image>` ke `Animation.jsx`
      (formula centering/offset di 06 §6.2-6.3). Rincian per-icon:
      - **Icon pengganti** (shape lama diganti `<image>`, timeline/popIn
        TIDAK berubah): `post-building` (PostBuilding, indikator "active"
        tetap SVG dinamis), `envelope-locked` (lockedSeal Act 5),
        `officer-neutral` (officerA Act 4), `officer-confused` (officerB
        Act 4).
      - **Icon aksen** (nempel di dalam box existing, teks tetap SVG asli
        biar presisi terbaca — bukan text di dalam PNG, 06 §6.3):
        `gate-signage` (signageBadge Act 1), `structured-form`
        (jsonFormCard Act 4), `method-get/post/put/patch/delete` (5x
        methodBadge Act 3, urutan dicek match `ACT3_METHODS` di
        `data.js`), `stamp-200`/`stamp-201` (Act 5).
      - **Sengaja TIDAK dipakai:** `envelope-closed` — keputusan final
        untuk catatan terbuka di bawah (`EnvelopeShape` tetap SVG murni).
      - **Sengaja TIDAK diganti:** `FaceSimple` mood="confused" di Act 1
        (`confusedFace`, warna `COLORS.WARNING`/amber) tetap SVG — beda
        kombinasi warna dari icon `officer-confused` (ungu), jadi bukan
        match yang valid (lihat 06 §7, kasus verifikasi warna sebelum
        swap). Cuma officerB Act 4 (warna ungu, match persis) yang diganti
        PNG.
      - Lolos syntax-check (`esbuild --loader:.jsx=jsx`) dan bundle-check
        (`esbuild --bundle` dengan `--loader:.png=file`) individual untuk
        `Animation.jsx`, semua 14 import PNG resolve.
      > **Keputusan final EnvelopeShape:** `EnvelopeShape` di kode aktual
      > menerima prop `color` dinamis per-instance (CLIENT biru vs SERVER
      > oranye, dipakai gantian di Act 1 & Act 4) — icon `envelope-closed`
      > yang di-generate cuma 1 varian warna netral (ikut konvensi topic
      > 14), jadi TIDAK bisa langsung swap tanpa kehilangan makna semantik
      > warna pengirim. Diputuskan: **tetap SVG shape** untuk mode
      > closed/freeform/json di `envelopeAnchor` & `flyEnv` (anchor +
      > amplop terbang), PNG `envelope-closed` sengaja tidak dipakai di
      > `Animation.jsx` (tetap ada di `loader.js`/`ICONS` map kalau nanti
      > dibutuhkan). Tidak perlu generate ulang varian warna kedua kecuali
      > ada revisi visual lebih lanjut.
- [x] Cek visual placement icon aksen (`structured-form`, `gate-signage`,
      method badges, stamps) + icon pengganti — di-screenshot via
      Puppeteer headless (`npm run dev` di port lokal, seek `tl.totalTime()`
      ke tiap Act, capture PNG) langsung terhadap `/preview/rest-api`,
      BUKAN cuma dites lolos syntax/bundle. Semua icon aksen (5x method
      badge, 2x stamp, `structured-form`, `gate-signage`) rapi tanpa
      overlap teks di sekitarnya. **1 bug ketemu & sudah diperbaiki:**
      `envelope-locked` (lockedSeal, Act 5) awalnya di-set 60×60 — kebesaran
      dibanding shape manual lama (~32×29) dan nutup teks "/orders/9" di
      pintu departemen ke-3 (posisi ini memang sengaja menimpa pintu per
      desain asli, `SECRET_ENVELOPE_END` = koordinat `DOOR_XS[2]`/`DOOR_Y`,
      tapi ukurannya perlu proporsional) — diperkecil ke 36×36, dicek ulang
      via screenshot, hasil sudah sepadan dengan shape manual lama.
      Script screenshot temporer sudah dihapus setelah verifikasi
      (tidak disimpan sebagai bagian permanen `scripts/`).
- [ ] Sambungkan `SFX_SCHEDULES` di `scripts/export-lib.js` (sinkron
      persis dengan perhitungan `time` GSAP asli, per 03 §4) — belum
      disentuh sama sekali (topic in-progress lain — 13/14/15/16 — juga
      belum, jadi ini kemungkinan langkah batch di akhir, bukan per-topic).
- [ ] Preview manual di browser (`npm run dev`), interaktif langsung oleh
      user (klik Play, dengar audio SFX, coba Prev/Next/Settings) — bagian
      VISUAL statis sudah dicek otomatis via Puppeteer screenshot (lihat
      item di atas), tapi belum ada yang nonton animasinya jalan penuh
      dengan audio & interaksi player asli.
- [ ] Ubah `status` di `registry.js` dari `'coming-soon'` → `'ready'`
      setelah icon jadi, SFX schedule tersambung, & preview manual +
      export MP4 dicoba.
- [ ] Jalankan full **Checklist Sebelum Commit** di
      `docs/standardizations/03-tutorial-buat-topic-baru.md` (13 item
      teknis + 10 item storytelling).
- [ ] Jalankan **Checklist Verifikasi Topic Baru** di
      `docs/standardizations/02-standar-konten.md` §7.

---

**Status:** 🚧 IN PROGRESS — Intro + Act 1..5 selesai, 14 icon PNG
di-generate & sudah di-wire ke `Animation.jsx` (4 icon pengganti + 8 icon
aksen, `envelope-closed` sengaja tidak dipakai, `icons/loader.js`
dibuat), terdaftar di `registry.js` sebagai `'coming-soon'`. Lolos
syntax-check & bundle-check individual (semua 14 import PNG resolve).
Belum: cek visual placement icon aksen di browser, SFX_SCHEDULES
export-lib, preview manual, export MP4.
**Dibuat:** 2026-09-11
**Terakhir diupdate:** 2026-09-11 (wiring icon PNG selesai)
