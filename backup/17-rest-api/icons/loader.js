// src/content/17-rest-api/icons/loader.js
// Auto-generated loader per docs/standardizations/06-icon-generation.md §6.1.
// Revisi-02 (analogi restoran) — lihat revisi/2026-09-11-1241-revisi-02.md.
//
// 3 icon REMOVE dari revisi-01 (envelope-closed, officer-neutral,
// officer-confused) sudah dihapus dari import & ICONS map di bawah — PNG
// filenya boleh tetap ada di folder icons/ tanpa dipakai (tidak wajib
// dihapus manual, lihat icons.json § generation.note).
//
// 3 icon REPLACE (post-building, envelope-locked, gate-signage) TETAP
// pakai nama file yang sama — cuma isi PNG-nya yang perlu digenerate ulang
// (manual oleh user di chatgpt.com, checklist eksekusi item 3). Sampai
// PNG baru digenerate, file fisik post-building.png/envelope-locked.png/
// gate-signage.png MASIH berisi gambar analogi lama (kantor pos) — import
// di bawah tetap valid secara teknis, cuma visualnya belum diganti.
//
// 1 icon BARU (`customer`) SENGAJA BELUM di-import — filenya belum ada
// sampai digenerate manual (checklist item 3). Import ditambah setelah
// customer.png benar-benar ada di folder ini, supaya dev server/build
// tidak pecah karena mengimpor file yang belum ada. Baris siap-pakai
// sudah disiapkan di komentar TODO di bawah, tinggal uncomment.

import postBuildingIcon from './post-building.png'
import envelopeLockedIcon from './envelope-locked.png'
import structuredFormIcon from './structured-form.png'
import gateSignageIcon from './gate-signage.png'
// TODO(revisi-02 checklist item 3): uncomment setelah customer.png ada
// import customerIcon from './customer.png'
import methodGetIcon from './method-get.png'
import methodPostIcon from './method-post.png'
import methodPutIcon from './method-put.png'
import methodPatchIcon from './method-patch.png'
import methodDeleteIcon from './method-delete.png'
import stamp200Icon from './stamp-200.png'
import stamp201Icon from './stamp-201.png'

export const ICONS = {
  'post-building': postBuildingIcon,
  'envelope-locked': envelopeLockedIcon,
  'structured-form': structuredFormIcon,
  'gate-signage': gateSignageIcon,
  // TODO(revisi-02 checklist item 3): uncomment setelah customer.png ada
  // 'customer': customerIcon,
  'method-get': methodGetIcon,
  'method-post': methodPostIcon,
  'method-put': methodPutIcon,
  'method-patch': methodPatchIcon,
  'method-delete': methodDeleteIcon,
  'stamp-200': stamp200Icon,
  'stamp-201': stamp201Icon,
}

export function getIcon(id) {
  return ICONS[id] || null
}
