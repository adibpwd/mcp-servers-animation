import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import '../styles/MCPAnimation.css'

// ═══════════════════════════════════════════════════
// LAYOUT — viewBox 820 × 1340 (portrait 9:16-ish)
// ═══════════════════════════════════════════════════
const VW = 820
const VH = 1340

// AI model boxes — center positions
const AI = [
  { id: 'claude',  label: 'CLAUDE',  x: 190, y: 490 },
  { id: 'cursor',  label: 'CURSOR',  x: 410, y: 490 },
  { id: 'chatgpt', label: 'CHATGPT', x: 630, y: 490 },
]

// Tool icon nodes — center positions
const TOOLS = [
  { id: 'github',   label: 'GITHUB',   x: 155, y: 1080, color: '#F59E0B' },
  { id: 'postgres', label: 'POSTGRES', x: 330, y: 1080, color: '#3B82F6' },
  { id: 'slack',    label: 'SLACK',    x: 500, y: 1080, color: '#8B5CF6' },
  { id: 'gmail',    label: 'GMAIL',    x: 665, y: 1080, color: '#EF4444' },
]

const AI_BOX_W  = 218   // width of each AI terminal box
const AI_BOX_H  = 100   // height
const TOOL_SZ   = 54    // half-size of tool icon square
const MCP_Y     = 830   // Y position of horizontal MCP layer line

// All 12 N×M connections (indices into AI[] and TOOLS[])
const CONNS = []
for (let a = 0; a < 3; a++)
  for (let t = 0; t < 4; t++)
    CONNS.push([a, t])

// 4 animation phases
const PHASES = [
  {
    badge:       'CUSTOM GLUE · N×M',
    badgeColor:  '#FF3B8C',
    integrations: 12,
    caption:     'Every AI needs custom code for every tool.',
    showMcp:     false,
    showTooltip: false,
    showFooter:  false,
  },
  {
    badge:       'ONE SERVER PER TOOL',
    badgeColor:  '#4ADE80',
    integrations: 8,
    caption:     'MCP puts one standard server on each tool.',
    showMcp:     true,
    showTooltip: false,
    showFooter:  false,
  },
  {
    badge:       'tools/list · tools/call',
    badgeColor:  '#00D9FF',
    integrations: 7,
    caption:     'Any AI can list its tools, then call them.',
    showMcp:     true,
    showTooltip: true,
    showFooter:  false,
  },
  {
    badge:       'WRITE ONCE · USE ANYWHERE',
    badgeColor:  '#FFD60A',
    integrations: 7,
    caption:     'Build it once. Every AI connects.',
    showMcp:     true,
    showTooltip: false,
    showFooter:  true,
  },
]

// ═══════════════════════════════════════════════════
// COMPONENT
// ═══════════════════════════════════════════════════
export function MCPAnimation() {
  const svgRef       = useRef(null)
  const dotsLayerRef = useRef(null)

  const [phaseIdx, setPhaseIdx]   = useState(0)
  const [counter,  setCounter]    = useState(14)

  const phase = PHASES[phaseIdx]

  // ─── GSAP animation engine ───────────────────────
  useEffect(() => {
    const svg  = svgRef.current
    const dots = dotsLayerRef.current
    if (!svg || !dots) return

    // Helper: create one animated glowing dot
    const makeDot = (x1, y1, x2, y2, color, delay, dur, gap) => {
      const el = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      el.setAttribute('r', '7')
      el.setAttribute('cx', x1)
      el.setAttribute('cy', y1)
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

    const p1Dots = []  // chaos diagonal dots (phase 1)
    const p2Dots = []  // organised MCP dots  (phase 2+)

    // ── Phase 1 dots: all 12 diagonal connections ──
    CONNS.forEach(([ai, ti], i) => {
      const an = AI[ai]
      const tn = TOOLS[ti]
      const x1 = an.x
      const y1 = an.y + AI_BOX_H / 2 + 4
      const x2 = tn.x
      const y2 = tn.y - TOOL_SZ - 8
      const d  = makeDot(x1, y1, x2, y2, '#FF006E', i * 0.32, 1.35, 2.8)
      p1Dots.push(d)
    })

    // ── Phase 2 dots: AI → MCP line ──
    AI.forEach((an, i) => {
      const y1 = an.y + AI_BOX_H / 2 + 4
      const d  = makeDot(an.x, y1, an.x, MCP_Y, '#00BFA5', i * 0.4, 0.75, 2.2)
      p2Dots.push(d)
    })

    // ── Phase 2 dots: MCP box → tool ──
    TOOLS.forEach((tn, i) => {
      const y1 = MCP_Y + 70
      const y2 = tn.y - TOOL_SZ - 8
      const d  = makeDot(tn.x, y1, tn.x, y2, '#00BFA5', i * 0.3 + 0.2, 0.55, 2.2)
      p2Dots.push(d)
    })

    // All phase2 dots start hidden
    p2Dots.forEach(({ el }) => gsap.set(el, { opacity: 0 }))

    // ── Master timeline ──────────────────────────────
    const master = gsap.timeline({ repeat: -1, repeatDelay: 1.5 })

    // Phase 1 → counter 14..20 (0-5s)
    const c1 = { v: 14 }
    master.to(c1, {
      v: 20, duration: 5,
      onUpdate: () => setCounter(Math.round(c1.v)),
    }, 0)

    // → Phase 2 (5s)
    master.add(() => {
      setPhaseIdx(1)
      p1Dots.forEach(({ el }) => gsap.to(el, { opacity: 0, duration: 0.4 }))
      p2Dots.forEach(({ el }) => gsap.to(el, { opacity: 0.95, duration: 0.4 }))
    }, 5)
    const c2 = { v: 20 }
    master.to(c2, {
      v: 24, duration: 5,
      onUpdate: () => setCounter(Math.round(c2.v)),
    }, 5)

    // → Phase 3 (10s)
    master.add(() => setPhaseIdx(2), 10)
    const c3 = { v: 24 }
    master.to(c3, {
      v: 27, duration: 4,
      onUpdate: () => setCounter(Math.round(c3.v)),
    }, 10)

    // → Phase 4 (14s)
    master.add(() => setPhaseIdx(3), 14)
    const c4 = { v: 27 }
    master.to(c4, {
      v: 29, duration: 3,
      onUpdate: () => setCounter(Math.round(c4.v)),
    }, 14)

    // Reset for next loop (17s)
    master.add(() => {
      setPhaseIdx(0)
      setCounter(14)
      p2Dots.forEach(({ el }) => gsap.set(el, { opacity: 0 }))
      p1Dots.forEach(({ el }) => gsap.set(el, { opacity: 0 }))
    }, 17)

    return () => {
      master.kill()
      p1Dots.forEach(({ tl, el }) => { tl.kill(); el.remove() })
      p2Dots.forEach(({ tl, el }) => { tl.kill(); el.remove() })
    }
  }, [])

  // ─── SVG sub-renderers ───────────────────────────

  const AIBox = ({ node }) => {
    const bx = node.x - AI_BOX_W / 2
    const by = node.y - AI_BOX_H / 2
    const iconMap = { claude: '✳', cursor: '|', chatgpt: '◷' }
    return (
      <g>
        {/* Box */}
        <rect x={bx} y={by} width={AI_BOX_W} height={AI_BOX_H} rx={10}
          fill="#0a1929" stroke="#1e3f60" strokeWidth={1.5} />
        {/* Traffic lights */}
        <circle cx={bx + 24} cy={by + 21} r={7} fill="#FF5F57" />
        <circle cx={bx + 44} cy={by + 21} r={7} fill="#FEBC2E" />
        <circle cx={bx + 64} cy={by + 21} r={7} fill="#28C840" />
        {/* Top-right icon */}
        <text x={bx + AI_BOX_W - 18} y={by + 26} textAnchor="middle"
          fill="#3a7aaa" fontSize={17} fontFamily="monospace">
          {iconMap[node.id]}
        </text>
        {/* Content lines */}
        <rect x={bx + 18} y={by + 42} width={AI_BOX_W * 0.52} height={5} rx={2.5} fill="#0e2a45" />
        <rect x={bx + 18} y={by + 52} width={AI_BOX_W * 0.38} height={5} rx={2.5} fill="#0e2a45" />
        <rect x={bx + 18} y={by + 66} width={AI_BOX_W * 0.62} height={5} rx={2.5} fill="#0e2a45" />
        {/* Progress bar */}
        <rect x={bx + 18} y={by + 80} width={AI_BOX_W - 52} height={9} rx={3} fill="#0e2a45" />
        <polygon
          points={`${bx + AI_BOX_W - 26},${by + 81} ${bx + AI_BOX_W - 18},${by + 85} ${bx + AI_BOX_W - 26},${by + 89}`}
          fill="#2a5a8a"
        />
        {/* Label */}
        <text x={node.x} y={by + AI_BOX_H + 32} textAnchor="middle"
          fill="#4a8ab0" fontSize={19} fontFamily="monospace" letterSpacing={2.5} fontWeight={600}>
          {node.label}
        </text>
      </g>
    )
  }

  const ToolIcon = ({ node }) => {
    const sz = TOOL_SZ
    return (
      <g>
        {/* Square icon box */}
        <rect x={node.x - sz} y={node.y - sz} width={sz * 2} height={sz * 2} rx={18}
          fill="#0d1117" stroke={node.color} strokeWidth={2} />
        {/* Per-tool icon */}
        {node.id === 'github' && (
          <g>
            <circle cx={node.x} cy={node.y - 5} r={18} fill="none" stroke={node.color} strokeWidth={2} />
            <path d={`M ${node.x - 8} ${node.y + 16} L ${node.x - 8} ${node.y + 8} Q ${node.x} ${node.y + 4} ${node.x + 8} ${node.y + 8} L ${node.x + 8} ${node.y + 16}`}
              fill="none" stroke={node.color} strokeWidth={2} />
          </g>
        )}
        {node.id === 'postgres' && (
          <g>
            <ellipse cx={node.x} cy={node.y - 14} rx={19} ry={8} fill="none" stroke={node.color} strokeWidth={2} />
            <line x1={node.x - 19} y1={node.y - 14} x2={node.x - 19} y2={node.y + 14} stroke={node.color} strokeWidth={2} />
            <line x1={node.x + 19} y1={node.y - 14} x2={node.x + 19} y2={node.y + 14} stroke={node.color} strokeWidth={2} />
            <ellipse cx={node.x} cy={node.y + 14} rx={19} ry={8} fill="none" stroke={node.color} strokeWidth={2} />
          </g>
        )}
        {node.id === 'slack' && (
          <text x={node.x} y={node.y + 15} textAnchor="middle"
            fill={node.color} fontSize={46} fontFamily="sans-serif" fontWeight="900">#</text>
        )}
        {node.id === 'gmail' && (
          <g>
            <rect x={node.x - 22} y={node.y - 15} width={44} height={32} rx={4}
              fill="none" stroke={node.color} strokeWidth={2} />
            <path d={`M ${node.x - 22} ${node.y - 15} L ${node.x} ${node.y + 4} L ${node.x + 22} ${node.y - 15}`}
              fill="none" stroke={node.color} strokeWidth={2} />
          </g>
        )}
        {/* Label */}
        <text x={node.x} y={node.y + sz + 28} textAnchor="middle"
          fill={node.color} fontSize={16} fontFamily="monospace" letterSpacing={1.5} fontWeight={500}>
          {node.label}
        </text>
      </g>
    )
  }

  const McpBox = ({ x, y }) => (
    <g>
      <rect x={x - 52} y={y - 24} width={104} height={48} rx={8}
        fill="#061a14" stroke="#00BFA5" strokeWidth={1.5} />
      <circle cx={x - 36} cy={y - 10} r={4} fill="#FF5F57" opacity={0.8} />
      <circle cx={x - 23} cy={y - 10} r={4} fill="#FEBC2E" opacity={0.8} />
      <circle cx={x - 10} cy={y - 10} r={4} fill="#28C840" opacity={0.8} />
      <text x={x + 14} y={y - 6} textAnchor="middle"
        fill="#00BFA5" fontSize={10} fontFamily="monospace">···</text>
      <text x={x} y={y + 12} textAnchor="middle"
        fill="#00BFA5" fontSize={15} fontFamily="monospace" fontWeight={700} letterSpacing={2}>MCP</text>
    </g>
  )

  // ─── Render ──────────────────────────────────────
  return (
    <div className="mcp-wrapper">
      <svg ref={svgRef} viewBox={`0 0 ${VW} ${VH}`} className="mcp-svg">

        {/* ── FILTERS ── */}
        <defs>
          <filter id="dotGlow" x="-80%" y="-80%" width="260%" height="260%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="lineGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur in="SourceGraphic" stdDeviation="2.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* ── BACKGROUND ── */}
        <rect width={VW} height={VH} fill="#090b15" />

        {/* ── HEADER ── */}
        <text x={VW / 2} y={68} textAnchor="middle"
          fill="#444" fontSize={20} fontFamily="sans-serif">
          @krishnachaytanyaa
        </text>
        <text x={VW / 2} y={155} textAnchor="middle"
          fill="white" fontSize={84} fontFamily="'Arial Black', Arial, sans-serif" fontWeight={900}>
          {'MCP '}
          <tspan fill="#4ADE80">Servers</tspan>
        </text>
        <text x={VW / 2} y={202} textAnchor="middle"
          fill="#5B8DD9" fontSize={20} fontFamily="sans-serif">
          <tspan fontWeight={700}>Model Context Protocol</tspan>
          <tspan fill="#3a65b5"> · how AI agents plug into your tools</tspan>
        </text>

        {/* ── STATS ROW ── */}

        {/* Left badge pill */}
        <rect x={44} y={234} width={292} height={38} rx={19}
          fill="transparent" stroke={phase.badgeColor} strokeWidth={1.5} />
        <circle cx={64} cy={253} r={5.5} fill={phase.badgeColor} />
        <text x={200} y={259} textAnchor="middle"
          fill={phase.badgeColor} fontSize={14} fontFamily="monospace" letterSpacing={1.2}>
          {phase.badge}
        </text>

        {/* Left integrations - corner brackets */}
        <path d="M 44 283 L 44 275 L 52 275" fill="none" stroke="#223a55" strokeWidth={2} />
        <path d="M 336 283 L 336 275 L 328 275" fill="none" stroke="#223a55" strokeWidth={2} />
        <path d="M 44 368 L 44 376 L 52 376" fill="none" stroke="#223a55" strokeWidth={2} />
        <path d="M 336 368 L 336 376 L 328 376" fill="none" stroke="#223a55" strokeWidth={2} />
        <text x={190} y={345} textAnchor="middle"
          fill="#FF3B8C" fontSize={55} fontFamily="monospace" fontWeight="bold">
          {phase.integrations}
        </text>
        <text x={190} y={374} textAnchor="middle"
          fill="#223a55" fontSize={14} fontFamily="monospace" letterSpacing={3}>
          INTEGRATIONS
        </text>

        {/* Right question box */}
        <rect x={484} y={234} width={292} height={38} rx={19} fill="#111c2a" />
        <text x={630} y={259} textAnchor="middle"
          fill="#556677" fontSize={14} fontFamily="sans-serif" fontStyle="italic">
          what is an MCP server?
        </text>

        {/* Right calls served - corner brackets */}
        <path d="M 484 283 L 484 275 L 492 275" fill="none" stroke="#223a55" strokeWidth={2} />
        <path d="M 776 283 L 776 275 L 768 275" fill="none" stroke="#223a55" strokeWidth={2} />
        <path d="M 484 368 L 484 376 L 492 376" fill="none" stroke="#223a55" strokeWidth={2} />
        <path d="M 776 368 L 776 376 L 768 376" fill="none" stroke="#223a55" strokeWidth={2} />
        <text x={630} y={345} textAnchor="middle"
          fill="#4ADE80" fontSize={55} fontFamily="monospace" fontWeight="bold">
          {counter}
        </text>
        <text x={630} y={374} textAnchor="middle"
          fill="#223a55" fontSize={14} fontFamily="monospace" letterSpacing={3}>
          CALLS SERVED
        </text>

        {/* ── AI MODEL BOXES ── */}
        {AI.map(n => <AIBox key={n.id} node={n} />)}

        {/* ── BACKGROUND DASHED LINES (N×M) ── */}
        {CONNS.map(([ai, ti], i) => {
          const an = AI[ai]
          const tn = TOOLS[ti]
          return (
            <line key={`bg-${i}`}
              x1={an.x} y1={an.y + AI_BOX_H / 2 + 4}
              x2={tn.x} y2={tn.y - TOOL_SZ - 8}
              stroke="#182a3e"
              strokeWidth={1.5}
              strokeDasharray="5,9"
              opacity={phase.showMcp ? 0.18 : 0.5}
            />
          )
        })}

        {/* ── MCP LAYER (phase 2-4) ── */}
        {phase.showMcp && (
          <g>
            {/* Horizontal MCP standard line */}
            <line x1={38} y1={MCP_Y} x2={782} y2={MCP_Y}
              stroke="#00BFA5" strokeWidth={2} strokeDasharray="6,5" opacity={0.65}
              filter="url(#lineGlow)" />

            {/* Label */}
            <rect x={598} y={MCP_Y - 16} width={184} height={32} rx={16} fill="#061a14" />
            <text x={690} y={MCP_Y + 7} textAnchor="middle"
              fill="#00BFA5" fontSize={13} fontFamily="monospace" letterSpacing={0.8}>
              MCP · one standard
            </text>

            {/* Vertical lines: AI → MCP line */}
            {AI.map(an => (
              <line key={`ai-mcp-${an.id}`}
                x1={an.x} y1={an.y + AI_BOX_H / 2 + 4}
                x2={an.x} y2={MCP_Y}
                stroke="#00BFA5" strokeWidth={1.5} strokeDasharray="5,6" opacity={0.45} />
            ))}

            {/* MCP boxes above each tool */}
            {TOOLS.map(tn => (
              <McpBox key={`mcpbox-${tn.id}`} x={tn.x} y={MCP_Y + 65} />
            ))}

            {/* Vertical lines: MCP box → tool */}
            {TOOLS.map(tn => (
              <line key={`mcp-tool-${tn.id}`}
                x1={tn.x} y1={MCP_Y + 90}
                x2={tn.x} y2={tn.y - TOOL_SZ - 8}
                stroke="#00BFA5" strokeWidth={1.5} strokeDasharray="5,6" opacity={0.45} />
            ))}
          </g>
        )}

        {/* ── MCP TOOLTIP (phase 3) ── */}
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

        {/* ── TOOL ICONS ── */}
        {TOOLS.map(n => <ToolIcon key={n.id} node={n} />)}

        {/* ── DOTS LAYER (GSAP managed imperatively) ── */}
        <g ref={dotsLayerRef} />

        {/* ── CAPTION ── */}
        <rect x={55} y={1180} width={710} height={52} rx={26} fill="#0d1320" />
        <text x={VW / 2} y={1213} textAnchor="middle"
          fill="#aaaaaa" fontSize={19} fontFamily="sans-serif">
          {phase.caption}
        </text>

        {/* ── FOOTER (phase 4 only) ── */}
        {phase.showFooter && (
          <g>
            <text x={VW / 2} y={1263} textAnchor="middle"
              fill="#2a4060" fontSize={15} fontFamily="monospace" letterSpacing={0.5}>
              MCP = N×M → N+M · one standard server per tool
            </text>
            <text x={VW / 2} y={1288} textAnchor="middle"
              fill="#2a4060" fontSize={14} fontFamily="monospace" letterSpacing={2}>
              ANTHROPIC · OPENAI · CLAUDE · CURSOR
            </text>
          </g>
        )}

      </svg>
    </div>
  )
}
