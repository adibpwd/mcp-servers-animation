// src/content/84-network-ports/acts/Act2Listener.jsx
// ACT 2 — Listener Menerima (`listener-menerima`).
// Packet mengetuk listener, listener glow, packet masuk process.

import { Spine, Packets, Badges } from './common'
import { PRIMARY_LANE_ID } from '../data'

export const SUMMARY_STATE = {
  glow: { host: 1, [`lane-${PRIMARY_LANE_ID}`]: 1, listener: 1 },
  packets: {},
  badge: {},
}

export default function Act2Listener({ state }) {
  const s = { ...SUMMARY_STATE, ...state }
  return (
    <>
      <Spine state={s} phaseIdx={1} />
      <Packets state={s} keys={['main']} />
      <Badges state={s} />
    </>
  )
}
