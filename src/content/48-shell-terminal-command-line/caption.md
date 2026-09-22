Terminal, command line, shell — sering dianggap sama, padahal beda peran.

Terminal cuma jendela yang menampilkan teks. Command line itu cara kamu mengetik perintah. Shell yang sebenarnya membaca, memahami, dan menjalankannya — lewat PTY yang menghubungkan semuanya.

Ketik pwd, Enter, shell langsung tahu itu builtin — dijalankan sendiri tanpa buka process baru. Beda dengan ls -la: dicari dulu lewat PATH, baru dijalankan sebagai process terpisah.

echo "$HOME"/notes/*.txt bukan sekadar teks yang dibaca apa adanya — shell membaca strukturnya: quote melindungi $HOME supaya tidak ikut terbelah, tanda bintang di-expand jadi daftar file, baru dieksekusi.

grep error juga punya tiga jalur data sendiri: input lewat stdin, hasil normal lewat stdout, pesan error lewat stderr — bisa dipisah atau di-redirect ke tempat berbeda.

Command yang sama, pwd, bisa berperilaku beda tergantung konteks: interaktif di terminal, saat login, dijalankan script tanpa prompt, atau lewat SSH ke server lain.

Mau bikin script yang aman? Quote nama file — "April Report.txt" bisa pecah jadi dua kalau lupa quote — cek exit status sebelum lanjut, dan pastikan cleanup tetap jalan walau gagal di tengah jalan.

Tonton videonya sampai habis buat lihat semuanya bergerak.

#Linux #Shell #Terminal #Bash #BelajarLinux #CommandLine
