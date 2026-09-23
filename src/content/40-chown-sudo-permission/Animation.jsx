// src/content/40-chown-sudo-permission/Animation.jsx
// Implementasi PLAN — 40 File Permission Lanjutan: chown, su, sudo & sudoers.
// Lihat _docs/CHOWN_SUDO_PERMISSION_PLAN.md. Empat Act: jebakan Permission
// Denied & bahaya chmod 777 -> chown mengubah kepemilikan -> su vs sudo ->
// buku aturan /etc/sudoers & audit trail. Resolver lane (owner/group/others)
// dipakai ulang sebagai "gate" — konsisten dengan mental model topic 37.

import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import {
  VW, VH, COLORS, ZONE, PHASES, CAPTIONS, SFX_MAP,
  NGINX_POS, FILE_POS, ACCESS_LANES_Y, RESULT_BADGE_Y, COMMAND_LINE_Y, COMPARE_ROW_Y,
  NGINX_PROCESS, CONFIG_FILE, CHMOD_777_CMD, CHOWN_CMD, COMPARE_CHIPS,
  COL_SU, COL_SUDO, COMPARE_BAR_Y, SU_FLOW, SUDO_FLOW, SU_SUDO_COMPARE,
  SUDOERS_CARD_Y, SUDOERS_RULE, GATE_CENTER, ATTEMPT_LANE_Y, RESULT_LANE_Y,
  LEDGER_TOP_Y, SUDO_ATTEMPTS, CLOSING_CENTER,
  INTRO_CATEGORY_LABEL, INTRO_DOMAIN, INTRO_TITLE_A, INTRO_TITLE_B, INTRO_SUBTITLE,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'
import {
  IntroHeaderMorphV1,
  ActBadgeNavigatorV1,
  ContentBodyV1,
} from '../../shared/scene-ui/v1'

// ── Caption bar (top) ──────────────────────────────────────────
const CaptionBar = ({ text, colorKey }) => {
  if (!text) return null
  const y = (ZONE.CAPTION.yStart + ZONE.CAPTION.yEnd) / 2
  return (
    <g transform={`translate(366 ${y})`}>
      <rect x="-320" y="-23" width="640" height="46" rx="20" fill={COLORS.PANEL} stroke={colorKey || COLORS.BORDER} strokeWidth="1.5" opacity="0.96" />
      <text x="0" y="6" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="13" fill={COLORS.TEXT}>{text}</text>
    </g>
  )
}

// ── ActorCard — kartu proses (nginx) atau user (Adib). ──
const ActorCard = ({ x, y, label, role, pop, accent }) => {
  if (pop <= 0) return null
  const color = accent || COLORS.TEXT
  return (
    <g transform={`translate(${x} ${y})`} opacity={pop}>
      <rect x="-92" y="-40" width="184" height="80" rx="14" fill={COLORS.PANEL} stroke={color} strokeWidth="1.8" />
      <circle cx="-64" cy="-10" r="15" fill="none" stroke={color} strokeWidth="2" />
      <text x="-64" y="-5" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="11" fill={COLORS.TEXT}>{label[0].toUpperCase()}</text>
      <text x="-38" y="-6" fontFamily="monospace" fontWeight="700" fontSize="13" fill={COLORS.TEXT}>{label}</text>
      {role && <text x="0" y="20" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={COLORS.MUTED}>{role}</text>}
    </g>
  )
}

// ── FileCard — kartu nginx.conf. Owner label bisa "morph" (strike lama, tampil baru). ──
const FileCard = ({ x, y, mode, ownerBefore, ownerAfter, ownerMorphP }) => {
  const showAfter = ownerMorphP >= 1
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-100" y="-44" width="200" height="88" rx="14" fill={COLORS.PANEL} stroke={COLORS.BORDER} strokeWidth="1.6" />
      <path d="M-72,-24 L-46,-24 L-38,-16 L-38,4 L-72,4 Z" fill="none" stroke={COLORS.TEXT} strokeWidth="1.4" />
      <text x="0" y="-22" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="12" fill={COLORS.TEXT}>{CONFIG_FILE.label}</text>
      <text x="0" y="-6" textAnchor="middle" fontFamily="monospace" fontSize="8.5" fill={COLORS.MUTED}>{mode}</text>
      <g transform="translate(0 16)">
        {ownerMorphP > 0 && ownerMorphP < 1 && (
          <text x="0" y="0" textAnchor="middle" fontFamily="monospace" fontSize="9.5" fill={COLORS.DANGER} opacity={1 - ownerMorphP} textDecoration="line-through">{ownerBefore}</text>
        )}
        {!showAfter && ownerMorphP === 0 && (
          <text x="0" y="0" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="9.5" fill={COLORS.MUTED}>{ownerBefore}</text>
        )}
        {showAfter && (
          <text x="0" y="0" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="9.5" fill={COLORS.OWNER}>{ownerAfter}</text>
        )}
      </g>
      <text x="0" y="34" textAnchor="middle" fontFamily="monospace" fontSize="7.5" fill={COLORS.MUTED}>{CONFIG_FILE.path}</text>
    </g>
  )
}

// ── RequestCapsule — kapsul permintaan baca yang bergerak nginx -> file. ──
const RequestCapsule = ({ visible, x, y, label }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-58" y="-13" width="116" height="26" rx="13" fill={COLORS.PANEL_ALT} stroke={COLORS.SUDO} strokeWidth="1.6" />
      <circle cx="-40" cy="0" r="5" fill={COLORS.SUDO} />
      <text x="4" y="4" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="9" fill={COLORS.TEXT}>{label}</text>
    </g>
  )
}

// ── CommandLine — teks command yang muncul (efek reveal + kursor). ──
const CommandLine = ({ visible, y, text, danger }) => {
  if (visible <= 0) return null
  const color = danger ? COLORS.DANGER : COLORS.SUDO
  return (
    <g transform={`translate(366 ${y})`} opacity={visible}>
      <rect x="-190" y="-15" width="380" height="30" rx="8" fill={COLORS.PANEL_ALT} stroke={color} strokeWidth="1.4" />
      <text x="0" y="5" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="11" fill={color}>{text}</text>
    </g>
  )
}

// ── AccessLanes — Act 1-2: tiga gate owner/group/others (mengulang mental
// model topic 37). mode: 'idle' | 'denied' | 'danger-open' | 'granted'. ──
const LANE_DEFS = [
  { id: 'owner', label: 'OWNER' },
  { id: 'group', label: 'GROUP' },
  { id: 'others', label: 'OTHERS' },
]
const AccessLanes = ({ visible, mode, y }) => {
  if (!visible) return null
  const laneX = [146, 366, 586]
  return (
    <g>
      {LANE_DEFS.map((lane, i) => {
        const lx = laneX[i]
        const isOwnerGranted = mode === 'granted' && lane.id === 'owner'
        const isDangerOpen = mode === 'danger-open'
        const isDenied = mode === 'denied'
        let stroke = COLORS.BORDER
        let fillOp = 0
        let icon = 'closed'
        if (isOwnerGranted) { stroke = COLORS.SAFE; fillOp = 0.12; icon = 'open' }
        else if (isDangerOpen) { stroke = COLORS.DANGER; fillOp = 0.16; icon = 'open' }
        else if (isDenied) { stroke = COLORS.DANGER; fillOp = 0; icon = 'closed' }
        return (
          <g key={lane.id} transform={`translate(${lx} ${y})`}>
            <rect x="-78" y="-48" width="156" height="96" rx="12" fill={COLORS.PANEL_ALT} stroke={stroke} strokeWidth={fillOp > 0 ? 2.2 : 1.3} opacity={fillOp > 0 ? 1 : 0.6} />
            <text x="0" y="-24" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="10.5" fill={stroke}>{lane.label}</text>
            {icon === 'open' ? (
              <g transform="translate(0 6)">
                <rect x="-11" y="-3" width="22" height="16" rx="3" fill="none" stroke={stroke} strokeWidth="2" />
                <path d={`M-7,-3 L-7,-11 A7,7 0 0 1 7,-11`} fill="none" stroke={stroke} strokeWidth="2" />
              </g>
            ) : (
              <g transform="translate(0 6)">
                <rect x="-11" y="-3" width="22" height="16" rx="3" fill="none" stroke={stroke} strokeWidth="2" />
                <path d="M-7,-3 L-7,-11 A7,7 0 0 1 7,-11 L7,-3" fill="none" stroke={stroke} strokeWidth="2" />
              </g>
            )}
            <text x="0" y="34" textAnchor="middle" fontFamily="monospace" fontSize="8" fill={COLORS.MUTED}>
              {isOwnerGranted ? 'match \u2713' : isDangerOpen ? 'terbuka!' : isDenied ? 'no match' : ''}
            </text>
          </g>
        )
      })}
    </g>
  )
}

// ── ResultBadge — badge hasil (denied merah / granted hijau). ──
const ResultBadge = ({ state, x, y }) => {
  if (state === 'hidden') return null
  const denied = state === 'denied'
  const color = denied ? COLORS.DANGER : COLORS.SAFE
  const label = denied ? CAPTIONS.DENIED_BADGE : 'granted \u00b7 200 OK'
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-104" y="-17" width="208" height="34" rx="17" fill={COLORS.PANEL_ALT} stroke={color} strokeWidth="2" />
      {denied ? (
        <g transform="translate(-84 0)"><line x1="-6" y1="-6" x2="6" y2="6" stroke={color} strokeWidth="2.4" /><line x1="6" y1="-6" x2="-6" y2="6" stroke={color} strokeWidth="2.4" /></g>
      ) : (
        <g transform="translate(-84 0)"><path d="M-6,0 L-1,5 L7,-6" stroke={color} strokeWidth="2.4" fill="none" /></g>
      )}
      <text x="8" y="5" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="10.5" fill={color}>{label}</text>
    </g>
  )
}

// ── IntruderDots — titik merah yang menyerbu saat chmod 777 (Act 1). ──
const IntruderDots = ({ p, center }) => {
  if (p <= 0) return null
  const dots = [
    { a: -40, d: 92 }, { a: 20, d: 106 }, { a: 80, d: 88 },
    { a: 140, d: 100 }, { a: -100, d: 96 }, { a: -150, d: 84 },
  ]
  return (
    <g opacity={p}>
      {dots.map((d, i) => {
        const rad = (d.a * Math.PI) / 180
        const dist = d.d * p
        const dx = center.x + Math.cos(rad) * dist
        const dy = center.y + Math.sin(rad) * dist
        return <circle key={i} cx={dx} cy={dy} r="4.5" fill={COLORS.DANGER} opacity={0.85} />
      })}
    </g>
  )
}

// ── CompareChip — chip kontras "chmod 777" vs "chown tepat sasaran". ──
const CompareChip = ({ chip, p, x }) => {
  if (p <= 0) return null
  return (
    <g transform={`translate(${x} ${COMPARE_ROW_Y})`} opacity={p}>
      <rect x="-140" y="-24" width="280" height="48" rx="12" fill={COLORS.PANEL_ALT} stroke={chip.color} strokeWidth="1.8" />
      <text x="0" y="-4" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="11" fill={chip.color}>{chip.safe ? '\u2705 ' : '\u274c '}{chip.label}</text>
      <text x="0" y="14" textAnchor="middle" fontFamily="monospace" fontSize="8.5" fill={COLORS.MUTED}>{chip.desc}</text>
    </g>
  )
}

// ── ColumnCard — Act 3: kolom su atau sudo. ──
const ColumnCard = ({ x, y, pop, accent, title, cmdVisible, cmd, prompt, noteP, note, keyState }) => {
  if (pop <= 0) return null
  return (
    <g transform={`translate(${x} ${y})`} opacity={pop}>
      <rect x="-160" y="0" width="320" height="380" rx="16" fill={COLORS.PANEL} stroke={accent} strokeWidth="1.8" />
      <text x="0" y="34" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="13" fill={accent}>{title}</text>

      <g transform="translate(0 78)">
        <circle cx="-118" cy="0" r="15" fill="none" stroke={accent} strokeWidth="2" />
        <text x="-118" y="5" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="11" fill={COLORS.TEXT}>A</text>
        <text x="-88" y="5" fontFamily="monospace" fontWeight="700" fontSize="12" fill={COLORS.TEXT}>Adib</text>
      </g>

      {cmdVisible > 0 && (
        <g transform="translate(0 128)" opacity={cmdVisible}>
          <rect x="-138" y="-15" width="276" height="30" rx="7" fill={COLORS.PANEL_ALT} stroke={accent} strokeWidth="1.2" />
          <text x="0" y="5" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="9.5" fill={accent}>{cmd}</text>
        </g>
      )}

      <g transform="translate(0 182)">
        <rect x="-90" y="-16" width="180" height="32" rx="16" fill={COLORS.PANEL_ALT} stroke={COLORS.BORDER} strokeWidth="1.2" />
        <text x="0" y="5" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="11" fill={accent}>{prompt}</text>
        {keyState && keyState !== 'hidden' && (
          <g transform="translate(76 0)" opacity={keyState === 'released' ? 0 : 1}>
            <circle r="7" fill="none" stroke={COLORS.SAFE} strokeWidth="2" />
            <line x1="5" y1="0" x2="15" y2="0" stroke={COLORS.SAFE} strokeWidth="2" />
          </g>
        )}
      </g>

      {noteP > 0 && (
        <foreignObject x="-140" y="230" width="280" height="130" opacity={noteP}>
          <div style={{ fontFamily: 'monospace', fontSize: '10.5px', lineHeight: '1.5', color: COLORS.MUTED, textAlign: 'center' }}>{note}</div>
        </foreignObject>
      )}
    </g>
  )
}

// ── SudoersCard — Act 4: kartu /etc/sudoers dengan satu baris rule. ──
const SudoersCard = ({ pop, ruleP }) => {
  if (pop <= 0) return null
  return (
    <g transform={`translate(366 ${SUDOERS_CARD_Y})`} opacity={pop}>
      <rect x="-260" y="0" width="520" height="86" rx="14" fill={COLORS.PANEL} stroke={COLORS.POLICY} strokeWidth="1.8" />
      <path d="M-234,18 L-198,18 L-190,26 L-198,34 L-234,34 Z" fill="none" stroke={COLORS.POLICY} strokeWidth="1.4" />
      <text x="-176" y="30" fontFamily="monospace" fontWeight="700" fontSize="12" fill={COLORS.POLICY}>{SUDOERS_RULE.fileLabel}</text>
      {ruleP > 0 && (
        <g opacity={ruleP}>
          <rect x="-234" y="46" width="468" height="26" rx="6" fill={COLORS.PANEL_ALT} stroke={COLORS.BORDER} strokeWidth="1" />
          <text x="0" y="63" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="9.5" fill={COLORS.TEXT}>{SUDOERS_RULE.ruleLine}</text>
        </g>
      )}
    </g>
  )
}

// ── GatePanel — Act 4: gate policy yang scan tiap percobaan sudo. ──
const GatePanel = ({ state }) => {
  if (state === 'hidden') return null
  const color = state === 'granted' ? COLORS.SAFE : state === 'denied' ? COLORS.DANGER : COLORS.WAITING
  const label = state === 'scanning' ? 'policy membaca command \u2026'
    : state === 'granted' ? 'cocok rule \u2014 dieksekusi'
    : state === 'denied' ? 'tidak ada rule yang cocok'
    : 'menunggu command'
  return (
    <g transform={`translate(${GATE_CENTER.x} ${GATE_CENTER.y})`}>
      <rect x="-150" y="-30" width="300" height="60" rx="16" fill={COLORS.PANEL_ALT} stroke={color} strokeWidth="2.2" />
      <rect x="-130" y="-11" width="22" height="22" rx="4" fill="none" stroke={color} strokeWidth="2" />
      <circle cx="-119" cy="0" r="3" fill={color} />
      {state === 'scanning' && (
        <circle cx="-119" cy="0" r="18" fill="none" stroke={color} strokeWidth="1.2">
          <animate attributeName="r" values="12;22;12" dur="1s" repeatCount="indefinite" />
        </circle>
      )}
      <text x="16" y="5" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="10.5" fill={color}>{label}</text>
    </g>
  )
}

// ── AttemptCapsule — kapsul command sudo yang bergerak menuju gate. ──
const AttemptCapsule = ({ visible, x, y, cmd }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-118" y="-15" width="236" height="30" rx="15" fill={COLORS.PANEL_ALT} stroke={COLORS.SUDO} strokeWidth="1.6" />
      <text x="0" y="5" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="9.5" fill={COLORS.TEXT}>$ {cmd}</text>
    </g>
  )
}

// ── AuditLedger — Act 4: baris log granted/denied yang terus bertambah. ──
const AuditLedger = ({ rows }) => {
  if (rows <= 0) return null
  return (
    <g transform={`translate(366 ${LEDGER_TOP_Y})`}>
      <text x="0" y="-14" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="10" fill={COLORS.AUDIT}>audit ledger</text>
      {SUDO_ATTEMPTS.map((entry, i) => {
        if (i >= rows) return null
        const ok = entry.result === 'granted'
        const color = ok ? COLORS.SAFE : COLORS.DANGER
        const ry = i * 38
        return (
          <g key={entry.id} transform={`translate(0 ${ry})`}>
            <rect x="-260" y="0" width="520" height="30" rx="8" fill={COLORS.PANEL_ALT} stroke={color} strokeWidth="1.4" />
            <circle cx="-236" cy="15" r="8" fill={color} />
            {ok ? (
              <path d="M-240,15 L-237,18 L-232,11" stroke={COLORS.BG} strokeWidth="1.8" fill="none" />
            ) : (
              <g><line x1="-239" y1="12" x2="-233" y2="18" stroke={COLORS.BG} strokeWidth="1.8" /><line x1="-233" y1="12" x2="-239" y2="18" stroke={COLORS.BG} strokeWidth="1.8" /></g>
            )}
            <text x="-6" y="20" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={COLORS.TEXT}>{entry.logLabel}</text>
          </g>
        )
      })}
    </g>
  )
}

// ── ClosingMap — penutup: chown atur kepemilikan, sudo beri izin terukur. ──
const ClosingMap = ({ visible }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${CLOSING_CENTER.x} ${CLOSING_CENTER.y})`}>
      <rect x="-260" y="-17" width="520" height="34" rx="17" fill={COLORS.PANEL_ALT} stroke={COLORS.SAFE} strokeWidth="1.6" />
      <text x="0" y="5" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="10.5" fill={COLORS.SAFE}>{CAPTIONS.CLOSING}</text>
    </g>
  )
}

export default function ChownSudoPermissionAnimation({
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

  // Act 1-2 — server/file scene (dipakai ulang)
  const [nginxPop, setNginxPop] = useState(0)
  const [filePop, setFilePop] = useState(0)
  const [mode, setMode] = useState(CONFIG_FILE.mode)
  const [ownerMorphP, setOwnerMorphP] = useState(0)
  const [reqVisible, setReqVisible] = useState(false)
  const [reqPos, setReqPos] = useState({ x: NGINX_POS.x, y: NGINX_POS.y })
  const [reqLabel, setReqLabel] = useState('')
  const [lanesVisible, setLanesVisible] = useState(false)
  const [lanesMode, setLanesMode] = useState('idle')
  const [resultState, setResultState] = useState('hidden')
  const [cmdP, setCmdP] = useState(0)
  const [cmdText, setCmdText] = useState(CHMOD_777_CMD)
  const [intruderP, setIntruderP] = useState(0)
  const [chipBadP, setChipBadP] = useState(0)
  const [chipGoodP, setChipGoodP] = useState(0)

  // Act 3 — su vs sudo
  const [suPop, setSuPop] = useState(0)
  const [sudoPop, setSudoPop] = useState(0)
  const [suCmdP, setSuCmdP] = useState(0)
  const [sudoCmdP, setSudoCmdP] = useState(0)
  const [suPrompt, setSuPrompt] = useState(SU_FLOW.promptBefore)
  const [sudoPrompt, setSudoPrompt] = useState(SUDO_FLOW.promptBefore)
  const [sudoKeyState, setSudoKeyState] = useState('hidden')
  const [suNoteP, setSuNoteP] = useState(0)
  const [sudoNoteP, setSudoNoteP] = useState(0)
  const [compareBarP, setCompareBarP] = useState(0)

  // Act 4 — sudoers & audit
  const [sudoersPop, setSudoersPop] = useState(0)
  const [ruleP, setRuleP] = useState(0)
  const [attemptVisible, setAttemptVisible] = useState(false)
  const [attemptPos, setAttemptPos] = useState({ x: 366, y: 0 })
  const [attemptCmd, setAttemptCmd] = useState('')
  const [gateState, setGateState] = useState('hidden')
  const [ledgerRows, setLedgerRows] = useState(0)
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
      setNginxPop(0); setFilePop(0); setMode(CONFIG_FILE.mode); setOwnerMorphP(0)
      setReqVisible(false); setReqPos({ x: NGINX_POS.x, y: NGINX_POS.y }); setReqLabel('')
      setLanesVisible(false); setLanesMode('idle'); setResultState('hidden')
      setCmdP(0); setCmdText(CHMOD_777_CMD); setIntruderP(0)
      setChipBadP(0); setChipGoodP(0)
      setSuPop(0); setSudoPop(0); setSuCmdP(0); setSudoCmdP(0)
      setSuPrompt(SU_FLOW.promptBefore); setSudoPrompt(SUDO_FLOW.promptBefore)
      setSudoKeyState('hidden'); setSuNoteP(0); setSudoNoteP(0); setCompareBarP(0)
      setSudoersPop(0); setRuleP(0); setAttemptVisible(false)
      setAttemptPos({ x: 366, y: 0 }); setAttemptCmd(''); setGateState('hidden')
      setLedgerRows(0); setClosingVisible(false)
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

    // ── Schedule 4 Act sesuai PHASES durations ──
    const actStart = []
    actStart[0] = 1.7
    for (let i = 1; i < PHASES.length; i += 1) actStart[i] = actStart[i - 1] + PHASES[i - 1].duration

    // ═══════════════════════════════════════════════════════════════
    // ACT 1 — Jebakan Permission Denied & bahaya chmod 777 (20.0s)
    // ═══════════════════════════════════════════════════════════════
    const a1 = actStart[0]
    tl.add(() => setPhaseIdx(0), a1)
    cap(CAPTIONS.DENIED, COLORS.DANGER, a1)
    to1(setNginxPop, a1 + 0.4, 0.45, SFX_MAP.POP)
    to1(setFilePop, a1 + 1.0, 0.45, SFX_MAP.POP2)

    tl.add(() => {
      setReqVisible(true)
      setReqLabel('baca nginx.conf')
      setReqPos({ x: NGINX_POS.x, y: NGINX_POS.y })
      play(SFX_MAP.PAPER_ARRIVE)
    }, a1 + 2.2)
    const reqObj1 = { x: NGINX_POS.x, y: NGINX_POS.y }
    tl.to(reqObj1, {
      x: FILE_POS.x, y: FILE_POS.y, duration: 1.0, ease: 'power2.inOut',
      onUpdate: () => setReqPos({ x: reqObj1.x, y: reqObj1.y }),
    }, a1 + 2.2)

    tl.add(() => { setLanesVisible(true); setLanesMode('idle') }, a1 + 3.4)
    tl.add(() => {
      setLanesMode('denied')
      setResultState('denied')
      setReqVisible(false)
      cap(CAPTIONS.DENIED_BADGE, COLORS.DANGER, a1 + 3.8)
      play(SFX_MAP.ERROR)
    }, a1 + 3.8)

    to1(setCmdP, a1 + 6.0, 0.4, SFX_MAP.TICK)
    cap(CAPTIONS.TEMPTATION, COLORS.WAITING, a1 + 6.0)

    tl.add(() => {
      setMode('-rwxrwxrwx')
      setLanesMode('danger-open')
      play(SFX_MAP.GLITCH)
    }, a1 + 8.2)
    to1(setIntruderP, a1 + 8.8, 0.7, SFX_MAP.CRITICAL_ALERT, 'power2.out')
    cap(CAPTIONS.DANGER_777, COLORS.DANGER, a1 + 10.0)
    to1(setChipBadP, a1 + 12.0, 0.45, SFX_MAP.POP)

    // ═══════════════════════════════════════════════════════════════
    // ACT 2 — chown mengubah kepemilikan (19.0s)
    // ═══════════════════════════════════════════════════════════════
    const a2 = actStart[1]
    tl.add(() => {
      setPhaseIdx(1)
      setMode(CONFIG_FILE.mode)
      setLanesMode('idle')
      setResultState('hidden')
      setIntruderP(0)
      setCmdP(0)
      setReqVisible(false)
      setCmdText(CHOWN_CMD)
    }, a2)
    cap(CAPTIONS.CHOWN_INTRO, COLORS.OWNER, a2)
    to1(setCmdP, a2 + 1.4, 0.4, SFX_MAP.TICK)

    tl.add(() => play(SFX_MAP.SWAP), a2 + 3.4)
    const ownerObj = { v: 0 }
    tl.to(ownerObj, {
      v: 1, duration: 0.9, ease: 'power2.inOut',
      onUpdate: () => setOwnerMorphP(ownerObj.v),
    }, a2 + 3.4)
    cap(CAPTIONS.CHOWN_APPLIED, COLORS.OWNER, a2 + 3.6)

    tl.add(() => {
      setReqVisible(true)
      setReqLabel('baca nginx.conf')
      setReqPos({ x: NGINX_POS.x, y: NGINX_POS.y })
      play(SFX_MAP.PAPER_ARRIVE)
    }, a2 + 5.6)
    const reqObj2 = { x: NGINX_POS.x, y: NGINX_POS.y }
    tl.to(reqObj2, {
      x: FILE_POS.x, y: FILE_POS.y, duration: 1.0, ease: 'power2.inOut',
      onUpdate: () => setReqPos({ x: reqObj2.x, y: reqObj2.y }),
    }, a2 + 5.6)

    tl.add(() => {
      setLanesMode('granted')
      setResultState('granted')
      setReqVisible(false)
      cap(CAPTIONS.CHOWN_SUCCESS, COLORS.SAFE, a2 + 7.4)
      play(SFX_MAP.UNLOCK)
    }, a2 + 7.4)
    to1(setChipGoodP, a2 + 9.4, 0.45, SFX_MAP.CONFIRM)

    // ═══════════════════════════════════════════════════════════════
    // ACT 3 — su vs sudo: pindah kursi vs izin sementara (22.0s)
    // ═══════════════════════════════════════════════════════════════
    const a3 = actStart[2]
    tl.add(() => {
      setPhaseIdx(2)
      setSuPop(0); setSudoPop(0); setSuCmdP(0); setSudoCmdP(0)
      setSuPrompt(SU_FLOW.promptBefore); setSudoPrompt(SUDO_FLOW.promptBefore)
      setSudoKeyState('hidden'); setSuNoteP(0); setSudoNoteP(0); setCompareBarP(0)
    }, a3)
    cap(CAPTIONS.SU_SUDO_INTRO, COLORS.SU, a3)
    to1(setSuPop, a3 + 0.5, 0.45, SFX_MAP.POP)
    to1(setSudoPop, a3 + 1.1, 0.45, SFX_MAP.POP2)

    to1(setSuCmdP, a3 + 2.4, 0.4, SFX_MAP.TICK)
    tl.add(() => {
      setSuPrompt(SU_FLOW.promptAfter)
      cap(CAPTIONS.SU_TITLE, COLORS.SU, a3 + 3.4)
      play(SFX_MAP.SWAP)
    }, a3 + 3.4)
    to1(setSuNoteP, a3 + 4.6)

    to1(setSudoCmdP, a3 + 6.2, 0.4, SFX_MAP.TICK)
    cap(CAPTIONS.SUDO_TITLE, COLORS.SUDO, a3 + 6.2)
    tl.add(() => {
      setSudoKeyState('attached')
      setSudoPrompt(SUDO_FLOW.promptDuring)
      play(SFX_MAP.KEY_TURN)
    }, a3 + 7.4)
    tl.add(() => {
      setSudoKeyState('released')
      setSudoPrompt(SUDO_FLOW.promptAfter)
      play(SFX_MAP.CONFIRM)
    }, a3 + 9.2)
    to1(setSudoNoteP, a3 + 10.4)

    tl.add(() => cap(SU_SUDO_COMPARE, COLORS.TEXT, a3 + 13.0), a3 + 13.0)
    to1(setCompareBarP, a3 + 13.0, 0.45, SFX_MAP.PAPER_OPEN)

    // ═══════════════════════════════════════════════════════════════
    // ACT 4 — Buku aturan /etc/sudoers & audit trail (24.0s)
    // ═══════════════════════════════════════════════════════════════
    const a4 = actStart[3]
    tl.add(() => {
      setPhaseIdx(3)
      setSudoersPop(0); setRuleP(0); setAttemptVisible(false)
      setGateState('hidden'); setLedgerRows(0); setClosingVisible(false)
    }, a4)
    cap(CAPTIONS.SUDOERS_INTRO, COLORS.POLICY, a4)
    to1(setSudoersPop, a4 + 0.6, 0.45, SFX_MAP.PAPER_OPEN)
    to1(setRuleP, a4 + 1.8, 0.4, SFX_MAP.TICK)

    const attemptStartY = SUDOERS_CARD_Y + 110
    // ── Percobaan 1: cocok policy -> granted ──
    tl.add(() => setGateState('idle'), a4 + 3.0)
    tl.add(() => {
      setAttemptVisible(true)
      setAttemptCmd(SUDO_ATTEMPTS[0].cmd)
      setAttemptPos({ x: 366, y: attemptStartY })
      play(SFX_MAP.PAPER_ARRIVE)
    }, a4 + 3.4)
    const attObj1 = { y: attemptStartY }
    tl.to(attObj1, {
      y: GATE_CENTER.y - 50, duration: 1.0, ease: 'power2.inOut',
      onUpdate: () => setAttemptPos({ x: 366, y: attObj1.y }),
    }, a4 + 3.4)
    tl.add(() => { setGateState('scanning'); play(SFX_MAP.POLICY_SCAN) }, a4 + 4.6)
    tl.add(() => {
      setGateState('granted')
      setAttemptVisible(false)
      cap(CAPTIONS.SUDOERS_GRANTED, COLORS.SAFE, a4 + 5.6)
      play(SFX_MAP.UNLOCK)
    }, a4 + 5.6)
    tl.add(() => { setLedgerRows(1); play(SFX_MAP.STAMP) }, a4 + 6.4)

    // ── Percobaan 2: di luar policy -> denied ──
    tl.add(() => {
      setGateState('idle')
      setAttemptVisible(true)
      setAttemptCmd(SUDO_ATTEMPTS[1].cmd)
      setAttemptPos({ x: 366, y: attemptStartY })
      play(SFX_MAP.PAPER_ARRIVE)
    }, a4 + 8.2)
    const attObj2 = { y: attemptStartY }
    tl.to(attObj2, {
      y: GATE_CENTER.y - 50, duration: 1.0, ease: 'power2.inOut',
      onUpdate: () => setAttemptPos({ x: 366, y: attObj2.y }),
    }, a4 + 8.2)
    tl.add(() => { setGateState('scanning'); play(SFX_MAP.POLICY_SCAN) }, a4 + 9.4)
    tl.add(() => {
      setGateState('denied')
      setAttemptVisible(false)
      cap(CAPTIONS.SUDOERS_DENIED, COLORS.DANGER, a4 + 10.4)
      play(SFX_MAP.SOFT_DENY)
    }, a4 + 10.4)
    tl.add(() => { setLedgerRows(2); play(SFX_MAP.STAMP) }, a4 + 11.2)

    cap(CAPTIONS.AUDIT, COLORS.AUDIT, a4 + 13.4)
    tl.add(() => cap(CAPTIONS.CLOSING, COLORS.SAFE, a4 + 15.6), a4 + 15.6)
    to1(setClosingVisible, a4 + 15.6, 0.45, SFX_MAP.DING)

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
        testId="chown-sudo-permission-intro"
      />

      {contentStarted && (
        <>
          <ActBadgeNavigatorV1 phases={PHASES} activeIndex={phaseIdx} testId="chown-sudo-permission-navigator" />
          <ContentBodyV1 debugName="chown-sudo-permission-body">
            {/* Stage body content */}
          </ContentBodyV1>
        </>
      )}
    </svg>
  )
}
