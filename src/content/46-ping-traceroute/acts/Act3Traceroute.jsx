// src/content/46-ping-traceroute/acts/Act3Traceroute.jsx
// ACT 3 — Trik Cerdas `traceroute` & TTL.
// Elemen: ttlPacket (bergerak ke tiap hop lalu "mati"/expired), hopTable
// (baris bertambah 1 per 1: hop1Shown, hop2Shown, hop3Shown). Stage live:
// tr-*. Mode summary (tanpa props): tabel penuh 3 baris, hop3 reached.
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import { tos, oop, ActChrome, withOrigin } from './common'
import { HOP_TABLE_PT, COLORS, ACT3_CASE } from '../data'

export const SUMMARY_STAGE = 'tr-after'
export const SUMMARY_POSITIONS = {
  client: { x: 0, y: 0, scale: 1, opacity: 1 },
  server: { x: 0, y: 0, scale: 1, opacity: 1 },
  hostLabel: { x: 0, y: 0, scale: 1, opacity: 1 },
  hopTable: { x: HOP_TABLE_PT.x, y: HOP_TABLE_PT.y, scale: 1, opacity: 1 },
}

function statusColor(status) {
  if (status === 'reached') return COLORS.ECHO
  if (status === 'expired') return COLORS.TTL
  return COLORS.MUTED
}

export default function Act3Traceroute({ state, origin }) {
  const pop = state?.pop || SUMMARY_POSITIONS
  const stage = state?.stage || SUMMARY_STAGE
  const hop1Shown = state?.hop1Shown ?? true
  const hop2Shown = state?.hop2Shown ?? true
  const hop3Shown = state?.hop3Shown ?? true
  const rows = ACT3_CASE.hops.filter((_, i) => [hop1Shown, hop2Shown, hop3Shown][i])

  return withOrigin(
    <>
      <ActChrome state={state} />

      {stage !== 'tr-intro' && stage !== 'tr-after' && (
        <g transform={tos(pop, 'ttlPacket', 0, 0)} opacity={oop(pop, 'ttlPacket')}>
          <circle r={16} fill={COLORS.TTL} />
          <text x={0} y={4} textAnchor="middle" fontSize={9} fontWeight={700} fontFamily="monospace" fill={COLORS.BG}>TTL</text>
        </g>
      )}

      {stage !== 'tr-intro' && (
        <g transform={tos(pop, 'hopTable', 0, 0)} opacity={oop(pop, 'hopTable')}>
          <rect x={-190} y={-90} width={380} height={180} rx={12} fill={COLORS.PANEL} stroke={COLORS.TTL} strokeWidth={2} />
          <text x={-166} y={-64} fontSize={11} fontWeight={700} fontFamily="sans-serif" fill={COLORS.TTL}>TRACEROUTE HOPS</text>
          {rows.map((h, i) => (
            <text key={h.ttl} x={-166} y={-38 + i * 26} fontSize={10.5} fontFamily="monospace" fill={statusColor(h.status)}>
              {h.ttl}  {h.ip}  {h.label}
            </text>
          ))}
        </g>
      )}
    </>,
    origin,
  )
}
