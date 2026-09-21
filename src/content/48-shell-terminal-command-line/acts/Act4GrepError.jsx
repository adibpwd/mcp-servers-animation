// src/content/48-shell-terminal-command-line/acts/Act4GrepError.jsx
// EKSEKUSI-04 (revisi-03): Act 4 — "Data Punya Jalur" (grep error atas
// app.log/missing.log). Konten unik: diagram source→process→target dengan
// tiga jalur stdin/stdout/stderr.
import React from 'react'
import { COLORS, ACT4_CASE } from '../data'
import { ArchChrome, withOrigin, oop, BODY_CX, STAGE_TOP, SOURCE_X, TARGET_X, PROCESS_Y, ROW2_Y } from './common'

const FULL = { scale: 1, opacity: 1, x: 0, y: 0 }

export const SUMMARY_STATE = {
  stage: 'act4',
  caption: 'Output dan error punya jalur sendiri',
  phaseIdx: 3,
  archDim: true,
  act4: { step: 'stderr', stdinOn: true, stdoutOn: true, redirectOn: true, stderrOn: true },
  pop: { terminalWin: FULL, ptyCable: FULL, shellHub: FULL, act4Diagram: FULL },
}

function GrepDiagram({ pop, act4 }) {
  return (
    <g opacity={oop(pop, 'act4Diagram')}>
      <line x1={SOURCE_X} y1={STAGE_TOP} x2={BODY_CX - 70} y2={PROCESS_Y}
        stroke={COLORS.STDIN} strokeWidth={1.5} opacity={act4.stdinOn ? 0.8 : 0.3} />
      <line x1={SOURCE_X} y1={ROW2_Y} x2={BODY_CX - 70} y2={PROCESS_Y}
        stroke={COLORS.RISK} strokeWidth={1.5} opacity={act4.stderrOn ? 0.8 : 0.25} strokeDasharray="4 4" />
      <line x1={BODY_CX + 70} y1={PROCESS_Y} x2={TARGET_X} y2={STAGE_TOP}
        stroke={COLORS.STDOUT} strokeWidth={1.5} opacity={act4.stdoutOn && !act4.redirectOn ? 0.8 : 0.25} />
      <line x1={BODY_CX + 70} y1={PROCESS_Y} x2={TARGET_X} y2={ROW2_Y}
        stroke={COLORS.STDOUT} strokeWidth={1.5} opacity={act4.redirectOn ? 0.8 : 0.25} />
      <line x1={BODY_CX + 70} y1={PROCESS_Y} x2={TARGET_X} y2={STAGE_TOP}
        stroke={COLORS.STDERR} strokeWidth={1.5} opacity={act4.stderrOn ? 0.8 : 0} strokeDasharray="4 4" />

      <g transform={`translate(${SOURCE_X}, ${STAGE_TOP})`}>
        <rect x={-70} y={-24} width={140} height={48} rx={10} fill={COLORS.PANEL} stroke={COLORS.BORDER} strokeWidth={1.5} />
        <text x={0} y={5} textAnchor="middle" fontSize={11} fontFamily="monospace" fontWeight={700} fill={COLORS.TEXT}>
          {ACT4_CASE.sources[0].name}
        </text>
      </g>
      <g transform={`translate(${SOURCE_X}, ${ROW2_Y})`}>
        <rect x={-70} y={-24} width={140} height={48} rx={10} fill={COLORS.PANEL}
          stroke={act4.stderrOn ? COLORS.RISK : COLORS.BORDER} strokeWidth={1.5} />
        <text x={0} y={5} textAnchor="middle" fontSize={11} fontFamily="monospace" fontWeight={700}
          fill={act4.stderrOn ? COLORS.RISK : COLORS.TEXT}>
          {ACT4_CASE.sources[1].name}
        </text>
      </g>

      <g transform={`translate(${BODY_CX}, ${PROCESS_Y})`}>
        <rect x={-90} y={-26} width={180} height={52} rx={12} fill={COLORS.PANEL} stroke={COLORS.SHELL} strokeWidth={2} />
        <text x={0} y={-2} textAnchor="middle" fontSize={11.5} fontWeight={800} fontFamily="monospace" fill={COLORS.SHELL}>
          {ACT4_CASE.command}
        </text>
        <text x={0} y={14} textAnchor="middle" fontSize={8} fontFamily="sans-serif" fill={COLORS.MUTED}>
          stdin · stdout · stderr
        </text>
      </g>

      <g transform={`translate(${TARGET_X}, ${STAGE_TOP})`}>
        <rect x={-70} y={-24} width={140} height={48} rx={10} fill={COLORS.PANEL}
          stroke={act4.stderrOn ? COLORS.RISK : COLORS.TERMINAL} strokeWidth={1.5} />
        <text x={0} y={-2} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="sans-serif" fill={COLORS.TEXT}>
          TERMINAL
        </text>
        <text x={0} y={14} textAnchor="middle" fontSize={8.5} fontFamily="monospace"
          fill={act4.stderrOn ? COLORS.RISK : COLORS.MUTED}>
          {act4.stderrOn ? ACT4_CASE.errorLine : act4.stdoutOn && !act4.redirectOn ? ACT4_CASE.matchLines[0] : ''}
        </text>
      </g>
      <g transform={`translate(${TARGET_X}, ${ROW2_Y})`}>
        <rect x={-70} y={-24} width={140} height={48} rx={10} fill={act4.redirectOn ? COLORS.STDOUT : COLORS.PANEL}
          stroke={COLORS.STDOUT} strokeWidth={act4.redirectOn ? 0 : 1.5} opacity={act4.redirectOn ? 1 : 0.55} />
        <text x={0} y={5} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="monospace"
          fill={act4.redirectOn ? COLORS.BG : COLORS.STDOUT}>
          {ACT4_CASE.redirectTarget}
        </text>
      </g>
    </g>
  )
}

export default function Act4GrepError({ state, origin }) {
  const s = state || SUMMARY_STATE
  const act4 = s.act4 || { step: 'idle', stdinOn: false, stdoutOn: false, redirectOn: false, stderrOn: false }
  return withOrigin(
    <>
      <ArchChrome state={s} />
      {s.stage === 'act4' && <GrepDiagram pop={s.pop} act4={act4} />}
    </>,
    origin,
  )
}
