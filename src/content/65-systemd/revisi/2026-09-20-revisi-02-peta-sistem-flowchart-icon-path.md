# REVISI PLAN 02 — 65 Systemd: Peta Sistem Flowchart, Icon PNG, dan Info Path Linux

| Item | Keputusan |
|---|---|
| Content | 65 — Systemd (Services, systemd, dan Linux Logs) |
| Status | PLAN ONLY — jangan dieksekusi sebelum ada persetujuan eksplisit |
| Tanggal | 2026-09-20 |
| Dokumen ini | Revisi terpisah; melanjutkan `revisi-01-implementasi-awal` dan melengkapi `_docs/SYSTEMD_SERVICES_LOGS_PLAN.md`, tidak mengubah file implementasi |
| Audiens | Pemula yang sudah memahami process |
| Fokus | Visual berupa peta sistem Linux dengan garis alur, icon yang dikenali, dan lokasi folder nyata di tiap langkah |
| Sumber temuan | Pembacaan `Animation.jsx` (463 baris), `data.js` (212 baris), `manifest.js`, `metadata.json`, plan utama, dan token `PortraitSceneLayoutV1.js`; BELUM diverifikasi lewat preview browser |

## 1. Umpan balik yang ditangani

| No | Umpan balik | Ditangani di |
|---|---|---|
| 1 | Icon masih minim; perlu dibuat icon | Bagian 2.1, 9, Lampiran A |
| 2 | Bila ada path folder di sistem Linux, tampilkan infonya supaya terlihat gerak terjadi di path mana | Bagian 2.2, 3.3, 5, 6 (Path Bar, path tag, Path Atlas) |
| 3 | Jangan tiba-tiba muncul kotak; beri flowchart/garis alur dari mana ke mana; tidak harus dari tengah, boleh dari pojok, asal tempat cukup untuk semua Act | Bagian 2.3, 3, 4, 6 |

## 2. Diagnosis dari kode aktual

Catatan metode: angka di bawah dihitung dari koordinat dan `fontSize` di kode
serta token `DEFAULT_LAYOUT_V1` (body x=44, y=235, lebar 732, tinggi 965).
Belum diverifikasi visual.

### 2.1 Icon minim

| Temuan | Bukti | Dampak |
|---|---|---|
| Tidak ada folder `icons/`; seluruh visual berupa `rect` + `text` | `Animation.jsx`: unit card, manager hub, dep row, journal panel, diagnosis row, `Stamp` | Process, unit file, manager, journal tidak punya bentuk yang dikenali |
| Satu-satunya elemen grafis selain kotak adalah satu panah kecil di Act 3 (`M -100 -30 L -40 -30`) dan lingkaran state | Blok `depRow` | Tidak ada gambaran "benda" |
| Teks jauh di bawah batas keterbacaan: `step.source` 6.5, `step.question` 7, catatan enable/start 7, label dependency 7.5, isi journal 7.5–8, badge 8, field unit 9 | `depRow`, `journalPanel`, `diagnosisRow`, unit fields | Standar 05: caption minimum 11 |

### 2.2 Tidak ada info path

| Temuan | Bukti | Dampak |
|---|---|---|
| Satu-satunya "lokasi" adalah `wantedBy: multi-user.target` | `UNIT_INFO` di `data.js` | Penonton tidak tahu unit file tersimpan di mana |
| Tidak ada path untuk unit file, process (`/proc`), cgroup, socket log, maupun penyimpanan journal | Seluruh `data.js` | Tidak ada gambaran gerak terjadi di bagian sistem yang mana |
| Journal digambar sebagai panel tanpa asal dan tanpa tempat simpan | `journalPanel` | Tidak terlihat bahwa journal adalah data di disk atau RAM |

### 2.3 Kotak muncul tiba-tiba, tanpa alur

| Temuan | Bukti | Dampak |
|---|---|---|
| Semua objek utama memakai `popIn` (skala 0→1) di `x=366` tanpa sumber: `unitCard`, `managerHub`, `depRow`, `journalPanel`, `diagnosisRow`, `closingStamps` | `popIn(tl, ..., 'managerHub')` dan sejenisnya | Kotak muncul begitu saja |
| Praktis tidak ada garis penghubung antar objek | Seluruh `Animation.jsx` | Arah "dari mana ke mana" tidak terbaca |
| Satu lajur vertikal di tengah: lebar kartu 300, 280, 360, 3×116 dari total body 732, sisa ±186 di kiri dan kanan kosong | `AXIS_X = 366` | Tempat terbuang, sehingga semua dipaksa bertumpuk vertikal |
| Blok Act 3 (`depRow`) memuat lima elemen sekaligus dalam satu `popIn` | `depRow` | Boot target, unit, dependency, ENABLE, START tampil serentak |
| Tabrakan Act 6: caption di y=845 (kotak 827–861) menimpa baris journal terakhir (y 819–841), dan panel journal (y 640–860) berjarak 15 dari diagnosis row (y 875) | `captionY = DIAGNOSIS_Y - 60`, entri ke-7 di `40 + 6*25` | Teks saling menimpa; jarak <20 |
| Panel journal (y 640–860) dan diagnosis (y 905) memasuki sub-zona closing (lokal ≥785) | `JOURNAL_PANEL_Y`, `DIAGNOSIS_Y` vs `closing.yStart 1020 - 235 = 785` | Aktor utama di zona closing |

### 2.4 Temuan tambahan

| No | Temuan | Standar/akibat | Tindakan di revisi |
|---|---|---|---|
| a | Act 1 mengubah kartu process yang sama (PID 4021) menjadi service; padahal systemd menjalankan process baru dari unit, bukan "mengadopsi" process manual | Akurasi teknis | Process manual dan process layanan dipisah (PID berbeda), Bagian 6.1–6.2 |
| b | Narasi lewat `say()` dan `caption` bar bergeser per beat (`captionY`) | 03 §1.D: `say()` deprecated; caption menempel di objek | Diganti `IconCaption`/`PathLabel` |
| c | Label langkah diagnosis berbentuk pertanyaan: "Unit dikelola & active?", "Kapan gagal / direstart?", "Mengapa app gagal?" | Caption tidak boleh kalimat tanya | Diganti pernyataan (Bagian 10) |
| d | Suara `popIn` memakai `volume` dan `speed` dari closure `useEffect` (deps `[]`), bukan ref; perubahan volume/speed setelah mount tidak berlaku pada suara pop | Bug SFX | Semua SFX lewat ref (checklist 4.1) |
| e | `metadata.json`: `subtitle` kosong dan `tags` kosong, sedangkan `manifest.js` terisi | 02 §5: keduanya harus sinkron | Disinkronkan saat eksekusi |
| f | `WHOOSH`, `SLIDE_IN`, `LOCK` ada di `SFX_MAP` tetapi tidak dipanggil | 06 §3 dead config | Dipakai (Bagian 10.2) |
| g | Durasi Act dan `SFX_SCHEDULES` belum diukur/disambungkan | 06 | Masuk checklist |

## 3. Keputusan yang dikunci

### 3.1 Peta Sistem dua dimensi (menjawab poin 3)

Lajur tunggal di tengah diganti peta dengan tujuh stasiun yang tersebar di
pojok dan sisi body. Stasiun tidak muncul serentak: tiap stasiun lahir ketika
garis alur dari stasiun sebelumnya sampai kepadanya (frame tergambar, ikon
menyala di ujung garis). Stasiun dari Act sebelumnya tetap ada (redup) sehingga
di Act 6 seluruh peta terlihat utuh. Tidak ada `popIn` kotak tanpa sumber.

### 3.2 Aturan Asal-Usul

Setiap objek baru harus memenuhi salah satu:

1. **Lahir dari garis**: garis alur tergambar dari objek sumber, lalu objek menyala di ujungnya.
2. **Dipicu peristiwa**: muncul karena pulse/paket yang tiba (mis. baris journal lahir saat pulse dari process sampai).
3. **Sudah ada redup**: stasiun/jalur dari Act sebelumnya menyala kembali.

Setiap garis berlabel (`PathLabel`) menyebut apa yang mengalir; bila jalurnya
adalah path Linux nyata, path itu yang menjadi label.

### 3.3 Path Bar dan path tag (menjawab poin 2)

- **Path Bar**: strip tunggal di atas body (y lokal 0–40) berisi ikon folder,
  label `LOKASI`, dan path aktif dalam monospace. Path berganti (crossfade 0.3 s)
  mengikuti stasiun yang sedang disorot.
- **Path tag**: chip kecil di stasiun untuk lokasi yang dibahas (`/proc/4021/`,
  path cgroup, dan seterusnya), font monospace 11–12.
- Path Bar adalah channel path; bukan kalimat, jadi tidak bersaing dengan caption.
- Daftar path dan alasannya ada di Path Atlas (Bagian 5).
- Tidak ada command (`systemctl`, `journalctl`); hanya lokasi dan nama unit,
  sesuai batas aman plan utama.

### 3.4 Caption menempel di objek

Caption memakai `IconCaption` (di bawah icon) atau `PathLabel` (di garis),
maksimal 5 kata, pernyataan, tanpa emoji dan kata ganti orang, font minimum 12
untuk caption dan 11 untuk label sekunder. `CaptionBar` dan `say()` dihapus.

### 3.5 Alasan 6 Act dan durasi

Plan utama menetapkan enam Act (gabungan systemd 65 dan logs 67) dan sudah
diimplementasikan; penambahan alur, path, dan boot demonstration
memperpanjang tiap Act.

| | Lama | Revisi |
|---|---:|---:|
| Act 1 Dari process ke service | 9.0 s | 12 s |
| Act 2 Manager menjalankan lifecycle | 9.5 s | 12 s |
| Act 3 Boot, dependency, enable ≠ start | 10.0 s | 16 s |
| Act 4 Ketika process gagal | 9.5 s | 12 s |
| Act 5 Jejak di journal | 10.0 s | 15 s |
| Act 6 Diagnosis: ikuti bukti | 9.0 s | 13 s |
| **Total Act** | **57 s** | **80 s** |
| Intro | ±1 s | ±1 s |

Angka revisi adalah estimasi; WAJIB diukur ulang dari timeline nyata.

