# PLAN — 38 sudo: Kunci Master yang Dipinjamkan

| Item | Nilai |
|---|---|
| Content | 38 — sudo |
| Status | 📝 PLAN ONLY — jangan dieksekusi |
| Target audiens | Pemula Linux dan pengguna komputer umum |
| Tujuan belajar | Memahami sudo sebagai izin admin sementara untuk satu perintah, bukan mode kerja sehari-hari |
| Prasyarat | 37 User, Group, dan Access; 34 Install Applications |
| Scene shell | scene-ui V1, portrait 820 × 1340 |

## Audience promise

Setelah menonton, audiens dapat menjelaskan bahwa sudo menjalankan satu perintah dengan hak admin setelah otorisasi, serta mengetahui kapan perlu berhenti dan memeriksa command sebelum memberinya izin.

## Identitas seri

| Field | Keputusan |
|---|---|
| Kategori | Linux Fundamentals |
| Title A | SUDO — cyan atau blue |
| Title B | SAFELY — emerald |
| Subtitle | Izin admin untuk satu perintah |
| Tone | Peminjaman kunci master yang dicatat penjaga; kuat, tetapi tidak dipakai sembarangan |
| Shell | Scene UI V1 dengan hero-to-header, empat Act, badge dan dot navigator |

## Aturan akurasi dan keamanan

1. sudo bukan akun root dan bukan cara untuk “membuat semua command aman”.
2. sudo menjalankan command berikutnya dengan privilege lebih tinggi, bila user diizinkan oleh kebijakan sistem.
3. Password yang diminta sudo bukan dikirim ke command; password digunakan untuk otorisasi user.
4. Jangan menampilkan command destruktif, command download lalu execute, atau command dengan target folder luas.
5. Jangan menyarankan menjalankan sudo untuk memperbaiki error yang belum dipahami.
6. Root user dibahas lebih jauh di content 39; detail permission dan ownership berada di content 40–42.

## Validasi analogi

sudo dianalogikan sebagai penjaga yang meminjamkan kunci master hanya untuk satu tugas yang disetujui. User tetap membawa kartu identitas sendiri; penjaga memeriksa apakah user boleh meminjam kunci. Kunci tidak mengubah user menjadi pemilik gedung dan tidak otomatis membenarkan tugas yang diminta.

## Storyboard empat Act

| Act | Setup → tegangan → titik balik → payoff | Konsep | Exit state |
|---|---|---|---|
| 1 — User biasa | User adib menjalankan perintah membaca status sistem → tugas biasa berhasil tanpa sudo → satu panel sistem butuh perubahan → batas user normal terlihat. | user privilege | User normal tetap dapat bekerja untuk tugas biasa. |
| 2 — Tugas admin | Update package membutuhkan perubahan sistem → command diberi prefix sudo → request menuju penjaga admin → konteks command terlihat sebelum izin. | sudo prefix | Permintaan privilege belum disetujui. |
| 3 — Otorisasi | Penjaga memeriksa kartu user dan kebijakan → password prompt muncul sebagai verifikasi → izin sementara diberikan → hanya command itu yang memakai kunci master. | authentication dan policy | Command admin boleh berjalan. |
| 4 — Cek sebelum setuju | Command yang tidak jelas ditampilkan sebagai kartu merah redup → checklist sumber, target, dampak muncul → command aman contoh selesai → takeaway: pahami dahulu, lalu sudo. | kebiasaan aman | Audiens tahu sudo bukan solusi otomatis. |

## State contract

| State | Yang terlihat | Yang belum boleh terlihat | Pemicu | Hasil |
|---|---|---|---|---|
| User normal | Kartu user dan task biasa | Kunci admin aktif | Act 1 | Tugas biasa tidak memerlukan sudo |
| Admin request | Command card dengan sudo | Izin diberikan | Act 2 | Permintaan privilege terlihat |
| Verification | Penjaga, policy, password dots | Command selesai | Act 3 | User diverifikasi |
| Temporary grant | Kunci terhubung hanya ke satu command | Root mode permanen | Otorisasi lolos | Satu tugas dijalankan |
| Safety check | Checklist dan risky card redup | Detail command berbahaya | Act 4 | Kebiasaan review dibangun |

## Continuity map

Kartu user adib dan terminal command strip adalah anchor persisten. Kunci master muncul pada Act 2, bergerak melalui penjaga pada Act 3, lalu menempel hanya pada kartu command aman pada Act 4. Kunci tidak berubah menjadi akses global dan hilang setelah command selesai untuk menghindari miskonsepsi “sudo mode”.

## Layout map V1

Seluruh koordinat berikut lokal terhadap ContentBodyV1.

| Area | Local y | Isi |
|---|---:|---|
| Narration bubble | 35–115 | Caption pendek per beat |
| User + terminal strip | 150–335 | User anchor dan command aktif |
| Admin gate | 395–575 | Penjaga, policy, dan kunci master |
| Command result / checklist | 625–805 | Otorisasi atau checklist aman |
| Takeaway | 855–930 | Ringkasan |

Terminal strip dan kartu command harus memakai contoh aman/non-destruktif. Card yang menunjukkan “command tidak jelas” bersifat abstrak, tanpa command nyata yang dapat disalin. Semua child berada di local y positif.

## Elemen visual dan aset

| Elemen | Bentuk | Perilaku |
|---|---|---|
| User identity card | Inline SVG | Persistent |
| Terminal command strip | Inline SVG | Command biasa lalu command dengan sudo |
| Admin gate | Inline SVG gate/penjaga | Menerima request dan memeriksa policy |
| Master key | Inline SVG | Bergerak hanya untuk satu command |
| Password verification | Inline SVG dots + check | Tidak menampilkan password nyata |
| Safe checklist | Inline SVG checklist pills | Act 4 |
| Unclear command card | Inline SVG redacted card | Tidak berisi command berbahaya |

First pass memakai inline SVG karena gate, key, policy, dan verification memerlukan state internal. Saat eksekusi, buat folder icons, icons.json, default-icon.png, dan loader fallback sesuai kontrak topic baru.

## Draft teks in-video

| Beat | Teks |
|---|---|
| Act 1 | Tugas biasa tidak perlu sudo |
| Act 1 | Sistem membatasi perubahan |
| Act 2 | sudo meminta izin admin |
| Act 2 | Command tetap perlu diperiksa |
| Act 3 | Policy memeriksa user |
| Act 3 | Izin berlaku untuk satu tugas |
| Act 4 | Sumber command harus jelas |
| Act 4 | Target dan dampak diperiksa |
| Closing | Pahami dahulu, lalu sudo |

Teks in-video wajib deklaratif, singkat, tanpa emoji, tanpa kata ganti orang, dan tidak mengulang kalimat secara persis pada bubble serta command card.

## Audio beat map

| Momen | Candidate SFX | Catatan |
|---|---|---|
| Intro selesai | success/shimmer | Header compact selesai |
| Command biasa muncul | ui/tick | Ringan |
| sudo request menuju gate | transitions/light-swoosh-quick | Perjalanan request |
| Gate memeriksa policy | ui/paper-open | Menandai pemeriksaan |
| Kunci admin terkunci/terbuka | impacts/lock dan impacts/unlock | Dua momen berbeda, tidak bertumpuk |
| Checklist aman muncul | ui/pop | Satu cue kelompok |
| Takeaway | success/ding | Penutup |

Sebelum eksekusi, audit asset audio shared untuk semantik, loudness, provenance, dan kategori. SFX_MAP serta schedule export wajib memakai kategori eksplisit dan timestamp sama dengan timeline.

## Rencana file saat eksekusi

| File | Perubahan yang direncanakan |
|---|---|
| src/content/38-sudo/data.js | Viewport, PHASES, palette, labels, captions, dan SFX_MAP. |
| src/content/38-sudo/manifest.js | Metadata Linux Fundamentals. |
| src/content/38-sudo/Animation.jsx | GSAP timeline, reset loop, Scene UI V1, gate, key, verification, dan safety checklist. |
| src/content/38-sudo/caption.md | Caption sosial media di luar video. |
| src/content/38-sudo/icons/* | icons.json, fallback icon, loader, dan aset bila audit memerlukannya. |
| src/content/registry.js | Entry manifest coming-soon sesudah implementasi. |
| scripts/export-lib.js | Jadwal SFX sinkron. |

## Checklist eksekusi

- [ ] Kunci metadata dan title segments cyan/blue → emerald.
- [ ] Buat data.js sebelum Animation.jsx.
- [ ] Buat manifest, caption, dan kontrak folder icons.
- [ ] Gunakan satu IntroHeaderMorphV1 yang tetap mounted setelah morph.
- [ ] Gunakan ActBadgeNavigatorV1 dari satu array PHASES.
- [ ] Render semua visual di ContentBodyV1 local coordinate.
- [ ] Jadikan user card dan terminal strip sebagai anchor persisten.
- [ ] Tampilkan kunci hanya sebagai grant satu command, bukan mode global.
- [ ] Jangan merender command destruktif atau command yang dapat disalin untuk tindakan berisiko.
- [ ] Tampilkan checklist sumber, target, dan dampak sebelum payoff.
- [ ] Reset seluruh state pada repeat timeline.
- [ ] Wire SFX_MAP dan export schedule dengan kategori eksplisit.
- [ ] Audit dead field, teks in-video, collision, dan coverage SFX.
- [ ] Compile, preview intro/morph/semua Act/replay, lalu export MP4.

## Batasan

Content ini bukan panduan konfigurasi sudoers, root shell, atau administrasi server. Detail root user berada pada content 39; permission, chmod, dan chown berada pada content 40–42; keamanan SSH berada pada content 44–45.
