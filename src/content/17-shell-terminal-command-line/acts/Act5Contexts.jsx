// src/content/48-shell-terminal-command-line/acts/Act5Contexts.jsx
// EKSEKUSI-04 (revisi-03): Act 5 — "Satu Command, Tiga/Empat Konteks"
// (pwd dipakai ulang: interactive/login/non-interactive/remote). Konten
// unik: contextBadge yang berganti isi, node remoteHost, dan recap row.
import React from 'react'
import { COLORS, ACT5_CASE } from '../data'
import { ArchChrome, withOrigin, tos, oop, BODY_CX, SHELL_HUB_Y, STAGE_TOP } from './common'

const FULL = { scale: 1, opacity: 1, x: 0, y: 0 }

export const SUMMARY_STATE = {
  stage: 'act5',
  caption: 'Konteks menentukan cara shell berjalan',
  phaseIdx: 4,
  archDim: true,
  act5: { active: null, recap: true },
  pop: { terminalWin: FULL, ptyCable: FULL, shellHub: FULL, recapRow: FULL },
}

function RemoteHost({ pop }) {
  return (
    <g transform={tos(pop, 'remoteHost', BODY_CX + 220, SHELL_HUB_Y)} opacity={oop(pop, 'remoteHost')}>
      <line x1={-160} y1={0} x2={-8} y2={0} stroke={COLORS.MODE} strokeWidth={1.5} strokeDasharray="4 5" opacity={0.6} />
      <rect x={-58} y={-30} width={116} height={60} rx={10} fill={COLORS.PANEL} stroke={COLORS.MODE} strokeWidth={2} />
      <text x={0} y={-4} textAnchor="middle" fontSize={10} fontWeight={800} fontFamily="sans-serif" fill={COLORS.MODE}>SERVER</text>
      <text x={0} y={14} textAnchor="middle" fontSize={8.5} fontFamily="monospace" fill={COLORS.MUTED}>SSH</text>
    </g>
  )
}

function ContextBadge({ pop, activeId }) {
  const ctx = ACT5_CASE.contexts.find((c) => c.id === activeId)
  if (!ctx) return null
  return (
    <g transform={tos(pop, 'contextBadge', BODY_CX, STAGE_TOP + 20)}>
      <rect x={-160} y={-30} width={320} height={60} rx={14} fill={COLORS.PANEL}
        stroke={COLORS.MODE} strokeWidth={2} filter="url(#shell-shadow)" />
      <text x={0} y={-6} textAnchor="middle" fontSize={13} fontWeight={800} fontFamily="sans-serif" fill={COLORS.MODE}>
        {ctx.label}
      </text>
      <text x={0} y={14} textAnchor="middle" fontSize={10} fontFamily="monospace" fontWeight={700} fill={COLORS.TEXT}>
        {ctx.badge}
      </text>
    </g>
  )
}

function RecapRow({ pop }) {
  return (
    <g opacity={oop(pop, 'recapRow')}>
      {ACT5_CASE.contexts.map((c, i) => {
        const w = 160, gap = 20
        const x0 = (700 - (w * 4 + gap * 3)) / 2 + 16
        const x = x0 + i * (w + gap)
        return (
          <g key={c.id} transform={`translate(${x}, ${STAGE_TOP + 20})`}>
            <rect width={w} height={56} rx={10} fill={COLORS.PANEL} stroke={COLORS.MODE} strokeWidth={1.5} opacity={0.7} />
            <text x={w / 2} y={24} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="sans-serif" fill={COLORS.TEXT}>
              {c.label}
            </text>
            <text x={w / 2} y={40} textAnchor="middle" fontSize={8.5} fontFamily="monospace" fill={COLORS.MUTED}>
              {c.badge}
            </text>
          </g>
        )
      })}
    </g>
  )
}

export default function Act5Contexts({ state, origin }) {
  const s = state || SUMMARY_STATE
  const act5 = s.act5 || { active: null, recap: false }
  return withOrigin(
    <>
      <ArchChrome state={s} />
      {s.stage === 'act5' && <RemoteHost pop={s.pop} />}
      {s.stage === 'act5' && act5.active && <ContextBadge pop={s.pop} activeId={act5.active} />}
      {s.stage === 'act5' && act5.recap && <RecapRow pop={s.pop} />}
    </>,
    origin,
  )
}
