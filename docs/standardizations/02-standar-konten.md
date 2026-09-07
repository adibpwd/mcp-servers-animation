# 02 — Standar Konten: Kontrak Folder Topic

> Alur baca lengkap: `01-architecture` → **`02-standar-konten`** → `03-tutorial-buat-topic-baru` → `04-referensi-gsap` → `05-svg-text-guide` → `06-icon-generation` → `08-audio-sfx-generation`

Dokumen ini mendefinisikan kontrak antara 1 folder topic (`src/content/<topic-id>/`)
dengan sistem pusat (`registry.js`, `PlayerShell`, export engine). Baca ini
sebelum mulai `03-tutorial-buat-topic-baru.md`.

## 1. Kenapa Ada Kontrak Ini

- Nambah/ubah 1 topic tidak boleh perlu edit file pusat yang dipakai semua topic lain.
- Update standar di masa depan tidak boleh otomatis mem-break topic lama yang sudah production-ready.
- 1 sumber kebenaran untuk metadata tiap topic (tidak duplikat antara `registry.js` dan `content-db.json`).

## 2. Prinsip Desain

1. **Parent tidak boleh tahu isi topic.** `PlayerShell`, `export-lib.js`, `registry.js`
   hanya boleh bergantung pada *bentuk* (kontrak) yang dijanjikan tiap folder topic,
   bukan detail internalnya.
2. **Pisahkan berdasar siklus hidup, bukan lokasi file.** Data statis (title, tags,
   komponen) beda siklus hidup dari data operasional (status, priority) — boleh
   tetap di file terpisah, asal tidak duplikat field yang sama.
3. **Strangler Fig migration.** Topic lama TIDAK di-refactor paksa. Sistem pusat
   harus bisa melayani "topic lama tanpa kontrak baru" dan "topic baru dengan
   kontrak baru" sekaligus, lewat deteksi otomatis (bukan hardcode per-topicId).
4. **Shared utility ≠ central knowledge.** Modul yang dipakai bersama (GSAP,
   sfxLoader) boleh di-import banyak topic. Yang TIDAK boleh shared adalah
   *data spesifik topic* (timing SFX per detik, metadata) yang nyasar ke file
   pusat seperti `export-lib.js`.

## 3. Struktur Folder Wajib (Topic Baru)

```
src/content/<topic-id>/
├── Animation.jsx   (wajib, default export, nama file TETAP —
│                    jangan bikin varian seperti Animation-history.jsx)
├── data.js         (wajib, nama file TETAP — VW, VH, PHASES, dst)
├── manifest.js     (wajib — lihat 4)
├── caption.md      (opsional, lihat catatan di bawah)
├── _docs/          (opsional, planning notes, prefix underscore
│                    = bukan bagian kontrak, boleh isi apa saja)
├── _drafts/        (opsional, backup/versi lama, prefix underscore)
├── revisi/         (opsional, catatan perbaikan/perubahan pasca rilis
│                    awal — lihat catatan di bawah)
└── (TIDAK BOLEH ada sfx-loader.js lokal lagi — wajib import dari
    shared module, lihat 5)
```

**Folder `revisi/` (opsional)** — dipakai untuk mencatat perbaikan/
perubahan yang terjadi SETELAH topic sudah dianggap selesai/production-
ready (beda dari `_docs/` yang isinya planning SEBELUM topic jadi).
Konvensi: 1 file `README.md` sebagai index status ringkas (daftar
perubahan apa saja yang pernah terjadi & statusnya), plus file
per-perbaikan dengan nama berformat `YYYY-MM-DD-HHMM-revisi-NN.md` untuk
perbaikan yang butuh detail lebih panjang (audit, checklist eksekusi,
opsi yang dipertimbangkan). Tidak wajib dipakai untuk topic yang tidak
butuh — kalau perbaikan cukup dicatat singkat di commit message, tidak
perlu bikin folder ini.

Contoh topic yang sudah mengikuti kontrak ini: `src/content/linux-vs-unix/`.
8 topic lain (mcp-servers, file-permission, virtual-memory, dst) masih
struktur lama — itu OK, TIDAK wajib dimigrasi kecuali benar-benar error
blocking. Jangan sentuh folder topic lama saat kerjakan topic baru.

**`caption.md` (opsional)** — caption media sosial untuk posting video ini
(hook + ringkasan cerita + CTA + hashtag), TERPISAH dari `data.js` (yang
isinya teks in-video seperti caption bar & badge). Bukan transkrip video —
gaya penulisannya pendek, hook-driven, boleh pakai emoji (beda dari
kebijakan no-emoji untuk visual in-video, lihat
`03-tutorial-buat-topic-baru.md` bagian "Wording Ringkas & Tanpa Emoji").
Belum standar wajib (baru dipakai di sebagian topic) — kalau mau dibuat,
ikuti pola & contoh nyata di `src/content/linux-vs-unix/caption.md`.

## 4. Kontrak Props `Animation.jsx`

```js
export default function <Nama>Animation({
  paused, speed, volume, previewSfx, audioUnlocked
}) { ... }
```

Wajib expose referensi timeline ke `window` supaya export real-time audio
capture & timeline controls (PREV/NEXT) bisa mengontrol dari luar komponen:

```js
useEffect(() => {
  window.__animationTimeline = master
  return () => { delete window.__animationTimeline }
}, [])
```

## 5. `manifest.js` — Satu Sumber Kebenaran Metadata

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

`registry.js` membaca field ini (import + spread) untuk topic yang sudah
migrasi, alih-alih hardcode object literal seperti topic lama.

## 6. Komponen Global (Shared) vs Independent (Per-Topic)

Ini yang paling sering bikin bingung waktu bikin topic baru — kapan pakai
yang sudah ada di pusat, kapan bikin punya sendiri di folder topic.

### 6.1 Global / Shared — jangan taruh logic spesifik topic di sini

| Lokasi | Isi | Contoh |
|---|---|---|
| `src/components/` | UI shell yang dipakai SEMUA topic — player, progress bar, list konten | `PlayerShell.jsx`, `TimelineProgressBar.jsx`, `ContentCard.jsx`, `SettingsModal.jsx` |
| `src/shared/` | Utility murni yang aman diimport banyak topic sekaligus, sudah stabil | `audio/sfxLoader.js`, `GlowDot.js` |

Cara pakai — tinggal import, tidak perlu copy-paste isinya:
```js
import { loadSfx } from '../../shared/audio/sfxLoader'
```

### 6.2 Independent / Per-Topic — spesifik ke 1 topic, jangan di-share

| Lokasi | Isi |
|---|---|
| `src/content/<topic-id>/Animation.jsx` | Timeline & render, wajib ada per topic |
| `src/content/<topic-id>/data.js` | Konstanta lokal (VW, VH, PHASES, warna khusus topic ini) |
| `src/content/<topic-id>/manifest.js` | Metadata topic ini |
| `src/content/<topic-id>/animation-helpers.js` (opsional) | Helper murni untuk 1 topic saja, contoh: `virtual-memory/animation-helpers.js` |

### 6.3 Aturan Pindah Independent → Shared

Kalau sebuah modul awalnya lokal di 1 topic, boleh dipindah ke `src/shared/`
HANYA kalau:
1. Sudah dipakai ≥ 2 topic, DAN
2. Isinya sudah stabil (bukan lagi sering berubah tiap eksperimen).

Kalau belum memenuhi 2 syarat itu, biarkan lokal dulu — lebih baik ada
sedikit duplikasi antar topic daripada 1 topic baru accidentally mem-break
topic lain karena share modul yang belum matang. Contoh nyata: sebelum
migrasi, `linux-vs-unix/sfx-loader.js` dan `virtual-memory/sfx-loader.js`
sudah divergen (196 baris vs 182 baris) karena copy-paste tanpa disiplin
ini — versi linux-vs-unix (paling lengkap) yang akhirnya dipindah jadi
`src/shared/audio/sfxLoader.js`, sedangkan `virtual-memory` tetap pakai
copy lokalnya karena termasuk topic lama yang tidak disentuh.

## 7. Checklist Verifikasi Topic Baru

- [ ] Folder ikuti struktur di bagian 3 (`Animation.jsx`, `data.js`, `manifest.js`)
- [ ] `window.__animationTimeline = master` ada di `useEffect` mount, di-cleanup saat unmount
- [ ] `manifest.js` lengkap sesuai shape bagian 5
- [ ] `registry.js` baca dari `manifest.js` (bukan hardcode literal baru)
- [ ] Tidak ada `sfx-loader.js` lokal — pakai `src/shared/audio/sfxLoader.js`
- [ ] Preview `/player/<topic-id>` jalan normal
- [ ] Export single-process menghasilkan mp4 dengan audio sinkron
- [ ] Topic lain (yang sudah ada) tetap bisa di-preview & export tanpa error,
      tanpa ada perubahan kode di folder mereka masing-masing

## 8. Catatan Operasional

- Kalau setelah perubahan `registry.js` ada topic lain yang ikut error
  (misal aggregator baru salah parse): **jangan** buru-buru refactor topic
  itu. Comment out saja entry-nya di `registry.js` (tetap ada di kode, cuma
  nonaktif sementara), lalu migrasi topic itu jadi task terpisah nanti.
- Export single-process kadang gagal capture frame di tengah/akhir karena
  Puppeteer frame context "detached" (biasanya resource transient di mesin
  dev, bukan bug). `export-lib.js` sudah toleran ke kegagalan frame telat
  (tidak throw), tapi video jadi lebih pendek dari durasi asli. Retry
  biasanya langsung sukses penuh.
- Kalau `npm run dev` gagal start dengan `ENOSPC: System limit for number
  of file watchers reached` — itu limit inotify level OS, bukan bug project.
  Workaround cepat: `CHOKIDAR_USEPOLLING=true npx vite`. Solusi permanen:
  naikkan `fs.inotify.max_user_watches` (butuh sudo).

## 9. Di Luar Scope Kontrak Ini

- Migrasi paksa 8 topic lama ke kontrak baru (manifest.js, shared
  sfxLoader, dst) — biarkan strangler fig alami, jangan diburu-buru.
- Konsolidasi `content-db.json` vs `manifest.js` untuk dashboard
  ContentManagement — untuk sekarang semua topic (termasuk yang sudah
  migrasi) tetap pakai jalur `content-db.json` lama.
