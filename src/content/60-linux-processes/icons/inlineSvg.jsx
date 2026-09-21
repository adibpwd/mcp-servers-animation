// src/content/60-linux-processes/icons/inlineSvg.jsx
// Inline SVG icon (revisi-03) — menggantikan getIcon()/PNG placeholder untuk
// SEMUA 5 icon topic ini (browser/editor/music/launch-cursor/warning-load).
// Alasan: vektor bersih, warna bisa ikut warna process/tema (getIcon() lama
// selalu placeholder generik abu-abu, lihat icons/loader.js), dan TIDAK
// perlu menunggu Adib generate PNG lewat ChatGPT — bebas dependency manual.
// PURE presentational, tanpa GSAP/state.

import React from 'react'

export function IconBrowser({ size = 24, color = '#38BDF8' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="3" width="20" height="18" rx="4" />
      <line x1="2" y1="8" x2="22" y2="8" />
      <circle cx="5" cy="5.5" r="0.8" fill={color} stroke="none" />
      <circle cx="8" cy="5.5" r="0.8" fill={color} stroke="none" />
    </svg>
  )
}

export function IconEditor({ size = 24, color = '#FBBF24' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6" />
      <polyline points="8 6 2 12 8 18" />
    </svg>
  )
}

export function IconMusic({ size = 24, color = '#F472B6' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M9 18V5l12-2v13" />
      <circle cx="6" cy="18" r="3" />
      <circle cx="18" cy="16" r="3" />
    </svg>
  )
}

export function IconCursorClick({ size = 24, color = '#94A3B8' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4 L4 16 L8 13 L11 20 L13 19 L10 12 L16 12 Z" fill={color} stroke="none" />
      <line x1="17" y1="2" x2="19" y2="4" />
      <line x1="21" y1="7" x2="23" y2="7" />
      <line x1="19" y1="11" x2="21" y2="13" />
    </svg>
  )
}

export function IconGaugeWarning({ size = 24, color = '#F87171' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 18 A9 9 0 0 1 21 18" />
      <line x1="12" y1="18" x2="17" y2="10" />
      <circle cx="12" cy="18" r="1.6" fill={color} stroke="none" />
    </svg>
  )
}
