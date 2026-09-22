Login berhasil itu bukan berarti boleh buka semua — ada dua gerbang yang sering ketuker: authenticasi (siapa kamu) dan otorisasi (kamu boleh buka apa). 🔐

Ceritanya gini: Adib bawa paket ke Gedung Arsip yang alamatnya udah pas. Tapi petugas tetap nahan dulu — paket tujuan udah benar, identitas orangnya belum terbukti. Adib dipersilakan ke Loket Login buat membuktikan siapa dia. Authentication cuma ngejawab "siapa", bukan "boleh apa".

Di loket, Adib masukin password. Sistem nggak pernah nyimpen password aslinya: yang disimpan cuma hash + salt — sekali di-hash nggak bisa dibalik jadi password. Password asli bahaya banget kalau sampainya ke database yang bocor; hash paling mentok bisa dicocokkan. Hash cocok → Adib valid.

Terus, cara nginget "udah login" itu bisa dua bentuk: session disimpen di server dan dicek server tiap Adib minta data; atau token JWT yang bawa buktinya sendiri — signed, bukan encrypted. Keduanya punya trade-off yang beda.

Nah, ini yang paling sering salah paham: setelah Adib terbukti, bukannya semua lemari langsung kebuka. Lemari umum boleh (izin archive.read), lemari rahasia nggak (butuh archive.admin). Login valid itu bukan berarti semua izin otomatis — otorisasi dicek terpisah.

Beda 401 dan 403 ketebak di sini: 401 = belum login atau login-nya nggak valid, 403 = login valid tapi izin kurang. 🔑

Intinya: authentication cuma buktiin siapa, authorization yang mutusin boleh buka apa.

Save dulu buat yang lagi belajar auth/backend 📌

#Authentication #Authorization #JWT #Session #Hash #WebSecurity #BelajarCoding #DeveloperIndonesia #Backend