// src/content/67-linux-logs/acts/Act1DuaJalur.jsx
// ACT 1 — Dari Event ke Dua Jalur.
// App menulis event -> journald menangkap -> diteruskan ke log files.
// Summary: rawEvent, journald, logFiles menyala; rawEvent sudah meredup
// (momen akhir act ini). Pola "1 act = 1 file", lihat
// docs/standardizations/07-act-scene-pattern.md.

import { SceneChrome, ZERO_STATION_OPACITY, ZERO_LINE_PROGRESS, withOrigin } from './common'

export const SUMMARY_STAGE = 'dua-jalur'
export const SUMMARY_STATE = {
  phaseIdx: 0,
  stationOpacity: { ...ZERO_STATION_OPACITY, rawEvent: 0.4, journald: 1, logFiles: 1 },
  lineProgress: { ...ZERO_LINE_PROGRESS, 'event-to-journald': 1, 'journald-to-logfiles': 1 },
}

export default function Act1DuaJalur({ state, origin }) {
  const fullState = { ...SUMMARY_STATE, ...state }
  return withOrigin(<SceneChrome state={fullState} />, origin)
}
