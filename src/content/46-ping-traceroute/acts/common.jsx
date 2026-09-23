// src/content/46-ping-traceroute/acts/common.jsx
// Helper bersama untuk file per-act (pola "1 act = 1 file", lihat
// docs/standardizations/07-act-scene-pattern.md).
//
// Kontrak: komponen act PURE presentational, satu prop
// `state = { pop, stage, ...flag khusus act }`. Dipanggil tanpa props →
// mode "summary" (dipakai intro background/thumbnail).

import React from 'react'
import {
  AXIS_X, CLIENT_Y, SERVER_Y, CHANNEL_TOP, CHANNEL_BOTTOM,
  CLIENT_LABEL, SERVER_LABEL, HOST_LABEL, COLORS,
} from '../data'

export const pose = (pop, id) => pop?.[id] || { scale: 0, opacity: 0, x: 0, y: 0 }

export const tos = (pop, id, cx, cy) => {
  const p = pose(pop, id)
  return `translate(${cx + p.x}, ${cy + p.y}) scale(${p.scale})`
}

export const oop = (pop, id) => pose(pop, id).opacity

/** Gaya channel line turunan dari state (continuity map). */
export const getChannelStyle = (state = {}) => {
  const active = state.channelActive ?? true
  const dim = state.channelDim ?? false
  return {
    color: active ? COLORS.ECHO : COLORS.BORDER,
    opacity: active ? (dim ? 0.35 : 0.9) : 0.5,
    width: active ? 4 : 2,
    dash: active ? undefined : '6 8',
  }
}

/**
 * Chrome persisten lintas-act: channel line + client (browser) + server
 * anchor + host label. Di-summary (tanpa state) channel tampil aktif
 * emerald → scene masih "hidup" di thumbnail.
 */
export function ActChrome({ state }) {
  const css = getChannelStyle(state)
  return (
    <>
      <line x1={AXIS_X} y1={CHANNEL_TOP} x2={AXIS_X} y2={CHANNEL_BOTTOM}
        stroke={css.color} strokeWidth={css.width} strokeDasharray={css.dash} opacity={css.opacity} />

      <g transform={tos(state?.pop, 'client', AXIS_X, CLIENT_Y)} opacity={oop(state?.pop, 'client')}>
        <rect x={-55} y={-38} width={110} height={70} rx={10} fill={COLORS.PANEL} stroke={COLORS.CLIENT} strokeWidth={2} />
        <rect x={-42} y={-28} width={84} height={44} rx={4} fill={COLORS.BG} stroke={COLORS.CLIENT} strokeWidth={1} />
        <text x={0} y={-2} textAnchor="middle" fontSize={16} fill={COLORS.CLIENT} fontFamily="monospace">&gt;_</text>
        <text x={0} y={52} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily="sans-serif" fill={COLORS.TEXT}>{CLIENT_LABEL}</text>
      </g>

      <g transform={tos(state?.pop, 'server', AXIS_X, SERVER_Y)} opacity={oop(state?.pop, 'server')}>
        <rect x={-60} y={-40} width={120} height={80} rx={10} fill={COLORS.PANEL} stroke={COLORS.SERVER} strokeWidth={2} />
        <rect x={-46} y={-26} width={92} height={10} rx={2} fill={COLORS.SERVER} opacity={0.7} />
        <rect x={-46} y={-10} width={92} height={10} rx={2} fill={COLORS.SERVER} opacity={0.45} />
        <rect x={-46} y={6} width={92} height={10} rx={2} fill={COLORS.SERVER} opacity={0.25} />
        <text x={0} y={58} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily="sans-serif" fill={COLORS.TEXT}>{SERVER_LABEL}</text>
      </g>

      <g transform={tos(state?.pop, 'hostLabel', AXIS_X, CHANNEL_TOP + 20)} opacity={oop(state?.pop, 'hostLabel')}>
        <rect x={-150} y={-14} width={300} height={28} rx={14} fill={COLORS.PANEL} stroke={COLORS.BORDER} strokeWidth={1} />
        <text x={0} y={5} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={COLORS.MUTED}>{HOST_LABEL}</text>
      </g>
    </>
  )
}

/** Bungkus scene act + chrome dengan origin translate (default {0,0}). */
export function withOrigin(children, origin = { x: 0, y: 0 }) {
  if (!origin || (origin.x === 0 && origin.y === 0)) return children
  return <g transform={`translate(${origin.x}, ${origin.y})`}>{children}</g>
}
