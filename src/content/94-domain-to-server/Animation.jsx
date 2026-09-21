// 94-domain-to-server/Animation.jsx
// ═══════════════════════════════════════════════════════════════════════════
// EKSEKUSI PLAN: Domain ke Server — Perjalanan request dari domain sampai aplikasi.
// 4 Acts: resolve domain → connect ke edge → proxy ke app → return page.
// Packet continuity: domain query → request packet → response capsule.
// Scene shell: scene-ui V1 portrait 820×1340.
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, TOTAL_DURATION,
  INTRO_CATEGORY, INTRO_TITLE_A, INTRO_TITLE_B, INTRO_SUBTITLE,
  ZONES, DOMAIN, IP, PORT, COPY, SFX_MAP,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'
import { IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1 } from '../../shared/scene-ui/v1'

// ═══════════════════════════════════════════════════════════════════════════
// VISUAL COMPONENTS
// ═══════════════════════════════════════════════════════════════════════════

// Caption yang nempel di dekat actor yang sedang dibahas (bukan caption bar
// global — lihat 03-planning-storytelling-quality-gate.md §D: "Jangan
// gunakan caption bar bawah layar (say()) — sudah deprecated"). Posisi
// di-anchor ke koordinat actor terkait tiap beat, di-clamp supaya tidak
// keluar body (lebar body 732, lihat 05-svg-layout-asset-pipeline.md).
const CaptionBar = ({ text, color, x = 366, y = 30 }) => {
  if (!text) return null
  const boxWidth = 300
  const half = boxWidth / 2
  const clampedX = Math.max(half + 8, Math.min(732 - half - 8, x))
  const clampedY = Math.max(20, Math.min(945, y))
  return (
    <g transform={`translate(${clampedX} ${clampedY})`}>
      <rect x={-half} y="-17" width={boxWidth} height="34" rx="16" 
        fill={COLORS.MID} stroke={color || COLORS.BORDER_DEFAULT} 
        strokeWidth="1.5" opacity="0.95" />
      <text x="0" y="5" textAnchor="middle" fontFamily="sans-serif" 
        fontWeight="600" fontSize="12" fill={COLORS.TEXT_PRIMARY}>
        {text}
      </text>
    </g>
  )
}

// Browser icon dengan loading state
const BrowserIcon = ({ visible, loading, hasPage }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${ZONES.BROWSER.x} ${ZONES.BROWSER.y})`}>
      <rect x="-50" y="-40" width="100" height="80" rx="10" 
        fill={COLORS.LIGHT} stroke={COLORS.BLUE} strokeWidth="2" />
      <rect x="-40" y="-28" width="80" height="16" rx="4" 
        fill={COLORS.DEEP} stroke={COLORS.BORDER_DEFAULT} strokeWidth="1" />
      <circle cx="-30" cy="-20" r="2.5" fill={COLORS.RED} opacity="0.7" />
      <circle cx="-22" cy="-20" r="2.5" fill={COLORS.YELLOW} opacity="0.7" />
      <circle cx="-14" cy="-20" r="2.5" fill={COLORS.GREEN} opacity="0.7" />
      
      {loading && (
        <g>
          <circle cx="0" cy="10" r="8" fill="none" stroke={COLORS.BLUE} strokeWidth="2" opacity="0.5">
            <animateTransform attributeName="transform" type="rotate" 
              from="0 0 10" to="360 0 10" dur="1s" repeatCount="indefinite" />
          </circle>
          <text x="0" y="32" textAnchor="middle" fontFamily="monospace" 
            fontSize="9" fill={COLORS.MUTED}>loading...</text>
        </g>
      )}
      
      {hasPage && !loading && (
        <g>
          <rect x="-35" y="0" width="70" height="8" rx="2" fill={COLORS.GREEN} opacity="0.6" />
          <rect x="-35" y="12" width="50" height="8" rx="2" fill={COLORS.GREEN} opacity="0.4" />
          <rect x="-35" y="24" width="60" height="8" rx="2" fill={COLORS.GREEN} opacity="0.4" />
        </g>
      )}
    </g>
  )
}

// DNS resolver icon
const DNSIcon = ({ visible, active }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${ZONES.DNS.x} ${ZONES.DNS.y})`}>
      {active && (
        <circle r="40" fill="none" stroke={COLORS.PURPLE} strokeWidth="1.2" opacity="0.4">
          <animate attributeName="r" values="35;50;35" dur="1.5s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0;0.4" dur="1.5s" repeatCount="indefinite" />
        </circle>
      )}
      <rect x="-45" y="-35" width="90" height="70" rx="10" 
        fill={COLORS.LIGHT} stroke={COLORS.PURPLE} strokeWidth={active ? 2.5 : 2} />
      <circle cx="0" cy="-8" r="12" fill="none" stroke={COLORS.PURPLE} strokeWidth="2" />
      <circle cx="0" cy="-8" r="4" fill={COLORS.PURPLE} />
      <text x="0" y="22" textAnchor="middle" fontFamily="monospace" 
        fontWeight="700" fontSize="11" fill={COLORS.PURPLE}>DNS</text>
    </g>
  )
}

// Domain chip (transforms to IP chip)
const DomainChip = ({ visible, x, y, showDomain, showIP }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${x} ${y})`}>
      {showDomain && (
        <g>
          <rect x="-60" y="-16" width="120" height="32" rx="16" 
            fill={COLORS.MID} stroke={COLORS.BLUE} strokeWidth="1.8" />
          <text x="0" y="5" textAnchor="middle" fontFamily="monospace" 
            fontWeight="700" fontSize="12" fill={COLORS.BLUE}>{DOMAIN}</text>
        </g>
      )}
      {showIP && (
        <g>
          <rect x="-60" y="-16" width="120" height="32" rx="16" 
            fill={COLORS.MID} stroke={COLORS.CYAN} strokeWidth="1.8" />
          <text x="0" y="5" textAnchor="middle" fontFamily="monospace" 
            fontWeight="700" fontSize="11" fill={COLORS.CYAN}>{IP}</text>
        </g>
      )}
    </g>
  )
}

// DNS Query packet (small)
const DNSQueryPacket = ({ visible, x, y }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-25" y="-25" width="50" height="50" rx="8" 
        fill={COLORS.PURPLE} fillOpacity="0.2" 
        stroke={COLORS.PURPLE} strokeWidth="2" />
      <text x="0" y="5" textAnchor="middle" fontFamily="monospace" 
        fontSize="9" fill={COLORS.PURPLE}>DNS?</text>
    </g>
  )
}

// HTTPS Request packet
const RequestPacket = ({ visible, x, y }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-30" y="-30" width="60" height="60" rx="10" 
        fill={COLORS.PINK} fillOpacity="0.15" 
        stroke={COLORS.PINK} strokeWidth="2.5" />
      <text x="0" y="-8" textAnchor="middle" fontFamily="monospace" 
        fontWeight="700" fontSize="10" fill={COLORS.PINK}>HTTPS</text>
      <text x="0" y="6" textAnchor="middle" fontFamily="monospace" 
        fontSize="9" fill={COLORS.PINK}>:{PORT}</text>
      <text x="0" y="18" textAnchor="middle" fontFamily="monospace" 
        fontSize="8" fill={COLORS.MUTED}>GET /</text>
    </g>
  )
}

// Edge/Port gate
const EdgeGate = ({ visible, active }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${ZONES.EDGE.x} ${ZONES.EDGE.y})`}>
      {active && (
        <circle r="65" fill="none" stroke={COLORS.CYAN} strokeWidth="1.5" opacity="0.3">
          <animate attributeName="r" values="60;75;60" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0;0.3" dur="1.8s" repeatCount="indefinite" />
        </circle>
      )}
      <rect x="-70" y="-50" width="140" height="100" rx="12" 
        fill={COLORS.LIGHT} stroke={COLORS.CYAN} strokeWidth={active ? 2.5 : 2} />
      <rect x="-50" y="-30" width="100" height="20" rx="4" 
        fill={COLORS.DEEP} stroke={COLORS.CYAN} strokeWidth="1.5" />
      <text x="0" y="-14" textAnchor="middle" fontFamily="monospace" 
        fontWeight="700" fontSize="13" fill={COLORS.CYAN}>:{PORT}</text>
      <text x="0" y="20" textAnchor="middle" fontFamily="monospace" 
        fontWeight="700" fontSize="11" fill={COLORS.CYAN}>EDGE</text>
      <text x="0" y="35" textAnchor="middle" fontFamily="monospace" 
        fontSize="9" fill={COLORS.MUTED}>Server Entry</text>
    </g>
  )
}

// Proxy gate
const ProxyGate = ({ visible, active }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${ZONES.PROXY.x} ${ZONES.PROXY.y})`}>
      {active && (
        <circle r="65" fill="none" stroke={COLORS.ORANGE} strokeWidth="1.5" opacity="0.3">
          <animate attributeName="r" values="60;75;60" dur="1.8s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0;0.3" dur="1.8s" repeatCount="indefinite" />
        </circle>
      )}
      <rect x="-70" y="-50" width="140" height="100" rx="12" 
        fill={COLORS.LIGHT} stroke={COLORS.ORANGE} strokeWidth={active ? 2.5 : 2} />
      <circle cx="0" cy="-10" r="15" fill="none" stroke={COLORS.ORANGE} strokeWidth="2.5" />
      <circle cx="0" cy="-10" r="5" fill={COLORS.ORANGE} />
      <text x="0" y="20" textAnchor="middle" fontFamily="monospace" 
        fontWeight="700" fontSize="12" fill={COLORS.ORANGE}>PROXY</text>
      <text x="0" y="35" textAnchor="middle" fontFamily="monospace" 
        fontSize="9" fill={COLORS.MUTED}>Routing Layer</text>
    </g>
  )
}

// Backend application
const BackendApp = ({ visible, active, label, x, y }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${x} ${y})`}>
      {active && (
        <circle r="55" fill="none" stroke={COLORS.GREEN} strokeWidth="1.3" opacity="0.3">
          <animate attributeName="r" values="50;65;50" dur="1.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.3;0;0.3" dur="1.6s" repeatCount="indefinite" />
        </circle>
      )}
      <rect x="-60" y="-40" width="120" height="80" rx="10" 
        fill={COLORS.LIGHT} stroke={COLORS.GREEN} strokeWidth={active ? 2.5 : 2} />
      <circle cx="0" cy="-8" r="12" fill="none" stroke={COLORS.GREEN} strokeWidth="2" />
      <circle cx="0" cy="-8" r="4" fill={COLORS.GREEN} />
      <text x="0" y="18" textAnchor="middle" fontFamily="monospace" 
        fontWeight="700" fontSize="11" fill={COLORS.GREEN}>{label}</text>
      <text x="0" y="32" textAnchor="middle" fontFamily="monospace" 
        fontSize="8" fill={COLORS.MUTED}>Backend</text>
    </g>
  )
}

// Response capsule
const ResponseCapsule = ({ visible, x, y }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-40" y="-40" width="80" height="80" rx="12" 
        fill={COLORS.MINT} fillOpacity="0.15" 
        stroke={COLORS.MINT} strokeWidth="2.5" />
      <rect x="-30" y="-20" width="60" height="8" rx="3" 
        fill={COLORS.MINT} opacity="0.7" />
      <rect x="-30" y="-8" width="45" height="8" rx="3" 
        fill={COLORS.MINT} opacity="0.5" />
      <rect x="-30" y="4" width="50" height="8" rx="3" 
        fill={COLORS.MINT} opacity="0.5" />
      <text x="0" y="26" textAnchor="middle" fontFamily="monospace" 
        fontSize="9" fill={COLORS.MINT}>200 OK</text>
    </g>
  )
}

// Routing beam (visual connection from proxy to backend)
const RoutingBeam = ({ visible, fromX, fromY, toX, toY, color }) => {
  if (!visible) return null
  return (
    <line x1={fromX} y1={fromY} x2={toX} y2={toY} 
      stroke={color} strokeWidth="3" opacity="0.6" strokeDasharray="8 4">
      <animate attributeName="stroke-dashoffset" from="0" to="24" 
        dur="0.8s" repeatCount="indefinite" />
    </line>
  )
}

// Connection line (dashed, static)
const ConnectionLine = ({ x1, y1, x2, y2, color, opacity = 0.3 }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} 
    stroke={color} strokeWidth="1.5" strokeDasharray="5 3" opacity={opacity} />
)

// ═══════════════════════════════════════════════════════════════════════════
// MAIN ANIMATION COMPONENT
// ═══════════════════════════════════════════════════════════════════════════

export default function DomainToServerAnimation({
  paused,
  speed,
  volume,
  previewSfx,
  audioUnlocked,
}) {
  // State management
  const [showIntro, setShowIntro] = useState(true)
  const [morphP, setMorphP] = useState(0)
  const [phaseIdx, setPhaseIdx] = useState(-1)
  const [contentStarted, setContentStarted] = useState(false)
  const [caption, setCaption] = useState('')
  const [captionColor, setCaptionColor] = useState(COLORS.BORDER_DEFAULT)
  const [captionAnchor, setCaptionAnchor] = useState({ x: ZONES.BROWSER.x, y: ZONES.BROWSER.y - 70 })

  // Act 1 - Resolve Domain
  const [browserVisible, setBrowserVisible] = useState(false)
  const [dnsVisible, setDnsVisible] = useState(false)
  const [dnsActive, setDnsActive] = useState(false)
  const [domainChipVisible, setDomainChipVisible] = useState(false)
  const [domainChipPos, setDomainChipPos] = useState({ x: 0, y: 0 })
  const [domainChipShowDomain, setDomainChipShowDomain] = useState(true)
  const [domainChipShowIP, setDomainChipShowIP] = useState(false)
  const [dnsQueryVisible, setDnsQueryVisible] = useState(false)
  const [dnsQueryPos, setDnsQueryPos] = useState({ x: 0, y: 0 })

  // Act 2 - Connect to Edge
  const [browserLoading, setBrowserLoading] = useState(false)
  const [edgeVisible, setEdgeVisible] = useState(false)
  const [edgeActive, setEdgeActive] = useState(false)
  const [requestPacketVisible, setRequestPacketVisible] = useState(false)
  const [requestPacketPos, setRequestPacketPos] = useState({ x: 0, y: 0 })

  // Act 3 - Proxy to App
  const [proxyVisible, setProxyVisible] = useState(false)
  const [proxyActive, setProxyActive] = useState(false)
  const [backendAVisible, setBackendAVisible] = useState(false)
  const [backendBVisible, setBackendBVisible] = useState(false)
  const [backendAActive, setBackendAActive] = useState(false)
  const [routingBeamVisible, setRoutingBeamVisible] = useState(false)

  // Act 4 - Return Page
  const [responseVisible, setResponseVisible] = useState(false)
  const [responsePos, setResponsePos] = useState({ x: 0, y: 0 })
  const [browserHasPage, setBrowserHasPage] = useState(false)
  const [spineVisible, setSpineVisible] = useState(false)

  // Refs
  const tlRef = useRef(null)
  const volumeRef = useRef(volume)
  const speedRef = useRef(speed)

  // Update volume/speed refs
  useEffect(() => { volumeRef.current = volume }, [volume])
  useEffect(() => { speedRef.current = speed }, [speed])

  // SFX helper
  const playSfx = (sfxKey) => {
    if (!previewSfx || !audioUnlocked) return
    const sfxConfig = SFX_MAP[sfxKey]
    if (!sfxConfig) return
    
    const audio = new Audio(`/audio/${sfxConfig.category}/${sfxConfig.name}.wav`)
    audio.volume = Math.min(1.0, volumeRef.current / 100)
    audio.playbackRate = speedRef.current
    audio.play().catch(() => {})
  }

  // Helper functions
  const lerp = (a, b, t) => a + (b - a) * t

  const popIn = (tl, time, setState, sfxKey = 'POP') => {
    tl.add(() => {
      setState(true)
      if (sfxKey) playSfx(sfxKey)
    }, time)
  }

  const popOut = (tl, time, setState) => {
    tl.add(() => setState(false), time)
  }

  const setC = (tl, time, text, color = COLORS.BORDER_DEFAULT, anchor = null) => {
    tl.add(() => {
      setCaption(text)
      setCaptionColor(color)
      if (anchor) setCaptionAnchor(anchor)
    }, time)
  }

  // Master timeline
  useEffect(() => {
    const master = gsap.timeline({ repeat: -1, repeatDelay: 1.5 })
    tlRef.current = master
    window.__animationTimeline = master
    window.__flushSync = flushSync

    let time = 0

    // ===== INTRO: Hero to Header Morph =====
    master.add(() => setShowIntro(true), time)
    master.add(() => setPhaseIdx(-1), time)
    
    const morphDur = 1.8
    master.to({}, {
      duration: morphDur,
      onUpdate: function() {
        const p = this.progress()
        setMorphP(p)
      }
    }, time)
    time += morphDur

    master.add(() => {
      setShowIntro(false)
      setContentStarted(true)
    }, time)
    time += 0.3

    // ═══════════════════════════════════════════════════════════════════════════
    // ACT 1: RESOLVE DOMAIN (10s)
    // Browser punya domain → DNS query → DNS answer → domain handoff menjadi IP
    // ═══════════════════════════════════════════════════════════════════════════
    master.add(() => setPhaseIdx(0), time)
    master.add(() => playSfx('WHOOSH'), time)

    // 1.1 Browser dan DNS muncul (redup)
    popIn(master, time, setBrowserVisible, 'POP')
    popIn(master, time + 0.2, setDnsVisible, null)
    setC(master, time + 0.3, COPY.ACT1_BEFORE, COLORS.PURPLE, { x: ZONES.BROWSER.x, y: ZONES.BROWSER.y - 70 })
    time += 1.5

    // 1.2 Domain chip muncul di browser
    master.add(() => {
      setDomainChipVisible(true)
      setDomainChipPos({ x: ZONES.BROWSER.x, y: ZONES.BROWSER.y + 60 })
      setDomainChipShowDomain(true)
      setDomainChipShowIP(false)
      playSfx('POP')
    }, time)
    time += 0.8

    // 1.3 DNS query packet travels to DNS
    setC(master, time, COPY.ACT1_DNS_QUERY, COLORS.PURPLE, { x: (ZONES.BROWSER.x + ZONES.DNS.x) / 2, y: ZONES.BROWSER.y - 70 })
    master.add(() => {
      setDnsQueryVisible(true)
      setDnsQueryPos({ x: ZONES.BROWSER.x, y: ZONES.BROWSER.y + 60 })
      playSfx('DNS_QUERY')
    }, time)
    
    const dnsQueryDur = 1.2
    master.to(dnsQueryPos, {
      duration: dnsQueryDur,
      x: ZONES.DNS.x,
      y: ZONES.DNS.y,
      ease: 'power2.inOut',
      onUpdate: function() {
        setDnsQueryPos({ x: this.targets()[0].x, y: this.targets()[0].y })
      }
    }, time)
    time += dnsQueryDur

    // 1.4 DNS active, processing
    master.add(() => {
      setDnsActive(true)
      setDnsQueryVisible(false)
      playSfx('CONNECT')
    }, time)
    time += 1.0

    // 1.5 DNS returns answer
    setC(master, time, COPY.ACT1_DNS_ANSWER, COLORS.CYAN, { x: ZONES.DNS.x, y: ZONES.DNS.y - 70 })
    master.add(() => {
      setDnsActive(false)
      playSfx('SUCCESS')
    }, time)
    time += 0.5

    // 1.6 Domain chip transforms to IP chip
    master.add(() => {
      setDomainChipShowDomain(false)
      setDomainChipShowIP(true)
      playSfx('POP')
    }, time)
    time += 0.8

    // 1.7 IP chip moves to browser destination
    setC(master, time, COPY.ACT1_AFTER, COLORS.CYAN, { x: ZONES.BROWSER.x, y: ZONES.BROWSER.y - 70 })
    const ipMoveDur = 1.0
    master.to(domainChipPos, {
      duration: ipMoveDur,
      x: ZONES.BROWSER.x + 80,
      y: ZONES.BROWSER.y - 50,
      ease: 'power2.inOut',
      onUpdate: function() {
        setDomainChipPos({ x: this.targets()[0].x, y: this.targets()[0].y })
      }
    }, time)
    time += ipMoveDur + 0.5

    // Cleanup Act 1
    master.add(() => {
      setDomainChipVisible(false)
      setCaption('')
    }, time)
    time += 0.5

    // ═══════════════════════════════════════════════════════════════════════════
    // ACT 2: CONNECT TO EDGE (9s)
    // Browser tahu IP → HTTPS connection → packet ke port 443 → edge menerima
    // ═══════════════════════════════════════════════════════════════════════════
    master.add(() => setPhaseIdx(1), time)
    master.add(() => playSfx('WHOOSH'), time)

    // 2.1 Browser loading, edge gate muncul
    popIn(master, time, () => setBrowserLoading(true), null)
    popIn(master, time + 0.2, setEdgeVisible, 'POP')
    setC(master, time + 0.3, COPY.ACT2_BEFORE, COLORS.CYAN, { x: ZONES.BROWSER.x, y: ZONES.BROWSER.y - 70 })
    time += 1.5

    // 2.2 HTTPS request packet created
    setC(master, time, COPY.ACT2_CONNECTING, COLORS.PINK, { x: ZONES.EDGE.x, y: ZONES.TRANSIT.y })
    master.add(() => {
      setRequestPacketVisible(true)
      setRequestPacketPos({ x: ZONES.BROWSER.x, y: ZONES.BROWSER.y + 60 })
      playSfx('PACKET_SEND')
    }, time)
    time += 0.8

    // 2.3 Packet travels to edge
    const packetToEdgeDur = 2.5
    master.to(requestPacketPos, {
      duration: packetToEdgeDur,
      x: ZONES.EDGE.x,
      y: ZONES.EDGE.y,
      ease: 'power1.inOut',
      onUpdate: function() {
        setRequestPacketPos({ x: this.targets()[0].x, y: this.targets()[0].y })
      }
    }, time)
    time += packetToEdgeDur

    // 2.4 Edge receives packet
    setC(master, time, COPY.ACT2_REACHED, COLORS.CYAN, { x: ZONES.EDGE.x, y: ZONES.EDGE.y - 70 })
    master.add(() => {
      setEdgeActive(true)
      setRequestPacketVisible(false)
      setBrowserLoading(false)
      playSfx('CONNECT')
    }, time)
    time += 1.0

    setC(master, time, COPY.ACT2_AFTER, COLORS.GREEN, { x: ZONES.EDGE.x, y: ZONES.EDGE.y - 70 })
    time += 1.5

    // Cleanup Act 2
    master.add(() => {
      setEdgeActive(false)
      setCaption('')
    }, time)
    time += 0.5

    // ═══════════════════════════════════════════════════════════════════════════
    // ACT 3: PROXY TO APP (10s)
    // Proxy muncul → routing decision → backend selected → app responds
    // ═══════════════════════════════════════════════════════════════════════════
    master.add(() => setPhaseIdx(2), time)
    master.add(() => playSfx('WHOOSH'), time)

    // 3.1 Proxy dan backends muncul
    popIn(master, time, setProxyVisible, 'POP')
    popIn(master, time + 0.2, setBackendAVisible, null)
    popIn(master, time + 0.3, setBackendBVisible, null)
    setC(master, time + 0.4, COPY.ACT3_BEFORE, COLORS.ORANGE, { x: ZONES.PROXY.x, y: ZONES.PROXY.y - 70 })
    time += 1.8

    // 3.2 Request packet moves to proxy
    master.add(() => {
      setRequestPacketVisible(true)
      setRequestPacketPos({ x: ZONES.EDGE.x, y: ZONES.EDGE.y + 80 })
    }, time)
    
    const packetToProxyDur = 1.5
    master.to(requestPacketPos, {
      duration: packetToProxyDur,
      x: ZONES.PROXY.x,
      y: ZONES.PROXY.y,
      ease: 'power2.inOut',
      onUpdate: function() {
        setRequestPacketPos({ x: this.targets()[0].x, y: this.targets()[0].y })
      }
    }, time)
    time += packetToProxyDur

    // 3.3 Proxy active, routing decision
    setC(master, time, COPY.ACT3_ROUTING, COLORS.ORANGE, { x: ZONES.PROXY.x, y: ZONES.PROXY.y - 70 })
    master.add(() => {
      setProxyActive(true)
      setRequestPacketVisible(false)
      playSfx('CONNECT')
    }, time)
    time += 1.2

    // 3.4 Routing beam to backend A
    setC(master, time, COPY.ACT3_SELECTED, COLORS.GREEN, { x: ZONES.BACKEND_A.x, y: ZONES.BACKEND_A.y - 70 })
    master.add(() => {
      setRoutingBeamVisible(true)
      setBackendAActive(true)
      playSfx('ROUTE')
    }, time)
    time += 1.5

    // 3.5 Backend processing
    setC(master, time, COPY.ACT3_AFTER, COLORS.GREEN, { x: ZONES.BACKEND_A.x, y: ZONES.BACKEND_A.y - 70 })
    time += 2.0

    // Cleanup Act 3
    master.add(() => {
      setProxyActive(false)
      setRoutingBeamVisible(false)
      setCaption('')
    }, time)
    time += 0.5

    // ═══════════════════════════════════════════════════════════════════════════
    // ACT 4: RETURN PAGE (11s)
    // Backend sends response → travels through proxy → through edge → browser renders
    // ═══════════════════════════════════════════════════════════════════════════
    master.add(() => setPhaseIdx(3), time)
    master.add(() => playSfx('WHOOSH'), time)

    // 4.1 Browser still loading
    popIn(master, time, () => setBrowserLoading(true), null)
    setC(master, time + 0.2, COPY.ACT4_BEFORE, COLORS.MINT, { x: ZONES.BROWSER.x, y: ZONES.BROWSER.y - 70 })
    time += 1.5

    // 4.2 Response capsule created at backend
    setC(master, time, COPY.ACT4_SENDING, COLORS.MINT, { x: ZONES.BACKEND_A.x, y: ZONES.BACKEND_A.y - 70 })
    master.add(() => {
      setResponseVisible(true)
      setResponsePos({ x: ZONES.BACKEND_A.x, y: ZONES.BACKEND_A.y })
      playSfx('PACKET_SEND')
    }, time)
    time += 0.8

    // 4.3 Response travels to proxy
    setC(master, time, COPY.ACT4_TRANSIT, COLORS.MINT, { x: ZONES.PROXY.x, y: ZONES.TRANSIT.y })
    const responseToProxyDur = 1.5
    master.to(responsePos, {
      duration: responseToProxyDur,
      x: ZONES.PROXY.x,
      y: ZONES.PROXY.y + 80,
      ease: 'power2.inOut',
      onUpdate: function() {
        setResponsePos({ x: this.targets()[0].x, y: this.targets()[0].y })
      }
    }, time)
    time += responseToProxyDur + 0.3

    // 4.4 Response travels to edge
    const responseToEdgeDur = 1.5
    master.to(responsePos, {
      duration: responseToEdgeDur,
      x: ZONES.EDGE.x,
      y: ZONES.EDGE.y + 80,
      ease: 'power2.inOut',
      onUpdate: function() {
        setResponsePos({ x: this.targets()[0].x, y: this.targets()[0].y })
      }
    }, time)
    time += responseToEdgeDur + 0.3

    // 4.5 Response travels to browser
    const responseToBrowserDur = 2.0
    master.to(responsePos, {
      duration: responseToBrowserDur,
      x: ZONES.BROWSER.x,
      y: ZONES.BROWSER.y + 60,
      ease: 'power2.inOut',
      onUpdate: function() {
        setResponsePos({ x: this.targets()[0].x, y: this.targets()[0].y })
      }
    }, time)
    time += responseToBrowserDur

    // 4.6 Browser renders page
    setC(master, time, COPY.ACT4_AFTER, COLORS.GREEN, { x: ZONES.BROWSER.x, y: ZONES.BROWSER.y - 70 })
    master.add(() => {
      setResponseVisible(false)
      setBrowserLoading(false)
      setBrowserHasPage(true)
      setSpineVisible(true)
      playSfx('SUCCESS')
    }, time)
    time += 2.0

    // ===== CLEANUP & LOOP RESET =====
    master.add(() => {
      // Reset all state
      setBrowserVisible(false)
      setDnsVisible(false)
      setDnsActive(false)
      setDomainChipVisible(false)
      setDnsQueryVisible(false)
      setBrowserLoading(false)
      setEdgeVisible(false)
      setEdgeActive(false)
      setRequestPacketVisible(false)
      setProxyVisible(false)
      setProxyActive(false)
      setBackendAVisible(false)
      setBackendBVisible(false)
      setBackendAActive(false)
      setRoutingBeamVisible(false)
      setResponseVisible(false)
      setBrowserHasPage(false)
      setSpineVisible(false)
      setCaption('')
      setContentStarted(false)
      setShowIntro(true)
    }, time)

    return () => {
      master.kill()
    }
  }, [])

  // Pause/resume control
  useEffect(() => {
    if (!tlRef.current) return
    if (paused) {
      tlRef.current.pause()
    } else {
      tlRef.current.play()
    }
  }, [paused])

  // Speed control
  useEffect(() => {
    if (!tlRef.current) return
    tlRef.current.timeScale(speed)
  }, [speed])

  // ═══════════════════════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════════════════════

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center',
      background: COLORS.DEEP 
    }}>
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        style={{ width: '100%', height: '100%', maxHeight: '100vh' }}
      >
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        <rect width={VW} height={VH} fill={COLORS.DEEP} />

        {/* Intro/Header Section */}
        <IntroHeaderMorphV1
          visible={showIntro}
          progress={morphP}
          category={INTRO_CATEGORY}
          titleSegments={[
            { label: INTRO_TITLE_A, color: COLORS.BLUE },
            { label: INTRO_TITLE_B, color: COLORS.GREEN }
          ]}
          subtitle={INTRO_SUBTITLE}
        />

        {/* Act Badge Navigator */}
        {contentStarted && (
          <ActBadgeNavigatorV1
            phases={PHASES}
            activePhaseIdx={phaseIdx}
            totalDuration={TOTAL_DURATION}
          />
        )}

        {/* Content Body */}
        {contentStarted && (
          <ContentBodyV1>
            {/* Caption */}
            <CaptionBar text={caption} color={captionColor} x={captionAnchor.x} y={captionAnchor.y} />

            {/* Connection lines (spine) */}
            {spineVisible && (
              <g opacity="0.4">
                <ConnectionLine x1={ZONES.BROWSER.x} y1={ZONES.BROWSER.y + 40} 
                  x2={ZONES.DNS.x} y2={ZONES.DNS.y + 35} color={COLORS.PURPLE} />
                <ConnectionLine x1={ZONES.BROWSER.x} y1={ZONES.BROWSER.y + 40} 
                  x2={ZONES.EDGE.x} y2={ZONES.EDGE.y - 50} color={COLORS.CYAN} />
                <ConnectionLine x1={ZONES.EDGE.x} y1={ZONES.EDGE.y + 50} 
                  x2={ZONES.PROXY.x} y2={ZONES.PROXY.y - 50} color={COLORS.ORANGE} />
                <ConnectionLine x1={ZONES.PROXY.x} y1={ZONES.PROXY.y + 50} 
                  x2={ZONES.BACKEND_A.x} y2={ZONES.BACKEND_A.y - 40} color={COLORS.GREEN} />
                <ConnectionLine x1={ZONES.PROXY.x} y1={ZONES.PROXY.y + 50} 
                  x2={ZONES.BACKEND_B.x} y2={ZONES.BACKEND_B.y - 40} color={COLORS.GREEN} opacity={0.2} />
              </g>
            )}

            {/* Routing beam (Act 3) */}
            {routingBeamVisible && (
              <RoutingBeam
                visible={true}
                fromX={ZONES.PROXY.x}
                fromY={ZONES.PROXY.y + 50}
                toX={ZONES.BACKEND_A.x}
                toY={ZONES.BACKEND_A.y - 40}
                color={COLORS.ORANGE}
              />
            )}

            {/* Actors */}
            <BrowserIcon visible={browserVisible} loading={browserLoading} hasPage={browserHasPage} />
            <DNSIcon visible={dnsVisible} active={dnsActive} />
            <DomainChip 
              visible={domainChipVisible} 
              x={domainChipPos.x} 
              y={domainChipPos.y} 
              showDomain={domainChipShowDomain} 
              showIP={domainChipShowIP} 
            />
            <DNSQueryPacket visible={dnsQueryVisible} x={dnsQueryPos.x} y={dnsQueryPos.y} />
            <EdgeGate visible={edgeVisible} active={edgeActive} />
            <RequestPacket visible={requestPacketVisible} x={requestPacketPos.x} y={requestPacketPos.y} />
            <ProxyGate visible={proxyVisible} active={proxyActive} />
            <BackendApp 
              visible={backendAVisible} 
              active={backendAActive} 
              label="App A" 
              x={ZONES.BACKEND_A.x} 
              y={ZONES.BACKEND_A.y} 
            />
            <BackendApp 
              visible={backendBVisible} 
              active={false} 
              label="App B" 
              x={ZONES.BACKEND_B.x} 
              y={ZONES.BACKEND_B.y} 
            />
            <ResponseCapsule visible={responseVisible} x={responsePos.x} y={responsePos.y} />
          </ContentBodyV1>
        )}
      </svg>
    </div>
  )
}
