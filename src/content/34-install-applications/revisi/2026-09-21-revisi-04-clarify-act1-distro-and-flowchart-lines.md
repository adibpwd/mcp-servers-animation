# Plan Revisi 04 — Clarify Act 1 Distro Purpose & Flowchart Node Line Connection Across Acts

**Tanggal:** 2026-09-21  
**Target Content:** `34-install-applications`  
**Status:** 📝 PLAN ONLY (Belum dieksekusi)

---

## 1. Latar Belakang & Masalah (Problem Statement)

1. **Masalah Act 1 (Distro Selection Ambiguity):**
   - Di Act 1 saat ini, terdapat daftar logo distro (`Ubuntu`, `Fedora`, `Arch`, `openSUSE`, `Alpine`). Namun, animasi hanya sekadar memindahkan sorotan/highlight `selected` dari Ubuntu ke Alpine secara bergantian tanpa kejelasan **maksud/pesan utama** yang ingin disampaikan kepada audiens.
   - Audiens bingung: *"Kenapa distro berganti-ganti? Apa hubungannya dengan instalasi aplikasi?"*

2. **Masalah Flow Visual & Kausalitas Antar-Act (Kurang Garis Alur Flowchart):**
   - Transisi antar-Act dan perpindahan state objek (seperti `PackageCard`, `Repository`, `Dependencies`, `Download Capsule`, dan `Install Stages`) belum didukung oleh **garis hubung / connector lines** bergaya flowchart yang jelas.
   - Tanpa garis konektor node-to-node (flow spine/lines), alur kerja package manager dari deteksi OS → query repository → kalkulasi dependensi → download archive → unpack & configure terasa melayang dan berdiri sendiri-sendiri.

---

## 2. Tujuan Revisi (Objectives)

1. **Memperjelas Maksud Act 1 (Distro Ecosystem Matching):**
   - Menjelaskan secara tegas ke audiens via animasi bahwa **"Distro yang kamu gunakan menentukan Package Manager dan Format Paket bawaan secara otomatis"**.
   - Mengubah gerakan seleksi acak menjadi animasi **Deteksi System / Matrix Selector** yang jelas: Ketika OS terdeteksi (misal: Ubuntu), panah/konektor visual langsung menunjuk dan memunculkan Package Manager-nya (`apt`) & Format Paket (`.deb`).
2. **Menambahkan Garis Connector/Flowchart Spine yang Jelas:**
   - Menambahkan garis alur (SVG Connector Lines) dengan indikator panah/pulse data yang menghubungkan:
     - **Node Distro → Node Package Manager** (Act 1 → Act 2).
     - **Package Manager → Cloud Network Repository** (Act 3).
     - **Repository Sources → Dependency Tree Resolution Node** (Act 4 → Act 5).
     - **Dependency Resolution → System Change Gate (Authorization)** (Act 5).
     - **System Gate → Download Conveyor → Cache Local** (Act 6).
     - **Cache Local → 4 Stage Pipeline (Verify → Unpack → Configure → Record)** (Act 7).
     - **Record Stage → App Installed Ledger & System Tile** (Act 8).

---

## 3. Rencana Perubahan Detail (Detailed Plan)

### A. Perubahan Data (`data.js`)

1. **Struktur Data Distro dengan Mapping Package Manager Explicit:**
   - Menambahkan metadata hubungan langsung dari Distro ke Manager & Extension:
     ```javascript
     export const DISTROS = [
       { id: 'ubuntu',   label: 'Ubuntu',   family: 'Debian family',   managerId: 'apt',    pkgFormat: '.deb',    color: '#E95420' },
       { id: 'fedora',   label: 'Fedora',   family: 'RHEL family',     managerId: 'dnf',    pkgFormat: '.rpm',    color: '#292C3E' },
       { id: 'arch',     label: 'Arch',     family: 'Arch family',     managerId: 'pacman', pkgFormat: '.pkg.tar', color: '#1793D1' },
       { id: 'opensuse', label: 'openSUSE', family: 'SUSE family',     managerId: 'zypper', pkgFormat: '.rpm',    color: '#73BA25' },
       { id: 'alpine',   label: 'Alpine',   family: 'Minimal Linux',   managerId: 'apk',    pkgFormat: '.apk',    color: '#0D597F' },
     ]
     ```

2. **Definisi Garis Alur Flowchart (`FLOW_CONNECTOR_LINES`):**
   - Menyusun array koordinat titik awal & titik akhir untuk merender SVG `<path>` konektor antar stasiun:
     - `distro-to-hub`: Dari Carousel Distro (y=334) → Package Manager Hub (y=276).
     - `hub-to-network`: Dari Package Manager Hub → Network Cloud (y=448).
     - `network-to-sources`: Dari Network Cloud → Source Grid (y=384).
     - `sources-to-plan`: Dari Sources → Dependency Resolution Tray (y=384).
     - `plan-to-gate`: Dari Resolution Tray → Approval Gate (y=762).
     - `gate-to-cache`: Dari Approval Gate → Cache Local Conveyor.
     - `cache-to-install`: Dari Cache Local → Conveyor Pipeline (Verify, Unpack, Configure, Record).
     - `install-to-ready`: Dari Record Stage → Package Database Ledger & App Tile (y=897).

3. **Penyempurnaan Caption Act 1 & Log Terminal:**
   - Update `CAPTIONS.DISTRO`: *"Setiap Distro Linux memiliki Package Manager dan Format Paket bawaan tersendiri."*
   - Update `TERMINAL_LINES.OUT_DISTRO`: `[SYSTEM DETECT] OS: Ubuntu -> Auto Select Package Manager: apt (.deb package)`

---

### B. Perubahan Animasi & Visual (`Animation.jsx`)

1. **Redesign Act 1 — Interactive Distro Inspector Motion:**
   - **Gerakan Animasi Baru:**
     1. Terminal menampilkan prompt `system-info / detect-os`.
     2. Cursor/Selector scanning berjalan melewati kartu distro.
     3. Ketika selector berhenti di **Ubuntu**, garis konektor menyala memancarkan pulse menuju ke **Package Manager Hub**, menampilkan badge: **`apt` | `.deb`**.
     4. Menampilkan perbandingan cepat (quick preview pulse): Jika memilih **Fedora** → terhubung ke **`dnf` | `.rpm`**; Jika **Arch** → terhubung ke **`pacman` | `.pkg.tar`**.
     5. Animasi mengunci pilihan sampel pada **Ubuntu (apt)** sebagai alur demonstrasi ke Act 2.

2. **Komponen SVG Connector Lines (Flowchart Spine):**
   - Membuat sub-komponen `<FlowConnectors />`:
     - Merender garis putus-putus (`strokeDasharray="4 4"`) atau solid stroke bertekstur neon glow (`#38BDF8`).
     - Menambahkan partikel animasi (`<circle>` dengan GSAP/SVG animate) yang berjalan menyusuri garis sesuai Act yang aktif untuk memperjelas aliran data/instruksi.

3. **Penyesuaian Flowchart Case & Node Spacing Antar Act:**
   - **Act 2 (Manager Carousel):** Garis bercabang (1-to-5 branch line) muncul dari Distro Node menuju ke 5 Manager Stations untuk menunjukkan bahwa meskipun tool berbeda (`apt`, `dnf`, `pacman`, `zypper`, `apk`), fungsi dasarnya **sama** (*Same core job*).
   - **Act 3 (Network Repository Map):** Garis lurus vertikal dengan panah dua arah (bi-directional arrow line) yang menghubungkan Manager Hub dengan Cloud Network & Mirror.
   - **Act 5 (Transaction Plan & Gate):** Line menghubungkan Dependency Tree ke System Approval Gate dengan kunci gembok (*Lock Icon*) yang terbuka setelah persetujuan.
   - **Act 7 (Install Conveyor):** Garis alur horizontal tegas menghubungkan 4 tahap: `Verifikasi ──► Unpack ──► Konfigurasi ──► Record`.

---

## 4. Rencana Verifikasi & Uji Coba

1. **Pemeriksaan Sintaks & Kompilasi:**
   - Menjalankan build check `npx esbuild` untuk memastikan `Animation.jsx` dan `data.js` tidak mengandung syntax error.
2. **Verifikasi Alur Narasi & Visual:**
   - Memastikan Act 1 dengan jelas menyampaikan alasan mengapa ada banyak distro (tiap distro punya pasangan Manager & Format Paket sendiri).
   - Memastikan seluruh konektor garis terhubung secara presisi antar koordinat stasiun tanpa ada line yang terpotong/misaligned.

---

## 5. Ringkasan Status

- [x] Menyusun dokumen plan revisi 04 di `src/content/34-install-applications/revisi/2026-09-21-revisi-04-clarify-act1-distro-and-flowchart-lines.md`.
- [x] memperbarui indeks revisi `src/content/34-install-applications/revisi/README.md`.
- [ ] **Pending Eksekusi Kode** (Menunggu instruksi/eksekusi oleh agent AI berikutnya).
