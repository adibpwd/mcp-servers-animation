// src/content/45-root-vs-non-root/acts/common.jsx
// ─────────────────────────────────────────────────────────────
// Helper bersama untuk file per-act (pola "1 act = 1 file", lihat
// docs/standardizations/07-act-scene-pattern.md).
//
// Kontrak: semua komponen di sini PURE presentational — tanpa GSAP,
// tanpa React state, tanpa SFX. Koordinat body-local (lihat data.js ZONES).
// ─────────────────────────────────────────────────────────────

import React from 'react'
import { ZONES, COLORS, FS_FILES } from '../data'

// ─────────────────────────────────────────────────────────────
// Inline SVG icons (stroke-based, tanpa asset eksternal)
// ─────────────────────────────────────────────────────────────

export function IconCrown({ size = 18, color = COLORS.PINK }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M3 18h18l-1.5-9-4.5 4-3-6-3 6-4.5-4L3 18z"/>
    </svg>
  )
}

export function IconUser({ size = 18, color = COLORS.BLUE }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <circle cx="12" cy="8" r="4"/>
      <path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/>
    </svg>
  )
}

export function IconServer({ size = 20, color = COLORS.CYAN }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <rect x="2" y="2" width="20" height="8" rx="2"/>
      <rect x="2" y="14" width="20" height="8" rx="2"/>
      <line x1="6" y1="6" x2="6.01" y2="6"/>
      <line x1="6" y1="18" x2="6.01" y2="18"/>
    </svg>
  )
}

export function IconTerminal({ size = 18, color = COLORS.TEXT_SECONDARY }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <rect x="2" y="4" width="20" height="16" rx="2"/>
      <polyline points="6 9 10 12 6 15"/>
      <line x1="12" y1="15" x2="16" y2="15"/>
    </svg>
  )
}

export function IconLock({ size = 18, color = COLORS.EMERALD }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <rect x="4" y="10" width="16" height="10" rx="2"/>
      <path d="M7 10V7a5 5 0 0 1 10 0v3"/>
    </svg>
  )
}

export function IconSkull({ size = 18, color = COLORS.RED }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M12 2a8 8 0 0 0-8 8c0 3 1.5 5 3 6v3h2v-2h2v2h2v-2h2v2h2v-3c1.5-1 3-3 3-6a8 8 0 0 0-8-8z"/>
      <circle cx="9" cy="10" r="1.3" fill={color}/>
      <circle cx="15" cy="10" r="1.3" fill={color}/>
    </svg>
  )
}

export function IconShield({ size = 18, color = COLORS.EMERALD }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M12 2 4 5v6c0 5 3.4 8.5 8 11 4.6-2.5 8-6 8-11V5l-8-3z"/>
      <path d="M9 12l2 2 4-4"/>
    </svg>
  )
}

export function IconFile({ size = 16, color = COLORS.TEXT_SECONDARY }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2">
      <path d="M6 2h9l5 5v15H6z"/>
      <path d="M15 2v5h5"/>
    </svg>
  )
}

/** Caption yang nempel di dekat actor yang sedang dibahas. */
export const CaptionBar = ({ text, color, x = 366, y = 30 }) => {
  if (!text) return null
  const boxWidth = 340
  const half = boxWidth / 2
  const clampedX = Math.max(half + 8, Math.min(732 - half - 8, x))
  const clampedY = Math.max(20, Math.min(945, y))
  return (
    <g transform={`translate(${clampedX} ${clampedY})`}>
      <rect x={-half} y="-17" width={boxWidth} height="34" rx="16"
        fill={COLORS.MID} stroke={color || COLORS.BORDER_DEFAULT}
        strokeWidth="1.5" opacity="0.95" />
      <text x="0" y="5" textAnchor="middle" fontFamily="sans-serif"
        fontWeight="600" fontSize="12" fill={COLORS.TEXT_PRIMARY}>
        {text}
      </text>
    </g>
  )
}

// User identity badge — muncul di ZONES.USER_BADGE, role: 'user'|'root'|'appuser'|'www-data'
export const UserBadge = ({ visible, role = 'user' }) => {
  if (!visible) return null
  const isRoot = role === 'root'
  const label = isRoot ? 'root (UID 0)' : role
  const color = isRoot ? COLORS.PINK : (role === 'user' ? COLORS.BLUE : COLORS.EMERALD)
  return (
    <g transform={`translate(${ZONES.USER_BADGE.x} ${ZONES.USER_BADGE.y})`}>
      {isRoot && (
        <circle r="52" fill="none" stroke={COLORS.PINK} strokeWidth="1.3" opacity="0.35">
          <animate attributeName="r" values="46;58;46" dur="1.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.35;0;0.35" dur="1.6s" repeatCount="indefinite" />
        </circle>
      )}
      <rect x="-70" y="-40" width="140" height="80" rx="12"
        fill={COLORS.LIGHT} stroke={color} strokeWidth={isRoot ? 2.5 : 2} />
      <g transform="translate(-9 -30)">
        {isRoot ? <IconCrown size={18} color={color} /> : <IconUser size={18} color={color} />}
      </g>
      <text x="0" y="20" textAnchor="middle" fontFamily="monospace"
        fontWeight="700" fontSize="11" fill={color}>{label}</text>
    </g>
  )
}

// Terminal window — prompt + typed command, dangerHighlight menandai spasi fatal
export const TerminalWindow = ({ visible, promptRoot, commandText, dangerHighlight, noConfirm }) => {
  if (!visible) return null
  const prompt = promptRoot ? 'root@server:~#' : 'user@server:~$'
  const promptColor = promptRoot ? COLORS.PINK : COLORS.BLUE
  return (
    <g transform={`translate(${ZONES.TERMINAL.x} ${ZONES.TERMINAL.y})`}>
      <rect x="-160" y="-55" width="320" height="110" rx="10"
        fill={COLORS.LIGHT} stroke={COLORS.BORDER_DEFAULT} strokeWidth="2" />
      <rect x="-150" y="-45" width="300" height="18" rx="4"
        fill={COLORS.DEEP} stroke={COLORS.BORDER_SUBTLE} strokeWidth="1" />
      <circle cx="-140" cy="-36" r="2.4" fill={COLORS.RED} opacity="0.7" />
      <circle cx="-132" cy="-36" r="2.4" fill={COLORS.YELLOW} opacity="0.7" />
      <circle cx="-124" cy="-36" r="2.4" fill={COLORS.EMERALD} opacity="0.7" />
      <g transform="translate(6 -6)">
        <IconTerminal size={16} color={COLORS.MUTED} />
      </g>
      <text x="-148" y="-12" fontFamily="monospace" fontWeight="700" fontSize="11" fill={promptColor}>
        {prompt}
      </text>
      {commandText && (
        <text x="-148" y="8" fontFamily="monospace" fontSize="11" fill={COLORS.TEXT_PRIMARY}>
          {commandText}
        </text>
      )}
      {dangerHighlight && (
        <rect x="-30" y="-2" width="10" height="14" fill={COLORS.RED} opacity="0.55">
          <animate attributeName="opacity" values="0.2;0.75;0.2" dur="0.6s" repeatCount="indefinite" />
        </rect>
      )}
      {noConfirm && (
        <text x="-148" y="26" fontFamily="monospace" fontSize="9" fill={COLORS.MUTED}>
          (tidak ada dialog konfirmasi)
        </text>
      )}
    </g>
  )
}

// Server box — state: 'healthy' | 'destroyed'
export const ServerBox = ({ visible, state = 'healthy' }) => {
  if (!visible) return null
  const destroyed = state === 'destroyed'
  const color = destroyed ? COLORS.RED : COLORS.CYAN
  return (
    <g transform={`translate(${ZONES.SERVER.x} ${ZONES.SERVER.y})`}>
      {!destroyed && (
        <circle r="65" fill="none" stroke={COLORS.CYAN} strokeWidth="1.4" opacity="0.3">
          <animate attributeName="r" values="60;75;60" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0;0.3" dur="1.8s" repeatCount="indefinite" />
        </circle>
      )}
      <rect x="-75" y="-50" width="150" height="100" rx="12"
        fill={COLORS.LIGHT} stroke={color} strokeWidth={destroyed ? 2 : 2.5} opacity={destroyed ? 0.55 : 1} />
      <g transform="translate(-10 -20)">
        {destroyed ? <IconSkull size={22} color={color} /> : <IconServer size={22} color={color} />}
      </g>
      <text x="0" y="18" textAnchor="middle" fontFamily="monospace"
        fontWeight="700" fontSize="12" fill={color}>SERVER</text>
      <text x="0" y="33" textAnchor="middle" fontFamily="monospace"
        fontSize="9" fill={COLORS.MUTED}>{destroyed ? 'DESTROYED' : 'healthy'}</text>
    </g>
  )
}

// Baris file/folder sistem (Act 2) — destroyedCount file pertama tampil "poof"
export const FSRow = ({ visible, destroyedCount = 0 }) => {
  if (!visible) return null
  const n = FS_FILES.length
  const spacing = 110
  const startX = -((n - 1) * spacing) / 2
  return (
    <g transform={`translate(${ZONES.SERVER.x} ${ZONES.FS_ROW.y})`}>
      {FS_FILES.map((name, i) => {
        const isGone = i < destroyedCount
        const x = startX + i * spacing
        return (
          <g key={name} transform={`translate(${x} 0)`} opacity={isGone ? 0.15 : 1}>
            <rect x="-32" y="-24" width="64" height="48" rx="8"
              fill={COLORS.MID} stroke={isGone ? COLORS.RED : COLORS.BORDER_DEFAULT}
              strokeWidth="1.5" strokeDasharray={isGone ? '4 3' : '0'} />
            <g transform="translate(-8 -14)">
              <IconFile size={16} color={isGone ? COLORS.RED : COLORS.TEXT_SECONDARY} />
            </g>
            <text x="0" y="18" textAnchor="middle" fontFamily="monospace"
              fontSize="9" fill={isGone ? COLORS.RED : COLORS.MUTED}>/{name}</text>
          </g>
        )
      })}
    </g>
  )
}

export const HackerIcon = ({ visible, active }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${ZONES.HACKER.x} ${ZONES.HACKER.y})`}>
      <rect x="-55" y="-40" width="110" height="80" rx="10"
        fill={COLORS.LIGHT} stroke={COLORS.RED} strokeWidth={active ? 2.4 : 1.8} />
      <g transform="translate(-9 -20)">
        <IconSkull size={20} color={COLORS.RED} />
      </g>
      <text x="0" y="17" textAnchor="middle" fontFamily="monospace"
        fontWeight="700" fontSize="10" fill={COLORS.RED}>HACKER</text>
      <text x="0" y="30" textAnchor="middle" fontFamily="monospace"
        fontSize="8" fill={COLORS.MUTED}>RCE exploit</text>
    </g>
  )
}

// Web app process — runAsRoot menentukan badge identitas proses
export const WebAppBox = ({ visible, runAsRoot }) => {
  if (!visible) return null
  const color = runAsRoot ? COLORS.PINK : COLORS.EMERALD
  return (
    <g transform={`translate(${ZONES.WEBAPP.x} ${ZONES.WEBAPP.y})`}>
      <rect x="-75" y="-48" width="150" height="96" rx="12"
        fill={COLORS.LIGHT} stroke={color} strokeWidth="2.2" />
      <g transform="translate(-9 -30)">
        {runAsRoot ? <IconCrown size={18} color={color} /> : <IconUser size={18} color={color} />}
      </g>
      <text x="0" y="4" textAnchor="middle" fontFamily="monospace"
        fontWeight="700" fontSize="11" fill={COLORS.TEXT_PRIMARY}>WEB APP</text>
      <text x="0" y="20" textAnchor="middle" fontFamily="monospace"
        fontWeight="700" fontSize="10" fill={color}>
        run as {runAsRoot ? 'root' : 'www-data'}
      </text>
      <text x="0" y="34" textAnchor="middle" fontFamily="monospace"
        fontSize="8" fill={COLORS.MUTED}>bug: RCE</text>
    </g>
  )
}

// Blast radius circle — mengembang dari WEBAPP, radius kecil (contained) atau
// besar (mencapai SERVER+TARGET), warna mengikuti hasil skenario.
export const BlastRadius = ({ visible, contained }) => {
  if (!visible) return null
  const r = contained ? 95 : 340
  const color = contained ? COLORS.EMERALD : COLORS.RED
  return (
    <g transform={`translate(${ZONES.WEBAPP.x} ${ZONES.WEBAPP.y})`}>
      <circle r={r} fill={color} fillOpacity="0.08" stroke={color} strokeWidth="2" strokeDasharray="6 4" />
    </g>
  )
}

// Target terproteksi (/etc/shadow) — breached kalau blast radius menembusnya
export const TargetLock = ({ visible, breached }) => {
  if (!visible) return null
  const color = breached ? COLORS.RED : COLORS.EMERALD
  return (
    <g transform={`translate(${ZONES.TARGET.x} ${ZONES.TARGET.y})`}>
      <rect x="-60" y="-40" width="120" height="80" rx="10"
        fill={COLORS.LIGHT} stroke={color} strokeWidth="2" />
      <g transform="translate(-9 -22)">
        <IconLock size={18} color={color} />
      </g>
      <text x="0" y="14" textAnchor="middle" fontFamily="monospace"
        fontWeight="700" fontSize="9" fill={COLORS.TEXT_SECONDARY}>/etc/shadow</text>
      <text x="0" y="28" textAnchor="middle" fontFamily="monospace"
        fontWeight="700" fontSize="10" fill={color}>{breached ? 'DIBOBOL' : 'AMAN'}</text>
    </g>
  )
}

// Kartu konfigurasi systemd (Act 4) — User=appuser
export const SystemdCard = ({ visible }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${ZONES.WEBAPP.x} ${ZONES.WEBAPP.y})`}>
      <rect x="-140" y="-55" width="280" height="110" rx="10"
        fill={COLORS.LIGHT} stroke={COLORS.EMERALD} strokeWidth="2.2" />
      <text x="-125" y="-30" fontFamily="monospace" fontWeight="700" fontSize="10" fill={COLORS.TEXT_SECONDARY}>
        [Service]
      </text>
      <text x="-125" y="-10" fontFamily="monospace" fontSize="11" fill={COLORS.TEXT_PRIMARY}>
        ExecStart=/app/server
      </text>
      <text x="-125" y="10" fontFamily="monospace" fontWeight="700" fontSize="12" fill={COLORS.EMERALD}>
        User=appuser
      </text>
      <text x="-125" y="30" fontFamily="monospace" fontSize="9" fill={COLORS.MUTED}>
        systemd unit
      </text>
    </g>
  )
}

// Badge sudo sementara — muncul sesaat lalu hilang (eskalasi terbatas)
export const SudoBadge = ({ visible }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${ZONES.TARGET.x} ${ZONES.WEBAPP.y})`}>
      <circle r="50" fill="none" stroke={COLORS.PURPLE} strokeWidth="1.4" opacity="0.4">
        <animate attributeName="r" values="44;56;44" dur="1s" repeatCount="indefinite" />
        <animate attributeName="opacity" values="0.5;0;0.5" dur="1s" repeatCount="indefinite" />
      </circle>
      <rect x="-58" y="-34" width="116" height="68" rx="10"
        fill={COLORS.LIGHT} stroke={COLORS.PURPLE} strokeWidth="2.2" />
      <text x="0" y="0" textAnchor="middle" fontFamily="monospace"
        fontWeight="700" fontSize="12" fill={COLORS.PURPLE}>sudo</text>
      <text x="0" y="16" textAnchor="middle" fontFamily="monospace"
        fontSize="8" fill={COLORS.MUTED}>sesaat, lalu turun</text>
    </g>
  )
}
