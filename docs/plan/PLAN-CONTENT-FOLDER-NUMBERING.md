# Plan: Numbering Folder `src/content/*` (format `NN-nama-topic`)

Status: **DRAFT — belum dieksekusi, minta review dulu**

## 1. Konteks & Tujuan

Saat ini folder topic di `src/content/` tidak berurutan secara visual di file
explorer (alfabetis apa adanya), padahal urutan tampil/prioritas topic
sebenarnya sudah didefinisikan lewat urutan array `CONTENT_REGISTRY` di
`src/content/registry.js`. Tujuannya: rename tiap folder topic jadi
`NN-nama-topic` (misal `01-mcp-servers`) supaya urutan folder di disk = urutan
kurikulum/prioritas, tanpa mengubah `id` topic maupun perilaku aplikasi.

## 2. Temuan Investigasi

- 16 folder topic di `src/content/`, 14 di antaranya sudah terdaftar di
  `registry.js`, 2 belum terdaftar (`async-event-loop`, `env-variables` —
  sudah punya `manifest.js` + `Animation.jsx` + `data.js`, tapi belum
  di-import/push ke array `CONTENT_REGISTRY`).
- `registry.js` mengimpor tiap topic via `component: () => import('./<folder>/Animation')`
  → **satu-satunya tempat kode yang wajib ikut berubah** kalau folder di-rename.
- Beberapa topic pakai pola manifest baru (`import xManifest from './x/manifest.js'`
  lalu `{...xManifest}` di array) — path import manifest juga ikut berubah.
- `scripts/content-db.json`, `scripts/export-lib.js`, `scripts/export-video.js`
  semua mengacu ke topic lewat **`id`/`topicId`** (string, mis. `"mcp-servers"`),
  **bukan** path folder. Jadi export pipeline & content-db **aman**, tidak perlu
  diubah selama field `id` di registry tetap sama.
- Fitur icon generator scan pakai glob `src/content/*/icons/icons.json`
  (lihat `docs/standardizations/05-svg-layout-asset-pipeline.md`) → glob `*` tetap match
  folder yang sudah diberi prefix angka, **aman**.
- Referensi path folder spesifik yang HARUS diupdate manual (grep hit):
  - `docs/standardizations/04-motion-gsap-reference.md` → menyebut
    `src/content/tailscale/revision/...` (2 tempat)
  - `docs/standardizations/03-planning-storytelling-quality-gate.md` → menyebut
    `src/content/http-request-response/_docs/...`
  - `docs/standardizations/02-topic-contract-scene-shell.md` → menyebut
    `src/content/linux-vs-unix/` sebagai contoh (bisa dibiarkan generik atau
    diupdate ke nama baru, low priority)
  - File `_docs/`, `revision/`, `PLAN-*.md` **di dalam** tiap folder topic itu
    sendiri tidak perlu diubah isinya (mereka pakai path relatif implisit),
    tapi kalau ada cross-reference antar topic docs perlu dicek per kasus.

## 3. Usulan Urutan Nomor

Dasar urutan: posisi di `CONTENT_REGISTRY` (ini merepresentasikan urutan
tampil/tier yang sudah sengaja disusun tim). Topic yang belum terdaftar
ditaruh di akhir, urut alfabetis, sebagai draft.

| No | Folder saat ini | Status registry |
|----|---|---|
| 01 | `mcp-servers` | ready |
| 02 | `desktop-environment` | ready |
| 03 | `linux-vs-windows` | ready |
| 04 | `file-permission` | ready |
| 05 | `shell-pipeline` | coming-soon |
| 06 | `what-is-kernel` | coming-soon |
| 07 | `process-vs-thread` | coming-soon |
| 08 | `linux-kernel-architecture` | coming-soon |
| 09 | `virtual-memory` | ready |
| 10 | `container-docker` | ready |
| 11 | `tailscale` | ready |
| 12 | `linux-vs-unix` | ready |
| 13 | `dns-explained` | coming-soon (in progress) |
| 14 | `http-request-response` | coming-soon (in progress) |
| 15 | `async-event-loop` | **belum terdaftar** |
| 16 | `env-variables` | **belum terdaftar** |

⚠️ **Perlu konfirmasi**: apakah urutan ini sudah sesuai keinginan, atau mau
dasar lain (misal: alfabetis, atau ready dulu semua baru coming-soon, atau
sesuai `priority` di `content-db.json`)? Kalau mau ganti dasar urutan, cukup
update tabel ini sebelum eksekusi.

## 4. Task Hierarchy (mengikuti standar numbering unlimited di `PROJECT_STRUCTURE.md`)

```
1. Persiapan
   1.1. Konfirmasi urutan nomor final ke user (tabel §3)
   1.2. Backup / pastikan working tree git bersih (commit dulu sebelum rename)

2. Rename folder
   2.1. Rename 14 folder yang sudah terdaftar di registry.js
      2.1.1. git mv mcp-servers 01-mcp-servers
      2.1.2. git mv desktop-environment 02-desktop-environment
      2.1.3. git mv linux-vs-windows 03-linux-vs-windows
      2.1.4. git mv file-permission 04-file-permission
      2.1.5. git mv shell-pipeline 05-shell-pipeline
      2.1.6. git mv what-is-kernel 06-what-is-kernel
      2.1.7. git mv process-vs-thread 07-process-vs-thread
      2.1.8. git mv linux-kernel-architecture 08-linux-kernel-architecture
      2.1.9. git mv virtual-memory 09-virtual-memory
      2.1.10. git mv container-docker 10-container-docker
      2.1.11. git mv tailscale 11-tailscale
      2.1.12. git mv linux-vs-unix 12-linux-vs-unix
      2.1.13. git mv dns-explained 13-dns-explained
      2.1.14. git mv http-request-response 14-http-request-response
   2.2. Rename 2 folder draft (belum terdaftar)
      2.2.1. git mv async-event-loop 15-async-event-loop
      2.2.2. git mv env-variables 16-env-variables

3. Update kode
   3.1. Update src/content/registry.js
      3.1.1. Update semua statement `import xManifest from './x/manifest.js'` → path baru
      3.1.2. Update semua `component: () => import('./x/Animation')` → path baru
      3.1.3. (opsional) tambahkan entry untuk async-event-loop & env-variables
             kalau memang mau di-publish, atau biarkan tetap tidak terdaftar
   3.2. Cek file lain yang mereferensikan path folder topic secara hardcode
      3.2.1. grep ulang `src/content/<nama-lama>` di seluruh repo (exclude node_modules, dist)
      3.2.2. Update referensi di docs/standardizations/04-motion-gsap-reference.md
      3.2.3. Update referensi di docs/standardizations/03-planning-storytelling-quality-gate.md
      3.2.4. Review docs/standardizations/02-topic-contract-scene-shell.md (opsional, contoh generik)

4. Verifikasi
   4.1. `npm run dev` → buka ContentList, pastikan semua 14 topic ready/coming-soon
        masih muncul & bisa dibuka playernya
   4.2. Jalankan icon-generator scan (`GET /api/icons/topics`) → pastikan masih
        mendeteksi folder yang punya `icons/icons.json`
   4.3. Jalankan 1x export test (topic yang statusnya "ready") → pastikan
        export-lib.js tetap jalan (karena dia pakai `id`, bukan path folder)
   4.4. `git status` → review diff, pastikan rename terdeteksi sebagai rename
        (bukan delete+add) supaya history file tetap kebaca

5. Commit
   5.1. Commit dengan pesan jelas, mis. "chore: number src/content topic folders (01-16)"
```

## 5. Risiko & Catatan

- Rename folder via `git mv` (bukan hapus manual + buat baru) supaya Git tetap
  melacak history tiap file topic.
- Kalau ada IDE/editor yang sedang watch folder lama (dev server jalan),
  restart dev server setelah rename supaya Vite HMR tidak bingung.
- Field `id` di registry **tidak diubah** (tetap `mcp-servers`, dst) — yang
  berubah cuma nama folder + path import. Ini penting supaya
  `content-db.json`, URL routing (`/preview/:topicId`), dan export pipeline
  tidak perlu disentuh sama sekali.
- Folder yang statusnya masih dikomentari di `registry.js` (`systemd-architecture`,
  `network-stack`, `git-version-control`) belum punya folder fisik → tidak
  masuk hitungan nomor, cukup dilanjutkan penomorannya nanti kalau folder
  fisiknya sudah dibuat.

---

**Next step**: tolong konfirmasi urutan di §3 (terutama posisi `async-event-loop`
dan `env-variables` yang belum terdaftar), setelah itu saya eksekusi §4 task
hierarchy di atas satu per satu pakai Desktop Commander.
