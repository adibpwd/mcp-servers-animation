# 01 — Arsitektur: Bagaimana Animasi Bekerja

Baca ini dulu sebelum bikin topic baru. Menjelaskan bagaimana animasi dibuat dari GSAP timeline sampai muncul di layar.

> Alur baca lengkap: `01-architecture` → `02-standar-konten` → `03-tutorial-buat-topic-baru` → `04-referensi-gsap` → `05-svg-text-guide` → `06-icon-generation` → `08-audio-sfx-generation`

---

## 1. GSAP — Timeline Orchestrator

Master timeline yang mengatur SEMUA animasi (kapan apa muncul, bergerak, berubah warna).

```jsx
const master = gsap.timeline({ repeat: -1, repeatDelay: 1.5 })

master.add(() => setPhaseIdx(0), 0)                 // trigger state di waktu tertentu
master.to(ramPctObj, { v: 17, duration: 0.4,
  onUpdate: () => setRamPct(ramPctObj.v) }, 9.0)     // tween angka
```

Key API: `tl.seek(detik)`, `tl.time()`, `tl.progress()`, `tl.pause()/resume()`.

## 2. React State — Sinkronisasi Data Visual

State di-trigger oleh callback timeline, lalu React re-render SVG sesuai state itu.

```jsx
const [phaseIdx, setPhaseIdx] = useState(0)   // fase mana yang aktif
master.add(() => setPhaseIdx(0), 0)           // GSAP bilang "ganti ke fase 0"
{phaseIdx === 0 && <g>{/* render ACT 1 */}</g>}
```

## 3. SVG — Canvas Visual

Semua visual dirender sebagai elemen SVG (`<rect>`, `<text>`, `<circle>`, `<line>`), dengan properti dinamis dari state:

```jsx
<rect width={ramUsage * 2} fill={ramUsage > 90 ? '#F43F5E' : '#34D399'} />
```

## 4. requestAnimationFrame (RAF) — Sinkron Progress Bar

Dipakai TimelineProgressBar untuk baca `tl.time()`/`tl.progress()` tiap frame (~60fps) dan update UI player — independen dari timeline animasi itu sendiri.

## 5. React Hooks — Lifecycle

- `useState()` — simpan state animasi
- `useEffect()` — build timeline saat mount, **wajib** `return () => tl.kill()` saat unmount
- `useRef()` — simpan object persisten antar render (timelineRef, rafRef)

## 6. CSS — Styling

Warna, shadow, filter glow di SVG; untuk UI shell HTML (TimelineProgressBar dkk) pakai CSS biasa.
