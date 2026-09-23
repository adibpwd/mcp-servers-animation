# REVISI 01 — Motion Flowchart, Multi-Case Pola Waktu, & Dynamic Near-Element Caption

| Item | Detail |
|---|---|
| Topik | **35 Cron Job** (`src/content/35-cron-job/`) |
| Tanggal | 2026-09-23 |
| Status | 📝 **PLAN-ONLY (Belum Dieksekusi ke Kode)** |
| Dasar Masalah | Masukan dari evaluasi visual: (1) Di Act 1 elemen muncul serentak tanpa urutan flowchart atau garis relasi yang jelas sehingga alur kerja tidak terbaca, (2) Di Act 2 hanya ada 1 case contoh pola cron, perlu multiple case nyata agar mudah dipahami, (3) Posisi `CaptionBar` statis di atas terlalu jauh dari elemen yang sedang aktif, audiens harus memindahkan fokus mata bolak-balik antara teks atas dan icon bawah. |

---

## 🎯 Tujuan Revisi

1. **Flowchart & Motion Berurutan di Act 1 (Dari Jam ➔ crond ➔ Daftar Job)**:
   - Menghilangkan kemunculan kotak/icon yang serempak/mendadak.
   - Menambahkan garis alur (spine / flowchart connection lines) dari Jam Timer menuju Daemon `crond`, lalu bercabang menyapu ke tiap Job berurutan (Backup DB ➔ Bersihkan Tmp ➔ Kirim Laporan).
2. **Multiple Real-World Cases di Act 2 (3 Contoh Pola Waktu)**:
   - Mengganti tampilan statis 1 case menjadi 3 contoh konkret beranimasi:
     - **Case 1**: `0 2 * * *` ➔ *Tiap jam 02:00 pagi* (Daily backup).
     - **Case 2**: `*/15 * * * *` ➔ *Tiap 15 menit sekali* (Healthcheck/clean tmp).
     - **Case 3**: `0 9 * * 1` ➔ *Tiap Senin jam 09:00 pagi* (Weekly report).
   - Menambahkan panah/highlight mapping dari tiap kolom field ke interpretasi maknanya.
3. **Dynamic Near-Element Caption Positioning (Dekat dengan Elemen Aktif)**:
   - Menghilangkan atau memindahkan `CaptionBar` statis di atas `y=60`.
   - Mengganti teks penjelasan menjadi badge/chip deskripsi kontekstual yang posisinya menempel dekat di atas/bawah icon atau stasiun yang sedang disorot (near-element dynamic caption).

---

## 🔍 Analisis Per-Act & Rencana Perubahan Visual

### 🎬 ACT 1 — Daemon Tak Pernah Tidur (Alur Kausal Bertahap)
* **Masalah Saat Ini**: Jam tick, lalu 3 kotak job muncul bersamaan di bawah, kemudian menghilang tiba-tiba digantikan anchor `crond`.
* **Solusi Perbaikan**:
  1. **Step 1 (Timer Pulses)**: Jam analog di atas (`y=240`) berputar dan memancarkan denyut waktu (`tick`).
  2. **Step 2 (Flowline ke Daemon `crond`)**: Garis alur vertikal meluncur ke bawah dari Jam menuju `crond` (`y=440`), menunjukkan `crond` aktif terbangun setiap kali menit berganti.
  3. **Step 3 (Branching Flowlines ke Job List)**: Dari `crond`, garis cabang (`branching lines`) menjulur ke 3 node job di bawahnya (`y=620`):
     - Cabang 1: Meluncur ke `Backup DB` (jam 2 pagi) + chip caption di atas box.
     - Cabang 2: Meluncur ke `Bersihkan Tmp` (tiap 30 mnt) + chip caption di atas box.
     - Cabang 3: Meluncur ke `Kirim Laporan` (tiap Senin) + chip caption di atas box.
  4. **Step 4 (Fokus ke Daemon)**: Garis dan job meredup lembut, menyorot `crond` sebagai otak koordinator persisten yang akan dibawa ke Act berikutnya.

---

### 🎬 ACT 2 — Membaca 5 Bintang Crontab (Multi-Case Showcase)
* **Masalah Saat Ini**: Terdapat 5 slot field waktu, simbol statis, dan hanya 1 baris contoh `0 2 * * *`.
* **Solusi Perbaikan**:
  1. **Step 1 (Header Anatomi 5 Kolom)**:
     - Baris 5 slot: `[Menit] [Jam] [Tgl] [Bulan] [Hari]`.
  2. **Step 2 (Case 1: Daily Specific Time)**:
     - Tampil baris: `0  2  *  *  *`
     - Panah highlight menunjuk kolom `0` (Menit 0) & `2` (Jam 2), 3 bintang sisa (Setiap hari/bulan).
     - Badge makna di bawah baris: 🟢 *"Setiap jam 02:00 pagi setiap hari"* (Kasus: Backup Database).
  3. **Step 3 (Case 2: Interval / Step Time)**:
     - Tampil transisi ke baris: `*/15  *  *  *  *`
     - Panah highlight menunjuk kolom `*/15` (Kelipatan 15 menit).
     - Badge makna di bawah baris: 🔵 *"Setiap 15 menit sekali nonstop"* (Kasus: Bersihkan Temp/Cache).
  4. **Step 4 (Case 3: Day of Week Specific)**:
     - Tampil transisi ke baris: `0  9  *  *  1`
     - Panah highlight menunjuk kolom `0 9` (Jam 09:00) dan kolom `1` (Senin).
     - Badge makna di bawah baris: 🟣 *"Setiap hari Senin jam 09:00 pagi"* (Kasus: Kirim Laporan Mingguan).

---

### 🎬 ACT 3 — Memicu Script & Worker (Flowchart Eksekusi)
* **Penyelarasan Near-Element Caption**:
  - Teks penjelasan *"Pukul 02:00 pola cocok"* ditaruh tepat di samping jam digital target.
  - Saat garis alur menjalar ke *"Fork worker"* dan *"Jalankan script"*, caption deskripsi mengikuti di dekat kartu masing-masing tanpa audiens harus mendongak ke puncak canvas.

---

### 🎬 ACT 4 — Eksekusi Silent & Log Redirection
* **Penyelarasan Near-Element Caption**:
  - Label peringatan bahaya `hilang / terbuang` diletakkan tepat di ujung lubang output stdout/stderr.
  - Jalur pipa belok `>> /var/log/backup.log 2>&1` terhubung jelas dengan animasi pulsa data masuk ke dalam file log, disertai label penjelas di samping file log.

---

## 📐 Rencana Perubahan Teknis File

1. **`src/content/35-cron-job/data.js`**:
   - Menambahkan struktur data multi-case di Act 2: `CRON_CASES` (3 contoh konfigurasi lengkap dengan label kasus & badge interpretasi).
   - Menyesuaikan koordinat stasiun agar proporsional dengan alur flowchart garis spine vertikal & horizontal.
2. **`src/content/35-cron-job/acts/common.jsx`**:
   - Menghapus komponen `CaptionBar` statis atas.
   - Menambahkan helper `NearElementCaption` / `FlowBadge` untuk menempatkan tooltip caption kontekstual di dekat target coordinate `(x, y)`.
   - Menambahkan komponen garis flowchart dengan arrowhead SVG / dashed flow pulse.
3. **`src/content/35-cron-job/acts/Act1DaemonTakTidur.jsx`**:
   - Membangun struktur layout berjenjang: Jam (`y=220`) ➔ Garis spine vertikal ➔ Daemon `crond` (`y=420`) ➔ Garis cabang ➔ 3 Node Pekerjaan (`y=640`).
4. **`src/content/35-cron-job/acts/Act2LimaBintang.jsx`**:
   - Merombak visual Act 2 menjadi slider/stepper 3 Case interaktif dengan panah penunjuk kolom aktif.
5. **`src/content/35-cron-job/Animation.jsx`**:
   - Mengatur timeline GSAP agar menyalakan elemen satu per satu mengikuti urutan kausal flowchart, bukan serentak.

---

## 📌 Status
Dokumen ini adalah **perencanaan revisi 01 (plan-only)**. Perubahan kode komponen React/SVG akan dieksekusi setelah mendapatkan arahan/konfirmasi selanjutnya.
