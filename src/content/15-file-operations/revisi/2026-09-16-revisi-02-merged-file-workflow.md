# Revisi-02 — 27 Terminal File Workflow: GUI di Atas, Terminal di Bawah

| Item | Nilai |
|---|---|
| Content | 27 — File Operations (gabungan rencana 28 Reading Files dan 29 Find Files) |
| Status | 📝 PLAN ONLY — tidak ada implementasi animasi |
| Tujuan | Menunjukkan command terminal dan perubahan file manager pada file yang sama. |

## Keputusan pengalaman utama

File manager selalu berada **di atas**. Terminal ada **di bawah** dan ringkas:
prompt aktif, command yang diketik, serta maksimal dua output terakhir.
Terminal hanya melebar sementara untuk `less`, `tail -f`, atau hasil `find`,
lalu kembali pendek pada beat berikutnya.

Setelah Enter, gunakan urutan berikut:

1. command masuk ke history terminal;
2. bila command mengubah file, **benang command** bergerak dari terminal bawah
   menuju objek target di file manager atas;
3. GUI memperbarui before → after saat benang tiba;
4. output singkat kembali ke terminal.

Ini lebih jelas daripada GUI langsung berubah tanpa sebab, tetapi tidak perlu
mengirim seluruh teks command ke atas. Command inspeksi seperti `pwd` dan `ls`
langsung menyorot lokasi/isi GUI tanpa benang perpindahan.

## Cerita utama

Rani menyiapkan `~/Projects/website-demo`: membuat struktur, menyalin banner,
memindahkan brief menjadi README, membaca file, menemukan aset yang lupa lokasi,
dan menghapus satu draft dummy dengan konfirmasi.

```text
Downloads/banner-draft.png  ── cp ──►  website-demo/assets/banner.png
Documents/brief.txt         ── mv ──►  website-demo/README.md
old-draft.txt               ── rm -i ►  konfirmasi y ► hilang
```

## Kasus command dan dampak GUI

| Kebutuhan | Ketikan terminal | Dampak pada file manager |
|---|---|---|
| Buat struktur | `mkdir -p src assets` → `touch src/index.html` | Folder `src`, `assets`, dan file baru muncul. |
| Salin aset | `cp ~/Downloads/banner-draft.png assets/banner.png` | Sumber tetap di Downloads; salinan baru muncul di assets. |
| Pindah/rename | `mv ~/Documents/brief.txt README.md` | File asal hilang; objek sama muncul sebagai README. |
| Hapus aman | `rm -i old-draft.txt` → `y` | Hanya file dummy hilang setelah dialog konfirmasi. |
| File kecil | `cat README.md` | Preview README menyorot beberapa baris yang sama. |
| File panjang | `less CHANGELOG.md` | Terminal melebar sementara dengan scroll marker. |
| Awal/akhir file | `head config.ini`, `tail -f app.log` | Preview menyorot header atau baris log baru. |
| Cari scan langsung | `find . -name "banner.png"` | Scan dot mengikuti tree menuju `assets/banner.png`. |
| Cari lewat indeks | `locate banner.png` | Kartu katalog muncul: “indeks dapat tertinggal”. |

## Storyboard empat Act

| Act | Terminal bawah | File manager atas | Payoff |
|---|---|---|---|
| 1 — Buat dan salin | `mkdir`, `touch`, `cp` diketik bertahap. | Folder/file lahir; beam copy bercabang dari source ke target. | `cp` membuat salinan, bukan pindah. |
| 2 — Pindah dan hapus aman | `mv`, lalu `rm -i old-draft.txt`. | Before/after dua kolom; dialog hanya untuk file dummy. | `mv` mengubah lokasi/nama; hapus perlu cek target. |
| 3 — Baca isi yang tepat | `cat`, `less`, `head`, `tail -f`. | File aktif dan bagian teks yang sama disorot. | Pilih command baca sesuai bentuk file. |
| 4 — Temukan file | `find` lalu `locate`. | Find memindai tree; locate membuka katalog terpisah. | Find scan langsung, locate memakai indeks. |

## Benang command

```text
GUI FILE MANAGER (atas)
 [Downloads/banner-draft.png] ───────► [assets/banner.png]
          source tetap ada                 salinan baru
                 ▲
                 │ command beam setelah Enter
TERMINAL (bawah) └─ $ cp ~/Downloads/banner-draft.png assets/banner.png ↵
                    copied: banner.png
```

| Command | Motion setelah Enter |
|---|---|
| `mkdir`, `touch` | Benang naik ke folder tujuan, lalu objek pop-in. |
| `cp` | Benang bercabang: source tetap terang, target baru muncul. |
| `mv` | Satu kartu file bergerak; slot asal menjadi kosong. |
| `rm -i` | Benang berhenti di konfirmasi; target memudar hanya setelah `y`. |
| `cat`, `less`, `head`, `tail` | Garis fokus ke preview, tanpa memindahkan file. |
| `find` | Benang berubah menjadi scan dot di folder tree. |
| `locate` | Benang menuju kartu katalog, bukan tree. |

## Layout dan anti-overlay

| Area local `ContentBodyV1` | Isi | Aturan |
|---|---|---|
| 30–95 | Caption | Satu caption; fade sebelum beam melintasi slotnya. |
| 115–505 | GUI file manager | Tree/breadcrumb kiri, preview atau before/after kanan. |
| 525–675 | Lane benang | Hanya motion aktif atau result card. |
| 705–825 | Terminal | Default 105–130 px; maksimum 245 px untuk output panjang. |
| 850–925 | Takeaway | Tampil setelah panel panjang diringkas. |

- GUI tidak berubah sebelum Enter dan benang mencapai target.
- Terminal tidak pernah menutup GUI.
- Result `find` dan katalog `locate` tidak tampil penuh bersamaan.
- Caption di-anchor ke GUI untuk file operation dan dekat terminal untuk baca/cari.

## Guardrail konsep dan keamanan

1. Contoh hapus wajib `rm -i old-draft.txt`; jangan tampilkan `rm -r`,
   `rm -rf`, wildcard, atau target folder luas.
2. `cp` menghasilkan dua objek; `mv` memindahkan objek yang sama dan bisa
   mengganti namanya.
3. `cat` untuk singkat, `less` untuk membaca bertahap, `head` untuk awal,
   `tail`/`tail -f` untuk akhir atau log baru.
4. `find` menelusuri lokasi nyata; `locate` memakai indeks dan mungkin tidak
   tersedia/terbaru pada semua distro.
5. Content 30 tetap khusus untuk mencari **isi teks** memakai `grep`.

## Copy in-video

| Beat | Copy |
|---|---|
| Enter | `Enter menjalankan command` |
| Copy | `Copy membuat file kedua` |
| Move | `mv memindah atau rename` |
| Delete | `Cek target sebelum rm` |
| Read | `less membaca bertahap` |
| Search | `find scan folder langsung` |
| Catalog | `locate membaca indeks` |
| Closing | `Terminal dan GUI, file sama` |

## File yang berubah saat eksekusi nanti

- `src/content/27-file-operations/data.js` — state command/file, layout,
  command samples, caption, dan SFX.
- `src/content/27-file-operations/Animation.jsx` — terminal history ringkas,
  file manager, command beam, preview file, find scan, dan locate catalog.
- `src/content/27-file-operations/manifest.js` dan `caption.md` — metadata
  serta ringkasan workflow gabungan.
- `scripts/export-lib.js` — hanya setelah durasi final disepakati.

## Checklist penerimaan

- [ ] File manager selalu di atas; terminal ringkas di bawah.
- [ ] Enter menambah history dan menjelaskan perubahan GUI lewat benang.
- [ ] `mkdir`, `touch`, `cp`, `mv`, `rm -i`, command baca, `find`, dan
      `locate` memiliki visual before/after atau visualisasi yang benar.
- [ ] Tidak ada overlay antara caption, beam, GUI, terminal, output panjang,
      result card, dan takeaway.
- [ ] Semua state reset dengan benar saat loop kedua.
