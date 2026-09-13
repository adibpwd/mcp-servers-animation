# HTTP Request-Response Flow — Topic Plan

## Overview

Topic baru: `http-request-response`. Menjelaskan mental model dasar
client-server lewat analogi **surat + amplop balasan**. Target audiens:
anak IT/junior dev yang paham istilah (request, response, status code)
tapi cuma hafalan — belum kebayang alurnya secara konkret.

Topic ini fondasi untuk topic lanjutan (REST API, WebSocket) — jadi
closing HARUS eksplisit nge-tease itu, bukan cuma nutup cerita.

**Topic ID:** `http-request-response`
**Canvas:** 820 × 1340 (portrait, Reels-first — sama pola dengan
`linux-vs-unix`). Flow client→server yang tadinya kebayang
kiri→kanan di-block jadi **atas→bawah**: client di zona atas, DNS/
koneksi di zona tengah, server di zona bawah, lalu response naik
lagi ke atas.
**Kategori:** Networking / Web Fundamentals
**Estimasi:** 1-2 hari kerja (kompleksitas sedang — banyak state
transition: request keluar → proses → response balik)

---

## Manifest Draft (`manifest.js`, Langkah 0 & 02 §5)

```js
export default {
  schemaVersion: 1,
  id: 'http-request-response',
  title: 'HTTP Request-Response',
  subtitle: 'Ngirim surat, nunggu balasan',
  category: 'Networking',
  tags: ['HTTP', 'Client-Server', 'DNS', 'Status Code', 'Web'],
  color: '#38BDF8',
  audioStrategy: 'realtime',
}
```

## Color Palette (ikut 05-svg-text-guide §"Color Palette Project")

| Elemen | Warna | Alasan |
|---|---|---|
| Client/Browser | `#38BDF8` (Blue) | Semantik "Browser, Info" |
| Network/DNS/koneksi | `#06B6D4` (Cyan) | Semantik "Network, System" |
| Server/proses | `#FB923C` (Orange) | Semantik "Process, Activity" |
| Status sukses (2xx) | `#34D399` (Green) | Semantik "Success" |
| Status gagal (4xx/5xx) | `#F43F5E` (Red) | Semantik "Error" |
| Istilah teknis (method, header, dsb) | `#A78BFA` (Purple) | Semantik "Technical term" |

Konsisten dipakai sepanjang Act supaya penonton asosiasi warna↔peran
tanpa baca ulang label.

---

## Analogi Utama: Surat + Amplop Balasan

| Konsep HTTP | Analogi Surat |
|---|---|
| Request | Surat yang ditulis & dikirim |
| URL/domain | Alamat tujuan di amplop |
| DNS | Buku alamat, translate nama jalan jadi nomor rumah asli (IP) |
| Method (GET/POST) | Jenis surat (nanya vs ngasih titipan) |
| Headers | Catatan tambahan di amplop |
| Koneksi (TCP) | Toc-toc di pintu, minta izin dulu sebelum masuk |
| Server proses | Petugas buka surat, baca, siapin balasan |
| Status code | Stempel di amplop balasan (lolos/ditolak) |
| Response headers+body | Isi surat balasan + catatan tambahan |
| Browser render | Penerima buka amplop balasan, susun isinya |

---

## PHASES Draft (`data.js` — durasi estimasi, disesuaikan pas eksekusi)

```js
export const VW = 820
export const VH = 1340
export const PHASES = [
  { label: 'Act 1: Kok Nyuruh Nunggu?',     duration: 7 },
  { label: 'Act 2: Nulis Surat',            duration: 9 },
  { label: 'Act 3: Nyari Alamat & Ketuk Pintu', duration: 10 },
  { label: 'Act 4: Surat Dibuka',           duration: 9 },
  { label: 'Act 5: Balasan & Stempel',      duration: 10 },
  { label: 'Act 6: Amplop Dibuka Lagi',     duration: 8 },
]
```
Intro morph (~1.2s) + total Act ±53s ≈ 54 detik per loop.

---

## Breakdown per-Act

Semua Act ikut beat 4-langkah (03-tutorial §"Setiap Act = Babak Cerita"):
setup → tegangan/masalah → titik balik → payoff. Kalimat contoh di bawah
draft kasar, BUKAN final (masih perlu dicek ±7-8 kata & no-pronoun saat
eksekusi).

### Act 1 — Kok Nyuruh Nunggu? (Hook, bukan jawaban)

**Tujuan:** Bikin penonton sadar asumsi mereka salah — mereka pikir buka
website itu instan "ambil" halaman, padahal ada proses kirim-terima.

- **Setup:** Tampilan browser, user ketik URL, klik enter. Cursor loading
  berputar sebentar.
- **Tegangan:** Speech bubble muncul: "Emangnya browser itu ambil
  halaman langsung?" — beri jeda 1-2 detik, biar penonton mikir.
- **Titik balik:** Reveal visual — bukan "ambil", tapi ada AMPLOP
  bergambar terbang dari browser ke arah bawah layar (ke server, masih
  samar/blur, belum full reveal — portrait, jadi arahnya turun bukan
  ke samping).
- **Payoff (cliffhanger, bukan jawaban penuh):** Card muncul: "Browser
  kirim surat, bukan comot langsung." Cliffhanger ke Act 2: "Surat itu
  isinya apa?"

**Visual:** Speech bubble (bukan rect polos) untuk pertanyaan retoris,
karakter muka sederhana di browser (ekspresi bingung/kaget) sesuai 03
§3.6.

### Act 2 — Nulis Surat (Client Bikin Request)

**Tujuan:** Bongkar isi "surat" — method, URL/alamat, headers — pakai
visual amplop yang lagi ditulis.

- **Setup:** Amplop kosong muncul di sisi client, mulai diisi.
- **Tegangan:** 3 komponen muncul satu-satu dengan sedikit jeda (method
  badge "GET", alamat tujuan, catatan header) — badge method dulu warna
  purple (technical term), lalu alamat.
- **Titik balik:** Highlight bahwa alamat di amplop itu NAMA (domain),
  bukan alamat asli — muncul pertanyaan kecil "tapi kurir tau rumahnya
  di mana?"
- **Payoff/cliffhanger:** Amplop tersegel, siap kirim. Caption: "Surat
  siap. Tinggal cari alamat aslinya."

**Visual:** Amplop sebagai anchor object (dipakai lagi di Act 3, 5, 6 —
render persistent per 03 §3.1 kalau representasi ELEMEN SAMA, bukan
pop-in ulang). Badge method pakai bentuk badge/starburst kecil, bukan
rect polos.

### Act 3 — Nyari Alamat & Ketuk Pintu (DNS + Koneksi)

**Tujuan:** Jawab cliffhanger Act 2 — DNS translate nama ke IP, lalu
"toc-toc" (koneksi) sebelum surat beneran masuk.

- **Setup:** Amplop terbang ke arah "buku alamat besar" (DNS, ikon buku/
  direktori, warna cyan).
- **Tegangan:** Buku alamat dibuka, nyari-nyari nama domain — sedikit
  delay/animasi mencari (tension, bukan instan).
- **Titik balik:** Ketemu — nomor rumah asli (IP) muncul menyala, badge
  numerik nongol di atas amplop.
- **Payoff:** Amplop lanjut terbang ke gedung server, "ketuk pintu"
  dulu (efek toc-toc kecil, pintu server terbuka) sebelum masuk penuh.
  Cliffhanger: "Sekarang, apa yang server lakuin sama surat ini?"

**Visual:** Buku/direktori bentuk khas (bukan rect), pintu gedung server
yang membuka sebagai transisi ke Act 4.

### Act 4 — Surat Dibuka (Server Proses Request)

**Tujuan:** Server bukan cuma "nerima", tapi baca & putuskan sesuatu.

- **Setup:** Amplop sampai ke petugas (karakter simpel di gedung
  server), dibuka.
- **Tegangan:** Petugas baca isi surat (method + alamat path) — muncul
  animasi "mikir"/processing (loading dots di atas kepala karakter).
- **Titik balik:** Petugas nemuin datanya (atau tidak) — sedikit reaksi
  visual (senang kalau ketemu, bingung kalau tidak).
- **Payoff:** Petugas mulai nulis balasan di amplop baru. Cliffhanger:
  "Balasannya bakal kayak apa?"

**Visual:** Karakter muka sederhana (03 §3.6) buat petugas server —
reaksi mikir/senang/bingung, biar berasa hidup, bukan cuma kotak proses.

### Act 5 — Balasan & Stempel (Response: Status, Headers, Body)

**Tujuan:** Ini titik paling penting — status code sebagai STEMPEL yang
nentuin nasib, bukan cuma angka hafalan.

- **Setup:** Amplop balasan baru mulai diisi — body/isi surat dulu.
- **Tegangan:** Sebelum amplop ditutup, ada momen "akan disetujui atau
  ditolak?" — pakai pola simulasi 03 §3.5 (whoosh → impact → hasil).
- **Titik balik:** STEMPEL besar jatuh ke amplop — 3 varian dikenalkan:
  **200** (hijau, "OK" — surat diterima baik), **404** (merah, "Not
  Found" — alamat/data yang diminta tidak ketemu), **500** (merah tua/
  oranye-gelap, "Server Error" — bukan salah surat, tapi petugas
  server-nya yang bermasalah). Pakai 1 sebagai contoh utama yang
  di-animate penuh (disarankan 200, biar payoff Act 6 positif), 2
  lainnya (404 & 500) muncul sebagai varian singkat di sampingnya
  (mis. row kecil 3 stempel, yang utama di-highlight/scale up) supaya
  penonton tau bedanya tanpa bikin Act ini kepanjangan.
- **Payoff:** Amplop balasan tersegel lengkap (status + headers + body),
  terbang balik ke client. Cliffhanger: "Amplop nyampe... terus?"

**Visual:** Stempel = badge/starburst besar dengan warna semantik
(hijau sukses / merah error untuk 404 & 500, beda shade biar dua-duanya
kebedain), bukan rect polos — ini "aha moment" paling penting di topic
ini, kasih visual paling menonjol di sini.

### Act 6 — Amplop Dibuka Lagi (Browser Render, Payoff Penuh)

**Tujuan:** Jawab hook Act 1 secara eksplisit + kasih clue ke topic
lanjutan (REST API, WebSocket).

- **Setup:** Client terima amplop balasan, buka.
- **Tegangan:** Sekilas "amplop" masih berupa data mentah (badge status
  + headers + body) — belum jadi halaman web.
- **Titik balik:** Browser susun isi jadi halaman web utuh (data →
  render), bar loading tadi di Act 1 berhenti berputar.
- **Payoff (jawab hook):** Caption eksplisit: "Jadi bukan 'ambil',
  tapi kirim surat dan terima balasan." Lalu teaser: "Surat model lain?
  Nanti di REST API dan WebSocket."

**Visual:** Amplop (anchor object) akhirnya "terbuka penuh" jadi bentuk
halaman web sederhana — transformasi visual paling memuaskan di topic
ini karena nutup loop cerita dari Act 1.

---

## Persistent Anchor Objects (03 §3.1 pengecualian)

Objek yang representasi hal SAMA lintas-Act — render di luar blok
conditional per-Act, jangan pop-in ulang tiap ganti Act:

- **Amplop request** — muncul Act 2, terbang lintas Act 3–4, "dibuka"
  di Act 4. Posisi/state berubah tapi tetap 1 objek.
- **Amplop response** — muncul Act 5 (amplop baru, bukan amplop
  request yang sama — beda objek, boleh pop-in normal), lalu jadi
  anchor sampai Act 6.
- **Browser frame (client)** — tetap terlihat dari Act 1 sampai Act 6
  sebagai "rumah" tempat amplop keluar-masuk, jangan unmount tiap Act.
- **Gedung/karakter server** — muncul dari Act 3 (pintu) sampai Act 5,
  representasi entitas yang sama.

---

## SFX Sketch (kategori saja — schedule detail nanti pas coding, 08 §3)

| Momen | Kategori | Contoh nama (cek dulu asset existing per 08 §2) |
|---|---|---|
| Klik URL / mulai loading | `ui` | klik/pop |
| Amplop terbang (tiap perpindahan) | `transitions` | whoosh |
| Buku alamat ketemu (DNS resolve) | `success` atau `ui` | chime/confirm |
| Ketuk pintu server | `impacts` | knock/tap (cek existing dulu) |
| Petugas mikir/processing | `ui` | tick/loading (opsional, bisa silent) |
| Stempel jatuh (status code) | `impacts` + `success`/`warnings` | stamp/impact lalu confirm (2xx) atau error (4xx/5xx) |
| Browser selesai render | `success` | confirm/relief |

Ingat 08 §2: scan `public/audio/*/` dulu sebelum sourcing baru — banyak
kemungkinan whoosh/pop/stamp sudah ada dari topic lain.

---

## Icon Needs (indikatif — final ditentukan pas eksekusi tiap Act)

Kandidat kasar kalau memang perlu custom icon (bukan daftar wajib):
envelope closed/open, address book/DNS, server rack/building, stamp
checkmark (sukses), stamp cross (error, dipakai buat 404 & 500), browser
window. Cek dulu icon generic serupa di topic lain (`icons/loader.js`
tiap topic) sebelum generate baru — kalau simple shape SVG inline
(lingkaran/rect/path) sudah cukup buat suatu elemen, gak perlu maksa
generate PNG icon juga.

---

## Keputusan yang Sudah Difinalkan

1. **Status code:** 3 varian — 200 (utama, di-animate penuh), 404 &
   500 (varian singkat di sampingnya). Lihat Act 5.
2. **Orientasi:** Portrait 820×1340, Reels-first (sama pola
   `linux-vs-unix`). Lihat Overview & PHASES.
3. **Icon/SFX:** tidak dipatok di plan — generate/sourcing menyesuaikan
   kebutuhan riil pas eksekusi tiap Act (scan asset existing dulu per
   06 §2 & 08 §2, baru generate/download kalau memang belum ada yang
   cocok).

---

## Checklist Eksekusi (progress tracker)

Dicentang seiring jalan, bukan ditulis ulang jadi rapi di akhir — biar
kelihatan progress asli, bukan retrospektif.

- [x] Setup folder `src/content/http-request-response/` (`Animation.jsx`,
      `data.js`, `manifest.js`) sesuai 02 §3.
- [x] `manifest.js` — schemaVersion 1, id/title/subtitle/category/tags/
      color/audioStrategy lengkap.
- [x] `data.js` — `VW/VH` 820×1340, `COLORS`, 6 `PHASES` + `TOTAL_DURATION`,
      konstanta Intro, konstanta Act 1, stub konstanta Act 2–6, `SFX_MAP`
      (nama sudah dicek match ke `public/audio/*`, gak ada yang belum ada).
- [x] Daftarkan ke `src/content/registry.js` (baca dari `manifest.js`,
      status `'coming-soon'` — jujur reflect baru Act 1 yang jadi).
- [x] Bangun Intro (typing → morph thumbnail→header).
- [x] Bangun Act 1 (Kok Nyuruh Nunggu?) — 4 beat lengkap: setup (browser +
      loading spinner) → tegangan (speech bubble) → titik balik (amplop
      terbang turun, samar) → payoff (reveal card + cliffhanger).
- [x] Preview manual `npm run dev` → `/player/http-request-response` dicoba,
      belum ada konfirmasi visual dari eksekusi ini.
      **UPDATE:** timeline GSAP (tween/state) buat Act 2-6 ternyata sudah
      ada dari pass sebelumnya, tapi render JSX-nya belum — anchor object
      (amplop request/response, gedung server, petugas) dan elemen
      per-Act render bareng ini. `npx vite build` PASS (exit 0, no error),
      tapi ini baru cek compile — belum ada konfirmasi visual manual
      (`npm run dev` + buka `/player/http-request-response`).
- [x] Act 2 — Nulis Surat (Client Bikin Request). Render: methodBadge,
      addressLabel, headerNoteLabel, domainQuestionBubble, sealedDot
      (custom checkmark, bukan generic popIn), envelopeSealedCard +
      amplop request (anchor `reqEnvelope`, warna CLIENT) mulai muncul.
- [x] Act 3 — Nyari Alamat & Ketuk Pintu (DNS + Koneksi). Render:
      addressBook, ipBadge (warna ikut `dnsFound`) + gedung server
      (anchor `serverBuilding`, pintu ikut `doorOpen`) mulai muncul.
- [x] Act 4 — Surat Dibuka (Server Proses Request). Render: thinkingDots,
      foundCheck (custom checkmark), replyCliffhangerBadge + petugas
      (anchor `officer`, ekspresi ikut `officerThinking`/`officerHappy`)
      mulai muncul.
- [x] Act 5 — Balasan & Stempel (Response: Status, Headers, Body). Render:
      stampMain (200, size 1.15) + stampVariant0/1 (404 & 500, size 0.6,
      rotate ±10°) + amplop response (anchor `replyEnvelope`, objek beda
      dari amplop request, warna SUCCESS) mulai muncul & terbang balik.
- [x] Act 6 — Amplop Dibuka Lagi (Browser Render, Payoff Penuh). Render:
      rawStatusChip/rawHeaderChip/rawBodyChip (data mentah) →
      pageContent (halaman jadi) → renderCaptionCard (jawab hook Act 1)
      → teaseNextBadge (tease REST API/WebSocket).
- [x] Icon integration (per `revisi/2026-09-09-1820-revisi-01.md` +
      addendum `revisi/2026-09-10-revisi-02.md`): 21 icon PNG (batch
      1-3) sudah di-generate & di-wire ke `Animation.jsx`, menggantikan
      shape SVG manual — `Envelope` (closed/open + feColorMatrix tint),
      `AddressBook`, checkmark accent (`sealedDot`/`foundCheck`),
      `Officer` (3 ekspresi neutral/thinking/happy), `Stamp`
      (approved/rejected), `ServerBuilding`, `BrowserWindow`, method
      badge (`method-get`), chip Act 6 (`html/css/js-document`), dan
      accent journey Act 3 (`dns-magnify`, `tcp-handshake`,
      `packet-fly`). `icons.json` status semua batch = `"generated"`.
      **Belum:** preview visual manual (`npm run dev` →
      `/player/http-request-response`) untuk konfirmasi hasil akhir,
      terutama teknik tint `feColorMatrix` di `Envelope` yang belum
      pernah divalidasi visual sama sekali.
- [ ] Sambungkan `SFX_SCHEDULES` di `scripts/export-lib.js` (sinkron sama
      timing GSAP asli, per 03 §4) — belum disentuh, browser preview SFX
      via `Animation.jsx` sudah jalan tapi export-side belum.
- [ ] Ubah `status` di `registry.js` dari `'coming-soon'` → `'ready'`
      setelah semua Act jadi.
- [ ] Jalankan full **Checklist Sebelum Commit** di
      `docs/standardizations/03-planning-storytelling-quality-gate.md` (13 item
      teknis + 10 item storytelling) — belum layak jalan sekarang karena
      topic belum lengkap, baru boleh dicentang serius setelah Act 2–6 jadi.
- [ ] Jalankan **Checklist Verifikasi Topic Baru** di
      `docs/standardizations/02-topic-contract-scene-shell.md` §7.

---

**Status:** 🚧 IN PROGRESS — Intro + Act 1–6 render sudah dieksekusi (build
compile PASS), tapi belum ada preview visual manual (`npm run dev`), SFX
export schedule, atau checklist commit/verifikasi topic baru.
**Dibuat:** 2026-09-08
**Terakhir diupdate:** 2026-09-09 (setelah render JSX Act 2–6 selesai,
menyusul timeline GSAP yang sudah ada dari pass sebelumnya)
