# 05 — SVG Text Guide

> Alur baca lengkap: `01-architecture` → `02-standar-konten` → `03-tutorial-buat-topic-baru` → `04-referensi-gsap` → **`05-svg-text-guide`** → `06-icon-generation` → `08-audio-sfx-generation`

## Masalah: SVG Text Tidak Support Word Wrap

HTML punya auto wrap, SVG tidak. `<text>` di SVG tidak mengenal konsep
"width" — text akan render 1 baris sampai infinity dan overflow keluar
boundary.

## Solusi 1 — Manual Line Break dengan `<tspan>`

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

## Solusi 2 — Multiple Boxes (Rekomendasi untuk 3+ Baris)

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

### Formula Tinggi Box

```
height = (fontSize * lineCount) + ((lineCount - 1) * lineSpacing) + topPadding + bottomPadding

1 baris  → 45px
2 baris  → 65px
3 baris  → 85px
```
Contoh hitung 2 baris: `fontSize 14, lineSpacing 20, topPadding 24, bottomPadding 17`
→ `(14×2) + (1×20) + 24 + 17 = 65px` ✅

## Solusi 3 — Reduce Font Size (Last Resort)

Maks reduksi 2px (14→12 OK, 14→10 TIDAK OK). Hanya untuk caption/info
sekunder, JANGAN untuk konten utama. Lebih baik **edit konten jadi lebih
concise** daripada mengecilkan font:

```jsx
{/* ❌ Panjang & font dikecilkan */}
<text fontSize={11}>The kernel will decide in which physical frame...</text>

{/* ✅ Concise & font normal */}
<text fontSize={14}>Kernel picks Physical Frame for each page.</text>
```

## Solusi 4 — Dynamic Text Width (Advanced, Dev-only)

```jsx
const textRef = useRef(null)
const [textWidth, setTextWidth] = useState(0)

useEffect(() => {
  if (textRef.current) setTextWidth(textRef.current.getBBox().width)
}, [textContent])
```
`getBBox()` hanya jalan setelah elemen ter-render ke DOM (tidak tersedia SSR).
Gunakan untuk debug mode atau konten dinamis (user-generated/translation).

## Common Pitfalls

1. **Lupa reset `x` di tiap `<tspan>`** → baris kedua ikut nge-indent aneh
   (offset dari akhir baris pertama). Selalu set `x={36}` di SEMUA tspan.
2. **`dy` tidak konsisten antar baris** → spacing timpang. Pakai angka yang
   sama tiap baris dalam 1 blok text.
3. **Box height tidak sesuai jumlah baris** → text keluar dari box. Hitung
   pakai formula di atas SEBELUM nulis konten.

## Text Measurement Helper (Estimasi Kasar)

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

## Typography & Kontras Warna

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

## Color Palette Project

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

## Formula Cek Overlap Antar-Elemen Horizontal (Center-Anchor)

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

## Layout System for Animated SVG (Safe-Zone & Bounding Box)

Section ini melengkapi formula overlap horizontal di atas dengan sistem
zona VERTIKAL penuh — dipakai untuk topic bertingkat (header + badge +
browser/content + transit + service dalam satu canvas). Lihat juga
`09-standar-pembuatan-konten.md` §1.R Safe-Zone Layout Contract untuk
kontrak wajibnya; bagian ini fokus ke IMPLEMENTASI teknis SVG-nya.

### Safe-Zone dan Coordinate Constants

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

### Bounding Box untuk Panel/Asset yang Berubah Ukuran

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

### Formula Gap Minimum Antar Zona

Sama seperti formula overlap horizontal di atas, tapi untuk vertikal:

```
gap_actual = zonaB.yStart - zonaA.yEnd
gap_actual >= gap_minimal (disarankan >= 20px)
```

Kalau sebuah elemen besar (mis. browser window) berpotensi melebihi
`CONTENT_ZONE.yEnd`, JANGAN perkecil zona secara diam-diam — perkecil
elemen atau pindahkan sebagian kontennya, lalu verifikasi ulang gap ke
`TRANSIT_ZONE.yStart`.

### Teks Menempel pada Actor/Path

Label yang merujuk objek bergerak (`methodBadge`, `addressLabel`, dsb.)
WAJIB dihitung relatif terhadap posisi objek acuan saat itu — lihat
`09-standar-pembuatan-konten.md` §1.K:

```jsx
// ✅ GOOD — posisi label ikut posisi objek acuan (ticketPos), bukan hardcode
<text x={ticketPos.x} y={ticketPos.y - 24} textAnchor="middle">{methodLabel}</text>
```

### Checklist Anti-Collision per Phase

- [ ] Hero/intro (t=0): title & subtitle tidak menabrak elemen `CONTENT_ZONE` yang sudah muncul lebih awal
- [ ] Tiap Act: panel/card terbesar yang mungkin tampil bersamaan sudah dihitung bounding box-nya, bukan dieyeball
- [ ] Closing: progress bar/tease badge tidak menabrak actor utama yang masih persist (lihat `04-referensi-gsap.md` § "Persistent Anchor Object")
- [ ] Cek dilakukan pada UKURAN CANVAS EXPORT SEBENARNYA (mis. `820x1340`), bukan cuma di preview browser yang mungkin ter-scale

### Contoh: Title Hero Menjadi Compact Header Tanpa Mengganti Elemen

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

## Scene Zones V1 dan Local Coordinates (scene-ui V1)

Section ini adalah versi TERVERIFIKASI (langsung dari source
`src/shared/scene-ui/v1/PortraitSceneLayoutV1.js`) dari sistem zona di
atas, khusus untuk topic yang memakai scene-ui V1 (lihat
`09-standar-pembuatan-konten.md` §1.S untuk kapan wajib pakai). Kalau
topic tidak pakai V1 (opt-out custom), tetap pakai konstanta manual
seperti contoh `HEADER_ZONE`/`BADGE_ZONE`/dst di atas.

### Token `DEFAULT_LAYOUT_V1`

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

### Origin `ContentBodyV1` dan Local Coordinate

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

### Contoh: Panel Pakai Ukuran Body, Bukan Magic Number Global

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

### Larangan: Local Y Negatif untuk "Mendorong" Body ke Header

Semua children `ContentBodyV1` WAJIB pakai local `y >= 0`. Local `y`
negatif berarti elemen didorong balik ke atas `body.y` (masuk zona
navigator/header) — ini pelanggaran safe-zone yang sama persis dengan
"panel besar di koordinat global header" yang dilarang §1.S
`09-standar-pembuatan-konten.md`, hanya beda cara nulisnya (offset
negatif vs koordinat absolut). **Pengecualian satu-satunya:** topic yang
sudah punya opt-out layout tertulis (lihat §1.S) dan preview manual
collision-nya sudah direview eksplisit.

### Checklist Collision (scene-ui V1)

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

## Alternatif: HTML Overlay / `foreignObject`

Untuk web-only viewer (bukan yang di-export jadi MP4), HTML overlay biasa
atau `<foreignObject>` bisa auto-wrap text. **Tidak direkomendasikan**
untuk use-case export-heavy project ini — `foreignObject` browser support
tidak merata dan export renderer (FFmpeg/Puppeteer) belum tentu support.
Kalau butuh, test compatibility export dulu sebelum dipakai.

## Ringkasan — Decision Tree

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
