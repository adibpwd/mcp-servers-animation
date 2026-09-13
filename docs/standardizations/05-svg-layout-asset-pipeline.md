# 05 — SVG Layout & Asset Pipeline

> Status: **Standar aktif** — hasil konsolidasi 2026-09-13.
>
> Panduan produksi visual dari teks SVG, safe zone, dan layout sampai pipeline icon/asset.

## Cara Menggunakan Dokumen Ini

1. **Bab A: SVG text, koordinat, color, dan layout.**
2. **Bab B: pembuatan, crop, dan loader icon/asset.**

Dokumen sumber lama dipertahankan utuh di bawah sebagai bab agar detail,
contoh, checklist, dan keputusan historis tidak hilang. Heading dinaikkan satu
tingkat hanya untuk menyesuaikan struktur dokumen gabungan.

---

## Bab A — SVG Text & Layout

## 05 — SVG Text Guide

> Alur baca lengkap: `01-architecture` → `02-standar-konten` → `03-tutorial-buat-topic-baru` → `04-referensi-gsap` → **`05-svg-text-guide`** → `06-icon-generation` → `08-audio-sfx-generation`

### Masalah: SVG Text Tidak Support Word Wrap

HTML punya auto wrap, SVG tidak. `<text>` di SVG tidak mengenal konsep
"width" — text akan render 1 baris sampai infinity dan overflow keluar
boundary.

### Solusi 1 — Manual Line Break dengan `<tspan>`

```jsx
<text x={36} y={24} fontSize={14} fill="#94A3B8">
  <tspan x={36} dy={0}>Baris pertama text yang panjang sampai</tspan>
  <tspan x={36} dy={20}>baris kedua dengan proper line break.</tspan>
</text>
```

- `x={36}` — reset posisi horizontal di TIAP tspan, wajib untuk left-align konsisten
- `dy={0}` — baris pertama, tanpa offset vertikal
- `dy={18-22}` — baris berikutnya, offset dari baris sebelumnya

**Formula spacing:** `dy = fontSize * 1.3 sampai 1.5` (setara line-height)

```
fontSize 11 → dy 16-18   |  fontSize 14 → dy 18-22
fontSize 12 → dy 17-19   |  fontSize 16 → dy 20-24
```

Untuk styling inline (warna/bold sebagian kata), pakai nested `<tspan>`:

```jsx
<text x={36} y={24} fontSize={14} fill="#64748B" fontFamily="monospace">
  <tspan x={36} dy={0}>
    Setiap halaman = 4 KB data. Kernel memutuskan di{' '}
    <tspan fill="#A78BFA" fontWeight={700}>Physical Frame</tspan> mana
  </tspan>
  <tspan x={36} dy={20}>setiap halaman disimpan.</tspan>
</text>
```

### Solusi 2 — Multiple Boxes (Rekomendasi untuk 3+ Baris)

```jsx
{/* Box 1 - Technical Content */}
<g transform="translate(0, 460)">
  <rect width={732} height={65} rx={14} fill="#0F172A" stroke="#334155" strokeWidth={1}/>
  <text x={36} y={24} fontSize={14} fontFamily="monospace" fill="#94A3B8">
    <tspan x={36} dy={0}>Technical explanation line 1...</tspan>
    <tspan x={36} dy={20}>Technical explanation line 2...</tspan>
  </text>
</g>

{/* Box 2 - General Explanation */}
<g transform="translate(0, 535)">
  <rect width={732} height={45} rx={14} fill="#0F172A" stroke="#334155" strokeWidth={1}/>
  <text x={36} y={28} fontSize={14} fontFamily="sans-serif" fill="#CBD5E1">
    General human-friendly explanation in separate box.
  </text>
</g>
```

**Pakai kalau:** 3+ baris, campuran konten technical (monospace) + general
(sans-serif), butuh pemisahan visual antar konsep, styling beda per bagian.

**Jangan pakai kalau:** cuma 1-2 baris (buang-buang ruang), space vertikal ketat.

#### Formula Tinggi Box

```
height = (fontSize * lineCount) + ((lineCount - 1) * lineSpacing) + topPadding + bottomPadding

1 baris  → 45px
2 baris  → 65px
3 baris  → 85px
```
Contoh hitung 2 baris: `fontSize 14, lineSpacing 20, topPadding 24, bottomPadding 17`
→ `(14×2) + (1×20) + 24 + 17 = 65px` ✅

### Solusi 3 — Reduce Font Size (Last Resort)

Maks reduksi 2px (14→12 OK, 14→10 TIDAK OK). Hanya untuk caption/info
sekunder, JANGAN untuk konten utama. Lebih baik **edit konten jadi lebih
concise** daripada mengecilkan font:

```jsx
{/* ❌ Panjang & font dikecilkan */}
<text fontSize={11}>The kernel will decide in which physical frame...</text>

{/* ✅ Concise & font normal */}
<text fontSize={14}>Kernel picks Physical Frame for each page.</text>
```

### Solusi 4 — Dynamic Text Width (Advanced, Dev-only)

```jsx
const textRef = useRef(null)
const [textWidth, setTextWidth] = useState(0)

useEffect(() => {
  if (textRef.current) setTextWidth(textRef.current.getBBox().width)
}, [textContent])
```
`getBBox()` hanya jalan setelah elemen ter-render ke DOM (tidak tersedia SSR).
Gunakan untuk debug mode atau konten dinamis (user-generated/translation).

### Common Pitfalls

1. **Lupa reset `x` di tiap `<tspan>`** → baris kedua ikut nge-indent aneh
   (offset dari akhir baris pertama). Selalu set `x={36}` di SEMUA tspan.
2. **`dy` tidak konsisten antar baris** → spacing timpang. Pakai angka yang
   sama tiap baris dalam 1 blok text.
3. **Box height tidak sesuai jumlah baris** → text keluar dari box. Hitung
   pakai formula di atas SEBELUM nulis konten.

### Text Measurement Helper (Estimasi Kasar)

```js
// Monospace — lebar per karakter konsisten
const monoCharWidth = { 11: 6.6, 12: 7.2, 14: 8.4, 16: 9.6 }
const estimateMonoWidth = (text, fs) => text.length * monoCharWidth[fs]

// Sans-serif — lebih variable, tambah buffer 10%
const sansCharWidth = { 11: 5.5, 12: 6.0, 14: 7.0, 16: 8.0 }
const estimateSansWidth = (text, fs) => text.length * sansCharWidth[fs] * 1.1
```
Ini estimasi kasar (tergantung font family/weight/karakter). Untuk presisi,
pakai `getBBox()` setelah render.

**Batas layout standar project:** box width `732px`, padding kiri-kanan
`36px`, usable width `660px` → fontSize 14 monospace ~78 char/baris,
fontSize 14 sans-serif ~94 char/baris (disarankan potong lebih awal, di
65-70 char untuk readability optimal).

### Typography & Kontras Warna

```jsx
{/* Title */}   <text fontSize={20} fontFamily="'Arial Black', sans-serif" fontWeight={900}>MAIN TITLE</text>
{/* Heading */} <text fontSize={16} fontWeight={700}>Section Heading</text>
{/* Technical */} <text fontSize={14} fontFamily="monospace" fill="#94A3B8">Technical content</text>
{/* General */}  <text fontSize={14} fontFamily="sans-serif" fill="#CBD5E1">Human-friendly explanation</text>
{/* Caption */}  <text fontSize={11} fill="#64748B">Additional info</text>
```

Kontras warna (background `#070913`) — semua sudah lolos WCAG AA:
`#E2E8F0` (12.8:1), `#CBD5E1` (10.5:1), `#94A3B8` (6.8:1), `#64748B`
(4.6:1, minimum untuk teks normal). `#475569` (3.2:1) pakai secukupnya
saja, borderline. WCAG AA minta min 4.5:1 untuk teks normal (14px), min
3:1 untuk teks besar (18px+). Cek di https://webaim.org/resources/contrastchecker/

### Color Palette Project

Palet warna standar dipakai konsisten di semua topic (dipindahkan dari
`src/content/README.md`, single source of truth sekarang di sini).

**Background Layers**
- Deep: `#070913` (background utama)
- Mid: `#0B1120` (card, box)
- Light: `#0F172A` (insight box)

**Border & Divider**
- Subtle: `#1E293B`
- Default: `#334155`
- Emphasized: `#475569`

**Text** (lihat kontras di atas)
- Primary: `#E2E8F0` — Secondary: `#CBD5E1` — Tertiary: `#94A3B8`
- Muted: `#64748B` — Dim: `#475569`

**Accent (per makna semantik)**
| Warna | Hex | Makna |
|---|---|---|
| Blue | `#38BDF8` | Browser, Info |
| Purple | `#A78BFA` | Game, Technical term |
| Green | `#34D399` | Success, RAM |
| Pink | `#F472B6` | Media, Audio |
| Yellow | `#FBBF24` | Video, Warning |
| Orange | `#FB923C` | Process, Activity |
| Red | `#F43F5E` | Alert, Swap, Error |
| Cyan | `#06B6D4` | Network, System |

Pakai warna semantik yang sesuai konteks (misal: elemen RAM selalu hijau,
elemen error selalu merah) supaya audiens bisa asosiasi warna↔konsep
lintas-topic tanpa perlu baca ulang label tiap kali.

**Warna title intro (morph header):** lihat rule wajib split-warna
title di `03-tutorial-buat-topic-baru.md` § "Langkah 2 — Bikin Intro" —
default kombinasi hijau (`Green #34D399`) + biru (`Blue #38BDF8`) dari
tabel di atas, kecuali topic punya pasangan warna semantik lain yang
lebih relevan ke cerita.

### Formula Cek Overlap Antar-Elemen Horizontal (Center-Anchor)

Komponen box/badge/card yang digambar dari titik lokal `x=0` sampai
`x=w`, lalu dipanggil dengan translate `x={-w/2}` di call site, secara
efektif **center di titik anchor-nya** dengan radius setengah-lebar
(`w/2`) ke kiri dan ke kanan:

```jsx
// Definisi komponen: rect digambar dari x=0 s/d x=w
const Badge = ({ x, y, text, w = 300 }) => (
  <g transform={`translate(${x},${y})`}>
    <rect width={w} height={40} rx={20} />
    <text x={w / 2} y={25} textAnchor="middle">{text}</text>
  </g>
)

// Dipanggil dengan translate x={-w/2} → efektif center di anchor
<g transform={T('badgeA', 300, 540)}>
  <Badge x={-150} y={0} text="..." w={300} />
</g>
```

Elemen ini menempati rentang absolut **`[anchor - w/2, anchor + w/2]`**.
Kalau ada 2 elemen sejenis bertetangga di posisi horizontal, keduanya
**aman dari overlap** hanya kalau:

```
|anchor2 - anchor1|  >=  (w1 / 2) + (w2 / 2) + gap_minimal
```

**Contoh kasus nyata (overlap, salah):**

```
Badge A: anchor x=300, w=300 → rentang 150–450
Badge B: anchor x=520, w=300 → rentang 370–670
Jarak anchor: |520-300| = 220
Dibutuhkan minimal: (300/2)+(300/2) = 300
220 < 300 → OVERLAP 80px (rentang 370–450 tabrakan)
```

**Fix (geser anchor, lebar tetap):**

```
Badge A: anchor x=250, w=300 → rentang 100–400
Badge B: anchor x=570, w=300 → rentang 420–720
Jarak anchor: |570-250| = 320 >= 300 → aman, sisa gap 20px
```

**Cara pakai formula ini sebelum commit:**
1. Untuk tiap elemen fixed-width yang sejajar secara horizontal, catat
   `anchor x` dan `w`.
2. Hitung jarak antar-anchor, bandingkan dengan jumlah setengah-lebar
   kedua elemen + gap minimal yang diinginkan (disarankan ≥15-20px).
3. Kalau kurang, pilih salah satu: geser anchor (aman, tidak mengubah
   lebar/text-wrap), atau perkecil `w` (perhatikan efek samping —
   text bisa ke-wrap jadi lebih banyak baris kalau `w` dikecilkan).

Prinsip yang sama berlaku untuk overlap **vertikal** — ganti `x`/`w`
dengan `y`/`height` di formula di atas.

**Jangan andalkan cuma eyeball di preview** untuk mengecek elemen fixed-
width sejajar — bug overlap kadang baru kelihatan jelas di ukuran layar
tertentu atau kelewat kalau elemen lain di dekatnya menutupi sebagian
tabrakan. Hitung dulu pakai formula di atas, baru verifikasi visual di
preview sebagai konfirmasi akhir (bukan pengganti perhitungan).

### Layout System for Animated SVG (Safe-Zone & Bounding Box)

Section ini melengkapi formula overlap horizontal di atas dengan sistem
zona VERTIKAL penuh — dipakai untuk topic bertingkat (header + badge +
browser/content + transit + service dalam satu canvas). Lihat juga
`09-standar-pembuatan-konten.md` §1.R Safe-Zone Layout Contract untuk
kontrak wajibnya; bagian ini fokus ke IMPLEMENTASI teknis SVG-nya.

#### Safe-Zone dan Coordinate Constants

Definisikan konstanta zona di `data.js`, JANGAN hardcode angka `y` lepas
di `Animation.jsx`:

```js
// data.js
export const HEADER_ZONE   = { yStart: 0,    yEnd: 90 }   // title/subtitle saja
export const BADGE_ZONE    = { yStart: 90,   yEnd: 140 }  // phase badge/dot nav
export const CONTENT_ZONE  = { yStart: 140,  yEnd: 560 }  // actor utama (browser/card)
export const TRANSIT_ZONE  = { yStart: 560,  yEnd: 760 }  // moving packet/ticket
export const SERVICE_ZONE  = { yStart: 760,  yEnd: 1180 } // processor/response
export const CLOSING_ZONE  = { yStart: 1180, yEnd: 1340 } // progress bar, tease badge
```

| Zona | Elemen yang boleh | Elemen yang dilarang |
|---|---|---|
| Header | title/subtitle | panel konten |
| Navigation/Badge | badge/dot | resource card |
| Content | actor utama | header |
| Transit | moving packet | text panjang |
| Service/result | proses/response | header |
| Closing | progress bar, tease | actor utama |

#### Bounding Box untuk Panel/Asset yang Berubah Ukuran

Panel yang tingginya berubah tergantung isi (jumlah baris teks, jumlah
field card) HARUS dihitung top/bottom-nya dari **center + height**, bukan
cuma `y` tetap:

```js
// ✅ GOOD — top/bottom dihitung dari center, ikut height dinamis
const panelTop = centerY - height / 2
const panelBottom = centerY + height / 2

// Cek terhadap batas zona SEBELUM render
if (panelBottom > CONTENT_ZONE.yEnd) {
  // panel akan menabrak TRANSIT_ZONE — perkecil height atau geser centerY
}
```

```js
// ❌ BAD — y tetap tanpa memeriksa height aktual panel
<rect y={500} height={panelHeightThatVaries} /> // bisa nabrak zona bawah kalau height membesar
```

#### Formula Gap Minimum Antar Zona

Sama seperti formula overlap horizontal di atas, tapi untuk vertikal:

```
gap_actual = zonaB.yStart - zonaA.yEnd
gap_actual >= gap_minimal (disarankan >= 20px)
```

Kalau sebuah elemen besar (mis. browser window) berpotensi melebihi
`CONTENT_ZONE.yEnd`, JANGAN perkecil zona secara diam-diam — perkecil
elemen atau pindahkan sebagian kontennya, lalu verifikasi ulang gap ke
`TRANSIT_ZONE.yStart`.

#### Teks Menempel pada Actor/Path

Label yang merujuk objek bergerak (`methodBadge`, `addressLabel`, dsb.)
WAJIB dihitung relatif terhadap posisi objek acuan saat itu — lihat
`09-standar-pembuatan-konten.md` §1.K:

```jsx
// ✅ GOOD — posisi label ikut posisi objek acuan (ticketPos), bukan hardcode
<text x={ticketPos.x} y={ticketPos.y - 24} textAnchor="middle">{methodLabel}</text>
```

#### Checklist Anti-Collision per Phase

- [ ] Hero/intro (t=0): title & subtitle tidak menabrak elemen `CONTENT_ZONE` yang sudah muncul lebih awal
- [ ] Tiap Act: panel/card terbesar yang mungkin tampil bersamaan sudah dihitung bounding box-nya, bukan dieyeball
- [ ] Closing: progress bar/tease badge tidak menabrak actor utama yang masih persist (lihat `04-referensi-gsap.md` § "Persistent Anchor Object")
- [ ] Cek dilakukan pada UKURAN CANVAS EXPORT SEBENARNYA (mis. `820x1340`), bukan cuma di preview browser yang mungkin ter-scale

#### Contoh: Title Hero Menjadi Compact Header Tanpa Mengganti Elemen

Pola lerp morph (lihat `03-tutorial-buat-topic-baru.md` Langkah 2) sudah
menerapkan prinsip "satu elemen yang berubah posisi/ukuran", bukan
crossfade dua elemen berbeda — ini juga aturan safe-zone: title hero
harus morph JADI header compact di `HEADER_ZONE`, bukan title hero
di-unmount lalu header baru di-mount terpisah (yang berisiko keduanya
sempat tumpang tindih di zona yang salah selama transisi).

**✅ DO:**
- Gunakan konstanta seperti `HEADER_ZONE`, `BADGE_ZONE`, `CONTENT_ZONE` — jangan angka `y` lepas
- Ukur top/bottom panel berdasarkan `centerY` dan `height`, bukan `y` tetap yang diasumsikan aman
- Cek collision pada ukuran canvas export sebenarnya

**❌ DON'T:**
- Jangan letakkan panel besar pada `y` tetap tanpa memeriksa tinggi panel aktual
- Jangan pakai nested `translate` berkali-kali tanpa satu coordinate reference yang jelas — ini bikin debug posisi susah saat panel membesar
- Jangan tempatkan caption global (`say()`) di zona header — header cuma untuk title/subtitle (lihat `03-tutorial-buat-topic-baru.md` § 3.7 soal satu-kanal-per-kalimat)

### Scene Zones V1 dan Local Coordinates (scene-ui V1)

Section ini adalah versi TERVERIFIKASI (langsung dari source
`src/shared/scene-ui/v1/PortraitSceneLayoutV1.js`) dari sistem zona di
atas, khusus untuk topic yang memakai scene-ui V1 (lihat
`09-standar-pembuatan-konten.md` §1.S untuk kapan wajib pakai). Kalau
topic tidak pakai V1 (opt-out custom), tetap pakai konstanta manual
seperti contoh `HEADER_ZONE`/`BADGE_ZONE`/dst di atas.

#### Token `DEFAULT_LAYOUT_V1`

Canvas `820 × 1340`. Semua angka dalam px, coordinate space SVG:

| Zona | Token | Nilai |
|---|---|---:|
| Canvas | `canvas.width` / `canvas.height` | 820 / 1340 |
| Header | `header.x` | 44 |
| Header | `header.taglineY` | 50 |
| Header | `header.titleY` | 100 |
| Header | `header.subtitleY` | 130 |
| Navigator | `navigator.x` / `navigator.y` | 44 / 155 |
| Navigator | `navigator.width` / `navigator.height` | 500 / 40 |
| Navigator | `navigator.dotsX` / `navigator.dotsY` | 620 / 175 |
| Navigator | `navigator.dotSpacing` | 24 |
| Navigator | `navigator.activeRadius` / `inactiveRadius` | 7 / 4 |
| Body | `body.x` / `body.y` | 44 / 235 |
| Body | `body.width` / `body.height` | 732 / 965 |
| Transit (sub-zona di dalam body, canvas coordinate) | `transit.yStart` | 476 |
| Service (sub-zona di dalam body, canvas coordinate) | `service.yStart` | 610 |
| Closing (sub-zona di dalam body, canvas coordinate) | `closing.yStart` | 1020 |

Zona turunan (dihitung, bukan di-hardcode kedua kali — lihat
`getZones()` di `PortraitSceneLayoutV1.js`):

```
header    : yStart 0                → yEnd navigator.y (155)
navigator : yStart navigator.y (155) → yEnd body.y (235)
body      : yStart body.y (235)      → yEnd body.y + body.height (1200)
transit   : yStart transit.yStart (476) → yEnd service.yStart (610)
service   : yStart service.yStart (610) → yEnd closing.yStart (1020)
closing   : yStart closing.yStart (1020) → yEnd canvas.height (1340)
```

| Zona | Elemen yang boleh | Elemen yang dilarang |
|---|---|---|
| Header | title/subtitle (`IntroHeaderMorphV1`) | panel konten |
| Navigator | badge/dot (`ActBadgeNavigatorV1`) | resource card |
| Body | actor utama (children `ContentBodyV1`) | header |
| Transit (dalam body) | moving packet | text panjang |
| Service (dalam body) | proses/response | header |
| Closing (dalam body) | progress bar, tease | actor utama |

#### Origin `ContentBodyV1` dan Local Coordinate

`ContentBodyV1` membungkus children dengan
`transform="translate(body.x, body.y)"` (default `44, 235`) — jadi
`(0,0)` di dalam children SUDAH berarti `(44, 235)` di canvas. Rumus
bounding box untuk panel di dalam body:

```
top    = centerY - height / 2   // centerY dalam LOCAL coordinate
bottom = centerY + height / 2

// Cek terhadap body.height (965), BUKAN canvas.height (1340):
if (bottom > layout.body.height) {
  // panel akan overflow keluar body — perkecil height atau geser centerY
}
```

Kalau perlu konversi eksplisit ke canvas coordinate (mis. untuk
FlowchartSpine/waypoint yang dipakai bareng elemen canvas-level lain),
pakai helper murni yang sudah tersedia — jangan hitung manual:

```js
import { toCanvasX, toCanvasY, toLocalX, toLocalY } from '../../shared/scene-ui/v1'
```

#### Contoh: Panel Pakai Ukuran Body, Bukan Magic Number Global

```jsx
// ✅ GOOD — lebar panel dari body.width via render prop, bukan angka lepas
<ContentBodyV1
  render={(w, h) => (
    <rect width={w} height={52} rx={14} fill={COLORS.PANEL} />
  )}
/>

// ❌ BAD — angka 732 di-hardcode ulang, akan basi kalau body.width topic ini
// pernah di-override lewat prop `layout` custom
<ContentBodyV1>
  <rect width={732} height={52} rx={14} fill={COLORS.PANEL} />
</ContentBodyV1>
```

#### Larangan: Local Y Negatif untuk "Mendorong" Body ke Header

Semua children `ContentBodyV1` WAJIB pakai local `y >= 0`. Local `y`
negatif berarti elemen didorong balik ke atas `body.y` (masuk zona
navigator/header) — ini pelanggaran safe-zone yang sama persis dengan
"panel besar di koordinat global header" yang dilarang §1.S
`09-standar-pembuatan-konten.md`, hanya beda cara nulisnya (offset
negatif vs koordinat absolut). **Pengecualian satu-satunya:** topic yang
sudah punya opt-out layout tertulis (lihat §1.S) dan preview manual
collision-nya sudah direview eksplisit.

#### Checklist Collision (scene-ui V1)

- [ ] Subtitle (`header.subtitleY=130`) tidak tertabrak elemen body
      manapun di frame hero (progress rendah) maupun compact (progress=1)
- [ ] Badge (`navigator.y=155` s/d `+height`) tidak tertabrak elemen body
      di Act manapun
- [ ] Panel/card terbesar di body sudah dihitung top/bottom-nya (rumus di
      atas), bukan dieyeball
- [ ] Ticket/packet yang transit melewati sub-zona `transit`/`service`
      tidak menembus balik ke `header`/`navigator`
- [ ] Cek dilakukan di ukuran canvas export sebenarnya (820×1340), sama
      seperti aturan checklist non-V1 di atas

### Alternatif: HTML Overlay / `foreignObject`

Untuk web-only viewer (bukan yang di-export jadi MP4), HTML overlay biasa
atau `<foreignObject>` bisa auto-wrap text. **Tidak direkomendasikan**
untuk use-case export-heavy project ini — `foreignObject` browser support
tidak merata dan export renderer (FFmpeg/Puppeteer) belum tentu support.
Kalau butuh, test compatibility export dulu sebelum dipakai.

### Ringkasan — Decision Tree

```
1-2 baris, muat lebar?        → <text> biasa
1-2 baris, kepanjangan?       → <text> + <tspan>
3+ baris?                     → Multiple boxes (rekomendasi)
Konten dinamis/user input?    → Pertimbangkan foreignObject (test export dulu)
Web-only viewer?              → HTML overlay OK
```

**7 golden rules:** test di viewport asli, cek readability 1080p & 4K,
`dy` konsisten dalam 1 blok, box height = content + breathing room,
monospace untuk code / sans-serif untuk prose, kontras min 4.5:1, potong
baris di titik logis (setelah tanda baca, sebelum keyword).


---

## Bab B — Icon & Asset Pipeline

## 06 — Icon Generation Guide

> Alur baca lengkap: `01-architecture` → `02-standar-konten` → `03-tutorial-buat-topic-baru` → `04-referensi-gsap` → `05-svg-text-guide` → **`06-icon-generation`** → `08-audio-sfx-generation`

Acuan arsitektur sistem pembuatan aset icon berbasis AI (ChatGPT/DALL-E 3)
dan auto-crop backend untuk topic baru.

> **Cross-reference scene-ui V1:** kalau topic memakai scene-ui V1 (lihat
> `09-standar-pembuatan-konten.md` §1.S), icon/asset yang dihasilkan lewat
> pipeline di dokumen ini tetap dirender di dalam `ContentBodyV1` (local
> coordinate, lihat `05-svg-text-guide.md` § "Scene Zones V1 dan Local
> Coordinates") — pipeline generate/crop icon di bawah ini TIDAK berubah
> sama sekali, scene-ui V1 hanya mengatur DI MANA icon itu boleh
> diletakkan (di bawah badge Act), bukan BAGAIMANA icon dibuat.

### 1. Prinsip Utama & Batasan Grid

1. **Resolusi DALL-E 3** ~1024×1024 atau ~1792×1024px. Maksimal grid per
   prompt: **4×4** (16 slot). Rekomendasi terbaik (tajam ~500px/icon):
   **2×4** (8 slot) atau **3×3** (9 slot).
2. **Aturan slot kosong `[EMPTY]`:** tiap prompt grid wajib sisakan 1 slot
   terakhir sebagai separator visual, supaya AI tidak memadatkan gambar ke
   sudut. Grid 2×4 = 7 icon nyata + 1 slot kosong. Grid 4×4 = 15 icon + 1 kosong.
3. **Jangan pakai grid 1-dimensi** (`1x4`, `4x1`, `1x7`) — AI hasilkan
   gambar pipih/terdistorsi karena rasio aspek terlalu ekstrem. Minimal `2x2`, `2x3`, `2x4`.

### 2. Aturan Multi-Batch (Icon > 7 atau > 15)

Jangan bikin grid raksasa (`5x5`, `6x6`) — bagi jadi beberapa Batch.

```
14 Icon → Batch 1 (2x4): 7 icon + 1 empty   |  Batch 2 (2x4): 7 icon + 1 empty
20 Icon → Batch 1 (4x4): 15 icon + 1 empty  |  Batch 2 (2x3/2x4): 5 icon + sisa empty
```

### 3. Skema File `icons.json`

Tiap topic simpan konfigurasi di `src/content/<topic-id>/icons/icons.json`.

#### Format A — Multi-Batch (topik sedang-besar)

```json
{
  "name": "topic-id",
  "description": "Deskripsi singkat topik",
  "batches": [
    {
      "batch_id": "batch-1",
      "name": "Core Components (Batch 1/2)",
      "rows": 2, "cols": 4,
      "icons": [
        { "id": "icon-1", "name": "Icon 1", "label": "Short Label", "description": "Deskripsi visual untuk ChatGPT" }
      ],
      "prompt": "Generate a 2x4 grid of 8 minimalist grayscale monochrome icons on transparent background (PNG)...\n8. [EMPTY - leave this slot blank/transparent]\n\nStyle: flat design, black/gray colors only, transparent background, grid 2 rows x 4 columns."
    }
  ],
  "generation": {
    "api_endpoint": "http://localhost:3373/api/icons/generate",
    "output_path": "src/content/topic-id/icons"
  }
}
```

#### Format B — Single-Batch (topik kecil ≤ 7 icon)

```json
{
  "name": "topic-id",
  "description": "Deskripsi topik",
  "icons": [{ "id": "icon-1", "name": "Icon 1", "label": "Label 1", "description": "Desc 1" }],
  "generation": {
    "rows": 2, "cols": 4,
    "prompt": "Full ChatGPT Prompt...",
    "api_endpoint": "http://localhost:3373/api/icons/generate",
    "output_path": "src/content/topic-id/icons"
  }
}
```

### 4. API Endpoints Backend (Port Standar: 3373)

| Endpoint | Method | Keterangan |
|---|---|---|
| `GET /api/icons/topics` | GET | Auto-scan semua folder `src/content/*/icons/icons.json`, rekap info batch & icon |
| `GET /api/icons/metadata?topicId=X&batchId=Y` | GET | Ambil detail metadata konfigurasi per topik/batch |
| `POST /api/icons/generate` | POST (multipart/form-data) | Terima PNG hasil generate ChatGPT, crop tajam via `sharp`, simpan sebagai `<icon-id>.png` di `output_path` |

### 5. Cara Menggunakan Chrome Extension

1. Pastikan docker stack jalan: `docker compose up -d` (Unified server aktif di `http://localhost:3373`).
2. Buka `chrome://extensions`, aktifkan **Developer mode**, klik **Load
   unpacked**, pilih folder `src/extensions/vm-icon-generator`.
3. Buka tab **https://chatgpt.com**.
4. Klik icon ekstensi **Content Icon Generator**:
   - Pilih topik di dropdown (misal: `linux-vs-unix`)
   - Kalau ada beberapa batch, pilih `All Batches (Sequential)` atau batch tertentu
   - Klik **Generate Icons from ChatGPT**
5. Ekstensi otomatis ketik prompt ke ChatGPT, download gambar hasil
   generate, kirim ke server local untuk di-crop jadi PNG individual
   secara otomatis.

### 6. Integrasi Icon ke `Animation.jsx` (Setelah PNG Ter-generate)

Bagian di atas berhenti begitu file PNG sudah ada di folder `icons/`.
Langkah SESUDAHNYA — pasang PNG itu ke JSX — punya beberapa formula yang
tidak intuitif kalau cuma tebak-tebakan, jadi diikuti persis pola di
bawah.

#### 6.1 `icons/loader.js`

```js
// src/content/<topic-id>/icons/loader.js
import wireguardKeyIcon from './wireguard-key.png'
import coordinationServerIcon from './coordination-server.png'
// ...import tiap PNG sesuai icons.json

export const ICONS = {
  'wireguard-key': wireguardKeyIcon,
  'coordination-server': coordinationServerIcon,
  // ...
}

export function getIcon(id) {
  return ICONS[id] || null
}
```

Import di `Animation.jsx`: `import { getIcon } from './icons/loader'`.

#### 6.2 Formula Centering — Icon Standalone

`<image>` di SVG di-posisikan dari **pojok kiri-atas**, beda dengan
`<circle r=...>` yang dari titik tengah. Kalau icon menggantikan shape
yang posisinya sudah center di suatu titik, wajib offset supaya tetap
center di titik yang sama:

```jsx
// width=32, height=32 → offset x=-16, y=-16 (= -width/2, -height/2)
<image href={getIcon('wireguard-key')} x={-16} y={-16} width={32} height={32} />

// Aspect ratio non-persegi (misal HP portrait 32×56) — formula sama,
// cuma offset y disesuaikan supaya device + label tetap balanced:
<image href={getIcon('mobile-phone')} x={-16} y={-28} width={32} height={56} />
```

**Formula umum:** `x = -width/2`, `y = -height/2` (sesuaikan `y` kalau
ada label teks di bawah icon yang perlu tetap balanced secara visual).

#### 6.3 Formula Offset — Icon sebagai Aksen di Dalam Box

Kalau icon ditempel sebagai aksen kecil di pojok komponen box (pola
`ServerBox`), box-nya TETAP jadi frame/label, icon nempel di layer atas:

```jsx
<ServerBox x={0} y={0} label="COORDINATION SERVER" color={COLORS.SERVER} w={260} />
<image href={getIcon('coordination-server')} x={-105} y={4} width={28} height={28} />
```

**Formula:** `x = -(boxWidth / 2) + paddingKiri`. Contoh nyata: `w=260` →
`x = -130 + 25 = -105`; `w=240` (box lebih sempit) → `x = -120 + 25 = -95`.
Sesuaikan `paddingKiri` (di atas: `25`) sesuai selera visual box masing-
masing topic, tapi formula dasarnya sama.

#### 6.4 Icon Pengganti vs Icon Baru

- **Icon pengganti** (swap isi child dari shape manual existing ke
  `<image>`) — timeline GSAP (`popIn`, sfx, timing) **tidak perlu
  diubah**, cukup ganti isi child SVG-nya saja.
- **Icon BARU** (belum ada elemen existing yang cocok diganti) — ini
  butuh entry timeline GSAP baru (`popIn()` baru), effort & risknya lebih
  besar (perlu cari titik waktu kosong, cek tidak bikin Act kepenuhan/
  clutter). Sebut ini eksplisit di planning sebelum eksekusi, jangan
  disamakan dengan icon pengganti yang jauh lebih murah.

### 7. Verifikasi Kode Aktual Sebelum Planning Varian Icon

Sebelum menetapkan daftar varian icon (warna/bentuk) yang dibutuhkan dari
komponen SVG existing, **grep dulu tiap komponen** (`grep -n "COLORS\."`
atau baca langsung tiap call-site di `Animation.jsx`) — jangan asumsikan
polanya sama dengan topic lain. Kasus nyata yang pernah terjadi: sebuah
plan varian warna icon mengasumsikan komponen `HouseFrame`/`BuildingFrame`
punya banyak varian warna per-Act, ternyata di kode aktual kedua komponen
itu HARDCODE 1 warna saja (tidak ada prop warna sama sekali) — sebaliknya
komponen `Laptop` justru punya 1 varian warna tambahan yang kelewat di
plan awal (dipakai di 1 Act yang tidak disebut di draft pertama). Salah
asumsi begini bikin rencana generate icon salah hitung — boros generate
varian yang tidak perlu ada, sekaligus kelewat varian yang justru
dibutuhkan.

### 8. Icon Brand: AI-Generate vs Download Logo Asli

AI image-gen (§1-6 di atas) cocok untuk icon **konseptual/ilustratif**
(hardware, proses, komponen abstrak) — tapi untuk **logo brand yang
sudah dikenal luas audiens** (bahasa pemrograman, distro OS, tools/
platform populer), hasil AI-generate biasanya kurang akurat/kurang
nempel ke bentuk asli yang sudah familiar, walau sudah diarahkan
seakurat mungkin lewat prompt.

Gunakan tabel keputusan berikut sebelum generate icon brand baru:

| Situasi | Rekomendasi |
|---|---|
| Brand/logo dikenal luas, risiko trademark rendah (bahasa pemrograman, tools open-source, distro Linux) | **Download logo asli** dari sumber resmi (lihat §9), bukan AI-generate |
| Konsep abstrak/ilustratif, bukan brand mark (hardware generik, proses, ikon UI) | Tetap **AI-generate** via `vm-icon-generator` (§1-6) |
| Brand komersial aktif dengan trademark ketat (produk SaaS, brand mark maskot seperti whale Docker) | **Konfirmasi eksplisit dengan pemilik project dulu** sebelum pakai logo resmi — default aman: tetap generik/ilustratif kalau belum ada konfirmasi |

Jangan generate ulang logo pakai AI sebagai cara "memperbaiki" hasil
AI-generate yang kurang akurat — itu sumber masalahnya sendiri. Solusi
yang benar adalah pindah ke sumber logo resmi (§9), bukan re-prompt AI
dengan variasi lain.

### 9. Sumber & Lisensi Logo Asli (Kalau Pilih Download, Bukan Generate)

| Kategori | Sumber utama | Format | Lisensi |
|---|---|---|---|
| Logo full-color (produk butuh warna asli brand) | Devicon (`cdn.jsdelivr.net/npm/devicon@latest/icons/{name}/{name}-original.svg`) | SVG warna | MIT |
| Logo monokrom (produk pakai gaya flat/1 warna) | Simple Icons (`cdn.jsdelivr.net/npm/simple-icons@latest/icons/{slug}.svg`) | SVG monokrom | CC0 |
| Fallback kalau tidak ada di 2 sumber di atas (OS/brand lama, kurang umum) | Wikimedia Commons | SVG/PNG | Cek lisensi per file (umumnya PD/fair-use logo) |

**Konversi & penyimpanan:**
- Convert SVG → PNG pakai `scripts/svg-to-png.mjs` (headless Chrome via
  Puppeteer — ImageMagick bawaan tidak selalu render gradient SVG dengan
  benar).
- Simpan file SVG asli di `icons/_originals/<nama-icon>.svg` untuk arsip.
- Catat sumber & lisensi tiap logo di `icons/_originals/LICENSE-LOGOS.md`
  (1 baris per icon: nama, sumber, lisensi).
- Kalau menggantikan icon AI-generate lama, backup versi lama ke
  `icons/_originals/backup-ai-generated/` sebelum overwrite — jangan
  langsung hapus.
- Simpan nama file PNG hasil akhir **sama seperti nama file lama**
  (tidak berubah), supaya `loader.js` dan pemanggilan di `Animation.jsx`
  tidak perlu diubah sama sekali.

**Catatan operasional — akses jaringan:** environment sandbox terbatas
(kalau assistant AI menjalankan perintah lewat sandbox executor bawaan)
biasanya hanya boleh akses domain paket resmi (npm, pypi, github, dst)
dan TIDAK termasuk CDN aset seperti `cdn.jsdelivr.net` atau
`commons.wikimedia.org`. Untuk download logo dari sumber-sumber di atas,
gunakan terminal dengan akses jaringan penuh ke komputer/host yang
sebenarnya (bukan sandbox terbatas) — semua proses download & konversi
tetap terjadi langsung di folder project, tidak lewat sandbox.

### 10. Checklist Tambahan: Icon di Komponen Text-Container

Icon tidak hanya relevan untuk shape diagram (`DiagramBox` dkk) — momen
teks polos (`Badge`, `TextCard`, atau komponen sejenis) yang berisi
insight/kesimpulan/pertanyaan penting JUGA layak dipertimbangkan untuk
dikasih icon pendamping, supaya momen penting itu tidak "tenggelam"
sebagai teks biasa. Sebelum menganggap set icon 1 topic sudah lengkap:

- [ ] Audit SEMUA elemen `Badge`/`TextCard`/komponen sejenis yang isinya
      teks polos tanpa gambar — bukan cuma shape diagram
- [ ] Untuk tiap elemen itu, putuskan: perlu icon pendamping (insight
      penting, pertanyaan hook, payoff) atau memang cukup teks saja
      (label kecil, sudah cukup jelas dari konteks)
- [ ] Kalau komponen `Badge`/`TextCard` di topic ini belum punya prop
      `icon` opsional, tambahkan (pola sama seperti `DiagramBox`) —
      lakukan ini di awal pembuatan topic, bukan retrofit di akhir

### 11. Asset State Matrix (State-Pair Planning)

Untuk topic yang butuh karakter/objek visual berubah state (mis. user
berubah dari student jadi professional, card berubah dari filled jadi
archived), satu asset statis saja tidak cukup — asset plan harus mencatat
PASANGAN state yang framing, pose, dan proporsinya tetap kompatibel untuk
ditransformasikan. Lihat juga `09-standar-pembuatan-konten.md` §1.M
Content State Contract untuk kapan state ini dipakai di timeline.

#### Template Wajib

| Asset identity | State A | State B | Apa yang boleh berubah | Apa yang harus sama |
|---|---|---|---|---|
| Adib | student, rambut hitam | professional, rambut ungu | pakaian, rambut, badge | wajah direction, framing, scale |
| Jokowo | student | professional | outfit/role layer | card position, avatar pose |
| Resource card | filled | archived | content/opacity | slot cabinet location |

Isi tabel ini SEBELUM menulis `icons.json` — kolom "apa yang harus sama"
menentukan bagian yang wajib identik di prompt ChatGPT kedua state, supaya
transisi antar-state tidak terlihat seperti dua karakter berbeda.

#### Aturan Asset State

**✅ DO:**
- Rencanakan asset state yang akan ditransformasikan dalam batch generate
  yang SAMA atau prompt berpasangan — supaya gaya/proporsi konsisten
  antar-state (beda batch = risiko gaya AI-gen sedikit berbeda tiap run)
- Tulis eksplisit di plan: pose, framing, proporsi, dan bagian mana SAJA
  yang boleh berubah antar state (lihat kolom template di atas)
- Gunakan grid 2×4 atau batch terpisah (bukan grid raksasa) untuk
  menjaga ketajaman — sama seperti aturan umum di §1-2
- Uji asset pada ukuran render target (bukan cuma preview 1:1 di editor)
  SEBELUM timeline final dibuat — ukuran kecil bisa bikin detail
  pembeda antar-state (mis. warna rambut) tidak kebaca
- Gunakan desain karakter generik, bukan kemiripan public figure,
  kecuali scope project secara eksplisit meminta dan mengizinkan itu

**❌ DON'T:**
- Jangan bakar teks dinamis (nama, umur, status, method) ke dalam asset
  gambar — nama/umur/status/method WAJIB tetap dirender SVG/JSX terpisah,
  asset gambar hanya untuk siluet/karakter (prinsip yang sama dengan
  Method Visualization Contract di `09-standar-pembuatan-konten.md` §1.N,
  yang menuntut benda fisik + teks dinamis tetap terpisah)
- Jangan generate state B jauh setelah state A tanpa acuan visual state
  A — risiko proporsi/pose tidak lagi kompatibel untuk transform
- Jangan asumsikan 1 asset tunggal cukup untuk cerita yang butuh
  transformasi visual (mis. "student jadi professional") — itu wajib
  jadi state-pair sejak planning, bukan ditambal belakangan

