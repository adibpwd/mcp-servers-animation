// src/content/60-linux-processes/acts/Act2SetiapProcessPunyaPid.jsx
// ACT 2 — Editor & music-app menyusul, semua dapat PID. Elemen khusus act
// ini: clone PID chip + pid-reuse chip (ilustrasi transient). Elemen
// persisten (caption, program file, 3 process card + PID) ada di
// SceneChrome (common.jsx).
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import React from 'react'
import { CAPTIONS, PROCESSES, CLONE_PID } from '../data'
import {
  SceneChrome, PidChip, withOrigin, oop,
  ARENA_Y, CLONE_X, CLONE_Y, PID_REUSE_X, PID_REUSE_Y,
} from './common'

// Momen akhir Act 2: tiga card + PID semua terlihat (browser/editor/music),
// clone chip & reuse-hint chip sudah selesai (transient, ilustratif — bukan
// elemen permanen, lihat continuity map _docs/LINUX_PROCESSES_PLAN.md).
export const SUMMARY_STATE = {
  pop: {
    caption: { opacity: 1, scale: 1, x: 0, y: 0 },
    editor: { opacity: 1, scale: 1, x: 0, y: 0 },
    music: { opacity: 1, scale: 1, x: 0, y: 0 },
    clone: { opacity: 0, scale: 0, x: 0, y: 0 },
    'pid-reuse': { opacity: 0, scale: 0, x: 0, y: 0 },
  },
  caption: CAPTIONS.PID_REUSE,
  captionX: 258,
  captionY: 355,
  handoff: 1,
  browserX: PROCESSES[0].slotX,
  browserY: ARENA_Y,
  browserScale: 1,
  pidVisible: { browser: true, editor: true, music: true },
  highlightBrowser: false,
}

export default function Act2SetiapProcessPunyaPid({ state, origin }) {
  const s = { ...SUMMARY_STATE, ...(state || {}) }
  const pop = s.pop || {}
  return withOrigin(
    <>
      <SceneChrome state={s} />
      <g opacity={oop(pop, 'clone')}>
        <PidChip x={CLONE_X} y={CLONE_Y} opacity={1} pid={CLONE_PID} />
      </g>
      <g opacity={oop(pop, 'pid-reuse')}>
        <PidChip x={PID_REUSE_X} y={PID_REUSE_Y} opacity={0.6} pid={CLONE_PID} />
      </g>
    </>,
    origin,
  )
}
