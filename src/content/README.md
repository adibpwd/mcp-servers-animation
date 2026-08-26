# Content Creation Guide

Panduan membuat animasi edukasi baru untuk AI Explainer.

## Quick Start

### 1. Setup Structure

```bash
src/content/
└── your-topic-name/
    ├── Animation.jsx    # Komponen animasi utama
    └── data.js          # Konstanta & konfigurasi
```

### 2. Register Content

Tambahkan ke `src/content/registry.js`:

```js
{
  id:        'your-topic-name',
  title:     'Your Topic Title',
  subtitle:  'Short explanation (max 60 chars)',
  category:  'Category Name',
  tags:      ['tag1', 'tag2', 'tag3'],
  color:     '#4ADE80',  // Hex color untuk accent
  status:    'ready',    // 'ready' | 'coming-soon'
  component: () => import('./your-topic-name/Animation'),
}
```

### 3. Animation Component Template

```jsx
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { VW, VH, PHASES } from './data'

export default function YourAnimation({
  paused = false,
  speed = 1.0,
  volume = 75,
  previewSfx = true,
}) {
  const svgRef = useRef(null)
  const tlRef = useRef(null)
  const [phaseIdx, setPhaseIdx] = useState(0)

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 })
    tlRef.current = tl
    window.__animationTimeline = tl

    let t = 0

    // Act 1
    tl.add(() => setPhaseIdx(0), t)
    // ... add your animations
    t += PHASES[0].duration

    // Act 2
    tl.add(() => setPhaseIdx(1), t)
    // ... add your animations
    t += PHASES[1].duration

    return () => tl.kill()
  }, [])

  // Handle paused/speed
  useEffect(() => {
    if (tlRef.current) {
      paused ? tlRef.current.pause() : tlRef.current.play()
    }
  }, [paused])

  useEffect(() => {
    if (tlRef.current) {
      tlRef.current.timeScale(speed)
    }
  }, [speed])

  return (
    <svg ref={svgRef} viewBox={`0 0 ${VW} ${VH}`}>
      {/* Your animation content */}
    </svg>
  )
}
```

---

## Best Practices

### SVG Canvas Setup

```js
// data.js
export const VW = 820  // Viewport width
export const VH = 640  // Viewport height

export const PHASES = [
  { label: 'Act 1: Introduction', duration: 8 },
  { label: 'Act 2: Deep Dive',     duration: 12 },
  { label: 'Act 3: Conclusion',    duration: 6 },
]
```

**Viewport Size Guidelines:**
- Standard: `820x640` (landscape)
- Vertical heavy content: `820x720`
- Horizontal heavy content: `920x640`

---

## SVG Text Handling

### ❌ Common Pitfalls

```jsx
{/* BAD: Long text tanpa wrapping - AKAN OVERFLOW */}
<text x={36} y={32} fontSize={14}>
  This is a very long text that will definitely overflow outside the box boundary and cause layout issues.
</text>
```

### ✅ Solutions

#### Option 1: Manual Line Break dengan `<tspan>`

```jsx
<text x={36} y={24} fontSize={14}>
  <tspan x={36} dy={0}>Baris pertama text yang panjang sampai</tspan>
  <tspan x={36} dy={20}>baris kedua dengan proper line break.</tspan>
</text>
```

**Rules:**
- `dy={0}` untuk baris pertama
- `dy={18-22}` untuk baris berikutnya (tergantung fontSize)
- Selalu set `x={36}` di tiap `<tspan>` untuk alignment kiri konsisten

#### Option 2: Pecah jadi Multiple Boxes

```jsx
{/* Box 1 - Technical explanation */}
<g transform="translate(0, 460)">
  <rect width={732} height={65} rx={14} fill="#0F172A"/>
  <text x={36} y={24} fontSize={14} fontFamily="monospace">
    <tspan x={36} dy={0}>Technical content line 1...</tspan>
    <tspan x={36} dy={20}>Technical content line 2...</tspan>
  </text>
</g>

{/* Box 2 - General explanation */}
<g transform="translate(0, 535)">
  <rect width={732} height={45} rx={14} fill="#0F172A"/>
  <text x={36} y={28} fontSize={14} fontFamily="sans-serif">
    General explanation in single line.
  </text>
</g>
```

**When to Use:**
- 3+ lines text → separate boxes lebih rapi
- Mix monospace + sans-serif content
- Butuh visual separation antar concept

#### Option 3: Reduce Font Size (Last Resort)

```jsx
<text x={36} y={32} fontSize={12} fontFamily="monospace">
  Smaller text fits more content but less readable.
</text>
```

**Only use if:**
- Content HARUS fit dalam space terbatas
- Reduction < 2px (14→12 OK, 14→10 NOT OK)

---

## Text Styling Guidelines

### Typography Hierarchy

```jsx
{/* Title / Section Header */}
<text fontSize={20} fontFamily="'Arial Black', sans-serif" fontWeight={900}>
  SECTION TITLE
</text>

{/* Body - Technical */}
<text fontSize={14} fontFamily="monospace" fill="#94A3B8">
  Code-like or technical explanation
</text>

{/* Body - General */}
<text fontSize={14} fontFamily="sans-serif" fill="#CBD5E1">
  Human-friendly explanation
</text>

{/* Caption / Small */}
<text fontSize={11} fontFamily="sans-serif" fill="#64748B">
  Additional info or metadata
</text>
```

### Color Emphasis

```jsx
<text fontSize={14} fill="#64748B">
  Normal text with <tspan fill="#A78BFA" fontWeight={700}>highlighted keyword</tspan> inside.
</text>
```

**Emphasis Colors:**
- Purple `#A78BFA` - Technical terms
- Green `#34D399` - Success/Positive
- Red `#F43F5E` - Alert/Warning
- Blue `#38BDF8` - Info/Links

---

## Box Layout Patterns

### Standard Insight Box

```jsx
<g transform="translate(44, 500)">
  <rect width={732} height={65} rx={14} 
    fill="#0F172A" 
    stroke="#334155" 
    strokeWidth={1}/>
  <text x={36} y={28} fill="#64748B" fontSize={14}>
    Your insight text here...
  </text>
</g>
```

**Dimensions:**
- Width: `732px` (fits nicely in 820px viewport with 44px side margins)
- Height: 
  - Single line: `45px`
  - Two lines: `65px`
  - Three lines: `85px`
- Border radius: `rx={14}` (smooth corners)
- Padding: `36px` left, `28px` top untuk text positioning

### Alert/Warning Box

```jsx
<rect width={732} height={52} rx={14} 
  fill={isAlert ? '#1C0A0A' : '#0B1120'}
  stroke={isAlert ? '#F43F5E' : '#334155'} 
  strokeWidth={isAlert ? 2 : 1}
  filter={isAlert ? 'url(#glow)' : 'none'}/>
```

---

## GSAP Timeline Patterns

### Timeline Structure

```js
useEffect(() => {
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 })
  tlRef.current = tl
  window.__animationTimeline = tl  // Required for timeline controls

  let t = 0  // Time cursor

  // Act 1
  tl.add(() => {
    setPhaseIdx(0)
    // Reset all state untuk loop yang clean
    resetState()
  }, t)
  
  // ... animations
  t += PHASES[0].duration

  // Act 2
  tl.add(() => setPhaseIdx(1), t)
  // ... animations
  t += PHASES[1].duration

  return () => tl.kill()
}, [])
```

**Key Points:**
- `window.__animationTimeline` WAJIB untuk PREV/NEXT buttons
- `repeat: -1` untuk loop infinite
- `repeatDelay: 1` kasih jeda 1s sebelum loop ulang
- Always cleanup dengan `return () => tl.kill()`

### State Reset Pattern

```js
// ❌ BAD: Cumulative state (overflow setelah loop)
tl.to(ramPctObj, { v: ramPctObj.v + 17 }, t)

// ✅ GOOD: Fixed target values
const ramPctObj = { v: 0 }
tl.add(() => { ramPctObj.v = 0 }, t)  // Reset di awal Act
tl.to(ramPctObj, { v: 17 }, t + 1)
tl.to(ramPctObj, { v: 33 }, t + 2)
tl.to(ramPctObj, { v: 50 }, t + 3)
```

### Animation Sequencing

```js
// Sequential (one after another)
tl.to(element, { x: 100, duration: 1 }, t)
tl.to(element, { y: 50, duration: 0.5 }, t + 1)

// Simultaneous (parallel)
tl.to(element, { x: 100, duration: 1 }, t)
tl.to(element, { rotation: 90, duration: 1 }, t)  // Same time label

// Overlap (start before previous ends)
tl.to(element, { x: 100, duration: 1 }, t)
tl.to(element, { y: 50, duration: 0.5 }, t + 0.7)  // Starts at 0.7s
```

---

## SFX Integration

### Setup

```js
const sfxRef = useRef({})

const sfx = (name) => {
  if (!previewSfx || typeof window === 'undefined') return
  if (!sfxRef.current[name]) {
    sfxRef.current[name] = new Audio(`/audio/sfx/${name}.wav`)
  }
  const a = sfxRef.current[name]
  a.volume = (volume / 100) * 0.35
  a.playbackRate = speed
  a.currentTime = 0
  a.play().catch(() => {})
}
```

### Usage

```js
tl.add(() => {
  setDeskItems(prev => [...prev, newItem])
  sfx('click')  // Play sound effect
}, t + 1)
```

**Available SFX:**
- `whoosh` - Scene transition
- `click` - Item appear/interact
- `scan` - Progress/scanning
- `error` - Alert/warning
- `typing` - Text appear
- `success` - Completion

---

## Color Palette

### Background Layers
- Deep: `#070913` (main background)
- Mid: `#0B1120` (cards, boxes)
- Light: `#0F172A` (insight boxes)

### Borders & Dividers
- Subtle: `#1E293B`
- Default: `#334155`
- Emphasized: `#475569`

### Text Colors
- Primary: `#E2E8F0`
- Secondary: `#CBD5E1`
- Tertiary: `#94A3B8`
- Muted: `#64748B`
- Dim: `#475569`

### Accent Colors
- Blue: `#38BDF8` (Browser, Info)
- Purple: `#A78BFA` (Game, Technical)
- Green: `#34D399` (Success, RAM)
- Pink: `#F472B6` (Media, Audio)
- Yellow: `#FBBF24` (Video, Warning)
- Orange: `#FB923C` (Process, Activity)
- Red: `#F43F5E` (Alert, Swap, Error)
- Cyan: `#06B6D4` (Network, System)

---

## Pre-launch Checklist

### Visual QA
- [ ] Text tidak overflow di semua Acts
- [ ] Box heights pas dengan content (tidak terlalu ketat)
- [ ] Color contrast readable (min 4.5:1 untuk body text)
- [ ] Animation smooth di 30fps & 60fps
- [ ] No visual glitches saat loop ulang

### Technical QA
- [ ] Timeline registered ke `window.__animationTimeline`
- [ ] State reset proper di awal tiap Act
- [ ] No cumulative animations (gunakan fixed targets)
- [ ] Cleanup `tl.kill()` di unmount
- [ ] SFX volume respect user settings

### Content QA
- [ ] Fase/Acts jelas dan logical flow
- [ ] Terminologi konsisten (pilih satu istilah per concept)
- [ ] Analogi mudah dipahami (ELI5 level)
- [ ] Insight boxes explain WHY, not just WHAT

### Export QA
- [ ] Test export MP4 berhasil
- [ ] Duration setting respected
- [ ] No audio desync issues
- [ ] File size reasonable (<50MB untuk 60s @ 30fps)

---

## Common Issues & Solutions

### Issue: Text Overflow ke Kanan

**Symptom:** Text panjang keluar dari box boundary

**Solution:**
1. Pecah jadi 2-3 baris dengan `<tspan>`
2. Atau pecah jadi multiple boxes
3. Last resort: reduce font size 12px

**Example:** See `src/content/virtual-memory/Animation.jsx:576-593`

---

### Issue: Animation Tidak Loop dengan Smooth

**Symptom:** State incorrect di loop kedua

**Solution:** Reset state di awal tiap Act
```js
tl.add(() => {
  // Reset ALL state objects
  ramPctObj.v = 0
  setRamPct(0)
  setRamSlots(INITIAL_SLOTS)
}, t)
```

---

### Issue: Timeline Controls (PREV/NEXT) Tidak Bekerja

**Symptom:** Buttons tidak skip 5s

**Solution:** Register timeline ke window object
```js
window.__animationTimeline = tl
```

---

### Issue: Progress Bar Overflow >100%

**Symptom:** RAM/Swap bar shows 117% setelah loop

**Solution:** Gunakan fixed target values, bukan cumulative
```js
// ❌ BAD
tl.to(obj, { v: obj.v + 17 }, t)

// ✅ GOOD
tl.to(obj, { v: 17 }, t)
tl.to(obj, { v: 33 }, t + 1)
```

---

## Advanced Patterns

### Drag & Drop Simulation

```js
const [movingItem, setMovingItem] = useState(null)

// Animate item from A to B
const moveObj = { x: 0 }
tl.add(() => {
  setMovingItem({ label: 'Item', color: '#38BDF8' })
}, t)
tl.to(moveObj, {
  x: 1,
  duration: 1.2,
  ease: 'power2.inOut',
  onUpdate: () => setMovingItem(prev => ({ ...prev, x: moveObj.x }))
}, t + 0.1)
tl.add(() => setMovingItem(null), t + 1.3)

// Render
{movingItem && (
  <g transform={`translate(${lerp(startX, endX, movingItem.x)}, ${y})`}>
    <rect fill={movingItem.color} ... />
  </g>
)}
```

### Morph Animation (Intro)

```js
const [morphP, setMorphP] = useState(0)

const mo = { p: 0 }
tl.to(mo, {
  p: 1,
  duration: 0.8,
  ease: 'power3.inOut',
  onUpdate: () => setMorphP(mo.p)
}, t)

// Use morphP untuk interpolate shapes, opacity, colors
const radius = lerp(10, 50, morphP)
const opacity = morphP
```

---

## Resources

- GSAP Docs: https://greensock.com/docs/
- SVG Spec: https://www.w3.org/TR/SVG2/
- Color Contrast Checker: https://webaim.org/resources/contrastchecker/

---

## Questions?

Buka issue di repo atau tanya di team chat.
