// src/content/20-email-verification/Animation.jsx
// ═══════════════════════════════════════════════════════════════════════════
// Implementasi Revisi-02 dengan efek Shake & Envelope Delivery Route:
//
// Alur utuh:
// Act 1: Login Pending (Password OK, Email unverified) → Shake Merah → Kirim link.
// Act 2: App Server → Handoff ke Delivery Provider → Delivered ke Inbox.
// Act 3: Buka Link → Verification Endpoint → Token Valid → Record Verified.
// Act 4: Login Ulang → Shake Hijau Login OK → Session Ticket → App Door Terbuka!
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, SFX_MAP,
  INTRO_CATEGORY_LABEL, INTRO_DOMAIN, INTRO_TITLE_A, INTRO_TITLE_B, INTRO_SUBTITLE,
  AXIS_X, TOP_Y, SERVER_Y, INBOX_Y, HANDOFF_Y, CAPTION_Y,
  RECORD_LABEL, SERVER_LABEL, PROVIDER_LABEL, INBOX_LABEL, GATE_LABEL, DOOR_LABEL,
  RECORD_EMAIL, MASKED_LINK, TOKEN_TTL, CAPTIONS,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'
import { IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1 } from '../../shared/scene-ui/v1'

export default function EmailVerificationAnimation({
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

  // ── Card Shake & Highlight States ──
  const [cardShakeX, setCardShakeX] = useState(0)
  const [cardGlowState, setCardGlowState] = useState(null) // 'deny' | 'success' | null
  const [doorScale, setDoorScale] = useState(1)

  // ── States Act 1 ──
  const [loginAttempt1, setLoginAttempt1] = useState(false)
  const [pwdCheck1, setPwdCheck1] = useState(false)
  const [emailCheck1, setEmailCheck1] = useState(false) // false = pending
  const [activationNeeded, setActivationNeeded] = useState(false)
  const [cmdSent, setCmdSent] = useState(false)

  // ── States Act 2 ──
  const [jobCreated, setJobCreated] = useState(false)
  const [smtpDispatch, setSmtpDispatch] = useState(false)
  const [providerReceived, setProviderReceived] = useState(false)
  const [mailDelivered, setMailDelivered] = useState(false)

  // Motion path amplop di Act 2
  // Phase 1: App Server (AXIS_X - 95, SERVER_Y + 45) -> Provider (AXIS_X + 155, SERVER_Y + 45)
  // Phase 2: Provider (AXIS_X + 155, SERVER_Y + 45) -> Inbox (AXIS_X - 95, INBOX_Y + 50)
  const [envPos, setEnvPos] = useState({ x: AXIS_X - 95, y: SERVER_Y + 45, opacity: 0 })

  // ── States Act 3 ──
  const [inboxOpened, setInboxOpened] = useState(false)
  const [clockTicking, setClockTicking] = useState(false)
  const [tokenAtEndpoint, setTokenAtEndpoint] = useState(false)
  const [recordVerified, setRecordVerified] = useState(false)
  const [tokenPos, setTokenPos] = useState({ x: AXIS_X - 95, y: INBOX_Y + 50, opacity: 0 })

  // ── States Act 4 ──
  const [reuseRejected, setReuseRejected] = useState(false)
  const [loginAttempt2, setLoginAttempt2] = useState(false)
  const [twoChecksPassed, setTwoChecksPassed] = useState(false)
  const [sessionIssued, setSessionIssued] = useState(false)
  const [doorOpen, setDoorOpen] = useState(false)

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

  const say = (tl, time, text) => tl.add(() => setCaption(text), time)

  // Shake Card Helper
  const animateShakeCard = (tl, time, type) => {
    // type: 'deny' (red) or 'success' (green)
    tl.add(() => setCardGlowState(type), time)
    const offsets = [0, -12, 12, -9, 9, -5, 5, -2, 2, 0]
    offsets.forEach((ox, idx) => {
      tl.to({ x: ox }, {
        x: ox,
        duration: 0.05,
        onUpdate: function() { setCardShakeX(this.targets()[0].x) },
      }, time + (idx * 0.05))
    })
  }

  useEffect(() => {
    const ctx = gsap.context(() => {
      const main = gsap.timeline({ paused: true })
      tlRef.current = main

      // ── INTRO MORPH (0 -> 1.2s) ──
      main.to({ p: 0 }, {
        p: 1, duration: 1.2, ease: 'power2.inOut',
        onUpdate: function () { setMorphP(this.targets()[0].p) },
      }, 0)
      main.to({ op: 0 }, {
        op: 1, duration: 0.4, ease: 'power1.out',
        onUpdate: function () { setHeaderOpacity(this.targets()[0].op) },
      }, 0)

      main.add(() => {
        flushSync(() => {
          setContentStarted(true)
          setPhaseIdx(0)
        })
      }, 1.2)

      // ═══════════════════════════════════════════════════════════════════════
      // ACT 1 — PASSWORD BENAR, EMAIL BELUM AKTIF (1.2s – 13.2s, budget 12s)
      // ═══════════════════════════════════════════════════════════════════════

      popIn(main, 1.3, 'adib-login-card', { sfxName: SFX_MAP.PLINK.name, sfxCategory: 'ui' })
      popIn(main, 1.6, 'account-record-pending', { sfxName: SFX_MAP.POP.name, sfxCategory: 'ui' })
      popIn(main, 1.9, 'app-door-locked', { sfxName: SFX_MAP.LOCK.name, sfxCategory: 'impacts' })

      // Adib mencoba login
      say(main, 2.5, CAPTIONS.PWD_CHECK)
      main.add(() => flushSync(() => setLoginAttempt1(true)), 2.5)

      // Password check hijau
      main.add(() => {
        sfxLoader.play('ui', SFX_MAP.TICK.name, { volume, speed })
        flushSync(() => setPwdCheck1(true))
      }, 4.0)

      // Email verified check merah / pending -> SHAKE MERAH!
      say(main, 5.5, CAPTIONS.EMAIL_NOT_ACTIVE)
      main.add(() => {
        sfxLoader.play('warnings', SFX_MAP.ALERT_PULSE.name, { volume, speed })
        flushSync(() => setEmailCheck1(false))
      }, 5.5)

      // Goyang Card Login dengan glow merah!
      animateShakeCard(main, 5.6, 'deny')

      // Door locked / activation required
      say(main, 8.0, CAPTIONS.ACTIVATION_REQ)
      main.add(() => flushSync(() => setActivationNeeded(true)), 8.0)

      // Kirim link aktivasi command
      say(main, 10.5, CAPTIONS.SEND_LINK_CMD)
      popIn(main, 10.5, 'btn-send-link', { sfxName: SFX_MAP.SNAP.name, sfxCategory: 'impacts' })
      main.add(() => flushSync(() => setCmdSent(true)), 11.5)

      // ═══════════════════════════════════════════════════════════════════════
      // ACT 2 — SERVER MENYERAHKAN EMAIL UNTUK DIKIRIM (13.2s – 27.2s, budget 14s)
      // ═══════════════════════════════════════════════════════════════════════

      main.add(() => {
        flushSync(() => setPhaseIdx(1))
      }, 13.2)

      say(main, 13.5, CAPTIONS.LINK_CREATED)
      popIn(main, 13.5, 'app-server', { sfxName: SFX_MAP.PLINK.name, sfxCategory: 'ui' })
      popIn(main, 14.5, 'token-job', { sfxName: SFX_MAP.CHIME.name, sfxCategory: 'ui' })
      main.add(() => flushSync(() => setJobCreated(true)), 14.5)

      // Server menyerahkan pesan via SMTP route ke Delivery Provider
      say(main, 16.5, CAPTIONS.SERVER_HANDOFF)
      popIn(main, 16.5, 'delivery-provider', { sfxName: SFX_MAP.POP2.name, sfxCategory: 'ui' })

      // Amplop muncul di App Server dan bergerak horizontal ke Delivery Provider
      main.add(() => {
        sfxLoader.play('transitions', SFX_MAP.LIGHT_SWOOSH.name, { volume, speed })
        flushSync(() => {
          setSmtpDispatch(true)
          setEnvPos({ x: AXIS_X - 95, y: SERVER_Y + 45, opacity: 1 })
        })
      }, 17.0)

      // Motion 1: App Server (x: AXIS_X - 95) -> Delivery Provider (x: AXIS_X + 155)
      const moveH = { x: AXIS_X - 95 }
      main.to(moveH, {
        x: AXIS_X + 155, duration: 1.8, ease: 'power2.inOut',
        onUpdate: () => setEnvPos(prev => ({ ...prev, x: moveH.x })),
      }, 17.2)

      say(main, 19.5, CAPTIONS.PROVIDER_ROUTE)
      main.add(() => {
        sfxLoader.play('impacts', SFX_MAP.SNAP.name, { volume, speed })
        flushSync(() => setProviderReceived(true))
      }, 19.5)

      // Deliver amplop ke inbox
      say(main, 22.5, CAPTIONS.EMAIL_ARRIVED)
      popIn(main, 22.5, 'inbox-card', { sfxName: SFX_MAP.TELEPORT.name, sfxCategory: 'transitions' })

      // Motion 2: Delivery Provider (x: AXIS_X + 155, y: SERVER_Y + 45) -> Inbox Adib (x: AXIS_X - 95, y: INBOX_Y + 45)
      const moveV = { x: AXIS_X + 155, y: SERVER_Y + 45 }
      main.to(moveV, {
        x: AXIS_X - 95, y: INBOX_Y + 45, duration: 2.2, ease: 'power2.inOut',
        onStart: () => sfxLoader.play('transitions', SFX_MAP.WHOOSH.name, { volume, speed }),
        onUpdate: () => setEnvPos({ x: moveV.x, y: moveV.y, opacity: 1 }),
      }, 23.0)

      main.add(() => flushSync(() => setMailDelivered(true)), 25.3)

      // ═══════════════════════════════════════════════════════════════════════
      // ACT 3 — LINK DIUJI SEKALI & BERBATAS WAKTU (27.2s – 40.2s, budget 13s)
      // ═══════════════════════════════════════════════════════════════════════

      main.add(() => {
        flushSync(() => setPhaseIdx(2))
      }, 27.2)

      say(main, 27.5, CAPTIONS.OPEN_LINK)
      main.add(() => flushSync(() => setInboxOpened(true)), 27.5)
      popIn(main, 28.0, 'link-card-inbox', { sfxName: SFX_MAP.CHIME.name, sfxCategory: 'ui' })

      // Expiry clock
      say(main, 30.5, CAPTIONS.LINK_EXPIRY)
      main.add(() => {
        sfxLoader.play('ui', SFX_MAP.NUMBER_TALLY.name, { volume, speed })
        flushSync(() => setClockTicking(true))
      }, 30.5)

      // Klik link -> token menuju Verification Endpoint (Inbox x: AXIS_X - 95 -> Endpoint x: AXIS_X + 155)
      say(main, 33.5, CAPTIONS.TOKEN_CHECK)
      popIn(main, 33.5, 'verification-endpoint', { sfxName: SFX_MAP.PLINK.name, sfxCategory: 'ui' })

      main.add(() => setTokenPos({ x: AXIS_X - 95, y: INBOX_Y + 45, opacity: 1 }), 33.5)

      const moveTok = { x: AXIS_X - 95 }
      main.to(moveTok, {
        x: AXIS_X + 155, duration: 1.8, ease: 'power2.inOut',
        onUpdate: () => setTokenPos(prev => ({ ...prev, x: moveTok.x })),
      }, 33.7)

      main.add(() => flushSync(() => setTokenAtEndpoint(true)), 35.5)

      // Token cocok -> consumed -> Account record Pending -> Verified!
      say(main, 36.5, CAPTIONS.TOKEN_CONSUMED)
      main.add(() => {
        sfxLoader.play('success', SFX_MAP.SHIMMER.name, { volume, speed })
        flushSync(() => setRecordVerified(true))
      }, 37.0)

      // ═══════════════════════════════════════════════════════════════════════
      // ACT 4 — LOGIN YANG SAMA KINI BERHASIL (40.2s – 51.2s, budget 11s)
      // ═══════════════════════════════════════════════════════════════════════

      main.add(() => {
        flushSync(() => setPhaseIdx(3))
      }, 40.2)

      say(main, 40.5, CAPTIONS.EMAIL_ACTIVE)
      popIn(main, 40.5, 'account-record-verified', { sfxName: SFX_MAP.SHIMMER.name, sfxCategory: 'success' })

      // Uji coba link bekas -> ditolak (Spent)
      say(main, 42.5, CAPTIONS.REUSE_DENIED)
      main.add(() => {
        sfxLoader.play('warnings', SFX_MAP.ALERT_PULSE.name, { volume, speed })
        flushSync(() => setReuseRejected(true))
      }, 43.0)

      // Adib login ulang dengan password & email_verified OK
      say(main, 45.0, CAPTIONS.TWO_CHECKS)
      main.add(() => flushSync(() => setLoginAttempt2(true)), 45.0)

      // Login check OK -> GOYANG HIJAU + SHIMMER SFX!
      main.add(() => {
        sfxLoader.play('success', SFX_MAP.SHIMMER.name, { volume, speed })
        flushSync(() => setTwoChecksPassed(true))
      }, 46.2)

      // Shake Form Login dengan glow hijau!
      animateShakeCard(main, 46.3, 'success')

      // Session ticket diterbitkan & Pintu Terbuka!
      say(main, 48.0, CAPTIONS.WELCOME_DOOR)
      popIn(main, 48.0, 'session-ticket', { sfxName: SFX_MAP.CHIME.name, sfxCategory: 'ui' })
      main.add(() => {
        sfxLoader.play('success', SFX_MAP.RELIEF.name, { volume, speed })
        flushSync(() => {
          setSessionIssued(true)
          setDoorOpen(true)
        })
      }, 48.5)

      // Door unlock pulse animation
      const doorObj = { s: 1 }
      main.to(doorObj, {
        s: 1.15, duration: 0.25, yoyo: true, repeat: 1, ease: 'back.out(2)',
        onUpdate: () => setDoorScale(doorObj.s),
      }, 48.5)

    }, svgRef)

    return () => ctx.revert()
  }, [volume, speed])

  useEffect(() => {
    const tl = tlRef.current
    if (!tl) return
    if (paused) tl.pause()
    else tl.play()
  }, [paused])

  useEffect(() => {
    const tl = tlRef.current
    if (tl) tl.timeScale(speed)
  }, [speed])

  const curPhase = PHASES[phaseIdx] || PHASES[0]

  return (
    <svg
      ref={svgRef}
      viewBox={`0 0 ${VW} ${VH}`}
      style={{ width: '100%', height: '100%', background: COLORS.BG }}
    >
      <defs>
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="glow-strong" x="-30%" y="-30%" width="160%" height="160%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
        <filter id="glow-deny" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor={COLORS.DENY} floodOpacity="0.8" />
        </filter>
        <filter id="glow-success" x="-30%" y="-30%" width="160%" height="160%">
          <feDropShadow dx="0" dy="0" stdDeviation="6" floodColor={COLORS.SUCCESS} floodOpacity="0.8" />
        </filter>
      </defs>

      {/* ── HEADER MORPH & NAVIGATOR (scene-ui V1) ── */}
      {headerOpacity > 0 && (
        <g opacity={headerOpacity}>
          <IntroHeaderMorphV1
            progress={morphP}
            categorySegments={[
              { label: INTRO_CATEGORY_LABEL + ' · ', color: COLORS.MUTED },
              { label: INTRO_DOMAIN, color: COLORS.SYSTEM },
            ]}
            titleSegments={[
              { label: INTRO_TITLE_A, color: COLORS.EMAIL },
              { label: INTRO_TITLE_B, color: COLORS.SUCCESS },
            ]}
            subtitle={INTRO_SUBTITLE}
            titleFilter="url(#glow)"
            testId="email-intro-header"
          />
        </g>
      )}

      {contentStarted && (
        <g>
          <ActBadgeNavigatorV1
            phases={PHASES}
            activeIndex={phaseIdx}
            testId="email-act-navigator"
          />

          <ContentBodyV1 testId="email-content-body">

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* CONNECTING ARROWS & PATH LINES                                  */}
            {/* ═══════════════════════════════════════════════════════════════ */}

            {/* Route 1: App Server -> Delivery Provider (Horizontal) */}
            {jobCreated && (
              <g opacity={0.7}>
                <line x1={AXIS_X - 10} y1={SERVER_Y + 45} x2={AXIS_X + 60} y2={SERVER_Y + 45} stroke={COLORS.PROVIDER} strokeWidth={2} strokeDasharray="4 3" />
                <polygon points={`${AXIS_X + 60},${SERVER_Y + 45} ${AXIS_X + 52},${SERVER_Y + 40} ${AXIS_X + 52},${SERVER_Y + 50}`} fill={COLORS.PROVIDER} />
              </g>
            )}

            {/* Route 2: Delivery Provider -> Inbox Adib (Down & Left) */}
            {providerReceived && (
              <g opacity={0.7}>
                <path d={`M ${AXIS_X + 155} ${SERVER_Y + 90} C ${AXIS_X + 155} ${INBOX_Y - 20}, ${AXIS_X - 95} ${SERVER_Y + 90}, ${AXIS_X - 95} ${INBOX_Y}`} fill="none" stroke={COLORS.EMAIL} strokeWidth={2} strokeDasharray="4 3" />
                <polygon points={`${AXIS_X - 95},${INBOX_Y} ${AXIS_X - 100},${INBOX_Y - 8} ${AXIS_X - 90},${INBOX_Y - 8}`} fill={COLORS.EMAIL} />
              </g>
            )}

            {/* Route 3: Inbox Adib -> Verification Endpoint (Horizontal) */}
            {inboxOpened && (
              <g opacity={0.7}>
                <line x1={AXIS_X - 10} y1={INBOX_Y + 45} x2={AXIS_X + 60} y2={INBOX_Y + 45} stroke={COLORS.TOKEN} strokeWidth={2} strokeDasharray="4 3" />
                <polygon points={`${AXIS_X + 60},${INBOX_Y + 45} ${AXIS_X + 52},${INBOX_Y + 40} ${AXIS_X + 52},${INBOX_Y + 50}`} fill={COLORS.TOKEN} />
              </g>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* ZONA 1 (TOP_Y = 25): Adib, Login Form, Account Record, App Door  */}
            {/* ═══════════════════════════════════════════════════════════════ */}

            {/* Account Record Card */}
            {P('account-record-pending').scale > 0 && (
              <g transform={`translate(${AXIS_X - 230}, ${TOP_Y}) scale(${P('account-record-pending').scale})`} opacity={P('account-record-pending').opacity}>
                <rect x={0} y={0} width={180} height={110} rx={10} fill={COLORS.PANEL} stroke={recordVerified ? COLORS.SUCCESS : COLORS.BORDER} strokeWidth={recordVerified ? 2 : 1} filter={recordVerified ? 'url(#glow)' : undefined} />
                <text x={12} y={22} fill={COLORS.MUTED} fontSize={10} fontWeight={700} fontFamily="monospace" letterSpacing={1}>{RECORD_LABEL}</text>

                <text x={12} y={46} fill={COLORS.TEXT} fontSize={12} fontWeight={700} fontFamily="monospace">{RECORD_EMAIL}</text>

                {/* Status Badge */}
                <rect x={12} y={60} width={156} height={24} rx={6} fill={recordVerified ? '#065F46' : '#78350F'} opacity={0.9} />
                <text x={90} y={76} textAnchor="middle" fill={recordVerified ? COLORS.SUCCESS : COLORS.PENDING} fontSize={11} fontWeight={800} fontFamily="monospace">
                  {recordVerified ? '✓ VERIFIED' : '⏳ PENDING'}
                </text>

                <text x={12} y={98} fill={COLORS.MUTED} fontSize={9} fontFamily="sans-serif">
                  {recordVerified ? 'email_verified: true' : 'email_verified: false'}
                </text>
              </g>
            )}

            {/* Adib Login Form (Shakable with Red/Green Glow) */}
            {P('adib-login-card').scale > 0 && (
              <g
                transform={`translate(${AXIS_X - 30 + cardShakeX}, ${TOP_Y}) scale(${P('adib-login-card').scale})`}
                opacity={P('adib-login-card').opacity}
              >
                <rect
                  x={0} y={0} width={200} height={110} rx={10}
                  fill={COLORS.PANEL}
                  stroke={cardGlowState === 'deny' ? COLORS.DENY : (cardGlowState === 'success' ? COLORS.SUCCESS : COLORS.BORDER)}
                  strokeWidth={cardGlowState ? 2.5 : 1}
                  filter={cardGlowState === 'deny' ? 'url(#glow-deny)' : (cardGlowState === 'success' ? 'url(#glow-success)' : undefined)}
                />
                <text x={12} y={22} fill={cardGlowState === 'success' ? COLORS.SUCCESS : COLORS.EMAIL} fontSize={11} fontWeight={800} fontFamily="monospace">FORM LOGIN ADIB</text>

                {/* Field Password Check */}
                <rect x={12} y={32} width={176} height={20} rx={4} fill="#1E293B" />
                <text x={20} y={46} fill={COLORS.TEXT} fontSize={10} fontFamily="monospace">Password: ********</text>
                {(loginAttempt1 || loginAttempt2) && (
                  <text x={175} y={46} textAnchor="end" fill={COLORS.SUCCESS} fontSize={11} fontWeight={900}>✓</text>
                )}

                {/* Field Email Verified Check */}
                <rect x={12} y={56} width={176} height={20} rx={4} fill="#1E293B" />
                <text x={20} y={70} fill={COLORS.TEXT} fontSize={10} fontFamily="monospace">Email Active?</text>
                {(loginAttempt1 || loginAttempt2) && (
                  <text x={175} y={70} textAnchor="end" fill={recordVerified ? COLORS.SUCCESS : COLORS.DENY} fontSize={11} fontWeight={900}>
                    {recordVerified ? '✓' : '✕'}
                  </text>
                )}

                {/* Result Status */}
                <text x={12} y={96} fill={twoChecksPassed ? COLORS.SUCCESS : (loginAttempt1 ? COLORS.DENY : COLORS.MUTED)} fontSize={10} fontWeight={800} fontFamily="monospace">
                  {twoChecksPassed ? 'STATUS: LOGIN OK! ✓' : (loginAttempt1 ? 'STATUS: PENDING (GAGAL) ✕' : 'STATUS: IDLE')}
                </text>
              </g>
            )}

            {/* App Door */}
            {P('app-door-locked').scale > 0 && (
              <g transform={`translate(${AXIS_X + 190}, ${TOP_Y}) scale(${P('app-door-locked').scale * doorScale})`} opacity={P('app-door-locked').opacity}>
                <rect x={0} y={0} width={95} height={110} rx={8} fill={doorOpen ? '#064E3B' : COLORS.PANEL} stroke={doorOpen ? COLORS.SUCCESS : COLORS.BORDER} strokeWidth={doorOpen ? 2.5 : 1} filter={doorOpen ? 'url(#glow-success)' : undefined} />
                <text x={47} y={22} textAnchor="middle" fill={doorOpen ? COLORS.SUCCESS : COLORS.MUTED} fontSize={10} fontWeight={800} fontFamily="monospace">{DOOR_LABEL}</text>

                <circle cx={47} cy={55} r={18} fill="#1E293B" stroke={doorOpen ? COLORS.SUCCESS : COLORS.MUTED} strokeWidth={1.5} />
                <text x={47} y={60} textAnchor="middle" fontSize={16}>{doorOpen ? '🔓' : '🔒'}</text>

                <text x={47} y={94} textAnchor="middle" fill={doorOpen ? COLORS.SUCCESS : COLORS.DENY} fontSize={10} fontWeight={800} fontFamily="monospace">
                  {doorOpen ? 'OPEN' : 'LOCKED'}
                </text>
              </g>
            )}

            {/* Action CTA Button: Kirim Link Aktivasi (Act 1) */}
            {activationNeeded && P('btn-send-link').scale > 0 && (
              <g transform={`translate(${AXIS_X - 30}, ${TOP_Y + 122}) scale(${P('btn-send-link').scale})`} opacity={P('btn-send-link').opacity}>
                <rect x={0} y={0} width={200} height={26} rx={6} fill={cmdSent ? '#065F46' : '#2563EB'} filter="url(#glow)" />
                <text x={100} y={17} textAnchor="middle" fill="#FFFFFF" fontSize={10} fontWeight={800} fontFamily="monospace">
                  {cmdSent ? '✓ LINK DIKIRIM' : '📩 KIRIM LINK AKTIVASI'}
                </text>
              </g>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* ZONA 2 (SERVER_Y = 195): App Server & Email Delivery Provider   */}
            {/* ═══════════════════════════════════════════════════════════════ */}

            {/* App Server */}
            {P('app-server').scale > 0 && (
              <g transform={`translate(${AXIS_X - 180}, ${SERVER_Y}) scale(${P('app-server').scale})`} opacity={P('app-server').opacity}>
                <rect x={0} y={0} width={170} height={90} rx={10} fill={COLORS.PANEL} stroke={COLORS.EMAIL} strokeWidth={1.5} />
                <text x={12} y={22} fill={COLORS.EMAIL} fontSize={11} fontWeight={800} fontFamily="monospace">{SERVER_LABEL}</text>

                <rect x={12} y={34} width={146} height={20} rx={4} fill="#1E293B" />
                <text x={20} y={48} fill={COLORS.MUTED} fontSize={9} fontFamily="monospace">Token: {MASKED_LINK}</text>

                <rect x={12} y={58} width={146} height={20} rx={4} fill="#1E293B" />
                <text x={20} y={72} fill={COLORS.MUTED} fontSize={9} fontFamily="monospace">TTL: {TOKEN_TTL}</text>
              </g>
            )}

            {/* Delivery Provider */}
            {P('delivery-provider').scale > 0 && (
              <g transform={`translate(${AXIS_X + 60}, ${SERVER_Y}) scale(${P('delivery-provider').scale})`} opacity={P('delivery-provider').opacity}>
                <rect x={0} y={0} width={190} height={90} rx={10} fill={COLORS.PANEL} stroke={COLORS.PROVIDER} strokeWidth={1.5} />
                <text x={12} y={22} fill={COLORS.PROVIDER} fontSize={11} fontWeight={800} fontFamily="monospace">{PROVIDER_LABEL}</text>

                <rect x={12} y={34} width={166} height={20} rx={4} fill="#1E293B" />
                <text x={20} y={48} fill={COLORS.MUTED} fontSize={9} fontFamily="monospace">Route: SMTP / API</text>

                <rect x={12} y={58} width={166} height={20} rx={4} fill="#1E293B" />
                <text x={20} y={72} fill={providerReceived ? COLORS.SUCCESS : COLORS.MUTED} fontSize={9} fontWeight={700} fontFamily="monospace">
                  {providerReceived ? '✓ EMAIL JOB ACCEPTED' : 'READY TO DISPATCH'}
                </text>
              </g>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* ZONA 3 (INBOX_Y = 365): Envelope, Inbox Adib & Endpoint         */}
            {/* ═══════════════════════════════════════════════════════════════ */}

            {/* Motion Envelope traveling */}
            {envPos.opacity > 0 && (
              <g transform={`translate(${envPos.x}, ${envPos.y})`} opacity={envPos.opacity}>
                <rect x={-25} y={-17} width={50} height={34} rx={6} fill={COLORS.EMAIL} stroke="#FFFFFF" strokeWidth={1.5} filter="url(#glow)" />
                <path d="M -25 -17 L 0 0 L 25 -17" fill="none" stroke="#0F172A" strokeWidth={1.5} />
                <text x={0} y={10} textAnchor="middle" fill="#0F172A" fontSize={9} fontWeight={900} fontFamily="monospace">LINK</text>
              </g>
            )}

            {/* Motion Token Traveling to Endpoint (Act 3) */}
            {tokenPos.opacity > 0 && !tokenAtEndpoint && (
              <g transform={`translate(${tokenPos.x}, ${tokenPos.y})`} opacity={tokenPos.opacity}>
                <rect x={-30} y={-14} width={60} height={28} rx={6} fill={COLORS.TOKEN} stroke="#FFFFFF" strokeWidth={1.5} filter="url(#glow)" />
                <text x={0} y={4} textAnchor="middle" fill="#0F172A" fontSize={8} fontWeight={900} fontFamily="monospace">{MASKED_LINK}</text>
              </g>
            )}

            {/* Inbox Adib */}
            {P('inbox-card').scale > 0 && (
              <g transform={`translate(${AXIS_X - 180}, ${INBOX_Y}) scale(${P('inbox-card').scale})`} opacity={P('inbox-card').opacity}>
                <rect x={0} y={0} width={170} height={100} rx={10} fill={COLORS.PANEL} stroke={COLORS.EMAIL} strokeWidth={1.5} />
                <text x={12} y={22} fill={COLORS.EMAIL} fontSize={11} fontWeight={800} fontFamily="monospace">{INBOX_LABEL}</text>

                <rect x={12} y={34} width={146} height={54} rx={6} fill="#1E293B" stroke={inboxOpened ? COLORS.TOKEN : COLORS.BORDER} strokeWidth={1} />
                <text x={20} y={50} fill={COLORS.TEXT} fontSize={10} fontWeight={700} fontFamily="monospace">📩 Verifikasi Akun</text>
                <text x={20} y={66} fill={COLORS.MUTED} fontSize={9} fontFamily="sans-serif">Dari: App Server</text>
                <text x={20} y={80} fill={COLORS.TOKEN} fontSize={9} fontWeight={700} fontFamily="monospace">[{MASKED_LINK}]</text>
              </g>
            )}

            {/* Verification Endpoint */}
            {P('verification-endpoint').scale > 0 && (
              <g transform={`translate(${AXIS_X + 60}, ${INBOX_Y}) scale(${P('verification-endpoint').scale})`} opacity={P('verification-endpoint').opacity}>
                <rect x={0} y={0} width={190} height={100} rx={10} fill={COLORS.PANEL} stroke={recordVerified ? COLORS.SUCCESS : COLORS.TOKEN} strokeWidth={1.5} />
                <text x={12} y={22} fill={COLORS.TOKEN} fontSize={11} fontWeight={800} fontFamily="monospace">{GATE_LABEL}</text>

                <rect x={12} y={34} width={166} height={22} rx={4} fill="#1E293B" />
                <text x={20} y={49} fill={COLORS.MUTED} fontSize={9} fontFamily="monospace">TTL Check: {TOKEN_TTL} (Valid)</text>

                <rect x={12} y={62} width={166} height={26} rx={4} fill={recordVerified ? '#065F46' : '#1E293B'} />
                <text x={95} y={79} textAnchor="middle" fill={recordVerified ? COLORS.SUCCESS : COLORS.TOKEN} fontSize={10} fontWeight={800} fontFamily="monospace">
                  {recordVerified ? '✓ TOKEN CONSUMED' : 'CHECKING TOKEN…'}
                </text>
              </g>
            )}

            {/* Spent token retry rejection notice */}
            {reuseRejected && (
              <g transform={`translate(${AXIS_X + 60}, ${INBOX_Y + 110})`}>
                <rect x={0} y={0} width={190} height={24} rx={6} fill="#881337" stroke={COLORS.DENY} strokeWidth={1} filter="url(#glow-deny)" />
                <text x={95} y={16} textAnchor="middle" fill="#FFE4E6" fontSize={10} fontWeight={800} fontFamily="monospace">
                  ✕ LINK BEKAS: REJECTED (SPENT)
                </text>
              </g>
            )}

            {/* ═══════════════════════════════════════════════════════════════ */}
            {/* ZONA 4 (HANDOFF_Y = 525): Session Ticket                         */}
            {/* ═══════════════════════════════════════════════════════════════ */}

            {sessionIssued && P('session-ticket').scale > 0 && (
              <g transform={`translate(${AXIS_X - 100}, ${HANDOFF_Y}) scale(${P('session-ticket').scale})`} opacity={P('session-ticket').opacity}>
                <rect x={0} y={0} width={200} height={40} rx={8} fill="#065F46" stroke={COLORS.SUCCESS} strokeWidth={1.5} filter="url(#glow-strong)" />
                <text x={100} y={25} textAnchor="middle" fill="#FFFFFF" fontSize={12} fontWeight={900} fontFamily="monospace">
                  🎟 SESSION TICKET ISSUED
                </text>
              </g>
            )}

            {/* ── CAPTION BAR (Floating bottom - Y=595) ── */}
            {caption && (
              <g transform={`translate(${AXIS_X - 250}, ${CAPTION_Y})`}>
                <rect x={0} y={0} width={500} height={32} rx={6} fill="#0F172A" opacity={0.92} stroke={COLORS.BORDER} strokeWidth={1} />
                <text x={250} y={20} textAnchor="middle" fill={COLORS.TEXT} fontSize={12} fontWeight={700} fontFamily="monospace">
                  {caption}
                </text>
              </g>
            )}

          </ContentBodyV1>
        </g>
      )}
    </svg>
  )
}
