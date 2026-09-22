// src/content/60-linux-processes/acts/Act3MemakaiResource.jsx
// ACT 3 — Resource meter muncul, lalu "spike" (real case laptop lambat).
// Elemen khusus act ini: ResourceMetersBlock + WarningLoadIcon. Elemen
// persisten (caption, program file, 3 process card + PID) ada di
// SceneChrome (common.jsx).
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import React from 'react'
import { CAPTIONS, PROCESSES, BROWSER_SPIKE } from '../data'
import {
  SceneChrome, ResourceMetersBlock, WarningLoadIcon, withOrigin, oop,
  ARENA_Y, WARNING_ICON_X, WARNING_ICON_Y,
} from './common'

// Momen akhir Act 3: resource meter penuh dengan browser sudah "spike"
// (paling berat), warning icon sudah fade (transient), caption terakhir
// Act 3: SPIKE.
export const SUMMARY_STATE = {
  pop: {
    caption: { opacity: 1, scale: 1, x: 0, y: 0 },
    editor: { opacity: 1, scale: 1, x: 0, y: 0 },
    music: { opacity: 1, scale: 1, x: 0, y: 0 },
    resourcePanels: { opacity: 1, scale: 1, x: 0, y: 0 },
    'warning-icon': { opacity: 0, scale: 0, x: 0, y: 0 },
  },
  caption: CAPTIONS.SPIKE,
  captionX: 150,
  captionY: 642,
  handoff: 1,
  browserX: PROCESSES[0].slotX,
  browserY: ARENA_Y,
  browserScale: 1,
  pidVisible: { browser: true, editor: true, music: true },
  highlightBrowser: true,
  resourceVal: {
    browser: { cpu: BROWSER_SPIKE.cpu, mem: BROWSER_SPIKE.mem },
    editor: { cpu: PROCESSES[1].cpu, mem: PROCESSES[1].mem },
    music: { cpu: PROCESSES[2].cpu, mem: PROCESSES[2].mem },
  },
}

export default function Act3MemakaiResource({ state, origin }) {
  const s = { ...SUMMARY_STATE, ...(state || {}) }
  const pop = s.pop || {}
  return withOrigin(
    <>
      <SceneChrome state={s} />
      <ResourceMetersBlock state={s} />
      <g opacity={oop(pop, 'warning-icon')}>
        <WarningLoadIcon x={WARNING_ICON_X} y={WARNING_ICON_Y} opacity={1} />
      </g>
    </>,
    origin,
  )
}
