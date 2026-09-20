# PLAN — 93 Reverse Proxy: Satu Pintu untuk Banyak Aplikasi

| Item | Nilai |
|---|---|
| Status | ✅ DONE — implementasi selesai |
| Audiens | Pemula yang telah memahami web server, port, dan application process. |
| Audience promise | Memahami reverse proxy menerima request publik, memilih backend internal, lalu meneruskan response. |
| Scene shell | scene-ui V1 portrait 820×1340: IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1. |

## Series Identity

| Field | Nilai |
|---|---|
| Seri | Linux Fundamentals — Server & Web |
| Kategori | Linux Fundamentals |
| Title segments | `REVERSE` biru/cyan `#38BDF8` + ` PROXY` hijau `#34D399` |
| Prasyarat | 84 Network Ports, 91 Linux Server, 92 Web Server. |

## Model Mental

```text
internet request → public proxy → host/path decision → backend A atau B → response
```

Reverse proxy berada di depan backend. Ia menerima request dari client, menentukan backend berdasarkan host atau path, meneruskan request, lalu mengembalikan response.

## Content State Contract

| State | Yang terlihat | Yang belum boleh terlihat | Pemicu | Hasil |
|---|---|---|---|---|
| Awal | Client, satu public endpoint, backend redup | Backend pilihan atau response | Client mengirim request | Request tiba di proxy |
| Proxy membaca | Proxy menerima host/path | Backend aktif | Packet masuk proxy | Routing rule terpilih |
| Forward | Satu packet dengan target internal | Respons backend | Proxy meneruskan packet | Backend menerima request |
| Return | Backend menghasilkan response | Klaim semua backend sehat | Backend selesai | Proxy mengirim response ke client |

## Storyboard & Causal Motion

| Act | Action | Before → intent → travel → apply → after | Hold |
|---|---|---|---:|
| 1. Satu pintu publik | `request-ke-proxy` | Backend belum dapat diakses client → domain dibuka → packet menuju endpoint publik → masuk proxy → proxy menjadi titik masuk tunggal. | 0,8s |
| 2. Proxy memilih tujuan | `host-path-routing` | Backend A/B redup → proxy membaca host/path → beam membandingkan rule → satu cabang menyala → target diberi keputusan route. | 1,0s |
| 3. Request diteruskan | `forward-ke-backend` | Packet masih di proxy → proxy meneruskan packet → packet menempuh cabang aktif → masuk backend → process menangani request. | 0,9s |
| 4. Response kembali | `response-melalui-proxy` | Client loading → backend membentuk response → response kembali melalui proxy → proxy meneruskan capsule → client menerima hasil. | 1,0s |

## Visual, Asset, dan Continuity

- Proxy ialah gate besar di tengah spine; backend A/B ialah process card redup di bawahnya.
- Host/path ialah chip yang melekat pada packet atau proxy, bukan paragraf statis.
- Backend yang tidak dipilih tetap terlihat redup; jangan unmount lalu munculkan backend tujuan.
- Response wajib handoff backend → proxy → client, tanpa teleport.
- Semua actor dibuat inline SVG: client, public endpoint badge, proxy gate, rule chips, routed packet, backend process cards, response capsule.
- Gunakan local coordinate `ContentBodyV1`; cek collision cabang route, panel backend, header, dan navigator.

## Batas Aman

- Tidak ada konfigurasi runnable, domain/IP nyata, exposure port, atau cara melewati policy.
- Jangan menyamakan reverse proxy dengan firewall atau load balancer; fokusnya satu request diarahkan ke backend.
- Health check tidak diklaim selesai hanya karena route tersedia.

## Checklist Eksekusi

- [x] Validasi host/path routing dan handoff response sebelum coding.
- [x] Buat `data.js`, `manifest.js`, lalu `Animation.jsx`.
- [x] Preview before/transit/after untuk request, route choice, forward, dan return.
- [x] Audit collision, loop reset, SFX coverage, compile, preview, dan export.

## Status Implementasi

**Terakhir diupdate:** 2026-09-18

**File yang dibuat:**
- ✅ `data.js` - VW, VH, PHASES, COLORS, ZONES, SFX_MAP
- ✅ `manifest.js` - Metadata topic dengan schemaVersion 1
- ✅ `metadata.json` - Content management metadata
- ✅ `Animation.jsx` - Master timeline dengan scene-ui V1, 4 Acts sesuai plan

**Implementasi:**
- ✅ Act 1: Client → Public Endpoint → Proxy (request masuk)
- ✅ Act 2: Routing chip muncul, proxy memilih backend A
- ✅ Act 3: Packet diteruskan dari proxy ke backend A
- ✅ Act 4: Response kembali backend → proxy → client
- ✅ SFX integration (WHOOSH, POP, CONNECT, SUCCESS)
- ✅ State reset untuk loop safety
- ✅ Export safety (`flushSync`)
- ✅ Scene-ui V1 (IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1)

**Catatan:**
- Backend B terlihat redup sepanjang animasi (tidak dipilih dalam demo ini)
- Handoff response sudah sesuai: backend → proxy → client tanpa teleport
- Collision check: semua zona dalam batas aman ContentBodyV1
