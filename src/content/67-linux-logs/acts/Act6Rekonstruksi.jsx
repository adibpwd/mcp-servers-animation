// src/content/67-linux-logs/acts/Act6Rekonstruksi.jsx
// ACT 6 — Rekonstruksi: Ikuti Jejak Waktu (payoff).
// Diagnosis 3-langkah (Timestamp -> Source -> Konteks) penuh aktif +
// closing stamp privasi & waktu. Pola "1 act = 1 file", lihat
// docs/standardizations/07-act-scene-pattern.md.

import { SceneChrome, withOrigin } from './common'
import { SUMMARY_STATE as ACT5_STATE } from './Act5Audit'

export const SUMMARY_STAGE = 'rekonstruksi'
export const SUMMARY_STATE = {
  ...ACT5_STATE,
  phaseIdx: 5,
  stationOpacity: { ...ACT5_STATE.stationOpacity, diagnosis: 1 },
  lineProgress: {
    ...ACT5_STATE.lineProgress,
    'remote-to-diagnosis': 1,
    'timeline-to-diagnosis': 1,
    'rotation-to-diagnosis': 1,
  },
  diagnosisStep: 2,
  closingOpacity: 1,
}

export default function Act6Rekonstruksi({ state, origin }) {
  const fullState = { ...SUMMARY_STATE, ...state }
  return withOrigin(<SceneChrome state={fullState} />, origin)
}
