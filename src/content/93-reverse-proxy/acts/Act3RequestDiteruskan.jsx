// 93-reverse-proxy/acts/Act3RequestDiteruskan.jsx
// ACT 3 — Request diteruskan: packet keluar dari chip A, menempuh cabang, backend A memproses.
// PURE presentational. Tanpa props → mode summary (momen akhir act, dipakai intro bg).
// Pola "1 act = 1 file" — docs/standardizations/07-act-scene-pattern.md.

import { ActFrame, Pill, ScanDot, withOrigin, resolveState } from './common'
import { COLORS, COPY, INITIAL_VIS, INITIAL_ACTORS } from '../data'

export const SUMMARY_STATE = {
  vis: {
    ...INITIAL_VIS, client: 1, endpoint: 1, gate: 1, lines: 1, beA: 1, beB: 1, nClient: 1, nEndpoint: 1, nGate: 1,
    ruleA: 1, ruleB: 1, ruleAMatch: 1, lineALit: 1, beAActive: 1, beAProc: 1, nBeA: 1, nBeB: 1,
  },
  actors: { ...INITIAL_ACTORS },
  txt: { client: COPY.NOTE_CLIENT_HOOK, gate: COPY.NOTE_GATE_4, beA: COPY.NOTE_BE_A_2 },
  clientStatus: 'loading',
}

export default function Act3RequestDiteruskan({ state, origin }) {
  const s = resolveState(SUMMARY_STATE, state)
  return withOrigin(
    <ActFrame
      state={s}
      under={<Pill a={s.actors.pk2} w={100} fill={COLORS.BLUE} label={COPY.PACKET} />}
      over={<ScanDot a={s.actors.dot} />}
    />,
    origin,
  )
}
