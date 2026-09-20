// src/content/37-user-group-access/Animation.jsx
// Implementasi Revisi 01 (2026-09-16) — mengikuti revisi/2026-09-16-revisi-01-dense-user-access-flow.md
// Tujuh Act: identity masuk -> group membentuk konteks -> resource punya metadata ->
// resolver memilih kelas -> file bukan directory -> policy admin terpisah -> bukti & kembali normal.
// Karakter kedua: Yono Bakrie. Group project-team TIDAK PERNAH digambarkan sebagai pemberi izin sudo.

import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import {
  VW, VH, COLORS, ZONE, PHASES, CAPTIONS, SFX_MAP,
  USERS, SUPPLEMENTARY_GROUP, RESOURCE_DIR, RESOURCE_FILE,
  RESOLVER_REQUESTS, RESOLVER_LANES, SEMANTIC_FILE, SEMANTIC_DIR,
  ADMIN_ACTION, AUDIT_ENTRY,
  CARD_ADIB, CARD_YONO, GROUP_CENTER,
  RESOURCE_DIR_CENTER, RESOURCE_FILE_CENTER,
  RESOLVER_TOP, RESOLVER_LANES_Y,
  TYPE_FILE_CENTER, TYPE_DIR_CENTER,
  GATE_CENTER, LEDGER_CENTER, CLOSING_CENTER,
  INTRO_CATEGORY_LABEL, INTRO_DOMAIN, INTRO_TITLE_A, INTRO_TITLE_B, INTRO_SUBTITLE,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'
import {
  IntroHeaderMorphV1,
  ActBadgeNavigatorV1,
  ContentBodyV1,
  lerp,
} from '../../shared/scene-ui/v1'

const TYPE_DUR = 0.5

// ── Caption bar (top) ──────────────────────────────────────────
const CaptionBar = ({ text, colorKey }) => {
  if (!text) return null
  const y = (ZONE.CAPTION.yStart + ZONE.CAPTION.yEnd) / 2
  return (
    <g transform={`translate(366 ${y})`}>
      <rect x="-300" y="-23" width="600" height="46" rx="20" fill={COLORS.PANEL} stroke={colorKey || COLORS.BORDER} strokeWidth="1.5" opacity="0.96" />
      <text x="0" y="6" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="13.5" fill={COLORS.TEXT}>{text}</text>
    </g>
  )
}

// ── UserCard — Kartu identitas persisten Adib & Yono Bakrie (Act 1-7). ──
const UserCard = ({ x, y, user, active, pop, meta1, groupLabel, processP }) => {
  const ring = active ? COLORS.USER : COLORS.BORDER
  const avatarChar = user.label[0]
  return (
    <g transform={`translate(${x} ${y})`} opacity={pop}>
      <rect x="-79" y="-44" width="158" height="92" rx="14" fill={COLORS.PANEL} stroke={ring} strokeWidth={active ? 2.4 : 1.4} opacity={active ? 1 : 0.85} />
      <circle cx="-54" cy="-16" r="16" fill="none" stroke={ring} strokeWidth="2" />
      <text x="-54" y="-11" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="12" fill={COLORS.TEXT}>{avatarChar}</text>
      <text x="-26" y="-12" fontFamily="monospace" fontWeight="700" fontSize="13" fill={COLORS.TEXT}>{user.label}</text>

      {meta1 && (
        <text x="0" y="8" textAnchor="middle" fontFamily="monospace" fontSize="9.5" fill={COLORS.MUTED}>{meta1}</text>
      )}

      {groupLabel && (
        <text x="0" y="24" textAnchor="middle" fontFamily="monospace" fontSize="9.5" fontWeight="700" fill={COLORS.GROUP}>{'\u002b ' + groupLabel}</text>
      )}

      {active && (
        <circle r="60" fill="none" stroke={COLORS.USER} strokeWidth="1.2" opacity="0.4">
          <animate attributeName="r" values="58;70;58" dur="1.4s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.35;0;0.35" dur="1.4s" repeatCount="indefinite" />
        </circle>
      )}

      {processP > 0 && (
        <g transform="translate(0 38)" opacity={processP}>
          <rect x="-56" y="-9" width="112" height="18" rx="9" fill={COLORS.PANEL_ALT} stroke={COLORS.USER} strokeWidth="1.2" />
          <text x="0" y="3" textAnchor="middle" fontFamily="monospace" fontSize="9" fontWeight="700" fill={COLORS.USER}>process: bash</text>
        </g>
      )}
    </g>
  )
}

// ── GroupRoster — Act 2: Roster project-team & connector dua arah. ──
const GroupRoster = ({ popP, connectorP, activePulse }) => {
  if (popP <= 0) return null
  const from1 = { x: CARD_ADIB.x, y: CARD_ADIB.y + 48 }
  const from2 = { x: CARD_YONO.x, y: CARD_YONO.y + 48 }
  const to = { x: GROUP_CENTER.x, y: GROUP_CENTER.y - 20 }

  const c1x = from1.x + (to.x - from1.x) * connectorP
  const c1y = from1.y + (to.y - from1.y) * connectorP
  const c2x = from2.x + (to.x - from2.x) * connectorP
  const c2y = from2.y + (to.y - from2.y) * connectorP

  return (
    <g opacity={popP}>
      <line x1={from1.x} y1={from1.y} x2={c1x} y2={c1y} stroke={COLORS.GROUP} strokeWidth="2" strokeDasharray="4 4" opacity={connectorP > 0 ? 0.85 : 0} />
      <line x1={from2.x} y1={from2.y} x2={c2x} y2={c2y} stroke={COLORS.GROUP} strokeWidth="2" strokeDasharray="4 4" opacity={connectorP > 0 ? 0.85 : 0} />

      <g transform={`translate(${GROUP_CENTER.x} ${GROUP_CENTER.y})`}>
        <rect x="-90" y="-22" width="180" height="44" rx="22" fill={COLORS.PANEL_ALT} stroke={COLORS.GROUP} strokeWidth="2" />
        <circle cx="-62" cy="0" r="7" fill={COLORS.GROUP} opacity="0.85" />
        <circle cx="-48" cy="0" r="7" fill={COLORS.GROUP} opacity="0.55" />
        <text x="10" y="-3" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="12" fill={COLORS.TEXT}>{SUPPLEMENTARY_GROUP.label}</text>
        <text x="10" y="11" textAnchor="middle" fontFamily="monospace" fontSize="8.5" fill={COLORS.MUTED}>supplementary group</text>
        {activePulse > 0 && (
          <circle r="30" fill="none" stroke={COLORS.GROUP} strokeWidth="1.2" opacity="0.5">
            <animate attributeName="r" values="24;36;24" dur="1.2s" repeatCount="indefinite" />
            <animate attributeName="opacity" values="0.5;0;0.5" dur="1.2s" repeatCount="indefinite" />
          </circle>
        )}
      </g>
    </g>
  )
}

// ── ResourceCard — Act 3-5: Kartu file / directory dengan birth tags. ──
const ResourceCard = ({ center, item, visible, ownerP, groupP, modeP, isDir }) => {
  if (!visible) return null
  const ownerLabel = item.owner === 'yono-bakrie' ? 'Yono Bakrie' : item.owner
  const accent = isDir ? COLORS.GROUP : COLORS.USER
  return (
    <g transform={`translate(${center.x} ${center.y})`}>
      <rect x="-75" y="-28" width="150" height="56" rx="12" fill={COLORS.PANEL} stroke={accent} strokeWidth="1.6" />
      {isDir ? (
        <path d="M-60,-14 L-44,-14 L-38,-8 L-22,-8 L-22,10 L-60,10 Z" fill="none" stroke={accent} strokeWidth="1.4" />
      ) : (
        <path d="M-56,-14 L-34,-14 L-26,-6 L-26,12 L-56,12 Z" fill="none" stroke={accent} strokeWidth="1.4" />
      )}
      <text x="14" y="-2" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="11.5" fill={COLORS.TEXT}>{item.label}</text>
      <text x="14" y="12" textAnchor="middle" fontFamily="monospace" fontSize="8.5" fill={COLORS.MUTED}>{item.kind}</text>

      {ownerP > 0 && (
        <g transform="translate(-37 14)" opacity={ownerP}>
          <rect x="-33" y="-7" width="66" height="14" rx="7" fill={COLORS.PANEL_ALT} stroke={COLORS.USER} strokeWidth="1" />
          <text x="0" y="3" textAnchor="middle" fontFamily="monospace" fontSize="7.5" fill={COLORS.USER}>{'own:' + ownerLabel.split(' ')[0]}</text>
        </g>
      )}

      {groupP > 0 && (
        <g transform="translate(37 14)" opacity={groupP}>
          <rect x="-33" y="-7" width="66" height="14" rx="7" fill={COLORS.PANEL_ALT} stroke={COLORS.GROUP} strokeWidth="1" />
          <text x="0" y="3" textAnchor="middle" fontFamily="monospace" fontSize="7.5" fill={COLORS.GROUP}>grp:project</text>
        </g>
      )}

      {modeP > 0 && (
        <text x="0" y="44" textAnchor="middle" fontFamily="monospace" fontSize="8.5" fill={COLORS.MUTED} opacity={modeP}>mode seed dari context</text>
      )}
    </g>
  )
}

// ── ResolverLanes — Act 4: Tiga track (owner, group, others) & result. ──
const ResolverLanes = ({ visible, activeLane, resultText }) => {
  if (!visible) return null
  const laneXList = [146, 366, 586]
  return (
    <g>
      <text x="366" y={RESOLVER_TOP.y} textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="11" fill={COLORS.MUTED}>class rule yang dipilih per request</text>
      {RESOLVER_LANES.map((lane, i) => {
        const lx = laneXList[i]
        const active = lane.id === activeLane
        const strokeColor = active ? lane.color : COLORS.BORDER
        return (
          <g key={lane.id}>
            <rect x={lx - 75} y={RESOLVER_LANES_Y - 26} width="150" height="104" rx="12" fill={active ? COLORS.PANEL_ALT : COLORS.PANEL} stroke={strokeColor} strokeWidth={active ? 2.4 : 1.2} opacity={active ? 1 : 0.45} />
            <text x={lx} y={RESOLVER_LANES_Y - 10} textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="11" fill={active ? lane.color : COLORS.MUTED}>{lane.label}</text>
            <text x={lx} y={RESOLVER_LANES_Y + 8} textAnchor="middle" fontFamily="monospace" fontSize="8.5" fill={COLORS.MUTED}>{lane.id + ' class'}</text>
            {active && (
              <circle cx={lx} cy={RESOLVER_LANES_Y + 34} r="8" fill={lane.color}>
                <animate attributeName="r" values="6;10;6" dur="0.9s" repeatCount="indefinite" />
              </circle>
            )}
          </g>
        )
      })}
      {activeLane && resultText && (
        <g transform="translate(366 594)">
          <rect x="-180" y="-14" width="360" height="28" rx="14" fill={COLORS.PANEL_ALT} stroke={COLORS.SUCCESS} strokeWidth="1.5" />
          <text x="0" y="4" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="10.5" fill={COLORS.SUCCESS}>{resultText}</text>
        </g>
      )}
    </g>
  )
}

// ── RequestCapsule — Capsule request yang bergerak Act 4. ──
const RequestCapsule = ({ x, y, visible, label, requester }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-80" y="-14" width="160" height="28" rx="14" fill={COLORS.PANEL_ALT} stroke={COLORS.USER} strokeWidth="1.8" />
      <circle cx="-60" cy="0" r="6" fill={COLORS.USER} />
      <text x="-48" y="4" fontFamily="monospace" fontWeight="700" fontSize="9.5" fill={COLORS.TEXT}>{requester}</text>
      <text x="8" y="4" fontFamily="monospace" fontSize="9.5" fill={COLORS.INTRO_A}>{label}</text>
    </g>
  )
}

// ── SemanticPanel — Act 5: Perbandingan rwx file vs directory. ──
const SemanticPanel = ({ center, title, rows, visibleRows, accent }) => {
  if (visibleRows <= 0) return null
  return (
    <g transform={`translate(${center.x} ${center.y})`}>
      <rect x="-110" y="-55" width="220" height="110" rx="14" fill={COLORS.PANEL_ALT} stroke={accent} strokeWidth="1.6" />
      <text x="0" y="-36" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="10" fill={accent}>{title}</text>
      {rows.map((r, i) => {
        if (i >= visibleRows) return null
        const ry = -14 + i * 22
        return (
          <g key={r.token} transform={`translate(0 ${ry})`}>
            <rect x="-96" y="-8" width="20" height="16" rx="4" fill={COLORS.PANEL} stroke={accent} strokeWidth="1.2" />
            <text x="-86" y="4" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="10" fill={accent}>{r.token}</text>
            <text x="-68" y="4" fontFamily="monospace" fontSize="9" fill={COLORS.TEXT}>{r.text}</text>
          </g>
        )
      })}
    </g>
  )
}

// ── AdminGate — Act 6: Gerbang policy sudo (terpisah dari group proyek). ──
const AdminGate = ({ state }) => {
  if (state === 'hidden') return null
  const color = state === 'granted' ? COLORS.SUCCESS : state === 'closed' ? COLORS.BORDER : COLORS.WAITING
  const label = state === 'waiting' ? 'kebijakan sudo menilai request system'
    : state === 'scanning' ? 'policy membaca identity + scope'
    : state === 'granted' ? 'izin sementara: satu action'
    : 'gate ditutup'
  return (
    <g transform={`translate(${GATE_CENTER.x} ${GATE_CENTER.y})`} opacity={state === 'closed' ? 0.35 : 1}>
      <rect x="-140" y="-28" width="280" height="56" rx="14" fill={COLORS.PANEL_ALT} stroke={color} strokeWidth="2" />
      <rect x="-124" y="-10" width="20" height="20" rx="4" fill="none" stroke={color} strokeWidth="2" />
      <circle cx="-114" cy="0" r="3" fill={color} />
      {state === 'scanning' && (
        <circle cx="-114" cy="0" r="16" fill="none" stroke={color} strokeWidth="1.2">
          <animate attributeName="r" values="10;20;10" dur="1s" repeatCount="indefinite" />
        </circle>
      )}
      <text x="10" y="4" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="10.5" fill={color}>{label}</text>
    </g>
  )
}

// ── ActionChip — Act 6: Capsule aksi sistem yang membutuhkan elevasi. ──
const ActionChip = ({ visible }) => {
  if (!visible) return null
  return (
    <g transform="translate(530 840)">
      <rect x="-56" y="-18" width="112" height="36" rx="10" fill={COLORS.PANEL} stroke={COLORS.ADMIN} strokeWidth="1.6" />
      <text x="0" y="4" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="9.5" fill={COLORS.ADMIN}>ubah sistem</text>
    </g>
  )
}

// ── TempKey — Act 6: Travel key dari gate ke action chip. ──
const TempKey = ({ state, travelP }) => {
  if (state === 'hidden' || state === 'released') return null
  const start = { x: GATE_CENTER.x, y: GATE_CENTER.y }
  const end = { x: 530, y: GATE_CENTER.y }
  const p = state === 'attached' ? 1 : travelP
  const x = start.x + (end.x - start.x) * p
  return (
    <g transform={`translate(${x} ${GATE_CENTER.y})`}>
      <circle r="8" fill="none" stroke={COLORS.SUCCESS} strokeWidth="2" />
      <line x1="6" y1="0" x2="18" y2="0" stroke={COLORS.SUCCESS} strokeWidth="2" />
      <line x1="14" y1="0" x2="14" y2="5" stroke={COLORS.SUCCESS} strokeWidth="2" />
    </g>
  )
}

// ── AuditLedger — Act 7: Pencatatan bukti audit admin. ──
const AuditLedger = ({ visible, stamped }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${LEDGER_CENTER.x} ${LEDGER_CENTER.y})`}>
      <rect x="-150" y="-24" width="300" height="48" rx="12" fill={COLORS.PANEL_ALT} stroke={stamped ? COLORS.SUCCESS : COLORS.BORDER} strokeWidth="1.6" />
      <text x="0" y="-8" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="9.5" fill={COLORS.MUTED}>audit ledger</text>
      <text x="0" y="8" textAnchor="middle" fontFamily="monospace" fontSize="10" fill={stamped ? COLORS.SUCCESS : COLORS.TEXT}>
        {AUDIT_ENTRY.actorLabel + ' \u00b7 ' + AUDIT_ENTRY.resultLabel}
      </text>
      {stamped && (
        <g transform="translate(130 0)">
          <circle r="9" fill={COLORS.SUCCESS} />
          <path d="M-4,0 L-1,3 L4,-4" stroke={COLORS.BG} strokeWidth="1.8" fill="none" />
        </g>
      )}
    </g>
  )
}

// ── ClosingMap — Act 7 penutup: Identity → rule → policy seperlunya. ──
const ClosingMap = ({ visible }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${CLOSING_CENTER.x} ${CLOSING_CENTER.y})`}>
      <rect x="-210" y="-17" width="420" height="34" rx="17" fill={COLORS.PANEL_ALT} stroke={COLORS.SUCCESS} strokeWidth="1.6" />
      <text x="0" y="5" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="11" fill={COLORS.SUCCESS}>
        Identity \u2192 rule \u2192 policy seperlunya
      </text>
    </g>
  )
}

export default function UserGroupAccessAnimation({
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
  const [captionColor, setCaptionColor] = useState(COLORS.INTRO_A)

  const [adibPop, setAdibPop] = useState(0)
  const [yonoPop, setYonoPop] = useState(0)
  const [adibActive, setAdibActive] = useState(false)
  const [yonoActive, setYonoActive] = useState(false)
  const [adibMeta, setAdibMeta] = useState('')
  const [yonoMeta, setYonoMeta] = useState('')
  const [adibGroup, setAdibGroup] = useState('')
  const [yonoGroup, setYonoGroup] = useState('')
  const [adibProcessP, setAdibProcessP] = useState(0)
  const [yonoProcessP, setYonoProcessP] = useState(0)

  const [rosterP, setRosterP] = useState(0)
  const [connectorP, setConnectorP] = useState(0)
  const [rosterPulse, setRosterPulse] = useState(0)

  const [dirVisible, setDirVisible] = useState(false)
  const [fileVisible, setFileVisible] = useState(false)
  const [dirOwnerP, setDirOwnerP] = useState(0)
  const [dirGroupP, setDirGroupP] = useState(0)
  const [fileOwnerP, setFileOwnerP] = useState(0)
  const [fileGroupP, setFileGroupP] = useState(0)
  const [modeP, setModeP] = useState(0)

  const [reqVisible, setReqVisible] = useState(false)
  const [reqPos, setReqPos] = useState({ x: 196, y: 187 })
  const [reqLabel, setReqLabel] = useState('')
  const [reqRequester, setReqRequester] = useState('')

  const [resolverActive, setResolverActive] = useState(null)
  const [resultText, setResultText] = useState('')

  const [fileRows, setFileRows] = useState(0)
  const [dirRows, setDirRows] = useState(0)

  const [actionVisible, setActionVisible] = useState(false)
  const [gateState, setGateState] = useState('hidden')
  const [keyState, setKeyState] = useState('hidden')
  const [keyTravelP, setKeyTravelP] = useState(0)
  const [adminNoteP, setAdminNoteP] = useState(0)

  const [ledgerVisible, setLedgerVisible] = useState(false)
  const [ledgerStamped, setLedgerStamped] = useState(false)
  const [closingVisible, setClosingVisible] = useState(false)

  const play = (entry) => {
    if (!audioUnlockedRef.current || !entry) return
    sfxLoader.play(entry.category, entry.name, {
      volume: volumeRef.current,
      speed: speedRef.current,
    })
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

    const cap = (text, color, at) => tl.add(() => {
      setCaption(text)
      setCaptionColor(color)
    }, at)

    const to1 = (setter, at, dur = 0.45, entry, ease = 'back.out(1.55)') => {
      const o = { v: 0 }
      tl.to(o, {
        v: 1, duration: dur, ease,
        onStart: () => { if (entry) play(entry) },
        onUpdate: () => setter(o.v),
      }, at)
    }

    // ── Reset awal pada t=0 ──
    tl.add(() => {
      setPhaseIdx(0); setMorphP(0); setContentStarted(false); setBodyOpacity(0)
      setCaption('')
      setAdibPop(0); setYonoPop(0); setAdibActive(false); setYonoActive(false)
      setAdibMeta(''); setYonoMeta(''); setAdibGroup(''); setYonoGroup('')
      setAdibProcessP(0); setYonoProcessP(0)
      setRosterP(0); setConnectorP(0); setRosterPulse(0)
      setDirVisible(false); setFileVisible(false)
      setDirOwnerP(0); setDirGroupP(0); setFileOwnerP(0); setFileGroupP(0); setModeP(0)
      setReqVisible(false); setResolverActive(null); setResultText('')
      setFileRows(0); setDirRows(0)
      setActionVisible(false); setGateState('hidden'); setKeyState('hidden'); setKeyTravelP(0); setAdminNoteP(0)
      setLedgerVisible(false); setLedgerStamped(false); setClosingVisible(false)
    }, 0)

    // Intro header morph
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

    // ── Schedule 7 Act sesuai PHASES durations (sum = 110s) ──
    const actStart = []
    actStart[0] = 1.7
    for (let i = 1; i < PHASES.length; i += 1) actStart[i] = actStart[i - 1] + PHASES[i - 1].duration

    // ═══════════════════════════════════════════════════════════════
    // ACT 1 — Siapa yang masuk? (14.0s)
    // ═══════════════════════════════════════════════════════════════
    const a1 = actStart[0]
    cap(CAPTIONS.IDENTITY, COLORS.USER, a1)
    tl.add(() => setPhaseIdx(0), a1)
    to1(setAdibPop, a1 + 0.5, 0.45, SFX_MAP.POP)
    to1(setYonoPop, a1 + 1.2, 0.45, SFX_MAP.POP2)
    tl.add(() => { setAdibActive(true); setAdibMeta('UID 1001 \u00b7 pts/0'); play(SFX_MAP.TICK) }, a1 + 2.0)
    cap(CAPTIONS.UID, COLORS.USER, a1 + 2.0)
    tl.add(() => { setYonoActive(true); setYonoMeta('UID 1002 \u00b7 pts/1'); play(SFX_MAP.TICK) }, a1 + 3.0)
    to1(setAdibProcessP, a1 + 4.8, 0.4, SFX_MAP.POP)
    to1(setYonoProcessP, a1 + 5.6, 0.4, SFX_MAP.POP2)
    cap(CAPTIONS.IDENTITY, COLORS.USER, a1 + 6.4)

    // ═══════════════════════════════════════════════════════════════
    // ACT 2 — Group membentuk konteks (15.0s)
    // ═══════════════════════════════════════════════════════════════
    const a2 = actStart[1]
    cap(CAPTIONS.GROUP, COLORS.GROUP, a2)
    tl.add(() => {
      setPhaseIdx(1)
      setAdibMeta('UID 1001 \u00b7 primary adib')
      setYonoMeta('UID 1002 \u00b7 primary yono-bakrie')
    }, a2)
    to1(setRosterP, a2 + 1.8, 0.45, SFX_MAP.POP)
    const connObj = { v: 0 }
    tl.to(connObj, {
      v: 1, duration: 1.2, ease: 'power2.out',
      onStart: () => play(SFX_MAP.CONNECTOR_SNAP),
      onUpdate: () => setConnectorP(connObj.v),
    }, a2 + 2.6)
    tl.add(() => {
      setAdibGroup(SUPPLEMENTARY_GROUP.label)
      setYonoGroup(SUPPLEMENTARY_GROUP.label)
      cap(CAPTIONS.GROUP_NOTE, COLORS.GROUP, a2 + 4.0)
      play(SFX_MAP.ARRIVE)
    }, a2 + 4.0)
    to1(setRosterPulse, a2 + 5.0)

    // ═══════════════════════════════════════════════════════════════
    // ACT 3 — Resource punya metadata (15.0s)
    // ═══════════════════════════════════════════════════════════════
    const a3 = actStart[2]
    cap(CAPTIONS.OWNERSHIP, COLORS.GROUP, a3)
    tl.add(() => setPhaseIdx(2), a3)
    to1(setDirVisible, a3 + 0.6, 0.45, SFX_MAP.POP)
    to1(setFileVisible, a3 + 1.3, 0.45, SFX_MAP.POP2)
    to1(setDirOwnerP, a3 + 2.2, 0.4, SFX_MAP.TICK)
    to1(setDirGroupP, a3 + 3.1, 0.4, SFX_MAP.TICK)
    to1(setFileOwnerP, a3 + 4.0, 0.4, SFX_MAP.TICK)
    to1(setFileGroupP, a3 + 4.9, 0.4, SFX_MAP.TICK)
    to1(setModeP, a3 + 5.8, 0.4)

    // ═══════════════════════════════════════════════════════════════
    // ACT 4 — Rule resolver memilih kelas (18.0s)
    // ═══════════════════════════════════════════════════════════════
    const a4 = actStart[3]
    cap(CAPTIONS.RESOLVER, COLORS.OWNER_LANE, a4)
    tl.add(() => {
      setPhaseIdx(3)
      setReqVisible(false)
      setResolverActive(null)
      setResultText('')
    }, a4)

    // Request 1: Adib baca report.md → file → group lane
    const req1 = RESOLVER_REQUESTS[0]
    tl.add(() => {
      setReqVisible(true)
      setReqLabel(req1.actionLabel)
      setReqRequester(req1.userLabel)
      setReqPos({ x: CARD_ADIB.x, y: CARD_ADIB.y + 48 })
      play(SFX_MAP.POP)
    }, a4 + 0.6)
    const p1 = { x: CARD_ADIB.x, y: CARD_ADIB.y + 48 }
    tl.to(p1, {
      x: RESOURCE_FILE_CENTER.x, y: RESOURCE_FILE_CENTER.y, duration: 1.1, ease: 'power2.inOut',
      onUpdate: () => setReqPos({ x: p1.x, y: p1.y }),
    }, a4 + 1.2)
    tl.to(p1, {
      x: 366, y: 540, duration: 1.0, ease: 'power2.inOut',
      onUpdate: () => setReqPos({ x: p1.x, y: p1.y }),
    }, a4 + 2.5)
    tl.add(() => {
      setResolverActive('group')
      setResultText('allowed \u2014 ' + req1.reason)
      cap(CAPTIONS.RESOLVER_ADIB, COLORS.GROUP_LANE, a4 + 3.6)
      play(SFX_MAP.ARRIVE)
    }, a4 + 3.6)
    tl.add(() => setReqVisible(false), a4 + 4.8)

    // Request 2: Yono buka team-notes/ → dir → owner lane
    const req2 = RESOLVER_REQUESTS[1]
    tl.add(() => {
      setReqVisible(true)
      setReqLabel(req2.actionLabel)
      setReqRequester(req2.userLabel)
      setReqPos({ x: CARD_YONO.x, y: CARD_YONO.y + 48 })
      play(SFX_MAP.POP)
    }, a4 + 5.4)
    const p2 = { x: CARD_YONO.x, y: CARD_YONO.y + 48 }
    tl.to(p2, {
      x: RESOURCE_DIR_CENTER.x, y: RESOURCE_DIR_CENTER.y, duration: 1.1, ease: 'power2.inOut',
      onUpdate: () => setReqPos({ x: p2.x, y: p2.y }),
    }, a4 + 6.0)
    tl.to(p2, {
      x: 146, y: 540, duration: 1.0, ease: 'power2.inOut',
      onUpdate: () => setReqPos({ x: p2.x, y: p2.y }),
    }, a4 + 7.2)
    tl.add(() => {
      setResolverActive('owner')
      setResultText('allowed \u2014 ' + req2.reason)
      cap(CAPTIONS.RESOLVER_YONO, COLORS.OWNER_LANE, a4 + 8.3)
      play(SFX_MAP.ARRIVE)
    }, a4 + 8.3)

    // ═══════════════════════════════════════════════════════════════
    // ACT 5 — File bukan directory (17.0s)
    // ═══════════════════════════════════════════════════════════════
    const a5 = actStart[4]
    cap(CAPTIONS.FILE_VS_DIR, COLORS.SUCCESS, a5)
    tl.add(() => {
      setPhaseIdx(4)
      setFileRows(0)
      setDirRows(0)
    }, a5)
    tl.add(() => { setFileRows(1); play(SFX_MAP.POP) }, a5 + 1.0)
    tl.add(() => { setFileRows(2); play(SFX_MAP.POP) }, a5 + 1.8)
    tl.add(() => { setFileRows(3); play(SFX_MAP.POP) }, a5 + 2.6)
    tl.add(() => { setDirRows(1); play(SFX_MAP.POP2) }, a5 + 3.8)
    tl.add(() => { setDirRows(2); play(SFX_MAP.POP2) }, a5 + 4.6)
    tl.add(() => { setDirRows(3); play(SFX_MAP.POP2) }, a5 + 5.4)

    // ═══════════════════════════════════════════════════════════════
    // ACT 6 — Policy admin terpisah (18.0s)
    // ═══════════════════════════════════════════════════════════════
    const a6 = actStart[5]
    cap(CAPTIONS.ADMIN, COLORS.WAITING, a6)
    tl.add(() => {
      setPhaseIdx(5)
      setActionVisible(false)
      setGateState('hidden')
      setKeyState('hidden')
      setKeyTravelP(0)
      setAdminNoteP(0)
    }, a6)
    tl.add(() => { setActionVisible(true); play(SFX_MAP.POP) }, a6 + 0.6)
    tl.add(() => setGateState('waiting'), a6 + 1.4)
    tl.add(() => { setGateState('scanning'); play(SFX_MAP.PAPER_OPEN) }, a6 + 2.5)
    tl.add(() => {
      setGateState('granted')
      cap(CAPTIONS.SUDO, COLORS.SUCCESS, a6 + 3.6)
      play(SFX_MAP.UNLOCK)
    }, a6 + 3.6)
    tl.add(() => setKeyState('travelling'), a6 + 4.6)
    const keyObj = { v: 0 }
    tl.to(keyObj, {
      v: 1, duration: 0.9, ease: 'power2.inOut',
      onUpdate: () => setKeyTravelP(keyObj.v),
    }, a6 + 4.6)
    tl.add(() => setKeyState('attached'), a6 + 5.5)
    to1(setAdminNoteP, a6 + 6.4)

    // ═══════════════════════════════════════════════════════════════
    // ACT 7 — Bukti & kembali normal (13.0s)
    // ═══════════════════════════════════════════════════════════════
    const a7 = actStart[6]
    cap(CAPTIONS.AUDIT, COLORS.AUDIT, a7)
    tl.add(() => {
      setPhaseIdx(6)
      setLedgerVisible(false)
      setLedgerStamped(false)
      setClosingVisible(false)
    }, a7)
    tl.add(() => {
      setKeyState('released')
      setGateState('closed')
    }, a7 + 0.6)
    to1(setLedgerVisible, a7 + 1.0)
    tl.add(() => { setLedgerStamped(true); play(SFX_MAP.CONFIRM) }, a7 + 2.2)
    cap(CAPTIONS.CLOSING, COLORS.USER, a7 + 3.4)
    to1(setClosingVisible, a7 + 3.8, 0.45, SFX_MAP.DING)

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

  const userAdib = USERS.find((u) => u.id === 'adib') || USERS[0]
  const userYono = USERS.find((u) => u.id === 'yono-bakrie') || USERS[1]

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
        testId="user-group-access-intro"
      />

      {contentStarted && (
        <ActBadgeNavigatorV1 phases={PHASES} activeIndex={phaseIdx} testId="user-group-access-navigator" />
      )}

      {contentStarted && (
        <ContentBodyV1 debugName="user-group-access-body" clip>
          <g opacity={bodyOpacity}>

            {/* Top Caption */}
            <CaptionBar text={caption} colorKey={captionColor} />

            {/* Act 1-7 Identity Rail — UserCard Adib & Yono Bakrie */}
            <UserCard x={CARD_ADIB.x} y={CARD_ADIB.y} user={userAdib} active={adibActive} pop={adibPop} meta1={adibMeta} groupLabel={adibGroup} processP={adibProcessP} />
            <UserCard x={CARD_YONO.x} y={CARD_YONO.y} user={userYono} active={yonoActive} pop={yonoPop} meta1={yonoMeta} groupLabel={yonoGroup} processP={yonoProcessP} />

            {/* Act 2 Relationship Arena — GroupRoster project-team */}
            <GroupRoster popP={rosterP} connectorP={connectorP} activePulse={rosterPulse} />

            {/* Act 3-5 Resource Cards — team-notes/ & report.md */}
            <ResourceCard center={RESOURCE_DIR_CENTER} item={RESOURCE_DIR} visible={dirVisible} ownerP={dirOwnerP} groupP={dirGroupP} modeP={modeP} isDir />
            <ResourceCard center={RESOURCE_FILE_CENTER} item={RESOURCE_FILE} visible={fileVisible} ownerP={fileOwnerP} groupP={fileGroupP} modeP={modeP} isDir={false} />

            {/* Act 4 Resolver Lane — Owner/Group/Others Tracks & Request */}
            <ResolverLanes visible={phaseIdx >= 3 && phaseIdx <= 4} activeLane={resolverActive} resultText={resultText} />
            <RequestCapsule x={reqPos.x} y={reqPos.y} visible={reqVisible} label={reqLabel} requester={reqRequester} />

            {/* Act 5 Resource Semantic Lane — File vs Directory rwx */}
            {phaseIdx === 4 && (
              <>
                <SemanticPanel center={TYPE_FILE_CENTER} title={SEMANTIC_FILE.label} rows={SEMANTIC_FILE.rows} visibleRows={fileRows} accent={COLORS.USER} />
                <SemanticPanel center={TYPE_DIR_CENTER} title={SEMANTIC_DIR.label} rows={SEMANTIC_DIR.rows} visibleRows={dirRows} accent={COLORS.GROUP} />
              </>
            )}

            {/* Act 6 Admin/Audit Lane — System Action, Gate, Key & Note */}
            <ActionChip visible={actionVisible} />
            <AdminGate state={gateState} />
            <TempKey state={keyState} travelP={keyTravelP} />

            {adminNoteP > 0 && (
              <g transform="translate(366 312)" opacity={adminNoteP}>
                <rect x="-110" y="-12" width="220" height="24" rx="12" fill={COLORS.PANEL_ALT} stroke={COLORS.WAITING} strokeWidth="1.2" />
                <text x="0" y="4" textAnchor="middle" fontFamily="monospace" fontSize="9.5" fontWeight="700" fill={COLORS.WAITING}>role group \u2260 izin admin</text>
              </g>
            )}

            {/* Act 7 Audit Ledger & Closing */}
            <AuditLedger visible={ledgerVisible} stamped={ledgerStamped} />
            <ClosingMap visible={closingVisible} />

          </g>
        </ContentBodyV1>
      )}
    </svg>
  )
}
