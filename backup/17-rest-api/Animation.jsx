// src/content/rest-api/Animation.jsx
// ─────────────────────────────────────────────────────────────
// REST API — lanjutan http-request-response (14): dari MEKANIKA ke
// KONVENSI. Hook Act 1: nama "REST" tapi server keliatan sibuk terus
// → jawaban penuh di Act 4 (statelessness, bukan "server gak nyimpen
// data"). Analogi: restoran & cara memesan yang konsisten.
// Lihat _docs/REST-API-storytelling-revision.md untuk story spine &
// revisi/2026-09-11-1241-revisi-02.md untuk mapping detail.
//
// STATUS EKSEKUSI: revisi-02 — analogi restoran penuh (ganti dari
// kantor pos). CustomerCharacter pakai icon 'customer' (pending
// generate manual), null-safe lewat getIcon() fallback. Komponen
// FaceSimple, officerA/officerB, beat "petugas pelupa" DIHAPUS —
// diganti 2 request card bersanding (Beat B statelessness).
// ─────────────────────────────────────────────────────────────

import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, SFX_MAP,
  INTRO_TITLE, INTRO_SUBTITLE,
  ACT1_CONTINUITY_LINE, ACT1_SIGNAGE, ACT1_PAYOFF,
  ACT2_DOORS, ACT2_PAYOFF,
  ACT3_OLD_ENDPOINT, ACT3_NEW_ENDPOINT, ACT3_METHODS, ACT3_OTHER_DOORS,
  ACT3_PUT_ITEMS, ACT3_PATCH_ITEMS,
  ACT4_JSON_FIELDS,
  ACT4_REQUEST_RESOURCE, ACT4_REQUEST1_LABEL, ACT4_REQUEST1_FIELDS,
  ACT4_REQUEST2_LABEL, ACT4_REQUEST2_FIELDS,
  ACT4_STATELESS_NOTE,
  ACT4_PAYOFF, ACT4_CLIFFHANGER,
  ACT5_STATUS_200, ACT5_STATUS_201, ACT5_REST_NOTE,
  ACT5_PAYOFF, ACT5_NEXT_TOPIC,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'
import { getIcon } from './icons/loader'

// ── deterministic pseudo-random (seeded) — WAJIB dipakai (bukan
// Math.random()), timeline ini di-build ulang di beberapa proses
// Chrome terpisah saat export. Pola identik dns-explained/Animation.jsx.
const seededRandom01 = (seed) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}
const lerp = (a, b, t) => a + (b - a) * t

// ── posisi anchor lokal (di dalam <g transform="translate(44,220)">
// lalu <g transform="translate(0,80)">)
const BUILDING_POS = { x: 366, y: 130 }
const DOOR_Y = 430
const DOOR_XS = [116, 366, 616]
const DOOR_W = 190
const ENVELOPE_REST_POS = { x: 366, y: 660 }
const DOOR_GOOD_RESOURCES = [ACT3_NEW_ENDPOINT, ...ACT3_OTHER_DOORS]

// ── posisi Act 3 & 5 ──
const OLD_STRIKE_POS = { x: 366, y: 290 }
const NEW_REVEAL_POS = { x: 366, y: 360 }
const METHOD_XS = [86, 226, 366, 506, 646]
const METHOD_Y = 780
const PUTPATCH_POS = { x: 366, y: 870 }

// ── posisi Act 4 Beat B — 2 kartu request bersanding ──
const REQUEST_CARD_Y = 820
const REQUEST_CARD_LEFT_X = 196
const REQUEST_CARD_RIGHT_X = 536

// ── posisi Act 5 ──
const STAMP_200_POS = { x: 230, y: 560 }
const STAMP_201_POS = { x: 502, y: 560 }
const SECRET_ENVELOPE_START = { x: 366, y: 260 }
const SECRET_ENVELOPE_END = { x: 616, y: 430 }

// ═══════════════════════════════════════════════════════════════
// SHAPE HELPERS — komponen visual per-analogi restoran
// ═══════════════════════════════════════════════════════════════

// RestaurantBuilding — anchor gedung restoran Act 1-5.
// Pakai icon 'post-building' (pending REPLACE manual jadi gedung restoran).
// Indikator active (dot kecil) tetap SVG karena warnanya dinamis per-Act.
const RestaurantBuilding = ({ active = false }) => (
  <g>
    <image href={getIcon('post-building')} x={-110} y={-96} width={220} height={200} />
    <circle cx={0} cy={-40} r={7} fill={active ? COLORS.SUCCESS : COLORS.SERVER} opacity={0.9} />
  </g>
)

// CustomerCharacter — anchor pelanggan baru Act 1-5.
// Pakai icon 'customer' (pending generate manual).
// Sementara fallback SVG shape sederhana kalau icon belum ada.
const CustomerCharacter = ({ color = COLORS.CLIENT }) => {
  const icon = getIcon('customer')
  if (icon) return <image href={icon} x={-28} y={-32} width={56} height={64} />
  // fallback SVG (kepala lingkaran + badan kotak) sampai PNG tersedia
  return (
    <g>
      <circle cy={-22} r={18} fill={color} opacity={0.9} />
      <rect x={-14} y={-4} width={28} height={32} rx={6} fill={color} opacity={0.85} />
      <circle cx={-6} cy={-25} r={3} fill={COLORS.PANEL} opacity={0.7} />
      <circle cx={6} cy={-25} r={3} fill={COLORS.PANEL} opacity={0.7} />
      <path d="M -6 -15 Q 0 -11 6 -15" stroke={COLORS.PANEL} strokeWidth={2} fill="none" strokeLinecap="round" />
    </g>
  )
}

const DoorBox = ({ w = DOOR_W, good = false, resourceLabel = '', methodLabel = '' }) => {
  const color = good ? COLORS.SUCCESS : COLORS.ERROR
  return (
    <g>
      <rect x={-w / 2} y={-46} width={w} height={92} rx={10} fill={COLORS.PANEL} stroke={color} strokeWidth={2} />
      {good && methodLabel && (
        <rect x={-w / 2 + 10} y={-38} width={54} height={20} rx={6} fill={COLORS.TECHNICAL} opacity={0.85} />
      )}
      {good && methodLabel && (
        <text x={-w / 2 + 37} y={-23} textAnchor="middle" fontSize={11} fontWeight={700} fill={COLORS.PANEL}>{methodLabel}</text>
      )}
      <text x={0} y={12} textAnchor="middle" fontSize={13} fontFamily="monospace" fill={color} fontWeight={700}>
        {resourceLabel}
      </text>
    </g>
  )
}

// OrderFormCard — formulir pesanan terstruktur, ganti dari EnvelopeShape.
// mode 'freeform' = tulisan bebas acak (susah dibaca), 'structured' = kolom rapi.
const OrderFormCard = ({ color = COLORS.CLIENT, mode = 'freeform', fields = [] }) => (
  <g>
    <rect x={-46} y={-32} width={92} height={64} rx={6} fill={COLORS.PANEL} stroke={color} strokeWidth={2.4} />
    {mode === 'freeform' && (
      <g stroke={COLORS.MUTED} strokeWidth={2} strokeLinecap="round" opacity={0.8}>
        <path d="M -32 -14 Q -10 -22 18 -12" fill="none" />
        <path d="M -32 0 Q 0 -8 30 2" fill="none" />
        <path d="M -32 14 Q -6 6 22 16" fill="none" />
      </g>
    )}
    {mode === 'structured' && (
      <g fontFamily="monospace" fontSize={10} fontWeight={700}>
        {fields.slice(0, 2).map((f, i) => (
          <g key={f.key}>
            <text x={-34} y={-10 + i * 14} fill={COLORS.TECHNICAL}>{f.key}:</text>
            <text x={4} y={-10 + i * 14} fill={COLORS.TEXT}>{f.value}</text>
          </g>
        ))}
      </g>
    )}
  </g>
)

// RequestCard — kartu request berdiri sendiri, dipakai Act 4 Beat B.
// Menampilkan resource path + fields (key:value).
const RequestCard = ({ label = 'REQUEST', resource = '', fields = [], color = COLORS.CLIENT }) => (
  <g>
    <rect x={-130} y={-64} width={260} height={128} rx={14} fill={COLORS.PANEL} stroke={color} strokeWidth={2} />
    <rect x={-130} y={-64} width={260} height={28} rx={14} fill={color} opacity={0.15} />
    <text x={0} y={-44} textAnchor="middle" fill={color} fontSize={12} fontFamily="monospace" fontWeight={800}>
      {label}
    </text>
    <text x={0} y={-20} textAnchor="middle" fill={COLORS.ADDRESS} fontSize={12} fontFamily="monospace" fontWeight={700}>
      {resource}
    </text>
    <line x1={-110} y1={-10} x2={110} y2={-10} stroke={COLORS.BORDER} strokeWidth={1} />
    {fields.map((f, i) => (
      <g key={f.key} transform={`translate(0, ${8 + i * 22})`}>
        <text x={-110} textAnchor="start" fill={COLORS.TECHNICAL} fontSize={12} fontFamily="monospace" fontWeight={700}>{f.key}:</text>
        <text x={-30} textAnchor="start" fill={COLORS.TEXT} fontSize={12} fontFamily="monospace">{f.value}</text>
      </g>
    ))}
  </g>
)

const SpeechBubble = ({ w = 420, h = 76, color, tailX = -20 }) => (
  <g>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={18} fill={COLORS.PANEL} stroke={color} strokeWidth={2} />
    <path d={`M ${tailX - 10} ${h / 2} L ${tailX - 24} ${h / 2 + 22} L ${tailX + 12} ${h / 2} Z`} fill={COLORS.PANEL} stroke={color} strokeWidth={2} />
  </g>
)

const StarburstBadge = ({ w = 480, h = 78, color }) => {
  const r1 = h / 2 + 8
  const r2 = h / 2 + 22
  return (
    <g>
      {Array.from({ length: 12 }).map((_, i) => {
        const ang = (i / 12) * Math.PI * 2
        return (
          <line key={i} x1={Math.cos(ang) * r1} y1={Math.sin(ang) * r1}
            x2={Math.cos(ang) * r2} y2={Math.sin(ang) * r2}
            stroke={color} strokeWidth={2} opacity={0.45} />
        )
      })}
      <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={h / 2} fill={COLORS.PANEL} stroke={color} strokeWidth={2.5} />
    </g>
  )
}

// ═══════════════════════════════════════════════════════════════
// REVISI-03 — komponen SVG baru, visual-first (0 PNG baru)
// ═══════════════════════════════════════════════════════════════

// ChainLinkBadge — Act 1, ganti continuityTag rect+teks italic.
const ChainLinkBadge = () => (
  <g>
    <rect x={-70} y={-18} width={140} height={36} rx={18}
      fill={COLORS.PANEL} stroke={COLORS.MUTED} strokeWidth={1.2} />
    <circle cx={-20} cy={0} r={9} fill="none" stroke={COLORS.MUTED} strokeWidth={2.5} />
    <circle cx={8} cy={0} r={9} fill="none" stroke={COLORS.MUTED} strokeWidth={2.5} />
    <rect x={-14} y={-6} width={18} height={12} fill={COLORS.PANEL} />
    <text x={28} y={5} fill={COLORS.MUTED} fontSize={10} fontStyle="italic">ep. lalu</text>
  </g>
)

// LargeQuestionMark — Act 1, ganti act1QuestionBubble.
const LargeQuestionMark = ({ color = COLORS.WARNING }) => (
  <g>
    <text textAnchor="middle" y={0} fontSize={96} fontWeight={900}
      fill={color} opacity={0.85} filter="url(#glow)">?</text>
  </g>
)

// ConsistencyBadge — Act 1, ganti act1PayoffCard.
const ConsistencyBadge = ({ color = COLORS.SUCCESS }) => {
  const R = 38
  return (
    <g>
      <circle r={56} fill={COLORS.PANEL} stroke={color} strokeWidth={2.5} />
      {[0, 120, 240].map((deg, i) => {
        const rad = (deg * Math.PI) / 180
        const x1 = Math.cos(rad) * R
        const y1 = Math.sin(rad) * R
        const rad2 = ((deg + 90) * Math.PI) / 180
        const x2 = Math.cos(rad2) * R
        const y2 = Math.sin(rad2) * R
        return (
          <path key={i}
            d={`M ${x1} ${y1} A ${R} ${R} 0 0 1 ${x2} ${y2}`}
            fill="none" stroke={color} strokeWidth={4} strokeLinecap="round" />
        )
      })}
      <text y={90} textAnchor="middle" fill={color}
        fontSize={13} fontWeight={700}>Konsisten</text>
    </g>
  )
}

// ChaosBadge — Act 2, ganti insightBadge.
const ChaosBadge = ({ color = COLORS.WARNING }) => (
  <g>
    <circle r={52} fill={COLORS.PANEL} stroke={color} strokeWidth={2.5} />
    <text x={-16} y={8} textAnchor="middle" fontSize={44} fontWeight={900}
      fill={color} opacity={0.9}>?</text>
    <text x={16} y={8} textAnchor="middle" fontSize={44} fontWeight={900}
      fill={COLORS.ERROR} opacity={0.9}>!</text>
    <text y={74} textAnchor="middle" fill={color}
      fontSize={12} fontWeight={700}>kacau</text>
  </g>
)

// RuleIcon — Act 2, ganti act2PayoffCard.
const RuleIcon = ({ color = COLORS.SUCCESS }) => (
  <g>
    <rect x={-52} y={-52} width={104} height={104} rx={14}
      fill={COLORS.PANEL} stroke={color} strokeWidth={2.2} />
    {[-20, 0, 20].map((y, i) => (
      <g key={i}>
        <circle cx={-30} cy={y} r={4} fill={color} />
        <rect x={-18} y={y - 3} width={52} height={6} rx={3}
          fill={color} opacity={i === 0 ? 0.9 : i === 1 ? 0.6 : 0.35} />
      </g>
    ))}
    <text y={70} textAnchor="middle" fill={color}
      fontSize={11} fontWeight={700}>→ aturan sama</text>
  </g>
)

// PutPatchComparison — Act 3, ganti putPatchNote.
const PutPatchComparison = ({ putItems = ACT3_PUT_ITEMS, patchItems = ACT3_PATCH_ITEMS }) => {
  const COL_W = 230
  const COL_H = 190
  const HEADER_H = 38
  const ROW_H = 32

  const Checkmark = ({ x, y, color }) => (
    <path d={`M ${x - 5} ${y} L ${x - 1} ${y + 4} L ${x + 6} ${y - 5}`}
      stroke={color} strokeWidth={2.5} fill="none" strokeLinecap="round" />
  )

  const renderPut = (x) => (
    <g transform={`translate(${x}, 0)`}>
      <rect x={-COL_W / 2} y={0} width={COL_W} height={COL_H} rx={12}
        fill={COLORS.PANEL} stroke={COLORS.TECHNICAL} strokeWidth={2} />
      <text x={0} y={HEADER_H / 2 + 6} textAnchor="middle"
        fill={COLORS.TECHNICAL} fontSize={15} fontFamily="monospace" fontWeight={800}>PUT</text>
      <line x1={-COL_W / 2 + 12} y1={HEADER_H} x2={COL_W / 2 - 12} y2={HEADER_H}
        stroke={COLORS.TECHNICAL} strokeWidth={1} opacity={0.4} />
      {putItems.map((item, i) => (
        <g key={i} transform={`translate(0, ${HEADER_H + 10 + i * ROW_H})`}>
          <Checkmark x={-COL_W / 2 + 22} y={6} color={COLORS.TECHNICAL} />
          <text x={-COL_W / 2 + 38} textAnchor="start"
            fill={COLORS.TEXT} fontSize={13} fontFamily="monospace">{item}</text>
        </g>
      ))}
      <text x={0} y={COL_H - 10} textAnchor="middle"
        fill={COLORS.TECHNICAL} fontSize={10} opacity={0.6} fontStyle="italic">ganti semua</text>
    </g>
  )

  const renderPatch = (x) => (
    <g transform={`translate(${x}, 0)`}>
      <rect x={-COL_W / 2} y={0} width={COL_W} height={COL_H} rx={12}
        fill={COLORS.PANEL} stroke={COLORS.WARNING} strokeWidth={2} />
      <text x={0} y={HEADER_H / 2 + 6} textAnchor="middle"
        fill={COLORS.WARNING} fontSize={15} fontFamily="monospace" fontWeight={800}>PATCH</text>
      <line x1={-COL_W / 2 + 12} y1={HEADER_H} x2={COL_W / 2 - 12} y2={HEADER_H}
        stroke={COLORS.WARNING} strokeWidth={1} opacity={0.4} />
      {patchItems.map((item, i) => (
        <g key={i} transform={`translate(0, ${HEADER_H + 10 + i * ROW_H})`}>
          {item.changed
            ? <path d={`M ${-COL_W / 2 + 16} 2 L ${-COL_W / 2 + 28} 10 M ${-COL_W / 2 + 28} 2 L ${-COL_W / 2 + 16} 10`}
                stroke={COLORS.WARNING} strokeWidth={2.5} strokeLinecap="round" />
            : <Checkmark x={-COL_W / 2 + 22} y={6} color={COLORS.MUTED} />
          }
          <text x={-COL_W / 2 + 38} textAnchor="start"
            fill={item.changed ? COLORS.WARNING : COLORS.MUTED}
            fontSize={13} fontFamily="monospace"
            fontWeight={item.changed ? 700 : 400}>{item.label}</text>
          {item.changed && (
            <text x={COL_W / 2 - 8} textAnchor="end"
              fill={COLORS.WARNING} fontSize={10}>← ubah</text>
          )}
        </g>
      ))}
      <text x={0} y={COL_H - 10} textAnchor="middle"
        fill={COLORS.WARNING} fontSize={10} opacity={0.6} fontStyle="italic">ubah sebagian</text>
    </g>
  )

  return (
    <g>
      {renderPut(-140)}
      {renderPatch(140)}
    </g>
  )
}

// ConfusedChefIcon — Act 4, ganti freeformNote.
const ConfusedChefIcon = ({ color = COLORS.WARNING }) => (
  <g>
    <circle r={44} fill={COLORS.PANEL} stroke={color} strokeWidth={2} />
    <rect x={-20} y={-50} width={40} height={22} rx={6}
      fill={COLORS.PANEL} stroke={color} strokeWidth={2} />
    <rect x={-28} y={-32} width={56} height={8} rx={4}
      fill={color} opacity={0.4} />
    <path d="M -16 -16 Q -8 -22 0 -16" stroke={color} strokeWidth={2.5}
      fill="none" strokeLinecap="round" />
    <path d="M 0 -16 Q 8 -22 16 -16" stroke={color} strokeWidth={2.5}
      fill="none" strokeLinecap="round" />
    <path d="M -10 2 Q 0 -2 10 2" stroke={color} strokeWidth={2}
      fill="none" strokeLinecap="round" />
    <text x={36} y={-32} fontSize={22} fontWeight={900}
      fill={COLORS.WARNING}>?</text>
  </g>
)

// StatelessDivider — Act 4, connector dashed antara 2 request card.
const StatelessDivider = () => (
  <g>
    <line x1={0} y1={-50} x2={0} y2={50}
      stroke={COLORS.BORDER} strokeWidth={1.5} strokeDasharray="5,5" />
    <rect x={-22} y={-12} width={44} height={24} rx={12}
      fill={COLORS.PANEL} stroke={COLORS.BORDER} strokeWidth={1} />
    <text x={0} y={5} textAnchor="middle"
      fill={COLORS.MUTED} fontSize={10} fontStyle="italic">baru</text>
  </g>
)

// LockFlying — Act 5, ganti teks "DATA RAHASIA" terbang.
const LockFlying = ({ color = COLORS.ERROR }) => (
  <g>
    <rect x={-16} y={-4} width={32} height={26} rx={6}
      fill={COLORS.PANEL} stroke={color} strokeWidth={2.5} />
    <circle cx={0} cy={8} r={5} fill="none" stroke={color} strokeWidth={2} />
    <rect x={-2} y={10} width={4} height={7} rx={1} fill={color} />
    <path d="M -12 -4 A 12 14 0 0 1 12 -4" fill="none"
      stroke={color} strokeWidth={3} strokeLinecap="round" />
  </g>
)

// AuthTeaser — Act 5, ganti act5TeaseBubble.
const AuthTeaser = ({ color = COLORS.WARNING }) => (
  <g>
    <rect x={-120} y={-36} width={240} height={72} rx={18}
      fill={COLORS.PANEL} stroke={color} strokeWidth={2} />
    <rect x={-84} y={-14} width={22} height={18} rx={4}
      fill="none" stroke={color} strokeWidth={2} />
    <path d="M -78 -14 A 7 8 0 0 1 -62 -14" fill="none"
      stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    <circle cx={-73} cy={-2} r={3} fill="none" stroke={color} strokeWidth={1.5} />
    <text x={-28} y={-10} textAnchor="start"
      fill={color} fontSize={14} fontWeight={700}>Siapa</text>
    <text x={-28} y={12} textAnchor="start"
      fill={color} fontSize={14} fontWeight={700}>yang boleh?</text>
    <text x={78} y={6} textAnchor="middle"
      fill={color} fontSize={20} fontWeight={900}>→</text>
  </g>
)

// PayoffCheckmark — Act 4, ganti act4PayoffCard (StarburstBadge besar).
const PayoffCheckmark = ({ color = COLORS.SUCCESS, label = '' }) => (
  <g>
    <circle r={50} fill={COLORS.PANEL} stroke={color} strokeWidth={2.5} />
    <path d="M -20 2 L -6 18 L 22 -16" stroke={color} strokeWidth={5}
      fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <text y={78} textAnchor="middle" fill={color}
      fontSize={13} fontWeight={700}>{label}</text>
  </g>
)

// CliffhangerIcon — Act 4, ganti act4Cliffhanger teks italic.
const CliffhangerIcon = ({ color = COLORS.WARNING, label = '' }) => (
  <g>
    <rect x={-16} y={-2} width={32} height={24} rx={6}
      fill={COLORS.PANEL} stroke={color} strokeWidth={2.2} />
    <circle cx={0} cy={10} r={4} fill="none" stroke={color} strokeWidth={1.8} />
    <path d="M -11 -2 A 11 13 0 0 1 11 -2" fill="none"
      stroke={color} strokeWidth={2.5} strokeLinecap="round" />
    <text x={30} y={12} textAnchor="start" fill={color}
      fontSize={14} fontWeight={700} fontStyle="italic">{label}</text>
  </g>
)

// ConsistencyCheck — Act 5, ganti act5PayoffCard.
const ConsistencyCheck = ({ color = COLORS.SUCCESS, label = '' }) => (
  <g>
    <circle r={44} fill={COLORS.PANEL} stroke={color} strokeWidth={2.5} />
    <path d="M -16 2 L -4 14 L 18 -12" stroke={color} strokeWidth={4.5}
      fill="none" strokeLinecap="round" strokeLinejoin="round" />
    <text y={66} textAnchor="middle" fill={color}
      fontSize={13} fontWeight={700}>{label}</text>
  </g>
)

export default function RestApiAnimation({
  paused = false,
  speed = 1.0,
  volume = 75,
  previewSfx = true,
  audioUnlocked = false,
}) {
  const svgRef = useRef(null)
  const tlRef = useRef(null)
  const audioUnlockedRef = useRef(audioUnlocked)
  const volumeRef = useRef(volume)
  const speedRef = useRef(speed)

  const [phaseIdx, setPhaseIdx] = useState(0)
  const [caption, setCaption] = useState('')
  const [pop, setPop] = useState({})

  // ── intro (typing -> morph) ──
  const [showIntro, setShowIntro] = useState(true)
  const [morphP, setMorphP] = useState(0)
  const [typed, setTyped] = useState({ title: '', subtitle: '' })
  const [cursorVisible, setCursorVisible] = useState(true)

  // ── PERSISTENT ANCHORS lintas-Act: gedung (Act1-5), 3 resource card
  // (Act2-5, label/status MORPH via state), formulir order (Act2-4). ──
  const [doorLabels, setDoorLabels] = useState(ACT2_DOORS.map(d => d.label))
  const [doorGood, setDoorGood] = useState([false, false, false])
  const [doorMethod, setDoorMethod] = useState(['', '', ''])
  const [orderMode, setOrderMode] = useState('freeform')
  const [orderColor, setOrderColor] = useState(COLORS.CLIENT)

  // ── elemen terbang — transient, dipakai Act2 (salah resource card) &
  // Act5 (resource rahasia). Pola sama moveCapsule di dns-explained. ──
  const [flyEnv, setFlyEnv] = useState({ x: 0, y: 0, opacity: 0, color: COLORS.CLIENT, mode: 'freeform' })
  // revisi-03: flyLock — gembok (LockFlying) terbang Act 5, ganti
  // "DATA RAHASIA" teks. Pola sama flyEnv, tapi tanpa color/mode.
  const [flyLock, setFlyLock] = useState({ x: 0, y: 0, opacity: 0 })

  const phase = PHASES[phaseIdx] || PHASES[0]
  const P = (id) => pop[id] || { scale: 0, opacity: 0, x: 0, y: 0 }

  useEffect(() => {
    const shouldEnable = previewSfx && audioUnlocked
    sfxLoader.setEnabled(shouldEnable)
    audioUnlockedRef.current = audioUnlocked
    volumeRef.current = volume
    speedRef.current = speed
  }, [previewSfx, audioUnlocked, volume, speed])

  // ── generic reveal helper (pop-in, sfxCategory eksplisit) ──
  const popIn = (tl, time, id, opts = {}) => {
    const {
      duration = 0.45, ease = 'back.out(1.6)', sfx = true,
      sfxName = SFX_MAP.POP.name, sfxCategory = SFX_MAP.POP.category,
      fromX = 0, fromY = 0,
    } = opts
    tl.add(() => setPop(prev => ({ ...prev, [id]: { scale: 0, opacity: 0, x: fromX, y: fromY } })), time)
    const o = { v: 0 }
    tl.to(o, {
      v: 1, duration, ease,
      onStart: () => { if (sfx) sfxLoader.play(sfxCategory, sfxName, { volume: volumeRef.current, speed: speedRef.current }) },
      onUpdate: () => setPop(prev => ({
        ...prev,
        [id]: { scale: o.v, opacity: Math.min(1, o.v * 1.4), x: fromX * (1 - o.v), y: fromY * (1 - o.v) },
      })),
    }, time)
  }

  const popOut = (tl, time, id, duration = 0.3) => {
    const o = { v: 1 }
    tl.to(o, {
      v: 0, duration, ease: 'power1.in',
      onUpdate: () => setPop(prev => ({ ...prev, [id]: { ...(prev[id] || {}), scale: o.v, opacity: o.v } })),
    }, time)
  }

  const say = (tl, time, text) => tl.add(() => setCaption(text), time)
  const sfxOn = (tl, time, category, name, opts = {}) =>
    tl.add(() => audioUnlockedRef.current && sfxLoader.play(category, name, {
      volume: volumeRef.current, speed: speedRef.current, ...opts,
    }), time)

  // ── ketik title/subtitle intro (seeded random, deterministik) ──
  const typeLine = (tl, startTime, lineKey, fullText, opts = {}) => {
    const { minDelay = 40, maxDelay = 100, avgDelay = 60 } = opts
    const lineSeed = lineKey === 'title' ? 1.7 : 9.3
    let acc = ''
    let time = startTime
    for (let i = 0; i < fullText.length; i++) {
      const char = fullText[i]
      const rand = seededRandom01(i * 12.9898 + lineSeed)
      const variance = (rand - 0.5) * (maxDelay - minDelay)
      const delay = Math.max(minDelay, Math.min(maxDelay, avgDelay + variance))
      tl.add(() => {
        acc += char
        setTyped(prev => ({ ...prev, [lineKey]: acc }))
        sfxLoader.play(SFX_MAP.CLICK.category, SFX_MAP.CLICK.name, {
          volume: volumeRef.current, speed: speedRef.current,
        })
      }, time)
      time += delay / 1000
    }
    return time - startTime
  }

  // ── elemen terbang A -> B (Act2 salah resource card, Act5 resource rahasia) ──
  const moveEnvelope = (tl, time, { from, to, duration = 0.6, color = COLORS.CLIENT, mode = 'freeform', ease = 'power2.inOut', sfxName = SFX_MAP.WHOOSH.name, sfxCategory = SFX_MAP.WHOOSH.category, hold = 0.15 }) => {
    tl.add(() => setFlyEnv({ x: from.x, y: from.y, opacity: 1, color, mode }), time)
    sfxOn(tl, time, sfxCategory, sfxName)
    const o = { v: 0 }
    tl.to(o, {
      v: 1, duration, ease,
      onUpdate: () => setFlyEnv({ x: lerp(from.x, to.x, o.v), y: lerp(from.y, to.y, o.v), opacity: 1, color, mode }),
    }, time)
    tl.add(() => setFlyEnv(prev => ({ ...prev, opacity: 0 })), time + duration + hold)
  }

  // revisi-03: LockFlying terbang A -> B (Act 5, ganti "DATA RAHASIA" teks).
  const moveLock = (tl, time, { from, to, duration = 0.7, ease = 'power2.inOut', sfxName = SFX_MAP.WHOOSH.name, sfxCategory = SFX_MAP.WHOOSH.category, hold = 0.15 }) => {
    tl.add(() => setFlyLock({ x: from.x, y: from.y, opacity: 1 }), time)
    sfxOn(tl, time, sfxCategory, sfxName)
    const o = { v: 0 }
    tl.to(o, {
      v: 1, duration, ease,
      onUpdate: () => setFlyLock({ x: lerp(from.x, to.x, o.v), y: lerp(from.y, to.y, o.v), opacity: 1 }),
    }, time)
    tl.add(() => setFlyLock(prev => ({ ...prev, opacity: 0 })), time + duration + hold)
  }

  // ═══════════════════════════════════════════════════════════════════════
  // MASTER TIMELINE
  // ═══════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 })
    tlRef.current = tl
    window.__animationTimeline = tl
    window.__flushSync = flushSync

    let t = 0

    // ═══════════════ INTRO — TYPING lalu MORPH ke header ═══════════════
    tl.add(() => {
      setShowIntro(true)
      setMorphP(0)
      setTyped({ title: '', subtitle: '' })
      setCursorVisible(true)
    }, t)
    t += 0.3

    t += typeLine(tl, t, 'title', INTRO_TITLE, { minDelay: 40, maxDelay: 100, avgDelay: 60 })
    t += 0.3
    t += typeLine(tl, t, 'subtitle', INTRO_SUBTITLE, { minDelay: 35, maxDelay: 85, avgDelay: 55 })

    for (let i = 0; i < 3; i++) {
      tl.add(() => {
        setCursorVisible(v => !v)
        sfxOn(tl, 0, SFX_MAP.TICK.category, SFX_MAP.TICK.name)
      }, t + i * 0.35)
    }
    t += 1.05
    t += 0.35

    tl.add(() => { setCursorVisible(false) }, t)
    sfxOn(tl, t, SFX_MAP.WHOOSH.category, SFX_MAP.WHOOSH.name)
    const mo = { p: 0 }
    tl.to(mo, { p: 1, duration: 0.8, ease: 'power3.inOut', onUpdate: () => setMorphP(mo.p) }, t)
    t += 0.8
    tl.add(() => setShowIntro(false), t)
    t += 0.3

    // ═══════════════ ACT 1 — KENAPA CARA PESANNYA BEDA? ═══════════════
    const act1Start = t
    tl.add(() => {
      setPhaseIdx(0)
      setCaption(PHASES[0].caption)
      setFlyEnv(prev => ({ ...prev, opacity: 0 }))
    }, act1Start)
    // revisi-03: visual-first — popOut wajib sebelum elemen berikutnya,
    // moveEnvelope dipotong dari 3× jadi 1×.
    popIn(tl, act1Start, 'buildingAnchor', { duration: 0.5, sfxName: SFX_MAP.MATERIALIZE.name, sfxCategory: SFX_MAP.MATERIALIZE.category })
    popIn(tl, act1Start, 'customerAnchor', { duration: 0.45, sfxName: SFX_MAP.POP.name, sfxCategory: SFX_MAP.POP.category })
    popIn(tl, act1Start + 0.3, 'continuityTag', { duration: 0.4 })
    popOut(tl, act1Start + 1.3, 'continuityTag')

    popIn(tl, act1Start + 1.5, 'signageBadge', { duration: 0.5, sfxName: SFX_MAP.MATERIALIZE.name, sfxCategory: SFX_MAP.MATERIALIZE.category })

    moveEnvelope(tl, act1Start + 2.5, { from: { x: 190, y: 210 }, to: { x: 540, y: 190 }, duration: 0.7, color: COLORS.CLIENT, sfxName: SFX_MAP.WHOOSH.name })

    popIn(tl, act1Start + 3.2, 'questionMark', { duration: 0.45, sfxName: SFX_MAP.CLICK.name, sfxCategory: SFX_MAP.CLICK.category })
    popOut(tl, act1Start + 4.4, 'questionMark')
    popIn(tl, act1Start + 4.6, 'consistencyBadge', { duration: 0.5, sfxName: SFX_MAP.SUCCESS.name, sfxCategory: SFX_MAP.SUCCESS.category })
    t = act1Start + PHASES[0].duration

    // ═══════════════ ACT 2 — SEBELUM ADA ATURAN: KACAU ═══════════════
    const act2Start = t
    tl.add(() => {
      setPhaseIdx(1)
      setCaption(PHASES[1].caption)
      setDoorLabels(ACT2_DOORS.map(d => d.label))
      setDoorGood([false, false, false])
      setDoorMethod(['', '', ''])
      setOrderMode('freeform')
      setOrderColor(COLORS.CLIENT)
    }, act2Start)
    // revisi-03: orderAnchor dipindah ke sesudah kekacauan (t+5.0,
    // dulu t+1.1) — narratively lebih pas. insightBadge -> chaosBadge,
    // act2PayoffCard -> ruleIcon, dengan popOut chaosBadge wajib dulu.
    DOOR_XS.forEach((dx, i) => {
      popIn(tl, act2Start + 0.2 + i * 0.2, `door-${i}`, { duration: 0.45, sfxName: SFX_MAP.MATERIALIZE.name, sfxCategory: SFX_MAP.MATERIALIZE.category })
    })

    // pelanggan coba resource card 1 — salah, balik dengan tanda X.
    moveEnvelope(tl, act2Start + 1.7, { from: ENVELOPE_REST_POS, to: { x: DOOR_XS[0], y: DOOR_Y }, duration: 0.5 })
    popIn(tl, act2Start + 2.3, 'xMark-0', { duration: 0.35, sfxName: SFX_MAP.ERROR.name, sfxCategory: SFX_MAP.ERROR.category })
    moveEnvelope(tl, act2Start + 2.7, { from: { x: DOOR_XS[0], y: DOOR_Y }, to: ENVELOPE_REST_POS, duration: 0.5 })

    // coba resource card 2 — salah lagi.
    moveEnvelope(tl, act2Start + 3.4, { from: ENVELOPE_REST_POS, to: { x: DOOR_XS[1], y: DOOR_Y }, duration: 0.5 })
    popIn(tl, act2Start + 4.0, 'xMark-1', { duration: 0.35, sfxName: SFX_MAP.ERROR.name, sfxCategory: SFX_MAP.ERROR.category })
    moveEnvelope(tl, act2Start + 4.4, { from: { x: DOOR_XS[1], y: DOOR_Y }, to: ENVELOPE_REST_POS, duration: 0.5 })

    popIn(tl, act2Start + 5.0, 'orderAnchor', { duration: 0.4, sfxName: SFX_MAP.POP.name, sfxCategory: SFX_MAP.POP.category })
    popIn(tl, act2Start + 5.4, 'chaosBadge', { duration: 0.5, sfxName: SFX_MAP.CHARGE.name, sfxCategory: SFX_MAP.CHARGE.category })
    popOut(tl, act2Start + 6.6, 'chaosBadge')
    popIn(tl, act2Start + 6.8, 'ruleIcon', { duration: 0.45, sfxName: SFX_MAP.CLICK.name, sfxCategory: SFX_MAP.CLICK.category })
    t = act2Start + PHASES[1].duration

    // ═══════════════ ACT 3 — ALAMAT, BUKAN AKSI ═══════════════
    const act3Start = t
    tl.add(() => { setPhaseIdx(2); setCaption(PHASES[2].caption) }, act3Start)
    // revisi-03: oldStrike & newReveal wajib popOut sebelum method
    // badges masuk (max 2-3 elemen bersamaan). putPatchNote -> SVG
    // PutPatchComparison (bertahan sampai akhir Act 3). act3PayoffCard
    // dihapus — caption bar sudah cukup.
    popIn(tl, act3Start + 0.2, 'oldStrike', { duration: 0.4, sfxName: SFX_MAP.POP.name, sfxCategory: SFX_MAP.POP.category })
    popOut(tl, act3Start + 1.6, 'oldStrike')
    popIn(tl, act3Start + 1.8, 'newReveal', { duration: 0.45, sfxName: SFX_MAP.MATERIALIZE.name, sfxCategory: SFX_MAP.MATERIALIZE.category })
    popOut(tl, act3Start + 2.5, 'newReveal', 0.4)

    ACT3_METHODS.forEach((m, i) => {
      popIn(tl, act3Start + 2.6 + i * 0.4, `methodBadge-${i}`, { duration: 0.4, sfxName: SFX_MAP.IMPACT.name, sfxCategory: SFX_MAP.IMPACT.category })
    })
    const methodsEnd = act3Start + 2.6 + ACT3_METHODS.length * 0.4

    // semua resource card ganti pola yang sama (morph, bukan pop-in ulang).
    tl.add(() => {
      setDoorLabels(DOOR_GOOD_RESOURCES)
      setDoorGood([true, true, true])
      setDoorMethod(['GET', 'GET', 'GET'])
    }, methodsEnd + 0.2)
    sfxOn(tl, methodsEnd + 0.2, SFX_MAP.SUCCESS.category, SFX_MAP.SUCCESS.name)

    popIn(tl, methodsEnd + 0.8, 'putPatchComparison', { duration: 0.5, sfxName: SFX_MAP.CLICK.name, sfxCategory: SFX_MAP.CLICK.category })
    t = act3Start + PHASES[2].duration

    // ═══════════════ ACT 4 — FORMULIR TERSTRUKTUR & REQUEST BERDIRI SENDIRI ═══════════════
    // Beat A: pesanan bebas -> formulir terstruktur (JSON)
    // Beat B: 2 kartu request bersanding — statelessness.
    // Petugas pelupa DIHAPUS sesuai revisi-02 § Keputusan Storytelling Baru poin 8.
    const act4Start = t
    tl.add(() => { setPhaseIdx(3); setCaption(PHASES[3].caption); setOrderMode('freeform') }, act4Start)

    // revisi-03: freeformNote -> confusedChef (popOut wajib sebelum
    // beat berikutnya). jsonNote & jsonFormatNote dihapus, diganti
    // centang kecil (checkChef) di sudut jsonFormCard. requestResourceLabel
    // dihapus (duplikat, resource sudah di dalam tiap RequestCard).
    // statelessNote jadi 1 baris teks pendek + statelessDivider baru.
    // act4PayoffCard -> act4PayoffLine, act4Clarify dihapus,
    // act4Cliffhanger -> cliffhangerLock.

    // ── Beat A: formulir bebas -> terstruktur ──
    tl.add(() => setOrderMode('freeform'), act4Start + 0.2)
    sfxOn(tl, act4Start + 0.2, SFX_MAP.MATERIALIZE.category, SFX_MAP.MATERIALIZE.name)
    popIn(tl, act4Start + 0.2, 'confusedChef', { duration: 0.4, sfxName: SFX_MAP.CLICK.name, sfxCategory: SFX_MAP.CLICK.category })
    popOut(tl, act4Start + 1.4, 'confusedChef')

    tl.add(() => setOrderMode('structured'), act4Start + 1.6)
    sfxOn(tl, act4Start + 1.6, SFX_MAP.MATERIALIZE.category, SFX_MAP.MATERIALIZE.name)
    popIn(tl, act4Start + 1.8, 'jsonFormCard', { duration: 0.45, sfxName: SFX_MAP.MATERIALIZE.name, sfxCategory: SFX_MAP.MATERIALIZE.category })
    popIn(tl, act4Start + 2.6, 'checkChef', { duration: 0.35, sfxName: SFX_MAP.SUCCESS.name, sfxCategory: SFX_MAP.SUCCESS.category })

    // ── Beat B: 2 kartu REQUEST bersanding ──
    popOut(tl, act4Start + 3.0, 'jsonFormCard')
    popOut(tl, act4Start + 3.0, 'checkChef')
    popIn(tl, act4Start + 3.2, 'request1Card', { duration: 0.45, sfxName: SFX_MAP.MATERIALIZE.name, sfxCategory: SFX_MAP.MATERIALIZE.category })
    popIn(tl, act4Start + 4.2, 'statelessDivider', { duration: 0.35 })
    popIn(tl, act4Start + 4.4, 'request2Card', { duration: 0.45, sfxName: SFX_MAP.MATERIALIZE.name, sfxCategory: SFX_MAP.MATERIALIZE.category })
    popIn(tl, act4Start + 5.6, 'statelessNote', { duration: 0.4, sfxName: SFX_MAP.CLICK.name, sfxCategory: SFX_MAP.CLICK.category })

    popOut(tl, act4Start + 6.6, 'request1Card')
    popOut(tl, act4Start + 6.6, 'request2Card')
    popOut(tl, act4Start + 6.6, 'statelessNote')
    popOut(tl, act4Start + 6.6, 'statelessDivider')

    popIn(tl, act4Start + 6.8, 'act4PayoffLine', { duration: 0.5, sfxName: SFX_MAP.SUCCESS.name, sfxCategory: SFX_MAP.SUCCESS.category })
    popOut(tl, act4Start + 7.6, 'act4PayoffLine')
    t = act4Start + PHASES[3].duration
    popIn(tl, act4Start + 7.8, 'cliffhangerLock', { duration: 0.35 })

    // ═══════════════ ACT 5 — KONSISTEN, TAPI SIAPA YANG BOLEH AKSES? ═══════════════
    const act5Start = t
    tl.add(() => { setPhaseIdx(4); setCaption(PHASES[4].caption); setOrderMode('structured') }, act5Start)

    // revisi-03: resource rahasia terbang pakai LockFlying (moveLock),
    // ganti teks "DATA RAHASIA" (flyEnv). act5PayoffCard -> consistencyCheck,
    // act5TeaseBubble -> authTeaser, dengan popOut wajib antar beat.
    popIn(tl, act5Start + 0.2, 'stamp200', { duration: 0.4, sfxName: SFX_MAP.DING.name, sfxCategory: SFX_MAP.DING.category })
    popIn(tl, act5Start + 0.8, 'stamp201', { duration: 0.4, sfxName: SFX_MAP.DING.name, sfxCategory: SFX_MAP.DING.category })

    moveLock(tl, act5Start + 1.8, { from: SECRET_ENVELOPE_START, to: SECRET_ENVELOPE_END, duration: 0.7, hold: 1.2 })
    popIn(tl, act5Start + 2.6, 'lockedBadge', { duration: 0.4, sfxName: SFX_MAP.LOCK.name, sfxCategory: SFX_MAP.LOCK.category })
    popOut(tl, act5Start + 3.2, 'stamp200')
    popOut(tl, act5Start + 3.2, 'stamp201')

    popIn(tl, act5Start + 3.6, 'consistencyCheck', { duration: 0.45, sfxName: SFX_MAP.SUCCESS.name, sfxCategory: SFX_MAP.SUCCESS.category })
    popOut(tl, act5Start + 4.4, 'consistencyCheck')
    popIn(tl, act5Start + 4.6, 'authTeaser', { duration: 0.45, sfxName: SFX_MAP.CLICK.name, sfxCategory: SFX_MAP.CLICK.category })
    popOut(tl, act5Start + 5.8, 'authTeaser')
    popIn(tl, act5Start + 6.0, 'act5NextTopic', { duration: 0.5, sfxName: SFX_MAP.CHARGE.name, sfxCategory: SFX_MAP.CHARGE.category })
    t = act5Start + PHASES[4].duration

    return () => {
      tl.kill()
      if (window.__animationTimeline === tl) delete window.__animationTimeline
    }
  }, [])

  useEffect(() => {
    if (!tlRef.current) return
    tlRef.current.timeScale(speed)
    if (paused) tlRef.current.pause(); else tlRef.current.resume()
  }, [speed, paused])

  // ── render helpers ──
  const T = (id, cx, cy) => {
    const p = P(id)
    return `translate(${cx + p.x}, ${cy + p.y}) scale(${p.scale})`
  }
  const O = (id) => P(id).opacity

  return (
    <svg ref={svgRef} viewBox={`0 0 ${VW} ${VH}`}
      style={{ width: '100%', height: '100%', maxHeight: '100vh',
        maxWidth: `calc(100vh * ${VW} / ${VH})`, background: COLORS.BG, userSelect: 'none' }}>

      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="b2" />
          <feMerge><feMergeNode in="b2" /><feMergeNode in="b1" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="shadow">
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000000" floodOpacity="0.5" />
        </filter>
      </defs>

      <rect x={0} y={0} width={VW} height={VH} fill={COLORS.BG} />
      <g opacity={0.05}>
        {Array.from({ length: 21 }).map((_, i) => <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={VH} stroke={COLORS.TECHNICAL} strokeWidth={1} />)}
        {Array.from({ length: 34 }).map((_, i) => <line key={`h${i}`} x1={0} y1={i * 40} x2={VW} y2={i * 40} stroke={COLORS.TECHNICAL} strokeWidth={1} />)}
      </g>

      {/* ── HEADER (typing besar -> morph jadi header kecil) ── */}
      {(() => {
        const mp = morphP
        const thumbWidth = 360
        const startX = (VW / 2) - (thumbWidth / 2)
        const endX = 44
        const taglineX = lerp(startX, endX, mp)
        const taglineY = lerp(560, 50, mp)
        const taglineFs = lerp(18, 13, mp)
        const titleX = lerp(startX, endX, mp)
        const titleY = lerp(650, 100, mp)
        const titleFs = lerp(56, 42, mp)
        const subX = lerp(startX, endX, mp)
        const subY = lerp(710, 130, mp)
        const subFs = lerp(20, 15, mp)
        const tt = typed.title
        // revisi-01: title split hijau→biru (COLORS.SUCCESS / COLORS.CLIENT)
        const titleSplitIdx = 4 // "REST" (hijau) | " API" (biru)
        const cursorColor = tt.length <= titleSplitIdx ? COLORS.SUCCESS : COLORS.CLIENT
        return (
          <g>
            <text x={taglineX} y={taglineY} textAnchor="start" fill={COLORS.MUTED} fontSize={taglineFs} fontFamily="monospace" letterSpacing={2}>
              NETWORKING · <tspan fill={COLORS.SUCCESS} fontWeight={700}>REST</tspan>
            </text>
            <text x={titleX} y={titleY} textAnchor="start" fontSize={titleFs}
              fontFamily="'Arial Black', Impact, sans-serif" fontWeight={900} filter="url(#glow)">
              <tspan fill={COLORS.SUCCESS}>{tt.slice(0, titleSplitIdx)}</tspan>
              <tspan fill={COLORS.CLIENT}>{tt.slice(titleSplitIdx)}</tspan>
              {showIntro && tt.length < INTRO_TITLE.length && cursorVisible && (
                <tspan fill={cursorColor} fontWeight={900}>█</tspan>
              )}
            </text>
            <text x={subX} y={subY} textAnchor="start" fontSize={subFs} fontFamily="sans-serif" fill={COLORS.MUTED}>
              {typed.subtitle}
              {showIntro && tt.length === INTRO_TITLE.length &&
                typed.subtitle.length < INTRO_SUBTITLE.length && cursorVisible && (
                <tspan fill={COLORS.CLIENT} fontWeight={900}>█</tspan>
              )}
            </text>
          </g>
        )
      })()}

      {/* ── PHASE BADGE ── */}
      {!showIntro && (
        <g transform="translate(44, 155)">
          <rect width={500} height={40} rx={20} fill={COLORS.PANEL} stroke={phase.badgeColor} strokeWidth={1.8} filter="url(#shadow)" />
          <circle cx={22} cy={20} r={6} fill={phase.badgeColor} filter="url(#glow)" />
          <text x={40} y={26} fill={phase.badgeColor} fontSize={12.5} fontFamily="monospace" fontWeight={700} letterSpacing={0.5}>
            {phase.badge}
          </text>
          <g transform="translate(620, 12)">
            {PHASES.map((ph, i) => (
              <circle key={ph.id} cx={i * 24} cy={8}
                r={i === phaseIdx ? 7 : 4}
                fill={i === phaseIdx ? phase.badgeColor : COLORS.BORDER}
                stroke={i === phaseIdx ? '#ffffff' : 'none'} strokeWidth={1.5} />
            ))}
          </g>
        </g>
      )}

      {/* ── CONTENT ── */}
      {!showIntro && (
      <g transform="translate(44, 220)">
        <rect width={732} height={52} rx={14} fill={COLORS.PANEL} stroke={COLORS.BORDER} strokeWidth={1} />
        <text x={366} y={32} textAnchor="middle" fill={COLORS.TEXT} fontSize={15} fontFamily="sans-serif">
          {caption}
        </text>

        <g transform="translate(0, 80)">

          {/* ═══════ ANCHOR — gedung restoran, karakter pelanggan,
              3 resource card, formulir pesanan (persisten Act1..5).
              popIn() sekali di entrance pertama; Act berikutnya
              cuma morph label/warna/mode. ═══════ */}
          <g transform={T('buildingAnchor', BUILDING_POS.x, BUILDING_POS.y)} opacity={O('buildingAnchor')}>
            <RestaurantBuilding active={phaseIdx === 0} />
          </g>

          {/* CustomerCharacter — anchor baru Act 1-5, sisi kiri gedung */}
          <g transform={T('customerAnchor', BUILDING_POS.x - 200, BUILDING_POS.y + 20)} opacity={O('customerAnchor')}>
            <CustomerCharacter color={COLORS.CLIENT} />
          </g>

          {DOOR_XS.map((dx, i) => (
            <g key={`door-${i}`} transform={T(`door-${i}`, dx, DOOR_Y)} opacity={O(`door-${i}`)}>
              <DoorBox good={doorGood[i]} resourceLabel={doorLabels[i]} methodLabel={doorMethod[i]} />
              {!doorGood[i] && O(`xMark-${i}`) > 0 && (
                <g transform={`scale(${P(`xMark-${i}`).scale})`} opacity={O(`xMark-${i}`)}>
                  <line x1={-14} y1={-46} x2={14} y2={-18} stroke={COLORS.ERROR} strokeWidth={4} strokeLinecap="round" />
                  <line x1={14} y1={-46} x2={-14} y2={-18} stroke={COLORS.ERROR} strokeWidth={4} strokeLinecap="round" />
                </g>
              )}
            </g>
          ))}

          <g transform={T('orderAnchor', ENVELOPE_REST_POS.x, ENVELOPE_REST_POS.y)} opacity={O('orderAnchor')}>
            <OrderFormCard color={orderColor} mode={orderMode} fields={ACT4_JSON_FIELDS} />
          </g>

          {flyEnv.opacity > 0 && (
            <g transform={`translate(${flyEnv.x}, ${flyEnv.y}) scale(0.6)`} opacity={flyEnv.opacity}>
              <OrderFormCard color={flyEnv.color} mode={flyEnv.mode} fields={[]} />
            </g>
          )}

          {/* ═══════ ACT 1 — KENAPA CARA PESANNYA BEDA? ═══════
              revisi-03: continuityTag -> ChainLinkBadge (pop id tetap),
              act1QuestionBubble -> questionMark (LargeQuestionMark di
              atas gedung), act1PayoffCard -> consistencyBadge. */}
          {phaseIdx === 0 && (
            <g>
              <g transform={T('continuityTag', 640, 20)} opacity={O('continuityTag')}>
                <ChainLinkBadge />
              </g>
              <g transform={T('signageBadge', 366, 20)} opacity={O('signageBadge')}>
                <StarburstBadge w={280} h={64} color={COLORS.TECHNICAL} />
                <image href={getIcon('gate-signage')} x={-118} y={-20} width={40} height={40} />
                <text x={14} textAnchor="middle" y={6} fill={COLORS.TECHNICAL} fontSize={18} fontWeight={800}>{ACT1_SIGNAGE}</text>
              </g>
              <g transform={T('questionMark', BUILDING_POS.x, BUILDING_POS.y - 120)} opacity={O('questionMark')}>
                <LargeQuestionMark />
              </g>
              <g transform={T('consistencyBadge', 366, 540)} opacity={O('consistencyBadge')}>
                <ConsistencyBadge />
              </g>
            </g>
          )}

          {/* ═══════ ACT 2 — SEBELUM ADA ATURAN: KACAU ═══════
              revisi-03: insightBadge -> chaosBadge, act2PayoffCard -> ruleIcon. */}
          {phaseIdx === 1 && (
            <g>
              <g transform={T('chaosBadge', 366, 800)} opacity={O('chaosBadge')}>
                <ChaosBadge />
              </g>
              <g transform={T('ruleIcon', 366, 900)} opacity={O('ruleIcon')}>
                <RuleIcon />
              </g>
            </g>
          )}

          {/* ═══════ ACT 3 — ALAMAT, BUKAN AKSI ═══════ */}
          {phaseIdx === 2 && (
            <g>
              <g transform={T('oldStrike', OLD_STRIKE_POS.x, OLD_STRIKE_POS.y)} opacity={O('oldStrike')}>
                <rect x={-160} y={-30} width={320} height={60} rx={12} fill={COLORS.PANEL} stroke={COLORS.ERROR} strokeWidth={1.8} />
                <text textAnchor="middle" y={6} fill={COLORS.ERROR} fontSize={16} fontFamily="monospace" fontWeight={700}>{ACT3_OLD_ENDPOINT}</text>
                <line x1={-140} y1={0} x2={140} y2={0} stroke={COLORS.ERROR} strokeWidth={2.5} />
              </g>

              <g transform={T('newReveal', NEW_REVEAL_POS.x, NEW_REVEAL_POS.y)} opacity={O('newReveal')}>
                <rect x={-190} y={-24} width={380} height={48} rx={12} fill={COLORS.PANEL} stroke={COLORS.SUCCESS} strokeWidth={2} />
                <text textAnchor="middle" y={6} fill={COLORS.SUCCESS} fontSize={17} fontFamily="monospace" fontWeight={700}>{ACT3_NEW_ENDPOINT}</text>
              </g>

              {ACT3_METHODS.map((m, i) => {
                const isPair = i === 2 || i === 3
                const methodIconId = ['method-get', 'method-post', 'method-put', 'method-patch', 'method-delete'][i]
                return (
                  <g key={m.method} transform={T(`methodBadge-${i}`, METHOD_XS[i], METHOD_Y)} opacity={O(`methodBadge-${i}`)}>
                    <rect x={-58} y={-36} width={116} height={72} rx={12} fill={COLORS.PANEL}
                      stroke={isPair ? COLORS.WARNING : COLORS.TECHNICAL} strokeWidth={isPair ? 2.2 : 1.8} />
                    {/* revisi-03: icon diperbesar 22px -> 36px, label bawah dihapus (icon cukup tanpa label) */}
                    <image href={getIcon(methodIconId)} x={-18} y={-24} width={36} height={36} />
                    <text textAnchor="middle" y={26} fill={COLORS.TECHNICAL} fontSize={12} fontFamily="monospace" fontWeight={800}>{m.method}</text>
                  </g>
                )
              })}

              {/* revisi-03: putPatchNote (teks) -> PutPatchComparison (SVG 2 kolom), act3PayoffCard dihapus */}
              <g transform={T('putPatchComparison', PUTPATCH_POS.x, PUTPATCH_POS.y - 60)} opacity={O('putPatchComparison')}>
                <PutPatchComparison />
              </g>
            </g>
          )}

          {/* ═══════ ACT 4 — FORMULIR TERSTRUKTUR & REQUEST BERDIRI SENDIRI ═══════
              Beat A: pesanan bebas -> terstruktur.
              Beat B: 2 kartu REQUEST bersanding (statelessness).
              Petugas pelupa DIHAPUS — lihat revisi-02 § Keputusan Storytelling Baru poin 8. */}
          {phaseIdx === 3 && (
            <g>
              {/* Beat A — revisi-03: freeformNote -> ConfusedChefIcon */}
              <g transform={T('confusedChef', 366, 600)} opacity={O('confusedChef')}>
                <ConfusedChefIcon />
              </g>

              <g transform={T('jsonFormCard', 366, 690)} opacity={O('jsonFormCard')}>
                <rect x={-220} y={-46} width={440} height={92} rx={14} fill={COLORS.PANEL} stroke={COLORS.TECHNICAL} strokeWidth={2} filter="url(#shadow)" />
                <image href={getIcon('structured-form')} x={-210} y={-42} width={18} height={18} />
                {ACT4_JSON_FIELDS.map((f, i) => (
                  <g key={f.key} transform={`translate(0, ${-18 + i * 30})`}>
                    <text x={-190} textAnchor="start" fill={COLORS.TECHNICAL} fontSize={14} fontFamily="monospace" fontWeight={700}>{f.key}:</text>
                    <text x={-40} textAnchor="start" fill={COLORS.TEXT} fontSize={14} fontFamily="monospace">{f.value}</text>
                  </g>
                ))}
                {ACT4_JSON_FIELDS.length > 1 && (
                  <line x1={-190} y1={-3} x2={190} y2={-3} stroke={COLORS.BORDER} strokeWidth={1} />
                )}
                {/* revisi-03: jsonNote & jsonFormatNote dihapus, ganti centang kecil di pojok */}
                <g transform="translate(198, -34)" opacity={O('checkChef')}>
                  <circle r={12} fill={COLORS.PANEL} stroke={COLORS.SUCCESS} strokeWidth={2} />
                  <path d="M -5 0 L -1 5 L 6 -5" stroke={COLORS.SUCCESS} strokeWidth={2.2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              </g>

              {/* Beat B — 2 REQUEST card bersanding. revisi-03: requestResourceLabel
                  dihapus (duplikat, resource sudah di dalam tiap RequestCard) */}
              <g transform={T('request1Card', REQUEST_CARD_LEFT_X, REQUEST_CARD_Y)} opacity={O('request1Card')}>
                <RequestCard
                  label={ACT4_REQUEST1_LABEL}
                  resource={ACT4_REQUEST_RESOURCE}
                  fields={ACT4_REQUEST1_FIELDS}
                  color={COLORS.CLIENT}
                />
              </g>
              <g transform={T('statelessDivider', (REQUEST_CARD_LEFT_X + REQUEST_CARD_RIGHT_X) / 2, REQUEST_CARD_Y)} opacity={O('statelessDivider')}>
                <StatelessDivider />
              </g>
              <g transform={T('request2Card', REQUEST_CARD_RIGHT_X, REQUEST_CARD_Y)} opacity={O('request2Card')}>
                <RequestCard
                  label={ACT4_REQUEST2_LABEL}
                  resource={ACT4_REQUEST_RESOURCE}
                  fields={ACT4_REQUEST2_FIELDS}
                  color={COLORS.SERVER}
                />
              </g>

              {/* revisi-03: statelessNote jadi 1 baris teks pendek */}
              <g transform={T('statelessNote', 366, 960)} opacity={O('statelessNote')}>
                <text textAnchor="middle" fill={COLORS.TECHNICAL} fontSize={14} fontWeight={700}>{ACT4_STATELESS_NOTE}</text>
              </g>

              {/* revisi-03: act4PayoffCard (StarburstBadge) -> PayoffCheckmark, act4Clarify dihapus */}
              <g transform={T('act4PayoffLine', 366, 1060)} opacity={O('act4PayoffLine')}>
                <PayoffCheckmark label={ACT4_PAYOFF} />
              </g>
              {/* revisi-03: act4Cliffhanger (teks italic) -> CliffhangerIcon */}
              <g transform={T('cliffhangerLock', 306, 1140)} opacity={O('cliffhangerLock')}>
                <CliffhangerIcon label={ACT4_CLIFFHANGER} />
              </g>
            </g>
          )}

          {/* ═══════ ACT 5 — KONSISTEN, TAPI SIAPA YANG BOLEH AKSES? ═══════ */}
          {phaseIdx === 4 && (
            <g>
              <g transform={T('stamp200', STAMP_200_POS.x, STAMP_200_POS.y)} opacity={O('stamp200')}>
                <circle r={38} fill="none" stroke={ACT5_STATUS_200.color} strokeWidth={3} />
                <image href={getIcon('stamp-200')} x={-14} y={-34} width={28} height={28} />
                <text textAnchor="middle" y={12} fill={ACT5_STATUS_200.color} fontSize={14} fontWeight={800}>{ACT5_STATUS_200.code}</text>
                <text textAnchor="middle" y={26} fill={ACT5_STATUS_200.color} fontSize={9} fontWeight={700}>{ACT5_STATUS_200.label}</text>
              </g>
              <g transform={T('stamp201', STAMP_201_POS.x, STAMP_201_POS.y)} opacity={O('stamp201')}>
                <circle r={38} fill="none" stroke={ACT5_STATUS_201.color} strokeWidth={3} />
                <image href={getIcon('stamp-201')} x={-14} y={-34} width={28} height={28} />
                <text textAnchor="middle" y={12} fill={ACT5_STATUS_201.color} fontSize={14} fontWeight={800}>{ACT5_STATUS_201.code}</text>
                <text textAnchor="middle" y={26} fill={ACT5_STATUS_201.color} fontSize={9} fontWeight={700}>{ACT5_STATUS_201.label}</text>
              </g>

              {/* revisi-03: resource rahasia — LockFlying (flyLock), ganti
                  teks "DATA RAHASIA" (flyEnv), terbang ke resource card ke-3 */}
              {flyLock.opacity > 0 && (
                <g transform={`translate(${flyLock.x}, ${flyLock.y})`} opacity={flyLock.opacity}>
                  <LockFlying />
                </g>
              )}

              {/* lockedBadge — icon kunci di resource card ke-3 (REPLACE dari
                  envelope-locked ke ikon kunci polos, pending generate manual).
                  Sementara icon masih PNG lama (gembok+amplop) sampai PNG baru tersedia. */}
              <g transform={T('lockedBadge', SECRET_ENVELOPE_END.x, SECRET_ENVELOPE_END.y)} opacity={O('lockedBadge')}>
                <image href={getIcon('envelope-locked')} x={-18} y={-20} width={36} height={36} />
              </g>

              {/* revisi-03: act5PayoffCard -> ConsistencyCheck, act5TeaseBubble -> AuthTeaser */}
              <g transform={T('consistencyCheck', 366, 650)} opacity={O('consistencyCheck')}>
                <ConsistencyCheck label={ACT5_PAYOFF} />
              </g>
              <g transform={T('authTeaser', 366, 740)} opacity={O('authTeaser')}>
                <AuthTeaser />
              </g>
              <g transform={T('act5NextTopic', 366, 840)} opacity={O('act5NextTopic')}>
                <StarburstBadge w={380} h={70} color={COLORS.TECHNICAL} />
                <text textAnchor="middle" y={-6} fill={COLORS.TECHNICAL} fontSize={16} fontWeight={800}>{ACT5_NEXT_TOPIC}</text>
                <text textAnchor="middle" y={16} fill={COLORS.MUTED} fontSize={10.5}>{ACT5_REST_NOTE}</text>
              </g>
            </g>
          )}

        </g>
      </g>
      )}
    </svg>
  )
}
