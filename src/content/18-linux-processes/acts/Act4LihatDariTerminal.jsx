// src/content/60-linux-processes/acts/Act4LihatDariTerminal.jsx
// ACT 4 — Terminal jalankan `ps`, baris PID 1042 (browser) disorot sebagai
// biang laptop lambat. Elemen khusus act ini: ResourceMetersBlock (masih
// terlihat, sesuai continuity map) + TerminalPsPanel. Elemen persisten
// (caption, program file, 3 process card + PID) ada di SceneChrome
// (common.jsx).
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import React from 'react'
import { CAPTIONS, PROCESSES, BROWSER_SPIKE } from '../data'
import {
  SceneChrome, ResourceMetersBlock, TerminalPsPanel, withOrigin,
  ARENA_Y, TERMINAL_X, TERMINAL_Y,
} from './common'

// Momen akhir Act 4 (= momen akhir keseluruhan topic, dipakai sebagai intro
// background — lihat Animation.jsx `bg={4}`): tabel ps penuh, baris browser
// disorot, payoff sudah tampil.
export const SUMMARY_STATE = {
  pop: {
    caption: { opacity: 0, scale: 0, x: 0, y: 0 }, // caption lokal sudah di-fade, payoff ada di panel
    editor: { opacity: 1, scale: 1, x: 0, y: 0 },
    music: { opacity: 1, scale: 1, x: 0, y: 0 },
    resourcePanels: { opacity: 1, scale: 1, x: 0, y: 0 },
    terminal: { opacity: 1, scale: 1, x: 0, y: 0 },
  },
  caption: CAPTIONS.PS_PID,
  captionX: 150,
  captionY: 765,
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
  promptTyped: true,
  psRows: 3,
  showTakeaway: true,
  highlightPsRow0: true,
}

export default function Act4LihatDariTerminal({ state, origin }) {
  const s = { ...SUMMARY_STATE, ...(state || {}) }
  const pop = s.pop || {}
  return withOrigin(
    <>
      <SceneChrome state={s} />
      <ResourceMetersBlock state={s} />
      <TerminalPsPanel
        x={TERMINAL_X} y={TERMINAL_Y}
        opacity={s.pop ? (pop.terminal?.opacity ?? 0) : 1}
        scale={s.pop ? (pop.terminal?.scale ?? 1) : 1}
        promptTyped={s.promptTyped} psRows={s.psRows} showTakeaway={s.showTakeaway}
        takeawayText={CAPTIONS.PAYOFF} highlightRowId={s.highlightPsRow0 ? 'browser' : null}
      />
    </>,
    origin,
  )
}
