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
  ZONES, COPY, SFX_MAP,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'
import { IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1 } from '../../shared/scene-ui/v1'
import { ACT_SCENES } from './acts'
import { CaptionBar } from './acts/common'

// ═══════════════════════════════════════════════════════════════════════════
// VISUAL COMPONENTS — dipindah ke acts/common.jsx (pola "1 act = 1 file",
// lihat docs/standardizations/07-act-scene-pattern.md). Diimpor lewat
// ACT_SCENES (acts/index.js) + CaptionBar (chrome, bukan konten act).
// ═══════════════════════════════════════════════════════════════════════════

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
          bg={4}
          bgScenes={ACT_SCENES}
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

            {/* Scene ACT aktif (1 act = 1 file, lihat acts/) — Browser/DNS/
                Edge/Proxy/Backend didup ke tiap Act file karena persisten
                (tidak pernah di-popOut), lihat docs/standardizations/
                07-act-scene-pattern.md §5 langkah 2. */}
            {(() => {
              const Act = ACT_SCENES[phaseIdx]
              if (!Act) return null
              return (
                <Act state={{
                  browserVisible, browserLoading, browserHasPage,
                  dnsVisible, dnsActive,
                  domainChipVisible, domainChipPos, domainChipShowDomain, domainChipShowIP,
                  dnsQueryVisible, dnsQueryPos,
                  edgeVisible, edgeActive,
                  requestPacketVisible, requestPacketPos,
                  proxyVisible, proxyActive,
                  backendAVisible, backendBVisible, backendAActive,
                  routingBeamVisible,
                  responseVisible, responsePos,
                  spineVisible,
                }} />
              )
            })()}
          </ContentBodyV1>
        )}
      </svg>
    </div>
  )
}
