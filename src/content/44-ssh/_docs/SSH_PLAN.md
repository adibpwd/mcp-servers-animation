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
