// src/content/94-domain-to-server/acts/Act2ConnectEdge.jsx
// ACT 2 — Connect to Edge: browser tahu IP, HTTPS request packet berangkat
// dan tiba di edge gate (:443).
// Browser & DNS ikut dirender di sini karena keduanya persisten (tidak
// pernah di-popOut) — lihat docs/standardizations/07-act-scene-pattern.md
// §5 langkah 2 & pola ActChrome di 44-ssh/acts/common.jsx.
// Pola "1 act = 1 file".

import { ZONES } from '../data'
import { BrowserIcon, DNSIcon, EdgeGate, RequestPacket, Spine } from './common'

export const SUMMARY_STAGE = 'reached-edge'
export const SUMMARY_STATE = {
  browserVisible: true,
  browserLoading: false,
  browserHasPage: false,
  dnsVisible: true,
  dnsActive: false,
  edgeVisible: true,
  edgeActive: true,
  requestPacketVisible: false,
  requestPacketPos: { x: ZONES.EDGE.x, y: ZONES.EDGE.y },
  spineVisible: false,
}

export default function Act2ConnectEdge({ state }) {
  const s = { ...SUMMARY_STATE, ...state }
  return (
    <>
      <Spine visible={s.spineVisible} />
      <BrowserIcon visible={s.browserVisible} loading={s.browserLoading} hasPage={s.browserHasPage} />
      <DNSIcon visible={s.dnsVisible} active={s.dnsActive} />
      <EdgeGate visible={s.edgeVisible} active={s.edgeActive} />
      <RequestPacket visible={s.requestPacketVisible} x={s.requestPacketPos.x} y={s.requestPacketPos.y} />
    </>
  )
}
