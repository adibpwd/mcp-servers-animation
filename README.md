# AI Explainer — Visual Animations for AI Concepts

Koleksi animasi edukatif berbasis React + GSAP untuk menjelaskan konsep AI secara visual.
Tiap topic adalah satu animasi mandiri yang bisa ditambah tanpa mengubah kode lama.

---

## 🚀 Quick Start

```bash
npm install
npm run dev
# Buka http://localhost:5173
```

---

## 📖 Standarisasi & Panduan Pembuatan Konten

Kami telah menyusun dokumentasi khusus berdasarkan pengalaman membuat animasi "Linux File Permission". Panduan ini mencakup standardisasi animasi GSAP, thumbnail/morphing, sinkronisasi audio, hingga export pipeline menggunakan Puppeteer dan FFMPEG.

Lihat panduan lengkapnya di: **[CREATING_NEW_TOPIC.md](./CREATING_NEW_TOPIC.md)**

---

## 📁 Struktur Folder

```
src/
├── content/                   ← SEMUA TOPIC DI SINI
│   ├── registry.js            ← Daftar semua topic (tambah di sini!)
│   └── mcp-servers/           ← Contoh topic pertama
│       ├── Animation.jsx      ← Komponen animasi utama
│       └── data.js            ← Data statis (nodes, phases, posisi)
│
├── components/                ← UI shell (tidak perlu diubah per topic)
│   ├── ContentList.jsx        ← Halaman utama (grid kartu topic)
│   ├── ContentCard.jsx        ← Kartu tiap topic
│   └── PlayerShell.jsx        ← Wrapper saat memutar animasi
│
├── shared/                    ← Helper yang bisa dipakai semua topic
│   └── GlowDot.js             ← Animated glowing dot (GSAP)
│
├── hooks/
│   └── useTimeline.js         ← Custom hook GSAP timeline
│
├── App.jsx                    ← Router sederhana (state-based, no lib)
└── main.jsx
```

---

## ➕ Cara Tambah Topic Baru

### Langkah 1 — Buat folder topic

```bash
mkdir src/content/nama-topic
```

Nama folder pakai **kebab-case**. Contoh: `rag-pipeline`, `agent-loop`, `attention-mechanism`.

---

### Langkah 2 — Buat `data.js`

File ini berisi semua konstanta dan data animasi. **Jangan taruh logic di sini**, hanya data murni.

```js
// src/content/nama-topic/data.js

// Ukuran canvas SVG (portrait 9:16)
export const VW = 820
export const VH = 1340

// Node-node yang akan ditampilkan
export const NODES = [
  { id: 'node-a', label: 'NODE A', x: 200, y: 400 },
  { id: 'node-b', label: 'NODE B', x: 600, y: 400 },
]

// Koneksi antar node
export const CONNECTIONS = [
  { from: 'node-a', to: 'node-b' },
]

// Fase animasi — minimal 2, maksimal bebas
export const PHASES = [
  {
    badge:       'NAMA FASE 1',
    badgeColor:  '#4ADE80',      // Warna badge pill
    caption:     'Teks caption bawah',
    // ... data lain sesuai kebutuhan animasi
    duration:    5,              // Durasi fase ini (detik)
  },
  {
    badge:       'NAMA FASE 2',
    badgeColor:  '#60A5FA',
    caption:     'Caption fase 2',
    duration:    5,
  },
]

export const COUNTER_START = 0  // Angka awal counter (jika ada)
```

---

### Langkah 3 — Buat `Animation.jsx`

Komponen ini adalah **default export** dan langsung di-lazy-load oleh PlayerShell.

```jsx
// src/content/nama-topic/Animation.jsx
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { VW, VH, NODES, CONNECTIONS, PHASES, COUNTER_START } from './data'

export default function NamaTopicAnimation() {
  const dotsLayerRef = useRef(null)
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [counter,  setCounter]  = useState(COUNTER_START)

  const phase = PHASES[phaseIdx]

  useEffect(() => {
    const dots = dotsLayerRef.current
    if (!dots) return

    // Buat GSAP timeline di sini
    const master = gsap.timeline({ repeat: -1, repeatDelay: 1.5 })

    // Contoh: animasi counter per fase
    let start = COUNTER_START
    PHASES.forEach((ph, idx) => {
      const startTime = PHASES.slice(0, idx).reduce((s, p) => s + p.duration, 0)
      const c = { v: start }
      master.add(() => setPhaseIdx(idx), startTime)
      master.to(c, {
        v: ph.counterEnd ?? start,
        duration: ph.duration,
        onUpdate: () => setCounter(Math.round(c.v)),
      }, startTime)
      start = ph.counterEnd ?? start
    })

    return () => master.kill()
  }, [])

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`}
      style={{ width: '100%', height: '100%',
        maxHeight: '100vh', maxWidth: `calc(100vh * ${VW} / ${VH})` }}>

      <defs>
        {/* Glow filter — wajib ada untuk GlowDot */}
        <filter id="dotGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
          <feMerge>
            <feMergeNode in="blur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect width={VW} height={VH} fill="#090b15" />

      {/* Isi animasi di sini... */}

      {/* Dots layer — diisi GSAP secara imperatif */}
      <g ref={dotsLayerRef} />

    </svg>
  )
}
```

---

### Langkah 4 — Register di `registry.js`

Buka `src/content/registry.js` dan tambahkan object baru:

```js
{
  id:        'nama-topic',          // Harus sama dengan nama folder
  title:     'Judul Topic',         // Ditampilkan di kartu
  subtitle:  'Deskripsi singkat',   // 1 kalimat
  category:  'Kategori',            // Contoh: 'AI Architecture', 'ML Fundamentals'
  tags:      ['Tag1', 'Tag2'],      // 2-4 tag singkat
  color:     '#60A5FA',             // Warna aksen kartu (hex)
  status:    'ready',               // 'ready' atau 'coming-soon'
  component: () => import('./nama-topic/Animation'),  // Lazy import
}
```

> **Status `coming-soon`**: Card ditampilkan tapi tidak bisa diklik. Ubah ke `'ready'` kalau sudah selesai.

---

### Langkah 5 — Selesai ✅

Buka http://localhost:5173, topic baru langsung muncul di list.

---

## 🎨 Standarisasi Visual

### Canvas Size
| Property | Value |
|----------|-------|
| ViewBox  | `0 0 820 1340` |
| Rasio    | ~9:16 (portrait) |
| Background | `#090b15` |

### Warna Palette
| Nama | Hex | Dipakai untuk |
|------|-----|---------------|
| Green | `#4ADE80` | Highlights, ready state |
| Blue | `#60A5FA` | Secondary elements |
| Pink | `#FF3B8C` | Chaos/problem state |
| Cyan | `#00D9FF` | Technical/protocol |
| Gold | `#FFD60A` | Final/success state |
| Teal | `#00BFA5` | MCP / structured state |

### Typography
| Elemen | Font | Size | Color |
|--------|------|------|-------|
| Title besar | `'Arial Black'` | 80-90px | `white` |
| Label node | `monospace` | 16-20px | node color |
| Badge pill | `monospace` | 13-15px | badge color |
| Caption | `sans-serif` | 18-20px | `#aaaaaa` |
| Footer | `monospace` | 13-15px | `#2a4060` |

### Animated Dots
Gunakan helper `createGlowDot` dari `src/shared/GlowDot.js`:

```js
import { createGlowDot, destroyDots } from '../../shared/GlowDot'

const dots = []

// Buat dot
dots.push(createGlowDot(
  dotsLayer,   // parent SVG <g> element
  x1, y1,      // start position
  x2, y2,      // end position
  '#FF006E',   // color
  delay,       // detik
  duration,    // detik
  gap          // repeat gap detik
))

// Cleanup di return useEffect
return () => destroyDots(dots)
```

### Phase Transitions
- Durasi per fase: **3–6 detik** (jangan terlalu cepat/lambat)
- Jumlah fase: **2–4** per animasi
- Total durasi: **12–20 detik** lalu loop

---

## 🔧 Tech Stack

| Library | Versi | Kegunaan |
|---------|-------|---------|
| React | 18 | UI components |
| Vite | 5 | Build tool & dev server |
| GSAP | 3.12 | Animasi (timeline, dots, counter) |
| D3 | 7.8 | Tersedia jika butuh force simulation / skala |

---

## 📋 Checklist Sebelum Topic Jadi `ready`

- [ ] `data.js` berisi semua konstanta (tidak ada magic number di Animation.jsx)
- [ ] `Animation.jsx` pakai `default export`
- [ ] Semua node punya posisi `x, y` yang fixed (bukan dynamic)
- [ ] Minimal 2 fase animasi
- [ ] Counter animasi tersinkron dengan fase
- [ ] `dotsLayerRef` ada di SVG dan di-cleanup di `useEffect` return
- [ ] Filter `#dotGlow` ada di `<defs>`
- [ ] Tidak ada `console.log` tertinggal
- [ ] Status di `registry.js` diubah ke `'ready'`

---

## 🗂️ Topic yang Sudah Ada & Rencana

| Topic | Status | Folder |
|-------|--------|--------|
| MCP Servers | ✅ Ready | `mcp-servers/` |
| RAG Pipeline | 🔜 Coming Soon | — |
| AI Agent Loop | 🔜 Coming Soon | — |
| Vector Embeddings | 🔜 Coming Soon | — |
| Function Calling | 🔜 Coming Soon | — |
| Attention Mechanism | 🔜 Coming Soon | — |

---

## 📝 Catatan

- File lama di root (`SETUP_PROMPT.md`, `CHANGES_SUMMARY.md`, dll) bisa dihapus — sudah tidak relevan
- Folder `src/utils/`, `src/styles/` berisi file lama, belum dipakai di arsitektur baru
- File `src/components/MCPAnimation.jsx` adalah versi lama, sudah dipindah ke `src/content/mcp-servers/Animation.jsx`
