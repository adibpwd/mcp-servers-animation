# PLAN — 26 Terminal Navigation: Jangan Tersesat di Linux

| Item | Nilai |
|---|---|
| Content | 26 — Terminal Navigation |
| Status | ✅ DISUPERSEDE oleh `revisi/2026-09-13-revisi-02-real-terminal-workflows.md` — plan asli di bawah ini (navigasi murni: pwd/ls/cd/path) sudah diperluas jadi satu workflow nyata (navigasi + file ops + editor + package + chaining). `data.js` dan `Animation.jsx` di disk sudah mengikuti revisi-02, BUKAN tabel Act/teks in-video pada plan asli ini. Baca revisi-02 untuk struktur cerita yang berlaku sekarang. |
| Target audiens | Orang awam, pelajar, dan pemula Linux |
| Tujuan belajar (plan asli — sudah diperluas) | Memahami pwd, ls, cd, path absolut, dan path relatif sebagai cara membaca alamat saat berada di terminal |
| Prasyarat | Content 25 — Linux Filesystem: Rumah Semua File |
| Scene shell | scene-ui V1, portrait 820 × 1340 |

## Audience promise

Setelah menonton, audiens dapat menjawab tiga hal: sedang berada di folder mana, apa isi folder tersebut, dan bagaimana berpindah memakai alamat penuh atau alamat relatif.

## Identitas seri

| Field | Keputusan |
|---|---|
| Kategori | Linux Fundamentals |
| Title A | TERMINAL — cyan atau blue |
| Title B | NAVIGATION — emerald |
| Subtitle | Tahu lokasi, lihat isi, lalu berpindah |
| Referensi visual | Pohon filesystem content 25, tetapi fokusnya kamera terminal yang berjalan dari satu folder ke folder lain |
| Tone | Petualangan ringan di gedung folder; tiap command memecahkan satu kebingungan kecil |

## Validasi analogi

Terminal dianalogikan sebagai penjelajah di dalam gedung. Prompt menunjukkan posisi saat ini, pwd bertanya lokasi, ls melihat isi ruangan, dan cd berpindah ruang. Analogi ini hanya menjelaskan navigasi; command tetap ditampilkan apa adanya agar audiens tidak mengira terminal adalah file manager grafis.

## Alur cerita empat Act

| Act | Setup → tegangan → titik balik → payoff | Konsep teknis | Exit state |
|---|---|---|---|
| 1 — Lokasi | Prompt tampil di folder yang belum dikenali → posisi terasa membingungkan → pwd menjawab lokasi → audiens tahu current working directory. | pwd | Terminal berada di /home/adib. |
| 2 — Isi ruang | Lokasi sudah diketahui, tetapi isi folder belum terlihat → ls membuka daftar → folder dan file muncul → audiens tahu ls tidak memindahkan lokasi. | ls | Isi /home/adib terlihat, termasuk documents dan projects. |
| 3 — Pindah tujuan | Target projects terlihat → cd projects membawa terminal masuk → prompt berubah → audiens melihat command benar-benar mengubah lokasi. | cd dan path relatif | Terminal berada di /home/adib/projects. |
| 4 — Dua jenis alamat | Target notes.txt perlu dicapai → path relatif dibandingkan dengan alamat penuh → kedua rute menuju tujuan yang sama → audiens mengenal path relatif dan absolut. | relative path dan absolute path | Takeaway: cek posisi dulu, lalu pilih rute. |

## State contract

Topic ini single-concept tanpa request/response. State visual minimum:

| State | Yang terlihat | Pemicu | Hasil |
|---|---|---|---|
| Awal | Prompt dengan folder ringkas | Intro selesai | Posisi belum dijelaskan |
| Lokasi diketahui | Output pwd | pwd selesai diketik | Full path terlihat |
| Isi terbuka | Output ls dan folder cards | ls selesai diketik | Target projects terlihat |
| Lokasi berubah | Prompt baru | cd projects dijalankan | Current directory berpindah |
| Rute dibandingkan | Dua breadcrumb path | Act 4 dimulai | Relative dan absolute path mengarah ke target sama |

## Continuity map

Terminal window adalah anchor persisten dari Act 1 sampai Act 4. Prompt berubah dari /home/adib menjadi /home/adib/projects lewat transisi teks/indikator, bukan hilang lalu muncul sebagai terminal baru. Pohon folder mini tetap redup di sisi terminal untuk menghubungkan content 25 ke navigasi nyata.

## Layout map V1

Semua koordinat berikut lokal terhadap ContentBodyV1.

| Area | Local y | Isi |
|---|---:|---|
| Narration bubble | 35–115 | Satu kalimat pendek yang menjelaskan beat saat ini |
| Terminal anchor | 155–545 | Window terminal persisten dan output command |
| Folder map | 590–760 | Breadcrumb, folder target, atau perbandingan path |
| Takeaway | 830–925 | Insight akhir dan tujuan file |

Aturan collision:

- Header dan navigator hanya dari scene-ui V1.
- Tidak ada child body dengan local y negatif.
- Terminal terbesar maksimal tinggi 390px; bottom tidak melewati local y 545.
- Path comparison memakai dua baris atau dua card, bukan teks panjang satu baris yang overflow.

## Komponen visual

| Elemen | Bentuk | Status aset |
|---|---|---|
| Terminal window | Inline SVG dengan prompt, command, dan output yang berubah | Inline SVG |
| Cursor | Rect kecil berkedip / state sederhana | Inline SVG |
| Folder map | Folder card dan breadcrumb | Inline SVG |
| Path token | Pill per segmen alamat | Inline SVG |
| Target file | Kartu file notes.txt | Inline SVG |

Tidak ada PNG yang dibutuhkan pada first pass karena semua elemen perlu berubah state sepanjang cerita. Folder icons tetap dibuat sesuai kontrak topic baru, bersama default-icon.png, icons.json, dan loader fallback.

## Draft teks in-video

Semua teks harus ringkas, deklaratif, tanpa emoji, tanpa kata ganti orang, dan tidak berbentuk pertanyaan.

| Beat | Teks |
|---|---|
| Act 1 | Lokasi terminal belum jelas |
| Act 1 payoff | pwd menunjukkan lokasi aktif |
| Act 2 | ls melihat isi folder |
| Act 2 payoff | projects menjadi tujuan |
| Act 3 | cd berpindah ke projects |
| Act 3 payoff | Prompt menunjukkan lokasi baru |
| Act 4 | Path relatif mulai dari sini |
| Act 4 | Path absolut mulai dari slash |
| Closing | Cek posisi sebelum berpindah |

## Audio beat map

| Momen | Candidate SFX | Catatan |
|---|---|---|
| Header compact selesai | success/shimmer | Penanda intro selesai |
| Command mulai diketik | sfx/typing atau ui/tick | Pilih setelah audit loudness |
| Output pwd / ls muncul | ui/pop atau ui/paper-arrive | Satu cue per kelompok output |
| cd berpindah folder | transitions/light-swoosh-quick | Menandai perpindahan lokasi |
| Target file ditemukan | success/ding | Payoff Act 4 |

Sebelum implementasi, scan asset audio yang ada, cek kategori dan loudness, lalu catat setiap cue aktual ke SFX_MAP serta scripts/export-lib.js pada timestamp yang sama.

## Rencana file saat eksekusi

| File | Perubahan yang direncanakan |
|---|---|
| src/content/26-terminal-navigation/data.js | Viewport, palette, PHASES, labels, captions, dan SFX_MAP. |
| src/content/26-terminal-navigation/manifest.js | Metadata Linux Fundamentals. |
| src/content/26-terminal-navigation/Animation.jsx | Timeline GSAP, state reset loop, scene-ui V1, dan visual terminal. |
| src/content/26-terminal-navigation/caption.md | Caption sosial media, terpisah dari teks in-video. |
| src/content/26-terminal-navigation/icons/icons.json | Asset plan, meski first pass memakai inline SVG. |
| src/content/26-terminal-navigation/icons/default-icon.png | Placeholder fallback. |
| src/content/26-terminal-navigation/icons/loader.js | Fallback asset loader. |
| src/content/registry.js | Import manifest dan entry coming-soon setelah implementasi siap. |
| scripts/export-lib.js | SFX schedule yang waktunya sama dengan timeline. |

## Checklist eksekusi

- [x] Tetapkan title segments cyan/blue → emerald dan metadata manifest.
- [x] Buat data.js sebelum Animation.jsx.
- [x] Buat folder icons, default icon, icons.json, dan loader fallback.
- [x] Implementasikan IntroHeaderMorphV1 yang selalu mounted.
- [x] Implementasikan ActBadgeNavigatorV1 dari satu PHASES array.
- [x] Render seluruh visual topic di ContentBodyV1 local coordinate.
- [x] Buat terminal sebagai persistent anchor lintas Act.
- [x] Reset semua state pada awal repeat timeline.
- [x] Tambahkan SFX_MAP dan export schedule yang sinkron.
- [x] Audit dead field, teks in-video, category SFX, dan collision.
- [ ] Compile, preview frame intro/morph/tiap Act/replay, lalu export MP4.

### Catatan progres

- **2026-09-13 — insiden file hilang:** sesi sebelumnya melaporkan manifest.js, data.js,
  Animation.jsx, icons.json, loader.js, dan caption.md sudah dibuat, tapi saat sesi ini
  dilanjutkan, kelima file tersebut TIDAK ada di disk (kemungkinan sempat tertulis ke
  lokasi/sandbox yang salah, mirip insiden str_replace vs edit_block yang tercatat
  sebelumnya). registry.js sudah lebih dulu mengimpor manifest.js yang belum ada, sehingga
  jadi broken import. Semua file tersebut sudah ditulis ulang dari nol via Desktop
  Commander mengikuti plan ini dan pola implementasi topic 25, dengan timing internal
  timeline (Animation.jsx) disesuaikan supaya presis match dengan SFX_SCHEDULES yang
  sudah ada di scripts/export-lib.js (17 cue, dari shimmer intro sampai ding takeaway).
- Registrasi ke `src/content/registry.js` sudah ada (status: coming-soon, menunggu preview manual sebelum diubah ke ready).
- Semua file audio yang direferensikan di `SFX_MAP` (data.js) dan `SFX_SCHEDULES` (scripts/export-lib.js) sudah diverifikasi ada di disk (ui/, success/, transitions/).
- `npm run build` sudah dijalankan dan sukses (exit code 0) — memvalidasi tidak ada syntax/import error di manifest.js, data.js, maupun Animation.jsx.
- Sisa pekerjaan: preview manual `npm run dev` di `/player/terminal-navigation` untuk mengecek frame intro/morph/tiap Act/replay secara visual, lalu export MP4 test, sebelum status diubah ke ready.
- **2026-09-13 — sinkronisasi dokumen setelah revisi-02:** `caption.md` sudah
  ditulis ulang mengikuti cerita revisi-02 (Adib, empat Act: kenali posisi &
  rute → susun workspace → kelola & edit dengan aman → siapkan & jalankan
  workflow); versi lama caption (pwd/ls/cd/notes.txt) sudah dibuang. Plan asli
  di file ini juga sudah ditandai disuperseded di bagian atas dan bagian
  "Batasan" — tabel Act, "Draft teks in-video", dan "Audio beat map" di bawah
  ini TETAP dibiarkan apa adanya sebagai arsip plan awal (bukan dihapus),
  supaya histori keputusan awal tidak hilang; rujukan yang berlaku sekarang
  ada di `revisi/2026-09-13-revisi-02-real-terminal-workflows.md`. Belum
  dilakukan: preview manual & export MP4 (masih item terbuka yang sama).

## Batasan (plan asli — sudah tidak berlaku, lihat catatan status di atas)

Plan asli ini tidak mencakup perintah yang mengubah file, permission, atau
penghapusan; fokusnya hanya menemukan lokasi, melihat isi, dan berpindah
folder. Batasan ini **sudah dicabut oleh revisi-02**: revisi tersebut sengaja
menambahkan `mkdir`, `touch`, `cp`, `mv`, `rm -i`, `cat`/`nano`, dan
`sudo apt install` ke content 26 karena semuanya tetap bagian dari "terminal
navigation" dalam satu sesi kerja nyata (dari cari lokasi sampai project siap
jalan). Content 27 (file operations) tetap ada sebagai pendalaman terpisah
untuk operasi file yang lebih lanjut, bukan pengulangan dari revisi ini.
