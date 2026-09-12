# Linux vs Unix — Hacker Typing Intro Plan

> **Tujuan:** Sebelum Act 1 dimulai, ada intro "typing" style yang memberi konteks — user tahu video ini bahas apa.
> Durasi target: 5-7 detik (tidak terlalu lama, tapi cukup buat dibaca).

---

## KONSEP VISUAL

### State Baru (sebelum Act 1)

```
┌─────────────────────────────────────────────┐
│                                             │
│  LINUX CORE · ADIB-DEV.COM                  │
│                                             │
│  >>> [typing huruf satu per satu]           │
│  UNIX vs LINUX                              │
│  [pause 0.5s]                               │
│                                             │
│  [typing huruf satu per satu, lebih lambat] │
│  Perjalanan 1969 → 2026:                    │
│  Dari Bell Labs ke Dunia Digital            │
│  [pause 1s]                                 │
│                                             │
│  [blink cursor] █                           │
│                                             │
│  [fade out, transisi ke Act 1]              │
│                                             │
└─────────────────────────────────────────────┘
```

---

## TEXT YANG AKAN DI-TYPE

### Line 1 (Title)
```
UNIX vs LINUX
```
- **Jumlah karakter:** 14 (termasuk spasi)
- **Kecepatan avg:** 60ms per karakter → ~840ms total typing
- **Variasi:** 40ms–100ms per karakter (random)
- **Style:** Bold, warna merah (UNIX) + hijau (LINUX) dengan separator " vs " kuning/gold

### Line 2 (Subtitle 1)
```
Perjalanan 1969 → 2026:
```
- **Jumlah karakter:** 26
- **Kecepatan avg:** 70ms per karakter → ~1.8s total typing
- **Variasi:** 45ms–110ms per karakter (lebih lambat dari title, kayak orang lagi mikir)
- **Style:** Normal, warna muted/abu-abu

### Line 3 (Subtitle 2)
```
Dari Bell Labs ke Dunia Digital
```
- **Jumlah karakter:** 33
- **Kecepatan avg:** 65ms per karakter → ~2.1s total typing
- **Variasi:** 40ms–100ms per karakter
- **Style:** Normal, warna muted/abu-abu

### Total Timing
| Bagian | Durasi | Catatan |
|--------|--------|---------|
| Typing Line 1 | ~0.84s | Cepat, energik |
| Pause | 0.3s | Orang lagi mikir |
| Typing Line 2 | ~1.8s | Lebih lambat |
| Typing Line 3 | ~2.1s | Sedang |
| Pause akhir | 0.8s | Sebelum Act 1 fade in |
| **TOTAL INTRO** | **~5.9s** | Pas, user cukup baca |

---

## SOUND DESIGN

### Main SFX
- **Efek ketikan:** Mechanical keyboard typing sound (crisp, khas hacker)
  - File: `/public/audio/sfx/typing-hacker.wav` atau `/public/audio/sfx/keyboard-click.wav`
  - Dimainkan setiap kali huruf muncul
  - Volume: 40–60% (tidak overwhelming, tapi terdengar)
  - Playback speed: Sedikit bervariasi (98%–102% speed) agar tidak monoton

### Secondary SFX
- **Cursor blink sound:** Subtle beep/plink saat cursor berkedip
  - File: `/public/audio/ui/cursor-blink.wav`
  - Dimainkan setiap 0.5s saat idle typing

### Transisi ke Act 1
- **Fade out intro sound:** Smooth echo-out dari typing sound
- **Transition whoosh:** `/public/audio/sfx/whoosh.wav` saat intro fade
- **Act 1 entrance sound:** Normal `SFX_MAP.WHOOSH` seperti sekarang

---

## ANIMATION TIMELINE

### Pseudo-code Timeline

```javascript
let t = 0

// ═══════════════════════════════════════════════
// INTRO — Hacker Typing
// ═══════════════════════════════════════════════
tl.add(() => {
  setIntroPhase(0)     // Show intro mode
  setIntroVisible(true)
  setTypingText('')    // Start empty
}, t)

// ─────── LINE 1: "UNIX vs LINUX" ───────
const line1 = 'UNIX vs LINUX'
t += typeOutText(tl, t, line1, {
  minDelay: 40,
  maxDelay: 100,
  avgDelay: 60,
  sfx: 'typing-hacker',
  onChar: (idx, char) => {
    // Highlight color: red for "UNIX", gold for " vs ", green for "LINUX"
    if (idx < 4) color = COLORS.UNIX        // "UNIX"
    if (idx === 4 || idx === 5) color = COLORS.MUTED  // " v"
    if (idx === 6 || idx === 7) color = COLORS.GOLD   // "s "
    if (idx >= 8) color = COLORS.LINUX      // "LINUX"
  }
})

// Pause sebentar sebelum lanjut
tl.add(() => {}, t + 0.3)
t += 0.3

// ─────── LINE 2: "Perjalanan 1969 → 2026:" ───────
const line2 = 'Perjalanan 1969 → 2026:'
t += typeOutText(tl, t, line2, {
  minDelay: 45,
  maxDelay: 110,
  avgDelay: 70,
  sfx: 'typing-hacker',
  speed: 0.95,  // Sedikit lebih lambat
})

// ─────── LINE 3: "Dari Bell Labs ke Dunia Digital" ───────
const line3 = 'Dari Bell Labs ke Dunia Digital'
t += typeOutText(tl, t, line3, {
  minDelay: 40,
  maxDelay: 100,
  avgDelay: 65,
  sfx: 'typing-hacker',
})

// Cursor blink di akhir
tl.add(() => { setCursorVisible(true) }, t)
for (let i = 0; i < 4; i++) {
  tl.add(() => { setCursorVisible(v => !v) }, t + i * 0.4)
}
t += 1.6

// Pause final sebelum fade out
tl.add(() => {}, t + 0.4)
t += 0.4

// ─────── FADE OUT INTRO, MASUK ACT 1 ───────
tl.add(() => { sfxLoader.sfx(SFX_MAP.WHOOSH.name, { volume, speed }) }, t)
const introFade = { v: 1 }
tl.to(introFade, {
  v: 0,
  duration: 0.6,
  ease: 'power2.inOut',
  onUpdate: () => setIntroOpacity(introFade.v)
}, t)

// Mulai Act 1
tl.add(() => {
  setIntroVisible(false)
  setPhaseIdx(0)
  setIntroOpacity(1)
}, t + 0.6)

// Total intro time = ~6 detik
```

---

## HELPER FUNCTION: `typeOutText()`

```javascript
// Dalam Animation-history.jsx atau utils baru

const typeOutText = (timeline, startTime, fullText, options = {}) => {
  const {
    minDelay = 40,
    maxDelay = 100,
    avgDelay = 60,
    sfx = 'typing-hacker',
    speed = 1.0,
    onChar = null
  } = options

  let currentText = ''
  let t = startTime

  for (let i = 0; i < fullText.length; i++) {
    const char = fullText[i]
    // Random delay antara minDelay dan maxDelay, dengan bias ke avgDelay
    const variance = (Math.random() - 0.5) * (maxDelay - minDelay)
    const delay = Math.max(minDelay, Math.min(maxDelay, avgDelay + variance))

    timeline.add(() => {
      currentText += char
      setTypingText(currentText)
      
      // Callback untuk styling per huruf (misal warna)
      if (onChar) onChar(i, char)

      // Play typing sound
      if (sfx) {
        sfxLoader.sfx(sfx, { volume, speed: speed * (0.98 + Math.random() * 0.04) })
      }
    }, t)

    t += delay / 1000 // Convert ms to seconds
  }

  return t - startTime // Return total duration
}
```

---

## STATE YANG DITAMBAH (React)

```javascript
// Di Animation-history.jsx, tambahin state baru:

const [showIntro, setIntroVisible] = useState(true)
const [introOpacity, setIntroOpacity] = useState(1)
const [typingText, setTypingText] = useState('')
const [cursorVisible, setCursorVisible] = useState(true)
```

---

## JSX RENDER (Intro Section)

```jsx
{showIntro && (
  <g opacity={introOpacity} transform="translate(44, 300)">
    {/* Typing area background */}
    <rect x={0} y={0} width={732} height={220} rx={14}
      fill={COLORS.PANEL} stroke={COLORS.BORDER} strokeWidth={1} />

    {/* ">>>" prompt symbol */}
    <text x={30} y={44} fill={COLORS.LINUX} fontSize={20} fontFamily="monospace" fontWeight={700}>
      >>>
    </text>

    {/* LINE 1: Title (UNIX vs LINUX) */}
    <text x={70} y={44} fill={COLORS.TEXT} fontSize={24} fontFamily="'Courier New', monospace" fontWeight={700}>
      {typingText.slice(0, 14)}
      {typingText.length < 14 && cursorVisible && (
        <tspan fill={COLORS.LINUX} fontWeight={900}>█</tspan>
      )}
    </text>

    {/* LINE 2 & 3: Subtitle (muncul setelah Line 1 selesai) */}
    {typingText.length > 14 && (
      <>
        <text x={30} y={100} fill={COLORS.MUTED} fontSize={14} fontFamily="'Courier New', monospace">
          {typingText.slice(14, 40)}
          {typingText.length < 40 && typingText.length > 14 && cursorVisible && (
            <tspan fill={COLORS.GOLD} fontWeight={900}>█</tspan>
          )}
        </text>

        {typingText.length > 40 && (
          <text x={30} y={135} fill={COLORS.MUTED} fontSize={14} fontFamily="'Courier New', monospace">
            {typingText.slice(40)}
            {typingText.length < fullText.length && cursorVisible && (
              <tspan fill={COLORS.GOLD} fontWeight={900}>█</tspan>
            )}
          </text>
        )}
      </>
    )}

    {/* "Press any key to continue" hint (optional, fade in di akhir) */}
    {typingText === fullText && (
      <text x={366} y={210} textAnchor="middle" fill={COLORS.GOLD} fontSize={11} fontFamily="monospace" opacity={0.6}>
        [Mulai animasi dalam 3 detik...]
      </text>
    )}
  </g>
)}
```

**Catatan:** `fullText` = `'UNIX vs LINUXPerjalanan 1969 → 2026:Dari Bell Labs ke Dunia Digital'` (concatenated)

---

## FILE YANG DIMODIFIKASI

### 1. `src/content/linux-vs-unix/Animation-history.jsx`
**Tambah:**
- State: `showIntro`, `introOpacity`, `typingText`, `cursorVisible`
- Function: `typeOutText()` helper
- Timeline section: Intro typing (sebelum ACT 1)
- JSX render: Intro section (sebelum konten act)

**Posisi di timeline:**
```javascript
let t = 0

// ═══════════════════════════════════════════════
// INTRO — Hacker Typing (BARU)
// ═══════════════════════════════════════════════
// ... (intro code di sini)
// t selesai ~6 detik

// ═══════════════ ACT 1 — LAHIRNYA UNIX (1969) ═══════════════
// (existing code tetap di sini, mulai dari t ~6)
tl.add(() => { setPhaseIdx(0); ... }, t)
...
```

### 2. Audio files (jika belum ada)
**Buat/download:**
- `/public/audio/sfx/typing-hacker.wav` — mechanical keyboard click (100-200ms durasi, ~30KB)
- Bisa pakai Freesound.org atau generate dengan Foley sounds

---

## STYLING NOTES

| Element | Color | Font | Size |
|---------|-------|------|------|
| ">>>" prompt | COLORS.LINUX | monospace | 20px |
| Title line | COLORS.TEXT (default) | monospace | 24px |
| Subtitle lines | COLORS.MUTED | monospace | 14px |
| Cursor blink | COLORS.LINUX / COLORS.GOLD | monospace | match text |
| Background box | COLORS.PANEL | — | — |

---

## DURASI & TIMING BREAKDOWN

```
Act     | Timing    | Durasi | Keterangan
--------|-----------|--------|-------------------------------------------
INTRO   | 0.0–5.9s  | 5.9s   | Hacker typing
  L1    | 0.0–0.84s | 0.84s  | "UNIX vs LINUX"
  Pause | 0.84–1.14s| 0.3s   |
  L2    | 1.14–2.94s| 1.8s   | "Perjalanan 1969 → 2026:"
  L3    | 2.94–5.04s| 2.1s   | "Dari Bell Labs ke Dunia Digital"
  Cursor| 5.04–6.6s | 1.56s  | Blink effect
  Pause | 6.6–7.0s  | 0.4s   |
  Fade  | 7.0–7.6s  | 0.6s   | Fade out intro
--------|-----------|--------|-------------------------------------------
ACT 1   | 7.6s+     | ~9.5s  | Lahirnya Unix (existing)
...     | ...       | ...    | ...
```

**Total intro + Act 1 transition = ~17s** untuk pertama kali video dimulai.

---

## OPTIONAL ENHANCEMENTS

### 1. Random Pause di Tengah Typing
Kadang ada pause 0.5-1s seperti orang lagi berpikir:
```javascript
// Setiap 5-8 huruf, ada chance 30% pause 0.5s
if (i % Math.floor(5 + Math.random() * 3) === 0 && Math.random() < 0.3) {
  timeline.add(() => {}, t + 0.5)
  t += 0.5
}
```

### 2. "Typo Recovery" Effect
Sekali-sekali ada huruf salah, di-delete, terus ditulis ulang (kayak orang ketik beneran):
```javascript
// Chance 5% ada typo
if (Math.random() < 0.05) {
  // Backspace 1-2x
  tl.add(() => { setTypingText(prev => prev.slice(0, -1)) }, t)
  t += 0.1
  // Ulang ketik yang bener
}
```

### 3. Color Coding per Segment
Line 1 bisa highlight:
- "UNIX" = merah COLORS.UNIX
- " vs " = kuning COLORS.GOLD
- "LINUX" = hijau COLORS.LINUX

---

## TESTING CHECKLIST

- [ ] Typing timing tidak terlalu cepat (dapat dibaca), tidak terlalu lambat
- [ ] Sound ketikan terdengar jelas tapi tidak bising
- [ ] Cursor blink smooth, tidak berkedip-kedip aneh
- [ ] Transisi dari intro ke Act 1 smooth (fade, tidak jarring)
- [ ] Mobile/responsive: text size sesuai viewport
- [ ] Audio unlocked sebelum intro dimulai (user sudah interact)
- [ ] Intro bisa di-skip dengan tombol atau setelah 10 detik auto-skip

---

*Plan ini 100% siap di-implement ke `Animation-history.jsx`.*
