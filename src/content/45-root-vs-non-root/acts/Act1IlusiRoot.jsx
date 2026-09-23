// src/content/45-root-vs-non-root/acts/Act1IlusiRoot.jsx
// ACT 1 — Ilusi Kemudahan Login Root: user biasa eskalasi via `sudo su`,
// prompt berubah jadi root, badge identitas berubah dari user ke root+crown.
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import { UserBadge, TerminalWindow } from './common'

export const SUMMARY_STAGE = 'root-active'
export const SUMMARY_STATE = {
  terminalVisible: true,
  promptRoot: true,
  commandText: 'rm important-config',
  noConfirm: true,
  userBadgeVisible: true,
  userRole: 'root',
}

export default function Act1IlusiRoot({ state }) {
  const s = { ...SUMMARY_STATE, ...state }
  return (
    <>
      <TerminalWindow
        visible={s.terminalVisible}
        promptRoot={s.promptRoot}
        commandText={s.commandText}
        noConfirm={s.noConfirm}
      />
      <UserBadge visible={s.userBadgeVisible} role={s.userRole} />
    </>
  )
}
