import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import {
  VW, VH, PHASES, STRING_PARTS, ENTITIES, RECIPES, SIMULATION_SCENARIOS
} from './data'

const lerp = (a, b, t) => a + (b - a) * t

export default function FilePermissionAnimation({ 
  paused = false, 
  speed = 1.0, 
  volume = 75, 
  previewSfx = true 
}) {
  const svgRef = useRef(null)
  const timelineRef = useRef(null)
  const sfxCacheRef = useRef({})
  const hasPlayedIntroRef = useRef(false)
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [showIntro, setShowIntro] = useState(true)
  const [morphProgress, setMorphProgress] = useState(0) // 0 = big intro, 1 = small header
  
  // Cyber animation states for Anatomi phase
  const [terminalBoxX, setTerminalBoxX] = useState(-100)
  const [terminalBoxOpacity, setTerminalBoxOpacity] = useState(0)
  const [stringOpacity, setStringOpacity] = useState(0)
  const [entityScale, setEntityScale] = useState(0)
  const [entityOpacity, setEntityOpacity] = useState(0)
  
  const [activeCharHighlight, setActiveCharHighlight] = useState(null)
  const [octalProgress, setOctalProgress] = useState(0) // 0..1 to merge formulas into numbers
  const [simScenarioIdx, setSimScenarioIdx] = useState(0) // 0: owner, 1: group, 2: others
  const [simActionIdx, setSimActionIdx] = useState(0) // 0, 1, 2
  const [capsuleProgress, setCapsuleProgress] = useState(0) // 0 (start) -> 1 (gate impact)
  const [shieldState, setShieldState] = useState('idle') // 'idle', 'granted', 'denied'
  const [recipeIdx, setRecipeIdx] = useState(0)

  const phase = PHASES[phaseIdx]
  const currentScenario = SIMULATION_SCENARIOS[simScenarioIdx] || SIMULATION_SCENARIOS[0]
  const currentAction = currentScenario.actions[simActionIdx] || currentScenario.actions[0]

  const playSfx = (name) => {
    if (typeof window === 'undefined' || !previewSfx) return
    if (!sfxCacheRef.current[name]) {
      sfxCacheRef.current[name] = new Audio(`/audio/sfx/${name}.wav`)
    }
    const audio = sfxCacheRef.current[name]
    audio.volume = (volume / 100) * 0.35
    audio.playbackRate = speed
    audio.currentTime = 0
    audio.play().catch(() => {})
  }

  useEffect(() => {
    const master = gsap.timeline({ repeat: -1, repeatDelay: 1.0 })
    timelineRef.current = master
    window.__animationTimeline = master

    let time = 0

    // ── INTRO PHASE (Hero Thumbnail → Header Morph) ────────────
    const morphObj = { p: 0 }

    // Intro: Show big thumbnail text + play whoosh (0s)
    master.add(() => {
      setShowIntro(true)
      setMorphProgress(0)
      playSfx('whoosh')
    }, time)

    // Morph from big (2-line) thumbnail to small (1-line) header (0.3-1.1s)
    master.to(morphObj, {
      p: 1,
      duration: 0.8,
      ease: 'power3.inOut',
      onUpdate: function() {
        setMorphProgress(morphObj.p)
      }
    }, time + 0.3)

    // Hide intro badge/dots until morph completes
    master.add(() => {
      setShowIntro(false)
    }, time + 1.1)

    time += 1.2 // Fixed: intro duration is 1.2s, not PHASES[0].duration (which was 6.5s)

    // ── PHASE 0: ANATOMI STRING (duration: 6.5s) ────────────
    const p0 = PHASES[0]
    master.add(() => {
      setPhaseIdx(0)
      setActiveCharHighlight(null)
      // Reset cyber states every loop for clean re-entry
      setTerminalBoxX(-100)
      setTerminalBoxOpacity(0)
      setStringOpacity(0)
      setEntityScale(0)
      setEntityOpacity(0)
      playSfx('whoosh')
    }, time)

    // Cyber reveal animations - Fast, dynamic, overlapping
    const terminalAnimObj = { x: -100, opacity: 0 }
    const stringAnimObj = { opacity: 0 }
    const entityAnimObj = { scale: 0, opacity: 0 }
    
    // 1. Terminal box slide-in (0.1-0.7s)
    master.add(() => playSfx('materialize'), time + 0.1)
    master.to(terminalAnimObj, {
      x: 0,
      opacity: 1,
      duration: 0.6,
      ease: 'back.out(1.7)',
      onUpdate: function() {
        setTerminalBoxX(terminalAnimObj.x)
        setTerminalBoxOpacity(terminalAnimObj.opacity)
      }
    }, time + 0.1)

    // 2. String characters fade-in (0.4-0.9s)
    master.add(() => playSfx('typing'), time + 0.4)
    master.to(stringAnimObj, {
      opacity: 1,
      duration: 0.5,
      ease: 'power1.inOut',
      onUpdate: function() {
        setStringOpacity(stringAnimObj.opacity)
      }
    }, time + 0.4)

    // 3. Entity boxes scale + glow (0.7-1.4s)
    master.add(() => playSfx('scan'), time + 0.7)
    master.to(entityAnimObj, {
      scale: 1,
      opacity: 1,
      duration: 0.7,
      ease: 'elastic.out(1, 0.5)',
      onUpdate: function() {
        setEntityScale(entityAnimObj.scale)
        setEntityOpacity(entityAnimObj.opacity)
      }
    }, time + 0.7)

    // Highlight Type (-) after reveal
    master.add(() => { setActiveCharHighlight(0); playSfx('click') }, time + 1.0)
    // Highlight Owner (rwx)
    master.add(() => { setActiveCharHighlight('owner'); playSfx('click') }, time + 2.4)
    // Highlight Group (r-x)
    master.add(() => { setActiveCharHighlight('group'); playSfx('click') }, time + 3.8)
    // Highlight Others (r--)
    master.add(() => { setActiveCharHighlight('others'); playSfx('click') }, time + 5.0)

    time += p0.duration

    // ── PHASE 1: MATEMATIKA BOBOT 4-2-1 (duration: 7.5s) ────
    const p1 = PHASES[1]
    master.add(() => {
      setPhaseIdx(1)
      setActiveCharHighlight(null)
      setOctalProgress(0)
      playSfx('whoosh')
    }, time)

    // Progressive octal calculation reveal
    master.to({ p: 0 }, {
      p: 1,
      duration: 3.5,
      ease: 'power2.out',
      onUpdate: function() {
        setOctalProgress(this.targets()[0].p)
      }
    }, time + 1.8)
    master.add(() => playSfx('typing'), time + 1.8)
    master.add(() => playSfx('success'), time + 5.3)

    time += p1.duration

    // ── PHASE 2: ARENA SECURITY GATE SIMULATION (duration: 9.0s) ──
    const p2 = PHASES[2]
    master.add(() => {
      setPhaseIdx(2)
      setSimScenarioIdx(0)
      setSimActionIdx(0)
      setCapsuleProgress(0)
      setShieldState('idle')
      playSfx('whoosh')
    }, time)

    // Helper for firing action capsules in simulation
    const runSimAction = (scenarioIdx, actionIdx, startTime, isAllowed) => {
      master.add(() => {
        setSimScenarioIdx(scenarioIdx)
        setSimActionIdx(actionIdx)
        setCapsuleProgress(0)
        setShieldState('idle')
        playSfx('whoosh')
      }, startTime)

      // Animate Capsule flying from left to gate
      master.to({ p: 0 }, {
        p: 1,
        duration: 0.6,
        ease: 'power2.inOut',
        onUpdate: function() {
          setCapsuleProgress(this.targets()[0].p)
        }
      }, startTime + 0.1)

      // Impact on gate: Granted or Denied
      master.add(() => {
        setShieldState(isAllowed ? 'granted' : 'denied')
        playSfx(isAllowed ? 'success' : 'error')
      }, startTime + 0.7)
    }

    // Owner (u): 7 -> tests READ (allow) then WRITE (allow)
    runSimAction(0, 0, time + 0.2, true)  // Owner Read
    runSimAction(0, 1, time + 1.5, true)  // Owner Write

    // Group (g): 5 -> tests READ (allow) then WRITE (blocked!)
    runSimAction(1, 0, time + 3.1, true)  // Group Read
    runSimAction(1, 1, time + 4.4, false) // Group Write Blocked!

    // Others (o): 4 -> tests WRITE (blocked!) then EXEC (blocked!)
    runSimAction(2, 1, time + 6.0, false) // Others Write Blocked!
    runSimAction(2, 2, time + 7.4, false) // Others Exec Blocked!

    time += p2.duration

    // ── PHASE 3: CHEAT SHEET & DANGER 777 (duration: 7.0s) ──
    const p3 = PHASES[3]
    master.add(() => {
      setPhaseIdx(3)
      setRecipeIdx(0)
      playSfx('whoosh')
    }, time)

    master.add(() => { setRecipeIdx(1); playSfx('materialize') }, time + 1.6)
    master.add(() => { setRecipeIdx(2); playSfx('materialize') }, time + 3.2)
    master.add(() => { setRecipeIdx(3); playSfx('warning') }, time + 4.8) // 777 alert

    time += p3.duration

    return () => {
      master.kill()
      if (window.__animationTimeline === master) {
        delete window.__animationTimeline
      }
    }
  }, [])

  // Apply speed changes
  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.timeScale(speed)
    }
  }, [speed])

  // Handle Pause / Resume without restarting
  useEffect(() => {
    if (!timelineRef.current) return
    if (paused) {
      timelineRef.current.pause()
    } else {
      timelineRef.current.resume()
    }
  }, [paused])

  // Capsule interpolated X coordinate
  const startCapX = 180
  const endCapX = 540
  const currentCapX = startCapX + (endCapX - startCapX) * capsuleProgress

  return (
    <svg ref={svgRef} viewBox={`0 0 ${VW} ${VH}`}
      style={{
        width: '100%',
        height: '100%',
        maxHeight: '100vh',
        maxWidth: `calc(100vh * ${VW} / ${VH})`,
        background: '#070913',
        userSelect: 'none'
      }}>

      <defs>
        {/* Glow Filters */}
        <filter id="neonGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="15" result="blur2" />
          <feMerge>
            <feMergeNode in="blur2" />
            <feMergeNode in="blur1" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="shieldGlowGreen" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="shieldGlowRed" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="12" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>

        <filter id="boxShadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="12" stdDeviation="16" floodColor="#000000" floodOpacity="0.6" />
        </filter>

        {/* Gradients */}
        <linearGradient id="headerGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#2CD1A8" />
          <stop offset="100%" stopColor="#38BCF8" />
        </linearGradient>

        <linearGradient id="dangerGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#4C0519" />
          <stop offset="100%" stopColor="#881337" />
        </linearGradient>

        <linearGradient id="laserGrad" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#38BDF8" stopOpacity="0.2" />
          <stop offset="50%" stopColor="#38BDF8" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#38BDF8" stopOpacity="0.2" />
        </linearGradient>
      </defs>

      {/* Background Grid Pattern */}
      <g opacity={0.07}>
        {Array.from({ length: 22 }).map((_, i) => (
          <line key={`vg-${i}`} x1={i * 40} y1={0} x2={i * 40} y2={VH} stroke="#38BDF8" strokeWidth={1} />
        ))}
        {Array.from({ length: 34 }).map((_, i) => (
          <line key={`hg-${i}`} x1={0} y1={i * 40} x2={VW} y2={i * 40} stroke="#38BDF8" strokeWidth={1} />
        ))}
      </g>

      {/* ── HEADER SECTION (Hero Thumbnail → Header Morph) ───── */}
      <g id="header-layer">
        {/* Interpolated layout values: p=0 (big centered) → p=1 (small left-aligned) */}
        {(() => {
          const p = morphProgress
          const taglineY = lerp(540, 30, p)
          const taglineFont = lerp(24, 16, p)
          
          // Width estimation for centering in frame 0
          const fileThumbW = 100 * 2.8
          const permThumbW = 100 * 6.5
          const subThumbW = 26 * 25
          const fileHeadW = 52 * 2.8

          // X interpolation: start centered, end left-aligned
          const fileX = lerp((VW / 2) - (fileThumbW / 2), 44, p)
          const fileY = lerp(620, 80, p)
          const fileFont = lerp(100, 52, p)
          
          const permX = lerp((VW / 2) - (permThumbW / 2), 44 + fileHeadW + 20, p)
          const permY = lerp(740, 80, p)
          const permFont = lerp(100, 52, p)
          
          const subX = lerp((VW / 2) - (subThumbW / 2), 44, p)
          const subY = lerp(845, 115, p)
          const subFont = lerp(26, 18, p)

          return (
            <>
              <text x={VW / 2} y={taglineY} textAnchor="middle" fill="#64748B" fontSize={taglineFont} fontFamily="monospace" letterSpacing={3}>
                LINUX GUIDE · <tspan fill="#38BCF8" fontWeight={700}>ADIB-DEV.COM</tspan>
              </text>

              <text x={fileX} y={fileY} textAnchor="start" fill="url(#headerGrad)"
                fontSize={fileFont} fontFamily="'Arial Black', Impact, sans-serif" fontWeight={900} letterSpacing={1}>
                FILE
              </text>

              <text x={permX} y={permY} textAnchor="start" fill="url(#headerGrad)"
                fontSize={permFont} fontFamily="'Arial Black', Impact, sans-serif" fontWeight={900} letterSpacing={1}>
                PERMISSIONS
              </text>

              <text x={subX} y={subY} textAnchor="start" fill="#94A3B8" fontSize={subFont} fontFamily="sans-serif" fontWeight={500}>
                Rahasia Di Balik <tspan fill="#2CD1A8" fontFamily="monospace" fontWeight={700}>-rwxr-xr--</tspan> dan <tspan fill="#38BCF8" fontFamily="monospace" fontWeight={700}>chmod 754</tspan>
              </text>
            </>
          )
        })()}
      </g>

      {/* ── PHASE BADGE & STATUS BAR ───────────────────────── */}
      {!showIntro && (
      <g transform="translate(44, 210)">
        <rect x={0} y={0} width={340} height={40} rx={20}
          fill="#0F172A" stroke={phase.badgeColor} strokeWidth={1.8} filter="url(#boxShadow)" />
        <circle cx={22} cy={20} r={6} fill={phase.badgeColor} />
        <text x={40} y={25} fill={phase.badgeColor} fontSize={15} fontFamily="monospace" fontWeight={700} letterSpacing={1}>
          {phase.badge}
        </text>

        {/* Step Indicator (4 Dots) */}
        <g transform="translate(640, 12)">
          {PHASES.map((p, i) => (
            <circle
              key={p.id}
              cx={i * 24}
              cy={8}
              r={i === phaseIdx ? 6.5 : 4}
              fill={i === phaseIdx ? phase.badgeColor : '#334155'}
              stroke={i === phaseIdx ? '#ffffff' : 'none'}
              strokeWidth={1.5}
            />
          ))}
        </g>
      </g>
      )}

      {/* ═══════════════════════════════════════════════════════
          ACT 1: ANATOMI STRING PERMISSION (-rwxr-xr--)
          ═══════════════════════════════════════════════════════ */}
      {phaseIdx === 0 && !showIntro && (
        <g transform="translate(0, 290)">
          {/* Terminal Command Box - Cyber slide-in animation */}
          <g transform={`translate(${44 + terminalBoxX}, 0)`} opacity={terminalBoxOpacity}>
            <rect width={732} height={120} rx={14} fill="#090D1A" stroke="#1E293B" strokeWidth={2} filter="url(#boxShadow)" />
            <rect width={732} height={32} rx={14} fill="#0F172A" />
            <circle cx={20} cy={16} r={5} fill="#EF4444" />
            <circle cx={38} cy={16} r={5} fill="#F59E0B" />
            <circle cx={56} cy={16} r={5} fill="#10B981" />
            <text x={80} y={20} fill="#64748B" fontSize={13} fontFamily="monospace">bash — 80×24</text>

            {/* String display with typing fade-in */}
            <text x={30} y={75} fill="#94A3B8" fontSize={20} fontFamily="monospace" opacity={stringOpacity}>
              $ <tspan fill="#38BDF8">ls -l</tspan> report.sh
            </text>
          </g>

          {/* Large Interactive String Breakdown - typing fade-in */}
          <g transform="translate(44, 150)" opacity={stringOpacity}>
            <rect width={732} height={130} rx={16} fill="#0B1120" stroke="#334155" strokeWidth={1.5} />

            {STRING_PARTS.map((sp, idx) => {
              const charX = 50 + idx * 68
              const isType = idx === 0
              const isOwner = idx >= 1 && idx <= 3
              const isGroup = idx >= 4 && idx <= 6
              const isOthers = idx >= 7 && idx <= 9

              let isHighlighted = false
              if (activeCharHighlight === 0 && isType) isHighlighted = true
              if (activeCharHighlight === 'owner' && isOwner) isHighlighted = true
              if (activeCharHighlight === 'group' && isGroup) isHighlighted = true
              if (activeCharHighlight === 'others' && isOthers) isHighlighted = true

              const charColor = isHighlighted ? (isType ? '#FBBF24' : isOwner ? '#C084FC' : isGroup ? '#38BDF8' : '#94A3B8') : sp.color

              return (
                <g key={`sp-${idx}`} transform={`translate(${charX}, 65)`}>
                  {isHighlighted && (
                    <rect x={-26} y={-45} width={52} height={90} rx={10}
                      fill={charColor} fillOpacity={0.18} stroke={charColor} strokeWidth={2} filter="url(#neonGlow)" />
                  )}
                  <text textAnchor="middle" y={14} fill={charColor}
                    fontSize={44} fontFamily="monospace" fontWeight={800}>
                    {sp.char}
                  </text>
                  <text textAnchor="middle" y={38} fill={isHighlighted ? '#FFFFFF' : '#475569'}
                    fontSize={11} fontFamily="monospace">
                    {idx}
                  </text>
                </g>
              )
            })}
          </g>

          {/* 3 Triad Segment Cards - scale + glow cyber reveal */}
          <g
            transform={`translate(44, 320) scale(${entityScale})`}
            opacity={entityOpacity}
            style={{ transformOrigin: '366px 125px' }}
          >
            {/* Group 1: OWNER */}
            <g transform="translate(0, 0)">
              <rect width={230} height={250} rx={16}
                fill={activeCharHighlight === 'owner' ? '#2E1065' : '#0B1120'}
                stroke={activeCharHighlight === 'owner' ? '#C084FC' : '#1E293B'}
                strokeWidth={activeCharHighlight === 'owner' ? 2.5 : 1}
                filter="url(#boxShadow)" />
              
              <rect x={16} y={16} width={80} height={28} rx={14} fill="#581C87" />
              <text x={56} y={35} textAnchor="middle" fill="#E9D5FF" fontSize={13} fontFamily="monospace" fontWeight={700}>
                POS 1-3
              </text>

              <text x={115} y={85} textAnchor="middle" fill="#C084FC" fontSize={26} fontFamily="'Arial Black', sans-serif">
                OWNER (u)
              </text>
              <text x={115} y={112} textAnchor="middle" fill="#DDD6FE" fontSize={14} fontFamily="sans-serif">
                Pemilik / Pembuat File
              </text>

              <rect x={35} y={135} width={160} height={48} rx={10} fill="#1E1B4B" />
              <text x={115} y={168} textAnchor="middle" fill="#A855F7" fontSize={28} fontFamily="monospace" fontWeight={900} letterSpacing={6}>
                r w x
              </text>

              <text x={115} y={215} textAnchor="middle" fill="#A78BFA" fontSize={13} fontFamily="monospace">
                Full Akses (Read/Write/Exec)
              </text>
            </g>

            {/* Group 2: GROUP */}
            <g transform="translate(251, 0)">
              <rect width={230} height={250} rx={16}
                fill={activeCharHighlight === 'group' ? '#082F49' : '#0B1120'}
                stroke={activeCharHighlight === 'group' ? '#38BDF8' : '#1E293B'}
                strokeWidth={activeCharHighlight === 'group' ? 2.5 : 1}
                filter="url(#boxShadow)" />

              <rect x={16} y={16} width={80} height={28} rx={14} fill="#075985" />
              <text x={56} y={35} textAnchor="middle" fill="#BAE6FD" fontSize={13} fontFamily="monospace" fontWeight={700}>
                POS 4-6
              </text>

              <text x={115} y={85} textAnchor="middle" fill="#38BDF8" fontSize={26} fontFamily="'Arial Black', sans-serif">
                GROUP (g)
              </text>
              <text x={115} y={112} textAnchor="middle" fill="#BAE6FD" fontSize={14} fontFamily="sans-serif">
                Anggota Tim / Grup
              </text>

              <rect x={35} y={135} width={160} height={48} rx={10} fill="#083344" />
              <text x={115} y={168} textAnchor="middle" fill="#38BDF8" fontSize={28} fontFamily="monospace" fontWeight={900} letterSpacing={6}>
                r - x
              </text>

              <text x={115} y={215} textAnchor="middle" fill="#7DD3FC" fontSize={13} fontFamily="monospace">
                Bisa Baca & Run (No Edit)
              </text>
            </g>

            {/* Group 3: OTHERS */}
            <g transform="translate(502, 0)">
              <rect width={230} height={250} rx={16}
                fill={activeCharHighlight === 'others' ? '#1E293B' : '#0B1120'}
                stroke={activeCharHighlight === 'others' ? '#94A3B8' : '#1E293B'}
                strokeWidth={activeCharHighlight === 'others' ? 2.5 : 1}
                filter="url(#boxShadow)" />

              <rect x={16} y={16} width={80} height={28} rx={14} fill="#334155" />
              <text x={56} y={35} textAnchor="middle" fill="#CBD5E1" fontSize={13} fontFamily="monospace" fontWeight={700}>
                POS 7-9
              </text>

              <text x={115} y={85} textAnchor="middle" fill="#94A3B8" fontSize={26} fontFamily="'Arial Black', sans-serif">
                OTHERS (o)
              </text>
              <text x={115} y={112} textAnchor="middle" fill="#CBD5E1" fontSize={14} fontFamily="sans-serif">
                Orang Lain / Publik
              </text>

              <rect x={35} y={135} width={160} height={48} rx={10} fill="#0F172A" />
              <text x={115} y={168} textAnchor="middle" fill="#94A3B8" fontSize={28} fontFamily="monospace" fontWeight={900} letterSpacing={6}>
                r - -
              </text>

              <text x={115} y={215} textAnchor="middle" fill="#94A3B8" fontSize={13} fontFamily="monospace">
                Cuma Bisa Baca (ReadOnly)
              </text>
            </g>
          </g>

          {/* Educational Callout */}
          <g transform="translate(44, 600)">
            <rect width={732} height={80} rx={12} fill="#0F172A" stroke="#334155" strokeWidth={1} />
            <text x={40} y={36} fill="#FBBF24" fontSize={18} fontFamily="monospace" fontWeight={700}>
              💡 TIPS:
            </text>
            <text x={40} y={62} fill="#E2E8F0" fontSize={16} fontFamily="sans-serif">
              Huruf pertama adalah tipe (<tspan fill="#FBBF24" fontFamily="monospace">-</tspan>=file, <tspan fill="#38BDF8" fontFamily="monospace">d</tspan>=folder/directory). 9 huruf berikutnya adalah izin akses.
            </text>
          </g>
        </g>
      )}

      {/* ═══════════════════════════════════════════════════════
          ACT 2: MATEMATIKA BOBOT (4-2-1) & CHMOD CALCULATION
          ═══════════════════════════════════════════════════════ */}
      {phaseIdx === 1 && (
        <g transform="translate(0, 280)">
          {/* Universal Weight Rule Banner */}
          <g transform="translate(44, 0)">
            <rect width={732} height={100} rx={14} fill="#0B1120" stroke="#FBBF24" strokeWidth={1.5} filter="url(#boxShadow)" />
            <text x={366} y={35} textAnchor="middle" fill="#FBBF24" fontSize={16} fontFamily="monospace" fontWeight={700} letterSpacing={2}>
              RUMUS EMAS BOBOT NILAI (BINER KE OKTAL)
            </text>

            <g transform="translate(90, 50)">
              <rect x={0} y={0} width={150} height={36} rx={8} fill="#075985" />
              <text x={75} y={24} textAnchor="middle" fill="#38BDF8" fontSize={16} fontFamily="monospace" fontWeight={800}>
                r (Read) = 4
              </text>

              <rect x={195} y={0} width={150} height={36} rx={8} fill="#064E3B" />
              <text x={270} y={24} textAnchor="middle" fill="#34D399" fontSize={16} fontFamily="monospace" fontWeight={800}>
                w (Write) = 2
              </text>

              <rect x={390} y={0} width={150} height={36} rx={8} fill="#831843" />
              <text x={465} y={24} textAnchor="middle" fill="#F472B6" fontSize={16} fontFamily="monospace" fontWeight={800}>
                x (Exec) = 1
              </text>
            </g>
          </g>

          {/* 3 Calculation Columns */}
          <g transform="translate(44, 130)">
            {ENTITIES.map((ent, idx) => {
              const colX = idx * 251

              return (
                <g key={`calc-${ent.id}`} transform={`translate(${colX}, 0)`}>
                  <rect width={230} height={340} rx={16} fill={ent.bg} stroke={ent.border} strokeWidth={2} filter="url(#boxShadow)" />
                  
                  <text x={115} y={40} textAnchor="middle" fill={ent.color} fontSize={22} fontFamily="'Arial Black', sans-serif">
                    {ent.name.split(' ')[0]}
                  </text>
                  <text x={115} y={62} textAnchor="middle" fill="#94A3B8" fontSize={13} fontFamily="monospace">
                    Kode: {ent.code}
                  </text>

                  <rect x={30} y={80} width={170} height={50} rx={10} fill="#030712" />
                  <text x={115} y={115} textAnchor="middle" fill="#FFFFFF" fontSize={30} fontFamily="monospace" fontWeight={900} letterSpacing={8}>
                    {ent.chars.join(' ')}
                  </text>

                  <g transform="translate(0, 160)">
                    {ent.chars.map((ch, ci) => {
                      const val = ent.weights[ci]
                      const isZero = val === 0
                      return (
                        <g key={`eq-${ci}`} transform={`translate(40, ${ci * 34})`}>
                          <text x={0} y={20} fill={isZero ? '#475569' : ent.color} fontSize={18} fontFamily="monospace" fontWeight={700}>
                            {ch} = {val}
                          </text>
                          <text x={110} y={20} fill="#64748B" fontSize={14} fontFamily="sans-serif">
                            ({ci === 0 ? 'Read' : ci === 1 ? 'Write' : 'Exec'})
                          </text>
                        </g>
                      )
                    })}
                  </g>

                  <line x1={30} y1={270} x2={200} y2={270} stroke={ent.color} strokeWidth={2} strokeDasharray="4,4" />

                  <text x={115} y={310} textAnchor="middle" fill={ent.color} fontSize={40} fontFamily="monospace" fontWeight={900} filter="url(#neonGlow)">
                    {octalProgress > 0.5 ? ent.sum : ent.sumFormula}
                  </text>
                </g>
              )
            })}
          </g>

          {/* Final Chmod Command Result */}
          <g transform="translate(44, 500)">
            <rect width={732} height={150} rx={18} fill="#0B1120" stroke="#10B981" strokeWidth={2.5} filter="url(#boxShadow)" />
            
            <text x={366} y={45} textAnchor="middle" fill="#6EE7B7" fontSize={16} fontFamily="monospace" letterSpacing={3}>
              HASIL PENGGABUNGAN 3 DIGIT OKTAL
            </text>

            <g transform="translate(85, 70)">
              <text x={0} y={45} fill="#94A3B8" fontSize={48} fontFamily="monospace" fontWeight={800}>
                $ chmod
              </text>
              <text x={245} y={45} fill="#A855F7" fontSize={56} fontFamily="monospace" fontWeight={900}>
                7
              </text>
              <text x={290} y={45} fill="#38BDF8" fontSize={56} fontFamily="monospace" fontWeight={900}>
                5
              </text>
              <text x={335} y={45} fill="#94A3B8" fontSize={56} fontFamily="monospace" fontWeight={900}>
                4
              </text>
              <text x={395} y={45} fill="#34D399" fontSize={42} fontFamily="monospace" fontWeight={700}>
                file.sh
              </text>
            </g>
          </g>
        </g>
      )}

      {/* ═══════════════════════════════════════════════════════
          ACT 3: SECURITY GATE SIMULATION (-rwxr-xr--)
          ═══════════════════════════════════════════════════════ */}
      {phaseIdx === 2 && (
        <g transform="translate(0, 270)">
          {/* Top Scenario Switcher HUD */}
          <g transform="translate(44, 0)">
            <rect width={732} height={70} rx={14} fill="#090D1A" stroke="#1E293B" strokeWidth={1.5} filter="url(#boxShadow)" />
            
            {SIMULATION_SCENARIOS.map((sc, i) => {
              const isSelected = simScenarioIdx === i
              const tabX = 15 + i * 238

              return (
                <g key={`tab-${sc.entityId}`} transform={`translate(${tabX}, 10)`}>
                  <rect width={226} height={50} rx={10}
                    fill={isSelected ? sc.actorBg : '#030712'}
                    stroke={isSelected ? sc.actorColor : '#334155'}
                    strokeWidth={isSelected ? 2 : 1} />
                  <text x={113} y={32} textAnchor="middle"
                    fill={isSelected ? sc.actorColor : '#64748B'}
                    fontSize={15} fontFamily="monospace" fontWeight={800}>
                    {sc.actorLabel} [{sc.permOctal}]
                  </text>
                </g>
              )
            })}
          </g>

          {/* Arena Interactive Stage */}
          <g transform="translate(44, 90)">
            <rect width={732} height={460} rx={20} fill="#0B1120" stroke="#1E293B" strokeWidth={2} filter="url(#boxShadow)" />

            {/* Sub-header Banner */}
            <text x={366} y={38} textAnchor="middle" fill="#94A3B8" fontSize={15} fontFamily="monospace" letterSpacing={2}>
              SECURITY GATEWAY EVALUATION (-rwxr-xr--)
            </text>

            {/* Left Box: Active Actor */}
            <g transform="translate(30, 65)">
              <rect width={210} height={250} rx={16}
                fill={currentScenario.actorBg} stroke={currentScenario.actorBorder} strokeWidth={2} />
              
              <circle cx={105} cy={60} r={34} fill={currentScenario.actorColor} opacity={0.2} />
              <text x={105} y={72} textAnchor="middle" fill={currentScenario.actorColor} fontSize={32} fontWeight={900}>
                {currentScenario.entityId === 'owner' ? 'U' : currentScenario.entityId === 'group' ? 'G' : 'O'}
              </text>

              <text x={105} y={125} textAnchor="middle" fill="#FFFFFF" fontSize={18} fontFamily="'Arial Black', sans-serif">
                {currentScenario.actorLabel}
              </text>
              <text x={105} y={150} textAnchor="middle" fill="#94A3B8" fontSize={12} fontFamily="sans-serif">
                {currentScenario.actorRole}
              </text>

              <rect x={25} y={175} width={160} height={44} rx={10} fill="#030712" />
              <text x={105} y={204} textAnchor="middle" fill={currentScenario.actorColor} fontSize={20} fontFamily="monospace" fontWeight={900} letterSpacing={3}>
                {currentScenario.permString} ({currentScenario.permOctal})
              </text>
            </g>

            {/* Center: Laser Pathway */}
            <g transform="translate(240, 185)">
              <line x1={0} y1={0} x2={270} y2={0} stroke="url(#laserGrad)" strokeWidth={3} strokeDasharray="6,6" />
              <text x={135} y={-14} textAnchor="middle" fill="#64748B" fontSize={12} fontFamily="monospace">
                OPERATIONAL STREAM
              </text>
            </g>

            {/* Moving Action Capsule */}
            <g transform={`translate(${currentCapX}, 185)`}>
              <rect x={-55} y={-30} width={110} height={60} rx={12}
                fill="#0F172A" stroke={currentAction.allowed ? '#34D399' : '#F43F5E'} strokeWidth={2} filter="url(#boxShadow)" />
              <text x={0} y={-6} textAnchor="middle" fill="#FFFFFF" fontSize={12} fontFamily="monospace" fontWeight={700}>
                ACTION
              </text>
              <text x={0} y={16} textAnchor="middle"
                fill={currentAction.allowed ? '#34D399' : '#F43F5E'}
                fontSize={15} fontFamily="monospace" fontWeight={900}>
                {currentAction.type}
              </text>
            </g>

            {/* Right: Target File Core & Security Shield */}
            <g transform="translate(510, 65)">
              <rect width={190} height={250} rx={16} fill="#090D1A" stroke="#38BDF8" strokeWidth={1.8} />

              {/* Security Shield Overlay */}
              <rect x={-8} y={-8} width={206} height={266} rx={20}
                fill="none"
                stroke={shieldState === 'granted' ? '#34D399' : shieldState === 'denied' ? '#F43F5E' : '#334155'}
                strokeWidth={shieldState !== 'idle' ? 4 : 1.5}
                strokeDasharray={shieldState === 'idle' ? '5,5' : 'none'}
                filter={shieldState === 'granted' ? 'url(#shieldGlowGreen)' : shieldState === 'denied' ? 'url(#shieldGlowRed)' : 'none'}
              />

              {/* Target File Icon */}
              <g transform="translate(70, 25)">
                <rect width={50} height={65} rx={6} fill="#1E293B" stroke="#38BDF8" strokeWidth={2} />
                <path d="M 32 0 L 50 18 L 32 18 Z" fill="#38BDF8" />
                <line x1={10} y1={28} x2={35} y2={28} stroke="#64748B" strokeWidth={2} />
                <line x1={10} y1={40} x2={40} y2={40} stroke="#64748B" strokeWidth={2} />
              </g>

              <text x={95} y={115} textAnchor="middle" fill="#FFFFFF" fontSize={18} fontFamily="'Arial Black', sans-serif">
                report.sh
              </text>

              {/* Live Gate Status Indicator */}
              <rect x={20} y={135} width={150} height={42} rx={8}
                fill={shieldState === 'granted' ? '#064E3B' : shieldState === 'denied' ? '#4C0519' : '#0F172A'}
                stroke={shieldState === 'granted' ? '#34D399' : shieldState === 'denied' ? '#F43F5E' : '#334155'}
                strokeWidth={1.5} />
              
              <text x={95} y={162} textAnchor="middle"
                fill={shieldState === 'granted' ? '#34D399' : shieldState === 'denied' ? '#F43F5E' : '#94A3B8'}
                fontSize={13} fontFamily="monospace" fontWeight={800}>
                {shieldState === 'granted' ? '🔓 GRANTED (✓)' : shieldState === 'denied' ? '🔒 BLOCKED (✕)' : '🛡️ EVALUATING...'}
              </text>

              <text x={95} y={205} textAnchor="middle" fill="#64748B" fontSize={11} fontFamily="monospace">
                Checked Bit:
              </text>
              <text x={95} y={225} textAnchor="middle"
                fill={currentAction.allowed ? '#34D399' : '#F43F5E'}
                fontSize={14} fontFamily="monospace" fontWeight={800}>
                {currentAction.bit}
              </text>
            </g>

            {/* Bottom Live Terminal Command & Status HUD */}
            <g transform="translate(30, 335)">
              <rect width={672} height={100} rx={12} fill="#050811" stroke="#1E293B" strokeWidth={1.5} />
              
              {/* Prompt line */}
              <text x={24} y={35} fill="#94A3B8" fontSize={18} fontFamily="monospace">
                Prompt: <tspan fill="#38BDF8" fontWeight={700}>{currentAction.cmd}</tspan>
              </text>

              {/* OS Evaluation result line */}
              <text x={24} y={72}
                fill={currentAction.allowed ? '#34D399' : '#F43F5E'}
                fontSize={16} fontFamily="monospace" fontWeight={700}>
                Kernel: {currentAction.response}
              </text>
            </g>
          </g>

          {/* Action List Selector Pills at bottom */}
          <g transform="translate(44, 570)">
            <rect width={732} height={70} rx={14} fill="#090D1A" stroke="#1E293B" strokeWidth={1.5} />
            <text x={30} y={40} fill="#94A3B8" fontSize={14} fontFamily="monospace" fontWeight={700}>
              AKSI AKTIF:
            </text>
            
            {currentScenario.actions.map((act, ai) => {
              const isActSelected = simActionIdx === ai
              const btnX = 140 + ai * 190

              return (
                <g key={`act-btn-${act.id}`} transform={`translate(${btnX}, 14)`}>
                  <rect width={175} height={42} rx={8}
                    fill={isActSelected ? (act.allowed ? '#064E3B' : '#4C0519') : '#0F172A'}
                    stroke={isActSelected ? (act.allowed ? '#34D399' : '#F43F5E') : '#334155'}
                    strokeWidth={isActSelected ? 2 : 1} />
                  <text x={87} y={26} textAnchor="middle"
                    fill={isActSelected ? '#FFFFFF' : '#64748B'}
                    fontSize={13} fontFamily="monospace" fontWeight={700}>
                    {act.label} {act.allowed ? '✓' : '✕'}
                  </text>
                </g>
              )
            })}
          </g>
        </g>
      )}

      {/* ═══════════════════════════════════════════════════════
          ACT 4: RECIPES & DANGER 777
          ═══════════════════════════════════════════════════════ */}
      {phaseIdx === 3 && (() => {
        const curRecipe = RECIPES[recipeIdx] || RECIPES[0]
        const isHazard = !curRecipe.safe

        return (
          <g transform="translate(0, 270)">
            {/* Top 4 Recipe Switcher Navigation Tabs */}
            <g transform="translate(44, 0)">
              <rect width={732} height={64} rx={14} fill="#090D1A" stroke="#1E293B" strokeWidth={1.5} filter="url(#boxShadow)" />
              
              {RECIPES.map((rec, i) => {
                const isSelected = recipeIdx === i
                const tabW = 172
                const tabX = 12 + i * 180

                return (
                  <g key={`rectab-${rec.mode}`} transform={`translate(${tabX}, 8)`}>
                    <rect width={tabW} height={48} rx={10}
                      fill={isSelected ? rec.bg : '#030712'}
                      stroke={isSelected ? rec.color : '#334155'}
                      strokeWidth={isSelected ? 2 : 1} />
                    <text x={tabW / 2} y={30} textAnchor="middle"
                      fill={isSelected ? rec.color : '#64748B'}
                      fontSize={16} fontFamily="monospace" fontWeight={900}>
                      {rec.mode} {rec.safe ? '' : '⚠️'}
                    </text>
                  </g>
                )
              })}
            </g>

            {/* Central Spotlight Showcase Card */}
            <g transform="translate(44, 80)">
              <rect width={732} height={420} rx={20}
                fill={isHazard ? 'url(#dangerGrad)' : curRecipe.bg}
                stroke={curRecipe.border}
                strokeWidth={isHazard ? 3 : 2}
                filter="url(#boxShadow)" />

              {/* Hazard Alert Banner (Only for 777) */}
              {isHazard && (
                <g transform="translate(0, 0)">
                  <rect width={732} height={36} rx={20} fill="#E11D48" />
                  <text x={366} y={24} textAnchor="middle" fill="#FFFFFF" fontSize={14} fontFamily="monospace" fontWeight={900} letterSpacing={2}>
                    ⚠️ CRITICAL SECURITY WARNING · DO NOT USE ON PRODUCTION
                  </text>
                </g>
              )}

              {/* Header Box within card */}
              <g transform="translate(30, 45)">
                {/* Big Octal Badge */}
                <rect width={160} height={100} rx={14} fill="#030712" stroke={curRecipe.color} strokeWidth={2} />
                <text x={80} y={64} textAnchor="middle" fill={curRecipe.color}
                  fontSize={52} fontFamily="monospace" fontWeight={900} filter="url(#neonGlow)">
                  {curRecipe.mode}
                </text>
                <text x={80} y={88} textAnchor="middle" fill="#94A3B8" fontSize={13} fontFamily="monospace">
                  {curRecipe.octal}
                </text>

                {/* Title & Real-World Metaphor */}
                <g transform="translate(180, 15)">
                  <rect x={0} y={0} width={200} height={28} rx={14}
                    fill={isHazard ? '#881337' : '#030712'} stroke={curRecipe.color} strokeWidth={1.2} />
                  <text x={100} y={19} textAnchor="middle" fill={curRecipe.color} fontSize={12} fontFamily="monospace" fontWeight={800}>
                    {curRecipe.badgeText}
                  </text>

                  <text x={0} y={55} fill="#FFFFFF" fontSize={26} fontFamily="'Arial Black', sans-serif">
                    {curRecipe.title}
                  </text>
                  <text x={0} y={80} fill={isHazard ? '#FECDD3' : '#BAE6FD'} fontSize={15} fontFamily="sans-serif" fontWeight={500}>
                    Analogi: {curRecipe.metaphor}
                  </text>
                </g>
              </g>

              {/* 3 Pillars Access Level Gauge */}
              <g transform="translate(30, 165)">
                <rect width={672} height={130} rx={14} fill="#050811" stroke="#1E293B" strokeWidth={1.5} />
                
                <text x={25} y={28} fill="#64748B" fontSize={12} fontFamily="monospace" fontWeight={700} letterSpacing={1}>
                  DISTRIBUSI HAK AKSES TRIAD (u / g / o):
                </text>

                <g transform="translate(20, 42)">
                  {curRecipe.triads.map((tri, ti) => {
                    const pillX = ti * 215
                    return (
                      <g key={`triad-${ti}`} transform={`translate(${pillX}, 0)`}>
                        <rect width={200} height={68} rx={10}
                          fill={tri.allowed ? (isHazard ? '#4C0519' : '#0F172A') : '#030712'}
                          stroke={tri.allowed ? tri.color : '#334155'}
                          strokeWidth={1.5} />
                        
                        <text x={16} y={26} fill={tri.color} fontSize={14} fontFamily="monospace" fontWeight={800}>
                          {tri.role}
                        </text>
                        <text x={184} y={26} textAnchor="end" fill="#FFFFFF" fontSize={16} fontFamily="monospace" fontWeight={900}>
                          {tri.perm} ({tri.val})
                        </text>

                        <text x={16} y={52} fill={tri.allowed ? '#E2E8F0' : '#64748B'} fontSize={12} fontFamily="sans-serif">
                          {tri.desc}
                        </text>
                      </g>
                    )
                  })}
                </g>
              </g>

              {/* Practical Use Case & Real Command Terminal */}
              <g transform="translate(30, 310)">
                <rect width={672} height={90} rx={12} fill="#020408" stroke="#1E293B" strokeWidth={1.5} />
                
                <text x={20} y={32} fill="#94A3B8" fontSize={16} fontFamily="monospace">
                  Perintah: <tspan fill={curRecipe.color} fontWeight={800}>{curRecipe.cmd}</tspan>
                </text>

                <text x={20} y={64} fill="#E2E8F0" fontSize={14} fontFamily="sans-serif">
                  Fungsi: {curRecipe.useCase}
                </text>
              </g>
            </g>

            {/* Bottom Golden Security Rule Banner */}
            <g transform="translate(44, 520)">
              <rect width={732} height={120} rx={16}
                fill="#090D1A" stroke={isHazard ? '#F43F5E' : '#FBBF24'} strokeWidth={2} filter="url(#boxShadow)" />
              
              <text x={35} y={40} fill={isHazard ? '#F43F5E' : '#FBBF24'} fontSize={18} fontFamily="monospace" fontWeight={900}>
                {isHazard ? '🚨 GOLDEN RULE: HINDARI 777!' : '💡 REKOMENDASI STANDAR LINUX:'}
              </text>

              <text x={35} y={72} fill="#FFFFFF" fontSize={15} fontFamily="sans-serif">
                {isHazard
                  ? '777 memberi hak edit/hapus ke siapa saja di internet/server. Gunakan 644 (file) atau 755 (script).'
                  : 'Gunakan 600 untuk kredensial, 644 untuk dokumen/web, dan 755 hanya untuk file yang perlu dieksekusi.'}
              </text>

              <text x={35} y={98} fill="#94A3B8" fontSize={13} fontFamily="monospace">
                Prinsip: "Least Privilege" — Berikan izin sekecil mungkin yang dibutuhkan agar aman!
              </text>
            </g>
          </g>
        )
      })()}

      {/* ── FOOTER CAPTION BAR (ALWAYS VISIBLE) ─────────────── */}
      <g transform="translate(44, 1180)">
        <rect width={732} height={70} rx={16} fill="#090D1A" stroke="#1E293B" strokeWidth={1.5} filter="url(#boxShadow)" />
        <circle cx={35} cy={35} r={5} fill={phase.badgeColor} />
        <text x={55} y={42} fill="#E2E8F0" fontSize={17} fontFamily="sans-serif" fontWeight={500}>
          {phase.caption}
        </text>
      </g>
    </svg>
  )
}
