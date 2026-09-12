# Plan — Hilangkan Teks Dobel (Caption Atas vs Card/Badge Bawah)

> **Status: SUDAH DIEKSEKUSI (2026-09-06).** Ke-10 baris `say()`
> duplikat sudah dihapus dari `Animation.jsx`, tidak ada yang lain
> diubah (card/badge/timing semua tetap sama).

## Keluhan User

> "aga menggangu kadang teks di bawah kadang, kadang baca di atas,
> kalau di atas kan sekarang wajib di baca ya, bawah tambahan, aga
> membingungkan buat audiens saya rasa"

## Root Cause (dikonfirmasi baca source code)

Caption bar di atas (`say(tl, time, text)` → set state `caption`,
dirender di `<text y=32>` dalam kotak tetap di y=220) dan card/badge di
bawah (`popIn(tl, time, id)` → render `Badge`/box dengan teks di dalam
`<g>` masing-masing Act) **sering diisi kalimat yang PERSIS SAMA**,
muncul cuma berselisih 0.1–0.2 detik. Audiens jadi baca 2x kalimat yang
identik, di 2 lokasi berbeda (atas = wajib baca terus-menerus, bawah =
kesan "tambahan" tapi isinya sama) — makanya kerasa bingung soal mana
yang harus difokuskan.

## Audit Lengkap — Semua Pasangan Teks Dobel

Ketemu **10 pasangan** di seluruh video (bukan cuma 1-2 tempat):

| # | Act | Variabel teks | Card/badge on-canvas (id) | `say()` yang dobel (waktu) |
|---|---|---|---|---|
| 1 | 1 | `HOOK_CLIFFHANGER` | `cliffhanger1` (t+6.5) | `say(tl, t+6.7, ...)` |
| 2 | 2 | `KEY_INSIGHT` | `keyInsightBadge` (t+4.6) | `say(tl, t+4.8, ...)` |
| 3 | 2 | `KEY_CAPTION` | `keyCaptionBox` (t+6.3) | `say(tl, t+6.5, ...)` |
| 4 | 3 | `COORD_NOTE` | `coordNoteBadge` (t+6.9) | `say(tl, t+7.0, ...)` |
| 5 | 3 | `COORD_PAYOFF` | `coordPayoffCard` (t+8.6) | `say(tl, t+8.8, ...)` |
| 6 | 4 | `HOLEPUNCH_SUCCESS` | `p2pBadge` (t+4.2) | `say(tl, t+4.3, ...)` |
| 7 | 4 | `RELAY_FALLBACK` | `relayBadge` (t+9.2) | `say(tl, t+9.3, ...)` |
| 8 | 4 | `HOLEPUNCH_COMPARE` | `compareBox` (t+10.7) | `say(tl, t+10.9, ...)` |
| 9 | 5 | `CLOSING_LINE` | `closingCard` (t+4.4) | `say(tl, t+4.6, ...)` |
| 10 | 5 | `CLOSING_BRAND` | `closingBrandBadge` (t+7.0) | `say(tl, t+7.2, ...)` |

Semua 10 card/badge di atas isinya **pure teks** (rect/`Badge` + `<text>`,
gak ada ikon/diagram tambahan) — jadi keduanya (card & caption) memang
literally menampilkan kalimat yang sama, cuma beda kotak & font.

Sebagai perbandingan, kalimat yang **TIDAK** dobel (dan sebaiknya tetap
dipertahankan apa adanya karena memang cuma di caption): `HOOK_QUESTION`,
`COORD_QUESTION`, `HOLEPUNCH_TENSION` (ini ada di `tensionBadge1` tapi
teksnya beda dari captionnya — bukan duplikat murni), semua kalimat
transisi pendek ("Tailscale diinstall di kedua laptop...", dsb).

## Rencana Perbaikan — Opsi A: Satu Kanal per Kalimat

**Aturan:** kalau sebuah kalimat sudah muncul di card/badge on-canvas
(yang di-styling lebih menonjol & sudah mendukung word-wrap), HAPUS
`say()` yang isinya persis sama. Card/badge, posisi, warna, timing pop-in
— semua **tidak diubah sama sekali**. Cuma baris `say(...)` untuk 10
kalimat di tabel di atas yang dihapus.

### Baris yang akan dihapus (persis, tanpa ubah lainnya)

```
1. say(tl, t + 6.7, HOOK_CLIFFHANGER)         // Act 1
2. say(tl, t + 4.8, KEY_INSIGHT)              // Act 2
3. say(tl, t + 6.5, KEY_CAPTION)              // Act 2
4. say(tl, t + 7.0, COORD_NOTE)               // Act 3
5. say(tl, t + 8.8, COORD_PAYOFF)             // Act 3
6. say(tl, t + 4.3, HOLEPUNCH_SUCCESS)        // Act 4
7. say(tl, t + 9.3, RELAY_FALLBACK)           // Act 4
8. say(tl, t + 10.9, HOLEPUNCH_COMPARE)       // Act 4
9. say(tl, t + 4.6, CLOSING_LINE)             // Act 5
10. say(tl, t + 7.2, CLOSING_BRAND)           // Act 5
```

Setelah dihapus, caption bar di atas otomatis "diam" (tetap nampilin
teks `say()` terakhir sebelumnya) selama card/badge itu jadi fokus di
bawah — bukan blank, cuma gak ganti-ganti lagi di momen itu.

### Efek Samping yang Perlu Disadari (trade-off, bukan bug)

- Caption bar bakal "diam" agak lama di beberapa titik (paling lama di
  Act 3: dari `COORD_QUESTION` di t+2.7 sampai akhir Act, ±6 detik
  caption gak ganti sementara 2 card muncul gantian di bawah). Ini
  wajar & disengaja — caption memang gak wajib ganti tiap detik, tapi
  perlu didengar/dilihat langsung apakah kerasa "kelamaan diam" atau
  enggak pas dicoba.
- Kalimat yang HANYA ada di card (gak ada lagi echo di caption) jadi
  wajib dibaca dari card itu sendiri — pastikan durasi tampil card
  (`popIn` → sampai Act pindah) cukup lama buat dibaca. Dari observasi
  timing yang ada, semua card sudah punya jeda ≥1.5 detik sebelum Act
  pindah, jadi kemungkinan besar aman, tapi baiknya dicek visual.

### Yang TIDAK Diubah

- Semua `popIn()` card/badge (posisi, warna, timing, easing) — tetap
  sama persis.
- Semua `say()` lain yang bukan duplikat (kalimat transisi, pertanyaan
  hook, dsb) — tetap sama persis.
- Konten (`data.js`) — tidak ada teks yang dihapus dari data, cuma
  pemanggilan `say()` di `Animation.jsx` yang dikurangi.

## Opsi Lain (didiskusikan, tidak dipilih untuk plan ini)

- **Opsi B** — caption atas selalu pegang narasi utama; card on-canvas
  dibatasi cuma 1 momen puncak per Act, ditaruh di posisi Y yang SAMA
  tiap Act (bukan lompat-lompat 270/330/380/400/420/440/460/510/570/655
  seperti sekarang), isi card dipersingkat jadi tagline (bukan kalimat
  penuh ulang dari caption).
- **Opsi C** — card on-canvas diubah jadi murni visual (ikon + 1-3 kata
  kunci), bukan kalimat panjang; caption atas tetap pegang kalimat
  lengkap.

Opsi B/C butuh desain ulang layout & rewrite sebagian teks di `data.js`
— lebih besar scope-nya dibanding Opsi A. Bisa dikerjakan menyusul kalau
Opsi A ternyata belum cukup setelah dicoba.

## Yang Perlu Dicek Setelah Eksekusi (nanti, belum sekarang)

- Preview visual: pastikan gak ada momen "caption kosong dari awal"
  (karena `caption` state awal `''`, tapi ini sudah ada dari sebelum
  perubahan ini, bukan efek baru).
- Preview visual: rasain apakah jeda diam caption di Act 3 (±6 detik)
  kerasa kelamaan atau masih wajar.
- Export audio/video: SFX yang nempel di `say()` — dicek dulu, `say()`
  di kode ini TIDAK memicu SFX apa pun (SFX nempel di `popIn`/`sfxOn`
  terpisah), jadi menghapus baris `say()` dipastikan **tidak** mengubah
  timing/isi SFX sama sekali.

**Status: masih rencana, nunggu konfirmasi user sebelum mulai edit
`Animation.jsx`.**
