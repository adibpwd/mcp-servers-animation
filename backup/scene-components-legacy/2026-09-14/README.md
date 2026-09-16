# Legacy Scene Components — Arsip 2026-09-14

Status: **arsip, bukan source aktif**. Jangan import dari folder ini.

Konteks: [PLAN-18-KONSOLIDASI-REUSABLE-SCENE-COMPONENTS-V1](../../../docs/plan/PLAN-18-KONSOLIDASI-REUSABLE-SCENE-COMPONENTS-V1.md)

Lima component scene generasi lama ini dipindahkan dari `src/components/`
karena bukan API reusable V1 (`src/shared/scene-ui/v1/`) dan tidak boleh
dipilih untuk content baru.

## Asal path

| File | Asal path |
|---|---|
| `AnimatedCounter.jsx` | `src/components/AnimatedCounter.jsx` |
| `LineTracer.jsx` | `src/components/LineTracer.jsx` |
| `MCPAnimation.jsx` | `src/components/MCPAnimation.jsx` |
| `NetworkDiagram.jsx` | `src/components/NetworkDiagram.jsx` |
| `NodeGlow.jsx` | `src/components/NodeGlow.jsx` |

## Alasan pindah

- `AnimatedCounter.jsx` — component animasi DOM dengan GSAP internal; bukan
  primitive portrait/pure-presentation V1.
- `LineTracer.jsx` — memiliki lifecycle GSAP internal dan contract link
  khusus; bukan chrome/layout scene.
- `MCPAnimation.jsx` — scene MCP penuh dan domain-specific, bukan reusable
  foundation lintas topic.
- `NetworkDiagram.jsx` — diagram D3 domain-specific dengan
  dependency/config sendiri; bukan primitive V1.
- `NodeGlow.jsx` — efek GSAP internal legacy; tidak sesuai kontrak V1 yang
  dikendalikan topic.

## Catatan penting

- File di sini **tidak boleh** dijadikan alias import baru untuk content aktif.
- Audit consumer lama di `src/content` yang mungkin masih mengimpor file-file
  ini adalah tugas plan/agent migrasi terpisah (di luar scope PLAN-18).
- Jangan hapus file ini sebelum agent migrasi menyelesaikan setiap consumer
  dan preview yang relevan.
