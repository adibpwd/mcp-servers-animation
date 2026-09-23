// src/content/46-ping-traceroute/acts/Act4Breakpoint.jsx
// ACT 4 — Menemukan Titik Putus / Firewall Drop.
// Elemen: hopTable (5 baris: hop1-4 normal, hop5 "* * * timed out" merah)
// + alert dot berdenyut. Stage live: bp-*. Mode summary (tanpa props):
// tabel penuh, breakShown + alertOn menyala.
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import { tos, oop, ActChrome, withOrigin } from './common'
import { HOP_TABLE_PT, COLORS, ACT4_CASE } from '../data'

export const SUMMARY_STAGE = 'bp-after'
export const SUMMARY_POSITIONS = {
  client: { x: 0, y: 0, scale: 1, opacity: 1 },
  server: { x: 0, y: 0, scale: 1, opacity: 0.35 },
  hostLabel: { x: 0, y: 0, scale: 1, opacity: 1 },
  hopTable: { x: HOP_TABLE_PT.x, y: HOP_TABLE_PT.y, scale: 1, opacity: 1 },
}

export default function Act4Breakpoint({ state, origin }) {
  const pop = state?.pop || SUMMARY_POSITIONS
  const stage = state?.stage || SUMMARY_STAGE
  const hopsShown = state?.hopsShown ?? 4
  const breakShown = state?.breakShown ?? true
  const alertOn = state?.alertOn ?? true
  const rows = ACT4_CASE.hops.slice(0, hopsShown)

  return withOrigin(
    <>
      <ActChrome state={{ ...state, channelDim: true }} />

      {(
        <g transform={tos(pop, 'hopTable', 0, 0)} opacity={oop(pop, 'hopTable')}>
          <rect x={-190} y={-110} width={380} height={220} rx={12}
            fill={COLORS.PANEL} stroke={breakShown ? COLORS.RISK : COLORS.TTL} strokeWidth={2} />
          <text x={-166} y={-84} fontSize={11} fontWeight={700} fontFamily="sans-serif"
            fill={breakShown ? COLORS.RISK : COLORS.TTL}>TRACEROUTE HOPS</text>
          {rows.map((h, i) => (
            <text key={h.ttl} x={-166} y={-58 + i * 26} fontSize={10.5} fontFamily="monospace" fill={COLORS.MUTED}>
              {h.ttl}  {h.ip}  {h.label}
            </text>
          ))}
          {breakShown && (
            <text x={-166} y={-58 + 4 * 26} fontSize={10.5} fontWeight={700} fontFamily="monospace" fill={COLORS.RISK}>
              5  {ACT4_CASE.hops[4].ip}  {ACT4_CASE.hops[4].label}
            </text>
          )}
          {alertOn && <circle cx={160} cy={-84} r={7} fill={COLORS.RISK} />}
        </g>
      ) : null}
    </>,
    origin,
  )
}
