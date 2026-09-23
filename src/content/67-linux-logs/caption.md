Setiap kali aplikasi jalan, dia sebenarnya lagi "bicara" — lewat log. Cuma kita jarang dengar.

Begitu app menulis event, journald langsung menangkapnya dan menyimpannya terstruktur — bukan sekadar teks, tapi field: priority, PID, unit systemd, sampai pesannya sendiri. Makanya bisa difilter presisi.

journald juga meneruskan salinannya ke /var/log sebagai baris teks polos — versi yang gampang di-grep manusia kapan saja.

Tapi log tidak abadi. Ada kebijakan retensi: journald auto-vacuum saat kepenuhan, logrotate motong dan hapus setelah masa retensi habis — biasanya 30 hari.

Untuk sistem yang serius, log juga di-forward ke server pusat. Di sana dia jadi audit trail: siapa, apa, kapan — semuanya tercatat, terpisah dari mesin asalnya.

Pas ada insiden, kerjanya justru dari situ: kumpulkan entri dari journald, syslog, dan audit trail, urutkan berdasarkan waktu — bukan urutan tampilan — baru gabungkan jadi satu cerita utuh.

Log bukan abadi, tapi jejaknya berharga — asal tahu cara membacanya.

Tonton videonya sampai habis buat lihat alurnya dari awal.

#Linux #LinuxLogs #Journald #Syslog #BelajarLinux #SysAdmin
