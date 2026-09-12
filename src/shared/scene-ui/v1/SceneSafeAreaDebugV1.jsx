// src/shared/scene-ui/v1/SceneSafeAreaDebugV1.jsx
//
// Overlay development untuk melihat batas zona layout (header/navigator/body/
// transit/service/closing) SEBELUM masalah overlap ketahuan lewat preview —
// lihat docs/plan/PLAN-12-SHARED-SCENE-COMPONENTS-V1.md §10 untuk kontrak.
//
// TIDAK PERNAH aktif di production/export: render mengembalikan null kecuali
// prop `debug` true DAN import.meta.env.DEV true. Tidak memakai window/DOM
// measurement (aman dipanggil kapan saja, termasuk saat export seek). Tidak
// pernah mengubah posisi content — murni overlay tambahan di atasnya.
//
// VERSIONING: bagian dari kontrak V1 (lihat README.md folder ini).

import React from 'react'
import { DEFAULT_LAYOUT_V1, getZones } from './PortraitSceneLayoutV1'

const ZONE_STYLE = {
  header:    { fill: '#38BDF8', label: 'header' },
  navigator: { fill: '#FBBF24', label: 'navigator' },
  body:      { fill: 'none',    label: 'body' }, // digambar terpisah, lebih presisi (ada x bound)
  transit:   { fill: '#A78BFA', label: 'transit' },
  service:   { fill: '#FB923C', label: 'service' },
  closing:   { fill: '#34D399', label: 'closing' },
}

/**
 * SceneSafeAreaDebugV1 — lihat PLAN-12 §10 untuk kontrak lengkap.
 *
 * @param {object} [layout] default DEFAULT_LAYOUT_V1.
 * @param {boolean} [debug] default false — WAJIB true + import.meta.env.DEV supaya render.
 */
export default function SceneSafeAreaDebugV1({
  layout = DEFAULT_LAYOUT_V1,
  debug = false,
}) {
  // Guard ganda: prop debug DAN dev environment. Ini yang menjamin overlay
  // TIDAK PERNAH ikut ter-render di build production/export (lihat §10 plan).
  if (!debug || !import.meta.env?.DEV) return null

  const zones = getZones(layout)
  const bandKeys = ['header', 'navigator', 'closing']
  const corridorKeys = ['transit', 'service']

  return (
    <g pointerEvents="none">
      {bandKeys.map((key) => {
        const z = zones[key]
        const style = ZONE_STYLE[key]
        return (
          <g key={key}>
            <rect x={0} y={z.yStart} width={layout.canvas.width} height={z.yEnd - z.yStart}
              fill={style.fill} opacity={0.08} stroke={style.fill} strokeOpacity={0.4} strokeDasharray="4 4" />
            <text x={4} y={z.yStart + 12} fill={style.fill} fontSize={10} fontFamily="monospace">
              {style.label} (y {z.yStart}–{z.yEnd})
            </text>
          </g>
        )
      })}

      {/* body box — digambar presisi pakai x/width asli, bukan full-canvas band */}
      <rect x={layout.body.x} y={layout.body.y} width={layout.body.width} height={layout.body.height}
        fill="none" stroke="#22D3EE" strokeOpacity={0.6} strokeDasharray="6 3" strokeWidth={1.5} />
      <text x={layout.body.x + 4} y={layout.body.y + 14} fill="#22D3EE" fontSize={10} fontFamily="monospace">
        body (x {layout.body.x}, y {layout.body.y}, {layout.body.width}×{layout.body.height})
      </text>

      {/* transit & service — corridor DI DALAM body x-range, bukan full width */}
      {corridorKeys.map((key) => {
        const z = zones[key]
        const style = ZONE_STYLE[key]
        return (
          <g key={key}>
            <rect x={layout.body.x} y={z.yStart} width={layout.body.width} height={z.yEnd - z.yStart}
              fill={style.fill} opacity={0.06} stroke={style.fill} strokeOpacity={0.35} strokeDasharray="2 4" />
            <text x={layout.body.x + 4} y={z.yStart + 12} fill={style.fill} fontSize={10} fontFamily="monospace">
              {style.label} (y {z.yStart}–{z.yEnd})
            </text>
          </g>
        )
      })}
    </g>
  )
}
