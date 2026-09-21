// src/content/94-domain-to-server/acts/Act4ReturnPage.jsx
// ACT 4 — Return Page: response capsule dari backend lewat proxy, edge,
// balik ke browser; browser merender halaman; spine lengkap menyala.
// Semua actor persisten ikut dirender (lihat catatan Act2ConnectEdge.jsx).
// Pola "1 act = 1 file".

import { ZONES } from '../data'
import {
  BrowserIcon, DNSIcon, EdgeGate, ProxyGate, BackendApp,
  ResponseCapsule, Spine,
} from './common'

export const SUMMARY_STAGE = 'delivered'
export const SUMMARY_STATE = {
  browserVisible: true,
  browserLoading: false,
  browserHasPage: true,
  dnsVisible: true,
  edgeVisible: true,
  edgeActive: false,
  proxyVisible: true,
  proxyActive: false,
  backendAVisible: true,
  backendBVisible: true,
  backendAActive: true,
  responseVisible: true,
  responsePos: { x: ZONES.BROWSER.x, y: ZONES.BROWSER.y + 60 },
  spineVisible: true,
}

export default function Act4ReturnPage({ state }) {
  const s = { ...SUMMARY_STATE, ...state }
  return (
    <>
      <Spine visible={s.spineVisible} />
      <BrowserIcon visible={s.browserVisible} loading={s.browserLoading} hasPage={s.browserHasPage} />
      <DNSIcon visible={s.dnsVisible} active={false} />
      <EdgeGate visible={s.edgeVisible} active={s.edgeActive} />
      <ProxyGate visible={s.proxyVisible} active={s.proxyActive} />
      <BackendApp visible={s.backendAVisible} active={s.backendAActive} label="App A" x={ZONES.BACKEND_A.x} y={ZONES.BACKEND_A.y} />
      <BackendApp visible={s.backendBVisible} active={false} label="App B" x={ZONES.BACKEND_B.x} y={ZONES.BACKEND_B.y} />
      <ResponseCapsule visible={s.responseVisible} x={s.responsePos.x} y={s.responsePos.y} />
    </>
  )
}
