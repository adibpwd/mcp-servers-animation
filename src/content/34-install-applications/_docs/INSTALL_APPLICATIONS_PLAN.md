# PLAN — 34 Install Aplikasi di Linux

| Item | Nilai |
|---|---|
| Content | 34 — Install Applications |
| Status | 📝 PLAN ONLY — jangan dieksekusi |
| Target audiens | Orang awam dan pemula Linux |
| Tujuan belajar | Memahami package manager, repository, package, dan alasan memasang aplikasi dari sumber tepercaya |
| Prasyarat | 25 Linux Filesystem, 26 Terminal Navigation, 27 File Operations |
| Scene shell | scene-ui V1, portrait 820 × 1340 |

## Audience promise

Setelah menonton, audiens memahami bahwa Linux biasanya memasang aplikasi melalui package manager yang mengambil package dari repository tepercaya, lalu memeriksa dependency dan memasang aplikasi ke sistem.

## Identitas seri

| Field | Keputusan |
|---|---|
| Kategori | Linux Fundamentals |
| Title A | INSTALL — cyan atau blue |
| Title B | APPS — emerald |
| Subtitle | Dari repository ke aplikasi siap pakai |
| Tone | Toko aplikasi dengan petugas paket: bukan download file acak dari internet |
| Shell | Scene UI V1: satu hero-to-header, empat Act, badge dan dot navigator |

## Aturan akurasi dan keamanan

1. Gunakan contoh package manager apt sebagai contoh konkret, tetapi jelaskan bahwa distro lain dapat memakai package manager berbeda.
2. Jangan menyebut repository selalu bebas risiko; tekankan repository resmi/tepercaya.
3. Jangan menampilkan curl pipe shell, file installer acak, atau command yang dijalankan tanpa memahami sumbernya.
4. Jangan mengajarkan sudo secara mendalam di sini; cukup jelaskan instalasi sistem membutuhkan izin admin. Detail sudo berada pada content 38.
5. Jangan membuat klaim bahwa semua aplikasi hanya tersedia sebagai package distro; Flatpak/Snap dibahas pada content 114.

## Validasi analogi

Repository dianalogikan sebagai gudang paket tepercaya, package manager sebagai petugas pengambil dan pemeriksa paket, dependency sebagai komponen pendukung yang harus ikut tersedia, dan aplikasi terpasang sebagai alat yang akhirnya muncul di rak sistem. Analogi menjaga alur sebenarnya: package manager tidak menciptakan aplikasi, ia mengambil metadata/package dari sumber yang dikonfigurasi lalu memasangnya.

## Storyboard empat Act

| Act | Setup → tegangan → titik balik → payoff | Konsep | Exit state |
|---|---|---|---|
| 1 — Butuh aplikasi | Terminal belum memiliki aplikasi contoh → kebutuhan muncul → nama package dipilih → instalasi punya target jelas. | package name | Package editor-lite menjadi target. |
| 2 — Cari di repository | Package manager menerima permintaan → daftar repository diperiksa → package ditemukan → sumber package terlihat. | repository dan metadata | Package tersedia dari repository resmi. |
| 3 — Siapkan dependency | Package utama belum dapat berdiri sendiri → dependency dipetakan → beberapa komponen pendukung ikut masuk keranjang → semua kebutuhan siap. | dependencies | Package dan dependency siap dipasang. |
| 4 — Pasang dan jalankan | Izin admin disetujui → file dipasang ke sistem → aplikasi muncul di daftar → aplikasi siap dijalankan. | install dan permission | Status installed tampil dengan jelas. |

## State contract

| State | Yang terlihat | Yang belum boleh terlihat | Pemicu | Hasil |
|---|---|---|---|---|
| Target | Terminal dan package editor-lite | Aplikasi installed | Act 1 | Nama package jelas |
| Search | Request menuju repository | Dependency final | Repository merespons | Sumber tepercaya terlihat |
| Resolve | Diagram dependency | Status installed | Resolver selesai | Kebutuhan pendukung lengkap |
| Install | Progress paket dan izin admin | App siap sebelum progress selesai | Paket dipasang | File sistem berubah |
| Ready | App card dengan check | Proses install aktif | Install lengkap | Aplikasi siap dipakai |

## Continuity map

Terminal/prompt dan kartu package editor-lite adalah anchor persisten dari awal sampai akhir. Kartu package berangkat ke repository, kembali membawa metadata, lalu tetap menjadi package utama dalam dependency basket dan berubah menjadi kartu installed. Perubahan ini memakai handoff visual; package tidak boleh hilang lalu muncul tiba-tiba sebagai aplikasi baru.

## Layout map V1

Seluruh posisi berikut lokal terhadap ContentBodyV1.

| Area | Local y | Isi |
|---|---:|---|
| Narration bubble | 35–115 | Caption pendek per beat |
| Terminal command strip | 145–220 | apt install editor-lite dan status singkat |
| Package manager hub | 260–430 | Petugas/package manager persisten |
| Repository atau dependency lane | 475–675 | Gudang repository, metadata, dan paket pendukung |
| Progress/install result | 715–840 | Progress bar atau kartu installed |
| Takeaway | 875–930 | Sumber tepercaya dan cek nama package |

Tidak ada body child pada local y negatif. Kartu dependency disusun horizontal dengan perhitungan lebar agar tidak overlap. Header/navigator hanya dirender oleh Scene UI V1.

## Elemen visual dan aset

| Elemen | Bentuk | Perilaku |
|---|---|---|
| Terminal strip | Inline SVG | Command dan status aktif |
| Package card | Inline SVG | Persistent, bergerak, lalu handoff menjadi installed |
| Package manager hub | Inline SVG hub/konveyor | Memproses request dan dependency |
| Repository shelf | Inline SVG gudang | Menyala saat package ditemukan |
| Dependency chips | Inline SVG pills | Muncul sebagai komponen pendukung |
| Permission gate | Inline SVG lock/gate | Muncul sekali sebelum pemasangan |
| Installed app card | Inline SVG | Target akhir dengan check |

First pass memakai inline SVG karena package card, dependency, progress, dan gate berubah state. Saat eksekusi, tetap buat folder icons dengan icons.json, default-icon.png, dan loader fallback sesuai kontrak topic baru; aset PNG hanya dibuat jika audit menyatakan elemen statis lebih sesuai sebagai icon.

## Draft teks in-video

| Beat | Teks |
|---|---|
| Act 1 | Package punya nama |
| Act 1 | Aplikasi belum terpasang |
| Act 2 | Repository mencari package |
| Act 2 | Sumber package terlihat |
| Act 3 | Dependency ikut diperiksa |
| Act 3 | Semua kebutuhan siap |
| Act 4 | Izin admin diperlukan |
| Act 4 | Aplikasi selesai dipasang |
| Closing | Pilih sumber yang tepercaya |

Teks in-video wajib deklaratif, pendek, tanpa emoji, tanpa kata ganti orang, dan tidak mengulang kalimat yang sama pada terminal strip serta narration bubble.

## Audio beat map

| Momen | Candidate SFX | Catatan |
|---|---|---|
| Header compact selesai | success/shimmer | Penanda intro |
| Command install muncul | sfx/typing atau ui/tick | Audit loudness sebelum memilih |
| Repository menemukan package | ui/paper-arrive | Payoff Act 2 |
| Dependency chips masuk | ui/pop / pop-2 | Stagger ringan, bukan setiap chip terlalu rapat |
| Izin admin gate | impacts/lock | Menegaskan batas akses |
| Install progress selesai | success/confirm | Perubahan status |
| App ready | success/ding | Payoff akhir |

Sebelum eksekusi, audit asset shared untuk semantik, loudness, provenance, dan folder kategori. Seluruh cue aktual wajib masuk SFX_MAP dan schedule export pada timestamp yang sama dengan GSAP.

## Rencana file saat eksekusi

| File | Perubahan yang direncanakan |
|---|---|
| src/content/34-install-applications/data.js | Viewport, PHASES, palette, package labels, captions, dependency data, dan SFX_MAP. |
| src/content/34-install-applications/manifest.js | Metadata Linux Fundamentals. |
| src/content/34-install-applications/Animation.jsx | GSAP timeline, reset loop, Scene UI V1, package handoff, repository, dan install state. |
| src/content/34-install-applications/caption.md | Caption sosial media di luar video. |
| src/content/34-install-applications/icons/* | icons.json, default fallback, loader, dan aset bila audit memerlukannya. |
| src/content/registry.js | Entry manifest coming-soon sesudah implementasi. |
| scripts/export-lib.js | Jadwal SFX sinkron. |

## Checklist eksekusi

- [ ] Kunci metadata dan title segments cyan/blue → emerald.
- [ ] Buat data.js sebelum Animation.jsx.
- [ ] Buat manifest, caption, dan kontrak folder icons.
- [ ] Gunakan satu IntroHeaderMorphV1 yang tetap mounted setelah morph.
- [ ] Gunakan ActBadgeNavigatorV1 dari satu array PHASES.
- [ ] Render semua visual dalam ContentBodyV1 local coordinate.
- [ ] Pertahankan package card sebagai anchor dan lakukan handoff menuju installed state.
- [ ] Visualkan dependency sebagai benda/komponen, bukan label teknis saja.
- [ ] Tampilkan repository tepercaya dan izin admin tanpa memberi command berisiko.
- [ ] Reset semua state pada repeat timeline.
- [ ] Wire SFX_MAP dan export schedule dengan kategori eksplisit.
- [ ] Audit dead field, teks in-video, collision, dan coverage SFX.
- [ ] Compile, preview intro/morph/semua Act/replay, lalu export MP4.

## Batasan

Content ini tidak membahas apt update/upgrade, memilih repository, PPA, Flatpak, Snap, atau troubleshooting dependency error. apt dan repository dibahas lebih dalam pada content 35; alternatif packaging dibahas pada content 114.
