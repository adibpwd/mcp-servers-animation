Pernah pencet tombol "Continue with Google/GitHub/Microsoft" atau "Sign in with Apple"? Aplikasi itu ternyata nggak pernah pegang password kamu sama sekali. 🔐

Rani buka DevNotes dan pilih "Continue with GitHub". DevNotes cuma minta izin read:user — buat nampilin username dan avatar doang. Alih-alih masukin password GitHub ke DevNotes (yang bahaya banget), Rani malah di-redirect ke GitHub sendiri buat login. Password cuma pernah ketik di situ — nggak pernah nyampe ke DevNotes.

Habis login, Rani lihat layar consent GitHub: DevNotes cuma minta izin read:user, bukan akses penuh ke akun apalagi izin nulis repository. Begitu di-approve, GitHub balikin "authorization code" ke redirect URI DevNotes — bukan token asli, cuma tiket sementara sekali pakai.

Nah ini bagian pentingnya: code itu ditukar jadi access token pakai PKCE verifier, biar nggak bisa dibajak orang lain di tengah jalan. Token yang jadi cuma punya izin read:user — akses ke repo (apalagi buat nulis) tetap kekunci rapat.

Google, Microsoft, dan Apple sebenernya jalan dengan pola yang sama: redirect → login/session → consent → code → token. Cuma beda contoh scope dan resource-nya doang.

Ini namanya OAuth2: delegasi izin akses, bukan berbagi password. Kalau aplikasi butuh identitas login standar, biasanya itu OpenID Connect yang jalan bareng OAuth2. 🔑

Full alurnya — pilih provider, redirect, consent, code, PKCE, sampai token bergaris scope — ada lengkap di video. Tonton biar paham kenapa "Continue with Google/GitHub/dll" itu aman dipakai.

Save dulu buat yang lagi belajar auth/backend 📌

#OAuth2 #Authentication #Authorization #WebSecurity #API #BelajarCoding #TechEducation #DeveloperIndonesia #Backend
