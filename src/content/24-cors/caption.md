Frontend buka di adib-dev.com, data ada di api.example — beda origin, tapi kok bisa gagal baca? 😵

Tapi bingung... CORS bukan "server menolak terima request". Origin beda bikin browser jadi gerbang: request dipegang dulu.

Karena request-nya POST + Authorization (non-simple), browser gak langsung lanjut — dia bertanya dulu via preflight OPTIONS: "Origin adib-dev.com, boleh POST, boleh bawa authorization?"

API jawab lewat header izin: Access-Control-Allow-Origin, Allow-Methods, Allow-Headers. Kalau cocok, request asli baru berjalan & browser buka data untuk JavaScript. Kalau nggak cocok? Ditahan!

Penting: CORS bukan pengganti auth. Wildcard + credential gak boleh kombo. 🔒

Gimana browser ngejudge request-nya? 👀 Full penjelasannya ada di video — nonton sampai habis biar paham alur browser vs API.

Save buat referensi kalau lagi belajar web security/frontend 📌

#CORS #WebDev #JavaScript #Browser #API #Security #Preflight #DevTools #BelajarCoding