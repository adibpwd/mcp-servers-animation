// src/content/67-linux-logs/acts/Act4Rotasi.jsx
// ACT 4 — Rotasi & Retensi: Log Tidak Abadi.
// Stasiun Rotasi & Retensi menyala, dua badge (journald vacuum + logrotate).
// Pola "1 act = 1 file", lihat docs/standardizations/07-act-scene-pattern.md.

import { SceneChrome, withOrigin } from './common'
import { SUMMARY_STATE as ACT3_STATE } from './Act3LogFiles'

export const SUMMARY_STAGE = 'rotasi-retensi'
export const SUMMARY_STATE = {
  ...ACT3_STATE,
  phaseIdx: 3,
  stationOpacity: { ...ACT3_STATE.stationOpacity, rotation: 1 },
  lineProgress: { ...ACT3_STATE.lineProgress, 'journald-to-rotation': 1 },
  rotationJournaldOn: true,
  rotationLogrotateOn: true,
}

export default function Act4Rotasi({ state, origin }) {
  const fullState = { ...SUMMARY_STATE, ...state }
  return withOrigin(<SceneChrome state={fullState} />, origin)
}
