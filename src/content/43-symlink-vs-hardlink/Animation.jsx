// src/content/43-symlink-vs-hardlink/Animation.jsx
// ═══════════════════════════════════════════════════════════════════════
// EKSEKUSI-01 (lihat revisi/2026-09-23-revisi-01-eksekusi-4-act.md):
// Build dari nol mengikuti _docs/SYMLINK_VS_HARDLINK_PLAN.md, pola
// "1 act = 1 file" (docs/standardizations/07-act-scene-pattern.md).
//
// Continuity: Act 1-3 berbagi InodeChrome (diskBlock Inode persisten,
// key pop 'diskBlock' TIDAK di-reset antar-Act — original.txt tetap
// terlihat sejak Act 1 sampai dihapus di Act 2). Act 4 berganti scene ke
// DeployChrome (nginx) dengan layout titik SIMETRIS Act 1-3 (lihat
// data.js AXIS_X/ROW_*), bukan lompatan visual acak.
//
// Icon: inline SVG, tidak ada folder icons/.
// CATATAN EKSEKUSI: kode + data ditulis sekali jalan, BELUM preview
// manual di browser maupun compile-check/export MP4.
// ═══════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, SFX_MAP,
  INTRO_CATEGORY_LABEL, INTRO_TITLE_A, INTRO_TITLE_B, INTRO_SUBTITLE,
  ACT1_COPY, ACT2_COPY, ACT3_COPY, ACT4_COPY, CLOSING_CAPTION,
  ACT2_CMD_CREATE, ACT2_CMD_DELETE, ACT3_CMD_CREATE, ACT3_CMD_DELETE, ACT4_CMD_SWAP,
} from './data'
import { ACT_SCENES } from './acts'
import sfxLoader from '../../shared/audio/sfxLoader'
import { IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1 } from '../../shared/scene-ui/v1'

export default function SymlinkVsHardlinkAnimation({
  paused = false,
  speed = 1.0,
  volume = 75,
  previewSfx = true,
  audioUnlocked = false,
}) {
  const svgRef = useRef(null)
  const tlRef = useRef(null)
  const audioUnlockedRef = useRef(audioUnlocked)
  const volumeRef = useRef(volume)
  const speedRef = useRef(speed)

  const [phaseIdx, setPhaseIdx] = useState(0)
  const [caption, setCaption] = useState('')
  const [pop, setPop] = useState({})

  const [morphP, setMorphP] = useState(0)
  const [headerOpacity, setHeaderOpacity] = useState(0)
  const [contentStarted, setContentStarted] = useState(false)

  const [cmdText, setCmdText] = useState('')
  const [linkCount, setLinkCount] = useState(1)
  const [originalDeleted, setOriginalDeleted] = useState(false)
  const [symlinkBroken, setSymlinkBroken] = useState(false)
  const [deployTarget, setDeployTarget] = useState('v1')
  const [closingOpacity, setClosingOpacity] = useState(0)

  useEffect(() => {
    const shouldEnable = previewSfx && audioUnlocked
    sfxLoader.setEnabled(shouldEnable)
    audioUnlockedRef.current = audioUnlocked
    volumeRef.current = volume
    speedRef.current = speed
  }, [previewSfx, audioUnlocked, volume, speed])

  // ── popIn/popOut — elemen pop di posisi anchor-nya sendiri (delta
  // fromX/fromY meluruh ke 0), dipakai semua elemen Act 1-4. ──
  const popIn = (tl, time, id, opts = {}) => {
    const { duration = 0.45, ease = 'back.out(1.6)', sfx = true, fromX = 0, fromY = 0,
      sfxName = SFX_MAP.POP.name, sfxCategory = 'ui', volumeMult = 1 } = opts
    tl.add(() => setPop(prev => ({ ...prev, [id]: { scale: 0, opacity: 0, x: fromX, y: fromY } })), time)
    const o = { v: 0 }
    tl.to(o, {
      v: 1, duration, ease,
      onStart: () => { if (sfx) sfxLoader.play(sfxCategory, sfxName, { volume: volumeRef.current * volumeMult, speed: speedRef.current }) },
      onUpdate: () => setPop(prev => ({
        ...prev,
        [id]: { scale: o.v, opacity: Math.min(1, o.v * 1.4), x: fromX * (1 - o.v), y: fromY * (1 - o.v) },
      })),
    }, time)
  }

  const popOut = (tl, time, id, opts = {}) => {
    const { duration = 0.3, ease = 'power1.in' } = opts
    const o = { v: 1 }
    tl.to(o, {
      v: 0, duration, ease,
      onUpdate: () => setPop(prev => ({ ...prev, [id]: { ...(prev[id] || {}), scale: o.v, opacity: o.v } })),
    }, time)
  }

  const say = (tl, time, text) => tl.add(() => setCaption(text), time)
  const sfxOn = (tl, time, fn) => tl.add(() => audioUnlockedRef.current && fn(), time)

  // ═══════════════════════════════════════════════════════════════════
  // MASTER TIMELINE — 4 Act tanpa jeda kosong.
  // ═══════════════════════════════════════════════════════════════════
  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 })
    tlRef.current = tl
    window.__animationTimeline = tl
    window.__flushSync = flushSync

    let t = 0

    tl.add(() => {
      setMorphP(0); setHeaderOpacity(1); setContentStarted(false)
      setPop({}); setCaption(''); setPhaseIdx(0)
      setCmdText(''); setLinkCount(1); setOriginalDeleted(false)
      setSymlinkBroken(false); setDeployTarget('v1'); setClosingOpacity(0)
    }, t)

    // ── INTRO — hero centered → header ──
    t += 0.2
    const mo = { p: 0 }
    tl.to(mo, { p: 1, duration: 0.8, ease: 'power3.inOut', onUpdate: () => setMorphP(mo.p) }, t)
    sfxOn(tl, t, () => sfxLoader.transition(SFX_MAP.TELEPORT.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 0.8
    tl.add(() => setContentStarted(true), t)

    // ═══════════════ ACT 1 — Konsep Inode & Nama File ═══════════════
    tl.add(() => setPhaseIdx(0), t)
    popIn(tl, t + 0.1, 'diskBlock', { fromY: -20 })
    say(tl, t + 0.15, ACT1_COPY.diskIntro)
    t += 1.5
    say(tl, t, ACT1_COPY.inodeNumber)
    t += 1.5
    popIn(tl, t, 'originalFile', { fromY: 20 })
    say(tl, t + 0.1, ACT1_COPY.nameIsLabel)
    sfxOn(tl, t + 0.4, () => sfxLoader.ui(SFX_MAP.TICK.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 2.0
    say(tl, t, ACT1_COPY.pointsTo)
    t += 2.4

    // ═══════════════ ACT 2 — Hard Link: Dua Pintu Satu Ruangan ═══════════════
    tl.add(() => setPhaseIdx(1), t)
    tl.add(() => setCmdText(ACT2_CMD_CREATE), t)
    popIn(tl, t + 0.05, 'cmdBar', { fromY: -10, sfx: false })
    say(tl, t + 0.15, ACT2_COPY.create)
    sfxOn(tl, t + 0.2, () => sfxLoader.ui(SFX_MAP.TICK.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 1.6
    popIn(tl, t, 'hardlinkFile', { fromY: 20 })
    tl.add(() => setLinkCount(2), t + 0.3)
    sfxOn(tl, t + 0.3, () => sfxLoader.success(SFX_MAP.DING.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t + 0.35, ACT2_COPY.counterUp)
    t += 1.8
    say(tl, t, ACT2_COPY.bothWork)
    t += 1.8

    tl.add(() => setCmdText(ACT2_CMD_DELETE), t)
    say(tl, t + 0.1, ACT2_COPY.deleteOriginal)
    sfxOn(tl, t + 0.5, () => sfxLoader.play('warnings', SFX_MAP.ALERT_PULSE.name, { volume: volumeRef.current, speed: speedRef.current }))
    tl.add(() => { setOriginalDeleted(true); setLinkCount(1) }, t + 0.6)
    t += 1.7
    say(tl, t, ACT2_COPY.dataIntact)
    sfxOn(tl, t + 0.1, () => sfxLoader.success(SFX_MAP.CONFIRM.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 2.0
    popOut(tl, t, 'cmdBar', {})
    t += 0.3

    // ═══════════════ ACT 3 — Symlink: Papan Petunjuk Jalan ═══════════════
    tl.add(() => setPhaseIdx(2), t)
    tl.add(() => setPop(prev => ({ ...prev, diskBlock: { ...(prev.diskBlock || {}), opacity: 0.4 } })), t)
    tl.add(() => setCmdText(ACT3_CMD_CREATE), t)
    popIn(tl, t + 0.05, 'cmdBar', { fromY: -10, sfx: false })
    popIn(tl, t + 0.15, 'v1Folder', { fromY: 20 })
    say(tl, t + 0.2, ACT3_COPY.create)
    sfxOn(tl, t + 0.2, () => sfxLoader.ui(SFX_MAP.TICK.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 1.8
    popIn(tl, t, 'symlinkFile', { fromY: 20 })
    say(tl, t + 0.1, ACT3_COPY.isPath)
    sfxOn(tl, t + 0.15, () => sfxLoader.transition(SFX_MAP.WHOOSH.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 2.0
    say(tl, t, ACT3_COPY.notInode)
    t += 2.0

    tl.add(() => setCmdText(ACT3_CMD_DELETE), t)
    say(tl, t + 0.1, ACT3_COPY.deleteTarget)
    sfxOn(tl, t + 0.5, () => sfxLoader.play('warnings', SFX_MAP.ALERT_PULSE.name, { volume: volumeRef.current, speed: speedRef.current }))
    tl.add(() => setSymlinkBroken(true), t + 0.6)
    t += 1.7
    say(tl, t, ACT3_COPY.broken)
    t += 2.0
    popOut(tl, t, 'cmdBar', {})
    t += 0.3

    // ═══════════════ ACT 4 — Zero-Downtime Deployment ═══════════════
    tl.add(() => setPhaseIdx(3), t)
    popIn(tl, t + 0.05, 'nginx', { fromY: -20 })
    popIn(tl, t + 0.2, 'current', { fromY: 20 })
    popIn(tl, t + 0.35, 'v1Deploy', { fromY: 20 })
    say(tl, t + 0.15, ACT4_COPY.setup)
    t += 1.8
    say(tl, t, ACT4_COPY.pointsV1)
    t += 1.6
    popIn(tl, t, 'v2Deploy', { fromY: 20, sfx: false })
    say(tl, t + 0.1, ACT4_COPY.v2Ready)
    sfxOn(tl, t + 0.1, () => sfxLoader.ui(SFX_MAP.TICK.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 1.8

    tl.add(() => setCmdText(ACT4_CMD_SWAP), t)
    popIn(tl, t + 0.05, 'cmdBar', { fromY: -10, sfx: false })
    say(tl, t + 0.15, ACT4_COPY.swap)
    t += 1.5
    tl.add(() => setDeployTarget('v2'), t)
    sfxOn(tl, t, () => sfxLoader.impact(SFX_MAP.LOCK.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t + 0.1, ACT4_COPY.instant)
    t += 1.6
    say(tl, t, ACT4_COPY.noRestart)
    sfxOn(tl, t + 0.1, () => sfxLoader.success(SFX_MAP.CONFIRM.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 1.8
    popOut(tl, t, 'cmdBar', {})
    t += 0.3

    say(tl, t, CLOSING_CAPTION)
    const co = { v: 0 }
    tl.to(co, { v: 1, duration: 0.6, ease: 'power2.out', onUpdate: () => setClosingOpacity(co.v) }, t)
    sfxOn(tl, t, () => sfxLoader.success(SFX_MAP.DING.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 2.6

    return () => {
      tl.kill()
      delete window.__animationTimeline
      delete window.__flushSync
    }
  }, [])

  useEffect(() => {
    if (!tlRef.current) return
    tlRef.current.timeScale(speed)
    if (paused) tlRef.current.pause(); else tlRef.current.resume()
  }, [speed, paused])

  return (
    <svg ref={svgRef} viewBox={`0 0 ${VW} ${VH}`}
      style={{ width: '100%', height: '100%', maxHeight: '100vh',
        maxWidth: `calc(100vh * ${VW} / ${VH})`, background: COLORS.BG, userSelect: 'none' }}>
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="b2" />
          <feMerge><feMergeNode in="b2" /><feMergeNode in="b1" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="shadow">
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.5" />
        </filter>
      </defs>

      <rect x={0} y={0} width={VW} height={VH} fill={COLORS.BG} />
      <g opacity={0.05}>
        {Array.from({ length: 21 }).map((_, i) => <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={VH} stroke={COLORS.SYMLINK} strokeWidth={1} />)}
        {Array.from({ length: 34 }).map((_, i) => <line key={`h${i}`} x1={0} y1={i * 40} x2={VW} y2={i * 40} stroke={COLORS.SYMLINK} strokeWidth={1} />)}
      </g>

      {headerOpacity > 0 && (
        <g opacity={headerOpacity}>
          <IntroHeaderMorphV1
            progress={morphP}
            category={INTRO_CATEGORY_LABEL}
            titleSegments={[
              { label: INTRO_TITLE_A, color: COLORS.SYMLINK },
              { label: INTRO_TITLE_B, color: COLORS.HARDLINK },
            ]}
            subtitle={INTRO_SUBTITLE}
            titleFilter="url(#glow)"
            bg={2}
            bgScenes={ACT_SCENES}
            testId="symlink-vs-hardlink-intro-header"
          />
        </g>
      )}

      {contentStarted && (
        <>
          <ActBadgeNavigatorV1 phases={PHASES} activeIndex={phaseIdx} testId="symlink-vs-hardlink-act-nav" />
          <ContentBodyV1 debugName="symlink-vs-hardlink-body">
            <text x={366} y={30} textAnchor="middle" fontSize={20} fontWeight={700}
              fontFamily="sans-serif" fill={COLORS.TEXT}>
              {caption}
            </text>

            {(() => {
              const Act = ACT_SCENES[phaseIdx]
              return <Act state={{
                pop, cmdText, linkCount, originalDeleted, symlinkBroken, deployTarget, closingOpacity,
              }} />
            })()}
          </ContentBodyV1>
        </>
      )}
    </svg>
  )
}
