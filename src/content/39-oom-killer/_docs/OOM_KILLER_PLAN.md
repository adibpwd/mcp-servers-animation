# PLAN — 39 OOM Killer: Algojo Saat RAM Server Habis

| Item | Nilai |
|---|---|
| Status | 📝 PLAN ONLY |
| Audiens | Sysadmin & Backend Engineer yang pernah mendapati aplikasi tiba-tiba hilang/mati misterius (`Killed`). |
| Audience promise | Memahami mekanisme proteksi darurat Linux Kernel saat memori 100% penuh dan kalkulasi `oom_score`. |
| Scene shell | scene-ui V1 portrait 820×1340: IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1. |

## Series Identity
- **Seri**: Linux Deep Dive — Memory & Kernel
- **Title Segments**: `OOM` (Rose `#EC4899`) + ` KILLER` (Amber `#F59E0B`)
- **Prasyarat**: 03 Virtual Memory, 18 Linux Processes.

## Model Mental
Saat aplikasi meminta alokasi RAM baru tapi memori fisik dan Swap sudah habis (Overcommit exhaustion), Kernel Linux tidak boleh membiarkan seluruh OS beku/hang. Sub-sistem OOM (Out Of Memory) Killer aktif sebagai algojo darurat: menghitung skor risiko (`badness score`), memilih proses paling rakus memori yang tidak krusial bagi kelangsungan OS, lalu mengirim `SIGKILL (9)` tanpa kompromi.

## Storyboard (4 Act)
1. **Act 1: Tekanan Memori Menembus Batas (RAM 99.9%)**
   - Bar memori fisik merah membara, Swap penuh, aplikasi web rakus memakan sisa buffer.
2. **Act 2: Alarm Darurat Kernel Berbunyi**
   - Kernel mendeteksi ketiadaan alokasi halaman memori baru. Status darurat OOM aktif.
3. **Act 3: Menghitung Skor Korban (`oom_score`)**
   - Scan proses: Process A (Database krusial), Process B (System daemon), Process C (Worker memory leak).
   - Process C mendapatkan `oom_score` tertinggi karena rasio konsumsi RAM terbesar.
4. **Act 4: Eksekusi SIGKILL & Jejak di `dmesg`**
   - Algojo Kernel meluncurkan `SIGKILL (9)` ke Process C. Memori langsung lega kembali. Jejak kejadian tercatat di log `/var/log/messages` / `dmesg`.
