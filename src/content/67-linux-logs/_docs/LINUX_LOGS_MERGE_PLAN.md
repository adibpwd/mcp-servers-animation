# PLAN — 67 Linux Logs

| Item | Nilai |
|---|---|
| Status | PLAN ONLY — jangan dieksekusi |
| Keputusan | Digabung sebagai Act 5–6 dari Content 65 |
| Implementasi mandiri | Tidak direncanakan selama keputusan merge aktif |

## Alasan

Logs akan lebih mudah dipahami jika penonton sudah melihat service lifecycle:
sebuah unit mulai, process menulis stdout/stderr, manager mencatat event, lalu
operator membaca urutan bukti. Memisahkan logs sebagai video berdiri sendiri
berisiko membuatnya menjadi daftar lokasi file tanpa konteks penyebab.

## Kontrak integrasi ke Content 65

| Bagian log | Dimasukkan ke Act | Konsep |
|---|---|---|
| Journal sebagai event timeline | 5 | Siapa/apa/kapan dicatat. |
| Service dan app log | 5 | Source log dapat berbeda. |
| Filter unit, waktu, boot, priority | 6 | Persempit bukti tanpa menebak. |
| Retention/rotation dan sensitivity | 6/closing | Log perlu dikelola dan dapat mengandung data sensitif. |
| Status, log, health check, metrics | 6 | Observability terdiri dari beberapa sinyal. |

## Batas keamanan

Tidak ada command melihat log, konfigurasi retention, penghapusan log, atau
contoh data produksi. Jangan menjanjikan log selalu lengkap atau bebas data
sensitif.

## Trigger untuk memisahkan kembali

Buat Content 67 mandiri hanya bila seri membutuhkan pembahasan mendalam tentang
journald versus syslog, log files, structured fields, rotation/retention,
centralized logging, audit logs, privacy, dan incident timeline. Bila itu
terjadi, Content 65 tetap fokus lifecycle service dan Content 67 menjadi
observability/logging detail.

