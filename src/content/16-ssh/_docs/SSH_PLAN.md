# PLAN — 44 SSH: Masuk ke Komputer Jauh dengan Aman

| Item | Nilai |
|---|---|
| Content | 44 — SSH |
| Status | 📝 PLAN ONLY — jangan dieksekusi |
| Target audiens | Pemula Linux yang mulai mengenal server |
| Tujuan belajar | Memahami SSH sebagai koneksi terminal terenkripsi ke komputer jauh, serta pentingnya memeriksa tujuan dan identitas server |
| Prasyarat | 26 Terminal Navigation, 38 sudo, 81 Network Interface, 84 Network Ports |
| Scene shell | scene-ui V1, portrait 820 × 1340 |

## Audience promise

Setelah menonton, audiens memahami bahwa SSH membuka sesi terminal ke komputer jauh melalui jaringan, mengenkripsi komunikasi, dan memeriksa identitas server sebelum sesi dimulai.

## Identitas seri

| Field | Keputusan |
|---|---|
| Kategori | Linux Fundamentals |
| Title A | SSH — cyan atau blue |
| Title B | CONNECT — emerald |
| Subtitle | Terminal aman menuju komputer jauh |
| Tone | Terowongan terkunci antara laptop dan server, dengan pemeriksaan papan nama tujuan |
| Shell | Scene UI V1 dengan hero-to-header, empat Act, badge dan dot navigator |

## Batas akurasi dan keamanan

1. SSH adalah protokol untuk koneksi jarak jauh yang terenkripsi; bukan sekadar “terminal internet”.
2. Client perlu mengetahui host tujuan dan memeriksa host key/fingerprint ketika pertama terhubung.
3. Password dapat digunakan, tetapi SSH key dibahas khusus pada content 45.
4. Jangan menampilkan IP/domain nyata, kredensial nyata, private key, atau command yang menyertakan password.
5. Jangan menyarankan menonaktifkan host key checking atau menerima fingerprint tanpa verifikasi.
6. Port 22 adalah default umum, tetapi port dapat dikonfigurasi berbeda.

## Validasi analogi

SSH dianalogikan sebagai terowongan tertutup antara laptop dan gedung server. Sebelum masuk terowongan, laptop memeriksa papan nama/fingerprint gedung tujuan agar tidak masuk ke gedung palsu. Analogi menegaskan dua sifat penting: jalur terlindungi dan identitas tujuan perlu dicek.

## Storyboard empat Act

| Act | Setup → tegangan → titik balik → payoff | Konsep | Exit state |
|---|---|---|---|
| 1 — Tujuan jauh | Laptop ingin mengelola server jauh → jaringan publik terbuka → alamat server dan port ditentukan → tujuan koneksi jelas. | SSH client, host, port | Laptop dan server terlihat di dua sisi jaringan. |
| 2 — Periksa identitas | Laptop belum yakin server yang dihubungi benar → server mengirim host fingerprint → fingerprint dibandingkan → tujuan tervalidasi sebelum login. | host key/fingerprint | Server tepercaya ditandai. |
| 3 — Bentuk terowongan | Client dan server menyepakati kanal aman → garis publik berubah menjadi terowongan terkunci → input terminal masuk lewat kanal → isi tidak terbaca dari luar. | encrypted session | Sesi terenkripsi aktif. |
| 4 — Terminal jauh | Prompt server muncul di laptop → command aman seperti pwd menghasilkan output dari server → label remote shell jelas → audiens tahu terminal sedang bekerja di mesin jauh. | remote shell | Sesi aktif dan hasil command berasal dari server. |

## State contract

| State | Yang terlihat | Yang belum boleh terlihat | Pemicu | Hasil |
|---|---|---|---|---|
| Target | Laptop, server, host label, jaringan terbuka | Prompt remote | Act 1 | Tujuan koneksi jelas |
| Verify | Fingerprint server dan compare card | Terowongan aktif | Act 2 | Identitas server diperiksa |
| Tunnel | Kanal encrypted dan packet terminal | Output remote sebelum session | Act 3 | Jalur aman siap |
| Remote shell | Prompt server dan output pwd | Private key detail | Act 4 | Terminal remote dipahami |

## Continuity map

Laptop dan server building adalah anchor persisten dari Act 1 sampai Act 4. Host label muncul dekat server sejak Act 1. Fingerprint card lahir di Act 2, lalu berubah menjadi trusted marker yang tetap menempel pada server di Act 3–4. Jalur jaringan yang sama berubah dari garis publik menjadi terowongan; tidak dihapus lalu diganti tanpa handoff.

## Layout map V1

Semua koordinat berikut adalah local terhadap ContentBodyV1.

| Area | Local y | Isi |
|---|---:|---|
| Narration bubble | 35–115 | Caption pendek per beat |
| Laptop + client terminal | 155–405 | Anchor sisi kiri |
| Network tunnel | 445–600 | Jalur packet, fingerprint, atau terowongan |
| Server + identity marker | 640–820 | Anchor sisi kanan/bawah |
| Remote prompt / takeaway | 850–930 | Command aman dan ringkasan |

Jika laptop dan server disusun horizontal, hitung lebar dan gap sebelum coding. Semua child tetap dalam batas body; tidak ada body child pada local y negatif. Header dan navigator hanya dari Scene UI V1.

## Elemen visual dan aset

| Elemen | Bentuk | Perilaku |
|---|---|---|
| Laptop/client terminal | Inline SVG | Persistent, command diketik pada Act 4 |
| Server building | Inline SVG | Persistent, host label menempel |
| Host fingerprint card | Inline SVG | Lahir Act 2 lalu handoff menjadi trusted badge |
| Network path | Inline SVG line/tube | Morph dari publik ke encrypted tunnel |
| Terminal packet | Inline SVG capsule | Bergerak dalam jalur |
| Lock seal | Inline SVG | Menandai kanal terenkripsi |
| Remote prompt card | Inline SVG | Menunjukkan output berasal dari server |

First pass memakai inline SVG karena tunnel, fingerprint, packet, dan shell state berubah sepanjang cerita. Saat implementasi, tetap buat folder icons, icons.json, default-icon.png, serta loader fallback sesuai kontrak topic baru.

## Draft teks in-video

| Beat | Teks |
|---|---|
| Act 1 | Server berada di jaringan jauh |
| Act 1 | Host dan port menentukan tujuan |
| Act 2 | Fingerprint server diperiksa |
| Act 2 | Identitas tujuan tervalidasi |
| Act 3 | SSH membentuk kanal terenkripsi |
| Act 3 | Isi terminal terlindungi |
| Act 4 | Prompt kini milik server |
| Act 4 | Output datang dari server |
| Closing | Periksa tujuan sebelum masuk |

Teks produksi wajib deklaratif, singkat, tanpa emoji, tanpa kata ganti orang, dan tidak menduplikasi kalimat antara narration bubble serta terminal card.

## Audio beat map

| Momen | Candidate SFX | Catatan |
|---|---|---|
| Intro selesai | success/shimmer | Header compact selesai |
| Target host muncul | ui/pop | Penanda tujuan |
| Fingerprint compare | ui/tick | Satu atau dua beat, tidak beruntun rapat |
| Identity trusted | success/confirm | Payoff Act 2 |
| Tunnel terbentuk | transitions/light-swoosh-quick | Perubahan jalur |
| Lock seal | impacts/lock | Jalur encrypted aktif |
| Remote prompt muncul | ui/paper-arrive | Konteks shell baru |
| Takeaway | success/ding | Penutup |

Sebelum eksekusi, audit asset audio shared untuk semantik, loudness, provenance, serta kategori. Semua cue aktual harus terdaftar di SFX_MAP dan schedule export pada timestamp yang sama dengan timeline GSAP.

## Rencana file saat eksekusi

| File | Perubahan yang direncanakan |
|---|---|
| src/content/44-ssh/data.js | Viewport, PHASES, palette, host/fingerprint labels, captions, dan SFX_MAP. |
| src/content/44-ssh/manifest.js | Metadata Linux Fundamentals. |
| src/content/44-ssh/Animation.jsx | GSAP timeline, reset loop, Scene UI V1, persistent laptop/server, identity handoff, tunnel, dan remote shell. |
| src/content/44-ssh/caption.md | Caption sosial media di luar video. |
| src/content/44-ssh/icons/* | icons.json, fallback icon, loader, serta aset bila audit memerlukannya. |
| src/content/registry.js | Entry manifest coming-soon sesudah implementasi. |
| scripts/export-lib.js | Jadwal SFX sinkron. |

## Checklist eksekusi

- [ ] Kunci metadata dan title segments cyan/blue → emerald.
- [ ] Buat data.js sebelum Animation.jsx.
- [ ] Buat manifest, caption, dan kontrak folder icons.
- [ ] Gunakan satu IntroHeaderMorphV1 yang tetap mounted setelah morph.
- [ ] Gunakan ActBadgeNavigatorV1 dari satu array PHASES.
- [ ] Render seluruh visual di ContentBodyV1 local coordinate.
- [ ] Jadikan laptop, server, host label, dan trusted marker anchor sesuai continuity map.
- [ ] Handoff fingerprint card menuju trusted marker tanpa teleport.
- [ ] Morph jalur publik menuju tunnel, bukan mengganti jalur secara mendadak.
- [ ] Jangan gunakan alamat, password, atau key nyata dalam visual.
- [ ] Reset seluruh state pada repeat timeline.
- [ ] Wire SFX_MAP dan export schedule dengan kategori eksplisit.
- [ ] Audit dead field, teks in-video, collision, dan coverage SFX.
- [ ] Compile, preview intro/morph/semua Act/replay, lalu export MP4.

## Batasan

Content ini tidak membahas pembuatan SSH key, ssh-agent, config file, SCP/SFTP, tunneling port, maupun hardening server. SSH key dibahas pada content 45; port dibahas pada content 84; firewall dibahas pada content 46.


---

# Revisi Plan 2026-09-16 — Peta SSH dari Pemula sampai Pro

> Bagian ini menjadi sumber kebenaran baru bila bertentangan dengan batasan lama. Status tetap **plan only**: tidak ada koneksi SSH, command runnable, perubahan server, maupun implementasi animasi.

## 1. Hasil audit dan keputusan cakupan

Plan awal sudah baik untuk fondasi—tujuan host, host key, enkripsi, dan remote shell—tetapi baru menjelaskan satu kemampuan SSH. SSH juga menjadi transport aman untuk eksekusi remote, transfer file, forwarding, akses melalui bastion, dan otomasi. Di sisi server, ia berkaitan dengan kebijakan autentikasi, otorisasi, audit, dan pembatasan akses.

Satu video tidak boleh berpura-pura dapat mengajari setiap konfigurasi SSH dengan aman. Content 44 harus menjadi **peta mental lengkap**: memperlihatkan kemampuan, tujuan, risiko, dan batas tanggung jawabnya. Tutorial praktis dapat mengambil satu kapabilitas saja sebagai content lanjutan.

## 2. Model mental yang dikunci

| Komponen | Peran | Yang perlu dipahami |
|---|---|---|
| SSH client | Aplikasi di perangkat asal yang meminta koneksi atau transport. | Client mengetahui tujuan dan aturan koneksi. |
| SSH server atau sshd | Layanan di komputer tujuan yang menerima dan membatasi koneksi. | Server memutuskan siapa yang boleh masuk dan apa yang diizinkan. |
| Network path | Jaringan di antara client dan server. | Jaringan dapat tidak tepercaya; isi sesi dilindungi enkripsi. |
| Host identity | Host key, known-hosts, atau trust policy. | Client perlu memverifikasi server terutama pada koneksi pertama/perubahan identitas. |
| User identity | Password, SSH key, certificate, hardware-backed key, atau MFA. | Identitas user berbeda dari identitas server. |
| Authorization | Hak user dan aturan server setelah autentikasi. | Berhasil masuk tidak berarti boleh melakukan semua hal. |

Narasi wajib membedakan:

1. Apakah ini benar server yang dituju? — host verification.
2. Apakah user ini benar identitasnya? — authentication.
3. Apa yang boleh dilakukan user ini? — authorization.

Enkripsi menjaga isi perjalanan data, tetapi tidak otomatis menjawab tiga pertanyaan itu atau menggantikan kebijakan akses.

## 3. Peta kemampuan SSH

| Kemampuan | Kegunaan | Level | Risiko atau batas penting |
|---|---|---|---|
| Remote interactive shell | Mengelola komputer jauh lewat terminal. | Beginner | Prompt harus jelas remote; hak akses mengikuti akun server. |
| Remote command execution | Menjalankan satu tugas dan menerima output/exit status. | Beginner–intermediate | Input tak tepercaya tidak boleh disisipkan ke perintah remote. |
| Remote script/automation | Menjalankan workflow antar mesin. | Intermediate | Butuh idempotensi, log, timeout, error handling, serta identitas yang dibatasi. |
| Secure file transfer | Memindahkan file via SCP, SFTP, atau rsync over SSH. | Beginner–intermediate | Hak akses, overwrite, integritas, dan jalur file tetap penting. |
| SFTP subsystem | Akses file model client–server, termasuk aplikasi GUI. | Beginner–intermediate | Bukan remote shell; dapat dibatasi ke direktori tertentu. |
| Local port forwarding | Port lokal menerus ke layanan yang terjangkau dari sisi server. | Intermediate | Bind address harus disengaja agar layanan tidak terekspos keliru. |
| Remote port forwarding | Port server menerus balik ke layanan di sisi client. | Intermediate–advanced | Dapat mengekspos layanan client ke jaringan server. |
| Dynamic forwarding | Proxy SOCKS lokal bagi aplikasi yang mendukungnya. | Advanced | Bukan VPN penuh; scope aplikasi dan DNS perlu dipahami. |
| Jump host / bastion | Mencapai host privat melalui host perantara. | Intermediate | Tidak boleh melemahkan verifikasi host akhir. |
| Connection multiplexing | Memakai koneksi utama untuk sesi berikutnya. | Advanced | Mempercepat workflow, tetapi lifecycle dan isolasi tetap penting. |
| Agent forwarding | Host perantara memakai agent client untuk hop lanjutan. | Advanced | Sangat selektif; host perantara bisa meminta penggunaan identitas agent. |
| X11/GUI forwarding | Menampilkan aplikasi grafis remote. | Advanced/legacy | Berat dan berisiko; bukan solusi default desktop remote. |
| Restricted service account | Transfer/deploy tanpa shell penuh. | Advanced/server admin | Perlu scope filesystem, command, dan forwarding yang dibatasi. |

Kalimat pengikat: **SSH adalah transport aman yang dapat membawa shell, file, atau koneksi aplikasi; tiap mode memiliki arah aliran dan risiko berbeda.**

## 4. Tangga pengetahuan beginner → pro

| Level | Harus kuasai | Belum perlu dilakukan |
|---|---|---|
| Beginner | Client vs server, host/user/port, host verification, remote prompt, logout, local versus remote filesystem. | Config kompleks, forwarding, agent, atau hardening server. |
| Early intermediate | SSH key sebagai identitas user, known-hosts, host alias, SCP/SFTP/rsync, remote command terukur. | Menyebarkan private key atau menonaktifkan password tanpa recovery plan. |
| Intermediate | Jump host, forwarding, TTY versus non-interactive execution, exit code dan logging otomasi. | Agent forwarding global atau tunnel publik tanpa owner/policy. |
| Advanced operator | Certificate/CA, hardware-backed key, rotation, multiplexing, ProxyJump, service account terbatas, audit trail. | Menganggap SSH cukup untuk seluruh kontrol keamanan jaringan. |
| Server/security pro | sshd policy, MFA/PAM, firewall/rate-limit, central logging, incident response, inventory/revocation. | Mengubah produksi tanpa uji, akses break-glass, monitoring, dan rollback plan. |

## 5. Autentikasi, trust, dan otorisasi

| Lapisan | Opsi/konsep | Caveat |
|---|---|---|
| Identitas server | Host key fingerprint, known-hosts, host certificate/CA. | Fingerprint baru/berubah harus diverifikasi lewat jalur independen. |
| Identitas user | Password, public key, SSH certificate, security key/FIDO, MFA. | Private key tetap rahasia; public key memang didaftarkan ke server. |
| Key dan agent | Key passphrase, ssh-agent, hardware-backed key. | Agent memudahkan penggunaan key tetapi menambah permukaan risiko; forwarding sangat selektif. |
| Otorisasi akun | User/group, permission, allowed users/groups, shell/subsystem, forced command. | Authentication sukses tidak memberi hak lebih dari kebijakan akun. |
| Otorisasi koneksi | Source network, forwarding policy, bastion policy, time/window policy. | Akses dapat dibatasi lebih jauh dari sekadar akun boleh login. |

Content 45 tetap fokus pada SSH key. Content 44 hanya menempatkan key di peta autentikasi agar penonton memahami kelanjutannya.

## 6. Transfer file

| Mekanisme | Model mental | Cocok untuk | Perhatian |
|---|---|---|---|
| SCP | Salin file lewat transport SSH. | Penyalinan sederhana yang terkontrol. | Tujuan, overwrite, dan aturan server tetap berlaku. |
| SFTP | Protokol operasi file melalui subsystem SSH. | Browser file, upload/download, integrasi tool. | Tidak sama dengan mount filesystem remote. |
| rsync over SSH | Sinkronisasi delta dengan SSH sebagai transport. | Deploy atau backup yang dirancang baik. | Aturan delete, source/destination, dan dry-run perlu materi khusus. |
| SSHFS | Filesystem remote yang dimount melalui SSH. | Workflow tertentu yang membutuhkan akses file jarak jauh. | Latensi, locking, dan semantik filesystem dapat berbeda. |

Satu file capsule melewati channel yang sama, lalu bercabang ke empat model. Shell tidak perlu tampil untuk menjelaskan transfer file.

## 7. Forwarding dan tunnel

Forwarding mudah disalahpahami. Visual tidak boleh hanya mengatakan “membuka port”; ia wajib memperlihatkan **siapa yang mendengarkan** dan **ke mana trafik akhirnya pergi**.

| Mode | Listener berada di | Trafik menuju | Risiko utama |
|---|---|---|---|
| Local forwarding | Mesin client. | Layanan yang dapat dijangkau dari sisi server. | Layanan remote dapat terakses proses/jaringan lokal yang tidak dimaksud. |
| Remote forwarding | Mesin server. | Layanan yang dapat dijangkau dari sisi client. | Layanan client dapat terekspos di jaringan server. |
| Dynamic forwarding | Mesin client sebagai proxy SOCKS. | Tujuan yang dipilih aplikasi melalui server. | Bukan VPN penuh; scope aplikasi dan DNS perlu dipahami. |
| Unix socket forwarding | Socket lokal/remote, bukan port TCP. | Layanan berbasis socket. | Izin socket dan ownership tetap menentukan akses. |

Forwarding hanya dijelaskan sebagai kapabilitas. Plan ini tidak memuat sintaks, tidak menyarankan bind ke semua jaringan, dan tidak menjadikan tunnel cara melewati kebijakan organisasi.

## 8. Operasi, config, dan otomasi

| Area | Yang perlu diketahui | Batas aman materi |
|---|---|---|
| Client config | Alias host, user, port, identity, jump host, aturan per-host mengurangi salah ketik. | Config adalah deklarasi koneksi; jangan tampilkan secret atau config produksi. |
| Non-interactive mode | Automation perlu input deterministik, exit status, timeout, dan error reporting. | Jangan mengirim password dari skrip atau menjalankan tugas destruktif. |
| TTY dan environment | Shell interaktif berbeda dengan remote task tanpa TTY; PATH, locale, dan startup dapat berbeda. | Jangan mengandalkan profile interaktif untuk automation. |
| Multiplexing | Sesi berikutnya dapat memakai koneksi awal yang masih hidup. | Hanya konsep optimasi, dengan lifecycle koneksi jelas. |
| Logging | Client/server log memberi bukti koneksi, kegagalan, dan audit. | Metadata log bisa sensitif dan aksesnya perlu dibatasi. |

## 9. Keamanan server dan operasi pro

| Domain | Yang dipetakan | Prinsip |
|---|---|---|
| Attack surface | Patch server, inventaris akun, port/service exposure, firewall, rate limit. | Kurangi akses tak perlu; port non-default bukan kontrol utama. |
| Authentication policy | Public key/certificate, MFA bila perlu, password policy, root login policy. | Kebijakan harus sesuai risiko dan punya jalur pemulihan. |
| Authorization | Least privilege, akun individual, group policy, restricted account, forced command, forwarding policy. | Jangan memakai akun admin bersama demi kemudahan. |
| Key lifecycle | Owner, expiry, rotation, revocation, offboarding, hardware-backed identity. | Key adalah kredensial bernilai tinggi. |
| Trust lifecycle | Known-hosts hygiene, host-key rotation, host certificate/CA pada skala besar. | Perubahan identitas host memerlukan proses verifikasi. |
| Bastion | Segmentasi, MFA, session logging/recording, akses just-in-time. | Bastion memperjelas kontrol, bukan hanya hop tambahan. |
| Observability/IR | Alert anomali, korelasi user-source-host, revoke key, disable account, periksa log. | Rencana respons dibuat sebelum insiden. |

## 10. Storyboard revisi: tujuh Act

| Act | Pertanyaan | Visual utama | Konsep pulang |
|---|---|---|---|
| 1 — Siapa berbicara? | “Apa itu SSH?” | Client, network, sshd server, host/user/port. | SSH menghubungkan client ke layanan server jauh. |
| 2 — Bisakah server dipercaya? | “Apakah tujuan benar?” | Host key dibandingkan dengan known-hosts. | Verifikasi server mendahului login. |
| 3 — Siapa user dan apa haknya? | “Boleh masuk, lalu boleh apa?” | Identity melewati policy gate menjadi shell, SFTP-only, atau restricted task. | Auth dan authorization berbeda. |
| 4 — Shell, command, dan file | “Apa yang dibawa kanal?” | Channel bercabang ke shell, remote task, SCP/SFTP/rsync/SSHFS. | SSH membawa lebih dari terminal. |
| 5 — Arahkan koneksi aplikasi | “Bagaimana tunnel bekerja?” | Local, remote, dynamic, dan socket forwarding dengan listener/tujuan jelas. | Arah forwarding menentukan risiko. |
| 6 — Akses jaringan kompleks | “Bagaimana mencapai host privat?” | Bastion, jump host, alias config, reuse connection. | Infrastruktur rapi mengurangi salah tujuan. |
| 7 — Operasikan dengan aman | “Apa yang diperlukan di skala besar?” | Key lifecycle, policy, logging, monitoring, revoke path. | SSH aman = protokol + operasi. |

Target satu video 100–120 detik, atau pecah menjadi seri. Jika batas format sekitar 60 detik, Act 1–4 adalah Content 44 inti dan Act 5–7 menjadi content lanjutan. Tunnel/hardening tidak boleh dipadatkan menjadi label dekoratif.

## 11. Copy dan continuity

Anchor persisten: client, server, encrypted channel, host identity marker, dan user identity card. Channel yang sama berubah fungsi melalui handoff: shell packet → file capsule → application connection. Tidak ada mode sebagai ikon lepas tanpa jalur yang jelas.

| Beat | Copy |
|---|---|
| Target | `Client menghubungi SSH server` |
| Trust | `Host key memeriksa identitas server` |
| Identity | `User login dan hak akses berbeda` |
| Channel | `Kanal terenkripsi membawa beberapa jenis data` |
| File | `File dapat dipindahkan lewat SSH` |
| Forwarding | `Arah listener menentukan risiko tunnel` |
| Bastion | `Jump host membantu mencapai jaringan privat` |
| Operations | `Key, policy, dan log menjaga akses` |
| Closing | `Enkripsi penting, verifikasi dan policy juga` |

## 12. Acceptance criteria implementasi nanti

- [ ] Membedakan host verification, user authentication, dan authorization secara eksplisit.
- [ ] Menjelaskan shell, remote command, serta transfer file sebagai mode SSH yang berbeda.
- [ ] Menampilkan SCP, SFTP, rsync-over-SSH, dan SSHFS secara proporsional tanpa menyamakannya.
- [ ] Menggambar local, remote, dynamic, dan Unix-socket forwarding dengan listener serta tujuan yang benar.
- [ ] Menyebut jump host/bastion, config alias, non-interactive automation, dan multiplexing sebagai konsep intermediate/advanced.
- [ ] Memetakan hardening server, policy, key lifecycle, logging, serta incident response sebagai domain operator/pro.
- [ ] Tidak ada command runnable, credential, host nyata, private key, atau saran mematikan host checking.
- [ ] Tidak ada klaim bahwa SSH, perubahan port, atau enkripsi saja menjamin keamanan.
- [ ] Bila dibuat satu video, storyboard tetap terbaca; bila tidak, dipecah menjadi seri dengan urutan Act yang sama.

## 13. Rencana pecahan seri bila materi perlu diproduksi

| Content lanjutan yang diusulkan | Fokus |
|---|---|
| 44a — SSH Foundations | Client/server, host trust, auth versus authorization, remote shell. |
| 44b — SSH Transfer and Automation | SCP/SFTP/rsync/SSHFS, remote command, non-interactive workflow, exit status. |
| 44c — SSH Tunnels and Bastions | Local/remote/dynamic/socket forwarding, jump host, ProxyJump, risiko agent forwarding. |
| 44d — SSH Server Operations | sshd policy, accounts, certificates, MFA, logging, key lifecycle, incident response. |

Rencana file implementasi yang sudah ada tetap hanya rencana. Dokumen ini tidak mengubah Animation, data, manifest, caption, registry, asset, atau koneksi sistem apa pun.
