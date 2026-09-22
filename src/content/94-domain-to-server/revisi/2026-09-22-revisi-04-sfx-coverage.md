# Plan Revisi 04 — Perbanyak SFX (Appear/Disappear/Movement Coverage)

**Tanggal:** 2026-09-22
**Target Content:** `94-domain-to-server`
**Status:** 🚧 IN PROGRESS (Dieksekusi 2026-09-22, esbuild + export-lib.js lolos; preview/dengar manual belum)
**Permintaan:** User merasa audio terlalu sepi — minta setiap
action/gerakan/muncul/hilang dikasih SFX.

---

## 1. Audit: titik yang masih sepi

Audit `Animation.jsx` menemukan pola: `popIn(..., null)` untuk beberapa
actor, beberapa gerakan tanpa `playSfx` sama sekali, dan SEMUA blok
cleanup/disappear tanpa suara:

| # | Momen | Kondisi sekarang |
|---|---|---|
| 1 | Act1 — DNS icon muncul | `popIn(..., null)` — sepi |
| 2 | Act2 — browser mulai loading | `popIn(..., null)` — sepi |
| 3 | Act3 — Backend A muncul | `popIn(..., null)` — sepi |
| 4 | Act3 — Backend B muncul | `popIn(..., null)` — sepi |
| 5 | Act3.2 — request packet muncul lagi di Proxy | tanpa `playSfx` sama sekali |
| 6 | Act4 — browser mulai loading (lagi) | `popIn(..., null)` — sepi |
| 7 | Act4.3→4.4 — response transit lewat Proxy | tanpa `playSfx`, ~1.8s senyap |
| 8 | Act4.4→4.5 — response transit lewat Edge | tanpa `playSfx`, ~1.8s senyap |
| 9 | Cleanup Act1 (domain/IP chip hilang) | tanpa `playSfx` |
| 10 | Cleanup Act2 (edge nonaktif) | tanpa `playSfx` |
| 11 | Cleanup Act3 (proxy nonaktif + routing beam hilang) | tanpa `playSfx` |
| 12 | Reset akhir loop (SEMUA elemen hilang bersamaan) | tanpa `playSfx` — paling senyap |

`popOut` helper sudah ada di file tapi tidak pernah dipakai (dead code) —
semua cleanup pakai `setXVisible(false)` inline tanpa opsi sfx.

## 2. Rencana

Tambah 5 SFX_MAP key baru di `data.js` (semua sudah dicek ada filenya di
`public/audio/`):

```js
POP_OUT:    { category: 'transitions', name: 'teleport' }        // disappear
BOUNCE:     { category: 'ui', name: 'bounce' }                    // appear varian, biar ga monoton 'POP' terus
TICK:       { category: 'ui', name: 'tick' }                      // toggle kecil (loading mulai, deactivate)
HOP:        { category: 'transitions', name: 'light-swoosh-quick' } // transit lewat relay point
WHOOSH_LOW: { category: 'transitions', name: 'whoosh-low' }       // reset akhir loop, beda dari WHOOSH pembuka Act
```

Mapping ke 12 titik di atas — SATU sfx per momen/callback (bukan tumpuk
banyak sfx di waktu yang sama persis, supaya tidak jadi berisik/mumbling):

1→BOUNCE, 2→TICK, 3→BOUNCE, 4→BOUNCE, 5→PACKET_SEND (reuse, packet
bergerak lagi = makna sama dengan saat pertama muncul di Act2),
6→TICK, 7→HOP (sisip `master.add` baru pas response nyampe proxy),
8→HOP (sisip `master.add` baru pas response nyampe edge), 9→POP_OUT,
10→TICK, 11→POP_OUT (mewakili proxy+beam sekaligus, 1 sfx per momen),
12→WHOOSH_LOW.

## 3. Verifikasi

- esbuild compile check setelah edit.
- Tidak ada 2 `playSfx()` di `master.add` callback yang sama (hindari
  numpuk suara di 1 waktu persis).
- SFX_SCHEDULES di `scripts/export-lib.js` perlu disinkronkan ulang
  (timestamp tidak berubah karena tidak ada perubahan durasi timeline,
  cuma nambah entry SFX baru di waktu yang sudah ada / titik baru).

## 4. Status

- [x] `data.js` — 5 SFX_MAP key baru ditambah (POP_OUT, BOUNCE, TICK,
      HOP, WHOOSH_LOW), semua file-nya sudah dicek ada di `public/audio/`.
- [x] `Animation.jsx` — semua 12 titik di §1 diisi. `popOut` helper masih
      tidak dipakai (semua cleanup tetap inline multi-state, satu
      `playSfx` per callback) — dead code itu dibiarkan, bukan scope
      revisi ini.
- [x] esbuild compile check — lolos.
- [x] `scripts/export-lib.js` `SFX_SCHEDULES['domain-to-server']` ditulis
      ulang PENUH (bukan cuma ditambah) — timestamp lama sudah basi sejak
      revisi-03 memangkas `morphDur` 1.8s→0.8s (semua waktu geser -1.0s),
      jadi sekalian dihitung ulang dari 0 + entry baru revisi-04
      disisipkan di titik yang tepat. `node --check` lolos.
- [ ] Dengar manual (preview/export) — belum bisa dari sesi ini, perlu
      browser/dev server. Yang paling perlu dicek telinga manusia: apakah
      2 sfx `BOUNCE` di Act3 (backend A 16.9s, backend B 17.0s, cuma
      beda 0.1s) kedengaran numpuk/berisik atau masih enak didengar
      terpisah.

## 6. Bug kritis ditemukan setelah revisi ini: SUARA TIDAK PERNAH BUNYI SAMA SEKALI (2026-09-22)

User melapor "kok ilang ya suara di content 94 ini?" — audit lanjutan
menemukan **2 bug independen** yang membuat SEMUA sfx (bukan cuma yang
baru ditambah revisi-04, tapi dari awal file ini dibuat) tidak pernah
bunyi sama sekali, terlepas dari isi `SFX_MAP`:

1. **`previewSfx`/`audioUnlocked` tidak punya default value** di
   destructuring props `DomainToServerAnimation({ paused, speed, volume,
   previewSfx, audioUnlocked })`. Kalau parent/player tidak eksplisit
   ngirim prop `previewSfx`, nilainya `undefined` → `playSfx()` selalu
   early-return. Dibandingkan dengan `44-ssh/Animation.jsx` yang punya
   `previewSfx = true, audioUnlocked = false` — topic 94 kelewatan ini
   dari awal. **Fix:** tambah default sesuai pola 44-ssh.

2. **Stale closure — bug arsitektural yang sama persis dengan bug spawn
   posisi di revisi-03 §5**, tapi kena `playSfx` bukan posisi packet:
   GSAP master timeline dibangun sekali di `useEffect(() => {...}, [])`.
   Callback-callback di dalamnya (`master.add(() => playSfx('WHOOSH'),
   time)`) menangkap closure `playSfx` dari render PERTAMA — closure itu
   membaca `previewSfx`/`audioUnlocked` sebagai PROP MENTAH (bukan ref),
   jadi nilainya beku selamanya di kondisi render pertama. Karena
   `audioUnlocked` hampir selalu `false` saat mount (baru jadi `true`
   setelah user klik — kebijakan autoplay browser), dan mount terjadi
   SEBELUM klik itu, maka `playSfx` yang dipanggil sepanjang animasi
   selamanya melihat `audioUnlocked=false` walau prop aslinya sudah jadi
   `true` — makanya suara "hilang" bukan cuma di menit-menit awal, tapi
   permanen. **Fix:** tambah `previewSfxRef`/`audioUnlockedRef` (pola
   yang sudah ada untuk `volumeRef`/`speedRef` di file yang sama), sync
   lewat `useEffect`, dan `playSfx` baca dari `.current` ref, bukan prop
   langsung — persis pola `audioUnlockedRef` yang dipakai `44-ssh`.

**Temuan tambahan (dibersihkan sekalian):** import `sfxLoader` dari
`shared/audio/sfxLoader` di baris atas file ternyata dead import — tidak
pernah dipakai (topic 94 punya `playSfx` sendiri pakai `new Audio()`
langsung, BUKAN memakai `sfxLoader` singleton seperti `44-ssh`). Dihapus
importnya saja; migrasi penuh ke `sfxLoader` singleton (pola yang lebih
robust, dipakai topic lebih baru) TIDAK dieksekusi — itu perubahan
arsitektural besar yang menyentuh puluhan `playSfx()` call site, di luar
scope laporan bug ini.

esbuild lolos setelah kedua fix + pembersihan import.
