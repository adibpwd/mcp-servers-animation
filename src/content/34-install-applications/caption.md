Butuh aplikasi editor ringan di Linux? Bukan download installer acak dari internet — begini alurnya 👇

`install editor-lite` bukan tombol ajaib. Setiap distro punya manager sendiri: apt (Debian/Ubuntu), dnf (Fedora/RHEL), pacman (Arch), zypper (openSUSE), apk (Alpine) — tool beda, fungsi inti serupa.

Manager membaca repository yang dikonfigurasi: official, security updates, mirror, community, vendor, sampai local — lalu mengambil metadata (versi, dependency) dulu, bukan langsung download file pertama yang ketemu.

Dependency (ui-kit, text-engine) ikut dipetakan dan rencana perubahan (transaction plan) disusun sebelum sistem benar-benar berubah.

Barulah izin sistem diminta → arsip di-download → diverifikasi → di-unpack → dikonfigurasi. Lima tahap, bukan satu klik ajaib.

Selesai semua tahap, database package mencatat hasilnya dan aplikasi resmi terpasang, siap dipakai.

Intinya: pilih sumber repository yang tepercaya untuk distromu — package manager yang mengurus sisanya. 🔒

#Linux #PackageManager #apt #dnf #pacman #LinuxTutorial #BelajarLinux #CLI #Terminal #TechEducation
