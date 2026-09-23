// src/content/36-ssh-key/acts/common.jsx
// ─────────────────────────────────────────────────────────────
// Helper bersama untuk file per-act (pola "1 act = 1 file", lihat
// docs/standardizations/07-act-scene-pattern.md).
// Kontrak: komponen act PURE presentational, satu prop
// `state = { pop, stage, actorKind, channelMode, serverBadge, ... }`.
// `actorKind`: 'user' (default) | 'attacker' — anchor 'client' dipakai
// lintas Act (continuity), Act 1 me-morph tampilannya jadi penyerang.
// `channelMode`: 'idle' (default) | 'insecure' | 'secure'.
// `serverBadge`: undefined | 'overload' | 'locked' | 'granted'.
// ─────────────────────────────────────────────────────────────

import React from 'react'
import {
  AXIS_X, CLIENT_Y, SERVER_Y, CHANNEL_TOP, CHANNEL_BOTTOM,
  SERVER_LABEL, PORT_LABEL, COLORS,
} from '../data'

export const pose = (pop, id) => pop?.[id] || { scale: 0, opacity: 0, x: 0, y: 0 }
export const tos = (pop, id, cx, cy) => {
  const p = pose(pop, id)
  return `translate(${cx + p.x}, ${cy + p.y}) scale(${p.scale})`
}
export const aos = (pop, id) => tos(pop, id, 0, 0)
export const oop = (pop, id) => pose(pop, id).opacity

export const getChannelStyle = (state = {}) => {
  const mode = state.channelMode ?? 'idle'
  if (mode === 'insecure') return { color: COLORS.RISK, opacity: 0.85, width: 3, dash: '4 6' }
  if (mode === 'secure') return { color: COLORS.SUCCESS, opacity: 1, width: 5, filter: 'url(#glow)' }
  return { color: COLORS.BORDER, opacity: 0.4, width: 2, dash: '6 8' }
}

export function ActChrome({ state }) {
  const css = getChannelStyle(state)
  const actorKind = state?.actorKind ?? 'user'
  const isAttacker = actorKind === 'attacker'
  const actorColor = isAttacker ? COLORS.RISK : COLORS.CLIENT
  const actorLabel = isAttacker ? 'PENYERANG' : 'LAPTOP USER'
  const serverBadge = state?.serverBadge

  return (
    <>
      <line x1={AXIS_X} y1={CHANNEL_TOP} x2={AXIS_X} y2={CHANNEL_BOTTOM}
        stroke={css.color} strokeWidth={css.width} strokeDasharray={css.dash}
        opacity={css.opacity} filter={css.filter} />

      <g transform={tos(state?.pop, 'client', AXIS_X, CLIENT_Y)} opacity={oop(state?.pop, 'client')}>
        <rect x={-55} y={-38} width={110} height={70} rx={10} fill={COLORS.PANEL} stroke={actorColor} strokeWidth={2} />
        <rect x={-42} y={-28} width={84} height={44} rx={4} fill={COLORS.BG} stroke={actorColor} strokeWidth={1} />
        <text x={0} y={-2} textAnchor="middle" fontSize={16} fill={actorColor} fontFamily="monospace">{isAttacker ? '</>' : '>_'}</text>
        <text x={0} y={52} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily="sans-serif" fill={COLORS.TEXT}>{actorLabel}</text>
      </g>
    
      <g transform={tos(state?.pop, 'server', AXIS_X, SERVER_Y)} opacity={oop(state?.pop, 'server')}>
        <rect x={-60} y={-40} width={120} height={80} rx={10} fill={COLORS.PANEL} stroke={COLORS.SERVER} strokeWidth={2} />
        <rect x={-46} y={-26} width={92} height={10} rx={2} fill={COLORS.SERVER} opacity={0.7} />
        <rect x={-46} y={-10} width={92} height={10} rx={2} fill={COLORS.SERVER} opacity={0.45} />
        <rect x={-46} y={6} width={92} height={10} rx={2} fill={COLORS.SERVER} opacity={0.25} />
        <text x={0} y={58} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily="sans-serif" fill={COLORS.TEXT}>{SERVER_LABEL}</text>
        {serverBadge === 'overload' && (
          <g transform="translate(48, -44)">
            <circle r={14} fill={COLORS.RISK} filter="url(#glow)" />
            <text x={0} y={5} textAnchor="middle" fontSize={14} fontWeight={700} fill={COLORS.BG}>!</text>
          </g>
        )}
        {serverBadge === 'locked' && (
          <g transform="translate(48, -44)">
            <circle r={14} fill={COLORS.SERVER} filter="url(#glow)" />
            <rect x={-5} y={-2} width={10} height={8} rx={2} fill={COLORS.BG} />
            <path d="M -3 -2 v-4 a3 3 0 0 1 6 0 v4" stroke={COLORS.BG} strokeWidth={1.6} fill="none" />
          </g>
        )}
        {serverBadge === 'granted' && (
          <g transform="translate(48, -44)">
            <circle r={14} fill={COLORS.SUCCESS} filter="url(#glow)" />
            <path d="M -6 0 L -1 5 L 7 -6" stroke={COLORS.BG} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
          </g>
        )}
      </g>

      <g transform={tos(state?.pop, 'portLabel', AXIS_X, CHANNEL_TOP + 20)} opacity={oop(state?.pop, 'portLabel')}>
        <rect x={-120} y={-14} width={240} height={28} rx={14} fill={COLORS.PANEL} stroke={COLORS.BORDER} strokeWidth={1} />
        <text x={0} y={5} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={COLORS.MUTED}>{PORT_LABEL}</text>
      </g>
    </>
  )
}

/** Bungkus scene act + chrome dengan origin translate (default {0,0}). */
export function withOrigin(children, origin = { x: 0, y: 0 }) {
  if (!origin || (origin.x === 0 && origin.y === 0)) return children
  return <g transform={`translate(${origin.x}, ${origin.y})`}>{children}</g>
}
