# PLAN: Standardization Doc 09 — Standar Pembuatan Konten Animasi

**Tujuan plan ini:** Mendokumentasikan rencana isi untuk dokumen baru
`docs/standardizations/09-standar-pembuatan-konten.md` — disusun langsung
dari pola masalah nyata yang ditemukan di 14 revisi topic `14-http-request-response`.

**Status:** 📋 PLAN SAJA — belum eksekusi penulisan doc finalnya.

**Akan ditaruh di:** `docs/standardizations/09-standar-pembuatan-konten.md`

---

## Latar Belakang — Kenapa Doc Ini Perlu Ada

Topic `14-http-request-response` mengalami **14 revisi dalam 1 hari** (2026-09-09
sampai 2026-09-10). Mayoritas revisi seharusnya bisa dicegah kalau ada standar
pre-planning yang jelas sebelum mulai coding. Pola masalah yang berulang:

| Kategori Masalah | Jumlah Revisi Terkait | Contoh |
|---|---|---|
| Narasi & analogi tidak divalidasi sebelum coding | revisi-07, 11 | "Browser = Tukang Pos" salah posisi, "Surat siap!" terlalu dini |
| Icon tidak direncanakan menyeluruh di awal | revisi-01, 02, 03 | 3 batch icon + 1 batch tambahan, harusnya 1 plan sekaligus |
| Layout/koordinat bentrok saat act digabung | revisi-05, 06, 08, 09 | 8 elemen numpuk vertikal sekaligus setelah Act 1+2 merge |
| Caption/teks salah posisi & format | revisi-02, 04, 10 | Caption bar bawah dibuang total (revisi-04), kalimat tanya → deklaratif (revisi-10) |
| Act terlalu banyak, tidak ada continuity | revisi-05, 07 | 6 act → 4 act, icon menghilang antar-act |
| Flowchart path tidak tersambung dari awal | revisi-03, 12, 14 | Benang baru muncul di Act 2, amplop balik "naik" karena salah posisi default |
| Visual tanpa context pemicu | revisi-07, 08, 11 | Teks muncul sebelum icon yang "memicu" teks itu ada |

---

## Struktur yang Direncanakan untuk Doc 09

Doc finalnya akan punya bagian-bagian berikut (urutan sesuai prioritas baca):

```
1. Overview & Scope
2. ✅ DO / ❌ DON'T — per kategori
3. Urutan Wajib Sebelum Coding (Pre-Planning Checklist)
4. Urutan Wajib Saat Coding (Execution Order)
5. Artefak Wajib (Mandatory File List)
6. Contoh Buruk vs Contoh Baik (dari kasus nyata)
```

---

## Bagian 1 — DO / DON'T per Kategori

### A. Narasi & Analogi

**✅ DO:**
- Tulis storyboard naratif per Act SEBELUM buka code editor
- Validasi akurasi teknis analogi: tanya "apakah ini benar secara teknis?"
  sebelum commit ke satu analogi
- Verifikasi "cause → effect" urutan benar: tunjukkan pemicu visual dulu,
  baru teks muncul sesudahnya
- Gunakan kalimat deklaratif ("Browser tidak langsung ambil halaman"),
  BUKAN pertanyaan retoris ("Bisa ambil langsung?")
- Pastikan teks "selesai" (mis. "Surat siap!") hanya muncul setelah
  proses benar-benar selesai secara naratif

**❌ DON'T:**
- Jangan mulai coding sebelum analogi divalidasi
- Jangan pakai kalimat tanya sebagai caption — AI bukan guru yang nanya
- Jangan munculkan teks sebelum visual context-nya ada di layar
- Jangan gunakan emoji di caption (bukan teks biasa)
- Jangan buat caption "selesai" sebelum proses naratifnya memang selesai

---

### B. Perencanaan Icon

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
- Jangan generate piecemeal (batch-1 selesai baru mikir batch-2) kalau sebenarnya
  semua icon sudah bisa diidentifikasi sejak audit awal
- Jangan convert elemen yang punya animasi internal menjadi icon PNG
  (contoh: spinner rotasi, ekspresi wajah berubah, pintu buka/tutup)
- Jangan skip default-icon.png — build AKAN rusak kalau PNG icon belum ada

---

### C. Layout & Koordinat

**✅ DO:**
- Bagi canvas menjadi zona per aktor sebelum assign koordinat
  (contoh: CLIENT zone atas, NETWORK zone tengah, SERVER zone bawah)
- Hitung collision Y untuk semua elemen yang bisa tampil bersamaan:
  formula aman: jarak Y antara dua elemen ≥ tinggi elemen atas + 20px margin
- Untuk caption horizontal berdampingan: formula `|anchor2-anchor1| ≥ w1/2 + w2/2 + 20`
  (lihat `05-svg-text-guide.md`)
- Definisikan FlowchartSpine waypoints LENGKAP dari awal (semua node + path segments
  termasuk segmen Act 1) sebelum mulai coding timeline
- Setiap elemen WAJIB punya `popOut` yang terdefinisi di timeline — tidak boleh
  ada elemen yang "hidup terus" tanpa exit

**❌ DON'T:**
- Jangan assign koordinat Y sembarangan lalu berharap tidak nabrak
- Jangan desain layout satu-Act-satu-Act tanpa mempertimbangkan elemen
  dari act lain yang bisa tampil bersamaan (terutama setelah act merge)
- Jangan mulai path dari tengah perjalanan (path WAJIB dimulai dari node
  paling awal sejak Act 1)
- Jangan biarkan elemen "menumpuk" tanpa ada cleanup timer

---

### D. Caption & Teks

**✅ DO:**
- Target ≤ 5 kata per caption (lebih pendek = lebih baik)
- Taruh caption DEKAT elemen visual yang dibahas (bukan di caption bar bawah)
- Gunakan `IconCaption` (nempel di bawah icon) atau `PathLabel` (nempel di benang
  yang sedang jalan) — bukan `say()` ke caption bar terpisah
- Sesuaikan posisi teks dengan posisi amplop/elemen utama saat teks itu muncul
- Verifikasi: "mata penonton lagi di mana saat teks ini muncul?" — teks harus
  ada di sana juga

**❌ DON'T:**
- Jangan gunakan caption bar bawah layar (`say()`) — sudah deprecated di revisi-04
- Jangan stack teks vertikal kalau beberapa teks tampil bersamaan — buat horizontal
- Jangan hardcode posisi teks jauh dari elemen yang dibahas
- Jangan pakai kata "siap" / "selesai" / "jadi!" sebelum ceritanya benar-benar selesai

---

### E. Struktur Act

**✅ DO:**
- Batasi maksimum 4 Act untuk animasi 40–60 detik
- Gabungkan Act yang satu pelaku/lokasi cerita (browser dengan browser, server dengan server)
- Pertahankan elemen yang masih relevan ke Act berikutnya — jangan langsung hilang
- Define explicit: elemen apa yang PERSIST ke act berikutnya, elemen apa yang FADE
- Beri jarak buffer minimum 0.2s di seam antar-Act (jangan terlalu panjang buffer)

**❌ DON'T:**
- Jangan buat lebih dari 4 Act tanpa alasan kuat
- Jangan render elemen dalam blok `{phaseIdx === N && ...}` kalau elemen itu
  perlu persist ke Act berikutnya
- Jangan buat buffer antar-Act terlalu panjang (> 0.5s buffer = waktu nganggur
  yang terasa lama)
- Jangan merge Act tanpa cek ulang koordinat Y semua elemen yang sekarang
  bisa tampil bersamaan

---

### F. Flowchart & Path

**✅ DO:**
- FlowchartSpine selalu dimulai dari Act 1 (bukan muncul pertama kali di Act 2+)
- Path harus punya waypoint untuk SETIAP momen penting perjalanan, termasuk
  "berangkat dari browser" di Act 1
- Elemen yang bergerak harus bergerak dalam satu arah konsisten dengan narasi
  (ke bawah = pergi ke tujuan, ke atas = kembali ke pengirim)
- Gunakan dual-color path: arah pergi = satu warna, arah balik = warna berbeda

**❌ DON'T:**
- Jangan gerakkan elemen "balik ke atas" kalau narasi belum menyatakan perjalanan balik
- Jangan mulai path hanya dari node tengah — path harus connected dari node awal
- Jangan biarkan amplop terbang tanpa path menyala bersamaan (path dan pergerakan
  elemen harus sinkron)

---

## Bagian 2 — Urutan Wajib Sebelum Coding (Pre-Planning Checklist)

Ini adalah langkah yang WAJIB selesai sebelum menyentuh `Animation.jsx`:

```
[ ] 1. STORYBOARD NARATIF
    [ ] 1.1. Tulis deskripsi setiap Act (max 4 Act): siapa, di mana, apa yang terjadi
    [ ] 1.2. Validasi analogi vs akurasi teknis (tanya "apakah ini benar?")
    [ ] 1.3. Tandai momen cause → effect di setiap beat
    [ ] 1.4. Definisikan: elemen apa yang persist antar-Act

[ ] 2. AUDIT ELEMEN VISUAL
    [ ] 2.1. List semua elemen visual topic (karakter, benda, badge, teks)
    [ ] 2.2. Kategorikan per elemen: inline SVG atau icon PNG
         Inline SVG jika: ada animasi internal (rotasi, buka/tutup, ekspresi ganti)
         Icon PNG jika: statis atau maksimal 2 varian (open/closed)
    [ ] 2.3. Audit tambahan: Badge/TextCard/SpeechBubble → perlu prop icon?

[ ] 3. ICON PLANNING (WAJIB sebelum generate satupun PNG)
    [ ] 3.1. Tulis draf icons.json LENGKAP (semua batch, semua slot)
    [ ] 3.2. Tentukan sumber setiap icon: chatgpt atau download
    [ ] 3.3. Rencanakan batch layout: grid 2×4, slot-8 selalu [EMPTY]
    [ ] 3.4. Tulis prompt ChatGPT untuk setiap batch

[ ] 4. LAYOUT PLANNING
    [ ] 4.1. Bagi canvas ke zona per aktor (lihat template di §Bagian 4)
    [ ] 4.2. Assign Y range kasar per zona (bukan pixel presisi, tapi range)
    [ ] 4.3. Identifikasi elemen yang bisa tampil bersamaan → cek collision Y
    [ ] 4.4. Definisikan FlowchartSpine: semua node + semua waypoint path (termasuk Act 1)

[ ] 5. CAPTION & TEKS PLANNING
    [ ] 5.1. Tulis semua caption (≤5 kata, deklaratif, tanpa emoji, tanpa tanda tanya)
    [ ] 5.2. Map setiap caption ke elemen visual yang dibahas (bukan ke Act, tapi ke elemen)
    [ ] 5.3. Verifikasi: caption muncul SETELAH visual context ada di layar

[ ] 6. ACT STRUCTURE
    [ ] 6.1. Definisikan durasi per Act (total 40-60s, distribusi wajar)
    [ ] 6.2. Per elemen: kapan popIn, kapan popOut — TIDAK BOLEH ada elemen tanpa popOut
    [ ] 6.3. Cek: ada buffer nganggur > 0.5s yang bisa dipangkas?
```

---

## Bagian 3 — Urutan Wajib Saat Coding (Execution Order)

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
```

---

## Bagian 4 — Artefak Wajib (Mandatory File List)

Setiap topic WAJIB punya semua file berikut sebelum dianggap "selesai":

| File | Lokasi | Dibuat kapan | Catatan |
|---|---|---|---|
| `data.js` | `src/content/<topic>/` | Sebelum Animation.jsx | Semua string constants + PHASES |
| `manifest.js` | `src/content/<topic>/` | Sebelum Animation.jsx | Metadata topic |
| `Animation.jsx` | `src/content/<topic>/` | Setelah data.js + icons/ | Main animation |
| `caption.md` | `src/content/<topic>/` | Setelah animasi jalan | Narasi video |
| `icons/icons.json` | `src/content/<topic>/icons/` | Sebelum generate PNG | Full icon plan |
| `icons/default-icon.png` | `src/content/<topic>/icons/` | Sebelum loader.js | Placeholder lokal |
| `icons/loader.js` | `src/content/<topic>/icons/` | Setelah icons.json | Export getIcon() |
| `_docs/TOPIC_PLAN.md` | `src/content/<topic>/_docs/` | Sebelum coding | Storyboard + layout |

---

## Bagian 5 — Template Layout Zona Canvas

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

## Bagian 6 — Contoh Buruk vs Contoh Baik (dari Kasus Nyata)

### E.1 — Analogi yang Tervalidasi

**❌ Contoh buruk (`14-http-request-response` awal):**
> "Browser = Tukang Pos" → salah, karena kurir itu satu arah, tidak menerima balasan kembali

**✅ Contoh baik (setelah revisi-11):**
> "Browser kirim surat, bukan comot langsung" → browser = pengirim, bukan kurir

---

### E.2 — Caption Timing

**❌ Contoh buruk:**
> `ENVELOPE_SEALED_CAPTION = 'Surat siap! ✉️'` → muncul saat amplop baru disegel di Act 1,
> padahal perjalanan masih panjang (DNS → server → response)

**✅ Contoh baik:**
> `ENVELOPE_SEALED_CAPTION = 'Surat berangkat!'` → kata "berangkat" menandakan
> ini awal perjalanan, bukan akhir

---

### E.3 — Layout Collision

**❌ Contoh buruk (sebelum revisi-08):**
> 8 elemen tumpuk vertikal di layar bersamaan saat Act 1 dan "Nulis Surat"
> bergabung — hookBubble, hookRevealCard, hookCliffhangerBadge masih tampil
> saat methodBadge, addressLabel, dll. baru muncul

**✅ Contoh baik (setelah revisi-08):**
> hookBubble di-popOut di t+5.0 (bersamaan hookRevealCard muncul),
> hookRevealCard di-popOut di t+7.1 — layar bersih sebelum "Nulis Surat" mulai

---

### E.4 — Path Connectivity

**❌ Contoh buruk (sebelum revisi-12):**
> `FORWARD_POINTS` dimulai dari Browser → DNS langsung, tidak ada segmen
> "Browser → Amplop Act 1" → penonton tidak melihat benang saat Act 1

**✅ Contoh baik (setelah revisi-12):**
> `FORWARD_POINTS` 4 titik: Browser(410,260) → Amplop(410,700) → DNS(610,620) → Server(410,900)
> → `forwardPathPct` mulai dari 0→0.33 di Act 1, nyambung terus ke Act 2

---

### E.5 — Arah Elemen vs Narasi

**❌ Contoh buruk (sebelum revisi-14):**
> `reqEnvelope` morph naik ke y=330 setelah sebelumnya amplop turun ke y=700
> → terlihat amplop "balik ke browser" padahal seharusnya sedang berangkat

**✅ Contoh baik (setelah revisi-14):**
> Default `reqEnvelopePos = {x:410, y:700}`, amplop diam di posisi landed
> tanpa morph naik — konsisten dengan narasi "surat sedang dipersiapkan
> untuk berangkat dari posisi yang sama dengan saat landing"

---

## Catatan untuk Penulisan Doc Final

Saat doc ini dieksekusi (ditulis ke `docs/standardizations/09-standar-pembuatan-konten.md`),
beberapa hal yang perlu diperhatikan:

1. **Numbering doc:** Akan jadi `09-standar-pembuatan-konten.md` —
   nomor setelah `08-audio-sfx-generation.md` yang sudah ada.

2. **Cross-reference ke doc lain yang sudah ada:**
   - Referensikan `06-icon-generation.md` untuk detail icon (jangan duplikasi)
   - Referensikan `05-svg-text-guide.md` untuk formula collision teks
   - Referensikan `03-tutorial-buat-topic-baru.md` untuk overall flow pembuatan topic
   - Doc 09 ini spesifik tentang **standar pre-planning dan anti-pattern** yang
     tidak ada di doc lain

3. **Scope doc 09:** Bukan tutorial step-by-step (itu sudah ada di `03-tutorial`),
   tapi fokus ke **checklist wajib + anti-pattern** yang ditemukan dari kasus nyata.

4. **Update doc 03 (tutorial):** Setelah doc 09 ada, perlu tambah referensi
   ke doc 09 di bagian awal `03-tutorial-buat-topic-baru.md`
   (baris "Sebelum mulai, baca juga: `09-standar-pembuatan-konten.md`").

5. **Update PROJECT_STRUCTURE.md:** Tambah entry `09-standar-pembuatan-konten.md`
   ke daftar folder `docs/` di PROJECT_STRUCTURE.md.
