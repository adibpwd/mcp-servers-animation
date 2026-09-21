// src/content/81-network-interface/acts/Act2LinkDanIdentity.jsx
// ACT 2 — Link dan identity: layer link/MAC/IP menumpuk di atas interface
// yang sudah settle ("eth0"). Anchor persisten dari Act 1.
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import { CaptionBar, ConceptCard, ConnLine, AnchorIcon, withOrigin } from './common'
import { COLORS, ANCHOR_POS, IDENTITY_LAYERS } from '../data'

const LAYER_XS = { link: 580, mac: 650, ip: 720 }

// ── Mode summary — momen akhir Act 2: ketiga layer (link/MAC/IP) tampil
// penuh di atas anchor. ──
export const SUMMARY_STATE = {
  caption: 'MAC dan IP punya peran berbeda.',
  captionColor: COLORS.IP,
  layerStep: 3,
  anchorVisible: true,
  anchorGlow: 0,
}

export default function Act2LinkDanIdentity({ state, origin }) {
  const s = { ...SUMMARY_STATE, ...state }

  return withOrigin(
    <>
      <CaptionBar text={s.caption} color={s.captionColor} />
      <AnchorIcon visible={s.anchorVisible} glow={s.anchorGlow} label="eth0" />

      {s.layerStep > 0 && (
        <ConnLine x1={ANCHOR_POS.x} y1={ANCHOR_POS.y + 36} x2={ANCHOR_POS.x} y2={LAYER_XS.link - 30} color={COLORS.LINK} />
      )}
      {IDENTITY_LAYERS.map((layer, i) => (
        s.layerStep > i && (
          <ConceptCard key={layer.id} x={ANCHOR_POS.x} y={LAYER_XS[layer.id]} w={260} h={54}
            label={layer.label} desc={layer.desc} color={layer.color} active />
        )
      ))}
    </>,
    origin,
  )
}
