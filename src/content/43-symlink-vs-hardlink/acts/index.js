// src/content/43-symlink-vs-hardlink/acts/index.js
// Registry ACT_SCENES — urutan = urutan phaseIdx/act di timeline.
// Dipakai oleh Animation.jsx untuk render live (ACT_SCENES[phaseIdx])
// dan oleh IntroHeaderMorphV1 untuk background intro (prop bg+bgScenes).
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import Act1Inode from './Act1Inode'
import Act2Hardlink from './Act2Hardlink'
import Act3Symlink from './Act3Symlink'
import Act4Deploy from './Act4Deploy'

export const ACT_SCENES = [
  Act1Inode,
  Act2Hardlink,
  Act3Symlink,
  Act4Deploy,
]

export { Act1Inode, Act2Hardlink, Act3Symlink, Act4Deploy }
