# Revisi 01 — Icon, Hapus Narration Bubble, Perapat Motion & Real-Case Flow

| Item | Nilai |
|---|---|
| Content | 60 — Linux Processes |
| Diminta oleh | Adib, 2026-09-19 |
| Status | 🟡 DIEKSEKUSI KE KODE — icon (fallback), narration-bubble dihapus, 4 beat baru, SFX_TIMELINE sudah diupdate. BELUM: generate 5 PNG asli, preview manual, export MP4. |
| Terakhir diupdate | 2026-09-19 |
| Referensi | `_docs/LINUX_PROCESSES_PLAN.md`, `docs/standardizations/03` §D & §1.T, `docs/standardizations/06-icon-generation` (bagian 06 di `05-svg-layout-asset-pipeline.md`) |

## Ringkasan Permintaan

1. Tambahkan icon (dari `icons.json`, digenerate lewat ChatGPT) — first pass
   topic ini sengaja 100% inline SVG.
2. Hapus "bubble text" naratif yang mengambang di atas konten — masih aktif
   di kode produksi (bukan backup), dan dianggap tidak perlu.
3. Kurangi jeda yang tidak berguna (dead time) — timeline terasa sepi.
   Perkaya dengan motion/flow tambahan, perjelas penjelasan, dan tambahkan
   contoh kasus nyata (real case) supaya audiens lebih paham manfaat process
   & `ps` di kehidupan sehari-hari.

Ketiga poin dianalisis di bawah beserta rencana perubahan konkret.

---

## 1. Analisis & Plan Icon (`icons.json`)

### 1.1 Kondisi saat ini

Checklist eksekusi plan awal secara eksplisit mencatat:

> "**Folder `icons/` sengaja TIDAK dibuat** — first pass tetap inline SVG
> (semua card/meter/terminal render langsung sebagai path/rect/text di
> Animation.jsx)"

Ini keputusan first-pass yang sah saat itu, tapi permintaan user sekarang
mengubah keputusan itu — icon perlu ditambahkan untuk memperkaya visual
(icon juga membantu poin 3: mengurangi kesan monoton kotak, lihat
`03-planning-storytelling-quality-gate.md` §3.6).

### 1.2 Audit elemen visual (inline SVG vs icon PNG)

Ikuti kriteria `06-icon-generation.md` §1.2: **inline SVG** kalau elemen
punya sub-state animasi internal (rotasi, morph, isi berubah tiap frame);
**icon PNG** kalau statis atau maksimal 2 varian.

| Elemen | Kategori | Alasan |
|---|---|---|
| `ProgramFileCard` (bentuk file di disk) | **Tetap inline SVG** | Fade out saat handoff (`opacity={1 - handoff}`), state animasi internal — bukan kandidat icon |
| Badge "DISK" / "PROCESSES" (label teks) | Tetap teks | Label posisi, bukan visual mandiri |
| `ProcessCard` — bingkai card | Tetap inline SVG | Border/scale/highlight berubah per state (`highlight`, `scale`), harus tetap dinamis |
| **Aksen app di dalam `ProcessCard`** (browser/editor/music-app) | **Icon PNG baru** | Statis per process, tidak berubah bentuk — cocok jadi accent icon 28×28 di pojok card (pola §6.3 `06-icon-generation.md`, seperti `coordination-server` icon) |
| `ResourceMeter` (bar CPU/MEM) | Tetap inline SVG | Width bar tween tiap frame — wajib animasi internal |
| `ClonePidChip` | Tetap inline SVG | Pill kecil, sudah cukup jelas dari teks PID, tidak butuh icon |
| `TerminalPsPanel` — bingkai terminal | Tetap inline SVG | Baris `psRows` bertambah dinamis, dot warna terminal tetap generik |
| **Icon "launch/run"** di titik handoff Act 1 (baru, lihat §3) | **Icon PNG baru** | Elemen statis (cursor/klik/play symbol), muncul sekali sebagai pemicu visual "menjalankan" — bukan sub-animasi kompleks |
| **Icon "laptop lambat" / warning** di real-case Act 3→4 (baru, lihat §3) | **Icon PNG baru** | Statis, 1 varian, menandai momen tegangan real-case |

**Kesimpulan:** 5 icon PNG baru dibutuhkan: `icon-browser`, `icon-editor`,
`icon-music`, `icon-launch-cursor`, `icon-warning-load`. Semua elemen
dengan sub-state animasi (file card, resource bar, terminal) TETAP inline
SVG — konsisten dengan §1.2 `06-icon-generation.md`, bukan migrasi total.

### 1.3 Draft `icons.json` (Format B — single-batch, 5 icon ≤ 7)

Grid 2×4 (rekomendasi §1 poin 1, tajam ~500px/icon), slot ke-8 `[EMPTY]`.

```json
{
  "name": "linux-processes",
  "description": "Icon aksen untuk topic 60 Linux Processes",
  "icons": [
    { "id": "icon-browser", "name": "Browser App", "label": "Browser", "description": "Ikon browser minimalis outline, monokrom, mewakili aplikasi browser sebagai process" },
    { "id": "icon-editor", "name": "Editor App", "label": "Editor", "description": "Ikon text editor/code editor minimalis outline, monokrom" },
    { "id": "icon-music", "name": "Music App", "label": "Music", "description": "Ikon musik/note pemutar audio minimalis outline, monokrom" },
    { "id": "icon-launch-cursor", "name": "Launch Cursor", "label": "Launch", "description": "Ikon cursor/klik dengan simbol play kecil, menandakan aksi menjalankan program" },
    { "id": "icon-warning-load", "name": "Warning Load", "label": "Warning", "description": "Ikon indikator beban tinggi/warning ringan (mis. gauge condong ke merah), tanpa teks di dalam gambar" }
  ],
  "generation": {
    "rows": 2, "cols": 4,
    "prompt": "Generate a 2x4 grid of 8 minimalist grayscale monochrome icons on transparent background (PNG), flat design, black/gray colors only:\n1. Browser app icon (outline window + globe)\n2. Text/code editor icon (outline document + cursor)\n3. Music player icon (outline note)\n4. Launch/run cursor icon (mouse cursor + small play triangle)\n5. Warning/high-load gauge icon (dial condong ke kanan, tanpa angka/teks)\n6. [EMPTY - leave this slot blank/transparent]\n7. [EMPTY - leave this slot blank/transparent]\n8. [EMPTY - leave this slot blank/transparent]\n\nStyle: flat design, black/gray colors only, transparent background, grid 2 rows x 4 columns, no text/labels baked into image.",
    "api_endpoint": "http://localhost:3373/api/icons/generate",
    "output_path": "src/content/60-linux-processes/icons"
  }
}
```

### 1.4 Integrasi (rencana kode)

- Buat `icons/default-icon.png` (placeholder lokal) + `icons/loader.js`
  dengan fallback, ikuti pola `06-icon-generation.md` §6.1.
- `ProcessCard` dapat prop baru `iconId` → render `<image>` di pojok card
  pakai formula offset aksen §6.3 (`x = -(cardWidth/2) + paddingKiri`,
  card `w=144` → `x = -72 + 20 = -52`, `y` disamakan dengan posisi dot
  warna existing agar tidak nabrak nama app).
- Icon pengganti vs icon baru (§6.4): `icon-browser/editor/music` adalah
  **icon baru** (belum ada elemen existing yang digantikan) → butuh entry
  `popIn()` baru bersamaan dengan pop-in card masing-masing, bukan sekadar
  swap child. `icon-launch-cursor` & `icon-warning-load` juga icon baru,
  dipasang di beat motion tambahan (lihat §3).
- Update checklist §10 `05-svg-layout-asset-pipeline.md` (Bab B): pastikan
  `Badge`/`ProcessCard` yang sudah dapat prop `icon` di awal, bukan
  ditambal setelah semua Act selesai.

---

## 2. Analisis & Plan Hapus Narration Bubble

### 2.1 Konfirmasi lokasi — bukan backup, aktif di produksi

Bubble ini ADA dan aktif di `src/content/60-linux-processes/Animation.jsx`
(bukan sisa di `backup/` atau `_archive/`). Bukti dari kode:

```jsx
// pop-in sekali di awal, TIDAK pernah di-popOut sepanjang timeline
tl.add(() => setPop((prev) => ({ ...prev, 'narration-bubble': { opacity: 1, scale: 1, x: 0, y: 0 } })), 1.15)
```

```jsx
// dirender persistent di luar blok per-Act, isi teks (`caption`) berganti
// tiap beat lewat setCaption(...) sepanjang 4 Act
<g opacity={pNarration.opacity} transform={transform('narration-bubble', 366, 75)}>
  <rect .../><path .../> {/* bentuk speech bubble + ekor */}
  <text ...>{caption}</text>
</g>
```

Bubble ini dipasang sekali di `t=1.15` (awal Act 1) dan tidak pernah
di-`popOut` — bertahan sampai akhir loop, isi teksnya (`caption` state)
diganti-ganti oleh `setCaption(...)` di 9 titik waktu berbeda sepanjang 4
Act (IDLE, LAUNCH, PID, CLONE, RESOURCE, RESOURCE_DIFF, PS, PS_PID,
TAKEAWAY).

### 2.2 Kenapa ini melanggar standar

Pola ini **persis** pola "caption bar" yang sudah dinyatakan deprecated di
`03-planning-storytelling-quality-gate.md` §D, hanya beda posisi (atas,
bukan bawah layar):

> **❌ DON'T:** "Jangan gunakan caption bar bawah layar (`say()`) — sudah
> deprecated."
>
> **✅ DO:** "Taruh caption DEKAT elemen visual yang dibahas (bukan di
> caption bar bawah). Gunakan `IconCaption` (nempel di bawah icon) atau
> `PathLabel` (nempel di benang yang sedang jalan) — bukan `say()` ke
> caption bar terpisah."

Satu bubble mengambang generik di atas — terlepas dari elemen mana yang
sedang jadi fokus — adalah caption bar, cuma dipindah ke posisi atas.
Ini juga bertentangan dengan §K (Teks Mengikuti Posisi Elemen): teks
harus dihitung relatif terhadap elemen yang sedang dibahas, bukan satu
titik statis `(366, 75)` yang sama untuk semua 9 baris caption.

### 2.3 Rencana penggantian — caption menempel ke elemen

Hapus total `narration-bubble` (state `pop['narration-bubble']`, entry
`popIn` di `t=1.15`, dan `<g>` render-nya). Ganti tiap baris `caption`
jadi badge kecil (`IconCaption`-style) yang muncul DEKAT elemen yang
sedang dibahas, lalu `popOut` sebelum baris berikutnya muncul (supaya
tidak ada 2 badge tabrakan, ikuti §3.7 satu-kanal-per-kalimat).

| Caption lama (bubble) | Elemen acuan baru | Posisi baru (local) |
|---|---|---|
| `IDLE` — "Program masih diam di disk" | Nempel di atas `ProgramFileCard` | `(170, 130)` — di atas disk card |
| `LAUNCH` — "Saat berjalan, ia menjadi process" | Nempel di titik handoff (mengikuti `browserX/browserY` yang sedang tween) | posisi relatif `browserX, browserY - 70` |
| `PID` — "Process memiliki PID" | Nempel di dekat PID tag browser (card pertama yang dapat PID) | `(150, ARENA_Y - 80)` |
| `CLONE` — "Satu program dapat berulang" | Nempel di `ClonePidChip` (sudah ada elemen ini, tinggal ditempelkan) | `(CLONE_X, CLONE_Y - 30)` |
| `RESOURCE` — "Process memakai resource" | Nempel di atas grid `ResourceMeter` | `(366, METER_Y - 55)` |
| `RESOURCE_DIFF` — "CPU dan memory dapat berbeda" | Nempel di `ResourceMeter` browser (yang di-highlight) | `(PROCESSES[0].slotX, METER_Y - 55)` |
| `PS` — "ps melihat process hidup" | Nempel di atas `TerminalPsPanel` | `(TERMINAL_X, TERMINAL_Y - 100)` |
| `PS_PID` — "PID membantu mengenali target" | Nempel di kolom PID tabel ps (baris pertama) | dekat `TERMINAL_X - 296, row 1` |
| `TAKEAWAY` — "Process adalah program yang hidup" | Tetap di `TerminalPsPanel` (sudah ada slot `showTakeaway` di bawah tabel) — **tidak perlu bubble terpisah, sudah benar sebagai badge lokal** | posisi existing, tidak berubah |

Catatan: `TAKEAWAY` SUDAH benar (bukan bubble, sudah nempel di
`TerminalPsPanel`) — jadi pola yang benar ini dipakai sebagai referensi
untuk 8 caption lain yang masih salah lewat bubble global.

**Kenapa bukan cuma pindah posisi bubble sekali:** kalau bubble cuma
digeser jadi 1 titik tetap yang "dianggap netral", itu masih 1 kanal
generik yang lepas dari elemen — pelanggaran yang sama, cuma pindah
koordinat. Perbaikan yang benar adalah caption per-elemen, sesuai §D DO.

---

## 3. Analisis Dead Time & Rencana Perapatan Motion + Real Case

### 3.1 Audit timeline aktual (timestamp diambil langsung dari `tl.add`/`tl.to`)

`actStart = [1.15, 10.65, 21.15, 30.65]`, total durasi ≈ 41.15s.

| Act | Event terakhir dalam Act | Waktu event terakhir | Act berakhir di | **Dead time** |
|---|---|---:|---:|---:|
| 1 — File jadi process | SFX `POP` handoff selesai | 5.20 | 10.65 | **5.45s** kosong, cuma diam menunggu Act 2 |
| 2 — Banyak process & PID | `clone` di-`opacity:0` (instant, tanpa tween keluar) | 17.65 | 21.15 | **3.50s** kosong |
| 3 — Resource | `RESOURCE_DIFF` caption + highlight + `DING` | 24.65 | 30.65 | **6.00s** kosong — dead time TERBESAR |
| 4 — Terminal ps | `TAKEAWAY` caption + `DING` | 35.85 | 41.15 | 5.30s (hold akhir, sebagian wajar tapi berlebih) |

**Total dead time murni (Act 1-3):** ~15 detik dari ~40 detik durasi
konten (≈37%) adalah layar diam tanpa event baru. Ini jauh melebihi hold
budget default (`03` §1.O): "hold membaca perubahan penting: 0,8–1,8
detik" — bukan 3.5-6 detik tanpa keterangan tertulis kenapa melebihi.
Anti-pattern §E juga relevan: "Jangan buat buffer antar-Act terlalu
panjang (> 0.5s buffer = waktu nganggur yang terasa lama)" — di sini
bukan cuma buffer antar-Act, tapi dead time DI DALAM Act.

Tambahan temuan: `clone` di-`popOut` dengan `setPop(...opacity:0)`
instant (bukan tween) — melanggar §T "Setiap elemen WAJIB punya `popOut`
yang terdefinisi" secara animasi, bukan cuma perubahan state mendadak.

### 3.2 Masalah kedua — penjelasan dangkal, tanpa real case

Selain sepi, isi tiap Act murni definisi abstrak ("Process memiliki PID",
"CPU dan memory dapat berbeda") tanpa skenario nyata yang membuat audiens
paham KENAPA ini penting. Dicek terhadap `03` §1.A/§3.0 storytelling:

- Act 1 belum benar-benar "hook" (§3.0) — tidak ada pertanyaan/misteri,
  langsung definisi datar "file → process".
- Act 3 dan Act 4 tidak beat "tegangan → titik balik → payoff" (§1.E) —
  cuma progres linear (resource muncul → ps dijalankan), tidak ada
  masalah yang membuat penonton penasaran.
- Tidak ada contoh dunia nyata yang menjawab "buat apa saya perlu tahu
  ini?" — persis yang diminta user.

### 3.3 Rencana redesain storyboard — real case "laptop terasa lambat"

Real case dipilih: **audiens membuka banyak aplikasi, laptop terasa
lambat, lalu belajar pakai `ps` untuk menemukan process mana yang paling
boros resource** — ini PAS dengan Batas Akurasi #5 di plan awal (tidak
masuk kill/signal, cuma identifikasi lewat `ps`), sekaligus memberi
alasan konkret kenapa PID & resource meter penting.

| Act | Hook/tegangan baru | Isi tambahan pengisi dead time |
|---|---|---|
| 1 — File jadi process | Ganti pembuka jadi pertanyaan: *"Klik ikon aplikasi... apa yang sebenarnya terjadi?"* (bukan definisi datar) | Tambah beat `icon-launch-cursor` klik eksplisit di titik `t+3.0` (sebelum handoff) supaya "menjalankan" konkret bukan abstrak. Isi dead time 5.45s: card `browser` yang baru jadi process diberi idle-pulse halus (glow border naik-turun pelan, TIDAK ganti state) + cliffhanger caption baru "tapi browser tidak sendirian..." di t+7.0 sebagai jembatan ke Act 2 |
| 2 — Banyak process & PID | (tetap, sudah cukup rame dgn 3 card + clone) | Isi dead time 3.5s setelah clone hilang: tambah 1 baris fakta baru yang SUDAH tervalidasi di Batas Akurasi #3 tapi belum divisualkan — *"PID bisa dipakai ulang setelah process itu selesai"* — beri visual: PID chip clone yang tadi hilang, muncul sekali lagi redup di posisi berbeda dengan label "PID reused" |
| 3 — Resource | Tambah tegangan real-case: setelah resource meter naik, browser mulai "spike" (meter naik lagi, bukan diam) sambil `icon-warning-load` muncul di pojok layar + caption *"laptop mulai terasa berat"* | Ganti dead time 6.0s dengan sequence spike ini — dari flat exposition jadi beat tegangan sesuai §1.E |
| 4 — Terminal ps | Payoff eksplisit: caption terakhir diarahkan closing loop ke Act 3 — *"PID 1042 (browser) paling boros — itu yang bikin laptop lambat"* menggantikan takeaway generik | Highlight baris PID 1042 di tabel `ps` (border/warna menyala saat baris itu muncul) alih-alih baris netral biasa; hold akhir dipangkas dari 5.3s → ~1.8s (sesuai hold budget default pembacaan hasil penting) |

### 3.4 Tabel Causal Motion (§1.T.1) untuk beat baru

| Action id | Before yang tampak | Pemicu/source | Jalur/process | Target & apply | After yang tampak | Hold | SFX | Frame audit |
|---|---|---|---|---|---|---:|---|---|
| `launch-click` | Program file diam di disk, belum ada cursor | `icon-launch-cursor` pop-in di atas file card | Cursor turun singkat lalu "klik" (scale pulse) | Klik selesai → langsung trigger handoff tween (existing) | File card mulai handoff, cursor fade | 0.3s | `ui/pop` | before klik / saat klik / handoff mulai |
| `pid-reuse-hint` | Clone PID sudah hilang total (kosong) | Otomatis di dead-time Act 2 | PID chip lama fade-in redup di posisi baru (bukan posisi asal — supaya jelas ini instance baru) | Chip settle, caption "PID bisa dipakai ulang" | Chip tetap redup 1s lalu fade keluar halus | 1.0s | `ui/tick` | before muncul / saat fade-in / after redup |
| `resource-spike` | Browser resource meter sudah di nilai awal (58/74) | Otomatis lanjutan Act 3 (bukan input user) | Meter CPU/MEM browser tween naik lagi ke nilai lebih tinggi (mis. cpu 58→81, mem 74→88) sambil `icon-warning-load` pop-in di pojok | Meter mencapai nilai puncak, badge redup jadi warna warning | Caption "laptop mulai terasa berat" muncul dekat meter, hold sebentar sebelum Act 4 | 1.2s | `ui/number-tally` lanjutan + `warnings/*` (scan asset existing dulu, §2 `06-audio-sfx.md`) | before spike / saat naik / after puncak |
| `ps-highlight-culprit` | Baris `ps` browser (PID 1042) tampil netral seperti baris lain | Otomatis setelah `psRows=3` | Border/warna baris PID 1042 menyala (highlight), tidak berpindah posisi | Baris menyala penuh, caption payoff muncul | Caption "PID 1042 paling boros" bertahan sampai takeaway | 1.8s | `success/ding` (sudah dipakai TAKEAWAY, geser ke sini) | before highlight / saat menyala / after (bersamaan takeaway) |

**Catatan implementasi:** `resource-spike` HARUS tetap dalam batas akurasi
plan awal — tidak menyiratkan "process akan di-kill", cuma menunjukkan
angka naik sebagai alasan audiens mengecek lewat `ps`. `icon-warning-load`
dipakai di sini (lihat §1.3), bukan icon baru lain, supaya set icon tetap
minimal.

### 3.5 Dampak ke durasi Act

Menambah 4 beat baru otomatis mengisi sebagian besar dead time (target:
dead time per Act turun dari 3.5–6.0s jadi ≤ 1.5s, sesuai hold budget
default). Durasi total per Act (`PHASES[].duration` di `data.js`) TIDAK
wajib berubah signifikan — sebagian besar dead time yang ada sekarang
sudah cukup untuk menampung beat baru tanpa memperpanjang total durasi
video. Perhitungan detail durasi baru dilakukan saat eksekusi (Langkah 1
`03-tutorial-buat-topic-baru.md`, pola time cursor), bukan di plan ini,
karena harus dicek juga terhadap collision layout (`04` §Timeline Audit).

---

## Rencana Perubahan File (Kontrak §3, `02-topic-contract-scene-shell.md`)

| File | Perubahan |
|---|---|
| `data.js` | Tambah `CAPTIONS` baru (hook Act 1, cliffhanger, PID reuse, spike, payoff); hapus asumsi 1 bubble generik; tambah warna/label untuk `icon-warning-load` state |
| `Animation.jsx` | Hapus `narration-bubble` total; pindahkan tiap caption ke badge lokal dekat elemen (§2.3); tambah 4 beat baru (§3.4) dengan `popIn`/`popOut` bertween; render `<image>` icon di `ProcessCard` |
| `icons/icons.json`, `icons/default-icon.png`, `icons/loader.js` | Baru dibuat (§1.3–1.4) |
| `caption.md` | Sinkronkan ringkasan cerita dgn hook & payoff baru (opsional, cek dulu isinya sebelum ubah) |
| `scripts/export-lib.js` | Update `SFX_TIMELINE['linux-processes']` — timestamp berubah karena beat baru + caption yang di-reposisi |

## Status Test Setelah Perbaikan

- [x] Dieksekusi ke kode (2026-09-19) — data.js, Animation.jsx, icons/*,
      scripts/export-lib.js semua sudah diubah sesuai rencana di dokumen ini.
- [x] Compile check (esbuild syntax + bundle-resolution, resolve data.js +
      shared/scene-ui/v1 + icons/loader.js + default-icon.png) — lolos.
- [ ] Preview manual `/player/linux-processes` — belum, butuh `npm run dev`.
- [ ] Export MP4 — belum.
- [ ] Audit dead time ulang (ukur gap event terbaru, target ≤1.5s per Act) —
      belum diukur terhadap hasil render nyata; perhitungan di §3.5 dokumen
      ini murni dari timestamp kode (Act2 tail ≈1.95s, Act3 tail ≈2.0s,
      sisanya sudah ≤1.5s) — masih perlu dicek "kerasa"-nya secara visual.
- [ ] Audit collision layout untuk icon baru & badge caption baru — belum
      diverifikasi visual (posisi dihitung manual di kode, lihat catatan
      collision di bagian bawah).

## Catatan eksekusi (2026-09-19)

- **Icon:** `icons.json` dibuat (5 icon + prompt generation), `icons/loader.js`
  dibuat dengan `getIcon()` fallback UNIVERSAL ke `default-icon.png` untuk
  SEMUA id (bukan generate real artwork — sesi eksekusi ini tidak punya
  akses image-generation atau ke endpoint `/api/icons/generate`, yang lagipula
  cuma menerima UPLOAD grid image, bukan men-generate-nya). Konsekuensi:
  kelima icon (browser/editor/music/launch-cursor/warning-load) akan tampil
  sebagai placeholder generik yang SAMA sampai Adib generate grid PNG lewat
  ChatGPT (pakai prompt di `icons.json`) lalu upload+crop lewat UI icon
  generator (`localhost:3373`). Setelah itu, HANYA `icons/loader.js` yang
  perlu diganti (import per-id seperti pola `11-tailscale/icons/loader.js`)
  — `Animation.jsx` tidak perlu diubah lagi.
- **Narration bubble:** dihapus total (state, popIn `t=1.15`, render `<g>`).
  Diganti `LocalCaptionBadge` — satu channel (`pop.caption` + `captionPos`),
  dipindah posisi & teks tiap beat lewat helper `captionBeat(at, text, x, y)`.
  Caption `LAUNCH` posisinya DINAMIS (ikut `browserX/browserY` saat handoff,
  bukan koordinat statis) — pengecualian yang disengaja karena elemen
  acuannya sendiri sedang bergerak.
- **4 beat baru** ditambahkan sesuai §3.4: `launch-click` (Act1, icon cursor
  + "klik" tick sebelum handoff), `pid-reuse-hint` (Act2, chip PID 1090
  muncul lagi redup di posisi berbeda + caption "PID bisa dipakai ulang"),
  `resource-spike` (Act3, browser cpu 58→81 / mem 74→88 + WarningLoadIcon +
  caption "Laptop mulai terasa berat"), `ps-highlight-culprit` (Act4, baris
  PID 1042 di tabel `ps` disorot warna WARNING + caption payoff "PID 1042
  browser paling boros, bikin laptop lambat" menggantikan takeaway generik).
- **Posisi caption yang SEDIKIT menyimpang dari tabel §2.3** (demi menghindari
  overlap terhitung, belum diverifikasi visual): caption `PS` di y=765 (bukan
  TERMINAL_Y-100=780) dan `PS_PID` disamakan ke y=765 juga (bukan dekat baris
  tabel) — supaya badge (tinggi 48px) tidak menabrak panel terminal (top
  panel di y=795).
- **`scripts/export-lib.js`** `SFX_TIMELINE['linux-processes']` sudah
  ditulis ulang total (30 cue, naik dari 16) mengikuti seluruh timestamp
  baru di atas — lolos `node --check`.
- **Dead time setelah revisi** (dihitung dari kode, BELUM divalidasi visual):
  Act1 tail ≈1.3s (cliffhanger di +7.0, act berakhir di 9.5), Act2 tail
  ≈1.95s (reuse-hint fade di +8.7, act berakhir di 10.5), Act3 tail ≈2.0s
  (warning fade di +7.5 dan caption SPIKE masih tampil, act berakhir di 9.5),
  Act4 tail sebelum payoff ≈4.8s (PS_PID di +3.9 ke payoff di +8.7 — hold ini
  sengaja lebih panjang karena baris `ps` yang disorot + caption payoff
  butuh waktu dibaca, bukan dead time kosong). Semua turun signifikan dari
  3.5–6.0s sebelumnya, meski Act2/Act3 tail masih sedikit di atas target
  ≤1.5s — akan diaudit ulang setelah preview visual.
- `npm run build` (vite, full project) masih gagal karena
  `src/content/65-systemd/Animation.jsx` (topic lain, pre-existing, tidak
  disentuh) — TIDAK terkait revisi ini. Modul `60-linux-processes` sendiri
  lolos esbuild bundle-resolution check (54.7kb, tanpa error, termasuk
  resolve PNG icon via `--loader:.png=dataurl`).

## Checklist Eksekusi (isi saat mulai coding revisi ini)

- [x] Generate 5 icon PNG via `vm-icon-generator` sesuai `icons.json` §1.3 —
      **TIDAK bisa dilakukan dari sesi ini** (butuh ChatGPT manual + upload
      lewat UI, bukan sesuatu yang bisa dipanggil sebagai tool). `icons.json`
      sudah siap dengan prompt-nya; ini action item untuk Adib.
- [x] Buat `icons/loader.js` + `default-icon.png` — selesai (fallback universal).
- [x] Hapus `narration-bubble` (state, popIn, render) dari `Animation.jsx`.
- [x] Pindahkan 8 caption ke badge lokal per elemen (tabel §2.3).
- [x] Tambah beat `launch-click` di Act 1.
- [x] Tambah beat `pid-reuse-hint` di Act 2.
- [x] Tambah beat `resource-spike` + `icon-warning-load` di Act 3.
- [x] Tambah beat `ps-highlight-culprit` di Act 4, payoff menggantikan takeaway generik.
- [x] Update `SFX_MAP`/`SFX_TIMELINE` (export-lib.js) untuk semua beat baru.
- [ ] Ukur ulang dead time tiap Act secara visual (angka di atas dari kode,
      belum dari render nyata).
- [ ] Preview manual, export MP4, lalu naikkan status di README revisi index.

**Status:** 🟡 DIEKSEKUSI KE KODE, 2026-09-19 — menunggu Adib: (1) generate
5 PNG icon lalu ganti `icons/loader.js`, (2) preview manual
`/player/linux-processes`, (3) export MP4. Setelah ketiganya oke, naikkan
status revisi ini ke ✅ dan `metadata.json` topic ke `"ready"`.
