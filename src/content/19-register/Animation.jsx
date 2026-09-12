// src/content/19-register/Animation.jsx
// ═══════════════════════════════════════════════════════════════════════════
// Eksekusi sesuai src/content/19-register/_docs/REGISTER_PLAN.md (2026-09-12).
// Empat Act, scene-ui V1 penuh (IntroHeaderMorphV1 + ActBadgeNavigatorV1 +
// ContentBodyV1), koordinat LOCAL (origin body 44,235), sumbu vertikal AXIS_X.
// Cerita: buku anggota kosong → form di loket → validasi (email invalid,
// duplikat) → password slip ke mesin hash + salt → record Pending → amplop
// verifikasi ke inbox (handoff topic 20). Protagonis Adib (kontrak seri).
//
// STATUS: first pass (data.js + manifest.js + timeline + render JSX).
// Menunggu preview manual & export MP4 sebelum registry `ready`
// (lihat plan §5 Checklist Eksekusi).
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, SFX_MAP,
  INTRO_CATEGORY_LABEL, INTRO_DOMAIN, INTRO_TITLE_A, INTRO_TITLE_B, INTRO_SUBTITLE,
  AXIS_X, BOOKS_Y, FORM_Y, RECORD_Y, MACHINE_Y, INBOX_Y, CLOSING_Y, CAPTION_Y,
  BOOKS_LABEL, FORM_LABEL, RECORD_LABEL, MACHINE_LABEL, INBOX_LABEL,
  FIELDS, PENDING_BADGE, HASH_OUT, SALT_CHIP, CAPTIONS,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'
import { IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1 } from '../../shared/scene-ui/v1'

export default function RegisterAnimation({
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

  // ── header — hero-to-header morph ──
  const [morphP, setMorphP] = useState(0)
  const [headerOpacity, setHeaderOpacity] = useState(0)
  const [contentStarted, setContentStarted] = useState(false)

  // ── Act 1 — belum ada di buku anggota ──
  const [slotEmpty, setSlotEmpty] = useState(false)
  const [loginBlocked, setLoginBlocked] = useState(false)

  // ── Act 2 — validasi form ──
  const [emailInvalid, setEmailInvalid] = useState(false)
  const [duplicateFound, setDuplicateFound] = useState(false)
  const [validAll, setValidAll] = useState(false)

  // ── Act 3 — hash + salt, record Pending ──
  const [slipSent, setSlipSent] = useState(false)
  const [saltAdded, setSaltAdded] = useState(false)
  const [hashDone, setHashDone] = useState(false)
  const [pendingRecord, setPendingRecord] = useState(false)

  // ── Act 4 — amplop verifikasi ke inbox ──
  const [envArrived, setEnvArrived] = useState(false)

  // ── carrier animasi — slip password & amplop verifikasi ──
  const [slipY, setSlipY] = useState(FORM_Y)
  const [envY, setEnvY] = useState(RECORD_Y)

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
  // MASTER TIMELINE — empat Act ±42s (intro 1.2s + 9 + 11 + 12.5 + 9 s)
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
      setPhaseIdx(0)
      setSlotEmpty(false); setLoginBlocked(false)
      setEmailInvalid(false); setDuplicateFound(false); setValidAll(false)
      setSlipSent(false); setSaltAdded(false); setHashDone(false); setPendingRecord(false)
      setEnvArrived(false)
      setSlipY(FORM_Y); setEnvY(RECORD_Y)
      setPop({}); setCaption('')
    }, t)

    // ═══════════════ INTRO — hero centered → header ════════════════
    t += 0.2
    const mo = { p: 0 }
    tl.to(mo, { p: 1, duration: 0.8, ease: 'power3.inOut', onUpdate: () => setMorphP(mo.p) }, t)
    sfxOn(tl, t, () => sfxLoader.transition(SFX_MAP.TELEPORT.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 0.8
    tl.add(() => setContentStarted(true), t)

    // ═══════════════ ACT 1 — Belum Ada di Buku Anggota (±9s) ═══════
    tl.add(() => setPhaseIdx(0), t)
    popIn(tl, t + 0.05, 'booksShelf', { sfxName: SFX_MAP.SHIMMER.name, sfxCategory: 'success', volumeMult: 0.6 })
    say(tl, t + 0.1, CAPTIONS.NO_ACCOUNT)
    t += 1.4
    tl.add(() => setSlotEmpty(true), t)
    sfxOn(tl, t, () => sfxLoader.play('ui', SFX_MAP.TICK.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t + 0.1, CAPTIONS.SLOT_EMPTY)
    t += 1.6
    tl.add(() => setLoginBlocked(true), t)
    sfxOn(tl, t, () => sfxLoader.impact(SFX_MAP.LOCK.name, { volume: volumeRef.current, speed: speedRef.current }))
    popIn(tl, t + 0.05, 'doorX', { sfxName: SFX_MAP.CRITICAL_ALERT.name, sfxCategory: 'warnings', volumeMult: 0.8 })
    say(tl, t + 0.1, CAPTIONS.LOGIN_BLOCKED)
    t += 1.8
    popIn(tl, t, 'loketCard', { fromY: 14, sfxName: SFX_MAP.SHIMMER.name, sfxCategory: 'success', volumeMult: 0.6 })
    say(tl, t + 0.1, CAPTIONS.NEED_DATA)
    t += 1.8
    popIn(tl, t, 'field_nama', { fromY: 6, sfxName: SFX_MAP.TICK.name, sfxCategory: 'ui' })
    t += 0.55
    popIn(tl, t, 'field_email', { fromY: 6, sfxName: SFX_MAP.PLINK.name, sfxCategory: 'ui' })
    t += 0.55
    popIn(tl, t, 'field_password', { fromY: 6, sfxName: SFX_MAP.POP2.name, sfxCategory: 'ui' })
    let act1End = t + 0.8
    say(tl, act1End - 0.2, CAPTIONS.SLOT_PAYOFF)

    // ═══════════════ ACT 2 — Form Harus Masuk Akal (±11s) ══════════
    tl.add(() => setPhaseIdx(1), act1End)
    say(tl, act1End + 0.1, CAPTIONS.FILL_BASIC)
    let t2 = act1End + 1.6
    tl.add(() => setEmailInvalid(true), t2)
    sfxOn(tl, t2, () => sfxLoader.warning(SFX_MAP.ALERT_PULSE.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t2 + 0.1, CAPTIONS.EMAIL_INVALID)
    t2 += 1.6
    tl.add(() => setEmailInvalid(false), t2)
    tl.add(() => setDuplicateFound(true), t2 + 0.3)
    sfxOn(tl, t2 + 0.3, () => sfxLoader.warning(SFX_MAP.ALERT_PULSE.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t2 + 0.4, CAPTIONS.EMAIL_TAKEN)
    t2 += 2.0
    tl.add(() => setDuplicateFound(false), t2)
    tl.add(() => setValidAll(true), t2 + 0.3)
    sfxOn(tl, t2 + 0.3, () => sfxLoader.success(SFX_MAP.CONFIRM.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t2 + 0.4, CAPTIONS.DATA_READY)
    t2 += 2.0
    popIn(tl, t2, 'submitBtn', { sfxName: SFX_MAP.LIGHT_SWOOSH.name, sfxCategory: 'transitions' })
    let act2End = t2 + 0.9

    // ═══════════════ ACT 3 — Password Tidak Ikut Disimpan (±12.5s) ══
    tl.add(() => setPhaseIdx(2), act2End)
    popIn(tl, act2End + 0.05, 'recordCard', {})
    popIn(tl, act2End + 0.1, 'machineBox', {})
    say(tl, act2End + 0.15, CAPTIONS.PASSWORD_SECRET)
    let t3 = act2End + 1.7
    tl.add(() => setSlipSent(true), t3)
    sfxOn(tl, t3, () => sfxLoader.transition(SFX_MAP.WHOOSH.name, { volume: volumeRef.current, speed: speedRef.current }))
    const slipDone = travel(tl, t3 + 0.1, setSlipY, FORM_Y + 30, MACHINE_Y - 26, 1.1, 'power1.in')
    sfxOn(tl, slipDone, () => sfxLoader.impact(SFX_MAP.SNAP.name, { volume: volumeRef.current, speed: speedRef.current }))
    tl.add(() => setSaltAdded(true), slipDone + 0.1)
    sfxOn(tl, slipDone + 0.1, () => sfxLoader.play('ui', SFX_MAP.TICK.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, slipDone + 0.2, CAPTIONS.SALT_MIXED)
    sfxOn(tl, slipDone + 0.8, () => sfxLoader.play('ui', SFX_MAP.NUMBER_TALLY.name, { volume: volumeRef.current, speed: speedRef.current }))
    t3 = slipDone + 1.5
    tl.add(() => setHashDone(true), t3)
    sfxOn(tl, t3, () => sfxLoader.success(SFX_MAP.SHIMMER.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t3 + 0.1, CAPTIONS.HASH_STORED)
    t3 += 1.8
    tl.add(() => setPendingRecord(true), t3)
    sfxOn(tl, t3, () => sfxLoader.play('ui', SFX_MAP.CHIME.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t3 + 0.1, CAPTIONS.STILL_PENDING)
    let act3End = t3 + 1.3

    // ═══════════════ ACT 4 — Buktikan Email Milikmu (±9s) ═══════════
    tl.add(() => setPhaseIdx(3), act3End)
    popIn(tl, act3End + 0.1, 'inboxCard', {})
    say(tl, act3End + 0.15, CAPTIONS.VERIFY_SENT)
    const envDone = travel(tl, act3End + 0.4, setEnvY, RECORD_Y + 24, INBOX_Y - 22, 1.4, 'power1.inOut')
    sfxOn(tl, act3End + 0.4, () => sfxLoader.transition(SFX_MAP.SWOOSH.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, envDone - 0.5, CAPTIONS.MAIL_TO_INBOX)
    tl.add(() => setEnvArrived(true), envDone)
    sfxOn(tl, envDone, () => sfxLoader.success(SFX_MAP.DING.name, { volume: volumeRef.current, speed: speedRef.current }))
    let t4 = envDone + 0.4
    say(tl, t4, CAPTIONS.NOT_ACTIVE_YET)
    popIn(tl, t4 + 0.3, 'closingStamps', { fromY: 12, sfxName: SFX_MAP.RELIEF.name, sfxCategory: 'success' })
    say(tl, t4 + 0.4, CAPTIONS.BUFS_WAIT)
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

  const Envelope = ({ x, y, color }) => (
    <g transform={`translate(${x}, ${y})`}>
      <rect x={-38} y={-26} width={76} height={52} rx={8} fill={COLORS.BG} stroke={color} strokeWidth={2.5} filter="url(#shadow)" />
      <path d="M -34 -21 L 0 6 L 34 -21" fill="none" stroke={color} strokeWidth={2} strokeLinejoin="round" />
      <path d="M -34 20 L -12 4 M 34 20 L 12 4" fill="none" stroke={color} strokeWidth={1.5} opacity={0.7} />
    </g>
  )

  const fieldColor = (key) => {
    if (key === 'email' && emailInvalid) return COLORS.DENY
    if (key === 'email' && duplicateFound) return COLORS.PENDING
    if (validAll) return COLORS.SUCCESS
    return COLORS.BORDER
  }

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
        {Array.from({ length: 21 }).map((_, i) => <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={VH} stroke={COLORS.FORM} strokeWidth={1} />)}
        {Array.from({ length: 34 }).map((_, i) => <line key={`h${i}`} x1={0} y1={i * 40} x2={VW} y2={i * 40} stroke={COLORS.FORM} strokeWidth={1} />)}
      </g>

      {/* ── HEADER — scene-ui V1: REGISTER (ungu form) + AKUN (record) ── */}
      {headerOpacity > 0 && (
        <g opacity={headerOpacity}>
          <IntroHeaderMorphV1
            progress={morphP}
            categorySegments={[
              { label: INTRO_CATEGORY_LABEL + ' · ', color: COLORS.MUTED },
              { label: INTRO_DOMAIN, color: COLORS.SYSTEM },
            ]}
            titleSegments={[
              { label: INTRO_TITLE_A, color: COLORS.RECORD },
              { label: INTRO_TITLE_B, color: COLORS.SUCCESS },
            ]}
            subtitle={INTRO_SUBTITLE}
            titleFilter="url(#glow)"
            testId="register-intro-header"
          />
        </g>
      )}

      {contentStarted && (
        <g>
          <ActBadgeNavigatorV1
            phases={PHASES}
            activeIndex={phaseIdx}
            testId="register-act-navigator"
          />

          {/* ── BODY — local coordinate content (origin body.x/body.y) ── */}
          <ContentBodyV1 debugName="register-body">

          {/* jalur visual: buku → form → mesin → inbox (tipis, redup) */}
          <g opacity={0.35}>
            <path d={`M ${AXIS_X} ${BOOKS_Y + 40} L ${AXIS_X} ${FORM_Y - 40}`} stroke={COLORS.BORDER} strokeWidth={1.5} strokeDasharray="4 6" />
            <path d={`M ${AXIS_X} ${FORM_Y + 40} L ${AXIS_X} ${MACHINE_Y - 40}`} stroke={COLORS.BORDER} strokeWidth={1.5} strokeDasharray="4 6" />
            <path d={`M ${AXIS_X} ${RECORD_Y + 40} L ${AXIS_X} ${INBOX_Y - 40}`} stroke={COLORS.BORDER} strokeWidth={1.5} strokeDasharray="4 6" />
          </g>

          {/* ── Act 1: buku anggota — slot Adib kosong ── */}
          <g transform={T('booksShelf', AXIS_X, BOOKS_Y)} opacity={O('booksShelf')} filter="url(#shadow)">
            <rect x={-150} y={-58} width={300} height={116} rx={12} fill={COLORS.PANEL} stroke={COLORS.RECORD} strokeWidth={2} />
            <text x={0} y={-36} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="monospace" letterSpacing={1.5} fill={COLORS.RECORD}>{BOOKS_LABEL}</text>
            {[
              { id: 'user-a', name: 'USER A', mail: 'a@mail' },
              { id: 'user-b', name: 'USER B', mail: 'b@mail' },
            ].map((u, i) => (
              <g key={u.id} transform={`translate(${i * 96 - 96}, -8)`}>
                <rect x={-44} y={-22} width={88} height={44} rx={8} fill={COLORS.BG}
                  stroke={duplicateFound && i === 0 ? COLORS.PENDING : COLORS.BORDER} strokeWidth={duplicateFound && i === 0 ? 2.5 : 1.5} />
                <text x={0} y={-8} textAnchor="middle" fontSize={9} fontWeight={700} fontFamily="monospace" fill={COLORS.TEXT}>{u.name}</text>
                <text x={0} y={8} textAnchor="middle" fontSize={8} fontFamily="monospace" fill={COLORS.MUTED}>{u.mail}</text>
              </g>
            ))}
            <g transform="translate(96, -8)">
              <rect x={-44} y={-22} width={88} height={44} rx={8} fill="none" stroke={slotEmpty ? COLORS.FORM : COLORS.BORDER} strokeWidth={1.5} strokeDasharray="5 4" />
              <text x={0} y={-6} textAnchor="middle" fontSize={8} fontFamily="monospace" fill={slotEmpty ? COLORS.FORM : COLORS.MUTED}>ADIB</text>
              <text x={0} y={8} textAnchor="middle" fontSize={8} fontFamily="monospace" fill={slotEmpty ? COLORS.FORM : COLORS.MUTED}>— kosong —</text>
            </g>
          </g>

          {/* pintu login — redup, menolak (Act 1) */}
          <g transform={`translate(${AXIS_X + 250}, ${BOOKS_Y - 8})`} opacity={loginBlocked ? 1 : 0.5}>
            <rect x={-30} y={-26} width={60} height={52} rx={8} fill={COLORS.PANEL} stroke={loginBlocked ? COLORS.DENY : COLORS.BORDER} strokeWidth={2} />
            <circle cx={0} cy={-8} r={7} fill={COLORS.BG} stroke={loginBlocked ? COLORS.DENY : COLORS.MUTED} strokeWidth={1.5} />
            <rect x={-16} y={-3} width={32} height={22} rx={4} fill={COLORS.BG} stroke={loginBlocked ? COLORS.DENY : COLORS.MUTED} strokeWidth={1.5} />
            <text x={0} y={34} textAnchor="middle" fontSize={8} fontFamily="monospace" fill={COLORS.MUTED}>LOGIN</text>
            {loginBlocked && (
              <g transform={T('doorX', 0, -2)} opacity={O('doorX')}>
                <line x1={-10} y1={-10} x2={10} y2={10} stroke={COLORS.DENY} strokeWidth={2.5} strokeLinecap="round" />
                <line x1={10} y1={-10} x2={-10} y2={10} stroke={COLORS.DENY} strokeWidth={2.5} strokeLinecap="round" />
              </g>
            )}
          </g>

          {/* ── Act 1-2: loket form — tiga field ── */}
          <g transform={T('loketCard', AXIS_X, FORM_Y)} opacity={O('loketCard')} filter="url(#shadow)">
            <rect x={-130} y={-52} width={260} height={104} rx={12} fill={COLORS.PANEL} stroke={COLORS.FORM} strokeWidth={2} />
            <text x={0} y={-30} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="monospace" letterSpacing={1.5} fill={COLORS.FORM}>{FORM_LABEL}</text>
            {FIELDS.map((f, i) => (
              <g key={f.id} transform={T('field_' + f.id, 0, -14 + i * 26)} opacity={O('field_' + f.id)}>
                <rect x={-84} y={-10} width={168} height={20} rx={5} fill={COLORS.BG} stroke={fieldColor(f.id)} strokeWidth={1.5} />
                <text x={-70} y={4} textAnchor="middle" fontSize={8} fontFamily="monospace" fill={f.id === 'password' && !validAll ? COLORS.MUTED : COLORS.TEXT}>
                  {f.id === 'nama' ? 'Adib Pratama' : f.id === 'email' ? (emailInvalid || duplicateFound ? 'Adib@mail' : 'adib@adibdev.com') : '••••••••••'}
                </text>
                <text x={94} y={4} textAnchor="middle" fontSize={7} fontFamily="monospace" letterSpacing={1} fill={COLORS.MUTED}>{f.label.toUpperCase()}</text>
                {f.id === 'email' && emailInvalid && (
                  <g transform="translate(66, 0)">
                    <line x1={-5} y1={-5} x2={5} y2={5} stroke={COLORS.DENY} strokeWidth={2} strokeLinecap="round" />
                    <line x1={5} y1={-5} x2={-5} y2={5} stroke={COLORS.DENY} strokeWidth={2} strokeLinecap="round" />
                  </g>
                )}
              </g>
            ))}
            {validAll && (
              <g transform="translate(104, -22)">
                <circle r={10} fill={COLORS.SUCCESS} opacity={0.18} stroke={COLORS.SUCCESS} strokeWidth={2} />
                <path d="M -4 -1 L -1 3 L 5 -4" fill="none" stroke={COLORS.SUCCESS} strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
              </g>
            )}
          </g>

          {/* tombol kirim — validasi lolos */}
          {validAll && (
            <g transform={T('submitBtn', AXIS_X, FORM_Y + 84)} opacity={O('submitBtn')}>
              <rect x={-44} y={-16} width={88} height={32} rx={8} fill={COLORS.SUCCESS} opacity={0.16} stroke={COLORS.SUCCESS} strokeWidth={2} />
              <text x={0} y={5} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="monospace" fill={COLORS.SUCCESS}>KIRIM</text>
            </g>
          )}

          {/* ── Act 3: record akun — hash + status Pending ── */}
          <g transform={T('recordCard', AXIS_X, RECORD_Y)} opacity={O('recordCard')} filter="url(#shadow)">
            <rect x={-120} y={-40} width={240} height={80} rx={12} fill={COLORS.PANEL} stroke={pendingRecord ? COLORS.PENDING : COLORS.RECORD} strokeWidth={2} />
            <text x={0} y={-18} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="monospace" letterSpacing={1.5} fill={COLORS.RECORD}>{RECORD_LABEL}</text>
            <text x={-96} y={4} fontSize={9} fontFamily="monospace" fill={COLORS.TEXT}>adib@adibdev.com</text>
            <text x={-96} y={24} fontSize={9} fontFamily="monospace" fill={hashDone ? COLORS.CRYPTO : COLORS.MUTED}>{hashDone ? `${HASH_OUT.label} · ${SALT_CHIP.label}` : '— menunggu hash —'}</text>
            {pendingRecord && (
              <g transform="translate(96, 2)">
                <rect x={-40} y={-14} width={80} height={28} rx={8} fill={COLORS.BG} stroke={COLORS.PENDING} strokeWidth={2} />
                <text x={0} y={5} textAnchor="middle" fontSize={9} fontWeight={700} fontFamily="monospace" fill={COLORS.PENDING}>{PENDING_BADGE.label}</text>
              </g>
            )}
          </g>

          {/* ── Act 3: mesin hash — password + salt → hash ── */}
          <g transform={T('machineBox', AXIS_X, MACHINE_Y)} opacity={O('machineBox')} filter="url(#shadow)">
            <rect x={-118} y={-44} width={236} height={88} rx={12} fill={COLORS.PANEL} stroke={COLORS.CRYPTO} strokeWidth={2} strokeDasharray="6 4" />
            <text x={0} y={-22} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="monospace" letterSpacing={1.5} fill={COLORS.CRYPTO}>{MACHINE_LABEL}</text>
            <text x={-84} y={4} fontSize={8} fontFamily="monospace" fill={COLORS.MUTED}>input</text>
            <rect x={-96} y={-2} width={90} height={24} rx={5} fill={COLORS.BG} stroke={saltAdded ? COLORS.SUCCESS : COLORS.BORDER} strokeWidth={1.5} />
            {saltAdded && <text x={-50} y={14} textAnchor="middle" fontSize={8} fontFamily="monospace" fill={COLORS.SUCCESS}>{SALT_CHIP.label}</text>}
            <text x={84} y={4} textAnchor="middle" fontSize={8} fontFamily="monospace" fill={COLORS.MUTED}>output</text>
            <rect x={16} y={-2} width={82} height={24} rx={5} fill={COLORS.BG} stroke={hashDone ? COLORS.SUCCESS : COLORS.BORDER} strokeWidth={1.5} />
            {hashDone && <text x={57} y={14} textAnchor="middle" fontSize={8} fontWeight={700} fontFamily="monospace" fill={COLORS.SUCCESS}>{HASH_OUT.label}</text>}
            <path d="M -6 8 L 6 -8 M 2 8 L 14 -2" stroke={hashDone ? COLORS.SUCCESS : COLORS.BORDER} strokeWidth={1.5} strokeLinecap="round" />
          </g>

          {/* slip password — perjalanan form → mesin (carrier) */}
          {slipSent && (
            <g transform={`translate(${AXIS_X}, ${slipY})`} filter="url(#glow)">
              <rect x={-58} y={-18} width={116} height={36} rx={8} fill={COLORS.BG} stroke={COLORS.CRYPTO} strokeWidth={2.5} />
              <text x={0} y={5} textAnchor="middle" fontSize={9} fontWeight={700} fontFamily="monospace" fill={COLORS.CRYPTO}>PASSWORD ••••</text>
            </g>
          )}

          {/* ── Act 4: amplop verifikasi — record → inbox (hanya Act 4) ── */}
          {phaseIdx === 3 && !envArrived && (
            <Envelope x={AXIS_X} y={envY} color={COLORS.FORM} />
          )}
          {phaseIdx === 3 && envArrived && (
            <Envelope x={AXIS_X} y={INBOX_Y - 22} color={COLORS.SUCCESS} />
          )}

          {/* inbox Adib */}
          <g transform={T('inboxCard', AXIS_X, INBOX_Y)} opacity={O('inboxCard')} filter="url(#shadow)">
            <rect x={-110} y={-40} width={220} height={80} rx={12} fill={COLORS.PANEL} stroke={envArrived ? COLORS.SUCCESS : COLORS.FORM} strokeWidth={2} />
            <text x={0} y={-18} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="monospace" letterSpacing={1.5} fill={COLORS.FORM}>{INBOX_LABEL}</text>
            <rect x={-78} y={-4} width={156} height={26} rx={7} fill={COLORS.BG} stroke={envArrived ? COLORS.SUCCESS : COLORS.BORDER} strokeWidth={1.5} />
            <text x={0} y={13} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={envArrived ? COLORS.SUCCESS : COLORS.MUTED}>
              {envArrived ? '1 amplop verifikasi' : '— kosong —'}
            </text>
          </g>

          {/* ── CLOSING — cap payoff: hash tersimpan vs akun pending ── */}
          <g transform={T('closingStamps', AXIS_X, CLOSING_Y)} opacity={O('closingStamps')} filter="url(#glow)">
            <Stamp x={-140} y={0} color={COLORS.CRYPTO} top="HASH + SALT" sub="bukan teks password" />
            <Stamp x={140} y={0} color={COLORS.PENDING} top="PENDING" sub="email belum terbukti" />
          </g>

          {/* ── CAPTION — dekat zona aktif per Act ── */}
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