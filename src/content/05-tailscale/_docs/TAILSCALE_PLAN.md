# Tailscale — Topic Plan

## Overview

Animasi narrative-driven: cerita 2 laptop beda lokasi (rumah vs kantor) yang
mau connect langsung tapi diblokir NAT/firewall, sampai akhirnya bisa nyambung
mulus lewat Tailscale — WireGuard key pair, coordination server sebagai "mak
comblang", NAT hole punching, dan fallback DERP relay. Ending = mesh network
privat, jawab hook Act 1 secara eksplisit.

Target audiens: orang awam/developer pemula, playful tone, BUKAN dokumentasi
teknis dibacakan. Ikuti kontrak `docs/02-standar-konten.md` +
`docs/03-tutorial-buat-topic-baru.md`.

**Canvas:** 820 × 1340 (portrait 9:16, standar reels mobile — sama seperti
`linux-vs-unix`, `virtual-memory`, `file-permission`)
**Difficulty:** ⭐⭐⭐ (banyak konsep teknis harus disederhanakan tanpa jadi salah)
**Estimasi total durasi:** ~49 detik (5 Act)

---

## Color Palette

```
BG:          #070913   background solid, dark navy
PANEL:       #0F172A   panel/card
BORDER:      #334155
TEXT:        #E2E8F0
MUTED:       #94A3B8

Tailscale brand accent: #6366F1  indigo - elemen "Tailscale" itu sendiri
WireGuard/crypto:       #2CD1A8  mint - key pair, enkripsi
Danger/blocked (NAT):   #F43F5E  rose - firewall block, gagal connect
Server/coordination:    #FBBF24  amber - coordination server, "mak comblang"
Success/P2P direct:     #38BDF8  sky blue - koneksi langsung berhasil
Relay fallback:         #A78BFA  violet - DERP relay, jalur cadangan
```

---

## Story Spine (4-Beat per Act, wajib per docs/03)

| Act | Setup | Tegangan/Masalah | Titik Balik | Payoff |
|---|---|---|---|---|
| 1 | Laptop rumah & laptop kantor mau connect langsung (misal remote-desktop) | Dicoba connect pakai IP publik → diblokir NAT/firewall dua-duanya, gagal total | — (hook belum dijawab) | Cliffhanger: "Terus gimana caranya dua device di belakang tembok masing-masing bisa saling nemu?" |
| 2 | Tailscale diinstall di kedua laptop | Internet publik itu rame & rawan disadap — gimana caranya percaya device lain tanpa kirim password? | Tiap device generate key pair sendiri (public+private) saat install — ini fondasi WireGuard | Device saling kenal via public key, bukan lewat password yang bisa dicuri |
| 3 | Device sudah punya identitas (key), tapi IP rumah/kantor sering berubah-ubah | Gimana device A tau device B ada "di mana" sekarang kalau IP-nya dinamis? | Coordination server Tailscale cuma nyimpen & sebar public key + alamat kasar terenkripsi — TIDAK PERNAH baca isi traffic asli | Semua device di tailnet otomatis dapat "daftar teman", update real-time |
| 4 | Device saling kenal, tapi masih di belakang firewall masing-masing | Gimana caranya connect LANGSUNG (peer-to-peer), bukan lewat server tengah yang lambat? | NAT hole punching: kedua device "nembak" ke arah satu sama lain di waktu bersamaan, lubang kebentuk sebelum firewall sempat nolak | Mayoritas koneksi berhasil direct P2P; kalau NAT kelewat ketat → fallback DERP relay (tetap terenkripsi) |
| 5 | Semua koneksi sudah terbentuk | — (tegangan sudah reda) | Reveal: mesh network privat semua-ke-semua | Jawab hook Act 1 secara eksplisit — rumah & kantor sekarang berasa 1 LAN privat walau lewat internet publik & beda kota |

---

## Act 1 — Hook: Dua Rumah Terkunci (≈9s)

**Badge:** "ACT 1 — DUA DEVICE, DUA TEMBOK"
**Visual inti:**
- Kiri: laptop "RUMAH" di dalam kotak rumah dengan simbol router/firewall
- Kanan: laptop "KANTOR" di dalam kotak gedung dengan simbol router/firewall
- Di tengah: internet publik (awan) memisahkan keduanya
- Kapsul "connect request" ditembak dari RUMAH → KANTOR lewat awan → **DITOLAK**
  (bounce back, garis merah, ikon 🚫), disusul reaksi karakter kaget/bingung
  (muka bulat simpel)
- Speech bubble hook: "Kok gak nyambung ya? Padahal sama-sama online... 🤔"
- Teks closing Act: cliffhanger, bukan jawaban — lempar ke Act 2/3/4

---

## Act 2 — WireGuard: Kunci, Bukan Password (≈9s)

**Badge:** "ACT 2 — SETIAP DEVICE PUNYA KUNCI SENDIRI"
**Visual inti:**
- Icon Tailscale (indigo) "turun" ke kedua laptop → install
- Tiap laptop memunculkan sepasang kunci bercahaya (mint): kunci publik
  (boleh disebar) + kunci privat (dikunci gembok, tidak pernah keluar device)
- Animasi: kunci publik "terbang" keluar dari tiap laptop sebagai token kecil
  bercahaya, kunci privat tetap diam terkunci di dalam laptop
- Badge/starburst "aha moment": "Bukan Password — Kunci Kriptografi!"
- Analogi teks pendek: gembok & kunci, bukan kata sandi yang bisa dicuri

## Act 3 — Coordination Server: Si Mak Comblang (≈10s)

**Badge:** "ACT 3 — SIAPA YANG KENALIN MEREKA?"
**Visual inti:**
- Setup: IP rumah & kantor digambar berubah-ubah (angka IP flicker/acak)
- Tegangan: "Kalau alamatnya selalu berubah, gimana caranya saling nemu?"
- Titik balik: muncul kotak "Tailscale Coordination Server" (amber) di tengah
  atas — kedua laptop kirim public key + alamat kasar ke sana
- PENTING (badge kecil): server ini TIDAK PERNAH lihat isi data — cuma
  nyimpen "buku alamat", panah/garis dari server ke server digambar putus-putus
  redup (metadata only), beda visual dari garis data asli nanti di Act 4/5
- Payoff: kedua laptop dapat "daftar teman" (tailnet) otomatis muncul di
  layar masing-masing, courier icon kecil terbang bolak-balik bawa alamat

---

## Act 4 — Nembus Tembok: Hole Punching & Relay (≈12s)

**Badge:** "ACT 4 — NEMBUS TEMBOK BARENGAN"
**Visual inti (pola simulasi feedback loop, lihat 03-tutorial 3.5):**
- Kedua laptop sekarang saling tahu alamat (dari Act 3) tapi firewall masing2
  masih berdiri (kotak tembok merah redup di depan tiap laptop)
- Simulasi 1 — SUKSES: kedua laptop "nembak" bareng (dua kapsul meluncur
  bersamaan dari kedua sisi, sinkron di waktu yang sama) → tembus di tengah
  → tembok kebuka sesaat → **KONEKSI LANGSUNG (P2P) terbentuk**, garis solid
  sky-blue nyala nyambung dua laptop langsung tanpa lewat server
- Beat tegangan sebelum reveal: 1-2 detik jeda "akankah tembus?" (sesuai
  aturan 03-tutorial: jangan langsung tampilkan hasil)
- Simulasi 2 — FALLBACK: kalau NAT kelewat ketat (gambarkan tembok lebih
  tebal/ganda di satu sisi), hole punching gagal → otomatis lempar ke
  **DERP relay server** (violet) di tengah atas → garis relay (violet,
  sedikit lebih redup dari P2P langsung) tetap terenkripsi, cuma lewat pihak
  ketiga sebagai jembatan
- Caption pembanding singkat: "P2P langsung = kayak jalan tol. Relay = tetap
  nyampe, lewat jalan memutar dikit — tapi tetap terkunci rapat."

---

## Act 5 — Payoff: Satu LAN Privat di Mana Saja (≈9s)

**Badge:** "ACT 5 — SEKARANG BERASA 1 JARINGAN"
**Visual inti:**
- Zoom out: tambahkan 1-2 device lagi (HP, server cloud) di layar → semua
  device di tailnet saling terhubung garis sky-blue P2P (mesh, bukan cuma
  2 titik lagi seperti Act 1)
- Reveal eksplisit menjawab hook Act 1: tembok/firewall rumah & kantor masih
  ada (tidak dibobol/dihilangkan!), tapi sekarang ada "jalur rahasia
  terenkripsi" tembus keduanya — bukan VPN klasik lewat 1 server pusat,
  tapi mesh privat
- Closing line: "Laptop di rumah, laptop di kantor... sekarang berasa 1
  jaringan LAN, padahal lewat internet publik & beda kota. Itulah Tailscale."
- Karakter reaksi senang (muka bulat simpel, mata melengkung, mulut senyum)
  sebagai penutup playful

---

## Konsep Teknis yang WAJIB Tetap Akurat (jangan disederhanakan sampai salah)

1. Tailscale = mesh VPN berbasis **WireGuard** protocol, bukan bikin protokol
   enkripsi sendiri dari nol.
2. **Coordination server** Tailscale (disebut juga control plane) HANYA
   bertukar metadata (public key, alamat kandidat) — tidak pernah melihat
   / mendekripsi isi traffic user. Ini beda dari VPN klasik yang semua
   traffic lewat 1 server pusat.
3. **NAT traversal / hole punching**: kedua peer mengirim paket ke arah
   satu sama lain secara simultan sehingga NAT table di router masing-masing
   sudah punya "izin masuk" untuk balasan dari peer — bukan "membobol" firewall,
   ini teknik standar (STUN-like) yang legal & umum dipakai VPN mesh modern.
4. **DERP relay**: server relay milik Tailscale yang dipakai HANYA kalau
   direct P2P gagal terbentuk (NAT simetris/strict). Traffic yang lewat DERP
   tetap terenkripsi end-to-end (DERP tidak bisa baca isi), cuma menambah 1
   hop di jalur network.
5. Jangan gambarkan seolah-olah firewall/NAT "dihilangkan" — yang terjadi
   adalah koneksi terenkripsi berhasil terbentuk MELEWATI firewall yang tetap
   berdiri, sesuai izin routing yang sama-sama disepakati kedua sisi.

---

## Manifest Draft (`manifest.js`)

```js
export default {
  schemaVersion: 1,
  id: 'tailscale',
  title: 'How Tailscale Works',
  subtitle: 'From blocked NAT to a private mesh network',
  category: 'Networking',
  tags: ['Tailscale', 'VPN', 'WireGuard', 'Mesh Network', 'NAT Traversal'],
  color: '#6366F1',
  audioStrategy: 'realtime',
}
```

## data.js Skeleton (rencana, belum final)

```js
export const VW = 820
export const VH = 1340

export const COLORS = { /* lihat Color Palette di atas */ }

export const PHASES = [
  { id: 'blocked-hook',   badge: 'ACT 1 — DUA DEVICE, DUA TEMBOK',        duration: 9.0 },
  { id: 'wireguard-keys', badge: 'ACT 2 — SETIAP DEVICE PUNYA KUNCI SENDIRI', duration: 9.0 },
  { id: 'coordination',   badge: 'ACT 3 — SIAPA YANG KENALIN MEREKA?',    duration: 10.0 },
  { id: 'hole-punching',  badge: 'ACT 4 — NEMBUS TEMBOK BARENGAN',        duration: 12.0 },
  { id: 'mesh-payoff',    badge: 'ACT 5 — SEKARANG BERASA 1 JARINGAN',    duration: 9.0 },
]

// diisi detail per-Act saat implementasi:
// DEVICES, NAT_BLOCK_EVENT, KEY_PAIR_ANIM, COORD_SERVER_EVENTS,
// HOLE_PUNCH_SIM (sukses + fallback DERP), MESH_FINAL_NODES
export const SFX_MAP = { /* whoosh, error/block, key-generate, ping-pong,
  punch-through, success, relay-hum, victory — map ke shared/audio/sfxLoader */ }
```

---

## Checklist Sebelum Implementasi Kode (lihat juga docs/03 bagian Checklist)

- [ ] Plan ini direview/disetujui user
- [ ] Folder `src/content/tailscale/{Animation.jsx,data.js,manifest.js}` dibuat
- [ ] `registry.js` daftar via spread manifest (bukan hardcode literal)
- [ ] Tiap Act ikuti 4-beat table di atas saat coding (bukan cuma daftar fakta)
- [ ] Minimal 1 elemen visual non-rect per Act (speech bubble/karakter/badge)
- [ ] `window.__animationTimeline` + cleanup `tl.kill()`
- [ ] SFX browser sinkron dengan `SFX_SCHEDULES` di `scripts/export-lib.js`
- [ ] Konsep teknis di atas (§ Konsep Teknis WAJIB Akurat) tidak dilanggar
