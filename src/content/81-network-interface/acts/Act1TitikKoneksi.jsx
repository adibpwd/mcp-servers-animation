// src/content/81-network-interface/acts/Act1TitikKoneksi.jsx
// ACT 1 — Titik koneksi: laptop punya beberapa jenis interface sekaligus
// (wired/wifi/loopback), lalu fokus menetap ke satu ("eth0").
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import { CaptionBar, ConceptCard, AnchorIcon, withOrigin } from './common'
import { COLORS, INTERFACE_TYPES } from '../data'

const TYPE_ROW_Y = 420
const TYPE_XS = { wired: 156, wifi: 366, loopback: 576 }

// ── Mode summary (tanpa props) — momen akhir Act 1: anchor "eth0" sudah
// settle, 3 kartu jenis interface sudah tidak tampil lagi. ──
export const SUMMARY_STATE = {
  caption: 'Fokus ke satu interface: eth0.',
  captionColor: COLORS.WIRED,
  typesVisible: false,
  typeHighlight: null,
  anchorVisible: true,
  anchorGlow: 0.3,
}

export default function Act1TitikKoneksi({ state, origin }) {
  const s = { ...SUMMARY_STATE, ...state }

  return withOrigin(
    <>
      <CaptionBar text={s.caption} color={s.captionColor} />

      {s.typesVisible && INTERFACE_TYPES.map((it) => (
        <ConceptCard key={it.id} x={TYPE_XS[it.id]} y={TYPE_ROW_Y} w={190} h={72}
          label={it.label} desc={it.desc} color={it.color}
          active={s.typeHighlight === it.id || s.typeHighlight === null}
          dim={s.typeHighlight !== null && s.typeHighlight !== it.id} />
      ))}

      <AnchorIcon visible={s.anchorVisible} glow={s.anchorGlow} label="eth0" />
    </>,
    origin,
  )
}
