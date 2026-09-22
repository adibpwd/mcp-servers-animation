// src/content/92-web-server/acts/Act4ResponseKembali.jsx
// ACT 4 — Response selalu kembali lewat web server. JSON app → listener
// → browser (dua leg), lalu perbandingan singkat dua jalur via log line —
// menegaskan aturan universal: response tidak pernah langsung dari app.
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import { Chrome, ResponseCapsule, LogLine, TakeawayBar } from './common'
import { APP_POS, LISTENER_POS, BROWSER_POS, STATIC_PATH, DYNAMIC_PATH, CLOSING_LINE } from '../data'

export const SUMMARY_STATE = {
  browserResult: 'dynamic', pathChipVisible: false,
  listenerVisible: true, listenerGlow: 0.3,
  appActive: false, jsonReady: false,
  dynRespVisible: false, dynRespStage: 'listener', dynRespProgress: 0,
  logVisible: true, logText: `GET ${STATIC_PATH} → 200 · GET ${DYNAMIC_PATH} → 200`,
  takeawayVisible: true,
}

export default function Act4ResponseKembali({ state }) {
  const s = { ...SUMMARY_STATE, ...state }
  const from = s.dynRespStage === 'app' ? APP_POS : LISTENER_POS
  const to = s.dynRespStage === 'app' ? LISTENER_POS : BROWSER_POS
  return (
    <>
      <Chrome state={s} />
      <ResponseCapsule visible={s.dynRespVisible}
        fromX={from.x} fromY={from.y} toX={to.x} toY={to.y}
        progress={s.dynRespProgress} kind="dynamic" />
      <LogLine visible={s.logVisible} text={s.logText} />
      <TakeawayBar visible={s.takeawayVisible} text={CLOSING_LINE} />
    </>
  )
}
