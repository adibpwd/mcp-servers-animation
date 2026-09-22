// src/content/18-auth/Animation.jsx
// ─────────────────────────────────────────────────────────────
// Authentication — lanjutan langsung dari rest-api (17): amplop
// bersegel-gembok yang di-tease di closing Act 5 topic itu akhirnya
// sampai gerbang, tapi identitas pengirimnya belum pernah dicek.
// Analogi: gerbang kantor pos & kartu identitas — authn (siapa kamu)
// vs authz (boleh buka apa). Lihat _docs/AUTH_PLAN.md untuk story
// spine & akurasi teknis (authn≠authz, hash≠enkripsi, JWT encoded
// bukan encrypted, session vs token trade-off).
//
// STATUS EKSEKUSI: Intro + Act 1..5 first pass, PAKAI icon PNG asli
// (14/14 sudah digenerate, lihat icons/icons.json) — beda dari
// rest-api (17) yang first pass-nya masih pure-SVG. Belum preview
// manual & export MP4.
// ─────────────────────────────────────────────────────────────

import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, SFX_MAP,
  INTRO_TITLE, INTRO_SUBTITLE,
  ACT1_CONTINUITY_LINE, ACT1_SIGNAGE, ACT1_ADDRESS_OK_LABEL, ACT1_QUESTION, ACT1_PAYOFF,
  ACT2_ID_CARD_FIELDS, ACT2_GUESTBOOK_ROW_NOTE, ACT2_THEFT_INSIGHT, ACT2_PAYOFF,
  ACT3_HASH_LABEL, ACT3_REVERSE_FAIL_NOTE, ACT3_COMPARE_NOTE, ACT3_SAFE_NOTE, ACT3_CLIFFHANGER,
  ACT4_SESSION_LABEL, ACT4_TOKEN_LABEL, ACT4_SESSION_ISSUED_NOTE, ACT4_SESSION_CHECK_NOTE,
  ACT4_TOKEN_PAYLOAD_NOTE, ACT4_TOKEN_INDEPENDENCE_NOTE, ACT4_STATELESS_CALLBACK,
  ACT4_TRADEOFF_NOTE, ACT4_CLIFFHANGER,
  ACT5_RESTRICTED_DOOR_LABEL, ACT5_DUAL_STAMP, ACT5_TWO_CHECKS_NOTE,
  ACT5_STATUS_BONUS_NOTE, ACT5_PAYOFF,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'
import { getIcon } from './icons/loader'

// ── deterministic pseudo-random (seeded) — WAJIB (bukan Math.random),
// timeline di-build ulang di proses Chrome terpisah saat export. ──
const seededRandom01 = (seed) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}
const lerp = (a, b, t) => a + (b - a) * t
const HEX = '0123456789abcdef'
const seededHash = (len, seed) =>
  Array.from({ length: len }, (_, i) => HEX[Math.floor(seededRandom01(seed + i * 3.1) * 16)]).join('')

// ── posisi anchor lokal (di dalam <g transform="translate(44,220)">
// lalu <g transform="translate(0,80)">, sama pola dns-explained/
// http-request-response/rest-api) ──
const GATE_POS            = { x: 300, y: 95 }
const OFFICER_POS         = { x: 560, y: 125 }
const ENVELOPE_POS        = { x: 366, y: 235 }
const ID_CARD_POS         = { x: 170, y: 420 }
const DESK_POS            = { x: 366, y: 420 } // guestbook -> front-desk (morph, icon pengganti)
const INTRUDER_POS        = { x: 610, y: 400 }
const HASH_MACHINE_POS    = { x: 366, y: 420 }
const HASH_IN_POS         = { x: 170, y: 420 }
const HASH_OUT_POS        = { x: 560, y: 420 }
const STAMP_A_POS         = { x: 280, y: 560 }
const STAMP_B_POS         = { x: 452, y: 560 }
const VISITOR_BADGE_POS   = { x: 560, y: 235 }
const DOOR_OFFICER_POS    = { x: 366, y: 560 }
const DOOR_OFFICER_BUBBLE_POS = { x: 610, y: 520 }
const RESTRICTED_DOOR_POS = { x: 300, y: 110 }
const DUAL_STAMP_A_POS    = { x: 260, y: 300 }
const DUAL_STAMP_B_POS    = { x: 480, y: 300 }

// ═══════════════════════════════════════════════
// SHAPE HELPERS — icon PNG asli (getIcon) + aksen SVG kecil.
// Formula centering icon: x=-size/2, y=-size/2 (06-icon-generation §6.2)
// ═══════════════════════════════════════════════

// Frame kartu generik dgn icon PNG di tengah + label opsional di bawah.
const IconFrame = ({ iconId, size = 72, frameW, frameH, color = COLORS.TECHNICAL, label = '', labelColor, glow = false }) => {
  const fw = frameW || size + 44
  const fh = frameH || size + (label ? 56 : 32)
  const iconY = label ? -fh / 2 + 14 : -size / 2
  return (
    <g>
      <rect x={-fw / 2} y={-fh / 2} width={fw} height={fh} rx={16}
        fill={COLORS.PANEL} stroke={color} strokeWidth={2}
        filter={glow ? 'url(#glow)' : 'url(#shadow)'} />
      <image href={getIcon(iconId)} x={-size / 2} y={iconY} width={size} height={size} />
      {label && (
        <text textAnchor="middle" y={fh / 2 - 14} fontSize={11} fontWeight={700} fill={labelColor || color}>{label}</text>
      )}
    </g>
  )
}

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

const MiniCheck = ({ color = COLORS.SUCCESS, r = 15 }) => (
  <g>
    <circle r={r} fill={COLORS.PANEL} stroke={color} strokeWidth={2.4} />
    <path d={`M ${-r * 0.45} 0 L ${-r * 0.1} ${r * 0.4} L ${r * 0.5} ${-r * 0.35}`}
      fill="none" stroke={color} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
  </g>
)

const MiniX = ({ color = COLORS.ERROR, r = 15 }) => (
  <g>
    <circle r={r} fill={COLORS.PANEL} stroke={color} strokeWidth={2.4} />
    <line x1={-r * 0.4} y1={-r * 0.4} x2={r * 0.4} y2={r * 0.4} stroke={color} strokeWidth={3} strokeLinecap="round" />
    <line x1={r * 0.4} y1={-r * 0.4} x2={-r * 0.4} y2={r * 0.4} stroke={color} strokeWidth={3} strokeLinecap="round" />
  </g>
)

const CheckboxRow = ({ label, checked, color }) => (
  <g>
    <rect x={-14} y={-14} width={28} height={28} rx={6} fill="none" stroke={checked ? COLORS.SUCCESS : COLORS.MUTED} strokeWidth={2.4} />
    {checked && (
      <path d="M -7 0 L -2 6 L 8 -7" fill="none" stroke={COLORS.SUCCESS} strokeWidth={3.4} strokeLinecap="round" strokeLinejoin="round" />
    )}
    <text x={24} y={5} textAnchor="start" fontSize={13} fontWeight={700} fill={checked ? COLORS.SUCCESS : COLORS.MUTED}>{label}</text>
  </g>
)

// Amplop terbuka — dipakai HANYA di payoff Act 5 (belum ada aset PNG
// khusus "envelope-open", jadi digambar manual, pola sama dengan
// EnvelopeShape mode-morph di rest-api/Animation.jsx).
const EnvelopeOpenBurst = ({ color = COLORS.SUCCESS }) => (
  <g>
    <rect x={-46} y={-30} width={92} height={60} rx={6} fill={COLORS.PANEL} stroke={color} strokeWidth={2.4} />
    <path d="M -46 -30 L 0 2 L 46 -30" fill="none" stroke={color} strokeWidth={2.2} />
    <rect x={-30} y={-46} width={60} height={30} rx={4} fill={COLORS.PANEL} stroke={color} strokeWidth={2} />
    {Array.from({ length: 8 }).map((_, i) => {
      const ang = (i / 8) * Math.PI * 2
      const r1 = 58, r2 = 74
      return (
        <line key={i} x1={Math.cos(ang) * r1} y1={Math.sin(ang) * r1}
          x2={Math.cos(ang) * r2} y2={Math.sin(ang) * r2}
          stroke={color} strokeWidth={2.4} strokeLinecap="round" opacity={0.7} />
      )
    })}
  </g>
)

export default function AuthAnimation({
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

  // ── PERSISTENT ANCHORS lintas-Act (lihat _docs/AUTH_PLAN.md §
  // Persistent Anchor Objects): gerbang & penjaga gerbang (Act1-3,
  // pop-out Act4, kembali Act5 sbg penjaga arsip rahasia), amplop
  // bersegel (Act1-5, icon-nya morph jadi magic-seal-token di Act4B
  // — "icon pengganti" 06-icon-generation §6.4), buku tamu/meja
  // resepsionis (Act2-4A, icon morph guestbook-open -> front-desk). ──
  const [envelopeIcon, setEnvelopeIcon] = useState('locked-envelope')
  const [deskIcon, setDeskIcon] = useState('guestbook-open')
  const [deskRows, setDeskRows] = useState([]) // baris teks isi buku tamu/desk, morph tiap Act
  const [hashText, setHashText] = useState('')
  const [dualChecked, setDualChecked] = useState(ACT5_DUAL_STAMP.map(s => s.checked))
  const [envelopeOpened, setEnvelopeOpened] = useState(false)

  // ── objek terbang generik (amplop/token/badge) — transient, pola
  // sama moveCapsule di dns-explained & moveEnvelope di rest-api. ──
  const [flyObj, setFlyObj] = useState({ x: 0, y: 0, opacity: 0, iconId: 'locked-envelope', size: 56 })

  const phase = PHASES[phaseIdx] || PHASES[0]
  const P = (id) => pop[id] || { scale: 0, opacity: 0, x: 0, y: 0 }

  useEffect(() => {
    const shouldEnable = previewSfx && audioUnlocked
    sfxLoader.setEnabled(shouldEnable)
    audioUnlockedRef.current = audioUnlocked
    volumeRef.current = volume
    speedRef.current = speed
  }, [previewSfx, audioUnlocked, volume, speed])

  // ── generic reveal helper (pop-in, kategori SFX eksplisit) ──
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

  // ── kebalikan popIn — dipakai saat karakter "pergi" sebelum yang
  // baru muncul (Act 4 Beat A, ganti-ganti penjaga ruangan). ──
  const popOut = (tl, time, id, duration = 0.3) => {
    const o = { v: 1 }
    tl.to(o, {
      v: 0, duration, ease: 'power1.in',
      onUpdate: () => setPop(prev => ({ ...prev, [id]: { ...(prev[id] || {}), scale: o.v, opacity: o.v } })),
    }, time)
  }

  const sfxOn = (tl, time, category, name, opts = {}) =>
    tl.add(() => audioUnlockedRef.current && sfxLoader.play(category, name, {
      volume: volumeRef.current, speed: speedRef.current, ...opts,
    }), time)

  // ── ketik title/subtitle intro (seeded random, bukan Math.random) ──
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
        sfxLoader.play(SFX_MAP.TYPING.category, SFX_MAP.TYPING.name, {
          volume: volumeRef.current, speed: speedRef.current,
        })
      }, time)
      time += delay / 1000
    }
    return time - startTime
  }

  // ── objek terbang A -> B (amplop/segel/badge), generic ──
  const moveIcon = (tl, time, { from, to, duration = 0.6, iconId = 'locked-envelope', size = 56, ease = 'power2.inOut', sfxName = SFX_MAP.WHOOSH.name, sfxCategory = SFX_MAP.WHOOSH.category, hold = 0.15 }) => {
    tl.add(() => setFlyObj({ x: from.x, y: from.y, opacity: 1, iconId, size }), time)
    sfxOn(tl, time, sfxCategory, sfxName)
    const o = { v: 0 }
    tl.to(o, {
      v: 1, duration, ease,
      onUpdate: () => setFlyObj({ x: lerp(from.x, to.x, o.v), y: lerp(from.y, to.y, o.v), opacity: 1, iconId, size }),
    }, time)
    tl.add(() => setFlyObj(prev => ({ ...prev, opacity: 0 })), time + duration + hold)
  }

  // ── scramble hash text (deterministic, bukan Math.random) — beberapa
  // frame acak lalu berhenti di hash final (Act 3). ──
  const scrambleHash = (tl, time, { steps = 6, stepDur = 0.09, finalText, len = 8 }) => {
    for (let i = 0; i < steps; i++) {
      tl.add(() => setHashText(seededHash(len, i * 7.7 + time)), time + i * stepDur)
    }
    tl.add(() => setHashText(finalText), time + steps * stepDur)
    return steps * stepDur
  }

  // ═══════════════════════════════════════════════════════════════════════
  // MASTER TIMELINE
  // ═══════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 })
    tlRef.current = tl
    window.__animationTimeline = tl
    // WAJIB — lihat 04-referensi-gsap.md § Export Safety.
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
      tl.add(() => setCursorVisible(v => !v), t + i * 0.35)
      sfxOn(tl, t + i * 0.35, SFX_MAP.TICK.category, SFX_MAP.TICK.name)
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

    // ═══════════════ ACT 1 — ALAMAT BENAR, TAPI SIAPA INI? (hook) ═══════════════
    const act1Start = t
    tl.add(() => {
      setPhaseIdx(0)
      setCaption(PHASES[0].caption)
      setEnvelopeIcon('locked-envelope')
      setFlyObj(prev => ({ ...prev, opacity: 0 }))
    }, act1Start)
    sfxOn(tl, act1Start, SFX_MAP.WHOOSH.category, SFX_MAP.WHOOSH.name)

    popIn(tl, act1Start + 0.1, 'gateAnchor', { duration: 0.5 })
    popIn(tl, act1Start + 0.4, 'officerAnchor', { duration: 0.5 })
    popIn(tl, act1Start + 0.7, 'continuityTag', { duration: 0.4 })

    // amplop bersegel melayang masuk dari luar frame — callback lock.wav
    // ke unlock.wav Act 5 (lihat _docs/AUTH_PLAN.md § SFX Sketch).
    moveIcon(tl, act1Start + 1.1, {
      from: { x: 40, y: 160 }, to: ENVELOPE_POS, duration: 0.7,
      iconId: 'locked-envelope', size: 56, sfxName: SFX_MAP.LOCK.name, sfxCategory: SFX_MAP.LOCK.category, hold: 0,
    })
    tl.add(() => setPop(prev => ({ ...prev, envelopeAnchor: { scale: 1, opacity: 1, x: 0, y: 0 } })), act1Start + 1.8)

    popIn(tl, act1Start + 2.1, 'addressOkBadge', { duration: 0.4, sfxName: SFX_MAP.TICK.name, sfxCategory: SFX_MAP.TICK.category })
    popIn(tl, act1Start + 2.6, 'stopMark', { duration: 0.4, sfxName: SFX_MAP.ALERT_PULSE.name, sfxCategory: SFX_MAP.ALERT_PULSE.category })
    popIn(tl, act1Start + 3.2, 'questionBubble', { duration: 0.45 })
    popIn(tl, act1Start + 5.0, 'act1PayoffCard', { duration: 0.5 })
    t = act1Start + PHASES[0].duration

    // ═══════════════ ACT 2 — BUKU TAMU YANG BERBAHAYA ═══════════════
    const act2Start = t
    tl.add(() => {
      setPhaseIdx(1)
      setCaption(PHASES[1].caption)
      setDeskIcon('guestbook-open')
      setDeskRows([])
    }, act2Start)
    sfxOn(tl, act2Start, SFX_MAP.WHOOSH.category, SFX_MAP.WHOOSH.name)
    popOut(tl, act2Start, 'stopMark', 0.2)
    popOut(tl, act2Start, 'questionBubble', 0.2)
    popOut(tl, act2Start, 'act1PayoffCard', 0.2)
    popOut(tl, act2Start, 'addressOkBadge', 0.2)

    popIn(tl, act2Start + 0.2, 'idCardAnchor', { duration: 0.45 })
    ACT2_ID_CARD_FIELDS.forEach((f, i) => {
      sfxOn(tl, act2Start + 0.6 + i * 0.5, SFX_MAP.TYPING.category, SFX_MAP.TYPING.name)
    })
    popIn(tl, act2Start + 1.7, 'deskAnchor', { duration: 0.45 })

    // penjaga menyalin PERSIS isi kartu ke buku tamu — baris demi baris.
    ACT2_ID_CARD_FIELDS.forEach((f, i) => {
      tl.add(() => setDeskRows(prev => [...prev, f]), act2Start + 2.4 + i * 0.5)
      sfxOn(tl, act2Start + 2.4 + i * 0.5, SFX_MAP.TICK.category, SFX_MAP.TICK.name)
    })

    popIn(tl, act2Start + 3.8, 'intruderAnchor', { duration: 0.4 })
    tl.add(() => {}, act2Start + 4.2)
    sfxOn(tl, act2Start + 4.2, SFX_MAP.CRITICAL.category, SFX_MAP.CRITICAL.name)
    popIn(tl, act2Start + 4.3, 'theftFlash', { duration: 0.35 })

    popIn(tl, act2Start + 5.3, 'insightBadge', { duration: 0.5 })
    popIn(tl, act2Start + 6.8, 'act2PayoffCard', { duration: 0.45 })
    t = act2Start + PHASES[1].duration

    // ═══════════════ ACT 3 — STEMPEL YANG TIDAK BISA DIBALIK ═══════════════
    const act3Start = t
    tl.add(() => { setPhaseIdx(2); setCaption(PHASES[2].caption) }, act3Start)
    sfxOn(tl, act3Start, SFX_MAP.WHOOSH.category, SFX_MAP.WHOOSH.name)
    popOut(tl, act3Start, 'idCardAnchor', 0.2)
    popOut(tl, act3Start, 'intruderAnchor', 0.2)
    popOut(tl, act3Start, 'theftFlash', 0.2)
    popOut(tl, act3Start, 'insightBadge', 0.2)
    popOut(tl, act3Start, 'act2PayoffCard', 0.2)

    popIn(tl, act3Start + 0.2, 'hashMachineAnchor', { duration: 0.5 })
    popIn(tl, act3Start + 0.7, 'hashInBadge', { duration: 0.4 })

    sfxOn(tl, act3Start + 1.1, SFX_MAP.GLITCH.category, SFX_MAP.GLITCH.name)
    popIn(tl, act3Start + 1.1, 'hashOutBadge', { duration: 0.35, sfx: false })
    scrambleHash(tl, act3Start + 1.1, { steps: 6, stepDur: 0.09, finalText: seededHash(8, 42) })

    popIn(tl, act3Start + 2.3, 'reverseFail', { duration: 0.4, sfxName: SFX_MAP.ERROR.name, sfxCategory: SFX_MAP.ERROR.category })

    tl.add(() => setDeskRows([
      { key: ACT2_ID_CARD_FIELDS[0].key, value: ACT2_ID_CARD_FIELDS[0].value },
      { key: `${ACT2_ID_CARD_FIELDS[1].key} (hash)`, value: seededHash(8, 42) },
    ]), act3Start + 3.2)

    popIn(tl, act3Start + 3.8, 'compareStampA', { duration: 0.4 })
    popIn(tl, act3Start + 4.2, 'compareStampB', { duration: 0.4 })
    popIn(tl, act3Start + 4.7, 'compareMatch', { duration: 0.4, sfxName: SFX_MAP.CONFIRM.name, sfxCategory: SFX_MAP.CONFIRM.category })

    popIn(tl, act3Start + 5.6, 'act3PayoffCard', { duration: 0.45 })
    popIn(tl, act3Start + 7.6, 'act3Cliffhanger', { duration: 0.35 })
    t = act3Start + PHASES[2].duration

    // ═══════════════ ACT 4 — KARTU TAMU VS SEGEL AJAIB (2 sub-beat) ═══════════════
    const act4Start = t
    tl.add(() => { setPhaseIdx(3); setCaption(PHASES[3].caption) }, act4Start)
    sfxOn(tl, act4Start, SFX_MAP.WHOOSH.category, SFX_MAP.WHOOSH.name)
    popOut(tl, act4Start, 'hashMachineAnchor', 0.2)
    popOut(tl, act4Start, 'hashInBadge', 0.2)
    popOut(tl, act4Start, 'hashOutBadge', 0.2)
    popOut(tl, act4Start, 'reverseFail', 0.2)
    popOut(tl, act4Start, 'compareStampA', 0.2)
    popOut(tl, act4Start, 'compareStampB', 0.2)
    popOut(tl, act4Start, 'compareMatch', 0.2)
    popOut(tl, act4Start, 'act3PayoffCard', 0.2)
    popOut(tl, act4Start, 'act3Cliffhanger', 0.2)
    popOut(tl, act4Start, 'gateAnchor', 0.2)
    popOut(tl, act4Start, 'officerAnchor', 0.2)

    // ── Beat A: Session (kartu tamu bernomor) ──
    tl.add(() => { setDeskIcon('front-desk'); setDeskRows([]) }, act4Start + 0.2)
    popIn(tl, act4Start + 0.6, 'visitorBadgeAnchor', { duration: 0.4 })
    tl.add(() => setDeskRows([{ key: 'nomor aktif', value: '#A1092' }]), act4Start + 0.9)

    popIn(tl, act4Start + 1.6, 'doorOfficerA', { duration: 0.45 })
    popIn(tl, act4Start + 2.0, 'doorOfficerABubble', { duration: 0.4 })
    sfxOn(tl, act4Start + 2.4, SFX_MAP.BEEP2.category, SFX_MAP.BEEP2.name)
    popIn(tl, act4Start + 2.4, 'checkLineA', { duration: 0.35, sfx: false })
    popIn(tl, act4Start + 2.9, 'checkOkA', { duration: 0.35 })

    popOut(tl, act4Start + 3.4, 'doorOfficerA', 0.3)
    popOut(tl, act4Start + 3.4, 'doorOfficerABubble', 0.3)
    popOut(tl, act4Start + 3.4, 'checkLineA', 0.3)
    popOut(tl, act4Start + 3.4, 'checkOkA', 0.3)

    popIn(tl, act4Start + 3.7, 'doorOfficerB', { duration: 0.45 })
    popIn(tl, act4Start + 4.1, 'doorOfficerBBubble', { duration: 0.4 })
    sfxOn(tl, act4Start + 4.5, SFX_MAP.BEEP2.category, SFX_MAP.BEEP2.name)
    popIn(tl, act4Start + 4.5, 'checkLineB', { duration: 0.35, sfx: false })
    popIn(tl, act4Start + 5.0, 'checkOkB', { duration: 0.35 })
    popIn(tl, act4Start + 5.4, 'sessionCheckNote', { duration: 0.4 })

    // ── Beat B: Token/JWT (segel ajaib) — mulai t+6.0 ──
    const beatB = act4Start + 6.0
    popOut(tl, beatB, 'visitorBadgeAnchor', 0.2)
    popOut(tl, beatB, 'doorOfficerB', 0.2)
    popOut(tl, beatB, 'doorOfficerBBubble', 0.2)
    popOut(tl, beatB, 'checkLineB', 0.2)
    popOut(tl, beatB, 'checkOkB', 0.2)
    popOut(tl, beatB, 'sessionCheckNote', 0.2)

    // amplop bersegel MORPH jadi segel ajaib — icon pengganti, anchor &
    // posisi sama persis (06-icon-generation §6.4), pulsa ulang popIn
    // sebagai penekanan visual transformasi.
    tl.add(() => setEnvelopeIcon('magic-seal-token'), beatB + 0.2)
    popIn(tl, beatB + 0.2, 'envelopeAnchor', { duration: 0.4, sfxName: SFX_MAP.CONNECTOR_SNAP.name, sfxCategory: SFX_MAP.CONNECTOR_SNAP.category })
    popIn(tl, beatB + 0.7, 'tokenPayloadNote', { duration: 0.4 })

    popIn(tl, beatB + 1.4, 'tokenDoorOfficer', { duration: 0.45 })
    popIn(tl, beatB + 1.8, 'tokenCheckOk', { duration: 0.4, sfxName: SFX_MAP.SHIMMER.name, sfxCategory: SFX_MAP.SHIMMER.category })
    popIn(tl, beatB + 2.3, 'tokenIndependenceNote', { duration: 0.4 })

    popIn(tl, beatB + 2.9, 'statelessCallback', { duration: 0.4 })
    popIn(tl, beatB + 3.4, 'tradeoffNote', { duration: 0.35 })
    popIn(tl, beatB + 3.9, 'act4Cliffhanger', { duration: 0.35 })
    t = act4Start + PHASES[3].duration

    // ═══════════════ ACT 5 — BOLEH MASUK, BUKAN BOLEH BUKA SEMUA (payoff) ═══════════════
    const act5Start = t
    tl.add(() => {
      setPhaseIdx(4)
      setCaption(PHASES[4].caption)
      setDualChecked(ACT5_DUAL_STAMP.map(s => s.checked))
      setEnvelopeOpened(false)
    }, act5Start)
    sfxOn(tl, act5Start, SFX_MAP.WHOOSH.category, SFX_MAP.WHOOSH.name)
    popOut(tl, act5Start, 'tokenDoorOfficer', 0.2)
    popOut(tl, act5Start, 'tokenCheckOk', 0.2)
    popOut(tl, act5Start, 'tokenIndependenceNote', 0.2)
    popOut(tl, act5Start, 'statelessCallback', 0.2)
    popOut(tl, act5Start, 'tradeoffNote', 0.2)
    popOut(tl, act5Start, 'act4Cliffhanger', 0.2)
    popOut(tl, act5Start, 'tokenPayloadNote', 0.2)

    popIn(tl, act5Start + 0.2, 'restrictedDoorAnchor', { duration: 0.5 })
    popIn(tl, act5Start + 0.5, 'officerAnchor', { duration: 0.45, sfxName: SFX_MAP.ALERT_PULSE.name, sfxCategory: SFX_MAP.ALERT_PULSE.category })

    popIn(tl, act5Start + 1.1, 'dualStampA', { duration: 0.4 })
    popIn(tl, act5Start + 1.5, 'dualStampB', { duration: 0.4 })
    popIn(tl, act5Start + 2.1, 'twoChecksNote', { duration: 0.4 })

    tl.add(() => setDualChecked([true, true]), act5Start + 3.0)
    sfxOn(tl, act5Start + 3.0, SFX_MAP.DING.category, SFX_MAP.DING.name)

    tl.add(() => setEnvelopeOpened(true), act5Start + 3.5)
    sfxOn(tl, act5Start + 3.5, SFX_MAP.UNLOCK.category, SFX_MAP.UNLOCK.name)

    popIn(tl, act5Start + 4.0, 'act5PayoffCard', { duration: 0.5 })
    popIn(tl, act5Start + 5.4, 'statusBonusNote', { duration: 0.35 })
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

      {/* ── HEADER (typing besar di tengah -> morph jadi header kecil) ── */}
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
        return (
          <g>
            <text x={taglineX} y={taglineY} textAnchor="start" fill={COLORS.MUTED} fontSize={taglineFs} fontFamily="monospace" letterSpacing={2}>
              NETWORKING · <tspan fill={COLORS.TECHNICAL} fontWeight={700}>AUTH</tspan>
            </text>
            <text x={titleX} y={titleY} textAnchor="start" fontSize={titleFs}
              fontFamily="'Arial Black', Impact, sans-serif" fontWeight={900} fill={COLORS.TEXT} filter="url(#glow)">
              {tt}
              {showIntro && tt.length < INTRO_TITLE.length && cursorVisible && (
                <tspan fill={COLORS.TECHNICAL} fontWeight={900}>█</tspan>
              )}
            </text>
            <text x={subX} y={subY} textAnchor="start" fontSize={subFs} fontFamily="sans-serif" fill={COLORS.MUTED}>
              {typed.subtitle}
              {showIntro && tt.length === INTRO_TITLE.length &&
                typed.subtitle.length < INTRO_SUBTITLE.length && cursorVisible && (
                <tspan fill={COLORS.TECHNICAL} fontWeight={900}>█</tspan>
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

          {/* ═══════ ANCHOR — gerbang, penjaga gerbang, amplop bersegel,
              buku-tamu/meja-resepsionis (persisten lintas-Act, icon
              di-swap via state alih-alih pop-in ulang — lihat
              _docs/AUTH_PLAN.md § Persistent Anchor Objects). ═══════ */}
          <g transform={T('gateAnchor', GATE_POS.x, GATE_POS.y)} opacity={O('gateAnchor')}>
            <IconFrame iconId="entrance-gate" size={84} color={COLORS.GATE} glow />
          </g>

          <g transform={T('officerAnchor', OFFICER_POS.x, OFFICER_POS.y)} opacity={O('officerAnchor')}>
            <IconFrame iconId="gatekeeper-officer" size={68} color={COLORS.OFFICER} />
          </g>

          <g transform={T('envelopeAnchor', ENVELOPE_POS.x, ENVELOPE_POS.y)} opacity={O('envelopeAnchor')}>
            {envelopeOpened
              ? <EnvelopeOpenBurst color={COLORS.SUCCESS} />
              : (
                <IconFrame
                  iconId={envelopeIcon} size={56} color={COLORS.SENDER} frameW={100} frameH={100}
                  label={envelopeIcon === 'magic-seal-token' ? ACT4_TOKEN_LABEL : ''}
                  labelColor={COLORS.SUCCESS}
                />
              )}
          </g>

          <g transform={T('deskAnchor', DESK_POS.x, DESK_POS.y)} opacity={O('deskAnchor')}>
            <IconFrame iconId={deskIcon} size={78} frameW={220} frameH={130} color={COLORS.TECHNICAL} />
            {deskRows.map((row, i) => (
              <text key={row.key} x={0} y={40 + i * 18} textAnchor="middle" fontSize={11.5} fontFamily="monospace" fill={COLORS.MUTED}>
                {row.key}: <tspan fill={COLORS.TEXT} fontWeight={700}>{row.value}</tspan>
              </text>
            ))}
          </g>

          {flyObj.opacity > 0 && (
            <g transform={`translate(${flyObj.x}, ${flyObj.y})`} opacity={flyObj.opacity}>
              <image href={getIcon(flyObj.iconId)} x={-flyObj.size / 2} y={-flyObj.size / 2} width={flyObj.size} height={flyObj.size} />
            </g>
          )}

          {/* ═══════ ACT 1 — ALAMAT BENAR, TAPI SIAPA INI? (hook) ═══════ */}
          {phaseIdx === 0 && (
            <g>
              <g transform={T('continuityTag', 620, 20)} opacity={O('continuityTag')}>
                <rect x={-100} y={-16} width={200} height={32} rx={16} fill={COLORS.PANEL} stroke={COLORS.MUTED} strokeWidth={1} />
                <text textAnchor="middle" y={5} fill={COLORS.MUTED} fontSize={11} fontStyle="italic">{ACT1_CONTINUITY_LINE}</text>
              </g>
              <g transform={T('addressOkBadge', 500, 250)} opacity={O('addressOkBadge')}>
                <MiniCheck color={COLORS.SUCCESS} r={16} />
                <text x={26} y={5} fontSize={11} fontWeight={700} fill={COLORS.SUCCESS}>{ACT1_ADDRESS_OK_LABEL}</text>
              </g>
              <g transform={T('stopMark', 430, 175)} opacity={O('stopMark')}>
                <MiniX color={COLORS.ERROR} r={16} />
              </g>
              <g transform={T('questionBubble', 366, 340)} opacity={O('questionBubble')}>
                <SpeechBubble w={440} h={72} color={COLORS.WARNING} />
                <text textAnchor="middle" y={6} fill={COLORS.TEXT} fontSize={15} fontWeight={700}>{ACT1_QUESTION}</text>
              </g>
              <g transform={T('act1PayoffCard', 366, 450)} opacity={O('act1PayoffCard')}>
                <StarburstBadge w={480} h={80} color={COLORS.SUCCESS} />
                <text textAnchor="middle" y={6} fill={COLORS.SUCCESS} fontSize={16} fontWeight={800}>{ACT1_PAYOFF}</text>
              </g>
            </g>
          )}

          {/* ═══════ ACT 2 — BUKU TAMU YANG BERBAHAYA ═══════ */}
          {phaseIdx === 1 && (
            <g>
              <g transform={T('idCardAnchor', ID_CARD_POS.x, ID_CARD_POS.y)} opacity={O('idCardAnchor')}>
                <IconFrame iconId="id-card-blank" size={64} frameW={150} frameH={120} color={COLORS.SENDER} />
                {ACT2_ID_CARD_FIELDS.map((f, i) => (
                  <text key={f.key} x={0} y={44 + i * 16} textAnchor="middle" fontSize={10.5} fontFamily="monospace" fill={COLORS.MUTED}>
                    {f.key}: <tspan fill={COLORS.TEXT} fontWeight={700}>{f.value}</tspan>
                  </text>
                ))}
              </g>

              <text x={DESK_POS.x} y={DESK_POS.y + 90} textAnchor="middle" fontSize={11} fontStyle="italic" fill={COLORS.MUTED} opacity={deskRows.length > 0 ? 1 : 0}>
                {ACT2_GUESTBOOK_ROW_NOTE}
              </text>

              <g transform={T('intruderAnchor', INTRUDER_POS.x, INTRUDER_POS.y)} opacity={O('intruderAnchor')}>
                <IconFrame iconId="intruder-silhouette" size={70} color={COLORS.ERROR} />
              </g>
              <g transform={T('theftFlash', DESK_POS.x + 130, DESK_POS.y - 60)} opacity={O('theftFlash')}>
                <circle r={18} fill={COLORS.PANEL} stroke={COLORS.WARNING} strokeWidth={2.4} />
                <text textAnchor="middle" y={7} fontSize={18} fontWeight={800} fill={COLORS.WARNING}>!</text>
              </g>

              <g transform={T('insightBadge', 366, 700)} opacity={O('insightBadge')}>
                <StarburstBadge w={480} h={78} color={COLORS.WARNING} />
                <text textAnchor="middle" y={6} fill={COLORS.WARNING} fontSize={16} fontWeight={800}>{ACT2_THEFT_INSIGHT}</text>
              </g>
              <g transform={T('act2PayoffCard', 366, 800)} opacity={O('act2PayoffCard')}>
                <SpeechBubble w={460} h={72} color={COLORS.TECHNICAL} />
                <text textAnchor="middle" y={6} fill={COLORS.TEXT} fontSize={14.5} fontWeight={700}>{ACT2_PAYOFF}</text>
              </g>
            </g>
          )}

          {/* ═══════ ACT 3 — STEMPEL YANG TIDAK BISA DIBALIK ═══════ */}
          {phaseIdx === 2 && (
            <g>
              <g transform={T('hashMachineAnchor', HASH_MACHINE_POS.x, HASH_MACHINE_POS.y)} opacity={O('hashMachineAnchor')}>
                <IconFrame iconId="hash-machine" size={80} frameW={150} frameH={140} color={COLORS.TECHNICAL} label={ACT3_HASH_LABEL} labelColor={COLORS.TECHNICAL} glow />
              </g>
              <g transform={T('hashInBadge', HASH_IN_POS.x, HASH_IN_POS.y)} opacity={O('hashInBadge')}>
                <rect x={-70} y={-24} width={140} height={48} rx={12} fill={COLORS.PANEL} stroke={COLORS.SENDER} strokeWidth={1.8} />
                <text textAnchor="middle" y={6} fontSize={13} fontFamily="monospace" fontWeight={700} fill={COLORS.SENDER}>{ACT2_ID_CARD_FIELDS[1].value}</text>
              </g>
              <g transform={T('hashOutBadge', HASH_OUT_POS.x, HASH_OUT_POS.y)} opacity={O('hashOutBadge')}>
                <rect x={-76} y={-24} width={152} height={48} rx={12} fill={COLORS.PANEL} stroke={COLORS.TECHNICAL} strokeWidth={1.8} />
                <text textAnchor="middle" y={6} fontSize={13} fontFamily="monospace" fontWeight={700} fill={COLORS.TECHNICAL}>{hashText}</text>
              </g>

              <g transform={T('reverseFail', 366, 530)} opacity={O('reverseFail')}>
                <path d="M 60 0 L -60 0" stroke={COLORS.ERROR} strokeWidth={3} />
                <line x1={-10} y1={-14} x2={10} y2={6} stroke={COLORS.ERROR} strokeWidth={3.4} strokeLinecap="round" />
                <line x1={10} y1={-14} x2={-10} y2={6} stroke={COLORS.ERROR} strokeWidth={3.4} strokeLinecap="round" />
                <text textAnchor="middle" y={34} fontSize={12.5} fontWeight={700} fill={COLORS.ERROR}>{ACT3_REVERSE_FAIL_NOTE}</text>
              </g>

              <g transform={T('compareStampA', STAMP_A_POS.x, STAMP_A_POS.y)} opacity={O('compareStampA')}>
                <rect x={-66} y={-24} width={132} height={48} rx={10} fill={COLORS.PANEL} stroke={COLORS.TECHNICAL} strokeWidth={1.8} />
                <text textAnchor="middle" y={6} fontSize={12} fontFamily="monospace" fontWeight={700} fill={COLORS.TECHNICAL}>{hashText}</text>
              </g>
              <g transform={T('compareStampB', STAMP_B_POS.x, STAMP_B_POS.y)} opacity={O('compareStampB')}>
                <rect x={-66} y={-24} width={132} height={48} rx={10} fill={COLORS.PANEL} stroke={COLORS.TECHNICAL} strokeWidth={1.8} />
                <text textAnchor="middle" y={6} fontSize={12} fontFamily="monospace" fontWeight={700} fill={COLORS.TECHNICAL}>{hashText}</text>
              </g>
              <g transform={T('compareMatch', 366, 560)} opacity={O('compareMatch')}>
                <MiniCheck color={COLORS.SUCCESS} r={17} />
              </g>
              <text x={366} y={610} textAnchor="middle" fontSize={12} fontStyle="italic" fill={COLORS.MUTED} opacity={O('compareMatch')}>
                {ACT3_COMPARE_NOTE}
              </text>

              <g transform={T('act3PayoffCard', 366, 700)} opacity={O('act3PayoffCard')}>
                <SpeechBubble w={460} h={72} color={COLORS.SUCCESS} />
                <text textAnchor="middle" y={6} fill={COLORS.TEXT} fontSize={14.5} fontWeight={700}>{ACT3_SAFE_NOTE}</text>
              </g>
              <g transform={T('act3Cliffhanger', 366, 790)} opacity={O('act3Cliffhanger')}>
                <text textAnchor="middle" fill={COLORS.WARNING} fontSize={13.5} fontWeight={700} fontStyle="italic">{ACT3_CLIFFHANGER}</text>
              </g>
            </g>
          )}

          {/* ═══════ ACT 4 — KARTU TAMU VS SEGEL AJAIB (2 sub-beat) ═══════
              Beat A (session, x=366 kolom tengah + front-desk anchor di
              DESK_POS) & Beat B (token, envelopeAnchor morph jadi segel).
              Penjaga ruangan SENGAJA karakter baru tiap kemunculan (lihat
              _docs/AUTH_PLAN.md § Persistent Anchor Objects, pengecualian). */}
          {phaseIdx === 3 && (
            <g>
              <g transform={T('visitorBadgeAnchor', VISITOR_BADGE_POS.x, VISITOR_BADGE_POS.y)} opacity={O('visitorBadgeAnchor')}>
                <IconFrame iconId="visitor-badge" size={58} color={COLORS.OFFICER} label={ACT4_SESSION_LABEL} labelColor={COLORS.OFFICER} />
              </g>

              <g transform={T('doorOfficerA', DOOR_OFFICER_POS.x, DOOR_OFFICER_POS.y)} opacity={O('doorOfficerA')}>
                <IconFrame iconId="door-officer-a" size={66} color={COLORS.WARNING} />
              </g>
              <g transform={T('doorOfficerABubble', DOOR_OFFICER_BUBBLE_POS.x, DOOR_OFFICER_BUBBLE_POS.y)} opacity={O('doorOfficerABubble')}>
                <SpeechBubble w={260} h={58} color={COLORS.WARNING} tailX={-90} />
                <text textAnchor="middle" y={5} fill={COLORS.TEXT} fontSize={12.5} fontWeight={700}>{ACT4_SESSION_ISSUED_NOTE}</text>
              </g>
              <g transform={T('checkLineA', DOOR_OFFICER_POS.x + 90, DOOR_OFFICER_POS.y - 60)} opacity={O('checkLineA')}>
                <line x1={0} y1={0} x2={0} y2={-70} stroke={COLORS.OFFICER} strokeWidth={2.4} strokeDasharray="5 5" />
              </g>
              <g transform={T('checkOkA', DOOR_OFFICER_POS.x + 90, DOOR_OFFICER_POS.y - 90)} opacity={O('checkOkA')}>
                <MiniCheck color={COLORS.SUCCESS} r={14} />
              </g>

              <g transform={T('doorOfficerB', DOOR_OFFICER_POS.x, DOOR_OFFICER_POS.y)} opacity={O('doorOfficerB')}>
                <IconFrame iconId="door-officer-b" size={66} color={COLORS.WARNING} />
              </g>
              <g transform={T('doorOfficerBBubble', DOOR_OFFICER_BUBBLE_POS.x, DOOR_OFFICER_BUBBLE_POS.y)} opacity={O('doorOfficerBBubble')}>
                <SpeechBubble w={260} h={58} color={COLORS.WARNING} tailX={-90} />
                <text textAnchor="middle" y={5} fill={COLORS.TEXT} fontSize={12.5} fontWeight={700}>{ACT4_SESSION_ISSUED_NOTE}</text>
              </g>
              <g transform={T('checkLineB', DOOR_OFFICER_POS.x + 90, DOOR_OFFICER_POS.y - 60)} opacity={O('checkLineB')}>
                <line x1={0} y1={0} x2={0} y2={-70} stroke={COLORS.OFFICER} strokeWidth={2.4} strokeDasharray="5 5" />
              </g>
              <g transform={T('checkOkB', DOOR_OFFICER_POS.x + 90, DOOR_OFFICER_POS.y - 90)} opacity={O('checkOkB')}>
                <MiniCheck color={COLORS.SUCCESS} r={14} />
              </g>
              <g transform={T('sessionCheckNote', 366, 700)} opacity={O('sessionCheckNote')}>
                <SpeechBubble w={460} h={68} color={COLORS.WARNING} />
                <text textAnchor="middle" y={6} fill={COLORS.TEXT} fontSize={14} fontWeight={700}>{ACT4_SESSION_CHECK_NOTE}</text>
              </g>

              <g transform={T('tokenPayloadNote', 366, 340)} opacity={O('tokenPayloadNote')}>
                <rect x={-210} y={-28} width={420} height={56} rx={14} fill={COLORS.PANEL} stroke={COLORS.SUCCESS} strokeWidth={1.8} />
                <text textAnchor="middle" y={6} fill={COLORS.SUCCESS} fontSize={13.5} fontWeight={700}>{ACT4_TOKEN_PAYLOAD_NOTE}</text>
              </g>
              <g transform={T('tokenDoorOfficer', DOOR_OFFICER_POS.x, DOOR_OFFICER_POS.y)} opacity={O('tokenDoorOfficer')}>
                <IconFrame iconId="door-officer-a" size={66} color={COLORS.SUCCESS} />
              </g>
              <g transform={T('tokenCheckOk', DOOR_OFFICER_POS.x + 70, DOOR_OFFICER_POS.y - 50)} opacity={O('tokenCheckOk')}>
                <MiniCheck color={COLORS.SUCCESS} r={16} />
              </g>
              <g transform={T('tokenIndependenceNote', 366, 700)} opacity={O('tokenIndependenceNote')}>
                <StarburstBadge w={520} h={90} color={COLORS.SUCCESS} />
                <text textAnchor="middle" y={6} fill={COLORS.SUCCESS} fontSize={15.5} fontWeight={800}>{ACT4_TOKEN_INDEPENDENCE_NOTE}</text>
              </g>
              <g transform={T('statelessCallback', 366, 790)} opacity={O('statelessCallback')}>
                <SpeechBubble w={480} h={68} color={COLORS.TECHNICAL} tailX={20} />
                <text textAnchor="middle" y={6} fill={COLORS.TEXT} fontSize={14} fontWeight={700}>{ACT4_STATELESS_CALLBACK}</text>
              </g>
              <g transform={T('tradeoffNote', 366, 860)} opacity={O('tradeoffNote')}>
                <text textAnchor="middle" fontSize={12} fontStyle="italic" fill={COLORS.MUTED}>{ACT4_TRADEOFF_NOTE}</text>
              </g>
              <g transform={T('act4Cliffhanger', 366, 900)} opacity={O('act4Cliffhanger')}>
                <text textAnchor="middle" fill={COLORS.WARNING} fontSize={13.5} fontWeight={700} fontStyle="italic">{ACT4_CLIFFHANGER}</text>
              </g>
            </g>
          )}

          {/* ═══════ ACT 5 — BOLEH MASUK, BUKAN BOLEH BUKA SEMUA (payoff) ═══════ */}
          {phaseIdx === 4 && (
            <g>
              <g transform={T('restrictedDoorAnchor', RESTRICTED_DOOR_POS.x, RESTRICTED_DOOR_POS.y)} opacity={O('restrictedDoorAnchor')}>
                <IconFrame iconId="restricted-door" size={90} frameW={160} frameH={150} color={COLORS.ERROR} label={ACT5_RESTRICTED_DOOR_LABEL} labelColor={COLORS.ERROR} glow />
              </g>

              <g transform={T('dualStampA', DUAL_STAMP_A_POS.x, DUAL_STAMP_A_POS.y)} opacity={O('dualStampA')}>
                <rect x={-110} y={-30} width={220} height={60} rx={14} fill={COLORS.PANEL} stroke={COLORS.SUCCESS} strokeWidth={1.8} />
                <g transform="translate(-80, 0)">
                  <CheckboxRow label={ACT5_DUAL_STAMP[0].label} checked={dualChecked[0]} />
                </g>
              </g>
              <g transform={T('dualStampB', DUAL_STAMP_B_POS.x, DUAL_STAMP_B_POS.y)} opacity={O('dualStampB')}>
                <rect x={-110} y={-30} width={220} height={60} rx={14} fill={COLORS.PANEL} stroke={dualChecked[1] ? COLORS.SUCCESS : COLORS.MUTED} strokeWidth={1.8} />
                <g transform="translate(-80, 0)">
                  <CheckboxRow label={ACT5_DUAL_STAMP[1].label} checked={dualChecked[1]} />
                </g>
              </g>
              <text x={366} y={400} textAnchor="middle" fontSize={12.5} fontStyle="italic" fill={COLORS.MUTED} opacity={O('twoChecksNote')}>
                {ACT5_TWO_CHECKS_NOTE}
              </text>

              <g transform={T('act5PayoffCard', 366, 490)} opacity={O('act5PayoffCard')}>
                <StarburstBadge w={520} h={92} color={COLORS.SUCCESS} />
                <text textAnchor="middle" y={6} fill={COLORS.SUCCESS} fontSize={16} fontWeight={800}>{ACT5_PAYOFF}</text>
              </g>
              <g transform={T('statusBonusNote', 366, 590)} opacity={O('statusBonusNote')}>
                <text textAnchor="middle" fontSize={12} fontStyle="italic" fill={COLORS.MUTED}>{ACT5_STATUS_BONUS_NOTE}</text>
              </g>
            </g>
          )}
        </g>
      </g>
      )}
    </svg>
  )
}
