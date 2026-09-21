// src/content/81-network-interface/acts/Act3MendapatKonfigurasi.jsx
// ACT 3 — Mendapat konfigurasi: DHCP/static branch → address, gateway, DNS.
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import { CaptionBar, ConceptCard, ConnLine, AnchorIcon, withOrigin } from './common'
import { COLORS, ANCHOR_POS, CONFIG_PATHS, CONFIG_RESULTS } from '../data'

const BRANCH_Y = 330
const BRANCH_XS = { dhcp: 206, static: 526 }
const RESULT_Y = 620
const RESULT_XS = { address: 210, gateway: 366, dns: 522 }

// ── Mode summary — momen akhir Act 3: branch DHCP/static sudah selesai
// (hilang), 3 hasil (address/gateway/DNS) tampil penuh di bawah anchor. ──
export const SUMMARY_STATE = {
  caption: 'Gateway dan DNS datang bersama alamat.',
  captionColor: COLORS.ROUTE,
  branchVisible: false,
  branchChosen: null,
  resultsStep: 3,
  anchorVisible: true,
  anchorGlow: 0,
}

export default function Act3MendapatKonfigurasi({ state, origin }) {
  const s = { ...SUMMARY_STATE, ...state }

  return withOrigin(
    <>
      <CaptionBar text={s.caption} color={s.captionColor} />
      <AnchorIcon visible={s.anchorVisible} glow={s.anchorGlow} label="eth0" />

      {s.branchVisible && CONFIG_PATHS.map((p) => (
        <g key={p.id}>
          <ConnLine x1={BRANCH_XS[p.id]} y1={BRANCH_Y + 32} x2={ANCHOR_POS.x} y2={ANCHOR_POS.y - 36} color={p.color} />
          <ConceptCard x={BRANCH_XS[p.id]} y={BRANCH_Y} w={180} h={64}
            label={p.label} desc={p.desc} color={p.color}
            active={s.branchChosen === p.id || s.branchChosen === null}
            dim={s.branchChosen !== null && s.branchChosen !== p.id} />
        </g>
      ))}

      {CONFIG_RESULTS.map((r, i) => (
        s.resultsStep > i && (
          <ConceptCard key={r.id} x={RESULT_XS[r.id]} y={RESULT_Y} w={150} h={58}
            label={r.label} desc={r.desc} color={r.color} active />
        )
      ))}
    </>,
    origin,
  )
}
