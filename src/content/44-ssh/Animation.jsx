// src/content/44-ssh/Animation.jsx
// ═══════════════════════════════════════════════════════════════════════════
// EKSEKUSI-02 (lihat revisi/2026-09-19-revisi-02-case-based-payload-flow.md):
// Act 1 TIDAK berubah (client/server/trust/tunnel — lihat EKSEKUSI-01 comment
// di data.js). Act 2–5 diganti total dari pola "chip row highlight" menjadi
// STUDI KASUS BERNAMA dengan alur before → intent → travel → apply → after:
//   Act 2 — akun deploy-bot: identity → authenticate → authorize → apply
//           (restricted task menyala, full shell/SFTP-only tetap redup).
//   Act 3 — kasus berurutan: remote shell (uptime) → remote task
//           (check-service) → file transfer (release.tar) — satu channel
//           yang sama membawa bentuk payload berbeda.
//   Act 4 — local app → local listener → tunnel → private DB → result,
//           dilanjutkan bastion: packet yang SAMA lewat client → bastion →
//           target privat.
//   Act 5 — key deploy-key aktif → lifecycle event mencabut key → percobaan
//           koneksi baru → policy gate menolak → audit timeline mencatat
//           allow lama dan deny baru + alert dot.
//
// Anchor persisten (Continuity map SSH_PLAN.md): Client (atas), SSH Server/
// sshd (bawah), dan satu Channel line di antaranya — TIDAK PERNAH dihapus,
// hanya di-morph. Semua payload Act 2–5 bergerak SEPANJANG channel yang sama
// lewat helper `travel` (posisi absolut, fade in/out, tidak ada teleport).
//
// Icon: inline SVG, konsisten dengan 17-rest-api — tidak ada folder icons/.
//
// CATATAN EKSEKUSI: kode + data ditulis sekali jalan, BELUM preview manual
// di browser maupun export MP4.
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, SFX_MAP,
  INTRO_CATEGORY_LABEL, INTRO_TITLE_A, INTRO_TITLE_B, INTRO_SUBTITLE,
  AXIS_X, CLIENT_Y, SERVER_Y, CHANNEL_TOP, CHANNEL_BOTTOM,
  CLIENT_LABEL, SERVER_LABEL, HOST_LABEL,
  ACT1_BEATS, ACT2_CASE, ACT3_CASE, ACT4_CASE, ACT5_CASE, CLOSING_CAPTION,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'
import { IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1 } from '../../shared/scene-ui/v1'

export default function SshAnimation({
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

  // ── header hero-to-header morph ──
  const [morphP, setMorphP] = useState(0)
  const [headerOpacity, setHeaderOpacity] = useState(0)
  const [contentStarted, setContentStarted] = useState(false)

  // ── stage — enum tunggal penentu beat aktif di zona INSET tengah ──
  const [stage, setStage] = useState('idle')

  // ── flag persisten lintas-Act (continuity map, Act 1 tidak berubah) ──
  const [trustBadgeOn, setTrustBadgeOn] = useState(false)
  const [tunnelActive, setTunnelActive] = useState(false)
  const [channelDim, setChannelDim] = useState(false)

  // ── state khusus tiap Act (EKSEKUSI-02) ──
  const [verifiedOn, setVerifiedOn] = useState(false)   // Act 2: badge verified pada identity card
  const [keyStatus, setKeyStatus] = useState('active')  // Act 5: 'active' | 'revoked'
  const [allowShown, setAllowShown] = useState(false)   // Act 5: audit timeline — event allow
  const [denyShown, setDenyShown] = useState(false)     // Act 5: audit timeline — event deny
  const [alertOn, setAlertOn] = useState(false)         // Act 5: alert dot berdenyut

  const P = (id) => pop[id] || { scale: 0, opacity: 0, x: 0, y: 0 }

  useEffect(() => {
    const shouldEnable = previewSfx && audioUnlocked
    sfxLoader.setEnabled(shouldEnable)
    audioUnlockedRef.current = audioUnlocked
    volumeRef.current = volume
    speedRef.current = speed
  }, [previewSfx, audioUnlocked, volume, speed])

  // ── popIn/popOut — dipakai untuk anchor Act 1 (client/server/hostLabel/
  // fingerprintCard) yang posisinya anchor-relative (delta x/y meluruh ke 0). ──
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

  // ── appear/travel — dipakai untuk seluruh entitas Act 2–5 (EKSEKUSI-02),
  // posisinya SELALU absolut (local ContentBodyV1), dirender lewat A(id).
  // `travel` memindahkan payload dari `from` ke `to` dengan fade in/out —
  // tidak pernah teleport (checklist: "Handoff source/target overlap
  // minimal satu frame"). ──
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
    const { from, to, duration = 0.9, ease = 'power2.inOut', hold = true,
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
        const fadeOut = hold ? 1 : Math.min(1, (1 - o.t) / 0.18)
        setPop(prev => ({ ...prev, [id]: { scale: 0.85 + 0.15 * fadeIn, opacity: Math.min(fadeIn, fadeOut), x, y } }))
      },
    }, time)
  }

  const say = (tl, time, text) => tl.add(() => setCaption(text), time)
  const sfxOn = (tl, time, fn) => tl.add(() => audioUnlockedRef.current && fn(), time)
  const goStage = (tl, time, id) => tl.add(() => setStage(id), time)

  // ── titik anchor absolut bersama Act 2–5 (local ContentBodyV1) ──
  const NEAR_CLIENT = { x: AXIS_X, y: 300 }
  const MID = { x: AXIS_X, y: 500 }
  const NEAR_SERVER = { x: AXIS_X, y: 740 }
  const ALT_METHODS_PT = { x: AXIS_X, y: 230 }
  const GATE_PT = { x: AXIS_X, y: 560 }
  const SCOPE_PT = { x: AXIS_X, y: 610 }
  const SHELL_OUTPUT_CARD_PT = { x: AXIS_X, y: 340 }
  const LISTENER_PT = { x: AXIS_X, y: 360 }
  const AUDIT_PT = { x: AXIS_X, y: 640 }

  // ═══════════════════════════════════════════════════════════════════════
  // MASTER TIMELINE — 5 Act tanpa jeda kosong.
  // ═══════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 })
    tlRef.current = tl
    window.__animationTimeline = tl
    window.__flushSync = flushSync

    let t = 0

    // ── reset state tiap awal loop (wajib, lihat ways-of-working) ──
    tl.add(() => {
      setMorphP(0); setHeaderOpacity(1); setContentStarted(false)
      setStage('idle')
      setTrustBadgeOn(false); setTunnelActive(false); setChannelDim(false)
      setVerifiedOn(false); setKeyStatus('active')
      setAllowShown(false); setDenyShown(false); setAlertOn(false)
      setPop({}); setCaption(''); setPhaseIdx(0)
    }, t)

    // ── INTRO — hero centered → header, tanpa typing (pola Tailscale) ──
    t += 0.2
    const mo = { p: 0 }
    tl.to(mo, { p: 1, duration: 0.8, ease: 'power3.inOut', onUpdate: () => setMorphP(mo.p) }, t)
    sfxOn(tl, t, () => sfxLoader.transition(SFX_MAP.TELEPORT.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 0.8
    tl.add(() => setContentStarted(true), t)

    // ═══════════════ ACT 1 — Hubungi & Verifikasi Server (tidak berubah) ═══
    tl.add(() => setPhaseIdx(0), t)
    popIn(tl, t + 0.05, 'client', { fromY: -20 })
    popIn(tl, t + 0.25, 'server', { fromY: 20, sfx: false })
    goStage(tl, t + 0.3, 'target')
    say(tl, t + 0.35, ACT1_BEATS.target.caption)
    popIn(tl, t + 0.55, 'hostLabel', {})
    t += 1.4
    say(tl, t, ACT1_BEATS.target.sub)
    t += 1.0

    goStage(tl, t, 'fingerprint')
    say(tl, t + 0.05, ACT1_BEATS.fingerprint.caption)
    popIn(tl, t + 0.15, 'fingerprintCard', { fromY: 16 })
    sfxOn(tl, t + 0.15, () => sfxLoader.ui(SFX_MAP.TICK.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 2.2

    goStage(tl, t, 'trust')
    tl.add(() => setTrustBadgeOn(true), t)
    say(tl, t + 0.05, ACT1_BEATS.trust.caption)
    sfxOn(tl, t + 0.05, () => sfxLoader.success(SFX_MAP.CONFIRM.name, { volume: volumeRef.current, speed: speedRef.current }))
    popOut(tl, t + 0.3, 'fingerprintCard', {})
    t += 1.6

    goStage(tl, t, 'tunnel')
    tl.add(() => setTunnelActive(true), t)
    say(tl, t + 0.05, ACT1_BEATS.tunnel.caption)
    sfxOn(tl, t + 0.1, () => sfxLoader.impact(SFX_MAP.LOCK.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 1.8
    say(tl, t, ACT1_BEATS.tunnel.sub)
    t += 1.6

    // ═══════════════ ACT 2 — Login vs Hak Akses ═══════════════
    // Studi kasus "Akun Deploy Terbatas" (EKSEKUSI-02)
    tl.add(() => setPhaseIdx(1), t)
    goStage(tl, t, 'id-identity')
    appear(tl, t + 0.05, 'identityCard', NEAR_CLIENT, {})
    appear(tl, t + 0.2, 'altMethods', ALT_METHODS_PT, { sfx: false })
    say(tl, t + 0.1, ACT2_CASE.copy.identity)
    t += 1.2

    goStage(tl, t, 'id-authenticate')
    travel(tl, t, 'identityCard', { from: NEAR_CLIENT, to: MID, duration: 0.9, sfx: false })
    appear(tl, t + 0.3, 'verifierRing', MID, { sfx: false })
    say(tl, t + 0.1, ACT2_CASE.copy.authenticate)
    sfxOn(tl, t + 0.9, () => sfxLoader.ui(SFX_MAP.TICK.name, { volume: volumeRef.current, speed: speedRef.current }))
    tl.add(() => setVerifiedOn(true), t + 1.0)
    sfxOn(tl, t + 1.0, () => sfxLoader.success(SFX_MAP.CONFIRM.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 1.7

    goStage(tl, t, 'id-authorize')
    appear(tl, t + 0.05, 'policyGate', GATE_PT, {})
    appear(tl, t + 0.25, 'scopeToken', SCOPE_PT, { sfx: false })
    say(tl, t + 0.1, ACT2_CASE.copy.authorize)
    t += 1.8

    goStage(tl, t, 'id-apply')
    say(tl, t + 0.05, ACT2_CASE.copy.apply)
    sfxOn(tl, t + 0.1, () => sfxLoader.success(SFX_MAP.DING.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 1.8

    goStage(tl, t, 'id-after')
    travel(tl, t, 'receipt', { from: MID, to: NEAR_CLIENT, duration: 0.9, hold: false, sfxName: SFX_MAP.SWOOSH.name })
    say(tl, t + 0.1, ACT2_CASE.copy.after)
    t += 1.8
    popOut(tl, t, 'identityCard', {})
    popOut(tl, t, 'altMethods', {})
    popOut(tl, t, 'verifierRing', {})
    popOut(tl, t, 'policyGate', {})
    popOut(tl, t, 'scopeToken', {})
    t += 0.3

    // ═══════════════ ACT 3 — Satu Kanal, Banyak Mode ═══════════════
    // Kasus berurutan "Inspect lalu Kirim Artefak" (EKSEKUSI-02)
    tl.add(() => setPhaseIdx(2), t)
    goStage(tl, t, 'ch-shell-out')
    appear(tl, t + 0.05, 'shellPromptOut', NEAR_CLIENT, {})
    say(tl, t + 0.1, ACT3_CASE.shell.copy)
    travel(tl, t + 0.3, 'cmdCapsule', { from: NEAR_CLIENT, to: NEAR_SERVER, duration: 0.9, hold: false })
    t += 1.5
    popOut(tl, t, 'shellPromptOut', {})

    goStage(tl, t, 'ch-shell-in')
    travel(tl, t, 'outputCapsule', { from: NEAR_SERVER, to: NEAR_CLIENT, duration: 0.9, hold: false, sfxName: SFX_MAP.CHIME.name, sfxCategory: 'ui' })
    t += 1.1
    appear(tl, t, 'shellOutputCard', SHELL_OUTPUT_CARD_PT, { sfx: false })
    t += 1.6
    popOut(tl, t, 'shellOutputCard', {})
    t += 0.3

    goStage(tl, t, 'ch-task-out')
    say(tl, t + 0.05, ACT3_CASE.task.copy)
    travel(tl, t + 0.1, 'taskCapsule', { from: NEAR_CLIENT, to: NEAR_SERVER, duration: 0.9, hold: false })
    t += 1.4

    goStage(tl, t, 'ch-task-in')
    travel(tl, t, 'statusCapsule', { from: NEAR_SERVER, to: NEAR_CLIENT, duration: 0.9, hold: false, sfxName: SFX_MAP.CHIME.name, sfxCategory: 'ui' })
    t += 1.3

    goStage(tl, t, 'ch-file')
    say(tl, t + 0.05, ACT3_CASE.file.copy)
    appear(tl, t + 0.1, 'fileTile', NEAR_CLIENT, {})
    t += 0.7
    travel(tl, t, 'fileCapsule', { from: NEAR_CLIENT, to: NEAR_SERVER, duration: 1.0, hold: true })
    popOut(tl, t, 'fileTile', {})
    t += 1.3
    appear(tl, t, 'fileTray', NEAR_SERVER, { sfx: false })
    sfxOn(tl, t, () => sfxLoader.success(SFX_MAP.DING.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 1.8
    say(tl, t, ACT3_CASE.after)
    t += 1.6
    popOut(tl, t, 'fileTray', {})
    popOut(tl, t, 'fileCapsule', {})
    t += 0.3

    // ═══════════════ ACT 4 — Jangkau Layanan Privat dengan Jalur Jelas ═══
    // Kasus "Aplikasi Lokal Menuju Database Privat" + lanjutan bastion (EKSEKUSI-02)
    tl.add(() => setPhaseIdx(3), t)
    goStage(tl, t, 'fw-before')
    appear(tl, t + 0.05, 'localApp', NEAR_CLIENT, {})
    say(tl, t + 0.1, ACT4_CASE.copy.before)
    t += 1.4

    goStage(tl, t, 'fw-listener')
    appear(tl, t + 0.05, 'listenerRing', LISTENER_PT, { sfx: false })
    say(tl, t + 0.1, ACT4_CASE.copy.listener)
    sfxOn(tl, t + 0.1, () => sfxLoader.ui(SFX_MAP.TICK.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 1.4

    goStage(tl, t, 'fw-travel')
    appear(tl, t + 0.05, 'dbNode', NEAR_SERVER, {})
    say(tl, t + 0.1, ACT4_CASE.copy.travel)
    travel(tl, t + 0.2, 'queryCapsule', { from: NEAR_CLIENT, to: NEAR_SERVER, duration: 1.0, hold: false })
    t += 1.7

    goStage(tl, t, 'fw-apply')
    travel(tl, t, 'resultCapsule', { from: NEAR_SERVER, to: NEAR_CLIENT, duration: 1.0, hold: false, sfxName: SFX_MAP.CHIME.name, sfxCategory: 'ui' })
    say(tl, t + 0.1, ACT4_CASE.copy.apply)
    t += 1.7
    say(tl, t, ACT4_CASE.copy.after)
    t += 1.6
    popOut(tl, t, 'localApp', {})
    popOut(tl, t, 'listenerRing', {})
    popOut(tl, t, 'dbNode', {})
    t += 0.3

    goStage(tl, t, 'fw-bastion')
    appear(tl, t + 0.05, 'bastionNode', MID, {})
    appear(tl, t + 0.1, 'targetNode', NEAR_SERVER, {})
    say(tl, t + 0.15, ACT4_CASE.bastion.copy)
    travel(tl, t + 0.3, 'bastionPacket', { from: NEAR_CLIENT, to: NEAR_SERVER, duration: 1.1, hold: false, sfxName: SFX_MAP.WHOOSH.name })
    t += 1.8
    say(tl, t, ACT4_CASE.bastion.note)
    t += 1.6
    popOut(tl, t, 'bastionNode', {})
    popOut(tl, t, 'targetNode', {})
    t += 0.3

    // ═══════════════ ACT 5 — Siklus Hidup Akses & Bukti ═══════════════
    // Kasus "Key Dicabut Saat Akses Tidak Lagi Diperlukan" (EKSEKUSI-02)
    tl.add(() => setPhaseIdx(4), t)
    tl.add(() => setChannelDim(true), t) // kanal meredup (bukan dihapus) — audit jadi fokus
    goStage(tl, t, 'ops-valid')
    appear(tl, t + 0.05, 'keyCard', NEAR_CLIENT, {})
    say(tl, t + 0.1, ACT5_CASE.copy.valid)
    travel(tl, t + 0.3, 'connEvent', { from: NEAR_CLIENT, to: NEAR_SERVER, duration: 0.9, hold: false })
    t += 1.4
    tl.add(() => setAllowShown(true), t)
    appear(tl, t, 'auditTimeline', AUDIT_PT, { sfx: false })
    sfxOn(tl, t, () => sfxLoader.ui(SFX_MAP.TICK.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 1.6

    goStage(tl, t, 'ops-lifecycle')
    say(tl, t + 0.05, ACT5_CASE.copy.lifecycle)
    tl.add(() => setKeyStatus('revoked'), t + 0.5)
    sfxOn(tl, t + 0.5, () => sfxLoader.play('warnings', SFX_MAP.ALERT_PULSE.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 1.8

    goStage(tl, t, 'ops-next')
    say(tl, t + 0.05, ACT5_CASE.copy.nextAttempt)
    travel(tl, t + 0.2, 'connEvent2', { from: NEAR_CLIENT, to: MID, duration: 0.9, hold: true })
    t += 1.5

    goStage(tl, t, 'ops-deny')
    say(tl, t + 0.05, ACT5_CASE.copy.deny)
    tl.add(() => { setDenyShown(true); setAlertOn(true) }, t + 0.3)
    sfxOn(tl, t + 0.3, () => sfxLoader.impact(SFX_MAP.LOCK.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 1.8
    say(tl, t, ACT5_CASE.copy.after)
    sfxOn(tl, t, () => sfxLoader.success(SFX_MAP.DING.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 1.8

    goStage(tl, t, 'ops-closing')
    say(tl, t, CLOSING_CAPTION)
    t += 2.2
    popOut(tl, t, 'keyCard', {})
    popOut(tl, t, 'auditTimeline', {})
    popOut(tl, t, 'connEvent2', {})
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

  // ── render helpers ──
  const T = (id, cx, cy) => {
    const p = P(id)
    return `translate(${cx + p.x}, ${cy + p.y}) scale(${p.scale})`
  }
  const O = (id) => P(id).opacity
  const A = (id) => T(id, 0, 0) // Act 2–5: posisi absolut, hasil appear()/travel()

  const channelColor = tunnelActive ? COLORS.TUNNEL : COLORS.BORDER
  const channelOpacity = tunnelActive ? (channelDim ? 0.35 : 1) : 0.5
  const channelWidth = tunnelActive ? 5 : 2
  const channelDash = tunnelActive ? undefined : '6 8'

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
        <marker id="arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
          <path d="M 0 0 L 10 5 L 0 10 z" fill={COLORS.BASTION} />
        </marker>
      </defs>

      <rect x={0} y={0} width={VW} height={VH} fill={COLORS.BG} />
      <g opacity={0.05}>
        {Array.from({ length: 21 }).map((_, i) => <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={VH} stroke={COLORS.TRUST} strokeWidth={1} />)}
        {Array.from({ length: 34 }).map((_, i) => <line key={`h${i}`} x1={0} y1={i * 40} x2={VW} y2={i * 40} stroke={COLORS.TRUST} strokeWidth={1} />)}
      </g>

      {headerOpacity > 0 && (
        <g opacity={headerOpacity}>
          <IntroHeaderMorphV1
            progress={morphP}
            category={INTRO_CATEGORY_LABEL}
            titleSegments={[
              { label: INTRO_TITLE_A + ' ', color: COLORS.TRUST },
              { label: INTRO_TITLE_B, color: COLORS.TUNNEL },
            ]}
            subtitle={INTRO_SUBTITLE}
            titleFilter="url(#glow)"
            testId="ssh-intro-header"
          />
        </g>
      )}

      {contentStarted && (
        <>
          <ActBadgeNavigatorV1 phases={PHASES} activeIndex={phaseIdx} testId="ssh-act-nav" />
          <ContentBodyV1 debugName="ssh-body">
            {/* ── caption ── */}
            <text x={366} y={30} textAnchor="middle" fontSize={20} fontWeight={700}
              fontFamily="sans-serif" fill={COLORS.TEXT}>
              {caption}
            </text>

            {/* ── channel line persisten (public → encrypted → dim) ── */}
            <line x1={AXIS_X} y1={CHANNEL_TOP} x2={AXIS_X} y2={CHANNEL_BOTTOM}
              stroke={channelColor} strokeWidth={channelWidth} strokeDasharray={channelDash}
              opacity={channelOpacity} filter={tunnelActive && !channelDim ? 'url(#glow)' : undefined} />

            {/* ── client anchor (persisten) ── */}
            <g transform={T('client', AXIS_X, CLIENT_Y)} opacity={O('client')}>
              <rect x={-55} y={-38} width={110} height={70} rx={10} fill={COLORS.PANEL} stroke={COLORS.CLIENT} strokeWidth={2} />
              <rect x={-42} y={-28} width={84} height={44} rx={4} fill={COLORS.BG} stroke={COLORS.CLIENT} strokeWidth={1} />
              <text x={0} y={-2} textAnchor="middle" fontSize={16} fill={COLORS.CLIENT} fontFamily="monospace">&gt;_</text>
              <text x={0} y={52} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily="sans-serif" fill={COLORS.TEXT}>{CLIENT_LABEL}</text>
            </g>

            {/* ── server anchor (persisten) + trust badge handoff dari fingerprint card ── */}
            <g transform={T('server', AXIS_X, SERVER_Y)} opacity={O('server')}>
              <rect x={-60} y={-40} width={120} height={80} rx={10} fill={COLORS.PANEL} stroke={COLORS.SERVER} strokeWidth={2} />
              <rect x={-46} y={-26} width={92} height={10} rx={2} fill={COLORS.SERVER} opacity={0.7} />
              <rect x={-46} y={-10} width={92} height={10} rx={2} fill={COLORS.SERVER} opacity={0.45} />
              <rect x={-46} y={6} width={92} height={10} rx={2} fill={COLORS.SERVER} opacity={0.25} />
              <text x={0} y={58} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily="sans-serif" fill={COLORS.TEXT}>{SERVER_LABEL}</text>
              {trustBadgeOn && (
                <g transform="translate(48, -44)">
                  <circle r={14} fill={COLORS.TRUST} filter="url(#glow)" />
                  <path d="M -6 0 L -1 5 L 7 -6" stroke={COLORS.BG} strokeWidth={2.5} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                </g>
              )}
            </g>

            {/* ── host label chip (dekat channel atas) ── */}
            <g transform={T('hostLabel', AXIS_X, CHANNEL_TOP + 20)} opacity={O('hostLabel')}>
              <rect x={-140} y={-14} width={280} height={28} rx={14} fill={COLORS.PANEL} stroke={COLORS.BORDER} strokeWidth={1} />
              <text x={0} y={5} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={COLORS.MUTED}>{HOST_LABEL}</text>
            </g>

            {/* ── ACT 1: fingerprint card (tidak berubah) ── */}
            {stage === 'fingerprint' && (
              <g transform={T('fingerprintCard', AXIS_X, 480)} opacity={O('fingerprintCard')}>
                <rect x={-170} y={-50} width={340} height={100} rx={12} fill={COLORS.PANEL} stroke={COLORS.TRUST} strokeWidth={2} filter="url(#shadow)" />
                <text x={0} y={-22} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily="sans-serif" fill={COLORS.TRUST}>HOST KEY FINGERPRINT</text>
                <text x={0} y={2} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={COLORS.MUTED}>{ACT1_BEATS.fingerprint.knownHosts}</text>
                <text x={0} y={22} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={COLORS.TEXT}>{ACT1_BEATS.fingerprint.seenHost}</text>
              </g>
            )}

            {/* ── ACT 2: identity card deploy-bot (studi kasus, EKSEKUSI-02) ── */}
            {(stage === 'id-identity' || stage === 'id-authenticate' || stage === 'id-authorize' || stage === 'id-apply' || stage === 'id-after') && (
              <g transform={A('identityCard')} opacity={O('identityCard')}>
                <rect x={-90} y={-34} width={180} height={68} rx={12} fill={COLORS.PANEL} stroke={COLORS.AUTH} strokeWidth={2} />
                <text x={0} y={-6} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily="monospace" fill={COLORS.AUTH}>{ACT2_CASE.identityLabel}</text>
                <text x={0} y={16} textAnchor="middle" fontSize={9.5} fontFamily="sans-serif" fill={COLORS.MUTED}>{ACT2_CASE.proofLabel}</text>
                {verifiedOn && (
                  <g transform="translate(66, -26)">
                    <circle r={11} fill={COLORS.TUNNEL} />
                    <path d="M -4 0 L -1 4 L 5 -5" stroke={COLORS.BG} strokeWidth={2} fill="none" strokeLinecap="round" strokeLinejoin="round" />
                  </g>
                )}
              </g>
            )}

            {stage === 'id-identity' && (
              <g transform={A('altMethods')} opacity={O('altMethods')}>
                <text x={0} y={0} textAnchor="middle" fontSize={9.5} fontFamily="sans-serif" fill={COLORS.MUTED}>
                  alternatif: {ACT2_CASE.altMethods.join(' · ')}
                </text>
              </g>
            )}

            {stage === 'id-authenticate' && (
              <g transform={A('verifierRing')} opacity={O('verifierRing')}>
                <circle r={46} fill="none" stroke={COLORS.AUTH} strokeWidth={2} strokeDasharray="6 5" />
                <text x={0} y={64} textAnchor="middle" fontSize={10} fontFamily="sans-serif" fill={COLORS.MUTED}>{ACT2_CASE.verifierLabel}</text>
              </g>
            )}

            {(stage === 'id-authorize' || stage === 'id-apply' || stage === 'id-after') && (
              <>
                <g transform={A('policyGate')} opacity={O('policyGate')}>
                  <rect x={-110} y={-24} width={220} height={48} rx={10} fill={COLORS.PANEL} stroke={COLORS.AUTHZ} strokeWidth={2} />
                  <text x={0} y={5} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="sans-serif" fill={COLORS.AUTHZ}>{ACT2_CASE.policyLabel}</text>
                </g>
                <g transform={A('scopeToken')} opacity={O('scopeToken')}>
                  <text x={0} y={0} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={COLORS.MUTED}>scope: {ACT2_CASE.scopeToken}</text>
                </g>
                {ACT2_CASE.outcomes.map((oc, i) => {
                  const lit = oc.selected && (stage === 'id-apply' || stage === 'id-after')
                  const x = AXIS_X + (i - 1) * 190
                  return (
                    <g key={oc.id} transform={`translate(${x}, 670)`}>
                      <rect x={-82} y={-22} width={164} height={44} rx={10}
                        fill={lit ? COLORS.AUTHZ : COLORS.PANEL}
                        stroke={COLORS.AUTHZ} strokeWidth={lit ? 0 : 1.5} opacity={lit ? 1 : 0.4} />
                      <text x={0} y={5} textAnchor="middle" fontSize={10} fontWeight={700}
                        fontFamily="sans-serif" fill={lit ? COLORS.BG : COLORS.MUTED}>{oc.label}</text>
                    </g>
                  )
                })}
              </>
            )}

            {stage === 'id-after' && (
              <g transform={A('receipt')} opacity={O('receipt')}>
                <rect x={-60} y={-18} width={120} height={36} rx={8} fill={COLORS.OPS} />
                <text x={0} y={5} textAnchor="middle" fontSize={9.5} fontWeight={700} fontFamily="sans-serif" fill={COLORS.BG}>{ACT2_CASE.receiptLabel}</text>
              </g>
            )}

            {/* ── ACT 3: remote shell (uptime) — EKSEKUSI-02 ── */}
            {stage === 'ch-shell-out' && (
              <>
                <g transform={A('shellPromptOut')} opacity={O('shellPromptOut')}>
                  <rect x={-150} y={-30} width={300} height={60} rx={10} fill={COLORS.BG} stroke={COLORS.SERVER} strokeWidth={1.5} />
                  <text x={0} y={6} textAnchor="middle" fontSize={12} fontFamily="monospace" fill={COLORS.TUNNEL}>{ACT3_CASE.shell.prompt}</text>
                </g>
                <g transform={A('cmdCapsule')} opacity={O('cmdCapsule')}>
                  <rect x={-46} y={-16} width={92} height={32} rx={16} fill={COLORS.CLIENT} />
                  <text x={0} y={5} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="monospace" fill={COLORS.BG}>{ACT3_CASE.shell.command}</text>
                </g>
              </>
            )}
            {stage === 'ch-shell-in' && (
              <>
                <g transform={A('outputCapsule')} opacity={O('outputCapsule')}>
                  <rect x={-50} y={-16} width={100} height={32} rx={16} fill={COLORS.SERVER} />
                  <text x={0} y={5} textAnchor="middle" fontSize={9.5} fontWeight={700} fontFamily="monospace" fill={COLORS.BG}>{ACT3_CASE.shell.outputBadge}</text>
                </g>
                <g transform={A('shellOutputCard')} opacity={O('shellOutputCard')}>
                  <rect x={-150} y={-26} width={300} height={52} rx={10} fill={COLORS.PANEL} stroke={COLORS.SERVER} strokeWidth={1.5} />
                  <text x={0} y={5} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={COLORS.TEXT}>{ACT3_CASE.shell.output}</text>
                </g>
              </>
            )}

            {/* ── ACT 3: remote task (check-service) ── */}
            {stage === 'ch-task-out' && (
              <g transform={A('taskCapsule')} opacity={O('taskCapsule')}>
                <rect x={-56} y={-16} width={112} height={32} rx={16} fill={COLORS.AUTH} />
                <text x={0} y={5} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="monospace" fill={COLORS.BG}>{ACT3_CASE.task.command}</text>
              </g>
            )}
            {stage === 'ch-task-in' && (
              <g transform={A('statusCapsule')} opacity={O('statusCapsule')}>
                <rect x={-50} y={-16} width={100} height={32} rx={16} fill={COLORS.TUNNEL} />
                <text x={0} y={5} textAnchor="middle" fontSize={9.5} fontWeight={700} fontFamily="monospace" fill={COLORS.BG}>{ACT3_CASE.task.statusToken}</text>
              </g>
            )}

            {/* ── ACT 3: file transfer (release.tar) ── */}
            {stage === 'ch-file' && (
              <>
                <g transform={A('fileTile')} opacity={O('fileTile')}>
                  <rect x={-70} y={-24} width={140} height={48} rx={8} fill={COLORS.PANEL} stroke={COLORS.TEXT} strokeWidth={1.5} />
                  <text x={0} y={5} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={COLORS.TEXT}>{ACT3_CASE.file.fileName}</text>
                </g>
                <g transform={A('fileCapsule')} opacity={O('fileCapsule')}>
                  <rect x={-70} y={-20} width={140} height={40} rx={20} fill={COLORS.AUTHZ} />
                  <text x={0} y={5} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="monospace" fill={COLORS.BG}>{ACT3_CASE.file.fileName}</text>
                </g>
                <g transform={A('fileTray')} opacity={O('fileTray')}>
                  <rect x={-160} y={-30} width={320} height={60} rx={10} fill={COLORS.PANEL} stroke={COLORS.OPS} strokeWidth={2} />
                  <text x={0} y={-6} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="sans-serif" fill={COLORS.OPS}>FILE TRAY</text>
                  <text x={0} y={14} textAnchor="middle" fontSize={9} fontFamily="sans-serif" fill={COLORS.MUTED}>
                    contoh transfer: {ACT3_CASE.file.mechanisms.join(' · ')}
                  </text>
                </g>
              </>
            )}

            {/* ── ACT 4: local app → listener → tunnel → private DB (EKSEKUSI-02) ── */}
            {(stage === 'fw-before' || stage === 'fw-listener' || stage === 'fw-travel' || stage === 'fw-apply') && (
              <g transform={A('localApp')} opacity={O('localApp')}>
                <rect x={-70} y={-24} width={140} height={48} rx={10} fill={COLORS.PANEL} stroke={COLORS.CLIENT} strokeWidth={2} />
                <text x={0} y={5} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="sans-serif" fill={COLORS.TEXT}>{ACT4_CASE.localApp.label}</text>
              </g>
            )}
            {(stage === 'fw-listener' || stage === 'fw-travel' || stage === 'fw-apply') && (
              <g transform={A('listenerRing')} opacity={O('listenerRing')}>
                <circle r={26} fill="none" stroke={COLORS.FORWARD} strokeWidth={2} strokeDasharray="5 4" />
                <text x={0} y={44} textAnchor="middle" fontSize={9.5} fontFamily="monospace" fill={COLORS.MUTED}>{ACT4_CASE.listenerLabel}</text>
              </g>
            )}
            {(stage === 'fw-travel' || stage === 'fw-apply') && (
              <g transform={A('dbNode')} opacity={O('dbNode')}>
                <rect x={-80} y={-28} width={160} height={56} rx={10} fill={COLORS.PANEL} stroke={COLORS.SERVER} strokeWidth={2} />
                <text x={0} y={6} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="sans-serif" fill={COLORS.TEXT}>{ACT4_CASE.dbNode.label}</text>
              </g>
            )}
            {stage === 'fw-travel' && (
              <g transform={A('queryCapsule')} opacity={O('queryCapsule')}>
                <rect x={-50} y={-16} width={100} height={32} rx={16} fill={COLORS.FORWARD} />
                <text x={0} y={5} textAnchor="middle" fontSize={9.5} fontWeight={700} fontFamily="monospace" fill={COLORS.BG}>query</text>
              </g>
            )}
            {stage === 'fw-apply' && (
              <g transform={A('resultCapsule')} opacity={O('resultCapsule')}>
                <rect x={-50} y={-16} width={100} height={32} rx={16} fill={COLORS.TUNNEL} />
                <text x={0} y={5} textAnchor="middle" fontSize={9.5} fontWeight={700} fontFamily="monospace" fill={COLORS.BG}>result</text>
              </g>
            )}

            {/* ── ACT 4: bastion / jump host — packet sama, tujuan bergeser ── */}
            {stage === 'fw-bastion' && (
              <>
                <g transform={A('bastionNode')} opacity={O('bastionNode')}>
                  <rect x={-90} y={-28} width={180} height={56} rx={10} fill={COLORS.PANEL} stroke={COLORS.BASTION} strokeWidth={2} />
                  <text x={0} y={6} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="sans-serif" fill={COLORS.TEXT}>{ACT4_CASE.bastion.label}</text>
                </g>
                <g transform={A('targetNode')} opacity={O('targetNode')}>
                  <rect x={-80} y={-28} width={160} height={56} rx={10} fill={COLORS.PANEL} stroke={COLORS.TRUST} strokeWidth={2} />
                  <text x={0} y={6} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="sans-serif" fill={COLORS.TEXT}>{ACT4_CASE.bastion.targetLabel}</text>
                </g>
                <g transform={A('bastionPacket')} opacity={O('bastionPacket')}>
                  <rect x={-46} y={-16} width={92} height={32} rx={16} fill={COLORS.BASTION} />
                  <text x={0} y={5} textAnchor="middle" fontSize={9.5} fontWeight={700} fontFamily="monospace" fill={COLORS.BG}>packet</text>
                </g>
              </>
            )}

            {/* ── ACT 5: key lifecycle & audit (deploy-key) — EKSEKUSI-02 ── */}
            {(stage === 'ops-valid' || stage === 'ops-lifecycle' || stage === 'ops-next' || stage === 'ops-deny' || stage === 'ops-closing') && (
              <g transform={A('keyCard')} opacity={O('keyCard')}>
                <rect x={-90} y={-30} width={180} height={60} rx={10} fill={COLORS.PANEL}
                  stroke={keyStatus === 'revoked' ? COLORS.RISK : COLORS.OPS} strokeWidth={2} />
                <text x={0} y={-6} textAnchor="middle" fontSize={12} fontWeight={700} fontFamily="monospace" fill={COLORS.TEXT}>{ACT5_CASE.keyId}</text>
                <text x={0} y={16} textAnchor="middle" fontSize={9.5} fontFamily="sans-serif"
                  fill={keyStatus === 'revoked' ? COLORS.RISK : COLORS.OPS}>
                  {keyStatus === 'revoked' ? ACT5_CASE.statusRevoked : ACT5_CASE.statusActive}
                </text>
              </g>
            )}

            {stage === 'ops-valid' && (
              <g transform={A('connEvent')} opacity={O('connEvent')}>
                <rect x={-50} y={-16} width={100} height={32} rx={16} fill={COLORS.OPS} />
                <text x={0} y={5} textAnchor="middle" fontSize={9.5} fontWeight={700} fontFamily="monospace" fill={COLORS.BG}>connect</text>
              </g>
            )}

            {(stage === 'ops-next' || stage === 'ops-deny' || stage === 'ops-closing') && (
              <g transform={A('connEvent2')} opacity={O('connEvent2')}>
                <rect x={-50} y={-16} width={100} height={32} rx={16} fill={denyShown ? COLORS.RISK : COLORS.AUTH} />
                <text x={0} y={5} textAnchor="middle" fontSize={9.5} fontWeight={700} fontFamily="monospace" fill={COLORS.BG}>connect</text>
                {denyShown && (
                  <path d="M -56 -22 L 56 22 M 56 -22 L -56 22" stroke={COLORS.RISK} strokeWidth={4} strokeLinecap="round" />
                )}
              </g>
            )}

            {(stage === 'ops-valid' || stage === 'ops-lifecycle' || stage === 'ops-next' || stage === 'ops-deny' || stage === 'ops-closing') && (
              <g transform={A('auditTimeline')} opacity={O('auditTimeline')}>
                <rect x={-170} y={-40} width={340} height={80} rx={10} fill={COLORS.PANEL} stroke={COLORS.BORDER} strokeWidth={1.5} />
                <text x={-150} y={-18} fontSize={10} fontWeight={700} fontFamily="sans-serif" fill={COLORS.MUTED}>AUDIT TIMELINE</text>
                {allowShown && (
                  <text x={-150} y={4} fontSize={10} fontFamily="monospace" fill={COLORS.OPS}>{ACT5_CASE.events[0].label}</text>
                )}
                {denyShown && (
                  <text x={-150} y={24} fontSize={10} fontFamily="monospace" fill={COLORS.RISK}>{ACT5_CASE.events[1].label}</text>
                )}
                {alertOn && (
                  <circle cx={150} cy={14} r={7} fill={COLORS.RISK} />
                )}
              </g>
            )}
          </ContentBodyV1>
        </>
      )}
    </svg>
  )
}
