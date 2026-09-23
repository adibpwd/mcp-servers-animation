// src/content/36-ssh-key/Animation.jsx
// ═══════════════════════════════════════════════════════════════════════════
// EKSEKUSI-01: eksekusi pertama topic ini (lihat data.js EKSEKUSI-01).
// 4 Act mengikuti _docs/SSH_KEY_PLAN.md apa adanya: Brute-Force → Keygen →
// Authorized Keys → Challenge-Response. Anchor client/server persisten
// lintas Act (continuity) — anchor 'client' bermain sebagai actor generik:
// PENYERANG di Act 1 (actorKind='attacker'), lalu kembali jadi laptop user
// sah di Act 2-4 (actorKind='user'). Channel line memvisualkan tingkat
// keamanan: 'insecure' (Act 1, brute-force merah) → 'idle' (Act 2-3, belum
// ada sesi) → 'secure' (Act 4, access granted emerald).
// Icon inline SVG, tidak ada folder icons/ untuk topic ini.
// CATATAN EKSEKUSI: kode + data ditulis sekali jalan, BELUM preview manual
// di browser maupun export MP4 pada saat commit ini.
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, SFX_MAP,
  INTRO_CATEGORY_LABEL, INTRO_TITLE_A, INTRO_TITLE_B, INTRO_SUBTITLE,
  ACT1_BEATS, ACT2_BEATS, ACT3_BEATS, ACT4_BEATS, CLOSING_CAPTION,
  NEAR_CLIENT, NEAR_SERVER, DRAWER_PT, GRANTED_PT,
} from './data'
import { ACT_SCENES } from './acts'
import sfxLoader from '../../shared/audio/sfxLoader'
import { IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1 } from '../../shared/scene-ui/v1'

export default function SshKeyAnimation({
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

  const [stage, setStage] = useState('idle')

  const [actorKind, setActorKind] = useState('user')
  const [channelMode, setChannelMode] = useState('idle')
  const [serverBadge, setServerBadge] = useState(undefined)
  const [attemptCount, setAttemptCount] = useState(0)
  const [attemptLabel, setAttemptLabel] = useState('')

  useEffect(() => {
    const shouldEnable = previewSfx && audioUnlocked
    sfxLoader.setEnabled(shouldEnable)
    audioUnlockedRef.current = audioUnlocked
    volumeRef.current = volume
    speedRef.current = speed
  }, [previewSfx, audioUnlocked, volume, speed])

  const popIn = (tl, time, id, opts = {}) => {
    const { duration = 0.45, ease = 'back.out(1.6)', sfx = true, fromX = 0, fromY = 0,
      sfxName = SFX_MAP.POP.name, sfxCategory = 'ui', volumeMult = 1 } = opts
    tl.add(() => setPop(prev => ({ ...prev, [id]: { scale: 0, opacity: 0, x: fromX, y: fromY } })), time)
    const o = { v: 0 }
    tl.to(o, {
      v: 1, duration, ease,
      onStart: () => { if (sfx) sfxLoader.play(sfxCategory, sfxName, { volume: volume * volumeMult, speed }) },
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

  const appear = (tl, time, id, at, opts = {}) => {
    const { duration = 0.4, ease = 'back.out(1.6)', sfx = true,
      sfxName = SFX_MAP.POP.name, sfxCategory = 'ui' } = opts
    tl.add(() => setPop(prev => ({ ...prev, [id]: { scale: 0, opacity: 0, x: at.x, y: at.y } })), time)
    const o = { v: 0 }
    tl.to(o, {
      v: 1, duration, ease,
      onStart: () => { if (sfx) sfxLoader.play(sfxCategory, sfxName, { volume: volumeRef.current, speed: speedRef.current }) },
      onUpdate: () => setPop(prev => ({ ...prev, [id]: { scale: o.v, opacity: Math.min(1, o.v * 1.4), x: at.x, y: at.y } })),
    }, time)
  }

  const travel = (tl, time, id, opts = {}) => {
    const { from, to, duration = 0.9, ease = 'power2.inOut', hold = true, readHold = 1.5,
      sfx = true, sfxName = SFX_MAP.WHOOSH.name, sfxCategory = 'transitions' } = opts
    tl.add(() => setPop(prev => ({ ...prev, [id]: { scale: 0.85, opacity: 0, x: from.x, y: from.y } })), time)
    const o = { t: 0 }
    tl.to(o, {
      t: 1, duration, ease,
      onStart: () => { if (sfx) sfxLoader.play(sfxCategory, sfxName, { volume: volumeRef.current, speed: speedRef.current }) },
      onUpdate: () => {
        const x = from.x + (to.x - from.x) * o.t
        const y = from.y + (to.y - from.y) * o.t
        const fadeIn = Math.min(1, o.t / 0.18)
        setPop(prev => ({ ...prev, [id]: { scale: 0.85 + 0.15 * fadeIn, opacity: fadeIn, x, y } }))
      },
    }, time)
    if (!hold) {
      const fo = { v: 1 }
      tl.to(fo, {
        v: 0, duration: 0.35, ease: 'power1.in',
        onUpdate: () => setPop(prev => ({ ...prev, [id]: { ...(prev[id] || {}), scale: fo.v, opacity: fo.v } })),
      }, time + duration + readHold)
    }
  }

  const say = (tl, time, text) => tl.add(() => setCaption(text), time)
  const sfxOn = (tl, time, fn) => tl.add(() => audioUnlockedRef.current && fn(), time)
  const goStage = (tl, time, id) => tl.add(() => setStage(id), time)

  // ═══════════════════════════════════════════════════════════════════════
  // MASTER TIMELINE — 4 Act tanpa jeda kosong.
  // ═══════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 })
    tlRef.current = tl
    window.__animationTimeline = tl
    window.__flushSync = flushSync

    let t = 0

    tl.add(() => {
      setMorphP(0); setHeaderOpacity(1); setContentStarted(false)
      setStage('idle')
      setActorKind('user'); setChannelMode('idle'); setServerBadge(undefined)
      setAttemptCount(0); setAttemptLabel('')
      setPop({}); setCaption(''); setPhaseIdx(0)
    }, t)

    t += 0.2
    const mo = { p: 0 }
    tl.to(mo, { p: 1, duration: 0.8, ease: 'power3.inOut', onUpdate: () => setMorphP(mo.p) }, t)
    sfxOn(tl, t, () => sfxLoader.transition(SFX_MAP.TELEPORT.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 0.8
    tl.add(() => setContentStarted(true), t)

    // ═══════════════ ACT 1 — Kelemahan Password & Bahaya Brute-Force ═══
    tl.add(() => setPhaseIdx(0), t)
    tl.add(() => { setActorKind('attacker'); setChannelMode('insecure') }, t)
    popIn(tl, t + 0.05, 'client', { fromY: -20 })
    popIn(tl, t + 0.25, 'server', { fromY: 20, sfx: false })
    popIn(tl, t + 0.45, 'portLabel', { sfx: false })
    goStage(tl, t + 0.5, 'attack')
    say(tl, t + 0.55, ACT1_BEATS.copy.start)
    t += 0.9

    ACT1_BEATS.attempts.slice(0, 3).forEach((label, i) => {
      const at = t + i * 0.5
      tl.add(() => setAttemptLabel(label), at)
      popIn(tl, at, 'attemptCapsule', { duration: 0.22, ease: 'power1.out', sfx: true, sfxName: SFX_MAP.TICK.name, sfxCategory: 'ui' })
      popOut(tl, at + 0.32, 'attemptCapsule', { duration: 0.14 })
    })
    t += 3 * 0.5 + 0.3

    goStage(tl, t, 'rate')
    say(tl, t + 0.05, ACT1_BEATS.copy.rate)
    tl.add(() => setAttemptLabel(ACT1_BEATS.attempts[3]), t + 0.1)
    popIn(tl, t + 0.1, 'attemptCapsule', { duration: 0.25, sfx: false })
    ;[340, 1200, 2483].forEach((n, i) => {
      const at = t + 0.4 + i * 0.5
      tl.add(() => setAttemptCount(n), at)
      sfxOn(tl, at, () => sfxLoader.ui(SFX_MAP.TALLY.name, { volume: volumeRef.current, speed: speedRef.current }))
    })
    t += 0.4 + 3 * 0.5 + 1.2
    popOut(tl, t, 'attemptCapsule', {})

    goStage(tl, t, 'overload')
    tl.add(() => setServerBadge('overload'), t)
    say(tl, t + 0.05, ACT1_BEATS.copy.overload)
    sfxOn(tl, t + 0.1, () => sfxLoader.play('warnings', SFX_MAP.ALERT_PULSE.name, { volume: volumeRef.current, speed: speedRef.current }))
    ;['denyMark1', 'denyMark2', 'denyMark3'].forEach((id, i) => {
      const at = t + 0.4 + i * 0.25
      popIn(tl, at, id, { duration: 0.3, sfx: true, sfxName: SFX_MAP.SOFT_DENY.name, sfxCategory: 'warnings' })
    })
    t += 0.4 + 3 * 0.25 + 1.8
    popOut(tl, t, 'denyMark1', {}); popOut(tl, t, 'denyMark2', {}); popOut(tl, t, 'denyMark3', {})
    t += 0.3

    // ═══════════════ ACT 2 — Pasangan Kunci Publik & Privat ═══
    tl.add(() => setPhaseIdx(1), t)
    tl.add(() => { setActorKind('user'); setServerBadge(undefined); setChannelMode('idle'); setAttemptCount(0) }, t)
    sfxOn(tl, t, () => sfxLoader.ui(SFX_MAP.CHIME.name, { volume: volumeRef.current, speed: speedRef.current }))
    goStage(tl, t + 0.1, 'run')
    say(tl, t + 0.15, ACT2_BEATS.copy.run)
    popIn(tl, t + 0.25, 'keygenCmd', { fromY: -10 })
    t += 1.6

    goStage(tl, t, 'twin')
    say(tl, t + 0.05, ACT2_BEATS.copy.twin)
    popIn(tl, t + 0.15, 'publicKeyCard', { fromX: 40, fromY: -10 })
    popIn(tl, t + 0.35, 'privateKeyCard', { fromX: -40, fromY: -10, sfxName: SFX_MAP.POP2.name })
    t += 2.6

    goStage(tl, t, 'after')
    say(tl, t + 0.05, ACT2_BEATS.copy.after)
    sfxOn(tl, t + 0.1, () => sfxLoader.success(SFX_MAP.CONFIRM.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 2.0
    popOut(tl, t, 'keygenCmd', {})
    t += 0.3

    // ═══════════════ ACT 3 — Memasang Gembok di Server ═══
    tl.add(() => setPhaseIdx(2), t)
    goStage(tl, t, 'send')
    say(tl, t + 0.05, ACT3_BEATS.copy.send)
    popIn(tl, t + 0.15, 'copyCmd', { fromY: -10 })
    t += 1.0
    travel(tl, t, 'publicKeyTravel', { from: NEAR_CLIENT, to: DRAWER_PT, duration: 1.0, hold: true, sfxName: SFX_MAP.WHOOSH.name })
    t += 1.3

    goStage(tl, t, 'install')
    tl.add(() => setServerBadge('locked'), t)
    say(tl, t + 0.05, ACT3_BEATS.copy.install)
    popIn(tl, t + 0.15, 'drawer', { fromY: 16 })
    sfxOn(tl, t + 0.2, () => sfxLoader.impact(SFX_MAP.LOCK.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 1.9
    popOut(tl, t, 'publicKeyTravel', {})

    goStage(tl, t, 'after')
    say(tl, t + 0.05, ACT3_BEATS.copy.after)
    sfxOn(tl, t + 0.1, () => sfxLoader.success(SFX_MAP.STAMP.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 2.4
    popOut(tl, t, 'copyCmd', {})
    popOut(tl, t, 'drawer', {})
    t += 0.3

    // ═══════════════ ACT 4 — Challenge-Response ═══
    tl.add(() => setPhaseIdx(3), t)
    tl.add(() => setServerBadge(undefined), t)
    goStage(tl, t, 'send')
    say(tl, t + 0.05, ACT4_BEATS.copy.send)
    popIn(tl, t + 0.1, 'passwordCrossed', { fromX: -20 })
    travel(tl, t + 0.2, 'challengeCapsule', { from: NEAR_SERVER, to: NEAR_CLIENT, duration: 0.9, hold: true, sfxName: SFX_MAP.WHOOSH.name })
    t += 2.3

    goStage(tl, t, 'unlock')
    say(tl, t + 0.05, ACT4_BEATS.copy.unlock)
    popIn(tl, t + 0.15, 'privateKeyUnlock', { duration: 0.4 })
    sfxOn(tl, t + 0.2, () => sfxLoader.impact(SFX_MAP.KEY_TURN.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 1.6
    popOut(tl, t, 'challengeCapsule', {})

    goStage(tl, t, 'verify')
    say(tl, t + 0.05, ACT4_BEATS.copy.verify)
    travel(tl, t + 0.15, 'responseCapsule', { from: NEAR_CLIENT, to: NEAR_SERVER, duration: 0.9, hold: false, readHold: 1.0, sfxName: SFX_MAP.SWOOSH.name })
    t += 2.3
    tl.add(() => setServerBadge('granted'), t)
    tl.add(() => setChannelMode('secure'), t)
    appear(tl, t, 'grantedBadge', GRANTED_PT, { sfxName: SFX_MAP.DING.name, sfxCategory: 'success' })
    sfxOn(tl, t, () => sfxLoader.success(SFX_MAP.DING.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 1.8

    goStage(tl, t, 'after')
    say(tl, t, CLOSING_CAPTION)
    t += 2.2
    popOut(tl, t, 'privateKeyUnlock', {})
    popOut(tl, t, 'passwordCrossed', {})
    t += 0.3

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
        {Array.from({ length: 21 }).map((_, i) => <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={VH} stroke={COLORS.PUBLIC} strokeWidth={1} />)}
        {Array.from({ length: 34 }).map((_, i) => <line key={`h${i}`} x1={0} y1={i * 40} x2={VW} y2={i * 40} stroke={COLORS.PUBLIC} strokeWidth={1} />)}
      </g>

      {headerOpacity > 0 && (
        <g opacity={headerOpacity}>
          <IntroHeaderMorphV1
            progress={morphP}
            category={INTRO_CATEGORY_LABEL}
            titleSegments={[
              { label: INTRO_TITLE_A, color: COLORS.PUBLIC },
              { label: INTRO_TITLE_B, color: COLORS.PRIVATE },
            ]}
            subtitle={INTRO_SUBTITLE}
            titleFilter="url(#glow)"
            bg={4}
            bgScenes={ACT_SCENES}
            testId="ssh-key-intro-header"
          />
        </g>
      )}

      {contentStarted && (
        <>
          <ActBadgeNavigatorV1 phases={PHASES} activeIndex={phaseIdx} testId="ssh-key-act-nav" />
          <ContentBodyV1 debugName="ssh-key-body">
            <text x={366} y={30} textAnchor="middle" fontSize={20} fontWeight={700}
              fontFamily="sans-serif" fill={COLORS.TEXT}>
              {caption}
            </text>

            {(() => {
              const Act = ACT_SCENES[phaseIdx]
              return <Act state={{ pop, stage, actorKind, channelMode, serverBadge, attemptCount, attemptLabel }} />
            })()}
          </ContentBodyV1>
        </>
      )}
    </svg>
  )
}
