// src/content/92-web-server/acts/Act2HalamanStatis.jsx
// ACT 2 — Halaman statis. Round-trip lengkap dalam satu Act: read pulse
// listener → tile about.html → tile jadi response capsule → browser
// render halaman. App upstream tetap idle (Chrome yang mengatur dim).
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import { Chrome, ProgressDot, ResponseCapsule } from './common'
import { COLORS, LISTENER_POS, STATIC_POS, BROWSER_POS, STATIC_PATH } from '../data'

export const SUMMARY_STATE = {
  browserPath: STATIC_PATH, browserResult: 'static', pathChipVisible: true,
  listenerVisible: true, listenerGlow: 0.3,
  staticFileActiveId: 'about', staticReadProgress: 0,
  appActive: false,
  staticRespVisible: false, staticRespProgress: 0,
}

export default function Act2HalamanStatis({ state }) {
  const s = { ...SUMMARY_STATE, ...state }
  return (
    <>
      <Chrome state={s} />
      <ProgressDot x1={LISTENER_POS.x} y1={LISTENER_POS.y + 40} x2={STATIC_POS.x} y2={STATIC_POS.y - 52}
        progress={s.staticReadProgress} color={COLORS.STATIC} />
      <ResponseCapsule visible={s.staticRespVisible}
        fromX={STATIC_POS.x} fromY={STATIC_POS.y} toX={BROWSER_POS.x} toY={BROWSER_POS.y}
        progress={s.staticRespProgress} kind="static" />
    </>
  )
}
