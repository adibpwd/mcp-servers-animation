// src/content/60-linux-processes/acts/index.js
// Registry ACT_SCENES — urutan = urutan phaseIdx/act di timeline
// (Animation.jsx / PHASES di data.js). Dipakai untuk render live
// (ACT_SCENES[phaseIdx]) dan oleh IntroHeaderMorphV1 untuk background
// intro (prop bg+bgScenes).
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import Act1FileJadiProcess from './Act1FileJadiProcess'
import Act2SetiapProcessPunyaPid from './Act2SetiapProcessPunyaPid'
import Act3MemakaiResource from './Act3MemakaiResource'
import Act4LihatDariTerminal from './Act4LihatDariTerminal'

export const ACT_SCENES = [
  Act1FileJadiProcess,
  Act2SetiapProcessPunyaPid,
  Act3MemakaiResource,
  Act4LihatDariTerminal,
]

export {
  Act1FileJadiProcess,
  Act2SetiapProcessPunyaPid,
  Act3MemakaiResource,
  Act4LihatDariTerminal,
}
