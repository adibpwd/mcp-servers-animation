// src/content/43-symlink-vs-hardlink/acts/Act4Deploy.jsx
// ACT 4 — Zero-Downtime Deployment (penerapan nyata). Elemen: nginx
// (persisten via DeployChrome), current (symlink), v1Deploy, v2Deploy.
// deployTarget menentukan folder mana yang disorot & jadi tujuan panah
// current (swap v1→v2 = ganti target, bukan teleport ulang elemen).
// Mode summary: current sudah menunjuk v2 (state akhir cerita, "sudah
// pindah tanpa restart").
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import { pose, oop, DeployChrome, PointerArrow, FileCard, CmdBar, Stamp, withOrigin } from './common'
import {
  COLORS, CURRENT_PT, V1_DEPLOY_PT, V2_DEPLOY_PT, CMD2_PT, CLOSING_Y, AXIS_X,
  CURRENT_LABEL, V1_DEPLOY_LABEL, V2_DEPLOY_LABEL, ACT4_CMD_SWAP, CLOSING_STAMPS,
} from '../data'

export const SUMMARY_STAGE = 'after'
export const SUMMARY_POSITIONS = {
  nginx: { x: 0, y: 0, scale: 1, opacity: 1 },
  current: { x: 0, y: 0, scale: 1, opacity: 1 },
  v1Deploy: { x: 0, y: 0, scale: 1, opacity: 1 },
  v2Deploy: { x: 0, y: 0, scale: 1, opacity: 1 },
}

export default function Act4Deploy({ state, origin }) {
  const pop = state?.pop || SUMMARY_POSITIONS
  const deployTarget = state?.deployTarget ?? 'v2'
  const cmdText = state?.cmdText ?? ACT4_CMD_SWAP
  const closingOpacity = state?.closingOpacity ?? (state ? 0 : 1)

  const cur = pose(pop, 'current')
  const v1p = pose(pop, 'v1Deploy')
  const v2p = pose(pop, 'v2Deploy')
  const cp = pose(pop, 'cmdBar')
  const targetPt = deployTarget === 'v1' ? V1_DEPLOY_PT : V2_DEPLOY_PT

  return withOrigin(
    <>
      <DeployChrome state={{ pop }} />

      {cp.opacity > 0.02 && <CmdBar x={CMD2_PT.x + cp.x} y={CMD2_PT.y + cp.y} text={cmdText} opacity={cp.opacity} color={COLORS.DEPLOY} />}

      <PointerArrow from={CURRENT_PT} to={targetPt} progress={oop(pop, 'current') > 0.3 ? 1 : 0}
        color={COLORS.DEPLOY} label="root aktif" />

      <FileCard x={CURRENT_PT.x + cur.x} y={CURRENT_PT.y + cur.y} opacity={cur.opacity} scale={cur.scale}
        label={CURRENT_LABEL} sub="symlink" color={COLORS.SYMLINK} icon="route" />

      <FileCard x={V1_DEPLOY_PT.x + v1p.x} y={V1_DEPLOY_PT.y + v1p.y} opacity={v1p.opacity * (deployTarget === 'v1' ? 1 : 0.55)} scale={v1p.scale}
        label={V1_DEPLOY_LABEL} sub={deployTarget === 'v1' ? 'live' : 'nonaktif'} color={deployTarget === 'v1' ? COLORS.ACTIVE : COLORS.MUTED} icon="folder" />

      <FileCard x={V2_DEPLOY_PT.x + v2p.x} y={V2_DEPLOY_PT.y + v2p.y} opacity={v2p.opacity * (deployTarget === 'v2' ? 1 : 0.55)} scale={v2p.scale}
        label={V2_DEPLOY_LABEL} sub={deployTarget === 'v2' ? 'live' : 'siap, belum aktif'} color={deployTarget === 'v2' ? COLORS.ACTIVE : COLORS.MUTED} icon="folder" />

      <g opacity={closingOpacity} filter="url(#glow)">
        <Stamp x={AXIS_X - 120} y={CLOSING_Y} color={COLORS.HARDLINK} top={CLOSING_STAMPS[0].top} sub={CLOSING_STAMPS[0].sub} icon={CLOSING_STAMPS[0].icon} rot={-6} />
        <Stamp x={AXIS_X + 120} y={CLOSING_Y} color={COLORS.SYMLINK} top={CLOSING_STAMPS[1].top} sub={CLOSING_STAMPS[1].sub} icon={CLOSING_STAMPS[1].icon} rot={6} />
      </g>
    </>,
    origin,
  )
}
