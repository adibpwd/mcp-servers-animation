# Plan Revisi 04 — Sourcing Inline SVG Icons & Fix Intro Title Clipping in Content 48

**Tanggal:** 2026-09-21  
**Target Content:** `48-shell-terminal-command-line`  
**Status:** 📝 PLAN ONLY (Belum dieksekusi)

---

## 1. Latar Belakang & Masalah (Problem Statement)

1. **Masalah Intro Title Terpotong di Sisi Kanan:**
   - Pada komponen `IntroHeaderMorphV1`, judul `SHELL EXPLAINED` (terutama kata `EXPLAINED`) terpotong di tepi kanan canvas akibat font/spacing yang terlalu lebar.
   - Kata `EXPLAINED` membutuhkan penyesuaian font-size / scaling agar muat utuh dan indah secara estetis.

2. **Permintaan Icon Inline SVG & Sourcing Logo Asli (Wikimedia/Wikipedia):**
   - Di content `48-shell-terminal-command-line`, visualisasi stasiun dan komponen arsitektur shell saat ini masih banyak yang memakai primitive kotak/lingkaran netral.
   - Diperlukan penambahan **Inline SVG Icons** yang bersih dan logo asli berlisensi terbuka (seperti GNU Bash logo) untuk memperkaya tampilan visual:
     - **Terminal Station**: Icon window terminal / PTY.
     - **Shell Engine Station**: Logo GNU Bash asli (dari Wikimedia Commons) + icon gear/interpreter.
     - **Builtin vs Executable Nodes**: Icon petir/fast-path untuk Builtin (`pwd`), icon folder/binary executable (`ls`).
     - **Data Pipes & Streams**: Icon untuk STDIN (`<`), STDOUT (`>`), dan STDERR (`2>`).
     - **Quote Shield & Security**: Icon perisai/lock (`" Quote Shield "`).

---

## 2. Rencana Perubahan Detail (Detailed Plan)

### A. Perbaikan Title Intro Sisi Kanan Terpotong (`data.js` & `Animation.jsx`)

1. **Restrukturisasi `INTRO_TITLE_A` & `INTRO_TITLE_B` (`data.js`):**
   - Mengatur kata judul agar terbagi proporsional:
     - `INTRO_TITLE_A`: `'SHELL '`
     - `INTRO_TITLE_B`: `'EXPLAINED'`
2. **Adjustment Scaling Morph Header (`Animation.jsx`):**
   - Memastikan `IntroHeaderMorphV1` menerima prop scaling font yang lebih aman (max `28px - 32px` pada hero mode, atau penyesuaian `letterSpacing`) agar kata `EXPLAINED` bebas dari terpotong di tepi kanan margin canvas.

---

### B. Penambahan Inline SVG Icons Helper (`acts/common.jsx` / `icons/inlineSvg.jsx`)

1. **Icon Arsitektur Utama (Terminal, PTY, Shell, System):**
   - `IconTerminal`: Box terminal window dengan prompt `>_`.
   - `IconBashLogo`: Logo resmi GNU Bash (vector inline dari Wikimedia/Wikipedia SVG).
   - `IconBuiltinFast`: Icon petir/lightning bolt hijau melambangkan eksekusi cepat tanpa fork process.
   - `IconBinaryExec`: Icon file biner executable dengan roda gigi pencarian `PATH`.
   - `IconDataPipe`: Icon pipa/stream data untuk `STDIN`, `STDOUT`, dan `STDERR`.
   - `IconQuoteShield`: Icon perisai gembok/quote pelindung spasi argument.

2. **Integrasi ke Komponen Presentational (`acts/common.jsx`):**
   - Memasang `IconTerminal` di stasiun `Terminal Emulator`.
   - Memasang `IconBashLogo` di stasiun `Shell Engine`.
   - Memasang `IconDataPipe` pada jalur aliran stream Act 4.
   - Memasang `IconQuoteShield` di stasiun Quote Shield Act 6.

---

## 3. Rencana Verifikasi

1. **Pemeriksaan Kompilasi Build:**
   - Menjalankan esbuild check untuk meyakinkan tidak ada kesalahan syntax JSX.
2. **Verifikasi Visual:**
   - Memastikan kata `EXPLAINED` pada intro header tercetak utuh dan bebas dari terpotong di sisi kanan.
   - Memastikan icon-icon SVG baru tampil tajam, presisi, dan proporsional di tiap stasiun.

---

## 4. Ringkasan Status

- [x] Menyusun dokumen plan revisi 04 di `src/content/48-shell-terminal-command-line/revisi/2026-09-21-revisi-04-inline-svg-icons-and-intro-overflow-fix.md`.
- [x] Memperbarui indeks revisi `src/content/48-shell-terminal-command-line/revisi/README.md`.
- [ ] **Pending Eksekusi Kode** (Menunggu instruksi/eksekusi agent AI berikutnya).
