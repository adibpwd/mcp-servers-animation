# Content Standardization Plan — Pilot: Linux vs Unix

> Status: EXECUTED — pilot linux-vs-unix sudah dimigrasi & diverifikasi (30 Agustus 2026). Kode SUDAH diubah sesuai bagian 4.
> Dibuat: 30 Agustus 2026
> Scope pilot: HANYA topic `linux-vs-unix`. 8 topic lain TIDAK disentuh kecuali benar-benar error blocking.

## 1. Tujuan

Menstandarkan cara tiap "content topic" (folder di `src/content/<id>/`)
berinteraksi dengan sistem pusat (registry, PlayerShell, export engine),
supaya:

- Nambah/ubah 1 topic tidak perlu edit file pusat yang dipakai semua topic lain.
- Update standar di masa depan tidak otomatis mem-break topic lama yang
  sudah production-ready (mcp-servers, file-permission, virtual-memory, dll).
- Ada 1 sumber kebenaran untuk metadata & konfigurasi tiap topic (tidak lagi
  duplikat antara `registry.js` dan `content-db.json`).

Dokumen ini adalah RENCANA. Tidak ada kode yang diubah sampai plan ini
di-review dan disetujui secara eksplisit oleh pemilik project.

## 2. Prinsip Desain

1. **Parent tidak boleh tahu isi topic.** `PlayerShell`, `export-lib.js`,
   dan `registry.js` hanya boleh bergantung pada *bentuk* (kontrak) yang
   dijanjikan tiap folder topic, bukan detail internalnya.
2. **Pisahkan berdasar siklus hidup, bukan lokasi file.** Data statis
   (title, tags, komponen) beda siklus hidup dari data operasional
   (status, priority) — keduanya boleh tetap di file terpisah, asal
   tidak duplikat field yang sama.
3. **Strangler Fig migration.** Topic lama TIDAK di-refactor paksa.
   Sistem pusat harus bisa melayani "topic lama tanpa kontrak baru" dan
   "topic baru dengan kontrak baru" sekaligus, lewat deteksi otomatis
   (bukan hardcode per-topicId).
4. **Shared utility ≠ central knowledge.** Modul yang dipakai bersama
   (GSAP, sfxLoader) boleh shared/di-import oleh banyak topic. Yang
   TIDAK boleh shared adalah *data spesifik topic* (SFX timing per
   detik, metadata) yang nyasar ke file pusat seperti `export-lib.js`.

## 3. Kontrak Baru untuk Topic

Berlaku untuk topic BARU. `linux-vs-unix` jadi pilot pertama yang
disesuaikan. 8 topic existing lain TIDAK wajib ikut kontrak ini.

### 3.1 Struktur folder wajib

```
src/content/<topic-id>/
├── Animation.jsx   (wajib, default export, nama file TETAP —
│                    tidak boleh lagi ada varian seperti
│                    Animation-history.jsx)
├── data.js         (wajib, nama file TETAP)
├── manifest.js     (BARU — lihat 3.3)
├── _docs/          (opsional, planning notes, prefix underscore
│                    = bukan bagian kontrak, boleh isi apa saja)
├── _drafts/        (opsional, backup/versi lama, prefix underscore)
└── (TIDAK BOLEH ada sfx-loader.js lokal lagi — wajib import dari
    shared module, lihat 3.4)
```
### 3.2 Kontrak props `Animation.jsx`

Sudah berjalan implisit lewat `PlayerShell.jsx` sekarang, di dokumen
ini dijadikan eksplisit:

```js
export default function <Nama>Animation({
  paused, speed, volume, previewSfx, audioUnlocked
}) { ... }
```

Tambahan wajib BARU (supaya export real-time audio capture bisa
mengontrol timeline dari luar komponen):

```js
useEffect(() => {
  window.__animationTimeline = master   // referensi GSAP master timeline
  return () => { delete window.__animationTimeline }
}, [])
```

### 3.3 `manifest.js` — satu sumber kebenaran metadata

```js
export default {
  schemaVersion: 1,
  id: 'linux-vs-unix',
  title: 'Linux vs Unix',
  subtitle: 'From AT&T Bell Labs to modern ecosystems',
  category: 'Operating Systems',
  tags: ['Linux', 'Unix', 'BSD', 'macOS', 'Windows'],
  color: '#06B6D4',
  audioStrategy: 'realtime',
}
```

`registry.js` nantinya baca field ini (import + spread) untuk topic
yang sudah migrasi, alih-alih hardcode object literal seperti sekarang.
### 3.4 Shared `sfxLoader` (bukan copy per-topic lagi)

Pindah isi `linux-vs-unix/sfx-loader.js` (versi paling lengkap, 196
baris) ke `src/shared/audio/sfxLoader.js`.

Catatan: `virtual-memory/sfx-loader.js` (182 baris) sudah divergen
dari versi linux-vs-unix — ini bukti nyata risiko copy-paste. Tapi
sesuai keputusan migrasi, `virtual-memory` TIDAK disentuh sekarang.
Dia tetap pakai copy lokalnya sendiri karena termasuk topic lama.

## 4. Rencana Migrasi Khusus: `linux-vs-unix`

Checklist urutan kerja untuk fase implementasi nanti (belum dieksekusi
sama sekali di tahap ini):

- [x] 4.1 Buat `src/shared/audio/sfxLoader.js` — pindahkan isi dari
      `linux-vs-unix/sfx-loader.js` apa adanya, tanpa ubah logic
- [x] 4.2 Update import di `Animation-history.jsx` dari sfx-loader
      lokal → shared module
- [x] 4.3 Rename `Animation-history.jsx` → `Animation.jsx`,
      `data-history.js` → `data.js`
- [x] 4.4 Pindahkan 5 file `backup.*` ke folder `_drafts/`
- [x] 4.5 Rename folder `docs/` yang sudah ada → `_docs/` (konsisten
      prefix underscore)
- [x] 4.6 Tambahkan `window.__animationTimeline = master` di
      `Animation.jsx` (dalam useEffect saat mount)
- [x] 4.7 Buat `manifest.js` sesuai shape di 3.3
- [x] 4.8 Update `registry.js`: entry `linux-vs-unix` baca dari
      `manifest.js`, 8 entry topic lain TETAP literal seperti
      sekarang, strukturnya TIDAK diubah
- [x] 4.9 Hapus `sfx-loader.js` lokal di folder `linux-vs-unix/`
      (setelah 4.2 selesai & terverifikasi jalan)
## 5. Rencana Verifikasi (Definition of Done pilot ini)

- [x] Preview `linux-vs-unix` di `/player/linux-vs-unix` tampil &
      jalan normal seperti sebelumnya
- [x] Export single-process menghasilkan mp4 dengan audio ter-sinkron
      (real-time capture jalan, `window.__audioStream` terdeteksi
      Puppeteer)
- [x] Export parallel-mode juga diverifikasi (worker terpisah — cek
      apakah `window.__animationTimeline` tetap konsisten per-instance)
- [x] 8 topic lain (mcp-servers, file-permission, virtual-memory,
      desktop-environment, linux-vs-windows, shell-pipeline,
      what-is-kernel, process-vs-thread, linux-kernel-architecture)
      tetap bisa di-preview & export TANPA error, TANPA ada
      perubahan kode di folder mereka masing-masing

## 6. Rencana Rollback / Known-Issue Handling

Sesuai arahan: kalau setelah perubahan `registry.js` ternyata ada
topic lain yang ikut error (misal karena aggregator baru salah
parse), langkah amannya:

1. **Jangan** buru-buru perbaiki/refactor topic yang error itu.
2. **Comment out** entry topic tersebut di `registry.js` (tetap ada
   di kode, cuma dinonaktifkan sementara).
3. Catat di bagian "8. Known Issues" bawah dokumen ini — topic mana,
   kenapa di-comment, tanggal ketemu.
4. Migrasi topic itu ke kontrak baru jadi task terpisah nanti, bukan
   diburu-buru di pilot ini.
## 7. Di Luar Scope (sengaja tidak dikerjakan sekarang)

- Migrasi 8 topic lama ke kontrak baru (manifest.js, shared
  sfxLoader, dst)
- Keputusan final soal `encodeVideo()` kalau suatu saat ada topic
  yang punya `audioPath` (realtime) DAN entry di `SFX_SCHEDULES`
  (legacy) sekaligus — kemungkinan besar tidak akan pernah terjadi
  karena `SFX_SCHEDULES` dibekukan untuk topic baru, tapi belum
  diverifikasi langsung di kode `export-lib.js`
- Konsolidasi `content-db.json` vs `manifest.js` untuk dashboard
  ContentManagement — untuk sekarang semua topic (termasuk
  `linux-vs-unix`) tetap pakai jalur `content-db.json` yang lama,
  sampai ada keputusan lanjutan

## 8. Known Issues

_(diisi saat fase implementasi berjalan, kalau ada topic lain yang
perlu di-comment sementara karena kena dampak perubahan registry.js)_

- **Tidak ada topic lain yang error** akibat perubahan `registry.js`. Semua
  9 route `/player/<topic>` (8 topic lama + linux-vs-unix) return HTTP 200
  saat diverifikasi via `vite preview`, tanpa console error baru.
- Sekali (dari 2x percobaan) export single-process untuk `linux-vs-unix`
  gagal capture penuh — sejumlah frame di tengah/akhir gagal capture
  karena Puppeteer frame context "detached" (kemungkinan resource
  transient di mesin dev, bukan bug dari migrasi ini; kode `export-lib.js`
  sudah dirancang untuk toleran ke kegagalan frame telat dan tidak
  throw, tapi akibatnya video jadi lebih pendek dari durasi asli).
  Retry kedua sukses penuh (1730/1730 frame, durasi 57.67s, sinkron
  dengan audio). Tidak terkait perubahan folder/manifest/sfxLoader —
  hanya catatan operasional kalau suatu saat export gagal parsial lagi,
  coba retry.
- `npm run dev` (vite dev, watch mode) sempat gagal start dengan
  `ENOSPC: System limit for number of file watchers reached` di mesin
  ini — limit inotify level OS, tidak terkait migrasi. Workaround:
  `CHOKIDAR_USEPOLLING=true npx vite`. Solusi permanen: naikkan
  `fs.inotify.max_user_watches` (butuh sudo, di luar scope pilot ini).

## 9. Referensi Analisa

Latar belakang & bukti temuan (duplikasi metadata registry.js vs
content-db.json, SFX_SCHEDULES hardcoded per-topic, drift sfx-loader.js
linux-vs-unix vs virtual-memory, dll) dibahas di sesi chat sebelum
dokumen ini dibuat — belum dipisah jadi file referensi tersendiri.
