// src/content/42-top-htop-load-average/acts/common.jsx
// ─────────────────────────────────────────────────────────────
// Helper bersama untuk file per-act (pola "1 act = 1 file", lihat
// docs/standardizations/07-act-scene-pattern.md).
//
// Kontrak:
//   • Tiap komponen act PURE presentational — tanpa GSAP, tanpa React state.
//   • Satu prop `state = { pop, phaseIdx, ... }` — semua field OPSIONAL,
//     null-safe (default aman lewat pose() di bawah).
//   • Dipanggil TANPA props → mode "summary": semua elemen act tampil di
//     posisi akhir (dipakai intro background/thumbnail).
//
// Topic ini TIDAK punya "chrome" persisten lintas-Act (beda dari
// 16-ssh yang punya client/server/channel tetap) — tiap Act adalah
// papan visual independen (dashboard, angka, jalan tol, perbandingan),
// jadi helper di sini murni pose/transform, tanpa ActChrome.
// ─────────────────────────────────────────────────────────────

import React from 'react'

/** Ambil pose (posisi/opacity) elemen dari pop state — default tampil penuh
 *  (mode summary aman tanpa perlu isi SUMMARY_POSITIONS per elemen). */
export const pose = (pop, id) => pop?.[id] || { scale: 1, opacity: 1, x: 0, y: 0 }

/** transform translate(cx + dx, cy + dy) scale(s) — pola T() di Animation. */
export const tos = (pop, id, cx, cy) => {
  const p = pose(pop, id)
  return `translate(${cx + p.x}, ${cy + p.y}) scale(${p.scale})`
}

/** opacity elemen — setara O() di Animation. */
export const oop = (pop, id) => pose(pop, id).opacity

/** Bungkus scene act + origin translate (default {0,0}), dipakai intro bg. */
export function withOrigin(children, origin = { x: 0, y: 0 }) {
  if (!origin || (origin.x === 0 && origin.y === 0)) return children
  return <g transform={`translate(${origin.x}, ${origin.y})`}>{children}</g>
}
