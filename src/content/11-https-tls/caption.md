Pernah mikir apa yang terjadi waktu kamu ketik "https://" di browser? Kenapa ada ikon gemboknya dan kenapa bukan HTTP biasa? 🔒

Kalau HTTP standar, data kamu (password, token, cookie) melintas di jalan publik terbuka. Pengintip di Wi-Fi umum bisa lihat bahkan ngubah isi request kamu!

Lewat animasi ini, kita bedah gimana HTTPS & TLS mengamankan percakapan web dalam 4 Act:

1. Act 1: HTTP Plaintext — Data dikirim polos tanpa pelindung. Siapa saja di tengah jalan bisa intip payload-nya.
2. Act 2: Sertifikat & CA — Browser minta bukti. Server kirim sertifikat digital yang diverifikasi ke Root CA & Intermediate CA. Sertifikat penyamar langsung ditolak!
3. Act 3: Key Exchange — Kunci sesi TIDAK pernah dikirim utuh di jaringan! Kedua pihak menukar "bahan rahasia" untuk membentuk shared secret key secara independen.
4. Act 4: Encrypted Tunnel — Terowongan TLS aktif! Request HTTP dibungkus ke dalam kapsul terenkripsi. Pengintip cuma bisa lihat paket luar, isinya aman 100%.

💡 TL;DR: HTTP itu surat terbuka tanpa amplop, HTTPS itu surat di dalam terowongan baja terkunci yang cuma bisa dibuka sama penerima asli.

Save dulu buat yang lagi belajar web security & backend! 📌

#HTTPS #TLS #CyberSecurity #WebDev #Backend #SoftwareEngineering #DevTools #BelajarCoding #TechEducation #DeveloperIndonesia
