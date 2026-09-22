# PLAN — 43 Symlink vs Hard Link: Dua Jenis Jalan Pintas di Linux

| Item | Nilai |
|---|---|
| Status | 📝 PLAN ONLY |
| Audiens | Pengguna Linux yang ingin memahami cara kerja link file, perbedaan inode, dan teknik zero-downtime deployment. |
| Audience promise | Memahami perbedaan fundamental Inode pada Hard Link vs Penunjuk Path pada Symbolic Link (`ln -s`). |
| Scene shell | scene-ui V1 portrait 820×1340: IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1. |

## Series Identity
- **Seri**: Linux Fundamentals — Filesystem & Storage
- **Title Segments**: `SYMLINK &` (Cyan `#38BDF8`) + ` HARD LINK` (Emerald `#34D399`)
- **Prasyarat**: 13 Linux Filesystem, 15 File Operations.

## Model Mental
- **Inode:** Nomor blok penyimpanan fisik data di harddisk.
- **Hard Link (`ln file link`):** Dua nama file berbeda yang memiliki Inode yang sama persis (dua pintu menuju satu kamar yang sama). Menghapus salah satu pintu tidak merusak data.
- **Symlink / Soft Link (`ln -s target link`):** File kecil khusus berisi teks alamat target. Jika target dihapus atau dipindah, link menjadi "patah" (Broken link / Dangling).

## Storyboard (4 Act)
1. **Act 1: Konsep Inode & Nama File**
   - Harddisk menyimpan data di blok Inode #1024. Nama file di direktori hanyalah label yang menunjuk nomor Inode tersebut.
2. **Act 2: Hard Link — Dua Pintu Satu Ruangan**
   - Membuat Hard Link. Link counter pada Inode bertambah menjadi 2. File asli dihapus, isi data tetap utuh dan bisa diakses via link kedua.
3. **Act 3: Symlink — Papan Petunjuk Jalan (`ln -s`)**
   - Membuat Symlink. File link berisi string path `/var/www/v1`. Jika folder `v1` dihapus, panah petunjuk menjadi merah buram (Dangling Symlink).
4. **Act 4: Zero-Downtime Deployment (Penerapan Nyata)**
   - Nginx selalu mengarah ke `/var/www/current` (symlink). Saat update versi baru (`v2`), symlink digeser dalam hitungan milidetik dari `v1` ke `v2` tanpa restart server.
