# PLAN — 40 File Permission Lanjutan: chown, su, sudo & sudoers

| Item | Nilai |
|---|---|
| Status | 📝 PLAN ONLY |
| Audiens | Developer & sysadmin pemula yang sering tergoda jalan pintas bahaya `chmod 777` saat Permission Denied. |
| Audience promise | Memahami kepemilikan User vs Group (`chown`), pergantian identitas sementara (`sudo`), dan konfigurasi aman `/etc/sudoers`. |
| Scene shell | scene-ui V1 portrait 820×1340: IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1. |

## Series Identity
- **Seri**: Linux Fundamentals — User, Group & Security
- **Title Segments**: `CHOWN &` (Amber `#FBBF24`) + ` SUDO` (Emerald `#34D399`)
- **Prasyarat**: 02 Linux File Permission, User & Group Access.

## Model Mental
Saat muncul error "Permission Denied", solusi bukan membuka semua gembok untuk siapa saja (`chmod 777`), melainkan memastikan kepemilikan file berada di tangan yang tepat (`chown user:group`) atau menjalankan perintah dengan eskalasi izin sementara yang tercatat (`sudo`).

## Storyboard (4 Act)
1. **Act 1: Jebakan "Permission Denied" & Bahaya `777`**
   - Aplikasi web Nginx gagal membaca file konfigurasi. Jebakan `chmod 777` diilustrasikan merobohkan dinding keamanan, mengizinkan siapa saja (termasuk hacker) merusak file.
2. **Act 2: Mengubah Kepemilikan dengan `chown`**
   - Kartu nama pemilik file diganti dari `root:root` menjadi `www-data:www-data`. Nginx langsung bisa membaca tanpa menurunkan standar keamanan.
3. **Act 3: `su` vs `sudo`: Pindah Kursi vs Izin Sementara**
   - `su` (Switch User permanen) vs `sudo` (menjalankan satu perintah spesifik dengan pengawasan ketat).
4. **Act 4: Buku Aturan `/etc/sudoers` & Audit Trail**
   - Memperlihatkan bagaimana `/etc/sudoers` membatasi perintah apa saja yang boleh dijalankan user tertentu, dan setiap aksi `sudo` tercatat di log audit.
