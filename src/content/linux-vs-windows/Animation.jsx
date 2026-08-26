import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { VW, VH, PHASES, COUNTER_START } from './data'

const lerp = (a, b, t) => a + (b - a) * t

export default function LinuxVsWindowsAnimation({
  paused = false,
  speed = 1.0,
  volume = 75,
  previewSfx = true
}) {
  const svgRef = useRef(null)
  const timelineRef = useRef(null)
  const sfxCacheRef = useRef({})
  
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [showIntro, setShowIntro] = useState(true)
  const [morphProgress, setMorphProgress] = useState(0)

  // Animated values
  const [winDesktop, setWinDesktop] = useState(0)
  const [linServer, setLinServer] = useState(0)
  
  // Opacities for views
  const [views, setViews] = useState({ market: 0, arch: 0, phil: 0, usecase: 0 })

  const phase = PHASES[phaseIdx]

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

    // ── INTRO PHASE ────────────
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

    // ── PHASE 0: MARKET SHARE ────────────
    const p0 = PHASES[0]
    master.add(() => {
      setPhaseIdx(0)
      setViews({ market: 1, arch: 0, phil: 0, usecase: 0 })
      playSfx('whoosh')
    }, time)

    const marketObj = { wd: 0, ls: 0 }
    master.to(marketObj, {
      wd: 74, ls: 90, duration: 1.5, ease: 'back.out(1.5)',
      onUpdate: () => {
        setWinDesktop(marketObj.wd)
        setLinServer(marketObj.ls)
      }
    }, time + 0.5)
    
    master.add(() => playSfx('success'), time + 0.5)
    time += p0.duration

    // ── PHASE 1: ARCHITECTURE ────────────
    const p1 = PHASES[1]
    master.add(() => {
      setPhaseIdx(1)
      setViews({ market: 0, arch: 1, phil: 0, usecase: 0 })
      playSfx('scan')
    }, time)
    time += p1.duration

    // ── PHASE 2: PHILOSOPHY ────────────
    const p2 = PHASES[2]
    master.add(() => {
      setPhaseIdx(2)
      setViews({ market: 0, arch: 0, phil: 1, usecase: 0 })
      playSfx('materialize')
    }, time)
    time += p2.duration

    // ── PHASE 3: USE CASE ────────────
    const p3 = PHASES[3]
    master.add(() => {
      setPhaseIdx(3)
      setViews({ market: 0, arch: 0, phil: 0, usecase: 1 })
      playSfx('click')
    }, time)
    time += p3.duration

    return () => {
      master.kill()
      if (window.__animationTimeline === master) {
        delete window.__animationTimeline
      }
    }
  }, [])

  // Apply speed / pause changes
  useEffect(() => {
    if (timelineRef.current) {
      timelineRef.current.timeScale(speed)
      if (paused) timelineRef.current.pause(); else timelineRef.current.resume();
    }
  }, [speed, paused])


  return (
    <svg ref={svgRef} viewBox={`0 0 ${VW} ${VH}`}
      style={{
        width: '100%', height: '100%',
        maxHeight: '100vh', maxWidth: `calc(100vh * ${VW} / ${VH})`,
        background: '#070913', userSelect: 'none'
      }}>

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
          <stop offset="50%" stopColor="#8B5CF6" />
          <stop offset="100%" stopColor="#F472B6" />
        </linearGradient>
      </defs>

      {/* Grid Pattern */}
      <g opacity={0.06}>
        {Array.from({ length: 22 }).map((_, i) => (
          <line key={`vg-${i}`} x1={i * 40} y1={0} x2={i * 40} y2={VH} stroke="#8B5CF6" strokeWidth={1} />
        ))}
        {Array.from({ length: 34 }).map((_, i) => (
          <line key={`hg-${i}`} x1={0} y1={i * 40} x2={VW} y2={i * 40} stroke="#8B5CF6" strokeWidth={1} />
        ))}
      </g>

      {/* ── HEADER SECTION ───── */}
      <g id="header-layer">
        {(() => {
          const p = morphProgress
          const taglineY = lerp(540, 30, p)
          const taglineFont = lerp(24, 16, p)
          
          const fileX = lerp((VW / 2) - 220, 44, p)
          const fileY = lerp(620, 80, p)
          const fileFont = lerp(80, 48, p)
          
          const subX = lerp((VW / 2) - 200, 44, p)
          const subY = lerp(695, 115, p)
          const subFont = lerp(26, 18, p)

          return (
            <>
              <text x={VW / 2} y={taglineY} textAnchor="middle" fill="#64748B" fontSize={taglineFont} fontFamily="monospace" letterSpacing={3}>
                OS COMPARISON · <tspan fill="#8B5CF6" fontWeight={700}>ADIB-DEV.COM</tspan>
              </text>
              <text x={fileX} y={fileY} textAnchor="start" fill="url(#headerGrad)"
                fontSize={fileFont} fontFamily="'Arial Black', Impact, sans-serif" fontWeight={900} letterSpacing={1}>
                LINUX VS WINDOWS
              </text>
              <text x={subX} y={subY} textAnchor="start" fill="#94A3B8" fontSize={subFont} fontFamily="sans-serif" fontWeight={500}>
                Perbedaan mendasar dua raksasa Sistem Operasi
              </text>
            </>
          )
        })()}
      </g>

      {/* ── PHASE BADGE ── */}
      {!showIntro && (
      <g transform="translate(44, 160)">
        <rect width={360} height={40} rx={20} fill="#0F172A" stroke={phase.badgeColor} strokeWidth={1.8} filter="url(#boxShadow)" />
        <circle cx={22} cy={20} r={6} fill={phase.badgeColor} />
        <text x={40} y={25} fill={phase.badgeColor} fontSize={15} fontFamily="monospace" fontWeight={700} letterSpacing={1}>
          {phase.badge}
        </text>

        <g transform="translate(640, 12)">
          {PHASES.map((p, i) => (
            <circle key={p.id} cx={i * 24} cy={8} r={i === phaseIdx ? 6.5 : 4}
              fill={i === phaseIdx ? phase.badgeColor : '#334155'}
              stroke={i === phaseIdx ? '#ffffff' : 'none'} strokeWidth={1.5} />
          ))}
        </g>
      </g>
      )}

      {/* ════ MAIN CONTENT CANVAS ════ */}
      {!showIntro && (
        <g transform="translate(44, 240)">
          
          {/* VIEW 0: MARKET SHARE */}
          <g opacity={views.market} style={{ display: views.market > 0 ? 'block' : 'none' }}>
            <rect width={732} height={500} rx={20} fill="#050811" stroke="#1E293B" strokeWidth={2} filter="url(#boxShadow)"/>
            
            <text x={366} y={60} textAnchor="middle" fill="#FFFFFF" fontSize={28} fontFamily="'Arial Black', sans-serif">MARKET DOMINANCE</text>
            
            {/* Desktop Chart */}
            <g transform="translate(100, 150)">
              <text x={100} y={0} textAnchor="middle" fill="#38BDF8" fontSize={24} fontFamily="monospace" fontWeight={800}>DESKTOP PC</text>
              <circle cx={100} cy={100} r={80} fill="#0F172A" stroke="#1E293B" strokeWidth={4} />
              
              {/* Fake Pie - Windows Dominates */}
              <path d="M 100 20 A 80 80 0 1 1 20 100 L 100 100 Z" fill="#38BDF8" opacity={winDesktop > 0 ? 1 : 0} />
              <path d="M 20 100 A 80 80 0 0 1 100 20 L 100 100 Z" fill="#34D399" opacity={winDesktop > 0 ? 1 : 0} />
              
              <text x={100} y={90} textAnchor="middle" fill="#FFFFFF" fontSize={36} fontWeight={900}>{Math.round(winDesktop)}%</text>
              <text x={100} y={115} textAnchor="middle" fill="#FFFFFF" fontSize={14}>Windows</text>
            </g>

            {/* Server Chart */}
            <g transform="translate(432, 150)">
              <text x={100} y={0} textAnchor="middle" fill="#A78BFA" fontSize={24} fontFamily="monospace" fontWeight={800}>WEB SERVERS</text>
              <circle cx={100} cy={100} r={80} fill="#0F172A" stroke="#1E293B" strokeWidth={4} />
              
              {/* Fake Pie - Linux Dominates */}
              <path d="M 100 20 A 80 80 0 1 0 160 50 L 100 100 Z" fill="#A78BFA" opacity={linServer > 0 ? 1 : 0} />
              <path d="M 160 50 A 80 80 0 0 1 100 20 L 100 100 Z" fill="#38BDF8" opacity={linServer > 0 ? 1 : 0} />

              <text x={100} y={90} textAnchor="middle" fill="#FFFFFF" fontSize={36} fontWeight={900}>{Math.round(linServer)}%</text>
              <text x={100} y={115} textAnchor="middle" fill="#FFFFFF" fontSize={14}>Linux</text>
            </g>

            <rect x={100} y={400} width={532} height={60} rx={12} fill="#090D1A" stroke="#334155" strokeWidth={1} />
            <text x={366} y={435} textAnchor="middle" fill="#94A3B8" fontSize={15} fontFamily="sans-serif">
              Linux juga mendominasi 100% Supercomputer & mayoritas Mobile via Android.
            </text>
          </g>

          {/* VIEW 1: ARCHITECTURE */}
          <g opacity={views.arch} style={{ display: views.arch > 0 ? 'block' : 'none' }}>
            <rect width={350} height={500} rx={20} fill="#090D1A" stroke="#38BDF8" strokeWidth={2} />
            <text x={175} y={50} textAnchor="middle" fill="#38BDF8" fontSize={28} fontFamily="'Arial Black', sans-serif">WINDOWS</text>
            
            <rect x={40} y={90} width={270} height={100} rx={12} fill="#030712" stroke="#1E293B" strokeWidth={1}/>
            <text x={175} y={130} textAnchor="middle" fill="#E2E8F0" fontSize={18} fontWeight={700}>Drive Letters</text>
            <text x={175} y={160} textAnchor="middle" fill="#64748B" fontSize={14} fontFamily="monospace">C:\ D:\ E:\</text>
            
            <rect x={40} y={210} width={270} height={100} rx={12} fill="#030712" stroke="#1E293B" strokeWidth={1}/>
            <text x={175} y={250} textAnchor="middle" fill="#E2E8F0" fontSize={18} fontWeight={700}>Windows Registry</text>
            <text x={175} y={280} textAnchor="middle" fill="#64748B" fontSize={12} fontFamily="monospace">Centralized config DB</text>

            <rect x={40} y={330} width={270} height={100} rx={12} fill="#0C4A6E" stroke="#38BDF8" strokeWidth={2}/>
            <text x={175} y={370} textAnchor="middle" fill="#BAE6FD" fontSize={18} fontWeight={700}>NT Kernel</text>
            <text x={175} y={400} textAnchor="middle" fill="#38BDF8" fontSize={12} fontFamily="monospace">Hybrid Architecture</text>


            <rect x={382} y={0} width={350} height={500} rx={20} fill="#090D1A" stroke="#A78BFA" strokeWidth={2} />
            <text x={557} y={50} textAnchor="middle" fill="#A78BFA" fontSize={28} fontFamily="'Arial Black', sans-serif">LINUX</text>
            
            <rect x={422} y={90} width={270} height={100} rx={12} fill="#030712" stroke="#1E293B" strokeWidth={1}/>
            <text x={557} y={130} textAnchor="middle" fill="#E2E8F0" fontSize={18} fontWeight={700}>Root File System</text>
            <text x={557} y={160} textAnchor="middle" fill="#64748B" fontSize={14} fontFamily="monospace">/ (Everything is a file)</text>

            <rect x={422} y={210} width={270} height={100} rx={12} fill="#030712" stroke="#1E293B" strokeWidth={1}/>
            <text x={557} y={250} textAnchor="middle" fill="#E2E8F0" fontSize={18} fontWeight={700}>Plain Text Configs</text>
            <text x={557} y={280} textAnchor="middle" fill="#64748B" fontSize={12} fontFamily="monospace">/etc/*.conf</text>

            <rect x={422} y={330} width={270} height={100} rx={12} fill="#4C1D95" stroke="#A78BFA" strokeWidth={2}/>
            <text x={557} y={370} textAnchor="middle" fill="#DDD6FE" fontSize={18} fontWeight={700}>Linux Kernel</text>
            <text x={557} y={400} textAnchor="middle" fill="#A78BFA" fontSize={12} fontFamily="monospace">Monolithic Architecture</text>
          </g>

          {/* VIEW 2: PHILOSOPHY */}
          <g opacity={views.phil} style={{ display: views.phil > 0 ? 'block' : 'none' }}>
            <rect width={732} height={500} rx={20} fill="#050811" stroke="#34D399" strokeWidth={2} filter="url(#boxShadow)"/>
            
            <g transform="translate(166, 120)">
              <circle cx={100} cy={100} r={90} fill="none" stroke="#38BDF8" strokeWidth={3} strokeDasharray="10,5"/>
              <text x={100} y={90} textAnchor="middle" fill="#38BDF8" fontSize={24} fontWeight={800}>CLOSED</text>
              <text x={100} y={120} textAnchor="middle" fill="#94A3B8" fontSize={14}>Proprietary (Windows)</text>
            </g>

            <g transform="translate(366, 120)">
              <circle cx={100} cy={100} r={90} fill="none" stroke="#A78BFA" strokeWidth={3} />
              <text x={100} y={90} textAnchor="middle" fill="#A78BFA" fontSize={24} fontWeight={800}>OPEN</text>
              <text x={100} y={120} textAnchor="middle" fill="#94A3B8" fontSize={14}>Source Code (Linux)</text>
            </g>

            <rect x={100} y={350} width={532} height={100} rx={12} fill="#064E3B" stroke="#34D399" strokeWidth={2} />
            <text x={366} y={390} textAnchor="middle" fill="#34D399" fontSize={20} fontWeight={800}>FREEDOM & COMMUNITY</text>
            <text x={366} y={420} textAnchor="middle" fill="#D1FAE5" fontSize={14}>Linux dikembangkan oleh komunitas global. Gratis & Transparan.</text>
          </g>

          {/* VIEW 3: USE CASE */}
          <g opacity={views.usecase} style={{ display: views.usecase > 0 ? 'block' : 'none' }}>
            {[{title: 'GAMER / OFFICE', os: 'Windows', color: '#38BDF8', y: 0},
              {title: 'DEV / SYSADMIN', os: 'Linux', color: '#A78BFA', y: 170},
              {title: 'CREATIVE / UI', os: 'macOS', color: '#F472B6', y: 340}].map((item, i) => (
                <g key={i} transform={`translate(0, ${item.y})`}>
                  <rect width={732} height={140} rx={16} fill="#090D1A" stroke={item.color} strokeWidth={2} />
                  <rect x={30} y={40} width={60} height={60} rx={12} fill={item.color} fillOpacity={0.2} stroke={item.color} strokeWidth={2}/>
                  <text x={120} y={70} fill="#FFFFFF" fontSize={24} fontWeight={800}>{item.title}</text>
                  <text x={120} y={95} fill="#94A3B8" fontSize={16}>Rekomendasi OS: <tspan fill={item.color} fontWeight={700}>{item.os}</tspan></text>
                </g>
            ))}
          </g>

        </g>
      )}

      {/* ── FOOTER CAPTION BAR ── */}
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
