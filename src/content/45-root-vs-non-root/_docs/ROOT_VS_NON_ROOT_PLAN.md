# PLAN — 45 Root vs Non-Root: Kenapa Tidak Boleh Selalu Jadi Raja Server

| Item | Nilai |
|---|---|
| Status | 📝 PLAN ONLY |
| Audiens | Pemula yang terbiasa menjalankan semua hal sebagai user `root` (UID 0) tanpa menyadari risiko fatalnya. |
| Audience promise | Memahami Principle of Least Privilege (PoLP), bahaya blast radius error/malware, dan isolasi akun layanan. |
| Scene shell | scene-ui V1 portrait 820×1340: IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1. |

## Series Identity
- **Seri**: Linux Fundamentals — Security & Best Practices
- **Title Segments**: `ROOT VS` (Pink `#F472B6`) + ` NON-ROOT` (Emerald `#34D399`)
- **Prasyarat**: 02 Linux File Permission, User & Group Access.

## Model Mental
- **User `root` (UID 0):** Raja dengan kekuasaan mutlak. Tidak ada dialog konfirmasi, bisa menghapus seluruh file sistem inti OS tanpa peringatan.
- **User Non-Root / Service Account:** Pekerja dengan izin terbatas pada wilayah kerjanya saja (Least Privilege).
Jika aplikasi web dibobol hacker saat berjalan sebagai non-root, hacker terjebak di ruangan terbatas. Jika aplikasi berjalan sebagai root, hacker menguasai seluruh server.

## Storyboard (4 Act)
1. **Act 1: Ilusi Kemudahan Login Root**
   - Developer senang login sebagai `root` karena tidak pernah terhalang "Permission Denied".
2. **Act 2: Kesalahan Fatal Satu Spasi (`rm -rf / tmp/*`)**
   - Kesalahan ketik sepele spasi di root langsung menghapus seluruh isi disk server. Tidak ada sistem yang menahan.
3. **Act 3: Skenario Peretasan: Blast Radius**
   - Simulasi bug Remote Code Execution (RCE) di web app.
   - Skenario A (Web run as root): Hacker mendapatkan full server shell.
   - Skenario B (Web run as `www-data`): Hacker gagal menyentuh `/etc/shadow` atau file sistem.
4. **Act 4: Pola Aman: Akun Khusus & Eskalasi Terbatas (`sudo`)**
   - Menerapkan akun non-login untuk service (`systemd` `User=appuser`) dan hanya menggunakan `sudo` saat administrasi.
