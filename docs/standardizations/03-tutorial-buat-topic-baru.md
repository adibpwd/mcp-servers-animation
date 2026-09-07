# 03 — Tutorial: Bikin Topic Baru dari Nol

> Alur baca lengkap: `01-architecture` → `02-standar-konten` → **`03-tutorial-buat-topic-baru`** → `04-referensi-gsap` → `05-svg-text-guide` → `06-icon-generation`

Tutorial ini urut sesuai alur kerja nyata: prinsip storytelling → setup
folder → bikin Intro → bikin Act 1 sampai Act akhir → sambung audio →
daftar ke registry. Contoh kode diambil dari pola yang sudah terbukti
jalan di `file-permission` dan `virtual-memory`.

---

## Prinsip Storytelling & Audiens (Baca Sebelum Mulai)

Target penonton konten ini: orang awam, bahkan sengaja dibuat terasa
playful seperti tontonan anak kecil — BUKAN dokumentasi teknis yang
dibacakan. Ini bukan cuma soal "benar secara teknis", tapi soal orang mau
nonton sampai habis.

**Masalah yang mau dihindari:** kalau tiap Act cuma "penjelasan" datar
(tampilkan fakta, kasih keterangan, lanjut fakta berikutnya), penonton
skip di detik-detik awal karena tidak ada alasan buat nunggu. Konten
harus dibangun sebagai CERITA yang bikin penasaran, bukan slide yang
dinarasikan.

4 prinsip yang berlaku di SEMUA Act (bukan cuma Act 1):

1. **Act 1 = hook, bukan jawaban.** Lempar pertanyaan/misteri dulu,
   jangan langsung jelasin semuanya di awal — detail di Langkah 3.0.
2. **Tiap Act = 1 babak cerita**, bukan daftar fakta. Ada
   setup → tegangan/masalah → titik balik → payoff — detail di Langkah 3.0.
3. **Visual jangan monoton kotak.** Variasikan bentuk sesuai peran
   (pertanyaan, insight, karakter/reaksi) — detail di Langkah 3.6.
4. **Wording ringkas, tanpa emoji di visual produksi.** Kalimat pendek
   (±7-8 kata), 1 ide per kalimat, tidak ada emoji di teks/icon yang
   di-render ke video — detail di Langkah 3 bagian "Wording Ringkas &
   Tanpa Emoji".

Konten teknis tetap harus akurat (ikuti `02-standar-konten.md` dan pola
GSAP di bawah) — storytelling ini soal CARA menyampaikannya, bukan alasan
untuk melonggarkan akurasi.

## Langkah 0 — Setup Folder & Daftar ke Registry

Ikuti struktur wajib di `02-standar-konten.md` bagian 3:

```
src/content/<topic-id>/
├── Animation.jsx
├── data.js
└── manifest.js
```

`data.js` minimal isi viewport & daftar Act:

```js
export const VW = 820
export const VH = 640
export const PHASES = [
  { label: 'Act 1: Introduction', duration: 8 },
  { label: 'Act 2: Deep Dive',    duration: 12 },
  { label: 'Act 3: Conclusion',   duration: 6 },
]
```

Lalu daftarkan di `src/content/registry.js` (topic baru cukup baca dari
`manifest.js`, lihat `02-standar-konten.md` bagian 5).

**Viewport size guideline:** standard `820x640`, konten vertikal-berat
`820x720`, konten horizontal-berat `920x640`.

## Langkah 1 — Timeline Master (Wadah Semua Act)

Satu master `gsap.timeline()` menampung SEMUA fase animasi. Jangan pakai
banyak timeline independen — akan berantakan saat sinkronisasi audio dan
export video per-frame.

```jsx
import { flushSync } from 'react-dom'
// ...
const master = gsap.timeline({ repeat: -1, repeatDelay: 1.5 })
window.__animationTimeline = master
window.__flushSync = flushSync
```

**`window.__flushSync = flushSync` WAJIB ada**, bukan opsional. Script
export melakukan seek paksa per-frame (`tl.totalTime(t, false)`) dari luar
siklus event React normal — tanpa `flushSync`, `setState` hasil popIn yang
timing-nya berdekatan (<0.2s antar elemen) berisiko tidak ter-commit ke DOM
sebelum screenshot diambil, sehingga elemen tampil normal di preview tapi
hilang/telat di video export. Detail lengkap & contoh kasus nyata di
`04-referensi-gsap.md` bagian "Export Safety".

Semua action diposisikan pakai **time cursor** — variabel `time` yang
ditambah manual sebesar durasi tiap Act. Ini pola yang WAJIB dipakai:

```javascript
let time = 0.0

// Intro
master.add(() => setPhaseIdx(-1), time)
time += 1.2 // durasi intro

// Act 1
const p1Duration = 6.5
master.add(() => setPhaseIdx(0), time)
master.to(target, { x: 100, duration: 3.0 }, time + 1.0)
time += p1Duration
```

Kenapa pola ini dan bukan yang lain:

| Pola | Masalah |
|---|---|
| `'+=0.5'` (relative positioning) | Susah tahu total durasi timeline, harus jumlah manual |
| Angka detik absolut hardcoded (`8.5`, `9.3`) | Ubah durasi 1 Act → harus update SEMUA angka setelahnya |
| **Time cursor (`time`, `t`)** | Ubah 1 angka durasi, semua Act setelahnya otomatis ikut geser ✅ |

## Langkah 2 — Bikin Intro (Hero Thumbnail → Header Morph)

Frame `t=0` dipakai juga sebagai Cover/Thumbnail Reels, jadi harus rapi,
besar, dan center — tanpa perlu gambar cover terpisah.

**Teknik: interpolasi matematis (lerp), BUKAN crossfade dua elemen.**
Pakai satu elemen `<text>` SVG, manipulasi X/Y/fontSize pakai
`morphProgress` (0.0 → 1.0). Supaya transisi dari center-align ke
left-align mulus tanpa "meloncat", pertahankan `textAnchor="start"` terus,
tapi hitung titik awal (frame 0) secara matematis persis di tengah layar:

```javascript
const p = morphProgress // 0 (Thumbnail) -> 1 (Header Left)

const thumbWidth = 280 // asumsi lebar font saat besar

// Mulai di tengah: (VW/2) - (thumbWidth/2)  |  Berakhir di kiri: 44
const startX = (VW / 2) - (thumbWidth / 2)
const endX = 44

const currentX = lerp(startX, endX, p)
```

```javascript
const [morphP, setMorphP] = useState(0)
const mo = { p: 0 }

master.to(mo, {
  p: 1,
  duration: 0.8,
  ease: 'power3.inOut',
  onUpdate: () => setMorphP(mo.p)
}, time)
time += 0.8
```

Untuk switch alignment di tengah morph tanpa jump:

```jsx
<text x={taglineX} textAnchor={morphP < 0.5 ? 'start' : 'middle'}>
  JUDUL TOPIC
</text>
```

## Langkah 3 — Bikin Act 1 sampai Act Akhir

### 3.0 Act 1 = Hook, Bukan Jawaban Langsung

Jangan buka Act 1 dengan penjelasan penuh. Buka dengan sesuatu yang bikin
penonton mikir "lho, kok bisa?" — jawaban lengkapnya baru terkuak
pelan-pelan sampai Act akhir (payoff).

Cara bikin hook di Act 1:
- **Pertanyaan retoris/tebak-tebakan** di awal: "Kenapa laptop kamu makin
  lemot padahal RAM-nya masih kelihatan ada sisa?"
- **Tunjukkan masalah/ketegangan visual dulu**, baru kasih clue kecil —
  JANGAN full explain di Act 1. Simpan detail teknis penuh untuk Act
  berikutnya.
- **Statement counter-intuitive**: sesuatu yang kelihatannya aneh/
  berlawanan dari common sense, biar penonton penasaran kenapa.

```jsx
{/* Act 1 — hook, bukan penjelasan lengkap */}
<text x={410} y={520} textAnchor="middle" fontSize={18} fontWeight={700}>
  Kenapa laptop makin lemot padahal RAM masih ada sisa?
</text>
```

Catatan: contoh di atas SENGAJA tanpa emoji — lihat "Wording Ringkas &
Tanpa Emoji" di bawah untuk alasannya.

### Setiap Act = Babak Cerita, Bukan Daftar Fakta

Ubah pola "jelasin A, terus B, terus C" jadi alur cerita 4 beat:

| Beat | Isi | Contoh (topic virtual memory) |
|---|---|---|
| Setup | Kondisi awal, normal-normal saja | RAM masih cukup, aplikasi jalan lancar |
| Tegangan/masalah | Sesuatu mulai salah, ada tekanan | RAM makin penuh, muncul alert merah |
| Titik balik | "Aha moment" — kenapa itu terjadi | Kernel mulai swap halaman ke disk |
| Payoff | Jawaban + akibat yang bisa dirasakan | Aplikasi jadi lemot karena disk lebih lambat dari RAM |

Pola simulasi feedback loop di 3.5 (kapsul menabrak shield: whoosh →
impact → granted/denied) sudah contoh nyata teknik ini — dia inject
"tegangan" (akan diterima atau ditolak?) ke konten teknis, bukan cuma
tabel data statis. Pakai pola serupa di Act lain: kasih 1-2 detik jeda
"tegangan" sebelum reveal hasil, jangan langsung tampilkan jawaban.

Tutup tiap Act (kecuali Act terakhir) dengan sedikit cliffhanger ke Act
berikutnya, bukan ringkasan datar:

```jsx
{/* ❌ Ringkasan datar */}
<text>RAM sudah 83% terpakai.</text>

{/* ✅ Cliffhanger ke Act berikutnya */}
<text>RAM sudah 83% terpakai... apa yang terjadi kalau penuh?</text>
```

### Wording Ringkas & Tanpa Emoji (Semua Teks yang Di-render)

Aturan ini berlaku untuk SEMUA teks yang tampil di video — caption
(`say()`), teks di card/badge, dan constant di `data.js` — bukan cuma
Act 1.

**Wording ringkas:**
1. Maksimal ±7-8 kata per kalimat. Kalimat majemuk dipecah/dipotong.
2. 1 kalimat = 1 ide pokok. Kalau ada 2 ide, ambil yang paling penting
   buat pesan utama, sisanya dibuang — bukan digabung pakai koma.
3. Buang kata pengisi ("saat itu juga", "masing-masing", "kembali", dsb)
   yang tidak menambah makna.
4. Istilah teknis tetap dipertahankan — itu bagian dari pesan, bukan
   filler yang boleh dibuang.

```
❌ "Laptop di rumah mau connect langsung ke laptop di kantor, saat itu juga."
✅ "Laptop rumah mau connect ke kantor."
```

**Tanpa emoji di visual produksi:** jangan pakai emoji di teks yang
di-render ke video (`data.js`, inline `say()`, maupun komponen reaksi
wajah/emosi bergaya emoji seperti icon "face-surprised"/"face-happy").
Saat audit, cek DUA bentuk emoji — karakter unicode di string DAN icon
PNG bergaya emoji — bukan cuma grep teks (pernah kejadian emoji "masih
muncul" walau semua string sudah bersih, ternyata nempel di komponen
icon reaksi wajah). Emoji di `caption.md` (caption sosial media, lihat
`02-standar-konten.md` bagian 3) TIDAK termasuk aturan ini — beda
konteks, itu teks luar-video, bukan visual in-video.

### 3.1 Satu State per Act, Render Conditional

```jsx
const [phaseIdx, setPhaseIdx] = useState(0)

master.add(() => setPhaseIdx(0), time)   // GSAP bilang "ganti ke Act 0"
time += PHASES[0].duration

master.add(() => setPhaseIdx(1), time)   // Act 1
time += PHASES[1].duration
```

```jsx
{phaseIdx === 0 && <g>{/* render Act 1 */}</g>}
{phaseIdx === 1 && <g>{/* render Act 2 */}</g>}
```

> **Pengecualian — objek "anchor" yang representasi hal SAMA lintas-Act**
> (misal: karakter/device yang sama tampil dari Act 1 sampai akhir):
> JANGAN taruh di dalam blok conditional per-Act. Blok conditional di
> atas unmount-total tiap ganti Act, jadi objek itu bakal keanggap
> "objek baru" dan pop-in ulang (fade + scale + SFX) tiap transisi —
> padahal bukan objek baru, bikin penonton bingung ("ini icon baru atau
> yang tadi?"). Resep & contoh kode lengkap: `04-referensi-gsap.md`
> bagian "Persistent Anchor Object Lintas-Act".

### 3.2 State Reset di Awal Tiap Act (Wajib untuk Loop)

Timeline ini `repeat: -1` — akan loop dari awal terus. Kalau state tidak
di-reset, objek bisa "tersangkut" di state akhir Act sebelumnya waktu
loop ulang. **Golden rule: setiap Act harus bisa start dari clean slate**,
jangan ada asumsi tentang state dari Act sebelumnya.

```jsx
master.add(() => {
  // reset SEMUA state ke nilai awal
  setRamPct(0)
  setRamSlots(INITIAL_SLOTS)
  ramPctObj.v = 0
}, time)
```

### 3.3 Fixed Target Values, Jangan Cumulative

```jsx
// ❌ BAD — overflow setelah beberapa loop
tl.to(ramPctObj, { v: ramPctObj.v + 17 }, t)
// Loop 1: 17% → Loop 2: 33+17=50% → ... → Loop 4: 116% ❌

// ✅ GOOD — tween ke angka tetap, aman di-loop berapa kali pun
tl.to(ramPctObj, { v: 17 }, t + 1)
tl.to(ramPctObj, { v: 33 }, t + 2)
tl.to(ramPctObj, { v: 50 }, t + 3)
```

### 3.4 Sequencing: Sequential / Simultan / Overlap

```js
// Sequential — satu selesai baru mulai berikutnya
tl.to(el, { x: 100, duration: 1 }, t)
t += 1
tl.to(el, { y: 50, duration: 0.5 }, t)

// Simultan — mulai bareng, jangan increment t di antaranya
tl.to(el1, { x: 100, duration: 1 }, t)
tl.to(el2, { y: 50, duration: 1 }, t)
t += 1 // increment SETELAH semua yang paralel

// Overlap/stagger — mulai sebelum yang sebelumnya selesai
tl.to(el1, { x: 100, duration: 1 }, t)
tl.to(el2, { x: 100, duration: 1 }, t + 0.3)
tl.to(el3, { x: 100, duration: 1 }, t + 0.6)
```

### 3.5 Pola Simulasi / Feedback Loop (contoh: kapsul menabrak shield)

Jangan pisahkan timing logic dari GSAP — bungkus jadi helper function
yang dipanggil per-simulasi:

```javascript
const runSimAction = (startTime, isAllowed) => {
  master.add(() => {
    playSfx('whoosh') // awal meluncur
  }, startTime)

  // animasi objek meluncur (duration 0.6s) ...

  master.add(() => {
    setShieldState(isAllowed ? 'granted' : 'denied')
    playSfx(isAllowed ? 'success' : 'error') // saat impact
  }, startTime + 0.7)
}
```

Pola lengkap sequencing/easing/callback lain ada di `04-referensi-gsap.md`.

### 3.6 Visual Jangan Monoton Kotak

`<rect>` polos oke untuk data/progress bar (lihat `05-svg-text-guide.md`),
tapi kalau SEMUA elemen cuma kotak, konten kerasa kaku dan membosankan —
apalagi buat penonton awam/anak-anak. Variasikan bentuk sesuai peran:

| Peran | Bentuk yang disarankan | Kapan pakai |
|---|---|---|
| Pertanyaan/rasa penasaran | Speech bubble (rounded rect + ekor segitiga) | Hook Act 1, cliffhanger antar-Act |
| Insight/fakta penting | Badge/starburst, bukan rect biasa | Saat "aha moment" muncul |
| Karakter/reaksi sederhana | Muka bulat simpel (mata + mulut sesuai emosi) | Reaksi kaget/senang/bingung — bikin relate |
| Progress/perbandingan | Bar/pill + icon pendukung | Data numerik (tetap butuh presisi, lihat 05) |

Contoh speech bubble (rounded rect + ekor segitiga):

```jsx
<g>
  <rect x={40} y={40} width={300} height={80} rx={20}
    fill="#0F172A" stroke="#38BDF8" strokeWidth={2}/>
  <path d="M 70 120 L 60 145 L 95 120 Z"
    fill="#0F172A" stroke="#38BDF8" strokeWidth={2}/>
  <text x={190} y={85} textAnchor="middle" fontSize={16}>Kenapa ya... 🤔</text>
</g>
```

Contoh muka karakter simpel (reaksi kaget) — cukup lingkaran + shape mata/mulut:

```jsx
<g transform="translate(400, 200)">
  <circle r={30} fill="#FBBF24"/>
  <circle cx={-10} cy={-5} r={4} fill="#0F172A"/>
  <circle cx={10} cy={-5} r={4} fill="#0F172A"/>
  <ellipse cx={0} cy={12} rx={8} ry={10} fill="#0F172A"/> {/* mulut kaget */}
</g>
```

Tetap ikuti aturan teks di `05-svg-text-guide.md` untuk isi tulisannya —
ini cuma soal bungkusnya (shape container), bukan cara nulis textnya.

### 3.7 Satu Kanal per Kalimat (Jangan Duplikasi Caption vs Card)

Caption bar atas (`say(tl, time, text)`) dan card/badge on-canvas
(`popIn(tl, time, id)`) gampang diisi kalimat yang PERSIS SAMA, muncul
cuma berselisih 0.1-0.2 detik — penonton jadi baca 2x kalimat identik di
2 lokasi berbeda sekaligus (kasus nyata: 10 pasang teks dobel ditemukan
dalam 1 topic saat audit).

**Aturan:** kalau sebuah kalimat sudah tampil di card/badge on-canvas,
JANGAN panggil `say()` dengan isi persis sama di waktu berdekatan. Pilih
salah satu kanal per kalimat:
- **Caption bar** — narasi transisi pendek, pertanyaan hook, kalimat yang
  memang cuma perlu tampil sekali sebagai teks berjalan.
- **Card/badge on-canvas** — insight/fakta penting yang perlu ditonjolkan
  secara visual (sudah support word-wrap & styling lebih menonjol).

Efek samping yang wajar (bukan bug) kalau aturan ini diterapkan: caption
bar akan "diam" (tetap nampilin teks terakhir) selama beberapa detik
ketika fokus sedang di card/badge — itu OK, caption tidak wajib ganti
tiap detik.

## Langkah 4 — Sambungkan Audio & SFX

Export dilakukan headless via Puppeteer per-frame — suara yang di-play
via `new Audio()` di browser TIDAK ikut terekam. Audio di-mix belakangan
oleh FFMPEG, jadi butuh 2 sisi yang sinkron:

- **Browser (preview):** mainkan SFX di dalam `master.add(...)` di
  `Animation.jsx` lewat `playSfx('whoosh')`.
- **Backend (export):** catat waktu absolut (detik) SFX yang sama di
  `SFX_SCHEDULES` pada `scripts/export-lib.js`.

**PENTING:** angka detik di `SFX_SCHEDULES` harus PERSIS sama dengan
perhitungan `time` di GSAP — kalau tidak, audio desync saat export.

Volume web UI mengizinkan sampai `500%`. Di `export-lib.js` ini
diterjemahkan jadi scale factor untuk FFMPEG:

```javascript
const volumeScale = Math.max(0, Math.min(5.0, volume / 100))
// volume 300% = scale 3.0
```

## Langkah 5 — Pakai Komponen Global (Shared) vs Independent

Lihat `02-standar-konten.md` bagian 6 untuk aturan lengkapnya. Ringkasnya
saat menulis `Animation.jsx` topic baru:

- **Jangan bikin ulang** player, progress bar, atau card — itu semua
  otomatis didapat dari `PlayerShell.jsx` cukup dengan daftar di
  `registry.js` / `manifest.js` (lihat Langkah 0).
- **Import, jangan copy-paste** utility yang sudah shared:
  ```js
  import { loadSfx } from '../../shared/audio/sfxLoader'
  ```
- **Taruh lokal** apa pun yang spesifik ke topic ini saja: konstanta warna
  di `data.js`, helper animasi murni topic ini di
  `<topic-id>/animation-helpers.js` (contoh: `virtual-memory/animation-helpers.js`).
  Jangan taruh ini di `src/shared/` sebelum dipakai ≥ 2 topic dan stabil.

## Langkah 6 — Tips Teknis Lain

1. **Background solid, bukan transparan.** Pastikan ada `<rect>` dasar di
   SVG ukuran `100% 100%` warna solid. Kalau tidak, saat export jadi PNG
   per-frame FFMPEG bisa salah menafsirkan alpha channel.
2. **Kompensasi jeda capture.** Puppeteer ambil gambar satu-satu per frame.
   Kalau frontend crash saat capture (sering di DOM besar/efek glow berat),
   `captureFrames` di `export-lib.js` sudah kasih `setTimeout(..., 10)`
   supaya memory tidak leak.
3. **Palet warna khas project:** mint `#2CD1A8`, sky blue `#38BCF8`,
   navy/gelap `#0F172A` untuk nuansa cyberpunk/tech yang rapi. Palet warna
   lengkap (background layer, border, text, accent per makna semantik) ada
   di `05-svg-text-guide.md` bagian "Color Palette Project".

## Checklist Sebelum Commit

**Teknis:**
- [ ] `window.__animationTimeline` di-assign di `useEffect` mount
- [ ] `window.__flushSync = flushSync` di-assign di `useEffect` mount (WAJIB — lihat Langkah 1 & `04-referensi-gsap.md` § "Export Safety")
- [ ] Cleanup `return () => tl.kill()` ada
- [ ] Semua Act reset state di awal (loop-safe, lihat 3.2–3.3)
- [ ] Pause/play & speed control (0.5x, 1x, 2x) jalan
- [ ] Tidak ada console error setelah 3+ loop
- [ ] SFX browser sinkron dengan `SFX_SCHEDULES` di `export-lib.js`
- [ ] Preview `/player/<topic-id>` dan export MP4 sudah dicoba manual
- [ ] Ikuti juga checklist kontrak di `02-standar-konten.md` bagian 7
- [ ] Kalau ada randomness yang pengaruhi timing (delay antar elemen, dst),
      pakai seeded random — bukan `Math.random()` (lihat
      `04-referensi-gsap.md` § "Determinism")
- [ ] Objek yang representasi hal sama lintas-Act dirender persistent,
      bukan pop-in ulang tiap Act (lihat `04-referensi-gsap.md` §
      "Persistent Anchor Object")

**Storytelling (lihat Langkah 3.0, 3.6 & 3.7):**
- [ ] Act 1 melempar pertanyaan/misteri, baru terjawab penuh di Act akhir
- [ ] Tiap Act punya beat "setup → tegangan → titik balik → payoff", bukan cuma daftar fakta
- [ ] Minimal 1 elemen visual bukan rect polos (speech bubble/karakter/badge) per Act
- [ ] Bahasa dicek bisa dimengerti orang awam/anak-anak, hindari jargon tanpa analogi
- [ ] Ending Act akhir menjawab hook Act 1 secara eksplisit ("ternyata gitu")
- [ ] Kalimat maks ±7-8 kata, 1 ide per kalimat (lihat "Wording Ringkas & Tanpa Emoji")
- [ ] Tidak ada emoji di teks/icon produksi (`data.js`, `say()`, komponen reaksi wajah)
- [ ] Tidak ada kalimat yang dobel persis antara caption bar dan card/badge (lihat 3.7)

## Lanjutan

- Pola GSAP lebih lengkap (easing, callback, debugging, pitfalls) →
  `04-referensi-gsap.md`
- Text overflow / multi-line di SVG → `05-svg-text-guide.md`
- Generate icon set untuk topic baru → `06-icon-generation.md`
