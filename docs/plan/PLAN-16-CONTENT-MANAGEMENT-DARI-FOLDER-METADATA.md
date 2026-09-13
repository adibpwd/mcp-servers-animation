# Plan: Content Management baca Langsung dari Metadata Folder (`src/content/*`)

Status: **RENCANA — belum dieksekusi. Checklist TODO di bagian bawah.**

## 1. Konteks & Tujuan

Halaman `/content-management` (dan juga port 3300) saat ini mengambil data dari
satu file global `scripts/content-db.json` via `GET /api/content`. Setiap kali
ada topic baru, tim harus edit file itu secara manual — dua sumber metadata
(registry/folder vs content-db) jadi mudah tidak sinkron.

Tujuannya: **hapus ketergantungan ke `content-db.json`**. Server membangun daftar
konten dengan **scan folder `src/content/*/`** dan membaca **`metadata.json`**
di tiap folder. Folder yang sudah punya metadata otomatis tampil; yang tidak,
tidak tampil. Edit status/priority dari UI ditulis **balik ke `metadata.json`**
folder tersebut.

## 2. Temuan Investigasi

- Halaman `/content-management` (`src/components/ContentManagement/ContentManagement.jsx`)
  memanggil `fetchContentList()` → `GET http://<host>:3373/api/content`
  (`src/data/contentManagement.js:70`).
- `/api/content` di-serve oleh **dua** server:
  - `vite-plugin-export.js:276` (middleware Vite dev server, port 3373) —
    **ini yang dipakai halaman**.
  - `scripts/export-server.mjs:296` (Express standalone, port 3300).
  Keduanya membaca `scripts/content-db.json` via `readContentDb()`.
- Homepage `/` & preview (`ContentList.jsx`, `ContentPreview.jsx`, `PlayerPage.jsx`)
  tetap membaca `src/content/registry.js` — **di luar scope**, tidak diubah.
- Kondisi folder `src/content/*/` saat ini:
  - **Punya `manifest.js` (ESM)**: 10–26 (termasuk 16-env-variables yang
    sengaja di-hide di registry karena backup).
  - **Tanpa manifest (cuma Animation/data inline)**: 01–09.
  - **Stub, baru `_docs/` saja**: 27-x (27, 28, 29, 30, 34, 37, 38, 44, 48, 51,
    60, 65, 67, 81, 84, 91).
- `manifest.js` berisi `{ schemaVersion, id, title, subtitle, category, tags,
  color, audioStrategy }` — **tidak ada** `status`/`priority`. `status` selama
  ini didefinisikan di `registry.js` dan `content-db.json`.
- **Blocker lingkungan:** container docker masih ter-bind ke path lama
  `.../mcp-servers-animation/mcp-servers-animation` (sebelum repo di-flatten),
  jadi hari ini `localhost:3373` & `/api/content` mengembalikan 404/kosong.
  Perlu `docker compose down && up` dari path repo yang baru untuk verifikasi.
- Vite container menulis folder `.vite/` root-owned ke host tiap berjalan →
  belum masuk `.gitignore`.

## 3. Keputusan Desain

1. **`metadata.json` = satu-satunya sumber metadata untuk dashboard**.
   - Server menampilkan folder **hanya jika ada `metadata.json`**.
   - `16-env-variables` tidak dibuatkan `metadata.json` → otomatis tersembunyi.
2. **Sumber & penulisan balik:**
   - Baca: `metadata.json` per folder (bukan baca `manifest.js`).
   - `POST /api/content/:id` (ubah status/priority dari List/Kanban) →
     menulis balik ke `metadata.json` folder tersebut.
3. **`priority`** default: dari angka prefix nama folder (mis. `27-...` → 27).
4. **`status`** default: `draft`.
5. **Migrasi hari pertama:** seed `metadata.json` untuk 01–26 (kecuali 16)
   dari nilai `content-db.json` sekarang agar tampilan dashboard sama persis.
6. Setelah seed, `scripts/content-db.json` dihapus dari repo.

## 4. Checklist TODO

### A. Seed metadata
- [ ] Buat `scripts/seed-metadata.js` (sekali jalan, boleh dihapus setelahnya).
- [ ] Seed `src/content/{01..09,10..26}/metadata.json` (25 topic, **tanpa**
      `16-env-variables`) dari `scripts/content-db.json` — salin `id, title,
      subtitle, category, tags, color, status, priority`.
- [ ] Buat `metadata.json` minimal untuk stub 27–91
      (id = slug, title dari nama folder, subtitle, category linux, color,
      `status: "draft"`, `priority: <angka folder>`).
- [ ] Jalankan sekali & verifikasi isi file.

### B. Refactor server (yang dipakai halaman)
- [ ] `vite-plugin-export.js`:
  - [ ] Ganti `readContentDb()` dengan `buildContentItems()` (scan
        `src/content/*/metadata.json`, merge + sort by priority).
  - [ ] `GET /api/content` → `buildContentItems()`.
  - [ ] `GET /api/content/:id` → cari di hasil `buildContentItems()`, 404 jika tak ada.
  - [ ] `POST /api/content/:id` → validasi status/priority, tulis balik ke
        `metadata.json` folder (buat/update field), simpan.
  - [ ] Hapus dependensi `CONTENT_DB_PATH` / `readContentDb` / `writeContentDb`.

### C. Refactor server 3300 (konsistensi)
- [ ] `scripts/export-server.mjs`: terapkan perubahan yang sama seperti bagian B.

### D. Cleanup & config
- [ ] `git rm scripts/content-db.json` (riwayat git sebagai backup otomatis).
- [ ] Tambah `.vite/` ke `.gitignore`.

### E. Verifikasi (perlu restart docker dari path baru)
- [ ] `docker compose down` di `mcp-servers-animation/` (path repo baru).
- [ ] `docker compose up -d --build` di path yang sama.
- [ ] `curl localhost:3373/api/content` → berisi topic 01–26 (tanpa 16) +
      stub 27–91 sebagai draft.
- [ ] Edit status/priority via UI → file `metadata.json` folder ikut berubah.
- [ ] Commit hasil refactor.

## 5. Catatan

- Homepage `/` tetap dari `registry.js`; tidak terdampak.
- Export pipeline (`export-lib.js`, `export-parallel.mjs`) memakai `topicId`
  string dari registry — tidak terkait `content-db.json`, aman.