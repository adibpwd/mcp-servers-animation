// src/content/45-root-vs-non-root/acts/Act3BlastRadius.jsx
// ACT 3 — Skenario Peretasan: Blast Radius. Web app punya bug RCE. Skenario A
// (run as root): blast radius penuh, target dibobol. Skenario B (www-data):
// blast radius terkontain, target tetap aman.
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import { HackerIcon, WebAppBox, BlastRadius, TargetLock } from './common'

export const SUMMARY_STAGE = 'scenario-b'
export const SUMMARY_STATE = {
  hackerVisible: true,
  hackerActive: true,
  webappVisible: true,
  runAsRoot: false,
  blastVisible: true,
  blastContained: true,
  targetVisible: true,
  targetBreached: false,
}

export default function Act3BlastRadius({ state }) {
  const s = { ...SUMMARY_STATE, ...state }
  return (
    <>
      <BlastRadius visible={s.blastVisible} contained={s.blastContained} />
      <HackerIcon visible={s.hackerVisible} active={s.hackerActive} />
      <WebAppBox visible={s.webappVisible} runAsRoot={s.runAsRoot} />
      <TargetLock visible={s.targetVisible} breached={s.targetBreached} />
    </>
  )
}
