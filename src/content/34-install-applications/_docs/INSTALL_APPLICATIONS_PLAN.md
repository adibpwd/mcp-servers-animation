# PLAN — 34 Install Aplikasi di Linux

| Item | Nilai |
|---|---|
| Content | 34 — Install Applications |
| Status | 📝 PLAN ONLY — jangan dieksekusi |
| Target audiens | Orang awam dan pemula Linux |
| Tujuan belajar | Memahami package manager, repository, package, dan alasan memasang aplikasi dari sumber tepercaya |
| Prasyarat | 25 Linux Filesystem, 26 Terminal Navigation, 27 File Operations |
| Scene shell | scene-ui V1, portrait 820 × 1340 |
| Plan contract | Detail contract di bagian **Revisi Plan 2026-09-16** di bawah menggantikan ringkasan lama bila ada perbedaan. |

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

---

# Revisi Plan 2026-09-16 — Kontrak Produksi Detail

> Bagian ini adalah sumber kebenaran untuk implementasi baru Content 34.
> Ringkasan di atas tetap dipertahankan sebagai sejarah plan, tetapi keputusan
> timing, state, motion, layout, dan acceptance criteria di bawah mengungguli
> bagian lama jika ada perbedaan. Status tetap **plan only**.

## A. Batas konsep yang dikunci

**Audience promise:** audiens dapat menjelaskan alur `nama package →
repository tepercaya → dependency → izin admin → installed app`, serta tahu
bahwa app tidak boleh terlihat terpasang sebelum prosesnya selesai.

| Dibahas | Tidak dibahas |
|---|---|
| Nama package, repository resmi/tepercaya, dependency, state instalasi, izin admin secara ringkas | Cara kerja `sudo`, password, policy, sudoers, root shell, atau privilege escalation. |
| Contoh aman `sudo apt install editor-lite` sebagai pemicu visual | `apt update`, upgrade, PPA, Flatpak/Snap, error dependency, installer acak, atau `curl | sh`. |
| Package manager sebagai perantara yang memeriksa lalu memasang package | Klaim repo selalu aman atau semua software hanya tersedia dari repo distro. |

Content 34 hanya menyatakan **perubahan sistem memerlukan izin**. Penjelasan
siapa yang memiliki izin dan bagaimana `sudo` bekerja harus tetap dimiliki
Content 37 setelah plan gabungan user, group, dan admin diimplementasikan.

## B. Series identity dan visual language

| Field | Keputusan final |
|---|---|
| Title A | `INSTALL` — `#38BDF8` sky blue |
| Title B | `APPS` — `#34D399` emerald |
| Subtitle | `Dari repository ke aplikasi siap pakai` |
| Tone | Rantai pasok ramah: package manager mencari, memeriksa, melengkapi, lalu memasang. |
| Hero | Satu `IntroHeaderMorphV1`, tetap mounted setelah morph. |
| Navigator | Empat Act dari satu `PHASES`; tidak ada header/badge inline kedua. |
| Canvas | Portrait 820 × 1340; seluruh visual topic memakai local coordinate `ContentBodyV1`. |

| Semantik | Hex | Penggunaan |
|---|---|---|
| Info/repository | `#38BDF8` | Metadata sumber dan title pertama. |
| Success/installed | `#34D399` | Check, final app, title kedua. |
| Activity | `#FB923C` | Request, resolver, progress. |
| Dependency | `#A78BFA` | Chip komponen pendukung. |
| Attention/admin gate | `#FBBF24` | Perubahan sistem akan terjadi, bukan warna title. |
| Error/blocked | `#F43F5E` | Hanya state abstrak bila benar-benar diperlukan. |

## C. Story, Act, dan object continuity

Hook: `editor-lite` belum ada. Instalasi bukan tombol magis; penonton dapat
mengikuti benda yang sama sampai akhirnya menjadi aplikasi installed.

| Act | Cerita | Entry state | Exit state | Durasi |
|---|---|---|---|---:|
| 1 — Pilih package | App dibutuhkan, nama package dipilih, target menjadi nyata | Terminal idle, app belum installed | Package card berada pada hub | 9,0s |
| 2 — Temukan sumber | Hub mengirim lookup ke repository, metadata kembali ke package | Package belum punya source | Card berbadge repository | 12,0s |
| 3 — Siapkan kebutuhan | Resolver menemukan komponen pendukung dan membentuk bundle | Satu package card | Bundle package + dependency siap | 12,0s |
| 4 — Pasang dengan izin | Bundle meminta izin sistem, progress menulis app, result muncul | System shelf kosong | `editor-lite` installed | 15,0s |

Target total: **50–60 detik** termasuk intro, hold untuk membaca payoff, dan
closing. Tidak ada Act kelima khusus rangkuman; takeaway muncul setelah result
Act 4 stabil.

| Actor | Lahir | Persist | Handoff wajib |
|---|---|---|---|
| Terminal prompt | Intro selesai | Act 1–4 | Command commit menjadi history/output. |
| Package card `editor-lite` | Act 1 Apply | Act 1–4 | Request → metadata → bundle → installed memakai satu id/anchor. |
| Package manager hub | Act 1 | Act 1–4 | Idle → lookup → resolve → install. |
| Repository shelf | Redup Act 1 | Act 1–3 | Menyala hanya saat menerima lookup. |
| Dependency chips | Act 3 Apply | Act 3–4 | Masuk bertahap ke bundle, maksimum tiga visual. |
| Admin gate | Act 4 Intent | Hanya Act 4 | Waiting → approved, lalu tutup saat instalasi mulai. |

Tidak ada actor yang boleh di-unmount lalu muncul tiba-tiba di posisi lain.
Setiap perubahan bentuk atau tempat memakai overlap, path, atau tween posisi
minimal satu frame.

## D. State contract

| State | Yang tampak | Yang belum boleh tampak | Pemicu | Bukti hasil |
|---|---|---|---|---|
| `need` | Terminal + label `editor-lite` | Card, metadata, dependency, app ready | Nama dipilih | Target jelas. |
| `request` | Command Enter, card menuju hub | Repository result | Pulse tiba di hub | Lookup berjalan. |
| `found` | Repository + metadata pada card | Dependency, progress, ready | Response kembali | Sumber dapat dibaca. |
| `resolving` | Hub dan chip dependency | Progress dan installed | Resolver aktif | Bundle lengkap. |
| `awaiting-admin` | Bundle berhenti di gate | Progress/check | Intent install | Batas perubahan jelas. |
| `installing` | Progress dan system shelf | App hijau sebelum 100% | Gate approved | Sistem sedang berubah. |
| `installed` | Card hijau, check, output selesai | Gate/progress aktif | Progress complete | App siap dipakai. |

## E. Causal Motion Contract per action

Setiap action wajib mengikuti `before → intent → travel/process → apply →
after/explain`. Mutasi state konseptual hanya boleh terjadi pada kolom
**Apply**. Setiap hold adalah waktu untuk membaca hasil, bukan jeda kosong.

| Action | Before | Intent/source | Travel/process | Apply | After/explain | Hold | SFX | Audit frame |
|---|---|---|---|---|---|---:|---|---|
| `choose-package` | App belum installed | `$ apt install editor-lite` selesai diketik | Token `editor-lite` bergerak dari prompt ke hub | Token tiba; package card lahir | Badge `package name` | 0,8s | tick, pop | idle / token / card |
| `lookup-repo` | Card tanpa source | Hub mengirim lookup | Pulse hub → repository shelf | Shelf menyala, metadata masuk card | Badge `official repository` | 1,0s | swoosh, arrive | card / path / metadata |
| `resolve-deps` | Satu card | `checking dependencies` di hub | Resolver ring + chip menuju bundle | Chip menyatu satu per satu | `+ 2 dependencies` | 1,0s | pop stagger | single / travel / bundle |
| `request-admin` | Bundle siap, shelf sistem kosong | `sudo` commit sebagai konteks izin | Bundle bergerak dan berhenti di gate | Gate approved | `Perubahan sistem perlu izin` | 0,8s | lock, unlock | bundle / wait / approved |
| `install-package` | Gate approved, 0% progress | Progress start | Bundle menuju shelf seiring 0–100% | 100%; bundle morph jadi app | Check + `installed: editor-lite` | 1,2s | confirm, ding | 0% / 50% / installed |

### Motion semantics

- Package card hanya lahir saat Apply, bukan sebagai future state dari awal.
- Repository tidak boleh menyala tanpa request object/pulse yang berangkat dari
  hub; metadata tidak boleh muncul tanpa return/handoff.
- Dependency adalah komponen fisik yang masuk bundle, bukan label atau
  konfeti. Maksimum 2–3 chip; sisanya menjadi `+N`.
- Bundle harus berhenti di admin gate sebelum approved. Tidak ada password,
  root mode, atau command berisiko di layar.
- Installed app tidak boleh diberi check/warna success sebelum progress 100%.

## F. Layout contract dan overflow audit

Semua nilai adalah local coordinate `ContentBodyV1` (`732 × 965`).

| Zona | Local y | Isi | Guardrail |
|---|---:|---|---|
| Caption | 18–68 | Satu caption pendek | Maks. 8 kata; fade bila transit melintas. |
| Terminal | 92–210 | Prompt + output 1–3 baris | Clip internal, truncate text, tidak kecilkan font. |
| Hub | 246–414 | Manager dan package card | Card maksimum 170×92, selalu terlihat. |
| Transit/repository | 444–640 | Path, shelf, dependency lane | Satu request/bundle aktif. |
| Gate/result | 670–824 | Gate **atau** progress/result | Dua panel besar tidak bertumpuk. |
| Closing | 858–940 | Takeaway | Hanya sesudah installed state stabil. |

Aturan dinamis:

1. Terminal maksimal tiga baris dan tumbuh ke atas dari baseline zonanya;
   tidak boleh mendorong hub.
2. Gate dan progress memakai bounding box sama dan bertransisi crossfade/morph.
3. `clipPath` hanya membatasi terminal/metadata panjang; tidak boleh digunakan
   untuk menyembunyikan collision antar-zone.
4. Audit frame paling besar: terminal 3 baris + dependency lane penuh +
   gate/progress + closing sekaligus.

## G. Data model dan komponen

```js
PACKAGE = {
  id: 'editor-lite',
  label: 'editor-lite',
  source: 'official repository',
  status: 'need | request | found | resolving | awaiting-admin | installing | installed',
}
DEPENDENCIES = [
  { id: 'ui-kit', label: 'ui-kit' },
  { id: 'text-engine', label: 'text-engine' },
]
```

| Komponen | State | Aturan implementasi |
|---|---|---|
| `TerminalPanel` | typing, committed, output | Prompt adalah source action; history bergerak ke atas saat commit. |
| `PackageCard` | request, found, bundle, installed | Satu actor persist; badge/posisi/morph berubah. |
| `PackageManagerHub` | idle, lookup, resolve, install | Pulse/ring hanya ketika process berjalan. |
| `RepositoryShelf` | dim, queried, matched | Label official/trusted, bukan web download. |
| `DependencyChip` | absent, travelling, bundled | Stagger menuju bundle, maksimum tiga. |
| `AdminGate` | hidden, waiting, approved | Context izin singkat; bukan pelajaran sudo. |
| `InstallProgress` | 0–100, complete | Final state hanya pada complete. |
| `TakeawayCard` | hidden, visible | Muncul setelah output installed dapat dibaca. |

Gunakan inline SVG untuk semua actor yang bergerak atau punya sub-state.
Jangan gunakan emoji maupun logo aplikasi pihak ketiga. Aset statis hanya
ditambahkan setelah asset matrix, `icons.json`, dan loader fallback disetujui.

## H. Copy dan audio map

| Beat | Copy | Bukti visual |
|---|---|---|
| Target | `Package punya nama` | `editor-lite` di prompt dan card. |
| Source | `Repository menyediakan package` | Metadata kembali ke card. |
| Dependency | `Kebutuhan ikut diperiksa` | Chip menuju bundle. |
| Izin | `Perubahan sistem perlu izin` | Bundle berhenti pada gate. |
| Result | `Aplikasi siap dipakai` | Installed card dan check. |
| Closing | `Pilih sumber yang tepercaya` | Source repository tetap terlihat. |

Copy deklaratif, maksimal 8 kata, tanpa emoji/pertanyaan, dan tidak diulang
persis pada caption serta label UI.

| Momen | Candidate SFX | Trigger |
|---|---|---|
| Header compact | `success/shimmer` | Morph selesai. |
| Command commit | `ui/tick` | Intent choose-package. |
| Repository | `transitions/light-swoosh-quick`, `ui/paper-arrive` | Travel dan Apply lookup. |
| Dependency | `ui/pop` / `ui/pop-2` | Apply chip; maksimal dua cue. |
| Gate | `impacts/lock`, `impacts/unlock` | Waiting dan approved. |
| Installed / closing | `success/confirm`, `success/ding` | Apply final dan takeaway. |

Semua cue aktual harus ada di `SFX_MAP` serta schedule export pada timestamp
Apply. Audio tidak boleh menjadi satu-satunya penanda perubahan.

## I. Acceptance criteria dan urutan eksekusi setelah disetujui

### Audit visual

| Action | Before | Transit | After | Lulus bila |
|---|---|---|---|---|
| Choose | App belum ada | Token dari prompt | Card di hub | Card lahir saat token tiba. |
| Lookup | Card tanpa source | Request di path | Metadata di card | Tidak ada teleport. |
| Resolve | Satu card | Chips menuju bundle | Bundle + count | Tidak ada overflow. |
| Admin | Bundle menunggu | Gate hold | Approved | Tidak ada root/password/risky command. |
| Install | 0% | Sekitar 50% | Installed | Final tidak muncul dini. |

### Checklist penerimaan

- [ ] Tepat empat Act, target 50–60 detik, tanpa hold kosong.
- [ ] Setiap action memiliki before, source, travel, apply, after, hold, SFX,
      dan tiga frame audit.
- [ ] Package card persist dari request sampai installed.
- [ ] Repository tidak diklaim aman sempurna; dependency bukan dekorasi.
- [ ] Content 34 tidak mengajarkan sudo melampaui context izin ringkas.
- [ ] Title mengikuti sky blue → emerald.
- [ ] Tidak ada collision pada frame terbesar dan replay loop kedua.
- [ ] State reset bersih: terminal, package, metadata, chips, gate, progress,
      caption, result, dan SFX state.
- [ ] Preview intro, seluruh audit frame, replay, dan export test lulus.

### Urutan implementasi nanti

1. `data.js`: PHASES, palette, package/dependency, captions, action map,
   dan SFX_MAP.
2. `Animation.jsx`: state model, actor persistent, lifecycle causal action,
   layout, timeline, dan reset loop.
3. Metadata, manifest, dan caption sosial.
4. Asset matrix bila icon statis benar-benar diperlukan.
5. Compile/static check → preview frame audit/replay → finalkan timing SFX →
   export test. Status ready hanya setelah checklist benar-benar lulus.

## J. Referensi

- `docs/standardizations/03-planning-storytelling-quality-gate.md` — state,
  continuity, safe-zone, dan Causal Motion Contract.
- `docs/standardizations/04-motion-gsap-reference.md` — causal action,
  moving object, persistent actor, dan deterministic timeline.
- `docs/standardizations/05-svg-layout-asset-pipeline.md` — palette,
  typography, clipping, asset matrix, dan collision audit.
- Plan Content 37 — batas materi user/group/admin setelah konsolidasi plan.


---

# Revisi Plan 2026-09-16 — Repository dan Proses Instalasi Lengkap

> Bagian ini menggantikan batas konsep, storyboard, copy, dan acceptance criteria sebelumnya bila ada perbedaan. Dokumen tetap **plan only**: tidak ada command untuk dijalankan, implementasi, build, preview, atau instalasi.

## 1. Mengapa plan perlu diperluas

Rencana sebelumnya terlalu cepat melompat dari nama package ke app terpasang, dan secara praktis menjadikan `apt` serta satu official repository sebagai seluruh cerita. Instalasi aplikasi Linux lebih tepat dijelaskan sebagai satu *transaction*: package manager memilih sumber dan versi, menyelesaikan dependency, menyusun perubahan, lalu baru memproses arsip package sampai sistem mencatat hasilnya.

Revisi perlu membuat tiga hal terlihat jelas:

1. Repository dapat berasal dari beberapa saluran, bukan satu situs atau satu gudang.
2. Nama manager berbeda antar keluarga distro, tetapi fungsi utamanya serupa.
3. Download, verifikasi, unpack, konfigurasi, dan pencatatan package adalah tahap berbeda—bukan satu tombol magis bernama “install”.

## 2. Janji materi dan batas aman

Setelah menonton, penonton mampu menyimpulkan: “package manager membaca metadata dari repository yang dikonfigurasi, membuat rencana perubahan, mengunduh dan memeriksa arsip, memasangnya ke sistem, lalu mencatatnya sebagai package terpasang.”

| Dibahas | Tidak dibahas |
|---|---|
| Jenis repository, package manager distro, metadata, dependency, transaction, dan lifecycle instalasi. | Menambah/menghapus repository, PPA, konfigurasi source, atau cara memperbaiki error. |
| Izin perubahan sistem sebagai gerbang konseptual. | Password, root shell, `sudo`, policy, atau privilege escalation. |
| Package native distro sebagai fokus; alternatif lintas distro disebut hanya sebagai konteks. | Tutorial Flatpak, Snap, AppImage, skrip installer web, atau installer acak. |

Repository tepercaya tidak boleh diklaim “pasti aman”. Yang perlu diajarkan adalah: sistem mempercayai sumber yang dikonfigurasi dan mekanisme verifikasi yang sesuai; pengguna tetap perlu memahami asal sumber tersebut.

## 3. Peta repository

Repository adalah kumpulan sumber package **dan metadata** yang dikonfigurasi untuk sistem. Package manager biasanya mencocokkan nama package ke metadata (nama, versi, arsitektur, dependency, ukuran, checksum, signature, dan lokasi arsip) sebelum mengunduh arsip package.

| Sumber | Fungsi | Pesan visual | Nuansa yang wajib dijaga |
|---|---|---|---|
| Official/base | Package inti yang dipelihara distro. | `Official repository` | Titik awal yang direkomendasikan untuk pemula. |
| Updates/security | Perbaikan bug dan keamanan untuk saluran distro. | `Security updates` | Bagian dari saluran distro, bukan file terpisah dari internet. |
| Mirror | Salinan tersinkron dari repository resmi. | `Official mirror` | Mirror mendistribusikan salinan; bukan otomatis pengembang package. |
| Community/extra | Package tambahan dari komunitas distro. | `Community repository` | Kurasi dan kebijakan dapat berbeda per distro. |
| Vendor pihak ketiga | Source dari pembuat aplikasi/organisasi lain. | `Vendor repository` | Perlu asal, kebijakan update, dan trust key yang jelas. |
| Local/offline/corporate | Mirror internal, media lokal, atau repository organisasi. | `Local repository` | Berguna pada jaringan terbatas dan lingkungan perusahaan. |

Visual Act repository harus memperlihatkan katalog metadata lebih dulu, lalu arsip package. Dengan demikian penonton tidak mendapat kesan bahwa package manager “menjelajah web” dan memasang file pertama yang ditemukan.

## 4. Manager berbeda menurut distro

| Keluarga distro | Manager umum | Format/layer package | Perbedaan yang layak dijelaskan |
|---|---|---|---|
| Debian, Ubuntu, Linux Mint | `apt` | `.deb`, dengan `dpkg` | `apt` mengatur repository, dependency, dan transaction; `dpkg` memasang arsip `.deb`. |
| Fedora, RHEL, Rocky, AlmaLinux | `dnf` | `.rpm`, dengan RPM | Ekosistem RPM dengan manager dan kebijakan repository berbeda. |
| Arch, Manjaro | `pacman` | `.pkg.tar.*` | Satu alat utama untuk sinkronisasi repository dan pemasangan package Arch. |
| openSUSE, SUSE Linux Enterprise | `zypper` | `.rpm`, dengan RPM | Sama-sama RPM, tetapi tool, repository, dan kebijakan distro tidak identik dengan Fedora/RHEL. |
| Alpine Linux | `apk` | `.apk` Alpine | Ringan dan umum pada sistem minimal/container; bukan Android APK. |

Pesan utama layar: **jangan menyalin langkah dari distro lain**. Aplikasi yang sama dapat berbeda nama package, versi, dependency, dan sumbernya. Kesamaan format RPM juga bukan jaminan kompatibilitas penuh antar distro.

## 5. Anatomi satu transaction instalasi

| Tahap | Yang sebenarnya terjadi | Bukti visual | Kesalahan persepsi yang dicegah |
|---|---|---|---|
| Intent | Manager menerima nama package dan konteks sistem. | Kartu target `editor-lite`. | Aplikasi bukan sekadar nama file unduhan. |
| Metadata | Indeks repository dibaca untuk mencari kandidat. | Katalog mengirim nama, versi, dependency. | Repository tidak langsung mengirim app tanpa keputusan. |
| Candidate selection | Versi dan source dipilih menurut kebijakan sistem. | Badge versi dan source menyatu ke card. | Satu nama package belum tentu hanya punya satu kandidat. |
| Dependency resolve | Library/runtime pendukung, konflik, dan perubahan terkait dihitung. | Bundle utama + maksimal tiga chip dependency. | Dependency bukan dekorasi atau tambahan setelah app jadi. |
| Transaction plan | Daftar package baru/berubah/dihapus, ukuran unduhan, dan ruang disk disusun. | Panel `plan ready`. | Sistem tidak semestinya berubah sebelum ada rencana. |
| Authorization | Perubahan area sistem memperoleh izin. | Gerbang “system change approval”. | Izin bukan proses pencarian package. |
| Download | Arsip dibawa dari repository atau cache. | Arsip bergerak ke inbox/cache. | Download belum berarti aplikasi sudah terpasang. |
| Verification | Integrity dan/atau signature diperiksa sesuai repository. | Seal `verified`. | File yang selesai diunduh belum otomatis layak dipasang. |
| Unpack/stage | Arsip diekstrak dan file ditempatkan di lokasi sistem. | Arsip terbuka menjadi binary, library, desktop entry, docs. | Unpack berbeda dari download. |
| Configure/triggers | Langkah deklaratif package dan indeks sistem terkait diselesaikan. | Gear `configure`, lalu `refresh indexes`. | Install bukan hanya menyalin file. |
| Record result | Database package lokal menyimpan status, versi, dan file. | Ledger `installed: editor-lite`. | Sistem perlu tahu apa yang nanti diperbarui/dihapus. |
| Ready | Transaction lengkap; aplikasi dapat dipakai. | Kartu app aktif. | Jangan klaim aplikasi selalu langsung dibuka atau service selalu langsung berjalan. |

Service tidak selalu otomatis dimulai dan aplikasi tidak selalu langsung membuka jendela; hasil yang aman untuk ditampilkan adalah **“siap dipakai”**.

## 6. Storyboard baru: enam Act

| Act | Pertanyaan | Visual/cerita | Konsep pulang |
|---|---|---|---|
| 1 — Pilih package | “Apa yang diminta?” | `editor-lite` belum ada, lalu berubah menjadi kartu target. | Aplikasi punya nama package. |
| 2 — Kenali manager | “Siapa yang mengurus?” | Hub berganti label `apt`, `dnf`, `pacman`, `zypper`, dan `apk` pada jalur keluarga distro. | Tool berbeda, fungsi inti serupa. |
| 3 — Telusuri repository | “Datangnya dari mana?” | Request melihat official, security, mirror, community, vendor, dan local; metadata sumber aktif kembali ke card. | Repository adalah sumber yang dikonfigurasi. |
| 4 — Susun rencana | “Mengapa belum download?” | Resolver membentuk dependency bundle dan panel transaction plan. | Perubahan dihitung sebelum sistem berubah. |
| 5 — Pasang bertahap | “Apa arti install?” | Bundle melewati izin → download → verify → unpack → configure/triggers. | Instalasi adalah rangkaian proses. |
| 6 — Catat dan siap | “Apa hasilnya?” | Database mencatat result; kartu bertransformasi menjadi app ready; rantai proses ditutup. | Sistem tahu apa yang telah dipasang. |

Target ritme: 75–90 detik. Act 5 memperoleh waktu terpanjang karena ia memisahkan tahap yang sebelumnya disederhanakan menjadi satu progress bar.

## 7. Kontrak state dan continuity

| State | Yang terlihat | Yang belum boleh muncul |
|---|---|---|
| `need` | Target package + manager | Source, dependency, app ready. |
| `catalog` | Repository dan metadata | Arsip download atau final app. |
| `planned` | Kandidat, dependency, transaction plan | Progress instalasi. |
| `authorized` | Plan melewati gate izin | File sistem atau check final. |
| `downloading` | Arsip masuk cache/inbox | App terpasang. |
| `verified` | Seal pemeriksaan | Record database final. |
| `unpacking` | Arsip menjadi file sistem | App status success. |
| `configuring` | Gear dan trigger | Check final. |
| `installed` | Ledger + app ready | Gate atau progress aktif. |

Kartu `editor-lite` adalah anchor wajib: request → kandidat repository → bundle → arsip → file + database record → installed. Tidak boleh di-unmount dan diganti dengan app baru tanpa handoff visual.

## 8. Copy in-video yang disarankan

| Beat | Copy |
|---|---|
| Target | `Aplikasi punya nama package` |
| Manager | `Setiap distro memakai manager berbeda` |
| Repository | `Repository adalah sumber terkonfigurasi` |
| Metadata | `Metadata memilih versi dan kebutuhan` |
| Plan | `Rencana dibuat sebelum sistem berubah` |
| Download | `Download mengambil arsip` |
| Verify | `Arsip diperiksa sebelum dipasang` |
| Unpack | `File dibongkar ke sistem` |
| Configure | `Konfigurasi dan trigger diselesaikan` |
| Record | `Database mencatat package terpasang` |
| Closing | `Pilih sumber tepercaya untuk distro` |

Copy deklaratif, singkat, dan satu state per layar. Narasi boleh memberi konteks lebih lengkap tanpa berubah menjadi instruksi runnable.

## 9. Acceptance criteria implementasi nanti

- [ ] Menampilkan `apt`, `dnf`, `pacman`, `zypper`, dan `apk` beserta keluarga distro secara akurat.
- [ ] Membedakan official, security/updates, mirror, community, vendor, dan local/corporate repository.
- [ ] Menampilkan metadata dan transaction plan sebelum tahap download.
- [ ] Memisahkan download, verify, unpack, configure/triggers, serta pencatatan database package secara visual.
- [ ] Status installed hanya muncul setelah seluruh transaction selesai.
- [ ] Tidak ada command runnable, perubahan source repository, atau tutorial privilege escalation.
- [ ] Kartu package tetap memiliki continuity dari request sampai installed.
- [ ] Narasi menyebut bahwa detail dapat berbeda menurut distro dan package.

## 10. Rencana file saat implementasi disetujui

| File | Perubahan yang direncanakan, belum dilakukan |
|---|---|
| `src/content/34-install-applications/data.js` | Data distro/manager, sumber repository, lifecycle transaction, copy, palette. |
| `src/content/34-install-applications/Animation.jsx` | Enam Act, package handoff, repository map, dan konveyor tahap instalasi. |
| `src/content/34-install-applications/manifest.js` | Metadata yang selaras dengan materi revisi. |
| `src/content/34-install-applications/caption.md` | Caption sosial yang mengikuti penjelasan baru. |

Tidak ada file implementasi yang diubah oleh rencana ini; hanya dokumen plan ini yang direvisi.
