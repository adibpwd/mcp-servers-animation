// src/content/48-shell-terminal-command-line/acts/Act2BuiltinExec.jsx
// EKSEKUSI-04 (revisi-03): Act 2 — "Builtin vs Executable" (ls -la lewat
// PATH). Konten uniknya adalah forkBuiltin/forkExec yang muncul untuk
// pertama kali; sisanya (terminal/PTY/shell/system) sudah dibangun Act 1.
import React from 'react'
import { ArchChrome, withOrigin, BODY_CX, FORK_Y } from './common'

const FULL = { scale: 1, opacity: 1, x: 0, y: 0 }

export const SUMMARY_STATE = {
  stage: 'builtin-vs-exec',
  caption: 'Builtin dan executable punya jalur berbeda',
  phaseIdx: 1,
  archDim: false,
  forkChoice: 'exec',
  cmdLineText: '$ ls -la',
  outputText: '',
  outputTypedLen: 0,
  pop: {
    terminalWin: FULL, ptyCable: FULL, shellHub: FULL, systemNode: FULL,
    forkBuiltin: FULL, forkExec: FULL,
  },
  packet: { x: BODY_CX, y: FORK_Y, label: 'ls -la → PATH', visible: true, variant: 'command' },
}

export default function Act2BuiltinExec({ state, origin }) {
  const s = state || SUMMARY_STATE
  return withOrigin(<ArchChrome state={s} />, origin)
}
