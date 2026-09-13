# PLAN-13 — Integrasi Shared Scene Components V1 ke Standardisasi

Tanggal: 2026-09-12
Status: ✅ DOKUMENTASI SELESAI (9/11 item §11 tercentang) — standardisasi
09, 03, 05, 04, 02, 01 sudah diupdate, README `docs/standardizations/`
dibuat baru, cross-reference 06 ditambahkan, semua path/import/prop sudah
di-cross-check ke source. 2 item tersisa (§11 poin 10-11: pilot kedua +
evaluasi dua pilot) menunggu topic baru berikutnya dibuat — di luar scope
kerja dokumentasi, bukan pending karena terlewat.

## 1. Keputusan

Ya, standardisasi perlu diperbarui setelah component V1 pada Plan 12 benar-benar
diimplementasikan dan lulus pilot. Jika tidak, component hanya tersedia tetapi
tidak menjadi jalur default; creator baru tetap cenderung copy-paste header,
badge, dan layout lama.

Tujuan Plan 13:

- menjadikan Scene UI V1 default bagi topic portrait standar;
- menjelaskan kapan wajib memakai V1 dan kapan boleh custom;
- memastikan V1 dipakai tanpa mengambil alih timeline/story topic;
- melindungi content existing dari migrasi otomatis;
- menyelaraskan Plan 11 (aturan workflow) dan Plan 12 (implementation primitives).

## 2. Dependency dan Urutan Aman

Plan ini baru dijalankan setelah:

1. Plan 11 selesai/disetujui: workflow, do/dont, safe-zone, continuity.
2. Plan 12 diimplementasikan: component V1 dan README tersedia.
3. Satu pilot topic menggunakan V1 serta lulus preview dan export test.

Jangan memasukkan kode import final ke dokumen standar sebelum API Plan 12
benar-benar tersedia. Dokumentasi harus mengikuti nama path dan props yang
terverifikasi, bukan asumsi dari plan.

## 3. Kebijakan Pemakaian Scene UI V1

### Wajib V1

Topic baru wajib memakai scene-ui V1 bila:

- portrait 820 × 1340;
- memiliki intro category/title/subtitle;
- memiliki dua atau lebih Act;
- memakai badge Act serta dot navigator;
- body utama dapat diletakkan di bawah badge;
- tidak memiliki kebutuhan layout khusus yang tertulis.

### Boleh opt-out

Topic boleh memakai layout custom bila landscape, simulator/dashboard,
split-screen, atau sengaja tidak memiliki struktur Act/header standar.

Opt-out wajib mencantumkan:

- alasan teknis atau storytelling;
- layout map pengganti;
- safe-zone pengganti;
- cara navigasi Act atau alasan tidak memakainya;
- preview manual collision.

Copy-paste implementasi lama bukan alasan opt-out.

### Existing content

- Tidak dimigrasi otomatis.
- Hanya topic baru atau topic yang sedang redesign besar yang dapat opt-in.
- Migrasi topic lama memerlukan plan, screenshot comparison, preview, dan export test.
- Component V1 baru tidak boleh mengubah visual topic existing.

## 4. Dokumen Standardisasi yang Perlu Diupdate

| Prioritas | File | Update yang direncanakan |
|---:|---|---|
| 1 | docs/standardizations/03-planning-storytelling-quality-gate.md | decision gate, quick-start, dan urutan pemakaian Scene UI V1 |
| 2 | docs/standardizations/03-planning-storytelling-quality-gate.md | policy default/opt-out, do/dont, checklist layout V1 |
| 3 | docs/standardizations/05-svg-layout-asset-pipeline.md | zone contract, local ContentBody coordinate, anti-overlay |
| 4 | docs/standardizations/04-motion-gsap-reference.md | cara topic memberi progress/state kepada pure components |
| 5 | docs/standardizations/02-topic-contract-scene-shell.md | plan topic wajib mencatat scene shell version atau custom opt-out |
| 6 | docs/standardizations/01-architecture-runtime.md | diagram timeline topic → scene component V1 → SVG |
| 7 | docs/standardizations/README.md | index dan alur baca yang mengarah ke rules baru |
| 8 | docs/standardizations/05-svg-layout-asset-pipeline.md | cross-reference ringan: icon ditempatkan di ContentBody, bukan pipeline baru |

Tidak perlu update file service atau audio karena V1 tidak mengatur backend maupun SFX.

## 5. Rencana Update Tutorial 03

Tambahkan langkah wajib sebelum membuat Animation.jsx: Pilih Scene Shell.

Checklist:

- Apakah topik portrait standard?
- Apakah ada hero header dan minimal dua Act?
- Apakah badge/dot digunakan?
- Jika ya, gunakan primitive V1 atau composer V1.
- Jika tidak, catat opt-out dan layout replacement di plan topic.

Tutorial akan menjelaskan bahwa:

- topic tetap memiliki state morph progress dan active Act;
- GSAP master timeline tetap di Animation.jsx topic;
- data PHASES tetap milik data.js topic;
- scene components hanya menerima props dan children SVG;
- jangan membuat header/badge inline kedua setelah memakai V1;
- semua visual topic-specific diletakkan dalam ContentBody V1.

Potongan import/API final ditambahkan hanya sesudah Plan 12 terverifikasi.

## 6. Rencana Update Standard 09

Tambahkan section: Scene Shell Default dan Layout Escape Hatch.

### Do

- gunakan IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1, atau SceneChromeV1 untuk portrait standard;
- deklarasikan PHASES sekali di data.js lalu pass ke navigator;
- gunakan local coordinate ContentBody untuk panel utama;
- aktifkan safe-area debug saat layout pertama dibuat;
- tulis version V1 pada plan topic.

### Dont

- jangan copy-paste SVG header/badge dari topic lain;
- jangan menaruh panel besar pada global coordinate header;
- jangan memakai clip untuk menyembunyikan collision;
- jangan membuat showIntro gating kedua yang menghilangkan header hasil morph;
- jangan memodifikasi V1 untuk satu kebutuhan topic yang sebenarnya custom.

Pre-coding checklist baru:

- [ ] Pilih V1 atau tulis opt-out.
- [ ] Pastikan PHASES dan active index cocok dengan jumlah dot.
- [ ] Tentukan title segments dan color identity series.
- [ ] Tentukan root content dan local coordinate system.
- [ ] Aktifkan debug safe area.
- [ ] Rencanakan screenshot intro progress 0, 0.5, 1 dan setiap Act boundary.

Review checklist:

- [ ] Header tetap terlihat setelah morph.
- [ ] Badge dan semua dot terlihat pada setiap Act.
- [ ] Content tidak menutupi subtitle/badge.
- [ ] Debug overlay mati pada export.
- [ ] Tidak ada duplicate header/badge inline.

## 7. Rencana Update SVG Guide 05

Tambahkan section Scene Zones V1 dan Local Coordinates.

Isi:

- tabel token PortraitSceneLayoutV1;
- origin ContentBody V1;
- rumus bounding box: top = centerY - height/2 dan bottom = centerY + height/2;
- header, navigation, safe gutter, body, transit, service, closing zone;
- checklist collision subtitle/badge/panel/ticket/service;
- contoh panel yang menggunakan ukuran body, bukan magic number global.

Larangan: negative local y tidak boleh dipakai untuk mendorong body kembali ke header kecuali topic memiliki opt-out layout yang sudah direview.

## 8. Rencana Update GSAP Reference 04

Tambahkan section Driving Pure Scene Components from Topic Timeline.

Aturan:

- progress morph dan active Act dimiliki topic;
- GSAP tween object mengubah state secara deterministik;
- component V1 tidak membuat timeline, repeat, audio, atau cleanup sendiri;
- gating navigator/body tetap diputuskan oleh topic;
- export hooks tetap dipasang topic.

Do: test progress 0, 0.5, 1 dan perubahan active Act.
Dont: pass timeline GSAP sebagai prop atau membuat scene component memanggil gsap.timeline saat mount.

## 9. Rencana Update Content Contract 02 dan Architecture 01

### File 02

Topic kompleks harus mencantumkan:

- scene shell: scene-ui V1 atau custom;
- layout preset;
- intro component;
- Act navigator;
- content origin;
- alasan opt-out bila custom;
- version migration bila suatu hari berpindah V1 ke V2.

Data topik dan timeline tetap tidak pindah ke shared component.

### File 01

Tambahkan diagram berikut:

~~~text
data.js: PHASES, intro metadata, palette
                │
Animation.jsx: GSAP timeline, morph progress, active Act
                │
                ▼
IntroHeaderMorphV1 + ActBadgeNavigatorV1 + ContentBodyV1
                │
                ▼
SVG scene
~~~

Pesan utama: V1 menjaga consistency presentation; storytelling dan timeline tetap milik topic.

## 10. Component README

Selain standardisasi, README di folder scene-ui harus menjelaskan HOW:

- daftar component dan tanggung jawab;
- props final;
- quick-start;
- individual primitive versus SceneChrome;
- safe-area debug;
- V1 compatibility;
- V1 ke V2 migration;
- opt-out criteria.

Standardisasi menjelaskan WHEN dan WHY memakai V1. README menjelaskan HOW memakai API-nya.

## 11. Tahap Eksekusi

1. [x] Tunggu Plan 11 selesai dan review istilah yang tumpang tindih —
       DIABAIKAN atas keputusan eksplisit user (2026-09-12): pilot topic 17
       dianggap bukti cukup untuk lanjut tanpa approval formal PLAN-11.
2. [x] Implement Plan 12 dan component README — `src/shared/scene-ui/v1/`
       (6 file component + fixture) dan `src/shared/scene-ui/README.md`
       sudah ada dan terverifikasi lengkap.
3. [x] Buat fixture test dan satu pilot V1 — `__fixtures__/SceneUiFixtureV1.jsx`
       ada; pilot topic 17-rest-api selesai & dikonfirmasi via PLAN-14.
4. [x] Finalisasi API/props dari hasil pilot — prop `categorySegments`
       ditambahkan ke `IntroHeaderMorphV1` (non-breaking, PLAN-12 §11),
       lihat PLAN-14 §3.1.
5. [x] Update 09 dan 03 — `09-standar-pembuatan-konten.md` §1.S (Scene
       Shell Default) + checklist §2 poin 4.0/4.0b/8 ditambahkan;
       `03-tutorial-buat-topic-baru.md` Langkah 0.5 (Pilih Scene Shell) +
       catatan di Langkah 2 + checklist commit ditambahkan.
6. [x] Update 05 dan 04 untuk layout/timeline contract —
       `05-svg-text-guide.md` § "Scene Zones V1 dan Local Coordinates"
       (token `DEFAULT_LAYOUT_V1` terverifikasi dari source, rumus
       bounding box, larangan local y negatif, checklist collision);
       `04-referensi-gsap.md` § "Driving Pure Scene Components from Topic
       Timeline" (aturan progress/activeIndex milik topic, contoh wiring,
       do/dont).
7. [x] Update 02 dan 01 untuk contract/architecture —
       `02-standar-konten.md` §10.1 (field scene shell wajib di plan topic
       kompleks: scene shell, layout preset, intro component, Act
       navigator, content origin, alasan opt-out, version migration);
       `01-architecture.md` §8 (diagram data.js → Animation.jsx → scene-ui
       V1 → SVG).
8. [x] Update README standardizations dan cross-reference 06 —
       `docs/standardizations/README.md` DIBUAT BARU (belum ada
       sebelumnya): index 9 file + tabel "Scene UI V1 — Kapan Baca yang
       Mana"; `06-icon-generation.md` diberi cross-reference ringan (icon
       tetap dirender di `ContentBodyV1`, pipeline generate/crop tidak
       berubah).
9. [x] Cross-check setiap path, import, version, dan checklist — semua
       named export (`SceneChromeV1`, `DEFAULT_LAYOUT_V1`,
       `IntroHeaderMorphV1`, `ActBadgeNavigatorV1`, `ContentBodyV1`,
       `toCanvasX/Y`, `toLocalX/Y`) dicek langsung terhadap
       `src/shared/scene-ui/v1/index.js` — cocok. Token layout
       (`header`/`navigator`/`body`/`transit`/`service`/`closing`) dicek
       langsung terhadap `PortraitSceneLayoutV1.js` — cocok. Prop
       `IntroHeaderMorphV1`/`ActBadgeNavigatorV1`/`ContentBodyV1`/
       `SceneChromeV1` yang didokumentasikan dicek langsung terhadap JSDoc
       + signature function di source masing-masing — cocok.
10. [ ] Jalankan topic baru berikutnya sebagai pilot kedua — **DI LUAR
        SCOPE dokumentasi PLAN-13**, baru bisa dieksekusi saat ada topic
        baru berikutnya dibuat (bukan pekerjaan update dokumen).
11. [ ] Evaluasi dua pilot sebelum mempertimbangkan V2 atau migrasi
        existing — bergantung pada item 10 selesai dulu (baru ada 1 pilot
        sejauh ini: topic 17-rest-api via PLAN-14).

## 12. Kriteria Sukses

Implementasi Plan 13 berhasil jika creator topic baru dapat:

- mengetahui V1 adalah default untuk scene portrait standard;
- memilih custom layout secara sadar dan terdokumentasi;
- memakai version explicit tanpa copy-paste header/badge;
- menjaga body di bawah safe gutter;
- memahami GSAP/story tetap milik topic;
- mengetahui content existing tidak berubah;
- mengetahui kapan perubahan harus dibuat sebagai V2, bukan mengubah V1.
