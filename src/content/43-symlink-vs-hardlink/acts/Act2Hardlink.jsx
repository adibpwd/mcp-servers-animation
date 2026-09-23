// src/content/43-symlink-vs-hardlink/acts/Act2Hardlink.jsx
// ACT 2 — Hard Link: Dua Pintu Satu Ruangan. Elemen: diskBlock (dari
// Act 1, di-render ulang di sini — tiap act mandiri, lihat kontrak
// common.jsx), originalFile, hardlinkFile, cmdBar, dua panah ke Inode
// yang sama. originalDeleted mencoret originalFile & linkCount turun.
// Mode summary: hardlink.txt aktif, original.txt sudah dihapus (state
// akhir yang paling menegaskan poin cerita — "data tetap ada").
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import { pose, oop, InodeChrome, PointerArrow, FileCard, CmdBar, withOrigin } from './common'
import {
  COLORS, INODE_PT, ORIGINAL_PT, HARDLINK_PT, CMD_PT,
  ORIGINAL_LABEL, HARDLINK_LABEL, ACT2_CMD_CREATE, ACT2_CMD_DELETE,
} from '../data'

export const SUMMARY_STAGE = 'after'
export const SUMMARY_POSITIONS = {
  diskBlock: { x: 0, y: 0, scale: 1, opacity: 1 },
  originalFile: { x: 0, y: 0, scale: 1, opacity: 1 },
  hardlinkFile: { x: 0, y: 0, scale: 1, opacity: 1 },
}

export default function Act2Hardlink({ state, origin }) {
  const pop = state?.pop || SUMMARY_POSITIONS
  const linkCount = state?.linkCount ?? 2
  const originalDeleted = state?.originalDeleted ?? true
  const cmdText = state?.cmdText ?? ACT2_CMD_DELETE

  const ofp = pose(pop, 'originalFile')
  const hfp = pose(pop, 'hardlinkFile')
  const cp = pose(pop, 'cmdBar')

  return withOrigin(
    <>
      <InodeChrome state={{ pop, linkCount }} />

      {cp.opacity > 0.02 && <CmdBar x={CMD_PT.x + cp.x} y={CMD_PT.y + cp.y} text={cmdText} opacity={cp.opacity} color={COLORS.HARDLINK} />}

      <PointerArrow from={ORIGINAL_PT} to={INODE_PT} progress={oop(pop, 'originalFile') > 0.3 ? 1 : 0}
        color={originalDeleted ? COLORS.BORDER : COLORS.HARDLINK} opacity={originalDeleted ? 0.3 : 1} />
      <PointerArrow from={HARDLINK_PT} to={INODE_PT} progress={oop(pop, 'hardlinkFile') > 0.3 ? 1 : 0}
        color={COLORS.HARDLINK} label="Inode sama persis" />

      <FileCard x={ORIGINAL_PT.x + ofp.x} y={ORIGINAL_PT.y + ofp.y} opacity={ofp.opacity} scale={ofp.scale}
        label={ORIGINAL_LABEL} sub="pintu pertama" color={COLORS.HARDLINK} crossed={originalDeleted} />

      <FileCard x={HARDLINK_PT.x + hfp.x} y={HARDLINK_PT.y + hfp.y} opacity={hfp.opacity} scale={hfp.scale}
        label={HARDLINK_LABEL} sub="pintu kedua" color={originalDeleted ? COLORS.ACTIVE : COLORS.HARDLINK} />
    </>,
    origin,
  )
}
