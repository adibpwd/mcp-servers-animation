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
// (active/dim) yang berpindah. ──
export const ConceptCard = ({ x, y, w = 150, h = 64, label, desc, color, active = true, dim = false }) => (
  <g transform={`translate(${x} ${y})`} opacity={dim ? 0.4 : 1}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={12} fill={COLORS.PANEL}
      stroke={color} strokeWidth={active ? 2.2 : 1.3} opacity={active ? 1 : 0.6} />
    <text x="0" y={desc && active ? -6 : 5} textAnchor="middle" fontFamily="monospace" fontWeight="700"
      fontSize="12" fill={active ? color : COLORS.MUTED}>{label}</text>
    {desc && active && (
      <text x="0" y="15" textAnchor="middle" fontFamily="monospace" fontSize="8.5" fill={COLORS.MUTED}>{desc}</text>
    )}
  </g>
)

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
      <circle cx="0" cy="-10" r="14" fill="none" stroke={COLORS.WIRED} strokeWidth="2" />
      <line x1="-8" y1="-10" x2="8" y2="-10" stroke={COLORS.WIRED} strokeWidth="2" />
      <text x="0" y="24" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="13" fill={COLORS.WIRED}>{label}</text>
    </g>
  )
}

// ── TakeawayBar — panel penutup Act 6, sebelum loop mengulang. ──
export const TakeawayBar = ({ visible, text }) => {
  if (!visible) return null
  return (
    <g transform="translate(366 880)">
      <rect x="-280" y="-30" width="560" height="60" rx="26" fill={COLORS.SUCCESS} opacity="0.14" />
      <rect x="-280" y="-30" width="560" height="60" rx="26" fill="none" stroke={COLORS.SUCCESS} strokeWidth="2" />
      <text x="0" y="7" textAnchor="middle" fontSize="16" fontWeight="700" fill={COLORS.SUCCESS}>{text}</text>
    </g>
  )
}
