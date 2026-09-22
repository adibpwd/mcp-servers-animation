// ═══════════════════════════════════════════════════════════════════════════
// src/content/18-auth/Animation.jsx
// ─────────────────────────────────────────────────────────────────────────
// Eksekusi sesuai src/content/18-auth/_docs/AUTH_PLAN.md (2026-09-12).
// Empat Act. Scene UI V1 penuh sesuai deklarasi plan §7: IntroHeaderMorphV1
// + ActBadgeNavigatorV1 (di luar body) dan ContentBodyV1 (semua child body
// memakai koordinat lokal, origin body 44,235). Diskusi keputusan lintas
// Act & alignment standardisasi di _docs/AUTH_PLAN.md §7 & §13.
// Cerita: Adib membawa paket (callback dari 17-rest-api) ke Gedung
// Arsip — alamat benar, tapi identitas dibuktikan (authentication)
// sebelum akses lemari diputuskan terpisah (authorization).
//
// STATUS: first pass + align ContentBodyV1. Menunggu preview manual &
// export MP4. Registry tetap coming-soon sesuai AUTH_PLAN.md §13
// (dinyalakan presisi hanya setelah QA/export lolos).
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, SFX_MAP,
  INTRO_CATEGORY_LABEL, INTRO_DOMAIN, INTRO_TITLE_A, INTRO_TITLE_B, INTRO_SUBTITLE,
  AXIS_X, GATE_Y, KIOSK_Y, BRANCH_Y, BRANCH_CARD_Y, SESSION_PATH_X, TOKEN_PATH_X,
  GUARD_Y, LOCKER_Y, IZIN_CAP_Y, CLOSING_Y, CAPTION_Y,
  BUILDING_LABEL, KIOSK_LABEL,
  CREDENTIAL, HASH_RECORD, SESSION, TOKEN_CLAIMS, ACCESS_POLICY,
  CAPTIONS,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'
import { IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1 } from '../../shared/scene-ui/v1'

export default function AuthAnimation({
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

  // ── header — hero-to-header morph, sama pola dengan 17-rest-api ──
  const [morphP, setMorphP] = useState(0)
  const [headerOpacity, setHeaderOpacity] = useState(0)
  const [contentStarted, setContentStarted] = useState(false)

  // ── Act 1 — gerbang & identitas belum terbukti ──
  const [buildingOpacity, setBuildingOpacity] = useState(0.3)
  const [gateBlocked, setGateBlocked] = useState(false)
  const [adibY, setAdibY] = useState(GATE_Y)

  // ── Act 2 — login, plaintext leak, hash+salt ──
  const [plaintextVisible, setPlaintextVisible] = useState(false)
  const [leakFlash, setLeakFlash] = useState(false)
  const [hashOutput, setHashOutput] = useState(null) // null | HASH_RECORD
  const [identityValid, setIdentityValid] = useState(false)

  // ── Act 3 — cabang session vs token ──
  const [branchVisible, setBranchVisible] = useState(false)
  const [sessionIssued, setSessionIssued] = useState(false)
  const [sessionCheckPct, setSessionCheckPct] = useState(0) // 0..1 pulang-pergi
  const [tokenIssued, setTokenIssued] = useState(false)
  const [tokenSignatureOn, setTokenSignatureOn] = useState(false)
  const [jwtNoteVisible, setJwtNoteVisible] = useState(false)

  // ── Act 4 — authorization ──
  const [lockerUmumOpen, setLockerUmumOpen] = useState(false)
  const [lockerRahasiaPulse, setLockerRahasiaPulse] = useState(false)
  const [permissionChecked, setPermissionChecked] = useState(false)
  // label mikro HTTP opsional (plan §9 Act 4) — ditempel dekat elemen,
  // bukan bar teks lebar: 401 = konteks login (Act 2), 403 = lemari rahasia (Act 4).
  const [http401Visible, setHttp401Visible] = useState(false)
  const [http403Visible, setHttp403Visible] = useState(false)

  const P = (id) => pop[id] || { scale: 0, opacity: 0, x: 0, y: 0 }

  useEffect(() => {
    const shouldEnable = previewSfx && audioUnlocked
    sfxLoader.setEnabled(shouldEnable)
    audioUnlockedRef.current = audioUnlocked
    volumeRef.current = volume
    speedRef.current = speed
  }, [previewSfx, audioUnlocked, volume, speed])

  // ── helper pop-in/pop-out/morph — identik pola 17-rest-api ──
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
  // MASTER TIMELINE — empat Act, ±50s total (intro 1.2s + 9+13+15+12s)
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
      setBuildingOpacity(0.3); setGateBlocked(false); setAdibY(GATE_Y)
      setPlaintextVisible(false); setLeakFlash(false); setHashOutput(null); setIdentityValid(false)
      setBranchVisible(false); setSessionIssued(false); setSessionCheckPct(0)
      setTokenIssued(false); setTokenSignatureOn(false); setJwtNoteVisible(false)
      setLockerUmumOpen(false); setLockerRahasiaPulse(false); setPermissionChecked(false)
      setHttp401Visible(false); setHttp403Visible(false)
      setPop({}); setCaption('')
    }, t)

    // ═══════════════ INTRO — hero centered → header ════════════════
    t += 0.2
    const mo = { p: 0 }
    tl.to(mo, { p: 1, duration: 0.8, ease: 'power3.inOut', onUpdate: () => setMorphP(mo.p) }, t)
    sfxOn(tl, t, () => sfxLoader.transition(SFX_MAP.TELEPORT.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 0.8
    tl.add(() => setContentStarted(true), t)

    // ═══════════════ ACT 1 — Paket Tepat, Orang Belum Terbukti (±9s) ════
    tl.add(() => setPhaseIdx(0), t)
    popIn(tl, t + 0.05, 'building', { fromY: -10, sfx: false })
    tl.add(() => setBuildingOpacity(0.5), t + 0.05)
    popIn(tl, t + 0.3, 'adib', { fromX: -30 })
    popIn(tl, t + 0.3, 'paket', { fromX: -30 })
    say(tl, t + 0.35, CAPTIONS.ARRIVAL)
    t += 1.6
    tl.add(() => setGateBlocked(true), t)
    sfxOn(tl, t, () => sfxLoader.impact(SFX_MAP.LOCK.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t + 0.05, CAPTIONS.BLOCKED)
    popIn(tl, t + 0.1, 'warnPulse', { sfx: false })
    t += 2.0
    popOut(tl, t, 'warnPulse')
    popIn(tl, t + 0.1, 'kiosk', { fromY: 16 })
    say(tl, t + 0.15, CAPTIONS.POINT_KIOSK)
    t += 1.8
    const adibAtKiosk = travel(tl, t, setAdibY, GATE_Y, KIOSK_Y, 1.0, 'power1.inOut')
    sfxOn(tl, t, () => sfxLoader.transition(SFX_MAP.WHOOSH.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, adibAtKiosk + 0.05, CAPTIONS.AT_KIOSK)
    let act1End = adibAtKiosk + 0.9

    // ═══════════════ ACT 2 — Password Tidak Disimpan Utuh (±13s) ════════
    tl.add(() => setPhaseIdx(1), act1End)
    popIn(tl, act1End + 0.1, 'loginForm', {})
    // mikro-label 401 — konteks login: kredensial belum informatif tanpa bukti
    tl.add(() => setHttp401Visible(true), act1End + 0.5)
    tl.add(() => setPlaintextVisible(true), act1End + 0.6)
    sfxOn(tl, act1End + 0.6, () => sfxLoader.ui(SFX_MAP.TICK.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, act1End + 0.65, CAPTIONS.PLAINTEXT_WARN)
    let t2 = act1End + 2.0
    tl.add(() => setLeakFlash(true), t2)
    sfxOn(tl, t2, () => sfxLoader.warning(SFX_MAP.ALERT_PULSE.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t2 + 0.05, CAPTIONS.LEAK)
    t2 += 1.2
    tl.add(() => { setLeakFlash(false); setPlaintextVisible(false) }, t2)
    popIn(tl, t2 + 0.1, 'hashMachine', { fromY: 12 })
    t2 += 1.5
    tl.add(() => setHashOutput({ salt: HASH_RECORD.salt, hash: '••••' }), t2)
    sfxOn(tl, t2, () => sfxLoader.transition(SFX_MAP.SWOOSH.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t2 + 0.05, CAPTIONS.HASH_ONE_WAY)
    t2 += 1.6
    tl.add(() => setHashOutput({ salt: HASH_RECORD.salt, hash: HASH_RECORD.hash }), t2)
    popIn(tl, t2 + 0.1, 'validStamp', { sfxName: SFX_MAP.DING.name })
    sfxOn(tl, t2, () => sfxLoader.success(SFX_MAP.CONFIRM.name, { volume: volumeRef.current, speed: speedRef.current }))
    tl.add(() => setIdentityValid(true), t2 + 0.1)
    say(tl, t2 + 0.15, CAPTIONS.HASH_MATCH)
    t2 += 1.6
    popOut(tl, t2, 'loginForm')
    popOut(tl, t2, 'hashMachine')
    // identitas terbukti → label 401 tidak relevan lagi untuk Act berikut
    tl.add(() => setHttp401Visible(false), t2)
    let act2End = t2 + 0.6

    // ═══════════════ ACT 3 — Bukti Login Bisa Dua Bentuk (±15s) ═════════
    tl.add(() => setPhaseIdx(2), act2End)
    tl.add(() => setBranchVisible(true), act2End + 0.1)
    say(tl, act2End + 0.15, CAPTIONS.BRANCH_SETUP)
    let t3 = act2End + 1.6
    // Session — kartu bernomor terbit, cek pulang-pergi ke resepsionis
    popIn(tl, t3, 'sessionCard', { fromX: -20 })
    tl.add(() => setSessionIssued(true), t3)
    sfxOn(tl, t3, () => sfxLoader.play('ui', SFX_MAP.POP2.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t3 + 0.1, CAPTIONS.SESSION_CHECK)
    const sc = { v: 0 }
    tl.to(sc, { v: 1, duration: 1.6, ease: 'power1.inOut', onUpdate: () => setSessionCheckPct(sc.v) }, t3 + 0.3)
    // Token — pas signed terbit bersamaan (dua storyboard mini)
    popIn(tl, t3, 'tokenPass', { fromX: 20 })
    tl.add(() => setTokenIssued(true), t3 + 0.3)
    sfxOn(tl, t3 + 0.3, () => sfxLoader.play('ui', SFX_MAP.POP2.name, { volume: volumeRef.current, speed: speedRef.current }))
    tl.add(() => setTokenSignatureOn(true), t3 + 0.9)
    say(tl, t3 + 0.95, CAPTIONS.TOKEN_CHECK)
    tl.add(() => setJwtNoteVisible(true), t3 + 1.6)
    t3 += 2.6
    let act3End = t3 + 1.0
    say(tl, t3 + 0.1, CAPTIONS.BRANCH_MERGE)
    tl.add(() => setJwtNoteVisible(false), act3End - 0.2)
    // revisi eksekusi: popOut kartu session/token di awal Act 4 supaya
    // koridor ke lemari bersih saat Adib melintas (continuity §8).
    popOut(tl, act3End + 0.05, 'sessionCard')
    popOut(tl, act3End + 0.05, 'tokenPass')

    // ═══════════════ ACT 4 — Identitas Valid, Akses Tetap Dipilih (±12s) ═
    tl.add(() => setPhaseIdx(3), act3End)
    popIn(tl, act3End + 0.1, 'lockers', { fromY: 16 })
    // revisi eksekusi: Adib melangkah dari kios ke lemari (continuity §8) —
    // jeda 0.5s setelah lemari muncul, durasi 1.4s biar terasa "berjalan".
    const adibToLockers = travel(tl, act3End + 0.5, setAdibY, KIOSK_Y, LOCKER_Y, 1.4, 'power1.inOut')
    sfxOn(tl, act3End + 0.5, () => sfxLoader.transition(SFX_MAP.WHOOSH.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, adibToLockers + 0.05, CAPTIONS.GENERAL_LOCKER)
    let t4 = act3End + 1.8
    tl.add(() => setLockerRahasiaPulse(true), t4)
    sfxOn(tl, t4, () => sfxLoader.warning(SFX_MAP.ALERT_PULSE.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t4 + 0.05, CAPTIONS.PERMISSION_CHECK)
    // mikro-label 403 — contoh authorization: login valid, izin kurang
    tl.add(() => setHttp403Visible(true), t4 + 0.1)
    t4 += 2.0
    tl.add(() => setPermissionChecked(true), t4)
    say(tl, t4 + 0.05, CAPTIONS.IDENTITY_VS_PERMISSION)
    t4 += 1.8
    tl.add(() => { setLockerUmumOpen(true) }, t4)
    sfxOn(tl, t4, () => sfxLoader.success(SFX_MAP.DING.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t4 + 0.05, CAPTIONS.ACCESS_GRANTED)
    t4 += 1.4
    popIn(tl, t4, 'closingStamps', { fromY: 12 })
    let act4End = t4 + 1.2

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

  // Cap payoff — badge stempel reusable buat valid/permission/closing.
  const Stamp = ({ x, y, color, top, sub, rot = -7 }) => (
    <g transform={`translate(${x}, ${y}) rotate(${rot})`}>
      <circle r={52} fill={color} opacity={0.16} />
      <rect x={-64} y={-32} width={128} height={64} rx={9} fill={COLORS.BG} stroke={color} strokeWidth={3} />
      <text x={0} y={1} textAnchor="middle" fontSize={14} fontWeight={900} fontFamily="monospace" fill={color}>{top}</text>
      {sub && <text x={0} y={22} textAnchor="middle" fontSize={10} fontFamily="sans-serif" fill={COLORS.MUTED}>{sub}</text>}
    </g>
  )

  // Garis dukungan — dot yang berjalan pulang-pergi antara kartu session
  // dan resepsionis (pola segitiga: naik ke server, kembali ke kartu).
  // Semua di local coordinate body; ujung bawah = GUARD_Y+10 (resepsionis).
  const scTri = (sessionCheckPct < 0.5 ? sessionCheckPct * 2 : (1 - sessionCheckPct) * 2)
  const scX = SESSION_PATH_X + (AXIS_X - SESSION_PATH_X) * scTri
  const scY = BRANCH_CARD_Y + 42 + ((GUARD_Y + 10) - (BRANCH_CARD_Y + 42)) * scTri

  // Karakter Adib — paket dibawa dari Act 1 sampai lemari berizin.
  const adibShape = (
    <g>
      <ellipse cx={0} cy={34} rx={30} ry={7} fill="#000" opacity={0.35} />
      <path d="M -20 6 Q 0 -18 20 6 L 20 30 L -20 30 Z" fill={COLORS.CLIENT} />
      <path d="M -22 30 Q 0 46 22 30" fill="none" stroke={COLORS.CLIENT} strokeWidth={6} strokeLinecap="round" />
      <circle cx={0} cy={-26} r={17} fill={COLORS.CLIENT} />
      <path d="M -10 -38 Q 0 -48 12 -36 L 6 -18 L -14 -22 Z" fill={COLORS.CLIENT_DIM} />
      <circle cx={-6} cy={-27} r={2.6} fill={COLORS.BG} />
      <circle cx={6} cy={-27} r={2.6} fill={COLORS.BG} />
      <path d="M -5 -20 Q 0 -16 5 -20" fill="none" stroke={COLORS.BG} strokeWidth={1.6} strokeLinecap="round" />
    </g>
  )
  const pakShape = (
    <g>
      <rect x={-22} y={-16} width={44} height={32} rx={4} fill={COLORS.PANEL} stroke={COLORS.CLIENT} strokeWidth={2} />
      <line x1={0} y1={-16} x2={0} y2={16} stroke={COLORS.CLIENT} strokeWidth={2} />
      <line x1={-22} y1={-6} x2={22} y2={-6} stroke={COLORS.CLIENT} strokeWidth={2} />
      <text x={0} y={25} textAnchor="middle" fontSize={8} fontFamily="monospace" fill={COLORS.MUTED}>ARSIP</text>
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
        <marker id="arrowSys" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill={COLORS.SYSTEM} />
        </marker>
      </defs>

      <rect x={0} y={0} width={VW} height={VH} fill={COLORS.BG} />
      <g opacity={0.04}>
        {Array.from({ length: 21 }).map((_, i) => <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={VH} stroke={COLORS.CLIENT} strokeWidth={1} />)}
        {Array.from({ length: 34 }).map((_, i) => <line key={`h${i}`} x1={0} y1={i * 40} x2={VW} y2={i * 40} stroke={COLORS.CLIENT} strokeWidth={1} />)}
      </g>

      {/* ── HEADER — scene-ui V1: AUTH (sky) + ENTICATION (green) ── */}
      {headerOpacity > 0 && (
        <g opacity={headerOpacity}>
          <IntroHeaderMorphV1
            progress={morphP}
            categorySegments={[
              { label: INTRO_CATEGORY_LABEL + ' · ', color: COLORS.MUTED },
              { label: INTRO_DOMAIN, color: COLORS.SYSTEM },
            ]}
            titleSegments={[
              { label: INTRO_TITLE_A + ' ', color: COLORS.CLIENT },
              { label: INTRO_TITLE_B, color: COLORS.SUCCESS },
            ]}
            subtitle={INTRO_SUBTITLE}
            titleFilter="url(#glow)"
            testId="auth-intro-header"
          />
        </g>
      )}

      {contentStarted && (
        <g>
          <ActBadgeNavigatorV1
            phases={PHASES}
            activeIndex={phaseIdx}
            testId="auth-act-navigator"
          />

          {/* ── BODY — local coordinate content (origin = body.x/body.y 44,235) ── */}
          <ContentBodyV1 debugName="auth-body">

          {/* spine — koridor kios → lemari, redup sepanjang cerita */}
          <line x1={AXIS_X} y1={KIOSK_Y - 40} x2={AXIS_X} y2={LOCKER_Y + 40}
            stroke={COLORS.BORDER} strokeWidth={2} strokeDasharray="4 6" opacity={0.35} />

          {/* ── GEDUNG ARSIP — redup sejak awal, menyala saat Adib tiba ── */}
          <g transform={T('building', AXIS_X, GATE_Y)} opacity={buildingOpacity * (0.35 + 0.65 * O('building'))}>
            <rect x={-210} y={-60} width={420} height={150} rx={14} fill={COLORS.PANEL} stroke={COLORS.SYSTEM} strokeWidth={2} />
            <rect x={-210} y={-60} width={420} height={34} rx={14} fill={COLORS.SYSTEM} opacity={0.12} />
            <text x={0} y={-38} textAnchor="middle" fontSize={11} fontFamily="monospace" letterSpacing={2} fill={COLORS.MUTED}>{BUILDING_LABEL}</text>

            {/* lemari silhouette — "terlihat jauh di dalam" dari Act 1 */}
            <rect x={-150} y={-8} width={50} height={80} rx={6} fill={COLORS.BG} stroke={COLORS.BORDER} strokeWidth={1.5} opacity={0.7} />
            <rect x={100} y={-8} width={50} height={80} rx={6} fill={COLORS.BG} stroke={COLORS.BORDER} strokeWidth={1.5} opacity={0.7} />

            {/* pintu — barrier muncul saat identitas belum terbukti */}
            <rect x={-45} y={-6} width={90} height={82} rx={6} fill={COLORS.BG} stroke={COLORS.BORDER} strokeWidth={2} />
            {gateBlocked && (
              <g transform={T('warnPulse', 0, 0)} filter="url(#glow)">
                <rect x={-80} y={-45} width={160} height={120} rx={12} fill="none" stroke={COLORS.DENY} strokeWidth={3} />
                <rect x={-54} y={26} width={108} height={18} rx={9} fill={COLORS.DENY} />
                <text x={0} y={38.5} textAnchor="middle" fontSize={9} fontWeight={700} fontFamily="monospace" fill={COLORS.BG}>DITUTUP</text>
              </g>
            )}
          </g>

          {/* panah penunjuk gerbang → kios saat resepsionis meminta bukti */}
          {O('kiosk') > 0.05 && (
            <path d={`M ${AXIS_X} ${GATE_Y + 30} C ${AXIS_X + 110} ${GATE_Y + 110}, ${AXIS_X + 110} ${KIOSK_Y - 50}, ${AXIS_X + 24} ${KIOSK_Y - 14}`}
              fill="none" stroke={COLORS.SYSTEM} strokeWidth={2} strokeDasharray="5 5" markerEnd="url(#arrowSys)" opacity={0.7} />
          )}

          {/* ── LOKET LOGIN — kios Act 1, login form Act 2 ── */}
          <g transform={T('kiosk', AXIS_X, KIOSK_Y + 70)} opacity={O('kiosk')}>
            <rect x={-160} y={-36} width={320} height={72} rx={12} fill={COLORS.PANEL} stroke={COLORS.CLIENT} strokeWidth={2} />
            <text x={0} y={-22} textAnchor="middle" fontSize={10} fontFamily="monospace" letterSpacing={2} fill={COLORS.MUTED}>{KIOSK_LABEL}</text>
            <text x={0} y={18} textAnchor="middle" fontSize={11} fontFamily="sans-serif" fill={COLORS.TEXT}>Isi nama &amp; password di sini</text>
          </g>

          {/* login form — muncul di atas counter kios */}
          <g transform={T('loginForm', AXIS_X, KIOSK_Y + 40)} opacity={O('loginForm')}>
            <rect x={-110} y={-42} width={220} height={84} rx={10} fill={COLORS.BG} stroke={COLORS.CLIENT} strokeWidth={2} filter="url(#shadow)" />
            <text x={-84} y={-14} fontSize={12} fontFamily="monospace" fill={COLORS.TEXT}>{CREDENTIAL.username}</text>
            <text x={-84} y={14} fontSize={12} fontFamily="monospace" fill={COLORS.MUTED}>{CREDENTIAL.password.replace(/./g, '•')}</text>
            <rect x={56} y={-10} width={44} height={22} rx={11} fill={COLORS.CLIENT} opacity={0.2} stroke={COLORS.CLIENT} strokeWidth={1.5} />
            <text x={78} y={5} textAnchor="middle" fontSize={9} fontWeight={700} fill={COLORS.CLIENT}>Kirim</text>
          </g>

          {/* ── BUKU LOGIN (plaintext) — resepsionis naif, dibobol pengintip ── */}
          {plaintextVisible && (
            <g transform={`translate(${SESSION_PATH_X - 5}, ${BRANCH_CARD_Y - 40}) rotate(-2)`} filter={leakFlash ? 'url(#glow)' : undefined}>
              <rect x={-84} y={-42} width={168} height={84} rx={10} fill={COLORS.PANEL} stroke={leakFlash ? COLORS.DENY : COLORS.BORDER} strokeWidth={2} />
              <text x={0} y={-26} textAnchor="middle" fontSize={9} fontFamily="monospace" letterSpacing={2} fill={COLORS.MUTED}>BUKU LOGIN</text>
              <text x={-62} y={-4} fontSize={10} fontFamily="monospace" fill={leakFlash ? COLORS.DENY : COLORS.TEXT}>{CREDENTIAL.username}: {CREDENTIAL.password}</text>
              <text x={-62} y={16} fontSize={10} fontFamily="monospace" fill={leakFlash ? COLORS.DENY : COLORS.MUTED}>admin: S3cr3t!</text>
              {leakFlash && (
                <g transform={`translate(64, -30)`}>
                  <rect x={-22} y={-16} width={44} height={32} rx={8} fill={COLORS.BG} stroke={COLORS.DENY} strokeWidth={2} />
                  <ellipse cx={0} cy={0} rx={9} ry={7} fill={COLORS.BG} stroke={COLORS.DENY} strokeWidth={1.5} />
                  <circle cx={0} cy={0} r={3} fill={COLORS.DENY} />
                </g>
              )}
            </g>
          )}

          {/* ── MESIN HASH — satu arah, salt unik, output hash ── */}
          <g transform={T('hashMachine', AXIS_X, KIOSK_Y + 240)} opacity={O('hashMachine')}>
            <rect x={-180} y={-50} width={360} height={100} rx={14} fill={COLORS.PANEL} stroke={COLORS.CRYPTO} strokeWidth={2} filter="url(#shadow)" />
            <text x={0} y={-34} textAnchor="middle" fontSize={11} fontFamily="monospace" letterSpacing={2} fill={COLORS.CRYPTO}>{'PASSWORD → HASH (SATU ARAH)'}</text>
            <rect x={-160} y={-16} width={130} height={48} rx={8} fill={COLORS.BG} stroke={COLORS.BORDER} strokeWidth={1.5} />
            <text x={-95} y={-2} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={COLORS.MUTED}>PASSWORD + SALT</text>
            <text x={-95} y={20} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={COLORS.CRYPTO}>{`${CREDENTIAL.username} · ${HASH_RECORD.salt}`}</text>
            <g transform={`translate(0, 10)`}>
              <line x1={-26} y1={0} x2={10} y2={0} stroke={COLORS.CRYPTO} strokeWidth={2} markerEnd="url(#arrowSys)" />
              <line x1={-2} y1={20} x2={-2} y2={-20} stroke={COLORS.DENY} strokeWidth={2} strokeDasharray="3 3" />
              <text x={-2} y={34} textAnchor="middle" fontSize={9} fill={COLORS.DENY}>tidak bisa dibalik</text>
            </g>
            <rect x={42} y={-16} width={138} height={48} rx={8} fill={COLORS.BG} stroke={COLORS.CRYPTO} strokeWidth={1.5} />
            <text x={111} y={-2} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={COLORS.MUTED}>HASH TERSIMPAN</text>
            <text x={111} y={20} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={COLORS.SUCCESS}>{hashOutput ? `${HASH_RECORD.salt} · ${hashOutput.hash}` : '…'}</text>
          </g>

          {/* ── CAP IDENTITAS VALID — payoff Act 2 ── */}
          {identityValid && (
            <g transform={T('validStamp', AXIS_X, KIOSK_Y + 160)} opacity={O('validStamp')} filter="url(#glow)">
              <Stamp x={0} y={0} color={COLORS.SUCCESS} top="IDENTITAS VALID" sub={`${CREDENTIAL.username} terbukti`} />
            </g>
          )}

          {/* ── ACT 3 — cabang session vs token ── */}
          {branchVisible && phaseIdx === 2 && (
            <g>
              {/* node pusat — bukti valid yang dibawa Adib */}
              <circle cx={AXIS_X} cy={BRANCH_Y} r={40} fill={COLORS.SUCCESS} opacity={0.14} stroke={COLORS.SUCCESS} strokeWidth={2} />
              <text x={AXIS_X} y={BRANCH_Y - 3} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="monospace" fill={COLORS.SUCCESS}>BUKTI</text>
              <text x={AXIS_X} y={BRANCH_Y + 14} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="monospace" fill={COLORS.SUCCESS}>VALID</text>

              {/* jalur bercabang */}
              <path d={`M ${AXIS_X} ${BRANCH_Y + 25} Q ${SESSION_PATH_X + 90} ${BRANCH_CARD_Y - 45}, ${SESSION_PATH_X} ${BRANCH_CARD_Y - 45}`} fill="none" stroke={COLORS.SYSTEM} strokeWidth={2} strokeDasharray="5 5" opacity={0.55} />
              <path d={`M ${AXIS_X} ${BRANCH_Y + 25} Q ${TOKEN_PATH_X - 90} ${BRANCH_CARD_Y - 45}, ${TOKEN_PATH_X} ${BRANCH_CARD_Y - 45}`} fill="none" stroke={COLORS.CRYPTO} strokeWidth={2} strokeDasharray="5 5" opacity={0.55} />

              {/* ── kartu SESSION (kiri) ── */}
              {sessionIssued && (
                <g transform={T('sessionCard', SESSION_PATH_X, BRANCH_CARD_Y)} opacity={O('sessionCard')}>
                  <rect x={-95} y={-40} width={190} height={82} rx={12} fill={COLORS.PANEL} stroke={COLORS.SYSTEM} strokeWidth={2} filter="url(#shadow)" />
                  <text x={0} y={-23} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="monospace" letterSpacing={2} fill={COLORS.SYSTEM}>SESSION</text>
                  <rect x={-62} y={-8} width={124} height={24} rx={6} fill={COLORS.BG} stroke={COLORS.BORDER} strokeWidth={1.5} />
                  <text x={0} y={9} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={COLORS.TEXT}>{SESSION.id}</text>
                  <text x={0} y={30} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={COLORS.MUTED}>cek server</text>
                </g>
              )}
              {/* jalur cek pulang-pergi ke resepsionis — local coordinate,
                  DI LUAR grup sessionCard yang sudah di-translate */}
              {sessionIssued && (
                <g>
                  <line x1={SESSION_PATH_X} y1={BRANCH_CARD_Y + 45} x2={AXIS_X} y2={GUARD_Y + 10} stroke={COLORS.SYSTEM} strokeWidth={1.5} strokeDasharray="3 4" opacity={0.6} />
                  <circle cx={scX} cy={scY} r={6} fill={COLORS.SYSTEM} filter="url(#glow)" />
                </g>
              )}

              {/* ── pas TOKEN (kanan) ── */}
              {tokenIssued && (
                <g transform={T('tokenPass', TOKEN_PATH_X, BRANCH_CARD_Y)} opacity={O('tokenPass')}>
                  <rect x={-95} y={-40} width={190} height={82} rx={12} fill={COLORS.PANEL} stroke={COLORS.CRYPTO} strokeWidth={2} filter="url(#shadow)" />
                  <text x={0} y={-23} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="monospace" letterSpacing={2} fill={COLORS.CRYPTO}>TOKEN SIGNED</text>
                  <rect x={-70} y={-8} width={140} height={24} rx={6} fill={COLORS.BG} stroke={COLORS.BORDER} strokeWidth={1.5} />
                  <text x={0} y={9} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={COLORS.TEXT}>
                    {`${TOKEN_CLAIMS.user} · ${TOKEN_CLAIMS.role} · exp ${TOKEN_CLAIMS.exp}`}
                  </text>
                  <text x={0} y={30} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={COLORS.MUTED}>cek signature lokal</text>
                  {tokenSignatureOn && (
                    <g transform={`translate(72, -30)`}>
                      <circle r={14} fill={COLORS.CRYPTO} opacity={0.2} stroke={COLORS.CRYPTO} strokeWidth={2} filter="url(#glow)" />
                      <text x={0} y={4} textAnchor="middle" fontSize={8} fontWeight={700} fontFamily="monospace" fill={COLORS.CRYPTO}>SIG</text>
                    </g>
                  )}
                </g>
              )}
              {jwtNoteVisible && (
                <text x={TOKEN_PATH_X} y={BRANCH_CARD_Y + 92} textAnchor="middle" fontSize={10} fontFamily="sans-serif" fill={COLORS.MUTED}>{CAPTIONS.JWT_NOTE}</text>
              )}

              {/* ── pemeriksaan: server vs lokal, lalu merge ── */}
              <g transform={`translate(${AXIS_X}, ${GUARD_Y + 10})`}>
                <rect x={-70} y={-21} width={140} height={42} rx={12} fill={COLORS.PANEL} stroke={COLORS.SYSTEM} strokeWidth={2} />
                <circle cx={28} cy={0} r={13} fill={COLORS.PROCESS} />
                <circle cx={25} cy={-3} r={2} fill={COLORS.BG} />
                <circle cx={31} cy={-3} r={2} fill={COLORS.BG} />
                <circle cx={38} cy={-16} r={10} fill={COLORS.PROCESS} opacity={0.5} />
                <text x={-64} y={5} fontSize={9} fontFamily="monospace" fill={COLORS.TEXT}>RESEPSIONIS</text>
              </g>
              {tokenSignatureOn && (
                <g transform={`translate(${TOKEN_PATH_X}, ${GUARD_Y + 10})`}>
                  <circle r={20} fill="none" stroke={COLORS.CRYPTO} strokeWidth={2} opacity={0.7} filter="url(#glow)" />
                  <text x={0} y={4} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={COLORS.CRYPTO}>LOCAL</text>
                </g>
              )}
              <path d={`M ${AXIS_X} ${GUARD_Y + 10} L ${AXIS_X} ${GUARD_Y + 92}`} fill="none" stroke={COLORS.SYSTEM} strokeWidth={2} opacity={0.5} />
              <path d={`M ${TOKEN_PATH_X} ${GUARD_Y + 10} Q ${AXIS_X + 80} ${GUARD_Y + 92}, ${AXIS_X} ${GUARD_Y + 92}`} fill="none" stroke={COLORS.CRYPTO} strokeWidth={2} opacity={0.5} />
              <circle cx={AXIS_X} cy={GUARD_Y + 98} r={9} fill={COLORS.SUCCESS} opacity={0.25} stroke={COLORS.SUCCESS} strokeWidth={2} />
            </g>
          )}

          {/* ── ACT 4 — dua lemari: umum vs rahasia ── */}
          <g transform={T('lockers', AXIS_X, LOCKER_Y)} opacity={O('lockers')}>
            {/* LEMARI UMUM */}
            <g transform={`translate(-160, 0)`}>
              <rect x={-88} y={-70} width={176} height={140} rx={10} fill={COLORS.PANEL} stroke={lockerUmumOpen ? COLORS.SUCCESS : COLORS.BORDER} strokeWidth={2} />
              <text x={0} y={-54} textAnchor="middle" fontSize={9} fontFamily="monospace" letterSpacing={1} fill={COLORS.MUTED}>{ACCESS_POLICY.lockers[0].label}</text>
              <rect x={-56} y={-38} width={112} height={92} rx={6} fill={COLORS.BG} stroke={lockerUmumOpen ? COLORS.SUCCESS : COLORS.BORDER} strokeWidth={1.5} />
              {lockerUmumOpen && (
                <g>
                  <rect x={-34} y={-10} width={68} height={30} rx={6} fill={COLORS.SUCCESS} opacity={0.16} filter="url(#glow)" />
                  <text x={0} y={9} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="monospace" fill={COLORS.SUCCESS}>BUKA ✓</text>
                  <text x={0} y={30} textAnchor="middle" fontSize={8} fontFamily="monospace" fill={COLORS.MUTED}>{ACCESS_POLICY.lockers[0].requiredPermission}</text>
                </g>
              )}
            </g>
            {/* LEMARI RAHASIA */}
            <g transform={`translate(160, 0)`}>
              <rect x={-88} y={-70} width={176} height={140} rx={10} fill={COLORS.PANEL} stroke={lockerRahasiaPulse ? COLORS.DENY : COLORS.BORDER} strokeWidth={2} filter={lockerRahasiaPulse ? 'url(#glow)' : undefined} />
              <text x={0} y={-54} textAnchor="middle" fontSize={9} fontFamily="monospace" letterSpacing={1} fill={COLORS.MUTED}>{ACCESS_POLICY.lockers[1].label}</text>
              <rect x={-56} y={-38} width={112} height={92} rx={6} fill={COLORS.BG} stroke={COLORS.DENY} strokeWidth={1.5} opacity={lockerRahasiaPulse ? 1 : 0.6} />
              {lockerRahasiaPulse && (
                <g>
                  <circle cx={0} cy={6} r={16} fill="none" stroke={COLORS.DENY} strokeWidth={2} />
                  <rect x={-14} y={6} width={28} height={20} rx={4} fill={COLORS.BG} stroke={COLORS.DENY} strokeWidth={2} />
                  <circle cx={0} cy={4} r={4} fill={COLORS.DENY} />
                  <text x={0} y={30} textAnchor="middle" fontSize={8} fontFamily="monospace" fill={COLORS.DENY}>{ACCESS_POLICY.lockers[1].requiredPermission}</text>
                </g>
              )}
            </g>
          </g>

          {/* ── CAP IZIN per lemari — payoff Act 4 ── */}
          {permissionChecked && (
            <g filter="url(#glow)">
              <Stamp x={SESSION_PATH_X} y={IZIN_CAP_Y} color={COLORS.SUCCESS} top="IZIN DIIZINKAN" sub={`${ACCESS_POLICY.lockers[0].requiredPermission} ✓`} />
              <Stamp x={TOKEN_PATH_X} y={IZIN_CAP_Y} color={COLORS.DENY} top="IZIN DITOLAK" sub={`${ACCESS_POLICY.lockers[1].requiredPermission} ✗`} />
            </g>
          )}

          {/* label mikro HTTP opsional — ditempel dekat elemen, tidak ambil
              alih payoff: 401 = konteks login (Act 2), 403 = lemari rahasia (Act 4) */}
          {http401Visible && (
            <text x={AXIS_X} y={KIOSK_Y + 130} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={COLORS.MUTED} opacity={0.85}>
              {CAPTIONS.STATUS_401}
            </text>
          )}
          {http403Visible && (
            <text x={TOKEN_PATH_X} y={LOCKER_Y + 51} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={COLORS.DENY} opacity={0.9}>
              {CAPTIONS.STATUS_403}
            </text>
          )}

          {/* ── CLOSING — dua cap payoff: siapa vs boleh ── */}
          <g transform={T('closingStamps', AXIS_X, CLOSING_Y)} opacity={O('closingStamps')} filter="url(#glow)">
            <Stamp x={-170} y={0} color={COLORS.SUCCESS} top="AUTH · siapa" sub="Membuktikan identitas" />
            <Stamp x={170} y={0} color={COLORS.PROCESS} top="AUTHZ · boleh" sub="Mengatur izin akses" />
          </g>

          {/* ── ADIB + PAKET — anchor lintas Act, mengikuti adibY ── */}
          <g transform={`translate(${AXIS_X}, ${adibY})`}>
            <g transform={T('adib', 0, 0)}>{adibShape}</g>
          </g>
          <g transform={`translate(${AXIS_X + 40}, ${adibY + 4})`}>
            <g transform={T('paket', 0, 0)} filter={lockerUmumOpen ? 'url(#glow)' : undefined}>
              {pakShape}
            </g>
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

