# Revisi-03 — ACT 1 sebagai Ambient Layer pada Intro

| Item | Nilai |
|---|---|
| Content | 26 — Terminal Navigation |
| Tanggal | 2026-09-14 |
| Status | EXECUTED (2026-09-14) — lihat Animation.jsx & data.js |
| Fokus | Memunculkan penanda `ACT 1` pada intro sebagai elemen atmosfer yang transparan, tanpa mengurangi dominasi title utama. |

## Tujuan

Intro saat ini sudah memiliki title `TERMINAL NAVIGATION` yang perlu tetap
menjadi titik fokus pertama. Tambahkan `ACT 1` hanya sebagai konteks naratif:
penonton langsung merasakan video dimulai dari chapter pertama, tetapi tidak
menganggapnya sebagai heading yang bersaing dengan title.

Referensi visualnya adalah pendekatan yang dipakai pada content 24 (CORS):
penanda Act dapat hadir sejak intro, namun pada Terminal Navigation versinya
harus lebih lembut karena title dua kata sudah memiliki kontras cyan/hijau yang
kuat.

## Keputusan desain

| Elemen | Keputusan |
|---|---|
| Copy | `ACT 1` (tanpa deskripsi panjang) |
| Peran | Background/ambient chapter marker, bukan subtitle atau badge aktif |
| Layer | Di belakang title dan subtitle intro |
| Opacity awal | `0.18`; rentang tuning yang diperbolehkan `0.15–0.25` setelah preview |
| Warna | `COLORS.NAV` atau cyan tema terminal dengan alpha opacity; jangan memakai warna merah/amber yang menyerupai state command |
| Tipografi | Sans bold/semibold, uppercase, letter-spacing lebar; ukuran sekitar `0.6×` tinggi title utama |
| Posisi desktop | Absolute terhadap intro hero, offset kanan-atas atau kanan-belakang blok title; tidak berada tepat di belakang glyph title |
| Posisi mobile | Kecilkan dan pindahkan ke tepi aman; sembunyikan jika beririsan dengan title/subtitle |
| Interaksi | `pointerEvents: 'none'`; murni dekoratif |

## Perilaku animasi

1. `ACT 1` mulai muncul setelah intro container siap, tetapi sebelum atau
   bersamaan dengan title—bukan mendahului title secara dramatis.
2. Gunakan fade-in lembut sekitar `250–400 ms`; tidak memakai slide besar,
   bounce, glitch, atau typewriter.
3. Saat title dan subtitle selesai masuk, opacity ambient stabil di `0.18`.
4. Ketika UI Act 1/terminal mulai mengambil fokus, `ACT 1` intro memudar
   keluar terlebih dahulu (`150–250 ms`) supaya tidak bertumpuk dengan
   `ActBadgeNavigatorV1` dan callout Act yang sudah ada.
5. Tidak perlu SFX baru: elemen ini tidak boleh menambah beat audio intro.

## Integrasi teknis yang direncanakan

Target implementasi utama:

- `src/content/26-terminal-navigation/Animation.jsx`
  - Tambahkan satu ambient SVG/text layer di dalam area intro yang sama dengan
    `IntroSequenceV1` atau wrapper intro yang saat ini merender
    `terminal-navigation-intro`.
  - Ikat visibilitasnya ke progress/timing intro yang sudah ada (`INTRO_DELAY`),
    bukan membuat phase atau timer global baru.
  - Pastikan layer dibuat sebelum `IntroSequenceV1` dalam urutan render atau
    memiliki `z-index`/SVG ordering lebih rendah dari title dan subtitle.
  - Gunakan satu konstanta lokal atau props yang jelas untuk opacity, offset,
    dan timing agar tuning preview tidak memerlukan perubahan tersebar.

- `src/content/26-terminal-navigation/data.js` (opsional, lebih disukai bila
  pola scene menyimpan seluruh copy di data)
  - Tambahkan konstanta seperti `INTRO_ACT_LABEL = 'ACT 1'`.
  - Jangan mengubah `PHASES[0].badge`; badge navigator tetap memakai copy Act
    lengkap yang sekarang untuk konteks setelah intro.

Tidak ada perubahan yang direncanakan untuk command, caption, SFX map,
durasi Act, atau workflow terminal.

## Guardrail hierarchy dan collision

- Title `TERMINAL NAVIGATION` harus tetap paling terang dan paling mudah dibaca
  pada satu pandang.
- Subtitle `Tahu lokasi, lihat isi, lalu berpindah` harus selalu memiliki
  kontras lebih tinggi daripada `ACT 1`.
- Jangan tempatkan `ACT 1` pada baseline/title line yang sama, karena akan
  terbaca sebagai bagian judul (`ACT 1 TERMINAL NAVIGATION`).
- Jangan menggunakan pill, border, atau fill panel; bentuk badge akan membuat
  elemen dekoratif terlalu dominan.
- Sebelum `ActBadgeNavigatorV1` muncul, ambient intro harus sudah keluar.
- Pastikan safe area dan clipping aman di 16:9, rasio menengah, dan mobile;
  khusus layar sempit, prioritasnya adalah title, bukan mempertahankan ambient
  label.

## Urutan verifikasi bila dieksekusi

- [ ] Preview intro dari frame pertama sampai terminal Act 1 mulai aktif.
- [ ] Bandingkan opacity `0.15`, `0.18`, dan `0.22`; pilih nilai terendah yang
      masih terasa sebagai chapter marker.
- [ ] Pastikan title dan subtitle dapat dibaca tanpa perlu jeda atau squint.
- [ ] Pastikan tidak ada overlap dengan navigator/badge Act setelah intro.
- [ ] Cek viewport desktop, tablet, dan mobile; sembunyikan layer di mobile
      bila tidak ada posisi aman.
- [ ] Render loop awal-ke-akhir untuk memastikan `ACT 1` reset dengan mulus
      dan tidak flash pada pergantian loop.

## Kriteria selesai

Revisi dianggap berhasil bila `ACT 1` terasa seperti tekstur chapter yang
halus pada intro, sementara penonton tetap pertama kali membaca `TERMINAL
NAVIGATION`, lalu subtitle. Tidak ada perubahan perilaku materi Act 1 maupun
navigasi terminal setelah intro.
