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


---

# Revisi Plan 2026-09-16 — Peta Shell dari Fondasi sampai Scripting

> Bagian ini menggantikan batas konsep, storyboard, dan acceptance criteria lama
> bila ada perbedaan. Status tetap **plan only**: tidak ada perintah runnable,
> script, perubahan profile, build, atau implementasi animasi.

## 1. Hasil audit dan keputusan cakupan

Plan awal sudah tepat untuk membedakan terminal, command line, dan shell, tetapi
belum cukup menjawab “apa yang sebenarnya dikerjakan shell?” Shell bukan hanya
penerjemah satu command. Ia mengelola input interaktif, parsing, expansion,
pencarian executable, environment, redirection, pipeline, job control, exit
status, konfigurasi, dan scripting.

Tidak aman maupun realistis memasukkan semua detail itu menjadi satu tutorial
singkat. Content 48 harus menjadi **peta mental shell** dengan urutan belajar
yang jelas. Materi mendalam tetap dipecah agar pemula tidak menghafal sintaks
tanpa memahami model eksekusinya.

## 2. Empat istilah yang tidak boleh tertukar

| Istilah | Definisi | Bukan berarti |
|---|---|---|
| Terminal emulator | Aplikasi yang menggambar jendela teks dan meneruskan input/output melalui pseudo-terminal. | Shell, prompt, atau semua hal yang diketik di dalamnya. |
| Command line / CLI | Antarmuka teks dan bentuk input berbasis baris. | Satu aplikasi atau satu bahasa tertentu. |
| Shell | Program command interpreter yang membaca input, mengurai, lalu mengatur proses dan I/O. | Sistem operasi, terminal emulator, atau selalu Bash. |
| TTY / PTY | Kanal terminal; PTY biasanya pasangan virtual antara terminal emulator dan program shell. | Sekadar nama lain untuk jendela terminal. |

Tambahan penting: terminal emulator dapat menjalankan shell yang berbeda; shell
dapat berjalan tanpa terminal dalam script atau otomasi; dan aplikasi lain juga
dapat menyediakan CLI tanpa menjadi shell penuh.

## 3. Peta arsitektur input sampai output

```
Terminal emulator → PTY → shell → parsing/expansion → builtin atau executable
                 ← I/O ← process + filesystem + kernel
```

| Lapisan | Peran | Bukti visual yang disarankan |
|---|---|---|
| Terminal emulator | Menampilkan prompt, input, output, warna, dan shortcut. | Window terminal yang persistent. |
| PTY | Jalur karakter dan terminal semantics antara emulator dan shell/program. | Kabel virtual tipis, bukan node “sistem”. |
| Shell | Membaca baris dan menentukan langkah berikutnya. | Hub shell persistent. |
| Parser/expander | Mengurai kata/operator serta melakukan expansion sesuai aturan shell. | Conveyor berurutan; bukan satu kotak “magic”. |
| Builtin | Perintah yang ditangani shell sendiri, misalnya perubahan directory atau variable. | Jalur pendek yang tidak perlu proses eksternal. |
| External executable | Program yang dicari, biasanya melalui PATH, lalu dijalankan sebagai process. | Kartu executable lahir dari PATH map. |
| Kernel dan resources | Menjalankan process serta menghubungkan file, device, network, dan memory. | Node sistem menerima process. |
| Standard streams | stdin, stdout, stderr yang membawa data masuk, hasil biasa, dan error. | Tiga jalur berlabel berbeda. |

## 4. Apa saja yang shell lakukan

| Kemampuan | Penjelasan konseptual | Level | Content lanjutan yang sesuai |
|---|---|---|---|
| Prompt dan input interaktif | Membaca command line, history, editing, completion, dan feedback. | Beginner | 48 / shell UX lanjutan. |
| Working directory | Shell menyimpan current directory; builtin diperlukan karena directory milik shell harus berubah. | Beginner | Navigasi filesystem. |
| Command lookup | Membedakan keyword, alias, function, builtin, dan executable yang ditemukan lewat PATH. | Beginner–intermediate | PATH dan command lookup. |
| Parsing | Memahami operator, word boundaries, quoting, dan struktur command. | Intermediate | Bash syntax. |
| Expansion | Parameter, command substitution, arithmetic, pathname/glob, brace, dan tilde expansion bergantung shell. | Intermediate | Expansion dan quoting. |
| Environment | Menurunkan environment ke child process; variable shell tidak selalu otomatis menjadi environment. | Intermediate | Environment/PATH. |
| Streams dan redirection | Mengatur stdin, stdout, stderr ke file, device, atau process lain. | Intermediate | Content 51. |
| Pipeline | Mengalirkan stdout sebuah process ke stdin process berikutnya. | Intermediate | Content 52. |
| Exit status dan condition | Nilai hasil process memandu chaining, condition, dan automation. | Intermediate | Control flow/error handling. |
| Job control | Menjalankan foreground/background, suspend/resume, dan mengelola process group pada sesi interaktif. | Intermediate–advanced | Process & job control. |
| Functions, aliases, completion | Membuat shortcut dan reusable behavior pada scope shell. | Intermediate | Shell productivity. |
| Scripting | Menjalankan file shell dengan variables, conditions, loops, functions, error policy, dan traps. | Advanced | Shell scripting series. |
| Portability | Perbedaan POSIX shell dan extension Bash/zsh/fish/dash. | Advanced | Portable scripting. |

## 5. Shell yang perlu dikenal

| Shell | Posisi dan karakter | Pesan untuk pemula |
|---|---|---|
| sh / POSIX shell | Nama antarmuka standar; pada sistem tertentu mengarah ke shell implementasi tertentu. | Jangan menganggap `sh` selalu Bash. |
| Bash | Shell populer dengan scripting dan interactive feature luas. | Satu contoh shell, bukan definisi shell. |
| zsh | Shell interaktif kaya fitur dan sering dipasangkan dengan framework prompt/completion. | Konfigurasi dan compatibility dapat berbeda dari Bash. |
| fish | Mengutamakan UX interaktif dan sintaks yang sengaja berbeda dari POSIX/Bash. | Script fish tidak otomatis portable ke shell lain. |
| dash / ash | Shell ringan, kerap dipakai untuk tugas sistem atau lingkungan minimal. | Feature interaktif/scripting tidak selalu sama dengan Bash. |
| ksh | Keluarga shell berpengaruh dengan variasi implementasi. | Pilihan shell mengikuti sistem dan kebutuhan tim. |

Tidak perlu membuat ranking. Pemilihan shell dipengaruhi portability script,
standar proyek, kebutuhan interaktif, dan default distribusi.

## 6. Lifecycle satu command

| Tahap | Apa yang diperiksa shell | Salah paham yang dicegah |
|---|---|---|
| Read | Baris input atau statement script dibaca. | Terminal tidak “menjalankan” teks sendiri. |
| Parse | Kata, operator, quotes, grouping, dan struktur dibentuk. | Spasi dan operator tidak selalu diperlakukan sebagai teks biasa. |
| Expand | Variable, glob, substitution, atau expansion lain diterapkan sesuai aturan shell. | Shell tidak mengganti semua teks dengan urutan sembarang. |
| Resolve | Shell menentukan apakah nama itu alias/function/builtin/executable. | Semua command bukan executable file eksternal. |
| Prepare I/O | Redirection, pipeline, heredoc, dan file descriptor disiapkan bila diminta. | Output biasa dan error bukan satu jalur yang sama. |
| Execute | Builtin berjalan di shell atau external program dibuat sebagai process. | Builtin yang mengubah shell tidak dapat diperlakukan persis seperti child process. |
| Wait / job control | Shell menunggu foreground job atau mengelola background job. | Background bukan berarti task pasti sukses. |
| Collect result | Output ditampilkan/diteruskan dan exit status disimpan. | Ada output bukan bukti bahwa command sukses. |

Urutan detail expansion berbeda menurut shell dan konstruknya. Visual harus
menyatakan model umum, bukan mengklaim satu urutan Bash sebagai hukum semua
shell.

## 7. Tiga streams dan dataflow

| Stream | Arah default | Peran |
|---|---|---|
| stdin | Masuk ke program | Data atau input yang diterima program. |
| stdout | Keluar ke terminal/pipeline/file | Hasil normal yang dapat diteruskan. |
| stderr | Keluar ke terminal/pipeline/file sesuai aturan | Pesan error/diagnostik, dipisahkan dari hasil normal. |

Redirection dan pipe adalah perubahan rute stream, bukan “fitur terminal”.
Terminal hanya salah satu tujuan/sumber default. File descriptor lebih lanjut,
here-document, process substitution, dan tee layak berada pada materi
lanjutan setelah model tiga stream dipahami.

## 8. Interactive shell, login shell, dan non-interactive shell

| Mode | Tujuan | Dampak pembelajaran |
|---|---|---|
| Interactive | Menerima input pengguna, memiliki prompt, history, editing, dan job control. | Fokus awal Content 48. |
| Login | Shell awal pada sesi login yang dapat membaca konfigurasi khusus login. | Jangan mengandalkan file startup tertentu tanpa tahu mode sesi. |
| Non-interactive | Menjalankan script atau command terarah tanpa prompt manusia. | Automation harus eksplisit tentang environment, input, exit status, dan error. |
| Remote shell | Shell di host lain yang dibawa koneksi remote. | Terminal lokal dapat menampilkan shell remote; terminal dan shell tetap berbeda. |

File startup dan nama tepatnya sangat tergantung shell dan sistem. Plan ini
hanya mengenalkan alasannya: konfigurasi dapat menyebabkan perilaku command
berbeda antara terminal baru, login, dan script.

## 9. Shell scripting dan reliability

| Topik | Mengapa penting | Guardrail |
|---|---|---|
| Shebang/interpreter choice | Menentukan interpreter yang diharapkan untuk script. | Bahasa script harus cocok dengan shell yang ditargetkan. |
| Variables dan scope | Data lokal shell, environment child, dan scope function tidak sama. | Quote data; jangan perlakukan input sebagai code. |
| Conditions/loops/functions | Membentuk workflow berulang dan dapat diuji. | Pecah tugas besar menjadi fungsi jelas. |
| Exit status | Menentukan sukses/gagal untuk control flow dan caller. | Selalu rancang error path, bukan hanya happy path. |
| Error policy | Perilaku terhadap failure, unset data, dan pipeline perlu sengaja dipilih. | Jangan menganggap satu opsi error handling menyelesaikan semua kasus. |
| Traps/cleanup | Menangani signal/exit untuk melepas resource sementara. | Cleanup harus aman bila dijalankan lebih dari sekali. |
| Quoting/escaping | Memisahkan data dari syntax shell. | Ini adalah pertahanan utama terhadap word splitting, glob tak sengaja, dan injection. |
| Portability | POSIX versus feature spesifik shell. | Tetapkan target shell sebelum memakai syntax. |
| Testing/linting | Memeriksa parsing dan perilaku dalam lingkungan terkontrol. | Tidak menggantikan test dengan data nyata/berisiko. |

## 10. Keamanan dan pitfall yang wajib tampil

| Risiko | Mengapa terjadi | Pesan aman |
|---|---|---|
| Shell injection | Data tak tepercaya diperlakukan sebagai syntax. | Hindari membangun command sebagai teks; quote dan gunakan interface terstruktur bila tersedia. |
| Word splitting/globbing | Data tanpa quote dapat berubah menjadi banyak argumen atau nama file. | Data harus diperlakukan sebagai data. |
| PATH hijacking | Nama executable bisa merujuk ke program yang tidak dimaksud. | Pahami asal command dan PATH, khususnya pada automation/admin. |
| Alias/function shadowing | Nama yang sama dapat berarti hal berbeda di shell berbeda. | Gunakan inspeksi command dan lingkungan yang konsisten. |
| Secret leakage | History, environment, process list, log, atau output dapat menyimpan secret. | Jangan menaruh secret pada command line atau profile sembarang. |
| Unsafe cleanup/redirection | Wildcard atau target salah dapat mengubah/menghapus data keliru. | Validasi target dan pisahkan dry-run/test dari operasi nyata. |
| Startup file side effect | Profile dapat mengubah PATH, alias, prompt, atau menjalankan program. | Review konfigurasi sebagai code. |
| Privilege confusion | Shell yang berjalan sebagai admin memperbesar dampak kesalahan. | Least privilege dan scope task kecil. |

## 11. Storyboard revisi: enam Act

| Act | Pertanyaan | Visual utama | Konsep pulang |
|---|---|---|---|
| 1 — Empat lapisan | `Terminal, CLI, shell, atau PTY?` | Empat kartu bertransformasi menjadi rangkaian. | Istilah terkait tetapi bukan sinonim. |
| 2 — Dari ketikan ke process | `Siapa yang menjalankan command?` | Input melewati PTY dan shell ke builtin/executable, lalu kernel. | Terminal menampilkan; shell mengatur eksekusi. |
| 3 — Shell mengambil keputusan | `Mengapa baris command tidak selalu literal?` | Conveyor read → parse → expand → resolve → I/O → execute → status. | Shell memiliki aturan sebelum process berjalan. |
| 4 — Data punya jalur | `Ke mana input, output, dan error pergi?` | stdin/stdout/stderr bercabang, lalu pipe/redirection muncul sebagai rute. | Streams bukan dekorasi terminal. |
| 5 — Mode dan produktivitas | `Mengapa terminal baru dan script bisa berbeda?` | Interactive/login/non-interactive/remote serta config, history, alias, job control. | Konteks shell memengaruhi perilaku. |
| 6 — Script aman dan portable | `Apa yang perlu dijaga saat mengotomasi?` | Quote shield, exit-status check, target-shell badge, log/cleanup. | Shell kuat, tetapi syntax dan data perlu disiplin. |

Target satu video 90–110 detik, atau Content 48 inti menggunakan Act 1–3
dalam 55–65 detik dan Act 4–6 menjadi seri lanjutan. Jangan mengorbankan
pembedaan terminal versus shell hanya untuk memasukkan daftar fitur.

## 12. Copy dan continuity

Anchor persisten: terminal emulator, PTY cable, shell hub, command packet, dan
three-stream rail. Satu command packet harus berubah secara jelas menjadi
argument/process packet, kemudian output dan status token; jangan mengganti
objek secara tiba-tiba.

| Beat | Copy |
|---|---|
| Foundation | `Terminal menampilkan; shell mengatur command` |
| PTY | `PTY menghubungkan terminal dan program` |
| Parse | `Shell membaca struktur, bukan hanya teks` |
| Resolve | `Builtin dan executable punya jalur berbeda` |
| Streams | `Input, output, dan error terpisah` |
| Modes | `Konteks shell dapat mengubah perilaku` |
| Script | `Data perlu quote, status perlu diperiksa` |
| Closing | `Shell adalah bahasa dan pengelola proses` |

## 13. Acceptance criteria implementasi nanti

- [ ] Membedakan terminal emulator, CLI, shell, dan TTY/PTY secara akurat.
- [ ] Menjelaskan builtin versus external executable serta peran PATH tanpa mengklaim semua command adalah program eksternal.
- [ ] Menampilkan lifecycle read → parse → expand → resolve → I/O → execute → status sebagai model konseptual.
- [ ] Memisahkan stdin, stdout, stderr, redirection, dan pipeline.
- [ ] Memetakan Bash, zsh, fish, sh/POSIX, dan shell ringan tanpa menganggap semuanya kompatibel.
- [ ] Menyebut interactive, login, non-interactive, dan remote shell beserta dampak config/environment.
- [ ] Memetakan scripting, portability, exit status, quoting, dan security pitfall sebagai materi lanjut.
- [ ] Tidak ada command runnable, perubahan dotfile/profile, secret, atau operasi filesystem.
- [ ] Bila video tunggal terlalu padat, dipecah sesuai urutan Act tanpa kehilangan fondasi.

## 14. Rencana pecahan seri bila perlu diproduksi

| Content lanjutan | Fokus |
|---|---|
| 48a — Shell Execution Model | PTY, parser, expansion, builtins, PATH, process dan exit status. |
| 48b — Streams and Job Control | stdin/stdout/stderr, redirect, pipe, process group, foreground/background. |
| 48c — Shell Environment | Variables, environment, PATH, startup file, prompt, history, alias, completion. |
| 48d — Reliable Shell Scripts | Target interpreter, quoting, conditions, loops, errors, traps, testing, portability. |
| 48e — Shell Safety | Injection, secrets, PATH risk, privileges, review dan operational guardrails. |

Tidak ada file implementasi yang diubah oleh revisi ini; hanya dokumen plan ini yang diperbarui.


## 15. Log Eksekusi

### EKSEKUSI-01 (2026-09-18)
- User mengonfirmasi eksplisit: **full 6-Act dalam satu video (~90-110 detik)**, bukan versi inti Act 1-3, bukan storyboard 4-Act awal (lihat §11).
- File ditulis: `manifest.js`, `metadata.json` (title/subtitle/tags/color diisi), `data.js` (lengkap, lolos `node --check`), `Animation.jsx` (541 baris, lolos syntax check `esbuild` dan bundle-resolve penuh terhadap semua import lokal — data.js, sfxLoader, shared/scene-ui/v1).
- Referensi pola yang dipakai: `26-terminal-navigation` (paling lengkap & valid, pakai ContentBodyV1 penuh). **Catatan:** `44-ssh/Animation.jsx` yang disebut di §3 sebagai referensi awal ternyata TIDAK lengkap (terpotong sebelum penutup `</svg>`, tidak ada navigator/body/caption) — tidak dipakai sebagai acuan struktur akhir.
- Simplifikasi yang diambil dari desain awal: Act 1 (empat kartu istilah) TIDAK di-morph literal jadi elemen Act 2 (window/hub) — kontinuitas dijaga lewat kode warna konsisten per konsep (terminal=sky #38BDF8, shell=amber #FBBF24, pty=violet #A78BFA), bukan morph DOM/shape literal.
- Command packet (`ls -la`) bergerak lewat `travelPacket()` (tween x/y tiap frame via GSAP `onUpdate`) dari terminal → PTY → shell hub → fork exec → kernel → area Act 3 (lifecycle) — tidak pernah teleport, sesuai continuity map §12.
- `registry.js` yang disebut di §14 tabel "Rencana file saat eksekusi" **sudah tidak ada** di project (dihapus di iterasi lain) — `resolveTopic.js` sekarang membaca `metadata.json` langsung. Tabel §14 tidak diperbarui, catatan ini sebagai pengganti.
- Durasi 6 Act di `PHASES` (data.js) adalah **estimasi pra-eksekusi** (16/19/18/15/15/16 detik), belum diukur dari timeline nyata.

### Belum dikerjakan (di luar kapasitas sesi ini — perlu browser/preview tool)
- Preview manual di dev server (tidak ada akses jaringan/browser dari sesi ini untuk menjalankan `npm run dev` dan melihat hasil visual).
- Pengukuran ulang durasi total timeline nyata vs estimasi `PHASES`.
- QA acceptance criteria §13 (istilah, builtin vs executable, exit status, dsb) — perlu ditinjau visual.
- Export MP4 (`scripts/export-lib.js` atau pipeline serupa) — belum disentuh, tidak ada file di `scripts/` yang mereferensikan topic ini sebelumnya.
- `status` di `metadata.json` sengaja dibiarkan `"draft"` sampai preview manual dan QA selesai.


### EKSEKUSI-02 (2026-09-18, lanjutan sesi yang sama)
- Revisi diterapkan dari `revisi/2026-09-18-1712-revisi-01.md` ("Act 1 Harus Memperlihatkan Command Bekerja").
- **Act 1 ditulis ulang total**: LAYER_CARDS/narration-bubble-per-istilah dihapus. Sekarang: terminal idle → command `pwd` diketik (typewriter, `steps(3)` ease) → Enter → capsule lahir dari command line → travel PTY → shell hub (ring decoder CSS `shellSpin` aktif) → system task node (glow) → apply → capsule bertransformasi jadi output `/home/adib` → travel kembali shell→PTY→terminal → ditulis sebagai hasil (typewriter) → tiga highlight pendek (terminal, command line, shell) → caption penutup singkat "Terminal menampilkan. Shell mengatur."
- **Tidak ada reset canvas** di seam Act 1 → Act 2 sesuai aturan keras revisi: `terminalWin`, `ptyCable`, `shellHub`, `systemNode` (pop state) tidak pernah di-`popOut` sampai `archDim` (opacity 0.4) menandai transisi setelah Act 2 selesai — mereka tetap ter-mount sepanjang video.
- **Act 2 ditulis ulang**: dari "membangun arsitektur dari nol" menjadi "mengurai apa yang sudah terlihat" — command kontras `ls -la` (external, lewat PATH) diketik menyusul `pwd` (builtin) yang sudah ditunjukkan Act 1, memakai command-line & capsule yang sama (bukan elemen baru), lalu fork builtin/executable muncul untuk pertama kali di sini.
- **Act 4** disesuaikan: stream stdin/stdout/stderr sekarang bercabang langsung dari `systemNode` persisten (bukan kotak "PROCESS" baru yang saya buat di EKSEKUSI-01) — lebih konsisten dengan continuity map revisi.
- Layout lokal diganti total mengikuti tabel revisi §"Perubahan Layout": terminal y135-355, PTY y355-440, shell hub y475, system node y640; area Act 3/5/6 mulai y700, Act 4 stream row y760.
- Label pendek (`ARCH_LABELS.commandLine`, `.shell`, `.system`) ditempel langsung ke objek (bukan card terpisah), sesuai instruksi "objek harus memperoleh arti dari gerakannya".
- Bash-mark opsional dari revisi (Simple Icons, CC0) **tidak dieksekusi** — semua tetap inline SVG murni untuk first pass, sesuai opsi "jangan generate/download" yang eksplisit diperbolehkan revisi jika tidak diperlukan.
- File ditulis ulang penuh: `data.js` (197 baris) dan `Animation.jsx` (622 baris). Keduanya lolos `node --check` / `esbuild --bundle` (51.3kb, tanpa error) dan verifikasi manual cross-reference field (`ACT1_BEATS`, `ACT2_BEATS`, dll — semua field yang dipakai di komponen cocok dengan yang diekspor data.js).
- Checklist tindak lanjut dari revisi (`preview frame idle/transit/apply/return`, `audit safe-zone`, dsb) **belum dikerjakan** — sama seperti EKSEKUSI-01, butuh browser/dev-server yang tidak tersedia di sesi ini.


### EKSEKUSI-04 (2026-09-21, revisi-02: icon/logo/sub-penjelasan/motion)
- **Icon Bash**: didownload asli dari Simple Icons CDN (`gnubash.svg`, CC0) — BUKAN AI-generate. Path: `icons/_originals/gnu-bash-mark.svg` (2032 bytes, diverifikasi valid via `view`), dikonversi ke PNG 256×256 lewat `scripts/svg-to-png.mjs` (`icons/gnu-bash-mark.png`, 7351 bytes, diverifikasi visual — logo hexagon Bash dengan `$_` terlihat benar). Dilengkapi `icons/_originals/LICENSE-LOGOS.md`, `icons/icons.json` (Format B — single icon, source: download), `icons/loader.js` (pola `getIcon(id)` sama dengan topic lain), dan `icons/default-icon.png` (disalin dari `26-terminal-navigation`).
- Icon dirender sebagai `<image>` 20×20 dengan `style={{filter:'invert(1)'}}` (logo asli hitam solid → diinvert jadi putih supaya kontras di panel gelap) di `shellBadge` Act 6, hanya muncul saat `act6.targetShell === 'bash'`.
- **Sub-penjelasan**: `forkBuiltin`/`forkExec`/`systemNode` naik dari 48px→58-60px tinggi, tambah baris kedua (`ARCH_LABELS.builtinDetail/execDetail/systemDetail`). `FORK_Y` digeser 555→562 supaya tidak mepet `shellHub`.
- **5 motion baru** (mengganti hold statis, budget waktu Act TIDAK berubah):
  - Act 5 login: flow-dot violet travel dari tepi kiri body → shellHub sebelum badge "STARTUP" pop in.
  - Act 5 non-interactive: 3 flow-dot beruntun dari tepi kanan → shellHub (representasi command batch tanpa command line).
  - Act 5 remote: node `remoteHost` baru ("SERVER" + label "SSH") + `packet` asli travel bolak-balik terminal↔remoteHost (bukan flow-dot, supaya command/output text terbaca).
  - Act 6 check→gate: flow-dot merah travel checkNode→gateBox sebelum gateBox muncul (visualisasi sebab-akibat: status gagal → gerbang berhenti).
  - Act 6 gate→cleanup: flow-dot hijau travel gateBox→cleanupTray sebelum cleanupTray muncul.
- **Tidak dikerjakan**: idle breathing (opsional/kosmetik menurut revisi sendiri — diskip demi fokus ke item wajib). Update `scripts/export-lib.js` SFX_TIMELINE — dicek, tidak ada file di `scripts/` yang mereferensikan topic 48 sama sekali (export belum pernah dijalankan untuk topic ini), jadi tidak ada yang perlu diupdate.
- Verifikasi: `esbuild --bundle` lolos di setiap tahap (icon integration termasuk, dengan `--loader:.png=dataurl` untuk simulasi resolusi asset saat cek).

### EKSEKUSI-05 (2026-09-21, revisi-03: selaras standar act-scene)
- Baca penuh `docs/standardizations/07-act-scene-pattern.md` dan pola nyata `44-ssh/acts/` (`common.jsx`, `index.js`, `Act1Verify.jsx`) sebagai acuan sebelum migrasi — sesuai instruksi revisi ("Oracle: 44-ssh").
- Dikonfirmasi `IntroHeaderMorphV1` **sudah** mendukung `bg`/`bgScenes`/`bgDim`/`bgOrigin` (UPDATE 6) di source shared component — tidak perlu ubah shared component, tinggal disambungkan dari sisi topic.
- **File baru**: `acts/common.jsx` (layout constants BODY_CX..ROW2_Y, helper `pos/tos/oop/glow/withOrigin`, komponen `ArchChrome` yang menampung SEMUA elemen persisten lintas-Act — caption bubble, terminal window, PTY cable, shell hub [termasuk tampilan split token Act 3], fork builtin/exec, system node, command/output packet, flow-dot), `acts/Act1CommandWorks.jsx` .. `acts/Act6QuoteShield.jsx` (masing-masing render `<ArchChrome/>` + konten unik act-nya, plus `SUMMARY_STATE` untuk mode standalone/thumbnail), `acts/index.js` (registry `ACT_SCENES`).
- **`Animation.jsx` dipangkas total 347 baris** (994→661 baris): seluruh blok render (`const T = ...` sampai akhir file, ~400 baris) dihapus dan diganti satu blok `liveState` + `<ActiveAct state={liveState} />` di dalam `ContentBodyV1`. Layout constants tidak lagi diduplikasi — diimpor dari `./acts/common`.
- `IntroHeaderMorphV1` disambungkan: `bg={phaseIdx + 1}` (1-based sesuai kontrak), `bgScenes={ACT_SCENES}`, `bgDim={0.3}` — memakai default `bgOrigin` (layout.body). Dikonfirmasi lewat pembacaan source bahwa `<BgScene />` dipanggil TANPA props, jadi tiap `ActN.jsx` WAJIB bisa render mandiri dari `SUMMARY_STATE` internal — sudah dipenuhi lewat pola `const s = state || SUMMARY_STATE`.
- Verifikasi: `esbuild --bundle` pada `Animation.jsx` (yang meng-import `acts/index.js` yang meng-import keenam `ActN.jsx` + `common.jsx`) lolos 104.3kb, 0 error — artinya seluruh 8 file baru (`common.jsx` + 6 Act + `index.js`) tervalidasi transitif dalam satu bundle check. Cross-check manual field `liveState` (Animation.jsx) vs field yang didestrukturisasi tiap `ActN.jsx`/`ArchChrome` — semua cocok, tidak ada field hilang/typo.
- **Belum dikerjakan**: preview visual manual per-Act (butuh dev server/browser, di luar kapasitas sesi ini) — terutama untuk memastikan `bg`/`bgScenes` thumbnail benar-benar terlihat proporsional saat intro morph, dan `SUMMARY_STATE` tiap Act menghasilkan frame yang representatif secara visual (baru diverifikasi secara struktural/data, belum dilihat langsung).


### EKSEKUSI-06 (2026-09-22, revisi-04: inline SVG icons & fix intro overflow)
- **Fix judul intro terpotong**: dipakai mekanisme resmi `titleLines` milik `IntroHeaderMorphV1` (bukan hack font-size/letterSpacing) — hero merender "SHELL" dan "EXPLAINED" sebagai 2 baris stack, lalu crossfade ke `titleSegments` 1-baris versi compact begitu progress lewat `titleMorphSplit`. Tidak perlu ubah shared component, prop ini sudah ada (UPDATE terdahulu).
- **6 komponen icon inline SVG baru** di `acts/common.jsx` (semua primitif SVG murni kecuali `IconBashMark`, yang memakai PNG resmi `icons/gnu-bash-mark.png` — sumber sama dengan EKSEKUSI-04, TIDAK download ulang dari Wikimedia karena aset CC0 yang sudah ada sudah merupakan logo resmi GNU Bash):
  - `IconLightning` — builtin fast-path (fork builtin, pojok kanan-atas box)
  - `IconBinary` — executable/PATH (fork exec, pojok kanan-atas box)
  - `IconPromptGlyph` (`>_`) — terminal station (pojok kanan header window)
  - `IconShieldLock` — quote shield (Act 6, dataChip)
  - `IconPipeArrow` — arah aliran stdin/stdout/stderr (Act 4, 4 titik tengah garis)
  - `IconBashMark` — logo Bash kecil (16px) di shell hub, hanya tampil saat BUKAN mode token-split Act 3 (supaya tidak bentrok dengan teks "echo"/"$HOME")
- Terintegrasi di: `ArchChrome` (terminal, shellHub, forkBuiltin, forkExec — otomatis ikut ke SEMUA Act karena lewat chrome bersama), `Act4GrepError.jsx` (4 pipe-arrow dengan opacity mengikuti state `act4.stdinOn/stdoutOn/redirectOn/stderrOn` yang sudah ada), `Act6QuoteShield.jsx` (shield di dataChip).
- **Perbaikan kecil saat implementasi**: `IconPipeArrow` awalnya tidak punya prop `opacity` — ditambahkan supaya bisa mengikuti state aktif/tidak-aktif jalur data seperti elemen lain.
- Verifikasi: `esbuild --bundle` lolos (108.6kb, 0 error, `--loader:.png=dataurl` untuk simulasi resolusi PNG) setelah SEMUA perubahan (titleLines + 6 icon + 3 titik integrasi).
- **Belum dikerjakan**: verifikasi visual manual bahwa "EXPLAINED" benar-benar tidak lagi terpotong dan icon-icon baru terlihat presisi/proporsional — butuh browser/dev-server, di luar kapasitas sesi ini (sama seperti EKSEKUSI-01 s/d 05).


### EKSEKUSI-07 (2026-09-22, permintaan user: audio kurang ramai — perluas cakupan SFX)
- **Bukan revisi dari file `.md`** — permintaan langsung dari user di chat: setiap action/gerakan/muncul/hilang harus punya SFX supaya tidak "sepi".
- `SFX_MAP` diperluas dari 15 → 27 entri, memakai file audio yang sebelumnya belum dipakai sama sekali di topic ini (semua diverifikasi ada di `public/audio/`): `ui/plink`, `ui/bubble-pop`, `ui/beep`, `ui/beep-2`, `transitions/swoosh-2`, `transitions/slide-in`, `impacts/unlock`, `impacts/swap`, `success/complete`, `success/approval-stamp`, `warnings/soft-deny`, `sfx/typing`, `sfx/scan`, `sfx/materialize` (kategori folder `sfx` — dicek dulu `sfxLoader.js`, path-nya `/audio/{category}/{name}.wav`, generik untuk kategori manapun termasuk `sfx`).
- **4 helper timeline diubah supaya otomatis berbunyi** (sebelumnya harus manual `sfxOn()` di tiap titik, sering terlewat):
  - `popOut()` — dulu SENYAP total saat elemen hilang. Sekarang default main `ui/plink` (volume ×0.7), bisa di-override per pemanggilan.
  - `typeText()` — dulu cuma bunyi kalau ada `sfxOn(TICK)` manual di dekatnya (tidak konsisten). Sekarang selalu main `sfx/typing` di awal.
  - `travelPacket()` — dulu pergerakan capsule command/output TIDAK berbunyi sendiri (hanya titik awal/akhir yang kadang punya sfx manual). Sekarang tiap kali dipanggil otomatis main `transitions/light-swoosh-quick` pelan (×0.35) di awal gerakan.
  - `travelFlow()` — sama untuk flow-dot kecil (stream Act 4, pulse Act 6): otomatis main `ui/beep-2` sangat pelan (×0.3).
- **Titik spesifik yang ditambah manual** (state-toggle yang murni visual tanpa transisi pop/travel di dekatnya): `sfx/scan` saat `$HOME` expand ke `/home/adib` (Act 3), `success/approval-stamp` menyusul `ding` saat exit 0 sukses (Act 3), `warnings/soft-deny` saat gateBox "STOP" muncul (Act 6, ganti default POP jadi lebih tegas), `impacts/swap` + `alert-pulse` saat badge shell berganti bash→sh (Act 6).
- **Hasil akhir** (dihitung dari source): 22 `popIn`, 13 `popOut`, 43 `sfxOn` eksplisit, 23 `travelPacket`, 10 `travelFlow`, 7 `typeText` — semua titik ini sekarang membawa audio (baik otomatis dari helper maupun manual), dari sebelumnya banyak `popOut`/`travelPacket`/`travelFlow`/`typeText` yang senyap.
- Verifikasi: `node --check data.js` OK; `esbuild --bundle` Animation.jsx (yang meng-import seluruh `acts/`) lolos 110.7kb, 0 error.
- **Belum dikerjakan**: mendengarkan hasil akhir secara langsung (butuh browser/audio playback, di luar kapasitas sesi ini) — volume relatif antar-lapisan (mis. travelPacket 0.35× + travelFlow 0.3× dipilih supaya jadi tekstur latar yang tidak menabrak sfxOn eksplisit yang lebih penting, tapi ini asumsi belum diverifikasi dengar langsung).
