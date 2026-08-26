import { useRef, useEffect } from 'react'
import * as d3 from 'd3'
import { ANIMATION_CONFIG } from '../utils/animationConfig'
import { COLOR_MAP } from '../utils/colorScheme'
import { useD3ForceSimulation } from '../hooks/useD3ForceSimulation'

export default function NetworkDiagram({ nodes, links, activeLinks }) {
  const svgRef = useRef(null)
  const { WIDTH, HEIGHT, GLOW_BLUR, GLOW_FILTER } = ANIMATION_CONFIG.SVG_CONFIG
  const { STRENGTH, LINK_DISTANCE, COLLISION_RADIUS, CENTER_STRENGTH } =
    ANIMATION_CONFIG.FORCE_CONFIG

  const { positions } = useD3ForceSimulation(nodes, links, {
    width: WIDTH,
    height: HEIGHT,
    strength: STRENGTH,
    linkDistance: LINK_DISTANCE,
    collisionRadius: COLLISION_RADIUS,
    centerStrength: CENTER_STRENGTH
  })

  const posMap = positions.reduce((map, p) => {
    map[p.id] = p
    return map
  }, {})

  const linkKeys = new Set(activeLinks.map((l) => `${l.source}-${l.target}`))

  const getColor = (colorName) => COLOR_MAP[colorName] || ANIMATION_CONFIG.COLORS.PRIMARY_CYAN

  return (
    <svg ref={svgRef} width={WIDTH} height={HEIGHT} className="network-svg">
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation={GLOW_BLUR} result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        <radialGradient id="nodeGradient">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="60%" stopColor="#00D9FF" />
          <stop offset="100%" stopColor="#0066ff" />
        </radialGradient>
      </defs>

      {links.map((link, i) => {
        const src = posMap[link.source]
        const tgt = posMap[link.target]
        if (!src || !tgt) return null
        const active = linkKeys.has(`${link.source}-${link.target}`)
        return (
          <line
            key={`${link.source}-${link.target}-${i}`}
            x1={src.x}
            y1={src.y}
            x2={tgt.x}
            y2={tgt.y}
            className="link-line"
            style={{
              stroke: active ? getColor(link.color) : 'rgba(255,255,255,0.08)',
              fill: 'none',
              strokeWidth: active ? 2 : 1,
              strokeDasharray: active ? '6 6' : '2 4'
            }}
          />
        )
      })}

      {nodes.map((node) => {
        const pos = posMap[node.id]
        if (!pos) return null
        const isAi = node.type === 'ai-model'
        return (
          <g key={node.id} transform={`translate(${pos.x},${pos.y})`}>
            <circle
              r={node.size}
              className="node-base"
              style={{
                fill: isAi ? 'url(#nodeGradient)' : ANIMATION_CONFIG.COLORS.DARK_BG,
                stroke: isAi
                  ? ANIMATION_CONFIG.COLORS.PRIMARY_CYAN
                  : ANIMATION_CONFIG.COLORS.SECONDARY_PINK,
                strokeWidth: 3,
                filter: GLOW_FILTER
              }}
            />
            <circle r={node.size + 6} className="node-halo" fill="none" stroke="rgba(0,217,255,0.15)" strokeWidth={1} />
            <text fill="#ffffff" textAnchor="middle" dy={isAi ? -node.size - 12 : 0} style={{ fontFamily: 'monospace', fontSize: isAi ? 18 : 14, letterSpacing: 1 }}>
              {node.label}
            </text>
            <text textAnchor="middle" dy={node.size + 18} fill="rgba(255,255,255,0.35)" style={{ fontFamily: 'monospace', fontSize: 11 }}>
              {node.type === 'ai-model' ? 'AI MODEL' : 'SERVER'}
            </text>
          </g>
        )
      })}
    </svg>
  )
}