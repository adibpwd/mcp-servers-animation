// src/content/67-linux-logs/Animation.jsx
// ═══════════════════════════════════════════════════════════════════════
// Komposisi murni: timeline GSAP + state. Scene visual per-Act ada di
// acts/ (pola "1 act = 1 file", lihat
// docs/standardizations/07-act-scene-pattern.md; lihat juga
// _docs/LINUX_LOGS_STANDALONE_PLAN.md untuk konteks topic).
// ═══════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, SFX_MAP,
  INTRO_CATEGORY_LABEL, INTRO_DOMAIN, INTRO_TITLE_A, INTRO_TITLE_B, INTRO_SUBTITLE,
  STATIONS, LINES, PATH_ATLAS, TIMELINE_ENTRIES,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'
import { IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1 } from '../../shared/scene-ui/v1'
import { ACT_SCENES } from './acts'

const STATION_IDS = Object.keys(STATIONS)

export default function LinuxLogsAnimation({
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
  const [morphP, setMorphP] = useState(0)
  const [headerOpacity, setHeaderOpacity] = useState(0)
  const [contentStarted, setContentStarted] = useState(false)

  const [stationOpacity, setStationOpacity] = useState(() =>
    Object.fromEntries(STATION_IDS.map(id => [id, 0])))
  const [lineProgress, setLineProgress] = useState(() =>
    Object.fromEntries(LINES.map(l => [l.id, 0])))
  const [pulse, setPulse] = useState({})
  const [lineAlert, setLineAlert] = useState({})

  const [journaldFieldsShown, setJournaldFieldsShown] = useState(false)
  const [logPreviewShown, setLogPreviewShown] = useState(false)
  const [rotationJournaldOn, setRotationJournaldOn] = useState(false)
  const [rotationLogrotateOn, setRotationLogrotateOn] = useState(false)
  const [auditForwarded, setAuditForwarded] = useState(false)
  const [timelineCount, setTimelineCount] = useState(0)
  const [diagnosisStep, setDiagnosisStep] = useState(-1)

  const [caption, setCaption] = useState('')
  const [captionStation, setCaptionStation] = useState(null)
  const [pathText, setPathTextState] = useState('')
  const [pathOpacity, setPathOpacity] = useState(0)
  const [closingOpacity, setClosingOpacity] = useState(0)

  useEffect(() => {
    const shouldEnable = previewSfx && audioUnlocked
    sfxLoader.setEnabled(shouldEnable)
    audioUnlockedRef.current = audioUnlocked
    volumeRef.current = volume
    speedRef.current = speed
  }, [previewSfx, audioUnlocked, volume, speed])

  const lineOf = (id) => LINES.find(l => l.id === id)
  const stationOf = (id) => STATIONS[id]
  const pointAt = (lineId, t) => {
    const l = lineOf(lineId)
    const a = stationOf(l.from)
    const b = stationOf(l.to)
    return { x: a.cx + (b.cx - a.cx) * t, y: a.cy + (b.cy - a.cy) * t }
  }

  const sfxOn = (tl, time, fn) => tl.add(() => audioUnlockedRef.current && fn(), time)
  const playSfx = (entry, mult = 1) => sfxLoader.play(entry.category, entry.name, { volume: volumeRef.current * mult, speed: speedRef.current })

  const lightStation = (tl, time, id, opts = {}) => {
    const { to = 1, duration = 0.55, sfxEntry = null, sfxMult = 1 } = opts
    const o = { v: stationOpacity[id] || 0 }
    if (sfxEntry) sfxOn(tl, time, () => playSfx(sfxEntry, sfxMult))
    tl.to(o, {
      v: to, duration, ease: 'power2.out',
      onUpdate: () => setStationOpacity(prev => ({ ...prev, [id]: o.v })),
    }, time)
  }

  const dimStation = (tl, time, id, opts = {}) => {
    const { to = 0.4, duration = 0.6, sfxEntry = null, sfxMult = 0.5 } = opts
    if (sfxEntry) sfxOn(tl, time, () => playSfx(sfxEntry, sfxMult))
    const o = { v: 1 }
    tl.to(o, {
      v: to, duration, ease: 'power1.inOut',
      onUpdate: () => setStationOpacity(prev => ({ ...prev, [id]: o.v })),
    }, time)
  }

  const drawLine = (tl, time, id, opts = {}) => {
    const { duration = 0.6, sfxEntry = null, sfxMult = 1 } = opts
    if (sfxEntry) sfxOn(tl, time, () => playSfx(sfxEntry, sfxMult))
    const o = { v: 0 }
    tl.to(o, {
      v: 1, duration, ease: 'power1.inOut',
      onUpdate: () => setLineProgress(prev => ({ ...prev, [id]: o.v })),
    }, time)
  }

  const pulseAlong = (tl, time, id, lineId, opts = {}) => {
    const { duration = 0.55, sfxEntry = null, sfxMult = 0.7 } = opts
    if (sfxEntry) sfxOn(tl, time, () => playSfx(sfxEntry, sfxMult))
    tl.add(() => setPulse(prev => ({ ...prev, [id]: { lineId, t: 0, opacity: 1 } })), time)
    const o = { t: 0 }
    tl.to(o, {
      t: 1, duration, ease: 'power1.in',
      onUpdate: () => setPulse(prev => ({ ...prev, [id]: { lineId, t: o.t, opacity: 1 - o.t * 0.3 } })),
      onComplete: () => setPulse(prev => { const n = { ...prev }; delete n[id]; return n }),
    }, time)
  }

  const blinkLine = (tl, time, id, opts = {}) => {
    const { cycles = 5, stepDuration = 0.18, sfxEntry = null, color = COLORS.WARN, warn = true } = opts
    if (sfxEntry) {
      if (warn) sfxOn(tl, time, () => sfxLoader.warning(sfxEntry.name, { volume: volumeRef.current, speed: speedRef.current }))
      else sfxOn(tl, time, () => playSfx(sfxEntry))
    }
    const o = { a: 0 }
    tl.to(o, {
      a: 1, duration: stepDuration, yoyo: true, repeat: cycles,
      onUpdate: () => setLineAlert(prev => ({ ...prev, [id]: { opacity: o.a, color } })),
      onComplete: () => setLineAlert(prev => ({ ...prev, [id]: { opacity: 0, color } })),
    }, time)
  }

  const say = (tl, time, text, stationId) => tl.add(() => { setCaption(text); setCaptionStation(stationId) }, time)

  const setPathText = (tl, time, text) => {
    tl.to({}, { duration: 0.12, onComplete: () => setPathOpacity(0) }, time)
    tl.add(() => setPathTextState(text), time + 0.14)
    tl.to({}, { duration: 0.16, onComplete: () => setPathOpacity(1) }, time + 0.16)
  }

  // ═══════════════════════════════════════════════════════════════════
  // MASTER TIMELINE — enam Act, ±56s (intro ~1s + 9/8.5/8/9/11/10s)
  // ═══════════════════════════════════════════════════════════════════
  useEffect(() => {
    const tl = gsap.timeline({ repeat: -1, repeatDelay: 1.2 })
    tlRef.current = tl
    window.__animationTimeline = tl
    window.__flushSync = flushSync

    let t = 0

    tl.add(() => {
      setMorphP(0); setHeaderOpacity(1); setContentStarted(false)
      setStationOpacity(Object.fromEntries(STATION_IDS.map(id => [id, 0])))
      setLineProgress(Object.fromEntries(LINES.map(l => [l.id, 0])))
      setPulse({})
      setLineAlert({})
      setJournaldFieldsShown(false); setLogPreviewShown(false)
      setRotationJournaldOn(false); setRotationLogrotateOn(false)
      setAuditForwarded(false)
      setTimelineCount(0)
      setDiagnosisStep(-1)
      setCaption(''); setCaptionStation(null)
      setPathTextState(''); setPathOpacity(0)
      setClosingOpacity(0)
    }, t)

    // ═══════════════ INTRO — hero centered → header ════════════════
    t += 0.2
    const mo = { p: 0 }
    tl.to(mo, { p: 1, duration: 0.8, ease: 'power3.inOut', onUpdate: () => setMorphP(mo.p) }, t)
    sfxOn(tl, t, () => sfxLoader.transition(SFX_MAP.TELEPORT.name, { volume: volumeRef.current, speed: speedRef.current }))
    t += 0.8
    tl.add(() => setContentStarted(true), t)

    // ═══════════════ ACT 1 — Dari Event ke Dua Jalur (9.0s) ═════════
    tl.add(() => setPhaseIdx(0), t)
    lightStation(tl, t + 0.1, 'rawEvent', { duration: 0.8, sfxEntry: SFX_MAP.POP, sfxMult: 0.7 })
    say(tl, t + 0.3, 'App menulis event, belum masuk log manapun', 'rawEvent')
    drawLine(tl, t + 1.2, 'event-to-journald', { duration: 0.7, sfxEntry: SFX_MAP.SLIDE_IN })
    lightStation(tl, t + 1.9, 'journald', { duration: 0.6, sfxEntry: SFX_MAP.POP })
    setPathText(tl, t + 2.05, PATH_ATLAS.journald)
    say(tl, t + 2.15, 'journald menangkap semua event', 'journald')
    drawLine(tl, t + 3.4, 'journald-to-logfiles', { duration: 0.7, sfxEntry: SFX_MAP.WHOOSH_LOW })
    lightStation(tl, t + 4.1, 'logFiles', { duration: 0.6, sfxEntry: SFX_MAP.POP2 })
    setPathText(tl, t + 4.25, PATH_ATLAS.logFiles)
    say(tl, t + 4.35, 'Diteruskan juga ke rsyslog', 'logFiles')
    dimStation(tl, t + 6.5, 'rawEvent', { to: 0.4, sfxEntry: SFX_MAP.WHOOSH_LOW, sfxMult: 0.4 })
    let act1End = t + 9.0

    // ═══════════════ ACT 2 — journald: Terstruktur & Bisa Difilter (8.5s) ═
    let t2 = act1End
    tl.add(() => setPhaseIdx(1), t2)
    say(tl, t2 + 0.1, 'Disimpan terstruktur, bisa difilter', 'journald')
    sfxOn(tl, t2 + 0.1, () => playSfx(SFX_MAP.CHIME))
    tl.add(() => setJournaldFieldsShown(true), t2 + 1.8)
    sfxOn(tl, t2 + 1.8, () => playSfx(SFX_MAP.TICK))
    say(tl, t2 + 1.9, 'Field: priority, unit, pesan', 'journald')
    let act2End = t2 + 8.5

    // ═══════════════ ACT 3 — Log Files: Teks di /var/log (8.0s) ═══════
    let t3 = act2End
    tl.add(() => setPhaseIdx(2), t3)
    say(tl, t3 + 0.1, 'Jadi baris teks polos di /var/log', 'logFiles')
    tl.add(() => setLogPreviewShown(true), t3 + 1.5)
    sfxOn(tl, t3 + 1.5, () => playSfx(SFX_MAP.TICK))
    say(tl, t3 + 1.6, 'Bisa dibaca manusia, dicari pakai grep', 'logFiles')
    let act3End = t3 + 8.0

    // ═══════════════ ACT 4 — Rotasi & Retensi: Log Tidak Abadi (9.0s) ══
    let t4 = act3End
    tl.add(() => setPhaseIdx(3), t4)
    drawLine(tl, t4 + 0.1, 'journald-to-rotation', { duration: 0.7, sfxEntry: SFX_MAP.WHOOSH })
    lightStation(tl, t4 + 0.8, 'rotation', { duration: 0.6, sfxEntry: SFX_MAP.POP })
    setPathText(tl, t4 + 0.9, PATH_ATLAS.rotationConf)
    say(tl, t4 + 1.0, 'Semua log kena kebijakan retensi', 'rotation')
    let a4 = t4 + 2.4
    tl.add(() => setRotationJournaldOn(true), a4)
    sfxOn(tl, a4, () => playSfx(SFX_MAP.LOCK))
    a4 += 1.3
    tl.add(() => setRotationLogrotateOn(true), a4)
    sfxOn(tl, a4, () => playSfx(SFX_MAP.POP2))
    say(tl, a4 + 0.1, 'Log tidak abadi, ada batas & rotasi', 'rotation')
    let act4End = t4 + 9.0

    // ═══════════════ ACT 5 — Terpusat & Audit Trail (11.0s) ═══════════
    let t5 = act4End
    tl.add(() => setPhaseIdx(4), t5)
    drawLine(tl, t5 + 0.1, 'journald-to-remote', { duration: 0.7, sfxEntry: SFX_MAP.WHOOSH })
    lightStation(tl, t5 + 0.8, 'remoteAudit', { duration: 0.6, sfxEntry: SFX_MAP.POP2 })
    setPathText(tl, t5 + 0.9, PATH_ATLAS.remoteConf)
    say(tl, t5 + 1.0, 'journald juga forward ke server pusat', 'remoteAudit')
    let a5 = t5 + 2.2
    tl.add(() => setAuditForwarded(true), a5)
    sfxOn(tl, a5, () => playSfx(SFX_MAP.CHIME))
    say(tl, a5 + 0.1, 'Di sana jadi audit trail', 'remoteAudit')
    a5 += 1.4
    drawLine(tl, a5, 'remote-to-timeline', { duration: 0.7, sfxEntry: SFX_MAP.WHOOSH_LOW })
    lightStation(tl, a5 + 0.7, 'timeline', { duration: 0.6, sfxEntry: SFX_MAP.POP })
    say(tl, a5 + 0.8, 'Audit trail masuk ke timeline insiden', 'timeline')
    a5 += 1.2
    TIMELINE_ENTRIES.forEach((entry, i) => {
      if (i < 2) {
        pulseAlong(tl, a5, `t-pulse-${i}`, 'remote-to-timeline', { duration: 0.4 })
        tl.add(() => setTimelineCount(i + 1), a5 + 0.4)
        sfxOn(tl, a5 + 0.4, () => playSfx(SFX_MAP.TICK))
      } else {
        tl.add(() => setTimelineCount(i + 1), a5)
        sfxOn(tl, a5, () => playSfx(SFX_MAP.TICK, 0.7))
      }
      a5 += 0.55
    })
    say(tl, a5 + 0.1, 'Timeline jadi jejak lintas sumber', 'timeline')
    let act5End = t5 + 11.0

    // ═══════════════ ACT 6 — Rekonstruksi: Ikuti Jejak Waktu (10.0s) ═══
    let t6 = act5End
    tl.add(() => setPhaseIdx(5), t6)
    drawLine(tl, t6 + 0.1, 'remote-to-diagnosis', { duration: 0.5, sfxEntry: SFX_MAP.WHOOSH })
    drawLine(tl, t6 + 0.15, 'timeline-to-diagnosis', { duration: 0.5, sfxEntry: SFX_MAP.SLIDE_IN, sfxMult: 0.7 })
    drawLine(tl, t6 + 0.2, 'rotation-to-diagnosis', { duration: 0.5, sfxEntry: SFX_MAP.SLIDE_IN, sfxMult: 0.7 })
    lightStation(tl, t6 + 0.7, 'diagnosis', { duration: 0.6, sfxEntry: SFX_MAP.CHIME })
    let a6 = t6 + 1.6
    tl.add(() => setDiagnosisStep(0), a6)
    sfxOn(tl, a6, () => playSfx(SFX_MAP.POP2))
    blinkLine(tl, a6, 'timeline-to-diagnosis', { cycles: 2, stepDuration: 0.3, color: COLORS.DIAGNOSIS, warn: false, sfxEntry: SFX_MAP.TICK })
    say(tl, a6 + 0.1, 'Mulai dari urutan waktu', 'diagnosis')
    a6 += 2.0
    tl.add(() => setDiagnosisStep(1), a6)
    sfxOn(tl, a6, () => playSfx(SFX_MAP.POP2))
    blinkLine(tl, a6, 'remote-to-diagnosis', { cycles: 2, stepDuration: 0.3, color: COLORS.DIAGNOSIS, warn: false, sfxEntry: SFX_MAP.TICK })
    say(tl, a6 + 0.1, 'Pisahkan per sumber log', 'diagnosis')
    a6 += 2.0
    tl.add(() => setDiagnosisStep(2), a6)
    sfxOn(tl, a6, () => playSfx(SFX_MAP.POP2))
    blinkLine(tl, a6, 'rotation-to-diagnosis', { cycles: 2, stepDuration: 0.3, color: COLORS.DIAGNOSIS, warn: false, sfxEntry: SFX_MAP.TICK })
    say(tl, a6 + 0.1, 'Gabungkan jadi konteks penuh', 'diagnosis')
    a6 += 2.0
    const co = { v: 0 }
    tl.to(co, { v: 1, duration: 0.5, ease: 'back.out(1.6)', onUpdate: () => setClosingOpacity(co.v) }, a6)
    sfxOn(tl, a6, () => playSfx(SFX_MAP.DING))
    sfxOn(tl, a6 + 0.18, () => playSfx(SFX_MAP.CONFIRM, 0.6))
    say(tl, a6 + 0.1, 'Log bukan abadi, tapi jejaknya berharga', 'diagnosis')
    let act6End = a6 + 1.7

    tl.to({}, { duration: 0.5 }, act6End)

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

  const liveState = {
    phaseIdx, stationOpacity, lineProgress, pulse, lineAlert,
    journaldFieldsShown, logPreviewShown, rotationJournaldOn, rotationLogrotateOn,
    auditForwarded, timelineCount, diagnosisStep,
    caption, captionStation, pathText, pathOpacity, closingOpacity,
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
        <filter id="shadow">
          <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#000" floodOpacity="0.5" />
        </filter>
      </defs>

      <rect x={0} y={0} width={VW} height={VH} fill={COLORS.BG} />
      <g opacity={0.04}>
        {Array.from({ length: 21 }).map((_, i) => <line key={`v${i}`} x1={i * 40} y1={0} x2={i * 40} y2={VH} stroke={COLORS.EVENT} strokeWidth={1} />)}
        {Array.from({ length: 34 }).map((_, i) => <line key={`h${i}`} x1={0} y1={i * 40} x2={VW} y2={i * 40} stroke={COLORS.EVENT} strokeWidth={1} />)}
      </g>

      {headerOpacity > 0 && (
        <g opacity={headerOpacity}>
          <IntroHeaderMorphV1
            progress={morphP}
            categorySegments={[
              { label: INTRO_CATEGORY_LABEL + ' · ', color: COLORS.MUTED },
              { label: INTRO_DOMAIN, color: COLORS.EVENT },
            ]}
            titleSegments={[
              { label: INTRO_TITLE_A, color: COLORS.EVENT },
              { label: INTRO_TITLE_B, color: COLORS.ACTIVE },
            ]}
            subtitle={INTRO_SUBTITLE}
            titleFilter="url(#glow)"
            bg={6}
            bgScenes={ACT_SCENES}
            testId="linux-logs-intro-header"
          />
        </g>
      )}

      {contentStarted && (
        <g>
          <ActBadgeNavigatorV1 phases={PHASES} activeIndex={phaseIdx} testId="linux-logs-act-navigator" />
          <ContentBodyV1 debugName="linux-logs-body">
            {(() => {
              const Act = ACT_SCENES[phaseIdx]
              return <Act state={liveState} />
            })()}
          </ContentBodyV1>
        </g>
      )}
    </svg>
  )
}
