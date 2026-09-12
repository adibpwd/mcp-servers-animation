# PLAN-12 — Shared Scene Components V1 untuk Konsistensi Intro, Header, Act, dan Content Body

Tanggal: 2026-09-12
Status: PLAN ONLY — tidak mengubah content, shared code, atau standardisasi yang ada.

## 1. Tujuan

Saat ini banyak topic memiliki pola visual yang sama, tetapi masing-masing
menulis ulang versi sendiri:

- hero title di tengah lalu morph ke header kiri atas;
- category, title, dan subtitle;
- badge Act serta indikator dot;
- content body yang mulai setelah header/badge;
- portrait canvas 820 × 1340.

Karena implementasinya disalin per topic, hasilnya berbeda-beda: warna,
koordinat, ukuran badge, jumlah/posisi dot, gating intro, dan jarak header ke
content tidak selalu konsisten. Bahkan panel content dapat naik dan menutupi
subtitle atau badge.

Plan ini mengusulkan primitive SVG baru yang reusable dan ber-version V1.
Mereka hanya menyediakan chrome/layout scene. Cerita, icon, card, object,
request flow, GSAP timeline, serta data setiap topic tetap berada di folder
topic masing-masing.

Tujuan akhirnya:

- topic baru dapat memakai format visual yang sama dengan sedikit konfigurasi;
- content body otomatis mulai di bawah Act badge;
- perubahan kontrak besar kelak dibuat sebagai V2 tanpa merusak topic V1;
- topic existing tidak disentuh sampai ada migrasi opt-in terpisah.

## 2. Audit Singkat Kondisi Sekarang

Audit source menemukan shared code yang ada saat ini berfokus pada audio dan
utility kecil, seperti shared audio loader dan GlowDot. Belum ada shared
primitive khusus untuk scene portrait:

| Pola | Keadaan saat ini | Dampak |
|---|---|---|
| Intro hero → header | Ditulis ulang di banyak Animation.jsx dengan state dan koordinat berbeda | Title/category/subtitle tidak seragam |
| Act badge + dot | Ditulis inline per topic; ada yang besar di kiri, ada yang kecil di kanan, ada yang tidak punya dot | Navigasi Act tidak konsisten |
| Content origin | Banyak memakai translate/nested offset lokal | Header, subtitle, badge, dan browser/panel dapat bertabrakan |
| Gating intro | Variasi showIntro dan content visibility berbeda | Ada risiko content tampil ketika hero intro belum selesai |
| Timeline | Tiap topic punya ritme/narasi sendiri | Tidak boleh dipaksa menjadi shared component generik |

Kesimpulan: yang tepat direusable adalah presentational layout primitives,
bukan seluruh animasi.

## 3. Prinsip Arsitektur

### 3.1 Pure presentation, bukan owner timeline

Komponen V1 menerima progress dan state dari topic, tetapi tidak membuat
GSAP timeline sendiri.

Alasan:

- setiap topic punya duration, SFX, act, dan storytelling berbeda;
- komponen shared yang mengatur timeline akan memaksa format cerita yang sama;
- component murni lebih aman untuk export/seek karena hanya merender props.

Topic tetap memiliki state morph progress, active act index, dan timeline.
Komponen hanya merender hasil state tersebut.

### 3.2 Layout token tunggal

Koordinat standard portrait tidak disalin ke setiap topic. Satu layout preset
menyediakan anchor dan safe-zone yang sama.

### 3.3 Explicit versioning

Semua nama dan path mengandung V1. Setelah dipakai oleh topic:

- perubahan kompatibel boleh dilakukan di V1;
- perubahan prop wajib, coordinate model, atau visual contract yang mengubah
  output disebut breaking change;
- breaking change dibuat sebagai V2 baru di path baru;
- V1 tidak diubah agar topic existing tetap stabil.

### 3.4 Opt-in only

Tahap implementasi awal tidak memodifikasi topic existing. Satu topic pilot
baru atau topic yang memang sedang direvisi dapat memilih import V1.
Migrasi content lama harus memiliki plan khusus, preview manual, dan dapat
ditunda tanpa menghambat component baru.

## 4. Lokasi File yang Direncanakan

Struktur baru yang direncanakan:

~~~
src/shared/scene-ui/
├── v1/
│   ├── PortraitSceneLayoutV1.js
│   ├── IntroHeaderMorphV1.jsx
│   ├── ActBadgeNavigatorV1.jsx
│   ├── ContentBodyV1.jsx
│   ├── SceneChromeV1.jsx
│   ├── SceneSafeAreaDebugV1.jsx
│   └── index.js
└── README.md
~~~

Arti setiap file:

| File | Tanggung jawab |
|---|---|
| PortraitSceneLayoutV1.js | token canvas, safe-zone, anchor, helper koordinat |
| IntroHeaderMorphV1.jsx | title hero menuju compact header |
| ActBadgeNavigatorV1.jsx | Act badge, bullet, dan dot navigator |
| ContentBodyV1.jsx | origin content di bawah badge dan optional clipping/debug boundary |
| SceneChromeV1.jsx | composer ringan: header + navigator + content slot |
| SceneSafeAreaDebugV1.jsx | overlay development untuk melihat zona/collision; tidak aktif pada production |
| index.js | named exports stabil untuk V1 |
| README.md | contract props, quick start, versioning, dan migration rule |

Tidak ada file global yang ditimpa. Folder baru dapat hidup berdampingan dengan
shared audio yang sudah ada.

## 5. PortraitSceneLayoutV1: Kontrak Zona

Canvas standar: 820 × 1340.

Komponen layout menetapkan posisi berikut.

| Token | Nilai V1 | Fungsi |
|---|---:|---|
| canvas.width | 820 | portrait standard |
| canvas.height | 1340 | portrait standard |
| header.x | 44 | left alignment title |
| header.taglineY | 50 | category/series |
| header.titleY | 100 | title |
| header.subtitleY | 130 | subtitle |
| navigator.x | 44 | badge kiri |
| navigator.y | 155 | badge top |
| navigator.width | 500 | badge width |
| navigator.height | 40 | badge height |
| navigator.dotsX | 620 | start dot group |
| navigator.dotsY | 175 | center dot |
| body.x | 44 | body content left |
| body.y | 235 | body safe start |
| body.width | 732 | usable width |
| body.height | 965 | body usable height |
| transit.yStart | 476 | start corridor packet/path |
| service.yStart | 610 | lower processing/service region |
| closing.yStart | 1020 | result/closing region |

V1 menyediakan konsep zona, bukan melarang topic membuat layout unik. Jika
topic membutuhkan split-screen atau landscape, ia tidak boleh memaksa preset
portrait V1; nantinya perlu preset atau version baru yang eksplisit.

### Aturan body origin

Semua children content akan memakai local coordinate dari body origin:

- local x = 0 berarti canvas x 44;
- local y = 0 berarti canvas y 235;
- lebar local content = 732;
- komponen browser/card besar harus tetap berada dalam body box.

Dengan aturan ini, content tidak boleh langsung menggunakan y 100–200 kecuali
memang berada dalam header/navigator component. Ini menghilangkan sebagian
besar risiko panel menabrak subtitle dan badge.

## 6. IntroHeaderMorphV1

### Fungsi

Merender satu grup SVG persisten berisi:

- category/tagline;
- title yang dapat dipecah menjadi beberapa colored segments;
- subtitle;
- interpolasi posisi dan ukuran dari hero centered ke compact header.

Komponen tidak mengelola typing. Typing adalah optional effect milik topic
karena tidak semua topic membutuhkan atau cocok menggunakannya.

### Props V1 yang direncanakan

| Prop | Wajib | Makna |
|---|---|---|
| progress | ya | angka 0 sampai 1 dari timeline topic |
| category | ya | misalnya NETWORKING · ADIB-DEV.COM |
| titleSegments | ya | array label, color, dan optional weight |
| subtitle | ya | subtitle singkat |
| layout | tidak | default PortraitSceneLayoutV1 |
| hero | tidak | override aman untuk ukuran/posisi hero tanpa ubah compact header |
| compact | tidak | override kecil yang non-breaking, misalnya title size |
| visible | tidak | default true, untuk fade container jika topic benar-benar butuh |
| testId | tidak | label debug/test |

Contoh konsep title segments:

| Segment | Color |
|---|---|
| REST | mint |
| API | sky blue |

### Perilaku V1

- progress 0: title group berada di hero center.
- progress 1: group berada di header zone dan tetap terlihat.
- progress 0 sampai 1: posisi, font size, dan alignment diinterpolasi.
- component tidak pernah otomatis menghilang di progress 1.
- category/subtitle tidak boleh menjadi putih atau blank pada akhir morph.
- component hanya menghasilkan SVG group dan text; tidak memasang background
  penuh atau flash.

### Do

- gunakan satu instance component dari intro sampai akhir scene;
- gerakkan progress dengan GSAP dari topic;
- gunakan titleSegments untuk brand/palette seri;
- gate content body dari topic sampai intro morph selesai jika dibutuhkan.

### Dont

- jangan render hero header lalu render compact header kedua yang berbeda;
- jangan menaruh spinner/flash putih di dalam component;
- jangan memasukkan SFX atau timeline repeat ke component;
- jangan memaksa typing sebagai default.

## 7. ActBadgeNavigatorV1

### Fungsi

Merender navigation yang mengikuti pola Tailscale:

- badge horizontal kiri;
- bullet warna Act;
- label Act;
- semua dot Act tetap terlihat;
- dot active berubah warna, radius, dan stroke.

### Props V1 yang direncanakan

| Prop | Wajib | Makna |
|---|---|---|
| phases | ya | array minimal satu item: id, label atau badge, color |
| activeIndex | ya | index Act aktif |
| layout | tidak | default PortraitSceneLayoutV1 |
| visible | tidak | default true |
| maxLabelChars | tidak | warning/debug jika label terlalu panjang |
| ariaLabel | tidak | untuk accessibility/debug |
| testId | tidak | test selector |

Contract phase V1:

| Field | Arti |
|---|---|
| id | key stabil |
| badge | teks seperti ACT 1 — ... |
| badgeColor | warna active state |
| optional shortLabel | fallback jika badge terlalu panjang |

### Perilaku V1

- navigator memakai x 44/y 155, width 500, height 40 secara default;
- dot dimulai x 620, jarak 24 px;
- active dot radius 7, white outline 1,5;
- inactive dot radius 4, BORDER color;
- component tidak mengubah activeIndex dan tidak mengatur duration Act;
- warning development muncul bila dot melebihi canvas atau badge text lebih
  panjang dari safe width.

### Do

- deklarasikan phases hanya sekali di data.js topic;
- pakai index timeline yang sama untuk activeIndex;
- gunakan empat atau lima Act sesuai cerita, bukan menambah Act hanya untuk
  memenuhi jumlah dot.

### Dont

- jangan menyalin SVG badge baru di setiap Animation.jsx;
- jangan mengganti jumlah dot dengan element yang muncul/hilang antar Act;
- jangan taruh badge di header zone atau body zone.

## 8. ContentBodyV1

### Fungsi

Menjadi boundary tunggal untuk semua content utama setelah badge. Component
membuat SVG group pada body x/y, memberikan dimensi local, dan secara optional
menyediakan clip path serta debug boundary.

Isi/children tetap ditentukan topic; ContentBodyV1 tidak tahu browser, server,
card, icon, maupun flowchart.

### Props V1 yang direncanakan

| Prop | Wajib | Makna |
|---|---|---|
| children | ya | SVG content topic |
| layout | tidak | default PortraitSceneLayoutV1 |
| visible | tidak | default true |
| clip | tidak | default false; true hanya jika topic ingin menahan overflow |
| padding | tidak | optional inset body |
| debugName | tidak | label overlay development |
| render | optional | render prop menerima local width, height, toCanvasX, toCanvasY |

Dua penggunaan yang diizinkan:

1. children biasa untuk topic yang sudah memakai local coordinate.
2. render prop untuk topic yang memerlukan ukuran body sebagai input layout.

### Kontrak anti-overlap

- root ContentBodyV1 selalu translate ke body.x/body.y;
- body top tidak boleh kurang dari y 235 pada portrait V1;
- children tidak boleh menggambar panel utama dengan top local negatif tanpa
  eksplisit override dan review;
- SceneSafeAreaDebugV1 dapat memperlihatkan rect body sehingga collision
  langsung terlihat di preview.

### Do

- letakkan browser, diagram, service, dan caption kontekstual dalam body;
- gunakan body width/height untuk center axis dan max card width;
- gunakan transit/service sub-zones dari layout token untuk path vertikal.

### Dont

- jangan menaruh title/subtitle atau act navigator sebagai children body;
- jangan memakai translate tambahan yang mengembalikan panel ke header zone;
- jangan memakai clip true sebagai cara menyembunyikan bug layout.

## 9. SceneChromeV1

### Fungsi

SceneChromeV1 adalah convenience composer untuk topic yang memakai format
standar penuh. Ia merender urutan:

1. IntroHeaderMorphV1
2. ActBadgeNavigatorV1
3. ContentBodyV1

Topic dapat memakai ketiga primitive satu per satu bila perlu variasi, tetapi
SceneChromeV1 adalah default recommended untuk topic portrait baru.

### Props V1 yang direncanakan

| Prop | Makna |
|---|---|
| intro | props IntroHeaderMorphV1 |
| navigator | props ActBadgeNavigatorV1 |
| content | props ContentBodyV1 |
| showNavigator | false selama intro bila diperlukan |
| showContent | false selama intro bila diperlukan |
| layout | preset portrait V1 |
| debug | menyalakan safe area overlay secara local/dev only |

Batas SceneChromeV1:

- tidak mengatur SVG root, filters, background grid, audio, export hooks,
  GSAP, atau state topic;
- tidak memiliki opini tentang data/content body;
- tidak memaksa semua topic memakai caption bar;
- tidak menggantikan animasi topic existing.

## 10. SceneSafeAreaDebugV1

### Tujuan

Masalah overlay sering baru terlihat setelah preview. Debug component membantu
melihat batas layout sebelum export.

Mode debug menampilkan dengan opacity rendah:

- Header zone;
- Navigator zone;
- Body box;
- transit corridor;
- service zone;
- label x/y dan optional bounding box content.

Aturan:

- hanya aktif dari prop debug atau environment development;
- tidak boleh terlihat pada export/production;
- tidak mengubah posisi content;
- tidak mengandalkan window atau DOM measurement sehingga export seek tetap aman.

## 11. Kontrak Versioning

### Nama dan import

Semua import memakai versi eksplisit.

Contoh konsep:

~~~
src/shared/scene-ui/v1/IntroHeaderMorphV1.jsx
src/shared/scene-ui/v1/ActBadgeNavigatorV1.jsx
src/shared/scene-ui/v1/ContentBodyV1.jsx
~~~

Tidak ada import tanpa versi seperti scene-ui/Header.jsx.

### Apa yang boleh diubah di V1

- perbaikan bug yang tidak mengubah output layout terkontrak;
- perbaikan accessibility;
- internal refactor;
- prop optional baru dengan default yang mempertahankan output lama;
- warning development baru.

### Apa yang harus membuat V2

- mengubah default coordinate zones;
- mengubah struktur props wajib;
- mengubah dot/badge default hingga visual topic V1 berubah;
- mengganti model titleSegments;
- mengubah body origin atau coordinate model;
- menambah behaviour timeline/GSAP pada component yang sebelumnya pure.

Jika V2 diperlukan, buat folder parallel:

~~~
src/shared/scene-ui/v2/
~~~

V1 tetap dipertahankan sampai topic yang bergantung padanya dimigrasi dengan
rencana dan preview tersendiri.

## 12. Non-Goals

Plan ini sengaja tidak membuat component reusable untuk:

- semua type card user/profile;
- request packet dan response packet;
- API Service Hub;
- icon/avatar;
- resource cabinet;
- generic GSAP master timeline;
- SFX trigger;
- storytelling Act.

Semua item di atas sangat domain-specific. Memaksanya menjadi shared sekarang
akan menciptakan abstraction besar yang justru memperlambat topic berikutnya.

## 13. Rencana Implementasi Bertahap, Belum Dilakukan

### Tahap A — Kontrak dan skeleton

- [x] Buat folder scene-ui/v1 baru.
- [x] Tulis README kontrak, versioning, dan quick-start. (`src/shared/scene-ui/README.md`)
- [x] Buat PortraitSceneLayoutV1 tokens dan helper local coordinate.
- [x] Tambah test/demonstration fixture minimal tanpa menyentuh topic existing.
      (`src/shared/scene-ui/v1/__fixtures__/SceneUiFixtureV1.jsx`, di-mount lewat
      1 route baru `/dev/scene-ui-v1` di App.jsx — tidak ada topic yang diubah.)

### Tahap B — Pure components

- [x] Implement IntroHeaderMorphV1 sebagai pure SVG.
- [x] Implement ActBadgeNavigatorV1 sebagai pure SVG.
- [x] Implement ContentBodyV1 sebagai safe body wrapper.
- [x] Implement SceneSafeAreaDebugV1 yang benar-benar off secara default.
- [x] Implement SceneChromeV1 sebagai composer tipis.
- [x] Export named components dari index V1.

### Tahap C — Validasi komponen isolasi

- [x] Render fixture progress intro 0, 0,5, dan 1.
      (Divalidasi via Puppeteer headless terhadap `/dev/scene-ui-v1`, 2026-09-12.
      Temuan: fixture awalnya belum demonstrasikan gating `showContent` selama
      intro — karena hero title (HERO_DEFAULTS.titleY≈640) berada di dalam zona
      body (y 235-1200), content yang tidak digate akan menutupi hero saat
      progress<1. Ini sesuai PLAN-12 §6 Do ("gate content body dari topic jika
      dibutuhkan") — bukan bug komponen. Fixture sudah diperbaiki: tambah toggle
      "gate content selama intro" (default on) supaya validasi merepresentasikan
      pemakaian yang benar. Setelah gating aktif: progress 0 = hero besar di
      tengah terlihat jelas, progress 0.5 = interpolasi mulus, progress 1 =
      header compact + content muncul, tidak ada overlap.)
- [x] Render navigator untuk 1 sampai 6 Act dan cek dot tidak keluar canvas.
      (Dicek pakai getCTM() dikoreksi scale viewBox->render, absX/absY tiap
      dot dihitung untuk n=1..6. Semua dot dalam batas 820x1340; dot terakhir
      pada n=6 di x=780, masih 40px dari tepi kanan.)
- [x] Render body dengan panel maksimal dan cek top tidak masuk header/badge.
      (Rect content body: absTop=235, absBottom=1195. Badge navigator berakhir
      di absBottom=195. Tidak ada overlap — sesuai kontrak body.y=235.)
- [x] Pastikan semua komponen compile pada JSX automatic runtime.
      (Divalidasi otomatis: `esbuild --jsx=automatic` sukses untuk 9 file yang
      disentuh, plus bundle-resolution check lewat `__fixtures__/SceneUiFixtureV1.jsx`
      — semua import antar file di v1/ resolve tanpa error.)
- [x] Pastikan debug overlay tidak aktif pada production/export configuration.
      (Diverifikasi RUNTIME, bukan cuma code review: dengan NODE_ENV=production
      saat menjalankan vite dev server, import.meta.env.DEV terbukti false
      dan overlay TETAP tersembunyi walau debug=true di-set eksplisit — sama
      seperti behavior production build. Dengan NODE_ENV=development, overlay
      muncul saat debug=true dan hilang saat debug=false, semua 6 zona (header,
      navigator, body, transit, service, closing) konsisten dengan token
      PortraitSceneLayoutV1. Catatan: full `npm run build` project ini gagal
      karena bug syntax error pra-eksisting di
      src/content/16-env-variables/Animation.jsx:229 (unclosed brace,
      "Unexpected end of file") — tidak terkait scene-ui V1, di luar scope
      Plan 12/13, dilaporkan terpisah dan belum diperbaiki.)

Temuan tambahan Tahap C: dev-warning ActBadgeNavigatorV1 untuk badge
kepanjangan sempat terlihat tidak berfungsi saat pengecekan awal — ternyata
sebabnya environment (NODE_ENV=production terwarisi dari shell/container
provisioning docker-compose, lihat .env.docker), bukan bug kode. Warning
terkonfirmasi berfungsi normal begitu NODE_ENV=development diset eksplisit
saat start dev server manual (di luar docker-compose).

### Tahap D — Pilot opt-in

- [x] Pilih satu topic yang sedang direvisi, bukan topic stable.
      (Topic 17-rest-api, lihat diskusi risiko/konflik dengan Bug E-H di sesi
      sebelumnya — diputuskan lanjut meski 8 item preview manual pending.)
- [x] Buat migration plan khusus sebelum import component V1.
      (`docs/plan/PLAN-14-MIGRASI-PILOT-17-REST-API-KE-SCENE-UI-V1.md` —
      scope disempitkan hanya header + badge/navigator, body TETAP custom
      karena terikat erat ke Bug E-H yang belum diverifikasi. Ditemukan
      koordinat header topic 17 COCOK PERSIS dengan token V1, badge sangat
      dekat (delta 13-20px). 3 gap API sudah dicatat: continuous fade-in
      opacity, gating contentStarted, dan font-family/weight/filter title
      segment yang belum dipastikan — belum dieksekusi ke kode.)
- [x] Eksekusi kode migrasi (header → IntroHeaderMorphV1, badge/navigator →
      ActBadgeNavigatorV1; body TETAP custom, tidak dimigrasi). Verifikasi
      Vite transform (curl 200 semua file tersentuh) + docker compose logs
      bersih — `NO_ERROR_FOUND`. Detail lengkap di PLAN-14 §4.
- [x] Bandingkan screenshot sebelum/sesudah pada hero, setiap Act, dan
      closing. (Dikonfirmasi user via preview manual browser langsung —
      "check aman", 2026-09-12. Screenshot terpisah tidak dibuat, tapi
      preview visual manual sudah menggantikan tujuan item ini: tidak ada
      overlap/regresi terlihat pada hero, Act 1-4, maupun closing.)
- [x] Jalankan preview manual dan export test. (Dikonfirmasi user,
      2026-09-12: preview web + export video topic 17-rest-api pasca-
      migrasi V1 keduanya aman, tidak ada regresi.)
- [x] Catat gap API jika ada; jangan mengubah V1 breaking hanya untuk satu
      topic. (3 gap dicatat di PLAN-14 §3: continuous opacity fade — solved
      via wrapper `<g opacity>` eksternal; gating `contentStarted` — solved
      via kondisi render existing, tidak lewat prop `visible`; `category`
      V1 semula cuma 1 warna — DISELESAIKAN dengan menambah prop opsional
      baru `categorySegments` ke `IntroHeaderMorphV1` (non-breaking, default
      lama tetap jalan kalau prop ini tidak dipakai — lihat PLAN-14 §3.1).
      Tidak ada perubahan breaking ke `src/shared/scene-ui/v1/`; 1 perubahan
      non-breaking yang diizinkan PLAN-12 §11 dilakukan.)

### Tahap E — Dokumentasi

- [ ] Setelah pilot sukses, tambahkan referensi component V1 ke standar yang
      disetujui oleh pekerjaan Plan 11.
- [ ] Tambahkan tutorial penggunaan pada 03-tutorial-buat-topic-baru.
- [ ] Tambahkan safe-zone/component contract pada 05-svg-text-guide.
- [ ] Tambahkan decision rule: kapan gunakan SceneChromeV1 dan kapan harus
      membuat layout khusus.

## 14. Hubungan dengan Plan 11

Plan 11 sedang dikerjakan pihak lain untuk standardisasi workflow. Plan 12
tidak bergantung pada perubahan kode Plan 11, tetapi dokumentasi finalnya
harus diselaraskan setelah Plan 11 selesai.

Pembagian tanggung jawab:

| Plan 11 | Plan 12 |
|---|---|
| aturan proses, do/dont, pre-planning, continuity, asset matrix | implementation primitive untuk menjalankan format standar |
| menjelaskan kapan safe-zone wajib dibuat | menyediakan layout token dan debug overlay |
| menjelaskan header/identity series harus konsisten | menyediakan intro/header component yang konsisten |
| menjelaskan Act perlu navigation konsisten | menyediakan badge/dot component V1 |

Urutan aman:

1. Selesaikan dan setujui Plan 11.
2. Review Plan 12 agar token/kontrak tidak bertentangan dengan standardisasi.
3. Implement component V1 tanpa memigrasi topic existing.
4. Pilot pada satu topic.
5. Baru dokumentasikan pemakaian default untuk topic baru.

## 15. Kriteria Sukses

Plan ini dianggap berhasil bila implementasinya nanti memenuhi semua hal berikut:

- topic baru dapat memakai intro/header/badge/body standar tanpa copy-paste SVG;
- title hero tetap merupakan object yang sama ketika menjadi header;
- Act badge dan semua dot konsisten di seluruh topic V1;
- content body default tidak mungkin mulai di atas badge safe gutter;
- component tidak mengambil alih GSAP/story/content topic;
- V1 dapat hidup stabil saat V2 dibuat kelak;
- tidak ada content existing yang berubah hanya karena shared component baru ditambahkan;
- developer dapat memilih primitive individual atau SceneChromeV1 tanpa kehilangan fleksibilitas cerita.
