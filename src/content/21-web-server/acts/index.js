// src/content/92-web-server/acts/index.js
// Registry ACT_SCENES — urutan = urutan phaseIdx/act di timeline.
// Dipakai Animation.jsx (render live ACT_SCENES[phaseIdx]) dan
// IntroHeaderMorphV1 (background intro via bg+bgScenes).
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import Act1SiapaMenerima from './Act1SiapaMenerima'
import Act2HalamanStatis from './Act2HalamanStatis'
import Act3DataDinamis from './Act3DataDinamis'
import Act4ResponseKembali from './Act4ResponseKembali'

export const ACT_SCENES = [
  Act1SiapaMenerima,
  Act2HalamanStatis,
  Act3DataDinamis,
  Act4ResponseKembali,
]

export { Act1SiapaMenerima, Act2HalamanStatis, Act3DataDinamis, Act4ResponseKembali }
