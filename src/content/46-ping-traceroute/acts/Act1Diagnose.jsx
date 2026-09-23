// src/content/46-ping-traceroute/acts/Act1Diagnose.jsx
// ACT 1 — Website Tidak Merespons: Siapa yang Salah?
// Elemen: questionCard (3 opsi tersangka: WiFi lokal / ISP / server
// tujuan — belum ada yang terpilih, misteri belum terpecahkan). Channel
// digambar redup (belum ada diagnosis). Stage live: 'timeout' | 'question'.
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import { tos, oop, ActChrome, withOrigin } from './common'
import { MID, COLORS, ACT1_CASE } from '../data'

export const SUMMARY_STAGE = 'question'
export const SUMMARY_POSITIONS = {
  client: { x: 0, y: 0, scale: 1, opacity: 1 },
  server: { x: 0, y: 0, scale: 1, opacity: 0.35 },
  hostLabel: { x: 0, y: 0, scale: 1, opacity: 1 },
  questionCard: { x: MID.x, y: MID.y, scale: 1, opacity: 1 },
}

export default function Act1Diagnose({ state, origin }) {
  const pop = state?.pop || SUMMARY_POSITIONS
  const stage = state?.stage || SUMMARY_STAGE

  return withOrigin(
    <>
      <ActChrome state={{ ...state, channelActive: false }} />

      {stage === 'question' && (
        <g transform={tos(pop, 'questionCard', 0, 0)} opacity={oop(pop, 'questionCard')}>
          <rect x={-160} y={-90} width={320} height={180} rx={12} fill={COLORS.PANEL} stroke={COLORS.RISK} strokeWidth={2} />
          <text x={0} y={-58} textAnchor="middle" fontSize={13} fontWeight={700} fontFamily="sans-serif" fill={COLORS.RISK}>?</text>
          {ACT1_CASE.options.map((opt, i) => (
            <g key={opt} transform={`translate(0, ${-24 + i * 40})`}>
              <rect x={-130} y={-16} width={260} height={32} rx={8} fill={COLORS.BG} stroke={COLORS.BORDER} strokeWidth={1.5} />
              <text x={0} y={5} textAnchor="middle" fontSize={11} fontFamily="sans-serif" fill={COLORS.MUTED}>{opt}</text>
            </g>
          ))}
        </g>
      )}
    </>,
    origin,
  )
}
