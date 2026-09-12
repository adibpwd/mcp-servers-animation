# Standardizations — Index

Dokumen di folder ini adalah standar wajib untuk membuat/mengubah topic
animasi di project ini. Baca sesuai alur di bawah — tiap file
mencantumkan juga "Alur baca lengkap" di headernya masing-masing supaya
bisa dibuka dari file manapun tanpa nyasar.

## Alur Baca Wajib (Topic Baru)

```
01-architecture
   → 02-standar-konten
      → 03-tutorial-buat-topic-baru
         → 04-referensi-gsap
            → 05-svg-text-guide
               → 06-icon-generation
                  → 08-audio-sfx-generation
                     → 09-standar-pembuatan-konten
```

`07-plan-single-service.md` dibaca terpisah, khusus saat menulis plan
untuk topic bertema "single service" (lihat isi file itu sendiri).

## Daftar File

| File | Isi |
|---|---|
| `01-architecture.md` | Bagaimana animasi bekerja: GSAP → React state → SVG → export, termasuk layer opsional scene-ui V1 (§8) |
| `02-standar-konten.md` | Kontrak folder topic (`Animation.jsx`/`data.js`/`manifest.js`), plan & revision traceability untuk topic kompleks (§10, termasuk field scene shell §10.1) |
| `03-tutorial-buat-topic-baru.md` | Tutorial step-by-step bikin topic baru, termasuk Langkah 0.5 "Pilih Scene Shell" |
| `04-referensi-gsap.md` | Referensi pola GSAP: easing, tween object, persistent anchor, request lifecycle, driving pure scene components (scene-ui V1) |
| `05-svg-text-guide.md` | Word wrap SVG, safe-zone/bounding box manual, dan Scene Zones V1 & local coordinate (scene-ui V1) |
| `06-icon-generation.md` | Pipeline generate & crop icon (ChatGPT/DALL-E), cross-reference penempatan icon di `ContentBodyV1` |
| `07-plan-single-service.md` | Template perencanaan topic single-service |
| `08-audio-sfx-generation.md` | Sourcing & integrasi aset audio SFX |
| `09-standar-pembuatan-konten.md` | Checklist pre-planning wajib & anti-pattern (§1.A–§1.S), termasuk kapan wajib pakai scene-ui V1 vs opt-out custom (§1.S) |

## Scene UI V1 — Kapan Baca yang Mana

Scene UI V1 (`src/shared/scene-ui/v1/`) adalah chrome layout default
(hero→header, Act badge + dot navigator, content boundary) untuk topic
portrait standar. Dokumentasi tersebar sesuai jenisnya, bukan satu file
besar:

| Butuh tahu... | Baca |
|---|---|
| Kapan WAJIB pakai V1 vs boleh opt-out custom | `09-standar-pembuatan-konten.md` §1.S |
| Langkah keputusan saat mulai topic baru | `03-tutorial-buat-topic-baru.md` Langkah 0.5 |
| Token layout (`DEFAULT_LAYOUT_V1`), local coordinate `ContentBodyV1` | `05-svg-text-guide.md` § "Scene Zones V1 dan Local Coordinates" |
| Cara topic men-drive `progress`/`activeIndex` dari GSAP | `04-referensi-gsap.md` § "Driving Pure Scene Components from Topic Timeline" |
| Field wajib di plan topic kompleks (scene shell, layout preset, dst) | `02-standar-konten.md` §10.1 |
| Diagram alur data → timeline → scene-ui V1 → SVG | `01-architecture.md` §8 |
| API lengkap tiap component (props, quick-start, aturan versioning V1→V2) | `src/shared/scene-ui/README.md` |
| Rationale & kontrak desain lengkap tiap component | `docs/plan/PLAN-12-SHARED-SCENE-COMPONENTS-V1.md` |
| Keputusan default/opt-out & rencana rollout ke standar ini | `docs/plan/PLAN-13-INTEGRASI-SCENE-UI-V1-KE-STANDAR.md` |
| Contoh migrasi topic existing ke V1 (pilot) | `docs/plan/PLAN-14-MIGRASI-PILOT-17-REST-API-KE-SCENE-UI-V1.md` |

## Referensi Lain

- `PROJECT_STRUCTURE.md` (root project) — struktur folder project & standar
  penomoran task hierarki unlimited yang dipakai di planning.
- `docs/plan/` — dokumen plan/keputusan (bukan standar final) yang jadi
  sumber sebagian isi standardizations ini setelah disetujui.
