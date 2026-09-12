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

## 7. State Continuity & Preview Gates (Ringkasan)

Alur data lengkap dari input sampai output:

```
UI source → GSAP timeline → React visual state → SVG render → Export frame
```

Timeline state (§2) HARUS melacak state NARATIF, bukan cuma properti
visual permukaan seperti opacity. Untuk topic dengan request/response
atau mutasi data, state seperti loading, lokasi request saat ini, hasil
mutasi resource, dan status response-diterima adalah bagian dari state
naratif ini — bukan detail implementasi yang boleh diabaikan.

Karena timeline ini `repeat: -1` (§1), SEMUA state naratif itu harus
di-reset bersih di awal tiap loop — bukan cuma `phaseIdx`. State yang
lupa di-reset akan "tersangkut" di kondisi akhir loop sebelumnya saat
animasi mengulang, dan bug ini sering baru kelihatan setelah loop ke-2/3,
bukan di preview pertama.

Detail kontrak & checklist lengkap untuk continuity ini ada di
`09-standar-pembuatan-konten.md` §1.O (Continuity and No-Teleport
Contract) dan §2 poin 7 (Continuity & Act Design Audit) — dokumen ini
cuma ringkasan kenapa itu penting di level arsitektur.

## 8. Scene UI V1 — Layer Chrome Opsional di Atas SVG (§3)

Untuk topic portrait standar (lihat kriteria wajib-pakai di
`09-standar-pembuatan-konten.md` §1.S), layer SVG (§3) tidak langsung
ditulis manual untuk bagian chrome (hero→header, badge Act, content
boundary) — bagian itu disediakan sebagai pure presentational component
di `src/shared/scene-ui/v1/`, disisipkan di antara React state (§2) dan
SVG akhir:

```text
data.js: PHASES, intro metadata, palette
                │
Animation.jsx: GSAP timeline (§1), morph progress, active Act (§2)
                │
                ▼
IntroHeaderMorphV1 + ActBadgeNavigatorV1 + ContentBodyV1
   (src/shared/scene-ui/v1/ — pure presentational, lihat README-nya)
                │
                ▼
SVG scene (§3)
```

Pesan utama: `scene-ui V1` menjaga **konsistensi presentation** (posisi
header, badge, boundary content) lintas topic; **storytelling dan
timeline tetap milik topic** — component V1 tidak pernah membuat
timeline/state/SFX sendiri (lihat `04-referensi-gsap.md` §
"Driving Pure Scene Components from Topic Timeline" untuk detail wiring).

Topic yang opt-out (landscape, simulator/dashboard, split-screen, dsb.)
tetap menulis layer SVG chrome-nya sendiri secara manual, mengikuti
diagram §1-§3 di atas tanpa lapisan scene-ui V1 ini — lihat
`09-standar-pembuatan-konten.md` §1.S untuk syarat opt-out yang sah.
