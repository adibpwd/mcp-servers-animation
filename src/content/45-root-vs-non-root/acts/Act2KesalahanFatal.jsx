// src/content/45-root-vs-non-root/acts/Act2KesalahanFatal.jsx
// ACT 2 — Kesalahan Fatal Satu Spasi: `rm -rf / tmp/*` dieksekusi root tanpa
// konfirmasi apa pun, file sistem lenyap satu-satu, server jadi destroyed.
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import { UserBadge, TerminalWindow, ServerBox, FSRow } from './common'
import { FS_FILES } from '../data'

export const SUMMARY_STAGE = 'destroyed'
export const SUMMARY_STATE = {
  terminalVisible: true,
  promptRoot: true,
  commandText: 'rm -rf / tmp/*',
  dangerHighlight: false,
  noConfirm: true,
  userBadgeVisible: true,
  userRole: 'root',
  serverVisible: true,
  serverState: 'destroyed',
  fsVisible: true,
  fsDestroyedCount: FS_FILES.length,
}

export default function Act2KesalahanFatal({ state }) {
  const s = { ...SUMMARY_STATE, ...state }
  return (
    <>
      <TerminalWindow
        visible={s.terminalVisible}
        promptRoot={s.promptRoot}
        commandText={s.commandText}
        dangerHighlight={s.dangerHighlight}
        noConfirm={s.noConfirm}
      />
      <UserBadge visible={s.userBadgeVisible} role={s.userRole} />
      <FSRow visible={s.fsVisible} destroyedCount={s.fsDestroyedCount} />
      <ServerBox visible={s.serverVisible} state={s.serverState} />
    </>
  )
}
