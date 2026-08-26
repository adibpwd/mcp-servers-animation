import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { VW, VH, PHASES, DE_DATA } from './data'

const lerp = (a, b, t) => a + (b - a) * t

export default function DesktopEnvironmentAnimation({
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

  // Animated metrics
  const [ramAnim, setRamAnim] = useState(0)
  const [cpuAnim, setCpuAnim] = useState(0)
  const [customAnim, setCustomAnim] = useState(0)

  const phase = PHASES[phaseIdx]
  const currentDE = DE_DATA[phaseIdx]

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

    // ── DE PHASES ────────────
    const metricObj = { ram: 0, cpu: 0, custom: 0 }

    PHASES.forEach((p, i) => {
      master.add(() => {
        setPhaseIdx(i)
        playSfx('click')
      }, time)

      // Animate metrics to target DE values
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
        }
      }, time + 0.2)
      
      master.add(() => playSfx('scan'), time + 0.2)

      time += p.duration
    })

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
                Tampilan UI Linux: GNOME vs KDE dll
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
        <g transform="translate(0, 240)">
          
          {/* TOP SHOWCASE */}
          <g transform="translate(44, 0)">
            <rect width={732} height={200} rx={20} fill="#050811" stroke={currentDE.color} strokeWidth={3} filter="url(#boxShadow)"/>
            
            <text x={366} y={100} textAnchor="middle" fill={currentDE.color} fontSize={60} fontFamily="'Arial Black', sans-serif" filter="url(#neonGlow)">
              {currentDE.name}
            </text>
            
            <text x={366} y={145} textAnchor="middle" fill="#E2E8F0" fontSize={24} fontFamily="monospace">
              {currentDE.style}
            </text>
            <text x={366} y={175} textAnchor="middle" fill="#64748B" fontSize={16} fontFamily="sans-serif">
              Populer di: {currentDE.distro}
            </text>
          </g>

          {/* PERFORMANCE METRICS */}
          <g transform="translate(44, 240)">
            {/* RAM USAGE */}
            <g transform="translate(0, 0)">
              <rect width={732} height={120} rx={16} fill="#090D1A" stroke="#1E293B" strokeWidth={1.5} />
              <text x={40} y={40} fill="#94A3B8" fontSize={16} fontFamily="monospace" fontWeight={800}>
                IDLE RAM USAGE (Estimasi)
              </text>
              <text x={692} y={40} textAnchor="end" fill="#F87171" fontSize={20} fontFamily="monospace" fontWeight={800}>
                {currentDE.ram}
              </text>
              
              {/* Bar */}
              <rect x={40} y={65} width={652} height={20} rx={10} fill="#030712" />
              <rect x={40} y={65} width={(ramAnim / 100) * 652} height={20} rx={10} fill="#F87171" filter="url(#neonGlow)" />
            </g>

            {/* CPU OVERHEAD */}
            <g transform="translate(0, 140)">
              <rect width={732} height={120} rx={16} fill="#090D1A" stroke="#1E293B" strokeWidth={1.5} />
              <text x={40} y={40} fill="#94A3B8" fontSize={16} fontFamily="monospace" fontWeight={800}>
                CPU OVERHEAD (Animasi & Efek)
              </text>
              <text x={692} y={40} textAnchor="end" fill="#38BDF8" fontSize={20} fontFamily="monospace" fontWeight={800}>
                {Math.round(cpuAnim)}%
              </text>
              
              {/* Bar */}
              <rect x={40} y={65} width={652} height={20} rx={10} fill="#030712" />
              <rect x={40} y={65} width={(cpuAnim / 100) * 652} height={20} rx={10} fill="#38BDF8" filter="url(#neonGlow)" />
            </g>

            {/* CUSTOMIZATION LEVEL */}
            <g transform="translate(0, 280)">
              <rect width={732} height={120} rx={16} fill="#090D1A" stroke="#1E293B" strokeWidth={1.5} />
              <text x={40} y={40} fill="#94A3B8" fontSize={16} fontFamily="monospace" fontWeight={800}>
                TINGKAT KUSTOMISASI (Themes/Widgets)
              </text>
              <text x={692} y={40} textAnchor="end" fill="#34D399" fontSize={20} fontFamily="monospace" fontWeight={800}>
                {Math.round(customAnim)} / 100
              </text>
              
              {/* Bar */}
              <rect x={40} y={65} width={652} height={20} rx={10} fill="#030712" />
              <rect x={40} y={65} width={(customAnim / 100) * 652} height={20} rx={10} fill="#34D399" filter="url(#neonGlow)" />
            </g>
          </g>
          
          {/* BOTTOM COMPARISON TABS (Gnome, KDE, XFCE, i3) */}
          <g transform="translate(44, 700)">
            {DE_DATA.map((de, idx) => {
              const isActive = idx === phaseIdx
              const tX = idx * 185
              return (
                <g key={de.id} transform={`translate(${tX}, 0)`}>
                  <rect width={175} height={100} rx={12} 
                    fill={isActive ? `${de.color}20` : '#030712'} 
                    stroke={isActive ? de.color : '#1E293B'} strokeWidth={isActive ? 2 : 1} />
                  <text x={87.5} y={45} textAnchor="middle" fill={isActive ? de.color : '#64748B'} fontSize={20} fontFamily="'Arial Black', sans-serif">
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
