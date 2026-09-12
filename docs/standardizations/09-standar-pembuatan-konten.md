# 09 — Standar Pembuatan Konten: Pre-Planning & Anti-Pattern

> Alur baca lengkap: `01-architecture` → `02-standar-konten` → `03-tutorial-buat-topic-baru` → `04-referensi-gsap` → `05-svg-text-guide` → `06-icon-generation` → `08-audio-sfx-generation` → **`09-standar-pembuatan-konten`**

Dokumen ini merangkum **checklist wajib pre-planning** dan **anti-pattern**
yang ditemukan dari studi kasus nyata: topic `14-http-request-response`
mengalami **14 revisi dalam 1 hari** (2026-09-09 s/d 2026-09-10). Mayoritas
revisi itu seharusnya bisa dicegah kalau standar di dokumen ini sudah ada
sebelum mulai coding.

Dokumen ini **bukan** tutorial step-by-step pembuatan topic (itu ada di
`03-tutorial-buat-topic-baru.md`) — fokusnya adalah checklist yang wajib
diselesaikan SEBELUM dan SELAMA coding, plus daftar anti-pattern spesifik
supaya tidak terulang.

## 0. Ringkasan Pola Masalah

| Kategori Masalah | Revisi Terkait | Contoh Singkat |
|---|---|---|
| Narasi & analogi tidak divalidasi sebelum coding | 07, 11 | "Browser = Tukang Pos" salah posisi, "Surat siap!" terlalu dini |
| Icon tidak direncanakan menyeluruh di awal | 01, 02, 03 | 3 batch icon + 1 batch tambahan, harusnya 1 plan sekaligus |
| Layout/koordinat bentrok saat act digabung | 05, 06, 08, 09 | 8 elemen numpuk vertikal sekaligus setelah Act 1+2 merge |
| Caption/teks salah posisi & format | 02, 04, 10 | Caption bar bawah dibuang total, kalimat tanya → deklaratif |
| Act terlalu banyak, tidak ada continuity | 05, 07 | 6 act → 4 act, icon menghilang antar-act |
| Flowchart path tidak tersambung dari awal | 03, 12, 14 | Benang baru muncul di Act 2, amplop balik "naik" karena salah posisi default |
| Visual tanpa context pemicu | 07, 08, 11 | Teks muncul sebelum icon yang "memicu" teks itu ada |
| Field dideklarasikan tapi tidak pernah dirender | 10 | `PHASES[].caption` tidak pernah dipakai, tidak ditandai dead field || Aktor analogi salah arah (one-way vs two-way) | 11 | Browser = tukang pos → keliru, tukang pos satu arah, browser dua arah |
| Elemen visual menambah noise, bukan kejelasan | 13 | Wajah di browser/server, overlay rect pintu mengaburkan bentuk |
| Arah gerak elemen bertentangan dengan narasi | 14 | Amplop "naik" balik padahal narasi bilang sudah berangkat |
| Teks posisi hardcode, tidak ikut elemen utama | 14 | methodBadge/addressLabel diam sementara amplop pindah posisi |
| Node perantara hanya label, tanpa visual keputusan | 14 | DNS cuma teks, tidak ada visual "routing ke server mana" |

---

## 1. DO / DON'T per Kategori

### A. Narasi & Analogi

**✅ DO:**
- Tulis storyboard naratif per Act SEBELUM buka code editor
- Validasi akurasi teknis analogi: tanya "apakah ini benar secara teknis?" sebelum commit ke satu analogi
- **Validasi arah/sifat aktor dalam analogi** — cek apakah aktor pembanding punya sifat yang sama (one-way vs two-way, aktif vs pasif). Lihat contoh §6.1
- Verifikasi urutan cause → effect: tunjukkan pemicu visual dulu, baru teks muncul sesudahnya
- Gunakan kalimat deklaratif ("Browser tidak langsung ambil halaman"), BUKAN kalimat tanya — AI di animasi ini berperan sebagai penjelas, bukan penanya
- Pastikan teks "selesai" (mis. "Surat siap!") hanya muncul setelah proses benar-benar selesai secara naratif

**❌ DON'T:**
- Jangan mulai coding sebelum analogi divalidasi
- Jangan pilih analogi tanpa cek kesesuaian arah/sifat aktor (mis. kurir satu-arah dipakai untuk proses dua-arah)
- Jangan pakai kalimat tanya sebagai caption dalam bentuk apapun — ini aturan keras, bukan preferensi gaya
- Jangan munculkan teks sebelum visual context-nya ada di layar
- Jangan gunakan emoji di caption
- Jangan buat caption "selesai" sebelum proses naratifnya memang selesai

---
### B. Perencanaan Icon

**✅ DO:**
- Audit SEMUA elemen visual topic di awal (sebelum coding) → kategorikan:
  - `inline SVG`: elemen punya sub-state animasi internal (rotasi, ekspresi, buka/tutup)
  - `icon PNG`: elemen statis atau cuma 2 varian sederhana (open/closed)
- Tulis `icons.json` LENGKAP (semua batch sekaligus) sebelum generate satupun PNG
- Tentukan source setiap icon dari awal: `chatgpt` atau `download` (Devicon/Simple Icons)
- Buat `default-icon.png` placeholder sebelum generate icon asli — supaya build tidak rusak
- Plan batch layout (grid 2×4, slot ke-8 selalu `[EMPTY]` sesuai `06-icon-generation.md §1.2`)

**❌ DON'T:**
- Jangan generate icon dulu baru tulis `icons.json` — selalu sebaliknya
- Jangan generate piecemeal (batch-1 selesai baru mikir batch-2) kalau sebenarnya semua icon sudah bisa diidentifikasi sejak audit awal
- Jangan convert elemen yang punya animasi internal menjadi icon PNG (contoh: spinner rotasi, ekspresi wajah berubah, pintu buka/tutup)
- Jangan skip default-icon.png — build AKAN rusak kalau PNG icon belum ada

---

### C. Layout & Koordinat

**✅ DO:**
- Bagi canvas menjadi zona per aktor sebelum assign koordinat (contoh: CLIENT zone atas, NETWORK zone tengah, SERVER zone bawah — lihat §5)
- Hitung collision Y untuk semua elemen yang bisa tampil bersamaan: jarak Y antara dua elemen ≥ tinggi elemen atas + 20px margin
- Untuk caption horizontal berdampingan: formula `|anchor2-anchor1| ≥ w1/2 + w2/2 + 20` (lihat `05-svg-text-guide.md`)
- Definisikan FlowchartSpine waypoints LENGKAP dari awal (semua node + path segments termasuk segmen Act 1) sebelum mulai coding timeline
- Setiap elemen WAJIB punya `popOut` yang terdefinisi di timeline — tidak boleh ada elemen yang "hidup terus" tanpa exit, termasuk elemen yang sudah "sampai tujuan" (mis. amplop yang sudah masuk server tetap wajib di-popOut, jangan dibiarkan nempel di layar)
**❌ DON'T:**
- Jangan assign koordinat Y sembarangan lalu berharap tidak nabrak
- Jangan desain layout satu-Act-satu-Act tanpa mempertimbangkan elemen dari act lain yang bisa tampil bersamaan (terutama setelah act merge)
- Jangan mulai path dari tengah perjalanan (path WAJIB dimulai dari node paling awal sejak Act 1)
- Jangan biarkan elemen "menumpuk" tanpa ada cleanup timer, termasuk elemen yang secara naratif sudah "sampai" tapi masih tampil diam di layar

---

### D. Caption & Teks

**✅ DO:**
- Target ≤ 5 kata per caption (lebih pendek = lebih baik)
- Taruh caption DEKAT elemen visual yang dibahas (bukan di caption bar bawah)
- Gunakan `IconCaption` (nempel di bawah icon) atau `PathLabel` (nempel di benang yang sedang jalan) — bukan `say()` ke caption bar terpisah
- Sesuaikan posisi teks dengan posisi elemen utama yang sedang dibahas SAAT teks itu muncul — kalau elemen utama berpindah posisi, teks yang mengacu padanya wajib ikut berpindah (lihat §K di bawah)
- Verifikasi: "mata penonton lagi di mana saat teks ini muncul?" — teks harus ada di sana juga

**❌ DON'T:**
- Jangan gunakan caption bar bawah layar (`say()`) — sudah deprecated
- Jangan stack teks vertikal kalau beberapa teks tampil bersamaan — buat horizontal
- Jangan hardcode posisi teks jauh dari elemen yang dibahas, dan jangan biarkan koordinatnya statis kalau elemen acuannya bergerak/berpindah
- Jangan pakai kata "siap" / "selesai" / "jadi!" sebelum ceritanya benar-benar selesai
- **Jangan pernah menulis caption dalam bentuk kalimat tanya** — ini penyebab berulang di banyak revisi; treat sebagai hard rule, bukan gaya penulisan yang opsional

---
### E. Struktur Act

**✅ DO:**
- Batasi maksimum 4 Act untuk animasi 40–60 detik
- Gabungkan Act yang satu pelaku/lokasi cerita (browser dengan browser, server dengan server)
- Pertahankan elemen yang masih relevan ke Act berikutnya — jangan langsung hilang
- Define explicit: elemen apa yang PERSIST ke act berikutnya, elemen apa yang FADE
- Beri jarak buffer minimum 0.2s di seam antar-Act (jangan terlalu panjang buffer)
- Setiap elemen baru yang muncul (mis. blok HTML/JS/CSS di browser) WAJIB punya konteks asal-usul yang jelas di narasi/visual — jangan biarkan elemen "tiba-tiba muncul" tanpa penjelasan dari mana asalnya

**❌ DON'T:**
- Jangan buat lebih dari 4 Act tanpa alasan kuat
- Jangan render elemen dalam blok `{phaseIdx === N && ...}` kalau elemen itu perlu persist ke Act berikutnya
- Jangan buat buffer antar-Act terlalu panjang (> 0.5s buffer = waktu nganggur yang terasa lama)
- Jangan merge Act tanpa cek ulang koordinat Y semua elemen yang sekarang bisa tampil bersamaan
- Jangan tampilkan elemen konten (HTML/CSS/JS, data, file) tanpa sumber visual yang jelas — penonton harus bisa jawab "elemen ini datang dari mana?"

---

### F. Flowchart & Path

**✅ DO:**
- FlowchartSpine selalu dimulai dari Act 1 (bukan muncul pertama kali di Act 2+) — lihat contoh konkret di §6.4
- Path harus punya waypoint untuk SETIAP momen penting perjalanan, termasuk "berangkat dari browser" di Act 1
- Elemen yang bergerak harus bergerak dalam satu arah konsisten dengan narasi (ke bawah = pergi ke tujuan, ke atas = kembali ke pengirim)
- Gunakan dual-color path: arah pergi = satu warna, arah balik = warna berbeda
- Untuk node perantara/intermediary (mis. DNS, load balancer, proxy) yang berperan sebagai titik keputusan routing, beri visual eksplisit yang menunjukkan "keputusan" itu terjadi (mis. highlight target tujuan, garis bercabang yang menyala ke satu arah) — jangan biarkan node itu jadi sekadar label teks tanpa fungsi visual
**❌ DON'T:**
- Jangan gerakkan elemen "balik ke atas" kalau narasi belum menyatakan perjalanan balik
- Jangan mulai path hanya dari node tengah — path harus connected dari node awal
- Jangan biarkan amplop terbang tanpa path menyala bersamaan (path dan pergerakan elemen harus sinkron)
- Jangan jadikan node intermediary sekadar teks statis kalau perannya secara naratif adalah "titik keputusan" — itu kehilangan momen visual yang penting

---

### G. Dead Field Audit

Field/prop yang dideklarasikan di `data.js` (mis. di dalam array `PHASES`) tapi
tidak pernah benar-benar dirender atau dipakai di `Animation.jsx` disebut
**dead field** — field ini membingungkan saat maintenance karena developer lain
(atau AI) akan mengira field itu aktif dipakai, padahal tidak.

**✅ DO:**
- Sebelum commit, cross-check SETIAP field/prop di `data.js` terhadap penggunaannya di `Animation.jsx` — pastikan semua field yang dideklarasikan benar-benar dirender
- Kalau ada field yang sengaja disiapkan untuk masa depan tapi belum dipakai, beri komentar eksplisit `// TODO: belum dirender` di `data.js`
- Lakukan audit ini sebagai bagian dari checklist sebelum "topic selesai" (lihat §2 dan §4)

**❌ DON'T:**
- Jangan biarkan field seperti `PHASES[].caption` dideklarasikan tapi tidak pernah dirender tanpa penanda apapun
- Jangan asumsikan field pasti terpakai hanya karena namanya terdengar relevan — selalu verifikasi lewat grep/search penggunaan sebenarnya

---
### H. Validasi Aktor Analogi

Kategori ini memperkuat §A khusus untuk kasus analogi yang aktornya salah arah
atau salah sifat — pola ini cukup sering terjadi sehingga layak jadi checklist
terpisah.

**✅ DO:**
- Untuk setiap analogi yang dipakai, identifikasi sifat kunci aktor pembanding: apakah dia one-way atau two-way, aktif atau pasif, sekali pakai atau berulang
- Cocokkan sifat itu dengan sifat aktor teknis yang direpresentasikan — kalau tidak cocok, analogi WAJIB diganti sebelum coding, bukan diperbaiki setelah animasi jadi
- Tuliskan alasan validasi analogi secara singkat di storyboard (§2 poin 1.2b), supaya keputusan analogi bisa diaudit ulang

**❌ DON'T:**
- Jangan pakai analogi hanya karena familiar/populer tanpa cek kecocokan sifat (lihat contoh "tukang pos" di §6.1)
- Jangan menunda validasi analogi sampai setelah storyboard visual jadi — validasi ini harus di tahap paling awal

---

### I. Visual Noise Audit

Elemen visual yang ditambahkan "supaya lucu/hidup" tapi sebenarnya tidak
menambah kejelasan cerita — atau malah mengaburkan bentuk elemen lain —
disebut **visual noise**.

**✅ DO:**
- Untuk setiap elemen dekoratif (mis. wajah/ekspresi pada objek, overlay tambahan), tanya: "apakah ini membantu penonton memahami proses, atau sekadar dekorasi?"
- Kalau overlay/dekorasi menutupi atau mengaburkan bentuk elemen utama (mis. rect pintu menutupi bentuk gedung server), hapus atau redesain supaya tidak konflik secara visual
- Prioritaskan kejelasan bentuk & fungsi elemen dibanding elemen "lucu" yang tidak berkontribusi ke narasi
**❌ DON'T:**
- Jangan tambahkan wajah/ekspresi ke objek non-karakter (mis. browser, server) kalau tidak berkontribusi ke pemahaman proses
- Jangan taruh overlay/shape tambahan di atas elemen utama tanpa cek apakah itu mengaburkan bentuk aslinya

---

### J. Konsistensi Arah Gerak

**✅ DO:**
- Sebelum animasi elemen bergerak, cek dulu status naratif elemen itu di titik waktu tersebut — apakah sedang "berangkat", "dalam perjalanan", atau "kembali"
- Pastikan arah gerak (naik/turun, kiri/kanan) konsisten dengan status naratif itu — lihat formula default position di §6.5
- Kalau elemen perlu morph/reposisi, pastikan arah reposisinya tidak berlawanan dengan tahap perjalanan yang sedang berlangsung

**❌ DON'T:**
- Jangan pindahkan elemen ke arah yang menyiratkan "kembali" kalau narasi belum menyatakan perjalanan balik
- Jangan gunakan posisi default yang bertentangan dengan posisi terakhir elemen sebelum morph (lihat contoh §6.5)

---

### K. Teks Mengikuti Posisi Elemen

**✅ DO:**
- Untuk teks/badge yang merujuk ke elemen visual tertentu (mis. `methodBadge`, `addressLabel` merujuk ke amplop), hitung posisinya secara relatif terhadap posisi elemen acuan tersebut, bukan koordinat absolut yang di-hardcode
- Kalau elemen acuan berpindah posisi antar-Act, pastikan posisi teks ikut diperbarui di timeline yang sama

**❌ DON'T:**
- Jangan hardcode posisi teks berdasarkan posisi elemen acuan di satu titik waktu saja — kalau elemen itu nanti berpindah, teks akan "ketinggalan" secara visual

---
### L. Node Intermediary sebagai Gerbang

**✅ DO:**
- Untuk node yang berperan sebagai perantara/keputusan (DNS, load balancer, proxy, dsb.), rancang visual yang menunjukkan node itu benar-benar "memutuskan" sesuatu — misalnya highlight cabang path yang dipilih
- Sinkronkan momen visual keputusan itu dengan caption yang menjelaskan apa yang sedang diputuskan

**❌ DON'T:**
- Jangan jadikan node intermediary sekadar label statis tanpa fungsi visual apapun — ini kehilangan kesempatan menjelaskan proses yang justru penting secara teknis

---

### M. Content State Contract (Request-Response)

Kategori ini berlaku untuk topic apapun yang punya alur request/response,
mutasi data, atau transformasi state (tidak terbatas pada REST API). Wajib
diisi SEBELUM storyboard naratif (§1.A) ditulis, karena storyboard yang benar
mengikuti state, bukan sebaliknya.

Tabel wajib per topic:

| State | Yang penonton lihat | Yang belum boleh terlihat | Pemicu perubahan | Hasil |
|---|---|---|---|---|
| Client awal | loading/empty/form | data final | click user | request lahir |
| Request transit | ticket/paket | result/response | ticket masuk gate | processor aktif |
| Service proses | resource/card | browser final | data ditemukan/mutasi | response dibuat |
| Client akhir | response/result | state lama | response tiba | UI berubah |

**✅ DO:**
- Isi tabel di atas sebelum menulis satu baris storyboard pun
- Tentukan eksplisit apa yang BELUM diketahui client di setiap baris — bukan cuma apa yang sudah diketahui
- Pastikan data hasil (response, mutasi) tidak muncul di layar sebelum sebab visualnya (request tiba, response diterima) benar-benar terjadi

**❌ DON'T:**
- Jangan tampilkan hasil/response sebelum sebab visualnya terjadi di layar
- Jangan lewati tabel ini untuk topic yang punya request/response hanya karena "sudah jelas di kepala" — tuliskan tetap, ini jadi sumber kebenaran saat revisi

---

### N. Method Visualization Contract

Method/aksi (HTTP method, operasi CRUD, atau aksi mutasi lain) tidak boleh
hanya jadi badge atau string. Setiap method wajib menjawab 4 pertanyaan
berikut sebelum dianimasikan:

| Pertanyaan | Contoh REST API |
|---|---|
| Benda apa yang dibawa? | mini profile card, full profile card, atau role badge |
| Dari mana ia berangkat? | tombol atau form di browser |
| Ke mana ia pergi? | Gate lalu Processor di API Service |
| Apa akibat fisiknya? | card dibuat, full card diganti, badge diubah, atau card diarsipkan |

Jika salah satu jawaban belum ada, method tersebut **belum siap dianimasikan**
— kembali ke planning, jangan dipaksa coding.

**✅ DO:**
- Gunakan POST untuk card baru masuk ke layar
- Gunakan PUT untuk full card replacement (card lama hilang, card baru utuh menggantikan)
- Gunakan PATCH untuk perubahan satu layer/field saja pada card yang sama
- Gunakan DELETE untuk card yang sama berpindah/bertransformasi menuju archive (lihat §1.O untuk aturan continuity-nya)

**❌ DON'T:**
- Jangan tampilkan method sebagai badge tunggal tanpa benda fisik yang menyertainya
- Jangan morph text method (mis. teks "GET" berubah jadi "200 OK") tanpa menyatakan benda yang berubah di baliknya

---

### O. Continuity and No-Teleport Contract

Objek request/response harus terlihat terus sebagai rantai sebab-akibat:
Browser UI → ticket lahir → ticket bergerak → gate → processor → mutasi →
response → browser berubah. Ticket tidak boleh di-pop-out di satu titik lalu
processor "muncul begitu saja" setelah jeda.

**✅ DO:**
- Tampilkan destination node dari awal dalam keadaan redup jika ia akan menjadi tujuan request
- Gunakan persistent id/state untuk browser, service hub, dan resource — sama seperti aturan persistent actor di §1.E
- Buat request berpindah melalui SETIAP node di jalurnya, jangan lompat
- Gunakan transform/handoff eksplisit (overlap minimal satu frame, scale/glow/position tween) saat objek berubah bentuk — bukan unmount lalu mount di tempat lain
- Mulai Act berikutnya pada posisi objek saat ini (posisi terakhir Act sebelumnya)

**❌ DON'T:**
- Jangan pop-out request di tengah jalur lalu munculkan hasil processing setelah beberapa detik tanpa objek penghubung
- Jangan reset canvas saat transisi antar-Act
- Jangan sembunyikan aktor penting sampai ia "tiba-tiba" diperlukan
- Jangan biarkan objek diam tanpa alasan naratif

Hold budget default (titik audit awal, bukan aturan buta — boleh dilewati
kalau alasan keterbacaan ditulis di plan topic):

| Jenis jeda | Batas awal |
|---|---:|
| click ke request berangkat | 0,25 detik |
| gate ke processor | 0,35 detik |
| response tiba ke request berikutnya | 0,40 detik |
| hold membaca perubahan penting | 0,8–1,8 detik |

---

### P. Act Design Contract (Request-Response)

Kategori ini melengkapi §1.E khusus untuk topic dengan alur request/response.

**✅ DO:**
- Akhiri satu Act ketika unit pemahaman selesai, bukan karena "butuh nomor Act baru"
- Beri setiap Act entry state dan exit state yang eksplisit
- Tuliskan objek yang tetap hidup (persist) saat Act berubah
- Untuk topic pendek, targetkan 3–5 Act; lebih dari itu wajib punya alasan cerita tertulis di plan topic

**❌ DON'T:**
- Jangan buat epilog khusus yang hanya menampilkan daftar method kalau tiap method sebenarnya bisa dijadikan action dari client (mis. epilog "ringkasan GET/POST/PUT/DELETE" yang tidak menambah pemahaman baru)
- Jangan tambah Act untuk menyelesaikan masalah yang sebenarnya bisa jadi motion/action dalam Act yang sama

---

### Q. Series Identity Contract

Identitas seri (kategori, palet, header format, referensi visual) harus
dikunci SEBELUM title/intro dibuat — bukan setelah timeline selesai.

Preflight wajib:
- topic ini bagian dari seri apa;
- kategori intro dan category manifest;
- palette title/header;
- reference topic yang dipakai sebagai acuan format;
- alasan tertulis jika menyimpang dari format seri.

**✅ DO:**
- Catat referensi yang ditiru secara spesifik (mis. "hero-to-header lerp ala Tailscale, tanpa typing effect")
- Kunci kategori, palette, dan header reference sebelum menyentuh code

**❌ DON'T:**
- Jangan menyalin efek visual secara parsial tanpa menyalin struktur layout/hierarki yang membuat efek itu berhasil di referensinya
- Jangan mengubah identitas seri, kategori, atau palette setelah timeline hampir selesai tanpa mereview dampaknya ke topic lain di seri yang sama

---

### R. Safe-Zone Layout Contract

Kategori ini melengkapi §1.C dengan template zona eksplisit untuk topic
bertingkat (header + badge + browser + transit + service dalam satu canvas).

| Zona | Elemen yang boleh | Elemen yang dilarang |
|---|---|---|
| Header | title/subtitle | panel konten |
| Navigation | badge/dot | resource card |
| Content | actor utama | header |
| Transit | moving packet | text panjang |
| Service/result | proses/response | header |

**✅ DO:**
- Buat diagram zona vertikal (y start–end per zona, lihat template §5) SEBELUM JSX besar dibuat — wajib untuk setiap topic bertingkat
- Catat bounding box objek terbesar (browser/card/panel) secara eksplisit
- Cek collision pada hero, setiap Act, dan closing — bukan cuma satu frame acak

**❌ DON'T:**
- Jangan letakkan objek besar hanya berdasarkan feeling tanpa bounding box tertulis
- Jangan biarkan panel/card menabrak subtitle atau badge di frame manapun, termasuk frame transisi antar-Act

---

### S. Scene Shell Default (Scene UI V1)

Kategori ini adalah kontrak DEFAULT untuk chrome layout (hero → header, Act
badge + dot navigator, content boundary) pada topic portrait standar,
menggantikan copy-paste header/badge dari topic lama. Detail implementasi
lengkap ada di `src/shared/scene-ui/README.md` dan
`docs/plan/PLAN-12-SHARED-SCENE-COMPONENTS-V1.md`; bagian ini hanya
merangkum kapan wajib dipakai dan checklist-nya.

**Wajib pakai scene-ui V1** (`IntroHeaderMorphV1` + `ActBadgeNavigatorV1` +
`ContentBodyV1`, langsung atau lewat composer `SceneChromeV1`) bila topic:
- portrait 820 × 1340;
- punya intro category/title/subtitle;
- punya dua atau lebih Act;
- memakai badge Act + dot navigator;
- body utama bisa diletakkan di bawah badge (tidak butuh layout khusus).

**Boleh opt-out** (layout custom) bila landscape, simulator/dashboard,
split-screen, atau sengaja tidak memakai struktur Act/header standar. Opt-out
WAJIB dicatat di plan topic (lihat `02-standar-konten.md`) dengan: alasan
teknis/storytelling, layout map pengganti, safe-zone pengganti, cara navigasi
Act (atau alasan tidak memakainya), dan rencana preview manual collision.
**Copy-paste implementasi lama bukan alasan opt-out yang sah.**

Content existing TIDAK dimigrasi otomatis oleh keberadaan scene-ui V1 —
migrasi topic lama perlu plan + screenshot comparison + preview + export test
terpisah (lihat PLAN-14 sebagai contoh pilot migrasi header+badge, bukan
migrasi penuh body).

**✅ DO:**
- gunakan `IntroHeaderMorphV1`, `ActBadgeNavigatorV1`, `ContentBodyV1`, atau
  `SceneChromeV1` untuk portrait standard sesuai kriteria di atas;
- deklarasikan `PHASES` sekali di `data.js`, lalu pass langsung ke
  `ActBadgeNavigatorV1`/`navigator` prop — jangan duplikasi struktur badge;
- gunakan local coordinate `ContentBodyV1` (0,0 = `body.x`/`body.y`) untuk
  panel utama, bukan koordinat canvas absolut;
- aktifkan `debug={true}` (`SceneSafeAreaDebugV1`, lewat `SceneChromeV1` atau
  langsung) sementara saat layout pertama kali dibuat, matikan sebelum export;
- tulis version scene shell (`V1` atau `custom`) di plan topic (`_docs/TOPIC_PLAN.md`).

**❌ DON'T:**
- jangan copy-paste SVG header/badge dari topic lain — pakai V1 atau opt-out
  eksplisit;
- jangan menaruh panel besar pada koordinat global header/navigator (y di
  bawah `layout.body.y` saja untuk children `ContentBodyV1`);
- jangan memakai clip-path untuk menyembunyikan collision layout — perbaiki
  posisinya, bukan menutupinya;
- jangan membuat gating `showIntro` kedua yang menghilangkan header hasil
  morph V1 selain lewat prop `visible`/`progress` yang sudah disediakan;
- jangan memodifikasi file di `src/shared/scene-ui/v1/` untuk kebutuhan satu
  topic yang sebenarnya custom — tambah `v2/` baru kalau breaking, atau pass
  prop optional (lihat aturan versioning di README scene-ui) kalau non-breaking.

---

## 2. Pre-Planning Checklist (Wajib Sebelum Coding)

Langkah yang WAJIB selesai sebelum menyentuh `Animation.jsx`:

```
[ ] 0. CONTENT STATE & SERIES IDENTITY (WAJIB sebelum storyboard — khusus topic request/response atau bertingkat)
    [ ] 0.1. Isi tabel Content State Contract (client awal → transit → service → client akhir) — lihat §1.M
    [ ] 0.2. Isi preflight Series Identity Contract (seri, kategori, palette, header reference) — lihat §1.Q
    [ ] 0.3. Untuk tiap method/aksi, jawab 4 pertanyaan Method Visualization Contract sebelum lanjut — lihat §1.N

[ ] 1. STORYBOARD NARATIF
    [ ] 1.1. Tulis deskripsi setiap Act (max 4 Act): siapa, di mana, apa yang terjadi
    [ ] 1.2. Validasi analogi vs akurasi teknis (tanya "apakah ini benar?")
    [ ] 1.2b. Validasi arah/sifat aktor analogi (one-way vs two-way, aktif vs pasif) — lihat §1.H
    [ ] 1.3. Tandai momen cause → effect di setiap beat
    [ ] 1.4. Definisikan: elemen apa yang persist antar-Act
    [ ] 1.5. Untuk setiap elemen baru yang muncul, tandai sumber/konteks asalnya (lihat §1.E)

[ ] 2. AUDIT ELEMEN VISUAL
    [ ] 2.1. List semua elemen visual topic (karakter, benda, badge, teks)
    [ ] 2.2. Kategorikan per elemen: inline SVG atau icon PNG
         Inline SVG jika: ada animasi internal (rotasi, buka/tutup, ekspresi ganti)
         Icon PNG jika: statis atau maksimal 2 varian (open/closed)    [ ] 2.3. Audit tambahan: Badge/TextCard/SpeechBubble → perlu prop icon?
    [ ] 2.4. Audit visual noise: tandai elemen dekoratif yang tidak membantu narasi — lihat §1.I

[ ] 3. ICON PLANNING (WAJIB sebelum generate satupun PNG)
    [ ] 3.1. Tulis draf icons.json LENGKAP (semua batch, semua slot)
    [ ] 3.2. Tentukan sumber setiap icon: chatgpt atau download
    [ ] 3.3. Rencanakan batch layout: grid 2×4, slot-8 selalu [EMPTY]
    [ ] 3.4. Tulis prompt ChatGPT untuk setiap batch

[ ] 4. LAYOUT PLANNING
    [ ] 4.0. Pilih scene shell: scene-ui V1 (default portrait standar) atau
         tulis opt-out custom (alasan, layout map, safe-zone pengganti) —
         lihat §1.S
    [ ] 4.0b. Kalau pakai V1: pastikan jumlah `PHASES` cocok dengan jumlah
         dot navigator, tentukan `titleSegments`/`categorySegments` (color
         identity), tentukan root content dan local coordinate system,
         aktifkan `debug` safe-area saat layout pertama dibuat — lihat §1.S
    [ ] 4.1. Bagi canvas ke zona per aktor (lihat template di §5)
    [ ] 4.2. Assign Y range kasar per zona (bukan pixel presisi, tapi range)
    [ ] 4.3. Identifikasi elemen yang bisa tampil bersamaan → cek collision Y
    [ ] 4.4. Definisikan FlowchartSpine: semua node + semua waypoint path (termasuk Act 1)
    [ ] 4.5. Untuk node intermediary, rancang visual "keputusan routing"-nya — lihat §1.L
    [ ] 4.6. Untuk teks yang merujuk elemen bergerak, rencanakan posisi relatif — lihat §1.K
    [ ] 4.7. Buat diagram zona vertikal + catat bounding box objek terbesar — lihat §1.R

[ ] 5. CAPTION & TEKS PLANNING
    [ ] 5.1. Tulis semua caption (≤5 kata, deklaratif, tanpa emoji, tanpa tanda tanya — hard rule)
    [ ] 5.2. Map setiap caption ke elemen visual yang dibahas (bukan ke Act, tapi ke elemen)
    [ ] 5.3. Verifikasi: caption muncul SETELAH visual context ada di layar

[ ] 6. ACT STRUCTURE
    [ ] 6.1. Definisikan durasi per Act (total 40-60s, distribusi wajar)
    [ ] 6.2. Per elemen: kapan popIn, kapan popOut — TIDAK BOLEH ada elemen tanpa popOut, termasuk elemen yang sudah "sampai tujuan"
    [ ] 6.3. Cek: ada buffer nganggur > 0.5s yang bisa dipangkas?
    [ ] 6.4. Cek konsistensi arah gerak tiap elemen terhadap status naratifnya — lihat §1.J

[ ] 7. CONTINUITY & ACT DESIGN AUDIT (khusus topic request/response)
    [ ] 7.1. Cek tidak ada pop-out request tanpa objek penghubung di sisi tujuan — lihat §1.O
    [ ] 7.2. Bandingkan tiap jeda terhadap hold budget default; tulis alasan kalau melebihi — lihat §1.O
    [ ] 7.3. Pastikan tiap Act punya entry state dan exit state yang eksplisit — lihat §1.P
    [ ] 7.4. Cek tidak ada epilog daftar-method yang sebenarnya bisa jadi action dari client — lihat §1.P

[ ] 8. SCENE SHELL REVIEW (kalau pakai scene-ui V1, lihat §1.S)
    [ ] 8.1. Header (`IntroHeaderMorphV1`) tetap terlihat setelah morph
         (`progress=1`), tidak invisible/kepotong
    [ ] 8.2. Badge dan SEMUA dot (`ActBadgeNavigatorV1`) terlihat penuh pada
         setiap Act, termasuk judul Act terpanjang (tidak tumpah keluar rect)
    [ ] 8.3. Content (`ContentBodyV1`) tidak menutupi subtitle/badge di frame manapun
    [ ] 8.4. Debug overlay (`SceneSafeAreaDebugV1` / `debug` prop) mati sebelum export
    [ ] 8.5. Tidak ada duplicate header/badge inline selain yang dirender oleh V1
```

---
## 3. Execution Order (Urutan Wajib Saat Coding)

Setelah pre-planning selesai, eksekusi kode wajib dalam urutan ini:

```
[ ] 1. data.js (PERTAMA)
    → Semua string constants (caption, label, tease)
    → PHASES array (id, badge, caption, duration)
    → Color palette references
    → Tidak boleh ada magic string di Animation.jsx

[ ] 2. manifest.js
    → Metadata topic (id, title, category, duration)

[ ] 3. icons/ folder
    → 3a. Buat folder icons/
    → 3b. Generate default-icon.png (placeholder lokal, bukan AI-generate)
    → 3c. Tulis icons/icons.json (copy dari plan di Pre-Planning §3.1)
    → 3d. Tulis icons/loader.js dengan fallback ke default-icon.png
           TANPA import icon asli (icon asli belum ada — komen sebagai placeholder)
    → 3e. Compile check (npx vite build atau esbuild isolated)

[ ] 4. Generate icon PNG (manual via ChatGPT extension)
    → Per batch: generate → crop → simpan ke icons/
    → Update loader.js: uncomment import per icon yang sudah ada PNG-nya
    → Compile check setelah setiap batch
[ ] 5. Animation.jsx — URUTAN INTERNAL:
    → 5a. State declarations (semua useState)
    → 5b. Ref declarations (semua useRef)
    → 5c. Helper functions (triggerBurst, triggerFlash, popIn, popOut, dll)
    → 5d. Komponen kecil (PathLabel, IconCaption, FlowchartSpine, NodeLabel, dll)
    → 5e. Komponen utama (BrowserWindow, ServerBuilding, Envelope, dst)
    → 5f. Timeline (GSAP, per Act, dalam urutan Act)
    → 5g. JSX render (dalam urutan layer: background → path → elements → effects)

[ ] 6. caption.md
    → Narasi/caption untuk video export

[ ] 7. _docs/TOPIC_PLAN.md (jika belum ada)
    → Copy storyboard + layout plan dari Pre-Planning ke file ini
    → Ini referensi untuk revisit kalau ada perubahan besar

[ ] 8. DEAD FIELD AUDIT (sebelum dianggap selesai)
    → Cross-check semua field di data.js terhadap penggunaan di Animation.jsx
    → Beri komentar `// TODO: belum dirender` untuk field yang sengaja belum dipakai
    → Lihat §1.G
```

---

## 4. Artefak Wajib (Mandatory File List)

Setiap topic WAJIB punya semua file berikut sebelum dianggap "selesai":
| File | Lokasi | Dibuat kapan | Catatan |
|---|---|---|---|
| `data.js` | `src/content/<topic>/` | Sebelum Animation.jsx | Semua string constants + PHASES, sudah lolos dead field audit |
| `manifest.js` | `src/content/<topic>/` | Sebelum Animation.jsx | Metadata topic |
| `Animation.jsx` | `src/content/<topic>/` | Setelah data.js + icons/ | Main animation |
| `caption.md` | `src/content/<topic>/` | Setelah animasi jalan | Narasi video |
| `icons/icons.json` | `src/content/<topic>/icons/` | Sebelum generate PNG | Full icon plan |
| `icons/default-icon.png` | `src/content/<topic>/icons/` | Sebelum loader.js | Placeholder lokal |
| `icons/loader.js` | `src/content/<topic>/icons/` | Setelah icons.json | Export getIcon() |
| `_docs/TOPIC_PLAN.md` | `src/content/<topic>/_docs/` | Sebelum coding | Storyboard + layout, termasuk hasil validasi analogi (§1.H) |

---

## 5. Template Layout Zona Canvas

Template ini dipakai di Pre-Planning §4 untuk assign zona per aktor:

```
Canvas: 820 x 1340 px

┌────────────────────────────────────┐
│  CLIENT ZONE (y: 0 – 400)          │  ← Browser, user actions, request compose
│  Warna: COLORS.CLIENT (biru)       │
├────────────────────────────────────┤
│  NETWORK ZONE (y: 400 – 800)       │  ← DNS, routing, in-transit
│  Warna: COLORS.NETWORK (cyan)      │
├────────────────────────────────────┤
│  SERVER ZONE (y: 800 – 1200)       │  ← Web server, processing, response
│  Warna: COLORS.SERVER (oranye)     │
└────────────────────────────────────┘
  y: 1200–1340 → reserved (progress bar, tease badge)
```
FlowchartSpine nodes (titik referensi, bisa disesuaikan per topic):
- Browser node: `(410, 260)` — center CLIENT zone atas
- DNS node: `(610, 620)` — kanan NETWORK zone
- Server node: `(410, 950)` — center SERVER zone

---

## 6. Contoh Buruk vs Contoh Baik (dari Kasus Nyata)

### 6.1 — Analogi yang Tervalidasi (§1.A, §1.H)

**❌ Contoh buruk (`14-http-request-response` awal):**
> "Browser = Tukang Pos" — analogi ini keliru karena tukang pos bersifat
> one-way (antar surat lalu selesai), sedangkan browser bersifat two-way
> (mengirim request DAN menerima response)

**✅ Contoh baik (setelah revisi-11):**
> "Browser kirim surat, bukan comot langsung" — browser diposisikan sebagai
> pengirim yang juga menunggu balasan, bukan kurir yang tugasnya selesai
> begitu surat terkirim

---

### 6.2 — Caption Timing (§1.D)

**❌ Contoh buruk:**
> `ENVELOPE_SEALED_CAPTION = 'Surat siap! ✉️'` — muncul saat amplop baru
> disegel di Act 1, padahal perjalanan masih panjang (DNS → server → response)
**✅ Contoh baik:**
> `ENVELOPE_SEALED_CAPTION = 'Surat berangkat!'` — kata "berangkat" menandakan
> ini awal perjalanan, bukan akhir

---

### 6.3 — Layout Collision (§1.C)

**❌ Contoh buruk (sebelum revisi-08):**
> 8 elemen tumpuk vertikal di layar bersamaan saat Act 1 dan "Nulis Surat"
> bergabung — hookBubble, hookRevealCard, hookCliffhangerBadge masih tampil
> saat methodBadge, addressLabel, dll. baru muncul

**✅ Contoh baik (setelah revisi-08):**
> hookBubble di-popOut di t+5.0 (bersamaan hookRevealCard muncul),
> hookRevealCard di-popOut di t+7.1 — layar bersih sebelum "Nulis Surat" mulai

---

### 6.4 — Path Connectivity (§1.F)

**❌ Contoh buruk (sebelum revisi-12):**
> `FORWARD_POINTS` dimulai dari Browser → DNS langsung, tidak ada segmen
> "Browser → Amplop Act 1" — penonton tidak melihat benang saat Act 1

**✅ Contoh baik (setelah revisi-12):**
> `FORWARD_POINTS` 4 titik: Browser(410,260) → Amplop(410,700) → DNS(610,620)
> → Server(410,900) — `forwardPathPct` mulai dari 0→0.33 di Act 1, nyambung
> terus ke Act 2

---
### 6.5 — Arah Elemen vs Narasi (§1.J)

**❌ Contoh buruk (sebelum revisi-14):**
> `reqEnvelope` morph naik ke y=330 setelah sebelumnya amplop turun ke y=700
> — terlihat amplop "balik ke browser" padahal seharusnya sedang berangkat

**✅ Contoh baik (setelah revisi-14):**
> Default `reqEnvelopePos = {x:410, y:700}`, amplop diam di posisi landed
> tanpa morph naik — konsisten dengan narasi "surat sedang dipersiapkan
> untuk berangkat dari posisi yang sama dengan saat landing"

---

### 6.6 — Dead Field (§1.G)

**❌ Contoh buruk (revisi-10):**
> `PHASES[].caption` dideklarasikan lengkap di `data.js` untuk semua phase,
> tapi tidak pernah ada satupun komponen yang membaca field ini di
> `Animation.jsx` — field jadi dead code tanpa penanda apapun

**✅ Contoh baik:**
> Field yang belum dipakai diberi komentar eksplisit
> `caption: '...', // TODO: belum dirender, disiapkan untuk fitur caption-per-phase`
> — atau field dihapus kalau memang tidak ada rencana pemakaian

---
### 6.7 — Visual Noise (§1.I)

**❌ Contoh buruk (revisi-13):**
> Browser dan server diberi wajah/ekspresi kartun yang tidak berkontribusi
> ke pemahaman proses HTTP request — malah mengalihkan perhatian dari alur
> teknis. Rect overlay pintu ditaruh di atas PNG server-building, mengaburkan
> bentuk gedung aslinya

**✅ Contoh baik:**
> Server-building ditampilkan sebagai bentuk arsitektural yang jelas tanpa
> overlay yang konflik; ekspresi/wajah dihapus dari objek non-karakter,
> fokus visual dikembalikan ke proses (permintaan masuk → diproses → respons keluar)

---

### 6.8 — Node Intermediary (§1.L)

**❌ Contoh buruk (revisi-14):**
> Node DNS hanya berupa label teks statis "DNS" — tidak ada visual apapun
> yang menunjukkan bahwa DNS sedang "memutuskan" alamat IP server mana yang
> dituju

**✅ Contoh baik:**
> Saat proses DNS lookup berlangsung, salah satu cabang path dari node DNS
> menyala/highlight menuju server yang dipilih, disertai caption singkat
> yang menjelaskan keputusan itu (mis. "DNS temukan alamat server")

---

## Referensi Silang

- `06-icon-generation.md` — detail lengkap proses generate & batch icon
- `05-svg-text-guide.md` — formula collision teks & styling SVG text, zona
  scene-ui V1 & local coordinate
- `04-referensi-gsap.md` — cara topic men-drive scene-ui V1 (progress/activeIndex)
- `03-tutorial-buat-topic-baru.md` — alur keseluruhan pembuatan topic baru,
  termasuk langkah "Pilih Scene Shell"
- `01-architecture.md` — diagram alur data.js → Animation.jsx → scene-ui V1 → SVG
- `src/shared/scene-ui/README.md` — API lengkap scene-ui V1 (props, quick-start, versioning)
- `docs/plan/PLAN-12-SHARED-SCENE-COMPONENTS-V1.md` — rationale & kontrak lengkap tiap component V1
- `docs/plan/PLAN-13-INTEGRASI-SCENE-UI-V1-KE-STANDAR.md` — keputusan default/opt-out scene-ui V1 (§1.S)
- `PROJECT_STRUCTURE.md` — standar penomoran task hierarki unlimited yang dipakai di planning

Dokumen ini digabung dari `docs/plan/PLAN-09-standar-pembuatan-konten.md`
dan `docs/plan/PLAN-10-supplement-09-revisi-lanjut.md`, disusun dari analisis
14 revisi topic `14-http-request-response` (2026-09-09 s/d 2026-09-10).

Section §1.M–§1.R dan checklist terkait (§2 poin 0, 4.7, 7) ditambahkan dari
`docs/plan/PLAN-11-REST-API-RETROSPEKTIF-STANDAR.md`, disusun dari analisis
retrospektif revisi 04–07 topic `17-rest-api` — fokus pada state contract,
method-as-object, continuity/no-teleport, series identity, dan safe-zone
layout untuk topic request/response.
