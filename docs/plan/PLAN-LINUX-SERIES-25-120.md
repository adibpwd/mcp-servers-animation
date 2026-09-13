# PLAN — Seri Belajar Linux: Content 25–120

**Status:** 💡 ROADMAP / kandidat content, belum ada content yang dieksekusi.  
**Target audiens:** orang awam, pelajar, anak muda, dan junior developer.  
**Prinsip:** mulai dari hal yang langsung dipakai, naik bertahap ke server; setiap content harus memakai cerita/analogi dan satu manfaat praktis yang mudah dibawa pulang.

## Urutan paling kuat untuk mulai

Urutan ini paling ramah untuk membangun mental model tanpa membuat pemula kewalahan:

**25 → 26 → 27 → 28 → 29 → 30 → 34 → 37 → 38 → 44 → 48 → 51 → 60 → 65 → 67 → 81 → 84 → 91**

| Tahap | Content | Alasan |
|---|---|---|
| 1. Kenal tempat kerja | 25–30 | Penonton mengenali struktur file dan nyaman memakai terminal sebelum belajar command yang lebih berisiko. |
| 2. Memasang software dan akses | 34, 37–38 | Menjelaskan cara aplikasi masuk ke sistem serta batas user, group, dan admin. |
| 3. Akses jarak jauh dan shell | 44, 48, 51 | Memberi fondasi untuk memakai server dan memahami aliran data terminal. |
| 4. Sistem yang sedang bekerja | 60, 65, 67 | Memperkenalkan process, service, dan log sebagai dasar troubleshooting. |
| 5. Koneksi jaringan | 81, 84 | Menjelaskan jalan aplikasi menuju jaringan dan makna port. |
| 6. Tujuan nyata | 91 | Menutup jalur awal dengan gambaran Linux server dan alasan semua fondasi tadi berguna. |

## A. Fondasi penggunaan Linux

| No. | Judul | Deskripsi singkat |
|---|---|---|
| 25 | Linux Filesystem: Rumah Semua File | Mengenal slash, home, etc, var, tmp, dan alasan struktur Linux berbeda dari drive C. |
| 26 | Navigasi Terminal Tanpa Tersesat | Belajar pwd, ls, cd, path absolut, dan path relatif lewat cerita menjelajah gedung. |
| 27 | Membuat, Menyalin, Memindahkan, Menghapus File | Dasar touch, mkdir, cp, mv, dan rm, termasuk cara menghindari salah hapus. |
| 28 | Membaca Isi File dari Terminal | Kapan memakai cat, less, head, tail, dan cara melihat log berjalan. |
| 29 | Mencari File dengan Cepat | Memahami find, locate, serta pencarian nama atau jenis file. |
| 30 | Mencari Teks dengan grep | Mencari kata penting di file, source code, atau log tanpa membukanya satu per satu. |
| 31 | Wildcard: Memilih Banyak File Sekaligus | Arti bintang, tanda tanya, dan pola file seperti semua file log agar kerja terminal lebih cepat. |
| 32 | File Tersembunyi dan Konfigurasi | Mengapa file yang diawali titik tersembunyi, seperti bashrc dan env. |
| 33 | Archive vs Compression | Bedanya mengumpulkan file dengan tar dan mengecilkan ukuran dengan gzip atau zip. |
| 34 | Install Aplikasi di Linux | Cara kerja package manager dan alasan lebih aman memasang aplikasi dari repository. |
| 35 | apt, Repository, dan Update Sistem | Cerita perjalanan aplikasi dari repository sampai terpasang di komputer. |
| 36 | Aplikasi GUI vs CLI | Mengapa aplikasi Linux bisa dijalankan dari tampilan desktop maupun terminal. |

## B. User, izin, dan keamanan dasar

| No. | Judul | Deskripsi singkat |
|---|---|---|
| 37 | User, Group, dan Siapa Boleh Apa | Memahami akun pengguna, grup, dan pembagian akses dalam satu komputer atau server. |
| 38 | sudo: Kunci Master yang Dipinjamkan | Mengapa perintah admin perlu izin khusus dan kapan jangan asal memakai sudo. |
| 39 | Root User: Raja yang Tidak Perlu Dipakai Terus | Risiko login sebagai root dan kebiasaan aman untuk pengguna biasa. |
| 40 | Permission Linux dalam Kehidupan Nyata | Pendalaman read, write, execute sebagai aturan pintu rumah, lemari, dan ruang kerja. |
| 41 | chmod: Mengubah Izin File | Membaca angka 755 dan 644 serta mengatur izin tanpa membuat file terlalu terbuka. |
| 42 | chown: Siapa Pemilik File Ini? | Mengubah kepemilikan file dan alasan aplikasi server kadang tidak dapat membaca folder. |
| 43 | Password Linux dan Passphrase | Cara memilih passphrase yang aman, bukan password yang mudah ditebak. |
| 44 | SSH: Masuk ke Komputer Jauh dengan Aman | Gambaran login ke server dari terminal tanpa perlu duduk di depan mesin. |
| 45 | SSH Key: Kunci Digital Pengganti Password | Cara kerja pasangan public/private key dan alasan private key tidak boleh dibagikan. |
| 46 | Firewall Linux untuk Pemula | Konsep firewall sebagai penjaga gerbang: koneksi mana yang boleh masuk dan keluar. |
| 47 | Update Keamanan: Kenapa Tidak Boleh Ditunda | Menghubungkan update paket dengan perbaikan celah keamanan. |

## C. Shell dan produktivitas

| No. | Judul | Deskripsi singkat |
|---|---|---|
| 48 | Shell, Terminal, dan Command Line | Menjelaskan tiga istilah yang sering dianggap sama, tetapi punya fungsi berbeda. |
| 49 | Bash: Penerjemah Perintah Kita | Bagaimana Bash menerima, membaca, lalu menjalankan perintah. |
| 50 | Riwayat Perintah dan Tab Completion | Memakai panah atas, history, dan tombol Tab agar tidak mengetik berulang. |
| 51 | Redirect Output: Simpan Hasil Perintah | Mengenal redirect output, append output, dan input untuk mengarahkan data. |
| 52 | Pipe: Jalur Produksi Data | Lanjutan content pipeline: menyambungkan output satu perintah ke perintah lain. |
| 53 | Standard Input, Output, dan Error | Memahami tiga jalur data utama terminal dengan analogi loket kerja. |
| 54 | Exit Code: Tanda Berhasil atau Gagal | Mengapa angka nol berarti sukses dan bagaimana script membaca hasil perintah. |
| 55 | Alias: Membuat Perintah Panjang Jadi Singkat | Membuat shortcut aman untuk perintah yang sering digunakan. |
| 56 | Environment Variable di Linux | Melanjutkan content env variable: PATH, HOME, USER, dan konteks proses. |
| 57 | Script Bash Pertamaku | Membuat automasi sederhana: backup file, membuat folder, atau validasi input. |
| 58 | if, Loop, dan Function di Bash | Dasar logika script tanpa membuatnya terasa seperti pelajaran pemrograman berat. |
| 59 | Cron Job: Linux yang Bekerja Tepat Waktu | Menjadwalkan tugas berulang seperti backup dan pembersihan file sementara. |

## D. Proses, layanan, dan troubleshooting

| No. | Judul | Deskripsi singkat |
|---|---|---|
| 60 | Proses di Linux: Aplikasi yang Sedang Hidup | Melanjutkan process vs thread dengan fokus pada proses nyata di terminal. |
| 61 | ps, top, dan htop | Melihat aplikasi yang memakai CPU dan memori. |
| 62 | PID: Nomor Identitas Setiap Proses | Cara Linux membedakan ribuan proses yang berjalan bersamaan. |
| 63 | Kill Process dengan Aman | Kapan memakai kill, SIGTERM, dan kapan SIGKILL benar-benar diperlukan. |
| 64 | Foreground, Background, dan Job Control | Menjalankan tugas tanpa membuat terminal terkunci. |
| 65 | systemd: Manajer Layanan Linux | Cerita systemd sebagai koordinator yang menyalakan dan menjaga layanan. |
| 66 | systemctl untuk Pemula | Start, stop, restart, enable, dan status sebuah service. |
| 67 | Log Linux: Jejak Kejadian Sistem | Mengenal journalctl, log aplikasi, dan cara mencari penyebab error. |
| 68 | Disk Penuh: Apa yang Harus Dicek? | Alur troubleshooting memakai df, du, log, cache, dan file besar. |
| 69 | CPU atau RAM Penuh? | Cara membedakan bottleneck CPU, memory, disk, dan proses bermasalah. |
| 70 | OOM Killer: Saat Linux Kehabisan Memori | Apa yang terjadi ketika RAM habis dan mengapa aplikasi bisa tiba-tiba mati. |
| 71 | Booting Linux dari Tombol Power sampai Login | Urutan firmware, bootloader, kernel, service, hingga desktop atau login. |
| 72 | Recovery Mode dan Safe Troubleshooting | Langkah dasar ketika Linux gagal masuk desktop atau ada konfigurasi yang rusak. |

## E. Storage dan perangkat

| No. | Judul | Deskripsi singkat |
|---|---|---|
| 73 | Partisi Disk: Membagi Ruang Penyimpanan | Konsep partisi tanpa langsung mengajak pengguna mengubah disk mereka. |
| 74 | Filesystem: ext4, NTFS, FAT32, Apa Bedanya? | Mengapa format penyimpanan memengaruhi kompatibilitas dan fitur file. |
| 75 | Mount: Menghubungkan Disk ke Pohon File | Mengapa USB tidak muncul sebagai drive letter seperti di Windows. |
| 76 | UUID: Nama Permanen untuk Disk | Alasan Linux memakai identitas disk, bukan hanya nama device sementara. |
| 77 | USB, External Drive, dan Eject Aman | Cara kerja mount/unmount serta risiko mencabut drive terlalu cepat. |
| 78 | Swap: Memori Cadangan di Disk | Hubungan RAM, swap, dan performa ketika banyak aplikasi terbuka. |
| 79 | Backup 3-2-1 untuk Pengguna Linux | Kebiasaan backup sederhana sebelum belajar server atau eksperimen sistem. |
| 80 | Snapshot dan Restore Sistem | Mengenal snapshot sebagai titik kembali sebelum update atau perubahan besar. |

## F. Jaringan Linux

| No. | Judul | Deskripsi singkat |
|---|---|---|
| 81 | Network Interface: Pintu Linux ke Internet | Mengenal Wi-Fi, Ethernet, loopback, dan interface virtual. |
| 82 | IP Address, Gateway, dan DNS di Linux | Menghubungkan konsep jaringan dasar dengan komputer Linux nyata. |
| 83 | Ping, traceroute, dan Cara Mengecek Koneksi | Alur diagnosis ketika internet terasa tidak jalan. |
| 84 | Port: Nomor Pintu untuk Aplikasi | Menghubungkan port dengan HTTP, HTTPS, SSH, dan service lokal. |
| 85 | ss dan lsof: Siapa Memakai Port Ini? | Mencari aplikasi yang sedang mendengarkan atau memblokir suatu port. |
| 86 | localhost: Komputer yang Bicara dengan Dirinya Sendiri | Penjelasan 127.0.0.1, localhost, dan kegunaannya saat development. |
| 87 | Hosts File: Buku Kontak Lokal | Cara hosts file memengaruhi nama domain sebelum DNS publik dipakai. |
| 88 | curl untuk Pemula | Menguji API, website, header, dan request dari terminal. |
| 89 | VPN di Linux | Penjelasan sederhana tentang tunnel aman, termasuk kaitannya dengan Tailscale. |
| 90 | Network Troubleshooting Berlapis | Urutan cek kabel/Wi-Fi, IP, gateway, DNS, port, hingga server tujuan. |

## G. Server, web, dan deployment

| No. | Judul | Deskripsi singkat |
|---|---|---|
| 91 | Apa Itu Linux Server? | Perbedaan fokus Linux desktop dan server tanpa membuat server terlihat menakutkan. |
| 92 | Web Server: Nginx dan Apache | Peran web server saat menerima request dari browser. |
| 93 | Reverse Proxy: Resepsionis di Depan Aplikasi | Mengarahkan request ke aplikasi yang tepat tanpa membuka semua port ke publik. |
| 94 | Domain ke Server: Perjalanan Saat Website Dibuka | Menggabungkan DNS, IP, HTTPS, reverse proxy, dan aplikasi. |
| 95 | Deploy Aplikasi Sederhana di Linux | Gambaran pipeline dari source code sampai aplikasi bisa diakses. |
| 96 | Service untuk Node.js atau Python App | Menjaga aplikasi tetap hidup memakai systemd. |
| 97 | env di Server: Konfigurasi Bukan Rahasia di Kode | Melanjutkan env variable dengan fokus deployment yang lebih aman. |
| 98 | Log Aplikasi di Production | Cara membaca error server tanpa perlu menebak-nebak. |
| 99 | Health Check: Apakah Aplikasi Benar-Benar Sehat? | Bedanya service hidup, port terbuka, dan aplikasi siap melayani user. |
| 100 | Backup Database Sebelum Terlambat | Konsep dump, restore, jadwal backup, dan uji pemulihan. |
| 101 | Monitoring Server untuk Pemula | Apa yang perlu dipantau: CPU, RAM, disk, jaringan, uptime, dan error. |
| 102 | Incident Sederhana: Website Down | Cerita alur respons dari laporan user hingga service pulih. |

## H. Container dan virtualisasi

| No. | Judul | Deskripsi singkat |
|---|---|---|
| 103 | Virtual Machine vs Container | Perbandingan apartemen penuh dengan kontainer yang berbagi gedung. |
| 104 | Docker Image dan Container | Melanjutkan content Docker: resep aplikasi versus aplikasi yang sedang berjalan. |
| 105 | Dockerfile untuk Pemula | Bagaimana image dibuat langkah demi langkah. |
| 106 | Docker Compose: Menyalakan Banyak Service | Menjalankan app, database, dan cache sebagai satu paket. |
| 107 | Volume Docker: Data yang Tidak Boleh Hilang | Mengapa data database tidak boleh hanya tinggal di dalam container. |
| 108 | Port Mapping Docker | Hubungan port host dengan port aplikasi di container. |
| 109 | Container Log dan Debug Dasar | Cara melihat mengapa container berhenti atau tidak dapat diakses. |
| 110 | Kubernetes Itu Untuk Apa? | Pengantar ringan: kapan Docker cukup dan kapan orkestrasi mulai dibutuhkan. |

## I. Linux modern, kebiasaan baik, dan jalur belajar

| No. | Judul | Deskripsi singkat |
|---|---|---|
| 111 | Distro Linux: Ubuntu, Debian, Fedora, Arch | Cara memilih distro berdasarkan kebutuhan, bukan sekadar tren. |
| 112 | Desktop Environment: GNOME, KDE, XFCE | Melanjutkan content desktop environment dengan panduan memilih yang nyaman. |
| 113 | Wayland vs X11 | Mengapa sistem tampilan Linux sedang berubah, dengan bahasa awam. |
| 114 | Flatpak, Snap, dan Package Manager | Mengapa satu aplikasi bisa punya beberapa cara instalasi. |
| 115 | Open Source: Bukan Berarti Tanpa Aturan | Cara kerja lisensi, kontribusi, dan komunitas secara sederhana. |
| 116 | Membaca Manual Linux | Mengenal man, help, dan dokumentasi sebagai skill yang membuat mandiri. |
| 117 | Jangan Copy-Paste Perintah Sembarangan | Cara menilai perintah dari internet sebelum menjalankannya. |
| 118 | Permission Checklist Sebelum Menjalankan Script | Kebiasaan aman saat menerima script, installer, atau command dari orang lain. |
| 119 | Linux untuk Pelajar dan Anak Muda | Contoh penggunaan nyata: coding, desain, server game, belajar jaringan, dan privasi. |
| 120 | Peta Belajar Linux: Dari Pemula ke Bisa Mengelola Server | Episode penutup yang merangkum jalur belajar dan proyek latihan berikutnya. |

## Catatan perencanaan sebelum eksekusi

1. Nomor 25–36 sebaiknya diproduksi terlebih dahulu sebagai fondasi batch pertama.
2. Setiap content wajib punya satu pertanyaan/hook praktis, satu analogi utama yang konsisten, dan satu takeaway yang dapat langsung dicoba.
3. Content yang menyebut command berisiko, terutama hapus file, sudo, root, permission, firewall, dan disk, harus memuat batasan aman dan tidak mengajak penonton menjalankan command destruktif tanpa konteks.
4. Ketika satu content dipilih untuk diproduksi, buat folder content, plan scene per Act, plan audio, dan QA sesuai standar dokumentasi aktif.
