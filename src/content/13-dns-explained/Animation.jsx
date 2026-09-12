// src/content/dns-explained/Animation.jsx
// ─────────────────────────────────────────────────────────────
// DNS Explained — kenapa ganti DNS ke 8.8.8.8 kadang benerin internet
// yang lemot/gak connect (hook) → analogi buku telepon internet →
// tanya resolver dulu → perjalanan bertingkat root/TLD/authoritative →
// payoff: jawab hook Act 1. Lihat _docs/DNS_PLAN.md untuk story spine
// lengkap & catatan akurasi teknis.
// ─────────────────────────────────────────────────────────────

import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, SFX_MAP,
  DOMAIN_NAME, EXAMPLE_IP,
  HOOK_LOADING, HOOK_SWITCH, HOOK_CLIFFHANGER,
  ANALOGY_QUESTION, ANALOGY_INSIGHT, RESOLVER_INTRO, RESOLVER_LABEL_DEFAULT,
  ASK_CACHE_MISS, ASK_TENSION, ASK_PAYOFF,
  LOOKUP_HOPS, LOOKUP_TENSION, LOOKUP_FOUND, CACHE_NOTE, RESOLVER_REPLY,
  PAYOFF_CONNECT, PAYOFF_LEFT_LABEL, PAYOFF_LEFT_NOTE, PAYOFF_RIGHT_LABEL, PAYOFF_RIGHT_SUB, PAYOFF_RIGHT_NOTE,
  RESOLVER_LABEL_UPGRADED, SWITCH_RESOLVER_LINE, CLOSING_LINE, CLOSING_BRAND,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'

const lerp = (a, b, t) => a + (b - a) * t

// seeded pseudo-random — deterministik, aman untuk multi-proses export
// (lihat 04-referensi-gsap.md § Determinism, jangan Math.random() untuk timing)
const seededRandom01 = (seed) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

const INTRO_TITLE = 'CARA KERJA DNS'
const INTRO_SUBTITLE = 'Domain jadi IP — buku telepon internet'

// ── posisi anchor persisten (lokal, di dalam <g transform="translate(0,80)">
// yang berada di dalam <g transform="translate(44,220)">) ──
const BROWSER_POS = { x: 366, y: 150 }
const RESOLVER_POS = { x: 366, y: 330 }
const HOP_POS = { x: 366, y: 520 }

// ── shape helper (SVG polos, tanpa PNG icon — lihat _docs/DNS_PLAN.md
// § Icon Plan, keputusan: shape dulu untuk topic ini) ──
const BrowserDevice = ({ color }) => (
  <g>
    <rect x={-90} y={-46} width={180} height={92} rx={14} fill={COLORS.PANEL} stroke={color} strokeWidth={2.5} />
    <rect x={-90} y={-46} width={180} height={22} rx={14} fill={COLORS.BORDER} opacity={0.4} />
    <circle cx={-74} cy={-35} r={3.5} fill={COLORS.DANGER} />
    <circle cx={-62} cy={-35} r={3.5} fill={COLORS.WARNING} />
    <circle cx={-50} cy={-35} r={3.5} fill={color} />
    <rect x={-72} y={-14} width={144} height={44} rx={8} fill="#000000" opacity={0.35} stroke={color} strokeWidth={1} />
  </g>
)

const ServerBox = ({ color }) => (
  <g>
    <rect x={-110} y={-46} width={220} height={92} rx={14} fill={COLORS.PANEL} stroke={color} strokeWidth={2.2} />
    <rect x={-90} y={-28} width={180} height={12} rx={4} fill={color} opacity={0.85} />
    <rect x={-90} y={-8} width={180} height={12} rx={4} fill={color} opacity={0.55} />
    <rect x={-90} y={12} width={180} height={12} rx={4} fill={color} opacity={0.3} />
  </g>
)

const SpeechBubble = ({ w = 420, h = 76, color, tailX = -30 }) => (
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

const FaceHappy = ({ color = COLORS.WARNING }) => (
  <g>
    <circle r={34} fill={color} opacity={0.92} />
    <path d="M -14 -6 Q -8 -14 -2 -6" stroke={COLORS.PANEL} strokeWidth={3} fill="none" strokeLinecap="round" />
    <path d="M 2 -6 Q 8 -14 14 -6" stroke={COLORS.PANEL} strokeWidth={3} fill="none" strokeLinecap="round" />
    <path d="M -14 10 Q 0 24 14 10" stroke={COLORS.PANEL} strokeWidth={3.5} fill="none" strokeLinecap="round" />
  </g>
)

const FaceConfused = ({ color = COLORS.MUTED }) => (
  <g>
    <circle r={28} fill={color} opacity={0.85} />
    <circle cx={-9} cy={-4} r={3.2} fill={COLORS.PANEL} />
    <circle cx={9} cy={-4} r={3.2} fill={COLORS.PANEL} />
    <path d="M -9 13 Q 0 9 9 13" stroke={COLORS.PANEL} strokeWidth={3} fill="none" strokeLinecap="round" />
  </g>
)

export default function DnsExplainedAnimation({
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

  // ── PERSISTENT ANCHORS: browserAnchor, domainLabelAnchor, resolverAnchor.
  // popIn() cuma di entrance pertama, Act berikutnya cuma tween warna/label
  // (lihat _docs/DNS_PLAN.md § Persistent Anchor Objects Lintas-Act). ──
  const [browserColor, setBrowserColor] = useState(COLORS.BROWSER)
  const [domainTyped, setDomainTyped] = useState('')
  const [resolverLabel, setResolverLabel] = useState(RESOLVER_LABEL_DEFAULT)
  const [resolverColor, setResolverColor] = useState(COLORS.RESOLVER)

  // ── ACT 1 ──
  const [loadingSpin, setLoadingSpin] = useState(0)

  // ── ACT 4 — hop server (root/TLD/authoritative), objek sekali-tampil ──
  const [hopIdx, setHopIdx] = useState(-1)
  const [hopAnswered, setHopAnswered] = useState(false)
  const [hopTension, setHopTension] = useState(false)

  // ── kapsul generik: dipakai Act 3 (query), Act 4 (3x hop), Act 5 (jawaban) ──
  const [capsule, setCapsule] = useState({ x: 366, y: 260, opacity: 0, color: COLORS.BROWSER })

  const phase = PHASES[phaseIdx] || PHASES[0]
  const P = (id) => pop[id] || { scale: 0, opacity: 0, x: 0, y: 0 }

  useEffect(() => {
    const shouldEnable = previewSfx && audioUnlocked
    sfxLoader.setEnabled(shouldEnable)
    audioUnlockedRef.current = audioUnlocked
    volumeRef.current = volume
    speedRef.current = speed
  }, [previewSfx, audioUnlocked, volume, speed])

  // ── generic reveal helper (pop-in, kategori SFX eksplisit — lihat
  // 04-referensi-gsap.md § popIn() dengan sfxCategory Eksplisit) ──
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

  const say = (tl, time, text) => tl.add(() => setCaption(text), time)
  const sfxOn = (tl, time, category, name, opts = {}) =>
    tl.add(() => audioUnlockedRef.current && sfxLoader.play(category, name, {
      volume: volumeRef.current, speed: speedRef.current, ...opts,
    }), time)

  // ── ketik domain di Act 1 (seeded random, bukan Math.random — lihat
  // § Determinism di 04-referensi-gsap.md) ──
  const typeDomain = (tl, startTime, fullText) => {
    const minDelay = 45, maxDelay = 95, avgDelay = 62
    let acc = ''
    let time = startTime
    for (let i = 0; i < fullText.length; i++) {
      const char = fullText[i]
      const rand = seededRandom01(i * 12.9898 + 4.4)
      const variance = (rand - 0.5) * (maxDelay - minDelay)
      const delay = Math.max(minDelay, Math.min(maxDelay, avgDelay + variance))
      tl.add(() => {
        acc += char
        setDomainTyped(acc)
        sfxLoader.play(SFX_MAP.TYPING.category, SFX_MAP.TYPING.name, {
          volume: volumeRef.current, speed: speedRef.current, boost: SFX_MAP.TYPING.boost || 1,
        })
      }, time)
      time += delay / 1000
    }
    return time - startTime
  }

  // ── ketik title/subtitle intro (pola sama dengan typeDomain) ──
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
          volume: volumeRef.current, speed: speedRef.current, boost: SFX_MAP.TYPING.boost || 1,
        })
      }, time)
      time += delay / 1000
    }
    return time - startTime
  }

  // ── kapsul bergerak A -> B (generic, dipakai ulang Act 3/4/5 — lihat
  // 04-referensi-gsap.md § Advanced Pattern: Moving Element) ──
  const moveCapsule = (tl, time, { from, to, duration = 0.6, color = COLORS.BROWSER, ease = 'power2.inOut', sfxName = SFX_MAP.WHOOSH.name, sfxCategory = SFX_MAP.WHOOSH.category }) => {
    tl.add(() => setCapsule({ x: from.x, y: from.y, opacity: 1, color }), time)
    sfxOn(tl, time, sfxCategory, sfxName)
    const o = { v: 0 }
    tl.to(o, {
      v: 1, duration, ease,
      onUpdate: () => setCapsule({ x: lerp(from.x, to.x, o.v), y: lerp(from.y, to.y, o.v), opacity: 1, color }),
    }, time)
    tl.add(() => setCapsule(prev => ({ ...prev, opacity: 0 })), time + duration + 0.15)
  }

  // ── ACT 4 helper: 1 hop lookup (root/TLD/authoritative), dipanggil 3x
  // dengan parameter beda — bukan copy-paste 3 blok timing (lihat
  // 03-tutorial-buat-topic-baru.md § 3.5 & _docs/DNS_PLAN.md § Act 4). ──
  const runLookupHop = (tl, startTime, index) => {
    const hop = LOOKUP_HOPS[index]
    const isLast = index === LOOKUP_HOPS.length - 1
    const fromPos = index === 0 ? RESOLVER_POS : HOP_POS

    tl.add(() => { setHopIdx(index); setHopAnswered(false); setHopTension(false) }, startTime)
    moveCapsule(tl, startTime, {
      from: fromPos, to: HOP_POS, duration: 0.6, color: hop.color,
      sfxName: index === 2 ? SFX_MAP.TELEPORT_HOP.name : (index === 0 ? SFX_MAP.WHOOSH.name : SFX_MAP.WHOOSH_ALT.name),
      sfxCategory: index === 2 ? SFX_MAP.TELEPORT_HOP.category : SFX_MAP.WHOOSH.category,
    })
    popIn(tl, startTime + 0.5, `hopBox-${index}`, { duration: 0.45, sfxName: SFX_MAP.MATERIALIZE.name, sfxCategory: SFX_MAP.MATERIALIZE.category })
    say(tl, startTime + 0.6, hop.knows)

    if (!isLast) {
      tl.add(() => setHopAnswered(true), startTime + 1.4)
      say(tl, startTime + 1.5, hop.partial)
      return
    }

    // Hop terakhir (authoritative) — tegangan dulu sebelum reveal IP.
    tl.add(() => setHopTension(true), startTime + 1.0)
    sfxOn(tl, startTime + 1.0, SFX_MAP.LATENCY.category, SFX_MAP.LATENCY.name)
    tl.add(() => { setHopTension(false); setHopAnswered(true) }, startTime + 2.3)
    sfxOn(tl, startTime + 2.3, SFX_MAP.IP_FOUND.category, SFX_MAP.IP_FOUND.name)
    say(tl, startTime + 2.4, LOOKUP_FOUND)

    moveCapsule(tl, startTime + 3.0, {
      from: HOP_POS, to: RESOLVER_POS, duration: 0.7, color: COLORS.AUTH,
      sfxName: SFX_MAP.WHOOSH_ALT.name, sfxCategory: SFX_MAP.WHOOSH_ALT.category,
    })
    popIn(tl, startTime + 4.0, 'cacheIcon', { duration: 0.4, sfxName: SFX_MAP.CACHE_SAVE.name, sfxCategory: SFX_MAP.CACHE_SAVE.category })
    say(tl, startTime + 4.1, CACHE_NOTE)
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

    // ═══════════════ ACT 1 — HOOK: GANTI DNS, TIBA-TIBA LANCAR ═══════════════
    const act1Start = t
    tl.add(() => {
      setPhaseIdx(0)
      setCaption(PHASES[0].caption)
      setDomainTyped('')
      setBrowserColor(COLORS.BROWSER)
      setLoadingSpin(0)
      setCapsule(prev => ({ ...prev, opacity: 0 }))
    }, act1Start)
    popIn(tl, act1Start, 'browserAnchor', { duration: 0.5, sfxName: SFX_MAP.MATERIALIZE.name, sfxCategory: SFX_MAP.MATERIALIZE.category })
    typeDomain(tl, act1Start + 0.3, DOMAIN_NAME)

    const spinObj = { v: 0 }
    tl.to(spinObj, { v: 720, duration: 2.2, ease: 'none', onUpdate: () => setLoadingSpin(spinObj.v) }, act1Start + 1.5)
    popIn(tl, act1Start + 2.2, 'loadingBubble', { duration: 0.4, sfxName: SFX_MAP.POP.name, sfxCategory: SFX_MAP.POP.category })

    tl.add(() => setBrowserColor(COLORS.WARNING), act1Start + 3.7)
    sfxOn(tl, act1Start + 3.7, SFX_MAP.ERROR_BEEP.category, SFX_MAP.ERROR_BEEP.name)
    popIn(tl, act1Start + 4.7, 'switchBadge', { duration: 0.45, sfxName: SFX_MAP.POP_ALT.name, sfxCategory: SFX_MAP.POP_ALT.category })

    tl.add(() => setBrowserColor(COLORS.AUTH), act1Start + 6.2)
    sfxOn(tl, act1Start + 6.2, SFX_MAP.CONNECT_OK.category, SFX_MAP.CONNECT_OK.name)
    popIn(tl, act1Start + 6.5, 'cliffhangerBubble', { duration: 0.45, sfxName: SFX_MAP.CHIME.name, sfxCategory: SFX_MAP.CHIME.category })
    t = act1Start + PHASES[0].duration

    // ═══════════════ ACT 2 — NAMA VS NOMOR: BUKU TELEPON INTERNET ═══════════════
    const act2Start = t
    tl.add(() => {
      setPhaseIdx(1)
      setCaption(PHASES[1].caption)
      setBrowserColor(COLORS.BROWSER) // netral lagi (lihat _docs/DNS_PLAN.md § Anchor)
      setResolverLabel(RESOLVER_LABEL_DEFAULT)
      setResolverColor(COLORS.RESOLVER)
    }, act2Start)
    popIn(tl, act2Start + 0.5, 'questionCard', { duration: 0.4, sfxName: SFX_MAP.POP.name, sfxCategory: SFX_MAP.POP.category })
    popIn(tl, act2Start + 2.0, 'phonebook', { duration: 0.5, sfxName: SFX_MAP.MATERIALIZE.name, sfxCategory: SFX_MAP.MATERIALIZE.category })
    popIn(tl, act2Start + 2.6, 'phonebookRow', { duration: 0.4, sfxName: SFX_MAP.POP_ALT.name, sfxCategory: SFX_MAP.POP_ALT.category })
    popIn(tl, act2Start + 5.0, 'analogyStarburst', { duration: 0.5, sfxName: SFX_MAP.CHIME.name, sfxCategory: SFX_MAP.CHIME.category })
    popIn(tl, act2Start + 7.0, 'resolverAnchor', { duration: 0.5, sfxName: SFX_MAP.MATERIALIZE.name, sfxCategory: SFX_MAP.MATERIALIZE.category })
    say(tl, act2Start + 7.1, RESOLVER_INTRO)
    t = act2Start + PHASES[1].duration

    // ═══════════════ ACT 3 — TANYA RESOLVER, TERNYATA BELUM TAHU ═══════════════
    const act3Start = t
    tl.add(() => {
      setPhaseIdx(2)
      setCaption(PHASES[2].caption)
      setHopIdx(-1)
      setHopAnswered(false)
      setHopTension(false)
      setCapsule(prev => ({ ...prev, opacity: 0 }))
    }, act3Start)
    moveCapsule(tl, act3Start + 0.1, {
      from: BROWSER_POS, to: RESOLVER_POS, duration: 0.6, color: COLORS.BROWSER,
      sfxName: SFX_MAP.WHOOSH_ALT.name, sfxCategory: SFX_MAP.WHOOSH_ALT.category,
    })
    popIn(tl, act3Start + 0.8, 'confusedFace', { duration: 0.4, sfxName: SFX_MAP.SCAN.name, sfxCategory: SFX_MAP.SCAN.category })
    popIn(tl, act3Start + 1.0, 'cacheMissBadge', { duration: 0.4, sfxName: SFX_MAP.POP.name, sfxCategory: SFX_MAP.POP.category })
    sfxOn(tl, act3Start + 2.6, SFX_MAP.LATENCY.category, SFX_MAP.LATENCY.name)
    popIn(tl, act3Start + 4.0, 'globeArrow', { duration: 0.45, sfxName: SFX_MAP.MATERIALIZE.name, sfxCategory: SFX_MAP.MATERIALIZE.category })
    popIn(tl, act3Start + 6.0, 'searchStartCard', { duration: 0.4, sfxName: SFX_MAP.POP_ALT.name, sfxCategory: SFX_MAP.POP_ALT.category })
    t = act3Start + PHASES[2].duration

    // ═══════════════ ACT 4 — PERJALANAN BERTINGKAT: ROOT → TLD → AUTHORITATIVE ═══════════════
    const act4Start = t
    tl.add(() => {
      setPhaseIdx(3)
      setCaption(PHASES[3].caption)
      setHopIdx(-1)
      setHopAnswered(false)
      setHopTension(false)
      setCapsule(prev => ({ ...prev, opacity: 0 }))
    }, act4Start)
    runLookupHop(tl, act4Start + 0.2, 0)
    runLookupHop(tl, act4Start + 2.2, 1)
    runLookupHop(tl, act4Start + 4.2, 2)
    say(tl, act4Start + 8.6, RESOLVER_REPLY)
    t = act4Start + PHASES[3].duration

    // ═══════════════ ACT 5 — PAYOFF: GANTI RESOLVER, KENAPA BISA BENERIN ═══════════════
    const act5Start = t
    tl.add(() => {
      setPhaseIdx(4)
      setCaption(PAYOFF_CONNECT)
      setCapsule(prev => ({ ...prev, opacity: 0 }))
    }, act5Start)
    moveCapsule(tl, act5Start, {
      from: RESOLVER_POS, to: BROWSER_POS, duration: 0.6, color: COLORS.AUTH,
      sfxName: SFX_MAP.WHOOSH.name, sfxCategory: SFX_MAP.WHOOSH.category,
    })
    tl.add(() => setBrowserColor(COLORS.AUTH), act5Start + 0.8)
    sfxOn(tl, act5Start + 0.8, SFX_MAP.CONNECT_OK.category, SFX_MAP.CONNECT_OK.name)
    popIn(tl, act5Start + 1.8, 'splitLeft', { duration: 0.4, sfxName: SFX_MAP.POP_ALT.name, sfxCategory: SFX_MAP.POP_ALT.category })
    popIn(tl, act5Start + 2.0, 'splitRight', { duration: 0.4, sfxName: SFX_MAP.POP_ALT.name, sfxCategory: SFX_MAP.POP_ALT.category })

    tl.add(() => { setResolverLabel(RESOLVER_LABEL_UPGRADED); setResolverColor(COLORS.AUTH) }, act5Start + 3.5)
    sfxOn(tl, act5Start + 3.5, SFX_MAP.CHIME.category, SFX_MAP.CHIME.name)
    say(tl, act5Start + 3.6, SWITCH_RESOLVER_LINE)

    popIn(tl, act5Start + 5.0, 'closingCard', { duration: 0.45, sfxName: SFX_MAP.POP.name, sfxCategory: SFX_MAP.POP.category })
    popIn(tl, act5Start + 6.5, 'happyFace', { duration: 0.5, sfxName: SFX_MAP.CONNECT_OK.name, sfxCategory: SFX_MAP.CONNECT_OK.category })
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
        {Array.from({ length: 21 }).map((_, i) => <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={VH} stroke={COLORS.RESOLVER} strokeWidth={1} />)}
        {Array.from({ length: 34 }).map((_, i) => <line key={`h${i}`} x1={0} y1={i * 40} x2={VW} y2={i * 40} stroke={COLORS.RESOLVER} strokeWidth={1} />)}
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
              NETWORKING · <tspan fill={COLORS.RESOLVER} fontWeight={700}>DNS</tspan>
            </text>
            <text x={titleX} y={titleY} textAnchor="start" fontSize={titleFs}
              fontFamily="'Arial Black', Impact, sans-serif" fontWeight={900} fill={COLORS.TEXT} filter="url(#glow)">
              {tt}
              {showIntro && tt.length < INTRO_TITLE.length && cursorVisible && (
                <tspan fill={COLORS.RESOLVER} fontWeight={900}>█</tspan>
              )}
            </text>
            <text x={subX} y={subY} textAnchor="start" fontSize={subFs} fontFamily="sans-serif" fill={COLORS.MUTED}>
              {typed.subtitle}
              {showIntro && tt.length === INTRO_TITLE.length &&
                typed.subtitle.length < INTRO_SUBTITLE.length && cursorVisible && (
                <tspan fill={COLORS.RESOLVER} fontWeight={900}>█</tspan>
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
          {/* ═══════ ANCHOR — browser, domain label, resolver (persisten Act 1..5) ═══════
              popIn() SEKALI di entrance pertama; Act berikutnya cuma tween
              warna/label (lihat _docs/DNS_PLAN.md § Persistent Anchor Objects). */}
          <g transform={T('browserAnchor', BROWSER_POS.x, BROWSER_POS.y)} opacity={O('browserAnchor')}>
            <BrowserDevice color={browserColor} />
            <text textAnchor="middle" y={70} fill={COLORS.TEXT} fontSize={15} fontFamily="monospace">{domainTyped}</text>
          </g>
          <g transform={T('resolverAnchor', RESOLVER_POS.x, RESOLVER_POS.y)} opacity={O('resolverAnchor')}>
            <ServerBox color={resolverColor} />
            <text textAnchor="middle" y={4} fill={COLORS.TEXT} fontSize={14} fontWeight={700}>{resolverLabel}</text>
          </g>

          {capsule.opacity > 0 && (
            <circle cx={capsule.x} cy={capsule.y} r={10} fill={capsule.color} filter="url(#glow)" />
          )}

          {/* ═══════ ACT 1 — HOOK: GANTI DNS, TIBA-TIBA LANCAR ═══════ */}
          {phaseIdx === 0 && (
            <g>
              {loadingSpin > 0 && loadingSpin < 720 && (
                <g transform={`translate(${BROWSER_POS.x + 130}, ${BROWSER_POS.y}) rotate(${loadingSpin})`}>
                  <circle r={14} fill="none" stroke={COLORS.WARNING} strokeWidth={4} strokeDasharray="18,14" strokeLinecap="round" />
                </g>
              )}
              <g transform={T('loadingBubble', 366, 280)} opacity={O('loadingBubble')}>
                <SpeechBubble w={420} h={70} color={COLORS.WARNING} />
                <text textAnchor="middle" y={6} fill={COLORS.TEXT} fontSize={14.5}>{HOOK_LOADING}</text>
              </g>
              <g transform={T('switchBadge', 366, 400)} opacity={O('switchBadge')}>
                <StarburstBadge w={420} h={72} color={COLORS.RESOLVER} />
                <text textAnchor="middle" y={6} fill={COLORS.RESOLVER} fontSize={15} fontWeight={700}>{HOOK_SWITCH}</text>
              </g>
              <g transform={T('cliffhangerBubble', 366, 520)} opacity={O('cliffhangerBubble')}>
                <SpeechBubble w={460} h={76} color={COLORS.AUTH} tailX={20} />
                <text textAnchor="middle" y={6} fill={COLORS.TEXT} fontSize={15} fontWeight={700}>{HOOK_CLIFFHANGER}</text>
              </g>
            </g>
          )}

          {/* ═══════ ACT 2 — NAMA VS NOMOR: BUKU TELEPON INTERNET ═══════ */}
          {phaseIdx === 1 && (
            <g>
              <g transform={T('questionCard', 366, 260)} opacity={O('questionCard')}>
                <rect x={-330} y={-30} width={660} height={60} rx={14} fill={COLORS.PANEL} stroke={COLORS.BORDER} strokeWidth={1} />
                <text textAnchor="middle" y={6} fill={COLORS.TEXT} fontSize={15}>{ANALOGY_QUESTION}</text>
              </g>

              <g transform={T('phonebook', 366, 440)} opacity={O('phonebook')}>
                <rect x={-300} y={-90} width={600} height={180} rx={16} fill={COLORS.PANEL} stroke={COLORS.RESOLVER} strokeWidth={2} filter="url(#shadow)" />
                <text x={-270} y={-56} fill={COLORS.MUTED} fontSize={13} fontFamily="monospace">NAMA</text>
                <text x={90} y={-56} fill={COLORS.MUTED} fontSize={13} fontFamily="monospace">NOMOR (IP)</text>
                <line x1={-300} y1={-38} x2={300} y2={-38} stroke={COLORS.BORDER} strokeWidth={1} />
                <g opacity={O('phonebookRow')}>
                  <text x={-270} y={0} fill={COLORS.TEXT} fontSize={16} fontFamily="monospace">{DOMAIN_NAME}</text>
                  <text x={0} y={0} fill={COLORS.AUTH} fontSize={16} fontFamily="monospace" fontWeight={700}>→</text>
                  <text x={40} y={0} fill={COLORS.AUTH} fontSize={16} fontFamily="monospace" fontWeight={700}>{EXAMPLE_IP}</text>
                </g>
                <text x={-270} y={60} fill={COLORS.MUTED} fontSize={12} fontFamily="sans-serif">DNS = buku telepon: nama dicari, nomor didapat.</text>
              </g>

              <g transform={T('analogyStarburst', 366, 660)} opacity={O('analogyStarburst')}>
                <StarburstBadge w={460} h={80} color={COLORS.WARNING} />
                <text textAnchor="middle" y={6} fill={COLORS.WARNING} fontSize={17} fontWeight={800}>{ANALOGY_INSIGHT}</text>
              </g>
            </g>
          )}

          {/* ═══════ ACT 3 — TANYA RESOLVER, TERNYATA BELUM TAHU ═══════ */}
          {phaseIdx === 2 && (
            <g>
              <g transform={T('confusedFace', RESOLVER_POS.x + 150, RESOLVER_POS.y)} opacity={O('confusedFace')}>
                <FaceConfused color={COLORS.MUTED} />
              </g>
              <g transform={T('cacheMissBadge', 366, 440)} opacity={O('cacheMissBadge')}>
                <rect x={-220} y={-26} width={440} height={52} rx={14} fill={COLORS.PANEL} stroke={COLORS.WARNING} strokeWidth={1.8} />
                <text textAnchor="middle" y={6} fill={COLORS.WARNING} fontSize={14.5} fontWeight={700}>{ASK_CACHE_MISS}</text>
              </g>
              <g transform={T('globeArrow', 366, 560)} opacity={O('globeArrow')}>
                <line x1={0} y1={30} x2={0} y2={-20} stroke={COLORS.ROOT} strokeWidth={3} strokeLinecap="round" />
                <path d="M -10 -12 L 0 -26 L 10 -12" fill="none" stroke={COLORS.ROOT} strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
                <circle cy={-46} r={18} fill="none" stroke={COLORS.ROOT} strokeWidth={2.5} />
                <line x1={-18} y1={-46} x2={18} y2={-46} stroke={COLORS.ROOT} strokeWidth={1.5} />
                <ellipse cx={0} cy={-46} rx={8} ry={18} fill="none" stroke={COLORS.ROOT} strokeWidth={1.5} />
                <text textAnchor="middle" y={54} fill={COLORS.TEXT} fontSize={14.5} fontWeight={700}>{ASK_TENSION}</text>
              </g>
              <g transform={T('searchStartCard', 366, 700)} opacity={O('searchStartCard')}>
                <SpeechBubble w={480} h={72} color={COLORS.ROOT} />
                <text textAnchor="middle" y={6} fill={COLORS.TEXT} fontSize={15} fontWeight={700}>{ASK_PAYOFF}</text>
              </g>
            </g>
          )}

          {/* ═══════ ACT 4 — PERJALANAN BERTINGKAT: ROOT → TLD → AUTHORITATIVE ═══════ */}
          {phaseIdx === 3 && (
            <g>
              {hopIdx >= 0 && (
                <g transform={T(`hopBox-${hopIdx}`, HOP_POS.x, HOP_POS.y)} opacity={O(`hopBox-${hopIdx}`)}>
                  <ServerBox color={LOOKUP_HOPS[hopIdx].color} />
                  <text textAnchor="middle" y={4} fill={COLORS.TEXT} fontSize={13} fontWeight={700}>{LOOKUP_HOPS[hopIdx].label}</text>
                </g>
              )}
              {hopTension && (
                <g transform={`translate(${HOP_POS.x}, ${HOP_POS.y + 90})`}>
                  <text textAnchor="middle" fill={COLORS.WARNING} fontSize={14} fontWeight={700}>{LOOKUP_TENSION}</text>
                </g>
              )}
              {hopIdx >= 0 && hopAnswered && (
                <g transform={`translate(${HOP_POS.x}, ${HOP_POS.y + 90})`}>
                  {hopIdx === LOOKUP_HOPS.length - 1 ? (
                    <StarburstBadge w={460} h={70} color={COLORS.AUTH} />
                  ) : (
                    <rect x={-230} y={-26} width={460} height={52} rx={14} fill={COLORS.PANEL} stroke={LOOKUP_HOPS[hopIdx].color} strokeWidth={1.8} />
                  )}
                  <text textAnchor="middle" y={6} fill={hopIdx === LOOKUP_HOPS.length - 1 ? COLORS.AUTH : COLORS.TEXT} fontSize={14.5} fontWeight={700}>
                    {LOOKUP_HOPS[hopIdx].partial}
                  </text>
                </g>
              )}
              <g transform={T('cacheIcon', RESOLVER_POS.x + 150, RESOLVER_POS.y)} opacity={O('cacheIcon')}>
                <rect x={-16} y={-16} width={32} height={32} rx={6} fill={COLORS.PANEL} stroke={COLORS.AUTH} strokeWidth={2} />
                <line x1={-8} y1={0} x2={-2} y2={7} stroke={COLORS.AUTH} strokeWidth={2.5} strokeLinecap="round" />
                <line x1={-2} y1={7} x2={9} y2={-7} stroke={COLORS.AUTH} strokeWidth={2.5} strokeLinecap="round" />
              </g>
            </g>
          )}

          {/* ═══════ ACT 5 — PAYOFF: GANTI RESOLVER, KENAPA BISA BENERIN ═══════ */}
          {phaseIdx === 4 && (
            <g>
              <g transform={T('splitLeft', 200, 560)} opacity={O('splitLeft')}>
                <rect x={-150} y={-70} width={300} height={140} rx={16} fill={COLORS.PANEL} stroke={COLORS.DANGER} strokeWidth={2} opacity={0.7} />
                <text textAnchor="middle" y={-24} fill={COLORS.DANGER} fontSize={16} fontWeight={800}>{PAYOFF_LEFT_LABEL}</text>
                <text textAnchor="middle" y={10} fill={COLORS.MUTED} fontSize={13}>{PAYOFF_LEFT_NOTE}</text>
              </g>
              <g transform={T('splitRight', 532, 560)} opacity={O('splitRight')}>
                <rect x={-150} y={-70} width={300} height={140} rx={16} fill={COLORS.PANEL} stroke={COLORS.AUTH} strokeWidth={2.5} filter="url(#glow)" />
                <text textAnchor="middle" y={-30} fill={COLORS.AUTH} fontSize={22} fontWeight={900}>{PAYOFF_RIGHT_LABEL}</text>
                <text textAnchor="middle" y={-8} fill={COLORS.MUTED} fontSize={11.5} fontFamily="monospace">{PAYOFF_RIGHT_SUB}</text>
                <text textAnchor="middle" y={20} fill={COLORS.TEXT} fontSize={13}>{PAYOFF_RIGHT_NOTE}</text>
              </g>

              <g transform={T('closingCard', 366, 700)} opacity={O('closingCard')}>
                <rect x={-320} y={-52} width={640} height={104} rx={16} fill={COLORS.PANEL} stroke={COLORS.WARNING} strokeWidth={1.8} filter="url(#shadow)" />
                <text textAnchor="middle" y={-14} fill={COLORS.WARNING} fontSize={16} fontWeight={800}>{CLOSING_LINE}</text>
                <text textAnchor="middle" y={16} fill={COLORS.TEXT} fontSize={14}>{CLOSING_BRAND}</text>
              </g>

              <g transform={T('happyFace', 366, 820)} opacity={O('happyFace')}>
                <FaceHappy color={COLORS.WARNING} />
              </g>
            </g>
          )}
        </g>
      </g>
      )}
    </svg>
  )
}
