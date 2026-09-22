// ═══════════════════════════════════════════════════════════════════════════
// src/content/async-event-loop/Animation.jsx
// ─────────────────────────────────────────────────────────────────────────
// Async/Await & Event Loop — Intro → Act 1 (hook: bug `undefined`) →
// Act 2 (Call Stack, "satu kasir") → Act 3 (async ke background, "titip
// ke dapur") → Act 4 (Event Loop, aha-moment) → Act 5 (payoff, jawab hook)
// Rencana lengkap: lihat _docs/PLAN-ASYNC-EVENT-LOOP.md
//
// STATUS EKSEKUSI: Intro + Act 1..5 first pass lengkap (timeline + render).
// Belum: preview manual dev server, audit SFX coverage penuh, export MP4
// (lihat checklist _docs/PLAN-ASYNC-EVENT-LOOP.md §10 — item itu butuh
// verifikasi visual langsung, bukan cuma baca kode).
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, SFX_MAP, SFX_METHOD,
  ACT1_CODE_LINES, ACT1_PENDING_LABEL, ACT1_RESULT_BAD, ACT1_CLIFFHANGER,
  ACT2_LABEL, ACT2_FRAMES, ACT2_QUESTION, ACT2_CLIFFHANGER,
  ACT3_KITCHEN_LABEL, ACT3_TASK_LABEL, ACT3_PROGRESS_LABEL, ACT3_QUEUE_LABEL, ACT3_CLIFFHANGER,
  ACT4_LABEL, ACT4_WAITING_LABEL, ACT4_STACK_EMPTY_LABEL, ACT4_CLIFFHANGER,
  ACT5_RUNNING_LABEL, ACT5_BEFORE_CARD, ACT5_AFTER_CARD, ACT5_RESULT_GOOD, ACT5_PAYOFF,
  INTRO_TITLE, INTRO_HEADER, INTRO_SUBTITLE,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'

const lerp = (a, b, t) => a + (b - a) * t

export default function AsyncEventLoopAnimation({
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
  const [showIntro, setShowIntro] = useState(true)
  const [morphP, setMorphP] = useState(0)

  // ── Persistent Anchor Object states (04-referensi-gsap §Persistent Anchor) ──
  const [stackFrames, setStackFrames] = useState([]) // [{id,label,color}]
  const [kitchenActive, setKitchenActive] = useState(false)
  const [kitchenLabel, setKitchenLabel] = useState('')
  const [kitchenProgress, setKitchenProgress] = useState(0) // 0..1
  const [kitchenOpacity, setKitchenOpacity] = useState(0.9)
  const [queueItems, setQueueItems] = useState([]) // [{id,label}]


  // ── anchor: ticket tunggal yang berpindah Call Stack→Dapur→Antrian→
  // Call Stack lagi (§6: orderTicketAnchor, 1 entitas sama sepanjang cerita) ──
  const [ticketPos, setTicketPos] = useState({ x: 0, y: 0 })
  const [ticketLabel, setTicketLabel] = useState('?')
  const [eventLoopDeg, setEventLoopDeg] = useState(0)

  const phase = PHASES[phaseIdx] || PHASES[0]
  const P = (id) => pop[id] || { scale: 0, opacity: 0, x: 0, y: 0 }
  const ACT_ACCENT = [COLORS.MUTED, COLORS.ERROR, COLORS.CALL_STACK, COLORS.KITCHEN, COLORS.EVENT_LOOP, COLORS.SUCCESS]

  useEffect(() => {
    const shouldEnable = previewSfx && audioUnlocked
    sfxLoader.setEnabled(shouldEnable)
    audioUnlockedRef.current = audioUnlocked
    volumeRef.current = volume
    speedRef.current = speed
  }, [previewSfx, audioUnlocked, volume, speed])

  // ── generic reveal helper (pop-in), sfxCategory eksplisit per-call
  // (checklist 08: helper generik jangan hardcode 1 kategori) ──
  const popIn = (tl, time, id, opts = {}) => {
    const { duration = 0.45, ease = 'back.out(1.6)', sfx = true, fromX = 0, fromY = 0,
      sfxName = SFX_MAP.POP.name, sfxCategory = SFX_MAP.POP.category, volumeMult = 1 } = opts
    tl.add(() => setPop(prev => ({ ...prev, [id]: { scale: 0, opacity: 0, x: fromX, y: fromY } })), time)
    const o = { v: 0 }
    tl.to(o, {
      v: 1, duration, ease,
      onStart: () => { if (sfx) sfxLoader[SFX_METHOD[sfxCategory]](sfxName, { volume: volume * volumeMult, speed }) },
      onUpdate: () => setPop(prev => ({
        ...prev,
        [id]: { scale: o.v, opacity: Math.min(1, o.v * 1.4), x: fromX * (1 - o.v), y: fromY * (1 - o.v) },
      })),
    }, time)
  }
  const say = (tl, time, text) => tl.add(() => setCaption(text), time)


  // ═══════════════════════════════════════════════════════════════════════
  // MASTER TIMELINE — Intro + Act 1..5 (state reset di t=0, §6)
  // ═══════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 })
    tlRef.current = tl
    window.__animationTimeline = tl
    window.__flushSync = flushSync

    let t = 0

    // ── reset semua anchor ke clean slate (§6 wajib per-loop) ──
    tl.add(() => {
      setPhaseIdx(0); setCaption(''); setPop({})
      setShowIntro(true); setMorphP(0)
      setStackFrames([])
      setKitchenActive(false); setKitchenLabel(''); setKitchenProgress(0); setKitchenOpacity(0.9)
      setQueueItems([])
      setTicketPos({ x: 0, y: 0 }); setTicketLabel('?')
      setEventLoopDeg(0)
    }, t)

    // ═══════════════════ INTRO — judul besar → morph header ═══════════════════
    popIn(tl, t + 0.05, 'introBlock', { fromY: 16, duration: 0.35, sfxName: SFX_MAP.POP_2.name, sfxCategory: SFX_MAP.POP_2.category })
    tl.add(() => sfxLoader[SFX_METHOD.transitions](SFX_MAP.WHOOSH_LOW.name, { volume, speed }), t + 0.5)
    const mo = { p: 0 }
    tl.to(mo, { p: 1, duration: 0.6, ease: 'power3.inOut', onUpdate: () => setMorphP(mo.p) }, t + 0.5)
    tl.add(() => setShowIntro(false), t + 1.1)
    t += PHASES[0].duration


    // ═══════════════════ ACT 1 — "Kode yang Loncat" (HOOK) ═══════════════════
    tl.add(() => { setPhaseIdx(1); sfxLoader[SFX_METHOD.transitions](SFX_MAP.WHOOSH_LOW.name, { volume, speed }) }, t)

    // beat 1: SETUP — 3 baris kode muncul berurutan, terlihat "normal"
    popIn(tl, t + 0.2, 'codeLine0', { fromY: -12, sfxName: SFX_MAP.POP.name, sfxCategory: SFX_MAP.POP.category })
    popIn(tl, t + 0.5, 'codeLine1', { fromY: -12, sfxName: SFX_MAP.POP.name, sfxCategory: SFX_MAP.POP.category })
    popIn(tl, t + 0.8, 'codeLine2', { fromY: -12, sfxName: SFX_MAP.POP.name, sfxCategory: SFX_MAP.POP.category })
    popIn(tl, t + 1.3, 'pendingBadge', { duration: 0.3, sfx: false })
    say(tl, t + 0.2, 'Kode ditulis dari atas ke bawah.')

    // beat 2: TEGANGAN — baris [2] ter-highlight duluan sebelum baris [1] kelar
    tl.add(() => { setPop(prev => ({ ...prev, line2Pulse: { scale: 1, opacity: 1, x: 0, y: 0 } })) }, t + 3.0)
    tl.add(() => sfxLoader[SFX_METHOD.warnings](SFX_MAP.WARNING_PULSE.name, { volume, speed }), t + 3.0)
    say(tl, t + 3.1, 'Baris kedua jalan lebih dulu.')

    // beat 3: TITIK BALIK (mini) — hasil undefined + muka bingung
    popIn(tl, t + 4.3, 'consoleBad', { fromY: 10, sfxName: SFX_MAP.ERROR.name, sfxCategory: SFX_MAP.ERROR.category })
    popIn(tl, t + 4.6, 'confusedFace', { duration: 0.35, ease: 'back.out(2)', sfx: false })

    // beat 4: PAYOFF Act 1 = cliffhanger, bukan jawaban
    say(tl, t + 5.8, ACT1_CLIFFHANGER)
    t += PHASES[1].duration


    // ═══════════════════ ACT 2 — "Satu Kasir, Satu Antrian" (Call Stack) ═══════════════════
    tl.add(() => { setPhaseIdx(2); sfxLoader[SFX_METHOD.transitions](SFX_MAP.WHOOSH_LOW.name, { volume, speed }) }, t)
    popIn(tl, t + 0.1, 'callStackLabel', { fromY: -10, sfx: false })

    // beat 1: SETUP — fungsi masuk, numpuk LIFO
    tl.add(() => { setStackFrames([{ id: 'f0', label: ACT2_FRAMES[0], color: COLORS.CALL_STACK }]); sfxLoader[SFX_METHOD.impacts](SFX_MAP.STACK_PUSH.name, { volume, speed }) }, t + 0.6)
    tl.add(() => { setStackFrames(p => [...p, { id: 'f1', label: ACT2_FRAMES[1], color: COLORS.PENDING }]); sfxLoader[SFX_METHOD.impacts](SFX_MAP.STACK_PUSH.name, { volume, speed }) }, t + 1.4)
    tl.add(() => { setStackFrames(p => [...p, { id: 'f2', label: ACT2_FRAMES[2], color: COLORS.CALL_STACK }]); sfxLoader[SFX_METHOD.impacts](SFX_MAP.STACK_PUSH.name, { volume, speed }) }, t + 2.2)
    say(tl, t + 0.7, 'Fungsi menumpuk, terakhir masuk duluan keluar.')

    // beat 2: TEGANGAN — apakah kasir harus diam menunggu task lambat?
    popIn(tl, t + 3.4, 'act2Bubble', { fromY: -10, duration: 0.4, ease: 'back.out(2)', sfx: false })
    say(tl, t + 3.5, ACT2_QUESTION)

    // beat 3: TITIK BALIK — task lambat (fetchUser) terbang keluar stack
    tl.add(() => { setStackFrames(p => p.filter(f => f.id !== 'f1')) }, t + 5.0)
    tl.add(() => { setTicketPos({ x: 650, y: 430 }); setTicketLabel('?'); sfxLoader[SFX_METHOD.transitions](SFX_MAP.WHOOSH.name, { volume, speed }) }, t + 5.0)
    popIn(tl, t + 5.0, 'orderTicketAnchor', { sfx: false })
    const ticketFly1 = { x: 650, y: 430 }
    tl.to(ticketFly1, { x: 190, y: 430, duration: 1.0, ease: 'power2.inOut', onUpdate: () => setTicketPos({ x: ticketFly1.x, y: ticketFly1.y }) }, t + 5.0)

    // beat 4: PAYOFF (cliffhanger) — kasir lanjut kerja, stack lanjut pop
    tl.add(() => { setStackFrames(p => p.slice(0, -1)); sfxLoader[SFX_METHOD.ui](SFX_MAP.TICK.name, { volume, speed }) }, t + 6.3)
    tl.add(() => { setStackFrames(p => p.slice(0, -1)); sfxLoader[SFX_METHOD.ui](SFX_MAP.TICK.name, { volume, speed }) }, t + 6.9)
    say(tl, t + 7.1, ACT2_CLIFFHANGER)
    t += PHASES[2].duration


    // ═══════════════════ ACT 3 — "Titip ke Dapur" (Web API / background) ═══════════════════
    tl.add(() => { setPhaseIdx(3); setKitchenActive(true); sfxLoader[SFX_METHOD.transitions](SFX_MAP.WHOOSH_LOW.name, { volume, speed }) }, t)
    popIn(tl, t + 0.1, 'kitchenLabelAnchor', { fromY: -10, sfx: false })

    // beat 1: SETUP — ticket mendarat di dapur, label berubah
    tl.add(() => { setTicketLabel(ACT3_TASK_LABEL); sfxLoader[SFX_METHOD.transitions](SFX_MAP.WHOOSH.name, { volume, speed }) }, t + 0.3)
    popIn(tl, t + 0.5, 'receiptIcon', { duration: 0.3, sfx: false })
    say(tl, t + 0.4, 'Tugas dititip, kasir bebas lanjut kerja lain.')

    // beat 2: TEGANGAN — dapur masak (progress), Call Stack tetap jalan
    const prog = { v: 0 }
    tl.to(prog, { v: 0.92, duration: 3.2, ease: 'power1.inOut', onUpdate: () => setKitchenProgress(prog.v) }, t + 1.0)
    tl.add(() => sfxLoader[SFX_METHOD.warnings](SFX_MAP.LATENCY_TICK.name, { volume: volume * 0.7, speed }), t + 2.4)
    tl.add(() => { setStackFrames([{ id: 'f3', label: 'console.log()', color: COLORS.CALL_STACK }]); sfxLoader[SFX_METHOD.impacts](SFX_MAP.STACK_PUSH.name, { volume, speed }) }, t + 1.3)
    tl.add(() => { setStackFrames([]); sfxLoader[SFX_METHOD.ui](SFX_MAP.TICK.name, { volume, speed }) }, t + 2.0)
    say(tl, t + 1.1, ACT3_PROGRESS_LABEL)

    // beat 3: TITIK BALIK — dapur selesai, ticket masuk Antrian Callback
    tl.add(() => { setKitchenProgress(1); sfxLoader[SFX_METHOD.success](SFX_MAP.DING.name, { volume, speed }) }, t + 4.5)
    popIn(tl, t + 4.7, 'queueLabelAnchor', { fromY: 10, sfx: false })
    tl.add(() => { setTicketLabel('Data user siap'); sfxLoader[SFX_METHOD.transitions](SFX_MAP.SLIDE_IN.name, { volume, speed }) }, t + 5.0)
    const ticketFly2 = { x: 190, y: 430 }
    tl.to(ticketFly2, { x: 410, y: 530, duration: 0.8, ease: 'power2.out', onUpdate: () => setTicketPos({ x: ticketFly2.x, y: ticketFly2.y }) }, t + 5.0)
    tl.add(() => setQueueItems([{ id: 'q0', label: 'Data user siap' }]), t + 5.8)

    // beat 4: PAYOFF (cliffhanger)
    say(tl, t + 6.8, ACT3_CLIFFHANGER)
    t += PHASES[3].duration


    // ═══════════════════ ACT 4 — "Event Loop Berjaga" (aha-moment) ═══════════════════
    tl.add(() => { setPhaseIdx(4); sfxLoader[SFX_METHOD.transitions](SFX_MAP.WHOOSH_LOW.name, { volume, speed }) }, t)
    popIn(tl, t + 0.1, 'eventLoopAnchor', { sfxName: SFX_MAP.POP_2.name, sfxCategory: SFX_MAP.POP_2.category })
    const spin = { v: 0 }
    tl.to(spin, { v: 720, duration: 6.0, ease: 'none', onUpdate: () => setEventLoopDeg(spin.v) }, t + 0.1)

    // beat 1: SETUP — Call Stack masih ada sisa sinkron
    tl.add(() => { setStackFrames([{ id: 'f4', label: 'lastSync()', color: COLORS.CALL_STACK }]); sfxLoader[SFX_METHOD.impacts](SFX_MAP.STACK_PUSH.name, { volume, speed }) }, t + 0.3)
    say(tl, t + 0.4, 'Event Loop terus mengecek Call Stack.')

    // beat 2: TEGANGAN — ticket di antrian menunggu, stack belum kosong
    tl.add(() => sfxLoader[SFX_METHOD.ui](SFX_MAP.TICK.name, { volume: volume * 0.6, speed }), t + 1.6)
    say(tl, t + 1.6, ACT4_WAITING_LABEL)

    // beat 3: TITIK BALIK (AHA) — Call Stack kosong, Event Loop menangkap ticket
    tl.add(() => { setStackFrames([]); sfxLoader[SFX_METHOD.success](SFX_MAP.CONFIRM.name, { volume, speed }) }, t + 3.8)
    popIn(tl, t + 3.8, 'stackEmptyBadge', { duration: 0.35, ease: 'back.out(2)', sfx: false })
    say(tl, t + 3.9, ACT4_STACK_EMPTY_LABEL)
    tl.add(() => { setQueueItems([]); sfxLoader[SFX_METHOD.transitions](SFX_MAP.WHOOSH_LOW.name, { volume, speed }) }, t + 4.6)
    const ticketFly3 = { x: 410, y: 530 }
    tl.to(ticketFly3, { x: 650, y: 460, duration: 0.8, ease: 'power2.in', onUpdate: () => setTicketPos({ x: ticketFly3.x, y: ticketFly3.y }) }, t + 4.6)
    tl.add(() => setStackFrames([{ id: 'fcb', label: 'callback()', color: COLORS.EVENT_LOOP }]), t + 5.4)

    // beat 4: PAYOFF (cliffhanger tipis ke Act 5)
    say(tl, t + 6.0, ACT4_CLIFFHANGER)
    t += PHASES[4].duration


    // ═══════════════════ ACT 5 — "Giliran Tiba" (payoff penuh) ═══════════════════
    tl.add(() => { setPhaseIdx(5); sfxLoader[SFX_METHOD.transitions](SFX_MAP.WHOOSH_LOW.name, { volume, speed }) }, t)
    tl.add(() => setTicketLabel(ACT5_RUNNING_LABEL), t + 0.1)
    say(tl, t + 0.2, 'Callback akhirnya dieksekusi.')

    // beat 1-2: kontras Sebelum/Sesudah
    popIn(tl, t + 1.0, 'beforeCard', { fromX: -10, sfx: false })
    popIn(tl, t + 1.4, 'afterCard', { fromX: 10, sfx: false })

    // beat 3: TITIK BALIK — hasil benar + muka senang
    popIn(tl, t + 3.0, 'consoleGood', { fromY: 10, sfxName: SFX_MAP.SUCCESS.name, sfxCategory: SFX_MAP.SUCCESS.category })
    popIn(tl, t + 3.3, 'happyFace', { duration: 0.35, ease: 'back.out(2)', sfxName: SFX_MAP.POP_2.name, sfxCategory: SFX_MAP.POP_2.category })

    // beat 4: PAYOFF FINAL — jawab hook Act 1
    say(tl, t + 4.6, ACT5_PAYOFF)
    popIn(tl, t + 5.2, 'summaryFlow', { fromY: 10, sfxName: SFX_MAP.CHIME.name, sfxCategory: SFX_MAP.CHIME.category })
    t += PHASES[5].duration

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

  const AnchorG = ({ id, x, y, children }) => {
    const p = P(id)
    return (
      <g transform={`translate(${x + p.x}, ${y + p.y}) scale(${p.scale})`} opacity={p.opacity}>
        {children}
      </g>
    )
  }

  // manual word-wrap (bukan foreignObject — 05-svg-text-guide.md)
  const wrapText = (text, maxChars) => {
    const words = text.split(' ')
    const lines = []
    let cur = ''
    words.forEach(w => {
      const next = cur ? `${cur} ${w}` : w
      if (next.length > maxChars && cur) { lines.push(cur); cur = w } else { cur = next }
    })
    if (cur) lines.push(cur)
    return lines
  }


  const TextCard = ({ x, y, text, w = 380, color = COLORS.BORDER }) => {
    const lines = wrapText(text, Math.floor((w - 40) / 7.2))
    const dy = 17
    const h = Math.max(46, lines.length * dy + 26)
    return (
      <g transform={`translate(${x},${y})`}>
        <rect x={-w / 2} y={0} width={w} height={h} rx={12} fill={COLORS.PANEL} stroke={color} strokeWidth={1.5} />
        <text x={0} y={h / 2 + 5} textAnchor="middle" fill={COLORS.TEXT} fontSize={12.5} fontFamily="sans-serif">
          {lines.map((line, i) => <tspan key={i} x={0} dy={i === 0 ? -((lines.length - 1) * dy) / 2 : dy}>{line}</tspan>)}
        </text>
      </g>
    )
  }

  const Badge = ({ x, y, text, color = COLORS.CALL_STACK, w = 220 }) => {
    const lines = wrapText(text, Math.floor((w - 24) / 6.8))
    const dy = 15
    const h = lines.length * dy + 18
    return (
      <g transform={`translate(${x},${y})`}>
        <rect x={0} y={0} width={w} height={h} rx={h / 2} fill={COLORS.PANEL} stroke={color} strokeWidth={2} />
        <text x={w / 2} y={h / 2 + 4} textAnchor="middle" fontSize={11.5} fontWeight={700} fontFamily="sans-serif" fill={color}>
          {lines.map((line, i) => <tspan key={i} x={w / 2} dy={i === 0 ? -((lines.length - 1) * dy) / 2 : dy}>{line}</tspan>)}
        </text>
      </g>
    )
  }


  // SpeechBubble — pertanyaan retoris, punya ekor (bukan rect polos, 03 §3.6)
  const SpeechBubble = ({ x, y, text, w = 340 }) => {
    const lines = wrapText(text, Math.floor((w - 36) / 7.0))
    const dy = 16
    const h = lines.length * dy + 28
    return (
      <g transform={`translate(${x},${y})`}>
        <rect x={-w / 2} y={0} width={w} height={h} rx={16} fill={COLORS.PANEL} stroke={COLORS.QUEUE} strokeWidth={2} />
        <path d={`M -12 ${h} L 0 ${h + 14} L 14 ${h} Z`} fill={COLORS.PANEL} stroke={COLORS.QUEUE} strokeWidth={2} />
        <text x={0} y={h / 2 + 5} textAnchor="middle" fontSize={12.5} fontWeight={600} fontFamily="sans-serif" fill={COLORS.QUEUE}>
          {lines.map((line, i) => <tspan key={i} x={0} dy={i === 0 ? -((lines.length - 1) * dy) / 2 : dy}>{line}</tspan>)}
        </text>
      </g>
    )
  }

  // FaceReaction — muka bulat, elemen non-kotak wajib per-Act (03 §3.6)
  const FaceReaction = ({ x, y, mood = 'confused', color }) => (
    <g transform={`translate(${x},${y})`}>
      <circle r={22} fill={COLORS.PANEL} stroke={color} strokeWidth={2.5} />
      <circle cx={-8} cy={-4} r={2.6} fill={COLORS.TEXT} />
      <circle cx={8} cy={-4} r={2.6} fill={COLORS.TEXT} />
      {mood === 'happy'
        ? <path d="M -9 7 Q 0 16 9 7" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" />
        : <circle cx={0} cy={9} r={4} fill="none" stroke={color} strokeWidth={2} />}
    </g>
  )


  // CodeLineCard — Act 1, representasi baris kode ringkas (bukan editor asli)
  const CodeLineCard = ({ x, y, text, pulse = false, w = 360 }) => (
    <g transform={`translate(${x},${y})`}>
      <rect x={-w / 2} y={-16} width={w} height={32} rx={8} fill={COLORS.PANEL}
        stroke={pulse ? COLORS.PENDING : COLORS.BORDER} strokeWidth={pulse ? 2.5 : 1.5} />
      <text x={0} y={5} textAnchor="middle" fontSize={12.5} fontFamily="monospace" fill={COLORS.TEXT}>{text}</text>
    </g>
  )

  // StackTower — anchor persisten Call Stack, box bertumpuk ke atas (LIFO)
  const StackTower = ({ x, baseY, frames }) => (
    <g transform={`translate(${x},${baseY})`}>
      {frames.map((f, i) => (
        <g key={f.id} transform={`translate(0, ${-i * 34})`}>
          <rect x={-70} y={-28} width={140} height={26} rx={6} fill={COLORS.PANEL} stroke={f.color} strokeWidth={2} />
          <text x={0} y={-10} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={f.color}>{f.label}</text>
        </g>
      ))}
    </g>
  )

  // KitchenBox — anchor persisten Dapur/Web API
  const KitchenBox = ({ x, y, label, progress }) => (
    <g transform={`translate(${x},${y})`}>
      <rect x={-80} y={-55} width={160} height={110} rx={10} fill={COLORS.PANEL} stroke={COLORS.KITCHEN} strokeWidth={2.5} />
      <text x={0} y={-32} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="sans-serif" fill={COLORS.KITCHEN}>{label}</text>
      <rect x={-60} y={10} width={120} height={10} rx={5} fill={COLORS.BG} stroke={COLORS.BORDER} strokeWidth={1} />
      <rect x={-60} y={10} width={120 * progress} height={10} rx={5} fill={COLORS.KITCHEN} />
    </g>
  )


  // QueueLine — anchor persisten Antrian Callback (garis horizontal bawah)
  const QueueLine = ({ x, y, items }) => (
    <g transform={`translate(${x},${y})`}>
      <line x1={-120} y1={0} x2={120} y2={0} stroke={COLORS.QUEUE} strokeWidth={2} strokeDasharray="5 4" opacity={0.6} />
      {items.map((it, i) => (
        <g key={it.id} transform={`translate(${-100 + i * 90}, 0)`}>
          <rect x={-36} y={-15} width={72} height={30} rx={8} fill={COLORS.PANEL} stroke={COLORS.QUEUE} strokeWidth={2} />
          <text x={0} y={4} textAnchor="middle" fontSize={9} fontFamily="sans-serif" fill={COLORS.QUEUE}>{it.label}</text>
        </g>
      ))}
    </g>
  )

  // EventLoopWheel — lingkaran+panah melingkar (bukan kotak, 03 §3.6)
  const EventLoopWheel = ({ x, y, deg }) => (
    <g transform={`translate(${x},${y})`}>
      <circle r={34} fill={COLORS.PANEL} stroke={COLORS.EVENT_LOOP} strokeWidth={2.5} />
      <g transform={`rotate(${deg})`} stroke={COLORS.EVENT_LOOP} strokeWidth={3} fill="none" strokeLinecap="round">
        <path d="M 0 -22 A 22 22 0 1 1 -15 15" />
        <path d="M -15 15 l -8 -2 M -15 15 l 3 -9" />
      </g>
    </g>
  )

  // TicketChip — objek anchor transient tunggal (orderTicketAnchor)
  const TicketChip = ({ x, y, label }) => (
    <g transform={`translate(${x},${y})`}>
      <rect x={-58} y={-16} width={116} height={32} rx={6} fill={COLORS.PANEL} stroke={COLORS.PENDING} strokeWidth={2} />
      <line x1={-46} y1={-6} x2={46} y2={-6} stroke={COLORS.PENDING} strokeWidth={1.2} opacity={0.6} />
      <text x={0} y={5} textAnchor="middle" fontSize={9.5} fontFamily="sans-serif" fill={COLORS.PENDING}>{label}</text>
    </g>
  )


  return (
    <svg ref={svgRef} viewBox={`0 0 ${VW} ${VH}`}
      style={{ width: '100%', height: '100%', maxHeight: '100vh',
        maxWidth: `calc(100vh * ${VW} / ${VH})`, background: COLORS.BG, userSelect: 'none' }}>

      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b1" />
          <feMerge><feMergeNode in="b1" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="shadow">
          <feDropShadow dx="0" dy="4" stdDeviation="7" floodColor="#000" floodOpacity="0.5" />
        </filter>
      </defs>

      <rect x={0} y={0} width={VW} height={VH} fill={COLORS.BG} />
      <g opacity={0.05}>
        {Array.from({ length: 21 }).map((_, i) => <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={VH} stroke={COLORS.CALL_STACK} strokeWidth={1} />)}
        {Array.from({ length: 17 }).map((_, i) => <line key={`h${i}`} x1={0} y1={i * 40} x2={VW} y2={i * 40} stroke={COLORS.CALL_STACK} strokeWidth={1} />)}
      </g>


      {/* ── HEADER: judul besar center (intro) → morph ke header kecil kiri-atas ── */}
      {(() => {
        const mp = morphP
        const thumbWidth = 380
        const startX = (VW / 2) - (thumbWidth / 2)
        const endX = 40
        const titleX = lerp(startX, endX, mp)
        const titleY = lerp(300, 46, mp)
        const titleFs = lerp(34, 22, mp)
        const subX = lerp(startX, endX, mp)
        const subY = lerp(336, 68, mp)
        const subFs = lerp(15, 12, mp)
        const p = P('introBlock')
        return (
          <g opacity={showIntro ? p.opacity : 1}>
            <text x={titleX} y={titleY} textAnchor="start" fontSize={titleFs}
              fontFamily="'Arial Black', Impact, sans-serif" fontWeight={900} fill={COLORS.QUEUE} filter="url(#glow)">
              {INTRO_TITLE}
            </text>
            <text x={subX} y={subY} textAnchor="start" fontSize={subFs} fontFamily="sans-serif" fill={COLORS.MUTED}>
              {mp > 0.5 ? INTRO_HEADER : INTRO_SUBTITLE}
            </text>
          </g>
        )
      })()}


      {!showIntro && (
      <g>
        {/* ── PHASE BADGE + dot navigator ── */}
        <g transform="translate(40, 90)">
          <rect width={340} height={32} rx={16} fill={COLORS.PANEL} stroke={ACT_ACCENT[phaseIdx]} strokeWidth={1.6} filter="url(#shadow)" />
          <circle cx={18} cy={16} r={5} fill={ACT_ACCENT[phaseIdx]} filter="url(#glow)" />
          <text x={32} y={21} fill={ACT_ACCENT[phaseIdx]} fontSize={10.5} fontFamily="monospace" fontWeight={700}>{phase.label}</text>
          <g transform="translate(364, 16)">
            {PHASES.map((ph, i) => (
              <circle key={ph.id} cx={i * 16} cy={0} r={i === phaseIdx ? 5.5 : 3.5}
                fill={i === phaseIdx ? ACT_ACCENT[phaseIdx] : COLORS.BORDER}
                stroke={i === phaseIdx ? '#fff' : 'none'} strokeWidth={1.2} />
            ))}
          </g>
        </g>

        {/* ── Caption bar bawah ── */}
        {caption && (
          <g transform={`translate(${VW / 2}, ${VH - 34})`}>
            <rect x={-350} y={-19} width={700} height={38} rx={10} fill={COLORS.PANEL} opacity={0.92} />
            <text textAnchor="middle" y={5} fontSize={12.5} fill={COLORS.TEXT} fontFamily="sans-serif">{caption}</text>
          </g>
        )}


        {/* ═══ ANCHOR: Call Stack — persisten Act 2..5 (03 §3.1), di luar
            blok phaseIdx supaya wadahnya tidak pop-in ulang ═══ */}
        <g transform={T('callStackLabel', 650, 505)} opacity={O('callStackLabel')}>
          <text textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="monospace" fill={COLORS.CALL_STACK}>{ACT2_LABEL}</text>
        </g>
        <StackTower x={650} baseY={540} frames={stackFrames} />

        {/* ═══ ANCHOR: Dapur (Web API) — persisten Act 3..5, opacity turun
            saat fokus pindah ke Event Loop/Antrian tapi TETAP di DOM ═══ */}
        {kitchenActive && (
          <g opacity={phaseIdx >= 4 ? 0.4 : kitchenOpacity}>
            <g transform={T('kitchenLabelAnchor', 190, 430)} opacity={O('kitchenLabelAnchor')}>
              <KitchenBox x={0} y={0} label={ACT3_KITCHEN_LABEL} progress={kitchenProgress} />
            </g>
          </g>
        )}

        {/* ═══ ANCHOR: Antrian Callback — persisten Act 3..5 ═══ */}
        {queueItems.length > 0 && (
          <g transform={T('queueLabelAnchor', 410, 530)} opacity={O('queueLabelAnchor')}>
            <text textAnchor="middle" y={-24} fontSize={10.5} fontWeight={700} fontFamily="monospace" fill={COLORS.QUEUE}>{ACT3_QUEUE_LABEL}</text>
            <QueueLine x={0} y={0} items={queueItems} />
          </g>
        )}

        {/* ═══ ANCHOR: Event Loop — persisten Act 4..5 ═══ */}
        <g transform={T('eventLoopAnchor', 410, 460)} opacity={O('eventLoopAnchor')}>
          <EventLoopWheel x={0} y={0} deg={eventLoopDeg} />
          <text textAnchor="middle" y={50} fontSize={9.5} fontWeight={700} fontFamily="monospace" fill={COLORS.EVENT_LOOP}>{ACT4_LABEL}</text>
        </g>

        {/* ═══ ANCHOR: ticket tunggal (orderTicketAnchor) — 1 entitas sama
            sepanjang cerita, posisi ditween lintas Act 2..5 ═══ */}
        <AnchorG id="orderTicketAnchor" x={ticketPos.x} y={ticketPos.y}>
          <TicketChip x={0} y={0} label={ticketLabel} />
        </AnchorG>


        {/* ═══════ ACT 1 only — 3 baris kode, tegangan, undefined, muka bingung ═══════ */}
        {phaseIdx === 1 && (
          <g>
            <g transform={T('codeLine0', 410, 190)} opacity={O('codeLine0')}>
              <CodeLineCard x={0} y={0} text={ACT1_CODE_LINES[0].text} />
            </g>
            <g transform={T('codeLine1', 410, 234)} opacity={O('codeLine1')}>
              <CodeLineCard x={0} y={0} text={ACT1_CODE_LINES[1].text} pulse={O('line2Pulse') > 0} />
            </g>
            <g transform={T('codeLine2', 410, 278)} opacity={O('codeLine2')}>
              <CodeLineCard x={0} y={0} text={ACT1_CODE_LINES[2].text} />
            </g>
            <g transform={T('pendingBadge', 410, 320)} opacity={O('pendingBadge')}>
              <Badge x={-90} y={0} text={ACT1_PENDING_LABEL} color={COLORS.PENDING} w={180} />
            </g>
            <g transform={T('consoleBad', 410, 400)} opacity={O('consoleBad')}>
              <TextCard x={-40} y={0} text={ACT1_RESULT_BAD} color={COLORS.ERROR} w={220} />
            </g>
            <g transform={T('confusedFace', 240, 420)} opacity={O('confusedFace')}>
              <FaceReaction x={0} y={0} mood="confused" color={COLORS.ERROR} />
            </g>
          </g>
        )}


        {/* ═══════ ACT 2 only — speech bubble pertanyaan kasir ═══════ */}
        {phaseIdx === 2 && (
          <g>
            <g transform={T('act2Bubble', 410, 250)} opacity={O('act2Bubble')}>
              <SpeechBubble x={0} y={0} text={ACT2_QUESTION} />
            </g>
          </g>
        )}

        {/* ═══════ ACT 3 only — struk pesanan kecil di dekat dapur ═══════ */}
        {phaseIdx === 3 && (
          <g transform={T('receiptIcon', 190, 470)} opacity={O('receiptIcon')}>
            <rect x={-18} y={-14} width={36} height={28} rx={3} fill={COLORS.PANEL} stroke={COLORS.KITCHEN} strokeWidth={1.5} />
            <line x1={-11} y1={-6} x2={11} y2={-6} stroke={COLORS.KITCHEN} strokeWidth={1.2} opacity={0.7} />
            <line x1={-11} y1={0} x2={11} y2={0} stroke={COLORS.KITCHEN} strokeWidth={1.2} opacity={0.7} />
            <line x1={-11} y1={6} x2={4} y2={6} stroke={COLORS.KITCHEN} strokeWidth={1.2} opacity={0.7} />
          </g>
        )}

        {/* ═══════ ACT 4 only — badge "Stack kosong" ═══════ */}
        {phaseIdx === 4 && (
          <g transform={T('stackEmptyBadge', 500, 500)} opacity={O('stackEmptyBadge')}>
            <Badge x={0} y={0} text={ACT4_STACK_EMPTY_LABEL} color={COLORS.SUCCESS} w={180} />
          </g>
        )}


        {/* ═══════ ACT 5 only — Sebelum/Sesudah, hasil benar, muka senang, payoff ═══════ */}
        {phaseIdx === 5 && (
          <g>
            <g transform={T('beforeCard', 210, 200)} opacity={O('beforeCard')}>
              <TextCard x={0} y={0} text={ACT5_BEFORE_CARD} color={COLORS.ERROR} w={320} />
            </g>
            <g transform={T('afterCard', 610, 200)} opacity={O('afterCard')}>
              <TextCard x={0} y={0} text={ACT5_AFTER_CARD} color={COLORS.SUCCESS} w={320} />
            </g>
            <g transform={T('consoleGood', 400, 300)} opacity={O('consoleGood')}>
              <TextCard x={0} y={0} text={ACT5_RESULT_GOOD} color={COLORS.SUCCESS} w={200} />
            </g>
            <g transform={T('happyFace', 500, 300)} opacity={O('happyFace')}>
              <FaceReaction x={0} y={0} mood="happy" color={COLORS.SUCCESS} />
            </g>
            <g transform={T('summaryFlow', 410, 350)} opacity={O('summaryFlow')}>
              <text textAnchor="middle" fontSize={10.5} fontFamily="monospace" fill={COLORS.MUTED}>
                Call Stack → Dapur → Antrian → Event Loop → Call Stack
              </text>
            </g>
          </g>
        )}
      </g>
      )}
    </svg>
  )
}
