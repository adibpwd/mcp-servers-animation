// Icon loader — 60-linux-processes (revisi-01)
// STATUS: 5 icon (icon-browser, icon-editor, icon-music, icon-launch-cursor,
// icon-warning-load) BELUM digenerate (icons.json §generation.prompt sudah
// siap, tapi grid PNG-nya harus dibuat manual lewat ChatGPT lalu di-upload +
// crop via /api/icons/generate). Sampai itu terjadi, getIcon() sengaja
// fallback ke default-icon.png untuk SEMUA id — supaya Animation.jsx sudah
// bisa render <image> tanpa menunggu asset asli, dan begitu 5 PNG asli sudah
// ada, GANTI file ini saja (import per-id seperti pola
// src/content/11-tailscale/icons/loader.js) — Animation.jsx tidak perlu diubah.

import defaultIcon from './default-icon.png'

export const ICONS = {}

export function getIcon() {
  return defaultIcon
}
