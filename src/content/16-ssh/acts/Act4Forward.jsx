// src/content/44-ssh/acts/Act4Forward.jsx
// ACT 4 — Jangkau Layanan Privat dengan Jalur yang Jelas.
// Elemen: localApp, listenerRing, dbNode, query/result capsule, bastion
// node + target + packet. Stage live: fw-*. Mode summary (tanpa props,
// dipakai intro bg): momen akhir forwarding (local app → listener ring →
// db → result capsule).
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import { tos, oop, ActChrome, withOrigin } from './common'
import {
  COLORS, NEAR_CLIENT, NEAR_SERVER, MID, LISTENER_PT,
  ACT4_CASE,
} from '../data'

export const SUMMARY_STAGE = 'fw-apply'
export const SUMMARY_POSITIONS = {
  client: { x: 0, y: 0, scale: 1, opacity: 1 },
  server: { x: 0, y: 0, scale: 1, opacity: 1 },
  hostLabel: { x: 0, y: 0, scale: 1, opacity: 1 },
  localApp: { x: NEAR_CLIENT.x, y: NEAR_CLIENT.y, scale: 1, opacity: 1 },
  listenerRing: { x: LISTENER_PT.x, y: LISTENER_PT.y, scale: 1, opacity: 1 },
  dbNode: { x: NEAR_SERVER.x, y: NEAR_SERVER.y, scale: 1, opacity: 1 },
  resultCapsule: { x: NEAR_SERVER.x, y: NEAR_SERVER.y, scale: 1, opacity: 1 },
  bastionNode: { x: MID.x, y: MID.y, scale: 1, opacity: 1 },
  targetNode: { x: NEAR_SERVER.x, y: NEAR_SERVER.y, scale: 1, opacity: 1 },
  bastionPacket: { x: NEAR_SERVER.x, y: NEAR_SERVER.y, scale: 1, opacity: 1 },
}

export default function Act4Forward({ state, origin }) {
  const pop = state?.pop || SUMMARY_POSITIONS
  const stage = state?.stage || SUMMARY_STAGE

  return withOrigin(
    <>
      <ActChrome state={state} />

      {(stage === 'fw-before' || stage === 'fw-listener' || stage === 'fw-travel' || stage === 'fw-apply') && (
        <g transform={tos(pop, 'localApp', 0, 0)} opacity={oop(pop, 'localApp')}>
          <rect x={-70} y={-24} width={140} height={48} rx={10} fill={COLORS.PANEL} stroke={COLORS.CLIENT} strokeWidth={2} />
          <text x={0} y={5} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="sans-serif" fill={COLORS.TEXT}>{ACT4_CASE.localApp.label}</text>
        </g>
      )}
      {(stage === 'fw-listener' || stage === 'fw-travel' || stage === 'fw-apply') && (
        <g transform={tos(pop, 'listenerRing', 0, 0)} opacity={oop(pop, 'listenerRing')}>
          <circle r={26} fill="none" stroke={COLORS.FORWARD} strokeWidth={2} strokeDasharray="5 4" />
          <text x={0} y={44} textAnchor="middle" fontSize={9.5} fontFamily="monospace" fill={COLORS.MUTED}>{ACT4_CASE.listenerLabel}</text>
        </g>
      )}
      {(stage === 'fw-travel' || stage === 'fw-apply') && (
        <g transform={tos(pop, 'dbNode', 0, 0)} opacity={oop(pop, 'dbNode')}>
          <rect x={-80} y={-28} width={160} height={56} rx={10} fill={COLORS.PANEL} stroke={COLORS.SERVER} strokeWidth={2} />
          <text x={0} y={6} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="sans-serif" fill={COLORS.TEXT}>{ACT4_CASE.dbNode.label}</text>
        </g>
      )}
      {stage === 'fw-travel' && (
        <g transform={tos(pop, 'queryCapsule', 0, 0)} opacity={oop(pop, 'queryCapsule')}>
          <rect x={-50} y={-16} width={100} height={32} rx={16} fill={COLORS.FORWARD} />
          <text x={0} y={5} textAnchor="middle" fontSize={9.5} fontWeight={700} fontFamily="monospace" fill={COLORS.BG}>query</text>
        </g>
      )}
      {stage === 'fw-apply' && (
        <g transform={tos(pop, 'resultCapsule', 0, 0)} opacity={oop(pop, 'resultCapsule')}>
          <rect x={-50} y={-16} width={100} height={32} rx={16} fill={COLORS.TUNNEL} />
          <text x={0} y={5} textAnchor="middle" fontSize={9.5} fontWeight={700} fontFamily="monospace" fill={COLORS.BG}>result</text>
        </g>
      )}

      {stage === 'fw-bastion' && (
        <>
          <g transform={tos(pop, 'bastionNode', 0, 0)} opacity={oop(pop, 'bastionNode')}>
            <rect x={-90} y={-28} width={180} height={56} rx={10} fill={COLORS.PANEL} stroke={COLORS.BASTION} strokeWidth={2} />
            <text x={0} y={6} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="sans-serif" fill={COLORS.TEXT}>{ACT4_CASE.bastion.label}</text>
          </g>
          <g transform={tos(pop, 'targetNode', 0, 0)} opacity={oop(pop, 'targetNode')}>
            <rect x={-80} y={-28} width={160} height={56} rx={10} fill={COLORS.PANEL} stroke={COLORS.TRUST} strokeWidth={2} />
            <text x={0} y={6} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="sans-serif" fill={COLORS.TEXT}>{ACT4_CASE.bastion.targetLabel}</text>
          </g>
          <g transform={tos(pop, 'bastionPacket', 0, 0)} opacity={oop(pop, 'bastionPacket')}>
            <rect x={-46} y={-16} width={92} height={32} rx={16} fill={COLORS.BASTION} />
            <text x={0} y={5} textAnchor="middle" fontSize={9.5} fontWeight={700} fontFamily="monospace" fill={COLORS.BG}>packet</text>
          </g>
        </>
      )}
    </>,
    origin,
  )
}