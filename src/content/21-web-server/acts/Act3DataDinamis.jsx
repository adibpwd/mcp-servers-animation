// src/content/92-web-server/acts/Act3DataDinamis.jsx
// ACT 3 — Data dinamis. Forward listener → app upstream (idle sampai
// packet tiba) → app membentuk JSON. SENGAJA belum dikirim ke browser —
// ditahan ke Act 4 (revisi 01 §Storyboard Pengganti).
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import { Chrome, ProgressDot } from './common'
import { COLORS, LISTENER_POS, APP_POS, DYNAMIC_PATH } from '../data'

export const SUMMARY_STATE = {
  browserPath: DYNAMIC_PATH, browserResult: null, pathChipVisible: true,
  listenerVisible: true, listenerGlow: 0.3,
  staticFileActiveId: null,
  appActive: true, appBuilding: false, jsonReady: true, forwardProgress: 0,
}

export default function Act3DataDinamis({ state }) {
  const s = { ...SUMMARY_STATE, ...state }
  return (
    <>
      <Chrome state={s} />
      <ProgressDot x1={LISTENER_POS.x} y1={LISTENER_POS.y + 40} x2={APP_POS.x} y2={APP_POS.y - 52}
        progress={s.forwardProgress} color={COLORS.APP} />
    </>
  )
}
