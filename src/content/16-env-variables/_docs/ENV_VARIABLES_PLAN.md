# Environment Variables & Kenapa .env Penting — Topic Plan

## Overview

Animasi narrative-driven pendek: developer selesai bikin app, jalan
mulus 100% di laptop (localhost) — tapi begitu di-deploy ke server
production, app langsung crash/connection error, padahal kode yang
di-push PERSIS SAMA (tidak ada baris yang beda). Jawabannya: config
(database host, API key, dst) sempat di-hardcode di kode, jadi app
"buta" terhadap lingkungan tempat dia jalan. Solusinya: pisahkan config
dari kode pakai environment variables — kode baca dari luar ("catatan
konfigurasi"), catatan itu beda-beda per lokasi (laptop dev vs server
production), file `.env` yang biasa dipakai buat itu justru berisi
rahasia (password, API key) sehingga TIDAK BOLEH ikut ke-commit ke git.

Target audiens: **anak IT / junior dev** — sudah pernah lihat file
`.env` atau baca "jangan commit .env" di README project, tapi belum
tentu ngerti KENAPA. Playful tone, BUKAN dokumentasi teknis dibacakan.
Ikuti kontrak `docs/standardizations/02-standar-konten.md` +
`docs/standardizations/03-tutorial-buat-topic-baru.md`.

**Canvas:** 820 × 1340 (portrait 9:16, standar reels mobile — sama
seperti `tailscale`, `linux-vs-unix`, `virtual-memory`, `container-docker`)
**Difficulty:** ⭐⭐ (scope kecil & sederhana — sesuai arahan user,
"quick-win produksi". Titik rawan cuma 1: akurasi soal git history
permanen & env var tidak SELALU lewat file `.env` fisik — lihat
§ Konsep Teknis WAJIB Akurat)
**Estimasi total durasi:** ~29-30 detik (3 Act — SENGAJA pendek, topic
ini scope-nya kecil, tidak perlu 5 Act seperti `container-docker`)
**Tier rencana:** Tier 2 (Beginner → Intermediate) di `registry.js`,
kategori `Developer Tools` — sejajar dengan `shell-pipeline`/
`process-vs-thread`, bukan Tier 4 (topic ini dirancang jadi "gerbang
masuk" yang gampang dicerna junior dev, bukan advanced/spesialis)

## Color Palette

```
BG:      #070913   background solid, dark navy (standar project)
PANEL:   #0F172A   panel/card (standar project)
BORDER:  #334155   (standar project)
TEXT:    #E2E8F0   (standar project)
MUTED:   #94A3B8   (standar project)

DEV:      #38BDF8  sky blue  - laptop developer (semantik: Browser/Info)
SERVER:   #06B6D4  cyan      - server production (semantik: Network/System)
DANGER:   #F43F5E  rose      - crash, error, secret leak (semantik: Alert/Error)
SUCCESS:  #34D399  green     - config benar, app jalan normal (semantik: Success)
CONFIG:   #FBBF24  yellow    - sticky note / env var (asosiasi visual sticky
                    note kuning, sekaligus semantik "hati-hati, ini yang beda-beda")
GIT:      #FB923C  orange    - repository/git box (semantik: Process/Activity)
```

Tidak perlu warna brand asli (Git/GitHub logo) — ini kotak generik
"repository", bukan logo brand, jadi aman pakai palet project sendiri
(lihat `docs/standardizations/06-icon-generation.md` §8, brand logo asli
cuma perlu kalau benar-benar menampilkan logo, bukan ilustrasi konsep).

## Story Spine (4-Beat per Act, wajib per docs/03)

| Act | Setup | Tegangan/Masalah | Titik Balik | Payoff |
|---|---|---|---|---|
| 1 | Developer selesai coding, app jalan mulus di laptop — semua hijau, koneksi database oke | Deploy ke server production, app yang SAMA PERSIS (kode tidak diubah) langsung crash/connection error | — (hook belum dijawab, disimpan buat Act 2) | Cliffhanger: "Kodenya sama persis... kok bisa beda?" |
| 2 | Developer buka kode, cari kenapa bisa beda | Reveal: config (host database, dst) di-**hardcode** langsung di baris kode — nilai itu cuma benar untuk 1 lingkungan (laptop), salah di lingkungan lain | Solusi: pisahkan config dari kode pakai **environment variable** — laptop & server masing-masing punya "catatan" (`.env`) sendiri dengan value beda, kode-nya baca catatan itu, BUKAN hardcode | App jalan benar di KEDUA tempat — kode sama, catatan yang beda |
| 3 | `.env` sekarang jadi tempat nyimpen config sensitif (password DB, API key) | Kalau `.env` ke-commit & ke-push ke git (apalagi repo public), rahasia itu ikut ter-upload — bot scanner otomatis bisa nemuin dalam hitungan menit | Solusi: `.env` wajib masuk `.gitignore` (tidak pernah ikut commit), pakai `.env.example` (placeholder tanpa value asli) buat dokumentasi format | Jawab hook Act 1 eksplisit: kode sama, catatan beda per tempat — itu kenapa app bisa "pindah lingkungan" tanpa ubah kode, TAPI catatan itu harus dijaga baik-baik |

## Act 1 — Hook: Kode Sama, Kenapa Beda Hasil? (≈8s)

**Badge:** "ACT 1 — KODE SAMA, KENAPA BEDA HASIL?"

**Visual inti:**
- Kiri: ikon **Laptop** (anchor persisten, warna `DEV` biru) dengan label
  "LOCAL (DEV)" — app box kecil di dalamnya nyala hijau (`SUCCESS`),
  checklist muncul: koneksi database OK
- Kode ditulis di dalam app box (efek typing pendek, monospace, 1 baris
  singkat: `connect("localhost")` cukup) — SFX `TYPING`
- Transisi: app box yang SAMA (bukan box baru — ini objek yang mau
  di-highlight sebagai "kode identik") "meluncur" (whoosh) dari Laptop
  ke ikon **Server** di kanan (anchor persisten, warna `SERVER` cyan,
  label "PRODUCTION")
- Sesampainya di Server: app box berubah merah (`DANGER`), muncul
  X/crash icon, SFX `ERROR`
- Karakter (muka bulat simpel) reaksi bingung/kaget di sebelah Server
- Speech bubble hook: "Kodenya sama persis... kok bisa beda?"
- Teks closing Act: cliffhanger ke Act 2 (kenapa bisa beda padahal kode
  sama)

**Catatan anchor:** ikon **Laptop** dan **Server** dirender SEKALI
sebagai objek persisten (1 `id` tetap masing-masing, popIn di Act 1,
TIDAK di-popIn ulang di Act 2) — Act 2 akan menambahkan sticky note di
device yang sama ini via `gsap.to()`, bukan bikin device baru. Lihat
`docs/standardizations/04-referensi-gsap.md` § "Persistent Anchor
Object Lintas-Act".

## Act 2 — Hardcode vs Environment Variable (≈10.5s)

**Badge:** "ACT 2 — CATATAN BEDA, KODE TETAP SAMA"

**Visual inti (2 beat dalam 1 Act, sesuai flow yang diminta user:
hardcode → env var):**

*Beat masalah (hardcode):*
- Zoom ke app box di Laptop (yang sama dari Act 1) — perbesar tampilkan
  1 baris kode dengan highlight rose: `DB_HOST = "localhost"` langsung
  ketulis di source code, badge kecil "HARDCODE" nempel di baris itu
- Badge/insight: "Config ketulis LANGSUNG di kode — cuma benar di 1 tempat"

*Beat solusi (env var):*
- Baris kode berubah (morph/highlight, bukan pop-in baru):
  `DB_HOST = process.env.DB_HOST` — value-nya sekarang "kosong"/
  placeholder, TIDAK ketulis langsung
- Muncul **sticky note kuning** (`CONFIG`) nempel di ikon Laptop (anchor
  dari Act 1), isinya `DB_HOST=localhost` — SFX `MATERIALIZE`
- Muncul **sticky note kuning kedua** (beda isi) nempel di ikon Server
  (anchor dari Act 1), isinya `DB_HOST=prod-db.internal` — SFX
  `MATERIALIZE`
- Animasi: garis putus-putus dari tiap sticky note ke app box masing-
  masing (visualisasi "app baca catatan ini saat start")
- App box di Laptop DAN di Server sama-sama jadi hijau (`SUCCESS`) —
  SFX `SUCCESS`
- Badge kecil: "Kode baca catatan, catatan beda-beda tiap tempat"

**Payoff Act 2:** paham KENAPA sebelumnya beda hasil (hardcode) dan
bagaimana env var jadi solusi (sama kode, beda catatan).

## Act 3 — Jangan Titip Rahasia ke Git (≈10.5s)

**Badge:** "ACT 3 — JANGAN TITIP RAHASIA KE GIT"

**Visual inti:**
- Setup: sticky note `.env` (dari Act 2) di-zoom, isinya sekarang
  diperluas — bukan cuma `DB_HOST`, tapi juga `DB_PASSWORD=...` dan
  `API_KEY=...` (highlight rose di 2 baris ini, badge kecil "RAHASIA")
- Tegangan: animasi sticky note itu "ketarik" masuk ke kotak
  **Git/Repository** (bentuk kotak generik + panah commit, warna `GIT`
  orange) — SFX `WHOOSH`
- Titik balik (tension beat, jangan langsung jawab): ikon mata/radar
  berkedip di atas kotak Git (representasi bot/scanner), SFX `WARNING`
  lalu `CRITICAL` — badge: "Bot scanner bisa nemuin dalam hitungan menit"
- Reveal: garis dari kotak Git nyambung ke ikon "penyerang" (bentuk
  sederhana, bukan karakter detail) yang sekarang PUNYA akses ke
  `DB_PASSWORD`/`API_KEY` — visual "kebocoran"
- Solusi: overlay `.gitignore` (kotak/badge lock, warna hijau) menutup
  jalur dari sticky note ke kotak Git — SFX `LOCK` — sticky note `.env`
  TIDAK lagi ketarik masuk
- Muncul sticky note kedua yang BEDA (label `.env.example`, isi cuma
  `DB_HOST=` dan `API_KEY=` TANPA value) yang boleh masuk ke kotak Git
  dengan aman
- Closing payoff — jawab hook Act 1 secara eksplisit: "Kode yang sama,
  baca catatan berbeda tiap tempat. Catatan itu isinya rahasia — jangan
  sampai bocor."

## Konsep Teknis yang WAJIB Tetap Akurat (jangan disederhanakan sampai salah)

1. **Environment variable adalah key-value pair di level OS/proses,
   dibaca saat runtime** — bukan bagian dari source code itu sendiri.
   Contoh nyata di Node.js: `process.env.DB_HOST`. Animasi jangan
   menggambarkan env var seolah "bagian dari file kode" — env var hidup
   DI LUAR kode, kode cuma membacanya.
2. **File `.env` adalah CONVENTION, bukan fitur bahasa pemrograman.**
   Library seperti `dotenv` yang membaca file ini lalu meng-inject
   isinya ke `process.env` saat app start. Ini bukan mekanisme built-in
   universal — beda tooling/bahasa punya cara baca `.env` yang beda
   (atau tidak pakai `.env` sama sekali).
3. **Di production, env var TIDAK SELALU lewat file `.env` fisik.**
   Sering di-set langsung di level infrastruktur: `systemd` unit file,
   `docker run -e KEY=VALUE`, Kubernetes `ConfigMap`/`Secret`, atau
   dashboard cloud platform (Vercel/Heroku/dst env var settings).
   Animasi Act 2 boleh menyederhanakan jadi "sticky note nempel di
   Server" untuk analogi, TAPI closing/caption jangan menyiratkan
   `.env` adalah satu-satunya cara — cukup 1 baris kecil di Act 3 atau
   caption yang menyebut ini kalau ada slot durasi.
4. **Alasan `.env` wajib di `.gitignore`:** file ini biasa berisi
   credential plaintext (password database, API key, token). Kalau
   ke-commit ke git — apalagi ke-push ke repo public — rahasia itu
   ter-upload dan **tetap ada di riwayat git** meski dihapus di commit
   berikutnya (butuh rewrite history / `git filter-repo` untuk benar-
   benar hilang, bukan cuma hapus file). Bot/scanner otomatis (GitHub
   secret scanning, dork search) diketahui bisa menemukan secret yang
   ke-push ke repo public dalam hitungan menit.
5. **`.env.example` (atau `.env.sample`) BOLEH dan SEBAIKNYA
   di-commit** — isinya cuma daftar key yang dibutuhkan tanpa value
   asli (`DB_HOST=`, `API_KEY=your-key-here`), berfungsi sebagai
   dokumentasi format config buat developer lain, tanpa expose rahasia
   apa pun.

## Manifest Draft (`manifest.js`)

```js
export default {
  schemaVersion: 1,
  id: 'env-variables',
  title: 'Environment Variables & .env',
  subtitle: 'Same code, different config per machine',
  category: 'Developer Tools',
  tags: ['Environment Variables', '.env', 'Config', 'DevOps', 'Security'],
  color: '#EAB308',
  audioStrategy: 'realtime',
}
```

## data.js Skeleton (rencana, belum final)

```js
export const VW = 820
export const VH = 1340

export const COLORS = { /* lihat Color Palette di atas */ }

export const PHASES = [
  { id: 'same-code-hook',     badge: 'ACT 1 — KODE SAMA, KENAPA BEDA HASIL?', duration: 8.0 },
  { id: 'hardcode-vs-envvar', badge: 'ACT 2 — CATATAN BEDA, KODE TETAP SAMA', duration: 10.5 },
  { id: 'dont-commit-env',    badge: 'ACT 3 — JANGAN TITIP RAHASIA KE GIT',   duration: 10.5 },
]
```

```js
// diisi detail per-Act saat implementasi:
// DEV_MACHINE / SERVER_MACHINE (anchor object, posisi + state warna),
// APP_BOX (anchor object kedua, meluncur dev->server di Act 1),
// STICKY_NOTES (2x Act 2: dev & server, beda isi; 1x Act 3:
// env-example), GIT_REPO_BOX, SCANNER_ICON, GITIGNORE_LOCK_BADGE
export const SFX_MAP = {
  POP:         { category: 'ui', name: 'pop' },
  CLICK:       { category: 'sfx', name: 'click' },
  WHOOSH:      { category: 'transitions', name: 'whoosh' },
  ERROR:       { category: 'sfx', name: 'error' },
  WARNING:     { category: 'warnings', name: 'alert-pulse' },
  CRITICAL:    { category: 'warnings', name: 'critical-alert' },
  SUCCESS:     { category: 'success', name: 'confirm' },
  TYPING:      { category: 'sfx', name: 'typing' },
  LOCK:        { category: 'impacts', name: 'lock' },
  MATERIALIZE: { category: 'sfx', name: 'materialize' },
}
```

Semua nama file di atas SUDAH ADA di
`public/audio/{ui,transitions,sfx,warnings,success,impacts}/*.wav`
(dicek via `Desktop Commander:list_directory` sebelum plan ini ditulis,
sesuai `docs/standardizations/08-audio-sfx-generation.md` §2) — **tidak
perlu sourcing SFX baru sama sekali** untuk topic ini, konsisten dengan
scope "quick-win produksi" yang diminta user.

## Icon: Tidak Perlu AI-Generate (Scope Kecil)

Semua visual topic ini (laptop, server, sticky note bertakuk sudut,
kotak git/repo, lock, mata scanner) cukup digambar sebagai shape SVG
manual (rect/path sederhana + variasi bentuk sesuai
`docs/standardizations/03-tutorial-buat-topic-baru.md` § 3.6 "Visual
Jangan Monoton Kotak") — TIDAK perlu masuk pipeline
`06-icon-generation.md` (AI-generate/download logo). Ini konsisten
dengan sifat topic yang sengaja dibuat kecil & cepat.

## Checklist Sebelum Implementasi Kode (lihat juga
`docs/standardizations/03-tutorial-buat-topic-baru.md` bagian Checklist)

- [ ] Plan ini direview/disetujui user
- [ ] Folder `src/content/env-variables/{Animation.jsx,data.js,manifest.js}`
      dibuat
- [ ] `registry.js` — tambah entry baru (bukan uncomment, topic ini
      belum ada placeholder sebelumnya) di Tier 2, pakai pola spread
      manifest (lihat `tailscale`/`linux-vs-unix`/`container-docker`)
- [ ] Tiap Act ikuti 4-beat table di atas saat coding (bukan cuma
      daftar fakta)
- [ ] Minimal 1 elemen visual non-rect per Act (speech bubble/karakter/
      badge/sticky note bertakuk)
- [ ] `window.__animationTimeline` + `window.__flushSync` + cleanup
      `tl.kill()`
- [ ] SFX browser sinkron dengan `SFX_SCHEDULES` di
      `scripts/export-lib.js` (saat fase export video dikerjakan —
      lihat catatan Fase 4 di `EXECUTION_PLAN.md`)
- [ ] Konsep teknis di atas (§ Konsep Teknis WAJIB Akurat) tidak
      dilanggar — terutama poin 3 (env var tidak selalu lewat file
      `.env` fisik) dan poin 4 (alasan git history permanen)
- [ ] Wording ringkas & tanpa emoji di teks produksi, tanpa kata ganti
      orang (lihat `docs/standardizations/03-tutorial-buat-topic-baru.md`
      § "Wording Ringkas & Tanpa Emoji")
- [ ] Laptop & Server di Act 1 dirender sebagai OBJEK ANCHOR persisten
      (1 `id` tetap per device, di luar blok conditional per-Act),
      dipakai ulang di Act 2 untuk nempelin sticky note via `gsap.to()`
      — BUKAN di-popIn ulang
- [ ] Cek tidak ada kalimat identik yang tampil dobel di 2 kanal
      berbeda (caption `say()` vs card/badge `popIn()`) di waktu
      berdekatan — lihat "3.7 Satu Kanal per Kalimat" di
      `docs/standardizations/02-standar-konten.md`
- [ ] Formula cek overlap horizontal
      (`docs/standardizations/05-svg-text-guide.md` § "Formula Cek
      Overlap") diterapkan ke 2 sticky note yang berdampingan di Act 2
      (Laptop vs Server) — jangan cuma andalkan eyeball
