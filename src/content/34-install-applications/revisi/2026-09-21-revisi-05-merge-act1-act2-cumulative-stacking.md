# Plan Revisi 05 — Merge Act 1 & 2 (Distro & Package Manager Integration), Cumulative Fast Stacking & Layout Spacing

**Tanggal:** 2026-09-21  
**Target Content:** `34-install-applications`  
**Status:** 📝 PLAN ONLY (Belum dieksekusi)

---

## 1. Latar Belakang & Masalah (Problem Statement)

1. **Pengulangan Konten Antara Act 1 & Act 2:**
   - Di Act 1 ditunjukkan daftar Distro (`Ubuntu`, `Fedora`, `Arch`, `openSUSE`, `Alpine`). Kemudian di Act 2 muncul lagi daftar Package Manager (`apt`, `dnf`, `pacman`, `zypper`, `apk`).
   - Hal ini membuat tayangan berulang dan membuang waktu audiens karena `apt` dan distro sebenarnya merupakan satu kesatuan ekosistem yang bisa dijelaskan langsung secara bersamaan.

2. **Pergerakan Visual Lambat & Hilang-Timbul (Carousel Pop):**
   - Saat ini, penayangan manager/distro satu per satu menghilangkan item sebelumnya, sehingga audiens tidak melihat gambaran utuh (*full comparison overview*).

3. **Layout & Vertical Spacing Terlalu Mepet:**
   - Jarak antar-stasiun (Height/Margin) dari Terminal ke Hub, Carousel, dan Conveyor terasa terlalu padat/mepet pada viewport canvas 732px x 965px.

---

## 2. Tujuan Revisi (Objectives)

1. **Gabungkan Act 1 & Act 2 Menjadi Satu Act Utama ("ACT 1 — DISTRO & PACKAGE MANAGER"):**
   - Mengurangi total Act dari 8 menjadi **7 Act**.
   - Menyajikan informasi distro + manager bawaannya secara langsung dalam satu tampilan terpadu.
2. **Kumulatif & Kemunculan Cepat (Cumulative Fast Stacking):**
   - Setiap distro beserta manager-nya (`Ubuntu` ➔ `apt`, `Fedora` ➔ `dnf`, `Arch` ➔ `pacman`, `openSUSE` ➔ `zypper`, `Alpine` ➔ `apk`) akan **muncul satu per satu secara cepat (fast sequential stack)**.
   - Item yang sudah muncul **TIDAK akan dihilangkan/dihapus**, melainkan tetap berada di layar membentuk susunan daftar/card grid yang utuh.
3. **Alur Flowchart Vertikal (Flow Spine Connection):**
   - Dari susunan Distro-Manager yang telah lengkap terbentuk di atas, sebuah garis alur (*flowchart line*) langsung ditarik menyambung ke tahap berikutnya di bawahnya (Repository & Jaringan).
4. **Penyesuaian Height & Margin (Layout Spacing Fix):**
   - Mengatur ulang koordinat `ZONE` vertikal agar margin antar-elemen lebih renggang dan nyaman dipandang (bebas mepet/overflow).

---

## 3. Rencana Perubahan Detail (Detailed Plan)

### A. Restrukturisasi Phase & Data (`data.js`)

1. **Penggabungan Phases (7 Act Total):**
   ```javascript
   export const PHASES = [
     { id: 'distro-manager', badge: 'ACT 1 — DISTRO & PACKAGE MANAGER BAWAAN', badgeColor: COLORS.INTRO_A, duration: 14.0 },
     { id: 'network',        badge: 'ACT 2 — REPOSITORY DI JARINGAN',            badgeColor: COLORS.NETWORK, duration: 14.0 },
     { id: 'sources',        badge: 'ACT 3 — JENIS SOURCE REPOSITORY',           badgeColor: COLORS.REPO,    duration: 16.0 },
     { id: 'plan',           badge: 'ACT 4 — RENCANA TRANSAKSI & IZIN',          badgeColor: COLORS.DEPENDENCY, duration: 14.0 },
     { id: 'download',       badge: 'ACT 5 — UNDUH ARSIP DARI MIRROR',           badgeColor: COLORS.NETWORK, duration: 14.0 },
     { id: 'install',        badge: 'ACT 6 — PROSES EKSEKUSI PASANG',            badgeColor: COLORS.ADMIN,   duration: 18.0 },
     { id: 'ready',          badge: 'ACT 7 — APLIKASI SIAP & LIKECYCLE',         badgeColor: COLORS.SUCCESS, duration: 10.0 },
   ]
   ```

2. **Gabungkan Model Distro & Manager (`DISTRO_MANAGER_MAP`):**
   ```javascript
   export const DISTRO_MANAGERS = [
     { id: 'ubuntu',   label: 'Ubuntu',   manager: 'apt',    format: '.deb',         family: 'Debian family' },
     { id: 'fedora',   label: 'Fedora',   manager: 'dnf',    format: '.rpm',          family: 'RHEL family' },
     { id: 'arch',     label: 'Arch',     manager: 'pacman', format: '.pkg.tar.*',    family: 'Arch family' },
     { id: 'opensuse', label: 'openSUSE', manager: 'zypper', format: '.rpm',          family: 'SUSE family' },
     { id: 'alpine',   label: 'Alpine',   manager: 'apk',    format: '.apk',          family: 'Minimal Linux' },
   ]
   ```

3. **Penyesuaian Zone Spacing & Vertical Margins:**
   - Memperlebar rentang zona agar tidak menumpuk mepet:
     - `TERMINAL`: yStart: 80, yEnd: 185 (tinggi 105px)
     - `DISTRO_MANAGER_HUB`: yStart: 205, yEnd: 380 (tinggi 175px)
     - `TRANSIT`: yStart: 400, yEnd: 690 (tinggi 290px)
     - `GATE`: yStart: 710, yEnd: 820 (tinggi 110px)
     - `CLOSING`: yStart: 845, yEnd: 940 (tinggi 95px)

---

### B. Perubahan Visual & Animasi (`Animation.jsx`)

1. **Cumulative Fast Stacking Animation (Act 1 Baru):**
   - Saat Act 1 dimulai, kartu distro+manager muncul bertahap dalam selang cepat (tiap **0.3s - 0.4s**).
   - Item ke-1 (`Ubuntu ➔ apt .deb`) muncul ➔ Item ke-2 (`Fedora ➔ dnf .rpm`) muncul di sebelahnya ➔ Item ke-3 (`Arch ➔ pacman`) ➔ Item ke-4 ➔ Item ke-5.
   - Semua 5 kartu **tetap bertahan di layar (kumulatif)** tanpa unmount atau redup total.
   - Setelah 5 pasang kartu muncul lengkap, kartu pilihan sampel (`Ubuntu ➔ apt`) di-highlight terang dengan stroke neon, dan sebuah **garis flowchart vertikal (`FlowLine`) ditarik meluncur dari bagian bawah kartu sampel menuju stasiun bawahnya**.

2. **Desain Card Distro+Manager Terpadu:**
   - Setiap kartu menampilkan logo/wordmark distro di bagian atas, dan badge manager (`apt`, `dnf`, dst) + format file di bagian bawah dalam 1 kontainer rapi.

3. **Koneksi Flowchart Vertikal Kontinu:**
   - Garis alur tidak terputus: `Distro/Manager Card (y:370) ──► Flow Spine (Line) ──► Network Repository (y:420) ──► Dependency Tray ──► Gate ──► Conveyor ──► Installed Database`.

---

## 4. Rencana Verifikasi

1. **Kompilasi Syntax:**
   - Menjalankan build esbuild untuk meyakinkan tidak ada error import / JSX.
2. **Pemeriksaan Visual Spacing:**
   - Memastikan margin antar zona terlihat lapang dan tidak ada elemen/teks yang saling tumpang tindih.

---

## 5. Ringkasan Status

- [x] Menyusun dokumen plan revisi 05 di `src/content/34-install-applications/revisi/2026-09-21-revisi-05-merge-act1-act2-cumulative-stacking.md`.
- [x] Memperbarui indeks revisi `src/content/34-install-applications/revisi/README.md`.
- [ ] **Pending Eksekusi Kode** (Menunggu instruksi/eksekusi agent AI berikutnya).
