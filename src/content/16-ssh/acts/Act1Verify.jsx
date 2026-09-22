// src/content/44-ssh/acts/Act1Verify.jsx
// ACT 1 — Hubungi & Verifikasi Server.
// Satu-satunya elemen act: kartu fingerprint host key.
// Stage live: 'fingerprint'. Summary: kartu tampil utuh (dipakai intro bg).
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import { tos, oop, ActChrome, withOrigin } from './common'
import { AXIS_X, COLORS, ACT1_BEATS } from '../data'

export const SUMMARY_STAGE = 'fingerprint'
export const SUMMARY_POSITIONS = {
  client: { x: 0, y: 0, scale: 1, opacity: 1 },
  server: { x: 0, y: 0, scale: 1, opacity: 1 },
  hostLabel: { x: 0, y: 0, scale: 1, opacity: 1 },
  fingerprintCard: { x: 0, y: 0, scale: 1, opacity: 1 },
}

export default function Act1Verify({ state, origin }) {
  const pop = state?.pop || SUMMARY_POSITIONS
  const stage = state?.stage || SUMMARY_STAGE

  return withOrigin(
    <>
      <ActChrome state={state} />

      {stage === 'fingerprint' && (
        <g transform={tos(pop, 'fingerprintCard', AXIS_X, 480)} opacity={oop(pop, 'fingerprintCard')}>
          <rect x={-170} y={-50} width={340} height={100} rx={12} fill={COLORS.PANEL} stroke={COLORS.TRUST} strokeWidth={2} filter="url(#shadow)" />
          <text x={0} y={-22} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily="sans-serif" fill={COLORS.TRUST}>HOST KEY FINGERPRINT</text>
          <text x={0} y={2} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={COLORS.MUTED}>{ACT1_BEATS.fingerprint.knownHosts}</text>
          <text x={0} y={22} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={COLORS.TEXT}>{ACT1_BEATS.fingerprint.seenHost}</text>
        </g>
      )}
    </>,
    origin,
  )
}