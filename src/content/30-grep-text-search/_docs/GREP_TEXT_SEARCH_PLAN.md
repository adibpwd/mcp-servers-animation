# PLAN — 30 Mencari Teks dengan grep

| Item | Nilai |
|---|---|
| Content | 30 — grep Text Search |
| Status | 📝 PLAN ONLY — jangan dieksekusi |
| Target audiens | Pemula Linux yang sudah memahami file, terminal, dan pencarian nama file |
| Tujuan belajar | Memahami grep sebagai pencarian isi teks, serta fungsi dasar pencarian case-insensitive dan recursive |
| Prasyarat | 27 Terminal File Workflow (membaca dan mencari file) |
| Scene shell | scene-ui V1, portrait 820 × 1340 |

## Audience promise

Setelah menonton, audiens dapat membedakan pencarian nama file dengan pencarian isi file, lalu memahami pola dasar grep, grep -i, dan grep -r tanpa harus membaca setiap file satu per satu.

## Identitas seri

| Field | Keputusan |
|---|---|
| Kategori | Linux Fundamentals |
| Title A | SEARCH — cyan atau blue |
| Title B | TEXT — emerald |
| Subtitle | Temukan kata di dalam file |
| Tone | Detektif teks: satu kata kunci meninggalkan jejak di banyak dokumen |
| Shell | Scene UI V1 dengan hero-to-header, empat Act, badge, dan dot navigator |

## Validasi analogi

grep dianalogikan sebagai stabilo pencari kalimat di tumpukan dokumen. Ia tidak mencari nama sampul file, melainkan kata yang ada di dalam halaman. Analogi stabilo menjaga sifat grep: hanya baris yang cocok ditampilkan dan kata yang cocok dapat disorot.

## Storyboard empat Act

| Act | Setup → tegangan → titik balik → payoff | Command | Exit state |
|---|---|---|---|
| 1 — Nama bukan isi | File config.ini sudah ditemukan, tetapi baris port belum diketahui → membuka file panjang terasa lambat → grep mencari kata port → hanya baris cocok muncul. | grep port config.ini | Audiens melihat grep mencari isi. |
| 2 — Sorot kecocokan | Banyak baris config memiliki kata server → hasil grep menyorot kata server di setiap baris → konteks baris tetap tampil → kata kunci mudah dibaca. | grep server config.ini | Beberapa match tampil dengan highlight. |
| 3 — Huruf besar kecil | Kata Error muncul dengan berbagai kapitalisasi → pencarian biasa melewatkan sebagian → grep -i menyamakan kapitalisasi → semua error relevan terlihat. | grep -i error app.log | Hasil case-insensitive terlihat. |
| 4 — Banyak folder | Kata TODO tersebar di proyek → grep -r menyusuri folder dan file → hasil dikelompokkan per path → satu pencarian menemukan jejak proyek. | grep -r TODO projects | Audiens memahami recursive search. |

## State contract

| State | Yang terlihat | Yang belum boleh terlihat | Pemicu | Hasil |
|---|---|---|---|---|
| File dipilih | config.ini dan beberapa baris redup | Hasil match | Act 1 | Target isi jelas |
| Match tunggal | Satu baris port disorot | Hasil multi-file | grep selesai | Isi file dapat dicari |
| Match banyak | Beberapa baris dengan highlight kata | Hasil case-insensitive | Act 2 | grep menampilkan baris relevan |
| Case-insensitive | Error/error/ERROR semua tampil | Path proyek recursive | grep -i selesai | Kapitalisasi bukan penghalang |
| Recursive | Peta folder dan path hasil | Command lanjutan | grep -r selesai | Pencarian menjangkau folder |

## Continuity map

Terminal window adalah anchor persisten dari Act 1 sampai Act 4. Panel dokumen pada Act 1–3 berubah isi, bukan diganti dengan terminal baru. Act 4 memperluas panel menjadi pohon proyek di belakang terminal; hasil dari setiap path mengalir ke daftar hasil yang sama agar pencarian recursive tidak terlihat seperti dunia baru.

## Layout map V1

Semua angka berikut memakai local coordinate ContentBodyV1.

| Area | Local y | Isi |
|---|---:|---|
| Narration bubble | 35–115 | Caption pendek per beat |
| Command strip | 145–220 | Command grep aktif |
| Document/code panel | 255–620 | Baris file dan highlight match |
| Result rail | 650–760 | Baris hasil atau path file |
| Project tree / takeaway | 800–930 | Recursive map dan ringkasan |

Panel teks maksimal tinggi 365px. Baris panjang harus dipotong pada batas logis atau disingkat; jangan mengecilkan font utama di bawah ukuran baca aman. Tidak ada local y negatif.

## Elemen visual dan aset

| Elemen | Bentuk | Perilaku |
|---|---|---|
| Terminal command strip | Inline SVG | Command berubah tiap Act |
| Code panel | Inline SVG baris monospace | Menampilkan konteks file |
| Match highlight | Rect/pill inline SVG | Muncul tepat di belakang kata match |
| Result rail | Inline SVG list | Mengumpulkan baris/path hasil |
| Project tree | Inline SVG folder/file cards | Menyala saat grep -r menyusuri node |
| Keyword token | Pill berwarna | Menjadi fokus visual tiap Act |

First pass memakai inline SVG karena highlight kata, daftar hasil, dan tree scan memerlukan state internal. Saat implementasi, tetap buat folder icons, icons.json, default-icon.png, dan loader fallback sesuai kontrak topic baru.

## Draft teks in-video

| Beat | Teks |
|---|---|
| Act 1 | grep mencari isi file |
| Act 1 payoff | Baris port ditemukan |
| Act 2 | Kata cocok disorot |
| Act 2 payoff | Konteks baris tetap terlihat |
| Act 3 | grep -i abaikan kapitalisasi |
| Act 3 payoff | Semua error terlihat |
| Act 4 | grep -r menelusuri folder |
| Act 4 payoff | Path hasil ikut tampil |
| Closing | Cari isi tanpa membuka semua |

Teks in-video wajib deklaratif, ringkas, tanpa emoji, tanpa kata ganti orang, dan tidak diduplikasi persis pada dua kanal visual.

## Audio beat map

| Momen | Candidate SFX | Catatan |
|---|---|---|
| Intro selesai | success/shimmer | Header compact siap |
| Command grep diketik | sfx/typing atau ui/tick | Pilih setelah audit loudness |
| Match pertama ditemukan | ui/paper-arrive | Payoff Act 1 |
| Highlight match tambahan | ui/tick | Diberi jarak, tidak untuk setiap karakter |
| Mode -i aktif | ui/chime | Perubahan aturan pencarian |
| Recursive scan bergerak | transitions/light-swoosh-quick | Satu cue perjalanan antar-folder |
| Path hasil final | success/ding | Payoff Act 4 |

Sebelum eksekusi, audit asset shared untuk semantik, loudness, provenance, dan kategori. Definisikan setiap cue aktual di SFX_MAP serta schedule export pada waktu yang sama dengan GSAP.

## Rencana file saat eksekusi

| File | Perubahan yang direncanakan |
|---|---|
| src/content/30-grep-text-search/data.js | Viewport, PHASES, palette, sample lines, commands, captions, dan SFX_MAP. |
| src/content/30-grep-text-search/manifest.js | Metadata Linux Fundamentals. |
| src/content/30-grep-text-search/Animation.jsx | GSAP timeline, reset loop, Scene UI V1, terminal persistent, match highlight, dan recursive tree. |
| src/content/30-grep-text-search/caption.md | Caption sosial media di luar video. |
| src/content/30-grep-text-search/icons/* | icons.json, default fallback, loader, dan aset bila audit membutuhkannya. |
| src/content/registry.js | Entry manifest coming-soon sesudah implementasi. |
| scripts/export-lib.js | Jadwal SFX sinkron dengan timeline. |

## Checklist eksekusi

- [ ] Kunci metadata dan title segments cyan/blue → emerald.
- [ ] Buat data.js sebelum Animation.jsx.
- [ ] Buat manifest, caption, dan kontrak folder icons.
- [ ] Gunakan satu IntroHeaderMorphV1 yang tetap mounted setelah morph.
- [ ] Gunakan ActBadgeNavigatorV1 dari satu array PHASES.
- [ ] Render semua visual dalam ContentBodyV1 local coordinate.
- [ ] Jadikan terminal dan code panel sebagai anchor persisten.
- [ ] Pastikan setiap highlight muncul setelah baris konteks terlihat.
- [ ] Visualkan grep -i dan grep -r sebagai perubahan perilaku nyata, bukan badge teks semata.
- [ ] Reset semua state pada repeat timeline.
- [ ] Wire SFX_MAP dan export schedule dengan kategori eksplisit.
- [ ] Audit dead field, teks in-video, collision, dan coverage SFX.
- [ ] Compile, preview intro/morph/semua Act/replay, lalu export MP4.

## Batasan

Content ini tidak membahas regular expression, grep -v, grep -n, pipe ke grep, atau ripgrep. Materi tersebut dapat menjadi lanjutan tingkat menengah setelah dasar pencarian isi file ini dipahami.
