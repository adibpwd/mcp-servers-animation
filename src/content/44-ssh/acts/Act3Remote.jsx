// src/content/44-ssh/acts/Act3Remote.jsx
// ACT 3 — Satu Kanal, Banyak Mode (kasus "Inspect lalu Kirim Artefak").
// Elemen: shell prompt/cmd capsule, output capsule + card, task/status
// capsule, file tile/capsule/tray. Stage live: ch-*. Mode summary (tanpa
// props, dipakai intro bg): momen akhir file transfer (file tile → capsule
// → tray).
// Pola "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md.

import { tos, oop, ActChrome, withOrigin } from './common'
import {
  COLORS, NEAR_CLIENT, NEAR_SERVER, SHELL_OUTPUT_CARD_PT,
  ACT3_CASE,
} from '../data'

export const SUMMARY_STAGE = 'ch-file'
export const SUMMARY_POSITIONS = {
  client: { x: 0, y: 0, scale: 1, opacity: 1 },
  server: { x: 0, y: 0, scale: 1, opacity: 1 },
  hostLabel: { x: 0, y: 0, scale: 1, opacity: 1 },
  shellPromptOut: { x: NEAR_CLIENT.x, y: NEAR_CLIENT.y, scale: 1, opacity: 1 },
  shellOutputCard: { x: SHELL_OUTPUT_CARD_PT.x, y: SHELL_OUTPUT_CARD_PT.y, scale: 1, opacity: 1 },
  fileTile: { x: NEAR_CLIENT.x, y: NEAR_CLIENT.y, scale: 1, opacity: 1 },
  fileCapsule: { x: NEAR_SERVER.x, y: NEAR_SERVER.y, scale: 1, opacity: 1 },
  fileTray: { x: NEAR_SERVER.x, y: NEAR_SERVER.y, scale: 1, opacity: 1 },
}

export default function Act3Remote({ state, origin }) {
  const pop = state?.pop || SUMMARY_POSITIONS
  const stage = state?.stage || SUMMARY_STAGE

  return withOrigin(
    <>
      <ActChrome state={state} />

      {stage === 'ch-shell-out' && (
        <>
          <g transform={tos(pop, 'shellPromptOut', 0, 0)} opacity={oop(pop, 'shellPromptOut')}>
            <rect x={-150} y={-30} width={300} height={60} rx={10} fill={COLORS.BG} stroke={COLORS.SERVER} strokeWidth={1.5} />
            <text x={0} y={6} textAnchor="middle" fontSize={12} fontFamily="monospace" fill={COLORS.TUNNEL}>{ACT3_CASE.shell.prompt}</text>
          </g>
          <g transform={tos(pop, 'cmdCapsule', 0, 0)} opacity={oop(pop, 'cmdCapsule')}>
            <rect x={-46} y={-16} width={92} height={32} rx={16} fill={COLORS.CLIENT} />
            <text x={0} y={5} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="monospace" fill={COLORS.BG}>{ACT3_CASE.shell.command}</text>
          </g>
        </>
      )}

      {stage === 'ch-shell-in' && (
        <>
          <g transform={tos(pop, 'outputCapsule', 0, 0)} opacity={oop(pop, 'outputCapsule')}>
            <rect x={-50} y={-16} width={100} height={32} rx={16} fill={COLORS.SERVER} />
            <text x={0} y={5} textAnchor="middle" fontSize={9.5} fontWeight={700} fontFamily="monospace" fill={COLORS.BG}>{ACT3_CASE.shell.outputBadge}</text>
          </g>
          <g transform={tos(pop, 'shellOutputCard', 0, 0)} opacity={oop(pop, 'shellOutputCard')}>
            <rect x={-150} y={-26} width={300} height={52} rx={10} fill={COLORS.PANEL} stroke={COLORS.SERVER} strokeWidth={1.5} />
            <text x={0} y={5} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={COLORS.TEXT}>{ACT3_CASE.shell.output}</text>
          </g>
        </>
      )}

      {stage === 'ch-task-out' && (
        <g transform={tos(pop, 'taskCapsule', 0, 0)} opacity={oop(pop, 'taskCapsule')}>
          <rect x={-56} y={-16} width={112} height={32} rx={16} fill={COLORS.AUTH} />
          <text x={0} y={5} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="monospace" fill={COLORS.BG}>{ACT3_CASE.task.command}</text>
        </g>
      )}

      {stage === 'ch-task-in' && (
        <g transform={tos(pop, 'statusCapsule', 0, 0)} opacity={oop(pop, 'statusCapsule')}>
          <rect x={-50} y={-16} width={100} height={32} rx={16} fill={COLORS.TUNNEL} />
          <text x={0} y={5} textAnchor="middle" fontSize={9.5} fontWeight={700} fontFamily="monospace" fill={COLORS.BG}>{ACT3_CASE.task.statusToken}</text>
        </g>
      )}

      {stage === 'ch-file' && (
        <>
          <g transform={tos(pop, 'fileTile', 0, 0)} opacity={oop(pop, 'fileTile')}>
            <rect x={-70} y={-24} width={140} height={48} rx={8} fill={COLORS.PANEL} stroke={COLORS.TEXT} strokeWidth={1.5} />
            <text x={0} y={5} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={COLORS.TEXT}>{ACT3_CASE.file.fileName}</text>
          </g>
          <g transform={tos(pop, 'fileCapsule', 0, 0)} opacity={oop(pop, 'fileCapsule')}>
            <rect x={-70} y={-20} width={140} height={40} rx={20} fill={COLORS.AUTHZ} />
            <text x={0} y={5} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="monospace" fill={COLORS.BG}>{ACT3_CASE.file.fileName}</text>
          </g>
          <g transform={tos(pop, 'fileTray', 0, 0)} opacity={oop(pop, 'fileTray')}>
            <rect x={-160} y={-30} width={320} height={60} rx={10} fill={COLORS.PANEL} stroke={COLORS.OPS} strokeWidth={2} />
            <text x={0} y={-6} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="sans-serif" fill={COLORS.OPS}>FILE TRAY</text>
            <text x={0} y={14} textAnchor="middle" fontSize={9} fontFamily="sans-serif" fill={COLORS.MUTED}>
              contoh transfer: {ACT3_CASE.file.mechanisms.join(' · ')}
            </text>
          </g>
        </>
      )}
    </>,
    origin,
  )
}