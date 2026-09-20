# PLAN — 92 Web Server: Penerima Request Pertama

| Item | Nilai |
|---|---|
| Status | 📝 PLAN ONLY — belum ada implementasi |
| Audiens | Pemula yang sudah memahami Linux server, DNS/IP, dan port. |
| Audience promise | Memahami web server sebagai process yang menerima request, memilih resource, lalu mengirim response. |
| Scene shell | scene-ui V1 portrait 820×1340: IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1. |

## Series Identity

| Field | Nilai |
|---|---|
| Seri | Linux Fundamentals — Server & Web |
| Kategori | Linux Fundamentals |
| Title segments | `WEB` biru/cyan `#38BDF8` + ` SERVER` hijau `#34D399` |
| Prasyarat | 81 Network Interface, 84 Network Ports, 91 Linux Server. |

## Model Mental

**Direvisi lihat `revisi/2026-09-18-1213-revisi-01.md` — model mental definitif ada di sana.**

```text
Browser meminta /about
  → Nginx atau Apache menerima di HTTP/HTTPS listener
  → file about.html sudah ada di disk
  → web server membaca file
  → browser menerima halaman

Browser meminta /api/profile
  → Nginx atau Apache menerima di HTTP/HTTPS listener
  → request perlu data/logic dinamis
  → web server meneruskan request ke app upstream
  → app membuat JSON response
  → web server mengembalikan response ke browser
```

Web server (contoh: Nginx, Apache) adalah process yang menerima HTTP request. Ia dapat membaca file statis yang sudah ada di disk, atau meneruskan request ke app upstream terpisah (Node.js/Python/PHP-FPM/Java) yang membuat response secara dinamis. Response selalu kembali ke browser lewat web server, tidak pernah muncul langsung dari app. Web server bukan DNS atau aplikasi bisnis itu sendiri.

## Content State Contract

**Direvisi — lihat tabel lengkap di `revisi/2026-09-18-1213-revisi-01.md` § State Contract yang Direvisi.**

| State | Yang terlihat | Yang belum boleh terlihat | Pemicu | Hasil |
|---|---|---|---|---|
| Awal | Browser, listener Nginx/Apache redup, static files dan app upstream redup | Halaman/JSON response | Browser membuka URL | Request packet lahir |
| Listener menerima | Packet masuk ring HTTP/HTTPS pada Nginx/Apache | Jalur static/dynamic terpilih | Listener membaca path | Path chip memberi keputusan jenis resource |
| Static dipilih | File tile sudah ada; app tetap redup | JSON dari app | Path `/about` cocok file | Tile disalin menjadi HTML response |
| Dynamic dipilih | App upstream masih idle; file static tidak berubah | JSON response | Path `/api/profile` diteruskan | App menerima packet dan membentuk JSON response |
| Browser selesai | Response kembali lewat listener | Klaim app sehat tanpa response valid | Body tiba di browser | Browser merender halaman atau data profile |

## Storyboard & Causal Motion

**Direvisi — storyboard definitif 4 Act ada di `revisi/2026-09-18-1213-revisi-01.md` § Storyboard Pengganti.**

| Act | Action | Before → intent → travel → apply → after | Hold |
|---|---|---|---:|
| 1. Siapa yang menerima? | `request-ke-listener` | Browser belum terhubung → URL dibuka → request bergerak ke ring HTTP/HTTPS → packet masuk Nginx/Apache → process listener menyala. | 0,8s |
| 2. Halaman statis | `serve-static-file` | `about.html` sudah ada di file shelf, browser loading → path `/about` dipilih → read pulse dari listener ke tile → tile menjadi response capsule → browser menerima halaman; app upstream tetap idle. | 1,0s |
| 3. Data dinamis | `forward-ke-upstream` | App upstream idle, tidak ada JSON → path `/api/profile` dipilih → forwarded packet dari listener ke app → packet masuk app → app membentuk JSON response; file tile tidak berubah. | 1,0s |
| 4. Response selalu kembali lewat web server | `return-via-web-server` | JSON berada di app upstream → app mengirim response → capsule kembali ke Nginx/Apache → listener mengirim ke browser → browser menampilkan data; dua jalur dibandingkan singkat. | 1,0s |

## Visual, Asset, dan Continuity

- Flow tetap: browser → listener → static shelf atau app upstream → response.
- Listener wajib berupa socket/ring yang menempel pada process card, bukan label “Nginx”/“Apache” saja.
- Static path memakai file tiles; dynamic path memakai forwarded packet. Motion keduanya berbeda.
- Response adalah handoff dari resource yang dipilih; request tidak boleh hilang lalu halaman muncul tiba-tiba.
- Semua actor dibuat inline SVG: browser, packet capsule, listener ring, process card, file shelf, app process, response capsule, log line.
- Semua actor berada dalam local coordinate `ContentBodyV1`; audit safe-zone dan reset packet, target aktif, serta response tiap loop.

## Batas Aman

- Tidak ada instalasi, konfigurasi production, IP/domain nyata, atau klaim port terbuka berarti aplikasi sehat.
- Jangan membuat kedua resource aktif bersamaan tanpa alasan naratif.

## Checklist Eksekusi

- [ ] Validasi diagram dan empat action sebelum coding.
- [ ] Buat `data.js`, `manifest.js`, lalu `Animation.jsx`.
- [ ] Preview frame before, transit, dan after tiap action.
- [ ] Audit loop reset, safe-zone, SFX coverage, compile, preview, dan export.
