// Icon loader — 60-linux-processes
// STATUS: DEPRECATED sejak revisi-03 (2026-09-21). Kelima icon
// (browser/editor/music/launch-cursor/warning-load) sekarang inline SVG
// (lihat ../icons/inlineSvg.jsx, dipakai dari ../acts/common.jsx) —
// TIDAK ada lagi <image> yang memanggil getIcon() di kode topic ini.
// File ini (+ icons.json + default-icon.png) dibiarkan ada sebagai
// riwayat/referensi pola PNG-based (lihat revisi-01), bukan karena masih
// dipakai. Kalau suatu saat topic ini butuh icon PNG asli lagi (bukan
// inline SVG), pola importnya tetap seperti ini — tapi untuk sekarang,
// getIcon() di bawah tidak dipanggil dari mana pun.

import defaultIcon from './default-icon.png'

export const ICONS = {}

export function getIcon() {
  return defaultIcon
}
