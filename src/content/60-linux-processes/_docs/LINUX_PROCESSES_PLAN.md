# PLAN — 60 Proses di Linux: Aplikasi yang Sedang Hidup

| Item | Nilai |
|---|---|
| Content | 60 — Linux Processes |
| Status | 📝 PLAN ONLY — jangan dieksekusi |
| Target audiens | Pemula Linux dan junior developer |
| Tujuan belajar | Memahami process sebagai program yang sedang berjalan, memiliki PID, memakai resource, dan dapat terlihat dari terminal |
| Prasyarat | 07 Process vs Thread, 48 Shell/Terminal/Command Line |
| Scene shell | scene-ui V1, portrait 820 × 1340 |

## Audience promise

Setelah menonton, audiens dapat membedakan file aplikasi yang diam di disk dengan process yang hidup di memori, serta memahami PID sebagai nomor identitas ketika banyak process berjalan bersamaan.

## Identitas seri

| Field | Keputusan |
|---|---|
| Kategori | Linux Fundamentals |
| Title A | LINUX — cyan atau blue |
| Title B | PROCESSES — emerald |
| Subtitle | Program yang sedang hidup di sistem |
| Tone | Panggung kerja sistem: file aplikasi bangun menjadi pekerja dengan nomor identitas |
| Shell | Scene UI V1 dengan hero-to-header, empat Act, badge dan dot navigator |

## Batas akurasi

1. Program adalah file/instruksi di disk; process adalah instance program yang sedang berjalan.
2. Satu program dapat melahirkan lebih dari satu process.
3. Setiap process memiliki PID unik pada saat ia berjalan; PID dapat dipakai ulang setelah process selesai.
4. Process dapat memakai CPU, memori, file, dan resource lain.
5. Jangan masuk ke signal kill detail, thread scheduling, zombie process, atau systemd; itu memiliki content lanjutan sendiri.

## Validasi analogi

Program dianalogikan sebagai resep yang tersimpan. Process adalah masakan yang sedang dibuat di dapur: memakai bahan, ruang kerja, dan nomor pesanan. Satu resep dapat dibuat beberapa kali menjadi beberapa pesanan. Analogi dipakai untuk membedakan file diam dan eksekusi hidup tanpa menyamakan CPU dengan koki secara berlebihan.

## Storyboard empat Act

| Act | Setup → tegangan → titik balik → payoff | Konsep | Exit state |
|---|---|---|---|
| 1 — File diam | File browser-app berada di disk → belum memakai CPU/memori → user menjalankan aplikasi → file berubah menjadi process card aktif. | program vs process | Satu process browser-app hidup. |
| 2 — Banyak process | Browser, editor, dan music-app berjalan bersamaan → layar menunjukkan beberapa card aktif → tiap card menerima PID → Linux membedakan pekerjaan yang hidup. | PID | Tiga process memiliki PID berbeda. |
| 3 — Resource | Salah satu process memakai memori lebih besar → meter CPU/memory bergerak → resource menempel ke process yang tepat → process bukan hanya nama aplikasi. | CPU dan memory usage | Browser card tampak paling memakai resource. |
| 4 — Lihat dari terminal | Terminal menjalankan ps → daftar process tampil dengan PID dan status → process cards terhubung ke tabel → audiens tahu terminal dapat mengamati proses hidup. | ps | Daftar process nyata disederhanakan terlihat. |

## State contract

| State | Yang terlihat | Yang belum boleh terlihat | Pemicu | Hasil |
|---|---|---|---|---|
| Program file | browser-app file di disk | PID/resource | Act 1 | File belum berjalan |
| Process alive | Satu process card | Banyak process | Launch selesai | Program menjadi instance aktif |
| Process list | Tiga card + PID | Resource meter detail | Act 2 | PID membedakan process |
| Resource view | CPU/memory meter per card | Tabel ps | Act 3 | Pemakaian resource terlihat |
| Terminal view | ps output dan mapping card | Kill action | Act 4 | Process dapat diamati |

## Continuity map

File browser-app menjadi process browser melalui handoff visual: file tetap overlap sesaat ketika process card membesar, lalu file source memudar. Browser process adalah anchor dari Act 1 sampai Act 4. Editor dan music-app lahir Act 2 dan tetap ada hingga tabel ps Act 4. PID labels menempel ke card yang sama, tidak muncul sebagai daftar tanpa pemilik visual.

## Layout map V1

Semua koordinat berikut local terhadap ContentBodyV1.

| Area | Local y | Isi |
|---|---:|---|
| Narration bubble | 35–115 | Caption singkat |
| Disk/program lane | 150–270 | File program awal dan handoff |
| Process arena | 320–600 | Process cards dan PID |
| Resource meters | 640–755 | CPU/memory per process |
| Terminal ps / takeaway | 795–930 | Tabel sederhana dan ringkasan |

Process cards disusun sebagai grid yang dihitung agar tidak overlap. Terminal ps hanya menampilkan beberapa kolom relevan: PID, nama, status; jangan menjadi tabel kecil yang sulit dibaca. Semua child menggunakan local y positif.

## Elemen visual dan aset

| Elemen | Bentuk | Perilaku |
|---|---|---|
| Program file card | Inline SVG file | Handoff menuju process |
| Process card | Inline SVG rounded card | Persistent dan memuat PID/resource |
| PID tag | Inline SVG pill | Menempel ke card yang benar |
| CPU/memory meter | Inline SVG bars | Bergerak Act 3 |
| Terminal strip | Inline SVG | Menjalankan ps Act 4 |
| ps result table | Inline SVG rows | Terhubung ke process cards |

First pass memakai inline SVG karena file-to-process handoff, PID, dan meters memerlukan state animasi internal. Saat eksekusi, buat folder icons, icons.json, default-icon.png, serta loader fallback sesuai kontrak topic baru.

## Draft teks in-video

| Beat | Teks |
|---|---|
| Act 1 | Program masih diam di disk |
| Act 1 | Saat berjalan, ia menjadi process |
| Act 2 | Process memiliki PID |
| Act 2 | Satu program dapat berulang |
| Act 3 | Process memakai resource |
| Act 3 | CPU dan memory dapat berbeda |
| Act 4 | ps melihat process hidup |
| Act 4 | PID membantu mengenali target |
| Closing | Process adalah program yang hidup |

Teks produksi wajib deklaratif, ringkas, tanpa emoji, tanpa kata ganti orang, dan tidak diduplikasi antara narration bubble serta process card.

## Audio beat map

| Momen | Candidate SFX | Catatan |
|---|---|---|
| Header compact selesai | success/shimmer | Intro |
| File berubah jadi process | transitions/light-swoosh-quick | Handoff utama |
| Process card muncul | ui/pop dan ui/pop-2 | Stagger ringan |
| PID tag menempel | ui/tick | Tidak beruntun rapat |
| Resource meter naik | ui/number-tally | Satu cue per perubahan fokus |
| ps output tampil | ui/paper-arrive | Act 4 |
| Takeaway | success/ding | Penutup |

Sebelum eksekusi, audit asset audio shared untuk semantik, loudness, provenance, serta kategori. Semua cue aktual wajib ada di SFX_MAP dan export schedule dengan timestamp sama seperti timeline GSAP.

## Rencana file saat eksekusi

| File | Perubahan yang direncanakan |
|---|---|
| src/content/60-linux-processes/data.js | Viewport, PHASES, palette, program/process labels, PIDs, captions, dan SFX_MAP. |
| src/content/60-linux-processes/manifest.js | Metadata Linux Fundamentals. |
| src/content/60-linux-processes/Animation.jsx | GSAP timeline, reset loop, Scene UI V1, handoff file/process, cards, meters, dan ps table. |
| src/content/60-linux-processes/caption.md | Caption sosial media di luar video. |
| src/content/60-linux-processes/icons/* | icons.json, fallback icon, loader, serta aset bila audit memerlukannya. |
| src/content/registry.js | Entry manifest coming-soon sesudah implementasi. |
| scripts/export-lib.js | Jadwal SFX sinkron. |

## Checklist eksekusi

- [ ] Kunci metadata dan title segments cyan/blue → emerald.
- [ ] Buat data.js sebelum Animation.jsx.
- [ ] Buat manifest, caption, dan kontrak folder icons.
- [ ] Gunakan satu IntroHeaderMorphV1 yang tetap mounted setelah morph.
- [ ] Gunakan ActBadgeNavigatorV1 dari satu array PHASES.
- [ ] Render seluruh visual dalam ContentBodyV1 local coordinate.
- [ ] Buat handoff file program → process card dengan overlap visual.
- [ ] Jadikan browser process dan PID tag anchor sesuai continuity map.
- [ ] Pastikan resource meter melekat ke process yang benar.
- [ ] Batasi tabel ps agar tetap terbaca pada portrait.
- [ ] Reset semua state pada repeat timeline.
- [ ] Wire SFX_MAP serta export schedule dengan kategori eksplisit.
- [ ] Audit dead field, teks in-video, collision, dan coverage SFX.
- [ ] Compile, preview intro/morph/semua Act/replay, lalu export MP4.

## Batasan

Content ini tidak membahas process versus thread secara mendalam, kill/signal, foreground/background, systemd, PID 1, atau monitoring detail. Process versus thread sudah ada pada content 07; kill dibahas pada content 63; job control pada content 64; systemd pada content 65; ps/top/htop pada content 61.
