// src/content/84-network-ports/Animation.jsx
// ═══════════════════════════════════════════════════════════════════════════
// REVISI-01 (lihat revisi/2026-09-18-1213-revisi-01.md): rewrite total dari
// versi panel-statis ke Causal Motion Contract (docs/standardizations/03
// §1.T) — setiap konsep inti jadi PACKET nyata dengan before → intent →
// travel → apply → after, bukan kotak/label yang muncul berdampingan.
//
// Spine PERSISTEN (mounted sejak Act 1, TIDAK di-pop-out per-Act, sesuai
// Continuity/No-Teleport Contract §1.O): client app → IP host → port lane
// → listener/process → policy gate. Node yang belum dipakai tetap terlihat
// redup, bukan disembunyikan.
//
// 3 packet actor terpisah, masing-masing punya before/intent/travel/apply/
// after sendiri (bukan pelanggaran continuity — revisi eksplisit menyebut
// tiap actor baru "datang dari jaringan luar" / "client publik"):
//   - packetMain (violet) — client asli, hidup Act 1-4, retire di akhir Act 4
//   - packetUdp  (orange) — datagram DNS kontras, hidup hanya di Act 3
//   - packetExt  (merah)  — koneksi dari luar, uji scope+policy di Act 5,
//                           tiba di listener YANG SAMA (callback ke Act 2)
//   - packetPub  (cyan)   — client publik Act 6, lewat NAT ke backend
//
// Scene shell: scene-ui V1 (SceneChromeV1) tetap dipakai (topic ini portrait
// 820x1340, punya intro + 6 Act + badge/dot navigator — kriteria §1.S).
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, SFX_MAP,
  INTRO_CATEGORY_LABEL, INTRO_TITLE_A, INTRO_TITLE_B, INTRO_SUBTITLE,
  PRIMARY_LANE_ID, CLIENT_DEST_IP, ACT1_TEXT,
  ACT2_TEXT,
  TCP_STEPS, ACT3_TEXT,
  CONNECTION_ENDPOINT, ACT4_TEXT,
  ACT5_TEXT,
  REAL_PATH_HOPS, ACT6_TEXT,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'
import { SceneChromeV1, DEFAULT_LAYOUT_V1 } from '../../shared/scene-ui/v1'
import { ACT_SCENES } from './acts'
import { POS, LOWER_TOP, BW } from './acts/common'

export default function NetworkPortsAnimation({
  paused = false,
  speed = 1.0,
  volume = 75,
  previewSfx = true,
  audioUnlocked = false,
}) {
  const tlRef = useRef(null)
  const audioUnlockedRef = useRef(audioUnlocked)
  const volumeRef = useRef(volume)
  const speedRef = useRef(speed)

  const [phaseIdx, setPhaseIdx] = useState(0)
  const [morphP, setMorphP] = useState(0)
  const [showIntro, setShowIntro] = useState(true)

  // ── packets — actor nyata yang lahir, bergerak, lalu (kadang) retire.
  // Tiap entry: { x, y, opacity, scale, color, label }. Tidak ada di map
  // = belum lahir / sudah retire (tidak dirender). ──
  const [packets, setPackets] = useState({})
  // ── glow — kekuatan sorot 0..1 untuk node SPINE persisten (host, lane
  // aktif, listener, gateScope, gatePolicy, backend, health-N). ──
  const [glow, setGlow] = useState({})
  // ── near-element text badge (bukan caption bar bawah) — id -> string ──
  const [badge, setBadge] = useState({})
  const [udpStep, setUdpStep] = useState(null)
  const [tcpStep, setTcpStep] = useState(null)

  const G = (id) => glow[id] || 0

  useEffect(() => {
    const shouldEnable = previewSfx && audioUnlocked
    sfxLoader.setEnabled(shouldEnable)
    audioUnlockedRef.current = audioUnlocked
    volumeRef.current = volume
    speedRef.current = speed
  }, [previewSfx, audioUnlocked, volume, speed])

  // ── helper: packet lahir di (x,y) dengan pop kecil (Intent beat) ──
  const bornPacket = (tl, time, key, { x, y, color, label, sfxName = SFX_MAP.POP.name, sfxCategory = 'ui' }) => {
    tl.add(() => setPackets(p => ({ ...p, [key]: { x, y, scale: 0, opacity: 0, color, label } })), time)
    const o = { v: 0 }
    tl.to(o, {
      v: 1, duration: 0.35, ease: 'back.out(1.8)',
      onStart: () => sfxLoader.play(sfxCategory, sfxName, { volume: volumeRef.current, speed: speedRef.current }),
      onUpdate: () => setPackets(p => ({ ...p, [key]: { ...p[key], scale: o.v, opacity: o.v } })),
    }, time)
  }

  // ── helper: packet berjalan ke (x,y) — Travel beat, tidak teleport ──
  const movePacket = (tl, time, key, { x, y }, duration = 0.7, ease = 'power2.inOut') => {
    tl.add(() => {
      const cur = packets[key]
      const o = { x: cur ? cur.x : x, y: cur ? cur.y : y }
      tl.to(o, {
        x, y, duration, ease,
        onUpdate: () => setPackets(p => ({ ...p, [key]: { ...p[key], x: o.x, y: o.y } })),
      })
    }, time)
  }

  // ── helper: packet retire (After beat sudah dibaca, actor selesai) ──
  const retirePacket = (tl, time, key, duration = 0.3) => {
    const o = { v: 1 }
    tl.to(o, {
      v: 0, duration, ease: 'power1.in',
      onUpdate: () => setPackets(p => ({ ...p, [key]: p[key] ? { ...p[key], opacity: o.v, scale: o.v } : p[key] })),
      onComplete: () => setPackets(p => { const n = { ...p }; delete n[key]; return n }),
    }, time)
  }

  // ── helper: sorot node spine (Apply beat) ──
  const glowTo = (tl, time, id, value = 1, duration = 0.3) => {
    const o = { v: G(id) }
    tl.to(o, { v: value, duration, onUpdate: () => setGlow(g => ({ ...g, [id]: o.v })) }, time)
  }

  const setBadgeAt = (tl, time, id, text) => tl.add(() => setBadge(b => ({ ...b, [id]: text })), time)
  const clearBadge = (tl, time, id) => tl.add(() => setBadge(b => ({ ...b, [id]: null })), time)
  const sfxOn = (tl, time, fn) => tl.add(() => audioUnlockedRef.current && fn(), time)

  // ── koordinat spine — diimpor dari acts/common.jsx, sumber tunggal
  // (dipakai juga oleh tiap ActN.jsx untuk render, lihat revisi-02). ──

  // ═══════════════════════════════════════════════════════════════════════
  // MASTER TIMELINE
  // ═══════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 })
    tlRef.current = tl
    window.__animationTimeline = tl
    window.__flushSync = flushSync

    let t = 0

    tl.add(() => {
      setMorphP(0); setShowIntro(true); setPhaseIdx(0)
      setPackets({}); setGlow({}); setBadge({}); setUdpStep(null); setTcpStep(null)
    }, t)

    // ── INTRO ──
    t += 0.2
    const mo = { p: 0 }
    tl.to(mo, { p: 1, duration: 0.8, ease: 'power3.inOut', onUpdate: () => setMorphP(mo.p) }, t)
    sfxOn(tl, t, () => sfxLoader.transition(SFX_MAP.WHOOSH.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 0.8
    tl.add(() => setShowIntro(false), t)
    t += 0.2

    // ═══════════ ACT 1 — Host Bukan Service (`ip-ke-port`) ═══════════
    tl.add(() => setPhaseIdx(0), t)
    // Before: client hanya punya destination IP (host redup tampak, lane semua redup)
    setBadgeAt(tl, t, 'client', 'CLIENT')
    setBadgeAt(tl, t + 0.05, 'hostBefore', ACT1_TEXT.before)
    t += 0.8
    // Intent: packet lahir dari client
    bornPacket(tl, t, 'main', { x: POS.client.x, y: POS.client.y, color: COLORS.PACKET_MAIN, label: 'GET' })
    clearBadge(tl, t, 'hostBefore')
    t += 0.5
    // Travel: packet menuju host
    setBadgeAt(tl, t, 'travel1', ACT1_TEXT.travel)
    movePacket(tl, t, 'main', POS.host, 0.7)
    glowTo(tl, t + 0.3, 'host', 1, 0.4)
    setBadgeAt(tl, t + 0.6, 'hostIp', CLIENT_DEST_IP)
    t += 1.0
    clearBadge(tl, t, 'travel1')
    // Travel lanjut: packet menyempit ke lane :443
    movePacket(tl, t, 'main', POS.lane, 0.6)
    t += 0.7
    // Apply: packet masuk lane TCP :443 — lane lain tetap tidak menerima
    glowTo(tl, t, `lane-${PRIMARY_LANE_ID}`, 1, 0.25)
    sfxOn(tl, t, () => sfxLoader.impact(SFX_MAP.LOCK.name, { volume: volumeRef.current, speed: speedRef.current }))
    setBadgeAt(tl, t + 0.05, 'laneApply', ACT1_TEXT.apply)
    t += 1.0
    // After: hold, baca hasil
    setBadgeAt(tl, t, 'act1After', ACT1_TEXT.after)
    clearBadge(tl, t, 'laneApply')
    t += 1.3
    clearBadge(tl, t, 'act1After')
    t += 0.2

    // ═══════════ ACT 2 — Listener Menerima (`listener-menerima`) ═══════════
    tl.add(() => setPhaseIdx(1), t)
    // Before: lane :443 ada (glow sudah on dari Act 1), process masih redup
    setBadgeAt(tl, t, 'act2Before', ACT2_TEXT.before)
    t += 0.7
    clearBadge(tl, t, 'act2Before')
    // Intent+Travel: packet mengetuk listener
    setBadgeAt(tl, t, 'travel2', ACT2_TEXT.travel)
    movePacket(tl, t, 'main', POS.listener, 0.6)
    t += 0.8
    clearBadge(tl, t, 'travel2')
    // Apply: listener glow, packet masuk process
    glowTo(tl, t, 'listener', 1, 0.3)
    sfxOn(tl, t, () => sfxLoader.success(SFX_MAP.CONFIRM.name, { volume: volumeRef.current, speed: speedRef.current }))
    setBadgeAt(tl, t + 0.05, 'listenerApply', ACT2_TEXT.apply)
    t += 1.0
    // After
    clearBadge(tl, t, 'listenerApply')
    setBadgeAt(tl, t, 'act2After', ACT2_TEXT.after)
    t += 1.2
    clearBadge(tl, t, 'act2After')
    t += 0.2

    // ═══════════ ACT 3 — TCP dan UDP (`tcp-vs-udp`) ═══════════
    tl.add(() => setPhaseIdx(2), t)
    setBadgeAt(tl, t, 'act3Before', ACT3_TEXT.before)
    t += 0.7
    clearBadge(tl, t, 'act3Before')
    // Travel/Apply TCP — packetMain ping-pong SYN / SYN-ACK / ACK
    const sideL = { x: POS.listener.x - 90, y: POS.listener.y }
    const sideR = { x: POS.listener.x + 90, y: POS.listener.y }
    TCP_STEPS.forEach((s, i) => {
      const dest = s.from === 'client' ? sideR : sideL
      tl.add(() => setTcpStep(s.id), t)
      movePacket(tl, t, 'main', dest, 0.4)
      sfxOn(tl, t, () => sfxLoader.ui(SFX_MAP.TICK.name, { volume: volumeRef.current, speed: speedRef.current }))
      t += 0.55
    })
    tl.add(() => setTcpStep(null), t)
    glowTo(tl, t, 'listener', 1, 0.2)
    setBadgeAt(tl, t, 'tcpApply', ACT3_TEXT.tcpApply)
    t += 1.0
    clearBadge(tl, t, 'tcpApply')
    t += 0.2

    // Travel/Apply UDP — packetUdp terpisah, satu datagram langsung
    const udpSrc = { x: 150, y: LOWER_TOP + 60 }
    const udpDst = { x: BW - 150, y: LOWER_TOP + 60 }
    tl.add(() => setUdpStep('travel'), t)
    bornPacket(tl, t, 'udp', { x: udpSrc.x, y: udpSrc.y, color: COLORS.UDP, label: 'UDP' })
    t += 0.4
    movePacket(tl, t, 'udp', udpDst, 0.5, 'power1.in')
    t += 0.6
    tl.add(() => setUdpStep('apply'), t)
    sfxOn(tl, t, () => sfxLoader.success(SFX_MAP.DING.name, { volume: volumeRef.current, speed: speedRef.current }))
    setBadgeAt(tl, t + 0.05, 'udpApply', ACT3_TEXT.udpApply)
    t += 1.0
    retirePacket(tl, t, 'udp', 0.3)
    clearBadge(tl, t, 'udpApply')
    tl.add(() => setUdpStep(null), t)
    setBadgeAt(tl, t, 'act3After', ACT3_TEXT.after)
    t += 1.3
    clearBadge(tl, t, 'act3After')
    t += 0.2

    // ═══════════ ACT 4 — Dua Ujung Koneksi (`dua-ujung-port`) ═══════════
    tl.add(() => setPhaseIdx(3), t)
    // packetMain kembali diam persis di listener (posisi terakhir Act 3)
    tl.add(() => setPackets(p => (p.main ? { ...p, main: { ...p.main, x: POS.listener.x, y: POS.listener.y } } : p)), t)
    setBadgeAt(tl, t, 'act4Before', ACT4_TEXT.before)
    t += 0.8
    clearBadge(tl, t, 'act4Before')
    // Travel: source port ephemeral lahir di client
    setBadgeAt(tl, t, 'srcPortBadge', `src :${CONNECTION_ENDPOINT.srcPort}`)
    sfxOn(tl, t, () => sfxLoader.ui(SFX_MAP.POP.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 0.6
    // Apply: satu socket line mengikat client—listener
    glowTo(tl, t, 'socketLine', 1, 0.4)
    setBadgeAt(tl, t, 'dstPortBadge', `dst :${CONNECTION_ENDPOINT.dstPort}`)
    setBadgeAt(tl, t + 0.05, 'act4Apply', ACT4_TEXT.apply)
    sfxOn(tl, t, () => sfxLoader.success(SFX_MAP.DING.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 1.4
    clearBadge(tl, t, 'act4Apply')
    setBadgeAt(tl, t, 'act4After', ACT4_TEXT.after)
    t += 1.3
    clearBadge(tl, t, 'act4After')
    clearBadge(tl, t, 'srcPortBadge')
    clearBadge(tl, t, 'dstPortBadge')
    glowTo(tl, t, 'socketLine', 0, 0.3)
    // packetMain menyelesaikan cerita client asli — retire sebelum Act 5
    // memperkenalkan actor baru (packet dari luar), sesuai revisi.
    retirePacket(tl, t, 'main', 0.35)
    t += 0.5

    // ═══════════ ACT 5 — Scope dan Firewall (`scope-dan-policy`) ═══════════
    tl.add(() => setPhaseIdx(4), t)
    setBadgeAt(tl, t, 'act5Before', ACT5_TEXT.before)
    t += 0.8
    clearBadge(tl, t, 'act5Before')
    // Intent: packet BARU datang dari jaringan luar
    const extSrc = { x: 140, y: LOWER_TOP + 40 }
    bornPacket(tl, t, 'ext', { x: extSrc.x, y: extSrc.y, color: COLORS.PACKET_EXT, label: 'EXT' })
    setBadgeAt(tl, t + 0.1, 'extSrcBadge', 'Koneksi dari luar')
    t += 0.6
    // Travel: naik ke gate (bind scope dulu)
    movePacket(tl, t, 'ext', POS.gate, 0.7)
    t += 0.8
    clearBadge(tl, t, 'extSrcBadge')
    // Apply 1: bind scope
    glowTo(tl, t, 'gateScope', 1, 0.25)
    setBadgeAt(tl, t + 0.05, 'gateApply', ACT5_TEXT.scopeApply)
    sfxOn(tl, t, () => sfxLoader.ui(SFX_MAP.TICK.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 1.0
    // Apply 2: policy
    clearBadge(tl, t, 'gateApply')
    glowTo(tl, t, 'gatePolicy', 1, 0.25)
    setBadgeAt(tl, t + 0.05, 'gateApply', ACT5_TEXT.policyApply)
    sfxOn(tl, t, () => sfxLoader.success(SFX_MAP.CONFIRM.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 1.0
    clearBadge(tl, t, 'gateApply')
    // Lanjut: packet diteruskan ke listener yang SAMA (callback Act 2)
    movePacket(tl, t, 'ext', POS.listener, 0.6)
    t += 0.7
    sfxOn(tl, t, () => sfxLoader.success(SFX_MAP.DING.name, { volume: volumeRef.current, speed: speedRef.current }))
    setBadgeAt(tl, t, 'act5After', ACT5_TEXT.after)
    t += 1.3
    clearBadge(tl, t, 'act5After')
    retirePacket(tl, t, 'ext', 0.3)
    glowTo(tl, t, 'gateScope', 0, 0.3)
    glowTo(tl, t, 'gatePolicy', 0, 0.3)
    t += 0.4

    // ═══════════ ACT 6 — Jalur Nyata (`edge-ke-backend`) ═══════════
    tl.add(() => setPhaseIdx(5), t)
    setBadgeAt(tl, t, 'act6Before', ACT6_TEXT.before)
    t += 0.8
    clearBadge(tl, t, 'act6Before')
    const hopY = LOWER_TOP + 40
    const hopX = (i) => 90 + i * ((BW - 180) / (REAL_PATH_HOPS.length - 1))
    // Intent: client publik BARU menuju public endpoint
    bornPacket(tl, t, 'pub', { x: hopX(0), y: hopY, color: COLORS.PACKET_PUB, label: 'PUB' })
    glowTo(tl, t, 'hop-edge', 1, 0.25)
    t += 0.6
    // Travel: lewat NAT / load balancer
    setBadgeAt(tl, t, 'travel6', ACT6_TEXT.travel)
    movePacket(tl, t, 'pub', { x: hopX(1), y: hopY }, 0.6)
    glowTo(tl, t + 0.3, 'hop-nat', 1, 0.25)
    t += 0.7
    movePacket(tl, t, 'pub', { x: hopX(2), y: hopY }, 0.6)
    t += 0.7
    clearBadge(tl, t, 'travel6')
    // Apply: backend menerima request
    glowTo(tl, t, 'hop-backend', 1, 0.3)
    sfxOn(tl, t, () => sfxLoader.success(SFX_MAP.CONFIRM.name, { volume: volumeRef.current, speed: speedRef.current }))
    setBadgeAt(tl, t + 0.05, 'act6Apply', ACT6_TEXT.apply)
    t += 1.0
    clearBadge(tl, t, 'act6Apply')
    retirePacket(tl, t, 'pub', 0.3)
    // After: health signal muncul SETELAH respons, bertahap open→responds→healthy
    let ht = t + 0.2
    glowTo(tl, ht, 'health-open', 1, 0.2)
    sfxOn(tl, ht, () => sfxLoader.success(SFX_MAP.DING.name, { volume: volumeRef.current, speed: speedRef.current }))
    ht += 0.5
    glowTo(tl, ht, 'health-responds', 1, 0.2)
    sfxOn(tl, ht, () => sfxLoader.success(SFX_MAP.DING.name, { volume: volumeRef.current, speed: speedRef.current }))
    ht += 0.5
    glowTo(tl, ht, 'health-healthy', 1, 0.2)
    sfxOn(tl, ht, () => sfxLoader.warning(SFX_MAP.ALERT_PULSE.name, { volume: volumeRef.current, speed: speedRef.current }))
    ht += 0.4
    setBadgeAt(tl, ht, 'act6After', ACT6_TEXT.after)
    t = ht + 1.6
    clearBadge(tl, t, 'act6After')
    t += 0.5

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

  // (REVISI-02) render dipindah penuh ke acts/common.jsx + acts/ActN.jsx —
  // pola "1 act = 1 file", docs/standardizations/07-act-scene-pattern.md.
  // Animation.jsx hanya menjalankan timeline dan mengoper state ke ACT_SCENES.

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`}
      style={{ width: '100%', height: '100%', maxHeight: '100vh',
        maxWidth: `calc(100vh * ${VW} / ${VH})`, background: COLORS.BG, userSelect: 'none' }}>
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="b2" />
          <feMerge><feMergeNode in="b2" /><feMergeNode in="b1" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <rect x={0} y={0} width={VW} height={VH} fill={COLORS.BG} />
      <g opacity={0.05}>
        {Array.from({ length: 21 }).map((_, i) => <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={VH} stroke={COLORS.PORT} strokeWidth={1} />)}
        {Array.from({ length: 34 }).map((_, i) => <line key={`h${i}`} x1={0} y1={i * 40} x2={VW} y2={i * 40} stroke={COLORS.PORT} strokeWidth={1} />)}
      </g>

      <SceneChromeV1
        layout={DEFAULT_LAYOUT_V1}
        intro={{
          progress: morphP,
          category: INTRO_CATEGORY_LABEL,
          titleSegments: [
            { label: INTRO_TITLE_A, color: COLORS.IP },
            { label: INTRO_TITLE_B, color: COLORS.PORT },
          ],
          subtitle: INTRO_SUBTITLE,
          titleFilter: 'url(#glow)',
          testId: 'network-ports-intro-header',
          // (REVISI-02, UPDATE 6) thumbnail intro = scene Act 6 (jalur nyata),
          // visual paling lengkap untuk mewakili topic. bg 1-based ke ACT_SCENES.
          bg: 6,
          bgScenes: ACT_SCENES,
        }}
        showNavigator={!showIntro}
        navigator={{ phases: PHASES, activeIndex: phaseIdx }}
        showContent={!showIntro}
        content={{
          render: () => {
            const Act = ACT_SCENES[phaseIdx]
            return <Act state={{ glow, packets, badge, tcpStep, udpStep }} />
          },
        }}
      />
    </svg>
  )
}
