// src/content/94-domain-to-server/acts/Act1ResolveDomain.jsx
// ACT 1 — Resolve Domain: browser hanya punya domain, DNS query → answer,
// domain chip bertransformasi jadi IP chip.
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import { ZONES } from '../data'
import { BrowserIcon, DNSIcon, DomainChip, DNSQueryPacket, Spine } from './common'

export const SUMMARY_STAGE = 'resolved'
export const SUMMARY_STATE = {
  browserVisible: true,
  browserLoading: false,
  browserHasPage: false,
  dnsVisible: true,
  dnsActive: false,
  domainChipVisible: true,
  domainChipPos: { x: ZONES.BROWSER.x + 80, y: ZONES.BROWSER.y - 50 },
  domainChipShowDomain: false,
  domainChipShowIP: true,
  dnsQueryVisible: false,
  dnsQueryPos: { x: 0, y: 0 },
  spineVisible: false,
}

export default function Act1ResolveDomain({ state }) {
  const s = { ...SUMMARY_STATE, ...state }
  return (
    <>
      <Spine visible={s.spineVisible} />
      <BrowserIcon visible={s.browserVisible} loading={s.browserLoading} hasPage={s.browserHasPage} />
      <DNSIcon visible={s.dnsVisible} active={s.dnsActive} />
      <DomainChip
        visible={s.domainChipVisible}
        x={s.domainChipPos.x}
        y={s.domainChipPos.y}
        showDomain={s.domainChipShowDomain}
        showIP={s.domainChipShowIP}
      />
      <DNSQueryPacket visible={s.dnsQueryVisible} x={s.dnsQueryPos.x} y={s.dnsQueryPos.y} />
    </>
  )
}
