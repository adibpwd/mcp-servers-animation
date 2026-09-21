// src/content/81-network-interface/acts/index.js
// Registry ACT_SCENES — urutan = urutan phaseIdx/act di timeline.
// Dipakai oleh Animation.jsx untuk render live (ACT_SCENES[phaseIdx])
// dan oleh IntroHeaderMorphV1 untuk background intro (prop bg+bgScenes).
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import Act1TitikKoneksi from './Act1TitikKoneksi'
import Act2LinkDanIdentity from './Act2LinkDanIdentity'
import Act3MendapatKonfigurasi from './Act3MendapatKonfigurasi'
import Act4MemilihJalan from './Act4MemilihJalan'
import Act5NamaKeTujuan from './Act5NamaKeTujuan'
import Act6InterfaceVirtual from './Act6InterfaceVirtual'

export const ACT_SCENES = [
  Act1TitikKoneksi,
  Act2LinkDanIdentity,
  Act3MendapatKonfigurasi,
  Act4MemilihJalan,
  Act5NamaKeTujuan,
  Act6InterfaceVirtual,
]

export {
  Act1TitikKoneksi,
  Act2LinkDanIdentity,
  Act3MendapatKonfigurasi,
  Act4MemilihJalan,
  Act5NamaKeTujuan,
  Act6InterfaceVirtual,
}
