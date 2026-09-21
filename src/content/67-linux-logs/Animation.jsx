// src/content/67-linux-logs/Animation.jsx
// ═══════════════════════════════════════════════════════════════════════
// Topic baru dari nol (override keputusan merge, lihat
// _docs/LINUX_LOGS_STANDALONE_PLAN.md). Pola mekanik (lightStation,
// drawLine, pulseAlong, blinkLine, IconCaption, Stamp, peta 7 stasiun)
// meniru Topic 65 (systemd) yang sudah tervalidasi no-overlap & lolos
// export test -- konten & peran tiap stasiun diganti total untuk materi
// logging umum (journald, syslog, rotasi, audit, incident timeline).
// ═══════════════════════════════════════════════════════════════════════

import React, { useEffect, useRef, useState } from 'react'
import { flushSync } from 'react-dom'
import gsap from 'gsap'
import {
  VW, VH, COLORS, PHASES, SFX_MAP,
  INTRO_CATEGORY_LABEL, INTRO_DOMAIN, INTRO_TITLE, INTRO_SUBTITLE,
  STATIONS, LINES, CLOSING_Y, PATH_ATLAS,
  EVENT_INFO, RAW_EVENT_LABEL, JOURNALD_LABEL, LOGFILES_LABEL, REMOTE_LABEL,
  JOURNALD_FIELDS, LOGFILE_PREVIEW, ROTATION_INFO, REMOTE_INFO,
  TIMELINE_ENTRIES, SOURCE_COLOR, DIAGNOSIS_STEPS, CLOSING_STAMPS, CAPTIONS,
} from './data'
import sfxLoader from '../../shared/audio/sfxLoader'
import { IntroHeaderMorphV1, ActBadgeNavigatorV1, ContentBodyV1 } from '../../shared/scene-ui/v1'

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
    const { to = 0.4, duration = 0.6 } = opts
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
    lightStation(tl, t + 0.1, 'rawEvent', { duration: 0.8 })
    say(tl, t + 0.3, CAPTIONS.RAW_EVENT, 'rawEvent')
    drawLine(tl, t + 1.2, 'event-to-journald', { duration: 0.7, sfxEntry: SFX_MAP.SLIDE_IN })
    lightStation(tl, t + 1.9, 'journald', { duration: 0.6, sfxEntry: SFX_MAP.POP })
    setPathText(tl, t + 2.05, PATH_ATLAS.journald)
    say(tl, t + 2.15, CAPTIONS.JOURNALD_CAPTURES, 'journald')
    drawLine(tl, t + 3.4, 'journald-to-logfiles', { duration: 0.7, sfxEntry: SFX_MAP.WHOOSH_LOW })
    lightStation(tl, t + 4.1, 'logFiles', { duration: 0.6, sfxEntry: SFX_MAP.POP2 })
    setPathText(tl, t + 4.25, PATH_ATLAS.logFiles)
    say(tl, t + 4.35, CAPTIONS.FORWARD_LOGFILES, 'logFiles')
    dimStation(tl, t + 6.5, 'rawEvent', { to: 0.4 })
    let act1End = t + 9.0

    // ═══════════════ ACT 2 — journald: Terstruktur & Bisa Difilter (8.5s) ═
    let t2 = act1End
    tl.add(() => setPhaseIdx(1), t2)
    say(tl, t2 + 0.1, CAPTIONS.JOURNALD_STRUCTURED, 'journald')
    sfxOn(tl, t2 + 0.1, () => playSfx(SFX_MAP.CHIME))
    tl.add(() => setJournaldFieldsShown(true), t2 + 1.8)
    sfxOn(tl, t2 + 1.8, () => playSfx(SFX_MAP.TICK))
    say(tl, t2 + 1.9, CAPTIONS.FIELDS_SHOWN, 'journald')
    let act2End = t2 + 8.5

    // ═══════════════ ACT 3 — Log Files: Teks di /var/log (8.0s) ═══════
    let t3 = act2End
    tl.add(() => setPhaseIdx(2), t3)
    say(tl, t3 + 0.1, CAPTIONS.LOGFILES_PLAIN, 'logFiles')
    tl.add(() => setLogPreviewShown(true), t3 + 1.5)
    sfxOn(tl, t3 + 1.5, () => playSfx(SFX_MAP.TICK))
    say(tl, t3 + 1.6, CAPTIONS.GREP_ABLE, 'logFiles')
    let act3End = t3 + 8.0

    // ═══════════════ ACT 4 — Rotasi & Retensi: Log Tidak Abadi (9.0s) ══
    let t4 = act3End
    tl.add(() => setPhaseIdx(3), t4)
    drawLine(tl, t4 + 0.1, 'journald-to-rotation', { duration: 0.7, sfxEntry: SFX_MAP.WHOOSH })
    lightStation(tl, t4 + 0.8, 'rotation', { duration: 0.6 })
    setPathText(tl, t4 + 0.9, PATH_ATLAS.rotationConf)
    say(tl, t4 + 1.0, CAPTIONS.ROTATION_HITS, 'rotation')
    let a4 = t4 + 2.4
    tl.add(() => setRotationJournaldOn(true), a4)
    sfxOn(tl, a4, () => playSfx(SFX_MAP.LOCK))
    a4 += 1.3
    tl.add(() => setRotationLogrotateOn(true), a4)
    sfxOn(tl, a4, () => playSfx(SFX_MAP.POP2))
    say(tl, a4 + 0.1, CAPTIONS.NOT_ETERNAL, 'rotation')
    let act4End = t4 + 9.0

    // ═══════════════ ACT 5 — Terpusat & Audit Trail (11.0s) ═══════════
    let t5 = act4End
    tl.add(() => setPhaseIdx(4), t5)
    drawLine(tl, t5 + 0.1, 'journald-to-remote', { duration: 0.7, sfxEntry: SFX_MAP.WHOOSH })
    lightStation(tl, t5 + 0.8, 'remoteAudit', { duration: 0.6, sfxEntry: SFX_MAP.POP2 })
    setPathText(tl, t5 + 0.9, PATH_ATLAS.remoteConf)
    say(tl, t5 + 1.0, CAPTIONS.FORWARD_REMOTE, 'remoteAudit')
    let a5 = t5 + 2.2
    tl.add(() => setAuditForwarded(true), a5)
    sfxOn(tl, a5, () => playSfx(SFX_MAP.CHIME))
    say(tl, a5 + 0.1, CAPTIONS.BECOMES_AUDIT, 'remoteAudit')
    a5 += 1.4
    drawLine(tl, a5, 'remote-to-timeline', { duration: 0.7, sfxEntry: SFX_MAP.WHOOSH_LOW })
    lightStation(tl, a5 + 0.7, 'timeline', { duration: 0.6, sfxEntry: SFX_MAP.POP })
    say(tl, a5 + 0.8, CAPTIONS.AUDIT_TO_TIMELINE, 'timeline')
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
    say(tl, a5 + 0.1, CAPTIONS.TIMELINE_GROWS, 'timeline')
    let act5End = t5 + 11.0

    // ═══════════════ ACT 6 — Rekonstruksi: Ikuti Jejak Waktu (10.0s) ═══
    let t6 = act5End
    tl.add(() => setPhaseIdx(5), t6)
    drawLine(tl, t6 + 0.1, 'remote-to-diagnosis', { duration: 0.5, sfxEntry: SFX_MAP.WHOOSH })
    drawLine(tl, t6 + 0.1, 'timeline-to-diagnosis', { duration: 0.5 })
    drawLine(tl, t6 + 0.1, 'rotation-to-diagnosis', { duration: 0.5 })
    lightStation(tl, t6 + 0.7, 'diagnosis', { duration: 0.6, sfxEntry: SFX_MAP.CHIME })
    let a6 = t6 + 1.6
    tl.add(() => setDiagnosisStep(0), a6)
    sfxOn(tl, a6, () => playSfx(SFX_MAP.POP2))
    blinkLine(tl, a6, 'timeline-to-diagnosis', { cycles: 2, stepDuration: 0.3, color: COLORS.DIAGNOSIS, warn: false })
    say(tl, a6 + 0.1, CAPTIONS.READ_TIMESTAMP, 'diagnosis')
    a6 += 2.0
    tl.add(() => setDiagnosisStep(1), a6)
    sfxOn(tl, a6, () => playSfx(SFX_MAP.POP2))
    blinkLine(tl, a6, 'remote-to-diagnosis', { cycles: 2, stepDuration: 0.3, color: COLORS.DIAGNOSIS, warn: false })
    say(tl, a6 + 0.1, CAPTIONS.SEPARATE_SOURCE, 'diagnosis')
    a6 += 2.0
    tl.add(() => setDiagnosisStep(2), a6)
    sfxOn(tl, a6, () => playSfx(SFX_MAP.POP2))
    blinkLine(tl, a6, 'rotation-to-diagnosis', { cycles: 2, stepDuration: 0.3, color: COLORS.DIAGNOSIS, warn: false })
    say(tl, a6 + 0.1, CAPTIONS.MERGE_CONTEXT, 'diagnosis')
    a6 += 2.0
    const co = { v: 0 }
    tl.to(co, { v: 1, duration: 0.5, ease: 'back.out(1.6)', onUpdate: () => setClosingOpacity(co.v) }, a6)
    sfxOn(tl, a6, () => playSfx(SFX_MAP.DING))
    say(tl, a6 + 0.1, CAPTIONS.TAKEAWAY, 'diagnosis')
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

  // ── Icon: pictogram SVG inline (reuse dari Topic 65, cakupan tipe sama) ──
  const Icon = ({ type, size = 28, color = COLORS.TEXT, strokeWidth = 1.8 }) => {
    const s = size / 24
    const p = { fill: 'none', stroke: color, strokeWidth: strokeWidth / s, strokeLinecap: 'round', strokeLinejoin: 'round' }
    return (
      <g transform={`scale(${s})`}>
        {type === 'process' && (
          <g>
            <rect x={-10} y={-10} width={20} height={20} rx={4} {...p} />
            <circle cx={0} cy={0} r={3.5} fill={color} stroke="none" />
          </g>
        )}
        {type === 'document' && (
          <g>
            <path d="M -8,-11 L 3,-11 L 9,-5 L 9,11 L -8,11 Z" {...p} />
            <path d="M 3,-11 L 3,-5 L 9,-5" {...p} />
            <line x1={-4} y1={0} x2={5} y2={0} {...p} />
            <line x1={-4} y1={4} x2={5} y2={4} {...p} />
          </g>
        )}
        {type === 'stack' && (
          <g>
            <rect x={-9} y={-8} width={18} height={5} rx={1.5} {...p} />
            <rect x={-9} y={-1} width={18} height={5} rx={1.5} {...p} />
            <rect x={-9} y={6} width={18} height={5} rx={1.5} {...p} />
          </g>
        )}
        {type === 'magnifier' && (
          <g>
            <circle cx={-2} cy={-2} r={7} {...p} />
            <line x1={3} y1={3} x2={10} y2={10} {...p} />
          </g>
        )}
        {type === 'folder' && (
          <g>
            <path d="M -10,-7 L -3,-7 L -1,-4 L 10,-4 L 10,8 L -10,8 Z" {...p} />
          </g>
        )}
        {type === 'lock' && (
          <g>
            <rect x={-7} y={-1} width={14} height={10} rx={2} {...p} />
            <path d="M -4,-1 L -4,-5 A 4,4 0 0 1 4,-5 L 4,-1" {...p} />
          </g>
        )}
        {type === 'alert' && (
          <g>
            <path d="M 0,-10 L 10,8 L -10,8 Z" {...p} />
            <line x1={0} y1={-3} x2={0} y2={2} {...p} />
            <circle cx={0} cy={5} r={0.8} fill={color} stroke="none" />
          </g>
        )}
        {type === 'restart' && (
          <g>
            <path d="M 8,-2 A 8,8 0 1 0 6,6" {...p} />
            <path d="M 9,-8 L 8,-2 L 2,-3" {...p} />
          </g>
        )}
        {type === 'link' && (
          <g>
            <rect x={-11} y={-4} width={12} height={8} rx={4} {...p} />
            <rect x={-1} y={-4} width={12} height={8} rx={4} {...p} />
          </g>
        )}
        {type === 'check' && (
          <g>
            <circle cx={0} cy={0} r={10} {...p} />
            <path d="M -5,0 L -1,4 L 6,-4" {...p} />
          </g>
        )}
        {type === 'route' && (
          <g>
            <circle cx={-7} cy={7} r={2.5} {...p} />
            <circle cx={7} cy={-7} r={2.5} fill={color} stroke="none" />
            <path d="M -7,4.5 C -7,-6 7,6 7,-4.5" {...p} strokeDasharray="2 3" />
          </g>
        )}
        {type === 'clock' && (
          <g>
            <circle cx={0} cy={0} r={10} {...p} />
            <path d="M 0,-5 L 0,0 L 4,3" {...p} />
          </g>
        )}
      </g>
    )
  }

  // ── FlowLine: garis alur yang "digambar" (bukan muncul tiba-tiba) ──
  const FlowLine = ({ line }) => {
    const a = STATIONS[line.from]
    const b = STATIONS[line.to]
    const progress = lineProgress[line.id] || 0
    if (progress <= 0) return null
    const alert = lineAlert[line.id]
    const mx = a.cx + (b.cx - a.cx) * 0.5
    const my = a.cy + (b.cy - a.cy) * 0.5
    return (
      <g>
        <line x1={a.cx} y1={a.cy} x2={b.cx} y2={b.cy}
          stroke={COLORS.BORDER} strokeWidth={2} pathLength={100}
          strokeDasharray={100} strokeDashoffset={100 * (1 - progress)} opacity={0.7} />
        {alert && alert.opacity > 0.02 && (
          <line x1={a.cx} y1={a.cy} x2={b.cx} y2={b.cy}
            stroke={alert.color} strokeWidth={3} opacity={alert.opacity} />
        )}
        {progress > 0.02 && progress < 0.98 && line.label && (
          <PathLabel x={mx} y={my} text={line.label} />
        )}
      </g>
    )
  }

  const IconCaption = ({ stationId, text }) => {
    if (!text || captionStation !== stationId) return null
    const st = STATIONS[stationId]
    if (!st) return null

    let absX = st.cx
    let textAnchor = 'middle'
    if (st.cx > 500) {
      absX = Math.min(st.cx + 40, 700)
      textAnchor = 'end'
    } else if (st.cx < 200) {
      absX = Math.max(st.cx - 40, 32)
      textAnchor = 'start'
    }
    const localX = absX - st.cx
    const localY = st.h / 2 + 20

    const lines = wrapText(text, 32)

    return (
      <text x={localX} y={localY} textAnchor={textAnchor} fontSize={13} fontWeight={600}
        fontFamily="sans-serif" fill={COLORS.TEXT} stroke={COLORS.BG} strokeWidth={4} paintOrder="stroke">
        {lines.map((ln, idx) => (
          <tspan key={idx} x={localX} dy={idx === 0 ? 0 : 16}>{ln}</tspan>
        ))}
      </text>
    )
  }

  const PathLabel = ({ x, y, text }) => (
    <text x={x} y={y - 6} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={COLORS.MUTED}
      stroke={COLORS.BG} strokeWidth={3} paintOrder="stroke">{text}</text>
  )

  const wrapText = (str, maxChars) => {
    const lines = []
    let cur = ''
    str.split(' ').forEach(w => {
      if (cur && (cur + ' ' + w).length > maxChars) { lines.push(cur); cur = w } else { cur = cur ? cur + ' ' + w : w }
    })
    if (cur) lines.push(cur)
    return lines
  }

  const Stamp = ({ x, y, color, top, sub, icon, rot = -7 }) => (
    <g transform={`translate(${x}, ${y}) rotate(${rot})`}>
      <circle r={48} fill={color} opacity={0.16} />
      <rect x={-76} y={-30} width={152} height={60} rx={9} fill={COLORS.BG} stroke={color} strokeWidth={3} />
      {icon && (
        <g transform="translate(0, -30)">
          <circle r={15} fill={COLORS.BG} stroke={color} strokeWidth={2.5} />
          <Icon type={icon} size={18} color={color} strokeWidth={2} />
        </g>
      )}
      <text x={0} y={1} textAnchor="middle" fontSize={11} fontWeight={900} fontFamily="monospace" fill={color}>{top}</text>
      {sub && <text x={0} y={20} textAnchor="middle" fontSize={9} fontFamily="sans-serif" fill={COLORS.MUTED}>{sub}</text>}
    </g>
  )

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
            titleSegments={[{ label: INTRO_TITLE, color: COLORS.JOURNALD }]}
            subtitle={INTRO_SUBTITLE}
            titleFilter="url(#glow)"
            testId="linux-logs-intro-header"
          />
        </g>
      )}

      {contentStarted && (
        <g>
          <ActBadgeNavigatorV1 phases={PHASES} activeIndex={phaseIdx} testId="linux-logs-act-navigator" />

          <ContentBodyV1>
            <g opacity={pathText ? pathOpacity : 0}>
              <rect x={16} y={4} width={700} height={30} rx={8} fill={COLORS.PANEL} stroke={COLORS.BORDER} strokeWidth={1} />
              <g transform="translate(30, 19)"><Icon type="folder" size={16} color={COLORS.MUTED} /></g>
              <text x={46} y={23} fontSize={9} fontWeight={700} fontFamily="monospace" letterSpacing={1} fill={COLORS.MUTED}>LOKASI</text>
              <text x={100} y={23} fontSize={12} fontFamily="monospace" fill={COLORS.TEXT}>{pathText}</text>
            </g>

            {LINES.map(line => <FlowLine key={line.id} line={line} />)}

            {Object.entries(pulse).map(([id, pdata]) => {
              const pt = pointAt(pdata.lineId, pdata.t)
              return <circle key={id} cx={pt.x} cy={pt.y} r={5} fill={COLORS.REMOTE} opacity={pdata.opacity} filter="url(#glow)" />
            })}

            {/* ── Stasiun 1: App / Process (Act 1, redup setelahnya) ── */}
            <g transform={`translate(${STATIONS.rawEvent.cx}, ${STATIONS.rawEvent.cy})`} opacity={stationOpacity.rawEvent}>
              <rect x={-STATIONS.rawEvent.w / 2} y={-STATIONS.rawEvent.h / 2}
                width={STATIONS.rawEvent.w} height={STATIONS.rawEvent.h} rx={14}
                fill={COLORS.PANEL} stroke={COLORS.EVENT} strokeWidth={2.2} filter="url(#shadow)" />
              <g transform="translate(0, -52)"><Icon type="process" size={30} color={COLORS.EVENT} /></g>
              <text x={0} y={-8} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="monospace" letterSpacing={0.5} fill={COLORS.EVENT}>{RAW_EVENT_LABEL}</text>
              <g transform="translate(0, 18)">
                <rect x={-90} y={-13} width={180} height={26} rx={13} fill={COLORS.BG} stroke={COLORS.BORDER} strokeWidth={1.5} />
                <text x={0} y={4} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={COLORS.MUTED}>{EVENT_INFO.writesVia}</text>
              </g>
              <text x={0} y={58} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={COLORS.MUTED}>belum masuk log manapun</text>
              <IconCaption stationId="rawEvent" text={caption} />
            </g>

            {/* ── Stasiun 2: Log Files (Act 3) ── */}
            <g transform={`translate(${STATIONS.logFiles.cx}, ${STATIONS.logFiles.cy})`} opacity={stationOpacity.logFiles}>
              <rect x={-STATIONS.logFiles.w / 2} y={-STATIONS.logFiles.h / 2}
                width={STATIONS.logFiles.w} height={STATIONS.logFiles.h} rx={14}
                fill={COLORS.PANEL} stroke={logPreviewShown ? COLORS.ACTIVE : COLORS.LOGFILE} strokeWidth={2.2} filter="url(#shadow)" />
              <g transform="translate(0, -60)"><Icon type="document" size={28} color={COLORS.LOGFILE} /></g>
              <text x={0} y={-24} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="monospace" fill={COLORS.LOGFILE}>{LOGFILES_LABEL}</text>
              {logPreviewShown && (
                <g transform="translate(0, -2)">
                  {LOGFILE_PREVIEW.map((ln, i) => (
                    <text key={i} x={0} y={i * 16} textAnchor="middle" fontSize={8.5} fontFamily="monospace" fill={COLORS.TEXT}>{ln.length > 42 ? ln.slice(0, 42) + '…' : ln}</text>
                  ))}
                </g>
              )}
              {logPreviewShown && (
                <g transform="translate(0, 46)">
                  <rect x={-72} y={-12} width={144} height={24} rx={12} fill={COLORS.BG} stroke={COLORS.ACTIVE} strokeWidth={1.5} />
                  <g transform="translate(-56, 0)"><Icon type="magnifier" size={13} color={COLORS.ACTIVE} /></g>
                  <text x={6} y={4} textAnchor="middle" fontSize={9} fontWeight={700} fontFamily="monospace" fill={COLORS.ACTIVE}>GREP-ABLE</text>
                </g>
              )}
              {stationOpacity.logFiles > 0.5 && (
                <text x={0} y={70} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={COLORS.MUTED}>{PATH_ATLAS.logFiles}</text>
              )}
              <IconCaption stationId="logFiles" text={caption} />
            </g>

            {/* ── Stasiun 3: journald (hub, persist Act 1-6) ── */}
            <g transform={`translate(${STATIONS.journald.cx}, ${STATIONS.journald.cy})`} opacity={stationOpacity.journald}>
              <rect x={-STATIONS.journald.w / 2} y={-STATIONS.journald.h / 2}
                width={STATIONS.journald.w} height={STATIONS.journald.h} rx={16}
                fill={COLORS.PANEL} stroke={COLORS.JOURNALD} strokeWidth={2.6} filter="url(#shadow)" />
              <g transform="translate(0, -55)" filter="url(#glow)"><Icon type="stack" size={38} color={COLORS.JOURNALD} /></g>
              <text x={0} y={-16} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="monospace" letterSpacing={1} fill={COLORS.JOURNALD}>{JOURNALD_LABEL}</text>
              {!journaldFieldsShown && (
                <text x={0} y={8} textAnchor="middle" fontSize={11} fontFamily="monospace" fill={COLORS.MUTED}>terstruktur, bisa difilter</text>
              )}
              {journaldFieldsShown && (
                <g transform="translate(0, 2)">
                  {JOURNALD_FIELDS.map((f, i) => (
                    <g key={f.key} transform={`translate(0, ${i * 15})`}>
                      <text x={-130} y={0} fontSize={9.5} fontWeight={700} fontFamily="monospace" fill={COLORS.JOURNALD}>{f.key}</text>
                      <text x={-10} y={0} fontSize={9.5} fontFamily="monospace" fill={COLORS.TEXT}>{f.value}</text>
                    </g>
                  ))}
                </g>
              )}
              <IconCaption stationId="journald" text={caption} />
            </g>

            {/* ── Stasiun 4: Remote / Audit (Act 5) ── */}
            <g transform={`translate(${STATIONS.remoteAudit.cx}, ${STATIONS.remoteAudit.cy})`} opacity={stationOpacity.remoteAudit}>
              <rect x={-STATIONS.remoteAudit.w / 2} y={-STATIONS.remoteAudit.h / 2}
                width={STATIONS.remoteAudit.w} height={STATIONS.remoteAudit.h} rx={12}
                fill={COLORS.PANEL} stroke={auditForwarded ? COLORS.ACTIVE : COLORS.REMOTE} strokeWidth={2.2} filter="url(#shadow)" />
              <g transform="translate(-62, 0)"><Icon type="link" size={24} color={auditForwarded ? COLORS.ACTIVE : COLORS.REMOTE} /></g>
              <text x={-38} y={-14} fontSize={10} fontWeight={700} fontFamily="monospace" letterSpacing={0.5} fill={COLORS.MUTED}>{REMOTE_LABEL}</text>
              <text x={-38} y={4} fontSize={11} fontWeight={700} fontFamily="monospace" fill={COLORS.TEXT}>{REMOTE_INFO.target}</text>
              {auditForwarded && (
                <text x={-38} y={22} fontSize={9} fontFamily="monospace" fill={COLORS.ACTIVE}>{REMOTE_INFO.note}</text>
              )}
              <IconCaption stationId="remoteAudit" text={caption} />
            </g>

            {/* ── Stasiun 5: Rotasi & Retensi (Act 4, persist) ── */}
            <g transform={`translate(${STATIONS.rotation.cx}, ${STATIONS.rotation.cy})`} opacity={stationOpacity.rotation}>
              <rect x={-STATIONS.rotation.w / 2} y={-STATIONS.rotation.h / 2}
                width={STATIONS.rotation.w} height={STATIONS.rotation.h} rx={14}
                fill={COLORS.PANEL} stroke={COLORS.ROTATION} strokeWidth={2.2} filter="url(#shadow)" />
              <g transform="translate(0, -56)"><Icon type="clock" size={26} color={COLORS.ROTATION} /></g>
              <text x={0} y={-22} textAnchor="middle" fontSize={11} fontWeight={700} fontFamily="monospace" fill={COLORS.ROTATION}>ROTASI & RETENSI</text>
              <g transform="translate(-64, 46)" opacity={rotationJournaldOn ? 1 : 0.35}>
                <rect x={-58} y={-13} width={116} height={26} rx={8} fill={COLORS.BG} stroke={rotationJournaldOn ? COLORS.ACTIVE : COLORS.BORDER} strokeWidth={1.5} />
                <g transform="translate(-42, 0)"><Icon type="lock" size={12} color={rotationJournaldOn ? COLORS.ACTIVE : COLORS.MUTED} /></g>
                <text x={10} y={4} textAnchor="middle" fontSize={9} fontWeight={700} fontFamily="monospace" fill={rotationJournaldOn ? COLORS.ACTIVE : COLORS.MUTED}>{ROTATION_INFO.journald.label}</text>
              </g>
              <g transform="translate(64, 46)" opacity={rotationLogrotateOn ? 1 : 0.35}>
                <rect x={-58} y={-13} width={116} height={26} rx={8} fill={COLORS.BG} stroke={rotationLogrotateOn ? COLORS.ACTIVE : COLORS.BORDER} strokeWidth={1.5} />
                <g transform="translate(-42, 0)"><Icon type="restart" size={12} color={rotationLogrotateOn ? COLORS.ACTIVE : COLORS.MUTED} /></g>
                <text x={10} y={4} textAnchor="middle" fontSize={9} fontWeight={700} fontFamily="monospace" fill={rotationLogrotateOn ? COLORS.ACTIVE : COLORS.MUTED}>{ROTATION_INFO.logrotate.label}</text>
              </g>
              <IconCaption stationId="rotation" text={caption} />
            </g>

            {/* ── Stasiun 6: Timeline Insiden (Act 5, persist) ── */}
            <g transform={`translate(${STATIONS.timeline.cx}, ${STATIONS.timeline.cy})`} opacity={stationOpacity.timeline}>
              <rect x={-STATIONS.timeline.w / 2} y={-STATIONS.timeline.h / 2}
                width={STATIONS.timeline.w} height={STATIONS.timeline.h} rx={14}
                fill={COLORS.PANEL} stroke={COLORS.TIMELINE} strokeWidth={2.2} filter="url(#shadow)" />
              <g transform={`translate(${-STATIONS.timeline.w / 2 + 24}, ${-STATIONS.timeline.h / 2 + 20})`}><Icon type="stack" size={20} color={COLORS.TIMELINE} /></g>
              <text x={-STATIONS.timeline.w / 2 + 42} y={-STATIONS.timeline.h / 2 + 24} fontSize={11} fontWeight={700} fontFamily="monospace" letterSpacing={1} fill={COLORS.TIMELINE}>TIMELINE</text>
              {TIMELINE_ENTRIES.slice(0, timelineCount).map((entry, i) => {
                const isStep0 = phaseIdx === 5 && diagnosisStep === 0
                const isStep1 = phaseIdx === 5 && diagnosisStep === 1 && entry.source === 'AUDIT'
                const active = entry.highlighted && (phaseIdx === 4 || isStep0 || isStep1)
                const rowY = -STATIONS.timeline.h / 2 + 46 + i * 25
                return (
                  <g key={entry.id} transform={`translate(0, ${rowY})`}>
                    {active && <rect x={-STATIONS.timeline.w / 2 + 8} y={-11} width={STATIONS.timeline.w - 16} height={22} rx={5} fill={COLORS.DIAGNOSIS} opacity={0.18} />}
                    <text x={-STATIONS.timeline.w / 2 + 14} y={4} fontSize={9.5} fontFamily="monospace" fill={COLORS.MUTED}>{entry.time}</text>
                    <rect x={-98} y={-9} width={62} height={16} rx={4} fill={COLORS.BG} stroke={SOURCE_COLOR[entry.source]} strokeWidth={1} />
                    <text x={-67} y={3} textAnchor="middle" fontSize={7.5} fontFamily="monospace" fill={SOURCE_COLOR[entry.source]}>{entry.source}</text>
                    <text x={-28} y={4} fontSize={9} fontFamily="monospace" fill={COLORS.TEXT}>{entry.text}</text>
                  </g>
                )
              })}
              <IconCaption stationId="timeline" text={caption} />
            </g>

            {/* ── Stasiun 7: Rekonstruksi (Act 6, payoff) ── */}
            <g transform={`translate(${STATIONS.diagnosis.cx}, ${STATIONS.diagnosis.cy})`} opacity={stationOpacity.diagnosis}>
              <g transform="translate(-232, 0)"><Icon type="magnifier" size={26} color={COLORS.DIAGNOSIS} /></g>
              {DIAGNOSIS_STEPS.map((step, i) => {
                const active = diagnosisStep >= i
                const x = (i - 1) * 142
                const stepIcon = ['clock', 'route', 'check'][i]
                const stColor = active ? COLORS.DIAGNOSIS : COLORS.MUTED
                return (
                  <g key={step.id} transform={`translate(${x}, 0)`}>
                    <rect x={-68} y={-46} width={136} height={92} rx={10}
                      fill={COLORS.BG} stroke={active ? COLORS.DIAGNOSIS : COLORS.BORDER}
                      strokeWidth={active ? 2.2 : 1.5} opacity={active ? 1 : 0.5} />
                    <g opacity={active ? 1 : 0.6}>
                      <g transform="translate(-30, -30)"><Icon type={stepIcon} size={15} color={stColor} /></g>
                      <text x={-18} y={-26} fontSize={11} fontWeight={800} fontFamily="monospace" fill={stColor}>{step.label}</text>
                      {wrapText(step.statement, 20).map((ln, k) => (
                        <text key={k} x={0} y={-8 + k * 13} textAnchor="middle" fontSize={10} fontFamily="monospace" fill={COLORS.TEXT}>{ln}</text>
                      ))}
                      {wrapText(step.source, 24).map((ln, k) => (
                        <text key={k} x={0} y={22 + k * 11} textAnchor="middle" fontSize={9} fontFamily="monospace" fill={COLORS.MUTED}>{ln}</text>
                      ))}
                    </g>
                  </g>
                )
              })}
              <IconCaption stationId="diagnosis" text={caption} />
            </g>

            {/* ── Closing: dua stamp, di bawah Rekonstruksi ── */}
            <g opacity={closingOpacity} filter="url(#glow)">
              <Stamp x={STATIONS.diagnosis.cx - 110} y={CLOSING_Y} color={COLORS.WARN} top={CLOSING_STAMPS[0].top} sub={CLOSING_STAMPS[0].sub} icon="lock" rot={-6} />
              <Stamp x={STATIONS.diagnosis.cx + 110} y={CLOSING_Y} color={COLORS.DIAGNOSIS} top={CLOSING_STAMPS[1].top} sub={CLOSING_STAMPS[1].sub} icon="clock" rot={6} />
            </g>
          </ContentBodyV1>
        </g>
      )}
    </svg>
  )
}
