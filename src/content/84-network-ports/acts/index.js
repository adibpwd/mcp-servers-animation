// src/content/84-network-ports/acts/index.js
// Registry ACT_SCENES — urutan = urutan phaseIdx/act di timeline.
// Dipakai oleh Animation.jsx untuk render live (ACT_SCENES[phaseIdx])
// dan oleh IntroHeaderMorphV1 untuk background intro (prop bg+bgScenes).
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import Act1HostBukanService from './Act1HostBukanService'
import Act2Listener from './Act2Listener'
import Act3TcpUdp from './Act3TcpUdp'
import Act4Endpoints from './Act4Endpoints'
import Act5ScopeFirewall from './Act5ScopeFirewall'
import Act6RealPath from './Act6RealPath'

export const ACT_SCENES = [
  Act1HostBukanService,
  Act2Listener,
  Act3TcpUdp,
  Act4Endpoints,
  Act5ScopeFirewall,
  Act6RealPath,
]

export {
  Act1HostBukanService,
  Act2Listener,
  Act3TcpUdp,
  Act4Endpoints,
  Act5ScopeFirewall,
  Act6RealPath,
}
