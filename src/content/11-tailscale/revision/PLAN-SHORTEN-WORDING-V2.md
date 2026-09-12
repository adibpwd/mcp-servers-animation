# Plan V2 — Ringkasin Wording Lagi (Lebih Pendek dari V1)

> **Status: ANALISA SELESAI, BELUM DIEKSEKUSI.** Lanjutan dari
> `PLAN-SHORTEN-WORDING.md` (V1, sudah dieksekusi). User minta lebih
> ringkas lagi. Belum ada kode yang diubah.

## Aturan Baru (lebih ketat dari V1)

1. Maksimal ±5-7 kata per kalimat (V1 masih ±8-10).
2. Kalau 1 kalimat masih bisa dipotong jadi 2 frasa pendek, potong.
3. Istilah teknis (WireGuard, DERP, P2P, tailnet, Coordination Server)
   tetap dipertahankan.
4. Kata-kata narasi ("sekarang", "tapi", "sekarang tambahkan") yang gak
   nambah info dibuang duluan.

## ACT 1 — Dua Device, Dua Tembok

| Lokasi | Versi V1 (skrg) | Usulan V2 |
|---|---|---|
| `PHASES[0].caption` | "Laptop rumah & kantor sama-sama online. Tapi kok gagal connect?" | "Sama-sama online. Kok gagal connect?" |
| `HOOK_QUESTION` | "Kok gak nyambung? Padahal sama-sama online." | "Kok gak nyambung?" |
| `HOOK_CLIFFHANGER` | "Gimana caranya 2 device di balik tembok bisa saling nemu?" | "Gimana caranya bisa saling nemu?" |
| inline `say()` t+0.1 | "Laptop rumah mau connect ke laptop kantor..." | "Laptop rumah mau connect ke kantor." |
| inline `say()` t+1.9 | "Dicoba connect langsung lewat internet..." | "Coba connect lewat internet..." |
| inline `say()` t+3.3 | "DITOLAK! Firewall kantor nutup rapat." | *(sudah pendek, gak diubah)* |

## ACT 2 — WireGuard: Kunci, Bukan Password

| Lokasi | Versi V1 (skrg) | Usulan V2 |
|---|---|---|
| `PHASES[1].caption` | "Tailscale diinstall. Tiap device bikin kunci sendiri — bukan password." | "Tiap device bikin kunci sendiri." |
| `KEY_INSIGHT` | "Bukan Password — Kunci Kriptografi!" | *(sudah pendek, gak diubah)* |
| `KEY_CAPTION` | "Password bisa dicuri. Kunci privat gak pernah keluar device." | "Password bisa dicuri. Kunci privat disimpan aman." |
| inline `say()` t+0.1 | "Tailscale diinstall di kedua laptop..." | "Tailscale diinstall." |
| inline `say()` t+1.6 | "Tiap device bikin sepasang kunci sendiri." | "Device bikin kunci sendiri." |
| inline `say()` t+3.1 | "Kunci publik boleh disebar. Kunci privat gak pernah keluar." | "Kunci publik disebar. Kunci privat disimpan." |

## ACT 3 — Coordination Server: Si Mak Comblang

| Lokasi | Versi V1 (skrg) | Usulan V2 |
|---|---|---|
| `PHASES[2].caption` | "IP rumah & kantor berubah-ubah. Coordination server cuma tukar alamat." | "IP berubah-ubah. Server cuma tukar alamat." |
| `COORD_QUESTION` | "Alamatnya selalu berubah, gimana caranya saling nemu?" | "Gimana caranya bisa saling nemu?" |
| `COORD_NOTE` | "Server ini cuma nyimpen alamat, gak baca isi data." | "Server cuma nyimpen alamat." |
| `COORD_PAYOFF` | "Kedua laptop otomatis kenalan lewat tailnet." | "Kedua laptop kenalan otomatis." |
| inline `say()` t+0.1 | "Tapi... IP rumah & kantor sering berubah-ubah." | "IP rumah & kantor berubah-ubah." |
| inline `say()` t+4.9 | "Kenalin: Tailscale Coordination Server." | *(sudah pendek, gak diubah)* |

## ACT 4 — Nembus Tembok Barengan

| Lokasi | Versi V1 (skrg) | Usulan V2 |
|---|---|---|
| `PHASES[3].caption` | "Kedua device nembak bareng, tembus firewall. Gagal? Ada jalur cadangan." | "Nembus firewall bareng. Gagal? Ada cadangan." |
| `HOLEPUNCH_TENSION` | "Nembak bareng... akankah tembus?" | *(sudah pendek, gak diubah)* |
| `HOLEPUNCH_SUCCESS` | "TEMBUS! Koneksi P2P langsung, cepat kayak LAN." | "TEMBUS! Koneksi P2P langsung." |
| `RELAY_TENSION` | "Firewall satunya kelewat ketat... hole punching gagal." | *(sudah pendek, gak diubah)* |
| `RELAY_FALLBACK` | "Otomatis lewat DERP relay — tetap aman, cuma muter dikit." | "Lewat DERP relay — tetap aman." |
| `HOLEPUNCH_COMPARE` | "P2P = jalan tol. Relay = muter dikit, tetap aman." | "P2P = jalan tol. Relay = muter, aman." |
| inline `say()` t+0.1 | "Sekarang kedua laptop udah kenal. Tinggal nembus tembok." | "Saatnya nembus tembok." |
| inline `say()` t+1.5 | "Kedua device nembak bareng, di waktu yang sama..." | "Nembak bareng, di waktu sama..." |
| inline `say()` t+6.0 | "Tapi kadang firewall satunya kelewat ketat..." | "Firewall satunya kelewat ketat..." |

## ACT 5 — Sekarang Berasa 1 Jaringan (Payoff)

| Lokasi | Versi V1 (skrg) | Usulan V2 |
|---|---|---|
| `PHASES[4].caption` | "Semua device di tailnet nyambung langsung — serasa 1 LAN." | "Semua device nyambung — serasa 1 LAN." |
| `CLOSING_LINE` | "Rumah & kantor sekarang berasa 1 LAN — padahal lewat internet, beda kota." | "Sekarang berasa 1 LAN, padahal beda kota." |
| `CLOSING_BRAND` | "Itulah cara kerja Tailscale." | *(sudah pendek, gak diubah)* |
| inline `say()` t+0.1 | "Sekarang tambahkan lebih banyak device ke tailnet..." | "Tambah device ke tailnet..." |
| inline `say()` t+1.8 | "Semua saling connect langsung — bukan cuma 2 titik lagi." | "Semua connect langsung." |

## Teks yang TIDAK Diubah

`KEY_INSIGHT`, `HOLEPUNCH_TENSION`, `RELAY_TENSION`, `CLOSING_BRAND`,
`IP_FLICKER`, semua `PHASES[].badge`, dan inline `say()` "DITOLAK!.."
serta "Kenalin: Tailscale Coordination Server." — sudah cukup pendek
(≤5-6 kata atau kalimat seru pendek), gak perlu dipotong lagi.

## Dampak ke Kode (kalau nanti dieksekusi)

- **`data.js`**: ganti isi string constant yang ada di tabel di atas
  (9 constant + 5 `caption` di `PHASES[]`). Nama variabel tidak
  berubah — `Animation.jsx` yang refer ke constant (`KEY_CAPTION`,
  `COORD_NOTE`, `CLOSING_LINE`, dst) otomatis ikut pendek.
- **`Animation.jsx`**: 11 inline string literal di dalam
  `say(tl, time, '...')` perlu diganti manual — tersebar di Act 1
  (2 baris), Act 2 (3 baris), Act 3 (1 baris), Act 4 (3 baris),
  Act 5 (2 baris).
- Timing (`t + ...`) dan durasi `PHASES[].duration` — **tidak**
  berubah. Teks lebih pendek biasanya durasi baca jadi lebih longgar,
  tapi belum tentu perlu dipangkas — cek nanti pas preview.
- Box/`Badge`/`rect` — makin lega karena teks makin pendek. Sama
  seperti catatan di V1, efek visual minor, dirapikan belakangan
  kalau kelihatan kosong/gepeng.

## Yang Perlu Dicek Setelah Eksekusi (nanti)

- Baca ulang tiap usulan V2 — pastikan makna teknis (WireGuard, DERP,
  P2P, tailnet) tetap jelas walau kalimat makin pendek.
- Preview visual: cek proporsi box/Badge, dan apakah durasi caption
  (`PHASES[].duration`) masih pas buat dibaca audiens meski teksnya
  lebih pendek (kemungkinan bisa dipangkas dikit di eksekusi
  terpisah, bukan bagian plan ini).

**Status: masih rencana, nunggu konfirmasi user pilih/edit versi V2
mana yang dipakai sebelum eksekusi ke `data.js`/`Animation.jsx`.**
