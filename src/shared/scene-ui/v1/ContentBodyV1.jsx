// src/shared/scene-ui/v1/ContentBodyV1.jsx
//
// Boundary tunggal untuk content utama setelah Act badge — lihat
// docs/plan/PLAN-12-SHARED-SCENE-COMPONENTS-V1.md §8 untuk kontrak lengkap.
//
// PURE PRESENTATIONAL — tidak tahu browser/server/card/icon/flowchart milik
// topic. Hanya menyediakan origin (body.x/body.y), dimensi local, dan
// opsional clip-path + debug boundary.
//
// VERSIONING: bagian dari kontrak V1. Mengubah body origin/coordinate model
// adalah breaking change — WAJIB jadi V2 baru (src/shared/scene-ui/v2/),
// bukan edit file ini.

import React, { useId } from 'react'
import { DEFAULT_LAYOUT_V1, warnIfOutsideZone } from './PortraitSceneLayoutV1'

const normalizePadding = (padding) => {
  if (padding == null) return { top: 0, right: 0, bottom: 0, left: 0 }
  if (typeof padding === 'number') return { top: padding, right: padding, bottom: padding, left: padding }
  return { top: 0, right: 0, bottom: 0, left: 0, ...padding }
}

/**
 * ContentBodyV1 — lihat PLAN-12 §8 untuk kontrak lengkap.
 *
 * @param {React.ReactNode} [children] SVG content topic (local coordinate).
 * @param {(w:number,h:number,toCanvasX:(x:number)=>number,toCanvasY:(y:number)=>number)=>React.ReactNode} [render]
 *        alternatif dari children — dipakai kalau topic butuh width/height body sebagai input layout.
 * @param {object} [layout] default DEFAULT_LAYOUT_V1.
 * @param {boolean} [visible] default true.
 * @param {boolean} [clip] default false — true hanya kalau topic sengaja menahan overflow.
 * @param {number|{top?,right?,bottom?,left?}} [padding] optional inset body.
 * @param {string} [debugName] label overlay development.
 */
export default function ContentBodyV1({
  children,
  render,
  layout = DEFAULT_LAYOUT_V1,
  visible = true,
  clip = false,
  padding,
  debugName,
}) {
  const rawId = useId()
  const clipId = `content-body-v1-clip-${rawId.replace(/[:]/g, '')}`
  const pad = normalizePadding(padding)

  const originX = layout.body.x + pad.left
  const originY = layout.body.y + pad.top
  const width = Math.max(0, layout.body.width - pad.left - pad.right)
  const height = Math.max(0, layout.body.height - pad.top - pad.bottom)

  if (import.meta.env?.DEV) {
    warnIfOutsideZone(
      debugName || 'ContentBodyV1',
      layout.body.y, layout.body.y + layout.body.height,
      { yStart: layout.navigator.y + layout.navigator.height, yEnd: layout.canvas.height },
    )
    if (!children && !render) {
      // eslint-disable-next-line no-console
      console.warn('[scene-ui v1] ContentBodyV1: tidak ada "children" maupun "render" — body kosong (lihat PLAN-12 §8).')
    }
  }

  const toCanvasX = (localX) => originX + localX
  const toCanvasY = (localY) => originY + localY

  return (
    <g opacity={visible ? 1 : 0} transform={`translate(${originX}, ${originY})`} data-testid={debugName}>
      {clip && (
        <defs>
          <clipPath id={clipId}>
            <rect x={0} y={0} width={width} height={height} />
          </clipPath>
        </defs>
      )}
      <g clipPath={clip ? `url(#${clipId})` : undefined}>
        {render ? render(width, height, toCanvasX, toCanvasY) : children}
      </g>
    </g>
  )
}
