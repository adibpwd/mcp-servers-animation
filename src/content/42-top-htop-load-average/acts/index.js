// src/content/42-top-htop-load-average/acts/index.js
// Registry ACT_SCENES — urutan = urutan phaseIdx/act di timeline.
// Dipakai oleh Animation.jsx untuk render live (ACT_SCENES[phaseIdx]).
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import Act1Dashboard from './Act1Dashboard'
import Act2Numbers from './Act2Numbers'
import Act3CoreRatio from './Act3CoreRatio'
import Act4Bottleneck from './Act4Bottleneck'

export const ACT_SCENES = [
  Act1Dashboard,
  Act2Numbers,
  Act3CoreRatio,
  Act4Bottleneck,
]

export { Act1Dashboard, Act2Numbers, Act3CoreRatio, Act4Bottleneck }
