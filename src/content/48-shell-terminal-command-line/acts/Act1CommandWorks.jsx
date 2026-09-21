// src/content/48-shell-terminal-command-line/acts/Act1CommandWorks.jsx
// EKSEKUSI-04 (revisi-03): Act 1 — "Satu Command Bekerja" (pwd). Tidak ada
// konten unik di luar ArchChrome — act inilah yang MEMBANGUN chrome
// (terminal, PTY, shell hub, system node) yang lalu persisten sampai akhir.
import React from 'react'
import { ArchChrome, withOrigin, BODY_CX, TERMINAL_Y } from './common'

const FULL = { scale: 1, opacity: 1, x: 0, y: 0 }

export const SUMMARY_STATE = {
  stage: 'overview',
  caption: 'Terminal menampilkan. Shell mengatur.',
  phaseIdx: 0,
  highlightId: null,
  cmdLineText: '$ pwd',
  outputText: '/home/adib',
  outputTypedLen: 10,
  pop: { terminalWin: FULL, ptyCable: FULL, shellHub: FULL, systemNode: FULL },
  packet: { x: BODY_CX, y: TERMINAL_Y + 74, label: '/home/adib', visible: true, variant: 'output' },
}

export default function Act1CommandWorks({ state, origin }) {
  const s = state || SUMMARY_STATE
  return withOrigin(<ArchChrome state={s} />, origin)
}
