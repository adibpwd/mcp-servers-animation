# PLAN — 93 Reverse Proxy: Satu Pintu untuk Banyak Aplikasi

| Item | Nilai |
|---|---|
| Status | 🟡 IMPLEMENTED (revisi 02) — menunggu verifikasi manual pemilik dan eksekusi revisi 01 (`acts/`). Belum "DONE". |
| Terakhir diupdate | 2026-09-21 |
| Audiens | Pemula yang telah memahami web server, port, dan application process. |
| Audience promise | Memahami reverse proxy menerima request publik, memilih backend internal, lalu meneruskan response. |
| Scene shell | scene-ui V1 portrait 820×1340 (`DEFAULT_LAYOUT_V1`, body 732×965): IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1. Versi awal V1, belum ada migrasi. |
| Revisi | `revisi/README.md` — 01 (`acts/`, dieksekusi), 02 (audit standar, dieksekusi) |

## Series Identity

| Field | Nilai |
|---|---|
| Seri | Linux Fundamentals — Server & Web |
| Kategori | Linux Fundamentals |
| Title segments | `REVERSE` biru `#38BDF8` + ` PROXY` hijau `#34D399` |
| Prasyarat | 84 Network Ports, 91 Linux Server, 92 Web Server. |

## Model Mental

```text
internet request → public proxy → host/path decision → backend A atau B → response
```

Reverse proxy berada di depan backend. Ia menerima request dari client, menentukan backend berdasarkan host atau path, meneruskan request, lalu mengembalikan response.

## Content State Contract

| State | Yang terlihat | Yang belum boleh terlihat | Pemicu | Hasil |
|---|---|---|---|---|
| Awal | Client (belum ada request), satu public endpoint, proxy, backend A/B redup | Rule terpilih, response | Timeline mulai | Client mengirim request |
| Client loading | Status client `loading...` | Response | Client mengirim request | Packet lahir |
| Proxy membaca | Packet diserap gate, scan dot lahir | Backend aktif | Packet tiba di gate | Rule chip A/B tampil |
| Rule dibandingkan | Scan dot mengecek B (tidak cocok) lalu A (cocok) | Packet keluar | Scan tiba di chip | Rule A terpilih, cabang A menyala |
| Forward | Packet baru keluar dari chip A menuju backend A | Response | Cabang A menyala | Backend A memproses |
| Return | Capsule dari backend A, lewat proxy, kembali ke client | Klaim semua backend sehat | Backend selesai | Client `response diterima` |

## Storyboard & Causal Motion (T.1)

Waktu = detik relatif terhadap awal Act. Frame audit = before / transit / after.

| Act | Action | Before → intent → travel → apply → after | Hold | SFX | Frame audit |
|---|---|---|---:|---|---|
| 1. Satu pintu publik (10,0s) | `request-ke-proxy` | Backend belum terjangkau client → client `loading...` → packet turun melintas di belakang badge endpoint → diserap gate (scan dot lahir) → proxy menjadi titik masuk tunggal. | 1,3s | POP client/endpoint, CONNECT gate, CLICK intent, PACKET_SEND, CONNECT apply | 6,5s packet belum lahir · 7,9s packet di badge · 9,0s packet hilang, scan dot aktif |
| 2. Proxy memilih tujuan (9,0s) | `host-path-routing` | Backend A/B redup → scan dot membaca chip B (tidak cocok) → chip A cocok → cabang A menyala → backend A aktif, B tetap redup. | 1,8s | POP chip, BEAM scan, TICK, MATCH, BEAM cabang, POP aktif | 2,0s chip tampil · 3,3s dot di chip B merah · 6,0s cabang A mulai menyala |
| 3. Request diteruskan (6,0s) | `forward-ke-backend` | Scan dot di chip A → packet baru keluar dari bawah chip A → menempuh cabang A → masuk backend A → backend memproses request. | 1,75s | PACKET_SEND, CONNECT | 1,3s dot di chip A · 2,4s packet di cabang · 3,4s backend A `menangani request` |
| 4. Response kembali (8,1s) | `response-melalui-proxy` | Client loading → backend membentuk capsule → capsule naik cabang A → diserap gate → capsule kedua lahir → melintas di belakang endpoint → client menerima hasil. | 1,8s | POP, PACKET_SEND ×2, CONNECT, SUCCESS, TAKEAWAY | 2,6s capsule di cabang · 4,2s capsule di atas endpoint · 6,5s client `response diterima` |

## Exit State & Objek Persisten per Act

| Act | Exit state | Persisten ke Act berikutnya |
|---|---|---|
| 1 | Request diserap proxy; backend redup | Client, endpoint, gate, backend, cabang, scan dot |
| 2 | Rule A cocok, cabang A menyala, backend A aktif | Semua + chip rule, scan dot di chip A |
| 3 | Backend A memproses request | Semua; packet sudah diserap |
| 4 | Client menerima response; takeaway tampil | Tidak ada (loop: semua di-reset pada t=0) |

## Layout Map (local coordinate `ContentBodyV1`, y ≥ 0)

| Elemen | x | y (pusat) | Ukuran |
|---|---:|---:|---|
| Client | 366 | 70 | 200×80 |
| Endpoint badge | 366 | 215 | 240×40 |
| Proxy gate | 366 | 380 | 380×160 (y 300–460) |
| Rule chip A / B | 276 / 456 | 415 | 150×36 |
| Cabang A / B | (276,460)→(200,682) / (456,460)→(532,682) | — | garis |
| Backend A / B | 200 / 532 | 720 | 190×76 |
| Takeaway | 366 | 870 | 520×48 |

Bounding box terbesar: gate 380×160 (x 176–556, y 300–460), di dalam body 732×965. Note kanan (x ≥ 490) tidak bersinggungan dengan jalur packet (x 366). Packet dan response melintas di **belakang** badge endpoint (layer di bawah, badge opaque) sehingga bukan collision.

## Timeline Budget

| Bagian | Durasi | Konten aktif berakhir | Hold |
|---|---:|---:|---:|
| Intro (hold 1,8 + morph 0,8) | 2,6s | — | — |
| Act 1 | 10,0s | 8,70s | 1,3s |
| Act 2 | 9,0s | 7,20s | 1,8s |
| Act 3 | 6,0s | 4,25s | 1,75s |
| Act 4 | 8,1s | 6,30s | 1,8s |
| **Total** | **35,7s** | | |

Total di bawah panduan 40–60s; dipilih keterbacaan daripada padding karena 03 §1.E melarang buffer idle. Revisi 02 memangkas idle dari sekitar 26s menjadi 0s di luar hold.

## Caption Plan (declaratif, ≤ 7 kata, dekat elemen)

| Act | Elemen | Teks |
|---|---|---|
| 1 (hook) | Client | Client hanya kenal satu pintu |
| 1 | Endpoint | Alamat publik menuju proxy |
| 1 | Gate | Proxy jadi titik masuk tunggal |
| 2 | Gate | Proxy membaca path dan host request → Path /api cocok dengan aturan A |
| 2 | Backend A / B | Backend A dipilih · Backend B tidak dipilih |
| 3 | Gate / Backend A | Proxy meneruskan request ke A → Backend A menangani request |
| 4 | Backend A / Gate / Client | Backend A membuat response → Response lewat proxy kembali ke client → Client menerima hasil |
| 4 (payoff) | Takeaway | Satu pintu publik, banyak backend |

## Visual, Asset, dan Continuity

- Proxy ialah gate besar di tengah spine; rule chip berada di dalam gate; backend A/B ialah process card redup di bawahnya.
- Backend yang tidak dipilih tetap terlihat redup; tidak ada unmount lalu munculkan backend tujuan.
- Continuity: packet → scan dot → packet baru (overlap di gate), capsule → capsule kedua (overlap di gate). Gate ialah komponen opaque; scan dot ialah objek penghubung selama proses baca rule.
- **Asset matrix:** N/A. Semua actor inline SVG (client, endpoint badge, gate, chip, packet, backend card, capsule, scan dot); tidak ada PNG sehingga `icons/` tidak dibuat.
- Struktur file: `acts/` (`common.jsx`, `Act1…Act4`, `index.js`), `Animation.jsx` hanya timeline + state + komposisi. Intro memakai `bg={1}` + `bgScenes={ACT_SCENES}`.
- Loop: semua state naratif (visibility, posisi actor, teks, status client, `contentStarted`, `morphP`) di-reset pada t=0.

## Batas Aman

- Tidak ada konfigurasi runnable, domain/IP nyata, exposure port, atau cara melewati policy. `example.com` ialah domain reserved (RFC 2606); `:8080`/`:8081` hanya label port internal.
- Jangan menyamakan reverse proxy dengan firewall atau load balancer; backend B tidak dipilih dalam demo ini dan tag metadata tidak memuat "Load Balancer".
- Health check tidak diklaim selesai hanya karena route tersedia.

## Checklist Eksekusi

Status: `Draft` · `Approved` · `Implemented` · `Verified Manual` (hanya oleh pemilik project) · `Blocked`.

1. Persiapan
   1.1. Validasi host/path routing dan handoff response — Implemented
   1.2. Riset standar 01–06 dan `PROJECT_STRUCTURE.md` — Implemented
2. Setup folder
   2.1. `data.js` (teks, zona, durasi, SFX_MAP) — Implemented
   2.2. `manifest.js`, `metadata.json` — Implemented
   2.3. `caption.md` — Implemented
3. Implementasi per Act
   3.1. Act 1 Satu pintu publik — Implemented
   3.2. Act 2 Proxy memilih tujuan — Implemented
   3.3. Act 3 Request diteruskan — Implemented
   3.4. Act 4 Response kembali + takeaway — Implemented
4. Integrasi
   4.1. SFX: semua path diverifikasi ada; loudness diukur — Implemented
   4.2. Loop reset, header persisten, badge Act — Implemented
   4.3. Registry: `metadata.json` `status: draft` sampai 5.3 selesai — Approved
5. Validasi
   5.1. Compile (esbuild) — Implemented
   5.2. Frame capture headless sebelum/transit/sesudah tiap Act + loop ke-2 — Implemented
   5.3. Preview manual pemilik project — Draft
   5.4. Export MP4 dan cek sinkron audio — Draft
   5.5. `npm run build` + SSR gate standar 07 §6 — Implemented
   5.6. Checklist final 03 (Langkah -0.5 dan checklist akhir) — Draft
6. Lanjutan
   6.1. Revisi 01: migrasi `acts/` dan intro `bg`/`bgScenes` (standar 07) — Implemented
   6.2. Ganti `INTRO_BG_ACT` ke Act 2 jika pemilik memilih thumbnail yang lebih informatif — Draft

## Status Implementasi

**Terakhir diupdate:** 2026-09-21

Revisi 02 memperbaiki eksekusi awal (2026-09-18) yang menyimpang dari plan dan standar; rincian temuan dan perbaikan ada di `revisi/2026-09-21-revisi-02-audit-standar-dan-perbaikan.md`. Revisi 01 memindahkan scene ke `acts/` tanpa mengubah tampilan (frame konten identik dengan baseline). Status "DONE" sebelumnya dicabut karena checklist audit dicentang tanpa bukti.
