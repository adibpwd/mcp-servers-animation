// src/content/35-cron-job/acts/common.jsx
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

import React, { useId } from 'react'
import { COLORS, ANCHOR_POS } from '../data'

const iconSvgProps = { fill: 'none', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }

export function IconClock({ size = 16, color = COLORS.CRON }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...iconSvgProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3.5 2" />
    </svg>
  )
}

export function IconDaemon({ size = 16, color = COLORS.CRON }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...iconSvgProps}>
      <rect x="4" y="4" width="16" height="16" rx="3" />
      <path d="M8 12h8M12 8v8" />
    </svg>
  )
}

export function IconList({ size = 16, color = COLORS.CRON }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...iconSvgProps}>
      <path d="M8 6h12M8 12h12M8 18h12" />
      <circle cx="4" cy="6" r="1.3" fill={color} stroke="none" />
      <circle cx="4" cy="12" r="1.3" fill={color} stroke="none" />
      <circle cx="4" cy="18" r="1.3" fill={color} stroke="none" />
    </svg>
  )
}

export function IconWildcard({ size = 16, color = COLORS.WILDCARD }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...iconSvgProps}>
      <path d="M12 4v16M5 8l14 8M19 8L5 16" />
    </svg>
  )
}

export function IconFixed({ size = 16, color = COLORS.FIELD }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...iconSvgProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M10 8h2v8" />
    </svg>
  )
}

export function IconFork({ size = 16, color = COLORS.WORKER }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...iconSvgProps}>
      <circle cx="6" cy="6" r="2.5" />
      <circle cx="6" cy="18" r="2.5" />
      <circle cx="18" cy="12" r="2.5" />
      <path d="M8 7l8 4M8 17l8-4" />
    </svg>
  )
}

export function IconScript({ size = 16, color = COLORS.JOB }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...iconSvgProps}>
      <path d="M6 3h9l3 3v15H6z" />
      <path d="M9 11l2 2-2 2M13 15h2" />
    </svg>
  )
}

export function IconLogFile({ size = 16, color = COLORS.LOG }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...iconSvgProps}>
      <path d="M6 3h9l3 3v15H6z" />
      <path d="M9 12h6M9 16h6M9 8h3" />
    </svg>
  )
}

export function IconVoid({ size = 16, color = COLORS.RISK }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...iconSvgProps}>
      <circle cx="12" cy="12" r="9" strokeDasharray="2 3" />
      <path d="M9 9l6 6M15 9l-6 6" />
    </svg>
  )
}


/** Bungkus scene act dengan origin translate (default {0,0}, no-op). */
export function withOrigin(children, origin = { x: 0, y: 0 }) {
  if (!origin || (origin.x === 0 && origin.y === 0)) return children
  return <g transform={`translate(${origin.x}, ${origin.y})`}>{children}</g>
}

// ── REVISI-01: CaptionBar statis (y=60, jauh dari elemen aktif) DIHAPUS —
// diganti NearElementCaption (chip kontekstual, menempel dekat elemen yang
// sedang disorot) dan FlowLine (garis alur berarah, dipakai Act 1 untuk
// motion sekuensial jam → crond → job). Lihat
// revisi/2026-09-23-revisi-01-flowchart-multicase-dynamic-caption.md ──

/** Chip caption kontekstual, menempel dekat (x,y) elemen yang disorot. */
export const NearElementCaption = ({ x, y, text, color, anchor = 'above', visible = true }) => {
  if (!visible || !text) return null
  const dy = anchor === 'above' ? -34 : 34
  const w = Math.max(150, Math.min(360, text.length * 6.6 + 28))
  return (
    <g transform={`translate(${x} ${y + dy})`}>
      <rect x={-w / 2} y="-16" width={w} height="32" rx="16" fill={COLORS.PANEL}
        stroke={color || COLORS.BORDER} strokeWidth="1.4" opacity="0.96" />
      <text x="0" y="5" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="10.5" fill={COLORS.TEXT}>{text}</text>
    </g>
  )
}

/** Garis alur berarah (flowchart), `progress` 0..1 untuk motion sekuensial. */
export const FlowLine = ({ x1, y1, x2, y2, color, dashed = false, opacity = 0.9, width = 2.4, arrow = true, progress = 1 }) => {
  const uid = useId()
  const markerId = `flow-arrow-${uid}`
  if (progress <= 0) return null
  const p = Math.min(1, progress)
  const px = x1 + (x2 - x1) * p
  const py = y1 + (y2 - y1) * p
  return (
    <g opacity={opacity}>
      {arrow && (
        <defs>
          <marker id={markerId} markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill={color} />
          </marker>
        </defs>
      )}
      <line x1={x1} y1={y1} x2={px} y2={py} stroke={color} strokeWidth={width}
        strokeDasharray={dashed ? '6 5' : undefined}
        markerEnd={arrow && p > 0.05 ? `url(#${markerId})` : undefined} />
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

/** AnchorIcon — persistent "crond" (Act 1 settle → Act 3). */
export const AnchorIcon = ({ visible, glow, label = 'crond' }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${ANCHOR_POS.x} ${ANCHOR_POS.y})`}>
      {glow > 0 && (
        <circle r="46" fill="none" stroke={COLORS.CRON} strokeWidth="1.4" opacity={glow * 0.5}>
          <animate attributeName="r" values="40;54;40" dur="1.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0;0.4" dur="1.6s" repeatCount="indefinite" />
        </circle>
      )}
      <rect x="-52" y="-36" width="104" height="72" rx="12" fill={COLORS.PANEL} stroke={COLORS.CRON} strokeWidth="2.2" />
      <g transform="translate(-10, -20)">
        <IconDaemon size={20} color={COLORS.CRON} />
      </g>
      <text x="0" y="24" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="13" fill={COLORS.CRON}>{label}</text>
    </g>
  )
}
