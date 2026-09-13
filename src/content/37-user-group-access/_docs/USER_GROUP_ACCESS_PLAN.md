# PLAN — 37 User, Group, dan Siapa Boleh Apa

| Item | Nilai |
|---|---|
| Content | 37 — User, Group, and Access |
| Status | 📝 PLAN ONLY — jangan dieksekusi |
| Target audiens | Pemula Linux dan pengguna komputer umum |
| Tujuan belajar | Memahami user sebagai identitas, group sebagai tim akses, dan ownership sebagai dasar sebelum permission/chmod |
| Prasyarat | 25 Linux Filesystem dan 34 Install Applications |
| Scene shell | scene-ui V1, portrait 820 × 1340 |

## Audience promise

Setelah menonton, audiens memahami bahwa Linux tidak hanya melihat nama file: Linux juga melihat siapa pemiliknya, grup mana yang terkait, dan siapa yang diberi akses.

## Identitas seri

| Field | Keputusan |
|---|---|
| Kategori | Linux Fundamentals |
| Title A | USER — cyan atau blue |
| Title B | ACCESS — emerald |
| Subtitle | Identitas, tim, dan file bersama |
| Tone | Gedung kerja bersama: kartu identitas membuka ruang sesuai peran |
| Shell | Scene UI V1 dengan hero-to-header, empat Act, badge, dan dot navigator |

## Batas akurasi

1. User adalah akun/identitas sistem; group adalah kumpulan user untuk pembagian akses.
2. Kepemilikan file dicatat sebagai user owner dan group owner, bukan hanya “milik semua orang”.
3. Content ini belum mengajarkan angka permission atau command chmod/chown secara detail; itu diteruskan pada content 40–42.
4. Jangan menyatakan group otomatis memberi semua akses; akses final tetap dipengaruhi permission file.
5. Gunakan user contoh generik: adib, nisa, dan group project-team.

## Validasi analogi

User dianalogikan sebagai kartu identitas pekerja. Group dianalogikan sebagai daftar tim yang bisa mendapat akses bersama ke satu ruang. File adalah lemari dengan nama pemilik dan nama tim. Analogi tidak menyamakan group dengan password atau admin; group hanya membantu Linux mengelompokkan aturan akses.

## Storyboard empat Act

| Act | Setup → tegangan → titik balik → payoff | Konsep | Exit state |
|---|---|---|---|
| 1 — Identitas | Dua orang membuka komputer yang sama → sistem perlu tahu siapa yang masuk → kartu user adib dan nisa muncul → setiap proses berjalan atas identitas user. | user account | Dua user memiliki identitas berbeda. |
| 2 — Tim | Dua user bekerja pada proyek sama → akses satu-satu merepotkan → project-team dibuat sebagai grup → anggota tim dikumpulkan. | group | adib dan nisa tercatat dalam project-team. |
| 3 — Pemilik file | File proposal.md dibuat oleh adib → label owner dan group melekat pada file → nisa terlihat sebagai anggota grup, bukan pemilik pribadi → ownership punya dua sisi. | user owner dan group owner | proposal.md memiliki owner adib dan group project-team. |
| 4 — Aturan berikutnya | Tim perlu menentukan siapa yang dapat membaca atau menulis → layer permission muncul sebagai gerbang berikutnya → user/group memberi konteks untuk aturan → audience siap masuk permission. | hubungan user, group, permission | Takeaway menghubungkan identitas sebelum chmod. |

## State contract

| State | Yang terlihat | Yang belum boleh terlihat | Pemicu | Hasil |
|---|---|---|---|---|
| Identitas | Kartu adib dan nisa | Group bersama | Act 1 | Linux mengenal user aktif |
| Tim | Group project-team dengan anggota | Ownership file final | Act 2 | Anggota dapat dikelompokkan |
| Ownership | File proposal.md dengan owner/group tags | Akses read/write final | Act 3 | Dua label ownership dipahami |
| Permission context | Gerbang read/write redup | Detail chmod | Act 4 | Dasar menuju content permission |

## Continuity map

Kartu user adib dan nisa adalah anchor persisten. Group project-team lahir di Act 2 dan tetap hidup pada Act 3–4. File proposal.md lahir di Act 3 sebagai objek yang menerima tag owner dan group; tag tidak boleh muncul sebelum file terlihat. Gerbang permission pada Act 4 adalah teaser, bukan perubahan akses nyata.

## Layout map V1

Semua koordinat adalah local terhadap ContentBodyV1.

| Area | Local y | Isi |
|---|---:|---|
| Narration bubble | 35–115 | Caption singkat per beat |
| User identity cards | 155–360 | adib dan nisa sebagai anchor |
| Group lane | 405–530 | project-team dan hubungan anggota |
| File ownership card | 585–745 | proposal.md, owner, dan group tags |
| Permission teaser / takeaway | 800–930 | Gerbang redup dan rangkuman |

Kartu user diletakkan horizontal dengan perhitungan lebar dan gap minimal. Semua body child memakai local y positif. Header dan navigator hanya dikelola Scene UI V1.

## Elemen visual dan aset

| Elemen | Bentuk | Perilaku |
|---|---|---|
| User card | Inline SVG ID card | Persistent dari Act 1 sampai akhir |
| Group capsule | Inline SVG team pill | Lahir Act 2, menerima member connector |
| File card | Inline SVG dokumen | Lahir Act 3 |
| Owner tag | Inline SVG pill cyan | Menempel ke file setelah file tampil |
| Group tag | Inline SVG pill purple | Menempel ke file setelah owner tag |
| Permission gate | Inline SVG gate redup | Teaser Act 4 |

First pass memakai inline SVG karena kartu user, connector group, dan file ownership memerlukan state animasi. Saat eksekusi, buat folder icons, icons.json, default-icon.png, serta loader fallback sesuai kontrak topic baru.

## Draft teks in-video

| Beat | Teks |
|---|---|
| Act 1 | Linux mengenal user aktif |
| Act 1 | Setiap user punya identitas |
| Act 2 | Group menyatukan tim |
| Act 2 | Anggota berbagi konteks akses |
| Act 3 | File punya user owner |
| Act 3 | File juga punya group owner |
| Act 4 | Permission memakai konteks ini |
| Closing | Identitas datang sebelum izin |

Semua teks produksi deklaratif, pendek, tanpa emoji, tanpa kata ganti orang, dan tidak menduplikasi kalimat antara bubble serta kartu informasi.

## Audio beat map

| Momen | Candidate SFX | Catatan |
|---|---|---|
| Intro selesai | success/shimmer | Header compact selesai |
| User card masuk | ui/pop dan ui/pop-2 | Dipisah sedikit |
| Connector menuju group | impacts/connector-snap | Menandai anggota masuk tim |
| File proposal muncul | ui/paper-arrive | Awal Act 3 |
| Owner/group tag menempel | ui/tick | Maksimal dua cue berdekatan |
| Permission gate teaser | impacts/lock | Tidak menyatakan akses benar-benar terkunci |
| Takeaway | success/ding | Penutup |

Sebelum implementasi, audit aset audio shared untuk semantik, loudness, provenance, dan kategori. Semua cue aktual perlu masuk SFX_MAP dan export schedule pada waktu yang sama dengan GSAP.

## Rencana file saat eksekusi

| File | Perubahan yang direncanakan |
|---|---|
| src/content/37-user-group-access/data.js | Viewport, PHASES, palette, user/group/file labels, captions, dan SFX_MAP. |
| src/content/37-user-group-access/manifest.js | Metadata Linux Fundamentals. |
| src/content/37-user-group-access/Animation.jsx | Timeline GSAP, reset loop, Scene UI V1, user cards, group connector, ownership file, dan teaser permission. |
| src/content/37-user-group-access/caption.md | Caption sosial media di luar video. |
| src/content/37-user-group-access/icons/* | icons.json, fallback icon, loader, dan aset bila audit membutuhkannya. |
| src/content/registry.js | Entry manifest coming-soon sesudah implementasi. |
| scripts/export-lib.js | Jadwal SFX yang sinkron. |

## Checklist eksekusi

- [ ] Kunci metadata dan title segments cyan/blue → emerald.
- [ ] Buat data.js sebelum Animation.jsx.
- [ ] Buat manifest, caption, dan kontrak folder icons.
- [ ] Gunakan satu IntroHeaderMorphV1 yang tetap mounted setelah morph.
- [ ] Gunakan ActBadgeNavigatorV1 dari satu array PHASES.
- [ ] Render semua visual di ContentBodyV1 local coordinate.
- [ ] Jadikan user cards dan project-team anchor sesuai continuity map.
- [ ] Munculkan owner/group tag hanya setelah file proposal terlihat.
- [ ] Jangan memvisualkan group sebagai izin penuh tanpa layer permission.
- [ ] Reset seluruh state pada repeat timeline.
- [ ] Wire SFX_MAP dan export schedule dengan kategori eksplisit.
- [ ] Audit dead field, teks in-video, collision, dan coverage SFX.
- [ ] Compile, preview intro/morph/semua Act/replay, lalu export MP4.

## Batasan

Content ini tidak mengajarkan sudo, root, chmod, chown, ACL, atau angka 755/644. Sudo dibahas pada content 38; permission, chmod, dan chown dibahas pada content 40–42.
