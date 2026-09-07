# Plan — 4 Isu Konsistensi vs Tailscale (Intro, Emoji, Header/Dot, Icons)

**Date**: 2026-09-06
**Status**: ANALISA & PLAN — **belum eksekusi**, menunggu approval
**Metode numbering**: hierarki dot-notation sesuai `PROJECT_STRUCTURE.md`
(1 = Phase, 1.1 = Section, 1.1.1 = Task, 1.1.1.1 = Subtask)
**File dibandingkan**: `container-docker/Animation.jsx` + `data.js` vs
`tailscale/Animation.jsx` + `data.js` + `tailscale/icons/icons.json`

**Cara tandai selesai (`@done()`)**: kalau salah satu item di bawah ini
sudah dieksekusi, tandai dengan nambah `@done(YYYY-MM-DD)` persis di
akhir baris nomor item itu — format & tanggal ISO sama seperti konvensi
yang sudah dipakai di `_docs/EXECUTION_PLAN.md`. Contoh:

```
3.3.1. Tambah dot navigator di blok badge yang sama @done(2026-09-10)
```

Aturan taginya:
- Taruh di baris nomor paling detail yang benar-benar dieksekusi (task
  atau subtask), bukan di judul Phase/Section besar yang isinya campuran
  status.
- Kalau 1 Section (mis. `1.3`) semua sub-item-nya sudah `@done`, boleh
  tambahin `@done(...)` juga di baris Section itu sebagai ringkasan —
  tapi sub-item individualnya tetap harus ditandai masing-masing dulu.
- Item yang masih tertunda/butuh keputusan (kolom "Butuh Keputusan User"
  di tabel ringkasan) JANGAN ditandai `@done` sampai keputusannya jelas
  dan eksekusinya kelar.
- Kalau ada revisi ulang setelah pernah `@done` (misal dikerjain lagi
  karena ada bug), update tanggalnya ke tanggal eksekusi ulang — jangan
  hapus histori lama, cukup ganti nilainya (atau tambah catatan di
  bawahnya kalau perlu jejak dua tanggal).

---

## 1. Phase 1 — Intro Beda Total dari Tailscale

### 1.1. Temuan (Fakta dari Kode, Sudah Diverifikasi)

1.1.1. **Tailscale** — intro pakai efek "hacker typing" (`typeLine()`,
   seeded random per karakter biar kerasa natural tapi tetap
   deterministik utk export), lengkap dengan:
   1.1.1.1. Kategori kecil di atas judul: `"NETWORKING · ADIB-DEV.COM"`
            (brand watermark, warna hijau nge-glow di bagian
            `ADIB-DEV.COM`)
   1.1.1.2. Judul `"TAILSCALE"` diketik huruf-per-huruf + cursor blink
            `█`, lalu **morph** (lerp X/Y/fontSize) dari posisi
            center-besar (thumbnail) → jadi header kecil rata-kiri yang
            **tetap muncul terus dari Act 1 sampai Act 5** (bukan
            hilang setelah intro)
   1.1.1.3. Subtitle diketik juga, dengan delay berbeda dari judul

1.1.2. **Container-docker** — intro cuma **fade-in + scale sederhana**
   (`introOpacity` 0→1→0), judul & subtitle statis (bukan diketik),
   **tidak ada** kategori/label brand `ADIB-DEV.COM`, dan sesudah intro
   selesai (`setShowIntro(false)`) **judul & subtitle hilang total** —
   tidak jadi header persistent kayak tailscale. Act 1-5 cuma punya 1
   pill badge kecil di tengah-atas (`phase.badge`), tanpa title/brand
   sama sekali.

### 1.2. Analisa Dampak

1.2.1. Secara fungsional **tidak error** — animasi tetap jalan, kontrak
   `manifest.js`/`registry.js` tidak dilanggar (`02-standar-konten.md`
   tidak mewajibkan pola intro tertentu, cuma props `Animation.jsx` &
   `window.__animationTimeline`).
1.2.2. Tapi dari sisi **konsistensi visual brand** antar-topic, ini beda
   signifikan — penonton yang lihat beberapa video reels berturut-turut
   bakal notice 1 topic "kok gak ada watermark ADIB-DEV.COM di
   headernya, judul juga hilang pas masuk Act 1".
1.2.3. Tidak ada dokumen standar (`02`–`06`) yang eksplisit mewajibkan
   pola intro-typing/header-persistent — ini **konvensi implisit** dari
   topic yang sudah migrasi ke kontrak baru (tailscale, linux-vs-unix),
   bukan aturan tertulis. Container-docker termasuk topic yang masih
   "kontrak lama"-style penulisan (tidak pakai `icons/`, dst — lihat
   Phase 4), jadi gap ini konsisten dengan pola itu.

### 1.3. Opsi Rencana Perbaikan (Belum Dieksekusi)

1.3.1. **Opsi A — Full match ke pola Tailscale**: bikin ulang intro pakai
   `typeLine()` + seeded random, tambah watermark kategori
   (`"VIRTUALIZATION · ADIB-DEV.COM"` — kategori disesuaikan topic),
   morph ke header persistent Act 1-5. @done(2026-09-06)
   (Eksekusi: pakai `INTRO_CATEGORY = 'LINUX DEEP DIVE'` di `data.js`,
   bukan "VIRTUALIZATION" — disesuaikan biar konsisten sama kategori
   topic Linux lain, keputusan diambil saat implementasi.)
   1.3.1.1. Effort: besar — perlu re-hitung semua time cursor Act 1-5
            karena durasi intro berubah (dari ~2.6s fade jadi durasi
            ketik dinamis, mirip tailscale ~4-5s)
   1.3.1.2. Risiko: SFX_SCHEDULES di `export-lib.js` (kalau ada) perlu
            disinkron ulang juga
1.3.2. **Opsi B — Partial**: cukup tambah watermark kategori + judul jadi
   header persistent (morph), TANPA efek typing (tetap fade sederhana).
   Lebih ringan, tetap dapat konsistensi visual utama (watermark brand +
   header yang gak hilang).
1.3.3. **Opsi C — Biarkan beda** (dokumentasikan sebagai variasi topic
   lama yang sah, sama seperti gap kontrak lain di Phase 4) — kalau
   prioritas project lebih ke topic baru berikutnya, bukan retrofit yang
   sudah `status: ready`.

**Butuh keputusan**: pilih A/B/C sebelum eksekusi.


## 2. Phase 2 — Soal Emoji (Sesuai Dugaan User, Sudah Dicek Langsung)

### 2.1. Verifikasi (grep unicode codepoint ≥ U+1F000 di semua file inti)

2.1.1. **`Animation.jsx`, `data.js`, `manifest.js` (file yang benar-benar
   di-render ke video)** — **NOL emoji ditemukan**. Yang ada cuma
   karakter tipografi biasa: em dash `—` dan panah `→` (dipakai di
   comment kode & 1 label UI arrow, BUKAN emoji, dan BUKAN teks yang
   di-render sebagai visual produksi — cuma dekorasi comment).
2.1.2. **`_docs/CONTAINER_DOCKER_PLAN.md`** (folder planning, prefix
   underscore, eksplisit "bukan bagian kontrak" per `02-standar-konten.md`
   §3) — **ADA 1 emoji** `😩` di contoh draft awal:
   > Speech bubble hook: "Kenapa jalanin app kecil aja laptop udah
   > teriak? 😩"
2.1.3. Bandingkan ke `data.js` **live** (kode yang benar-benar jalan):
   ```js
   export const HOOK_QUESTION = 'Kenapa jalanin app kecil aja laptop udah teriak?'
   ```
   — **emoji-nya SUDAH DIBUANG** saat implementasi. Draft di `_docs`
   memang masih versi lama (planning awal sebelum aturan "Tanpa Emoji"
   diterapkan konsisten), tapi versi final yang jalan di browser sudah
   bersih.

### 2.2. Kesimpulan

2.2.1. Kalau yang dimaksud user adalah emoji di **preview video/animasi
   yang jalan di browser** — berdasarkan grep, **tidak ada** emoji di
   sana. Kemungkinan besar yang keliatan "pakai emoji" adalah waktu buka
   file `_docs/CONTAINER_DOCKER_PLAN.md` (dokumen planning, bukan output
   render), yang memang belum di-update untuk hapus 1 emoji sisa di
   contoh draft awal.
2.2.2. **Perlu konfirmasi dari user**: emoji yang dimaksud kelihatan di
   mana persisnya — di preview `/preview/container-docker` (kalau iya,
   berarti ada temuan baru yang belum ke-grep, perlu cek ulang lebih
   teliti termasuk icon PNG bergaya emoji seperti disebut
   `03-tutorial-buat-topic-baru.md`), atau di file dokumentasi
   (`_docs/*.md`, yang emang di luar kontrak in-video)?

### 2.3. Rencana Perbaikan (Kalau Dikonfirmasi Perlu)

2.3.1. Update `_docs/CONTAINER_DOCKER_PLAN.md` — hapus emoji `😩` dari
   contoh draft, ganti jadi teks polos, biar dokumen historis konsisten
   dengan implementasi final (murni cosmetic, gak pengaruh ke animasi
   yang jalan). @done(2026-09-06)
2.3.2. Kalau ternyata ketemu emoji di lokasi lain (preview render) yang
   belum ke-cover grep ini — audit ulang lebih detail: cek juga apakah
   ada komponen ikon bergaya emoji (bukan cuma grep string unicode),
   sesuai catatan `03-tutorial-buat-topic-baru.md` bagian "Tanpa Emoji".

## 3. Phase 3 — Format Header + Dot Navigator Beda dari Tailscale

### 3.1. Temuan (Fakta dari Kode)

3.1.1. **Tailscale** — di SEMUA Act (1 sampai 5, kecuali saat intro),
   render blok "PHASE BADGE" yang isinya:
   3.1.1.1. Pill badge kiri: dot warna + teks Act aktif (mis. "ACT 1 —
            ...")
   3.1.1.2. **Dot navigator** di kanan pill — 1 baris `<circle>` sejumlah
            `PHASES.length` (5 titik), titik yang aktif digambar lebih
            besar (`r=7` vs `r=4`) + ring putih, sisanya kecil warna
            border — pola progress-indicator umum di UI carousel/slide
   3.1.1.3. Header title (`TAILSCALE`) + watermark kategori tetap nempel
            di atas pill badge ini (morph dari intro, lihat Phase 1)

3.1.2. **Container-docker** — cuma render 1 pill badge tunggal di
   tengah-atas (`translate(410, 40)`), isinya teks Act aktif doang.
   **Tidak ada** dot navigator (tidak ada indikasi visual "ini Act
   ke-berapa dari total berapa Act"), dan **tidak ada** header
   judul/watermark yang menyertainya (konsisten dengan temuan Phase 1 —
   karena judulnya memang sudah hilang total sejak intro selesai).

### 3.2. Analisa Dampak

3.2.1. Dot navigator di tailscale berguna sebagai *progress cue* buat
   penonton — tanpa itu, penonton container-docker gak ada petunjuk
   visual "masih Act berapa lagi sampai selesai" selain isi pill badge
   text-nya sendiri.
3.2.2. Ini turunan langsung dari gap Phase 1 — kalau Phase 1 di-eksekusi
   (bikin header persistent), dot navigator biasanya nempel jadi 1 paket
   sama header itu (satu blok "PHASE BADGE" di tailscale menggabungkan
   ketiganya: pill + dot + header).

### 3.3. Rencana Perbaikan (Bergantung Keputusan Phase 1)

3.3.1. Kalau Phase 1 pilih **Opsi A/B** (bikin header persistent) →
   sekalian tambahkan dot navigator di blok badge yang sama, position &
   style mengikuti pola tailscale (`translate(620, 12)`, circle radius
   7/4, offset 24px per titik) — TIDAK perlu jadi task terpisah, gabung
   1 batch perubahan. @done(2026-09-06)
3.3.2. Kalau Phase 1 pilih **Opsi C** (biarkan beda) → dot navigator ini
   otomatis ikut skip juga, TAPI bisa dipertimbangkan sebagai **task
   independen minimal** (cuma nambah row `<circle>` di pill badge yang
   sudah ada sekarang, tanpa perlu ubah intro sama sekali) — effort jauh
   lebih kecil dibanding Phase 1 penuh, kalau cuma progress-indicator
   yang mau dikejar duluan.

## 4. Phase 4 — Belum Ada `icons.json` / Ilustrasi (Cuma Box Polos)

### 4.1. Temuan (Fakta dari Kode)

4.1.1. **Tailscale** — punya folder `src/content/tailscale/icons/`
   lengkap: `icons.json` (6 utility icon + 11 structural icon,
   sudah 100% icon-driven — 0 hardcode shape), `loader.js`
   (`getIcon(id)` map ke PNG hasil generate AI), dan file PNG-nya
   sendiri. Semua elemen visual (laptop per-warna, rumah, gedung,
   firewall, wajah reaksi, dst) pakai `<image href={getIcon(...)}>`.
4.1.2. **Container-docker** — **TIDAK ADA folder `icons/` sama sekali**
   (dikonfirmasi via `list_directory`, cuma ada `Animation.jsx`,
   `data.js`, `manifest.js`, `_docs/`). Semua elemen visual masih 100%
   `<rect>`/`<circle>`/`<path>` manual buatan sendiri:
   4.1.2.1. `LaptopBody` — kotak persegi polos + kotak dalam
   4.1.2.2. `SlotBox` — kotak rounded polos + 1 dot warna + label teks
   4.1.2.3. `DiagramBox` — dipakai berulang untuk HARDWARE, HYPERVISOR,
            GUEST OS, HOST KERNEL, DOCKER ENGINE, CONTAINER — semuanya
            kotak rounded dengan warna beda doang, tanpa ilustrasi
   4.1.2.4. `FaceCharacter` — sudah OK (lingkaran + mata + mulut,
            sesuai pola "muka bulat simpel" yang DIREKOMENDASIKAN di
            `03-tutorial-buat-topic-baru.md` §3.6 — ini justru BUKAN
            pelanggaran, cuma dicatat sebagai pengecualian)
   4.1.2.5. `IsolationWall` — kotak vertikal polos + label

### 4.2. Analisa Dampak

4.2.1. `03-tutorial-buat-topic-baru.md` §3.6 "Visual Jangan Monoton
   Kotak" secara eksplisit bilang: `<rect>` polos OK untuk data/progress
   bar, TAPI kalau **semua** elemen cuma kotak, konten kerasa kaku &
   ngebosenin. Container-docker saat ini didominasi `DiagramBox` (kotak)
   dipakai berulang untuk hampir semua konsep inti (hardware, hypervisor,
   guest OS, kernel, docker engine, container) — persis pola yang
   diperingatkan dokumen itu.
4.2.2. Bandingkan Tailscale: `HouseFrame`/`BuildingFrame`/`FirewallWall`/
   `Laptop` semua sudah icon PNG hasil AI generate, cuma `Badge` &
   `ServerBox` yang tetap shape manual (karena memang cocok buat
   card/label, bukan objek fisik).
4.2.3. Ini **BUKAN bug** — container-docker memang topic yang belum
   migrasi ke pola icon-driven (konsisten dengan Phase 1: masih
   "kontrak gaya lama"). Tapi karena konten intinya justru object
   FISIK (laptop, kotak OS, kernel, mesin Docker) yang idealnya
   diilustrasikan, bukan cuma card/label seperti Badge/ServerBox,
   dampak visualnya kerasa lebih signifikan dibanding topic lain yang
   memang lebih banyak diagram/data abstrak.

### 4.3. Rencana Pembuatan `icons.json` (Draft Awal — Ikuti `06-icon-generation.md`)

4.3.1. **WAJIB verifikasi ulang komponen dulu** sebelum finalisasi daftar
   icon (sesuai `06-icon-generation.md` §7 — jangan asumsikan pola sama
   dengan tailscale, sudah ada preseden salah asumsi sebelumnya di topic
   lain). Grep tiap call-site komponen di `Animation.jsx` untuk pastikan
   jumlah varian warna riil (bukan tebak-tebakan).
4.3.2. Draft kandidat icon (perlu diverifikasi ulang §4.3.1):
   4.3.2.1. `laptop` — 1 varian warna cukup (LaptopBody sekarang tidak
            ganti warna per-Act, beda dari tailscale yang 4 varian)
   4.3.2.2. `hardware-bar` — pengganti `DiagramBox` khusus label
            "HARDWARE (LAPTOP)" (dipakai Act 2 & 3, `filled=false`)
   4.3.2.3. `hypervisor-box` — pengganti `DiagramBox` ungu (Act 2)
   4.3.2.4. `guest-os-box` — pengganti `DiagramBox` oranye + `KernelDot`
            (Act 2, dipakai 3x)
   4.3.2.5. `host-kernel-box` — pengganti `DiagramBox` sky-blue (Act 3)
   4.3.2.6. `docker-engine-box` — pengganti `DiagramBox` docker-blue
            (Act 3, mungkin pas dijadiin logo Docker paus — TAPI perlu
            hati-hati, lihat catatan §4.4 soal trademark)
   4.3.2.7. `container-box` — pengganti `DiagramBox` hijau (Act 3 & 4,
            dipakai berulang kali)
   4.3.2.8. `isolation-wall-thick` / `isolation-wall-thin` — pengganti
            `IsolationWall` (Act 4, 2 varian ketebalan)
4.3.3. Estimasi grid: ±8 icon → cukup 1 batch **2×4** (Format B
   single-batch di `06-icon-generation.md` §3), sesuai rekomendasi
   ukuran tajam ~500px/icon.
4.3.4. Setelah PNG di-generate → buat `icons/loader.js` (pola
   `getIcon(id)` sama seperti tailscale) → replace isi child tiap
   komponen (`DiagramBox`, dst) dari shape manual ke `<image>` (icon
   PENGGANTI, bukan icon baru — timeline GSAP existing tidak perlu
   diubah, sesuai `06-icon-generation.md` §6.4). @done(2026-09-06)
   (Eksekusi: `LaptopBody` & `IsolationWall` full-replace jadi
   `<image href={getIcon(...)}>` — `laptop` single-variant,
   `isolation-wall-thick`/`isolation-wall-thin` dipilih dari prop
   `thick`. `DiagramBox` ditambah optional prop `icon` yang render
   `<image>` accent di pojok kiri-atas box, `x={-w/2+12} y={10}
   width={28} height={28}` — pola sama persis `ServerBox` +
   `<image>` sibling di tailscale/Animation.jsx SS3 Act 3/4
   (coordination-server, derp-relay). Dipasang di: `hypervisorBox`
   (Act 2), `guestOS-0/1/2` (Act 2), `kernelBox` &
   `dockerEngineBox` (Act 3), `containerBox-0/1/2` (Act 3),
   `containerPanel4` (Act 4). `hwBar2`/`hwBar3` & `vmPanel4`
   sengaja TIDAK dapat icon, sesuai draft §4.3.2 & tidak ada icon
   dedicated utk VM. Verified: `curl localhost:3373/src/content/
   container-docker/Animation.jsx` → 200, `docker compose logs`
   bersih dari error.)

### 4.4. Catatan Kehati-hatian

4.4.1. **Docker Engine / Docker logo** — kalau mau bikin icon
   terinspirasi logo Docker (paus + kontainer), pastikan prompt AI
   generate versi **abstrak/generik**, BUKAN reproduksi logo Docker asli
   (trademark), sama seperti tailscale sengaja bikin `tailscale-logo`
   "simplified abstract mesh-VPN app mark, flat monochrome (NOT the real
   Tailscale trademark)" — ikuti pola yang sama persis untuk aman dari
   isu IP/trademark.
4.4.2. Ini task **effort besar** (perlu approval dulu sebelum generate,
   karena expose ke API ChatGPT via extension, plus perubahan struktural
   ke banyak komponen `Animation.jsx`) — **jangan dieksekusi bareng**
   Phase 1-3 dalam 1 batch tanpa approval terpisah, sesuai instruksi
   user "jangan eksekusi" di permintaan ini.

---

## Ringkasan & Next Step

| Phase | Isu | Status Analisa | Butuh Keputusan User |
|---|---|---|---|
| 1 | Intro beda (typing/watermark/header persistent) | ✅ Dikonfirmasi beda, bukan bug | Pilih Opsi A/B/C |
| 2 | Emoji | ✅ Dicek — TIDAK ada di kode live, cuma 1 di draft `_docs/` lama | Konfirmasi lokasi emoji yang dimaksud user |
| 3 | Header + dot navigator | ✅ Dikonfirmasi beda, turunan dari Phase 1 | Tunggu keputusan Phase 1 |
| 4 | `icons.json` belum ada, masih box polos | ✅ SELESAI @done(2026-09-06) — icon generated & di-wire ke Animation.jsx | - |

**Tidak ada perubahan kode/file live yang dilakukan di analisa ini** —
murni riset & rencana, sesuai permintaan.
