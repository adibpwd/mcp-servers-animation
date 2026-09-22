# Linux Filesystem — Rumah Semua File

**Status:** ✅ REVISI-02 IMPLEMENTED — build produksi lulus; preview lokal menunggu izin port.
**Terakhir diperbarui:** 2026-09-13
**Scene shell:** scene-ui V1
**Audience promise:** Penonton memahami bahwa Linux memiliki satu pohon folder yang dimulai dari slash, serta kapan home, etc, usr, var, dan tmp ditemui lewat workspace developer yang nyata.

## Revisi aktif

Mengikuti `revisi/2026-09-13-revisi-02-developer-workspace-cases.md`.
Revisi-02 memperluas contoh sebelumnya menjadi workspace developer dengan
daftar isi folder serta path navigasi yang nyata.

## Identitas seri

| Field | Keputusan |
|---|---|
| Kategori | Linux Fundamentals |
| Referensi shell | Scene UI V1, hero menjadi compact header yang tetap tampil |
| Title A | LINUX — cyan |
| Title B | FILESYSTEM — emerald |
| Palette cerita | cyan untuk root/system, blue untuk home, purple untuk config, orange untuk data yang berubah, amber untuk file sementara |

## Studi kasus utama

Satu cerita konsisten: developer `adib` mengerjakan aplikasi
`~/Projects/inventory-api`. Repository (`src`, `tests`, `package.json`, dan
`README.md`) menjadi anchor Act 1, menghasilkan data runtime di Act 3, dan
path `src/server.js` menjadi payoff Act 4.

## Storyboard empat Act (revisi-02)

| Act | Cerita | Visual utama | Payoff |
|---|---|---|---|
| 1 — Workspace di home | File manager dan `ls ~` memperlihatkan Projects, Downloads, Documents, Videos, `.config`, dan `.ssh`; terminal masuk ke repository. | File manager mini, terminal, kartu `inventory-api` berisi `src`, `tests`, `package.json`, `README.md`. | Home adalah ruang kerja dan data pribadi user. |
| 2 — Config & aplikasi sistem | Terminal menunjukkan isi `/etc` dan lokasi binari `/usr/bin`. | Daftar nginx, ssh, docker, systemd, hosts; daftar `/usr`, `/opt`, dan gate admin. | `/etc` menyimpan config; `/usr`/`/opt` menyimpan program dan resource. |
| 3 — Data saat app berjalan | `inventory-api` menerima request sehingga log/cache bertambah; build Vite muncul di tmp lalu dibersihkan. | Kartu `/var/log`, `/var/cache`, `/tmp` dengan isi realistis. | Var berubah seiring aktivitas; tmp hanya tempat sementara. |
| 4 — Navigasi dengan path | Lima alamat dari folder yang telah dilihat dirangkai. | Path kode, config nginx, program node, log request, dan build sementara. | Path menjelaskan lokasi dan kegunaan setiap item. |

## Validasi analogi

Linux filesystem bukan bangunan fisik secara harfiah. Studi kasus GUI dan
terminal dipakai supaya audiens melihat KAPAN tiap folder benar-benar
ditemui, bukan sekadar label fungsi. Semua label teknis asli (`/home`,
`/etc`, `/var`, `/tmp`, path absolut) tetap ditampilkan agar studi kasus
tidak menggantikan konsep aslinya.

## Batas konsep yang dijaga

- Home biasanya menjadi lokasi file pribadi tiap user (bukan: semua file
  aplikasi selalu di home).
- Etc berisi konfigurasi sistem secara umum (bukan: semua file di etc aman
  atau boleh diubah).
- Var menyimpan data yang berubah, termasuk log/cache pada banyak sistem
  (bukan: semua aplikasi pasti menulis ke path var yang sama).
- Tmp dipakai untuk data sementara dan dapat dibersihkan sesuai kebijakan
  sistem (bukan: tmp selalu kosong setelah reboot).
- Path absolut dimulai dari slash.

Safety copy singkat ditampilkan dekat objek (bukan caption bar global):
"Config sistem perlu izin admin." (Act 2) dan "Simpan file penting di
home." (Act 3, saat tmp dibersihkan).

## Layout V1 (revisi-01)

Mengikuti pembagian zona lokal dari revisi-01, di dalam `ContentBodyV1`:

| Area lokal | Rentang y | Isi |
|---|---:|---|
| Narration bubble | 35–115 | Satu caption pendek per beat, bentuk speech bubble |
| GUI/terminal context | 145–340 | File manager mini dan terminal strip (bersama hanya di Act 1 dan 4) |
| Folder/function scene | 380–655 | Pohon root/home/etc/var/tmp, persistent anchor sejak Act 1 |
| Runtime/path lane | 690–800 | Log/cache/tmp (Act 3) atau breadcrumb path (Act 4) |
| Takeaway | 850–930 | Ringkasan closing |

Tidak ada local y negatif. Root dan seluruh cabang folder dirender sebagai
anchor persisten (tidak di-unmount per Act) agar tidak pop-in ulang.

## Asset matrix

Semua objek dibuat dengan inline SVG (file manager mini, terminal strip,
pohon folder, app window, indikator log/cache, kartu draft tmp, breadcrumb
path). Tidak ada PNG yang perlu digenerate — setiap elemen punya state
animasi internal (buka/tutup, progress, fade).

## Audio beat map (revisi-01, sinkron dengan `scripts/export-lib.js`)

| Beat | Cue |
|---|---|
| Header selesai morph | success/shimmer |
| Root muncul, cabang tersambung | ui/pop, impacts/connector-snap |
| Folder home/etc/var/tmp muncul | ui/pop-2, ui/pop (bergantian) |
| File manager + belanja.txt muncul | ui/pop, ui/paper-arrive |
| Terminal pwd / ls Documents | ui/pop-2, ui/tick |
| Terminal ls /etc | ui/tick |
| Gate admin etc muncul | impacts/lock |
| Perbandingan home vs etc | ui/beep-2 |
| App window aktif, log/cache bertambah | ui/pop-2, ui/beep-2 |
| Draft tmp muncul lalu dibersihkan | ui/paper-arrive, warnings/soft-deny |
| File manager + terminal muncul lagi (Act 4) | ui/pop |
| Path selesai menuju file | transitions/light-swoosh-quick, success/ding |
| Takeaway | success/ding |

## Checklist eksekusi

- [x] Pre-planning: identitas, audience promise, storyboard, layout, asset, dan audio beat map (versi awal).
- [x] Buat data.js, manifest.js, caption.md, dan struktur icons (versi awal).
- [x] Buat Animation.jsx dengan timeline empat Act dan reset loop lengkap (versi awal).
- [x] Daftarkan manifest di registry.
- [x] Tambahkan jadwal SFX export yang sinkron (versi awal).
- [x] Static audit dan compile terisolasi Animation.jsx (versi awal).
- [x] Revisi-01: baca plan revisi dan tiga standar acuan sebelum eksekusi.
- [x] Revisi-01: perbarui `data.js` (LABELS, TERMINAL, CAPTIONS, SFX_MAP) untuk studi kasus belanja.txt.
- [x] Revisi-01: tulis ulang `Animation.jsx` — Act 1 GUI→home, Act 2 etc/admin gate, Act 3 var/tmp aplikasi, Act 4 breadcrumb path.
- [x] Revisi-01: sinkronkan `scripts/export-lib.js` SFX_SCHEDULES dengan timing baru.
- [x] Revisi-01: perbarui `caption.md` mengikuti studi kasus belanja.txt.
- [x] Revisi-01: static audit ulang (esbuild) untuk `Animation.jsx` dan `data.js` — lolos tanpa error.
- [ ] Build project penuh, preview manual dev server (dengar full durasi, cek 3+ loop), dan export MP4 test. Belum dijalankan pada sesi ini — perlu dev server aktif (`npm run dev`) dan verifikasi visual manusia sebelum commit.
- [ ] Verifikasi checklist penerimaan lengkap di `revisi/2026-09-13-revisi-01-real-world-folder-cases.md` (Act per Act) setelah preview manual.
- [ ] Update `revisi/README.md` status ke Implemented setelah preview manual dan checklist penerimaan lolos.
