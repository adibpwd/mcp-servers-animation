// src/content/60-linux-processes/acts/common.jsx
// Helper bersama untuk file per-act (pola "1 act = 1 file", lihat
// docs/standardizations/07-act-scene-pattern.md).
//
// Kontrak: tiap file Act PURE presentational (tanpa GSAP/state/SFX), baca
// dari prop `state` (default aman untuk mode summary), koordinat body-local.
// Konten topic ini "kumulatif" (card/PID/resource tetap terlihat lintas
// Act, bukan diagram terpisah per Act seperti 44-ssh) — jadi elemen yang
// SELALU tampil (caption + file/process card) dikumpulkan di `SceneChrome`
// dan dipanggil dari SETIAP file Act, mirip pola `ActChrome` di 44-ssh.

import React from 'react'
import { COLORS, PROCESSES, PROGRAM_LABEL } from '../data'
import { IconBrowser, IconEditor, IconMusic, IconCursorClick, IconGaugeWarning } from '../icons/inlineSvg'

// revisi-03: icon accent sekarang inline SVG (bukan getIcon()/PNG placeholder
// — lihat revisi/2026-09-21-revisi-03-*.md). Warna icon ikut warna process.
const INLINE_ICON_MAP = { 'icon-browser': IconBrowser, 'icon-editor': IconEditor, 'icon-music': IconMusic }

// ── Layout body-local (dipindah dari Animation.jsx, TIDAK diubah angkanya —
// lihat _docs/LINUX_PROCESSES_PLAN.md §Layout map V1 +
// revisi/2026-09-19-revisi-01-*.md §2.3/§3.3/§3.4). ──
export const PROGRAM_LANE_X = 170
export const PROGRAM_LANE_Y = 210
export const ARENA_Y = 460
export const METER_Y = 697
export const TERMINAL_X = 366
export const TERMINAL_Y = 880
export const CLONE_X = 150
export const CLONE_Y = 365
export const LAUNCH_CURSOR_X = 170
export const LAUNCH_CURSOR_Y = 145
export const PID_REUSE_X = 270
export const PID_REUSE_Y = 400
export const WARNING_ICON_X = 650
export const WARNING_ICON_Y = 660

/** Ambil pose (posisi/opacity/scale) elemen dari pop state — default sembunyi. */
export const pose = (pop, id) => (pop && pop[id]) || { opacity: 0, scale: 0, x: 0, y: 0 }

/** transform translate(cx+dx, cy+dy) scale(s) — pola P()/transform() di Animation.jsx lama. */
export const tos = (pop, id, cx, cy) => {
  const p = pose(pop, id)
  return `translate(${cx + p.x} ${cy + p.y}) scale(${p.scale})`
}

/** opacity elemen saja. */
export const oop = (pop, id) => pose(pop, id).opacity

/** Bungkus scene act dengan origin translate (default {0,0}) — dipakai
 * intro background (bgOrigin = layout.body) atau render custom lain. Live
 * di dalam ContentBodyV1 tidak perlu ini (origin sudah diterapkan body). */
export function withOrigin(children, origin) {
  if (!origin || (origin.x === 0 && origin.y === 0)) return children
  return <g transform={`translate(${origin.x}, ${origin.y})`}>{children}</g>
}

export function LocalCaptionBadge({ x, y, text, opacity, scale, color }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
      <rect x="-150" y="-24" width="300" height="48" rx="16" fill={COLORS.PANEL} stroke={color} strokeWidth="1.5" />
      <path d="M-14 24 l14 16 l14 -16 z" fill={COLORS.PANEL} stroke={color} strokeWidth="1.5" />
      <text x="0" y="5" textAnchor="middle" fontSize="13" fontWeight="700" fill={COLORS.TEXT}>{text}</text>
    </g>
  )
}

export function ProgramFileCard({ x, y, opacity, label }) {
  return (
    <g transform={`translate(${x} ${y})`} opacity={opacity}>
      <text x="0" y="-58" textAnchor="middle" fontFamily="monospace" fontSize="10" letterSpacing="1" fill={COLORS.MUTED}>DISK</text>
      <path d="M-34,-46 h48 l20,20 v72 h-88 z" fill={COLORS.PANEL_ALT} stroke={COLORS.PROGRAM} strokeWidth="2" />
      <path d="M14,-46 v20 h20 z" fill={COLORS.PROGRAM} opacity="0.4" />
      <text x="0" y="10" textAnchor="middle" fontFamily="monospace" fontSize="10.5" fill={COLORS.TEXT}>{label}</text>
    </g>
  )
}

export function LaunchCursorIcon({ x, y, opacity, scale }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
      <g transform="translate(-16 -16)"><IconCursorClick size={32} color={COLORS.MUTED} /></g>
      <text x="0" y="26" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={COLORS.MUTED}>klik</text>
    </g>
  )
}

export function WarningLoadIcon({ x, y, opacity }) {
  return (
    <g transform={`translate(${x} ${y})`} opacity={opacity}>
      <circle cx="0" cy="0" r="22" fill={COLORS.PANEL} stroke={COLORS.WARNING} strokeWidth="1.6" />
      <g transform="translate(-14 -14)"><IconGaugeWarning size={28} color={COLORS.WARNING} /></g>
      <text x="0" y="34" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={COLORS.WARNING}>berat</text>
    </g>
  )
}

export function ProcessCard({ x, y, scale = 1, opacity = 1, color, name, pidVisible, pid, highlight, iconId }) {
  const Icon = iconId ? INLINE_ICON_MAP[iconId] : null
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
      <rect x="-72" y="-52" width="144" height="104" rx="14" fill={COLORS.PANEL_ALT} stroke={highlight ? COLORS.SUCCESS : color} strokeWidth={highlight ? 3 : 2.2} />
      {Icon && <g transform="translate(-64 -42)"><Icon size={24} color={color} /></g>}
      <text x="0" y="-6" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="14" fill={COLORS.TEXT}>{name}</text>
      <text x="0" y="16" textAnchor="middle" fontFamily="monospace" fontSize="10.5" fill={COLORS.MUTED}>process</text>
      {pidVisible && (
        <g transform="translate(0 40)">
          <rect x="-48" y="-13" width="96" height="26" rx="13" fill={COLORS.PANEL} stroke={COLORS.PID} strokeWidth="1.4" />
          <text x="0" y="5" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="11" fill={COLORS.PID}>PID {pid}</text>
        </g>
      )}
      {highlight && (
        <text x="0" y="70" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="9.5" fill={COLORS.SUCCESS}>paling memakai resource</text>
      )}
    </g>
  )
}

export function ResourceMeter({ x, y, color, cpu, mem, highlight }) {
  const cpuW = Math.max(0, Math.min(116, (116 * cpu) / 100))
  const memW = Math.max(0, Math.min(116, (116 * mem) / 100))
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-70" y="-38" width="140" height="76" rx="10" fill={COLORS.PANEL} stroke={highlight ? COLORS.SUCCESS : COLORS.BORDER} strokeWidth={highlight ? 2 : 1.2} />
      <text x="-58" y="-20" fontFamily="monospace" fontSize="10" fill={COLORS.MUTED}>CPU</text>
      <rect x="-58" y="-12" width="116" height="8" rx="4" fill={COLORS.BORDER} />
      <rect x="-58" y="-12" width={cpuW} height="8" rx="4" fill={COLORS.CPU} />
      <text x="-58" y="8" fontFamily="monospace" fontSize="10" fill={COLORS.MUTED}>MEM</text>
      <rect x="-58" y="16" width="116" height="8" rx="4" fill={COLORS.BORDER} />
      <rect x="-58" y="16" width={memW} height="8" rx="4" fill={COLORS.MEM} />
    </g>
  )
}

export function PidChip({ x, y, opacity, pid }) {
  return (
    <g transform={`translate(${x} ${y})`} opacity={opacity}>
      <rect x="-58" y="-15" width="116" height="30" rx="15" fill={COLORS.PANEL} stroke={COLORS.PID} strokeWidth="1.4" strokeDasharray="4 3" />
      <text x="0" y="5" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="11" fill={COLORS.PID}>PID {pid}</text>
    </g>
  )
}

export function TerminalPsPanel({ x, y, opacity, scale = 1, promptTyped, psRows, showTakeaway, takeawayText, highlightRowId }) {
  return (
    <g transform={`translate(${x} ${y}) scale(${scale})`} opacity={opacity}>
      <rect x="-320" y="-85" width="640" height="170" rx="18" fill={COLORS.PANEL_ALT} stroke={COLORS.SUCCESS} strokeWidth="2" />
      <circle cx="-296" cy="-64" r="5" fill={COLORS.MUSIC} />
      <circle cx="-278" cy="-64" r="5" fill={COLORS.EDITOR} />
      <circle cx="-260" cy="-64" r="5" fill={COLORS.SUCCESS} />
      {promptTyped && (
        <text x="-296" y="-36" fontFamily="monospace" fontWeight="700" fontSize="14" fill={COLORS.SUCCESS}>$ ps</text>
      )}
      <line x1="-296" y1="-22" x2="296" y2="-22" stroke={COLORS.BORDER} strokeWidth="1" />
      <text x="-296" y="-4" fontFamily="monospace" fontSize="11" fill={COLORS.MUTED}>PID</text>
      <text x="-176" y="-4" fontFamily="monospace" fontSize="11" fill={COLORS.MUTED}>CMD</text>
      <text x="120" y="-4" fontFamily="monospace" fontSize="11" fill={COLORS.MUTED}>STAT</text>
      {PROCESSES.slice(0, psRows).map((p, i) => {
        const rowY = 14 + i * 16
        const isCulprit = highlightRowId === p.id
        const rowColor = isCulprit ? COLORS.WARNING : p.color
        return (
          <g key={p.id}>
            {isCulprit && <rect x="-306" y={rowY - 11} width="612" height="15" rx="4" fill={COLORS.WARNING} opacity="0.12" />}
            <text x="-296" y={rowY} fontFamily="monospace" fontWeight={isCulprit ? '700' : '400'} fontSize="12.5" fill={rowColor}>{p.pid}</text>
            <text x="-176" y={rowY} fontFamily="monospace" fontWeight={isCulprit ? '700' : '400'} fontSize="12.5" fill={rowColor}>{p.name}</text>
            <text x="120" y={rowY} fontFamily="monospace" fontSize="12.5" fill={COLORS.MUTED}>S</text>
          </g>
        )
      })}
      <line x1="-296" y1="60" x2="296" y2="60" stroke={COLORS.BORDER} strokeWidth="1" />
      {showTakeaway && (
        <text x="0" y="76" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="12" fill={COLORS.WARNING}>{takeawayText}</text>
      )}
    </g>
  )
}

/** Elemen yang SELALU tampil lintas Act (caption lokal + file/process card
 * + PROCESSES label) — dipanggil dari SETIAP file Act, mirip `ActChrome`
 * di 44-ssh. `state` di sini sudah pakai default aman (lihat kontrak §2.2
 * di masing-masing ActN.jsx). */
export function SceneChrome({ state }) {
  const s = state || {}
  const pop = s.pop || {}
  return (
    <>
      <g opacity={oop(pop, 'caption')} transform={tos(pop, 'caption', s.captionX ?? 0, s.captionY ?? 0)}>
        <LocalCaptionBadge x={0} y={0} text={s.caption || ''} opacity={1} scale={1} color={s.captionColor || COLORS.SUCCESS} />
      </g>

      <ProgramFileCard x={PROGRAM_LANE_X} y={PROGRAM_LANE_Y} opacity={1 - (s.handoff ?? 1)} label={PROGRAM_LABEL} />
      <text x="366" y="300" textAnchor="middle" fontFamily="monospace" fontSize="10" letterSpacing="1" fill={COLORS.MUTED}>PROCESSES</text>

      <ProcessCard
        x={s.browserX ?? PROCESSES[0].slotX} y={s.browserY ?? ARENA_Y} scale={s.browserScale ?? 1}
        opacity={s.handoff ?? 1} color={PROCESSES[0].color} name={PROCESSES[0].name}
        pidVisible={s.pidVisible?.browser ?? true} pid={PROCESSES[0].pid}
        highlight={s.highlightBrowser ?? false} iconId={PROCESSES[0].iconId}
      />
      <g opacity={oop(pop, 'editor')} transform={tos(pop, 'editor', PROCESSES[1].slotX, ARENA_Y)}>
        <ProcessCard x={0} y={0} color={PROCESSES[1].color} name={PROCESSES[1].name} pidVisible={s.pidVisible?.editor ?? true} pid={PROCESSES[1].pid} iconId={PROCESSES[1].iconId} />
      </g>
      <g opacity={oop(pop, 'music')} transform={tos(pop, 'music', PROCESSES[2].slotX, ARENA_Y)}>
        <ProcessCard x={0} y={0} color={PROCESSES[2].color} name={PROCESSES[2].name} pidVisible={s.pidVisible?.music ?? true} pid={PROCESSES[2].pid} iconId={PROCESSES[2].iconId} />
      </g>
    </>
  )
}

/** Blok resource meter 3-kolom — dipakai Act3 & Act4 (resource tetap
 * terlihat begitu sudah pernah muncul, sesuai continuity map). */
export function ResourceMetersBlock({ state }) {
  const s = state || {}
  const pop = s.pop || {}
  const rv = s.resourceVal || {
    browser: { cpu: PROCESSES[0].cpu, mem: PROCESSES[0].mem },
    editor: { cpu: PROCESSES[1].cpu, mem: PROCESSES[1].mem },
    music: { cpu: PROCESSES[2].cpu, mem: PROCESSES[2].mem },
  }
  return (
    <g opacity={s.pop ? oop(pop, 'resourcePanels') : 1}>
      <ResourceMeter x={PROCESSES[0].slotX} y={METER_Y} color={PROCESSES[0].color} cpu={rv.browser.cpu} mem={rv.browser.mem} highlight={s.highlightBrowser ?? false} />
      <ResourceMeter x={PROCESSES[1].slotX} y={METER_Y} color={PROCESSES[1].color} cpu={rv.editor.cpu} mem={rv.editor.mem} />
      <ResourceMeter x={PROCESSES[2].slotX} y={METER_Y} color={PROCESSES[2].color} cpu={rv.music.cpu} mem={rv.music.mem} />
    </g>
  )
}
