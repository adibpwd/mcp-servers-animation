// src/content/36-ssh-key/acts/Act4ChallengeResponse.jsx
// ACT 4 — Challenge-Response: Masuk Tanpa Ngetik Password.
// Stage live: 'send' → 'unlock' → 'verify' → 'after'. Summary: access granted.
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import { tos, oop, ActChrome, withOrigin } from './common'
import { NEAR_CLIENT, PASSWORD_CROSS_PT, COLORS, ACT4_BEATS } from '../data'

export const SUMMARY_STAGE = 'after'
export const SUMMARY_POSITIONS = {
  client: { x: 0, y: 0, scale: 1, opacity: 1 },
  server: { x: 0, y: 0, scale: 1, opacity: 1 },
  portLabel: { x: 0, y: 0, scale: 1, opacity: 1 },
  privateKeyUnlock: { x: 0, y: 0, scale: 1, opacity: 1 },
  passwordCrossed: { x: 0, y: 0, scale: 1, opacity: 1 },
  grantedBadge: { x: 0, y: 0, scale: 1, opacity: 1 },
}

const SUMMARY_STATE = {
  pop: SUMMARY_POSITIONS, stage: SUMMARY_STAGE,
  actorKind: 'user', channelMode: 'secure', serverBadge: 'granted',
}

export default function Act4ChallengeResponse({ state, origin }) {
  const s = { ...SUMMARY_STATE, ...state }
  const pop = s.pop
  const stage = s.stage

  return withOrigin(
    <>
      <ActChrome state={s} />

      {(stage === 'send' || stage === 'unlock') && (
        <g transform={tos(pop, 'challengeCapsule', 0, 0)} opacity={oop(pop, 'challengeCapsule')}>
          <rect x={-95} y={-26} width={190} height={52} rx={10} fill={COLORS.PANEL} stroke={COLORS.SERVER} strokeWidth={2} />
          <text x={0} y={6} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={COLORS.SERVER}>{ACT4_BEATS.challengeLabel}</text>
        </g>
      )}

      {(stage === 'unlock' || stage === 'verify' || stage === 'after') && (
        <g transform={tos(pop, 'privateKeyUnlock', NEAR_CLIENT.x, NEAR_CLIENT.y - 10)} opacity={oop(pop, 'privateKeyUnlock')}>
          <circle r={30} fill="none" stroke={COLORS.PRIVATE} strokeWidth={2.5} strokeDasharray="5 5" />
          <circle cx={-6} cy={-6} r={6} fill="none" stroke={COLORS.PRIVATE} strokeWidth={3} />
          <line x1={-1} y1={-1} x2={11} y2={11} stroke={COLORS.PRIVATE} strokeWidth={3} strokeLinecap="round" />
          <line x1={5} y1={5} x2={5} y2={13} stroke={COLORS.PRIVATE} strokeWidth={3} strokeLinecap="round" />
        </g>
      )}

      {stage === 'verify' && (
        <g transform={tos(pop, 'responseCapsule', 0, 0)} opacity={oop(pop, 'responseCapsule')}>
          <rect x={-95} y={-26} width={190} height={52} rx={10} fill={COLORS.PANEL} stroke={COLORS.PRIVATE} strokeWidth={2} />
          <text x={0} y={6} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={COLORS.PRIVATE}>{ACT4_BEATS.responseLabel}</text>
        </g>
      )}

      <g transform={tos(pop, 'passwordCrossed', PASSWORD_CROSS_PT.x, PASSWORD_CROSS_PT.y)} opacity={oop(pop, 'passwordCrossed')}>
        <rect x={-90} y={-20} width={180} height={40} rx={8} fill={COLORS.PANEL} stroke={COLORS.MUTED} strokeWidth={1.2} opacity={0.7} />
        <text x={0} y={5} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={COLORS.MUTED}>{ACT4_BEATS.passwordLabel}</text>
        <line x1={-84} y1={0} x2={84} y2={0} stroke={COLORS.RISK} strokeWidth={2.5} />
      </g>

      {(stage === 'verify' || stage === 'after') && (
        <g transform={tos(pop, 'grantedBadge', 0, 0)} opacity={oop(pop, 'grantedBadge')}>
          <rect x={-110} y={-24} width={220} height={48} rx={24} fill={COLORS.SUCCESS} filter="url(#glow)" />
          <text x={0} y={6} textAnchor="middle" fontSize={14} fontWeight={700} fontFamily="sans-serif" fill={COLORS.BG}>{ACT4_BEATS.grantedBadge}</text>
        </g>
      )}
    </>,
    origin,
  )
}
