# Revisi-02 — Linux Filesystem: Workspace Developer yang Lebih Nyata

| Item | Nilai |
|---|---|
| Content | 25 — Linux Filesystem |
| Tanggal | 2026-09-13 |
| Status | ✅ Implemented — build project lulus |
| Fokus | Memperbanyak isi folder dan membuat hubungan folder → isi → path dapat dibaca jelas. |

## Perubahan utama

Studi kasus tidak lagi berhenti pada satu file `belanja.txt`. Tokoh developer
`adib` kini memiliki workspace `~/Projects/inventory-api`, sehingga setiap
folder besar punya contoh yang biasa ditemui saat membuat software.

| Lokasi | Isi yang ditampilkan | Ringkasan fungsi |
|---|---|---|
| `/home/adib` | Projects, Downloads, Documents, Videos, `.config`, `.ssh` | Ruang kerja dan data pribadi user. |
| `~/Projects/inventory-api` | `src`, `tests`, `package.json`, `README.md` | Struktur repository aplikasi Node.js. |
| `/etc` | nginx, ssh, docker, systemd, hosts | Konfigurasi layanan sistem. |
| `/usr` dan `/opt` | binari Node/Git/Code/Python, library, resource aplikasi | Program dan resource yang dipasang untuk sistem. |
| `/var` | app log, nginx access log, docker log, cache npm/app | Data yang tumbuh ketika aplikasi berjalan. |
| `/tmp` | hasil build Vite dan preview upload | Data kerja sementara, bukan arsip penting. |

## Navigasi yang diperjelas

Act 4 menampilkan lima path nyata, masing-masing beserta alasan lokasinya:

- kode aplikasi: `/home/adib/Projects/inventory-api/src/server.js`;
- konfigurasi web server: `/etc/nginx/nginx.conf`;
- executable yang ditemukan shell: `/usr/bin/node`;
- catatan request web server: `/var/log/nginx/access.log`;
- hasil build sementara: `/tmp/vite-build-8192`.

Dengan demikian folder tidak hanya dikenalkan sebagai daftar: penonton dapat
melihat isi yang lazim, lalu membaca alamat untuk menuju isi tersebut.

## Kontinuitas visual

- Pohon `/ → home/etc/var/tmp` tetap terlihat sebagai peta utama.
- Setiap folder memiliki sublabel fungsi agar ringkasan dapat dipindai cepat.
- Workspace project muncul pertama, kemudian aplikasi `inventory-api` menjadi
  sumber log/cache di Act 3.
- Path terakhir menggunakan nama item yang sudah terlihat pada Act sebelumnya.

## Batas konsep

Contoh `/usr/bin`, `apt`, dan folder konfigurasi dapat sedikit berbeda antar
distro. Video menyajikannya sebagai contoh umum Linux, bukan daftar lengkap
atau instruksi untuk mengubah konfigurasi sistem.
