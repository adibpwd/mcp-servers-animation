// src/content/24-cors/Animation.jsx
// ═════════════════════════════════════════════════════════════
// Eksekusi sesuai src/content/24-cors/_docs/CORS_PLAN.md
// (2026-09-12). Empat Act, scene-ui V1, koordinat LOCAL, sumbu
// vertikal AXIS_X. Cerita: browser fetch dari app.example ke
// api.example; browser berdiri sebagai gate — preflight OPTIONS
// bertanya dulu; API membuka policy & membandingkan izin; request
// asli tidak berangkat sebelum izin cocok; respons baru dibaca JS
// setelah browser mengecek header CORS. Closing: CORS bukan
// pengganti auth — ia aturan pembacaan browser.
// Protagonis: paket request + browser gate (kontrak seri).
//
// STATUS: first pass (tunggu preview manual & export MP4 sebelum
// `ready`, lihat _docs/CORS_PLAN.md § Checklist).
// ═════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, CAPTIONS,
  INTRO_CATEGORY_LABEL, INTRO_DOMAIN, INTRO_TITLE_A, INTRO_TITLE_B, INTRO_SUBTITLE,
  AXIS_X, APP_Y, API_Y, GATE_Y, PREFLIGHT_Y, POLICY_Y, RESPONS_Y, CLOSING_Y, CAPTION_Y,
  SFX_MAP,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'
import {
  IntroHeaderMorphV1,
  ActBadgeNavigatorV1,
  ContentBodyV1,
} from '../../shared/scene-ui/v1'

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
  const [caption, setCaption] = useState('')
  const [morphP, setMorphP] = useState(0)
  const [headerOpacity, setHeaderOpacity] = useState(0)
  const [contentStarted, setContentStarted] = useState(false)
  const [pop, setPop] = useState({})

  // ── Act 1 ──
  const [appLit, setAppLit] = useState(false)
  const [originCard, setOriginCard] = useState(false)
  const [gateUp, setGateUp] = useState(false)
  // ── Act 2 ──
  const [preflight, setPreflight] = useState(false)
  const [actualHeld, setActualHeld] = useState(false)
  // ── Act 3 ──
  const [policyOpen, setPolicyOpen] = useState(false)
  const [match, setMatch] = useState(false)        // method/header cocok
  const [mismatch, setMismatch] = useState(false)  // ada jalur salah
  const [allowHeads, setAllowHeads] = useState(false)
  // ── Act 4 ──
  const [actualGo, setActualGo] = useState(false)
  const [respIn, setRespIn] = useState(false)
  const [gateOpen, setGateOpen] = useState(false)
  const [jsRead, setJsRead] = useState(false)

  const P = (id) => pop[id] || { scale: 0, opacity: 0, x: 0, y: 0 }
  const O = (id) => P(id).opacity

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 })
    tlRef.current = tl
    window.__animationTimeline = tl
    window.__flushSync = flushSync

    let t = 0
    tl.add(() => {
      setPhaseIdx(0); setCaption('')
      setMorphP(0); setHeaderOpacity(0); setContentStarted(false)
      setPop({})
      setAppLit(false); setOriginCard(false); setGateUp(false)
      setPreflight(false); setActualHeld(false)
      setPolicyOpen(false); setMatch(false); setMismatch(false); setAllowHeads(false)
      setActualGo(false); setRespIn(false); setGateOpen(false); setJsRead(false)
    }, t)

    // ─── INTRO (±2.8s) ───
    const mo = { p: 0 }
    tl.to(mo, { p: 1, duration: 1.0, ease: 'power3.inOut', onUpdate: () => setMorphP(mo.p) }, t)
    t += 1.0
    const ho = { p: 0 }
    tl.to(ho, { p: 1, duration: 0.6, onUpdate: () => setHeaderOpacity(ho.p) }, t)
    t += 0.6
    tl.add(() => setContentStarted(true), t)
    // intro sebelumnya tidak punya cue (temuan audit revisi-01) — materialize
    // menandai header selesai morph, sebelum Act 1 mulai.
    tl.add(() => {
      if (audioUnlockedRef.current) sfxLoader.play(SFX_MAP.MATERIALIZE.category, SFX_MAP.MATERIALIZE.name, { volume: volumeRef.current, speed: speedRef.current })
    }, t)

    const popIn = (time, id, fromY = 0, entry = SFX_MAP.POP) => {
      const o = { v: 0 }
      const oo = { v: 0 }
      tl.to(oo, { v: 0.9, duration: 0.001 }, time)
      tl.to(o, {
        v: 1, duration: 0.5, ease: 'back.out(1.7)',
        onStart: () => { if (entry && audioUnlockedRef.current) sfxLoader.play(entry.category, entry.name, { volume: volumeRef.current, speed: speedRef.current }) },
        onUpdate: () => setPop(prev => ({ ...prev, [id]: { scale: o.v, opacity: Math.min(1, o.v * 1.4), y: fromY * (1 - o.v) } })),
      }, time)
    }
    // popOut menerima entry SFX opsional (default silent) — backward
    // compatible untuk panggilan lama yang cuma butuh cleanup visual.
    const popOut = (time, id, entry = null) => {
      const o = { v: 1 }
      tl.to(o, {
        v: 0, duration: 0.25, ease: 'power1.in',
        onStart: () => { if (entry && audioUnlockedRef.current) sfxLoader.play(entry.category, entry.name, { volume: volumeRef.current, speed: speedRef.current }) },
        onUpdate: () => setPop(prev => ({ ...prev, [id]: { scale: o.v, opacity: o.v } })),
      }, time)
    }
    const say = (time, text) => tl.add(() => setCaption(text), time)

    // ═══════════════ ACT 1 — Origin Berbeda (±8s) ═══════════════
    tl.add(() => setPhaseIdx(1), t)
    popIn(t + 0.1, 'appCard')
    tl.add(() => setAppLit(true), t + 0.2)
    sfxQueue(SFX_MAP.TICK, t + 0.2)
    say(t + 0.25, CAPTIONS.APP_START)
    t += 1.7
    popIn(t, 'apiCard', 0, SFX_MAP.POP2)
    tl.add(() => setOriginCard(true), t)
    say(t + 0.1, CAPTIONS.ORIGIN_DIFF)
    t += 1.6
    say(t, CAPTIONS.TRIP_KNOWN)
    t += 1.5
    // gate muncul antara app & api
    popIn(t, 'gateCard', 0)
    tl.add(() => setGateUp(true), t)
    sfxQueue(SFX_MAP.LIGHT_SWOOSH, t)
    say(t + 0.1, CAPTIONS.GATE_UP)
    let act1End = t + 2.0

    // ═══════════════ ACT 2 — Preflight OPTIONS (±11s) ════════════
    tl.add(() => setPhaseIdx(2), act1End)
    // app mau kirim request bawa header khusus → browser butuh izin
    popIn(act1End + 0.1, 'actualCard', -8)
    tl.add(() => setActualHeld(true), act1End + 0.2)
    sfxQueue(SFX_MAP.LOCK, act1End + 0.2)
    say(act1End + 0.25, CAPTIONS.NEED_PERMISSION)
    t = act1End + 2.0
    // OPTIONS berangkat dulu (preflight)
    popIn(t, 'optCard', -10)
    tl.add(() => setPreflight(true), t)
    sfxQueue(SFX_MAP.LIGHT_SWOOSH, t)
    say(t + 0.1, CAPTIONS.PREFLIGHT_OFF)
    t += 1.7
    say(t, CAPTIONS.CARRIES)
    t += 1.6
    tl.add(() => setActualHeld(false), t)
    // popOut preflightWait + cue scan: API sedang membaca preflight yang
    // baru selesai (P1 "scan policy" + P3 upgrade popOut, revisi-01 §4).
    popOut(t, 'preflightWait', SFX_MAP.POLICY_SCAN)
    say(t + 0.1, CAPTIONS.API_READS)
    let act2End = t + 2.2

    // ═══════════════ ACT 3 — Browser Bandingkan Izin (±12s) ══════
    tl.add(() => setPhaseIdx(3), act2End)
    // policy kembali ke browser — slide-in, bukan pop generik
    popIn(act2End + 0.1, 'policyCard', 0, SFX_MAP.SLIDE_IN)
    tl.add(() => setPolicyOpen(true), act2End + 0.2)
    say(act2End + 0.25, CAPTIONS.POLICY_OPEN)
    t = act2End + 1.8
    say(t, CAPTIONS.CHECK_METHOD)
    t += 1.7
    // header izin dikirim dari API
    popIn(t, 'allowCard')
    tl.add(() => setMismatch(true), t + 0.1)
    sfxQueue(SFX_MAP.ERROR_BEEP, t + 0.1)
    say(t + 0.2, CAPTIONS.MISMATCH)
    t += 1.5
    tl.add(() => setAllowHeads(true), t)
    sfxQueue(SFX_MAP.ALLOW_CHIME, t)
    say(t + 0.1, CAPTIONS.ALLOWED_HEADER)
    t += 1.6
    tl.add(() => setMatch(true), t)
    sfxQueue(SFX_MAP.DING, t)
    say(t + 0.1, CAPTIONS.MATCH_PASS)
    let act3End = t + 1.8

    // ═══════════════ ACT 4 — Respons Dibaca Setelah Izin (±8s) ═══
    tl.add(() => setPhaseIdx(4), act3End)
    // request asli baru berangkat — izin cocok
    popIn(act3End + 0.1, 'actualGoCard', -8)
    tl.add(() => setActualGo(true), act3End + 0.2)
    sfxQueue(SFX_MAP.LIGHT_SWOOSH, act3End + 0.2)
    say(act3End + 0.3, CAPTIONS.ACTUAL_OFF)
    t = act3End + 1.9
    popIn(t, 'respCard', -8)
    tl.add(() => setRespIn(true), t)
    sfxQueue(SFX_MAP.POP, t)
    say(t + 0.1, CAPTIONS.RESP_IN)
    t += 1.6
    // browser gate membuka akses baca → data tersedia JS
    tl.add(() => setGateOpen(true), t)
    sfxQueue(SFX_MAP.UNLOCK, t)
    say(t + 0.1, CAPTIONS.GATE_OPEN)
    t += 1.5
    tl.add(() => setJsRead(true), t)
    // data siap dibaca JS — payoff relief, sebelumnya tanpa cue
    sfxQueue(SFX_MAP.RELIEF, t)
    say(t + 0.1, CAPTIONS.DATA_READY)
    t += 1.4
    // closing — label kecil <5 kata
    say(t, CAPTIONS.CLOSING)
    let act4End = t + 1.8

    tl.to({}, { duration: "0.9" }, act4End)

    return () => { tl.kill() }
  }, [])

  useEffect(() => {
    const tl = tlRef.current
    if (!tl) return
    tl.timeScale(speed)
    if (paused) tl.pause(); else tl.resume()
  }, [speed, paused])

  useEffect(() => {
    volumeRef.current = volume
    speedRef.current = speed
    audioUnlockedRef.current = audioUnlocked
  }, [volume, speed, audioUnlocked])

  // P0 fix (revisi-01): dulu selalu memanggil sfxLoader.play('ui', name, ...)
  // apa pun kategorinya, jadi cue yang file-nya di transitions/impacts/
  // success/warnings jadi silent atau mismatch. Sekarang menerima entry
  // SFX_MAP { category, name } sehingga source category selalu benar.
  const sfxQueue = (entry, at) => {
    if (!tlRef.current || !entry) return
    tlRef.current.add(() => {
      if (audioUnlockedRef.current) sfxLoader.play(entry.category, entry.name, { volume: volumeRef.current, speed: speedRef.current })
    }, at)
  }

  // ── helpers render ──
  const T = (id, cx, cy) => {
    const p = P(id)
    return `translate(${cx + p.x}, ${cy + p.y}) scale(${p.scale})`
  }

  // ── kartu origin / API ──
  const OriginCard = ({ x, y, label, color, lit }) => (
    <g transform={T('originCard', x, y)} opacity={O('originCard')}>
      <rect x={-100} y={-36} width={200} height={72} rx={12} fill={COLORS.PANEL} stroke={color} strokeWidth={2} />
      <text x={0} y={-14} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="monospace" letterSpacing={1.5} fill={color}>{label}</text>
      {lit && <rect x={-16} y={10} width={32} height={12} rx={6} fill={color} opacity={0.35} />}
    </g>
  )

  return (
    <svg ref={svgRef} viewBox={`0 0 ${VW} ${VH}`}
      style={{ width: '100%', height: '100%', maxHeight: '100vh',
        maxWidth: `calc(100vh * ${VW} / ${VH})`, background: COLORS.BG, userSelect: 'none' }}>
      <defs>
        <filter id="glow">
          <feGaussianBlur in="SourceGraphic" stdDeviation={6} result="b1" />
          <feMerge><feMergeNode in="b1" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
        <filter id="shadow">
          <feDropShadow dx={0} dy={6} stdDeviation={10} floodColor="#000" floodOpacity={0.5} />
        </filter>
      </defs>

      <g opacity={0.04}>
        {Array.from({ length: 21 }).map((_, i) => (
          <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={VH} stroke={COLORS.API} strokeWidth={1} />
        ))}
        {Array.from({ length: 34 }).map((_, i) => (
          <line key={`h${i}`} x1={0} y1={i * 40} x2={VW} y2={i * 40} stroke={COLORS.API} strokeWidth={1} />
        ))}
      </g>

      {/* ── HEADER ── */}
      {contentStarted && (
        <g opacity={headerOpacity}>
          <IntroHeaderMorphV1
            progress={morphP}
            categorySegments={[
              { label: INTRO_CATEGORY_LABEL + ' · ', color: COLORS.MUTED },
              { label: INTRO_DOMAIN, color: COLORS.SYSTEM },
            ]}
            titleSegments={[
              { label: INTRO_TITLE_A, color: COLORS.CORS },
              { label: INTRO_TITLE_B, color: COLORS.API },
            ]}
            subtitle={INTRO_SUBTITLE}
            testId="cors-intro-header"
          />
        </g>
      )}

      {/* ── Act badge navigator ── */}
      {contentStarted && (
        <ActBadgeNavigatorV1
          phases={PHASES}
          activeIndex={phaseIdx}
          color={COLORS.CORS}
          testId="cors-act-navigator"
        />
      )}

      {/* ── BODY perlu ContentBodyV1 agar render V1 konsisten */}
      <g transform={T('contentBody', 0, 0)} opacity={O('contentBody')}>
        <ContentBodyV1 debugName="cors-body">
          {/* ══ jalur app → api (melewati gate) ══ */}
          <path d={`M ${AXIS_X} ${APP_Y + 36} C ${AXIS_X} ${GATE_Y - 40}, ${AXIS_X} ${GATE_Y + 40}, ${AXIS_X} ${API_Y - 12}`}
            stroke={gateUp ? COLORS.API : COLORS.BORDER} strokeWidth={2} strokeDasharray="5 7" fill="none" opacity={0.7} />

          {/* ── app.example (origin pengirim) ── */}
          <g transform={T('appCard', AXIS_X, APP_Y)} opacity={O('appCard')} filter="url(#shadow)">
            <rect x={-110} y={-40} width={220} height={80} rx={12} fill={COLORS.PANEL} stroke={appLit ? COLORS.ORIGIN : COLORS.BORDER} strokeWidth={2} />
            <text x={0} y={-20} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="monospace" fill={COLORS.ORIGIN}>app.example</text>
            <text x={0} y={6} textAnchor="middle" fontSize={8} fontFamily="monospace" fill={COLORS.MUTED}>JavaScript</text>
            {appLit && <rect x={52} y={-30} width={30} height={22} rx={6} fill={COLORS.ORIGIN} opacity={0.5} />}
          </g>

          {/* ── gate browser (penjaga baca) ── */}
          {gateUp && (
            <g transform={T('gateCard', AXIS_X, GATE_Y)} opacity={O('gateCard')} filter="url(#shadow)">
              <rect x={-84} y={-52} width={168} height={104} rx={14} fill={COLORS.PANEL} stroke={gateOpen ? COLORS.ALLOW : COLORS.CORS} strokeWidth={2.5} />
              <text x={0} y={-34} textAnchor="middle" fontSize={9} fontWeight={700} fontFamily="monospace" letterSpacing={1.5} fill={gateOpen ? COLORS.ALLOW : COLORS.CORS}>BROWSER GATE</text>
              {/* pintu gate */}
              <rect x={-30} y={-20} width={60} height={46} rx={10} fill={COLORS.BG} stroke={COLORS.BORDER} strokeWidth={2} />
              {!gateOpen && <line x1={-30} y1={-20} x2={30} y2={26} stroke={COLORS.CORS} strokeWidth={3} />}
              {gateOpen && <g opacity={0.9}><line x1={-16} y1={2} x2={-1} y2={16} stroke={COLORS.ALLOW} strokeWidth={3.5} strokeLinecap="round" /><line x1={-1} y1={16} x2={18} y2={-8} stroke={COLORS.ALLOW} strokeWidth={3.5} strokeLinecap="round" /></g>}
              <text x={0} y={42} textAnchor="middle" fontSize={7} fontFamily="monospace" fill={COLORS.MUTED}>{gateOpen ? 'TERBUKA' : 'TERTUTUP'}</text>
            </g>
          )}

          {/* ── api.example (origin tujuan) ── */}
          <g transform={T('apiCard', AXIS_X, API_Y)} opacity={O('apiCard')} filter="url(#shadow)">
            <rect x={-110} y={-40} width={220} height={80} rx={12} fill={COLORS.PANEL} stroke={COLORS.API} strokeWidth={2} />
            <text x={0} y={-20} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="monospace" fill={COLORS.API}>api.example</text>
            <text x={0} y={6} textAnchor="middle" fontSize={8} fontFamily="monospace" fill={COLORS.MUTED}>respons data</text>
          </g>

          {/* ── preflight OPTIONS ke API ── */}
          {preflight && (
            <g transform={T('optCard', AXIS_X, PREFLIGHT_Y)} opacity={O('optCard')} filter="url(#glow)">
              <rect x={-76} y={-30} width={152} height={60} rx={10} fill={COLORS.PANEL} stroke={COLORS.PREFLIGHT} strokeWidth={2} />
              <text x={0} y={-10} textAnchor="middle" fontSize={10} fontWeight={900} fontFamily="monospace" fill={COLORS.PREFLIGHT}>OPTIONS</text>
              <text x={0} y={10} textAnchor="middle" fontSize={7} fontFamily="monospace" fill={COLORS.MUTED}>Origin · method · header</text>
            </g>
          )}

          {/* ── policy shelf (izin API) ── */}
          {policyOpen && (
            <g transform={T('policyCard', AXIS_X + 0, POLICY_Y)} opacity={O('policyCard')}>
              <rect x={-120} y={-44} width={240} height={88} rx={12} fill={COLORS.PANEL} stroke={COLORS.BORDER} strokeWidth={1.5} />
              <text x={0} y={-26} textAnchor="middle" fontSize={9} fontWeight={700} fontFamily="monospace" letterSpacing={1.5} fill={COLORS.MUTED}>IZIN (POLICY)</text>
              {/* baris izin */}
              <g transform="translate(0, -2)">
                <text x={-96} y={4} fontSize={8} fontFamily="monospace" fill={COLORS.TEXT}>Allow-Origin</text>
                <text x={30} y={4} fontSize={8} fontFamily="monospace" fill={match ? COLORS.ALLOW : COLORS.MUTED}>{match ? '✓ app' : '—'}</text>
              </g>
              <g transform="translate(0, 20)">
                <text x={-96} y={4} fontSize={8} fontFamily="monospace" fill={COLORS.TEXT}>Allow-Methods</text>
                <text x={30} y={4} fontSize={8} fontFamily="monospace" fill={match ? COLORS.ALLOW : COLORS.MUTED}>{match ? '✓ POST' : '—'}</text>
              </g>
              {mismatch && (
                <g transform="translate(0, 42)">
                  <text x={-96} y={4} fontSize={8} fontFamily="monospace" fill={COLORS.DENY}>Allow-Headers</text>
                  <text x={30} y={4} fontSize={8} fontFamily="monospace" fill={COLORS.DENY}>✕ X-Token</text>
                </g>
              )}
            </g>
          )}

          {/* ── respons API masuk gate ── */}
          {respIn && (
            <g transform={T('respCard', AXIS_X, RESPONS_Y)} opacity={O('respCard')} filter="url(#glow)">
              <rect x={-96} y={-28} width={192} height={56} rx={12} fill={COLORS.PANEL} stroke={jsRead ? COLORS.ALLOW : COLORS.API} strokeWidth={2} />
              <text x={0} y={6} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="monospace" fill={jsRead ? COLORS.ALLOW : COLORS.API}>respons data</text>
            </g>
          )}

          {/* ── closing — label kecil ── */}
          {jsRead && (
            <g transform={T('closingCard', AXIS_X, CLOSING_Y)} opacity={O('closingCard')}>
              <text x={0} y={0} textAnchor="middle" fontSize={10} fontWeight={700} fontFamily="monospace" fill={COLORS.DENY}>CORS bukan auth</text>
            </g>
          )}

          {/* ── CAPTION ── */}
          {caption && contentStarted && (
            <g transform={`translate(${AXIS_X}, ${CLOSING_Y + 130})`}>
              <rect x={-170} y={-18} width={340} height={34} rx={10} fill={COLORS.BG} opacity={0.88} stroke={COLORS.BORDER} strokeWidth={1.5} />
              <text x={0} y={3} textAnchor="middle" fontSize={13} fontWeight={600} fontFamily="sans-serif" fill={COLORS.TEXT}>{caption}</text>
            </g>
          )}
        </ContentBodyV1>
      </g>
    </svg>
  )
}
