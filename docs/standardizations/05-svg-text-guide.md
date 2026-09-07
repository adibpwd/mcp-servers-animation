# 05 — SVG Text Guide

> Alur baca lengkap: `01-architecture` → `02-standar-konten` → `03-tutorial-buat-topic-baru` → `04-referensi-gsap` → **`05-svg-text-guide`** → `06-icon-generation`

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
