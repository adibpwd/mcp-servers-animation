// src/content/92-web-server/Animation.jsx
// ═══════════════════════════════════════════════════════════════════════════
// EKSEKUSI-03 (revisi 02, lihat revisi/2026-09-21-revisi-02-selaras-standar-act-scene.md):
// migrasi ke pola "1 act = 1 file" (acts/, lihat docs/standardizations/
// 07-act-scene-pattern.md) + intro bg/bgScenes (UPDATE 6). Animation.jsx
// sekarang MURNI komposisi: timeline GSAP + state + <Act state={...} />
// per phase. Seluruh SVG presentational (Chrome, ResponseCapsule, dst)
// pindah ke acts/common.jsx dan acts/Act1..4*.jsx TANPA mengubah koordinat.
//
// EKSEKUSI-02 (revisi 01): listener eksplisit "Nginx / Apache" dengan ring
// HTTP/HTTPS; static file bertile nyata (about.html/style.css/logo.png)
// yang SUDAH ADA sebelum request; app upstream bertile "Node.js" yang idle
// sampai packet tiba dan membuat JSON (bukan mengambil file). Storyboard:
//   1. Siapa yang menerima?   (request-ke-listener)
//   2. Halaman statis         (serve-static-file) — round-trip lengkap.
//   3. Data dinamis           (forward-ke-upstream) — JSON ditahan ke Act 4.
//   4. Response kembali lewat web server (return-via-web-server).
// Batas Aman: tidak ada config block, command instalasi, port scan,
// domain/IP nyata, atau klaim static selalu lebih cepat.
//
// Anchor persisten (Continuity §1.O): LISTENER_POS — card listener settle
// di akhir Act 1, tidak dihapus sampai penutup Act 4 (kini via Chrome di
// acts/common.jsx, dipanggil tiap file act).
//
// CATATAN EKSEKUSI: kode + data ditulis sekali jalan, BELUM preview manual
// di browser maupun export MP4 — status ini normal untuk first pass.
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, SFX_MAP,
  INTRO_CATEGORY_LABEL, INTRO_TITLE_A, INTRO_TITLE_B, INTRO_SUBTITLE,
  ACT1_BEATS, STATIC_PATH, ACT2_BEATS, DYNAMIC_PATH, ACT3_BEATS, ACT4_BEATS,
} from './data'
import { ACT_SCENES } from './acts'
import { CaptionBar } from './acts/common'
import sfxLoader from '../../shared/audio/sfxLoader'
import { IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1 } from '../../shared/scene-ui/v1'

export default function WebServerAnimation({
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
  const [captionColor, setCaptionColor] = useState(COLORS.LISTENER)

  const [morphP, setMorphP] = useState(0)
  const [contentStarted, setContentStarted] = useState(false)
  const [bodyOpacity, setBodyOpacity] = useState(0)

  // Chrome persisten (dikonsumsi acts/common.jsx via <Chrome state={...}/>)
  const [browserPath, setBrowserPath] = useState('')
  const [browserResult, setBrowserResult] = useState(null) // 'static' | 'dynamic' | null
  const [listenerVisible, setListenerVisible] = useState(false)
  const [listenerGlow, setListenerGlow] = useState(0)
  const [pathChipVisible, setPathChipVisible] = useState(false)

  // Act 1 — request packet: browser → listener
  const [requestProgress, setRequestProgress] = useState(0)

  // Act 2 — static: read pulse listener → tile, tile → browser
  const [staticFileActiveId, setStaticFileActiveId] = useState(null)
  const [staticReadProgress, setStaticReadProgress] = useState(0)
  const [staticRespVisible, setStaticRespVisible] = useState(false)
  const [staticRespProgress, setStaticRespProgress] = useState(0)

  // Act 3 — dynamic: forward listener → app, app building JSON (ditahan)
  const [appActive, setAppActive] = useState(false)
  const [forwardProgress, setForwardProgress] = useState(0)
  const [appBuilding, setAppBuilding] = useState(false)
  const [jsonReady, setJsonReady] = useState(false)

  // Act 4 — JSON app → listener → browser, log, takeaway
  const [dynRespVisible, setDynRespVisible] = useState(false)
  const [dynRespStage, setDynRespStage] = useState('app') // 'app' | 'listener'
  const [dynRespProgress, setDynRespProgress] = useState(0)
  const [logVisible, setLogVisible] = useState(false)
  const [logText, setLogText] = useState('')
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

    tl.add(() => {
      setPhaseIdx(0); setCaption(''); setCaptionColor(COLORS.LISTENER)
      setMorphP(0); setContentStarted(false); setBodyOpacity(0)
      setBrowserPath(''); setBrowserResult(null)
      setListenerVisible(false); setListenerGlow(0); setPathChipVisible(false)
      setRequestProgress(0)
      setStaticFileActiveId(null); setStaticReadProgress(0)
      setStaticRespVisible(false); setStaticRespProgress(0)
      setAppActive(false); setForwardProgress(0); setAppBuilding(false); setJsonReady(false)
      setDynRespVisible(false); setDynRespStage('app'); setDynRespProgress(0)
      setLogVisible(false); setLogText(''); setTakeawayVisible(false)
    }, 0)

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

    // ═══════════════ ACT 1 — Siapa yang menerima? (9s) ═══════════════
    const a1 = actStart[0]
    tl.add(() => setPhaseIdx(0), a1)
    say(a1, ACT1_BEATS.hook.caption, COLORS.BROWSER)
    let t1 = a1 + 0.8
    const rp = { v: 0 }
    tl.to(rp, { v: 1, duration: 1.1, ease: 'power1.inOut', onUpdate: () => setRequestProgress(rp.v) }, t1)
    sfxOn(t1, SFX_MAP.WHOOSH)
    say(t1, ACT1_BEATS.travel.caption, COLORS.BROWSER)
    t1 += 1.3
    tl.add(() => { setListenerVisible(true); setListenerGlow(1); setRequestProgress(0) }, t1)
    sfxOn(t1, SFX_MAP.CONFIRM)
    say(t1, ACT1_BEATS.reveal.caption, COLORS.LISTENER)
    t1 += 1.6
    tl.add(() => setListenerGlow(0.3), t1)

    // ═══════════════ ACT 2 — Halaman statis (10s) ═══════════════
    const a2 = actStart[1]
    tl.add(() => setPhaseIdx(1), a2)
    tl.add(() => { setBrowserPath(STATIC_PATH); setPathChipVisible(true) }, a2)
    sfxOn(a2, SFX_MAP.POP)
    say(a2, ACT2_BEATS.intro.caption, COLORS.STATIC)
    let t2 = a2 + 1.1
    const srp = { v: 0 }
    tl.to(srp, { v: 1, duration: 0.8, ease: 'power1.inOut', onUpdate: () => setStaticReadProgress(srp.v) }, t2)
    tl.add(() => setStaticFileActiveId('about'), t2)
    sfxOn(t2, SFX_MAP.TICK)
    say(t2, ACT2_BEATS.reading.caption, COLORS.STATIC)
    t2 += 1.0
    tl.add(() => { setStaticRespVisible(true); setStaticRespProgress(0); setStaticReadProgress(0) }, t2)
    sfxOn(t2, SFX_MAP.CONFIRM)
    const srp2 = { v: 0 }
    tl.to(srp2, { v: 1, duration: 1.0, ease: 'power1.inOut', onUpdate: () => setStaticRespProgress(srp2.v) }, t2 + 0.1)
    t2 += 1.3
    tl.add(() => { setStaticRespVisible(false); setBrowserResult('static') }, t2)
    sfxOn(t2, SFX_MAP.DING)
    say(t2, 'Browser menerima halaman.', COLORS.STATIC)
    t2 += 1.2
    say(t2, ACT2_BEATS.closing.caption, COLORS.STATIC)
    sfxOn(t2, SFX_MAP.CHIME)
    t2 += 1.5
    tl.add(() => {
      setStaticFileActiveId(null); setPathChipVisible(false)
      setBrowserPath(''); setBrowserResult(null)
    }, t2)

    // ═══════════════ ACT 3 — Data dinamis (10s) ═══════════════
    const a3 = actStart[2]
    tl.add(() => setPhaseIdx(2), a3)
    tl.add(() => { setBrowserPath(DYNAMIC_PATH); setPathChipVisible(true) }, a3)
    sfxOn(a3, SFX_MAP.POP)
    say(a3, ACT3_BEATS.intro.caption, COLORS.APP)
    let t3 = a3 + 1.1
    tl.add(() => setAppActive(true), t3)
    const fp = { v: 0 }
    tl.to(fp, { v: 1, duration: 0.9, ease: 'power1.inOut', onUpdate: () => setForwardProgress(fp.v) }, t3)
    sfxOn(t3, SFX_MAP.WHOOSH)
    say(t3, ACT3_BEATS.forwarding.caption, COLORS.APP)
    t3 += 1.2
    tl.add(() => { setForwardProgress(0); setAppBuilding(true) }, t3)
    say(t3, ACT3_BEATS.building.caption, COLORS.APP)
    t3 += 1.3
    tl.add(() => { setAppBuilding(false); setJsonReady(true) }, t3)
    sfxOn(t3, SFX_MAP.CONFIRM)
    say(t3, ACT3_BEATS.closing.caption, COLORS.APP)
    t3 += 1.8
    // ── SENGAJA belum dikirim ke browser — ditahan ke Act 4 (revisi) ──

    // ═══════════════ ACT 4 — Response kembali lewat web server (10s) ═══════════════
    const a4 = actStart[3]
    tl.add(() => setPhaseIdx(3), a4)
    say(a4, ACT4_BEATS.intro.caption, COLORS.RESPONSE)
    let t4 = a4 + 0.6
    tl.add(() => { setDynRespVisible(true); setDynRespStage('app'); setDynRespProgress(0) }, t4)
    sfxOn(t4, SFX_MAP.WHOOSH)
    say(t4, ACT4_BEATS.leaving.caption, COLORS.RESPONSE)
    const d1 = { v: 0 }
    tl.to(d1, { v: 1, duration: 0.9, ease: 'power1.inOut', onUpdate: () => setDynRespProgress(d1.v) }, t4 + 0.1)
    t4 += 1.2
    tl.add(() => { setDynRespStage('listener'); setDynRespProgress(0); setListenerGlow(1) }, t4)
    sfxOn(t4, SFX_MAP.WHOOSH)
    const d2 = { v: 0 }
    tl.to(d2, { v: 1, duration: 0.9, ease: 'power1.inOut', onUpdate: () => setDynRespProgress(d2.v) }, t4 + 0.1)
    t4 += 1.2
    tl.add(() => {
      setDynRespVisible(false); setBrowserResult('dynamic'); setListenerGlow(0.3)
      setAppActive(false); setJsonReady(false)
    }, t4)
    sfxOn(t4, SFX_MAP.DING)
    say(t4, ACT4_BEATS.rendered.caption, COLORS.BROWSER)
    t4 += 1.3
    tl.add(() => { setLogVisible(true); setLogText(`GET ${STATIC_PATH} → 200 · GET ${DYNAMIC_PATH} → 200`) }, t4)
    sfxOn(t4, SFX_MAP.CONFIRM)
    t4 += 1.1
    say(t4, ACT4_BEATS.closing.caption, COLORS.RESPONSE)
    sfxOn(t4, SFX_MAP.SHIMMER)
    tl.add(() => setTakeawayVisible(true), t4 + 0.2)
    t4 += 2.0
    sfxOn(t4, SFX_MAP.COMPLETE)
    t4 += 1.4

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

  // ── state gabungan dikirim ke Act aktif (kontrak §2.2 07-act-scene-pattern) ──
  const actState = {
    browserPath, browserResult, listenerVisible, listenerGlow, pathChipVisible,
    requestProgress,
    staticFileActiveId, staticReadProgress, staticRespVisible, staticRespProgress,
    appActive, forwardProgress, appBuilding, jsonReady,
    dynRespVisible, dynRespStage, dynRespProgress,
    logVisible, logText, takeawayVisible,
  }

  return (
    <svg viewBox={`0 0 ${VW} ${VH}`}
      style={{ width: '100%', height: '100%', maxHeight: '100vh',
        maxWidth: `calc(100vh * ${VW} / ${VH})`, background: COLORS.BG, userSelect: 'none' }}>
      <defs>
        <filter id="ws-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="b1" />
          <feGaussianBlur in="SourceGraphic" stdDeviation="14" result="b2" />
          <feMerge><feMergeNode in="b2" /><feMergeNode in="b1" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>

      <rect x={0} y={0} width={VW} height={VH} fill={COLORS.BG} />
      <g opacity={0.05}>
        {Array.from({ length: 21 }).map((_, i) => <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={VH} stroke={COLORS.BROWSER} strokeWidth={1} />)}
        {Array.from({ length: 34 }).map((_, i) => <line key={`h${i}`} x1={0} y1={i * 40} x2={VW} y2={i * 40} stroke={COLORS.BROWSER} strokeWidth={1} />)}
      </g>

      <IntroHeaderMorphV1
        progress={morphP}
        category={INTRO_CATEGORY_LABEL}
        titleSegments={[
          { label: INTRO_TITLE_A, color: COLORS.BROWSER },
          { label: INTRO_TITLE_B, color: COLORS.LISTENER },
        ]}
        subtitle={INTRO_SUBTITLE}
        titleFilter="url(#ws-glow)"
        bg={4}
        bgScenes={ACT_SCENES}
        testId="web-server-intro"
      />

      {contentStarted && (
        <ActBadgeNavigatorV1 phases={PHASES} activeIndex={phaseIdx} testId="web-server-navigator" />
      )}

      {contentStarted && (
        <ContentBodyV1 debugName="web-server-body">
          <g opacity={bodyOpacity}>
            <CaptionBar text={caption} color={captionColor} />

            {/* ── scene ACT aktif (1 act = 1 file, lihat acts/) ── */}
            {(() => {
              const Act = ACT_SCENES[phaseIdx]
              return <Act state={actState} />
            })()}
          </g>
        </ContentBodyV1>
      )}
    </svg>
  )
}
