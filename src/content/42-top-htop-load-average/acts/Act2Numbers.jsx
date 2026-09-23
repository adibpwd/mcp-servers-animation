// src/content/42-top-htop-load-average/acts/Act2Numbers.jsx
// ACT 2 — Membaca 3 Angka Misterius (1m, 5m, 15m).
// Tiga kartu angka Load Average + panah tren (dari 3.50 turun ke 0.50 —
// beban server sedang mereda menuju sekarang).
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import { tos, oop, withOrigin } from './common'
import { AXIS_X, COLORS, LOAD_NUMBERS, NUMBERS_Y, TREND_Y } from '../data'

const CARD_W = 168
const OFFSETS = [-190, 0, 190]

function NumberCard({ x, y, item }) {
  const color = COLORS[item.colorKey]
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x={-CARD_W / 2} y={-58} width={CARD_W} height={116} rx={14} fill={COLORS.PANEL} stroke={color} strokeWidth={2} filter="url(#shadow)" />
      <text x={0} y={-30} textAnchor="middle" fontSize={9} fontWeight={700} fontFamily="monospace" letterSpacing={1} fill={COLORS.MUTED}>{item.label}</text>
      <text x={0} y={20} textAnchor="middle" fontSize={34} fontWeight={900} fontFamily="monospace" fill={color}>{item.value.toFixed(2)}</text>
      <text x={0} y={44} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={COLORS.MUTED}>{item.key}</text>
    </g>
  )
}

function TrendArrow({ x, y }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <path d="M -220 -18 C -80 30, 80 30, 220 -18" fill="none" stroke={COLORS.SUCCESS} strokeWidth={3} strokeLinecap="round" markerEnd="url(#trendArrowHead)" />
      <text x={0} y={40} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily="sans-serif" fill={COLORS.SUCCESS}>Beban sedang mereda</text>
    </g>
  )
}

export default function Act2Numbers({ state, origin }) {
  const pop = state?.pop

  return withOrigin(
    <>
      {LOAD_NUMBERS.map((item, i) => (
        <g key={item.key}
          transform={tos(pop, `numberCard${i}`, AXIS_X + OFFSETS[i], NUMBERS_Y)}
          opacity={oop(pop, `numberCard${i}`)}>
          <NumberCard x={0} y={0} item={item} />
        </g>
      ))}

      <g transform={tos(pop, 'trendArrow', AXIS_X, TREND_Y)} opacity={oop(pop, 'trendArrow')}>
        <TrendArrow x={0} y={0} />
      </g>
    </>,
    origin,
  )
}
