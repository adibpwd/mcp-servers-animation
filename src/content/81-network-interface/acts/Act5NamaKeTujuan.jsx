// src/content/81-network-interface/acts/Act5NamaKeTujuan.jsx
// ACT 5 — Nama ke tujuan: chain nama → DNS → route → interface.
// Anchor "eth0" hilang di penutup act ini (lihat Animation.jsx timeline);
// mode summary merepresentasikan momen SETELAH anchor hilang.
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import { CaptionBar, ConceptCard, ConnLine, AnchorIcon, IconName, IconDns, IconRoute, IconEthernet, withOrigin } from './common'
import { COLORS, NAME_HOPS } from '../data'

const CHAIN_Y = 650
const CHAIN_XS = { name: 120, dns: 284, route: 448, interface: 612 }
const CHAIN_ICONS = { name: IconName, dns: IconDns, route: IconRoute, interface: IconEthernet }

// ── Mode summary — momen akhir Act 5: chain penuh, hop terakhir
// ("interface") disorot, anchor sudah menghilang (transisi ke Act 6). ──
export const SUMMARY_STATE = {
  caption: 'DNS menerjemahkan nama, bukan membawa paket.',
  captionColor: COLORS.DNS,
  chainVisible: true,
  chainHighlight: 'interface',
  anchorVisible: false,
  anchorGlow: 0,
}

export default function Act5NamaKeTujuan({ state, origin }) {
  const s = { ...SUMMARY_STATE, ...state }

  return withOrigin(
    <>
      <CaptionBar text={s.caption} color={s.captionColor} />
      <AnchorIcon visible={s.anchorVisible} glow={s.anchorGlow} label="eth0" />

      {s.chainVisible && NAME_HOPS.map((hop, i) => (
        <g key={hop.id}>
          {i > 0 && (
            <ConnLine x1={CHAIN_XS[NAME_HOPS[i - 1].id] + 70} y1={CHAIN_Y}
              x2={CHAIN_XS[hop.id] - 70} y2={CHAIN_Y} color={COLORS.MUTED} opacity={0.5} />
          )}
          <ConceptCard x={CHAIN_XS[hop.id]} y={CHAIN_Y} w={150} h={64}
            icon={CHAIN_ICONS[hop.id]}
            label={hop.label} desc={hop.desc} color={hop.color}
            active={s.chainHighlight === hop.id || s.chainHighlight === null}
            dim={s.chainHighlight !== null && s.chainHighlight !== hop.id} />
        </g>
      ))}
    </>,
    origin,
  )
}
