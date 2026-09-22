# Plan — Fix: Garis Tengah Mesh (Act 5) Hilang di Hasil Export

**Status**: ANALISA + PLANNING ONLY — belum ada kode yang diubah.
**Trigger**: User report — di preview browser, garis-garis mesh Act 5 (hp ↔
rumah/kantor/server) semuanya tampil termasuk garis tengah (hp↔cloud/server),
tapi di hasil **export video**, garis tengah itu hilang.
**Scope dokumen**: analisa root cause + rencana perbaikan bertingkat.
Tidak ada implementasi kode di sesi ini (sesuai instruksi user).

---

## 1. Ringkasan Temuan (Executive Summary)

Kemungkinan besar root cause: **`tailscale/Animation.jsx` tidak expose
`window.__flushSync`**, padahal script export (`export-lib.js` &
`export-parallel.mjs`) sudah dirancang untuk memakainya saat seek frame,
dan fallback diam-diam ke `tl.totalTime(time, false)` biasa kalau tidak ada.

Topic `virtual-memory` pernah mengalami bug identik (frame "freeze" karena
setState hasil seek tidak ter-commit ke DOM sebelum screenshot diambil) dan
sudah diperbaiki dengan cara expose `window.__flushSync = flushSync` (dari
`react-dom`) di awal timeline-nya. Perbaikan ini **tidak pernah didokumentasikan
sebagai standar wajib** di `docs/`, sehingga tidak ikut diterapkan ke topic
lain termasuk `tailscale`.

Act 5 Tailscale adalah kandidat paling rentan kena efek ini karena py di situ
ada **6 `popIn()` yang jalan berurutan sangat rapat** (tiap 0.15 detik) untuk
6 garis mesh — kondisi paling mirip dengan yang memicu bug di virtual-memory.
`meshLine-pc` (garis tengah, hp↔cloud) adalah **yang terakhir** dalam urutan
itu, sehingga paling rentan "ke-skip" kalau commit React telat.


## 2. Bukti / Jejak Investigasi

### 2.1. Kode Act 5 (mesh lines) — `src/content/tailscale/Animation.jsx`

Definisi garis (render):
```
const nodes = { h: [...anchorY.home], o: [...anchorY.office], p: [366,120], c: [366,470] }
const pairs = [['h','o','ho'], ['h','p','hp'], ['h','c','hc'], ['o','p','op'], ['o','c','oc'], ['p','c','pc']]
```
`p` = HP (top-center), `c` = server/cloud (bottom-center) → garis `pc`
adalah garis **vertikal lurus di tengah layar** — inilah "garis tengah"
yang dimaksud user.

Timeline pop-in garis (sangat rapat, 150ms per garis):
```
;['meshLine-ho','meshLine-hp','meshLine-hc','meshLine-op','meshLine-oc','meshLine-pc']
  .forEach((id, i) => popIn(tl, t + 2.1 + i * 0.15, id, { duration: 0.3, sfx: true }))
```
`meshLine-pc` = elemen ke-6 (terakhir), popIn dimulai di `t+2.85`.

### 2.2. Mekanisme seek saat export — `scripts/export-lib.js` (mode 1×) &
`scripts/export-parallel.mjs` (mode paralel)

Keduanya melakukan pola yang sama per frame:
```js
if (window.__flushSync) {
  try { window.__flushSync(() => tl.totalTime(time, false)) }
  catch { tl.totalTime(time, false) }
} else {
  tl.totalTime(time, false)   // ← fallback diam-diam, TANPA flushSync
}
```
Komentar developer di `export-lib.js` (pola PASS 2) secara eksplisit
menjelaskan kenapa `flushSync` diperlukan:
> "flushSync forces React 18 to commit the seek's setState calls to the DOM
> synchronously. Without it, seek-driven commits are deferred ... and only
> land when a real input event forces a flush — leaving every frame between
> those events frozen."

### 2.3. Perbandingan dengan `virtual-memory/Animation.jsx` (topic yang SUDAH pernah kena bug ini dan sudah fix)

```js
import { flushSync } from 'react-dom'
...
useEffect(() => {
  const tl = gsap.timeline({ repeat: -1, repeatDelay: 1 })
  tlRef.current = tl
  window.__animationTimeline = tl
  window.__flushSync = flushSync     // ← baris kunci, TIDAK ADA di tailscale
  ...
```

### 2.4. Hasil grep di seluruh project

- `grep "__flushSync" src/` → **hanya muncul di `virtual-memory/Animation.jsx`**.
  Semua topic lain (`tailscale`, `mcp-servers`, `linux-vs-unix`,
  `desktop-environment`, `file-permission`, `process-vs-thread`,
  `shell-pipeline`, `linux-kernel-architecture`, `linux-vs-windows`,
  `what-is-kernel`) TIDAK punya baris ini.
- `grep "flushSync" docs/` → **0 hasil**. Pola ini tidak pernah ditulis
  sebagai standar wajib di `docs/02-standar-konten.md` atau
  `docs/03-tutorial-buat-topic-baru.md` atau `docs/04-referensi-gsap.md`.

→ Kesimpulan: fix ini murni "tribal knowledge" yang berhenti di satu topic,
tidak pernah di-generalisasi. Tailscale (dan semua topic lain kecuali
virtual-memory) berpotensi kena bug kelas yang sama.

## 3. Root Cause — Primary Hypothesis

**H1 (paling mungkin, confidence tinggi)**: `tailscale/Animation.jsx` tidak
set `window.__flushSync`. Saat export melakukan seek cepat berurutan
(`tl.totalTime(t, false)` dipanggil dari `page.evaluate`, di luar siklus
event React normal), setState hasil `popIn()` untuk 6 garis mesh yang
terjadi sangat rapat (150ms per garis) berisiko "menumpuk" dalam batch
React 18 dan tidak sempat ter-commit sebelum screenshot frame diambil.
Karena `meshLine-pc` adalah item TERAKHIR dalam urutan pop-in itu, ia yang
paling rentan "ke-skip"/ke-render di frame yang salah.

Ini **konsisten 100%** dengan gejala: normal di preview (di preview, timeline
jalan natural via requestAnimationFrame — React selalu sempat flush di siklus
render normal), tapi hilang khusus di export (di export, dipaksa seek diskrit
dan tidak ada flushSync sebagai pengaman).

## 4. Hipotesis Sekunder (untuk didiskualifikasi/dikonfirmasi saat investigasi lanjutan)

**H2 — Frame boundary di mode export paralel**: `export-parallel.mjs` membagi
total frame ke N worker Chrome terpisah. Worker yang bukan worker pertama
langsung melakukan lompatan besar dari `t=0` ke frame awal jatahnya dalam
SATU panggilan `tl.totalTime()`. Secara teori GSAP tetap memproses semua
callback yang dilewati dalam urutan yang benar walau lompat jauh (ini cara
kerja "seek" GSAP yang terdokumentasi), jadi risiko H2 lebih rendah dari H1 —
tapi tetap perlu diverifikasi terpisah, terutama kalau H1 sudah difix dan bug
masih muncul (atau muncul hanya di mode paralel, tidak di mode 1×).

**H3 — Z-order/overlap kosmetik**: `ServerBox` (untuk `meshCloud`) digambar
SETELAH garis-garis mesh dan rect solid-nya menutupi ~35px ujung bawah garis
`pc`. Ini murni kosmetik, sama persis di preview & export (kode identik), jadi
TIDAK bisa menjelaskan "hilang di export tapi ada di preview" — dicatat hanya
sebagai potensi tuning visual terpisah, bukan bug utama.

**H4 — Race condition SFX/lain saat popIn `sfx:true`**: Semua 6 garis mesh
punya `sfx: true` (default), memicu `sfxLoader.ui(...)` di `onStart` tiap
tween. Saat export SFX di-disable (`setEnabled(false)`), harusnya tidak
berefek ke visual — kemungkinan besar tidak relevan, tapi dicatat untuk
completeness.

## 5. Cara Konfirmasi H1 Sebelum Coding (Verifikasi, TANPA ubah kode)

1. Pakai flag debug yang SUDAH ADA di `export-lib.js`
   (`process.env.DEBUG_PASS2=1`) — kode ini sudah menyuntik probe
   `window.__cbFired`, `window.__ouCount`, `window.__mutCount` dsb ke
   timeline yang di-capture. Jalankan export topic `tailscale` dengan
   env ini aktif, fokus ke rentang waktu Act 5 (`t+2.1` s/d `t+3.2` relatif
   ke start Act 5).
2. Bandingkan log `[DBG] f<i> t=... md5=...` di sekitar frame yang
   berkorespondensi dengan waktu pop-in `meshLine-pc` — cek apakah
   `mutCount` (jumlah DOM mutation) naik sesuai ekspektasi di frame itu,
   atau malah nol/telat.
3. (Opsional, lebih murah) Screenshot manual: jalankan capture-frame loop
   yang sama persis tapi HANYA untuk rentang 1 detik di sekitar `t+2.85`
   Act 5, dengan resolusi lebih rapat (mis. tiap 0.02s), lalu inspeksi
   visual garis `pc` muncul di frame mana persis vs kapan seharusnya.

## 6. Rencana Perbaikan (Task Hierarchy — BELUM DIEKSEKUSI)

### 6.1. Fix Utama: Expose `window.__flushSync` di Tailscale

#### 6.1.1. Tambah import `flushSync`
- 6.1.1.1. Tambahkan `import { flushSync } from 'react-dom'` di bagian
  import teratas `src/content/tailscale/Animation.jsx` (sejajar dengan
  `import gsap from 'gsap'`).

#### 6.1.2. Expose ke `window` di awal master timeline
- 6.1.2.1. Di dalam `useEffect` master timeline (persis setelah
  `window.__animationTimeline = tl`), tambahkan baris
  `window.__flushSync = flushSync` — meniru persis pola `virtual-memory`.
- 6.1.2.2. Pastikan cleanup function (`return () => { tl.kill(); ... }`)
  juga membersihkan `window.__flushSync` (opsional tapi rapi — cek dulu
  apakah `virtual-memory` melakukan cleanup ini juga atau tidak, biar
  konsisten pola).

#### 6.1.3. Tidak ada perubahan lain diperlukan
- 6.1.3.1. `export-lib.js` & `export-parallel.mjs` SUDAH mendukung
  `window.__flushSync` secara otomatis (conditional check sudah ada) —
  jadi begitu topic expose fungsi ini, kedua mode export (1× dan paralel)
  otomatis ikut terpakai tanpa perlu ubah script export sama sekali.

### 6.2. Verifikasi Fix

#### 6.2.1. Re-export video tailscale (mode 1× dan mode paralel, keduanya)
- 6.2.1.1. Export mode 1× (single Chrome) → cek Act 5 garis `pc` muncul.
- 6.2.1.2. Export mode paralel (default 4 workers) → cek juga, karena
  paralel lebih rawan (banyak proses Chrome terpisah, lebih banyak titik
  potensi race).

#### 6.2.2. Spot-check frame di sekitar Act 5
- 6.2.2.1. Ambil screenshot/frame di rentang `t+2.85` s/d `t+3.2` relatif
  Act 5 mulai, pastikan garis `pc` (dan 5 garis lain) semua tampil di
  urutan yang benar dan tidak ada yang "melompat" langsung full-opacity
  atau ke-skip total.

#### 6.2.3. Regression check elemen lain di Act 5 & Act lain
- 6.2.3.1. Pastikan fix ini tidak mengubah perilaku popIn/tween lain yang
  SEBELUMNYA sudah tampil normal di export (mis. badge, closing card) —
  `flushSync` seharusnya hanya mempercepat commit, bukan mengubah value.

### 6.3. Audit & Generalisasi ke Topic Lain (Preventif)

#### 6.3.1. Audit semua topic lain untuk pola popIn rapat berurutan
- 6.3.1.1. Cek `mcp-servers`, `linux-vs-unix`, `desktop-environment`,
  `file-permission`, `process-vs-thread`, `shell-pipeline`,
  `linux-kernel-architecture`, `linux-vs-windows`, `what-is-kernel` —
  cari pola `forEach(...).popIn(...)` atau beberapa `tl.add`/`tl.to` yang
  timing-nya berdekatan (<0.2s antar elemen), karena itu kondisi paling
  rawan kena bug sejenis.
- 6.3.1.2. Prioritaskan topic yang PERNAH di-export dan dipakai user
  (bukan yang masih draft), supaya fix diarahkan ke dampak nyata dulu.

#### 6.3.2. Terapkan pola `window.__flushSync` sebagai standar wajib
- 6.3.2.1. Tambahkan `window.__flushSync = flushSync` ke SEMUA topic yang
  membangun `gsap.timeline` sendiri (bukan cuma yang kena bug kelihatan) —
  ini murah untuk ditambahkan dan tidak ada downside, jadi masuk akal jadi
  bagian dari boilerplate wajib topic baru.

#### 6.3.3. Dokumentasikan sebagai standar resmi (supaya tidak hilang lagi)
- 6.3.3.1. Tambahkan section baru di `docs/02-standar-konten.md` (atau
  `docs/04-referensi-gsap.md`) berjudul kira-kira "Export Safety: Wajib
  Expose `window.__flushSync`" — jelaskan kenapa (React 18 batching +
  seek-based capture), kapan wajib (semua topic dengan GSAP timeline
  sendiri), dan contoh kode persis dari `virtual-memory`.
- 6.3.3.2. Tambahkan juga ke `docs/03-tutorial-buat-topic-baru.md` sebagai
  salah satu checklist step wajib saat membuat topic baru, supaya topic
  berikutnya tidak mengulang bug yang sama.

## 7. Risiko & Catatan

- **Risiko fix rendah**: `flushSync` dari React hanya memaksa commit
  sinkron untuk update yang sudah dijadwalkan — tidak mengubah logic
  animasi/value apa pun. `virtual-memory` sudah pakai pola ini di
  production tanpa masalah yang dilaporkan.
- **Kalau setelah fix H1 masalah masih muncul** (terutama hanya di mode
  paralel), baru lanjut investigasi H2 (frame boundary antar worker) —
  jangan digabung sekaligus supaya mudah isolasi penyebabnya.
- **Tidak menyentuh** `export-lib.js` / `export-parallel.mjs` sama sekali
  di fix utama ini — keduanya sudah siap pakai `flushSync` begitu tersedia.

## 8. Deliverable Sesi Berikutnya (saat eksekusi disetujui)

- Kode: 1 baris import + 1 baris `window.__flushSync = flushSync` di
  `tailscale/Animation.jsx` (lihat 6.1).
- Video: re-export tailscale (1× & paralel) untuk verifikasi visual.
- Dokumentasi: update `docs/02-standar-konten.md` +
  `docs/03-tutorial-buat-topic-baru.md` (lihat 6.3.3).
- (Opsional, terpisah) Audit report topic lain (lihat 6.3.1) kalau mau
  sekalian preventif.

---

**Menunggu approval sebelum eksekusi.**
