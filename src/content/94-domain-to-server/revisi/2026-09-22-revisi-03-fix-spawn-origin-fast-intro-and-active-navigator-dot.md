# Plan Revisi 03 — Fix Origin (Top-Left Spawn Issue), Fast Morph Intro, & Act Badge Active Index in Content 94

**Tanggal:** 2026-09-22  
**Target Content:** `94-domain-to-server`  
**Status:** 🚧 IN PROGRESS (Dieksekusi 2026-09-22, esbuild lolos; preview manual belum)

---

## 1. Latar Belakang & Masalah (Problem Statement)

1. **Masalah Icon/Elemen Selalu Muncul dari Pojok Kiri Atas (Top-Left Spawn Issue):**
   - Saat state posisi seperti `domainChipPos`, `dnsQueryPos`, `requestPacketPos`, dan `responsePos` diinisialisasi di state React:
     ```javascript
     const [domainChipPos, setDomainChipPos] = useState({ x: 0, y: 0 })
     const [requestPacketPos, setRequestPacketPos] = useState({ x: 0, y: 0 })
     ```
   - Sebelum timeline GSAP mengupdate koordinat sebenarnya, elemen-elemen tersebut ter-render sekejap di `x: 0, y: 0` (pojok kiri atas canvas) sehingga terlihat seolah-olah "meloncat" atau muncul tiba-tiba dari pojok kiri atas saat `popIn`.
   - **Solusi**: Inisialisasi awal koordinat state harus langsung mengacu pada posisi awal stasiun sumbernya (misal `ZONES.BROWSER` atau `ZONES.BACKEND_A`).

2. **Masalah Intro ke Header Transisi Sangat Lambat:**
   - Durasi morph `IntroHeaderMorphV1` diset sebesar `1.8s` + delay buffer `0.3s` (total > 2.1 detik) sebelum `contentStarted = true`.
   - Audiens merasa menunggu terlalu lama hanya untuk melihat animasi dimulai.
   - **Solusi**: Memangkas durasi morph menjadi **`0.8s`** (seperti di standar topic `44-ssh` / `81-network-interface`) agar transisi ke mode compact terjadi secara cepat dan responsif.

3. **Masalah Act Badge Navigator Dot Tidak Menyala (Active Index Mismatch):**
   - `ActBadgeNavigatorV1` dipanggil dengan prop `activePhaseIdx={phaseIdx}`. Namun standar komponen `ActBadgeNavigatorV1` menerima prop **`activeIndex={phaseIdx}`** (bukan `activePhaseIdx`).
   - Akibat ketidakcocokan nama prop ini, `ActBadgeNavigatorV1` tidak mengetahui Act mana yang sedang aktif, sehingga indikator titik/bullet aktif (*active dot/badge*) tidak menyala pada badge navigator di bagian atas.
   - **Solusi**: Mengganti prop `activePhaseIdx={phaseIdx}` menjadi `activeIndex={phaseIdx}`.

---

## 2. Rencana Perubahan Detail (Detailed Plan)

### A. Perbaikan Spawn Position & Initial State (`Animation.jsx`)

1. **Inisialisasi Posisi Awal Sesuai Stasiun Sumber:**
   ```javascript
   // Inisialisasi koordinat langsung ke stasiun sumber (Bukan 0,0!)
   const [domainChipPos, setDomainChipPos] = useState({ x: ZONES.BROWSER.x, y: ZONES.BROWSER.y + 60 })
   const [dnsQueryPos, setDnsQueryPos] = useState({ x: ZONES.BROWSER.x, y: ZONES.BROWSER.y + 60 })
   const [requestPacketPos, setRequestPacketPos] = useState({ x: ZONES.BROWSER.x, y: ZONES.BROWSER.y + 60 })
   const [responsePos, setResponsePos] = useState({ x: ZONES.BACKEND_A.x, y: ZONES.BACKEND_A.y })
   ```

2. **Reset Posisi Presisi pada Init Master Timeline Loop:**
   - Di awal loop `masterTimeline`, pastikan koordinat posisi packet di-reset kembali ke titik asal stasiun sumber sebelum `popIn` terjadi.

---

### B. Percepatan Morph Intro (`Animation.jsx`)

1. **Memotong Morph Duration dari 1.8s ke 0.8s:**
   ```javascript
   const morphDur = 0.8 // Dipangkas dari 1.8s agar cepat & responsif!
   master.to({}, {
     duration: morphDur,
     onUpdate: function() { setMorphP(this.progress()) }
   }, time)
   time += morphDur
   ```

---

### C. Perbaikan Active Bullet Indicator pada `ActBadgeNavigatorV1` (`Animation.jsx`)

1. **Mengubah Nama Prop `activePhaseIdx` ➔ `activeIndex`:**
   ```jsx
   {contentStarted && (
     <ActBadgeNavigatorV1
       phases={PHASES}
       activeIndex={phaseIdx} // Correct prop name!
       totalDuration={TOTAL_DURATION}
     />
   )}
   ```

---

## 3. Rencana Verifikasi

1. **Syntax Check & Build Test:**
   - Menjalankan esbuild check untuk memastikan tidak ada kesalahan syntax JSX.
2. **Visual & Behavioral Inspection:**
   - Memastikan tidak ada lagi icon/packet yang meletup (*spawn*) dari pojok kiri atas `(0,0)`.
   - Memastikan morph intro berjalan cepat (**0.8s**) dan mulus.
   - Memastikan indikator bullet pada `ActBadgeNavigatorV1` menyala terang pada Act yang sedang aktif (Act 1 ➔ Act 2 ➔ Act 3 ➔ Act 4).

---

## 4. Ringkasan Status

- [x] Menyusun dokumen plan revisi 03 di `src/content/94-domain-to-server/revisi/2026-09-22-revisi-03-fix-spawn-origin-fast-intro-and-active-navigator-dot.md`.
- [x] Memperbarui indeks revisi `src/content/94-domain-to-server/revisi/README.md`.
- [x] Eksekusi kode (2026-09-22) — ketiga fix (A/B/C) dieksekusi sesuai plan.
      esbuild lolos. Lihat §5 untuk temuan tambahan (akar masalah #1 lebih
      dalam dari yang plan sebutkan, tapi fix yang sama tetap menutup gejalanya).

## 5. Temuan tambahan saat audit sebelum eksekusi (2026-09-22)

Verifikasi terhadap kode nyata sebelum eksekusi (bukan asumsi):

- **Klaim #3 (prop `activeIndex`)**: dikonfirmasi 100% benar — dibaca
  langsung dari `ActBadgeNavigatorV1.jsx`, propnya memang `activeIndex`,
  bukan `activePhaseIdx`. Prop yang salah nama itu diabaikan React (bukan
  error), jadi component selalu fallback ke `list[0]` (Act 1) dan tidak
  ada dot yang pernah `isActive` — bug nyata, fix sesuai plan.
- **Klaim #2 (morph 0.8s)**: dikonfirmasi — `44-ssh/Animation.jsx` memang
  pakai `duration: 0.8` untuk morph intro-nya. Fix sesuai plan.
- **Klaim #1 (spawn dari 0,0) — akar masalah lebih dalam dari deskripsi
  plan**: plan bilang ini murni soal `useState` default `{x:0,y:0}`.
  Audit kode menunjukkan ada masalah kedua yang lebih serius: setiap
  `master.to(xxxPos, {...})` men-tween OBJECT STATE REACT LANGSUNG lewat
  closure `useEffect(() => {...}, [])` — closure ini membeku di render
  pertama, jadi `xxxPos` di dalam closure adalah reference OBJECT YANG
  SAMA selamanya, terpisah total dari object baru yang dibuat tiap kali
  `setXxxPos(...)` dipanggil (React selalu bikin object baru). Efeknya:
  tween GSAP membaca nilai AWAL closure itu (yang beku di `{0,0}`) sebagai
  titik mulai animasi — bukan posisi yang baru saja di-set via
  `setXxxPos()` di callback sebelumnya — sehingga packet sempat terlihat
  di posisi benar untuk satu frame, lalu "dikoreksi paksa" oleh tween
  balik ke arah dari (0,0). Mengubah nilai default `useState` (sesuai
  plan) **cukup untuk menutup gejala ini**, karena closure object yang
  beku itu ikut memulai dari nilai default baru yang sudah benar, bukan
  `{0,0}` lagi — tapi ini bukan fix arsitektural, cuma menutup gejala.
  Fix arsitektural sebenarnya (mis. pakai `useRef` untuk target tween,
  bukan tween langsung ke state React) TIDAK dieksekusi — di luar scope
  plan ini, dan berisiko lebih besar untuk perubahan sebesar itu tanpa
  preview visual buat verifikasi.
  - Konsekuensi praktis dari akar masalah ini: `requestPacketPos` dipakai
    ULANG di Act 2 DAN Act 3 (bukan cuma sekali) — jadi ada 1 titik lagi
    yang saya perbaiki di luar 4 baris `useState` yang diminta plan:
    reset eksplisit sebelum tween Act 3 sebelumnya `{x: ZONES.EDGE.x,
    y: ZONES.EDGE.y + 80}`, padahal tween Act 2 akan meninggalkan closure
    object itu tepat di `{ZONES.EDGE.x, ZONES.EDGE.y}` (tanpa offset
    +80) — jadi ada residual "lompatan kecil" 80px yang tidak disebut di
    plan. Sudah diluruskan jadi `{x: ZONES.EDGE.x, y: ZONES.EDGE.y}` biar
    match persis dengan titik akhir tween Act 2.

**Observasi tidak dieksekusi (di luar scope revisi ini)**: prop
`totalDuration={TOTAL_DURATION}` yang dikirim ke `ActBadgeNavigatorV1`
sebenarnya bukan prop yang diterima component itu (lihat signature di
`ActBadgeNavigatorV1.jsx` — tidak ada `totalDuration` di daftar prop).
Tidak error (React abaikan prop tak dikenal), tapi ini kemungkinan dead
prop. Tidak disentuh karena tidak disebut di plan revisi-03 dan bukan
bug yang berdampak visual — dicatat di sini kalau mau dibersihkan nanti.
