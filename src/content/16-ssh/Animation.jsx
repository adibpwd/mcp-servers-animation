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
  ACT1_BEATS, ACT2_CASE, ACT3_CASE, ACT4_CASE, ACT5_CASE, CLOSING_CAPTION,
  NEAR_CLIENT, MID, NEAR_SERVER, ALT_METHODS_PT, GATE_PT, SCOPE_PT,
  SHELL_OUTPUT_CARD_PT, LISTENER_PT, AUDIT_PT,
} from './data'
import { ACT_SCENES } from './acts'
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

  // ── travel — payload bergerak dari `from` ke `to` (koordinat absolut
  // local ContentBodyV1), fade-in di awal. EKSEKUSI-03 (lihat
  // revisi/2026-09-21-revisi-03-payload-read-hold-pauses.md): kalau
  // hold=false, payload TIBA dulu dalam kondisi penuh terlihat, ditahan
  // (`readHold` detik, default 1.5s) supaya sempat dibaca, baru fade-out —
  // bukan fade-out di dalam durasi travel itu sendiri. Caller tetap
  // memajukan `t` manual; readHold TIDAK otomatis ditambahkan ke `t`. ──
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
    t += 2.9 // EKSEKUSI-03: +1.2s baca hasil verifikasi (readHold, sebelumnya 1.7)

    goStage(tl, t, 'id-authorize')
    appear(tl, t + 0.05, 'policyGate', GATE_PT, {})
    appear(tl, t + 0.25, 'scopeToken', SCOPE_PT, { sfx: false })
    say(tl, t + 0.1, ACT2_CASE.copy.authorize)
    t += 3.3 // EKSEKUSI-03: +1.5s baca "scope: release only" (readHold, sebelumnya 1.8)

    goStage(tl, t, 'id-apply')
    say(tl, t + 0.05, ACT2_CASE.copy.apply)
    sfxOn(tl, t + 0.1, () => sfxLoader.success(SFX_MAP.DING.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 1.8

    goStage(tl, t, 'id-after')
    travel(tl, t, 'receipt', { from: MID, to: NEAR_CLIENT, duration: 0.9, hold: false, readHold: 1.5, sfxName: SFX_MAP.SWOOSH.name })
    say(tl, t + 0.1, ACT2_CASE.copy.after)
    t += 2.8 // EKSEKUSI-03: tunggu travel+readHold+fade selesai sebelum popOut
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
    travel(tl, t + 0.3, 'cmdCapsule', { from: NEAR_CLIENT, to: NEAR_SERVER, duration: 0.9, hold: false, readHold: 1.5 })
    t += 3.1 // EKSEKUSI-03: tunggu command capsule tiba + dibaca 1.5s + fade
    popOut(tl, t, 'shellPromptOut', {})

    goStage(tl, t, 'ch-shell-in')
    travel(tl, t, 'outputCapsule', { from: NEAR_SERVER, to: NEAR_CLIENT, duration: 0.9, hold: false, readHold: 2.0, sfxName: SFX_MAP.CHIME.name, sfxCategory: 'ui' })
    appear(tl, t + 0.9, 'shellOutputCard', SHELL_OUTPUT_CARD_PT, { sfx: false })
    t += 3.5 // EKSEKUSI-03: output dibaca 2.0s di client (sebelumnya total 2.7)
    popOut(tl, t, 'shellOutputCard', {})
    t += 0.3

    goStage(tl, t, 'ch-task-out')
    say(tl, t + 0.05, ACT3_CASE.task.copy)
    travel(tl, t + 0.1, 'taskCapsule', { from: NEAR_CLIENT, to: NEAR_SERVER, duration: 0.9, hold: false, readHold: 1.5 })
    t += 2.9 // EKSEKUSI-03: dibaca 1.5s sebelum fade

    goStage(tl, t, 'ch-task-in')
    travel(tl, t, 'statusCapsule', { from: NEAR_SERVER, to: NEAR_CLIENT, duration: 0.9, hold: false, readHold: 1.5, sfxName: SFX_MAP.CHIME.name, sfxCategory: 'ui' })
    t += 2.8 // EKSEKUSI-03: dibaca 1.5s sebelum fade

    goStage(tl, t, 'ch-file')
    say(tl, t + 0.05, ACT3_CASE.file.copy)
    appear(tl, t + 0.1, 'fileTile', NEAR_CLIENT, {})
    t += 0.7
    travel(tl, t, 'fileCapsule', { from: NEAR_CLIENT, to: NEAR_SERVER, duration: 1.0, hold: true })
    popOut(tl, t, 'fileTile', {})
    t += 1.0 // EKSEKUSI-03: tunggu capsule benar-benar tiba sebelum fileTray muncul (perbaikan overlap)
    appear(tl, t, 'fileTray', NEAR_SERVER, { sfx: false })
    sfxOn(tl, t, () => sfxLoader.success(SFX_MAP.DING.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 2.2 // EKSEKUSI-03: dibaca 2.2s dengan highlight kontras (sebelumnya 1.8)
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
    travel(tl, t + 0.2, 'queryCapsule', { from: NEAR_CLIENT, to: NEAR_SERVER, duration: 1.0, hold: false, readHold: 1.5 })
    t += 3.1 // EKSEKUSI-03: query dibaca 1.5s di Private DB sebelum fade

    goStage(tl, t, 'fw-apply')
    travel(tl, t, 'resultCapsule', { from: NEAR_SERVER, to: NEAR_CLIENT, duration: 1.0, hold: false, readHold: 1.8, sfxName: SFX_MAP.CHIME.name, sfxCategory: 'ui' })
    say(tl, t + 0.1, ACT4_CASE.copy.apply)
    t += 3.2 // EKSEKUSI-03: result dibaca 1.8s di Local App sebelum fade
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
    // EKSEKUSI-03: packet singgah 1.2s di node bastion sebelum lanjut ke target
    // (dua leg travel, bukan satu lompatan client→server langsung).
    travel(tl, t + 0.3, 'bastionPacket', { from: NEAR_CLIENT, to: MID, duration: 0.9, hold: true, sfxName: SFX_MAP.WHOOSH.name })
    const bastionLeg2 = t + 0.3 + 0.9 + 1.2
    travel(tl, bastionLeg2, 'bastionPacket', { from: MID, to: NEAR_SERVER, duration: 0.9, hold: false, readHold: 1.2, sfxName: SFX_MAP.WHOOSH.name })
    t = bastionLeg2 + 0.9 + 1.2 + 0.35 + 0.3
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
    travel(tl, t + 0.3, 'connEvent', { from: NEAR_CLIENT, to: NEAR_SERVER, duration: 0.9, hold: false, readHold: 1.3 })
    t += 1.6 // EKSEKUSI-03: beri sedikit ruang lebih sebelum audit timeline muncul
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
    t += 2.0 // EKSEKUSI-03: indikator deny merah dibaca 2.0s (sebelumnya 1.8)
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
            bg={2}
            bgScenes={ACT_SCENES}
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

            {/* ── scene ACT aktif (1 act = 1 file, lihat acts/) ── */}
            {(() => {
              const Act = ACT_SCENES[phaseIdx]
              return <Act state={{ pop, stage, trustBadgeOn, tunnelActive, channelDim, verifiedOn, keyStatus, allowShown, denyShown, alertOn }} />
            })()}
          </ContentBodyV1>
        </>
      )}
    </svg>
  )
}
