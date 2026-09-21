// src/content/92-web-server/acts/common.jsx
// ─────────────────────────────────────────────────────────────
// Helper bersama untuk file per-act (pola "1 act = 1 file", lihat
// docs/standardizations/07-act-scene-pattern.md). Oracle: 44-ssh/acts/common.jsx.
//
// Kontrak:
//   • Tiap komponen act PURE presentational — tanpa GSAP, tanpa React state.
//   • `state` — semua field OPSIONAL, null-safe (default via ?? aman).
//   • Dipanggil TANPA props (mode summary) → SUMMARY_STATE per file act.
//   • `origin` (default {0,0}) — translate wrapper untuk bgScenes intro;
//     live di dalam ContentBodyV1 cukup {0,0} (body sudah translate sendiri).
//
// Koordinat TETAP body-local (tidak berubah dari Animation.jsx lama).
// Chrome (Browser + Listener + PathChip + StaticShelf + AppUpstream)
// persisten di SEMUA act (pola sama Client/Server di 44-ssh) — dulu di
// EKSEKUSI-02 dirender unconditional sepanjang body, sekarang dipanggil
// eksplisit lewat <Chrome state={state} /> di tiap file act.
// ─────────────────────────────────────────────────────────────

import React from 'react'
import {
  COLORS, LISTENER_POS, BROWSER_POS, STATIC_POS, APP_POS,
  LISTENER_EXAMPLES, STATIC_FILES, STATIC_PATH,
  APP_RUNTIME_LABEL, APP_RUNTIME_ALT,
} from '../data'

/** Bungkus scene act + chrome dengan origin translate (default {0,0}). */
export function withOrigin(children, origin = { x: 0, y: 0 }) {
  if (!origin || (origin.x === 0 && origin.y === 0)) return children
  return <g transform={`translate(${origin.x}, ${origin.y})`}>{children}</g>
}

export const CaptionBar = ({ text, color }) => {
  if (!text) return null
  return (
    <g transform="translate(366 60)">
      <rect x="-300" y="-24" width="600" height="48" rx="22" fill={COLORS.PANEL} stroke={color || COLORS.BORDER} strokeWidth="1.5" opacity="0.96" />
      <text x="0" y="6" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="13.5" fill={COLORS.TEXT}>{text}</text>
    </g>
  )
}

export const PathChip = ({ visible, label, color }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${LISTENER_POS.x} ${LISTENER_POS.y - 74})`}>
      <rect x="-72" y="-16" width="144" height="32" rx="16" fill={COLORS.PANEL} stroke={color} strokeWidth="1.6" />
      <text x="0" y="5" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="12" fill={color}>{label}</text>
    </g>
  )
}

export const ConnLine = ({ x1, y1, x2, y2, color, dashed = true, opacity = 0.7, width = 2 }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width}
    strokeDasharray={dashed ? '6 5' : undefined} opacity={opacity} />
)
export const ProgressDot = ({ x1, y1, x2, y2, progress, color, r = 7 }) => {
  if (!progress || progress <= 0) return null
  const x = x1 + (x2 - x1) * progress
  const y = y1 + (y2 - y1) * progress
  return <circle cx={x} cy={y} r={r} fill={color} />
}

// ── Icon brand — bentuk GENERIK/abstrak yang mengevokasi identitas tiap
// software (bukan reproduksi vektor logo resmi/trademark — revisi 03
// §2 sengaja pakai path generik, konsisten Batas Aman IP). ──
export function IconNginx({ size = 16, x = 0, y = 0 }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M ${-size / 2} ${size / 2} L ${-size / 2} ${-size / 2} L 0 ${size / 2} L 0 ${-size / 2} L ${size / 2} ${size / 2} L ${size / 2} ${-size / 2}`}
        fill="none" stroke="#009639" strokeWidth={size * 0.16} strokeLinecap="round" strokeLinejoin="round" />
    </g>
  )
}
export function IconApache({ size = 16, x = 0, y = 0 }) {
  const r = size / 2
  return (
    <g transform={`translate(${x} ${y})`}>
      <path d={`M ${-r} ${r} Q 0 ${-r} ${r} ${r}`} fill="none" stroke="#D22128" strokeWidth={size * 0.18} strokeLinecap="round" />
      <path d={`M ${-r * 0.5} ${r * 0.5} Q 0 ${-r * 0.4} ${r * 0.5} ${r * 0.5}`} fill="none" stroke="#D22128" strokeWidth={size * 0.14} strokeLinecap="round" opacity="0.75" />
    </g>
  )
}
export function IconNodeJs({ size = 18, x = 0, y = 0, color = '#5FA04E' }) {
  const r = size / 2
  const pts = [0, 60, 120, 180, 240, 300].map((deg) => {
    const rad = (Math.PI / 180) * deg
    return `${(r * Math.sin(rad)).toFixed(1)},${(-r * Math.cos(rad)).toFixed(1)}`
  }).join(' ')
  return (
    <g transform={`translate(${x} ${y})`}>
      <polygon points={pts} fill="none" stroke={color} strokeWidth={size * 0.12} strokeLinejoin="round" />
    </g>
  )
}
export function IconFileHtml({ size = 12, x = 0, y = 0, color }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <text x="0" y={size * 0.3} textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize={size} fill={color}>{'</>'}</text>
    </g>
  )
}
export function IconFileCss({ size = 12, x = 0, y = 0, color }) {
  return (
    <g transform={`translate(${x} ${y})`}>
      <text x="0" y={size * 0.3} textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize={size} fill={color}>{'{ }'}</text>
    </g>
  )
}
export function IconFileImage({ size = 12, x = 0, y = 0, color }) {
  const h = size / 2
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-h} y={-h * 0.7} width={size} height={size * 0.7} rx="1.5" fill="none" stroke={color} strokeWidth="1.2" />
      <circle cx={-h * 0.4} cy={-h * 0.25} r={h * 0.18} fill={color} />
      <path d={`M ${-h} ${h * 0.55} L ${-h * 0.1} ${-h * 0.1} L ${h * 0.3} ${h * 0.3} L ${h * 0.6} ${-h * 0.15} L ${h} ${h * 0.55} Z`} fill={color} opacity="0.85" />
    </g>
  )
}


// ── BrowserIcon — URL bar path aktif; hasil render beda bentuk untuk
// static (garis HTML) vs dynamic (brace JSON). ──
export const BrowserIcon = ({ path, resultType }) => (
  <g transform={`translate(${BROWSER_POS.x} ${BROWSER_POS.y})`}>
    <rect x="-130" y="-46" width="260" height="92" rx="14" fill={COLORS.PANEL} stroke={COLORS.BROWSER} strokeWidth="2.2" />
    <rect x="-118" y="-32" width="236" height="20" rx="6" fill={COLORS.BG} stroke={COLORS.BORDER} strokeWidth="1" />
    <circle cx="-104" cy="-22" r="3" fill={COLORS.RISK} opacity="0.7" />
    <circle cx="-94" cy="-22" r="3" fill={COLORS.WARNING} opacity="0.7" />
    <circle cx="-84" cy="-22" r="3" fill={COLORS.SUCCESS} opacity="0.7" />
    <text x="6" y="-18" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={COLORS.MUTED}>{path || 'https://…'}</text>
    {resultType === 'static' && (
      <g>
        <rect x="-110" y="0" width="220" height="10" rx="3" fill={COLORS.STATIC} opacity="0.6" />
        <rect x="-110" y="16" width="160" height="10" rx="3" fill={COLORS.STATIC} opacity="0.4" />
      </g>
    )}
    {resultType === 'dynamic' && (
      <text x="0" y="14" textAnchor="middle" fontFamily="monospace" fontSize="11" fill={COLORS.APP}>{'{ "profile": … }'}</text>
    )}
    {!resultType && (
      <text x="0" y="14" textAnchor="middle" fontFamily="monospace" fontSize="10" fill={COLORS.MUTED}>menunggu…</text>
    )}
  </g>
)

// ── ListenerIcon — anchor persisten "Nginx / Apache" + ring HTTP/HTTPS. ──
export const ListenerIcon = ({ visible, glow }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${LISTENER_POS.x} ${LISTENER_POS.y})`}>
      {glow > 0 && (
        <circle r="52" fill="none" stroke={COLORS.LISTENER} strokeWidth="1.4" opacity={glow * 0.5}>
          <animate attributeName="r" values="44;60;44" dur="1.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0;0.4" dur="1.6s" repeatCount="indefinite" />
        </circle>
      )}
      <rect x="-64" y="-40" width="128" height="80" rx="12" fill={COLORS.PANEL} stroke={COLORS.LISTENER} strokeWidth="2.2" />
      <circle cx="0" cy="-14" r="14" fill="none" stroke={COLORS.LISTENER} strokeWidth="2" />
      <circle cx="0" cy="-14" r="5" fill={COLORS.LISTENER} />
      <text x="0" y="10" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="11.5" fill={COLORS.LISTENER}>HTTP/HTTPS</text>
      <IconNginx size={12} x={-18} y={23} />
      <IconApache size={12} x={18} y={23} />
      <text x="0" y="36" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={COLORS.MUTED}>{LISTENER_EXAMPLES}</text>
    </g>
  )
}

// ── StaticFileShelf — tile file NYATA, sudah ada sejak awal, satu tile
// disorot saat dibaca. ──
export const StaticFileShelf = ({ dim, activeId }) => (
  <g transform={`translate(${STATIC_POS.x} ${STATIC_POS.y})`} opacity={dim ? 0.45 : 1}>
    <rect x="-78" y="-52" width="156" height="104" rx="10" fill={COLORS.PANEL} stroke={COLORS.STATIC} strokeWidth={activeId ? 2.2 : 1.3} />
    {STATIC_FILES.map((f) => {
      const tint = activeId === f.id ? COLORS.BG : COLORS.STATIC
      const FileIcon = f.id === 'about' ? IconFileHtml : f.id === 'style' ? IconFileCss : IconFileImage
      return (
        <g key={f.id}>
          <rect x="-58" y={f.y - 9} width="116" height="18" rx="3"
            fill={activeId === f.id ? COLORS.STATIC : COLORS.PANEL}
            stroke={COLORS.STATIC} strokeWidth="1.2" opacity={activeId === f.id ? 1 : 0.7} />
          <FileIcon size={10} x={-42} y={f.y + 3.5} color={tint} />
          <text x="6" y={f.y + 4} textAnchor="middle" fontFamily="monospace" fontSize="9" fill={tint}>{f.label}</text>
        </g>
      )
    })}
    <text x="0" y="70" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="11" fill={COLORS.STATIC}>disk / file shelf</text>
  </g>
)

// ── AppUpstream — process TERPISAH, idle sampai packet tiba. ──
export const AppUpstream = ({ dim, active, building, jsonReady }) => (
  <g transform={`translate(${APP_POS.x} ${APP_POS.y})`} opacity={dim ? 0.45 : 1}>
    <rect x="-78" y="-52" width="156" height="104" rx="10" fill={COLORS.PANEL} stroke={COLORS.APP} strokeWidth={active ? 2.2 : 1.3} />
    <circle cx="0" cy="-16" r="16" fill="none" stroke={COLORS.APP} strokeWidth="2">
      {building && <animate attributeName="r" values="14;20;14" dur="0.7s" repeatCount="indefinite" />}
    </circle>
    <IconNodeJs size={16} x={0} y={-16} color={COLORS.APP} />
    <text x="0" y="18" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="10.5" fill={COLORS.APP}>App · {APP_RUNTIME_LABEL}</text>
    <text x="0" y="30" textAnchor="middle" fontFamily="monospace" fontSize="7.5" fill={COLORS.MUTED}>{APP_RUNTIME_ALT}</text>
    {jsonReady && (
      <text x="0" y="46" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={COLORS.APP}>{'{ json }'}</text>
    )}
    <text x="0" y="70" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="11" fill={COLORS.APP}>app upstream</text>
  </g>
)

// ── ResponseCapsule — generic capsule dipakai lintas Act; label beda
// untuk static (HTML) vs dynamic (JSON). ──
export const ResponseCapsule = ({ visible, fromX, fromY, toX, toY, progress = 0, kind = 'static' }) => {
  if (!visible) return null
  const x = fromX + (toX - fromX) * progress
  const y = fromY + (toY - fromY) * progress
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-32" y="-16" width="64" height="32" rx="10" fill={kind === 'static' ? COLORS.STATIC : COLORS.APP} opacity="0.92" />
      <text x="0" y="5" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="9.5" fill={COLORS.BG}>{kind === 'static' ? '200 HTML' : '200 JSON'}</text>
    </g>
  )
}

export const LogLine = ({ visible, text }) => {
  if (!visible) return null
  return (
    <g transform="translate(366 950)">
      <rect x="-280" y="-18" width="560" height="36" rx="8" fill={COLORS.PANEL} stroke={COLORS.LOG} strokeWidth="1.4" />
      <text x="0" y="5" textAnchor="middle" fontFamily="monospace" fontSize="10.5" fill={COLORS.LOG}>{text}</text>
    </g>
  )
}

export const TakeawayBar = ({ visible, text }) => {
  if (!visible) return null
  return (
    <g transform="translate(366 1010)">
      <rect x="-280" y="-30" width="560" height="60" rx="26" fill={COLORS.SUCCESS} opacity="0.14" />
      <rect x="-280" y="-30" width="560" height="60" rx="26" fill="none" stroke={COLORS.SUCCESS} strokeWidth="2" />
      <text x="0" y="7" textAnchor="middle" fontSize="15" fontWeight="700" fill={COLORS.SUCCESS}>{text}</text>
    </g>
  )
}

/** Chrome persisten lintas-act: browser + listener + path chip + kedua
 * resource card (shelf/app) — dipanggil di tiap file act (pola ActChrome
 * 44-ssh). Dim/active masing-masing dikontrol lewat field state. */
export function Chrome({ state = {} }) {
  const s = state
  return (
    <>
      <BrowserIcon path={s.browserPath} resultType={s.browserResult ?? null} />
      <ListenerIcon visible={s.listenerVisible ?? true} glow={s.listenerGlow ?? 0.3} />
      <PathChip visible={s.pathChipVisible ?? false}
        label={s.browserPath} color={s.browserPath === STATIC_PATH ? COLORS.STATIC : COLORS.APP} />
      <StaticFileShelf dim={s.appActive ?? false} activeId={s.staticFileActiveId ?? null} />
      <AppUpstream dim={(s.staticFileActiveId ?? null) !== null} active={s.appActive ?? false}
        building={s.appBuilding ?? false} jsonReady={s.jsonReady ?? false} />
    </>
  )
}
