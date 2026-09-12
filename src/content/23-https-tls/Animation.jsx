// ═══════════════════════════════════════════════════════════════════════════
// src/content/23-https-tls/Animation.jsx
// ─────────────────────────────────────────────────────────────────────────
// Eksekusi sesuai src/content/23-https-tls/_docs/HTTPS_TLS_PLAN.md (2026-09-12).
// Empat Act. Scene UI V1 penuh: IntroHeaderMorphV1 + ActBadgeNavigatorV1
// (di luar body) dan ContentBodyV1 (semua child body memakai koordinat
// lokal, origin body 44,235). Layout cerita horizontal:
// Browser (kiri) — Transit publik (tengah) — Server (kanan), rantai
// sertifikat di zona atas (Act 2).
// Cerita: paket HTTP Adib lewat jalan publik terbuka dan mudah diintip.
// Browser memilih HTTPS → jalan morf menjadi terowongan TLS: server
// diperiksa sertifikatnya, kedua sisi membentuk kunci sesi TANPA mengirim
// kunci utuh, lalu request asli melewati terowongan terkunci (isi aman,
// bentuk/arah paket tetap terlihat).
//
// STATUS: first pass + align ContentBodyV1. Menunggu preview manual &
// export MP4. Registry tetap coming-soon sesuai _docs/HTTPS_TLS_PLAN.md.
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, SFX_MAP,
  INTRO_CATEGORY_LABEL, INTRO_DOMAIN, INTRO_TITLE_A, INTRO_TITLE_B, INTRO_SUBTITLE,
  BROWSER_X, BROWSER_Y, SERVER_X, SERVER_Y,
  ROAD_Y, ROAD_L, ROAD_R, EAVE_X, EAVE_Y, IMPOSTOR_X, IMPOSTOR_Y,
  TUNNEL_HALF, TUNNEL_L, TUNNEL_R, PKT_START, PKT_END,
  ROOT_CA_X, INTER_X, CERT_X, CERT_CARD_Y,
  KEY_BROWSER_X, KEY_BROWSER_Y, KEY_SERVER_X, KEY_SERVER_Y,
  CAPTION_Y, CLOSING_Y,
  BROWSER_URL, REQUEST_TEXT,
  INGREDIENT_A, INGREDIENT_B, FAKE_KEY_LABEL,
  CAPTIONS,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'
import { IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1 } from '../../shared/scene-ui/v1'

// ── konstanta travel — jalur transit dari PKT_START ke PKT_END (TS1:
// ekspor data.js). Rentang dipersempit agar paket/kapsul selalu di dalam
// tube terowongan (revisi-01). ──

export default function HttpsTlsAnimation({
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

  // ── header — hero-to-header morph, sama pola dengan 18-auth ──
  const [morphP, setMorphP] = useState(0)
  const [headerOpacity, setHeaderOpacity] = useState(0)
  const [contentStarted, setContentStarted] = useState(false)

  // ── Act 1 — jalan publik, paket HTTP polos ──
  const [roadOpen, setRoadOpen] = useState(false)
  const [serverDim, setServerDim] = useState(0.45)
  const [browserHttps, setBrowserHttps] = useState(false)
  const [plaintextPacket, setPlaintextPacket] = useState(false)
  const [eavesRead, setEavesRead] = useState(false)
  const [warnPulse, setWarnPulse] = useState(false)
  const [httpPacketProg, setHttpPacketProg] = useState(0) // 0..1 paket act 1 (jalan terbuka)
  const [tunnelGate, setTunnelGate] = useState(0)         // 0..1 jalan → terowongan
  const [tunnelPacketProg, setTunnelPacketProg] = useState(0)

  // ── Act 2 — sertifikat & verifikasi server ──
  const [domainCheck, setDomainCheck] = useState(false)   // perbandingan nama berjalan
  const [domainOk, setDomainOk] = useState(false)
  const [signatureTrusted, setSignatureTrusted] = useState(false)
  const [impostorX, setImpostorX] = useState(false)
  const [serverVerified, setServerVerified] = useState(false)

  // ── Act 3 — key agreement ──
  const [ingredientAProg, setIngredientAProg] = useState(0) // A: browser → server
  const [ingredientBProg, setIngredientBProg] = useState(0) // B: server → browser
  const [fakeKeyProg, setFakeKeyProg] = useState(0)         // paket "kunci" palsu, dipantulkan
  const [fakeReflected, setFakeReflected] = useState(false)
  const [sessionKeyReady, setSessionKeyReady] = useState(false)
  const [tunnelLined, setTunnelLined] = useState(false)

  // ── Act 4 — request dalam kapsul terkunci ──
  const [requestPack, setRequestPack] = useState(false)
  const [capsuleLocked, setCapsuleLocked] = useState(false)
  const [eavesSeesOuter, setEavesSeesOuter] = useState(false)
  const [sealAppear, setSealAppear] = useState(false)
  const [capsuleProg, setCapsuleProg] = useState(0)
  const [serverOpen, setServerOpen] = useState(false)

  const P = (id) => pop[id] || { scale: 0, opacity: 0, x: 0, y: 0 }

  useEffect(() => {
    const shouldEnable = previewSfx && audioUnlocked
    sfxLoader.setEnabled(shouldEnable)
    audioUnlockedRef.current = audioUnlocked
    volumeRef.current = volume
    speedRef.current = speed
  }, [previewSfx, audioUnlocked, volume, speed])

  // ── helper pop-in/pop-out/morph — identik pola 18-auth/17-rest-api ──
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
    const { duration = 0.3, ease = 'power1.in', sfx = false,
      sfxName = SFX_MAP.POP.name, sfxCategory = 'ui', volumeMult = 1 } = opts
    const o = { v: 1 }
    tl.to(o, {
      v: 0, duration, ease,
      onStart: () => { if (sfx) sfxLoader.play(sfxCategory, sfxName, { volume: volume * volumeMult, speed }) },
      onUpdate: () => setPop(prev => ({ ...prev, [id]: { ...(prev[id] || {}), scale: o.v, opacity: o.v } })),
    }, time)
  }

  const say = (tl, time, text) => tl.add(() => setCaption(text), time)
  const sfxOn = (tl, time, fn) => tl.add(() => audioUnlockedRef.current && fn(), time)

  // ═══════════════════════════════════════════════════════════════════════
  // MASTER TIMELINE — empat Act, intro 1,2s + 9+12+13+12s (±47s)
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
      setRoadOpen(false); setServerDim(0.45); setBrowserHttps(false)
      setPlaintextPacket(false); setEavesRead(false); setWarnPulse(false)
      setHttpPacketProg(0); setTunnelGate(0); setTunnelPacketProg(0)
      setDomainCheck(false); setDomainOk(false); setSignatureTrusted(false)
      setImpostorX(false); setServerVerified(false)
      setIngredientAProg(0); setIngredientBProg(0); setFakeKeyProg(0)
      setFakeReflected(false); setSessionKeyReady(false); setTunnelLined(false)
      setRequestPack(false); setCapsuleLocked(false); setEavesSeesOuter(false)
      setSealAppear(false); setCapsuleProg(0); setServerOpen(false)
      setPop({}); setCaption('')
    }, t)

    // ═══════════════ INTRO — hero centered → header ════════════════
    t += 0.2
    const mo = { p: 0 }
    tl.to(mo, { p: 1, duration: 0.8, ease: 'power3.inOut', onUpdate: () => setMorphP(mo.p) }, t)
    sfxOn(tl, t, () => sfxLoader.transition(SFX_MAP.TELEPORT.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 0.8
    tl.add(() => setContentStarted(true), t)

    // ═══════════════ ACT 1 — HTTP Lewat Jalan Umum (±9s) ═══════════
    tl.add(() => setPhaseIdx(0), t)
    popIn(tl, t + 0.1, 'browser', { fromY: -14, sfxName: SFX_MAP.MATERIALIZE.name, sfxCategory: 'success' })
    tl.add(() => setServerDim(0.5), t + 0.1)
    popIn(tl, t + 0.2, 'server', { fromY: -14, sfxName: SFX_MAP.MATERIALIZE.name, sfxCategory: 'success' })
    tl.add(() => setRoadOpen(true), t + 0.35)
    say(tl, t + 0.45, CAPTIONS.HTTP_OPEN)
    popIn(tl, t + 0.55, 'eaves', { fromX: -8, sfxName: SFX_MAP.PLINK.name, sfxCategory: 'ui', volumeMult: 0.8 })
    t += 1.6
    // paket HTTP polos terbang di jalan terbuka → isi terbaca pengintip
    const p1 = { v: 0 }
    tl.to(p1, { v: 1, duration: 1.4, ease: 'power1.inOut', onUpdate: () => setHttpPacketProg(p1.v) }, t)
    sfxOn(tl, t, () => sfxLoader.transition(SFX_MAP.WHOOSH.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t + 0.05, CAPTIONS.EAVES_OPEN)
    tl.add(() => setPlaintextPacket(true), t + 0.7)
    tl.add(() => setEavesRead(true), t + 0.85)
    sfxOn(tl, t + 0.85, () => sfxLoader.warning(SFX_MAP.CRITICAL_ALERT.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 1.9
    tl.add(() => setWarnPulse(true), t)
    sfxOn(tl, t, () => sfxLoader.warning(SFX_MAP.ALERT_PULSE.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 1.2
    tl.add(() => setWarnPulse(false), t)
    // browser memilih HTTPS → jalan morf jadi terowongan TLS
    tl.add(() => setBrowserHttps(true), t + 0.05)
    sfxOn(tl, t + 0.05, () => sfxLoader.success(SFX_MAP.DING.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t + 0.1, CAPTIONS.CHOOSE_HTTPS)
    const tg = { v: 0 }
    tl.to(tg, { v: 1, duration: 1.0, ease: 'power2.out', onUpdate: () => setTunnelGate(tg.v) }, t + 0.35)
    sfxOn(tl, t + 0.35, () => sfxLoader.transition(SFX_MAP.SWOOSH.name, { volume: volumeRef.current, speed: speedRef.current }))
    tl.add(() => setRoadOpen(false), t + 0.55)
    t += 1.7
    // paket kedua melintas di dalam terowongan
    const p2 = { v: 0 }
    tl.to(p2, { v: 1, duration: 1.2, ease: 'power1.inOut', onUpdate: () => setTunnelPacketProg(p2.v) }, t)
    sfxOn(tl, t, () => sfxLoader.success(SFX_MAP.CONFIRM.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t + 0.05, CAPTIONS.SAFE_START)
    t += 1.6
    let act1End = t

    // ═══════════════ ACT 2 — Server Diperiksa, Tidak Dipercaya (±12s) ══
    tl.add(() => setPhaseIdx(1), act1End)
    say(tl, act1End + 0.1, CAPTIONS.CERT_SEND)
    popIn(tl, act1End + 0.4, 'certRoot', { fromY: -14, sfxName: SFX_MAP.PLINK.name, sfxCategory: 'ui', volumeMult: 0.8 })
    popIn(tl, act1End + 0.7, 'certInter', { fromY: -14, sfxName: SFX_MAP.PLINK.name, sfxCategory: 'ui', volumeMult: 0.8 })
    popIn(tl, act1End + 1.0, 'certServer', { fromY: -14 })
    tl.add(() => setServerDim(1), act1End + 0.9)
    let t2 = act1End + 2.0
    // nama domain harus cocok
    say(tl, t2 + 0.05, CAPTIONS.NAME_MUST_MATCH)
    tl.add(() => setDomainCheck(true), t2 + 0.5)
    sfxOn(tl, t2 + 0.5, () => sfxLoader.ui(SFX_MAP.TICK.name, { volume: volumeRef.current, speed: speedRef.current }))
    tl.add(() => setDomainOk(true), t2 + 1.2)
    sfxOn(tl, t2 + 1.2, () => sfxLoader.ui(SFX_MAP.CHIME.name, { volume: volumeRef.current, speed: speedRef.current }))
    t2 += 2.1
    // tanda tangan rantai CA dipercaya
    say(tl, t2 + 0.05, CAPTIONS.SIGN_TRUSTED)
    tl.add(() => setSignatureTrusted(true), t2 + 0.9)
    sfxOn(tl, t2 + 0.9, () => sfxLoader.success(SFX_MAP.CONFIRM.name, { volume: volumeRef.current, speed: speedRef.current }))
    t2 += 2.2
    // impostor ditolak + payoff verifikasi
    popIn(tl, t2, 'impostor', { fromY: 10 })
    sfxOn(tl, t2, () => sfxLoader.warning(SFX_MAP.ALERT_PULSE.name, { volume: volumeRef.current, speed: speedRef.current }))
    tl.add(() => setImpostorX(true), t2 + 0.7)
    sfxOn(tl, t2 + 0.7, () => sfxLoader.impact(SFX_MAP.ERROR.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t2 + 0.75, CAPTIONS.IMPOSTOR_X)
    tl.add(() => setServerVerified(true), t2 + 1.6)
    sfxOn(tl, t2 + 1.6, () => sfxLoader.success(SFX_MAP.DING.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t2 + 1.65, CAPTIONS.SERVER_VERIFIED)
    let act2End = t2 + 2.7

    // ═══════════════ ACT 3 — Kunci Sesi Dibentuk Bersama (±13s) ═══════
    tl.add(() => setPhaseIdx(2), act2End)
    say(tl, act2End + 0.1, CAPTIONS.TWO_INGREDIENTS)
    const iA = { v: 0 }
    tl.to(iA, { v: 1, duration: 1.4, ease: 'power1.inOut', onUpdate: () => setIngredientAProg(iA.v) }, act2End + 0.5)
    sfxOn(tl, act2End + 0.5, () => sfxLoader.ui(SFX_MAP.POP.name, { volume: volumeRef.current, speed: speedRef.current }))
    const iB = { v: 0 }
    tl.to(iB, { v: 1, duration: 1.4, ease: 'power1.inOut', onUpdate: () => setIngredientBProg(iB.v) }, act2End + 1.0)
    sfxOn(tl, act2End + 1.0, () => sfxLoader.ui(SFX_MAP.POP2.name, { volume: volumeRef.current, speed: speedRef.current }))
    let t3 = act2End + 2.9
    // serangan: paket "kunci" palsu → dipantulkan, kunci utuh TIDAK dikirim
    popIn(tl, t3, 'fakeKey', { fromX: 10 })
    sfxOn(tl, t3, () => sfxLoader.warning(SFX_MAP.ALERT_PULSE.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t3 + 0.05, CAPTIONS.KEY_NOT_SENT)
    const fk = { v: 0 }
    tl.to(fk, { v: 1, duration: 1.6, ease: 'power1.inOut', onUpdate: () => setFakeKeyProg(fk.v) }, t3 + 0.2)
    t3 += 2.2
    popOut(tl, t3, 'fakeKey', { sfx: true, sfxCategory: 'ui', sfxName: SFX_MAP.BOUNCE.name })
    tl.add(() => setFakeReflected(true), t3)
    t3 += 1.1
    // dua bahan menyatu di kedua sisi → kunci sesi identik
    popIn(tl, t3, 'keyBadge', { fromY: 12, sfxName: SFX_MAP.DING.name })
    tl.add(() => setSessionKeyReady(true), t3)
    say(tl, t3 + 0.1, CAPTIONS.SHARED_SECRET)
    t3 += 1.9
    // terowongan siap dipakai
    tl.add(() => setTunnelLined(true), t3)
    sfxOn(tl, t3, () => sfxLoader.transition(SFX_MAP.SWOOSH.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t3 + 0.1, CAPTIONS.TUNNEL_READY)
    let act3End = t3 + 1.8

    // ═══════════════ ACT 4 — HTTP Kini di Dalam TLS (±12s) ════════════
    tl.add(() => setPhaseIdx(3), act3End)
    popIn(tl, act3End + 0.1, 'capsule', { fromX: -10 })
    tl.add(() => setRequestPack(true), act3End + 0.45)
    sfxOn(tl, act3End + 0.45, () => sfxLoader.ui(SFX_MAP.TICK.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, act3End + 0.5, CAPTIONS.REQUEST_PACKED)
    let t4 = act3End + 1.9
    tl.add(() => setCapsuleLocked(true), t4)
    sfxOn(tl, t4, () => sfxLoader.impact(SFX_MAP.LOCK.name, { volume: volumeRef.current, speed: speedRef.current }))
    tl.add(() => setEavesSeesOuter(true), t4 + 0.5)
    sfxOn(tl, t4 + 0.5, () => sfxLoader.ui(SFX_MAP.SHIFT.name, { volume: volumeRef.current * 0.7, speed: speedRef.current }))
    say(tl, t4 + 0.55, CAPTIONS.OUTER_ONLY)
    const cc = { v: 0 }
    tl.to(cc, { v: 1, duration: 1.9, ease: 'power1.inOut', onUpdate: () => setCapsuleProg(cc.v) }, t4 + 0.3)
    sfxOn(tl, t4 + 0.3, () => sfxLoader.transition(SFX_MAP.WHOOSH_LOW.name, { volume: volumeRef.current, speed: speedRef.current }))
    t4 += 2.7
    tl.add(() => setSealAppear(true), t4)
    sfxOn(tl, t4, () => sfxLoader.success(SFX_MAP.CONFIRM.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t4 + 0.05, CAPTIONS.PROTECTED)
    t4 += 1.8
    tl.add(() => setServerOpen(true), t4)
    sfxOn(tl, t4, () => sfxLoader.success(SFX_MAP.DING.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t4 + 0.05, CAPTIONS.SERVER_READS)
    t4 += 1.7
    popIn(tl, t4, 'closingStamps', { fromY: 12, sfxName: SFX_MAP.DING.name })
    let act4End = t4 + 1.3

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

  // Cap payoff — badge stempel reusable buat valid/closing.
  const Stamp = ({ x, y, color, top, sub, rot = -7 }) => (
    <g transform={`translate(${x}, ${y}) rotate(${rot})`}>
      <circle r={52} fill={color} opacity={0.16} />
      <rect x={-64} y={-32} width={128} height={64} rx={9} fill={COLORS.BG} stroke={color} strokeWidth={3} />
      <text x={0} y={1} textAnchor="middle" fontSize={14} fontWeight={900} fontFamily="monospace" fill={color}>{top}</text>
      {sub && <text x={0} y={22} textAnchor="middle" fontSize={10} fontFamily="sans-serif" fill={COLORS.MUTED}>{sub}</text>}
    </g>
  )

  // Amplop HTTP — varian polos (terbaca) vs terkunci (isi tak terlihat).
  // Revisi-01: diperkecil ke 104×56 (±52/±28) agar jelas berada DI DALAM
  // tube terowongan (tube 260–470, tinggi 80) saat melintas.
  const Packet = ({ x, y, text, color, locked = false, highlighted = false }) => (
    <g transform={`translate(${x}, ${y})`}>
      <rect x={-52} y={-28} width={104} height={56} rx={10} fill={COLORS.PANEL} stroke={highlighted ? COLORS.DENY : color} strokeWidth={2} filter="url(#shadow)" />
      <line x1={-34} y1={-14} x2={34} y2={-14} stroke={color} strokeWidth={2} opacity={0.5} />
      <line x1={-34} y1={-4} x2={34} y2={-4} stroke={color} strokeWidth={2} opacity={0.5} />
      {locked ? (
        <g>
          <circle cx={0} cy={2} r={9} fill={COLORS.BG} stroke={color} strokeWidth={2} />
          <rect x={-6} y={2} width={12} height={10} rx={2.5} fill={COLORS.BG} stroke={color} strokeWidth={2} />
        </g>
      ) : text ? (
        <text x={0} y={20} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="monospace" fill={highlighted ? COLORS.DENY : COLORS.TEXT}>{text}</text>
      ) : null}
    </g>
  )

  // Kapsul — wadah request berisi dua keping + kunci di tengah saat terkunci.
  // Revisi-01: diperkecil ke 92×60 (±46/±30) agar tetap di dalam tube.
  const Capsule = ({ x, y }) => (
    <g transform={`translate(${x}, ${y})`}>
      <rect x={-46} y={-30} width={92} height={60} rx={14} fill={COLORS.PANEL} stroke={capsuleLocked ? COLORS.SUCCESS : COLORS.SYSTEM} strokeWidth={2.5} filter="url(#shadow)" />
      <line x1={0} y1={-18} x2={0} y2={18} stroke={COLORS.BORDER} strokeWidth={1.5} strokeDasharray="2 3" />
      {capsuleLocked ? (
        <g transform={`translate(0, 0)`}>
          <circle cx={0} cy={-1} r={8} fill={COLORS.BG} stroke={COLORS.SUCCESS} strokeWidth={2} />
          <rect x={-5} y={-1} width={10} height={8} rx={2} fill={COLORS.BG} stroke={COLORS.SUCCESS} strokeWidth={2} />
        </g>
      ) : (
        requestPack && <text x={0} y={4} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="monospace" fill={COLORS.TEXT}>{REQUEST_TEXT}</text>
      )}
      {sealAppear && (
        <g transform={`translate(0, -36)`} filter="url(#glow)">
          <rect x={-22} y={-10} width={44} height={20} rx={10} fill={COLORS.BG} stroke={COLORS.SUCCESS} strokeWidth={2} />
          <text x={0} y={3} textAnchor="middle" fontSize={8} fontWeight={700} fontFamily="monospace" fill={COLORS.SUCCESS}>SEAL</text>
        </g>
      )}
    </g>
  )

  // Kartu sertifikat — rantai kepercayaan (root → intermediate → server).
  const CertCard = ({ x, role, domain, ok, sig }) => (
    <g transform={T(x === ROOT_CA_X ? 'certRoot' : x === INTER_X ? 'certInter' : 'certServer', x, CERT_CARD_Y)} opacity={O(x === ROOT_CA_X ? 'certRoot' : x === INTER_X ? 'certInter' : 'certServer')}>
      <rect x={-75} y={-52} width={150} height={104} rx={12} fill={COLORS.PANEL} stroke={ok ? COLORS.SUCCESS : COLORS.CRYPTO} strokeWidth={2} filter="url(#shadow)" />
      <rect x={-75} y={-52} width={150} height={26} rx={12} fill={COLORS.CRYPTO} opacity={0.16} />
      <text x={0} y={-34} textAnchor="middle" fontSize={9} fontWeight={700} fontFamily="monospace" letterSpacing={1.5} fill={ok ? COLORS.SUCCESS : COLORS.CRYPTO}>{role}</text>
      {domain ? (
        <text x={0} y={-6} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="monospace" fill={domainOk ? COLORS.SUCCESS : COLORS.TEXT}>{domain}</text>
      ) : (
        <text x={0} y={-6} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={COLORS.MUTED}>{role === 'SERTIFIKAT SERVER' ? 'kunci publik' : 'otoritas penerbit'}</text>
      )}
      <rect x={-30} y={8} width={60} height={34} rx={6} fill={COLORS.BG} stroke={sig ? COLORS.SUCCESS : COLORS.BORDER} strokeWidth={1.5} />
      <text x={0} y={21} textAnchor="middle" fontSize={8} fontFamily="monospace" fill={sig ? COLORS.SUCCESS : COLORS.MUTED}>{sig ? '✓ TANDA' : 'TANDA TANGAN'}</text>
      <text x={0} y={36} textAnchor="middle" fontSize={8} fontFamily="monospace" fill={sig ? COLORS.SUCCESS : COLORS.MUTED}>{sig ? 'TERVERIFIKASI' : '…'}</text>
    </g>
  )

  const KeyGlyph = ({ x, y, on, color = COLORS.SYSTEM }) => (
    <g transform={`translate(${x}, ${y})`} opacity={on ? 1 : 0.25} filter={on ? 'url(#glow)' : undefined}>
      <circle cx={0} cy={0} r={11} fill={COLORS.BG} stroke={color} strokeWidth={2.5} />
      <rect x={-6} y={-4} width={12} height={9} rx={2} fill={COLORS.BG} stroke={color} strokeWidth={2} />
    </g>
  )

  // Posisi travel
  const openPktX = PKT_START + (PKT_END - PKT_START) * httpPacketProg
  const tunnelPktX = PKT_START + (PKT_END - PKT_START) * tunnelPacketProg
  const ingAX = PKT_START + (PKT_END - PKT_START) * ingredientAProg
  const ingBX = PKT_END - (PKT_END - PKT_START) * ingredientBProg
  const fkHalf = fakeKeyProg < 0.5 ? fakeKeyProg * 2 : (1 - fakeKeyProg) * 2
  const fkX = 352 - 32 * fkHalf
  const capX = PKT_START + (PKT_END - PKT_START) * capsuleProg

  // Pengintip — mata merah saat membaca plaintext, menyipit saat hanya lihat bentuk.
  const eavesLook = eavesRead ? COLORS.DENY : eavesSeesOuter ? COLORS.MUTED : COLORS.BORDER
  const eavesLabel = eavesRead ? 'TERBACA' : eavesSeesOuter ? 'HANYA BENTUK' : ''
  // Tangan pengintip: saat jalan terbuka menjangkau ke jalan (70px); saat
  // terowongan terbentuk, berhenti di atap tube (ROAD_Y - TUNNEL_HALF) —
  // tidak tembus.
  const armEndY = tunnelGate > 0 && !eavesRead ? (ROAD_Y - TUNNEL_HALF - EAVE_Y) : (ROAD_Y - EAVE_Y)

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
        <marker id="arrowDeny" markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
          <polygon points="0 0, 10 3.5, 0 7" fill={COLORS.DENY} />
        </marker>
      </defs>

      <rect x={0} y={0} width={VW} height={VH} fill={COLORS.BG} />
      <g opacity={0.04}>
        {Array.from({ length: 21 }).map((_, i) => <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={VH} stroke={COLORS.CLIENT} strokeWidth={1} />)}
        {Array.from({ length: 34 }).map((_, i) => <line key={`h${i}`} x1={0} y1={i * 40} x2={VW} y2={i * 40} stroke={COLORS.CLIENT} strokeWidth={1} />)}
      </g>

      {/* ── HEADER — scene-ui V1: HTTPS (cyan) + · TLS (green) ── */}
      {headerOpacity > 0 && (
        <g opacity={headerOpacity}>
          <IntroHeaderMorphV1
            progress={morphP}
            categorySegments={[
              { label: INTRO_CATEGORY_LABEL + ' · ', color: COLORS.MUTED },
              { label: INTRO_DOMAIN, color: COLORS.SYSTEM },
            ]}
            titleSegments={[
              { label: INTRO_TITLE_A + ' ', color: COLORS.SYSTEM },
              { label: INTRO_TITLE_B, color: COLORS.SUCCESS },
            ]}
            subtitle={INTRO_SUBTITLE}
            titleFilter="url(#glow)"
            testId="https-tls-intro-header"
          />
        </g>
      )}

      {contentStarted && (
        <g>
          <ActBadgeNavigatorV1
            phases={PHASES}
            activeIndex={phaseIdx}
            testId="https-tls-act-navigator"
          />

          {/* ── BODY — local coordinate content (origin = body.x/body.y 44,235) ── */}
          <ContentBodyV1 debugName="https-tls-body">

          {/* ── BROWSER — panel kiri, Adib + request ── */}
          <g transform={T('browser', BROWSER_X, BROWSER_Y)} opacity={O('browser')}>
            <rect x={-130} y={-125} width={260} height={250} rx={16} fill={COLORS.PANEL} stroke={browserHttps ? COLORS.SUCCESS : COLORS.CLIENT} strokeWidth={2} filter="url(#shadow)" />
            {/* address bar */}
            <rect x={-116} y={-110} width={232} height={34} rx={8} fill={COLORS.BG} stroke={COLORS.BORDER} strokeWidth={1.5} />
            <g transform={`translate(-100, -93)`}>
              <circle cx={0} cy={0} r={7} fill={COLORS.BG} stroke={browserHttps ? COLORS.SUCCESS : COLORS.CLIENT} strokeWidth={2} />
              <rect x={-4} y={0} width={8} height={6} rx={1.5} fill={COLORS.BG} stroke={browserHttps ? COLORS.SUCCESS : COLORS.CLIENT} strokeWidth={1.5} />
            </g>
            <text x={-82} y={-88} fontSize={12} fontWeight={600} fontFamily="monospace" fill={browserHttps ? COLORS.SUCCESS : COLORS.TEXT}>
              {browserHttps ? 'https://' : 'http://'}{BROWSER_URL}
            </text>
            <text x={110} y={-88} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily="monospace" fill={browserHttps ? COLORS.SUCCESS : COLORS.CLIENT}>
              {browserHttps ? 'HTTPS' : 'HTTP'}
            </text>
            {/* chip Adib */}
            <circle cx={-100} cy={-46} r={15} fill={COLORS.CLIENT} opacity={0.2} stroke={COLORS.CLIENT} strokeWidth={1.5} />
            <circle cx={-100} cy={-50} r={5} fill={COLORS.CLIENT} />
            <path d="M -110 -38 Q -100 -30 -90 -38" fill="none" stroke={COLORS.CLIENT} strokeWidth={3} />
            <text x={-78} y={-43} fontSize={11} fontWeight={600} fill={COLORS.TEXT}>Adib</text>
            {/* konten — tombol Kirim + request */}
            <rect x={-100} y={-8} width={200} height={96} rx={10} fill={COLORS.BG} stroke={COLORS.BORDER} strokeWidth={1.5} />
            <text x={-84} y={16} fontSize={12} fontFamily="monospace" fill={COLORS.TEXT}>GET /profile</text>
            <text x={-84} y={36} fontSize={10} fontFamily="monospace" fill={COLORS.MUTED}>Host: {BROWSER_URL}</text>
            <rect x={-84} y={52} width={62} height={26} rx={13} fill={browserHttps ? COLORS.SUCCESS : COLORS.CLIENT} opacity={0.85} stroke={browserHttps ? COLORS.SUCCESS : COLORS.CLIENT} strokeWidth={1.5} />
            <text x={-53} y={69} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="sans-serif" fill="#020617">{browserHttps ? 'AMAN ✓' : 'KIRIM'}</text>
          </g>

          {/* key sesi sisi Browser (Act 3) */}
          <KeyGlyph x={KEY_BROWSER_X} y={KEY_BROWSER_Y} on={sessionKeyReady} />

          {/* ── SERVER — panel kanan ── */}
          <g transform={T('server', SERVER_X, SERVER_Y)} opacity={O('server') * serverDim}>
            <rect x={-120} y={-125} width={240} height={250} rx={16} fill={COLORS.PANEL} stroke={serverVerified ? COLORS.SUCCESS : COLORS.PROCESS} strokeWidth={2} filter="url(#shadow)" />
            <text x={0} y={-102} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily="monospace" letterSpacing={2} fill={COLORS.PROCESS}>SERVER</text>
            {/* rack slots */}
            <rect x={-100} y={-84} width={200} height={44} rx={8} fill={COLORS.BG} stroke={COLORS.BORDER} strokeWidth={1.5} />
            <rect x={-100} y={-30} width={200} height={44} rx={8} fill={COLORS.BG} stroke={COLORS.BORDER} strokeWidth={1.5} />
            <text x={-84} y={-60} fontSize={9} fontFamily="monospace" fill={COLORS.MUTED}>sertifikat keluar →</text>
            {/* layar decode — payload request Act 4 */}
            <rect x={-100} y={28} width={200} height={58} rx={8} fill={COLORS.BG} stroke={serverOpen ? COLORS.SUCCESS : COLORS.BORDER} strokeWidth={1.5} />
            {serverOpen ? (
              <g>
                <text x={-84} y={52} fontSize={12} fontWeight={700} fontFamily="monospace" fill={COLORS.SUCCESS}>{REQUEST_TEXT}</text>
                <text x={-84} y={72} fontSize={10} fontFamily="monospace" fill={COLORS.MUTED}>isi dibuka kunci sesi ✓</text>
              </g>
            ) : (
              <text x={-84} y={60} fontSize={10} fontFamily="monospace" fill={COLORS.MUTED}>menunggu payload</text>
            )}
            {serverVerified && (
              <g transform={`translate(78, 12)`} filter="url(#glow)">
                <circle r={16} fill={COLORS.SUCCESS} opacity={0.18} stroke={COLORS.SUCCESS} strokeWidth={2} />
                <text x={0} y={4} textAnchor="middle" fontSize={8} fontWeight={700} fontFamily="monospace" fill={COLORS.SUCCESS}>OK 200</text>
              </g>
            )}
          </g>

          {/* key sesi sisi Server (Act 3) */}
          <KeyGlyph x={KEY_SERVER_X} y={KEY_SERVER_Y} on={sessionKeyReady} />

          {/* ── TRANSIT — DIGAMBAR DI ATAS PANEL (revisi-01): tube "jembatan"
          menempel di muka Browser & Server, lebih lebar dari gap 110px, jadi
          terlihat utuh dan tidak tertutup Server/kartu HTTP ── */}
          {roadOpen && (
            <g>
              <line x1={ROAD_L} y1={ROAD_Y} x2={ROAD_R} y2={ROAD_Y} stroke={COLORS.BORDER} strokeWidth={3} strokeDasharray="10 8" />
              <rect x={ROAD_L} y={ROAD_Y - 30} width={ROAD_R - ROAD_L} height={18} rx={9} fill={COLORS.BG} opacity={0.6} />
              <text x={ROAD_L + 6} y={ROAD_Y - 16} fontSize={8} fontFamily="monospace" letterSpacing={1.5} fill={COLORS.MUTED}>JALAN PUBLIK</text>
            </g>
          )}

          {tunnelGate > 0 && (
            <g opacity={tunnelGate}>
              <rect x={TUNNEL_L} y={ROAD_Y - TUNNEL_HALF} width={TUNNEL_R - TUNNEL_L} height={TUNNEL_HALF * 2} rx={30} fill={COLORS.PANEL} stroke={COLORS.SYSTEM} strokeWidth={2.5} filter={tunnelLined ? 'url(#glow)' : undefined} />
              <rect x={TUNNEL_L} y={ROAD_Y - TUNNEL_HALF} width={TUNNEL_R - TUNNEL_L} height={26} rx={30} fill={COLORS.SYSTEM} opacity={0.14} />
              <text x={(TUNNEL_L + TUNNEL_R) / 2} y={ROAD_Y - 44} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="monospace" letterSpacing={2} fill={COLORS.SYSTEM}>TEROWONGAN TLS</text>
            </g>
          )}
          {tunnelLined && tunnelGate > 0 && (
            <g>
              <line x1={TUNNEL_L + 18} y1={ROAD_Y - 22} x2={TUNNEL_R - 18} y2={ROAD_Y - 22} stroke={COLORS.SYSTEM} strokeWidth={1.5} opacity={0.7} />
              <line x1={TUNNEL_L + 18} y1={ROAD_Y + 22} x2={TUNNEL_R - 18} y2={ROAD_Y + 22} stroke={COLORS.SYSTEM} strokeWidth={1.5} opacity={0.7} />
              <path d={`M ${TUNNEL_L + 28} ${ROAD_Y - 5} l 10 -10 l 0 6 l 10 -6`} fill="none" stroke={COLORS.SYSTEM} strokeWidth={1.5} opacity={0.55} />
              <path d={`M ${TUNNEL_R - 28} ${ROAD_Y - 5} l 10 -10 l 0 6 l 10 -6`} fill="none" stroke={COLORS.SYSTEM} strokeWidth={1.5} opacity={0.55} />
            </g>
          )}

          {/* paket HTTP polos act 1 — isi terbaca saat plaintext */}
          {httpPacketProg > 0.01 && (
            <Packet x={openPktX} y={ROAD_Y} text={plaintextPacket ? REQUEST_TEXT : ''} color={COLORS.CLIENT} highlighted={plaintextPacket} />
          )}

          {/* paket kedua act 1 — di dalam terowongan (tanpa teks) */}
          {tunnelPacketProg > 0.01 && (
            <Packet x={tunnelPktX} y={ROAD_Y} text="" locked color={COLORS.SYSTEM} />
          )}

          {/* peringatan jalan tidak aman */}
          {warnPulse && (
            <g filter="url(#glow)">
              <rect x={-74} y={-22} width={148} height={44} rx={10} fill="none" stroke={COLORS.DENY} strokeWidth={2.5} strokeDasharray="7 6" transform={`translate(${(TUNNEL_L + TUNNEL_R) / 2}, ${ROAD_Y - 52})`} />
              <text x={(TUNNEL_L + TUNNEL_R) / 2} y={ROAD_Y - 62} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="monospace" fill={COLORS.DENY}>WASPADA ISI TERBACA</text>
            </g>
          )}

          {/* ── PENGINTIP — di atas jalan, membaca paket / melihat bentuk ── */}
          <g transform={T('eaves', EAVE_X, EAVE_Y)} opacity={O('eaves')}>
            <path d="M -18 34 Q 0 18 18 34 L 18 42 L -18 42 Z" fill={COLORS.BORDER} />
            <line x1={6} y1={6} x2={6} y2={armEndY} stroke={eavesRead ? COLORS.DENY : COLORS.BORDER} strokeWidth={3} />
            <circle cx={0} cy={-22} r={13} fill={COLORS.PANEL} stroke={eavesLook} strokeWidth={2} />
            <circle cx={0} cy={-22} r={eavesSeesOuter ? 2 : 3.5} fill={eavesLook} />
            {eavesRead && (
              <g transform={`translate(6, ${armEndY})`}>
                <circle cx={0} cy={0} r={6} fill={COLORS.PANEL} stroke={COLORS.DENY} strokeWidth={2} />
                <path d="M 0 0 L 0 -6" stroke={COLORS.DENY} strokeWidth={2} />
              </g>
            )}
            {eavesLabel && (
              <g transform={`translate(0, -52)`}>
                <rect x={-44} y={-14} width={88} height={20} rx={8} fill={COLORS.BG} stroke={eavesLook} strokeWidth={1.5} />
                <text x={0} y={1} textAnchor="middle" fontSize={9} fontWeight={700} fontFamily="monospace" fill={eavesLook}>{eavesLabel}</text>
              </g>
            )}
          </g>

          {/* ── ACT 2 — rantai sertifikat di zona atas ── */}
          <g opacity={0.9}>
            <path d={`M ${ROOT_CA_X + 72} ${CERT_CARD_Y} L ${INTER_X - 72} ${CERT_CARD_Y}`} stroke={signatureTrusted ? COLORS.SUCCESS : COLORS.BORDER} strokeWidth={2} strokeDasharray="6 5" markerEnd={signatureTrusted ? undefined : 'url(#arrowSys)'} />
            <path d={`M ${INTER_X + 72} ${CERT_CARD_Y} L ${CERT_X - 72} ${CERT_CARD_Y}`} stroke={signatureTrusted ? COLORS.SUCCESS : COLORS.BORDER} strokeWidth={2} strokeDasharray="6 5" markerEnd={signatureTrusted ? undefined : 'url(#arrowSys)'} />
            <CertCard x={ROOT_CA_X} role="ROOT CA" ok={signatureTrusted} sig={signatureTrusted} />
            <CertCard x={INTER_X} role="INTERMEDIATE" ok={signatureTrusted} sig={signatureTrusted} />
            <CertCard x={CERT_X} role="SERTIFIKAT SERVER" domain={BROWSER_URL} ok={domainOk || signatureTrusted} sig={signatureTrusted} />
          </g>

          {/* indikator cek nama — dari Browser ke domain di kartu sertifikat */}
          {domainCheck && (
            <g stroke={domainOk ? COLORS.SUCCESS : COLORS.WARN} strokeWidth={2} strokeDasharray="5 5" fill="none">
              <circle cx={BROWSER_X} cy={BROWSER_Y - 92} r={8} />
              <path d={`M ${BROWSER_X} ${BROWSER_Y - 84} Q ${(BROWSER_X + CERT_X) / 2} ${CERT_CARD_Y + 60}, ${CERT_X} ${CERT_CARD_Y + 14}`} markerEnd="url(#arrowSys)" />
            </g>
          )}

          {/* impostor — server palsu ditolak */}
          {O('impostor') > 0.05 && (
            <g transform={T('impostor', IMPOSTOR_X, IMPOSTOR_Y)} opacity={O('impostor')}>
              <rect x={-48} y={-32} width={96} height={64} rx={10} fill={COLORS.PANEL} stroke={COLORS.DENY} strokeWidth={2} filter="url(#shadow)" />
              <text x={0} y={-14} textAnchor="middle" fontSize={8.5} fontWeight={700} fontFamily="monospace" letterSpacing={1} fill={COLORS.MUTED}>SERVER PALSU</text>
              <text x={0} y={12} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={COLORS.DENY}>nama tak cocok</text>
              {impostorX && (
                <g transform={`translate(40, -16)`} filter="url(#glow)">
                  <circle r={14} fill={COLORS.DENY} opacity={0.18} stroke={COLORS.DENY} strokeWidth={2} />
                  <line x1={-7} y1={-7} x2={7} y2={7} stroke={COLORS.DENY} strokeWidth={3} strokeLinecap="round" />
                  <line x1={7} y1={-7} x2={-7} y2={7} stroke={COLORS.DENY} strokeWidth={3} strokeLinecap="round" />
                </g>
              )}
            </g>
          )}

          {/* ── ACT 3 — bahan kunci & pemantulan paket kunci palsu ── */}
          {ingredientAProg > 0.01 && (
            <g transform={`translate(${ingAX}, ${ROAD_Y - 6})`}>
              <polygon points="0,-22 19,0 0,22 -19,0" fill={COLORS.BG} stroke={COLORS.CLIENT} strokeWidth={2.5} filter="url(#shadow)" />
              <text x={0} y={7} textAnchor="middle" fontSize={12} fontWeight={900} fontFamily="monospace" fill={COLORS.CLIENT}>A</text>
              <text x={0} y={-30} textAnchor="middle" fontSize={8} fontFamily="monospace" fill={COLORS.MUTED}>{INGREDIENT_A}</text>
            </g>
          )}
          {ingredientBProg > 0.01 && (
            <g transform={`translate(${ingBX}, ${ROAD_Y - 6})`}>
              <polygon points="0,-22 19,0 0,22 -19,0" fill={COLORS.BG} stroke={COLORS.CRYPTO} strokeWidth={2.5} filter="url(#shadow)" />
              <text x={0} y={7} textAnchor="middle" fontSize={12} fontWeight={900} fontFamily="monospace" fill={COLORS.CRYPTO}>B</text>
              <text x={0} y={-30} textAnchor="middle" fontSize={8} fontFamily="monospace" fill={COLORS.MUTED}>{INGREDIENT_B}</text>
            </g>
          )}
          {fakeKeyProg > 0.01 && (
            <g transform={T('fakeKey', fkX, ROAD_Y + 26)} opacity={O('fakeKey')}>
              <rect x={-40} y={-20} width={80} height={40} rx={10} fill={COLORS.PANEL} stroke={COLORS.DENY} strokeWidth={2} />
              <text x={0} y={4} textAnchor="middle" fontSize={9} fontWeight={700} fontFamily="monospace" fill={COLORS.DENY}>{FAKE_KEY_LABEL}</text>
              <line x1={-58} y1={0} x2={58} y2={0} stroke={fakeReflected ? 'none' : COLORS.DENY} strokeWidth={2} strokeDasharray="3 5" opacity={0.7} markerEnd="url(#arrowDeny)" />
            </g>
          )}
          {fakeReflected && (
            <g transform={`translate(318, ${ROAD_Y - 6})`} filter="url(#glow)">
              <circle r={9} fill={COLORS.DENY} opacity={0.2} stroke={COLORS.DENY} strokeWidth={2} />
              <path d="M -5 -3 Q 0 -9 5 -3" fill="none" stroke={COLORS.DENY} strokeWidth={2} strokeLinecap="round" transform="rotate(180 0 0)" />
              <line x1={0} y1={-12} x2={0} y2={-18} stroke={COLORS.DENY} strokeWidth={2} strokeLinecap="round" />
            </g>
          )}
          {sessionKeyReady && (
            <g transform={T('keyBadge', 366, ROAD_Y - 6)} opacity={O('keyBadge')} filter="url(#glow)">
              <circle r={20} fill={COLORS.SUCCESS} opacity={0.16} stroke={COLORS.SUCCESS} strokeWidth={2} />
              <rect x={-11} y={-10} width={22} height={15} rx={4} fill={COLORS.BG} stroke={COLORS.SUCCESS} strokeWidth={2.5} />
              <path d="M -8 -10 a 8 8 0 0 1 16 0" fill="none" stroke={COLORS.SUCCESS} strokeWidth={2.5} />
            </g>
          )}

          {/* ── ACT 4 — kapsul request terkunci menyusuri terowongan ── */}
          {capsuleProg > 0.01 && (
            <Capsule x={capX} y={ROAD_Y} />
          )}

          {/* ── CLOSING — dua cap payoff ── */}
          <g transform={T('closingStamps', 366, CLOSING_Y)} opacity={O('closingStamps')} filter="url(#glow)">
            <Stamp x={-170} y={0} color={COLORS.SUCCESS} top="HTTPS · aman" sub="isi request terlindungi" />
            <Stamp x={170} y={0} color={COLORS.CRYPTO} top="TLS · dipercaya" sub="kunci sesi bersama dua sisi" />
          </g>

          {/* ── CAPTION — strip lebar, zona kosong di bawah aktor ── */}
          {caption && (
            <g transform={`translate(366, ${CAPTION_Y[phaseIdx]})`}>
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