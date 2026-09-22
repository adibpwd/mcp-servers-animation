Sebelum menyentuh file apa pun, cek dulu lokasi dan rutenya.

pwd menjawab sedang di folder mana. cd Downloads, cd .., dan cd ~ membuktikan tiga rute dasar: masuk satu folder, naik satu level, atau langsung pulang ke home.

Begitu lokasi jelas, mkdir -p membangun beberapa folder project sekaligus, dan touch menyiapkan file kosong. ls -la menyingkap item yang tadinya tersembunyi.

Mengelola file butuh kehati-hatian: cp menggandakan tanpa menghapus asal, mv memindahkan sekaligus mengganti nama, dan rm -i selalu bertanya dulu sebelum menghapus.

Menyiapkan tool baru lewat package manager, lalu merangkai command dengan && supaya langkah berikutnya hanya jalan kalau yang sebelumnya sukses — atau ; kalau semua langkah tetap perlu jalan apa pun hasilnya.

Kenali posisi, susun aman, baru jalankan.

#Linux #Terminal #CLI #BelajarLinux #Pemula
