// src/content/81-network-interface/Animation.jsx
// ═══════════════════════════════════════════════════════════════════════════
// EKSEKUSI-01 (lihat _docs/NETWORK_INTERFACE_PLAN.md): 6 Act sesuai
// storyboard — titik koneksi, link dan identity, mendapat konfigurasi,
// memilih jalan, nama ke tujuan, interface virtual.
//
// Anchor persisten (Continuity map, §1.O): ANCHOR_POS — 1 card "eth0" yang
// settle di akhir Act 1, TIDAK dihapus sampai penutup Act 5. Act 6 SENGAJA
// tidak memakai anchor ini (lihat komentar ANCHOR_POS di data.js) — Act 6
// membahas interface LAIN yang bukan kartu fisik.
//
// Batas aman (plan): tidak ada IP/MAC nyata, tidak ada command, tidak ada
// perubahan network — semua label konsep, tanpa angka/alamat spesifik.
//
// Pola daftar konsep (interface types, layers, config paths/results, route
// targets, name hops, virtual interfaces): SEMUA item dirender sekaligus via
// ConceptCard, satu id disorot narasi — pola sama dengan 91-linux-server
// (ChipRow) dan 44-ssh (renderChips).
//
// Icon: inline SVG, konsisten dengan 44-ssh/91-linux-server — tidak ada
// folder icons/ untuk topic ini.
//
// CATATAN EKSEKUSI: kode + data ditulis sekali jalan, BELUM preview manual
// di browser maupun export MP4 — status ini normal untuk first pass, sama
// seperti 91-linux-server/44-ssh saat pertama ditulis. Durasi Act di PHASES
// (data.js) adalah estimasi awal, WAJIB diukur ulang dari timeline nyata
// setelah preview manual.
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, SFX_MAP, ANCHOR_POS,
  INTRO_CATEGORY_LABEL, INTRO_TITLE_A, INTRO_TITLE_B, INTRO_SUBTITLE,
  INTERFACE_TYPES, ACT1_BEATS,
  IDENTITY_LAYERS, ACT2_BEATS,
  CONFIG_PATHS, CONFIG_RESULTS, ACT3_BEATS,
  ROUTE_TARGETS, ACT4_BEATS,
  NAME_HOPS, ACT5_BEATS,
  VIRTUAL_INTERFACES, ACT6_BEATS, CLOSING_LINE,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'
import { IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1 } from '../../shared/scene-ui/v1'

// ── CaptionBar — narasi transisi pendek, local coordinate ContentBodyV1
// (body center x=366, lihat DEFAULT_LAYOUT_V1.body). ──
const CaptionBar = ({ text, color }) => {
  if (!text) return null
  return (
    <g transform="translate(366 60)">
      <rect x="-300" y="-24" width="600" height="48" rx="22" fill={COLORS.PANEL} stroke={color || COLORS.BORDER} strokeWidth="1.5" opacity="0.96" />
      <text x="0" y="6" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="13.5" fill={COLORS.TEXT}>{text}</text>
    </g>
  )
}

// ── ConceptCard — kartu konsep serbaguna dipakai lintas Act. Semua item
// selalu dirender (tidak ada detail disembunyikan), hanya sorotan
// (active/dim) yang berpindah — pola sama 44-ssh renderChips. ──
const ConceptCard = ({ x, y, w = 150, h = 64, label, desc, color, active = true, dim = false }) => (
  <g transform={`translate(${x} ${y})`} opacity={dim ? 0.4 : 1}>
    <rect x={-w / 2} y={-h / 2} width={w} height={h} rx={12} fill={COLORS.PANEL}
      stroke={color} strokeWidth={active ? 2.2 : 1.3} opacity={active ? 1 : 0.6} />
    <text x="0" y={desc && active ? -6 : 5} textAnchor="middle" fontFamily="monospace" fontWeight="700"
      fontSize="12" fill={active ? color : COLORS.MUTED}>{label}</text>
    {desc && active && (
      <text x="0" y="15" textAnchor="middle" fontFamily="monospace" fontSize="8.5" fill={COLORS.MUTED}>{desc}</text>
    )}
  </g>
)

// ── ConnLine — garis penghubung antar node/card, dashed by default. ──
const ConnLine = ({ x1, y1, x2, y2, color, dashed = true, opacity = 0.7, width = 2 }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width}
    strokeDasharray={dashed ? '6 5' : undefined} opacity={opacity} />
)

// ── ProgressDot — titik paket bergerak sepanjang segmen, progress 0..1. ──
const ProgressDot = ({ x1, y1, x2, y2, progress, color }) => {
  if (progress <= 0) return null
  const x = x1 + (x2 - x1) * progress
  const y = y1 + (y2 - y1) * progress
  return <circle cx={x} cy={y} r={7} fill={color} />
}

// ── AnchorIcon — persistent "eth0" (Act 1 settle → Act 5), interface
// fisik yang jadi fokus cerita sejak dipilih dari 3 jenis di Act 1. ──
const AnchorIcon = ({ visible, glow, label }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${ANCHOR_POS.x} ${ANCHOR_POS.y})`}>
      {glow > 0 && (
        <circle r="46" fill="none" stroke={COLORS.WIRED} strokeWidth="1.4" opacity={glow * 0.5}>
          <animate attributeName="r" values="40;54;40" dur="1.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0;0.4" dur="1.6s" repeatCount="indefinite" />
        </circle>
      )}
      <rect x="-52" y="-36" width="104" height="72" rx="12" fill={COLORS.PANEL} stroke={COLORS.WIRED} strokeWidth="2.2" />
      <circle cx="0" cy="-10" r="14" fill="none" stroke={COLORS.WIRED} strokeWidth="2" />
      <line x1="-8" y1="-10" x2="8" y2="-10" stroke={COLORS.WIRED} strokeWidth="2" />
      <text x="0" y="24" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="13" fill={COLORS.WIRED}>{label}</text>
    </g>
  )
}

// ── TakeawayBar — panel penutup Act 6, sebelum loop mengulang. ──
const TakeawayBar = ({ visible, text }) => {
  if (!visible) return null
  return (
    <g transform="translate(366 880)">
      <rect x="-280" y="-30" width="560" height="60" rx="26" fill={COLORS.SUCCESS} opacity="0.14" />
      <rect x="-280" y="-30" width="560" height="60" rx="26" fill="none" stroke={COLORS.SUCCESS} strokeWidth="2" />
      <text x="0" y="7" textAnchor="middle" fontSize="16" fontWeight="700" fill={COLORS.SUCCESS}>{text}</text>
    </g>
  )
}

export default function NetworkInterfaceAnimation({
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
  const [caption, setCaption] = useState('')
  const [captionColor, setCaptionColor] = useState(COLORS.WIRED)

  const [morphP, setMorphP] = useState(0)
  const [contentStarted, setContentStarted] = useState(false)
  const [bodyOpacity, setBodyOpacity] = useState(0)

  // Act 1 — 3 jenis interface + anchor settle (persisten Act 1 → Act 5)
  const [typesVisible, setTypesVisible] = useState(false)
  const [typeHighlight, setTypeHighlight] = useState(null)
  const [anchorVisible, setAnchorVisible] = useState(false)
  const [anchorGlow, setAnchorGlow] = useState(0)

  // Act 2 — layer link/MAC/IP menumpuk di bawah anchor
  const [layerStep, setLayerStep] = useState(0)

  // Act 3 — DHCP/static branch → address/gateway/DNS
  const [branchVisible, setBranchVisible] = useState(false)
  const [branchChosen, setBranchChosen] = useState(null)
  const [resultsStep, setResultsStep] = useState(0)

  // Act 4 — route ke subnet lokal atau default gateway
  const [routeVisible, setRouteVisible] = useState(false)
  const [routeActive, setRouteActive] = useState(null)
  const [progressLocal, setProgressLocal] = useState(0)
  const [progressGateway, setProgressGateway] = useState(0)

  // Act 5 — chain nama → DNS → route → interface
  const [chainVisible, setChainVisible] = useState(false)
  const [chainHighlight, setChainHighlight] = useState(null)

  // Act 6 — interface virtual (tanpa anchor) + takeaway penutup
  const [virtualVisible, setVirtualVisible] = useState(false)
  const [virtualHighlight, setVirtualHighlight] = useState(null)
  const [takeawayVisible, setTakeawayVisible] = useState(false)

  const play = (entry) => {
    if (!audioUnlockedRef.current || !entry) return
    sfxLoader.play(entry.category, entry.name, { volume: volumeRef.current, speed: speedRef.current })
  }

  useEffect(() => {
    volumeRef.current = volume
    speedRef.current = speed
    audioUnlockedRef.current = audioUnlocked
    sfxLoader.setEnabled(Boolean(previewSfx && audioUnlocked))
  }, [volume, speed, previewSfx, audioUnlocked])

  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.5 })
    tlRef.current = tl
    window.__animationTimeline = tl
    window.__flushSync = flushSync

    const say = (time, text, color) => tl.add(() => {
      setCaption(text)
      if (color) setCaptionColor(color)
    }, time)
    const sfxOn = (time, entry) => tl.add(() => play(entry), time)

    // ── Reset state tiap awal loop (wajib, timeline repeat: -1) ──
    tl.add(() => {
      setPhaseIdx(0); setCaption(''); setCaptionColor(COLORS.WIRED)
      setMorphP(0); setContentStarted(false); setBodyOpacity(0)
      setTypesVisible(false); setTypeHighlight(null); setAnchorVisible(false); setAnchorGlow(0)
      setLayerStep(0)
      setBranchVisible(false); setBranchChosen(null); setResultsStep(0)
      setRouteVisible(false); setRouteActive(null); setProgressLocal(0); setProgressGateway(0)
      setChainVisible(false); setChainHighlight(null)
      setVirtualVisible(false); setVirtualHighlight(null); setTakeawayVisible(false)
    }, 0)

    // ── Intro — hero centered → header (pola Tailscale/44-ssh) ──
    let t = 0.2
    const mo = { p: 0 }
    tl.to(mo, { p: 1, duration: 0.8, ease: 'power3.inOut', onUpdate: () => setMorphP(mo.p) }, t)
    sfxOn(t, SFX_MAP.SHIMMER)
    t += 0.8
    tl.add(() => setContentStarted(true), t)
    const bf = { v: 0 }
    tl.to(bf, { v: 1, duration: 0.5, ease: 'power1.out', onUpdate: () => setBodyOpacity(bf.v) }, t)
    t += 0.5

    const actStart = []
    actStart[0] = t
    for (let i = 1; i < PHASES.length; i += 1) actStart[i] = actStart[i - 1] + PHASES[i - 1].duration

    // ═══════════════ ACT 1 — Titik koneksi (8s) ═══════════════
    const a1 = actStart[0]
    tl.add(() => { setPhaseIdx(0); setTypesVisible(true) }, a1)
    say(a1, ACT1_BEATS.hook.caption, COLORS.WIRED)
    let ft = a1 + 0.4
    INTERFACE_TYPES.forEach((it) => {
      tl.add(() => setTypeHighlight(it.id), ft)
      sfxOn(ft, SFX_MAP.TICK)
      ft += 1.0
    })
    say(ft, ACT1_BEATS.reveal.caption, COLORS.LINK)
    ft += 0.8
    tl.add(() => { setTypesVisible(false); setTypeHighlight(null) }, ft)
    tl.add(() => { setAnchorVisible(true); setAnchorGlow(1) }, ft + 0.1)
    sfxOn(ft + 0.1, SFX_MAP.CONFIRM)
    say(ft + 0.15, ACT1_BEATS.settle.caption, COLORS.WIRED)
    tl.add(() => setAnchorGlow(0.3), ft + 1.6)

    // ═══════════════ ACT 2 — Link dan identity (9s) ═══════════════
    const a2 = actStart[1]
    tl.add(() => setPhaseIdx(1), a2)
    say(a2, ACT2_BEATS.intro.caption, COLORS.LINK)
    let t2 = a2 + 0.5
    IDENTITY_LAYERS.forEach((layer, i) => {
      tl.add(() => setLayerStep(i + 1), t2)
      sfxOn(t2, i === 0 ? SFX_MAP.POP : SFX_MAP.TICK)
      if (i === 1) say(t2 + 0.1, ACT2_BEATS.layering.caption, COLORS.MAC)
      t2 += 1.3
    })
    say(t2 + 0.1, ACT2_BEATS.closing.caption, COLORS.IP)
    sfxOn(t2 + 0.1, SFX_MAP.CHIME)
    t2 += 1.4
    tl.add(() => setLayerStep(0), t2)

    // ═══════════════ ACT 3 — Mendapat konfigurasi (9s) ═══════════════
    const a3 = actStart[2]
    tl.add(() => setPhaseIdx(2), a3)
    say(a3, ACT3_BEATS.intro.caption, COLORS.CONFIG)
    tl.add(() => setBranchVisible(true), a3 + 0.3)
    sfxOn(a3 + 0.3, SFX_MAP.POP2)
    let t3 = a3 + 1.2
    tl.add(() => setBranchChosen('dhcp'), t3)
    sfxOn(t3, SFX_MAP.TICK)
    say(t3, ACT3_BEATS.chosen.caption, COLORS.CONFIG)
    t3 += 1.4
    tl.add(() => setBranchChosen('static'), t3)
    sfxOn(t3, SFX_MAP.TICK)
    t3 += 1.2
    tl.add(() => { setBranchVisible(false); setBranchChosen(null) }, t3)
    say(t3 + 0.1, ACT3_BEATS.closing.caption, COLORS.ROUTE)
    let rt = t3 + 0.3
    CONFIG_RESULTS.forEach((_, i) => {
      tl.add(() => setResultsStep(i + 1), rt)
      sfxOn(rt, SFX_MAP.CONFIRM)
      rt += 0.7
    })
    rt += 0.9
    tl.add(() => setResultsStep(0), rt)

    // ═══════════════ ACT 4 — Memilih jalan (9s) ═══════════════
    const a4 = actStart[3]
    tl.add(() => setPhaseIdx(3), a4)
    say(a4, ACT4_BEATS.intro.caption, COLORS.ROUTE)
    tl.add(() => setRouteVisible(true), a4 + 0.3)
    sfxOn(a4 + 0.3, SFX_MAP.POP)
    let t4 = a4 + 1.1
    tl.add(() => setRouteActive('local'), t4)
    say(t4, ACT4_BEATS.local.caption, COLORS.IP)
    const pl = { v: 0 }
    tl.to(pl, { v: 1, duration: 0.9, ease: 'power1.inOut', onUpdate: () => setProgressLocal(pl.v) }, t4 + 0.1)
    sfxOn(t4 + 0.1, SFX_MAP.WHOOSH)
    t4 += 1.6
    tl.add(() => { setRouteActive('gateway'); setProgressLocal(0) }, t4)
    say(t4, ACT4_BEATS.gateway.caption, COLORS.ROUTE)
    const pg = { v: 0 }
    tl.to(pg, { v: 1, duration: 0.9, ease: 'power1.inOut', onUpdate: () => setProgressGateway(pg.v) }, t4 + 0.1)
    sfxOn(t4 + 0.1, SFX_MAP.WHOOSH)
    t4 += 1.6
    say(t4 + 0.1, ACT4_BEATS.closing.caption, COLORS.ROUTE)
    sfxOn(t4 + 0.1, SFX_MAP.CHIME)
    t4 += 1.4
    tl.add(() => { setRouteVisible(false); setRouteActive(null); setProgressGateway(0) }, t4)

    // ═══════════════ ACT 5 — Nama ke tujuan (9s) ═══════════════
    const a5 = actStart[4]
    tl.add(() => setPhaseIdx(4), a5)
    say(a5, ACT5_BEATS.intro.caption, COLORS.TEXT)
    tl.add(() => setChainVisible(true), a5 + 0.3)
    sfxOn(a5 + 0.3, SFX_MAP.POP)
    let t5 = a5 + 1.1
    NAME_HOPS.forEach((hop, i) => {
      tl.add(() => setChainHighlight(hop.id), t5)
      sfxOn(t5, SFX_MAP.TICK)
      if (i === 1) say(t5 + 0.05, ACT5_BEATS.resolve.caption, COLORS.DNS)
      t5 += 1.1
    })
    sfxOn(t5, SFX_MAP.CONFIRM)
    say(t5 + 0.1, ACT5_BEATS.closing.caption, COLORS.DNS)
    t5 += 1.5
    tl.add(() => {
      setChainVisible(false); setChainHighlight(null)
      setAnchorVisible(false); setAnchorGlow(0)
    }, t5)

    // ═══════════════ ACT 6 — Interface virtual (9s) ═══════════════
    const a6 = actStart[5]
    tl.add(() => setPhaseIdx(5), a6)
    say(a6, ACT6_BEATS.intro.caption, COLORS.VIRTUAL)
    tl.add(() => setVirtualVisible(true), a6 + 0.3)
    sfxOn(a6 + 0.3, SFX_MAP.POP2)
    let t6 = a6 + 0.9
    VIRTUAL_INTERFACES.forEach((v) => {
      tl.add(() => setVirtualHighlight(v.id), t6)
      sfxOn(t6, SFX_MAP.TICK)
      t6 += 0.85
    })
    say(t6, ACT6_BEATS.reveal.caption, COLORS.VIRTUAL)
    t6 += 1.0
    tl.add(() => setVirtualHighlight(null), t6)
    say(t6 + 0.1, ACT6_BEATS.closing.caption, COLORS.VIRTUAL)
    sfxOn(t6 + 0.1, SFX_MAP.SHIMMER)
    tl.add(() => setTakeawayVisible(true), t6 + 0.3)
    t6 += 2.0
    sfxOn(t6, SFX_MAP.COMPLETE)
    t6 += 1.8

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

  // ── posisi local (ContentBodyV1, origin 0,0 = body.x/body.y) ──
  const TYPE_ROW_Y = 420
  const typeXs = { wired: 156, wifi: 366, loopback: 576 }

  const LAYER_XS = { link: 580, mac: 650, ip: 720 }

  const BRANCH_Y = 330
  const branchXs = { dhcp: 206, static: 526 }
  const RESULT_Y = 620
  const resultXs = { address: 210, gateway: 366, dns: 522 }

  const ROUTE_Y = 640
  const routeXs = { local: 196, gateway: 536 }

  const CHAIN_Y = 650
  const chainXs = { name: 120, dns: 284, route: 448, interface: 612 }

  const VIRTUAL_Y = 470
  const virtualXs = { loopback: 78, bridge: 222, vlan: 366, vpn: 510, container: 654 }

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`}
      style={{ width: '100%', height: '100%', maxHeight: '100vh',
        maxWidth: `calc(100vh * ${VW} / ${VH})`, background: COLORS.BG, userSelect: 'none' }}>
      <defs>
        <filter id="ni-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="b2" />
          <feMerge><feMergeNode in="b2" /><feMergeNode in="b1" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <rect x={0} y={0} width={VW} height={VH} fill={COLORS.BG} />
      <g opacity={0.05}>
        {Array.from({ length: 21 }).map((_, i) => <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={VH} stroke={COLORS.WIRED} strokeWidth={1} />)}
        {Array.from({ length: 34 }).map((_, i) => <line key={`h${i}`} x1={0} y1={i * 40} x2={VW} y2={i * 40} stroke={COLORS.WIRED} strokeWidth={1} />)}
      </g>

      <IntroHeaderMorphV1
        progress={morphP}
        category={INTRO_CATEGORY_LABEL}
        titleSegments={[
          { label: INTRO_TITLE_A, color: COLORS.WIRED },
          { label: INTRO_TITLE_B, color: COLORS.IP },
        ]}
        subtitle={INTRO_SUBTITLE}
        titleFilter="url(#ni-glow)"
        testId="network-interface-intro"
      />

      {contentStarted && (
        <ActBadgeNavigatorV1 phases={PHASES} activeIndex={phaseIdx} testId="network-interface-navigator" />
      )}

      {contentStarted && (
        <ContentBodyV1 debugName="network-interface-body">
          <g opacity={bodyOpacity}>
            <CaptionBar text={caption} color={captionColor} />

            {/* ── Act 1 — 3 jenis interface ── */}
            {typesVisible && INTERFACE_TYPES.map((it) => (
              <ConceptCard key={it.id} x={typeXs[it.id]} y={TYPE_ROW_Y} w={190} h={72}
                label={it.label} desc={it.desc} color={it.color}
                active={typeHighlight === it.id || typeHighlight === null}
                dim={typeHighlight !== null && typeHighlight !== it.id} />
            ))}

            {/* ── Anchor persisten "eth0" — Act 1 settle → Act 5 ── */}
            <AnchorIcon visible={anchorVisible} glow={anchorGlow} label="eth0" />

            {/* ── Act 2 — layer link/MAC/IP menumpuk di bawah anchor ── */}
            {layerStep > 0 && (
              <ConnLine x1={ANCHOR_POS.x} y1={ANCHOR_POS.y + 36} x2={ANCHOR_POS.x} y2={LAYER_XS.link - 30} color={COLORS.LINK} />
            )}
            {IDENTITY_LAYERS.map((layer, i) => (
              layerStep > i && (
                <ConceptCard key={layer.id} x={ANCHOR_POS.x} y={LAYER_XS[layer.id]} w={260} h={54}
                  label={layer.label} desc={layer.desc} color={layer.color} active />
              )
            ))}

            {/* ── Act 3 — DHCP/static branch → address/gateway/DNS ── */}
            {branchVisible && CONFIG_PATHS.map((p) => (
              <g key={p.id}>
                <ConnLine x1={branchXs[p.id]} y1={BRANCH_Y + 32} x2={ANCHOR_POS.x} y2={ANCHOR_POS.y - 36} color={p.color} />
                <ConceptCard x={branchXs[p.id]} y={BRANCH_Y} w={180} h={64}
                  label={p.label} desc={p.desc} color={p.color}
                  active={branchChosen === p.id || branchChosen === null}
                  dim={branchChosen !== null && branchChosen !== p.id} />
              </g>
            ))}
            {CONFIG_RESULTS.map((r, i) => (
              resultsStep > i && (
                <ConceptCard key={r.id} x={resultXs[r.id]} y={RESULT_Y} w={150} h={58}
                  label={r.label} desc={r.desc} color={r.color} active />
              )
            ))}

            {/* ── Act 4 — route ke subnet lokal atau default gateway ── */}
            {routeVisible && ROUTE_TARGETS.map((r) => (
              <g key={r.id}>
                <ConnLine x1={ANCHOR_POS.x} y1={ANCHOR_POS.y + 36} x2={routeXs[r.id]} y2={ROUTE_Y - 30} color={r.color} />
                <ConceptCard x={routeXs[r.id]} y={ROUTE_Y} w={190} h={68}
                  label={r.label} desc={r.desc} color={r.color}
                  active={routeActive === r.id || routeActive === null}
                  dim={routeActive !== null && routeActive !== r.id} />
              </g>
            ))}
            <ProgressDot x1={ANCHOR_POS.x} y1={ANCHOR_POS.y + 36} x2={routeXs.local} y2={ROUTE_Y - 30}
              progress={progressLocal} color={COLORS.IP} />
            <ProgressDot x1={ANCHOR_POS.x} y1={ANCHOR_POS.y + 36} x2={routeXs.gateway} y2={ROUTE_Y - 30}
              progress={progressGateway} color={COLORS.ROUTE} />

            {/* ── Act 5 — chain nama → DNS → route → interface ── */}
            {chainVisible && NAME_HOPS.map((hop, i) => (
              <g key={hop.id}>
                {i > 0 && (
                  <ConnLine x1={chainXs[NAME_HOPS[i - 1].id] + 70} y1={CHAIN_Y}
                    x2={chainXs[hop.id] - 70} y2={CHAIN_Y} color={COLORS.MUTED} opacity={0.5} />
                )}
                <ConceptCard x={chainXs[hop.id]} y={CHAIN_Y} w={150} h={64}
                  label={hop.label} desc={hop.desc} color={hop.color}
                  active={chainHighlight === hop.id || chainHighlight === null}
                  dim={chainHighlight !== null && chainHighlight !== hop.id} />
              </g>
            ))}

            {/* ── Act 6 — interface virtual (tanpa anchor) ── */}
            {virtualVisible && VIRTUAL_INTERFACES.map((v) => (
              <ConceptCard key={v.id} x={virtualXs[v.id]} y={VIRTUAL_Y} w={130} h={78}
                label={v.label} desc={v.desc} color={v.color}
                active={virtualHighlight === v.id || virtualHighlight === null}
                dim={virtualHighlight !== null && virtualHighlight !== v.id} />
            ))}

            <TakeawayBar visible={takeawayVisible} text={CLOSING_LINE} />
          </g>
        </ContentBodyV1>
      )}
    </svg>
  )
}
