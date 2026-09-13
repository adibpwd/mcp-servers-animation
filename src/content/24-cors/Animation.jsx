// ═══════════════════════════════════════════════════════════════════════════
// src/content/24-cors/Animation.jsx
// ─────────────────────────────────────────────────────────────────────────
// REBUILD 2026-09-13 (lihat _docs/CORS_PLAN.md): dibangun ulang dari nol,
// mengabaikan implementasi lama di _archive/backup-24-cors-20260913/.
// Scene shell scene-ui V1 (IntroHeaderMorphV1, ActBadgeNavigatorV1,
// ContentBodyV1) — pola & helper (popIn/popOut/travel/master timeline
// time-cursor) mengikuti referensi 17-rest-api/Animation.jsx.
//
// STATUS: kode + data first pass, BELUM preview manual & export MP4.
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, SFX_MAP,
  INTRO_CATEGORY_LABEL, INTRO_DOMAIN, INTRO_TITLE_A, INTRO_TITLE_B, INTRO_SUBTITLE,
  AXIS_X, APP_Y, GATE_Y, API_Y, POLICY_Y, FLOW_WAYPOINTS,
  BROWSER_PANEL, SERVER_PANEL, DIVIDER_Y, CORRIDOR,
  CAPTION_SLOT_BROWSER_Y, CAPTION_SLOT_SERVER_Y,
  LANE_REQUEST_X, LANE_RESPONSE_X, FLOW_NODES, FLOW_STEPPER_Y,
  GUARDRAIL_X, GUARDRAIL_Y,
  APP_LABEL, GATE_LABEL, API_LABEL, POLICY_LABEL, BROWSER_ZONE_LABEL, SERVER_ZONE_LABEL,
  REQUESTS, GUARDRAIL_ALLOWED, GUARDRAIL_BLOCKED, WILDCARD_GUARD_TEXT, NOT_AUTH_TEXT,
  TOTAL_DURATION,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'
import {
  IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1, DEFAULT_LAYOUT_V1, estimateTextWidth,
} from '../../shared/scene-ui/v1'

const lerp = (a, b, t) => a + (b - a) * t

export default function CorsAnimation({
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
  const [pop, setPop] = useState({})

  // ── header morph (IntroHeaderMorphV1) ──
  const [morphP, setMorphP] = useState(0)
  // navigator (ActBadgeNavigatorV1) baru boleh muncul setelah header morph
  // selesai — bukan bareng dari awal timeline (lihat pola 25/26).
  const [contentStarted, setContentStarted] = useState(false)

  // ── activeNote — SATU channel caption, posisi & warna berubah tiap
  // panggilan supaya SELALU dekat objek yang sedang dibahas (lihat
  // docs/standardizations/03-planning-storytelling-quality-gate.md
  // §D "Caption & Teks" — caption bar bawah layar sudah deprecated). ──
  const [activeNote, setActiveNote] = useState(null)

  // ── tiket request (pergi) & response (balik) — REVISI-05: request SELALU
  // di LANE_REQUEST_X (kanan, turun), response SELALU di LANE_RESPONSE_X
  // (kiri, naik). X tetap konstan sepanjang perjalanan — hanya Y yang
  // di-tween lewat travel(), jadi tidak pernah teleport DAN tidak pernah
  // menumpuk node fisik (app/gate/api) yang tetap di AXIS_X. ──
  const [reqY, setReqY] = useState(FLOW_WAYPOINTS.P0_APP)
  const [reqVisible, setReqVisible] = useState(false)
  const [reqKind, setReqKind] = useState('INITIAL')
  const [respY, setRespY] = useState(FLOW_WAYPOINTS.P5_POLICY)
  const [respVisible, setRespVisible] = useState(false)
  const [respKind, setRespKind] = useState('PREFLIGHT_RESPONSE')

  // ── activeNodeNum — stepper flow bernomor 1-6 (revisi-05 §"Flow chart
  // benang"), direalisasikan sebagai strip node kecil di atas body supaya
  // tidak menambah risiko overlap baru di panel browser/server yang sudah
  // padat kartu. 0 = belum mulai. ──
  const [activeNodeNum, setActiveNodeNum] = useState(0)

  // ── gate — glow & open/close, dipakai untuk gerbang browser ──
  const [gateGlow, setGateGlow] = useState(0)
  const [gateOpen, setGateOpen] = useState(false)
  const [matchState, setMatchState] = useState('idle') // idle | match

  // ── preflight/policy card — reveal progresif per baris (0..3) ──
  const [preflightRevealed, setPreflightRevealed] = useState(0)
  const [policyRevealed, setPolicyRevealed] = useState(0)

  const P = (id) => pop[id] || { scale: 0, opacity: 0 }

  useEffect(() => {
    const shouldEnable = previewSfx && audioUnlocked
    sfxLoader.setEnabled(shouldEnable)
  }, [previewSfx, audioUnlocked])

  useEffect(() => {
    audioUnlockedRef.current = audioUnlocked
    volumeRef.current = volume
    speedRef.current = speed
  }, [previewSfx, audioUnlocked, volume, speed])

  // ── helpers ──────────────────────────────────────────────────────

  const popIn = (tl, time, id, opts = {}) => {
    const {
      duration = 0.45, ease = 'back.out(1.6)', sfx = true,
      sfxName = SFX_MAP.POP.name, sfxCategory = 'ui', toOpacity = 1,
    } = opts
    tl.add(() => setPop((prev) => ({ ...prev, [id]: { scale: 0, opacity: 0 } })), time)
    const o = { v: 0 }
    tl.to(o, {
      v: 1, duration, ease,
      onStart: () => { if (sfx) sfxLoader.play(sfxCategory, sfxName, { volume: volumeRef.current, speed: speedRef.current }) },
      onUpdate: () => setPop((prev) => ({ ...prev, [id]: { scale: o.v, opacity: Math.min(toOpacity, o.v * 1.4) } })),
    }, time)
  }

  const popOut = (tl, time, id, opts = {}) => {
    const { duration = 0.3, ease = 'power1.in', toOpacity = 0 } = opts
    const start = pop[id]?.opacity ?? 1
    const o = { v: start }
    tl.to(o, {
      v: toOpacity, duration, ease,
      onUpdate: () => setPop((prev) => ({ ...prev, [id]: { ...(prev[id] || {}), opacity: o.v } })),
    }, time)
  }

  // travel() — tween generik posisi Y sepanjang spine. Mengembalikan
  // waktu selesai supaya bisa dirangkai berurutan tanpa gap (no-teleport).
  const travel = (tl, time, setter, from, to, duration, ease = 'power1.inOut') => {
    const o = { y: from }
    tl.to(o, { y: to, duration, ease, onUpdate: () => setter(o.y) }, time)
    return time + duration
  }

  // note() — caption dekat objek, SATU channel, posisi & warna berubah
  // tiap panggilan (bukan bar tetap di bawah layar).
  const note = (tl, time, x, y, text, color) => tl.add(() => setActiveNote(text ? { x, y, text, color } : null), time)

  const sfxOn = (tl, time, fn) => tl.add(() => audioUnlockedRef.current && fn(), time)

  useEffect(() => {
    const master = gsap.timeline({ repeat: -1, repeatDelay: 1.5 })
    tlRef.current = master
    window.__animationTimeline = master
    window.__flushSync = flushSync

    let time = 0.0

    // ── reset (loop-safe golden rule — lihat 03-planning-storytelling-
    // quality-gate.md §3.2): setiap Act 1 mulai (= setiap loop mulai),
    // SEMUA state balik ke kondisi awal, jangan ada sisa Act 4. ──
    master.add(() => {
      setPop({})
      setMorphP(0)
      setContentStarted(false)
      setActiveNote(null)
      setReqVisible(false)
      setReqY(FLOW_WAYPOINTS.P0_APP)
      setReqKind('INITIAL')
      setRespVisible(false)
      setRespY(FLOW_WAYPOINTS.P5_POLICY)
      setRespKind('PREFLIGHT_RESPONSE')
      setGateGlow(0)
      setGateOpen(false)
      setMatchState('idle')
      setPreflightRevealed(0)
      setPolicyRevealed(0)
      setActiveNodeNum(0)
    }, time)

    // ═══════════════════════════════════════════════════════════════
    // ACT 1 — Origin Beda, Browser Jadi Gerbang (±9s)
    // Setup: app.example minta data. Tegangan: origin beda. Titik
    // balik: browser gate muncul. Payoff: request berhenti di gate.
    // ═══════════════════════════════════════════════════════════════
    master.add(() => setPhaseIdx(0), time)

    const mo = { p: 0 }
    master.to(mo, { p: 1, duration: 0.8, ease: 'power3.inOut', onUpdate: () => setMorphP(mo.p) }, time)
    master.add(() => setContentStarted(true), time + 0.8)

    master.add(() => setActiveNodeNum(1), time)
    popIn(master, time, 'app', { sfxName: SFX_MAP.POP.name })
    note(master, time + 0.9, AXIS_X, CAPTION_SLOT_BROWSER_Y, 'Aplikasi minta data API', COLORS.CLIENT)

    popIn(master, time + 1.0, 'api', { sfxName: SFX_MAP.POP2.name, sfxCategory: 'ui', toOpacity: 0.3 })

    popIn(master, time + 1.8, 'gate', { sfxName: SFX_MAP.WHOOSH_LOW.name, sfxCategory: 'transitions' })
    note(master, time + 2.0, AXIS_X, CAPTION_SLOT_BROWSER_Y, REQUESTS.INITIAL.caption, COLORS.GATE)
    note(master, time + 3.4, AXIS_X, CAPTION_SLOT_BROWSER_Y, 'Browser jadi penjaga', COLORS.GATE)

    master.add(() => { setReqKind('INITIAL'); setReqVisible(true); setReqY(FLOW_WAYPOINTS.P0_APP) }, time + 4.2)
    sfxOn(master, time + 4.2, () => sfxLoader.ui(SFX_MAP.POP.name, { volume: volumeRef.current, speed: speedRef.current }))
    sfxOn(master, time + 4.2, () => sfxLoader.transition(SFX_MAP.WHOOSH.name, { volume: volumeRef.current, speed: speedRef.current }))
    const arriveGate1 = travel(master, time + 4.2, setReqY, FLOW_WAYPOINTS.P0_APP, FLOW_WAYPOINTS.P2_GATE, 1.2)
    master.add(() => setGateGlow(0.6), arriveGate1 - 0.05)
    master.add(() => setActiveNodeNum(2), arriveGate1)
    sfxOn(master, arriveGate1, () => sfxLoader.impact(SFX_MAP.LOCK.name, { volume: volumeRef.current, speed: speedRef.current }))
    note(master, arriveGate1 + 0.1, AXIS_X, CAPTION_SLOT_BROWSER_Y, 'Request berhenti di gerbang', COLORS.GATE)

    // idle pulse di gate — tanda "menunggu izin", bukan diam mati
    master.to({ v: 0.6 }, {
      v: 1, duration: 1.2, ease: 'sine.inOut', repeat: 2, yoyo: true,
      onUpdate: function () { setGateGlow(this.targets()[0].v) },
    }, arriveGate1 + 0.3)

    time += PHASES[0].duration

    // ═══════════════════════════════════════════════════════════════
    // ACT 2 — Browser Bertanya Dulu (±11s)
    // Setup: request bawa header khusus. Tegangan: izin belum
    // diketahui. Titik balik: OPTIONS berangkat duluan. Payoff: API
    // terima pertanyaan (Origin/Method/Headers terlihat).
    // ═══════════════════════════════════════════════════════════════
    master.add(() => setPhaseIdx(1), time)
    master.add(() => setReqKind('ACTUAL'), time)
    note(master, time + 0.1, AXIS_X, CAPTION_SLOT_BROWSER_Y, 'Header khusus butuh izin', COLORS.GATE)

    // request pindah ke LANE_REQUEST_X begitu berangkat dari gate — bukan
    // AXIS_X — supaya seluruh perjalanan turun ke server konsisten di lane
    // kanan (revisi-05 §"Prinsip layout baru" no.3).
    master.add(() => { setReqKind('PREFLIGHT'); setReqY(FLOW_WAYPOINTS.P2_GATE) }, time + 0.6)
    sfxOn(master, time + 0.6, () => sfxLoader.ui(SFX_MAP.POP2.name, { volume: volumeRef.current, speed: speedRef.current }))
    note(master, time + 0.7, AXIS_X, CAPTION_SLOT_BROWSER_Y, REQUESTS.PREFLIGHT.caption, COLORS.GATE)
    sfxOn(master, time + 0.6, () => sfxLoader.transition(SFX_MAP.WHOOSH.name, { volume: volumeRef.current, speed: speedRef.current }))
    const arriveApi2 = travel(master, time + 0.6, setReqY, FLOW_WAYPOINTS.P2_GATE, FLOW_WAYPOINTS.P4_API_DOOR, 1.2)

    master.add(() => setReqVisible(false), arriveApi2)
    master.add(() => setActiveNodeNum(3), arriveApi2)
    master.to({ v: 0.3 }, {
      v: 1, duration: 0.4,
      onUpdate: function () { setPop((prev) => ({ ...prev, api: { ...(prev.api || {}), opacity: this.targets()[0].v } })) },
    }, arriveApi2)
    sfxOn(master, arriveApi2, () => sfxLoader.impact(SFX_MAP.LOCK.name, { volume: volumeRef.current, speed: speedRef.current }))
    note(master, arriveApi2 + 0.2, AXIS_X, CAPTION_SLOT_SERVER_Y, 'API terima permintaan', COLORS.SERVICE)

    // preflight card ditaruh DI BAWAH label API.EXAMPLE (bukan menutupinya)
    // — lihat kontrak anti-overlay revisi-05: "Preflight card: di dalam
    // lane input server, bukan menutup API title".
    popIn(master, arriveApi2 + 0.6, 'preflightCard', { sfxName: SFX_MAP.MATERIALIZE.name, sfxCategory: 'sfx' })
    master.add(() => setPreflightRevealed(1), arriveApi2 + 1.0)
    sfxOn(master, arriveApi2 + 1.0, () => sfxLoader.ui(SFX_MAP.CHIME.name, { volume: volumeRef.current, speed: speedRef.current }))
    master.add(() => setPreflightRevealed(2), arriveApi2 + 1.4)
    sfxOn(master, arriveApi2 + 1.4, () => sfxLoader.ui(SFX_MAP.CHIME.name, { volume: volumeRef.current, speed: speedRef.current }))
    master.add(() => setPreflightRevealed(3), arriveApi2 + 1.8)
    sfxOn(master, arriveApi2 + 1.8, () => sfxLoader.ui(SFX_MAP.CHIME.name, { volume: volumeRef.current, speed: speedRef.current }))
    note(master, arriveApi2 + 2.0, AXIS_X, CAPTION_SLOT_SERVER_Y, 'Origin, method, header terlihat', COLORS.SERVICE)
    note(master, time + 10.6, AXIS_X, CAPTION_SLOT_SERVER_Y, 'API mulai baca kebijakan', COLORS.SERVICE)

    time += PHASES[1].duration

    // ═══════════════════════════════════════════════════════════════
    // ACT 3 — API Menjawab Batas Izin (±12s)
    // Setup: policy shelf membuka. Tegangan: method/header lain bisa
    // ditolak (guardrail aside). Titik balik: header izin dikirim
    // balik. Payoff: browser bandingkan policy, izin cocok.
    // ═══════════════════════════════════════════════════════════════
    master.add(() => setPhaseIdx(2), time)

    popIn(master, time, 'policyShelf', { sfxName: SFX_MAP.MATERIALIZE.name, sfxCategory: 'sfx' })
    master.add(() => setPolicyRevealed(1), time + 0.6)
    sfxOn(master, time + 0.6, () => sfxLoader.ui(SFX_MAP.CHIME.name, { volume: volumeRef.current, speed: speedRef.current }))
    note(master, time + 0.7, AXIS_X, CAPTION_SLOT_SERVER_Y, 'Origin diizinkan cocok', COLORS.SUCCESS)
    master.add(() => setPolicyRevealed(2), time + 1.2)
    sfxOn(master, time + 1.2, () => sfxLoader.ui(SFX_MAP.CHIME.name, { volume: volumeRef.current, speed: speedRef.current }))
    note(master, time + 1.3, AXIS_X, CAPTION_SLOT_SERVER_Y, 'Method cocok, POST diizinkan', COLORS.SUCCESS)
    master.add(() => setPolicyRevealed(3), time + 1.8)
    sfxOn(master, time + 1.8, () => sfxLoader.ui(SFX_MAP.CHIME.name, { volume: volumeRef.current, speed: speedRef.current }))
    note(master, time + 1.9, AXIS_X, CAPTION_SLOT_SERVER_Y, 'Header authorization diizinkan', COLORS.SUCCESS)

    // guardrail aside — dipindah ke GUARDRAIL_X/Y (kanan server, terpisah
    // dari policy shelf & lane response) supaya tidak bertabrakan dengan
    // ticket response yang lewat di LANE_RESPONSE_X sesaat lagi.
    popIn(master, time + 2.6, 'guardrailCard', { sfxName: SFX_MAP.ALERT_PULSE.name, sfxCategory: 'warnings' })
    note(master, time + 2.7, GUARDRAIL_X, CAPTION_SLOT_SERVER_Y, 'Method lain bisa ditolak', COLORS.DENY)
    note(master, time + 3.6, GUARDRAIL_X, CAPTION_SLOT_SERVER_Y, WILDCARD_GUARD_TEXT, COLORS.DENY)
    popOut(master, time + 4.6, 'guardrailCard', { toOpacity: 0.25 })

    master.add(() => { setRespKind('PREFLIGHT_RESPONSE'); setRespVisible(true); setRespY(FLOW_WAYPOINTS.P5_POLICY) }, time + 4.6)
    sfxOn(master, time + 4.6, () => sfxLoader.transition(SFX_MAP.WHOOSH_LOW.name, { volume: volumeRef.current, speed: speedRef.current }))
    const arriveGate3 = travel(master, time + 4.6, setRespY, FLOW_WAYPOINTS.P5_POLICY, FLOW_WAYPOINTS.P2_GATE, 1.2)

    master.add(() => { setRespVisible(false); setMatchState('match') }, arriveGate3)
    master.add(() => setActiveNodeNum(4), arriveGate3)
    master.to({ v: 0.6 }, { v: 1, duration: 0.4, onUpdate: function () { setGateGlow(this.targets()[0].v) } }, arriveGate3)
    sfxOn(master, arriveGate3, () => sfxLoader.success(SFX_MAP.CONFIRM.name, { volume: volumeRef.current, speed: speedRef.current }))
    note(master, arriveGate3 + 0.2, AXIS_X, CAPTION_SLOT_BROWSER_Y, REQUESTS.ACTUAL.caption, COLORS.SUCCESS)
    note(master, time + 11.4, AXIS_X, CAPTION_SLOT_BROWSER_Y, 'Izin cocok, lanjut kirim asli', COLORS.SUCCESS)

    time += PHASES[2].duration

    // ═══════════════════════════════════════════════════════════════
    // ACT 4 — Browser yang Membatasi Pembacaan (±12s)
    // Setup: request asli berangkat. Tegangan: API tetap terima request
    // tanpa janji browser bisa membaca. Titik balik: browser buka gate
    // untuk JS. Payoff: data tersedia untuk aplikasi (jawab hook Act 1).
    // ═══════════════════════════════════════════════════════════════
    master.add(() => setPhaseIdx(3), time)
    popOut(master, time, 'preflightCard', { toOpacity: 0.3 })
    popOut(master, time, 'policyShelf', { toOpacity: 0.3 })
    popOut(master, time, 'guardrailCard', { toOpacity: 0 })

    master.add(() => { setReqKind('ACTUAL'); setReqVisible(true); setReqY(FLOW_WAYPOINTS.P2_GATE) }, time)
    note(master, time + 0.1, AXIS_X, CAPTION_SLOT_BROWSER_Y, 'Request asli berjalan', COLORS.CLIENT)
    sfxOn(master, time, () => sfxLoader.transition(SFX_MAP.WHOOSH.name, { volume: volumeRef.current, speed: speedRef.current }))
    const arriveApi4 = travel(master, time, setReqY, FLOW_WAYPOINTS.P2_GATE, FLOW_WAYPOINTS.P5_POLICY, 1.4)

    master.add(() => setReqVisible(false), arriveApi4)
    master.add(() => setActiveNodeNum(5), arriveApi4)
    sfxOn(master, arriveApi4, () => sfxLoader.impact(SFX_MAP.LOCK.name, { volume: volumeRef.current, speed: speedRef.current }))
    note(master, arriveApi4 + 0.1, AXIS_X, CAPTION_SLOT_SERVER_Y, 'API terima request asli', COLORS.SERVICE)
    note(master, arriveApi4 + 1.0, AXIS_X, CAPTION_SLOT_SERVER_Y, NOT_AUTH_TEXT, COLORS.DENY)

    master.add(() => { setRespKind('ACTUAL_RESPONSE'); setRespVisible(true); setRespY(FLOW_WAYPOINTS.P5_POLICY) }, arriveApi4 + 1.8)
    sfxOn(master, arriveApi4 + 1.8, () => sfxLoader.transition(SFX_MAP.WHOOSH_LOW.name, { volume: volumeRef.current, speed: speedRef.current }))
    const arriveGate4 = travel(master, arriveApi4 + 1.8, setRespY, FLOW_WAYPOINTS.P5_POLICY, FLOW_WAYPOINTS.P2_GATE, 1.2)

    master.add(() => setGateOpen(true), arriveGate4)
    master.add(() => setActiveNodeNum(6), arriveGate4)
    sfxOn(master, arriveGate4, () => sfxLoader.success(SFX_MAP.CONFIRM.name, { volume: volumeRef.current, speed: speedRef.current }))
    note(master, arriveGate4 + 0.1, AXIS_X, CAPTION_SLOT_BROWSER_Y, REQUESTS.ACTUAL_RESPONSE.caption, COLORS.SUCCESS)

    const arriveApp4 = travel(master, arriveGate4 + 0.3, setRespY, FLOW_WAYPOINTS.P2_GATE, FLOW_WAYPOINTS.P0_APP, 0.8)
    sfxOn(master, arriveGate4 + 0.3, () => sfxLoader.transition(SFX_MAP.WHOOSH.name, { volume: volumeRef.current, speed: speedRef.current }))
    master.add(() => setRespVisible(false), arriveApp4)

    popIn(master, arriveApp4, 'dataCard', { sfxName: SFX_MAP.DING.name, sfxCategory: 'success' })
    note(master, arriveApp4 + 0.4, AXIS_X, CAPTION_SLOT_BROWSER_Y, 'Data tersedia untuk aplikasi', COLORS.SUCCESS)

    time += PHASES[3].duration

    return () => {
      master.kill()
      delete window.__animationTimeline
      delete window.__flushSync
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (!tlRef.current) return
    tlRef.current.timeScale(speed)
    if (paused) tlRef.current.pause()
    else tlRef.current.play()
  }, [paused, speed])

  const reqDef = REQUESTS[reqKind]
  const respDef = REQUESTS[respKind]
  const reqColor = COLORS[reqDef.color] || COLORS.CLIENT
  const respColor = COLORS[respDef.color] || COLORS.SUCCESS
  const gateRingColor = matchState === 'match' ? COLORS.SUCCESS : COLORS.GATE

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
      <g opacity={0.05}>
        {Array.from({ length: 21 }).map((_, i) => <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={VH} stroke={COLORS.CLIENT} strokeWidth={1} />)}
        {Array.from({ length: 34 }).map((_, i) => <line key={`h${i}`} x1={0} y1={i * 40} x2={VW} y2={i * 40} stroke={COLORS.CLIENT} strokeWidth={1} />)}
      </g>

      <IntroHeaderMorphV1
        progress={morphP}
        categorySegments={[
          { label: INTRO_CATEGORY_LABEL + ' · ', color: COLORS.MUTED },
          { label: INTRO_DOMAIN, color: COLORS.CLIENT },
        ]}
        titleSegments={[
          { label: INTRO_TITLE_A, color: COLORS.CLIENT },
          { label: INTRO_TITLE_B, color: COLORS.SUCCESS },
        ]}
        subtitle={INTRO_SUBTITLE}
        hero={{ thumbWidth: 260 }}
        titleFilter="url(#glow)"
        testId="cors-intro-header"
      />

      {contentStarted && (
        <ActBadgeNavigatorV1 phases={PHASES} activeIndex={phaseIdx} testId="cors-act-navigator" />
      )}

      <ContentBodyV1 debugName="cors-body" render={(w, h, toCanvasX, toCanvasY) => (
        <>
          {/* ── REVISI-05: flow stepper 1-6, strip aman paling atas body,
              tidak menempel ke app/gate/api supaya tidak menambah overlap ── */}
          <g transform={`translate(${AXIS_X}, ${FLOW_STEPPER_Y})`}>
            <line x1={-135} y1={10} x2={135} y2={10} stroke={COLORS.BORDER} strokeWidth={2} opacity={0.5} />
            <line x1={-135} y1={10} x2={-135 + (270 * Math.min(activeNodeNum, 6) / 6)} y2={10}
              stroke={COLORS.SUCCESS} strokeWidth={2} opacity={0.9} />
            {FLOW_NODES.map((node, i) => {
              const nx = -135 + i * (270 / 5)
              const isActive = node.n === activeNodeNum
              const isPast = node.n < activeNodeNum
              const fill = isActive ? COLORS.SUCCESS : isPast ? COLORS.MUTED : COLORS.PANEL
              const opacity = isActive ? 1 : isPast ? 0.7 : 0.35
              return (
                <g key={node.n} transform={`translate(${nx}, 10)`} opacity={opacity}>
                  <circle r={isActive ? 11 : 8} fill={fill} stroke={COLORS.BORDER} strokeWidth={1.5}
                    filter={isActive ? 'url(#glow)' : undefined} />
                  <text x={0} y={4} textAnchor="middle" fontSize={9} fontWeight={700} fontFamily="monospace"
                    fill={isActive ? COLORS.BG : COLORS.TEXT}>{node.n}</text>
                  {isActive && (
                    <text x={0} y={26} textAnchor="middle" fontSize={8} fontFamily="monospace" letterSpacing={0.5}
                      fill={COLORS.SUCCESS}>{node.label}</text>
                  )}
                </g>
              )
            })}
          </g>

          {/* ── Panel BROWSER (atas) & SERVER (bawah) — dipisah divider,
              menghapus sumbu tunggal lama supaya peran actor eksplisit
              (revisi-05 §"Prinsip layout baru" no.1-2) ── */}
          <rect x={0} y={BROWSER_PANEL.yTop} width={w} height={BROWSER_PANEL.yBottom - BROWSER_PANEL.yTop}
            rx={16} fill="none" stroke={COLORS.CLIENT} strokeWidth={1.5} strokeDasharray="3 5" opacity={0.28} />
          <text x={16} y={BROWSER_PANEL.yTop + 22} fontSize={10} fontFamily="monospace" letterSpacing={2}
            fill={COLORS.CLIENT} opacity={0.55}>{BROWSER_ZONE_LABEL}</text>

          <rect x={0} y={SERVER_PANEL.yTop} width={w} height={SERVER_PANEL.yBottom - SERVER_PANEL.yTop}
            rx={16} fill="none" stroke={COLORS.SERVICE} strokeWidth={1.5} strokeDasharray="3 5" opacity={0.28} />
          <text x={16} y={SERVER_PANEL.yTop + 22} fontSize={10} fontFamily="monospace" letterSpacing={2}
            fill={COLORS.SERVICE} opacity={0.55}>{SERVER_ZONE_LABEL}</text>

          <line x1={0} y1={DIVIDER_Y} x2={w} y2={DIVIDER_Y} stroke={COLORS.BORDER} strokeWidth={1} opacity={0.4} />

          {/* ── Dua lane benang tetap (kanan = request turun, kiri =
              response naik) — hanya digambar di corridor antar-panel,
              bukan menembus area kartu (revisi-05 §"Prinsip layout baru"
              no.3) ── */}
          <line x1={LANE_REQUEST_X} y1={FLOW_WAYPOINTS.P0_APP} x2={LANE_REQUEST_X} y2={FLOW_WAYPOINTS.P4_API_DOOR}
            stroke={COLORS.GATE} strokeWidth={2} strokeDasharray="4 6" opacity={0.22} />
          <line x1={LANE_RESPONSE_X} y1={FLOW_WAYPOINTS.P5_POLICY} x2={LANE_RESPONSE_X} y2={FLOW_WAYPOINTS.P0_APP}
            stroke={COLORS.SUCCESS} strokeWidth={2} strokeDasharray="4 6" opacity={0.22} />

          {/* ── APP.EXAMPLE — persistent, browser window shape ── */}
          <g transform={`translate(${AXIS_X}, ${APP_Y}) scale(${P('app').scale || 1})`} opacity={P('app').opacity}>
            <rect x={-140} y={-45} width={280} height={90} rx={14} fill={COLORS.PANEL} stroke={COLORS.CLIENT} strokeWidth={2} />
            <circle cx={-114} cy={-27} r={4} fill={COLORS.SUCCESS} />
            <circle cx={-100} cy={-27} r={4} fill={COLORS.SERVICE} />
            <circle cx={-86} cy={-27} r={4} fill={COLORS.CLIENT} />
            <text x={0} y={0} textAnchor="middle" fontSize={13} fontFamily="monospace" letterSpacing={1.5} fill={COLORS.CLIENT}>{APP_LABEL}</text>
            <text x={0} y={22} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={COLORS.MUTED}>fetch(&apos;api.example/data&apos;)</text>

            {/* data card — payoff Act 4, muncul di dalam app node */}
            {P('dataCard').opacity > 0 && (
              <g opacity={P('dataCard').opacity} transform={`scale(${P('dataCard').scale || 1})`}>
                <rect x={-100} y={38} width={200} height={40} rx={10} fill={COLORS.BG} stroke={COLORS.SUCCESS} strokeWidth={2} />
                <text x={0} y={63} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={COLORS.SUCCESS}>{REQUESTS.ACTUAL_RESPONSE.label}</text>
              </g>
            )}
          </g>

          {/* ── BROWSER GATE — persistent, dua daun pintu + ring glow ── */}
          <g transform={`translate(${AXIS_X}, ${GATE_Y}) scale(${P('gate').scale || 1})`} opacity={P('gate').opacity}>
            <circle r={64} fill="none" stroke={gateRingColor} strokeWidth={2.5} opacity={0.3 + gateGlow * 0.6} filter={gateGlow > 0.5 ? 'url(#glow)' : undefined} />
            <path d="M -46 -30 Q 0 -52 46 -30" fill="none" stroke={COLORS.BORDER} strokeWidth={3} />
            <rect x={gateOpen ? -70 : -44} y={-30} width={40} height={60} rx={6} fill={COLORS.PANEL} stroke={gateRingColor} strokeWidth={2} />
            <rect x={gateOpen ? 30 : 4} y={-30} width={40} height={60} rx={6} fill={COLORS.PANEL} stroke={gateRingColor} strokeWidth={2} />
            <text x={0} y={50} textAnchor="middle" fontSize={11} fontFamily="monospace" letterSpacing={1} fill={gateRingColor}>{GATE_LABEL}</text>
          </g>

          {/* ── API.EXAMPLE — persistent, redup sejak Act 1, menyala Act 2+ ── */}
          <g transform={`translate(${AXIS_X}, ${API_Y}) scale(${P('api').scale || 1})`} opacity={P('api').opacity}>
            <rect x={-150} y={-70} width={300} height={140} rx={14} fill={COLORS.PANEL} stroke={COLORS.SERVICE} strokeWidth={2} />
            <text x={0} y={-40} textAnchor="middle" fontSize={13} fontFamily="monospace" letterSpacing={1.5} fill={COLORS.SERVICE}>{API_LABEL}</text>
            <text x={0} y={-18} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={COLORS.MUTED}>POST /data</text>

            {/* preflight card — reveal progresif Origin/Method/Headers */}
            {P('preflightCard').opacity > 0 && (
              <g opacity={P('preflightCard').opacity} transform={`translate(0, 6) scale(${P('preflightCard').scale || 1})`}>
                <rect x={-130} y={0} width={260} height={64} rx={8} fill={COLORS.BG} stroke={COLORS.GATE} strokeWidth={1.5} />
                {REQUESTS.PREFLIGHT.lines.map((line, i) => (
                  <text key={line} x={-118} y={16 + i * 16} fontSize={9} fontFamily="monospace"
                    fill={COLORS.GATE} opacity={preflightRevealed > i ? 1 : 0.15}>{line}</text>
                ))}
              </g>
            )}
          </g>

          {/* ── POLICY SHELF — reveal progresif Allow-Origin/Methods/Headers,
              plus guardrail chip (Act 3 aside, statis, bukan request sungguhan) ── */}
          <g transform={`translate(${AXIS_X}, ${POLICY_Y}) scale(${P('policyShelf').scale || 1})`} opacity={P('policyShelf').opacity}>
            <rect x={-150} y={-50} width={300} height={100} rx={14} fill={COLORS.PANEL} stroke={COLORS.SUCCESS} strokeWidth={2} />
            <text x={0} y={-28} textAnchor="middle" fontSize={11} fontFamily="monospace" letterSpacing={1} fill={COLORS.MUTED}>{POLICY_LABEL}</text>
            {REQUESTS.PREFLIGHT_RESPONSE.lines.map((line, i) => (
              <text key={line} x={-130} y={-8 + i * 16} fontSize={9} fontFamily="monospace"
                fill={COLORS.SUCCESS} opacity={policyRevealed > i ? 1 : 0.15}>{line}</text>
            ))}
          </g>

          {/* ── Guardrail aside — REVISI-05: dipindah ke GUARDRAIL_X/Y (aside
              kecil di kanan server, TERPISAH dari policyShelf) supaya tidak
              bertabrakan dengan ticket response yang lewat LANE_RESPONSE_X
              maupun caption slot server (kontrak anti-overlay revisi-05). ── */}
          {P('guardrailCard').opacity > 0 && (
            <g transform={`translate(${GUARDRAIL_X}, ${GUARDRAIL_Y})`} opacity={P('guardrailCard').opacity}>
              <g transform={`scale(${P('guardrailCard').scale || 1})`}>
                <rect x={-95} y={-46} width={190} height={92} rx={12} fill={COLORS.BG} stroke={COLORS.DENY} strokeWidth={1.5} opacity={0.9} />
                <g transform="translate(0, -20)">
                  <rect x={-80} y={-14} width={160} height={28} rx={14} fill={COLORS.PANEL} stroke={COLORS.SUCCESS} strokeWidth={1.5} />
                  <text x={0} y={4} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={COLORS.SUCCESS}>{GUARDRAIL_ALLOWED.label}</text>
                </g>
                <g transform="translate(0, 20)">
                  <rect x={-80} y={-14} width={160} height={28} rx={14} fill={COLORS.PANEL} stroke={COLORS.DENY} strokeWidth={1.5} />
                  <text x={0} y={4} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={COLORS.DENY}>{GUARDRAIL_BLOCKED.label}</text>
                </g>
              </g>
            </g>
          )}

          {/* ── TICKET request — satu tiket generic dipakai INITIAL/PREFLIGHT/
              ACTUAL, SELALU di LANE_REQUEST_X (kanan), tidak pernah
              teleport (posisi y ditween via travel()) ── */}
          {reqVisible && (
            <g transform={`translate(${LANE_REQUEST_X}, ${reqY})`}>
              <rect x={-80} y={-22} width={160} height={44} rx={10} fill={COLORS.BG} stroke={reqColor} strokeWidth={2} filter="url(#shadow)" />
              <text x={0} y={-4} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="monospace" fill={reqColor}>
                {reqDef.method} {reqDef.path}
              </text>
              {reqDef.tag && (
                <text x={0} y={14} textAnchor="middle" fontSize={7.5} fontFamily="monospace" fill={COLORS.MUTED}>{reqDef.tag}</text>
              )}
            </g>
          )}

          {/* ── TICKET response — PREFLIGHT_RESPONSE (lines) atau ACTUAL_RESPONSE
              (label), SELALU di LANE_RESPONSE_X (kiri) ── */}
          {respVisible && (
            <g transform={`translate(${LANE_RESPONSE_X}, ${respY})`}>
              <rect x={-85} y={-24} width={170} height={48} rx={10} fill={COLORS.BG} stroke={respColor} strokeWidth={2} filter="url(#shadow)" />
              {respDef.lines ? (
                <text x={0} y={4} textAnchor="middle" fontSize={8.5} fontFamily="monospace" fill={respColor}>{respDef.lines[0]}</text>
              ) : (
                <text x={0} y={4} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="monospace" fill={respColor}>{respDef.label}</text>
              )}
            </g>
          )}

          {/* ── activeNote — SATU channel caption, posisi & warna berubah tiap
              panggilan supaya selalu dekat objek yang sedang dibahas ── */}
          {activeNote && (
            <g transform={`translate(${activeNote.x}, ${activeNote.y})`}>
              <text x={0} y={0} textAnchor="middle" fontSize={13} fontWeight={600} fontFamily="sans-serif" fill={activeNote.color}>
                {activeNote.text}
              </text>
            </g>
          )}
        </>
      )} />
    </svg>
  )
}
