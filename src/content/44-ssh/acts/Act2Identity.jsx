// src/content/44-ssh/acts/Act2Identity.jsx
// ACT 2 — Login vs Hak Akses (studi kasus "Akun Deploy Terbatas").
// Elemen: identityCard, altMethods, verifierRing, policyGate, scopeToken,
// outcome rows, receipt. Stage live: id-*. Pada mode summary (tanpa props,
// dipakai intro bg) dirender momen akhir: identityCard verified + policy +
// scope + outcome "Restricted Task" + receipt.
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import { tos, oop, ActChrome, withOrigin } from './common'
import {
  AXIS_X, COLORS,
  NEAR_CLIENT, MID, GATE_PT, SCOPE_PT,
  ACT2_CASE,
} from '../data'

export const SUMMARY_STAGE = 'id-after'
export const SUMMARY_POSITIONS = {
  client: { x: 0, y: 0, scale: 1, opacity: 1 },
  server: { x: 0, y: 0, scale: 1, opacity: 1 },
  hostLabel: { x: 0, y: 0, scale: 1, opacity: 1 },
  identityCard: { x: MID.x, y: MID.y, scale: 1, opacity: 1 },
  policyGate: { x: GATE_PT.x, y: GATE_PT.y, scale: 1, opacity: 1 },
  scopeToken: { x: SCOPE_PT.x, y: SCOPE_PT.y, scale: 1, opacity: 1 },
  receipt: { x: NEAR_CLIENT.x, y: NEAR_CLIENT.y, scale: 1, opacity: 1 },
}

export default function Act2Identity({ state, origin }) {
  const pop = state?.pop || SUMMARY_POSITIONS
  const stage = state?.stage || SUMMARY_STAGE
  const verifiedOn = state?.verifiedOn ?? true

  return withOrigin(
    <>
      <ActChrome state={state} />

      {(stage === 'id-identity' || stage === 'id-authenticate' || stage === 'id-authorize' || stage === 'id-apply' || stage === 'id-after') && (
        <g transform={tos(pop, 'identityCard', 0, 0)} opacity={oop(pop, 'identityCard')}>
          <rect x={-90} y={-34} width={180} height={68} rx={12} fill={COLORS.PANEL} stroke={COLORS.AUTH} strokeWidth={2} />
          <text x={0} y={-6} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily="monospace" fill={COLORS.AUTH}>{ACT2_CASE.identityLabel}</text>
          <text x={0} y={16} textAnchor="middle" fontSize={9.5} fontFamily="sans-serif" fill={COLORS.MUTED}>{ACT2_CASE.proofLabel}</text>
          {verifiedOn && (
            <g transform="translate(66, -26)">
              <circle r={11} fill={COLORS.TUNNEL} />
              <path d="M -4 0 L -1 4 L 5 -5" stroke={COLORS.BG} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
            </g>
          )}
        </g>
      )}

      {stage === 'id-identity' && (
        <g transform={tos(pop, 'altMethods', 0, 0)} opacity={oop(pop, 'altMethods')}>
          <text x={0} y={0} textAnchor="middle" fontSize={9.5} fontFamily="sans-serif" fill={COLORS.MUTED}>
            alternatif: {ACT2_CASE.altMethods.join(' · ')}
          </text>
        </g>
      )}

      {stage === 'id-authenticate' && (
        <g transform={tos(pop, 'verifierRing', 0, 0)} opacity={oop(pop, 'verifierRing')}>
          <circle r={46} fill="none" stroke={COLORS.AUTH} strokeWidth={2} strokeDasharray="6 5" />
          <text x={0} y={64} textAnchor="middle" fontSize={10} fontFamily="sans-serif" fill={COLORS.MUTED}>{ACT2_CASE.verifierLabel}</text>
        </g>
      )}

      {(stage === 'id-authorize' || stage === 'id-apply' || stage === 'id-after') && (
        <>
          <g transform={tos(pop, 'policyGate', 0, 0)} opacity={oop(pop, 'policyGate')}>
            <rect x={-110} y={-24} width={220} height={48} rx={10} fill={COLORS.PANEL} stroke={COLORS.AUTHZ} strokeWidth={2} />
            <text x={0} y={5} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="sans-serif" fill={COLORS.AUTHZ}>{ACT2_CASE.policyLabel}</text>
          </g>
          <g transform={tos(pop, 'scopeToken', 0, 0)} opacity={oop(pop, 'scopeToken')}>
            <text x={0} y={0} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={COLORS.MUTED}>scope: {ACT2_CASE.scopeToken}</text>
          </g>
        </>
      )}

      {(stage === 'id-apply' || stage === 'id-after') && ACT2_CASE.outcomes.map((oc, i) => {
        const lit = oc.selected && (stage === 'id-apply' || stage === 'id-after')
        const x = AXIS_X + (i - 1) * 190
        return (
          <g key={oc.id} transform={`translate(${x}, 670)`}>
            <rect x={-82} y={-22} width={164} height={44} rx={10}
              fill={lit ? COLORS.AUTHZ : COLORS.PANEL}
              stroke={COLORS.AUTHZ} strokeWidth={lit ? 0 : 1.5} opacity={lit ? 1 : 0.4} />
            <text x={0} y={5} textAnchor="middle" fontSize={10} fontWeight={700}
              fontFamily="sans-serif" fill={lit ? COLORS.BG : COLORS.MUTED}>{oc.label}</text>
          </g>
        )
      })}

      {stage === 'id-after' && (
        <g transform={tos(pop, 'receipt', 0, 0)} opacity={oop(pop, 'receipt')}>
          <rect x={-60} y={-18} width={120} height={36} rx={8} fill={COLORS.OPS} />
          <text x={0} y={5} textAnchor="middle" fontSize={9.5} fontWeight={700} fontFamily="sans-serif" fill={COLORS.BG}>{ACT2_CASE.receiptLabel}</text>
        </g>
      )}
    </>,
    origin,
  )
}