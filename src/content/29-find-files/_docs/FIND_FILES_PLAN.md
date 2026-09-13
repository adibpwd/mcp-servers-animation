# PLAN — 29 Mencari File dengan Cepat

| Item | Nilai |
|---|---|
| Content | 29 — Find Files |
| Status | 📝 PLAN ONLY — jangan dieksekusi |
| Target audiens | Pemula Linux yang sudah dapat menavigasi folder dan membaca file |
| Tujuan belajar | Memahami kapan memakai find dan locate untuk mencari file berdasarkan nama, lokasi, atau jenis |
| Prasyarat | 25 Linux Filesystem, 26 Terminal Navigation, 28 Reading Files |
| Scene shell | scene-ui V1, portrait 820 × 1340 |

## Audience promise

Setelah menonton, audiens tahu bahwa find menelusuri folder saat ini secara langsung, sedangkan locate mencari dari indeks yang sudah disiapkan; keduanya berguna untuk kebutuhan yang berbeda.

## Identitas seri

| Field | Keputusan |
|---|---|
| Kategori | Linux Fundamentals |
| Title A | FIND — cyan atau blue |
| Title B | FILES — emerald |
| Subtitle | Cari nama, lokasi, dan jenis file |
| Tone | Misi pencarian: peta folder besar, satu file target, dan dua cara menemukan alamatnya |
| Shell | Scene UI V1 dengan hero-to-header, empat Act, badge, dan dot navigator |

## Validasi analogi

find dianalogikan sebagai petugas yang memeriksa rak satu per satu dari lokasi yang dipilih. locate dianalogikan sebagai mencari lewat katalog perpustakaan yang sudah dibuat sebelumnya. Katalog dapat ketinggalan dari perubahan terbaru; analogi ini menjaga perbedaan teknis antara scan langsung dan database indeks.

## Storyboard empat Act

| Act | Setup → tegangan → titik balik → payoff | Command | Exit state |
|---|---|---|---|
| 1 — File hilang | File laporan.pdf diperlukan, tetapi foldernya lupa → peta folder terlalu banyak → nama target ditetapkan → pencarian punya tujuan jelas. | Persiapan target | Target laporan.pdf terlihat sebagai kartu redup. |
| 2 — find nama | Pencarian mulai dari home → find menelusuri cabang satu per satu → documents/reports menyala → path lengkap target ditemukan. | find /home/adib -name laporan.pdf | Hasil path terlihat sebagai alamat file. |
| 3 — find jenis | Banyak file log perlu dicari tanpa menghafal nama → filter jenis file diterapkan → hanya log tampil → pencarian dapat dibatasi. | find /var/log -type f -name *.log | Daftar log yang relevan terlihat. |
| 4 — locate katalog | File umum perlu ditemukan cepat → locate mencari katalog → hasil muncul segera → catatan indeks lama ditampilkan secara jujur. | locate laporan.pdf | Audiens tahu locate cepat, tetapi perlu indeks terbaru. |

## State contract

| State | Yang terlihat | Yang belum boleh terlihat | Pemicu | Hasil |
|---|---|---|---|---|
| Target | Kartu laporan.pdf redup dalam peta | Path jawaban | Act 1 | Kebutuhan pencarian jelas |
| Scan langsung | Cabang folder menyala berurutan | Hasil final sebelum cabang dicapai | find berjalan | Pencarian dari lokasi nyata |
| Hasil nama | Satu path penuh | Hasil filter log | find selesai | Lokasi file diketahui |
| Hasil jenis | Beberapa kartu .log | Hasil katalog locate | filter selesai | Pencarian dapat dibatasi |
| Katalog | Daftar hasil cepat + status index | Janji hasil selalu terbaru | locate selesai | Batas locate dipahami |

## Continuity map

Peta filesystem mini dan kartu target laporan.pdf adalah anchor persisten dari Act 1 sampai Act 4. Cahaya scan bergerak di cabang pohon pada Act 2 dan 3; peta tidak di-reset menjadi pohon baru. Act 4 menambahkan layer katalog di samping peta, bukan mengganti filesystem asli.

## Layout map V1

Semua angka adalah local coordinate ContentBodyV1.

| Area | Local y | Isi |
|---|---:|---|
| Narration bubble | 35–115 | Caption deklaratif dekat beat aktif |
| Command strip | 145–220 | Perintah find atau locate |
| Filesystem map | 255–620 | Pohon folder dan cahaya scan |
| Result card | 655–765 | Path hasil atau daftar file |
| Index note / takeaway | 805–930 | Catatan locate dan ringkasan |

Peta folder maksimal tinggi 350px. Result path yang panjang dipecah menjadi segmen breadcrumb atau dua baris tspan; jangan memakai satu text SVG panjang yang overflow.

## Elemen visual dan aset

| Elemen | Bentuk | Perilaku |
|---|---|---|
| Filesystem map | Inline SVG tree | Anchor persisten |
| Scan dot | Circle/glow inline SVG | Bergerak sepanjang cabang |
| Command strip | Terminal pill | Command muncul per Act |
| Result breadcrumb | Pill path segments | Muncul setelah scan mencapai target |
| Log chips | File cards kecil | Disaring pada Act 3 |
| Locate catalog | Kartu indeks | Muncul Act 4 dengan timestamp/index status |
| Stale note | Badge amber | Menjelaskan indeks dapat tertinggal |

First pass memakai inline SVG karena scan dot, pohon folder, dan hasil filter memerlukan state/motion internal. Saat implementasi, buat folder icons dengan icons.json, default-icon.png, dan loader fallback sesuai kontrak; PNG hanya dipakai bila audit kemudian menemukan elemen statis yang lebih cocok sebagai aset.

## Draft teks in-video

| Beat | Teks |
|---|---|
| Act 1 | Nama file sudah diketahui |
| Act 1 | Lokasi file belum jelas |
| Act 2 | find menelusuri folder langsung |
| Act 2 | Path lengkap ditemukan |
| Act 3 | Filter membatasi hasil |
| Act 3 | Hanya file log terlihat |
| Act 4 | locate membaca katalog |
| Act 4 | Indeks dapat tertinggal |
| Closing | Pilih scan atau katalog |

Semua teks in-video bersifat deklaratif, pendek, tanpa emoji, tanpa kata ganti orang, dan tidak menduplikasi tepat antara bubble dan hasil card.

## Audio beat map

| Momen | Candidate SFX | Catatan |
|---|---|---|
| Intro selesai | success/shimmer | Header compact selesai |
| Command find muncul | sfx/typing atau ui/tick | Audit loudness terlebih dahulu |
| Cahaya scan melewati node | ui/tick | Tidak setiap frame; maksimal beberapa beat penting |
| Path target ditemukan | success/ding | Payoff Act 2 |
| Filter log diterapkan | ui/pop | Satu cue untuk perubahan daftar |
| Katalog locate terbuka | ui/paper-open | Membeda dari scan langsung |
| Indeks lama ditandai | warnings/alert-pulse atau soft-deny | Dipilih sesuai hasil audit semantik |
| Takeaway | success/confirm | Penutup |

Sebelum eksekusi, scan audio shared, ukur loudness, dan pastikan kategori dalam SFX_MAP cocok dengan folder file. Timestamp schedule export wajib sama dengan timeline GSAP.

## Rencana file saat eksekusi

| File | Perubahan yang direncanakan |
|---|---|
| src/content/29-find-files/data.js | Viewport, PHASES, palette, command labels, captions, path data, dan SFX_MAP. |
| src/content/29-find-files/manifest.js | Metadata Linux Fundamentals. |
| src/content/29-find-files/Animation.jsx | GSAP timeline, state reset, Scene UI V1, peta folder persistent, scan, dan katalog. |
| src/content/29-find-files/caption.md | Caption sosial media, terpisah dari teks in-video. |
| src/content/29-find-files/icons/* | icons.json, default fallback, loader, dan aset tambahan bila diperlukan. |
| src/content/registry.js | Entry manifest coming-soon sesudah implementasi. |
| scripts/export-lib.js | Jadwal SFX sinkron. |

## Checklist eksekusi

- [ ] Kunci metadata serta title segments cyan/blue → emerald.
- [ ] Buat data.js sebelum Animation.jsx.
- [ ] Buat manifest, caption, dan kontrak folder icons.
- [ ] Gunakan satu IntroHeaderMorphV1 yang tetap mounted setelah morph.
- [ ] Gunakan ActBadgeNavigatorV1 dari satu array PHASES.
- [ ] Render semua visual topic di ContentBodyV1 local coordinate.
- [ ] Jadikan filesystem map dan target file anchor persisten.
- [ ] Pastikan scan dot tidak teleport antar cabang.
- [ ] Pisahkan jelas scan langsung find dan pencarian indeks locate.
- [ ] Tampilkan batas indeks locate secara eksplisit.
- [ ] Reset semua state pada repeat timeline.
- [ ] Wire SFX_MAP dan export schedule dengan kategori eksplisit.
- [ ] Audit dead field, teks in-video, collision, dan SFX coverage.
- [ ] Compile, preview intro/morph/semua Act/replay, lalu export MP4.

## Batasan

Content ini tidak membahas pencarian isi teks di dalam file; itu menjadi fokus content 30 tentang grep. Tidak membahas kombinasi find dengan exec, regex lanjutan, atau administrasi indeks locate; materi tersebut dapat menjadi lanjutan tingkat menengah.
