// 93-reverse-proxy/Animation.jsx

import React, { useState, useEffect, useRef } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  IntroHeaderMorphV1,
  ActBadgeNavigatorV1,
  ContentBodyV1,
} from '../../shared/scene-ui/v1'
import {
  VW,
  VH,
  PHASES,
  COLORS,
  INTRO_CATEGORY,
  INTRO_TITLE_A,
  INTRO_TITLE_B,
  INTRO_SUBTITLE,
  ZONES,
  SFX_MAP,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'

export default function ReverseProxyAnimation({
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

  // Act-specific state
  const [clientVisible, setClientVisible] = useState(false)
  const [publicEndpointVisible, setPublicEndpointVisible] = useState(false)
  const [proxyVisible, setProxyVisible] = useState(false)
  const [backendAVisible, setBackendAVisible] = useState(false)
  const [backendBVisible, setBackendBVisible] = useState(false)
  const [packetVisible, setPacketVisible] = useState(false)
  const [packetPos, setPacketPos] = useState({ x: 0, y: 0 })
  const [routingChipVisible, setRoutingChipVisible] = useState(false)
  const [responseVisible, setResponseVisible] = useState(false)
  const [responsePos, setResponsePos] = useState({ x: 0, y: 0 })

  // Refs
  const tlRef = useRef(null)
  const volumeRef = useRef(volume)
  const speedRef = useRef(speed)

  // Update volume/speed refs
  useEffect(() => {
    volumeRef.current = volume
  }, [volume])

  useEffect(() => {
    speedRef.current = speed
  }, [speed])

  // SFX setup
  useEffect(() => {
    sfxLoader.setEnabled(Boolean(previewSfx && audioUnlocked))
  }, [previewSfx, audioUnlocked])

  // SFX helper
  const playSfx = (sfxKey) => {
    const entry = SFX_MAP[sfxKey]
    if (!entry) return
    sfxLoader.play(entry.category, entry.name, { volume: volumeRef.current, speed: speedRef.current })
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
    time += 1.8

    const mo = { p: 0 }
    master.to(mo, {
      p: 1,
      duration: 0.8,
      ease: 'power3.inOut',
      onUpdate: () => setMorphP(mo.p),
    }, time)
    time += 0.8

    master.add(() => {
      setShowIntro(false)
      setContentStarted(true)
    }, time)

    // ===== ACT 1: Satu Pintu Publik =====
    const act1Start = time
    master.add(() => setPhaseIdx(0), time)
    
    // Reset state
    master.add(() => {
      setClientVisible(false)
      setPublicEndpointVisible(false)
      setProxyVisible(false)
      setBackendAVisible(false)
      setBackendBVisible(false)
      setPacketVisible(false)
      setRoutingChipVisible(false)
      setResponseVisible(false)
    }, time)
    time += 0.3

    // Client muncul
    popIn(master, time, setClientVisible, 'POP')
    time += 0.5

    // Public endpoint muncul
    popIn(master, time, setPublicEndpointVisible, 'POP')
    time += 0.5

    // Proxy gate muncul
    popIn(master, time, setProxyVisible, 'CONNECT')
    time += 0.8

    // Backend A dan B muncul (redup)
    popIn(master, time, setBackendAVisible, null)
    popIn(master, time, setBackendBVisible, null)
    time += 1.0

    // Request packet dari client ke proxy
    const packetObj = { x: 366, y: ZONES.CLIENT.y }
    master.add(() => {
      setPacketVisible(true)
      setPacketPos({ x: packetObj.x, y: packetObj.y })
      playSfx('WHOOSH')
    }, time)

    master.to(packetObj, {
      y: ZONES.PROXY_GATE.y,
      duration: 0.8,
      ease: 'power2.inOut',
      onUpdate: () => setPacketPos({ x: packetObj.x, y: packetObj.y }),
    }, time)
    time += 0.8

    // Packet masuk proxy
    master.add(() => {
      playSfx('CONNECT')
    }, time)
    time += PHASES[0].duration - (time - act1Start)

    // ===== ACT 2: Proxy Memilih Tujuan =====
    const act2Start = time
    master.add(() => setPhaseIdx(1), time)
    time += 0.3

    // Routing chip muncul
    popIn(master, time, setRoutingChipVisible, 'CLICK')
    time += 1.2

    // Hold untuk membaca routing decision
    time += 1.0

    time += PHASES[1].duration - (time - act2Start)

    // ===== ACT 3: Request Diteruskan =====
    const act3Start = time
    master.add(() => setPhaseIdx(2), time)
    time += 0.3

    // Packet bergerak dari proxy ke backend A
    master.to(packetObj, {
      x: ZONES.BACKEND_A.x,
      y: ZONES.BACKEND_A.y,
      duration: 0.9,
      ease: 'power2.inOut',
      onUpdate: () => setPacketPos({ x: packetObj.x, y: packetObj.y }),
    }, time)
    master.add(() => playSfx('PACKET_SEND'), time)
    time += 0.9

    // Packet masuk backend
    master.add(() => {
      setPacketVisible(false)
      playSfx('CONNECT')
    }, time)
    time += 1.0

    time += PHASES[2].duration - (time - act3Start)

    // ===== ACT 4: Response Kembali =====
    const act4Start = time
    master.add(() => setPhaseIdx(3), time)
    time += 0.3

    // Response muncul dari backend
    const responseObj = { x: ZONES.BACKEND_A.x, y: ZONES.BACKEND_A.y }
    master.add(() => {
      setResponseVisible(true)
      setResponsePos({ x: responseObj.x, y: responseObj.y })
      playSfx('SUCCESS')
    }, time)
    time += 0.4

    // Response ke proxy
    master.to(responseObj, {
      x: 366,
      y: ZONES.PROXY_GATE.y,
      duration: 0.8,
      ease: 'power2.inOut',
      onUpdate: () => setResponsePos({ x: responseObj.x, y: responseObj.y }),
    }, time)
    master.add(() => playSfx('WHOOSH'), time)
    time += 0.8

    // Response ke client
    master.to(responseObj, {
      y: ZONES.CLIENT.y,
      duration: 0.8,
      ease: 'power2.out',
      onUpdate: () => setResponsePos({ x: responseObj.x, y: responseObj.y }),
    }, time)
    time += 0.8

    // Response diterima
    master.add(() => {
      setResponseVisible(false)
      playSfx('SUCCESS')
    }, time)
    time += 1.0

    time += PHASES[3].duration - (time - act4Start)

    // Cleanup
    return () => {
      master.kill()
      delete window.__animationTimeline
      delete window.__flushSync
    }
  }, [])

  // Speed control
  useEffect(() => {
    if (tlRef.current) {
      tlRef.current.timeScale(speed)
    }
  }, [speed])

  // Pause control
  useEffect(() => {
    if (tlRef.current) {
      if (paused) {
        tlRef.current.pause()
      } else {
        tlRef.current.resume()
      }
    }
  }, [paused])

  return (
    <svg
      viewBox={`0 0 ${VW} ${VH}`}
      style={{ width: '100%', height: '100%', background: COLORS.DEEP }}
    >
      {/* Intro Header */}
      {showIntro && (
        <IntroHeaderMorphV1
          progress={morphP}
          categorySegments={[{ label: INTRO_CATEGORY, color: COLORS.MUTED }]}
          titleSegments={[
            { label: INTRO_TITLE_A, color: COLORS.BLUE },
            { label: INTRO_TITLE_B, color: COLORS.GREEN },
          ]}
          subtitle={INTRO_SUBTITLE}
        />
      )}

      {/* Act Badge Navigator */}
      {contentStarted && (
        <ActBadgeNavigatorV1 phases={PHASES} activeIndex={phaseIdx} />
      )}

      {/* Content Body */}
      {contentStarted && (
        <ContentBodyV1>
          {(w, h) => (
            <g>
            {/* Client */}
            {clientVisible && (
              <g transform={`translate(${w / 2}, ${ZONES.CLIENT.y})`}>
                <rect
                  x={-80}
                  y={-30}
                  width={160}
                  height={60}
                  rx={12}
                  fill={COLORS.LIGHT}
                  stroke={COLORS.BLUE}
                  strokeWidth={2}
                />
                <text
                  x={0}
                  y={5}
                  textAnchor="middle"
                  fontSize={16}
                  fontWeight={700}
                  fill={COLORS.BLUE}
                >
                  CLIENT
                </text>
              </g>
            )}

            {/* Public Endpoint Badge */}
            {publicEndpointVisible && (
              <g transform={`translate(${w / 2}, ${ZONES.PUBLIC_ENDPOINT.y})`}>
                <rect
                  x={-120}
                  y={-20}
                  width={240}
                  height={40}
                  rx={20}
                  fill={COLORS.MID}
                  stroke={COLORS.CYAN}
                  strokeWidth={2}
                />
                <text
                  x={0}
                  y={6}
                  textAnchor="middle"
                  fontSize={14}
                  fill={COLORS.CYAN}
                >
                  example.com:443
                </text>
              </g>
            )}

            {/* Proxy Gate */}
            {proxyVisible && (
              <g transform={`translate(${w / 2}, ${ZONES.PROXY_GATE.y})`}>
                <rect
                  x={-140}
                  y={-40}
                  width={280}
                  height={80}
                  rx={16}
                  fill={COLORS.LIGHT}
                  stroke={COLORS.CYAN}
                  strokeWidth={3}
                />
                <text
                  x={0}
                  y={-8}
                  textAnchor="middle"
                  fontSize={18}
                  fontWeight={700}
                  fill={COLORS.CYAN}
                >
                  REVERSE PROXY
                </text>
                <text
                  x={0}
                  y={14}
                  textAnchor="middle"
                  fontSize={12}
                  fill={COLORS.MUTED}
                >
                  nginx / apache
                </text>
              </g>
            )}

            {/* Routing Chip */}
            {routingChipVisible && (
              <g transform={`translate(${w / 2}, ${ZONES.ROUTING.y})`}>
                <rect
                  x={-100}
                  y={-18}
                  width={200}
                  height={36}
                  rx={18}
                  fill={COLORS.PURPLE}
                  opacity={0.9}
                />
                <text
                  x={0}
                  y={6}
                  textAnchor="middle"
                  fontSize={13}
                  fontWeight={600}
                  fill={COLORS.TEXT_PRIMARY}
                >
                  /api → Backend A
                </text>
              </g>
            )}

            {/* Backend A */}
            {backendAVisible && (
              <g transform={`translate(${ZONES.BACKEND_A.x}, ${ZONES.BACKEND_A.y})`}>
                <rect
                  x={-90}
                  y={-35}
                  width={180}
                  height={70}
                  rx={12}
                  fill={COLORS.LIGHT}
                  stroke={COLORS.GREEN}
                  strokeWidth={2}
                  opacity={routingChipVisible ? 1 : 0.4}
                />
                <text
                  x={0}
                  y={-5}
                  textAnchor="middle"
                  fontSize={15}
                  fontWeight={700}
                  fill={COLORS.GREEN}
                >
                  BACKEND A
                </text>
                <text
                  x={0}
                  y={15}
                  textAnchor="middle"
                  fontSize={11}
                  fill={COLORS.MUTED}
                >
                  :8080
                </text>
              </g>
            )}

            {/* Backend B */}
            {backendBVisible && (
              <g transform={`translate(${ZONES.BACKEND_B.x}, ${ZONES.BACKEND_B.y})`}>
                <rect
                  x={-90}
                  y={-35}
                  width={180}
                  height={70}
                  rx={12}
                  fill={COLORS.LIGHT}
                  stroke={COLORS.ORANGE}
                  strokeWidth={2}
                  opacity={0.4}
                />
                <text
                  x={0}
                  y={-5}
                  textAnchor="middle"
                  fontSize={15}
                  fontWeight={700}
                  fill={COLORS.ORANGE}
                >
                  BACKEND B
                </text>
                <text
                  x={0}
                  y={15}
                  textAnchor="middle"
                  fontSize={11}
                  fill={COLORS.MUTED}
                >
                  :8081
                </text>
              </g>
            )}

            {/* Request Packet */}
            {packetVisible && (
              <g transform={`translate(${packetPos.x}, ${packetPos.y})`}>
                <circle r={18} fill={COLORS.BLUE} opacity={0.8} />
                <text
                  x={0}
                  y={6}
                  textAnchor="middle"
                  fontSize={12}
                  fontWeight={700}
                  fill={COLORS.TEXT_PRIMARY}
                >
                  GET
                </text>
              </g>
            )}

            {/* Response Capsule */}
            {responseVisible && (
              <g transform={`translate(${responsePos.x}, ${responsePos.y})`}>
                <rect
                  x={-24}
                  y={-16}
                  width={48}
                  height={32}
                  rx={16}
                  fill={COLORS.GREEN}
                  opacity={0.9}
                />
                <text
                  x={0}
                  y={6}
                  textAnchor="middle"
                  fontSize={11}
                  fontWeight={700}
                  fill={COLORS.TEXT_PRIMARY}
                >
                  200
                </text>
              </g>
            )}
            </g>
          )}
        </ContentBodyV1>
      )}
    </svg>
  )
}
