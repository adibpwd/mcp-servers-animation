# Plan — Docker Container Tidak Muncul di Content Management List

**Date**: 2026-09-06
**Status**: PLANNING — belum eksekusi, menunggu approval
**Scope**: `src/components/ContentManagement/*` (ListView & KanbanView),
`src/data/contentManagement.js`, `scripts/content-db.json`

---

## 1. Ringkasan Masalah

Topic `container-docker` **sudah 100% siap** di sisi animasi (registry,
manifest, Animation.jsx, data.js — lihat `_docs/EXECUTION_PLAN.md` Phase
1–6, semua `@done`). Tapi ketika dibuka
`http://<host>:3373/content-management`, item "Docker Container vs
Virtual Machine" **tidak muncul** di List View maupun Kanban View.

## 2. Root Cause

Ada **dua sumber data topic yang terpisah** di project ini, dan
keduanya harus disinkron manual:

| Sumber | Dipakai untuk | Isi `container-docker`? |
|---|---|---|
| `src/content/registry.js` (`CONTENT_REGISTRY`) | Player animasi (`ContentList.jsx`, routing ke `Animation.jsx`) | ✅ Ada (Phase 6, `@done(2026-09-06)`) |
| `scripts/content-db.json` (diserve API server port **3373**, dibaca `fetchContentList()` di `src/data/contentManagement.js`) | Dashboard **Content Management** (List/Kanban, tracking draft→ready→posted) | ❌ **Tidak ada** |

`ContentManagement.jsx` (dan turunannya `ListView.jsx` / `KanbanView.jsx`)
tidak baca `CONTENT_REGISTRY` sama sekali — murni `GET /api/content` dari
`content-db.json`. Karena entry `container-docker` belum pernah
ditambahkan ke file itu, dashboard nggak tahu topic ini eksis.

Ini bukan bug kode — Phase 6 di `EXECUTION_PLAN.md` cuma mencakup
"Registry Integration" (untuk player), dan tidak ada step eksplisit
untuk "Content Management DB Integration". Jadi gap-nya murni
**langkah yang kelewat di planning awal**, bukan error runtime.

## 3. Rencana Perbaikan

### 3.1. Tambah entry ke `content-db.json`
   3.1.1. Ambil metadata dari `manifest.js` (single source of truth):
          `id: 'container-docker'`, `title: 'Docker Container vs
          Virtual Machine'`, `subtitle: 'Why containers are not just
          "tiny VMs"'`, `category: 'Linux Deep Dive'`,
          `tags: ['Docker', 'Container', 'VM', 'Namespaces',
          'Virtualization']`, `color: '#2496ED'`
   3.1.2. Tentukan `status` awal — pilihan: `draft` (default aman,
          konsisten dgn topic lain yang baru selesai dikerjakan tapi
          belum di-review) vs `ready`/`posted` (karena Phase 1–6 sudah
          `@done`). **Rekomendasi: `draft`**, karena Phase 7 (QA) &
          Phase 8 (Final Review) di `EXECUTION_PLAN.md` belum jalan.
   3.1.3. Tentukan `priority` — taruh di urutan setelah `tailscale`
          (priority 11) → jadi priority **12**, biar nggak geser
          urutan item existing lain (semua pakai `updateItemPriority`
          yang clamp 1-100, jadi aman kalau mau reorder manual nanti
          dari UI).

### 3.2. Verifikasi API server baca ulang file
   3.2.1. Cek `scripts/export-server.mjs` — pastikan `GET /api/content`
          baca `content-db.json` langsung dari disk tiap request
          (bukan in-memory cache yang butuh restart server)
   3.2.2. Kalau ternyata di-cache di memory saat start, perlu restart
          proses server (`export-server.mjs`) setelah edit JSON, atau
          reload via endpoint yang sesuai kalau tersedia

### 3.3. Verifikasi tampil di UI
   3.3.1. Refresh `http://<host>:3373/content-management`
   3.3.2. Cek muncul di List View (kolom Priority/Title/Status/Category)
   3.3.3. Cek muncul di Kanban View (kolom sesuai `status` yang dipilih)
   3.3.4. Cek warna dot (`item.color`) match `#2496ED` (Docker brand blue)

### 3.4. (Opsional) Cegah gap serupa di topic berikutnya
   3.4.1. Tambah 1 langkah baru di template `EXECUTION_PLAN.md` —
          "Phase 6b: Content Management DB Integration" — supaya topic
          baru berikutnya nggak kelewat step ini lagi
   3.4.2. Pertimbangkan generate `content-db.json` entry otomatis dari
          `manifest.js` tiap topic (script kecil) alih-alih edit manual,
          supaya kedua sumber data selalu sinkron by construction

## 4. Yang TIDAK Diubah (Out of Scope)

- Tidak menyentuh `Animation.jsx` / `data.js` (animasi sudah `@done`,
  di luar masalah ini)
- Tidak menyentuh `registry.js` (sudah benar, ini bukan sumber masalah)
- Tidak mengubah struktur `ListView.jsx` / `KanbanView.jsx` — masalahnya
  di data, bukan di komponen render

## 5. Approval yang Dibutuhkan

- [ ] Konfirmasi `status` awal: `draft` (rekomendasi) atau langsung
      `ready`/`posted`?
- [ ] Konfirmasi `priority`: 12 (setelah tailscale) atau posisi lain?
- [ ] Izin edit `scripts/content-db.json` langsung (bukan lewat UI
      dashboard, karena entry-nya belum ada untuk di-klik)

---

**Next step setelah approve**: eksekusi §3.1, lalu verifikasi §3.2–3.3.
Tidak ada perubahan kode React yang dibutuhkan — murni tambah data.
