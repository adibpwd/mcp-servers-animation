// src/content/44-ssh/acts/index.js
// Registry ACT_SCENES — urutan = urutan phaseIdx/act di timeline.
// Dipakai oleh Animation.jsx untuk render live (ACT_SCENES[phaseIdx])
// dan oleh IntroHeaderMorphV1 untuk background intro (prop bg+bgScenes).
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import Act1Verify from './Act1Verify'
import Act2Identity from './Act2Identity'
import Act3Remote from './Act3Remote'
import Act4Forward from './Act4Forward'
import Act5Operations from './Act5Operations'

export const ACT_SCENES = [
  Act1Verify,
  Act2Identity,
  Act3Remote,
  Act4Forward,
  Act5Operations,
]

export { Act1Verify, Act2Identity, Act3Remote, Act4Forward, Act5Operations }