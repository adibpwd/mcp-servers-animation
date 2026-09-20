# Plan Revisi 03 — Pause Hold Durations for Text & Payload Capsules on SSH Flow

**Tanggal:** 2026-09-21  
**Target Content:** `44-ssh`  
**Status:** 📝 PLAN ONLY (Belum dieksekusi)

---

## 1. Latar Belakang & Masalah (Problem Statement)

- **Masalah Utama:**
  - Pada animasi `44-ssh`, saat payload (berupa box warna teks/capsule) bergerak melintasi kanal terenkripsi dari `Client` ke `SSH Server` (atau sebaliknya), perpindahan terjadi terlalu cepat (`travel` duration ~0.9s sampai 1.0s tanpa jeda/hold membaca) lalu langsung menghilang (`popOut`).
  - Akibatnya, audiens **tidak sempat membaca isi teks di dalam box payload** (seperti `command: uptime`, `status: health OK`, `query`, `result`, `packet`, `deploy-bot proof`, `release.tar`, dsb.) serta caption penjelas yang menyertainya.

---

## 2. Tujuan Revisi (Objectives)

1. **Memberikan Jeda / Pause Hold pada Setiap Payload Box:**
   - Menambahkan durasi diam (*hold/read pause*) selama **1.5s - 2.2s** setiap kali box payload tiba di stasiun tujuan (Client atau Server) sebelum animasi berlanjut atau box menghilang.
2. **Penyesuaian Ritme Timeline GSAP (Act 2 s/d Act 5):**
   - Menyesuaikan timestamp `t` pada `Animation.jsx` untuk menampung waktu membaca (reading window) tanpa merusak kesinambungan narasi antar-Act.
3. **Memastikan Teks Penting Terbaca Jelas:**
   - Memperjelas ukuran font/kontras serta memberi jeda waktu yang cukup untuk:
     - **Act 2 (Auth):** Identity token (`deploy-bot`), `public-key proof`, dan `scope: release only`.
     - **Act 3 (Modes):** `command: uptime` -> `output: health OK — up 14 hari`, `task: check-service` -> `status: ok`, serta `file: release.tar`.
     - **Act 4 (Forwarding):** Box `query` dan `result` di local port forwarding, serta `packet` di Bastion host.
     - **Act 5 (Audit/Lifecycle):** Single connect attempt & audit timeline log (`allow` vs `deny`).

---

## 3. Rencana Perubahan Detail (Detailed Plan)

### A. Perubahan Parameter Duration & Hold di `Animation.jsx`

1. **Pemberian Parameter `readHold` pada Helper `travel`:**
   - Mengubah helper `travel()` agar menerima opsi `readHold` (default `1.5s`), di mana opacity dan scale payload box ditahan penuh di posisi tujuan sebelum dilanjutkan ke step berikutnya.

2. **Perpanjangan Timings Per Act:**

   - **Act 2 (Login & Hak Akses):**
     - Tambah hold waktu ketika `verifierRing` mencocokkan `proof token` (+1.2s).
     - Tambah hold waktu saat `policyGate` menampilkan `scope: release only` (+1.5s).

   - **Act 3 (Channel Modes - Remote Shell & File):**
     - *Command capsule (`uptime`):* Tiba di server, diam selama **1.5s** agar teks command terbaca sebelum output dipancarkan.
     - *Output capsule (`health OK — up 14 hari`):* Berada di client terminal card selama **2.0s** (sebelumnya hanya 1.6s).
     - *Task capsule (`check-service` & `status: ok`):* Masing-masing diberi jeda diam **1.5s**.
     - *File capsule (`release.tar`):* Tiba di file tray server dan diam selama **2.2s** dengan highlight kontras.

   - **Act 4 (Forwarding & Bastion):**
     - *Query capsule:* Tiba di `Private DB`, diam **1.5s**.
     - *Result capsule:* Tiba kembali di `Local App`, diam **1.8s**.
     - *Bastion Packet:* Saat melintasi node `Bastion / Jump Host`, beri titik singgah/pause **1.2s** sebelum menuju `Private Target`.

   - **Act 5 (Key Lifecycle & Audit):**
     - *Connect Event (`revoked` key):* Tiba di policy gate dan diam **2.0s** dengan indikator `deny` merah yang jelas terbaca sebelum timeline mereset.

---

### B. Penyesuaian Durasi Phase di `data.js`

- Penyesuaian estimasi badge duration agar mencerminkan penambahan jeda baca (total durasi bertambah ~15-20 detik secara proporsional):
  - `ACT 1`: 24s (tetap)
  - `ACT 2`: 22s ➔ **27s**
  - `ACT 3`: 28s ➔ **34s**
  - `ACT 4`: 30s ➔ **36s**
  - `ACT 5`: 22s ➔ **26s**

---

## 4. Rencana Verifikasi & Uji Coba

1. **Kompilasi esbuild:**
   - Menjalankan tes build esbuild untuk memastikan tidak ada syntax error.
2. **Playback Verification:**
   - Memastikan saat animasi diputar, seluruh teks di dalam payload box dapat dibaca dengan santai dan nyaman oleh manusia tanpa harus menekan tombol pause.

---

## 5. Status Dokumen

- [x] Dokumen plan dibuat di `src/content/44-ssh/revisi/2026-09-21-revisi-03-payload-read-hold-pauses.md`.
- [x] Indeks `src/content/44-ssh/revisi/README.md` diperbarui.
- [ ] **Pending Eksekusi Kode** (Menunggu eksekusi oleh agent AI berikutnya).
