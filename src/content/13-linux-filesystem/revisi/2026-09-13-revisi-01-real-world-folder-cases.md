# Revisi-01 — Linux Filesystem: Studi Kasus Folder Nyata

| Item | Nilai |
|---|---|
| Content | 25 — Linux Filesystem |
| Tanggal | 2026-09-13 |
| Status | 📝 PLAN ONLY — belum ada perubahan implementasi |
| Fokus | Memperjelas kegunaan home, etc, var, tmp, dan path lewat satu studi kasus yang utuh |
| Acuan | docs/standardizations/03-planning-storytelling-quality-gate.md, docs/standardizations/05-svg-layout-asset-pipeline.md, dan docs/standardizations/06-audio-sfx.md |

## Temuan

Versi saat ini sudah mengenalkan slash, home, etc, var, tmp, dan path,
tetapi masih dominan berupa label fungsi. Audiens pemula dapat mengingat
nama folder tanpa mendapat gambaran kapan folder itu benar-benar ditemui
di desktop atau terminal.

Contoh yang perlu dibuat lebih konkret:

- home perlu menunjukkan file pribadi yang muncul dari aktivitas sehari-hari;
- etc perlu menunjukkan contoh pengaturan sistem, bukan sekadar “aturan”;
- var perlu menunjukkan log atau cache yang bertambah saat aplikasi bekerja;
- tmp perlu menunjukkan file kerja singkat yang tidak dirancang sebagai
  tempat penyimpanan penting;
- path perlu menyatukan semua contoh menjadi alamat yang dapat dibaca di
  terminal dan dikenali di file manager.

## Target hasil revisi

Setelah revisi, audiens bukan hanya dapat menyebut nama folder, tetapi juga
dapat membayangkan alur berikut:

1. Sebuah dokumen pribadi dibuat atau disimpan melalui file manager.
2. Dokumen itu berada di home user dan dapat ditunjuk melalui terminal.
3. Pengaturan sistem berada di etc dan dibedakan dari dokumen pribadi.
4. Ketika aplikasi bekerja, catatan/log dan cache dapat berubah di var.
5. File kerja singkat dapat muncul di tmp, tetapi bukan lokasi untuk
   menyimpan dokumen penting.
6. Semua lokasi dapat dibaca sebagai path dari slash.

## Studi kasus utama

Gunakan satu cerita ringan yang konsisten: sebuah aplikasi catatan menyimpan
file \`belanja.txt\` milik user \`adib\`.

| Lokasi | Contoh visual GUI | Contoh terminal | Pesan yang harus dipahami |
|---|---|---|---|
| \`/home/adib/Documents/belanja.txt\` | File manager membuka Documents dan memperlihatkan belanja.txt. | \`pwd\` lalu \`ls Documents\`. | Home adalah ruang file pribadi user. |
| \`/etc\` | Panel “aturan sistem” dengan kartu contoh jaringan/layanan, bukan file pribadi. | \`ls /etc\` sebagai tampilan contoh saja. | Etc menyimpan konfigurasi tingkat sistem. |
| \`/var/log\` dan \`/var/cache\` | Aplikasi berjalan menambah baris log dan menyimpan cache kecil. | \`ls /var/log\` atau \`tail\` hanya sebagai contoh output ringkas. | Var menyimpan data yang berubah saat sistem/aplikasi bekerja. |
| \`/tmp\` | Draft export sementara muncul dengan jam pasir lalu dibersihkan. | \`ls /tmp\` sebagai contoh. | Tmp untuk kerja sementara; jangan taruh file penting di sini. |

Nama file, user, dan isi contoh bersifat generik. Tidak perlu menunjukkan
konfigurasi asli perangkat, log privat, maupun path rumah pengguna nyata.

## Storyboard revisi — tetap empat Act

Standar membatasi alur utama pada maksimum empat Act. Revisi tidak menambah
Act; setiap Act dibuat lebih padat dengan sebab-akibat nyata.

| Act | Cerita revisi | Visual + terminal | Payoff untuk audiens |
|---|---|---|---|
| 1 — Dari GUI ke home | User menyimpan belanja.txt melalui file manager → kartu file masuk ke Documents → terminal membuka path yang sama. | File manager mini, folder home/adib/Documents, command strip pwd dan ls Documents. | File pribadi biasanya hidup di home user, bukan di slash atau etc. |
| 2 — Etc bukan folder pribadi | User mencoba membandingkan Documents dengan etc → etc digambarkan sebagai kabinet konfigurasi sistem → perubahan sistem membutuhkan batas akses admin. | Dua panel berdampingan: Documents biru dan etc ungu; etc memuat kartu network/service config generik serta gate admin redup. | Etc berisi pengaturan sistem; bukan tempat menyimpan dokumen pribadi. |
| 3 — Var dan tmp saat aplikasi bekerja | Aplikasi catatan dibuka → var/log menerima catatan aktivitas dan var/cache menerima cache → sebuah draft export singgah di tmp lalu dibersihkan. | Packet dari app menuju rak var/log dan var/cache; kartu tmp dengan jam pasir memudar. | Var berubah seiring aktivitas; tmp hanya tempat sementara. |
| 4 — Semua menjadi alamat | File belanja.txt, etc, var, dan tmp muncul sebagai cabang dari slash → breadcrumb menyorot path dokumen user → terminal dan file manager menunjuk lokasi yang sama. | Pohon filesystem lengkap, breadcrumb slash → home → adib → Documents → belanja.txt, plus path cards kecil untuk etc/var/tmp. | Path adalah alamat yang menyatukan tampilan GUI dan terminal. |

## Batas konsep yang harus dijaga

| Klaim yang diizinkan | Hindari klaim ini |
|---|---|
| Home biasanya menjadi lokasi file pribadi tiap user. | Semua file aplikasi selalu berada di home. |
| Etc berisi konfigurasi sistem secara umum. | Semua file di etc aman atau boleh diubah. |
| Var menyimpan data yang berubah, termasuk log/cache pada banyak sistem. | Semua aplikasi pasti menulis ke path var yang sama. |
| Tmp dipakai untuk data sementara dan dapat dibersihkan sesuai kebijakan sistem. | Tmp selalu kosong setelah reboot atau semua file tmp pasti segera hilang. |
| Path absolut dimulai dari slash. | Semua path yang terlihat di GUI harus diketik persis sama di setiap distro. |

Tambahkan safety copy singkat di Act 2 dan Act 3:

- “Config sistem perlu izin admin.”
- “Simpan file penting di home.”

Keduanya harus diperlakukan sebagai caption dekat objek, bukan caption bar
global, dan tidak boleh muncul sebelum context visualnya tersedia.

## Kontrak state dan continuity

| State | Visible | Pemicu | Continuity yang wajib |
|---|---|---|---|
| File pribadi | belanja.txt di file manager dan Documents | Act 1 mulai | File yang sama tetap menjadi target sampai Act 4. |
| System config | kabinet etc dan gate admin | Act 2 | Tidak mengubah belanja.txt atau user home. |
| Runtime data | log/cache bertambah dari aplikasi | Act 3 | Packet aplikasi terlihat bergerak menuju var sebelum data muncul. |
| Temporary data | draft export sementara di tmp | Act 3 | Kartu tmp memudar setelah terlihat sebagai file singgah. |
| Address resolved | full path belanja.txt | Act 4 | Path disusun dari cabang yang sudah diperkenalkan sebelumnya. |

Tidak boleh ada data log/cache muncul sebelum aplikasi melakukan aktivitas.
Tidak boleh ada file tmp menghilang tanpa terlebih dahulu muncul sebagai
objek sementara. File belanja.txt adalah persistent anchor, bukan file baru
yang dipop-in ulang setiap Act.

## Layout revisi V1

Seluruh visual topic-specific tetap berada di ContentBodyV1 local coordinate.

| Area lokal | Rentang y | Isi |
|---|---:|---|
| Narration bubble | 35–115 | Satu caption pendek per beat |
| GUI/terminal context | 145–340 | File manager mini dan terminal strip |
| Folder/function scene | 380–655 | Home, etc, var, atau tmp sesuai Act |
| Runtime/path lane | 690–800 | Packet aplikasi, breadcrumb, atau path card |
| Takeaway | 850–930 | Ringkasan act/closing |

Aturan tambahan:

- Terminal dan file manager boleh terlihat bersama hanya di Act 1 dan 4;
  keduanya tidak boleh menutupi folder card.
- Pada Act 2, kartu home dan etc disusun horizontal setelah menghitung
  setengah-lebar dan gap minimum.
- Pada Act 3, var/log, var/cache, dan tmp disusun tiga lane vertikal
  dengan label pendek agar tidak menjadi daftar teks.
- Semua panel tetap di bawah navigator V1; tidak ada local y negatif.

## Rencana audio yang lebih hidup

Tambahkan variasi cue hanya setelah audit asset existing dan loudness:

| Beat | Candidate cue | Fungsi |
|---|---|---|
| File manager menyimpan belanja.txt | ui/paper-arrive | Membuat contoh home terasa nyata |
| Terminal menampilkan pwd / ls | ui/tick atau sfx/typing | Penanda terminal, tidak setiap karakter |
| Gate config etc terlihat | impacts/lock | Menegaskan batas perubahan sistem |
| Log bertambah di var/log | ui/beep-2 atau ui/tick | Ritme aktivitas, maksimal dua cue foreground dalam 0,35 detik |
| Cache masuk ke var/cache | ui/pop | Beda karakter dari log |
| Draft tmp dibersihkan | warnings/soft-deny | Pengingat lembut bahwa ini sementara |
| Path belanja.txt lengkap | transitions/light-swoosh-quick lalu success/ding | Payoff alamat file |

Semua cue yang benar-benar dipakai harus diperbarui pada SFX_MAP dan
scripts/export-lib.js dengan kategori eksplisit dan waktu yang identik.

## File yang direncanakan berubah saat eksekusi

| File | Perubahan yang direncanakan |
|---|---|
| src/content/25-linux-filesystem/data.js | Menambah labels, caption singkat, state/sample path, serta SFX_MAP yang diperlukan studi kasus. |
| src/content/25-linux-filesystem/Animation.jsx | Mengganti visual label statis dengan alur GUI → terminal → system/runtime data → path; menjaga header V1 dan anchor file tetap persisten. |
| src/content/25-linux-filesystem/_docs/LINUX_FILESYSTEM_PLAN.md | Memperbarui storyboard, state contract, layout, audio beat map, dan status checklist setelah eksekusi. |
| src/content/25-linux-filesystem/caption.md | Menyelaraskan hook/ringkasan sosial media dengan studi kasus belanja.txt. |
| scripts/export-lib.js | Memperbarui schedule SFX hanya setelah timeline final disepakati. |
| src/content/25-linux-filesystem/revisi/README.md | Mengubah status revisi setelah implementasi dan QA. |

## Checklist penerimaan

- [ ] Act 1 memperlihatkan satu file pribadi melalui file manager dan terminal.
- [ ] Audiens dapat melihat \`/home/adib/Documents/belanja.txt\` sebagai contoh path pribadi.
- [ ] Act 2 membedakan home dengan etc melalui fungsi dan contoh nyata, bukan warna saja.
- [ ] Act 2 menyatakan config sistem perlu izin admin tanpa mengajarkan perubahan command.
- [ ] Act 3 memperlihatkan sebab aplikasi bekerja → log/cache var bertambah.
- [ ] Act 3 memperlihatkan tmp sebagai tempat singgah dan memberi pesan aman untuk file penting.
- [ ] Act 4 menyusun path dari slash hingga file target tanpa teleport.
- [ ] File belanja.txt, terminal, dan pohon filesystem mengikuti continuity map.
- [ ] Header, badge, dan body tetap mengikuti Scene UI V1 serta safe zone.
- [ ] Teks in-video singkat, deklaratif, tanpa emoji dan tanpa kata ganti orang.
- [ ] SFX baru/existing lolos audit kategori, loudness, coverage, dan schedule export.
- [ ] Preview manual mencakup intro, setiap Act, transisi Act, serta loop kedua.

## Batas revisi

Revisi ini tidak memperluas materi ke permission angka, chmod, sudo,
package manager, mount, atau struktur Linux lengkap seperti usr, bin, dan
opt. Tujuannya hanya memberi gambaran praktis yang kuat untuk slash, home,
etc, var, tmp, dan path sebelum seri melanjutkan ke navigasi terminal.
