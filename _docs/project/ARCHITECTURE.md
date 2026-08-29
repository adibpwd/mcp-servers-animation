# Arsitektur Animasi — Teknologi & Cara Kerja

Dokumentasi ini menjelaskan bagaimana animasi dibuat menggunakan GSAP, React, dan SVG — dari timeline orchestration sampai rendering ke layar.

---

## **1. GSAP (GreenSock Animation Platform) — The Core Engine**

### **Fungsi:** Master timeline orchestrator — mengatur SEMUA animasi.

### **Cara kerja:**
- **Timeline:** Container yang hold semua tween/animation dalam urutan waktu
- **Tween:** Animasi individual (misal: progress bar dari 0% → 100% dalam 2 detik)
- `master.to(object, { property: targetValue, duration: 2s })` → animate object property

### **Di animasi RAM & SWAP:**
```jsx
const master = gsap.timeline({ repeat: -1, repeatDelay: 1.5 })

// Phase 1: Intro (t=0-9s)
master.add(() => setPhaseIdx(0), 0)
master.add(() => setDeskItems([...]), 1.0)
master.add(() => setDeskFull(true), 7.5)

// Phase 2: RAM mapping (t=9-17.5s)
master.to(ramPctObj, { v: 17, duration: 0.4, onUpdate: () => setRamPct(ramPctObj.v) }, 9.0)
master.to(ramPctObj, { v: 33, duration: 0.4, onUpdate: () => setRamPct(ramPctObj.v) }, 10.5)

// Phase 3: Swap out (t=17.5-27.5s)
master.to(ramObj3, { v: 83, duration: 0.6, onUpdate: () => setAct3Ram(ramObj3.v) }, 22.0)

// Phase 4: Latency bars (t=27.5-36.5s)
master.to(latObj[0], { v: 25, duration: 0.8, onUpdate: () => setLatencyAnim(...) }, 30.0)
```

**Key features:**
- `tl.seek(detik)` → jump ke frame tertentu (untuk timeline player)
- `tl.time()` → baca posisi detik saat ini
- `tl.progress()` → baca progress 0.0-1.0
- `tl.pause()` / `tl.resume()` → control playback

**Simpelnya:** GSAP adalah "director" film yang ngatur kapan apa muncul, bergerak, berubah warna.

---

## **2. React State — Visual Data Synchronization**

### **Fungsi:** Store data yang triggered oleh GSAP timeline.

### **Flow di ACT 1 (Intro):**
```
GSAP timeline event (t=0)
  ↓
master.add(() => setPhaseIdx(0), 0)  ← Trigger state update
  ↓
React re-render dengan phaseIdx=0
  ↓
Component render ACT 1 content (Meja Kerja)
```

### **Di animasi RAM & SWAP:**
```jsx
const [phaseIdx, setPhaseIdx] = useState(0)        // Switch antara intro/ACT1/ACT2/ACT3/ACT4
const [ramPct, setRamPct] = useState(0)            // Progress bar RAM (0-100)
const [deskItems, setDeskItems] = useState([])     // Array berkas di meja ACT1
const [movingPage, setMovingPage] = useState(null) // Animasi halaman bergerak (ACT3)
const [swapAlert, setSwapAlert] = useState(false)  // Alert merah saat RAM penuh
```

### **Conditional Rendering:**
```jsx
{phaseIdx === 0 && (
  <g transform="translate(44, 230)">
    {/* Render ACT 1: Meja Kerja */}
  </g>
)}

{phaseIdx === 2 && (
  <g transform="translate(44, 230)">
    {/* Render ACT 3: Swap Out */}
  </g>
)}
```

**Simpelnya:** React state = "catatan" status animasi di setiap saat. GSAP bilang "ubah jadi INI", React render sesuai.

---

## **3. SVG (Scalable Vector Graphics) — Visual Canvas**

### **Fungsi:** Container gambar yang di-render React.

### **Struktur:**
```xml
<svg viewBox="0 0 820 1340">
  <defs>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur1" />
      <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur2" />
      <feMerge>
        <feMergeNode in="blur2" />
        <feMergeNode in="blur1" />
        <feMergeNode in="SourceGraphic" />
      </feMerge>
    </filter>
    
    <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
      <stop offset="0%" stopColor="#2CD1A8" />
      <stop offset="100%" stopColor="#38BCF8" />
    </linearGradient>
  </defs>
  
  <rect x={0} y={0} width={732} height={90} rx={16} fill="#090D1A" />
  <text x={366} y={32} textAnchor="middle" fill="#E2E8F0">Caption Text</text>
  <circle cx={80} cy={60} r={30} fill="#064E3B" />
  <line x1={100} y1={340} x2={600} y2={340} stroke="#4C1D29" strokeWidth={2} />
</svg>
```

### **Di animasi RAM & SWAP:**
- Background grid (50+ `<line>` elements)
- Header text (LINUX CORE · ADIB-DEV.COM) dengan gradient
- Boxes (RAM, Swap, Physical Slots) dengan shadow filter
- Progress bars (dengan `<rect>` width yang berubah sesuai state)
- Animasi moving page (transform x position via lerp)

### **Dynamic Properties:**
```jsx
<rect 
  x={20} 
  y={55} 
  width={ramUsage * 2}  // Dynamic width dari state
  height={8} 
  rx={4} 
  fill={ramUsage > 90 ? '#F43F5E' : '#34D399'}  // Conditional color
  filter={ramUsage > 90 ? 'url(#glow)' : 'none'}  // Conditional effect
/>
```

**Simpelnya:** SVG = kanvas digital. React render SVG elements, GSAP ubah properties (width, opacity, transform), browser draw ulang.

---

## **4. requestAnimationFrame (RAF) — Timeline Sync**

### **Fungsi:** Sync progress bar dengan GSAP timeline saat playback.

### **Cara kerja:**
```js
useEffect(() => {
  if (!timelineReady) return

  const updateTime = () => {
    const tl = window.__animationTimeline  // Global ref dari animation component
    if (tl) {
      const prog = tl.progress() * 100  // 0-100
      const time = tl.time()            // detik saat ini
      
      setProgress(prog)
      setCurrentTime(time)
    }
    rafRef.current = requestAnimationFrame(updateTime)  // Loop setiap frame (60fps)
  }
  
  rafRef.current = requestAnimationFrame(updateTime)
  return () => {
    if (rafRef.current) cancelAnimationFrame(rafRef.current)
  }
}, [timelineReady])
```

### **Di TimelineProgressBar:**
- Setiap frame (~16ms di 60fps), baca `tl.time()` dan `tl.progress()`
- Update state `currentTime` & `progress`
- React re-render progress bar visual
- User lihat bar berjalan smooth seiring video

**Simpelnya:** RAF = "mata" yang nonton timeline GSAP, lalu report ke progress bar "sekarang jam berapa".

---

## **5. React Hooks — State & Effect Management**

### **Fungsi:** Menangani lifecycle animasi (mount, update, cleanup).

### **Dipake:**

#### `useState()` — store animation state
```jsx
const [phaseIdx, setPhaseIdx] = useState(0)
const [ramPct, setRamPct] = useState(0)
const [deskItems, setDeskItems] = useState([])
```

#### `useEffect()` — run GSAP timeline saat component mount
```jsx
useEffect(() => {
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.0 })
  
  // ... build timeline dengan master.to(), master.add()
  let time = 0
  
  master.add(() => setPhaseIdx(0), time)
  master.to(ramPctObj, { v: 17, duration: 0.4 }, time + 1.0)
  
  return () => tl.kill()  // Cleanup saat unmount
}, [])  // Run sekali saat mount
```

#### `useRef()` — store persistent object antar render
```jsx
const timelineRef = useRef(null)
const rafRef = useRef(null)
const prevProgressRef = useRef(0)
```

**Simpelnya:** Hooks = lifecycle manager. Pastiin GSAP timeline jalan pas component muncul, dan bersih saat hilang.

---

## **6. CSS — Visual Styling**

### **Fungsi:** Warna, ukuran, shadow, filter effects.

### **Di SVG:**
```jsx
<rect 
  fill="#090D1A"           // Background gelap
  stroke="#38BDF8"         // Border biru
  strokeWidth={2}
  filter="url(#glow)"      // Apply blur filter
  opacity={0.5}            // Transparansi
/>
```

### **Di HTML (TimelineProgressBar):**
```css
.timeline-nav-btn {
  padding: 8px 12px;
  background: rgba(56, 189, 248, 0.1);
  border: 1.5px solid #38BDF8;
  transition: all 0.2s ease;
}

.timeline-nav-btn:hover:not(:disabled) {
  background: rgba(56, 189, 248, 0.2);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(56, 189, 248, 0.3);
}

@media (max-width: 768px) {
  .timeline-nav-btn {
    padding: 12px 16px;  /* Bigger for mobile */
    font-size: 15px;
  }
}
```

**Simpelnya:** CSS = "makeup" visual. Warna, ukuran, efek glow/shadow, responsive behavior.

---

## **FLOW ANIMASI — Dari Timeline sampai Screen**

```
┌─────────────────────────────────────────────────────────────────┐
│ 1. GSAP Timeline Build (saat component mount)                   │
├─────────────────────────────────────────────────────────────────┤
│   ├─ PHASE 0 (t=0-9s): Desk items muncul                       │
│   │  ├─ t=1s: setDeskItems([...])                              │
│   │  ├─ t=2s: setDeskItems([...]) lagi                         │
│   │  └─ t=7.5s: setDeskFull(true)                              │
│   │                                                              │
│   ├─ PHASE 1 (t=9-17.5s): RAM mapping                          │
│   │  ├─ t=9s: setPhaseIdx(1)                                   │
│   │  ├─ gsap.to(ramPctObj, { v: 17 }) → setRamPct(17)         │
│   │  ├─ gsap.to(ramPctObj, { v: 33 }) → setRamPct(33)         │
│   │  └─ ... dan seterusnya                                     │
│   │                                                              │
│   ├─ PHASE 2 (t=17.5-27.5s): Swap out                          │
│   │  └─ gsap.to(ramObj3, { v: 83 }) → setAct3Ram(83)          │
│   │                                                              │
│   └─ PHASE 3 (t=27.5-36.5s): Latency bars                      │
│      └─ gsap.to(latObj[i], { v: value }) setiap latency bar    │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 2. RAF Loop (setiap ~16ms / 60fps)                              │
├─────────────────────────────────────────────────────────────────┤
│   ├─ Read: tl.time() & tl.progress()                           │
│   └─ Update state: setCurrentTime(), setProgress()             │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 3. React Render Cycle                                           │
├─────────────────────────────────────────────────────────────────┤
│   ├─ State berubah (dari GSAP callback atau RAF)               │
│   ├─ Component re-render dengan state baru                     │
│   ├─ SVG elements update properties (width, x, opacity, dll)   │
│   └─ Virtual DOM diffing & reconciliation                      │
└─────────────────────────────────────────────────────────────────┘
                              ↓
┌─────────────────────────────────────────────────────────────────┐
│ 4. Browser Paint                                                 │
├─────────────────────────────────────────────────────────────────┤
│   └─ Visual update muncul di layar user (compositing layer)    │
└─────────────────────────────────────────────────────────────────┘
```

---

## **TOOL PENTING (Yang BENAR-BENAR berpengaruh):**

| Tool | Fungsi | Pentingnya | Catatan |
|------|--------|-----------|---------|
| **GSAP** | Timeline & tween orchestration | 🔴 CRITICAL | Tanpa ini, animasi mati — tidak ada yang jalan |
| **React State** | Sync data & trigger re-render | 🔴 CRITICAL | Tanpa ini, visual tidak update saat timeline jalan |
| **SVG** | Canvas visual | 🔴 CRITICAL | Tanpa ini, tidak ada yang digambar ke layar |
| **RAF** | Sync progress bar dengan timeline | 🟡 PENTING | Tanpa ini, progress bar stale (tidak real-time) |
| **CSS Filter** | Blur/glow effect | 🟢 NICE-TO-HAVE | Effect visual doang, bisa tanpa (tapi kurang keren) |
| **React Hooks** | Lifecycle management | 🔴 CRITICAL | Tanpa ini, memory leak & timeline tidak cleanup |

---

## **TEKNIK KHUSUS YANG DIPAKE**

### **1. Loop-Aware Progress Tracking**
```jsx
const prevProgressRef = useRef(0)

// Detect loop reset
if (prog < prevProgressRef.current - 5) {
  // Loop happened, reset is natural
}
prevProgressRef.current = prog
```

**Problem:** `tl.progress()` loncat dari 100% → 0% saat loop. Progress bar harus smooth reset.

**Solution:** Track previous progress, detect big drop (>5%), treat sebagai loop reset (bukan seek backward).

---

### **2. Boundary Clamping untuk Seek**
```jsx
const handleSeek = (targetTime) => {
  const clampedTime = Math.max(0, Math.min(totalDuration, targetTime))
  tl.seek(clampedTime)
}
```

**Problem:** User drag slider ke luar boundary (< 0 atau > maxDuration).

**Solution:** Clamp target time ke [0, totalDuration] range. Timeline tidak bisa seek ke luar boundary.

---

### **3. Conditional Text Anchor (Smooth Transition)**
```jsx
<text 
  x={taglineX} 
  textAnchor={mp < 0.5 ? "start" : "middle"}
>
  LINUX CORE · ADIB-DEV.COM
</text>
```

**Problem:** Text perlu left-aligned saat intro, tapi center-aligned saat header.

**Solution:** Switch `textAnchor` di mid-morph. Smooth visual transition tanpa jump.

---

### **4. Global Timeline Reference**
```jsx
// Di animation component
useEffect(() => {
  const tl = gsap.timeline({ repeat: -1 })
  window.__animationTimeline = tl  // Expose globally
  // ...
}, [])

// Di TimelineProgressBar
const tl = window.__animationTimeline
if (tl) {
  setCurrentTime(tl.time())
}
```

**Problem:** Progress bar component perlu akses timeline dari animation component (sibling, bukan parent-child).

**Solution:** Store timeline reference di `window` object. Simple global state untuk cross-component communication.

---

## **RINGKAS: Gimana Animasi Dibuat**

1. **Timeline Building (GSAP)** → Director bilang "di detik 5, ubah ini jadi INI"
2. **State Triggering (React)** → Director bilang React state, React listen & update
3. **React Re-render** → React liat state berubah, re-render SVG dengan data baru
4. **SVG Update** → SVG elements property berubah (width, opacity, x, transform)
5. **Browser Paint** → Browser gambar ulang, user lihat animasi smooth

**Semuanya happen concurrent & smooth:**
- GSAP timeline jalan di background (independent thread)
- RAF update progress bar setiap frame (60fps)
- React render smooth (virtual DOM diffing)
- Browser compositing layer optimal performance

---

## **PERFORMANCE CONSIDERATIONS**

### **Optimization Techniques Used:**

1. **requestAnimationFrame untuk smooth 60fps**
   - Tidak pakai setInterval (jank-prone)
   - RAF sync dengan browser repaint cycle

2. **React Virtual DOM**
   - Hanya re-render component yang state-nya berubah
   - Conditional rendering per phase (phaseIdx switching)

3. **SVG instead of Canvas**
   - Declarative (React friendly)
   - Browser-native rendering optimization
   - Smooth scaling (vector-based)

4. **GSAP Timeline Reuse**
   - Single timeline object untuk infinite loop
   - Tidak create/destroy timeline setiap loop (memory efficient)

5. **State Batching**
   - Multiple setState di satu callback → single re-render
   - Tidak trigger re-render berlebihan

---

**Dokumentasi dibuat:** 21 Agustus 2026  
**Project:** MCP Servers Animation — Virtual Memory (RAM & SWAP)
