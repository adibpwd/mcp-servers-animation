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
        <g transform="translate(-58, -9)"><IconClient size={18} color={COLORS.PACKET_MAIN} /></g>
        <text x={6} y={5} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily="sans-serif" fill={COLORS.TEXT}>CLIENT</text>
      </g>

      <g transform={`translate(${POS.host.x}, ${POS.host.y})`} opacity={0.55 + G('host') * 0.45}>
        <rect x={-130} y={-26} width={260} height={52} rx={11} fill={COLORS.PANEL} stroke={COLORS.IP} strokeWidth={G('host') > 0.5 ? 2.2 : 1.3} />
        <g transform="translate(-118, -9)"><IconServer size={18} color={COLORS.IP} /></g>
        <text x={9} y={-5} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily="monospace" fill={COLORS.IP}>{CLIENT_DEST_IP}</text>
        <text x={9} y={14} textAnchor="middle" fontSize={10} fontFamily="sans-serif" fill={COLORS.MUTED}>satu host, satu IP</text>
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
              <g transform={`translate(${LANE_W / 2 - 8}, 6)`}>
                {laneIcon(lane.id, active ? COLORS.BG : COLORS.MUTED)}
              </g>
              <text x={LANE_W / 2} y={44} textAnchor="middle" fontSize={15} fontWeight={800} fontFamily="monospace"
                fill={active ? COLORS.BG : COLORS.TEXT}>{lane.label}</text>
              <text x={LANE_W / 2} y={60} textAnchor="middle" fontSize={9} fontFamily="sans-serif"
                fill={active ? COLORS.BG : COLORS.MUTED}>{lane.service}</text>
            </g>
          )
        })}
      </g>

      <g transform={`translate(${POS.listener.x}, ${POS.listener.y})`} opacity={0.5 + G('listener') * 0.5}>
        <rect x={-140} y={-32} width={280} height={64} rx={12} fill={COLORS.PANEL}
          stroke={COLORS.LISTENER} strokeWidth={G('listener') > 0.4 ? 2.4 : 1.3} />
        <g transform="translate(-128, -32)">
          <IconEar size={16} color={G('listener') > 0.4 ? COLORS.LISTENER : COLORS.MUTED} />
        </g>
        <text x={9} y={-6} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily="sans-serif" fill={COLORS.TEXT}>
          {LISTENERS[0].label} {LISTENERS[0].addr}
        </text>
        <text x={9} y={16} textAnchor="middle" fontSize={11} fontWeight={800} fontFamily="monospace"
          fill={G('listener') > 0.4 ? COLORS.LISTENER : COLORS.MUTED}>
          {G('listener') > 0.4 ? 'LISTEN → ACTIVE' : 'LISTEN'}
        </text>
      </g>

      <g transform={`translate(${POS.gate.x}, ${POS.gate.y})`} opacity={(phaseIdx ?? 5) >= 4 ? 1 : 0.35}>
        <rect x={-160} y={-26} width={320} height={52} rx={11} fill={COLORS.PANEL} stroke={COLORS.FIREWALL} strokeWidth={1.3} />
        <g transform="translate(-152, -9)">
          <IconShield size={18} color={G('gatePolicy') > 0.4 ? COLORS.ALLOW : COLORS.FIREWALL} />
        </g>
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

// REVISI-04: sebelumnya badge generic (before/travel/after tiap Act) tidak
// ada entry eksplisit di sini, jatuh ke fallback lama {x:BW/2, y:8} — selalu
// nongkrong di paling atas canvas walau aksi sedang terjadi di Listener
// (y 335), Gate (y 430), atau lower zone (y 480+). Sekarang tiap id generic
// dapat anchor dekat node yang relevan untuk Act tsb.
const badgePos = (id) => {
  const map = {
    hostIp: { x: POS.host.x, y: POS.host.y + 48 },
    laneApply: { x: POS.lane.x, y: POS.lane.y + 60 },
    listenerApply: { x: POS.listener.x, y: POS.listener.y + 62 },
    srcPortBadge: { x: (POS.client.x + POS.host.x) / 2 - 70, y: (POS.client.y + POS.host.y) / 2 },
    dstPortBadge: { x: POS.listener.x + 110, y: POS.listener.y },
    gateApply: { x: POS.gate.x, y: POS.gate.y + 48 },
    udpApply: { x: BW - 150, y: LOWER_TOP + 105 },
    // Act 1 — dekat host (before/travel), lalu dekat lane setelah apply
    hostBefore: { x: POS.host.x, y: POS.host.y + 40 },
    travel1: { x: POS.host.x, y: POS.host.y + 40 },
    act1After: { x: POS.lane.x, y: POS.lane.y + 40 },
    // Act 2 — dekat listener (satu-satunya fokus act ini)
    act2Before: { x: POS.listener.x, y: POS.listener.y + 40 },
    travel2: { x: POS.listener.x, y: POS.listener.y + 40 },
    act2After: { x: POS.listener.x, y: POS.listener.y + 40 },
    // Act 3 — dekat area TCP/UDP di lower zone
    act3Before: { x: BW / 2, y: LOWER_TOP + 140 },
    tcpApply: { x: BW / 2, y: LOWER_TOP + 140 },
    act3After: { x: BW / 2, y: LOWER_TOP + 140 },
    // Act 4 — di antara client ephemeral port (atas) dan listener (bawah)
    act4Before: { x: BW / 2, y: (POS.client.y + POS.listener.y) / 2 },
    act4Apply: { x: BW / 2, y: (POS.client.y + POS.listener.y) / 2 },
    act4After: { x: BW / 2, y: (POS.client.y + POS.listener.y) / 2 },
    // Act 5 — dekat firewall gate
    act5Before: { x: POS.gate.x, y: POS.gate.y + 45 },
    extSrcBadge: { x: 140, y: LOWER_TOP + 10 },
    act5After: { x: POS.gate.x, y: POS.gate.y + 45 },
    // Act 6 — dekat hop chain/health di lower zone
    act6Before: { x: BW / 2, y: LOWER_TOP + 260 },
    travel6: { x: BW / 2, y: LOWER_TOP + 260 },
    act6Apply: { x: BW / 2, y: LOWER_TOP + 260 },
    act6After: { x: BW / 2, y: LOWER_TOP + 260 },
  }
  return map[id] || { x: BW / 2, y: 30 }
}

export function Badges({ state }) {
  const badge = state?.badge || {}
  // FEEDBACK: badge dulu string biasa (on/off instan) — sekarang object
  // { text, opacity } yang di-fade oleh setBadgeAt/clearBadge di Animation.jsx.
  return Object.entries(badge).filter(([, v]) => v && v.text).map(([id, v]) => {
    const p = badgePos(id)
    const y = Math.max(40, Math.min(850, p.y))
    const w = Math.min(300, v.text.length * 7.2 + 24)
    return (
      <g key={id} transform={`translate(${p.x}, ${y}) scale(${0.9 + v.opacity * 0.1})`} opacity={v.opacity}>
        <rect x={-w / 2} y={-15} width={w} height={30} rx={8} fill="rgba(7,9,19,0.88)" stroke={COLORS.BORDER} strokeWidth={1} />
        <text x={0} y={5} textAnchor="middle" fontSize={13} fontWeight={600} fontFamily="sans-serif" fill={COLORS.TEXT}>
          {v.text}
        </text>
      </g>
    )
  })
}

// ═══════════════════════════════════════════════
// REVISI-03 — Icon SVG inline (bukan folder icons/, konsisten dengan
// 44-ssh/17-rest-api). Stroke-based, viewBox 0 0 24 24, warna via prop.
// ═══════════════════════════════════════════════
export function IconClient({ size = 18, color = COLORS.PACKET_MAIN }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="4" width="20" height="12" rx="2" />
      <path d="M2 20h20" />
    </svg>
  )
}

export function IconServer({ size = 18, color = COLORS.IP }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="7" rx="1.5" />
      <rect x="2" y="14" width="20" height="7" rx="1.5" />
      <circle cx="6" cy="6.5" r="1" fill={color} stroke="none" />
      <circle cx="6" cy="17.5" r="1" fill={color} stroke="none" />
    </svg>
  )
}

export function IconLock({ size = 16, color = COLORS.ALLOW }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" />
      <path d="M7 11V7a5 5 0 0110 0v4" />
    </svg>
  )
}

export function IconGlobe({ size = 16, color = COLORS.MUTED }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 010 18a14 14 0 010-18" />
    </svg>
  )
}

export function IconDatabase({ size = 16, color = COLORS.PORT }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <ellipse cx="12" cy="5" rx="9" ry="3" />
      <path d="M21 12c0 1.66-4 3-9 3s-9-1.34-9-3" />
      <path d="M3 5v14c0 1.66 4 3 9 3s9-1.34 9-3V5" />
    </svg>
  )
}

export function IconSsh({ size = 16, color = COLORS.PORT }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="18" rx="2" />
      <polyline points="6 9 10 12 6 15" />
      <line x1="12" y1="15" x2="17" y2="15" />
    </svg>
  )
}

export function IconShield({ size = 18, color = COLORS.FIREWALL }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  )
}

export function IconEar({ size = 16, color = COLORS.LISTENER }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M8 12a6 6 0 1112 0c0 4-3 5-3 8a3 3 0 01-6 0" />
      <path d="M12 12a2 2 0 012 2" />
    </svg>
  )
}

export function IconHandshake({ size = 16, color = COLORS.TCP }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 12l5-4 4 2 3-2 5 4" />
      <path d="M8 10l3 6h3l3-6" />
    </svg>
  )
}

export function IconRocket({ size = 16, color = COLORS.UDP }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 20l4-1 9-9a3 3 0 00-4-4l-9 9-1 4z" />
      <path d="M14 6l4 4" />
    </svg>
  )
}

export function IconRouter({ size = 18, color = COLORS.NAT }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="14" width="20" height="7" rx="1.5" />
      <path d="M7 14V9a5 5 0 0110 0v5" />
      <circle cx="7" cy="17.5" r="1" fill={color} stroke="none" />
      <circle cx="12" cy="17.5" r="1" fill={color} stroke="none" />
    </svg>
  )
}

export function IconTower({ size = 18, color = COLORS.NAT }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="6" y="2" width="12" height="20" rx="1.5" />
      <line x1="9" y1="7" x2="15" y2="7" />
      <line x1="9" y1="12" x2="15" y2="12" />
      <line x1="9" y1="17" x2="15" y2="17" />
    </svg>
  )
}

/** Lookup icon per lane id, dipakai Spine di PORT_LANES. */
export function laneIcon(laneId, color) {
  const map = {
    22: IconSsh, 80: IconGlobe, 443: IconLock, 3306: IconDatabase, 5432: IconDatabase,
  }
  const Icon = map[laneId] || IconGlobe
  return <Icon size={16} color={color} />
}
