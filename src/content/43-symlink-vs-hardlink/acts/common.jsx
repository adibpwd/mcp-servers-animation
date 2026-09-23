// src/content/43-symlink-vs-hardlink/acts/common.jsx
// ─────────────────────────────────────────────────────────────
// Helper bersama untuk file per-act (pola "1 act = 1 file", lihat
// docs/standardizations/07-act-scene-pattern.md).
//
// Kontrak: tiap komponen act PURE presentational (tanpa GSAP, tanpa
// state sendiri), menerima prop `state` (null-safe) dan `origin`.
// InodeChrome dipakai Act 1-3 (diskBlock Inode persisten). DeployChrome
// dipakai Act 4 (nginx persisten). Layout titik SIMETRIS dengan data.js
// supaya transisi Act3→Act4 terasa seperti "map yang sama, konten baru".
// ─────────────────────────────────────────────────────────────

import React from 'react'
import { COLORS, INODE_PT, NGINX_PT, INODE_LABEL } from '../data'

export const pose = (pop, id) => pop?.[id] || { scale: 0, opacity: 0, x: 0, y: 0 }
export const tos = (pop, id, cx, cy) => {
  const p = pose(pop, id)
  return `translate(${cx + p.x}, ${cy + p.y}) scale(${p.scale})`
}
export const aos = (pop, id) => tos(pop, id, 0, 0)
export const oop = (pop, id) => pose(pop, id).opacity

export const wrapText = (str, maxChars) => {
  const lines = []
  let cur = ''
  str.split(' ').forEach(w => {
    if (cur && (cur + ' ' + w).length > maxChars) { lines.push(cur); cur = w } else { cur = cur ? cur + ' ' + w : w }
  })
  if (cur) lines.push(cur)
  return lines
}

export function withOrigin(children, origin) {
  if (!origin || (origin.x === 0 && origin.y === 0)) return children
  return <g transform={`translate(${origin.x}, ${origin.y})`}>{children}</g>
}

// ── Icon: pictogram SVG inline ──
export const Icon = ({ type, size = 28, color = COLORS.TEXT, strokeWidth = 1.8 }) => {
  const s = size / 24
  const p = { fill: 'none', stroke: color, strokeWidth: strokeWidth / s, strokeLinecap: 'round', strokeLinejoin: 'round' }
  return (
    <g transform={`scale(${s})`}>
      {type === 'disk' && (
        <g>
          <ellipse cx={0} cy={-6} rx={10} ry={4} {...p} />
          <path d="M -10,-6 L -10,6 A 10,4 0 0 0 10,6 L 10,-6" {...p} />
          <ellipse cx={0} cy={6} rx={10} ry={4} {...p} />
        </g>
      )}
      {type === 'document' && (
        <g>
          <path d="M -8,-11 L 3,-11 L 9,-5 L 9,11 L -8,11 Z" {...p} />
          <path d="M 3,-11 L 3,-5 L 9,-5" {...p} />
          <line x1={-4} y1={0} x2={5} y2={0} {...p} />
          <line x1={-4} y1={4} x2={5} y2={4} {...p} />
        </g>
      )}
      {type === 'folder' && (
        <g>
          <path d="M -10,-7 L -3,-7 L -1,-4 L 10,-4 L 10,8 L -10,8 Z" {...p} />
        </g>
      )}
      {type === 'link' && (
        <g>
          <rect x={-11} y={-4} width={12} height={8} rx={4} {...p} />
          <rect x={-1} y={-4} width={12} height={8} rx={4} {...p} />
        </g>
      )}
      {type === 'route' && (
        <g>
          <circle cx={-7} cy={7} r={2.5} {...p} />
          <circle cx={7} cy={-7} r={2.5} fill={color} stroke="none" />
          <path d="M -7,4.5 C -7,-6 7,6 7,-4.5" {...p} strokeDasharray="2 3" />
        </g>
      )}
      {type === 'broken' && (
        <g>
          <path d="M -8,4 L -1,-3" {...p} />
          <path d="M 1,3 L 8,-4" {...p} />
          <path d="M -3,0 L 3,0" {...p} strokeDasharray="1.5 2" />
        </g>
      )}
      {type === 'server' && (
        <g>
          <rect x={-10} y={-9} width={20} height={18} rx={2.5} {...p} />
          <line x1={-6} y1={-4} x2={5} y2={-4} {...p} />
          <line x1={-6} y1={1} x2={5} y2={1} {...p} />
          <circle cx={6} cy={-4} r={1} fill={color} stroke="none" />
          <circle cx={6} cy={1} r={1} fill={color} stroke="none" />
        </g>
      )}
      {type === 'check' && (
        <g>
          <circle cx={0} cy={0} r={10} {...p} />
          <path d="M -5,0 L -1,4 L 6,-4" {...p} />
        </g>
      )}
      {type === 'scissors' && (
        <g>
          <circle cx={-6} cy={-6} r={3} {...p} />
          <circle cx={-6} cy={6} r={3} {...p} />
          <line x1={-4} y1={-4} x2={9} y2={4} {...p} />
          <line x1={-4} y1={4} x2={9} y2={-4} {...p} />
        </g>
      )}
    </g>
  )
}

/** Bar kecil bergaya terminal untuk menampilkan teks command. */
export const CmdBar = ({ x, y, text, opacity = 1, color = COLORS.TEXT }) => (
  <g transform={`translate(${x}, ${y})`} opacity={opacity}>
    <rect x={-190} y={-16} width={380} height={32} rx={8} fill={COLORS.PANEL} stroke={COLORS.BORDER} strokeWidth={1.3} />
    <text x={0} y={5} textAnchor="middle" fontSize={13} fontFamily="monospace" fill={color}>{text}</text>
  </g>
)

/** Panah/garis penunjuk antara dua titik absolut, dengan label opsional. */
export const PointerArrow = ({ from, to, progress = 1, color = COLORS.MUTED, dashed = false, opacity = 1, label }) => {
  if (progress <= 0) return null
  const mx = from.x + (to.x - from.x) * 0.5
  const my = from.y + (to.y - from.y) * 0.5 - 10
  return (
    <g opacity={opacity}>
      <line x1={from.x} y1={from.y} x2={to.x} y2={to.y}
        stroke={color} strokeWidth={2.4} pathLength={100}
        strokeDasharray={dashed ? '7 6' : 100} strokeDashoffset={dashed ? 0 : 100 * (1 - progress)} />
      {label && progress > 0.5 && (
        <text x={mx} y={my} textAnchor="middle" fontSize={10.5} fontFamily="monospace" fill={color}
          stroke={COLORS.BG} strokeWidth={3.5} paintOrder="stroke">{label}</text>
      )}
    </g>
  )
}

export const Stamp = ({ x, y, color, top, sub, icon, rot = -7, opacity = 1 }) => (
  <g transform={`translate(${x}, ${y}) rotate(${rot})`} opacity={opacity}>
    <circle r={50} fill={color} opacity={0.16} />
    <rect x={-88} y={-32} width={176} height={64} rx={10} fill={COLORS.BG} stroke={color} strokeWidth={3} />
    {icon && (
      <g transform="translate(0, -32)">
        <circle r={16} fill={COLORS.BG} stroke={color} strokeWidth={2.5} />
        <Icon type={icon} size={19} color={color} strokeWidth={2} />
      </g>
    )}
    <text x={0} y={2} textAnchor="middle" fontSize={13} fontWeight={900} fontFamily="monospace" fill={color}>{top}</text>
    {sub && wrapText(sub, 24).map((ln, i) => (
      <text key={i} x={0} y={20 + i * 13} textAnchor="middle" fontSize={9.5} fontFamily="sans-serif" fill={COLORS.MUTED}>{ln}</text>
    ))}
  </g>
)

/**
 * Chrome persisten Act 1-3: diskBlock Inode + counter link. Posisi/
 * opacity datang dari state.pop['diskBlock'] (di-drive tiap Act file),
 * counter dari state.linkCount.
 */
export function InodeChrome({ state }) {
  const pop = state?.pop || {}
  const linkCount = state?.linkCount ?? 1
  return (
    <g transform={tos(pop, 'diskBlock', INODE_PT.x, INODE_PT.y)} opacity={oop(pop, 'diskBlock')}>
      <rect x={-110} y={-58} width={220} height={116} rx={16}
        fill={COLORS.PANEL} stroke={COLORS.INODE} strokeWidth={2.4} filter="url(#shadow)" />
      <g transform="translate(0, -26)" filter="url(#glow)"><Icon type="disk" size={36} color={COLORS.INODE} /></g>
      <text x={0} y={16} textAnchor="middle" fontSize={13} fontWeight={800} fontFamily="monospace" letterSpacing={0.5} fill={COLORS.INODE}>{INODE_LABEL}</text>
      <text x={0} y={34} textAnchor="middle" fontSize={9.5} fontFamily="monospace" fill={COLORS.MUTED}>blok data fisik di harddisk</text>
      <g transform="translate(84, -46)">
        <circle r={17} fill={COLORS.BG} stroke={COLORS.HARDLINK} strokeWidth={2} />
        <text x={0} y={5} textAnchor="middle" fontSize={13} fontWeight={900} fontFamily="monospace" fill={COLORS.HARDLINK}>{linkCount}</text>
      </g>
      <text x={84} y={-64} textAnchor="middle" fontSize={8} fontWeight={700} fontFamily="monospace" fill={COLORS.MUTED}>LINKS</text>
    </g>
  )
}

/**
 * Chrome persisten Act 4: nginx node. Posisi/opacity dari
 * state.pop['nginx'] (Act4 men-drive tetap terlihat sepanjang act).
 */
export function DeployChrome({ state }) {
  const pop = state?.pop || {}
  return (
    <g transform={tos(pop, 'nginx', NGINX_PT.x, NGINX_PT.y)} opacity={oop(pop, 'nginx')}>
      <rect x={-100} y={-52} width={200} height={104} rx={16}
        fill={COLORS.PANEL} stroke={COLORS.DEPLOY} strokeWidth={2.4} filter="url(#shadow)" />
      <g transform="translate(0, -20)" filter="url(#glow)"><Icon type="server" size={32} color={COLORS.DEPLOY} /></g>
      <text x={0} y={16} textAnchor="middle" fontSize={13} fontWeight={800} fontFamily="monospace" letterSpacing={1} fill={COLORS.DEPLOY}>NGINX</text>
      <text x={0} y={32} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={COLORS.MUTED}>root: /var/www/current</text>
    </g>
  )
}

/** Kartu file generik (dipakai originalFile/hardlinkFile/current di tiap Act). */
export const FileCard = ({ x, y, opacity, scale = 1, label, sub, color, crossed = false, icon = 'document' }) => (
  <g transform={`translate(${x}, ${y}) scale(${scale})`} opacity={opacity}>
    <rect x={-90} y={-42} width={180} height={84} rx={12}
      fill={COLORS.PANEL} stroke={crossed ? COLORS.BORDER : color} strokeWidth={2.2}
      opacity={crossed ? 0.45 : 1} filter="url(#shadow)" />
    <g transform="translate(0, -14)"><Icon type={icon} size={26} color={crossed ? COLORS.MUTED : color} /></g>
    <text x={0} y={14} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily="monospace"
      fill={crossed ? COLORS.MUTED : COLORS.TEXT} textDecoration={crossed ? 'line-through' : 'none'}>{label}</text>
    {sub && <text x={0} y={30} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={COLORS.MUTED}>{sub}</text>}
    {crossed && (
      <g transform="translate(66, -34)">
        <circle r={14} fill={COLORS.BG} stroke={COLORS.BROKEN} strokeWidth={2} />
        <Icon type="scissors" size={16} color={COLORS.BROKEN} />
      </g>
    )}
  </g>
)
