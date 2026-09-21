// src/content/34-install-applications/Animation.jsx
// Revisi 05 (2026-09-21) — mengikuti revisi/2026-09-21-revisi-05-merge-act1-act2-cumulative-stacking.md.
// Tujuh Act: distro & package manager bawaan (gabungan Act1+2 lama) ->
// repository berada di jaringan -> source punya jenis berbeda -> rencana
// dulu -> arsip masuk dari internet -> pasang sungguhan (verify/unpack/
// configure/record) -> app siap & dapat dikelola. Package card adalah
// actor persisten dari lahir sampai installed (tween posisi, tidak pernah
// unmount lalu muncul tiba-tiba di tempat baru). Logo distro + icon
// konsep dari icons/icons.json (revisi 02), flow spine dari revisi 04.
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import {
  VW, VH, COLORS, ZONE, PHASES, CAPTIONS, TERMINAL_LINES, CARD_BADGE,
  SFX_MAP, PACKAGE, DEPENDENCIES, DISTRO_MANAGERS, REPO_SOURCES,
  REPO_MATCH_ID, MIRROR_ID, TRANSACTION_PLAN, INSTALL_STAGES, UNPACK_FILES,
  LIFECYCLE_ACTIONS, PROJECT_PATH, MANAGER_TAKEAWAY,
  HUB_CENTER, CAROUSEL_Y, GATE_CENTER, TRANSIT_TOP, NETWORK_CENTER, CACHE_CENTER,
  INTRO_CATEGORY_LABEL, INTRO_DOMAIN, INTRO_TITLE_A, INTRO_TITLE_B, INTRO_SUBTITLE,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'
import {
  IntroHeaderMorphV1,
  ActBadgeNavigatorV1,
  ContentBodyV1,
  lerp,
} from '../../shared/scene-ui/v1'
import { getIcon } from './icons/loader'

// ── Revisi 02 (2026-09-18) — icon konsep generik + logo distro asli
// (color, sourced dari Simple Icons/CC0, lihat icons/icons.json &
// icons/_originals/LICENSE-LOGOS.md). Debian tidak punya kartu sendiri di
// DISTRO_MANAGERS — logo Debian muncul sebagai badge kecil di kartu
// Ubuntu (revisi 02 bagian 4 "apt / Debian family" beat). ──
const INSTALL_STAGE_ICON = {
  verify: 'verify-seal',
  unpack: 'unpack-box',
  configure: 'configure-gear',
  record: 'package-ledger',
}
const DISTRO_LOGO_ICON = {
  ubuntu: 'ubuntu-logo',
  fedora: 'fedora-logo',
  arch: 'arch-logo',
  opensuse: 'opensuse-logo',
  alpine: 'alpine-logo',
}

// ── Revisi 04 (2026-09-21) — flowchart spine: satu garis vertikal dari
// hub (persisten) turun ke zona Act yang sedang aktif, jadi backbone
// visual yang menyatukan seluruh Act (bukan garis terpisah per-Act yang
// bisa numpuk; hanya SATU segmen yang tampil, ikut mutasi phaseIdx).
// Diperbarui revisi 05 untuk 7 Act (dulu 8) + koordinat zone baru. ──
const PHASE_SPINE_Y = [
  CAROUSEL_Y,
  NETWORK_CENTER.y,
  TRANSIT_TOP + 26,
  GATE_CENTER.y,
  TRANSIT_TOP + 40,
  TRANSIT_TOP + 30,
  (ZONE.CLOSING.yStart + ZONE.CLOSING.yEnd) / 2,
]
const FlowSpine = ({ phaseIdx, color }) => {
  if (phaseIdx == null || phaseIdx < 0 || phaseIdx >= PHASE_SPINE_Y.length) return null
  const x = HUB_CENTER.x
  const y1 = HUB_CENTER.y
  const y2 = PHASE_SPINE_Y[phaseIdx]
  if (Math.abs(y2 - y1) < 1) return null
  return (
    <g opacity="0.5">
      <line x1={x} y1={y1} x2={x} y2={y2} stroke={color} strokeWidth="2" strokeDasharray="3 7" strokeLinecap="round" />
      <circle r="4" fill={color}>
        <animateMotion dur="1.6s" repeatCount="indefinite" path={'M ' + x + ' ' + y1 + ' L ' + x + ' ' + y2} />
      </circle>
    </g>
  )
}

const TYPE_DUR = 0.5
const TRAVEL_DUR = 0.6

// ── Log ringkas di zona TERMINAL — maksimum 3 baris + prompt aktif. Log
// konseptual, bukan command runnable (acceptance criteria bagian 10). ──
const TerminalPanel = ({ history, activePrompt, typingActive }) => {
  const top = ZONE.TERMINAL.yStart
  const h = ZONE.TERMINAL.yEnd - ZONE.TERMINAL.yStart
  const rows = history.slice(-3)
  return (
    <g>
      <rect x="40" y={top} width="652" height={h} rx="16" fill={COLORS.PANEL_ALT} stroke={COLORS.BORDER} strokeWidth="1.5" />
      <circle cx="64" cy={top + 20} r="5.5" fill={COLORS.DANGER} />
      <circle cx="82" cy={top + 20} r="5.5" fill={COLORS.ACTIVITY} />
      <circle cx="100" cy={top + 20} r="5.5" fill={COLORS.SUCCESS} />
      <text x="656" y={top + 25} textAnchor="end" fontFamily="monospace" fontWeight="700" fontSize="11.5" fill={COLORS.SUCCESS}>{PROJECT_PATH}</text>
      <line x1="64" y1={top + 34} x2="656" y2={top + 34} stroke={COLORS.BORDER} strokeWidth="1" />
      {rows.map((line, i) => (
        <text key={i} x="64" y={top + 56 + i * 22} fontFamily="monospace" fontSize="12" fill={line.colorKey === 'muted' ? COLORS.MUTED : COLORS.TEXT}>{line.text}</text>
      ))}
      <text x="64" y={top + 56 + rows.length * 22} fontFamily="monospace" fontSize="12" fill={COLORS.TEXT}>
        {activePrompt || ''}
        {typingActive && (
          <tspan fill={COLORS.SUCCESS}>
            {'\u2588'}
            <animate attributeName="opacity" values="1;0;1" dur="0.8s" repeatCount="indefinite" />
          </tspan>
        )}
      </text>
    </g>
  )
}

// ── Package manager hub — persist actor sepanjang video. Label tengah
// berganti nama manager begitu diketahui (Act 2). ──
const PackageManagerHub = ({ x, y, state, managerLabel }) => {
  const active = state !== 'idle'
  const ringColor = state === 'manager' ? COLORS.ACTIVITY
    : state === 'network' ? COLORS.NETWORK
    : state === 'sources' ? COLORS.REPO
    : state === 'resolve' ? COLORS.DEPENDENCY
    : state === 'download' ? COLORS.NETWORK
    : state === 'install' ? COLORS.ADMIN
    : COLORS.BORDER
  return (
    <g transform={'translate(' + x + ' ' + y + ')'}>
      <circle r="44" fill={COLORS.PANEL} stroke={ringColor} strokeWidth={active ? 2.4 : 1.6} opacity={active ? 1 : 0.7} />
      {active && (
        <circle r="44" fill="none" stroke={ringColor} strokeWidth="1.4" opacity="0.55">
          <animate attributeName="r" values="44;56;44" dur="1.1s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.5;0;0.5" dur="1.1s" repeatCount="indefinite" />
        </circle>
      )}
      <rect x="-17" y="-13" width="34" height="22" rx="5" fill="none" stroke={COLORS.TEXT} strokeWidth="1.8" />
      <line x1="-17" y1="-3" x2="17" y2="-3" stroke={COLORS.TEXT} strokeWidth="1.4" />
      <circle cx="0" cy="13" r="3.6" fill={ringColor} />
      <text x="0" y="40" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="10" fill={managerLabel ? COLORS.TEXT : COLORS.MUTED}>
        {managerLabel || 'package manager'}
      </text>
    </g>
  )
}

// ── Act 1 baru (revisi 05) — kartu distro+manager gabungan, muncul
// kumulatif cepat (0.3-0.4s per kartu), tidak saling menghilangkan.
// Kartu sample (Ubuntu/apt) di-highlight neon setelah semua tampil. ──
const DistroManagerGrid = ({ y, revealedIds, highlightId, visible }) => {
  if (!visible) return null
  const n = DISTRO_MANAGERS.length
  const gap = 132
  const startX = 366 - ((n - 1) * gap) / 2
  return (
    <g transform={'translate(0 ' + y + ')'}>
      {/* revisi 04: garis cabang dari hub -- distro beda, tugas manager serupa */}
      <g opacity="0.3">
        {DISTRO_MANAGERS.map((d, i) => {
          if (!revealedIds.includes(d.id)) return null
          const x = startX + i * gap
          return <line key={d.id} x1={HUB_CENTER.x} y1="-58" x2={x} y2="-42" stroke={COLORS.INTRO_A} strokeWidth="1.2" strokeDasharray="2 5" />
        })}
      </g>
      {DISTRO_MANAGERS.map((d, i) => {
        if (!revealedIds.includes(d.id)) return null
        const x = startX + i * gap
        const highlight = d.id === highlightId
        return (
          <g key={d.id} transform={'translate(' + x + ' 0)'}>
            <rect x="-58" y="-45" width="116" height="90" rx="14" fill={highlight ? COLORS.PANEL_ALT : COLORS.PANEL} stroke={highlight ? d.color : COLORS.BORDER} strokeWidth={highlight ? 2.4 : 1.3} />
            <image href={getIcon(DISTRO_LOGO_ICON[d.id])} x="-16" y="-40" width="32" height="28" />
            {d.id === 'ubuntu' && (
              <image href={getIcon('debian-logo')} x="26" y="-42" width="16" height="16" opacity="0.95" />
            )}
            <text x="0" y="-4" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="11" fill={COLORS.TEXT}>{d.label}</text>
            <line x1="-42" y1="6" x2="42" y2="6" stroke={COLORS.BORDER} strokeWidth="1" opacity="0.6" />
            <text x="0" y="22" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="11" fill={highlight ? d.color : COLORS.MUTED}>{d.manager}</text>
            <text x="0" y="36" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={COLORS.MUTED}>{d.format}</text>
          </g>
        )
      })}
    </g>
  )
}

// ── Act 3 — repository sebagai peta jaringan, bukan satu rak (revisi
// bagian 4 topologi). Cloud tipis di antara sistem lokal dan repo/mirror;
// pulse request/metadata punya arah travel jelas. ──
const NetworkMap = ({ visible, pulsePos, pulseVisible, metadataArrived }) => {
  if (!visible) return null
  const cx = NETWORK_CENTER.x
  const cy = NETWORK_CENTER.y
  const officialX = cx - 130
  const mirrorX = cx + 130
  return (
    <g>
      <text x={cx} y={cy - 46} textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="11" fill={COLORS.MUTED}>internet (repository terkonfigurasi)</text>
      <ellipse cx={cx} cy={cy} rx="118" ry="34" fill={COLORS.PANEL_ALT} stroke={COLORS.NETWORK} strokeWidth="1.4" opacity="0.55" />
      <ellipse cx={cx - 40} cy={cy - 10} rx="60" ry="24" fill={COLORS.PANEL_ALT} stroke={COLORS.NETWORK} strokeWidth="1.2" opacity="0.4" />
      <ellipse cx={cx + 44} cy={cy + 6} rx="66" ry="24" fill={COLORS.PANEL_ALT} stroke={COLORS.NETWORK} strokeWidth="1.2" opacity="0.4" />

      <g transform={'translate(' + officialX + ' ' + cy + ')'}>
        <rect x="-58" y="-20" width="116" height="40" rx="10" fill={COLORS.PANEL} stroke={COLORS.REPO} strokeWidth="1.8" />
        <image href={getIcon('metadata-catalog')} x="-48" y="-14" width="26" height="26" />
        <text x="10" y="5" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="10" fill={COLORS.REPO}>official repo</text>
      </g>
      <g transform={'translate(' + mirrorX + ' ' + cy + ')'} opacity={metadataArrived ? 1 : 0.55}>
        <rect x="-58" y="-20" width="116" height="40" rx="10" fill={COLORS.PANEL} stroke={COLORS.NETWORK} strokeWidth="1.8" />
        <image href={getIcon('mirror-server')} x="-48" y="-14" width="26" height="26" />
        <text x="10" y="5" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="10" fill={COLORS.NETWORK}>official mirror</text>
      </g>

      {pulseVisible && (
        <circle cx={pulsePos.x} cy={pulsePos.y} r="6" fill={COLORS.NETWORK}>
          <animate attributeName="opacity" values="1;0.4;1" dur="0.5s" repeatCount="indefinite" />
        </circle>
      )}
    </g>
  )
}

// ── Act 4 — enam sumber repository, camera-pan satu per satu (revisi
// bagian 4 & 8: yang tidak dibahas jadi node kecil redup). ──
const SourceLane = ({ visible, activeId }) => {
  if (!visible) return null
  const cols = 3
  const gapX = 220
  const gapY = 62
  const startX = 366 - ((cols - 1) * gapX) / 2
  return (
    <g transform={'translate(0 ' + TRANSIT_TOP + ')'}>
      <image href={getIcon('repo-shelf')} x="286" y="-24" width="20" height="20" />
      <text x="366" y="-8" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="11" fill={COLORS.MUTED}>jenis source yang dikonfigurasi</text>
      {REPO_SOURCES.map((r, i) => {
        const col = i % cols
        const row = Math.floor(i / cols)
        const x = startX + col * gapX
        const y = 26 + row * gapY
        const active = r.id === activeId
        return (
          <g key={r.id} transform={'translate(' + x + ' ' + y + ')'}>
            <rect x="-100" y="-19" width="200" height="38" rx="10" fill={active ? COLORS.PANEL_ALT : COLORS.PANEL} stroke={active ? COLORS.REPO : COLORS.BORDER} strokeWidth={active ? 2.2 : 1.2} opacity={active ? 1 : 0.5} />
            <text x="0" y="5" textAnchor="middle" fontFamily="monospace" fontWeight={active ? '700' : '500'} fontSize="10" fill={active ? COLORS.REPO : COLORS.MUTED}>{r.label}</text>
          </g>
        )
      })}
      {activeId && (
        <text x="366" y={26 + Math.ceil(REPO_SOURCES.length / cols) * gapY + 18} textAnchor="middle" fontFamily="monospace" fontSize="10" fill={COLORS.MUTED}>
          {(REPO_SOURCES.find((r) => r.id === activeId) || {}).note}
        </text>
      )}
    </g>
  )
}

// ── Package card — actor persisten dari lahir (Act 1) sampai installed
// (Act 8). Posisi selalu di-tween, tidak pernah unmount lalu muncul tiba
// tiba di tempat baru (revisi catatan header file). ──
const PackageCard = ({ x, y, badgeKey, manager }) => {
  const badgeText = (CARD_BADGE[badgeKey] || '').replace('{manager}', manager || '')
  return (
    <g transform={'translate(' + x + ' ' + y + ')'}>
      <rect x="-64" y="-30" width="128" height="60" rx="12" fill={COLORS.PANEL_ALT} stroke={COLORS.SUCCESS} strokeWidth="2" />
      <image href={getIcon('package-box')} x="-21" y="-20" width="42" height="30" />
      <text x="0" y="26" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="11" fill={COLORS.TEXT}>{PACKAGE.label}</text>
      {badgeText && (
        <text x="0" y="-38" textAnchor="middle" fontFamily="monospace" fontSize="9.5" fill={COLORS.MUTED}>{badgeText}</text>
      )}
    </g>
  )
}

// ── Caption mengikuti elemen aktif (standar §1.D) — anchor berubah per
// Act, bukan bar statis di satu posisi. ──
const CaptionFollow = ({ text, anchorX, anchorY, colorKey }) => {
  if (!text) return null
  return (
    <g transform={'translate(' + anchorX + ' ' + anchorY + ')'} style={{ transition: 'transform 0.2s' }}>
      <rect x="-220" y="-19" width="440" height="38" rx="18" fill={COLORS.PANEL} stroke={colorKey || COLORS.BORDER} strokeWidth="1.5" opacity="0.96" />
      <text x="0" y="5" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="12.5" fill={COLORS.TEXT}>{text}</text>
    </g>
  )
}

// ── Act 5 — transaction tray: dependency chips datang satu per satu,
// lalu disk/download estimate, baru gate approval terbuka (revisi
// bagian 6, "Rencana dulu"). ──
const TransactionTray = ({ visible, depCount, planReady }) => {
  if (!visible) return null
  const n = DEPENDENCIES.length
  const startX = 366 - ((n - 1) * 90) / 2
  return (
    <g transform={'translate(0 ' + TRANSIT_TOP + ')'}>
      <image href={getIcon('dependency-nodes')} x="286" y="-10" width="20" height="20" />
      <text x="366" y="8" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="11" fill={COLORS.MUTED}>transaction plan</text>
      <rect x="166" y="24" width="400" height="88" rx="14" fill={COLORS.PANEL_ALT} stroke={COLORS.DEPENDENCY} strokeWidth="1.6" />
      {DEPENDENCIES.slice(0, depCount).map((d, i) => (
        <g key={d.id} transform={'translate(' + (startX + i * 90) + ' 52)'}>
          <rect x="-40" y="-14" width="80" height="28" rx="14" fill={COLORS.PANEL} stroke={COLORS.DEPENDENCY} strokeWidth="1.6" />
          <text x="0" y="5" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="10" fill={COLORS.DEPENDENCY}>{d.label}</text>
        </g>
      ))}
      {planReady && (
        <text x="366" y="96" textAnchor="middle" fontFamily="monospace" fontSize="11" fill={COLORS.TEXT}>
          {TRANSACTION_PLAN.newPackages + ' package baru \u00b7 ' + TRANSACTION_PLAN.downloadSize + ' unduhan \u00b7 ' + TRANSACTION_PLAN.diskSpace}
        </text>
      )}
    </g>
  )
}

// ── Gate approval — dibuka hanya setelah plan terbaca (revisi bagian 6
// baris "Approval"). ──
const ApprovalGate = ({ state }) => {
  const open = state === 'open'
  const color = open ? COLORS.SUCCESS : COLORS.ADMIN
  return (
    <g transform={'translate(' + GATE_CENTER.x + ' ' + GATE_CENTER.y + ')'} opacity={state === 'hidden' ? 0 : 1}>
      <rect x="-160" y="-38" width="320" height="76" rx="16" fill={COLORS.PANEL_ALT} stroke={color} strokeWidth="2" />
      <image href={getIcon('trust-key')} x="-18" y="-18" width="36" height="36" opacity={open ? 1 : 0.55} />
      <text x="0" y="30" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="10.5" fill={color}>
        {open ? 'izin sistem diberikan' : 'menunggu izin \u2014 batas perubahan sistem'}
      </text>
    </g>
  )
}

// ── Act 6 — archive capsule melintas dari mirror/internet menuju cache
// lokal (revisi bagian 6 baris "Download"). Progress hanya berjalan saat
// capsule benar-benar bergerak, bukan loading kosong. ──
const DownloadConveyor = ({ visible, capsuleP, progressPct }) => {
  if (!visible) return null
  const srcX = NETWORK_CENTER.x + 130
  const dstX = CACHE_CENTER.x
  const y = TRANSIT_TOP + 40
  const capX = srcX + (dstX - srcX) * capsuleP
  return (
    <g>
      <image href={getIcon('download-arrow')} x="286" y={TRANSIT_TOP - 8} width="20" height="20" />
      <text x="366" y={TRANSIT_TOP + 8} textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="11" fill={COLORS.MUTED}>archive diunduh dari mirror \u2014 belum terpasang</text>
      <g transform={'translate(' + srcX + ' ' + y + ')'}>
        <rect x="-52" y="-18" width="104" height="36" rx="9" fill={COLORS.PANEL} stroke={COLORS.NETWORK} strokeWidth="1.6" />
        <text x="0" y="4" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="9.5" fill={COLORS.NETWORK}>mirror</text>
      </g>
      <line x1={srcX} y1={y} x2={dstX} y2={y} stroke={COLORS.BORDER} strokeWidth="2" strokeDasharray="4 6" opacity="0.6" />
      <g transform={'translate(' + CACHE_CENTER.x + ' ' + y + ')'}>
        <rect x="-56" y="-18" width="112" height="36" rx="9" fill={COLORS.PANEL} stroke={COLORS.ACTIVITY} strokeWidth="1.6" />
        <image href={getIcon('cache-tray')} x="-50" y="-14" width="24" height="24" />
        <text x="10" y="4" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="9.5" fill={COLORS.ACTIVITY}>cache lokal</text>
      </g>
      {capsuleP > 0 && capsuleP < 1 && (
        <g transform={'translate(' + capX + ' ' + y + ')'}>
          <image href={getIcon('download-arrow')} x="-16" y="-16" width="32" height="32" />
        </g>
      )}
      <g transform={'translate(366 ' + (y + 56) + ')'}>
        <rect x="-120" y="-8" width="240" height="16" rx="8" fill={COLORS.PANEL_ALT} stroke={COLORS.BORDER} strokeWidth="1.2" />
        <rect x="-118" y="-6" width={236 * progressPct} height="12" rx="6" fill={COLORS.NETWORK} />
        <text x="0" y="26" textAnchor="middle" fontFamily="monospace" fontSize="10" fill={COLORS.MUTED}>{Math.round(progressPct * 100) + '% \u00b7 ' + TRANSACTION_PLAN.downloadSize}</text>
      </g>
    </g>
  )
}

// ── Act 7 — conveyor kausal verify -> unpack -> configure -> record
// (revisi bagian 6 & 7). Satu stage aktif penuh warna, tahap lain
// outline (aturan anti-rame semu bagian 8). ──
const InstallConveyor = ({ visible, stageIdx, unpackedCount }) => {
  if (!visible) return null
  const n = INSTALL_STAGES.length
  const gap = 160
  const startX = 366 - ((n - 1) * gap) / 2
  const y = TRANSIT_TOP + 30
  return (
    <g>
      <text x="366" y={TRANSIT_TOP + 4} textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="11" fill={COLORS.MUTED}>pasang sungguhan</text>
      <line x1={startX} y1={y} x2={startX + (n - 1) * gap} y2={y} stroke={COLORS.BORDER} strokeWidth="2" opacity="0.5" />
      {INSTALL_STAGES.map((s, i) => {
        const x = startX + i * gap
        const state = i < stageIdx ? 'done' : i === stageIdx ? 'active' : 'pending'
        const color = state === 'pending' ? COLORS.BORDER : state === 'active' ? COLORS.ADMIN : COLORS.SUCCESS
        return (
          <g key={s.id} transform={'translate(' + x + ' ' + y + ')'}>
            <circle r="22" fill={COLORS.PANEL_ALT} stroke={color} strokeWidth={state === 'active' ? 2.6 : 1.6} opacity={state === 'pending' ? 0.55 : 1} />
            {state === 'active' && (
              <circle r="22" fill="none" stroke={color} strokeWidth="1.4" opacity="0.5">
                <animate attributeName="r" values="22;30;22" dur="0.9s" repeatCount="indefinite" />
                <animate attributeName="opacity" values="0.5;0;0.5" dur="0.9s" repeatCount="indefinite" />
              </circle>
            )}
            <image href={getIcon(INSTALL_STAGE_ICON[s.id])} x="-14" y="-14" width="28" height="28" opacity={state === 'pending' ? 0.55 : 1} />
            <text x="0" y="40" textAnchor="middle" fontFamily="monospace" fontWeight={state === 'active' ? '700' : '500'} fontSize="10" fill={state === 'pending' ? COLORS.MUTED : COLORS.TEXT}>{s.label}</text>
          </g>
        )
      })}
      {stageIdx === 1 && (
        <g transform={'translate(366 ' + (y + 84) + ')'}>
          {UNPACK_FILES.slice(0, unpackedCount).map((f, i) => (
            <g key={f.id} transform={'translate(' + (-165 + i * 110) + ' 0)'}>
              <rect x="-46" y="-15" width="92" height="30" rx="7" fill={COLORS.PANEL} stroke={COLORS.SUCCESS} strokeWidth="1.4" />
              <text x="0" y="4" textAnchor="middle" fontFamily="monospace" fontSize="9.5" fill={COLORS.SUCCESS}>{f.label}</text>
            </g>
          ))}
        </g>
      )}
    </g>
  )
}

// ── Act 8 — ledger mencatat installed, lalu app tile aktif. Lifecycle
// actions (update/remove) membuktikan manager masih dibutuhkan setelahnya
// (revisi bagian 6 & 7). ──
const ReadyPanel = ({ visible, ledgerStamped, tileReady }) => {
  if (!visible) return null
  const cy = (ZONE.CLOSING.yStart + ZONE.CLOSING.yEnd) / 2
  return (
    <g transform={'translate(366 ' + cy + ')'}>
      <rect x="-260" y="-38" width="240" height="76" rx="14" fill={COLORS.PANEL_ALT} stroke={ledgerStamped ? COLORS.SUCCESS : COLORS.BORDER} strokeWidth="1.8" />
      <text x="-140" y="-10" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="10" fill={COLORS.MUTED}>package database</text>
      <text x="-140" y="14" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="12" fill={ledgerStamped ? COLORS.SUCCESS : COLORS.MUTED}>{ledgerStamped ? 'editor-lite \u2192 installed' : 'menunggu record...'}</text>
      <rect x="20" y="-38" width="240" height="76" rx="14" fill={COLORS.PANEL_ALT} stroke={tileReady ? COLORS.SUCCESS : COLORS.BORDER} strokeWidth="1.8" opacity={tileReady ? 1 : 0.5} />
      <text x="140" y="-10" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="10" fill={COLORS.MUTED}>app tile</text>
      <text x="140" y="14" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="12" fill={tileReady ? COLORS.SUCCESS : COLORS.MUTED}>{tileReady ? 'editor-lite siap dibuka' : 'menunggu ledger...'}</text>
      {tileReady && LIFECYCLE_ACTIONS.map((a, i) => (
        <g key={a.id} transform={'translate(' + (100 + i * 62) + ' 46)'}>
          <rect x="-26" y="-12" width="52" height="24" rx="12" fill={COLORS.PANEL} stroke={COLORS.MUTED} strokeWidth="1.2" />
          <text x="0" y="4" textAnchor="middle" fontFamily="monospace" fontSize="9.5" fill={COLORS.MUTED}>{a.label}</text>
        </g>
      ))}
    </g>
  )
}

export default function InstallApplicationsAnimation({
  paused = false,
  speed = 1,
  volume = 75,
  previewSfx = true,
  audioUnlocked = false,
}) {
  const tlRef = useRef(null)
  const volumeRef = useRef(volume)
  const speedRef = useRef(speed)
  const audioUnlockedRef = useRef(audioUnlocked)

  const [phaseIdx, setPhaseIdx] = useState(0)
  const [morphP, setMorphP] = useState(0)
  const [contentStarted, setContentStarted] = useState(false)
  const [bodyOpacity, setBodyOpacity] = useState(0)

  const [caption, setCaption] = useState('')
  const [captionAnchor, setCaptionAnchor] = useState({ x: 366, y: (ZONE.CAPTION.yStart + ZONE.CAPTION.yEnd) / 2 })
  const [captionColor, setCaptionColor] = useState(COLORS.INTRO_A)

  const [history, setHistory] = useState([])
  const [activePrompt, setActivePrompt] = useState('')
  const [typingActive, setTypingActive] = useState(false)

  const [hubState, setHubState] = useState('idle')
  const [managerLabel, setManagerLabel] = useState('')
  const [cardPos, setCardPos] = useState({ x: HUB_CENTER.x + 130, y: HUB_CENTER.y })
  const [cardBadge, setCardBadge] = useState('need')

  const [distroActiveId, setDistroActiveId] = useState(null)
  const [distroSettledId, setDistroSettledId] = useState(null)
  const [distroPreview, setDistroPreview] = useState(null)
  const [managerActiveId, setManagerActiveId] = useState(null)
  const [managerBadgeVisible, setManagerBadgeVisible] = useState(false)

  const [networkVisible, setNetworkVisible] = useState(false)
  const [pulseVisible, setPulseVisible] = useState(false)
  const [pulsePos, setPulsePos] = useState(NETWORK_CENTER)
  const [metadataArrived, setMetadataArrived] = useState(false)

  const [sourceVisible, setSourceVisible] = useState(false)
  const [sourceActiveId, setSourceActiveId] = useState(null)

  const [planVisible, setPlanVisible] = useState(false)
  const [depCount, setDepCount] = useState(0)
  const [planReady, setPlanReady] = useState(false)
  const [gateState, setGateState] = useState('hidden')

  const [downloadVisible, setDownloadVisible] = useState(false)
  const [capsuleP, setCapsuleP] = useState(0)
  const [progressPct, setProgressPct] = useState(0)

  const [installVisible, setInstallVisible] = useState(false)
  const [stageIdx, setStageIdx] = useState(0)
  const [unpackedCount, setUnpackedCount] = useState(0)

  const [readyVisible, setReadyVisible] = useState(false)
  const [ledgerStamped, setLedgerStamped] = useState(false)
  const [tileReady, setTileReady] = useState(false)

  const play = (entry) => {
    if (!audioUnlockedRef.current || !entry) return
    sfxLoader.play(entry.category, entry.name, { volume: volumeRef.current, speed: speedRef.current })
  }

  useEffect(() => {
    volumeRef.current = volume
    speedRef.current = speed
    audioUnlockedRef.current = audioUnlocked
    sfxLoader.setEnabled(Boolean(previewSfx && audioUnlocked))
  }, [volume, speed, previewSfx, audioUnlocked])

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.6 })
    tlRef.current = tl
    window.__animationTimeline = tl

    const addLine = (text, colorKey) => setHistory((prev) => [...prev, { text, colorKey }].slice(-3))
    const CAPTION_Y = (ZONE.CAPTION.yStart + ZONE.CAPTION.yEnd) / 2
    const setCap = (text, anchorX, anchorY, color, at) => {
      tl.add(() => { setCaption(text); setCaptionAnchor({ x: anchorX, y: anchorY }); setCaptionColor(color) }, at)
    }
    const cardMove = (fromX, fromY, toX, toY, at, dur) => {
      const proxy = { x: fromX, y: fromY }
      tl.to(proxy, {
        x: toX, y: toY, duration: dur, ease: 'power2.inOut',
        onUpdate: () => setCardPos({ x: proxy.x, y: proxy.y }),
      }, at)
    }

    tl.add(() => {
      setPhaseIdx(0); setMorphP(0); setContentStarted(false); setBodyOpacity(0)
      setCaption(''); setCaptionAnchor({ x: 366, y: CAPTION_Y }); setCaptionColor(COLORS.INTRO_A)
      setHistory([]); setActivePrompt(''); setTypingActive(false)
      setHubState('idle'); setManagerLabel(''); setCardPos({ x: HUB_CENTER.x + 140, y: HUB_CENTER.y }); setCardBadge('need')
      setDistroActiveId(null); setDistroSettledId(null); setManagerActiveId(null); setManagerBadgeVisible(false)
      setDistroPreview(null)
      setNetworkVisible(false); setPulseVisible(false); setPulsePos(NETWORK_CENTER); setMetadataArrived(false)
      setSourceVisible(false); setSourceActiveId(null)
      setPlanVisible(false); setDepCount(0); setPlanReady(false); setGateState('hidden')
      setDownloadVisible(false); setCapsuleP(0); setProgressPct(0)
      setInstallVisible(false); setStageIdx(0); setUnpackedCount(0)
      setReadyVisible(false); setLedgerStamped(false); setTileReady(false)
    }, 0)


    // ═══════════════════════════════════════════════════════════════
    // INTRO — header morph hero -> compact, lalu body fade-in
    // ═══════════════════════════════════════════════════════════════
    const morphProxy = { p: 0 }
    tl.to(morphProxy, {
      p: 1, duration: 0.9, ease: 'power3.inOut',
      onUpdate: () => setMorphP(morphProxy.p),
    }, 0.2)
    tl.add(() => setContentStarted(true), 1.0)
    const bodyFade = { v: 0 }
    tl.to(bodyFade, {
      v: 1, duration: 0.6, ease: 'power1.out',
      onUpdate: () => setBodyOpacity(bodyFade.v),
    }, 1.0)
    tl.add(() => play(SFX_MAP.SHIMMER), 1.0)

    const actStart = []
    actStart[0] = 1.7
    for (let i = 1; i < PHASES.length; i += 1) actStart[i] = actStart[i - 1] + PHASES[i - 1].duration

    const cap = (text, color, at) => tl.add(() => {
      setCaption(text)
      setCaptionAnchor({ x: 366, y: CAPTION_Y })
      setCaptionColor(color)
    }, at)

    const travelPulse = (from, to, at, dur, onArrive) => {
      const p = { v: 0 }
      tl.add(() => { setPulseVisible(true); setPulsePos({ x: from.x, y: from.y }); play(SFX_MAP.SWOOSH) }, at)
      tl.to(p, {
        v: 1, duration: dur, ease: 'power1.inOut',
        onUpdate: () => setPulsePos({ x: lerp(from.x, to.x, p.v), y: lerp(from.y, to.y, p.v) }),
      }, at)
      if (onArrive) tl.add(() => { setPulseVisible(false); onArrive() }, at + dur)
    }

    // ═══════════════════════════════════════════════════════════════
    // ACT 1 — Distro menentukan ekosistem (12.0s)
    // ═══════════════════════════════════════════════════════════════
    const a1 = actStart[0]
    cap(CAPTIONS.DISTRO, COLORS.INTRO_A, a1)
    tl.add(() => {
      setPhaseIdx(0)
      setHubState('idle')
      setManagerLabel('')
      setCardBadge('distro')
      setDistroActiveId(null)
      setDistroSettledId(null)
      setManagerActiveId(null)
      setManagerBadgeVisible(false)
      addLine(TERMINAL_LINES.REQUEST, 'muted')
    }, a1)
    // command konseptual diketik lalu jadi history (bukan command runnable)
    tl.add(() => { setActivePrompt('install editor-lite'); setTypingActive(true) }, a1 + 0.2)
    tl.add(() => {
      setActivePrompt(''); setTypingActive(false)
      addLine('install editor-lite', 'text')
      play(SFX_MAP.TICK)
    }, a1 + 0.2 + TYPE_DUR)
    tl.add(() => addLine(TERMINAL_LINES.OUT_DISTRO, 'muted'), a1 + 1.1)
    // carousel distro — satu keluarga fokus per beat, sisanya redup konteks
    DISTROS.forEach((d, i) => {
      tl.add(() => {
        setDistroActiveId(d.id)
        setDistroSettledId(null)
        // revisi 04: preview manager+format langsung saat distro itu fokus
        setDistroPreview({ managerId: d.managerId, pkgFormat: d.pkgFormat, color: d.color })
        play(SFX_MAP.POP)
      }, a1 + 1.4 + i * 1.5)
    })
    // pilihan demo: Ubuntu (apt/.deb) sebagai titik akhir Act 1
    tl.add(() => {
      setDistroActiveId('ubuntu')
      setDistroPreview({ managerId: 'apt', pkgFormat: '.deb', color: '#E95420' })
      play(SFX_MAP.POP)
    }, a1 + 1.4 + DISTROS.length * 1.5)
    tl.add(() => {
      setDistroActiveId(null)
      setDistroSettledId('ubuntu')
    }, a1 + 1.4 + DISTROS.length * 1.5 + 0.7)

    // ═══════════════════════════════════════════════════════════════
    // ACT 2 — Manager punya tugas sama (18.0s)
    // ═══════════════════════════════════════════════════════════════
    const a2 = actStart[1]
    cap(CAPTIONS.MANAGER, COLORS.ACTIVITY, a2)
    tl.add(() => {
      setPhaseIdx(1)
      setHubState('manager')
      setManagerBadgeVisible(false)
      setManagerActiveId(null)
      addLine(TERMINAL_LINES.OUT_MANAGER, 'muted')
    }, a2)
    // carousel lima stasiun manager — satu active per beat, badge persamaan
    MANAGERS.forEach((m, i) => {
      tl.add(() => {
        setManagerActiveId(m.id)
        setManagerLabel(m.label)
        setManagerBadgeVisible(true)
        play(SFX_MAP.POP)
      }, a2 + 0.8 + i * 2.4)
    })
    // demo memakai apt; takeaway persamaan setelah kelima stasiun terbaca
    tl.add(() => { setManagerActiveId('apt'); play(SFX_MAP.POP) }, a2 + 0.8 + MANAGERS.length * 2.4)
    tl.add(() => {
      setManagerLabel('apt')
      setCardBadge('manager-known')
    }, a2 + 0.8 + MANAGERS.length * 2.4 + 0.7)
    cap(MANAGER_TAKEAWAY, COLORS.ACTIVITY, a2 + 0.8 + MANAGERS.length * 2.4 + 0.7)

    // ═══════════════════════════════════════════════════════════════
    // ACT 3 — Repository berada di jaringan (14.0s)
    // ═══════════════════════════════════════════════════════════════
    const a3 = actStart[2]
    const officialPos = { x: NETWORK_CENTER.x - 130, y: NETWORK_CENTER.y }
    const mirrorPos = { x: NETWORK_CENTER.x + 130, y: NETWORK_CENTER.y }
    const hubAnchor = { x: HUB_CENTER.x, y: HUB_CENTER.y }
    cap(CAPTIONS.NETWORK, COLORS.NETWORK, a3)
    tl.add(() => {
      setPhaseIdx(2)
      setHubState('network')
      setNetworkVisible(true)
      setPulseVisible(false)
      setMetadataArrived(false)
      setCardBadge('network')
      // revisi 03 bug fix: Act 2 tidak lagi nangkring begitu Act 3 mulai
      setManagerBadgeVisible(false)
      addLine(TERMINAL_LINES.OUT_NETWORK, 'muted')
    }, a3)
    // request metadata → official repo, lalu metadata kembali → found
    travelPulse(hubAnchor, officialPos, a3 + 1.0, 1.1)
    travelPulse(officialPos, hubAnchor, a3 + 2.7, 1.1, () => {
      setMetadataArrived(true)
      setCardBadge('found')
      addLine(TERMINAL_LINES.OUT_FOUND, 'muted')
      play(SFX_MAP.ARRIVE)
    })
    cap(CAPTIONS.METADATA, COLORS.NETWORK, a3 + 3.8)
    // mirror menyalin repository resmi — request berangkat ke mirror
    cap(CAPTIONS.MIRROR, COLORS.NETWORK, a3 + 4.6)
    travelPulse(hubAnchor, mirrorPos, a3 + 5.2, 1.2)
    // sisa Act 3: metadata/found tampil sebagai hasil yang bisa dibaca

    // ═══════════════════════════════════════════════════════════════
    // ACT 4 — Source punya jenis berbeda (18.0s)
    // ═══════════════════════════════════════════════════════════════
    const a4 = actStart[3]
    cap(CAPTIONS.SOURCES, COLORS.REPO, a4)
    tl.add(() => {
      setPhaseIdx(3)
      setHubState('sources')
      setSourceVisible(true)
      setSourceActiveId(null)
      setCardBadge('sources')
      // revisi 03 bug fix: Act 3 tidak lagi nangkring begitu Act 4 mulai
      setNetworkVisible(false)
      setPulseVisible(false)
      addLine(TERMINAL_LINES.OUT_SOURCES, 'muted')
    }, a4)
    // camera-pan satu per satu: yang tidak dibahas jadi node redup
    REPO_SOURCES.forEach((r, i) => {
      tl.add(() => {
        setSourceActiveId(r.id)
        play(SFX_MAP.POP)
      }, a4 + 0.8 + i * 2.4)
    })
    cap(CAPTIONS.TAKEAWAY, COLORS.REPO, a4 + 0.8 + (REPO_SOURCES.length - 1) * 2.4 + 1.2)

    // ═══════════════════════════════════════════════════════════════
    // ACT 5 — Rencana dulu (14.0s)
    // ═══════════════════════════════════════════════════════════════
    const a5 = actStart[4]
    cap(CAPTIONS.METADATA, COLORS.DEPENDENCY, a5)
    tl.add(() => {
      setPhaseIdx(4)
      setHubState('resolve')
      setPlanVisible(true)
      setDepCount(0)
      setPlanReady(false)
      setGateState('waiting')
      setCardBadge('resolving')
      // revisi 03 bug fix: Act 4 tidak lagi nangkring begitu Act 5 mulai
      setSourceVisible(false)
      addLine(TERMINAL_LINES.OUT_TREE, 'muted')
    }, a5)
    tl.add(() => { setDepCount(1); play(SFX_MAP.POP) }, a5 + 0.9)
    tl.add(() => { setDepCount(2); play(SFX_MAP.POP) }, a5 + 1.8)
    cap(CAPTIONS.PLAN_READY, COLORS.DEPENDENCY, a5 + 2.8)
    tl.add(() => {
      setPlanReady(true)
      setCardBadge('plan-ready')
      addLine(TERMINAL_LINES.OUT_PLAN, 'muted')
      play(SFX_MAP.CONFIRM)
    }, a5 + 2.8)
    // card berpindah ke batas perubahan sistem, menunggu izin
    cardMove(HUB_CENTER.x + 140, HUB_CENTER.y, 366, 655, a5 + 3.4, 0.7)
    cap(CAPTIONS.AUTHORIZE, COLORS.ADMIN, a5 + 4.4)
    tl.add(() => {
      setCardBadge('authorize')
      play(SFX_MAP.LOCK)
    }, a5 + 4.4)
    tl.add(() => {
      setGateState('open')
      addLine(TERMINAL_LINES.OUT_APPROVE, 'muted')
      play(SFX_MAP.UNLOCK)
    }, a5 + 5.6)

    // ═══════════════════════════════════════════════════════════════
    // ACT 6 — Arsip masuk dari internet (14.0s)
    // ═══════════════════════════════════════════════════════════════
    const a6 = actStart[5]
    cap(CAPTIONS.DOWNLOAD, COLORS.NETWORK, a6)
    tl.add(() => {
      setPhaseIdx(5)
      setHubState('download')
      setDownloadVisible(true)
      setCapsuleP(0)
      setProgressPct(0)
      setCardBadge('download')
      // revisi 03 bug fix: Act 5 (plan+gate) tidak lagi nangkring begitu Act 6 mulai
      setPlanVisible(false)
      setGateState('hidden')
      addLine(TERMINAL_LINES.OUT_DOWNLOAD, 'muted')
    }, a6)
    // empat capsule terunduh satu per satu; progress hanya naik saat tiba
    const DOWNLOAD_PASSES = 4
    for (let i = 0; i < DOWNLOAD_PASSES; i += 1) {
      const capsule = { p: 0 }
      const at = a6 + 1.0 + i * 2.1
      tl.to(capsule, {
        p: 1, duration: 1.3, ease: 'power1.inOut',
        onStart: () => play(SFX_MAP.SWOOSH),
        onUpdate: () => setCapsuleP(capsule.p),
      }, at)
      tl.add(() => {
        setCapsuleP(0)
        setProgressPct((i + 1) / DOWNLOAD_PASSES)
        play(SFX_MAP.POP)
      }, at + 1.3)
    }

    // ═══════════════════════════════════════════════════════════════
    // ACT 7 — Pasang sungguhan (20.0s): verify → unpack → configure → record
    // ═══════════════════════════════════════════════════════════════
    const a7 = actStart[6]
    cap(CAPTIONS.VERIFY, COLORS.ADMIN, a7)
    tl.add(() => {
      setPhaseIdx(6)
      setHubState('install')
      setInstallVisible(true)
      setStageIdx(0)
      setUnpackedCount(0)
      setCardBadge('verify')
      // revisi 03 bug fix: Act 6 tidak lagi nangkring begitu Act 7 mulai
      setDownloadVisible(false)
      addLine(TERMINAL_LINES.OUT_VERIFY, 'muted')
      play(SFX_MAP.POP)
    }, a7)
    cap(CAPTIONS.UNPACK, COLORS.ADMIN, a7 + 1.8)
    tl.add(() => {
      setStageIdx(1)
      setCardBadge('unpack')
      addLine(TERMINAL_LINES.OUT_UNPACK, 'muted')
      play(SFX_MAP.POP)
    }, a7 + 1.8)
    // file hasil unpack menempati shelf satu per satu
    for (let i = 0; i < UNPACK_FILES.length; i += 1) {
      tl.add(() => { setUnpackedCount(i + 1); play(SFX_MAP.POP) }, a7 + 2.7 + i * 0.8)
    }
    cap(CAPTIONS.CONFIGURE, COLORS.ADMIN, a7 + 6.4)
    tl.add(() => {
      setStageIdx(2)
      setCardBadge('configure')
      addLine(TERMINAL_LINES.OUT_CONFIGURE, 'muted')
      play(SFX_MAP.POP)
    }, a7 + 6.4)
    cap(CAPTIONS.RECORD, COLORS.ADMIN, a7 + 8.2)
    tl.add(() => {
      setStageIdx(3)
      setCardBadge('record')
      addLine(TERMINAL_LINES.OUT_RECORD, 'muted')
      play(SFX_MAP.POP)
    }, a7 + 8.2)
    // ledger mencatat installed sebelum app tile benar-benar aktif
    tl.add(() => {
      setCardBadge('installed')
      setLedgerStamped(true)
      setReadyVisible(true)
      play(SFX_MAP.CONFIRM)
    }, a7 + 9.6)
    tl.add(() => {
      setTileReady(true)
      play(SFX_MAP.DING)
    }, a7 + 11.2)
    // sisa Act 7: installed state stabil sebelum takeaway

    // ═══════════════════════════════════════════════════════════════
    // ACT 8 — App siap & dapat dikelola (10.0s)
    // ═══════════════════════════════════════════════════════════════
    const a8 = actStart[7]
    cap(CAPTIONS.READY, COLORS.SUCCESS, a8)
    tl.add(() => {
      setPhaseIdx(7)
      setCardBadge('installed')
      // revisi 03 bug fix: Act 7 conveyor tidak lagi nangkring begitu Act 8
      // mulai — ReadyPanel (ledger + app tile) sudah cukup jadi bukti hasil
      setInstallVisible(false)
    }, a8)
    cap(CAPTIONS.TAKEAWAY, COLORS.SUCCESS, a8 + 2.6)
    tl.add(() => {
      play(SFX_MAP.DING)
    }, a8 + 2.6)
    // sisa Act 8 jadi hold takeaway sebelum loop reset

    return () => {
      tl.kill()
      if (window.__animationTimeline === tl) delete window.__animationTimeline
    }
  }, [])

  useEffect(() => {
    const tl = tlRef.current
    if (!tl) return
    tl.timeScale(speed)
    if (paused) tl.pause()
    else tl.resume()
  }, [paused, speed])

  return (
    <svg viewBox={'0 0 ' + VW + ' ' + VH} style={{
      width: '100%', height: '100%', maxHeight: '100vh',
      maxWidth: 'calc(100vh * ' + VW + ' / ' + VH + ')',
      background: COLORS.BG, userSelect: 'none',
    }}>
      <rect width={VW} height={VH} fill={COLORS.BG} />

      <IntroHeaderMorphV1
        progress={morphP}
        categorySegments={[
          { label: INTRO_CATEGORY_LABEL + ' \u00b7 ', color: COLORS.MUTED },
          { label: INTRO_DOMAIN, color: COLORS.INTRO_A },
        ]}
        titleSegments={[
          { label: INTRO_TITLE_A, color: COLORS.INTRO_A },
          { label: INTRO_TITLE_B, color: COLORS.INTRO_B },
        ]}
        subtitle={INTRO_SUBTITLE}
        testId="install-applications-intro"
      />

      {contentStarted && (
        <ActBadgeNavigatorV1 phases={PHASES} activeIndex={phaseIdx} testId="install-applications-navigator" />
      )}

      {contentStarted && (
        <ContentBodyV1 debugName="install-applications-body" clip>
          <g opacity={bodyOpacity}>

            {/* Caption — zona 18-66, anchor mengikuti elemen aktif */}
            <CaptionFollow text={caption} anchorX={captionAnchor.x} anchorY={captionAnchor.y} colorKey={captionColor} />

            {/* Terminal — zona 82-200 */}
            <TerminalPanel history={history} activePrompt={activePrompt} typingActive={typingActive} />

            {/* Hub — zona 216-358: package manager hub + package card persisten */}
            {/* revisi 04: flow spine dari hub turun ke zona Act aktif */}
            <FlowSpine phaseIdx={phaseIdx} color={PHASES[phaseIdx] ? PHASES[phaseIdx].badgeColor : COLORS.BORDER} />
            <PackageManagerHub x={HUB_CENTER.x} y={HUB_CENTER.y} state={hubState} managerLabel={managerLabel} />
            <PackageCard x={cardPos.x} y={cardPos.y} badgeKey={cardBadge} manager={managerLabel} />
            <DistroPreviewBadge visible={phaseIdx === 0} preview={distroPreview} />

            {/* Act 1 — distro carousel (satu keluarga per beat) */}
            <DistroCarousel y={CAROUSEL_Y} activeId={distroActiveId} settledId={distroSettledId} visible={phaseIdx === 0} />

            {/* Act 2 — manager carousel + badge format/persamaan */}
            <ManagerCarousel y={CAROUSEL_Y} activeId={managerActiveId} visible={managerBadgeVisible} />
            <ManagerBadge visible={managerBadgeVisible} manager={MANAGERS.find((m) => m.id === managerActiveId)} />

            {/* Act 3 — repository berada di jaringan */}
            <NetworkMap visible={networkVisible} pulsePos={pulsePos} pulseVisible={pulseVisible} metadataArrived={metadataArrived} />

            {/* Act 4 — source punya jenis berbeda */}
            <SourceLane visible={sourceVisible} activeId={sourceActiveId} />

            {/* Act 5 — transaction plan + gate izin */}
            <TransactionTray visible={planVisible} depCount={depCount} planReady={planReady} />
            <ApprovalGate state={gateState} />

            {/* Act 6 — arsip masuk dari internet */}
            <DownloadConveyor visible={downloadVisible} capsuleP={capsuleP} progressPct={progressPct} />

            {/* Act 7 — pasang sungguhan */}
            <InstallConveyor visible={installVisible} stageIdx={stageIdx} unpackedCount={unpackedCount} />

            {/* Act 8 — app siap & dapat dikelola */}
            <ReadyPanel visible={readyVisible} ledgerStamped={ledgerStamped} tileReady={tileReady} />

          </g>
        </ContentBodyV1>
      )}
    </svg>
  )
}
