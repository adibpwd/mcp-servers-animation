# PLAN — 35 Cron Job: Robot Penjadwal Otomatis di Linux

| Item | Nilai |
|---|---|
| Status | 📝 PLAN ONLY |
| Audiens | Pengembang / sysadmin pemula yang ingin mengotomasi tugas berulang tanpa campur tangan manual. |
| Audience promise | Memahami anatomi 5 bintang crontab, daemond `crond` di background, dan eksekusi tugas tepat waktu. |
| Scene shell | scene-ui V1 portrait 820×1340: IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1. |

## Series Identity
- **Seri**: Linux Fundamentals — Automasi & Produktivitas
- **Title Segments**: `CRON` (Cyan `#38BDF8`) + ` JOB` (Emerald `#34D399`)
- **Prasyarat**: Linux Shell & Terminal, Linux Processes.

## Model Mental
Daemon `crond` berjalan nonstop di background memeriksa tabel jadwal (`crontab`). Setiap satu menit, `crond` membaca 5 kolom waktu (Menit, Jam, Hari, Bulan, Hari dlm Minggu). Ketika waktu saat ini cocok dengan pola yang ditentukan, daemon memicu proses worker di background dan membelokkan output log ke file tujuan.

## Storyboard (4 Act)
1. **Act 1: Daemon yang Tidak Pernah Tidur (`crond`)**
   - Background clock berputar. Daemon `crond` standby memeriksa daftar jadwal setiap interval menit.
2. **Act 2: Membaca 5 Bintang Crontab (`* * * * *`)**
   - 5 slot konfigurasi: Menit (0-59), Jam (0-23), Dom (1-31), Month (1-12), Dow (0-6).
   - Penjelasan simbol `*` (setiap), `*/5` (kelipatan), dan angka spesifik `0 2 * * *` (jam 2 pagi).
3. **Act 3: Memicu Script & Worker**
   - Jarum jam menyentuh 02:00. Pemicu aktif meluncurkan script `/backup.sh` ke worker process baru.
4. **Act 4: Eksekusi Silent & Log Redirection**
   - Menunjukkan pentingnya redirect `>> /var/log/backup.log 2>&1` agar hasil eksekusi tercatat rapi tanpa pesan hilang.
