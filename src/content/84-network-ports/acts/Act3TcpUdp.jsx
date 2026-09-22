// src/content/84-network-ports/acts/Act3TcpUdp.jsx
// ACT 3 — TCP dan UDP (`tcp-vs-udp`).
// TCP: packetMain ping-pong SYN/SYN-ACK/ACK dekat listener (koneksi sama
// yang sudah established Act 2). UDP: packet terpisah, datagram lurus
// tanpa handshake — kontras eksplisit, actor baru sesuai revisi.

import { Spine, Packets, Badges, POS, LOWER_TOP, BW, IconHandshake, IconRocket } from './common'
import { COLORS, TCP_STEPS, UDP_DATAGRAM, PRIMARY_LANE_ID } from '../data'

export const SUMMARY_STATE = {
  glow: { host: 1, [`lane-${PRIMARY_LANE_ID}`]: 1, listener: 1 },
  packets: {},
  badge: {},
  tcpStep: null,
  udpStep: 'apply',
}

export default function Act3TcpUdp({ state }) {
  const s = { ...SUMMARY_STATE, ...state }
  const udpSrc = { x: 150, y: LOWER_TOP + 60 }
  const udpDst = { x: BW - 150, y: LOWER_TOP + 60 }
  const stepInfo = TCP_STEPS.find(t => t.id === s.tcpStep)

  return (
    <>
      <Spine state={s} phaseIdx={2} />
      <Packets state={s} keys={['main', 'udp']} />

      {stepInfo && (
        <g transform={`translate(${POS.listener.x}, ${POS.listener.y - 55})`}>
          <rect x={-70} y={-16} width={140} height={32} rx={8} fill={COLORS.TCP} />
          <g transform="translate(-64, -8)"><IconHandshake size={14} color={COLORS.BG} /></g>
          <text x={6} y={5} textAnchor="middle" fontSize={12} fontWeight={800} fontFamily="monospace" fill={COLORS.BG}>
            {stepInfo.label}
          </text>
        </g>
      )}

      <line x1={udpSrc.x} y1={udpSrc.y} x2={udpDst.x} y2={udpDst.y}
        stroke={COLORS.UDP} strokeWidth={1.5} strokeDasharray="5 6" opacity={s.udpStep ? 1 : 0.3} />
      <g transform={`translate(${udpSrc.x}, ${udpSrc.y})`}>
        <rect x={-50} y={-20} width={100} height={40} rx={8} fill={COLORS.PANEL} stroke={COLORS.UDP} strokeWidth={1.3} />
        <text x={0} y={5} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="sans-serif" fill={COLORS.TEXT}>Client</text>
      </g>
      <g transform={`translate(${udpDst.x}, ${udpDst.y})`}>
        <rect x={-60} y={-20} width={120} height={40} rx={8} fill={COLORS.PANEL} stroke={COLORS.UDP}
          strokeWidth={s.udpStep === 'apply' ? 2.2 : 1.3} />
        <g transform="translate(-52, -8)"><IconRocket size={14} color={COLORS.UDP} /></g>
        <text x={8} y={5} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="sans-serif" fill={COLORS.TEXT}>
          {UDP_DATAGRAM.label} :{UDP_DATAGRAM.port}
        </text>
      </g>

      <Badges state={s} />
    </>
  )
}
