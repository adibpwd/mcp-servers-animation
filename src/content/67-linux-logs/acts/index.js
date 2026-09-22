// src/content/67-linux-logs/acts/index.js
// Registry ACT_SCENES — urutan = urutan phaseIdx/act di timeline.
// Dipakai oleh Animation.jsx untuk render live (ACT_SCENES[phaseIdx])
// dan oleh IntroHeaderMorphV1 untuk background intro (prop bg+bgScenes).
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import Act1DuaJalur from './Act1DuaJalur'
import Act2Journald from './Act2Journald'
import Act3LogFiles from './Act3LogFiles'
import Act4Rotasi from './Act4Rotasi'
import Act5Audit from './Act5Audit'
import Act6Rekonstruksi from './Act6Rekonstruksi'

export const ACT_SCENES = [
  Act1DuaJalur,
  Act2Journald,
  Act3LogFiles,
  Act4Rotasi,
  Act5Audit,
  Act6Rekonstruksi,
]

export { Act1DuaJalur, Act2Journald, Act3LogFiles, Act4Rotasi, Act5Audit, Act6Rekonstruksi }
