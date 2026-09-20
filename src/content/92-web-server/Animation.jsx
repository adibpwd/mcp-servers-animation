// src/content/92-web-server/Animation.jsx
// ═══════════════════════════════════════════════════════════════════════════
// EKSEKUSI-02 (revisi 01, lihat revisi/2026-09-18-1213-revisi-01.md):
// listener eksplisit "Nginx / Apache" dengan ring HTTP/HTTPS; static file
// bertile nyata (about.html/style.css/logo.png) yang SUDAH ADA sebelum
// request; app upstream bertile "Node.js" yang idle sampai packet tiba dan
// membuat JSON (bukan mengambil file). Storyboard 4 Act baru:
//   1. Siapa yang menerima?   (request-ke-listener)
//   2. Halaman statis         (serve-static-file) — round-trip lengkap
//      dalam satu Act: read pulse → tile jadi response → browser render.
//   3. Data dinamis           (forward-ke-upstream) — forward → app
//      membentuk JSON, SENGAJA belum dikirim ke browser (ditahan ke Act 4).
//   4. Response kembali lewat web server (return-via-web-server) — JSON
//      capsule kembali via listener → browser, lalu perbandingan singkat
//      dua jalur menegaskan aturan universal: response selalu lewat
//      web server, tidak pernah langsung dari app.
// Batas Aman: tidak ada config block, command instalasi, port scan,
// domain/IP nyata, atau klaim static selalu lebih cepat.
//
// Anchor persisten (Continuity §1.O): LISTENER_POS — card listener settle
// di akhir Act 1, tidak dihapus sampai penutup Act 4.
// ═══════════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, SFX_MAP,
  LISTENER_POS, BROWSER_POS, STATIC_POS, APP_POS, LISTENER_EXAMPLES,
  INTRO_CATEGORY_LABEL, INTRO_TITLE_A, INTRO_TITLE_B, INTRO_SUBTITLE,
  ACT1_BEATS,
  STATIC_FILES, STATIC_PATH, ACT2_BEATS,
  APP_RUNTIME_LABEL, APP_RUNTIME_ALT, DYNAMIC_PATH, ACT3_BEATS,
  ACT4_BEATS, CLOSING_LINE,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'
import { IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1 } from '../../shared/scene-ui/v1'

// ── CaptionBar ──
const CaptionBar = ({ text, color }) => {
  if (!text) return null
  return (
    <g transform="translate(366 60)">
      <rect x="-300" y="-24" width="600" height="48" rx="22" fill={COLORS.PANEL} stroke={color || COLORS.BORDER} strokeWidth="1.5" opacity="0.96" />
      <text x="0" y="6" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="13.5" fill={COLORS.TEXT}>{text}</text>
    </g>
  )
}

// ── PathChip — path aktif (/about atau /api/profile) di dekat listener. ──
const PathChip = ({ visible, label, color }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${LISTENER_POS.x} ${LISTENER_POS.y - 74})`}>
      <rect x="-72" y="-16" width="144" height="32" rx="16" fill={COLORS.PANEL} stroke={color} strokeWidth="1.6" />
      <text x="0" y="5" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="12" fill={color}>{label}</text>
    </g>
  )
}

const ConnLine = ({ x1, y1, x2, y2, color, dashed = true, opacity = 0.7, width = 2 }) => (
  <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth={width}
    strokeDasharray={dashed ? '6 5' : undefined} opacity={opacity} />
)
const ProgressDot = ({ x1, y1, x2, y2, progress, color, r = 7 }) => {
  if (progress <= 0) return null
  const x = x1 + (x2 - x1) * progress
  const y = y1 + (y2 - y1) * progress
  return <circle cx={x} cy={y} r={r} fill={color} />
}

// ── BrowserIcon — URL bar menampilkan path aktif; hasil render berbeda
// bentuk untuk static (garis HTML) vs dynamic (brace JSON) — bukti visual
// bahwa keduanya beda jenis response (revisi §Definisi visual). ──
const BrowserIcon = ({ path, resultType }) => (
  <g transform={`translate(${BROWSER_POS.x} ${BROWSER_POS.y})`}>
    <rect x="-130" y="-46" width="260" height="92" rx="14" fill={COLORS.PANEL} stroke={COLORS.BROWSER} strokeWidth="2.2" />
    <rect x="-118" y="-32" width="236" height="20" rx="6" fill={COLORS.BG} stroke={COLORS.BORDER} strokeWidth="1" />
    <circle cx="-104" cy="-22" r="3" fill={COLORS.RISK} opacity="0.7" />
    <circle cx="-94" cy="-22" r="3" fill={COLORS.WARNING} opacity="0.7" />
    <circle cx="-84" cy="-22" r="3" fill={COLORS.SUCCESS} opacity="0.7" />
    <text x="6" y="-18" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={COLORS.MUTED}>{path || 'https://…'}</text>
    {resultType === 'static' && (
      <g>
        <rect x="-110" y="0" width="220" height="10" rx="3" fill={COLORS.STATIC} opacity="0.6" />
        <rect x="-110" y="16" width="160" height="10" rx="3" fill={COLORS.STATIC} opacity="0.4" />
      </g>
    )}
    {resultType === 'dynamic' && (
      <text x="0" y="14" textAnchor="middle" fontFamily="monospace" fontSize="11" fill={COLORS.APP}>{'{ "profile": … }'}</text>
    )}
    {!resultType && (
      <text x="0" y="14" textAnchor="middle" fontFamily="monospace" fontSize="10" fill={COLORS.MUTED}>menunggu…</text>
    )}
  </g>
)

// ── ListenerIcon — anchor persisten "Nginx / Apache" dengan ring
// HTTP/HTTPS (revisi §Definisi visual: bukan label saja). ──
const ListenerIcon = ({ visible, glow }) => {
  if (!visible) return null
  return (
    <g transform={`translate(${LISTENER_POS.x} ${LISTENER_POS.y})`}>
      {glow > 0 && (
        <circle r="52" fill="none" stroke={COLORS.LISTENER} strokeWidth="1.4" opacity={glow * 0.5}>
          <animate attributeName="r" values="44;60;44" dur="1.6s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.4;0;0.4" dur="1.6s" repeatCount="indefinite" />
        </circle>
      )}
      <rect x="-64" y="-40" width="128" height="80" rx="12" fill={COLORS.PANEL} stroke={COLORS.LISTENER} strokeWidth="2.2" />
      <circle cx="0" cy="-12" r="15" fill="none" stroke={COLORS.LISTENER} strokeWidth="2" />
      <circle cx="0" cy="-12" r="5" fill={COLORS.LISTENER} />
      <text x="0" y="16" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="11.5" fill={COLORS.LISTENER}>HTTP/HTTPS</text>
      <text x="0" y="32" textAnchor="middle" fontFamily="monospace" fontSize="9.5" fill={COLORS.MUTED}>{LISTENER_EXAMPLES}</text>
    </g>
  )
}

// ── StaticFileShelf — tile file NYATA, sudah ada sejak awal (opacity
// penuh walau server belum dipakai), satu tile disorot saat dibaca. ──
const StaticFileShelf = ({ dim, activeId }) => (
  <g transform={`translate(${STATIC_POS.x} ${STATIC_POS.y})`} opacity={dim ? 0.45 : 1}>
    <rect x="-78" y="-52" width="156" height="104" rx="10" fill={COLORS.PANEL} stroke={COLORS.STATIC} strokeWidth={activeId ? 2.2 : 1.3} />
    {STATIC_FILES.map((f) => (
      <g key={f.id}>
        <rect x="-58" y={f.y - 9} width="116" height="18" rx="3"
          fill={activeId === f.id ? COLORS.STATIC : COLORS.PANEL}
          stroke={COLORS.STATIC} strokeWidth="1.2" opacity={activeId === f.id ? 1 : 0.7} />
        <text x="0" y={f.y + 4} textAnchor="middle" fontFamily="monospace" fontSize="9"
          fill={activeId === f.id ? COLORS.BG : COLORS.STATIC}>{f.label}</text>
      </g>
    ))}
    <text x="0" y="70" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="11" fill={COLORS.STATIC}>disk / file shelf</text>
  </g>
)

// ── AppUpstream — process TERPISAH, idle sampai packet tiba (revisi:
// tidak boleh menampilkan output sebelum packet benar-benar tiba). ──
const AppUpstream = ({ dim, active, building, jsonReady }) => (
  <g transform={`translate(${APP_POS.x} ${APP_POS.y})`} opacity={dim ? 0.45 : 1}>
    <rect x="-78" y="-52" width="156" height="104" rx="10" fill={COLORS.PANEL} stroke={COLORS.APP} strokeWidth={active ? 2.2 : 1.3} />
    <circle cx="0" cy="-16" r="16" fill="none" stroke={COLORS.APP} strokeWidth="2">
      {building && <animate attributeName="r" values="14;20;14" dur="0.7s" repeatCount="indefinite" />}
    </circle>
    <circle cx="0" cy="-16" r="5" fill={COLORS.APP} />
    <text x="0" y="18" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="10.5" fill={COLORS.APP}>App · {APP_RUNTIME_LABEL}</text>
    <text x="0" y="30" textAnchor="middle" fontFamily="monospace" fontSize="7.5" fill={COLORS.MUTED}>{APP_RUNTIME_ALT}</text>
    {jsonReady && (
      <text x="0" y="46" textAnchor="middle" fontFamily="monospace" fontSize="9" fill={COLORS.APP}>{'{ json }'}</text>
    )}
    <text x="0" y="70" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="11" fill={COLORS.APP}>app upstream</text>
  </g>
)

// ── ResponseCapsule — generic capsule dipakai lintas Act; label beda
// untuk static (HTML) vs dynamic (JSON). ──
const ResponseCapsule = ({ visible, fromX, fromY, toX, toY, progress = 0, kind = 'static' }) => {
  if (!visible) return null
  const x = fromX + (toX - fromX) * progress
  const y = fromY + (toY - fromY) * progress
  return (
    <g transform={`translate(${x} ${y})`}>
      <rect x="-32" y="-16" width="64" height="32" rx="10" fill={kind === 'static' ? COLORS.STATIC : COLORS.APP} opacity="0.92" />
      <text x="0" y="5" textAnchor="middle" fontFamily="monospace" fontWeight="700" fontSize="9.5" fill={COLORS.BG}>{kind === 'static' ? '200 HTML' : '200 JSON'}</text>
    </g>
  )
}

const LogLine = ({ visible, text }) => {
  if (!visible) return null
  return (
    <g transform="translate(366 950)">
      <rect x="-280" y="-18" width="560" height="36" rx="8" fill={COLORS.PANEL} stroke={COLORS.LOG} strokeWidth="1.4" />
      <text x="0" y="5" textAnchor="middle" fontFamily="monospace" fontSize="10.5" fill={COLORS.LOG}>{text}</text>
    </g>
  )
}

const TakeawayBar = ({ visible, text }) => {
  if (!visible) return null
  return (
    <g transform="translate(366 1010)">
      <rect x="-280" y="-30" width="560" height="60" rx="26" fill={COLORS.SUCCESS} opacity="0.14" />
      <rect x="-280" y="-30" width="560" height="60" rx="26" fill="none" stroke={COLORS.SUCCESS} strokeWidth="2" />
      <text x="0" y="7" textAnchor="middle" fontSize="15" fontWeight="700" fill={COLORS.SUCCESS}>{text}</text>
    </g>
  )
}

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

  // Browser + listener persisten
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

    // ── Reset state tiap awal loop (wajib, timeline repeat: -1) ──
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

    // ── Intro — hero centered → header ──
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
    // read pulse: listener → tile about.html
    const srp = { v: 0 }
    tl.to(srp, { v: 1, duration: 0.8, ease: 'power1.inOut', onUpdate: () => setStaticReadProgress(srp.v) }, t2)
    tl.add(() => setStaticFileActiveId('about'), t2)
    sfxOn(t2, SFX_MAP.TICK)
    say(t2, ACT2_BEATS.reading.caption, COLORS.STATIC)
    t2 += 1.0
    // tile menjadi response capsule → kembali ke listener → browser
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
    // leg 1: app → listener
    tl.add(() => { setDynRespVisible(true); setDynRespStage('app'); setDynRespProgress(0) }, t4)
    sfxOn(t4, SFX_MAP.WHOOSH)
    say(t4, ACT4_BEATS.leaving.caption, COLORS.RESPONSE)
    const d1 = { v: 0 }
    tl.to(d1, { v: 1, duration: 0.9, ease: 'power1.inOut', onUpdate: () => setDynRespProgress(d1.v) }, t4 + 0.1)
    t4 += 1.2
    // leg 2: listener → browser
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

  // ── posisi leg response Act 4, dari stage ──
  const dynFrom = dynRespStage === 'app' ? APP_POS : LISTENER_POS
  const dynTo = dynRespStage === 'app' ? LISTENER_POS : BROWSER_POS

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
        testId="web-server-intro"
      />

      {contentStarted && (
        <ActBadgeNavigatorV1 phases={PHASES} activeIndex={phaseIdx} testId="web-server-navigator" />
      )}

      {contentStarted && (
        <ContentBodyV1 debugName="web-server-body">
          <g opacity={bodyOpacity}>
            <CaptionBar text={caption} color={captionColor} />

            <BrowserIcon path={browserPath} resultType={browserResult} />
            <ListenerIcon visible={listenerVisible} glow={listenerGlow} />
            <PathChip visible={pathChipVisible} label={browserPath} color={browserPath === STATIC_PATH ? COLORS.STATIC : COLORS.APP} />

            {/* ── Act 1 — request packet: browser → listener ── */}
            {requestProgress > 0 && (
              <ConnLine x1={BROWSER_POS.x} y1={BROWSER_POS.y + 46} x2={LISTENER_POS.x} y2={LISTENER_POS.y - 40} color={COLORS.BROWSER} opacity={0.4} />
            )}
            <ProgressDot x1={BROWSER_POS.x} y1={BROWSER_POS.y + 46} x2={LISTENER_POS.x} y2={LISTENER_POS.y - 40}
              progress={requestProgress} color={COLORS.BROWSER} />

            {/* ── Act 2 — static: listener ↔ file shelf ── */}
            <StaticFileShelf dim={appActive} activeId={staticFileActiveId} />
            <ProgressDot x1={LISTENER_POS.x} y1={LISTENER_POS.y + 40} x2={STATIC_POS.x} y2={STATIC_POS.y - 52}
              progress={staticReadProgress} color={COLORS.STATIC} />
            <ResponseCapsule visible={staticRespVisible}
              fromX={STATIC_POS.x} fromY={STATIC_POS.y} toX={BROWSER_POS.x} toY={BROWSER_POS.y}
              progress={staticRespProgress} kind="static" />

            {/* ── Act 3 — dynamic: listener → app ── */}
            <AppUpstream dim={staticFileActiveId !== null} active={appActive} building={appBuilding} jsonReady={jsonReady} />
            <ProgressDot x1={LISTENER_POS.x} y1={LISTENER_POS.y + 40} x2={APP_POS.x} y2={APP_POS.y - 52}
              progress={forwardProgress} color={COLORS.APP} />

            {/* ── Act 4 — JSON app → listener → browser ── */}
            <ResponseCapsule visible={dynRespVisible}
              fromX={dynFrom.x} fromY={dynFrom.y} toX={dynTo.x} toY={dynTo.y}
              progress={dynRespProgress} kind="dynamic" />

            <LogLine visible={logVisible} text={logText} />
            <TakeawayBar visible={takeawayVisible} text={CLOSING_LINE} />
          </g>
        </ContentBodyV1>
      )}
    </svg>
  )
}
