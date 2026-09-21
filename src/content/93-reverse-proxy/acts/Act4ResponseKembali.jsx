// 93-reverse-proxy/acts/Act4ResponseKembali.jsx
// ACT 4 — Response kembali: capsule lewat proxy, client menerima hasil, takeaway tampil.
// PURE presentational. Tanpa props → mode summary (momen akhir act, dipakai intro bg).
// Pola "1 act = 1 file" — docs/standardizations/07-act-scene-pattern.md.

import { ActFrame, Pill, Takeaway, withOrigin, resolveState } from './common'
import { COLORS, COPY, INITIAL_VIS, INITIAL_ACTORS } from '../data'

export const SUMMARY_STATE = {
  vis: {
    ...INITIAL_VIS, client: 1, endpoint: 1, gate: 1, lines: 1, beA: 1, beB: 1, nClient: 1, nEndpoint: 1, nGate: 1,
    ruleA: 1, ruleB: 1, ruleAMatch: 1, lineALit: 1, beAActive: 1, nBeA: 1, nBeB: 1,
    clientDone: 1, takeaway: 1,
  },
  actors: { ...INITIAL_ACTORS },
  txt: { client: COPY.NOTE_CLIENT_DONE, gate: COPY.NOTE_GATE_5, beA: COPY.NOTE_BE_A_3 },
  clientStatus: 'done',
}

export default function Act4ResponseKembali({ state, origin }) {
  const s = resolveState(SUMMARY_STATE, state)
  return withOrigin(
    <ActFrame
      state={s}
      under={
        <>
          <Pill a={s.actors.rs2} w={84} fill={COLORS.GREEN} label={COPY.RESPONSE} />
          <Pill a={s.actors.rs1} w={84} fill={COLORS.GREEN} label={COPY.RESPONSE} />
        </>
      }
      top={<Takeaway o={s.vis.takeaway} />}
    />,
    origin,
  )
}
