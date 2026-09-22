# Plan — Ringkasin Wording (Caption & Teks) Act 1 s/d Akhir

> **Status: ANALISA SELESAI, BELUM DIEKSEKUSI.** Cuma daftar usulan
> wording baru per teks. Belum ada satu kata pun yang diubah di
> `data.js`/`Animation.jsx`. Nunggu review user dulu.

## Keluhan User

> "wording-nya jangan panjang-panjang di Act 1 sampai akhir, biar
> simple, audiens gak ribet baca panjang-panjang, langsung to the
> point apa inti message-nya."

## Aturan Umum yang Dipakai buat Nyusun Ulang

1. Maksimal ±8-10 kata per kalimat (kalimat majemuk dipecah/dipotong).
2. 1 kalimat = 1 ide pokok. Kalau ada 2 ide, ambil yang paling penting
   buat pesan utama, sisanya dibuang (bukan digabung pake koma).
3. Buang kata pengisi ("saat itu juga", "masing-masing", "kembali",
   dsb) yang gak nambah makna.
4. Istilah teknis (WireGuard, DERP, P2P, tailnet) tetap dipertahankan
   — itu bagian dari pesan, bukan filler.

## Audit & Usulan — Per Act

### ACT 1 — Dua Device, Dua Tembok

| Lokasi | Versi Lama | Usulan Baru |
|---|---|---|
| `PHASES[0].caption` | "Laptop rumah mau connect ke laptop kantor. Sama-sama online... tapi kok gagal terus?" | "Laptop rumah & kantor sama-sama online. Tapi kok gagal connect?" |
| `HOOK_QUESTION` | "Kok gak nyambung ya? Padahal sama-sama online..." | "Kok gak nyambung? Padahal sama-sama online." |
| `HOOK_CLIFFHANGER` | "Gimana caranya 2 device di balik tembok masing-masing bisa saling nemu?" | "Gimana caranya 2 device di balik tembok bisa saling nemu?" |
| inline `say()` t+0.1 | "Laptop di rumah mau connect langsung ke laptop di kantor..." | "Laptop rumah mau connect ke laptop kantor..." |
| inline `say()` t+3.3 | "DITOLAK! Firewall kantor nutup rapat." | *(sudah pendek, gak diubah)* |

### ACT 2 — WireGuard: Kunci, Bukan Password

| Lokasi | Versi Lama | Usulan Baru |
|---|---|---|
| `PHASES[1].caption` | "Tailscale diinstall. Tiap device bikin kunci kriptografi sendiri — bukan password." | "Tailscale diinstall. Tiap device bikin kunci sendiri — bukan password." |
| `KEY_INSIGHT` | "Bukan Password — Kunci Kriptografi!" | *(sudah pendek, gak diubah)* |
| `KEY_CAPTION` | "Password bisa dicuri & dipakai ulang. Kunci privat ini TIDAK PERNAH keluar dari device pemiliknya." | "Password bisa dicuri. Kunci privat gak pernah keluar device." |
| inline `say()` t+1.6 | "Tiap device generate sepasang kunci sendiri, saat itu juga." | "Tiap device bikin sepasang kunci sendiri." |
| inline `say()` t+3.1 | "Kunci publik boleh disebar bebas. Kunci privat terkunci rapat, gak pernah keluar device." | "Kunci publik boleh disebar. Kunci privat gak pernah keluar." |

### ACT 3 — Coordination Server: Si Mak Comblang

| Lokasi | Versi Lama | Usulan Baru |
|---|---|---|
| `PHASES[2].caption` | "IP rumah & kantor berubah-ubah. Coordination server jadi \"mak comblang\" — cuma tukar alamat, gak baca isi data." | "IP rumah & kantor berubah-ubah. Coordination server cuma tukar alamat." |
| `COORD_QUESTION` | "Kalau alamatnya selalu berubah, gimana caranya saling nemu?" | "Alamatnya selalu berubah, gimana caranya saling nemu?" |
| `COORD_NOTE` | "Server ini TIDAK PERNAH baca isi data — cuma nyimpen \"buku alamat\" (public key + lokasi kasar)." | "Server ini cuma nyimpen alamat, gak baca isi data." |
| `COORD_PAYOFF` | "Kedua laptop otomatis dapat daftar teman (tailnet) mereka." | "Kedua laptop otomatis kenalan lewat tailnet." |

### ACT 4 — Nembus Tembok Barengan

| Lokasi | Versi Lama | Usulan Baru |
|---|---|---|
| `PHASES[3].caption` | "Kedua device nembak bareng, tembus firewall masing-masing. Kalau gagal, ada jalur cadangan." | "Kedua device nembak bareng, tembus firewall. Gagal? Ada jalur cadangan." |
| `HOLEPUNCH_SUCCESS` | "TEMBUS! Koneksi langsung (P2P) terbentuk — cepat kayak LAN." | "TEMBUS! Koneksi P2P langsung, cepat kayak LAN." |
| `RELAY_FALLBACK` | "Otomatis lewat DERP relay — tetap terenkripsi, cuma nambah 1 jalur muter." | "Otomatis lewat DERP relay — tetap aman, cuma muter dikit." |
| `HOLEPUNCH_COMPARE` | "P2P langsung = jalan tol. Relay = tetap nyampe, muter dikit — tapi tetap terkunci rapat." | "P2P = jalan tol. Relay = muter dikit, tetap aman." |
| inline `say()` t+0.1 | "Sekarang kedua laptop udah saling kenal. Tinggal nembus tembok masing-masing." | "Sekarang kedua laptop udah kenal. Tinggal nembus tembok." |

### ACT 5 — Sekarang Berasa 1 Jaringan (Payoff)

| Lokasi | Versi Lama | Usulan Baru |
|---|---|---|
| `PHASES[4].caption` | "Semua device di tailnet nyambung langsung. Rumah & kantor kini serasa satu LAN privat." | "Semua device di tailnet nyambung langsung — serasa 1 LAN." |
| `CLOSING_LINE` | "Laptop di rumah, laptop di kantor... sekarang berasa 1 jaringan LAN, padahal lewat internet publik & beda kota." | "Rumah & kantor sekarang berasa 1 LAN — padahal lewat internet, beda kota." |
| `CLOSING_BRAND` | "Itulah cara kerja Tailscale." | *(sudah pendek, gak diubah)* |

## Teks yang TIDAK Diubah (sudah cukup pendek/to the point)

`HOLEPUNCH_TENSION`, `RELAY_TENSION`, `IP_FLICKER`, badge (`PHASES[].badge`),
dan beberapa inline `say()` transisi pendek lain yang gak disebut di
tabel — semua sudah di bawah ±10 kata, gak perlu dipangkas lagi.

## Dampak ke Kode (kalau nanti dieksekusi)

- **`data.js`**: cuma ganti isi string constant (`HOOK_QUESTION`,
  `HOOK_CLIFFHANGER`, `KEY_CAPTION`, `COORD_NOTE`, `COORD_PAYOFF`,
  `RELAY_FALLBACK`, `HOLEPUNCH_COMPARE`, `CLOSING_LINE`, `COORD_QUESTION`,
  `HOLEPUNCH_SUCCESS`, dan 5 `caption` di `PHASES[]`) — **tidak** ganti
  nama variabel, jadi `Animation.jsx` gak perlu disentuh sama sekali
  untuk bagian ini.
- **`Animation.jsx`**: cuma 4 inline string literal di dalam `say(tl, time, '...')`
  yang perlu diganti manual (bukan lewat `data.js`) — lihat baris
  "inline `say()`" di tabel Act 1, 2, 4 di atas.
- Card/badge (posisi, warna, timing `popIn`) — **tidak** berubah, cuma
  isi teksnya lebih pendek sehingga kemungkinan tinggi bikin box
  (`Badge`/`rect`) kelihatan agak lega (ada spasi kosong) karena
  `wrapText()` sekarang wrap lebih sedikit baris. Ini efek visual
  minor, bisa dirapikan belakangan kalau kepenuhan/terlalu lega.

## Yang Perlu Dicek Setelah Eksekusi (nanti)

- Baca ulang tiap usulan di atas — pastikan gak ada makna teknis yang
  hilang gara-gara dipotong (terutama `COORD_NOTE` & `RELAY_FALLBACK`
  yang aslinya punya detail teknis di dalam kurung).
- Preview visual: cek apakah box/`Badge` yang sekarang teksnya lebih
  pendek kelihatan proporsional (gak kosong/gepeng) di posisi yang
  sudah ada.

**Status: masih rencana, nunggu konfirmasi user pilih/edit versi baru
mana yang dipakai sebelum mulai ubah `data.js`/`Animation.jsx`.**
