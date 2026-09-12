import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { VW, VH, PHASES, COUNTER_START } from './data'

export default function ProcessVsThreadAnimation() {
  const svgRef = useRef(null)
  const dotsLayerRef = useRef(null)
  const [phaseIdx, setPhaseIdx] = useState(0)
  const [counter, setCounter] = useState(COUNTER_START)

  const phase = PHASES[phaseIdx]

  useEffect(() => {
    // TODO: Implement animation
  }, [])

  return (
    <svg ref={svgRef} viewBox={`0 0 ${VW} ${VH}`}
      style={{ width: '100%', height: '100%', maxHeight: '100vh',
        maxWidth: `calc(100vh * ${VW} / ${VH})` }}>

      <defs>
        <filter id="dotGlow" x="-80%" y="-80%" width="260%" height="260%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
          <feMerge><feMergeNode in="blur"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>

      <rect width={VW} height={VH} fill="#090b15" />

      <g ref={dotsLayerRef} />
    </svg>
  )
}
