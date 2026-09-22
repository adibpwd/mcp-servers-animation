# PLAN — Topic Baru: `async-event-loop`

> Status: **PLANNING ONLY — belum ada kode dieksekusi.**
> Dibuat mengikuti `docs/standardizations/02, 03, 04, 05, 06, 08`.
> Simpan rencana ini nanti di `src/content/async-event-loop/_docs/PLAN-ASYNC-EVENT-LOOP.md`
> (folder `_docs/` = planning notes sebelum topic jadi, sesuai `02-standar-konten.md` §3).

---

## 0. Ringkasan Eksekutif

| Field | Isi |
|---|---|
| Topic ID | `async-event-loop` |
| Judul | Async/Await & Event Loop |
| Subjudul (hook) | Kenapa Kode "Loncat"? |
| Kategori | Programming Concepts / JavaScript |
| Audiens | Anak IT / junior dev, spesifik JS & web dev |
| Analogi utama | Async = pesan makanan online — tidak berdiri nunggu di depan kasir, lanjut kerja lain sambil nunggu notifikasi |
| Hook Act 1 | Bug klasik: kenapa hasil `fetch()` API kadang `undefined` padahal kode "kelihatan" sudah nunggu |
| Alur wajib tercakup | Call Stack → async task masuk queue → Event Loop jalanin task lain dulu → callback/await baru dieksekusi pas hasil siap |
| Gaya visual | Vector shapes murni (rect/circle/path) — TIDAK butuh AI-generated icon set baru (lihat §7) |
| Viewport | `820x640` (standard, sesuai `03-tutorial` — konten diagram+teks seimbang, tidak vertikal/horizontal berat) |

---

## 1. Kepatuhan ke Standar (Ringkasan Cross-Check)

- **02-standar-konten**: folder wajib `Animation.jsx` + `data.js` + `manifest.js`,
  ikuti kontrak baru (bukan struktur lama) karena ini topic BARU. Referensi
  pola: `src/content/linux-vs-unix/` (satu-satunya topic yang sudah full
  ikut kontrak §3 dokumen 02).
- **03-tutorial-buat-topic-baru**: storytelling 4-beat per Act, Act 1 = hook
  bukan jawaban, wording ≤7-8 kata/kalimat, TANPA emoji di visual produksi,
  TANPA kata ganti orang ("kamu/lo/kita" dst — semua teks impersonal/generik),
  visual tidak monoton kotak, 1 kanal per kalimat (caption vs card, tidak dobel).
- **04-referensi-gsap**: time cursor (bukan `+=` / bukan angka absolut hardcode),
  tween-object untuk counter/progress, `window.__flushSync` WAJIB,
  Persistent Anchor Object untuk Call Stack/Callback Queue/Event Loop
  (representasi hal sama lintas-Act — lihat §6 di bawah), seeded random
  kalau ada timing acak (di topic ini kemungkinan TIDAK perlu randomness
  yang pengaruhi timing — dicatat eksplisit di §9).
- **05-svg-text-guide**: box multi-baris pakai formula tinggi
  `(fontSize*lineCount)+((lineCount-1)*lineSpacing)+padding`, formula
  cek-overlap center-anchor untuk elemen sejajar (dipakai untuk 3 kotak kode
  Act 1 & baris antrian Callback Queue), palet warna project dipakai
  konsisten dengan makna semantik (lihat §7).
- **06-icon-generation**: karena topic ini abstrak/konseptual (bukan brand
  logo), diputuskan TIDAK generate icon set AI baru — cukup vector shape
  (lihat keputusan detail §7). Kalaupun nanti ditambah Badge/TextCard
  component baru, wajib sudah punya prop `icon` opsional sejak awal
  (dicatat di checklist §10).
- **08-audio-sfx-generation**: SFX_MAP di-map penuh ke asset yang SUDAH ADA
  di `public/audio/*/` (scan sudah dilakukan, lihat §8) — tidak perlu
  sourcing/download SFX baru sama sekali untuk versi pertama topic ini.

---

## 2. Struktur Folder yang Akan Dibuat (Eksekusi Nanti, Belum Sekarang)

```
src/content/async-event-loop/
├── Animation.jsx        (wajib)
├── data.js              (wajib — VW, VH, PHASES, COLORS, SFX_MAP)
├── manifest.js           (wajib — metadata, dibaca registry.js)
├── caption.md            (opsional — dibuat belakangan, isi caption sosmed)
└── _docs/
    └── PLAN-ASYNC-EVENT-LOOP.md   (file plan ini sendiri)
```

Tidak ada folder `icons/` (lihat §7 — keputusan pure-vector).
Tidak ada `sfx-loader.js` lokal — import `src/shared/audio/sfxLoader.js`.

---

## 3. `manifest.js` (Rencana Isi)

```js
export default {
  schemaVersion: 1,
  id: 'async-event-loop',
  title: 'Async/Await & Event Loop',
  subtitle: 'Kenapa kode JavaScript kelihatan "loncat"',
  category: 'Programming Concepts',
  tags: ['JavaScript', 'Async', 'Event Loop', 'Call Stack', 'Web Dev'],
  color: '#FBBF24', // kuning — dipakai project untuk "Video/Warning" tapi
                     // di sini dipilih sebagai warna identitas topic (bukan
                     // makna semantik in-video); alternatif: '#A78BFA'
                     // (ungu, makna "Technical term") — keputusan final
                     // di tahap eksekusi, lihat catatan §7 soal warna.
  audioStrategy: 'realtime',
}
```

---

## 4. `data.js` (Rencana Struktur — Belum Isi Final)

### 4.1 Viewport & Fasa

```js
export const VW = 820
export const VH = 640

export const PHASES = [
  { label: 'Intro',                         duration: 1.2 },
  { label: 'Act 1: Kode yang "Loncat"',     duration: 8.0 },
  { label: 'Act 2: Satu Kasir, Satu Antrian', duration: 9.0 },
  { label: 'Act 3: Titip ke Dapur',         duration: 9.5 },
  { label: 'Act 4: Event Loop Berjaga',     duration: 9.5 },
  { label: 'Act 5: Giliran Tiba',           duration: 8.5 },
]
// Total durasi 1 loop ≈ 45.7 detik (belum termasuk repeatDelay 1.5s)
```

Durasi adalah estimasi awal — akan disesuaikan saat implementasi nyata
setelah dicoba preview (aturan `03-tutorial` Langkah 1: ubah 1 angka
durasi, semua Act setelahnya otomatis ikut geser karena pola time cursor).

### 4.2 Palet Warna Semantik (subset dari `05-svg-text-guide.md` §Color Palette)

| Elemen | Warna | Alasan makna |
|---|---|---|
| Call Stack (box bertumpuk) | Cyan `#06B6D4` | "Network, System" — inti mesin eksekusi |
| Kode/baris sinkron (yang jalan normal) | Text Primary `#E2E8F0` | netral, baca teks kode |
| Task/Promise yang masih pending | Yellow `#FBBF24` | "Warning" — status "belum siap" |
| Callback Queue (antrian) | Purple `#A78BFA` | "Technical term" — struktur data antrian |
| Event Loop (wheel/anak panah) | Green `#34D399` | "Success" — mekanisme yang bikin semua akhirnya "berhasil" jalan |
| Hasil salah / bug (`undefined`) | Red `#F43F5E` | "Alert, Error" |
| Hasil benar (data asli, resolved) | Green `#34D399` | "Success" |
| Web API / "Dapur" background | Orange `#FB923C` | "Process, Activity" — kerja di background |

### 4.3 `SFX_MAP` (Rencana — full mapping ke asset existing, lihat §8)

```js
export const SFX_MAP = {
  POP:            { category: 'ui',          name: 'pop' },
  POP_2:          { category: 'ui',          name: 'pop-2' },
  TICK:           { category: 'ui',          name: 'tick' },
  CHIME:          { category: 'ui',          name: 'chime' },
  WHOOSH:         { category: 'transitions', name: 'whoosh' },
  WHOOSH_LOW:     { category: 'transitions', name: 'whoosh-low' },
  SLIDE_IN:       { category: 'transitions', name: 'slide-in' },
  STACK_PUSH:     { category: 'impacts',     name: 'impact' },
  ERROR:          { category: 'sfx',         name: 'error' },
  SUCCESS:        { category: 'sfx',         name: 'success' },
  CONFIRM:        { category: 'success',     name: 'confirm' },
  DING:           { category: 'success',     name: 'ding' },
  WARNING_PULSE:  { category: 'warnings',    name: 'alert-pulse' },
  LATENCY_TICK:   { category: 'warnings',    name: 'latency-tick' },
  TYPING:         { category: 'sfx',         name: 'typing' },
}
```

Setiap entry di atas WAJIB benar-benar dipanggil di `Animation.jsx` saat
eksekusi (cross-check checklist `08` §3 & §8) — daftar ini rencana awal,
akan di-audit ulang & dipangkas kalau ada yang ternyata tidak kepakai.

---

## 5. Breakdown Cerita Per-Act (4-Beat: Setup → Tegangan → Titik Balik → Payoff)

### Intro (t=0 → 1.2s)

Pola morph standar (`03-tutorial` Langkah 2): teks besar center
"ASYNC / AWAIT" (thumbnail, dobel sebagai cover Reels) → morph jadi
header kecil kiri-atas "Async/Await & Event Loop" + subjudul kecil
"Kenapa kode JavaScript kelihatan 'loncat'". Interpolasi lerp X/Y/fontSize,
`textAnchor` tetap `start`, titik awal dihitung matematis center layar
(lihat formula `startX = VW/2 - thumbWidth/2`).

SFX: `WHOOSH_LOW` saat morph mulai (opsional, elemen kecil — sesuai
policy `sfx: false` boleh silent kalau morph teks dianggap dekoratif;
diputuskan: TETAP pasang whoosh halus supaya intro tidak "mati suara").

### Act 1 — "Kode yang Loncat" (Hook, TIDAK menjawab penuh)

**Durasi rencana:** 8.0s

**Visual utama:** 3 baris kode disederhanakan sebagai 3 card/badge
sejajar vertikal (bukan syntax-highted lengkap — cukup representasi
ringkas, sesuai gaya project yang audiens awam/junior, bukan editor kode
sungguhan):

```
[1] "Ambil data user"     (mewakili: const data = fetchUser())
[2] "Tampilkan nama user" (mewakili: console.log(data.name))
[3] "Selesai"
```

**Beat:**
- **Setup** — 3 card muncul berurutan (popIn top→bottom, ~0.3s stagger),
  terlihat "normal", urutan baris 1-2-3 dari atas ke bawah, kesan:
  "ini pasti jalan urut seperti dibaca".
- **Tegangan** — Baris [2] "Tampilkan nama user" ter-highlight duluan
  (border pulse kuning) SEBELUM baris [1] selesai (baris [1] masih ada
  badge kecil "sedang diambil..." dengan spinner/dot animasi). Penonton
  janggal: kok baris 2 jalan sebelum baris 1 kelar?
- **Titik balik (mini, bukan payoff penuh)** — hasil baris [2] muncul di
  "console" kecil di bawah: teks besar merah **`undefined`** + shape
  muka bulat reaksi bingung (sesuai `03-tutorial` §3.6, contoh muka
  kaget) di sebelahnya.
- **Payoff Act 1 = CLIFFHANGER, bukan jawaban** — caption bar tutup Act
  dengan pertanyaan retoris, bukan penjelasan:
  `"Kode ditulis urut. Kenapa hasilnya tidak?"`

**Wording (≤7-8 kata, tanpa emoji, tanpa kata ganti orang):**
- Card 1: "Ambil data user dari server."
- Card 2: "Tampilkan nama user di layar."
- Card 3: "Proses selesai."
- Console error card: "Hasil: undefined" (badge merah)
- Cliffhanger caption: "Kode ditulis urut. Kenapa hasilnya tidak?"

**SFX:** `POP` tiap card muncul (kategori `ui`), `WARNING_PULSE` saat
baris [2] ter-highlight duluan (tegangan), `ERROR` saat `undefined`
muncul.

**Elemen non-kotak (wajib min 1 per Act, `03-tutorial` §3.6):** muka
bulat reaksi bingung di sebelah `undefined` (circle + shape mata/mulut),
plus speech-bubble kecil opsional utk cliffhanger caption kalau caption
bar dirasa kurang menonjol.

**Catatan `05-svg-text-guide` overlap check:** 3 card sejajar vertikal
(bukan horizontal) jadi formula overlap horizontal dari §5 tidak relevan
di sini — dipakai instead formula VERTIKAL yang sama (ganti x/w dengan
y/height) untuk pastikan jarak antar-card cukup (card height + gap ≥ 15-20px).

### Act 2 — "Satu Kasir, Satu Antrian" (Call Stack)

**Durasi rencana:** 9.0s

**Konsep teknis:** JavaScript single-threaded — cuma ada 1 "kasir" (main
thread) yang bisa proses 1 hal dalam satu waktu. Fungsi yang manggil
fungsi lain numpuk kayak piring (LIFO — Last In First Out): masuk
terakhir, keluar duluan.

**Persistent anchor baru diperkenalkan di sini:** `callStackAnchor` —
tumpukan box vertikal di sisi kanan layar, representasi Call Stack.
Objek ini akan tetap ada (dengan popIn SEKALI di sini) sampai Act 5,
posisi/isi berubah via tween, BUKAN pop-in ulang tiap Act (lihat §6).

**Beat:**
- **Setup** — Call Stack kosong (garis dasar "CALL STACK" + area kosong).
  Fungsi `main()` masuk (push box pertama), lalu dari dalamnya panggil
  fungsi lain (push box kedua di atasnya) — stack bertumpuk ke atas,
  visual box makin tinggi.
- **Tegangan** — Salah satu box yang di-push adalah task LAMBAT
  (representasi `fetchUser()`, warna kuning/pending). Muncul pertanyaan
  visual: kalau kasir cuma bisa kerja 1-1, apa dia harus DIAM nunggu box
  kuning ini selesai? (card kecil bertanya, bentuk speech bubble:
  "Apakah kasir harus diam menunggu?")
- **Titik balik** — Box kuning (task lambat) TIDAK menumpuk diam di
  stack — dia "terbang keluar" dari stack (animasi moving element,
  `04-referensi-gsap` Advanced Pattern: Moving Element) menuju area baru
  di luar Call Stack (belum dijelaskan itu apa — cuma diberi label
  samar "?" dulu, detail penuh di Act 3).
- **Payoff Act 2 (cliffhanger, bukan closure penuh)** — Call Stack lanjut
  kerjain box lain (pop box selesai satu-satu, mengecil), kasir TIDAK
  pernah diam. Caption: "Tugas lambat pergi. Kasir lanjut kerja lain."

**Wording:**
- Label anchor: "CALL STACK"
- Box: "main()", "fetchUser()", "console.log()" dst (nama fungsi boleh
  tetap English karena istilah teknis JS — sesuai aturan "istilah
  teknis tetap dipertahankan" di `03-tutorial`)
- Speech bubble tegangan: "Kasir harus diam menunggu?"
- Cliffhanger: "Tugas lambat pergi. Kasir lanjut kerja lain."

**SFX:** `STACK_PUSH` (kategori `impacts`, nama `impact`) tiap box push
— physically berat, cocok kategori impact bukan ui-pop. `TICK` tiap box
pop (selesai, kategori ui, ringan). `WHOOSH` saat box kuning terbang
keluar stack.

**Elemen non-kotak:** speech bubble pertanyaan (rounded rect + ekor
segitiga, sesuai contoh `03-tutorial` §3.6).

### Act 3 — "Titip ke Dapur" (Async Task ke Background / Web API)

**Durasi rencana:** 9.5s

**Konsep teknis + analogi utama masuk di sini secara penuh:** task
lambat (fetch) sebenarnya dititipkan ke "dapur" (Web API / browser
background, di luar Call Stack & di luar JS engine) — seperti pesan
makanan online: taruh pesanan, tidak berdiri nunggu di depan kasir,
kasir (main thread) bebas lanjut kerja lain.

**Persistent anchor baru:** `kitchenAnchor` — box "DAPUR / WEB API" di
sisi kiri layar (kontras dengan Call Stack di kanan), tempat box kuning
dari Act 2 "mendarat".

**Objek moving (bukan anchor, transient):** `orderTicket` — merepresentasi
1 request tunggal, terbang dari Call Stack → Dapur di awal Act, lalu dari
Dapur → Callback Queue di akhir Act (lanjut ke Act 4).

**Beat:**
- **Setup** — Box kuning (dari Act 2) mendarat di `kitchenAnchor`, label
  box berubah dari "?" jadi "fetchUser() diproses". Analogi visual
  muncul berdampingan: ikon sederhana "struk pesanan" (persegi kecil
  dengan garis-garis teks, bukan icon PNG — cukup shape) merepresentasi
  order online.
- **Tegangan** — Sementara dapur masih masak (progress bar/dot animasi
  "menunggu respons server..."), Call Stack di kanan TETAP jalan —
  render box lain naik-turun cepat (`console.log("selesai")` duluan
  jalan & pop). Ini elemen kunci yang menjawab Act 1: baris kode setelah
  fetch JALAN DULUAN karena Call Stack tidak menunggu dapur.
- **Titik balik** — Dapur selesai masak (progress bar penuh, `DING`
  sfx), tapi hasilnya TIDAK langsung lompat ke Call Stack — dia masuk
  ke antrian baru dulu: `callbackQueueAnchor` (garis horizontal antrian
  di bagian bawah layar, popIn SEKALI di sini, persist sampai Act 5).
- **Payoff Act 3 (cliffhanger)** — Order ticket (sekarang berlabel "data
  user siap") duduk di ujung antrian. Caption: "Data sudah siap. Tapi
  belum langsung dipakai."

**Wording:**
- Label anchor: "DAPUR (Web API)"
- Progress: "Menunggu respons server..."
- Label queue baru: "ANTRIAN CALLBACK"
- Cliffhanger: "Data sudah siap. Tapi belum langsung dipakai."

**SFX:** `WHOOSH` saat ticket terbang Call Stack→Dapur, `LATENCY_TICK`
selama progress "memasak" (loop kecil, gunakan tick pelan berulang atau
1x saja di pertengahan — keputusan detail saat implementasi), `DING`
saat dapur selesai, `SLIDE_IN` saat ticket masuk antrian.

**Elemen non-kotak:** shape "struk pesanan" kecil (persegi + garis-garis
horizontal mewakili teks struk, BUKAN rect polos kosong), progress
bar/pill untuk "memasak" (sesuai tabel 3.6: progress = bar/pill + icon
pendukung).

### Act 4 — "Event Loop Berjaga" (Mekanisme Penjembatan)

**Durasi rencana:** 9.5s

**Konsep teknis:** Event Loop = mekanisme yang TERUS-MENERUS cek: apakah
Call Stack kosong? Kalau ya, ambil task paling depan dari Callback Queue,
push ke Call Stack. Ini jawaban INTI dari seluruh video.

**Persistent anchor baru:** `eventLoopAnchor` — bentuk lingkaran dengan
anak panah melingkar (bukan kotak — sengaja beda shape supaya kesan
"muter terus", ditempatkan di antara Call Stack (kanan) dan Callback
Queue (bawah) secara visual, sebagai jembatan).

**Beat:**
- **Setup** — Event Loop muncul (popIn SEKALI), mulai "muter" (rotasi
  kontinu, `ease: 'none'` sesuai tabel easing `04-referensi-gsap` untuk
  loop kontinu). Call Stack MASIH ada isi (box sinkron sisa dari Act 3
  yang belum kelar, misal "console.log('Proses selesai')" masih di
  stack).
- **Tegangan** — Ticket "data user siap" di ujung antrian, dengan panah
  putus-putus menunjuk ke Event Loop, tapi BELUM bergerak — ada label
  kecil "menunggu giliran..." Highlight visual: Call Stack masih ada isi
  (belum kosong) → Event Loop "menahan diri", panah loop melambat/pause
  sebentar di titik cek.
- **Titik balik (AHA MOMENT utama seluruh video)** — Call Stack akhirnya
  kosong (box terakhir pop, area stack jadi benar-benar kosong dengan
  highlight hijau "STACK KOSONG"). Event Loop langsung bereaksi: panah
  loop "menangkap" ticket dari depan antrian, tarik masuk ke Call Stack.
- **Payoff Act 4 (cliffhanger tipis ke Act 5)** — Ticket sekarang jadi
  box baru di Call Stack (posisinya di-tween dari Callback Queue ke Call
  Stack, BUKAN pop-in dari 0 — dia "objek yang sama" berpindah tempat).
  Caption: "Giliran callback akhirnya tiba."

**Wording:**
- Label anchor: "EVENT LOOP"
- Tegangan: "Menunggu giliran..."
- Highlight titik balik: "Stack kosong."
- Cliffhanger: "Giliran callback akhirnya tiba."

**SFX:** `TICK` halus tiap "putaran cek" Event Loop (loop kontinu, jangan
terlalu sering — throttle sesuai `04-referensi-gsap` §Performance, cukup
1 tick per ~1 detik simulasi cek, bukan tiap frame), `CONFIRM` (kategori
`success`) saat Call Stack terdeteksi kosong, `WHOOSH_LOW` saat ticket
ditarik dari antrian ke stack.

**Elemen non-kotak:** Event Loop sendiri adalah lingkaran+panah melingkar
(bukan kotak) — ini elemen wajib "bukan rect polos" untuk Act ini,
sudah otomatis terpenuhi dari konsepnya.

### Act 5 — "Giliran Tiba" (Payoff Penuh — Jawab Hook Act 1)

**Durasi rencana:** 8.5s

**Beat:**
- **Setup** — Box callback (eks-ticket) sekarang di Call Stack, mulai
  dieksekusi: label berubah jadi "Tampilkan nama user (dengan data
  asli)".
- **Tegangan (kecil, kontras ke Act 1)** — split-screen kecil/side-by-
  side: kartu "Sebelum" (Act 1, `console.log` di luar callback → jalan
  duluan → `undefined`, merah) vs kartu "Sesudah" (callback di dalam
  `.then()`/`await` → nunggu giliran antrian → data asli, hijau).
- **Titik balik** — Console (yang sama seperti Act 1) update: bukan lagi
  `undefined` merah, tapi nama user asli (misal "Rani") hijau + muka
  bulat reaksi senang (kontras dari muka bingung Act 1 — TAPI ini objek
  BARU bukan anchor yang sama, karena secara naratif ini "hasil kedua",
  jadi popIn baru wajar, bukan pelanggaran aturan anchor).
- **Payoff FINAL — jawab hook Act 1 secara eksplisit** ("ternyata gitu",
  sesuai checklist storytelling): caption penutup:
  `"Ternyata: kode tidak diam, hasil balik lewat antrian."`
  Lalu ringkasan visual 1 baris alur (Call Stack → Dapur → Antrian →
  Event Loop → Call Stack lagi) sebagai penutup singkat sebelum loop
  ulang (`repeatDelay: 1.5`).

**Wording:**
- Kartu "Sebelum": "Kode lanjut. Data belum siap. Hasil: undefined."
- Kartu "Sesudah": "Kode tunggu giliran. Data sudah siap."
- Console hasil: "Hasil: Rani" (hijau)
- Payoff akhir: "Ternyata: kode tidak diam, hasil balik lewat antrian."

**SFX:** `SUCCESS` saat console update ke hasil benar, `POP_2` saat muka
senang muncul, `CHIME` di akhir ringkasan alur (penutup manis sebelum
loop).

**Elemen non-kotak:** muka bulat reaksi senang (kontras muka bingung Act
1), dua kartu "Sebelum/Sesudah" boleh pakai badge/starburst kecil di
kartu "Sesudah" untuk menandai "insight" (sesuai tabel 3.6: insight →
badge/starburst, bukan rect biasa).

---

## 6. Persistent Anchor Objects — Daftar & Rencana Transisi

Sesuai `04-referensi-gsap` §"Persistent Anchor Object Lintas-Act", 3
objek berikut WAJIB dirender SEKALI di luar blok `{phaseIdx === N && ...}`,
popIn cuma di entrance pertama, transisi berikutnya pakai tween posisi/
warna (bukan popIn ulang):

| Anchor ID | Entrance (popIn sekali) | Act aktif berikutnya | Jenis transisi |
|---|---|---|---|
| `callStackAnchor` | Act 2 (awal) | Act 2, 3, 4, 5 | Tween: box push/pop (tinggi tumpukan), tidak pernah pop-in ulang wadahnya |
| `kitchenAnchor` | Act 3 (awal) | Act 3, (fade opacity turun di Act 4-5 tapi TETAP ada di DOM, bukan unmount) | Tween opacity turun (0.9→0.4) saat fokus pindah ke Event Loop/Queue, BUKAN dihapus |
| `callbackQueueAnchor` | Act 3 (akhir) | Act 3, 4, 5 | Tween: isi antrian bertambah/berkurang (posisi ticket bergeser) |
| `eventLoopAnchor` | Act 4 (awal) | Act 4, 5 | Tween: kecepatan rotasi berubah (melambat saat "menahan", normal saat aktif) |

**Objek transient (BUKAN anchor, boleh pop-in/pop-out normal per Act):**
`orderTicket` yang berpindah Call Stack → Dapur → Antrian → Call Stack
sebenarnya secara naratif ADALAH 1 entitas yang sama (task fetch yang
sama) — jadi harus diperlakukan sebagai anchor juga (bukan pop-in ulang
tiap dia pindah tempat), cukup 1 `id` tetap: `orderTicketAnchor`, popIn
sekali di Act 2 (saat pertama kali "lahir" sebagai task lambat), lalu di
Act 3/4/5 semuanya pakai tween posisi (moving element pattern, `04-referensi-gsap`
Advanced Pattern: Moving Element) — BUKAN entrance/exit pop tiap pindah
lokasi. Ini poin penting yang direvisi dari draft awal supaya konsisten
dengan aturan anchor (awalnya sempat dianggap "transient", ternyata
secara naratif dia representasi hal sama sepanjang cerita, jadi masuk
kategori anchor).

**State reset di awal loop (wajib, `03-tutorial` §3.2):** SEMUA anchor di
atas harus direset ke kondisi awal (Call Stack kosong, Dapur idle,
Antrian kosong, Event Loop di posisi awal, ticket belum lahir/hidden) di
`master.add()` paling awal timeline (t=0, sebelum Intro), supaya loop
ke-2 dst tidak "nyangkut" di state akhir loop sebelumnya.

---

## 7. Keputusan Visual & Icon (Cross-check `06-icon-generation`)

**Keputusan: TIDAK generate icon set AI baru untuk versi pertama.**
Alasan (mengacu tabel keputusan `06-icon-generation` §8): topic ini
100% konsep abstrak (call stack, queue, event loop, dapur/Web API) —
bukan brand/logo yang dikenal luas, jadi representasi vector shape
custom (rect/circle/path) sudah cukup & lebih presisi daripada hasil
AI-generate yang "kurang nempel". Preseden: `process-vs-thread` (topic
serupa, sama-sama konsep abstrak) juga tidak punya folder `icons/`.

**Konsekuensi:** tidak perlu `icons.json`, tidak perlu buka Chrome
extension `vm-icon-generator`, tidak ada dependency ke API port 3373
untuk topic ini.

**Kalau nanti (revisi pasca-rilis) ingin nambah icon** (misal browser
logo asli untuk Web API, atau logo Node.js/JS): ikuti §8-9
`06-icon-generation.md` — cek dulu apakah itu brand dikenal luas (pakai
Devicon/Simple Icons, download bukan AI-generate) vs konsep abstrak
(tetap vector). Dicatat sebagai "di luar scope" versi pertama ini, taruh
di `revisi/` kalau jadi dikerjakan nanti (`02-standar-konten` §3).

**Komponen text-container baru yang akan dibuat** (`OrderCard`/`CodeLineCard`
untuk Act 1, `Badge` untuk insight Act 5): WAJIB sudah support prop
`icon` opsional sejak awal dibuat, meski tidak dipakai di versi pertama
(checklist `06-icon-generation` §10) — supaya kalau nanti mau nambah
icon kecil, tidak perlu refactor komponennya lagi.

**Warna identitas topic (`manifest.js` `color`):** kandidat `#FBBF24`
(kuning, dipakai project untuk makna "Video/Warning" — cocok karena
"pending/waiting state" adalah tema sentral topic ini) vs `#A78BFA`
(ungu, makna "Technical term" — cocok karena ini topic bahasa
pemrograman). Rekomendasi: **`#A78BFA`** (ungu) untuk `manifest.js`
supaya tidak bentrok makna in-video kuning yang dipakai untuk
"task pending" (akan sering muncul di Act 2-4) — dipakai warna berbeda
antara "warna identitas card topic di homepage" vs "warna semantik
di dalam video" supaya tidak membingungkan. Keputusan final saat
eksekusi, boleh disesuaikan setelah lihat preview `ContentCard`.

---

## 8. Rencana SFX Lengkap & Cross-check Asset (Cross-check `08-audio-sfx-generation`)

**Hasil scan `public/audio/*/` (sudah dilakukan, §0 langkah 0 dari
`08-audio-sfx-generation`):** SEMUA kebutuhan SFX topic ini bisa dipenuhi
dari asset yang sudah ada — tidak perlu sourcing/download baru sama
sekali untuk versi pertama.

| Momen | SFX_MAP key | File asset | Kategori folder |
|---|---|---|---|
| Card kode Act 1 muncul | `POP` | `ui/pop.wav` | `ui` |
| Baris [2] ter-highlight duluan (tegangan) | `WARNING_PULSE` | `warnings/alert-pulse.wav` | `warnings` |
| `undefined` muncul (Act 1 titik balik) | `ERROR` | `sfx/error.wav` | `sfx` |
| Box push ke Call Stack | `STACK_PUSH` | `impacts/impact.wav` | `impacts` |
| Box pop dari Call Stack | `TICK` | `ui/tick.wav` | `ui` |
| Task lambat terbang keluar stack | `WHOOSH` | `transitions/whoosh.wav` | `transitions` |
| Ticket terbang Call Stack→Dapur | `WHOOSH` (reuse) | `transitions/whoosh.wav` | `transitions` |
| Progress "memasak" di Dapur | `LATENCY_TICK` | `warnings/latency-tick.wav` | `warnings` |
| Dapur selesai masak | `DING` | `success/ding.wav` | `success` |
| Ticket masuk Callback Queue | `SLIDE_IN` | `transitions/slide-in.wav` | `transitions` |
| Event Loop mulai muter (entrance) | `POP_2` | `ui/pop-2.wav` | `ui` |
| Tiap "putaran cek" Event Loop (throttled) | `TICK` (reuse) | `ui/tick.wav` | `ui` |
| Call Stack terdeteksi kosong | `CONFIRM` | `success/confirm.wav` | `success` |
| Ticket ditarik antrian→stack | `WHOOSH_LOW` | `transitions/whoosh-low.wav` | `transitions` |
| Console hasil benar (Act 5) | `SUCCESS` | `sfx/success.wav` | `sfx` |
| Muka senang muncul (Act 5) | `POP_2` (reuse) | `ui/pop-2.wav` | `ui` |
| Ringkasan penutup / chime akhir | `CHIME` | `ui/chime.wav` | `ui` |
| (Opsional) Intro whoosh halus | `WHOOSH_LOW` (reuse) | `transitions/whoosh-low.wav` | `transitions` |
| (Cadangan, tidak wajib dipakai) efek ketik kalau ada intro typing | `TYPING` | `sfx/typing.wav` | `sfx` |

**Audit `sfx: false` yang direncanakan** (sesuai policy `04-referensi-gsap`
§"Policy: sfx: false Wajib Ada Alasan"): elemen dekoratif kecil seperti
garis panah putus-putus penunjuk (Act 4 tegangan) boleh `sfx: false`
karena SFX `WARNING_PULSE`/`TICK` di elemen terkait pada waktu berdekatan
sudah "mewakili" momen itu — akan didokumentasikan eksplisit di komentar
kode saat implementasi, bukan diputuskan ad-hoc.

**Catatan format file:** semua asset di atas sudah `.wav` — tidak perlu
konversi 44.1kHz/16-bit tambahan (asumsi asset existing sudah konsisten
dengan asset lain yang sudah dipakai project, tidak perlu re-cek per
file kecuali ada masalah spesifik saat playback).

---

## 9. Catatan Determinism (Cross-check `04-referensi-gsap` §Determinism)

Topic ini KEMUNGKINAN BESAR tidak butuh `Math.random()` untuk timing —
semua urutan (push/pop stack, ticket pindah lokasi, event loop cek)
bersifat deterministik & terjadwal pasti lewat time cursor manual, bukan
delay acak antar-elemen. Kalau saat implementasi ternyata ditambah efek
kosmetik acak (misal variasi kecil posisi dot spinner "memasak"), WAJIB
pakai `seededRandom01()` kalau itu mempengaruhi `t` (timing) berikutnya,
aman pakai `Math.random()` kalau cuma variasi visual kosmetik murni
(tidak mengubah durasi/timestamp Act setelahnya). Tidak ada efek "typing"
karakter-per-karakter direncanakan untuk topic ini (opsional, bisa
ditambah di intro kalau mau kesan "kode diketik", tapi TIDAK termasuk
rencana wajib versi pertama).

---

## 10. Checklist Final Sebelum Eksekusi Kode (Gabungan `02/03/04/05/06/08`)

**Struktur & kontrak (02):**
- [ ] `Animation.jsx`, `data.js`, `manifest.js` dibuat sesuai kontrak §3
- [ ] `registry.js` dibaca dari `manifest.js` (import + spread), bukan
      hardcode literal baru
- [ ] Tidak ada `sfx-loader.js` lokal, import dari `src/shared/audio/sfxLoader.js`

**Teknis GSAP (03 & 04):**
- [ ] `window.__animationTimeline = master` + `window.__flushSync = flushSync`
      di-assign di `useEffect` mount, cleanup `tl.kill()` saat unmount
- [ ] Time cursor manual (`let time = 0`), bukan `+=` relative & bukan
      angka absolut hardcode
- [ ] SEMUA anchor (§6) reset ke clean slate di awal tiap loop
- [ ] Tween ke fixed target value (bukan cumulative) untuk semua counter/progress
- [ ] 4 anchor persistent (§6) dirender di luar blok conditional per-Act,
      popIn cuma sekali di entrance pertama masing-masing

**Storytelling (03 §3.0, 3.6, 3.7):**
- [ ] Act 1 melempar pertanyaan (`"Kode ditulis urut. Kenapa hasilnya
      tidak?"`), TIDAK dijawab penuh sampai Act 5
- [ ] Tiap Act (2-5) py beat setup→tegangan→titik balik→payoff/cliffhanger
      (lihat detail §5 tiap Act)
- [ ] Minimal 1 elemen non-rect-polos per Act (speech bubble/muka/badge/
      shape lingkaran Event Loop — sudah dipetakan per Act di §5)
- [ ] Ending Act 5 menjawab hook Act 1 eksplisit ("Ternyata: kode tidak
      diam, hasil balik lewat antrian.")
- [ ] Semua kalimat ≤7-8 kata, 1 ide/kalimat (draft wording di §5 sudah
      dicek kasar, akan di-review lagi saat implementasi)
- [ ] TIDAK ada emoji di teks/icon produksi manapun
- [ ] TIDAK ada kata ganti orang (lo/lu/kamu/aku/gue/kita/kau, -mu/-ku)
      di semua teks in-video — semua wording di §5 sudah ditulis
      impersonal (subjek: "kode", "kasir", "data", bukan menyapa penonton)
- [ ] Tidak ada kalimat dobel persis antara caption bar & card/badge
      (per Act, pastikan caption cliffhanger BEDA kalimat dari teks di card)

**SVG/Text (05):**
- [ ] Box multi-baris (kalau ada) pakai formula tinggi §"Formula Tinggi Box"
- [ ] 3 card Act 1 (sejajar vertikal) & elemen antrian (sejajar horizontal)
      dicek pakai formula overlap center-anchor, bukan cuma eyeball
- [ ] Kontras warna teks vs background dicek ≥4.5:1 (pakai palet §4.2
      yang semua sudah lolos WCAG AA per `05-svg-text-guide`)

**Icon (06):**
- [ ] Keputusan pure-vector (§7) dikonfirmasi tidak berubah saat mulai
      implementasi (kalau berubah pikiran mau pakai icon brand asli,
      re-visit §8-9 `06-icon-generation.md` dulu)
- [ ] Komponen text-container baru (`OrderCard`, `Badge`, dst) sudah
      punya prop `icon` opsional sejak dibuat

**Audio (08):**
- [ ] Semua `SFX_MAP` entry (§8) benar-benar dipanggil di `Animation.jsx`,
      tidak ada dead config
- [ ] `popIn()`/helper SFX generik menerima `sfxCategory` eksplisit,
      tidak hardcode 1 kategori (banyak kategori dipakai topic ini: ui,
      impacts, transitions, warnings, success, sfx)
- [ ] Audit SFX Coverage penuh dilakukan sebelum anggap selesai (baca
      ulang timeline baris-per-baris, cross-check §8 tabel)
- [ ] Preview manual dev server, dengarkan full durasi sebelum commit

**Export & lain-lain:**
- [ ] Preview `/player/async-event-loop` jalan normal
- [ ] Export single-process menghasilkan mp4 dengan audio sinkron
- [ ] Topic lain tetap bisa di-preview & export tanpa error setelah
      `registry.js` diubah

---

## 11. Yang TIDAK Termasuk Scope Versi Pertama (Eksplisit)

- Icon set AI-generate (§7 — keputusan pure-vector untuk v1)
- `caption.md` (caption sosial media) — dibuat belakangan setelah
  Animation.jsx final, ikut pola `linux-vs-unix/caption.md`
- Efek "typing" karakter-per-karakter di intro (opsional, §9)
- Materi lanjutan seperti `Promise.all`, `async generator`, microtask vs
  macrotask (setTimeout vs Promise) — topic ini FOKUS ke alur dasar
  (call stack → queue → event loop → callback), materi lanjutan bisa
  jadi topic terpisah kalau dibutuhkan nanti

---

## 12. Langkah Eksekusi Selanjutnya (Setelah Plan Ini Disetujui)

1. Buat folder `src/content/async-event-loop/` + copy plan ini ke
   `_docs/PLAN-ASYNC-EVENT-LOOP.md`
2. Tulis `manifest.js` (§3) dan `data.js` (§4) lebih dulu (data statis,
   tidak butuh iterasi visual)
3. Tulis `Animation.jsx` — Intro dulu (§5), lalu Act 1-5 berurutan,
   commit tiap Act selesai supaya gampang rollback kalau ada Act yang
   perlu revisi timing
4. Daftarkan ke `src/content/registry.js` (baca dari `manifest.js`)
5. Preview `/player/async-event-loop`, cek semua item checklist §10
6. Audit SFX Coverage penuh (§8, metodologi `08-audio-sfx-generation` §7)
7. Export single-process, cek mp4 & audio sinkron
8. (Opsional, belakangan) buat `caption.md`
