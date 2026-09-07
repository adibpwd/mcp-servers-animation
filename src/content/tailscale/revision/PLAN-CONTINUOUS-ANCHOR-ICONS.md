# Plan — Icon "Anchor" (Rumah & Kantor) Continuous, Gak Fade In/Out Berulang

> **Status: SUDAH DIEKSEKUSI (2026-09-06).** Lihat § Status Eksekusi di
> bagian bawah file ini untuk detail perubahan kode.

## Keluhan User

> "icon-icon animasi yang masih berhubungan gak muncul terus animasi
> fade/apa itu, saya pingin continuous biar audiens gak terlalu bingung
> — apa ini icon sama tapi muncul lagi, kayak rumah dan kantor itu kan
> kepake di Act 1 dst-nya, seharusnya gak banyak animasi masuk."

Intinya: icon rumah & kantor itu representasi objek yang SAMA sepanjang
cerita (laptop di rumah user, laptop di kantor user) — tapi di animasi
sekarang, tiap kali pindah Act, icon-nya kayak "muncul lagi dari awal"
(fade + pop-in + bunyi "pop") padahal itu bukan objek baru. Ini bikin
audiens bingung ("ini icon baru atau icon yang tadi?").

## Root Cause (dikonfirmasi baca source code)

1. **Struktur render per-Act pakai conditional mount/unmount penuh.**
   Tiap Act dibungkus `{phaseIdx === N && (<g>...</g>)}`. Begitu
   `phaseIdx` ganti, React **unmount total** subtree Act lama (termasuk
   icon rumah/kantornya), lalu **mount subtree Act baru dari nol**.

2. **Tiap Act pakai `id` animasi yang beda-beda** untuk objek yang
   sebenarnya sama:
   - Rumah: `houseBox` (Act1) -> `houseBox2` (Act2) -> `houseBox3` (Act3)
     -> `houseBox4` (Act4) -> `meshHome` (Act5)
   - Kantor: `officeBox` (Act1) -> `officeBox2` (Act2) -> `officeBox3`
     (Act3) -> `officeBox4` (Act4) -> `meshOffice` (Act5)

3. Fungsi `P(id) = pop[id] || { scale: 0, opacity: 0, ... }` — kalau
   `id` belum pernah ada di state `pop`, defaultnya **invisible**. Jadi
   `houseBox2` di Act2 itu, secara animasi, dianggap objek BARU yang
   belum pernah tampil -- makanya di-`popIn()` lagi dari scale 0 +
   opacity 0, lengkap dengan efek "pop" (scale bounce + SFX `POP`).

4. Hasil di layar: rumah & kantor terlihat "hilang sekejap -> muncul
   lagi dengan animasi pop + bunyi" di **SETIAP transisi Act** (4 kali
   total: Act1->2, 2->3, 3->4, 4->5), walau posisi & bentuknya nyaris
   sama.

## Audit Semua Icon — Mana yang "Anchor" (berulang) vs Legit Baru

| Icon | Muncul di Act | Kategori | Catatan |
|---|---|---|---|
| `house-frame` + `Laptop` (rumah) | 1, 2, 3, 4, 5 | 🔴 **ANCHOR** | Objek sama sepanjang cerita, cuma warna laptop & posisi Y sedikit beda per Act |
| `building-frame` + `Laptop` (kantor) | 1, 2, 3, 4, 5 | 🔴 **ANCHOR** | Sama seperti rumah |
| `tailscale-logo` | 2 saja | 🟢 Legit baru | Muncul sekali pas "install Tailscale", gak diulang di Act lain |
| `wireguard-key` (x4) | 2 saja | 🟢 Legit baru | Semua dalam 1 Act, gak lintas-Act |
| `coordination-server` | 3 saja | 🟢 Legit baru | Objek baru diperkenalkan di Act 3 |
| `derp-relay` | 4 saja | 🟢 Legit baru | Objek baru (fallback relay) di Act 4 |
| `mobile-phone` | 5 saja | 🟢 Legit baru | Device tambahan yang baru nongol di payoff |
| Speech/text box, badge, dsb | macam-macam | 🟢 Legit baru | Ini konten penjelasan per-Act, wajar muncul-hilang sesuai konteks |

**Kesimpulan scope:** cuma **rumah** & **kantor** (icon + laptop di
dalamnya) yang perlu dibikin *continuous*. Icon lain sudah benar
perilakunya (muncul sekali sesuai konteks ceritanya, gak berulang).

## Detail Posisi & Warna per Act (buat referensi implementasi nanti)

| Act | id lama (rumah/kantor) | Posisi Y | Warna Laptop |
|---|---|---|---|
| 1 (blocked-hook) | `houseBox` / `officeBox` | y=170 | `COLORS.DANGER` (merah) |
| 2 (wireguard-keys) | `houseBox2` / `officeBox2` | y=170 | `COLORS.CRYPTO` (mint) |
| 3 (coordination) | `houseBox3` / `officeBox3` | y=190 | `COLORS.SERVER` (amber) |
| 4 (hole-punching) | `houseBox4` / `officeBox4` | y=170 | `COLORS.SUCCESS` (biru) |
| 5 (mesh-payoff) | `meshHome` / `meshOffice` | y=300 (posisi mesh diagram, beda layout) | `COLORS.SUCCESS` (biru) |

Catatan: Act 5 posisinya beda jauh (y=300, jadi bagian diagram mesh
dengan HP & cloud server) — ini transisi LAYOUT yang wajar butuh
animasi perpindahan, bukan sekadar "muncul lagi". Perlu ditangani beda
dari transisi Act1->2->3->4 yang cuma geser dikit (170 vs 190).


## Rencana Perbaikan (Usulan — Belum Dieksekusi)

Tujuan: rumah & kantor cuma pop-in SEKALI (Act 1). Transisi Act1→2→3→4
cuma geser posisi/ganti warna laptop pakai tween biasa (bukan
unmount+pop-in lagi). Transisi ke Act 5 tetap dapat animasi
perpindahan yang smooth (morph posisi), bukan fade out/in.

### Strategi Teknis

1. **Satu id permanen per objek, bukan per-Act.**
   - `houseBox`/`houseBox2`/`houseBox3`/`houseBox4` → jadi 1 id tetap:
     `houseAnchor`.
   - `officeBox`/`officeBox2`/`officeBox3`/`officeBox4` → `officeAnchor`.
   - `meshHome`/`meshOffice` (Act 5) tetap ada, tapi diperlakukan
     sebagai **target akhir tween posisi** dari `houseAnchor`/
     `officeAnchor`, bukan objek baru yang di-`popIn()` dari scale 0.

2. **Pindahkan rumah & kantor keluar dari blok conditional per-Act.**
   Sekarang strukturnya `{phaseIdx === N && (<g>...rumah/kantor...</g>)}`
   — ikut ke-unmount tiap ganti Act. Solusinya: render
   `<g id="houseAnchor">` & `<g id="officeAnchor">` di LUAR percabangan
   `phaseIdx`, sebagai elemen persistent yang tetap ada di DOM
   sepanjang Act 1 s/d sebelum transisi mesh Act 5.

3. **Ganti pop-in per-Act jadi tween posisi/warna.**
   - Act 1: tetap `popIn()` seperti biasa — entrance pertama & satu-
     satunya kali pop dengan SFX.
   - Act 1→2, 2→3, 3→4: pakai `gsap.to()` untuk animasikan `x`/`y`
     (mis. y=170→190 pas ke Act 3) dan warna fill laptop (`DANGER →
     CRYPTO → SERVER → SUCCESS`), ditaruh di titik waktu yang sama
     dengan transisi Act lama — bukan lewat `P(id)` yang selalu start
     dari scale 0/opacity 0.

4. **Transisi ke Act 5 — morph posisi, bukan fade.**
   Layout Act 5 beda jauh (y=170 → y=300, jadi bagian diagram mesh).
   Solusinya tween `x/y` langsung dari posisi Act 4 ke posisi mesh,
   pakai easing sama seperti transisi Act sebelumnya (`power2.inOut`)
   — rumah/kantor "jalan pindah" ke posisi mesh, bukan hilang lalu
   muncul lagi.

### Dampak ke Kode (perkiraan, perlu verifikasi saat eksekusi)

- **`data.js`**: kemungkinan perlu key config baru utk posisi/warna per
  Act — perlu dicek dulu struktur data Act yang sekarang.
- **`Animation.jsx`**: hapus 4x duplikasi render rumah/kantor per-Act,
  ganti jadi 1 render permanen + tween di titik transisi; hapus
  panggilan `popIn('houseBoxN'...)`/`popIn('officeBoxN'...)` di Act
  2/3/4.

### Yang Perlu Dicek Sebelum Eksekusi

- Struktur `data.js` tailscale: gimana timeline per-Act didefinisikan
  (generic vs hardcoded), supaya tahu titik pasti nyisip tween baru.
- Fungsi `P(id)`/`popIn()` di `Animation.jsx`: pastikan tween manual
  (`gsap.to` langsung ke elemen) gak bentrok sama sistem `pop` state.
- SFX "pop" — pastikan gak ikut kepanggil pas rumah/kantor cuma geser
  posisi (bukan pop-in beneran).

**Status: masih rencana, nunggu konfirmasi user pilih pendekatan
sebelum mulai edit `Animation.jsx`/`data.js`.**


## Status Eksekusi (2026-09-06)

- [x] Tambah state `anchorY`/`anchorColor` (posisi Y & warna laptop,
      terpisah dari sistem `pop` scale/opacity) — DONE
- [x] Act 1: `popIn('houseBox'...)` / `popIn('officeBox'...)` diganti
      jadi `popIn('houseAnchor'...)` / `popIn('officeAnchor'...)` —
      pop-in SEKALI ini yang jadi entrance permanen — DONE
- [x] Act 2: hapus `popIn('houseBox2'/'officeBox2')`, ganti jadi
      `setAnchorColor({..CRYPTO})` (y tetap 170, gak ada tween) — DONE
- [x] Act 3: hapus `popIn('houseBox3'/'officeBox3')`, ganti jadi swap
      warna SERVER + `gsap.to` tween y 170→190 — DONE
- [x] Act 4: hapus `popIn('houseBox4'/'officeBox4')`, ganti jadi swap
      warna SUCCESS + tween y 190→170 — DONE
- [x] Act 5: hapus `popIn('meshHome'/'meshOffice')`, ganti jadi tween y
      170→300 (morph ke posisi diagram mesh, id TETAP houseAnchor/
      officeAnchor, bukan objek baru) — DONE
- [x] JSX: pindahkan render `HouseFrame`+`Laptop`+label rumah/kantor
      keluar dari semua blok `{phaseIdx === N && ...}`, jadi satu blok
      persistent `<g transform="translate(0,80)">` yang selalu ada
      selama `!showIntro` — DONE
- [x] Hapus 4x duplikasi render lama (`houseBox`/`houseBox2/3/4`,
      `officeBox`/`officeBox2/3/4`) dan render `meshHome`/`meshOffice`
      di Act 5 — DONE
- [x] Node garis mesh di Act 5 (`nodes.h`/`nodes.o`) diganti pakai
      `anchorY.home`/`anchorY.office` dinamis, bukan hardcode `300`,
      supaya tetap sinkron kalau tween belum selesai — DONE
- [x] Verifikasi: baca ulang seluruh `Animation.jsx`, dipastikan tidak
      ada sisa referensi ke id lama (`houseBox*`, `officeBox*`,
      `meshHome`, `meshOffice`) — DONE, bersih
- [ ] Belum dicek visual manual di browser (buka preview topic
      Tailscale) — perlu lihat langsung transisi Act 1→5 kelihatan
      smooth (posisi geser + warna laptop ganti), bukan pop lagi
- [ ] Belum di-test export video/audio (pastikan durasi/sinkronisasi
      SFX gak berubah akibat penghapusan beberapa panggilan `popIn`
      yang tadinya juga trigger SFX `POP`/`POP2` — sekarang Act 2/3/4
      gak lagi bunyi "pop" pas rumah/kantor pindah, itu memang
      disengaja, tapi perlu didengar ulang biar gak berasa "sepi")

**Ringkasan hasil:** rumah & kantor sekarang cuma pop-in SEKALI di
Act 1 (dengan SFX seperti biasa). Transisi Act 2/3/4 cuma geser posisi
Y & ganti warna laptop via tween GSAP — tanpa fade out/in, tanpa bunyi
"pop" berulang. Transisi ke Act 5 tetap dapat animasi (morph posisi ke
layout mesh), bukan hilang-muncul.
