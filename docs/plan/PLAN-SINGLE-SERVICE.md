# 07 — Rencana: Satukan Semua Service ke 1 Port

> Status: **PLAN — belum dieksekusi**. Dokumen ini menjelaskan rencana
> menggabungkan frontend (Vite) + export server (Express) + icon API menjadi
> **satu service, satu container, satu port** supaya gampang dipakai,
> termasuk untuk extension ChatGPT.

---

## 1. Latar Belakang & Tujuan

Saat ini project jalan dengan **2 service terpisah** di `docker-compose.yml`:

| Service      | Port (host) | Isi                                                 |
| ------------ | ----------- | --------------------------------------------------- |
| `frontend`   | **3373**    | Vite dev server (React)                             |
| `export-server` | **3300** | Express API: export video, icon generate, content DB |

Masalah:
- Extension Chrome (`vm-icon-generator`) mengarah ke `http://localhost:3300` → harus ada 2 port, 2 service, config rumit.
- User pingin **cukup 1 project jalan saja** yang handle semuanya (UI + API + export + icon).

**Tujuan:** 1 service, 1 port (= `3373`), handle semua request dengan satu command.

---

## 2. Arsitektur Sekarang vs Target

```
SEKARANG:
┌──────────────┐        ┌──────────────┐
│  frontend    │  3373  │ export-server│  3300
│  Vite:5173   │        │ Express API  │
└──────────────┘        └──────────────┘
   port 3373              port 3300
   walau beda container, user akses 2 port
```

```
TARGET:
┌───────────────────────────┐
│       1 container         │
│  Vite:5173 (+ Express API │   port 3373
│    sebagai middleware)    │
└───────────────────────────┘
   Satu port: semua UI + API + export
```

Cara kerja:
1. Vite melayani UI React (halaman `/`, `/preview/:topicId`, dsb).
2. Route `/api/*` ditangani handler Express yang **dipakai sebagai Vite middleware**
   (persis seperti `vite-plugin-export.js` yang sudah ada untuk `/api/export/*`).
3. Port host tetap **3373**. Extension dan halaman web sama-sama pakai port ini.

---

## 3. File yang Diubah / Ditambah

### 3.1 `scripts/api-handlers.mjs` (BARU — shared module)

Pindahkan seluruh logika handler API dari `scripts/export-server.mjs` ke sebuah
module bersama supaya bisa dipakai dari plugin Vite:

- `GET/POST /api/export/:topicId` + `/api/export/status` (sudah ada di `vite-plugin-export.js`)
- `POST /api/exportp/:topicId` + `GET /api/exportp/status` (parallel)
- `GET /api/export/history`, `DELETE /api/export/history/:topicId`
- `GET /api/content`, `GET/POST /api/content/:id`
- `GET /api/icons/metadata`
- **`GET /api/icons/topics` (BARU — endpoint yang dipakai extension tapi belum ada!)**
- `POST /api/icons/generate` (multipart via multer + sharp)
- `GET /api/health`

Catatan path:
- `content-db.json` → selalu baca dari `<root>/scripts/content-db.json` (bukan `__dirname` yang bisa beda di plugin).
- Root `/app` → arahkan ke `<root>` project.

### 3.2 `vite-plugin-export.js` (PERLUAS)

Ganti logic internal dengan memanggil handler dari `api-handlers.mjs` untuk
**SEMUA** route `/api/*`, bukan cuma `/api/export`. Daftar yang dilayani:
- `/api/export*`
- `/api/exportp*`
- `/api/content*`
- `/api/icons/*`
- `/api/health`

Jadi endpoint extension `GET /api/icons/topics` otomatis tersedia di port 3373.

### 3.3 `scripts/export-server.mjs` (KECIL / TETAP)

Boleh tetap ada sebagai fallback (untuk `npm run export-server` / debug), tapi
harus **reuse `api-handlers.mjs`** supaya tidak dobel logika.

### 3.4 `Dockerfile.frontend` (GABUNG)

Jadikan satu image yang berisi SEMUA kebutuhan:
- Base tetap `node:22-alpine`
- Tambah `chromium`, `ffmpeg`, `nss`, `freetype`, `harfbuzz` (dari `Dockerfile.export`)
- Set `PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true`, `PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium`
- `npm ci` (bukan `--only=production`) karena butuh puppeteer & dev deps (vite)
- `CMD ["npm", "run", "dev", "--", "--host", "0.0.0.0"]`

⚠️ Hasilnya: image jadi besar (±1–2 GB) karena ada Chromium + ffmpeg + sharp
+ semua dependency. Ini konsekuensi wajar dari "1 container handle semua".

### 3.5 `Dockerfile.export` (TIDAK DIPAKAI LAGI)

Hapus dari compose. File boleh dihapus atau dibiarkan (sampai plan sukses).

### 3.6 `docker-compose.yml` (SEDERHANAKAN)

```yaml
services:
  app:
    build:
      context: .
      dockerfile: Dockerfile.frontend
    ports:
      - "3373:5173"
    volumes:
      - .:/app
      - /app/node_modules
    env_file:
      - .env.docker
    command: npm run dev -- --host 0.0.0.0
```

- Service `export-server` dihapus.
- Hanya tersisa **satu port publik: 3373**.

### 3.7 `vite.config.js` (PENYESUAIAN KECIL)

- `allowedHosts` tetap: `frontend`, `localhost`, `127.0.0.1`, `100.78.186.122`.
- Pastikan plugin export tetap terdaftar.
- Saat export berjalan di dalam container, `baseUrl` mesti mengarah ke diri
  sendiri: `http://localhost:5173` (puppeteer buka dari dalam container; Vite
  bind di `0.0.0.0` sehingga bisa diakses via localhost).

### 3.8 `.env.docker` (UPDATE)

```env
# Hapus arah ke export-server:3300 — API sekarang di origin yang sama
VITE_EXPORT_SERVER_URL=
NODE_ENV=development
```

Atau sesuaikan referensi lain kalau ada kode frontend yang baca
`VITE_EXPORT_SERVER_URL`.

### 3.9 Extension Chrome (`src/extensions/vm-icon-generator/`)

Ubah base URL dari port 3300 → **3373**:

- `popup.js:33` → `fetch('http://localhost:3373/api/icons/topics')`
- `content.js:1` → `const ICONS_API_BASE = 'http://localhost:3373/api/icons'`
- `manifest.json:10` → host_permissions jadi `http://localhost:3373/*` (dan
  tambahkan `http://100.78.186.122:3373/*` kalau mau akses lewat Tailscale)
- Pesan error di `popup.js:61` ("port 3300") → update jadi "port 3373"

### 3.10 File `icons.json` di setiap topic

Update field `generation.api_endpoint` dari `http://localhost:3300/api/icons/generate`
menjadi `http://localhost:3373/api/icons/generate`.

Cari semua yang masih pakai `3300`:
`src/content/*/icons/icons.json` (3 folder: `linux-vs-unix`, `desktop-environment`, `virtual-memory`).

---

## 4. Endpoint Baru yang Perlu Dibuat: `GET /api/icons/topics`

Referensi: `docs/06-icon-generation.md` §4. Sudah didokumentasikan tapi belum
diimplementasi → inilah penyebab error "Cannot load topics".

Perilaku yang diharapkan extension (`popup.js`):
- Response JSON: `{ topics: [...] }`
- Tiap topic punya field: `id`, `title`, `iconCount`,
  `isMultiBatch` (true/false), `batches[]` (opsional), `rows`, `cols`.
- Logic: scan `src/content/*/icons/icons.json`, parse format A (multi-batch)
  atau format B (single), lalu rekap.

---

## 5. Trade-off (Harus Disadari)

| Aspek          | Dulu (2 service)                      | Target (1 service)                            |
| -------------- | ------------------------------------- | --------------------------------------------- |
| Setup          | `docker compose up` tapi 2 container  | `docker compose up` 1 container               |
| Port           | 3373 + 3300                           | **cukup 3373**                                |
| Image size     | frontend kecil, export besar          | Satu image besar (±1–2 GB)                    |
| Export berjalan| Tidak ganggu UI (container terpisah)  | Bisa bikin UI agak lambat (share resource)    |
| Crash          | Export crash tidak matikan UI         | Satu titik gagal (API crash = UI ikut bermasalah) |

Kalau taradeoff ini tidak terima, alternatif tetap: Vite proxy (`/api/*` →
3000) tapi itu berarti tetap 2 port di belakang layar — tidak cocok dengan
keinginan "cukup 1".

---

## 6. Urutan Implementasi

1. Buat `scripts/api-handlers.mjs` — pindahkan semua handler dari
   `export-server.mjs`, tambah `GET /api/icons/topics`.
2. Perluas `vite-plugin-export.js` agar melayani semua `/api/*` via handler tsb.
3. Update `vite.config.js` bila perlu (baseUrl export → `http://localhost:5173`).
4. Uji lokal tanpa Docker: `npm run dev` dulu + tes endpoint
   `curl http://localhost:5173/api/icons/topics`.
5. Gabung Dockerfile, sederhanakan `docker-compose.yml`, hapus service export-server.
6. Update `.env.docker`.
7. Update extension (`popup.js`, `content.js`, `manifest.json`) → 3373.
8. Update `generation.api_endpoint` di 3 `icons.json`.
9. `docker compose up -d --build`, tes:
   - `curl http://localhost:3373` → 200
   - `curl http://localhost:3373/api/icons/topics` → daftar topic
   - `curl http://localhost:3373/api/health` → `{ok:true}`
   - Buka extension di ChatGPT → dropdown topic terisi
   - Export video + generate icon tetap jalan.
10. Update dokumen ini jadi "done" dan `docs/06-icon-generation.md` (hapus
    catatan "port standar 3300" → jadi 3373).

---

## 7. Rollback

Semua file lama aman karena:
- `Dockerfile.export` & versi lama `docker-compose.yml` bisa dipulihkan dari
  git kalau plan gagal.
- `scripts/export-server.mjs` tetap ada (modif kecil), jadi moda "2 service"
  masih bisa jalankan lagi kapan saja.
