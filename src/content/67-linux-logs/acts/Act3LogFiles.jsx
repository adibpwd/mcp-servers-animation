// src/content/67-linux-logs/acts/Act3LogFiles.jsx
// ACT 3 — Log Files: Teks di /var/log.
// Preview baris teks + badge GREP-ABLE di stasiun Log Files.
// Pola "1 act = 1 file", lihat docs/standardizations/07-act-scene-pattern.md.

import { SceneChrome, withOrigin } from './common'
import { SUMMARY_STATE as ACT2_STATE } from './Act2Journald'

export const SUMMARY_STAGE = 'log-files'
export const SUMMARY_STATE = {
  ...ACT2_STATE,
  phaseIdx: 2,
  logPreviewShown: true,
}

export default function Act3LogFiles({ state, origin }) {
  const fullState = { ...SUMMARY_STATE, ...state }
  return withOrigin(<SceneChrome state={fullState} />, origin)
}
