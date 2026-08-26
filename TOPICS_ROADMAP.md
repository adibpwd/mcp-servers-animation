# Topic Roadmap & Development Guide

Dokumentasi lengkap semua topics yang ada, status, dan cara develop-nya.

---

## 📊 Current Status (9 Topics Total)

### ✅ READY (1)

| # | Topic | Folder | Difficulty | Est. Days | Status |
|---|-------|--------|-----------|-----------|--------|
| 1 | MCP Servers | `mcp-servers/` | ⭐⭐ | 3 | ✅ READY |

### 🔜 COMING SOON (8)

#### Tier 1 — Beginner Friendly (Orang Awam)

| # | Topic | Folder | Difficulty | Est. Days | Priority |
|---|-------|--------|-----------|-----------|----------|
| 2 | Desktop Environment | `desktop-environment/` | ⭐ | 2-3 | 🟢 HIGH |
| 3 | Linux vs Windows vs macOS | `linux-vs-windows/` | ⭐⭐ | 2 | 🟢 HIGH |
| 4 | Linux File Permission (chmod) | `file-permission/` | ⭐ | 1-2 | 🟢 HIGH |

#### Tier 2 — Intermediate (Beginner → Intermediate)

| # | Topic | Folder | Difficulty | Est. Days | Priority |
|---|-------|--------|-----------|-----------|----------|
| 5 | Shell Pipeline (\|) | `shell-pipeline/` | ⭐ | 2 | 🟡 MEDIUM |
| 6 | What is Linux Kernel? | `what-is-kernel/` | ⭐ | 1 | 🟡 MEDIUM |
| 7 | Process vs Thread | `process-vs-thread/` | ⭐⭐ | 2 | 🟡 MEDIUM |

#### Tier 3 — Advanced (Intermediate → Advanced)

| # | Topic | Folder | Difficulty | Est. Days | Priority |
|---|-------|--------|-----------|-----------|----------|
| 8 | Linux Kernel Architecture | `linux-kernel-architecture/` | ⭐⭐ | 3 | 🔵 LOW |
| 9 | Virtual Memory Management | `virtual-memory/` | ⭐⭐⭐⭐ | 4 | 🔵 LOW |

---

## 🎯 Recommended Development Order

```
PHASE 1 — Orang Awam Content (Week 1-2, ~7 hari)
├─ 2. Desktop Environment         (2-3 hari) ← START HERE
├─ 3. Linux vs Windows            (2 hari)
└─ 4. File Permission             (1-2 hari)

PHASE 2 — Beginner-Intermediate (Week 3, ~5 hari)
├─ 5. Shell Pipeline              (2 hari)
├─ 6. What is Kernel              (1 hari)
└─ 7. Process vs Thread           (2 hari)

PHASE 3 — Deep Dive (Week 4-5, ~7 hari)
├─ 8. Kernel Architecture         (3 hari)
└─ 9. Virtual Memory              (4 hari)
```

**Total: ~19 hari kerja = 8 animasi** ✅

---

## 📁 Folder Structure (per topic)

Setiap topic punya 2 files:

```
src/content/topic-name/
├── data.js           ← Konstanta & data statis
└── Animation.jsx     ← React component (default export)
```

### data.js Template

```javascript
// Ukuran canvas (WAJIB sama untuk semua)
export const VW = 820
export const VH = 1340

// Data spesifik topic
export const NODES = [...]
export const CONNECTIONS = [...]

// Animasi phases (minimum 2)
export const PHASES = [
  {
    badge:       'PHASE NAME',
    badgeColor:  '#60A5FA',
    caption:     'Description',
    duration:    5,  // detik
    // ... custom props sesuai kebutuhan
  },
]

export const COUNTER_START = 0
```

### Animation.jsx Template

```jsx
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { VW, VH, PHASES, COUNTER_START } from './data'

export default function TopicAnimation() {
  const dotsLayerRef = useRef(null)
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [counter, setCounter] = useState(COUNTER_START)

  const phase = PHASES[phaseIdx]

  useEffect(() => {
    const dots = dotsLayerRef.current
    if (!dots) return

    // Build GSAP timeline here
    const master = gsap.timeline({ repeat: -1, repeatDelay: 1.5 })
    
    // ... animation code

    return () => master.kill()
  }, [])

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} style={{ ... }}>
      {/* SVG content */}
      <g ref={dotsLayerRef} />
    </svg>
  )
}
```

---

## 📝 Topic Specifications

### 2️⃣ Desktop Environment

**Concept:** Compare 4 DE: GNOME, KDE, XFCE, i3

**Phases (4):**
1. GNOME - user-friendly, modern, resource-heavy
2. KDE - feature-rich, customizable
3. XFCE - lightweight, stable
4. i3 - minimalist, keyboard-driven

**Metrics per phase:**
- Resource usage (RAM consumption)
- Learning curve (beginner → advanced)
- Use case

**Suggested Animations:**
- Bars showing RAM/CPU usage
- Timeline from simple → complex
- Icons representing each DE

**Estimated:** 2-3 days

---

### 3️⃣ Linux vs Windows vs macOS

**Concept:** OS comparison (philosophy, architecture, market)

**Phases (4):**
1. User base & market share
2. Architecture (kernel design)
3. Philosophy (open vs closed)
4. Use cases (server, desktop, mobile)

**Metrics:**
- Market share pie chart
- Architecture layers
- Philosophy alignment

**Suggested Animations:**
- Growing/shrinking market bubbles
- Layer comparison (User → Kernel → Hardware)
- Venn diagram philosophy overlap

**Estimated:** 2 days

---

### 4️⃣ File Permission (chmod)

**Concept:** rwxrwxrwx breakdown (user/group/other)

**Phases (3):**
1. What is chmod? (basic concept)
2. rwx breakdown (read/write/execute)
3. chmod command (practical usage)

**Metrics:**
- Permission bits (0-7 per category)
- chmod 755, 644, 777 examples

**Suggested Animations:**
- Grid showing r/w/x checkboxes
- User/group/other layers
- chmod calculation (3 bits → 1 octal)

**Estimated:** 1-2 days

---

### 5️⃣ Shell Pipeline (|)

**Concept:** How pipes connect commands (STDIN/STDOUT flow)

**Phases (4):**
1. What is a pipe?
2. STDIN → STDOUT → STDIN flow
3. Multiple pipes chaining
4. Redirect (>, >>)

**Example:** `cat file.txt | grep "pattern" | sort`

**Suggested Animations:**
- Command boxes connected by pipes
- Data flowing left → right
- STDIN/STDOUT labels
- Each pipe adds processing

**Estimated:** 2 days

---

### 6️⃣ What is Linux Kernel?

**Concept:** ELI5 explanation of kernel

**Phases (3):**
1. Kernel = manager of computer resources
2. What kernel does (process, memory, devices)
3. Why Linux kernel special (open source, modular)

**Suggested Animations:**
- Simple analogy (kernel as conductor/manager)
- Resource boxes (CPU, RAM, Disk, Devices)
- Kernel connecting them

**Estimated:** 1 day

---

### 7️⃣ Process vs Thread

**Concept:** Memory isolation & when to use each

**Phases (3):**
1. Process = isolated memory space
2. Thread = shared memory within process
3. Context switching & performance

**Metrics:**
- Memory layout (process vs thread)
- Overhead comparison
- Use cases

**Suggested Animations:**
- Two processes side-by-side (isolation)
- Threads inside same process (shared memory)
- Context switch visualization

**Estimated:** 2 days

---

### 8️⃣ Linux Kernel Architecture

**Concept:** Layer model (User → Syscall → Kernel → Hardware)

**Phases (4):**
1. User Space (Applications)
2. Syscall Interface
3. Kernel Space (Scheduler, Memory, FS, Drivers)
4. Hardware Layer

**Suggested Animations:**
- Vertical layers stacking up
- System calls crossing boundary
- Subsystems (scheduler, memory manager) visualized

**Estimated:** 3 days

---

### 9️⃣ Virtual Memory Management

**Concept:** RAM vs Disk swap, page tables, TLB, paging

**Phases (4):**
1. Physical memory (RAM) basics
2. Virtual memory concept
3. Page table & TLB
4. Swap mechanism (disk as extension)

**Metrics:**
- Virtual → Physical address translation
- Page hit/miss rates
- Swap performance impact

**Suggested Animations:**
- Virtual address space visualization
- Page table mapping
- TLB cache hits
- Disk swap when RAM full

**Estimated:** 4 days (most technical)

---

## ✅ Checklist Sebelum Mulai Develop

- [ ] Read topic specification di atas
- [ ] Update `data.js` dengan konstanta/data
- [ ] Buat placeholder SVG elements di `Animation.jsx`
- [ ] Build GSAP timeline
- [ ] Add glowing dots (gunakan `src/shared/GlowDot.js`)
- [ ] Test di browser (localhost:5173)
- [ ] Change status `coming-soon` → `ready` di registry.js
- [ ] No console.log tertinggal
- [ ] Mobile responsive (viewBox scaling)

---

## 🔧 Development Tips

### Use `createGlowDot` untuk animated dots

```javascript
import { createGlowDot, destroyDots } from '../../shared/GlowDot'

const dots = []
dots.push(createGlowDot(
  dotsLayer, x1, y1, x2, y2,
  color, delay, duration, gap
))

return () => destroyDots(dots)
```

### Phase transition pattern

```javascript
const master = gsap.timeline({ repeat: -1, repeatDelay: 1.5 })

PHASES.forEach((ph, idx) => {
  const startTime = PHASES.slice(0, idx).reduce((s, p) => s + p.duration, 0)
  
  // Add phase marker
  master.add(() => setPhaseIdx(idx), startTime)
  
  // Animate counter per phase
  master.to(counterObj, {
    v: ph.counterEnd,
    duration: ph.duration,
    onUpdate: () => setCounter(Math.round(counterObj.v))
  }, startTime)
})
```

### Keep canvas consistent

- ViewBox: ALWAYS `0 0 820 1340`
- Background: ALWAYS `#090b15`
- Filter: ALWAYS include `#dotGlow`

---

## 🎨 Color Palette (per topic)

| Topic | Primary | Secondary | Accent |
|-------|---------|-----------|--------|
| Desktop Env | #60A5FA | #3B82F6 | #1E40AF |
| Linux vs Win | #F472B6 | #EC4899 | #BE185D |
| File Perm | #FBBF24 | #F59E0B | #D97706 |
| Shell Pipeline | #34D399 | #10B981 | #047857 |
| What is Kernel | #A78BFA | #8B5CF6 | #6D28D9 |
| Process/Thread | #FB923C | #F97316 | #EA580C |
| Kernel Arch | #06B6D4 | #0891B2 | #0E7490 |
| Virtual Memory | #EC4899 | #DB2777 | #BE185D |

---

## 📚 Reference

- Topic roadmap live di: `src/content/registry.js`
- Reusable helpers: `src/shared/GlowDot.js`, `src/hooks/useTimeline.js`
- Main component structure: `src/content/mcp-servers/Animation.jsx` (contoh working)

**Ready to start?** Pick one topic dari checklist! 🚀
