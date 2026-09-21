// 93-reverse-proxy/acts/index.js
// Registry ACT_SCENES — urutan = urutan phaseIdx di timeline (== PHASES).
// Dipakai Animation.jsx untuk render live (ACT_SCENES[phaseIdx]) dan
// IntroHeaderMorphV1 untuk background intro (prop bg + bgScenes).
// Pola "1 act = 1 file" — docs/standardizations/07-act-scene-pattern.md.

import Act1SatuPintuPublik from './Act1SatuPintuPublik'
import Act2ProxyMemilihTujuan from './Act2ProxyMemilihTujuan'
import Act3RequestDiteruskan from './Act3RequestDiteruskan'
import Act4ResponseKembali from './Act4ResponseKembali'

export const ACT_SCENES = [
  Act1SatuPintuPublik,
  Act2ProxyMemilihTujuan,
  Act3RequestDiteruskan,
  Act4ResponseKembali,
]

export { Act1SatuPintuPublik, Act2ProxyMemilihTujuan, Act3RequestDiteruskan, Act4ResponseKembali }
