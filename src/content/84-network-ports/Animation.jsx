// src/content/84-network-ports/Animation.jsx
// ═══════════════════════════════════════════════════════════════════════════
// EKSEKUSI-01 (lihat _docs/NETWORK_PORTS_PLAN.md): eksekusi penuh storyboard
// 6-Act plan — Host bukan service → Listener menerima → TCP dan UDP →
// Dua ujung koneksi → Scope dan firewall → Jalur nyata. Tidak ada
// scanning/enumeration/firewall-change/exploit di manapun (Batas aman plan).
//
// Scene shell: scene-ui V1 (SceneChromeV1 + DEFAULT_LAYOUT_V1) — intro hero
// → header morph, Act badge + dot navigator, dan content body semua lewat
// component shared (lihat docs/standardizations/02-topic-contract-scene-shell.md
// §10.1). Diagram tiap Act (port doors, listener cards, TCP/UDP lane,
// endpoint socket, scope/firewall gate, real-path chain) tetap milik topic
// ini sepenuhnya, dirender lewat content.render(w,h) dalam local coordinate.
//
// Anchor per-Act tidak saling menumpuk state visual — tiap Act punya diagram
// sendiri di body yang sama, transisi lewat popIn/popOut standar (pola
// 44-ssh), bukan continuity lintas-Act (topic ini single-concept per Act,
// tidak butuh objek persisten yang di-morph lintas Act).
//
// Icon: inline SVG primitif (rect/line/circle/text), tidak ada folder
// icons/ untuk topic ini — konsisten dengan 17-rest-api dan 44-ssh.
//
// CATATAN EKSEKUSI: kode + data ditulis sekali jalan, BELUM preview manual
// di browser maupun export MP4 — status ini normal untuk first pass (pola
// yang sama seperti 44-ssh saat pertama ditulis). metadata.json status
// tetap "draft" sampai preview manual dilakukan.
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, SFX_MAP,
  INTRO_CATEGORY_LABEL, INTRO_TITLE_A, INTRO_TITLE_B, INTRO_SUBTITLE,
  PORT_DOORS, ACT1_BEATS,
  LISTENERS, ACT2_BEATS,
  TCP_STEPS, UDP_DATAGRAMS, ACT3_BEATS,
  CONNECTION_ENDPOINT, ACT4_BEATS,
  BIND_SCOPES, FIREWALL_CHECKS, ACT5_BEATS,
  REAL_PATH_HOPS, HEALTH_STATES, ACT6_BEATS,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'
import { SceneChromeV1, DEFAULT_LAYOUT_V1 } from '../../shared/scene-ui/v1'

export default function NetworkPortsAnimation({
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
  const [showIntro, setShowIntro] = useState(true)

  // ── stage — enum tunggal penentu diagram aktif di dalam content body.
  // highlightId — item mana di dalam stage aktif yang disorot narasi;
  // semua item pada stage tsb tetap dirender (tidak ada yang disembunyikan). ──
  const [stage, setStage] = useState('idle')
  const [highlightId, setHighlightId] = useState(null)

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
  const goStage = (tl, time, id) => tl.add(() => setStage(id), time)
  const highlight = (tl, time, id) => tl.add(() => setHighlightId(id), time)

  // ═══════════════════════════════════════════════════════════════════════
  // MASTER TIMELINE — 6 Act tanpa jeda kosong.
  // ═══════════════════════════════════════════════════════════════════════
  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 })
    tlRef.current = tl
    window.__animationTimeline = tl
    window.__flushSync = flushSync

    let t = 0

    // ── reset state tiap awal loop (wajib, lihat 01-architecture-runtime §7) ──
    tl.add(() => {
      setMorphP(0); setShowIntro(true)
      setStage('idle'); setHighlightId(null)
      setPop({}); setCaption(''); setPhaseIdx(0)
    }, t)

    // ── INTRO — hero centered → header, pola Tailscale (44-ssh, 17-rest-api) ──
    t += 0.2
    const mo = { p: 0 }
    tl.to(mo, { p: 1, duration: 0.8, ease: 'power3.inOut', onUpdate: () => setMorphP(mo.p) }, t)
    sfxOn(tl, t, () => sfxLoader.transition(SFX_MAP.TELEPORT.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 0.8
    tl.add(() => setShowIntro(false), t)

    // ═══════════════ ACT 1 — Host Bukan Service ═══════════════
    tl.add(() => setPhaseIdx(0), t)
    goStage(tl, t, 'client')
    popIn(tl, t + 0.05, 'client', { fromY: -16 })
    say(tl, t + 0.1, ACT1_BEATS.intro.caption)
    t += 1.0
    goStage(tl, t, 'server')
    popIn(tl, t + 0.05, 'server', { fromY: -16 })
    sfxOn(tl, t + 0.05, () => sfxLoader.ui(SFX_MAP.TICK.name, { volume: volumeRef.current, speed: speedRef.current }))
    say(tl, t + 0.1, ACT1_BEATS.intro.sub)
    t += 1.6

    goStage(tl, t, 'doors')
    popIn(tl, t + 0.05, 'doorsRow', { fromY: 20 })
    say(tl, t + 0.1, ACT1_BEATS.doors.caption)
    let dt = t + 0.5
    PORT_DOORS.forEach((d) => {
      highlight(tl, dt, d.id)
      say(tl, dt + 0.05, `Port ${d.label} → ${d.service}`)
      sfxOn(tl, dt, () => sfxLoader.ui(SFX_MAP.TICK.name, { volume: volumeRef.current, speed: speedRef.current }))
      dt += 0.65
    })
    t = dt + 0.2
    highlight(tl, t, null)

    goStage(tl, t, 'closing1')
    say(tl, t + 0.05, ACT1_BEATS.closing.caption)
    sfxOn(tl, t + 0.05, () => sfxLoader.success(SFX_MAP.DING.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 1.6
    popOut(tl, t, 'doorsRow', {})
    popOut(tl, t, 'client', {})
    popOut(tl, t, 'server', {})
    t += 0.4

    // ═══════════════ ACT 2 — Listener Menerima ═══════════════
    tl.add(() => setPhaseIdx(1), t)
    goStage(tl, t, 'listeners')
    popIn(tl, t + 0.05, 'listenerCards', { fromY: 16 })
    say(tl, t + 0.1, ACT2_BEATS.intro.caption)
    let lt = t + 0.6
    LISTENERS.forEach((l) => {
      highlight(tl, lt, l.id)
      say(tl, lt + 0.05, `${l.label} listen di ${l.addr}`)
      sfxOn(tl, lt, () => sfxLoader.ui(SFX_MAP.CHIME.name, { volume: volumeRef.current, speed: speedRef.current }))
      lt += 0.95
    })
    t = lt + 0.2

    goStage(tl, t, 'socket2')
    say(tl, t + 0.05, ACT2_BEATS.socket.caption)
    popIn(tl, t + 0.15, 'socketNote2', { fromY: 12 })
    t += 1.8

    goStage(tl, t, 'closing2')
    say(tl, t + 0.05, ACT2_BEATS.closing.caption)
    sfxOn(tl, t + 0.05, () => sfxLoader.success(SFX_MAP.CONFIRM.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 1.6
    popOut(tl, t, 'listenerCards', {})
    popOut(tl, t, 'socketNote2', {})
    highlight(tl, t, null)
    t += 0.4

    // ═══════════════ ACT 3 — TCP dan UDP ═══════════════
    tl.add(() => setPhaseIdx(2), t)
    goStage(tl, t, 'tcpudp-intro')
    popIn(tl, t + 0.05, 'lanes', { fromY: 16 })
    say(tl, t + 0.1, ACT3_BEATS.intro.caption)
    t += 1.4

    goStage(tl, t, 'tcp')
    say(tl, t + 0.05, ACT3_BEATS.tcp.caption)
    let tt = t + 0.4
    TCP_STEPS.forEach((s) => {
      highlight(tl, tt, s.id)
      say(tl, tt + 0.05, `${s.label} — ${s.desc}`)
      sfxOn(tl, tt, () => sfxLoader.ui(SFX_MAP.TICK.name, { volume: volumeRef.current, speed: speedRef.current }))
      tt += 0.8
    })
    t = tt + 0.1
    sfxOn(tl, t, () => sfxLoader.success(SFX_MAP.CONFIRM.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 0.5

    goStage(tl, t, 'udp')
    highlight(tl, t, null)
    say(tl, t + 0.05, ACT3_BEATS.udp.caption)
    let ut = t + 0.4
    UDP_DATAGRAMS.forEach((d) => {
      highlight(tl, ut, d.id)
      sfxOn(tl, ut, () => {
        if (d.delivered) sfxLoader.ui(SFX_MAP.POP2.name, { volume: volumeRef.current, speed: speedRef.current })
        else sfxLoader.warning(SFX_MAP.ALERT_PULSE.name, { volume: volumeRef.current, speed: speedRef.current })
      })
      ut += 0.6
    })
    t = ut + 0.3

    goStage(tl, t, 'closing3')
    highlight(tl, t, null)
    say(tl, t + 0.05, ACT3_BEATS.closing.caption)
    t += 1.6
    popOut(tl, t, 'lanes', {})
    t += 0.4

    // ═══════════════ ACT 4 — Dua Ujung Koneksi ═══════════════
    tl.add(() => setPhaseIdx(3), t)
    goStage(tl, t, 'endpoints')
    popIn(tl, t + 0.05, 'endpointClient', { fromX: -16 })
    popIn(tl, t + 0.2, 'endpointServer', { fromX: 16, sfx: false })
    popIn(tl, t + 0.35, 'endpointLine', {})
    say(tl, t + 0.1, ACT4_BEATS.intro.caption)
    sfxOn(tl, t + 0.35, () => sfxLoader.transition(SFX_MAP.WHOOSH.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 1.8

    goStage(tl, t, 'socket4')
    say(tl, t + 0.05, ACT4_BEATS.socket.caption)
    popIn(tl, t + 0.15, 'socketTuple', { fromY: 12 })
    t += 2.0

    goStage(tl, t, 'closing4')
    say(tl, t + 0.05, ACT4_BEATS.closing.caption)
    sfxOn(tl, t + 0.05, () => sfxLoader.success(SFX_MAP.DING.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 1.6
    popOut(tl, t, 'endpointClient', {})
    popOut(tl, t, 'endpointServer', {})
    popOut(tl, t, 'endpointLine', {})
    popOut(tl, t, 'socketTuple', {})
    t += 0.4

    // ═══════════════ ACT 5 — Scope dan Firewall ═══════════════
    tl.add(() => setPhaseIdx(4), t)
    goStage(tl, t, 'scope')
    popIn(tl, t + 0.05, 'scopeRow', { fromY: 16 })
    say(tl, t + 0.1, ACT5_BEATS.intro.caption)
    let st = t + 0.6
    BIND_SCOPES.forEach((s) => {
      highlight(tl, st, s.id)
      say(tl, st + 0.05, `${s.label.replace('\n', ' ')} — ${s.desc}`)
      sfxOn(tl, st, () => sfxLoader.ui(SFX_MAP.TICK.name, { volume: volumeRef.current, speed: speedRef.current }))
      st += 0.85
    })
    t = st + 0.2
    say(tl, t, ACT5_BEATS.scope.caption)
    t += 1.4
    popOut(tl, t, 'scopeRow', {})
    highlight(tl, t, null)
    t += 0.3

    goStage(tl, t, 'firewall')
    popIn(tl, t + 0.05, 'firewallGate', { fromY: 16 })
    say(tl, t + 0.1, ACT5_BEATS.firewall.caption)
    let ft = t + 0.6
    FIREWALL_CHECKS.forEach((c) => {
      highlight(tl, ft, c.id)
      say(tl, ft + 0.05, c.label)
      sfxOn(tl, ft, () => sfxLoader.ui(SFX_MAP.TICK.name, { volume: volumeRef.current, speed: speedRef.current }))
      ft += 0.9
    })
    t = ft + 0.2
    sfxOn(tl, t, () => sfxLoader.success(SFX_MAP.CONFIRM.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 0.6

    goStage(tl, t, 'closing5')
    highlight(tl, t, null)
    say(tl, t + 0.05, ACT5_BEATS.closing.caption)
    t += 1.6
    popOut(tl, t, 'firewallGate', {})
    t += 0.4

    // ═══════════════ ACT 6 — Jalur Nyata ═══════════════
    tl.add(() => setPhaseIdx(5), t)
    goStage(tl, t, 'realpath')
    popIn(tl, t + 0.05, 'hopChain', { fromY: 16 })
    say(tl, t + 0.1, ACT6_BEATS.intro.caption)
    let ht = t + 0.6
    REAL_PATH_HOPS.forEach((h) => {
      highlight(tl, ht, h.id)
      sfxOn(tl, ht, () => sfxLoader.transition(SFX_MAP.SWOOSH.name, { volume: volumeRef.current, speed: speedRef.current }))
      ht += 0.7
    })
    t = ht + 0.2
    say(tl, t, ACT6_BEATS.mapping.caption)
    t += 1.6
    popOut(tl, t, 'hopChain', {})
    highlight(tl, t, null)
    t += 0.3

    goStage(tl, t, 'health')
    popIn(tl, t + 0.05, 'healthList', { fromY: 16 })
    say(tl, t + 0.1, ACT6_BEATS.health.caption)
    let hct = t + 0.6
    HEALTH_STATES.forEach((h) => {
      highlight(tl, hct, h.id)
      sfxOn(tl, hct, () => {
        if (h.ok) sfxLoader.success(SFX_MAP.DING.name, { volume: volumeRef.current, speed: speedRef.current })
        else sfxLoader.warning(SFX_MAP.ALERT_PULSE.name, { volume: volumeRef.current, speed: speedRef.current })
      })
      hct += 0.85
    })
    t = hct + 0.2

    goStage(tl, t, 'closing6')
    highlight(tl, t, null)
    say(tl, t + 0.05, ACT6_BEATS.closing.caption)
    t += 2.0
    popOut(tl, t, 'healthList', {})
    t += 0.4

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

  // renderChips — daftar konsep dirender SELURUHNYA sebagai chip row;
  // item aktif (activeId) menyala penuh, sisanya tetap terlihat redup.
  // Tidak ada detail yang disembunyikan — hanya sorotan yang berpindah.
  const renderChips = (items, y, w, activeId, opts = {}) => {
    const { chipH = 64, getLabel = (it) => it.label, getColor = () => COLORS.PORT, cols } = opts
    const n = cols || items.length
    const gap = 10
    const cw = (w - gap * (n - 1)) / n
    return items.map((it, i) => {
      const active = activeId === it.id
      const color = getColor(it) || COLORS.PORT
      const label = String(getLabel(it))
      const lines = label.split('\n')
      return (
        <g key={it.id} transform={`translate(${i * (cw + gap)}, ${y})`}>
          <rect width={cw} height={chipH} rx={10}
            fill={active ? color : COLORS.PANEL}
            stroke={color} strokeWidth={active ? 0 : 1.5}
            opacity={active ? 1 : 0.55} />
          {lines.map((ln, li) => (
            <text key={li} x={cw / 2} y={chipH / 2 + 4 + (li - (lines.length - 1) / 2) * 14}
              textAnchor="middle" fontSize={12} fontWeight={700}
              fontFamily="sans-serif" fill={active ? COLORS.BG : COLORS.TEXT}>
              {ln.length > 18 ? ln.slice(0, 16) + '…' : ln}
            </text>
          ))}
        </g>
      )
    })
  }

  // ── ACT 1 — Host Bukan Service ──
  const renderHostService = (w) => (
    <>
      <g transform={T('client', w / 2, 36)} opacity={O('client')}>
        <rect x={-90} y={-24} width={180} height={48} rx={10} fill={COLORS.PANEL} stroke={COLORS.IP} strokeWidth={1.5} />
        <text x={0} y={5} textAnchor="middle" fontSize={14} fontWeight={700} fill={COLORS.TEXT} fontFamily="sans-serif">CLIENT</text>
      </g>
      {O('client') > 0 && O('server') > 0 && (
        <line x1={w / 2} y1={62} x2={w / 2} y2={128} stroke={COLORS.BORDER} strokeWidth={2} strokeDasharray="4 6" />
      )}
      <g transform={T('server', w / 2, 160)} opacity={O('server')}>
        <rect x={-150} y={-32} width={300} height={64} rx={12} fill={COLORS.PANEL} stroke={COLORS.IP} strokeWidth={2} />
        <text x={0} y={-6} textAnchor="middle" fontSize={13} fontWeight={700} fill={COLORS.IP} fontFamily="monospace">203.0.113.10</text>
        <text x={0} y={16} textAnchor="middle" fontSize={11} fill={COLORS.MUTED} fontFamily="sans-serif">SERVER — satu host, satu IP</text>
      </g>
      <g transform={T('doorsRow', 0, 250)} opacity={O('doorsRow')}>
        {renderChips(PORT_DOORS, 0, w, highlightId, {
          chipH: 92, getColor: () => COLORS.PORT,
          getLabel: (d) => `${d.label}\n${d.service}`,
        })}
      </g>
    </>
  )

  // ── ACT 2 — Listener Menerima ──
  const renderListener = (w) => (
    <>
      <g transform={T('listenerCards', 0, 30)} opacity={O('listenerCards')}>
        {LISTENERS.map((l, i) => {
          const active = highlightId === l.id
          const cw = (w - 20) / 2
          return (
            <g key={l.id} transform={`translate(${i * (cw + 20)}, 0)`}>
              <rect width={cw} height={140} rx={14}
                fill={COLORS.PANEL} stroke={active ? COLORS.LISTENER : COLORS.BORDER}
                strokeWidth={active ? 2.5 : 1.5} />
              <text x={cw / 2} y={40} textAnchor="middle" fontSize={16} fontWeight={800}
                fontFamily="sans-serif" fill={COLORS.TEXT}>{l.label}</text>
              <text x={cw / 2} y={64} textAnchor="middle" fontSize={13} fontFamily="monospace"
                fill={COLORS.MUTED}>{l.addr}</text>
              {active && (
                <g transform={`translate(${cw / 2}, 100)`}>
                  <rect x={-46} y={-16} width={92} height={32} rx={16} fill={COLORS.LISTENER} />
                  <text x={0} y={5} textAnchor="middle" fontSize={12} fontWeight={800}
                    fontFamily="monospace" fill={COLORS.BG}>{l.state}</text>
                </g>
              )}
            </g>
          )
        })}
      </g>
      <g transform={T('socketNote2', w / 2, 210)} opacity={O('socketNote2')}>
        <rect x={-260} y={-24} width={520} height={48} rx={10} fill={COLORS.PANEL} stroke={COLORS.LISTENER} strokeWidth={1.5} />
        <text x={0} y={6} textAnchor="middle" fontSize={13} fontFamily="monospace" fill={COLORS.LISTENER}>
          socket = TCP · 0.0.0.0 · port · LISTEN
        </text>
      </g>
    </>
  )

  // ── ACT 3 — TCP dan UDP ──
  const renderTcpUdp = (w) => {
    const laneW = (w - 24) / 2
    return (
      <g transform={T('lanes', 0, 20)} opacity={O('lanes')}>
        <g>
          <rect width={laneW} height={430} rx={14} fill={COLORS.PANEL} stroke={COLORS.TCP} strokeWidth={1.5} />
          <text x={laneW / 2} y={32} textAnchor="middle" fontSize={14} fontWeight={800}
            fontFamily="sans-serif" fill={COLORS.TCP}>TCP</text>
          <text x={laneW / 2} y={52} textAnchor="middle" fontSize={11} fontFamily="sans-serif"
            fill={COLORS.MUTED}>connection-oriented</text>
          {TCP_STEPS.map((s, i) => {
            const active = highlightId === s.id
            const y = 90 + i * 100
            return (
              <g key={s.id} opacity={active || highlightId == null ? 1 : 0.4}>
                <circle cx={laneW / 2} cy={y} r={20} fill={active ? COLORS.TCP : COLORS.BORDER} />
                <text x={laneW / 2} y={y + 5} textAnchor="middle" fontSize={11} fontWeight={800}
                  fontFamily="monospace" fill={active ? COLORS.BG : COLORS.TEXT}>{s.label}</text>
                {i < TCP_STEPS.length - 1 && (
                  <line x1={laneW / 2} y1={y + 20} x2={laneW / 2} y2={y + 80} stroke={COLORS.BORDER} strokeWidth={2} />
                )}
              </g>
            )
          })}
        </g>
        <g transform={`translate(${laneW + 24}, 0)`}>
          <rect width={laneW} height={430} rx={14} fill={COLORS.PANEL} stroke={COLORS.UDP} strokeWidth={1.5} />
          <text x={laneW / 2} y={32} textAnchor="middle" fontSize={14} fontWeight={800}
            fontFamily="sans-serif" fill={COLORS.UDP}>UDP</text>
          <text x={laneW / 2} y={52} textAnchor="middle" fontSize={11} fontFamily="sans-serif"
            fill={COLORS.MUTED}>datagram, tanpa jaminan</text>
          {UDP_DATAGRAMS.map((d, i) => {
            const active = highlightId === d.id
            const y = 100 + i * 110
            const color = d.delivered ? COLORS.UDP : COLORS.FIREWALL
            return (
              <g key={d.id} opacity={active || highlightId == null ? 1 : 0.4}>
                <rect x={laneW / 2 - 60} y={y - 20} width={120} height={40} rx={8}
                  fill={active ? color : COLORS.BORDER} />
                <text x={laneW / 2} y={y + 5} textAnchor="middle" fontSize={11} fontWeight={700}
                  fontFamily="sans-serif" fill={active ? COLORS.BG : COLORS.TEXT}>{d.label}</text>
                {active && (
                  <text x={laneW / 2} y={y + 42} textAnchor="middle" fontSize={11} fontWeight={800}
                    fontFamily="sans-serif" fill={color}>{d.delivered ? 'sampai' : 'hilang'}</text>
                )}
              </g>
            )
          })}
        </g>
      </g>
    )
  }

  // ── ACT 4 — Dua Ujung Koneksi ──
  const renderEndpoints = (w) => (
    <>
      <g transform={T('endpointClient', w * 0.22, 60)} opacity={O('endpointClient')}>
        <rect x={-100} y={-40} width={200} height={80} rx={12} fill={COLORS.PANEL} stroke={COLORS.PORT} strokeWidth={1.5} />
        <text x={0} y={-8} textAnchor="middle" fontSize={12} fontWeight={700} fill={COLORS.TEXT} fontFamily="sans-serif">CLIENT</text>
        <text x={0} y={14} textAnchor="middle" fontSize={12} fontFamily="monospace" fill={COLORS.PORT}>
          :{CONNECTION_ENDPOINT.srcPort}
        </text>
      </g>
      {O('endpointLine') > 0 && (
        <line x1={w * 0.22 + 100} y1={60} x2={w * 0.78 - 100} y2={60}
          stroke={COLORS.PORT} strokeWidth={3} opacity={O('endpointLine')} />
      )}
      <g transform={T('endpointServer', w * 0.78, 60)} opacity={O('endpointServer')}>
        <rect x={-100} y={-40} width={200} height={80} rx={12} fill={COLORS.PANEL} stroke={COLORS.IP} strokeWidth={1.5} />
        <text x={0} y={-8} textAnchor="middle" fontSize={12} fontWeight={700} fill={COLORS.TEXT} fontFamily="sans-serif">SERVER</text>
        <text x={0} y={14} textAnchor="middle" fontSize={12} fontFamily="monospace" fill={COLORS.IP}>
          :{CONNECTION_ENDPOINT.dstPort}
        </text>
      </g>
      <g transform={T('socketTuple', w / 2, 200)} opacity={O('socketTuple')}>
        <rect x={-310} y={-56} width={620} height={112} rx={12} fill={COLORS.PANEL} stroke={COLORS.PORT} strokeWidth={1.5} />
        <text x={0} y={-22} textAnchor="middle" fontSize={12} fontFamily="monospace" fill={COLORS.TEXT}>
          src {CONNECTION_ENDPOINT.srcIp}:{CONNECTION_ENDPOINT.srcPort} → dst {CONNECTION_ENDPOINT.dstIp}:{CONNECTION_ENDPOINT.dstPort}
        </text>
        <text x={0} y={4} textAnchor="middle" fontSize={11} fontFamily="sans-serif" fill={COLORS.MUTED}>
          source: {CONNECTION_ENDPOINT.srcNote}
        </text>
        <text x={0} y={26} textAnchor="middle" fontSize={11} fontFamily="sans-serif" fill={COLORS.MUTED}>
          destination: {CONNECTION_ENDPOINT.dstNote}
        </text>
      </g>
    </>
  )

  // ── ACT 5 — Scope dan Firewall ──
  const renderScopeFirewall = (w) => (
    <>
      <g transform={T('scopeRow', 0, 20)} opacity={O('scopeRow')}>
        {renderChips(BIND_SCOPES, 0, w, highlightId, { chipH: 96, getColor: () => COLORS.PORT })}
      </g>
      <g transform={T('firewallGate', 0, 40)} opacity={O('firewallGate')}>
        <rect width={w} height={280} rx={14} fill={COLORS.PANEL} stroke={COLORS.FIREWALL} strokeWidth={1.5} />
        <text x={w / 2} y={34} textAnchor="middle" fontSize={13} fontWeight={800}
          fontFamily="sans-serif" fill={COLORS.FIREWALL}>FIREWALL / POLICY GATE</text>
        {FIREWALL_CHECKS.map((c, i) => {
          const active = highlightId === c.id
          const y = 90 + i * 90
          return (
            <g key={c.id} opacity={active || highlightId == null ? 1 : 0.4}>
              <circle cx={50} cy={y} r={16} fill={active ? COLORS.ALLOW : COLORS.BORDER} />
              <text x={50} y={y + 5} textAnchor="middle" fontSize={13} fontWeight={800}
                fontFamily="sans-serif" fill={COLORS.BG}>{i + 1}</text>
              <text x={82} y={y + 5} fontSize={13} fontFamily="sans-serif" fill={COLORS.TEXT}>
                {c.label}
              </text>
            </g>
          )
        })}
      </g>
    </>
  )

  // ── ACT 6 — Jalur Nyata ──
  const renderRealPath = (w) => (
    <>
      <g transform={T('hopChain', 0, 40)} opacity={O('hopChain')}>
        {REAL_PATH_HOPS.map((h, i) => {
          const active = highlightId === h.id
          const cw = (w - 60) / REAL_PATH_HOPS.length
          const x = i * (cw + 20)
          return (
            <g key={h.id}>
              <rect x={x} width={cw} height={80} rx={10}
                fill={active ? COLORS.NAT : COLORS.PANEL}
                stroke={COLORS.NAT} strokeWidth={active ? 0 : 1.5}
                opacity={active || highlightId == null ? 1 : 0.5} />
              <text x={x + cw / 2} y={44} textAnchor="middle" fontSize={11} fontWeight={700}
                fontFamily="sans-serif" fill={active ? COLORS.BG : COLORS.TEXT}>
                {h.label.length > 16 ? h.label.slice(0, 14) + '…' : h.label}
              </text>
              {i < REAL_PATH_HOPS.length - 1 && (
                <text x={x + cw + 10} y={46} textAnchor="middle" fontSize={16} fill={COLORS.MUTED}>→</text>
              )}
            </g>
          )
        })}
      </g>
      <g transform={T('healthList', 0, 40)} opacity={O('healthList')}>
        {HEALTH_STATES.map((h, i) => {
          const active = highlightId === h.id
          const y = i * 76
          const color = h.ok ? COLORS.ALLOW : COLORS.HEALTH
          return (
            <g key={h.id} opacity={active || highlightId == null ? 1 : 0.45}>
              <rect y={y} width={w} height={60} rx={10}
                fill={COLORS.PANEL} stroke={color} strokeWidth={active ? 2.5 : 1.5} />
              <circle cx={36} cy={y + 30} r={12} fill={color} />
              <text x={36} y={y + 35} textAnchor="middle" fontSize={13} fontWeight={800}
                fontFamily="sans-serif" fill={COLORS.BG}>{h.ok ? '✓' : '?'}</text>
              <text x={64} y={y + 35} fontSize={14} fontFamily="sans-serif" fill={COLORS.TEXT}>{h.label}</text>
            </g>
          )
        })}
      </g>
    </>
  )

  const renderStageContent = (w, h) => {
    const byPhase = [renderHostService, renderListener, renderTcpUdp, renderEndpoints, renderScopeFirewall, renderRealPath]
    const fn = byPhase[phaseIdx] || renderHostService
    return (
      <>
        {fn(w, h)}
        {caption && (
          <g transform={`translate(${w / 2}, ${h - 34})`}>
            <rect x={-(w / 2) + 4} y={-28} width={w - 8} height={56} rx={12}
              fill="rgba(7,9,19,0.85)" stroke={COLORS.BORDER} strokeWidth={1} />
            <text x={0} y={6} textAnchor="middle" fontSize={16} fontWeight={600}
              fontFamily="sans-serif" fill={COLORS.TEXT}>
              {caption.length > 62 ? caption.slice(0, 60) + '…' : caption}
            </text>
          </g>
        )}
      </>
    )
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
        }}
        showNavigator={!showIntro}
        navigator={{ phases: PHASES, activeIndex: phaseIdx }}
        showContent={!showIntro}
        content={{ render: (w, h) => renderStageContent(w, h) }}
      />
    </svg>
  )
}
