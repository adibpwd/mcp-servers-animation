// src/content/81-network-interface/acts/Act6InterfaceVirtual.jsx
// ACT 6 — Interface virtual: loopback, bridge, VLAN, VPN, container.
// SENGAJA tidak memakai AnchorIcon ("eth0") — bahasannya interface LAIN
// yang bukan kartu fisik (lihat komentar ANCHOR_POS di data.js).
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import { CaptionBar, ConceptCard, IconLoopback, IconBridge, IconVlan, IconVpn, IconContainer, withOrigin } from './common'
import { COLORS, VIRTUAL_INTERFACES } from '../data'

const VIRTUAL_Y = 470
const VIRTUAL_XS = { loopback: 78, bridge: 222, vlan: 366, vpn: 510, container: 654 }
const VIRTUAL_ICONS = { loopback: IconLoopback, bridge: IconBridge, vlan: IconVlan, vpn: IconVpn, container: IconContainer }

// ── Mode summary — momen akhir Act 6: semua 5 interface virtual tampil
// aktif. Tidak ada panel penutup yang menyinggung content berikutnya —
// caption closing sudah cukup sebagai takeaway. ──
export const SUMMARY_STATE = {
  caption: 'Jalur virtual juga interface.',
  captionColor: COLORS.VIRTUAL,
  virtualVisible: true,
  virtualHighlight: null,
}

export default function Act6InterfaceVirtual({ state, origin }) {
  const s = { ...SUMMARY_STATE, ...state }

  return withOrigin(
    <>
      <CaptionBar text={s.caption} color={s.captionColor} />

      {/* desc HANYA tampil untuk card yang sedang di-highlight (bukan saat
          highlight === null / "semua aktif") — card 130px terlalu sempit
          untuk 5 desc bersisian, ditemukan lewat preview screenshot
          (lihat revisi/2026-09-21-revisi-02-fix-timing-hold-dan-overlap.md). */}
      {s.virtualVisible && VIRTUAL_INTERFACES.map((v) => (
        <ConceptCard key={v.id} x={VIRTUAL_XS[v.id]} y={VIRTUAL_Y} w={130} h={78}
          icon={VIRTUAL_ICONS[v.id]}
          label={v.label} desc={s.virtualHighlight === v.id ? v.desc : null} color={v.color}
          active={s.virtualHighlight === v.id || s.virtualHighlight === null}
          dim={s.virtualHighlight !== null && s.virtualHighlight !== v.id} />
      ))}
    </>,
    origin,
  )
}
