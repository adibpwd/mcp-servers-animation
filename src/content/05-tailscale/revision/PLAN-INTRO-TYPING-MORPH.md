# Plan — Ganti Intro Tailscale jadi "Hacker Typing → Morph" (gaya `linux-vs-unix`)

> Status: **draft plan, belum dieksekusi**. Referensi implementasi asli ada di
> `src/content/linux-vs-unix/Animation.jsx` (fungsi `seededRandom01`, `typeLine`,
> state `typed`/`cursorVisible`, dan blok render header di bagian JSX).

## 1. Kondisi Sekarang (Tailscale)

Intro Tailscale saat ini di `Animation.jsx`:

- Judul + subtitle langsung ditampilkan penuh (bukan diketik karakter-per-karakter).
- Durasi tampil ± 0.9 detik (`t += 0.9 // waktu baca judul besar`).
- Morph ke header kecil pakai `lerp()` posisi/ukuran (`morphP` 0→1, 0.8s,
  `power3.inOut`) — bagian morph ini **sudah sama** dengan linux-vs-unix,
  cuma tidak didahului efek ketik.
- Tidak ada state `typed` / `cursorVisible`.
- Tidak ada baris tagline monospace kecil di atas judul (linux-vs-unix punya
  `LINUX CORE · ADIB-DEV.COM`).

## 2. Target (samain gaya `linux-vs-unix`)

1. Title (`TAILSCALE`) dan subtitle (`Nembus NAT tanpa buka port satu pun`)
   diketik karakter-per-karakter dengan efek "hacker typing":
   - Delay antar-karakter bervariasi tapi **deterministik** (seeded random,
     bukan `Math.random()`) — lihat alasan di bagian 4.
   - Ada suara ketik (`SFX_MAP.TYPING`) tiap karakter muncul, dengan pitch
     sedikit bervariasi (juga seeded).
2. Setelah selesai ketik title + jeda kecil + ketik subtitle, kursor blok
   (`█`) berkedip 3x sebagai jeda baca sebelum morph.
3. Morph ke header kecil — **pakai mekanisme yang sudah ada** (`morphP` lerp),
   tidak perlu diubah.
4. (Opsional, ikutin gaya linux-vs-unix) Tambah 1 baris tagline monospace
   kecil di atas judul besar, misal: `MESH VPN · ADIB-DEV.COM` — perlu
   konfirmasi ke user dulu apakah mau dipakai juga di Tailscale atau cukup
   title+subtitle saja tanpa tagline.

## 3. Perubahan File

### 3.1 `src/content/tailscale/Animation.jsx`

**a. Tambah helper deterministic random (copy dari linux-vs-unix, taruh di
luar komponen, dekat `lerp`):**

```js
// seeded pseudo-random — WAJIB, jangan Math.random() (lihat bagian 4)
const seededRandom01 = (seed) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}
```

**b. Tambah state baru di dalam komponen:**

```js
const [typed, setTyped] = useState({ title: '', subtitle: '' })
const [cursorVisible, setCursorVisible] = useState(true)
```

(state `showIntro` dan `morphP` sudah ada, tidak perlu diubah)

**c. Tambah helper `typeLine` (copy pola dari linux-vs-unix, sesuaikan nama
variabel):**

```js
const typeLine = (tl, startTime, lineKey, fullText, opts = {}) => {
  const { minDelay = 40, maxDelay = 100, avgDelay = 60 } = opts
  const lineSeed = lineKey === 'title' ? 1.7 : 9.3
  let acc = ''
  let time = startTime
  for (let i = 0; i < fullText.length; i++) {
    const char = fullText[i]
    const rand = seededRandom01(i * 12.9898 + lineSeed)
    const variance = (rand - 0.5) * (maxDelay - minDelay)
    const delay = Math.max(minDelay, Math.min(maxDelay, avgDelay + variance))
    const pitchSeed = seededRandom01(i * 5.1 + (lineKey === 'title' ? 2.3 : 8.7))
    const pitch = 0.98 + pitchSeed * 0.04

    tl.add(() => {
      acc += char
      setTyped(prev => ({ ...prev, [lineKey]: acc }))
      sfxLoader.sfx(SFX_MAP.TYPING.name, { volume: volumeRef.current * 1.6, speed: speedRef.current * pitch })
    }, time)
    time += delay / 1000
  }
  return time - startTime
}
```

> Cek dulu: apakah `SFX_MAP.TYPING` sudah ada di `tailscale/data.js`? Kalau
> belum, tambahkan entry-nya (lihat `linux-vs-unix/data.js` untuk referensi
> nama file SFX yang dipakai).

**d. Ganti blok INTRO di master timeline** (yang sekarang tampil instan)
jadi urutan: reset state → ketik title → jeda → ketik subtitle → cursor
blink 3x → jeda → morph → sembunyikan intro. Pola waktu ikut persis
linux-vs-unix:

```js
tl.add(() => {
  setShowIntro(true)
  setMorphP(0)
  setTyped({ title: '', subtitle: '' })
  setCursorVisible(true)
}, t)
t += 0.3

t += typeLine(tl, t, 'title', INTRO_TITLE, { minDelay: 40, maxDelay: 100, avgDelay: 60 })
t += 0.3

t += typeLine(tl, t, 'subtitle', INTRO_SUBTITLE, { minDelay: 35, maxDelay: 85, avgDelay: 55 })

for (let i = 0; i < 3; i++) {
  tl.add(() => {
    setCursorVisible(v => !v)
    if (audioUnlockedRef.current) sfxLoader.ui(SFX_MAP.TICK.name, { volume: volume * 0.9, speed })
  }, t + i * 0.35)
}
t += 1.05
t += 0.35

tl.add(() => {
  setCursorVisible(false)
  sfxLoader.transition(SFX_MAP.TELEPORT.name, { volume, speed })
  if (audioUnlockedRef.current) sfxLoader.success(SFX_MAP.CHARGE.name, { volume: volumeRef.current, speed })
}, t)
const mo = { p: 0 }
tl.to(mo, { p: 1, duration: 0.8, ease: 'power3.inOut', onUpdate: () => setMorphP(mo.p) }, t)
t += 0.8

tl.add(() => setShowIntro(false), t)
t += 0.3
```

Catatan: kode `TELEPORT`/`CHARGE`/`WHOOSH_LOW` yang sekarang dipakai di intro
Tailscale (lihat kode existing) sudah cocok dipertahankan — cuma ditaruh di
titik waktu yang baru (setelah cursor blink, bukan langsung di awal).

**e. Ganti blok render header (bagian JSX return, dalam IIFE `morphP`
section)** dari nampilin teks statis `INTRO_TITLE`/`INTRO_SUBTITLE` jadi
nampilin `typed.title` / `typed.subtitle` + cursor kondisional, contoh pola:

```jsx
{(() => {
  const mp = morphP
  const thumbWidth = 420
  const startX = (VW / 2) - (thumbWidth / 2)
  const endX = 44
  const titleX = lerp(startX, endX, mp)
  const titleY = lerp(640, 100, mp)
  const titleFs = lerp(72, 44, mp)
  const subX = lerp(startX, endX, mp)
  const subY = lerp(716, 130, mp)
  const subFs = lerp(20, 15, mp)
  return (
    <g>
      <text x={titleX} y={titleY} textAnchor="start" fontSize={titleFs}
        fontFamily="'Arial Black', Impact, sans-serif" fontWeight={900} fill={COLORS.BRAND} filter="url(#glow)">
        {typed.title}
        {showIntro && typed.title.length < INTRO_TITLE.length && cursorVisible && (
          <tspan fill={COLORS.BRAND} fontWeight={900}>█</tspan>
        )}
      </text>
      <text x={subX} y={subY} textAnchor="start" fontSize={subFs}
        fontFamily="sans-serif" fill={COLORS.MUTED}>
        {typed.subtitle}
        {showIntro && typed.title.length === INTRO_TITLE.length &&
          typed.subtitle.length < INTRO_SUBTITLE.length && cursorVisible && (
          <tspan fill={COLORS.BRAND} fontWeight={900}>█</tspan>
        )}
      </text>
    </g>
  )
})()}
```

Catatan bedanya sama linux-vs-unix: Tailscale posisi title/subtitle rata
kiri (`textAnchor="start"`, `startX`/`endX`) bukan rata tengah-lalu-kiri
statis kayak linux-vs-unix (`x={44}` fixed) — **pertahankan pola lerp
`startX`/`endX` yang sudah ada di Tailscale**, jangan ikut ganti ke fixed
`x={44}` biar animasi hero-thumbnail-ke-header morph-nya tidak berubah.

### 3.2 `src/content/tailscale/data.js`

Cek `SFX_MAP` — pastikan key berikut ada (linux-vs-unix pakai semua ini di
intro-nya): `TYPING`, `TICK`, `TELEPORT`, `CHARGE`. Kalau ada yang belum,
tambahkan mapping ke file SFX yang sudah ada di `shared/audio/` (jangan bikin
file SFX baru kalau linux-vs-unix sudah punya yang bisa dipakai bareng).

## 4. Kenapa Wajib Seeded Random (Jangan `Math.random()`)

Timeline animasi ini di-mount ulang di beberapa proses Chrome terpisah saat
export (`detectDuration`, `captureAudio`, tiap `captureSegment` worker). Kalau
delay ketik pakai `Math.random()`, tiap proses dapat urutan acak **beda** →
total durasi intro beda antar proses → semua timestamp Act 1 dst (dihitung
relatif `t` dari situ) ikut geser beda antara audio-pass dan video-pass →
hasil export video/audio **tidak sinkron**. Dengan seeded random, hasilnya
tetap "kelihatan acak" (gaya ngetik hacker) tapi identik persis di setiap
mount, sehingga video & audio pasti sinkron. (Ini persis alasan yang sudah
didokumentasikan di komentar `linux-vs-unix/Animation.jsx`.)

## 5. Dampak ke Durasi Total & `PHASES`

Intro lama Tailscale: ~0.9s (baca) + 0.8s (morph) + 0.3s (jeda) ≈ 2.0s.
Intro baru (dengan typing): ketik "TAILSCALE" (9 char, ~60ms/char rata-rata)
≈ 0.54s + jeda 0.3s + ketik subtitle (~35 char, ~55ms/char) ≈ 1.9s + cursor
blink 1.05s + jeda 0.35s + morph 0.8s + jeda 0.3s ≈ **~5.2s total**, naik
±3.2s dari intro lama.

- `PHASES[i].duration` di `data.js` **tidak perlu diubah** — durasi Act tetap
  relatif terhadap `t` masing-masing, jadi Act 1 dst otomatis mundur ~3.2s
  tapi durasinya sendiri tidak berubah.
- Total durasi video export akan bertambah ±3.2 detik. Perlu re-check
  `export-lib.js` / `getVideoStats` tidak hardcode durasi total di tempat
  lain (setahu ini sudah dihitung dinamis dari timeline, tapi tetap perlu
  di-verify pas testing).

## 6. Checklist Eksekusi

- [ ] Cek `SFX_MAP` di `tailscale/data.js` punya key `TYPING` (tambah kalau belum)
- [ ] Tambah `seededRandom01` + `typeLine` di `Animation.jsx`
- [ ] Tambah state `typed` & `cursorVisible`
- [ ] Ganti blok INTRO di master timeline (bagian 3.1.d)
- [ ] Ganti blok render header (bagian 3.1.e) — pertahankan pola lerp
      `startX`/`endX` rata-kiri Tailscale, jangan disamain ke fixed `x={44}`
      linux-vs-unix
- [ ] Preview `/player/tailscale`, pastikan efek ketik + cursor blink + morph
      jalan mulus dan suara ketik tidak numpuk/kepotong
- [ ] Export single-process, cek audio & video tetap sinkron (poin ini yang
      paling kritis — lihat bagian 4)
- [ ] (Opsional) tanya user: mau tambah baris tagline monospace kecil di atas
      judul (`MESH VPN · ...`) kayak linux-vs-unix, atau cukup title+subtitle
      tanpa tagline?

## 7. Yang TIDAK Diubah

- Mekanisme morph (`morphP` lerp posisi/ukuran) — sudah identik dengan
  linux-vs-unix, tidak disentuh.
- Konten teks `INTRO_TITLE` / `INTRO_SUBTITLE` — tetap sama, cuma cara
  tampilnya yang berubah (diketik, bukan langsung muncul).
- Struktur Act 1–5 sesudah intro — tidak berubah sama sekali, cuma mundur di
  waktu (`t`) karena intro jadi lebih panjang.


---

## 8. Revisi Tambahan — Warna Intro Belum Sesuai Standar Project (Ganti ke Ijo/Biru)

> Status: **draft plan, belum dieksekusi**. Ini revisi lanjutan setelah bagian
> 1-7 di atas sudah dieksekusi (efek ketik + morph sudah jalan). Yang belum
> beres cuma soal warna.

### 8.1 Temuan

Judul (`TAILSCALE`), subtitle, dan kursor blok (`█`) di intro sekarang masih
pakai `COLORS.BRAND` (indigo `#6366F1`) — warna yang sama juga dipakai di
banyak elemen lain sepanjang topic ini (grid garis latar belakang,
`cliffhanger1` box Act 1, `installIconHome/Office` Act 2, `closingCard`
border & `closingBrandBadge` Act 5). Indigo ini tidak mencerminkan "warna
project" yang lebih relevan buat cerita Tailscale: hijau mint
(`COLORS.CRYPTO` — dipakai untuk WireGuard key/enkripsi di Act 2) dan biru
langit (`COLORS.SUCCESS` — dipakai untuk P2P direct connection berhasil di
Act 4).

### 8.2 Target

Ganti kombinasi warna intro (title + subtitle + kursor) dari flat indigo
(`COLORS.BRAND`) jadi kombinasi hijau + biru sesuai palet project:

- Title `TAILSCALE` di-split 2 warna pakai multi-`tspan` (pola yang sama
  kayak `linux-vs-unix` split `UNIX`/`MUTED`/`GOLD`/`LINUX` di 1 baris judul):
  sebagian huruf hijau (`COLORS.CRYPTO`), sisanya biru (`COLORS.SUCCESS`).
  Titik split-nya perlu preview dulu di browser, bukan tebak-tebakan — draft
  awal: `TAIL` hijau, `SCALE` biru (index 4).
- Subtitle tetap pakai `COLORS.MUTED` (netral) — biar kontras sama title
  tetap kebaca, tidak ikut-ikutan hijau/biru.
- Kursor blok (`█`) ikut warna segmen huruf yang lagi diketik: hijau kalau
  posisi ketik masih di bagian `CRYPTO`, biru kalau udah masuk bagian
  `SUCCESS`. Pola ini sama seperti linux-vs-unix yang kursor title vs
  subtitle-nya beda warna.
- Efek `filter="url(#glow)"` tetap dipertahankan, cuma source color-nya yang
  ganti.

### 8.3 Scope — Cuma Intro, atau Seluruh File?

`COLORS.BRAND` (indigo) dipakai juga di elemen non-intro sepanjang
`Animation.jsx` (hasil grep: grid latar belakang, `cliffhanger1` box Act 1,
`installIconHome`/`installIconOffice` Act 2, `closingCard` border &
`closingBrandBadge` Act 5, plus default `color` prop di helper `SpeechBubble`
& `Badge`). Plan ini defaultnya **HANYA ubah bagian intro** (title/subtitle/
cursor), TIDAK menyentuh elemen indigo lain di luar intro. Full repaint semua
elemen jadi hijau/biru itu scope terpisah & lebih besar — perlu dikonfirmasi
dulu (lihat 8.6) sebelum digabung ke sini.

### 8.4 Perubahan File (kalau dieksekusi)

`src/content/tailscale/Animation.jsx` — ganti bagian render header (yang di
plan awal ada di 3.1.e):

```jsx
{(() => {
  const mp = morphP
  const thumbWidth = 420
  const startX = (VW / 2) - (thumbWidth / 2)
  const endX = 44
  const titleX = lerp(startX, endX, mp)
  const titleY = lerp(640, 100, mp)
  const titleFs = lerp(72, 44, mp)
  const subX = lerp(startX, endX, mp)
  const subY = lerp(716, 130, mp)
  const subFs = lerp(20, 15, mp)

  const titleSplitIdx = 4 // "TAIL" | "SCALE" — perlu preview dulu, bisa geser
  const tt = typed.title
  const cursorColor = tt.length <= titleSplitIdx ? COLORS.CRYPTO : COLORS.SUCCESS

  return (
    <g>
      <text x={titleX} y={titleY} textAnchor="start" fontSize={titleFs}
        fontFamily="'Arial Black', Impact, sans-serif" fontWeight={900} filter="url(#glow)">
        <tspan fill={COLORS.CRYPTO}>{tt.slice(0, titleSplitIdx)}</tspan>
        <tspan fill={COLORS.SUCCESS}>{tt.slice(titleSplitIdx)}</tspan>
        {showIntro && tt.length < INTRO_TITLE.length && cursorVisible && (
          <tspan fill={cursorColor} fontWeight={900}>█</tspan>
        )}
      </text>
      <text x={subX} y={subY} textAnchor="start" fontSize={subFs}
        fontFamily="sans-serif" fill={COLORS.MUTED}>
        {typed.subtitle}
        {showIntro && tt.length === INTRO_TITLE.length &&
          typed.subtitle.length < INTRO_SUBTITLE.length && cursorVisible && (
          <tspan fill={COLORS.SUCCESS} fontWeight={900}>█</tspan>
        )}
      </text>
    </g>
  )
})()}
```

Catatan: `fill={COLORS.BRAND}` yang sebelumnya ada di `<text>` title (lihat
bagian 3.1.e plan awal) dihapus dari situ, dipecah ke tiap `<tspan>`.
Mekanisme lerp posisi/ukuran (`titleX/Y/Fs`, `subX/Y/Fs`) dan morph
(`morphP`) **tidak berubah sama sekali**.

### 8.5 Kenapa Bukan Warna Asli Brand Tailscale

Sempat dicek referensi brand asli Tailscale (situs resminya) — warna
utamanya justru cenderung merah/rust (`#D04841`), bukan hijau/biru sama
sekali. Jadi "ijo/biru" di sini murni ngikutin palet internal project ini
(`COLORS.CRYPTO` + `COLORS.SUCCESS`) biar konsisten sama elemen
WireGuard/P2P yang sudah dipakai di Act 2 & Act 4 — bukan usaha nyamain ke
branding asli Tailscale yang sebenarnya beda warna.

### 8.6 Yang Perlu Dikonfirmasi ke User Sebelum Eksekusi

- [ ] Titik split warna title di huruf ke berapa yang paling enak diliat
      (butuh preview browser, draft awal index 4 = "TAIL"/"SCALE")?
- [ ] Subtitle & kursor tetap ngikutin skema di 8.2, atau ada preferensi lain
      (misal subtitle ikut hijau/biru juga, bukan `MUTED`)?
- [ ] Scope cuma intro (default plan ini), atau sekalian ganti semua elemen
      `COLORS.BRAND` lain di luar intro (grid, cliffhanger, install icon,
      closing badge) — lihat 8.3?
- [ ] `manifest.js` (`color: '#6366F1'`, dipakai buat warna kartu topic di
      `ContentList`/`registry.js`) — ikut diganti juga atau dibiarin beda
      sama warna intro?

### 8.7 Checklist Eksekusi (Kalau Sudah Dikonfirmasi)

- [ ] Tentuin titik split warna title (butuh preview browser, bukan tebakan)
- [ ] Update blok render header sesuai 8.4
- [ ] Preview `/player/tailscale` — cek transisi warna title→cursor→subtitle
      kebaca jelas & kontras cukup di atas `COLORS.BG` (`#070913`)
- [ ] Cek morph ke header kecil (font-size ngecil ke 44px) — pastikan split
      warna tidak "pecah" aneh pas ukuran kecil
- [ ] Kalau scope diperluas ke 8.3 — list ulang semua baris `COLORS.BRAND`
      yang mau diganti + warna penggantinya, satu-satu (jangan search-replace
      buta karena beberapa itu default prop helper `SpeechBubble`/`Badge`
      yang dipakai berulang di banyak Act)


---

## 9. Revisi Tambahan — Tagline "SERIES · ADIB-DEV.COM" Belum Ada di Tailscale

> Status: **draft plan (analisa), belum dieksekusi**. Dipicu observasi user:
> topic `virtual-memory` punya baris kecil monospace di atas judul besar
> (`LINUX CORE · ADIB-DEV.COM`), Tailscale tidak punya baris itu sama sekali.
> Ini sebenarnya poin yang sama kayak yang udah disebut sebagai opsional di
> bagian 2 plan awal (poin 4) — sekarang dianalisa lebih detail + dibikinin
> plan konkretnya.

### 9.1 Analisa — Topic Mana Aja yang Punya Tagline Ini

Hasil grep `ADIB-DEV` ke semua `Animation.jsx` di `src/content/*/`:

| Topic | Punya tagline? | Teks tagline | Warna aksen "ADIB-DEV.COM" |
|---|---|---|---|
| `linux-vs-unix` | ✅ | `LINUX CORE · ADIB-DEV.COM` | `COLORS.LINUX` |
| `virtual-memory` | ✅ | `LINUX CORE · ADIB-DEV.COM` | `#2CD1A8` (hijau) |
| `desktop-environment` | ✅ | `LINUX BASICS · ADIB-DEV.COM` | `#38BDF8` (biru) |
| `file-permission` | ✅ | `LINUX GUIDE · ADIB-DEV.COM` | `#38BCF8` (biru) |
| `linux-vs-windows` | ✅ | `OS COMPARISON · ADIB-DEV.COM` | `#8B5CF6` (violet) |
| `mcp-servers`, `process-vs-thread`, `shell-pipeline`, `what-is-kernel`, `linux-kernel-architecture` | ❌ | — | — |
| **`tailscale`** | ❌ | — | — |

Jadi ini BUKAN standar wajib yang berlaku di semua topic (6 dari 11 topic
tidak punya), tapi pola yang konsisten dipakai di topic-topic yang lebih
baru/lebih matang (termasuk `virtual-memory` yang jadi acuan user). Label
kategorinya (`LINUX CORE`, `LINUX BASICS`, `LINUX GUIDE`, `OS COMPARISON`)
beda-beda per topic, sesuai kategori kontennya masing-masing — bukan teks
yang sama persis di-copy-paste ke semua topic.

### 9.2 Analisa — Mekanisme Render (Bagaimana Tagline-nya Kerja)

Semua topic yang punya tagline naruhnya di dalam blok IIFE render header yang
sama (satu paket sama title + subtitle), bukan elemen terpisah yang
di-gate `showIntro` sendiri — persis kayak title/subtitle di Tailscale
sekarang. Bedanya per topic cuma di posisi X:

- `virtual-memory` & `linux-vs-unix`: `taglineX = lerp(44, VW/2, mp)` —
  mulai di kiri (X=44, nempel sejajar sama title pas full-screen), lalu
  geser ke tengah pas morph selesai (karena badge/tagline di header compact
  biasanya di-tengah-tengahin di atas title kecil). `textAnchor` ikut ganti
  `"start"` → `"middle"` waktu `mp` lewat 0.5.
- `desktop-environment` & `file-permission` & `linux-vs-windows`: lebih
  simpel, `x={VW/2}` fixed dengan `textAnchor="middle"` terus dari awal
  sampai akhir (tidak ikut morph horizontal).
- Semua sama-sama: `taglineY` & `taglineFs` (nama variable beda-beda tiap
  file, tapi konsepnya sama) di-`lerp` dari posisi besar (dekat title) ke
  posisi kecil (~y=30, di atas title compact), font dari ~22-24px ke ~16px.
- Tagline **TIDAK diketik** karakter-per-karakter (beda dari title/subtitle
  Tailscale yang sekarang pakai efek ketik) — dia langsung tampil penuh dari
  awal, cuma posisinya yang animasi lewat `lerp`.

### 9.3 Kenapa Tailscale Beda

Tailscale itu topic yang dibikin belakangan dengan pola intro sendiri
(morph dari "hero thumbnail" di tengah `startX`/`endX` berbasis
`thumbWidth`, bukan `VW/2` fixed kayak beberapa topic lain — lihat bagian
7 "Yang TIDAK Diubah" di plan awal). Waktu intro Tailscale dibikin, baris
tagline ini kelewat/belum diprioritaskan — sudah disebut di plan awal
bagian 2 poin 4 sebagai opsional yang "perlu konfirmasi user dulu", dan
belum pernah dikonfirmasi sampai sekarang.

### 9.4 Target

Tambah 1 baris tagline monospace kecil di atas judul besar `TAILSCALE`,
ikut pola yang sama (posisi & timing lerp) kayak `virtual-memory`/
`linux-vs-unix`, tapi geometrinya disesuaikan ke mekanisme `startX`/`endX`
milik Tailscale sendiri (bukan `VW/2` fixed) — biar konsisten sama title/
subtitle Tailscale yang sudah ada, sesuai catatan "jangan ikut ganti ke
fixed" di plan awal bagian 3.1.e.

- Teks: `NETWORKING · ADIB-DEV.COM` — pakai kata "NETWORKING" karena itu
  persis `category` yang sudah didefinisikan di `manifest.js` topic ini
  (`category: 'Networking'`), konsisten sama cara topic lain milih label
  kategori (bukan sekadar tebak-tebakan teks baru). Alternatif lain kalau
  user maunya lebih spesifik ke isi cerita: `MESH VPN · ADIB-DEV.COM`
  (ini yang sempat disebut di draft awal bagian 2 poin 4).
- Warna aksen `ADIB-DEV.COM`: `COLORS.SUCCESS` (biru) — nyambung sama
  warna segmen akhir title "SCALE" hasil revisi bagian 8, biar transisi
  mata dari tagline → title kerasa nyambung (bukan warna baru pihak
  ketiga). Alternatif: `COLORS.CRYPTO` (hijau) kalau mau nyambung ke
  segmen awal "TAIL" sebagai gantinya.
- Posisi: `taglineX = lerp(startX, endX, mp)` — pakai `startX`/`endX` yang
  SAMA dengan yang dipakai title/subtitle Tailscale (bukan `VW/2`), dengan
  `textAnchor` tetap `"start"` dari awal sampai akhir (Tailscale dari awal
  memang rata-kiri terus, beda dari virtual-memory yang pindah ke
  `"middle"` pas morph — TIDAK perlu ikut itu, biar geometrinya tetap
  konsisten sama title/subtitle yang sudah ada).
- `taglineY`: lerp dari sedikit di atas `titleY` awal (misal `600`, di atas
  `640` posisi title awal) ke `78` (sedikit di atas `titleY` morph = `100`).
- `taglineFs`: lerp dari `18` ke `13`.
- TIDAK diketik karakter-per-karakter — statis tampil penuh dari awal
  intro (sama seperti topic lain), supaya tidak nambah durasi intro yang
  sudah naik ±3.2 detik dari revisi bagian 1-7.

### 9.5 Perubahan File (kalau dieksekusi)

`src/content/tailscale/Animation.jsx` — tambah 1 elemen `<text>` tagline di
awal blok render header, sebelum `<text>` title (lanjutan dari hasil
revisi bagian 8.4):

```jsx
{(() => {
  const mp = morphP
  const thumbWidth = 420
  const startX = (VW / 2) - (thumbWidth / 2)
  const endX = 44
  const taglineY = lerp(600, 78, mp)
  const taglineFs = lerp(18, 13, mp)
  const titleX = lerp(startX, endX, mp)
  const titleY = lerp(640, 100, mp)
  const titleFs = lerp(72, 44, mp)
  const subX = lerp(startX, endX, mp)
  const subY = lerp(716, 130, mp)
  const subFs = lerp(20, 15, mp)

  const titleSplitIdx = 4 // "TAIL" (hijau) | "SCALE" (biru)
  const tt = typed.title
  const cursorColor = tt.length <= titleSplitIdx ? COLORS.CRYPTO : COLORS.SUCCESS

  return (
    <g>
      <text x={lerp(startX, endX, mp)} y={taglineY} textAnchor="start"
        fill={COLORS.MUTED} fontSize={taglineFs} fontFamily="monospace" letterSpacing={3}>
        NETWORKING · <tspan fill={COLORS.SUCCESS} fontWeight={700}>ADIB-DEV.COM</tspan>
      </text>
      <text x={titleX} y={titleY} textAnchor="start" fontSize={titleFs}
        fontFamily="'Arial Black', Impact, sans-serif" fontWeight={900} filter="url(#glow)">
        <tspan fill={COLORS.CRYPTO}>{tt.slice(0, titleSplitIdx)}</tspan>
        <tspan fill={COLORS.SUCCESS}>{tt.slice(titleSplitIdx)}</tspan>
        {showIntro && tt.length < INTRO_TITLE.length && cursorVisible && (
          <tspan fill={cursorColor} fontWeight={900}>█</tspan>
        )}
      </text>
      <text x={subX} y={subY} textAnchor="start" fontSize={subFs}
        fontFamily="sans-serif" fill={COLORS.MUTED}>
        {typed.subtitle}
        {showIntro && tt.length === INTRO_TITLE.length &&
          typed.subtitle.length < INTRO_SUBTITLE.length && cursorVisible && (
          <tspan fill={COLORS.SUCCESS} fontWeight={900}>█</tspan>
        )}
      </text>
    </g>
  )
})()}
```

Catatan: tagline pakai `startX`/`endX` yang sama kayak title/subtitle biar
3 baris teks selalu sejajar rata-kiri, baik pas full-screen maupun pas jadi
header compact.

### 9.6 Dampak ke Timing/Durasi

Tidak ada — tagline statis (bukan diketik), tidak nambah state baru ke
timeline, tidak geser durasi intro yang sudah dihitung di bagian 5. Cuma
nambah 1 elemen visual yang posisinya ikut `mp` (morph progress) yang
sudah ada.

### 9.7 Yang Perlu Dikonfirmasi ke User Sebelum Eksekusi

- [ ] Teks kategori: `NETWORKING` (ikut `manifest.js`) atau `MESH VPN`
      (lebih spesifik ke cerita)?
- [ ] Warna aksen `ADIB-DEV.COM`: biru (`COLORS.SUCCESS`, nyambung ke
      "SCALE") atau hijau (`COLORS.CRYPTO`, nyambung ke "TAIL")?
- [ ] Posisi `taglineY` awal (`600`) — ini jarak ke title (`640`) cukup
      renggang atau perlu digeser, perlu preview browser buat mastiin.

### 9.8 Checklist Eksekusi (Kalau Sudah Dikonfirmasi)

- [ ] Tambah `<text>` tagline sesuai 9.5, taruh sebelum `<text>` title di
      blok render header
- [ ] Preview `/player/tailscale` — pastikan tagline kebaca jelas, tidak
      numpuk/ke-overlap sama title pas posisi awal (full-screen) maupun
      pas morph selesai (header compact, dekat PHASE BADGE di bawahnya)
- [ ] Cek 3 baris (tagline, title, subtitle) tetap sejajar rata-kiri di
      kedua ujung morph (`mp=0` dan `mp=1`)
- [ ] Export single-process — pastikan tidak ada elemen ke-crop di frame
      awal (posisi Y tagline `600` masih dalam viewBox `VH`)
