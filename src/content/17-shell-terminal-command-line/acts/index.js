// src/content/48-shell-terminal-command-line/acts/index.js
// Registry ACT_SCENES — urutan = urutan phaseIdx/act di timeline.
// Dipakai oleh Animation.jsx untuk render live (ACT_SCENES[phaseIdx])
// dan oleh IntroHeaderMorphV1 untuk background intro (prop bg+bgScenes).
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import Act1CommandWorks from './Act1CommandWorks'
import Act2BuiltinExec from './Act2BuiltinExec'
import Act3EchoHome from './Act3EchoHome'
import Act4GrepError from './Act4GrepError'
import Act5Contexts from './Act5Contexts'
import Act6QuoteShield from './Act6QuoteShield'

export const ACT_SCENES = [
  Act1CommandWorks,
  Act2BuiltinExec,
  Act3EchoHome,
  Act4GrepError,
  Act5Contexts,
  Act6QuoteShield,
]

export { Act1CommandWorks, Act2BuiltinExec, Act3EchoHome, Act4GrepError, Act5Contexts, Act6QuoteShield }
