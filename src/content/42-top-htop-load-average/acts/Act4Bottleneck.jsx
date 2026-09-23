// src/content/42-top-htop-load-average/acts/Act4Bottleneck.jsx
// ACT 4 — CPU Bound vs I/O Wait (Disk Bottleneck).
// Dua panel %Cpu(s) ala top: proses hitung berat (CPU Bound, %us tinggi)
// vs proses menunggu disk (I/O Wait, %wa tinggi).
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import { tos, oop, withOrigin } from './common'
import {
  AXIS_X, COLORS, COMPARE_Y, CPU_BOUND_STATS, IO_WAIT_STATS,
} from '../data'

const PANEL_W = 560
const BAR_H = 26

function StatBar({ stats, highlightKey, highlightColor }) {
  const segments = [
    { key: 'us', label: 'us', value: stats.us, color: COLORS.CPU },
    { key: 'sy', label: 'sy', value: stats.sy, color: COLORS.MEM },
    { key: 'wa', label: 'wa', value: stats.wa, color: COLORS.IOWAIT },
  ]
  let cursor = -PANEL_W / 2
  return (
    <g>
      <rect x={-PANEL_W / 2} y={0} width={PANEL_W} height={BAR_H} rx={8} fill={COLORS.BG} stroke={COLORS.BORDER} strokeWidth={1} />
      {segments.map((seg) => {
        const w = (seg.value / 100) * PANEL_W
        const rect = <rect key={seg.key} x={cursor} y={0} width={w} height={BAR_H} rx={seg.key === 'us' ? 8 : 0}
          fill={seg.key === highlightKey ? highlightColor : seg.color}
          opacity={seg.key === highlightKey ? 1 : 0.5} />
        cursor += w
        return rect
      })}
    </g>
  )
}

function ComparePanel({ x, y, title, stats, dominantKey, color }) {
  return (
    <g transform={`translate(${x}, ${y})`}>
      <rect x={-PANEL_W / 2 - 20} y={-56} width={PANEL_W + 40} height={140} rx={14} fill={COLORS.PANEL} stroke={color} strokeWidth={2} filter="url(#shadow)" />
      <text x={0} y={-32} textAnchor="middle" fontSize={13} fontWeight={900} fontFamily="monospace" letterSpacing={1} fill={color}>{title}</text>
      <g transform="translate(0, -12)"><StatBar stats={stats} highlightKey={dominantKey} highlightColor={color} /></g>
      <text x={0} y={40} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={COLORS.MUTED}>
        %us {stats.us} · %sy {stats.sy} · %wa {stats.wa}
      </text>
    </g>
  )
}

export default function Act4Bottleneck({ state, origin }) {
  const pop = state?.pop
  const panelBY = COMPARE_Y + 180
  const conclusionY = COMPARE_Y + 360

  return withOrigin(
    <>
      <g transform={tos(pop, 'cpuBoundPanel', AXIS_X, COMPARE_Y)} opacity={oop(pop, 'cpuBoundPanel')}>
        <ComparePanel x={0} y={0} title="CPU BOUND" stats={CPU_BOUND_STATS} dominantKey="us" color={COLORS.CPUBOUND} />
      </g>
      <g transform={tos(pop, 'ioWaitPanel', AXIS_X, panelBY)} opacity={oop(pop, 'ioWaitPanel')}>
        <ComparePanel x={0} y={0} title="I/O WAIT" stats={IO_WAIT_STATS} dominantKey="wa" color={COLORS.IOWAIT} />
      </g>

      <g transform={tos(pop, 'conclusion', AXIS_X, conclusionY)} opacity={oop(pop, 'conclusion')}>
        <rect x={-260} y={-28} width={520} height={56} rx={12} fill={COLORS.PANEL} stroke={COLORS.IOWAIT} strokeWidth={2} filter="url(#shadow)" />
        <text x={0} y={6} textAnchor="middle" fontSize={13} fontWeight={700} fontFamily="sans-serif" fill={COLORS.TEXT}>
          %wa tinggi → disk jadi bottleneck
        </text>
      </g>
    </>,
    origin,
  )
}
