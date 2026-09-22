// src/content/84-network-ports/acts/Act4Endpoints.jsx
// ACT 4 — Dua Ujung Koneksi (`dua-ujung-port`).
// Socket line client—listener menyala, badge src (ephemeral) dan
// dst (tetap) muncul di ujung masing-masing.

import { Spine, Packets, Badges } from './common'
import { PRIMARY_LANE_ID } from '../data'

export const SUMMARY_STATE = {
  glow: { host: 1, [`lane-${PRIMARY_LANE_ID}`]: 1, listener: 1, socketLine: 1 },
  packets: {},
  badge: {},
}

export default function Act4Endpoints({ state }) {
  const s = { ...SUMMARY_STATE, ...state }
  return (
    <>
      <Spine state={s} phaseIdx={3} />
      <Packets state={s} keys={['main']} />
      <Badges state={s} />
    </>
  )
}
