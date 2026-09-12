// src/content/21-forgot-password/Animation.jsx
// ═══════════════════════════════════════════════════════════════════════════
// Eksekusi sesuai src/content/21-forgot-password/_docs/
// FORGOT_PASSWORD_PLAN.md (2026-09-12). Empat Act, scene-ui V1 penuh,
// koordinat LOCAL, sumbu vertikal AXIS_X. Cerita: Raka lupa password —
// sistem TIDAK memberitahu password lama — form email dengan respons
// generik sama (anti-enumeration) — tautan reset pendek umur + sekali
// pakai — password baru di-hash + salt — hash lama diganti — session
// lama ditutup → pintu login menyala (handoff 18-auth login only).
// Protagonis Raka (kontrak seri, brand ADIB-DEV.COM).
//
// STATUS: first pass (tunggu preview manual & export MP4 sebelum `ready`,
// lihat plan §4 Checklist).
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, SFX_MAP,
  INTRO_CATEGORY_LABEL, INTRO_DOMAIN, INTRO_TITLE_A, INTRO_TITLE_B, INTRO_SUBTITLE,
  AXIS_X, RECORD_Y, INBOX_Y, TOKEN_Y, GATE_Y, DOOR_Y, CLOSING_Y, CAPTION_Y,
  RECORD_LABEL, INBOX_LABEL, TOKEN_LABEL, GATE_LABEL, DOOR_LABEL,
  RECORD_EMAIL, TOKEN_CODE, CAPTIONS,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'
import { IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1 } from '../../shared/scene-ui/v1'

export default function ForgotPasswordAnimation({
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

  // ── Act 1 — pintu login terkunci ──
  const [doorBlocked, setDoorBlocked] = useState(false)
  const [recordExists, setRecordExists] = useState(false)
  // ── Act 2 — form recovery anti-enumeration ──
  const [formOpened, setFormOpened] = useState(false)
  const [genericSeen, setGenericSeen] = useState(false)
  const [hashCardSeen, setHashCardSeen] = useState(false)
  // ── Act 3 — token reset sekali pakai + expiry ──
  const [tokenSeen, setTokenSeen] = useState(false)
  const [expiredDemo, setExpiredDemo] = useState(false)
  const [tokenMatch, setTokenMatch] = useState(false)
  const [tokenConsumed, setTokenConsumed] = useState(false)
  // ── Act 4 — hash baru + session lama tutup ──
  const [hashNew, setHashNew] = useState(false)
  const [sessionClosed, setSessionClosed] = useState(false)
  const [doorLit, setDoorLit] = useState(false)

  // carrier — token dari inbox ke gerbang
  const [tokenY, setTokenY] = useState(INBOX_Y)

  const P = (id) => pop[id] || { scale: 0, opacity: 0, x: 0, y: 0 }

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
    const o = { v: 0 }
    tl.add(() => setPop(prev => ({ ...prev, [id]: { scale: 0, opacity: 0, x: fromX, y: fromY } })), time)
    tl.to(o, {
      v: 1, duration, ease,
      onStart: () => { if (sfx) sfxLoader.play(sfxCategory, sfxName, { volume: volumeRef.current * volumeMult, speed: speedRef.current }) },
      onUpdate: () => setPop(prev => ({ ...prev, [id]: { scale: o.v, opacity: Math.min(1, o.v * 1.4), x: fromX * (1 - o.v), y: fromY * (1 - o.v) } })),
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

  const travel = (tl, time, setter, from, to, duration, ease) => {
    const o = { y: from }
    tl.to(o, { y: to, duration, ease, onUpdate: () => setter(o.y) }, time)
    return time + duration
  }

  // ═══════════════════════════════════════════════════════════════════════
  // MASTER TIMELINE — intro 1.2s + 8 + 9 + 11 + 8 s ≈ 37.2s
  // ═══════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 })
    tlRef.current = tl
    window.__animationTimeline = tl
    window.__flushSync = flushSync

    let t = 0

    tl.add(() => {
      setMorphP(0); setHeaderOpacity(0); setContentStarted(false)
      setPhaseIdx(0)
      setDoorBlocked(false); setRecordExists(false)
      setFormOpened(false); setGenericSeen(false); setHashCardSeen(false)
      setTokenSeen(false); setExpiredDemo(false); setTokenMatch(false); setTokenConsumed(false)
      setHashNew(false); setSessionClosed(false); setDoorLit(false)
      setTokenY(INBOX_Y)
      setPop({}); setCaption('')
    }, t)

    // ═══════════════ INTRO ═══════════════════════════════════════
    t += 0.2
    const mo = { p: 0 }
    tl.to(mo, { p: 1, duration: 0.8, ease: 'power3.inOut', onUpdate: () => setMorphP(mo.p) }, t)
    sfxOn(tl, t, () => sfxLoader.transition(SFX_MAP.WHOOSH.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 0.8
    tl.add(() => setContentStarted(true), t)

    // ═══════════════ ACT 1 — Password Tidak Disimpan (±8s) ═══════
    tl.add(() => setPhaseIdx(0), t)
    tl.add(() => setDoorBlocked(true), t + 0.05)
    sfxOn(tl, t + 0.05, () => sfxLoader.play('impacts', SFX_MAP.LOCK.name, { volume: volumeRef.current, speed: speedRef.current }))
    popIn(tl, t + 0.1, 'recordCard', {})
    say(tl, t + 0.15, CAPTIONS.LOGIN_BLOCKED)
    t += 1.8
    tl.add(() => setRecordExists(true), t)
    sfxOn(tl, t, () => sfxLoader.play('ui', SFX_MAP.NUMBER_TALLY.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t + 0.1, CAPTIONS.HASH_ONLY)
    t += 1.7
    say(tl, t, CAPTIONS.NO_PLAINTEXT)
    t += 1.7
    say(tl, t, CAPTIONS.RECOVERY_PATH)
    let act1End = t + 1.4

    // ═══════════════ ACT 2 — Respons Tidak Membocorkan (±9s) ══════
    tl.add(() => setPhaseIdx(1), act1End)
    popIn(tl, act1End + 0.1, 'formCard', { sfxName: SFX_MAP.POP2.name })
    say(tl, act1End + 0.15, CAPTIONS.ENTER_EMAIL)
    let t2 = act1End + 1.7
    tl.add(() => setGenericSeen(true), t2)
    sfxOn(tl, t2, () => sfxLoader.play('ui', SFX_MAP.PLINK.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t2 + 0.1, CAPTIONS.GENERIC_REPLY)
    t2 += 1.8
    tl.add(() => setHashCardSeen(true), t2)
    say(tl, t2 + 0.1, CAPTIONS.TOKEN_SILENT)
    t2 += 1.8
    sfxOn(tl, t2, () => sfxLoader.play('ui', SFX_MAP.TICK.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t2, CAPTIONS.INBOX_CHECK)
    let act2End = t2 + 1.7

    // ═══════════════ ACT 3 — Tautan Reset Sekali Pakai (±11s) ════
    tl.add(() => setPhaseIdx(2), act2End)
    popIn(tl, act2End + 0.1, 'tokenCard', { sfxName: SFX_MAP.LIGHT_SWOOSH.name, sfxCategory: 'transitions' })
    say(tl, act2End + 0.15, CAPTIONS.LINK_SENT)
    let t3 = act2End + 1.6
    tl.add(() => setExpiredDemo(true), t3)
    sfxOn(tl, t3, () => sfxLoader.play('warnings', SFX_MAP.ALERT_PULSE.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t3 + 0.1, CAPTIONS.LINK_EXPIRY)
    t3 += 1.8
    tl.add(() => setExpiredDemo(false), t3)
    tl.add(() => setTokenMatch(true), t3 + 0.25)
    sfxOn(tl, t3 + 0.25, () => sfxLoader.play('ui', SFX_MAP.CHIME.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t3 + 0.35, CAPTIONS.TOKEN_DEPARTS)
    t3 += 2.2
    tl.add(() => setTokenConsumed(true), t3)
    sfxOn(tl, t3, () => sfxLoader.play('impacts', SFX_MAP.SNAP.name, { volume: volumeRef.current * 0.7, speed: speedRef.current }))
    say(tl, t3 + 0.1, CAPTIONS.TOKEN_ONCE)
    t3 += 1.4
    say(tl, t3, CAPTIONS.TOKEN_DENIED)
    let act3End = t3 + 1.3

    // ═══════════════ ACT 4 — Hash Baru Menggantikan (±8s) ════════
    tl.add(() => setPhaseIdx(3), act3End)
    tl.add(() => setHashNew(true), act3End + 0.1)
    sfxOn(tl, act3End + 0.1, () => sfxLoader.play('success', SFX_MAP.SHIMMER.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, act3End + 0.15, CAPTIONS.NEW_PASSWORD)
    let t4 = act3End + 1.7
    tl.add(() => setSessionClosed(true), t4)
    sfxOn(tl, t4, () => sfxLoader.play('impacts', SFX_MAP.LOCK.name, { volume: volumeRef.current * 0.85, speed: speedRef.current }))
    say(tl, t4 + 0.1, CAPTIONS.HASH_NEW)
    t4 += 1.7
    tl.add(() => setDoorLit(true), t4)
    sfxOn(tl, t4, () => sfxLoader.play('success', SFX_MAP.RELIEF.name, { volume: volumeRef.current, speed: speedRef.current }))
    popIn(tl, t4 + 0.05, 'closingStamps', {})
    say(tl, t4 + 0.1, CAPTIONS.READY_LOGIN)
    let act4End = t4 + 1.6

    tl.to({}, { duration: 0.9 }, act4End)

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

  // ── render helpers ──
  const T = (id, cx, cy) => {
    const p = P(id)
    return `translate(${cx + p.x}, ${cy + p.y}) scale(${p.scale})`
  }
  const O = (id) => P(id).opacity

  const Door = ({ x, y, lit }) => (
    <g transform={`translate(${x}, ${y})`}>
      <rect x={-42} y={-40} width={84} height={80} rx={10} fill={COLORS.PANEL} stroke={lit ? COLORS.SUCCESS : COLORS.BORDER} strokeWidth={2} />
      <circle cx={0} cy={-16} r={9} fill={COLORS.BG} stroke={lit ? COLORS.SUCCESS : COLORS.MUTED} strokeWidth={1.5} />
      <rect x={-22} y={-4} width={44} height={30} rx={5} fill={COLORS.BG} stroke={lit ? COLORS.SUCCESS : COLORS.MUTED} strokeWidth={1.5} />
      <text x={0} y={48} textAnchor="middle" fontSize={9} fontWeight={700} fontFamily="monospace" fill={COLORS.MUTED}>{DOOR_LABEL}</text>
      {lit && (
        <g filter="url(#glow)">
          <rect x={-28} y={-26} width={56} height={24} rx={6} fill={COLORS.SUCCESS} opacity={0.18} />
          <text x={0} y={-11} textAnchor="middle" fontSize={7} fontWeight={700} fontFamily="monospace" fill={COLORS.SUCCESS}>SIAP</text>
        </g>
      )}
    </g>
  )

  const Clock = ({ x, y, danger }) => (
    <g transform={`translate(${x}, ${y})`}>
      <circle r={14} fill={COLORS.BG} stroke={danger ? COLORS.DENY : COLORS.TOKEN} strokeWidth={2} />
      <path d="M 0 0 L 0 -7 M 0 0 L 5 3" fill="none" stroke={danger ? COLORS.DENY : COLORS.TOKEN} strokeWidth={2} strokeLinecap="round" />
    </g>
  )

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
      <g opacity={0.04}>
        {Array.from({ length: 21 }).map((_, i) => <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={VH} stroke={COLORS.TOKEN} strokeWidth={1} />)}
        {Array.from({ length: 34 }).map((_, i) => <line key={`h${i}`} x1={0} y1={i * 40} x2={VW} y2={i * 40} stroke={COLORS.TOKEN} strokeWidth={1} />)}
      </g>

      {/* ── HEADER — FORGOT (amber) + PASSWORD (ungu token) ── */}
      {contentStarted && headerOpacity > 0 ? (
        <g opacity={headerOpacity}>
          <IntroHeaderMorphV1
            progress={morphP}
            categorySegments={[
              { label: INTRO_CATEGORY_LABEL + ' · ', color: COLORS.MUTED },
              { label: INTRO_DOMAIN, color: COLORS.SYSTEM },
            ]}
            titleSegments={[
              { label: INTRO_TITLE_A, color: COLORS.RESET },
              { label: INTRO_TITLE_B, color: COLORS.TOKEN },
            ]}
            subtitle={INTRO_SUBTITLE}
            testId="forgot-intro-header"
          />
        </g>
      ) : (
        <g opacity={headerOpacity}>
          <g transform="translate(410, 92)">
            <text x={0} y={0} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="monospace" letterSpacing={2} fill={COLORS.MUTED}>{INTRO_CATEGORY_LABEL}</text>
            <text x={0} y={28} textAnchor="middle" fontSize={26} fontWeight={900} fontFamily="monospace" fill={COLORS.TEXT}>{INTRO_TITLE_A}{INTRO_TITLE_B}</text>
            <text x={0} y={56} textAnchor="middle" fontSize={9} fontWeight={600} fontFamily="sans-serif" fill={COLORS.MUTED}>{INTRO_SUBTITLE}</text>
          </g>
        </g>
      )}

      {contentStarted && (
        <g>
          <ActBadgeNavigatorV1
            phases={PHASES}
            activeIndex={phaseIdx}
            testId="forgot-act-navigator"
          />

          <ContentBodyV1 debugName="forgot-password-body">

            {/* jalur token: inbox → gerbang */}
            <path d={`M ${AXIS_X} ${INBOX_Y + 40} L ${AXIS_X} ${GATE_Y - 56}`} stroke={COLORS.BORDER} strokeWidth={1.5} strokeDasharray="4 6" opacity={0.4} />

            {/* ── record akun Raka — hash + salt ── */}
            <g transform={T('recordCard', AXIS_X, RECORD_Y)} opacity={O('recordCard')} filter="url(#shadow)">
              <rect x={-130} y={-46} width={260} height={92} rx={12} fill={COLORS.PANEL} stroke={COLORS.BORDER} strokeWidth={2} />
              <text x={0} y={-24} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="monospace" letterSpacing={1.5} fill={COLORS.MUTED}>{RECORD_LABEL}</text>
              <text x={0} y={0} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={COLORS.TEXT}>{RECORD_EMAIL}</text>
              <g className="pulse-pill">
                <rect x={-52} y={14} width={104} height={26} rx={8} fill={COLORS.BG} stroke={hashNew ? COLORS.SUCCESS : COLORS.MUTED} strokeWidth={2} />
                <text x={0} y={32} textAnchor="middle" fontSize={9} fontWeight={700} fontFamily="monospace" fill={hashNew ? COLORS.SUCCESS : COLORS.MUTED}>{hashNew ? 'HASH BARU' : 'HASH LAMA'}</text>
              </g>
            </g>

            {/* ── form recovery — input email ── */}
            <g transform={T('formCard', AXIS_X, INBOX_Y)} opacity={O('formCard')} filter="url(#shadow)">
              <rect x={-110} y={-40} width={220} height={80} rx={12} fill={COLORS.PANEL} stroke={COLORS.BORDER} strokeWidth={2} />
              <text x={0} y={-24} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="monospace" letterSpacing={1.5} fill={COLORS.TOKEN}>{FORM_LABEL}</text>
              <rect x={-84} y={-2} width={168} height={32} rx={8} fill={COLORS.BG} stroke={COLORS.BORDER} strokeWidth={1.5} />
              <text x={0} y={15} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={genericSeen ? COLORS.MUTED : COLORS.TEXT}>email pemulihan</text>
              {genericSeen && (
                <g transform="translate(96, 14)">
                  <rect x={-46} y={-14} width={92} height={34} rx={8} fill={COLORS.BG} stroke={COLORS.TOKEN} strokeWidth={1.5} opacity={0.9} />
                  <text x={0} y={6} textAnchor="middle" fontSize={8} fontWeight={700} fontFamily="monospace" fill={COLORS.MUTED}>RESPONS SAMA</text>
                </g>
              )}
            </g>

            {/* ── kartu hash — bukti tidak boleh bocor ── */}
            <g transform={T('hashCard', AXIS_X, TOKEN_Y)} opacity={O('tokenCard')} filter="url(#shadow)">
              <rect x={-130} y={-46} width={260} height={92} rx={12} fill={COLORS.PANEL} stroke={tokenConsumed ? COLORS.DENY : COLORS.TOKEN} strokeWidth={2} />
              <text x={0} y={-24} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="monospace" letterSpacing={1.5} fill={COLORS.TOKEN}>{TOKEN_LABEL}</text>
              <text x={0} y={2} textAnchor="middle" fontSize={10} fontWeight={900} fontFamily="monospace" fill={COLORS.TEXT}>{TOKEN_CODE}</text>
              {expiredDemo && <Clock x={56} y={0} danger />}
              {tokenConsumed && (
                <g transform="translate(60, 8)" opacity={0.85}>
                  <line x1={-8} y1={-8} x2={8} y2={8} stroke={COLORS.DENY} strokeWidth={2} />
                  <line x1={8} y1={-8} x2={-8} y2={8} stroke={COLORS.DENY} strokeWidth={2} />
                </g>
              )}
            </g>

            {/* ── gerbang verifikasi ── */}
            <g transform={T('gateCard', AXIS_X, GATE_Y)} opacity={O('gateCard')} filter="url(#shadow)">
              <rect x={-130} y={-36} width={260} height={72} rx={12} fill={COLORS.PANEL} stroke={tokenMatch ? COLORS.SUCCESS : COLORS.BORDER} strokeWidth={2} />
              <text x={0} y={-20} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="monospace" letterSpacing={1.5} fill={COLORS.MUTED}>{GATE_LABEL}</text>
              <rect x={-96} y={-2} width={192} height={30} rx={8} fill={COLORS.BG} stroke={tokenMatch ? COLORS.SUCCESS : COLORS.BORDER} strokeWidth={1.5} />
              <text x={0} y={20} textAnchor="middle" fontSize={9} fontWeight={700} fontFamily="monospace" fill={tokenMatch ? COLORS.SUCCESS : COLORS.MUTED}>{tokenMatch ? 'VALID — SEKALI PAKAI' : 'CEK COCOK + BELUM BEKAS'}</text>
            </g>

            {/* ── pintu login — redup → menyala ── */}
            <Door x={AXIS_X} y={DOOR_Y} lit={doorLit} />

            {/* ── closing stamp payoffs ── */}
            <g transform={T('closingStamps', AXIS_X, CLOSING_Y)} opacity={O('closingStamps')} filter="url(#glow)">
              <rect x={-70} y={-34} width={140} height={68} rx={14} fill={COLORS.PANEL} stroke={COLORS.SUCCESS} strokeWidth={3} transform="rotate(-7)" />
              <text x={0} y={-4} textAnchor="middle" fontSize={12} fontWeight={900} fontFamily="monospace" fill={COLORS.SUCCESS}>PULIHKAN</text>
              <text x={0} y={16} textAnchor="middle" fontSize={8} fontWeight={700} fontFamily="sans-serif" fill={COLORS.MUTED}>hash baru tersimpan</text>
              <g transform="translate(90, -10)">
                <rect x={-60} y={-28} width={120} height={56} rx={12} fill={COLORS.PANEL} stroke={COLORS.TOKEN} strokeWidth={3} transform="rotate(6)" />
                <text x={0} y={1} textAnchor="middle" fontSize={11} fontWeight={900} fontFamily="monospace" fill={COLORS.TOKEN}>TANPA LAMA</text>
                <text x={0} y={18} textAnchor="middle" fontSize={8} fontWeight={700} fontFamily="sans-serif" fill={COLORS.MUTED}>lama tidak bocor</text>
              </g>
            </g>

            {/* ── CAPTION ── */}
            {caption && (
              <g transform={`translate(${AXIS_X}, ${CAPTION_Y[phaseIdx]})`}>
                <rect x={-170} y={-18} width={340} height={34} rx={10} fill={COLORS.BG} opacity={0.88} stroke={COLORS.BORDER} strokeWidth={1.5} />
                <text x={0} y={3} textAnchor="middle" fontSize={13} fontWeight={600} fontFamily="sans-serif" fill={COLORS.TEXT}>{caption}</text>
              </g>
            )}
          </ContentBodyV1>
        </g>
      )}
    </svg>
  )
}
