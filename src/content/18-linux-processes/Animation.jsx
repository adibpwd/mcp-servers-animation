// src/content/60-linux-processes/Animation.jsx
// Eksekusi plan awal + revisi-01 (hapus narration bubble, caption lokal,
// icon accent, real-case "laptop lambat") + revisi-02 (migrasi ke pola
// "1 act = 1 file" — lihat docs/standardizations/07-act-scene-pattern.md).
// File ini murni komposisi: timeline GSAP + state; SEMUA presentational
// (komponen SVG per elemen) sudah pindah ke acts/common.jsx + acts/ActN.jsx.
// Status: kode + data, BELUM preview manual & export MP4.
import React, { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, PROCESSES, BROWSER_SPIKE,
  CAPTIONS, SFX_MAP,
  INTRO_CATEGORY_LABEL, INTRO_DOMAIN, INTRO_TITLE_A, INTRO_TITLE_B, INTRO_SUBTITLE,
  INTRO_TITLE_LINES,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'
import {
  IntroHeaderMorphV1,
  ActBadgeNavigatorV1,
  ContentBodyV1,
  lerp,
} from '../../shared/scene-ui/v1'
import { ACT_SCENES } from './acts'
import { PROGRAM_LANE_X, PROGRAM_LANE_Y, ARENA_Y } from './acts/common'

export default function LinuxProcessesAnimation({
  paused = false,
  speed = 1.0,
  volume = 75,
  previewSfx = true,
  audioUnlocked = false,
}) {
  const tlRef = useRef(null)
  const volumeRef = useRef(volume)
  const speedRef = useRef(speed)
  const audioUnlockedRef = useRef(audioUnlocked)

  const [phaseIdx, setPhaseIdx] = useState(0)
  const [morphP, setMorphP] = useState(0)
  const [contentStarted, setContentStarted] = useState(false)
  const [caption, setCaption] = useState('')
  const [captionPos, setCaptionPos] = useState({ x: 0, y: 0 })
  const [pop, setPop] = useState({})
  const [handoff, setHandoff] = useState(0)
  const [pidVisible, setPidVisible] = useState({ browser: false, editor: false, music: false })
  const [resourceVal, setResourceVal] = useState({
    browser: { cpu: 0, mem: 0 }, editor: { cpu: 0, mem: 0 }, music: { cpu: 0, mem: 0 },
  })
  const [highlightBrowser, setHighlightBrowser] = useState(false)
  const [psRows, setPsRows] = useState(0)
  const [promptTyped, setPromptTyped] = useState(false)
  const [showTakeaway, setShowTakeaway] = useState(false)
  const [highlightPsRow0, setHighlightPsRow0] = useState(false)

  const play = (entry) => {
    if (!audioUnlockedRef.current || !entry) return
    sfxLoader.play(entry.category, entry.name, { volume: volumeRef.current, speed: speedRef.current })
  }

  useEffect(() => {
    volumeRef.current = volume
    speedRef.current = speed
    audioUnlockedRef.current = audioUnlocked
    sfxLoader.setEnabled(Boolean(previewSfx && audioUnlocked))
  }, [volume, speed, previewSfx, audioUnlocked])

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.6 })
    tlRef.current = tl
    window.__animationTimeline = tl

    const popIn = (at, id, entry = SFX_MAP.POP, fromY = 12) => {
      tl.add(() => setPop((prev) => ({ ...prev, [id]: { opacity: 0, scale: 0, x: 0, y: fromY } })), at)
      const obj = { v: 0 }
      tl.to(obj, {
        v: 1, duration: 0.42, ease: 'back.out(1.55)',
        onStart: () => play(entry),
        onUpdate: () => setPop((prev) => ({
          ...prev, [id]: { opacity: Math.min(1, obj.v * 1.4), scale: obj.v, x: 0, y: fromY * (1 - obj.v) },
        })),
      }, at)
    }

    const fadeOut = (at, id) => {
      tl.add(() => setPop((prev) => ({ ...prev, [id]: { ...(prev[id] || {}), opacity: 0 } })), at)
    }

    // caption badge lokal — satu channel, dipindah posisi & teks tiap beat
    // (revisi-01 §2.3, menggantikan narration-bubble global)
    const captionBeat = (at, text, x, y, entry = SFX_MAP.TICK) => {
      tl.add(() => { setCaption(text); setCaptionPos({ x, y }) }, at)
      popIn(at, 'caption', entry, 10)
    }

    tl.add(() => {
      setPhaseIdx(0)
      setMorphP(0)
      setContentStarted(false)
      setCaption('')
      setCaptionPos({ x: 0, y: 0 })
      setPop({})
      setHandoff(0)
      setPidVisible({ browser: false, editor: false, music: false })
      setResourceVal({ browser: { cpu: 0, mem: 0 }, editor: { cpu: 0, mem: 0 }, music: { cpu: 0, mem: 0 } })
      setHighlightBrowser(false)
      setPsRows(0)
      setPromptTyped(false)
      setShowTakeaway(false)
      setHighlightPsRow0(false)
    }, 0)

    const morph = { p: 0 }
    tl.to(morph, { p: 1, duration: 0.9, ease: 'power3.inOut', onUpdate: () => setMorphP(morph.p) }, 0.25)

    tl.add(() => { setContentStarted(true); play(SFX_MAP.SHIMMER) }, 1.15)

    const INTRO_DELAY = 1.15
    const actStart = [0, 0, 0, 0]
    actStart[0] = INTRO_DELAY
    for (let i = 1; i < 4; i += 1) actStart[i] = actStart[i - 1] + PHASES[i - 1].duration

    // ── Act 1 — file diam di disk → dijalankan → jadi process ──
    tl.add(() => setPhaseIdx(0), actStart[0])
    captionBeat(actStart[0] + 0.15, CAPTIONS.HOOK, 170, 120)
    popIn(actStart[0] + 1.3, 'launch-cursor', SFX_MAP.POP, 10)
    tl.add(() => play(SFX_MAP.TICK), actStart[0] + 2.0)
    fadeOut(actStart[0] + 2.3, 'launch-cursor')
    captionBeat(actStart[0] + 2.9, CAPTIONS.LAUNCH, 0, 0)
    const handoffObj = { v: 0 }
    tl.to(handoffObj, {
      v: 1, duration: 1.0, ease: 'power2.inOut',
      onStart: () => play(SFX_MAP.SWOOSH),
      onUpdate: () => setHandoff(handoffObj.v),
    }, actStart[0] + 3.0)
    tl.add(() => play(SFX_MAP.POP), actStart[0] + 4.05)
    captionBeat(actStart[0] + 7.0, CAPTIONS.CLIFFHANGER, 150, 380)

    // ── Act 2 — banyak process, tiap dapat PID ──
    tl.add(() => setPhaseIdx(1), actStart[1])
    captionBeat(actStart[1] + 0.15, CAPTIONS.PID, 150, 380)
    popIn(actStart[1] + 0.3, 'editor', SFX_MAP.POP)
    popIn(actStart[1] + 0.9, 'music', SFX_MAP.POP2)
    tl.add(() => { setPidVisible({ browser: true, editor: true, music: true }); play(SFX_MAP.TICK) }, actStart[1] + 1.6)
    captionBeat(actStart[1] + 3.2, CAPTIONS.CLONE, 150, 335)
    popIn(actStart[1] + 3.4, 'clone', SFX_MAP.POP2)
    fadeOut(actStart[1] + 7.0, 'clone')
    captionBeat(actStart[1] + 7.2, CAPTIONS.PID_REUSE, 258, 355)
    popIn(actStart[1] + 7.2, 'pid-reuse', SFX_MAP.POP2)
    fadeOut(actStart[1] + 8.7, 'pid-reuse')

    // ── Act 3 — process memakai resource, lalu "spike" (real case) ──
    tl.add(() => setPhaseIdx(2), actStart[2])
    captionBeat(actStart[2] + 0.15, CAPTIONS.RESOURCE, 366, 642)
    popIn(actStart[2] + 0.3, 'resourcePanels', SFX_MAP.POP)
    const resObj = { bC: 0, bM: 0, eC: 0, eM: 0, mC: 0, mM: 0 }
    tl.to(resObj, {
      bC: PROCESSES[0].cpu, bM: PROCESSES[0].mem,
      eC: PROCESSES[1].cpu, eM: PROCESSES[1].mem,
      mC: PROCESSES[2].cpu, mM: PROCESSES[2].mem,
      duration: 1.3, ease: 'power2.out',
      onStart: () => play(SFX_MAP.TALLY),
      onUpdate: () => setResourceVal({
        browser: { cpu: resObj.bC, mem: resObj.bM },
        editor: { cpu: resObj.eC, mem: resObj.eM },
        music: { cpu: resObj.mC, mem: resObj.mM },
      }),
    }, actStart[2] + 0.9)
    tl.add(() => { setHighlightBrowser(true); play(SFX_MAP.DING) }, actStart[2] + 3.5)
    captionBeat(actStart[2] + 3.5, CAPTIONS.RESOURCE_DIFF, 150, 642)
    popIn(actStart[2] + 4.5, 'warning-icon', SFX_MAP.WARNING)
    const spikeObj = { cpu: PROCESSES[0].cpu, mem: PROCESSES[0].mem }
    tl.to(spikeObj, {
      cpu: BROWSER_SPIKE.cpu, mem: BROWSER_SPIKE.mem, duration: 1.0, ease: 'power2.out',
      onStart: () => play(SFX_MAP.TALLY),
      onUpdate: () => setResourceVal((prev) => ({ ...prev, browser: { cpu: spikeObj.cpu, mem: spikeObj.mem } })),
    }, actStart[2] + 4.7)
    captionBeat(actStart[2] + 5.9, CAPTIONS.SPIKE, 150, 642)
    fadeOut(actStart[2] + 7.5, 'warning-icon')

    // ── Act 4 — lihat process hidup dari terminal, temukan biang lambat ──
    tl.add(() => setPhaseIdx(3), actStart[3])
    captionBeat(actStart[3] + 0.15, CAPTIONS.PS, 366, 765)
    popIn(actStart[3] + 0.3, 'terminal', SFX_MAP.POP)
    tl.add(() => { setPromptTyped(true); play(SFX_MAP.TICK) }, actStart[3] + 1.1)
    tl.add(() => { setPsRows(1); play(SFX_MAP.PAPER) }, actStart[3] + 1.9)
    tl.add(() => { setPsRows(2); play(SFX_MAP.PAPER) }, actStart[3] + 2.5)
    tl.add(() => { setPsRows(3); play(SFX_MAP.PAPER) }, actStart[3] + 3.1)
    tl.add(() => { setHighlightPsRow0(true); play(SFX_MAP.DING) }, actStart[3] + 3.5)
    captionBeat(actStart[3] + 3.9, CAPTIONS.PS_PID, 150, 765)
    tl.add(() => {
      setPop((prev) => ({ ...prev, caption: { ...(prev.caption || {}), opacity: 0 } }))
      setShowTakeaway(true)
    }, actStart[3] + 8.7)

    tl.to({}, { duration: 0.01 }, actStart[3] + PHASES[3].duration)

    return () => {
      tl.kill()
      if (window.__animationTimeline === tl) delete window.__animationTimeline
    }
  }, [])

  useEffect(() => {
    const tl = tlRef.current
    if (!tl) return
    tl.timeScale(speed)
    if (paused) tl.pause()
    else tl.resume()
  }, [paused, speed])

  const browserX = lerp(PROGRAM_LANE_X, PROCESSES[0].slotX, handoff)
  const browserY = lerp(PROGRAM_LANE_Y, ARENA_Y, handoff)
  const browserScale = lerp(0.55, 1, handoff)

  const captionIsLaunch = caption === CAPTIONS.LAUNCH
  const captionX = captionIsLaunch ? browserX : captionPos.x
  const captionY = captionIsLaunch ? browserY - 70 : captionPos.y

  // state yang dikirim ke ACT_SCENES[phaseIdx] (kontrak §2.2,
  // docs/standardizations/07-act-scene-pattern.md) — semua field yang
  // dibaca SceneChrome/ActN via `state`.
  const sceneState = {
    pop,
    caption, captionX, captionY, captionColor: PHASES[phaseIdx].badgeColor,
    handoff, browserX, browserY, browserScale,
    pidVisible, resourceVal, highlightBrowser,
    promptTyped, psRows, showTakeaway, highlightPsRow0,
  }
  const Act = ACT_SCENES[phaseIdx]

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`} style={{
      width: '100%', height: '100%', maxHeight: '100vh',
      maxWidth: `calc(100vh * ${VW} / ${VH})`,
      background: COLORS.BG, userSelect: 'none',
    }}>
      <defs>
        <filter id="linux-processes-glow">
          <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      <rect width={VW} height={VH} fill={COLORS.BG} />
      <g opacity="0.05">
        {Array.from({ length: 21 }).map((_, i) => <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={VH} stroke={COLORS.BORDER} />)}
        {Array.from({ length: 34 }).map((_, i) => <line key={`h${i}`} x1={0} y1={i * 40} x2={VW} y2={i * 40} stroke={COLORS.BORDER} />)}
      </g>

      <IntroHeaderMorphV1
        progress={morphP}
        categorySegments={[
          { label: INTRO_CATEGORY_LABEL + ' · ', color: COLORS.MUTED },
          { label: INTRO_DOMAIN, color: COLORS.PROGRAM },
        ]}
        titleSegments={[
          { label: INTRO_TITLE_A, color: COLORS.PROGRAM },
          { label: INTRO_TITLE_B, color: COLORS.SUCCESS },
        ]}
        subtitle={INTRO_SUBTITLE}
        titleLines={INTRO_TITLE_LINES}
        titleFilter="url(#linux-processes-glow)"
        bg={4}
        bgScenes={ACT_SCENES}
        testId="linux-processes-intro"
      />

      {contentStarted && (
        <ActBadgeNavigatorV1 phases={PHASES} activeIndex={phaseIdx} testId="linux-processes-navigator" />
      )}

      {contentStarted && (
        <ContentBodyV1 debugName="linux-processes-body">
          <Act state={sceneState} />
        </ContentBodyV1>
      )}
    </svg>
  )
}
