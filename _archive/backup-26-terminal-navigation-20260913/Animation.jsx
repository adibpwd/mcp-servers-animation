import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, LABELS, CAPTIONS, SFX_MAP,
  INTRO_CATEGORY_LABEL, INTRO_DOMAIN, INTRO_TITLE_A, INTRO_TITLE_B, INTRO_SUBTITLE,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'
import {
  IntroHeaderMorphV1,
  ActBadgeNavigatorV1,
  ContentBodyV1,
} from '../../shared/scene-ui/v1'

export default function TerminalNavigationAnimation({
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
  const [caption, setCaption] = useState('')
  const [pop, setPop] = useState({})

  // Terminal state
  const [termPrompt, setTermPrompt] = useState('adib@linux:~$')
  const [typedText, setTypedText] = useState('')
  const [historyLines, setHistoryLines] = useState([])
  const [activeFolder, setActiveFolder] = useState('home')
  const [treeOpen, setTreeOpen] = useState(false)

  // Act 4 path comparison state
  const [showPathComparison, setShowPathComparison] = useState(false)
  const [pathHighlight, setPathHighlight] = useState(null) // 'abs' | 'rel'

  const P = (id) => pop[id] || { opacity: 0, scale: 0, x: 0, y: 0 }

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
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 })
    tlRef.current = tl
    window.__animationTimeline = tl
    window.__flushSync = flushSync

    const popIn = (at, id, entry = SFX_MAP.POP, fromY = 12) => {
      const obj = { v: 0 }
      tl.add(() => setPop((prev) => ({
        ...prev,
        [id]: { opacity: 0, scale: 0, x: 0, y: fromY },
      })), at)
      tl.to(obj, {
        v: 1,
        duration: 0.42,
        ease: 'back.out(1.55)',
        onStart: () => play(entry),
        onUpdate: () => setPop((prev) => ({
          ...prev,
          [id]: {
            opacity: Math.min(1, obj.v * 1.4),
            scale: obj.v,
            x: 0,
            y: fromY * (1 - obj.v),
          },
        })),
      }, at)
    }

    const typeCmd = (at, fullCmd, duration = 0.8) => {
      const dummy = { len: 0 }
      tl.to(dummy, {
        len: fullCmd.length,
        duration,
        ease: 'none',
        onStart: () => play(SFX_MAP.TYPE),
        onUpdate: () => setTypedText(fullCmd.substring(0, Math.round(dummy.len))),
      }, at)
    }

    let t = 0

    // Reset loop
    tl.add(() => {
      setPhaseIdx(0)
      setMorphP(0)
      setContentStarted(false)
      setCaption('')
      setPop({})
      setTermPrompt('adib@linux:~$')
      setTypedText('')
      setHistoryLines([])
      setActiveFolder('home')
      setTreeOpen(false)
      setShowPathComparison(false)
      setPathHighlight(null)
    }, t)

    // Intro Header morph
    t += 0.25
    const morph = { p: 0 }
    tl.to(morph, {
      p: 1,
      duration: 0.9,
      ease: 'power3.inOut',
      onUpdate: () => setMorphP(morph.p),
    }, t)
    t += 0.9

    tl.add(() => {
      setContentStarted(true)
      play(SFX_MAP.SHIMMER)
    }, t)

    // --- ACT 1: PWD ---
    const act1Start = t
    tl.add(() => setPhaseIdx(0), act1Start)
    popIn(t + 0.15, 'term-window', SFX_MAP.POP)
    popIn(t + 0.3, 'tree-window', SFX_MAP.POP2)
    tl.add(() => {
      setTreeOpen(true)
      setCaption(CAPTIONS.PWD_START)
    }, t + 0.4)

    t += 1.2
    typeCmd(t, LABELS.ACT1_CMD, 0.6)
    t += 0.7

    tl.add(() => {
      play(SFX_MAP.SNAP)
      setHistoryLines([
        { prompt: 'adib@linux:~$', cmd: 'pwd', out: '/home/adib' },
      ])
      setTypedText('')
      setCaption(CAPTIONS.PWD_EXPLAIN)
    }, t)
    t += 2.5

    // --- ACT 2: LS ---
    const act2Start = act1Start + PHASES[0].duration
    t = act2Start
    tl.add(() => setPhaseIdx(1), act2Start)
    tl.add(() => setCaption(CAPTIONS.LS_START), t + 0.2)

    t += 0.8
    typeCmd(t, LABELS.ACT2_CMD, 0.5)
    t += 0.6

    tl.add(() => {
      play(SFX_MAP.POP)
      setHistoryLines([
        { prompt: 'adib@linux:~$', cmd: 'pwd', out: '/home/adib' },
        { prompt: 'adib@linux:~$', cmd: 'ls', out: LABELS.ACT2_OUT, isLs: true },
      ])
      setTypedText('')
      setCaption(CAPTIONS.LS_EXPLAIN)
    }, t)
    t += 3.5

    // --- ACT 3: CD ---
    const act3Start = act2Start + PHASES[1].duration
    t = act3Start
    tl.add(() => setPhaseIdx(2), act3Start)
    tl.add(() => setCaption(CAPTIONS.CD_START), t + 0.2)

    t += 0.8
    typeCmd(t, LABELS.ACT3_CMD1, 0.9)
    t += 1.0

    tl.add(() => {
      play(SFX_MAP.SWOOSH)
      setTermPrompt('adib@linux:~/projects$')
      setActiveFolder('projects')
      setHistoryLines((prev) => [
        ...prev,
        { prompt: 'adib@linux:~$', cmd: 'cd projects', out: null },
      ])
      setTypedText('')
      setCaption(CAPTIONS.CD_EXPLAIN)
    }, t)
    t += 2.5

    typeCmd(t, LABELS.ACT3_CMD2, 0.6)
    t += 0.7

    tl.add(() => {
      play(SFX_MAP.SWOOSH)
      setTermPrompt('adib@linux:~$')
      setActiveFolder('home')
      setHistoryLines((prev) => [
        ...prev,
        { prompt: 'adib@linux:~/projects$', cmd: 'cd ..', out: null },
      ])
      setTypedText('')
    }, t)
    t += 2.5

    // --- ACT 4: PATH ABSOLUT VS RELATIF ---
    const act4Start = act3Start + PHASES[2].duration
    t = act4Start
    tl.add(() => setPhaseIdx(3), act4Start)
    popIn(t + 0.15, 'path-card', SFX_MAP.POP)
    tl.add(() => {
      setShowPathComparison(true)
      setCaption(CAPTIONS.PATH_START)
    }, t + 0.3)

    t += 1.2
    tl.add(() => {
      setPathHighlight('abs')
      play(SFX_MAP.TICK)
    }, t)
    t += 2.2

    tl.add(() => {
      setPathHighlight('rel')
      play(SFX_MAP.TICK)
      setCaption(CAPTIONS.PATH_EXPLAIN)
    }, t)
    t += 2.8

    tl.add(() => {
      setPathHighlight(null)
      play(SFX_MAP.SUCCESS)
      setCaption(CAPTIONS.SUMMARY)
    }, t)

    t = act4Start + PHASES[3].duration
    tl.to({}, { duration: 0.01 }, t)

    return () => {
      tl.kill()
      if (window.__animationTimeline === tl) delete window.__animationTimeline
      delete window.__flushSync
    }
  }, [])

  useEffect(() => {
    if (!tlRef.current) return
    if (paused) tlRef.current.pause()
    else tlRef.current.play()
  }, [paused])

  useEffect(() => {
    if (!tlRef.current) return
    tlRef.current.timeScale(speed)
  }, [speed])

  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      className="w-full h-full select-none"
      style={{ backgroundColor: COLORS.BG }}
    >
      <defs>
        <linearGradient id="termBg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#0F172A" />
          <stop offset="100%" stopColor="#0B1120" />
        </linearGradient>
        <linearGradient id="cardGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#1E293B" />
          <stop offset="100%" stopColor="#0F172A" />
        </linearGradient>
      </defs>

      {/* Intro Header Morph (V1 standard) */}
      <IntroHeaderMorphV1
        morphP={morphP}
        categoryLabel={INTRO_CATEGORY_LABEL}
        domain={INTRO_DOMAIN}
        titleA={INTRO_TITLE_A}
        titleB={INTRO_TITLE_B}
        titleColorA={COLORS.CYAN}
        titleColorB={COLORS.EMERALD}
        subtitle={INTRO_SUBTITLE}
      />

      {/* Act Badges Navigator */}
      {contentStarted && (
        <ActBadgeNavigatorV1
          phases={PHASES}
          activePhaseIdx={phaseIdx}
        />
      )}

      {/* Content Body Area */}
      {contentStarted && (
        <ContentBodyV1>

          {/* Terminal Window (Left / Top panel) */}
          <g
            transform="translate(20, 20)"
            opacity={P('term-window').opacity}
            style={{
              transform: `translate(${20 + P('term-window').x}px, ${20 + P('term-window').y}px) scale(${P('term-window').scale})`,
              transformOrigin: '370px 220px',
            }}
          >
            {/* Terminal Frame */}
            <rect
              width="740"
              height="440"
              rx="12"
              fill="url(#termBg)"
              stroke={COLORS.BORDER}
              strokeWidth="2"
            />

            {/* Header bar */}
            <rect width="740" height="38" rx="12" fill="#1E293B" />
            <rect width="740" height="12" y="26" fill="#1E293B" />
            <line x1="0" y1="38" x2="740" y2="38" stroke="#334155" strokeWidth="1" />

            {/* Window controls */}
            <circle cx="24" cy="19" r="6" fill="#EF4444" />
            <circle cx="44" cy="19" r="6" fill="#F59E0B" />
            <circle cx="64" cy="19" r="6" fill="#10B981" />
            <text x="370" y="24" fill={COLORS.MUTED} fontSize="14" textAnchor="middle" fontFamily="monospace">
              bash — terminal
            </text>

            {/* Terminal Body Content */}
            <g transform="translate(24, 64)">
              {/* History output */}
              {historyLines.map((line, idx) => (
                <g key={idx} transform={`translate(0, ${idx * 60})`}>
                  <text fontFamily="monospace" fontSize="17" fill={COLORS.PROMPT}>
                    {line.prompt}{' '}
                    <tspan fill={COLORS.CMD}>{line.cmd}</tspan>
                  </text>
                  {line.out && (
                    <text
                      y="26"
                      fontFamily="monospace"
                      fontSize="17"
                      fill={line.isLs ? COLORS.TEXT : COLORS.CYAN}
                    >
                      {line.isLs ? (
                        <>
                          <tspan fill={COLORS.CYAN} fontWeight="bold">docs/ </tspan>
                          <tspan fill={COLORS.CYAN} fontWeight="bold"> projects/ </tspan>
                          <tspan fill={COLORS.TEXT}> notes.txt</tspan>
                        </>
                      ) : (
                        line.out
                      )}
                    </text>
                  )}
                </g>
              ))}

              {/* Active prompt typing line */}
              <g transform={`translate(0, ${historyLines.length * 60})`}>
                <text fontFamily="monospace" fontSize="17" fill={COLORS.PROMPT}>
                  {termPrompt}{' '}
                  <tspan fill={COLORS.CMD}>{typedText}</tspan>
                  <tspan fill={COLORS.CYAN} opacity="0.8">_</tspan>
                </text>
              </g>
            </g>
          </g>

          {/* Filesystem Mini Tree Visualizer (Right / Bottom panel) */}
          <g
            transform="translate(20, 480)"
            opacity={P('tree-window').opacity}
            style={{
              transform: `translate(${20 + P('tree-window').x}px, ${480 + P('tree-window').y}px) scale(${P('tree-window').scale})`,
              transformOrigin: '370px 150px',
            }}
          >
            <rect
              width="740"
              height="300"
              rx="12"
              fill="#0F172A"
              stroke={COLORS.BORDER}
              strokeWidth="2"
            />
            <text x="24" y="36" fill={COLORS.MUTED} fontSize="15" fontWeight="bold">
              FILESYSTEM VIEW
            </text>

            {/* Tree Nodes */}
            {/* Root / */}
            <g transform="translate(80, 80)">
              <rect x="0" y="0" width="80" height="36" rx="6" fill="#1E293B" stroke={COLORS.CYAN} strokeWidth="1.5" />
              <text x="40" y="23" fill={COLORS.CYAN} fontSize="16" fontWeight="bold" textAnchor="middle" fontFamily="monospace">/</text>

              {/* Line down to home */}
              <path d="M 40 36 L 40 80 L 120 80" fill="none" stroke="#334155" strokeWidth="2" />
            </g>

            {/* /home */}
            <g transform="translate(200, 140)">
              <rect
                x="0" y="0" width="100" height="36" rx="6"
                fill={activeFolder === 'home' ? '#0284C7' : '#1E293B'}
                stroke={COLORS.CYAN}
                strokeWidth={activeFolder === 'home' ? '2.5' : '1'}
              />
              <text x="50" y="23" fill={COLORS.TEXT} fontSize="15" fontWeight="bold" textAnchor="middle" fontFamily="monospace">home</text>

              {/* Line down to adib */}
              <path d="M 50 36 L 50 70 L 110 70" fill="none" stroke="#334155" strokeWidth="2" />
            </g>

            {/* /home/adib */}
            <g transform="translate(310, 190)">
              <rect
                x="0" y="0" width="100" height="36" rx="6"
                fill={activeFolder === 'home' ? '#0369A1' : '#1E293B'}
                stroke={COLORS.EMERALD}
                strokeWidth={activeFolder === 'home' ? '2.5' : '1'}
              />
              <text x="50" y="23" fill={COLORS.TEXT} fontSize="15" fontWeight="bold" textAnchor="middle" fontFamily="monospace">adib (~)</text>

              {/* Line to projects */}
              <path d="M 100 18 L 150 18" fill="none" stroke="#334155" strokeWidth="2" />
            </g>

            {/* /home/adib/projects */}
            <g transform="translate(460, 190)">
              <rect
                x="0" y="0" width="120" height="36" rx="6"
                fill={activeFolder === 'projects' ? '#7C3AED' : '#1E293B'}
                stroke={COLORS.PURPLE}
                strokeWidth={activeFolder === 'projects' ? '2.5' : '1'}
              />
              <text x="60" y="23" fill={COLORS.TEXT} fontSize="15" fontWeight="bold" textAnchor="middle" fontFamily="monospace">projects/</text>
            </g>
          </g>

          {/* Act 4: Path Absolut vs Relatif Card overlay */}
          {showPathComparison && (
            <g
              transform="translate(20, 800)"
              opacity={P('path-card').opacity}
              style={{
                transform: `translate(${20 + P('path-card').x}px, ${800 + P('path-card').y}px) scale(${P('path-card').scale})`,
                transformOrigin: '370px 100px',
              }}
            >
              <rect
                width="740"
                height="190"
                rx="12"
                fill="url(#cardGrad)"
                stroke={COLORS.BORDER}
                strokeWidth="2"
              />

              {/* Path Absolut Box */}
              <g transform="translate(20, 20)">
                <rect
                  width="340"
                  height="150"
                  rx="8"
                  fill="#0F172A"
                  stroke={pathHighlight === 'abs' ? COLORS.AMBER : COLORS.BORDER}
                  strokeWidth={pathHighlight === 'abs' ? '2.5' : '1'}
                />
                <text x="16" y="32" fill={COLORS.AMBER} fontSize="15" fontWeight="bold">
                  PATH ABSOLUT
                </text>
                <text x="16" y="60" fill={COLORS.TEXT} fontSize="16" fontFamily="monospace">
                  cd /home/adib/projects
                </text>
                <text x="16" y="95" fill={COLORS.MUTED} fontSize="13">
                  • Selalu mulai dari akar (<tspan fill={COLORS.CYAN} fontWeight="bold">/</tspan>)
                </text>
                <text x="16" y="120" fill={COLORS.MUTED} fontSize="13">
                  • Pasti dan tidak peduli posisi awal
                </text>
              </g>

              {/* Path Relatif Box */}
              <g transform="translate(380, 20)">
                <rect
                  width="340"
                  height="150"
                  rx="8"
                  fill="#0F172A"
                  stroke={pathHighlight === 'rel' ? COLORS.EMERALD : COLORS.BORDER}
                  strokeWidth={pathHighlight === 'rel' ? '2.5' : '1'}
                />
                <text x="16" y="32" fill={COLORS.EMERALD} fontSize="15" fontWeight="bold">
                  PATH RELATIF
                </text>
                <text x="16" y="60" fill={COLORS.TEXT} fontSize="16" fontFamily="monospace">
                  cd projects
                </text>
                <text x="16" y="95" fill={COLORS.MUTED} fontSize="13">
                  • Berpatokan dari folder posisi saat ini
                </text>
                <text x="16" y="120" fill={COLORS.MUTED} fontSize="13">
                  • Lebih pendek untuk navigasi lokal
                </text>
              </g>
            </g>
          )}

          {/* Footer Caption Overlay */}
          {caption && (
            <g transform={`translate(${VW / 2}, 1020)`}>
              <rect
                x="-320"
                y="-24"
                width="640"
                height="48"
                rx="24"
                fill="#0F172A"
                stroke={COLORS.CYAN}
                strokeWidth="1.5"
                opacity="0.95"
              />
              <text
                fill={COLORS.TEXT}
                fontSize="18"
                fontWeight="600"
                textAnchor="middle"
                dominantBaseline="central"
              >
                {caption}
              </text>
            </g>
          )}
        </ContentBodyV1>
      )}
    </svg>
  )
}
