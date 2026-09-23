// src/content/43-symlink-vs-hardlink/acts/Act3Symlink.jsx
// ACT 3 — Symlink: Papan Petunjuk Jalan (ln -s). Elemen: diskBlock
// (diredupkan, bukan fokus — symlink TIDAK menempel ke Inode), v1Folder
// (/var/www/v1), symlinkFile (current, berisi teks path), panah putus-putus
// ke v1Folder (bukan ke Inode). symlinkBroken membuat v1Folder tercoret &
// panah jadi merah "DANGLING". Mode summary: symlink patah (paling
// menegaskan poin cerita).
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import { pose, oop, InodeChrome, PointerArrow, FileCard, CmdBar, withOrigin } from './common'
import {
  COLORS, V1_FOLDER_PT, SYMLINK_PT, CMD_PT,
  V1_FOLDER_LABEL, SYMLINK_LABEL, ACT3_CMD_DELETE,
} from '../data'

export const SUMMARY_STAGE = 'after'
export const SUMMARY_POSITIONS = {
  diskBlock: { x: 0, y: 0, scale: 1, opacity: 0.45 },
  v1Folder: { x: 0, y: 0, scale: 1, opacity: 1 },
  symlinkFile: { x: 0, y: 0, scale: 1, opacity: 1 },
}

export default function Act3Symlink({ state, origin }) {
  const pop = state?.pop || SUMMARY_POSITIONS
  const symlinkBroken = state?.symlinkBroken ?? true
  const cmdText = state?.cmdText ?? ACT3_CMD_DELETE

  const vfp = pose(pop, 'v1Folder')
  const sfp = pose(pop, 'symlinkFile')
  const cp = pose(pop, 'cmdBar')
  const arrowColor = symlinkBroken ? COLORS.BROKEN : COLORS.SYMLINK
  const arrowLabel = symlinkBroken ? 'DANGLING — target hilang' : 'isi: teks path'

  return withOrigin(
    <>
      <InodeChrome state={{ pop, linkCount: 1 }} />

      {cp.opacity > 0.02 && <CmdBar x={CMD_PT.x + cp.x} y={CMD_PT.y + cp.y} text={cmdText} opacity={cp.opacity} color={COLORS.SYMLINK} />}

      <PointerArrow from={SYMLINK_PT} to={V1_FOLDER_PT} progress={oop(pop, 'symlinkFile') > 0.3 ? 1 : 0}
        color={arrowColor} dashed label={arrowLabel} />

      <FileCard x={V1_FOLDER_PT.x + vfp.x} y={V1_FOLDER_PT.y + vfp.y} opacity={vfp.opacity} scale={vfp.scale}
        label={V1_FOLDER_LABEL} sub="folder target" color={COLORS.HARDLINK} icon="folder" crossed={symlinkBroken} />

      <FileCard x={SYMLINK_PT.x + sfp.x} y={SYMLINK_PT.y + sfp.y} opacity={sfp.opacity} scale={sfp.scale}
        label={SYMLINK_LABEL} sub={symlinkBroken ? 'symlink patah' : 'symlink (ln -s)'} color={arrowColor} icon="route" />
    </>,
    origin,
  )
}
