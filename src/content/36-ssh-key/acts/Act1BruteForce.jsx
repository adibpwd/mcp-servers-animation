// src/content/36-ssh-key/acts/Act1BruteForce.jsx
// ACT 1 — Kelemahan Password & Bahaya Brute-Force.
// Anchor 'client' bermain sebagai PENYERANG (actorKind='attacker').
// Stage live: 'attack' → 'rate' → 'overload'. Summary: overload penuh.
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import { tos, oop, ActChrome, withOrigin } from './common'
import { AXIS_X, MID, COLORS, ACT1_BEATS } from '../data'

export const SUMMARY_STAGE = 'overload'
export const SUMMARY_POSITIONS = {
  client: { x: 0, y: 0, scale: 1, opacity: 1 },
  server: { x: 0, y: 0, scale: 1, opacity: 1 },
  portLabel: { x: 0, y: 0, scale: 1, opacity: 1 },
  attemptCapsule: { x: 0, y: 0, scale: 1, opacity: 1 },
  denyMark1: { x: 0, y: 0, scale: 1, opacity: 1 },
  denyMark2: { x: 0, y: 0, scale: 1, opacity: 1 },
  denyMark3: { x: 0, y: 0, scale: 1, opacity: 1 },
}

const SUMMARY_STATE = {
  pop: SUMMARY_POSITIONS, stage: SUMMARY_STAGE,
  actorKind: 'attacker', channelMode: 'insecure', serverBadge: 'overload',
  attemptCount: 2483, attemptLabel: ACT1_BEATS.attempts[0],
}

const DENY_IDS = ['denyMark1', 'denyMark2', 'denyMark3']
const DENY_DX = [-56, 0, 56]

export default function Act1BruteForce({ state, origin }) {
  const s = { ...SUMMARY_STATE, ...state }
  const pop = s.pop
  const stage = s.stage

  return withOrigin(
    <>
      <ActChrome state={s} />

      {(stage === 'attack' || stage === 'rate' || stage === 'overload') && (
        <g transform={tos(pop, 'attemptCapsule', AXIS_X, MID.y - 20)} opacity={oop(pop, 'attemptCapsule')}>
          <rect x={-110} y={-24} width={220} height={48} rx={10} fill={COLORS.PANEL} stroke={COLORS.RISK} strokeWidth={2} />
          <text x={0} y={6} textAnchor="middle" fontSize={13} fontFamily="monospace" fill={COLORS.RISK}>
            {s.attemptLabel}
          </text>
        </g>
      )}

      {(stage === 'rate' || stage === 'overload') && (
        <g transform={`translate(${AXIS_X}, ${MID.y + 100})`}>
          <rect x={-160} y={-22} width={320} height={44} rx={22} fill={COLORS.PANEL} stroke={COLORS.RISK} strokeWidth={1.5} />
          <text x={0} y={6} textAnchor="middle" fontSize={13} fontWeight={700} fontFamily="sans-serif" fill={COLORS.TEXT}>
            {(s.attemptCount ?? 0).toLocaleString('id-ID')} percobaan/detik
          </text>
        </g>
      )}

      {DENY_IDS.map((id, i) => (
        <g key={id} transform={tos(pop, id, AXIS_X + DENY_DX[i], 740)} opacity={oop(pop, id)}>
          <circle r={17} fill={COLORS.RISK} opacity={0.18} />
          <text x={0} y={7} textAnchor="middle" fontSize={18} fontWeight={700} fill={COLORS.RISK}>✕</text>
        </g>
      ))}
    </>,
    origin,
  )
}
