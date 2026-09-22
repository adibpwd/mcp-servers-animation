// 93-reverse-proxy/acts/common.jsx
// Helper presentational bersama untuk file per-Act (pola "1 act = 1 file",
// docs/standardizations/07-act-scene-pattern.md).
//
// Kontrak:
//   • PURE presentational: tanpa GSAP, useState/useEffect, SFX, atau timeline.
//   • Koordinat body-local (0,0 = pojok kiri-atas ContentBodyV1). Di dalam
//     ContentBodyV1 origin sudah otomatis; di luar (intro bg) pakai prop `origin`.
//   • `state = { vis, actors, txt, clientStatus }` — semua field opsional; nilai yang
//     tidak dikirim jatuh ke SUMMARY_STATE milik Act (mode summary untuk thumbnail).

import React from 'react'
import { COLORS, COPY, ZONES } from '../data'


export const popScale = (a) => 0.85 + 0.15 * a
const FONT = 'sans-serif'
const MONO = 'monospace'

export function Note({ pos, lines, o, anchor = 'start', color = COLORS.TEXT_SECONDARY }) {
  return (
    <text
      x={pos.x} y={pos.y} textAnchor={anchor} opacity={o}
      fontSize={13} fontWeight={600} fill={color} style={{ fontFamily: FONT }}
    >
      {lines.map((line, i) => (
        <tspan key={i} x={pos.x} dy={i === 0 ? 0 : 18}>{line}</tspan>
      ))}
    </text>
  )
}

export function ClientCard({ vis, status }) {
  const z = ZONES.CLIENT
  const done = status === 'done'
  const text = status === 'loading' ? COPY.CLIENT_LOADING : done ? COPY.CLIENT_DONE : COPY.CLIENT_IDLE
  const color = done ? COLORS.GREEN : status === 'loading' ? COLORS.YELLOW : COLORS.MUTED
  return (
    <g transform={`translate(${z.x}, ${z.y}) scale(${popScale(vis.client)})`} opacity={vis.client}>
      <rect x={-z.w / 2} y={-z.h / 2} width={z.w} height={z.h} rx={14} fill={COLORS.LIGHT} stroke={COLORS.BLUE} strokeWidth={2} />
      <rect x={-z.w / 2 - 4} y={-z.h / 2 - 4} width={z.w + 8} height={z.h + 8} rx={17} fill="none" stroke={COLORS.GREEN} strokeWidth={3} opacity={vis.clientDone} />
      <text y={-6} textAnchor="middle" fontSize={20} fontWeight={800} fill={COLORS.BLUE} style={{ fontFamily: FONT }}>{COPY.CLIENT}</text>
      <text y={20} textAnchor="middle" fontSize={13} fontWeight={600} fill={color} style={{ fontFamily: FONT }}>{text}</text>
    </g>
  )
}

export function EndpointBadge({ vis }) {
  const z = ZONES.ENDPOINT
  return (
    <g transform={`translate(${z.x}, ${z.y}) scale(${popScale(vis.endpoint)})`} opacity={vis.endpoint}>
      <rect x={-z.w / 2} y={-z.h / 2} width={z.w} height={z.h} rx={20} fill={COLORS.MID} stroke={COLORS.CYAN} strokeWidth={2} />
      <rect x={-z.w / 2 - 5} y={-z.h / 2 - 5} width={z.w + 10} height={z.h + 10} rx={25} fill="none" stroke={COLORS.CYAN} strokeWidth={3} opacity={vis.endpointPulse} />
      <text y={5} textAnchor="middle" fontSize={16} fontWeight={700} fill={COLORS.TEXT_PRIMARY} style={{ fontFamily: MONO }}>{COPY.ENDPOINT}</text>
    </g>
  )
}

export function RuleChip({ pos, label, appear, match, miss }) {
  const z = { x: pos.x - ZONES.GATE.x, y: pos.y - ZONES.GATE.y } // local terhadap gate
  return (
    <g transform={`translate(${z.x}, ${z.y}) scale(${popScale(appear)})`} opacity={appear}>
      <rect x={-75} y={-18} width={150} height={36} rx={18} fill={COLORS.MID} stroke={COLORS.PURPLE} strokeWidth={2} />
      <rect x={-75} y={-18} width={150} height={36} rx={18} fill={COLORS.GREEN} fillOpacity={0.2} stroke={COLORS.GREEN} strokeWidth={3} opacity={match} />
      <rect x={-75} y={-18} width={150} height={36} rx={18} fill={COLORS.RED} fillOpacity={0.2} stroke={COLORS.RED} strokeWidth={3} opacity={miss} />
      <text y={5} textAnchor="middle" fontSize={14} fontWeight={700} fill={COLORS.TEXT_PRIMARY} style={{ fontFamily: MONO }}>{label}</text>
    </g>
  )
}

export function ProxyGate({ vis }) {
  const z = ZONES.GATE
  return (
    <g transform={`translate(${z.x}, ${z.y}) scale(${popScale(vis.gate)})`} opacity={vis.gate}>
      <rect x={-z.w / 2} y={-z.h / 2} width={z.w} height={z.h} rx={18} fill={COLORS.LIGHT} stroke={COLORS.CYAN} strokeWidth={3} />
      <rect x={-z.w / 2 - 6} y={-z.h / 2 - 6} width={z.w + 12} height={z.h + 12} rx={24} fill="none" stroke={COLORS.CYAN} strokeWidth={4} opacity={vis.gatePulse} />
      <text x={-170} y={-48} fontSize={17} fontWeight={800} fill={COLORS.CYAN} style={{ fontFamily: FONT }}>{COPY.PROXY_TITLE}</text>
      <text x={-170} y={-28} fontSize={12} fill={COLORS.MUTED} style={{ fontFamily: MONO }}>{COPY.PROXY_SUB}</text>
      <RuleChip pos={ZONES.RULE_A} label={COPY.RULE_A} appear={vis.ruleA} match={vis.ruleAMatch} miss={0} />
      <RuleChip pos={ZONES.RULE_B} label={COPY.RULE_B} appear={vis.ruleB} match={0} miss={vis.ruleBMiss} />
    </g>
  )
}

export function Branches({ vis }) {
  const a = ZONES.LINE_A
  const b = ZONES.LINE_B
  const lit = vis.lineALit
  return (
    <g>
      <line x1={a.x1} y1={a.y1} x2={a.x2} y2={a.y2} stroke={COLORS.BORDER_EMPHASIZED} strokeWidth={2} strokeDasharray="6 6" opacity={vis.lines * 0.7} />
      <line x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2} stroke={COLORS.BORDER_EMPHASIZED} strokeWidth={2} strokeDasharray="6 6" opacity={vis.lines * 0.7} />
      <line
        x1={a.x1} y1={a.y1} x2={a.x1 + (a.x2 - a.x1) * lit} y2={a.y1 + (a.y2 - a.y1) * lit}
        stroke={COLORS.GREEN} strokeWidth={3} strokeLinecap="round" opacity={lit > 0 ? 1 : 0}
      />
    </g>
  )
}

export function BackendCard({ z, appear, active, proc, title, sub, color }) {
  const dim = 0.35 + 0.65 * active
  return (
    <g transform={`translate(${z.x}, ${z.y}) scale(${popScale(appear)})`} opacity={appear * dim}>
      <rect x={-z.w / 2} y={-z.h / 2} width={z.w} height={z.h} rx={14} fill={COLORS.LIGHT} stroke={color} strokeWidth={2} />
      <rect x={-z.w / 2 - 5} y={-z.h / 2 - 5} width={z.w + 10} height={z.h + 10} rx={18} fill="none" stroke={color} strokeWidth={3} opacity={proc} />
      <text y={-4} textAnchor="middle" fontSize={16} fontWeight={800} fill={color} style={{ fontFamily: FONT }}>{title}</text>
      <text y={20} textAnchor="middle" fontSize={12} fill={proc > 0.5 ? COLORS.TEXT_PRIMARY : COLORS.MUTED} style={{ fontFamily: MONO }}>{sub}</text>
    </g>
  )
}

export function Pill({ a, w, fill, label }) {
  if (a.s <= 0.01) return null
  return (
    <g transform={`translate(${a.x}, ${a.y}) scale(${a.s})`} opacity={Math.min(1, a.s * 1.6)}>
      <rect x={-w / 2} y={-15} width={w} height={30} rx={15} fill={fill} />
      <text y={5} textAnchor="middle" fontSize={13} fontWeight={800} fill={COLORS.DEEP} style={{ fontFamily: MONO }}>{label}</text>
    </g>
  )
}

export function ScanDot({ a }) {
  if (a.s <= 0.01) return null
  return (
    <g transform={`translate(${a.x}, ${a.y}) scale(${a.s})`}>
      <circle r={12} fill={COLORS.YELLOW} opacity={0.25} />
      <circle r={6} fill={COLORS.YELLOW} />
    </g>
  )
}

export function Takeaway({ o }) {
  const z = ZONES.TAKEAWAY
  return (
    <g transform={`translate(${z.x}, ${z.y}) scale(${popScale(o)})`} opacity={o}>
      <rect x={-z.w / 2} y={-z.h / 2} width={z.w} height={z.h} rx={24} fill={COLORS.MID} stroke={COLORS.GREEN} strokeWidth={2} />
      <text y={6} textAnchor="middle" fontSize={18} fontWeight={800} fill={COLORS.TEXT_PRIMARY} style={{ fontFamily: FONT }}>{COPY.TAKEAWAY}</text>
    </g>
  )
}

/** Bungkus scene act dengan origin translate (default {0,0}). */
export function withOrigin(children, origin = { x: 0, y: 0 }) {
  if (!origin || (origin.x === 0 && origin.y === 0)) return children
  return <g transform={`translate(${origin.x}, ${origin.y})`}>{children}</g>
}

/** Gabungkan state live dengan SUMMARY_STATE (live menimpa summary). */
export function resolveState(summary, state) {
  return {
    vis: { ...summary.vis, ...state?.vis },
    actors: { ...summary.actors, ...state?.actors },
    txt: { ...summary.txt, ...state?.txt },
    clientStatus: state?.clientStatus ?? summary.clientStatus,
  }
}

/**
 * Kerangka persisten lintas-Act. Urutan layer tetap:
 * cabang → `under` (packet/response, di belakang kartu agar tampak "masuk") → kartu →
 * `over` (scan dot) → note → `top` (takeaway).
 */
export function ActFrame({ state, under = null, over = null, top = null }) {
  const { vis, txt, clientStatus } = state
  return (
    <g>
      <Branches vis={vis} />
      {under}
      <ClientCard vis={vis} status={clientStatus} />
      <EndpointBadge vis={vis} />
      <ProxyGate vis={vis} />
      <BackendCard z={ZONES.BACKEND_A} appear={vis.beA} active={vis.beAActive} proc={vis.beAProc} title={COPY.BACKEND_A} sub={vis.beAProc > 0.5 ? COPY.BACKEND_A_PROC : COPY.BACKEND_A_SUB} color={COLORS.GREEN} />
      <BackendCard z={ZONES.BACKEND_B} appear={vis.beB} active={0} proc={0} title={COPY.BACKEND_B} sub={COPY.BACKEND_B_SUB} color={COLORS.ORANGE} />
      {over}
      <Note pos={ZONES.NOTE_CLIENT} lines={txt.client} o={vis.nClient} />
      <Note pos={ZONES.NOTE_ENDPOINT} lines={COPY.NOTE_ENDPOINT} o={vis.nEndpoint} />
      <Note pos={ZONES.NOTE_GATE} lines={txt.gate} o={vis.nGate} />
      <Note pos={ZONES.NOTE_BE_A} lines={txt.beA} o={vis.nBeA} anchor="middle" />
      <Note pos={ZONES.NOTE_BE_B} lines={COPY.NOTE_BE_B} o={vis.nBeB} anchor="middle" color={COLORS.MUTED} />
      {top}
    </g>
  )
}
