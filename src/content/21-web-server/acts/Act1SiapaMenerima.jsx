// src/content/92-web-server/acts/Act1SiapaMenerima.jsx
// ACT 1 — Siapa yang menerima? Browser membuka URL → request packet
// menuju listener → listener (Nginx/Apache) settle (anchor persisten).
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import { Chrome, ConnLine, ProgressDot } from './common'
import { COLORS, BROWSER_POS, LISTENER_POS } from '../data'

export const SUMMARY_STATE = {
  browserPath: '', browserResult: null,
  listenerVisible: true, listenerGlow: 0.3, pathChipVisible: false,
  requestProgress: 0,
}

export default function Act1SiapaMenerima({ state }) {
  const s = { ...SUMMARY_STATE, ...state }
  return (
    <>
      <Chrome state={s} />
      {s.requestProgress > 0 && (
        <ConnLine x1={BROWSER_POS.x} y1={BROWSER_POS.y + 46} x2={LISTENER_POS.x} y2={LISTENER_POS.y - 40} color={COLORS.BROWSER} opacity={0.4} />
      )}
      <ProgressDot x1={BROWSER_POS.x} y1={BROWSER_POS.y + 46} x2={LISTENER_POS.x} y2={LISTENER_POS.y - 40}
        progress={s.requestProgress} color={COLORS.BROWSER} />
    </>
  )
}
