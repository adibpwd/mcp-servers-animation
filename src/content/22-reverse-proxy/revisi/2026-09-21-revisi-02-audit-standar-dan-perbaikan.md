# Revisi 02 — Audit Standar dan Perbaikan Eksekusi Pertama

| Item | Nilai |
|---|---|
| Status | IMPLEMENTED — compile dan frame capture headless lulus; preview manual, export MP4, dan cek audio dengan telinga belum dilakukan |
| Pemicu | Audit `_docs/REVERSE_PROXY_PLAN.md` dan implementasi terhadap `docs/standardizations/01–06` dan `PROJECT_STRUCTURE.md`. Plan bertanda DONE, tetapi implementasi memiliki bug dan menyimpang dari plan. |

## 1. Temuan Audit

| No | Temuan | Standar | Severity |
|---|---|---|---|
| 1.1 | Konten scene tidak pernah dirender: `ContentBodyV1` dipanggil dengan children berupa fungsi, padahal komponen hanya menjalankan prop `render`. | scene-ui V1 | Kritis |
| 1.2 | `PHASES` tanpa `id`, `badge`, `badgeColor`: badge Act kosong dan tanpa warna. Field `label` tidak pernah dibaca. | 03 §1.S, §1.G | Kritis |
| 1.3 | Header dilepas setelah morph (`showIntro && ...`). | 03 §1.S DON'T, checklist 8.1 | Tinggi |
| 1.4 | `contentStarted` dan `morphP` tidak di-reset saat loop; flag visible baru di-reset di Act 1. | 01 §7, 03 §3.2 | Tinggi |
| 1.5 | `impacts/connect.wav` dan `ui/click.wav` tidak ada; empat momen penting silent. | 04 sfxCategory, 06 §3 | Tinggi |
| 1.6 | Sekitar 26 dari 38 detik idle; hold plan 0,8–1,0 detik, aktual 5–7 detik per Act. | 03 §1.E, §1.O | Tinggi |
| 1.7 | Act 2 hanya memunculkan satu chip; tanpa pembacaan host/path, perbandingan rule, atau cabang menyala. | Plan Act 2, 03 §1.T | Tinggi |
| 1.8 | Act 3 tanpa process di backend; Act 4 tanpa state client loading, SUCCESS berbunyi sebelum response tiba, client tidak berubah. | Plan Act 3–4, 03 §1.M | Tinggi |
| 1.9 | Jalur packet memotong chip routing; sepertiga bawah body kosong. | 05 layout, 03 §1.R | Sedang |
| 1.10 | Tanpa teks/hook/payoff; string hardcode di `Animation.jsx`; `popIn` tanpa fade/scale; `popOut` dan `lerp` tidak terpakai. | 03 storytelling, §3 | Sedang |
| 1.11 | Checklist plan overklaim, tanpa penomoran hierarki, tabel action tanpa kolom SFX dan frame audit, tanpa layout map dan timeline budget. | 03 Langkah -1, -0.5, §1.T.1, PROJECT_STRUCTURE | Sedang |
| 1.12 | Tag `metadata.json` (Load Balancer, Gateway) berbeda dari `manifest.js` dan bertentangan dengan Batas Aman plan. | 02 §10 | Rendah |
| 1.13 | Tidak ada `caption.md` dan `revisi/`. | 02 §3, 03 §4 | Rendah |

## 2. Perubahan State (Content State Contract)

| State | Yang terlihat | Yang belum boleh terlihat | Pemicu | Hasil |
|---|---|---|---|---|
| Awal | Client (belum ada request), endpoint, proxy, backend A/B redup | Rule terpilih, response | Timeline mulai | Client kirim request |
| Client loading | Status client `loading...` | Response | Client mengirim request | Packet lahir |
| Proxy menerima | Packet diserap gate, scan dot lahir | Backend aktif | Packet tiba di gate | Rule chip A/B tampil |
| Rule dibandingkan | Scan dot mengecek B (tidak cocok) lalu A (cocok) | Packet keluar | Scan tiba di chip | Rule A terpilih, cabang A menyala |
| Forward | Packet baru keluar dari chip A menuju backend A | Response | Cabang A menyala | Backend A memproses |
| Response | Capsule dari backend A, lewat proxy, kembali ke client | Klaim semua backend sehat | Backend selesai | Client `response diterima` |

## 3. Perubahan Layout (local coordinate `ContentBodyV1`, y >= 0)

| Elemen | Local x | Local y (pusat) | Ukuran | Catatan |
|---|---:|---:|---|---|
| Client | 366 | 70 | 200x80 | Note hook di kanan (x 490) |
| Endpoint badge | 366 | 215 | 240x40 | Packet dan response melintas di belakang badge |
| Proxy gate | 366 | 380 | 380x160 (y 300–460) | Judul kiri, rule chip A/B di dalam |
| Rule chip A / B | 276 / 456 | 415 | 150x36 | Tidak dilewati packet |
| Cabang A / B | (276,460) → (200,682) / (456,460) → (532,682) | — | garis | Terpisah dari chip |
| Backend A / B | 200 / 532 | 720 | 190x76 | Note di bawah (y 790) |
| Takeaway | 366 | 870 | 520x48 | Payoff Act 4 |
| Note gate | 572 | 330 | maks 160 lebar | Di kanan gate |

Bounding box terbesar: gate 380x160 (x 176–556, y 300–460), seluruhnya di dalam body 732x965.

## 4. Perubahan Asset

Tidak ada. Semua actor inline SVG; asset matrix state-pair tidak berlaku (tidak ada transformasi karakter). `icons/` tidak dibuat karena tidak ada PNG.

## 5. Perubahan Timeline

| Act | Durasi lama | Durasi baru | Konten aktif berakhir | Hold akhir |
|---|---:|---:|---:|---:|
| Intro | 2,6 | 2,6 | — | — |
| 1 Satu pintu publik | 9,0 | 10,0 | 8,70 | 1,3 |
| 2 Proxy memilih tujuan | 10,0 | 9,0 | 7,20 | 1,8 |
| 3 Request diteruskan | 9,0 | 6,0 | 4,25 | 1,75 |
| 4 Response kembali | 10,0 | 8,1 | 6,30 | 1,8 |

Total 35,7 detik (sebelumnya 40,6 detik dengan sekitar 26 detik idle). Di bawah panduan 40–60 detik; dipilih keterbacaan, bukan padding, karena 03 §1.E juga melarang buffer idle.

Handoff: packet diserap gate lalu scan dot lahir (overlap); scan dot dan packet keluar overlap 0,25 detik; response diserap gate dan capsule kedua lahir overlap 0,1 detik.

## 6. SFX

| Key | File | Loudness (mean) | Catatan |
|---|---|---:|---|
| POP | `ui/pop` | -27,3 dB | Sama dengan pemakaian topic lain |
| CLICK | `ui/bubble-pop` | -18,0 dB | Pengganti `sfx/click` (-37,3 dB, hampir tak terdengar; `boost` hanya berlaku saat export) |
| CONNECT | `impacts/connector-snap` | -20,4 dB | Pengganti `impacts/connect` yang tidak ada |
| PACKET_SEND | `transitions/swoosh` | -26,3 dB | Juga menggantikan `whoosh` (-39,9 dB); key `WHOOSH` dihapus |
| BEAM | `transitions/light-swoosh-quick` | -15,2 dB | Baru |
| TICK | `ui/tick` | -21,1 dB | Baru (rule tidak cocok) |
| MATCH | `ui/plink` | -21,1 dB | Baru (rule cocok) |
| SUCCESS | `success/confirm` | -19,9 dB | Hanya saat response tiba di client |
| TAKEAWAY | `ui/chime` | -21,7 dB | Baru |

Semua 9 key dipakai, semua path file ada. `sfx: null` hanya untuk backend redup (Act 1) dan rule chip B (0,3 detik setelah chip A), keduanya diberi komentar alasan di kode. Baseline standar 06: -18 dB.

## 7. Status Test

| Test | Hasil |
|---|---|
| Compile (`esbuild --bundle`) | Lulus |
| Static audit: SFX_MAP vs pemanggilan, `COPY`/`ZONES` tak terpakai atau hilang, field `PHASES` | Bersih |
| Frame capture headless (`/preview/reverse-proxy`, seek `totalTime` + `flushSync`, sama dengan jalur export) di 13 waktu: intro, tiap Act (before/transit/after), akhir loop 1, awal loop 2 | Lulus: header persisten, badge terisi, scene ter-render, loop ke-2 mulai bersih |
| Temuan saat capture, sudah diperbaiki | Durasi timeline 33,9s (hold akhir Act 4 hilang karena tidak ada event penutup) → 35,7s dengan penanda akhir |
| Console browser | Hanya 404 `favicon.ico`, tidak terkait topic |
| Preview manual pemilik project | Belum |
| Export MP4 + sinkron audio | Belum |
| Audio dengan telinga (balans, tumpang tindih SFX) | Belum |

Status `metadata.json` tetap `draft` sampai tiga item terakhir lulus.

## 8. Catatan Hasil Eksekusi

Temuan 1.1–1.13 ditangani seluruhnya. Temuan tambahan yang tidak ada di audit awal:

- **1.1 lebih serius dari yang dilaporkan.** Bukan hanya "children fungsi", seluruh isi scene tidak pernah tampil pada versi lama, sehingga klaim "preview sudah dicek" pada plan lama tidak mungkin benar.
- **Hold akhir loop.** Timeline tidak memuat hold Act terakhir sampai diberi penanda akhir.
- **Loudness.** `sfx/click` dan `transitions/whoosh` jauh di bawah baseline; diganti, bukan di-boost.
- **Catatan proses.** Folder `revisi/` ternyata sudah dibuat sesi lain dengan revisi 01 (PLAN ONLY, `acts/`). File README saya menimpa README yang mungkin sudah ada di sana; isinya kini disusun ulang memuat revisi 01 dan 02. Nomor revisi saya semula 01 (bentrok) dan diganti 02.

Setelah revisi 02, revisi 01 dieksekusi (`acts/` + `bg`). Frame konten hasil revisi 02 dipakai sebagai baseline dan identik pixel-per-pixel setelah migrasi. Bagian presentational `Animation.jsx` kini berada di `acts/common.jsx`.

Yang tidak diubah: `resolveTopic.js`, `registry`, `docs/standardizations/*`, dan file topic lain.
