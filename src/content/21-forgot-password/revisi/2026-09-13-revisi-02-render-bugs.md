# Revisi-02: Perbaikan Bug Render — 21-forgot-password

> **Status:** ✅ Semua 5 fix dieksekusi (2026-09-13). Preview manual
> (`npm run dev`) dan `vite build` belum dijalankan — lihat §5.
>
> **Tanggal:** 2026-09-13
>
> Revisi ini hanya menyentuh wiring state/import di `Animation.jsx` yang
> menyebabkan elemen tidak tampil atau crash. Story, caption text (kecuali
> §2.5), timeline timing, layout koordinat, dan aset audio tidak berubah.

## 1. Tujuan

Preview manual (`npm run dev`) menunjukkan dua masalah saat play:
1. Component crash total di semua Act (`FORM_LABEL is not defined`).
2. Setelah crash di-fix, intro header + title morph tidak pernah muncul
   sama sekali sepanjang animasi.

Ditemukan juga saat audit lanjutan bahwa dua elemen body (`gateCard` dan
`hashCard`) punya wiring id yang salah, dan satu caption key hilang dari
`data.js` (sudah di-flag di revisi-01 §7 sebagai out-of-scope, dieksekusi
di sini).

## 2. Audit dan Rencana Perbaikan

| # | Prioritas | Bug | Akar masalah | Rencana fix | Status |
|---|---|---|---|---|---|
| 2.1 | P0 (crash) | `Uncaught ReferenceError: FORM_LABEL is not defined` di `<ForgotPasswordAnimation>` | `FORM_LABEL` sudah diexport `data.js` tapi tidak ikut di-destructure pada import statement `Animation.jsx` | Tambahkan `FORM_LABEL` ke daftar named import dari `./data` | ✅ Dieksekusi |
| 2.2 | P0 (visual hilang total) | Intro header (`IntroHeaderMorphV1`) dan title morph tidak pernah terlihat di seluruh loop | Reset block timeline men-set `setHeaderOpacity(0)` dan tidak pernah men-set-nya kembali ke `1` di manapun — beda dari pola pilot `17-rest-api` yang men-set `setHeaderOpacity(1)` persis di reset block | Ubah `setHeaderOpacity(0)` → `setHeaderOpacity(1)` di reset block (menyamakan pola dengan pilot Scene UI V1) | ✅ Dieksekusi |
| 2.3 | P1 (elemen tidak pernah tampil) | Kartu `gateCard` (gerbang verifikasi token) opacity selalu `0` di sepanjang animasi | Tidak ada pemanggilan `popIn(tl, ..., 'gateCard', ...)` di manapun pada master timeline — `O('gateCard')` selalu membaca default `{opacity:0}` dari `P()` | Tambahkan `popIn(tl, act2End+0.3, 'gateCard', { sfx: false })` menyusul `tokenCard` di awal Act 3 | ✅ Dieksekusi |
| 2.4 | P1 (animasi tidak sinkron) | Grup `hashCard` (kartu token/hash) tidak pernah scale/translate masuk — hanya opacity yang berubah | `transform={T('hashCard', ...)}` memakai id `'hashCard'`, tapi `popIn` di timeline dan `opacity={O('tokenCard')}` memakai id `'tokenCard'` — dua id berbeda merujuk elemen yang sama, `pop['hashCard']` tidak pernah di-set sehingga `T('hashCard', ...)` selalu scale `0` | Samakan id: `T('hashCard', ...)` diganti `T('tokenCard', ...)` supaya konsisten dengan `O('tokenCard')` dan `popIn` yang sudah ada | ✅ Dieksekusi |
| 2.5 | P2 (caption kosong) | `say(tl, t3+0.35, CAPTIONS.TOKEN_DEPARTS)` merender caption box kosong (bukan crash, karena akses property undefined tidak throw) selama ~2.2s di Act 3 | `TOKEN_DEPARTS` dipanggil di `Animation.jsx` tapi key ini tidak pernah didefinisikan di `CAPTIONS` (`data.js`) — sudah di-flag revisi-01 §7 sebagai "out of scope audio-only, perlu revisi terpisah" | Tambahkan `TOKEN_DEPARTS: 'Token menuju gerbang'` ke `CAPTIONS` di `data.js` | ✅ Dieksekusi |

## 3. Urutan Eksekusi yang Direncanakan

1. ✅ 2.1 — fix import (blocker crash, sudah jalan).
2. ✅ 2.2 — fix headerOpacity (blocker visual utama, sudah jalan).
3. 2.5 — tambah caption key (paling ringan, murni data.js, tidak
   menyentuh timeline/animasi).
4. 2.3 dan 2.4 — perbaikan wiring `gateCard`/`hashCard`, dikerjakan
   sekaligus karena saling bersinggungan (satu region JSX yang sama,
   Act 3 token flow).

## 4. Validasi

- `vite build --logLevel warn` — exit 0, tanpa error, setelah tiap fix.
- Preview manual `npm run dev`: konfirmasi header morph terlihat sejak
  intro hingga akhir loop, badge Act + dot navigator berganti tiap Act,
  `gateCard` terlihat dengan status berubah (CEK COCOK → VALID) di Act 3,
  `hashCard` benar-benar scale-in (bukan cuma fade) saat token muncul,
  dan caption Act 3 tidak pernah kosong.
- Tidak ada perubahan pada `docs/standardizations/` — bug ini murni
  implementation bug di topic, bukan gap pada standar Scene UI V1 itu
  sendiri (component-nya sudah dipakai sesuai kontrak; wiring state di
  topic yang keliru).

## 5. Checklist

- [x] **Draft** — Audit ulang seluruh `Animation.jsx` untuk id/state yang
  dirujuk tapi tidak pernah di-set (root cause 2.1–2.4).
- [x] **Draft** — Fix P0 crash (`FORM_LABEL` import).
- [x] **Draft** — Fix P0 header hilang (`headerOpacity` reset value).
- [x] **Draft** — Fix P1 `gateCard` popIn wiring.
- [x] **Draft** — Fix P1 `hashCard`/`tokenCard` id mismatch.
- [x] **Draft** — Fix P2 `TOKEN_DEPARTS` caption key hilang.
- [ ] **Draft** — Preview manual full loop, konfirmasi kelima poin di §4.
- [ ] **Draft** — Update README revisi dengan hasil actual setelah eksekusi
  penuh.
