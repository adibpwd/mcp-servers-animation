# DNS Explained — Topic Plan

## Status

**Belum dieksekusi.** Dokumen ini plan-only sesuai permintaan — folder
`src/content/dns-explained/{Animation.jsx,data.js,manifest.js}` BELUM
dibuat. Review dulu sebelum lanjut ke Langkah 0 di
`docs/standardizations/03-tutorial-buat-topic-baru.md`.

## Overview

Animasi narrative-driven: kenapa "ganti DNS ke 8.8.8.8" kadang langsung
benerin internet yang lemot/gak connect. Ceritanya dibangun dari hook itu,
lalu dijawab pelan-pelan lewat perjalanan 1 domain name diterjemahkan jadi
IP address — resolver → root server → TLD server → authoritative server →
IP didapat → browser connect. Analogi utama: **DNS = buku telepon
internet** (nama → nomor).

Target audiens: anak IT / junior dev — sedikit lebih teknis dari audiens
"orang awam total" (boleh pakai istilah seperti "resolver", "TLD",
"authoritative server" secara eksplisit, asal tetap dijelaskan lewat
analogi & visual, bukan dianggap sudah paham). Playful tone tetap
dipertahankan sesuai prinsip storytelling `03-tutorial-buat-topic-baru.md`
— BUKAN dokumentasi RFC dibacakan.

**Canvas:** 820 × 1340 (portrait 9:16, standar reels mobile — konsisten
dengan topic narrative-heavy lain: `tailscale`, `linux-vs-unix`,
`virtual-memory`, `file-permission`). Dipilih di atas default
`820x640` di `03-tutorial-buat-topic-baru.md` Langkah 0 karena topic ini
punya story-arc 5 Act dengan banyak elemen vertikal (perjalanan
bertingkat resolver → root → TLD → authoritative) — pola yang sama
dengan alasan `tailscale` pakai ukuran ini.

**Difficulty:** ⭐⭐ (konsep bertingkat tapi linear, lebih sederhana dari
`tailscale` yang punya percabangan sukses/fallback ganda)
**Estimasi total durasi:** ~50 detik (5 Act) + intro morph ~1.2 detik

**Referensi gaya visual (bukan referensi cerita):** topic `tailscale`
dipakai sebagai acuan gaya — pola "device box + garis koneksi + kapsul
melintas + speech bubble hook" nyambung tipis secara tema (sama-sama soal
alamat/koneksi), tapi cerita DNS ini BERDIRI SENDIRI, tidak nyambung plot
dengan `tailscale`.

---

## Color Palette

Ikuti palet semantik project (`05-svg-text-guide.md` § Color Palette
Project), dipetakan ke role tiap entitas DNS:

```
BG:            #070913   background solid, dark navy
PANEL:         #0F172A   panel/card
BORDER:        #334155
TEXT:          #E2E8F0
MUTED:         #94A3B8

Browser/Client (device user):     #38BDF8  sky blue  — "Browser, Info"
DNS Resolver (ISP / 8.8.8.8):     #06B6D4  cyan      — "Network, System"
Root server:                      #A78BFA  purple    — "Technical term"
TLD server:                       #FB923C  orange    — "Process, Activity"
Authoritative server (jawaban final): #34D399 green   — "Success, RAM"
Error / gagal / lemot:            #F43F5E  red       — "Alert, Error"
Tegangan / loading lama:          #FBBF24  yellow    — "Warning"
```

Kenapa authoritative server dapat warna hijau (bukan warna baru): dia
adalah titik "jawaban final/sukses" di alur ini — konsisten dengan makna
semantik hijau di project (`05-svg-text-guide.md`), jadi penonton lintas
topic tetap asosiasi hijau = berhasil/final tanpa perlu belajar warna baru.

---

## Story Spine (4-Beat per Act, wajib per docs/03)

| Act | Setup | Tegangan/Masalah | Titik Balik | Payoff |
|---|---|---|---|---|
| 1 | Ketik domain di browser, loading seperti biasa | Loading lama, gagal connect — coba ganti DNS ke 8.8.8.8, tiba-tiba lancar | — (hook belum dijawab) | Cliffhanger: "DNS itu apa, kok bisa pengaruh separah ini?" |
| 2 | Browser cuma modal nama domain (`toko-online.com`) | Internet cuma kenal alamat IP (angka), bukan nama — gimana caranya connect? | Diperkenalkan analogi: DNS = buku telepon internet, nama diterjemahkan ke nomor | Peran resolver diperkenalkan: "operator" pertama yang ditanya |
| 3 | Browser kirim pertanyaan ke DNS Resolver dulu | Resolver belum tentu langsung tahu jawabannya (cache miss) | Resolver harus cari sendiri, mulai dari titik paling atas hierarki: root server | Perjalanan bertingkat dimulai, root → TLD → authoritative |
| 4 | Resolver tanya root, dioper ke TLD, dioper lagi ke authoritative | Tiap server cuma tahu SEBAGIAN jawaban, bukan langsung IP lengkap | Authoritative server akhirnya kasih jawaban PASTI: IP address domain | Resolver simpan jawaban (cache) & kirim balik ke browser |
| 5 | Browser sudah pegang IP address, langsung connect ke server asli | — (tegangan sudah reda) | Reveal eksplisit: kenapa ganti resolver ke 8.8.8.8 bisa benerin masalah Act 1 | Jawab hook: DNS = buku telepon internet, ganti "operator"-nya bisa lebih cepat/lebih jujur |

---

## Persistent Anchor Objects Lintas-Act

Ikuti pola `04-referensi-gsap.md` § "Persistent Anchor Object Lintas-Act"
— objek ini render SEKALI di luar blok `{phaseIdx === N && ...}`, `popIn()`
cuma di entrance pertama, Act berikutnya cuma tween posisi/warna/label:

1. **`browserAnchor`** — device/browser window milik user. Muncul Act 1
   (mengetik domain, loading), tetap ada sampai Act 5 (akhirnya connect).
   State berubah lewat warna (netral → merah saat gagal Act 1 → netral
   lagi Act 2-4 → hijau saat connect sukses Act 5), BUKAN pop-in ulang.
2. **`domainLabelAnchor`** — teks nama domain (`toko-online.com`).
   Diketik di Act 1, lalu "menempel" di dekat `browserAnchor` sampai Act 5
   sebagai referensi berulang (jangan diketik ulang tiap Act).
3. **`resolverAnchor`** — box DNS Resolver. Muncul pertama Act 2 (peran
   diperkenalkan), aktif utama di Act 3, tetap ada sebagai node di Act 4
   (terima jawaban balik), dan di Act 5 **label/warnanya diganti** (dari
   "Resolver ISP" ke "8.8.8.8 — Google Public DNS") lewat tween warna +
   teks, bukan unmount+popIn baru — supaya penonton paham ini "ganti
   operator", bukan objek baru yang muncul entah dari mana.

Objek root/TLD/authoritative server di Act 4 TIDAK perlu jadi anchor
persistent — mereka memang objek sekali-tampil (masing-masing muncul,
kasih jawaban parsial, lalu selesai perannya), sesuai render-conditional
biasa (`03-tutorial-buat-topic-baru.md` § 3.1).

---

## Act 1 — Hook: Ganti DNS, Tiba-Tiba Lancar (≈9s)

**Badge:** "ACT 1 — KENAPA GANTI DNS BISA BENERIN INTERNET?"

**Visual inti (beat setup → tegangan → titik balik → payoff/cliffhanger):**
- Setup: `browserAnchor` muncul (popIn), `domainLabelAnchor` diketik
  karakter-per-karakter ("toko-online.com") pakai efek typing (lihat
  `04-referensi-gsap.md` § "Typing Effect", seeded random wajib untuk
  delay antar-karakter).
- Tegangan: loading spinner berputar lama (>2 detik, biar terasa
  "lemot"), lalu warna `browserAnchor` pelan-pelan ke kuning →
  speech bubble kecil muncul: "Loading lama... gagal connect."
- Titik balik: badge/starburst kecil muncul di samping (insight-style,
  bukan rect polos): "Coba ganti DNS ke 8.8.8.8" — `resolverAnchor`
  BELUM diperkenalkan detail di sini, cukup angka "8.8.8.8" sebagai
  petunjuk visual.
- Payoff (cliffhanger, bukan jawaban penuh): `browserAnchor` berubah
  hijau instan, connect sukses. Speech bubble hook menutup Act:
  "Kok bisa langsung lancar? DNS itu apa sebenarnya?"

**Wording draft (≤7-8 kata/kalimat, impersonal, tanpa emoji):**
```
"Loading lama, situs tidak kunjung terbuka."
"Coba ganti DNS ke 8.8.8.8."
"Langsung lancar. DNS itu apa sebenarnya?"
```

**Timing (time cursor):**
```
t+0.0  browserAnchor popIn
t+0.3  mulai typing domain (seeded random delay per char)
t+1.8  loading spinner mulai (durasi 2.2s)
t+2.5  speech bubble "loading lama" muncul
t+4.0  browserAnchor tint kuning (tegangan)
t+5.0  badge "coba ganti ke 8.8.8.8" popIn
t+6.5  browserAnchor tint hijau instan (connect sukses)
t+6.8  speech bubble cliffhanger muncul, tahan sampai t+9.0
```

**SFX candidate (reuse existing asset, lihat § SFX Map di bawah):**
`typing` (ketik domain), `latency-tick`/tension (loading lama),
`error-beep` atau `warning` (gagal ringan, opsional — lihat catatan
akurasi di bawah), `success`/`confirm` (connect tiba-tiba lancar).

---

## Act 2 — Nama vs Nomor: Kenalan dengan Buku Telepon Internet (≈9s)

**Badge:** "ACT 2 — INTERNET CUMA KENAL ANGKA"

**Visual inti:**
- Setup: `domainLabelAnchor` ("toko-online.com") ditampilkan besar,
  tenang — tidak ada tegangan dulu.
- Tegangan: muncul pertanyaan retoris di card: "Internet cuma kenal
  alamat IP, bukan nama." Diikuti tanda tanya visual (bukan teks
  panjang) di atas `domainLabelAnchor` — bagaimana caranya browser tahu
  harus connect ke server yang mana?
- Titik balik: analogi utama muncul sebagai speech-bubble/badge besar
  (ini "aha moment" utama topic, kasih starburst bukan rect polos):
  "DNS = Buku Telepon Internet." Visual buku telepon terbuka dengan 2
  kolom: Nama (kiri) → Nomor (kanan), baris contoh:
  `toko-online.com  →  93.184.216.34` (IP dummy untuk ilustrasi).
- Payoff: `resolverAnchor` popIn pertama kali di sini — dikenalkan
  sebagai "operator" yang buka buku telepon itu duluan, sebelum browser
  tahu nomornya.

**Wording draft:**
```
"Internet cuma kenal alamat IP, bukan nama."
"DNS itu ibarat buku telepon internet."
"Nama domain diterjemahkan jadi nomor IP."
"DNS Resolver — operator buku telepon ini."
```

**Timing (time cursor, relatif awal Act):**
```
t+0.0  reset state, domainLabelAnchor tenang di tengah
t+0.5  card pertanyaan "internet cuma kenal angka" popIn
t+2.0  transisi ke visual buku telepon (materialize)
t+2.5  baris "nama -> nomor" muncul, IP contoh di-type-in singkat
t+5.0  starburst analogi "DNS = Buku Telepon Internet" popIn (aha moment)
t+7.0  resolverAnchor popIn pertama kali, label "DNS Resolver"
t+8.3  caption penutup Act menuju Act 3
```

**SFX candidate:** `materialize` (buku telepon muncul), `pop`/`pop-2`
(baris nama→nomor), `chime` atau starburst pakai `success/ding` (aha
moment analogi), `materialize` lagi atau `pop` (resolverAnchor masuk).

---

## Act 3 — Tanya Dulu ke Resolver, Ternyata Belum Tahu (≈10s)

**Badge:** "ACT 3 — RESOLVER BELUM TENTU LANGSUNG TAHU"

**Visual inti:**
- Setup: kapsul query meluncur dari `browserAnchor` ke `resolverAnchor`
  (pola "moving element A ke B", `04-referensi-gsap.md`), garis putus-putus
  dulu (belum data asli, masih tanya).
- Tegangan: `resolverAnchor` menampilkan ekspresi bingung (muka bulat
  simpel, mata + mulut datar) — badge kecil: "Belum pernah dicatat
  sebelumnya (cache miss)."
- Titik balik: reveal `resolverAnchor` TIDAK menyerah — dia justru
  punya daftar "alamat pusat" untuk mulai mencari: root server. Panah
  kecil dari `resolverAnchor` menunjuk ke atas layar, muncul ikon globe
  kecil merepresentasikan root.
- Payoff/cliffhanger: card penutup: "Pencarian dimulai dari titik paling
  atas internet." → nyambung ke Act 4.

**Wording draft:**
```
"Resolver ditanya duluan oleh browser."
"Belum pernah dicatat sebelumnya."
"Resolver tahu harus mulai cari dari mana."
"Pencarian dimulai dari titik paling atas internet."
```

**Catatan akurasi teknis (wajib, lihat § Konsep Teknis di bawah):**
Resolver di sini berperan sebagai **recursive resolver** — dia yang
melakukan pencarian bertingkat ATAS NAMA browser, browser sendiri
TIDAK pernah bicara langsung ke root/TLD/authoritative. Jangan gambarkan
browser ikut "lihat" proses pencarian di Act 4 — itu murni kerja resolver.

**Timing (relatif awal Act):**
```
t+0.0  reset, kapsul query browser->resolver meluncur (0.6s)
t+0.8  resolverAnchor ekspresi bingung + badge "cache miss"
t+2.5  tahan 1-1.5s tegangan (sesuai 03-tutorial 3.0, jangan buru2 reveal)
t+4.0  reveal: panah ke atas + ikon globe kecil (root) muncul
t+6.0  card "resolver tahu harus mulai cari dari mana" popIn
t+8.5  cliffhanger closing ke Act 4
```

**SFX candidate:** `whoosh`/`swoosh` (kapsul query meluncur), `scan`
(resolver mencari di cache), tension ringan `latency-tick` (tahan
1-1.5 detik), `materialize` (ikon globe/root muncul).

---

## Act 4 — Perjalanan Bertingkat: Root → TLD → Authoritative (≈13s)

Act terpadat, dieksekusi jadi 3 "hop" berurutan pakai pola simulasi/
feedback loop (`03-tutorial-buat-topic-baru.md` § 3.5) — tiap hop dibungkus
helper `runLookupHop(startTime, serverType, partialAnswer)` supaya tidak
copy-paste logic timing 3x.

**Badge:** "ACT 4 — TIAP SERVER CUMA TAHU SEBAGIAN"

**Visual inti per hop (pola sama, entitas beda):**
1. **Hop 1 — Root server** (ungu): kapsul dari `resolverAnchor` meluncur
   ke root. Root TIDAK tahu IP domain, tapi tahu "yang pegang `.com`
   adalah TLD server ini" → kapsul balik bawa alamat TLD (bukan IP
   final — badge kecil: "Belum jawaban lengkap").
2. **Hop 2 — TLD server** (oranye): kapsul lanjut ke TLD `.com`. TLD juga
   TIDAK tahu IP pasti, tapi tahu "authoritative server untuk
   `toko-online.com` adalah server ini" → kapsul bawa alamat
   authoritative.
3. **Hop 3 — Authoritative server** (hijau): kapsul sampai di
   authoritative. Beat tegangan 1-1.5 detik dulu (akankah ketemu?) sesuai
   `03-tutorial` § 3.0, baru reveal: authoritative kasih **IP address
   PASTI** — badge starburst hijau besar: "Ketemu! IP: 93.184.216.34."
- Payoff akhir Act: kapsul jawaban meluncur balik ke `resolverAnchor`,
  `resolverAnchor` "menyimpan" jawaban itu (visual: ikon kecil tersimpan
  di box resolver — representasi cache, tanpa perlu menjelaskan TTL
  secara teknis penuh di visual, cukup di caption).

**Wording draft (per hop, ≤7-8 kata):**
```
"Root tahu siapa pemegang domain .com."
"Belum jawaban lengkap, lanjut ke TLD."
"TLD tahu server resmi domain ini."
"Authoritative server — jawaban paling pasti."
"Ketemu! Alamat IP domain ditemukan."
"Resolver simpan jawaban ini untuk nanti."
```

**Timing (time cursor, relatif awal Act — 3 hop @ ~3.5s + payoff ~2.5s):**
```
t+0.0   reset semua state hop
t+0.0   Hop 1: kapsul resolver->root (whoosh, 0.6s)
t+0.8   root respon "tahu TLD-nya", badge "belum lengkap"
t+2.0   Hop 2: kapsul root->TLD (whoosh, 0.6s) — anggap "diteruskan"
t+2.8   TLD respon "tahu authoritative-nya", badge "belum lengkap"
t+4.0   Hop 3: kapsul TLD->authoritative (whoosh, 0.6s)
t+5.0   tahan tegangan 1.3s (akankah ketemu?)
t+6.3   REVEAL starburst hijau "Ketemu! IP: 93.184.216.34" (SFX success)
t+7.5   kapsul jawaban meluncur balik ke resolverAnchor (whoosh, 0.8s)
t+8.5   resolverAnchor "simpan" jawaban (ikon cache kecil, materialize)
t+9.5   caption penutup: "Resolver kirim balik alamatnya ke browser."
```
*(total ≈9.5s inti + buffer ±1.5s = 11-13s target Act)*

**SFX candidate:** `whoosh`/`swoosh` (tiap hop, 3x — variasikan
`transitions/whoosh.wav` vs `transitions/swoosh.wav` vs
`transitions/teleport.wav` supaya tidak monoton persis sama 3x berturut),
`latency-tick` (tahan tegangan), `success`/`victory` (reveal IP ketemu),
`connector-snap` atau `materialize` (resolver simpan cache).

**Catatan akurasi teknis (wajib):** ini model **iterative query** dari
sisi resolver (resolver yang loncat root→TLD→authoritative), BUKAN
recursive query berantai antar server (root TIDAK meneruskan pertanyaan
ke TLD atas nama resolver — root cuma jawab "tanya TLD ini", lalu
RESOLVER sendiri yang lanjut nanya ke TLD). Pastikan visual kapsul
balik ke `resolverAnchor` dulu di antara tiap hop secara logis (boleh
disederhanakan visual jadi garis lurus tanpa balik penuh ke resolver
tiap kali demi pacing, TAPI caption/narasi harus tetap bilang "resolver
yang lanjut nanya", bukan implikasi root/TLD saling lempar sendiri).

---

## Act 5 — Payoff: Ganti Resolver, Kenapa Bisa Benerin (≈9s)

**Badge:** "ACT 5 — SEKARANG JAWAB HOOK ACT 1"

**Visual inti:**
- Setup: kapsul jawaban dari Act 4 sampai ke `browserAnchor`, browser
  langsung connect ke IP address asli (garis solid hijau nyala,
  `browserAnchor` jadi hijau permanen).
- Reveal eksplisit menjawab hook Act 1: split visual 2 kondisi
  berdampingan (bukan cuma teks) —
  - Kiri (merah, redup): "Resolver ISP — lambat/error/diblokir."
  - Kanan (hijau, terang): "8.8.8.8 — Google Public DNS, cepat &
    stabil." `resolverAnchor` di sini di-tween label & warnanya dari
    "Resolver ISP" ke "8.8.8.8", BUKAN pop-in objek baru (lihat §
    Persistent Anchor Objects).
- Payoff: card penutup analogi ditutup ulang: "DNS = buku telepon
  internet. Ganti operatornya, pencarian bisa lebih cepat." Karakter
  reaksi senang (muka bulat, mata melengkung, mulut senyum) sebagai
  penutup playful.

**Wording draft:**
```
"Browser dapat IP, langsung connect ke server asli."
"Resolver ISP kadang lambat, error, atau diblokir."
"8.8.8.8 — Google Public DNS, cepat dan stabil."
"Ganti operator buku telepon, pencarian jadi cepat."
```

**Timing (relatif awal Act):**
```
t+0.0   kapsul jawaban -> browserAnchor (whoosh, 0.6s)
t+0.8   browserAnchor hijau permanen, garis solid ke IP
t+1.8   split visual kiri/kanan (resolver ISP vs 8.8.8.8) popIn
t+3.5   resolverAnchor label & warna berubah (tween, bukan popIn ulang)
t+5.0   card penutup analogi "DNS = buku telepon internet" popIn
t+6.5   karakter reaksi senang popIn
t+7.5   caption closing bertahan sampai akhir Act (t+9.0)
```

**SFX candidate:** `connector-snap` atau `success/confirm` (connect ke
IP asli), `materialize`/`pop` (split visual muncul), `chime` (label
resolver berubah ke 8.8.8.8), `success/victory` (closing payoff).

---

## Konsep Teknis yang WAJIB Tetap Akurat (jangan disederhanakan sampai salah)

1. **Recursive resolver vs iterative query**: browser cuma nanya SEKALI
   ke resolver (biasanya bawaan ISP atau custom seperti 8.8.8.8/1.1.1.1).
   Resolver itu sendiri yang melakukan iterative query bertingkat ke
   root → TLD → authoritative ATAS NAMA browser. Browser TIDAK pernah
   bicara langsung ke root/TLD/authoritative (lihat catatan Act 3 & 4).
2. **Root server tidak tahu IP domain** — dia cuma tahu nameserver mana
   yang bertanggung jawab atas TLD tertentu (`.com`, `.id`, dst).
   **TLD server** juga tidak tahu IP final — dia tahu authoritative
   nameserver untuk domain spesifik itu. Cuma **authoritative server**
   yang punya record IP final (A/AAAA record).
3. **Caching & TTL**: resolver menyimpan (cache) jawaban itu untuk
   sementara waktu (Time To Live, ditentukan si domain owner) — kunjungan
   berikutnya ke domain yang sama TIDAK perlu ulang perjalanan Act 4
   penuh selama cache masih valid. Boleh disebut singkat di Act 4 payoff
   ("resolver simpan jawaban ini untuk nanti"), tidak perlu detail TTL
   di visual utama.
4. **Kenapa ganti resolver (mis. ke 8.8.8.8) bisa "benerin" internet —
   nuansa penting, JANGAN overclaim:**
   - Ganti DNS resolver **TIDAK mempercepat bandwidth/kecepatan download
     internet secara umum** — yang dipercepat/diperbaiki adalah proses
     **resolusi nama domain** (langkah "cari alamat", bukan "kirim
     data"-nya).
   - Resolver ISP kadang jadi bottleneck karena: server resolver
     kelebihan beban (lambat), resolver down/error sementara, atau
     ISP sengaja memblokir/redirect domain tertentu (sensor/parental
     filter) — bikin domain "kelihatan" tidak bisa diakses padahal
     server aslinya baik-baik saja.
   - Resolver publik seperti 8.8.8.8 (Google Public DNS) atau 1.1.1.1
     (Cloudflare) umumnya punya infrastruktur anycast global yang lebih
     stabil/cepat & jarang blokir domain sembarangan — makanya sering
     "kelihatan" seperti benerin internet, padahal yang membaik adalah
     langkah pencarian alamatnya.
   - Di visual/caption, pakai frasa "pencarian alamat jadi lebih
     cepat/berhasil" — HINDARI frasa yang menyiratkan "internet jadi
     lebih kencang" secara umum, itu klaim berlebihan & tidak akurat.
5. **IP address contoh** (`93.184.216.34`) dipakai murni sebagai
   ilustrasi format IP address — boleh diganti IP dummy lain yang jelas
   fiktif kalau perlu, yang penting bentuknya IPv4 valid & konsisten
   dipakai dari Act 2 sampai Act 5 (jangan ganti-ganti angka).

---

## Manifest Draft (`manifest.js`)

```js
export default {
  schemaVersion: 1,
  id: 'dns-explained',
  title: 'Cara Kerja DNS',
  subtitle: 'Domain jadi IP address — buku telepon internet',
  category: 'Networking',
  tags: ['DNS', 'Resolver', 'Root Server', 'TLD', 'Networking'],
  color: '#06B6D4',
  audioStrategy: 'realtime',
}
```

`color` dipilih cyan (`#06B6D4`) — konsisten dengan makna semantik
"Network, System" di `05-svg-text-guide.md`, dan belum dipakai topic lain
sebagai warna utama manifest (`tailscale` pakai indigo `#6366F1`,
`virtual-memory` pakai pink `#EC4899`).

## data.js Skeleton (rencana, belum final)

```js
export const VW = 820
export const VH = 1340

export const COLORS = { /* lihat § Color Palette di atas */ }

export const PHASES = [
  { id: 'hook-switch-dns',   badge: 'ACT 1 — KENAPA GANTI DNS BISA BENERIN INTERNET?', duration: 9.0 },
  { id: 'phonebook-analogy', badge: 'ACT 2 — INTERNET CUMA KENAL ANGKA',               duration: 9.0 },
  { id: 'ask-resolver',      badge: 'ACT 3 — RESOLVER BELUM TENTU LANGSUNG TAHU',      duration: 10.0 },
  { id: 'root-tld-auth',     badge: 'ACT 4 — TIAP SERVER CUMA TAHU SEBAGIAN',          duration: 13.0 },
  { id: 'payoff-8888',       badge: 'ACT 5 — SEKARANG JAWAB HOOK ACT 1',               duration: 9.0 },
]

// diisi detail saat implementasi:
// DOMAIN_NAME, EXAMPLE_IP, RESOLVER_STATES (isp vs 8.8.8.8),
// LOOKUP_HOPS (root/tld/authoritative — dipakai helper runLookupHop),
// SFX_MAP (lihat § SFX Map di bawah)
export const SFX_MAP = { /* lihat draft lengkap di bawah */ }
```

---

## SFX Map Draft — Scan Asset Existing Dulu (docs/08 § 2)

Sudah discan `public/audio/*/` — SEMUA kebutuhan SFX topic ini bisa
dipenuhi dari asset yang SUDAH ADA, tidak perlu sourcing/download baru:

```js
export const SFX_MAP = {
  TYPING:        { category: 'sfx',         name: 'typing' },
  LATENCY:       { category: 'warnings',    name: 'latency-tick' },
  CONNECT_OK:    { category: 'success',     name: 'confirm' },
  MATERIALIZE:   { category: 'sfx',         name: 'materialize' },
  POP:           { category: 'ui',          name: 'pop' },
  POP_ALT:       { category: 'ui',          name: 'pop-2' },
  CHIME:         { category: 'ui',          name: 'chime' },
  SCAN:          { category: 'sfx',         name: 'scan' },
  WHOOSH:        { category: 'transitions', name: 'whoosh' },
  WHOOSH_ALT:    { category: 'transitions', name: 'swoosh' },
  TELEPORT_HOP:  { category: 'transitions', name: 'teleport' },
  IP_FOUND:      { category: 'success',     name: 'victory' },
  CACHE_SAVE:    { category: 'impacts',     name: 'connector-snap' },
}
```

Verifikasi wajib saat implementasi (checklist §3 di `08-audio-sfx-
generation.md`): tiap entry di atas HARUS benar-benar dipanggil di
`Animation.jsx` — kalau ada yang akhirnya tidak jadi dipakai (mis. hop
2 & 3 di Act 4 cukup reuse `WHOOSH`/`WHOOSH_ALT` tanpa `TELEPORT_HOP`),
hapus entry-nya, jangan dibiarkan jadi dead config.

**Kenapa tidak perlu sourcing SFX baru:** kebutuhan topic ini generik
(ketik, whoosh perpindahan, tension ringan, sukses, materialize) — semua
sudah tercover pola SFX yang sama dipakai topic-topic lama (virtual-
memory, container-docker, tailscale). Ini konsisten dengan prinsip
"scan dulu sebelum download baru" di `08-audio-sfx-generation.md` §2.

---

## Icon Plan (Tentatif — Finalisasi Saat Implementasi)

Mayoritas visual topic ini adalah **diagram shape generik** (box server,
kapsul query, speech bubble, starburst) yang bisa digambar langsung
lewat `<rect>`/`<path>`/komponen `DiagramBox`-style tanpa perlu PNG icon
sama sekali — pola yang sama dipakai `virtual-memory` & `mcp-servers`
(topic lama, tidak semua topic punya icon set penuh, lihat
`02-standar-konten.md`).

Kandidat icon PNG **opsional** (kalau mau lebih polish dari shape polos),
diusulkan sebagai 1 batch kecil (≤7 icon, format grid 2×4 per
`06-icon-generation.md` §1-3) — TAPI keputusan final & varian warna HARUS
menunggu `Animation.jsx`/komponen shape ditulis dulu, sesuai peringatan
`06-icon-generation.md` §7 ("grep dulu component sebelum planning varian
icon" — jangan asumsikan pola sama dengan topic lain sebelum kode ada):

```
1. browser-window       — device/browser milik user (browserAnchor)
2. phonebook-open        — analogi "buku telepon internet" (Act 2)
3. globe-network          — representasi root server / internet global
4. server-rack-generic    — dipakai ulang untuk TLD & authoritative
                             (beda lewat warna tint, bukan icon beda)
5. magnifying-glass       — resolver "mencari" (Act 3 cache miss)
6. face-happy             — reaksi senang closing Act 5
                             (cek dulu apakah bisa reuse
                             `tailscale/icons/face-happy.png` yang
                             sudah ada — lihat §6.4 icon pengganti vs
                             baru, PNG shared antar-topic secara file
                             asalnya boleh di-copy, bukan di-import
                             lintas folder topic)
[EMPTY]                   — slot kosong wajib (grid 2x4, lihat §1.2)
```

**Keputusan icon brand:** tidak ada logo brand pihak ketiga yang perlu
ditampilkan di topic ini (Google Public DNS cukup direpresentasikan
sebagai teks/badge "8.8.8.8", TIDAK perlu logo Google — hindari isu
trademark sesuai `06-icon-generation.md` §8 tabel keputusan, kategori
"brand komersial aktif" → default aman tanpa konfirmasi eksplisit).

---

## Registrasi ke `registry.js`

Ikuti pola topic yang sudah migrasi (`tailscale`, `container-docker`,
`linux-vs-unix`) — import + spread dari `manifest.js`, BUKAN hardcode
literal baru:

```js
import dnsExplainedManifest from './dns-explained/manifest.js'
// ...
{
  ...dnsExplainedManifest,
  status:    'coming-soon', // ganti 'ready' setelah preview & export dicoba manual
  component: () => import('./dns-explained/Animation'),
},
```

Taruh entry ini di section "COMING SOON" yang sesuai tier (networking/
infrastruktur — dekat section `tailscale` secara kategori) sampai
checklist di bawah selesai, baru pindah status ke `ready`.

---

## Checklist Sebelum Implementasi Kode (lihat juga `03-tutorial` § Checklist)

**Plan & scope:**
- [ ] Plan ini direview/disetujui user
- [ ] Folder `src/content/dns-explained/{Animation.jsx,data.js,manifest.js}`
      dibuat sesuai kontrak `02-standar-konten.md` §3
- [ ] `registry.js` daftar via spread manifest (bukan hardcode literal)

**Storytelling:**
- [ ] Tiap Act ikuti 4-beat table (§ Story Spine) saat coding
- [ ] Minimal 1 elemen visual non-rect per Act (speech bubble/karakter/
      badge/starburst) — sudah direncanakan di tiap Act di atas
- [ ] Ending Act 5 menjawab hook Act 1 secara eksplisit (sudah dirancang
      lewat split visual resolver ISP vs 8.8.8.8)
- [ ] Wording draft di atas dicek ulang saat implementasi: ≤7-8 kata/
      kalimat, tanpa emoji, tanpa kata ganti orang (grep sebelum commit,
      lihat `03-tutorial-buat-topic-baru.md`)

**Teknis (GSAP/export):**
- [ ] `window.__animationTimeline` + `window.__flushSync = flushSync`
      di-assign di `useEffect` mount (WAJIB, lihat `04-referensi-gsap.md`
      § "Export Safety")
- [ ] Cleanup `return () => tl.kill()`
- [ ] Semua Act reset state di awal (loop-safe)
- [ ] `browserAnchor`/`domainLabelAnchor`/`resolverAnchor` diimplementasi
      sebagai persistent anchor (lihat § Persistent Anchor Objects di
      atas), BUKAN di dalam blok `{phaseIdx === N && ...}`
- [ ] Helper `runLookupHop()` untuk Act 4 dibungkus 1 fungsi reusable
      (pola § 3.5 `03-tutorial-buat-topic-baru.md`), dipanggil 3x
      (root/TLD/authoritative) dengan parameter beda, bukan copy-paste
      3 blok kode timing terpisah
- [ ] Typing effect Act 1 pakai seeded random (bukan `Math.random()`)
      untuk delay antar-karakter (lihat § "Determinism" di
      `04-referensi-gsap.md`)

**SFX & Audio:**
- [ ] `SFX_MAP` final di `data.js` cocok dengan draft di atas, cross-
      check semua entry benar-benar dipanggil di `Animation.jsx`
- [ ] `SFX_SCHEDULES` di `scripts/export-lib.js` sinkron persis dengan
      angka detik hasil implementasi timeline (bukan draft timing di
      dokumen ini — draft timing di atas indikatif, angka final
      ditentukan saat coding)
- [ ] Audit SFX Coverage penuh sebelum anggap selesai (`08-audio-sfx-
      generation.md` §7)

**Verifikasi akhir:**
- [ ] Konsep teknis di § "Konsep Teknis WAJIB Akurat" di atas tidak
      dilanggar, terutama poin nuansa "ganti DNS mempercepat resolusi
      nama, bukan bandwidth" — jangan overclaim di wording manapun
- [ ] Preview `/player/dns-explained` jalan normal, export MP4 dicoba
      manual sebelum status diganti `ready`
- [ ] Topic lain tetap bisa di-preview & export tanpa error setelah
      perubahan `registry.js`

---

## Open Questions untuk User (Konfirmasi Sebelum Eksekusi)

1. **Status awal registry**: langsung `coming-soon` lalu di-upgrade
   manual ke `ready` setelah selesai, atau ada preferensi lain?
2. **IP contoh** `93.184.216.34` — OK dipakai sebagai IP ilustratif, atau
   ada preferensi IP dummy lain / domain contoh selain
   `toko-online.com`?
3. **Icon PNG**: eksekusi pakai shape SVG polos dulu (lebih cepat, cocok
   untuk topic linear seperti ini), atau langsung investasi bikin batch
   icon PNG (§ Icon Plan) sejak awal?
4. **Durasi total ~50 detik** dianggap pas, atau ada target durasi
   spesifik (mis. menyesuaikan format Reels/TikTok tertentu)?

Setelah dikonfirmasi, lanjut eksekusi mengikuti urutan Langkah 0-6 di
`docs/standardizations/03-tutorial-buat-topic-baru.md`.
