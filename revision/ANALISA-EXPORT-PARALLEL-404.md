# Analisa — Export Parallel 404 (`/api/exportp/tailscale`)

> **Status: ANALISA SELESAI, BELUM DIEKSEKUSI.** File ini murni
> analisa akar masalah + rencana perbaikan. Belum ada kode yang
> diubah.
>
> Catatan lokasi: bug ini bukan spesifik topic tailscale — ini bug
> infra/shared (`vite-plugin-export.js` + `PlayerShell.jsx`), jadi
> plan-nya ditaruh di folder `revision/` level project (bukan di
> `src/content/tailscale/revision/`), biar gak menyesatkan seolah
> cuma soal tailscale.

## Gejala

```json
{ "ok": false, "error": "Not found", "path": "/api/exportp/tailscale" }
```
Muncul saat klik tombol Export dari preview web (mode default: **Parallel**).

## Akar Masalah

1. `docker-compose.yml` sekarang cuma punya **1 service** (`app`) yang
   menjalankan `npm run dev` (Vite dev server) di port 5173→3373. Semua
   API (`/api/*`) di-handle oleh plugin Vite: `vite-plugin-export.js`.
2. Dulu project ini punya service terpisah **`export-server`**
   (`scripts/export-server.mjs`, Express, port 3300) — masih ada
   sisa container orphan-nya (`mcp-servers-animation-export-server-1`,
   lihat warning docker compose sebelumnya). Sekarang service itu
   **tidak dijalankan lagi**.
3. `scripts/export-server.mjs` (yang sudah tidak jalan) implementasi
   route **lengkap**: sequential (`/api/export/*`) **dan** parallel
   (`/api/exportp/*`).
4. `vite-plugin-export.js` (yang **sedang jalan**, dipakai `app`
   service) cuma **port sebagian**: sequential (`/api/export/*`) sudah
   ada, tapi **parallel (`/api/exportp/*`) belum pernah di-port** —
   walau `exportParallel` & `getVideoStatsParallel` sudah di-import di
   baris atas file (line 6) dan `parallelJobs` Map sudah dideklarasikan
   (line 17) — **keduanya dead code, tidak dipakai di manapun** dalam
   `handleApiRoute()`. Ini jejak porting yang kepotong di tengah jalan.

5. `PlayerShell.jsx` selalu memanggil `getExportServerUrl()` yang
   hardcode ke `http://<hostname>:3373` — yaitu ke `app` service itu
   sendiri, BUKAN ke port 3300. Jadi arsitektur yang benar sekarang
   memang: satu service (`app`) yang harus handle semua mode (single
   & parallel). Frontend-nya sudah benar, yang kurang cuma
   implementasi route parallel di `vite-plugin-export.js`.
6. Default `settings.exportMode` di `useExportSettings.js` adalah
   `'parallel'` — makanya user langsung kena 404 begitu buka Export
   tanpa perlu switch mode dulu.

## Kesimpulan

Bug bukan di frontend (`PlayerShell.jsx`), bukan juga bug baru dari
percakapan sebelumnya (wording/plan) — murni **gap porting**: route
parallel export cuma ada di file server lama yang sudah tidak
dijalankan (`scripts/export-server.mjs`), belum pernah dipindah ke
file server yang dipakai sekarang (`vite-plugin-export.js`).

## Rencana Perbaikan (belum dieksekusi)

### Opsi A — Port route parallel ke `vite-plugin-export.js` (disarankan)

Tambah 2 handler baru di `handleApiRoute()`, meniru pola yang sudah
ada untuk `/api/export/*` sequential, tapi pakai `exportParallel` +
`parallelJobs` Map yang sudah di-import/dideklarasikan (tinggal
dipakai):

1. **State & helper baru** (mirror dari `scripts/export-server.mjs`):
   - `parallelJobs` Map(topicId → jobState) — sudah ada di line 17,
     tinggal dipakai.
   - Fungsi `makeParallelJob(topicId, workers, volume, speed)`.
   - Fungsi `async function startParallelExport(topicId, workers,
     volume, speed)` — isinya manggil `exportParallel()` (sudah
     di-import), simpan progress ke job di `parallelJobs`, push ke
     `exportHistory` (variable yang sudah ada) saat selesai/error.
     **Penting**: `baseUrl` untuk `exportParallel()` harus
     `'http://localhost:5173'` (SAMA seperti `startExport()`
     sequential yang sudah ada), **bukan** `'http://frontend:5173'`
     seperti di `scripts/export-server.mjs` lama — karena sekarang
     cuma ada 1 container, hostname `frontend` sudah tidak ada.

2. **Route `POST /api/exportp/:topicId`** — regex match
   `/^\/api\/exportp\/(.+)$/`, letakkan SEBELUM regex
   `/^\/api\/export\/(.+)$/` yang sudah ada (biar gak ketangkep salah
   pola dulu — walau prefix beda jadi sebenarnya aman, tapi urutan
   tetap lebih jelas kalau parallel duluan). Body: `workers, volume,
   speed` (clamp sama seperti versi lama: workers 1-16, volume 0-500,
   speed 0.5-2.0). Cek `existing?.status === 'running'` → 409 kalau
   masih jalan. Response 202 `{ ok: true, status: 'started', topicId,
   workers, volume, speed, mode: 'parallel' }`.
3. **Route `GET /api/exportp/status`** — baca `topicId` dari query,
   ambil dari `parallelJobs`, gabungkan dengan
   `getVideoStatsParallel(topicId, PROJECT_ROOT)` buat info
   `videoReady/videoUrl/videoSize`. Kalau `topicId` kosong, balikin
   semua job (list). Kalau job belum ada, balikin `{ status: 'idle',
   ... }` (bukan 404) — sama seperti perilaku lama.
4. Taruh 2 route baru ini SEBELUM baris catch-all `res.writeHead(404,
   ...)` di paling bawah `handleApiRoute()`.

### Opsi B — Jalankan lagi `scripts/export-server.mjs` sebagai service terpisah

Tambah service `export-server` di `docker-compose.yml` (pakai
`Dockerfile.export` yang sudah ada), expose port 3300, lalu ubah
`getExportServerUrl()` di `PlayerShell.jsx`/`ExportHistory.jsx` supaya
saat mode parallel arahkan ke port 3300, bukan 3373.

**Tidak disarankan** dibanding Opsi A karena:
- Nambah 1 container lagi + kompleksitas cross-container `baseUrl`
  (`http://frontend:5173` vs `http://app:5173`, rawan salah lagi
  seperti riwayat sebelumnya).
- 2 sumber source-of-truth untuk export logic (`export-lib.js` dipakai
  `vite-plugin-export.js` utk sequential, tapi parallel malah lewat
  service lain) — tidak konsisten dengan arsitektur `app` service
  yang sekarang sudah "unified API" (sesuai komentar di
  `docker-compose.yml`: *"Vite dev server dengan ALL API routes"*).

**Rekomendasi: Opsi A.**

> **Keputusan final (dikonfirmasi user): WAJIB 1 port saja untuk
> project ini.** Opsi B otomatis gugur/tidak dipakai. Opsi A satu-
> satunya jalur — port 3373 (`app` service) yang sama menghandle web
> preview, export single, dan export parallel sekaligus.

## Dampak ke Kode (kalau Opsi A dieksekusi)

- **`vite-plugin-export.js`**: tambah ±40-50 baris baru (helper +
  2 route). Tidak perlu ubah import yang sudah ada (`exportParallel`,
  `getVideoStatsParallel` sudah di-import, `parallelJobs` sudah
  dideklarasikan). Tidak ada breaking change ke route `/api/export/*`
  sequential yang sudah jalan.
- **`PlayerShell.jsx`, `ExportHistory.jsx`, `useExportSettings.js`,
  `docker-compose.yml`**: **tidak perlu diubah sama sekali** —
  frontend & infra sudah benar, cuma nunggu backend-nya melengkapi
  route yang hilang.
- **`scripts/export-server.mjs`**: tidak disentuh (dibiarkan sebagai
  referensi/legacy, dipakai untuk cross-check pola implementasi).

## Yang Perlu Dicek Setelah Eksekusi (nanti)

- Test manual: klik Export dengan mode Parallel (default) di web
  preview → pastikan tidak lagi 404, progress bar jalan, video
  akhirnya muncul di `/videos/tailscale.mp4`.
- Test mode Single (`1×`) juga masih jalan seperti biasa (regresi
  check — pastikan penambahan route parallel gak ganggu route
  sequential yang sudah ada).
- Cek log container (`docker compose logs -f app`) saat proses
  export parallel jalan — pastikan `exportParallel()` beneran
  jalankan multi-worker Puppeteer di dalam 1 container yang sama
  (bukan nyoba connect ke container terpisah yang gak ada).
- Kalau ternyata `exportParallel()` butuh resource/isolasi proses yang
  gak cocok dijalankan di dalam proses Vite dev server yang sama
  (misal: banyak Chrome headless sekaligus bikin container app pakai
  banyak resource sampai vite jadi lemot) — baru pertimbangkan Opsi B
  sebagai fallback.

**Status: masih rencana, nunggu konfirmasi user sebelum eksekusi ke
`vite-plugin-export.js`.**
