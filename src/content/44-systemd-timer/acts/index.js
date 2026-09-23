// src/content/44-systemd-timer/acts/index.js
// Registry ACT_SCENES — urutan = urutan phaseIdx/act di timeline.
// Dipakai oleh Animation.jsx untuk render live (ACT_SCENES[phaseIdx])
// dan oleh IntroHeaderMorphV1 untuk background intro (prop bg+bgScenes).
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import Act1BatasanCron from './Act1BatasanCron'
import Act2AnatomiUnit from './Act2AnatomiUnit'
import Act3Persistent from './Act3Persistent'
import Act4Observabilitas from './Act4Observabilitas'

export const ACT_SCENES = [
  Act1BatasanCron,
  Act2AnatomiUnit,
  Act3Persistent,
  Act4Observabilitas,
]

export {
  Act1BatasanCron,
  Act2AnatomiUnit,
  Act3Persistent,
  Act4Observabilitas,
}
