// src/content/94-domain-to-server/acts/index.js
// Registry ACT_SCENES — urutan = urutan phaseIdx di timeline Animation.jsx.
// Dipakai untuk render live (ACT_SCENES[phaseIdx]) dan oleh
// IntroHeaderMorphV1 untuk background intro (prop bg+bgScenes).
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import Act1ResolveDomain from './Act1ResolveDomain'
import Act2ConnectEdge from './Act2ConnectEdge'
import Act3ProxyToApp from './Act3ProxyToApp'
import Act4ReturnPage from './Act4ReturnPage'

export const ACT_SCENES = [
  Act1ResolveDomain,
  Act2ConnectEdge,
  Act3ProxyToApp,
  Act4ReturnPage,
]

export { Act1ResolveDomain, Act2ConnectEdge, Act3ProxyToApp, Act4ReturnPage }
