// src/content/46-ping-traceroute/acts/Act2Ping.jsx
// ACT 2 — Memantulkan Bola dengan `ping`.
// Elemen: echoPacket (travel client<->server), rttBadge, samplesCard
// (daftar RTT 3 sampel), verdictBadge ("stabil"). Stage live: ping-*.
// Mode summary (tanpa props): momen akhir — samplesCard + verdict tampil.
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import { tos, oop, ActChrome, withOrigin } from './common'
import { NEAR_CLIENT, SAMPLES_PT, COLORS, ACT2_CASE } from '../data'

export const SUMMARY_STAGE = 'ping-after'
export const SUMMARY_POSITIONS = {
  client: { x: 0, y: 0, scale: 1, opacity: 1 },
  server: { x: 0, y: 0, scale: 1, opacity: 1 },
  hostLabel: { x: 0, y: 0, scale: 1, opacity: 1 },
  samplesCard: { x: SAMPLES_PT.x, y: SAMPLES_PT.y, scale: 1, opacity: 1 },
}

export default function Act2Ping({ state, origin }) {
  const pop = state?.pop || SUMMARY_POSITIONS
  const stage = state?.stage || SUMMARY_STAGE
  const verdictOn = state?.verdictOn ?? true

  return withOrigin(
    <>
      <ActChrome state={state} />

      {(stage === 'ping-send' || stage === 'ping-reply') && (
        <g transform={tos(pop, 'echoPacket', 0, 0)} opacity={oop(pop, 'echoPacket')}>
          <circle r={18} fill={COLORS.ECHO} />
          <text x={0} y={4} textAnchor="middle" fontSize={9} fontWeight={700} fontFamily="monospace" fill={COLORS.BG}>ICMP</text>
        </g>
      )}

      {(stage === 'ping-measure' || stage === 'ping-verdict' || stage === 'ping-after') && (
        <g transform={tos(pop, 'samplesCard', 0, 0)} opacity={oop(pop, 'samplesCard')}>
          <rect x={-150} y={-70} width={300} height={140} rx={12} fill={COLORS.PANEL} stroke={COLORS.ECHO} strokeWidth={2} />
          <text x={-130} y={-46} fontSize={11} fontWeight={700} fontFamily="sans-serif" fill={COLORS.ECHO}>RTT (ROUND TRIP TIME)</text>
          {ACT2_CASE.samples.map((s, i) => (
            <text key={s.seq} x={-130} y={-22 + i * 22} fontSize={11} fontFamily="monospace" fill={COLORS.TEXT}>
              seq={s.seq}  time={s.rtt}
            </text>
          ))}
          {verdictOn && (stage === 'ping-verdict' || stage === 'ping-after') && (
            <text x={-130} y={54} fontSize={10.5} fontWeight={700} fontFamily="sans-serif" fill={COLORS.ECHO}>{ACT2_CASE.verdictLabel}</text>
          )}
        </g>
      )}
    </>,
    origin,
  )
}
