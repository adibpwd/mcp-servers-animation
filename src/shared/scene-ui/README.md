# scene-ui — Shared Scene Components

Primitive SVG reusable untuk chrome/layout scene portrait (intro hero →
header, Act badge + dot navigator, content body). Cerita, icon, card,
object, request flow, GSAP timeline, dan data tetap milik masing-masing
topic — folder ini HANYA menyediakan layout/chrome.

Rencana & rationale lengkap: `docs/plan/PLAN-12-SHARED-SCENE-COMPONENTS-V1.md`.
Safe-zone contract terkait: `docs/standardizations/03-planning-storytelling-quality-gate.md`
§ Safe-Zone Layout Contract.

## Status

Opt-in only. Topic existing TIDAK disentuh oleh keberadaan folder ini.
Migrasi topic lama ke scene-ui perlu plan & preview terpisah (lihat PLAN-12
§3.4 dan Tahap D).

## Isi `v1/`

| File | Tanggung jawab |
|---|---|
| `PortraitSceneLayoutV1.js` | token canvas/zona (820×1340) + helper koordinat murni |
| `IntroHeaderMorphV1.jsx` | hero title (tengah) → compact header (kiri-atas), interpolasi dari `progress`. Prop opsional `titleLines` (array of segment-array) buat title hero yang kepanjangan untuk 1 baris — hero jadi multi-baris lalu crossfade ke `titleSegments` 1-baris saat morph ke header (lihat contoh `22-oauth2-delegated-login`) |
| `ActBadgeNavigatorV1.jsx` | Act badge kiri + dot navigator kanan |
| `ContentBodyV1.jsx` | boundary content di bawah badge, optional clip + local coordinate |
| `SceneChromeV1.jsx` | composer ringan: intro + navigator + content dalam satu urutan |
| `SceneSafeAreaDebugV1.jsx` | overlay dev-only untuk melihat batas zona (tidak pernah aktif production/export) |
| `index.js` | named exports stabil |

## Prinsip inti (ringkas — detail di PLAN-12 §3)

- **Pure presentation.** Tidak ada GSAP/state/SFX di dalam component. Topic
  yang punya timeline; component hanya merender `progress`/`activeIndex`/dsb
  yang dikirim tiap frame.
- **Layout token tunggal.** Koordinat standar (`DEFAULT_LAYOUT_V1`) tidak
  disalin ulang ke tiap topic.
- **Explicit versioning.** Semua nama file & import mengandung `V1`. Breaking
  change → folder `v2/` baru, `v1/` tidak diubah.
- **Body origin lokal.** Semua children `ContentBodyV1` pakai local
  coordinate (0,0 = `body.x`, `body.y`); jangan pernah menaruh y 100–200
  langsung di children — itu wilayah header/navigator, bukan body.

## Quick Start

```jsx
import {
  SceneChromeV1, DEFAULT_LAYOUT_V1,
} from '../../shared/scene-ui/v1'

// di dalam <svg viewBox="0 0 820 1340" ...> topic:
<SceneChromeV1
  layout={DEFAULT_LAYOUT_V1}
  debug={false} // set true sementara saat development untuk lihat safe-zone
  intro={{
    progress: morphP, // 0..1, dari GSAP topic
    category: 'NETWORKING · ADIB-DEV.COM',
    titleSegments: [
      { label: 'REST', color: COLORS.CRYPTO },
      { label: 'API', color: COLORS.SUCCESS },
    ],
    subtitle: 'Alamat dan cara bicara yang disepakati bersama',
  }}
  showNavigator={!showIntro}
  navigator={{ phases: PHASES, activeIndex: phaseIdx }}
  showContent={!showIntro}
  content={{
    render: (w, h) => (
      <>
        <rect width={w} height={52} rx={14} fill={COLORS.PANEL} />
        {/* ...content topic pakai local coordinate (0,0 = body origin)... */}
      </>
    ),
  }}
/>
```

Atau pakai primitive satu-satu (untuk topic yang butuh variasi urutan/layout):

```jsx
import {
  IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1,
} from '../../shared/scene-ui/v1'
```

## Aturan Versioning (ringkas — detail di PLAN-12 §11)

**Boleh diubah di V1 (non-breaking):**
- perbaikan bug yang tidak mengubah output layout terkontrak
- perbaikan accessibility
- internal refactor
- prop optional baru dengan default yang mempertahankan output lama
- warning development baru

**Wajib jadi `v2/` baru (breaking):**
- mengubah default coordinate zona (`DEFAULT_LAYOUT_V1`)
- mengubah struktur props wajib
- mengubah default dot/badge sampai visual topic V1 existing berubah
- mengganti model `titleSegments`
- mengubah body origin atau coordinate model
- menambah behaviour timeline/GSAP ke component yang sebelumnya pure

Kalau butuh V2: buat `src/shared/scene-ui/v2/` paralel. `v1/` tetap
dipertahankan sampai topic yang bergantung padanya dimigrasi dengan rencana
dan preview tersendiri — jangan edit file `v1/` untuk breaking change.

## Non-Goals (lihat PLAN-12 §12)

Folder ini SENGAJA tidak menyediakan component untuk: card user/profile,
request/response packet, API Service Hub, icon/avatar, resource cabinet,
generic GSAP master timeline, SFX trigger, atau storytelling Act — semua itu
sangat domain-specific per topic.
