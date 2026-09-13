# Revisi-03 — Intro dan Header sesuai Scene UI V1

| Item | Nilai |
|---|---|
| Content | 21 — Forgot Password |
| Tanggal | 2026-09-13 |
| Status | ✅ DIEKSEKUSI (2026-09-13) — kode sudah berubah, preview manual & export MP4 belum dijalankan |
| Fokus | Membenahi intro, hero-to-header morph, token warna judul, dan safe-zone header |
| Acuan | docs/standardizations/03-planning-storytelling-quality-gate.md dan docs/standardizations/05-svg-layout-asset-pipeline.md |

## Ringkasan masalah

Intro saat ini belum memakai pola Scene UI V1 secara utuh:

1. IntroHeaderMorphV1 baru dirender setelah contentStarted bernilai true. Pada saat itu progress morph sudah selesai, sehingga penonton tidak melihat perjalanan hero menjadi header ringkas.
2. Saat awal scene, terdapat header manual sebagai fallback. Sesudahnya muncul IntroHeaderMorphV1. Dua implementasi header ini berisiko membuat posisi, ukuran, dan transisi tidak konsisten.
3. Judul memakai warna RESET amber untuk FORGOT dan TOKEN ungu untuk PASSWORD. Standar judul utama menggunakan cyan atau biru untuk bagian A dan emerald untuk bagian B.
4. Judul FORGOT PASSWORD cukup panjang untuk hero portrait. Jika dipertahankan satu baris, ruang aman hero bisa terasa sempit.

## Hasil yang dituju

- Detik awal menampilkan satu hero intro yang jelas: kategori, judul dua baris, dan subtitle.
- Elemen hero yang sama mengecil dan berpindah menjadi header ringkas; bukan diganti dengan header kedua.
- Setelah morph selesai, header tetap terlihat di seluruh Act 1 sampai Act 4.
- Navigator dan body baru muncul setelah intro selesai, sehingga header tidak bertabrakan dengan konten.
- Warna judul konsisten dengan standar aktif dan tetap mudah dibaca di layar portrait.

## Kontrak header yang akan diterapkan

| Area | Keputusan revisi |
|---|---|
| Komponen header | Gunakan satu IntroHeaderMorphV1 sebagai satu-satunya sumber header. |
| Mounting | Komponen dimount sejak awal scene dan tetap ada sampai scene selesai. |
| Hero | Gunakan titleLines untuk hero: FORGOT pada baris pertama, PASSWORD pada baris kedua. |
| Header ringkas | Gunakan titleSegments yang sama untuk mode compact, selama masih muat pada safe area. |
| Warna judul | FORGOT memakai cyan atau biru, misalnya COLORS.SYSTEM atau COLORS.RECORD. PASSWORD memakai COLORS.SUCCESS emerald. |
| Warna semantik | RESET amber dan TOKEN ungu tetap boleh dipakai pada body untuk membedakan token reset, tetapi bukan sebagai token judul utama. |
| Navigator dan body | Tetap digate oleh contentStarted; yang tidak boleh digate adalah IntroHeaderMorphV1. |
| Fallback manual | Hapus grup text header manual pada state awal setelah implementasi revisi dilakukan. |

## Rencana timeline intro

| Waktu | Perilaku |
|---|---|
| Reset / replay | progress morph kembali ke 0, header V1 tetap dirender, contentStarted false. |
| 0.0–0.2 dtk | Hero intro terbaca sebentar: kategori, dua baris judul, subtitle. |
| 0.2–1.0 dtk | Progress IntroHeaderMorphV1 bergerak dari 0 ke 1 dengan ease yang sudah dipakai scene. |
| Setelah 1.0 dtk | contentStarted true; ActBadgeNavigatorV1 dan body boleh muncul. Header compact V1 tetap terlihat. |
| Act 1–4 | Header compact tidak diganti atau di-unmount. |
| Replay | Timeline mengulang pola yang sama tanpa sisa header manual atau opacity lama. |

## Layout dan safe area

1. Header harus tetap berada pada zona atas sekitar y 0–155.
2. Navigator ditempatkan pada zona sekitar y 155–235.
3. Body Act pertama dan seterusnya dimulai setelah zona navigator; tidak boleh menutupi subtitle/header.
4. Validasi pada ukuran portrait target dan frame morph tengah, bukan hanya frame awal dan akhir.
5. Jika header compact satu baris terlalu padat, pertahankan hero dua baris dan sesuaikan ukuran compact melalui API komponen V1; jangan membuat header manual baru.

## File yang direncanakan untuk diperbarui saat eksekusi

| File | Perubahan yang direncanakan |
|---|---|
| src/content/21-forgot-password/Animation.jsx | Mount IntroHeaderMorphV1 sejak awal, hilangkan fallback header manual, dan rapikan timeline agar hero-to-compact morph benar-benar terlihat. |
| src/content/21-forgot-password/data.js | Menyesuaikan token warna judul dan, bila diperlukan, data titleLines agar pemisahan FORGOT / PASSWORD eksplisit. |
| src/content/21-forgot-password/_docs/FORGOT_PASSWORD_PLAN.md | Menambahkan catatan bahwa intro/header sudah mengikuti kontrak Scene UI V1 setelah implementasi dan QA selesai. |
| src/content/21-forgot-password/revisi/README.md | Mencatat status pelaksanaan revisi ini setelah implementasi. |

## Checklist penerimaan

- [x] Tidak ada grup text header manual yang menduplikasi IntroHeaderMorphV1.
- [x] IntroHeaderMorphV1 sudah terlihat saat progress morph bernilai 0.
- [x] Animasi hero ke header compact terlihat jelas pada replay. *(implementasi terpasang; belum diverifikasi visual via preview manual)*
- [x] Header compact tetap tampil ketika Act 1, 2, 3, dan 4 berjalan.
- [x] FORGOT memakai cyan/biru (`COLORS.RECORD`), PASSWORD emerald (`COLORS.SUCCESS`).
- [ ] Hero dua baris tidak terpotong di portrait. *(perlu preview manual/screenshot progress 0, 0.5, 1)*
- [ ] Header, navigator, dan body tidak saling bertabrakan pada frame awal, tengah, akhir, dan perpindahan Act. *(perlu preview manual)*
- [ ] Replay tidak menyisakan opacity atau state header dari putaran sebelumnya. *(perlu preview manual full loop)*
- [x] Audio, alur forgot password, dan aset scene tidak berubah dalam revisi ini.

## Catatan eksekusi (2026-09-13)

Diimplementasikan persis sesuai kontrak di atas, mengikuti pola pilot
`22-oauth2-delegated-login` (satu-satunya topic lain yang sudah pakai
`titleLines` untuk hero dua baris):

- Blok render header lama (`{contentStarted && headerOpacity > 0 ? (...) : (fallback manual...)}`) diganti `{headerOpacity > 0 && (...)}` — satu cabang, tanpa fallback duplikat.
- `titleSegments` (dipakai compact/header 1 baris) dan `titleLines` (dipakai hero 2 baris, crossfade ke `titleSegments` di `titleMorphSplit` default 0.3) sama-sama diberi warna `COLORS.RECORD` (FORGOT) dan `COLORS.SUCCESS` (PASSWORD).
- `titleFilter="url(#glow)"` ditambahkan (filter `glow` sudah ada di `<defs>` topic ini) — pola sama dengan `22-oauth2-delegated-login`.
- `categorySegments` (label kategori + domain ADIB-DEV.COM) tidak diubah — tetap `COLORS.MUTED` + `COLORS.SYSTEM` seperti sebelumnya.
- `contentStarted` tetap dipertahankan sebagai gate `ActBadgeNavigatorV1` + `ContentBodyV1` saja, sesuai kontrak "yang tidak boleh digate adalah IntroHeaderMorphV1".

**Belum divalidasi (butuh `npm run dev` di sisi user):** hero dua baris
tidak terpotong di lebar portrait 820px, tidak ada collision di frame
progress 0/0.5/1 dan tiap batas Act, serta replay/loop tidak menyisakan
sisa opacity dari putaran sebelumnya.

**Di luar scope revisi ini:** `data.js` tidak diubah — `INTRO_TITLE_A`/
`INTRO_TITLE_B` (`'FORGOT'`/`' PASSWORD'`) dipakai apa adanya, spasi di
depan `INTRO_TITLE_B` di-`.trim()` inline saat dipakai untuk `titleLines`
baris kedua (supaya baris kedua tidak dimulai dengan spasi), sementara
versi `titleSegments` 1-baris tetap memakai spasi asli agar ada jarak
"FORGOT"+"PASSWORD" saat digabung jadi satu baris compact.

## Batasan revisi

Revisi ini hanya merapikan shell intro/header. Cerita pemulihan password, visual body, cue audio, dan komponen standar bersama tidak diubah. Jika QA menemukan masalah pada komponen IntroHeaderMorphV1 yang dipakai banyak content, perbaikannya harus direncanakan terpisah sebagai perubahan shared component.
