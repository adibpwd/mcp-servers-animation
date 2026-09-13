# Revisi-04: Fix Root Cause — Konten Kosong, Intro/Header Tidak Sesuai Standar

> **Status:** ⚙️ Implemented — build PASS (Vite transform 200, docker logs
> bersih dari error/fail).
> Menunggu preview manual & export sebelum `ready`.
>
> **Tanggal:** 2026-09-13
>
> Ditemukan lewat perbandingan langsung source component scene-ui V1 dengan
> topic referensi `23-https-tls` (sudah dikonfirmasi sesuai standar). Bug
> yang ditemukan jauh lebih parah dari revisi-02/03 — ini akar masalah
> kenapa laporan user "konten ga muncul apa2, intro dan header ga sesuai"
> terjadi.

## 1. Root Cause yang Ditemukan

### Bug #1 — KRITIKAL: Body content permanen invisible
`Animation.jsx` lama membungkus `<ContentBodyV1>` dengan
`<g transform={T('contentBody',0,0)} opacity={O('contentBody')}>`. Tidak ada
satupun `popIn('contentBody', ...)` di timeline yang mengaktifkannya. Default
helper `P(id) = {scale:0, opacity:0}` → seluruh body (semua kartu, semua Act)
permanen `scale(0)` + `opacity:0` selamanya. Referensi `23-https-tls` render
`<ContentBodyV1>` langsung tanpa wrapper ini, sesuai kontrak
`02-topic-contract-scene-shell.md`. Ini penyebab utama "konten ga muncul
apa2".


### Bug #2 — Intro header tidak fade, langsung "loncat"
CORS lama pakai `{contentStarted && (<g opacity={headerOpacity}>...)}`. Tapi
`contentStarted` baru jadi `true` PERSIS setelah tween `headerOpacity`
selesai (sudah = 1). Jadi header baru dirender saat opacity-nya sudah penuh
— animasi fade morph hero→header tidak pernah kelihatan, header cuma
"muncul tiba-tiba". Referensi (`23-https-tls`) pakai
`{headerOpacity > 0 && (...)}` — fade jalan dari awal.

### Bug #3 — Koordinat Y banyak yang keluar canvas
`data.js` lama pakai range 0–1340 untuk COORDS local (CAPTION_Y=1320,
RESPONS_Y=1240, dst), padahal `ContentBodyV1` origin sudah di `body.y=235`
dan `body.height=965` (lihat `DEFAULT_LAYOUT_V1`). Jadi canvas Y aktual =
`body.y + local` → RESPONS_Y jadi canvas 1475, CAPTION_Y jadi canvas 1555 —
jauh di luar viewBox `0 0 820 1340`. Referensi (`23-https-tls`) selalu
simpan local Y dalam range aman (≈70–640) dengan komen eksplisit
"canvas asli". Bahkan kalau Bug #1 diperbaiki, caption bar dan kartu
respons TETAP tidak akan pernah terlihat karena posisinya di luar frame.

### Bug #4 — Kartu "actual request" tidak pernah dirender
`popIn('actualCard', ...)` dan `popIn('actualGoCard', ...)` dipanggil di
timeline (dengan SFX), tapi tidak ada blok JSX yang render kartu ini sama
sekali — beat penting "request asli ditahan / berangkat" di Act 2 & 4 sama
sekali tidak punya visual.

### Bug #5 — minor: dead prop & dead code
Prop `color` dikirim ke `ActBadgeNavigatorV1` padahal komponen ini tidak
punya prop itu (dia pakai `phases[i].badgeColor`) — dead prop, tidak sesuai
kontrak di `ActBadgeNavigatorV1.jsx`. Helper `OriginCard` didefinisikan
tapi tidak pernah dipakai (dead code).

## 2. Perbaikan yang Dilakukan

1. **`data.js`** — koordinat local (`APP_Y`, `RESPONS_Y`, `CLOSING_Y`,
   `GATE_Y`, `ACTUAL_X`/`ACTUAL_Y`, `PREFLIGHT_Y`, `API_Y`, `POLICY_Y`,
   `CAPTION_Y`) dirancang ulang seluruhnya supaya tetap dalam range local
   0–965 (body height). Tambah `ACTUAL_X`/`ACTUAL_Y`, `METHOD_POST`,
   `AUTH_LABEL` sebagai konstanta yang dibutuhkan kartu actual request.
2. **`Animation.jsx`** — import `ACTUAL_X`, `ACTUAL_Y`, `METHOD_POST`,
   `AUTH_LABEL` ditambahkan; `CAPTION_Y` yang sekarang benar dipakai untuk
   caption box (ganti `CLOSING_Y+130` lama).
3. **`Animation.jsx`** — wrapper `contentBody` (`T('contentBody',0,0)` +
   `O('contentBody')`) dihapus; `ContentBodyV1` sekarang dirender langsung,
   sama seperti referensi `23-https-tls`.
4. **`Animation.jsx`** — tambah render block `actualCard` (ditahan di gate,
   warna DENY, dash border) dan `actualGoCard` (berangkat setelah izin
   cocok, warna ALLOW, solid border), tepat setelah kartu preflight.
5. **`Animation.jsx`** — header fade diganti dari
   `{contentStarted && (<g opacity={headerOpacity}>...)}` menjadi
   `{headerOpacity > 0 && (...)}` sehingga fade morph hero→header benar-benar
   terlihat jalan.
6. **`Animation.jsx`** — prop `color` yang tidak valid dihapus dari
   pemanggilan `ActBadgeNavigatorV1`.
7. **`Animation.jsx`** — helper `OriginCard` (dead code, tidak pernah
   dipakai) dihapus.

## 3. Validasi

- `curl -s -o /dev/null -w "%{http_code}"` ke
  `/src/content/24-cors/Animation.jsx` via dev server (port 3373) →
  **200** (Vite transform bersih, tidak ada syntax/import error).
- `docker compose logs --tail=40 app | grep -iE "error|fail"` → **kosong**,
  tidak ada error/fail baru di log container.
- Tidak mengubah kontrak `CAPTIONS` key (sudah benar dari revisi-03),
  `SFX_MAP`, atau storyboard Act — risiko regresi terbatas pada layout
  koordinat & struktur render body.

## 4. Yang Masih Belum Selesai (di luar scope revisi ini)

- [ ] Preview manual `npm run dev` satu loop penuh (visual + audio) — perlu
  mata/telinga manusia untuk konfirmasi tidak ada kartu yang saling
  bertumpuk (collision) di koordinat baru.
- [ ] Export audio final / export MP4.
- [ ] Audit visual formal untuk no-teleport, collision, dead field (checklist
  `_docs/CORS_PLAN.md` §5 masih `[ ]` untuk item ini).
- [ ] Approval eksplisit dari pemilik project atas perbaikan root cause ini
  (saat ini implisit lewat eksekusi, bukan sign-off formal).

Item-item ini butuh keterlibatan manusia langsung (menonton animasi di
browser, mendengarkan audio, menjalankan export) sehingga tidak dieksekusi
otomatis dalam revisi ini.
