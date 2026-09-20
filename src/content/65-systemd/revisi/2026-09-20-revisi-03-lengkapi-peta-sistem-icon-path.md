# REVISI PLAN 03 — 65 Systemd: Melengkapi Peta Sistem, Path Atlas, Icon, Caption/SFX

| Item | Keputusan |
|---|---|
| Content | 65 — Systemd (Services, systemd, dan Linux Logs) |
| Status | ✅ DIEKSEKUSI — lihat `2026-09-20-revisi-04-eksekusi-peta-sistem.md` (kecuali icon PNG 11.8 dan cek manual 11.10–11.12) |
| Tanggal | 2026-09-20 |
| Dokumen ini | Lanjutan `revisi-02` (berhenti di Bagian 3.5). Melengkapi Bagian 4–10 + Lampiran A yang direferensikan tapi belum ditulis. Tidak mengubah keputusan Bagian 1–3 di `revisi-02`, hanya merinci pelaksanaannya. Tidak mengubah file implementasi. |
| Rujukan pola nyata | `src/content/14-http-request-response` (komponen `FlowchartSpine`, `PathLabel`, `IconCaption` sudah dipakai & diverifikasi lewat grep — lihat revisi-03/04/09/10/11 topic itu) dan `src/content/91-linux-server/revisi/2026-09-19-revisi-01-flow-kausal-icon-chatgpt.md` (pola serupa, 1 hari lebih dulu). Komponen-komponen ini BELUM jadi shared component (`src/shared/scene-ui/v1` belum punya `FlowchartSpine`) — didefinisikan lokal per-topic seperti topic rujukan. |

## 4. Peta & Koordinat Tujuh Stasiun

Local coordinate di dalam `ContentBodyV1` (body 732×965, lihat
`05-svg-layout-asset-pipeline.md` § "Scene Zones V1"). Path Bar menempati
`y 0–40` (Bagian 5). Peta hidup di `y 40–785` (batas `closing.yStart` lokal
= 785). Prinsip sebaran: pojok/tepi dulu, tengah untuk hub yang persist,
bawah-tengah untuk sintesis akhir — bukan satu lajur vertikal.

| # | Stasiun | Lahir di Act | x, y (lokal) | Posisi visual | Bertahan sampai |
|---|---|---|---:|---|---|
| 1 | Process Manual | 1 | 130, 110 | Pojok kiri atas | Act 1 akhir (meredup, TIDAK dihapus — lihat 6.1) |
| 2 | Unit File | 1 | 602, 110 | Pojok kanan atas | Akhir video (redup setelah Act 1) |
| 3 | systemd Manager | 2 | 366, 290 | Tengah (hub, persist) | Akhir video (aktif terus, ini aktor utama) |
| 4 | Managed Process | 2 | 546, 340 | Dekat Manager, kanan-bawahnya | Akhir video (redup setelah Act 2, kecuali Act 4) |
| 5 | Boot Target & Dependency | 3 | 150, 540 | Kiri bawah | Akhir video (redup setelah Act 3) |
| 6 | Journal | 5 | 592, 540 | Kanan bawah (simetri dgn #5) | Akhir video (redup setelah Act 5) |
| 7 | Diagnosis Terminal | 6 | 366, 690 | Bawah tengah | Akhir video (payoff, tetap terang) |

Radius/ukuran box per stasiun memakai ukuran yang sudah ada di kode
(`unitCard` 300×190, `managerHub` 280×160, dst dari `Animation.jsx`
existing) — koordinat di atas cuma memindah TITIK PUSATnya, bukan ubah
ukurannya, supaya migrasi lebih murah (isi box tidak perlu digambar ulang
dari nol).

### 4.1 Cek Jarak Antar Stasiun (formula `05-svg-layout-asset-pipeline.md` §Overlap)

| Pasangan | Jarak anchor | Radius w/2 A + w/2 B (perkiraan) | Aman? |
|---|---:|---:|---|
| Process Manual (w=300) ↔ Unit File (w=300) | \|602-130\|=472 | 150+150=300 | Aman, sisa 172 |
| Manager (w=280) ↔ Managed Process (w≈140, badge kecil) | jarak diagonal ≈146 | 140+70=210 | **Perlu digeser** — lihat 4.2 |
| Boot Target (w≈300) ↔ Journal (w=360) | \|592-150\|=442 | 150+180=330 | Aman, sisa 112 |
| Manager (y=290) ↔ Boot Target (y=540) vertikal | 250 | tinggi box/2 (160/2=80) + (h/2 dependency ~90) = 170 | Aman |
| Boot Target/Journal (y=540) ↔ Diagnosis (y=690) | 150 | 90 + (tinggi diagnosis/2 ≈50) = 140 | Aman, sisa 10 — **tipis, verifikasi di preview** |

### 4.2 Perbaikan Posisi Managed Process

Jarak awal 146 < radius gabungan 210 → overlap. Geser Managed Process ke
`x=560, y=390` (turun 50px dari Manager, bukan makin ke kanan supaya
tidak mepet tepi kanan body 732). Jarak baru ke Manager pusat (366,290):
√((560-366)²+(390-290)²) = √(194²+100²) ≈ 218 ≥ 210 → aman tipis. Kalau
saat implementasi masih terasa mepet di preview, kecilkan badge Managed
Process (bukan geser Manager, karena Manager adalah hub tengah yang jadi
acuan banyak garis lain).

## 5. Path Atlas — Path Linux Nyata per Stasiun

Semua path di bawah adalah lokasi nyata dan umum (bukan karangan), sesuai
batas aman plan utama (tidak ada command `systemctl`/`journalctl`, hanya
lokasi & nama). Path Bar (strip `y 0–40`, ikon folder + label `LOKASI` +
path monospace, crossfade 0.3s) menampilkan salah satu baris ini,
mengikuti stasiun yang sedang disorot di tiap Act.

| Stasiun/Act | Path | Kenapa path ini |
|---|---|---|
| Act 1 awal (Process Manual) | *(kosong / "belum ada unit")* | Belum ada deklarasi, Path Bar sengaja kosong supaya kontras dengan baris berikutnya |
| Act 1 akhir (Unit File lahir) | `/etc/systemd/system/web-demo.service` | Lokasi standar unit buatan admin/lokal (beda dari unit bawaan paket di `/usr/lib/systemd/system/`) |
| Act 2 (Managed Process lahir) | `/proc/4021/` | `/proc/<pid>/` adalah lokasi nyata runtime info tiap process di Linux |
| Act 3 (Boot Target & Dependency) | `/etc/systemd/system/multi-user.target.wants/` | Lokasi symlink nyata yang dibuat saat unit di-enable ke boot target — cocok untuk menjelaskan ENABLE tanpa menampilkan command |
| Act 4 (restart, PID baru) | `/proc/4198/` | PID berubah, path `/proc/` ikut berubah — menegaskan caption `PID_NOTE` ("PID bisa berubah, unit tetap sama") |
| Act 5 (Journal lahir) | `/var/log/journal/` | Lokasi default penyimpanan journal persistent |
| Act 6, step STATUS | `/proc/4198/` | Kembali ke runtime info unit yang sedang dicek |
| Act 6, step JOURNAL | `/var/log/journal/` | Sumber log yang disaring |
| Act 6, step KONTEKS | `/var/log/journal/` (tetap, path sama — bedanya filter waktu, bukan lokasi) | Menghindari kesan seolah "konteks" adalah path baru; caption yang menjelaskan bedanya, bukan Path Bar |

**Path tag** (chip kecil di stasiun, font monospace 11–12, per revisi-02
§3.3): dipasang di Unit File (path di atas), Managed Process (path
`/proc/`), dan Journal (path `/var/log/journal/`) — tiga stasiun yang
memang punya lokasi disk/runtime nyata. Manager, Boot Target, dan
Diagnosis Terminal TIDAK diberi path tag (Manager adalah proses PID 1
tanpa satu path file tunggal yang representatif; Boot Target sudah
terwakili oleh path Act 3 di Path Bar; Diagnosis Terminal adalah sudut
pandang operator, bukan lokasi disk).

## 6. Alur per Act — Garis, Kelahiran Stasiun, Caption

Prinsip: setiap objek baru WAJIB lahir lewat salah satu dari 3 cara di
`revisi-02` §3.2 (garis, dipicu peristiwa, atau redup-menyala kembali).
Tidak ada `popIn` tanpa sumber.

### 6.1 Act 1 — Dari Process ke Service (12s)

1. `t+0.0` Process Manual lahir SENDIRIAN (satu-satunya pengecualian
   "asal-usul" — ini titik awal cerita, tidak ada objek sebelumnya untuk
   ditarik garis). Fade-in polos, bukan `popIn` skala dramatis, supaya
   terasa "sudah ada dari tadi" bukan "muncul ajaib". PID `4021` (tetap
   `PID_INITIAL`).
2. `t+2.0` Garis digambar dari Process Manual → Unit File (kanan atas).
   `PathLabel` di tengah garis: "dideklarasikan sebagai unit". SFX
   `SLIDE_IN` di sini (mengisi entry `SLIDE_IN` yang sebelumnya dead
   config — temuan (f) revisi-02).
3. `t+3.2` Unit File menyala di ujung garis (bukan `popIn` dari udara).
   Path tag `/etc/systemd/system/web-demo.service` muncul menempel di
   bawah Unit File. Path Bar crossfade ke path yang sama.
4. `t+5.5` Unit fields (`runs`, `runsAs`, `restartPolicy`, `wantedBy`)
   terisi di dalam Unit File — animasi sama seperti kode existing
   (`unitFields` pop), field ini TETAP representasi deskriptif, bukan
   syntax unit file asli (batas aman plan utama, tidak berubah).
5. `t+8.5` **Process Manual meredup (opacity turun ke ~0.35), TIDAK
   dihapus.** ~Sebelumnya kode meng-upgrade kartu process yang sama
   menjadi "MANAGED BY SYSTEMD" (temuan (a) revisi-02: ini tidak akurat,
   systemd menjalankan process baru dari unit, bukan mengadopsi process
   manual). Perbaikan: Process Manual tetap ada sebagai penanda "process
   yang berjalan di luar systemd sebelum ada unit", lalu Act 2 memunculkan
   Managed Process yang terpisah dengan PID lain.
6. Caption (`IconCaption` di bawah Process Manual → Unit File secara
   berurutan): `RAW_PROCESS` → `UNIT_DECLARED` → `SERVICE_BORN`. Teks
   `CAPTIONS` tidak berubah, cuma pindah dari `say()`+bar ke `IconCaption`.

### 6.2 Act 2 — Manager Menjalankan Lifecycle (12s)

1. Garis dari Unit File → Manager (tengah). Manager lahir menyala di
   ujung garis (bukan `popIn` sendiri). SFX `WHOOSH_LOW` (sudah dipakai
   di kode existing untuk transisi `starting`, tetap dipakai di sini
   untuk garis + transisi state, tidak dobel-mainkan).
2. Manager menampilkan badge lifecycle (`declared` → `starting` →
   `active`), sama seperti kode existing (`LIFECYCLE_META`), warna &
   label tidak berubah.
3. Saat lifecycle jadi `active`: garis pendek dari Manager → Managed
   Process (stasiun #4, koordinat hasil perbaikan 4.2). Managed Process
   lahir menyala di ujung garis dengan PID `4021` — PID SAMA dengan
   Process Manual sengaja dipakai di sini untuk demonstrasi pertama
   (unit baru pertama kali start), path tag `/proc/4021/` muncul.
   *(Catatan: PID sama antara Process Manual & Managed Process di
   Act 1–2 tetap konsisten dengan cerita "belum pernah dikelola →
   pertama kali dikelola"; yang membedakan Act 1 dan Act 4 adalah PID
   BERUBAH setelah restart, bukan PID yang berbeda sejak awal — ini
   menjawab temuan (a) dengan tetap akurat: proses yang sama bisa terus
   berjalan sebagai proses OS biasa, MENJADI diawasi begitu unit-nya
   start, tanpa systemd "melahirkan ulang" proses yang identik.)*
4. Caption: `MANAGER_STARTS` → `BECOMES_ACTIVE` → `PID_NOTE`, lewat
   `IconCaption` di Manager lalu di Managed Process untuk `PID_NOTE`.

### 6.3 Act 3 — Boot & Dependency, Enable ≠ Start (16s)

1. Garis dari Manager → Boot Target & Dependency (kiri bawah). Stasiun
   #5 lahir menyala di ujung garis.
2. Path Bar crossfade ke `/etc/systemd/system/multi-user.target.wants/`.
3. Isi stasiun #5 SAMA seperti `depRow` existing (`BOOT_TARGET`,
   `DEPENDENCIES`, `ENABLE_BADGE`, `START_BADGE`) — layout internal tidak
   berubah, hanya dipindah ke koordinat stasiun baru dan lahir lewat
   garis, bukan `popIn` sendirian.
4. SFX `LOCK` (dead config di temuan (f)) dipasang saat `ENABLE_BADGE`
   menyala — melambangkan "terkunci ke urutan boot", beda dari SFX
   `POP2` yang tetap dipakai saat `START_BADGE` menyala (aksi "sekarang").
5. Caption: `BOOT_TARGET` → `DEP_CHAIN` → `ENABLE_VS_START`, via
   `IconCaption` di stasiun #5. `PathLabel` opsional di garis dependency
   internal (`Requires`, `After`) kalau tempat cukup — kalau sempit,
   cukup label teks kecil seperti kode existing (`DEPENDENCIES.map`).
6. Stasiun #5 TIDAK di-`popOut` di akhir Act (beda dari kode existing
   yang men-`popOut depRow`) — semua stasiun tetap ada meredup sampai
   Act 6, sesuai keputusan revisi-02 §3.1.

### 6.4 Act 4 — Ketika Process Gagal (12s)

1. Tidak ada stasiun baru. Garis Manager ↔ Managed Process yang sudah
   ada berkedip merah (pulse warna `COLORS.FAILED`) saat lifecycle jadi
   `failed` — pulsa BERASAL dari Managed Process (sumber kegagalan)
   MENUJU Manager (yang mendeteksi), arah kebalikan dari Act 2.
2. Path tag Managed Process crossfade `/proc/4021/` → `/proc/4198/` saat
   `lifecycle` jadi `active` kembali (restart selesai) — perubahan path
   inilah yang secara visual menjelaskan `PID_AFTER_RESTART`, tanpa perlu
   teks tambahan selain caption yang sudah ada.
3. Caption: `PROCESS_DIES` → `STATE_FAILED` → `BOUNDED_RESTART` →
   `BACK_ACTIVE`, semua lewat `IconCaption` di Managed Process/Manager
   (posisi sama seperti kode existing, cuma titik acuannya stasiun baru).
4. Badge `restart {n}/3` tetap seperti kode existing, ditempel di Manager.

### 6.5 Act 5 — Jejak di Journal (15s)

1. Garis dari Managed Process → Journal (kanan bawah). Journal (stasiun
   #6) lahir menyala di ujung garis. Path Bar crossfade ke
   `/var/log/journal/`.
2. Tiap `JOURNAL_ENTRIES` masuk progresif SAMA seperti kode existing
   (`journalCount` increment per 0.85s) — bedanya, DUA entri pertama
   (`j1`, `j2`, sumber `MANAGER`/`APP`) masing-masing dipicu pulsa kecil
   yang berjalan di sepanjang garis Managed Process→Journal (menjawab
   Aturan Asal-Usul cara #2 "dipicu peristiwa"); entri ke-3 dan
   seterusnya cukup muncul langsung di panel tanpa pulsa ulang (supaya
   tidak berulang-ulang dan memperlambat ritme) — garis sudah
   "dibuktikan" hidup lewat dua pulsa pertama.
3. Caption: `STDOUT_TO_JOURNAL` → `MANAGER_EVENTS` → `TIMELINE_GROWS`,
   `IconCaption` di Journal.

### 6.6 Act 6 — Diagnosis: Ikuti Bukti (13s)

1. Dua garis konvergen ke Diagnosis Terminal (stasiun #7, bawah tengah):
   satu dari Managed Process (mewakili status runtime), satu dari
   Journal (mewakili log). Diagnosis Terminal lahir menyala di titik
   pertemuan kedua garis.
2. 3 langkah (`DIAGNOSIS_STEPS`) menyala berurutan SAMA seperti kode
   existing (`diagnosisStep` 0→1→2), tapi label diubah dari kalimat
   tanya jadi pernyataan (temuan (c) revisi-02) — lihat Bagian 10.1 untuk
   teks penggantinya. Path Bar crossfade mengikuti tiap step (Bagian 5).
3. Saat step aktif, Path Bar & garis yang relevan (Managed Process untuk
   step STATUS, Journal untuk step JOURNAL & KONTEKS) berkedip pelan
   supaya penonton tahu step yang sedang aktif "menarik data" dari mana.
4. Closing: dua stamp (`CLOSING_STAMPS`) tetap seperti kode existing,
   muncul di/dekat Diagnosis Terminal (bukan menimpa panel journal —
   perbaikan tabrakan temuan §2.3 revisi-02, karena sekarang journal &
   diagnosis adalah dua stasiun terpisah secara spasial, bukan bertumpuk
   vertikal di satu lajur).
5. Di akhir frame ini, SELURUH 7 stasiun + garis-garisnya terlihat
   (sebagian redup, Manager/Journal/Diagnosis paling terang) — inilah
   "peta sistem utuh" yang jadi tujuan revisi-02 §3.1.

## 7. Sinkronisasi dengan Tabel Durasi revisi-02 §3.5

Rincian per-Act di Bagian 6 di atas dirancang MUAT dalam durasi revisi
(`12/12/16/12/15/13` detik) karena isi & urutan beat tidak menambah beat
baru secara signifikan dari kode existing — perubahan utama adalah
POSISI (stasiun tersebar, bukan satu lajur) dan CARA MUNCUL (dari garis,
bukan `popIn` sendiri), bukan menambah jumlah beat cerita. Satu beat
tambahan yang genuinely baru adalah pulsa garis di Act 5 (langkah 6.5.2)
dan pulsa dua-arah di Act 6 (6.6.3) — keduanya beban animasi ringan
(reuse garis yang sudah digambar), diperkirakan tidak menggeser total
durasi Act secara berarti. **WAJIB diukur ulang dari timeline nyata saat
eksekusi**, sesuai catatan revisi-02.

## 8. Migrasi Komponen: Existing → Baru

| Existing (`Animation.jsx`) | Tindakan | Alasan |
|---|---|---|
| `AXIS_X`, lajur tunggal | Diganti 7 pasang koordinat (Bagian 4) | Lajur tunggal menghabiskan ruang kiri-kanan (revisi-02 §2.3) |
| `popIn(tl, ..., 'unitCard')` dkk | Diganti pola "garis dulu, objek menyala di ujung" (Bagian 6, tiap Act) | Aturan Asal-Usul revisi-02 §3.2 |
| `say()` + `caption`/`captionY` state + CaptionBar rect | Dihapus, diganti `IconCaption`/`PathLabel` (Bagian 10) | Temuan (b) revisi-02, `03-planning-storytelling-quality-gate.md` §1.D: `say()` deprecated |
| Tidak ada Path Bar | Tambah komponen baru `PathBarV1` lokal (pola sama `FlowchartSpine` lokal per-topic) | Bagian 5 |
| `depRow` di-`popOut` akhir Act 3 | Dihapus (`popOut`), stasiun tetap ada meredup | revisi-02 §3.1: tidak ada stasiun yang hilang dari peta |
| Unit card meng-upgrade process yang sama jadi service | Dipisah jadi 2 node (`Process Manual`, `Managed Process`), PID beda saat restart | Temuan (a) revisi-02 |
| `DIAGNOSIS_STEPS[].question` (kalimat tanya) | Diganti pernyataan (Bagian 10.1) | Temuan (c) revisi-02 |
| `SFX_MAP.WHOOSH/SLIDE_IN/LOCK` tidak dipanggil | Dipasang di Bagian 6.1 & 6.3 | Temuan (f) revisi-02 |
| Semua `rect`+`text` tanpa gambar (unit card, manager hub, dst) | Tambah `<image>` icon per formula `06-icon-generation.md` §6.2/6.3 | Bagian 9 |

## 9. Spesifikasi Icon

Ikuti `06-icon-generation.md` §1–3 (grid 2×4 rekomendasi, sisakan 1 slot
`[EMPTY]`). 9 icon unik dibutuhkan → 2 batch.

**Batch 1 (2×4, 7 icon + 1 empty):**

| id | Label | Dipakai di | Jenis (§8: AI-generate vs logo asli) |
|---|---|---|---|
| `process-generic` | Process | Process Manual & Managed Process (icon sama, dibedakan lewat warna border existing: sky utk manual, tetap sky/berubah sesuai lifecycle utk managed) | AI-generate (konsep abstrak) |
| `unit-file-doc` | Unit File | Stasiun Unit File | AI-generate |
| `systemd-hub` | systemd Manager | Stasiun Manager | **Keputusan diperlukan** — lihat catatan di bawah tabel |
| `boot-target-flag` | Boot Target | Stasiun Boot Target & Dependency | AI-generate |
| `dependency-link` | Dependency | Aksen kecil di baris `Requires`/`After` | AI-generate |
| `journal-log` | Journal | Stasiun Journal | AI-generate |
| `diagnosis-magnifier` | Diagnosis | Stasiun Diagnosis Terminal | AI-generate |

**Batch 2 (2×2, 3 icon + 1 empty):**

| id | Label | Dipakai di |
|---|---|---|
| `folder-path` | Folder/Path | Path Bar (ikon kecil di depan tiap path) & path tag |
| `alert-failed` | Failed | Badge state `failed` di Manager (Act 4) |
| `restart-loop` | Restart | Badge `restart {n}/3` (Act 4) |

**Catatan `systemd-hub`:** systemd punya logo resmi (gear bergaya "atom"),
trademark proyek open-source dengan pengenalan sedang. Per tabel
keputusan §8 `06-icon-generation.md`, ini kasus low-risk (tools
open-source) sehingga BOLEH pakai logo asli via Simple Icons/Devicon —
tapi harus dicek dulu apakah slug `systemd` tersedia di kedua sumber
sebelum diputuskan; kalau tidak tersedia, fallback icon hub/gear generik
(AI-generate) sesuai aturan §8 baris terakhir (jangan re-prompt AI
berkali-kali mencoba meniru logo, langsung pakai generik). **Keputusan
final: dicek saat eksekusi**, dicatat di `icons/_originals/LICENSE-LOGOS.md`
kalau pakai logo asli.

### 9.1 Formula Pemasangan (ikuti `06-icon-generation.md` §6.2/6.3 persis)

- Icon standalone di tiap stasiun (Process, Unit File, Boot Target,
  Journal, Diagnosis): pola §6.2, ukuran 32×32 atau 40×40 (disesuaikan
  ukuran box masing-masing), offset `x=-w/2, y=-h/2` dari titik yang
  sudah didefinisikan di Bagian 4.
- Icon `systemd-hub` di Manager: lebih besar (48×48) karena Manager
  adalah hub utama yang persist — beri sedikit `filter="url(#glow)"`
  yang sudah ada di kode existing.
- Icon aksen kecil (`dependency-link`, `folder-path`): pola §6.3, formula
  `x = -(boxWidth/2) + paddingKiri`.
- Icon `restart-loop`, `alert-failed`: aksen di badge kecil dekat Manager,
  ukuran 16×16, pola §6.3.
- Semua icon ini adalah **icon BARU** (belum ada elemen existing yang
  diganti langsung 1:1 kecuali box-nya sendiri) → butuh entry `popIn`/
  garis baru di timeline, BUKAN icon pengganti murah (§6.4) — effort
  lebih besar dari sekadar swap, sudah diperhitungkan di estimasi durasi
  Bagian 7.

## 10. Caption Baru (`IconCaption`/`PathLabel`) & Perbaikan SFX

### 10.1 Teks Diagnosis — Pernyataan, Bukan Pertanyaan (temuan c)

| id | Lama (kalimat tanya) | Baru (pernyataan) |
|---|---|---|
| `status` | "Unit dikelola & active?" | "Cek unit: dikelola & active" |
| `journal` | "Kapan gagal / direstart?" | "Journal: waktu gagal & restart" |
| `context` | "Mengapa app gagal?" | "Konteks: alasan app berhenti" |

`question` field di `DIAGNOSIS_STEPS` (`data.js`) diganti jadi field
`statement` dengan teks di atas. `source` field (mis. "Unit status
ringkas") tidak berubah, tetap tampil sebagai baris kedua di step card.

### 10.2 Pemetaan Caption Lama → `IconCaption`/`PathLabel`

Semua 20 entri `CAPTIONS` di `data.js` TIDAK berubah isi teksnya (sudah
≤5 kata sesuai standar 03 §1.D, dicek manual satu-satu), hanya pindah
cara render: dari `say(tl, time, text, y)` + `<rect>` bar tunggal, jadi
`IconCaption` yang menempel di stasiun yang relevan (lihat pemetaan per
Act di Bagian 6, tiap caption sudah disebut menempel ke stasiun mana).
`PathLabel` dipakai khusus untuk teks YANG NEMPEL DI GARIS (bukan di
stasiun): "dideklarasikan sebagai unit" (Act 1, garis Process→Unit),
opsional label `Requires`/`After` di Act 3 kalau tempat cukup (Bagian
6.3 poin 5).

### 10.3 SFX yang Diaktifkan (temuan f)

| SFX | Lama | Baru |
|---|---|---|
| `WHOOSH` | Tidak dipakai | *(masih tidak dipakai — `WHOOSH_LOW` sudah cukup mewakili transisi manager; `WHOOSH` versi biasa disiapkan sebagai cadangan kalau saat preview transisi garis Act 1 terasa perlu suara terpisah dari `SLIDE_IN`)* |
| `SLIDE_IN` | Tidak dipakai | Act 1, saat garis Process→Unit mulai digambar (6.1.2) |
| `LOCK` | Tidak dipakai | Act 3, saat `ENABLE_BADGE` menyala (6.3.4) |

### 10.4 Bug Ref SFX (temuan d) — Checklist Perbaikan

`popIn`/`popOut` di kode existing memakai `volume`/`speed` dari closure
`useEffect` dependency `[]` (nilai beku saat mount), bukan
`volumeRef.current`/`speedRef.current` yang sudah ada di komponen. Saat
eksekusi, WAJIB ganti semua pemanggilan `volume`/`speed` polos di dalam
`popIn`/`popOut`/`onStart` jadi `volumeRef.current`/`speedRef.current`,
konsisten dengan pola yang SUDAH BENAR di pemanggilan `sfxOn(...)`
lainnya di file yang sama.

### 10.5 Sinkronisasi Metadata (temuan e) — Checklist Perbaikan

`metadata.json` field `subtitle` dan `tags` masih kosong sementara
`manifest.js` sudah terisi. Saat eksekusi, isi ulang `metadata.json` agar
sinkron dengan `manifest.js` (§5 `02-topic-contract-scene-shell.md`).

## 11. Checklist Eksekusi (Rangkuman, Belum Dijalankan)

- [ ] 11.1 `data.js`: ganti `AXIS_X`+5 konstanta Y jadi 7 pasang koordinat stasiun (Bagian 4, sudah termasuk perbaikan 4.2)
- [ ] 11.2 `data.js`: pisah `PID_INITIAL`/`PID_AFTER_RESTART` tetap dipakai, tambah field path per stasiun (Path Atlas Bagian 5) sebagai konstanta baru `PATH_ATLAS`
- [ ] 11.3 `data.js`: ganti `DIAGNOSIS_STEPS[].question` → `statement` (Bagian 10.1)
- [ ] 11.4 Buat komponen lokal baru di `Animation.jsx`: `PathBarV1`, `IconCaption`, `PathLabel`, `FlowLine` (garis + pulsa) — pola sama seperti implementasi lokal di `14-http-request-response`, sesuaikan penamaan biar tidak bentrok kalau nanti diangkat jadi shared component
- [ ] 11.5 Hapus `say()`, `caption`/`captionY` state, `<rect>` CaptionBar; ganti semua 20 pemanggilan sesuai Bagian 10.2
- [ ] 11.6 Tulis ulang timeline per Act sesuai Bagian 6 (garis dulu, objek menyala di ujung; hapus `popOut('depRow')`)
- [ ] 11.7 Perbaiki bug ref SFX (Bagian 10.4)
- [ ] 11.8 Generate 9 icon (2 batch, Bagian 9) via `vm-icon-generator`, atau cek Simple Icons/Devicon untuk `systemd-hub` dulu
- [ ] 11.9 Sinkronkan `metadata.json` (Bagian 10.5)
- [ ] 11.10 Cek ulang jarak stasiun #6/#7 (Bagian 4.1, sisa gap tipis 10px) di preview ukuran export sebenarnya 820×1340, sesuai checklist `05-svg-layout-asset-pipeline.md` §Checklist Collision
- [ ] 11.11 Ukur ulang durasi tiap Act dari timeline nyata (Bagian 7), sesuaikan `PHASES[].duration` kalau meleset dari estimasi
- [ ] 11.12 Preview manual & export MP4 (belum pernah dilakukan sejak revisi-01, lihat `revisi/README.md`)

## 12. Status & Langkah Berikutnya

Dokumen ini masih **PLAN ONLY**. Belum ada perubahan ke `Animation.jsx`,
`data.js`, `manifest.js`, atau `metadata.json`. Menunggu persetujuan
eksplisit untuk mulai checklist Bagian 11.
