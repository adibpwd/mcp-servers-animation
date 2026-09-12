# Authentication — Rencana Rebuild Cerita Animasi

> **Status:** 🚧 IMPLEMENTED (first pass) — timeline 4 Act + render JSX sudah
> selesai ditulis; compile per-topic PASS (esbuild). Preview manual di web
> dan export MP4 BELUM (menunggu reviewer). Registry aktif sebagai
> `coming-soon`.
>
> **Terakhir diperbarui:** 2026-09-12

## 1. Keputusan Utama

Authentication bukan daftar istilah keamanan. Video ini adalah cerita Adib yang
membawa paket ke Gedung Arsip. Alamatnya benar, tetapi penjaga harus tahu siapa
Adib sebelum paket dilayani. Akhir cerita membuktikan bahwa identitas valid
tetap tidak sama dengan izin membuka lemari rahasia.

**Janji audiens:** dalam kurang dari satu menit, pemula dapat membedakan
authentication (membuktikan siapa) dan authorization (menentukan boleh apa),
memahami mengapa password di-hash, serta mengenal trade-off session dan token
tanpa mengira JWT adalah password terenkripsi.

| Keputusan | Nilai |
|---|---|
| Topic / folder | auth / src/content/18-auth/ |
| Format | Portrait 820 × 1340 |
| Durasi | ±50 detik, termasuk intro ±1,2 detik |
| Struktur | Intro + **4 Act**, bukan 5 Act |
| Kategori | Developer Tools — konsisten dengan 17-rest-api yang aktif |
| Warna manifest | #34D399, bukti/akses berhasil |
| Scene shell | scene-ui V1: SceneChromeV1 + DEFAULT_LAYOUT_V1 |
| Registry sesudah coding | coming-soon sampai preview dan export lolos |
| Tease berikutnya | Tidak ada; payoff penuh di akhir |

## 2. Apa yang Dirombak

Plan sebelumnya mencampur laporan implementasi lama dengan plan, memakai lima
Act, dan memakai caption pertanyaan. Standar terbaru meminta plan siap-bangun:
empat Act untuk durasi ini, teks deklaratif dekat objek, state/continuity/layout
contract, serta scene shell V1 untuk portrait standar.

Yang tidak dibawa sebagai keputusan final:

- Aset PNG, kode, dan checklist lama; semuanya hanya boleh menjadi referensi
  setelah audit baru.
- Analogi “segel ajaib” yang berisiko menyiratkan JWT menyembunyikan payload.
- Caption panjang, caption bar bawah, emoji, dan pertanyaan retoris.
- Pemisahan session/token ke Act sendiri yang menjauh dari payoff izin.

Satu ide yang dipertahankan: paket dari REST API menjadi callback pembuka,
namun cerita auth harus tetap dapat dipahami bila ditonton sendiri.

## 3. Identitas Seri, Palet, dan Bahasa

### 3.1 Series identity contract

| Elemen | Keputusan |
|---|---|
| Seri | Developer Tools: request REST API berlanjut ke keamanan akses |
| Kontinuitas | Paket REST API boleh muncul singkat di pembuka |
| Acuan layout | 17-rest-api sebagai seri portrait; bukan sumber copy-paste chrome |
| Header | AUTH (sky) + ENTICATION (green), category `DEVELOPER TOOLS · ADIB-DEV.COM` (domain cyan), subtitle: Membuktikan siapa, mengatur akses |
| Implementasi chrome | SceneChromeV1; data/timeline tetap milik topic |

| Peran | Warna | Makna |
|---|---:|---|
| Latar/panel | #070913 / #0F172A | seri gelap |
| Adib/bukti identitas | #38BDF8 | informasi klien |
| Gedung/jalur sistem | #22D3EE | sistem pemeriksa |
| Petugas/proses | #FB923C | aktivitas pemeriksaan |
| Hash/signature | #A78BFA | transformasi teknis |
| Valid/diizinkan | #34D399 | berhasil |
| Bocor/ditolak | #F43F5E | risiko/gagal |
| Peringatan | #FBBF24 | perhatian |

### 3.2 Aturan audiens

- Target: pemula IT/junior developer; istilah datang setelah fungsi visualnya.
- Teks di video deklaratif, idealnya ≤5 kata, tanpa emoji maupun pertanyaan.
- Teks menempel di objek yang dibahas; caption bar bawah dilarang.
- JWT hanya label kecil setelah token signed diperlihatkan; bukan hook utama.

## 4. Analogi yang Sudah Divalidasi

**Dunia cerita:** Gedung Arsip. Adib membawa paket ke loket; resepsionis
memeriksa login, lalu lemari arsip memeriksa hak akses.

| Konsep | Benda/aksi cerita | Akurasi |
|---|---|---|
| Authentication | Penjaga membandingkan bukti Adib dengan catatan | Menjawab **siapa** |
| Credential | Nama akun + password di kios | Contoh umum, bukan satu-satunya credential |
| Plaintext | Buku resepsionis berisi password asli | Praktik buruk yang sengaja ditunjukkan |
| Hash + salt | Mesin cap satu arah + butiran salt unik | Hash disimpan; password tidak dibalik |
| Session | Kartu bernomor, pintu bertanya ke resepsionis | State login disimpan server-side |
| Token signed/JWT | Pas masuk bertanda tangan, dicek signature + expiry | Payload bukan kotak rahasia |
| Authorization | Lemari memilih kunci berdasar role/izin | Menjawab **boleh apa**, terpisah dari identity |

Kartu session bukan identitas permanen. Token/JWT bukan password atau “segel
rahasia”. Pas token hanya menampilkan user, role, dan exp sebagai contoh data
non-sensitif.

## 5. Content State Contract

| State | Yang terlihat | Yang belum boleh terlihat | Pemicu | Hasil fisik |
|---|---|---|---|---|
| S0 tiba | Adib, paket, gerbang, tujuan redup | status login, token/session, izin | Adib tiba | penjaga meminta bukti |
| S1 login | kios, credential, buku plaintext | hash tersimpan, bukti valid | password ke mesin | buku menjadi record hash + salt |
| S2 terverifikasi | dua hash, cap IDENTITAS VALID | akses semua lemari, izin khusus | hash cocok | Adib menerima satu bukti login |
| S3 perjalanan | session cek server **atau** token cek lokal | lemari rahasia terbuka | petugas memeriksa | identitas tetap valid |
| S4 akses | lemari umum/rahasia, matriks policy | lemari terbuka tanpa izin | role diperiksa | hanya lemari sesuai izin membuka |

## 6. Contract Aksi dan Data Visual

| Aksi | Benda | Asal → tujuan | Akibat fisik |
|---|---|---|---|
| Kirim credential | slip nama + password | kios → mesin hash | input asli hilang sesudah proses |
| Verifikasi login | hash baru + salt | kios → record hash | pola cocok diberi cap valid |
| Terbitkan session | kartu bernomor | resepsionis → Adib + buku session | nomor aktif tersimpan |
| Cek session | nomor kartu | pintu → resepsionis | garis cek pulang-pergi |
| Terbitkan token | pas user · role · exp | penerbit → Adib | signature menyala |
| Cek token | pas signed | Adib → penjaga | signature/expiry dicek lokal |
| Otorisasi | kartu izin reader | policy → lemari | pintu membuka atau terkunci |

data.js hanya memuat data yang dirender: ADIB, CREDENTIAL, HASH_RECORD,
SESSION, TOKEN_CLAIMS, ACCESS_POLICY, PHASES, COLORS, dan SFX_MAP. Dead field,
terutama caption yang tidak dirender, wajib diaudit sebelum selesai.

## 7. Scene Shell dan Layout Contract

Topic ini wajib memakai scene-ui V1: DEFAULT_LAYOUT_V1 (820×1340),
IntroHeaderMorphV1, ActBadgeNavigatorV1, dan ContentBodyV1 — dipakai
langsung (tanpa composer SceneChromeV1, bebas duplikasi chrome). Animation.jsx
tetap memegang timeline, state, dan SFX. Semua child body memakai koordinat
lokal; 0,0 setara canvas 44,235 (DEFAULT_LAYOUT_V1.body). Tidak ada
header/navigator SVG kedua. SceneSafeAreaDebugV1 tidak dipasang permanen —
cek kolisi dilakukan numerik (tidak ada zona negatif, tidak melewati body
height 965).

| Zona canvas V1 | Local body | Isi |
|---|---:|---|
| Header y 0–155 | — | category (DEVELOPER TOOLS · ADIB-DEV.COM), title, subtitle |
| Navigator y 155–235 | — | badge + empat dot |
| Story y 235–610 | y 0–375 | Adib, gerbang, kios, mesin hash |
| Transit y 476–610 | y 241–375 | jalur session ke resepsionis |
| Policy y 610–1020 | y 375–785 | penjaga, resepsionis, lemari |
| Closing y 1020–1340 | y 785–965 | dua cap + payoff |

Bounding box terbesar, Gedung Arsip + dua lemari issu lokasi aktual:
- Gedung: local x 156–576, y 5–155; kios + login form: x 206–526, y 283–391.
- Mesin hash: local x 186–546, y 475–575.
- Lemari: local x 118–294 & 438–614, y 635–775.
- Stempel: cap izin per lemari local y 798–862 (center 830); penutup
  868–932 (center 900). Caption Act 4 mengambang di y 589–623 (di atas
  lemari). Label mikro HTTP ditempel dekat elemen: 401 di y ~415 (kios,
  Act 2), 403 di y ~756 (dalam lemari rahasia, Act 4).
Semua frame transisi memberi margin dari body (local y 0–965, x 0–732)
dan tidak memasuki navigator. Audit hero, tiap seam Act,
dan closing.

## 8. Continuity dan Motion

| Objek | Lintas Act | Aturan |
|---|---|---|
| Adib | 1 → 4 | Bergerak dari posisi terakhir, tidak unmount di seam |
| Paket | 1 → 4 | Bersama Adib sampai lemari berizin; tween, bukan spawn baru |
| Gedung/gerbang | 1 → 4 | Redup sejak Act 1, area relevan kemudian menyala |
| Bukti login | 2 → 4 | credential → hash → cap → session **atau** token |
| Lemari | siluet Act 1 → fokus Act 4 | Tujuan selalu tampak sebelum dipakai |

- Paket bergerak Adib → gerbang → koridor → lemari melalui jalur terlihat.
- Session dan token adalah cabang perbandingan, bukan dua bukti bersamaan.
  Keduanya berasal dari cap valid dan merge ke keputusan authorization.
- Transisi Act overlap/parallax ±0,35–0,5 detik; tanpa reset kanvas/layar kosong.
- Hold cap penting 0,8–1,2 detik. Gerak pemeriksaan lain maksimum 0,35 detik
  kecuali ada alasan keterbacaan.
- Setiap Act memiliki motion cerita + ambient halus. Semua ambient tween dalam
  ref dan di-kill saat Act berubah agar tidak menumpuk pada preview/export.

## 9. Storyboard — Empat Babak

### Act 1 — Paket Tepat, Orang Belum Terbukti (±9 dtk)

**Tujuan:** alamat/endpoint yang tepat belum membuktikan identitas. Hook,
bukan jawaban teknis.

| Beat | Cerita/visual | Teks lokal | Motion |
|---|---|---|---|
| Setup | Paket callback REST API tiba bersama Adib di Gedung Arsip. | Tujuan sudah tepat | Paket mengikuti path; lampu gedung bernapas |
| Tegangan | Penjaga mengangkat palang; lemari terlihat jauh di dalam. | Identitas belum terbukti | Palang turun, paket recoil, warning pulse |
| Titik balik | Penjaga menunjuk kios, bukan paket. | Buktikan pemilik paket | Kamera pan ke kios; gerbang tetap terlihat |
| Payoff | Adib ke kios membawa paket yang sama. | Authentication memeriksa siapa | Slide pendek; lampu kios berkedip |

**Exit:** Adib dan paket di kios; gedung/lemari tetap redup.

### Act 2 — Password Tidak Disimpan Utuh (±13 dtk)

**Tujuan:** sistem menyimpan hash salted dan membandingkan hasil login baru,
bukan menyimpan atau membalik password asli.

| Beat | Cerita/visual | Teks lokal | Motion |
|---|---|---|---|
| Setup | Adib mengisi nama/password; resepsionis naif menulis password di buku. | Password asli berbahaya | Karakter masuk bertahap; buku terbuka |
| Tegangan | Pengintip mengambil snapshot; semua password bocor. | Buku bocor | Flash merah, buku bergetar |
| Titik balik | Mesin satu arah menerima password + salt unik dan mengeluarkan hash. | Hash tidak dibalik | Salt masuk, pola scramble keluar, reverse memantul X |
| Payoff | Buku hanya menyimpan salt + hash; login ulang menghasilkan pola cocok. | Hash cocok, Adib valid | Dua cap menjadi IDENTITAS VALID |

Visual memakai pola hash fiktif dan tidak memakai kata “enkripsi”. Salt adalah
input unik per record, bukan dekorasi seragam. Exit: cap valid di tangan Adib;
plaintext dan pengintip keluar dari layar.

### Act 3 — Bukti Login Bisa Dua Bentuk (±15 dtk)

**Tujuan:** session dan token memiliki tempat pemeriksaan/trade-off berbeda;
tidak ada yang selalu lebih unggul.

| Beat | Cerita/visual | Teks lokal | Motion |
|---|---|---|---|
| Setup | Cap valid bercabang menjadi dua storyboard mini. | Dua cara mengingat login | Split stage lembut |
| Session | Kartu bernomor terbit; pintu mengirim cek ke resepsionis nomor aktif. | Session cek server | Kartu bergerak; garis pulang-pergi |
| Token | Pas signed user · role · exp terbit; penjaga cek signature dan expiry. | Token membawa bukti | Signature glow; cek berhenti lokal |
| Payoff | Dua jalur merge menuju lorong lemari dengan trade-off kecil. | Trade-off berbeda | Jalur merge, tidak saling mengalahkan |

Label mikro “JWT signed, bukan encrypted” hanya boleh muncul setelah signature
diperiksa. Payload tidak memuat rahasia, expiry terlihat, dan tidak ada klaim
token mustahil dicabut atau aman selamanya. Exit: Adib satu figur di lorong.

### Act 4 — Identitas Valid, Akses Tetap Dipilih (±12 dtk)

**Tujuan:** authentication dan authorization adalah dua gerbang. Payoff akhir.

| Beat | Cerita/visual | Teks lokal | Motion |
|---|---|---|---|
| Setup | Adib melewati lemari umum; lemari rahasia tetap terkunci. | Login bukan semua akses | Umum terbuka; rahasia pulse merah |
| Tegangan | Policy memeriksa reader; paket butuh archive.read. | Izin diperiksa terpisah | Dua cap berdampingan |
| Titik balik | Matriks menampilkan IDENTITAS VALID dan IZIN DIIZINKAN/DITOLAK terpisah. | Siapa berbeda dari boleh | Cap kedua berubah setelah policy match |
| Payoff | Lemari sesuai izin membuka; jalur gagal tetap terkunci sebagai contoh 403. | Akses sesuai izin | Pintu terbuka; paket glow; lock gagal jelas |

Nuansa HTTP opsional: label mikro 401: belum/invalid login dan 403: login
valid, izin kurang. Label tidak boleh mengambil alih payoff.

## 10. Asset Matrix

| Elemen | Rencana | State | Alasan |
|---|---|---|---|
| Adib + ekspresi | inline SVG | normal, khawatir, lega | ekspresi/posisi berubah |
| Paket | inline SVG | tersegel, dibawa, diambil | interaksi dan perpindahan |
| Gedung/gerbang/lemari | inline SVG | redup, blokir, terbuka | pintu/lampu berubah |
| Kios/buku/mesin | inline SVG | plaintext, bocor, hash | transformasi inti |
| Session/token pass | inline SVG | terbit, cek, expired-style | label/signature dinamis |
| Petugas/pengintip | PNG hanya bila audit style setuju; fallback SVG | normal, mengintip | bukan sumber transformasi utama |
| Partikel/jalur/cap | inline SVG | muncul, bergerak, merge | sinkron dengan GSAP |

Jika PNG baru dibutuhkan: tulis icons/icons.json lengkap, buat placeholder
transparan, batch sesuai 06-icon-generation, lalu verifikasi alpha. Tidak ada
keputusan generate aset pada tahap plan ini.

## 11. Timeline dan SFX

Animation.jsx nanti memakai satu master gsap.timeline dengan time cursor.
State minimal: morphP, phaseIdx, storyStep, serta visual state yang benar-benar
dirender. Saat mount expose window.__animationTimeline dan
window.__flushSync = flushSync; cleanup saat unmount.

| Bagian | Budget |
|---|---:|
| Intro hero → header | 1,2 dtk |
| Act 1 | 9 dtk |
| Act 2 | 13 dtk |
| Act 3 | 15 dtk |
| Act 4 | 12 dtk |
| **Total** | **±50,2 dtk** |

| Momen | Kategori SFX yang diaudit | Fungsi |
|---|---|---|
| Paket tiba/gerbang blok | impacts, warnings | hook |
| Credential | ui/sfx | ketukan ringan |
| Buku bocor | warnings | bahaya |
| Hash/compare | transitions, success | transformasi/validasi |
| Session/token | ui, success | membedakan jalur |
| Policy allow/deny | success, warnings | payoff |
| Transisi | transitions | identitas transisi |

Audio memakai shared ../../shared/audio/sfxLoader dan audioStrategy realtime.
Tidak ada sfx-loader.js lokal atau SFX_SCHEDULES legacy.

## 12. Guardrail Teknis

1. Authentication memverifikasi identitas; authorization memverifikasi izin.
   Keduanya terlihat sebagai dua cap berbeda.
2. Password tidak disimpan plaintext atau “dienkripsi”; gunakan hash password
   modern dengan salt unik dan verifier yang sesuai.
3. Hash tidak dipulihkan menjadi password. Compare adalah penyederhanaan visual
   dari verifier yang aman.
4. Session adalah state login server-side; token signed bisa diverifikasi tanpa
   lookup session normal, namun keduanya punya trade-off.
5. JWT lazimnya signed dan base64url-encoded, bukan terenkripsi default.
6. Expiry dan revocation/denylist adalah concern token nyata.
7. 401 untuk kredensial belum ada/tidak valid; 403 untuk identitas valid tetapi
   tidak berizin.
8. Aplikasi dapat memakai session dan tetap memiliki API; tidak ada klaim REST
   harus token-based.

## 13. Checklist Eksekusi

Status diupdate 2026-09-12 seiring eksekusi first pass. Item tersisa hanya
verifikasi yang butuh reviewer manual (preview web) dan export MP4.

- [x] **Approved** — Review dan approve §1–§12 sebagai pre-planning gate.
- [x] **Done** — Audit 18-auth/backup; keputusan: tulis ulang tanpa memulihkan
      backup (aslinya tetap di backup/, tidak dipindah).
- [x] **Done** — Buat ulang Animation.jsx, data.js, manifest.js.
- [x] **Done** — Terapkan manifest §3, audioStrategy realtime, dan scene-ui V1
      (IntroHeaderMorphV1 + ActBadgeNavigatorV1 + ContentBodyV1; body
      koordinat lokal, origin body 44,235).
- [x] **Done** — Align ContentBodyV1 (2026-09-12): seluruh child body di-
      wrap ContentBodyV1 dan konstanta layout dikonversi ke local coordinate
      (DATA `AXIS_X/GATE_Y/KIOSK_Y/BRANCH_Y/LOCKER_Y` dst = canvas − body
      origin). Header/navigator tetap di level canvas. Cek kolisi numerik
      lintas fase dijalankan (tidak ada zona negatif, tidak melewati 965).
- [x] **Done** — Dead field & magic string: `TOTAL_DURATION` dan `CLIENT_LABEL`
      dihapus (tanpa konsumen); label HTTP opsional memakai
      `CAPTIONS.STATUS_401/403` — dipasang kontekstual dekat elemen (401 di
      kios da Act 2, 403 dalam lemari rahasia Act 4), bukan satu bar teks lebar.
- [x] **Done** — Branding header: tagline category diperluas jadi
      `DEVELOPER TOOLS · ADIB-DEV.COM` (domain cyan SYSTEM #22D3EE) via
      `categorySegments` — selaras Series Identity Contract 09 §1.Q dengan
      17-rest-api. Catatan lengkap di `revisi/2026-09-12-revisi-01.md`.
- [x] **Done** — Karakter protagonis diubah dari Nina → Adib (selaras
      protagonis 17-rest-api): konstanta `NINA`→`ADIB`, username login
      `nina`→`adib`, identifier & key timeline `ninaY`/`setNinaY`/`ninShape`/
      `'nina'`→`adibY`/`setAdibY`/`adibShape`/`'adib'`. Catatan lengkap di
      `revisi/2026-09-12-revisi-02.md`.
- [x] **Done** — Implementasikan intro (morph hero→header), timeline expose
      (window.__animationTimeline + __flushSync), dan flushSync.
- [x] **Done** — Implementasikan Act 1 (gedung redup, barrier, panah ke kios).
- [x] **Done** — Implementasikan Act 2 (plaintext → leak → mesin hash satu arah
      → cap IDENTITAS VALID).
- [x] **Done** — Implementasikan Act 3 (cabang session/token + cek server/lokal
      + merge; label JWT signed).
- [x] **Done** — Implementasikan Act 4 (Adib berjalan ke lemari — revisi
      eksekusi continuity §8, cap izin per lemari, dua cap payoff closing).
- [x] **Done** — Audit asset matrix: semua inline SVG, tanpa PNG eksternal,
      jadi tidak perlu loader/placeholder.
- [x] **Done** — Audit file SFX: SFX_MAP hanya nama yang sudah ada di
      public/audio shared loader; semua kategori valid.
- [x]/[ ] **Static audit (parsial selesai, visual menyusul)** — Dead field,
      magic string, chrome duplikat, dan collision zona sudah diaudit secara
      numerik (dokumen ini §7). Verifikasi visual final (frame hero/compact,
      tiap seam Act, closing) menunggu preview manual reviewer.
- [x]/[ ] **Compile PASS, Verified Manual TERSISA** — `esbuild` bundle
      Animation.jsx exit 0 (hanya warning import.meta). Preview manual di web
      (`npm run dev` → player auth) MENUNGGU reviewer. Catatan: `vite build`
      penuh saat ini gagal di 16-env-variables (file terpotong, pre-existing,
      di luar scope topic ini).
- [ ] **Pending** — Export audio; cek frame kosong, desync, ambient tween tersisa.
- [ ] **Pending** — Jalankan checklist standardization 03 dan 02 item-per-item
      (sebagian sudah diterapkan: 02 §7 kontrak folder, 09 §1.S scene shell,
      §1.D caption/teks, §2.1–2.4 audit visual; sisa lintasan manual
      dituntaskan bersama preview reviewer).
- [x] **Done** — Registry di-uncomment sebagai `coming-soon` (status `ready`
      hanya setelah QA/export lolos).

## 14. Non-Goals

- Tidak mengimplementasikan plan ini.
- Tidak mengaktifkan topic auth di registry.
- Tidak memindahkan, menghapus, atau mengedit file backup.
- Tidak menambah cliffhanger/topic lanjutan.
- Tidak menjadikan video tutorial OAuth, cookie, atau library spesifik.

---

**Status akhir:** 🚧 **IMPLEMENTED (first pass, aligned ContentBodyV1)**
— blueprint + 4 Act dieksekusi, scene shell V1 penuh (ContentBodyV1 + local
coords), dead field dibersihkan, registry aktif `coming-soon`; tinggal
preview manual di web dan export MP4 yang menunggu reviewer.
