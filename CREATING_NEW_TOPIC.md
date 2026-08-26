# Panduan Standarisasi Konten Animasi (Berdasarkan Topik "Linux File Permission")

Dokumen ini merangkum teknik, pola, dan standarisasi yang berhasil diterapkan saat membuat animasi `file-permission` untuk format Instagram Reels (9:16). Gunakan ini sebagai acuan saat membuat topik baru agar kualitas, timing, audio, dan export video tetap konsisten.

---

## 1. Arsitektur Komponen (`Animation.jsx`)

### 1.1 Timeline Tunggal (Master GSAP)
Gunakan satu master `gsap.timeline()` yang menampung semua fase animasi. Jangan gunakan banyak timeline yang berjalan independen karena akan berantakan saat sinkronisasi audio dan proses export video per-frame.

```javascript
const master = gsap.timeline({ paused: isExporting })
```

### 1.2 Timeline Berbasis Waktu (`master.add(..., time)`)
Semua action di master timeline **harus** diposisikan dengan parameter absolut `time`. 
Setiap phase menambahkan durasinya sendiri ke variabel `time`.

```javascript
let time = 0.0

// Intro
master.add(() => setPhaseIdx(-1), time)
time += 1.2 // Durasi intro

// Phase 1
const p1Duration = 6.5
master.add(() => setPhaseIdx(0), time)
master.to(..., { ..., duration: 3.0 }, time + 1.0)
time += p1Duration 
```

### 1.3 State Reset
Saat masuk ke Phase baru, pastikan melakukan reset ke *state* UI sebelumnya di dalam blok `master.add()`. Hal ini krusial jika timeline melakukan *loop* ke awal, agar objek tidak tersangkut di state akhirnya.

## 2. Hero Thumbnail ke Header Morphing (Tanpa Crossfade)

Agar bisa dipakai sebagai Cover/Thumbnail Reels di detik 0.0 tanpa memerlukan gambar terpisah, frame 0 harus terlihat rapi, besar, dan berada di tengah (Center).

- **Teknik "Interpolasi Matematis" (Lerp):**
  Jangan menggunakan dua elemen SVG yang di-*crossfade* (opacity 0 -> 1). Gunakan satu elemen `<text>` SVG dan manipulasi X, Y, FontSize menggunakan rumus interpolasi (`morphProgress` 0.0 ke 1.0).

- **Contoh Penyelarasan (Text Anchor):**
  Agar animasi dari Center ke Left-Align mulus tanpa "meloncat" saat atribut SVG diganti, pertahankan `textAnchor="start"`, namun hitung titik awalnya (Frame 0) secara matematis agar persis di tengah layar.

  ```javascript
  const p = morphProgress // 0 (Thumbnail) -> 1 (Header Left)
  
  // Asumsi Lebar Font saat besar
  const thumbWidth = 280
  
  // Mulai di tengah: (VW / 2) - (thumbWidth / 2)
  // Berakhir di kiri: 44
  const startX = (VW / 2) - (thumbWidth / 2)
  const endX = 44
  
  const currentX = lerp(startX, endX, p)
  ```

## 3. Manajemen Audio & Sinkronisasi

Karena export dilakukan secara *headless* via Puppeteer per-frame, suara yang di-play via `new Audio()` di browser tidak akan ikut terekam. Audio di-mix belakangan oleh FFMPEG.

### 3.1 Sinkronisasi Browser (UI) dan Backend (FFMPEG)
- **Browser:** Mainkan SFX di dalam blok `master.add(...)` pada `Animation.jsx` dengan trigger `playSfx('whoosh')`.
- **Backend:** Catat waktu absolut (dalam detik) terjadinya SFX tersebut ke dalam objek `SFX_SCHEDULES` di `scripts/export-lib.js`.

**PENTING:** Hitungan detik di `SFX_SCHEDULES` **harus persis** sama dengan perhitungan `time` di GSAP.

### 3.2 Scaling Volume untuk FFMPEG
Web UI mengizinkan volume hingga `500%` agar dapat memperkeras sumber suara asli.
Di `export-lib.js`, ini diterjemahkan menjadi *scale factor*:
```javascript
const volumeScale = Math.max(0, Math.min(5.0, volume / 100))
// Hasilnya, volume 300% = scale 3.0
```

## 4. Pola Simulasi dan Umpan Balik (Feedback Loop)

Jika membuat simulasi (seperti Kapsul yang menabrak Shield), jangan pisahkan timing logic dari GSAP.

- Bungkus state action dalam helper function.
- Mainkan "whoosh" saat peluncuran.
- Tambahkan jeda animasi (`duration: 0.6`).
- Mainkan "success/error" di timeline tepat pada waktu impact (`startTime + 0.7`).

```javascript
const runSimAction = (startTime, isAllowed) => {
    master.add(() => {
        playSfx('whoosh') // Awal meluncur
    }, startTime)
    
    // Animasi kapsul meluncur (duration 0.6s)
    
    master.add(() => {
        setShieldState(isAllowed ? 'granted' : 'denied')
        playSfx(isAllowed ? 'success' : 'error') // Kapsul menabrak
    }, startTime + 0.7)
}
```

## 5. Tips Teknis Lainnya
1. **Hindari Background Transparan yang Tidak Disengaja:** Pastikan ada tag `<rect>` dasar di SVG dengan ukuran `100%` `100%` berwarna solid agar saat diexport jadi PNG per frame, FFMPEG tidak salah menafsirkan *alpha channel*.
2. **Kompensasi Jeda Server (Timeout):** Puppeteer mengambil gambar satu per satu per frame. Jika script frontend crash saat proses capture (sering terjadi pada DOM besar/efek glow berat), tambahkan `setTimeout(..., 10)` di `captureFrames` agar memory tidak *leaking* (tersedia di `export-lib.js`).
3. **Warna & Palet:** Gunakan warna khas `mint` (`#2CD1A8`), `sky blue` (`#38BCF8`), dan `navy`/gelap (`#0F172A`) untuk nuansa *cyberpunk/tech* yang rapi.
