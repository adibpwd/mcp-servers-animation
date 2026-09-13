# Plan: Satu List Saja — ContentManagement jadi Halaman Utama, Hapus List Homepage

Status: **RENCANA — belum dieksekusi. Checklist TODO di bawah.**

## 1. Konteks & Tujuan

Saat ini ada **dua list konten** dengan dua sumber metadata yang berbeda:

| | Homepage `/` | `/content-management` |
|---|---|---|
| Komponen | `src/components/ContentList.jsx` | `src/components/ContentManagement/` |
| Sumber data | `src/content/registry.js` (`CONTENT_REGISTRY` hardcode) | `GET /api/content` → scan `metadata.json` tiap folder |
| Status | `ready` / `coming-soon` | `draft` / `ready` / `posted` |
| Fungsi | Kartu untuk mainin animasi (PlayerShell) | Kelola: List (priority) + Kanban (drag status) |

Duplikasi terjadi karena list homepage dibangun dari `registry.js`, sedangkan
content-management sudah migrasi ke metadata folder. Dua sumber ini bisa tidak
sinkron.

Tujuannya: **satu list saja** — ContentManagement (List + Kanban) berbasis
`metadata.json` — dijadikan halaman utama `/`. List homepage lama (kartu dari
registry) dihapus. `registry.js` dihapus total; player resolve komponen animasi
langsung dari folder content.

## 2. Temuan Investigasi

- `registry.js` hanya dipakai 3 tempat: `ContentList.jsx` (hapus),
  `PlayerPage.jsx` (resolve komponen via `id`), dan `ContentPreview.jsx`.
- `ContentPreview.jsx` adalah **orphan** — tidak di-route di `App.jsx` dan
  tidak di-import komponen mana pun → kandidat hapus.
- `PlayerShell.jsx` sudah pakai pola `import.meta.glob('../content/**/caption.md')`
  → precedent folder-based scan; pola yang sama bisa dipakai untuk resolve
  komponen animasi.
- `ExportHistory` (`📋 History`) cuma ada di Homepage; harus dipindah agar fitur
  tidak hilang.
- Tidak ada referensi `registry.js` di luar `src/`.
- Topic stub 27+ punya `metadata.json` tapi **belum punya `Animation.jsx`** →
  player harus menampilkan placeholder "belum tersedia", bukan crash/redirect.

## 3. Keputusan Desain

1. ContentManagement dirender langsung di **route `/`**; route
   `/content-management` dihapus, tidak pakai redirect.
2. Fitur **History** dipindah ke header ContentManagement (route `/export-history`).
3. **`registry.js` dihapus total.** Komponen animasi di-resolve lewat helper baru
   `src/content/resolveTopic.js`:
   - `import.meta.glob('./*/metadata.json', { eager: true })`
   - `import.meta.glob('./*/Animation.jsx')`
   - `resolveTopicById(id)` → `{ meta, component, hasAnimation }`.
4. Player memakai metadata dari API (`fetchContentItem`) untuk judul/kategori;
   komponen dari folder. Topic tanpa `Animation.jsx` → placeholder.

## 4. Checklist TODO

### A. Plan & push (tahap ini)
- [x] Buat file plan MD ini.
- [ ] Commit + push file plan.

### B. Implementasi
- [ ] Buat `src/content/resolveTopic.js` (helper resolve komponen dari folder).
- [ ] `src/components/PlayerPage.jsx`: ganti `CONTENT_REGISTRY` → API metadata +
      `resolveTopicById`; tambah placeholder untuk topic tanpa Animation.
- [ ] `src/components/ContentManagement/ContentManagement.jsx`: hapus tombol
      "← Back"; tambah tombol "📋 History" → `/export-history`.
- [ ] `src/App.jsx`: hapus `Home`/`ContentList`; route `/` → `<ContentManagement />`;
      tambah route `/export-history` (wrapper `ExportHistory`, back ke `/`);
      `preview/:id` & `/dev/scene-ui-v1` tetap.

### C. Hapus file lama
- [ ] `src/components/ContentList.jsx` + `.css`
- [ ] `src/components/ContentCard.jsx` + `.css`
- [ ] `src/components/ContentPreview.jsx` + `.css` (orphan)
- [ ] `src/content/registry.js`

### D. Verifikasi
- [ ] `npm run build` lolos (tidak ada error import/JSX).
- [ ] Cek `docker compose logs frontend` tidak ada error HMR.
- [ ] Test browser:
      - `/` menampilkan list + kanban.
      - Klik baris item → `/preview/:id` → animasi jalan (topic yang punya Animation).
      - Klik topic stub (27+) → placeholder "belum tersedia", tombol back jalan.
      - Tombol "📋 History" → `/export-history` → balik ke `/`.

## 5. Catatan

- Semua fitur player/export (Play/Pause, Settings, Export MP4, Download,
  Caption) tidak berubah — tetap di `PlayerShell`.
- Setelah ini, **satu-satunya** sumber list = `metadata.json` tiap folder.