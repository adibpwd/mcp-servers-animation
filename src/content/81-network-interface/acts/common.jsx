// src/content/81-network-interface/acts/common.jsx
// ─────────────────────────────────────────────────────────────
// Helper bersama untuk file per-act (pola "1 act = 1 file", lihat
// docs/standardizations/07-act-scene-pattern.md).
//
// Kontrak:
//   • Tiap komponen act (Act1..Act6) PURE presentational — tanpa GSAP,
//     tanpa React state, tanpa SFX.
//   • Satu prop `state` (object, semua field opsional/null-safe) — dikirim
//     live dari Animation.jsx, atau kosong → mode "summary" (§3
//     07-act-scene-pattern.md), dipakai sebagai intro background (bg/bgScenes).
//   • `origin` (default {0,0}) translate wrapper — live di dalam
//     ContentBodyV1 origin selalu {0,0} (body sudah translate sendiri);
//     intro background (bgOrigin) pakai layout.body lewat IntroHeaderMorphV1.
//
// Semua koordinat body-local (0,0 = pojok kiri-atas ContentBodyV1),
// SAMA PERSIS dengan nomor yang sebelumnya inline di Animation.jsx —
// tidak ada angka yang diubah saat migrasi (lihat revisi/2026-09-21-
// revisi-01-selaras-standar-act-scene.md §2.1).
// ─────────────────────────────────────────────────────────────

import React from 'react'
import { COLORS, ANCHOR_POS } from '../data'

// ── Icon set — SVG inline 24x24 viewBox, stroke-based, tanpa fill (kecuali
// disebutkan), konsisten style di semua Act. `size` px, `color` warna
// stroke. Dipetakan ke tiap ConceptCard via prop `icon` (revisi-03, lihat
// revisi/2026-09-22-revisi-03-*.md). ──
const iconSvgProps = { fill: 'none', strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }

export function IconEthernet({ size = 16, color = COLORS.WIRED }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...iconSvgProps}>
      <path d="M6 2v4M10 2v4M6 6h12v6H6z" />
      <path d="M4 12h16v7a2 2 0 01-2 2H6a2 2 0 01-2-2z" />
      <path d="M9 21v-3M15 21v-3" />
    </svg>
  )
}

export function IconWifi({ size = 16, color = COLORS.WIFI }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...iconSvgProps}>
      <path d="M2 8.5a15.3 15.3 0 0120 0" />
      <path d="M5.5 12.5a10.3 10.3 0 0113 0" />
      <path d="M9 16.5a5.3 5.3 0 016 0" />
      <circle cx="12" cy="20" r="1.2" fill={color} stroke="none" />
    </svg>
  )
}

export function IconLoopback({ size = 16, color = COLORS.LOOPBACK }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...iconSvgProps}>
      <path d="M4 12a8 8 0 1116 0 8 8 0 01-16 0z" />
      <path d="M12 7.5V12l3 2.5" />
    </svg>
  )
}

export function IconLink({ size = 16, color = COLORS.LINK }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...iconSvgProps}>
      <path d="M9.5 14.5L14.5 9.5" />
      <path d="M11 6.5l1.7-1.7a3.6 3.6 0 015 5L16 11.5" />
      <path d="M13 17.5l-1.7 1.7a3.6 3.6 0 01-5-5L8 12.5" />
    </svg>
  )
}

export function IconMac({ size = 16, color = COLORS.MAC }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...iconSvgProps}>
      <rect x="3" y="6" width="18" height="12" rx="2" />
      <path d="M7 10.5h2M11 10.5h2M15 10.5h2M7 14h6" />
    </svg>
  )
}

export function IconIp({ size = 16, color = COLORS.IP }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...iconSvgProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a13.5 13.5 0 010 18M12 3a13.5 13.5 0 000 18" />
    </svg>
  )
}

export function IconConfig({ size = 16, color = COLORS.CONFIG }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...iconSvgProps}>
      <circle cx="12" cy="12" r="3" />
      <path d="M12 3v2.2M12 18.8V21M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M3 12h2.2M18.8 12H21M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6" />
    </svg>
  )
}

export function IconRoute({ size = 16, color = COLORS.ROUTE }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...iconSvgProps}>
      <circle cx="6" cy="19" r="2.5" />
      <circle cx="18" cy="5" r="2.5" />
      <path d="M6 16.5V13a4 4 0 014-4h4" />
      <path d="M15.5 6l3-1.5L15.5 3" />
    </svg>
  )
}

export function IconDns({ size = 16, color = COLORS.DNS }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...iconSvgProps}>
      <path d="M4 4h13l3 3v13H4z" />
      <path d="M4 4v16" />
      <path d="M8 9h8M8 13h8M8 17h5" />
    </svg>
  )
}

export function IconName({ size = 16, color = COLORS.TEXT }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...iconSvgProps}>
      <path d="M3 7a2 2 0 012-2h7l9 9-9 9-9-9z" />
      <circle cx="8" cy="9" r="1.3" fill={color} stroke="none" />
    </svg>
  )
}

export function IconBridge({ size = 16, color = COLORS.VIRTUAL }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...iconSvgProps}>
      <circle cx="5" cy="12" r="3" />
      <circle cx="19" cy="12" r="3" />
      <path d="M8 12h8" />
    </svg>
  )
}

export function IconVlan({ size = 16, color = COLORS.VIRTUAL }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...iconSvgProps}>
      <path d="M12 3l9 5-9 5-9-5z" />
      <path d="M3 13l9 5 9-5" />
    </svg>
  )
}

export function IconVpn({ size = 16, color = COLORS.VIRTUAL }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...iconSvgProps}>
      <path d="M12 3l7 3.5v5c0 4.5-3 7.2-7 8.5-4-1.3-7-4-7-8.5v-5z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  )
}

export function IconContainer({ size = 16, color = COLORS.VIRTUAL }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" stroke={color} {...iconSvgProps}>
      <path d="M12 3l8 4.5v9L12 21l-8-4.5v-9z" />
      <path d="M4 7.5L12 12l8-4.5M12 12v9" />
    </svg>
  )
}



/** Bungkus scene act dengan origin translate (default {0,0}, no-op). */
export function withOrigin(children, origin = { x: 0, y: 0 }) {
  if (!origin || (origin.x === 0 && origin.y === 0)) return children
  return <g transform={`translate(${origin.x}, ${origin.y})`}>{children}</g>
}

// ── CaptionBar — narasi transisi pendek, dipakai di setiap Act. ──
export const CaptionBar = ({ text, color }) => {
  if (!text) return null
  return (
    <g transform="translate(366 60)">
      <rect x="-300" y="-24" width="600" height="48" rx="22" fill={COLORS.PANEL} stroke={color || COLORS.BORDER} strokeWidth="1.5" opacity="0.96" />
      <text x="0" y="6" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="13.5" fill={COLORS.TEXT}>{text}</text>
    </g>
  )
}

// ── ConceptCard — kartu konsep serbaguna dipakai lintas Act. Semua item
// selalu dirender (tidak ada detail disembunyikan), hanya sorotan
// (active/dim) yang berpindah. `icon` opsional (komponen Icon*, revisi-03) —
// kalau ada, label+desc digeser turun untuk kasih ruang icon di atas. ──
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

// ── ConnLine — garis penghubung antar node/card, dashed by default. ──
export const ConnLine = ({ x1, y1, x2, y2, color, dashed = true, opacity = 0.7, width = 2 }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width}
    strokeDasharray={dashed ? '6 5' : undefined} opacity={opacity} />
)

// ── ProgressDot — titik paket bergerak sepanjang segmen, progress 0..1. ──
export const ProgressDot = ({ x1, y1, x2, y2, progress, color }) => {
  if (progress <= 0) return null
  const x = x1 + (x2 - x1) * progress
  const y = y1 + (y2 - y1) * progress
  return <circle cx={x} cy={y} r={7} fill={color} />
}

// ── AnchorIcon — persistent "eth0" (Act 1 settle → Act 5), interface
// fisik yang jadi fokus cerita sejak dipilih dari 3 jenis di Act 1. ──
export const AnchorIcon = ({ visible, glow, label = 'eth0' }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${ANCHOR_POS.x} ${ANCHOR_POS.y})`}>
      {glow > 0 && (
        <circle r="46" fill="none" stroke={COLORS.WIRED} strokeWidth="1.4" opacity={glow * 0.5}>
          <animate attributeName="r" values="40;54;40" dur="1.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0;0.4" dur="1.6s" repeatCount="indefinite" />
        </circle>
      )}
      <rect x="-52" y="-36" width="104" height="72" rx="12" fill={COLORS.PANEL} stroke={COLORS.WIRED} strokeWidth="2.2" />
      <g transform="translate(-10, -20)">
        <IconEthernet size={20} color={COLORS.WIRED} />
      </g>
      <text x="0" y="24" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="13" fill={COLORS.WIRED}>{label}</text>
    </g>
  )
}
