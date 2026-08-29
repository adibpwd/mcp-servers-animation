# Linux vs Unix — Intro "Typing → Morph ke Header" Plan

> **Revisi dari plan sebelumnya** (`plan-linux-vs-unix-intro-adjustment.md`).
> Konsep intro panel kotak kecil di tengah **dibatalkan**. Diganti dengan pola
> yang sama seperti `virtual-memory/Animation.jsx` (RAM & SWAP): title +
> subtitle **besar** muncul di area tengah/bawah canvas, lalu **morph** (geser
> naik + mengecil) jadi header permanen di atas — tapi title & subtitle-nya
> **diketik dulu** (typing effect) sebelum morph dimulai.

---

## 📌 RINGKASAN ALUR

```
1. showIntro = true
2. Title "UNIX vs LINUX" diketik huruf demi huruf, GEDE, di area tengah bawah
3. Pause sebentar
4. Subtitle "Perjalanan 1969 → 2026: Dari Bell Labs ke Dunia Digital"
   diketik huruf demi huruf, di bawah title
5. Cursor blink sebentar (kasih jeda baca)
6. morphP di-tween 0 → 1 (0.8s): title+subtitle+tagline SLIDE ke ATAS
   sambil mengecil jadi ukuran header (persis pola RAM & SWAP)
7. showIntro = false → Act 1 mulai, header title/subtitle TETAP tampil
   kecil di atas (morphP tetap 1 selamanya, tidak reset)
```

Referensi pola morph: `src/content/virtual-memory/Animation.jsx` baris ~1085–1128
(header IIFE pakai `lerp(bigValue, headerValue, morphP)`).

---

## 🔁 YANG PERLU DI-REVERT DARI IMPLEMENTASI SEBELUMNYA

Implementasi sebelumnya (panel kotak `>>>` di tengah dengan 3 baris terpisah
`typed.l1/l2/l3`) **dihapus total** dan diganti. Bagian yang perlu direvert:

1. State `typed = { l1, l2, l3 }` → diganti `typed = { title, subtitle }`
2. Konstanta `INTRO_LINE1/2/3` (3 baris) → diganti `INTRO_TITLE` +
   `INTRO_SUBTITLE` (2 baris saja, subtitle digabung jadi satu kalimat)
3. JSX overlay panel `>>>` kotak (rect 732×220 di translate(44,300)) → **dihapus**
4. Header statis yang sekarang selalu tampil (`LINUX CORE...`, `UNIX vs LINUX`,
   subtitle di y=44/100/130) → **diganti** jadi header dinamis berbasis
   `morphP`, sama seperti pola RAM & SWAP
5. Semua blok `{phaseIdx === N && (...)}` untuk ACT 1–5 → ditambah gating
   `!showIntro &&` di depannya (sekarang belum ada gating ini di
   Animation-history.jsx, beda dari virtual-memory yang sudah pakai ini)
6. Phase badge (`{/* PHASE BADGE */}`) → ditambah gating `!showIntro &&`

---

## ⚛️ STATE (React)

```javascript
// ── intro (typing → morph) state ──
const [showIntro, setShowIntro] = useState(true)
const [morphP,    setMorphP]    = useState(0)     // 0 = besar/tengah, 1 = header
const [typed,     setTyped]     = useState({ title: '', subtitle: '' })
const [cursorVisible, setCursorVisible] = useState(true)
```

State lama yang **dihapus**: `introOpacity` (tidak dipakai lagi — morph pakai
posisi+ukuran, bukan fade), `typed.l1/l2/l3`.

---

## 📝 KONSTANTA TEKS (module-level, ganti INTRO_LINE1/2/3)

```javascript
const INTRO_TITLE    = 'UNIX vs LINUX'
const INTRO_SUBTITLE = 'Perjalanan 1969 → 2026: Dari Bell Labs ke Dunia Digital'
```

Subtitle sengaja digabung jadi **satu baris** (bukan 2 baris terpisah seperti
plan lama) supaya konsisten dengan pola RAM & SWAP yang subtitle-nya juga
satu baris saja.

---

## 🧩 HELPER: `typeLine()` (tetap dipakai, tinggal ganti target)

Helper yang sudah ada di implementasi sebelumnya **dipertahankan apa adanya**
(sudah generic lewat parameter `lineKey`), cuma dipanggil dengan key baru:

```javascript
const typeLine = (tl, startTime, lineKey, fullText, opts = {}) => {
  const { minDelay = 40, maxDelay = 100, avgDelay = 60 } = opts
  let acc = ''
  let time = startTime
  for (let i = 0; i < fullText.length; i++) {
    const char = fullText[i]
    const variance = (Math.random() - 0.5) * (maxDelay - minDelay)
    const delay = Math.max(minDelay, Math.min(maxDelay, avgDelay + variance))
    tl.add(() => {
      acc += char
      setTyped(prev => ({ ...prev, [lineKey]: acc }))
      sfxLoader.sfx(SFX_MAP.TYPING.name, { volume: volume * 0.6, speed: speed * (0.98 + Math.random() * 0.04) })
    }, time)
    time += delay / 1000
  }
  return time - startTime
}
```

Dipanggil dengan `lineKey: 'title'` dan `lineKey: 'subtitle'` (bukan lagi
`'l1'/'l2'/'l3'`).

---

## 🎬 TIMELINE — Pseudocode Lengkap

```javascript
let t = 0

// ════ INTRO — TYPING lalu MORPH ke header ════
tl.add(() => {
  setShowIntro(true)
  setMorphP(0)
  setTyped({ title: '', subtitle: '' })
  setCursorVisible(true)
}, t)
t += 0.3   // jeda kecil sebelum mulai ngetik (biar nggak instan)

// ── ketik title "UNIX vs LINUX" ──
t += typeLine(tl, t, 'title', INTRO_TITLE, { minDelay: 40, maxDelay: 100, avgDelay: 60 })
t += 0.3   // jeda, seolah lagi mikir sebelum lanjut subtitle

// ── ketik subtitle ──
t += typeLine(tl, t, 'subtitle', INTRO_SUBTITLE, { minDelay: 35, maxDelay: 85, avgDelay: 55 })

// ── cursor blink, kasih jeda baca sebelum morph ──
for (let i = 0; i < 3; i++) {
  tl.add(() => setCursorVisible(v => !v), t + i * 0.35)
}
t += 1.05
t += 0.35  // pause final sebelum morph mulai

// ── MORPH: title+subtitle+tagline slide naik & mengecil jadi header ──
tl.add(() => { setCursorVisible(false); sfxLoader.transition(SFX_MAP.WHOOSH.name, { volume, speed }) }, t)
const mo = { p: 0 }
tl.to(mo, { p: 1, duration: 0.8, ease: 'power3.inOut', onUpdate: () => setMorphP(mo.p) }, t)
t += 0.8

tl.add(() => setShowIntro(false), t)
t += 0.3  // jeda kecil sebelum Act 1 mulai render

// ═══════════════ ACT 1 — LAHIRNYA UNIX (1969) ═══════════════
// (kode existing tidak berubah, otomatis mulai lebih telat karena t sudah bertambah)
```

**Total durasi intro** (typing title ~0.78s + pause 0.3s + typing subtitle
~3.3s + cursor blink 1.05s + pause 0.35s + morph 0.8s + jeda 0.3s + jeda awal
0.3s) **≈ 7.2 detik**. Lebih panjang dari plan lama karena subtitle sekarang
1 baris panjang (55 karakter) yang diketik penuh — bisa dipercepat dengan
menurunkan `avgDelay` kalau kerasa kelamaan saat testing.

---

## 🖥️ JSX RENDER — Header dinamis (ganti header statis yang sekarang ada)

Pola persis `virtual-memory/Animation.jsx` baris ~1091–1128, disesuaikan
dengan koordinat canvas Linux vs Unix (`VW=820, VH=1340` — **sama persis**
dengan virtual-memory, jadi angka koordinat bisa dipakai ulang apa adanya).

**Posisi BESAR (mp=0, saat intro tampil):**
| Elemen | x | y | fontSize |
|---|---|---|---|
| tagline (`LINUX CORE · ADIB-DEV.COM`) | 44 | 580 | 22 |
| title (`UNIX vs LINUX`) | 44 | 660 | 80 |
| subtitle | 44 | 740 | 26 |

**Posisi HEADER (mp=1, posisi akhir permanen — sama dengan header statis lama):**
| Elemen | x | y | fontSize |
|---|---|---|---|
| tagline | 44 (→ VW/2 kalau mau center seperti RAM&SWAP, atau tetap 44) | 44 | 16 |
| title | 44 | 100 | 50 |
| subtitle | 44 | 130 | 17 |

> Catatan: RAM & SWAP tagline morph ke tengah (`VW/2`) dengan `textAnchor`
> berubah `start`→`middle`. Untuk Linux vs Unix, tagline **tetap kiri** (x=44
> terus) supaya tidak konflik visual dengan phase-badge yang juga ada di kiri
> — title & subtitle tetap `textAnchor="start"` terus juga.

```jsx
{/* ── HEADER (dinamis, morph dari besar→header, dengan typing text) ── */}
{(() => {
  const mp = morphP
  const taglineY = lerp(580, 44, mp)
  const taglineFs = lerp(22, 16, mp)
  const titleY = lerp(660, 100, mp)
  const titleFs = lerp(80, 50, mp)
  const subY = lerp(740, 130, mp)
  const subFs = lerp(26, 17, mp)

  // batas potong warna title: "UNIX"(4) + " vs "(4) + "LINUX"(sisa)
  const t = typed.title
  return (
    <g>
      <text x={44} y={taglineY} fill={COLORS.MUTED} fontSize={taglineFs}
        fontFamily="monospace" letterSpacing={3}>
        LINUX CORE · <tspan fill={COLORS.LINUX} fontWeight={700}>ADIB-DEV.COM</tspan>
      </text>

      <text x={44} y={titleY} fontSize={titleFs}
        fontFamily="'Arial Black', Impact, sans-serif" fontWeight={900}>
        <tspan fill={COLORS.UNIX}>{t.slice(0, 4)}</tspan>
        <tspan fill={COLORS.MUTED}>{t.slice(4, 6)}</tspan>
        <tspan fill={COLORS.GOLD}>{t.slice(6, 8)}</tspan>
        <tspan fill={COLORS.LINUX}>{t.slice(8)}</tspan>
        {showIntro && typed.title.length < INTRO_TITLE.length && cursorVisible && (
          <tspan fill={COLORS.LINUX} fontWeight={900}>█</tspan>
        )}
      </text>

      <text x={44} y={subY} fill={COLORS.MUTED} fontSize={subFs} fontFamily="sans-serif">
        {typed.subtitle}
        {showIntro && typed.title.length === INTRO_TITLE.length &&
          typed.subtitle.length < INTRO_SUBTITLE.length && cursorVisible && (
          <tspan fill={COLORS.GOLD} fontWeight={900}>█</tspan>
        )}
      </text>
    </g>
  )
})()}
```

Blok ini **menggantikan total** header statis lama (yang sebelumnya berisi
teks tetap `UNIX vs LINUX` tanpa animasi). Diletakkan di posisi yang sama
persis di JSX (sebelum Phase Badge), dan **selalu dirender** (tidak digating
`showIntro`) — persis pola RAM & SWAP — supaya title/subtitle tetap kelihatan
kecil di header sepanjang Act 1–5.

---

## 🚧 GATING KONTEN LAIN SUPAYA TIDAK TABRAKAN VISUAL DENGAN INTRO

Karena title/subtitle besar dirender di area y=580–766 (tengah-bawah canvas),
dan area itu **bertabrakan** dengan posisi Phase Badge (`y=165`) dan Content
box (`translate(44,220)`, termasuk seluruh isi Act 1–5) — semua itu harus
disembunyikan **selama** `showIntro === true`. Tanpa gating ini, pas intro
tampil, isi Act 1 (yang technically sudah mulai dianimasikan karena timeline
GSAP jalan terus) akan numpuk di belakang title besar.

Perubahan yang diperlukan di JSX (tambah `!showIntro &&` di depan tiap blok):

```jsx
{/* ── PHASE BADGE ── */}
{!showIntro && (
  <g transform="translate(44, 165)"> ... </g>
)}

{/* ── CONTENT ── */}
{!showIntro && (
  <g transform="translate(44, 220)">
    ... (semua isi Act 1–5 yang sudah ada, TIDAK diubah) ...
  </g>
)}
```

Ini beda dengan implementasi sebelumnya yang cuma nutup pakai `<rect>` opaque
di atas semuanya — sekarang pola-nya "tidak dirender sama sekali" selama
intro, sama seperti virtual-memory.

---

## 📁 FILE YANG DIMODIFIKASI

### `src/content/linux-vs-unix/Animation-history.jsx`

1. **Konstanta module-level**: ganti `INTRO_LINE1/2/3` → `INTRO_TITLE`, `INTRO_SUBTITLE`
2. **State**: ganti `typed.l1/l2/l3` → `typed.title/subtitle`; tambah `morphP`;
   hapus `introOpacity` (tidak dipakai lagi)
3. **Helper `typeLine()`**: tidak berubah (generic, tinggal ganti key panggilan)
4. **Timeline (`useEffect` master timeline)**: ganti seluruh section
   `// ═══ INTRO — HACKER TYPING ═══` dengan versi baru (typing → morph, lihat
   pseudocode di atas). Bagian ACT 1–5 di bawahnya **tidak berubah sama
   sekali** (otomatis mulai lebih telat karena `t` sudah lebih besar).
5. **JSX**:
   - Hapus header statis lama (blok `<text x={44} y={44}>LINUX CORE...`
     sampai subtitle `y=130`)
   - Ganti dengan header dinamis (IIFE `morphP`, lihat di atas)
   - Tambah `!showIntro &&` di depan Phase Badge dan Content box
   - Hapus total blok "INTRO OVERLAY" panel `>>>` yang dibuat sebelumnya
     (rect 732×220, translate(44,300), dst)

Tidak ada file lain yang perlu diubah — `data-history.js` dan `sfx-loader.js`
tetap sama, `typing.wav` & `whoosh.wav` sudah ada di `/public/audio/sfx/`.

---

## 🧪 TESTING CHECKLIST

- [ ] Title besar muncul di tengah-bawah canvas, diketik huruf demi huruf, warna
      per-segmen benar (UNIX=amber, " vs "=gold/muted, LINUX=teal)
- [ ] Subtitle diketik setelah title selesai + pause 0.3s
- [ ] Cursor blink terlihat jelas selama & sesudah ngetik, berhenti pas morph mulai
- [ ] Morph (title+subtitle+tagline naik & mengecil) terlihat smooth, tidak
      "loncat" — cek `power3.inOut` easing di 0.8s
- [ ] Setelah morph, header (kecil di atas) match persis posisi/style header
      lama (y=44/100/130, fontSize 16/50/17)
- [ ] Phase Badge & Content Act 1 **tidak kelihatan sama sekali** selama intro
      (harus benar-benar `!showIntro`, bukan cuma ketutup rect)
- [ ] Loop berikutnya (`repeat: -1` di GSAP timeline) — intro replay lagi
      dengan benar dari awal (title/subtitle/morphP ke-reset ke initial state)
- [ ] Total durasi intro (~7.2s) tidak kerasa kelamaan pas nonton — kalau
      kelamaan, turunkan `avgDelay` di `typeLine()` untuk subtitle
- [ ] Audio `typing.wav` tidak menumpuk/berisik — cek volume `volume * 0.6`
      di helper masih pas
- [ ] Build (`npx vite build`) sukses tanpa error setelah semua perubahan

---

*Plan ini siap untuk dieksekusi ke `Animation-history.jsx`. Tunggu konfirmasi
sebelum eksekusi.*
