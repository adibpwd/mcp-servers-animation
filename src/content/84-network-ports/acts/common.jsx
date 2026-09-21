// src/content/84-network-ports/acts/common.jsx
// ─────────────────────────────────────────────────────────────
// Helper bersama untuk file per-act (pola "1 act = 1 file", lihat
// docs/standardizations/07-act-scene-pattern.md).
//
// Beda dengan 44-ssh: topic ini pakai SATU spine PERSISTEN (client →
// IP host → port lane → listener → policy gate) yang tampil di
// SEMUA Act, bukan channel tunggal client↔server. `Spine` di sini
// setara `ActChrome` di 44-ssh — dipanggil oleh tiap ActN.jsx.
//
// Kontrak state (dikirim dari Animation.jsx, semua field opsional):
//   { glow, packets, badge, tcpStep, udpStep, phaseIdx }
//   - glow: { [nodeId]: 0..1 } kekuatan sorot node spine/hop/health
//   - packets: { main, ext, pub, udp } masing-masing { x,y,scale,opacity,color,label }
//   - badge: { [id]: string|null } teks near-element
// ─────────────────────────────────────────────────────────────

import React from 'react'
import { COLORS, PORT_LANES, PRIMARY_LANE_ID, CLIENT_DEST_IP, LISTENERS } from '../data'

export const BW = 732
export const LANE_GAP = 10
export const LANE_W = (BW - LANE_GAP * (PORT_LANES.length - 1)) / PORT_LANES.length
export const laneX = (i) => i * (LANE_W + LANE_GAP) + LANE_W / 2
export const PRIMARY_IDX = PORT_LANES.findIndex(l => l.id === PRIMARY_LANE_ID)

export const POS = {
  client: { x: BW / 2, y: 25 },
  host: { x: BW / 2, y: 115 },
  lane: { x: laneX(PRIMARY_IDX), y: 225 },
  listener: { x: laneX(PRIMARY_IDX), y: 335 },
  gate: { x: BW / 2, y: 430 },
}
export const LOWER_TOP = 480

export const glowOf = (state, id) => state?.glow?.[id] || 0

/** Bungkus scene act dengan origin translate (default {0,0}). */
export function withOrigin(children, origin = { x: 0, y: 0 }) {
  if (!origin || (origin.x === 0 && origin.y === 0)) return children
  return <g transform={`translate(${origin.x}, ${origin.y})`}>{children}</g>
}

/** Chrome persisten lintas-act: client → IP host → port lane → listener → gate. */
export function Spine({ state, phaseIdx }) {
  const G = (id) => glowOf(state, id)
  return (
    <>
      <line x1={POS.client.x} y1={POS.client.y + 22} x2={POS.host.x} y2={POS.host.y - 26}
        stroke={COLORS.BORDER} strokeWidth={2} strokeDasharray="4 5" opacity={0.5 + G('socketLine') * 0.5} />
      <line x1={POS.host.x} y1={POS.host.y + 26} x2={POS.lane.x} y2={POS.lane.y - 34}
        stroke={COLORS.BORDER} strokeWidth={2} strokeDasharray="4 5" opacity={0.4} />
      <line x1={POS.lane.x} y1={POS.lane.y + 34} x2={POS.listener.x} y2={POS.listener.y - 34}
        stroke={G('listener') > 0.4 ? COLORS.LISTENER : COLORS.BORDER} strokeWidth={2}
        opacity={0.4 + G('listener') * 0.5} />

      <g transform={`translate(${POS.client.x}, ${POS.client.y})`}>
        <rect x={-70} y={-18} width={140} height={36} rx={9} fill={COLORS.PANEL} stroke={COLORS.PACKET_MAIN} strokeWidth={1.4} />
        <text x={0} y={5} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily="sans-serif" fill={COLORS.TEXT}>CLIENT</text>
      </g>

      <g transform={`translate(${POS.host.x}, ${POS.host.y})`} opacity={0.55 + G('host') * 0.45}>
        <rect x={-130} y={-26} width={260} height={52} rx={11} fill={COLORS.PANEL} stroke={COLORS.IP} strokeWidth={G('host') > 0.5 ? 2.2 : 1.3} />
        <text x={0} y={-5} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily="monospace" fill={COLORS.IP}>{CLIENT_DEST_IP}</text>
        <text x={0} y={14} textAnchor="middle" fontSize={10} fontFamily="sans-serif" fill={COLORS.MUTED}>satu host, satu IP</text>
      </g>

      <g transform={`translate(0, ${POS.lane.y - 34})`}>
        {PORT_LANES.map((lane, i) => {
          const active = G(`lane-${lane.id}`) > 0.4
          const x = i * (LANE_W + LANE_GAP)
          return (
            <g key={lane.id} transform={`translate(${x}, 0)`}>
              <rect width={LANE_W} height={68} rx={9}
                fill={active ? COLORS.PORT : COLORS.PANEL}
                stroke={COLORS.PORT} strokeWidth={active ? 0 : 1.2}
                opacity={active ? 1 : 0.4} />
              <text x={LANE_W / 2} y={30} textAnchor="middle" fontSize={15} fontWeight={800} fontFamily="monospace"
                fill={active ? COLORS.BG : COLORS.TEXT}>{lane.label}</text>
              <text x={LANE_W / 2} y={48} textAnchor="middle" fontSize={9} fontFamily="sans-serif"
                fill={active ? COLORS.BG : COLORS.MUTED}>{lane.service}</text>
            </g>
          )
        })}
      </g>

      <g transform={`translate(${POS.listener.x}, ${POS.listener.y})`} opacity={0.5 + G('listener') * 0.5}>
        <rect x={-140} y={-32} width={280} height={64} rx={12} fill={COLORS.PANEL}
          stroke={COLORS.LISTENER} strokeWidth={G('listener') > 0.4 ? 2.4 : 1.3} />
        <text x={0} y={-6} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily="sans-serif" fill={COLORS.TEXT}>
          {LISTENERS[0].label} {LISTENERS[0].addr}
        </text>
        <text x={0} y={16} textAnchor="middle" fontSize={11} fontWeight={800} fontFamily="monospace"
          fill={G('listener') > 0.4 ? COLORS.LISTENER : COLORS.MUTED}>
          {G('listener') > 0.4 ? 'LISTEN → ACTIVE' : 'LISTEN'}
        </text>
      </g>

      <g transform={`translate(${POS.gate.x}, ${POS.gate.y})`} opacity={(phaseIdx ?? 5) >= 4 ? 1 : 0.35}>
        <rect x={-160} y={-26} width={320} height={52} rx={11} fill={COLORS.PANEL} stroke={COLORS.FIREWALL} strokeWidth={1.3} />
        <g opacity={0.4 + G('gateScope') * 0.6}>
          <circle cx={-100} cy={0} r={9} fill={G('gateScope') > 0.4 ? COLORS.ALLOW : COLORS.BORDER} />
          <text x={-82} y={4} fontSize={11} fontFamily="sans-serif" fill={COLORS.TEXT}>Bind scope</text>
        </g>
        <g opacity={0.4 + G('gatePolicy') * 0.6}>
          <circle cx={40} cy={0} r={9} fill={G('gatePolicy') > 0.4 ? COLORS.ALLOW : COLORS.BORDER} />
          <text x={58} y={4} fontSize={11} fontFamily="sans-serif" fill={COLORS.TEXT}>Policy</text>
        </g>
      </g>
    </>
  )
}

export function PacketDot({ p, id }) {
  if (!p) return null
  return (
    <g key={id} transform={`translate(${p.x}, ${p.y}) scale(${p.scale})`} opacity={p.opacity}>
      <circle r={16} fill={p.color} />
      <text x={0} y={4} textAnchor="middle" fontSize={9} fontWeight={800} fontFamily="monospace" fill={COLORS.BG}>
        {p.label}
      </text>
    </g>
  )
}

export function Packets({ state, keys = ['main', 'ext', 'pub', 'udp'] }) {
  const packets = state?.packets || {}
  return keys.map((k) => <PacketDot key={k} id={k} p={packets[k]} />)
}

const badgePos = (id) => {
  const map = {
    hostIp: { x: POS.host.x, y: POS.host.y + 48 },
    laneApply: { x: POS.lane.x, y: POS.lane.y + 60 },
    listenerApply: { x: POS.listener.x, y: POS.listener.y + 62 },
    srcPortBadge: { x: (POS.client.x + POS.host.x) / 2 - 70, y: (POS.client.y + POS.host.y) / 2 },
    dstPortBadge: { x: POS.listener.x + 110, y: POS.listener.y },
    gateApply: { x: POS.gate.x, y: POS.gate.y + 48 },
    udpApply: { x: BW - 150, y: LOWER_TOP + 105 },
  }
  return map[id] || { x: BW / 2, y: 8 }
}

export function Badges({ state }) {
  const badge = state?.badge || {}
  return Object.entries(badge).filter(([, v]) => v).map(([id, text]) => {
    const p = badgePos(id)
    const w = Math.min(300, text.length * 7.2 + 24)
    return (
      <g key={id} transform={`translate(${p.x}, ${p.y})`}>
        <rect x={-w / 2} y={-15} width={w} height={30} rx={8} fill="rgba(7,9,19,0.88)" stroke={COLORS.BORDER} strokeWidth={1} />
        <text x={0} y={5} textAnchor="middle" fontSize={13} fontWeight={600} fontFamily="sans-serif" fill={COLORS.TEXT}>
          {text}
        </text>
      </g>
    )
  })
}
