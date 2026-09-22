// src/content/48-shell-terminal-command-line/acts/Act3EchoHome.jsx
// EKSEKUSI-04 (revisi-03): Act 3 — "Shell Membaca Struktur"
// (echo "$HOME"/notes/*.txt). Konten unik: folder tiles todo.txt/idea.txt/
// image.png yang di-scan saat glob expand.
import React from 'react'
import { COLORS, ACT3_CASE } from '../data'
import { ArchChrome, withOrigin, oop, BODY_CX, STAGE_TOP } from './common'

const FULL = { scale: 1, opacity: 1, x: 0, y: 0 }

export const SUMMARY_STATE = {
  stage: 'act3',
  caption: 'Shell membaca struktur command',
  phaseIdx: 2,
  archDim: false,
  forkChoice: 'builtin',
  cmdLineText: `$ ${ACT3_CASE.command}`,
  act3: { step: 'expand', matched: { todo: true, idea: true, image: false }, homeExpanded: true },
  pop: {
    terminalWin: FULL, ptyCable: FULL, shellHub: FULL,
    forkBuiltin: FULL, forkExec: FULL, folderRow: FULL,
  },
  packet: { x: BODY_CX - 130, y: 562, label: 'echo (builtin)', visible: true, variant: 'command' },
}

function FolderTiles({ pop, act3 }) {
  return (
    <g opacity={oop(pop, 'folderRow')}>
      {ACT3_CASE.files.map((f, i) => {
        const w = 210, gap = 20
        const x0 = (700 - (w * 3 + gap * 2)) / 2 + 16
        const x = x0 + i * (w + gap)
        const matched = act3.matched[f.id]
        const isImage = f.id === 'image'
        return (
          <g key={f.id} transform={`translate(${x}, ${STAGE_TOP})`}>
            <rect width={w} height={72} rx={10}
              fill={matched ? COLORS.EXEC : COLORS.PANEL}
              stroke={matched ? COLORS.EXEC : COLORS.BORDER} strokeWidth={matched ? 0 : 1.5}
              opacity={isImage && act3.step === 'expand' ? 0.35 : 1} />
            <text x={w / 2} y={30} textAnchor="middle" fontSize={11} fontFamily="monospace" fontWeight={700}
              fill={matched ? COLORS.BG : COLORS.TEXT}>
              {f.name}
            </text>
            <text x={w / 2} y={50} textAnchor="middle" fontSize={9} fontFamily="sans-serif"
              fill={matched ? COLORS.BG : COLORS.MUTED}>
              {matched ? 'match *.txt' : isImage ? 'tidak cocok' : 'notes/'}
            </text>
          </g>
        )
      })}
    </g>
  )
}

export default function Act3EchoHome({ state, origin }) {
  const s = state || SUMMARY_STATE
  const act3 = s.act3 || { step: 'idle', matched: {}, homeExpanded: false }
  return withOrigin(
    <>
      <ArchChrome state={s} />
      {s.stage === 'act3' && <FolderTiles pop={s.pop} act3={act3} />}
    </>,
    origin,
  )
}
