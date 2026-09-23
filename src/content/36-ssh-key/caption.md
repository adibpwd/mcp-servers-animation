Password itu rahasia yang bisa ditebak. Robot bisa nyoba ribuan kombinasi per detik ke port 22 kamu — cuma nunggu waktu sampai salah satu cocok. 🔓

SSH key kerja beda total. `ssh-keygen` bikin dua benda kembar: gembok publik (boleh disebar ke server manapun) dan kunci privat (tinggal di laptop kamu, gak pernah dikirim ke mana-mana). Gemboknya dipasang di server lewat `ssh-copy-id`, masuk ke `~/.ssh/authorized_keys`.

Pas login, server GAK minta password. Dia kirim "teka-teki" terenkripsi ke laptop kamu — cuma kunci privat yang cocok yang bisa buka teka-teki itu. Laptop kirim balik jawabannya, server cocokkan sama gembok publik yang tersimpan. Kalau cocok, akses granted. Password gak pernah diketik, apalagi dikirim lewat jaringan.

Itu kenapa SSH key jauh lebih tahan brute-force dan phishing dibanding password biasa. 🔐

Breakdown lengkapnya — dari kelemahan password sampai proses challenge-response — ada di video.

Save buat referensi kalau lagi belajar Linux/DevOps 📌

#SSH #SSHKey #Linux #Cybersecurity #DevOps #Cryptography #BelajarCoding #TechEducation #DeveloperIndonesia
