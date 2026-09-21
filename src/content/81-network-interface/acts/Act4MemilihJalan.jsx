// src/content/81-network-interface/acts/Act4MemilihJalan.jsx
// ACT 4 — Memilih jalan: paket ke subnet lokal atau default gateway.
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import { CaptionBar, ConceptCard, ConnLine, ProgressDot, AnchorIcon, withOrigin } from './common'
import { COLORS, ANCHOR_POS, ROUTE_TARGETS } from '../data'

const ROUTE_Y = 640
const ROUTE_XS = { local: 196, gateway: 536 }

// ── Mode summary — momen akhir Act 4: paket sudah sampai default gateway
// (jalur yang lebih umum/representatif dibanding subnet lokal). ──
export const SUMMARY_STATE = {
  caption: 'Gateway memilih jalan keluar.',
  captionColor: COLORS.ROUTE,
  routeVisible: true,
  routeActive: 'gateway',
  progressLocal: 0,
  progressGateway: 1,
  anchorVisible: true,
  anchorGlow: 0,
}

export default function Act4MemilihJalan({ state, origin }) {
  const s = { ...SUMMARY_STATE, ...state }

  return withOrigin(
    <>
      <CaptionBar text={s.caption} color={s.captionColor} />
      <AnchorIcon visible={s.anchorVisible} glow={s.anchorGlow} label="eth0" />

      {s.routeVisible && ROUTE_TARGETS.map((r) => (
        <g key={r.id}>
          <ConnLine x1={ANCHOR_POS.x} y1={ANCHOR_POS.y + 36} x2={ROUTE_XS[r.id]} y2={ROUTE_Y - 30} color={r.color} />
          <ConceptCard x={ROUTE_XS[r.id]} y={ROUTE_Y} w={190} h={68}
            label={r.label} desc={r.desc} color={r.color}
            active={s.routeActive === r.id || s.routeActive === null}
            dim={s.routeActive !== null && s.routeActive !== r.id} />
        </g>
      ))}
      <ProgressDot x1={ANCHOR_POS.x} y1={ANCHOR_POS.y + 36} x2={ROUTE_XS.local} y2={ROUTE_Y - 30}
        progress={s.progressLocal} color={COLORS.IP} />
      <ProgressDot x1={ANCHOR_POS.x} y1={ANCHOR_POS.y + 36} x2={ROUTE_XS.gateway} y2={ROUTE_Y - 30}
        progress={s.progressGateway} color={COLORS.ROUTE} />
    </>,
    origin,
  )
}
