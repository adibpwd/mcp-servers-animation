Buka web di browser, yang jawab pertama kali itu siapa sih? 🌐👇

Bukan langsung aplikasi (seperti Node.js/Python), tapi Web Server seperti Nginx atau Apache yang 'standby' di port HTTP/HTTPS (80/443).

Alurnya tergantung path URL yang diminta:

1️⃣ Request File Statis (/about.html, /style.css, logo.png):
Web Server langsung baca file dari disk lokal dan kirim balik ke browser. Hemat waktu, aplikasi upstream tetap santai.

2️⃣ Request Data Dinamis (/api/profile):
Web Server meneruskan (forward) request ke aplikasi backend (Node.js/Python/Java). Aplikasi mengolah database, bikin JSON, lalu kirim balik.

Point pentingnya:
Mau itu file statis di disk atau data dari backend, SEMUA response selalu kembali lewat Web Server sebagai gerbang utama. 🔒

#WebServer #Nginx #Apache #Backend #DevOps #BelajarLinux #WebDevelopment #SystemArchitecture #Coding #SoftwareEngineering
