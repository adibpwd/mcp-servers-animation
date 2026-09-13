# PLAN — 48 Shell, Terminal, dan Command Line

| Item | Nilai |
|---|---|
| Content | 48 — Shell, Terminal, and Command Line |
| Status | 📝 PLAN ONLY — jangan dieksekusi |
| Target audiens | Pemula Linux dan pengguna yang sering menyamakan tiga istilah ini |
| Tujuan belajar | Membedakan terminal sebagai jendela, shell sebagai penerjemah, dan command line sebagai cara memasukkan perintah |
| Prasyarat | 26 Terminal Navigation; 44 SSH sebagai penguat konteks terminal lokal/remote |
| Scene shell | scene-ui V1, portrait 820 × 1340 |

## Audience promise

Setelah menonton, audiens dapat menjelaskan bahwa terminal bukan shell: terminal menampilkan interaksi, command line menerima teks perintah, dan shell membaca serta menjalankan perintah ke sistem.

## Identitas seri

| Field | Keputusan |
|---|---|
| Kategori | Linux Fundamentals |
| Title A | SHELL — cyan atau blue |
| Title B | EXPLAINED — emerald |
| Subtitle | Terminal, command line, dan penerjemah |
| Tone | Loket pesan: jendela menerima pesan, penerjemah memahami pesan, sistem menjalankan tugas |
| Shell | Scene UI V1 dengan hero-to-header, empat Act, badge dan dot navigator |

## Batas akurasi

1. Terminal emulator adalah aplikasi/jendela yang menampilkan input dan output berbasis teks.
2. Shell adalah program yang mengurai perintah dan meminta sistem menjalankannya; Bash adalah salah satu contoh shell.
3. Command line adalah antarmuka atau baris teks tempat perintah diketik, bukan aplikasi terpisah yang selalu sama dengan terminal.
4. Jangan menyatakan semua terminal selalu memakai Bash; zsh, fish, dan shell lain ada.
5. Jangan masuk ke parsing shell, environment variable, pipe, atau scripting detail; materi tersebut berada pada content 49, 51–59.

## Validasi analogi

Terminal dianalogikan sebagai jendela/loket tempat pesan terlihat. Command line adalah kolom pesan yang diketik. Shell adalah penerjemah di belakang loket yang membaca maksud perintah lalu meneruskannya ke sistem. Sistem bukan shell; ia adalah pelaksana yang menjalankan tugas. Analogi ini menjaga batas peran setiap komponen.

## Storyboard empat Act

| Act | Setup → tegangan → titik balik → payoff | Konsep | Exit state |
|---|---|---|---|
| 1 — Tiga istilah | Tiga label sering dianggap satu benda → tiga kartu muncul dengan bentuk serupa → peran masing-masing diberi warna → perbedaan mulai terlihat. | terminal, command line, shell | Tiga komponen siap dijelaskan. |
| 2 — Terminal | Jendela hitam menerima teks dan menampilkan hasil → terminal card dibuka → input/output terlihat di layar → terminal adalah tempat interaksi terlihat. | terminal emulator | Terminal menjadi frame persisten. |
| 3 — Shell | Perintah pwd masuk dari command line → shell Bash membaca token perintah → panah menuju system task → shell adalah penerjemah. | shell/Bash | Perintah diterjemahkan, belum ditampilkan hasil final. |
| 4 — Command line | Hasil path kembali ke terminal → command line ditandai sebagai baris yang menerima input → rangkaian input → shell → output tersambung → ketiganya dipahami sebagai satu alur. | command line flow | Diagram lengkap dan takeaway tampil. |

## State contract

| State | Yang terlihat | Yang belum boleh terlihat | Pemicu | Hasil |
|---|---|---|---|---|
| Labels | Tiga card peran | Alur command berjalan | Act 1 | Nama tidak lagi dianggap sinonim |
| Terminal | Window input/output | Shell parsing detail | Act 2 | Peran terminal jelas |
| Shell | Bash interpreter menerima pwd | Output path | Act 3 | Peran shell jelas |
| Flow | Command line → shell → system → terminal output | Materi scripting | Act 4 | Hubungan lengkap terlihat |

## Continuity map

Terminal window adalah anchor dari Act 2 sampai Act 4. Command line tetap berada di bagian bawah terminal; ia tidak menjadi terminal baru. Shell Bash card muncul di Act 3, lalu tetap berada di antara command line dan system node pada Act 4. Satu command pwd bergerak melalui semua node dan kembali sebagai output path sehingga alurnya tidak teleport.

## Layout map V1

Semua koordinat adalah local terhadap ContentBodyV1.

| Area | Local y | Isi |
|---|---:|---|
| Narration bubble | 35–115 | Caption per beat |
| Role cards | 150–275 | Terminal, command line, shell |
| Terminal anchor | 315–595 | Jendela input/output |
| Interpreter/system lane | 635–785 | Shell Bash dan node system |
| Flow takeaway | 830–930 | Diagram lengkap dan ringkasan |

Role cards disusun horizontal hanya jika perhitungan lebar aman; jika tidak, gunakan grid dua baris. Terminal besar tidak boleh menabrak interpreter lane. Semua child body memakai local y positif.

## Elemen visual dan aset

| Elemen | Bentuk | Perilaku |
|---|---|---|
| Role cards | Inline SVG cards | Act 1, lalu ringkas pada Act 4 |
| Terminal window | Inline SVG | Persistent Act 2–4 |
| Command line bar | Inline SVG input row | Persistent di dalam terminal |
| Shell/Bash interpreter | Inline SVG speech/parser card | Menerima command Act 3 |
| System task node | Inline SVG gear/task card | Mengembalikan hasil pwd |
| Command packet | Inline SVG capsule | Bergerak command line → shell → system → output |
| Flow arrows | Inline SVG paths | Menyala seiring perjalanan |

First pass memakai inline SVG karena packet dan node flow memerlukan animasi internal. Saat implementasi, buat folder icons, icons.json, default-icon.png, serta loader fallback sesuai kontrak topic baru.

## Draft teks in-video

| Beat | Teks |
|---|---|
| Act 1 | Tiga istilah punya peran |
| Act 1 | Nama bukan fungsi yang sama |
| Act 2 | Terminal menampilkan interaksi |
| Act 2 | Input dan output terlihat |
| Act 3 | Shell membaca perintah |
| Act 3 | Bash adalah contoh shell |
| Act 4 | Command line menerima teks |
| Act 4 | Sistem mengirim hasil kembali |
| Closing | Terminal bukan shell |

Teks produksi wajib deklaratif, singkat, tanpa emoji, tanpa kata ganti orang, serta tidak diduplikasi persis antara narration bubble dan visual card.

## Audio beat map

| Momen | Candidate SFX | Catatan |
|---|---|---|
| Header compact selesai | success/shimmer | Penanda intro |
| Role card muncul | ui/pop dan ui/pop-2 | Stagger ringan |
| Terminal terbuka | ui/paper-open | Act 2 |
| Command diketik | sfx/typing atau ui/tick | Audit loudness dahulu |
| Packet masuk shell | impacts/connector-snap | Peralihan input ke interpreter |
| System mengembalikan output | transitions/light-swoosh-quick | Arah pulang jelas |
| Output path muncul | success/ding | Payoff |

Sebelum eksekusi, audit asset audio shared untuk semantik, loudness, provenance, dan kategori. Semua cue aktual wajib masuk SFX_MAP dan export schedule pada waktu yang sama dengan timeline.

## Rencana file saat eksekusi

| File | Perubahan yang direncanakan |
|---|---|
| src/content/48-shell-terminal-command-line/data.js | Viewport, PHASES, palette, labels, command/output text, captions, dan SFX_MAP. |
| src/content/48-shell-terminal-command-line/manifest.js | Metadata Linux Fundamentals. |
| src/content/48-shell-terminal-command-line/Animation.jsx | GSAP timeline, reset loop, Scene UI V1, terminal anchor, interpreter, packet, dan flow path. |
| src/content/48-shell-terminal-command-line/caption.md | Caption sosial media di luar video. |
| src/content/48-shell-terminal-command-line/icons/* | icons.json, fallback icon, loader, serta aset jika audit memerlukannya. |
| src/content/registry.js | Entry manifest coming-soon sesudah implementasi. |
| scripts/export-lib.js | Jadwal SFX sinkron. |

## Checklist eksekusi

- [ ] Kunci metadata dan title segments cyan/blue → emerald.
- [ ] Buat data.js sebelum Animation.jsx.
- [ ] Buat manifest, caption, dan kontrak folder icons.
- [ ] Gunakan satu IntroHeaderMorphV1 yang tetap mounted setelah morph.
- [ ] Gunakan ActBadgeNavigatorV1 dari satu array PHASES.
- [ ] Render semua visual dalam ContentBodyV1 local coordinate.
- [ ] Jadikan terminal, command line bar, dan shell card anchor sesuai continuity map.
- [ ] Gerakkan satu command pwd dari input ke shell, system, lalu output tanpa teleport.
- [ ] Jangan menyamakan terminal dengan Bash atau command line dalam teks/visual.
- [ ] Reset semua state pada repeat timeline.
- [ ] Wire SFX_MAP serta export schedule dengan kategori eksplisit.
- [ ] Audit dead field, teks in-video, collision, dan coverage SFX.
- [ ] Compile, preview intro/morph/semua Act/replay, lalu export MP4.

## Batasan

Content ini tidak membahas syntax Bash, environment variable, redirection, pipe, alias, scripting, atau shell remote secara mendalam. Bash dibahas pada content 49; redirect pada content 51; pipe pada content 52; SSH pada content 44.
