// src/content/36-ssh-key/acts/Act3AuthorizedKeys.jsx
// ACT 3 — Memasang Gembok di Server (authorized_keys).
// Stage live: 'send' → 'install' → 'after'. Summary: drawer terisi + badge.
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import { tos, oop, ActChrome, withOrigin } from './common'
import { NEAR_CLIENT, DRAWER_PT, COLORS, ACT3_BEATS } from '../data'

export const SUMMARY_STAGE = 'install'
export const SUMMARY_POSITIONS = {
  client: { x: 0, y: 0, scale: 1, opacity: 1 },
  server: { x: 0, y: 0, scale: 1, opacity: 1 },
  portLabel: { x: 0, y: 0, scale: 1, opacity: 1 },
  copyCmd: { x: 0, y: 0, scale: 1, opacity: 1 },
  publicKeyTravel: { x: DRAWER_PT.x, y: DRAWER_PT.y, scale: 1, opacity: 1 },
  drawer: { x: 0, y: 0, scale: 1, opacity: 1 },
}

const SUMMARY_STATE = {
  pop: SUMMARY_POSITIONS, stage: SUMMARY_STAGE,
  actorKind: 'user', channelMode: 'idle', serverBadge: 'locked',
}

export default function Act3AuthorizedKeys({ state, origin }) {
  const s = { ...SUMMARY_STATE, ...state }
  const pop = s.pop
  const stage = s.stage

  return withOrigin(
    <>
      <ActChrome state={s} />

      {(stage === 'send' || stage === 'install') && (
        <g transform={tos(pop, 'copyCmd', NEAR_CLIENT.x, NEAR_CLIENT.y - 20)} opacity={oop(pop, 'copyCmd')}>
          <rect x={-160} y={-22} width={320} height={44} rx={10} fill={COLORS.PANEL} stroke={COLORS.BORDER} strokeWidth={1.5} />
          <text x={0} y={6} textAnchor="middle" fontSize={13} fontFamily="monospace" fill={COLORS.TEXT}>{ACT3_BEATS.command}</text>
        </g>
      )}

      {(stage === 'send' || stage === 'install') && (
        <g transform={tos(pop, 'publicKeyTravel', 0, 0)} opacity={oop(pop, 'publicKeyTravel')}>
          <rect x={-60} y={-26} width={120} height={52} rx={10} fill={COLORS.PANEL} stroke={COLORS.PUBLIC} strokeWidth={2} />
          <circle cx={0} cy={-8} r={9} fill="none" stroke={COLORS.PUBLIC} strokeWidth={2.5} />
          <rect x={-5} y={-3} width={10} height={9} rx={2} fill={COLORS.PUBLIC} />
          <text x={0} y={18} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={COLORS.PUBLIC}>.pub</text>
        </g>
      )}

      {(stage === 'install' || stage === 'after') && (
        <g transform={tos(pop, 'drawer', DRAWER_PT.x, DRAWER_PT.y)} opacity={oop(pop, 'drawer')}>
          <rect x={-150} y={-46} width={300} height={92} rx={12} fill={COLORS.PANEL} stroke={COLORS.SERVER} strokeWidth={2} filter="url(#shadow)" />
          <text x={0} y={-16} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="monospace" fill={COLORS.SERVER}>{ACT3_BEATS.drawerLabel}</text>
          <rect x={-60} y={-4} width={120} height={30} rx={6} fill={COLORS.BG} stroke={COLORS.PUBLIC} strokeWidth={1.5} />
          <text x={0} y={16} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={COLORS.PUBLIC}>id_ed25519.pub</text>
          {stage === 'after' && (
            <g transform="translate(128, -30)">
              <circle r={13} fill={COLORS.SUCCESS} />
              <path d="M -5 0 L -1 4 L 6 -5" stroke={COLORS.BG} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          )}
        </g>
      )}

      {stage === 'after' && (
        <g transform={`translate(${DRAWER_PT.x}, ${DRAWER_PT.y + 78})`}>
          <rect x={-100} y={-18} width={200} height={36} rx={18} fill={COLORS.SUCCESS} />
          <text x={0} y={5} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="sans-serif" fill={COLORS.BG}>{ACT3_BEATS.installedBadge}</text>
        </g>
      )}
    </>,
    origin,
  )
}
