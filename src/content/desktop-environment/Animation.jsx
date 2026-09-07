import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import { VW, VH, HOOK, PHASES, CLOSING, DE_DATA } from './data'
import { getIcon } from './icons/loader'

// slot app dock/taskbar generik (dipakai ulang di GNOME/KDE/XFCE, warna beda via badge JSX bukan di-bake ke PNG)
const DOCK_APP_ICONS = ['app-browser', 'app-terminal', 'app-files', 'app-settings']

const lerp = (a, b, t) => a + (b - a) * t
const easeOutQuad = (x) => 1 - (1 - x) * (1 - x)

// ── HERO REVEAL ANIMATIONS (§4 - Squash & Stretch + Iris Reveal) ──
// Untuk icon logo saat Act dimulai: gepeng → overshoot → settle,
// dikombinasi dengan iris/circle-reveal dari <clipPath>
function getHeroRevealScale(elapsed, startTime, duration = 0.6) {
  const age = Math.max(0, elapsed - startTime)
  if (age >= duration) return { scaleX: 1, scaleY: 1, irisMask: 1 }
  
  const t = age / duration
  const easeOutBack = (x) => 1 + 2.70158 * (x - 1) ** 3 + 1.70158 * (x - 1) ** 2
  
  // Tahap 1 (0-0.35): Gepeng + iris membuka
  if (t <= 0.35) {
    const phase1 = t / 0.35
    const compressY = 0.6 + phase1 * 0.4
    const stretchX = 1.3 - phase1 * 0.2
    const iris = phase1
    return { scaleX: stretchX, scaleY: compressY, irisMask: iris }
  }
  
  // Tahap 2 (0.35-0.65): Overshoot Y
  const phase2 = (t - 0.35) / 0.3
  const scaleY = 1 + phase2 * 0.15 - (phase2 * phase2) * 0.15
  const scaleX = 1 - phase2 * 0.1
  
  return { scaleX: Math.max(0.9, scaleX), scaleY: Math.min(1.15, scaleY), irisMask: 1 }
}

// ── AMBIENT MOTION: Universal idle wiggle ──
// Untuk icon/badge kecil yang "diam": rotasi tipis berbasis sin(elapsed)
function getIdleWiggle(elapsed, seed = 0) {
  return Math.sin(elapsed * 1.4 + seed) * 3 // ±3 derajat
}

// ── HEAT SHIMMER: wavy speed-lines di belakang CPU fan ──
// Simulasi heat distortion effect — 2-3 garis wavy yg bergerak cepat
// Cheaper dari feTurbulence, tetap terlihat "panas" dan dynamic
function HeatShimmer({ intensity = 1, elapsed = 0, color = '#38BDF8' }) {
  const waveAmplitude = 4 * intensity // ±4px waviness
  const waveFreq = 2.2 // oscillation speed
  const lineCount = 3
  const lineSpacing = 8
  
  return (
    <g opacity={0.4 * intensity}>
      {Array.from({ length: lineCount }).map((_, lineIdx) => {
        const yBase = -24 + lineIdx * lineSpacing
        const phaseShift = lineIdx * 0.3
        
        // Garis wavy: horizontal base dengan sin wave
        const points = Array.from({ length: 16 }).map((_, i) => {
          const x = (i / 15) * 60 - (elapsed * 140 * intensity) % 60
          const waveOffset = Math.sin((i * 0.4 + elapsed * waveFreq + phaseShift)) * waveAmplitude
          const y = yBase + waveOffset
          return `${x},${y}`
        }).join(' ')
        
        return (
          <polyline
            key={lineIdx}
            points={points}
            fill="none"
            stroke={color}
            strokeWidth={1.2}
            strokeLinecap="round"
            opacity={0.5 - lineIdx * 0.1}
          />
        )
      })}
    </g>
  )
}

// ── TRANSISI ANTAR-ACT: Arc motion + anticipation ──
function getActTransitionX(progress, dir = 1) {
  // progress: 0→1 selama transisi
  // Anticipation: tarik dikit dulu (12px), baru slide penuh
  if (progress < 0.15) {
    const ant = progress / 0.15
    return dir * 12 * (1 - ant) * -1 // anticipation "tarik balik"
  }
  const slideProgress = (progress - 0.15) / 0.85
  const eased = slideProgress // bisa dipake slideProgress * slideProgress untuk percepatan
  return dir * (12 - 232 * eased) // dari +12 ke -220
}

// Race closing (Tahap 3, §5.4): RAM makin kecil = makin cepat sampai finish.
// Fungsi murni (bukan state) supaya konsisten dipakai di penjadwalan SFX
// (useEffect) MAUPUN render (posisi avatar) — satu sumber kebenaran waktu finish.
const RACE_START = 0.7 // detik masuk closing sebelum race mulai (title settle dulu)
const raceDurationFor = (ramValue) => lerp(1.0, 2.8, Math.max(0, Math.min(100, ramValue)) / 100)

// ── Karakter simpel: lingkaran + mata + mulut sesuai reaksi ──
// elapsed: untuk idle sway motion (passed dari parent)
function Face({ x, y, r = 30, reaction = 'neutral', color = '#FBBF24', opacity = 1, elapsed = 0 }) {
  const eyeY = -r * 0.15
  const eyeR = reaction === 'mindblown' ? r * 0.2 : r * 0.13
  
  // Idle sway: rotasi tipis (±2°) + scale breathing dikit
  const sway = Math.sin(elapsed * 0.5) * 2 // ±2 derajat, slow oscillation
  const breatheScale = 1 + Math.sin(elapsed * 0.6) * 0.02 // ±2% scale
  const blinkCycle = (elapsed * 0.3) % 4 // blink setiap ~13 detik
  const eyeScaleY = blinkCycle < 0.15 ? 0.1 : 1 // mata nutup sebentar
  
  let mouth
  if (reaction === 'worried') {
    mouth = <path d={`M ${-r * 0.33} ${r * 0.5} Q 0 ${r * 0.22} ${r * 0.33} ${r * 0.5}`} stroke="#0F172A" strokeWidth={3} fill="none" strokeLinecap="round" />
  } else if (reaction === 'curious') {
    mouth = <circle cx={0} cy={r * 0.45} r={r * 0.1} fill="#0F172A" />
  } else if (reaction === 'relieved') {
    mouth = <path d={`M ${-r * 0.33} ${r * 0.3} Q 0 ${r * 0.6} ${r * 0.33} ${r * 0.3}`} stroke="#0F172A" strokeWidth={3} fill="none" strokeLinecap="round" />
  } else if (reaction === 'mindblown') {
    mouth = <ellipse cx={0} cy={r * 0.5} rx={r * 0.26} ry={r * 0.34} fill="#0F172A" />
  } else {
    mouth = <path d={`M ${-r * 0.26} ${r * 0.4} Q 0 ${r * 0.5} ${r * 0.26} ${r * 0.4}`} stroke="#0F172A" strokeWidth={3} fill="none" strokeLinecap="round" />
  }
  return (
    <g transform={`translate(${x}, ${y})`} opacity={opacity}>
      <circle r={r} fill={color} filter="url(#boxShadow)" />
      <circle cx={-r * 0.33} cy={eyeY} r={eyeR} fill="#0F172A" />
      <circle cx={r * 0.33} cy={eyeY} r={eyeR} fill="#0F172A" />
      {mouth}
    </g>
  )
}

// ── Speech bubble (rounded rect + ekor segitiga) ──
function Bubble({ x, y, w, h, tailX, color = '#38BDF8', children }) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={20} fill="#0F172A" stroke={color} strokeWidth={2} filter="url(#boxShadow)" />
      <path d={`M ${tailX} ${y + h} L ${tailX - 14} ${y + h + 26} L ${tailX + 20} ${y + h} Z`} fill="#0F172A" stroke={color} strokeWidth={2} />
      {children}
    </g>
  )
}

// ── Starburst badge untuk momen "aha" / insight ──
function Starburst({ r1 = 34, r2 = 20, points = 8, color = '#FBBF24' }) {
  const pts = []
  for (let i = 0; i < points * 2; i++) {
    const r = i % 2 === 0 ? r1 : r2
    const angle = (Math.PI / points) * i - Math.PI / 2
    pts.push(`${(r * Math.cos(angle)).toFixed(1)},${(r * Math.sin(angle)).toFixed(1)}`)
  }
  return <polygon points={pts.join(' ')} fill={color} filter="url(#boxShadow)" />
}

// ── Sparkle Particle Burst — insight beat
// 6-8 partikel mancar radial, reuse pola dust particle RAM (circle r=2, opacity fade)
// triggerTime: waktu burst dimulai; elapsed: waktu timeline saat ini
function SparkleParticleBurst({ triggerTime, elapsed, color = '#FBBF24', numParticles = 7 }) {
  const age = Math.max(0, elapsed - triggerTime) // waktu sejak trigger
  const burstDuration = 0.6 // durasi 600ms particle terlihat
  
  // Opacity fade: penuh di 0.2s pertama, habis di 0.4s berikutnya
  const fadeCurve = Math.max(0, 1 - (age / burstDuration))
  if (fadeCurve <= 0) return null // stop render kalau age > 0.6s
  
  return (
    <g opacity={fadeCurve}>
      {Array.from({ length: numParticles }).map((_, i) => {
        // Radial spread: setiap partikel punya arah berbeda
        const angle = (Math.PI * 2 / numParticles) * i
        const distance = 50 + Math.sin(age * 6 + i) * 12 // oscillate 50-62px
        const px = Math.cos(angle) * distance
        const py = Math.sin(angle) * distance
        
        // Partikel kecil (circle r=2.5), warna gelap dari layer
        // Opacity: full di awal, langsung decay (bukan linear, agak cepat di akhir)
        const particleOpacity = Math.pow(fadeCurve, 1.3) * 0.7
        
        return (
          <circle
            key={i}
            cx={px}
            cy={py}
            r={2.5}
            fill={color}
            opacity={particleOpacity}
          />
        )
      })}
    </g>
  )
}

// ── Mini Desktop Mockup per DE — pengganti kartu "nama besar doang" ──
// Semua motion di sini murni FUNGSI dari `elapsed` (= window.__animationTimeline.time()),
// BUKAN gsap.to(..., {repeat:-1}) berdiri sendiri. Export video kerja dengan cara seek
// frame-per-frame ke timeline (lihat scripts/export-parallel.mjs: "seek tiap frame → PNG"),
// jadi tween yang hidup di luar timeline itu TIDAK akan ke-capture dengan benar — makanya
// ambient motion di sini di-derive langsung dari waktu timeline, bukan loop terpisah.
function Mockup({ de, elapsed, w = 380, h = 160 }) {
  const wobble = (freq, amp, phase = 0) => Math.sin(elapsed * freq + phase) * amp
  const getIconWiggle = (seed) => getIdleWiggle(elapsed, seed) // untuk idle wiggle icon di dock

  if (de.id === 'gnome') {
    return (
      <g>
        <rect width={w} height={h} rx={14} fill="#1e2a4a" />
        <rect x={20} y={16} width={w - 40} height={h - 56} rx={10} fill="#0b1220" stroke={de.color} strokeWidth={1.5} opacity={0.9} />
        <g transform={`translate(${w / 2}, ${h - 26})`}>
          <rect x={-110} y={-16} width={220} height={32} rx={16} fill="#0b1220cc" stroke={de.color} strokeWidth={1} />
          {DOCK_APP_ICONS.map((iconId, i) => {
            const icon = getIcon(iconId)
            const cy = wobble(2.2, 3, i * 0.7)
            const iconWiggle = getIconWiggle(i * 0.5)
            return icon ? (
              <image key={iconId} href={icon} x={-75 + i * 50 - 9} y={cy - 9} width={18} height={18} opacity={0.95}
                transform={`rotate(${iconWiggle})`} transformOrigin={`${-75 + i * 50} ${cy}`} />
            ) : (
              <circle key={iconId} cx={-75 + i * 50} cy={cy} r={9} fill={de.color} opacity={0.9} />
            )
          })}
        </g>
      </g>
    )
  }

  if (de.id === 'kde') {
    const gearDeg = (elapsed * 70) % 360
    return (
      <g>
        <rect width={w} height={h} rx={14} fill="#123a3a" />
        <rect x={16} y={12} width={w * 0.5} height={h - 56} rx={8} fill="#0b1220" stroke="#5eead4" strokeWidth={1.4} />
        <rect x={16 + w * 0.32} y={26} width={w * 0.5} height={h - 56} rx={8} fill="#0b1220" stroke={de.color} strokeWidth={1.4} opacity={0.92} />
        <rect x={0} y={h - 28} width={w} height={28} fill="#0b1220dd" />
        {[0, 1, 2, 3, 4].map(i => {
          const iconId = DOCK_APP_ICONS[i]
          const icon = iconId ? getIcon(iconId) : null
          const iconWiggle = getIconWiggle(i * 0.4)
          return icon ? (
            <image key={i} href={icon} x={10 + i * 22} y={h - 23} width={14} height={14} opacity={0.95}
              transform={`rotate(${iconWiggle})`} transformOrigin={`${10 + i * 22 + 7} ${h - 23 + 7}`} />
          ) : (
            <rect key={i} x={10 + i * 22} y={h - 23} width={14} height={14} rx={3} fill={de.color} opacity={0.55} />
          )
        })}
        <g transform={`translate(${w - 24}, ${h - 14}) rotate(${gearDeg})`}>
          <circle r={8} fill="none" stroke={de.color} strokeWidth={2} />
          <circle r={2.4} fill={de.color} />
        </g>
      </g>
    )
  }

  if (de.id === 'xfce') {
    const pts = [[54, 26], [w - 60, 34], [w / 2, h - 44]]
    const cyc = (elapsed * 0.45) % 3
    const seg = Math.floor(cyc)
    const frac = cyc - seg
    const a = pts[seg], b = pts[(seg + 1) % 3]
    const cx = lerp(a[0], b[0], frac), cy = lerp(a[1], b[1], frac)
    return (
      <g>
        <rect width={w} height={h} rx={10} fill="#3a2f12" />
        <rect x={30} y={14} width={w - 60} height={h - 50} fill="#0b1220" stroke={de.color} strokeWidth={1.4} />
        <rect x={0} y={h - 20} width={w} height={20} fill="#0b1220" />
        {[0, 1, 2].map(i => {
          const icon = getIcon(DOCK_APP_ICONS[i])
          const iconWiggle = getIconWiggle(i * 0.3)
          return icon ? (
            <image key={i} href={icon} x={10 + i * 22} y={h - 16} width={12} height={12} opacity={0.95}
              transform={`rotate(${iconWiggle})`} transformOrigin={`${10 + i * 22 + 6} ${h - 16 + 6}`} />
          ) : (
            <rect key={i} x={10 + i * 22} y={h - 16} width={12} height={12} fill={de.color} opacity={0.6} />
          )
        })}
        <circle cx={cx} cy={cy} r={4} fill="#fff" stroke={de.color} strokeWidth={1.5} />
      </g>
    )
  }

  // i3 — tiling, tanpa dock/cursor, border window fokus berkedip
  const blink = 0.55 + 0.45 * Math.abs(Math.sin(elapsed * 3.4))
  const keyboardWiggle = getIconWiggle(42) // special seed untuk keyboard
  return (
    <g>
      <rect width={w} height={h} rx={10} fill="#1a0d0d" />
      <rect x={14} y={14} width={w * 0.46 - 18} height={h - 28} fill="#0b1220" stroke={de.color} strokeWidth={2.4} opacity={blink} />
      <rect x={w * 0.46 + 4} y={14} width={w * 0.54 - 40} height={(h - 28) / 2 - 4} fill="#0b1220" stroke="#475569" strokeWidth={1.4} />
      <rect x={w * 0.46 + 4} y={14 + (h - 28) / 2} width={w * 0.54 - 40} height={(h - 28) / 2 - 4} fill="#0b1220" stroke="#475569" strokeWidth={1.4} />
      {getIcon('keyboard') && (
        <image href={getIcon('keyboard')} x={w - 34} y={h - 30} width={20} height={20} opacity={0.85}
          transform={`rotate(${keyboardWiggle})`} transformOrigin={`${w - 24} ${h - 20}`} />
      )}
    </g>
  )
}

export default function DesktopEnvironmentAnimation({
  paused = false,
  speed = 1.0,
  volume = 75,
  previewSfx = true
}) {
  const svgRef = useRef(null)
  const timelineRef = useRef(null)
  const sfxCacheRef = useRef({})

  const [showIntro, setShowIntro] = useState(true)
  const [morphProgress, setMorphProgress] = useState(0)

  // stage: 'hook' -> 4x 'act' -> 'closing'
  const [stage, setStage] = useState('hook')
  const [actIdx, setActIdx] = useState(0)
  // beat per Act: setup -> tension -> insight (titik balik) -> payoff (cliffhanger)
  const [beat, setBeat] = useState('setup')

  const [ramAnim, setRamAnim] = useState(0)
  const [cpuAnim, setCpuAnim] = useState(0)
  const [customAnim, setCustomAnim] = useState(0)
  // ── ambient motion driver: HARUS berasal dari waktu timeline sendiri (bukan
  // gsap.to terpisah), supaya seek per-frame saat export video tetap deterministik ──
  const [elapsed, setElapsed] = useState(0)
  // ── Tahap 2: typewriter hook, sparkle insight, swipe parallax antar-Act ──
  const [typedHook, setTypedHook] = useState({ line0: '', line1: '' })
  const [insightPop, setInsightPop] = useState(0)
  const [actSlideX, setActSlideX] = useState(0)
  // ── Tahap 3: needle dial customization (overshoot 2-step + idle jitter) ──
  const [needleAnim, setNeedleAnim] = useState(-90)
  
  // ── Hero Reveal timing: track kapan Act dimulai untuk squash & stretch animation ──
  const [actStartTime, setActStartTime] = useState(0)
  
  // ── Insight Burst timing: track kapan insight beat dimulai untuk sparkle particle ──
  const [insightTriggerTime, setInsightTriggerTime] = useState(0)
  
  // ── Transisi Antar-Act: arc motion + anticipation ──
  const [transitionProgress, setTransitionProgress] = useState(0) // 0→1 selama TRANS
  
  // ── WEIGHT-TILT LAPTOP: RAM load → visual tilt + Y offset ──
  // Semakin banyak RAM dipakai, laptop semakin "berat" & condong + turun
  const [mockupRotate, setMockupRotate] = useState(0)
  const [mockupOffsetY, setMockupOffsetY] = useState(0)
  
  // ── MATCH-CUT ICON: tab icon terbang ke hero badge saat transisi ──
  // Icon yang bakal jadi Act berikutnya "terbang" dari tab → hero position
  // Phase: 0 = di tab (source), 0.5 = mid-air (fade), 1 = di hero (dest, tapi hero reveal ambil alih)
  const [matchCutProgress, setMatchCutProgress] = useState(0)

  const angleForValue = (v) => lerp(-90, 90, Math.max(0, Math.min(100, v)) / 100)

  const phase = PHASES[actIdx]
  const currentDE = DE_DATA[actIdx]
  
  // ── COLOR-WASH BACKGROUND: smooth tint transition antar-Act ──
  // Pakai transitionProgress yg sudah ada (0→1 saat swipe keluar)
  const nextActIdx = actIdx < PHASES.length - 1 ? actIdx + 1 : actIdx
  const nextDE = DE_DATA[nextActIdx]
  const backgroundColor = transitionProgress > 0
    ? (() => {
        // Parse hex color ke RGB, interpolate, convert back ke hex
        const hexToRgb = (hex) => {
          const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
          return result ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)] : [0, 0, 0]
        }
        const rgbToHex = (r, g, b) => '#' + [r, g, b].map(x => {
          const hex = Math.round(x).toString(16)
          return hex.length === 1 ? '0' + hex : hex
        }).join('')
        
        const [r1, g1, b1] = hexToRgb(currentDE.color)
        const [r2, g2, b2] = hexToRgb(nextDE.color)
        const t = transitionProgress * 0.5 // fade is gentler, peaks mid-transition
        const r = lerp(r1, r2, t)
        const g = lerp(g1, g2, t)
        const b = lerp(b1, b2, t)
        return rgbToHex(r, g, b) + '12' // low opacity tint
      })()
    : 'transparent'

  const playSfx = (name, volMult = 1) => {
    if (typeof window === 'undefined' || !previewSfx) return
    // 'whoosh' -> sfx/whoosh.wav (default folder); 'transitions/swoosh-2' -> as-is
    const rel = name.includes('/') ? name : `sfx/${name}`
    if (!sfxCacheRef.current[rel]) {
      sfxCacheRef.current[rel] = new Audio(`/audio/${rel}.wav`)
    }
    const audio = sfxCacheRef.current[rel]
    audio.volume = (volume / 100) * 0.35 * volMult
    audio.playbackRate = speed
    audio.currentTime = 0
    audio.play().catch(() => {})
  }

  // ── typewriter helper: reveal karakter satu-satu lewat tl.add() bertahap.
  // Delay per-karakter pakai variasi sinus (BUKAN Math.random) supaya hasilnya
  // tetap identik persis tiap kali timeline di-seek/di-rebuild saat export video.
  const typeText = (tl, startTime, lineKey, fullText, opts = {}) => {
    const { base = 32, amp = 12, tickEvery = 3 } = opts
    let acc = ''
    let t = startTime
    for (let i = 0; i < fullText.length; i++) {
      const ch = fullText[i]
      const delay = base + Math.sin(i * 0.7) * amp
      tl.add(() => {
        acc += ch
        setTypedHook(prev => ({ ...prev, [lineKey]: acc }))
        if (i % tickEvery === 0) playSfx('sfx/typing')
      }, t)
      t += delay / 1000
    }
    return t - startTime
  }

  useEffect(() => {
    const master = gsap.timeline({ repeat: -1, repeatDelay: 1.0 })
    timelineRef.current = master
    window.__animationTimeline = master
    // Export safety: lihat tailscale/revision/PLAN-FIX-EXPORT-MESHLINE-MISSING.md
    // § 6.3.2 — wajib supaya seek-based frame capture saat export tidak
    // melewatkan setState yang timing-nya berdekatan.
    window.__flushSync = flushSync
    // ambient driver (fan CPU, dock bob, cursor XFCE, border blink i3) baca time()
    // timeline ini langsung — otomatis benar walau di-seek/scrub saat export video.
    master.eventCallback('onUpdate', () => setElapsed(master.time()))

    let time = 0

    // ── INTRO: title morph (frame t=0 dipakai juga sebagai thumbnail) ──
    const morphObj = { p: 0 }
    master.add(() => {
      setShowIntro(true)
      setMorphProgress(0)
      playSfx('whoosh')
    }, time)

    master.to(morphObj, {
      p: 1,
      duration: 0.8,
      ease: 'power3.inOut',
      onUpdate: () => setMorphProgress(morphObj.p)
    }, time + 0.3)

    master.add(() => setShowIntro(false), time + 1.1)
    time += 1.2

    // ── HOOK: lempar pertanyaan dulu, jangan langsung jawab ──
    master.add(() => {
      setStage('hook')
      setTypedHook({ line0: '', line1: '' })
      playSfx('whoosh')
    }, time)
    // ketik 2 baris pertanyaan, karakter per karakter — bukan muncul instan
    let hookT = time + 0.2
    hookT += typeText(master, hookT, 'line0', HOOK.question[0])
    hookT += 0.15
    typeText(master, hookT, 'line1', HOOK.question[1])
    time += HOOK.duration

    // ── ACTS: 1 babak cerita per Desktop Environment ──
    const metricObj = { ram: 0, cpu: 0, custom: 0 }

    PHASES.forEach((p, i) => {
      const t0 = time
      const TRANS = 0.32 // durasi swipe parallax antar-Act

      // Setup — clean slate wajib (loop-safe)
      master.add(() => {
        setStage('act')
        setActIdx(i)
        setBeat('setup')
        setRamAnim(0)
        setCpuAnim(0)
        setCustomAnim(0)
        setInsightPop(0)
        setNeedleAnim(-90)
        setActStartTime(t0) // ← Hero reveal timing
        if (i > 0) setActSlideX(220) // Act baru muncul dari kanan (kecuali Act 1)
        playSfx('click')
      }, t0)

      // ── slide-in parallax (Act 2 dst): masuk dari kanan, settle ke posisi normal ──
      if (i > 0) {
        const slideInObj = { x: 220 }
        master.to(slideInObj, {
          x: 0, duration: TRANS, ease: 'power3.out',
          onUpdate: () => setActSlideX(slideInObj.x)
        }, t0 + 0.01)
      }

      // Tegangan — mulai ada "kok gini?"
      master.add(() => setBeat('tension'), t0 + 1.6)

      master.to(metricObj, {
        ram: DE_DATA[i].ramValue,
        cpu: DE_DATA[i].cpu,
        custom: DE_DATA[i].custom,
        duration: 1.2,
        ease: 'power2.out',
        onUpdate: () => {
          setRamAnim(metricObj.ram)
          setCpuAnim(metricObj.cpu)
          setCustomAnim(metricObj.custom)
          
          // ── WEIGHT-TILT: laptop condong & turun seiring RAM naik ──
          // Rotasi: 0° → 3° (right side ditekan RAM "berat")
          // TranslateY: 0px → 8px (turun karena beban)
          const ramProgress = metricObj.ram / DE_DATA[i].ramValue
          const tilt = ramProgress * 3 // max 3 degrees
          const drop = ramProgress * 8 // max 8px drop
          setMockupRotate(tilt)
          setMockupOffsetY(drop)
        }
      }, t0 + 1.8)
      master.add(() => playSfx('scan'), t0 + 1.8)

      // ── needle Customization: overshoot dulu +8° lewat target, baru settle
      // balik pakai elastic — kesan jarum speedometer fisik, bukan interpolasi
      // digital kaku. Dijalankan paralel sama tween metricObj di slot yang sama. ──
      const needleObj = { deg: -90 }
      const needleTarget = angleForValue(DE_DATA[i].custom)
      master.to(needleObj, {
        keyframes: [
          { deg: needleTarget + 8, duration: 0.9, ease: 'power2.out' },
          { deg: needleTarget, duration: 0.5, ease: 'elastic.out(1, 0.4)' }
        ],
        onUpdate: () => setNeedleAnim(needleObj.deg)
      }, t0 + 1.8)
      master.add(() => playSfx('ui/chime'), t0 + 1.8 + 0.9)

      // Titik balik — "aha moment", insight muncul + sparkle burst (bukan pop instan)
      master.add(() => {
        setBeat('insight')
        setInsightTriggerTime(t0 + 3.4) // track trigger time untuk sparkle burst
        playSfx('success')
      }, t0 + 3.4)
      const insightObj = { v: 0 }
      master.to(insightObj, {
        v: 1, duration: 0.6, ease: 'back.out(2)',
        onUpdate: () => setInsightPop(insightObj.v)
      }, t0 + 3.4)

      // Payoff — cliffhanger ke Act berikutnya
      master.add(() => setBeat('payoff'), t0 + 5.6)

      // ── slide-out parallax (kecuali Act terakhir): arc motion + anticipation ──
      // Transisi berasa "pindah channel" dengan easing yang lebih hidup (bukan hard-cut) ──
      if (i < PHASES.length - 1) {
        const outStart = t0 + p.duration - TRANS
        master.add(() => playSfx('transitions/swoosh-2'), outStart)
        const transObj = { progress: 0 }
        master.to(transObj, {
          progress: 1, duration: TRANS, ease: 'power2.inOut',
          onUpdate: () => setTransitionProgress(transObj.progress)
        }, outStart)
        // Reset transition progress di awal Act berikutnya
        master.add(() => setTransitionProgress(0), outStart + TRANS)
      }

      time += p.duration
    })

    // ── CLOSING: jawab hook Act 1 secara eksplisit — race track, bukan rekap kartu ──
    master.add(() => {
      setStage('closing')
      playSfx('whoosh')
    }, time)
    // SFX kedatangan avatar: dijadwalkan absolut memakai raceDurationFor yang SAMA
    // dipakai render (avatarProgress), supaya bunyi & posisi visual selalu sinkron.
    // Volume makin kecil per kedatangan berikutnya biar gak numpuk berisik (§5.4/§8).
    DE_DATA
      .map(de => ({ id: de.id, finishAt: time + RACE_START + raceDurationFor(de.ramValue) }))
      .sort((a, b) => a.finishAt - b.finishAt)
      .forEach((entry, arrivalIdx) => {
        master.add(() => playSfx('success/victory', Math.max(0.35, 1 - arrivalIdx * 0.22)), entry.finishAt)
      })
    time += CLOSING.duration

    return () => {
      master.kill()
      if (window.__animationTimeline === master) {
        delete window.__animationTimeline
      }
    }
  }, [])

  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.timeScale(speed)
      if (paused) timelineRef.current.pause(); else timelineRef.current.resume();
    }
  }, [speed, paused])

  const captionText = stage === 'act'
    ? (beat === 'setup' ? phase.setup : beat === 'tension' ? phase.tension : phase.caption)
    : ''

  return (
    <svg ref={svgRef} viewBox={`0 0 ${VW} ${VH}`}
      style={{
        width: '100%', height: '100%',
        maxHeight: '100vh', maxWidth: `calc(100vh * ${VW} / ${VH})`,
        background: '#070913', userSelect: 'none'
      }}>
      
      {/* ── COLOR-WASH OVERLAY: transisi warna DE saat swipe antar-Act ── */}
      {transitionProgress > 0 && (
        <rect width={VW} height={VH} fill={backgroundColor} />
      )}

      <defs>
        <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="boxShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="#000000" floodOpacity="0.5" />
        </filter>
        <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38BDF8" />
          <stop offset="100%" stopColor="#8B5CF6" />
        </linearGradient>
      </defs>

      {/* Grid Pattern */}
      <g opacity={0.06}>
        {Array.from({ length: 22 }).map((_, i) => (
          <line key={`vg-${i}`} x1={i * 40} y1={0} x2={i * 40} y2={VH} stroke="#38BDF8" strokeWidth={1} />
        ))}
        {Array.from({ length: 34 }).map((_, i) => (
          <line key={`hg-${i}`} x1={0} y1={i * 40} x2={VW} y2={i * 40} stroke="#38BDF8" strokeWidth={1} />
        ))}
      </g>

      {/* ── HEADER SECTION ───── */}
      <g id="header-layer">
        {(() => {
          const p = morphProgress
          const taglineY = lerp(540, 30, p)
          const taglineFont = lerp(24, 16, p)
          const fileX = lerp((VW / 2) - 200, 44, p)
          const fileY = lerp(620, 80, p)
          const fileFont = lerp(100, 52, p)
          const subX = lerp((VW / 2) - 180, 44, p)
          const subY = lerp(695, 115, p)
          const subFont = lerp(26, 18, p)

          return (
            <>
              <text x={VW / 2} y={taglineY} textAnchor="middle" fill="#64748B" fontSize={taglineFont} fontFamily="monospace" letterSpacing={3}>
                LINUX BASICS · <tspan fill="#38BDF8" fontWeight={700}>ADIB-DEV.COM</tspan>
              </text>
              <text x={fileX} y={fileY} textAnchor="start" fill="url(#headerGrad)"
                fontSize={fileFont} fontFamily="'Arial Black', Impact, sans-serif" fontWeight={900} letterSpacing={1}>
                DESKTOP ENV
              </text>
              <text x={subX} y={subY} textAnchor="start" fill="#94A3B8" fontSize={subFont} fontFamily="sans-serif" fontWeight={500}>
                Linux itu satu, tapi wajahnya bisa beda-beda
              </text>
            </>
          )
        })()}
      </g>

      {/* ── PHASE BADGE (hanya saat Act) ── */}
      {!showIntro && stage === 'act' && (
      <g transform="translate(44, 160)">
        <defs>
          <clipPath id="heroIconMask">
            {(() => {
              const reveal = getHeroRevealScale(elapsed, actStartTime)
              const r = 12
              return <circle cx={22} cy={20} r={r * reveal.irisMask} />
            })()}
          </clipPath>
        </defs>
        <rect width={360} height={40} rx={20} fill="#0F172A" stroke={phase.badgeColor} strokeWidth={1.8} filter="url(#boxShadow)" />
        {/* Icon di slot badge cuma tampil begitu beat LEWAT setup — selama setup,
            slot ini kosong karena icon-nya lagi jadi HERO REVEAL besar (lihat blok
            "HERO REVEAL BESAR" di ACT STAGE). Begitu setup selesai, hero sudah
            menyusut & mendarat persis di titik ini (66,180 absolut) — makanya
            hand-off-nya kelihatan mulus tanpa icon dobel (§3/§4/§6). */}
        {beat !== 'setup' && (
          (getIcon(`${phase.id}-logo`) || getIcon('i3-grid')) ? (
            <image href={getIcon(`${phase.id}-logo`) || getIcon('i3-grid')} x={12} y={8} width={20} height={24} />
          ) : (
            <circle cx={22} cy={20} r={6} fill={phase.badgeColor} />
          )
        )}
        <text x={40} y={25} fill={phase.badgeColor} fontSize={15} fontFamily="monospace" fontWeight={700} letterSpacing={1}>
          {phase.badge}
        </text>
        <g transform="translate(640, 12)">
          {PHASES.map((p, i) => {
            const wiggle = getIdleWiggle(elapsed, i * 0.5)
            return (
              <circle key={p.id} cx={i * 24} cy={8} r={i === actIdx ? 6.5 : 4}
                fill={i === actIdx ? phase.badgeColor : '#334155'}
                stroke={i === actIdx ? '#ffffff' : 'none'} strokeWidth={1.5}
                transform={`rotate(${wiggle})`} transformOrigin={`${i * 24} 8`} />
            )
          })}
        </g>
      </g>
      )}

      {/* ════ HOOK STAGE — lempar pertanyaan dulu ════ */}
      {!showIntro && stage === 'hook' && (
        <g transform="translate(0, 320)">
          <Face x={VW / 2} y={140} r={54} reaction="worried" color="#F87171" />
          <Bubble x={VW / 2 - 300} y={230} w={600} h={140} tailX={VW / 2 - 40} color="#38BDF8">
            {/* typewriter reveal — karakter dituliskan bertahap lewat typedHook state,
                bukan muncul instan; kursor "_" berkedip di baris yang lagi diketik */}
            <text x={VW / 2 - 270} y={275} fill="#E2E8F0" fontSize={26} fontFamily="sans-serif" fontWeight={700}>
              {typedHook.line0}
              {typedHook.line0.length < HOOK.question[0].length && Math.sin(elapsed * 6) > 0 && (
                <tspan fill="#38BDF8">_</tspan>
              )}
            </text>
            <text x={VW / 2 - 270} y={312} fill="#E2E8F0" fontSize={26} fontFamily="sans-serif" fontWeight={700}>
              {typedHook.line1}
              {typedHook.line0.length >= HOOK.question[0].length &&
                typedHook.line1.length < HOOK.question[1].length && Math.sin(elapsed * 6) > 0 && (
                <tspan fill="#38BDF8">_</tspan>
              )}
            </text>
            <text x={VW / 2 - 270} y={348} fill="#94A3B8" fontSize={17} fontFamily="sans-serif"
              opacity={typedHook.line1.length >= HOOK.question[1].length ? 1 : 0}>
              {HOOK.sub}
            </text>
          </Bubble>

          <g transform="translate(44, 460)">
            {PHASES.map((p, i) => {
              const logo = getIcon(`${p.id}-logo`) || getIcon('i3-grid')
              const iconWiggle = getIdleWiggle(elapsed, i * 0.4)
              return (
                <g key={p.id} transform={`translate(${i * 185}, 0)`} opacity={0.45}>
                  <rect width={175} height={70} rx={12} fill="#030712" stroke="#1E293B" strokeWidth={1.5} />
                  {logo && (
                    <image href={logo} x={87.5 - 12} y={12} width={24} height={24}
                      transform={`rotate(${iconWiggle})`} transformOrigin={`${87.5} 24`} />
                  )}
                  <text x={87.5} y={40} textAnchor="middle" fill="#64748B" fontSize={16} fontFamily="'Arial Black', sans-serif">
                    {p.badge.split(' ')[0]}
                  </text>
                </g>
              )
            })}
          </g>
        </g>
      )}

      {/* ════ ACT STAGE ════ */}
      {!showIntro && stage === 'act' && (() => {
        // Arc motion + anticipation untuk transisi antar-Act
        const arcX = getActTransitionX(transitionProgress, -1) + actSlideX
        const arcY = transitionProgress > 0 ? Math.sin(transitionProgress * Math.PI) * -18 : 0
        const fadeOut = 1 - Math.min(1, Math.max(Math.abs(actSlideX) / 220, transitionProgress) * 0.85)
        
        // ── PARALLAX 2-LAPIS: swipe transition dengan depth —— 
        // Background slide lebih lambat (0 → -VW*0.15)
        // Foreground slide lebih cepat (0 → -VW*0.3)
        // Ini bikin transisi terasa "sinematik" dengan depth, bukan flat slide
        const parallaxBgX = transitionProgress > 0 ? -VW * 0.15 * transitionProgress : 0
        const parallaxFgX = transitionProgress > 0 ? -VW * 0.3 * transitionProgress : 0
        
        return (
        <g>
          {/* BACKGROUND LAYER — slide lebih lambat untuk depth effect */}
          <g transform={`translate(${parallaxBgX}, 0)`}>
            {/* Grid + ambient elements di background */}
            <g opacity={0.03}>
              {Array.from({ length: 22 }).map((_, i) => (
                <line key={`bg-vg-${i}`} x1={i * 40} y1={240} x2={i * 40} y2={VH} stroke={currentDE.color} strokeWidth={1} />
              ))}
            </g>
          </g>
          
          {/* FOREGROUND LAYER — konten utama, slide lebih cepat */}
          <g transform={`translate(${arcX + parallaxFgX}, ${240 + arcY})`} opacity={fadeOut}>

          {/* ════ HERO REVEAL BESAR (§3/§4/§6) ════
              Logo DE sebagai hero masuk gede (80-120px), squash & stretch + iris reveal,
              cuma tampil di setup beat. Begitu beat pindah, hero menyusut ke badge (20px)
              di top area — jadi mulus "hand-off" visual identity tanpa icon dobel. */}
          {beat === 'setup' && (() => {
            const heroIcon = getIcon(`${phase.id}-logo`) || getIcon('i3-grid')
            const heroScale = getHeroRevealScale(elapsed, actStartTime)
            const heroSize = 100 // base size di momen setup
            
            // Setup beat duration: ~2 detik (rough estimate per Act 7.2s, setup ~2s)
            // Setelah ~2 detik, mulai fade out untuk transisi ke badge kecil
            const setupDuration = 2.0
            const timeSinceActStart = elapsed - actStartTime
            const setupProgress = Math.min(1, timeSinceActStart / setupDuration)
            
            // Fade out hero saat setup selesai
            const heroOpacity = Math.max(0, 1 - Math.max(0, (setupProgress - 0.7) / 0.3))
            
            return heroIcon && (
              <g transform={`translate(${VW / 2}, 100)`} opacity={heroOpacity}>
                <defs>
                  <clipPath id={`heroRevealClip-${actIdx}`}>
                    <circle cx={0} cy={0} r={heroSize / 2 * heroScale.irisMask} />
                  </clipPath>
                </defs>
                
                {/* Background ring / glow effect */}
                <circle r={heroSize / 2 + 8} fill="none" stroke={currentDE.color} strokeWidth={2} opacity={0.3 * heroOpacity} />
                
                {/* Main hero icon dengan squash & stretch + iris */}
                <g transform={`scale(${heroScale.scaleX} ${heroScale.scaleY})`} clipPath={`url(#heroRevealClip-${actIdx})`}>
                  <image 
                    href={heroIcon} 
                    x={-heroSize / 2} 
                    y={-heroSize / 2} 
                    width={heroSize} 
                    height={heroSize}
                  />
                </g>
                
                {/* Speed-lines radial saat reveal */}
                {heroScale.irisMask > 0.3 && Array.from({ length: 5 }).map((_, i) => {
                  const angle = (i / 5) * Math.PI * 2
                  const radius = 60 * heroScale.irisMask
                  const x1 = Math.cos(angle) * (heroSize / 2 + 12)
                  const y1 = Math.sin(angle) * (heroSize / 2 + 12)
                  const x2 = Math.cos(angle) * radius
                  const y2 = Math.sin(angle) * radius
                  return (
                    <line 
                      key={i} 
                      x1={x1} y1={y1} x2={x2} y2={y2}
                      stroke={currentDE.color} 
                      strokeWidth={1.5}
                      opacity={0.6 * heroScale.irisMask}
                      strokeLinecap="round"
                    />
                  )
                })}
              </g>
            )
          })()}

          {/* PERSONA LINE — reveal saat setup beat (§2/§4: persona matching) */}
          {beat === 'setup' && (
            <g transform="translate(44, 200)" opacity={Math.min(1, Math.max(0, (elapsed - actStartTime - 0.4) / 0.5))}>
              <rect width={732} height={120} rx={14} fill={`${currentDE.color}08`} stroke={currentDE.color} strokeWidth={1.5} />
              <text x={40} y={45} fill="#E2E8F0" fontSize={22} fontFamily="sans-serif" fontWeight={700} maxWidth={660}>
                {phase.setup}
              </text>
              <text x={40} y={90} fill="#94A3B8" fontSize={16} fontFamily="monospace" maxWidth={660}>
                ✦ {phase.persona}
              </text>
            </g>
          )}

          {/* TOP SHOWCASE — sekarang mockup layar mini, bukan kartu nama doang */}
          <g transform="translate(44, 0)" opacity={beat !== 'setup' ? 1 : 0.3}>
            <rect width={732} height={200} rx={20} fill="#050811" stroke={currentDE.color} strokeWidth={3} filter="url(#boxShadow)"/>
            {/* ── MOCKUP + WEIGHT-TILT: laptop condong & turun karena RAM "berat" ── */}
            <g transform={`translate(20, ${20 + mockupOffsetY}) rotate(${mockupRotate} 190 80)`}>
              <Mockup de={currentDE} elapsed={elapsed} w={380} h={160} />
            </g>
            <text x={420} y={68} fill={currentDE.color} fontSize={32} fontFamily="'Arial Black', sans-serif" filter="url(#neonGlow)">
              {currentDE.name}
            </text>
            <text x={420} y={100} fill="#E2E8F0" fontSize={16} fontFamily="monospace">
              {currentDE.style}
            </text>
            <text x={420} y={130} fill="#64748B" fontSize={13} fontFamily="sans-serif">
              Populer di:
            </text>
            <text x={420} y={150} fill="#94A3B8" fontSize={13} fontFamily="sans-serif">
              {currentDE.distro}
            </text>
            {beat !== 'setup' && (
              <Face x={676} y={38} r={22} reaction={phase.reaction} color={currentDE.color} />
            )}
          </g>

          {/* PERFORMANCE METRICS */}
          <g transform="translate(44, 240)">
            <g transform="translate(0, 0)">
              <rect width={732} height={120} rx={16} fill="#090D1A" stroke="#1E293B" strokeWidth={1.5} />
              {getIcon('ram-stick') && (
                <image href={getIcon('ram-stick')} x={12} y={22} width={20} height={20} />
              )}
              <text x={40} y={40} fill="#94A3B8" fontSize={16} fontFamily="monospace" fontWeight={800}>
                IDLE RAM USAGE (Estimasi)
              </text>
              <text x={692} y={40} textAnchor="end" fill="#F87171" fontSize={20} fontFamily="monospace" fontWeight={800}>
                {currentDE.ram}
              </text>
              {/* stack blok yang "jatuh" satu-satu, bukan bar mengisi mulus —
                  tiap blok = ~15% RAM, posisi/opacity di-derive langsung dari
                  ramAnim (tween yang sudah jalan di master timeline) */}
              {(() => {
                const totalBlocks = Math.ceil(currentDE.ramValue / 15)
                const gap = 6
                const blockW = (652 - gap * (totalBlocks - 1)) / totalBlocks
                return Array.from({ length: totalBlocks }).map((_, j) => {
                  const frac = Math.max(0, Math.min(1, (ramAnim - j * 15) / 15))
                  if (frac <= 0) return null
                  const bx = 40 + j * (blockW + gap)
                  const fallY = lerp(-24, 0, frac)
                  const dustFade = frac > 0.7 ? Math.max(0, 1 - (frac - 0.7) / 0.3) : 1
                  return (
                    <g key={j}>
                      {frac < 1 && [0, 1].map(k => (
                        <circle key={k} cx={bx + blockW / 2 + (k === 0 ? -8 : 8)} cy={65 + 20 + fallY}
                          r={2.2} fill="#F87171" opacity={dustFade * 0.6} />
                      ))}
                      <rect x={bx} y={65 + fallY} width={blockW} height={20} rx={5}
                        fill="#F87171" opacity={Math.min(1, frac * 1.3)} filter="url(#neonGlow)" />
                    </g>
                  )
                })
              })()}
            </g>

            <g transform="translate(0, 140)">
              <rect width={732} height={120} rx={16} fill="#090D1A" stroke="#1E293B" strokeWidth={1.5} />
              {getIcon('cpu-chip') && (
                <image href={getIcon('cpu-chip')} x={12} y={22} width={20} height={20} />
              )}
              <text x={40} y={40} fill="#94A3B8" fontSize={16} fontFamily="monospace" fontWeight={800}>
                CPU OVERHEAD (Animasi & Efek)
              </text>
              <text x={692} y={40} textAnchor="end" fill="#38BDF8" fontSize={20} fontFamily="monospace" fontWeight={800}>
                {Math.round(cpuAnim)}%
              </text>
              {/* fan berputar kontinu — kecepatan berbanding lurus sama beban CPU.
                  Ini AMBIENT LAYER: tetap muter walau beat sudah pindah ke metric
                  lain, karena deg di-derive dari `elapsed` (waktu timeline), bukan
                  dihentikan/direset kayak state beat lain. */}
              {(() => {
                const speedFactor = lerp(20, 260, currentDE.cpu / 100) // deg/detik
                const deg = (elapsed * speedFactor) % 360
                const ghostDeg = deg - 16
                const cpuHeatIntensity = currentDE.cpu / 100 // heat shimmer intensity matched to CPU load
                return (
                  <g transform="translate(78, 88)">
                    {/* ── HEAT SHIMMER BACKDROP ── */}
                    {currentDE.cpu > 20 && (
                      <HeatShimmer intensity={cpuHeatIntensity} elapsed={elapsed} color="#38BDF8" />
                    )}
                    
                    <circle r={30} fill="#030712" stroke="#1E293B" strokeWidth={1.5} />
                    <g transform={`rotate(${ghostDeg})`} opacity={0.18}>
                      {[0, 90, 180, 270].map(a => (
                        <rect key={a} transform={`rotate(${a})`} x={-4} y={-26} width={8} height={20} rx={4} fill="#38BDF8" />
                      ))}
                    </g>
                    <g transform={`rotate(${deg})`}>
                      {[0, 90, 180, 270].map(a => (
                        <rect key={a} transform={`rotate(${a})`} x={-4} y={-26} width={8} height={20} rx={4} fill="#38BDF8" filter="url(#neonGlow)" />
                      ))}
                    </g>
                    <circle r={5} fill="#0F172A" stroke="#38BDF8" strokeWidth={1.5} />
                  </g>
                )
              })()}
              {/* bar tipis tetap ada sebagai referensi angka presisi (§4 plan:
                  metric tetap akurat), tapi bukan lagi elemen visual utama */}
              <rect x={130} y={81} width={562} height={10} rx={5} fill="#030712" />
              <rect x={130} y={81} width={(cpuAnim / 100) * 562} height={10} rx={5} fill="#38BDF8" opacity={0.5} />
            </g>

            <g transform="translate(0, 280)">
              <rect width={732} height={120} rx={16} fill="#090D1A" stroke="#1E293B" strokeWidth={1.5} />
              {getIcon('customize-dial') && (
                <image href={getIcon('customize-dial')} x={12} y={22} width={20} height={20} />
              )}
              <text x={40} y={40} fill="#94A3B8" fontSize={16} fontFamily="monospace" fontWeight={800}>
                TINGKAT KUSTOMISASI (Themes/Widgets)
              </text>
              <text x={692} y={40} textAnchor="end" fill="#34D399" fontSize={20} fontFamily="monospace" fontWeight={800}>
                {Math.round(customAnim)} / 100
              </text>
              
              {/* ── BEFORE-AFTER WIPE: visual "polos" vs "abis di-custom" (§5/§9.2) ── */}
              {(() => {
                const customProgress = Math.max(0, Math.min(1, customAnim / 100))
                const wipeX = 130 + customProgress * 560 // wipe dari kiri ke kanan
                return (
                  <>
                    <defs>
                      <clipPath id={`customWipeClip-${actIdx}`}>
                        <rect x={130} y={60} width={customProgress * 560} height={50} />
                      </clipPath>
                    </defs>
                    <g>
                      {/* Before state: interface polos, no theme */}
                      <rect x={130} y={60} width={560} height={50} rx={6} fill="#0F172A" stroke="#1E293B" strokeWidth={1} />
                      <circle cx={148} cy={80} r={6} fill="#334155" />
                      <line x1={162} y1={77} x2={210} y2={77} stroke="#475569" strokeWidth={2} />
                      <line x1={162} y1={85} x2={210} y2={85} stroke="#475569" strokeWidth={1} />
                      <line x1={380} y1={75} x2={420} y2={75} stroke="#334155" strokeWidth={2} />
                      <line x1={380} y1={87} x2={450} y2={87} stroke="#334155" strokeWidth={1} />
                      
                      {/* After state: interface with theme color + decorations */}
                      <g clipPath={`url(#customWipeClip-${actIdx})`}>
                        <rect x={130} y={60} width={560} height={50} rx={6} fill={currentDE.color} stroke={currentDE.color} strokeWidth={2} opacity={0.2} />
                        <circle cx={148} cy={80} r={6} fill={currentDE.color} opacity={0.8} filter="url(#neonGlow)" />
                        <line x1={162} y1={77} x2={210} y2={77} stroke={currentDE.color} strokeWidth={2} />
                        <line x1={162} y1={85} x2={210} y2={85} stroke={currentDE.color} strokeWidth={1} opacity={0.6} />
                        <circle cx={395} cy={80} r={8} fill="none" stroke={currentDE.color} strokeWidth={1.5} />
                        <line x1={395} y1={72} x2={395} y2={88} stroke={currentDE.color} strokeWidth={1.5} />
                        <circle cx={430} cy={80} r={4} fill={currentDE.color} opacity={0.7} />
                        <circle cx={450} cy={80} r={4} fill={currentDE.color} opacity={0.4} />
                      </g>
                      
                      {/* Wipe cursor icon */}
                      {customProgress > 0.05 && customProgress < 0.95 && getIcon('keyboard') && (
                        <image href={getIcon('keyboard')} x={wipeX - 8} y={65} width={16} height={16} opacity={0.7} />
                      )}
                    </g>
                  </>
                )
              })()}
              
              {/* dial/gauge tetap ada tapi ukurannya kecil — jarum overshoot lewat target
                  lalu settle balik (elastic), setelah settle jarum idle jitter halus */}
              {(() => {
                const progress = Math.max(0, Math.min(1, customAnim / 100))
                const cx = 96, cy = 100, r = 44
                const arcLen = Math.PI * r
                const settled = Math.abs(customAnim - currentDE.custom) < 1
                const jitter = settled ? Math.sin(elapsed * 9 + currentDE.custom) * 0.7 : 0
                return (
                  <g opacity={0.6}>
                    <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                      fill="none" stroke="#1E293B" strokeWidth={10} strokeLinecap="round" />
                    <path d={`M ${cx - r} ${cy} A ${r} ${r} 0 0 1 ${cx + r} ${cy}`}
                      fill="none" stroke="#34D399" strokeWidth={10} strokeLinecap="round"
                      opacity={0.4} strokeDasharray={`${arcLen} ${arcLen}`}
                      strokeDashoffset={arcLen * (1 - progress)} />
                    <g transform={`translate(${cx}, ${cy}) rotate(${needleAnim + jitter})`}>
                      <line x1={0} y1={6} x2={0} y2={-r + 10} stroke="#34D399" strokeWidth={3.5} strokeLinecap="round" filter="url(#neonGlow)" />
                    </g>
                    <circle cx={cx} cy={cy} r={6} fill="#0F172A" stroke="#34D399" strokeWidth={2} />
                  </g>
                )
              })()}
            </g>
          </g>

          {/* INSIGHT BADGE — titik balik / "aha moment": pop-in via insightPop
              (tween back.out yang sudah jalan di master timeline), plus rotasi
              pelan berbasis elapsed biar starburst-nya "hidup" bukan diam kaku */}
          {(beat === 'insight' || beat === 'payoff') && (
            <g>
              {/* Sparkle particle burst — radial particles yang mancar keluar */}
              <g transform={`translate(690, 610)`}>
                <SparkleParticleBurst 
                  triggerTime={insightTriggerTime} 
                  elapsed={elapsed} 
                  color={currentDE.color} 
                  numParticles={7} 
                />
              </g>
              {/* Main starburst + bulb icon */}
              <g transform={`translate(690, 610) scale(${insightPop}) rotate(${elapsed * 18})`}>
                <Starburst color={currentDE.color} />
                {getIcon('insight-bulb') && (
                  <image href={getIcon('insight-bulb')} x={-9} y={-9} width={18} height={18}
                    transform={`rotate(${-elapsed * 18})`} />
                )}
              </g>
            </g>
          )}
          {(beat === 'insight' || beat === 'payoff') && (
            <g transform="translate(44, 660)" opacity={insightPop}>
              <rect width={732} height={62} rx={14} fill="#0F172A" stroke={currentDE.color} strokeWidth={1.5} />
              <text x={26} y={26} fill="#E2E8F0" fontSize={15} fontFamily="sans-serif" fontWeight={600}>
                {phase.insight[0]}
              </text>
              <text x={26} y={47} fill="#E2E8F0" fontSize={15} fontFamily="sans-serif" fontWeight={600}>
                {phase.insight[1]}
              </text>
            </g>
          )}

          {/* ════ MATCH-CUT ICON: logo terbang dari tab ke hero (§10) ════
              Saat setup beat: icon logo di tab aktif "terbang" naik jadi hero reveal
              Ini visual continuity — mata mengikuti satu elemen pindah peran. */}
          {beat === 'setup' && (() => {
            const sourceTabX = 44 + actIdx * 185 + 75 // center dari tab badge
            const sourceTabY = 750 + 50
            const destHeroX = VW / 2
            const destHeroY = 100
            
            const setupDuration = 0.8
            const timeSinceActStart = elapsed - actStartTime
            const setupProgress = Math.min(1, timeSinceActStart / setupDuration)
            
            // Bezier interpolation untuk arc motion (bukan linear geser)
            const easeOutQuad = (t) => 1 - (1 - t) * (1 - t)
            const progress = easeOutQuad(setupProgress)
            
            // Parabolic arc Y (lebih tinggi di tengah)
            const arcY = Math.sin(progress * Math.PI) * 180
            
            const currentX = sourceTabX + (destHeroX - sourceTabX) * progress
            const currentY = sourceTabY - (sourceTabY - destHeroY) * progress - arcY
            
            // Icon shrink dari 24px → 0 saat terbang
            const iconSize = 24 * (1 - progress)
            
            // Fade out sebelum landed di hero (hero punya iris reveal sendiri)
            const matchCutOpacity = Math.max(0, 1 - Math.max(0, (progress - 0.7) / 0.3))
            
            const matchIcon = getIcon(`${phase.id}-logo`) || getIcon('i3-grid')
            return matchIcon && progress > 0.05 ? (
              <g transform={`translate(${currentX}, ${currentY})`} opacity={matchCutOpacity}>
                <image href={matchIcon} x={-iconSize / 2} y={-iconSize / 2} width={iconSize} height={iconSize} />
              </g>
            ) : null
          })()}

          {/* BOTTOM COMPARISON TABS (Gnome, KDE, XFCE, i3) */}
          <g transform="translate(44, 750)">
            {DE_DATA.map((de, idx) => {
              const isActive = idx === actIdx
              const tX = idx * 185
              const logo = getIcon(`${de.id}-logo`) || getIcon('i3-grid')
              const iconWiggle = getIdleWiggle(elapsed, idx * 0.3) // idle wiggle per icon
              return (
                <g key={de.id} transform={`translate(${tX}, 0)`}>
                  <rect width={175} height={100} rx={12}
                    fill={isActive ? `${de.color}20` : '#030712'}
                    stroke={isActive ? de.color : '#1E293B'} strokeWidth={isActive ? 2 : 1} />
                  {logo && (
                    <image href={logo} x={12} y={12} width={20} height={20} opacity={isActive ? 1 : 0.6}
                      transform={`rotate(${iconWiggle})`} transformOrigin="22 22" />
                  )}
                  <text x={97} y={28} fill={isActive ? de.color : '#64748B'} fontSize={20} fontFamily="'Arial Black', sans-serif">
                    {de.name}
                  </text>
                  <text x={87.5} y={70} textAnchor="middle" fill={isActive ? '#E2E8F0' : '#475569'} fontSize={12} fontFamily="monospace">
                    RAM: {de.ram.split(' - ')[0]}
                  </text>
                </g>
              )
            })}
          </g>
          </g>
        </g>
        )
      })()}

      {/* ════ CLOSING STAGE — race track, bukan rekap kartu diam (§5.4 Tahap 3) ════ */}
      {!showIntro && stage === 'closing' && (() => {
        // closingStart dihitung murni dari data (intro 1.2s + HOOK + total PHASES),
        // BUKAN state baru — tetap konsisten sama struktur timeline di useEffect.
        const closingStart = 1.2 + HOOK.duration + PHASES.reduce((s, p) => s + p.duration, 0)
        const ct = Math.max(0, elapsed - closingStart) // waktu lokal di dalam closing

        const trackX0 = 20, trackX1 = 470
        const laneGap = 46
        const progressAt = (ramValue, t) => {
          const dur = raceDurationFor(ramValue)
          return easeOutQuad(Math.max(0, Math.min(1, (t - RACE_START) / dur)))
        }
        const avatarX = (de) => lerp(trackX0, trackX1, progressAt(de.ramValue, ct))

        // kamera micro-follow: posisi lead avatar dibaca sedikit "lag" (FUNGSI murni
        // dari waktu, bukan akumulasi frame-ke-frame) — tetap deterministik walau
        // di-seek per-frame saat export video (pola sama seperti ambient Mockup §Tahap1)
        const camLagT = Math.max(0, ct - 0.18)
        const leadProgress = Math.max(...DE_DATA.map(de => progressAt(de.ramValue, camLagT)))
        const camFollow = (lerp(trackX0, trackX1, leadProgress) - (trackX0 + trackX1) / 2) * 0.1
        const camX = Math.max(-14, Math.min(14, camFollow))

        const titleOpacity = Math.min(1, ct / 0.5)
        const maxFinish = Math.max(...DE_DATA.map(de => RACE_START + raceDurationFor(de.ramValue)))
        const answerOpacity = Math.max(0, Math.min(1, (ct - maxFinish - 0.3) / 0.4))

        // dua avatar RAM paling irit = paling cepat → dapat jejak ghost (§5.4)
        const trailIds = [...DE_DATA].sort((a, b) => a.ramValue - b.ramValue).slice(0, 2).map(d => d.id)

        return (
          <g transform="translate(0, 260)">
            <Face x={VW / 2} y={70} r={44} reaction="relieved" color="#34D399" opacity={titleOpacity} />
            <text x={VW / 2} y={160} textAnchor="middle" fill="#E2E8F0" fontSize={26} fontFamily="sans-serif" fontWeight={800} opacity={titleOpacity}>
              {CLOSING.title}
            </text>

            <g transform={`translate(${44 + camX}, 220)`}>
              {/* garis track yang scroll ke kiri — trik lama biar race berasa gerak
                  walau "kamera" sebenarnya cuma translate kecil (§5.4) */}
              <g opacity={0.35}>
                {Array.from({ length: 15 }).map((_, i) => {
                  const lineX = ((i * 35 - ct * 90) % 500 + 500) % 500
                  return <line key={i} x1={lineX} y1={0} x2={lineX} y2={laneGap * 4 + 10} stroke="#1E293B" strokeWidth={2} />
                })}
              </g>

              {DE_DATA.map((de, idx) => {
                const x = avatarX(de)
                const y = idx * laneGap + 20
                const finishAt = RACE_START + raceDurationFor(de.ramValue)
                const sinceFinish = ct - finishAt
                const arrived = sinceFinish > 0
                const badgeOpacity = Math.max(0, Math.min(1, sinceFinish / 0.3))
                const badgeY = lerp(10, 0, badgeOpacity)
                return (
                  <g key={de.id}>
                    {/* jejak ghost — cuma buat 2 avatar tercepat, posisi dihitung ULANG
                        di waktu mundur (bukan nyimpen histori posisi tiap frame) */}
                    {trailIds.includes(de.id) && [0.08, 0.16, 0.24].map((lag, k) => {
                      const gx = lerp(trackX0, trackX1, progressAt(de.ramValue, ct - lag))
                      return <circle key={k} cx={gx} cy={y} r={14} fill={de.color} opacity={arrived ? 0 : 0.22 - k * 0.06} />
                    })}
                    <Face x={x} y={y} r={16} reaction="neutral" color={de.color} />
                    {(() => {
                      const raceLogo = getIcon(`${de.id}-logo`) || getIcon('i3-grid')
                      const logoWiggle = getIdleWiggle(elapsed, idx * 0.5)
                      return raceLogo && (
                        <image href={raceLogo} x={x - 7} y={y - 38} width={14} height={14}
                          transform={`rotate(${logoWiggle})`} transformOrigin={`${x} ${y - 38 + 7}`} />
                      )
                    })()}
                    <text x={x} y={y - 22} textAnchor="middle" fill={de.color} fontSize={11} fontFamily="'Arial Black', sans-serif">
                      {de.name}
                    </text>
                    {/* badge useCase — muncul stagger begitu SAMPAI, bukan nunggu semua avatar selesai */}
                    <g transform={`translate(${trackX1 + 30}, ${y - 12 + badgeY})`} opacity={badgeOpacity}>
                      <rect width={190} height={30} rx={8} fill={`${de.color}18`} stroke={de.color} strokeWidth={1.2} />
                      <text x={10} y={19} fill="#E2E8F0" fontSize={11} fontFamily="sans-serif">
                        {de.useCase[0]} {de.useCase[1]}
                      </text>
                    </g>
                  </g>
                )
              })}
            </g>

            <text x={VW / 2} y={430} textAnchor="middle" fill="#94A3B8" fontSize={17} fontFamily="sans-serif" opacity={answerOpacity}>
              {CLOSING.answer}
            </text>
            <text x={VW / 2} y={460} textAnchor="middle" fill="#475569" fontSize={13} fontFamily="sans-serif" opacity={answerOpacity}>
              (cepat sampai duluan ≠ "menang" — tergantung kebutuhan kamu)
            </text>
          </g>
        )
      })()}

      {/* ── FOOTER CAPTION BAR (hanya saat Act) ── */}
      {stage === 'act' && (
        <g transform="translate(44, 1180)">
          <rect width={732} height={70} rx={16} fill="#090D1A" stroke="#1E293B" strokeWidth={1.5} filter="url(#boxShadow)" />
          <circle cx={35} cy={35} r={5} fill={phase.badgeColor} />
          <text x={55} y={42} fill="#E2E8F0" fontSize={17} fontFamily="sans-serif" fontWeight={500}>
            {captionText}
          </text>
        </g>
      )}
    </svg>
  )
}
