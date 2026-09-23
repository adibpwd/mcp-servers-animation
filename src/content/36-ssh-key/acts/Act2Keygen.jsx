// src/content/36-ssh-key/acts/Act2Keygen.jsx
// ACT 2 — Pasangan Kunci Publik & Privat (ssh-keygen).
// Stage live: 'run' → 'twin' → 'after'. Summary: kedua kunci tampil utuh.
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import { tos, oop, ActChrome, withOrigin } from './common'
import { NEAR_CLIENT, PUBLIC_PT, PRIVATE_PT, COLORS, ACT2_BEATS } from '../data'

export const SUMMARY_STAGE = 'twin'
export const SUMMARY_POSITIONS = {
  client: { x: 0, y: 0, scale: 1, opacity: 1 },
  server: { x: 0, y: 0, scale: 1, opacity: 1 },
  portLabel: { x: 0, y: 0, scale: 1, opacity: 1 },
  keygenCmd: { x: 0, y: 0, scale: 1, opacity: 1 },
  publicKeyCard: { x: 0, y: 0, scale: 1, opacity: 1 },
  privateKeyCard: { x: 0, y: 0, scale: 1, opacity: 1 },
}

const SUMMARY_STATE = {
  pop: SUMMARY_POSITIONS, stage: SUMMARY_STAGE,
  actorKind: 'user', channelMode: 'idle',
}

export default function Act2Keygen({ state, origin }) {
  const s = { ...SUMMARY_STATE, ...state }
  const pop = s.pop

  return withOrigin(
    <>
      <ActChrome state={s} />

      <g transform={tos(pop, 'keygenCmd', NEAR_CLIENT.x, NEAR_CLIENT.y - 20)} opacity={oop(pop, 'keygenCmd')}>
        <rect x={-160} y={-22} width={320} height={44} rx={10} fill={COLORS.PANEL} stroke={COLORS.BORDER} strokeWidth={1.5} />
        <text x={0} y={6} textAnchor="middle" fontSize={13} fontFamily="monospace" fill={COLORS.TEXT}>{ACT2_BEATS.command}</text>
      </g>

      <g transform={tos(pop, 'publicKeyCard', PUBLIC_PT.x, PUBLIC_PT.y)} opacity={oop(pop, 'publicKeyCard')}>
        <rect x={-115} y={-58} width={230} height={116} rx={12} fill={COLORS.PANEL} stroke={COLORS.PUBLIC} strokeWidth={2} filter="url(#shadow)" />
        <circle cx={0} cy={-24} r={16} fill="none" stroke={COLORS.PUBLIC} strokeWidth={3} />
        <rect x={-10} y={-14} width={20} height={16} rx={3} fill={COLORS.PUBLIC} />
        <text x={0} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily="monospace" fill={COLORS.TEXT}>{ACT2_BEATS.publicFile}</text>
        <text x={0} y={38} textAnchor="middle" fontSize={10} fontFamily="sans-serif" fill={COLORS.PUBLIC}>{ACT2_BEATS.publicNote}</text>
      </g>

      <g transform={tos(pop, 'privateKeyCard', PRIVATE_PT.x, PRIVATE_PT.y)} opacity={oop(pop, 'privateKeyCard')}>
        <rect x={-115} y={-58} width={230} height={116} rx={12} fill={COLORS.PANEL} stroke={COLORS.PRIVATE} strokeWidth={2} filter="url(#shadow)" />
        <circle cx={-6} cy={-26} r={7} fill="none" stroke={COLORS.PRIVATE} strokeWidth={3} />
        <line x1={0} y1={-20} x2={16} y2={-4} stroke={COLORS.PRIVATE} strokeWidth={3} strokeLinecap="round" />
        <line x1={10} y1={-10} x2={10} y2={-2} stroke={COLORS.PRIVATE} strokeWidth={3} strokeLinecap="round" />
        <text x={0} y={16} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily="monospace" fill={COLORS.TEXT}>{ACT2_BEATS.privateFile}</text>
        <text x={0} y={38} textAnchor="middle" fontSize={10} fontFamily="sans-serif" fill={COLORS.PRIVATE}>{ACT2_BEATS.privateNote}</text>
      </g>
    </>,
    origin,
  )
}
