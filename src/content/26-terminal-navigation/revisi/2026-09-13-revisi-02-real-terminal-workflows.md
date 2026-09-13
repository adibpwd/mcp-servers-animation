# Revisi-02 — Terminal Navigation: Workflow Folder, File, Editor, dan Paket

| Item | Nilai |
|---|---|
| Content | 26 — Terminal Navigation |
| Tanggal | 2026-09-13 |
| Status | ✅ DIEKSEKUSI (2026-09-13) — `data.js` & `Animation.jsx` sudah ditulis ulang mengikuti plan ini. Cerita pakai "Adib" (bukan "Rani", disesuaikan dengan konvensi project). Belum preview manual & export MP4. |
| Fokus | Memperluas contoh terminal menjadi kegiatan nyata yang sering dilakukan pengguna umum dan developer, dengan ketikan terminal serta padanan GUI/file manager. |

## Masalah versi sekarang

Versi saat ini membangun fondasi yang benar—`pwd`, `ls`, `cd`, relative path,
dan absolute path—tetapi hanya berhenti setelah masuk ke satu folder `projects`.
Audiens belum melihat bagaimana terminal dipakai setelah tiba di folder: membuat
workspace, memindahkan file, mengganti nama, membuka teks, membersihkan file
sementara, atau menyiapkan tool developer.

Revisi ini bukan daftar command tanpa cerita. Semua command muncul sebagai
jawaban atas kebutuhan satu workflow kecil dan selalu punya dampak visual di
GUI/file manager.

## Audience promise

Setelah revisi, audiens dapat mengikuti satu sesi kerja dari Home sampai
project siap dipakai, serta membedakan:

- lokasi (`pwd`, `cd`, `cd ..`, `cd ~`);
- isi dan struktur (`ls`, `ls -la`, `mkdir`, `touch`);
- pengelolaan aman (`cp`, `mv`, rename, `rm -i`);
- membaca/mengedit teks (`cat`, `less`, `nano` atau editor pilihan);
- setup tool (`sudo apt install ...` sebagai contoh Debian/Ubuntu);
- command berantai (`&&`) dan pemisah (`;`) secara visual.

## Cerita utama

Gunakan satu kasus konsisten: **Rani menyiapkan project “landing-page” dari
folder Downloads ke workspace `~/Projects`, lalu menjalankannya.**

File yang terlihat sejak awal:

```text
Home
├── Downloads/
│   ├── landing-page-starter.zip
│   └── screenshot-draft.png
├── Documents/
│   └── brief.txt
└── Projects/
    └── (masih kosong)
```

Hasil akhir yang terlihat:

```text
~/Projects/landing-page
├── src/
│   └── index.html
├── assets/
│   └── screenshot-draft.png
├── README.md
└── .gitignore
```

Command yang benar-benar memodifikasi file hanya ditunjukkan pada file contoh
non-penting. Tidak ada `rm -rf`, command root yang luas, atau perintah yang
langsung menyentuh home/workspace penonton.

## Peta kasus command dan GUI

| Kebutuhan nyata | Ketikan terminal | Dampak GUI yang wajib terlihat | Pesan |
|---|---|---|---|
| Cek lokasi | `pwd` | Breadcrumb Home aktif | Jangan menebak lokasi. |
| Lihat isi biasa/tersembunyi | `ls` lalu `ls -la` | Folder dan `.gitignore` muncul | `-a` termasuk item tersembunyi. |
| Masuk, kembali, pulang | `cd Downloads`, `cd ..`, `cd ~` | Marker folder bergerak pada tree | `..` naik satu level; `~` kembali home. |
| Buat struktur | `mkdir -p Projects/landing-page/{src,assets}` | Folder `src` dan `assets` muncul satu per satu | Buat folder sesuai tujuan. |
| Buat file teks | `touch README.md` | Dokumen kosong muncul | `touch` membuat file kosong. |
| Copy aset | `cp ~/Downloads/screenshot-draft.png assets/` | Thumbnail berpindah tetapi asal masih ada | `cp` menggandakan. |
| Pindah atau rename | `mv ~/Documents/brief.txt README.md` | File asal hilang, nama baru ada di project | `mv` memindahkan atau mengganti nama. |
| Hapus contoh aman | `rm -i old-draft.txt` → `rm: remove? y` | File draft menjadi redup lalu masuk trash/terhapus | Gunakan konfirmasi untuk target yang sudah dicek. |
| Baca teks | `cat README.md` / `less README.md` | Preview teks terbuka di panel GUI | Baca sebelum mengubah. |
| Edit teks | `nano README.md` | Editor mini mengubah satu baris | Editor menyimpan isi file. |
| Pasang tool | `sudo apt install ripgrep` | Paket `ripgrep` masuk ke tool shelf | Contoh khusus Debian/Ubuntu; distro lain berbeda. |
| Jalankan langkah berurutan | `mkdir demo && cd demo && touch notes.txt` | Benang command berhenti bila satu langkah gagal | `&&` lanjut hanya bila sebelumnya sukses. |
| Pisahkan langkah tanpa syarat | `pwd; ls` | Dua output tetap muncul berurutan | `;` tidak menunggu keberhasilan sebelumnya. |

## Struktur empat Act

Empat Act mempertahankan ritme seri. Dalam setiap Act, terminal tetap menjadi
anchor utama dan GUI di samping/bawahnya hanya menunjukkan dampak command yang
sedang aktif.

| Act | Cerita dan command | Ketikan terminal | GUI/file manager | Payoff |
|---|---|---|---|---|
| 1 — Kenali posisi dan rute | Rani mencari starter file: cek lokasi, lihat isi, masuk Downloads, kembali ke Home, masuk Projects. | `pwd`, `ls`, `cd Downloads`, `cd ..`, `cd Projects` | Breadcrumb/tree dan folder marker bergerak tanpa teleport. | Audiens memahami lokasi aktif serta `..`. |
| 2 — Susun workspace | Rani membuat project, folder source/aset, file README, lalu melihat item tersembunyi. | `mkdir -p`, `touch`, `ls -la` | Folder/file baru pop-in; `.gitignore` tampak sebagai hidden file. | Terminal membuat struktur yang sama seperti GUI. |
| 3 — Kelola dan edit dengan aman | Rani copy screenshot, memindahkan brief menjadi README, membaca, mengedit, lalu menghapus draft dengan konfirmasi. | `cp`, `mv`, `cat`/`less`, `nano`, `rm -i` | Dua lokasi file diperlihatkan sebelum/after; editor dan dialog `y` menjelaskan efek. | Copy berbeda dari move/rename; hapus selalu target spesifik. |
| 4 — Siapkan dan jalankan workflow | Rani memasang `ripgrep` (contoh Ubuntu/Debian), lalu memakai `&&` untuk membuat demo dan `;` untuk dua inspeksi. | `sudo apt install ripgrep`, `mkdir demo && cd demo && touch notes.txt`, `pwd; ls` | Tool shelf mendapat ripgrep; flow command memiliki node sukses/fail dan output terminal. | Terminal dapat merangkai kerja, tetapi setiap command tetap punya efek sendiri. |

## Desain terminal dan ketikan

Terminal perlu mendukung lebih banyak command tanpa berubah menjadi dump teks.

1. **History window bergulir.** Hanya 4–5 line terbaru yang terang; line lama
   mengecil/redup di atas. Ini menunjukkan sesi berkelanjutan tanpa memenuhi
   layar.
2. **Typing berkelompok.** Ketik token penting (`cd`, path, `&&`, `rm -i`)
   bertahap, tetapi jangan mengetik setiap karakter untuk semua command panjang.
3. **Prompt selalu hidup.** Prompt berubah saat `cd`; setelah command selesai,
   prompt baru muncul sebelum command berikutnya dimulai.
4. **Output ringkas tetapi nyata.** Tampilkan hanya nama file/konfirmasi yang
   sedang diajarkan, bukan log package manager panjang.
5. **Mode command jelas.** Perintah yang mengubah file memakai aksen amber;
   inspeksi memakai cyan; keberhasilan memakai hijau; penghapusan konfirmasi
   memakai merah lembut, bukan alarm penuh.

Contoh line terminal yang direncanakan:

```bash
rani@linux:~$ cd Downloads
rani@linux:~/Downloads$ cd ..
rani@linux:~$ mkdir -p Projects/landing-page/{src,assets}
rani@linux:~/Projects$ cd landing-page
rani@linux:~/Projects/landing-page$ cp ~/Downloads/screenshot-draft.png assets/
rani@linux:~/Projects/landing-page$ mv ~/Documents/brief.txt README.md
rani@linux:~/Projects/landing-page$ nano README.md
```

## Layout dan anti-overlay

| Area `ContentBodyV1` | Isi | Aturan |
|---|---|---|
| 35–105 | Caption slot | Satu caption pendek, tidak berada di atas terminal output. |
| 130–470 | Terminal persistent | History scroll; maksimum lima line fokus. |
| 500–735 | File manager/tree | Hanya before/after dari command aktif, bukan semua folder sekaligus. |
| 755–835 | Impact card | Copy/move/rename/delete/editor/package/chain visualization. |
| 855–925 | Takeaway | Hanya muncul setelah impact card memudar. |

Aturan collision:

- GUI tidak menutup output terminal yang sedang diketik;
- card before/after memakai dua kolom untuk `cp` dan `mv`, bukan stack yang
  saling menutup;
- `rm -i` hanya menampilkan satu dialog konfirmasi, lalu hilang sebelum editor;
- `nano` editor menggantikan impact card sebelumnya, bukan muncul di atasnya;
- package shelf dan flow `&&` memakai Act 4 secara berurutan, bukan bersamaan;
- command chain digambar sebagai node horizontal pendek agar `&&` dan `;`
  terbaca, bukan sebagai teks tambahan yang bertumpuk.

## Flow chart command berantai

```text
mkdir demo  ── sukses ──&&──►  cd demo  ── sukses ──&&──► touch notes.txt
     │                           │                             │
     └──── bila gagal: chain berhenti, command setelahnya tidak jalan ─────┘

pwd  ── ; ──►  ls
 │             │
 └─ output 1   └─ output 2
    (selalu lanjut ke command berikutnya)
```

Catatan penting: diagram tidak menyatakan `;` “aman” atau “buruk”; ia hanya
memisahkan dua command dan tidak menjadikan command kedua bergantung pada
status sukses command pertama. Contoh `&&` memakai file/folder dummy agar
tidak mengajarkan rangkaian yang destruktif.

## Guardrail konsep

1. `cd` adalah navigation; `cp`, `mv`, `rm`, `mkdir`, dan `touch` adalah file
   operations. Labelkan perbedaannya meski semuanya berada dalam satu workflow.
2. `mv` dipakai untuk move dan rename; GUI harus menampilkan asal/tujuan agar
   audiens tidak mengira ia membuat salinan.
3. `rm -i` dipilih untuk contoh karena meminta konfirmasi. Jangan menampilkan
   `rm -rf`, wildcard, atau target folder luas.
4. `nano` hanyalah contoh editor terminal; gunakan copy “editor terminal” agar
   tidak mengklaim semua Linux memakai nano.
5. `sudo apt install ripgrep` diberi badge “Debian/Ubuntu example”. Fedora,
   Arch, dan distro lain memakai package manager berbeda; contoh tidak boleh
   digambarkan universal.
6. Perintah install tidak dijalankan dalam cerita. Video hanya menunjukkan
   hasil konseptual: package manager memasang tool ke sistem.
7. Jangan menggabungkan `&&` dan `;` pada satu command nyata panjang; dua
   diagram pendek lebih jelas dan aman untuk pemula.

## Asset dan audio rencana

Tetap inline SVG: terminal, tree/file manager, preview file, editor mini,
dialog konfirmasi, package shelf, dan node chain. Tidak membutuhkan logo
package manager atau screenshot terminal asli.

| Beat | Cue kandidat | Fungsi |
|---|---|---|
| Prompt berpindah | `light-swoosh-quick` | Menandai `cd` dan breadcrumb berubah. |
| Folder/file baru | `pop` / `pop-2` | Struktur project muncul. |
| Copy | `paper-arrive` | Salinan muncul sambil file asal tetap ada. |
| Move/rename | `connector-snap` | Asal lepas, target berubah nama. |
| Konfirmasi delete | `soft-deny` lembut | Mengingatkan tindakan perlu cek. |
| Simpan editor | `tick` + `ding` | Satu perubahan teks tersimpan. |
| Package selesai | `shimmer` | Tool muncul pada shelf. |
| Chain sukses | `tick` per node, maksimal dua foreground/0,35 dtk | Membuat ketergantungan command terbaca. |

## File yang akan berubah bila dieksekusi

Plan ini sendiri hanya menambah dokumen. Bila kelak dieksekusi, perkiraan file:

- `src/content/26-terminal-navigation/data.js` — command sample, state,
  labels, color semantics, PHASES, captions, dan SFX map;
- `src/content/26-terminal-navigation/Animation.jsx` — typed terminal
  history, GUI before/after, editor, package shelf, command-chain flow, dan
  reset loop;
- `src/content/26-terminal-navigation/caption.md` — ringkasan workflow;
- `scripts/export-lib.js` — timing SFX bila durasi final berubah;
- `src/content/26-terminal-navigation/_docs/TERMINAL_NAVIGATION_PLAN.md` —
  sinkronisasi plan setelah preview.

## Checklist penerimaan eksekusi

- [ ] Satu cerita Rani/landing-page menghubungkan semua command, bukan daftar
      perintah yang tidak terkait.
- [ ] `pwd`, `ls`, `cd`, `cd ..`, dan `cd ~` memiliki perubahan prompt/tree
      yang terlihat.
- [ ] `mkdir`, `touch`, `cp`, `mv`, rename, `cat`/`less`, dan `nano` memiliki
      padanan GUI before/after yang tepat.
- [ ] Penghapusan hanya memakai contoh `rm -i` pada file dummy dan memperlihatkan
      konfirmasi.
- [ ] `apt` diberi konteks Debian/Ubuntu dan tidak digambarkan sebagai perintah
      universal atau dijalankan sungguhan.
- [ ] `&&` dan `;` dijelaskan melalui flow chart serta output, tanpa ambiguity.
- [ ] Tidak ada overlay antara terminal, caption, GUI impact, maupun takeaway.
- [ ] Preview mencakup setiap Act, transisi Act 3→4, dan dua loop penuh.
