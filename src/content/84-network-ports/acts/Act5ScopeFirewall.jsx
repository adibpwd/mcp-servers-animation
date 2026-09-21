// src/content/84-network-ports/acts/Act5ScopeFirewall.jsx
// ACT 5 — Scope dan Firewall (`scope-dan-policy`).
// Packet BARU dari jaringan luar naik lewat bind-scope lalu policy gate,
// baru diteruskan ke listener yang SAMA (callback ke Act 2).

import { Spine, Packets, Badges, LOWER_TOP } from './common'
import { COLORS, BIND_SCOPES, FIREWALL_OUTCOME, PRIMARY_LANE_ID } from '../data'

export const SUMMARY_STATE = {
  glow: { host: 1, [`lane-${PRIMARY_LANE_ID}`]: 1, listener: 1, gateScope: 1, gatePolicy: 1 },
  packets: {},
  badge: {},
}

export default function Act5ScopeFirewall({ state }) {
  const s = { ...SUMMARY_STATE, ...state }
  const activeScope = BIND_SCOPES.find(b => b.active)
  return (
    <>
      <Spine state={s} phaseIdx={4} />
      <Packets state={s} keys={['ext']} />

      <g transform={`translate(140, ${LOWER_TOP + 40})`} opacity={s.packets?.ext ? 1 : 0.6}>
        <rect x={-90} y={-24} width={180} height={48} rx={10} fill={COLORS.PANEL} stroke={COLORS.PACKET_EXT} strokeWidth={1.4} />
        <text x={0} y={5} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="sans-serif" fill={COLORS.TEXT}>
          Jaringan Luar
        </text>
      </g>
      {/* Konteks bind scope aktif & hasil policy — dead-field audit §1.G */}
      <text x={366} y={LOWER_TOP + 110} textAnchor="middle" fontSize={10} fontFamily="sans-serif" fill={COLORS.MUTED}>
        {activeScope?.label} ({activeScope?.reach}) — {FIREWALL_OUTCOME.reason}
      </text>

      <Badges state={s} />
    </>
  )
}
