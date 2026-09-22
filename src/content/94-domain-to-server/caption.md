Ketik nama domain di browser, kok bisa sampai muncul halaman web? Gimana perjalanan request-nya di balik layar? 🌐👇

Bukan "sekali klik langsung muncul", ada 4 tahap yang dilewati dalam hitungan milidetik:

1️⃣ Domain ke IP (DNS Resolution):
Komputer tidak paham nama domain. Browser bertanya dulu ke DNS Resolver untuk menerjemahkan `example.dev` menjadi alamat IP angka (misal: `203.0.113.42`).

2️⃣ Masuk Pintu Gerbang (Edge Server / Port 443):
Setelah dapat IP, browser mengirim packet HTTPS via Port 443 menuju Edge Server (titik masuk utama server).

3️⃣ Routing ke Aplikasi (Reverse Proxy):
Reverse Proxy membaca Host dan Path request, lalu mengarahkan (forward) packet ke aplikasi backend yang sesuai (seperti Node.js/Python).

4️⃣ Response Kembali ke Browser:
Aplikasi membuat response (200 OK), dikirim balik melewati Proxy dan Edge, baru kemudian browser merender halaman di layarmu.

Point pentingnya:
Domain adalah "nama alias", IP adalah "alamat fisik", dan Proxy adalah "petugas lalu lintas" yang memastikan request sampai ke aplikasi yang tepat. 🔒

#DNS #Domain #WebServer #ReverseProxy #Backend #DevOps #BelajarLinux #WebDevelopment #SystemArchitecture #Networking
