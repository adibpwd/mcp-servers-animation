# PNG Asset Plan — Linux vs Unix History Animation
> File: `src/content/linux-vs-unix/Animation-history.jsx`
> Disimpan di: `public/images/linux-vs-unix/`
> Dipakai sebagai `<image href="/images/linux-vs-unix/NAMA.png" />`

---

## RINGKASAN KEBUTUHAN

| # | File PNG | Dipakai di | Prioritas |
|---|----------|-----------|-----------|
| 1 | `ken-thompson.png` | Act 1 — gantikan lingkaran "KT" | 🔴 Tinggi |
| 2 | `dennis-ritchie.png` | Act 1 — gantikan lingkaran "DR" | 🔴 Tinggi |
| 3 | `pdp7.png` | Act 1 — ilustrasi komputer PDP-7 | 🔴 Tinggi |
| 4 | `bell-labs.png` | Act 1 — logo/gedung Bell Labs | 🟡 Sedang |
| 5 | `bsd-daemon.png` | Act 2 — maskot BSD (Beastie) | 🔴 Tinggi |
| 6 | `gnu-logo.png` | Act 2 & 3 — logo GNU (kepala wildebeest) | 🔴 Tinggi |
| 7 | `hp-logo.png` | Act 2 — logo Hewlett-Packard | 🟡 Sedang |
| 8 | `ibm-logo.png` | Act 2 — logo IBM | 🟡 Sedang |
| 9 | `sun-logo.png` | Act 2 — logo Sun Microsystems | 🟡 Sedang |
| 10 | `posix-badge.png` | Act 2 — badge/simbol standar POSIX/IEEE | 🟡 Sedang |
| 11 | `linus-torvalds.png` | Act 3 — gantikan lingkaran "LT" | 🔴 Tinggi |
| 12 | `tux.png` | Act 3, 4, 5 — maskot Linux (penguin Tux) | 🔴 Tinggi |
| 13 | `kernel-logo.png` | Act 3 — logo kernel Linux (stilisasi) | 🟡 Sedang |
| 14 | `distro-ubuntu.png` | Act 4 — logo Ubuntu | 🔴 Tinggi |
| 15 | `distro-debian.png` | Act 4 — logo Debian | 🔴 Tinggi |
| 16 | `distro-arch.png` | Act 4 — logo Arch Linux | 🔴 Tinggi |
| 17 | `distro-fedora.png` | Act 4 — logo Fedora | 🟡 Sedang |
| 18 | `distro-redhat.png` | Act 4 — logo Red Hat | 🟡 Sedang |
| 19 | `distro-mint.png` | Act 4 — logo Linux Mint | 🟡 Sedang |
| 20 | `distro-manjaro.png` | Act 4 — logo Manjaro | 🟢 Rendah |
| 21 | `android-logo.png` | Act 4 & 5 — logo Android | 🔴 Tinggi |
| 22 | `apple-logo.png` | Act 5 — logo Apple (macOS/iOS) | 🔴 Tinggi |
| 23 | `freebsd-logo.png` | Act 5 — logo FreeBSD | 🟡 Sedang |
| 24 | `server-icon.png` | Act 5 — ikon server/cloud (generic) | 🟡 Sedang |
| 25 | `supercomputer.png` | Act 5 — ikon supercomputer | 🟡 Sedang |

---

## DETAIL PER ACT

---

### ACT 1 — LAHIRNYA UNIX (1969)

**Kondisi sekarang:** Dua lingkaran teks "KT" dan "DR", kotak teks PDP-7.

**Yang perlu ditambah:**

#### `ken-thompson.png`
- **Dipakai:** Gantikan `<circle r={32}>` + teks "KT"
- **Visual:** Foto/ilustrasi wajah Ken Thompson (berkacamata, rambut lebat)
- **Ukuran render:** ~64×64 px dalam SVG
- **Style:** Cropped lingkaran, high-contrast, semi-stylized (bukan foto persis, tapi ilustrasi yang jelas)
- **Catatan:** Bisa pakai versi pixel art / flat illustration style agar konsisten

#### `dennis-ritchie.png`
- **Dipakai:** Gantikan `<circle r={32}>` + teks "DR"
- **Visual:** Foto/ilustrasi wajah Dennis Ritchie
- **Ukuran render:** ~64×64 px dalam SVG
- **Style:** Sama dengan ken-thompson.png — konsisten satu gaya

#### `pdp7.png`
- **Dipakai:** Gantikan kotak teks PDP-7 di tengah Act 1
- **Visual:** Ilustrasi komputer mainframe PDP-7 tahun 1960an (monitor + bodi besar)
- **Ukuran render:** ~120×100 px dalam SVG
- **Style:** Retro illustration, warna sepia/amber sesuai COLORS.UNIX

#### `bell-labs.png`
- **Dipakai:** Background kecil / watermark di kiri atas Act 1
- **Visual:** Logo Bell Labs lama (ikon telepon / tulisan Bell)
- **Ukuran render:** ~80×40 px dalam SVG
- **Style:** Monokrom / amber

---

### ACT 2 — UNIX PECAH & POSIX (1977–1992)

**Kondisi sekarang:** Kotak-kotak teks per varian Unix. Kosong, tidak ada identitas visual.

**Yang perlu ditambah:**

#### `bsd-daemon.png`
- **Dipakai:** Ikon dalam kotak node BSD
- **Visual:** Maskot BSD "Beastie" — setan merah kecil bawa trisula, sangat ikonik
- **Ukuran render:** ~48×48 px dalam node card
- **Style:** Flat/vector, merah–oranye

#### `gnu-logo.png`
- **Dipakai:** Ikon dalam kotak node GNU Project (Act 2) dan kotak "GNU (1983)" (Act 3)
- **Visual:** Kepala gnu/wildebeest — maskot resmi GNU
- **Ukuran render:** ~48×48 px
- **Style:** Flat, warna emas/kuning sesuai COLORS.GOLD

#### `hp-logo.png`
- **Dipakai:** Ikon dalam kotak node HP-UX
- **Visual:** Logo HP (dua huruf biru, atau biru-putih)
- **Ukuran render:** ~48×28 px
- **Style:** Simplified, kontras di atas dark background

#### `ibm-logo.png`
- **Dipakai:** Ikon dalam kotak node AIX (IBM)
- **Visual:** Logo IBM klasik (horizontal stripes biru)
- **Ukuran render:** ~60×24 px
- **Style:** Simplified, high-contrast

#### `sun-logo.png`
- **Dipakai:** Ikon dalam kotak node Solaris (Sun Microsystems)
- **Visual:** Logo Sun ("sun" dalam tipografi melingkar) atau logo Oracle (setelah Sun diakuisisi)
- **Ukuran render:** ~48×32 px
- **Style:** Oranye/merah, flat

#### `posix-badge.png`
- **Dipakai:** Ikon tambahan di dalam kotak node POSIX/IEEE
- **Visual:** Badge/stamp "POSIX" atau logo IEEE — bisa stylized sebagai "cap resmi"
- **Ukuran render:** ~48×48 px
- **Style:** Gold, badge shape

---

### ACT 3 — LAHIRNYA LINUX (1991)

**Kondisi sekarang:** Lingkaran teks "LT", kotak GNU dan Linux kernel, merge box.

**Yang perlu ditambah:**

#### `linus-torvalds.png`
- **Dipakai:** Gantikan `<circle r={36}>` + teks "LT"
- **Visual:** Ilustrasi Linus Torvalds muda usia 21 tahun — sedang di depan komputer, senyum
- **Ukuran render:** ~72×72 px
- **Style:** Sama dengan KT/DR — flat illustration, konsisten

#### `tux.png`
- **Dipakai:** 
  - Act 3: di sebelah kiri merge box sebagai "hasil" GNU/Linux
  - Act 4: sudut kanan sebagai mascot pohon keluarga
  - Act 5: header kolom Linux di scoreboard
- **Visual:** Tux penguin — maskot Linux resmi (Larry Ewing)
- **Ukuran render:** ~60×70 px
- **Style:** Clean flat version, warna hitam-putih-kuning klasik

#### `kernel-logo.png`
- **Dipakai:** Ikon kecil di kotak "Linux Kernel (1991)" dalam merge scene
- **Visual:** Logo kernel Linux (stilisasi huruf "L" atau logo kernel.org)
- **Ukuran render:** ~36×36 px
- **Style:** Cyan/hijau sesuai COLORS.LINUX

---

### ACT 4 — LEDAKAN DISTRO LINUX (pohon keluarga)

**Kondisi sekarang:** Titik-titik lingkaran kecil dengan nama teks saja. Tidak ada identitas visual tiap distro.

**Yang perlu ditambah:** Logo tiap distro di dalam/atas node circle.

#### `distro-ubuntu.png`
- **Visual:** Lingkaran tiga orang, warna oranye — sangat ikonik
- **Ukuran render:** ~28×28 px (di dalam circle node)

#### `distro-debian.png`
- **Visual:** Spiral merah "yin-yang style"
- **Ukuran render:** ~28×28 px

#### `distro-arch.png`
- **Visual:** "A" menghadap ke atas, warna biru muda
- **Ukuran render:** ~28×28 px

#### `distro-fedora.png`
- **Visual:** "f" dalam lingkaran biru
- **Ukuran render:** ~28×28 px

#### `distro-redhat.png`
- **Visual:** Fedora merah (topi koboi merah)
- **Ukuran render:** ~28×28 px

#### `distro-mint.png`
- **Visual:** Daun hijau
- **Ukuran render:** ~28×28 px

#### `distro-manjaro.png`
- **Visual:** Tiga garis hijau vertikal
- **Ukuran render:** ~28×28 px

#### `android-logo.png`
- **Visual:** Robot Android hijau (kepala saja / full body)
- **Ukuran render:** ~28×28 px di node tree, ~40×40 px di Act 5

---

### ACT 5 — SKOR AKHIR 2026

**Kondisi sekarang:** Split-screen teks statistik, tidak ada identitas visual "siapa yang pakai".

**Yang perlu ditambah:**

#### `apple-logo.png`
- **Dipakai:** Header kolom UNIX di sebelah tulisan UNIX (karena macOS/iOS = wajah Unix modern)
- **Visual:** Logo Apple (apel digigit)
- **Ukuran render:** ~40×48 px
- **Style:** Putih/silver di dark background

#### `freebsd-logo.png`
- **Dipakai:** Di baris stat FreeBSD (Netflix CDN, PlayStation)
- **Visual:** Maskot Beastie atau logo text FreeBSD
- **Ukuran render:** ~32×32 px

#### `tux.png` (sudah ada dari Act 3)
- **Dipakai:** Header kolom LINUX di scoreboard
- **Ukuran render:** ~48×56 px

#### `android-logo.png` (sudah ada dari Act 4)
- **Dipakai:** Di baris stat Android (miliaran perangkat)
- **Ukuran render:** ~32×32 px

#### `server-icon.png`
- **Dipakai:** Di baris stat "Server & Cloud dunia"
- **Visual:** Ikon server rack / cloud generic (bukan brand)
- **Ukuran render:** ~32×32 px
- **Style:** Flat, cyan/hijau

#### `supercomputer.png`
- **Dipakai:** Di baris stat "Top 500 Supercomputer"
- **Visual:** Ikon supercomputer (baris server besar, atau chip CPU stilisasi)
- **Ukuran render:** ~32×32 px
- **Style:** Flat, biru/cyan

---

## SPESIFIKASI TEKNIS

| Parameter | Nilai |
|-----------|-------|
| Format | PNG dengan transparansi (alpha) |
| Background | Transparan (bukan putih) |
| Ukuran file max | 100 KB per file (diutamakan <50 KB) |
| Resolusi | Cukup 2x dari ukuran render (misal render 64px → file 128px) |
| Style | Flat illustration atau clean vector-style — KONSISTEN satu gaya |
| Color mode | RGBA |

---

## GAYA ILUSTRASI (KONSISTENSI)

Semua PNG sebaiknya mengikuti **satu gaya visual** agar tidak campur aduk:

**Rekomendasi gaya: "Flat Dark Tech Illustration"**
- Background: Transparan
- Warna: Bold, saturated, cocok di atas background gelap `#070913`
- Outline: Tipis, satu warna lebih gelap dari fill
- Tidak ada shadow 3D atau gradient berlebihan
- Untuk foto tokoh (KT, DR, LT): stylized portrait illustration (bukan foto asli)

---

## URUTAN PENGERJAAN (PRIORITAS)

### Batch 1 — Paling Impactful (buat duluan)
1. `tux.png` — muncul di 3 act sekaligus
2. `linus-torvalds.png` — focal point Act 3
3. `ken-thompson.png` — focal point Act 1
4. `dennis-ritchie.png` — focal point Act 1
5. `bsd-daemon.png` — ikonik, Act 2
6. `android-logo.png` — muncul di Act 4 & 5
7. `apple-logo.png` — focal point Act 5

### Batch 2 — Distro logos Act 4
8. `distro-ubuntu.png`
9. `distro-debian.png`
10. `distro-arch.png`
11. `distro-fedora.png`
12. `distro-redhat.png`
13. `distro-mint.png`

### Batch 3 — Pelengkap Act 2 & 5
14. `gnu-logo.png`
15. `hp-logo.png`
16. `ibm-logo.png`
17. `sun-logo.png`
18. `pdp7.png`
19. `server-icon.png`
20. `supercomputer.png`
21. `freebsd-logo.png`
22. `bell-labs.png`
23. `posix-badge.png`
24. `kernel-logo.png`
25. `distro-manjaro.png`

---

## LOKASI FILE

```
public/
└── images/
    └── linux-vs-unix/
        ├── ken-thompson.png
        ├── dennis-ritchie.png
        ├── pdp7.png
        ├── bell-labs.png
        ├── bsd-daemon.png
        ├── gnu-logo.png
        ├── hp-logo.png
        ├── ibm-logo.png
        ├── sun-logo.png
        ├── posix-badge.png
        ├── linus-torvalds.png
        ├── tux.png
        ├── kernel-logo.png
        ├── distro-ubuntu.png
        ├── distro-debian.png
        ├── distro-arch.png
        ├── distro-fedora.png
        ├── distro-redhat.png
        ├── distro-mint.png
        ├── distro-manjaro.png
        ├── android-logo.png
        ├── apple-logo.png
        ├── freebsd-logo.png
        ├── server-icon.png
        └── supercomputer.png
```

## CARA PAKAI DI JSX

```jsx
// Contoh — gantikan lingkaran KT dengan foto Ken Thompson
<g transform={T('personKT', 180, 140)} opacity={O('personKT')}>
  {/* Background circle */}
  <circle r={36} fill={COLORS.UNIX_DIM} stroke={COLORS.UNIX} strokeWidth={2} />
  {/* Foto/ilustrasi — crop lingkaran pakai clipPath */}
  <clipPath id="clipKT">
    <circle r={34} />
  </clipPath>
  <image href="/images/linux-vs-unix/ken-thompson.png"
    x={-34} y={-34} width={68} height={68}
    clipPath="url(#clipKT)"
    preserveAspectRatio="xMidYMid slice" />
  {/* Nama tetap di bawah */}
  <text textAnchor="middle" y={52} fill={COLORS.TEXT} fontSize={11}>Ken Thompson</text>
</g>

// Contoh — logo distro di node tree
<g key={node.id} transform={T(`tree-${node.id}`, pos.x, pos.y)}>
  <circle r={14} fill={node.color} filter="url(#shadow)" />
  <image href={`/images/linux-vs-unix/distro-${node.id}.png`}
    x={-10} y={-10} width={20} height={20}
    preserveAspectRatio="xMidYMid meet" />
  <text textAnchor="middle" y={-20} fill={node.color} fontSize={10}>{node.name}</text>
</g>
```

---

*Plan ini dibuat berdasarkan analisa `Animation-history.jsx` — 5 Act, 495 baris.*
*Update file ini setiap kali PNG selesai dibuat dan diintegrasikan.*
