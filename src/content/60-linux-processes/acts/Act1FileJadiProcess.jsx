// src/content/60-linux-processes/acts/Act1FileJadiProcess.jsx
// ACT 1 — File diam di disk → dijalankan (klik) → jadi process (handoff).
// Elemen khusus act ini: launch-cursor icon. Elemen persisten (caption,
// program file, 3 process card) ada di SceneChrome (common.jsx).
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import React from 'react'
import { CAPTIONS, PROCESSES } from '../data'
import {
  SceneChrome, LaunchCursorIcon, withOrigin, oop, pose,
  ARENA_Y, LAUNCH_CURSOR_X, LAUNCH_CURSOR_Y,
} from './common'

// Momen akhir Act 1: browser sudah settle jadi process (handoff=1), belum
// dapat PID (itu baru terjadi di Act 2). Caption terakhir Act 1: CLIFFHANGER.
export const SUMMARY_STATE = {
  pop: {
    caption: { opacity: 1, scale: 1, x: 0, y: 0 },
    'launch-cursor': { opacity: 0, scale: 0, x: 0, y: 0 },
  },
  caption: CAPTIONS.CLIFFHANGER,
  captionX: 150,
  captionY: 380,
  handoff: 1,
  browserX: PROCESSES[0].slotX,
  browserY: ARENA_Y,
  browserScale: 1,
  pidVisible: { browser: false, editor: false, music: false },
  highlightBrowser: false,
}

export default function Act1FileJadiProcess({ state, origin }) {
  const s = { ...SUMMARY_STATE, ...(state || {}) }
  const pop = s.pop || {}
  return withOrigin(
    <>
      <SceneChrome state={s} />
      <g opacity={oop(pop, 'launch-cursor')} transform={`translate(${LAUNCH_CURSOR_X} ${LAUNCH_CURSOR_Y})`}>
        <LaunchCursorIcon x={0} y={0} opacity={1} scale={pose(pop, 'launch-cursor').scale || 1} />
      </g>
    </>,
    origin,
  )
}
