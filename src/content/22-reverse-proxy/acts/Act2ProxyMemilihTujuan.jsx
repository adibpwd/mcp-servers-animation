// 93-reverse-proxy/acts/Act2ProxyMemilihTujuan.jsx
// ACT 2 — Proxy memilih tujuan: scan dot membandingkan rule, chip A cocok, cabang A menyala.
// PURE presentational. Tanpa props → mode summary (momen akhir act, dipakai intro bg).
// Pola "1 act = 1 file" — docs/standardizations/07-act-scene-pattern.md.

import { ActFrame, ScanDot, withOrigin, resolveState } from './common'
import { COPY, ZONES, INITIAL_VIS, INITIAL_ACTORS } from '../data'

export const SUMMARY_STATE = {
  vis: {
    ...INITIAL_VIS, client: 1, endpoint: 1, gate: 1, lines: 1, beA: 1, beB: 1, nClient: 1, nEndpoint: 1, nGate: 1,
    ruleA: 1, ruleB: 1, ruleAMatch: 1, lineALit: 1, beAActive: 1, nBeA: 1, nBeB: 1,
  },
  actors: { ...INITIAL_ACTORS, dot: { x: ZONES.RULE_A.x, y: ZONES.SCAN_Y, s: 1 } },
  txt: { client: COPY.NOTE_CLIENT_HOOK, gate: COPY.NOTE_GATE_3, beA: COPY.NOTE_BE_A_1 },
  clientStatus: 'loading',
}

export default function Act2ProxyMemilihTujuan({ state, origin }) {
  const s = resolveState(SUMMARY_STATE, state)
  return withOrigin(
    <ActFrame
      state={s}
      over={<ScanDot a={s.actors.dot} />}
    />,
    origin,
  )
}
