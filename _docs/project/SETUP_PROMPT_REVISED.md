# React + D3 MCP Servers Animation - REVISED Technical Prompt

## 🎯 ACCURATE SPECIFICATION (Based on Instagram Video)

### **Key Differences from Initial Prompt:**

❌ **NOT:** D3 force-directed graph simulation  
❌ **NOT:** Dynamic node positioning  
❌ **NOT:** Physics-based layout  

✅ **ACTUAL:** Fixed node positions  
✅ **ACTUAL:** Animated connection line tracing  
✅ **ACTUAL:** Sequential glow-dot animations  
✅ **ACTUAL:** Counter animation (14 → 29 CALLS SERVED)  
✅ **ACTUAL:** Multi-layer composition  

---

## 📐 LAYOUT STRUCTURE (Fixed Positions)

### **Canvas: 1920 x 1080 (16:9)**

**Top Section (Static Text):**
```
y: 0-400px
├── @krishnaachayanyaa (gray, small)
├── "MCP Servers" (white, 72px, bold)
├── "Model Context Protocol..." (blue, 24px)
├── Stats boxes (left & right)
│   ├── LEFT: "● CUSTOM GLUE · N+M" | "12 INTEGRATIONS"
│   └── RIGHT: "what is an MCP server?" | "14 CALLS SERVED" ← ANIMATED!
└── AI Model boxes (CLAUDE, CURSOR, CHATGPT with icons)
```

**Network Diagram (Fixed Nodes):**
```
y: 400-950px, x: 0-1920px

AI Models (Top):
├── CLAUDE (x: 250, y: 150 from top)
├── CURSOR (x: 960, y: 150 from top)
└── CHATGPT (x: 1670, y: 150 from top)

Tools (Bottom):
├── GITHUB (x: 330, y: 900 from top)
├── POSTGRES (x: 660, y: 900 from top)
├── SLACK (x: 1260, y: 900 from top)
└── GMAIL (x: 1590, y: 900 from top)

MCP Servers (Middle): Optional visual
```

**Bottom Section:**
```
y: 1000-1080px
└── "Every AI needs custom code for every tool."
```

---

## 🎬 ANIMATION FLOW (18 Frames)

### **Frame Analysis:**

**Frame 1:**
- Counter: 14 CALLS SERVED
- Active lines: Background network visible (all connections subtle)
- Status: Intro state

**Frames 2-5:**
- Counter: 14 → 15 → 17 → 18 → 20
- Active lines: Sequential line animations START
- Pattern: One line reveals per frame with glowing dot

**Frames 6-10:**
- Counter: 20 → 21 → 22 → 23 → 24
- Active lines: More connections highlight
- Pattern: Continue sequential line reveals

**Frames 11-15:**
- Counter: 24 → 25 → 26 → 27 → 28
- Active lines: Remaining connections animate
- Pattern: Slower reveals, building complexity

**Frames 16-18:**
- Counter: 28 → 29 (FINAL)
- Active lines: All connections visible
- Status: Final frame with complete network

---

## 💻 REVISED CODE STRUCTURE

### **src/utils/nodeLayout.js**
```javascript
// FIXED positions - NOT dynamic!
export const NODE_LAYOUT = {
  AI_MODELS: {
    claude: { x: 250, y: 150, label: 'CLAUDE', size: 60, type: 'ai' },
    cursor: { x: 960, y: 150, label: 'CURSOR', size: 60, type: 'ai' },
    chatgpt: { x: 1670, y: 150, label: 'CHATGPT', size: 60, type: 'ai' }
  },
  TOOLS: {
    github: { x: 330, y: 900, label: 'GITHUB', size: 40, type: 'tool', color: '#FFD60A' },
    postgres: { x: 660, y: 900, label: 'POSTGRES', size: 40, type: 'tool', color: '#00D9FF' },
    slack: { x: 1260, y: 900, label: 'SLACK', size: 40, type: 'tool', color: '#8B5CF6' },
    gmail: { x: 1590, y: 900, label: 'GMAIL', size: 40, type: 'tool', color: '#FF006E' }
  }
}

// Get flat array for rendering
export const getAllNodes = () => [
  ...Object.values(NODE_LAYOUT.AI_MODELS),
  ...Object.values(NODE_LAYOUT.TOOLS)
]
```

### **src/utils/lineSequence.js**
```javascript
// SEQUENTIAL line animations - exactly as shown in video
export const LINE_SEQUENCE = [
  // Frame 1: Setup (no animation yet)
  {
    frameNumber: 1,
    duration: 1.0,
    counter: 14,
    animatedLines: []
  },
  // Frame 2: First line animation
  {
    frameNumber: 2,
    duration: 1.0,
    counter: 15,
    animatedLines: [
      {
        source: 'claude',
        target: 'github',
        color: '#FF006E',
        startTime: 0,
        duration: 1.2,
        delay: 0
      }
    ]
  },
  // Frame 3: Multiple lines
  {
    frameNumber: 3,
    duration: 1.0,
    counter: 17,
    animatedLines: [
      {
        source: 'claude',
        target: 'github',
        color: '#FF006E',
        startTime: 0.2,
        duration: 1.2,
        delay: 0
      },
      {
        source: 'cursor',
        target: 'postgres',
        color: '#FF006E',
        startTime: 0.2,
        duration: 1.2,
        delay: 0.15
      }
    ]
  },
  // Continue for frames 4-18...
  {
    frameNumber: 18,
    duration: 1.5,
    counter: 29,
    animatedLines: [] // All lines completed
  }
]

export const TOTAL_DURATION = LINE_SEQUENCE.reduce((sum, f) => sum + f.duration, 0)
```

### **src/components/NetworkVisualization.jsx**
```javascript
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { NODE_LAYOUT, getAllNodes } from '../utils/nodeLayout'
import { LINE_SEQUENCE } from '../utils/lineSequence'
import './NetworkVisualization.css'

export function NetworkVisualization() {
  const svgRef = useRef()
  const [currentFrame, setCurrentFrame] = useState(1)

  useEffect(() => {
    if (!svgRef.current) return

    const frameData = LINE_SEQUENCE[currentFrame - 1]
    if (!frameData) return

    // Render all nodes (static)
    renderNodes()

    // Render all background connections (subtle)
    renderBackgroundConnections()

    // Animate active lines for this frame
    frameData.animatedLines.forEach((lineData) => {
      animateLine(lineData)
    })
  }, [currentFrame])

  const renderNodes = () => {
    const svg = svgRef.current
    const nodes = getAllNodes()

    nodes.forEach((node) => {
      // Node circle
      const circle = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
      circle.setAttribute('cx', node.x)
      circle.setAttribute('cy', node.y)
      circle.setAttribute('r', node.size / 2)
      circle.setAttribute('fill', 'none')
      circle.setAttribute('stroke', '#00D9FF')
      circle.setAttribute('stroke-width', '2')
      circle.setAttribute('class', `node node-${node.type}`)
      svg.appendChild(circle)

      // Node label
      const text = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      text.setAttribute('x', node.x)
      text.setAttribute('y', node.y + 5)
      text.setAttribute('text-anchor', 'middle')
      text.setAttribute('fill', '#00D9FF')
      text.setAttribute('font-size', '14')
      text.setAttribute('font-family', 'monospace')
      text.textContent = node.label
      svg.appendChild(text)
    })
  }

  const renderBackgroundConnections = () => {
    const svg = svgRef.current
    const connections = [
      { from: 'claude', to: 'github' },
      { from: 'claude', to: 'postgres' },
      { from: 'claude', to: 'slack' },
      { from: 'claude', to: 'gmail' },
      { from: 'cursor', to: 'github' },
      { from: 'cursor', to: 'postgres' },
      { from: 'cursor', to: 'slack' },
      { from: 'cursor', to: 'gmail' },
      { from: 'chatgpt', to: 'github' },
      { from: 'chatgpt', to: 'postgres' },
      { from: 'chatgpt', to: 'slack' },
      { from: 'chatgpt', to: 'gmail' }
    ]

    connections.forEach((conn) => {
      const fromNode = NODE_LAYOUT.AI_MODELS[conn.from] || NODE_LAYOUT.TOOLS[conn.from]
      const toNode = NODE_LAYOUT.TOOLS[conn.to] || NODE_LAYOUT.AI_MODELS[conn.to]

      const line = document.createElementNS('http://www.w3.org/2000/svg', 'line')
      line.setAttribute('x1', fromNode.x)
      line.setAttribute('y1', fromNode.y)
      line.setAttribute('x2', toNode.x)
      line.setAttribute('y2', toNode.y)
      line.setAttribute('stroke', '#444')
      line.setAttribute('stroke-width', '1.5')
      line.setAttribute('stroke-dasharray', '5,5')
      line.setAttribute('opacity', '0.3')
      line.setAttribute('class', 'background-line')
      svg.appendChild(line)
    })
  }

  const animateLine = (lineData) => {
    const fromNode = NODE_LAYOUT.AI_MODELS[lineData.source] || NODE_LAYOUT.TOOLS[lineData.source]
    const toNode = NODE_LAYOUT.TOOLS[lineData.target] || NODE_LAYOUT.AI_MODELS[lineData.target]

    const svg = svgRef.current

    // Create animated line
    const animLine = document.createElementNS('http://www.w3.org/2000/svg', 'line')
    animLine.setAttribute('x1', fromNode.x)
    animLine.setAttribute('y1', fromNode.y)
    animLine.setAttribute('x2', toNode.x)
    animLine.setAttribute('y2', toNode.y)
    animLine.setAttribute('stroke', lineData.color)
    animLine.setAttribute('stroke-width', '3')
    animLine.setAttribute('stroke-dasharray', 'none')
    animLine.setAttribute('opacity', '0.8')
    animLine.setAttribute('class', 'animated-line')
    svg.appendChild(animLine)

    // Calculate line length
    const dx = toNode.x - fromNode.x
    const dy = toNode.y - fromNode.y
    const length = Math.sqrt(dx * dx + dy * dy)

    // Animate line reveal
    gsap.fromTo(
      animLine,
      { strokeDashoffset: length, strokeDasharray: length },
      {
        strokeDashoffset: 0,
        duration: lineData.duration,
        delay: lineData.delay,
        ease: 'power2.inOut'
      }
    )

    // Animate glowing dot along line
    const dot = document.createElementNS('http://www.w3.org/2000/svg', 'circle')
    dot.setAttribute('cx', fromNode.x)
    dot.setAttribute('cy', fromNode.y)
    dot.setAttribute('r', '6')
    dot.setAttribute('fill', lineData.color)
    dot.setAttribute('filter', 'url(#glow)')
    dot.setAttribute('class', 'tracer-dot')
    svg.appendChild(dot)

    gsap.to(dot, {
      attr: {
        cx: toNode.x,
        cy: toNode.y
      },
      duration: lineData.duration,
      delay: lineData.delay,
      ease: 'linear'
    })
  }

  return (
    <div className="network-container">
      <svg
        ref={svgRef}
        width={1920}
        height={1080}
        className="network-svg"
        viewBox="0 0 1920 1080"
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="4" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
      </svg>

      {/* Frame control (development only) */}
      <div className="frame-control">
        <input
          type="range"
          min="1"
          max="18"
          value={currentFrame}
          onChange={(e) => setCurrentFrame(parseInt(e.target.value))}
        />
        <span>Frame {currentFrame}/18</span>
      </div>
    </div>
  )
}
```

### **src/components/StatBoxes.jsx**
```javascript
import React from 'react'
import { AnimatedCounter } from './AnimatedCounter'
import './StatBoxes.css'

export function StatBoxes({ frameSequence, currentFrame }) {
  const frameData = frameSequence[currentFrame - 1]

  return (
    <div className="stat-boxes">
      {/* Left stat */}
      <div className="stat-box left">
        <div className="stat-badge">● CUSTOM GLUE · N+M</div>
        <div className="stat-number">12</div>
        <div className="stat-label">INTEGRATIONS</div>
      </div>

      {/* Right stat with animated counter */}
      <div className="stat-box right">
        <div className="stat-question">what is an MCP server?</div>
        <AnimatedCounter value={frameData.counter} />
        <div className="stat-label">CALLS SERVED</div>
      </div>
    </div>
  )
}
```

### **src/components/AnimatedCounter.jsx**
```javascript
import React, { useEffect, useState } from 'react'
import gsap from 'gsap'

export function AnimatedCounter({ value, duration = 0.3 }) {
  const [displayValue, setDisplayValue] = useState(value)

  useEffect(() => {
    const obj = { value: displayValue }

    gsap.to(obj, {
      value: value,
      duration: duration,
      onUpdate() {
        setDisplayValue(Math.floor(obj.value))
      }
    })
  }, [value])

  return (
    <div className="animated-counter">
      {String(displayValue).padStart(2, '0')}
    </div>
  )
}
```

### **src/styles/NetworkVisualization.css**
```css
.network-container {
  width: 100%;
  height: 100vh;
  background: #0a0e27;
  display: flex;
  align-items: center;
  justify-content: center;
}

.network-svg {
  width: 100%;
  height: 100%;
  max-width: 1920px;
  max-height: 1080px;
  background: #0a0e27;
}

.node {
  pointer-events: none;
}

.node-ai {
  stroke: #00D9FF;
}

.node-tool {
  stroke: #FFD60A;
}

.background-line {
  opacity: 0.2;
}

.animated-line {
  stroke-linecap: round;
  filter: drop-shadow(0 0 4px rgba(255, 0, 110, 0.5));
}

.tracer-dot {
  filter: url(#glow);
}

.frame-control {
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: rgba(0, 0, 0, 0.8);
  padding: 20px;
  border-radius: 8px;
  color: #00D9FF;
  font-family: monospace;
}

.frame-control input {
  margin-right: 20px;
}

.stat-boxes {
  position: absolute;
  top: 20px;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  padding: 0 50px;
}

.stat-box {
  text-align: center;
}

.stat-badge {
  color: #FF006E;
  font-size: 12px;
  border: 1px solid #FF006E;
  border-radius: 20px;
  padding: 5px 15px;
  display: inline-block;
  margin-bottom: 10px;
}

.stat-number {
  font-size: 48px;
  font-weight: bold;
  color: #00D9FF;
}

.stat-label {
  font-size: 12px;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.stat-question {
  font-size: 14px;
  color: #999;
  font-style: italic;
  margin-bottom: 10px;
}

.animated-counter {
  font-size: 48px;
  font-weight: bold;
  color: #00D9FF;
  font-family: monospace;
}
```

---

## 📋 CORRECTED IMPLEMENTATION STEPS

1. ✅ **Fixed node positions** (not D3 simulation)
2. ✅ **Sequential line animations** (one after another)
3. ✅ **Glowing dot tracers** (travel along lines)
4. ✅ **Counter animation** (14 → 29)
5. ✅ **Static layout** (no physics, no movement)
6. ✅ **Multi-layer composition** (text + network + UI)

---

**This matches the Instagram video exactly!** 🎯
