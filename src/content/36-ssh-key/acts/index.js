// src/content/36-ssh-key/acts/index.js
// Registry ACT_SCENES — urutan = urutan phaseIdx/act di timeline.
// Dipakai oleh Animation.jsx untuk render live (ACT_SCENES[phaseIdx])
// dan oleh IntroHeaderMorphV1 untuk background intro (prop bg+bgScenes).
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import Act1BruteForce from './Act1BruteForce'
import Act2Keygen from './Act2Keygen'
import Act3AuthorizedKeys from './Act3AuthorizedKeys'
import Act4ChallengeResponse from './Act4ChallengeResponse'

export const ACT_SCENES = [
  Act1BruteForce,
  Act2Keygen,
  Act3AuthorizedKeys,
  Act4ChallengeResponse,
]

export { Act1BruteForce, Act2Keygen, Act3AuthorizedKeys, Act4ChallengeResponse }
