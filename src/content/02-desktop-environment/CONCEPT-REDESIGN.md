# Redesign Konsep — Desktop Environment Animation

Status: **DRAFT DISETUJUI ARAHNYA**, belum dieksekusi ke kode.
Tujuan: dari "bandingin DE by the numbers" (RAM/CPU/Custom score) → jadi
**persona matching**, biar orang awam langsung connect "ini gue banget".

---

## 1. Konsep inti

> "Linux itu bukan satu 'wajah'. Sama kayak Android — Samsung, Xiaomi, Pixel
> beda banget rasanya walau 'sama-sama Android'. Nih, 4 tipe pengguna Linux —
> kamu yang mana?"

Ganti dari "GNOME vs KDE vs XFCE vs i3, apa bedanya?" (abstrak, teknis) jadi
kuis-implisit: 4 persona, orang nonton sambil nebak "gue masuk yang mana".

---

## 2. Mapping Persona per DE

| DE | Persona | Kenapa relate |
|---|---|---|
| GNOME | "Pindahan dari Mac, mau yang simpel & rapi" | Clean, minim distraksi, mirip macOS workflow |
| KDE Plasma | "Doyan ngoprek, pengen semua bisa diatur" | Power-user, tweak-everything |
| XFCE | "Laptop udah 5-6 tahun, RAM 4GB, takut lemot" | Ringan, hidup buat hardware jadul |
| i3 | "Developer/keyboard-warrior, gak sabaran pake mouse" | Tiling, super efisien, tapi curam belajarnya |

---

## 3. Hook baru

Bukan lagi lempar pertanyaan teknis di awal — langsung reveal ke-4 icon logo
**GEDE** (bukan preview kecil 24px kayak sekarang) sebagai "menu pilihan"
visual, sambil narasi analogi Android di atas jalan.

Icon logo jadi hero reveal pertama kali di video — momen "wah mirip aslinya"
harus kepake di sini, bukan cuma nempel jadi bullet kecil kayak sekarang.

---

## 4. Struktur tiap Act (reframe beat lama: setup → tension → insight → payoff)

- **Setup** — bukan nama DE doang, langsung persona line, contoh XFCE:
  *"Kamu tipe yang mikir 'laptop gue udah tua, jangan sampe tambah lemot'?"*
  Icon logo DE masuk sebagai hero reveal (scale bounce besar), baru menyusut
  jadi badge kecil begitu beat pindah ke tension.

- **Tension** — bukan bar RAM ngisi mulus, tapi **konsekuensi nyata**:
  visual laptop "keberatan" / kipas mulai kenceng + heat-shimmer / baterai
  ngedrop cepat. Animasi metafora fisik, bukan dashboard monitoring.

- **Insight** — before/after tampilan (ganti dial angka 0-100): split-wipe
  dari "default polos" → "abis di-custom" dalam 1-2 detik. Orang lihat
  langsung bedanya secara visual, gak disuruh baca angka "85/100".

- **Payoff** — tag persona besar, cliffhanger ke Act berikutnya:
  *"Kalau ini kamu → XFCE jawabannya."*

---

## 5. Reframe 3 metric (kombinasi skenario + analogi + visual)

- **RAM** → skenario nyata + analogi: "jatah kursi di laptop kamu, abis
  dimakan sebelum buka apa-apa sama sekali". Visual kursi/beban dipakai,
  bukan block bar teknis kayak sekarang. Angka RAM tetap ada tapi kecil,
  bukan fokus utama.

- **CPU** → konsekuensi langsung yang orang awam beneran ngeh: kipas laptop
  & baterai. Pakai heat-shimmer + baterai icon ngedrop sebagai elemen utama;
  persentase CPU tetap tampil tapi ukurannya sekunder.

- **Customization** → visual before-after langsung (paling kuat buat orang
  awam, gak butuh angka sama sekali). Ganti dial/gauge 0-100 yang sekarang.

---

## 6. Icon & motion treatment (prinsip umum)

- Logo DE = **hero reveal**: masuk gede (scale bounce ~80-120px) di awal
  tiap Act, baru menyusut jadi badge kecil begitu beat pindah ke tension.
  Sebelumnya logo cuma dipakai kecil (18-24px) sebagai dekorasi pojok —
  ini dibalik jadi elemen utama minimal sekali per Act.
- "Mengisi angka" (bar naik, dial muter, blok jatuh) diganti animasi
  metafora fisik (beban, panas, before-after wipe) supaya kerasa hidup,
  bukan dashboard.
- Closing race **dipertahankan konsepnya** (visual udah kuat), tapi caption
  diganti ke bahasa "makin ringan = makin gesit dipake", bukan lagi
  ngomongin angka RAM mentah.

---

## 7. Yang TIDAK berubah

- Struktur timeline besar: Intro → Hook → 4x Act → Closing (race track).
- Sistem `getIcon()` + fallback aman kalau PNG belum ke-generate.
- 14 icon yang sudah di-generate tetap dipakai, cuma ukuran & momen
  pemakaiannya yang berubah (hero reveal vs badge kecil).

---

## 8. Next step

Setelah file ini direview & di-ACC, lanjut ke:
1. Rewrite copy/script di `data.js` (HOOK, PHASES, DE_DATA — persona lines).
2. Rombak motion di `Animation.jsx` sesuai §4 dan §6 di atas.

---

## 9. Analisis Teknis — Animasi & Icon (ide liar, biar "rame" & playful)

Prinsip dasar: makin banyak elemen di layar yang **selalu bergerak dikit**
(idle wiggle, breathing scale, dsb), makin hidup kesannya buat orang awam —
layar yang "diem kaku" itu yang bikin ngebosenin, bukan kurang detail.

### 9.1 Constraint wajib (jangan dilanggar)

Semua motion — termasuk ide liar di bawah — **harus fungsi murni dari
`elapsed`** (waktu master timeline), BUKAN `gsap.to(..., {repeat:-1})`
berdiri sendiri. Alasan: export video seek frame-per-frame ke timeline,
tween yang hidup di luar timeline gak ke-capture bener. Pola yang sudah
dipakai sekarang (fan CPU, cursor XFCE, border blink i3) jadi acuan.

Untuk efek "pseudo-random" (confetti, speed-lines, particle scatter) —
JANGAN pakai `Math.random()`. Pakai kombinasi `Math.sin(elapsed * freqA + i)`
dengan `i` = index partikel sebagai seed, biar hasilnya konsisten tiap
timeline di-seek ulang (sama kayak pola `typeText` yang udah ada, delay
karakter pakai sinus bukan random).

### 9.2 Trik konkret per elemen

- **Icon hero reveal — squash & stretch, bukan scale polos.** Masuk dengan
  keyframe: scaleY 0.6/scaleX 1.3 (gepeng, "landing") → overshoot scaleY
  1.15/scaleX 0.9 → settle 1/1 pakai elastic. Ini prinsip animasi klasik
  ("squash & stretch"), jauh lebih hidup dibanding scale linear.

- **Iris/circle-reveal buat icon masuk** — pakai `<clipPath>` lingkaran yang
  radiusnya di-tween dari 0 → full, dikombinasi sama squash-stretch di atas.
  Kesannya kayak "muncul dari titik", bukan cuma fade/scale.

- **Idle wiggle universal** — SEMUA icon/badge kecil yang lagi diem (bukan
  cuma yang sekarang punya ambient motion) dikasih rotate osilasi tipis:
  `rotate(Math.sin(elapsed * 1.4 + seed) * 3)`. `seed` = index/posisi icon
  biar antar-icon gak sinkron gerakannya (berasa organik, bukan robot).

- **Confetti/sparkle burst** di beat `insight` (selain Starburst yang
  sekarang) — komponen baru, ~10-14 partikel kecil (persegi/lingkaran kecil
  warna-warni), posisi & rotasi dihitung dari `sin(elapsed*freq + i)` per
  partikel `i`, opacity fade out setelah beberapa detik dari trigger time
  (pola: `Math.max(0, 1 - (elapsed - triggerTime) / 0.6)`).

- **Impact flash (1-2 frame putih)** — di titik "aha"/payoff, kasih flash
  putih tipis (opacity spike lalu decay cepat) nutup seluruh Act card.
  Trik "juice" klasik di game/motion design — kecil tapi kerasa banget
  efek "nendang"-nya. Fungsi decay: `Math.max(0, 1 - (elapsed-t0)/0.15)`.

- **Camera micro-shake** di beat insight — translate group panggung Act
  pakai offset kecil `sin(elapsed*40)*2` yang di-decay dalam ~0.2 detik
  dari trigger, sama pola kayak envelope di atas.

- **Speed lines di belakang icon hero reveal** — beberapa garis pendek
  memancar dari titik pusat icon, muncul cepat lalu fade (~0.25 detik),
  arah garis fix (radial), cuma opacity yang di-tween. Efek komik, kesan
  "energik", murah secara render (cuma `<line>`, gak butuh filter berat).

- **Weight-tilt buat RAM** (ganti block-jatuh) — ganti metafora jadi laptop
  kecil (bisa dari shape sederhana, gak perlu icon baru) yang perlahan
  "miring"/"tenggelam dikit" seiring `ramAnim` naik — pakai rotate + translateY
  kecil, bukan block stack. Dikombinasi kursi-kursi kecil yang numpuk di atas
  laptop (analogi "jatah kursi abis dimakan") — reuse pola block sekarang
  tapi bentuknya kursi kecil, jatuhnya lebih springy (overshoot dikit pas landing).

- **Heat-shimmer buat CPU** — SVG filter `feTurbulence` + `feDisplacementMap`
  di atas ikon kipas, `baseFrequency` & `scale` filter naik sesuai `cpuAnim`.
  ⚠️ Filter ini lumayan berat buat render per-frame saat export — kalau lag,
  fallback ke versi murah: cuma 2-3 garis wavy tipis (`<path>` dengan `d`
  di-tween pakai sin, bukan filter beneran) di atas ikon kipas.

- **Battery-drain buat CPU (opsional tambahan/pengganti)** — ikon baterai
  simpel (bisa SVG native, gak perlu generate PNG baru) dengan segmen yang
  "berkurang" seiring cpuAnim naik, warna segmen terakhir jadi merah +
  sedikit blink kalau cpuAnim tinggi. Lebih universal dipahami dibanding
  angka persen CPU.

- **Before-after wipe pakai "tangan kursor" literal** — buat insight
  customization: cursor icon kecil "nyapu" dari kiri ke kanan di atas
  clip-path yang ngungkap versi "abis di-custom", gaya swipe-reveal yang
  familiar dari konten short-form (TikTok/Reels transition).


---

## 10. Transisi antar-Act (perpindahan pembahasan) — biar smooth & sinematik

Kondisi sekarang di kode (`Animation.jsx`, blok ACTS): slide masuk dari kanan
`actSlideX: 220 → 0` (`power3.out`, `TRANS=0.32s`), slide keluar `0 → -220`
(`power2.in`). Udah lumayan ("berasa pindah channel", bukan hard-cut), tapi
masih lurus horizontal doang — bisa dibikin jauh lebih hidup tanpa nambah
durasi/mengganggu pacing.

- **Arc motion, bukan garis lurus** — tambah komponen Y kecil ke
  `slideInObj`/`slideOutObj` (`y: sin(progress * PI) * -18` misalnya, progress
  dari tween `onUpdate`), jadi Act baru masuk sambil "melengkung" dikit
  (kayak kartu dilempar), bukan geser lurus kaku. Prinsip animasi klasik:
  **arc** — nyaris semua gerakan natural itu melengkung, bukan linear.

- **Anticipation sebelum slide-out** — sebelum `outStart`, kasih beat super
  singkat (~0.1s) di mana Act yang mau keluar "narik dikit" ke arah
  berlawanan dulu (`x: +12`) sebelum meluncur ke `-220`. Prinsip **anticipation**:
  penonton kebiasa lihat gerakan yang "ancang-ancang dulu", kerasa lebih
  bertenaga dibanding langsung meluncur dari diam.

- **Speed-lines pas transisi**, bukan cuma pas icon reveal — beberapa garis
  horizontal pendek yang muncul barengan `outStart`/slide-in, opacity
  di-tween pakai envelope decay yang sama polanya kayak yang udah dipakai di
  §9.2, arah sesuai arah slide (kiri buat keluar, kanan buat masuk). Efek
  komik "whoosh" yang kelihatan, bukan cuma kedengeran dari SFX doang.

- **Color-wash cross-fade di background** — tint background Act (bukan cuma
  border/badge) transisi dari warna `DE_DATA[i].color` → `DE_DATA[i+1].color`
  selama `TRANS`, pakai `onUpdate` yang sama kayak `slideOutObj`/`slideInObj`
  (satu progress value, dipetakan ke interpolasi warna hex). Efeknya: warna
  identitas tiap DE ikut "mengalir" ke Act berikutnya, bukan cuma cut warna.

- **Match-cut icon logo** — logo DE kecil yang ada di bottom tabs (§6, badge
  175x100) "terbang" naik jadi hero reveal Act berikutnya, alih-alih icon
  hero muncul dari titik netral. Titik awal tween = posisi tab aktif
  (`translate(idx*185, 750)` di kode sekarang), titik akhir = posisi hero
  reveal. Ini prinsip **continuity/match-cut** dari film editing — mata
  penonton "mengikuti" satu elemen yang sama pindah peran, jadi transisi
  kerasa nyambung padahal konteksnya ganti total.


- **Parallax layer waktu slide** — kalau nanti ada elemen dekoratif di
  background (bukan cuma konten utama), gerakin lebih lambat dari konten
  (`x: 220 * 0.4 → 0` misalnya, bukan `220 → 0` penuh) selama transisi yang
  sama. Kedalaman visual murah tapi kerasa "sinematik" — dipisah dari
  progress transisi yang udah ada, bukan sistem baru.

- **Overlapping action di dalam satu Act** — bottom tab yang bakal aktif
  (`isActive` berikutnya) mulai nge-highlight/scale up **sedikit sebelum**
  Act-nya benar-benar mulai (misal di `t0 - 0.15`, overlap sama slide-out
  Act sebelumnya), bukan nunggu `setActIdx` persis di `t0`. Prinsip
  **overlapping action / follow-through**: gerakan gak berhenti-mulai
  serentak semua, ada elemen yang "duluan dikit" — kerasa lebih organik.

---

## 11. Ide liar tambahan (level lebih jauh, opsional bertahap)

Bagian ini murni brainstorm buat "lebih rame" — gak wajib semua dipakai,
pilih yang paling murah-vs-dampak dulu waktu eksekusi.

- **Rubber-band pop buat teks insight** — bukan cuma `insightPop` scale
  polos (§ ada di kode: `back.out(2)`), tambah overshoot horizontal dikit
  juga (`scaleX` beda timing dari `scaleY`, ala jelly) pas teks insight
  muncul. Squash & stretch versi teks/badge, bukan cuma icon.

- **Slot-machine counter buat angka RAM/CPU** — pas `metricObj` lagi nge-tween,
  digit angka terakhir sempat "loncat-loncat" dulu (beberapa angka acak-tapi-
  deterministik dari `sin(elapsed*freq)`) sebelum settle ke angka final,
  ala odometer/slot machine. Kesan "menghitung", bukan cuma angka berubah
  instan tiap frame.

- **Chromatic micro-glitch di beat tension** — 1-2 kali kedipan super singkat
  (~0.08s) di mana elemen metric card di-duplikat 2x dengan offset 1-2px
  warna merah/cyan (RGB split murah pakai `<use>` + `transform` offset),
  envelope decay cepat. Nunjukin "kok gini ya" secara visual tanpa perlu
  teks tambahan — dipakai super hemat (1x per Act max) biar gak norak.

- **Mascot reaction lebih ekspresif** — `Face` component sekarang cuma ganti
  mulut/mata. Tambah **jump squash** kecil (translateY + scaleY osilasi)
  pas `reaction` berubah (misal dari `neutral` ke `mindblown`), bukan cuma
  swap shape statis. Transisi ekspresi jadi punya "impact", bukan cut.

- **Confetti collision dengan dock icons** — extend ide confetti burst (§9.2):
  partikel yang lewat deket dock icon (posisi dock sudah ada di kode)
  "mantul" dikit (flip arah Y) seolah nabrak, murni dari perhitungan posisi
  vs `sin(elapsed...)` partikel, gak perlu physics engine beneran.

- **Idle "breathing" di seluruh card metric** — 3 card metric (RAM/CPU/Custom)
  dikasih scale osilasi super halus (`1 + sin(elapsed*0.8 + i*0.5)*0.006`)
  biar kartu-kartu itu berasa "napas" pelan terus-terusan, bukan objek mati
  yang cuma gerak pas ada tween aktif — nutup kesan statis diantara beat.

Prioritas eksekusi disaranin: §10 (transisi) dulu karena impact-nya kerasa
di **setiap** perpindahan Act (4-5x per video), baru §11 dipilih 2-3 item
yang paling murah render-nya buat nambah "rame" tanpa bikin export lag.

---

## 12. OPSI B — Polish Motion Ramai (1 jam, HIGH IMPACT)

Status setelah Phase 2: Semua fitur core sudah berjalan (hero reveal, persona
matching, before-after wipe, match-cut, color-wash, parallax, heat-shimmer,
weight-tilt). Build berhasil, tidak ada syntax error. 

**Sekarang pilih: ship as-is, atau tambah 3 motion polish yang kerasa di SETIAP
frame transisi?**

Opsi B menambahkan 3 fitur yang **HIGH IMPACT + CHEAP**: speed-lines (4x per
video), impact flash (4x per video), camera shake (4x per video). Total execution
time ~1 jam.

---

### 12.1 SPEED-LINES — Transisi Act (Swipe Parallax, §10)

**Timing & Placement:**
- Trigger: saat `transitionProgress` dimulai (`t = outStart`, speed-lines muncul)
- Duration: 0.3 detik (overlap dengan slide-out animation yg 0.32s)
- Arah: horizontal kanan (Act keluar ke kiri, lines tampil di foreground seolah "whoosh")
- Jumlah: 8-12 garis, random spacing vertikal, opacity staggered

**Implementation Detail:**

```javascript
// Di FOREGROUND LAYER, saat beat === 'payoff' atau transitionProgress > 0:
// Speed-lines yang muncul horizontal sebagai visual "whoosh"

// Trigger time: kapan transisi dimulai (dihitung pure dari elapsed)
const outStartTime = actStartTime + phase.duration - TRANS // kapan slide-out mulai
const timeSinceOutStart = elapsed - outStartTime
const speedLinesAge = Math.max(0, timeSinceOutStart) // 0 → 0.3s duration

// Fade: muncul cepat (0 → max 0.08s), hold, fade out (0.2 → 0.3s)
const speedLineOpacity = (speedLinesAge < 0.08) 
  ? speedLinesAge / 0.08 
  : Math.max(0, 1 - (speedLinesAge - 0.2) / 0.1)

// Positioning: 12 garis horizontal, spread di sepanjang height
// Pseudo-random via sin() dengan index i sebagai seed
const speedLinesCount = 12
const lines = Array.from({ length: speedLinesCount }).map((_, i) => {
  const lineY = VH * (i / speedLinesCount) + Math.sin(i * 0.8) * 20 // spacing + jitter
  const lineWidth = 60 + Math.sin(i * 1.3) * 20 // panjang garis bervariasi 40-80px
  const lineOpacity = speedLineOpacity * (0.8 - i * 0.04) // fade semakin ke bawah
  
  return {
    x1: VW - lineWidth,
    y1: lineY,
    x2: VW,
    y2: lineY,
    opacity: lineOpacity,
    strokeWidth: 2,
    stroke: currentDE.color
  }
})

// Render sebagai <g> yang ada hanya saat speedLinesAge > 0:
// <g opacity={speedLineOpacity}>
//   {lines.map((line, i) => <line key={i} {...line} />)}
// </g>
```

**Kesan yang diharapkan:**
- Orang lihat "swoosh" visual yang cocok sama timing SFX "transitions/swoosh-2"
- Kerasa lebih cinematic, bukan cuma slide lurus membosankan
- Short bursts pada setiap transisi (4x per video) = total motion ramai

---

### 12.2 IMPACT FLASH — Insight Beat (§9.2 Payoff)

**Timing & Placement:**
- Trigger: saat `setBeat('insight')` (t = t0 + 3.4s per Act)
- Duration: 0.15 detik (cepat, bukan distraksi)
- Spread: white/light overlay di atas seluruh ACT STAGE area (rect VW x 500px)
- Intensitas: opacity 0 → 0.4 → 0 (peak di 0.08s, decay cepat)

**Implementation Detail:**

```javascript
// Insight trigger time sudah di-track: insightTriggerTime
// Hitung age dari trigger moment:

const insightAge = Math.max(0, elapsed - insightTriggerTime)
const flashDuration = 0.15

// Envelope: cepat naik (0 → 0.08s), cepat turun (0.08 → 0.15s)
let flashOpacity = 0
if (insightAge < 0.08) {
  flashOpacity = (insightAge / 0.08) * 0.4 // ramp up to 40% white
} else if (insightAge < 0.15) {
  flashOpacity = 0.4 * (1 - (insightAge - 0.08) / 0.07) // decay
} else {
  flashOpacity = 0 // done
}

// Render sebagai overlay rect di atas insight card:
// {insightAge < 0.15 && (
//   <rect x={44} y={660} width={732} height={70} 
//     fill="#FFFFFF" opacity={flashOpacity} />
// )}
```

**Kesan yang diharapkan:**
- "Impact" classic dari game/motion design — sekecil apapun, kerasa banget
- Menandai momen "aha" secara visual tanpa perlu text effect
- 4x per video (1x per Act insight beat) = subtle tapi consistent

---

### 12.3 CAMERA MICRO-SHAKE — Insight Beat (§9.2 Tension)

**Timing & Placement:**
- Trigger: saat `setBeat('insight')` juga (simultaneous dengan impact flash)
- Duration: 0.2 detik (decay envelope)
- Amplitude: ±2px horizontal + ±1.5px vertical
- Target: translate entire FOREGROUND LAYER (selain background)

**Implementation Detail:**

```javascript
// Insight trigger time sama: insightTriggerTime
// Shake decay: mulai cepat (t=0-0.2s), semakin kecil

const shakeAge = Math.max(0, elapsed - insightTriggerTime)
const shakeDuration = 0.2

// Decay envelope: linear fade dari 1 → 0
const shakeDecay = Math.max(0, 1 - (shakeAge / shakeDuration))

// Shake offset: sine wave frequency tinggi, tapi amplitude dipengaruhi decay
// freqX & freqY beda biar bukan perfectly circular
const shakeOffsetX = Math.sin(elapsed * 40) * 2 * shakeDecay
const shakeOffsetY = Math.sin(elapsed * 50 + 0.5) * 1.5 * shakeDecay

// Render: apply ke FOREGROUND LAYER <g> yang punya arc motion
// Existing transform: `translate(${arcX + parallaxFgX}, ${240 + arcY})`
// Tambah shake: `translate(${arcX + parallaxFgX + shakeOffsetX}, ${240 + arcY + shakeOffsetY})`

// ATAU conditional:
// const fgTranslateX = arcX + parallaxFgX + (shakeAge < 0.2 ? shakeOffsetX : 0)
// const fgTranslateY = 240 + arcY + (shakeAge < 0.2 ? shakeOffsetY : 0)
```

**Kesan yang diharapkan:**
- Micro-vibration yang menunjukkan "energy release" saat insight moment
- Dipadu speed-lines + impact flash = "triple play" kuat tapi subtle
- Decay cepat = gak mengganggu komposisi visual, pure accent

---

### 12.4 Implementation Checklist (Opsi B)

- [ ] **Speed-lines di transisi**
  - [ ] Compute `outStartTime` per Act (t0 + phase.duration - TRANS)
  - [ ] Track `timeSinceOutStart` dalam render logic
  - [ ] Generate 12 lines via pseudo-random sin() seed
  - [ ] Render hanya saat transitionProgress active
  - [ ] Test timing cocok dengan SFX "whoosh"

- [ ] **Impact flash insight**
  - [ ] Reuse `insightTriggerTime` yg sudah ada
  - [ ] Compute flash envelope (0.08s up, 0.07s down)
  - [ ] Render white overlay rect opacity 0-0.4-0
  - [ ] Position: x=44, y=660, w=732, h=70 (above insight badge)

- [ ] **Camera micro-shake insight**
  - [ ] Compute shake decay envelope (0-0.2s linear)
  - [ ] Shake offset: sin(elapsed*40)*2*decay + sin(elapsed*50+0.5)*1.5*decay
  - [ ] Apply ke FOREGROUND LAYER transform (tambahin offset X/Y)
  - [ ] Verify gak bentrok sama arc motion existing

- [ ] **Test & Verify**
  - [ ] Build compile ✓ (no syntax error)
  - [ ] Timeline local preview: lihat speed-lines + flash + shake per Act ✓
  - [ ] Video export 1 Act: frame-by-frame check consistency
  - [ ] Audio sync: SFX swoosh cocok sama visual speed-lines timing

---

### 12.5 Alternative: Simpler Polish (30 min, jika Opsi B terlalu heavy)

Jika 1 jam terlalu lama atau render lag, prioritas:
1. **Speed-lines doang** (30 min) — kerasa di 4 transisi
2. **Buat, test, deploy**
3. **Impact flash + shake** bisa defer ke patch selanjutnya

Reasoning: speed-lines paling visible, impact flash + shake lebih subtle.

---

### 12.6 After Opsi B: Next Micro-Polish (§11 ideas, bertahap)

Kalau semua 3 ✅, bisa lanjut ke:
- Slot machine counter digit (15 min)
- Overlapping action tab highlight (10 min)
- Rubber-band jelly pop teks insight (10 min)

Tapi udah jauh di atas MVP yang solid di Phase 2 sekarang.
