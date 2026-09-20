# REVISI PLAN — 34 Install Applications: Dari Internet ke Sistem Linux

| Item | Keputusan |
|---|---|
| Content | 34 — Install Applications |
| Status | PLAN ONLY — jangan dieksekusi |
| Dokumen ini | Revisi terpisah; melengkapi plan utama tanpa mengganti file implementasi |
| Audiens | Pemula Linux yang ingin tahu asal aplikasi dan apa yang terjadi di balik proses install |
| Fokus | Distro → package manager → repository internet → metadata → transaction → download → verify → unpack → configure → ready |

## 1. Diagnosis masalah versi lama

Plan sebelumnya sudah memperkenalkan repository, dependency, dan status
installed, tetapi pengalaman visualnya masih terlalu ringkas. Tiga kekurangan
utama yang perlu diperbaiki:

1. Repository terasa seperti satu gudang abstrak, padahal package biasanya
   diperoleh melalui sumber internet yang dikonfigurasi oleh distro, termasuk
   official repository, mirror, security/update channel, dan kadang vendor.
2. Nama seperti apt, dnf, pacman, zypper, dan apk muncul sebagai daftar. Ini
   membuat penonton tahu nama, tetapi belum memahami keluarga distro, format
   package, persamaan tugas, maupun perbedaan perannya.
3. Alur motion terlalu seperti state card yang muncul bersamaan. Penonton perlu
   melihat request bergerak, metadata kembali, rencana disusun, arsip diunduh,
   diperiksa, dibongkar, dicatat, lalu menjadi aplikasi.

Tujuan revisi bukan menambah dekorasi tanpa makna. Setiap logo, paket, garis
jaringan, dan transisi harus memberi bukti asal, arah data, atau perubahan
state.

## 2. Pesan utama yang dikunci

> Aplikasi Linux umumnya didapat dari repository internet yang sudah
> dikonfigurasi untuk distro. Package manager memilih package dan dependency,
> membuat rencana, lalu mengunduh, memverifikasi, membongkar, mengonfigurasi,
> dan mencatat hasilnya.

Kata **internet** perlu disebut secara eksplisit, dengan batas akurat berikut:

- Package manager tidak mencari file acak di seluruh internet.
- Ia memakai daftar repository atau mirror yang dikonfigurasi pada sistem.
- Mirror dapat berada di internet dan menyalin repository resmi; mirror bukan
  otomatis pembuat package.
- Arsip download belum berarti aplikasi sudah terpasang.
- Repository tepercaya dan signature membantu trust, tetapi bukan klaim bahwa
  semua software atau semua konfigurasi bebas risiko.

## 3. Strategi logo dan aset

Logo dipakai sebagai penanda keluarga distro pada Act manager; bukan pengganti
penjelasan dan bukan dekorasi yang muncul serentak.

| Keluarga distro | Mark/wordmark yang direncanakan | Manager yang dikaitkan | Aturan penggunaan |
|---|---|---|---|
| Ubuntu / Debian family | Ubuntu dan Debian mark/wordmark | apt | Tampil berurutan di jalur Debian family. |
| Fedora / RHEL family | Fedora dan Red Hat family mark/wordmark bila izin/aset mendukung | dnf | Tampil di jalur RPM Fedora/RHEL. |
| Arch family | Arch mark/wordmark | pacman | Tampil pada jalur Arch. |
| openSUSE / SUSE | openSUSE/SUSE mark/wordmark | zypper | Tampil sebagai RPM family yang tooling-nya berbeda. |
| Alpine | Alpine mark/wordmark | apk | Tampil pada jalur sistem minimal/container. |

### Kontrak aset

1. Sebelum implementasi, audit sumber resmi, trademark guideline, lisensi, dan
   bentuk mark yang diizinkan. Jangan mengambil logo hasil pencarian tanpa
   provenance.
2. Gunakan logo/wordmark sebagai asset statis yang kecil dan jelas; jangan
   recolor mark secara arbitrer atau memotong elemen identitasnya.
3. Bila satu logo tidak dapat dipakai, gunakan chip teks nama distro dengan
   warna netral; informasi tidak boleh bergantung pada logo.
4. Logo hadir **satu keluarga per beat**, dengan card sebelumnya tetap redup
   sebagai konteks. Maksimum dua mark fokus di layar sekaligus.
5. Jangan menggunakan logo aplikasi pihak ketiga. Package contoh tetap fiktif:
   `editor-lite`.

## 4. Repository sebagai peta internet, bukan satu rak

### Topologi visual

```
Distro identity
      ↓ konfigurasi sumber
Package manager ── request metadata ──> official repo / security channel
      ↑                                  ↘ official mirror on internet
      └── candidate + signature data <─── package archive download
```

Internet digambar sebagai cloud network tipis di antara sistem lokal dan
repository/mirror. Jalur berikut harus terlihat secara berurutan:

1. Sistem lokal mengirim request **metadata**, bukan langsung app.
2. Repository/mirror mengirim indeks: nama, versi, arsitektur, dependency,
   ukuran, checksum/signature, lokasi arsip.
3. Package manager membentuk transaction plan.
4. Hanya package yang ada pada plan bergerak sebagai archive capsule dari
   repository/mirror melalui jaringan ke cache lokal.
5. Archive diberi seal verify sebelum masuk tahap unpack.

### Jenis repository yang dijelaskan

| Sumber | Apa yang dikirim/ditawarkan | Perbedaan yang perlu terlihat |
|---|---|---|
| Official/base | Package inti distro dan metadata terkurasi. | Titik awal default distro, bukan seluruh internet. |
| Updates/security | Package perbaikan dan pembaruan keamanan. | Saluran update khusus dalam ekosistem distro. |
| Official mirror | Salinan tersinkron, biasanya lebih dekat/cepat. | Distribusi arsip/metadata resmi; bukan author package. |
| Community/extra | Package tambahan menurut kebijakan distro. | Kurasi dan tingkat trust dapat berbeda. |
| Vendor pihak ketiga | Package dari pembuat aplikasi/organisasi lain. | Perlu asal, key/trust, kebijakan update yang jelas. |
| Local/corporate/offline | Mirror organisasi atau media internal. | Tidak perlu internet aktif saat source lokal dipakai. |

Jangan membuat semua rak tampil penuh pada saat yang sama. Act repository
memakai camera focus/pan: official → security → mirror → community/vendor →
local. Yang tidak sedang dibahas menjadi node kecil redup di background.

## 5. Persamaan dan perbedaan package manager

### Persamaan

Semua manager pada peta ini melakukan pekerjaan inti yang mirip: membaca
repository metadata, memilih package/version, menyelesaikan dependency,
menyusun transaction, download/cache, memverifikasi, memanggil package layer,
dan mencatat status.

### Perbedaan yang perlu ditampilkan satu per satu

| Jalur distro | Manager | Package layer/format | Pembeda visual dan naratif |
|---|---|---|---|
| Debian, Ubuntu, Linux Mint | apt | apt mengorkestrasi; arsip .deb dipasang oleh dpkg | Jalur .deb dan katalog Debian family. |
| Fedora, RHEL, Rocky, AlmaLinux | dnf | DNF mengelola transaction RPM | Jalur .rpm untuk keluarga Fedora/RHEL. |
| Arch, Manjaro | pacman | Package Arch .pkg.tar.* | Satu hub pacman menyinkronkan repo dan memasang package Arch. |
| openSUSE, SUSE Linux Enterprise | zypper | Zypper mengelola transaction RPM | Format RPM sama dengan Fedora/RHEL, tetapi manager/repository/policy berbeda. |
| Alpine Linux | apk | Package .apk Alpine | Jalur ringan untuk sistem minimal/container; bukan Android APK. |

### Cara memvisualkan perbandingan tanpa “muncul bareng”

Gunakan carousel lima stasiun, bukan tabel raksasa.

| Beat | Motion | Informasi yang tersisa |
|---|---|---|
| 1 — apt | Logo Ubuntu/Debian masuk dari kiri; hub apt memproses `editor-lite.deb`. | Chip “same job: plan → install” menempel di bawah. |
| 2 — dnf | Kamera mengikuti archive yang berubah label menjadi RPM; Fedora/RHEL card menggantikan foreground. | Chip persamaan tetap; badge “RPM ecosystem” muncul. |
| 3 — pacman | Rail bergeser ke Arch; archive memiliki format Arch dan hub pacman. | Perbedaan format/policy muncul hanya di stasiun ini. |
| 4 — zypper | RPM archive sama muncul sebagai handoff dari dnf, lalu zypper/repository policy mengambil alih. | Bukti: format sama tidak berarti manager sama. |
| 5 — apk | Scene menyempit menjadi Alpine/minimal system; apk archive berjalan cepat ke container-like system. | Badge “lightweight/minimal” muncul. |
| 6 — recap | Kelima stasiun membentuk orbit kecil dengan satu pipeline yang sama di tengah. | Persamaan dan perbedaan terbaca setelah, bukan sebelum, contoh. |

Tidak perlu memperlihatkan sintaks command nyata. Nama manager tampil sebagai
label konsep, bukan ajakan menyalin command lintas distro.

## 6. Lifecycle instalasi yang lebih hidup

| Tahap | Objek bergerak | Animasi sebab-akibat | Bukti yang tertinggal |
|---|---|---|---|
| Need | Kartu app fiktif lahir dari kebutuhan user. | Card menuju hub manager. | Package name dan distro context. |
| Metadata lookup | Request pulse menuju cloud/repository. | Pulse tiba di indeks lalu metadata card terbang pulang. | Version, source, dependency summary. |
| Dependency resolve | Dependency chips datang dari beberapa metadata card. | Hub menyusun chips ke transaction tray. | Daftar package baru/berubah dan disk/download estimate. |
| Approval | Transaction tray berhenti pada system-change gate. | Gate terbuka hanya setelah plan terbaca. | Batas perubahan sistem. |
| Download | Archive capsules melintas internet/mirror ke cache rack. | Progress bertambah sesuai capsule tiba; boleh reuse cache card. | “Downloaded” belum “installed”. |
| Verify | Seal signature/checksum memindai archive. | Archive gagal tidak dilanjutkan dalam jalur utama; jalur success menerima seal. | “Verified” sebagai state terpisah. |
| Unpack | Archive unzip/morph menjadi binary, library, desktop entry, docs. | File menuju folder system shelf terpisah. | File sudah ditempatkan. |
| Configure/triggers | Gear kecil menghubungkan desktop index/cache/service registration bila relevan. | Gear hanya aktif setelah unpack selesai. | Sistem mengintegrasikan package. |
| Record | Ledger database menerima version/file record. | Ledger stamp `installed`. | System dapat update/remove package nanti. |
| Ready | Kartu `editor-lite` handoff menjadi app tile. | Tile aktif setelah ledger stamp, bukan sesudah download. | “Ready to use”. |

Untuk menjaga akurasi, trigger ditampilkan sebagai “possible system integration”
bukan janji bahwa setiap app menjalankan service atau membuka jendela sendiri.

## 7. Storyboard revisi: delapan Act

| Act | Pertanyaan | Cerita/gerak utama | Konsep pulang |
|---|---|---|---|
| 1 — Distro menentukan ekosistem | “Mengapa tutorial install berbeda?” | Laptop memilih Ubuntu/Fedora/Arch/SUSE/Alpine cards satu per satu. | Distro menentukan manager dan source policy. |
| 2 — Manager punya tugas sama | “Apa yang sama?” | Lima stasiun manager menjalankan pipeline abstrak yang sama. | Semua mengelola transaction package. |
| 3 — Repository berada di jaringan | “Dari mana package datang?” | Request metadata melintasi internet cloud ke official repository dan mirror. | Manager memakai source terkonfigurasi, bukan download acak. |
| 4 — Source punya jenis berbeda | “Mengapa ada banyak repo?” | Camera pan satu demi satu melalui official, updates, mirror, community, vendor, local. | Tiap source punya peran/trust berbeda. |
| 5 — Rencana dulu | “Mengapa belum langsung download?” | Metadata menjadi candidate + dependency + disk estimate transaction tray. | Plan melindungi dari perubahan tak terlihat. |
| 6 — Arsip masuk dari internet | “Apa itu download?” | Archive capsules datang dari mirror/repository menuju cache. | Download hanya memindahkan archive. |
| 7 — Pasang sungguhan | “Apa yang terjadi sesudahnya?” | Verify → unpack → configure/triggers → record dibuat sebagai conveyor kausal. | Install terdiri dari beberapa perubahan. |
| 8 — App siap dan dapat dikelola | “Mengapa manager masih dibutuhkan?” | Ledger installed menghubungkan update/remove lifecycle, lalu ready app tile. | Database package menjaga lifecycle lanjut. |

Target satu video: 105–125 detik. Jika format perlu 60 detik, pecah menjadi:

- 34a: distro, manager, repository, dan internet source.
- 34b: dependency, transaction, download, verify, unpack, configure, record.

Jangan memotong Act 3–7 menjadi montage cepat; itu bagian yang memperbaiki
masalah “terlalu sederhana”.

## 8. Layout dan rhythm

| Zone | Isi | Aturan anti-rame semu |
|---|---|---|
| Header | Title dan current Act. | Header tidak diulang sebagai card kedua. |
| Upper lane | Logo/distro carousel atau repository internet map. | Satu subject fokus per beat. |
| Middle hub | Package manager dan transaction tray. | Hub persistent agar perubahan terasa kausal. |
| Side rail | Metadata/dependency/source details. | Maksimum tiga chip/file detail bersamaan. |
| Lower conveyor | Download, verify, unpack, configure, record. | Satu stage aktif penuh warna; tahap lain outline. |
| Closing | App tile + ledger + source trust reminder. | Tidak mengklaim 100% aman. |

Motion language:

- Logo masuk melalui reveal dari distro card, lalu collapse menjadi badge.
- Request, metadata, archive, dan record selalu memiliki arah travel jelas.
- Camera pan atau focus ring digunakan untuk repo/manager carousel, bukan
  menampilkan seluruh taxonomy dalam satu frame.
- Dependency chips punya bobot dan masuk ke tray satu per satu.
- Unpack memakai morph dari satu archive menjadi beberapa tipe file; file lalu
  menempati shelf yang berbeda.
- Progress numerik hanya berjalan saat capsule download atau file unpack benar
  benar bergerak; tidak boleh menjadi loading kosong.
- Setiap Act memiliki hold singkat untuk membaca hasil sebelum transisi berikut.

## 9. Copy layar dan narasi

| Beat | Copy singkat |
|---|---|
| Distro | `Distro memilih ekosistem package` |
| Manager | `Tool berbeda, pekerjaan inti serupa` |
| Repo | `Repository terkonfigurasi ada di jaringan` |
| Mirror | `Mirror menyalin repository resmi` |
| Metadata | `Metadata memilih package dan kebutuhan` |
| Plan | `Rencana selesai sebelum sistem berubah` |
| Download | `Archive diunduh, belum terpasang` |
| Verify | `Archive diperiksa sebelum dipasang` |
| Unpack | `Isi archive ditempatkan ke sistem` |
| Record | `Database mencatat hasil transaction` |
| Closing | `Pilih source yang sesuai distro` |

Narasi menyebut “download dari internet” ketika Act 3 dan 6, lalu langsung
membatasi maknanya sebagai repository/mirror terkonfigurasi.

## 10. Acceptance criteria implementasi nanti

Status per 2026-09-17 — diverifikasi terhadap `data.js` dan `Animation.jsx`
saat ini (bukan lagi plan only, lihat catatan di bawah tiap item).

- [x] Logo/wordmark distro memiliki provenance dan penggunaan yang sesuai guideline; fallback teks tersedia. — memakai chip wordmark teks netral (fallback bagian 3 poin 3); tidak ada asset logo yang diambil sama sekali, jadi tidak ada isu provenance (`icons/icons.json`: icons kosong, `DistroCarousel` di `Animation.jsx`).
- [x] apt, dnf, pacman, zypper, dan apk dibahas melalui carousel berurutan, bukan daftar yang muncul bersamaan. — `ManagerCarousel` di `Animation.jsx`, satu manager aktif per beat via `managerActiveId`.
- [x] Persamaan fungsi inti dan perbedaan distro, package layer/format, serta policy source tampak jelas. — `ManagerBadge` menampilkan format + `MANAGER_TAKEAWAY`, data di `MANAGERS` (data.js).
- [x] Repository internet, mirror, security/update, community, vendor, dan local source dibedakan. — `REPO_SOURCES` (6 entri) + `SourceLane` dengan pan satu-per-satu (`sourceActiveId`).
- [x] Request metadata, candidate/transaction plan, archive download, verification, unpack, configure, dan database record memiliki handoff visual yang nyata. — `NetworkMap` (pulse metadata), `TransactionTray`+`ApprovalGate`, `DownloadConveyor` (capsule+progress), `InstallConveyor` (verify→unpack→configure→record), `ReadyPanel`.
- [x] App tidak terlihat installed/ready sebelum stage record selesai. — `ReadyPanel` gating `ledgerStamped` sebelum `tileReady`, di-drive timeline GSAP berurutan.
- [x] Tidak ada command runnable, alamat repo nyata, kredensial, perubahan source, atau instalasi sungguhan. — `TERMINAL_LINES` & `caption.md` memakai narasi konseptual (`editor-lite` fiktif), tidak ada command/alamat repo asli.
- [x] Keramaian motion mendukung hubungan sebab-akibat, tidak berupa banyak elemen muncul bersamaan. — tiap carousel/lane pakai active-state tunggal + opacity redup untuk yang tidak fokus (`DistroCarousel`, `SourceLane`, `InstallConveyor`).

Catatan: checklist ini diupdate berdasarkan pembacaan kode saat ini, bukan
review visual/playback langsung. Disarankan tetap cek hasil render nyata
(timing, readability, SFX) sebelum menganggap topic ini final.

## 11. Dampak pada file saat implementasi disetujui

| File | Rencana, belum dikerjakan |
|---|---|
| data.js | Data distro/manager, logo asset manifest, source types, pipeline stages, copy, palette. |
| Animation.jsx | Carousel manager, repository network map, archive conveyor, handoff, dan deterministic reset. |
| icons/ | Audit asset/logo, provenance record, fallback text/chip, loader. |
| caption.md | Caption yang menjelaskan repository internet dan transaction dengan bahasa aman. |
| manifest.js | Update subtitle/tags bila disetujui. |

Dokumen ini hanya analisis dan plan. Tidak ada asset logo yang diunduh, tidak
ada koneksi internet, dan tidak ada file implementasi yang berubah.

