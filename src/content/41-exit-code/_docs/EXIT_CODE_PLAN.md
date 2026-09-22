# PLAN — 41 Exit Code: Bahasa Rahasia Status Command (0 vs Non-Zero)

| Item | Nilai |
|---|---|
| Status | 📝 PLAN ONLY |
| Audiens | Pemula yang sedang belajar scripting Bash / CI/CD pipeline automasi di Linux. |
| Audience promise | Memahami arti nilai balikan status `$?`, logika rantai `&&` vs `||`, serta tanda sukses `0` vs kode error `1-255`. |
| Scene shell | scene-ui V1 portrait 820×1340: IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1. |

## Series Identity
- **Seri**: Linux Fundamentals — Shell & Scripting
- **Title Segments**: `EXIT` (Cyan `#38BDF8`) + ` CODE` (Emerald `#34D399`)
- **Prasyarat**: 17 Shell, Terminal & Command Line.

## Model Mental
Setiap proses Linux saat selesai selalu melempar sinyal angka ke parent process (Shell). Angka `0` adalah standar universal untuk "Sukses Sempurna Tanpa Kendala". Angka `1` sampai `255` adalah kode kegagalan spesifik (misal: 1 = General error, 2 = Misuse of shell builtins, 127 = Command not found).

## Storyboard (4 Act)
1. **Act 1: Sinyal Rahasia di Balik Layar (`echo $?`)**
   - User menjalankan command di terminal. Setelah selesai, command melempar angka kecil ke laci memori `$?`.
2. **Act 2: Sukses `0` vs Gagal `Non-Zero`**
   - Perbandingan: File ditemukan ➔ Exit code `0` (Lampu hijau menyala). File tidak ada ➔ Exit code `1` (Lampu merah peringatan).
3. **Act 3: Logika Rantai: `&&` (And) vs `||` (Or)**
   - `mkdir folder && cd folder` ➔ Hanya melompat jika `mkdir` return `0`.
   - `ping google.com || echo "Offline"` ➔ Pesan cadangan muncul jika ping melempar error code.
4. **Act 4: Exit Code dalam Script & CI/CD Pipeline**
   - Bagaimana GitHub Actions / GitLab CI membaca exit code script untuk menentukan apakah status build lolos (Green) atau gagal (Red).
