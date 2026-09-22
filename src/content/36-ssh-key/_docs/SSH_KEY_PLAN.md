# PLAN — 36 SSH Key vs Password: Kunci Digital Pengganti Password

| Item | Nilai |
|---|---|
| Status | 📝 PLAN ONLY |
| Audiens | Pengguna Linux & Cloud VPS yang ingin beralih dari auth password rentan ke autentikasi kunci asimetris. |
| Audience promise | Memahami pasangan public/private key, mekanisme challenge-response matematika tanpa membocorkan rahasia. |
| Scene shell | scene-ui V1 portrait 820×1340: IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1. |

## Series Identity
- **Seri**: Linux Fundamentals — Keamanan & Akses
- **Title Segments**: `SSH` (Cyan `#22D3EE`) + ` KEY` (Emerald `#34D399`)
- **Prasyarat**: 16 SSH, Linux User & Group.

## Model Mental
Password biasa rentan diserang brute-force atau disadap. SSH Key menggunakan kriptografi kunci publik asimetris:
- **Public Key (`id_ed25519.pub`)**: Gembok publik yang diletakkan di server (`~/.ssh/authorized_keys`).
- **Private Key (`id_ed25519`)**: Kunci fisik unik yang hanya tinggal di laptop user.
Server membungkus teka-teki (challenge) dengan public key, laptop mendekripsinya dengan private key, membuktikan identitas user seketika.

## Storyboard (4 Act)
1. **Act 1: Kelemahan Password & Bahaya Brute-Force**
   - Robot hacker mencoba ribuan password per detik pada port 22; server kewalahan.
2. **Act 2: Pasangan Kunci Publik & Privat (`ssh-keygen`)**
   - Generator menghasilkan dua benda kembar: Gembok Publik (boleh dibagikan) & Kunci Privat (rahasia total).
3. **Act 3: Memasang Gembok di Server (`authorized_keys`)**
   - Perintah `ssh-copy-id` menyalin public key ke laci server `~/.ssh/authorized_keys`.
4. **Act 4: Challenge-Response: Masuk Tanpa Ngetik Password**
   - Server melempar challenge terenkripsi, laptop membukanya pakai private key, pintu server langsung terbuka (Access Granted).
