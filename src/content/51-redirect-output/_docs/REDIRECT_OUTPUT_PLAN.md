# PLAN — 51 Redirect Output: Simpan Hasil Perintah

| Item | Nilai |
|---|---|
| Content | 51 — Redirect Output |
| Status | 📝 PLAN ONLY — jangan dieksekusi |
| Target audiens | Pemula Linux yang sudah memahami terminal, command line, dan file |
| Tujuan belajar | Memahami stdout, redirect overwrite, append, serta input redirect sebagai jalur data command |
| Prasyarat | 27 Terminal File Workflow, 48 Shell/Terminal/Command Line |
| Scene shell | scene-ui V1, portrait 820 × 1340 |

## Audience promise

Setelah menonton, audiens memahami bahwa hasil command biasanya muncul di terminal, tetapi dapat diarahkan ke file dengan tanda lebih besar; satu tanda menulis ulang, dua tanda menambahkan di akhir, dan tanda lebih kecil memberi input file ke command.

## Identitas seri

| Field | Keputusan |
|---|---|
| Kategori | Linux Fundamentals |
| Title A | REDIRECT — cyan atau blue |
| Title B | OUTPUT — emerald |
| Subtitle | Arahkan data, bukan hanya tampilkan |
| Tone | Jalur paket data: terminal dan file adalah tujuan yang dapat dipilih |
| Shell | Scene UI V1 dengan hero-to-header, empat Act, badge dan dot navigator |

## Batas akurasi dan keamanan

1. stdout adalah jalur output normal command; redirect lebih besar mengalihkan stdout ke file.
2. Tanda lebih besar menimpa isi target bila file sudah ada; dua tanda menambah di akhir.
3. Tanda lebih kecil menyediakan isi file sebagai standard input untuk command yang membacanya.
4. Jangan memberi contoh target penting seperti konfigurasi sistem, file shell profile, atau file produksi.
5. Gunakan folder latihan dan file hasil.txt agar visual aman.
6. Jangan membahas stderr, 2>, 2>&1, pipe, atau heredoc di content dasar ini; masing-masing membutuhkan episode lanjutan.

## Validasi analogi

Output command dianalogikan sebagai paket yang biasanya tiba di papan layar terminal. Redirect adalah sakelar tujuan: paket dapat ditaruh ke map file. Satu tanda lebih besar mengganti isi map, dua tanda lebih besar menambah lembar baru, dan tanda lebih kecil mengambil lembar dari map untuk diberikan ke command. Analogi menjaga arah data, bukan mempersonifikasikan command sebagai manusia.

## Storyboard empat Act

| Act | Setup → tegangan → titik balik → payoff | Sintaks | Exit state |
|---|---|---|---|
| 1 — Output biasa | Command date menghasilkan waktu → hasil muncul di terminal → layar cepat penuh bila hasil ingin disimpan → stdout punya tujuan default. | date | Output terlihat di terminal. |
| 2 — Tulis ke file | Hasil ingin disimpan → tanda lebih besar memutar jalur ke hasil.txt → file menerima satu isi baru → terminal tidak lagi menjadi tujuan utama. | date > hasil.txt | hasil.txt berisi waktu terbaru. |
| 3 — Tambah, bukan timpa | Hasil kedua perlu disimpan juga → satu tanda berisiko mengganti catatan lama → dua tanda mengalirkan baris baru ke bawah → isi lama tetap ada. | date >> hasil.txt | hasil.txt berisi dua baris waktu. |
| 4 — Input dari file | File daftar.txt sudah memiliki data → command sort butuh input → tanda lebih kecil mengirim isi file ke command → hasil terurut kembali ke terminal. | sort < daftar.txt | Arah input file → command terlihat. |

## State contract

| State | Yang terlihat | Yang belum boleh terlihat | Pemicu | Hasil |
|---|---|---|---|---|
| Stdout | Command date dan output terminal | File hasil berisi data | Act 1 | Jalur default jelas |
| Overwrite redirect | Panah command → hasil.txt | Dua baris file | Act 2 | Satu isi tertulis |
| Append redirect | Baris lama dan baru | Input redirect | Act 3 | Data lama tetap |
| Stdin redirect | daftar.txt → sort → terminal | Stderr/pipeline detail | Act 4 | Arah input dipahami |

## Continuity map

Terminal panel adalah anchor persisten di seluruh Act. File hasil.txt lahir pada Act 2 dan tetap tampil sampai Act 3 sehingga perubahan overwrite versus append dapat dibandingkan pada file yang sama. File daftar.txt muncul pada Act 4 sebagai sumber input baru. Paket data yang sama berubah arah melalui jalur panah; tidak boleh muncul langsung di file tanpa perjalanan visual.

## Layout map V1

Semua koordinat adalah local terhadap ContentBodyV1.

| Area | Local y | Isi |
|---|---:|---|
| Narration bubble | 35–115 | Caption ringkas |
| Command strip | 145–230 | Syntax per Act |
| Terminal anchor | 270–500 | stdout dan hasil sort |
| Data-route lane | 535–690 | Command node, arrow, packet |
| File cards | 730–850 | hasil.txt atau daftar.txt |
| Takeaway | 875–930 | Ringkasan arah tanda |

Panah command → file dan file → command memakai warna arah berbeda. File cards memakai tinggi tetap agar isi dua baris tidak bertabrakan. Tidak ada child local y negatif.

## Elemen visual dan aset

| Elemen | Bentuk | Perilaku |
|---|---|---|
| Terminal window | Inline SVG | Persistent, output berubah |
| Command strip | Inline SVG monospace | Menampilkan sintaks aktif |
| Command node | Inline SVG pill | date atau sort |
| Data packet | Inline SVG capsule | Bergerak sesuai arah redirect |
| hasil.txt card | Inline SVG file | Dibuat, ditimpa, lalu ditambah |
| daftar.txt card | Inline SVG file | Sumber input Act 4 |
| Operator token | Inline SVG besar | Menyorot >, >>, dan < |

First pass memakai inline SVG karena packet, panah, dan isi file berubah state. Saat implementasi, buat folder icons, icons.json, default-icon.png, dan loader fallback sesuai kontrak topic baru.

## Draft teks in-video

| Beat | Teks |
|---|---|
| Act 1 | Output biasanya ke terminal |
| Act 1 | Stdout punya jalur default |
| Act 2 | Lebih besar menulis file |
| Act 2 | Isi lama dapat tertimpa |
| Act 3 | Dua tanda menambah baris |
| Act 3 | Isi lama tetap ada |
| Act 4 | Lebih kecil memberi input |
| Act 4 | File masuk ke command |
| Closing | Pilih arah data dengan jelas |

Teks produksi harus deklaratif, ringkas, tanpa emoji, tanpa kata ganti orang, dan tidak diduplikasi antara narration bubble serta command/file card.

## Audio beat map

| Momen | Candidate SFX | Catatan |
|---|---|---|
| Header compact selesai | success/shimmer | Penanda intro |
| Command diketik | sfx/typing atau ui/tick | Audit loudness dahulu |
| Packet menuju terminal | ui/paper-arrive | Stdout default |
| Sakelar redirect aktif | impacts/connector-snap | Menandai perubahan jalur |
| File ditulis / ditambah | ui/pop dan ui/pop-2 | Beri jarak per operasi |
| Input masuk ke sort | transitions/light-swoosh-quick | Arah file → command |
| Sort selesai | success/ding | Payoff Act 4 |

Sebelum eksekusi, audit asset audio shared untuk semantik, loudness, provenance, serta kategori. Setiap cue aktual harus berada di SFX_MAP dan schedule export pada timestamp identik dengan timeline GSAP.

## Rencana file saat eksekusi

| File | Perubahan yang direncanakan |
|---|---|
| src/content/51-redirect-output/data.js | Viewport, PHASES, palette, command labels, sample file lines, captions, dan SFX_MAP. |
| src/content/51-redirect-output/manifest.js | Metadata Linux Fundamentals. |
| src/content/51-redirect-output/Animation.jsx | GSAP timeline, reset loop, Scene UI V1, terminal, packet routes, dan file states. |
| src/content/51-redirect-output/caption.md | Caption sosial media di luar video. |
| src/content/51-redirect-output/icons/* | icons.json, fallback icon, loader, serta aset bila audit memerlukannya. |
| src/content/registry.js | Entry manifest coming-soon sesudah implementasi. |
| scripts/export-lib.js | Jadwal SFX sinkron. |

## Checklist eksekusi

- [ ] Kunci metadata dan title segments cyan/blue → emerald.
- [ ] Buat data.js sebelum Animation.jsx.
- [ ] Buat manifest, caption, dan kontrak folder icons.
- [ ] Gunakan satu IntroHeaderMorphV1 yang tetap mounted setelah morph.
- [ ] Gunakan ActBadgeNavigatorV1 dari satu array PHASES.
- [ ] Render semua visual di ContentBodyV1 local coordinate.
- [ ] Jadikan terminal dan hasil.txt anchor persisten sesuai continuity map.
- [ ] Visualkan overwrite dan append sebagai perubahan isi file yang berbeda.
- [ ] Visualkan arah data file → command pada input redirect tanpa teleport.
- [ ] Jangan memasukkan contoh target file penting atau sintaks berisiko.
- [ ] Reset seluruh state pada repeat timeline.
- [ ] Wire SFX_MAP serta export schedule dengan kategori eksplisit.
- [ ] Audit dead field, teks in-video, collision, dan coverage SFX.
- [ ] Compile, preview intro/morph/semua Act/replay, lalu export MP4.

## Batasan

Content ini tidak membahas stderr redirect, pipe, command substitution, heredoc, atau file descriptor angka. Pipe dibahas pada content 52; standard input/output/error secara khusus dibahas pada content 53.
