# PLAN — 27 File Operations: Buat, Salin, Pindah, Hapus dengan Aman

| Item | Nilai |
|---|---|
| Content | 27 — File Operations |
| Status | 📝 PLAN ONLY — jangan dieksekusi |
| Target audiens | Pemula Linux setelah memahami filesystem dan terminal navigation |
| Tujuan belajar | Memahami peran touch, mkdir, cp, mv, dan rm tanpa mendorong tindakan hapus yang ceroboh |
| Prasyarat | 25 Linux Filesystem dan 26 Terminal Navigation |
| Scene shell | scene-ui V1, portrait 820 × 1340 |

## Audience promise

Setelah menonton, audiens memahami bahwa file dapat dibuat, folder dapat dibuat, salinan menghasilkan dua file, pindah mengubah alamat file yang sama, dan hapus adalah tindakan yang perlu dicek sebelum dijalankan.

## Identitas seri

| Field | Keputusan |
|---|---|
| Kategori | Linux Fundamentals |
| Title A | FILE — cyan atau blue |
| Title B | OPERATIONS — emerald |
| Subtitle | Buat, salin, pindah, hapus dengan aman |
| Tone | Meja kerja digital: setiap command mengubah benda yang terlihat, bukan sekadar teks command |
| Referensi shell | Scene UI V1 dengan satu hero-to-header morph dan navigator empat Act |

## Aturan keamanan narasi

1. Jangan menampilkan command hapus rekursif atau command dengan target luas.
2. Gunakan file latihan bernama catatan.txt dan folder latihan agar aman secara visual.
3. Sebelum rm, tampilkan checklist kecil: cek nama dan cek folder aktif.
4. Jelaskan bahwa rm tidak memiliki tempat sampah bawaan; jangan menjanjikan file pasti dapat dikembalikan.
5. Jangan meminta audiens menjalankan perintah di folder sistem atau folder yang berisi data penting.

## Validasi analogi

File dianalogikan sebagai lembar catatan di meja kerja. touch membuat lembar kosong, mkdir membuat laci baru, cp menggandakan lembar, mv memindahkan lembar yang sama ke laci lain, dan rm mengangkat lembar dari meja kerja. Analogi sengaja tidak menyebut “sampah” agar tidak menyamakan rm dengan Trash di desktop.

## Storyboard empat Act

| Act | Setup → tegangan → titik balik → payoff | Command | Exit state |
|---|---|---|---|
| 1 — Buat ruang | Meja latihan kosong → perlu tempat menyimpan catatan → mkdir membuat folder latihan → touch membuat catatan kosong. | mkdir, touch | Folder latihan dan catatan.txt terlihat. |
| 2 — Salin | Catatan tunggal perlu versi cadangan → cp membuat salinan → dua file tampil berdampingan → audiens melihat salin bukan pindah. | cp | catatan.txt dan salinan.txt berada di folder sama. |
| 3 — Pindah | Salinan perlu dimasukkan ke folder arsip → mv membawa file yang sama → slot asal kosong → alamat file berubah. | mv | salinan.txt berada di folder arsip. |
| 4 — Hapus aman | File latihan tidak lagi diperlukan → cek target dan lokasi → rm hanya menghapus file latihan → takeaway menekankan cek sebelum hapus. | rm | File latihan hilang, arsip tetap aman. |

## State contract

| State | Yang terlihat | Yang belum boleh terlihat | Pemicu | Hasil |
|---|---|---|---|---|
| Awal | Meja latihan kosong | File dan folder hasil | Act 1 | Ruang kerja siap |
| Dibuat | Folder latihan + catatan.txt | Salinan | touch selesai | Objek pertama ada |
| Disalin | Dua file dengan isi sama | Folder arsip berisi file | cp selesai | Dua objek berbeda |
| Dipindah | Slot asal kosong, file muncul di arsip | File latihan terhapus | mv selesai | Satu objek berganti alamat |
| Dihapus | Hanya file latihan hilang | Arsip ikut hilang | Checklist aman lolos lalu rm | Batas rm dipahami |

## Continuity map

Folder latihan adalah anchor persisten sepanjang semua Act. File catatan.txt bertahan dari Act 1 sampai akhir. salinan.txt lahir di Act 2, berpindah sebagai objek yang sama pada Act 3, dan tidak ikut dihapus pada Act 4. File latihan.tmp baru muncul khusus Act 4 agar aksi rm tidak menyasar catatan atau arsip yang penting.

## Layout map V1

Koordinat merupakan local coordinate ContentBodyV1.

| Area | Local y | Isi |
|---|---:|---|
| Narration bubble | 35–115 | Kalimat pendek per beat |
| Meja/folder latihan | 155–440 | Anchor folder dan file aktif |
| Folder arsip / jalur pindah | 490–700 | Tujuan mv dan motion file |
| Safety checklist | 730–830 | Hanya tampil pada Act 4 |
| Takeaway | 870–930 | Penutup |

Panel terbesar maksimal tinggi 285px dan tidak boleh melewati navigator atau closing zone. Header, badge, dan dot hanya dari component Scene UI V1.

## Elemen visual dan aset

| Elemen | Bentuk | Perilaku |
|---|---|---|
| Terminal command strip | Inline SVG | Command ditulis satu baris per beat |
| Folder latihan | Inline SVG folder besar | Persistent anchor |
| File card | Inline SVG kertas | Masuk, salin, pindah, atau keluar sesuai state |
| Folder arsip | Inline SVG folder | Tujuan visual Act 3 |
| Safety checklist | Pill checklist | Muncul sebelum rm |
| Target rm | File latihan.tmp | Berbeda jelas dari catatan dan arsip |

First pass memakai inline SVG karena file dan folder memiliki state animasi internal. Saat eksekusi, folder icons tetap dibuat sesuai kontrak topic, bersama icons.json, loader fallback, dan default-icon.png.

## Draft teks in-video

| Beat | Teks |
|---|---|
| Act 1 | Folder latihan dibuat |
| Act 1 | File kosong mulai ada |
| Act 2 | Salinan membuat dua file |
| Act 2 | File asal tetap ada |
| Act 3 | mv mengubah alamat file |
| Act 3 | Slot asal menjadi kosong |
| Act 4 | Cek target sebelum rm |
| Act 4 | rm tidak punya Trash bawaan |
| Closing | Cek lokasi sebelum menghapus |

Teks produksi wajib deklaratif, maksimal sekitar 5–8 kata, tanpa emoji, tanpa kata ganti orang, dan tidak diduplikasi persis antara bubble dan card.

## Audio beat map

| Momen | Candidate SFX | Catatan |
|---|---|---|
| Intro selesai | success/shimmer | Header compact siap |
| Folder/file dibuat | ui/pop dan ui/tick | Ringan dan terpisah |
| Salinan muncul | ui/paper-arrive | Menegaskan objek kedua lahir |
| File menuju arsip | transitions/light-swoosh-quick | Menegaskan arah pindah |
| Checklist aman | ui/tick | Maksimal dua cue berdekatan |
| File latihan dihapus | warnings/soft-deny | Tidak dibuat menyeramkan, tetapi jelas |
| Takeaway | success/ding | Penutup positif |

Sebelum eksekusi, audit file audio existing untuk semantik, kategori, provenance, dan loudness. Semua cue aktual harus masuk SFX_MAP serta schedule export pada timestamp identik.

## Rencana file saat eksekusi

| File | Perubahan yang direncanakan |
|---|---|
| src/content/27-file-operations/data.js | PHASES, palette, command labels, captions, dan SFX_MAP. |
| src/content/27-file-operations/manifest.js | Metadata Linux Fundamentals. |
| src/content/27-file-operations/Animation.jsx | Timeline GSAP, reset loop, Scene UI V1, persistent folder/file state. |
| src/content/27-file-operations/caption.md | Caption sosial media di luar visual video. |
| src/content/27-file-operations/icons/* | icons.json, default fallback, loader; aset tambahan hanya bila benar-benar dibutuhkan. |
| src/content/registry.js | Import manifest dan entry coming-soon sesudah implementasi. |
| scripts/export-lib.js | Jadwal SFX sesuai waktu timeline. |

## Checklist eksekusi

- [ ] Kunci metadata, title segments cyan/blue → emerald, dan PHASES.
- [ ] Buat data.js sebelum Animation.jsx.
- [ ] Buat manifest, caption, dan kontrak folder icons.
- [ ] Gunakan satu IntroHeaderMorphV1 yang tetap mounted setelah morph.
- [ ] Gunakan ActBadgeNavigatorV1 dari satu array PHASES.
- [ ] Letakkan seluruh visual topic dalam ContentBodyV1 local coordinate.
- [ ] Jadikan folder latihan, catatan.txt, dan salinan.txt sesuai continuity map.
- [ ] Pastikan rm hanya menyasar latihan.tmp dan safety checklist muncul lebih dulu.
- [ ] Reset semua state pada repeat timeline.
- [ ] Wire SFX_MAP dan export schedule dengan kategori eksplisit.
- [ ] Audit dead field, teks in-video, collision, dan coverage SFX.
- [ ] Compile, preview setiap Act/replay, lalu export MP4.

## Batasan

Content ini tidak membahas wildcard, recursive deletion, permission, recovery file, atau backup. Wildcard dibahas pada content 31, permission pada content 40–42, dan backup pada content 79.
