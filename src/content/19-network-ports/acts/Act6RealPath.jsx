// src/content/84-network-ports/acts/Act6RealPath.jsx
// ACT 6 — Jalur Nyata (`edge-ke-backend`).
// Packet client publik lewat NAT/LB ke backend; health signal muncul
// bertahap SETELAH respons (open → responds → healthy tetap "?").

import { Spine, Packets, LOWER_TOP, BW, glowOf, IconGlobe, IconRouter, IconTower } from './common'
import { COLORS, REAL_PATH_HOPS, HEALTH_RESULT, PRIMARY_LANE_ID } from '../data'

export const SUMMARY_STATE = {
  glow: {
    host: 1, [`lane-${PRIMARY_LANE_ID}`]: 1, listener: 1,
    'hop-edge': 1, 'hop-nat': 1, 'hop-backend': 1,
    'health-open': 1, 'health-responds': 1, 'health-healthy': 1,
  },
  packets: {},
  badge: {},
}

export default function Act6RealPath({ state }) {
  const s = { ...SUMMARY_STATE, ...state }
  const G = (id) => glowOf(s, id)
  const hopY = LOWER_TOP + 40
  const hopX = (i) => 90 + i * ((BW - 180) / (REAL_PATH_HOPS.length - 1))
  const glowIds = ['hop-edge', 'hop-nat', 'hop-backend']
  const healthRows = [
    { id: 'open', label: 'Port terbuka', ok: HEALTH_RESULT.open },
    { id: 'responds', label: 'Merespons', ok: HEALTH_RESULT.responds },
    { id: 'healthy', label: 'Sehat & valid', ok: HEALTH_RESULT.healthy },
  ]

  return (
    <>
      <Spine state={s} phaseIdx={5} />
      <Packets state={s} keys={['pub']} />

      {REAL_PATH_HOPS.map((h, i) => {
        const active = G(glowIds[i]) > 0.4
        const HopIcon = [IconGlobe, IconRouter, IconTower][i] || IconGlobe
        return (
          <g key={h.id} transform={`translate(${hopX(i)}, ${hopY})`}>
            <rect x={-95} y={-26} width={190} height={52} rx={10}
              fill={active ? COLORS.NAT : COLORS.PANEL} stroke={COLORS.NAT} strokeWidth={active ? 0 : 1.3}
              opacity={active ? 1 : 0.45} />
            <g transform="translate(-87, -9)">
              <HopIcon size={16} color={active ? COLORS.BG : COLORS.MUTED} />
            </g>
            <text x={8} y={5} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="sans-serif"
              fill={active ? COLORS.BG : COLORS.TEXT}>{h.label}</text>
            {i < REAL_PATH_HOPS.length - 1 && (
              <text x={(hopX(i + 1) - hopX(i)) / 2} y={5} textAnchor="middle" fontSize={16} fill={COLORS.MUTED}>→</text>
            )}
          </g>
        )
      })}


      {healthRows.map((h, i) => {
        const strength = G(`health-${h.id}`)
        const shown = strength > 0.4
        const color = h.ok ? COLORS.ALLOW : COLORS.HEALTH
        return (
          <g key={h.id} transform={`translate(0, ${hopY + 90 + i * 66})`} opacity={shown ? 1 : 0.3}>
            <rect x={90} width={BW - 180} height={54} rx={10} fill={COLORS.PANEL} stroke={color} strokeWidth={shown ? 2 : 1.2} />
            <circle cx={124} cy={27} r={12} fill={shown ? color : COLORS.BORDER} />
            <text x={124} y={32} textAnchor="middle" fontSize={12} fontWeight={800} fontFamily="sans-serif" fill={COLORS.BG}>
              {h.ok ? '✓' : '?'}
            </text>
            <text x={150} y={32} fontSize={13} fontFamily="sans-serif" fill={COLORS.TEXT}>{h.label}</text>
          </g>
        )
      })}
    </>
  )
}
