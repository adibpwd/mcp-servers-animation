# PLAN — 28 Membaca File dari Terminal

| Item | Nilai |
|---|---|
| Content | 28 — Reading Files in Terminal |
| Status | 📝 PLAN ONLY — jangan dieksekusi |
| Target audiens | Pemula Linux yang sudah mengenal folder, navigasi, dan operasi file dasar |
| Tujuan belajar | Memilih cat, less, head, dan tail berdasarkan kebutuhan melihat isi file |
| Prasyarat | 25 Linux Filesystem, 26 Terminal Navigation, 27 File Operations |
| Scene shell | scene-ui V1, portrait 820 × 1340 |

## Audience promise

Setelah menonton, audiens dapat membedakan: cat untuk isi singkat, less untuk membaca file panjang, head untuk awal file, dan tail untuk akhir atau log yang terus bertambah.

## Identitas seri

| Field | Keputusan |
|---|---|
| Kategori | Linux Fundamentals |
| Title A | READ — cyan atau blue |
| Title B | FILES — emerald |
| Subtitle | Pilih cara baca sesuai kebutuhan |
| Tone | Ruang baca digital: file yang sama dibuka dengan empat cara, tiap cara menjawab kebutuhan berbeda |
| Shell | Scene UI V1 dengan hero-to-header, empat Act, badge, dan dot navigator |

## Validasi analogi

File dianalogikan sebagai buku atau jurnal. cat membuka isi singkat sekaligus, less membuka buku panjang dengan halaman yang dapat digulir, head melihat halaman depan, dan tail melihat halaman terakhir yang masih menerima tulisan baru. Analogi tidak mengubah fakta bahwa semua command membaca output di terminal.

## Storyboard empat Act

| Act | Setup → tegangan → titik balik → payoff | Command | Exit state |
|---|---|---|---|
| 1 — File kecil | Catatan singkat perlu dicek cepat → terminal membuka file → seluruh isi beberapa baris muncul → cat cocok untuk file kecil. | cat catatan.txt | Isi catatan singkat terlihat penuh. |
| 2 — File panjang | Log panjang tidak nyaman ditumpahkan sekaligus → less membuka tampilan seperti pembaca → indikator posisi bergerak → less cocok untuk membaca bertahap. | less system.log | File panjang terbaca per layar. |
| 3 — Awal file | Header konfigurasi perlu diperiksa → head mengambil bagian atas → baris awal disorot → tidak perlu membuka seluruh file. | head config.ini | Baris awal terlihat. |
| 4 — Akhir yang bergerak | Log baru terus masuk di bagian akhir → tail menyorot baris bawah → tail -f mengikuti baris baru → audiens tahu cara memantau log. | tail dan tail -f app.log | Baris log baru muncul di bawah. |

## State contract

| State | Yang terlihat | Yang belum boleh terlihat | Pemicu | Hasil |
|---|---|---|---|---|
| Awal | Terminal dan daftar tiga file | Isi file | Act 1 | File dipilih |
| Cat terbuka | Semua baris file kecil | Tampilan log panjang | cat selesai | File kecil terbaca cepat |
| Less terbuka | Potongan file panjang + indikator scroll | Baris awal khusus / log live | less selesai | Pembacaan bertahap jelas |
| Head aktif | Sepuluh baris awal disorot | Baris bawah log baru | head selesai | Awal file terfokus |
| Tail aktif | Baris akhir dan baris baru bergerak | File lain berubah | tail -f berjalan | Monitoring log dipahami |

## Continuity map

Terminal window adalah anchor persisten dari Act 1 sampai Act 4. File shelf di sisi atas body juga tetap hidup sebagai konteks pilihan file. Hanya area output terminal yang berubah: output kecil, pembaca panjang, potongan awal, lalu log live. Tidak ada terminal baru yang muncul di setiap Act.

## Layout map V1

Semua angka berikut local terhadap ContentBodyV1.

| Area | Local y | Isi |
|---|---:|---|
| Narration bubble | 35–115 | Caption pendek dekat visual |
| File shelf | 145–240 | catatan.txt, system.log, config.ini, app.log |
| Terminal anchor | 275–730 | Prompt, command, dan area output berubah |
| Read-mode label | 755–815 | Ringkasan fungsi command aktif |
| Takeaway | 860–930 | Pilihan command berdasarkan kebutuhan |

Terminal maksimal tinggi 455px. Output panjang wajib memakai clipping visual internal atau jumlah baris terbatas; tidak memakai foreignObject. Header dan navigator hanya dari Scene UI V1.

## Elemen visual dan aset

| Elemen | Bentuk | Perilaku |
|---|---|---|
| File shelf | Inline SVG file cards | Satu file aktif diberi glow per Act |
| Terminal | Inline SVG panel persisten | Prompt dan output berubah |
| Scroll rail | Inline SVG | Hanya Act 2, thumb bergerak |
| Head highlight | Inline SVG rect transparan | Menyorot sepuluh baris awal |
| Tail cursor | Inline SVG cursor dan baris baru | Hanya Act 4 |
| Read-mode label | Pill dengan nama command | Muncul saat command aktif |

First pass memakai inline SVG karena output dan scroll state berubah sepanjang animasi. Saat eksekusi, buat folder icons beserta icons.json, default-icon.png, dan loader fallback sesuai kontrak, meskipun tidak ada PNG utama yang dibutuhkan.

## Draft teks in-video

| Beat | Teks |
|---|---|
| Act 1 | cat membaca file kecil |
| Act 1 payoff | Isi singkat terlihat sekaligus |
| Act 2 | less membaca bertahap |
| Act 2 payoff | File panjang tidak menumpuk |
| Act 3 | head melihat bagian awal |
| Act 3 payoff | Header file cepat terlihat |
| Act 4 | tail melihat bagian akhir |
| Act 4 payoff | tail -f mengikuti log baru |
| Closing | Pilih command sesuai file |

Teks produksi wajib deklaratif, pendek, tanpa emoji, tanpa kata ganti orang, dan tidak memakai caption global yang menduplikasi card/badge.

## Audio beat map

| Momen | Candidate SFX | Catatan |
|---|---|---|
| Intro selesai | success/shimmer | Header compact selesai |
| Command diketik | sfx/typing atau ui/tick | Audit loudness sebelum memilih |
| File output kecil muncul | ui/paper-arrive | Satu cue untuk kelompok baris |
| Scroll less bergerak | ui/tick | Tidak setiap frame |
| Head highlight aktif | ui/pop | Singkat |
| Baris log baru tail -f | ui/beep-2 atau ui/tick | Ritme pelan, tidak berisik |
| Takeaway | success/ding | Penutup |

Sebelum implementasi, audit asset audio existing untuk semantik, loudness, dan kategori. Semua cue aktual harus didefinisikan di SFX_MAP dan dicatat dengan timestamp sama pada schedule export.

## Rencana file saat eksekusi

| File | Perubahan yang direncanakan |
|---|---|
| src/content/28-reading-files-terminal/data.js | Viewport, PHASES, palette, file text, captions, dan SFX_MAP. |
| src/content/28-reading-files-terminal/manifest.js | Metadata Linux Fundamentals. |
| src/content/28-reading-files-terminal/Animation.jsx | Timeline GSAP, reset loop, Scene UI V1, terminal persistent, dan state output. |
| src/content/28-reading-files-terminal/caption.md | Caption sosial media terpisah dari teks in-video. |
| src/content/28-reading-files-terminal/icons/* | icons.json, default fallback, dan loader. |
| src/content/registry.js | Entry manifest coming-soon sesudah implementasi. |
| scripts/export-lib.js | Jadwal SFX sinkron dengan timeline. |

## Checklist eksekusi

- [ ] Kunci metadata serta title segments cyan/blue → emerald.
- [ ] Buat data.js sebelum Animation.jsx.
- [ ] Buat manifest, caption, dan kontrak folder icons.
- [ ] Gunakan satu IntroHeaderMorphV1 yang tidak di-unmount setelah morph.
- [ ] Gunakan ActBadgeNavigatorV1 dari satu array PHASES.
- [ ] Render semua visual topic dalam ContentBodyV1 local coordinate.
- [ ] Jadikan terminal dan file shelf sebagai anchor persisten.
- [ ] Batasi output file panjang agar tidak overflow body.
- [ ] Buat tail -f dengan baris baru yang jelas datang dari bawah.
- [ ] Reset semua state pada repeat timeline.
- [ ] Wire SFX_MAP serta export schedule dengan kategori eksplisit.
- [ ] Audit dead field, teks in-video, collision, dan coverage SFX.
- [ ] Compile, preview intro/morph/semua Act/replay, lalu export MP4.

## Batasan

Content ini tidak mengajarkan pengeditan file, pencarian teks, permission, atau parsing log lanjutan. Edit file dapat dibahas pada seri editor/CLI terpisah; pencarian teks dibahas di content 30; troubleshooting log lebih dalam dibahas pada content 67.
