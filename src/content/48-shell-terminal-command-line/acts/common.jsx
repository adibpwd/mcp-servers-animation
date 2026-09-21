// src/content/48-shell-terminal-command-line/acts/common.jsx
// EKSEKUSI-04 (revisi-03): pola "1 act = 1 file" — lihat
// docs/standardizations/07-act-scene-pattern.md. common.jsx menampung
// layout, helper posisi, dan ArchChrome (elemen persisten lintas-Act:
// caption bubble, terminal, PTY, shell hub, fork builtin/exec, system
// node, command/output packet, flow-dot) supaya setiap ActN.jsx cukup
// merender ArchChrome + konten khusus act-nya sendiri.

import React from 'react'
import { COLORS, PHASES, ARCH_LABELS, ACT3_CASE } from '../data'
import { getIcon } from '../icons/loader'

// ── Layout lokal (local coordinate ContentBodyV1, body 732×965) ──
export const BODY_CX = 366
export const NARRATION_Y = 40
export const TERMINAL_TOP = 135
export const TERMINAL_H = 220
export const TERMINAL_Y = TERMINAL_TOP + TERMINAL_H / 2
export const TERMINAL_W = 620
export const PTY_Y = 397
export const SHELL_HUB_Y = 475
export const FORK_Y = 562
export const SYSTEM_Y = 640
export const STAGE_TOP = 700
export const SOURCE_X = 100
export const TARGET_X = 620
export const PROCESS_Y = STAGE_TOP + 50
export const ROW2_Y = STAGE_TOP + 100

// ── Helper posisi (pola sama dengan 44-ssh/acts/common.jsx) ──
export const pos = (pop, id) => (pop && pop[id]) || { scale: 0, opacity: 0, x: 0, y: 0 }
export const tos = (pop, id, cx, cy) => {
  const p = pos(pop, id)
  return `translate(${cx + p.x}, ${cy + p.y}) scale(${p.scale})`
}
export const oop = (pop, id) => pos(pop, id).opacity
export const glow = (highlightId, id) => highlightId === id

export const withOrigin = (children, origin) =>
  origin ? <g transform={origin}>{children}</g> : children

// ── Icon inline SVG (revisi-04) — primitif kecil, tanpa aset eksternal
// kecuali IconBashLogo yang memakai PNG resmi (icons/gnu-bash-mark.png,
// sudah diunduh di EKSEKUSI-04/revisi-02, sumber Simple Icons CC0). ──
export function IconLightning({ x = 0, y = 0, size = 15, color }) {
  return (
    <g transform={`translate(${x - size / 2}, ${y - size / 2})`}>
      <path
        d={`M${size * 0.58} 0 L${size * 0.12} ${size * 0.56} L${size * 0.46} ${size * 0.56} L${size * 0.34} ${size} L${size * 0.88} ${size * 0.4} L${size * 0.5} ${size * 0.4} Z`}
        fill={color}
      />
    </g>
  )
}

export function IconBinary({ x = 0, y = 0, size = 16, color }) {
  return (
    <g transform={`translate(${x - size / 2}, ${y - size / 2})`}>
      <rect x={0} y={0} width={size} height={size} rx={3} fill="none" stroke={color} strokeWidth={1.4} />
      <text x={size / 2} y={size / 2 + 3} textAnchor="middle" fontSize={size * 0.42} fontFamily="monospace" fontWeight={800} fill={color}>
        01
      </text>
    </g>
  )
}

export function IconPromptGlyph({ x = 0, y = 0, size = 13, color }) {
  return (
    <text x={x} y={y} fontFamily="monospace" fontWeight={800} fontSize={size} fill={color}>{'>_'}</text>
  )
}

export function IconShieldLock({ x = 0, y = 0, size = 18, color }) {
  return (
    <g transform={`translate(${x - size / 2}, ${y - size / 2})`}>
      <path
        d={`M${size / 2} 0 L${size} ${size * 0.22} L${size} ${size * 0.55} Q${size} ${size * 0.9} ${size / 2} ${size} Q0 ${size * 0.9} 0 ${size * 0.55} L0 ${size * 0.22} Z`}
        fill="none" stroke={color} strokeWidth={1.6} />
      <circle cx={size / 2} cy={size * 0.46} r={size * 0.11} fill={color} />
      <rect x={size * 0.44} y={size * 0.46} width={size * 0.12} height={size * 0.24} fill={color} />
    </g>
  )
}

export function IconPipeArrow({ x = 0, y = 0, size = 12, color, angleDeg = 0, dashed = false }) {
  return (
    <g transform={`translate(${x}, ${y}) rotate(${angleDeg})`}>
      <path
        d={`M${-size / 2} 0 L${size / 2} 0 M${size / 2 - size * 0.35} ${-size * 0.3} L${size / 2} 0 L${size / 2 - size * 0.35} ${size * 0.3}`}
        fill="none" stroke={color} strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray={dashed ? '3 3' : undefined} />
    </g>
  )
}

export function IconBashMark({ x = 0, y = 0, size = 14 }) {
  return (
    <image href={getIcon('gnu-bash-mark')} x={x - size / 2} y={y - size / 2} width={size} height={size}
      style={{ filter: 'invert(1)' }} opacity={0.9} />
  )
}

// ── Default state dipakai saat ActN.jsx dirender standalone (mode summary,
// tanpa prop `state` dari Animation.jsx live) — dipakai IntroHeaderMorphV1
// bg/bgScenes untuk thumbnail per-Act. Tiap ActN.jsx meng-override sebagian.
export const SUMMARY_POP_FULL = { scale: 1, opacity: 1, x: 0, y: 0 }
export const SUMMARY_CHROME_POP = {
  terminalWin: SUMMARY_POP_FULL,
  ptyCable: SUMMARY_POP_FULL,
  shellHub: SUMMARY_POP_FULL,
}

export function ArchChrome({ state }) {
  const s = state || {}
  const pop = s.pop || {}
  const caption = s.caption || ''
  const phaseIdx = s.phaseIdx || 0
  const highlightId = s.highlightId ?? null
  const archDim = Boolean(s.archDim)
  const forkChoice = s.forkChoice ?? null
  const shellActive = Boolean(s.shellActive)
  const systemActive = Boolean(s.systemActive)
  const cmdLineText = s.cmdLineText ?? '$ '
  const outputText = s.outputText ?? ''
  const outputTypedLen = s.outputTypedLen ?? 0
  const statusToken = s.statusToken ?? null
  const packet = s.packet || { x: BODY_CX, y: TERMINAL_Y, label: '', visible: false, variant: 'command' }
  const flow = s.flow || { x: 0, y: 0, visible: false, color: COLORS.STDOUT }
  const act3 = s.act3 || { step: 'idle', matched: {}, homeExpanded: false }

  return (
    <>
      {caption && (
        <g transform={`translate(${BODY_CX}, ${NARRATION_Y})`}>
          <rect x={-320} y={-28} width={640} height={56} rx={20} fill={COLORS.PANEL}
            stroke={PHASES[phaseIdx]?.badgeColor || COLORS.TERMINAL} strokeWidth={1.5} />
          <text x={0} y={6} textAnchor="middle" fontSize={13.5} fontWeight={700} fontFamily="sans-serif" fill={COLORS.TEXT}>
            {caption}
          </text>
        </g>
      )}

      <g opacity={archDim ? 0.4 : 1}>
        <g transform={tos(pop, 'terminalWin', BODY_CX, TERMINAL_Y)} opacity={oop(pop, 'terminalWin')}>
          <rect x={-TERMINAL_W / 2} y={-TERMINAL_H / 2} width={TERMINAL_W} height={TERMINAL_H} rx={14}
            fill={COLORS.PANEL_ALT}
            stroke={glow(highlightId, 'terminal') ? COLORS.SUCCESS : COLORS.TERMINAL}
            strokeWidth={glow(highlightId, 'terminal') ? 3 : 2}
            filter="url(#shell-shadow)" />
          <circle cx={-TERMINAL_W / 2 + 24} cy={-TERMINAL_H / 2 + 20} r={6} fill={COLORS.STDERR} />
          <circle cx={-TERMINAL_W / 2 + 44} cy={-TERMINAL_H / 2 + 20} r={6} fill={COLORS.SHELL} />
          <circle cx={-TERMINAL_W / 2 + 64} cy={-TERMINAL_H / 2 + 20} r={6} fill={COLORS.SUCCESS} />
          <text x={0} y={-TERMINAL_H / 2 + 24} textAnchor="middle" fontSize={11} fontFamily="monospace"
            fill={COLORS.MUTED} letterSpacing={2}>{ARCH_LABELS.terminal.toUpperCase()}</text>
          <IconPromptGlyph x={TERMINAL_W / 2 - 50} y={-TERMINAL_H / 2 + 25} size={13} color={COLORS.MUTED} />

          <text x={-TERMINAL_W / 2 + 24} y={TERMINAL_H / 2 - 46}
            fontFamily="monospace" fontSize={16} fontWeight={700}
            fill={glow(highlightId, 'cmdline') ? COLORS.SUCCESS : COLORS.TERMINAL}>
            {cmdLineText}
          </text>
          <rect x={-TERMINAL_W / 2 + 24 + cmdLineText.length * 9.6} y={TERMINAL_H / 2 - 58} width={9} height={16}
            fill={COLORS.TERMINAL} style={{ animation: 'cursorBlink 1s step-end infinite' }} />
          <text x={-TERMINAL_W / 2 + 24} y={TERMINAL_H / 2 - 20}
            fontFamily="monospace" fontSize={14} fill={COLORS.SUCCESS}>
            {outputText.slice(0, outputTypedLen)}
          </text>
          {statusToken && (
            <text x={TERMINAL_W / 2 - 20} y={TERMINAL_H / 2 - 20} textAnchor="end"
              fontFamily="monospace" fontSize={12} fontWeight={700}
              fill={statusToken === '0' ? COLORS.SUCCESS : COLORS.RISK}>
              exit {statusToken}
            </text>
          )}
          <text x={TERMINAL_W / 2 - 20} y={TERMINAL_H / 2 - 46} textAnchor="end"
            fontFamily="sans-serif" fontSize={9.5} fontWeight={700} fill={COLORS.MUTED} letterSpacing={1}>
            {ARCH_LABELS.commandLine.toUpperCase()}
          </text>
        </g>

        <g transform={tos(pop, 'ptyCable', BODY_CX, PTY_Y)} opacity={oop(pop, 'ptyCable')}>
          <line x1={0} y1={-38} x2={0} y2={38} stroke={COLORS.PTY} strokeWidth={3} strokeDasharray="2 6" />
          <text x={18} y={5} fontSize={12} fontFamily="monospace" fontWeight={700} fill={COLORS.PTY}>{ARCH_LABELS.pty}</text>
        </g>

        <g transform={tos(pop, 'shellHub', BODY_CX, SHELL_HUB_Y)} opacity={oop(pop, 'shellHub')}>
          <circle r={52} fill={COLORS.PANEL}
            stroke={glow(highlightId, 'shell') ? COLORS.SUCCESS : COLORS.SHELL} strokeWidth={glow(highlightId, 'shell') ? 3.5 : 2.5}
            filter={shellActive ? 'url(#shell-glow)' : undefined} />
          {shellActive && (
            <circle r={40} fill="none" stroke={COLORS.SHELL} strokeWidth={2} strokeDasharray="10 8"
              style={{ animation: 'shellSpin 1.4s linear infinite', transformOrigin: 'center' }} />
          )}
          {act3.step === 'split' || act3.step === 'expand' || act3.step === 'resolve' ? (
            <>
              <text x={0} y={-8} textAnchor="middle" fontSize={10} fontWeight={800} fontFamily="monospace" fill={COLORS.BUILTIN}>
                echo
              </text>
              <rect x={-42} y={-2} width={84} height={15} rx={6} fill="none"
                stroke={COLORS.PTY} strokeWidth={1.2} strokeDasharray="3 3"
                opacity={act3.step === 'split' ? 1 : 0} />
              <text x={0} y={9} textAnchor="middle" fontSize={8} fontFamily="monospace" fill={COLORS.PTY}>
                {act3.homeExpanded ? ACT3_CASE.homeValue : ACT3_CASE.homeVar}/notes/*.txt
              </text>
            </>
          ) : (
            <>
              <IconBashMark x={0} y={-16} size={16} />
              <text x={0} y={4} textAnchor="middle" fontSize={12} fontWeight={800} fontFamily="sans-serif" fill={COLORS.SHELL}>
                {ARCH_LABELS.shell.toUpperCase()}
              </text>
            </>
          )}
          <text x={0} y={22} textAnchor="middle" fontSize={9} fontFamily="sans-serif" fill={COLORS.MUTED}>decoder</text>
        </g>

        <g transform={tos(pop, 'forkBuiltin', BODY_CX - 130, FORK_Y)} opacity={oop(pop, 'forkBuiltin')}>
          <rect x={-90} y={-29} width={180} height={58} rx={10} fill={COLORS.PANEL}
            stroke={COLORS.BUILTIN} strokeWidth={1.5} opacity={forkChoice === 'builtin' ? 1 : 0.4} />
          <IconLightning x={70} y={-15} size={15} color={COLORS.BUILTIN} />
          <text x={0} y={-2} textAnchor="middle" fontSize={11.5} fontWeight={700} fontFamily="sans-serif" fill={COLORS.BUILTIN}>
            {ARCH_LABELS.builtin}
          </text>
          <text x={0} y={15} textAnchor="middle" fontSize={8.5} fontFamily="sans-serif" fill={COLORS.MUTED}>
            {ARCH_LABELS.builtinDetail}
          </text>
        </g>
        <g transform={tos(pop, 'forkExec', BODY_CX + 130, FORK_Y)} opacity={oop(pop, 'forkExec')}>
          <rect x={-90} y={-29} width={180} height={58} rx={10}
            fill={forkChoice === 'exec' ? COLORS.EXEC : COLORS.PANEL}
            stroke={COLORS.EXEC} strokeWidth={forkChoice === 'exec' ? 0 : 1.5}
            opacity={forkChoice === 'exec' ? 1 : 0.55} />
          <IconBinary x={70} y={-15} size={16} color={forkChoice === 'exec' ? COLORS.BG : COLORS.EXEC} />
          <text x={0} y={-2} textAnchor="middle" fontSize={11.5} fontWeight={700} fontFamily="sans-serif"
            fill={forkChoice === 'exec' ? COLORS.BG : COLORS.EXEC}>
            {ARCH_LABELS.exec}
          </text>
          <text x={0} y={15} textAnchor="middle" fontSize={8.5} fontFamily="sans-serif"
            fill={forkChoice === 'exec' ? COLORS.BG : COLORS.MUTED}>
            {ARCH_LABELS.execDetail}
          </text>
        </g>

        <g transform={tos(pop, 'systemNode', BODY_CX, SYSTEM_Y)} opacity={oop(pop, 'systemNode')}>
          <rect x={-140} y={-30} width={280} height={60} rx={12} fill={COLORS.PANEL}
            stroke={COLORS.SYSTEM} strokeWidth={systemActive ? 3 : 1.8}
            filter={systemActive ? 'url(#shell-glow)' : undefined} />
          <text x={0} y={-4} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily="sans-serif" fill={COLORS.SYSTEM}>
            {ARCH_LABELS.system.toUpperCase()}
          </text>
          <text x={0} y={14} textAnchor="middle" fontSize={8.5} fontFamily="sans-serif" fill={COLORS.MUTED}>
            {ARCH_LABELS.systemDetail}
          </text>
        </g>
      </g>

      {packet.visible && (
        <g transform={`translate(${packet.x}, ${packet.y})`}>
          <rect x={-95} y={-18} width={190} height={36} rx={10}
            fill={COLORS.BG}
            stroke={packet.variant === 'output' ? COLORS.SUCCESS : COLORS.TERMINAL}
            strokeWidth={2} filter="url(#shell-shadow)" />
          <text x={0} y={5} textAnchor="middle" fontSize={11.5} fontWeight={700} fontFamily="monospace"
            fill={packet.variant === 'output' ? COLORS.SUCCESS : COLORS.TERMINAL}>
            {packet.label}
          </text>
        </g>
      )}

      {flow.visible && (
        <circle cx={flow.x} cy={flow.y} r={7} fill={flow.color} filter="url(#shell-shadow)" />
      )}
    </>
  )
}
