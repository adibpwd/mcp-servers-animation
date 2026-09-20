# REVISI 05 — 65 Systemd: Perbaikan Layout Overflow, Delay Transisi Act, dan Flow Diagnosis

| Item | Keputusan |
|---|---|
| Content | 65 — Systemd (Services, systemd, dan Linux Logs) |
| Status | ✅ DIEKSEKUSI — disetujui eksplisit oleh user 2026-09-20. Catatan proses: kode `data.js`/`Animation.jsx` sudah diterapkan sesi sebelumnya sebelum persetujuan; setelah persetujuan, setiap poin §1–§2 diaudit ulang ke kode dan disetujui apa adanya (satu koreksi: highlight Step 2 = `j6`). Preview manual oleh user. |
| Tanggal | 2026-09-20 |
| Masalah utama | 1. Text & icon overflow/offside di Managed Process, Journal, dan padding gear Manager.<br>2. Jeda/delay antar Act terlalu lama (3-9 detik hold kosong per Act).<br>3. Garis alur & highlight Act 6 Diagnosis (Status, Journal, Konteks) kurang tepat.<br>4. Caption melayang (`IconCaption`) di stasiun kanan overflow melewati batas canvas (732px). |
| File diubah | `data.js`, `Animation.jsx`, `revisi/README.md` |

---

## 1. Rincian Perbaikan

### 1.1 Layout, Alignment, dan Anti-Overflow (Poin 1 & 4)
- **Managed Process Station (`STATIONS.managedProcess`):**
  - Koordinat & ukuran disesuaikan: ~~`cx: 585, cy: 420, w: 220, h: 100`~~ → **`cx: 624, cy: 420, w: 176, h: 100`** (lihat §4: angka awal menabrak Manager).
  - Icon dipindah ke `x: -62`; teks `MANAGED_PROCESS_LABEL`, `PID`, dan `PATH` mulai dari `x: -42` (proporsional terhadap lebar 176), sehingga tidak meluber keluar kartu.
- **Journal Station (`STATIONS.journal`):**
  - Lebar kartu diperbesar dari `w: 300` menjadi `w: 340`, `cx: 540` (kanan `540 + 170 = 710px`, aman di dalam canvas 732px).
  - Teks entri journal memakai font 9.5px monospace dengan batas kanan yang aman sehingga entri panjang (`Restart attempt 1/3 scheduled`) tidak overflow.
- **Systemd Manager Station (`STATIONS.manager`):**
  - Posisi icon gear `Icon type="gear"` digeser dari `y: -62` ke `y: -50` dan tinggi stasiun disesuaikan `h: 175`, memberikan padding atas ~15px yang cukup terhadap garis border.
- **Floating Caption Smart Clamping (`IconCaption`):**
  - `IconCaption` diperbarui dengan penentuan `textAnchor` dan batas `x` otomatis (`Math.min(st.cx + 40, 700)` untuk stasiun kanan, `Math.max(st.cx - 40, 32)` untuk stasiun kiri).
  - Jika panjang caption > 32 karakter, caption dipotong dua baris `<tspan>` agar tidak melebihi lebar maksimum canvas (732px).

### 1.2 Pangkas Delay Transisi Antar-Act (Poin 2)
- Menghapus hold kosong di akhir setiap Act (sebelumnya terdapat jeda nganggur 3.5s - 9.0s di Act 1–5):
  - **Act 1:** Selesai di `t = 7.5s` (sebelumnya 12.0s).
  - **Act 2:** Selesai di `t = 6.2s` (sebelumnya 12.0s).
  - **Act 3:** Selesai di `t = 8.5s` (sebelumnya 16.0s).
  - **Act 4:** Selesai di `t = 8.2s` (sebelumnya 12.0s).
  - **Act 5:** Selesai di `t = 11.5s` (sebelumnya 15.0s).
  - **Act 6:** Selesai di `t = 9.8s` (sebelumnya 13.0s).
- Mengupdate array `PHASES` di `data.js` agar durasi tiap Act sinkron dengan timeline baru (total durasi berkurang dari ~80s menjadi ~52s tanpa mengurangi materi visual).

### 1.3 Perbaikan Garis & Highlight Diagnosis Act 6 (Poin 3)
- **Garis Koneksi Ketiga:** Menambahkan garis `boot-to-diagnosis` dari `bootTarget` ke `diagnosis` agar ketiga step diagnosis (STATUS, JOURNAL, KONTEKS) masing-masing memiliki garis alur sumber sendiri:
  - Step 0 (STATUS) → highlight `managed-to-diagnosis` (dari Managed Process).
  - Step 1 (JOURNAL) → highlight `journal-to-diagnosis` (dari Journal).
  - Step 2 (KONTEKS) → highlight `boot-to-diagnosis` (dari Boot Target / Dependency).
- **Highlight Journal Dinamis:** Entri journal di Act 6 di-highlight secara bertahap sesuai step diagnosis yang aktif (Step 0 = netral, Step 1 = highlight `j4` & `j5`, Step 2 = highlight `j6` & konteks boot).

---

## 2. Tabel Perubahan Durasi Act (`PHASES`)

| Act | Nama Act | Durasi Lama | Durasi Baru | Alasan |
|---|---|---|---|---|
| Act 1 | DARI PROCESS KE SERVICE | 12.0s | 7.5s | Pangkas 4.5s hold kosong setelah processManual dim |
| Act 2 | MANAGER MENJALANKAN LIFECYCLE | 12.0s | 6.2s | Pangkas 5.8s hold kosong setelah PID note |
| Act 3 | BOOT & DEPENDENCY | 16.0s | 8.5s | Pangkas 7.5s hold kosong setelah Enable vs Start |
| Act 4 | KETIKA PROCESS GAGAL | 12.0s | 8.2s | Pangkas 3.8s hold kosong setelah Back Active |
| Act 5 | JEJAK DI JOURNAL | 15.0s | 11.5s | Pangkas 3.5s hold kosong setelah entri j7 selesai |
| Act 6 | DIAGNOSIS: IKUTI BUKTI | 13.0s | 9.8s | Pangkas 3.2s hold kosong setelah closing stamps |
| **Total** | | **80.0s** | **51.7s** | Transisi mulus 0 delay antar-Act |

---

## 3. Checklist Verifikasi
- [x] Dokumen revisi `2026-09-20-revisi-05-layout-cleanup-act-timing-diagnosis-fix.md` dibuat.
- [x] Update `revisi/README.md` (baris revisi-05 berstatus SUDAH DIEKSEKUSI).
- [x] Applied ke `data.js` (STATIONS, PHASES 51.7 s, garis `boot-to-diagnosis`) & `Animation.jsx` (posisi/teks Managed Process, lebar Journal + font 9.5, gear Manager y -50, `IconCaption` clamp + wrap 2 baris, timeline Act dipangkas, garis + highlight diagnosis per step; Step 2 memakai `j6` saja).
- [x] Build / compile test pass without error (esbuild bundle `Animation.jsx`, 2026-09-20).
- [ ] Preview manual (dilakukan user) dan ukur ulang durasi Act dari timeline nyata.
- [ ] Export MP4 test.

---

## 4. Catatan eksekusi ulang (koreksi terhadap eksekusi pertama)

Eksekusi pertama hanya mencocokkan angka dokumen ke kode dan menyatakannya selesai. Pemeriksaan geometri menemukan tiga cacat yang diperbaiki pada eksekusi ulang:

1. **Root cause caption overflow (poin 4).** `IconCaption` dirender di dalam `<g transform="translate(cx, cy)">` tiap stasiun, tetapi memakai koordinat absolut (`st.cx`, `st.cy`), sehingga posisinya terhitung dua kali (stasiun kanan jatuh di x > 1000, di luar canvas) dan clamp tidak menolong. Sekarang koordinat dihitung lokal: batas aman 32–700 dihitung absolut lalu dikonversi ke lokal (`x - st.cx`, `y = h/2 + 20`). Clamp ±40 dan wrap ≥ 32 karakter sesuai §1.1.
2. **Angka dokumen menabrak Manager.** `managedProcess` `cx 585, w 220` berada di x 475–695, sedangkan Manager berakhir di x 516 (overlap 41 px, ditambah Journal hanya 5 px di bawahnya). Standar `05` Bab A minta gap ≥ 20. Nilai final (dihitung dari `data.js`): `managedProcess cx 624, w 176` (x 536–712) dan `journal cy 600, h 220` (y 490–710). Gap: Manager↔Managed 20, Managed↔Journal 20, Journal↔Diagnosis 20, semua tepi kanan ≤ 712.
3. **Teks Journal menempel ke border.** Entri `Restart attempt 1/3 scheduled` berakhir di x 169 pada kartu yang tepinya 170. Tag sumber dan teks digeser (`-98` dan `-30`), entri terpanjang kini berakhir ±135 dari tepi 170 (highlight sampai 162).

Bukti: hitung gap semua pasangan stasiun dari `data.js` aktual (semua ≥ 20, semua di dalam body 732×965), total durasi 51.7 s, compile esbuild lolos. Belum ada verifikasi visual; preview manual oleh user.
