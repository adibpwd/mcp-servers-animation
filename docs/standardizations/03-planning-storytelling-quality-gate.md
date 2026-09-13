# 03 — Planning, Storytelling & Quality Gate

> Status: **Standar aktif** — hasil konsolidasi 2026-09-13.
>
> Panduan kerja dari ide sampai export, digabung dengan pre-planning, anti-pattern, dan quality gate wajib.

## Cara Menggunakan Dokumen Ini

1. **Bab A: tutorial membuat topic dari nol.**
2. **Bab B: pre-planning, state/continuity/layout contract, dan anti-pattern.**

Dokumen sumber lama dipertahankan utuh di bawah sebagai bab agar detail,
contoh, checklist, dan keputusan historis tidak hilang. Heading dinaikkan satu
tingkat hanya untuk menyesuaikan struktur dokumen gabungan.

---

## Bab A — Tutorial Membuat Topic dari Nol

## 03 — Tutorial: Bikin Topic Baru dari Nol

> Alur baca lengkap: `01-architecture` → `02-standar-konten` → **`03-tutorial-buat-topic-baru`** → `04-referensi-gsap` → `05-svg-text-guide` → `06-icon-generation` → `08-audio-sfx-generation`

Tutorial ini urut sesuai alur kerja nyata: prinsip storytelling → setup
folder → bikin Intro → bikin Act 1 sampai Act akhir → sambung audio →
daftar ke registry. Contoh kode diambil dari pola yang sudah terbukti
jalan di `file-permission` dan `virtual-memory`.

---

### Prinsip Storytelling & Audiens (Baca Sebelum Mulai)

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

### Langkah -1 — Konvensi File Plan (`_docs/*_PLAN.md`)

Sebelum mulai coding, kalau topic ini butuh plan doc dulu (biasanya
topic dengan kompleksitas sedang/tinggi), file plan-nya WAJIB punya
section **"Checklist Eksekusi"** berisi checkbox (`- [ ]`), bukan cuma
daftar "Next Steps" prosa biasa. Alasannya: prosa gampang jadi basi
(dibaca sekali pas dibuat, gak pernah diupdate lagi), checkbox gampang
dicek maju-mundur dan kelihatan progress asli.

Aturan:
1. Checklist mencakup MINIMAL: setup folder 3 file wajib, tiap Act
   satu-satu (bukan digabung "Act 2-6" jadi 1 baris), sambung SFX real
   ke `export-lib.js`, ubah status registry ke `'ready'`, dan referensi
   ke 2 checklist final (`03` §"Checklist Sebelum Commit" & `02` §7).
2. **Update seiring eksekusi jalan** — tiap kelar 1 item, langsung
   centang (`- [x]`) di commit/edit yang sama, JANGAN ditumpuk nulis
   ulang rapi di akhir (itu bikin checklist gak mencerminkan histori
   asli, cuma laporan retrospektif).
3. Section `**Status:**` di bagian bawah plan ikut diupdate tiap kali
   checklist berubah signifikan (`📝 PLAN ONLY` → `🚧 IN PROGRESS` →
   `✅ DONE`), plus baris `**Terakhir diupdate:**` dengan tanggal.
4. Item final checklist WAJIB jelas belum layak dicentang sampai topic
   benar-benar lengkap (contoh: "Checklist Sebelum Commit" jangan
   dicentang cuma karena Act 1 udah jalan — itu checklist untuk topic
   utuh, bukan per-Act).

Lihat `src/content/14-http-request-response/_docs/HTTP_REQUEST_RESPONSE_PLAN.md`
untuk contoh nyata pola ini.

### Langkah -0.5 — Pre-Planning Gate (13 Tahap Wajib Sebelum Coding)

Sebelum menyentuh `data.js` atau `Animation.jsx`, topic baru — terutama
topic dengan request/response, mutasi data, atau layout bertingkat — wajib
melalui 13 tahap berikut. Detail kontrak tiap tahap ada di
`09-standar-pembuatan-konten.md` §1.M–§1.R; bagian ini fokus ke URUTAN
operasionalnya.

1. **Identitas topic** — tentukan seri, kategori, palette, referensi header,
   dan metadata (lihat 09 §1.Q Series Identity Contract).
2. **Audience promise** — tulis satu kalimat: setelah menonton, apa yang
   dapat dipahami audiens.
3. **State/data contract** — isi tabel client awal → request → service →
   response → client akhir (lihat 09 §1.M Content State Contract).
4. **Storyboard dan act map** — untuk setiap Act: tujuan, entry state,
   motion, exit state, object persistent, serta durasi (lihat 09 §1.P Act
   Design Contract dan Langkah 3.0 di bawah).
5. **Continuity map** — gambar jalur semua actor utama lintas Act; tandai
   handoff/transform (lihat 09 §1.O Continuity and No-Teleport Contract).
6. **Visual data model** — tetapkan user/card/object nyata dan field visual
   yang dapat berubah (lihat 09 §1.N Method Visualization Contract).
7. **Layout map** — tetapkan header, badge, content, transit, service, safe
   gutter (lihat 09 §1.R Safe-Zone Layout Contract dan §5 template zona).
8. **Asset matrix** — tentukan asset normal, state alternate, pair
   transform, dan dynamic text (lihat `06-icon-generation.md` § Asset State
   Matrix).
9. **Timeline budget** — tulis timing tiap beat; tandai hold yang memang
   punya alasan (lihat 09 §1.O hold budget default).
10. **Review gate sebelum coding** — review dokumen plan; coding hanya boleh
    dimulai bila semua bagian di atas lengkap.
11. **Implementasi bertahap** — header/layout anchor dulu, lalu request
    flow, lalu mutation, lalu SFX (lanjut ke Langkah 0 di bawah).
12. **Validation gate** — compile, static audit, preview manual transitions,
    export test (lihat "Checklist Sebelum Commit" di akhir dokumen ini).
13. **Revision documentation** — kalau ada feedback, buat revision plan yang
    menyebut state/timing/object terdampak SEBELUM mengubah kode.

Tahap 1–9 masuk ke file plan `_docs/*_PLAN.md` (lihat Langkah -1 di atas).
Beri tiap item checklist di file plan salah satu status: `Draft`,
`Approved`, `Implemented`, `Verified Manual`, atau `Blocked` — bukan cuma
checkbox centang/kosong, supaya progress lebih granular dari sekadar
"selesai/belum".

Gate ini WAJIB untuk topic dengan request/response, mutasi data, atau
layout bertingkat (banyak zona tampil bersamaan). Topic sederhana (single
concept, tanpa request-response) boleh skip tahap 3, 5, 6 — tapi tetap
wajib isi tahap 1, 2, 4, 7, 9, 10, 12.

### Langkah 0 — Setup Folder & Daftar ke Registry

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

### Langkah 0.5 — Pilih Scene Shell (Scene UI V1 atau Custom)

Sebelum menulis satu baris JSX pun di `Animation.jsx`, putuskan dulu chrome
layout (hero → header, Act badge + dot navigator, content boundary) yang
dipakai. Detail kontrak lengkap: `09-standar-pembuatan-konten.md` §1.S dan
`src/shared/scene-ui/README.md`.

Checklist keputusan:

- [ ] Apakah topik ini portrait standard (820×1340)?
- [ ] Apakah ada hero header (category/title/subtitle) dan minimal dua Act?
- [ ] Apakah badge Act + dot navigator dipakai?
- [ ] Kalau jawaban di atas semuanya YA → **gunakan scene-ui V1**, langsung
      pakai primitive (`IntroHeaderMorphV1`, `ActBadgeNavigatorV1`,
      `ContentBodyV1`) atau composer `SceneChromeV1`.
- [ ] Kalau TIDAK (landscape, simulator/dashboard, split-screen, atau
      sengaja tanpa struktur Act/header standar) → **catat opt-out** di
      file plan topic (`_docs/*_PLAN.md`): alasan teknis/storytelling,
      layout map pengganti, safe-zone pengganti, cara navigasi Act (atau
      alasan tidak memakainya). Copy-paste implementasi lama BUKAN alasan
      opt-out yang sah.

Poin penting yang tetap berlaku baik pakai V1 maupun custom:

- topic tetap memiliki state `morph progress` dan `active Act` sendiri;
- GSAP master timeline tetap tinggal di `Animation.jsx` topic (lihat
  Langkah 1 di bawah);
- data `PHASES` tetap milik `data.js` topic;
- scene component (kalau pakai V1) hanya menerima props dan children SVG —
  tidak membuat timeline/state/SFX sendiri;
- jangan membuat header/badge inline kedua setelah memakai V1 — kalau ada
  kebutuhan custom sebagian, gunakan prop opsional yang sudah tersedia
  (lihat README scene-ui § aturan versioning) dulu sebelum menulis ulang
  manual;
- semua visual topic-specific (browser panel, card, cabinet, flowchart, dst)
  diletakkan di dalam `ContentBodyV1` (kalau pakai V1) memakai local
  coordinate (0,0 = `body.x`/`body.y`), bukan koordinat canvas absolut.

Quick-start import (nama path & props sudah terverifikasi dari source,
lihat `src/shared/scene-ui/v1/index.js`):

```jsx
import {
  SceneChromeV1, DEFAULT_LAYOUT_V1,
} from '../../shared/scene-ui/v1'
```

Lihat `src/shared/scene-ui/README.md` § "Quick Start" untuk contoh JSX
lengkap, dan Langkah 2 di bawah untuk detail prop `IntroHeaderMorphV1`
(dipakai baik lewat `SceneChromeV1` maupun langsung).

### Langkah 1 — Timeline Master (Wadah Semua Act)

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

### Langkah 2 — Bikin Intro (Hero Thumbnail → Header Morph)

> **Kalau memilih scene-ui V1 di Langkah 0.5:** teknik lerp di bawah ini
> SUDAH diimplementasikan sebagai `IntroHeaderMorphV1` — topic cukup pass
> `progress` (state `morphP` dari GSAP, sama seperti contoh di bawah),
> `category`/`categorySegments`, `titleSegments`, dan `subtitle`. Tidak
> perlu menulis ulang manual JSX header. Section ini tetap relevan sebagai
> penjelasan MENGAPA teknik lerp dipakai (berguna untuk topic opt-out
> custom, atau untuk memahami internal `IntroHeaderMorphV1`).

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

**Warna title (WAJIB, bukan opsional — STANDAR RESMI SERI):** title intro TIDAK BOLEH pakai
1 warna flat — wajib di-split menjadi ≥2 segmen `titleSegments` dengan kombinasi warna semantik berikut:
- **Title A (Kata Pertama / Subjek / Aktor Utama):** **Biru / Sky / Cyan** (`COLORS.CLIENT` `#38BDF8` atau `#22D3EE`).
- **Title B (Kata Kedua / Status / Result / Payoff):** **Hijau Emerald** (`COLORS.SUCCESS` `#34D399`).

*Contoh nyata:*
- `19-register`: `INTRO_TITLE_A = 'RECORD'` (`#38BDF8` Biru) + `INTRO_TITLE_B = ' SUCCESS'` (`#34D399` Hijau).
- `20-email-verification`: `INTRO_TITLE_A = 'EMAIL'` (`#22D3EE` Cyan) + `INTRO_TITLE_B = ' VERIFICATION'` (`#34D399` Hijau).
- `22-oauth2-delegated-login`: `INTRO_TITLE_A = 'APP'` (`#38BDF8` Biru) + `INTRO_TITLE_B = ' TOKEN'` (`#34D399` Hijau).
- `23-https-tls`: `INTRO_TITLE_A = 'HTTPS'` (`#38BDF8` Biru) + `INTRO_TITLE_B = ' SECURE'` (`#34D399` Hijau).

**Aturan Keras Warna Header:**
1. **JANGAN PERNAH MENUKAR URUTAN:** Jangan gunakan Hijau duluan lalu Biru untuk Title A/B. Kata/konsep utama di awal SELALU Biru/Cyan, kata status/hasil di akhir SELALU Hijau.
2. **JANGAN PAKAI WARNA GELAP/MATI:** Judul hero wajib kontras tinggi dan cerah di atas canvas gelap (`#070913`).
3. Subtitle tetap `COLORS.MUTED` (`#94A3B8` netral).
4. Titik split harus pada batas kata/suku kata yang bermakna (misal `RECORD` + ` SUCCESS`, bukan `RECO` + `RD SUCCESS`).
5. Cursor typing (`█`) mengikuti warna segmen title yang sedang diketik; saat subtitle diketik, cursor memakai warna segmen title TERAKHIR (`COLORS.SUCCESS`).

### Langkah 3 — Bikin Act 1 sampai Act Akhir

#### 3.0 Act 1 = Hook, Bukan Jawaban Langsung

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

#### Setiap Act = Babak Cerita, Bukan Daftar Fakta

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

#### Wording Ringkas & Tanpa Emoji (Semua Teks yang Di-render)

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

**Pure explanatory, tanpa kata ganti orang:** semua teks in-video
(`data.js`, inline `say()`) menjelaskan konsep secara impersonal —
subjeknya benda/konsep ("laptop", "container", "kernel"), BUKAN menyapa
penonton langsung. Jangan pakai kata ganti orang atau bentuk lekatnya:
"lo/lu/kamu/aku/gue/kita/kau" maupun akhiran posesif "-mu"/"-ku" (mis.
"laptop lo" → "laptop"). Audit sebelum commit pakai grep pola ini ke
seluruh string yang di-render (`data.js` + string hardcode lain di
`Animation.jsx` di luar `data.js` kalau ada):
```
grep -n -E "[a-zA-Z]+(mu|ku)\b|\blo\b|\blu\b|\bkamu\b|\baku\b|\bgue\b|\bkita\b|\bkau\b"
```
Kasus nyata: `CLOSING_BRAND` di `container-docker/data.js` sempat lolos
dengan teks "Itu yang bikin laptop lo lega." — fix-nya ganti subjek balik
ke benda generik ("Itu yang bikin laptop jadi lega."), makna tetap sama,
cuma buang kata ganti orangnya. `caption.md` (caption sosial media)
TIDAK termasuk aturan ini — sama seperti aturan emoji di atas, beda
konteks (teks luar-video, boleh lebih santai/personal).

#### 3.1 Satu State per Act, Render Conditional

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

#### 3.2 State Reset di Awal Tiap Act (Wajib untuk Loop)

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

#### 3.3 Fixed Target Values, Jangan Cumulative

```jsx
// ❌ BAD — overflow setelah beberapa loop
tl.to(ramPctObj, { v: ramPctObj.v + 17 }, t)
// Loop 1: 17% → Loop 2: 33+17=50% → ... → Loop 4: 116% ❌

// ✅ GOOD — tween ke angka tetap, aman di-loop berapa kali pun
tl.to(ramPctObj, { v: 17 }, t + 1)
tl.to(ramPctObj, { v: 33 }, t + 2)
tl.to(ramPctObj, { v: 50 }, t + 3)
```

#### 3.4 Sequencing: Sequential / Simultan / Overlap

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

#### 3.5 Pola Simulasi / Feedback Loop (contoh: kapsul menabrak shield)

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

#### 3.6 Visual Jangan Monoton Kotak

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

#### 3.7 Satu Kanal per Kalimat (Jangan Duplikasi Caption vs Card)

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

### Langkah 4 — Sambungkan Audio & SFX

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

### Langkah 5 — Pakai Komponen Global (Shared) vs Independent

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

### Langkah 6 — Tips Teknis Lain

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

### Checklist Sebelum Commit

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
- [ ] Elemen fixed-width yang sejajar horizontal (Badge/Box/Card) sudah
      dicek tidak overlap pakai formula center-anchor (lihat
      `05-svg-text-guide.md` § "Formula Cek Overlap Antar-Elemen
      Horizontal") — jangan cuma andalkan eyeball di preview
- [ ] Audit SFX Coverage sudah dilakukan: baca ulang seluruh timeline,
      tandai motion signifikan yang masih total silent, dan pastikan
      tiap `sfx: false` punya alasan jelas (lihat `04-referensi-gsap.md`
      § "Policy: `sfx: false` Wajib Ada Alasan")
- [ ] `SFX_MAP` di `data.js` di-cross-check terhadap pemanggilan aktual
      di `Animation.jsx` — tidak ada entry yang didefinisikan tapi tidak
      pernah dipanggil (atau sudah jelas alasannya kalau memang disiapkan
      untuk dipakai segera)
- [ ] Kalau ada helper SFX generik (`popIn()` atau sejenis) yang menerima
      `sfxName` dari berbagai kategori folder audio, pastikan kategori
      di-declare eksplisit per pemanggilan — bukan hardcode 1 kategori
      (lihat `04-referensi-gsap.md` § "Referensi: `popIn()` dengan
      `sfxCategory` Eksplisit")
- [ ] Komponen text-container baru (`Badge`/`TextCard`/sejenisnya) sudah
      support prop `icon` opsional sejak awal dibuat (lihat
      `06-icon-generation.md` § "Checklist Tambahan: Icon di Komponen
      Text-Container")
- [ ] Scene shell sudah diputuskan di Langkah 0.5 (V1 atau opt-out
      tertulis) — kalau pakai V1, cross-check checklist review §1.S/§2
      poin 8 di `09-standar-pembuatan-konten.md` (header tetap terlihat,
      semua dot badge terlihat, content tidak menabrak subtitle/badge,
      debug overlay mati sebelum export)

**Storytelling (lihat Langkah 3.0, 3.6 & 3.7):**
- [ ] Act 1 melempar pertanyaan/misteri, baru terjawab penuh di Act akhir
- [ ] Tiap Act punya beat "setup → tegangan → titik balik → payoff", bukan cuma daftar fakta
- [ ] Minimal 1 elemen visual bukan rect polos (speech bubble/karakter/badge) per Act
- [ ] Bahasa dicek bisa dimengerti orang awam/anak-anak, hindari jargon tanpa analogi
- [ ] Ending Act akhir menjawab hook Act 1 secara eksplisit ("ternyata gitu")
- [ ] Kalimat maks ±7-8 kata, 1 ide per kalimat (lihat "Wording Ringkas & Tanpa Emoji")
- [ ] Tidak ada emoji di teks/icon produksi (`data.js`, `say()`, komponen reaksi wajah)
- [ ] Tidak ada kata ganti orang ("lo/lu/kamu/aku/gue/kita/kau", akhiran
      "-mu"/"-ku") di teks in-video — pure explanatory (lihat "Wording
      Ringkas & Tanpa Emoji" § "Pure explanatory, tanpa kata ganti orang")
- [ ] Tidak ada kalimat yang dobel persis antara caption bar dan card/badge (lihat 3.7)

### Lanjutan

- Pola GSAP lebih lengkap (easing, callback, debugging, pitfalls) →
  `04-referensi-gsap.md`
- Text overflow / multi-line di SVG → `05-svg-text-guide.md`
- Generate icon set untuk topic baru → `06-icon-generation.md`
- Generate/sourcing aset audio SFX untuk topic baru → `08-audio-sfx-generation.md`
- Kontrak pre-planning lengkap (state, method, continuity, series identity,
  safe-zone) untuk topic request/response atau bertingkat →
  `09-standar-pembuatan-konten.md` §1.M–§1.R
- Kapan wajib pakai scene-ui V1 vs opt-out custom → `09-standar-pembuatan-konten.md` §1.S
- API lengkap scene-ui V1 (props, quick-start, versioning) → `src/shared/scene-ui/README.md`


---

## Bab B — Pre-Planning & Anti-Pattern

## 09 — Standar Pembuatan Konten: Pre-Planning & Anti-Pattern

> Alur baca lengkap: `01-architecture` → `02-standar-konten` → `03-tutorial-buat-topic-baru` → `04-referensi-gsap` → `05-svg-text-guide` → `06-icon-generation` → `08-audio-sfx-generation` → **`09-standar-pembuatan-konten`**

Dokumen ini merangkum **checklist wajib pre-planning** dan **anti-pattern**
yang ditemukan dari studi kasus nyata: topic `14-http-request-response`
mengalami **14 revisi dalam 1 hari** (2026-09-09 s/d 2026-09-10). Mayoritas
revisi itu seharusnya bisa dicegah kalau standar di dokumen ini sudah ada
sebelum mulai coding.

Dokumen ini **bukan** tutorial step-by-step pembuatan topic (itu ada di
`03-tutorial-buat-topic-baru.md`) — fokusnya adalah checklist yang wajib
diselesaikan SEBELUM dan SELAMA coding, plus daftar anti-pattern spesifik
supaya tidak terulang.

### 0. Ringkasan Pola Masalah

| Kategori Masalah | Revisi Terkait | Contoh Singkat |
|---|---|---|
| Narasi & analogi tidak divalidasi sebelum coding | 07, 11 | "Browser = Tukang Pos" salah posisi, "Surat siap!" terlalu dini |
| Icon tidak direncanakan menyeluruh di awal | 01, 02, 03 | 3 batch icon + 1 batch tambahan, harusnya 1 plan sekaligus |
| Layout/koordinat bentrok saat act digabung | 05, 06, 08, 09 | 8 elemen numpuk vertikal sekaligus setelah Act 1+2 merge |
| Caption/teks salah posisi & format | 02, 04, 10 | Caption bar bawah dibuang total, kalimat tanya → deklaratif |
| Act terlalu banyak, tidak ada continuity | 05, 07 | 6 act → 4 act, icon menghilang antar-act |
| Flowchart path tidak tersambung dari awal | 03, 12, 14 | Benang baru muncul di Act 2, amplop balik "naik" karena salah posisi default |
| Visual tanpa context pemicu | 07, 08, 11 | Teks muncul sebelum icon yang "memicu" teks itu ada |
| Field dideklarasikan tapi tidak pernah dirender | 10 | `PHASES[].caption` tidak pernah dipakai, tidak ditandai dead field || Aktor analogi salah arah (one-way vs two-way) | 11 | Browser = tukang pos → keliru, tukang pos satu arah, browser dua arah |
| Elemen visual menambah noise, bukan kejelasan | 13 | Wajah di browser/server, overlay rect pintu mengaburkan bentuk |
| Arah gerak elemen bertentangan dengan narasi | 14 | Amplop "naik" balik padahal narasi bilang sudah berangkat |
| Teks posisi hardcode, tidak ikut elemen utama | 14 | methodBadge/addressLabel diam sementara amplop pindah posisi |
| Node perantara hanya label, tanpa visual keputusan | 14 | DNS cuma teks, tidak ada visual "routing ke server mana" |

---

### 1. DO / DON'T per Kategori

#### A. Narasi & Analogi

**✅ DO:**
- Tulis storyboard naratif per Act SEBELUM buka code editor
- Validasi akurasi teknis analogi: tanya "apakah ini benar secara teknis?" sebelum commit ke satu analogi
- **Validasi arah/sifat aktor dalam analogi** — cek apakah aktor pembanding punya sifat yang sama (one-way vs two-way, aktif vs pasif). Lihat contoh §6.1
- Verifikasi urutan cause → effect: tunjukkan pemicu visual dulu, baru teks muncul sesudahnya
- Gunakan kalimat deklaratif ("Browser tidak langsung ambil halaman"), BUKAN kalimat tanya — AI di animasi ini berperan sebagai penjelas, bukan penanya
- Pastikan teks "selesai" (mis. "Surat siap!") hanya muncul setelah proses benar-benar selesai secara naratif

**❌ DON'T:**
- Jangan mulai coding sebelum analogi divalidasi
- Jangan pilih analogi tanpa cek kesesuaian arah/sifat aktor (mis. kurir satu-arah dipakai untuk proses dua-arah)
- Jangan pakai kalimat tanya sebagai caption dalam bentuk apapun — ini aturan keras, bukan preferensi gaya
- Jangan munculkan teks sebelum visual context-nya ada di layar
- Jangan gunakan emoji di caption
- Jangan buat caption "selesai" sebelum proses naratifnya memang selesai

---
#### B. Perencanaan Icon

**✅ DO:**
- Audit SEMUA elemen visual topic di awal (sebelum coding) → kategorikan:
  - `inline SVG`: elemen punya sub-state animasi internal (rotasi, ekspresi, buka/tutup)
  - `icon PNG`: elemen statis atau cuma 2 varian sederhana (open/closed)
- Tulis `icons.json` LENGKAP (semua batch sekaligus) sebelum generate satupun PNG
- Tentukan source setiap icon dari awal: `chatgpt` atau `download` (Devicon/Simple Icons)
- Buat `default-icon.png` placeholder sebelum generate icon asli — supaya build tidak rusak
- Plan batch layout (grid 2×4, slot ke-8 selalu `[EMPTY]` sesuai `06-icon-generation.md §1.2`)

**❌ DON'T:**
- Jangan generate icon dulu baru tulis `icons.json` — selalu sebaliknya
- Jangan generate piecemeal (batch-1 selesai baru mikir batch-2) kalau sebenarnya semua icon sudah bisa diidentifikasi sejak audit awal
- Jangan convert elemen yang punya animasi internal menjadi icon PNG (contoh: spinner rotasi, ekspresi wajah berubah, pintu buka/tutup)
- Jangan skip default-icon.png — build AKAN rusak kalau PNG icon belum ada

---

#### C. Layout & Koordinat

**✅ DO:**
- Bagi canvas menjadi zona per aktor sebelum assign koordinat (contoh: CLIENT zone atas, NETWORK zone tengah, SERVER zone bawah — lihat §5)
- Hitung collision Y untuk semua elemen yang bisa tampil bersamaan: jarak Y antara dua elemen ≥ tinggi elemen atas + 20px margin
- Untuk caption horizontal berdampingan: formula `|anchor2-anchor1| ≥ w1/2 + w2/2 + 20` (lihat `05-svg-text-guide.md`)
- Definisikan FlowchartSpine waypoints LENGKAP dari awal (semua node + path segments termasuk segmen Act 1) sebelum mulai coding timeline
- Setiap elemen WAJIB punya `popOut` yang terdefinisi di timeline — tidak boleh ada elemen yang "hidup terus" tanpa exit, termasuk elemen yang sudah "sampai tujuan" (mis. amplop yang sudah masuk server tetap wajib di-popOut, jangan dibiarkan nempel di layar)
**❌ DON'T:**
- Jangan assign koordinat Y sembarangan lalu berharap tidak nabrak
- Jangan desain layout satu-Act-satu-Act tanpa mempertimbangkan elemen dari act lain yang bisa tampil bersamaan (terutama setelah act merge)
- Jangan mulai path dari tengah perjalanan (path WAJIB dimulai dari node paling awal sejak Act 1)
- Jangan biarkan elemen "menumpuk" tanpa ada cleanup timer, termasuk elemen yang secara naratif sudah "sampai" tapi masih tampil diam di layar

---

#### D. Caption & Teks

**✅ DO:**
- Target ≤ 5 kata per caption (lebih pendek = lebih baik)
- Taruh caption DEKAT elemen visual yang dibahas (bukan di caption bar bawah)
- Gunakan `IconCaption` (nempel di bawah icon) atau `PathLabel` (nempel di benang yang sedang jalan) — bukan `say()` ke caption bar terpisah
- Sesuaikan posisi teks dengan posisi elemen utama yang sedang dibahas SAAT teks itu muncul — kalau elemen utama berpindah posisi, teks yang mengacu padanya wajib ikut berpindah (lihat §K di bawah)
- Verifikasi: "mata penonton lagi di mana saat teks ini muncul?" — teks harus ada di sana juga

**❌ DON'T:**
- Jangan gunakan caption bar bawah layar (`say()`) — sudah deprecated
- Jangan stack teks vertikal kalau beberapa teks tampil bersamaan — buat horizontal
- Jangan hardcode posisi teks jauh dari elemen yang dibahas, dan jangan biarkan koordinatnya statis kalau elemen acuannya bergerak/berpindah
- Jangan pakai kata "siap" / "selesai" / "jadi!" sebelum ceritanya benar-benar selesai
- **Jangan pernah menulis caption dalam bentuk kalimat tanya** — ini penyebab berulang di banyak revisi; treat sebagai hard rule, bukan gaya penulisan yang opsional

---
#### E. Struktur Act

**✅ DO:**
- Batasi maksimum 4 Act untuk animasi 40–60 detik
- Gabungkan Act yang satu pelaku/lokasi cerita (browser dengan browser, server dengan server)
- Pertahankan elemen yang masih relevan ke Act berikutnya — jangan langsung hilang
- Define explicit: elemen apa yang PERSIST ke act berikutnya, elemen apa yang FADE
- Beri jarak buffer minimum 0.2s di seam antar-Act (jangan terlalu panjang buffer)
- Setiap elemen baru yang muncul (mis. blok HTML/JS/CSS di browser) WAJIB punya konteks asal-usul yang jelas di narasi/visual — jangan biarkan elemen "tiba-tiba muncul" tanpa penjelasan dari mana asalnya

**❌ DON'T:**
- Jangan buat lebih dari 4 Act tanpa alasan kuat
- Jangan render elemen dalam blok `{phaseIdx === N && ...}` kalau elemen itu perlu persist ke Act berikutnya
- Jangan buat buffer antar-Act terlalu panjang (> 0.5s buffer = waktu nganggur yang terasa lama)
- Jangan merge Act tanpa cek ulang koordinat Y semua elemen yang sekarang bisa tampil bersamaan
- Jangan tampilkan elemen konten (HTML/CSS/JS, data, file) tanpa sumber visual yang jelas — penonton harus bisa jawab "elemen ini datang dari mana?"

---

#### F. Flowchart & Path

**✅ DO:**
- FlowchartSpine selalu dimulai dari Act 1 (bukan muncul pertama kali di Act 2+) — lihat contoh konkret di §6.4
- Path harus punya waypoint untuk SETIAP momen penting perjalanan, termasuk "berangkat dari browser" di Act 1
- Elemen yang bergerak harus bergerak dalam satu arah konsisten dengan narasi (ke bawah = pergi ke tujuan, ke atas = kembali ke pengirim)
- Gunakan dual-color path: arah pergi = satu warna, arah balik = warna berbeda
- Untuk node perantara/intermediary (mis. DNS, load balancer, proxy) yang berperan sebagai titik keputusan routing, beri visual eksplisit yang menunjukkan "keputusan" itu terjadi (mis. highlight target tujuan, garis bercabang yang menyala ke satu arah) — jangan biarkan node itu jadi sekadar label teks tanpa fungsi visual
**❌ DON'T:**
- Jangan gerakkan elemen "balik ke atas" kalau narasi belum menyatakan perjalanan balik
- Jangan mulai path hanya dari node tengah — path harus connected dari node awal
- Jangan biarkan amplop terbang tanpa path menyala bersamaan (path dan pergerakan elemen harus sinkron)
- Jangan jadikan node intermediary sekadar teks statis kalau perannya secara naratif adalah "titik keputusan" — itu kehilangan momen visual yang penting

---

#### G. Dead Field Audit

Field/prop yang dideklarasikan di `data.js` (mis. di dalam array `PHASES`) tapi
tidak pernah benar-benar dirender atau dipakai di `Animation.jsx` disebut
**dead field** — field ini membingungkan saat maintenance karena developer lain
(atau AI) akan mengira field itu aktif dipakai, padahal tidak.

**✅ DO:**
- Sebelum commit, cross-check SETIAP field/prop di `data.js` terhadap penggunaannya di `Animation.jsx` — pastikan semua field yang dideklarasikan benar-benar dirender
- Kalau ada field yang sengaja disiapkan untuk masa depan tapi belum dipakai, beri komentar eksplisit `// TODO: belum dirender` di `data.js`
- Lakukan audit ini sebagai bagian dari checklist sebelum "topic selesai" (lihat §2 dan §4)

**❌ DON'T:**
- Jangan biarkan field seperti `PHASES[].caption` dideklarasikan tapi tidak pernah dirender tanpa penanda apapun
- Jangan asumsikan field pasti terpakai hanya karena namanya terdengar relevan — selalu verifikasi lewat grep/search penggunaan sebenarnya

---
#### H. Validasi Aktor Analogi

Kategori ini memperkuat §A khusus untuk kasus analogi yang aktornya salah arah
atau salah sifat — pola ini cukup sering terjadi sehingga layak jadi checklist
terpisah.

**✅ DO:**
- Untuk setiap analogi yang dipakai, identifikasi sifat kunci aktor pembanding: apakah dia one-way atau two-way, aktif atau pasif, sekali pakai atau berulang
- Cocokkan sifat itu dengan sifat aktor teknis yang direpresentasikan — kalau tidak cocok, analogi WAJIB diganti sebelum coding, bukan diperbaiki setelah animasi jadi
- Tuliskan alasan validasi analogi secara singkat di storyboard (§2 poin 1.2b), supaya keputusan analogi bisa diaudit ulang

**❌ DON'T:**
- Jangan pakai analogi hanya karena familiar/populer tanpa cek kecocokan sifat (lihat contoh "tukang pos" di §6.1)
- Jangan menunda validasi analogi sampai setelah storyboard visual jadi — validasi ini harus di tahap paling awal

---

#### I. Visual Noise Audit

Elemen visual yang ditambahkan "supaya lucu/hidup" tapi sebenarnya tidak
menambah kejelasan cerita — atau malah mengaburkan bentuk elemen lain —
disebut **visual noise**.

**✅ DO:**
- Untuk setiap elemen dekoratif (mis. wajah/ekspresi pada objek, overlay tambahan), tanya: "apakah ini membantu penonton memahami proses, atau sekadar dekorasi?"
- Kalau overlay/dekorasi menutupi atau mengaburkan bentuk elemen utama (mis. rect pintu menutupi bentuk gedung server), hapus atau redesain supaya tidak konflik secara visual
- Prioritaskan kejelasan bentuk & fungsi elemen dibanding elemen "lucu" yang tidak berkontribusi ke narasi
**❌ DON'T:**
- Jangan tambahkan wajah/ekspresi ke objek non-karakter (mis. browser, server) kalau tidak berkontribusi ke pemahaman proses
- Jangan taruh overlay/shape tambahan di atas elemen utama tanpa cek apakah itu mengaburkan bentuk aslinya

---

#### J. Konsistensi Arah Gerak

**✅ DO:**
- Sebelum animasi elemen bergerak, cek dulu status naratif elemen itu di titik waktu tersebut — apakah sedang "berangkat", "dalam perjalanan", atau "kembali"
- Pastikan arah gerak (naik/turun, kiri/kanan) konsisten dengan status naratif itu — lihat formula default position di §6.5
- Kalau elemen perlu morph/reposisi, pastikan arah reposisinya tidak berlawanan dengan tahap perjalanan yang sedang berlangsung

**❌ DON'T:**
- Jangan pindahkan elemen ke arah yang menyiratkan "kembali" kalau narasi belum menyatakan perjalanan balik
- Jangan gunakan posisi default yang bertentangan dengan posisi terakhir elemen sebelum morph (lihat contoh §6.5)

---

#### K. Teks Mengikuti Posisi Elemen

**✅ DO:**
- Untuk teks/badge yang merujuk ke elemen visual tertentu (mis. `methodBadge`, `addressLabel` merujuk ke amplop), hitung posisinya secara relatif terhadap posisi elemen acuan tersebut, bukan koordinat absolut yang di-hardcode
- Kalau elemen acuan berpindah posisi antar-Act, pastikan posisi teks ikut diperbarui di timeline yang sama

**❌ DON'T:**
- Jangan hardcode posisi teks berdasarkan posisi elemen acuan di satu titik waktu saja — kalau elemen itu nanti berpindah, teks akan "ketinggalan" secara visual

---
#### L. Node Intermediary sebagai Gerbang

**✅ DO:**
- Untuk node yang berperan sebagai perantara/keputusan (DNS, load balancer, proxy, dsb.), rancang visual yang menunjukkan node itu benar-benar "memutuskan" sesuatu — misalnya highlight cabang path yang dipilih
- Sinkronkan momen visual keputusan itu dengan caption yang menjelaskan apa yang sedang diputuskan

**❌ DON'T:**
- Jangan jadikan node intermediary sekadar label statis tanpa fungsi visual apapun — ini kehilangan kesempatan menjelaskan proses yang justru penting secara teknis

---

#### M. Content State Contract (Request-Response)

Kategori ini berlaku untuk topic apapun yang punya alur request/response,
mutasi data, atau transformasi state (tidak terbatas pada REST API). Wajib
diisi SEBELUM storyboard naratif (§1.A) ditulis, karena storyboard yang benar
mengikuti state, bukan sebaliknya.

Tabel wajib per topic:

| State | Yang penonton lihat | Yang belum boleh terlihat | Pemicu perubahan | Hasil |
|---|---|---|---|---|
| Client awal | loading/empty/form | data final | click user | request lahir |
| Request transit | ticket/paket | result/response | ticket masuk gate | processor aktif |
| Service proses | resource/card | browser final | data ditemukan/mutasi | response dibuat |
| Client akhir | response/result | state lama | response tiba | UI berubah |

**✅ DO:**
- Isi tabel di atas sebelum menulis satu baris storyboard pun
- Tentukan eksplisit apa yang BELUM diketahui client di setiap baris — bukan cuma apa yang sudah diketahui
- Pastikan data hasil (response, mutasi) tidak muncul di layar sebelum sebab visualnya (request tiba, response diterima) benar-benar terjadi

**❌ DON'T:**
- Jangan tampilkan hasil/response sebelum sebab visualnya terjadi di layar
- Jangan lewati tabel ini untuk topic yang punya request/response hanya karena "sudah jelas di kepala" — tuliskan tetap, ini jadi sumber kebenaran saat revisi

---

#### N. Method Visualization Contract

Method/aksi (HTTP method, operasi CRUD, atau aksi mutasi lain) tidak boleh
hanya jadi badge atau string. Setiap method wajib menjawab 4 pertanyaan
berikut sebelum dianimasikan:

| Pertanyaan | Contoh REST API |
|---|---|
| Benda apa yang dibawa? | mini profile card, full profile card, atau role badge |
| Dari mana ia berangkat? | tombol atau form di browser |
| Ke mana ia pergi? | Gate lalu Processor di API Service |
| Apa akibat fisiknya? | card dibuat, full card diganti, badge diubah, atau card diarsipkan |

Jika salah satu jawaban belum ada, method tersebut **belum siap dianimasikan**
— kembali ke planning, jangan dipaksa coding.

**✅ DO:**
- Gunakan POST untuk card baru masuk ke layar
- Gunakan PUT untuk full card replacement (card lama hilang, card baru utuh menggantikan)
- Gunakan PATCH untuk perubahan satu layer/field saja pada card yang sama
- Gunakan DELETE untuk card yang sama berpindah/bertransformasi menuju archive (lihat §1.O untuk aturan continuity-nya)

**❌ DON'T:**
- Jangan tampilkan method sebagai badge tunggal tanpa benda fisik yang menyertainya
- Jangan morph text method (mis. teks "GET" berubah jadi "200 OK") tanpa menyatakan benda yang berubah di baliknya

---

#### O. Continuity and No-Teleport Contract

Objek request/response harus terlihat terus sebagai rantai sebab-akibat:
Browser UI → ticket lahir → ticket bergerak → gate → processor → mutasi →
response → browser berubah. Ticket tidak boleh di-pop-out di satu titik lalu
processor "muncul begitu saja" setelah jeda.

**✅ DO:**
- Tampilkan destination node dari awal dalam keadaan redup jika ia akan menjadi tujuan request
- Gunakan persistent id/state untuk browser, service hub, dan resource — sama seperti aturan persistent actor di §1.E
- Buat request berpindah melalui SETIAP node di jalurnya, jangan lompat
- Gunakan transform/handoff eksplisit (overlap minimal satu frame, scale/glow/position tween) saat objek berubah bentuk — bukan unmount lalu mount di tempat lain
- Mulai Act berikutnya pada posisi objek saat ini (posisi terakhir Act sebelumnya)

**❌ DON'T:**
- Jangan pop-out request di tengah jalur lalu munculkan hasil processing setelah beberapa detik tanpa objek penghubung
- Jangan reset canvas saat transisi antar-Act
- Jangan sembunyikan aktor penting sampai ia "tiba-tiba" diperlukan
- Jangan biarkan objek diam tanpa alasan naratif

Hold budget default (titik audit awal, bukan aturan buta — boleh dilewati
kalau alasan keterbacaan ditulis di plan topic):

| Jenis jeda | Batas awal |
|---|---:|
| click ke request berangkat | 0,25 detik |
| gate ke processor | 0,35 detik |
| response tiba ke request berikutnya | 0,40 detik |
| hold membaca perubahan penting | 0,8–1,8 detik |

---

#### P. Act Design Contract (Request-Response)

Kategori ini melengkapi §1.E khusus untuk topic dengan alur request/response.

**✅ DO:**
- Akhiri satu Act ketika unit pemahaman selesai, bukan karena "butuh nomor Act baru"
- Beri setiap Act entry state dan exit state yang eksplisit
- Tuliskan objek yang tetap hidup (persist) saat Act berubah
- Untuk topic pendek, targetkan 3–5 Act; lebih dari itu wajib punya alasan cerita tertulis di plan topic

**❌ DON'T:**
- Jangan buat epilog khusus yang hanya menampilkan daftar method kalau tiap method sebenarnya bisa dijadikan action dari client (mis. epilog "ringkasan GET/POST/PUT/DELETE" yang tidak menambah pemahaman baru)
- Jangan tambah Act untuk menyelesaikan masalah yang sebenarnya bisa jadi motion/action dalam Act yang sama

---

#### Q. Series Identity Contract & Title Header Color Standards

Identitas seri (kategori, palet, header format, referensi visual) harus
dikunci SEBELUM title/intro dibuat — bukan setelah timeline selesai.

Preflight wajib:
- topic ini bagian dari seri apa;
- kategori intro dan category manifest;
- palette title/header;
- reference topic yang dipakai sebagai acuan format;
- alasan tertulis jika menyimpang dari format seri.

**Aturan Baku Warna Header Title (`titleSegments`):**
- **Title A (Kata Pertama / Subjek Utama):** **Biru / Cyan** (`#38BDF8` / `#22D3EE`).
- **Title B (Kata Kedua / Payoff / Result):** **Hijau Emerald** (`#34D399`).
- **Standardisasi:** Kombinasi **Biru/Cyan + Hijau** adalah standar identitas seri resmi. Dilarang menukar urutan warna (mis. Hijau duluan lalu Biru) atau menggunakan warna gelap/mati pada Title A.

**✅ DO:**
- Catat referensi yang ditiru secara spesifik (mis. "hero-to-header lerp ala Tailscale, tanpa typing effect")
- Kunci kategori, palette (Title A Biru/Cyan, Title B Hijau), dan header reference sebelum menyentuh code
- Terapkan `titleSegments` resmi: Title A (Biru/Cyan) + Title B (Hijau)

**❌ DON'T:**
- Jangan menukar urutan warna title header (mis. Hijau duluan baru Biru) — selalu Title A (Biru/Cyan) + Title B (Hijau)
- Jangan menyalin efek visual secara parsial tanpa menyalin struktur layout/hierarki yang membuat efek itu berhasil di referensinya
- Jangan mengubah identitas seri, kategori, atau palette setelah timeline hampir selesai tanpa mereview dampaknya ke topic lain di seri yang sama

---

#### R. Safe-Zone Layout Contract

Kategori ini melengkapi §1.C dengan template zona eksplisit untuk topic
bertingkat (header + badge + browser + transit + service dalam satu canvas).

| Zona | Elemen yang boleh | Elemen yang dilarang |
|---|---|---|
| Header | title/subtitle | panel konten |
| Navigation | badge/dot | resource card |
| Content | actor utama | header |
| Transit | moving packet | text panjang |
| Service/result | proses/response | header |

**✅ DO:**
- Buat diagram zona vertikal (y start–end per zona, lihat template §5) SEBELUM JSX besar dibuat — wajib untuk setiap topic bertingkat
- Catat bounding box objek terbesar (browser/card/panel) secara eksplisit
- Cek collision pada hero, setiap Act, dan closing — bukan cuma satu frame acak

**❌ DON'T:**
- Jangan letakkan objek besar hanya berdasarkan feeling tanpa bounding box tertulis
- Jangan biarkan panel/card menabrak subtitle atau badge di frame manapun, termasuk frame transisi antar-Act

---

#### S. Scene Shell Default (Scene UI V1)

Kategori ini adalah kontrak DEFAULT untuk chrome layout (hero → header, Act
badge + dot navigator, content boundary) pada topic portrait standar,
menggantikan copy-paste header/badge dari topic lama. Detail implementasi
lengkap ada di `src/shared/scene-ui/README.md` dan
`docs/plan/PLAN-12-SHARED-SCENE-COMPONENTS-V1.md`; bagian ini hanya
merangkum kapan wajib dipakai dan checklist-nya.

**Wajib pakai scene-ui V1** (`IntroHeaderMorphV1` + `ActBadgeNavigatorV1` +
`ContentBodyV1`, langsung atau lewat composer `SceneChromeV1`) bila topic:
- portrait 820 × 1340;
- punya intro category/title/subtitle;
- punya dua atau lebih Act;
- memakai badge Act + dot navigator;
- body utama bisa diletakkan di bawah badge (tidak butuh layout khusus).

**Boleh opt-out** (layout custom) bila landscape, simulator/dashboard,
split-screen, atau sengaja tidak memakai struktur Act/header standar. Opt-out
WAJIB dicatat di plan topic (lihat `02-standar-konten.md`) dengan: alasan
teknis/storytelling, layout map pengganti, safe-zone pengganti, cara navigasi
Act (atau alasan tidak memakainya), dan rencana preview manual collision.
**Copy-paste implementasi lama bukan alasan opt-out yang sah.**

Content existing TIDAK dimigrasi otomatis oleh keberadaan scene-ui V1 —
migrasi topic lama perlu plan + screenshot comparison + preview + export test
terpisah (lihat PLAN-14 sebagai contoh pilot migrasi header+badge, bukan
migrasi penuh body).

**✅ DO:**
- gunakan `IntroHeaderMorphV1`, `ActBadgeNavigatorV1`, `ContentBodyV1`, atau
  `SceneChromeV1` untuk portrait standard sesuai kriteria di atas;
- deklarasikan `PHASES` sekali di `data.js`, lalu pass langsung ke
  `ActBadgeNavigatorV1`/`navigator` prop — jangan duplikasi struktur badge;
- gunakan local coordinate `ContentBodyV1` (0,0 = `body.x`/`body.y`) untuk
  panel utama, bukan koordinat canvas absolut;
- aktifkan `debug={true}` (`SceneSafeAreaDebugV1`, lewat `SceneChromeV1` atau
  langsung) sementara saat layout pertama kali dibuat, matikan sebelum export;
- tulis version scene shell (`V1` atau `custom`) di plan topic (`_docs/TOPIC_PLAN.md`).

**❌ DON'T:**
- jangan copy-paste SVG header/badge dari topic lain — pakai V1 atau opt-out
  eksplisit;
- jangan menaruh panel besar pada koordinat global header/navigator (y di
  bawah `layout.body.y` saja untuk children `ContentBodyV1`);
- jangan memakai clip-path untuk menyembunyikan collision layout — perbaiki
  posisinya, bukan menutupinya;
- jangan membuat gating `showIntro` kedua yang menghilangkan header hasil
  morph V1 selain lewat prop `visible`/`progress` yang sudah disediakan;
- jangan memodifikasi file di `src/shared/scene-ui/v1/` untuk kebutuhan satu
  topic yang sebenarnya custom — tambah `v2/` baru kalau breaking, atau pass
  prop optional (lihat aturan versioning di README scene-ui) kalau non-breaking.

---

### 2. Pre-Planning Checklist (Wajib Sebelum Coding)

Langkah yang WAJIB selesai sebelum menyentuh `Animation.jsx`:

```
[ ] 0. CONTENT STATE & SERIES IDENTITY (WAJIB sebelum storyboard — khusus topic request/response atau bertingkat)
    [ ] 0.1. Isi tabel Content State Contract (client awal → transit → service → client akhir) — lihat §1.M
    [ ] 0.2. Isi preflight Series Identity Contract (seri, kategori, palette Title A Biru/Cyan + Title B Hijau, header reference) — lihat §1.Q
    [ ] 0.3. Untuk tiap method/aksi, jawab 4 pertanyaan Method Visualization Contract sebelum lanjut — lihat §1.N

[ ] 1. STORYBOARD NARATIF
    [ ] 1.1. Tulis deskripsi setiap Act (max 4 Act): siapa, di mana, apa yang terjadi
    [ ] 1.2. Validasi analogi vs akurasi teknis (tanya "apakah ini benar?")
    [ ] 1.2b. Validasi arah/sifat aktor analogi (one-way vs two-way, aktif vs pasif) — lihat §1.H
    [ ] 1.3. Tandai momen cause → effect di setiap beat
    [ ] 1.4. Definisikan: elemen apa yang persist antar-Act
    [ ] 1.5. Untuk setiap elemen baru yang muncul, tandai sumber/konteks asalnya (lihat §1.E)

[ ] 2. AUDIT ELEMEN VISUAL
    [ ] 2.1. List semua elemen visual topic (karakter, benda, badge, teks)
    [ ] 2.2. Kategorikan per elemen: inline SVG atau icon PNG
         Inline SVG jika: ada animasi internal (rotasi, buka/tutup, ekspresi ganti)
         Icon PNG jika: statis atau maksimal 2 varian (open/closed)    [ ] 2.3. Audit tambahan: Badge/TextCard/SpeechBubble → perlu prop icon?
    [ ] 2.4. Audit visual noise: tandai elemen dekoratif yang tidak membantu narasi — lihat §1.I

[ ] 3. ICON PLANNING (WAJIB sebelum generate satupun PNG)
    [ ] 3.1. Tulis draf icons.json LENGKAP (semua batch, semua slot)
    [ ] 3.2. Tentukan sumber setiap icon: chatgpt atau download
    [ ] 3.3. Rencanakan batch layout: grid 2×4, slot-8 selalu [EMPTY]
    [ ] 3.4. Tulis prompt ChatGPT untuk setiap batch

[ ] 4. LAYOUT PLANNING
    [ ] 4.0. Pilih scene shell: scene-ui V1 (default portrait standar) atau
         tulis opt-out custom (alasan, layout map, safe-zone pengganti) —
         lihat §1.S
    [ ] 4.0b. Kalau pakai V1: pastikan jumlah `PHASES` cocok dengan jumlah
         dot navigator, tentukan `titleSegments`/`categorySegments` (color
         identity), tentukan root content dan local coordinate system,
         aktifkan `debug` safe-area saat layout pertama dibuat — lihat §1.S
    [ ] 4.1. Bagi canvas ke zona per aktor (lihat template di §5)
    [ ] 4.2. Assign Y range kasar per zona (bukan pixel presisi, tapi range)
    [ ] 4.3. Identifikasi elemen yang bisa tampil bersamaan → cek collision Y
    [ ] 4.4. Definisikan FlowchartSpine: semua node + semua waypoint path (termasuk Act 1)
    [ ] 4.5. Untuk node intermediary, rancang visual "keputusan routing"-nya — lihat §1.L
    [ ] 4.6. Untuk teks yang merujuk elemen bergerak, rencanakan posisi relatif — lihat §1.K
    [ ] 4.7. Buat diagram zona vertikal + catat bounding box objek terbesar — lihat §1.R

[ ] 5. CAPTION & TEKS PLANNING
    [ ] 5.1. Tulis semua caption (≤5 kata, deklaratif, tanpa emoji, tanpa tanda tanya — hard rule)
    [ ] 5.2. Map setiap caption ke elemen visual yang dibahas (bukan ke Act, tapi ke elemen)
    [ ] 5.3. Verifikasi: caption muncul SETELAH visual context ada di layar

[ ] 6. ACT STRUCTURE
    [ ] 6.1. Definisikan durasi per Act (total 40-60s, distribusi wajar)
    [ ] 6.2. Per elemen: kapan popIn, kapan popOut — TIDAK BOLEH ada elemen tanpa popOut, termasuk elemen yang sudah "sampai tujuan"
    [ ] 6.3. Cek: ada buffer nganggur > 0.5s yang bisa dipangkas?
    [ ] 6.4. Cek konsistensi arah gerak tiap elemen terhadap status naratifnya — lihat §1.J

[ ] 7. CONTINUITY & ACT DESIGN AUDIT (khusus topic request/response)
    [ ] 7.1. Cek tidak ada pop-out request tanpa objek penghubung di sisi tujuan — lihat §1.O
    [ ] 7.2. Bandingkan tiap jeda terhadap hold budget default; tulis alasan kalau melebihi — lihat §1.O
    [ ] 7.3. Pastikan tiap Act punya entry state dan exit state yang eksplisit — lihat §1.P
    [ ] 7.4. Cek tidak ada epilog daftar-method yang sebenarnya bisa jadi action dari client — lihat §1.P

[ ] 8. SCENE SHELL REVIEW (kalau pakai scene-ui V1, lihat §1.S)
    [ ] 8.1. Header (`IntroHeaderMorphV1`) tetap terlihat setelah morph
         (`progress=1`), tidak invisible/kepotong
    [ ] 8.2. Badge dan SEMUA dot (`ActBadgeNavigatorV1`) terlihat penuh pada
         setiap Act, termasuk judul Act terpanjang (tidak tumpah keluar rect)
    [ ] 8.3. Content (`ContentBodyV1`) tidak menutupi subtitle/badge di frame manapun
    [ ] 8.4. Debug overlay (`SceneSafeAreaDebugV1` / `debug` prop) mati sebelum export
    [ ] 8.5. Tidak ada duplicate header/badge inline selain yang dirender oleh V1
```

---
### 3. Execution Order (Urutan Wajib Saat Coding)

Setelah pre-planning selesai, eksekusi kode wajib dalam urutan ini:

```
[ ] 1. data.js (PERTAMA)
    → Semua string constants (caption, label, tease)
    → PHASES array (id, badge, caption, duration)
    → Color palette references
    → Tidak boleh ada magic string di Animation.jsx

[ ] 2. manifest.js
    → Metadata topic (id, title, category, duration)

[ ] 3. icons/ folder
    → 3a. Buat folder icons/
    → 3b. Generate default-icon.png (placeholder lokal, bukan AI-generate)
    → 3c. Tulis icons/icons.json (copy dari plan di Pre-Planning §3.1)
    → 3d. Tulis icons/loader.js dengan fallback ke default-icon.png
           TANPA import icon asli (icon asli belum ada — komen sebagai placeholder)
    → 3e. Compile check (npx vite build atau esbuild isolated)

[ ] 4. Generate icon PNG (manual via ChatGPT extension)
    → Per batch: generate → crop → simpan ke icons/
    → Update loader.js: uncomment import per icon yang sudah ada PNG-nya
    → Compile check setelah setiap batch
[ ] 5. Animation.jsx — URUTAN INTERNAL:
    → 5a. State declarations (semua useState)
    → 5b. Ref declarations (semua useRef)
    → 5c. Helper functions (triggerBurst, triggerFlash, popIn, popOut, dll)
    → 5d. Komponen kecil (PathLabel, IconCaption, FlowchartSpine, NodeLabel, dll)
    → 5e. Komponen utama (BrowserWindow, ServerBuilding, Envelope, dst)
    → 5f. Timeline (GSAP, per Act, dalam urutan Act)
    → 5g. JSX render (dalam urutan layer: background → path → elements → effects)

[ ] 6. caption.md
    → Narasi/caption untuk video export

[ ] 7. _docs/TOPIC_PLAN.md (jika belum ada)
    → Copy storyboard + layout plan dari Pre-Planning ke file ini
    → Ini referensi untuk revisit kalau ada perubahan besar

[ ] 8. DEAD FIELD AUDIT (sebelum dianggap selesai)
    → Cross-check semua field di data.js terhadap penggunaan di Animation.jsx
    → Beri komentar `// TODO: belum dirender` untuk field yang sengaja belum dipakai
    → Lihat §1.G
```

---

### 4. Artefak Wajib (Mandatory File List)

Setiap topic WAJIB punya semua file berikut sebelum dianggap "selesai":
| File | Lokasi | Dibuat kapan | Catatan |
|---|---|---|---|
| `data.js` | `src/content/<topic>/` | Sebelum Animation.jsx | Semua string constants + PHASES, sudah lolos dead field audit |
| `manifest.js` | `src/content/<topic>/` | Sebelum Animation.jsx | Metadata topic |
| `Animation.jsx` | `src/content/<topic>/` | Setelah data.js + icons/ | Main animation |
| `caption.md` | `src/content/<topic>/` | Setelah animasi jalan | Narasi video |
| `icons/icons.json` | `src/content/<topic>/icons/` | Sebelum generate PNG | Full icon plan |
| `icons/default-icon.png` | `src/content/<topic>/icons/` | Sebelum loader.js | Placeholder lokal |
| `icons/loader.js` | `src/content/<topic>/icons/` | Setelah icons.json | Export getIcon() |
| `_docs/TOPIC_PLAN.md` | `src/content/<topic>/_docs/` | Sebelum coding | Storyboard + layout, termasuk hasil validasi analogi (§1.H) |

---

### 5. Template Layout Zona Canvas

Template ini dipakai di Pre-Planning §4 untuk assign zona per aktor:

```
Canvas: 820 x 1340 px

┌────────────────────────────────────┐
│  CLIENT ZONE (y: 0 – 400)          │  ← Browser, user actions, request compose
│  Warna: COLORS.CLIENT (biru)       │
├────────────────────────────────────┤
│  NETWORK ZONE (y: 400 – 800)       │  ← DNS, routing, in-transit
│  Warna: COLORS.NETWORK (cyan)      │
├────────────────────────────────────┤
│  SERVER ZONE (y: 800 – 1200)       │  ← Web server, processing, response
│  Warna: COLORS.SERVER (oranye)     │
└────────────────────────────────────┘
  y: 1200–1340 → reserved (progress bar, tease badge)
```
FlowchartSpine nodes (titik referensi, bisa disesuaikan per topic):
- Browser node: `(410, 260)` — center CLIENT zone atas
- DNS node: `(610, 620)` — kanan NETWORK zone
- Server node: `(410, 950)` — center SERVER zone

---

### 6. Contoh Buruk vs Contoh Baik (dari Kasus Nyata)

#### 6.1 — Analogi yang Tervalidasi (§1.A, §1.H)

**❌ Contoh buruk (`14-http-request-response` awal):**
> "Browser = Tukang Pos" — analogi ini keliru karena tukang pos bersifat
> one-way (antar surat lalu selesai), sedangkan browser bersifat two-way
> (mengirim request DAN menerima response)

**✅ Contoh baik (setelah revisi-11):**
> "Browser kirim surat, bukan comot langsung" — browser diposisikan sebagai
> pengirim yang juga menunggu balasan, bukan kurir yang tugasnya selesai
> begitu surat terkirim

---

#### 6.2 — Caption Timing (§1.D)

**❌ Contoh buruk:**
> `ENVELOPE_SEALED_CAPTION = 'Surat siap! ✉️'` — muncul saat amplop baru
> disegel di Act 1, padahal perjalanan masih panjang (DNS → server → response)
**✅ Contoh baik:**
> `ENVELOPE_SEALED_CAPTION = 'Surat berangkat!'` — kata "berangkat" menandakan
> ini awal perjalanan, bukan akhir

---

#### 6.3 — Layout Collision (§1.C)

**❌ Contoh buruk (sebelum revisi-08):**
> 8 elemen tumpuk vertikal di layar bersamaan saat Act 1 dan "Nulis Surat"
> bergabung — hookBubble, hookRevealCard, hookCliffhangerBadge masih tampil
> saat methodBadge, addressLabel, dll. baru muncul

**✅ Contoh baik (setelah revisi-08):**
> hookBubble di-popOut di t+5.0 (bersamaan hookRevealCard muncul),
> hookRevealCard di-popOut di t+7.1 — layar bersih sebelum "Nulis Surat" mulai

---

#### 6.4 — Path Connectivity (§1.F)

**❌ Contoh buruk (sebelum revisi-12):**
> `FORWARD_POINTS` dimulai dari Browser → DNS langsung, tidak ada segmen
> "Browser → Amplop Act 1" — penonton tidak melihat benang saat Act 1

**✅ Contoh baik (setelah revisi-12):**
> `FORWARD_POINTS` 4 titik: Browser(410,260) → Amplop(410,700) → DNS(610,620)
> → Server(410,900) — `forwardPathPct` mulai dari 0→0.33 di Act 1, nyambung
> terus ke Act 2

---
#### 6.5 — Arah Elemen vs Narasi (§1.J)

**❌ Contoh buruk (sebelum revisi-14):**
> `reqEnvelope` morph naik ke y=330 setelah sebelumnya amplop turun ke y=700
> — terlihat amplop "balik ke browser" padahal seharusnya sedang berangkat

**✅ Contoh baik (setelah revisi-14):**
> Default `reqEnvelopePos = {x:410, y:700}`, amplop diam di posisi landed
> tanpa morph naik — konsisten dengan narasi "surat sedang dipersiapkan
> untuk berangkat dari posisi yang sama dengan saat landing"

---

#### 6.6 — Dead Field (§1.G)

**❌ Contoh buruk (revisi-10):**
> `PHASES[].caption` dideklarasikan lengkap di `data.js` untuk semua phase,
> tapi tidak pernah ada satupun komponen yang membaca field ini di
> `Animation.jsx` — field jadi dead code tanpa penanda apapun

**✅ Contoh baik:**
> Field yang belum dipakai diberi komentar eksplisit
> `caption: '...', // TODO: belum dirender, disiapkan untuk fitur caption-per-phase`
> — atau field dihapus kalau memang tidak ada rencana pemakaian

---
#### 6.7 — Visual Noise (§1.I)

**❌ Contoh buruk (revisi-13):**
> Browser dan server diberi wajah/ekspresi kartun yang tidak berkontribusi
> ke pemahaman proses HTTP request — malah mengalihkan perhatian dari alur
> teknis. Rect overlay pintu ditaruh di atas PNG server-building, mengaburkan
> bentuk gedung aslinya

**✅ Contoh baik:**
> Server-building ditampilkan sebagai bentuk arsitektural yang jelas tanpa
> overlay yang konflik; ekspresi/wajah dihapus dari objek non-karakter,
> fokus visual dikembalikan ke proses (permintaan masuk → diproses → respons keluar)

---

#### 6.8 — Node Intermediary (§1.L)

**❌ Contoh buruk (revisi-14):**
> Node DNS hanya berupa label teks statis "DNS" — tidak ada visual apapun
> yang menunjukkan bahwa DNS sedang "memutuskan" alamat IP server mana yang
> dituju

**✅ Contoh baik:**
> Saat proses DNS lookup berlangsung, salah satu cabang path dari node DNS
> menyala/highlight menuju server yang dipilih, disertai caption singkat
> yang menjelaskan keputusan itu (mis. "DNS temukan alamat server")

---

### Referensi Silang

- `06-icon-generation.md` — detail lengkap proses generate & batch icon
- `05-svg-text-guide.md` — formula collision teks & styling SVG text, zona
  scene-ui V1 & local coordinate
- `04-referensi-gsap.md` — cara topic men-drive scene-ui V1 (progress/activeIndex)
- `03-tutorial-buat-topic-baru.md` — alur keseluruhan pembuatan topic baru,
  termasuk langkah "Pilih Scene Shell"
- `01-architecture.md` — diagram alur data.js → Animation.jsx → scene-ui V1 → SVG
- `src/shared/scene-ui/README.md` — API lengkap scene-ui V1 (props, quick-start, versioning)
- `docs/plan/PLAN-12-SHARED-SCENE-COMPONENTS-V1.md` — rationale & kontrak lengkap tiap component V1
- `docs/plan/PLAN-13-INTEGRASI-SCENE-UI-V1-KE-STANDAR.md` — keputusan default/opt-out scene-ui V1 (§1.S)
- `PROJECT_STRUCTURE.md` — standar penomoran task hierarki unlimited yang dipakai di planning

Dokumen ini digabung dari `docs/plan/PLAN-09-standar-pembuatan-konten.md`
dan `docs/plan/PLAN-10-supplement-09-revisi-lanjut.md`, disusun dari analisis
14 revisi topic `14-http-request-response` (2026-09-09 s/d 2026-09-10).

Section §1.M–§1.R dan checklist terkait (§2 poin 0, 4.7, 7) ditambahkan dari
`docs/plan/PLAN-11-REST-API-RETROSPEKTIF-STANDAR.md`, disusun dari analisis
retrospektif revisi 04–07 topic `17-rest-api` — fokus pada state contract,
method-as-object, continuity/no-teleport, series identity, dan safe-zone
layout untuk topic request/response.

