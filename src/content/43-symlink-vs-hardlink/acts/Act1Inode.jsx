// src/content/43-symlink-vs-hardlink/acts/Act1Inode.jsx
// ACT 1 — Konsep Inode & Nama File. Elemen: diskBlock (Inode, persisten
// lintas Act 1-3 lewat InodeChrome), originalFile (original.txt), panah
// penunjuk. Mode summary (tanpa props, dipakai intro bg): semua muncul
// penuh di posisi akhir.
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import { pose, oop, InodeChrome, PointerArrow, FileCard, withOrigin } from './common'
import { COLORS, INODE_PT, ORIGINAL_PT, ORIGINAL_LABEL } from '../data'

export const SUMMARY_STAGE = 'after'
export const SUMMARY_POSITIONS = {
  diskBlock: { x: 0, y: 0, scale: 1, opacity: 1 },
  originalFile: { x: 0, y: 0, scale: 1, opacity: 1 },
}

export default function Act1Inode({ state, origin }) {
  const pop = state?.pop || SUMMARY_POSITIONS
  const fp = pose(pop, 'originalFile')
  const arrowProgress = oop(pop, 'originalFile') > 0.3 ? 1 : 0

  return withOrigin(
    <>
      <InodeChrome state={{ pop, linkCount: 1 }} />

      <PointerArrow from={ORIGINAL_PT} to={INODE_PT} progress={arrowProgress} color={COLORS.HARDLINK} label="menunjuk inode" />

      <FileCard x={ORIGINAL_PT.x + fp.x} y={ORIGINAL_PT.y + fp.y} opacity={fp.opacity} scale={fp.scale}
        label={ORIGINAL_LABEL} sub="nama di direktori" color={COLORS.HARDLINK} />
    </>,
    origin,
  )
}
