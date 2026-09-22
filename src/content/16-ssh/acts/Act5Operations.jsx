// src/content/44-ssh/acts/Act5Operations.jsx
// ACT 5 — Akses Aman Memerlukan Siklus Hidup dan Bukti.
// Elemen: keyCard, connEvent, connEvent2 (+deny X), auditTimeline.
// Stage live: ops-*. Mode summary (tanpa props, dipakai intro bg): momen
// akhir — key revoked, deny tercatat, audit timeline lengkap + alert dot.
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import { tos, oop, ActChrome, withOrigin } from './common'
import {
  COLORS, NEAR_CLIENT, NEAR_SERVER, MID, AUDIT_PT,
  ACT5_CASE,
} from '../data'

export const SUMMARY_STAGE = 'ops-closing'
export const SUMMARY_POSITIONS = {
  client: { x: 0, y: 0, scale: 1, opacity: 1 },
  server: { x: 0, y: 0, scale: 1, opacity: 1 },
  hostLabel: { x: 0, y: 0, scale: 1, opacity: 1 },
  keyCard: { x: NEAR_CLIENT.x, y: NEAR_CLIENT.y, scale: 1, opacity: 1 },
  connEvent2: { x: MID.x, y: MID.y, scale: 1, opacity: 1 },
  auditTimeline: { x: AUDIT_PT.x, y: AUDIT_PT.y, scale: 1, opacity: 1 },
}

export default function Act5Operations({ state, origin }) {
  const pop = state?.pop || SUMMARY_POSITIONS
  const stage = state?.stage || SUMMARY_STAGE
  const keyStatus = state?.keyStatus ?? 'revoked'
  const allowShown = state?.allowShown ?? true
  const denyShown = state?.denyShown ?? true
  const alertOn = state?.alertOn ?? true

  return withOrigin(
    <>
      <ActChrome state={state} />

      {(stage === 'ops-valid' || stage === 'ops-lifecycle' || stage === 'ops-next' || stage === 'ops-deny' || stage === 'ops-closing') && (
        <g transform={tos(pop, 'keyCard', 0, 0)} opacity={oop(pop, 'keyCard')}>
          <rect x={-90} y={-30} width={180} height={60} rx={10} fill={COLORS.PANEL}
            stroke={keyStatus === 'revoked' ? COLORS.RISK : COLORS.OPS} strokeWidth={2} />
          <text x={0} y={-6} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily="monospace" fill={COLORS.TEXT}>{ACT5_CASE.keyId}</text>
          <text x={0} y={16} textAnchor="middle" fontSize={9.5} fontFamily="sans-serif"
            fill={keyStatus === 'revoked' ? COLORS.RISK : COLORS.OPS}>
            {keyStatus === 'revoked' ? ACT5_CASE.statusRevoked : ACT5_CASE.statusActive}
          </text>
        </g>
      )}

      {stage === 'ops-valid' && (
        <g transform={tos(pop, 'connEvent', 0, 0)} opacity={oop(pop, 'connEvent')}>
          <rect x={-50} y={-16} width={100} height={32} rx={16} fill={COLORS.OPS} />
          <text x={0} y={5} textAnchor="middle" fontSize={9.5} fontWeight={700} fontFamily="monospace" fill={COLORS.BG}>connect</text>
        </g>
      )}

      {(stage === 'ops-next' || stage === 'ops-deny' || stage === 'ops-closing') && (
        <g transform={tos(pop, 'connEvent2', 0, 0)} opacity={oop(pop, 'connEvent2')}>
          <rect x={-50} y={-16} width={100} height={32} rx={16} fill={denyShown ? COLORS.RISK : COLORS.AUTH} />
          <text x={0} y={5} textAnchor="middle" fontSize={9.5} fontWeight={700} fontFamily="monospace" fill={COLORS.BG}>connect</text>
          {denyShown && (
            <path d="M -56 -22 L 56 22 M 56 -22 L -56 22" stroke={COLORS.RISK} strokeWidth={4} strokeLinecap="round" />
          )}
        </g>
      )}

      {(stage === 'ops-valid' || stage === 'ops-lifecycle' || stage === 'ops-next' || stage === 'ops-deny' || stage === 'ops-closing') && (
        <g transform={tos(pop, 'auditTimeline', 0, 0)} opacity={oop(pop, 'auditTimeline')}>
          <rect x={-170} y={-40} width={340} height={80} rx={10} fill={COLORS.PANEL} stroke={COLORS.BORDER} strokeWidth={1.5} />
          <text x={-150} y={-18} fontSize={10} fontWeight={700} fontFamily="sans-serif" fill={COLORS.MUTED}>AUDIT TIMELINE</text>
          {allowShown && (
            <text x={-150} y={4} fontSize={10} fontFamily="monospace" fill={COLORS.OPS}>{ACT5_CASE.events[0].label}</text>
          )}
          {denyShown && (
            <text x={-150} y={24} fontSize={10} fontFamily="monospace" fill={COLORS.RISK}>{ACT5_CASE.events[1].label}</text>
          )}
          {alertOn && (
            <circle cx={150} cy={14} r={7} fill={COLORS.RISK} />
          )}
        </g>
      )}
    </>,
    origin,
  )
}