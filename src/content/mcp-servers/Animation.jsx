import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import {
  VW, VH, AI, TOOLS, CONNS, PHASES,
  AI_BOX_W, AI_BOX_H, TOOL_SZ, MCP_Y, COUNTER_START,
} from './data'

// ── Sub-components ────────────────────────────────────

function AIBox({ node }) {
  const bx = node.x - AI_BOX_W / 2
  const by = node.y - AI_BOX_H / 2
  const iconMap = { claude: '✳', cursor: '|', chatgpt: '◷' }
  return (
    <g>
      <rect x={bx} y={by} width={AI_BOX_W} height={AI_BOX_H} rx={10}
        fill="#0a1929" stroke="#1e3f60" strokeWidth={1.5} />
      <circle cx={bx+24} cy={by+21} r={7} fill="#FF5F57" />
      <circle cx={bx+44} cy={by+21} r={7} fill="#FEBC2E" />
      <circle cx={bx+64} cy={by+21} r={7} fill="#28C840" />
      <text x={bx+AI_BOX_W-18} y={by+26} textAnchor="middle"
        fill="#3a7aaa" fontSize={17} fontFamily="monospace">
        {iconMap[node.id]}
      </text>
      <rect x={bx+18} y={by+42} width={AI_BOX_W*0.52} height={5} rx={2.5} fill="#0e2a45" />
      <rect x={bx+18} y={by+52} width={AI_BOX_W*0.38} height={5} rx={2.5} fill="#0e2a45" />
      <rect x={bx+18} y={by+66} width={AI_BOX_W*0.62} height={5} rx={2.5} fill="#0e2a45" />
      <rect x={bx+18} y={by+80} width={AI_BOX_W-52} height={9} rx={3} fill="#0e2a45" />
      <polygon
        points={`${bx+AI_BOX_W-26},${by+81} ${bx+AI_BOX_W-18},${by+85} ${bx+AI_BOX_W-26},${by+89}`}
        fill="#2a5a8a" />
      <text x={node.x} y={by+AI_BOX_H+32} textAnchor="middle"
        fill="#4a8ab0" fontSize={19} fontFamily="monospace" letterSpacing={2.5} fontWeight={600}>
        {node.label}
      </text>
    </g>
  )
}

function ToolIcon({ node }) {
  const sz = TOOL_SZ
  return (
    <g>
      <rect x={node.x-sz} y={node.y-sz} width={sz*2} height={sz*2} rx={18}
        fill="#0d1117" stroke={node.color} strokeWidth={2} />
      {node.id === 'github' && (
        <g>
          <circle cx={node.x} cy={node.y-5} r={18} fill="none" stroke={node.color} strokeWidth={2} />
          <path d={`M${node.x-8} ${node.y+16} L${node.x-8} ${node.y+8} Q${node.x} ${node.y+4} ${node.x+8} ${node.y+8} L${node.x+8} ${node.y+16}`}
            fill="none" stroke={node.color} strokeWidth={2} />
        </g>
      )}
      {node.id === 'postgres' && (
        <g>
          <ellipse cx={node.x} cy={node.y-14} rx={19} ry={8} fill="none" stroke={node.color} strokeWidth={2} />
          <line x1={node.x-19} y1={node.y-14} x2={node.x-19} y2={node.y+14} stroke={node.color} strokeWidth={2} />
          <line x1={node.x+19} y1={node.y-14} x2={node.x+19} y2={node.y+14} stroke={node.color} strokeWidth={2} />
          <ellipse cx={node.x} cy={node.y+14} rx={19} ry={8} fill="none" stroke={node.color} strokeWidth={2} />
        </g>
      )}
      {node.id === 'slack' && (
        <text x={node.x} y={node.y+15} textAnchor="middle"
          fill={node.color} fontSize={46} fontFamily="sans-serif" fontWeight="900">#</text>
      )}
      {node.id === 'gmail' && (
        <g>
          <rect x={node.x-22} y={node.y-15} width={44} height={32} rx={4}
            fill="none" stroke={node.color} strokeWidth={2} />
          <path d={`M${node.x-22} ${node.y-15} L${node.x} ${node.y+4} L${node.x+22} ${node.y-15}`}
            fill="none" stroke={node.color} strokeWidth={2} />
        </g>
      )}
      <text x={node.x} y={node.y+sz+28} textAnchor="middle"
        fill={node.color} fontSize={16} fontFamily="monospace" letterSpacing={1.5} fontWeight={500}>
        {node.label}
      </text>
    </g>
  )
}

function McpBox({ x, y }) {
  return (
    <g>
      <rect x={x-52} y={y-24} width={104} height={48} rx={8}
        fill="#061a14" stroke="#00BFA5" strokeWidth={1.5} />
      <circle cx={x-36} cy={y-10} r={4} fill="#FF5F57" opacity={0.8} />
      <circle cx={x-23} cy={y-10} r={4} fill="#FEBC2E" opacity={0.8} />
      <circle cx={x-10} cy={y-10} r={4} fill="#28C840" opacity={0.8} />
      <text x={x+14} y={y-6} textAnchor="middle" fill="#00BFA5" fontSize={10} fontFamily="monospace">···</text>
      <text x={x} y={y+12} textAnchor="middle"
        fill="#00BFA5" fontSize={15} fontFamily="monospace" fontWeight={700} letterSpacing={2}>MCP</text>
    </g>
  )
}

// ── Main Animation Component ─────────────────────────

export default function MCPServersAnimation({ paused = false }) {
  const svgRef       = useRef(null)
  const dotsLayerRef = useRef(null)
  const timelineRef  = useRef(null)
  const dotsTimelinesRef = useRef([])
  const [phaseIdx,  setPhaseIdx]  = useState(0)
  const [counter,   setCounter]   = useState(COUNTER_START)

  const phase = PHASES[phaseIdx]

  useEffect(() => {
    const dots = dotsLayerRef.current
    if (!dots) return

    const makeDot = (x1, y1, x2, y2, color, delay, dur, gap) => {
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      el.setAttribute('r', '7')
      el.setAttribute('cx', x1); el.setAttribute('cy', y1)
      el.setAttribute('fill', color)
      el.setAttribute('opacity', '0')
      el.setAttribute('filter', 'url(#dotGlow)')
      dots.appendChild(el)
      const tl = gsap.timeline({ repeat: -1, repeatDelay: gap, delay })
      tl.to(el,  { opacity: 0.95, duration: 0.1 })
      tl.to(el,  { attr: { cx: x2, cy: y2 }, duration: dur, ease: 'none' })
      tl.to(el,  { opacity: 0, duration: 0.15 })
      tl.set(el, { attr: { cx: x1, cy: y1 } })
      return { el, tl }
    }

    const p1 = [], p2 = []

    // Phase 1: diagonal chaos dots
    CONNS.forEach(([ai, ti], i) => {
      const an = AI[ai], tn = TOOLS[ti]
      p1.push(makeDot(
        an.x, an.y + AI_BOX_H/2 + 4,
        tn.x, tn.y - TOOL_SZ - 8,
        '#FF006E', i * 0.32, 1.35, 2.8
      ))
    })

    // Phase 2: organized vertical dots (AI→MCP)
    AI.forEach((an, i) => {
      p2.push(makeDot(
        an.x, an.y + AI_BOX_H/2 + 4,
        an.x, MCP_Y,
        '#00BFA5', i * 0.4, 0.75, 2.2
      ))
    })

    // Phase 2: vertical dots (MCP→tool)
    TOOLS.forEach((tn, i) => {
      p2.push(makeDot(
        tn.x, MCP_Y + 70,
        tn.x, tn.y - TOOL_SZ - 8,
        '#00BFA5', i * 0.3 + 0.2, 0.55, 2.2
      ))
    })

    p2.forEach(({ el }) => gsap.set(el, { opacity: 0 }))

    dotsTimelinesRef.current = [...p1, ...p2].map(d => d.tl)

    // Master timeline
    const master = gsap.timeline({ repeat: -1, repeatDelay: 1.5 })
    timelineRef.current = master

    let counterStart = COUNTER_START
    PHASES.forEach((ph, idx) => {
      const startTime = PHASES.slice(0, idx).reduce((s, p) => s + p.duration, 0)
      const c = { v: counterStart }

      if (idx === 0) {
        master.to(c, {
          v: ph.counterEnd, duration: ph.duration,
          onUpdate: () => setCounter(Math.round(c.v)),
        }, startTime)
      } else {
        master.add(() => {
          setPhaseIdx(idx)
          if (idx === 1) {
            p1.forEach(({ el }) => gsap.to(el, { opacity: 0, duration: 0.4 }))
            p2.forEach(({ el }) => gsap.to(el, { opacity: 0.95, duration: 0.4 }))
          }
        }, startTime)
        master.to(c, {
          v: ph.counterEnd, duration: ph.duration,
          onUpdate: () => setCounter(Math.round(c.v)),
        }, startTime)
      }

      counterStart = ph.counterEnd
    })

    const totalDuration = PHASES.reduce((s, p) => s + p.duration, 0)
    master.add(() => {
      setPhaseIdx(0)
      setCounter(COUNTER_START)
      p2.forEach(({ el }) => gsap.set(el, { opacity: 0 }))
    }, totalDuration)

    return () => {
      master.kill()
      ;[...p1, ...p2].forEach(({ tl, el }) => { tl.kill(); el.remove() })
    }
  }, [])

  // Handle Pause / Resume without restarting
  useEffect(() => {
    if (!timelineRef.current) return
    if (paused) {
      timelineRef.current.pause()
      dotsTimelinesRef.current.forEach(t => t && t.pause())
    } else {
      timelineRef.current.resume()
      dotsTimelinesRef.current.forEach(t => t && t.resume())
    }
  }, [paused])

  return (
    <svg ref={svgRef} viewBox={`0 0 ${VW} ${VH}`}
      style={{ width: '100%', height: '100%', maxHeight: '100vh',
        maxWidth: `calc(100vh * ${VW} / ${VH})` }}>

      <defs>
        <filter id="dotGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
        <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      {/* Background */}
      <rect width={VW} height={VH} fill="#090b15" />

      {/* Header */}
      <text x={VW/2} y={68} textAnchor="middle" fill="#444" fontSize={20} fontFamily="sans-serif">
        @krishnachaytanyaa
      </text>
      <text x={VW/2} y={155} textAnchor="middle" fill="white"
        fontSize={84} fontFamily="'Arial Black',Arial,sans-serif" fontWeight={900}>
        {'MCP '}<tspan fill="#4ADE80">Servers</tspan>
      </text>
      <text x={VW/2} y={202} textAnchor="middle" fill="#5B8DD9" fontSize={20} fontFamily="sans-serif">
        <tspan fontWeight={700}>Model Context Protocol</tspan>
        <tspan fill="#3a65b5"> · how AI agents plug into your tools</tspan>
      </text>

      {/* Left badge */}
      <rect x={44} y={234} width={292} height={38} rx={19}
        fill="transparent" stroke={phase.badgeColor} strokeWidth={1.5} />
      <circle cx={64} cy={253} r={5.5} fill={phase.badgeColor} />
      <text x={200} y={259} textAnchor="middle"
        fill={phase.badgeColor} fontSize={14} fontFamily="monospace" letterSpacing={1.2}>
        {phase.badge}
      </text>

      {/* Left integrations */}
      <path d="M 44 283 L 44 275 L 52 275" fill="none" stroke="#223a55" strokeWidth={2} />
      <path d="M 336 283 L 336 275 L 328 275" fill="none" stroke="#223a55" strokeWidth={2} />
      <path d="M 44 368 L 44 376 L 52 376" fill="none" stroke="#223a55" strokeWidth={2} />
      <path d="M 336 368 L 336 376 L 328 376" fill="none" stroke="#223a55" strokeWidth={2} />
      <text x={190} y={345} textAnchor="middle"
        fill="#FF3B8C" fontSize={55} fontFamily="monospace" fontWeight="bold">{phase.integrations}</text>
      <text x={190} y={374} textAnchor="middle"
        fill="#223a55" fontSize={14} fontFamily="monospace" letterSpacing={3}>INTEGRATIONS</text>

      {/* Right question */}
      <rect x={484} y={234} width={292} height={38} rx={19} fill="#111c2a" />
      <text x={630} y={259} textAnchor="middle"
        fill="#556677" fontSize={14} fontFamily="sans-serif" fontStyle="italic">
        what is an MCP server?
      </text>

      {/* Right calls served */}
      <path d="M 484 283 L 484 275 L 492 275" fill="none" stroke="#223a55" strokeWidth={2} />
      <path d="M 776 283 L 776 275 L 768 275" fill="none" stroke="#223a55" strokeWidth={2} />
      <path d="M 484 368 L 484 376 L 492 376" fill="none" stroke="#223a55" strokeWidth={2} />
      <path d="M 776 368 L 776 376 L 768 376" fill="none" stroke="#223a55" strokeWidth={2} />
      <text x={630} y={345} textAnchor="middle"
        fill="#4ADE80" fontSize={55} fontFamily="monospace" fontWeight="bold">{counter}</text>
      <text x={630} y={374} textAnchor="middle"
        fill="#223a55" fontSize={14} fontFamily="monospace" letterSpacing={3}>CALLS SERVED</text>

      {/* AI Boxes */}
      {AI.map(n => <AIBox key={n.id} node={n} />)}

      {/* Background dashed lines */}
      {CONNS.map(([ai, ti], i) => {
        const an = AI[ai], tn = TOOLS[ti]
        return (
          <line key={`bg-${i}`}
            x1={an.x} y1={an.y+AI_BOX_H/2+4}
            x2={tn.x} y2={tn.y-TOOL_SZ-8}
            stroke="#182a3e" strokeWidth={1.5} strokeDasharray="5,9"
            opacity={phase.showMcp ? 0.15 : 0.5} />
        )
      })}

      {/* MCP Layer */}
      {phase.showMcp && (
        <g>
          <line x1={38} y1={MCP_Y} x2={782} y2={MCP_Y}
            stroke="#00BFA5" strokeWidth={2} strokeDasharray="6,5"
            opacity={0.65} filter="url(#lineGlow)" />
          <rect x={598} y={MCP_Y-16} width={184} height={32} rx={16} fill="#061a14" />
          <text x={690} y={MCP_Y+7} textAnchor="middle"
            fill="#00BFA5" fontSize={13} fontFamily="monospace" letterSpacing={0.8}>
            MCP · one standard
          </text>
          {AI.map(an => (
            <line key={`ai-mcp-${an.id}`}
              x1={an.x} y1={an.y+AI_BOX_H/2+4} x2={an.x} y2={MCP_Y}
              stroke="#00BFA5" strokeWidth={1.5} strokeDasharray="5,6" opacity={0.45} />
          ))}
          {TOOLS.map(tn => <McpBox key={`mcp-${tn.id}`} x={tn.x} y={MCP_Y+65} />)}
          {TOOLS.map(tn => (
            <line key={`mcp-tool-${tn.id}`}
              x1={tn.x} y1={MCP_Y+90} x2={tn.x} y2={tn.y-TOOL_SZ-8}
              stroke="#00BFA5" strokeWidth={1.5} strokeDasharray="5,6" opacity={0.45} />
          ))}
        </g>
      )}

      {/* MCP Tooltip */}
      {phase.showTooltip && (
        <g>
          <rect x={162} y={666} width={238} height={122} rx={12}
            fill="#040f18" stroke="#00BFA5" strokeWidth={1.5} opacity={0.95} />
          <text x={180} y={692} fill="#00BFA5" fontSize={13} fontFamily="monospace" fontWeight={700}>
            MCP SERVER · tools/list
          </text>
          <text x={180} y={718} fill="#4ADE80" fontSize={13} fontFamily="monospace">• read_file</text>
          <text x={180} y={742} fill="#4ADE80" fontSize={13} fontFamily="monospace">• create_pr</text>
          <text x={180} y={766} fill="#4ADE80" fontSize={13} fontFamily="monospace">• list_repos</text>
        </g>
      )}

      {/* Tool Icons */}
      {TOOLS.map(n => <ToolIcon key={n.id} node={n} />)}

      {/* Dots layer */}
      <g ref={dotsLayerRef} />

      {/* Caption */}
      <rect x={55} y={1180} width={710} height={52} rx={26} fill="#0d1320" />
      <text x={VW/2} y={1213} textAnchor="middle" fill="#aaaaaa" fontSize={19} fontFamily="sans-serif">
        {phase.caption}
      </text>

      {/* Footer */}
      {phase.showFooter && (
        <g>
          <text x={VW/2} y={1265} textAnchor="middle"
            fill="#2a4060" fontSize={15} fontFamily="monospace">
            MCP = N×M → N+M · one standard server per tool
          </text>
          <text x={VW/2} y={1290} textAnchor="middle"
            fill="#2a4060" fontSize={14} fontFamily="monospace" letterSpacing={2}>
            ANTHROPIC · OPENAI · CLAUDE · CURSOR
          </text>
        </g>
      )}
    </svg>
  )
}
