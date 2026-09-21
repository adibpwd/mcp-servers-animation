// src/content/94-domain-to-server/acts/Act3ProxyToApp.jsx
// ACT 3 — Proxy to App: proxy membaca request, routing beam menyala ke
// backend A. Browser/DNS/Edge ikut dirender karena persisten (lihat
// catatan Act2ConnectEdge.jsx dan docs/standardizations/07-act-scene-pattern.md).
// Pola "1 act = 1 file".

import { ZONES, COLORS } from '../data'
import {
  BrowserIcon, DNSIcon, EdgeGate, ProxyGate, BackendApp,
  RequestPacket, RoutingBeam, Spine,
} from './common'

export const SUMMARY_STAGE = 'routed'
export const SUMMARY_STATE = {
  browserVisible: true,
  browserLoading: false,
  browserHasPage: false,
  dnsVisible: true,
  edgeVisible: true,
  edgeActive: false,
  proxyVisible: true,
  proxyActive: false,
  backendAVisible: true,
  backendBVisible: true,
  backendAActive: true,
  requestPacketVisible: false,
  requestPacketPos: { x: ZONES.PROXY.x, y: ZONES.PROXY.y },
  routingBeamVisible: true,
  spineVisible: false,
}

export default function Act3ProxyToApp({ state }) {
  const s = { ...SUMMARY_STATE, ...state }
  return (
    <>
      <Spine visible={s.spineVisible} />
      {s.routingBeamVisible && (
        <RoutingBeam
          visible={true}
          fromX={ZONES.PROXY.x}
          fromY={ZONES.PROXY.y + 50}
          toX={ZONES.BACKEND_A.x}
          toY={ZONES.BACKEND_A.y - 40}
          color={COLORS.ORANGE}
        />
      )}
      <BrowserIcon visible={s.browserVisible} loading={s.browserLoading} hasPage={s.browserHasPage} />
      <DNSIcon visible={s.dnsVisible} active={false} />
      <EdgeGate visible={s.edgeVisible} active={s.edgeActive} />
      <RequestPacket visible={s.requestPacketVisible} x={s.requestPacketPos.x} y={s.requestPacketPos.y} />
      <ProxyGate visible={s.proxyVisible} active={s.proxyActive} />
      <BackendApp visible={s.backendAVisible} active={s.backendAActive} label="App A" x={ZONES.BACKEND_A.x} y={ZONES.BACKEND_A.y} />
      <BackendApp visible={s.backendBVisible} active={false} label="App B" x={ZONES.BACKEND_B.x} y={ZONES.BACKEND_B.y} />
    </>
  )
}
