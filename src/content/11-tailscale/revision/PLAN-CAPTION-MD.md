# PLAN — Buat `caption.md` untuk Topic Tailscale

> ✅ **STATUS: SUDAH DIEKSEKUSI (2026-09-06).**
> `src/content/tailscale/caption.md` sudah dibuat persis sesuai draft
> §4 di bawah (tanpa revisi tambahan — di-ACC apa adanya). Tidak ada
> file lain yang disentuh.
>
> Catatan koreksi: percobaan eksekusi pertama sempat salah tool (nyasar
> ke sandbox internal, bukan project asli via Desktop Commander) —
> sudah diperbaiki, file final ini & `caption.md` sudah benar tertulis
> ke path project yang sesungguhnya.

## 1. Latar Belakang

Dicek folder `src/content/tailscale/` — belum ada `caption.md` (file
caption/deskripsi buat posting sosial media, terpisah dari `data.js` yang
isinya teks in-video seperti caption bar & badge).

Referensi pola yang sudah ada: `src/content/linux-vs-unix/caption.md`
(satu-satunya topic yang sudah punya file ini). Isinya bukan transkrip
video, tapi caption gaya sosial media: hook pembuka + emoji, ringkasan
konflik/cerita, ajakan nonton video penuh, ajakan save, lalu baris
hashtag di akhir. Panjangnya pendek (11 baris/paragraf pendek-pendek),
bukan esai.

## 2. Sumber Materi yang Sudah Tersedia (dari `data.js` & `manifest.js`)

- **Judul/subtitle** (`manifest.js`): "How Tailscale Works" / "From
  blocked NAT to a private mesh network"
- **Hook Act 1**: `HOOK_QUESTION` = "Kok gak nyambung?",
  `HOOK_CLIFFHANGER` = "Gimana caranya bisa saling nemu?"
- **Konflik inti**: 2 device, sama-sama online, tapi gagal connect
  (NAT block) → butuh WireGuard key pair (Act 2) → coordination server
  "mak comblang" (Act 3) → NAT hole punching + DERP relay fallback
  (Act 4) → payoff: mesh network privat, berasa 1 LAN (Act 5)
- **Payoff/closing**: `CLOSING_LINE` = "Sekarang berasa 1 LAN, padahal
  beda kota.", `CLOSING_BRAND` = "Itulah cara kerja Tailscale."
- **Istilah teknis yang bisa jadi hook rasa penasaran**: WireGuard,
  NAT traversal, hole punching, DERP relay, mesh network — istilah yang
  terdengar "keren tapi asing" buat audiens awam, bagus buat hook rasa
  penasaran ala caption `linux-vs-unix` yang sebut POSIX/AT&T sebagai
  detail teknis yang bikin penasaran.

## 3. Struktur yang Direncanakan (mengikuti pola `linux-vs-unix/caption.md`)

1. **Hook 1 baris** + emoji — fakta yang bikin kaget/penasaran soal
   Tailscale (mis. soal 2 device beda tempat bisa nyambung kayak 1 LAN).
2. **Transisi "tapi tunggu..."** — masuk ke konflik (NAT block, 2 device
   sama-sama online tapi gagal connect).
3. **Ringkasan alur cerita singkat** (bukan detail teknis lengkap) —
   sebut istilah kunci (WireGuard key, coordination server, hole
   punching, DERP relay) sebagai "penasaran hook", bukan penjelasan
   penuh.
4. **CTA nonton video penuh** + emoji (pola: "Full ceritanya ada di
   video — nonton sampai habis...").
5. **CTA save** (pola: "Save buat nanti kalau lupa 📌").
6. **Baris hashtag** — relevan ke `manifest.js.tags`
   (`Tailscale, VPN, WireGuard, Mesh Network, NAT Traversal`) + tag
   umum sejenis punya `linux-vs-unix` (`#TechHistory` →
   kemungkinan versi tailscale: `#Networking`, `#TechExplained`, dsb).

## 4. Draft Isi (final, sudah dipakai di `caption.md`)

```
Bayangin laptop rumah & laptop kantor bisa saling connect kayak nyambung ke 1 WiFi yang sama — padahal beda kota, beda jaringan. 🌐

Tapi tunggu... 2 device itu sama-sama online, kok bisa gagal connect? Ternyata masalahnya di NAT — router masing-masing kayak tembok yang gak saling kenal.

Solusinya? Tiap device bikin kunci kriptografi sendiri (WireGuard), terus ada "mak comblang" (coordination server) yang cuma nyimpen alamat — bukan data. Dari situ, kedua device coba nembus tembok bareng (hole punching), dan kalau gagal, ada jalur cadangan lewat DERP relay.

Hasil akhirnya? Semua device berasa 1 jaringan privat, padahal terpisah kota. 🔒

Gimana caranya bisa se-ajaib ini? 👀 Full penjelasannya ada di video — nonton sampai habis biar paham alurnya dari awal.

Save buat referensi kalau lagi belajar soal VPN/mesh network 📌

#Tailscale #VPN #WireGuard #MeshNetwork #NATTraversal #Networking
```

Catatan: draft ini sengaja disederhanakan (istilah teknis dijelasin
singkat, bukan detail penuh) — konsisten sama nada `linux-vs-unix`
yang juga menghindari jargon berat di caption meski videonya sendiri
teknis.

## 5. Yang Perlu Diputuskan Sebelum Eksekusi

- [x] Apakah draft §4 sudah pas nadanya (santai/hook-driven, bukan
      dokumentasi teknis)? — di-ACC apa adanya, user langsung bilang
      "eksekusi" tanpa revisi.
- [x] Apakah hashtag di draft sudah cukup? — dipakai apa adanya.
- [x] Apakah CTA save/nonton-penuh sudah sesuai? — dipakai apa adanya.
- [x] Konfirmasi lokasi file: `src/content/tailscale/caption.md`
      (sejajar `data.js`/`manifest.js`, sama seperti `linux-vs-unix`).

## 6. Langkah Eksekusi (checklist)

1. [x] Finalisasi teks caption — dipakai apa adanya dari draft §4,
       tanpa revisi (user langsung bilang "eksekusi").
2. [x] Buat file `src/content/tailscale/caption.md` isi teks final —
       ditulis via `Desktop Commander:write_file` ke path project asli.
3. [x] Cross-check: tidak ada topic/file lain yang tersentuh — hanya
       1 file baru dibuat, `data.js`/`manifest.js`/`Animation.jsx`
       tidak diubah.

## 7. Catatan

- Ini murni nambah 1 file dokumentasi caption, tidak menyentuh kode
  animasi/audio sama sekali — tidak ada risiko regresi ke video/export.
- Sudah dieksekusi penuh sesuai checklist §6, dan sudah diverifikasi
  ulang (`Desktop Commander:read_file`) bahwa kedua file (`caption.md`
  dan plan ini) benar-benar ada di path project asli, bukan cuma di
  sandbox internal.
