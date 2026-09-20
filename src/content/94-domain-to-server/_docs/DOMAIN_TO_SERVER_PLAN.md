# PLAN — 94 Domain ke Server: Perjalanan Saat Website Dibuka

| Item | Nilai |
|---|---|
| Status | 🚧 IN PROGRESS — 4 Act sudah dieksekusi, belum lolos validation gate (preview/export manual) |
| Terakhir diupdate | 2026-09-19 |
| Audiens | Pemula yang telah melihat DNS, interface, port, web server, dan reverse proxy secara terpisah. |
| Audience promise | Menelusuri satu request website dari domain sampai aplikasi dan kembali lagi; setiap lapisan punya tugas berbeda. |
| Scene shell | scene-ui V1 portrait 820×1340: IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1. |

## Series Identity

| Field | Nilai |
|---|---|
| Seri | Linux Fundamentals — Server & Web payoff |
| Kategori | Linux Fundamentals |
| Title segments | `DOMAIN` biru/cyan `#38BDF8` + ` TO SERVER` hijau `#34D399` |
| Prasyarat | 13 DNS, 81 Network Interface, 84 Network Ports, 91–93. |

## Model Mental

```text
domain → DNS answer/IP → route + HTTPS connection → reverse proxy → web/app → response
```

Ini episode integrasi, bukan daftar definisi. Satu packet identity harus terlihat melewati semua lapisan dan tiap node hanya melakukan satu keputusan.

## Content State Contract

| State | Yang terlihat | Yang belum boleh terlihat | Pemicu | Hasil |
|---|---|---|---|---|
| Nama belum dikenal | Browser punya domain, destination belum ada | IP, port choice, app response | User membuka domain | DNS query lahir |
| Address ditemukan | DNS mengembalikan IP | Server/app aktif | DNS response tiba | Browser memiliki destination host |
| Koneksi masuk | Packet menuju host melalui HTTPS/port | Backend response | Connection mencapai edge | Reverse proxy menerima request |
| Aplikasi menjawab | Proxy memilih backend | Halaman browser final | Backend memproses request | Response kembali ke browser |

## Storyboard & Causal Motion

| Act | Action | Before → intent → travel → apply → after | Hold |
|---|---|---|---:|
| 1. Nama menjadi alamat | `resolve-domain` | Browser hanya punya domain → DNS query lahir → query ke resolver → answer tiba → domain chip handoff menjadi IP destination. | 1,0s |
| 2. Mencapai server | `connect-ke-edge` | Browser tahu IP, edge redup → HTTPS connection dimulai → packet mengikuti route ke `:443` → edge menerima packet → tujuan server nyata. | 0,9s |
| 3. Memilih aplikasi | `proxy-ke-app` | Proxy dan backend belum memilih target → proxy membaca host/path → routing beam menyala → packet masuk backend → aplikasi membentuk response. | 1,0s |
| 4. Halaman kembali | `return-page` | Browser loading → backend mengirim body → capsule lewat proxy dan edge → browser menerima response → halaman dirender, spine lengkap menyala. | 1,1s |

## Visual, Asset, dan Continuity

- Gunakan satu packet identity yang handoff: domain query → request packet → response capsule. Tidak ada teleport antar Act.
- Browser, DNS, edge/port, proxy, dan backend hadir redup sebelum packet menggunakannya.
- Zona vertikal: browser/DNS di atas; transit di tengah; edge, proxy, dan backend di bawah.
- Frame akhir adalah spine lengkap, bukan daftar definisi.
- Semua actor inline SVG: browser, domain chip, DNS resolver, query/answer packet, HTTPS edge gate, proxy gate, backend process, response capsule.
- Semua actor memakai local coordinate `ContentBodyV1`; audit safe-zone dan reset query, packet, active backend, response tiap loop.

## Batas Aman

- Gunakan domain, IP, dan backend fiktif; tidak ada command, DNS change, scan, atau konfigurasi TLS.
- DNS tidak membawa request web; port tidak memilih host; proxy bukan aplikasi.
- Halaman hasil tidak boleh muncul sebelum response kembali ke browser.

## Checklist Eksekusi

- [x] Buat `data.js`, `manifest.js`, lalu `Animation.jsx` — Implemented.
- [x] Act 1 — Nama menjadi alamat (resolve-domain) — Implemented.
- [x] Act 2 — Mencapai server (connect-ke-edge) — Implemented.
- [x] Act 3 — Memilih aplikasi (proxy-ke-app) — Implemented.
- [x] Act 4 — Halaman kembali (return-page) — Implemented.
- [x] Validasi packet continuity dari domain hingga response — Verified Manual
      (audit kode 2026-09-19: domain chip -> IP chip -> request packet ->
      response capsule semuanya handoff, tidak ada teleport).
- [x] Sambung SFX real ke `scripts/export-lib.js` (`SFX_SCHEDULES['domain-to-server']`)
      — Implemented, timestamp mengikuti time cursor GSAP aktual di `Animation.jsx`.
- [ ] Layout map & bounding box node/spine — Blocked→Fixed: audit 2026-09-19
      menemukan `BACKEND_A/B` (y=1000) overflow keluar `body.height` (965) dan
      masuk closing sub-zone; sudah digeser ke y=905. Perlu preview manual untuk
      konfirmasi visual final.
- [ ] Audit before/transit/after untuk keempat action dan seluruh handoff —
      belum dilakukan lewat preview manual (baru audit statis kode).
- [ ] Uji loop reset, safe-zone, SFX coverage, compile, preview, dan export —
      compile check `esbuild` sudah lolos (2026-09-19); preview/export manual
      di dev server belum dilakukan.
- [ ] Checklist final: `03-planning-storytelling-quality-gate.md` §"Checklist
      Sebelum Commit" & `02-topic-contract-scene-shell.md` §7 — belum direview.

### Catatan Perbaikan (audit & fix 2026-09-19)

Ditemukan topic sudah dieksekusi penuh tanpa update plan/checklist. Perbaikan
yang dilakukan terhadap kode existing:

1. `BACKEND_A/B` digeser dari y=1000 ke y=905 — posisi lama overflow keluar
   `ContentBodyV1` dan masuk closing sub-zone (lihat `05-svg-layout-asset-pipeline.md`).
2. `SFX_MAP.CONNECT/DNS_QUERY/ROUTE` menunjuk file yang tidak ada di
   `public/audio/` (`impacts/connect.wav`, `ui/notify.wav`, `transitions/slide.wav`)
   — diganti ke asset existing (`impact`, `plink`, `slide-in`). `CLICK` dihapus
   karena tidak pernah dipanggil (dead config).
3. `SIZES` (dead field, tidak pernah dipakai) dihapus dari `data.js`.
   `ZONES.TRANSIT` (sebelumnya dead field juga) sekarang dipakai sebagai
   anchor caption saat packet in-transit.
4. `playSfx('WHOOSH')` di tiap awal Act sebelumnya dipanggil LANGSUNG saat
   `useEffect` jalan (bug — semua 4 WHOOSH bunyi sekaligus saat mount,
   bukan di waktu masing-masing Act), sekarang dibungkus `master.add()`
   supaya ter-schedule di timeline dengan benar.
5. `CaptionBar` sebelumnya adalah caption bar global fixed-position —
   pola yang eksplisit dilarang (`03-...md` §D, deprecated `say()`
   pattern). Diganti jadi caption yang di-anchor ke posisi actor terkait
   tiap beat (16 titik `setC()` di 4 Act), dengan clamp supaya tidak
   keluar `body.width`/`body.height`.
6. `SFX_SCHEDULES['domain-to-server']` ditambahkan di `scripts/export-lib.js`
   dengan timestamp yang dihitung ulang dari time cursor GSAP setelah fix
   WHOOSH di atas.

Belum dikerjakan: preview manual di dev server, export test MP4, dan audit
SFX coverage penuh (03 §"Metodologi: Audit SFX Coverage") — perlu akses
`npm run dev` yang tidak tersedia dari sesi ini.
