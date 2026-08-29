# Plan: Export Adjustment — Concurrent Audio+Frame Capture (Multiproses Efisien)

> Status: **ANALISIS / PLAN — belum dieksekusi.**
> Dibuat dari diskusi analisa arsitektur export pipeline (`scripts/export-parallel.mjs`, `scripts/export-server.mjs`, `src/components/PlayerShell.jsx`, `src/components/ProgressIndicator.jsx`).

## 1. Kondisi Sekarang (Baseline)

Export mode "parallel" saat ini adalah **sequential-pass**, bukan 1 proses barengan:

1. `detectDuration()` — buka 1 Chrome (`puppeteer.launch()`), baca `window.__animationTimeline.duration()`, tutup browser.
2. `captureAudio()` — buka Chrome **baru lagi** (browser terpisah), play timeline **real-time** sambil rekam via `MediaRecorder` → durasi tunggu = durasi animasi asli (video 60s → nunggu ~60s).
3. `captureSegment()` × N worker — **setelah** audio kelar, N Chrome dibuka **bareng** (`Promise.allSettled`), tiap worker `puppeteer.launch()` sendiri-sendiri, lalu seek frame-by-frame (`tl.totalTime(t, false)`) + screenshot via CDP.
4. `mergeSegments()` — gabung semua PNG dari tiap segment dir ke satu `framesDir`.
5. `encodeVideo()` — ffmpeg mux frame + audio jadi `.mp4`.

**Total waktu** = deteksi durasi + capture audio (real-time) + capture frame paralel + merge + encode. Audio dan frame capture **tidak saling bergantung secara data**, tapi dijalankan berurutan.

### Arsitektur proses saat ini
Setiap pemanggilan `launchBrowser()` (dipanggil terpisah di `detectDuration`, `captureAudio`, tiap `captureSegment`) = **satu `puppeteer.launch()` baru** = satu **browser process tree penuh**: browser main process + GPU process + network service process + disk cache + 1 renderer.

Dengan `workers = 8`: **9 browser process tree independen** (1 audio + 8 worker) berjalan bersamaan saat fase frame capture. Base overhead (browser-level, bukan renderer) ke-duplikasi 9×.

## 2. Bottleneck yang Diincar

Kalau durasi animasi 60s dan frame capture paralel cuma butuh ~15-20s (dengan 6-8 worker), audio capture (~60s, real-time, tidak bisa dipercepat) jadi **penentu utama total waktu** karena dijalankan sebelum frame capture, bukan bersamaan. Menggabungkan keduanya jadi konkuren berpotensi memotong ±(durasi frame capture) detik dari total waktu — audio dan frame numpuk waktunya, bukan ditambah.

## 3. Rencana Perubahan

### 3.1 Deteksi durasi tetap dipisah (disepakati)
`detectDuration()` tetap jadi step pertama yang berdiri sendiri, DIJALANKAN SEBELUM audio & frame capture. Alasan: baik audio capture maupun frame-splitting (`framesPerWorker = Math.ceil(totalFrames / workers)`) butuh `animDuration`/`totalFrames` yang **valid dan konsisten** sebelum kerjaan dibagi ke worker.

Alternatif "skip step ini, tiap browser deteksi durasi sendiri-sendiri" (agar truly paralel dari detik 0) **ditolak** — risikonya `tl.duration()` bisa tidak 100% deterministik antar page-load (ada `page.waitForFunction(... duration() > 0)` di kode yang mengindikasikan durasi butuh waktu buat stabil), sehingga worker bisa dapat `totalFrames` yang beda-beda → frame range antar worker tidak nyambung (gap/overlap) → video corrupt. Saving waktu dari opsi ini (~1-2 detik) tidak sepadan dengan risikonya.

### 3.2 Audio capture + semua worker frame capture berjalan KONKUREN
Setelah durasi diketahui, jalankan audio pass dan semua worker frame-capture **bersamaan** dalam satu `Promise.allSettled`, bukan berurutan:

```js
const audioPromise   = captureAudio(topicId, baseUrl, outDir, animDuration, onAudioProgress, onLog)
const workerPromises = workerRanges.map(w => captureSegment({ ...w, /* pakai context dari 3.3 */ }))
const [audioSettled, ...workerSettled] = await Promise.allSettled([audioPromise, ...workerPromises])
```

Video tanpa audio tetap valid (fallback sudah ada di kode: `audioPath: null` → video silent). Kebijakan default: kalau salah satu worker gagal, tetap abort semua (perilaku existing `Promise.allSettled` + throw kalau ada yang `rejected` dipertahankan). Kalau audio gagal tapi semua worker sukses, lanjut render video silent (tidak abort worker lain).

### 3.3 Kenapa audio+frame TIDAK bisa jadi 1 page/capture yang sama

Sempat dipertimbangkan "gabung audio+video jadi 1 instance" — ditolak karena beda strategi capture secara fundamental:

- **Audio** wajib direkam **real-time** (`tl.play()` jalan normal speed, `MediaRecorder` menangkap sample yang benar-benar mengalir). Tidak bisa "seek lalu capture" seperti gambar.
- **Frame** sengaja pakai teknik **pause → seek ke waktu t → tunggu render → screenshot** (non-real-time), supaya akurat walau capture lambat. CDP `Page.captureScreenshot` makan ~20-100ms — kalau dipaksa nempel ke real-time playback (budget 33ms @ 30fps), frame bisa telat/skip/dobel saat sistem berat.

Kesimpulan: audio dan frame boleh **konkuren** (jalan bersamaan, browser/context berbeda), tapi tidak boleh **jadi 1 capture yang sama** di page yang sama.

### 3.4 Arsitektur proses: 1 browser + N+1 `createBrowserContext()` (bukan multi-browser, bukan `newPage()` polos)

**Ditolak: multi `puppeteer.launch()` terpisah (kondisi sekarang)** — boros karena browser-level overhead (main process, GPU process, network service, disk cache) ke-duplikasi per worker.

**Ditolak juga: 1 browser + `newPage()` polos untuk semua worker** — origin URL semua tab sama persis (`${baseUrl}/preview/${topicId}`, query param TIDAK mengubah ini karena Chrome menentukan site dari scheme+domain saja, path/query diabaikan). Ada risiko nyata Chrome **menggabungkan beberapa tab origin-sama ke 1 renderer process yang sama** (site-per-process heuristic) — kalau ini terjadi, 8 worker rebutan 1 thread JS yang sama, paralelisme rusak, malah bisa lebih lambat dari sekarang. `newPage()` tidak menjamin proses terpisah secara tertulis di API.

**Dipilih: 1× `puppeteer.launch()` + N+1× `browser.createBrowserContext()`** (1 untuk audio, N untuk worker), tiap context baru `context.newPage()`:

```
1× browser.launch()                        ← 1 browser process, shared overhead
  → 9× browser.createBrowserContext()      ← 1 audio + 8 worker, partisi terisolasi
    → context.newPage()                    ← tiap context dijamin dapat renderer terpisah
```

`createBrowserContext()` BUKAN browser process baru (bukan `launch()` lagi) — cuma partisi storage/cookie/cache terisolasi di dalam browser yang sama, tapi cukup untuk memaksa Chrome kasih renderer process terpisah per context. Biaya tambahnya cuma beberapa MB bookkeeping, jauh lebih murah dari 1 browser process penuh.

### 3.5 Estimasi dampak RAM

```
Sekarang (9× launch terpisah):
  9 × (browser overhead + renderer)   ← browser overhead ke-duplikasi 9×

Dengan createBrowserContext():
  1 × browser overhead + 9 × renderer ← browser overhead cuma 1×, renderer tetap 9× (memang perlu)
```

Renderer cost (yang tetap naik per worker) tidak bisa dihindari — tiap worker genuinely butuh render live canvas/animasi sendiri untuk seek ke waktu berbeda secara paralel. Yang dipangkas cuma bagian "N-1 browser duplikat", bukan renderer.

## 4. Perubahan Kode yang Diperlukan (belum dieksekusi)

- `scripts/export-parallel.mjs`:
  - `exportParallel()`: bikin 1 `browser` di awal (setelah `detectDuration`), pass ke `captureAudio()` & `captureSegment()` sebagai parameter (atau bikin context di dalam masing-masing lalu return context, tergantung mana yang lebih rapi).
  - `launchBrowser()` diganti alurnya: dipanggil sekali di orchestrator, bukan di tiap fungsi capture.
  - **Cleanup krusial**: tiap `captureAudio()`/`captureSegment()` ganti `finally { await browser.close() }` jadi `finally { await context.close() }`. `browser.close()` HANYA dipanggil sekali di `exportParallel()` setelah semua context selesai (audio + semua worker). Kalau kelewat masih ada `browser.close()` di level worker, worker pertama yang selesai akan mematikan browser dan bikin semua worker lain crash.
  - Ganti `await captureAudio(...)` (blocking) diikuti `Promise.allSettled(workerPromises)` jadi SATU `Promise.allSettled([audioPromise, ...workerPromises])`.

- `src/components/ProgressIndicator.jsx`:
  - `PARALLEL_STEPS` sekarang asumsi sequential (`duration 0-5%, audio 5-14%, frames 15-80%, ...`). Dengan audio & frame konkuren, representasi progress linear 1 bar tidak lagi akurat — perlu 2 track paralel: progress audio (waktu ter-play / total durasi) + progress frame (frame selesai / total frame per worker, seperti chip worker yang sudah ada).
  - `export-server.mjs` (`onProgress` callback) perlu kirim status audio & frame secara independen, bukan digabung jadi satu `progress` 0-100 linear.

## 5. Risiko & Hal yang Perlu Divalidasi Empiris

1. **Isolasi crash berkurang sedikit**: kalau shared browser main process itu sendiri crash/OOM-killed oleh OS, SEMUA context (audio + semua worker) ikut mati bareng. Beda dengan sekarang (multi-`launch()`) di mana tiap browser adalah OS process yang fully independent — 1 mati, yang lain tidak kepengaruh. Trade-off wajar demi hemat RAM, tapi perlu disadari.
2. **Kontensi CPU**: total kerja konkuren naik dari "N worker paralel" jadi "N worker + 1 audio real-time" berjalan bersamaan. Sistem 16-core kemungkinan cukup, tapi audio real-time itu **sensitif timing** (ada komentar eksplisit di kode soal atomic `recorder.start()+tl.play()` demi sync). Kalau CPU/scheduler sibuk oleh 8 renderer lain yang capture screenshot, ada risiko kecil audio context/GC pause bikin glitch — perlu dites, bukan cuma dianalisis dari kode.
3. **Perilaku `createBrowserContext()` perlu diverifikasi empiris di mesin ini** — cek dengan `ps aux | grep -- "--type=renderer" | wc -l` dibanding jumlah context yang dibuka, pastikan benar 1:1 (context:renderer), bukan tergabung.
4. **Temuan sampingan (di luar topik ini)**: ditemukan banyak proses `[chromium] <defunct>` (zombie) dari run export sebelumnya saat pengecekan `ps aux`. Mengindikasikan ada path cleanup yang gagal `await browser.close()` dengan sempurna (kemungkinan di jalur error). Tidak berbahaya langsung (zombie tidak makan RAM signifikan, cuma PID table entry), tapi worth diaudit terpisah — dan jadi alasan tambahan kenapa urutan cleanup di poin 4 (`context.close()` vs `browser.close()`) harus dikerjakan hati-hati supaya tidak menambah masalah serupa.
5. **RAM baseline sistem saat pengecekan**: `free -h` menunjukkan swap sudah terpakai 3.5/4GB, available 10GB dari total 30GB. Kemungkinan besar bukan dari project ini (banyak proses Claude Desktop dengan banyak profile berjalan), tapi jadi konteks: available RAM saat testing nanti bisa lebih ketat dari yang terlihat di angka total.

## 6. Rencana Testing

Gunakan topic **`linux-vs-unix`** (sudah ada `export/linux-vs-unix-audio.webm` sebagai referensi audio) sebagai test case:
- Bandingkan hasil audio-video sync sebelum & sesudah perubahan (logic lead-in/offset audio seharusnya tidak berubah karena independen dari kapan frame capture berjalan).
- Ukur total waktu export end-to-end (before/after) untuk validasi klaim speedup.
- Ukur peak RSS total proses Chrome (before/after) via `ps aux --sort=-%mem | grep chrome` selama export berjalan, untuk validasi klaim hemat RAM dari `createBrowserContext()`.
- Verifikasi jumlah frame akhir tetap tepat sesuai `totalFrames` yang diharapkan (tidak ada gap/duplikat dari pembagian range antar worker).

## 7. Ringkasan Keputusan

| Pertanyaan | Keputusan |
|---|---|
| Skip deteksi durasi? | **Tidak** — tetap step terpisah di awal, wajib karena worker butuh totalFrames yang konsisten sebelum split kerjaan |
| Audio + frame capture jadi 1 capture yang sama? | **Tidak** — beda strategi capture (real-time vs seek-discrete), dipaksa gabung bikin akurasi frame terancam |
| Audio + frame capture jalan konkuren (paralel, capture beda)? | **Ya** — lewat `Promise.allSettled` gabungan, bukan sequential |
| Multi `puppeteer.launch()` (kondisi sekarang)? | **Diganti** — boros browser-level overhead per worker |
| 1 browser + `newPage()` polos? | **Ditolak** — risiko tab origin-sama digabung 1 renderer process, paralelisme rusak |
| 1 browser + `createBrowserContext()` per worker? | **Dipilih** — renderer terpisah terjamin, browser-level overhead cuma 1× |
| Query param di URL untuk beda proses? | **Tidak berpengaruh** — Chrome tentukan site dari scheme+domain saja, path/query diabaikan |
