// src/content/22-oauth2-delegated-login/Animation.jsx
// ═══════════════════════════════════════════════════════════════════════════
// REVISI-02 2026-09-13 (lihat revisi/2026-09-13-revisi-02-provider-cases-role-layout.md).
// Provider generik "Identitas Kampus" diganti 4 provider nyata (Google/GitHub/
// Microsoft/Apple), GitHub = kasus utama. Layout diubah dari satu sumbu jadi
// TIGA lane tetap: LANE_LEFT_X (DevNotes/client) — AXIS_X (carrier corridor:
// redirect→code→token) — LANE_RIGHT_X (GitHub/provider+API). Login form dan
// consent card BERBAGI satu container providerCard (swap konten, bukan layer
// di atas). Carrier tetap SATU objek persist lintas Act (continuity §1.O).
//
// STATUS: revisi-02 first pass (data.js + Animation.jsx). Menunggu preview
// manual & export MP4. Registry tetap TIDAK diaktifkan sampai preview/export
// lolos (lihat plan §Checklist Penerimaan Eksekusi).
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, SFX_MAP,
  INTRO_CATEGORY_LABEL, INTRO_DOMAIN, INTRO_TITLE_A, INTRO_TITLE_B, INTRO_SUBTITLE,
  LANE_LEFT_X, AXIS_X, LANE_RIGHT_X,
  APP_Y, REDIRECT_TRANSIT_Y, PROVIDER_Y, CONSENT_STAMP_Y, PKCE_Y,
  RESOURCE_Y, LOCKED_SCOPE_Y, CLOSING_Y, FLOW_STEPPER_Y, FLOW_NODES,
  APP_LABEL, PROVIDER_LABEL, PROVIDERS, GITHUB_CASE,
  PKCE_PAIR, AUTH_CODE, ACCESS_TOKEN, LOCKED_SCOPES, CAPTIONS,
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
  const [flowStep, setFlowStep] = useState(0) // 0 = belum mulai, 1-6 = FLOW_NODES
  const [caption, setCaption] = useState('')
  const [captionY, setCaptionY] = useState(APP_Y + 150)
  const [pop, setPop] = useState({})

  // ── header — hero-to-header morph, pola sama topic lain scene-ui V1 ──
  const [morphP, setMorphP] = useState(0)
  const [headerOpacity, setHeaderOpacity] = useState(0)
  const [contentStarted, setContentStarted] = useState(false)

  // ── Act 1 — pilih provider ──
  const [providerPicked, setProviderPicked] = useState(false)

  // ── Act 2 — login GitHub + consent (satu card, konten di-swap) ──
  const [providerLoginDone, setProviderLoginDone] = useState(false)
  const [consentApproved, setConsentApproved] = useState(false)

  // ── Act 3 — code vs token (PKCE) ──
  const [pkceLockClosed, setPkceLockClosed] = useState(false)
  const [challengeMatched, setChallengeMatched] = useState(false)

  // ── Act 4 — scoped access ──
  const [scopeChecked, setScopeChecked] = useState(false)
  const [profileReturned, setProfileReturned] = useState(false)

  // ── carrier — SATU objek persist di lane tengah (AXIS_X): tiket
  // redirect → code → token (continuity §1.O, tidak unmount/mount ulang) ──
  const [carrierY, setCarrierY] = useState(APP_Y)
  const [carrierStage, setCarrierStage] = useState('redirect') // redirect | code | token

  const P = (id) => pop[id] || { scale: 0, opacity: 0, x: 0, y: 0 }

  useEffect(() => {
    const shouldEnable = previewSfx && audioUnlocked
    sfxLoader.setEnabled(shouldEnable)
    audioUnlockedRef.current = audioUnlocked
    volumeRef.current = volume
    speedRef.current = speed
  }, [previewSfx, audioUnlocked, volume, speed])

  // ── helper pop-in/pop-out/morph ──
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

  const say = (tl, time, text, y) => tl.add(() => { setCaption(text); if (y != null) setCaptionY(y) }, time)
  const sfxOn = (tl, time, fn) => tl.add(() => audioUnlockedRef.current && fn(), time)

  const travel = (tl, time, setter, from, to, duration, ease) => {
    const o = { y: from }
    tl.to(o, { y: to, duration, ease, onUpdate: () => setter(o.y) }, time)
    return time + duration
  }

  // ═══════════════════════════════════════════════════════════════════════
  // MASTER TIMELINE — empat Act, ±48s (intro 1s + 10+12+14+12s)
  // ═══════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 })
    tlRef.current = tl
    window.__animationTimeline = tl
    window.__flushSync = flushSync

    let t = 0

    tl.add(() => {
      setMorphP(0); setHeaderOpacity(1); setContentStarted(false)
      setProviderPicked(false)
      setProviderLoginDone(false); setConsentApproved(false)
      setPkceLockClosed(false); setChallengeMatched(false)
      setScopeChecked(false); setProfileReturned(false)
      setCarrierY(APP_Y); setCarrierStage('redirect'); setFlowStep(0)
      setPop({}); setCaption(''); setCaptionY(APP_Y + 150)
    }, t)

    // ═══════════════ INTRO — hero centered → header ════════════════
    t += 0.2
    const mo = { p: 0 }
    tl.to(mo, { p: 1, duration: 0.8, ease: 'power3.inOut', onUpdate: () => setMorphP(mo.p) }, t)
    sfxOn(tl, t, () => sfxLoader.transition(SFX_MAP.TELEPORT.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 0.8
    tl.add(() => setContentStarted(true), t)

    // ═══════════════ ACT 1 — Pilih Provider, Bukan Password (±10s) ═════
    tl.add(() => setPhaseIdx(0), t)
    popIn(tl, t + 0.05, 'appCard', { fromY: -10 })
    popIn(tl, t + 0.15, 'providerList', { fromY: 8 })
    say(tl, t + 0.2, CAPTIONS.PICK_PROVIDER, APP_Y + 150)
    t += 1.9
    tl.add(() => { setFlowStep(1); setProviderPicked(true) }, t)
    sfxOn(tl, t, () => sfxLoader.play('ui', SFX_MAP.TICK.name, { volume: volumeRef.current, speed: speedRef.current }))
    popOut(tl, t, 'providerList')
    popIn(tl, t + 0.1, 'providerChip', { sfxName: SFX_MAP.POP2.name })
    popIn(tl, t + 0.15, 'altChips', { sfx: false, fromY: 6 })
    say(tl, t + 0.2, CAPTIONS.GITHUB_SELECTED, APP_Y + 150)
    t += 1.6
    tl.add(() => setCarrierStage('redirect'), t)
    const carrierAtTransit = travel(tl, t + 0.1, setCarrierY, APP_Y, REDIRECT_TRANSIT_Y, 0.6, 'power1.out')
    sfxOn(tl, t + 0.1, () => sfxLoader.transition(SFX_MAP.LIGHT_SWOOSH.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, carrierAtTransit + 0.05, CAPTIONS.REDIRECT_TO_GITHUB, REDIRECT_TRANSIT_Y - 60)
    const carrierAtProvider = travel(tl, carrierAtTransit + 0.1, setCarrierY, REDIRECT_TRANSIT_Y, PROVIDER_Y, 0.7, 'power1.inOut')
    let act1End = carrierAtProvider + 1.0

    // ═══════════════ ACT 2 — GitHub Autentikasi & Minta Consent (±12s) ═
    tl.add(() => setPhaseIdx(1), act1End)
    tl.add(() => setFlowStep(2), act1End + 0.05)
    popIn(tl, act1End + 0.1, 'providerCard', { fromY: 14 })
    popIn(tl, act1End + 0.15, 'loginForm', {})
    say(tl, act1End + 0.2, CAPTIONS.LOGIN_AT_GITHUB, PROVIDER_Y + 135)
    let t2 = act1End + 1.9
    tl.add(() => setProviderLoginDone(true), t2)
    sfxOn(tl, t2, () => sfxLoader.play('ui', SFX_MAP.TICK.name, { volume: volumeRef.current, speed: speedRef.current }))
    popIn(tl, t2 + 0.1, 'passwordLock', { sfx: false })
    say(tl, t2 + 0.15, CAPTIONS.PASSWORD_STAYS, PROVIDER_Y + 135)
    t2 += 1.9
    tl.add(() => setFlowStep(3), t2)
    popOut(tl, t2, 'loginForm')
    popIn(tl, t2 + 0.1, 'consentBody', { fromY: 8, sfxName: SFX_MAP.PLINK.name })
    say(tl, t2 + 0.15, CAPTIONS.CONSENT_ASK, PROVIDER_Y + 135)
    t2 += 2.1
    tl.add(() => setConsentApproved(true), t2)
    sfxOn(tl, t2, () => sfxLoader.play('ui', SFX_MAP.CHIME.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t2 + 0.05, CAPTIONS.RANI_APPROVES, PROVIDER_Y + 135)
    t2 += 1.4
    popIn(tl, t2, 'consentStamp', { sfxName: SFX_MAP.DING.name })
    say(tl, t2 + 0.1, CAPTIONS.CONSENT_RECORDED, PROVIDER_Y + 135)
    t2 += 1.6
    popOut(tl, t2, 'consentBody')
    popOut(tl, t2, 'consentStamp')
    popOut(tl, t2, 'passwordLock')
    let act2End = t2 + 0.6

    // ═══════════════ ACT 3 — Code Ditukar, Bukan Dibaca Token (±14s) ═══
    tl.add(() => setPhaseIdx(2), act2End)
    tl.add(() => setFlowStep(4), act2End + 0.05)
    tl.add(() => setCarrierStage('code'), act2End + 0.05)
    const carrierAtPkce = travel(tl, act2End + 0.1, setCarrierY, PROVIDER_Y, PKCE_Y, 1.0, 'power1.inOut')
    sfxOn(tl, act2End + 0.1, () => sfxLoader.transition(SFX_MAP.SLIDE_IN.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, carrierAtPkce + 0.05, CAPTIONS.CODE_RETURNS, PKCE_Y - 90)
    let t3 = carrierAtPkce + 1.3
    popIn(tl, t3, 'pkceLock', { fromY: 10, sfxName: SFX_MAP.POP2.name })
    say(tl, t3 + 0.1, CAPTIONS.CODE_NEEDS_PROOF, PKCE_Y + 95)
    t3 += 1.8
    tl.add(() => setFlowStep(5), t3)
    tl.add(() => setPkceLockClosed(true), t3)
    sfxOn(tl, t3, () => sfxLoader.impact(SFX_MAP.LOCK.name, { volume: volumeRef.current, speed: speedRef.current }))
    t3 += 2.0
    tl.add(() => setChallengeMatched(true), t3)
    sfxOn(tl, t3, () => sfxLoader.play('ui', SFX_MAP.NUMBER_TALLY.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t3 + 0.1, CAPTIONS.PKCE_MATCH, PKCE_Y + 95)
    t3 += 1.8
    tl.add(() => setCarrierStage('token'), t3)
    sfxOn(tl, t3, () => sfxLoader.success(SFX_MAP.SHIMMER.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t3 + 0.1, CAPTIONS.TOKEN_SCOPE, PKCE_Y - 90)
    let act3End = t3 + 1.5
    popOut(tl, act3End - 0.3, 'pkceLock')

    // ═══════════════ ACT 4 — API Cek Scope (±12s) ══════════════════════
    tl.add(() => setPhaseIdx(3), act3End)
    tl.add(() => setFlowStep(6), act3End + 0.05)
    popIn(tl, act3End + 0.1, 'resourceCard', { fromY: 14 })
    const carrierAtResource = travel(tl, act3End + 0.15, setCarrierY, PKCE_Y, RESOURCE_Y, 1.0, 'power1.inOut')
    sfxOn(tl, act3End + 0.15, () => sfxLoader.transition(SFX_MAP.WHOOSH.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, carrierAtResource + 0.05, CAPTIONS.TOKEN_TO_API, RESOURCE_Y - 110)
    let t4 = carrierAtResource + 1.1
    popIn(tl, t4, 'lockedScopes', { fromY: 8, sfx: false })
    sfxOn(tl, t4, () => sfxLoader.warning(SFX_MAP.ALERT_PULSE.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t4 + 0.1, CAPTIONS.ACCESS_LOCKED, LOCKED_SCOPE_Y - 36)
    t4 += 1.9
    tl.add(() => setScopeChecked(true), t4)
    sfxOn(tl, t4, () => sfxLoader.play('ui', SFX_MAP.TICK.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t4 + 0.1, CAPTIONS.API_CHECK, RESOURCE_Y - 110)
    t4 += 1.6
    tl.add(() => setProfileReturned(true), t4)
    sfxOn(tl, t4, () => sfxLoader.success(SFX_MAP.RELIEF.name, { volume: volumeRef.current, speed: speedRef.current }))
    popOut(tl, t4, 'lockedScopes')
    popIn(tl, t4 + 0.1, 'returnedBadge', { fromY: -8, sfxName: SFX_MAP.POP2.name })
    say(tl, t4 + 0.15, CAPTIONS.PROFILE_RETURNED, APP_Y - 100)
    t4 += 1.7
    popIn(tl, t4, 'closingStamps', { fromY: 12, sfxName: SFX_MAP.POP2.name })
    say(tl, t4 + 0.1, CAPTIONS.TAKEAWAY, CLOSING_Y - 70)
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

  // carrier — SATU objek visual di lane tengah (AXIS_X), warna/label
  // berubah sesuai stage (bukan unmount/mount ulang), pola continuity §1.O.
  const carrierColor = carrierStage === 'redirect' ? COLORS.APP : carrierStage === 'code' ? COLORS.CODE : COLORS.TOKEN
  const carrierLabel = carrierStage === 'redirect' ? 'REDIRECT' : carrierStage === 'code' ? 'CODE' : 'TOKEN'
  const carrierSub = carrierStage === 'redirect'
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

      {headerOpacity > 0 && (
        <g opacity={headerOpacity}>
          <IntroHeaderMorphV1
            progress={morphP}
            categorySegments={[
              { label: INTRO_CATEGORY_LABEL + ' · ', color: COLORS.MUTED },
              { label: INTRO_DOMAIN, color: COLORS.APP },
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

          <ContentBodyV1>
            {/* ── lane guides — hint visual tiga lane, sangat redup ── */}
            <g opacity={0.05}>
              <line x1={LANE_LEFT_X} y1={0} x2={LANE_LEFT_X} y2={965} stroke={COLORS.APP} strokeWidth={1} strokeDasharray="4 8" />
              <line x1={LANE_RIGHT_X} y1={0} x2={LANE_RIGHT_X} y2={965} stroke={COLORS.PROVIDER} strokeWidth={1} strokeDasharray="4 8" />
            </g>

            {/* ── flow stepper 1-6 (revisi-02 §Alur visual) ── */}
            <g transform={`translate(${AXIS_X}, ${FLOW_STEPPER_Y})`}>
              {FLOW_NODES.map((n, i) => {
                const x = (i - (FLOW_NODES.length - 1) / 2) * 118
                const active = flowStep === n.n
                const passed = flowStep > n.n
                const fill = active ? COLORS.TOKEN : passed ? COLORS.MUTED : COLORS.BORDER
                return (
                  <g key={n.n} transform={`translate(${x}, 0)`}>
                    <circle r={9} fill={COLORS.BG} stroke={fill} strokeWidth={2} />
                    <text x={0} y={3} textAnchor="middle" fontSize={8} fontWeight={800} fontFamily="monospace" fill={fill}>{n.n}</text>
                    <text x={0} y={22} textAnchor="middle" fontSize={7} fontFamily="monospace" fill={fill} opacity={active ? 1 : 0.6}>{n.label}</text>
                  </g>
                )
              })}
            </g>

            {/* ── Act 1: DevNotes card + daftar provider ── */}
            <g transform={T('appCard', LANE_LEFT_X, APP_Y)} opacity={O('appCard')}>
              <rect x={-122} y={-115} width={244} height={230} rx={12} fill={COLORS.PANEL} stroke={COLORS.APP} strokeWidth={2} filter="url(#shadow)" />
              <text x={0} y={-92} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="monospace" letterSpacing={1.5} fill={COLORS.APP}>{APP_LABEL}</text>

              {!providerPicked && (
                <g opacity={O('providerList')}>
                  <text x={0} y={-70} textAnchor="middle" fontSize={8} fontFamily="monospace" fill={COLORS.MUTED}>pilih cara masuk</text>
                  {PROVIDERS.map((p, i) => (
                    <g key={p.id} transform={`translate(0, ${-48 + i * 38})`}>
                      <rect x={-105} y={-14} width={210} height={28} rx={7}
                        fill={COLORS.BG} stroke={p.main ? COLORS.PROVIDER : COLORS.BORDER} strokeWidth={p.main ? 2.5 : 1.5} />
                      <text x={-92} y={4} fontSize={9} fontWeight={800} fontFamily="monospace" fill={p.main ? COLORS.PROVIDER : COLORS.MUTED}>{p.icon}</text>
                      <text x={-70} y={4} fontSize={9} fontFamily="monospace" fill={p.main ? COLORS.TEXT : COLORS.MUTED}>{p.label}</text>
                    </g>
                  ))}
                </g>
              )}
            </g>

            {/* provider dipilih — chip GitHub + chip redup 3 provider lain */}
            <g transform={T('providerChip', LANE_LEFT_X, APP_Y - 60)} opacity={O('providerChip')}>
              <rect x={-100} y={-16} width={200} height={32} rx={16} fill={COLORS.BG} stroke={COLORS.PROVIDER} strokeWidth={2.5} />
              <text x={-84} y={5} fontSize={10} fontWeight={800} fontFamily="monospace" fill={COLORS.PROVIDER}>{'<>'}</text>
              <text x={-62} y={5} fontSize={10} fontFamily="monospace" fill={COLORS.TEXT}>Continue with GitHub</text>
            </g>
            <g transform={T('altChips', LANE_LEFT_X, APP_Y - 10)} opacity={O('altChips')}>
              <text x={0} y={-6} textAnchor="middle" fontSize={7} fontFamily="monospace" fill={COLORS.MUTED}>provider alternatif</text>
              {PROVIDERS.filter(p => !p.main).map((p, i) => (
                <g key={p.id} transform={`translate(${(i - 1) * 76}, 14)`} opacity={0.55}>
                  <rect x={-32} y={-11} width={64} height={22} rx={11} fill={COLORS.BG} stroke={COLORS.BORDER} strokeWidth={1} />
                  <text x={0} y={4} textAnchor="middle" fontSize={8} fontFamily="monospace" fill={COLORS.MUTED}>{p.icon || '?'}</text>
                </g>
              ))}
            </g>

            {/* returned badge — data balik ke lane kiri setelah API mengizinkan */}
            {profileReturned && (
              <g transform={T('returnedBadge', LANE_LEFT_X, APP_Y - 140)} opacity={O('returnedBadge')}>
                <rect x={-90} y={-16} width={180} height={32} rx={9} fill={COLORS.BG} stroke={COLORS.SUCCESS} strokeWidth={2} />
                <path d="M -72 0 L -66 6 L -56 -8" fill="none" stroke={COLORS.SUCCESS} strokeWidth={2.4} strokeLinecap="round" strokeLinejoin="round" />
                <text x={-8} y={4} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={COLORS.SUCCESS}>username + avatar</text>
              </g>
            )}

            {/* ── carrier — SATU objek persist di lane tengah ── */}
            <g transform={`translate(${AXIS_X}, ${carrierY})`} filter="url(#glow)">
              <rect x={-64} y={-24} width={128} height={48} rx={10} fill={COLORS.BG} stroke={carrierColor} strokeWidth={2.5} />
              <text x={0} y={-4} textAnchor="middle" fontSize={10} fontWeight={900} fontFamily="monospace" fill={carrierColor}>{carrierLabel}</text>
              <text x={0} y={14} textAnchor="middle" fontSize={8} fontFamily="monospace" fill={COLORS.MUTED}>{carrierSub}</text>
            </g>

            {/* ── Act 2: GitHub card — login form lalu consent (satu container) ── */}
            <g transform={T('providerCard', LANE_RIGHT_X, PROVIDER_Y)} opacity={O('providerCard')}>
              <rect x={-125} y={-110} width={250} height={220} rx={14} fill={COLORS.PANEL} stroke={COLORS.PROVIDER} strokeWidth={2.5} filter="url(#shadow)" />
              <text x={0} y={-86} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="monospace" letterSpacing={1.5} fill={COLORS.PROVIDER}>{PROVIDER_LABEL}</text>

              {!providerLoginDone && (
                <g opacity={O('loginForm')}>
                  <rect x={-90} y={-50} width={180} height={60} rx={10} fill={COLORS.BG} stroke={COLORS.PROVIDER} strokeWidth={2} />
                  <rect x={-66} y={-34} width={132} height={14} rx={4} fill={COLORS.PANEL} stroke={COLORS.BORDER} strokeWidth={1} />
                  <rect x={-66} y={-14} width={132} height={14} rx={4} fill={COLORS.PANEL} stroke={COLORS.BORDER} strokeWidth={1} />
                  <text x={0} y={-23} textAnchor="middle" fontSize={8} fontFamily="monospace" fill={COLORS.MUTED}>Adib</text>
                  <text x={0} y={-3} textAnchor="middle" fontSize={8} fontFamily="monospace" fill={COLORS.MUTED}>••••••••</text>
                </g>
              )}
              {providerLoginDone && !consentApproved && (
                <g opacity={O('consentBody')}>
                  <text x={0} y={-56} textAnchor="middle" fontSize={9} fontWeight={700} fontFamily="monospace" fill={COLORS.CONSENT}>MINTA IZIN</text>
                  <rect x={-90} y={-42} width={180} height={26} rx={7} fill={COLORS.BG} stroke={COLORS.BORDER} strokeWidth={1.5} />
                  <text x={0} y={-24} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={COLORS.TEXT}>{GITHUB_CASE.scope}</text>
                  <text x={0} y={-4} textAnchor="middle" fontSize={8} fontFamily="monospace" fill={COLORS.MUTED}>{GITHUB_CASE.scopeNote}</text>
                </g>
              )}
              {consentApproved && (
                <g>
                  <text x={0} y={-56} textAnchor="middle" fontSize={9} fontWeight={700} fontFamily="monospace" fill={COLORS.SUCCESS}>DISETUJUI</text>
                  <rect x={-90} y={-42} width={180} height={26} rx={7} fill={COLORS.BG} stroke={COLORS.SUCCESS} strokeWidth={1.5} />
                  <text x={0} y={-24} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={COLORS.SUCCESS}>{GITHUB_CASE.scope} ✓</text>
                </g>
              )}

              {providerLoginDone && (
                <g transform={T('passwordLock', 0, 76)} opacity={O('passwordLock')}>
                  <rect x={-96} y={-15} width={192} height={30} rx={8} fill={COLORS.BG} stroke={COLORS.PROVIDER} strokeWidth={1.5} />
                  <rect x={-84} y={-6} width={12} height={10} rx={2} fill="none" stroke={COLORS.PROVIDER} strokeWidth={1.6} />
                  <path d="M -80 -6 L -80 -11 Q -80 -16 -75 -16 Q -70 -16 -70 -11 L -70 -6" fill="none" stroke={COLORS.PROVIDER} strokeWidth={1.6} />
                  <text x={5} y={4} textAnchor="middle" fontSize={8} fontFamily="monospace" fill={COLORS.MUTED}>password tetap di sini</text>
                </g>
              )}
            </g>

            {/* consent stamp — di luar kanan-atas card provider, bukan dilayer di atasnya */}
            {consentApproved && (
              <g transform={T('consentStamp', LANE_RIGHT_X, CONSENT_STAMP_Y)} opacity={O('consentStamp')} filter="url(#glow)">
                <Stamp x={0} y={0} color={COLORS.CONSENT} top="CONSENT" sub="izin tercatat" rot={-8} />
              </g>
            )}

            {/* ── Act 3: PKCE lock — di sisi kiri lane carrier ── */}
            <g transform={T('pkceLock', AXIS_X - 110, PKCE_Y)} opacity={O('pkceLock')}>
              <circle r={34} fill={COLORS.CRYPTO} opacity={0.14} />
              <rect x={-20} y={-4} width={40} height={30} rx={5} fill={COLORS.BG} stroke={pkceLockClosed ? COLORS.CRYPTO : COLORS.BORDER} strokeWidth={2.5} />
              <path d="M -12 -4 L -12 -16 Q 0 -30 12 -16 L 12 -4" fill="none" stroke={pkceLockClosed ? COLORS.CRYPTO : COLORS.BORDER} strokeWidth={3} />
              <circle cx={0} cy={12} r={4} fill={pkceLockClosed ? COLORS.CRYPTO : COLORS.BORDER} />
              <text x={0} y={50} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={COLORS.MUTED}>{PKCE_PAIR.challengeMethod}</text>
              {challengeMatched && (
                <g transform="translate(38, -30)">
                  <circle r={13} fill={COLORS.SUCCESS} opacity={0.2} stroke={COLORS.SUCCESS} strokeWidth={2} />
                  <path d="M -5 0 L -1 4 L 6 -5" fill="none" stroke={COLORS.SUCCESS} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round" />
                </g>
              )}
            </g>

            {/* ── Act 4: GitHub API — hanya data sesuai scope ── */}
            <g transform={T('resourceCard', LANE_RIGHT_X, RESOURCE_Y)} opacity={O('resourceCard')}>
              <rect x={-120} y={-90} width={240} height={180} rx={12} fill={COLORS.PANEL} stroke={COLORS.TOKEN} strokeWidth={2} filter="url(#shadow)" />
              <text x={0} y={-66} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="monospace" letterSpacing={1.5} fill={COLORS.TOKEN}>GITHUB API</text>
              <rect x={-84} y={-48} width={168} height={26} rx={7} fill={COLORS.BG} stroke={scopeChecked ? COLORS.SUCCESS : COLORS.BORDER} strokeWidth={1.5} />
              <text x={0} y={-30} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={scopeChecked ? COLORS.SUCCESS : COLORS.TEXT}>
                {profileReturned ? 'username · avatar' : GITHUB_CASE.scope}
              </text>
            </g>

            {/* scope lain — tetap terkunci, aside satu baris di kanan */}
            <g transform={T('lockedScopes', LANE_RIGHT_X, LOCKED_SCOPE_Y)} opacity={O('lockedScopes')}>
              {LOCKED_SCOPES.map((s, i) => (
                <g key={s.id} transform={`translate(${(i - (LOCKED_SCOPES.length - 1) / 2) * 130}, 0)`}>
                  <rect x={-58} y={-16} width={116} height={32} rx={8} fill={COLORS.BG} stroke={COLORS.DENY} strokeWidth={2} opacity={0.75} />
                  <text x={0} y={4} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={COLORS.DENY}>{s.label}</text>
                  <line x1={-58} y1={-16} x2={58} y2={16} stroke={COLORS.DENY} strokeWidth={1.5} opacity={0.6} />
                </g>
              ))}
            </g>

            {/* ── CLOSING — dua cap payoff: izin vs password ── */}
            <g transform={T('closingStamps', AXIS_X, CLOSING_Y)} opacity={O('closingStamps')} filter="url(#glow)">
              <Stamp x={-140} y={0} color={COLORS.TOKEN} top="READ:USER" sub="izin, bukan password" />
              <Stamp x={140} y={0} color={COLORS.DENY} top="NO PASSWORD" sub="tidak pernah dibagi" />
            </g>

            {/* ── CAPTION — anchor per-beat, bukan CAPTION_Y statis ── */}
            {caption && (
              <g transform={`translate(${AXIS_X}, ${captionY})`}>
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
