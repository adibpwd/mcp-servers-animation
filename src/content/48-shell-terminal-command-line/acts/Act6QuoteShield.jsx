// src/content/48-shell-terminal-command-line/acts/Act6QuoteShield.jsx
// EKSEKUSI-04 (revisi-03): Act 6 — "Quote, Status, Cleanup" ("April
// Report.txt"). Konten unik: dataChip, ghostChips (split tanpa quote),
// checkNode, gateBox, cleanupTray, shellBadge (dengan icon Bash asli).
import React from 'react'
import { COLORS, ACT6_CASE } from '../data'
import { getIcon } from '../icons/loader'
import { ArchChrome, withOrigin, tos, oop, IconShieldLock } from './common'

const FULL = { scale: 1, opacity: 1, x: 0, y: 0 }

export const SUMMARY_STATE = {
  stage: 'act6',
  caption: 'Data di-quote; error menghentikan langkah',
  phaseIdx: 5,
  archDim: true,
  statusToken: '1',
  act6: { step: 'targetshell', targetShell: 'bash' },
  pop: {
    terminalWin: FULL, ptyCable: FULL, shellHub: FULL,
    dataChip: FULL, checkNode: FULL, gateBox: FULL, cleanupTray: FULL, shellBadge: FULL,
  },
}

function Act6Content({ pop, act6, statusToken }) {
  return (
    <g>
      <g transform={tos(pop, 'dataChip', 140, 700)} opacity={oop(pop, 'dataChip')}>
        <rect x={-90} y={-24} width={180} height={48} rx={10} fill={COLORS.PANEL} stroke={COLORS.SCRIPT} strokeWidth={1.5} />
        <IconShieldLock x={-70} y={0} size={17} color={COLORS.SCRIPT} />
        <text x={8} y={5} textAnchor="middle" fontSize={10.5} fontWeight={700} fontFamily="monospace" fill={COLORS.SCRIPT}>
          {ACT6_CASE.filename}
        </text>
      </g>

      <g transform={tos(pop, 'ghostChips', 140, 770)} opacity={oop(pop, 'ghostChips')}>
        {ACT6_CASE.ghostParts.map((part, i) => (
          <g key={part} transform={`translate(${i === 0 ? -55 : 55}, 0)`}>
            <rect x={-48} y={-18} width={96} height={36} rx={8} fill="none" stroke={COLORS.RISK} strokeWidth={1.5} strokeDasharray="3 3" />
            <text x={0} y={5} textAnchor="middle" fontSize={9.5} fontFamily="monospace" fill={COLORS.RISK}>{part}</text>
          </g>
        ))}
        <text x={0} y={34} textAnchor="middle" fontSize={9} fontFamily="sans-serif" fontWeight={700} fill={COLORS.RISK}>
          ✕ terbelah tanpa quote
        </text>
      </g>

      <g transform={tos(pop, 'checkNode', 400, 700)} opacity={oop(pop, 'checkNode')}>
        <rect x={-80} y={-24} width={160} height={48} rx={10} fill={COLORS.PANEL}
          stroke={statusToken === '1' ? COLORS.RISK : COLORS.BORDER} strokeWidth={1.8} />
        <text x={0} y={-3} textAnchor="middle" fontSize={10.5} fontWeight={700} fontFamily="sans-serif" fill={COLORS.TEXT}>
          CHECK
        </text>
        <text x={0} y={13} textAnchor="middle" fontSize={11} fontWeight={800} fontFamily="monospace"
          fill={statusToken === '1' ? COLORS.RISK : COLORS.MUTED}>
          {statusToken === '1' ? 'exit 1' : '…'}
        </text>
      </g>

      <g transform={tos(pop, 'gateBox', 580, 700)} opacity={oop(pop, 'gateBox')}>
        <rect x={-70} y={-24} width={140} height={48} rx={10} fill={COLORS.PANEL} stroke={COLORS.RISK} strokeWidth={1.8} />
        <text x={0} y={-3} textAnchor="middle" fontSize={11} fontWeight={800} fontFamily="sans-serif" fill={COLORS.RISK}>
          STOP
        </text>
        <text x={0} y={13} textAnchor="middle" fontSize={8.5} fontFamily="sans-serif" fill={COLORS.MUTED}>
          publish locked
        </text>
      </g>

      <g transform={tos(pop, 'cleanupTray', 140, 830)} opacity={oop(pop, 'cleanupTray')}>
        <rect x={-90} y={-22} width={180} height={44} rx={10} fill={COLORS.PANEL} stroke={COLORS.SCRIPT} strokeWidth={1.5} />
        <text x={0} y={5} textAnchor="middle" fontSize={10.5} fontWeight={700} fontFamily="sans-serif" fill={COLORS.SCRIPT}>
          cleanup ✓ tray kosong
        </text>
      </g>

      <g transform={tos(pop, 'shellBadge', 420, 830)} opacity={oop(pop, 'shellBadge')}>
        <rect x={-70} y={-22} width={140} height={44} rx={10} fill={COLORS.PANEL} stroke={COLORS.MODE} strokeWidth={1.5} />
        {act6.targetShell === 'bash' && (
          <image href={getIcon('gnu-bash-mark')} x={-56} y={-10} width={20} height={20} style={{ filter: 'invert(1)' }} />
        )}
        <text x={act6.targetShell === 'bash' ? 8 : 0} y={5} textAnchor="middle" fontSize={11} fontWeight={800} fontFamily="monospace" fill={COLORS.MODE}>
          {act6.targetShell}
        </text>
        <text x={130} y={5} textAnchor="middle" fontSize={9} fontFamily="monospace"
          fill={COLORS.MUTED} opacity={act6.targetShell === 'bash' ? 1 : 0.3}>
          {ACT6_CASE.syntaxFlag}
        </text>
      </g>
    </g>
  )
}

export default function Act6QuoteShield({ state, origin }) {
  const s = state || SUMMARY_STATE
  const act6 = s.act6 || { step: 'idle', targetShell: 'bash' }
  return withOrigin(
    <>
      <ArchChrome state={s} />
      {s.stage === 'act6' && <Act6Content pop={s.pop} act6={act6} statusToken={s.statusToken} />}
    </>,
    origin,
  )
}
