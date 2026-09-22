# PLAN — 42 Top, Htop & Load Average: Membaca Detak Jantung Server

| Item | Nilai |
|---|---|
| Status | 📝 PLAN ONLY |
| Audiens | Developer & sysadmin yang ingin mendiagnosa server lambat dan memahami metrik CPU serta Load Average. |
| Audience promise | Memahami 3 angka Load Average (1, 5, 15 menit), korelasi dengan jumlah CPU Core, dan membaca UI `htop`. |
| Scene shell | scene-ui V1 portrait 820×1340: IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1. |

## Series Identity
- **Seri**: Linux Fundamentals — Monitoring & Troubleshooting
- **Title Segments**: `LOAD` (Cyan `#22D3EE`) + ` AVERAGE` (Emerald `#34D399`)
- **Prasyarat**: 18 Linux Processes.

## Model Mental
- **Analogi Jembatan Tol:** Jumlah CPU Core adalah jumlah lajur jalan tol.
- **Load 1.0 pada 1 Core:** Tol pas melayani kapasitas 100% tanpa antrean.
- **Load 2.0 pada 1 Core:** Ada antrean kendaraan (proses) menunggu lajur kosong sepanjang kapasitas jalan itu sendiri (50% proses harus antre).
- **Load 2.0 pada 4 Core:** Jalan tol masih sangat lengang (hanya 50% kapasitas terpakai).

## Storyboard (4 Act)
1. **Act 1: Dashboard Detak Jantung Server (`top` & `htop`)**
   - Meteran visual CPU bar, Memory bar, dan daftar task aktif secara real-time.
2. **Act 2: Membaca 3 Angka Misterius (1m, 5m, 15m)**
   - Angka `0.50, 1.20, 3.50`: Menunjukkan tren apakah beban server sedang mereda (dari 3.5 turun ke 0.5) atau justru sedang melonjak naik.
3. **Act 3: Korelasi dengan Jumlah Core CPU (Analogi Jalan Tol)**
   - Menghitung rasio: `Load / Total Core`. Memberi batas aman kapan server mulai tercekik antrean proses.
4. **Act 4: CPU Bound vs I/O Wait (Disk Bottleneck)**
   - Membedakan beban tinggi karena kalkulasi CPU murni vs proses yang macet menunggu baca-tulis harddisk lambat (`%wa` / I/O wait).
