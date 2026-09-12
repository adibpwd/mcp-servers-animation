# 04 — Referensi GSAP Timeline

> Alur baca lengkap: `01-architecture` → `02-standar-konten` → `03-tutorial-buat-topic-baru` → **`04-referensi-gsap`** → `05-svg-text-guide` → `06-icon-generation` → `08-audio-sfx-generation`

Materi referensi (bukan urutan wajib dibaca) untuk pola GSAP di luar yang
sudah dibahas di `03-tutorial-buat-topic-baru.md`. Buka bagian yang
relevan saat butuh saja.

## Easing Functions

```js
tl.to(el, { x: 100, ease: 'power2.out' })     // fast start, slow end — paling natural
tl.to(el, { x: 100, ease: 'power2.in' })      // slow start, fast end
tl.to(el, { x: 100, ease: 'power2.inOut' })   // smooth kedua ujung
tl.to(el, { x: 100, ease: 'none' })           // linear, konstan
tl.to(el, { scale: 1, ease: 'elastic.out(1, 0.5)' }) // bouncy overshoot
tl.to(el, { x: 100, ease: 'back.out(1.4)' })  // sedikit overshoot
```

| Konteks | Easing |
|---|---|
| Elemen masuk layar | `power3.out` |
| Elemen keluar layar | `power2.in` |
| UI transition (button, modal) | `power2.inOut` |
| Progress bar / counter | `power2.out` |
| Objek fisik (bounce, spring) | `elastic.out(1, 0.5)` |
| Loop kontinu (rotasi) | `none` |

**Default rekomendasi:** `power2.out` untuk mayoritas animasi — versatile dan terasa natural.

## Tween Object untuk Animasi Halus (Counter, Progress)

GSAP tidak bisa tween React state secara langsung — tween object perantara,
lalu update state di `onUpdate`:

```jsx
// ❌ BAD — tidak akan jalan
const [progress, setProgress] = useState(0)
tl.to(progress, { v: 100 }, t)

// ✅ GOOD
const progressObj = { v: 0 }
tl.to(progressObj, {
  v: 100, duration: 2, ease: 'power2.out',
  onUpdate: () => setProgress(Math.round(progressObj.v))
}, t)
```

Dipakai untuk: counter angka, progress bar, opacity transition, interpolasi halus.
Untuk penambahan/penghapusan elemen atau conditional rendering, langsung
`setState` saja di `tl.add(() => setItems(...), t)`.

## Callback Patterns

```js
// Callback di waktu tertentu, boleh pakai label
tl.add(() => setPhaseIdx(1), 5)
tl.addLabel('act2Start', t)
tl.add(() => console.log('Act 2 mulai'), 'act2Start')

// Tween callbacks
tl.to(el, {
  x: 100, duration: 1,
  onStart:    () => sfx('whoosh'),
  onUpdate:   () => setProgress(el.x),
  onComplete: () => setCompleted(true),
  onRepeat:   () => console.log('looped'),
}, t)
```

### SFX Real-world Example

```js
const sfx = (name) => {
  if (!previewSfx) return
  const audio = new Audio(`/audio/sfx/${name}.wav`)
  audio.volume = volume / 100
  audio.playbackRate = speed
  audio.play().catch(() => {})
}

tl.add(() => {
  setDeskItems(prev => [...prev, newItem])
  sfx('click') // sinkron sama visual
}, t + 1)
```

## Audio Boost: Melebihi Native Volume Cap (GainNode)

`HTMLMediaElement.volume` di-hard-cap browser ke rentang `0.0–1.0` — ini
batas dari browser sendiri, bukan dari kode kita. Kalau butuh 1 SFX
tertentu kedengeran lebih menonjol dari SFX lain (misal SFX di intro yang
kalah keras), menaikkan multiplier di kode (`volume * 1.6`, `* 3.0`, dst)
**TIDAK ADA EFEKNYA** begitu hasil hitungnya sudah mentok `1.0` —
`Math.min(1, ...)` motong, dan browser juga tidak akan pernah render
lebih keras dari `volume = 1.0` walau angka input lebih besar lagi.

Untuk beneran lebih keras dari native cap (dengan risiko clipping/
distortion di angka tinggi, biasanya diterima untuk SFX yang memang perlu
"nonjol"), satu-satunya jalan adalah **gain amplification** lewat Web
Audio API (`GainNode`, boleh diisi >1.0 / unity gain) — bukan volume
scaling biasa. `shared/audio/sfxLoader.js` sudah punya `AudioContext` +
`MediaStreamDestination` aktif saat `exportMode` — titik ini yang perlu
disisipi `GainNode` **scoped per-sound**, supaya tidak mempengaruhi SFX
lain atau topic lain yang share asset audio yang sama:

```js
// data.js — field `boost` OPSIONAL per entry SFX_MAP.
// Sound lain tanpa `boost` → default 1.0, tidak ada efek/regresi.
TYPING: { category: 'sfx', name: 'typing', boost: 2.2 } // tuning by-ear

// sfxLoader.js — sisipkan GainNode di antara source & tujuan connect
const gainNode = this.audioContext.createGain()
gainNode.gain.value = boost
source.connect(gainNode)
gainNode.connect(this.mediaStreamDestination)
gainNode.connect(this.audioContext.destination)
```

**Penting:** kalau sound itu dipanggil berkali-kali cepat dan pakai
pooling (`entry.pool`, beberapa `<audio>` clone), `GainNode` harus
dipasang ke **SETIAP clone di pool**, bukan cuma elemen pertama — kalau
tidak, sebagian pemutaran tetap kedengeran pelan (clone tanpa gain).
Simpan `boost` di cache-entry supaya pool-growth (`cloneNode`) tahu harus
pasang gain berapa untuk clone baru.

Cek juga: kalau asset audio itu `shared` (dipakai lintas topic, bukan
per-topic-folder), `boost` yang di-scope lewat `SFX_MAP` per-topic (bukan
edit file asset langsung) memastikan topic lain tidak ikut lebih keras
tanpa diminta.

## Advanced Pattern: Moving Element (A ke B)

```jsx
const [movingItem, setMovingItem] = useState(null)
const moveObj = { x: 0 }
const lerp = (a, b, t) => a + (b - a) * t

tl.add(() => setMovingItem({ label: 'Item', color: '#38BDF8', x: 0 }), t)
tl.to(moveObj, {
  x: 1, duration: 1.2, ease: 'power2.inOut',
  onUpdate: () => setMovingItem(prev => prev ? { ...prev, x: moveObj.x } : null)
}, t + 0.1)
tl.add(() => setMovingItem(null), t + 1.3)

// Render
{movingItem && (
  <g transform={`translate(${lerp(startX, endX, movingItem.x)}, ${y})`}>
    <rect fill={movingItem.color} />
    <text>{movingItem.label}</text>
  </g>
)}
```
Dipakai untuk: simulasi drag & drop, transisi item antar container,
visualisasi data flow. Contoh nyata: animasi page dari RAM ke Swap di
`virtual-memory/Animation.jsx`.

## Advanced Pattern: Persistent Anchor Object Lintas-Act

Pola render standar (`{phaseIdx === N && <g>...</g>}`, lihat
`03-tutorial-buat-topic-baru.md` § 3.1) unmount-total subtree tiap ganti
Act. Ini benar untuk konten yang memang spesifik per-Act, tapi SALAH
untuk objek yang representasi hal SAMA di sepanjang cerita (misal:
laptop/karakter yang sama tampil dari Act 1 sampai Act akhir) — objek
itu akan keanggap "baru" tiap transisi dan pop-in ulang (fade + scale +
SFX), bikin penonton bingung ("ini icon baru atau yang tadi?").

**Resep:**

1. **Satu `id` permanen per objek**, bukan `id` beda tiap Act
   (`houseBox`/`houseBox2`/`houseBox3` → jadi 1 `id` tetap: `houseAnchor`).
2. **Render objek itu SEKALI, di LUAR semua blok `{phaseIdx === N && ...}`**
   — sebagai elemen persistent yang tetap ada di DOM sepanjang Act-Act
   yang relevan.
3. **`popIn()` cuma sekali** (entrance pertama, Act awal objek itu muncul).
   Transisi Act berikutnya pakai `gsap.to()` untuk animasikan posisi/warna
   — BUKAN `popIn()` ulang yang mulai dari `scale: 0, opacity: 0`.
4. **Transisi ke layout yang beda jauh** (misal Act payoff pindah ke
   posisi diagram baru) tetap dapat animasi — tapi berupa tween posisi
   (`x`/`y`) dari titik lama ke titik baru, bukan fade-out lalu fade-in.

```jsx
// State posisi/warna terpisah dari sistem pop-in (scale/opacity)
const [anchorY, setAnchorY] = useState({ home: 170 })
const [anchorColor, setAnchorColor] = useState({ home: COLORS.DANGER })

// Act 1 — entrance SEKALI, dengan popIn + SFX seperti biasa
master.add(() => popIn(tl, t, 'houseAnchor'), t1)

// Act 2/3/4 — BUKAN popIn ulang, cuma tween posisi/warna
master.add(() => setAnchorColor({ home: COLORS.CRYPTO }), t2)          // ganti warna, tanpa tween posisi
master.to(anchorYObj, { home: 190, onUpdate: () => setAnchorY({ ...anchorYObj }) }, t3) // geser posisi

// Render — di LUAR blok {phaseIdx === N && ...}, persistent selama !showIntro
<g id="houseAnchor" transform={`translate(0, ${anchorY.home})`}>
  <Laptop color={anchorColor.home} />
</g>
```

Dipakai untuk: karakter/device yang muncul berulang di banyak Act. Contoh
nyata: rumah & kantor di `11-tailscale/Animation.jsx` (lihat
`src/content/11-tailscale/revision/PLAN-CONTINUOUS-ANCHOR-ICONS.md` untuk
detail before/after lengkap).

## Advanced Pattern: Request Lifecycle Helper

Untuk topic dengan alur request/response (REST API, HTTP, dsb.), jangan
tulis timing tiap fase perjalanan request secara terpisah-pisah di
timeline utama — bungkus jadi satu helper dengan 8 tahap tetap, supaya
continuity terjamin (lihat `09-standar-pembuatan-konten.md` §1.O
Continuity and No-Teleport Contract) dan hold antar-tahap konsisten
dengan hold budget default.

8 tahap wajib:

1. spawn dari UI source
2. depart
3. travel ke gate
4. ingress ke processor
5. process/mutate
6. build response
7. return ke UI
8. resolve UI state

```js
const runRequestLifecycle = (tl, startTime, { id, gate, processor, origin, mutate, onResolve }) => {
  let t = startTime

  // 1. spawn dari UI source
  tl.add(() => popIn(tl, t, id), t)
  t += 0.25 // click → request berangkat (hold budget default)

  // 2-3. depart + travel ke gate
  tl.to(refs[id], { x: gate.x, y: gate.y, duration: 0.6, ease: 'power2.inOut' }, t)
  t += 0.6

  // 4. ingress ke processor
  tl.to(refs[id], { x: processor.x, y: processor.y, duration: 0.35, ease: 'power2.in' }, t)
  t += 0.35 // gate → processor (hold budget default)

  // 5. process/mutate — akibat fisik yang bisa dilihat, bukan cuma badge (lihat 09 §1.N)
  tl.add(() => mutate(), t)
  t += 0.5

  // 6. build response
  tl.add(() => setResponseVisible(id, true), t)
  t += 0.2

  // 7. return ke UI
  tl.to(refs[id], { x: origin.x, y: origin.y, duration: 0.6, ease: 'power2.out' }, t)
  t += 0.6

  // 8. resolve UI state
  tl.add(() => onResolve(), t)
  t += 0.4 // response tiba → request berikutnya (hold budget default)

  return t // WAJIB dipakai sebagai startTime request berikutnya
}
```

**Kenapa harus return waktu selesai:** kalau request berikutnya dimulai
dari angka `PHASE duration` yang sudah ditentukan lebih dulu (bukan dari
`t` hasil helper ini), ada risiko sisa hold dari request sebelumnya belum
selesai tapi request baru sudah dipaksa mulai — menyebabkan dua request
numpuk di layar atau gap kosong yang tidak perlu. Selalu chain:

```js
let t = actStartTime
t = runRequestLifecycle(tl, t, { id: 'req1', gate, processor, origin, mutate: mutatePostUser, onResolve: showConfirm1 })
t = runRequestLifecycle(tl, t, { id: 'req2', gate, processor, origin, mutate: mutatePatchUser, onResolve: showConfirm2 })
```

## Advanced Pattern: Handoff Transform

Saat ticket/request berubah bentuk jadi resource atau response (misal:
amplop yang sampai di processor "menjadi" data card, atau response yang
kembali "menjadi" update di UI), transisi ini WAJIB pakai handoff, bukan
unmount-lalu-mount di posisi jauh — lihat `09-standar-pembuatan-konten.md`
§1.O.

Syarat handoff yang valid:

- kedua visual (bentuk lama & bentuk baru) overlap minimal satu frame;
- state target sudah aktif SAAT source mulai keluar, bukan sesudahnya;
- tidak boleh ada gap `opacity: 0` di antara source hilang dan target
  muncul — walau cuma satu frame;
- gunakan `scale`/`glow`/`position` short tween untuk transisi, bukan
  `setState(null)` diikuti `setState(newObject)` di waktu berbeda.

```js
// ❌ BAD — source di-unmount, target muncul 0.3s kemudian di posisi lain
tl.add(() => setTicket(null), t)
tl.add(() => setResourceCard({ visible: true }), t + 0.3)

// ✅ GOOD — overlap eksplisit, target aktif SEBELUM source selesai keluar
tl.add(() => setResourceCard({ visible: true, scale: 0, x: ticketX, y: ticketY }), t)
tl.to(resourceCardObj, { scale: 1, x: cardX, y: cardY, duration: 0.4 }, t)
tl.to(ticketObj, { scale: 0, opacity: 0, duration: 0.25 }, t) // source keluar BERSAMAAN, bukan sebelum
tl.add(() => setTicket(null), t + 0.25) // baru dibersihkan setelah overlap selesai
```

Dipakai untuk: momen ticket → resource, resource → response, atau card
lama → card baru (PUT full replacement). Lihat juga Method Visualization
Contract di `09-standar-pembuatan-konten.md` §1.N untuk menentukan bentuk
target yang benar per method.

## Timeline Audit Sebelum Preview (Topic Request/Response)

Sebelum preview manual atau export test (lihat `09-standar-pembuatan-konten.md`
§2 poin 7 "Continuity & Act Design Audit"), jalankan audit berikut di
timeline:

- [ ] Cari SETIAP `popOut`/`setState(null)` dan pastikan ada destination
      object atau transisi handoff yang menyertainya — tidak ada elemen
      yang hilang tanpa penerus visual
- [ ] Cari SETIAP `PHASE duration` yang di-hardcode dan bandingkan dengan
      waktu event terakhir yang benar-benar terjadi di fase itu — kalau
      durasi PHASE lebih panjang dari event terakhir + hold budget,
      berarti ada waktu nganggur yang tidak disengaja
- [ ] Tandai gap mana pun yang lebih besar dari hold budget default
      (lihat `09-standar-pembuatan-konten.md` §1.O) — kalau memang
      disengaja untuk keterbacaan, tulis alasannya di plan topic
- [ ] Cek `repeat: -1` mengembalikan SEMUA state data ke kondisi awal
      (posisi objek, isi card, status request) — bukan cuma `phaseIdx`
      yang di-reset, karena state request/response biasanya lebih banyak
      daripada state fase biasa

## Advanced Pattern: Multi-step Sequence dengan State

```jsx
const [step, setStep] = useState(0)

tl.add(() => setStep(1), t); tl.to(el, { opacity: 1, duration: 0.5 }, t); t += 1
tl.add(() => setStep(2), t); tl.to(bar, { width: 100, duration: 2 }, t); t += 2.5
tl.add(() => setStep(3), t); tl.to(check, { scale: 1, ease: 'back.out(1.7)', duration: 0.6 }, t); t += 1

{step === 1 && <LoadingSpinner />}
{step === 2 && <ProgressBar />}
{step === 3 && <Checkmark />}
```

## Advanced Pattern: Typing Effect Sebelum Morph (Opsional)

Variasi intro morph (lihat `03-tutorial-buat-topic-baru.md` Langkah 2) —
title/subtitle diketik karakter-per-karakter (efek "hacker typing")
sebelum morph ke header kecil, dengan suara ketik per-karakter. **Wajib**
pakai seeded random untuk delay antar-karakter (lihat § "Determinism" di
atas) — efek ini justru contoh kasus nyata kenapa `Math.random()`
berbahaya untuk timing.

```js
const typeLine = (tl, startTime, lineKey, fullText, opts = {}) => {
  const { minDelay = 40, maxDelay = 100, avgDelay = 60 } = opts
  const lineSeed = lineKey === 'title' ? 1.7 : 9.3
  let acc = ''
  let time = startTime
  for (let i = 0; i < fullText.length; i++) {
    const char = fullText[i]
    const rand = seededRandom01(i * 12.9898 + lineSeed)
    const variance = (rand - 0.5) * (maxDelay - minDelay)
    const delay = Math.max(minDelay, Math.min(maxDelay, avgDelay + variance))

    tl.add(() => {
      acc += char
      setTyped(prev => ({ ...prev, [lineKey]: acc }))
      sfxLoader.sfx(SFX_MAP.TYPING.name, { volume: volumeRef.current * 1.6 })
    }, time)
    time += delay / 1000
  }
  return time - startTime // total durasi, dipakai buat increment time cursor
}
```

Dipakai untuk: intro yang ingin kesan "hacker typing" sebelum morph ke
header. Contoh nyata: `linux-vs-unix/Animation.jsx` (asal pola) & port-nya
ke `tailscale/Animation.jsx`.

## Driving Pure Scene Components from Topic Timeline (scene-ui V1)

Kalau topic memakai scene-ui V1 (`IntroHeaderMorphV1`, `ActBadgeNavigatorV1`,
`ContentBodyV1`, atau composer `SceneChromeV1` — lihat
`09-standar-pembuatan-konten.md` §1.S), aturan pemisahan tanggung jawab
berikut WAJIB dipegang, karena component V1 sengaja ditulis **pure
presentational** (tidak ada GSAP/state/SFX di dalamnya, lihat
`src/shared/scene-ui/README.md` § "Prinsip inti"):

**Aturan:**

- `progress` morph (0..1) dan `activeIndex` Act **dimiliki topic**, bukan
  component V1 — sama seperti pola `morphP`/`phaseIdx` yang sudah dipakai
  di Langkah 1-3 `03-tutorial-buat-topic-baru.md`.
- GSAP tween object mengubah state itu secara deterministik lewat
  `onUpdate`/`tl.add()` — pola yang PERSIS sama dengan tween object biasa
  (lihat § "Tween Object untuk Animasi Halus" di atas), component V1 cuma
  menerima angka hasil akhir tiap frame.
- Component V1 TIDAK pernah membuat timeline sendiri
  (`gsap.timeline()`/`tl.add()`), tidak punya `repeat`/cleanup sendiri, dan
  tidak memanggil `sfxLoader`/`playSfx` — semua itu tetap tanggung jawab
  `Animation.jsx` topic.
- Gating render (`showNavigator`/`showContent` di `SceneChromeV1`, atau
  prop `visible` di tiap primitive) tetap DIPUTUSKAN oleh topic (state
  `showIntro`/`contentStarted` dsb, pola yang sama dengan §3.1
  `03-tutorial-buat-topic-baru.md`), bukan oleh component V1 sendiri.
- `window.__animationTimeline`/`window.__flushSync` (lihat § "Export
  Safety" di atas) tetap dipasang topic — component V1 tidak tahu-menahu
  soal export hooks.

**Wiring `progress` (contoh nyata, pola dari migrasi PLAN-14):**

```jsx
const [morphP, setMorphP] = useState(0)
const mo = { p: 0 }

master.to(mo, {
  p: 1, duration: 0.8, ease: 'power3.inOut',
  onUpdate: () => setMorphP(mo.p),
}, time)
time += 0.8

// Render — progress diteruskan apa adanya, IntroHeaderMorphV1 yang
// menghitung interpolasi posisi/ukuran hero→compact secara internal
<g opacity={headerOpacity}>
  <IntroHeaderMorphV1
    progress={morphP}
    categorySegments={[{ label: 'NETWORKING · ', color: COLORS.MUTED },
                        { label: 'ADIB-DEV.COM', color: COLORS.NETWORKING_SKY }]}
    titleSegments={[{ label: 'REST ', color: COLORS.MINT },
                     { label: 'API', color: COLORS.SKY }]}
    subtitle={INTRO_SUBTITLE}
  />
</g>
```

**Wiring `activeIndex`:**

```jsx
const [phaseIdx, setPhaseIdx] = useState(0)

master.add(() => setPhaseIdx(1), t) // GSAP naikkan activeIndex seperti biasa
t += PHASES[1].duration

{contentStarted && (
  <ActBadgeNavigatorV1 phases={PHASES} activeIndex={phaseIdx} />
)}
```

**Do:**
- Test render component V1 di `progress = 0`, `0.5`, dan `1` secara manual
  (preview atau screenshot) — sama seperti checklist screenshot intro di
  `09-standar-pembuatan-konten.md` §2 poin 9.
- Test perubahan `activeIndex` di setiap Act, bukan cuma Act pertama.

**Don't:**
- Jangan pass timeline GSAP (`tl`/`master`) sebagai prop ke component V1
  — component V1 tidak menerima maupun mengharapkan prop semacam itu.
- Jangan buat component V1 memanggil `gsap.timeline()` sendiri saat
  mount — kalau ada kebutuhan animasi internal yang benar-benar generic
  lintas topic, itu perubahan breaking yang wajib masuk `v2/` baru
  (lihat README scene-ui § aturan versioning), bukan ditambahkan diam-diam
  ke `v1/`.

## Performance

```jsx
// ❌ BAD — kalkulasi berat tiap frame (60fps = 60x/detik)
onUpdate: () => {
  const heavy = items.map(i => heavyFunction(i))
  setData(heavy)
}

// ✅ GOOD — hanya assignment sederhana di onUpdate
onUpdate: () => setProgress(obj.x)
```

- **Animate DOM langsung via ref** untuk animasi halus tanpa re-render React:
  `gsap.to(svgRef.current, { rotation: 360, duration: 2 })`. Pakai state
  hanya untuk update diskrit (nambah/hapus elemen).
- **Throttle state update** kalau perlu: batasi max ~10x/detik pakai
  `Date.now()` check di `onUpdate`, bukan tiap frame (60x/detik).

## Export Safety: Wajib Expose `window.__flushSync`

Script export (`scripts/export-lib.js` & `scripts/export-parallel.mjs`)
mem-capture tiap frame dengan cara **seek paksa** (`tl.totalTime(t, false)`)
dari `page.evaluate()` Puppeteer — bukan playback natural via
`requestAnimationFrame` seperti di preview browser. Karena seek ini terjadi
di luar siklus event React yang normal, React 18 bisa saja BELUM commit
`setState` hasil seek ke DOM sebelum screenshot frame diambil, terutama
kalau ada beberapa `popIn()`/`tl.add()` yang timing-nya berdekatan (<0.2s
antar elemen). Efeknya: elemen tampil normal di preview, tapi **hilang atau
telat muncul di video hasil export** (pernah terjadi di `virtual-memory`
dan `tailscale`, lihat
`src/content/11-tailscale/revision/PLAN-FIX-EXPORT-MESHLINE-MISSING.md`).

Kedua script export sudah dirancang memakai `window.__flushSync` untuk
memaksa commit sinkron **kalau tersedia** — tapi diam-diam fallback ke seek
biasa kalau topic tidak menyediakannya. Jadi **setiap topic WAJIB**
expose ini di awal `useEffect` master timeline:

```jsx
import { flushSync } from 'react-dom'
// ...
useEffect(() => {
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 })
  tlRef.current = tl
  window.__animationTimeline = tl
  window.__flushSync = flushSync   // ← WAJIB, biar export bisa flush sinkron
  // ...
}, [])
```

Ini murah untuk ditambahkan dan tidak ada downside — `flushSync` hanya
memaksa commit yang SUDAH dijadwalkan jadi sinkron, tidak mengubah logic
atau value animasi apa pun. Cukup 2 baris (import + assign), copy-paste
persis dari contoh di atas untuk setiap topic baru.

## Determinism: Hindari `Math.random()` di Timeline

Timeline animasi di-mount ulang di beberapa proses Chrome terpisah saat
export (`detectDuration`, `captureAudio`, tiap `captureSegment` worker).
Kalau ada bagian timeline yang pakai `Math.random()` DAN hasilnya
mempengaruhi durasi/waktu (`t`) — misal delay antar-karakter di efek
"typing", jeda acak antar elemen, dst — tiap proses akan dapat urutan
acak yang BEDA. Akibatnya total durasi & semua timestamp Act setelahnya
ikut geser beda antara audio-pass dan video-pass, dan hasil export jadi
**desync** (audio & video tidak lagi sinkron).

**Aturan:** kalau randomness itu MEMPENGARUHI TIMING (bukan cuma variasi
visual kosmetik yang tidak mengubah `t` sesudahnya), wajib pakai fungsi
seeded pseudo-random — bukan `Math.random()`:

```js
// seeded pseudo-random — hasilnya tetap "kelihatan acak" tapi
// IDENTIK setiap kali di-mount ulang (aman untuk multi-proses export)
const seededRandom01 = (seed) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

// pakai index/posisi elemen sebagai bagian dari seed, bukan Date.now()
const rand = seededRandom01(i * 12.9898 + lineSeed)
```

Randomness yang TIDAK mempengaruhi timing (misal variasi warna kosmetik
yang tidak mengubah `t`) aman pakai `Math.random()` seperti biasa — aturan
ini spesifik untuk yang mempengaruhi durasi/waktu timeline.

## Referensi: `popIn()` dengan `sfxCategory` Eksplisit

Helper `popIn(tl, time, id, opts)` yang dipakai untuk entrance elemen
(fade + scale + SFX opsional) sering ditulis generik supaya dipakai
lintas Act. Kalau helper ini memutar SFX lewat `sfxLoader`, **jangan
hardcode 1 kategori folder audio** — asset di `public/audio/` terbagi
per kategori (`ui/`, `impacts/`, `transitions/`, `warnings/`, `success/`,
`sfx/`, dst), dan tiap `sfxName` di `SFX_MAP` bisa datang dari kategori
manapun. `popIn()` wajib terima parameter kategori eksplisit, bukan
selalu memanggil kategori yang sama:

```js
// ❌ BAD — hardcode 1 kategori, gagal silent untuk SFX kategori lain
const popIn = (tl, time, id, { sfx = true, sfxName = 'pop' } = {}) => {
  tl.add(() => setVisible(id, true), time)
  tl.fromTo(refs[id], { scale: 0, opacity: 0 }, { scale: 1, opacity: 1 }, time)
  if (sfx) sfxLoader.ui(sfxName, { volume: volumeRef.current }) // selalu 'ui' — SALAH
}

// ✅ GOOD — kategori eksplisit, default 'ui' tapi bisa di-override
const popIn = (tl, time, id, { sfx = true, sfxName = 'pop', sfxCategory = 'ui' } = {}) => {
  tl.add(() => setVisible(id, true), time)
  tl.fromTo(refs[id], { scale: 0, opacity: 0 }, { scale: 1, opacity: 1 }, time)
  if (sfx) sfxLoader.play(sfxCategory, sfxName, { volume: volumeRef.current })
}

// Pemanggilan — default kategori 'ui' tetap jalan tanpa perubahan
popIn(tl, t, 'insightBadge')

// Pemanggilan dengan SFX dari kategori lain — WAJIB declare sfxCategory
popIn(tl, t, 'kernelArrow', { sfxName: SFX_MAP.CONNECTOR_SNAP.name, sfxCategory: 'impacts' })
```

`sfxLoader.play(category, name, opts)` generik (menerima kategori sebagai
parameter) aman dipakai untuk kategori manapun — beda dengan method
spesifik seperti `sfxLoader.ui(...)` yang cuma benar untuk 1 kategori.
Kalau `SFX_MAP` sebuah topic sudah punya banyak kategori berbeda, cek
ulang bahwa tiap pemanggilan `popIn()`/sejenisnya sudah declare
`sfxCategory` yang cocok dengan `category` di entry `SFX_MAP`-nya —
mismatch ini **tidak melempar error** (biasanya di-catch diam-diam),
jadi harus dicek manual, bukan menunggu error muncul di console.

## Policy: `sfx: false` Wajib Ada Alasan

`popIn()` yang secara default memutar SFX (`sfx: true`) kadang sengaja
di-set `sfx: false` untuk elemen yang tidak butuh suara sendiri (mis.
elemen kecil yang muncul bersamaan dengan elemen lain yang sudah punya
SFX). Supaya keputusan ini tidak berubah jadi "kelupaan pasang suara"
yang baru ketahuan pas audit, ikuti aturan berikut:

- Kalau sebuah `popIn()` di-set `sfx: false`, HARUS ada salah satu dari
  dua hal ini:
  1. Ada `sfxOn()`/pemutaran SFX lain yang jalan di elemen **related**
     pada waktu yang berdekatan (radius ~0.3 detik) — sehingga momen itu
     tetap "terwakili" suara, meski tidak dari elemen ini sendiri, ATAU
  2. Elemen itu memang dekoratif/kecil dan sengaja dibiarkan silent
     (komentar singkat di kode boleh ditambahkan kalau perlu penjelasan
     kenapa).
- **Motion yang signifikan secara visual/durasi** (tween nilai yang
  berlangsung lama, elemen besar yang jadi fokus utama Act) TIDAK BOLEH
  `sfx: false` tanpa pengganti — motion seperti ini paling gampang
  kelewat kalau tidak di-audit khusus (lihat checklist di
  `03-tutorial-buat-topic-baru.md`).
- Sebelum menganggap sebuah topic selesai, audit ulang SEMUA `sfx: false`
  yang ada di `Animation.jsx` — pastikan tiap satu punya alasan yang
  jelas (poin 1 atau 2 di atas), bukan keputusan ad-hoc yang lupa
  ditinjau ulang.

Sebagai tambahan, cross-check juga `SFX_MAP` di `data.js` terhadap
pemanggilan aktual di `Animation.jsx` — entry yang didefinisikan tapi
tidak pernah dipanggil manapun adalah sinyal config sudah basi (SFX yang
direncanakan tapi lupa di-wire, atau sisa dari eksperimen yang sudah
tidak dipakai).

## Common Pitfalls

| Pitfall | Fix |
|---|---|
| Lupa `window.__animationTimeline = tl` | PREV/NEXT button tidak akan skip timeline — selalu assign setelah `gsap.timeline()` |
| Lupa `window.__flushSync = flushSync` | Elemen dengan popIn berdekatan (<0.2s) bisa hilang/telat di video export walau normal di preview — lihat § "Export Safety" di atas |
| Lupa cleanup timeline | Memory leak — selalu `return () => tl.kill()` |
| `useEffect` timeline punya dependency `[speed]` | Timeline di-rebuild tiap speed berubah — pisahkan: buat timeline sekali di `[]`, kontrol speed di effect terpisah pakai `tl.timeScale(speed)` |
| Salah increment time cursor (increment beda dari `duration` tween) | Animasi overlap tidak sengaja — selalu `t += duration_yang_sama_dengan_tween` |
| `Math.random()` untuk timing (delay antar-karakter, jeda acak, dst) | Desync audio/video saat export multi-proses — pakai seeded random, lihat § "Determinism" di atas |
| Objek "anchor" (representasi hal sama) ditaruh di dalam `{phaseIdx === N && ...}` | Pop-in ulang tiap ganti Act padahal bukan objek baru — lihat § "Persistent Anchor Object Lintas-Act" |
| Helper `popIn()`/pemutar SFX generik hardcode 1 kategori folder audio (mis. selalu manggil `sfxLoader.ui(...)`) | SFX dari kategori lain (`impacts/`, `transitions/`, dll) gagal main **secara silent, tanpa error** — lihat § "Referensi: `popIn()` dengan `sfxCategory` Eksplisit" |
| Elemen fixed-width (Badge/Box) disusun sejajar tanpa hitung setengah-lebar | Overlap visual yang lolos build-check syntax tapi rusak secara behavior — lihat `05-svg-text-guide.md` § "Formula Cek Overlap Antar-Elemen Horizontal" |

## Debugging Timeline

```jsx
console.log('duration:', tl.duration())
console.log('progress:', tl.progress())
console.log('children:', tl.getChildren())

// Pause di waktu tertentu untuk inspect state
tl.pause(5)
// atau pakai label
tl.addLabel('debugPoint', 8.5)
tl.pause('debugPoint')
```

Debug overlay waktu real-time (dev only):
```jsx
tl.eventCallback('onUpdate', () => setDebugTime(tl.time()))
// render: <text>{debugTime.toFixed(2)}s / {tl.duration().toFixed(2)}s</text>
```

## Quick Reference

```js
// Timeline setup
const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 })
window.__animationTimeline = tl
window.__flushSync = flushSync   // WAJIB — lihat § "Export Safety" di atas

// Time cursor
let t = 0
tl.to(el, { x: 100, duration: 1 }, t)
t += 1

// State update
tl.add(() => setState(newValue), t)

// Smooth tween
const obj = { v: 0 }
tl.to(obj, { v: 100, onUpdate: () => setState(obj.v) }, t)

// Cleanup
return () => tl.kill()
```

## Further Reading

- GSAP Timeline Docs: https://greensock.com/docs/v3/GSAP/Timeline
- Easing Visualizer: https://greensock.com/ease-visualizer/
- GSAP Cheat Sheet: https://ihatetomatoes.net/greensock-cheat-sheet/
