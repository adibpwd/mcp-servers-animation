// src/content/81-network-interface/Animation.jsx
// ═══════════════════════════════════════════════════════════════════════════
// EKSEKUSI-01 (lihat _docs/NETWORK_INTERFACE_PLAN.md): 6 Act sesuai
// storyboard — titik koneksi, link dan identity, mendapat konfigurasi,
// memilih jalan, nama ke tujuan, interface virtual.
//
// REVISI-01 (lihat revisi/2026-09-21-revisi-01-selaras-standar-act-scene.md):
// dimigrasikan ke pola "1 act = 1 file" (docs/standardizations/
// 07-act-scene-pattern.md) — semua render presentational per-Act pindah ke
// `acts/Act1..Act6*.jsx` (PURE, tanpa GSAP/state/SFX). Animation.jsx sekarang
// murni komposisi: timeline GSAP + state + `<Act state={...} />` per phase.
// Intro juga dapat `categorySegments` (domain terkontrol warna WIRED, bukan
// cyan default UPDATE 5) + `bg`/`bgScenes` (UPDATE 6, background Act 2 —
// anchor + layer link/MAC/IP, paling representatif untuk thumbnail).
//
// Anchor persisten (Continuity map, §1.O): ANCHOR_POS (data.js) — 1 card
// "eth0" yang settle di akhir Act 1, TIDAK dihapus sampai penutup Act 5.
// Act 6 SENGAJA tidak memakai anchor ini — Act 6 membahas interface LAIN
// yang bukan kartu fisik. Lihat acts/common.jsx untuk AnchorIcon.
//
// Batas aman (plan): tidak ada IP/MAC nyata, tidak ada command, tidak ada
// perubahan network — semua label konsep, tanpa angka/alamat spesifik.
//
// CATATAN EKSEKUSI: kode + data ditulis sekali jalan, BELUM preview manual
// di browser maupun export MP4. Durasi Act di PHASES (data.js) adalah
// estimasi awal, WAJIB diukur ulang dari timeline nyata setelah preview
// manual.
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, SFX_MAP,
  INTRO_CATEGORY_LABEL, INTRO_DOMAIN, INTRO_TITLE_A, INTRO_TITLE_B, INTRO_SUBTITLE,
  INTERFACE_TYPES, ACT1_BEATS,
  IDENTITY_LAYERS, ACT2_BEATS,
  CONFIG_RESULTS, ACT3_BEATS,
  ACT4_BEATS,
  NAME_HOPS, ACT5_BEATS,
  VIRTUAL_INTERFACES, ACT6_BEATS,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'
import { IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1 } from '../../shared/scene-ui/v1'
import { ACT_SCENES } from './acts'

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
    // Layer TIDAK di-cleanup di sini — dibiarkan hold sampai Act 3 mulai
    // (Act3 tidak baca layerStep, jadi aman; sebelumnya di-reset 3.2s
    // sebelum Act 2 berakhir → caption "closing" tampil tanpa diagram,
    // ditemukan lewat preview screenshot, lihat revisi-02).

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
    // Results TIDAK di-cleanup — dibiarkan hold sampai Act 4 mulai (Act4
    // tidak baca resultsStep). Lihat catatan Act 2 di atas / revisi-02.

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
    // Route TIDAK di-cleanup — dibiarkan hold sampai Act 5 mulai (Act5
    // tidak baca routeVisible/routeActive). Lihat catatan Act 2 / revisi-02.

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
    // Chain TIDAK di-cleanup (Act6 tidak baca chainVisible/chainHighlight).
    // Anchor "eth0" tetap hold sampai sesaat sebelum Act 6 mulai (bukan
    // 2s lebih awal seperti sebelumnya) — transisi visual ke Act 6 (yang
    // sengaja tanpa anchor) tetap terjadi, tapi tanpa jeda kosong duluan.
    // Lihat catatan Act 2 di atas / revisi-02.
    tl.add(() => { setAnchorVisible(false); setAnchorGlow(0) }, actStart[5] - 0.1)

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

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`}
      style={{ width: '100%', height: '100%', maxHeight: '100vh',
        maxWidth: `calc(100vh * ${VW} / ${VH})`, background: COLORS.BG, userSelect: 'none' }}>
      <rect x={0} y={0} width={VW} height={VH} fill={COLORS.BG} />
      <g opacity={0.05}>
        {Array.from({ length: 21 }).map((_, i) => <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={VH} stroke={COLORS.WIRED} strokeWidth={1} />)}
        {Array.from({ length: 34 }).map((_, i) => <line key={`h${i}`} x1={0} y1={i * 40} x2={VW} y2={i * 40} stroke={COLORS.WIRED} strokeWidth={1} />)}
      </g>

      <IntroHeaderMorphV1
        progress={morphP}
        categorySegments={[
          { label: INTRO_CATEGORY_LABEL + ' · ', color: COLORS.MUTED },
          { label: INTRO_DOMAIN, color: COLORS.WIRED },
        ]}
        titleSegments={[
          { label: INTRO_TITLE_A, color: COLORS.WIRED },
          { label: INTRO_TITLE_B, color: COLORS.IP },
        ]}
        subtitle={INTRO_SUBTITLE}
        bg={2}
        bgScenes={ACT_SCENES}
        testId="network-interface-intro"
      />

      {contentStarted && (
        <ActBadgeNavigatorV1 phases={PHASES} activeIndex={phaseIdx} testId="network-interface-navigator" />
      )}

      {contentStarted && (
        <ContentBodyV1 debugName="network-interface-body">
          <g opacity={bodyOpacity}>
            {(() => {
              const Act = ACT_SCENES[phaseIdx]
              return (
                <Act state={{
                  caption, captionColor,
                  typesVisible, typeHighlight, anchorVisible, anchorGlow,
                  layerStep,
                  branchVisible, branchChosen, resultsStep,
                  routeVisible, routeActive, progressLocal, progressGateway,
                  chainVisible, chainHighlight,
                  virtualVisible, virtualHighlight, takeawayVisible,
                }} />
              )
            })()}
          </g>
        </ContentBodyV1>
      )}
    </svg>
  )
}
