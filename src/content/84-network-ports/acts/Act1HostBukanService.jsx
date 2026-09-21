// src/content/84-network-ports/acts/Act1HostBukanService.jsx
// ACT 1 — Host Bukan Service (`ip-ke-port`).
// Packet client lahir, menuju IP host, menyempit ke lane TCP :443.
// Summary: lane :443 menyala, host disorot (representasi "apply" tuntas).

import { Spine, Packets, Badges } from './common'
import { PRIMARY_LANE_ID } from '../data'

export const SUMMARY_STATE = {
  glow: { host: 1, [`lane-${PRIMARY_LANE_ID}`]: 1 },
  packets: {},
  badge: {},
}

export default function Act1HostBukanService({ state }) {
  const s = { ...SUMMARY_STATE, ...state }
  return (
    <>
      <Spine state={s} phaseIdx={0} />
      <Packets state={s} keys={['main']} />
      <Badges state={s} />
    </>
  )
}
