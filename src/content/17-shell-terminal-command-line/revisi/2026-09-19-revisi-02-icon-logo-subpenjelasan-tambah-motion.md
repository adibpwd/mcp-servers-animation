# Revisi 02 — Icon Logo Resmi, Sub-Penjelasan Textbox, Tambah Motion

| Item | Nilai |
|---|---|
| Content | 48 — Shell, Terminal, dan Command Line |
| Diminta oleh | Adib, 2026-09-19 |
| Status | 📝 PLAN ONLY — analisis & rencana, kode belum diubah |
| Terakhir diupdate | 2026-09-19 |
| Referensi | `revisi/2026-09-18-1712-revisi-01.md` (sudah dieksekusi, EKSEKUSI-02/03), `_docs/SHELL_TERMINAL_COMMAND_LINE_PLAN.md`, `docs/standardizations/03` §K & §1.T, `docs/standardizations/05-svg-layout-asset-pipeline.md` §9 (Bab B icon) |

## Ringkasan Permintaan

1. Perlu `icons.json` dan icon yang **didownload** (bukan AI-generate) dari
   sumber seperti Wikipedia/Google.
2. Penjelasan kurang detail — di bawah shell ada textbox "builtin" polos
   tanpa penjelasan langsung di kotaknya, perlu sub-penjelasan.
3. Animasi kurang menarik, motion kurang — perbanyak pergerakan supaya
   tidak membosankan.

---

## 1. Analisis & Plan Icon (Download, Bukan AI-generate)

### 1.1 Konteks — ini mengubah sebagian keputusan revisi-01

Revisi-01 (sudah dieksekusi) secara eksplisit memutuskan **tidak ada icon
sama sekali** kecuali satu opsi kecil (Bash mark) yang akhirnya juga
**tidak dieksekusi** ("Bash-mark opsional dari revisi ... **tidak
dieksekusi** ... semua tetap inline SVG murni untuk first pass" — catatan
EKSEKUSI-02 di `_docs/SHELL_TERMINAL_COMMAND_LINE_PLAN.md`). Alasannya
saat itu: semua benda utama (terminal, PTY, shell hub, system node) punya
motion internal, jadi PNG statis akan mengurangi kejelasan — alasan ini
**masih valid** dan TIDAK dibatalkan oleh permintaan sekarang. Permintaan
user kali ini bersifat **tambahan** untuk elemen yang memang statis/brand
identity, bukan migrasi total ke PNG.

### 1.2 Catatan penting soal sumber unduhan — "Google" perlu diluruskan

Revisi-01 juga eksplisit menulis: **"jangan mengambil dari Google image
search"** — alasannya lisensi tidak jelas per hasil pencarian gambar
Google. Ini konsisten dengan standar project
(`05-svg-layout-asset-pipeline.md` §9, Bab B icon pipeline):

| Sumber | Lisensi | Kapan dipakai |
|---|---|---|
| Devicon (`cdn.jsdelivr.net/npm/devicon`) | MIT | Logo full-color |
| Simple Icons (`cdn.jsdelivr.net/npm/simple-icons`) | CC0 | Logo monokrom — cocok untuk gaya flat project ini |
| Wikimedia Commons | Cek per-file | **Fallback saja**, kalau 2 sumber di atas tidak punya mark yang valid |

Jadi permintaan "download dari Wikipedia/Google" saya terjemahkan sebagai
**"download logo resmi, bukan AI-generate"** — sumber teknisnya tetap
Devicon/Simple Icons dulu (otomatis terverifikasi lisensi & bentuknya
akurat), Wikimedia Commons cuma dipakai kalau mark yang dicari memang
tidak ada di 2 sumber pertama (dengan lisensi per-file dicek manual).
Google Images murni sebagai search engine (bukan sumber file) tetap
dihindari sebagai tempat AMBIL FILE, sesuai keputusan revisi-01 yang
sudah benar dan tidak saya ubah.

### 1.3 Audit ulang — logo mana yang relevan (bukan migrasi paksa semua)

Elemen dengan state animasi internal (terminal window, PTY cable, shell
hub dengan ring decoder + text swap builtin/echo, packet, flow garis,
system node, folder tiles Act 3, diagram Act 4, context badge Act 5,
gate/cleanup Act 6) **TETAP inline SVG** — keputusan ini sudah benar di
revisi-01, tidak diubah revisi ini.

Kandidat logo statis yang relevan secara naratif (bukan sekadar "logo
terkenal" tanpa konteks — lihat §1.I Visual Noise Audit, `03`):

| Elemen | Icon | Alasan pakai/tidak |
|---|---|---|
| `shellBadge` saat `targetShell === 'bash'` (Act 6) | **Bash mark** (Simple Icons `gnu-bash`, CC0) | Sudah disebut narasi (`ACT6_CASE.targetShellDefault = 'bash'`), badge statis, cocok jadi accent icon — bukan pengganti teks |
| `shellBadge` saat `targetShell === 'sh'` (Act 6) | **Tidak ada mark resmi terverifikasi** untuk "sh"/POSIX generik di Devicon/Simple Icons | Jangan paksakan logo yang tidak resmi — tetap teks `sh` polos (sesuai prinsip "jangan generate ulang demi 'memperbaiki' — kalau sumber resmi tidak ada, tetap ilustratif/teks", §8 `05-svg-layout-asset-pipeline.md`) |
| Zsh, Fish, atau shell lain | **Tidak ditambahkan** | Tidak pernah disebut di `data.js`/narasi topic ini sama sekali — menambah logo shell yang tidak dibahas cuma jadi dekorasi tanpa fungsi (persis §1.I Visual Noise Audit: elemen dekoratif yang tidak berkontribusi ke pemahaman) |

**Kesimpulan:** hanya **1 icon** yang benar-benar relevan untuk didownload
saat ini — Bash mark. Ini realistis dan konsisten dengan keputusan
revisi-01, hanya dieksekusi sekarang (sebelumnya sengaja ditunda).

### 1.4 Draft `icons.json` (Format B — single icon, sumber download)

```json
{
  "name": "shell-terminal-command-line",
  "description": "Logo resmi shell yang disebut eksplisit di narasi topic ini. Semua elemen beranimasi tetap inline SVG.",
  "icons": [
    {
      "id": "gnu-bash-mark",
      "name": "GNU Bash mark",
      "label": "Bash",
      "description": "Accent badge kecil di shellBadge saat target shell = bash; tidak pernah menggantikan shell hub yang beranimasi.",
      "source": "download",
      "source_url": "https://cdn.jsdelivr.net/npm/simple-icons@latest/icons/gnubash.svg",
      "license": "CC0"
    }
  ],
  "generation": {
    "output_path": "src/content/48-shell-terminal-command-line/icons"
  }
}
```

### 1.5 Rencana integrasi & kepatuhan provenance

- Convert SVG → PNG pakai `scripts/svg-to-png.mjs` (§9 `05`), simpan SVG
  asli di `icons/_originals/gnu-bash-mark.svg`.
- Catat sumber & lisensi di `icons/_originals/LICENSE-LOGOS.md` (1 baris:
  nama, `source_url`, lisensi CC0).
- Download dilakukan lewat terminal akses jaringan penuh (bukan sandbox
  terbatas) — catatan operasional §9 `05` berlaku persis di sini juga.
- Render: `<image>` 20×20 di pojok `shellBadge` (offset formula §6.3
  `06-icon-generation.md`: `x = -(140/2) + 14 = -56`), **di samping** teks
  `bash`, bukan menggantikan — badge tetap berfungsi walau icon gagal load
  (fallback `default-icon.png` kosong/transparan).

---

## 2. Analisis & Plan Sub-Penjelasan Textbox

### 2.1 Temuan konkret — box "builtin" & "exec" memang polos

Dicek langsung dari `Animation.jsx` (render Act 2, dipakai ulang Act 3):

```jsx
<g transform={T('forkBuiltin', BODY_CX - 130, FORK_Y)} opacity={O('forkBuiltin')}>
  <rect ... />
  <text ...>{ARCH_LABELS.builtin}</text>   {/* HANYA "Builtin", tanpa baris lain */}
</g>
<g transform={T('forkExec', BODY_CX + 130, FORK_Y)} opacity={O('forkExec')}>
  <rect ... />
  <text ...>{ARCH_LABELS.exec}</text>       {/* HANYA "External Executable" */}
</g>
```

Ini beda sendiri dibanding hampir SEMUA box lain di file yang sama —
semuanya sudah punya baris kedua penjelasan:

| Box lain (pembanding) | Baris kedua yang SUDAH ada |
|---|---|
| `folderRow` (Act 3) | `"match *.txt"` / `"tidak cocok"` / `"notes/"` |
| Process box Act 4 | `"stdin · stdout · stderr"` |
| `contextBadge` (Act 5) | Badge kode (`"INTERACTIVE"`, `"SSH → server"`, dst) |
| `checkNode`/`gateBox`/`cleanupTray`/`shellBadge` (Act 6) | `"exit 1"`, `"publish locked"`, `"cleanup ✓ tray kosong"`, dst |
| **`forkBuiltin`/`forkExec` (Act 2 & 3)** | **— tidak ada —** |

`systemNode` (Act 1, persistent) juga cuma render 1 baris
`ARCH_LABELS.system.toUpperCase()` — temuan sekunder, ikut dibenahi untuk
konsistensi meski bukan yang user sebut spesifik.

### 2.2 Kenapa ini terasa kurang jelas

Penjelasan sebenarnya ADA, tapi cuma lewat caption bar di atas
(`ACT2_BEATS.builtinRecap`, `.lookup`, `.path`, dst) yang isinya berganti
tiap ±1 detik lalu hilang saat beat berikutnya jalan. Begitu audiens
pause atau lihat ulang frame builtin/exec di detik lain, kotak itu sendiri
tidak menjelaskan apa-apa — cuma nama. Ini kebalikan dari prinsip §K
(`03-planning-storytelling-quality-gate.md`, "Teks Mengikuti Posisi
Elemen"): penjelasan idealnya melekat ke elemen yang dibahas, bukan
tergantung sepenuhnya pada caption global yang bersifat sementara.

### 2.3 Rencana sub-teks baru per box

| Box | Baris 1 (existing) | Baris 2 baru (sub-penjelasan) |
|---|---|---|
| `forkBuiltin` | `Builtin` | `"Dijalankan shell sendiri, tanpa process baru"` |
| `forkExec` | `External Executable` | `"Dicari di PATH, jalan sebagai process terpisah"` |
| `systemNode` | `SYSTEM & RESOURCES` | `"Kernel: CPU, memori, file descriptor"` |

Teks di atas mengikuti gaya deklaratif ringkas project (≤ 8 kata, tanpa
emoji, tanpa kata ganti orang — `03` § "Wording Ringkas") dan TIDAK
menduplikasi kalimat caption bar yang sudah ada (§3.7 satu-kanal-per-
kalimat) — caption bar tetap pegang narasi alur ("pwd langsung selesai,
tapi ls butuh pencarian?"), sedangkan sub-teks di box menjelaskan
**definisi tetap** benda itu sendiri, isinya beda kalimat.

### 2.4 Penyesuaian ukuran box (formula `05-svg-layout-asset-pipeline.md`)

`forkBuiltin`/`forkExec` sekarang tinggi `48px` (rect `y=-24` s/d `y=24`)
untuk 1 baris teks `fontSize 11.5`. Menambah baris kedua `fontSize ~8.5`
butuh sedikit ruang napas tambahan — naikkan ke `58px` (`y=-29` s/d
`y=29`), baris pertama tetap di `y=-2`, baris kedua baru di `y=15`
(`dy` ≈ 17, sesuai formula `dy = fontSize*1.3–1.5` di §Solusi 1 `05`).
`systemNode` (`y=-26` s/d `y=26`, teks di `y=6`) naik jadi `60px`, label
utama geser ke `y=-4`, sub-teks baru di `y=14`.

---

## 3. Analisis & Plan Tambah Motion

### 3.1 Audit titik minim gerak (dibaca langsung dari timeline `tl.add`/`tl.to`)

Act 1-4 sudah punya motion fisik yang jelas (`travelPacket`/`travelFlow`
membawa capsule/titik data lewat jalur nyata — pola ini SUDAH benar
sesuai `04-referensi-gsap.md` § "Advanced Pattern: Moving Element"). Titik
paling minim gerak ada di **Act 5** dan sebagian **Act 6**:

**Act 5 — 3 dari 4 konteks HANYA popIn + hold + popOut, tanpa travel:**

```jsx
tl.add(() => setAct5({ active: 'login', recap: false }), t)
popIn(tl, t, 'contextBadge', { fromY: -10 })
say(tl, t, ACT5_BEATS.login)
sfxOn(tl, t, SFX_MAP.CHIME.category, SFX_MAP.CHIME.name)
t += 1.4                                    // ← 1.4 detik, badge cuma diam
popOut(tl, t, 'contextBadge', {})
```

Pola yang sama persis berulang untuk `noninteractive` dan `remote` — beda
dengan konteks `interactive` yang SUDAH punya packet travel penuh
(terminal→PTY→shell→balik). Ironisnya, konteks `remote` — yang paling
butuh visual "berjalan di tempat lain" — justru salah satu yang paling
statis.

**Act 6 — 4 box (`checkNode`→`gateBox`→`cleanupTray`→`shellBadge`)
muncul berurutan tanpa elemen penghubung yang bergerak**, padahal
hubungan sebab-akibatnya jelas: status gagal (`checkNode`) → gerbang
berhenti (`gateBox`) → cleanup tetap jalan (`cleanupTray`). Ini melanggar
pola causal chain yang dianjurkan `03` §1.T (Before→Intent→Travel→Apply→
After) — travel-nya hilang, cuma lompat dari 1 box ke box berikutnya.

### 3.2 Rencana motion baru — pakai budget waktu yang SUDAH ada (tidak molor)

Prinsipnya: ganti hold statis 1.4s (Act 5) jadi hold berisi travel yang
menjelaskan perbedaan konteks — durasi total per Act TIDAK bertambah,
cuma diisi gerakan yang sebelumnya kosong.

| Konteks/Beat | Motion baru pengganti hold statis |
|---|---|
| Act 5 — `login` | Sebelum badge muncul: chip kecil "startup config" travel MASUK ke `shellHub` (bukan keluar dari terminal) — memvisualkan "dibaca sebelum prompt pertama muncul" |
| Act 5 — `noninteractive` | 2-3 command capsule mini travel berurutan cepat dari luar frame langsung ke `shellHub` TANPA singgah di command line/cursor blink — kontras visual dgn `interactive` yang lewat command line |
| Act 5 — `remote` | Packet travel dari `terminalWin` melintasi garis putus-putus menuju node kecil baru "remote host" di kanan luar, lalu balik — memvisualkan "shell jalan di host lain, terminal lokal cuma menampilkan" |
| Act 6 — `check → gate` | Pulse kecil (titik/garis dash beranimasi) dari `checkNode` menuju `gateBox`, baru `gateBox` muncul — bukan box gate langsung muncul begitu saja |
| Act 6 — `gate → cleanup` | Pulse serupa dari `gateBox` menuju `cleanupTray` — menunjukkan cleanup terjadi SEBAGAI AKIBAT gate berhenti, bukan kebetulan sejajar |

### 3.3 Tabel Causal Motion (§1.T.1) untuk beat baru

| Action id | Before | Pemicu | Jalur/process | Apply | After | Hold | SFX |
|---|---|---|---|---|---|---:|---|
| `login-config-flow` | Layar kosong, belum ada badge | Otomatis awal beat `login` | Chip "config" travel dari tepi kiri body ke `shellHub` | Chip masuk shell, badge `login` pop-in | Caption login + badge tampil | 1.4s (budget sama) | `ui/chime` (existing) |
| `noninteractive-batch-flow` | Command line kosong, tanpa cursor aktif | Otomatis awal beat `noninteractive` | 2-3 capsule mini masuk beruntun langsung ke `shellHub` (bukan lewat command line) | Capsule terakhir tiba, badge pop-in | Caption + badge tampil | 1.4s | `ui/pop-2` (existing) |
| `remote-network-travel` | Terminal window diam di posisi biasa | Otomatis awal beat `remote` | Packet travel ke node "remote host" baru (garis putus, warna beda) lalu balik | Node remote menyala saat packet tiba | Badge `remote` + caption, garis tetap terlihat sebentar | 1.4s | `transitions/whoosh` (existing) |
| `check-gate-pulse` | `checkNode` sudah exit 1, `gateBox` belum muncul | Otomatis setelah `checkNode` | Dash pulse merah travel checkNode→gateBox | Pulse tiba, `gateBox` pop-in | `gateBox` "STOP" tampil | 0.5s (dalam budget 0.7s existing) | `warnings/alert-pulse` (existing, geser posisi) |
| `gate-cleanup-pulse` | `gateBox` sudah STOP | Otomatis setelah `gateBox` | Dash pulse hijau travel gateBox→cleanupTray | Pulse tiba, `cleanupTray` pop-in | Caption cleanup + tray tampil | 1.0s (dalam budget existing) | `ui/chime` (existing) |

Semua SFX dipakai ulang dari `SFX_MAP` yang sudah ada — tidak perlu asset
audio baru, hanya reposisi pemanggilan mengikuti beat baru.

### 3.4 Tambahan kecil — idle breathing saat hold panjang

Selain 5 beat di atas, tambahkan idle motion halus (opacity/scale ±3%,
lambat, non-distracting) pada `shellHub` ring dan border `systemNode`
selama hold caption-only di Act 1-4 yang tidak dicakup revisi ini — supaya
tidak ada frame yang terasa 100% beku bahkan saat hanya caption yang
berganti. Ini murni kosmetik (tidak mengubah `t` cursor, aman tanpa
seeded-random karena bukan variasi timing — lihat `04-referensi-gsap.md`
§ Determinism).

---

## Rencana Perubahan File (Kontrak §3, `02-topic-contract-scene-shell.md`)

| File | Perubahan |
|---|---|
| `data.js` | Tambah sub-teks `ARCH_LABELS` (builtin/exec/system) sebagai field baru terpisah (mis. `ARCH_LABELS.builtinDetail`, `.execDetail`, `.systemDetail`); tambah teks untuk beat login/noninteractive/remote-flow baru |
| `Animation.jsx` | Tambah baris `<text>` kedua di `forkBuiltin`/`forkExec`/`systemNode`; naikkan tinggi box sesuai §2.4; tambah 5 beat motion baru (§3.2-3.3); render `<image>` Bash mark di `shellBadge` |
| `icons/icons.json`, `icons/_originals/gnu-bash-mark.svg`, `icons/_originals/LICENSE-LOGOS.md`, `icons/loader.js`, `icons/default-icon.png` | Baru dibuat (§1.4-1.5) |
| `scripts/export-lib.js` | Update `SFX_TIMELINE` — beberapa SFX existing (`chime`, `pop-2`, `whoosh`, `alert-pulse`) bergeser waktu karena beat baru Act 5-6 |

## Status Test Setelah Perbaikan

- [ ] Belum dieksekusi — dokumen ini masih analisis & rencana (📝 PLAN ONLY)
- [ ] Download & konversi Bash mark (svg-to-png.mjs) — belum
- [ ] Compile check (esbuild) — belum
- [ ] Preview manual `/player/shell-terminal-command-line` — belum
- [ ] Export MP4 — belum
- [ ] Cek collision box baru (tinggi 48→58/60) terhadap elemen tetangga (`FORK_Y`, `SYSTEM_Y`) — belum

## Checklist Eksekusi (isi saat mulai coding revisi ini)

- [ ] Download `gnu-bash-mark.svg` dari Simple Icons, convert PNG, arsipkan + catat lisensi
- [ ] Buat `icons/icons.json`, `loader.js`, `default-icon.png`
- [ ] Tambah sub-teks 2 baris di `forkBuiltin`, `forkExec`, `systemNode` + sesuaikan tinggi box
- [ ] Tambah beat `login-config-flow`, `noninteractive-batch-flow`, `remote-network-travel` di Act 5
- [ ] Tambah beat `check-gate-pulse`, `gate-cleanup-pulse` di Act 6
- [ ] Tambah idle breathing halus di `shellHub`/`systemNode` (opsional, kosmetik)
- [ ] Render `<image>` Bash mark di `shellBadge`, cek fallback tetap jalan
- [ ] Update `SFX_TIMELINE` di `export-lib.js` sesuai pergeseran beat
- [ ] Ukur ulang durasi Act 5 & 6, pastikan tidak melebihi `PHASES[].duration` existing (16s/17s) kecuali ada alasan tertulis
- [ ] Preview manual, export MP4, lalu naikkan status di README revisi index

**Status:** 📝 PLAN ONLY — menunggu persetujuan eksekusi eksplisit dari Adib
sebelum kode `Animation.jsx`/`data.js` diubah, sesuai
`docs/standardizations/01-architecture-runtime.md` §7.
