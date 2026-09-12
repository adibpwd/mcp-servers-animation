Pernah pencet tombol "Login pakai Kampus" di sebuah aplikasi? Ternyata aplikasi itu nggak pernah pegang password kamu sama sekali. 🔐

Adib mau pakai Aplikasi Catatan buat baca profil dasarnya. Alih-alih masukin password Kampus ke aplikasi itu (yang bahaya banget), Adib malah di-redirect ke halaman Kampus sendiri buat login. Password cuma pernah ketik di situ — nggak pernah nyampe ke Aplikasi Catatan.

Habis login, Adib lihat layar consent: aplikasi cuma minta izin profile.read, bukan akses penuh ke akun. Begitu di-Allow, Kampus kasih "authorization code" — bukan token asli, cuma tiket sementara sekali pakai.

Nah ini bagian pentingnya: code itu ditukar jadi access token pakai PKCE verifier, biar nggak bisa dibajak orang lain di tengah jalan. Token yang jadi cuma punya izin profile.read — data lain kayak grades atau email tetap kekunci rapat.

Ini namanya OAuth2: delegasi izin, bukan berbagi password. 🔑

Full alurnya — redirect, consent, code, PKCE, sampai token bergaris scope — ada lengkap di video. Tonton biar paham kenapa "Login pakai Google/Kampus/dll" itu aman dipakai.

Save dulu buat yang lagi belajar auth/backend 📌

#OAuth2 #Authentication #Authorization #WebSecurity #API #BelajarCoding #TechEducation #DeveloperIndonesia #Backend
