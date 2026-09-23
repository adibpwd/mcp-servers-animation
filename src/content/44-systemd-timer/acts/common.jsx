// src/content/44-systemd-timer/acts/common.jsx
// ─────────────────────────────────────────────────────────────
// Helper bersama untuk file per-act (pola "1 act = 1 file", lihat
// docs/standardizations/07-act-scene-pattern.md).
//
// Kontrak:
//   • Tiap komponen act (Act1..Act4) PURE presentational — tanpa GSAP,
//     tanpa React state, tanpa SFX.
//   • Satu prop `state` (object, semua field opsional/null-safe) — dikirim
//     live dari Animation.jsx, atau kosong → mode "summary" (§3
//     07-act-scene-pattern.md), dipakai sebagai intro background (bg/bgScenes).
//   • `origin` (default {0,0}) translate wrapper — live di dalam
//     ContentBodyV1 origin selalu {0,0}; intro background (bgOrigin) pakai
//     layout.body lewat IntroHeaderMorphV1.
//
// Semua koordinat body-local (0,0 = pojok kiri-atas ContentBodyV1).
// ─────────────────────────────────────────────────────────────

import React from 'react'
import { COLORS, ANCHOR_POS } from '../data'

const iconSvgProps = { fill: 'none', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }

export function IconGear({ size = 16, color = COLORS.SYSTEMD }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...iconSvgProps}>
      <circle cx="12" cy="12" r="3.4" />
      <path d="M12 3v3M12 18v3M3 12h3M18 12h3M5.6 5.6l2.1 2.1M16.3 16.3l2.1 2.1M5.6 18.4l2.1-2.1M16.3 7.7l2.1-2.1" />
    </svg>
  )
}

export function IconTimer({ size = 16, color = COLORS.TIMER }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...iconSvgProps}>
      <circle cx="12" cy="13" r="8" />
      <path d="M12 9v4l3 2M9 2h6" />
    </svg>
  )
}

export function IconService({ size = 16, color = COLORS.SERVICE }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...iconSvgProps}>
      <path d="M6 3h9l3 3v15H6z" />
      <path d="M9 11l2 2-2 2M13 15h2" />
    </svg>
  )
}

export function IconPower({ size = 16, color = COLORS.RISK }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...iconSvgProps}>
      <path d="M12 3v8" />
      <path d="M6.5 6.5a8 8 0 1 0 11 0" />
    </svg>
  )
}

export function IconScatter({ size = 16, color = COLORS.WARNING }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...iconSvgProps}>
      <rect x="3" y="4" width="7" height="6" rx="1.5" />
      <rect x="14" y="7" width="7" height="6" rx="1.5" />
      <rect x="7" y="15" width="7" height="6" rx="1.5" />
    </svg>
  )
}

export function IconQuestion({ size = 16, color = COLORS.MUTED }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...iconSvgProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M9.5 9.5a2.5 2.5 0 1 1 3.7 2.2c-.9.6-1.2 1.1-1.2 2.1" />
      <circle cx="12" cy="17.3" r="0.4" fill={color} stroke="none" />
    </svg>
  )
}

export function IconArrowRight({ size = 16, color = COLORS.SYSTEMD }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...iconSvgProps}>
      <path d="M4 12h16M14 6l6 6-6 6" />
    </svg>
  )
}

export function IconBoot({ size = 16, color = COLORS.TIMER }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...iconSvgProps}>
      <path d="M12 3v8" />
      <path d="M6.5 6.5a8 8 0 1 0 11 0" />
      <path d="M9 21h6" />
    </svg>
  )
}

export function IconReplay({ size = 16, color = COLORS.SUCCESS }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...iconSvgProps}>
      <path d="M4 10a8 8 0 1 1 2 5.3" />
      <path d="M4 4v6h6" />
    </svg>
  )
}

export function IconTerminal({ size = 16, color = COLORS.SYSTEMD }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...iconSvgProps}>
      <rect x="3" y="4" width="18" height="16" rx="2" />
      <path d="M7 9l3 3-3 3M12 15h5" />
    </svg>
  )
}

export function IconJournal({ size = 16, color = COLORS.SYSTEMD }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...iconSvgProps}>
      <path d="M6 3h9l3 3v15H6z" />
      <path d="M9 12h6M9 16h6M9 8h3" />
    </svg>
  )
}

/** Bungkus scene act dengan origin translate (default {0,0}, no-op). */
export function withOrigin(children, origin = { x: 0, y: 0 }) {
  if (!origin || (origin.x === 0 && origin.y === 0)) return children
  return <g transform={`translate(${origin.x}, ${origin.y})`}>{children}</g>
}

export const CaptionBar = ({ text, color }) => {
  if (!text) return null
  return (
    <g transform="translate(366 60)">
      <rect x="-300" y="-24" width="600" height="48" rx="22" fill={COLORS.PANEL} stroke={color || COLORS.BORDER} strokeWidth="1.5" opacity="0.96" />
      <text x="0" y="6" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="13.5" fill={COLORS.TEXT}>{text}</text>
    </g>
  )
}

export const ConceptCard = ({ x, y, w = 150, h = 64, icon: Icon, label, desc, color, active = true, dim = false }) => {
  const iconSize = 16
  const iconCy = -h / 2 + 15
  const labelY = Icon ? -h / 2 + 33 : (desc && active ? -6 : 5)
  const descY = Icon ? -h / 2 + 45 : 15
  return (
    <g transform={`translate(${x} ${y})`} opacity={dim ? 0.4 : 1}>
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={12} fill={COLORS.PANEL}
        stroke={color} strokeWidth={active ? 2.2 : 1.3} opacity={active ? 1 : 0.6} />
      {Icon && (
        <g transform={`translate(${-iconSize / 2} ${iconCy - iconSize / 2})`}>
          <Icon size={iconSize} color={active ? color : COLORS.MUTED} />
        </g>
      )}
      <text x="0" y={labelY} textAnchor="middle" fontFamily="monospace" fontWeight="700"
        fontSize="12" fill={active ? color : COLORS.MUTED}>{label}</text>
      {desc && active && (
        <text x="0" y={descY} textAnchor="middle" fontFamily="monospace" fontSize="8.5" fill={COLORS.MUTED}>{desc}</text>
      )}
    </g>
  )
}

export const ConnLine = ({ x1, y1, x2, y2, color, dashed = true, opacity = 0.7, width = 2 }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width}
    strokeDasharray={dashed ? '6 5' : undefined} opacity={opacity} />
)

/** AnchorIcon — persistent "systemd" (Act 1 settle → Act 3). */
export const AnchorIcon = ({ visible, glow, label = 'systemd' }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${ANCHOR_POS.x} ${ANCHOR_POS.y})`}>
      {glow > 0 && (
        <circle r="46" fill="none" stroke={COLORS.SYSTEMD} strokeWidth="1.4" opacity={glow * 0.5}>
          <animate attributeName="r" values="40;54;40" dur="1.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0;0.4" dur="1.6s" repeatCount="indefinite" />
        </circle>
      )}
      <rect x="-52" y="-36" width="104" height="72" rx="12" fill={COLORS.PANEL} stroke={COLORS.SYSTEMD} strokeWidth="2.2" />
      <g transform="translate(-10, -20)">
        <IconGear size={20} color={COLORS.SYSTEMD} />
      </g>
      <text x="0" y="24" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="13" fill={COLORS.SYSTEMD}>{label}</text>
    </g>
  )
}
