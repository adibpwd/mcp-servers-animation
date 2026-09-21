// src/content/94-domain-to-server/acts/common.jsx
// ─────────────────────────────────────────────────────────────
// Helper bersama untuk file per-act (pola "1 act = 1 file", lihat
// docs/standardizations/07-act-scene-pattern.md).
//
// Kontrak:
//   • Semua komponen di sini PURE presentational — tanpa GSAP, tanpa
//     React state, tanpa SFX.
//   • Dipakai lintas Act karena elemen ini persisten (browser, DNS, edge,
//     proxy, backend tidak di-popOut begitu muncul — hanya toggle
//     `active`/posisi). Setiap Act file mengimpor yang relevan dan
//     mengoper booleannya dari `state` (lihat kontrak §2.2 di 07-....md).
//   • Semua koordinat body-local, TIDAK berubah dari Animation.jsx lama.
// ─────────────────────────────────────────────────────────────

import React from 'react'
import { ZONES, COLORS, DOMAIN, IP, PORT } from '../data'

/** Caption yang nempel di dekat actor yang sedang dibahas (bukan caption
 * bar global — lihat 03-planning-storytelling-quality-gate.md §D). Posisi
 * di-anchor ke koordinat actor terkait tiap beat, di-clamp supaya tidak
 * keluar body (lebar body 732, lihat 05-svg-layout-asset-pipeline.md). */
export const CaptionBar = ({ text, color, x = 366, y = 30 }) => {
  if (!text) return null
  const boxWidth = 300
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

// Browser icon dengan loading state
export const BrowserIcon = ({ visible, loading, hasPage }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${ZONES.BROWSER.x} ${ZONES.BROWSER.y})`}>
      <rect x="-50" y="-40" width="100" height="80" rx="10"
        fill={COLORS.LIGHT} stroke={COLORS.BLUE} strokeWidth="2" />
      <rect x="-40" y="-28" width="80" height="16" rx="4"
        fill={COLORS.DEEP} stroke={COLORS.BORDER_DEFAULT} strokeWidth="1" />
      <circle cx="-30" cy="-20" r="2.5" fill={COLORS.RED} opacity="0.7" />
      <circle cx="-22" cy="-20" r="2.5" fill={COLORS.YELLOW} opacity="0.7" />
      <circle cx="-14" cy="-20" r="2.5" fill={COLORS.GREEN} opacity="0.7" />

      {loading && (
        <g>
          <circle cx="0" cy="10" r="8" fill="none" stroke={COLORS.BLUE} strokeWidth="2" opacity="0.5">
            <animateTransform attributeName="transform" type="rotate"
              from="0 0 10" to="360 0 10" dur="1s" repeatCount="indefinite" />
          </circle>
          <text x="0" y="32" textAnchor="middle" fontFamily="monospace"
            fontSize="9" fill={COLORS.MUTED}>loading...</text>
        </g>
      )}

      {hasPage && !loading && (
        <g>
          <rect x="-35" y="0" width="70" height="8" rx="2" fill={COLORS.GREEN} opacity="0.6" />
          <rect x="-35" y="12" width="50" height="8" rx="2" fill={COLORS.GREEN} opacity="0.4" />
          <rect x="-35" y="24" width="60" height="8" rx="2" fill={COLORS.GREEN} opacity="0.4" />
        </g>
      )}
    </g>
  )
}

// DNS resolver icon
export const DNSIcon = ({ visible, active }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${ZONES.DNS.x} ${ZONES.DNS.y})`}>
      {active && (
        <circle r="40" fill="none" stroke={COLORS.PURPLE} strokeWidth="1.2" opacity="0.4">
          <animate attributeName="r" values="35;50;35" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0;0.4" dur="1.5s" repeatCount="indefinite" />
        </circle>
      )}
      <rect x="-45" y="-35" width="90" height="70" rx="10"
        fill={COLORS.LIGHT} stroke={COLORS.PURPLE} strokeWidth={active ? 2.5 : 2} />
      <circle cx="0" cy="-8" r="12" fill="none" stroke={COLORS.PURPLE} strokeWidth="2" />
      <circle cx="0" cy="-8" r="4" fill={COLORS.PURPLE} />
      <text x="0" y="22" textAnchor="middle" fontFamily="monospace"
        fontWeight="700" fontSize="11" fill={COLORS.PURPLE}>DNS</text>
    </g>
  )
}

// Domain chip (transforms to IP chip)
export const DomainChip = ({ visible, x, y, showDomain, showIP }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${x} ${y})`}>
      {showDomain && (
        <g>
          <rect x="-60" y="-16" width="120" height="32" rx="16"
            fill={COLORS.MID} stroke={COLORS.BLUE} strokeWidth="1.8" />
          <text x="0" y="5" textAnchor="middle" fontFamily="monospace"
            fontWeight="700" fontSize="12" fill={COLORS.BLUE}>{DOMAIN}</text>
        </g>
      )}
      {showIP && (
        <g>
          <rect x="-60" y="-16" width="120" height="32" rx="16"
            fill={COLORS.MID} stroke={COLORS.CYAN} strokeWidth="1.8" />
          <text x="0" y="5" textAnchor="middle" fontFamily="monospace"
            fontWeight="700" fontSize="11" fill={COLORS.CYAN}>{IP}</text>
        </g>
      )}
    </g>
  )
}

// DNS Query packet (small)
export const DNSQueryPacket = ({ visible, x, y }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-25" y="-25" width="50" height="50" rx="8"
        fill={COLORS.PURPLE} fillOpacity="0.2"
        stroke={COLORS.PURPLE} strokeWidth="2" />
      <text x="0" y="5" textAnchor="middle" fontFamily="monospace"
        fontSize="9" fill={COLORS.PURPLE}>DNS?</text>
    </g>
  )
}

// HTTPS Request packet
export const RequestPacket = ({ visible, x, y }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-30" y="-30" width="60" height="60" rx="10"
        fill={COLORS.PINK} fillOpacity="0.15"
        stroke={COLORS.PINK} strokeWidth="2.5" />
      <text x="0" y="-8" textAnchor="middle" fontFamily="monospace"
        fontWeight="700" fontSize="10" fill={COLORS.PINK}>HTTPS</text>
      <text x="0" y="6" textAnchor="middle" fontFamily="monospace"
        fontSize="9" fill={COLORS.PINK}>:{PORT}</text>
      <text x="0" y="18" textAnchor="middle" fontFamily="monospace"
        fontSize="8" fill={COLORS.MUTED}>GET /</text>
    </g>
  )
}

// Edge/Port gate
export const EdgeGate = ({ visible, active }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${ZONES.EDGE.x} ${ZONES.EDGE.y})`}>
      {active && (
        <circle r="65" fill="none" stroke={COLORS.CYAN} strokeWidth="1.5" opacity="0.3">
          <animate attributeName="r" values="60;75;60" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0;0.3" dur="1.8s" repeatCount="indefinite" />
        </circle>
      )}
      <rect x="-70" y="-50" width="140" height="100" rx="12"
        fill={COLORS.LIGHT} stroke={COLORS.CYAN} strokeWidth={active ? 2.5 : 2} />
      <rect x="-50" y="-30" width="100" height="20" rx="4"
        fill={COLORS.DEEP} stroke={COLORS.CYAN} strokeWidth="1.5" />
      <text x="0" y="-14" textAnchor="middle" fontFamily="monospace"
        fontWeight="700" fontSize="13" fill={COLORS.CYAN}>:{PORT}</text>
      <text x="0" y="20" textAnchor="middle" fontFamily="monospace"
        fontWeight="700" fontSize="11" fill={COLORS.CYAN}>EDGE</text>
      <text x="0" y="35" textAnchor="middle" fontFamily="monospace"
        fontSize="9" fill={COLORS.MUTED}>Server Entry</text>
    </g>
  )
}

// Proxy gate
export const ProxyGate = ({ visible, active }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${ZONES.PROXY.x} ${ZONES.PROXY.y})`}>
      {active && (
        <circle r="65" fill="none" stroke={COLORS.ORANGE} strokeWidth="1.5" opacity="0.3">
          <animate attributeName="r" values="60;75;60" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0;0.3" dur="1.8s" repeatCount="indefinite" />
        </circle>
      )}
      <rect x="-70" y="-50" width="140" height="100" rx="12"
        fill={COLORS.LIGHT} stroke={COLORS.ORANGE} strokeWidth={active ? 2.5 : 2} />
      <circle cx="0" cy="-10" r="15" fill="none" stroke={COLORS.ORANGE} strokeWidth="2.5" />
      <circle cx="0" cy="-10" r="5" fill={COLORS.ORANGE} />
      <text x="0" y="20" textAnchor="middle" fontFamily="monospace"
        fontWeight="700" fontSize="12" fill={COLORS.ORANGE}>PROXY</text>
      <text x="0" y="35" textAnchor="middle" fontFamily="monospace"
        fontSize="9" fill={COLORS.MUTED}>Routing Layer</text>
    </g>
  )
}

// Backend application
export const BackendApp = ({ visible, active, label, x, y }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${x} ${y})`}>
      {active && (
        <circle r="55" fill="none" stroke={COLORS.GREEN} strokeWidth="1.3" opacity="0.3">
          <animate attributeName="r" values="50;65;50" dur="1.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0;0.3" dur="1.6s" repeatCount="indefinite" />
        </circle>
      )}
      <rect x="-60" y="-40" width="120" height="80" rx="10"
        fill={COLORS.LIGHT} stroke={COLORS.GREEN} strokeWidth={active ? 2.5 : 2} />
      <circle cx="0" cy="-8" r="12" fill="none" stroke={COLORS.GREEN} strokeWidth="2" />
      <circle cx="0" cy="-8" r="4" fill={COLORS.GREEN} />
      <text x="0" y="18" textAnchor="middle" fontFamily="monospace"
        fontWeight="700" fontSize="11" fill={COLORS.GREEN}>{label}</text>
      <text x="0" y="32" textAnchor="middle" fontFamily="monospace"
        fontSize="8" fill={COLORS.MUTED}>Backend</text>
    </g>
  )
}

// Response capsule
export const ResponseCapsule = ({ visible, x, y }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-40" y="-40" width="80" height="80" rx="12"
        fill={COLORS.MINT} fillOpacity="0.15"
        stroke={COLORS.MINT} strokeWidth="2.5" />
      <rect x="-30" y="-20" width="60" height="8" rx="3"
        fill={COLORS.MINT} opacity="0.7" />
      <rect x="-30" y="-8" width="45" height="8" rx="3"
        fill={COLORS.MINT} opacity="0.5" />
      <rect x="-30" y="4" width="50" height="8" rx="3"
        fill={COLORS.MINT} opacity="0.5" />
      <text x="0" y="26" textAnchor="middle" fontFamily="monospace"
        fontSize="9" fill={COLORS.MINT}>200 OK</text>
    </g>
  )
}

// Routing beam (visual connection from proxy to backend)
export const RoutingBeam = ({ visible, fromX, fromY, toX, toY, color }) => {
  if (!visible) return null
  return (
    <line x1={fromX} y1={fromY} x2={toX} y2={toY}
      stroke={color} strokeWidth="3" opacity="0.6" strokeDasharray="8 4">
      <animate attributeName="stroke-dashoffset" from="0" to="24"
        dur="0.8s" repeatCount="indefinite" />
    </line>
  )
}

// Connection line (dashed, static)
export const ConnectionLine = ({ x1, y1, x2, y2, color, opacity = 0.3 }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2}
    stroke={color} strokeWidth="1.5" strokeDasharray="5 3" opacity={opacity} />
)

/** Spine lengkap (5 connection line) — persisten lintas-act, dipakai oleh
 * Act mana pun yang aktif saat `spineVisible` true (hanya Act 4 pada
 * timeline saat ini). Dipisah supaya tidak duplikat 5 baris di tiap file. */
export const Spine = ({ visible }) => {
  if (!visible) return null
  return (
    <g opacity="0.4">
      <ConnectionLine x1={ZONES.BROWSER.x} y1={ZONES.BROWSER.y + 40}
        x2={ZONES.DNS.x} y2={ZONES.DNS.y + 35} color={COLORS.PURPLE} />
      <ConnectionLine x1={ZONES.BROWSER.x} y1={ZONES.BROWSER.y + 40}
        x2={ZONES.EDGE.x} y2={ZONES.EDGE.y - 50} color={COLORS.CYAN} />
      <ConnectionLine x1={ZONES.EDGE.x} y1={ZONES.EDGE.y + 50}
        x2={ZONES.PROXY.x} y2={ZONES.PROXY.y - 50} color={COLORS.ORANGE} />
      <ConnectionLine x1={ZONES.PROXY.x} y1={ZONES.PROXY.y + 50}
        x2={ZONES.BACKEND_A.x} y2={ZONES.BACKEND_A.y - 40} color={COLORS.GREEN} />
      <ConnectionLine x1={ZONES.PROXY.x} y1={ZONES.PROXY.y + 50}
        x2={ZONES.BACKEND_B.x} y2={ZONES.BACKEND_B.y - 40} color={COLORS.GREEN} opacity={0.2} />
    </g>
  )
}
