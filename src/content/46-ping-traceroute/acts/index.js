// src/content/46-ping-traceroute/acts/index.js
// Registry ACT_SCENES — urutan = urutan phaseIdx/act di timeline.
// Dipakai oleh Animation.jsx untuk render live (ACT_SCENES[phaseIdx])
// dan oleh IntroHeaderMorphV1 untuk background intro (prop bg+bgScenes).
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import Act1Diagnose from './Act1Diagnose'
import Act2Ping from './Act2Ping'
import Act3Traceroute from './Act3Traceroute'
import Act4Breakpoint from './Act4Breakpoint'

export const ACT_SCENES = [
  Act1Diagnose,
  Act2Ping,
  Act3Traceroute,
  Act4Breakpoint,
]

export { Act1Diagnose, Act2Ping, Act3Traceroute, Act4Breakpoint }
