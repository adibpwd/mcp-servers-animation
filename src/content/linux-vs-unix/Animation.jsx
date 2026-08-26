import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { createGlowDot, destroyDots } from '../../shared/GlowDot'
import {
  VW, VH, PHASES,
  UNIX_FAMILY, LINUX_FAMILY, WINDOWS,
  SIZE_MAP,
  UNIX_CLUSTER_CENTER, LINUX_CLUSTER_CENTER, POSIX_HUB, WINDOWS_CORNER,
  UNIX_POSITIONS, LINUX_POSITIONS,
  UNIX_USE_CASES, LINUX_DOMINANCE,
} from './data'

function getAbsPos(cluster, offset) {
  return { x: cluster.x + offset.x, y: cluster.y + offset.y }
}

export default function LinuxVsUnixAnimation({
  paused = false,
  speed = 1.0,
  volume = 75,
  previewSfx = true,
  audioUnlocked = false,
}) {
  const svgRef = useRef(null)
  const dotsLayerRef = useRef(null)
  const masterRef = useRef(null)
  const [phaseIdx, setPhaseIdx] = useState(0)
  const cableDotsRef = useRef([])

  useEffect(() => {
    const svg = svgRef.current
    const dotsLayer = dotsLayerRef.current
    if (!svg || !dotsLayer) return

    const master = gsap.timeline({
      repeat: -1,
      repeatDelay: 1.5,
      onRepeat: () => setPhaseIdx(0),
      paused: true, // Start paused, will be controlled by useEffect
    })
    
    masterRef.current = master

    // ═══════════════════════════════════════════════════════
    // PHASE 1: THE UNIX FAMILY DRAMA (0-12s)
    // ═══════════════════════════════════════════════════════

    // --- Beat 1: The Family Portrait (0-3s) ---

    master.add(() => setPhaseIdx(0), 0)

    // 1. POSIX Hub appears
    master.to('#posix-hub-inner', {
      scale: 1, duration: 0.6, ease: 'back.out(1.7)',
    }, 0)
    master.to('#posix-hub', {
      attr: { opacity: 1 }, duration: 0.6,
    }, 0)

    // 2. Unix family appears
    UNIX_FAMILY?.forEach((os, i) => {
      master.to(`#node-${os.id}`, {
        attr: { opacity: 1 }, duration: 0.3,
      }, 0.3 + i * 0.15)
      master.to(`#node-${os.id}-inner`, {
        scale: 1, duration: 0.4, ease: 'back.out(1.7)',
      }, 0.3 + i * 0.15)
    })

    // 3. Linux family appears
    LINUX_FAMILY?.forEach((os, i) => {
      master.to(`#node-${os.id}`, {
        attr: { opacity: 1 }, duration: 0.3,
      }, 0.8 + i * 0.15)
      master.to(`#node-${os.id}-inner`, {
        scale: 1, duration: 0.4, ease: 'back.out(1.7)',
      }, 0.8 + i * 0.15)
    })

    // 4. Connector lines appear
    UNIX_FAMILY?.forEach((os, i) => {
      master.to(`#conn-unix-${os.id}`, {
        attr: { opacity: 0.6 }, duration: 0.3,
      }, 1.5 + i * 0.08)
    })
    LINUX_FAMILY?.forEach((os, i) => {
      master.to(`#conn-linux-${os.id}`, {
        attr: { opacity: 0.6 }, duration: 0.3,
      }, 1.8 + i * 0.08)
    })

    // 5. Windows appears
    master.to('#node-windows', {
      attr: { opacity: 1 }, duration: 0.3,
    }, 2.0)
    master.to('#node-windows-inner', {
      scale: 1, duration: 0.5, ease: 'back.out(1.7)',
    }, 2.0)

    // Windows connector: stretch then snap
    master.to('#conn-windows-posix', {
      attr: { x2: 480, y2: 480, opacity: 0.8 }, duration: 0.3,
    }, 2.3)
    master.to('#conn-windows-posix', {
      attr: { opacity: 0 }, duration: 0.1,
    }, 2.6)

    // Question mark
    master.to('#windows-question', {
      attr: { opacity: 1 }, duration: 0.3,
    }, 2.5)

    // --- Beat 2: The Expulsion (3-6s) ---

    // Flash effect at break point
    master.to('#expel-flash', {
      attr: { opacity: 1 }, duration: 0.05,
    }, 3.0)
    master.to('#expel-flash', {
      attr: { opacity: 0 }, duration: 0.3,
    }, 3.05)

    // Windows wobble
    master.to('#node-windows-inner', {
      rotation: 15, duration: 0.08,
      yoyo: true, repeat: 5, ease: 'power1.inOut',
    }, 3.5)

    // Windows question disappears
    master.to('#windows-question', {
      attr: { opacity: 0 }, duration: 0.2,
    }, 3.5)

    // Windows gets pushed to corner
    master.to('#node-windows', {
      x: WINDOWS_CORNER.x - 410,
      y: WINDOWS_CORNER.y - 550,
      duration: 0.8, ease: 'back.out(1.4)',
    }, 4.0)
    master.to('#node-windows-inner', {
      rotation: -15, duration: 0.8, ease: 'back.out(1.4)',
    }, 4.0)

    // "NOT UNIX" label appears
    master.to('#not-unix-label', {
      attr: { opacity: 1 }, duration: 0.3,
    }, 5.0)

    // All connectors redraw
    master.to('.connector-unix, .connector-linux', {
      attr: { opacity: 0.8 }, duration: 0.3,
    }, 4.5)

    // --- Beat 3: The Loneliness (6-9s) ---

    // NT Kernel label appears
    master.to('#nt-kernel-label', {
      attr: { opacity: 1 }, duration: 0.4,
    }, 6.5)

    // Windows sad — drops slightly
    master.to('#node-windows', {
      y: `+=${15}`, duration: 0.5, ease: 'power2.out',
    }, 6.3)

    // Thought bubble appears
    master.to('#thought-bubble', {
      attr: { opacity: 1 }, duration: 0.3,
    }, 7.5)
    master.to('#thought-bubble-inner', {
      scale: 1, duration: 0.5, ease: 'back.out(1.7)',
    }, 7.5)

    // Bubble wiggle
    master.to('#thought-bubble', {
      x: 5, duration: 0.2, yoyo: true, repeat: 3, ease: 'power1.inOut',
    }, 8.2)

    // --- Beat 4: The WSL Bridge (9-12s) ---

    // Thought bubble pops
    master.to('#thought-bubble-inner', {
      scale: 1.3, duration: 0.2, ease: 'power2.in',
    }, 9.0)
    master.to('#thought-bubble', {
      attr: { opacity: 0 }, duration: 0.3,
    }, 9.1)

    // WSL label appears
    master.to('#wsl-label', {
      attr: { opacity: 1 }, duration: 0.4,
    }, 9.3)

    // Cable draws from Windows up to Linux
    master.to('#wsl-cable', {
      strokeDashoffset: 0, duration: 1.2, ease: 'power2.inOut',
    }, 9.5)
    master.to('#wsl-cable-glow', {
      strokeDashoffset: 0, attr: { opacity: 0.6 }, duration: 1.2, ease: 'power2.inOut',
    }, 9.5)

    // Connection flash
    master.to('#connect-flash', {
      attr: { opacity: 1 }, duration: 0.05,
    }, 10.8)
    master.to('#connect-flash', {
      attr: { opacity: 0 }, duration: 0.4,
    }, 10.85)

    // Windows happy — bounce up
    master.to('#node-windows', {
      y: '-=20', duration: 0.3, ease: 'power2.out',
    }, 11.0)

    // Ubuntu moves closer to cable
    master.to('#node-ubuntu', {
      x: '+=30', duration: 0.4, ease: 'power2.out',
    }, 11.0)

    // Glow dots flow along cable
    for (let i = 0; i < 3; i++) {
      const dot = createGlowDot(
        dotsLayer,
        WINDOWS_CORNER.x, WINDOWS_CORNER.y,
        LINUX_CLUSTER_CENTER.x + LINUX_POSITIONS.ubuntu.x,
        LINUX_CLUSTER_CENTER.y + LINUX_POSITIONS.ubuntu.y,
        '#22D3EE',
        11.2 + i * 0.4, 1.5, 0
      )
      cableDotsRef.current.push(dot)
    }

    // Caption
    master.to('#phase1-caption', {
      attr: { opacity: 1 }, duration: 0.5,
    }, 11.5)

    // ═══════════════════════════════════════════════════════
    // PHASE 1 HOLD + FADE OUT (12-13s)
    // ═══════════════════════════════════════════════════════

    master.to('#phase1-group', {
      attr: { opacity: 0 }, duration: 0.5,
    }, 12.0)

    // ═══════════════════════════════════════════════════════
    // PHASE 2: WHERE UNIX LIVES (13-23s)
    // ═══════════════════════════════════════════════════════

    master.add(() => setPhaseIdx(1), 13)

    // Use case cards fade in from left
    UNIX_USE_CASES?.forEach((useCase, i) => {
      const yPos = 200 + i * 200
      master.to(`#usecase-card-${i}`, {
        attr: { opacity: 1 },
        x: 0,
        duration: 0.5, ease: 'power2.out',
      }, 13 + i * 0.4)

      // Glow dots flow through card
      for (let d = 0; d < 2; d++) {
        const dot = createGlowDot(
          dotsLayer,
          100, yPos,
          700, yPos,
          '#06B6D4',
          13.5 + i * 0.4 + d * 0.8, 1.2, 0
        )
        cableDotsRef.current.push(dot)
      }
    })

    // Phase 2 caption
    master.to('#phase2-caption', {
      attr: { opacity: 1 }, duration: 0.5,
    }, 22.0)

    // ═══════════════════════════════════════════════════════
    // PHASE 2 FADE OUT + PHASE 3 SETUP (23-24s)
    // ═══════════════════════════════════════════════════════

    master.to('#phase2-group', {
      attr: { opacity: 0 }, duration: 0.5,
    }, 22.5)

    // ═══════════════════════════════════════════════════════
    // PHASE 3: LINUX DOMINANCE (24-34s)
    // ═══════════════════════════════════════════════════════

    master.add(() => setPhaseIdx(2), 24)

    // Bar charts animate in
    LINUX_DOMINANCE?.forEach((stat, i) => {
      const delay = 24 + i * 0.3

      // Linux bar grows
      master.to(`#bar-linux-${i}`, {
        attr: { width: (stat.linux / 100) * 400 },
        duration: 0.8, ease: 'power2.out',
      }, delay)

      // Unix bar grows
      master.to(`#bar-unix-${i}`, {
        attr: { width: (stat.unix / 100) * 400 },
        duration: 0.8, ease: 'power2.out',
      }, delay)

      // Percentage counter
      master.to(`#percent-linux-${i}`, {
        textContent: stat.linux.toFixed(1),
        duration: 0.8, ease: 'power2.out',
        snap: { textContent: 0.1 },
      }, delay)

      master.to(`#percent-unix-${i}`, {
        textContent: stat.unix.toFixed(1),
        duration: 0.8, ease: 'power2.out',
        snap: { textContent: 0.1 },
      }, delay)
    })

    // Phase 3 caption
    master.to('#phase3-caption', {
      attr: { opacity: 1 }, duration: 0.5,
    }, 33.0)

    // ═══════════════════════════════════════════════════════
    // PHASE 3 FADE OUT + PHASE 4 SETUP (34-35s)
    // ═══════════════════════════════════════════════════════

    master.to('#phase3-group', {
      attr: { opacity: 0 }, duration: 0.5,
    }, 33.5)

    // ═══════════════════════════════════════════════════════
    // PHASE 4: POSIX BROTHERS (35-40s)
    // ═══════════════════════════════════════════════════════

    master.add(() => setPhaseIdx(3), 35)

    // Venn diagram circles appear
    master.to('#venn-linux', {
      r: 80, duration: 0.8, ease: 'back.out(1.7)',
    }, 35)
    master.to('#venn-unix', {
      r: 80, duration: 0.8, ease: 'back.out(1.7)',
    }, 35.2)

    // Labels fade in
    master.to('#venn-linux-label', {
      attr: { opacity: 1 }, duration: 0.4,
    }, 35.5)
    master.to('#venn-unix-label', {
      attr: { opacity: 1 }, duration: 0.4,
    }, 35.7)

    // POSIX label in overlap
    master.to('#venn-posix-label', {
      attr: { opacity: 1 }, duration: 0.4,
    }, 36.0)

    // Shared tools appear one by one
    const tools = ['ls', 'grep', 'pipe', 'chmod']
    tools.forEach((tool, i) => {
      master.to(`#tool-${tool}`, {
        attr: { opacity: 1 }, duration: 0.3,
      }, 36.2 + i * 0.15)
    })

    // Phase 4 caption
    master.to('#phase4-caption', {
      attr: { opacity: 1 }, duration: 0.5,
    }, 37.5)

    // ═══════════════════════════════════════════════════════
    // OUTRO FADE OUT (40s)
    // ═══════════════════════════════════════════════════════

    master.to('#phase4-group', {
      attr: { opacity: 0 }, duration: 0.5,
    }, 39.5)

    return () => {
      master.kill()
      destroyDots(cableDotsRef.current)
    }
  }, [])

  // Control timeline playback based on paused/speed props
  useEffect(() => {
    if (!masterRef.current) return
    masterRef.current.timeScale(speed)
    if (paused) {
      masterRef.current.pause()
    } else {
      masterRef.current.resume()
    }
  }, [speed, paused])

  // ═══════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VW} ${VH}`}
      style={{ width: '100%', height: '100%', background: '#090b15', display: 'block' }}
    >
      <defs>
        <filter id="dotGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <filter id="cableGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="flashGrad">
          <stop offset="0%" stopColor="#22D3EE" stopOpacity="0.8" />
          <stop offset="100%" stopColor="#22D3EE" stopOpacity="0" />
        </radialGradient>
      </defs>

      {/* ═══════════════════════════════════════════════════════
          PHASE 1: UNIX FAMILY DRAMA
          ═══════════════════════════════════════════════════════ */}

      <g id="phase1-group">

        {/* Cluster labels */}
        <text x={UNIX_CLUSTER_CENTER.x} y={UNIX_CLUSTER_CENTER.y - 130}
          textAnchor="middle" fill="#4a6080" fontSize={13}
          fontFamily="monospace" fontWeight="700" letterSpacing="2" opacity={0.6}
        >UNIX</text>
        <text x={LINUX_CLUSTER_CENTER.x} y={LINUX_CLUSTER_CENTER.y - 130}
          textAnchor="middle" fill="#4a6080" fontSize={13}
          fontFamily="monospace" fontWeight="700" letterSpacing="2" opacity={0.6}
        >LINUX</text>

        {/* Connectors */}
        <g id="connectors">
          {UNIX_FAMILY?.map(os => {
            const pos = getAbsPos(UNIX_CLUSTER_CENTER, UNIX_POSITIONS[os.id])
            return (
              <line key={`conn-unix-${os.id}`} id={`conn-unix-${os.id}`}
                className="connector-unix"
                x1={POSIX_HUB.x} y1={POSIX_HUB.y} x2={pos.x} y2={pos.y}
                stroke="#1e3048" strokeWidth={2} strokeDasharray="6 4" opacity={0}
              />
            )
          })}
          {LINUX_FAMILY?.map(os => {
            const pos = getAbsPos(LINUX_CLUSTER_CENTER, LINUX_POSITIONS[os.id])
            return (
              <line key={`conn-linux-${os.id}`} id={`conn-linux-${os.id}`}
                className="connector-linux"
                x1={POSIX_HUB.x} y1={POSIX_HUB.y} x2={pos.x} y2={pos.y}
                stroke="#1e3048" strokeWidth={2} strokeDasharray="6 4" opacity={0}
              />
            )
          })}
          <line id="conn-windows-posix"
            x1={POSIX_HUB.x} y1={POSIX_HUB.y} x2={410} y2={550}
            stroke="#3B82F6" strokeWidth={2} strokeDasharray="6 4" opacity={0}
          />
        </g>

        {/* POSIX Hub */}
        <g id="posix-hub" opacity={0} transform={`translate(${POSIX_HUB.x}, ${POSIX_HUB.y})`}>
          <g id="posix-hub-inner" style={{ transformOrigin: '0px 0px', scale: 0 }}>
            <circle cx={0} cy={0} r={55} fill="#06B6D4" opacity={0.15} />
            <circle cx={0} cy={0} r={40} fill="#06B6D4" opacity={0.25} />
            <circle cx={0} cy={0} r={25} fill="#06B6D4" opacity={0.4} />
            <text x={0} y={5} textAnchor="middle" fill="#22D3EE"
              fontSize={14} fontFamily="'Arial Black', Arial, sans-serif"
              fontWeight="900" letterSpacing="2"
            >POSIX</text>
          </g>
        </g>

        {/* Unix Family */}
        {UNIX_FAMILY?.map(os => {
          const pos = getAbsPos(UNIX_CLUSTER_CENTER, UNIX_POSITIONS[os.id])
          const r = SIZE_MAP[os.size] / 2
          return (
            <g key={os.id} id={`node-${os.id}`} opacity={0}
              transform={`translate(${pos.x}, ${pos.y})`}>
              <g id={`node-${os.id}-inner`}
                style={{ transformOrigin: '0px 0px', scale: 0 }}>
                <circle cx={0} cy={0} r={r + 10} fill={os.color} opacity={0.12} filter="url(#dotGlow)" />
                <circle cx={0} cy={0} r={r} fill={os.color} opacity={0.9} />
                <circle cx={0} cy={0} r={r * 0.55} fill="#090b15" opacity={0.4} />
                <text x={0} y={r + 20} textAnchor="middle" fill="#c0ccd8"
                  fontSize={os.size === 'XL' ? 16 : os.size === 'L' ? 14 : 11}
                  fontFamily="'Arial Black', Arial, sans-serif" fontWeight="900"
                >{os.name}</text>
                <text x={0} y={r + 34} textAnchor="middle" fill="#4a6080"
                  fontSize={10} fontFamily="monospace"
                >{os.year}</text>
              </g>
            </g>
          )
        })}

        {/* Linux Family */}
        {LINUX_FAMILY?.map(os => {
          const pos = getAbsPos(LINUX_CLUSTER_CENTER, LINUX_POSITIONS[os.id])
          const r = SIZE_MAP[os.size] / 2
          return (
            <g key={os.id} id={`node-${os.id}`} opacity={0}
              transform={`translate(${pos.x}, ${pos.y})`}>
              <g id={`node-${os.id}-inner`}
                style={{ transformOrigin: '0px 0px', scale: 0 }}>
                <circle cx={0} cy={0} r={r + 10} fill={os.color} opacity={0.12} filter="url(#dotGlow)" />
                <circle cx={0} cy={0} r={r} fill={os.color} opacity={0.9} />
                <circle cx={0} cy={0} r={r * 0.55} fill="#090b15" opacity={0.4} />
                <text x={0} y={r + 20} textAnchor="middle" fill="#c0ccd8"
                  fontSize={os.size === 'XL' ? 16 : os.size === 'L' ? 14 : 11}
                  fontFamily="'Arial Black', Arial, sans-serif" fontWeight="900"
                >{os.name}</text>
                <text x={0} y={r + 34} textAnchor="middle" fill="#4a6080"
                  fontSize={10} fontFamily="monospace"
                >{os.year}</text>
              </g>
            </g>
          )
        })}

        {/* Windows Node */}
        <g id="node-windows" opacity={0} transform="translate(410, 550)">
          <g id="node-windows-inner"
            style={{ transformOrigin: '0px 0px', scale: 0 }}>
            <circle cx={0} cy={0} r={45} fill={WINDOWS.color} opacity={0.12} filter="url(#dotGlow)" />
            <circle cx={0} cy={0} r={35} fill={WINDOWS.color} opacity={0.9} />
            <circle cx={0} cy={0} r={19} fill="#090b15" opacity={0.4} />
            <text x={0} y={55} textAnchor="middle" fill="#c0ccd8"
              fontSize={14} fontFamily="'Arial Black', Arial, sans-serif" fontWeight="900"
            >{WINDOWS.name}</text>
          </g>
        </g>

        {/* Windows Question Mark */}
        <g id="windows-question" opacity={0} transform="translate(410, 500)">
          <text x={0} y={0} textAnchor="middle" fill="#FBBF24"
            fontSize={28} fontFamily="'Arial Black', Arial, sans-serif" fontWeight="900"
          >?</text>
        </g>

        {/* NOT UNIX Label */}
        <g id="not-unix-label" opacity={0}
          transform={`translate(${WINDOWS_CORNER.x}, ${WINDOWS_CORNER.y + 55})`}>
          <rect x={-45} y={-12} width={90} height={24} rx={6} fill="#7F1D1D" opacity={0.8} />
          <text x={0} y={5} textAnchor="middle" fill="#FCA5A5"
            fontSize={11} fontFamily="'Arial Black', Arial, sans-serif"
            fontWeight="900" letterSpacing="1"
          >NOT UNIX</text>
        </g>

        {/* NT Kernel Label */}
        <g id="nt-kernel-label" opacity={0}
          transform={`translate(${WINDOWS_CORNER.x}, ${WINDOWS_CORNER.y + 80})`}>
          <text x={0} y={0} textAnchor="middle" fill="#64748B"
            fontSize={11} fontFamily="monospace" letterSpacing="1"
          >NT Kernel</text>
        </g>

        {/* Thought Bubble */}
        <g id="thought-bubble" opacity={0}
          transform={`translate(${WINDOWS_CORNER.x - 60}, ${WINDOWS_CORNER.y - 80})`}>
          <g id="thought-bubble-inner"
            style={{ transformOrigin: '0px 0px', scale: 0 }}>
            <ellipse cx={0} cy={0} rx={65} ry={28} fill="#1E293B" stroke="#334155" strokeWidth={1.5} />
            <circle cx={-30} cy={35} r={6} fill="#1E293B" stroke="#334155" strokeWidth={1} />
            <circle cx={-20} cy={48} r={4} fill="#1E293B" stroke="#334155" strokeWidth={1} />
            <text x={0} y={5} textAnchor="middle" fill="#94A3B8"
              fontSize={12} fontFamily="sans-serif"
            >butuh teman...</text>
          </g>
        </g>

        {/* Explosion Flash */}
        <circle id="expel-flash" cx={410} cy={400} r={40}
          fill="url(#flashGrad)" opacity={0} />

        {/* WSL Cable */}
        <path id="wsl-cable"
          d={`M ${WINDOWS_CORNER.x} ${WINDOWS_CORNER.y - 35}
              C ${WINDOWS_CORNER.x} ${WINDOWS_CORNER.y - 150},
                ${LINUX_CLUSTER_CENTER.x + LINUX_POSITIONS.ubuntu.x} ${LINUX_CLUSTER_CENTER.y + LINUX_POSITIONS.ubuntu.y + 100},
                ${LINUX_CLUSTER_CENTER.x + LINUX_POSITIONS.ubuntu.x} ${LINUX_CLUSTER_CENTER.y + LINUX_POSITIONS.ubuntu.y + 40}`}
          fill="none" stroke="#22D3EE" strokeWidth={4} strokeLinecap="round"
          strokeDasharray={400} strokeDashoffset={400} opacity={0.8}
        />
        <path id="wsl-cable-glow"
          d={`M ${WINDOWS_CORNER.x} ${WINDOWS_CORNER.y - 35}
              C ${WINDOWS_CORNER.x} ${WINDOWS_CORNER.y - 150},
                ${LINUX_CLUSTER_CENTER.x + LINUX_POSITIONS.ubuntu.x} ${LINUX_CLUSTER_CENTER.y + LINUX_POSITIONS.ubuntu.y + 100},
                ${LINUX_CLUSTER_CENTER.x + LINUX_POSITIONS.ubuntu.x} ${LINUX_CLUSTER_CENTER.y + LINUX_POSITIONS.ubuntu.y + 40}`}
          fill="none" stroke="#22D3EE" strokeWidth={10} strokeLinecap="round"
          strokeDasharray={400} strokeDashoffset={400} opacity={0} filter="url(#cableGlow)"
        />

        {/* Cable Plugs */}
        <g opacity={0.8}
          transform={`translate(${LINUX_CLUSTER_CENTER.x + LINUX_POSITIONS.ubuntu.x}, ${LINUX_CLUSTER_CENTER.y + LINUX_POSITIONS.ubuntu.y + 40})`}>
          <rect x={-8} y={-6} width={16} height={12} rx={3} fill="#22D3EE" />
        </g>
        <g opacity={0.8}
          transform={`translate(${WINDOWS_CORNER.x}, ${WINDOWS_CORNER.y - 35})`}>
          <rect x={-8} y={-6} width={16} height={12} rx={3} fill="#22D3EE" />
        </g>

        {/* Connection Flash */}
        <circle id="connect-flash"
          cx={LINUX_CLUSTER_CENTER.x + LINUX_POSITIONS.ubuntu.x}
          cy={LINUX_CLUSTER_CENTER.y + LINUX_POSITIONS.ubuntu.y + 40}
          r={25} fill="url(#flashGrad)" opacity={0} />

        {/* WSL Label */}
        <g id="wsl-label" opacity={0}
          transform={`translate(${WINDOWS_CORNER.x + 60}, ${WINDOWS_CORNER.y - 100})`}>
          <rect x={-50} y={-14} width={100} height={28} rx={6}
            fill="#06B6D4" opacity={0.2} stroke="#22D3EE" strokeWidth={1} />
          <text x={0} y={5} textAnchor="middle" fill="#22D3EE"
            fontSize={12} fontFamily="monospace" fontWeight="700" letterSpacing="1"
          >WSL</text>
        </g>

        {/* Phase 1 Caption */}
        <g id="phase1-caption" opacity={0} transform="translate(410, 1200)">
          <text x={0} y={0} textAnchor="middle" fill="#64748B"
            fontSize={14} fontFamily="sans-serif" fontStyle="italic"
          >Different roots, but connected</text>
        </g>

      </g>

      {/* ═══════════════════════════════════════════════════════
          PHASE 2: WHERE UNIX LIVES
          ═══════════════════════════════════════════════════════ */}

      <g id="phase2-group" opacity={0}>

        {/* Use Case Cards */}
        {UNIX_USE_CASES?.map((useCase, i) => {
          const yPos = 150 + i * 260
          return (
            <g key={i} id={`usecase-card-${i}`} opacity={0} transform="translate(-50, 0)">
              <rect x={50} y={yPos} width={720} height={220} rx={8}
                fill="#0F172A" stroke={useCase.color} strokeWidth={1} opacity={0.6} />
              <circle cx={100} cy={yPos + 110} r={40}
                fill={useCase.color} opacity={0.3} />
              <text x={100} y={yPos + 120} textAnchor="middle"
                fill={useCase.color} fontSize={24} fontFamily="sans-serif"
              >{useCase.icon}</text>
              <text x={180} y={yPos + 90} fill="#e0e7ff"
                fontSize={16} fontFamily="'Arial Black', Arial, sans-serif" fontWeight="900"
              >{useCase.device}</text>
              <text x={180} y={yPos + 110} fill="#a5b4fc"
                fontSize={12} fontFamily="monospace"
              >{useCase.os}</text>
              <text x={180} y={yPos + 160} fill="#94a3b8"
                fontSize={12} fontFamily="sans-serif"
              >{useCase.usage}</text>
            </g>
          )
        })}

        {/* Phase 2 Caption */}
        <g id="phase2-caption" opacity={0} transform="translate(410, 1200)">
          <text x={0} y={0} textAnchor="middle" fill="#64748B"
            fontSize={14} fontFamily="sans-serif" fontStyle="italic"
          >Still running critical infrastructure</text>
        </g>

      </g>

      {/* ═══════════════════════════════════════════════════════
          PHASE 3: LINUX DOMINANCE
          ═══════════════════════════════════════════════════════ */}

      <g id="phase3-group" opacity={0}>

        {/* Bar Charts */}
        {LINUX_DOMINANCE?.map((stat, i) => {
          const yPos = 150 + i * 200
          return (
            <g key={i}>
              <text x={50} y={yPos + 15} fill="#c0ccd8"
                fontSize={12} fontFamily="monospace" fontWeight="700"
              >{stat.category}</text>

              {/* Linux bar */}
              <rect x={200} y={yPos} width={0} height={30}
                id={`bar-linux-${i}`}
                fill="#06B6D4" opacity={0.8} />
              <text x={620} y={yPos + 20} id={`percent-linux-${i}`}
                fill="#06B6D4" fontSize={12} fontFamily="monospace" fontWeight="700"
              >0%</text>

              {/* Unix bar below */}
              <rect x={200} y={yPos + 40} width={0} height={30}
                id={`bar-unix-${i}`}
                fill="#64748B" opacity={0.6} />
              <text x={620} y={yPos + 60} id={`percent-unix-${i}`}
                fill="#64748B" fontSize={12} fontFamily="monospace" fontWeight="700"
              >0%</text>
            </g>
          )
        })}

        {/* Phase 3 Caption */}
        <g id="phase3-caption" opacity={0} transform="translate(410, 1200)">
          <text x={0} y={0} textAnchor="middle" fill="#64748B"
            fontSize={14} fontFamily="sans-serif" fontStyle="italic"
          >Open source ate the world</text>
        </g>

      </g>

      {/* ═══════════════════════════════════════════════════════
          PHASE 4: POSIX BROTHERS
          ═══════════════════════════════════════════════════════ */}

      <g id="phase4-group" opacity={0}>

        {/* Venn Diagram */}
        <circle id="venn-linux" cx={310} cy={500} r={0}
          fill="#06B6D4" opacity={0.2} stroke="#06B6D4" strokeWidth={2} />
        <circle id="venn-unix" cx={510} cy={500} r={0}
          fill="#64748B" opacity={0.2} stroke="#64748B" strokeWidth={2} />

        {/* Labels */}
        <text id="venn-linux-label" opacity={0} x={280} y={450}
          fill="#06B6D4" fontSize={14} fontFamily="'Arial Black', Arial, sans-serif"
          fontWeight="900"
        >Linux</text>
        <text id="venn-unix-label" opacity={0} x={520} y={450}
          fill="#64748B" fontSize={14} fontFamily="'Arial Black', Arial, sans-serif"
          fontWeight="900"
        >Unix/BSD</text>
        <text id="venn-posix-label" opacity={0} x={410} y={510}
          fill="#22D3EE" fontSize={12} fontFamily="monospace"
          fontWeight="700"
        >POSIX</text>

        {/* Shared Tools */}
        {['ls', 'grep', 'pipe', 'chmod'].map((tool, i) => (
          <text key={tool} id={`tool-${tool}`} opacity={0}
            x={380 + i * 30} y={540}
            fill="#94A3B8" fontSize={10} fontFamily="monospace"
          >{tool}</text>
        ))}

        {/* Phase 4 Caption */}
        <g id="phase4-caption" opacity={0} transform="translate(410, 1150)">
          <text x={0} y={0} textAnchor="middle" fill="#64748B"
            fontSize={14} fontFamily="sans-serif" fontStyle="italic"
          >Different roots, same POSIX DNA</text>
        </g>

      </g>

      {/* Glow Dots Layer */}
      <g ref={dotsLayerRef} filter="url(#dotGlow)" />
    </svg>
  )
}
