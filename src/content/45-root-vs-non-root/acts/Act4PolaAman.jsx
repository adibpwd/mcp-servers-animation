// src/content/45-root-vs-non-root/acts/Act4PolaAman.jsx
// ACT 4 — Pola Aman: akun khusus (systemd User=appuser) + eskalasi sudo
// hanya sesaat saat benar-benar perlu. Server kembali healthy.
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import { SystemdCard, UserBadge, SudoBadge, ServerBox } from './common'

export const SUMMARY_STAGE = 'safe'
export const SUMMARY_STATE = {
  systemdVisible: true,
  userBadgeVisible: true,
  userRole: 'appuser',
  sudoVisible: false,
  serverVisible: true,
  serverState: 'healthy',
}

export default function Act4PolaAman({ state }) {
  const s = { ...SUMMARY_STATE, ...state }
  return (
    <>
      <ServerBox visible={s.serverVisible} state={s.serverState} />
      <SystemdCard visible={s.systemdVisible} />
      <UserBadge visible={s.userBadgeVisible} role={s.userRole} />
      <SudoBadge visible={s.sudoVisible} />
    </>
  )
}
