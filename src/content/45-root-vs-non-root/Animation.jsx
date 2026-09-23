// 45-root-vs-non-root/Animation.jsx
// ═══════════════════════════════════════════════════════════════════════════
// EKSEKUSI PLAN: Root vs Non-Root — kenapa tidak boleh selalu jadi raja server.
// 4 Acts: ilusi kemudahan root → kesalahan fatal satu spasi → blast radius
// peretasan (root vs www-data) → pola aman (akun khusus + sudo terbatas).
// Scene shell: scene-ui V1 portrait 820×1340.
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, TOTAL_DURATION,
  INTRO_CATEGORY, INTRO_TITLE_A, INTRO_TITLE_B, INTRO_SUBTITLE,
  ZONES, COPY, SFX_MAP, FS_FILES,
} from './data'
import { IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1 } from '../../shared/scene-ui/v1'
import { ACT_SCENES } from './acts'
import { CaptionBar } from './acts/common'

export default function RootVsNonRootAnimation({
  paused = false,
  speed = 1.0,
  volume = 75,
  previewSfx = true,
  audioUnlocked = false,
}) {
  // State management
  const [morphP, setMorphP] = useState(0)
  const [phaseIdx, setPhaseIdx] = useState(-1)
  const [contentStarted, setContentStarted] = useState(false)
  const [caption, setCaption] = useState('')
  const [captionColor, setCaptionColor] = useState(COLORS.BORDER_DEFAULT)
  const [captionAnchor, setCaptionAnchor] = useState({ x: ZONES.TERMINAL.x, y: ZONES.TERMINAL.y - 80 })

  // Act 1/2/4 — identitas user & terminal (dipakai lintas act)
  const [terminalVisible, setTerminalVisible] = useState(false)
  const [promptRoot, setPromptRoot] = useState(false)
  const [commandText, setCommandText] = useState('')
  const [dangerHighlight, setDangerHighlight] = useState(false)
  const [noConfirm, setNoConfirm] = useState(false)
  const [userBadgeVisible, setUserBadgeVisible] = useState(false)
  const [userRole, setUserRole] = useState('user')

  // Act 2/4 — server & filesystem (dipakai lintas act)
  const [serverVisible, setServerVisible] = useState(false)
  const [serverState, setServerState] = useState('healthy')
  const [fsVisible, setFsVisible] = useState(false)
  const [fsDestroyedCount, setFsDestroyedCount] = useState(0)

  // Act 3 — blast radius
  const [hackerVisible, setHackerVisible] = useState(false)
  const [hackerActive, setHackerActive] = useState(false)
  const [webappVisible, setWebappVisible] = useState(false)
  const [runAsRoot, setRunAsRoot] = useState(false)
  const [blastVisible, setBlastVisible] = useState(false)
  const [blastContained, setBlastContained] = useState(true)
  const [targetVisible, setTargetVisible] = useState(false)
  const [targetBreached, setTargetBreached] = useState(false)

  // Act 4 — pola aman
  const [systemdVisible, setSystemdVisible] = useState(false)
  const [sudoVisible, setSudoVisible] = useState(false)

  // Refs
  const tlRef = useRef(null)
  const volumeRef = useRef(volume)
  const speedRef = useRef(speed)
  const previewSfxRef = useRef(previewSfx)
  const audioUnlockedRef = useRef(audioUnlocked)

  useEffect(() => { volumeRef.current = volume }, [volume])
  useEffect(() => { speedRef.current = speed }, [speed])
  useEffect(() => { previewSfxRef.current = previewSfx }, [previewSfx])
  useEffect(() => { audioUnlockedRef.current = audioUnlocked }, [audioUnlocked])

  const playSfx = (sfxKey) => {
    if (!previewSfxRef.current || !audioUnlockedRef.current) return
    const sfxConfig = SFX_MAP[sfxKey]
    if (!sfxConfig) return
    const audio = new Audio(`/audio/${sfxConfig.category}/${sfxConfig.name}.wav`)
    audio.volume = Math.min(1.0, volumeRef.current / 100)
    audio.playbackRate = speedRef.current
    audio.play().catch(() => {})
  }

  const popIn = (tl, time, setState, sfxKey = 'POP') => {
    tl.add(() => {
      setState(true)
      if (sfxKey) playSfx(sfxKey)
    }, time)
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
    master.add(() => setPhaseIdx(-1), time)
    const morphDur = 0.8
    master.to({}, {
      duration: morphDur,
      onUpdate: function() { setMorphP(this.progress()) }
    }, time)
    time += morphDur
    master.add(() => setContentStarted(true), time)
    time += 0.3

    // ═══════════════════════════════════════════════════════════
    // ACT 1: ILUSI KEMUDAHAN LOGIN ROOT (9s)
    // ═══════════════════════════════════════════════════════════
    master.add(() => setPhaseIdx(0), time)
    master.add(() => playSfx('WHOOSH'), time)

    popIn(master, time, setUserBadgeVisible, 'POP')
    master.add(() => { setUserRole('user'); setTerminalVisible(true); setPromptRoot(false) }, time + 0.15)
    setC(master, time + 0.3, COPY.ACT1_BEFORE, COLORS.BLUE, { x: ZONES.TERMINAL.x, y: ZONES.TERMINAL.y - 80 })
    time += 1.8

    master.add(() => { setCommandText('sudo su'); playSfx('TICK') }, time)
    setC(master, time, COPY.ACT1_ESCALATE, COLORS.PINK, { x: ZONES.TERMINAL.x, y: ZONES.TERMINAL.y - 80 })
    time += 1.6

    master.add(() => {
      setPromptRoot(true)
      setUserRole('root')
      setCommandText('')
      playSfx('SUCCESS')
    }, time)
    setC(master, time + 0.1, COPY.ACT1_AFTER, COLORS.PINK, { x: ZONES.USER_BADGE.x, y: ZONES.USER_BADGE.y - 70 })
    time += 1.8

    master.add(() => { setCommandText('rm important-config'); setNoConfirm(true); playSfx('TICK') }, time)
    time += 1.8

    master.add(() => {
      setCaption('')
      setCommandText('')
      setNoConfirm(false)
      playSfx('POP_OUT')
    }, time)
    time += 1.0

    // ═══════════════════════════════════════════════════════════
    // ACT 2: KESALAHAN FATAL SATU SPASI (10s)
    // ═══════════════════════════════════════════════════════════
    master.add(() => setPhaseIdx(1), time)
    master.add(() => playSfx('WHOOSH'), time)
    setC(master, time + 0.2, COPY.ACT2_BEFORE, COLORS.TEXT_SECONDARY, { x: ZONES.TERMINAL.x, y: ZONES.TERMINAL.y - 80 })
    time += 1.5

    master.add(() => { setCommandText('rm -rf / tmp/*'); playSfx('TICK') }, time)
    time += 0.8
    master.add(() => { setDangerHighlight(true); playSfx('ALERT') }, time)
    setC(master, time, COPY.ACT2_TYPO, COLORS.RED, { x: ZONES.TERMINAL.x, y: ZONES.TERMINAL.y - 80 })
    time += 1.6

    master.add(() => { setNoConfirm(true); playSfx('TICK') }, time)
    setC(master, time, COPY.ACT2_EXEC, COLORS.RED, { x: ZONES.TERMINAL.x, y: ZONES.TERMINAL.y - 80 })
    time += 1.2

    master.add(() => { setFsVisible(true) }, time)
    FS_FILES.forEach((_, i) => {
      master.add(() => {
        setFsDestroyedCount(i + 1)
        playSfx('POP_OUT')
      }, time + i * 0.4)
    })
    time += FS_FILES.length * 0.4 + 0.3

    master.add(() => { setServerVisible(true); setServerState('destroyed'); playSfx('ALERT') }, time)
    setC(master, time, COPY.ACT2_AFTER, COLORS.RED, { x: ZONES.SERVER.x, y: ZONES.SERVER.y - 70 })
    time += 1.8

    master.add(() => {
      setCaption('')
      setTerminalVisible(false)
      setUserBadgeVisible(false)
      setServerVisible(false)
      setFsVisible(false)
      setFsDestroyedCount(0)
      setDangerHighlight(false)
      setNoConfirm(false)
      setCommandText('')
      setPromptRoot(false)
      playSfx('POP_OUT')
    }, time)
    time += 0.5

    // ═══════════════════════════════════════════════════════════
    // ACT 3: SKENARIO PERETASAN — BLAST RADIUS (11s)
    // ═══════════════════════════════════════════════════════════
    master.add(() => setPhaseIdx(2), time)
    master.add(() => playSfx('WHOOSH'), time)

    popIn(master, time, setWebappVisible, 'POP')
    popIn(master, time + 0.2, setHackerVisible, 'BOUNCE')
    setC(master, time + 0.3, COPY.ACT3_BEFORE, COLORS.ORANGE, { x: ZONES.WEBAPP.x, y: ZONES.WEBAPP.y - 70 })
    time += 1.6

    master.add(() => { setHackerActive(true); playSfx('ALERT') }, time)
    time += 1.0

    // Skenario A — web app run as root
    master.add(() => {
      setRunAsRoot(true)
      setTargetVisible(true)
      setBlastVisible(true)
      setBlastContained(false)
      playSfx('CONNECT')
    }, time)
    setC(master, time + 0.1, COPY.ACT3_SCENARIO_A, COLORS.RED, { x: ZONES.WEBAPP.x, y: ZONES.WEBAPP.y - 70 })
    time += 0.9
    master.add(() => { setTargetBreached(true); playSfx('ALERT') }, time)
    time += 1.6

    master.add(() => { setBlastVisible(false); setCaption('') }, time)
    time += 0.4

    // Skenario B — web app run as www-data
    master.add(() => {
      setRunAsRoot(false)
      setTargetBreached(false)
      setBlastVisible(true)
      setBlastContained(true)
      playSfx('DENY')
    }, time)
    setC(master, time + 0.1, COPY.ACT3_SCENARIO_B, COLORS.EMERALD, { x: ZONES.WEBAPP.x, y: ZONES.WEBAPP.y - 70 })
    time += 2.0

    setC(master, time, COPY.ACT3_AFTER, COLORS.EMERALD, { x: ZONES.WEBAPP.x, y: ZONES.WEBAPP.y - 70 })
    time += 1.6

    master.add(() => {
      setCaption('')
      setHackerVisible(false)
      setHackerActive(false)
      setWebappVisible(false)
      setBlastVisible(false)
      setTargetVisible(false)
      playSfx('POP_OUT')
    }, time)
    time += 0.5

    // ═══════════════════════════════════════════════════════════
    // ACT 4: POLA AMAN — AKUN KHUSUS & SUDO TERBATAS (10s)
    // ═══════════════════════════════════════════════════════════
    master.add(() => setPhaseIdx(3), time)
    master.add(() => playSfx('WHOOSH'), time)

    popIn(master, time, setServerVisible, 'POP')
    master.add(() => setServerState('healthy'), time)
    popIn(master, time + 0.2, setSystemdVisible, 'POP')
    setC(master, time + 0.3, COPY.ACT4_BEFORE, COLORS.EMERALD, { x: ZONES.WEBAPP.x, y: ZONES.WEBAPP.y - 65 })
    time += 1.8

    master.add(() => { setUserBadgeVisible(true); setUserRole('appuser'); playSfx('POP') }, time)
    setC(master, time, COPY.ACT4_SCOPED, COLORS.EMERALD, { x: ZONES.USER_BADGE.x, y: ZONES.USER_BADGE.y - 70 })
    time += 1.8

    master.add(() => { setSudoVisible(true); playSfx('CONNECT') }, time)
    setC(master, time, COPY.ACT4_SUDO, COLORS.PURPLE, { x: ZONES.TARGET.x, y: ZONES.WEBAPP.y - 70 })
    time += 1.6

    master.add(() => { setSudoVisible(false); playSfx('TICK') }, time)
    setC(master, time + 0.1, COPY.ACT4_AFTER, COLORS.EMERALD, { x: ZONES.SERVER.x, y: ZONES.SERVER.y - 70 })
    master.add(() => playSfx('SUCCESS'), time + 0.1)
    time += 2.3

    // ===== CLEANUP & LOOP RESET =====
    master.add(() => {
      setUserBadgeVisible(false)
      setUserRole('user')
      setTerminalVisible(false)
      setPromptRoot(false)
      setCommandText('')
      setDangerHighlight(false)
      setNoConfirm(false)
      setServerVisible(false)
      setServerState('healthy')
      setFsVisible(false)
      setFsDestroyedCount(0)
      setHackerVisible(false)
      setHackerActive(false)
      setWebappVisible(false)
      setRunAsRoot(false)
      setBlastVisible(false)
      setBlastContained(true)
      setTargetVisible(false)
      setTargetBreached(false)
      setSystemdVisible(false)
      setSudoVisible(false)
      setCaption('')
      setContentStarted(false)
      playSfx('WHOOSH_LOW')
    }, time)

    return () => { master.kill() }
  }, [])

  useEffect(() => {
    if (!tlRef.current) return
    if (paused) tlRef.current.pause()
    else tlRef.current.play()
  }, [paused])

  useEffect(() => {
    if (!tlRef.current) return
    tlRef.current.timeScale(speed)
  }, [speed])

  // ═══════════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════════
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

        <IntroHeaderMorphV1
          progress={morphP}
          category={INTRO_CATEGORY}
          titleSegments={[
            { label: INTRO_TITLE_A, color: COLORS.PINK },
            { label: INTRO_TITLE_B, color: COLORS.EMERALD }
          ]}
          titleLines={[
            [{ label: INTRO_TITLE_A, color: COLORS.PINK }],
            [{ label: INTRO_TITLE_B.trim(), color: COLORS.EMERALD }],
          ]}
          subtitle={INTRO_SUBTITLE}
          bg={4}
          bgScenes={ACT_SCENES}
        />

        {contentStarted && (
          <ActBadgeNavigatorV1
            phases={PHASES}
            activeIndex={phaseIdx}
            totalDuration={TOTAL_DURATION}
          />
        )}

        {contentStarted && (
          <ContentBodyV1>
            <CaptionBar text={caption} color={captionColor} x={captionAnchor.x} y={captionAnchor.y} />

            {(() => {
              const Act = ACT_SCENES[phaseIdx]
              if (!Act) return null
              return (
                <Act state={{
                  terminalVisible, promptRoot, commandText, dangerHighlight, noConfirm,
                  userBadgeVisible, userRole,
                  serverVisible, serverState,
                  fsVisible, fsDestroyedCount,
                  hackerVisible, hackerActive,
                  webappVisible, runAsRoot,
                  blastVisible, blastContained,
                  targetVisible, targetBreached,
                  systemdVisible, sudoVisible,
                }} />
              )
            })()}
          </ContentBodyV1>
        )}
      </svg>
    </div>
  )
}
