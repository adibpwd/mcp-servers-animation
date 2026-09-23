// src/content/35-cron-job/acts/index.js
// Registry ACT_SCENES — urutan = urutan phaseIdx/act di timeline.
// Dipakai oleh Animation.jsx untuk render live (ACT_SCENES[phaseIdx])
// dan oleh IntroHeaderMorphV1 untuk background intro (prop bg+bgScenes).
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import Act1DaemonTakTidur from './Act1DaemonTakTidur'
import Act2LimaBintang from './Act2LimaBintang'
import Act3MemicuWorker from './Act3MemicuWorker'
import Act4LogRedirection from './Act4LogRedirection'

export const ACT_SCENES = [
  Act1DaemonTakTidur,
  Act2LimaBintang,
  Act3MemicuWorker,
  Act4LogRedirection,
]

export {
  Act1DaemonTakTidur,
  Act2LimaBintang,
  Act3MemicuWorker,
  Act4LogRedirection,
}
