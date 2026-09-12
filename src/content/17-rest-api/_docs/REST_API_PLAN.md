# Execution Plan — `rest-api` (REST API)

> Checklist eksekusi teknis untuk topic 17. Storyboard lengkap ada di
> `../../17-rest-api-TOPIC_PLAN.txt`. Referensi standar:
> `docs/standardizations/02-standar-konten.md`,
> `docs/standardizations/03-tutorial-buat-topic-baru.md`,
> `docs/standardizations/04-referensi-gsap.md`,
> `docs/standardizations/05-svg-text-guide.md`,
> `docs/standardizations/08-audio-sfx-generation.md`.
> Numbering pakai standar hierarki unlimited (`PROJECT_STRUCTURE.md`).

## 1. Phase 1: Setup & Data Layer

1.1. `manifest.js` @done
1.2. `data.js` — VW/VH/COLORS/PHASES/SFX_MAP/FLOW_WAYPOINTS @done
1.3. `Animation.jsx` shell (import, state, helper popIn/popOut) @done

## 2. Phase 2: GSAP Timeline Logic

2.1. Intro (fade → morph header, TANPA efek ketik — beda dari pola
     topic 14/15, sesuai catatan inline di kode) @done
2.2. Act 1 — Client Meminta Data (tween request card keluar client) @done
2.3. Act 2 — Menuju Endpoint (endpoint glow → active → redup) @done
2.4. Act 3 — Server Memproses Data (resource dots, selected, response
     dibungkus) @done
2.5. Act 4 — Response Kembali + closing `popOut` semua elemen @done
2.6. Export safety (`window.__animationTimeline`, `window.__flushSync`) @done
2.7. Cleanup `useEffect` return (`tl.kill()`, `delete window.*`) @done

## 3. Phase 3: JSX Render Body — **SELESAI (file 544 baris, compile check lolos)**

3.1. `<svg>` root + `<defs>` (glow/shadow filter) @done
3.2. Background grid @done
3.3. Header intro/morph @done
3.4. Phase badge @done
3.5. render ClientBox (`BoxLabel` client, `T('clientBox', ...)`) @done
3.6. render RequestCard di posisi `reqY` (pakai `T`/`O` helper,
     conditional `reqVisible`) + `methodBadge` nempel @done
3.7. render EndpointNode (`BoxLabel` endpoint, opacity via
     `endpointGlow`, pulse ring saat `endpointActive`) @done
3.8. render ServerBox (`BoxLabel` server, opacity via `serverGlow`) @done
3.9. render ResourceDots (`resourceDot0/1/2`), conditional
     `resourceOpen`, pakai `RESOURCE_ITEMS` @done
3.10. render `selectedBadge` (teks `SELECTED_ITEM`) saat
      `selectedDot >= 0` @done
3.11. render ResponseCard di posisi `respY`, conditional
      `respVisible` + `statusStamp` nempel @done
3.12. render `statusStamp` badge (`STATUS_CODE`) @done
3.13. render `resultCard` (final state client menerima data)
      saat `clientReceived` @done
3.14. render caption text (state `caption`) di bagian bawah canvas @done
3.15. closing tag `</svg>` @done
3.16. closing `export default function` (brace seimbang, esbuild
      compile check lolos) @done

## 4. Phase 4: Icon

4.1. TODO — putuskan pure-SVG vs generate icon PNG (plan §19: icon
     `client-browser`, `api-endpoint`, `server`, `resource-users`,
     `request`, `response`) — saat ini masih pure-SVG placeholder shape
     (`BoxLabel`, `RequestCard`, `ResponseCard`), belum ada icon PNG

## 5. Phase 5: Compile & QA

5.1. `npx esbuild` compile check @done — lolos bersih, 0 error
     (`../../../../../../tmp/rest-api-check.js 20.6kb`)
5.2. TODO — grep validation: tiap entry `SFX_MAP` benar-benar dipanggil
     di `Animation.jsx` (audit coverage, `08-audio-sfx-generation.md` §7)
5.3. TODO — cek Persistent Anchor Object — `clientBox`/`serverBox`/
     `endpointNode` harus 1 id tetap dari popIn pertama sampai closing
5.4. TODO — cek caption (`say()`) vs card/badge tidak ada kalimat
     dobel di waktu berdekatan
5.5. TODO — preview manual di dev server (browser)
5.6. TODO — export MP4 test

## 6. Phase 6: Registry & Metadata Sync

6.1. `registry.js` — entry `rest-api` sudah terdaftar, status
     `coming-soon` @done
6.2. TODO — sinkronkan metadata `manifest.js` vs
     `scripts/content-db.json` (saat ini BEDA — lihat tabel di bawah)
6.3. TODO — update komentar section di `registry.js` (saat ini tertulis
     "Intro + Act 1..5 first pass selesai" — tidak akurat: `data.js`
     cuma punya 4 Act, dan JSX render Act-nya belum ditutup/lengkap)
6.4. TODO — set `status: 'ready'` setelah Phase 5 (QA) lulus

## Catatan Sinkronisasi Metadata (manifest.js vs content-db.json)

| Field | manifest.js | content-db.json |
|---|---|---|
| category | Developer Tools | Networking |
| subtitle | Client, request, endpoint, server, response | Aturan standar di balik "istirahat" yang sibuk |
| color | #22D3EE | #A78BFA |
| tags | REST, API, HTTP, Client-Server, Backend | REST, API, CRUD, HTTP Methods, JSON, Statelessness |

Perlu diputuskan sumber kebenaran mana yang dipakai (kemungkinan
`manifest.js`, sesuai kontrak baru di `02-standar-konten.md` §5) — lalu
`content-db.json` di-update manual supaya sinkron (dua sistem ini TIDAK
auto-sync, harus manual, lihat `docs/standardizations/`).

---

**Status saat file ini ditulis:** Phase 1–2 selesai penuh. Phase 3 (JSX
render body) baru sampai Phase Badge lalu terpotong — lanjut dikerjakan
sekarang. Phase 4–6 masih TODO semua.

## 7. Phase 7 — Revisi 04: Epilogue Method Teaser (Opsi A)

> Menjawab masukan: topic asli cuma nunjukin GET+200. Bukan bug —
> desain minimal-by-design sesuai §7/§9 asli. Opsi A dipilih: teaser
> singkat setelah Act 4, reuse `resultCard` yang sudah ada, morph teks
> saja, tanpa jalan ulang lewat `FLOW_WAYPOINTS` (itu domain Opsi B,
> tidak dikerjakan).

7.1. Data Layer (`data.js`) @done
  7.1.1. `PHASES[4]` id `method-teaser`, badge `METHOD HTTP LAIN`,
         durasi 9.0s @done
  7.1.2. `TEASER_VARIANTS` — 4 varian: POST/201 (buat), PUT/200
         (perbarui), PATCH/200 (ubah sebagian), DELETE/204 (hapus).
         GET/200 tetap ditunjukkan pada alur utama Act 1–4 @done
  7.1.3. `ACT5_CAPTION` = "REST memakai method sesuai aksi datanya" @done
  7.1.4. SFX reuse (TICK/POP2/CHIME) — tidak sourcing baru @done

7.2. Timeline Restructure (`Animation.jsx`) @done
  7.2.1. Closing `popOut` semua elemen dipindah dari akhir Act 4 ke
         akhir Act 5. Act 4 berhenti di state `clientReceived`
         (belum popOut) @done
  7.2.2. Durasi Act 4 tetap 11s @done
  7.2.3. Act 5 morph `resultCard` 5x
         (GET→POST→PUT→PATCH→DELETE→balik ke GET), via helper `morph()`
         (micro scale-dip + update state di
         titik terkecil + bounce balik) @done
  7.2.4. Full `popOut` dijalankan setelah cycle morph terakhir @done

7.3. Continuity check
  7.3.1. `resultCard` tetap 1 objek persisten sejak popIn di Act 4,
         tidak dibuat ulang di Act 5 @done
  7.3.2. Teaser tidak lewat `FLOW_WAYPOINTS` @done
  7.3.3. **BUG DITEMUKAN & DIPERBAIKI:** render JSX `resultCard` masih
         hardcode ke konstanta statis `STATUS_CODE`/`RESPONSE_LABEL`,
         bukan ke state `resultMethod`/`resultStatus`/`resultLabel`
         yang di-set oleh `morph()` — akibatnya teaser method
         GET→POST→PUT→PATCH→DELETE TIDAK PERNAH terlihat secara visual meskipun
         timeline & state-nya jalan benar. Diperbaiki: kedua baris teks
         `resultCard` sekarang pakai `{resultMethod} {resultStatus}` /
         `{resultLabel}` @done

7.4. Duration Budget
  7.4.1. Total: 11+10+13+11+9 = 54 detik (target asli ±45–55s) @done

7.5. QA
  7.5.1. Dokumentasi Phase 7 di-append ke file ini @done
  7.5.2. Re-run `npx esbuild` compile check — lolos 0 error @done
  7.5.3. Audit SFX_MAP: entry yang dipakai teaser (POP2, CHIME, TICK)
         terkonfirmasi terpanggil di `Animation.jsx` @done
  7.5.4. TODO — preview manual di dev server (browser) untuk validasi
         visual morph benar-benar berubah setelah fix §7.3.3
  7.5.5. TODO — export MP4 test
