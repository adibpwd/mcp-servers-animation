// src/content/67-linux-logs/acts/Act5Audit.jsx
// ACT 5 — Terpusat & Audit Trail.
// Remote/Audit menyala + forward tercatat; Timeline penuh 7 entri insiden.
// Pola "1 act = 1 file", lihat docs/standardizations/07-act-scene-pattern.md.

import { SceneChrome, withOrigin } from './common'
import { SUMMARY_STATE as ACT4_STATE } from './Act4Rotasi'

export const SUMMARY_STAGE = 'terpusat-audit'
export const SUMMARY_STATE = {
  ...ACT4_STATE,
  phaseIdx: 4,
  stationOpacity: { ...ACT4_STATE.stationOpacity, remoteAudit: 1, timeline: 1 },
  lineProgress: { ...ACT4_STATE.lineProgress, 'journald-to-remote': 1, 'remote-to-timeline': 1 },
  auditForwarded: true,
  timelineCount: 7,
}

export default function Act5Audit({ state, origin }) {
  const fullState = { ...SUMMARY_STATE, ...state }
  return withOrigin(<SceneChrome state={fullState} />, origin)
}
