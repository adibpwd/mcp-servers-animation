// src/content/45-root-vs-non-root/acts/index.js
// Registry ACT_SCENES — urutan = urutan phaseIdx di timeline Animation.jsx.
// Dipakai untuk render live (ACT_SCENES[phaseIdx]) dan oleh
// IntroHeaderMorphV1 untuk background intro (prop bg+bgScenes).
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import Act1IlusiRoot from './Act1IlusiRoot'
import Act2KesalahanFatal from './Act2KesalahanFatal'
import Act3BlastRadius from './Act3BlastRadius'
import Act4PolaAman from './Act4PolaAman'

export const ACT_SCENES = [
  Act1IlusiRoot,
  Act2KesalahanFatal,
  Act3BlastRadius,
  Act4PolaAman,
]

export { Act1IlusiRoot, Act2KesalahanFatal, Act3BlastRadius, Act4PolaAman }
