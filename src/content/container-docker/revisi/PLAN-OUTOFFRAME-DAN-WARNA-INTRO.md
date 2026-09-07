# Plan — "OS SENDIRI" Keluar Frame & Warna Oranye di Intro

**Date**: 2026-09-06
**Status**: ANALISA & PLAN — **belum eksekusi**, menunggu approval
**Metode numbering**: hierarki dot-notation sesuai `PROJECT_STRUCTURE.md`
**File terkait**: `container-docker/Animation.jsx` + `data.js`, dibandingkan
pola resminya di `tailscale/Animation.jsx` + `data.js` dan dokumen standar
(`docs/standardizations/03-tutorial-buat-topic-baru.md`,
`docs/standardizations/05-svg-text-guide.md`)

---

## 1. Phase 1 — Label "OS SENDIRI" (dan Elemen Lain) Keluar Frame

### 1.1. Akar Masalah (Root Cause, Sudah Diverifikasi Baris-per-Baris)

1.1.1. Ada 2 pola berbeda buat nge-reveal elemen di timeline ini:
   - **Pola normal (`popIn()` helper)** — dipakai HAMPIR semua elemen.
     Helper ini SELALU set 4 field: `{ scale, opacity, x: fromX, y: fromY }`
     (default `fromX=0, fromY=0` kalau tidak dikasih opsi).
   - **Pola custom "boot lambat"** — dipakai KHUSUS 2 animasi yang perlu
     SFX disk-spin & durasi beda dari popIn biasa (bukan pop instan, tapi
     tween manual `bootObj.v` 0→1). Polanya manggil `setPop()` LANGSUNG,
     cuma isi `{ scale, opacity }` — **field `x` dan `y` tidak pernah
     di-set sama sekali**.

1.1.2. Helper `P(id)` di baris ~76:
   ```js
   const P = (id) => pop[id] || { scale: 0, opacity: 0, x: 0, y: 0 }
   ```
   Default `x:0, y:0` ini CUMA jalan kalau `pop[id]` masih `undefined`.
   Begitu `setPop()` custom di atas jalan (walau cuma isi `scale`+`opacity`),
   `pop[id]` jadi truthy object → dipakai APA ADANYA → `p.x` dan `p.y`
   jadi `undefined`.

1.1.3. Helper `T(id, cx, cy)` di baris ~471:
   ```js
   const T = (id, cx, cy) => `translate(${cx + p.x}, ${cy + p.y}) scale(${p.scale})`
   ```
   `cx + undefined` = `NaN`. Hasilnya string transform jadi
   `"translate(NaN, NaN) scale(0.83)"` — **`NaN` bukan token angka valid**
   di attribute SVG `transform`, jadi browser nge-drop SELURUH transform
   attribute itu (fallback ke "tidak ada transform" a.k.a identity),
   BUKAN di-treat sebagai `translate(0,0)`.

1.1.4. Akibatnya: elemen itu dirender di titik origin coordinate system
   parent `<g>`-nya (bukan di posisi `cx,cy` yang dimaksud) — yang
   kebetulan jatuh persis di pojok kiri-atas dari `<g transform=
   "translate(0, 90)">` pembungkus Act tsb, dalam skala PENUH (bukan
   discale kecil, karena `scale(...)` ikut ke-drop juga dalam 1 string
   transform yang sama). Ini persis match sama gejala yang dilaporkan:
   **"OS SENDIRI" nongol jauh di pojok kiri, bukan cuma sedikit geser.**

### 1.2. Lokasi Persis yang Kena Bug (2 Titik, Sudah Dicek Semua)

1.2.1. **Act 1 — `slot-0/1/2`** (SlotBox berlabel "OS SENDIRI", lalu
   berubah jadi "CONTAINER" pas Act 5). Kode di
   `Animation.jsx` (dalam `APPS.forEach` blok "3 VM box muncul
   SATU-SATU, berat/lambat"):
   ```js
   tl.add(() => setPop(prev => ({ ...prev, [`slot-${i}`]: { scale: 0, opacity: 0 } })), t + 1.1 + i * 0.9)
   tl.to(bootObj, {
     v: 1, duration: 0.75, ease: 'power1.out',
     onStart: () => sfxLoader.impact(SFX_MAP.DISK_SPIN.name, ...),
     onUpdate: () => setPop(prev => ({ ...prev, [`slot-${i}`]: { scale: bootObj.v, opacity: bootObj.v } })),
   }, t + 1.1 + i * 0.9)
   ```
   **Dampak ganda**: karena `slot-i` adalah ANCHOR yang dipakai lagi di
   Act 5 (tidak di-reset/pop-in ulang, cuma ganti warna/label/width lewat
   state lain), bug NaN ini ketularan ke Act 5 juga — slot box bakal tetap
   nongol di pojok kiri sepanjang Act 1 **dan** Act 5, bukan cuma Act 1.

1.2.2. **Act 2 — `guestOS-0/1/2`** (DiagramBox label "GUEST OS" +
   `KernelDot` + teks "kernel sendiri"). Pola identik:
   ```js
   tl.add(() => setPop(prev => ({ ...prev, [`guestOS-${i}`]: { scale: 0, opacity: 0 } })), t + 1.3 + i * 0.5)
   tl.to(bootObj, {
     v: 1, duration: 0.9, ease: 'power1.inOut',
     onStart: () => sfxLoader.impact(SFX_MAP.DISK_SPIN.name, ...),
     onUpdate: () => setPop(prev => ({ ...prev, [`guestOS-${i}`]: { scale: bootObj.v, opacity: bootObj.v } })),
   }, t + 1.3 + i * 0.5)
   ```
   Sama-sama bug: 3 box "GUEST OS" di Act 2 kemungkinan BESAR juga nongol
   di pojok kiri, bukan di posisi `410 + cx, 360` yang dimaksud.

### 1.3. Kenapa CUMA 2 Tempat Ini (Sudah Dicek Semua Titik Lain)

1.3.1. Semua elemen lain yang dirender lewat `T(id, cx, cy)` — `laptopAnchor`,
   `appChip-0/1/2`, `meterAnchor`, `faceAnchor`, `hookBubble`,
   `cliffhangerCard`, `hwBar2`, `hypervisorBox`, `vmInsightBadge`,
   `vmCaptionCard`, `hwBar3`, `kernelBox`, `dockerEngineBox`,
   `kernelArrow-0/1/2`, `containerBox-0/1/2`, `namespaceLabel`,
   `cgroupLabel`, `containerInsightBadge`, `containerPayoffCard`,
   `vmPanel4`, `containerPanel4`, `tradeoffQuestionBadge`,
   `isolationWallVM`, `isolationWallContainer`, `tradeoffCaptionCard`,
   `closingNoteCard`, `closingLineCard`, `closingBrandBadge` — SEMUA
   lewat `popIn()` helper yang selalu sertakan `x`/`y`. **Aman, tidak
   ada bug serupa.**
1.3.2. `sizeBar` & `bootBar` (Act 4) — pola tween manual mirip (`bootObj`-
   style tanpa x/y), TAPI dirender BUKAN lewat `T()` — dipakai langsung
   `P('sizeBar').scale` buat hitung lebar `<rect>` manual. Jadi kebetulan
   AMAN dari bug NaN-transform ini, walau pola kodenya sama-sama
   "setPop manual di luar helper" (bukan aman by design, cuma kebetulan
   tidak butuh field x/y).
1.3.3. **Kesimpulan**: bug ini murni soal 2 blok kode yang lupa include
   `x: 0, y: 0` pas nulis pola custom di luar `popIn()` helper — bukan
   soal posisi `cx, cy` yang salah dihitung (angka `410 + cx` dkk semua
   sudah benar).

### 1.4. Rencana Perbaikan (2 Opsi, Belum Dieksekusi)

1.4.1. **Opsi A (disarankan)** — tambah `x: 0, y: 0` ke tiap object
   literal yang di-`setPop` manual, di kedua lokasi (§1.2.1 & §1.2.2,
   masing-masing 2 titik: initial state + `onUpdate`, total 4 titik
   edit). Minimal invasive — tidak ubah timing, SFX, atau durasi apa
   pun, murni nambah 2 field yang kurang.
1.4.2. **Opsi B** — refactor 2 blok ini jadi helper baru (mis.
   `popInCustom`) yang terima custom `onProgress` callback, biar semua
   reveal-animation konsisten lewat 1 jalur helper (tidak ada lagi pola
   "setPop manual di luar helper"). Lebih rapi secara arsitektur, tapi
   effort & risiko regresi lebih besar untuk manfaat yang sama persis
   dengan Opsi A.
1.4.3. **Rekomendasi: Opsi A** — kecil, aman, langsung nembak akar
   masalah tanpa menyentuh apa pun yang lain.

---

## 2. Phase 2 — Warna Oranye di Intro Harus Jadi Biru

### 2.1. Temuan

2.1.1. Pola brand resmi project (dari
   `docs/standardizations/03-tutorial-buat-topic-baru.md` §"Tips Teknis
   Lain": *"Palet warna khas project: mint `#2CD1A8`, sky blue
   `#38BCF8`, navy/gelap `#0F172A`"*) — dan bukti konkretnya di
   `tailscale/data.js` (topic acuan kontrak baru):
   ```js
   CRYPTO: '#2CD1A8',   // mint
   SUCCESS: '#38BDF8',  // sky blue
   ```
   dipakai persis di title-split intro tailscale: **`"TAIL"` (mint) +
   `"SCALE"` (sky blue)** — brand 2-tone judul intro project SELALU
   mint+biru, bukan warna semantik konten topic itu.

2.1.2. Container-docker saat ini pakai title-split **`"CONTAINER"`
   (`COLORS.CONTAINER` = hijau `#34D399`) + `" vs VM"` (`COLORS.VM` =
   oranye `#FB923C`)**. Kode di `Animation.jsx`:
   ```js
   const titleSplitIdx = 9 // "CONTAINER" (hijau) | " vs VM" (oranye)
   const cursorColor = tt.length <= titleSplitIdx ? COLORS.CONTAINER : COLORS.VM
   ...
   <tspan fill={COLORS.CONTAINER}>{tt.slice(0, titleSplitIdx)}</tspan>
   <tspan fill={COLORS.VM}>{tt.slice(titleSplitIdx)}</tspan>
   ```
   Warna kedua (oranye) menyimpang dari pola brand mint/biru tailscale —
   ini kejadian karena `COLORS.VM` (warna semantik "Virtual Machine" di
   ISI konten Act 1-4: badge, meter, slot warna) ikut kepakai juga untuk
   title-split brand, padahal 2 hal ini seharusnya independent (title
   brand vs warna semantik konten).
2.1.3. Konfirmasi tambahan — `docs/standardizations/05-svg-text-guide.md`
   §"Color Palette Project" justru MENDAFTAR oranye `#FB923C` resmi
   sebagai warna semantik **"Process, Activity"**. Jadi oranye MEMANG
   bagian sah dari palet project secara keseluruhan (bukan warna asing),
   TAPI khusus untuk elemen semantik konten (persis kayak dipakai VM di
   sini), **bukan** untuk title-split brand intro. Interpretasi user
   ("standar = ijo+biru, gak ada oranye") tepat kalau maksudnya pola
   2-tone intro/logo — bukan klaim "oranye gak ada di app sama sekali".
2.1.4. Elemen intro lain yang ikut oranye: **blinking cursor** —
   `cursorColor` jadi `COLORS.VM` begitu proses ngetik masuk ke bagian
   `" vs VM"`. Ini otomatis ikut kebenar kalau title-split-nya diganti.
2.1.5. **Temuan tambahan (di luar permintaan eksplisit user, dicatat
   pas audit)** — tagline kategori `"ADIB-DEV.COM"` di header
   container-docker pakai `COLORS.CONTAINER` (hijau):
   ```js
   {INTRO_CATEGORY} · <tspan fill={COLORS.CONTAINER} fontWeight={700}>ADIB-DEV.COM</tspan>
   ```
   sedangkan tailscale pakai `COLORS.SUCCESS` (biru `#38BDF8`) untuk
   elemen yang SAMA persis (watermark brand, bukan konten topic).
   Watermark brand harusnya 1 warna konsisten lintas-topic (biru),
   bukan ikut warna semantik topic masing-masing — tapi ini CUMA
   dicatat sebagai temuan tambahan, keputusan fix-nya perlu approval
   terpisah karena di luar 2 poin yang diminta.

### 2.2. Rencana Perbaikan (Draft, Belum Dieksekusi)

2.2.1. Ganti tspan kedua title dari `fill={COLORS.VM}` jadi warna biru —
   pakai **`COLORS.KERNEL`** (`#38BDF8`, sky blue) karena hex-nya
   **PERSIS SAMA** dengan `COLORS.SUCCESS` tailscale (`#38BDF8`) —
   paling akurat ke standar brand, tanpa perlu nambah konstanta warna
   baru di `data.js`.
2.2.2. Ganti `cursorColor` fallback (§2.1.4) dari `COLORS.VM` jadi
   `COLORS.KERNEL` juga — 1 baris yang sama, konsisten dengan §2.2.1.
2.2.3. **TIDAK** mengubah `COLORS.VM` (oranye) di tempat lain — badge
   Act 1 (`badgeColor: COLORS.VM`), meter merah→oranye, warna awal slot
   box, dst. Itu semua warna semantik konten "Virtual Machine" yang
   SUDAH SESUAI standar semantik resmi (§2.1.3) — scope perbaikan CUMA
   di title-split + cursor intro, tidak menyentuh body Act 1-4.
2.2.4. **(Opsional, butuh keputusan user terpisah)** — kalau mau
   sekalian benerin temuan §2.1.5, ganti fill `ADIB-DEV.COM` tagline
   dari `COLORS.CONTAINER` ke `COLORS.KERNEL` (biru) biar match
   tailscale persis. Tidak termasuk 2 poin yang diminta user, jadi
   ditaruh terpisah sebagai opsional.

---

## Ringkasan & Next Step

| Phase | Isu | Status Analisa | Butuh Keputusan User |
|---|---|---|---|
| 1 | "OS SENDIRI" (& "GUEST OS" Act 2) keluar frame ke pojok kiri | ✅ Root cause ketemu — `setPop()` manual di 2 lokasi lupa isi `x`/`y`, transform jadi `NaN` & di-drop browser | Approve Opsi A (tambah `x:0,y:0`, 4 titik edit) |
| 2 | Warna oranye di title-split intro | ✅ Dikonfirmasi menyimpang dari pola brand mint/biru tailscale, oranye tetap valid utk semantik konten (bukan intro) | Approve ganti `COLORS.VM`→`COLORS.KERNEL` di title-split + cursor (2 titik). §2.2.4 (ADIB-DEV.COM) opsional, keputusan terpisah |

**Tidak ada perubahan kode/file live yang dilakukan di analisa ini** —
murni riset & rencana, sesuai permintaan "buat plan analisa dulu, jangan
eksekusi dulu".

---

## 3. Phase 3 — Audit Kelengkapan Icon (Node/Python/Redis Belum Ada) & Sapuan Emoji

### 3.1. Temuan — Inventaris Lengkap SEMUA Elemen Visual per Act

Dicek 1-per-1 tiap komponen yang dirender di `Animation.jsx` (bukan cuma
yang ditanya user), status icon dibandingkan `icons/icons.json` (hasil
Phase 4 sebelumnya):

| Act | Elemen | Status Saat Ini | Icon? |
|---|---|---|---|
| 1 & 5 (anchor) | `LaptopBody` | `<image>` `laptop.png` | ✅ |
| 1 & 5 (anchor) | `SlotBox` × 3 (label "OS SENDIRI"→"CONTAINER") | rect + dot + text, TANPA icon | ⚠️ (lihat 3.2) |
| **1 & 5 (anchor)** | **`appChip` × 3 (Node/Python/Redis)** | **`TextCard` — teks polos doang, NOL icon** | **❌ GAP dikonfirmasi** |
| 1 & 5 (anchor) | `Meter` (RAM/CPU) | bar + label teks, TANPA icon | ⚠️ (lihat 3.2, by-design mirip data bar) |
| 1 & 5 (anchor) | `FaceCharacter` | lingkaran+mata+mulut manual | ✅ (justru direkomendasikan `03-tutorial` §3.6, BUKAN gap) |
| 1 | `hookBubble`/`cliffhangerCard` | Badge/TextCard (teks callout) | ✅ (memang bukan "objek", callout teks) |
| 2 | `hwBar2` (HARDWARE LAPTOP) | `DiagramBox filled=false`, TANPA icon | ⚠️ (lihat 3.2, sengaja — pola `Badge/ServerBox` tailscale) |
| 2 | `hypervisorBox` | `DiagramBox` + accent `hypervisor-icon` | ✅ |
| 2 | `guestOS` × 3 | `DiagramBox` + accent `guest-os-icon` + `KernelDot` | ✅ |
| 2 | `vmInsightBadge`/`vmCaptionCard` | Badge/TextCard (callout) | ✅ (bukan objek) |
| 3 | `hwBar3` | sama seperti `hwBar2` | ⚠️ (sama, sengaja) |
| 3 | `kernelBox` | `DiagramBox` + accent `host-kernel-icon` | ✅ |
| 3 | `dockerEngineBox` | `DiagramBox` + accent `docker-engine-icon` | ✅ |
| 3 | `kernelArrow` × 3 | garis putus-putus + panah (dekorasi, bukan objek) | ✅ (memang dekorasi) |
| 3 | `containerBox` × 3 | `DiagramBox` + accent `container-icon` | ✅ |
| 3 | `namespaceLabel`/`cgroupLabel`/badge lain | Badge (callout) | ✅ (bukan objek) |
| 4 | **`vmPanel4`** | `DiagramBox` label "VIRTUAL MACHINE", **TANPA icon** | ⚠️ GAP asimetris (lihat 3.3) |
| 4 | `containerPanel4` | `DiagramBox` + accent `container-icon` | ✅ |
| 4 | `isolationWallVM`/`isolationWallContainer` | `<image>` `isolation-wall-thick/thin` | ✅ |
| 4 | `tradeoffQuestionBadge`/`tradeoffCaptionCard` | Badge/TextCard (callout) | ✅ (bukan objek) |
| 5 | `closingNoteCard`/`closingLineCard`/`closingBrandBadge` | TextCard/Badge (callout) | ✅ (bukan objek) |

### 3.2. Klarifikasi Elemen "⚠️ Tanpa Icon" — Bukan Berarti Semua Itu Gap

3.2.1. **`SlotBox` (Act 1/5)** — box kecil (150×80) berisi dot warna +
   label teks ("OS SENDIRI"/"CONTAINER"). Ini POLA DATA/LABEL BOX
   (mirip `Badge`), bukan representasi 1 objek fisik tunggal — beda
   kategori dengan `DiagramBox` (HYPERVISOR, GUEST OS, dst) yang
   memang representasi konsep/komponen fisik. Menambah icon di sini
   opsional/kosmetik, bukan gap fungsional.
3.2.2. **`Meter` (RAM/CPU)** — progress bar data numerik, sesuai
   `03-tutorial-buat-topic-baru.md` §3.6 tabel "Peran → Bentuk": data
   numerik boleh tetap bar/pill polos (opsional + icon pendukung kecil,
   TIDAK wajib).
3.2.3. **`hwBar2`/`hwBar3` (HARDWARE LAPTOP)** — SENGAJA tanpa icon,
   ini keputusan eksplisit dari `revisi/PLAN-4-ISU-KONSISTENSI-VS-
   TAILSCALE.md` §4.3 (draft icon awal), meniru pola `Badge`/`ServerBox`
   di tailscale yang juga sengaja tetap shape manual (card/label,
   bukan objek fisik tunggal). **Bukan gap, konsisten dgn standar.**

### 3.3. Gap yang Dikonfirmasi Perlu Icon Baru

3.3.1. **`appChip` Node/Python/Redis (Act 1 & 5)** — INI gap yang
   ditanya user, dan dikonfirmasi BENAR: `APPS.map()` di `data.js` cuma
   render `TextCard` (kotak teks polos), NOL representasi visual
   (bukan cuma "belum accent", tapi 100% tanpa icon sama sekali) —
   beda kategori dgn kasus §3.2 karena Node/Python/Redis itu objek
   konkret (aplikasi/teknologi spesifik) yang idealé direpresentasikan
   icon, bukan cuma label/data.
3.3.2. **`vmPanel4` (Act 4, panel "VIRTUAL MACHINE")** — asimetris
   dibanding `containerPanel4` di sebelahnya yang SUDAH dapat accent
   `container-icon` (dari Phase 4 sebelumnya). Sebenarnya ada icon yang
   bisa dipakai ulang tanpa generate baru: `guest-os-icon` atau
   `hypervisor-icon` (sudah ada di `icons.json`), tinggal dipasang
   sebagai accent di `DiagramBox` yang sama seperti pola Act 2/3 —
   TIDAK butuh generate PNG baru untuk ini.

### 3.4. Draft Icon Batch Baru (Node/Python/Redis) — Perlu Approval

3.4.1. **Peringatan trademark (WAJIB, sama seperti catatan Docker
   Engine di `PLAN-4-ISU-KONSISTENSI-VS-TAILSCALE.md` §4.4.1)** — logo
   asli Node.js (hexagon hijau), Python (2 ular biru-kuning), dan Redis
   (kubus merah) SEMUA trademark terdaftar. Icon HARUS digenerate versi
   **abstrak/generik** (terinspirasi bentuk umum: hex-shape utk Node,
   coil/lingkaran ganda generik utk Python, cube/block generik utk
   Redis) — BUKAN reproduksi logo asli, persis prinsip yang sudah
   dipakai utk `docker-engine-icon`.
3.4.2. Draft kandidat (perlu diverifikasi dulu warna final saat
   eksekusi, samakan dgn warna brand masing² platform versi generik):
   - `node-icon` — bentuk hexagon sederhana, hijau (~`#68A063`, generik)
   - `python-icon` — bentuk 2 kurva/coil bertautan generik, biru-kuning
     (~`#3776AB` + `#FFD43B`, generik, BUKAN bentuk ular asli)
   - `redis-icon` — bentuk cube/block stack sederhana, merah (~`#DC382D`,
     generik, BUKAN logo cube asli Redis)
3.4.3. Estimasi: 3 icon baru → cukup ditambahkan ke batch generate
   berikutnya (grid kecil 3 icon, atau gabung ke sisa slot kosong kalau
   masih ada sisa dari grid 3×3 sebelumnya — cek dulu apakah ada slot
   ke-9 yang kosong di `icons.json` generation §rows/cols).
3.4.4. Setelah PNG jadi → tambah entry ke `icons/loader.js`, pasang di
   `appChip-0/1/2` (ganti `TextCard` jadi `<image>` + label kecil di
   bawahnya, atau `TextCard` + accent icon di kiri — pilih salah satu
   pola, disamakan lagi saat eksekusi).
3.4.5. Untuk `vmPanel4` (§3.3.2) — TIDAK perlu generate baru, cukup
   tambah prop `icon="hypervisor-icon"` (atau `guest-os-icon`) ke
   `DiagramBox` yang sudah ada, sama seperti pola `containerPanel4`.
