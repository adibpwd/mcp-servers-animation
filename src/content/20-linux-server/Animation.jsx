// src/content/91-linux-server/Animation.jsx
// ═══════════════════════════════════════════════════════════════════════════
// REVISI-01 (2026-09-19, revisi/2026-09-19-revisi-01-flow-kausal-icon-chatgpt.md)
// — DISETUJUI & DIEKSEKUSI, satu video 122s. Mengganti storyboard ChipRow
// lama dengan satu kasus berjalan: toko.example (toko-web) yang hidup di
// server, dibuka pelanggan, bisa mati, menyimpan data, dipantau, diperbarui,
// dan dipulihkan. Tidak ada ChipRow/CaptionBar/say() — caption menempel di
// objek (IconCaption/PathLabel), satu Case Strip per Act.
//
// Persistent anchor (Continuity §1.O): SERVER_ANCHOR (366,640), settle akhir
// Act 1, tidak pernah dihapus sampai Act 7 (hanya glow/badge/LED berubah).
// Client (110,120) persisten Act 1-6 (mengecil+redup di Act 4).
//
// Icon: hibrid PNG+SVG (lihat data.js komentar atas). 28 PNG BELUM
// digenerate (icons/icons.json siap, menunggu extension vm-icon-generator
// dijalankan manual oleh user) — komponen Icon di bawah SELALU fallback ke
// kotak dashed berlabel saat getIcon(id) null, tidak pernah crash.
//
// CATATAN EKSEKUSI: kode+data ditulis sekali jalan mengikuti storyboard
// revisi §6, BELUM preview manual/export test. Durasi Act di PHASES adalah
// estimasi revisi §3.6, WAJIB diukur ulang dari timeline nyata.
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, SFX_MAP, BODY_CENTER_X,
  CLIENT_STATION, SERVER_ANCHOR, APP_TILE_DOCKED, APP_TILE_SOURCE,
  DNS_STATION, CLOUD_STATION, ROUTER_HOP_STATIONS, FIREWALL_STATION,
  RULES_CARD_STATION, LISTEN_SOCKET_STATION, SERVICE_MANAGER_STATION,
  PROCESS_SHELF, IDENTITY_COLUMN, ACCESS_GATE_STATION,
  DATA_VAULT_ACT4, DATA_VAULT_ACT6, PERMISSION_CARD_STATION,
  MONITOR_DASHBOARD_STATION, LOG_SCROLL_STATION, HEALTH_PROBE_STATION,
  ALERT_BELL_STATION, STAGING_PAD_STATION, RELEASE_STACK_STATION,
  BACKUP_VAULT_STATION, RESTORE_AREA_STATION, RUNBOOK_STATION,
  PILLAR_STATIONS, FOUR_MACHINES_Y, FOUR_MACHINES_X,
  COMPUTE_FORMS, CASE_INFO, CASE_STRIP, BEATS, POSTURE_PILLARS,
  INTRO_CATEGORY_LABEL, INTRO_DOMAIN, INTRO_TITLE_A, INTRO_TITLE_B, INTRO_SUBTITLE,
  BREADCRUMB_STEPS,
} from './data'
import { getIcon } from './icons/loader'
import sfxLoader from '../../shared/audio/sfxLoader'
import { IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1 } from '../../shared/scene-ui/v1'

// ── Icon — PNG kalau sudah ada (getIcon), fallback kotak dashed
// berlabel kalau belum (icons/icons.json belum digenerate). TIDAK
// PERNAH crash tanpa PNG (revisi §9.3). ──
// ── SVG_ICONS — pictogram inline untuk icon Batch 4 yang PNG-nya masih
// DITAHAN (background bukan transparan, lihat icons/loader.js). Dipakai
// Icon sebagai fallback KEDUA: PNG (kalau sudah di-wire) -> SVG inline ->
// kotak dashed berlabel. Tiap entry: viewBox lokal (vw x vh, berpusat di
// 0,0) + fungsi gambar(c = warna). Saat PNG batch-4 sudah transparan dan
// di-uncomment di loader.js, PNG otomatis menggantikan SVG ini. ──
const SVG_ICONS = {
  // Landasan uji (staging): slab + zona uji putus-putus + tiang + LED
  'staging-pad': {
    vw: 130, vh: 80,
    draw: (c) => (
      <g fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <rect x="-56" y="12" width="112" height="16" rx="5" fill={c} fillOpacity="0.12" />
        <line x1="-40" y1="28" x2="-40" y2="36" />
        <line x1="40" y1="28" x2="40" y2="36" />
        <rect x="-44" y="-34" width="88" height="42" rx="8" strokeDasharray="6 5" />
        <path d="M -44,-22 L -44,-34 L -32,-34" />
        <path d="M 44,-22 L 44,-34 L 32,-34" />
        <circle cx="-38" cy="20" r="2" fill={c} stroke="none" />
        <circle cx="-30" cy="20" r="2" fill={c} stroke="none" />
      </g>
    ),
  },
  // Paket rilis: kotak + tutup + pita
  'release-package': {
    vw: 60, vh: 44,
    draw: (c) => (
      <g fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <rect x="-24" y="-16" width="48" height="34" rx="5" fill={c} fillOpacity="0.12" />
        <line x1="-24" y1="-6" x2="24" y2="-6" />
        <line x1="0" y1="-16" x2="0" y2="-6" />
        <line x1="-14" y1="8" x2="-2" y2="8" />
      </g>
    ),
  },
  // Backup: pintu vault + dial + salinan (bayangan putus-putus di belakang)
  'backup-vault': {
    vw: 100, vh: 100,
    draw: (c) => (
      <g fill="none" stroke={c} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="-32" y="-46" width="76" height="76" rx="11" strokeDasharray="5 5" opacity="0.5" />
        <rect x="-40" y="-38" width="76" height="76" rx="11" fill={c} fillOpacity="0.12" />
        <circle cx="-2" cy="0" r="21" />
        <circle cx="-2" cy="0" r="6" fill={c} stroke="none" />
        <line x1="-2" y1="-21" x2="-2" y2="-13" />
        <line x1="-2" y1="13" x2="-2" y2="21" />
        <line x1="-23" y1="0" x2="-15" y2="0" />
        <line x1="11" y1="0" x2="19" y2="0" />
        <circle cx="-30" cy="-28" r="2" fill={c} stroke="none" />
        <circle cx="26" cy="-28" r="2" fill={c} stroke="none" />
        <circle cx="-30" cy="28" r="2" fill={c} stroke="none" />
        <circle cx="26" cy="28" r="2" fill={c} stroke="none" />
      </g>
    ),
  },
  // Restore: panah melingkar berlawanan jarum jam + jam di tengah
  'restore-cycle': {
    vw: 64, vh: 64,
    draw: (c) => (
      <g fill="none" stroke={c} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M 16,-16 A 22,22 0 1 0 22,4" />
        <path d="M 22,4 L 16,10" />
        <path d="M 22,4 L 28,10" />
        <path d="M 0,-9 L 0,0 L 7,5" />
      </g>
    ),
  },
  // Runbook: dokumen dengan lipatan + tiga baris checklist
  'runbook-doc': {
    vw: 80, vh: 100,
    draw: (c) => (
      <g fill="none" stroke={c} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M -28,-44 L 12,-44 L 28,-28 L 28,44 L -28,44 Z" fill={c} fillOpacity="0.12" />
        <path d="M 12,-44 L 12,-28 L 28,-28" />
        {[-12, 8, 28].map((y) => (
          <g key={y}>
            <rect x="-19" y={y - 4} width="8" height="8" rx="2" />
            <line x1="-5" y1={y} x2="18" y2={y} />
          </g>
        ))}
      </g>
    ),
  },
  // CPU chip: die + inti + pin di keempat sisi
  'cpu-chip': {
    vw: 56, vh: 56,
    draw: (c) => (
      <g fill="none" stroke={c} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <rect x="-15" y="-15" width="30" height="30" rx="5" fill={c} fillOpacity="0.12" />
        <rect x="-7" y="-7" width="14" height="14" rx="2" />
        {[-8, 0, 8].map((v) => (
          <g key={v}>
            <line x1={v} y1="-15" x2={v} y2="-23" />
            <line x1={v} y1="15" x2={v} y2="23" />
            <line x1="-15" y1={v} x2="-23" y2={v} />
            <line x1="15" y1={v} x2="23" y2={v} />
          </g>
        ))}
      </g>
    ),
  },
  // Dashboard metrics: layar + grid + batang + garis tren
  'monitor-dashboard': {
    vw: 320, vh: 140,
    draw: (c) => (
      <g fill="none" stroke={c} strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round">
        <rect x="-150" y="-64" width="300" height="110" rx="12" fill={c} fillOpacity="0.08" />
        <line x1="0" y1="46" x2="0" y2="62" />
        <line x1="-32" y1="64" x2="32" y2="64" />
        <line x1="-130" y1="-24" x2="130" y2="-24" strokeWidth="1" opacity="0.35" />
        <line x1="-130" y1="4" x2="130" y2="4" strokeWidth="1" opacity="0.35" />
        {[[-126, 14], [-104, 26], [-82, 8], [-60, 32]].map(([bx, bh]) => (
          <rect key={bx} x={bx} y={34 - bh} width="12" height={bh} rx="2" fill={c} fillOpacity="0.5" stroke="none" />
        ))}
        <polyline points="-30,20 -6,0 18,10 50,-18 84,-6 122,-40" />
        <circle cx="122" cy="-40" r="4" fill={c} stroke="none" />
      </g>
    ),
  },
}

const Icon = ({ id, x, y, w = 64, h = 48, color = COLORS.MUTED, label }) => {
  const src = getIcon(id)
  const svgDef = !src ? SVG_ICONS[id] : null
  const svgScale = svgDef ? Math.min(w / svgDef.vw, h / svgDef.vh) : 1
  return (
    <g transform={`translate(${x} ${y})`}>
      {src ? (
        <image href={src} x={-w / 2} y={-h / 2} width={w} height={h} />
      ) : svgDef ? (
        <g transform={`scale(${svgScale})`}>{svgDef.draw(color)}</g>
      ) : (
        <>
          <rect x={-w / 2} y={-h / 2} width={w} height={h} rx="10"
            fill={COLORS.PANEL} stroke={color} strokeWidth="1.6" strokeDasharray="4 4" />
          {label && (
            <text x="0" y="4" textAnchor="middle" fontFamily="monospace" fontWeight="700"
              fontSize="11" fill={color}>{label}</text>
          )}
        </>
      )}
    </g>
  )
}

// ── IconCaption — label menempel di bawah sebuah objek (bukan CaptionBar
// global). ≤5 kata, pernyataan, font ≥12 (revisi §3.4). ──
const IconCaption = ({ x, y, text, color = COLORS.TEXT, visible = true }) => {
  if (!text || !visible) return null
  return (
    <text x={x} y={y} textAnchor="middle" fontFamily="monospace" fontWeight="700"
      fontSize="12" fill={color} stroke={COLORS.BG} strokeWidth="4" paintOrder="stroke">{text}</text>
  )
}

// ── PathLabel — label kecil menempel di sebuah jalur/garis. Font ≥11. ──
const PathLabel = ({ x, y, text, color = COLORS.MUTED }) => {
  if (!text) return null
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x={-text.length * 3.2 - 6} y="-9" width={text.length * 6.4 + 12} height="18" rx="9"
        fill={COLORS.PANEL} stroke={color} strokeWidth="1" opacity="0.95" />
      <text x="0" y="4" textAnchor="middle" fontFamily="monospace" fontWeight="700"
        fontSize="11" fill={color}>{text}</text>
    </g>
  )
}

// ── CaseStrip — satu-satunya channel kalimat kasus per Act (y 0-44,
// revisi §3.2). ──
const CaseStrip = ({ text }) => {
  if (!text) return null
  return (
    <g transform={`translate(${BODY_CENTER_X} 22)`}>
      <rect x="-320" y="-18" width="640" height="36" rx="18" fill={COLORS.PANEL}
        stroke={COLORS.BORDER} strokeWidth="1.4" opacity="0.96" />
      <text x="0" y="5" textAnchor="middle" fontFamily="monospace" fontWeight="700"
        fontSize="14" fill={COLORS.TEXT}>{text}</text>
    </g>
  )
}

// ── PacketCapsule — paket/kapsul yang bergerak dari `from` ke `to`
// sepanjang progress 0..1 (linear interpolate). Dipakai untuk request,
// query DNS, kapsul identitas, snapshot backup, dsb. ──
const PacketCapsule = ({ from, to, progress, color = COLORS.CLIENT, label }) => {
  if (progress <= 0) return null
  const x = from.x + (to.x - from.x) * progress
  const y = from.y + (to.y - from.y) * progress
  return (
    <g transform={`translate(${x} ${y})`}>
      <circle r="10" fill={color} opacity="0.95" />
      <circle r="16" fill="none" stroke={color} strokeWidth="1.2" opacity="0.4" />
      {label && (
        <text x="0" y="-18" textAnchor="middle" fontFamily="monospace" fontWeight="700"
          fontSize="11" fill={color}>{label}</text>
      )}
    </g>
  )
}

// ── ServerAnchorIcon — persistent anchor (366,640), Act 1 settle → Act 7.
// Hanya glow/badge/LED yang berubah, objek ini sendiri tidak pernah
// dihapus (Continuity §1.O). ──
const ServerAnchorIcon = ({ settled, glow = 0, ledColor, badge, scale = 1, opacity = 1 }) => {
  if (!settled) return null
  return (
    <g transform={`translate(${SERVER_ANCHOR.x} ${SERVER_ANCHOR.y}) scale(${scale})`} opacity={opacity}>
      {glow > 0 && (
        <circle r="58" fill="none" stroke={COLORS.SERVICE} strokeWidth="1.4" opacity={glow * 0.5}>
          <animate attributeName="r" values="50;66;50" dur="1.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0;0.4" dur="1.6s" repeatCount="indefinite" />
        </circle>
      )}
      <Icon id="server-rack" x={0} y={0} w={92} h={92} color={COLORS.SERVICE} label="SERVER" />
      {ledColor && <circle cx="30" cy="-30" r="5" fill={ledColor} />}
      {badge && (
        <g transform="translate(0 62)">
          <rect x="-72" y="-13" width="144" height="26" rx="13" fill={COLORS.PANEL_ALT} stroke={COLORS.SERVICE} strokeWidth="1.2" />
          <text x="0" y="4" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="11" fill={COLORS.SERVICE}>{badge}</text>
        </g>
      )}
    </g>
  )
}

// ── AppTile — kartu toko-web, berpindah antar station (source → docked
// di anchor → process shelf → kembali). ──
const AppTile = ({ pos, status = 'stopped', version = 'v1', visible = true }) => {
  if (!visible) return null
  const statusColor = status === 'running' ? COLORS.SUCCESS : status === 'crashed' ? COLORS.RISK : COLORS.MUTED
  return (
    <g transform={`translate(${pos.x} ${pos.y})`}>
      <Icon id="web-app-card" x={0} y={0} w={64} h={48} color={statusColor} label="APP" />
      <circle cx="24" cy="-18" r="4" fill={statusColor} />
      <text x="0" y="34" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="11" fill={COLORS.MUTED}>{version}</text>
    </g>
  )
}

// ── ClientPhone — persistent client (Act 1-6). Address bar + chip IP
// digambar DI BAWAH ponsel supaya teks terbaca (font >= 11). page: 'ok'|'err'|null. ──
const ClientPhone = ({ pos, scale = 1, opacity = 1, addr, ipChip, page }) => (
  <g transform={`translate(${pos.x} ${pos.y}) scale(${scale})`} opacity={opacity}>
    <Icon id="client-phone" x={0} y={0} w={72} h={110} color={COLORS.CLIENT} label="CLIENT" />
    {page === 'ok' && (
      <text x="0" y="8" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="24" fill={COLORS.SUCCESS}>✓</text>
    )}
    {page === 'err' && (
      <text x="0" y="8" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="24" fill={COLORS.RISK}>✕</text>
    )}
    {addr != null && (
      <g transform="translate(0 76)">
        <rect x="-75" y="-11" width="150" height="22" rx="11" fill={COLORS.PANEL_ALT} stroke={COLORS.CLIENT} strokeWidth="1.2" />
        <text x="-62" y="4" fontFamily="monospace" fontSize="12" fill={COLORS.CLIENT}>{addr}</text>
      </g>
    )}
    {ipChip && (
      <g transform="translate(0 104)">
        <rect x="-75" y="-10" width="150" height="20" rx="10" fill={COLORS.PANEL_ALT} stroke={COLORS.DNS} strokeWidth="1.2"
          strokeDasharray={ipChip === 'unknown' ? '3 3' : undefined} />
        <text x="0" y="4" textAnchor="middle" fontFamily="monospace" fontSize="11" fill={COLORS.DNS}>
          {ipChip === 'unknown' ? 'IP: belum diketahui' : ipChip}
        </text>
      </g>
    )}
  </g>
)

// ── DnsBook — lookup samping (BUKAN node yang dilewati paket, revisi
// §3.5/§6.2). Satu baris record menyala saat query tiba. ──
const DnsBook = ({ visible, resolved }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${DNS_STATION.x} ${DNS_STATION.y})`}>
      <Icon id="dns-book" x={0} y={0} w={90} h={72} color={COLORS.DNS} label="DNS" />
      {resolved && (
        <g transform="translate(0 46)">
          <rect x="-104" y="-11" width="208" height="22" rx="6" fill={COLORS.PANEL_ALT} stroke={COLORS.DNS} strokeWidth="1.2" />
          <text x="0" y="4" textAnchor="middle" fontFamily="monospace" fontSize="11" fill={COLORS.DNS}>{CASE_INFO.domain} → {CASE_INFO.ip}</text>
        </g>
      )}
    </g>
  )
}

// ── RulesCard — 3 baris port firewall, satu baris cocok saat scan lewat. ──
const RulesCard = ({ visible, scanRow, matchedRow }) => {
  if (!visible) return null
  const rows = [{ port: '443', name: 'web' }, { port: '22', name: 'ssh' }, { port: '3306', name: 'database' }]
  return (
    <g transform={`translate(${RULES_CARD_STATION.x} ${RULES_CARD_STATION.y})`}>
      <rect x="-96" y="-56" width="192" height="112" rx="12" fill={COLORS.PANEL} stroke={COLORS.EDGE} strokeWidth="1.6" />
      {rows.map((r, i) => {
        const y = -30 + i * 30
        const matched = matchedRow === i
        const scanning = scanRow === i
        const rowColor = matched ? COLORS.SUCCESS : COLORS.MUTED
        return (
          <g key={r.port} transform={`translate(0 ${y})`}>
            <rect x="-84" y="-11" width="168" height="22" rx="6" fill={COLORS.PANEL_ALT}
              stroke={scanning ? COLORS.EDGE : rowColor} strokeWidth={scanning ? 2 : 1.2} />
            <text x="-70" y="4" fontFamily="monospace" fontWeight="700" fontSize="11" fill={rowColor}>{r.port}</text>
            <text x="-30" y="4" fontFamily="monospace" fontSize="11" fill={COLORS.MUTED}>{r.name}</text>
            <text x="60" y="4" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="11" fill={rowColor}>
              {matched ? 'ALLOW' : i === 0 ? '' : 'CLOSED'}
            </text>
          </g>
        )
      })}
    </g>
  )
}

// ── FirewallGate — palang naik saat port cocok (revisi §6.2). ──
const FirewallGate = ({ visible, open }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${FIREWALL_STATION.x} ${FIREWALL_STATION.y})`}>
      <Icon id="firewall-wall" x={0} y={0} w={160} h={80} color={COLORS.EDGE} label="FIREWALL" />
      {/* palang menutup pintu tembok (glyph hasil trim: pintu ±10 x, y +9..+36); terbuka = naik ke lintel */}
      <rect x="-9" y="10" width="18" height={open ? 5 : 26} rx="2" fill={open ? COLORS.SUCCESS : COLORS.EDGE} opacity="0.95" />
    </g>
  )
}

// ── ListenSocket — pintu masuk di anchor, menyala saat paket docking. ──
const ListenSocket = ({ visible, active }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${LISTEN_SOCKET_STATION.x} ${LISTEN_SOCKET_STATION.y})`}>
      <Icon id="listening-socket" x={0} y={0} w={56} h={40} color={active ? COLORS.SUCCESS : COLORS.SERVICE} label="443" />
      {active && (
        <circle r="34" fill="none" stroke={COLORS.SUCCESS} strokeWidth="1.2" opacity="0.5">
          <animate attributeName="r" values="30;40;30" dur="1s" repeatCount="indefinite" />
        </circle>
      )}
    </g>
  )
}

// ── ServiceManagerPanel — Act 3: manager + dependency chain. ──
const ServiceManagerPanel = ({ visible, dependencyOn, appOn }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${SERVICE_MANAGER_STATION.x} ${SERVICE_MANAGER_STATION.y})`}>
      <Icon id="service-manager" x={0} y={0} w={120} h={90} color={COLORS.SERVICE} label="MANAGER" />
      <g transform="translate(0 60)">
        <circle cx="-30" cy="0" r="7" fill={dependencyOn ? COLORS.SUCCESS : COLORS.BORDER} />
        <path d="M-22,0 L-8,0" stroke={COLORS.MUTED} strokeWidth="1.6" markerEnd="url(#arrow91)" />
        <circle cx="0" cy="0" r="7" fill={appOn ? COLORS.SUCCESS : COLORS.BORDER} />
      </g>
    </g>
  )
}

// ── ProcessTile — database / app di process shelf, Act 3. ──
const ProcessTile = ({ pos, label, status, id }) => (
  <g transform={`translate(${pos.x} ${pos.y})`}>
    <Icon id={id} x={0} y={0} w={80} h={56} color={status === 'running' ? COLORS.SUCCESS : status === 'crashed' ? COLORS.RISK : COLORS.MUTED} label={label} />
    <circle cx="30" cy="-20" r="4" fill={status === 'running' ? COLORS.SUCCESS : status === 'crashed' ? COLORS.RISK : COLORS.BORDER} />
  </g>
)

// ── ResourceBars — CPU/memory di bawah process tile. ──
const ResourceBars = ({ pos, visible, cpu = 0, mem = 0 }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${pos.x} ${pos.y + 46})`}>
      <rect x="-36" y="-4" width="72" height="8" rx="4" fill={COLORS.PANEL_ALT} />
      <rect x="-36" y="-4" width={72 * cpu} height="8" rx="4" fill={COLORS.SERVICE} />
      <rect x="-36" y="10" width="72" height="8" rx="4" fill={COLORS.PANEL_ALT} />
      <rect x="-36" y="10" width={72 * mem} height="8" rx="4" fill={COLORS.IDENTITY} />
    </g>
  )
}

// ── IdentityCard — Act 4: service account / admin / guest. ──
const IdentityCard = ({ pos, iconId, label, sublabel, visible }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${pos.x} ${pos.y})`}>
      <Icon id={iconId} x={0} y={0} w={110} h={70} color={COLORS.IDENTITY} label={label} />
      {sublabel && (
        <text x="0" y="46" textAnchor="middle" fontFamily="monospace" fontSize="11" fill={COLORS.MUTED}>{sublabel}</text>
      )}
    </g>
  )
}

// ── AccessGate — 4 state EKSPLISIT: closed, checking, granted, denied.
// FIX bug lama: state "checking"/"request" TIDAK PERNAH merender merah
// (revisi §6.4 catatan bug). ──
const AccessGate = ({ state }) => {
  if (state === 'hidden') return null
  const color = state === 'granted' ? COLORS.SUCCESS : state === 'denied' ? COLORS.RISK
    : state === 'checking' ? COLORS.EDGE : COLORS.MUTED
  const label = state === 'granted' ? 'GRANTED' : state === 'denied' ? 'DENIED'
    : state === 'checking' ? 'CHECKING' : 'CLOSED'
  return (
    <g transform={`translate(${ACCESS_GATE_STATION.x} ${ACCESS_GATE_STATION.y})`}>
      <rect x="-30" y="-50" width="60" height="100" rx="10" fill={COLORS.PANEL} stroke={color} strokeWidth="2" />
      {/* gembok inline: tertutup (closed/checking/denied) atau terbuka (granted) */}
      <g fill="none" stroke={color} strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <path d={state === 'granted' ? 'M -9,-4 L -9,-20 A 9,9 0 0 1 9,-20 L 9,-15' : 'M -9,-4 L -9,-15 A 9,9 0 0 1 9,-15 L 9,-4'} />
        <rect x="-15" y="-4" width="30" height="24" rx="5" fill={color} fillOpacity="0.14" />
        <circle cx="0" cy="8" r="2.6" fill={color} stroke="none" />
        <line x1="0" y1="10" x2="0" y2="14" />
        {state === 'checking' && (
          <circle r="27" cy="2" strokeWidth="2" strokeDasharray="6 8" opacity="0.8">
            <animateTransform attributeName="transform" type="rotate" from="0 0 2" to="360 0 2" dur="1.6s" repeatCount="indefinite" />
          </circle>
        )}
        {state === 'granted' && <path d="M -8,34 L -2,40 L 9,28" />}
        {state === 'denied' && <path d="M -7,28 L 7,40 M 7,28 L -7,40" />}
      </g>
      <text x="0" y="66" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="11" fill={color}>{label}</text>
    </g>
  )
}

// ── DataVault — data pesanan, Act 4 posisi lalu pindah ke Act 6. ──
const DataVault = ({ pos, tested }) => (
  <g transform={`translate(${pos.x} ${pos.y})`}>
    <Icon id="data-vault" x={0} y={0} w={100} h={100} color={COLORS.DATA} label="DATA" />
    {tested === false && (
      <rect x="-44" y="42" width="88" height="16" rx="8" fill="none" stroke={COLORS.MUTED} strokeWidth="1" strokeDasharray="3 2" />
    )}
    {tested === true && (
      <text x="0" y="54" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="14" fill={COLORS.SUCCESS}>✓</text>
    )}
  </g>
)

// ── PermissionCard — 3 baris izin per identitas, Act 4. ──
const PermissionCard = ({ visible, rows }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${PERMISSION_CARD_STATION.x} ${PERMISSION_CARD_STATION.y})`}>
      <rect x="-100" y="-52" width="200" height="104" rx="12" fill={COLORS.PANEL} stroke={COLORS.IDENTITY} strokeWidth="1.6" />
      {rows.map((r, i) => (
        <g key={r.who} transform={`translate(0 ${-26 + i * 26})`} opacity={r.shown ? 1 : 0}>
          <text x="-88" y="4" fontFamily="monospace" fontWeight="700" fontSize="11" fill={COLORS.IDENTITY}>{r.who}</text>
          <text x="60" y="4" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="11" fill={COLORS.TEXT}>{r.perm}</text>
        </g>
      ))}
    </g>
  )
}

// ── LogScroll — Act 5: baris log bertambah, warna sesuai status. ──
const LogScroll = ({ visible, rows }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${LOG_SCROLL_STATION.x} ${LOG_SCROLL_STATION.y})`}>
      <Icon id="log-scroll" x={0} y={-30} w={80} h={40} color={COLORS.OBSERVE} label="LOGS" />
      {rows.map((r, i) => (
        <text key={i} x="-38" y={0 + i * 14} fontFamily="monospace" fontSize="11"
          fill={r.level === 'error' ? COLORS.RISK : r.level === 'warn' ? COLORS.WARNING : COLORS.MUTED}>
          {r.text}
        </text>
      ))}
    </g>
  )
}

// ── MetricPanel — 3 garis (latency, error, cpu) + threshold. Act 5. ──
const MetricPanel = ({ visible, linesOn = false, spike, thresholdCross }) => {
  if (!visible) return null
  const mk = (base, spikeAmt) => spike ? base + spikeAmt : base
  return (
    <g transform={`translate(${MONITOR_DASHBOARD_STATION.x} ${MONITOR_DASHBOARD_STATION.y})`}>
      <Icon id="monitor-dashboard" x={0} y={0} w={320} h={140} color={COLORS.OBSERVE} label="METRICS" />
      {linesOn && (
        <g transform="translate(-140 40)">
          <line x1="0" y1="0" x2="280" y2="0" stroke={COLORS.BORDER} strokeWidth="1" strokeDasharray="3 3" />
          <polyline points={`0,10 60,${10-mk(2,20)} 140,${10-mk(4,26)} 210,${10-mk(2,18)} 280,${10-mk(0,4)}`}
            fill="none" stroke={COLORS.RISK} strokeWidth="1.6" />
          <polyline points={`0,30 60,${30-mk(2,14)} 140,${30-mk(3,18)} 210,${30-mk(1,10)} 280,30`}
            fill="none" stroke={COLORS.WARNING} strokeWidth="1.6" />
        </g>
      )}
      {thresholdCross && (
        <text x="0" y="60" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="11" fill={COLORS.RISK}>threshold terlewati</text>
      )}
    </g>
  )
}

// ── HealthProbe — probe berdenyut ke anchor, OK/DEGRADED. Act 5. ──
const HealthProbe = ({ visible, ok }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${HEALTH_PROBE_STATION.x} ${HEALTH_PROBE_STATION.y})`}>
      <Icon id="server-rack" x={0} y={0} w={56} h={56} color={ok ? COLORS.SUCCESS : COLORS.RISK} label="PROBE" />
      <circle cx="0" cy="0" r="30" fill="none" stroke={ok ? COLORS.SUCCESS : COLORS.RISK} strokeWidth="1.2" opacity="0.5">
        <animate attributeName="r" values="26;36;26" dur="1s" repeatCount="indefinite" />
      </circle>
    </g>
  )
}

// ── AlertBell — muncul dari titik threshold, berguncang. Act 5. ──
const AlertBell = ({ visible }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${ALERT_BELL_STATION.x} ${ALERT_BELL_STATION.y})`}>
      <Icon id="alert-bell" x={0} y={0} w={56} h={56} color={COLORS.RISK} label="ALERT" />
    </g>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// Helper geometri + komponen generik (Pulse, PathLine, Chip, CaptionLayer)
// ═══════════════════════════════════════════════════════════════════════════
const lerp = (a, b, t) => a + (b - a) * t
const lerpPt = (a, b, t) => ({ x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) })
const P = (x, y) => ({ x, y })

// Titik pada polyline `pts` di progress 0..1 (berdasar panjang kumulatif).
const pointOn = (pts, p) => {
  const t = Math.max(0, Math.min(1, p))
  const lens = []
  let total = 0
  for (let i = 1; i < pts.length; i++) {
    const l = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y)
    lens.push(l)
    total += l
  }
  let d = t * total
  for (let i = 0; i < lens.length; i++) {
    if (d <= lens[i] || i === lens.length - 1) {
      const k = lens[i] === 0 ? 0 : Math.min(1, d / lens[i])
      return lerpPt(pts[i], pts[i + 1], k)
    }
    d -= lens[i]
  }
  return pts[0]
}

// Polyline parsial dari awal sampai progress p (untuk garis yang "tumbuh").
const partialPoints = (pts, p) => {
  const t = Math.max(0, Math.min(1, p))
  if (t <= 0) return ''
  const lens = []
  let total = 0
  for (let i = 1; i < pts.length; i++) {
    const l = Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y)
    lens.push(l)
    total += l
  }
  let d = t * total
  const out = [`${pts[0].x},${pts[0].y}`]
  for (let i = 0; i < lens.length; i++) {
    if (d >= lens[i]) {
      out.push(`${pts[i + 1].x},${pts[i + 1].y}`)
      d -= lens[i]
    } else {
      const q = lerpPt(pts[i], pts[i + 1], lens[i] === 0 ? 0 : d / lens[i])
      out.push(`${q.x},${q.y}`)
      break
    }
  }
  return out.join(' ')
}

// PathLine — garis jalur yang tumbuh sampai progress p (putus-putus/solid).
const PathLine = ({ pts, p = 1, color = COLORS.MUTED, dashed = false, width = 2, opacity = 1, arrow = false }) => {
  if (p <= 0) return null
  return (
    <polyline points={partialPoints(pts, p)} fill="none" stroke={color} strokeWidth={width}
      strokeDasharray={dashed ? '6 6' : undefined} opacity={opacity} strokeLinejoin="round"
      markerEnd={arrow && p >= 1 ? 'url(#arrow91)' : undefined} />
  )
}

// Pulse — satu pulse bergerak sepanjang `pts`. Pulse = kejadian di jalur
// (query DNS, handshake, request); label menempel di pulse (font >= 11).
const Pulse = ({ pulse }) => {
  if (!pulse) return null
  const q = pointOn(pulse.pts, pulse.p)
  return (
    <g transform={`translate(${q.x} ${q.y})`}>
      <circle r="7" fill={pulse.color} />
      <circle r="13" fill="none" stroke={pulse.color} strokeWidth="1.2" opacity="0.45" />
      {pulse.label && (
        <text x="0" y="-19" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="11"
          fill={pulse.color} stroke={COLORS.BG} strokeWidth="3" paintOrder="stroke">{pulse.label}</text>
      )}
    </g>
  )
}

// Chip — pil kecil berteks (breadcrumb, lifecycle, status). Lebar dari teks.
const Chip = ({ x, y, text, color = COLORS.MUTED, active = true, width }) => {
  const w = width || text.length * 7 + 20
  return (
    <g transform={`translate(${x} ${y})`} opacity={active ? 1 : 0.35}>
      <rect x={-w / 2} y="-11" width={w} height="22" rx="11" fill={COLORS.PANEL_ALT}
        stroke={color} strokeWidth="1.4" />
      <text x="0" y="4" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="11" fill={color}>{text}</text>
    </g>
  )
}

// CaptionLayer — SATU caption aktif menempel di objek (x,y = titik tempel).
// x di-clamp supaya tidak keluar body 732. ≤5 kata, font 12.
const CaptionLayer = ({ cap }) => {
  if (!cap || !cap.text) return null
  const half = cap.text.length * 3.7 + 6
  const x = Math.max(half + 6, Math.min(732 - half - 6, cap.x))
  return <IconCaption x={x} y={cap.y} text={cap.text} color={cap.color || COLORS.TEXT} />
}

// ── RouteChain — breadcrumb Act 2 (revisi-02 §4.3): enam langkah ber-icon
// + label di bawah, dihubungkan panah yang tumbuh. Ringkasan visual dari
// objek yang sudah lewat, bukan objek baru. Langkah `glyph` (nama, IP)
// memakai SVG inline (D2); langkah `iconId` memakai <Icon> (fallback dashed
// bila PNG belum ada). lit = jumlah langkah menyala; arrowP = progres
// panah masuk ke langkah terakhir yang menyala (0..1). ──
const CRUMB_Y = 820
const CRUMB_ICON = 44
const CrumbGlyph = ({ kind, color }) => {
  if (kind === 'address') {
    return (
      <g>
        <rect x="-21" y="-10" width="42" height="20" rx="10" fill={COLORS.PANEL_ALT} stroke={color} strokeWidth="1.8" />
        <circle cx="-11" cy="0" r="3" fill="none" stroke={color} strokeWidth="1.6" />
        <line x1="-4" y1="0" x2="8" y2="0" stroke={color} strokeWidth="2" strokeLinecap="round" opacity="0.6" />
        <line x1="13" y1="-5" x2="13" y2="5" stroke={color} strokeWidth="2" strokeLinecap="round" />
      </g>
    )
  }
  return (
    <g>
      <rect x="-21" y="-12" width="42" height="24" rx="5" fill={COLORS.PANEL_ALT} stroke={color} strokeWidth="1.8" />
      {[-10.5, 0, 10.5].map((sx) => (
        <line key={sx} x1={sx} y1="-8" x2={sx} y2="8" stroke={color} strokeWidth="1.2" opacity="0.5" />
      ))}
      {[-15.75, -5.25, 5.25, 15.75].map((gx) => (
        <g key={gx}>
          <circle cx={gx - 2.4} cy="0" r="1.7" fill={color} />
          <circle cx={gx + 2.4} cy="0" r="1.7" fill={color} />
        </g>
      ))}
    </g>
  )
}

const RouteChain = ({ steps, visible, lit, arrowP }) => {
  if (!visible) return null
  const cx = (i) => 366 + (i - 2.5) * 112
  return (
    <g>
      {steps.map((st, i) => {
        const on = i < lit
        const x = cx(i)
        const gp = i < lit - 1 ? 1 : i === lit - 1 ? arrowP : 0
        return (
          <g key={st.id}>
            {i > 0 && (
              <g>
                <line x1={cx(i - 1) + 28} y1={CRUMB_Y} x2={x - 28} y2={CRUMB_Y}
                  stroke={COLORS.BORDER} strokeWidth="1.6" strokeDasharray="4 4" opacity="0.6" />
                {gp > 0 && (
                  <line x1={cx(i - 1) + 28} y1={CRUMB_Y} x2={cx(i - 1) + 28 + 56 * gp} y2={CRUMB_Y}
                    stroke={st.color} strokeWidth="2" markerEnd={gp >= 1 ? 'url(#arrow91)' : undefined} />
                )}
              </g>
            )}
            <g opacity={on ? 1 : 0.35}>
              {st.glyph ? (
                <g transform={`translate(${x} ${CRUMB_Y})`}><CrumbGlyph kind={st.glyph} color={st.color} /></g>
              ) : (
                <Icon id={st.iconId} x={x} y={CRUMB_Y} w={CRUMB_ICON} h={CRUMB_ICON} color={st.color} label={st.label} />
              )}
              <text x={x} y={CRUMB_Y + 36} textAnchor="middle" fontFamily="monospace" fontWeight="700"
                fontSize="12" fill={on ? st.color : COLORS.MUTED}>{st.label}</text>
            </g>
          </g>
        )
      })}
    </g>
  )
}

// ── MachineNode — satu bentuk compute Act 1 (laptop/VM/cloud/mini-PC).
// Naik dari bawah (rise 0..1), beacon LISTEN saat lit, badge SERVER. ──
const MachineNode = ({ idx, form, rise, lit, badge, conv }) => {
  if (rise <= 0) return null
  const home = { x: FOUR_MACHINES_X[idx], y: FOUR_MACHINES_Y }
  const pos = lerpPt({ x: home.x, y: home.y + 50 * (1 - rise) }, SERVER_ANCHOR, conv)
  const sc = lerp(1, 0.3, conv)
  const op = rise * (1 - conv)
  return (
    <g transform={`translate(${pos.x} ${pos.y}) scale(${sc})`} opacity={op}>
      <Icon id={form.iconId} x={0} y={0} w={110} h={84} color={lit ? COLORS.SUCCESS : COLORS.CLIENT} label={form.label} />
      {lit && (
        <circle r="54" fill="none" stroke={COLORS.SUCCESS} strokeWidth="1.4" opacity="0.5">
          <animate attributeName="r" values="48;60;48" dur="1.4s" repeatCount="indefinite" />
        </circle>
      )}
      <text x="0" y="62" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="12" fill={COLORS.TEXT}>{form.label}</text>
      {lit && <text x="0" y="-52" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="11" fill={COLORS.SUCCESS}>LISTEN</text>}
      {badge && <Chip x={0} y={-72} text="SERVER" color={COLORS.SERVICE} />}
    </g>
  )
}

// ── Act 6 — StagingPad (paket v2 + segel), ReleaseStack (v2/v1 + penunjuk),
// BackupVault (segel/belum diuji), RestoreArea (dua penghitung), Runbook. ──
const StagingPad = ({ visible, slide = 1, sealed, pkgVisible = true }) => {
  if (!visible) return null
  const x = lerp(-70, STAGING_PAD_STATION.x, slide)
  return (
    <g transform={`translate(${x} ${STAGING_PAD_STATION.y})`} opacity={slide}>
      <Icon id="staging-pad" x={0} y={12} w={130} h={80} color={COLORS.MUTED} label="STAGING" />
      {pkgVisible && <Icon id="release-package" x={0} y={-10} w={60} h={44} color={COLORS.EDGE} label="v2" />}
      {pkgVisible && <text x="0" y="-38" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="12" fill={COLORS.EDGE}>v2</text>}
      {sealed && <text x="46" y="-14" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="22" fill={COLORS.SUCCESS}>✓</text>}
    </g>
  )
}

const ReleaseStack = ({ visible, ptr = 0 }) => {
  if (!visible) return null
  const py = lerp(-22, 22, ptr)
  return (
    <g transform={`translate(${RELEASE_STACK_STATION.x} ${RELEASE_STACK_STATION.y})`}>
      <rect x="-45" y="-42" width="90" height="84" rx="10" fill={COLORS.PANEL} stroke={COLORS.EDGE} strokeWidth="1.4" />
      <g opacity={ptr < 0.5 ? 1 : 0.35}>
        <Icon id="release-package" x={16} y={-20} w={44} h={34} color={COLORS.RISK} label="" />
        <text x="-16" y="-16" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="12" fill={ptr < 0.5 ? COLORS.RISK : COLORS.MUTED}>v2</text>
      </g>
      <g opacity={ptr >= 0.5 ? 1 : 0.35}>
        <Icon id="release-package" x={16} y={22} w={44} h={34} color={COLORS.SUCCESS} label="" />
        <text x="-16" y="26" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="12" fill={ptr >= 0.5 ? COLORS.SUCCESS : COLORS.MUTED}>v1</text>
      </g>
      <path d={`M-40,${py} L-30,${py - 5} L-30,${py + 5} Z`} fill={COLORS.EDGE} />
    </g>
  )
}

const BackupVault = ({ visible, tested }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${BACKUP_VAULT_STATION.x} ${BACKUP_VAULT_STATION.y})`}>
      <g opacity={tested ? 1 : 0.6}>
        <Icon id="backup-vault" x={0} y={0} w={100} h={100} color={COLORS.DATA} label="BACKUP" />
      </g>
      {!tested && (
        <rect x="-52" y="-52" width="104" height="104" rx="14" fill="none" stroke={COLORS.MUTED} strokeWidth="1.4" strokeDasharray="5 4" />
      )}
      {tested && <text x="34" y="-32" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="24" fill={COLORS.SUCCESS}>✓</text>}
    </g>
  )
}

const RestoreArea = ({ visible, counters }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${RESTORE_AREA_STATION.x} ${RESTORE_AREA_STATION.y})`}>
      <rect x="-90" y="-55" width="180" height="110" rx="14" fill={COLORS.PANEL_ALT} stroke={COLORS.CLIENT} strokeWidth="1.4" strokeDasharray="5 4" />
      <Icon id="restore-cycle" x="0" y="-8" w={64} h={64} color={COLORS.CLIENT} label="RESTORE" />
      {counters && (
        <g transform="translate(0 38)">
          <text x="-42" y="4" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="12" fill={COLORS.TEXT}>120</text>
          <text x="0" y="4" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="14" fill={counters === 'equal' ? COLORS.SUCCESS : COLORS.MUTED}>{counters === 'equal' ? '=' : '?'}</text>
          <text x="42" y="4" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="12" fill={COLORS.TEXT}>120</text>
        </g>
      )}
    </g>
  )
}

const RunbookDoc = ({ visible, ticks = 0 }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${RUNBOOK_STATION.x} ${RUNBOOK_STATION.y})`}>
      <Icon id="runbook-doc" x={0} y={0} w={80} h={100} color={COLORS.IDENTITY} label="RUNBOOK" />
      {[0, 1, 2].map((i) => (
        <text key={i} x="44" y={-22 + i * 22} fontFamily="monospace" fontWeight="700" fontSize="16"
          fill={COLORS.SUCCESS} opacity={i < ticks ? 1 : 0}>✓</text>
      ))}
    </g>
  )
}

// ── PostureCard — Act 7. Kartu tumbuh dari anchor; ikon bukti dari Act
// sebelumnya (bukan kotak kosong). grow 0..1, icons 0..1, pulse 0..1. ──
const PostureCard = ({ idx, pillar, grow, icons, pulse = 0 }) => {
  if (grow <= 0) return null
  const st = PILLAR_STATIONS[idx]
  const from = SERVER_ANCHOR
  const lineEnd = lerpPt(from, st, grow)
  const cx = lerp(from.x, st.x, grow)
  const cy = lerp(from.y, st.y, grow)
  return (
    <g>
      <line x1={from.x} y1={from.y} x2={lineEnd.x} y2={lineEnd.y} stroke={pillar.color}
        strokeWidth={2 + pulse * 2} opacity={0.5 + pulse * 0.5} />
      <g transform={`translate(${cx} ${cy}) scale(${0.6 + 0.4 * grow})`} opacity={grow}>
        <rect x="-90" y="-32" width="180" height="64" rx="12" fill={COLORS.PANEL} stroke={pillar.color} strokeWidth="1.8" />
        <text x="-80" y="-12" fontFamily="monospace" fontWeight="700" fontSize="12" fill={pillar.color}>{pillar.label}</text>
        <text x="-80" y="6" fontFamily="monospace" fontSize="11" fill={COLORS.MUTED}>{pillar.evidence[0]}</text>
        <text x="-80" y="22" fontFamily="monospace" fontSize="11" fill={COLORS.MUTED}>{pillar.evidence[1]}</text>
        <g opacity={icons}>
          <Icon id={pillar.icons[0]} x={46} y={-2} w={24} h={24} color={pillar.color} label="" />
          <Icon id={pillar.icons[1]} x={72} y={-2} w={24} h={24} color={pillar.color} label="" />
        </g>
      </g>
    </g>
  )
}

// ═══════════════════════════════════════════════════════════════════════════
// Jalur & konstanta lokal (koordinat lokal ContentBodyV1, pusat x=366)
// ═══════════════════════════════════════════════════════════════════════════
const ROUTE_A = [P(110, 150), CLOUD_STATION, ROUTER_HOP_STATIONS[0], ROUTER_HOP_STATIONS[1], P(366, 436)]
const ROUTE_B = [P(366, 436), P(366, 584)]
const SKELETON = [P(110, 150), CLOUD_STATION, ROUTER_HOP_STATIONS[0], ROUTER_HOP_STATIONS[1], P(366, 470), P(366, 584)]
const QUERY_PATH = [P(150, 120), P(552, 120)]
const HANDSHAKE_PATH = [P(140, 176), P(366, 584)]
const REQ_TO_SOCKET = [P(110, 180), P(110, 600), P(340, 600)]
const SOCKET_TO_APP = [P(340, 590), P(250, 590), P(250, 340), P(326, 336)]
const MGR_TO_DB = [P(330, 440), P(205, 352)]
const MGR_TO_APP = [P(392, 440), P(370, 360)]
const TO_ANCHOR = [P(100, 180), P(40, 250), P(40, 660), P(304, 655)]
const PROBE_TO_ANCHOR = [P(570, 490), P(426, 620)]
const CLIENT_TO_GATE = (y) => [P(165, y), P(420, 400)]
const GATE_TO_VAULT = [P(480, 400), P(548, 420)]
const BACKUP_LANE = [P(600, 748), P(600, 772), P(130, 772), P(130, 752)]
const DEPLOY_PATH = [P(190, 345), P(304, 610)]
const ROLLBACK_PATH = [P(140, 430), P(304, 620)]
const BACKUP_TO_RESTORE = [P(160, 690), P(300, 450)]
const PERMISSIONS = [
  { who: 'toko-web', perm: 'rw-' },
  { who: 'ops', perm: 'r--' },
  { who: 'lainnya', perm: '---' },
]

// ── State awal (reset deterministik tiap loop, tanpa Math.random) ──
const INIT = {
  caseText: '', cap: null,
  // persisten
  anchorOn: false, anchorScale: 1, glow: 0, led: '', badge: '',
  clientOn: false, clientX: CLIENT_STATION.x, clientScale: 1, clientO: 1, addr: null, ipChip: null, page: null,
  appOn: false, appDockP: 0, appShelfP: 0, appStatus: 'stopped', appLabel: CASE_INFO.appName,
  pul: null, pul2: null,
  // act 1
  mIn: [0, 0, 0, 0], mLit: [0, 0, 0, 0], mBadge: [0, 0, 0, 0], conv: 0, copy: null, beamP: 0, replyP: 0,
  // act 2
  a2On: false, a2O: 1, skelP: 0, cloudLit: false, hopN: 0, dnsOn: false, dnsLit: false, dnsRes: false,
  fwOn: false, fwLit: false, gateOpen: false, rulesOn: false, scanRow: -1, matchedRow: -1,
  pktVis: false, pkt: { path: 'A', p: 0, dim: true }, connOn: false, crumbOn: false, crumbN: 0, crumbArrow: 0,
  sockOn: false, sockO: 1, sockActive: false,
  // act 3
  a3On: false, a3O: 1, mgrP: 0, dbOn: false, dbStatus: 'stopped', depP: 0, depOn: false, mgrAppOn: false,
  sockLineP: 0, barsOn: false, cpu: 0, mem: 0, restartN: 0, restartVis: false, chipN: 0,
  // act 4
  vaultOn: false, vaultP: 0, vaultP2: 0, vaultO: 1, vaultGlow: 0, vaultTested: undefined,
  gateState: 'hidden', gateO: 1, idIn: [0, 0, 0], idO: 1, pcOn: false, pcRows: [0, 0, 0], pcHi: -1, pcO: 1, sweepP: 0,
  // act 5
  a5On: false, a5O: 1, logP: 0, logRows: [], dashP: 0, dashChip: 'UP', metricsOn: false, spike: false, thr: false,
  probeOn: false, probeOk: true, probeP: 0, bellOn: false, bellRot: 0, slotOn: false, cursorX: -1,
  // act 6
  a6On: false, a6O: 1, padP: 0, padSealed: false, pkgOnPad: true, stackOn: false, ptr: 0,
  backupOn: false, backupTested: false, restoreOn: false, counters: '', runbookOn: false, ticks: 0,
  // act 7
  cards: [0, 0, 0, 0], cardIcons: [0, 0, 0, 0], cardPulse: 0, ring: 0, callP: 0,
}

// ═══════════════════════════════════════════════════════════════════════════
// MAIN
// ═══════════════════════════════════════════════════════════════════════════
export default function LinuxServerAnimation({ paused, speed, volume, previewSfx, audioUnlocked }) {
  const [showIntro, setShowIntro] = useState(true)
  const [morphP, setMorphP] = useState(0)
  const [phaseIdx, setPhaseIdx] = useState(-1)
  const [contentStarted, setContentStarted] = useState(false)
  const [s, setS] = useState(INIT)

  const tlRef = useRef(null)
  const volumeRef = useRef(volume)
  const speedRef = useRef(speed)
  useEffect(() => { volumeRef.current = volume }, [volume])
  useEffect(() => { speedRef.current = speed }, [speed])

  useEffect(() => {
    sfxLoader.setEnabled(Boolean(previewSfx && audioUnlocked))
  }, [previewSfx, audioUnlocked])

  const playSfx = (key) => {
    const entry = SFX_MAP[key]
    if (!entry) return
    sfxLoader.play(entry.category, entry.name, { volume: volumeRef.current, speed: speedRef.current })
  }

  // ─────────────────────────── MASTER TIMELINE ───────────────────────────
  useEffect(() => {
    const master = gsap.timeline({ repeat: -1, repeatDelay: 1.5 })
    tlRef.current = master
    window.__animationTimeline = master
    window.__flushSync = flushSync

    // patch state (+ sfx opsional) pada waktu t. p = objek atau fn(prev)=>objek
    const patch = (t, p, sfx) => master.add(() => {
      setS((prev) => ({ ...prev, ...(typeof p === 'function' ? p(prev) : p) }))
      if (sfx) playSfx(sfx)
    }, t)
    // tween nilai from→to, mk(v) => objek | fn(prev)=>objek. Selalu fromTo (deterministik).
    const tw = (t, dur, from, to, mk, ease = 'power2.inOut') => {
      const o = { v: from }
      master.fromTo(o, { v: from }, {
        v: to, duration: dur, ease, immediateRender: false,
        onUpdate: () => setS((prev) => {
          const r = mk(o.v)
          return { ...prev, ...(typeof r === 'function' ? r(prev) : r) }
        }),
      }, t)
    }
    const arr = (key, i, v) => (prev) => ({ [key]: prev[key].map((x, j) => (j === i ? v : x)) })
    const cap = (t, text, x, y, color) => patch(t, { cap: { text, x, y, color } })
    const capOff = (t) => patch(t, { cap: null })
    // pulse sepanjang pts (dari→ke), label menempel di pulse
    const pulse = (t, dur, pts, color, label, from = 0, to = 1, key = 'pul', hide = true) => {
      patch(t, { [key]: { pts, color, label, p: from } })
      tw(t, dur, from, to, (v) => (prev) => (prev[key] ? { [key]: { ...prev[key], p: v } } : {}), 'power1.inOut')
      if (hide) patch(t + dur, { [key]: null })
    }

    // ── INTRO ──
    const INTRO_HOLD = 1.8
    const MORPH = 0.8
    master.add(() => {
      setShowIntro(true); setPhaseIdx(-1); setContentStarted(false); setMorphP(0); setS(INIT)
    }, 0)
    master.add(() => playSfx('SHIMMER'), 0.2)
    const mo = { p: 0 }
    master.fromTo(mo, { p: 0 }, {
      p: 1, duration: MORPH, ease: 'power3.inOut', immediateRender: false,
      onUpdate: () => setMorphP(mo.p),
    }, INTRO_HOLD)
    const start0 = INTRO_HOLD + MORPH
    master.add(() => { setShowIntro(false); setContentStarted(true); setMorphP(1) }, start0)

    const actStart = []
    let acc = start0
    PHASES.forEach((ph) => { actStart.push(acc); acc += ph.duration })
    const END = acc
    const T = (a, dt) => actStart[a] + dt
    PHASES.forEach((_, a) => master.add(() => setPhaseIdx(a), actStart[a]))

    // ═══════════════════ ACT 1 — SERVER ADALAH PERAN (14 s) ═══════════════════
    {
      const a = 0
      patch(T(a, 0), { caseText: CASE_STRIP.act1, cap: null })
      patch(T(a, 0.3), { appOn: true, appLabel: CASE_INFO.appName, appStatus: 'running',
        cap: { text: BEATS.act1.appSource, x: 366, y: 140, color: COLORS.SUCCESS } }, 'POP')

      COMPUTE_FORMS.forEach((f, i) => {
        const t0 = T(a, 1.3 + i * 1.4)
        patch(t0, {}, 'POP')
        tw(t0, 0.4, 0, 1, (v) => arr('mIn', i, v))
        tw(t0 + 0.4, 0.5, 0, 1, (v) => ({ copy: { idx: i, p: v } }), 'power1.inOut')
        patch(t0 + 0.9, (prev) => ({
          copy: null,
          ...arr('mLit', i, 1)(prev),
          cap: { text: BEATS.act1.perMachine[i], x: FOUR_MACHINES_X[i], y: 430, color: COLORS.CLIENT },
        }), 'TICK')
      })

      // client muncul lalu ping semua mesin
      patch(T(a, 6.5), { clientOn: true, clientX: 30, clientO: 0,
        cap: { text: BEATS.act1.clientSends, x: 120, y: 214, color: COLORS.CLIENT } }, 'POP')
      tw(T(a, 6.5), 0.4, 30, CLIENT_STATION.x, (v) => ({ clientX: v, clientO: (v - 30) / 80 }))
      tw(T(a, 7.2), 0.7, 0, 1, (v) => ({ beamP: v }), 'power1.inOut')
      patch(T(a, 7.2), {}, 'WHOOSH')
      tw(T(a, 7.9), 0.6, 0, 1, (v) => ({ replyP: v }), 'power1.inOut')
      patch(T(a, 8.5), { page: 'ok', beamP: 0, replyP: 0,
        cap: { text: BEATS.act1.allAnswer, x: 366, y: 455, color: COLORS.SUCCESS } }, 'DING')
      for (let i = 0; i < 4; i++) patch(T(a, 8.8 + i * 0.1), arr('mBadge', i, 1))

      // converge → anchor (tanpa teleport: mesin mengecil & bergerak)
      patch(T(a, 10.4), { anchorOn: true, anchorScale: 0.6, cap: null }, 'SWOOSH')
      tw(T(a, 10.4), 1.6, 0.6, 1, (v) => ({ anchorScale: v }))
      tw(T(a, 10.6), 1.2, 0, 1, (v) => ({ conv: v }))
      tw(T(a, 10.4), 1.4, 0, 1, (v) => ({ appDockP: v }))
      patch(T(a, 11.4), { cap: { text: BEATS.act1.convergeDone, x: 366, y: 745, color: COLORS.SERVICE } }, 'CONFIRM')
      patch(T(a, 12.0), { glow: 0.3 })
      patch(T(a, 12.6), { cap: { text: BEATS.act1.cliffhanger, x: 120, y: 214, color: COLORS.CLIENT } })
    }

    // ═══════════════════ ACT 2 — PERMINTAAN MASUK (24 s) ═══════════════════
    {
      const a = 1
      patch(T(a, 0), {
        caseText: CASE_STRIP.act2, cap: null, page: null, mIn: [0, 0, 0, 0], mLit: [0, 0, 0, 0],
        mBadge: [0, 0, 0, 0], copy: null, a2On: true, a2O: 1, sockO: 1,
      })
      // skeleton jalur redup (digambar dari client, aturan asal-usul #3)
      tw(T(a, 0.4), 1.2, 0, 1, (v) => ({ skelP: v }), 'power1.inOut')
      patch(T(a, 0.6), { dnsOn: true })
      patch(T(a, 0.9), { cloudLit: false })
      patch(T(a, 1.1), { fwOn: true })
      patch(T(a, 1.4), { sockOn: true, sockO: 0.4 })

      // address bar terisi bertahap, IP belum diketahui
      patch(T(a, 1.6), { addr: '', ipChip: 'unknown',
        cap: { text: BEATS.act2.addressUnknown, x: 120, y: 262, color: COLORS.CLIENT } }, 'POP')
      tw(T(a, 1.6), 1.6, 0, 12, (v) => ({ addr: CASE_INFO.domain.slice(0, Math.round(v)) }), 'none')
      patch(T(a, 3.4), { pktVis: true, pkt: { path: 'A', p: 0, dim: true } }, 'TICK')

      // DNS lookup samping (paket data TIDAK lewat DNS)
      pulse(T(a, 3.7), 0.7, QUERY_PATH, COLORS.DNS, '?', 0, 1)
      patch(T(a, 3.7), { cap: { text: BEATS.act2.dnsAsked, x: 600, y: 200, color: COLORS.DNS } }, 'WHOOSH')
      patch(T(a, 4.4), { dnsLit: true }, 'TICK')
      patch(T(a, 5.3), { dnsRes: true }, 'CHIME')
      pulse(T(a, 6.2), 0.7, QUERY_PATH, COLORS.DNS, 'IP', 1, 0)
      patch(T(a, 6.9), { ipChip: CASE_INFO.ip,
        cap: { text: BEATS.act2.ipKnown, x: 120, y: 262, color: COLORS.DNS } }, 'CHIME')

      // paket berangkat lewat cloud + dua router menuju firewall
      patch(T(a, 7.8), { pkt: { path: 'A', p: 0, dim: false }, cap: { text: BEATS.act2.route, x: 540, y: 300, color: COLORS.MUTED } }, 'WHOOSH')
      tw(T(a, 7.8), 1.8, 0, 1, (v) => ({ pkt: { path: 'A', p: v, dim: false } }), 'power1.inOut')
      patch(T(a, 8.3), { cloudLit: true, hopN: 0 }, 'TICK')
      patch(T(a, 8.8), { hopN: 1 }, 'TICK')
      patch(T(a, 9.2), { hopN: 2 }, 'TICK')
      patch(T(a, 9.6), { fwLit: true, rulesOn: true, cap: null }, 'POP')

      // firewall memeriksa port
      patch(T(a, 10.2), { scanRow: 0 }, 'TICK')
      patch(T(a, 10.5), { matchedRow: 0, cap: { text: BEATS.act2.portMatch, x: 590, y: 548, color: COLORS.SUCCESS } }, 'CONFIRM')
      patch(T(a, 10.8), { scanRow: 1 }, 'TICK')
      patch(T(a, 11.0), { scanRow: 2, cap: { text: BEATS.act2.portClosed, x: 590, y: 548, color: COLORS.MUTED } }, 'TICK')
      patch(T(a, 11.3), { scanRow: -1, gateOpen: true }, 'UNLOCK')

      // paket masuk ke listening socket, lalu handshake tiga langkah
      tw(T(a, 11.75), 0.75, 0, 1, (v) => ({ pkt: { path: 'B', p: v, dim: false } }), 'power1.inOut')
      patch(T(a, 12.5), { pktVis: false, sockO: 1, sockActive: true,
        cap: { text: BEATS.act2.handshake, x: 200, y: 560, color: COLORS.CLIENT } }, 'POP')
      pulse(T(a, 12.5), 0.4, HANDSHAKE_PATH, COLORS.CLIENT, 'SYN', 0, 1, 'pul', false)
      pulse(T(a, 12.95), 0.4, HANDSHAKE_PATH, COLORS.SERVICE, 'SYN-ACK', 1, 0, 'pul', false)
      pulse(T(a, 13.4), 0.4, HANDSHAKE_PATH, COLORS.CLIENT, 'ACK', 0, 1, 'pul', false)
      patch(T(a, 13.8), { pul: null, connOn: true,
        cap: { text: BEATS.act2.connected, x: 200, y: 560, color: COLORS.SUCCESS } }, 'CONFIRM')

      // breadcrumb merangkum rantai akses
      // 16.2 skeleton redup (opacity 0.35 + panah putus-putus), lalu tiap
      // langkah menyala berurutan dan panah masuknya tumbuh 0.3 s
      patch(T(a, 16.2), { crumbOn: true, crumbN: 0, crumbArrow: 0 })
      BREADCRUMB_STEPS.forEach((_, i) => {
        patch(T(a, 16.4 + i * 0.5), { crumbN: i + 1, crumbArrow: 0,
          cap: { text: BEATS.act2.breadcrumb, x: 366, y: 900, color: COLORS.DNS } }, 'TICK')
        if (i > 0) tw(T(a, 16.4 + i * 0.5), 0.3, 0, 1, (v) => ({ crumbArrow: v }), 'power1.out')
      })
      patch(T(a, 19.4), { cap: { text: BEATS.act2.cliffhanger, x: 330, y: 550, color: COLORS.SERVICE } })

      // seam: objek jalur fade, client + anchor + app tile bertahan
      patch(T(a, 22.0), { cap: null, addr: null, ipChip: null, page: null })
      tw(T(a, 22.0), 1.8, 1, 0, (v) => ({ a2O: v }), 'power1.inOut')
      patch(T(a, 23.9), { a2On: false, pkt: { path: 'A', p: 0, dim: true }, skelP: 0, cloudLit: false, hopN: 0,
        dnsOn: false, dnsLit: false, dnsRes: false, fwOn: false, fwLit: false, gateOpen: false, rulesOn: false,
        scanRow: -1, matchedRow: -1, connOn: false, crumbOn: false, crumbN: 0, crumbArrow: 0, pul: null })
    }

    // ═══════════════════ ACT 3 — SERVICE BEKERJA (18 s) ═══════════════════
    {
      const a = 2
      const CAP = { x: 570, y: 470 }
      patch(T(a, 0), { caseText: CASE_STRIP.act3, cap: null, a3On: true, a3O: 1, mgrP: 0,
        sockOn: true, sockActive: false, sockO: 0.4, appStatus: 'stopped' })
      // manager membuka dari anchor
      tw(T(a, 0.4), 1.2, 0, 1, (v) => ({ mgrP: v }))
      cap(T(a, 0.5), BEATS.act3.managerIntro, CAP.x, CAP.y, COLORS.SERVICE)
      // app tile keluar dari anchor ke process shelf; database dimulai manager
      tw(T(a, 1.6), 0.9, 0, 1, (v) => ({ appShelfP: v }))
      patch(T(a, 1.8), { dbOn: true, dbStatus: 'stopped' }, 'POP')
      pulse(T(a, 2.0), 0.5, MGR_TO_DB, COLORS.SERVICE, 'start', 0, 1)
      cap(T(a, 2.0), BEATS.act3.dependencyFirst, CAP.x, CAP.y, COLORS.SERVICE)
      patch(T(a, 2.5), { dbStatus: 'running', depOn: true }, 'TICK')
      tw(T(a, 2.6), 0.8, 0, 1, (v) => ({ depP: v }), 'power1.inOut')
      // app dimulai setelah dependency; app membuka pintu 443
      pulse(T(a, 3.6), 0.5, MGR_TO_APP, COLORS.SERVICE, 'start', 0, 1)
      patch(T(a, 4.1), { appStatus: 'running', mgrAppOn: true }, 'CONFIRM')
      tw(T(a, 4.1), 0.5, 0, 1, (v) => ({ sockLineP: v }), 'power1.inOut')
      patch(T(a, 4.6), { sockActive: true, sockO: 1, cap: { text: BEATS.act3.doorOpen, x: CAP.x, y: CAP.y, color: COLORS.SUCCESS } }, 'CONFIRM')
      // resource dibatasi & diawasi
      patch(T(a, 4.7), { barsOn: true })
      tw(T(a, 4.8), 1.5, 0, 1, (v) => ({ cpu: 0.3 * v, mem: 0.45 * v }), 'power1.out')
      cap(T(a, 5.0), BEATS.act3.resourceBound, CAP.x, CAP.y, COLORS.SERVICE)
      // request normal: client → socket → app → balik
      capOff(T(a, 6.8))
      pulse(T(a, 6.9), 0.5, REQ_TO_SOCKET, COLORS.CLIENT, 'GET /', 0, 1)
      pulse(T(a, 7.4), 0.4, SOCKET_TO_APP, COLORS.CLIENT, 'GET /', 0, 1)
      tw(T(a, 7.8), 0.4, 0.3, 0.5, (v) => ({ cpu: v }))
      pulse(T(a, 8.2), 0.4, SOCKET_TO_APP, COLORS.SUCCESS, 'HTML', 1, 0)
      pulse(T(a, 8.6), 0.5, REQ_TO_SOCKET, COLORS.SUCCESS, 'HTML', 1, 0)
      tw(T(a, 8.8), 0.4, 0.5, 0.3, (v) => ({ cpu: v }))
      patch(T(a, 9.1), { page: 'ok', cap: { text: BEATS.act3.pageServed, x: 120, y: 214, color: COLORS.SUCCESS } }, 'DING')
      // kasus: proses mati mendadak
      patch(T(a, 10.2), { appStatus: 'crashed', sockActive: false, sockO: 0.4, page: null,
        cap: { text: BEATS.act3.crashed, x: CAP.x, y: CAP.y, color: COLORS.RISK } }, 'SOFT_DENY')
      tw(T(a, 10.2), 0.4, 1, 0, (v) => ({ cpu: 0.3 * v, mem: 0.45 * v }))
      pulse(T(a, 10.5), 0.5, REQ_TO_SOCKET, COLORS.CLIENT, 'GET /', 0, 1)
      pulse(T(a, 11.02), 0.4, REQ_TO_SOCKET, COLORS.RISK, 'ditolak', 1, 0.55)
      patch(T(a, 11.42), { page: 'err' })
      // manager mendeteksi, restart otomatis
      pulse(T(a, 11.6), 0.4, MGR_TO_APP, COLORS.EDGE, 'cek', 0, 1)
      patch(T(a, 12.0), { restartVis: true, restartN: 1,
        cap: { text: BEATS.act3.restarted, x: CAP.x, y: CAP.y, color: COLORS.SERVICE } }, 'TICK')
      patch(T(a, 12.4), { appStatus: 'running', page: null }, 'CONFIRM')
      tw(T(a, 12.4), 0.6, 0, 1, (v) => ({ cpu: 0.3 * v, mem: 0.45 * v }))
      patch(T(a, 12.6), { sockActive: true, sockO: 1 })
      // request ulang berhasil
      pulse(T(a, 13.0), 0.4, REQ_TO_SOCKET, COLORS.CLIENT, 'GET /', 0, 1)
      pulse(T(a, 13.4), 0.3, SOCKET_TO_APP, COLORS.CLIENT, 'GET /', 0, 1)
      pulse(T(a, 13.7), 0.3, SOCKET_TO_APP, COLORS.SUCCESS, 'HTML', 1, 0)
      pulse(T(a, 14.0), 0.4, REQ_TO_SOCKET, COLORS.SUCCESS, 'HTML', 1, 0)
      patch(T(a, 14.4), { page: 'ok', cap: { text: BEATS.act3.recovered, x: 120, y: 214, color: COLORS.SUCCESS } }, 'DING')
      // ringkasan lifecycle
      patch(T(a, 14.5), { chipN: 1 }, 'TICK')
      patch(T(a, 15.0), { chipN: 2 }, 'TICK')
      patch(T(a, 15.5), { chipN: 3, cap: { text: BEATS.act3.lifecycle, x: CAP.x, y: CAP.y, color: COLORS.SERVICE } }, 'TICK')
      // seam: manager memudar, app tile kembali ke anchor, database bertahan
      patch(T(a, 16.0), { page: null, cap: null })
      tw(T(a, 16.0), 1.2, 1, 0, (v) => ({ a3O: v }), 'power1.inOut')
      tw(T(a, 16.0), 0.9, 1, 0, (v) => ({ appShelfP: v }))
      patch(T(a, 17.9), { a3On: false, sockOn: false, sockActive: false, mgrP: 0, depOn: false, depP: 0,
        mgrAppOn: false, sockLineP: 0, barsOn: false, cpu: 0, mem: 0, restartN: 0, restartVis: false, chipN: 0, pul: null })
    }

    // ═══════════════════ ACT 4 — DATA DAN IDENTITY (18 s) ═══════════════════
    {
      const a = 3
      const CAP = { x: 340, y: 505 }
      const CAPV = { x: 590, y: 625 }
      patch(T(a, 0), { caseText: CASE_STRIP.act4, cap: null, appStatus: 'running' })
      tw(T(a, 0), 0.5, 0, 1, (v) => ({ clientScale: 1 - 0.4 * v, clientO: 1 - 0.5 * v }))
      // database Act 3 berubah jadi data vault (handoff overlap, tanpa teleport)
      patch(T(a, 0.2), { dbOn: false, vaultOn: true, vaultP: 0, vaultP2: 0, vaultO: 1, vaultTested: undefined,
        cap: { text: BEATS.act4.caseIntro, x: 590, y: 335, color: COLORS.DATA } }, 'POP')
      tw(T(a, 0.2), 0.8, 0, 1, (v) => ({ vaultP: v }))
      // gate tumbuh dari sisi vault
      patch(T(a, 1.0), { gateState: 'closed', gateO: 0, cap: { text: BEATS.act4.gateGrows, x: CAP.x, y: CAP.y, color: COLORS.EDGE } }, 'LOCK')
      tw(T(a, 1.0), 1.2, 0, 1, (v) => ({ gateO: v }), 'power1.out')
      // tiga identitas masuk dari tepi kiri
      for (let i = 0; i < 3; i++) {
        patch(T(a, 2.2 + i * 0.4), {}, 'POP')
        tw(T(a, 2.2 + i * 0.4), 0.5, 0, 1, (v) => arr('idIn', i, v), 'power2.out')
      }
      // permission card membuka di bawah vault
      patch(T(a, 3.6), { pcOn: true, pcRows: [0, 0, 0],
        cap: { text: BEATS.act4.permissionsDiffer, x: CAPV.x, y: CAPV.y, color: COLORS.IDENTITY } }, 'POP')
      for (let i = 0; i < 3; i++) patch(T(a, 3.6 + i * 0.3), arr('pcRows', i, 1), 'TICK')

      // 1) toko-web: baca-tulis
      pulse(T(a, 5.4), 0.7, CLIENT_TO_GATE(280), COLORS.IDENTITY, 'toko-web', 0, 1, 'pul', false)
      patch(T(a, 6.1), { gateState: 'checking', pcHi: 0 }, 'TICK')
      patch(T(a, 6.3), { gateState: 'granted', cap: { text: BEATS.act4.granted, x: CAP.x, y: CAP.y, color: COLORS.SUCCESS } }, 'UNLOCK')
      pulse(T(a, 6.4), 0.5, GATE_TO_VAULT, COLORS.SUCCESS, 'rw', 0, 1, 'pul', true)
      tw(T(a, 6.9), 0.4, 0, 1, (v) => ({ vaultGlow: v }))
      patch(T(a, 7.7), { gateState: 'closed', pcHi: -1, vaultGlow: 0 }, 'LOCK')

      // 2) deploy (admin, ssh-key): baca saja
      pulse(T(a, 8.1), 0.7, CLIENT_TO_GATE(400), COLORS.IDENTITY, 'ssh-key', 0, 1, 'pul', false)
      patch(T(a, 8.8), { gateState: 'checking', pcHi: 1 }, 'TICK')
      patch(T(a, 9.1), { gateState: 'granted', cap: { text: BEATS.act4.partial, x: CAP.x, y: CAP.y, color: COLORS.WARNING } }, 'UNLOCK')
      pulse(T(a, 9.2), 0.4, GATE_TO_VAULT, COLORS.SUCCESS, 'baca', 0, 1, 'pul', true)
      pulse(T(a, 10.0), 0.4, CLIENT_TO_GATE(400), COLORS.WARNING, 'tulis', 0, 1, 'pul', false)
      patch(T(a, 10.45), { gateState: 'denied' }, 'SOFT_DENY')
      pulse(T(a, 10.47), 0.4, CLIENT_TO_GATE(400), COLORS.RISK, 'tulis', 1, 0.55, 'pul', true)
      patch(T(a, 10.95), { gateState: 'closed', pcHi: -1 }, 'LOCK')

      // 3) guest: ditolak
      pulse(T(a, 11.1), 0.7, CLIENT_TO_GATE(520), COLORS.MUTED, 'guest', 0, 1, 'pul', false)
      patch(T(a, 11.8), { gateState: 'checking', pcHi: 2 }, 'TICK')
      patch(T(a, 12.0), { gateState: 'denied', cap: { text: BEATS.act4.denied, x: CAP.x, y: CAP.y, color: COLORS.RISK } }, 'SOFT_DENY')
      pulse(T(a, 12.02), 0.5, CLIENT_TO_GATE(520), COLORS.RISK, 'guest', 1, 0.5, 'pul', true)
      patch(T(a, 12.9), { gateState: 'closed', pcHi: -1 }, 'LOCK')

      // ringkasan: akses minimum
      patch(T(a, 13.1), { pcHi: -2, cap: { text: BEATS.act4.minimum, x: CAPV.x, y: CAPV.y, color: COLORS.IDENTITY } })
      tw(T(a, 13.1), 1.0, 0, 1, (v) => ({ sweepP: v }), 'power1.inOut')

      // seam: kartu/gate/permission fade, vault pindah ke (600,720) dan redup
      patch(T(a, 14.6), { cap: null })
      tw(T(a, 14.6), 0.8, 1, 0, (v) => ({ idO: v, gateO: v, pcO: v }), 'power1.inOut')
      tw(T(a, 15.0), 1.2, 0, 1, (v) => ({ vaultP2: v, vaultO: 1 - 0.4 * v }))
      patch(T(a, 17.9), { gateState: 'hidden', pcOn: false, idIn: [0, 0, 0], pcRows: [0, 0, 0], pcHi: -1,
        sweepP: 0, pul: null, vaultGlow: 0 })
    }

    // ═══════════════════ ACT 5 — BUKTI KESEHATAN (16 s) ═══════════════════
    {
      const a = 4
      const CAPC = { x: 366, y: 395 }
      const CAPP = { x: 590, y: 535 }
      const OK_ROWS = ['200 /', '200 /cart', '200 /']
      patch(T(a, 0), { caseText: CASE_STRIP.act5, cap: null, a5On: true, a5O: 1, logRows: [], logP: 0, dashP: 0,
        dashChip: 'UP', metricsOn: false, spike: false, thr: false, probeOk: true, probeP: 0, vaultTested: undefined })
      // tiga request → tiga baris log yang keluar dari sisi kiri anchor
      OK_ROWS.forEach((txt, i) => {
        pulse(T(a, 0.4 + i * 1.0), 0.6, TO_ANCHOR, COLORS.CLIENT, 'GET', 0, 1)
        patch(T(a, 1.0 + i * 1.0), (prev) => ({ logRows: [...prev.logRows, { text: txt, level: 'ok' }] }), 'TICK')
      })
      tw(T(a, 0.6), 0.6, 0, 1, (v) => ({ logP: v }), 'power2.out')
      cap(T(a, 1.2), BEATS.act5.logged, CAPC.x, CAPC.y, COLORS.OBSERVE)
      // dashboard unfold dari anchor; awalnya hanya UP
      patch(T(a, 3.4), { cap: { text: BEATS.act5.notEnough, x: CAPC.x, y: CAPC.y, color: COLORS.SUCCESS } }, 'POP')
      tw(T(a, 3.4), 1.0, 0, 1, (v) => ({ dashP: v }), 'power2.out')
      // metrics: garis latency/error/cpu terisi
      patch(T(a, 4.8), { metricsOn: true, cap: { text: BEATS.act5.metrics, x: CAPC.x, y: CAPC.y, color: COLORS.OBSERVE } }, 'TICK')
      // health probe menguji layanan berkala
      patch(T(a, 6.4), { probeOn: true, cap: { text: BEATS.act5.healthCheck, x: CAPP.x, y: CAPP.y, color: COLORS.SUCCESS } }, 'POP')
      pulse(T(a, 6.6), 0.5, PROBE_TO_ANCHOR, COLORS.SUCCESS, '/health', 0, 1)
      pulse(T(a, 7.12), 0.5, PROBE_TO_ANCHOR, COLORS.SUCCESS, 'OK', 1, 0)
      // burst trafik: latency naik, log amber lalu merah, error melonjak
      for (let k = 0; k < 6; k++) pulse(T(a, 7.8 + k * 0.45), 0.4, TO_ANCHOR, COLORS.WARNING, '', 0, 1)
      patch(T(a, 8.2), { spike: true, cap: { text: BEATS.act5.degrade, x: CAPC.x, y: CAPC.y, color: COLORS.WARNING } }, 'TICK')
      patch(T(a, 8.6), (prev) => ({ logRows: [...prev.logRows, { text: '504 /cart', level: 'warn' }] }), 'TICK')
      patch(T(a, 9.4), (prev) => ({ logRows: [...prev.logRows, { text: '500 /order', level: 'error' }] }), 'SOFT_DENY')
      patch(T(a, 10.0), (prev) => ({ logRows: [...prev.logRows, { text: '500 /order', level: 'error' }] }), 'SOFT_DENY')
      // probe berikutnya gagal → DEGRADED
      pulse(T(a, 10.6), 0.5, PROBE_TO_ANCHOR, COLORS.WARNING, '/health', 0, 1)
      patch(T(a, 11.1), { probeOk: false, dashChip: 'DEGRADED', led: COLORS.RISK,
        cap: { text: BEATS.act5.failing, x: CAPP.x, y: CAPP.y, color: COLORS.RISK } }, 'SOFT_DENY')
      // threshold terlewati → bell keluar dari titik threshold, notifikasi ke owner
      patch(T(a, 12.0), { thr: true, bellOn: true, cap: { text: BEATS.act5.alerted, x: CAPC.x, y: CAPC.y, color: COLORS.RISK } }, 'ALERT_PULSE')
      tw(T(a, 12.0), 0.9, 0, 1, (v) => ({ bellRot: Math.sin(v * Math.PI * 6) * 14 }), 'none')
      patch(T(a, 12.5), { slotOn: true })
      pulse(T(a, 12.6), 0.6, [P(620, 332), P(620, 380)], COLORS.RISK, '', 0, 1, 'pul2')
      // kursor waktu menyapu log, grafik, dan probe pada momen yang sama
      patch(T(a, 13.6), { cap: { text: BEATS.act5.unified, x: CAPC.x, y: CAPC.y, color: COLORS.OBSERVE } }, 'CHIME')
      tw(T(a, 13.6), 1.4, 100, 640, (v) => ({ cursorX: v }), 'power1.inOut')
      // seam: dashboard/log/bell fade; probe docks jadi LED kesehatan anchor
      patch(T(a, 15.0), { cap: null, cursorX: -1 })
      tw(T(a, 15.0), 0.8, 1, 0, (v) => ({ a5O: v }), 'power1.inOut')
      tw(T(a, 15.0), 0.8, 0, 1, (v) => ({ probeP: v }))
      patch(T(a, 15.85), { probeOn: false, led: COLORS.SUCCESS }, 'TICK')
      patch(T(a, 15.95), { a5On: false, logRows: [], logP: 0, dashP: 0, metricsOn: false, spike: false, thr: false,
        bellOn: false, slotOn: false, pul: null, pul2: null })
    }

    // ═══════════════════ ACT 6 — PERUBAHAN & PEMULIHAN (20 s) ═══════════════════
    {
      const a = 5
      const CAPA = { x: 366, y: 745 }
      const CAPB = { x: 366, y: 800 }
      const CAPR = { x: 366, y: 505 }
      patch(T(a, 0), { caseText: CASE_STRIP.act6, cap: null, a6On: true, a6O: 1, appOn: true, appStatus: 'running',
        appLabel: 'v1', led: COLORS.SUCCESS, badge: '', padP: 0, padSealed: false, pkgOnPad: true, stackOn: false,
        ptr: 0, backupOn: false, backupTested: false, restoreOn: false, counters: '', runbookOn: false, ticks: 0, page: null })
      // staging: paket v2 diuji dulu
      patch(T(a, 0.4), { cap: { text: BEATS.act6.staged, x: 140, y: 400, color: COLORS.EDGE } }, 'POP')
      tw(T(a, 0.4), 1.0, 0, 1, (v) => ({ padP: v }), 'power2.out')
      patch(T(a, 2.2), { padSealed: true, cap: { text: BEATS.act6.passed, x: 140, y: 400, color: COLORS.SUCCESS } }, 'CONFIRM')
      // deploy v2 ke production lewat jalur oranye
      patch(T(a, 3.0), { pkgOnPad: false, cap: null }, 'WHOOSH')
      pulse(T(a, 3.0), 1.0, DEPLOY_PATH, COLORS.EDGE, 'v2', 0, 1)
      patch(T(a, 4.0), { appLabel: 'v2', badge: 'DEPLOYING', cap: { text: BEATS.act6.deployed, x: CAPA.x, y: CAPA.y, color: COLORS.EDGE } }, 'TICK')
      // request pertama gagal: respons merah, LED merah
      pulse(T(a, 5.0), 0.6, TO_ANCHOR, COLORS.CLIENT, 'GET /', 0, 1)
      pulse(T(a, 5.62), 0.6, TO_ANCHOR, COLORS.RISK, '500', 1, 0)
      patch(T(a, 5.6), { led: COLORS.RISK, badge: 'FAILED', cap: { text: BEATS.act6.failed, x: CAPA.x, y: CAPA.y, color: COLORS.RISK } }, 'SOFT_DENY')
      patch(T(a, 6.3), { page: 'err' })
      // rollback: penunjuk berpindah ke v1, paket v1 kembali ke anchor
      patch(T(a, 6.6), { stackOn: true }, 'POP')
      tw(T(a, 6.6), 0.6, 1, 0, (v) => ({ padP: v }), 'power1.inOut')
      tw(T(a, 6.8), 0.5, 0, 1, (v) => ({ ptr: v }))
      patch(T(a, 7.2), { badge: 'ROLLBACK', cap: { text: BEATS.act6.rollback, x: CAPA.x, y: CAPA.y, color: COLORS.SUCCESS } }, 'WHOOSH')
      pulse(T(a, 7.2), 0.9, ROLLBACK_PATH, COLORS.SUCCESS, 'v1', 0, 1)
      patch(T(a, 8.1), { appLabel: 'v1', led: COLORS.SUCCESS, page: null }, 'CONFIRM')
      patch(T(a, 8.4), { badge: 'STABLE' }, 'DING')
      // backup: snapshot disalin ke lokasi terpisah lewat lajur bawah
      patch(T(a, 9.4), { backupOn: true, cap: { text: BEATS.act6.backedUp, x: CAPB.x, y: CAPB.y, color: COLORS.DATA } }, 'SWOOSH')
      pulse(T(a, 9.4), 2.0, BACKUP_LANE, COLORS.DATA, 'snapshot', 0, 1)
      patch(T(a, 11.4), {}, 'TICK')
      patch(T(a, 11.8), { cap: { text: BEATS.act6.unverified, x: CAPB.x, y: CAPB.y, color: COLORS.WARNING } })
      // restore test di area terpisah: dua penghitung dibandingkan
      patch(T(a, 13.6), { restoreOn: true, counters: '', cap: { text: BEATS.act6.restoreTest, x: CAPR.x, y: CAPR.y, color: COLORS.CLIENT } }, 'POP')
      pulse(T(a, 13.8), 0.8, BACKUP_TO_RESTORE, COLORS.CLIENT, 'restore', 0, 1)
      patch(T(a, 14.7), { counters: 'unknown' }, 'TICK')
      patch(T(a, 15.4), { counters: 'equal', backupTested: true, cap: { text: BEATS.act6.proven, x: CAPR.x, y: CAPR.y, color: COLORS.SUCCESS } }, 'CONFIRM')
      patch(T(a, 16.2), {}, 'COMPLETE')
      // runbook lahir dari hasil restore test
      patch(T(a, 17.0), { restoreOn: false, runbookOn: true, ticks: 0, cap: { text: BEATS.act6.documented, x: 366, y: 500, color: COLORS.IDENTITY } }, 'POP')
      for (let i = 0; i < 3; i++) patch(T(a, 17.3 + i * 0.4), { ticks: i + 1 }, 'TICK')
      // seam
      patch(T(a, 19.0), { cap: null, badge: '' })
      tw(T(a, 19.0), 0.9, 1, 0, (v) => ({ a6O: v }), 'power1.inOut')
      patch(T(a, 19.95), { a6On: false, stackOn: false, backupOn: false, restoreOn: false, runbookOn: false,
        padP: 0, ptr: 0, ticks: 0, counters: '', pul: null })
    }

    // ═══════════════════ ACT 7 — SERVER POSTURE (12 s) ═══════════════════
    {
      const a = 6
      patch(T(a, 0), { caseText: CASE_STRIP.act7, cap: null, badge: '' })
      tw(T(a, 0), 0.5, 0.5, 0, (v) => ({ clientO: v }))
      tw(T(a, 0.2), 0.5, 0.6, 0, (v) => ({ vaultO: v }))
      patch(T(a, 0.75), { vaultOn: false })
      ;[0.6, 2.5, 4.4, 6.3].forEach((t, k) => {
        patch(T(a, t), {}, 'POP2')
        tw(T(a, t), 0.6, 0, 1, (v) => arr('cards', k, v), 'power2.out')
        tw(T(a, t + 0.4), 0.4, 0, 1, (v) => arr('cardIcons', k, v))
        patch(T(a, t + 0.9), {}, k === 3 ? 'DING' : 'TICK')
      })
      patch(T(a, 8.2), { cap: { text: BEATS.act7.balanced, x: 366, y: 815, color: COLORS.DATA } }, 'DING')
      tw(T(a, 8.2), 0.6, 0, 1, (v) => ({ cardPulse: v }), 'power1.inOut')
      tw(T(a, 8.8), 0.6, 1, 0, (v) => ({ cardPulse: v }), 'power1.inOut')
      tw(T(a, 8.2), 1.3, 0, 1, (v) => ({ ring: v }), 'power1.inOut')
      // callback: empat bentuk mesin Act 1 menjawab hook secara eksplisit
      tw(T(a, 9.5), 0.6, 0, 1, (v) => ({ callP: v }), 'power2.out')
      patch(T(a, 9.7), { cap: { text: BEATS.act7.callback, x: 366, y: 925, color: COLORS.TEXT } }, 'COMPLETE')
    }

    // definisikan durasi timeline = total intro + semua Act
    master.to({}, { duration: 0.001 }, END - 0.001)

    return () => {
      master.kill()
      if (window.__animationTimeline === master) delete window.__animationTimeline
      delete window.__flushSync
    }
  }, [])

  useEffect(() => {
    const tl = tlRef.current
    if (!tl) return
    tl.timeScale(speed)
    if (paused) tl.pause()
    else tl.resume()
  }, [paused, speed])

  // ─────────────────────────── DERIVED ───────────────────────────
  const appPos = lerpPt(lerpPt(APP_TILE_SOURCE, APP_TILE_DOCKED, s.appDockP), PROCESS_SHELF.app, s.appShelfP)
  const vaultPos = lerpPt(lerpPt(PROCESS_SHELF.db, DATA_VAULT_ACT4, s.vaultP), DATA_VAULT_ACT6, s.vaultP2)
  const vaultScale = lerp(0.7, 1, s.vaultP)
  const pktPts = s.pkt.path === 'A' ? ROUTE_A : ROUTE_B
  const pktPos = pointOn(pktPts, s.pkt.p)
  const APP_TO_SOCKET = [P(326, 336), P(250, 340), P(250, 590), P(340, 590)]
  const gateHiColor = s.gateState === 'granted' ? COLORS.SUCCESS : s.gateState === 'denied' ? COLORS.RISK : COLORS.EDGE
  const RING_C = 2 * Math.PI * 96

  // ─────────────────────────── RENDER ───────────────────────────
  return (
    <svg viewBox={'0 0 ' + VW + ' ' + VH} style={{
      width: '100%', height: '100%', maxHeight: '100vh',
      maxWidth: 'calc(100vh * ' + VW + ' / ' + VH + ')',
      background: COLORS.BG, userSelect: 'none',
    }}>
      <defs>
        <marker id="arrow91" markerWidth="8" markerHeight="8" refX="7" refY="4" orient="auto">
          <path d="M0,0 L8,4 L0,8 Z" fill={COLORS.MUTED} />
        </marker>
      </defs>
      <rect width={VW} height={VH} fill={COLORS.BG} />

      <IntroHeaderMorphV1
        progress={morphP}
        categorySegments={[
          { label: INTRO_CATEGORY_LABEL + ' · ', color: COLORS.MUTED },
          { label: INTRO_DOMAIN, color: COLORS.CLIENT },
        ]}
        titleSegments={[
          { label: INTRO_TITLE_A, color: COLORS.CLIENT },
          { label: INTRO_TITLE_B, color: COLORS.SUCCESS },
        ]}
        subtitle={INTRO_SUBTITLE}
        testId="linux-server-intro"
      />

      {contentStarted && (
        <ActBadgeNavigatorV1 phases={PHASES} activeIndex={phaseIdx} testId="linux-server-navigator" />
      )}

      {contentStarted && (
        <ContentBodyV1 debugName="linux-server-body">
          <g>
            <CaseStrip text={s.caseText} />

            {/* ── Act 1: beam client → mesin, empat bentuk compute ── */}
            {s.clientOn && COMPUTE_FORMS.map((f, i) => {
              if (s.mIn[i] <= 0 || s.beamP <= 0) return null
              const end = P(FOUR_MACHINES_X[i], FOUR_MACHINES_Y - 84)
              const start = P(CLIENT_STATION.x, 178)
              const back = lerpPt(end, start, s.replyP)
              return (
                <g key={'beam' + i}>
                  <PathLine pts={[start, end]} p={s.beamP} color={COLORS.CLIENT} dashed width={1.6} opacity={0.6} />
                  {s.replyP > 0 && s.replyP < 1 && <circle cx={back.x} cy={back.y} r="6" fill={COLORS.SUCCESS} />}
                </g>
              )
            })}
            {COMPUTE_FORMS.map((f, i) => (
              <MachineNode key={f.id} idx={i} form={f} rise={s.mIn[i]} lit={s.mLit[i] === 1} badge={s.mBadge[i] === 1} conv={s.conv} />
            ))}
            {s.copy && <PacketCapsule from={APP_TILE_SOURCE} to={P(FOUR_MACHINES_X[s.copy.idx], FOUR_MACHINES_Y - 60)}
              progress={s.copy.p} color={COLORS.SUCCESS} />}

            {/* ── Act 2: jalur masuk (skeleton redup → menyala) ── */}
            {s.a2On && (
              <g opacity={s.a2O}>
                <PathLine pts={SKELETON} p={s.skelP} color={COLORS.BORDER} dashed width={2} />
                {s.skelP > 0.4 && (
                  <g opacity={s.cloudLit ? 1 : 0.4} transform={`translate(${CLOUD_STATION.x} ${CLOUD_STATION.y})`}>
                    <Icon id="internet-cloud" x={0} y={0} w={150} h={100} color={COLORS.MUTED} label="INTERNET" />
                  </g>
                )}
                {s.skelP > 0.6 && ROUTER_HOP_STATIONS.map((h, i) => (
                  <circle key={'hop' + i} cx={h.x} cy={h.y} r="8" fill={s.hopN > i ? COLORS.CLIENT : COLORS.PANEL}
                    stroke={COLORS.MUTED} strokeWidth="1.6" opacity={s.hopN > i ? 1 : 0.5} />
                ))}
                <g opacity={s.dnsLit ? 1 : 0.4}><DnsBook visible={s.dnsOn} resolved={s.dnsRes} /></g>
                <g opacity={s.fwLit ? 1 : 0.4}><FirewallGate visible={s.fwOn} open={s.gateOpen} /></g>
                <RulesCard visible={s.rulesOn} scanRow={s.scanRow} matchedRow={s.matchedRow} />
                {s.connOn && <PathLine pts={HANDSHAKE_PATH} p={1} color={COLORS.SUCCESS} width={2.4} />}
                {s.pktVis && (
                  <g transform={`translate(${pktPos.x} ${pktPos.y})`} opacity={s.pkt.dim ? 0.4 : 1}>
                    <circle r="10" fill={COLORS.CLIENT} />
                    <circle r="16" fill="none" stroke={COLORS.CLIENT} strokeWidth="1.2" opacity="0.4" />
                    {!s.pkt.dim && <PathLabel x={0} y={-24} text=":443" color={COLORS.CLIENT} />}
                  </g>
                )}
                <RouteChain steps={BREADCRUMB_STEPS} visible={s.crumbOn} lit={s.crumbN} arrowP={s.crumbArrow} />
              </g>
            )}
            <g opacity={s.sockO}><ListenSocket visible={s.sockOn} active={s.sockActive} /></g>

            {/* ── Act 3: service manager menjaga proses ── */}
            {s.a3On && (
              <g opacity={s.a3O}>
                <g transform={`translate(0 ${(1 - s.mgrP) * 170})`} opacity={s.mgrP}>
                  <line x1="366" y1="516" x2="366" y2="570" stroke={COLORS.SERVICE} strokeWidth="1.6" strokeDasharray="4 4" opacity="0.7" />
                  <ServiceManagerPanel visible dependencyOn={s.depOn} appOn={s.mgrAppOn} />
                </g>
                <PathLine pts={[P(212, 336), P(322, 336)]} p={s.depP} color={COLORS.SERVICE} width={2} arrow />
                <PathLine pts={APP_TO_SOCKET} p={s.sockLineP} color={COLORS.SUCCESS} dashed width={2} opacity={0.8} />
                <ResourceBars pos={PROCESS_SHELF.app} visible={s.barsOn} cpu={s.cpu} mem={s.mem} />
                {s.restartVis && (
                  <g transform="translate(440 330)">
                    <path d="M-16,-6 A18,18 0 1,1 -6,16" fill="none" stroke={COLORS.SERVICE} strokeWidth="2.4" markerEnd="url(#arrow91)" />
                    <text x="0" y="40" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="12" fill={COLORS.SERVICE}>restart {s.restartN}</text>
                  </g>
                )}
                {['start', 'monitor', 'restart'].map((label, i) => (i < s.chipN ? (
                  <Chip key={'life' + i} x={366 + (i - 1) * 96} y={412} text={label} color={COLORS.SERVICE} />
                ) : null))}
              </g>
            )}
            {s.dbOn && <ProcessTile pos={PROCESS_SHELF.db} label="DB" status={s.dbStatus} id="data-vault" />}

            {/* ── Act 4: data vault, gate, identitas, permission ── */}
            {s.vaultOn && (
              <g transform={`translate(${vaultPos.x} ${vaultPos.y}) scale(${vaultScale})`} opacity={s.vaultO}>
                {s.vaultGlow > 0 && <circle r="64" fill="none" stroke={COLORS.SUCCESS} strokeWidth="2.4" opacity={s.vaultGlow * 0.7} />}
                <DataVault pos={{ x: 0, y: 0 }} tested={s.vaultTested} />
              </g>
            )}
            <g opacity={s.gateO}><AccessGate state={s.gateState} /></g>
            {[0, 1, 2].map((i) => (
              <g key={'id' + i} opacity={s.idO * s.idIn[i] * (i === 2 ? 0.75 : 1)} transform={`translate(${(1 - s.idIn[i]) * -90} 0)`}>
                <IdentityCard pos={IDENTITY_COLUMN[i]} iconId={['service-account', 'user-badge', 'user-badge'][i]}
                  label={['toko-web', 'deploy', 'guest'][i]} sublabel={BEATS.act4.identityLabels[i]} visible={s.idIn[i] > 0} />
              </g>
            ))}
            {s.idIn[1] > 0.9 && <g opacity={s.idO}><Chip x={IDENTITY_COLUMN[1].x} y={IDENTITY_COLUMN[1].y + 68} text="group: ops" color={COLORS.IDENTITY} /></g>}
            {s.pcOn && (
              <g opacity={s.pcO}>
                <PermissionCard visible rows={PERMISSIONS.map((r, i) => ({ ...r, shown: s.pcRows[i] }))} />
                <g transform={`translate(${PERMISSION_CARD_STATION.x} ${PERMISSION_CARD_STATION.y})`}>
                  {[0, 1, 2].map((i) => ((s.pcHi === i || s.pcHi === -2) ? (
                    <rect key={'hi' + i} x="-96" y={-26 + i * 26 - 12} width="192" height="24" rx="6" fill="none"
                      stroke={s.pcHi === -2 ? COLORS.IDENTITY : gateHiColor} strokeWidth="2" />
                  ) : null))}
                  {s.sweepP > 0 && s.sweepP < 1 && (
                    <line x1={-96 + 192 * s.sweepP} y1="-50" x2={-96 + 192 * s.sweepP} y2="50" stroke={COLORS.IDENTITY} strokeWidth="2" opacity="0.8" />
                  )}
                </g>
              </g>
            )}

            {/* ── Act 5: log, dashboard, probe, alert ── */}
            {s.a5On && (
              <g opacity={s.a5O}>
                <g transform={`translate(${(1 - s.logP) * 186} ${(1 - s.logP) * 170})`} opacity={s.logP}>
                  <LogScroll visible rows={s.logRows} />
                </g>
                <g transform={`translate(0 ${(1 - s.dashP) * 300})`} opacity={s.dashP}>
                  <Chip x={MONITOR_DASHBOARD_STATION.x} y={MONITOR_DASHBOARD_STATION.y - 108}
                    text={s.dashChip} color={s.dashChip === 'UP' ? COLORS.SUCCESS : COLORS.RISK} />
                  <MetricPanel visible linesOn={s.metricsOn} spike={s.spike} thresholdCross={s.thr} />
                </g>
                <g transform={`rotate(${s.bellRot} ${ALERT_BELL_STATION.x} ${ALERT_BELL_STATION.y})`}>
                  <AlertBell visible={s.bellOn} />
                </g>
                {s.slotOn && <Chip x={620} y={392} text="owner + runbook" color={COLORS.RISK} width={140} />}
                {s.cursorX > 0 && <line x1={s.cursorX} y1="215" x2={s.cursorX} y2="545" stroke={COLORS.OBSERVE} strokeWidth="2" strokeDasharray="5 4" opacity="0.8" />}
              </g>
            )}
            {s.probeOn && (
              <g>
                {s.probeP === 0 && <PathLine pts={PROBE_TO_ANCHOR} p={1} color={COLORS.OBSERVE} dashed width={1.6} opacity={0.5} />}
                <g transform={`translate(${(410 - HEALTH_PROBE_STATION.x) * s.probeP} ${(610 - HEALTH_PROBE_STATION.y) * s.probeP})`} opacity={1 - 0.6 * s.probeP}>
                  <HealthProbe visible ok={s.probeOk} />
                </g>
              </g>
            )}

            {/* ── Act 6: staging, release, backup, restore, runbook ── */}
            {s.a6On && (
              <g opacity={s.a6O}>
                {s.padP > 0.9 && <PathLine pts={DEPLOY_PATH} p={1} color={COLORS.EDGE} dashed width={1.6} opacity={0.4} />}
                <StagingPad visible={s.padP > 0} slide={s.padP} sealed={s.padSealed} pkgVisible={s.pkgOnPad} />
                <ReleaseStack visible={s.stackOn} ptr={s.ptr} />
                <BackupVault visible={s.backupOn} tested={s.backupTested} />
                <RestoreArea visible={s.restoreOn} counters={s.counters} />
                <RunbookDoc visible={s.runbookOn} ticks={s.ticks} />
              </g>
            )}

            {/* ── Act 7: empat pilar posture + cincin + callback Act 1 ── */}
            {s.ring > 0 && (
              <circle cx={SERVER_ANCHOR.x} cy={SERVER_ANCHOR.y} r="96" fill="none" stroke={COLORS.DATA} strokeWidth="2.4"
                strokeDasharray={RING_C} strokeDashoffset={RING_C * (1 - s.ring)}
                transform={`rotate(-90 ${SERVER_ANCHOR.x} ${SERVER_ANCHOR.y})`} opacity="0.8" />
            )}
            {POSTURE_PILLARS.map((p, k) => (
              <PostureCard key={p.id} idx={k} pillar={p} grow={s.cards[k]} icons={s.cardIcons[k]} pulse={s.cardPulse} />
            ))}
            {s.callP > 0 && COMPUTE_FORMS.map((f, i) => (
              <g key={'call' + f.id} opacity={s.callP} transform={`translate(${FOUR_MACHINES_X[i]} 868)`}>
                <Icon id={f.iconId} x={0} y={0} w={64} h={48} color={COLORS.CLIENT} label={f.label} />
                <text x="0" y="40" textAnchor="middle" fontFamily="monospace" fontSize="11" fill={COLORS.MUTED}>{f.label}</text>
              </g>
            ))}

            {/* ── Persisten: client, anchor, app tile ── */}
            {s.clientOn && (
              <ClientPhone pos={{ x: s.clientX, y: CLIENT_STATION.y }} scale={s.clientScale} opacity={s.clientO}
                addr={s.addr} ipChip={s.ipChip} page={s.page} />
            )}
            <ServerAnchorIcon settled={s.anchorOn} glow={s.glow} ledColor={s.led || null} badge={s.badge} scale={s.anchorScale} />
            {s.appOn && <AppTile pos={appPos} status={s.appStatus} version={s.appLabel} />}

            <Pulse pulse={s.pul} />
            <Pulse pulse={s.pul2} />
            <CaptionLayer cap={s.cap} />
          </g>
        </ContentBodyV1>
      )}
    </svg>
  )
}
