// ═══════════════════════════════════════════════════════════════════════════
// src/content/container-docker/Animation.jsx
// ─────────────────────────────────────────────────────────────────────────
// Docker Container vs VM — laptop lemot jalanin 3 app pakai 3 Virtual
// Machine (hook) → kenalan VM (hardware virtualization) → kenalan Docker
// (OS-level virtualization, shared kernel) → trade-off keamanan → payoff:
// laptop sama, jauh lebih ringan. Lihat _docs/CONTAINER_DOCKER_PLAN.md.
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, SFX_MAP,
  INTRO_CATEGORY,
  APPS, HOOK_QUESTION, HOOK_CLIFFHANGER,
  VM_INSIGHT, VM_CAPTION,
  CONTAINER_QUESTION, CONTAINER_INSIGHT, NAMESPACE_LABEL, CGROUP_LABEL, CONTAINER_PAYOFF,
  SIZE_COMPARE, BOOTTIME_COMPARE, TRADEOFF_QUESTION, TRADEOFF_CAPTION,
  CLOSING_NOTE, CLOSING_LINE, CLOSING_BRAND,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'
import { getIcon } from './icons/loader'

const lerp = (a, b, t) => a + (b - a) * t

// ── deterministic pseudo-random (seeded) — WAJIB dipakai (bukan
// Math.random()) karena timeline ini di-build ulang di beberapa proses
// Chrome terpisah saat export (detectDuration, captureAudio, tiap
// captureSegment worker). Pola identik dengan tailscale/Animation.jsx —
// lihat revisi/PLAN-4-ISU-KONSISTENSI-VS-TAILSCALE.md Phase 1.
const seededRandom01 = (seed) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453
  return x - Math.floor(x)
}

const INTRO_TITLE = 'CONTAINER vs VM'
const INTRO_SUBTITLE = 'Kenapa Docker bukan "VM versi kecil"'

export default function ContainerDockerAnimation({
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

  // ── ANCHOR objects — persisten sepanjang Act 1..5, TIDAK unmount/remount
  // per-Act (lihat "Advanced Pattern: Persistent Anchor Object Lintas-Act",
  // docs/standardizations/04-referensi-gsap.md). Cuma warna/label/posisi
  // yang di-tween/swap saat transisi Act 1 → Act 5.
  const [slotColor, setSlotColor] = useState([COLORS.VM, COLORS.VM, COLORS.VM])
  const [slotLabel, setSlotLabel] = useState(['OS SENDIRI', 'OS SENDIRI', 'OS SENDIRI'])
  const [slotWidth, setSlotWidth] = useState([150, 150, 150])
  const [meterValue, setMeterValue] = useState(15)
  const [meterColor, setMeterColor] = useState(COLORS.MUTED)
  const [faceHappy, setFaceHappy] = useState(false)

  // ── intro (typing → morph) state — pola sama seperti tailscale, lihat
  // revisi/PLAN-4-ISU-KONSISTENSI-VS-TAILSCALE.md Phase 1 Opsi A ──
  const [showIntro, setShowIntro] = useState(true)
  const [morphP, setMorphP] = useState(0)
  const [typed, setTyped] = useState({ title: '', subtitle: '' })
  const [cursorVisible, setCursorVisible] = useState(true)

  const phase = PHASES[phaseIdx] || PHASES[0]
  const P = (id) => pop[id] || { scale: 0, opacity: 0, x: 0, y: 0 }

  useEffect(() => {
    const shouldEnable = previewSfx && audioUnlocked
    sfxLoader.setEnabled(shouldEnable)
    audioUnlockedRef.current = audioUnlocked
    volumeRef.current = volume
    speedRef.current = speed
  }, [previewSfx, audioUnlocked, volume, speed])

  // ── generic reveal helper (pop-in) ──
  const popIn = (tl, time, id, opts = {}) => {
    const { duration = 0.45, ease = 'back.out(1.6)', sfx = true, fromX = 0, fromY = 0, sfxName = SFX_MAP.POP.name } = opts
    tl.add(() => setPop(prev => ({ ...prev, [id]: { scale: 0, opacity: 0, x: fromX, y: fromY } })), time)
    const o = { v: 0 }
    tl.to(o, {
      v: 1, duration, ease,
      onStart: () => { if (sfx) sfxLoader.ui(sfxName, { volume, speed }) },
      onUpdate: () => setPop(prev => ({
        ...prev,
        [id]: { scale: o.v, opacity: Math.min(1, o.v * 1.4), x: fromX * (1 - o.v), y: fromY * (1 - o.v) },
      })),
    }, time)
  }

  const say = (tl, time, text) => tl.add(() => setCaption(text), time)
  const sfxOn = (tl, time, fn) => tl.add(() => audioUnlockedRef.current && fn(), time)

  // ── hacker-typing helper for intro (types one character at a time) —
  // pola identik tailscale/Animation.jsx, lihat
  // revisi/PLAN-4-ISU-KONSISTENSI-VS-TAILSCALE.md Phase 1 Opsi A ──
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
      const pitchSeed = seededRandom01(i * 5.1 + (lineKey === 'title' ? 2.3 : 8.7))
      const pitch = 0.98 + pitchSeed * 0.04

      tl.add(() => {
        acc += char
        setTyped(prev => ({ ...prev, [lineKey]: acc }))
        sfxLoader.sfx(SFX_MAP.TYPING.name, { volume: volumeRef.current * 1.6, speed: speedRef.current * pitch, boost: SFX_MAP.TYPING.boost || 1.0 })
      }, time)
      time += delay / 1000
    }
    return time - startTime
  }

  // ═══════════════════════════════════════════════════════════════════════
  // MASTER TIMELINE
  // ═══════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 })
    tlRef.current = tl
    window.__animationTimeline = tl
    // Export safety: expose flushSync supaya script export bisa memaksa
    // React 18 commit setState hasil seek (tl.totalTime()) secara SINKRON
    // sebelum screenshot frame diambil. Lihat pola tailscale/virtual-memory,
    // docs/standardizations/04-referensi-gsap.md § Export Safety.
    window.__flushSync = flushSync

    let t = 0

    // ═══════════════ INTRO — hacker typing → header morph (full match
    // ke pola tailscale, lihat revisi/PLAN-4-ISU-KONSISTENSI-VS-TAILSCALE.md
    // Phase 1 Opsi A) ═══════════════
    tl.add(() => {
      setShowIntro(true)
      setMorphP(0)
      setTyped({ title: '', subtitle: '' })
      setCursorVisible(true)
    }, t)
    t += 0.3 // jeda kecil sebelum mulai ngetik

    // ── ketik title "CONTAINER vs VM" ──
    t += typeLine(tl, t, 'title', INTRO_TITLE, { minDelay: 40, maxDelay: 100, avgDelay: 60 })
    t += 0.3 // jeda, seolah lagi mikir sebelum lanjut subtitle

    // ── ketik subtitle ──
    t += typeLine(tl, t, 'subtitle', INTRO_SUBTITLE, { minDelay: 35, maxDelay: 85, avgDelay: 55 })

    // ── cursor blink, kasih jeda baca sebelum morph ──
    for (let i = 0; i < 3; i++) {
      tl.add(() => {
        setCursorVisible(v => !v)
        if (audioUnlockedRef.current) sfxLoader.ui(SFX_MAP.TICK.name, { volume: volume * 0.9, speed })
      }, t + i * 0.35)
    }
    t += 1.05
    t += 0.35 // pause final sebelum morph mulai

    // ── MORPH: title+subtitle slide naik & mengecil jadi header persistent ──
    tl.add(() => {
      setCursorVisible(false)
      sfxLoader.transition(SFX_MAP.TELEPORT.name, { volume, speed })
      if (audioUnlockedRef.current) sfxLoader.success(SFX_MAP.CHARGE.name, { volume: volumeRef.current, speed })
    }, t)
    const mo = { p: 0 }
    tl.to(mo, { p: 1, duration: 0.8, ease: 'power3.inOut', onUpdate: () => setMorphP(mo.p) }, t)
    t += 0.8

    tl.add(() => setShowIntro(false), t)
    t += 0.3

    // ═══════════════ ACT 1 — 3 App, 3 Rumah Penuh (HOOK) ═══════════════
    tl.add(() => {
      setPhaseIdx(0)
      sfxLoader.transition(SFX_MAP.WHOOSH_LOW.name, { volume, speed })
    }, t)
    say(tl, t + 0.1, 'Mau jalanin 3 app di 1 laptop.')
    popIn(tl, t + 0.3, 'laptopAnchor', { fromY: 15, sfx: true })

    // 3 app chip di atas
    APPS.forEach((app, i) => {
      popIn(tl, t + 0.6 + i * 0.15, `appChip-${i}`, { duration: 0.3, sfx: false })
    })

    // 3 VM box muncul SATU-SATU, berat/lambat (disk-spin SFX)
    APPS.forEach((app, i) => {
      const bootObj = { v: 0 }
      tl.add(() => setPop(prev => ({ ...prev, [`slot-${i}`]: { scale: 0, opacity: 0, x: 0, y: 0 } })), t + 1.1 + i * 0.9)
      tl.to(bootObj, {
        v: 1, duration: 0.75, ease: 'power1.out',
        onStart: () => sfxLoader.impact(SFX_MAP.DISK_SPIN.name, { volume: volume * 0.9, speed: speed * 0.85 }),
        onUpdate: () => setPop(prev => ({ ...prev, [`slot-${i}`]: { scale: bootObj.v, opacity: bootObj.v, x: 0, y: 0 } })),
      }, t + 1.1 + i * 0.9)
    })

    // meter RAM/CPU naik cepat ke merah
    popIn(tl, t + 1.1, 'meterAnchor', { fromY: -10, sfx: false })
    const meterObj1 = { v: 15 }
    tl.to(meterObj1, {
      v: 92, duration: 2.6, ease: 'power1.in',
      onUpdate: () => { setMeterValue(meterObj1.v); setMeterColor(meterObj1.v > 70 ? COLORS.ISOLATION : COLORS.VM) },
    }, t + 1.3)

    // karakter capek + speech bubble hook
    popIn(tl, t + 4.2, 'faceAnchor', { fromY: 10, sfx: false })
    sfxOn(tl, t + 4.2, () => sfxLoader.warning(SFX_MAP.ALERT_PULSE.name, { volume, speed }))
    popIn(tl, t + 4.5, 'hookBubble', { duration: 0.4, ease: 'back.out(1.8)', sfx: false })
    say(tl, t + 4.6, HOOK_QUESTION)

    popIn(tl, t + 7.0, 'cliffhangerCard', { fromY: 12, sfx: false })
    say(tl, t + 7.1, HOOK_CLIFFHANGER)
    t += PHASES[0].duration

    // ═══════════════ ACT 2 — Apa itu Virtual Machine? ═══════════════
    tl.add(() => {
      setPhaseIdx(1)
      sfxLoader.transition(SFX_MAP.SWOOSH.name, { volume, speed })
    }, t)
    say(tl, t + 0.1, 'Paham dulu apa itu Virtual Machine.')
    popIn(tl, t + 0.3, 'hwBar2', { fromY: 15, sfx: false })
    popIn(tl, t + 0.6, 'hypervisorBox', { fromY: 12, sfx: true, sfxName: SFX_MAP.POP.name })

    // 3 Guest OS boot lambat (progress bar + kernel icon muncul berat)
    Array.from({ length: 3 }).forEach((_, i) => {
      const bootObj = { v: 0 }
      tl.add(() => setPop(prev => ({ ...prev, [`guestOS-${i}`]: { scale: 0, opacity: 0, x: 0, y: 0 } })), t + 1.3 + i * 0.5)
      tl.to(bootObj, {
        v: 1, duration: 0.9, ease: 'power1.inOut',
        onStart: () => sfxLoader.impact(SFX_MAP.DISK_SPIN.name, { volume: volume * 0.8, speed }),
        onUpdate: () => setPop(prev => ({ ...prev, [`guestOS-${i}`]: { scale: bootObj.v, opacity: bootObj.v, x: 0, y: 0 } })),
      }, t + 1.3 + i * 0.5)
    })

    popIn(tl, t + 4.2, 'vmInsightBadge', { duration: 0.4, ease: 'back.out(1.8)', sfx: false })
    sfxOn(tl, t + 4.2, () => sfxLoader.sfx(SFX_MAP.SUCCESS.name, { volume, speed }))
    popIn(tl, t + 6.5, 'vmCaptionCard', { fromY: 12, sfx: false })
    say(tl, t + 6.6, VM_CAPTION)
    t += PHASES[1].duration

    // ═══════════════ ACT 3 — Docker: Bukan VM Mini! ═══════════════
    tl.add(() => {
      setPhaseIdx(2)
      sfxLoader.transition(SFX_MAP.WHOOSH.name, { volume, speed })
    }, t)
    say(tl, t + 0.1, CONTAINER_QUESTION)
    popIn(tl, t + 0.4, 'hwBar3', { fromY: 15, sfx: false })
    popIn(tl, t + 0.7, 'kernelBox', { fromY: 12, sfx: true, sfxName: SFX_MAP.POP.name })
    popIn(tl, t + 1.0, 'dockerEngineBox', { fromY: 10, sfx: true, sfxName: SFX_MAP.POP2.name })

    // panah shared-kernel + container snap-in cepat (kontras vs Act 2)
    Array.from({ length: 3 }).forEach((_, i) => {
      popIn(tl, t + 1.5 + i * 0.15, `kernelArrow-${i}`, { duration: 0.3, sfx: false })
    })
    sfxOn(tl, t + 1.5, () => sfxLoader.impact(SFX_MAP.SWAP.name, { volume, speed }))
    Array.from({ length: 3 }).forEach((_, i) => {
      popIn(tl, t + 2.1 + i * 0.15, `containerBox-${i}`, {
        duration: 0.25, ease: 'back.out(2.2)', sfxName: SFX_MAP.POP2.name,
      })
    })
    popIn(tl, t + 2.8, 'namespaceLabel', { duration: 0.3, sfx: false })
    popIn(tl, t + 3.0, 'cgroupLabel', { duration: 0.3, sfx: false })

    popIn(tl, t + 4.2, 'containerInsightBadge', { duration: 0.4, ease: 'back.out(1.8)', sfx: false })
    sfxOn(tl, t + 4.2, () => sfxLoader.success(SFX_MAP.CONFIRM.name, { volume, speed }))
    popIn(tl, t + 8.0, 'containerPayoffCard', { fromY: 12, sfx: false })
    say(tl, t + 8.1, CONTAINER_PAYOFF)
    t += PHASES[2].duration

    // ═══════════════ ACT 4 — Bukan Cuma "Lebih Kecil" ═══════════════
    tl.add(() => {
      setPhaseIdx(3)
      sfxLoader.transition(SFX_MAP.WHOOSH.name, { volume, speed })
    }, t)
    say(tl, t + 0.1, 'Bandingin ukuran & waktu boot-nya.')
    popIn(tl, t + 0.3, 'vmPanel4', { fromX: -20, sfx: true, sfxName: SFX_MAP.POP.name })
    popIn(tl, t + 0.5, 'containerPanel4', { fromX: 20, sfx: true, sfxName: SFX_MAP.POP2.name })

    const sizeBarObj = { v: 0 }
    tl.to(sizeBarObj, {
      v: 1, duration: 0.8, ease: 'power2.out',
      onStart: () => sfxLoader.ui(SFX_MAP.TICK.name, { volume, speed }),
      onUpdate: () => setPop(prev => ({ ...prev, sizeBar: { scale: sizeBarObj.v, opacity: 1 } })),
    }, t + 1.0)
    const bootBarObj = { v: 0 }
    tl.to(bootBarObj, {
      v: 1, duration: 0.8, ease: 'power2.out',
      onUpdate: () => setPop(prev => ({ ...prev, bootBar: { scale: bootBarObj.v, opacity: 1 } })),
    }, t + 1.6)

    popIn(tl, t + 2.8, 'tradeoffQuestionBadge', { duration: 0.3, sfx: false })
    say(tl, t + 2.9, TRADEOFF_QUESTION)
    // ── jeda tegangan sebelum reveal isolation wall (aturan 03-tutorial) ──
    sfxOn(tl, t + 4.3, () => sfxLoader.warning(SFX_MAP.ALERT_PULSE.name, { volume, speed }))
    popIn(tl, t + 4.5, 'isolationWallVM', { fromY: 10, sfx: false })
    popIn(tl, t + 4.8, 'isolationWallContainer', { fromY: 10, sfx: false })
    sfxOn(tl, t + 4.8, () => sfxLoader.impact(SFX_MAP.UNLOCK.name, { volume, speed }))

    popIn(tl, t + 6.0, 'tradeoffCaptionCard', { fromY: 12, sfx: false })
    say(tl, t + 6.1, TRADEOFF_CAPTION)
    t += PHASES[3].duration

    // ═══════════════ ACT 5 — Payoff: Laptop Sama, Jauh Lebih Lega ═══════════════
    tl.add(() => {
      setPhaseIdx(4)
      sfxLoader.transition(SFX_MAP.WHOOSH.name, { volume, speed })
    }, t)
    say(tl, t + 0.1, 'Ganti 3 VM jadi 3 container di laptop yang sama.')

    // ── ANCHOR TRANSITION: slot box VM → Container, snap-in bareng
    // (gsap.to warna/lebar, BUKAN popIn ulang dari nol) ──
    tl.add(() => {
      sfxLoader.transition(SFX_MAP.SLIDE_IN.name, { volume, speed })
      setSlotColor([COLORS.CONTAINER, COLORS.CONTAINER, COLORS.CONTAINER])
      setSlotLabel(['CONTAINER', 'CONTAINER', 'CONTAINER'])
    }, t + 0.4)
    const widthObj = { v: 150 }
    tl.to(widthObj, {
      v: 70, duration: 0.5, ease: 'power2.inOut',
      onStart: () => sfxLoader.ui(SFX_MAP.POP2.name, { volume, speed }),
      onUpdate: () => setSlotWidth([widthObj.v, widthObj.v, widthObj.v]),
    }, t + 0.4)

    // meter turun smooth ke hijau
    const meterObj2 = { v: 92 }
    tl.to(meterObj2, {
      v: 28, duration: 1.0, ease: 'power2.inOut',
      onStart: () => sfxLoader.success(SFX_MAP.SHIMMER.name, { volume, speed }),
      onUpdate: () => { setMeterValue(meterObj2.v); setMeterColor(COLORS.CONTAINER) },
    }, t + 0.6)

    tl.add(() => setFaceHappy(true), t + 1.7)
    sfxOn(tl, t + 1.7, () => sfxLoader.success(SFX_MAP.VICTORY.name, { volume, speed }))

    popIn(tl, t + 3.0, 'closingNoteCard', { fromY: 10, sfx: false })
    say(tl, t + 3.1, CLOSING_NOTE)

    popIn(tl, t + 5.5, 'closingLineCard', { fromY: 15, sfx: false })
    sfxOn(tl, t + 5.5, () => sfxLoader.success(SFX_MAP.CONFIRM.name, { volume, speed }))
    popIn(tl, t + 7.5, 'closingBrandBadge', { duration: 0.4, ease: 'back.out(2)', sfx: false })
    sfxOn(tl, t + 7.5, () => sfxLoader.success(SFX_MAP.DING.name, { volume, speed }))
    t += PHASES[4].duration

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

  // manual word-wrap (bukan foreignObject — lihat docs/standardizations/05-svg-text-guide.md)
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

  const Badge = ({ x, y, text, color = COLORS.DOCKER, w = 280 }) => {
    const lines = wrapText(text, Math.floor((w - 30) / 7.5))
    const dy = 18
    const h = lines.length * dy + 22
    return (
      <g transform={`translate(${x},${y})`}>
        <rect x={0} y={0} width={w} height={h} rx={h / 2} fill={COLORS.PANEL} stroke={color} strokeWidth={2.5} filter="url(#glow)" />
        <text x={w / 2} y={h / 2 + 5} textAnchor="middle" fontSize={14} fontWeight={700} fontFamily="sans-serif" fill={color}>
          {lines.map((line, i) => <tspan key={i} x={w / 2} dy={i === 0 ? -((lines.length - 1) * dy) / 2 : dy}>{line}</tspan>)}
        </text>
      </g>
    )
  }

  const TextCard = ({ x, y, text, w = 640, color = COLORS.BORDER }) => (
    <g transform={`translate(${x},${y})`}>
      <rect x={-w / 2} y={0} width={w} height={58} rx={14} fill={COLORS.PANEL} stroke={color} strokeWidth={1.5} />
      <text x={0} y={24} textAnchor="middle" fill={COLORS.TEXT} fontSize={13} fontFamily="sans-serif">{text}</text>
    </g>
  )

  const LaptopBody = ({ x, y }) => (
    <g transform={`translate(${x},${y})`}>
      <image href={getIcon('laptop')} x={-120} y={-80} width={240} height={170} />
    </g>
  )

  const SlotBox = ({ x, w, color, label, icon }) => (
    <g transform={`translate(${x},0)`}>
      <rect x={-w / 2} y={-40} width={w} height={80} rx={8} fill={COLORS.BG} stroke={color} strokeWidth={2} />
      {icon && w >= 100 && <image href={getIcon(icon)} x={-w / 2 + 8} y={-36} width={16} height={16} />}
      <circle cx={0} cy={-18} r={6} fill={color} filter="url(#glow)" />
      <text x={0} y={14} textAnchor="middle" fontSize={9} fontWeight={700} fill={color} fontFamily="monospace">{label}</text>
    </g>
  )

  const Meter = ({ x, y, value, color }) => (
    <g transform={`translate(${x},${y})`}>
      <image href={getIcon('chip-icon')} x={-108} y={-9} width={16} height={16} />
      <text x={-88} y={4} fontSize={11} fill={COLORS.MUTED} fontFamily="monospace">RAM/CPU</text>
      <rect x={-20} y={-10} width={130} height={20} rx={10} fill={COLORS.BG} stroke={COLORS.BORDER} strokeWidth={1.5} />
      <rect x={-18} y={-8} width={Math.max(2, (value / 100) * 126)} height={16} rx={8} fill={color} />
    </g>
  )

  const FaceCharacter = ({ x, y, happy }) => (
    <g transform={`translate(${x},${y})`}>
      <circle r={26} fill={COLORS.PANEL} stroke={COLORS.BORDER} strokeWidth={2} />
      <circle cx={-9} cy={-6} r={3} fill={COLORS.TEXT} />
      <circle cx={9} cy={-6} r={3} fill={COLORS.TEXT} />
      {happy
        ? <path d="M -10 8 Q 0 18 10 8" fill="none" stroke={COLORS.CONTAINER} strokeWidth={3} strokeLinecap="round" />
        : <path d="M -10 12 Q 0 4 10 12" fill="none" stroke={COLORS.ISOLATION} strokeWidth={3} strokeLinecap="round" />}
    </g>
  )

  const DiagramBox = ({ x, y, w, h, label, color, filled = true, icon = null }) => (
    <g transform={`translate(${x},${y})`}>
      <rect x={-w / 2} y={0} width={w} height={h} rx={10}
        fill={filled ? color : COLORS.PANEL} fillOpacity={filled ? 0.18 : 1}
        stroke={color} strokeWidth={2} />
      {icon && <image href={getIcon(icon)} x={-w / 2 + 12} y={10} width={28} height={28} />}
      <text x={0} y={h / 2 + 5} textAnchor="middle" fontSize={12} fontWeight={700} fill={color} fontFamily="monospace">{label}</text>
    </g>
  )

  const KernelDot = ({ x, y, color }) => (
    <circle cx={x} cy={y} r={6} fill={color} filter="url(#glow)" />
  )

  const IsolationWall = ({ x, y, thick, color, label }) => {
    const isThick = thick >= 40
    const iconId = isThick ? 'isolation-wall-thick' : 'isolation-wall-thin'
    const iconW = isThick ? 70 : 40
    return (
      <g transform={`translate(${x},${y})`}>
        <image href={getIcon(iconId)} x={-iconW / 2} y={-5} width={iconW} height={100} />
        <text x={0} y={110} textAnchor="middle" fontSize={11} fontWeight={700} fill={color} fontFamily="monospace">{label}</text>
      </g>
    )
  }

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
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.5" />
        </filter>
      </defs>

      <rect x={0} y={0} width={VW} height={VH} fill={COLORS.BG} />
      <g opacity={0.05}>
        {Array.from({ length: 21 }).map((_, i) => <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={VH} stroke={COLORS.DOCKER} strokeWidth={1} />)}
        {Array.from({ length: 34 }).map((_, i) => <line key={`h${i}`} x1={0} y1={i * 40} x2={VW} y2={i * 40} stroke={COLORS.DOCKER} strokeWidth={1} />)}
      </g>

      {/* ── HEADER (hero thumbnail → compact header morph, full match ke
          pola tailscale — lihat revisi/PLAN-4-ISU-KONSISTENSI-VS-TAILSCALE.md
          Phase 1 Opsi A). Render terus (bukan cuma pas showIntro) karena
          setelah morph selesai, header ini jadi persistent Act 1..5. ── */}
      {(() => {
        const mp = morphP
        const thumbWidth = 460
        const startX = (VW / 2) - (thumbWidth / 2)
        const endX = 44
        const taglineX = lerp(startX, endX, mp)
        const taglineY = lerp(550, 50, mp)
        const taglineFs = lerp(16, 13, mp)
        const titleX = lerp(startX, endX, mp)
        const titleY = lerp(640, 100, mp)
        const titleFs = lerp(46, 36, mp)
        const subX = lerp(startX, endX, mp)
        const subY = lerp(716, 130, mp)
        const subFs = lerp(18, 15, mp)

        const titleSplitIdx = 9 // "CONTAINER" (hijau) | " vs VM" (oranye)
        const tt = typed.title
        const cursorColor = tt.length <= titleSplitIdx ? COLORS.CONTAINER : COLORS.KERNEL

        return (
          <g>
            <text x={taglineX} y={taglineY} textAnchor="start"
              fill={COLORS.MUTED} fontSize={taglineFs} fontFamily="monospace" letterSpacing={3}>
              {INTRO_CATEGORY} · <tspan fill={COLORS.CONTAINER} fontWeight={700}>ADIB-DEV.COM</tspan>
            </text>
            <text x={titleX} y={titleY} textAnchor="start" fontSize={titleFs}
              fontFamily="'Arial Black', Impact, sans-serif" fontWeight={900} filter="url(#glow)">
              <tspan fill={COLORS.CONTAINER}>{tt.slice(0, titleSplitIdx)}</tspan>
              <tspan fill={COLORS.KERNEL}>{tt.slice(titleSplitIdx)}</tspan>
              {showIntro && tt.length < INTRO_TITLE.length && cursorVisible && (
                <tspan fill={cursorColor} fontWeight={900}>█</tspan>
              )}
            </text>
            <text x={subX} y={subY} textAnchor="start" fontSize={subFs}
              fontFamily="sans-serif" fill={COLORS.MUTED}>
              {typed.subtitle}
              {showIntro && tt.length === INTRO_TITLE.length &&
                typed.subtitle.length < INTRO_SUBTITLE.length && cursorVisible && (
                <tspan fill={COLORS.CONTAINER} fontWeight={900}>█</tspan>
              )}
            </text>
          </g>
        )
      })()}

      {!showIntro && (
      <g>
        {/* ── PHASE BADGE + dot navigator (1 blok gabungan, full match ke
            pola tailscale — lihat revisi/PLAN-4-ISU-KONSISTENSI-VS-TAILSCALE.md
            Phase 3, digabung dgn Phase 1 karena satu batch) ── */}
        <g transform="translate(44, 155)">
          <rect width={500} height={40} rx={20} fill={COLORS.PANEL} stroke={phase.badgeColor} strokeWidth={1.8} filter="url(#shadow)" />
          <circle cx={22} cy={20} r={6} fill={phase.badgeColor} filter="url(#glow)" />
          <text x={40} y={26} fill={phase.badgeColor} fontSize={12} fontFamily="monospace" fontWeight={700} letterSpacing={0.3}>
            {phase.badge}
          </text>
          <g transform="translate(620, 12)">
            {PHASES.map((ph, i) => (
              <circle key={ph.id} cx={i * 24} cy={8}
                r={i === phaseIdx ? 7 : 4}
                fill={i === phaseIdx ? phase.badgeColor : COLORS.BORDER}
                stroke={i === phaseIdx ? '#fff' : 'none'} strokeWidth={1.5} />
            ))}
          </g>
        </g>

        {/* ── Caption bar (bottom, say()) ── */}
        {caption && (
          <g transform={`translate(${VW / 2}, ${VH - 50})`}>
            <rect x={-360} y={-24} width={720} height={48} rx={12} fill={COLORS.PANEL} opacity={0.92} />
            <text textAnchor="middle" y={6} fontSize={14} fill={COLORS.TEXT} fontFamily="sans-serif">{caption}</text>
          </g>
        )}

        {/* ═══════ ACT 1 & ACT 5 shared ANCHOR (laptop + slots + meter + face) ═══════ */}
        {(phaseIdx === 0 || phaseIdx === 4) && (
          <g transform="translate(0, 90)">
            <g transform={T('laptopAnchor', 410, 220)} opacity={O('laptopAnchor')}>
              <LaptopBody x={0} y={0} />
            </g>
            {APPS.map((app, i) => {
              const cx = -150 + i * 150
              const slotIcon = slotLabel[i] === 'CONTAINER' ? 'container-icon' : 'guest-os-icon'
              return (
                <g key={app.id} transform={T(`slot-${i}`, 410 + cx, 205)} opacity={O(`slot-${i}`)}>
                  <SlotBox x={0} w={slotWidth[i]} color={slotColor[i]} label={slotLabel[i]} icon={slotIcon} />
                </g>
              )
            })}
            {APPS.map((app, i) => (
              <g key={`chip-${app.id}`} transform={T(`appChip-${i}`, 410 - 150 + i * 150, 140)} opacity={O(`appChip-${i}`)}>
                <image href={getIcon(app.icon)} x={-11} y={-42} width={22} height={22} />
                <TextCard x={0} y={-14} text={app.label} w={100} />
              </g>
            ))}
            <g transform={T('meterAnchor', 410, 330)} opacity={O('meterAnchor')}>
              <Meter x={0} y={0} value={meterValue} color={meterColor} />
            </g>
            <g transform={T('faceAnchor', 410, 420)} opacity={O('faceAnchor')}>
              <FaceCharacter x={0} y={0} happy={faceHappy} />
            </g>
          </g>
        )}

        {/* ═══════ ACT 1 only — hook bubble & cliffhanger ═══════ */}
        {phaseIdx === 0 && (
          <g transform="translate(0, 90)">
            <g transform={T('hookBubble', 410, 480)} opacity={O('hookBubble')}>
              <Badge x={-180} y={0} text={HOOK_QUESTION} color={COLORS.ISOLATION} w={360} />
            </g>
            <g transform={T('cliffhangerCard', 410, 560)} opacity={O('cliffhangerCard')}>
              <TextCard x={0} y={0} text={HOOK_CLIFFHANGER} />
            </g>
          </g>
        )}

        {/* ═══════ ACT 2 — Apa itu Virtual Machine? ═══════ */}
        {phaseIdx === 1 && (
          <g transform="translate(0, 90)">
            <g transform={T('hwBar2', 410, 160)} opacity={O('hwBar2')}>
              <DiagramBox x={0} y={-25} w={600} h={50} label="HARDWARE (LAPTOP)" color={COLORS.MUTED} filled={false} icon="hardware-icon" />
            </g>
            <g transform={T('hypervisorBox', 410, 250)} opacity={O('hypervisorBox')}>
              <DiagramBox x={0} y={-30} w={480} h={60} label="HYPERVISOR" color={COLORS.HYPERVISOR} icon="hypervisor-icon" />
            </g>
            {Array.from({ length: 3 }).map((_, i) => {
              const cx = -170 + i * 170
              return (
                <g key={`guestOS-${i}`} transform={T(`guestOS-${i}`, 410 + cx, 360)} opacity={O(`guestOS-${i}`)}>
                  <DiagramBox x={0} y={0} w={150} h={150} label="GUEST OS" color={COLORS.VM} icon="guest-os-icon" />
                  <KernelDot x={0} y={40} color={COLORS.VM} />
                  <text x={0} y={115} textAnchor="middle" fontSize={9} fill={COLORS.MUTED} fontFamily="monospace">kernel sendiri</text>
                </g>
              )
            })}
            <g transform={T('vmInsightBadge', 410, 560)} opacity={O('vmInsightBadge')}>
              <Badge x={-210} y={0} text={VM_INSIGHT} color={COLORS.HYPERVISOR} w={420} />
            </g>
            <g transform={T('vmCaptionCard', 410, 650)} opacity={O('vmCaptionCard')}>
              <TextCard x={0} y={0} text={VM_CAPTION} />
            </g>
          </g>
        )}

        {/* ═══════ ACT 3 — Docker: Bukan VM Mini! ═══════ */}
        {phaseIdx === 2 && (
          <g transform="translate(0, 90)">
            <g transform={T('hwBar3', 410, 160)} opacity={O('hwBar3')}>
              <DiagramBox x={0} y={-25} w={600} h={50} label="HARDWARE (LAPTOP)" color={COLORS.MUTED} filled={false} icon="hardware-icon" />
            </g>
            <g transform={T('kernelBox', 410, 240)} opacity={O('kernelBox')}>
              <DiagramBox x={0} y={-28} w={340} h={56} label="HOST KERNEL (SHARED)" color={COLORS.KERNEL} icon="host-kernel-icon" />
            </g>
            <g transform={T('dockerEngineBox', 410, 300)} opacity={O('dockerEngineBox')}>
              <DiagramBox x={0} y={-22} w={230} h={44} label="DOCKER ENGINE" color={COLORS.DOCKER} icon="docker-engine-icon" />
            </g>
            {Array.from({ length: 3 }).map((_, i) => {
              const cx = -170 + i * 170
              return (
                <g key={`kernelArrow-${i}`} transform={T(`kernelArrow-${i}`, 410 + cx, 330)} opacity={O(`kernelArrow-${i}`)}>
                  <line x1={0} y1={0} x2={0} y2={35} stroke={COLORS.KERNEL} strokeWidth={2} strokeDasharray="4 4" />
                  <polygon points="0,38 -5,30 5,30" fill={COLORS.KERNEL} />
                </g>
              )
            })}
            {Array.from({ length: 3 }).map((_, i) => {
              const cx = -170 + i * 170
              return (
                <g key={`containerBox-${i}`} transform={T(`containerBox-${i}`, 410 + cx, 380)} opacity={O(`containerBox-${i}`)}>
                  <DiagramBox x={0} y={0} w={150} h={120} label="CONTAINER" color={COLORS.CONTAINER} icon="container-icon" />
                </g>
              )
            })}
            <g transform={T('namespaceLabel', 300, 540)} opacity={O('namespaceLabel')}>
              <Badge x={-150} y={0} text={NAMESPACE_LABEL} color={COLORS.CONTAINER} w={300} />
            </g>
            <g transform={T('cgroupLabel', 520, 540)} opacity={O('cgroupLabel')}>
              <Badge x={-150} y={0} text={CGROUP_LABEL} color={COLORS.CONTAINER} w={300} />
            </g>
            <g transform={T('containerInsightBadge', 410, 620)} opacity={O('containerInsightBadge')}>
              <Badge x={-210} y={0} text={CONTAINER_INSIGHT} color={COLORS.CONTAINER} w={420} />
            </g>
            <g transform={T('containerPayoffCard', 410, 700)} opacity={O('containerPayoffCard')}>
              <TextCard x={0} y={0} text={CONTAINER_PAYOFF} />
            </g>
          </g>
        )}

        {/* ═══════ ACT 4 — Bukan Cuma "Lebih Kecil" ═══════ */}
        {phaseIdx === 3 && (
          <g transform="translate(0, 90)">
            <g transform={T('vmPanel4', 210, 200)} opacity={O('vmPanel4')}>
              <DiagramBox x={0} y={-35} w={320} h={70} label="VIRTUAL MACHINE" color={COLORS.VM} icon="hypervisor-icon" />
              <text x={0} y={60} textAnchor="middle" fontSize={11} fill={COLORS.MUTED} fontFamily="monospace">UKURAN: {SIZE_COMPARE.vm}</text>
              <rect x={-140} y={72} width={280} height={14} rx={7} fill={COLORS.VM} fillOpacity={0.9} />
              <text x={0} y={110} textAnchor="middle" fontSize={11} fill={COLORS.MUTED} fontFamily="monospace">BOOT: {BOOTTIME_COMPARE.vm}</text>
              <rect x={-140} y={122} width={280} height={14} rx={7} fill={COLORS.VM} fillOpacity={0.9} />
            </g>
            <g transform={T('containerPanel4', 610, 200)} opacity={O('containerPanel4')}>
              <DiagramBox x={0} y={-35} w={320} h={70} label="CONTAINER (DOCKER)" color={COLORS.CONTAINER} icon="container-icon" />
              <text x={0} y={60} textAnchor="middle" fontSize={11} fill={COLORS.MUTED} fontFamily="monospace">UKURAN: {SIZE_COMPARE.container}</text>
              <rect x={-140} y={72} width={Math.max(6, 280 * P('sizeBar').scale * 0.12)} height={14} rx={7} fill={COLORS.CONTAINER} />
              <text x={0} y={110} textAnchor="middle" fontSize={11} fill={COLORS.MUTED} fontFamily="monospace">BOOT: {BOOTTIME_COMPARE.container}</text>
              <rect x={-140} y={122} width={Math.max(6, 280 * P('bootBar').scale * 0.15)} height={14} rx={7} fill={COLORS.CONTAINER} />
            </g>
            <g transform={T('tradeoffQuestionBadge', 410, 380)} opacity={O('tradeoffQuestionBadge')}>
              <Badge x={-230} y={0} text={TRADEOFF_QUESTION} color={COLORS.ISOLATION} w={460} />
            </g>
            <g transform={T('isolationWallVM', 260, 460)} opacity={O('isolationWallVM')}>
              <IsolationWall x={0} y={0} thick={60} color={COLORS.ISOLATION} label="ISOLASI: KUAT" />
            </g>
            <g transform={T('isolationWallContainer', 560, 460)} opacity={O('isolationWallContainer')}>
              <IsolationWall x={0} y={0} thick={18} color={COLORS.ISOLATION} label="ISOLASI: TIPIS" />
            </g>
            <g transform={T('tradeoffCaptionCard', 410, 660)} opacity={O('tradeoffCaptionCard')}>
              <TextCard x={0} y={0} text={TRADEOFF_CAPTION} />
            </g>
          </g>
        )}

        {/* ═══════ ACT 5 only — closing cards ═══════ */}
        {phaseIdx === 4 && (
          <g transform="translate(0, 90)">
            <g transform={T('closingNoteCard', 410, 500)} opacity={O('closingNoteCard')}>
              <TextCard x={0} y={0} text={CLOSING_NOTE} />
            </g>
            <g transform={T('closingLineCard', 410, 580)} opacity={O('closingLineCard')}>
              <TextCard x={0} y={0} text={CLOSING_LINE} color={COLORS.DOCKER} />
            </g>
            <g transform={T('closingBrandBadge', 410, 660)} opacity={O('closingBrandBadge')}>
              <Badge x={-160} y={0} text={CLOSING_BRAND} color={COLORS.DOCKER} w={320} />
            </g>
          </g>
        )}
      </g>
      )}
    </svg>
  )
}

