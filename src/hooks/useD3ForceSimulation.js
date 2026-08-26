import { useRef, useState, useEffect } from 'react'
import * as d3 from 'd3'

export function useD3ForceSimulation(nodes, links, config) {
  const [positions, setPositions] = useState([])
  const simulationRef = useRef(null)

  useEffect(() => {
    const { width, height, strength, linkDistance, collisionRadius, centerStrength } = config

    const initialNodes = nodes.map((node) => ({
      ...node,
      x: width / 2 + (Math.random() - 0.5) * 300,
      y: height / 2 + (Math.random() - 0.5) * 300
    }))

    const simulation = d3
      .forceSimulation(initialNodes)
      .force('link', d3.forceLink(links).id((d) => d.id).distance(linkDistance))
      .force('charge', d3.forceManyBody().strength(strength))
      .force('center', d3.forceCenter(width / 2, height / 2).strength(centerStrength))
      .force(
        'collision',
        d3
          .forceCollide()
          .radius((d) => collisionRadius || d.size)
          .strength(0.9)
      )
      .alphaDecay(0.08)

    simulation.on('tick', () => {
      setPositions(initialNodes.map((n) => ({ id: n.id, x: n.x, y: n.y })))
    })

    simulationRef.current = simulation

    // stabilize before final render
    for (let i = 0; i < 120; i++) simulation.tick()

    return () => {
      simulation.stop()
      simulationRef.current = null
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nodes, links])

  useEffect(() => {
    if (simulationRef.current) simulationRef.current.alpha(0.001).restart()
  }, [nodes, links, config])

  return { positions, simulation: simulationRef.current }
}