// src/content/22-oauth2-delegated-login/Animation.jsx
// ═══════════════════════════════════════════════════════════════════════════
// Eksekusi sesuai src/content/22-oauth2-delegated-login/_docs/
// OAUTH2_DELEGATED_LOGIN_PLAN.md (2026-09-12). Empat Act, scene-ui V1 penuh
// (IntroHeaderMorphV1 + ActBadgeNavigatorV1 + ContentBodyV1), semua child
// body pakai koordinat lokal (origin body DEFAULT_LAYOUT_V1.body).
// Cerita: Adib memakai Aplikasi Catatan yang butuh profil dasar dari
// Identitas Kampus. Password TIDAK PERNAH diberikan ke aplikasi — Adib
// login langsung di Kampus, menyetujui scope profile.read, lalu aplikasi
// menerima authorization code (sementara) yang ditukar dengan PKCE
// verifier menjadi access token bergaris scope. Satu objek "carrier"
// (tiket redirect → code → token) berpindah lewat overlap warna/label,
// TIDAK unmount/mount ulang (continuity contract §1.O,
// docs/standardizations/09-standar-pembuatan-konten.md).
//
// STATUS: first pass (data.js + manifest.js + timeline + render JSX).
// Menunggu preview manual & export MP4. Registry tetap TIDAK diaktifkan
// sampai preview/export lolos (lihat plan §7 Checklist Eksekusi).
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, SFX_MAP,
  INTRO_CATEGORY_LABEL, INTRO_DOMAIN, INTRO_TITLE_A, INTRO_TITLE_B, INTRO_SUBTITLE,
  AXIS_X, APP_Y, REDIRECT_Y, PROVIDER_Y, CONSENT_Y, PKCE_Y,
  TOKEN_Y, RESOURCE_Y, LOCKED_SCOPE_Y, CLOSING_Y,
  CAPTION_Y, APP_LABEL, PROVIDER_LABEL,
  SCOPE_REQUEST, PKCE_PAIR, AUTH_CODE, ACCESS_TOKEN, LOCKED_SCOPES,
  CAPTIONS,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'
import { IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1 } from '../../shared/scene-ui/v1'

export default function OAuth2DelegatedLoginAnimation({
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

  // ── header — hero-to-header morph, pola sama 17-rest-api/18-auth ──
  const [morphP, setMorphP] = useState(0)
  const [headerOpacity, setHeaderOpacity] = useState(0)
  const [contentStarted, setContentStarted] = useState(false)

  // ── Act 1 — aplikasi tidak meminta password ──
  const [passwordRejected, setPasswordRejected] = useState(false)

  // ── Act 2 — login di provider + consent scope ──
  const [providerLoginDone, setProviderLoginDone] = useState(false)
  const [consentApproved, setConsentApproved] = useState(false)

  // ── Act 3 — code vs token (PKCE) ──
  const [pkceLockClosed, setPkceLockClosed] = useState(false)
  const [challengeMatched, setChallengeMatched] = useState(false)

  // ── Act 4 — scoped access ──
  const [scopeChecked, setScopeChecked] = useState(false)
  const [profileReturned, setProfileReturned] = useState(false)

  // ── carrier — SATU objek persist lintas Act: tiket redirect → code →
  // token (continuity §1.O, tidak boleh pop-out lalu muncul lagi) ──
  const [carrierY, setCarrierY] = useState(APP_Y)
  const [carrierStage, setCarrierStage] = useState('ticket') // ticket | code | token

  const P = (id) => pop[id] || { scale: 0, opacity: 0, x: 0, y: 0 }

  useEffect(() => {
    const shouldEnable = previewSfx && audioUnlocked
    sfxLoader.setEnabled(shouldEnable)
    audioUnlockedRef.current = audioUnlocked
    volumeRef.current = volume
    speedRef.current = speed
  }, [previewSfx, audioUnlocked, volume, speed])

  // ── helper pop-in/pop-out/morph — pola sama 17-rest-api/18-auth ──
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

  const say = (tl, time, text) => tl.add(() => setCaption(text), time)
  const sfxOn = (tl, time, fn) => tl.add(() => audioUnlockedRef.current && fn(), time)

  const travel = (tl, time, setter, from, to, duration, ease) => {
    const o = { y: from }
    tl.to(o, { y: to, duration, ease, onUpdate: () => setter(o.y) }, time)
    return time + duration
  }

  // ═══════════════════════════════════════════════════════════════════════
  // MASTER TIMELINE — empat Act, ±48s total (intro 1.2s + 10+12+14+12s)
  // ═══════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 })
    tlRef.current = tl
    window.__animationTimeline = tl
    window.__flushSync = flushSync

    let t = 0

    // ── reset state tiap awal loop ──
    tl.add(() => {
      setMorphP(0); setHeaderOpacity(1); setContentStarted(false)
      setPasswordRejected(false)
      setProviderLoginDone(false); setConsentApproved(false)
      setPkceLockClosed(false); setChallengeMatched(false)
      setScopeChecked(false); setProfileReturned(false)
      setCarrierY(APP_Y); setCarrierStage('ticket')
      setPop({}); setCaption('')
    }, t)

    // ═══════════════ INTRO — hero centered → header ════════════════
    t += 0.2
    const mo = { p: 0 }
    tl.to(mo, { p: 1, duration: 0.8, ease: 'power3.inOut', onUpdate: () => setMorphP(mo.p) }, t)
    sfxOn(tl, t, () => sfxLoader.transition(SFX_MAP.TELEPORT.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 0.8
    tl.add(() => setContentStarted(true), t)

    // ═══════════════ ACT 1 — Aplikasi Tidak Meminta Password (±10s) ════
    tl.add(() => setPhaseIdx(0), t)
    popIn(tl, t + 0.05, 'appCard', { fromY: -10 })
    say(tl, t + 0.1, CAPTIONS.APP_NEEDS_PROFILE)
    t += 1.6
    tl.add(() => setPasswordRejected(true), t)
    sfxOn(tl, t, () => sfxLoader.warning(SFX_MAP.ERROR_BEEP.name, { volume: volumeRef.current, speed: speedRef.current }))
    popIn(tl, t + 0.05, 'passwordBadge', { sfx: false })
    say(tl, t + 0.1, CAPTIONS.PASSWORD_REJECTED)
    t += 2.0
    popOut(tl, t, 'passwordBadge')
    sfxOn(tl, t, () => sfxLoader.impact(SFX_MAP.SNAP.name, { volume: volumeRef.current * 0.7, speed: speedRef.current }))
    popIn(tl, t + 0.1, 'providerGate', { fromY: 16, sfxName: SFX_MAP.POP2.name })
    const carrierAtRedirect = travel(tl, t + 0.15, setCarrierY, APP_Y, REDIRECT_Y, 0.6, 'power1.out')
    sfxOn(tl, t + 0.15, () => sfxLoader.transition(SFX_MAP.LIGHT_SWOOSH.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, carrierAtRedirect + 0.05, CAPTIONS.REDIRECT_TO_PROVIDER)
    const carrierAtProvider = travel(tl, carrierAtRedirect + 0.1, setCarrierY, REDIRECT_Y, PROVIDER_Y, 0.7, 'power1.inOut')
    let act1End = carrierAtProvider + 0.8
    say(tl, act1End - 0.3, CAPTIONS.PASSWORD_STAYS)

    // ═══════════════ ACT 2 — Adib Melihat Izin yang Diminta (±12s) ═════
    tl.add(() => setPhaseIdx(1), act1End)
    popIn(tl, act1End + 0.1, 'loginForm', {})
    say(tl, act1End + 0.15, CAPTIONS.LOGIN_AT_PROVIDER)
    let t2 = act1End + 1.8
    tl.add(() => setProviderLoginDone(true), t2)
    sfxOn(tl, t2, () => sfxLoader.play('ui', SFX_MAP.TICK.name, { volume: volumeRef.current, speed: speedRef.current }))
    popOut(tl, t2 + 0.1, 'loginForm')
    popIn(tl, t2 + 0.2, 'consentCard', { fromY: 12, sfxName: SFX_MAP.PLINK.name })
    say(tl, t2 + 0.3, CAPTIONS.SCOPE_LIMITED)
    t2 += 2.2
    tl.add(() => setConsentApproved(true), t2)
    sfxOn(tl, t2, () => sfxLoader.play('ui', SFX_MAP.CHIME.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t2 + 0.05, CAPTIONS.ADIB_APPROVES)
    t2 += 1.6
    popIn(tl, t2, 'consentStamp', { sfxName: SFX_MAP.DING.name })
    say(tl, t2 + 0.1, CAPTIONS.CONSENT_RECORDED)
    t2 += 1.6
    popOut(tl, t2, 'consentCard')
    popOut(tl, t2, 'consentStamp')
    let act2End = t2 + 0.7

    // ═══════════════ ACT 3 — Code Bukan Token (±14s) ═══════════════════
    tl.add(() => setPhaseIdx(2), act2End)
    tl.add(() => setCarrierStage('code'), act2End + 0.05)
    const carrierAtPkce = travel(tl, act2End + 0.1, setCarrierY, PROVIDER_Y, PKCE_Y, 1.0, 'power1.inOut')
    sfxOn(tl, act2End + 0.1, () => sfxLoader.transition(SFX_MAP.SLIDE_IN.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, carrierAtPkce + 0.05, CAPTIONS.CODE_RETURNS)
    let t3 = carrierAtPkce + 1.4
    popIn(tl, t3, 'pkceLock', { fromY: 10, sfxName: SFX_MAP.POP2.name })
    tl.add(() => setPkceLockClosed(true), t3 + 0.2)
    sfxOn(tl, t3 + 0.2, () => sfxLoader.impact(SFX_MAP.LOCK.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t3 + 0.3, CAPTIONS.CODE_NEEDS_PROOF)
    t3 += 2.0
    tl.add(() => setChallengeMatched(true), t3)
    sfxOn(tl, t3, () => sfxLoader.play('ui', SFX_MAP.NUMBER_TALLY.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t3 + 0.1, CAPTIONS.CHALLENGE_MATCHES)
    t3 += 1.8
    tl.add(() => setCarrierStage('token'), t3)
    sfxOn(tl, t3, () => sfxLoader.success(SFX_MAP.SHIMMER.name, { volume: volumeRef.current, speed: speedRef.current }))
    const carrierAtToken = travel(tl, t3 + 0.1, setCarrierY, PKCE_Y, TOKEN_Y, 0.9, 'power1.inOut')
    say(tl, carrierAtToken + 0.05, CAPTIONS.TOKEN_CARRIES_SCOPE)
    let act3End = carrierAtToken + 1.1
    popOut(tl, act3End - 0.3, 'pkceLock')

    // ═══════════════ ACT 4 — Hanya Data yang Diizinkan (±12s) ══════════
    tl.add(() => setPhaseIdx(3), act3End)
    popIn(tl, act3End + 0.1, 'resourceShelf', { fromY: 14 })
    const carrierAtResource = travel(tl, act3End + 0.2, setCarrierY, TOKEN_Y, RESOURCE_Y, 1.0, 'power1.inOut')
    sfxOn(tl, act3End + 0.2, () => sfxLoader.transition(SFX_MAP.WHOOSH.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, carrierAtResource + 0.05, CAPTIONS.TOKEN_TO_API)
    let t4 = carrierAtResource + 1.2
    popIn(tl, t4, 'lockedScopes', { fromY: 10, sfx: false })
    sfxOn(tl, t4, () => sfxLoader.warning(SFX_MAP.ALERT_PULSE.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t4 + 0.1, CAPTIONS.OTHER_DATA_LOCKED)
    t4 += 2.0
    tl.add(() => setScopeChecked(true), t4)
    sfxOn(tl, t4, () => sfxLoader.play('ui', SFX_MAP.TICK.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t4 + 0.1, CAPTIONS.SCOPE_CHECKED)
    t4 += 1.8
    tl.add(() => setProfileReturned(true), t4)
    sfxOn(tl, t4, () => sfxLoader.success(SFX_MAP.RELIEF.name, { volume: volumeRef.current, speed: speedRef.current }))
    popIn(tl, t4 + 0.05, 'closingStamps', { fromY: 12, sfxName: SFX_MAP.POP2.name })
    say(tl, t4 + 0.1, CAPTIONS.PROFILE_RETURNED)
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

  const Stamp = ({ x, y, color, top, sub, rot = -7 }) => (
    <g transform={`translate(${x}, ${y}) rotate(${rot})`}>
      <circle r={52} fill={color} opacity={0.16} />
      <rect x={-72} y={-32} width={144} height={64} rx={9} fill={COLORS.BG} stroke={color} strokeWidth={3} />
      <text x={0} y={1} textAnchor="middle" fontSize={12} fontWeight={900} fontFamily="monospace" fill={color}>{top}</text>
      {sub && <text x={0} y={22} textAnchor="middle" fontSize={9} fontFamily="sans-serif" fill={COLORS.MUTED}>{sub}</text>}
    </g>
  )

  // carrier — SATU objek visual, warna/label berubah sesuai stage
  // (bukan unmount/mount ulang), pola continuity §1.O.
  const carrierColor = carrierStage === 'ticket' ? COLORS.APP : carrierStage === 'code' ? COLORS.CODE : COLORS.TOKEN
  const carrierLabel = carrierStage === 'ticket' ? 'REDIRECT' : carrierStage === 'code' ? 'CODE' : 'TOKEN'
  const carrierSub = carrierStage === 'ticket'
    ? 'state + PKCE challenge'
    : carrierStage === 'code'
      ? `${AUTH_CODE.type} · sekali pakai`
      : `scope: ${ACCESS_TOKEN.scope}`

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
        {Array.from({ length: 21 }).map((_, i) => <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={VH} stroke={COLORS.APP} strokeWidth={1} />)}
        {Array.from({ length: 34 }).map((_, i) => <line key={`h${i}`} x1={0} y1={i * 40} x2={VW} y2={i * 40} stroke={COLORS.APP} strokeWidth={1} />)}
      </g>

      {/* ── HEADER — scene-ui V1: OAUTH2 (biru app) + DELEGATED LOGIN (indigo provider) ── */}
      {headerOpacity > 0 && (

        <g opacity={headerOpacity}>
          <IntroHeaderMorphV1
            progress={morphP}
            categorySegments={[
              { label: INTRO_CATEGORY_LABEL + ' · ', color: COLORS.MUTED },
              { label: INTRO_DOMAIN, color: COLORS.PROVIDER },
            ]}
            titleSegments={[
              { label: INTRO_TITLE_A, color: COLORS.APP },
              { label: INTRO_TITLE_B, color: COLORS.TOKEN },
            ]}
            titleLines={[
              [{ label: 'OAUTH2', color: COLORS.APP }],
              [{ label: 'DELEGATED LOGIN', color: COLORS.TOKEN }],
            ]}
            subtitle={INTRO_SUBTITLE}
            titleFilter="url(#glow)"
            testId="oauth2-intro-header"
          />
        </g>
      )}

      {contentStarted && (
        <g>
          <ActBadgeNavigatorV1
            phases={PHASES}
            activeIndex={phaseIdx}
            testId="oauth2-act-navigator"
          />

          {/* ── BODY — local coordinate content (origin body.x/body.y) ── */}
          <ContentBodyV1>
          {/* ── Act 1: kartu Aplikasi Catatan minta profile.read ── */}
          <g transform={T('appCard', AXIS_X, APP_Y)} opacity={O('appCard')}>
            <rect x={-110} y={-42} width={220} height={84} rx={12} fill={COLORS.PANEL} stroke={COLORS.APP} strokeWidth={2} filter="url(#shadow)" />
            <text x={0} y={-20} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="monospace" letterSpacing={1.5} fill={COLORS.APP}>{APP_LABEL}</text>
            <rect x={-78} y={-6} width={156} height={26} rx={7} fill={COLORS.BG} stroke={COLORS.BORDER} strokeWidth={1.5} />
            <text x={0} y={12} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={COLORS.TEXT}>{SCOPE_REQUEST.label}</text>
            <text x={0} y={34} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={COLORS.MUTED}>butuh profil dasar</text>
          </g>

          {/* password ditolak — muncul sebentar lalu ditolak dari aplikasi */}
          {passwordRejected && (
            <g transform={T('passwordBadge', AXIS_X, APP_Y + 74)} opacity={O('passwordBadge')}>
              <rect x={-72} y={-20} width={144} height={40} rx={9} fill={COLORS.BG} stroke={COLORS.DENY} strokeWidth={2} />
              <text x={-8} y={5} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={COLORS.DENY}>PASSWORD</text>
              <line x1={30} y1={-12} x2={50} y2={12} stroke={COLORS.DENY} strokeWidth={3} strokeLinecap="round" />
              <line x1={50} y1={-12} x2={30} y2={12} stroke={COLORS.DENY} strokeWidth={3} strokeLinecap="round" />
            </g>
          )}

          {/* gedung Identitas Kampus — provider domain, tempat login + consent */}
          <g transform={T('providerGate', AXIS_X, PROVIDER_Y)} opacity={O('providerGate')}>
            <rect x={-130} y={-56} width={260} height={112} rx={14} fill={COLORS.PANEL} stroke={COLORS.PROVIDER} strokeWidth={2.5} filter="url(#shadow)" />
            <text x={0} y={-32} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="monospace" letterSpacing={1.5} fill={COLORS.PROVIDER}>{PROVIDER_LABEL}</text>
            <circle cx={0} cy={2} r={26} fill={COLORS.PROVIDER} opacity={0.16} />
            <path d="M -14 14 Q 0 -6 14 14" fill="none" stroke={COLORS.PROVIDER} strokeWidth={3} strokeLinecap="round" />
            <circle cx={0} cy={-8} r={9} fill={COLORS.PROVIDER} />
            <text x={0} y={40} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={COLORS.MUTED}>domain identitas</text>
          </g>

          {/* ── Act 2: form login — hanya di provider, bukan di aplikasi ── */}
          {!providerLoginDone && (
            <g transform={T('loginForm', AXIS_X, PROVIDER_Y)} opacity={O('loginForm')}>
              <rect x={-90} y={-30} width={180} height={60} rx={10} fill={COLORS.BG} stroke={COLORS.PROVIDER} strokeWidth={2} />
              <rect x={-66} y={-14} width={132} height={14} rx={4} fill={COLORS.PANEL} stroke={COLORS.BORDER} strokeWidth={1} />
              <rect x={-66} y={6} width={132} height={14} rx={4} fill={COLORS.PANEL} stroke={COLORS.BORDER} strokeWidth={1} />
              <text x={0} y={-3} textAnchor="middle" fontSize={8} fontFamily="monospace" fill={COLORS.MUTED}>Adib</text>
              <text x={0} y={17} textAnchor="middle" fontSize={8} fontFamily="monospace" fill={COLORS.MUTED}>••••••••</text>
            </g>
          )}
          {providerLoginDone && (
            <g transform={`translate(${AXIS_X + 96}, ${PROVIDER_Y - 40})`}>
              <circle r={16} fill={COLORS.SUCCESS} opacity={0.18} stroke={COLORS.SUCCESS} strokeWidth={2} />
              <path d="M -6 0 L -2 5 L 7 -6" fill="none" stroke={COLORS.SUCCESS} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
            </g>
          )}

          {/* ── consent: kartu scope terbatas, bukan seluruh akun ── */}
          <g transform={T('consentCard', AXIS_X, CONSENT_Y)} opacity={O('consentCard')}>
            <rect x={-118} y={-46} width={236} height={92} rx={12} fill={COLORS.PANEL} stroke={COLORS.CONSENT} strokeWidth={2} filter="url(#shadow)" />
            <text x={0} y={-24} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="monospace" letterSpacing={1.5} fill={COLORS.CONSENT}>MINTA IZIN</text>
            <rect x={-84} y={-8} width={168} height={26} rx={7} fill={COLORS.BG} stroke={consentApproved ? COLORS.SUCCESS : COLORS.BORDER} strokeWidth={1.5} />
            <text x={0} y={10} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={consentApproved ? COLORS.SUCCESS : COLORS.TEXT}>{SCOPE_REQUEST.label}</text>
            <text x={0} y={32} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={COLORS.MUTED}>{consentApproved ? 'Allow ✓' : 'Allow / Deny'}</text>
          </g>
          {consentApproved && (
            <g transform={T('consentStamp', AXIS_X + 150, CONSENT_Y - 40)} opacity={O('consentStamp')} filter="url(#glow)">
              <Stamp x={0} y={0} color={COLORS.CONSENT} top="CONSENT" sub="izin tercatat" rot={-9} />
            </g>
          )}

          {/* ── carrier — SATU objek persist: tiket redirect → code → token
              (continuity §1.O, warna/label berubah, tidak unmount) ── */}
          <g transform={`translate(${AXIS_X + 150}, ${carrierY})`} filter="url(#glow)">
            <rect x={-64} y={-24} width={128} height={48} rx={10} fill={COLORS.BG} stroke={carrierColor} strokeWidth={2.5} />
            <text x={0} y={-4} textAnchor="middle" fontSize={10} fontWeight={900} fontFamily="monospace" fill={carrierColor}>{carrierLabel}</text>
            <text x={0} y={14} textAnchor="middle" fontSize={8} fontFamily="monospace" fill={COLORS.MUTED}>{carrierSub}</text>
          </g>

          {/* ── Act 3: PKCE lock — code perlu bukti pasangan verifier ── */}
          <g transform={T('pkceLock', AXIS_X - 150, PKCE_Y)} opacity={O('pkceLock')}>
            <circle r={34} fill={COLORS.CRYPTO} opacity={0.14} />
            <rect x={-20} y={-4} width={40} height={30} rx={5} fill={COLORS.BG} stroke={pkceLockClosed ? COLORS.CRYPTO : COLORS.BORDER} strokeWidth={2.5} />
            <path d="M -12 -4 L -12 -16 Q 0 -30 12 -16 L 12 -4" fill="none" stroke={pkceLockClosed ? COLORS.CRYPTO : COLORS.BORDER} strokeWidth={3} />
            <circle cx={0} cy={12} r={4} fill={pkceLockClosed ? COLORS.CRYPTO : COLORS.BORDER} />
            <text x={0} y={48} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={COLORS.MUTED}>{PKCE_PAIR.challengeMethod}</text>
            {challengeMatched && (
              <g transform="translate(38, -30)">
                <circle r={13} fill={COLORS.SUCCESS} opacity={0.2} stroke={COLORS.SUCCESS} strokeWidth={2} />
                <path d="M -5 0 L -1 4 L 6 -5" fill="none" stroke={COLORS.SUCCESS} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
              </g>
            )}
          </g>

          {/* ── Act 4: rak Profil API — hanya data sesuai scope ── */}
          <g transform={T('resourceShelf', AXIS_X, RESOURCE_Y)} opacity={O('resourceShelf')}>
            <rect x={-120} y={-40} width={240} height={80} rx={12} fill={COLORS.PANEL} stroke={COLORS.TOKEN} strokeWidth={2} filter="url(#shadow)" />
            <text x={0} y={-18} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="monospace" letterSpacing={1.5} fill={COLORS.TOKEN}>PROFIL API</text>
            <rect x={-84} y={-2} width={168} height={26} rx={7} fill={COLORS.BG} stroke={scopeChecked ? COLORS.SUCCESS : COLORS.BORDER} strokeWidth={1.5} />
            <text x={0} y={16} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={scopeChecked ? COLORS.SUCCESS : COLORS.TEXT}>{profileReturned ? 'nama · avatar' : SCOPE_REQUEST.label}</text>
          </g>

          {/* scope lain — tidak diminta/diizinkan, tetap terkunci */}
          <g transform={T('lockedScopes', AXIS_X, LOCKED_SCOPE_Y)} opacity={O('lockedScopes')}>
            {LOCKED_SCOPES.map((s, i) => (
              <g key={s.id} transform={`translate(${(i - (LOCKED_SCOPES.length - 1) / 2) * 150}, 0)`}>
                <rect x={-64} y={-20} width={128} height={40} rx={8} fill={COLORS.BG} stroke={COLORS.DENY} strokeWidth={2} opacity={0.7} />
                <text x={0} y={5} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={COLORS.DENY}>{s.label}</text>
                <line x1={-64} y1={-20} x2={64} y2={20} stroke={COLORS.DENY} strokeWidth={1.5} opacity={0.6} />
              </g>
            ))}
          </g>

          {/* ── CLOSING — dua cap payoff: izin vs password ── */}
          <g transform={T('closingStamps', AXIS_X, CLOSING_Y)} opacity={O('closingStamps')} filter="url(#glow)">
            <Stamp x={-140} y={0} color={COLORS.TOKEN} top="PROFILE.READ" sub="izin, bukan password" />
            <Stamp x={140} y={0} color={COLORS.DENY} top="NO PASSWORD" sub="tidak pernah dibagi" />
          </g>

          {/* ── CAPTION — dekat objek aktif per Act ── */}
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
