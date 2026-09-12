// src/shared/scene-ui/v1/ActBadgeNavigatorV1.jsx
//
// Act badge (kiri) + dot navigator (kanan), mengikuti pola Tailscale — lihat
// docs/plan/PLAN-12-SHARED-SCENE-COMPONENTS-V1.md §7 untuk kontrak lengkap.
//
// PURE PRESENTATIONAL — tidak mengubah activeIndex, tidak mengatur durasi Act,
// tidak menyimpan state. Topic tetap yang punya timeline/GSAP yang menaikkan
// activeIndex; component ini hanya merender hasilnya.
//
// VERSIONING: bagian dari kontrak V1. Mengubah default posisi/ukuran badge,
// default jumlah/spacing dot, atau struktur props wajib adalah breaking change
// — WAJIB jadi V2 baru (src/shared/scene-ui/v2/), bukan edit file ini.

import React from 'react'
import { DEFAULT_LAYOUT_V1, estimateTextWidth } from './PortraitSceneLayoutV1'

const DEFAULT_PANEL_COLOR = '#0F172A'   // konvensi PANEL
const DEFAULT_INACTIVE_DOT_COLOR = '#334155' // konvensi BORDER
const DEFAULT_MAX_LABEL_CHARS = 55

/**
 * ActBadgeNavigatorV1 — lihat PLAN-12 §7 untuk kontrak lengkap.
 *
 * @param {{id:string,badge:string,badgeColor:string,shortLabel?:string}[]} phases wajib.
 * @param {number} activeIndex   wajib. index Act aktif (0-based).
 * @param {object} [layout]      default DEFAULT_LAYOUT_V1.
 * @param {boolean} [visible]    default true.
 * @param {number} [maxLabelChars] default 55 — dev warning saja, tidak blocking.
 * @param {string} [ariaLabel]
 * @param {string} [testId]
 * @param {string} [panelColor]  default konvensi PANEL.
 * @param {string} [inactiveDotColor] default konvensi BORDER.
 */
export default function ActBadgeNavigatorV1({
  phases,
  activeIndex,
  layout = DEFAULT_LAYOUT_V1,
  visible = true,
  maxLabelChars = DEFAULT_MAX_LABEL_CHARS,
  ariaLabel = 'Act navigator',
  testId,
  panelColor = DEFAULT_PANEL_COLOR,
  inactiveDotColor = DEFAULT_INACTIVE_DOT_COLOR,
}) {
  const nav = layout.navigator
  const list = Array.isArray(phases) ? phases : []
  const active = list[activeIndex] || list[0] || { badge: '', badgeColor: '#94A3B8' }

  if (import.meta.env?.DEV) {
    if (list.length === 0) {
      // eslint-disable-next-line no-console
      console.warn('[scene-ui v1] ActBadgeNavigatorV1: "phases" kosong (lihat PLAN-12 §7).')
    }
    const badgeTextWidth = estimateTextWidth(active.badge || '', 13, { monospace: true })
    const badgeSafeWidth = nav.width - 40 - 16 // dikurangi start offset (40) + padding kanan
    if ((active.badge || '').length > maxLabelChars || badgeTextWidth > badgeSafeWidth) {
      // eslint-disable-next-line no-console
      console.warn(`[scene-ui v1] ActBadgeNavigatorV1: badge "${active.badge}" (~${Math.round(badgeTextWidth)}px) melebihi safe width badge (~${badgeSafeWidth}px) — pertimbangkan pakai shortLabel.`)
    }
    const lastDotX = nav.x + nav.dotsX + Math.max(0, list.length - 1) * nav.dotSpacing
    if (lastDotX > layout.canvas.width - 20) {
      // eslint-disable-next-line no-console
      console.warn(`[scene-ui v1] ActBadgeNavigatorV1: dot terakhir (x=${lastDotX}) mendekati/keluar tepi canvas (${layout.canvas.width}). Kurangi jumlah Act atau dotSpacing.`)
    }
  }

  return (
    <g
      opacity={visible ? 1 : 0}
      transform={`translate(${nav.x}, ${nav.y})`}
      role="img"
      aria-label={ariaLabel}
      data-testid={testId}
    >
      <rect
        width={nav.width} height={nav.height} rx={20}
        fill={panelColor} stroke={active.badgeColor} strokeWidth={1.8}
      />
      <circle cx={22} cy={nav.height / 2} r={6} fill={active.badgeColor} />
      <text
        x={40} y={nav.height / 2 + 6}
        fill={active.badgeColor} fontSize={13} fontFamily="monospace"
        fontWeight={700} letterSpacing={0.5}
      >
        {active.badge}
      </text>

      <g transform={`translate(${nav.dotsX}, ${nav.height / 2})`}>
        {list.map((ph, i) => {
          const isActive = i === activeIndex
          return (
            <circle
              key={ph.id ?? i}
              cx={i * nav.dotSpacing} cy={0}
              r={isActive ? nav.activeRadius : nav.inactiveRadius}
              fill={isActive ? active.badgeColor : inactiveDotColor}
              stroke={isActive ? '#fff' : 'none'}
              strokeWidth={isActive ? 1.5 : 0}
            />
          )
        })}
      </g>
    </g>
  )
}
