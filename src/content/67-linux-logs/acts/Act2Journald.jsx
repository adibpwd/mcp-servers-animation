// src/content/67-linux-logs/acts/Act2Journald.jsx
// ACT 2 — journald: Terstruktur & Bisa Difilter.
// Field journald (PRIORITY, _PID, _SYSTEMD_UNIT, MESSAGE) terungkap.
// Pola "1 act = 1 file", lihat docs/standardizations/07-act-scene-pattern.md.

import { SceneChrome, withOrigin } from './common'
import { SUMMARY_STATE as ACT1_STATE } from './Act1DuaJalur'

export const SUMMARY_STAGE = 'journald'
export const SUMMARY_STATE = {
  ...ACT1_STATE,
  phaseIdx: 1,
  journaldFieldsShown: true,
}

export default function Act2Journald({ state, origin }) {
  const fullState = { ...SUMMARY_STATE, ...state }
  return withOrigin(<SceneChrome state={fullState} />, origin)
}
