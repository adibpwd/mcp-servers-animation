# PLAN — 44 Systemd Timer: Pengganti Modern Cron Job

| Item | Nilai |
|---|---|
| Status | 📝 PLAN ONLY |
| Audiens | Sysadmin & DevOps yang ingin meningkatkan automasi dari Cron tradisional ke unit `.timer` systemd modern. |
| Audience promise | Memahami keunggulan Systemd Timer: log terpusat via `journalctl`, retry otomatis, dan eksekusi berbasis event/kalender. |
| Scene shell | scene-ui V1 portrait 820×1340: IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1. |

## Series Identity
- **Seri**: Linux Fundamentals — Systemd & Automation
- **Title Segments**: `SYSTEMD` (Cyan `#38BDF8`) + ` TIMER` (Emerald `#34D399`)
- **Prasyarat**: 65 Systemd, 67 Linux Logs.

## Model Mental
Jika Cron adalah alarm jam meja mekanik sederhana, maka Systemd Timer adalah smart home scheduler terintegrasi:
- Pasangan dua file: `backup.timer` (jadwal & pemicu) + `backup.service` (perintah kerja yang dieksekusi).
- Jika server sempat mati saat jadwal terlewat, fitur `Persistent=true` langsung mengeksekusi tugas begitu server menyala kembali.
- Semua log eksekusi otomatis tersimpan dan mudah dicari lewat `journalctl -u backup.service`.

## Storyboard (4 Act)
1. **Act 1: Batasan Cron Job Biasa**
   - Cron gagal saat server mati pas tengah malam, log tercecer di file terpisah, tidak ada monitoring status native.
2. **Act 2: Anatomi Pasangan Unit (`.timer` & `.service`)**
   - `.timer` mendefinisikan jadwal (`OnCalendar=*-*-* 02:00:00`).
   - `.service` mendefinisikan apa yang harus dikerjakan (`ExecStart=/usr/local/bin/backup.sh`).
3. **Act 3: Fitur Unggulan: `Persistent=true` & `OnBootSec`**
   - Simulasi server mati saat jam 02:00. Begitu server hidup jam 03:00, Systemd Timer mendeteksi tugas terlewat dan langsung mengeksekusinya.
4. **Act 4: Observabilitas dengan `systemctl list-timers`**
   - Melihat hitung mundur eksekusi berikutnya (Next execution), waktu eksekusi terakhir (Left), dan inspeksi log output dengan `journalctl`.
