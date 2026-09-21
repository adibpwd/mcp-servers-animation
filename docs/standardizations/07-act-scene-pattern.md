# 07 — Act Scene Pattern: "1 Act = 1 File" + Intro Background

> Status: **Standar aktif** — konsolidasi 2026-09-21, dari migrasi 44-ssh
> (revisi case-based payload flow) + UPDATE 6 IntroHeaderMorphV1.
>
> Pola organisasi scene per-Act menjadi file terpisah (pure presentational),
> kontrak koordinat scene (body-local + `origin`), dan pemakaian scene act
> sebagai background intro/thumbnail via `bg`/`bgScenes`.

## 1. Masalah yang Diselesaikan

Setelah Act 1, sebagian besar topic punya 5+ Act dengan SVG scene yang
panjang (ratusan baris). Dulu semua scene ditaruh inline di dalam blok
render `Animation.jsx`, sehingga:

- `Animation.jsx` jadi sangat panjang dan mencampur 3 tanggung jawab:
  timeline/GSAP, state machine, dan seluruh kode presentational SVG.
- Riview Act di satu file susah (scroll berkilometer, potongan XML di antara
  JS state).
- Intro header Cuma menampilkan teks + (opsional) `heroBackground` —
  thumbnail tidak memperlihatkan isi konten.

Pola ini memindahkan layer presentational tiap Act ke file tersendiri dan
membiarkan `Animation.jsx` menjadi **murni komposisi**: timeline GSAP +
state + `<Act state={...} />` per phase, serta intro memakai scene act
sebagai background (proses yang sama juga dipakai untuk thumbnail).

## 2. Kontrak Folder & Konten

```
src/content/<topic>/
├── Animation.jsx        (entry — WAJIB tetap di sini, resolveTopic hanya
│                          resolve dari ./<topic>/Animation.jsx default export)
├── data.js              (phases, stage enums, anchor points, SFX_MAP, teks)
├── acts/
│   ├── index.js         (ekspor ACT_SCENES — array komponen Act berurutan)
│   ├── common.js        (helper SVG presentational + ActChrome, dipakai
│   │                      lintas Act dalam topic yang sama)
│   ├── Act1Foo.jsx
│   ├── Act2Bar.jsx
│   └── ...
```

### 2.1 Setiap File Act = PURE Presentational

File Act **tidak boleh** berisi GSAP, `useState`, `useEffect`, SFX, atau
logika timeline. Itu semua tetap milik `Animation.jsx`. File Act hanya:

- membaca `state` dari props (object; default-nya untuk mode summary, §3.1);
- me-render SVG hasil posisi/opacity yang sudah dihitung;

Kalau sebuah file Act butuh GSAP untuk koleksi dinamis, koordinasikan
dengan pola state-handoff dinamis yang sudah ada (lihat 04-motion ==>
lifecycle action/reflow) — timeline tetap di `Animation.jsx`.

### 2.2 Kontrak Props

```js
export default function ActN({ state = {} }) {
  // state: { pop, stage, trustBadgeOn, tunnelActive, channelDim, verifiedOn,
  //          keyStatus, allowShown, denyShown, alertOn, ... }
  //          — semua field OPSIONAL, null-safe (default-nya aman).
}
```

Setiap field dibaca dengan fallback yang membuat render aman:

```js
const trustBadgeOn = state.trustBadgeOn ?? false
```

Live mode: `Animation.jsx` mengirim field yang relevan untuk Act tersebut
sebagai `state` ke `ACT_SCENES[phaseIdx]`. Field yang tidak dikirim
fallback ke default.

### 2.3 Kontrak Koordinat: Body-Local + `origin`

Semua koordinat dalam file Act ditulis **relatif terhadap origin body**
(0,0 = pojok kiri-atas area `ContentBodyV1`), BUKAN absolut canvas. Ini
yang membuat nomor-nomor lama (mis. `x={366}`, `y={940}`) tidak berubah
saat dipindah dari blok inline lama ke file Act.

Saat dirender live di `Animation.jsx` (di dalam `ContentBodyV1`), origin
sudah otomatis diterapkan oleh `ContentBodyV1` (`translate(44,235)`) —
file Act tidak perlu mengubah koordinatnya.

Untuk kebutuhan yang memakai scene di luar `ContentBodyV1` — intro
background (`bgScenes`) atau render custom lain — komponen Act harus
dibungkus dengan `withOrigin(origin)`:

```js
// acts/common.js
export const withOrigin = (origin) => (Comp) => (props) => (
  <g transform={`translate(${origin.x}, ${origin.y})`}>
    <Comp {...props} />
  </g>
)
```

`origin` berbasis `layout.body` (lihat 02-topic-contract-scene-shell §
layout contract): untuk 44-ssh itu `{ x: 44, y: 235 }`, canvas 820×1340.

## 3. Mode "Summary" untuk Thumbnail / Intro Background

Scene act juga dipakai sebagai **background full-canvas** di belakang
tagline+title+subtitle intro (UPDATE 6 IntroHeaderMorphV1). Untuk itu Act
dirender **tanpa props** — mode **summary**: menampilkan "momen akhir"
act dengan semua elemen pada posisi akhirnya.

### 3.1 Mekanisme

Setiap file Act wajib mendefinisikan:

```js
const SUMMARY_STAGE = 'ch-file'               // stage yang = momen akhir
const SUMMARY_POSITIONS = {                   // bebas, isi apa pun yang
  caseTitle: { y: 190, opacity: 1 },          //   dibutuhkan act tsb
  card: { y: 340, opacity: 1 },               //   (masing-masing act beda)
}
```

Lalu di ujung file, sebelum export, komponen memenuhi kontrak dengan
fallback summary:

```js
const SUMMARY_STATE = {
  pop: {}, stage: SUMMARY_STAGE,
  trustBadgeOn: true, tunnelActive: true, channelDim: false,
  verifiedOn: 'server', keyStatus: 'active',
  allowShown: true, denyShown: true, alertOn: true,
}

export default function ActN({ state = {} }) {
  const fullState = { ...SUMMARY_STATE, ...state } // live override summary
  // render pakai fullState.*
}
```

Aturan summary:

1. **Semua elemen act terlihat** pada posisi momen akhir (tidak ada yang
   opacity 0 / tersembunyi).
2. Stand-in statis boleh dipakai untuk posisi yang bergantung pada hasil
   animasi (mis. label panjang) — aktifkan posisi tersebut lewat
   `SUMMARY_POSITIONS`.
3. Tidak boleh ada pengencer visual: kolom/warna harus dibaca dari
   `data.js` topic (pastikan tema summary terlihat sama dengan live).

### 3.2 Hasil 44-ssh

| Act | File | SUMMARY_STAGE | Momen akhir summary |
|---|---|---|---|
| 1 — Verify | `Act1Verify.jsx` | `fingerprint` | fingerprint + trust badge + tunnel emerald |
| 2 — Identity | `Act2Identity.jsx` | `id-after` | deploy-bot auth → restricted task active |
| 3 — Remote | `Act3Remote.jsx` | `ch-file` | file transfer selesai di channel |
| 4 — Forward | `Act4Forward.jsx` | `fw-apply` | packet sampai private DB (result) |
| 5 — Operations | `Act5Operations.jsx` | `ops-closing` | key revoked, policy deny, audit entry + alert |

## 4. Intro Background via `bg`/`bgScenes` (UPDATE 6)

`IntroHeaderMorphV1` mendapat 4 prop opsional baru (gaya PLAN-12 §11 —
non-breaking; tanpa prop ini output lama tidak berubah):

| Prop | Tipe | Default | Peran |
|---|---|---|---|
| `bg` | `number` int 1-based | `undefined` | Act mana yang jadi background (index di `bgScenes`) |
| `bgScenes` | `Array<Component>` | `undefined` | Array komponen Act (ekspor `ACT_SCENES` topic) |
| `bgDim` | `number` 0..1 | `0.3` | Opacity maksimum layer bg (sebelum fade) |
| `bgOrigin` | `{x,y}` | `layout.body` | Titik origin tempat scene digambar |

Behavior:

- Scene dirender **tanpa props** → Act masuk mode summary (§3).
- Layer = `<g transform={translate(bgOrigin)} opacity={bgOpacity}>` +
  vignette radial full-canvas (id unik per-instance via `useId`, edgy
  gelap untuk menjaga keterbacaan teks di atasnya; sama teknik defs/useId
  dengan glow UPDATE 5).
- `bgOpacity = clamp01(bgDim) * (1 - smoothstep01(0, titleMorphSplit, mp))`
  — identik pola fade-out `heroBackground`: menghilang di titik
  `titleMorphSplit`, tidak pernah muncul di header compact.
- Kalau `bg` di luar rentang / `bgScenes` tidak diberikan → tidak render
  apa pun (non-breaking) + `console.warn` di DEV kalau `bg` dikirim tapi
  `bgScenes` kosong.

### 4.1 Penggunaan di `Animation.jsx`

```jsx
import { ACT_SCENES } from './acts'          // array [Act1..Act5]
import { ACT_SCENES as ACT_SCENES_44 } from './acts' // (contoh 44)

<IntroHeaderMorphV1
  ...
  bg={2}
  bgScenes={ACT_SCENES}
/>
```

`bg={2}` dipilih untuk 44-ssh karena thumbnail diperlihatkan Act 2
(deploy-bot identity ↔ restricted task) — paling jelas mewakili isi
konten. Topic lain bebas pilih act manapun.

### 4.2 Live Render Tetap via `ContentBodyV1`

Bagian dalam body tetap seperti sebelumnya:

```jsx
<ContentBodyV1 debugName="ssh-body">
  {(() => {
    const Act = ACT_SCENES[phaseIdx]           // gantikan blok inline raksasa
    return <Act state={{ pop, stage, trustBadgeOn /* dst */ }} />
  })()}
</ContentBodyV1>
```

## 5. Migrasi Topic Lama ke Pola Ini

Ruang lingkup (keputusan 2026-09-21): pola ini **wajib** untuk topic
baru dan topic yang sedang dikerjakan; topic lama yang sudah posted
**tidak** di-retrofit tanpa alasan kuat.

Langkah migrasi singkat:

1. `mkdir acts/` + salin helper bersama ke `acts/common.js` (P/T/O/A,
   `getChannelStyle`, `ActChrome`, `withOrigin`) dari kata benda aktual
   topic.
2. Pindahkan tiap blok scene per Act dari render `Animation.jsx` ke
   `acts/ActN.jsx` — JAGA memberikan koordinat body-local sama (tanpa
   ubah nomor), jadikan `state` dari props.
3. Tulis `SUMMARY_STAGE` + panduan summary, defensifkan semua akses state
   dengan `?? default`.
4. `acts/index.js` ekspor `ACT_SCENES` (urutan = order phase timeline).
5. Ganti blok inline di `Animation.jsx` dengan `ACT_SCENES[phaseIdx]`.
6. Tambah `bg`/`bgScenes` di intro. Cari `layout.body` di
   `PortraitSceneLayoutV1.js` kalau perlu origin — jangan hardcode.

## 6. Quality Gate

Checklist wajib sebelum dianggap selesai:

- [ ] `ACT_SCENES` length == phase count timeline.
- [ ] `esbuild src/content/<topic>/Animation.jsx` passes (bundle).
- [ ] SSR render test: baseline (tanpa `bg`) vs `bg=N` (ada vignette +
  scene), `bg` out-of-range → tidak merender layer, `progress=1` → layer
  hilang.
- [ ] Tiap Act render non-kosong tanpa props (mode summary).
- [ ] Tidak ada `A(/T(/O(` inline tersisa di `Animation.jsx`.
- [ ] `npm run build` memunculkan error pre-existing topic lain saja.

## 7. Referensi Terkait

- `docs/plan/PLAN-12-SHARED-SCENE-COMPONENTS-V1.md` §6 (kontrak
  IntroHeaderMorphV1) & §11 (aturan prop optional non-breaking).
- `02-topic-contract-scene-shell.md` (layout contract, `layout.body`).
- `03-planning-storytelling-quality-gate.md` (struktur Act, continuity).
- `src/shared/scene-ui/v1/PortraitSceneLayoutV1.js` (`DEFAULT_LAYOUT_V1`,
  `layout.body` 44,235; `estimateTextWidth`).
- Implementasi nyata: `src/content/44-ssh/acts/` + UPDATE 5/6 di
  `IntroHeaderMorphV1`.