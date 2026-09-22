# Plan Revamp: Storytelling + Motion — Desktop Environment

> Status: PLANNING (belum dieksekusi). Dokumen ini bukan bagian kontrak resmi
> topic (prefix `_docs/`), aman dihapus/diubah bebas.
>
> Konteks: revisi pertama (hook + 4 beat + closing) sudah jalan tapi masih
> terasa kaku — evaluasi user: **"terlalu biasa, cuma box, linear progress
> compare, ga ada storytelling menarik, minim motion, bosen, ga playful"**.
> Revisi kedua (dokumen ini): user minta **SEMUA bagian** diperkuat lagi —
> "dibuat lebih rame animasi flow motion nya, biar mata betah nontonnya".
> Jadi selain nambah motion PER elemen, dokumen ini menambahkan lapisan
> baru: **kepadatan & kesinambungan motion** supaya tidak ada momen yang
> kerasa "berhenti total" dari awal sampai akhir.

## 1. Diagnosis — Kenapa Masih Berasa "Kaku"

| Keluhan User | Akar Masalah di Versi Sekarang |
|---|---|
| "Cuma box" | Semua container masih `<rect rx=X>` — showcase card, metric card, comparison tab, closing card. Speech bubble & starburst cuma dipakai di 1-2 tempat, sisanya balik ke kotak. |
| "Linear progress compare" | RAM/CPU/Custom SELALU direpresentasikan sebagai bar horizontal yang mengisi dari kiri. 3 metric, 4 Act = 12 bar yang keliatan sama semua secara visual. |
| "Minim motion" | Animasi cuma: fade in/out (conditional render), bar tween sekali per Act, 1x pop insight badge. Tidak ada gerakan berkelanjutan, tidak ada elemen yang "hidup" saat idle di dalam 1 Act. |
| "Bosen, ga playful" | Tidak ada elemen yang related ke pengalaman nyata pakai DE (mockup desktop, kursor, window) — semua abstrak jadi angka & bar. Karakter (Face) statis, cuma nongol lalu diem. |
| **BARU:** "Mata gak betah nonton" | Bahkan setelah motion ditambah PER elemen, kalau tiap elemen cuma gerak sekali lalu diem, mata tetap kerasa "nunggu" di antara beat. Perlu lapisan motion AMBIENT yang jalan terus-menerus, terlepas dari beat mana yang lagi aktif. |

## 2. Prinsip Arah Baru

1. **Setiap Act ditonton lewat "layar mini"**, bukan dibaca lewat angka.
   Mockup desktop kecil yang keliatan beda secara visual tiap DE (dock,
   window, wallpaper style).
2. **Metric = kejadian visual, bukan bar.** RAM/CPU/Custom tetap akurat
   (lihat `05-svg-text-guide.md`), tapi divariasikan per jenis data —
   jangan 3 bar horizontal identik.
3. **Selalu ada sesuatu yang bergerak**, bahkan saat "diam" — dock icon
   bergoyang pelan, kursor kedip, fan berputar.
4. **Transisi antar-Act ikut bercerita** — swipe/slide berlapis, berasa
   seperti "pindah channel", bukan hard-cut opacity.
5. **Payoff closing harus jadi momen, bukan rekap.** 1 visual dinamis
   (race/gauge), bukan 4 kartu diam.
6. **BARU — Aturan "Always-2":** di detik mana pun sepanjang animasi,
   minimal **2 lapisan motion berjalan bersamaan**:
   - **Layer beat** — motion yang mendorong cerita (block RAM jatuh,
     needle muter ke posisi baru, avatar lari).
   - **Layer ambient** — motion kecil yang jalan TERUS lepas dari beat
     mana yang aktif (fan tetap muter, dock icon tetap bob, kursor tetap
     kedip, garis background tetap drift pelan). Layer ambient TIDAK
     PERNAH mati selama Act itu tampil — ini yang bikin mata "betah",
     karena selalu ada micro-movement buat difokuskan walau beat utama
     lagi jeda nunggu caption dibaca.
   Konsekuensi teknis: setiap Act butuh minimal 1 `gsap.timeline({repeat:
   -1})` terpisah untuk ambient loop, hidup berdampingan dengan timeline
   beat utama, di-`kill()` bareng saat Act berganti (lihat §6 & §7).

## 3. Konsep Visual Utama — "Mini Desktop Mockup"

Mockup layar kecil (~600×260) yang benar-benar terlihat seperti tampilan
DE tersebut — bukan kartu nama+style+distro doang.

| DE | Wallpaper/BG | Dock/Taskbar | Window | Ambient (layer terus jalan) |
|---|---|---|---|---|
| GNOME | Gradient ungu-biru, `background-position` drift super pelan (`x: 0→-8, duration:6, yoyo, repeat:-1, ease:'sine.inOut'`) — kerasa "napas" | Dock bawah, icon bulat rapi, terpusat | 1 window rounded besar, shadow halus | Dock icon idle bob (`y: 0→-3, yoyo, repeat:-1`, stagger phase per icon biar gak serempak kaku); titik notifikasi kecil di pojok window nge-blink tiap ~2s |
| KDE | Gradient teal, widget kecil di pojok | Taskbar bawah PENUH (start menu + icon + systray) | 2-3 window bertumpuk, title bar warna beda | Jam widget systray detik-nya jalan beneran (angka `Math.floor(elapsed)%60`); ikon systray "aktivitas" (mis. update icon) muter pelan `rotation:360, duration:4, repeat:-1, ease:'none'` |
| XFCE | Warna solid flat | Taskbar tipis, icon kotak sederhana | 1 window kotak simpel | Kursor mouse kecil bergerak sendiri antar 2-3 titik acak-tapi-seeded (`power1.inOut`, loop) — kesan "dipakai ringan tanpa hambatan" |
| i3 | BG gelap solid | TIDAK ADA dock/cursor | Window membelah jadi grid (tiling) | Garis border window aktif berkedip warna aksen (`opacity 0.6↔1, duration:0.8, yoyo, repeat:-1`) — meniru border highlight window fokus di WM asli; angka workspace pojok kiri atas berganti sesekali |

Teknik render: shape sederhana (`rect`, `circle`, `path`) — ringan, tapi
SUSUNAN + AMBIENT MOTION yang bikin beda, bukan detail rendering.

## 4. Metric = Kejadian Visual + Jejak Gerak (Bukan 3 Bar Kembar)

Selain metafora beda per metric (di bawah), tiap metric SEKARANG juga
punya micro-motion susulan setelah tween utama selesai, supaya gak
"berhenti mati" begitu angka final tercapai — ini yang isi kuota
"layer ambient" metric.

### RAM → Stack blok yang jatuh & numpuk
Tiap ~15% RAM = 1 blok jatuh (`power2.in`) → impact squash-stretch
(scaleY 0.8→1, `back.out`) + micro shake (±2px, 2x) di blok terakhir
kalau berat (GNOME/KDE). **Susulan:** setelah numpuk selesai, tumpukan
blok idle "napas" pelan (`scaleY: 1→1.015`, `duration:1.6, yoyo,
repeat:-1`) — seolah masih "aktif dipakai", bukan properti statis.
Tambahkan 3-4 partikel debu kecil (`circle` r=2, opacity 0.6→0, y turun
sedikit) muncul PERSIS saat blok landing — reuse pola partikel sparkle
di §5.2 insight, jadi satu teknik dipakai 2 tempat.

### CPU → Fan/kipas berputar, kecepatan = beban
Fan (`path`/`polygon` 3-4 blade) muter kontinu (`rotation:360, repeat:-1,
ease:'none'`), durasi inverse dari nilai CPU. **Ini otomatis jadi layer
ambient** — jalan terus walau beat sudah pindah ke metric lain, TIDAK
di-kill sampai Act berganti. **Susulan tambahan:** motion-trail murah —
1 blade ghost (opacity 0.15, sedikit delay rotasi ~15°) mengikuti blade
utama, kasih kesan "muter cepat" tanpa perlu motion-blur filter berat.

### Customization → Dial/knob dengan overshoot
Jarum (needle) di busur setengah lingkaran berputar ke posisi skor.
**Bukan langsung berhenti presisi** — overshoot dulu lewat sedikit dari
target (`+8°`) baru settle balik (`back.out(1.4)` atau 2-step tween:
tween ke target+8°, lalu tween balik ke target dengan `elastic.out(1,
0.4)`) — kerasa seperti jarum speedometer fisik, bukan interpolasi
digital kaku. Icon tangan/obeng muncul sebentar seolah "mengatur".
**Susulan:** setelah settle, jarum idle jitter super halus (±1°,
random-seeded interval) — jarum analog beneran gak pernah diam sempurna.

## 5. Redesign Per-Section

### 5.1 Hook (tetap konsep sama, tambah motion + ambient layer)
- Typewriter effect untuk `HOOK.question` (tween integer index, `onUpdate`
  slice string) + `tick.wav` pelan tiap beberapa karakter.
- 4 badge DE diganti 4 mockup mini (versi 40×30 dari §3) yang masing-masing
  SUDAH bawa ambient motion versi mini-nya sendiri sejak awal muncul
  (dock GNOME mini tetap bob, fan CPU mini — kalau ditampilkan — tetap
  muter) — bukan cuma goyang generic `rotation:±2deg`, tapi ambient
  motion versi mini yang SAMA dengan yang dipakai di Act aslinya, biar
  hook terasa jadi "preview asli", bukan placeholder.
- Face `worried` idle: kepala miring (`rotation:-3→3, yoyo, repeat:-1,
  duration:1.2`) + kedipan mata (`scaleY:1→0.1→1` tiap ~3s acak-seeded)
  — 2 motion kecil berbeda ritme biar gak kerasa "muter di 1 loop terus".

### 5.2 Tiap Act — 4 Beat dengan Motion Berlapis & Overlap
Struktur `setup → tension → insight → payoff` dipertahankan (sesuai
`03-tutorial-buat-topic-baru.md`), tapi sekarang eksplisit: **ambient
layer dari beat sebelumnya TIDAK berhenti saat beat baru mulai** — motion
saling overlap/menumpuk, bukan stop-lalu-mulai-lagi:

| Beat | Motion beat (utama) | Ambient yang TETAP jalan dari beat sebelumnya |
|---|---|---|
| **setup** | Mockup slide-in dari samping (`x:VW→0, power3.out`). Dock/window icon stagger pop (+0.08s/icon, `back.out(1.7)`). | Background drift mockup (§3) mulai bareng slide-in, jangan nunggu icon selesai muncul dulu. |
| **tension** | "Kamera" (group scale+translate) zoom in ke area RAM (`scale:1→1.08`) sambil blok RAM jatuh satu-satu. Micro-shake di blok terakhir kalau berat. | Dock bob & fan (kalau CPU sudah sempat kelihatan sebelumnya) tetap jalan — kamera zoom BUKAN alasan buat freeze elemen lain. |
| **insight** | Starburst overshoot pop (`scale:0→1.3→1, back.out(2)`) + 3-4 partikel sparkle mancar radial lalu fade. | Fan tetap muter (§4) — inilah momen paling penting buat ambient layer kelihatan, karena mata user lagi fokus baca insight text, fan yang tetap jalan di background mockup jadi "reward" buat yang notice. |
| **payoff** | Kamera zoom out (`scale→1`), caption slide-up+fade masuk. | Semua ambient (fan, dock bob, dial jitter) tetap jalan sampai transisi Act berikutnya mulai — TIDAK ada frame yang 0 motion. |

### 5.3 Transisi Antar-Act — Swipe Berlapis (Parallax, 2 Kecepatan)
Bukan swipe 1 lapis — pisah jadi 2 lapisan kecepatan beda biar berasa
punya kedalaman ruang (parallax), bukan cuma geser flat:
- **Layer background** (grid dot/garis tipis di BG mockup): slide-out
  lebih PELAN & jarak lebih PENDEK (`x:0→-VW*0.15`, `duration:0.4`).
- **Layer foreground** (mockup + badge + metric): slide-out lebih CEPAT
  & jarak lebih JAUH (`x:0→-VW*0.3, opacity:1→0, power2.in, ~0.3s`),
  gerak duluan ~0.05s sebelum background biar ada jeda kedalaman.
- Act baru slide-in dari kanan dengan pola sama terbalik (foreground
  duluan nyampe, background nyusul dikit).
- SFX beda dari whoosh intro (`transitions/swoosh-2.wav`) biar transisi
  antar-Act punya identitas suara sendiri, bukan reuse whoosh hook.

### 5.4 Closing — "Race Track" dengan Jejak & Kamera Ikut
Konsep race dipertahankan, ditambah lapisan motion biar finish terasa
seru bukan cuma "elemen sampai lalu diem":
- 4 avatar (Face mini tiap DE, warna badge masing-masing) lari dari kiri
  ke kanan, kecepatan berbanding terbalik dari RAM usage (i3 duluan
  nyampe, GNOME paling lambat) — pola "Moving Element (A ke B)" dari
  `04-referensi-gsap.md`, 4 instance paralel.
- **Jejak gerak (trail):** avatar tercepat (i3, lalu XFCE) ninggalin 2-3
  "ghost" copy transparan di belakangnya (opacity turun 0.4→0.1→0,
  posisi lag ~0.1s per ghost) — kesan kecepatan tanpa motion-blur filter.
- **Track ikut "bergerak":** garis-garis tipis vertikal sepanjang track
  scroll ke kiri pelan (`x:0→-40, duration:1, repeat:-1, ease:'none'`)
  selama race berlangsung — trik lama tapi efektif bikin race berasa
  gerak walau kamera sebenarnya statis.
- **Kamera mikro-follow:** group track discale/translate dikit
  (`x` mengikuti posisi avatar terdepan dengan `lag` via lerp tiap frame,
  amplitudo kecil ±15px) — bukan follow ketat, cukup buat kesan "kamera
  hidup", bukan tripod mati.
- Begitu avatar sampai finish, badge `useCase` muncul stagger sesuai
  urutan sampai (bukan nunggu semua selesai) + `success/victory.wav`
  per kedatangan (volume makin kecil di avatar berikutnya biar gak
  numpuk berisik).
- Caption penutup menegaskan "cepat sampai ≠ menang" — jawab hook
  secara visual + verbal.
- Face utama (`relieved`) + `CLOSING.title` muncul duluan (jeda ~0.5s
  "loading jawaban") SEBELUM race jalan, `CLOSING.answer` muncul setelah
  race selesai sebagai penutup beneran.

## 6. Katalog Teknik Motion (Referensi ke `04-referensi-gsap.md`)

| Teknik | Referensi pola existing | Dipakai di |
|---|---|---|
| Elastic/back pop-in | `back.out(1.7)` — pola `virtual-memory` item spawn | Dock icon, window mockup, starburst |
| Staggered spawn | `items.forEach((item,i)=>...spawnTime = t+i*STAGGER)` | Dock/taskbar icon, race badge arrival |
| Moving element A→B | Bagian "Advanced Pattern: Moving Element" | Race avatar, kursor mockup XFCE |
| Tween object + onUpdate | Bagian "Tween Object untuk Animasi Halus" | Block count, fan rotation, needle angle, kamera zoom/follow |
| Continuous loop (`repeat:-1, ease:'none'`) | Easing table baris "Loop kontinu" | Fan CPU, dock bob, BG drift, track scroll lines |
| **BARU** — Ghost/trail via duplikat elemen | Tidak ada contoh existing | Fan blade ghost, avatar race trail |
| **BARU** — 2-step overshoot (tween lewat target, balik) | Tidak ada contoh existing, mirip semangat `elastic.out` tapi manual | Needle dial customization |
| **BARU** — Parallax dual-speed pada exit/enter | Tidak ada contoh existing | Transisi antar-Act (§5.3) |
| **BARU** — Kamera micro-follow via lerp tiap `onUpdate` | Tidak ada contoh existing | Race track camera (§5.4) |
| Sub-tween kill saat Act ganti | Tidak ada contoh existing — simpan ref semua ambient timeline per Act di `useRef` array (mis. `ambientTweensRef.current`), `.kill()` semua sebelum Act berikutnya mulai | Fan CPU, dock bob, BG drift, dial jitter — SEMUA ambient loop |

## 7. Perubahan Struktur Data (`data.js`) & State

Perubahan `data.js` tetap MINIMAL (prinsip `02-standar-konten.md` — data
statis vs operasional tetap ramping):
- `ramBlocks` = derive inline (`Math.ceil(ramValue/15)`), tidak perlu
  field baru.
- `useCase` sudah ada di `DE_DATA`, dipakai lagi di race closing.
- Mockup look per DE cukup hardcode di komponen `Mockup` per `id`, tidak
  butuh field baru.

Perubahan BARU di komponen (bukan data.js) untuk mendukung ambient layer:
- `ambientTweensRef = useRef([])` — kumpulan semua `gsap.timeline({repeat:
  -1})` / `gsap.to(..., {repeat:-1})` yang lagi aktif untuk Act saat ini.
- Setiap kali Act berganti (`tl.add(() => { ...; killAmbient(); startAmbient(actId) }, t)`),
  panggil `ambientTweensRef.current.forEach(tw => tw.kill())` dulu SEBELUM
  bikin set ambient baru untuk Act berikutnya — supaya tidak ada tween
  ambient "mati" yang numpuk di background dan bikin re-render sia-sia.
- Kamera micro-follow (§5.4) butuh 1 state tambahan (`camX`) yang di-lerp
  tiap `onUpdate` posisi avatar terdepan — bukan tween langsung ke target,
  supaya gerak kamera terasa halus/lag natural, bukan snap.

## 8. SFX Tambahan (Sudah Tersedia di `public/audio/`, Tinggal Pakai)

| File | Ada di | Dipakai untuk |
|---|---|---|
| `ui/pop.wav`, `ui/pop-2.wav` | `public/audio/ui/` | Tiap dock/window icon muncul (stagger) |
| `ui/bounce.wav` | `public/audio/ui/` | Blok RAM landing (impact) |
| `ui/tick.wav` | `public/audio/ui/` | Typewriter hook, jam widget KDE tiap detik (opsional, jangan tiap detik literal — throttle ke tiap ~2-3 tick biar gak berisik) |
| `ui/chime.wav` | `public/audio/ui/` | Needle customization overshoot-settle selesai |
| `success/shimmer.wav` | `public/audio/success/` | Sparkle/partikel saat insight |
| `success/victory.wav` | `public/audio/success/` | Avatar closing race sampai finish (volume makin kecil per kedatangan berikutnya) |
| `transitions/swoosh-2.wav` | `public/audio/transitions/` | Swipe transisi antar-Act |
| `warnings/alert-pulse.wav` | `public/audio/warnings/` | Micro-shake momen RAM berat (GNOME/KDE) |
| **BARU** — volume rendah kontinu? | — | **Sengaja TIDAK** dipakai SFX kontinu (mis. fan whirr loop) untuk ambient visual — cukup visual saja, biar SFX tetap dipakai buat highlight momen beat, bukan noise floor terus-terusan. |

**Konsekuensi:** `scripts/export-lib.js` bagian `SFX_SCHEDULES['desktop-environment']`
WAJIB dihitung ulang total setelah timing final motion baru fix — beat
sekarang punya jauh lebih banyak sub-momen (ambient start/stop per Act,
trail, overshoot) dibanding revisi pertama.

## 9. Checklist Implementasi Bertahap

**Tahap 1 — MVP (dampak paling kelihatan, effort sedang):** ✅ DIEKSEKUSI
- [x] Mini Desktop Mockup per DE (§3) — komponen `Mockup` di `Animation.jsx`:
      GNOME (dock icon bob), KDE (systray icon muter), XFCE (kursor jalan
      sendiri antar titik), i3 (border window fokus berkedip)
- [x] RAM jadi stack blok jatuh + partikel debu landing (§4) — di-derive
      langsung dari `ramAnim` (tween yang sudah ada), tanpa tween baru
- [x] Fan CPU berputar kontinu SEBAGAI ambient layer (§4, §6) — kecepatan
      putar proporsional ke `currentDE.cpu`, plus 1 blade ghost buat kesan
      ngebut; bar lama disisakan tipis (opacity 0.5) sebagai referensi angka
- [ ] Needle/dial Customization (masih Tahap 3, belum disentuh)
- [x] Update `SFX_SCHEDULES` — **TERNYATA TIDAK PERLU**: motion baru semua
      di-derive dari state/tween yang sudah ada (`ramAnim`, `elapsed`), tidak
      nambah `master.add()`/`master.to()` baru → timing SFX existing tetap
      valid apa adanya (diverifikasi: jumlah `master.add/to` tetap 11 sebelum-sesudah)

> **Catatan penyesuaian teknis saat eksekusi:** Poin "Infrastruktur
> `ambientTweensRef` + kill-before-restart" di draft awal DIGANTI pendekatan
> lebih sederhana & lebih aman: semua ambient motion (fan, dock bob, kursor,
> border blink) di-derive sebagai FUNGSI dari `elapsed` (=
> `window.__animationTimeline.time()`, dibaca lewat `master.eventCallback
> ('onUpdate', ...)`), BUKAN `gsap.to(..., {repeat:-1})` yang berdiri
> sendiri di luar timeline. Alasan: `scripts/export-parallel.mjs` meng-capture
> video dengan cara **seek per-frame** ke `window.__animationTimeline` (bukan
> play real-time) — tween yang hidup di luar timeline tidak ikut ke-seek,
> jadi hasilnya bisa acak/tidak sinkron antar-frame render. Turunan-dari-
> `elapsed` otomatis benar di kedua mode (preview real-time & export seek)
> karena selalu ngikut waktu timeline itu sendiri. Pola ini yang dipakai
> untuk implementasi Tahap 2/3 berikutnya juga, bukan `ambientTweensRef`.

**Tahap 2 — Polish storytelling & overlap:**
- [ ] Typewriter hook + idle sway Face (2 ritme beda) + mini-mockup
      ambient di Hook stage (§5.1)
- [ ] Swipe transition parallax 2-lapis antar-Act (§5.3)
- [ ] Sparkle particle saat insight, reuse ke partikel debu RAM (§4, §5.2)
- [ ] Verifikasi tabel overlap §5.2 — ambient beat sebelumnya BENAR tidak
      berhenti saat beat baru mulai (review manual per Act)

**Tahap 3 — Payoff besar & micro-motion penutup:**
- [ ] Race track closing + trail ghost avatar tercepat (§5.4)
- [ ] Track scroll lines + kamera micro-follow lerp (§5.4)
- [ ] Needle/dial dengan overshoot 2-step + idle jitter (§4)
- [ ] **QA kepadatan motion:** rekam full loop, scrub tiap ~1 detik,
      pastikan TIDAK ADA 1 frame pun yang 0 elemen bergerak (aturan
      Always-2 di §2) — kalau ketemu momen statis, itu bug, bukan opsional

Disarankan kerjakan Tahap 1 dulu, preview & loop beberapa kali di
`/player/desktop-environment`, baru lanjut Tahap 2-3.

## 10. Non-Goals / Tetap Di Luar Scope

- Tidak migrasi ke `manifest.js` / kontrak baru (strangler fig, sesuai
  keputusan sebelumnya).
- Tidak mengubah 4 beat (`setup/tension/insight/payoff`) atau urutan
  `hook → 4 Act → closing` — yang direvisi murni CARA menampilkan +
  KEPADATAN motion-nya.
- Tidak menambah Desktop Environment ke-5 atau mengubah data RAM/CPU.
- Tidak pakai SFX ambient kontinu (lihat §8) — motion ambient cukup
  visual, SFX tetap dijaga jadi penekan momen beat saja.
